import Navbar from '@/components/Navbar'
import { Sparkles, MessageSquare, Heart } from 'lucide-react'
import Image from 'next/image'

export default function LaicaiPage() {
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
                <h1 className="text-3xl font-bold text-slate-900">来财</h1>
                <p className="text-slate-600">AI Agent 核心功能</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 mb-4">
                <Sparkles className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">智能助手</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                基于先进大语言模型，为您提供智能化的对话和问题解决能力。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 mb-4">
                <MessageSquare className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">自然交互</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                支持多轮对话，理解上下文，提供流畅自然的交互体验。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 mb-4">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">贴心服务</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                个性化定制，根据您的需求提供专属的服务和建议。
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="max-w-2xl mx-auto text-center">
                <Image
                  src="https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/misc/laicai.png"
                  alt="来财"
                  width={80}
                  height={80}
                  className="mx-auto mb-6 rounded-2xl"
                />
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  来财功能区域
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  这里是来财的核心功能区域，更多精彩功能即将上线。
                  敬请期待！
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
                      <p className="text-sm">你好，来财！</p>
                    </div>
                  </div>
                  {/* AI Response Placeholder */}
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-md max-w-md shadow-sm">
                      <p className="text-sm text-slate-600">
                        你好！我是来财，很高兴为你服务。有什么我可以帮助你的吗？
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