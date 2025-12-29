'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext' // Оставляем для совместимости, если нужно
import { useToast } from '@/context/ToastContext'
import {
  ArrowLeft, ShoppingBag, ShieldCheck, Truck, Star, Maximize2,
  Info, Package, MapPin, Activity, Zap, Ruler, X, Eye, Crosshair, Cpu
} from 'lucide-react'

// --- НОВЫЙ КОМПОНЕНТ: ТАБЛИЦА РАЗМЕРОВ (MODAL) ---
function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111] border border-white/10 p-8 rounded-[2rem] max-w-2xl w-full relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <h3 className="text-2xl font-black uppercase italic mb-6 text-[#d67a9d]">Калибровка_Размера_v2.0</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-widest">
                <th className="p-4">Размер (RU)</th>
                <th className="p-4">Грудь (CM)</th>
                <th className="p-4">Талия (CM)</th>
                <th className="p-4">Бедра (CM)</th>
                <th className="p-4">Рост (CM)</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold uppercase text-white/80">
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-[#d67a9d]">S / 46</td><td className="p-4">92-96</td><td className="p-4">80-84</td><td className="p-4">96-100</td><td className="p-4">170-176</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-[#d67a9d]">M / 48</td><td className="p-4">96-100</td><td className="p-4">84-88</td><td className="p-4">100-104</td><td className="p-4">176-182</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-[#d67a9d]">L / 50</td><td className="p-4">100-104</td><td className="p-4">88-92</td><td className="p-4">104-108</td><td className="p-4">182-188</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-[#d67a9d]">XL / 52</td><td className="p-4">104-108</td><td className="p-4">92-96</td><td className="p-4">108-112</td><td className="p-4">188+</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex items-center gap-3 text-[9px] text-white/30 uppercase italic border-t border-white/5 pt-4">
          <Info size={14} />
          <span>Допустимая погрешность: +/- 1.5 CM (Cyber_Fiber elasticity)</span>
        </div>
      </motion.div>
    </div>
  )
}

// --- НОВЫЙ КОМПОНЕНТ: НЕЙРО-РЕКОМЕНДАЦИИ ---
function NeuralRecommendations({ currentId }: { currentId: string }) {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const fetchRecs = async () => {
      // Берем случайные товары, исключая текущий
      const { data } = await supabase
        .from('products')
        .select('id, name, price, image, category')
        .neq('id', currentId)
        .limit(3)

      if (data) setItems(data)
    }
    fetchRecs()
  }, [currentId])

  if (items.length === 0) return null

  return (
    <div className="mt-32 border-t border-white/10 pt-16 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d67a9d] to-transparent opacity-50"></div>
      <div className="flex items-center gap-4 mb-10">
        <Cpu className="text-[#d67a9d] animate-pulse" />
        <h3 className="text-2xl font-black italic uppercase tracking-widest text-white">
          Нейросеть_Рекомендует
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <motion.a
            href={`/product/${item.id}`}
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group block bg-white/[0.02] border border-white/5 hover:border-[#d67a9d]/50 p-4 rounded-[2rem] transition-all hover:-translate-y-2"
          >
            <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-black">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="text-[8px] font-black text-[#d67a9d] uppercase tracking-widest">{item.category}</span>
              </div>
            </div>
            <h4 className="text-[12px] font-black uppercase italic truncate mb-2 group-hover:text-[#d67a9d] transition-colors">{item.name}</h4>
            <p className="text-[14px] font-bold text-white/60">{item.price.toLocaleString()} ₽</p>
          </motion.a>
        ))}
      </div>
    </div>
  )
}

