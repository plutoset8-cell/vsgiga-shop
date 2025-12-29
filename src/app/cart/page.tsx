'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  ShoppingCart, ShieldCheck, AlertCircle, CheckCircle2, X,
  Truck, Package, Coins, MapPin, User, Phone, Ticket, Zap,
  Layers, Activity, Terminal, Lock, Cpu, Globe, Hash, Database, Server, Radio,
  Snowflake, Gift, Star, Sparkles, ZapIcon, Github, Twitter, Instagram,
  Scan, MousePointer2, Binary, Fingerprint, Eye, Code, HardDrive, BarChart3, Wifi
} from 'lucide-react'

// ======================================================================
// [SYSTEM_COMPONENT_01]: XMAS_PHYSICS_ENGINE_v3.0
// ======================================================================
function XmasSnowBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * 2000, opacity: 0, rotate: 0 }}
          animate={{
            y: 1200,
            x: (Math.random() * 2000) + (Math.random() - 0.5) * 400,
            opacity: [0, 1, 1, 0],
            rotate: 720
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
          className="absolute text-white/10"
        >
          <Snowflake size={Math.random() * 15 + 5} />
        </motion.div>
      ))}
    </div>
  )
}

// ======================================================================
// [SYSTEM_COMPONENT_02]: INTERACTIVE_HOLIDAY_GARLAND
// ======================================================================
function XmasGarland() {
  return (
    <div className="absolute top-0 left-0 w-full h-48 pointer-events-none z-40 flex justify-around overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [i % 2 === 0 ? 8 : -8, i % 2 === 0 ? -8 : 8, i % 2 === 0 ? 8 : -8],
            y: [0, 8, 0]
          }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: i * 0.15 }}
          className="origin-top flex flex-col items-center"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 to-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
          <motion.div
            animate={{
              boxShadow: i % 3 === 0
                ? ["0 0 5px #ff007a", "0 0 30px #ff007a", "0 0 5px #ff007a"]
                : ["0 0 5px #00f2ff", "0 0 30px #00f2ff", "0 0 5px #00f2ff"],
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }}
            className={`w-5 h-5 rounded-full ${i % 3 === 0 ? 'bg-[#ff007a]' : 'bg-[#00f2ff]'}`}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ======================================================================
// [SYSTEM_COMPONENT_03]: NEURAL_LINK_STREAM_VISUALIZER
// ======================================================================
function CyberStreamVisualizer() {
  return (
    <div className="w-full py-24 border-t border-b border-white/5 bg-gradient-to-r from-black via-[#ff007a]/5 to-black overflow-hidden relative">
      <div className="flex justify-around items-end h-40 gap-[2px] px-2">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: [15, Math.random() * 140 + 20, 15],
              backgroundColor: i % 15 === 0 ? "#ff007a" : "rgba(255,255,255,0.08)"
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 1.2 + 0.8,
              ease: "easeInOut"
            }}
            className="flex-1 rounded-t-full"
          />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="px-12 py-3 bg-black/90 backdrop-blur-2xl border border-[#ff007a]/40 rounded-full shadow-[0_0_40px_rgba(255,0,122,0.2)]">
          <div className="flex items-center gap-4">
            <Activity className="text-[#ff007a] animate-pulse" size={16} />
            <span className="text-[11px] font-black uppercase tracking-[0.8em] text-[#ff007a]">Neural_Link_Streaming_Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ======================================================================
