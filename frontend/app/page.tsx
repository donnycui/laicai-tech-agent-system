import EntryCard from '@/components/EntryCard'
import Image from 'next/image'

const entryPoints = [
  {
    href: '/blog',
    title: '心路',
    description: '这是我来时的路',
    imageUrl: undefined,
    color: 'blue' as const,
  },
  {
    href: '/jincai',
    title: '进财',
    description: '体验第一代 AI Agent 核心功能与智能对话能力',
    imageUrl: 'https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/misc/jincai.png',
    color: 'purple' as const,
  },
  {
    href: '/zhaocai',
    title: '招财',
    description: '探索下一代 AI Agent 的高级特性与扩展功能',
    imageUrl: 'https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/misc/zhaocai.png',
    color: 'emerald' as const,
  },
  {
    href: '/laicai',
    title: '来财',
    description: 'AI Agent 核心功能',
    imageUrl: 'https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/misc/laicai.png',
    color: 'amber' as const,
  },
]

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            {/* Logo */}
            <div className="flex flex-col items-center mb-4">
              <Image
                src="https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/logo/laicai_v2-1.png"
                alt="来财"
                width={180}
                height={180}
                className="mb-2"
              />
              <h1 className="text-6xl font-bold tracking-tight text-slate-900 mb-2" style={{ fontFamily: '"Ma Shan Zheng", cursive' }}>
                来财
              </h1>
              <p className="text-2xl text-primary-600 font-bold tracking-wide">
                Get Rich!
              </p>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
              敬请期待 - 即将发布
            </div>

            {/* Description */}
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              基于先进的大语言模型技术，为您提供智能化的解决方案。
              无论是内容创作、数据分析还是自动化流程，AI Agent 都能助您一臂之力。
            </p>
          </div>
        </div>

        {/* Entry Points Section */}
        <section className="py-8 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {entryPoints.map((entry) => (
                <EntryCard key={entry.href} {...entry} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-8 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                © 2026 laicai Agent. All rights reserved.
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
      </section>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 w-[1200px] h-[800px] opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-amber-100 blur-3xl"></div>
        </div>
      </div>
    </main>
  )
}