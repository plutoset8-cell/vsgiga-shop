'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Star, Maximize2 } from 'lucide-react'

// --- КОМПОНЕНТ ОТЗЫВОВ (ОСТАВЛЕН БЕЗ ИЗМЕНЕНИЙ) ---
function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [sending, setSending] = useState(false)

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
    }
    setSending(false)
  }

  return (
    <div className="mt-32 border-t border-white/10 pt-20">
      <div className="max-w-3xl">
        <h3 className="text-4xl font-black italic uppercase mb-12 tracking-tighter">
          User_Feedback<span className="text-[#d67a9d]">[{reviews.length}]</span>
        </h3>

        {/* ФОРМА ОТЗЫВА */}
        <form onSubmit={handleSubmitReview} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 mb-16 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase text-white/30 ml-4">Identification</label>
              <input 
                placeholder="ENTER_YOUR_NAME" 
                className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d67a9d] text-[10px] font-bold uppercase tracking-widest"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase text-white/30 ml-4">Rating_System</label>
              <div className="flex items-center justify-between bg-black/50 border border-white/10 p-4 rounded-2xl h-[62px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-all duration-300 ${rating >= star ? 'text-[#d67a9d] scale-110' : 'text-white/10'}`}
                  >
                    <Star size={20} fill={rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <label className="text-[8px] font-black uppercase text-white/30 ml-4">Transmission_Content</label>
            <textarea 
              placeholder="SHARE_YOUR_EXPERIENCE_WITH_VSGIGA" 
              className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#d67a9d] text-[10px] font-bold h-32 resize-none" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button 
            disabled={sending}
            className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#d67a9d] hover:text-white transition-all duration-500 disabled:opacity-50"
          >
            {sending ? 'UPLOADING_DATA...' : 'ESTABLISH_REVIEW'}
          </button>
        </form>

        {/* СПИСОК ОТЗЫВОВ */}
        <div className="space-y-6">
          {reviews.map((rev) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={rev.id} 
              className="bg-white/5 border border-white/5 p-8 rounded-3xl backdrop-blur-sm group hover:border-white/20 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase italic text-[#71b3c9] tracking-widest">{rev.user_name}</span>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill={i < rev.rating ? "#d67a9d" : "none"} className={i < rev.rating ? "text-[#d67a9d]" : "text-white/10"} />
                    ))}
                  </div>
                </div>
                <span className="text-[8px] text-white/20 font-black">{new Date(rev.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-white/70 text-xs leading-relaxed font-medium uppercase tracking-tight">{rev.comment}</p>
            </motion.div>
          ))}
          {reviews.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-white/20 italic text-[10px] font-black uppercase tracking-[0.4em]">Zero_Data_Points_Available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- ОСНОВНАЯ СТРАНИЦА ---
export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { showToast } = useToast()
  
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  // Новые стейты для галереи и зума
  const [activeImage, setActiveImage] = useState<string>('')
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' })

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
        showToast('PRODUCT_NOT_FOUND', 'error')
        router.push('/')
      }
      setLoading(false)
    }

    if (id) fetchProduct()
  }, [id, router, showToast])

  const handleAddToCart = () => {
    // ПРОВЕРКА: Если категория НЕ аксессуары и ЕСТЬ доступные размеры, то требуем выбор
    const hasSizes = product.sizes && product.sizes.length > 0 && product.category !== 'accessories';
    
    if (hasSizes && !selectedSize) {
      showToast('PLEASE_SELECT_SIZE', 'error')
      return
    }

    setAdding(true)
    addToCart({ ...product, selectedSize: hasSizes ? selectedSize : 'OS' })
    showToast(`${product.name.toUpperCase()} [${(hasSizes ? selectedSize : 'OS')}] // SECURED_IN_CART`, 'success')
    setTimeout(() => setAdding(false), 1000)
  }

  // Логика зума (перемещение мыши)
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
    <div className="min-h-screen bg-black flex items-center justify-center text-white italic tracking-[0.5em] animate-pulse">
      DECRYPTING_PRODUCT_DATA...
    </div>
  )

  if (!product) return null

  // Собираем все картинки в один массив для галереи
  const galleryImages = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image]

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* КНОПКА НАЗАД */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back_to_Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* ЛЕВАЯ КОЛОНКА: ГАЛЕРЕЯ И ЗУМ */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            {/* ГЛАВНОЕ ИЗОБРАЖЕНИЕ С ЗУМОМ */}
            <div 
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-zinc-900 border border-white/10 group cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src={activeImage} 
                alt={product.name}
                className="w-full h-full object-cover pointer-events-none"
              />
              
              {/* Слой зума */}
              <div 
                className="absolute inset-0 bg-no-repeat pointer-events-none z-10"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundSize: '200%',
                  ...zoomStyle
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="absolute bottom-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Maximize2 size={16} />
              </div>
            </div>

            {/* МИНИАТЮРЫ */}
            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`
                      relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0
                      ${activeImage === img ? 'border-[#d67a9d] scale-105' : 'border-white/10 opacity-50 hover:opacity-100'}
                    `}
                  >
                    <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ПРАВАЯ КОЛОНКА: ИНФО */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-[#d67a9d] font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              Sector: {product.category === 'apparel' ? 'APPAREL' : product.category === 'footwear' ? 'FOOTWEAR' : 'ACCESSORIES'}
            </span>
            
            <h1 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-none">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-12">
              <span className="text-4xl font-black italic text-[#71b3c9]">
                {product.price.toLocaleString()} ₽
              </span>
              <span className="text-white/20 text-xs font-bold uppercase tracking-widest">VAT_INCLUDED</span>
            </div>

            {/* ВЫБОР РАЗМЕРА (СКРЫВАЕТСЯ ДЛЯ АКСЕССУАРОВ ИЛИ ЕСЛИ ПУСТО) */}
            {product.category !== 'accessories' && product.sizes && product.sizes.length > 0 && (
              <div className="mb-12">
                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4 block">Select_Module_Size</label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s: any) => (
                    <button
                      key={s.size}
                      disabled={!s.inStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`
                        relative px-8 py-4 rounded-2xl font-black text-xs uppercase italic transition-all duration-300 border-2
                        ${!s.inStock ? 'opacity-20 cursor-not-allowed border-white/10 line-through' : 'cursor-pointer'}
                        ${selectedSize === s.size 
                          ? 'border-[#d67a9d] text-white bg-[#d67a9d]/10 shadow-[0_0_15px_rgba(214,122,157,0.3)]' 
                          : 'border-white/5 bg-white/5 text-white/60 hover:border-white/20'}
                      `}
                    >
                      {s.size}
                      {selectedSize === s.size && (
                        <motion.div 
                          layoutId="sizeGlow"
                          className="absolute inset-0 rounded-2xl border border-[#d67a9d] blur-[2px]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* БЛОК ХАРАКТЕРИСТИК */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <ShieldCheck className="text-[#d67a9d]" size={20} />
                <span className="text-[10px] font-bold uppercase">Original_Quality</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Truck className="text-[#71b3c9]" size={20} />
                <span className="text-[10px] font-bold uppercase">Fast_Logistics</span>
              </div>
            </div>

            {/* ОПИСАНИЕ */}
            <p className="text-white/50 text-sm leading-relaxed mb-12 font-medium uppercase tracking-tight whitespace-pre-wrap">
              {product.description || "NO_DESCRIPTION_AVAILABLE_IN_DATABASE"}
            </p>

            {/* КНОПКА ДОБАВЛЕНИЯ */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`
                group relative w-full py-6 rounded-3xl font-black uppercase italic tracking-[0.2em] transition-all duration-500
                ${adding ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-[#d67a9d] hover:text-white hover:scale-[1.02]'}
              `}
            >
              <span className="flex items-center justify-center gap-3">
                <ShoppingBag size={20} />
                {adding ? 'Secured_✓' : 'Initialize_Purchase'}
              </span>
            </button>

            {/* ТЕХНИЧЕСКИЙ ФУТЕР */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">
                <span>Global_ID: {product.id.slice(0,18)}</span>
                <span>vsgiga_Terminal_v2.0</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* СЕКЦИЯ ОТЗЫВОВ */}
        <ProductReviews productId={product.id} />
      </div>
    </main>
  )
}