import { createClient } from '@supabase/supabase-js'

// 创建一个Supabase客户端工厂函数，在需要时才初始化
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_LAICAI_SUPABASE_URL
  const supabaseServiceKey = process.env.LAICAI_SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_LAICAI_SUPABASE_URL is required.')
  }
  if (!supabaseServiceKey) {
    throw new Error('LAICAI_SUPABASE_SERVICE_ROLE_KEY is required.')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// 获取系统概览数据
export async function getDashboardStats() {
  try {
    const supabase = getSupabaseClient();

    // 获取待处理任务数
    const { count: pendingCount } = await supabase
      .from('steps')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'queued')

    // 获取成功率（已完成 / 总任务数）
    const { count: totalCount } = await supabase
      .from('steps')
      .select('*', { count: 'exact', head: true })

    const { count: completedCount } = await supabase
      .from('steps')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    const successRate = totalCount && totalCount > 0
      ? Math.round((completedCount! / totalCount) * 100)
      : 0

    // 获取系统状态（检查最近是否有活动）
    const { data: recentEvents } = await supabase
      .from('events')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)

    const lastActivity = recentEvents?.[0]?.created_at
    const now = new Date()
    const lastActivityTime = lastActivity ? new Date(lastActivity) : null
    const minutesSinceActivity = lastActivityTime
      ? Math.floor((now.getTime() - lastActivityTime.getTime()) / 60000)
      : 999

    let status: 'online' | 'warning' | 'offline' = 'online'
    if (minutesSinceActivity > 60) status = 'warning'
    if (minutesSinceActivity > 120) status = 'offline'

    return {
      status,
      pendingTasks: pendingCount || 0,
      successRate,
      avgResponseTime: 2.3, // TODO: 从事件数据计算
      lastUpdate: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      status: 'offline' as const,
      pendingTasks: 0,
      successRate: 0,
      avgResponseTime: 0,
      lastUpdate: new Date().toISOString()
    }
  }
}

// 获取 Agent 状态
export async function getAgentStats() {
  try {
    // TODO: 如果有 agents 表，从这里获取
    // 目前返回默认数据
    return [
      { id: 'minion', name: 'Minion', emoji: '💼', role: '决策官', status: 'online' as const, currentTasks: 2, completionRate: 95 },
      { id: 'sage', name: 'Sage', emoji: '📊', role: '战略家', status: 'online' as const, currentTasks: 1, completionRate: 98 },
      { id: 'scout', name: 'Scout', emoji: '🔍', role: '侦察兵', status: 'online' as const, currentTasks: 3, completionRate: 92 },
      { id: 'quill', name: 'Quill', emoji: '✍️', role: '创作者', status: 'online' as const, currentTasks: 4, completionRate: 88 },
      { id: 'xalt', name: 'Xalt', emoji: '📱', role: '运营官', status: 'online' as const, currentTasks: 2, completionRate: 91 },
      { id: 'observer', name: 'Observer', emoji: '🔎', role: '质检员', status: 'online' as const, currentTasks: 0, completionRate: 99 },
    ]
  } catch (error) {
    console.error('Error fetching agent stats:', error)
    return []
  }
}

