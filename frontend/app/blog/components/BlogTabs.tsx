import Link from 'next/link'

export default function BlogTabs({ current }: { current: string }) {
  const tabs = [
    { key: 'ai', label: 'AI & Agent' },
    { key: 'insurance', label: '保险与行业' },
  ]

  return (
    <div className="flex gap-4 mb-6">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={`/blog?category=${tab.key}`}
          className={`px-4 py-2 rounded-full text-sm ${
            current === tab.key
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
