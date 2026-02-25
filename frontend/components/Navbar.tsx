'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '心路' },
  { href: '/stage-a', label: '进财' },
  { href: '/stage-b', label: '招财' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/gallery" className="flex items-center gap-2 hover:scale-110 transition-transform duration-200 ease-in-out">
          <img
            src="https://ycjiordnqwgdnwnafzdt.supabase.co/storage/v1/object/public/assets/logo/getrich-logo.png"
            alt="来财Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold text-primary-600">来财</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
