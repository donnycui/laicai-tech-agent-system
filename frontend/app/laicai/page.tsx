'use client'

import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { DashboardStats, AgentGrid, MissionPipeline, QuotaGauge, EventStream } from '@/components/laicai'

export default function LaicaiStage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3">
              <Image
                src="https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/misc/laicai.png"
                alt="来财"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">来财 Stage</h1>
                <p className="text-slate-600">AI Agent 多智能体监控仪表盘</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* 系统概览 */}
          <DashboardStats />

          {/* Agent 状态 + 任务流水线 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AgentGrid />
            <MissionPipeline />
          </div>

          {/* 配额监控 */}
          <QuotaGauge />

          {/* 事件日志 */}
          <EventStream />
        </div>
      </main>
    </>
  )
}
