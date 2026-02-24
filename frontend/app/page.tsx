import Navbar from '@/components/Navbar'
import EntryCard from '@/components/EntryCard'
import { BookOpen, Zap, Rocket } from 'lucide-react'

const entryPoints = [
  {
    href: '/blog',
    title: 'Blog',
    description: '探索 AI Agent 的最新动态、技术文章和行业洞察',
    icon: BookOpen,
    color: 'blue' as const,
  },
  {
    href: '/stage-a',
    title: 'Stage A',
    description: '体验第一代 AI Agent 核心功能与智能对话能力',
    icon: Zap,
    color: 'purple' as const,
  },
  {
    href: '/stage-b',
    title: 'Stage B',
    description: '探索下一代 AI Agent 的高级特性与扩展功能',
    icon: Rocket,
    color: 'emerald' as const,
  },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                全新版本发布
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
                下一代 <span className="text-primary-600">AI Agent</span>
                <br />
                智能助手平台
              </h1>

              {/* Description */}
              <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                基于先进的大语言模型技术，为您提供智能化的解决方案。
                无论是内容创作、数据分析还是自动化流程，AI Agent 都能助您一臂之力。
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <a
                  href="/stage-a"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                >
                  开始使用
                </a>
                <a
                  href="/blog"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  了解更多
                </a>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-emerald-100 blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Entry Points Section */}
        <section className="py-20 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">快速入口</h2>
              <p className="text-slate-600">选择您想要探索的功能模块</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {entryPoints.map((entry) => (
                <EntryCard key={entry.href} {...entry} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                © 2024 AI Agent. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  隐私政策
                </a>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  服务条款
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
