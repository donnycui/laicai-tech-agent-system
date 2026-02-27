'use client'

import { Gauge, Settings } from 'lucide-react'
import useSWR from 'swr'

interface Quota {
  platform: string
  name: string
  used: number
  limit: number
  resetTime?: string
  status: 'normal' | 'warning' | 'critical'
}

interface QuotaData {
  contentQuota?: {
    used: number
    limit: number
    resetTime?: string
  }
  platformQuotas?: Quota[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function QuotaGauge() {
  const { data, error, isLoading } = useSWR<QuotaData>('/api/quotas', fetcher, {
    refreshInterval: 60000, // 60 秒刷新（节省额度）
    dedupingInterval: 5000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  })

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-32 mb-6" />
        <div className="h-24 bg-slate-200 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded" />
          ))}
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

  const defaultContentQuota = {
    used: 12,
    limit: 20,
    resetTime: '4 小时 23 分'
  }

  const defaultPlatformQuotas: Quota[] = [
    { platform: 'xiaohongshu', name: '小红书', used: 8, limit: 10, status: 'warning' },
    { platform: 'video', name: '视频号', used: 4, limit: 10, status: 'normal' },
    { platform: 'douyin', name: '抖音', used: 5, limit: 12, status: 'normal' },
    { platform: 'wechat', name: '公众号', used: 2, limit: 5, status: 'normal' },
    { platform: 'zhihu', name: '知乎', used: 1, limit: 8, status: 'normal' },
    { platform: 'bilibili', name: 'B 站', used: 3, limit: 10, status: 'normal' },
  ]

  const content = data?.contentQuota || defaultContentQuota
  const platforms = data?.platformQuotas || defaultPlatformQuotas

  const contentPercent = Math.round((content.used / content.limit) * 100)
  const contentStatus = contentPercent >= 90 ? 'critical' : contentPercent >= 70 ? 'warning' : 'normal'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600'
      case 'warning': return 'text-amber-600'
      case 'normal': return 'text-emerald-600'
      default: return 'text-slate-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return '🔴'
      case 'warning': return '🟡'
      case 'normal': return '🟢'
      default: return '⚪'
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary-600" />
          配额使用情况 (Cap Gates)
        </h2>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="设置">
          <Settings className="h-5 w-5 text-slate-600" />
        </button>
      </div>

      {/* 内容创作配额 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">内容创作配额</h3>
          <span className={`text-sm font-medium ${getStatusColor(contentStatus)}`}>
            {getStatusIcon(contentStatus)} {contentStatus === 'normal' ? '正常' : contentStatus === 'warning' ? '紧张' : '危险'}
          </span>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          {/* 进度条 */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                {content.used} / {content.limit} ({contentPercent}%)
              </span>
              <span className="text-sm text-slate-600">
                重置时间：{content.resetTime}
              </span>
            </div>
            <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  contentStatus === 'critical' ? 'bg-red-500' :
                  contentStatus === 'warning' ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${contentPercent}%` }}
              />
            </div>
          </div>

          {/* 状态信息 */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-slate-600">
              剩余：<span className="font-medium text-slate-900">{content.limit - content.used}</span>
            </div>
            <div className="text-slate-600">
              状态：<span className={`font-medium ${getStatusColor(contentStatus)}`}>
                {getStatusIcon(contentStatus)} {contentStatus === 'normal' ? '正常' : contentStatus === 'warning' ? '紧张' : '危险'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 平台发布配额 */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">平台发布配额</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((quota) => {
            const percent = Math.round((quota.used / quota.limit) * 100)
            const status = percent >= 90 ? 'critical' : percent >= 70 ? 'warning' : 'normal'
            
            return (
              <div
                key={quota.platform}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{quota.name}</span>
                  <span className={`text-xs font-medium ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </span>
                </div>
                
                {/* 进度条 */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>{quota.used}/{quota.limit}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status === 'critical' ? 'bg-red-500' :
                        status === 'warning' ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className={`text-xs font-medium ${getStatusColor(status)}`}>
                  {status === 'normal' ? '🟢 充足' : status === 'warning' ? '🟡 紧张' : '🔴 危险'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 警告信息 */}
      {platforms.some(q => {
        const percent = (q.used / q.limit) * 100
        return percent >= 80
      }) && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="font-medium text-amber-900 mb-1">配额警告</div>
              <div className="text-sm text-amber-800">
                部分平台配额即将耗尽，建议调整发布计划。
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
