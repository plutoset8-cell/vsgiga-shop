'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import {
  Coins,
  ArrowRight,
  Package,
  User,
  Gift,
  Snowflake,
  Sparkles,
  Star,
  Zap,
  Crown,
  TrendingUp,
  Shield,
  Rocket,
  Gem,
  Trophy,
  Calendar,
  CreditCard,
  ShoppingCart,
  Box,
  Truck,
  CheckCircle,
  Activity,
  Target,
  Edit3,
  X,
  Type,
  CreditCard as CardIcon
} from 'lucide-react'

// ==================== КОМПОНЕНТЫ ЭФФЕКТОВ ФОНА ====================

// 3D Звездное поле
const Starfield3D = () => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(200)].map((_, i) => {
        const depth = Math.random() * 100 + 50
        const size = Math.random() * 4 + 1
        return (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              width: size,
              height: size,
              transform: `translateZ(${depth}px)`,
              boxShadow: `0 0 ${size * 4}px ${size * 2}px rgba(255, 255, 255, 0.5)`
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.5, 1],
              x: [0, Math.random() * 20 - 10, 0],
              y: [0, Math.random() * 20 - 10, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        )
      })}
    </div>
  )
}

// 3D Парящие подарки
const FloatingGifts3D = () => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  const gifts = ['🎁', '🎄', '⭐', '🔔', '🎅', '🦌', '❄️', '✨']
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(30)].map((_, i) => {
        const depth = Math.random() * 200 + 100
        const size = Math.random() * 40 + 20
        return (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              fontSize: `${size}px`,
              transform: `translateZ(${depth}px)`,
              filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
            }}
            animate={{
              y: ['0vh', '100vh'],
              rotateX: [0, 360],
              rotateY: [0, 720],
              rotateZ: [0, 360]
            }}
            transition={{
              duration: Math.random() * 30 + 30,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "linear"
            }}
          >
            {gifts[Math.floor(Math.random() * gifts.length)]}
          </motion.div>
        )
      })}
    </div>
  )
}

// Матрица из падающих символов
const MatrixRain = () => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  const symbols = ['❄️', '🎁', '⭐', '🎄', '🔔', '🦌', '🎅', '✨', '🌟', '💫']
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(80)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/5 text-xl"
          initial={{ 
            x: Math.random() * 100 + 'vw',
            y: -50,
            rotate: Math.random() * 360
          }}
          animate={{
            y: '120vh',
            rotate: Math.random() * 720
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        >
          {symbols[Math.floor(Math.random() * symbols.length)]}
        </motion.div>
      ))}
    </div>
  )
}

