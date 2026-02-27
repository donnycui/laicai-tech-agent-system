-- ============================================
-- 来财 Stage 监控仪表盘 - Supabase 数据库脚本
-- 第 3 版：先检查字段是否存在
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

-- 2. 检查并创建 daily_usage 表（新表，不会冲突）
CREATE TABLE IF NOT EXISTS daily_usage (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  platform TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  quota_limit INTEGER NOT NULL,
  reset_at TIMESTAMPTZ DEFAULT (CURRENT_DATE + INTERVAL '1 day'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, platform)
);

-- 3. 检查并创建 ops_metrics 表（新表，不会冲突）
CREATE TABLE IF NOT EXISTS ops_metrics (
  id BIGSERIAL PRIMARY KEY,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 检查 ops_policies 表结构并适配
DO $$ BEGIN
  -- 检查 ops_policies 表是否存在
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ops_policies') THEN
    -- 检查是否有 config_key 字段（你的表可能用这个字段名）
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ops_policies' AND column_name = 'key') THEN
      -- 尝试添加 key 字段
      ALTER TABLE ops_policies ADD COLUMN IF NOT EXISTS key TEXT;
    END IF;
    
    -- 检查是否有 config_value 字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ops_policies' AND column_name = 'value') THEN
      ALTER TABLE ops_policies ADD COLUMN IF NOT EXISTS value JSONB;
    END IF;
    
    -- 检查是否有 description 字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ops_policies' AND column_name = 'description') THEN
      ALTER TABLE ops_policies ADD COLUMN IF NOT EXISTS description TEXT;
    END IF;
  ELSE
    -- 表不存在，创建新表
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

-- 5. 检查 events 表结构
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'events') THEN
    -- 检查是否有 type 字段（可能叫 event_type）
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'type') THEN
      -- 如果有 event_type 字段，创建视图或同义词
      -- 或者我们直接使用 event_type
      NULL; -- 暂时不处理，稍后查询时用 event_type
    END IF;
  END IF;
END $$;

-- 6. 插入配额配置（使用 ON CONFLICT 避免重复）
-- 先检查字段是否存在
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ops_policies' 
    AND column_name IN ('key', 'value', 'description')
  ) THEN
    INSERT INTO ops_policies (key, value, description) VALUES
      ('xiaohongshu_daily_quota', '{"limit": 10}', '小红书每日发布上限'),
      ('video_daily_quota', '{"limit": 10}', '视频号每日发布上限'),
      ('douyin_daily_quota', '{"limit": 12}', '抖音每日发布上限'),
      ('wechat_daily_quota', '{"limit": 5}', '公众号每日发布上限'),
      ('zhihu_daily_quota', '{"limit": 8}', '知乎每日发布上限'),
      ('bilibili_daily_quota', '{"limit": 10}', 'B 站每日发布上限'),
      ('content_creation_daily_quota', '{"limit": 20}', '内容创作每日上限')
    ON CONFLICT (key) DO NOTHING;
  END IF;
END $$;

-- ============================================
-- 索引优化（使用 IF NOT EXISTS）
-- ============================================

CREATE INDEX IF NOT EXISTS idx_steps_status ON steps(status);
CREATE INDEX IF NOT EXISTS idx_steps_agent ON steps(agent_id);
CREATE INDEX IF NOT EXISTS idx_steps_created ON steps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC);
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
-- 插入测试数据
-- ============================================

-- 插入一些测试事件（检查 type 字段是否存在）
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'type') THEN
    INSERT INTO events (type, payload, importance) VALUES
      ('task_completed', '{"title": "小红书发布测试", "platform": "xiaohongshu", "engagementRate": 4.2}', 7),
      ('new_proposal', '{"title": "视频号内容策划", "agent": "Scout"}', 6),
      ('agent_activity', '{"agent": "Scout", "action": "完成趋势分析"}', 5),
      ('auto_approved', '{"title": "日常内容创作", "rule": "high_reliability"}', 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

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
