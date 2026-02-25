import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Navbar from '@/components/Navbar'
import VideoPlayer from '@/components/VideoPlayer'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) return notFound()

  return (
    <>
      <Navbar />

      <main className="max-w-3xl mx-auto py-16 px-4">
        {/* 封面图 */}
        {post.cover && (
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}

        {/* 标题 */}
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

        <div className="flex items-center gap-3 mb-4">
          <p className="text-gray-500">{post.date}</p>

          {post.source === 'ai' && (
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
              AI 生成
            </span>
          )}
        </div>

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 🎬 视频模块（封面下 / 正文前） */}
        {post.video && <VideoPlayer video={post.video} />}

        {/* 正文 Markdown */}
        <article className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {/* 插图 */}
        {post.images.length > 0 && (
          <div className="mt-12 space-y-6">
            {post.images.map((img: string) => (
              <img
                key={img}
                src={img}
                alt=""
                className="w-full rounded-xl shadow"
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
