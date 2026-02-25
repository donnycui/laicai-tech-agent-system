import { getAllPosts } from '@/lib/posts'
import BlogTabs from './components/BlogTabs'
import BlogViewToggle from './components/BlogViewToggle'
import BlogGrid from './components/BlogGrid'
import BlogList from './components/BlogList'
import Navbar from '@/components/Navbar'

export default function BlogPage({
  searchParams,
}: {
  searchParams: { view?: string; category?: string }
}) {
  const view = searchParams.view === 'list' ? 'list' : 'grid'
  const category = searchParams.category || 'ai'

  const posts = getAllPosts().filter(
    (p) => p.category === category
  )

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <BlogTabs current={category} />
        <BlogViewToggle current={view} />

        {view === 'grid' ? (
          <BlogGrid posts={posts} />
        ) : (
          <BlogList posts={posts} />
        )}
      </main>
    </>
  )
}
