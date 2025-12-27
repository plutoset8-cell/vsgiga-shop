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
  Truck, Package, Coins, MapPin, User, Phone, Ticket, Zap 
} from 'lucide-react'

// --- КОМПОНЕНТ УВЕДОМЛЕНИЯ (TOAST) ---
const Toast = ({ message, type, onClose }: { message: string, type: 'error' | 'success', onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 50, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    className={`fixed top-10 right-10 z-[100] flex items-center gap-4 p-4 min-w-[300px] rounded-2xl border backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${
      type === 'error' 
      ? 'bg-red-500/10 border-red-500/30 text-red-400' 
      : 'bg-[#d67a9d]/10 border-[#d67a9d]/30 text-[#d67a9d]'
    }`}
  >
    <div className="shrink-0">
      {type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
    </div>
    <div className="flex-1">
      <p className="font-black uppercase italic text-[10px] tracking-wider leading-tight">
        {type === 'error' ? 'ВНИМАНИЕ:' : 'УСПЕШНО:'}
      </p>
      <p className="text-[11px] font-medium text-white/90">{message}</p>
    </div>
    <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
      <X size={14} className="opacity-40" />
    </button>
  </motion.div>
)

export default function CartPage() {
  const { cart, totalPrice, removeFromCart, updateQuantity, clearCart, totalItems } = useCart()
  
  // Состояния для полей ввода
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  
  // Состояния UI
  const [isOrdering, setIsOrdering] = useState(false)
  const [showCheckoutFields, setShowCheckoutFields] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState<'mail' | 'pickup'>('mail')

  // --- НОВОЕ: Оплата СБП ---
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [lastOrderId, setLastOrderId] = useState('')
  
  // --- ФИКС: Состояние для сохранения суммы перед очисткой корзины ---
  const [confirmedPrice, setConfirmedPrice] = useState(0)
  
  // Бонусы и Уведомления
  const [userBonuses, setUserBonuses] = useState(0)
  const [useBonuses, setUseBonuses] = useState(false)
  const [toasts, setToasts] = useState<{id: number, message: string, type: 'error' | 'success'}[]>([])
  
  // Промокоды
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<any>(null)
  const [isCheckingPromo, setIsCheckingPromo] = useState(false)
  
  const router = useRouter()

  // --- ФУНКЦИЯ ФОРМАТИРОВАНИЯ НОМЕРА ---
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    
    let res = '+7 ';
    if (digits.length <= 1) return res;
    
    const mainDigits = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;
    
    if (mainDigits.length > 0) res += '(' + mainDigits.substring(0, 3);
    if (mainDigits.length >= 4) res += ') ' + mainDigits.substring(3, 6);
    if (mainDigits.length >= 7) res += '-' + mainDigits.substring(6, 8);
    if (mainDigits.length >= 9) res += '-' + mainDigits.substring(8, 10);
    
    return res;
  };

  // Загружаем данные пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        if (user.user_metadata?.full_name) setFullName(user.user_metadata.full_name)
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('bonuses')
          .eq('id', user.id)
          .single()
        
        if (profileData) setUserBonuses(profileData.bonuses || 0)
      }
    }
    fetchUserData()
  }, [])

  // Применение промокода
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return
    
    setIsCheckingPromo(true)
    try {
      const { data, error } = await supabase
        .from('promocodes')
        .select('*')
        .eq('code', promoInput.toUpperCase().trim())
        .maybeSingle()

      if (error) throw error

      if (!data) {
        addToast('КОД НЕ НАЙДЕН В РЕЕСТРЕ', 'error')
        setAppliedPromo(null)
        return
      }

      if (Number(data.used_count) >= Number(data.usage_limit)) {
        addToast('ЛИМИТ ИСПОЛЬЗОВАНИЙ ИСЧЕРПАН', 'error')
        return
      }

      setAppliedPromo(data)
      addToast(`ДОСТУП РАЗРЕШЕН: -${data.discount}₽`, 'success')
    } catch (err) {
      console.error('Promo Error:', err)
      addToast('ОШИБКА СИСТЕМЫ ПРОВЕРКИ', 'error')
    } finally {
      setIsCheckingPromo(false)
    }
  }

  // Расчет финальной цены
  const earnedBonuses = Math.floor(totalPrice * 0.05)
  const maxSpendable = Math.floor(totalPrice * 0.3) 
  const spendAmount = useBonuses ? Math.min(userBonuses, maxSpendable) : 0
  const promoDiscount = appliedPromo ? Number(appliedPromo.discount) : 0
  const finalPrice = Math.max(0, totalPrice - spendAmount - promoDiscount)

  const addToast = useCallback((message: string, type: 'error' | 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])

  const handleUpdateQuantity = (id: string, size: string, newQty: number) => {
    if (newQty < 1) return
    if (updateQuantity) {
      updateQuantity(id, size, newQty)
    }
  }

  // ФУНКЦИЯ ОФОРМЛЕНИЯ ЗАКАЗА
  const handleCheckout = async () => {
    if (!showCheckoutFields) {
      setShowCheckoutFields(true)
      return
    }

    if (fullName.trim().length < 2) return addToast('ВВЕДИТЕ ВАШЕ ИМЯ', 'error')
    
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 11) return addToast('ВВЕДИТЕ КОРРЕКТНЫЙ НОМЕР ТЕЛЕФОНА', 'error')
    
    if (deliveryMethod === 'mail' && address.trim().length < 10) return addToast('ВВЕДИТЕ ТОЧНЫЙ АДРЕС ПОЧТЫ', 'error')
    
    setIsOrdering(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        addToast('ПОЖАЛУЙСТА, ВОЙДИТЕ В СИСТЕМУ', 'error')
        router.push('/login')
        return
      }

      const orderPayload: any = {
        user_id: user.id,
        items: cart, 
        total_amount: finalPrice,
        address: deliveryMethod === 'pickup' ? 'САМОВЫВОЗ' : address,
        delivery_type: deliveryMethod,
        bonuses_spent: spendAmount,
        bonuses_earned: earnedBonuses,
        customer_email: user.email,
        phone: phone,
        customer_name: fullName,
        first_name: fullName 
      }

      if (appliedPromo) {
        orderPayload.promo_code = appliedPromo.code
      }

      let { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single()

      if (orderError && orderError.message.includes('promo_code')) {
        delete orderPayload.promo_code
        const { data: retryData, error: retryError } = await supabase
          .from('orders')
          .insert([orderPayload])
          .select()
          .single()
        
        if (retryError) throw retryError
        orderData = retryData
      } else if (orderError) {
        throw orderError
      }

      // Используем данные созданного заказа
      const finalOrder = orderData

      if (appliedPromo) {
        await supabase
          .from('promocodes')
          .update({ used_count: Number(appliedPromo.used_count) + 1 })
          .eq('id', appliedPromo.id)
      }

      // Обновляем баланс пользователя
      const newBalance = userBonuses - spendAmount + earnedBonuses
      await supabase.from('profiles').update({ bonuses: newBalance }).eq('id', user.id)

      // Запись в историю бонусов
      const historyRecords = []
      if (finalOrder) {
        if (earnedBonuses > 0) {
          historyRecords.push({
            user_id: user.id,
            amount: earnedBonuses,
            reason: `Начисление за заказ #${finalOrder.id.slice(0, 8)}`,
            type: 'earn'
          })
        }
        if (spendAmount > 0) {
          historyRecords.push({
            user_id: user.id,
            amount: -spendAmount,
            reason: `Списание в заказе #${finalOrder.id.slice(0, 8)}`,
            type: 'spend'
          })
        }
      }

      if (historyRecords.length > 0) {
        await supabase.from('bonus_history').insert(historyRecords)
      }

      // --- ФИКС: Сохраняем цену в подтвержденное состояние перед очисткой ---
      setConfirmedPrice(finalPrice)
      setLastOrderId(finalOrder?.id.slice(0, 8) || 'ERROR')
      setShowPaymentModal(true)
      clearCart()
      
    } catch (error: any) {
      console.error('Checkout Error:', error)
      addToast(error.message || 'ОШИБКА ОФОРМЛЕНИЯ', 'error')
    } finally {
      setIsOrdering(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6 font-sans">
      <AnimatePresence>
        {toasts.map(t => (
          <Toast 
            key={t.id} 
            message={t.message} 
            type={t.type} 
            onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} 
          />
        ))}

        {/* --- МОДАЛЬНОЕ ОКНО ОПЛАТЫ --- */}
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#111111] border border-white/10 p-8 rounded-[3rem] max-w-sm w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 bg-[#d67a9d] rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(214,122,157,0.5)]">
                <Zap size={40} className="text-white fill-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Заказ принят!</h2>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2">ID: #{lastOrderId}</p>
              </div>
              
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4 text-left">
                <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight">
                  {/* ФИКС: Используем confirmedPrice вместо finalPrice */}
                  Для подтверждения переведите <span className="text-[#d67a9d]">{confirmedPrice.toLocaleString()} ₽</span> по СБП:
                </p>
                <div className="py-4 px-4 bg-black rounded-2xl border border-[#d67a9d]/30 select-all font-black text-center text-lg tracking-wider">
                  +7 (927) 855-23-24
                </div>
                <p className="text-[9px] text-white/30 uppercase text-center font-black italic tracking-widest">озон банк / ozon bank</p>
              </div>

              <button 
                onClick={() => router.push('/profile')}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#d67a9d] hover:text-white transition-all"
              >
                Я ОПЛАТИЛ
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-5 mb-12 border-b border-white/5 pb-10">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-inner"
          >
            <ShoppingCart className="text-[#d67a9d]" size={24} />
          </motion.div>
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">КОРЗИНА</h2>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-[#d67a9d] uppercase tracking-[0.2em]">vsgiga shop</span>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">{totalItems} ТОВАРА(ОВ)</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {cart.length === 0 && !showPaymentModal ? (
            <motion.div 
              key="empty-cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-32 flex flex-col items-center justify-center text-center rounded-[3rem] bg-[#050505] border border-white/5"
            >
              <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center mb-6 border border-white/5">
                <ShoppingBag size={40} className="text-white/10" />
              </div>
              <h2 className="text-xl font-black italic uppercase mb-3 opacity-50">Здесь пока ничего нет</h2>
              <Link href="/catalog">
                <button className="px-10 py-4 bg-white text-black hover:bg-[#d67a9d] hover:text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all duration-300">
                  ОТКРЫТЬ КАТАЛОГ
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-7 space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#71b3c9]/10 rounded-xl flex items-center justify-center text-[#71b3c9]">
                      <Coins size={24} />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black uppercase italic tracking-wider">Ваши бонусы: {userBonuses}</h4>
                      <p className="text-[9px] text-white/30 uppercase italic">Доступно к списанию: {maxSpendable} GIGA_COINS</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setUseBonuses(!useBonuses)}
                    disabled={userBonuses <= 0}
                    className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                      useBonuses 
                      ? 'bg-[#d67a9d] text-white shadow-[0_0_20px_rgba(214,122,157,0.3)]' 
                      : 'bg-white/5 text-white/40 border border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {useBonuses ? 'БОНУСЫ ПРИМЕНЕНЫ' : 'СПИСАТЬ БОНУСЫ'}
                  </button>
                </motion.div>

                <div className="space-y-4">
                  {cart.map((item: any) => (
                    <motion.div 
                      key={`${item.id}-${item.selectedSize}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-white/[0.02] border border-white/10 p-5 rounded-[2rem] flex items-center gap-6 hover:bg-white/[0.04] transition-all duration-300 shadow-sm"
                    >
                      <div className="w-24 h-24 rounded-[1.2rem] overflow-hidden bg-black shrink-0 border border-white/5">
                        <img 
                          src={item.image} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={item.name} 
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-[16px] font-black italic uppercase truncate tracking-tight mb-1">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize)} 
                            className="text-white/10 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <span className="inline-block text-[9px] font-black px-2 py-0.5 bg-[#d67a9d]/10 text-[#d67a9d] border border-[#d67a9d]/20 rounded-lg uppercase italic mb-4">
                          Размер: {item.selectedSize || 'OS'}
                        </span>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-black text-[#71b3c9] italic">
                            {item.price.toLocaleString()} <span className="text-[10px] opacity-40 italic">RUB</span>
                          </p>
                          
                          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 shadow-inner">
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)} 
                              className="w-7 h-7 flex items-center justify-center hover:text-[#d67a9d] transition-colors active:scale-75"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center font-bold text-[12px] tabular-nums">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)} 
                              className="w-7 h-7 flex items-center justify-center hover:text-[#71b3c9] transition-colors active:scale-75"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 sticky top-32">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#d67a9d]/20 to-[#71b3c9]/20 rounded-[3rem] blur-xl opacity-50"></div>
                  
                  <div className="relative bg-[#080808] border border-white/10 p-8 md:p-10 rounded-[3rem] overflow-hidden">
                    
                    <div className="mb-10 space-y-4">
                      <p className="font-black uppercase text-[10px] tracking-[0.3em] text-white/30 italic ml-1">Promotion_Access_Key</p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Ticket size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d67a9d] opacity-50" />
                          <input 
                            type="text"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            placeholder="ВВЕДИТЕ КОД"
                            className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-[11px] font-black uppercase outline-none focus:border-[#d67a9d] transition-colors placeholder:text-white/10"
                          />
                        </div>
                        <button 
                          onClick={handleApplyPromo}
                          disabled={isCheckingPromo || !promoInput.trim()}
                          className="px-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all disabled:opacity-30"
                        >
                          {isCheckingPromo ? '...' : 'OK'}
                        </button>
                      </div>
                      {appliedPromo && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-between items-center px-4 py-2 bg-[#d67a9d]/10 border border-[#d67a9d]/20 rounded-xl"
                        >
                          <span className="text-[9px] font-black text-[#d67a9d] uppercase italic">Код {appliedPromo.code} активен</span>
                          <span className="text-[10px] font-black text-[#d67a9d]">-{appliedPromo.discount} ₽</span>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <p className="font-black uppercase text-[10px] tracking-[0.3em] text-white/30 italic">Итоговая сумма</p>
                      <span className="text-[10px] font-bold text-white/20">VSG_TRX_2025</span>
                    </div>

                    <div className="flex flex-col gap-1 mb-10">
                      <div className="flex items-baseline gap-2 text-white italic">
                        <span className="text-6xl font-black tracking-tighter leading-none">{finalPrice.toLocaleString()}</span>
                        <span className="text-xl font-black text-[#d67a9d]">₽</span>
                      </div>
                      { (spendAmount > 0 || promoDiscount > 0) && (
                        <p className="text-[10px] font-bold text-white/20 uppercase italic ml-1">
                          Экономия: {(spendAmount + promoDiscount).toLocaleString()} ₽
                        </p>
                      )}
                    </div>

                    <div className="mb-8 space-y-3">
                      <p className="text-[9px] font-black uppercase text-white/40 tracking-widest italic ml-1">Способ получения:</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setDeliveryMethod('mail')} 
                          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-300 ${deliveryMethod === 'mail' ? 'border-[#d67a9d] bg-[#d67a9d]/5 text-white' : 'border-white/10 opacity-40 text-white/40 hover:opacity-60'}`}
                        >
                          <Truck size={18} />
                          <span className="text-[10px] font-black uppercase italic">ПОЧТА</span>
                        </button>
                        <button 
                          onClick={() => setDeliveryMethod('pickup')} 
                          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-300 ${deliveryMethod === 'pickup' ? 'border-[#71b3c9] bg-[#71b3c9]/5 text-white' : 'border-white/10 opacity-40 text-white/40 hover:opacity-60'}`}
                        >
                          <Package size={18} />
                          <span className="text-[10px] font-black uppercase italic">САМОВЫВОЗ</span>
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showCheckoutFields && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 mb-8 overflow-hidden"
                        >
                          <div className="relative">
                            <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d67a9d]" />
                            <input 
                              type="text" 
                              value={fullName} 
                              onChange={(e) => setFullName(e.target.value)} 
                              placeholder="ФАМИЛИЯ И ИМЯ ПОЛНОСТЬЮ" 
                              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-[11px] font-bold uppercase outline-none focus:border-[#d67a9d] transition-colors placeholder:text-white/10" 
                            />
                          </div>
                          <div className="relative">
                            <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71b3c9]" />
                            <input 
                              type="tel" 
                              value={phone} 
                              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))} 
                              placeholder="+7 (000) 000-00-00" 
                              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-[11px] font-bold outline-none focus:border-[#71b3c9] transition-colors placeholder:text-white/10" 
                            />
                          </div>
                          {deliveryMethod === 'mail' && (
                            <div className="relative">
                              <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                              <input 
                                type="text" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                placeholder="ВВЕДИТЕ ТОЧНЫЙ АДРЕС ПОЧТЫ" 
                                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-[11px] font-bold uppercase outline-none focus:border-white/40 transition-colors placeholder:text-white/10" 
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      onClick={handleCheckout} 
                      disabled={isOrdering} 
                      className="group w-full relative overflow-hidden bg-white text-black py-6 rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-[#d67a9d] hover:text-white transition-all active:scale-95 disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isOrdering ? 'СИНХРОНИЗАЦИЯ...' : showCheckoutFields ? 'ЗАВЕРШИТЬ ЗАКАЗ' : 'К ОФОРМЛЕНИЮ'}
                        {!isOrdering && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                      </span>
                    </button>

                    <div className="mt-8 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-3 text-[9px] font-black uppercase text-[#71b3c9]/80 italic mb-4">
                        <ShieldCheck size={16} />
                        <span>vsgiga_security_protocol</span>
                      </div>
                      <p className="text-[8px] font-medium uppercase tracking-tight text-white/10 leading-relaxed italic">
                        Все транзакции защищены. После подтверждения заказа наш менеджер свяжется с вами для уточнения деталей.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}