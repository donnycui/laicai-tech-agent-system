-- ============================================
-- 来财 Stage 监控仪表盘 - Supabase 数据库脚本
-- 修复版：适配现有表结构
-- ============================================

-- 1. Agents 表（如果不存在则创建）
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'busy', 'offline', 'idle')),
  current_tasks INTEGER DEFAULT 0,
  completion_rate INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认 Agent 数据（如果不存在）
INSERT INTO agents (id, name, emoji, role, status, current_tasks, completion_rate) VALUES
  ('minion', 'Minion', '💼', '决策官', 'online', 2, 95),
  ('sage', 'Sage', '📊', '战略家', 'online', 1, 98),
  ('scout', 'Scout', '🔍', '侦察兵', 'online', 3, 92),
  ('quill', 'Quill', '✍️', '创作者', 'online', 4, 88),
  ('xalt', 'Xalt', '📱', '运营官', 'online', 2, 91),
  ('observer', 'Observer', '🔎', '质检员', 'online', 0, 99)
ON CONFLICT (id) DO NOTHING;

-- 2. 检查 proposals 表是否存在，不存在则创建
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'proposals') THEN
    CREATE TABLE proposals (
      id BIGSERIAL PRIMARY KEY,
      agent_id TEXT REFERENCES agents(id),
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'auto_approved')),
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
      auto_approved BOOLEAN DEFAULT FALSE,
      proposed_steps JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- 3. 检查 missions 表是否存在
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'missions') THEN
    CREATE TABLE missions (
      id BIGSERIAL PRIMARY KEY,
      proposal_id BIGINT REFERENCES proposals(id),
      title TEXT NOT NULL,
      status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'in_progress', 'completed', 'failed')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    );
  END IF;
END $$;

-- 4. 检查 steps 表是否存在
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'steps') THEN
    CREATE TABLE steps (
      id BIGSERIAL PRIMARY KEY,
      mission_id BIGINT REFERENCES missions(id),
      agent_id TEXT REFERENCES agents(id),
      action TEXT NOT NULL,
      status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'approved', 'in_progress', 'executing', 'completed', 'failed')),
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
      progress INTEGER DEFAULT 0,
      params JSONB DEFAULT '{}',
      result JSONB,
      worker_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      claimed_at TIMESTAMPTZ
    );
  END IF;
END $$;

