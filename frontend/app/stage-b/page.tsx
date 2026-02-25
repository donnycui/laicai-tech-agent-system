import Navbar from '@/components/Navbar'
import { ArrowLeft, Wand2, Workflow, Layers, Rocket } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function StageBPage() {
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
            <div className="flex items-center gap-3">
              <Image
                src="https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/misc/zhaocai.png"
                alt="招财"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">招财</h1>
                <p className="text-slate-600">AI Agent 高级功能预览</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 mb-4">
                <Wand2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">智能创作</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                更强大的内容生成能力，支持代码、文案、报告等多种创作场景。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 mb-4">
                <Workflow className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">自动化流程</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                自定义工作流程，让 AI Agent 自动完成复杂的任务序列。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 mb-4">
                <Layers className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">插件生态</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                丰富的插件系统，扩展 AI Agent 的能力边界，连接更多服务。
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100 overflow-hidden">
            <div className="p-8 lg:p-16">
              <div className="max-w-2xl mx-auto text-center">
                <Image
                  src="https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/misc/zhaocai.png"
                  alt="招财"
                  width={80}
                  height={80}
                  className="mx-auto mb-6 rounded-2xl"
                />
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  招财预览区域
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  这是 AI Agent 下一代功能的预览页面。Stage B 将带来更强大的智能创作能力、
                  自动化工作流程以及丰富的插件生态系统，让 AI Agent 成为您真正的智能助手。
                </p>

                {/* Feature List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                  <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0 mt-0.5">
                      <span className="text-xs text-emerald-600">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">多模态交互</p>
                      <p className="text-xs text-slate-500">支持文本、图片、语音等多种输入方式</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0 mt-0.5">
                      <span className="text-xs text-emerald-600">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">自定义 Agent</p>
                      <p className="text-xs text-slate-500">创建专属于您的个性化 AI 助手</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0 mt-0.5">
                      <span className="text-xs text-emerald-600">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">团队协作</p>
                      <p className="text-xs text-slate-500">支持多人共享和协同工作</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0 mt-0.5">
                      <span className="text-xs text-emerald-600">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">API 接入</p>
                      <p className="text-xs text-slate-500">通过 API 将 AI 能力集成到您的应用</p>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm text-slate-600 shadow-sm">
                  <Rocket className="h-4 w-4 text-emerald-600" />
                  <span>即将推出，敬请期待</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
