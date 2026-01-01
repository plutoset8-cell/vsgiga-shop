import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VSGIGA SHOP',
  description: 'Персональный кабинет с интерактивными эффектами',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="h-full"> {/* ДОБАВИТЬ h-full */}
      <body className={`${inter.className} antialiased bg-black min-h-full`}> {/* ИЗМЕНИТЬ bg-black на min-h-full */}
        {/* Возвращаем шапку сайта */}
        <Navbar />

        {/* Контент страницы */}
        <div className="min-h-screen"> {/* ОБЕРНУТЬ в div с min-h-screen */}
          {children}
        </div>

        {/* Возвращаем подвал сайта */}
        <Footer />

        {/* Твой Toaster со всеми сохраненными стилями */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              background: 'rgba(0, 0, 0, 0.85)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}