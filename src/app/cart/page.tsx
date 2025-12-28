'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  ShoppingCart, ShieldCheck, AlertCircle, CheckCircle2, X,
  Truck, Package, Coins, User, Phone, Ticket, Zap,
  Activity, Lock, Layers, Star, ZapIcon
} from 'lucide-react'

// ======================================================================
// УПРОЩЕННЫЕ КОМПОНЕНТЫ (без тяжелой анимации)
// ======================================================================

const Toast = ({ message, type, onClose }: { message: string, type: 'error' | 'success', onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 100, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    className={`fixed top-12 right-12 z-[100] flex items-center gap-6 p-7 min-w-[400px] rounded-[2.5rem] border backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] ${type === 'error' ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-[#ff007a]/20 border-[#ff007a]/40 text-[#ff007a]'
      }`}
  >
    <div className="shrink-0 p-3 bg-white/5 rounded-2xl">
      {type === 'error' ? <AlertCircle size={28} /> : <Zap size={28} className="animate-bounce" />}
    </div>
    <div className="flex-1">
      <p className="font-black uppercase italic text-[11px] tracking-[0.3em] mb-1">SYSTEM_ALGORITHM</p>
      <p className="text-[14px] font-bold text-white uppercase tracking-tight">{message}</p>
    </div>
    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
      <X size={20} className="opacity-40" />
    </button>
  </motion.div>
)

// ======================================================================
// ОСНОВНОЙ КОМПОНЕНТ КОРЗИНЫ
// ======================================================================

export default function CartPage() {
  const [dbCart, setDbCart] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)
  const [showCheckoutFields, setShowCheckoutFields] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState<'mail' | 'pickup'>('mail')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [userBonuses, setUserBonuses] = useState(0)
  const [useBonuses, setUseBonuses] = useState(false)
  const [toasts, setToasts] = useState<{ id: number, message: string, type: 'error' | 'success' }[]>([])
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<any>(null)
  const router = useRouter()
  const { clearCart: contextClearCart } = useCart()

  const addToast = useCallback((message: string, type: 'error' | 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000)
  }, [])

  // Загрузка данных корзины
  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      try {
        const { data: cartData, error: cartError } = await supabase
          .from('cart')
          .select('*, product:products(*)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (cartError) throw cartError

        if (cartData) {
          const formattedCart = cartData
            .filter((item: any) => item.product !== null)
            .map((item: any) => ({
              ...item.product,
              quantity: item.quantity,
              cartItemId: item.id
            }))
          setDbCart(formattedCart)
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('bonuses')
          .eq('id', session.user.id)
          .single()

        if (profile) setUserBonuses(profile.bonuses || 0)

      } catch (error) {
        addToast('ОШИБКА ЗАГРУЗКИ КОРЗИНЫ', 'error')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartData()
  }, [router, addToast])

  // Расчеты
  const totalItems = dbCart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalPrice = dbCart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
  const spendAmount = useBonuses ? Math.min(userBonuses, Math.floor(totalPrice * 0.3)) : 0
  const promoDiscount = appliedPromo ? Number(appliedPromo.discount) || 0 : 0
  const finalPrice = Math.max(0, totalPrice - spendAmount - promoDiscount)

  // Функции корзины
  const handleUpdateQuantity = async (id: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta
    if (newQty < 1) return

    setDbCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item))

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('cart')
        .update({ quantity: newQty })
        .match({ user_id: user.id, product_id: id })
    }
  }

  const handleRemoveFromCart = async (id: string) => {
    setDbCart(prev => prev.filter(item => item.id !== id))
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('cart').delete().match({ user_id: user.id, product_id: id })
      addToast('ТОВАР УДАЛЕН', 'success')
    }
  }

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      addToast('ВВЕДИТЕ ПРОМОКОД', 'error')
      return
    }
    
    // Симуляция проверки промокода
    if (promoInput.toUpperCase() === 'VSGIGA2025') {
      setAppliedPromo({ discount: 1000 })
      addToast('СКИДКА 1000₽ АКТИВИРОВАНА', 'success')
    } else {
      addToast('НЕВЕРНЫЙ ПРОМОКОД', 'error')
    }
  }

  const handleCheckout = async () => {
    if (!showCheckoutFields) {
      setShowCheckoutFields(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!fullName.trim() || phone.replace(/\D/g, '').length < 11) {
      addToast('ЗАПОЛНИТЕ ВСЕ ПОЛЯ', 'error')
      return
    }

    if (dbCart.length === 0) {
      addToast('КОРЗИНА ПУСТА', 'error')
      return
    }

    setIsOrdering(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      // Сохраняем заказ в БД
      const { error: orderError } = await supabase.from('orders').insert([{
        user_id: user.id,
        items: dbCart,
        total_amount: finalPrice,
        delivery_type: deliveryMethod,
        customer_name: fullName,
        phone: phone.replace(/\D/g, ''),
        status: 'pending',
        payment_method: 'transfer_to_phone',
        payment_details: JSON.stringify({
          target_number: '79278552324',
          bank: 'Ozon Bank',
          amount: finalPrice
        }),
        created_at: new Date().toISOString()
      }])

      if (orderError) throw orderError

      // Очищаем корзину
      await supabase.from('cart').delete().eq('user_id', user.id)
      contextClearCart()
      setDbCart([])

      // Показываем модальное окно
      setShowPaymentModal(true)
      addToast('ЗАКАЗ ОФОРМЛЕН УСПЕШНО!', 'success')

    } catch (error) {
      console.error(error)
      addToast('ОШИБКА ПРИ ОФОРМЛЕНИИ', 'error')
    } finally {
      setIsOrdering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 border-t-2 border-[#ff007a] rounded-full animate-spin" />
          <p className="text-[#ff007a] font-black uppercase tracking-[1em] text-[10px]">vsgiga_loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pt-40 pb-32 px-8 relative overflow-hidden">
      {/* Уведомления */}
      <AnimatePresence>
        {toasts.map(t => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
          />
        ))}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto">
        {/* Хедер */}
        <header className="mb-32 flex flex-col xl:flex-row items-center gap-16">
          <div className="w-40 h-40 bg-[#ff007a] rounded-[4rem] flex items-center justify-center shadow-[0_0_80px_rgba(255,0,122,0.5)]">
            <ShoppingCart size={60} className="text-white" />
          </div>

          <div className="text-center xl:text-left">
            <div className="flex items-center gap-6 mb-4">
              <div className="h-[3px] w-20 bg-[#ff007a]" />
              <span className="text-[#ff007a] font-black uppercase tracking-[0.6em] text-[12px]">vsgiga shop / cart</span>
            </div>
            <h1 className="text-[8rem] font-black italic uppercase tracking-tighter leading-[0.8]">
              КОРЗИН<span className="text-[#ff007a]">А</span>
            </h1>
            <div className="mt-10 flex flex-wrap justify-center xl:justify-start gap-10 opacity-30 font-black text-[11px] uppercase">
              <div className="flex items-center gap-3"><Activity size={16} /> Items: {totalItems}</div>
              <div className="flex items-center gap-3"><Lock size={16} /> Secure</div>
            </div>
          </div>
        </header>

        {dbCart.length === 0 ? (
          <div className="py-80 text-center border-2 border-dashed border-white/5 rounded-[6rem] bg-white/[0.01]">
            <ShoppingBag size={120} className="mx-auto text-white/5 mb-12" />
            <p className="text-white/20 font-black uppercase tracking-[2em] text-xs">КОРЗИНА ПУСТА</p>
            <Link href="/shop" className="inline-block mt-16 px-16 py-8 bg-white/5 border border-white/10 rounded-full font-black uppercase text-[11px] hover:bg-[#ff007a] hover:text-white transition-all">
              В КАТАЛОГ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Товары */}
            <div className="lg:col-span-7 space-y-12">
              {dbCart.map((item, idx) => (
                <div key={item.id} className="bg-[#080808] border border-white/5 p-12 rounded-[5rem] flex flex-col md:flex-row items-center gap-16">
                  <div className="w-56 h-72 bg-black rounded-[3.5rem] overflow-hidden border border-white/5">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                      alt={item.name}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4">{item.name}</h3>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-[10px] text-white/20 font-black uppercase">In stock</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="w-14 h-14 rounded-[1.5rem] border border-white/5 flex items-center justify-center hover:text-red-500"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <p className="text-[11px] text-white/20 font-black uppercase mb-2">Цена</p>
                        <span className="text-4xl font-black italic text-white">
                          {(item.price || 0).toLocaleString()} ₽
                        </span>
                      </div>

                      <div className="flex items-center bg-black border-2 border-white/5 p-4 rounded-[2.5rem] gap-10">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-[#ff007a]"
                        >
                          <Minus size={24} />
                        </button>
                        <span className="font-black text-4xl w-12 text-center font-mono text-white">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-[#ff007a]"
                        >
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Сайдбар заказа */}
            <div className="lg:col-span-5">
              <div className="bg-[#080808] border-2 border-white/5 p-14 rounded-[5rem] sticky top-40">
                {/* Промокод */}
                <div className="mb-14 space-y-8">
                  <div className="flex gap-5">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" size={20} />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="ПРОМОКОД"
                        className="w-full bg-white/5 border border-white/10 p-7 pl-16 rounded-3xl font-black uppercase text-xs outline-none focus:border-[#ff007a]"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      className="px-10 bg-white text-black rounded-3xl font-black uppercase text-[11px] hover:bg-[#ff007a] hover:text-white transition-all"
                    >
                      ПРИМЕНИТЬ
                    </button>
                  </div>

                  {/* Бонусы */}
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#ff007a]/10 flex items-center justify-center text-[#ff007a]">
                        <Coins size={32} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/20 uppercase mb-1">Бонусы</p>
                        <p className="text-3xl font-black text-white">
                          {userBonuses.toLocaleString()} PTS
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUseBonuses(!useBonuses)}
                      className={`px-8 py-4 rounded-2xl font-black text-[11px] ${useBonuses
                        ? 'bg-[#ff007a] text-white'
                        : 'bg-white/5 text-white/40'
                        }`}
                    >
                      {useBonuses ? 'АКТИВНО' : 'ИСПОЛЬЗОВАТЬ'}
                    </button>
                  </div>
                </div>

                {/* Итого */}
                <div className="space-y-6 mb-14 bg-black/50 p-10 rounded-[4rem] border border-white/5">
                  <div className="flex justify-between items-center text-white/30 font-black uppercase text-[11px]">
                    <div className="flex items-center gap-3"><Package size={14} /> Товары:</div>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>

                  {useBonuses && (
                    <div className="flex justify-between items-center text-[#ff007a] font-black uppercase text-[11px]">
                      <div className="flex items-center gap-3"><Star size={14} /> Скидка бонусами:</div>
                      <span>-{spendAmount.toLocaleString()} ₽</span>
                    </div>
                  )}

                  {appliedPromo && (
                    <div className="flex justify-between items-center text-green-500 font-black uppercase text-[11px]">
                      <div className="flex items-center gap-3"><ZapIcon size={14} /> Промокод:</div>
                      <span>-{promoDiscount.toLocaleString()} ₽</span>
                    </div>
                  )}

                  <div className="pt-10 mt-6 border-t border-white/10">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white/20 text-[11px] font-black uppercase">К ОПЛАТЕ</p>
                      </div>
                      <div className="text-right">
                        <span className="text-5xl font-black italic tracking-tighter block text-white">
                          {finalPrice.toLocaleString()}
                          <span className="text-2xl text-[#ff007a] ml-4">₽</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Данные для доставки */}
                <AnimatePresence>
                  {showCheckoutFields && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="space-y-5 mb-12"
                    >
                      <div className="grid grid-cols-1 gap-5">
                        <div className="relative">
                          <User className="absolute left-7 top-1/2 -translate-y-1/2 text-white/10" size={20} />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="ФИО"
                            className="w-full bg-white/5 border border-white/10 p-8 pl-18 rounded-[2.5rem] font-black text-xs outline-none focus:border-[#ff007a]"
                          />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10" size={20} />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                              setPhone(val.length > 0 ? (val.startsWith('7') ? '+' + val : val) : '');
                            }}
                            placeholder="+7 (999) 000-00-00"
                            className="w-full bg-white/5 border border-white/10 p-8 pl-20 rounded-[2.5rem] font-black text-xs outline-none focus:border-[#ff007a]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5 mt-4">
                        <button
                          onClick={() => setDeliveryMethod('mail')}
                          className={`p-8 rounded-[2rem] border-2 font-black text-[11px] flex flex-col items-center gap-4 ${deliveryMethod === 'mail' ? 'border-[#ff007a] bg-[#ff007a]/10 text-white' : 'border-white/5 bg-white/5 text-white/20'}`}
                        >
                          <Truck size={24} /> КУРЬЕРОМ
                        </button>
                        <button
                          onClick={() => setDeliveryMethod('pickup')}
                          className={`p-8 rounded-[2rem] border-2 font-black text-[11px] flex flex-col items-center gap-4 ${deliveryMethod === 'pickup' ? 'border-[#ff007a] bg-[#ff007a]/10 text-white' : 'border-white/5 bg-white/5 text-white/20'}`}
                        >
                          <Package size={24} /> САМОВЫВОЗ
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Кнопка оформления */}
                <button
                  onClick={handleCheckout}
                  disabled={isOrdering}
                  className="w-full py-12 bg-white text-black rounded-[3.5rem] font-black uppercase text-sm hover:bg-[#ff007a] hover:text-white transition-all disabled:opacity-50"
                >
                  {isOrdering ? 'ОФОРМЛЕНИЕ...' : showCheckoutFields ? 'ПОДТВЕРДИТЬ ЗАКАЗ' : 'ОФОРМИТЬ ЗАКАЗ'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно оплаты */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
              onClick={() => setShowPaymentModal(false)}
            />
            <div className="relative z-10 w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-[5rem] p-20 text-center shadow-[0_100px_200px_rgba(0,0,0,1)]">
              <div className="mb-12 inline-flex p-10 bg-green-500/10 rounded-[3rem] text-green-500 border border-green-500/20">
                <CheckCircle2 size={80} />
              </div>
              <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-8">
                ЗАКАЗ ПРИНЯТ
              </h2>
              <p className="text-sm font-bold text-white/40 uppercase tracking-widest leading-loose mb-12">
                Для оплаты переведите {finalPrice} ₽ на номер:<br />
                <span className="text-[#ff007a] font-black text-2xl">79278552324</span><br />
                (СБП/Перевод/Ozon Bank)
              </p>
              <button
                onClick={() => {
                  setShowPaymentModal(false)
                  router.push('/shop')
                }}
                className="w-full py-10 bg-white text-black rounded-[2.5rem] font-black uppercase text-xs hover:bg-[#ff007a] hover:text-white transition-all"
              >
                ВЕРНУТЬСЯ В МАГАЗИН
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}