import Link from 'next/link'

export default function BlogViewToggle({ current }: { current: string }) {
  return (
    <div className="flex justify-end mb-6 gap-2">
      <Link
        href="?view=grid"
        className={current === 'grid' ? 'font-bold' : 'text-gray-400'}
      >
        方块
      </Link>
      <Link
        href="?view=list"
        className={current === 'list' ? 'font-bold' : 'text-gray-400'}
      >
        列表
      </Link>
    </div>
  )
}
