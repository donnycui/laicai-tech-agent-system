import Link from 'next/link'
import { LucideIcon, ArrowRight } from 'lucide-react'

interface EntryCardProps {
  href: string
  title: string
  description: string
  icon: LucideIcon
  color: 'blue' | 'purple' | 'emerald'
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
}

export default function EntryCard({ href, title, description, icon: Icon, color }: EntryCardProps) {
  const colors = colorVariants[color]

  return (
    <Link
      href={href}
      className={`group relative flex flex-col p-6 bg-white border border-slate-200 rounded-2xl transition-all duration-200 ${colors.hoverBorder} hover:shadow-lg ${colors.hoverShadow}`}
    >
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg}`}>
        <Icon className={`h-6 w-6 ${colors.iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4 flex-grow">{description}</p>
      <div className="flex items-center text-sm font-medium text-slate-900 group-hover:text-primary-600 transition-colors">
        进入页面
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
