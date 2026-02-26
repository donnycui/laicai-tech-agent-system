import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 获取系统概览数据
export async function getDashboardStats() {
  try {
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
    // 从 ops_policies 表获取配额配置
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

    // TODO: 需要查询今日已使用数量
    // 这里先返回默认数据
    return {
      contentQuota: {
        used: 12,
        limit: 20,
        resetTime: '4 小时 23 分'
      },
      platformQuotas: [
        { platform: 'xiaohongshu', name: '小红书', used: 8, limit: 10, status: 'warning' as const },
        { platform: 'video', name: '视频号', used: 4, limit: 10, status: 'normal' as const },
        { platform: 'douyin', name: '抖音', used: 5, limit: 12, status: 'normal' as const },
        { platform: 'wechat', name: '公众号', used: 2, limit: 5, status: 'normal' as const },
        { platform: 'zhihu', name: '知乎', used: 1, limit: 8, status: 'normal' as const },
        { platform: 'bilibili', name: 'B 站', used: 3, limit: 10, status: 'normal' as const },
      ]
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
