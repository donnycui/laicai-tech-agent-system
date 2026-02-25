import { getAllPosts } from '@/lib/posts'
import Navbar from '@/components/Navbar'
import BlogTabs from './components/BlogTabs'
import BlogGrid from './components/BlogGrid'

export default function BlogPage() {
  // ✅ 静态默认分类
  const category = 'ai'

  const posts = getAllPosts().filter(
    (p) => p.category === category
  )

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* 分类 Tab（静态） */}
        <BlogTabs current={category} />

        {/* 默认 Grid 视图 */}
        <BlogGrid posts={posts} />
      </main>
    </>
  )
}
