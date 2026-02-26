'use client'

import { Activity, FileText, CheckCircle, Clock } from 'lucide-react'

interface DashboardStatsProps {
  stats?: {
    status: 'online' | 'offline' | 'warning'
    pendingTasks: number
    successRate: number
    avgResponseTime: number
    lastUpdate?: string
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const defaultStats = {
    status: 'online' as const,
    pendingTasks: 12,
    successRate: 84,
    avgResponseTime: 2.3,
    lastUpdate: new Date().toISOString()
  }

  const data = stats || defaultStats

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-emerald-600 bg-emerald-100'
      case 'warning': return 'text-amber-600 bg-amber-100'
      case 'offline': return 'text-red-600 bg-red-100'
      default: return 'text-slate-600 bg-slate-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return '运行中'
      case 'warning': return '警告'
      case 'offline': return '离线'
      default: return '未知'
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary-600" />
          系统运行状态
        </h2>
        <div className="text-sm text-slate-500">
          更新时间：{new Date(data.lastUpdate!).toLocaleTimeString('zh-CN')}
          <button className="ml-2 text-primary-600 hover:text-primary-700 font-medium">
            刷新
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 系统状态 */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${getStatusColor(data.status)} mb-3`}>
            {data.status === 'online' ? (
              <CheckCircle className="h-6 w-6" />
            ) : data.status === 'warning' ? (
              <Activity className="h-6 w-6" />
            ) : (
              <Clock className="h-6 w-6" />
            )}
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {getStatusText(data.status)}
          </div>
          <div className="text-sm text-slate-600">系统状态</div>
        </div>

        {/* 待处理任务 */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-3">
            <FileText className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {data.pendingTasks}
          </div>
          <div className="text-sm text-slate-600">待处理任务</div>
        </div>

        {/* 成功率 */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 mb-3">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {data.successRate}%
          </div>
          <div className="text-sm text-slate-600">成功率</div>
        </div>

        {/* 平均响应时间 */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 mb-3">
            <Clock className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {data.avgResponseTime}s
          </div>
          <div className="text-sm text-slate-600">平均响应</div>
        </div>
      </div>
    </div>
  )
}
