import Link from 'next/link'

export default function BlogGrid({ posts }: { posts: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="border rounded-xl overflow-hidden hover:shadow"
        >
          {post.cover && (
            <img
              src={post.cover}
              alt={post.title}
              className="h-40 w-full object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              {post.title}
              {post.source === 'ai' && (
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  AI 生成
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500">{post.summary}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
