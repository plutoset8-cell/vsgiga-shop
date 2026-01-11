'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy } from 'lucide-react'

interface PaymentModalProps {
  show: boolean
  onClose: () => void
  paymentCode: string
  frozenPrice: number
  isOrdering: boolean
  onConfirm: () => void
  showToast: (message: string, type: 'error' | 'success') => void
}

export default function PaymentModal({
  show,
  onClose,
  paymentCode,
  frozenPrice,
  isOrdering,
  onConfirm,
  showToast
}: PaymentModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Блокируем скролл при открытии модалки
    if (show) {
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [show])

  // Создаем портал только на клиенте
  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Бэкдроп с размытием */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-[3rem] shadow-[0_0_100px_rgba(255,0,122,0.3)] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#ff007a]/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-white font-black uppercase tracking-[0.3em] italic text-xl">Оплата</h3>
                <p className="text-white/30 text-[9px] uppercase font-bold tracking-widest mt-1 italic text-left">
                  Перевод по реквизитам
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/50 hover:text-white border border-white/5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              {/* СУММА К ОПЛАТЕ */}
              <div className="bg-white/5 border border-white/5 p-5 rounded-[2rem] text-center">
                <p className="text-[10px] font-black text-white/30 uppercase mb-1 tracking-widest text-center">
                  Сумма к оплате
                </p>
                <p className="text-4xl font-black text-[#ff007a] italic">
                  {frozenPrice.toLocaleString()} ₽
                </p>
              </div>

              {/* КОД ДЛЯ КОММЕНТАРИЯ */}
              <div className="relative group text-center">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ff007a] to-[#d67a9d] rounded-[2.5rem] blur opacity-20" />
                <div className="relative bg-black border border-white/10 p-6 rounded-[2.5rem]">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#ff007a] mb-2 text-center">
                    КОД В КОММЕНТАРИЙ
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-5xl font-black italic text-white tracking-tighter">
                      #{paymentCode}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(paymentCode)
                        showToast('КОД_СКОПИРОВАН', 'success')
                      }}
                      className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white/40 hover:text-[#ff007a] transition-all"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* РЕКВИЗИТЫ */}
              <div className="space-y-3">
                <div className="p-5 bg-white/5 border border-white/5 rounded-[2rem] text-left relative group">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">
                    Номер телефона / СБП
                  </p>
                  <div className="flex justify-between items-center text-left">
                    <p className="text-white font-bold text-lg tracking-wider">79278552324</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('79278552324')
                        showToast('НОМЕР_СКОПИРОВАН', 'success')
                      }}
                    >
                      <Copy size={14} className="text-white/20 hover:text-white" />
                    </button>
                  </div>
                  <p className="text-[8px] text-white/30 font-bold uppercase mt-1 tracking-widest text-left">
                    Банк: Любой (СБП)
                  </p>
                </div>
              </div>

              <div className="bg-[#ff007a]/10 border border-[#ff007a]/20 p-4 rounded-2xl text-[8px] font-black uppercase tracking-wider text-[#ff007a] leading-relaxed text-center">
                ОБЯЗАТЕЛЬНО УКАЖИТЕ КОД #{paymentCode} В КОММЕНТАРИИ. <br />
                БЕЗ КОДА ПЛАТЕЖ МОЖЕТ ПОТЕРЯТЬСЯ.
              </div>

              {/* КНОПКА "Я ОПЛАТИЛ" */}
              <button
                onClick={onConfirm}
                disabled={isOrdering}
                className="w-full py-8 bg-white text-black hover:bg-[#ff007a] hover:text-white rounded-[2rem] font-black uppercase italic tracking-[0.4em] text-[10px] transition-all shadow-xl disabled:opacity-50"
              >
                {isOrdering ? 'СИНХРОНИЗАЦИЯ...' : 'Я ОПЛАТИЛ'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body // Рендерим напрямую в body, минуя все контексты
  )
}