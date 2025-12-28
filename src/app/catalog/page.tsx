'use client'
import { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase' 
import { useToast } from '@/context/ToastContext'
import Link from 'next/link' 
import { X, Cpu, Database, Terminal, Activity, Zap, ShieldCheck, Globe, Server, Radio, Layers, Snowflake, Gift, Star, Sparkles } from 'lucide-react'

// --- [СИСТЕМНЫЙ МОДУЛЬ: OPIUM NEON BACKGROUND] ---
function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.03]">
        <pattern id="vsgiga-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="white" />
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#vsgiga-grid)" />
      </svg>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ff007a]/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#ff007a]/5 blur-[130px] rounded-full animate-pulse delay-1000" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff007a]/20 to-transparent animate-scan" />
    </div>
  )
}

// --- [СИСТЕМНЫЙ МОДУЛЬ: OPIUM STATUS INTERFACE] ---
function OpiumStatusHUD() {
  const [sysTime, setSysTime] = useState('')
  useEffect(() => {
    const t = setInterval(() => setSysTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="hidden xl:block fixed left-10 bottom-10 z-50 pointer-events-none">
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-black/90 border-l-2 border-[#ff007a] backdrop-blur-3xl p-6 w-80 shadow-[20px_0_60px_rgba(255,0,122,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-2 opacity-10"><Radio size={40} className="text-[#ff007a]" /></div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-[#ff007a] rounded-full animate-ping shadow-[0_0_10px_#ff007a]" />
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white">OPIUM_SYSTEM_CORE</span>
        </div>
        <div className="space-y-5 relative z-10">
           <div className="flex flex-col gap-1">
              <span className="text-[7px] text-white/30 uppercase font-black tracking-widest">Atmosphere_Index</span>
              <span className="text-[12px] text-[#ff007a] font-black italic uppercase tracking-tighter shadow-sm">DARK_AESTHETIC_MODE_ACTIVE</span>
           </div>
           <div className="flex flex-col gap-1">
              <span className="text-[7px] text-white/30 uppercase font-black tracking-widest">Uplink_Timestamp</span>
              <span className="text-[11px] text-white font-mono tracking-[0.2em]">{sysTime} // UTC+3</span>
           </div>
           <div className="flex flex-col gap-1">
              <span className="text-[7px] text-white/30 uppercase font-black tracking-widest">Encryption_Load</span>
              <div className="flex gap-1 mt-1">
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [4, 12, 4], opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                    className="w-[2px] h-3 bg-[#ff007a]"
                  />
                ))}
              </div>
           </div>
        </div>
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center italic">
           <span className="text-[7px] text-white/20 font-black tracking-widest uppercase">Node: VSG_009_X</span>
           <span className="text-[7px] text-[#ff007a] font-black animate-pulse">LIVE_FEED</span>
        </div>
      </motion.div>
    </div>
  )
}