// Лазерные линии (киберпанк эффект)
const LaserGrid = () => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Горизонтальные линии */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#d67a9d] to-transparent"
          style={{
            top: `${(i + 1) * 5}%`,
            width: '100%',
          }}
          animate={{
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
      {/* Вертикальные линии */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute w-[1px] bg-gradient-to-b from-transparent via-[#71b3c9] to-transparent"
          style={{
            left: `${(i + 1) * 5}%`,
            height: '100%',
          }}
          animate={{
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// ==================== МАГИЧЕСКИЙ ПОДАРОК ====================
const MagicGift = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [promoCode, setPromoCode] = useState('')

  const handleClick = () => {
    setShowConfetti(true)
    setPromoCode('HAPPY2026')
    setIsOpen(true)
    
    toast.success(
      <div className="text-center">
        <p className="font-bold text-lg">🎉 ВАШ ПРОМОКОД АКТИВИРОВАН!</p>
        <p className="text-sm mt-1">HAPPY2026 на 1000 ₽</p>
      </div>,
      {
        duration: 5000,
        style: {
          background: 'linear-gradient(90deg, #d67a9d, #71b3c9)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.2)'
        }
      }
    )
    
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <>
      {/* Конфетти эффект */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(150)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: '50vw',
                  y: '100vh',
                  rotate: 0
                }}
                animate={{
                  x: Math.random() * 100 + 'vw',
                  y: '-100vh',
                  rotate: Math.random() * 720
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  ease: "linear"
                }}
              >
                {['🎉', '✨', '⭐', '🎁', '🎊'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Компонент подарка */}
      <motion.div
        className="fixed bottom-8 left-8 z-40 cursor-pointer"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, -5, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 0.5
        }}
        onClick={handleClick}
      >
        {/* Аврора эффект */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: [
              'linear-gradient(60deg, #d67a9d, transparent 40%)',
              'linear-gradient(180deg, #71b3c9, transparent 40%)',
              'linear-gradient(300deg, #ffd166, transparent 40%)',
              'linear-gradient(60deg, #d67a9d, transparent 40%)',
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            filter: 'blur(20px)',
            opacity: 0.7
          }}
        />
        
        <div className="relative bg-gradient-to-br from-[#d67a9d] via-[#71b3c9] to-[#ffd166] p-1 rounded-2xl">
          <div className="bg-black rounded-xl p-6">
            <div className="flex flex-col items-center">
              <Gift size={48} className="text-yellow-400 mb-4" />
              <p className="text-sm font-bold tracking-widest text-center">
                МАГИЧЕСКИЙ<br/>ПОДАРОК
              </p>
            </div>
          </div>
        </div>

        {/* Всплывающее окно с промокодом */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute left-full ml-4 top-1/2 -translate-y-1/2 min-w-[300px]"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-yellow-500/50 p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold tracking-widest flex items-center gap-2">
                    <Sparkles className="text-yellow-400" />
                    ВАШ ПРОМОКОД
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsOpen(false)
                    }}
                    className="text-white/60 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="bg-black/50 rounded-xl p-6 border border-yellow-500/30 text-center mb-4">
                  <p className="text-3xl font-black tracking-wider text-yellow-400">
                    {promoCode}
                  </p>
                  <p className="text-sm text-white/60 mt-2">1000 ₽ на первый заказ</p>
                </div>
                
                <p className="text-xs text-white/40 text-center">
                  Промокод действителен до 31.01.2026
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

// ==================== АНИМИРОВАННЫЕ КОМПОНЕНТЫ ====================

// Анимированная сфера для бонусов
const AnimatedSphere = ({ value }: { value: number }) => {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotateY: [0, 180, 360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-48 h-48"
      >
        {/* Внешняя сфера */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d67a9d]/20 via-[#71b3c9]/20 to-[#ffd166]/20 blur-xl" />
        
        {/* Средняя сфера */}
        <motion.div
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-4 rounded-full bg-gradient-to-r from-[#d67a9d]/30 via-[#71b3c9]/30 to-transparent blur-md"
        />
        
        {/* Внутренняя сфера */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-black to-gray-900 border border-white/10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl font-black bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] bg-clip-text text-transparent">
              {value}
            </p>
            <p className="text-xs font-bold tracking-widest text-white/60 mt-2">G-COINS</p>
          </div>
        </div>
        
        {/* Сияющие частицы */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#d67a9d] to-[#71b3c9]"
            style={{
              left: `${50 + 40 * Math.cos((i * 30 * Math.PI) / 180)}%`,
              top: `${50 + 40 * Math.sin((i * 30 * Math.PI) / 180)}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

// Параллакс карточка
const ParallaxCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 })
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  )
}

// Анимированный градиентный бордер
const BorderBeam = () => {
  return (
    <div className="absolute inset-0 rounded-3xl overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 0%', '200% 200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            #d67a9d 25%, 
            #71b3c9 50%, 
            #ffd166 75%, 
            transparent 100%
          )`,
          backgroundSize: '200% 200%',
          filter: 'blur(8px)',
        }}
      />
    </div>
  )
}

// ==================== МОДАЛЬНОЕ ОКНО ПОПОЛНЕНИЯ ====================
const TopUpModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [text, setText] = useState('')
  const fullText = "ФУНКЦИЯ В РАЗРАБОТКЕ"
  
  useEffect(() => {
    if (!isOpen) {
      setText('')
      return
    }
    
    let i = 0
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 100)
    
    return () => clearInterval(timer)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-2xl z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border-2 border-white/10 p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ 
                      rotateY: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="w-20 h-20 mx-auto mb-6"
                  >
                    <CardIcon className="w-full h-full text-cyan-400" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-black tracking-widest mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    ПОПОЛНЕНИЕ БАЛАНСА
                  </h2>
                  
                  <div className="h-12 flex items-center justify-center">
                    <p className="text-xl font-mono tracking-widest">
                      {text}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-[2px] h-6 bg-cyan-400 ml-1"
                      />
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      placeholder="НОМЕР КАРТЫ" 
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm tracking-widest"
                      disabled
                    />
                    <input 
                      type="text" 
                      placeholder="CVC" 
                      className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm tracking-widest"
                      disabled
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="СУММА (₽)" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm tracking-widest"
                    disabled
                  />
                </div>
                
                <div className="text-center">
                  <button
                    onClick={onClose}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white/60 font-bold tracking-widest text-sm w-full hover:from-gray-600 hover:to-gray-700 transition-all"
                  >
                    ЗАКРЫТЬ
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ==================== КОМПОНЕНТ НОВОСТЕЙ ====================
interface NewsItem {
  id: string
  title: string
  content: string
  image_url: string | null
  created_at: string
}

const NewsFeed = ({ news }: { news: NewsItem[] }) => {
  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#d67a9d]/20 to-[#71b3c9]/20 flex items-center justify-center mx-auto mb-6">
          <Type size={32} className="text-white/20" />
        </div>
        <p className="text-xl font-bold tracking-widest mb-3">НОВОСТЕЙ ПОКА НЕТ</p>
        <p className="text-white/60">Следите за обновлениями!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {news.map((item) => (
        <ParallaxCard key={item.id}>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex gap-4">
              {item.image_url && (
                <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold tracking-widest">{item.title}</h3>
                  <span className="text-xs text-white/40">
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{item.content}</p>
              </div>
            </div>
          </div>
        </ParallaxCard>
      ))}
    </div>
  )
}

// ==================== ОСНОВНАЯ СТРАНИЦА ====================

interface UserProfile {
  id: string
  email?: string
  user_metadata?: {
    username?: string
    avatar_url?: string
    rank?: string
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [userBonuses, setUserBonuses] = useState(3450)
  const [cashbackPercent, setCashbackPercent] = useState(5)
  const [nextLevelPercent, setNextLevelPercent] = useState(7)
  const [ordersToNextLevel, setOrdersToNextLevel] = useState(3)
  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [topUpModalOpen, setTopUpModalOpen] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }

      const userData: UserProfile = {
        id: authUser.id,
        email: authUser.email || undefined,
        user_metadata: authUser.user_metadata as any || {}
      }
      
      setUser(userData)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url, available_points')
        .eq('id', authUser.id)
        .single()

      if (profileData) {
        setUserBonuses(profileData.available_points || 3450)
        setUsernameInput(profileData.username || '')
        setUser(prev => ({
          ...prev!,
          user_metadata: {
            ...prev?.user_metadata,
            avatar_url: profileData.avatar_url || undefined,
            username: profileData.username || undefined
          }
        }))
      }

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      if (ordersData) setOrders(ordersData)

      // Загрузка новостей
      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (newsData) setNews(newsData)

      // Симуляция данных для прогресса кэшбэка
      setCashbackPercent(5)
      setNextLevelPercent(7)
      setOrdersToNextLevel(3)

      setLoading(false)
    }
    getData()
  }, [router])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0 || !user) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setUser(prev => ({
        ...prev!,
        user_metadata: {
          ...prev?.user_metadata,
          avatar_url: publicUrl
        }
      }))

      toast.success('Аватар успешно обновлен!', {
        style: {
          background: 'linear-gradient(90deg, #71b3c9, #d67a9d)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.2)'
        },
        icon: '✅'
      })
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message, {
        style: {
          background: 'linear-gradient(90deg, #ff6b6b, #ffa726)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.2)'
        }
      })
    } finally {
      setUploading(false)
    }
  }

  const handleUsernameSave = async () => {
    if (!user || !usernameInput.trim()) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: usernameInput.trim() })
        .eq('id', user.id)

      if (error) throw error

      setUser(prev => ({
        ...prev!,
        user_metadata: {
          ...prev?.user_metadata,
          username: usernameInput.trim()
        }
      }))

      setEditingName(false)
      
      toast.success('Имя успешно обновлено!', {
        style: {
          background: 'linear-gradient(90deg, #71b3c9, #d67a9d)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.2)'
        },
        icon: '✅'
      })
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message, {
        style: {
          background: 'linear-gradient(90deg, #ff6b6b, #ffa726)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.2)'
        }
      })
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      <Starfield3D />
      <div className="relative z-10 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mx-auto mb-6 relative"
        >
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#d67a9d] border-r-[#71b3c9] border-b-[#ffd166] border-l-[#ff6b9d] animate-spin" />
          <div className="absolute inset-4 rounded-full border-4 border-white/10" />
        </motion.div>
        <p className="text-xl font-bold tracking-widest bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] bg-clip-text text-transparent">
          ЗАГРУЗКА ИНТЕРФЕЙСА...
        </p>
      </div>
    </div>
  )

  const quickActions = [
    { label: 'НОВЫЙ ЗАКАЗ', icon: ShoppingCart, color: '#d67a9d', link: '/catalog' },
    { label: 'ПОПОЛНИТЬ', icon: CreditCard, color: '#71b3c9', action: () => setTopUpModalOpen(true) },
    { label: 'ПОДАРКИ', icon: Gift, color: '#ffd166', link: '/layout/BonusSystem' },
    { label: 'ПОДПИСКА', icon: Crown, color: '#ff6b9d', link: '/contacts' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
      {/* Toast уведомления */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
          },
        }}
      />

      {/* Модальное окно пополнения */}
      <TopUpModal isOpen={topUpModalOpen} onClose={() => setTopUpModalOpen(false)} />

      {/* Фоновые эффекты */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900/20 to-black" />
      <MatrixRain />
      <Starfield3D />
      <FloatingGifts3D />
      <LaserGrid />
      
      {/* Магический подарок */}
      <MagicGift />
      
      {/* Новогодний топ-баннер */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="bg-gradient-to-r from-[#d67a9d]/10 via-[#71b3c9]/10 to-[#ffd166]/10 backdrop-blur-2xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-center gap-4">
              <Sparkles className="text-yellow-400 animate-pulse" size={20} />
              <span className="text-sm font-bold tracking-widest bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                🎄 НОВОГОДНИЙ СЕЗОН • КЭШБЭК ДО 15% • ПОДАРКИ КАЖДОМУ 🎁
              </span>
              <Sparkles className="text-yellow-400 animate-pulse" size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 pt-28 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* ГЛАВНАЯ КАРТОЧКА ПОЛЬЗОВАТЕЛЯ */}
        <ParallaxCard className="relative mb-12">
          <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-10 overflow-hidden">
            {/* Анимированный градиентный бордер */}
            <BorderBeam />
            
            {/* Внутренний контент */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              {/* Аватар с голограммой */}
              <div className="relative group">
                <div className="relative">
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#d67a9d]/30 via-[#71b3c9]/30 to-[#ffd166]/30 blur-xl"
                  />
                  
                  <label htmlFor="avatar-input" className="cursor-pointer block">
                    <div className={`relative w-40 h-40 rounded-full border-2 ${uploading ? 'border-yellow-500' : 'border-transparent'} overflow-hidden bg-gradient-to-br from-black to-gray-900 p-1`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] rounded-full animate-spin" />
                      <div className="absolute inset-1 rounded-full bg-black" />
                      <img 
                        src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=d67a9d&color=fff&bold=true&size=256`}
                        className="relative z-10 w-full h-full rounded-full object-cover"
                        alt="Аватар"
                      />
                      
                      {uploading && (
                        <div className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center z-20">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-[#d67a9d]/30 border-t-[#d67a9d] rounded-full"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute -bottom-2 -right-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] flex items-center justify-center border-4 border-black"
                      >
                        <User size={16} />
                      </motion.div>
                    </div>
                  </label>
                  <input 
                    type="file" 
                    id="avatar-input" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </div>
              </div>

              {/* Информация пользователя */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#d67a9d]/20 to-[#71b3c9]/20 border border-white/10">
                    <span className="text-xs font-bold tracking-widest flex items-center gap-2">
                      <Crown size={12} className="text-yellow-400" />
                      {user?.user_metadata?.rank || 'CYBER-AGENT'}
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4 mb-3">
                  {editingName ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="bg-black/50 border-2 border-[#d67a9d] rounded-xl px-6 py-3 text-3xl font-bold tracking-widest text-center lg:text-left min-w-[300px]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUsernameSave()
                          if (e.key === 'Escape') {
                            setEditingName(false)
                            setUsernameInput(user?.user_metadata?.username || '')
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUsernameSave}
                          className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <CheckCircle size={20} className="text-green-400" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingName(false)
                            setUsernameInput(user?.user_metadata?.username || '')
                          }}
                          className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                        >
                          <X size={20} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        {user?.user_metadata?.username || user?.email?.split('@')[0]?.toUpperCase()}
                      </h1>
                      <button
                        onClick={() => setEditingName(true)}
                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#d67a9d] hover:bg-[#d67a9d]/10 transition-all group"
                      >
                        <Edit3 size={20} className="text-white/60 group-hover:text-[#d67a9d]" />
                      </button>
                    </>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="w-2 h-2 rounded-full bg-[#d67a9d]" />
                    <span className="text-sm font-bold tracking-widest">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="w-2 h-2 rounded-full bg-[#71b3c9]" />
                    <span className="text-sm font-bold tracking-widest">ID: {user?.id?.slice(0, 8)}</span>
                  </div>
                </div>

                {/* Кэшбэк прогресс бар */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-white/60 mb-1">ТЕКУЩИЙ КЭШБЭК</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-yellow-400">{cashbackPercent}%</span>
                        <span className="text-sm text-white/40">→ {nextLevelPercent}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold tracking-widest text-white/60 mb-1">ДО СЛЕДУЮЩЕГО УРОВНЯ</p>
                      <span className="text-xl font-black">{ordersToNextLevel} ЗАКАЗА</span>
                    </div>
                  </div>
                  
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(orders.length / (orders.length + ordersToNextLevel)) * 100}%` }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] rounded-full relative"
                    >
                      <motion.div
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ParallaxCard>

        {/* БЫСТРЫЕ ДЕЙСТВИЯ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {quickActions.map((action, i) => (
            <ParallaxCard key={i} className="relative">
              {action.link ? (
                <Link href={action.link}>
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center group hover:border-white/30 transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${action.color}20` }}>
                      <action.icon size={24} style={{ color: action.color }} />
                    </div>
                    <p className="text-sm font-bold tracking-widest">{action.label}</p>
                    <motion.div
                      className="h-0.5 w-0 group-hover:w-full mx-auto mt-2"
                      style={{ background: `linear-gradient(90deg, transparent, ${action.color}, transparent)` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </Link>
              ) : (
                <button
                  onClick={action.action}
                  className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center group hover:border-white/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${action.color}20` }}>
                    <action.icon size={24} style={{ color: action.color }} />
                  </div>
                  <p className="text-sm font-bold tracking-widest">{action.label}</p>
                  <motion.div
                    className="h-0.5 w-0 group-hover:w-full mx-auto mt-2"
                    style={{ background: `linear-gradient(90deg, transparent, ${action.color}, transparent)` }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              )}
            </ParallaxCard>
          ))}
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ЛЕВАЯ КОЛОНКА - СТАТИСТИКА И БОНУСЫ */}
          <div className="lg:w-2/5 space-y-8">
            {/* БАЛАНС В СФЕРЕ */}
            <ParallaxCard className="relative">
              <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#d67a9d]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#71b3c9]/10 rounded-full blur-3xl" />
                
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                    <Gem size={16} className="text-[#ffd166]" />
                    <span className="text-xs font-bold tracking-widest">GIGA COINS</span>
                  </div>
                  <p className="text-sm text-white/60 mb-2">ВАШ БАЛАНС</p>
                </div>
                
                <div className="flex justify-center">
                  <AnimatedSphere value={userBonuses} />
                </div>
                
                <div className="text-center mt-6">
                  <Link href="/catalog">
                    <button className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] font-bold text-sm tracking-widest overflow-hidden">
                      <span className="relative z-10 flex items-center gap-3">
                        ПОТРАТИТЬ БОНУСЫ
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#71b3c9] to-[#d67a9d]"
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </button>
                  </Link>
                </div>
              </div>
            </ParallaxCard>

            {/* СТАТИСТИКА */}
            <div className="grid grid-cols-2 gap-4">
              <ParallaxCard className="relative">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffd166] to-[#ffed99] bg-opacity-20 flex items-center justify-center">
                      <Crown size={20} className="bg-gradient-to-br from-[#ffd166] to-[#ffed99] bg-clip-text text-transparent" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black">PLATINUM</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold tracking-widest text-white/60 mb-2">УРОВЕНЬ</p>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1, delay: 0.1 }}
                      className="h-full bg-gradient-to-r from-[#ffd166] to-[#ffed99] rounded-full"
                    />
                  </div>
                </div>
              </ParallaxCard>
              
              <ParallaxCard className="relative">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d67a9d] to-[#ff9ec0] bg-opacity-20 flex items-center justify-center">
                      <Zap size={20} className="bg-gradient-to-br from-[#d67a9d] to-[#ff9ec0] bg-clip-text text-transparent" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black">47 ДНЕЙ</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold tracking-widest text-white/60 mb-2">СТРЕЙК</p>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-[#d67a9d] to-[#ff9ec0] rounded-full"
                    />
                  </div>
                </div>
              </ParallaxCard>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА - ЗАКАЗЫ И ИСТОРИЯ */}
          <div className="lg:w-3/5">
            {/* ТАБЫ */}
            <div className="flex gap-2 mb-8 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-widest transition-all ${activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-white' 
                  : 'text-white/60 hover:text-white'}`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Activity size={16} />
                  ОБЗОР
                </span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-widest transition-all ${activeTab === 'orders' 
                  ? 'bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-white' 
                  : 'text-white/60 hover:text-white'}`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Package size={16} />
                  ЗАКАЗЫ ({orders.length})
                </span>
              </button>
            </div>

            {/* КОНТЕНТ ТАБОВ */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <ParallaxCard>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold tracking-widest flex items-center gap-2">
                          <TrendingUp size={20} className="text-green-400" />
                          ЛЕНТА НОВОСТЕЙ
                        </h3>
                        <span className="text-xs font-bold text-white/40">АКТУАЛЬНО</span>
                      </div>
                      <NewsFeed news={news} />
                    </div>
                  </ParallaxCard>
                </motion.div>
              ) : (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <ParallaxCard key={order.id}>
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                  <span className="text-xs font-bold tracking-widest text-[#71b3c9]">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                  </span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              </div>
                              <p className="text-lg font-bold">
                                {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-sm text-white/60 mt-1">{order.address}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-black bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] bg-clip-text text-transparent">
                                {order.total_amount.toLocaleString()} ₽
                              </p>
                              <div className="inline-flex items-center gap-2 mt-2 px-4 py-1 rounded-full bg-white/10">
                                <Truck size={12} />
                                <span className="text-xs font-bold tracking-widest">{order.status}</span>
                              </div>
                            </div>
                          </div>

                          {/* Голографический прогресс бар */}
                          <div className="relative mb-6">
                            <div className="flex justify-between text-xs font-bold text-white/40 mb-2">
                              <span>СТАТУС ДОСТАВКИ</span>
                              <span className="flex items-center gap-2">
                                <Target size={10} />
                                {order.status}
                              </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(Math.random() * 30 + 70)}%` }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] rounded-full"
                              >
                                <motion.div
                                  animate={{ x: ['0%', '100%'] }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                                />
                              </motion.div>
                            </div>
                          </div>

                          {/* Товары в голографическом стиле */}
                          {order.items && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex-shrink-0">
                                  <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                                    <div className="relative bg-black rounded-xl p-3 min-w-[180px]">
                                      <div className="flex items-center gap-3">
                                        <div className="relative">
                                          <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-14 h-14 rounded-lg object-cover"
                                          />
                                          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/50 to-transparent" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-white/60">x{item.quantity}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-xs font-bold text-[#71b3c9]">
                                              {(item.price * item.quantity).toLocaleString()} ₽
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </ParallaxCard>
                    ))
                  ) : (
                    <ParallaxCard>
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#d67a9d]/20 to-[#71b3c9]/20 flex items-center justify-center mx-auto mb-6">
                          <Package size={32} className="text-white/20" />
                        </div>
                        <p className="text-2xl font-bold tracking-widest mb-3">АКТИВНЫХ ЗАКАЗОВ НЕТ</p>
                        <p className="text-white/60 mb-8">Совершите первую покупку и получите бонусы!</p>
                        <Link href="/catalog">
                          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] font-bold text-sm tracking-widest hover:scale-105 transition-all">
                            ПЕРЕЙТИ В КАТАЛОГ
                          </button>
                        </Link>
                      </div>
                    </ParallaxCard>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* КНОПКА ВЫХОДА */}
        <div className="mt-16 text-center">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="group relative px-8 py-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-all"
          >
            <span className="text-sm font-bold tracking-widest text-white/60 group-hover:text-red-400 transition-colors">
              ЗАВЕРШИТЬ СЕССИЮ
            </span>
            <div className="absolute inset-x-4 bottom-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-red-500/50 transition-all" />
          </button>
        </div>
      </div>
    </main>
  )
}