import Navbar from '@/components/Navbar'
import { Bot, ArrowLeft, Sparkles, MessageSquare, Brain } from 'lucide-react'
import Link from 'next/link'

export default function StageAPage() {
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Stage A</h1>
                <p className="text-slate-600">AI Agent 第一阶段功能演示</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">智能对话</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                基于大语言模型的自然语言交互，理解您的需求并提供精准回复。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">上下文理解</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                保持对话连贯性，记住之前的交流内容，提供更个性化的服务。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 mb-4">
                <Brain className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">知识库</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                整合多领域知识，从科技到人文，为您提供全面的信息支持。
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100 mx-auto mb-6">
                  <Bot className="h-10 w-10 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Stage A 演示区域
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  这是 AI Agent 第一阶段的演示页面。在这里，您可以体验到基础的智能对话功能，
                  包括自然语言理解、上下文记忆和知识问答等核心能力。
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                  <Sparkles className="h-4 w-4" />
                  <span>功能开发中，敬请期待</span>
                </div>
              </div>
            </div>

            {/* Placeholder Chat Interface */}
            <div className="border-t border-slate-200 bg-slate-50/50 p-6">
              <div className="max-w-3xl mx-auto">
                <div className="space-y-4">
                  {/* User Message Placeholder */}
                  <div className="flex justify-end">
                    <div className="bg-primary-600 text-white px-4 py-3 rounded-2xl rounded-br-md max-w-md">
                      <p className="text-sm">你好，请介绍一下你自己</p>
                    </div>
                  </div>
                  {/* AI Response Placeholder */}
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-md max-w-md shadow-sm">
                      <p className="text-sm text-slate-600">
                        你好！我是 AI Agent，一个基于先进大语言模型技术的智能助手。
                        我可以帮助你解答问题、创作内容、分析数据等。有什么我可以帮你的吗？
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input Placeholder */}
                <div className="mt-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="输入消息..."
                    disabled
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-400 disabled:bg-slate-100"
                  />
                  <button
                    disabled
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
