'use client'

import { ListTodo } from 'lucide-react'
import useSWR from 'swr'

interface Mission {
  id: string
  title: string
  status: 'queued' | 'approved' | 'in_progress' | 'executing' | 'completed'
  agent?: string
  progress?: number
  startTime?: string
  priority?: 'low' | 'medium' | 'high'
}

interface PipelineData {
  pipeline: {
    queued: number
    approved: number
    inProgress: number
    executing: number
    completed: number
  }
  activeMissions: Mission[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function MissionPipeline() {
  const { data, error, isLoading } = useSWR<PipelineData>('/api/missions', fetcher, {
    refreshInterval: 10000, // 10 秒刷新
    dedupingInterval: 5000
  })

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-32 mb-6" />
        <div className="h-32 bg-slate-200 rounded mb-6" />
        <div className="space-y-3">
          <div className="h-20 bg-slate-200 rounded" />
          <div className="h-20 bg-slate-200 rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <div className="text-center text-slate-600">加载失败</div>
      </div>
    )
  }

  const defaultData: PipelineData = {
    pipeline: { queued: 0, approved: 0, inProgress: 0, executing: 0, completed: 0 },
    activeMissions: []
  }

  const { pipeline, activeMissions } = data || defaultData
  const total = Object.values(pipeline).reduce((a, b) => a + b, 0)
  const progressPercent = total > 0 ? Math.round((pipeline.completed / total) * 100) : 0

  const stages = [
    { key: 'queued', label: '提案', count: pipeline.queued },
    { key: 'approved', label: '审批', count: pipeline.approved },
    { key: 'inProgress', label: '任务', count: pipeline.inProgress },
    { key: 'executing', label: '执行', count: pipeline.executing },
    { key: 'completed', label: '完成', count: pipeline.completed }
  ]

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary-600" />
          任务流水线
        </h2>
        <div className="text-sm text-slate-600">
          当前任务：<span className="font-medium text-slate-900">{pipeline.inProgress + pipeline.executing} 进行中</span>
          <span className="mx-2">|</span>
          配额使用：<span className="font-medium text-amber-600">🟡 {progressPercent}%</span>
        </div>
      </div>

      {/* 流水线可视化 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {stages.map((stage, index) => (
            <div key={stage.key} className="flex flex-col items-center flex-1">
              <div className={`h-3 w-3 rounded-full ${
                stage.count > 0 ? 'bg-primary-600' : 'bg-slate-300'
              }`} />
              {index < stages.length - 1 && (
                <div className="flex-1 h-0.5 bg-slate-200 w-full mx-2 relative">
                  {stage.count > 0 && (
                    <div className="absolute inset-0 bg-primary-600" style={{ width: '50%' }} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          {stages.map((stage) => (
            <div key={stage.key} className="flex flex-col items-center flex-1">
              <div className="text-xs text-slate-600 mb-1">{stage.label}</div>
              <div className="text-sm font-semibold text-slate-900">{stage.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 当前活动任务 */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          🔍 当前活动任务
        </h3>
        <div className="space-y-3">
          {activeMissions.slice(0, 3).map((mission) => (
            <div
              key={mission.id}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-primary-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-500">#{mission.id}</span>
                    {mission.priority === 'high' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">高优先级</span>
                    )}
                  </div>
                  <div className="font-medium text-slate-900">{mission.title}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div>
                  状态：<span className={`font-medium ${
                    mission.status === 'executing' ? 'text-blue-600' :
                    mission.status === 'approved' ? 'text-amber-600' :
                    'text-slate-900'
                  }`}>
                    {mission.status === 'executing' ? '执行中' :
                     mission.status === 'approved' ? '审批中' :
                     mission.status === 'in_progress' ? '进行中' :
                     mission.status === 'queued' ? '待处理' : '已完成'}
                  </span>
                </div>
                {mission.agent && (
                  <div>Agent: <span className="font-medium text-slate-900">{mission.agent}</span></div>
                )}
                {mission.progress !== undefined && (
                  <div>进度：<span className="font-medium text-slate-900">{mission.progress}%</span></div>
                )}
                {mission.startTime && (
                  <div>开始：<span className="font-medium text-slate-900">{mission.startTime}</span></div>
                )}
              </div>

              {/* 进度条 */}
              {mission.progress !== undefined && (
                <div className="mt-3 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-600 h-full rounded-full transition-all"
                    style={{ width: `${mission.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {activeMissions.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            暂无活动任务
          </div>
        )}

        <div className="mt-4 text-center">
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            查看更多任务 →
          </button>
        </div>
      </div>
    </div>
  )
}
