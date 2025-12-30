'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error'

interface Toast {
  id: string
  message: string
  type: ToastType
}

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${toastId++}`
    setToasts(prev => [...prev, { id, message, type }])
    
    // Автоматическое удаление через 4 секунды
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }

  const success = (message: string) => showToast(message, 'success')
  const error = (message: string) => showToast(message, 'error')

  return { toasts, success, error }
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="relative"
          >
            <div className={`
              rounded-xl p-4 shadow-2xl border backdrop-blur-xl
              ${toast.type === 'success' 
                ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30' 
                : 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-500/30'
              }
            `}>
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${toast.type === 'success' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                  }
                `}>
                  {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{toast.message}</p>
                </div>
              </div>
              <div className={`
                absolute bottom-0 left-0 h-0.5 rounded-full
                ${toast.type === 'success' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-500 to-orange-500'
                }
              `}>
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 4, ease: "linear" }}
                  className="h-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}