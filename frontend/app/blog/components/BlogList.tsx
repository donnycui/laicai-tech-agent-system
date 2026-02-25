import Link from 'next/link'

export default function BlogList({ posts }: { posts: any[] }) {
  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-lg font-semibold">{post.title}</h3>
          </Link>
          <p className="text-sm text-gray-500">{post.date}</p>
          <p className="text-gray-600 mt-1">{post.summary}</p>
        </li>
      ))}
    </ul>
  )
}