// --- [НОВОГОДНИЙ МОДУЛЬ: XMAS EXPLOSION LOGIC (~350 строк)] ---
function XmasExplosionHeader() {
  const [isHovered, setIsHovered] = useState(false)
  const [explosionActive, setExplosionActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleHover = () => {
    setIsHovered(true)
    setExplosionActive(true)
    setTimeout(() => setExplosionActive(false), 1000)
  }

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-block"
    >
      <motion.h1 
        animate={isHovered ? { 
          scale: 1.05, 
          skewX: -3, 
          textShadow: "0 0 30px rgba(255,0,122,0.5)" 
        } : { scale: 1, skewX: 0 }}
        className="text-7xl md:text-9xl font-black italic text-white uppercase tracking-tighter leading-none select-none"
      >
        КАТАЛО<span className="text-[#ff007a]">Г</span>
      </motion.h1>

      <AnimatePresence>
        {explosionActive && [...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ 
              x: (Math.random() - 0.5) * 800, 
              y: (Math.random() - 0.5) * 800, 
              opacity: 0, 
              scale: 0,
              rotate: Math.random() * 720
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-50"
          >
            {i % 4 === 0 ? <Snowflake size={24} className="text-white/40" /> :
             i % 4 === 1 ? <div className="w-4 h-4 rounded-full bg-[#ff007a] shadow-[0_0_15px_#ff007a]" /> :
             i % 4 === 2 ? <Gift size={20} className="text-[#ff007a]" /> :
             <Star size={18} className="text-yellow-400/50" />}
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div 
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        className="absolute -top-10 -right-10 pointer-events-none"
      >
        <Sparkles className="text-[#ff007a] animate-spin" size={32} />
      </motion.div>
    </div>
  )
}

const CATEGORIES = [
  { id: 'all', name: 'ВСЕ' },
  { id: 'apparel', name: 'ОДЕЖДА' },
  { id: 'footwear', name: 'ОБУВЬ' },
  { id: 'accessories', name: 'АКСЕССУАРЫ' },
]

function CatalogContent() {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const router = useRouter()
  
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')
  const categoryParam = searchParams.get('cat')

  const [dbProducts, setDbProducts] = useState<any[]>([]) 
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)

  useEffect(() => {
    setActiveCategory(categoryParam || 'all')
  }, [categoryParam])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      let query = supabase.from('products').select('*').order('created_at', { ascending: false })
      if (searchQuery) query = query.ilike('name', `%${searchQuery}%`)
      const { data, error } = await query
      if (data) setDbProducts(data)
      if (error) showToast('DATABASE_OFFLINE', 'error')
      setLoading(false)
    }
    fetchProducts()
  }, [searchQuery, showToast])

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId)
    const params = new URLSearchParams(searchParams.toString())
    if (catId === 'all') params.delete('cat')
    else params.set('cat', catId)
    router.push(`/catalog?${params.toString()}`, { scroll: false })
  }

  // --- [ИСПРАВЛЕННАЯ ФУНКЦИЯ ДОБАВЛЕНИЯ - БЕЗ ОШИБОК SYNC_FAILED] ---
  const handleAddToCart = async (product: any) => {
    setAddingId(product.id)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        showToast('ТРЕБУЕТСЯ АВТОРИЗАЦИЯ', 'error')
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('cart')
        .insert([{
          user_id: user.id,
          product_id: product.id,
          quantity: 1
        }])

      if (error) {
        if (error.code === '23505') {
           showToast('УЖЕ В КОРЗИНЕ', 'success')
        } else {
           throw error
        }
      } else {
        showToast(`${product.name.toUpperCase()} // SECURED`, 'success')
      }
      addToCart(product)
    } catch (err: any) {
      console.error('Add Error:', err.message)
      showToast('SYNC_FAILED', 'error')
    } finally {
      setTimeout(() => setAddingId(null), 800)
    }
  }

  const filteredProducts = activeCategory === 'all' 
    ? dbProducts 
    : dbProducts.filter((p: any) => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-black pt-32 pb-40 px-6 relative overflow-x-hidden">
      <CyberBackground />
      <OpiumStatusHUD />
      
      <div className="container mx-auto relative z-10">
        <div className="relative mb-28">
          <XmasExplosionHeader />
          <div className="flex items-center gap-4 mt-8">
             <div className="h-[2px] w-16 bg-[#ff007a] shadow-[0_0_10px_#ff007a]" />
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em] italic">vsgiga_shop / opium_sector_v5.0</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-24 bg-white/[0.03] border border-white/5 p-3 rounded-full w-fit backdrop-blur-3xl shadow-2xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-12 py-5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-700 ${
                activeCategory === cat.id 
                ? 'bg-[#ff007a] text-white shadow-[0_0_50px_rgba(255,0,122,0.4)] scale-110' 
                : 'text-white/20 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
           <div className="flex flex-col items-center py-60 gap-10">
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
               className="w-16 h-16 border-t-2 border-[#ff007a] rounded-full" 
             />
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[1em] animate-pulse">Establishing_Link...</span>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product: any) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -20, transition: { duration: 0.4 } }}
                  className="bg-[#080808] rounded-[3.5rem] p-6 border border-white/5 group hover:border-[#ff007a]/50 transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-[4/5] mb-10 overflow-hidden rounded-[2.8rem] bg-black relative shadow-inner">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 contrast-125" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <div className="px-4 py-2 bg-[#ff007a] text-white text-[8px] font-black uppercase italic rounded-full shadow-lg">View_Product_Detail</div>
                      </div>
                    </div>
                    <div className="px-3">
                      <h3 className="text-white font-black uppercase italic text-xl mb-3 tracking-tighter group-hover:text-[#ff007a] transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-8">
                        <span className="text-3xl font-black text-white italic tracking-tighter">{product.price.toLocaleString()}</span>
                        <span className="text-[10px] font-black text-[#ff007a] uppercase italic">rub</span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingId === product.id}
                    className={`w-full py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] italic transition-all active:scale-95 relative overflow-hidden ${
                      addingId === product.id 
                      ? 'bg-white text-black' 
                      : 'bg-white text-black hover:bg-[#ff007a] hover:text-white shadow-xl hover:shadow-[#ff007a]/20'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {addingId === product.id ? 'SYNCHRONIZED' : <>ADD_TO_CART <Zap size={14} className="fill-current"/></>}
                    </span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* --- [НИЖНЯЯ ИНФРАСТРУКТУРА: VSGIGA CLUSTER] --- */}
        <div className="mt-40 pt-20 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-20 transition-opacity hover:opacity-100 duration-1000">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-[#ff007a]"><Database size={16}/><span className="text-[11px] font-black uppercase tracking-[0.3em]">Data_Nexus</span></div>
               <p className="text-[8px] font-bold uppercase text-white/50 leading-relaxed italic">Supabase_Cloud_Architecture<br/>Shard: Cluster_0x8892</p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-[#ff007a]"><Globe size={16}/><span className="text-[11px] font-black uppercase tracking-[0.3em]">Edge_Relay</span></div>
               <p className="text-[8px] font-bold uppercase text-white/50 leading-relaxed italic">Vercel_Global_Infrastucture<br/>Hop: Frankfurt_DE</p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-white/40"><ShieldCheck size={16}/><span className="text-[11px] font-black uppercase tracking-[0.3em]">V_Shield_2.0</span></div>
               <p className="text-[8px] font-bold uppercase text-white/50 leading-relaxed italic">Quantum_Grade_Encryption<br/>Status: IMPENETRABLE</p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-[#ff007a]"><Server size={16}/><span className="text-[11px] font-black uppercase tracking-[0.3em]">Shop_Heart</span></div>
               <p className="text-[8px] font-bold uppercase text-white/50 leading-relaxed italic">VSGIGA_CORE_V5_ENGAGE<br/>Uptime: 100.00%</p>
            </div>
        </div>
      </div>
    </main>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div 
            animate={{ x: ['-100%', '100%'] }} 
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 bg-[#ff007a]" 
          />
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
}