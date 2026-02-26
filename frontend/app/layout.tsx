import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '来财 - AI Agent 智能助手平台',
  description: '下一代 AI Agent 产品，为您提供智能化的解决方案',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}
