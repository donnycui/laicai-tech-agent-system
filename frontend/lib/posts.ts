import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') return [tags]
  return []
}

function normalizeImages(images: unknown): string[] {
  if (Array.isArray(images)) return images
  if (typeof images === 'string') return [images]
  return []
}

function normalizeVideo(video: unknown) {
  if (!video || typeof video !== 'object') return null
  const v = video as any
  return {
    platform: typeof v.platform === 'string' ? v.platform : '',
    id: typeof v.id === 'string' ? v.id : '',
    url: typeof v.url === 'string' ? v.url : '',
    cover: typeof v.cover === 'string' ? v.cover : '',
  }
}

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return []

  const fileNames = fs.readdirSync(postsDirectory)

  const posts = fileNames
    .filter((file) => file.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        category: data.category || 'ai',
        source: data.source || 'human',
        tags: normalizeTags(data.tags),
        cover: data.cover || null,
        summary: data.summary || '',
        images: normalizeImages(data.images),
        video: normalizeVideo((data as any).video),
        draft: data.draft === true,
        content,
      }
    })
    .filter((post) => !post.draft)

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    category: data.category || 'ai',
    source: data.source || 'human',
    tags: normalizeTags(data.tags),
    cover: data.cover || null,
    summary: data.summary || '',
    images: normalizeImages(data.images),
    video: normalizeVideo((data as any).video),
    draft: data.draft === true,
    content,
  }
}
