'use client'

import { Users } from 'lucide-react'

interface Agent {
  id: string
  name: string
  emoji: string
  role: string
  status: 'online' | 'busy' | 'offline' | 'idle'
  currentTasks: number
  completionRate: number
}

interface AgentGridProps {
  agents?: Agent[]
}

export default function AgentGrid({ agents }: AgentGridProps) {
  const defaultAgents: Agent[] = [
    { id: 'minion', name: 'Minion', emoji: '💼', role: '决策官', status: 'online', currentTasks: 2, completionRate: 95 },
    { id: 'sage', name: 'Sage', emoji: '📊', role: '战略家', status: 'online', currentTasks: 1, completionRate: 98 },
    { id: 'scout', name: 'Scout', emoji: '🔍', role: '侦察兵', status: 'online', currentTasks: 3, completionRate: 92 },
    { id: 'quill', name: 'Quill', emoji: '✍️', role: '创作者', status: 'online', currentTasks: 4, completionRate: 88 },
    { id: 'xalt', name: 'Xalt', emoji: '📱', role: '运营官', status: 'online', currentTasks: 2, completionRate: 91 },
    { id: 'observer', name: 'Observer', emoji: '🔎', role: '质检员', status: 'online', currentTasks: 0, completionRate: 99 },
  ]

  const data = agents || defaultAgents

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500'
      case 'busy': return 'bg-amber-500'
      case 'offline': return 'bg-slate-300'
      case 'idle': return 'bg-blue-400'
      default: return 'bg-slate-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return '在线'
      case 'busy': return '忙碌'
      case 'offline': return '离线'
      case 'idle': return '待机'
      default: return '未知'
    }
  }

  const onlineCount = data.filter(a => a.status === 'online' || a.status === 'busy').length

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-600" />
          Agent 团队状态
        </h2>
        <div className="text-sm text-slate-600">
          状态：<span className="text-emerald-600 font-medium">🟢 {onlineCount}/{data.length} 在线</span>
          <button className="ml-4 text-primary-600 hover:text-primary-700 font-medium">
            查看全部 →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{agent.emoji}</span>
                <div>
                  <div className="font-semibold text-slate-900">{agent.name}</div>
                  <div className="text-sm text-slate-600">{agent.role}</div>
                </div>
              </div>
              <div className={`h-3 w-3 rounded-full ${getStatusColor(agent.status)}`} title={getStatusText(agent.status)} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-600">
                当前任务：<span className="font-medium text-slate-900">{agent.currentTasks}</span>
              </div>
              <div className="text-slate-600">
                完成率：<span className="font-medium text-emerald-600">{agent.completionRate}%</span>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mt-3 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary-600 h-full rounded-full transition-all"
                style={{ width: `${agent.completionRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-4 text-sm text-slate-600">
        <span>图例：</span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> 在线
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> 忙碌
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-300" /> 离线
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-400" /> 待机
        </span>
      </div>
    </div>
  )
}