// --- КОМПОНЕНТ ОТЗЫВОВ (Русифицирован) ---
function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [sending, setSending] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (productId) fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    if (data) setReviews(data)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !comment) return
    setSending(true)

    const { error } = await supabase.from('reviews').insert([
      { product_id: productId, user_name: name, comment, rating }
    ])

    if (!error) {
      setName('')
      setComment('')
      setRating(5)
      fetchReviews()
      showToast('ДАННЫЕ ОТПРАВЛЕНЫ В БЛОКЧЕЙН', 'success')
    } else {
      showToast('ОШИБКА ЗАПИСИ ДАННЫХ', 'error')
    }
    setSending(false)
  }

  return (
    <div className="mt-32 border-t border-white/10 pt-20">
      <div className="max-w-3xl">
        <h3 className="text-4xl font-black italic uppercase mb-12 tracking-tighter flex items-center gap-4">
          Обратная_Связь <span className="text-[#d67a9d] text-2xl font-mono">[{reviews.length}]</span>
        </h3>

        {/* ФОРМА ОТЗЫВА */}
        <form onSubmit={handleSubmitReview} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 mb-16 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#d67a9d] blur-[100px] opacity-20 pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase text-white/30 ml-4 flex items-center gap-2">
                <UserIcon /> Идентификация_Пользователя
              </label>
              <input
                placeholder="ВАШЕ ИМЯ / НИКНЕЙМ"
                className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d67a9d] text-[10px] font-bold uppercase tracking-widest placeholder:text-white/20 transition-all focus:bg-black/80"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase text-white/30 ml-4 flex items-center gap-2">
                <StarIcon /> Система_Рейтинга
              </label>
              <div className="flex items-center justify-between bg-black/50 border border-white/10 p-4 rounded-2xl h-[62px] hover:border-white/20 transition-colors">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-all duration-300 transform active:scale-90 ${rating >= star ? 'text-[#d67a9d] scale-110 drop-shadow-[0_0_10px_rgba(214,122,157,0.5)]' : 'text-white/10 hover:text-white/30'}`}
                  >
                    <Star size={20} fill={rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-6 relative z-10">
            <label className="text-[8px] font-black uppercase text-white/30 ml-4 flex items-center gap-2">
              <MessageIcon /> Текст_Трансмиссии
            </label>
            <textarea
              placeholder="ОПИШИТЕ ВАШ ОПЫТ ИСПОЛЬЗОВАНИЯ ПРОДУКТА VSGIGA..."
              className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d67a9d] text-[10px] font-bold h-32 resize-none placeholder:text-white/20 transition-all focus:bg-black/80"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button
            disabled={sending}
            className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#d67a9d] hover:text-white transition-all duration-500 disabled:opacity-50 relative overflow-hidden group"
          >
            <span className="relative z-10">{sending ? 'ЗАГРУЗКА_ДАННЫХ...' : 'ОПУБЛИКОВАТЬ_ОТЗЫВ'}</span>
            <div className="absolute inset-0 bg-[#d67a9d] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </form>

        {/* СПИСОК ОТЗЫВОВ */}
        <div className="space-y-6">
          {reviews.map((rev) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={rev.id}
              className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-sm group hover:border-white/20 transition-all hover:bg-white/[0.04]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase italic text-[#71b3c9] tracking-widest glow-text">{rev.user_name}</span>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill={i < rev.rating ? "#d67a9d" : "none"} className={i < rev.rating ? "text-[#d67a9d]" : "text-white/10"} />
                    ))}
                  </div>
                </div>
                <span className="text-[8px] text-white/20 font-black font-mono">{new Date(rev.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-white/70 text-xs leading-relaxed font-medium uppercase tracking-tight">{rev.comment}</p>
            </motion.div>
          ))}
          {reviews.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <p className="text-white/20 italic text-[10px] font-black uppercase tracking-[0.4em]">БАЗА_ДАННЫХ_ПУСТА</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Вспомогательные иконки для формы
const UserIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const MessageIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
// --- ОСНОВНАЯ СТРАНИЦА ---
export default function ProductPage() {
  const { addToCart } = useCart();
  const { id } = useParams()
  const router = useRouter()
  // Оставляем useCart если он нужен для header, но основная логика теперь через DB
  const { showToast } = useToast()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  // Новые состояния для визуала
  const [activeImage, setActiveImage] = useState<string>('')
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' })
  const [liveViewers, setLiveViewers] = useState(0)

  // Эффект "Живого просмотра"
  useEffect(() => {
    // Симуляция живых просмотров
    setLiveViewers(Math.floor(Math.random() * 15) + 3)
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.max(2, prev + Math.floor(Math.random() * 5) - 2))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setProduct(data)
        const initialImage = (data.images && data.images.length > 0) ? data.images[0] : data.image
        setActiveImage(initialImage)
      } else {
        showToast('ТОВАР НЕ НАЙДЕН В РЕЕСТРЕ', 'error')
        router.push('/')
      }
      setLoading(false)
    }

    if (id) fetchProduct()
  }, [id, router, showToast])

  // --- ОБНОВЛЕННАЯ ФУНКЦИЯ ДОБАВЛЕНИЯ В КОРЗИНУ (БАЗА ДАННЫХ) ---
  const handleAddToCart = async () => {
    // Проверка наличия размеров (исключая аксессуары)
    const hasSizes = product.sizes && product.sizes.length > 0 && product.category !== 'accessories';

    if (hasSizes && !selectedSize) {
      showToast('ОШИБКА: НЕ ВЫБРАН РАЗМЕР МОДУЛЯ', 'error')
      return
    }

    setAdding(true)

    try {
      // 1. Проверяем авторизацию
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        showToast('ТРЕБУЕТСЯ АВТОРИЗАЦИЯ В СЕТИ', 'error')
        sessionStorage.setItem('redirect_after_login', `/product/${id}`)
        router.push('/login')
        return
      }

      // 2. Подготовка данных
      const sizeToSave = hasSizes ? selectedSize : 'OS'

      // 3. Отправка в Supabase (Таблица cart)
      // Мы используем upsert, чтобы обновить размер, если товар уже в корзине
      const { error: dbError } = await supabase
        .from('cart')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          size: sizeToSave,
          quantity: 1
        }, {
          onConflict: 'user_id, product_id, size',
          ignoreDuplicates: false
        })

      if (dbError) throw dbError;

      // 4. СИНХРОНИЗАЦИЯ С ИНТЕРФЕЙСОМ
      // Вызываем addToCart, который мы достали из useCart() на уровне компонента
      if (typeof addToCart === 'function') {
        addToCart({
          ...product,
          size: sizeToSave, // Твой реальный размер (например, "33")
          quantity: 1
        });
      }

      showToast('ОБЪЕКТ ИНТЕГРИРОВАН В КОРЗИНУ', 'success')

    } catch (err: any) {
      console.error('Ошибка при добавлении в корзину:', err)
      showToast('КРИТИЧЕСКИЙ СБОЙ СИНХРОНИЗАЦИИ', 'error')
    } finally {
      setAdding(false)
    }
  }
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle(prev => ({ ...prev, display: 'none' }))
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
      <div className="w-12 h-12 border-4 border-[#d67a9d] border-t-transparent rounded-full animate-spin"></div>
      <p className="italic tracking-[0.5em] text-[10px] animate-pulse text-[#d67a9d]">ДЕШИФРОВКА_ДАННЫХ_ТОВАРА...</p>
    </div>
  )

  if (!product) return null

  const galleryImages = (product.images && product.images.length > 0)
    ? product.images
    : [product.image]

  return (
    <main className="min-h-screen bg-black text-white pt-20 md:pt-32 pb-10 md:pb-20 px-4 md:px-6 overflow-x-hidden relative">
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />

      {/* ФОНОВЫЕ ЭЛЕМЕНТЫ */}
      <div className="fixed top-20 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#71b3c9] opacity-5 blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#d67a9d] opacity-5 blur-[100px] md:blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 md:mb-8 group uppercase text-[9px] md:text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          ВЕРНУТЬСЯ_В_КАТАЛОГ
        </button>

        {/* СТРОКА СТАТУСА (LIVE TICKER) - Адаптирована под мобилки */}
        <div className="mb-6 md:mb-10 flex items-center gap-3 md:gap-4 bg-white/[0.03] border border-white/5 p-2 md:p-3 rounded-full w-fit px-4 md:px-6 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5 md:h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/70">
            LIVE: <span className="text-white">{liveViewers} СМОТРЯТ</span>
          </span>
          <div className="h-3 w-px bg-white/10 mx-1"></div>
          <Eye size={10} className="text-[#d67a9d]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-start">

          {/* ЛЕВАЯ КОЛОНКА: ИЗОБРАЖЕНИЯ */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4 md:gap-6 sticky top-24 md:top-32"
          >
            <div
              className="relative aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-[#080808] border border-white/10 group cursor-crosshair shadow-2xl"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Бейджи */}
              <div className="absolute top-4 left-4 md:top-6 left-6 z-20 flex flex-wrap gap-2">
                <div className="bg-black/60 backdrop-blur-md px-2 md:px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[7px] md:text-[8px] font-black text-[#d67a9d] uppercase tracking-widest">VSGIGA_OFFICIAL</span>
                </div>
                {product.price > 10000 && (
                  <div className="bg-black/60 backdrop-blur-md px-2 md:px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[7px] md:text-[8px] font-black text-[#71b3c9] uppercase tracking-widest">PREMIUM_GRADE</span>
                  </div>
                )}
              </div>

              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
              />

              {/* Лупа (только для десктопа) */}
              <div
                className="hidden md:block absolute inset-0 bg-no-repeat pointer-events-none z-10 mix-blend-hard-light"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundSize: '250%',
                  ...zoomStyle
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            {/* Галлерея - Скролл на мобилках */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {galleryImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`
                      relative w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden border transition-all shrink-0 snap-center
                      ${activeImage === img ? 'border-[#d67a9d] shadow-[0_0_15px_rgba(214,122,157,0.3)] scale-100' : 'border-white/10 opacity-60 hover:opacity-100 scale-95'}
                    `}
                  >
                    <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ПРАВАЯ КОЛОНКА: ИНФОРМАЦИЯ */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col pt-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-[#d67a9d] rounded-full animate-pulse"></span>
              <span className="text-[#d67a9d] font-black uppercase tracking-[0.3em] text-[10px]">
                СЕКТОР: {product.category === 'apparel' ? 'ОДЕЖДА' : product.category === 'footwear' ? 'ОБУВЬ' : 'АКСЕССУАРЫ'}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
              {product.name}
            </h1>

            <div className="flex items-end gap-5 mb-10 pb-8 border-b border-white/5">
              <span className="text-5xl font-black italic text-[#71b3c9] drop-shadow-[0_0_15px_rgba(113,179,201,0.3)]">
                {product.price.toLocaleString()} ₽
              </span>
              <div className="flex flex-col mb-1">
                <span className="text-[#d67a9d] text-[10px] font-bold uppercase tracking-widest line-through decoration-[#d67a9d]">
                  {(product.price * 1.2).toLocaleString()} ₽
                </span>
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest">ВКЛЮЧАЯ НАЛОГИ</span>
              </div>
            </div>

            {/* БЛОК ХАРАКТЕРИСТИК (СПЕЦИФИКАЦИИ) */}
            <div className="mb-12 bg-[#0a0a0a] rounded-[2rem] border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Crosshair size={16} className="text-[#d67a9d]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">ТЕХНИЧЕСКИЕ_ДАННЫЕ</span>
                  </div>
                  <div className="px-2 py-1 border border-[#d67a9d]/30 rounded text-[8px] text-[#d67a9d] uppercase">Verified</div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'ПРОИСХОЖДЕНИЕ', value: product.origin || 'РЕСПУБЛИКА_КОРЕЯ' },
                    { label: 'СОСТАВ', value: product.material || 'CYBER_FIBER_SYNTH / COTTON' },
                    { label: 'АРТИКУЛ', value: product.article || product.id.slice(0, 8).toUpperCase() },
                    { label: 'СТАТУС', value: 'ГОТОВ К ОТПРАВКЕ' }
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between border-b border-white/5 pb-2 hover:pl-2 transition-all duration-300 cursor-default">
                      <span className="text-[9px] font-bold text-white/30 uppercase italic">{spec.label}</span>
                      <span className="text-[10px] font-black text-white uppercase">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* БЛОК РАЗМЕРОВ */}
            {product.category !== 'accessories' && product.sizes && product.sizes.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest block flex items-center gap-2">
                    <Ruler size={14} /> ВЫБЕРИТЕ_РАЗМЕР_МОДУЛЯ
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[9px] text-[#71b3c9] uppercase font-bold hover:text-white transition-colors border-b border-[#71b3c9]/30 hover:border-white pb-0.5"
                  >
                    ТАБЛИЦА РАЗМЕРОВ
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s: any) => (
                    <button
                      key={s.size}
                      disabled={!s.inStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`
                        relative w-16 h-16 rounded-2xl font-black text-sm uppercase italic transition-all duration-300 border-2 overflow-hidden group
                        ${!s.inStock ? 'opacity-20 cursor-not-allowed border-white/5 bg-white/5' : 'cursor-pointer'}
                        ${selectedSize === s.size
                          ? 'border-[#d67a9d] text-white bg-[#d67a9d]/10 shadow-[0_0_20px_rgba(214,122,157,0.4)]'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30 hover:bg-white/5'}
                      `}
                    >
                      <span className="relative z-10">{s.size}</span>
                      {!s.inStock && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-full h-px bg-white/30 rotate-45"></div></div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* БЛОК ДОСТАВКИ */}
            <div className="mb-10 grid grid-cols-1 gap-4">
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 flex items-start gap-5 hover:bg-white/[0.04] transition-colors group">
                <div className="p-3 bg-[#71b3c9]/10 rounded-2xl group-hover:bg-[#71b3c9]/20 transition-colors">
                  <Package className="text-[#71b3c9]" size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase block mb-1">ЛОГИСТИЧЕСКИЙ ТЕРМИНАЛ</span>
                  <span className="text-[9px] text-white/40 uppercase font-bold italic">РАСЧЕТНОЕ ВРЕМЯ: 2-4 ЦИКЛА (ДНЯ)</span>
                </div>
              </div>
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 flex items-start gap-5 hover:bg-white/[0.04] transition-colors group">
                <div className="p-3 bg-[#d67a9d]/10 rounded-2xl group-hover:bg-[#d67a9d]/20 transition-colors">
                  <MapPin className="text-[#d67a9d]" size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase block mb-1">ТОЧКИ ДОСТУПА</span>
                  <span className="text-[9px] text-white/40 uppercase font-bold italic">ДОСТУПНА ГЛОБАЛЬНАЯ ТЕЛЕПОРТАЦИЯ (ПОЧТА/СДЭК)</span>
                </div>
              </div>
            </div>

            <p className="text-white/60 text-xs leading-loose mb-12 font-medium uppercase tracking-wide whitespace-pre-wrap border-l-2 border-[#d67a9d]/50 pl-6">
              {product.description || "ОПИСАНИЕ ОТСУТСТВУЕТ В БАЗЕ ДАННЫХ. ЗАПРОСИТЕ ИНФОРМАЦИЮ У ОПЕРАТОРА."}
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`
                  group relative w-full py-7 rounded-[2rem] font-black uppercase italic tracking-[0.25em] text-sm transition-all duration-500 overflow-hidden shadow-2xl
                  ${adding ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-[#d67a9d] hover:text-white hover:scale-[1.01] hover:shadow-[0_10px_40px_rgba(214,122,157,0.4)]'}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="flex items-center justify-center gap-4 relative z-10">
                  <ShoppingBag size={20} className={adding ? 'animate-bounce' : ''} />
                  {adding ? 'ПРОТОКОЛ_ЗАГРУЗКИ...' : 'ИНИЦИАЛИЗИРОВАТЬ ПОКУПКУ'}
                </span>
              </button>

              <div className="flex justify-center items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-[0.5em] mt-2">
                <ShieldCheck size={12} />
                <span>БЕЗОПАСНАЯ ТРАНЗАКЦИЯ</span>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
              <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.5em] font-mono">
                <span>ID: {product.id.slice(0, 18)}...</span>
                <span>VSG_SYSTEM_v5.0</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* НОВЫЙ БЛОК: РЕКОМЕНДАЦИИ */}
        <NeuralRecommendations currentId={product.id} />

        {/* БЛОК ОТЗЫВОВ */}
        <ProductReviews productId={product.id} />
      </div>
    </main>
  )
}