-- 5. 检查 events 表是否存在
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'events') THEN
    CREATE TABLE events (
      id BIGSERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      source_type TEXT,
      source_id BIGINT,
      payload JSONB DEFAULT '{}',
      importance INTEGER DEFAULT 5,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- 6. 检查 ops_policies 表是否存在
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ops_policies') THEN
    CREATE TABLE ops_policies (
      id BIGSERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value JSONB NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- 插入配额配置（如果不存在）
INSERT INTO ops_policies (key, value, description) VALUES
  ('xiaohongshu_daily_quota', '{"limit": 10}', '小红书每日发布上限'),
  ('video_daily_quota', '{"limit": 10}', '视频号每日发布上限'),
  ('douyin_daily_quota', '{"limit": 12}', '抖音每日发布上限'),
  ('wechat_daily_quota', '{"limit": 5}', '公众号每日发布上限'),
  ('zhihu_daily_quota', '{"limit": 8}', '知乎每日发布上限'),
  ('bilibili_daily_quota', '{"limit": 10}', 'B 站每日发布上限'),
  ('content_creation_daily_quota', '{"limit": 20}', '内容创作每日上限'),
  ('daily_proposal_limit', '{"limit": 100}', '每日提案上限'),
  ('max_concurrent_missions', '{"limit": 20}', '最大并发任务数')
ON CONFLICT (key) DO NOTHING;

-- 7. Daily Usage 表（每日使用统计）- 修复 limit 关键字问题
CREATE TABLE IF NOT EXISTS daily_usage (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  platform TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  quota_limit INTEGER NOT NULL,  -- 改名避免和关键字冲突
  reset_at TIMESTAMPTZ DEFAULT (CURRENT_DATE + INTERVAL '1 day'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, platform)
);

-- 8. 检查 triggers 表是否存在
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'triggers') THEN
    CREATE TABLE triggers (
      id BIGSERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      event_type TEXT NOT NULL,
      condition JSONB DEFAULT '{}',
      action_template JSONB DEFAULT '{}',
      cooldown_minutes INTEGER DEFAULT 30,
      last_triggered TIMESTAMPTZ,
      trigger_count INTEGER DEFAULT 0,
      enabled BOOLEAN DEFAULT TRUE,
      priority INTEGER DEFAULT 5,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- 9. Ops Metrics 表
CREATE TABLE IF NOT EXISTS ops_metrics (
  id BIGSERIAL PRIMARY KEY,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 索引优化
-- ============================================

CREATE INDEX IF NOT EXISTS idx_steps_status ON steps(status);
CREATE INDEX IF NOT EXISTS idx_steps_agent ON steps(agent_id);
CREATE INDEX IF NOT EXISTS idx_steps_created ON steps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_daily_usage_date ON daily_usage(date);
CREATE INDEX IF NOT EXISTS idx_daily_usage_platform ON daily_usage(platform);

-- ============================================
-- 函数：恢复卡住的任务
-- ============================================

CREATE OR REPLACE FUNCTION recover_stale_steps(max_age_minutes INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  recovered_count INTEGER;
BEGIN
  UPDATE steps
  SET status = 'queued',
      worker_id = NULL,
      claimed_at = NULL,
      updated_at = NOW()
  WHERE status IN ('in_progress', 'executing')
    AND (claimed_at < NOW() - (max_age_minutes || ' minutes')::INTERVAL
         OR (claimed_at IS NULL AND updated_at < NOW() - (max_age_minutes || ' minutes')::INTERVAL));
  
  GET DIAGNOSTICS recovered_count = ROW_COUNT;
  RETURN recovered_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 函数：获取今日配额使用情况
-- ============================================

CREATE OR REPLACE FUNCTION get_daily_quota_usage(platform TEXT)
RETURNS TABLE (
  used INTEGER,
  quota_limit INTEGER,
  remaining INTEGER,
  reset_at TIMESTAMPTZ
) AS $$
DECLARE
  today DATE := CURRENT_DATE;
  usage_record RECORD;
BEGIN
  SELECT INTO usage_record
    du.usage_count,
    du.quota_limit,
    du.reset_at
  FROM daily_usage du
  WHERE du.date = today AND du.platform = platform;
  
  IF usage_record IS NULL THEN
    -- 没有记录，从 ops_policies 获取默认值
    SELECT INTO usage_record
      0 AS usage_count,
      (op.value->>'limit')::INTEGER AS quota_limit,
      (CURRENT_DATE + INTERVAL '1 day') AS reset_at
    FROM ops_policies op
    WHERE op.key = (platform || '_daily_quota');
  END IF;
  
  used := usage_record.usage_count;
  quota_limit := usage_record.quota_limit;
  remaining := GREATEST(0, quota_limit - used);
  reset_at := usage_record.reset_at;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 函数：增加平台使用计数
-- ============================================

CREATE OR REPLACE FUNCTION increment_platform_usage(platform TEXT, count INTEGER DEFAULT 1)
RETURNS VOID AS $$
DECLARE
  quota_limit_val INTEGER;
BEGIN
  -- 获取配额限制
  SELECT (value->>'limit')::INTEGER INTO quota_limit_val
  FROM ops_policies 
  WHERE key = (platform || '_daily_quota');
  
  IF quota_limit_val IS NULL THEN
    quota_limit_val := 10; -- 默认值
  END IF;
  
  INSERT INTO daily_usage (date, platform, usage_count, quota_limit)
  VALUES (CURRENT_DATE, platform, count, quota_limit_val)
  ON CONFLICT (date, platform) DO UPDATE
  SET usage_count = daily_usage.usage_count + count,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 插入测试数据（可选）
-- ============================================

-- 插入一些测试事件
INSERT INTO events (type, payload, importance) VALUES
  ('task_completed', '{"title": "小红书发布测试", "platform": "xiaohongshu", "engagementRate": 4.2}', 7),
  ('new_proposal', '{"title": "视频号内容策划", "agent": "Scout"}', 6),
  ('agent_activity', '{"agent": "Scout", "action": "完成趋势分析"}', 5),
  ('auto_approved', '{"title": "日常内容创作", "rule": "high_reliability"}', 5)
ON CONFLICT DO NOTHING;

-- 插入一些测试步骤
INSERT INTO steps (agent_id, action, status, priority, progress) VALUES
  ('xalt', 'publish_content', 'executing', 'medium', 60),
  ('quill', 'write_article', 'in_progress', 'high', 30),
  ('scout', 'analyze_trends', 'queued', 'low', 0)
ON CONFLICT DO NOTHING;

-- ============================================
-- 完成提示
-- ============================================

-- 执行完成后，在 Netlify 配置环境变量：
-- NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
-- SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
