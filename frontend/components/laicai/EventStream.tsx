'use client'

import { ScrollText, Filter, Download, Play, Pause } from 'lucide-react'
import { useState } from 'react'

interface Event {
  id: string
  type: 'task_completed' | 'new_proposal' | 'quota_warning' | 'agent_activity' | 'auto_approved'
  timestamp: string
  title: string
  description: string
  metadata?: {
    platform?: string
    agent?: string
    engagementRate?: number
    duration?: string
  }
}

interface EventStreamProps {
  events?: Event[]
}

export default function EventStream({ events }: EventStreamProps) {
  const [autoScroll, setAutoScroll] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  const defaultEvents: Event[] = [
    {
      id: 'evt_123',
      type: 'task_completed',
      timestamp: '14:32:15',
      title: '任务完成',
      description: '小红书发布 "保险配置指南"',
      metadata: { platform: 'xiaohongshu', engagementRate: 4.2, duration: '3 分 24 秒' }
    },
    {
      id: 'evt_122',
      type: 'new_proposal',
      timestamp: '14:30:42',
      title: '新提案',
      description: '视频号内容策划 - 高净值客户理财',
      metadata: { agent: 'Scout' }
    },
    {
      id: 'evt_121',
      type: 'quota_warning',
      timestamp: '14:28:10',
      title: '配额警告',
      description: '小红书今日配额剩余 30% (3/10)',
      metadata: {}
    },
    {
      id: 'evt_120',
      type: 'agent_activity',
      timestamp: '14:25:33',
      title: 'Agent 活动',
      description: 'Agent Scout 完成趋势分析',
      metadata: { agent: 'Scout' }
    },
    {
      id: 'evt_119',
      type: 'auto_approved',
      timestamp: '14:22:18',
      title: '自动审批',
      description: '日常内容创作任务 #1243',
      metadata: {}
    },
  ]

  const data = events || defaultEvents

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'task_completed': return '✅'
      case 'new_proposal': return '🆕'
      case 'quota_warning': return '⚠️'
      case 'agent_activity': return '🤖'
      case 'auto_approved': return '✅'
      default: return '📝'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'task_completed': return 'bg-emerald-100 text-emerald-700'
      case 'new_proposal': return 'bg-blue-100 text-blue-700'
      case 'quota_warning': return 'bg-amber-100 text-amber-700'
      case 'agent_activity': return 'bg-purple-100 text-purple-700'
      case 'auto_approved': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'task_completed': return '完成'
      case 'new_proposal': return '提案'
      case 'quota_warning': return '警告'
      case 'agent_activity': return '活动'
      case 'auto_approved': return '审批'
      default: return '其他'
    }
  }

  const filteredEvents = filter === 'all' 
    ? data 
    : data.filter(e => e.type === filter)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-primary-600" />
          系统事件日志
        </h2>
        <div className="flex items-center gap-2">
          {/* 过滤器 */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'all' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('task_completed')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'task_completed' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              完成
            </button>
            <button
              onClick={() => setFilter('quota_warning')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'quota_warning' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              警告
            </button>
          </div>

          {/* 自动滚动开关 */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-2 rounded-lg transition-colors ${
              autoScroll ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'
            }`}
            title={autoScroll ? '暂停自动滚动' : '启用自动滚动'}
          >
            {autoScroll ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          {/* 导出按钮 */}
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="导出日志">
            <Download className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 事件列表 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-primary-300 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              {/* 图标 */}
              <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">[{event.timestamp}]</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getEventColor(event.type)}`}>
                      {getEventTypeLabel(event.type)}
                    </span>
                  </div>
                </div>
                <div className="font-medium text-slate-900 mb-1">{event.title}</div>
                <div className="text-sm text-slate-600 mb-2">{event.description}</div>

                {/* 元数据 */}
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {event.metadata.agent && (
                      <span>Agent: <span className="font-medium text-slate-700">{event.metadata.agent}</span></span>
                    )}
                    {event.metadata.platform && (
                      <span>平台：<span className="font-medium text-slate-700">{event.metadata.platform}</span></span>
                    )}
                    {event.metadata.engagementRate && (
                      <span>互动率：<span className="font-medium text-emerald-600">{event.metadata.engagementRate}%</span></span>
                    )}
                    {event.metadata.duration && (
                      <span>耗时：<span className="font-medium text-slate-700">{event.metadata.duration}</span></span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部操作 */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
          加载更多
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            实时
          </span>
        </div>
      </div>
    </div>
  )
}
