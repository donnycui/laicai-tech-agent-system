import fs from 'fs'
import path from 'path'

const OUT_DIR = path.join(process.cwd(), 'content', 'blog')

function pad(n) {
  return String(n).padStart(2, '0')
}

function todayCN() {
  const d = new Date()
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  return `${y}-${m}-${day}`
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^a-z0-9\-]+/g, '')
    .replace(/\-+/g, '-')
    .replace(/^\-|\-$/g, '')
}

async function callLLM() {
  // ✅ 你只需要把这里替换成你自己的模型网关/供应商
  // 约定：返回“完整 Markdown（含 frontmatter）”
  const prompt = `
你是内容编辑。请输出一篇“视频摘要型”博客文章，必须返回完整 Markdown，且 frontmatter 字段必须包含：
title,date,category,source,draft,tags,summary,cover,video(platform,id,url,cover)

要求：
- category 只能是 ai 或 insurance
- source 固定为 ai
- draft 固定为 true（这是草稿，必须手动审核后才能发布）
- tags 必须是数组
- 正文包含：关键结论/适合谁看/行动清单 三个小节
- 语言：中文

重要：必须在 frontmatter 中包含 draft: true，否则可能被误发布！
`

  // 示例：从环境变量拿到你自己的接口
  const endpoint = process.env.LLM_ENDPOINT
  const apiKey = process.env.LLM_API_KEY

  if (!endpoint || !apiKey) {
    throw new Error('Missing LLM_ENDPOINT or LLM_API_KEY')
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
    }),
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(`LLM request failed: ${res.status} ${t}`)
  }

  const data = await res.json()

  // 你可以按你的网关返回结构调整这里
  const markdown = data.markdown || data.content || data.text
  if (!markdown || typeof markdown !== 'string') {
    throw new Error('LLM response missing markdown string')
  }

  return markdown.trim()
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  const md = await callLLM()

  // 从 frontmatter 里粗略取 title 作为文件名（兜底）
  const titleMatch = md.match(/^\s*title:\s*["']?(.+?)["']?\s*$/m)
  const title = titleMatch ? titleMatch[1] : `ai-post-${todayCN()}`
  const slug = slugify(title) || `ai-post-${todayCN()}`

  const filename = `${todayCN()}-${slug}.md`
  const outPath = path.join(OUT_DIR, filename)

  // 避免重复生成同名文件
  if (fs.existsSync(outPath)) {
    console.log(`Skip: ${filename} already exists`)
    return
  }

  // 兜底校验：确保 draft: true 必须存在，即使模型犯错也不会误发布
  let finalMd = md
  if (!finalMd.includes('draft:')) {
    finalMd = finalMd.replace(
      /source:\s*ai/,
      'source: ai\ndraft: true'
    )
    console.log('⚠️  Auto-added: draft: true (missing in LLM output)')
  }

  fs.writeFileSync(outPath, finalMd + '\n', 'utf8')
  console.log(`✅ Generated: ${path.relative(process.cwd(), outPath)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
