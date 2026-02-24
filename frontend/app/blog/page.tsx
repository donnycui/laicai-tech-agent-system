import Navbar from '@/components/Navbar'
import { BookOpen, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回首页
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Blog</h1>
            <p className="mt-2 text-slate-600">探索 AI Agent 的最新动态与技术文章</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Placeholder Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <article
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-slate-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <Clock className="h-4 w-4" />
                    <span>即将发布</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    文章标题占位符 {i}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    这里是文章的简短描述，介绍文章的主要内容和亮点。敬请期待更多精彩内容。
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">内容筹备中</p>
                <p className="text-sm text-slate-500">更多精彩文章即将上线，敬请期待</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
