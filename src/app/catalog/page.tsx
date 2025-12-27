'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation' // Добавили useRouter для смены URL
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase' 
import { useToast } from '@/context/ToastContext'
import Link from 'next/link' 
import { X } from 'lucide-react'

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
  const categoryParam = searchParams.get('cat') // Слушаем категорию из URL

  const [dbProducts, setDbProducts] = useState<any[]>([]) 
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)

  // 1. СИНХРОНИЗАЦИЯ КАТЕГОРИИ: Если в URL есть ?cat=, меняем активную кнопку
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
      
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
      }

      const { data, error } = await query

      if (data) {
        setDbProducts(data)
      }
      if (error) {
        console.error('Ошибка загрузки каталога:', error.message)
        showToast('CATALOG_FETCH_ERROR', 'error')
      }
      setLoading(false)
    }

    fetchProducts()
  }, [searchQuery])

  // 2. УМНАЯ СМЕНА КАТЕГОРИИ: Обновляем и стейт, и URL
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId)
    const params = new URLSearchParams(searchParams.toString())
    if (catId === 'all') {
      params.delete('cat')
    } else {
      params.set('cat', catId)
    }
    router.push(`/catalog?${params.toString()}`, { scroll: false })
  }

  const handleAddToCart = (product: any) => {
    setAddingId(product.id)
    addToCart(product)
    
    showToast(`${product.name.toUpperCase()} // ADDED_TO_CART`, 'success')

    setTimeout(() => {
      setAddingId(null)
    }, 800)
  }

  const filteredProducts = activeCategory === 'all' 
    ? dbProducts 
    : dbProducts.filter((p: any) => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter">
              Catalog<span className="text-[#d67a9d]">_vsgiga</span>
            </h1>
            
            <AnimatePresence>
              {searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mt-4"
                >
                  <span className="text-[10px] font-black text-[#71b3c9] uppercase tracking-[0.2em]">Результаты по запросу: {searchQuery}</span>
                  <Link href="/catalog" className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                    <X size={12} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)} // Используем новую функцию
              className={`px-8 py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border ${
                activeCategory === cat.id 
                ? 'bg-[#d67a9d] border-[#d67a9d] text-white' 
                : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading && (
           <div className="text-white font-black italic animate-pulse tracking-widest text-center py-20">
             SYNCHRONIZING_INVENTORY...
           </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product: any) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/5 rounded-[2.5rem] p-4 border border-white/10 group hover:border-[#d67a9d]/30 transition-colors duration-500 flex flex-col justify-between"
                >
                  <Link href={`/product/${product.id}`} className="cursor-pointer">
                    <div className="aspect-square mb-6 overflow-hidden rounded-[2rem] bg-black relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/500?text=VSGIGA" }}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <AnimatePresence>
                        {addingId === product.id && (
                          <motion.div 
                            initial={{ top: '-100%' }}
                            animate={{ top: '100%' }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-[#d67a9d]/20 z-10 pointer-events-none"
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="px-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-white font-black uppercase italic text-[11px] truncate pr-2 group-hover:text-[#d67a9d] transition-colors">{product.name}</h3>
                         <span className="text-[7px] text-white/20 font-bold uppercase border border-white/10 px-2 py-0.5 rounded-full shrink-0">
                            {product.category}
                         </span>
                      </div>
                      
                      <div className="flex gap-2 mb-4">
                        {product.sizes && Array.isArray(product.sizes) && product.sizes.map((s: any) => (
                          <span 
                            key={s.size} 
                            className={`text-[8px] font-black uppercase tracking-tighter ${
                              s.inStock 
                              ? 'text-white/60' 
                              : 'text-white/10 line-through decoration-[#d67a9d]/40'
                            }`}
                          >
                            {s.size}
                          </span>
                        ))}
                      </div>

                      <p className="text-[#71b3c9] font-black text-2xl">{(product.price || 0).toLocaleString()} ₽</p>
                    </div>
                  </Link>

                  <div className="px-4 pb-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault(); 
                        handleAddToCart(product);
                      }}
                      disabled={addingId === product.id}
                      className={`w-full py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 shadow-lg relative overflow-hidden ${
                        addingId === product.id 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-black hover:bg-[#d67a9d] hover:text-white shadow-lg hover:shadow-[#d67a9d]/20'
                      }`}
                    >
                      <span className="relative z-10">
                        {addingId === product.id ? 'Success_✓' : 'Add to Cart'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
           <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
             <p className="text-white/20 font-black uppercase tracking-widest">No_Items_Found_In_This_Sector</p>
           </div>
        )}
      </div>
    </main>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic tracking-[0.5em]">INITIALIZING_vsgiga_DATABASE...</div>}>
      <CatalogContent />
    </Suspense>
  )
}