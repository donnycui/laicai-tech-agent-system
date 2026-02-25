import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import Navbar from '@/components/Navbar'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50">
        <div className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-slate-900">Blog</h1>
            <p className="mt-2 text-slate-600">探索 AI Agent 的最新动态与技术文章</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.cover && (
                <img
                  src={post.cover}
                  alt={post.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  {post.title}
                </h2>

                <p className="text-sm text-slate-500 mb-3">{post.date}</p>

                {post.summary && (
                  <p className="text-slate-600 text-sm mb-4">{post.summary}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
