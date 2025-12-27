'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ToastType = 'success' | 'error' | 'info' | 'system'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'system') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.5 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.8 }}
              className={`
                pointer-events-auto px-8 py-5 rounded-[2rem] border backdrop-blur-2xl shadow-2xl
                min-w-[300px] flex items-center gap-4 relative overflow-hidden
                ${toast.type === 'success' ? 'border-green-500/30 bg-green-500/10' : ''}
                ${toast.type === 'error' ? 'border-red-500/30 bg-red-500/10' : ''}
                ${toast.type === 'system' ? 'border-[#d67a9d]/30 bg-[#d67a9d]/10' : ''}
                ${toast.type === 'info' ? 'border-[#71b3c9]/30 bg-[#71b3c9]/10' : ''}
              `}
            >
              {/* Декоративный элемент в стиле vsgiga */}
              <div className={`w-1 h-8 rounded-full ${
                toast.type === 'success' ? 'bg-green-500' : 
                toast.type === 'error' ? 'bg-red-500' : 
                'bg-[#d67a9d]'
              }`} />
              
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">
                  {toast.type}_Update
                </p>
                <p className="text-xs font-bold uppercase italic tracking-tighter text-white">
                  {toast.message}
                </p>
              </div>

              {/* Анимированная полоска прогресса до исчезновения */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: "linear" }}
                className="absolute bottom-0 left-0 h-[2px] bg-white/20"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}