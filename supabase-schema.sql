-- ============================================
-- 来财 Stage 监控仪表盘 - Supabase 数据库脚本
-- ============================================

-- 1. Agents 表（Agent 状态）
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

-- 插入默认 Agent 数据
INSERT INTO agents (id, name, emoji, role, status, current_tasks, completion_rate) VALUES
  ('minion', 'Minion', '💼', '决策官', 'online', 2, 95),
  ('sage', 'Sage', '📊', '战略家', 'online', 1, 98),
  ('scout', 'Scout', '🔍', '侦察兵', 'online', 3, 92),
  ('quill', 'Quill', '✍️', '创作者', 'online', 4, 88),
  ('xalt', 'Xalt', '📱', '运营官', 'online', 2, 91),
  ('observer', 'Observer', '🔎', '质检员', 'online', 0, 99)
ON CONFLICT (id) DO NOTHING;

-- 2. Proposals 表（提案）
CREATE TABLE IF NOT EXISTS proposals (
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

-- 3. Missions 表（任务）
CREATE TABLE IF NOT EXISTS missions (
  id BIGSERIAL PRIMARY KEY,
  proposal_id BIGINT REFERENCES proposals(id),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'in_progress', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 4. Steps 表（执行步骤）
CREATE TABLE IF NOT EXISTS steps (
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

-- 5. Events 表（系统事件）
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  source_type TEXT,
  source_id BIGINT,
  payload JSONB DEFAULT '{}',
  importance INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Ops Policies 表（运营策略/配额配置）
CREATE TABLE IF NOT EXISTS ops_policies (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入配额配置
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

-- 7. Daily Usage 表（每日使用统计）
CREATE TABLE IF NOT EXISTS daily_usage (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  platform TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  limit INTEGER NOT NULL,
  reset_at TIMESTAMPTZ DEFAULT (CURRENT_DATE + INTERVAL '1 day'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, platform)
);

-- 8. Triggers 表（触发器配置）
CREATE TABLE IF NOT EXISTS triggers (
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

-- 9. Ops Metrics 表（运营指标）
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
  limit INTEGER,
  remaining INTEGER,
  reset_at TIMESTAMPTZ
) AS $$
DECLARE
  today DATE := CURRENT_DATE;
  usage_record RECORD;
BEGIN
  SELECT INTO usage_record
    du.usage_count,
    op.value->>'limit' AS limit_val,
    du.reset_at
  FROM daily_usage du
  JOIN ops_policies op ON op.key = (platform || '_daily_quota')
  WHERE du.date = today AND du.platform = platform;
  
  IF usage_record IS NULL THEN
    -- 没有记录，返回默认值
    SELECT INTO usage_record
      0 AS usage_count,
      (op.value->>'limit')::INTEGER AS limit_val,
      (CURRENT_DATE + INTERVAL '1 day') AS reset_at
    FROM ops_policies op
    WHERE op.key = (platform || '_daily_quota');
  END IF;
  
  used := usage_record.usage_count;
  limit := usage_record.limit_val;
  remaining := GREATEST(0, limit - used);
  reset_at := usage_record.reset_at;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 函数：增加平台使用计数
-- ============================================

CREATE OR REPLACE FUNCTION increment_platform_usage(platform TEXT, count INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_usage (date, platform, usage_count, limit)
  VALUES (CURRENT_DATE, platform, count, 
    (SELECT (value->>'limit')::INTEGER FROM ops_policies WHERE key = (platform || '_daily_quota'))
  )
  ON CONFLICT (date, platform) DO UPDATE
  SET usage_count = daily_usage.usage_count + count,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS (Row Level Security) 策略
-- ============================================

-- 启用 RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops_metrics ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许 authenticated 用户读取所有数据
CREATE POLICY "Allow authenticated read access" ON agents FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Allow authenticated read access" ON proposals FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Allow authenticated read access" ON missions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Allow authenticated read access" ON steps FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Allow authenticated read access" ON events FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Allow authenticated read access" ON ops_policies FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Allow authenticated read access" ON daily_usage FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Allow authenticated read access" ON triggers FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Allow authenticated read access" ON ops_metrics FOR SELECT TO authenticated USING (TRUE);

-- 创建策略：允许 service_role 完全访问
CREATE POLICY "Allow service_role full access" ON agents TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access" ON proposals TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access" ON missions TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access" ON steps TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access" ON events TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access" ON ops_policies TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access" ON daily_usage TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access" ON triggers TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access" ON ops_metrics TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ============================================
-- Realtime 频道配置（用于前端实时订阅）
-- ============================================

-- 启用 Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE steps;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE missions;
ALTER PUBLICATION supabase_realtime ADD TABLE agents;
ALTER PUBLICATION supabase_realtime ADD TABLE daily_usage;

-- ============================================
-- 完成提示
-- ============================================

-- 执行完成后，在 Netlify 配置环境变量：
-- NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
-- SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
