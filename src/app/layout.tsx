import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Linnea\'s blog ',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const header = (
    <header className='border-b px-2 lg:p-1 border-gray-200 h-12 mb-5 flex flex-row items-center justify-between'>
   <Link href='/' className='text-xl flex flex-row' >Linnea<p className='hidden md:block'>'s Blog 🍞</p></Link>
    <div className='flex flex-row text-lg space-x-10'>
   <Link href='/posts/dl' className='flex flex-row'>DL<p className='hidden md:block'>🤗</p></Link>
   <Link href='/posts/dev' className='flex flex-row'>Dev<p className='hidden md:block'>👩‍💻</p></Link>
   <Link href="/friend" className='flex flex-row'>Link<p className='hidden md:block'>🤝</p></Link>
    </div>
    </header>
  )

  const footer = (
    <footer className='h-10 mt-5 border-t p-1 border-gray-200 text-center text-sm text-slate-400'>
      Developed by Linnea 🥳
    </footer>
  )

  return (
    <html className='my-2 md:w-5/6 mx-auto font-sans '>
        {/* <body className={inter.className}> */}
        <body className='bg-white flex flex-col min-h-screen'>
        {header}
        <div className='flex-1'>
        {children}
        </div>
        {footer}
        </body>
    </html>
  )
}