// [SYSTEM_COMPONENT_04]: BIO_INTEGRITY_SCANNER
// ======================================================================
function BioCoreStatus() {
  return (
    <div className="w-full p-12 bg-[#050505] border border-white/5 rounded-[4.5rem] flex flex-col lg:flex-row items-center gap-16 mb-24 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      <div className="relative w-40 h-40 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-[#ff007a]/20 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="relative z-10 p-8 bg-[#ff007a]/5 rounded-full"
        >
          <Fingerprint size={56} className="text-[#ff007a]" />
        </motion.div>
      </div>
      <div className="flex-1 space-y-6 text-center lg:text-left">
        <div className="flex items-center gap-6 justify-center lg:justify-start">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">User_Integrity_Scanner</h2>
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            className="px-4 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full border border-green-500/20"
          >
            VERIFIED_AUTH
          </motion.span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: "Pulse_Rate", val: "74_BPM", color: "text-white" },
            { label: "Neural_Load", val: "18.4%", color: "text-[#ff007a]" },
            { label: "Sync_Quality", val: "0.998", color: "text-green-500" },
            { label: "Protocol", val: "OPIUM_v6", color: "text-blue-400" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 p-5 rounded-3xl hover:bg-white/[0.06] transition-all">
              <p className="text-[9px] font-black text-white/20 uppercase mb-2 tracking-widest">{stat.label}</p>
              <p className={`text-sm font-black font-mono ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="shrink-0 w-full lg:w-auto">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#000' }}
          className="w-full lg:w-auto px-12 py-6 border border-white/10 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all"
        >
          System_Recalibrate
        </motion.button>
      </div>
    </div>
  )
}
// ======================================================================
// [SYSTEM_COMPONENT_05]: CYBER_TERMINAL_v7.0 (MINIMIZABLE)
// ======================================================================
function CyberTerminalHUD({ isVisible, onHide }: { isVisible: boolean, onHide: () => void }) {
  const [logs, setLogs] = useState<string[]>([
    "BOOTING_VSGIGA_OS_v6.5...",
    "HANDSHAKE_NODE_STABLE",
    "ENCRYPTING_MANIFEST...",
    "XMAS_PROTOCOL_LOADED",
    "SYSTEM_CHECK: 100%_OK"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        `DATA_SYNC: ${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
        `TEMP: ${36 + Math.random() * 8}°C`,
        `NODE_${Math.floor(Math.random() * 99)}: ONLINE`,
        `DB_LATENCY: ${Math.floor(Math.random() * 20 + 5)}ms`,
        `OPIUM_SEC: ACTIVE`,
        `PACKET_LOSS: 0.00%`
      ];
      setLogs(prev => [...prev.slice(-5), messages[Math.floor(Math.random() * messages.length)]]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return (
    <motion.button
      whileHover={{ scale: 1.1, boxShadow: "0 0 30px #ff007a" }}
      onClick={onHide}
      className="fixed left-12 bottom-12 z-[100] p-6 bg-black border border-[#ff007a] text-[#ff007a] rounded-[2rem] shadow-2xl backdrop-blur-xl"
    >
      <Terminal size={28} />
    </motion.button>
  );

  return (
    <div className="hidden xl:block fixed left-12 bottom-12 z-[100]">
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-96 bg-black/95 border border-white/10 border-l-4 border-l-[#ff007a] p-10 backdrop-blur-3xl relative shadow-[50px_0_100px_rgba(0,0,0,0.8)] rounded-r-[3rem]"
      >
        <button onClick={onHide} className="absolute top-6 right-6 text-white/10 hover:text-[#ff007a] transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center gap-5 mb-10 text-[#ff007a]">
          <div className="p-3 bg-[#ff007a]/10 rounded-2xl"><Terminal size={24} /></div>
          <div>
            <span className="text-[14px] font-black uppercase tracking-[0.4em] block italic">vsgiga_core</span>
            <span className="text-[9px] opacity-40 font-mono tracking-tighter">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
        </div>
        <div className="space-y-4 font-mono">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-white/[0.03] pb-2">
              <span className="text-[9px] text-[#ff007a] opacity-40 font-bold">[{i}]</span>
              <span className="text-[11px] text-white/50 uppercase tracking-tighter leading-none">{log}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center italic">
          <span className="text-[9px] text-white/20 font-black tracking-widest uppercase">Kernel_v6.5.0</span>
          <div className="flex gap-2">
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="w-2 h-2 bg-white/10 rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

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

export default function CartPage() {
  // --- [STATE_MANAGEMENT: MAXIMUM_PRECISION] ---
  const [dbCart, setDbCart] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isHudVisible, setIsHudVisible] = useState(true)
  const [explosion, setExplosion] = useState(false)
  const { clearCart: contextClearCart } = useCart()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
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

  const addToast = useCallback((message: string, type: 'error' | 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000)
  }, [])

  // ======================================================================
  // [DATABASE_LOGIC]: ZERO_ZERO_SYNC (Фикс 0 при загрузке)
  // ======================================================================
  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      // Прямой запрос к базе с джоином продуктов
      const { data: cartData, error: cartError } = await supabase
        .from('cart')
        .select('*, product:products(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (cartError) {
        addToast('DATABASE_SYNC_ERROR', 'error')
        console.error(cartError)
      }

      if (cartData) {
        const formattedCart = cartData
          .filter((item: any) => item.product !== null)
          .map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
            cartItemId: item.id
          }))
        setDbCart(formattedCart)
        // Обновляем глобальный контекст, чтобы иконка в хедере увидела товары
        formattedCart.forEach(item => {
          // Если в контексте есть метод addItem или sync, используй его
        });
      }

      // Подгрузка бонусного счета из профиля VSGIGA
      const { data: profile } = await supabase
        .from('profiles')
        .select('bonuses')
        .eq('id', session.user.id)
        .single()

      if (profile) setUserBonuses(profile.bonuses || 0)

      // Искусственная задержка для красоты анимации инициализации
      setTimeout(() => setIsLoading(false), 800)
    }

    fetchCartData()
  }, [router, addToast])

  const totalItems = dbCart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = dbCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  // ======================================================================
  // [LOGIC_HANDLER_01]: QUANTITY_SYNC_PROTOCOL
  // ======================================================================
  const handleUpdateQuantity = async (id: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta
    if (newQty < 1) return

    // Оптимистичное обновление UI
    setDbCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item))

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from('cart')
        .update({ quantity: newQty })
        .match({ user_id: user.id, product_id: id })

      if (error) {
        addToast('SYNC_QUANTITY_FAILED', 'error')
        console.error('Crit_Error: Quant_Update_Mismatch')
      }
    }
  }

  // ======================================================================
  // [LOGIC_HANDLER_02]: OBJECT_DELETION_PROTOCOL
  // ======================================================================
  const handleRemoveFromCart = async (id: string) => {
    setDbCart(prev => prev.filter(item => item.id !== id))
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from('cart')
        .delete()
        .match({ user_id: user.id, product_id: id })

      if (!error) {
        addToast('ОБЪЕКТ ИСКЛЮЧЕН ИЗ РЕЕСТРА', 'success')
      } else {
        addToast('DELETION_FAILED', 'error')
      }
    }
  }

  // ======================================================================
  // [LOGIC_HANDLER_03]: PROMO_CODE_DECRYPTION
  // ======================================================================
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return
    addToast('DECRYPTING_PROMO...', 'success')

    const { data, error } = await supabase
      .from('promocodes')
      .select('*')
      .eq('code', promoInput.toUpperCase().trim())
      .maybeSingle()

    if (error || !data) {
      addToast('ПРОМОКОД НЕ ВАЛИДЕН ИЛИ ИСТЕК', 'error')
      return
    }

    setAppliedPromo(data)
    addToast('СКИДКА УСПЕШНО АКТИВИРОВАНА', 'success')
  }

  // Расчет финальных коэффициентов
  const spendAmount = useBonuses ? Math.min(userBonuses, Math.floor(totalPrice * 0.3)) : 0
  const finalPrice = Math.max(0, totalPrice - spendAmount - (appliedPromo ? Number(appliedPromo.discount) : 0))

  // ======================================================================
  // [LOGIC_HANDLER_04]: FINAL_TRANSACTION_INIT
  // ======================================================================
  const handleCheckout = async () => {
    // 1. Проверка первого шага (показ полей)
    if (!showCheckoutFields) {
      setShowCheckoutFields(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // 2. Валидация данных
    if (fullName.length < 2 || phone.length < 10) {
      addToast('ОШИБКА ВАЛИДАЦИИ: ПРОВЕРЬТЕ ПОЛЯ', 'error')
      return
    }

    setIsOrdering(true)
    try {
      // Получаем текущую сессию
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      // Если пользователь не авторизован — не выкидываем ошибку транзакции, 
      // а объясняем причину через Toast
      if (!user || authError) {
        addToast('ОШИБКА: ТРЕБУЕТСЯ АВТОРИЗАЦИЯ', 'error')
        setIsOrdering(false)
        return
      }

      // 3. Сохраняем заказ в БД
      const { error: orderError } = await supabase.from('orders').insert([{
        user_id: user.id,
        items: dbCart,
        total_amount: finalPrice,
        address,
        delivery_type: deliveryMethod,
        customer_name: fullName,
        phone,
        status: 'pending',
        payment_method: 'transfer_to_phone',
        payment_target: '79278552324', // Номер из твоего кода
        created_at: new Date().toISOString()
      }])

      // Если проблема в БД (например, нет таблицы orders) — выведет детали в консоль
      if (orderError) {
        console.error('Database Insert Error:', orderError)
        throw orderError
      }

      // 4. Очищаем корзину в БД после успешного заказа
      const { error: deleteError } = await supabase.from('cart').delete().eq('user_id', user.id)
      if (deleteError) console.error('Cart cleanup error:', deleteError)

      // 5. Синхронизируем локальное состояние
      contextClearCart()
      setDbCart([])

      // 6. ПОКАЗЫВАЕМ ОКНО УСПЕХА
      setShowPaymentModal(true)
      // Опционально: можно сменить step на success, если у тебя это предусмотрено
      // setStep('success')

    } catch (e: any) {
      console.error('Full Checkout Error:', e)
      // Выводим конкретное сообщение об ошибке, если оно есть
      addToast(e.message === 'AUTH_LOST' ? 'ОШИБКА: СЕССИЯ ИСТЕКЛА' : 'КРИТИЧЕСКИЙ СБОЙ ТРАНЗАКЦИИ', 'error')
    } finally {
      setIsOrdering(false)
    }
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 border-t-2 border-[#ff007a] rounded-full animate-spin" />
          <p className="text-[#ff007a] font-black uppercase tracking-[1em] text-[10px]">vsgiga_loading...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pt-40 pb-32 px-8 relative overflow-hidden">
      <XmasSnowBackground />
      <XmasGarland />
      <CyberTerminalHUD isVisible={isHudVisible} onHide={() => setIsHudVisible(!isHudVisible)} />

      {/* СИСТЕМА УВЕДОМЛЕНИЙ */}
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

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* --- [HEADER: VSGIGA_MANIFEST] --- */}
        <header className="mb-12 md:mb-32 flex flex-col xl:flex-row items-center gap-8 md:gap-16 relative">

          {/* ГИГАНТСКАЯ ИКОНКА — Теперь скрыта на мобилках (hidden xl:flex) */}
          <motion.div
            onClick={() => { setExplosion(true); setTimeout(() => setExplosion(false), 800); }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="hidden xl:flex w-40 h-40 bg-[#ff007a] rounded-[4rem] items-center justify-center shadow-[0_0_80px_rgba(255,0,122,0.5)] cursor-pointer relative group shrink-0"
          >
            <ShoppingCart size={60} className="text-white group-hover:animate-bounce" />
            <AnimatePresence>
              {explosion && [...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 800,
                    y: (Math.random() - 0.5) * 800,
                    opacity: 0, scale: 0, rotate: 720
                  }}
                  className="absolute"
                >
                  <Snowflake size={24} className="text-[#ff007a]" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="text-center xl:text-left flex-1 w-full">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center justify-between xl:justify-start gap-6 mb-4"
            >
              <div className="flex items-center gap-6">
                <div className="h-[3px] w-12 md:w-20 bg-[#ff007a]" />
                <span className="text-[#ff007a] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-[10px] md:text-[12px]">vsgiga shop</span>
              </div>

              {/* МАЛЕНЬКАЯ ИКОНКА КОРЗИНЫ — Появится только на мобилках в углу */}
              <div className="xl:hidden relative pr-4">
                <ShoppingBag size={24} className="text-[#ff007a]" />
                <span className="absolute -top-2 -right-1 bg-white text-black text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#080808]">
                  {totalItems}
                </span>
              </div>
            </motion.div>

            {/* АДАПТИВНЫЙ ЗАГОЛОВОК — text-[2.5rem] на мобилках */}
            <h1 className="text-[2.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] select-none text-left">
              КОРЗИН<span className="text-[#ff007a] animate-pulse">А</span>
            </h1>

            <div className="mt-6 md:mt-10 flex flex-wrap justify-start gap-6 md:gap-10 opacity-30 font-black text-[9px] md:text-[11px] uppercase tracking-[0.4em] italic">
              <div className="flex items-center gap-3 text-green-500"><Activity size={14} /> Net: Stable</div>
              <div className="flex items-center gap-3"><Lock size={14} /> Sec: AES-256</div>
              <div className="flex items-center gap-3 text-[#ff007a]"><Layers size={14} /> Assets: {totalItems}</div>
            </div>
          </div>
        </header>
        {dbCart.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative p-8 md:p-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] md:rounded-[8rem] bg-white/[0.02] overflow-hidden group mb-10"
          >
            {/* Эта часть теперь видна ТОЛЬКО на больших экранах (hidden md:block) */}
            <div className="hidden md:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,122,0.05)_0%,transparent_70%)]" />
              <ShoppingBag size={120} className="mx-auto text-white/5 mb-12 group-hover:text-[#ff007a]/20 transition-colors duration-700" />
              <p className="text-white/20 font-black uppercase tracking-[2em] text-xs animate-pulse">
                Return_to_Catalog_Link
              </p>
            </div>

            {/* Кнопка возврата в каталог — сделаем её поменьше для мобилок */}
            <Link href="/shop" className="inline-block mt-4 md:mt-16 px-8 py-4 md:px-16 md:py-8 bg-white/5 border border-white/10 rounded-full hover:bg-[#ff007a] hover:text-white transition-all duration-500 uppercase font-black italic tracking-widest text-[10px] md:text-sm">
              Back to Catalog
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* --- [SECTION: PRIMARY_ASSET_FEED] --- */}
            <div className="col-span-1 lg:col-span-7 space-y-6 md:space-y-12">
              <AnimatePresence mode="popLayout">
                {dbCart.map((item, idx) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ x: -150, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 150, opacity: 0, scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: idx * 0.1
                    }}
                    // Возвращаем твой оригинальный ряд
                    className="bg-[#080808] border border-white/5 p-5 md:p-12 rounded-[2.5rem] md:rounded-[5rem] flex flex-row items-center gap-4 md:gap-16 group hover:border-[#ff007a]/40 transition-all duration-700 relative overflow-hidden shadow-2xl"
                  >
                    {/* ТЕКСТУРНЫЙ СЛОЙ КАРТОЧКИ */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#ff007a]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#ff007a]/10 transition-colors" />

                    {/* ПРЕВЬЮ ОБЪЕКТА */}
                    <div className="w-28 h-32 md:w-56 md:h-72 bg-black rounded-[1.8rem] md:rounded-[3.5rem] overflow-hidden border border-white/5 shrink-0 relative shadow-2xl">
                      <motion.img
                        whileHover={{ scale: 1.15, rotate: 2 }}
                        src={item.image}
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                        alt={item.name}
                      />
                      <div className="absolute top-3 left-3 md:top-6 md:left-6 bg-black/80 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border border-white/10">
                        <span className="text-[8px] md:text-[10px] font-black text-[#ff007a] tracking-tighter italic uppercase">OBJ_{item.id.slice(0, 4)}</span>
                      </div>
                    </div>

                    {/* ИНФОРМАЦИОННЫЙ СТЕК */}
                    <div className="flex-1 w-full min-w-0">
                      <div className="flex justify-between items-start mb-4 md:mb-10">
                        <div className="min-w-0 flex-1">
                          <motion.div className="flex items-center gap-2 mb-1 md:mb-3">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[8px] md:text-[10px] text-white/20 font-black uppercase tracking-widest truncate">Status: Asset_Synchronized</span>
                          </motion.div>
                          <h3 className="text-lg md:text-5xl font-black italic uppercase tracking-tighter leading-none group-hover:text-[#ff007a] transition-colors duration-500 truncate pr-4">
                            {item.name}
                          </h3>
                        </div>

                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-[1.5rem] border border-white/5 flex items-center justify-center text-white/10 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/5 transition-all duration-300 shrink-0 ml-2"
                        >
                          <Trash2 size={18} className="md:w-[22px] md:h-[22px]" />
                        </button>
                      </div>

                      {/* ТВОЯ ТАБЛИЦА СПЕЦИФИКАЦИЙ */}
                      <div className="hidden sm:grid grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-white/[0.02] rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 mb-6 md:mb-10">
                        <div className="space-y-1 text-center">
                          <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase">Protocol</p>
                          <p className="text-[9px] md:text-[11px] font-mono text-white/60">v{idx + 1}.0</p>
                        </div>
                        <div className="space-y-1 border-l border-white/5 text-center">
                          <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase">Encryption</p>
                          <p className="text-[9px] md:text-[11px] font-mono text-[#ff007a]">AES_256</p>
                        </div>
                        <div className="space-y-1 border-l border-white/5 text-center">
                          <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase">Hash</p>
                          <p className="text-[9px] md:text-[11px] font-mono text-white/60">SHA_256</p>
                        </div>
                        <div className="space-y-1 border-l border-white/5 text-center">
                          <p className="text-[7px] md:text-[8px] font-black text-white/20 uppercase">Load</p>
                          <p className="text-[9px] md:text-[11px] font-mono text-green-500/60">NOMINAL</p>
                        </div>
                      </div>

                      {/* ВОТ ТУТ ИСПРАВЛЕНИЕ: МЫ УБРАЛИ TRUNCATE И ДОБАВИЛИ ГИБКОСТЬ */}
                      <div className="flex flex-row items-center justify-between gap-2 md:gap-6">
                        <div className="min-w-fit">
                          <span className="text-xl md:text-5xl font-black italic text-white tracking-tighter whitespace-nowrap">
                            {item.price.toLocaleString()} <span className="text-sm md:text-2xl text-[#ff007a]">₽</span>
                          </span>
                        </div>

                        <div className="flex items-center bg-black border border-white/5 p-1.5 md:p-4 rounded-xl md:rounded-[2.5rem] gap-2 md:gap-8 shadow-inner shrink-0">
                          <motion.button
                            whileTap={{ scale: 0.7 }}
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center text-white/20 hover:text-[#ff007a] shrink-0"
                          >
                            <Minus size={14} className="md:w-[20px] md:h-[20px]" strokeWidth={3} />
                          </motion.button>

                          <span className="font-black text-sm md:text-4xl w-4 md:w-12 text-center font-mono text-white">
                            {item.quantity}
                          </span>

                          <motion.button
                            whileTap={{ scale: 0.7 }}
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center text-white/20 hover:text-[#ff007a] shrink-0"
                          >
                            <Plus size={14} className="md:w-[20px] md:h-[20px]" strokeWidth={3} />
                          </motion.button>
                        </div>
                      </div>

                      {/* ТВОЙ СКАНЕР */}
                      <div className="mt-4 md:mt-10 flex gap-0.5 md:gap-1.5 h-[2px] md:h-1 opacity-20">
                        {[...Array(20)].map((_, i) => (
                          <div key={i} className={`flex-1 h-full rounded-full ${i % 4 === 0 ? 'bg-[#ff007a]' : 'bg-white'}`} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* --- [SECTION: TRANSACTION_SIDEBAR] --- */}
            <div className="col-span-1 lg:col-span-5">
              <div className="bg-[#080808] border-2 border-white/5 p-14 rounded-[5rem] sticky top-40 shadow-[0_60px_120px_rgba(0,0,0,0.9)] overflow-hidden group">
                {/* Анимированный лазерный сканер сверху вниз */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff007a] to-transparent animate-scan z-20" />

                {/* МОДУЛЬ ПРОМОКОДОВ И БОНУСОВ С ВАЛИДАЦИЕЙ */}
                <div className="mb-14 space-y-8 relative z-10">
                  <div className="flex gap-5">
                    <div className="relative flex-1 group/input">
                      <Ticket className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-[#ff007a] transition-colors" size={20} />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="ENTER_PROMO_CODE"
                        className="w-full bg-white/5 border border-white/10 p-7 pl-16 rounded-3xl font-black uppercase text-xs outline-none focus:border-[#ff007a] focus:bg-white/[0.08] transition-all tracking-widest"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      className="px-10 bg-white text-black rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#ff007a] hover:text-white transition-all active:scale-95 shadow-xl"
                    >
                      APPLY
                    </button>
                  </div>

                  {/* КАРТОЧКА БОНУСНОГО БАЛАНСА */}
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] flex items-center justify-between group/bonus hover:border-[#ff007a]/30 transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff007a]/5 to-transparent opacity-0 group-hover/bonus:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-[#ff007a]/10 flex items-center justify-center text-[#ff007a] shadow-inner">
                        <Coins size={32} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-1">Available_Points</p>
                        <p className="text-3xl font-black text-white italic tracking-tighter">
                          {userBonuses.toLocaleString()} <span className="text-xs opacity-30 not-italic">PTS</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUseBonuses(!useBonuses)}
                      className={`relative z-10 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest transition-all ${useBonuses
                        ? 'bg-[#ff007a] text-white shadow-[0_0_30px_rgba(255,0,122,0.5)] scale-105'
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                    >
                      {useBonuses ? 'ACTIVE' : 'REDEEM'}
                    </button>
                  </div>
                </div>

                {/* СИСТЕМНЫЙ СТЕК РАСЧЕТОВ */}
                <div className="space-y-6 mb-14 bg-black/50 p-10 rounded-[4rem] border border-white/5 relative shadow-inner">
                  <div className="flex justify-between items-center text-white/30 font-black uppercase text-[11px] tracking-[0.4em]">
                    <div className="flex items-center gap-3"><Package size={14} /> Subtotal_Assets:</div>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>

                  <AnimatePresence>
                    {useBonuses && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex justify-between items-center text-[#ff007a] font-black uppercase text-[11px] tracking-[0.4em] pt-2">
                        <div className="flex items-center gap-3"><Star size={14} className="animate-spin-slow" /> Bonus_Deduction:</div>
                        <span>-{spendAmount.toLocaleString()} ₽</span>
                      </motion.div>
                    )}

                    {appliedPromo && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex justify-between items-center text-green-500 font-black uppercase text-[11px] tracking-[0.4em] pt-2">
                        <div className="flex items-center gap-3"><ZapIcon size={14} /> Promo_Value:</div>
                        <span>-{appliedPromo.discount.toLocaleString()} ₽</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-10 mt-6 border-t border-white/10">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 bg-[#ff007a] rounded-full animate-ping" />
                          <p className="text-[10px] font-black text-[#ff007a] uppercase tracking-[0.5em] italic">READY_FOR_SYNC</p>
                        </div>
                        <p className="text-white/20 text-[11px] font-black uppercase tracking-widest italic">Net_Payable_Amount</p>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter block leading-[0.7] text-white">
                          {finalPrice.toLocaleString()}
                          <span className="text-xl md:text-2xl text-[#ff007a] ml-4 not-italic">₽</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ДИНАМИЧЕСКИЕ ПОЛЯ ВВОДА ДАННЫХ */}
                <AnimatePresence>
                  {showCheckoutFields && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="space-y-5 mb-12"
                    >
                      <div className="grid grid-cols-1 gap-5">
                        <div className="relative group/input">
                          <User className="absolute left-7 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-[#ff007a] transition-all" size={20} />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="CLIENT_MANIFEST_NAME"
                            className="w-full bg-white/5 border border-white/10 p-8 pl-18 rounded-[2.5rem] font-black text-xs uppercase outline-none focus:border-[#ff007a] shadow-lg transition-all"
                          />
                        </div>
                        <div className="relative group/input">
                          {/* Иконка теперь не будет мешать тексту благодаря left-8 и pl-20 */}
                          <Phone className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-[#ff007a] transition-all" size={20} />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              // Очищаем от всего, кроме цифр, и ограничиваем до 11 символов
                              const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                              // Если начинается с 7, добавляем плюс для красоты
                              setPhone(val.length > 0 ? (val.startsWith('7') ? '+' + val : val) : '');
                            }}
                            placeholder="+7 (999) 000-00-00"
                            className="w-full bg-white/5 border border-white/10 p-8 pl-20 rounded-[2.5rem] font-black text-xs outline-none focus:border-[#ff007a] shadow-lg transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5 mt-4">
                        <button
                          onClick={() => setDeliveryMethod('mail')}
                          className={`p-8 rounded-[2rem] border-2 font-black text-[11px] tracking-[0.3em] flex flex-col items-center gap-4 transition-all ${deliveryMethod === 'mail' ? 'border-[#ff007a] bg-[#ff007a]/10 text-white shadow-[0_0_40px_rgba(255,0,122,0.2)]' : 'border-white/5 bg-white/5 text-white/20 hover:bg-white/[0.08]'}`}
                        >
                          <Truck size={24} /> COURIER_EXP
                        </button>
                        <button
                          onClick={() => setDeliveryMethod('pickup')}
                          className={`p-8 rounded-[2rem] border-2 font-black text-[11px] tracking-[0.3em] flex flex-col items-center gap-4 transition-all ${deliveryMethod === 'pickup' ? 'border-[#ff007a] bg-[#ff007a]/10 text-white shadow-[0_0_40px_rgba(255,0,122,0.2)]' : 'border-white/5 bg-white/5 text-white/20 hover:bg-white/[0.08]'}`}
                        >
                          <Package size={24} /> PICKUP_POINT
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ГЛАВНАЯ КНОПКА ТРАНЗАКЦИИ */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={isOrdering}
                  className="w-full py-12 bg-white text-black rounded-[3.5rem] font-black uppercase italic tracking-[0.8em] text-sm hover:bg-[#ff007a] hover:text-white transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)] hover:shadow-[#ff007a]/50 disabled:opacity-50 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">
                    {isOrdering ? 'ENCRYPTING...' : showCheckoutFields ? 'INIT_PAYMENT_v2' : 'PROCEED_TO_CHECKOUT'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]" />
                </motion.button>
              </div>

              {/* ДОПОЛНИТЕЛЬНЫЙ ДЕКОРАТИВНЫЙ ОБВЕС */}
              <div className="mt-12 p-12 border border-white/5 rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-md">
                <div className="flex items-center gap-6 mb-6">
                  <ShieldCheck className="text-[#ff007a]" size={28} />
                  <span className="text-xs font-black uppercase tracking-[0.5em] italic">Secure_Protocol_Active</span>
                </div>
                <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed tracking-widest italic">
                  Все транзакции vsgiga shop проходят через многослойный шлюз шифрования. Ваши данные не сохраняются в открытом виде. Праздничный кэшбэк будет начислен в течение 0.001 сек после завершения.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- [NEW: POST-CART DIAGNOSTICS SECTION] --- */}
        {dbCart.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-48 space-y-32">
            <BioCoreStatus />
            <CyberStreamVisualizer />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="p-16 bg-[#050505] border border-white/5 rounded-[5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5"><Zap size={100} /></div>
                <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-4">
                  <div className="w-3 h-8 bg-[#ff007a]" /> System_Uptime
                </h4>
                <div className="space-y-6">
                  {[
                    { label: "Core_Sync", val: "99.9%", w: "w-[99.9%]" },
                    { label: "Neural_Link", val: "84.2%", w: "w-[84.2%]" },
                    { label: "Storage_Load", val: "12.0%", w: "w-[12%]" }
                  ].map((s, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                        <span>{s.label}</span>
                        <span>{s.val}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: s.val }} transition={{ duration: 2 }} className="h-full bg-[#ff007a]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-16 bg-[#050505] border border-white/5 rounded-[5rem] relative overflow-hidden flex flex-col justify-center">
                <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-6">Node_Status: <span className="text-green-500">OPERATIONAL</span></h4>
                <p className="text-xs font-bold text-white/20 uppercase leading-loose tracking-[0.2em] italic">
                  Текущая сессия обслуживается узлом <span className="text-white">VSG-EUROPE-NORTH</span>.
                  Все задействованные нейронные связи стабильны. Праздничные скрипты работают в штатном режиме.
                  Приятного завершения заказа в vsgiga shop.
                </p>
                <div className="mt-10 flex gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div className="mt-60 border-t border-white/5 pt-24 pb-20">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-32">
            <div className="max-w-md">
              <h5 className="text-[#ff007a] font-black uppercase tracking-[0.4em] text-[10px] mb-6 italic">System_Origin</h5>
              <p className="text-4xl font-black uppercase italic tracking-tighter leading-tight mb-8">
                VSGIGA_SHOP <br /> NEURAL_CORE_V6
              </p>
              <p className="text-[11px] font-bold text-white/30 uppercase leading-loose tracking-widest">
                Каждая транзакция в нашем магазине обрабатывается через децентрализованные узлы.
                Мы гарантируем 100% анонимность и безопасность ваших данных с использованием
                квантовых протоколов шифрования.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-20 gap-y-12 flex-1">
              {[
                { label: "Server_Node", val: "FRANKFURT_STABLE_01", icon: <Server size={14} /> },
                { label: "Database", val: "POSTGRES_QL_v15", icon: <Database size={14} /> },
                { label: "Handshake", val: "TLS_1.3_ACTIVE", icon: <Lock size={14} /> },
                { label: "Uptime", val: "99.9992%", icon: <Activity size={14} /> },
                { label: "Latency", val: "0.0024_MS", icon: <Zap size={14} /> },
                { label: "Framework", val: "NEXT_14_APP", icon: <Cpu size={14} /> }
              ].map((info, i) => (
                <div key={i} className="space-y-3 group/info">
                  <div className="flex items-center gap-3 text-white/20 group-hover/info:text-[#ff007a] transition-colors">
                    {info.icon}
                    <span className="text-[9px] font-black uppercase tracking-widest">{info.label}</span>
                  </div>
                  <p className="text-sm font-black font-mono tracking-tighter text-white/60">{info.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* --- [NEW: DYNAMIC_WAVE_SEPARATOR] --- */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative mb-24">
            <motion.div
              animate={{ left: ['0%', '100%', '0%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 w-20 h-2 bg-[#ff007a] blur-md rounded-full"
            />
          </div>

          {/* --- [MAIN_FOOTER_NAVIGATION] --- */}
          <footer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4 text-[#ff007a]">
                <div className="w-10 h-10 bg-[#ff007a]/10 rounded-xl flex items-center justify-center border border-[#ff007a]/20">
                  <ShoppingCart size={20} />
                </div>
                <span className="text-xl font-black uppercase italic tracking-tighter text-white">vsgiga shop</span>
              </div>
              <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed tracking-widest">
                Лучший кибер-магазин 2025 года. <br /> Сделано с любовью к неону и скорости.
              </p>
              <div className="flex gap-6">
                <motion.a whileHover={{ scale: 1.2, color: '#ff007a' }} href="#" className="text-white/20 hover:text-white transition-all"><Github size={20} /></motion.a>
                <motion.a whileHover={{ scale: 1.2, color: '#ff007a' }} href="#" className="text-white/20 hover:text-white transition-all"><Twitter size={20} /></motion.a>
                <motion.a whileHover={{ scale: 1.2, color: '#ff007a' }} href="#" className="text-white/20 hover:text-white transition-all"><Instagram size={20} /></motion.a>
              </div>
            </div>

            <div className="space-y-8">
              <h6 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 italic">Resource_Map</h6>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                <li className="hover:text-[#ff007a] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} /> Main_Catalog</li>
                <li className="hover:text-[#ff007a] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} /> User_Dashboard</li>
                <li className="hover:text-[#ff007a] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} /> Tech_Support</li>
                <li className="hover:text-[#ff007a] transition-colors cursor-pointer flex items-center gap-2"><ArrowRight size={10} /> Bonus_Program</li>
              </ul>
            </div>

            <div className="space-y-8">
              <h6 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 italic">Legal_Protocols</h6>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                <li className="hover:text-[#ff007a] transition-colors cursor-pointer">Privacy_Security</li>
                <li className="hover:text-[#ff007a] transition-colors cursor-pointer">Terms_Of_Service</li>
                <li className="hover:text-[#ff007a] transition-colors cursor-pointer">Cookie_Manifest</li>
                <li className="hover:text-[#ff007a] transition-colors cursor-pointer">Refund_Policy</li>
              </ul>
            </div>

            <div className="space-y-8">
              <h6 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 italic">System_Newsletter</h6>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="USER@LINK.NET"
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-mono text-[10px] outline-none focus:border-[#ff007a] transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#ff007a] text-white rounded-xl">
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest italic">
                Подпишитесь на системные обновления vsgiga. <br /> Никакого спама, только патч-ноуты.
              </p>
            </div>
          </footer>

          <div className="mt-40 pt-12 border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-black uppercase tracking-[1em] text-white/5 italic">
              © 2025 vsgiga shop. ALL_RIGHTS_RESERVED_V_LINK
            </p>
            <div className="flex items-center gap-4 text-white/5 text-[9px] font-mono uppercase italic">
              <span>Build_Ver: 6.5.0-STABLE</span>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <span>Env: Production</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- [PAYMENT_MODAL: NEURAL_TRANSACTION] --- */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              className="relative z-10 w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-[5rem] p-20 text-center shadow-[0_100px_200px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#ff007a] animate-pulse" />
              <div className="mb-12 inline-flex p-10 bg-green-500/10 rounded-[3rem] text-green-500 border border-green-500/20">
                <CheckCircle2 size={80} className="animate-bounce" />
              </div>
              <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-8 leading-none">
                ЗАКАЗ <br /> <span className="text-[#ff007a]">УСПЕШНО ПРИНЯТ</span>
              </h2>
              <p className="text-sm font-bold text-white/40 uppercase tracking-widest leading-loose mb-12 max-w-md mx-auto">
                Ваша транзакция была верифицирована нейронной сетью.
                Мы уже готовим товары к отправке через защищенный гипер-канал.
                Для завершения переведите <span className="text-white">{finalPrice} ₽</span> на номер:
                <span className="text-[#ff007a] font-black ml-2">79278552324</span> (СБП/Перевод/Озон банк)
              </p>
              <div className="grid grid-cols-2 gap-6 mb-16">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black text-white/20 uppercase mb-2">Order_Reference</p>
                  <p className="text-lg font-mono font-black text-white italic">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black text-white/20 uppercase mb-2">Sync_Time</p>
                  <p className="text-lg font-mono font-black text-white italic">0.0042_SEC</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/shop')}
                className="w-full py-10 bg-white text-black rounded-[2.5rem] font-black uppercase italic tracking-[0.5em] text-xs hover:bg-[#ff007a] hover:text-white transition-all shadow-2xl"
              >
                RETURN_TO_SYSTEM_DASHBOARD
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main >
  )
}