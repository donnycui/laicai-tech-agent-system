import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

/**
 * 统一规范 tags，确保永远是 string[]
 */
function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') return [tags]
  return []
}

/**
 * 统一规范 images，确保永远是 string[]
 */
function normalizeImages(images: unknown): string[] {
  if (Array.isArray(images)) return images
  if (typeof images === 'string') return [images]
  return []
}

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

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
        tags: normalizeTags(data.tags),
        cover: data.cover || null,
        summary: data.summary || '',
        images: normalizeImages(data.images),
        content,
      }
    })

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
    tags: normalizeTags(data.tags),
    cover: data.cover || null,
    summary: data.summary || '',
    images: normalizeImages(data.images),
    content,
  }
}
