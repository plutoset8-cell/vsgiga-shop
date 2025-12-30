'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Coins, 
  ArrowRight, 
  Package, 
  User,
  ShoppingBag,
  Gift,
  Snowflake,
  Sparkles,
  Star
} from 'lucide-react'

// Тип для пользователя
interface UserMetadata {
  username?: string;
  avatar_url?: string;
  rank?: string;
}

interface UserProfile {
  id: string;
  email?: string;
  user_metadata?: UserMetadata;
}

// Компонент снежинок
const FloatingSnowflakes = () => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/10"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: -50,
            rotate: 0
          }}
          animate={{
            y: window.innerHeight + 100,
            x: Math.random() * window.innerWidth * 0.3 + window.innerWidth * 0.35,
            rotate: 360
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        >
          <Snowflake size={Math.random() * 12 + 8} strokeWidth={0.5} />
        </motion.div>
      ))}
    </div>
  )
}

// Компонент летающих подарков
const FloatingGifts = () => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0.8
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
              Math.random() * window.innerHeight
            ],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        >
          <div className="relative">
            <Gift 
              size={Math.random() * 20 + 16} 
              className={i % 3 === 0 ? 'text-[#ff6b9d]/10' : i % 3 === 1 ? 'text-[#71b3c9]/10' : 'text-[#ffd166]/10'}
            />
            {Math.random() > 0.5 && (
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={8} className="text-yellow-400/30 absolute -top-1 -right-1" />
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Компонент мерцающих звезд
const TwinklingStars = () => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[1px] h-[1px] bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [userBonuses, setUserBonuses] = useState(0)
  const [cashbackPercent] = useState(5)
  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const STATUS_PROGRESS: Record<string, number> = {
    'Оформлен': 10,
    'На сборке': 25,
    'Приехал на склад': 40,
    'Отгружен': 60,
    'Отправлен в город': 80,
    'В пункте выдачи': 95,
    'Получен': 100
  }

  useEffect(() => {
    const getData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }

      // Создаем объект пользователя с правильной типизацией
      const userData: UserProfile = {
        id: authUser.id,
        email: authUser.email || undefined,
        user_metadata: authUser.user_metadata as UserMetadata || {}
      }
      
      setUser(userData)

      // Загружаем профиль с бонусами
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url, available_points')
        .eq('id', authUser.id)
        .single()

      if (profileData) {
        setUserBonuses(profileData.available_points || 0)
        
        // Правильное обновление состояния с типизацией
        setUser(prev => {
          if (!prev) return null
          return {
            ...prev,
            user_metadata: {
              ...prev.user_metadata,
              avatar_url: profileData.avatar_url || undefined,
              username: profileData.username || undefined
            }
          }
        })
      }

      // Загружаем заказы
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      if (ordersData) setOrders(ordersData)

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

      // Обновляем профиль в таблице profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Правильное обновление состояния с типизацией
      setUser(prev => {
        if (!prev) return null
        return {
          ...prev,
          user_metadata: {
            ...prev.user_metadata,
            avatar_url: publicUrl
          }
        }
      })

      alert('Аватар успешно обновлен!')
    } catch (error: any) {
      alert('Ошибка: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#d67a9d]/30 border-t-[#d67a9d] rounded-full mx-auto mb-4"
        />
        <p className="text-white/60 font-bold text-sm tracking-widest">ЗАГРУЗКА ПРОФИЛЯ...</p>
      </div>
    </div>
  )

  const stats = [
    { 
      label: 'БАЛАНС', 
      value: `${userBonuses} G`, 
      icon: Coins,
      color: 'from-[#d67a9d] to-[#ff9ec0]'
    },
    { 
      label: 'ЗАКАЗЫ', 
      value: orders.length.toString(), 
      icon: ShoppingBag,
      color: 'from-[#71b3c9] to-[#a3e0ff]'
    },
    { 
      label: 'КЭШБЭК', 
      value: `${cashbackPercent}%`, 
      icon: Star,
      color: 'from-[#ffd166] to-[#ffed99]'
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-24 pb-20 px-4 md:px-6 relative overflow-hidden">
      {/* Новогодние эффекты */}
      <FloatingSnowflakes />
      <FloatingGifts />
      <TwinklingStars />

      {/* Новогодний баннер */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="bg-gradient-to-r from-[#d67a9d]/20 to-[#71b3c9]/20 border border-white/10 backdrop-blur-xl rounded-full px-6 py-2">
          <div className="flex items-center gap-3">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-xs font-bold tracking-widest bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              НОВОГОДНИЙ СЕЗОН • КЭШБЭК {cashbackPercent}%
            </span>
            <Sparkles size={14} className="text-yellow-400" />
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Шапка профиля */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[3rem] p-8 mb-8 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#d67a9d]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#71b3c9]/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <label htmlFor="avatar-input" className="cursor-pointer block">
                <div className={`w-32 h-32 rounded-full border-4 ${uploading ? 'border-yellow-500 animate-pulse' : 'border-white/20'} p-2 transition-all duration-300 group-hover:border-[#d67a9d] group-hover:scale-105`}>
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <img 
                      src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=d67a9d&color=fff&bold=true`} 
                      className="w-full h-full object-cover"
                      alt="Аватар"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-bold tracking-widest">ИЗМЕНИТЬ</span>
                    </div>
                  </div>
                </div>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-[#d67a9d]/30 border-t-[#d67a9d] rounded-full"
                    />
                  </div>
                )}
              </label>
              <input 
                type="file" 
                id="avatar-input" 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
              <div className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 rounded-full border-2 border-black" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 mb-4">
                <User size={12} />
                <span className="text-xs font-bold tracking-widest">
                  {user?.user_metadata?.rank || 'GIGA MEMBER'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {user?.user_metadata?.username || user?.email?.split('@')[0]}
              </h1>
              <p className="text-white/60 text-sm mb-6">{user?.email}</p>
              
              {/* Кэшбэк плашка */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#d67a9d]/20 to-[#71b3c9]/20 border border-white/10 rounded-2xl px-6 py-3">
                <Gift size={20} className="text-yellow-400" />
                <div>
                  <p className="text-xs font-bold tracking-widest">ВАШ КЭШБЭК</p>
                  <p className="text-2xl font-black text-yellow-400">{cashbackPercent}%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Табы */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm tracking-widest transition-all duration-300 ${activeTab === 'overview' 
              ? 'bg-white text-black' 
              : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            ОБЗОР
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm tracking-widest transition-all duration-300 ${activeTab === 'orders' 
              ? 'bg-white text-black' 
              : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            МОИ ЗАКАЗЫ ({orders.length})
          </button>
        </div>

        {/* Контент табов */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon size={24} className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                      <span className="text-xs font-bold text-white/40 tracking-widest">{stat.label}</span>
                    </div>
                    <p className="text-3xl font-black">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Бонусы */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#d67a9d]/20 to-[#ff9ec0]/20 flex items-center justify-center">
                        <Coins size={24} className="text-[#d67a9d]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white/60 tracking-widest">GIGA COINS</p>
                        <p className="text-4xl font-black">{userBonuses}</p>
                      </div>
                    </div>
                    <p className="text-white/40 text-sm">
                      1 G = 1₽ • Можно использовать при оплате заказов
                    </p>
                  </div>
                  
                  <Link href="/catalog" className="w-full md:w-auto">
                    <button className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#d67a9d] to-[#ff6b9d] rounded-xl font-bold text-sm tracking-widest hover:scale-105 transition-all duration-300">
                      ПОТРАТИТЬ БОНУСЫ
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
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
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div>
                        <p className="text-xs font-bold text-white/60 tracking-widest mb-2">
                          ЗАКАЗ #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-lg font-bold">
                          {new Date(order.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-white/40 text-sm mt-1">{order.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black">{order.total_amount.toLocaleString()} ₽</p>
                        <div className="inline-flex items-center gap-2 mt-2 bg-white/10 rounded-full px-4 py-1">
                          <Package size={12} />
                          <span className="text-xs font-bold tracking-widest">{order.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Прогресс бар */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-bold text-white/40 mb-2">
                        <span>ПРОГРЕСС</span>
                        <span>{STATUS_PROGRESS[order.status] || 0}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${STATUS_PROGRESS[order.status] || 0}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#71b3c9] to-[#d67a9d]"
                        />
                      </div>
                    </div>

                    {/* Товары */}
                    {order.items && (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 min-w-[200px]">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                              <p className="text-xs text-white/60">x{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl">
                  <Package size={48} className="mx-auto mb-4 text-white/20" />
                  <p className="text-lg font-bold tracking-widest text-white/40 mb-2">
                    ЗАКАЗОВ НЕТ
                  </p>
                  <p className="text-white/60 text-sm mb-6">
                    Совершите первую покупку и получите бонусы!
                  </p>
                  <Link href="/catalog">
                    <button className="px-8 py-3 bg-gradient-to-r from-[#d67a9d] to-[#ff6b9d] rounded-xl font-bold text-sm tracking-widest hover:scale-105 transition-all">
                      В КАТАЛОГ
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Выход */}
        <div className="mt-12 text-center">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors text-sm font-bold tracking-widest"
          >
            <span>ВЫЙТИ ИЗ АККАУНТА</span>
            <div className="w-8 h-px bg-white/20" />
          </button>
        </div>
      </div>
    </main>
  )
}