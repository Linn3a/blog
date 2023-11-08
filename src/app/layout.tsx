import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Linnea\'s blog',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const header = (
    <header className='border-b-2 p-1 border-gray-200 h-12 mb-5 flex flex-row items-center justify-between'>
   <Link href='/' className='text-xl'>Linnea's Blog ✍️</Link>
    <div className='flex flex-row text-lg space-x-4'>
   <Link href='/posts/dl'>深度学习🤗</Link>
   <Link href='/posts/dev'>开发👩‍💻</Link>
   <Link href="/friend">友链😚</Link>
    </div>
    </header>
  )

  const footer = (
    <footer className='h-10 mt-5 border-t-2 p-1 border-gray-200 text-center text-sm text-slate-400'>
      Developed by Linnea 🥳
    </footer>
  )

  return (
    <html className='my-2 md:w-5/6 mx-auto '>
        {/* <body className={inter.className}> */}
        <body className='bg-stone-50 flex flex-col min-h-screen'>
        {header}
        <div className='flex-1'>
        {children}
        </div>
        {footer}
        </body>
    </html>
  )
}
