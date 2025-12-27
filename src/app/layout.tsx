import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext' // Добавили импорт

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-black">
        <ToastProvider> {/* Оборачиваем всё в уведомления */}
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}