import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Метаданные остаются здесь (это серверная часть)
export const metadata = {
  title: 'Профиль пользователя',
  description: 'Персональный кабинет с интерактивными эффектами',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased`}>
        {/* Контент приложения */}
        {children}

        {/* Toaster из react-hot-toast сам по себе является клиентским компонентом, 
            поэтому его можно рендерить внутри серверного Layout без 'use client' наверху файла.
        */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}