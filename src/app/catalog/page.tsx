'use client'
import { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase' 
import { useToast } from '@/context/ToastContext'
import Link from 'next/link' 
import { X, Cpu, Database, Terminal, Activity, Zap, ShieldCheck, Globe, Server, Radio, Layers } from 'lucide-react'

// --- [НОВЫЙ ВИЗУАЛЬНЫЙ МОДУЛЬ: VSGIGA CORE HUD v9.0] ---
// Добавлено ~350 строк кода для создания атмосферы хай-тек магазина

function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Динамическая сетка нейросети */}
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.03]">
        <pattern id="vsgiga-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="white" />
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#vsgiga-grid)" />
      </svg>
      
      {/* Световые аномалии */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#d67a9d]/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#71b3c9]/10 blur-[130px] rounded-full animate-pulse delay-1000" />
      
      {/* Бегущая строка данных (декоративная) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d67a9d]/20 to-transparent animate-scan" />
    </div>
  )
}

function SystemStatusHUD() {
  const [logs, setLogs] = useState<string[]>([
    "SECURE_CONNECTION_ESTABLISHED",
    "NODE_SHARD_ACTIVE: 0x442",
    "DATABASE_LATENCY: 14ms"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        "CACHE_CLEARED_OK", 
        "ENCRYPTION_LAYER_STABLE", 
        "SYNCING_INVENTORY_REALTIME",
        `TRAFFIC_NODE_${Math.floor(Math.random() * 999)}_UP`,
        "VSGIGA_OS_STABLE"
      ];
      setLogs(prev => [...prev.slice(-3), messages[Math.floor(Math.random() * messages.length)]]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden xl:block fixed left-10 bottom-10 z-50 pointer-events-none">
      <div className="bg-black/80 border border-white/5 backdrop-blur-xl p-4 rounded-2xl w-64 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 text-[#d67a9d]">
          <Activity size={12} className="animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Live_Systems_Log</span>
        </div>
        <div className="space-y-2">
          {logs.map((log, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 0.4, x: 0 }} 
              key={i} 
              className="flex gap-2 items-center"
            >
              <span className="text-[8px] font-mono text-white tracking-tighter italic">{">"} {log}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
           <div className="flex gap-1">
              {[1,2,3].map(b => <div key={b} className="w-1 h-1 bg-[#d67a9d] rounded-full animate-bounce" style={{animationDelay: `${b*0.2}s`}} />)}
           </div>
           <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">vsgiga_core_v.5</span>
        </div>
      </div>
    </div>
  )
}

function CategoryDecor({ active }: { active: string }) {
  return (
    <div className="absolute -top-10 -left-10 opacity-10 pointer-events-none select-none">
      <span className="text-[120px] font-black text-white italic leading-none">{active.toUpperCase()}</span>
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
    if (categoryParam) {
      setActiveCategory(categoryParam)
    } else {
      setActiveCategory('all')
    }
  }, [categoryParam])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      let query = supabase.from('products').select('*').order('created_at', { ascending: false })
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
      }
      const { data, error } = await query
      if (data) setDbProducts(data)
      if (error) {
        console.error('Ошибка:', error.message)
        showToast('DATABASE_ERROR', 'error')
      }
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

  // --- [ИСПРАВЛЕННАЯ ФУНКЦИЯ ДОБАВЛЕНИЯ В БД] ---
  const handleAddToCart = async (product: any) => {
    setAddingId(product.id)
    
    try {
      // 1. Проверяем сессию пользователя
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        showToast('ПОЖАЛУЙСТА, ВОЙДИТЕ В АККАУНТ', 'error')
        router.push('/login')
        return
      }

      // 2. Добавляем в таблицу корзины Supabase
      const { error } = await supabase
        .from('cart')
        .insert([{
          user_id: session.user.id,
          product_id: product.id,
          quantity: 1,
          size: product.sizes?.[0]?.size || 'OS'
        }])

      if (error) {
        // Если товар уже в корзине (уникальный индекс), можно увеличить кол-во или просто выдать ошибку
        if (error.code === '23505') {
            showToast('ТОВАР УЖЕ В КОРЗИНЕ', 'success')
        } else {
            throw error
        }
      } else {
        showToast(`${product.name.toUpperCase()} // SYNCED_TO_CLOUD`, 'success')
      }

      // 3. Обновляем локальный стейт (хедер)
      addToCart(product)

    } catch (err: any) {
      console.error('Cart Error:', err.message)
      showToast('SYNC_FAILED', 'error')
    } finally {
      setTimeout(() => setAddingId(null), 800)
    }
  }

  const filteredProducts = activeCategory === 'all' 
    ? dbProducts 
    : dbProducts.filter((p: any) => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-black pt-32 pb-40 px-6 relative">
      <CyberBackground />
      <SystemStatusHUD />
      
      <div className="container mx-auto relative z-10">
        <div className="relative mb-20">
          <CategoryDecor active={activeCategory} />
          <h1 className="text-7xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-none">
            Inventory<span className="text-[#d67a9d]">_X</span>
          </h1>
          <div className="flex items-center gap-4 mt-4">
             <div className="h-[1px] w-20 bg-[#d67a9d]/50" />
             <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">vsgiga terminal protocol active</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-20 bg-white/[0.02] border border-white/5 p-2 rounded-[2rem] w-fit backdrop-blur-md">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black tracking-widest uppercase transition-all duration-500 ${
                activeCategory === cat.id 
                ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105' 
                : 'bg-transparent text-white/30 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-40 gap-6">
             <div className="w-12 h-12 border-2 border-[#d67a9d] border-t-transparent rounded-full animate-spin" />
             <span className="text-white font-black italic animate-pulse tracking-[0.5em] text-[10px]">INITIALIZING_vsgiga_DB...</span>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product: any) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  className="bg-[#0a0a0a] rounded-[3rem] p-5 border border-white/5 group hover:border-[#d67a9d]/50 transition-all duration-700 shadow-2xl relative overflow-hidden"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-[4/5] mb-8 overflow-hidden rounded-[2.2rem] bg-black relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[7px] font-black uppercase text-white/60">
                          {product.category}
                        </div>
                      </div>
                    </div>

                    <div className="px-2">
                      <h3 className="text-white font-black uppercase italic text-lg leading-tight mb-2 group-hover:text-[#d67a9d] transition-colors">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-[#71b3c9] font-black text-3xl italic tracking-tighter">{product.price.toLocaleString()}</span>
                        <span className="text-[10px] font-black text-[#d67a9d] uppercase">rub</span>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingId === product.id}
                    className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all relative overflow-hidden active:scale-95 ${
                      addingId === product.id 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white text-black hover:bg-[#d67a9d] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-3">
                      {addingId === product.id ? (
                        <>СИНХРОНИЗАЦИЯ...</>
                      ) : (
                        <>В КОРЗИНУ <Zap size={14} className="fill-current" /></>
                      )}
                    </span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Футер инфраструктуры */}
        <div className="mt-40 pt-20 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-20">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[#d67a9d]"><Database size={14}/><span className="text-[10px] font-black uppercase tracking-widest">Storage_Node</span></div>
               <p className="text-[8px] font-bold uppercase text-white/50">Supabase_PostgreSQL_Cloud<br/>Region: EU-Central</p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[#71b3c9]"><Globe size={14}/><span className="text-[10px] font-black uppercase tracking-widest">Edge_Network</span></div>
               <p className="text-[8px] font-bold uppercase text-white/50">Vercel_Global_CDN<br/>Latency: 0.002ms</p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-white/40"><ShieldCheck size={14}/><span className="text-[10px] font-black uppercase tracking-widest">Security_Protocol</span></div>
               <p className="text-[8px] font-bold uppercase text-white/50">SSL_Handshake_Active<br/>TLS_v1.3_Encrypted</p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[#d67a9d]"><Server size={14}/><span className="text-[10px] font-black uppercase tracking-widest">System_Status</span></div>
               <p className="text-[8px] font-bold uppercase text-white/50">99.9%_Uptime_Record<br/>Cluster: vsgiga_shop_v5</p>
            </div>
        </div>
      </div>
    </main>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden">
           <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1 }} className="w-1/2 h-full bg-[#d67a9d]" />
        </div>
        <div className="font-black italic tracking-[0.5em] text-[10px] uppercase text-white/40 animate-pulse">
           Decrypting_Inventory...
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
}