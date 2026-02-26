# 🚀 来财 Stage 部署文档

## 📋 部署清单

### 1. Supabase 配置

#### 1.1 执行数据库脚本

在 Supabase SQL Editor 中执行：
```bash
# 复制 supabase-schema.sql 的全部内容
# 在 Supabase Dashboard → SQL Editor → New Query
# 粘贴并运行
```

**脚本会创建**:
- ✅ `agents` - Agent 状态表
- ✅ `proposals` - 提案表
- ✅ `missions` - 任务表
- ✅ `steps` - 执行步骤表
- ✅ `events` - 系统事件表
- ✅ `ops_policies` - 配额配置表
- ✅ `daily_usage` - 每日使用统计表
- ✅ `triggers` - 触发器配置表
- ✅ `ops_metrics` - 运营指标表
- ✅ 索引优化
- ✅ 函数（恢复任务、配额统计）
- ✅ RLS 安全策略
- ✅ Realtime 配置

#### 1.2 获取 Supabase 凭证

在 Supabase Dashboard:
1. 进入 **Settings** → **API**
2. 复制：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

---

### 2. Netlify 配置

#### 2.1 配置环境变量

访问：https://app.netlify.com/sites/YOUR_SITE/settings/deploys#environment

添加以下变量：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 可选：站点配置
NEXT_PUBLIC_SITE_URL=https://laicai.tech
```

#### 2.2 重新部署

1. 进入 **Deploys** 标签
2. 点击 **Trigger deploy** → **Clear cache and deploy site**
3. 等待部署完成（约 1-2 分钟）

---

### 3. 验证部署

#### 3.1 访问页面

```
https://laicai.tech/laicai
```

#### 3.2 检查数据

- ✅ 系统概览显示真实数据
- ✅ Agent 状态显示 6 个 Agent
- ✅ 任务流水线显示当前任务
- ✅ 配额监控显示使用情况
- ✅ 事件日志显示最近事件

#### 3.3 浏览器控制台

打开浏览器 DevTools → Console，检查是否有错误。

---

## 🔧 故障排查

### 问题 1: 页面显示"加载失败"

**原因**: Supabase 环境变量未配置

**解决**:
```bash
# 检查 Netlify 环境变量是否正确配置
# 重新部署
```

### 问题 2: 数据库表不存在

**原因**: 未执行 SQL 脚本

**解决**:
```bash
# 在 Supabase SQL Editor 执行 supabase-schema.sql
```

### 问题 3: CORS 错误

**原因**: Supabase 未配置允许的域名

**解决**:
1. Supabase Dashboard → Authentication → URL Configuration
2. 添加 `https://laicai.tech` 到 Site URL 和 Redirect URLs

---

## 📊 数据流说明

```
┌─────────────┐
│   Browser   │
│   (Next.js) │
└──────┬──────┘
       │
       │ 5-30s 轮询
       ▼
┌─────────────┐
│  API Routes │
│  /api/*     │
└──────┬──────┘
       │
       │ Supabase Client
       ▼
┌─────────────┐
│  Supabase   │
│  PostgreSQL │
└─────────────┘
```

**刷新频率**:
- DashboardStats: 10 秒
- AgentGrid: 15 秒
- MissionPipeline: 10 秒
- QuotaGauge: 30 秒
- EventStream: 5 秒

---

## 🚀 后续优化

### Phase 1: Realtime 实时订阅（可选）

将轮询改为 Supabase Realtime：

```typescript
// 订阅 steps 表变化
supabase
  .channel('steps')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'steps' 
  }, (payload) => {
    mutate('/api/missions')
  })
  .subscribe()
```

### Phase 2: Worker 执行层

部署 Worker 脚本到 VPS：

```bash
# VPS crontab
*/5 * * * * curl -s https://laicai.tech/api/ops/heartbeat
```

### Phase 3: 自动发布

集成各平台 API：
- 小红书
- 视频号
- 抖音
- 公众号
- 知乎
- B 站

---

## 📝 维护说明

### 清理过期数据

```sql
-- 删除 30 天前的事件
DELETE FROM events WHERE created_at < NOW() - INTERVAL '30 days';

-- 删除 7 天前的每日使用记录
DELETE FROM daily_usage WHERE date < CURRENT_DATE - INTERVAL '7 days';
```

### 重置配额

```sql
-- 手动重置某平台配额
UPDATE daily_usage 
SET usage_count = 0 
WHERE date = CURRENT_DATE AND platform = 'xiaohongshu';
```

### 查看配额使用

```sql
-- 查看今日各平台使用情况
SELECT platform, usage_count, limit, 
       (limit - usage_count) as remaining
FROM daily_usage 
WHERE date = CURRENT_DATE;
```

---

## 🎯 完成标志

- [x] UI 组件开发完成
- [x] API 路由实现
- [x] Supabase 数据接入
- [x] 数据库脚本准备
- [ ] **待完成**: Supabase SQL 执行
- [ ] **待完成**: Netlify 环境变量配置
- [ ] **待完成**: 部署验证

---

## 📞 需要老板协助的事项

### ⚠️ 必须处理（无法自动化）

1. **执行 Supabase SQL 脚本**
   - 文件：`supabase-schema.sql`
   - 位置：Supabase Dashboard → SQL Editor
   - 操作：复制全部内容 → 粘贴 → 运行

2. **配置 Netlify 环境变量**
   - 位置：Netlify Dashboard → Site settings → Environment variables
   - 变量：
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`

3. **触发 Netlify 重新部署**
   - 位置：Netlify Dashboard → Deploys
   - 操作：Trigger deploy → Clear cache and deploy site

### ✅ 已完成（自动处理）

- [x] UI 组件开发（5 个核心组件）
- [x] API 路由（5 个接口）
- [x] Supabase 数据查询函数
- [x] 数据库脚本（包含所有表 + 索引 + 函数 + RLS）
- [x] 配额查询逻辑完善
- [x] 代码提交并推送到 GitHub

---

老板，你只需要做 **3 件事**：

1. **在 Supabase 执行 SQL 脚本** (`supabase-schema.sql`)
2. **在 Netlify 配置 2 个环境变量** (SUPABASE_URL + SERVICE_ROLE_KEY)
3. **触发 Netlify 重新部署**

搞定后访问 `https://laicai.tech/laicai` 就能看到完整的监控仪表盘了！ 🎉
