import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
// ДОБАВЛЯЕМ ИМПОРТЫ ТВОИХ КОНТЕКСТОВ
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'

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
    <html lang="ru" className="h-full">
      <body className={`${inter.className} antialiased bg-black min-h-full`}>
        {/* ОБЕРТКА ВСЕГО САЙТА В ПРОВАЙДЕРЫ */}
        <ToastProvider>
          <CartProvider>
            <Navbar />
            <div className="min-h-screen">
              {children}
            </div>
            <Footer />
            
            {/* Твой Toaster */}
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
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}