// 获取任务流水线数据
export async function getMissionPipeline() {
  try {
    const supabase = getSupabaseClient();

    const { data: steps } = await supabase
      .from('steps')
      .select('status')

    const pipeline = {
      queued: 0,
      approved: 0,
      inProgress: 0,
      executing: 0,
      completed: 0
    }

    if (steps) {
      steps.forEach(step => {
        switch (step.status) {
          case 'queued': pipeline.queued++; break;
          case 'approved': pipeline.approved++; break;
          case 'in_progress': pipeline.inProgress++; break;
          case 'executing': pipeline.executing++; break;
          case 'completed': pipeline.completed++; break;
        }
      })
    }

    // 获取活动任务
    const { data: activeMissions } = await supabase
      .from('steps')
      .select(`
        id,
        title,
        status,
        agent_id,
        progress,
        started_at,
        priority
      `)
      .in('status', ['in_progress', 'executing', 'approved'])
      .order('created_at', { ascending: false })
      .limit(5)

    return {
      pipeline,
      activeMissions: activeMissions?.map(m => ({
        id: String(m.id),
        title: m.title || '未命名任务',
        status: m.status as any,
        agent: m.agent_id || undefined,
        progress: m.progress || 0,
        startTime: m.started_at ? new Date(m.started_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : undefined,
        priority: m.priority as any || 'medium'
      })) || []
    }
  } catch (error) {
    console.error('Error fetching mission pipeline:', error)
    return {
      pipeline: { queued: 0, approved: 0, inProgress: 0, executing: 0, completed: 0 },
      activeMissions: []
    }
  }
}

// 获取配额数据
export async function getQuotas() {
  try {
    const supabase = getSupabaseClient();

    // 从 daily_usage 表获取今日使用情况
    const today = new Date().toISOString().split('T')[0]

    const { data: usageData } = await supabase
      .from('daily_usage')
      .select('platform, usage_count, limit, reset_at')
      .eq('date', today)

    // 从 ops_policies 获取配额限制
    const { data: policies } = await supabase
      .from('ops_policies')
      .select('key, value')
      .in('key', [
        'xiaohongshu_daily_quota',
        'video_daily_quota',
        'douyin_daily_quota',
        'wechat_daily_quota',
        'zhihu_daily_quota',
        'bilibili_daily_quota',
        'content_creation_daily_quota'
      ])

    const platformMap: Record<string, { name: string, key: string }> = {
      'xiaohongshu': { name: '小红书', key: 'xiaohongshu_daily_quota' },
      'video': { name: '视频号', key: 'video_daily_quota' },
      'douyin': { name: '抖音', key: 'douyin_daily_quota' },
      'wechat': { name: '公众号', key: 'wechat_daily_quota' },
      'zhihu': { name: '知乎', key: 'zhihu_daily_quota' },
      'bilibili': { name: 'B 站', key: 'bilibili_daily_quota' }
    }

    // 构建平台配额数据
    const platformQuotas = Object.entries(platformMap).map(([platform, info]) => {
      const usage = usageData?.find(u => u.platform === platform)
      const policy = policies?.find(p => p.key === info.key)

      const used = usage?.usage_count || 0
      const limit = usage?.limit || (policy?.value?.limit as number) || 10
      const percent = Math.round((used / limit) * 100)
      const status = percent >= 90 ? 'critical' : percent >= 70 ? 'warning' : 'normal' as const

      return {
        platform,
        name: info.name,
        used,
        limit,
        status
      }
    })

    // 内容创作配额（所有平台的总和）
    const totalUsed = platformQuotas.reduce((sum, q) => sum + q.used, 0)
    const totalLimit = platformQuotas.reduce((sum, q) => sum + q.limit, 0)
    const contentPercent = Math.round((totalUsed / totalLimit) * 100)

    // 计算重置时间
    const resetTime = usageData?.[0]?.reset_at
      ? (() => {
          const reset = new Date(usageData[0].reset_at)
          const now = new Date()
          const diff = reset.getTime() - now.getTime()
          const hours = Math.floor(diff / 3600000)
          const minutes = Math.floor((diff % 3600000) / 60000)
          return `${hours}小时${minutes}分`
        })()
      : '4 小时'

    return {
      contentQuota: {
        used: totalUsed,
        limit: totalLimit,
        resetTime
      },
      platformQuotas
    }
  } catch (error) {
    console.error('Error fetching quotas:', error)
    return {
      contentQuota: { used: 0, limit: 0 },
      platformQuotas: []
    }
  }
}

// 获取事件日志
export async function getEvents(limit = 20) {
  try {
    const supabase = getSupabaseClient();

    const { data: events } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    return events?.map(e => ({
      id: String(e.id),
      type: mapEventType(e.type),
      timestamp: new Date(e.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: e.type.replace(/_/g, ' '),
      description: e.payload?.title || e.payload?.description || '',
      metadata: e.payload || {}
    })) || []
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

function mapEventType(type: string): any {
  if (type.includes('completed')) return 'task_completed'
  if (type.includes('proposal')) return 'new_proposal'
  if (type.includes('quota') || type.includes('warning')) return 'quota_warning'
  if (type.includes('agent')) return 'agent_activity'
  if (type.includes('approved')) return 'auto_approved'
  return 'task_completed'
}
