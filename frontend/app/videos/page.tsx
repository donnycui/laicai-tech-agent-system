import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function VideosPage() {
  const posts = getAllPosts().filter((p) => p.video)

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">视频</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="border rounded-xl overflow-hidden hover:shadow">
              {post.video?.cover ? (
                <img src={post.video.cover} alt={post.title} className="w-full aspect-video object-cover" />
              ) : post.cover ? (
                <img src={post.cover} alt={post.title} className="w-full aspect-video object-cover" />
              ) : (
                <div className="w-full aspect-video bg-slate-100" />
              )}

              <div className="p-4">
                <div className="text-xs text-slate-500 mb-2">
                  {post.video?.platform || 'video'}
                </div>
                <div className="font-semibold">{post.title}</div>
                {post.summary ? <div className="text-sm text-slate-600 mt-1">{post.summary}</div> : null}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
