import Link from 'next/link'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'

interface EntryCardProps {
  href: string
  title: string
  description: string
  imageUrl?: string
  color: 'blue' | 'purple' | 'emerald' | 'amber'
}

const colorVariants = {
  blue: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    hoverBorder: 'hover:border-blue-300',
    hoverShadow: 'hover:shadow-blue-100',
  },
  purple: {
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-300',
    hoverShadow: 'hover:shadow-purple-100',
  },
  emerald: {
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-300',
    hoverShadow: 'hover:shadow-emerald-100',
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    hoverBorder: 'hover:border-amber-300',
    hoverShadow: 'hover:shadow-amber-100',
  },
}

export default function EntryCard({ href, title, description, imageUrl, color }: EntryCardProps) {
  const colors = colorVariants[color]

  return (
    <Link
      href={href}
      className={`group relative flex flex-col items-center p-6 bg-white border border-slate-200 rounded-2xl transition-all duration-200 ${colors.hoverBorder} hover:shadow-lg ${colors.hoverShadow}`}
    >
      {imageUrl ? (
        <div className="mb-4 w-20 h-20 relative">
          <Image
            src={imageUrl}
            alt={title}
            width={80}
            height={80}
            className="rounded-xl object-contain"
          />
        </div>
      ) : (
        <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-xl ${colors.iconBg}`}>
          <BookOpen className={`h-10 w-10 ${colors.iconColor}`} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 text-center">{description}</p>
    </Link>
  )
}