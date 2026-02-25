import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Navbar from '@/components/Navbar'

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
      <div className="max-w-3xl mx-auto py-16 px-4">
        {post.cover && (
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-4">{post.date}</p>

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

        <article className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

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
      </div>
    </>
  )
}
