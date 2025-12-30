'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Coins,
    ArrowRight,
    CheckCircle2,
    Clock,
    TrendingUp,
    TrendingDown,
    Package,
    Eye,
    Bell,
    Home,
    User,
    Settings,
    Gift,
    Snowflake,
    Star,
    Edit3,
    Save,
    X,
    Calendar,
    ShoppingBag,
    History,
    CreditCard,
    Heart,
    MapPin,
    Phone,
    Shield,
    LogOut,
    ChevronRight,
    Sparkles,
    Trophy,
    Zap,
    Target,
    BarChart3,
    Wallet,
    Tag,
    Clock3,
    Truck,
    Box,
    CheckSquare,
    AlertCircle,
    MoreVertical
} from 'lucide-react'

// 3D эффекты и новогодние анимации
const FloatingSnowflakes = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-[#71b3c9]/20"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: -50,
                        rotate: 0,
                        scale: Math.random() * 0.5 + 0.3
                    }}
                    animate={{
                        y: window.innerHeight + 100,
                        rotate: 360,
                        x: Math.random() * window.innerWidth - window.innerWidth / 2 + (Math.random() * window.innerWidth / 2)
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                >
                    <Snowflake size={Math.random() * 16 + 8} />
                </motion.div>
            ))}
        </div>
    )
}

const FloatingGifts = () => {
    const gifts = [
        { color: 'from-[#d67a9d] to-[#ff3366]', delay: 0 },
        { color: 'from-[#71b3c9] to-[#00ffcc]', delay: 1 },
        { color: 'from-[#ffcc00] to-[#ff9900]', delay: 2 },
        { color: 'from-[#9966ff] to-[#6600ff]', delay: 3 },
    ]

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {gifts.map((gift, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-32 h-32 bg-gradient-to-br ${gift.color} rounded-2xl shadow-2xl`}
                    initial={{
                        x: -100,
                        y: Math.random() * window.innerHeight,
                        rotate: -45,
                        opacity: 0.3
                    }}
                    animate={{
                        x: window.innerWidth + 100,
                        y: Math.random() * window.innerHeight,
                        rotate: [0, 360, 360, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                        delay: gift.delay,
                        rotate: {
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                    style={{
                        filter: 'blur(1px)',
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Gift size={48} className="text-white/90" />
                    </div>
                    <motion.div
                        className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{
                            x: ['0%', '100%', '0%'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </motion.div>
            ))}
        </div>
    )
}

const NeonGrid = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a1a] to-black">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-px w-full bg-gradient-to-r from-transparent via-[#d67a9d]/10 to-transparent"
                        style={{ top: `${(i * 5) % 100}%` }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i + 20}
                        className="absolute w-px h-full bg-gradient-to-b from-transparent via-[#71b3c9]/10 to-transparent"
                        style={{ left: `${(i * 5) % 100}%` }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

const GlassmorphismCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    return (
        <motion.div
            className={`relative overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem]" />
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d67a9d]/20 via-transparent to-[#71b3c9]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    )
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [availablePoints, setAvailablePoints] = useState(0)
    const [bonusHistory, setBonusHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [editingUsername, setEditingUsername] = useState(false)
    const [username, setUsername] = useState('')
    const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
    const [news, setNews] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('main')
    const [userRank, setUserRank] = useState('')
    const [userStats, setUserStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        favoriteCategory: '',
        averageOrder: 0
    })
    const [cashbackPercentage, setCashbackPercentage] = useState(0)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 30, stiffness: 100 }
    const mouseXSpring = useSpring(mouseX, springConfig)
    const mouseYSpring = useSpring(mouseY, springConfig)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg'])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg'])

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height

        const mouseX = (e.clientX - rect.left) / width - 0.5
        const mouseY = (e.clientY - rect.top) / height - 0.5

        mouseX.set(mouseX)
        mouseY.set(mouseY)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    const STATUS_PROGRESS: Record<string, number> = {
        'Оформлен': 10,
        'На сборке в другом городе': 25,
        'Приехал на склад': 40,
        'Отгружен на складе': 60,
        'Отправлен в город получателя': 80,
        'В пункте выдачи': 95,
        'Получен': 100
    }

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            // Загружаем профиль с available_points
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileData) {
                setAvailablePoints(profileData.available_points || 0)
                setUsername(profileData.username || user.email?.split('@')[0] || '')
                setUserRank(profileData.rank || 'RECRUIT')
                setCashbackPercentage(profileData.cashback_percentage || 5)
            }

            // Загружаем заказы
            const { data: ordersData } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (ordersData) {
                setOrders(ordersData)
                const totalSpent = ordersData.reduce((sum, order) => sum + (order.total_amount || 0), 0)
                const averageOrder = ordersData.length > 0 ? totalSpent / ordersData.length : 0

                setUserStats({
                    totalOrders: ordersData.length,
                    totalSpent,
                    favoriteCategory: 'Электроника',
                    averageOrder
                })
            }

            // Загружаем историю бонусов
            const { data: historyData } = await supabase
                .from('bonus_history')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10)

            if (historyData) setBonusHistory(historyData)

            // Загружаем просмотренные товары из localStorage
            const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
            if (viewedIds.length > 0) {
                const { data: viewedProducts } = await supabase
                    .from('products')
                    .select('*')
                    .in('id', viewedIds.slice(0, 10))

                if (viewedProducts) setRecentlyViewed(viewedProducts)
            }

            // Загружаем новости
            const { data: newsData } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5)

            if (newsData) setNews(newsData)

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

            // Загружаем в Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            // Получаем публичный URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
            const publicUrl = `${data.publicUrl}?t=${Date.now()}`

            // Обновляем профиль в таблице profiles
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id)

            if (updateError) throw updateError

            // Обновляем состояние
            setUser({
                ...user,
                user_metadata: {
                    ...user.user_metadata,
                    avatar_url: publicUrl
                }
            })

            router.refresh()
            alert('Аватар успешно обновлен!')
        } catch (error: any) {
            alert('Ошибка: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleUsernameSave = async () => {
        try {
            if (!user) return

            const { error } = await supabase
                .from('profiles')
                .update({ username })
                .eq('id', user.id)

            if (error) throw error

            setEditingUsername(false)
            alert('Имя пользователя сохранено!')
        } catch (error: any) {
            alert('Ошибка: ' + error.message)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const tabs = [
        { id: 'main', label: 'ГЛАВНАЯ', icon: <Home size={16} /> },
        { id: 'orders', label: 'МОИ ЗАКАЗЫ', icon: <Package size={16} /> },
        { id: 'viewed', label: 'ВЫ СМОТРЕЛИ', icon: <Eye size={16} /> },
        { id: 'news', label: 'НОВОСТИ', icon: <Bell size={16} /> },
        { id: 'stats', label: 'СТАТИСТИКА', icon: <BarChart3 size={16} /> },
    ]

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic animate-pulse tracking-[0.5em]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-4"
            >
                <Snowflake size={32} className="text-[#71b3c9]" />
            </motion.div>
            INITIALIZING_PROFILE...
        </div>
    )

    const renderMainTab = () => (
        <>
            {/* КАРТОЧКА АГЕНТА */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-[4rem] p-10 mb-12 overflow-hidden backdrop-blur-3xl"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
            >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d67a9d]/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#71b3c9]/20 rounded-full blur-[100px]" />

                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 50%, rgba(214, 122, 157, 0.15) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 20%, rgba(113, 179, 201, 0.15) 0%, transparent 50%)',
                            'radial-gradient(circle at 40% 80%, rgba(214, 122, 157, 0.15) 0%, transparent 50%)',
                        ]
                    }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <label htmlFor="avatar-input" className="cursor-pointer block relative">
                            <motion.div
                                className={`w-40 h-40 rounded-full border-2 ${uploading ? 'border-yellow-500' : 'border-[#d67a9d]'} p-2 transition-all group-hover:scale-105 shadow-2xl shadow-[#d67a9d]/20`}
                                animate={uploading ? { rotate: 360 } : {}}
                                transition={uploading ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                            >
                                <img
                                    src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=d67a9d&color=fff`}
                                    className="w-full h-full rounded-full object-cover bg-black"
                                    alt="avatar"
                                />
                            </motion.div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload_New</span>
                            </div>
                        </label>
                        <input type="file" id="avatar-input" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                        <motion.div
                            className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-black"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <p className="text-[#d67a9d] font-black text-[10px] tracking-[0.5em] mb-2 uppercase italic">
                            {uploading ? 'UPLOADING_TO_SERVER...' : `ACCESS_LEVEL: ${userRank}`}
                        </p>

                        <div className="flex items-center gap-4 mb-4">
                            {editingUsername ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-black/50 border border-[#d67a9d]/30 rounded-xl px-4 py-2 text-4xl font-black italic uppercase text-white w-full max-w-md"
                                        autoFocus
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleUsernameSave}
                                        className="p-2 bg-green-500/20 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-colors"
                                    >
                                        <Save size={20} className="text-green-500" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setEditingUsername(false)}
                                        className="p-2 bg-red-500/20 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-colors"
                                    >
                                        <X size={20} className="text-red-500" />
                                    </motion.button>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-6xl font-black italic uppercase tracking-tighter truncate max-w-md">
                                        {username}
                                    </h1>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setEditingUsername(true)}
                                        className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-colors"
                                    >
                                        <Edit3 size={20} />
                                    </motion.button>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/5 flex items-center gap-2">
                                <Mail size={12} /> {user?.email}
                            </span>
                            <span className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/5 flex items-center gap-2">
                                <Calendar size={12} /> Зарегистрирован: {new Date(user?.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <motion.div
                    className="absolute top-0 left-0 w-32 h-32"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Star className="text-[#ffcc00]/20" size={32} />
                </motion.div>
            </motion.div>

            {/* СТАТИСТИКА */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'ВСЕГО ЗАКАЗОВ', value: userStats.totalOrders.toString(), icon: <ShoppingBag size={20} />, color: 'from-[#d67a9d] to-[#ff3366]' },
                    { label: 'ПОТРАЧЕНО', value: `${userStats.totalSpent.toLocaleString()} ₽`, icon: <CreditCard size={20} />, color: 'from-[#71b3c9] to-[#00ffcc]' },
                    { label: 'БОНУСОВ', value: availablePoints.toString(), icon: <Coins size={20} />, color: 'from-[#ffcc00] to-[#ff9900]' },
                    { label: 'СРЕДНИЙ ЧЕК', value: `${Math.round(userStats.averageOrder).toLocaleString()} ₽`, icon: <BarChart3 size={20} />, color: 'from-[#9966ff] to-[#6600ff]' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative group"
                    >
                        <div className={`absolute -inset-0.5 bg-gradient-to-br ${stat.color} rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition-opacity`} />
                        <div className="relative bg-black border border-white/10 p-8 rounded-[2.5rem] text-center">
                            <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                                {stat.icon}
                            </div>
                            <p className="text-white/30 font-black text-[10px] tracking-[0.3em] mb-2 uppercase">{stat.label}</p>
                            <p className="text-4xl font-black italic text-white">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* БЛОК КЭШБЕКА И БОНУСОВ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* КЭШБЕК 5% */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00ffcc] via-[#ff00ff] to-[#00ffcc] rounded-[3rem] blur opacity-20 animate-pulse" />
                    <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-[3rem] blur-xl" />

                    <GlassmorphismCard className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="w-14 h-14 bg-gradient-to-br from-[#00ffcc] to-[#0088cc] rounded-2xl flex items-center justify-center border border-white/10 mb-4">
                                    <Zap size={28} className="text-white" />
                                </div>
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mb-1 italic">ВАШ КЭШБЕК</p>
                                <h3 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-2">
                                    {cashbackPercentage}%
                                    <motion.span
                                        className="text-[10px] text-[#00ffcc] tracking-normal uppercase ml-2"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        НА ВСЕ ПОКУПКИ
                                    </motion.span>
                                </h3>
                                <p className="text-[11px] text-white/60 font-medium max-w-md">
                                    Получайте {cashbackPercentage}% бонусов от каждой покупки. Бонусы начисляются моментально!
                                </p>
                            </div>

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="hidden lg:block"
                            >
                                <div className="w-24 h-24 rounded-full border-4 border-[#00ffcc]/20 relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00ffcc] border-r-[#00ffcc]" />
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Следующий уровень</p>
                                <p className="text-lg font-bold text-white">10% кэшбек</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">До повышения</p>
                                <p className="text-lg font-bold text-[#00ffcc]">15 000 ₽</p>
                            </div>
                        </div>
                    </GlassmorphismCard>
                </motion.div>

                {/* ОБЩИЙ БАЛАНС БОНУСОВ */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] rounded-[3rem] blur opacity-15 group-hover:opacity-25 transition-opacity" />

                    <GlassmorphismCard className="p-8 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#d67a9d] to-[#ff3366] rounded-2xl flex items-center justify-center border border-white/10">
                                    <Coins size={28} className="text-white" />
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] px-4 py-2 rounded-full"
                                >
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white">ВАШИ БОНУСЫ</span>
                                </motion.div>
                            </div>

                            <h3 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-6">
                                {availablePoints.toLocaleString()}
                                <span className="text-[12px] text-[#71b3c9] tracking-normal uppercase ml-3">GIGA COINS</span>
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-white/60">1 Giga Coin = 1 ₽</span>
                                    <span className="text-[#00ffcc] font-bold">100% к оплате</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((availablePoints / 5000) * 100, 100)}%` }}
                                        className="h-full bg-gradient-to-r from-[#d67a9d] to-[#71b3c9]"
                                    />
                                </div>
                                <p className="text-[9px] text-white/40 text-center">
                                    До следующего бонусного уровня: {Math.max(5000 - availablePoints, 0)} coins
                                </p>
                            </div>
                        </div>

                        <Link href="/catalog" className="w-full mt-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-xl hover:shadow-[#d67a9d]/30 transition-all duration-300"
                            >
                                <span>ПОТРАТИТЬ БОНУСЫ</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </GlassmorphismCard>
                </motion.div>
            </div>

            {/* ИСТОРИЯ ТРАНЗАКЦИЙ */}
            <GlassmorphismCard className="p-8 mb-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                            <History size={20} className="text-[#71b3c9]" />
                        </div>
                        <div>
                            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2 italic">
                                ИСТОРИЯ ОПЕРАЦИЙ
                            </h4>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest">Все движения бонусов</p>
                        </div>
                    </div>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest italic px-3 py-1 bg-white/5 rounded-full">
                        Последние 10
                    </span>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {bonusHistory.length > 0 ? (
                        bonusHistory.map((log, index) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group"
                            >
                                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:border-white/10">
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${Number(log.amount) > 0 ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/10' : 'bg-gradient-to-br from-red-500/20 to-pink-500/10'} border ${Number(log.amount) > 0 ? 'border-green-500/30' : 'border-red-500/30'}`}
                                        >
                                            {Number(log.amount) > 0 ? (
                                                <TrendingUp size={20} className="text-green-500" />
                                            ) : (
                                                <TrendingDown size={20} className="text-red-500" />
                                            )}
                                        </motion.div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase leading-tight italic text-white">
                                                {log.reason || 'Транзакция'}
                                            </p>
                                            <p className="text-[9px] text-white/30 font-medium uppercase mt-1">
                                                {log.created_at ? new Date(log.created_at).toLocaleDateString('ru-RU', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : 'Дата неизвестна'}
                                            </p>
                                            {log.order_id && (
                                                <p className="text-[8px] text-[#71b3c9] font-bold mt-1">
                                                    Заказ #{log.order_id.slice(0, 8)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-lg font-black italic ${Number(log.amount) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {Number(log.amount) > 0 ? `+${log.amount}` : log.amount}
                                        </span>
                                        <p className="text-[8px] text-white/40 font-bold uppercase mt-1">
                                            GIGA COINS
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-16 opacity-40"
                        >
                            <Clock size={48} strokeWidth={1} className="mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-widest mb-2 italic">Нет операций</p>
                            <p className="text-[9px] text-white/30 text-center max-w-xs">
                                Здесь будут отображаться все начисления и списания бонусов
                            </p>
                        </motion.div>
                    )}
                </div>

                {bonusHistory.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <Link href="/bonus-history">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                ВСЯ ИСТОРИЯ ОПЕРАЦИЙ
                            </motion.button>
                        </Link>
                    </div>
                )}
            </GlassmorphismCard>
        </>
    )

    const renderOrdersTab = () => (
        <div className="space-y-8">
            <GlassmorphismCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#d67a9d] to-[#ff3366] rounded-2xl flex items-center justify-center">
                            <Package size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                                ВСЕ ЗАКАЗЫ
                            </h2>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                {orders.length} активных и завершенных
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                            <option>Все статусы</option>
                            <option>Активные</option>
                            <option>Завершенные</option>
                        </select>
                        <select className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                            <option>Сначала новые</option>
                            <option>Сначала старые</option>
                        </select>
                    </div>
                </div>

                <AnimatePresence>
                    {orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map((order, index) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all group"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-[8px] font-black text-[#d67a9d] uppercase tracking-widest bg-[#d67a9d]/10 px-3 py-1 rounded-full">
                                                    #{order.id.slice(0, 12).toUpperCase()}
                                                </span>
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'Получен'
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : 'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-[8px] text-white/40">
                                                    {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black italic uppercase mb-2">
                                                {order.total_amount.toLocaleString()} ₽
                                            </h3>
                                            <p className="text-[11px] text-white/60 flex items-center gap-2">
                                                <MapPin size={12} />
                                                {order.address}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-xl hover:border-white/20">
                                                Детали
                                            </button>
                                            <button className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-black px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                                                Повторить
                                            </button>
                                        </div>
                                    </div>

                                    {/* Прогресс бар */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[10px] font-black uppercase text-[#71b3c9] tracking-widest">
                                                Статус доставки
                                            </span>
                                            <span className="text-[10px] font-black text-white/60">
                                                {STATUS_PROGRESS[order.status] || 0}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${STATUS_PROGRESS[order.status] || 0}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className="h-full bg-gradient-to-r from-[#71b3c9] to-[#d67a9d] relative"
                                            >
                                                <motion.div
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            </motion.div>
                                        </div>

                                        <div className="grid grid-cols-7 mt-3">
                                            {Object.keys(STATUS_PROGRESS).map((status, i) => (
                                                <div key={status} className="relative">
                                                    <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${STATUS_PROGRESS[status] <= (STATUS_PROGRESS[order.status] || 0)
                                                            ? 'bg-[#71b3c9]'
                                                            : 'bg-white/10'
                                                        }`} />
                                                    <p className="text-[6px] text-white/30 text-center uppercase leading-tight">
                                                        {status.split(' ')[0]}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Товары в заказе */}
                                    {order.items && order.items.length > 0 && (
                                        <div className="border-t border-white/10 pt-6">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">
                                                Товары в заказе ({order.items.length})
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {order.items.slice(0, 4).map((item: any, idx: number) => (
                                                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 hover:border-white/10 transition-all group/item">
                                                        <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-black/50">
                                                            <img
                                                                src={item.image}
                                                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                                                alt={item.name}
                                                            />
                                                        </div>
                                                        <p className="text-[10px] font-black uppercase leading-tight truncate mb-1">
                                                            {item.name}
                                                        </p>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[12px] font-bold text-[#71b3c9]">
                                                                {item.quantity} шт
                                                            </span>
                                                            <span className="text-[11px] font-black">
                                                                {item.price ? `${(item.price * item.quantity).toLocaleString()} ₽` : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {order.items.length > 4 && (
                                                <div className="text-center mt-4">
                                                    <button className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                                                        +{order.items.length - 4} еще
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                                <Package size={40} className="text-white/20" />
                            </div>
                            <h3 className="text-xl font-black italic uppercase mb-3">Нет заказов</h3>
                            <p className="text-white/40 mb-8 max-w-md mx-auto">
                                У вас еще нет оформленных заказов. Самое время сделать первую покупку!
                            </p>
                            <Link href="/catalog">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-black px-8 py-4 rounded-2xl font-black uppercase text-[12px] tracking-widest"
                                >
                                    Перейти в каталог
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassmorphismCard>
        </div>
    )

    const renderViewedTab = () => (
        <div className="space-y-8">
            <GlassmorphismCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#71b3c9] to-[#00ffcc] rounded-2xl flex items-center justify-center">
                            <Eye size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                                ВЫ СМОТРЕЛИ
                            </h2>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                {recentlyViewed.length} последних просмотров
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem('recentlyViewed')
                            setRecentlyViewed([])
                        }}
                        className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-red-500 transition-colors px-4 py-2 border border-white/10 rounded-xl hover:border-red-500/30"
                    >
                        Очистить историю
                    </button>
                </div>

                {recentlyViewed.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recentlyViewed.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <Link href={`/product/${product.id}`}>
                                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 hover:border-white/20 transition-all h-full">
                                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-black/50 relative">
                                            <img
                                                src={product.image}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                alt={product.name}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
                                            >
                                                <Heart size={18} className="text-white" />
                                            </motion.button>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#71b3c9] mb-1">
                                                {product.category}
                                            </p>
                                            <h3 className="text-[14px] font-black uppercase leading-tight mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-[12px] text-white/60 line-clamp-2">
                                                {product.description?.slice(0, 80)}...
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-black">{product.price?.toLocaleString()} ₽</p>
                                                {product.old_price && (
                                                    <p className="text-[11px] text-white/40 line-through">
                                                        {product.old_price.toLocaleString()} ₽
                                                    </p>
                                                )}
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-10 h-10 bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] rounded-xl flex items-center justify-center"
                                            >
                                                <ShoppingBag size={18} className="text-black" />
                                            </motion.button>
                                        </div>

                                        {product.in_stock && (
                                            <div className="flex items-center gap-2 mt-4">
                                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">
                                                    В наличии
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                            <Eye size={40} className="text-white/20" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase mb-3">История просмотров пуста</h3>
                        <p className="text-white/40 mb-8 max-w-md mx-auto">
                            Товары, которые вы просматриваете, будут появляться здесь
                        </p>
                        <Link href="/catalog">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-black px-8 py-4 rounded-2xl font-black uppercase text-[12px] tracking-widest"
                            >
                                Начать покупки
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </GlassmorphismCard>
        </div>
    )

    const renderNewsTab = () => (
        <div className="space-y-8">
            <GlassmorphismCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#ffcc00] to-[#ff9900] rounded-2xl flex items-center justify-center">
                            <Bell size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                                ПОСЛЕДНИЕ НОВОСТИ
                            </h2>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                Актуальные обновления и акции
                            </p>
                        </div>
                    </div>

                    <button className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-xl hover:border-white/20">
                        Все новости
                    </button>
                </div>

                {news.length > 0 ? (
                    <div className="space-y-6">
                        {news.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all">
                                    <div className="flex flex-col lg:flex-row">
                                        <div className="lg:w-1/3 relative">
                                            <div className="aspect-video lg:aspect-auto lg:h-full bg-gradient-to-br from-[#d67a9d]/20 to-[#71b3c9]/20">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        className="w-full h-full object-cover"
                                                        alt={item.title}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Bell size={48} className="text-white/10" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute top-4 left-4">
                                                <span className="text-[8px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                                                    {new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="lg:w-2/3 p-6 lg:p-8">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-xl font-black italic uppercase pr-8">
                                                    {item.title}
                                                </h3>
                                                <ChevronRight size={20} className="text-white/20 group-hover:text-[#71b3c9] transition-colors" />
                                            </div>

                                            <p className="text-white/60 mb-6 line-clamp-3">
                                                {item.content}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                                    {new Date(item.created_at).toLocaleDateString('ru-RU', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>

                                                <button className="text-[10px] font-black uppercase tracking-widest text-[#71b3c9] hover:text-[#d67a9d] transition-colors">
                                                    Читать полностью
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                            <Bell size={40} className="text-white/20" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase mb-3">Новостей пока нет</h3>
                        <p className="text-white/40 max-w-md mx-auto">
                            Скоро здесь появятся актуальные новости и обновления
                        </p>
                    </motion.div>
                )}
            </GlassmorphismCard>
        </div>
    )

    const renderStatsTab = () => (
        <div className="space-y-8">
            <GlassmorphismCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#9966ff] to-[#6600ff] rounded-2xl flex items-center justify-center">
                            <BarChart3 size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                                ДЕТАЛЬНАЯ СТАТИСТИКА
                            </h2>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                Анализ вашей активности
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-white/40 mb-6">
                            Активность по месяцам
                        </h3>
                        <div className="space-y-4">
                            {[
                                { month: 'Декабрь', orders: 8, spent: 84500 },
                                { month: 'Ноябрь', orders: 12, spent: 124300 },
                                { month: 'Октябрь', orders: 6, spent: 67200 },
                                { month: 'Сентябрь', orders: 9, spent: 98300 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[12px] font-medium">{item.month}</span>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[12px] font-bold">{item.orders} заказов</p>
                                            <p className="text-[10px] text-white/40">{item.spent.toLocaleString()} ₽</p>
                                        </div>
                                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] rounded-full"
                                                style={{ width: `${(item.orders / 12) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-white/40 mb-6">
                            Категории покупок
                        </h3>
                        <div className="space-y-4">
                            {[
                                { category: 'Электроника', percent: 45, color: 'from-[#d67a9d] to-[#ff3366]' },
                                { category: 'Одежда', percent: 25, color: 'from-[#71b3c9] to-[#00ffcc]' },
                                { category: 'Аксессуары', percent: 15, color: 'from-[#ffcc00] to-[#ff9900]' },
                                { category: 'Другое', percent: 15, color: 'from-[#9966ff] to-[#6600ff]' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-[12px] font-medium">{item.category}</span>
                                        <span className="text-[12px] font-bold">{item.percent}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percent}%` }}
                                            transition={{ duration: 1.5, delay: i * 0.2 }}
                                            className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-center">
                        <p className="text-[10px] text-white/40 mb-2">Всего покупок</p>
                        <p className="text-2xl font-black">{userStats.totalOrders}</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-center">
                        <p className="text-[10px] text-white/40 mb-2">Экономия</p>
                        <p className="text-2xl font-black text-green-500">+{Math.round(userStats.totalSpent * 0.05).toLocaleString()} ₽</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-center">
                        <p className="text-[10px] text-white/40 mb-2">Дней в системе</p>
                        <p className="text-2xl font-black">365+</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-center">
                        <p className="text-[10px] text-white/40 mb-2">Уровень</p>
                        <p className="text-2xl font-black text-[#ffcc00]">{userRank}</p>
                    </div>
                </div>
            </GlassmorphismCard>
        </div>
    )

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4 sm:px-6 font-sans overflow-hidden">
            <FloatingSnowflakes />
            <FloatingGifts />
            <NeonGrid />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* НАВИГАЦИЯ ВКЛАДОК */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-24 z-50 mb-12"
                >
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 max-w-3xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-2">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-black shadow-lg shadow-[#d67a9d]/30'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-xl border-2 border-white/20"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* СОДЕРЖИМОЕ ВКЛАДОК */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'main' && renderMainTab()}
                        {activeTab === 'orders' && renderOrdersTab()}
                        {activeTab === 'viewed' && renderViewedTab()}
                        {activeTab === 'news' && renderNewsTab()}
                        {activeTab === 'stats' && renderStatsTab()}
                    </motion.div>
                </AnimatePresence>

                {/* КНОПКА ВЫХОДА */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-20 flex justify-center"
                >
                    <button
                        onClick={handleLogout}
                        className="group relative"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex flex-col items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group-hover:border-red-500/30">
                            <div className="flex items-center gap-3">
                                <LogOut size={16} className="text-white/40 group-hover:text-red-500 transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/60 group-hover:text-red-500 transition-colors">
                                    Выйти из системы
                                </span>
                            </div>
                            <div className="h-[1px] w-16 bg-white/10 group-hover:w-24 group-hover:bg-red-500 transition-all" />
                        </div>
                    </button>
                </motion.div>
            </div>

            {/* Новогодний снежный эффект */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-0"
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 50%, rgba(113, 179, 201, 0.03) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 20%, rgba(214, 122, 157, 0.03) 0%, transparent 50%)',
                        'radial-gradient(circle at 40% 80%, rgba(113, 179, 201, 0.03) 0%, transparent 50%)',
                    ]
                }}
                transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
            />
        </main>
    )
}
// Продолжение файла page.tsx

// Дополнительные 3D эффекты и компоненты
const ParticleField = () => {
    const particles = Array.from({ length: 100 })

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-[2px] h-[2px] bg-white/10 rounded-full"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        scale: Math.random() * 0.5 + 0.3,
                    }}
                    animate={{
                        y: [null, Math.random() * window.innerHeight],
                        x: [null, Math.random() * window.innerWidth],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    )
}

const HolographicRing = ({ size = 400, color = '#d67a9d' }: { size?: number, color?: string }) => {
    return (
        <motion.div
            className="absolute rounded-full border"
            style={{
                width: size,
                height: size,
                borderColor: `${color}20`,
                borderWidth: '2px',
            }}
            animate={{
                rotateY: [0, 180, 360],
                rotateX: [0, 90, 0],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
            }}
        >
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                    background: `radial-gradient(circle at 30% 30%, ${color}15, transparent 50%)`,
                }}
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </motion.div>
    )
}

const FrostedGlassEffect = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative">
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10"
                animate={{
                    background: [
                        'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                        'linear-gradient(135deg, rgba(214,122,157,0.05) 0%, rgba(113,179,201,0.02) 100%)',
                        'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    ],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    )
}

const NewYearCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const newYear = new Date(Date.UTC(2024, 0, 1, 0, 0, 0)) // 1 января 2024
            const now = new Date()
            const difference = newYear.getTime() - now.getTime()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-8 right-8 z-50"
        >
            <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#d67a9d] rounded-[2rem] blur-xl opacity-20" />
                <div className="relative bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Gift className="text-[#ffcc00]" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                            До Нового Года
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="text-center">
                                <div className="bg-white/5 rounded-xl p-3 mb-1">
                                    <span className="text-xl font-black text-white">
                                        {value.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
                                    {unit === 'days' ? 'дней' :
                                        unit === 'hours' ? 'часов' :
                                            unit === 'minutes' ? 'мин' : 'сек'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <motion.div
                        className="mt-4 h-1 bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffcc00] rounded-full"
                        animate={{
                            backgroundPosition: ['0%', '100%', '0%'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            backgroundSize: '200% 100%',
                        }}
                    />
                </div>
            </div>
        </motion.div>
    )
}

// Основной компонент продолжение
const ProfilePageContinued = () => {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [availablePoints, setAvailablePoints] = useState(0)
    const [bonusHistory, setBonusHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [editingUsername, setEditingUsername] = useState(false)
    const [username, setUsername] = useState('')
    const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
    const [news, setNews] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('main')
    const [userRank, setUserRank] = useState('')
    const [userStats, setUserStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        favoriteCategory: '',
        averageOrder: 0,
        completedOrders: 0,
        canceledOrders: 0,
    })
    const [cashbackPercentage, setCashbackPercentage] = useState(0)
    const [referralCode, setReferralCode] = useState('')
    const [referralStats, setReferralStats] = useState({
        totalReferrals: 0,
        earnedFromReferrals: 0,
        pendingReferrals: 0,
    })
    const [notifications, setNotifications] = useState<any[]>([])
    const [wishlist, setWishlist] = useState<any[]>([])
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [subscription, setSubscription] = useState<any>(null)
    const [addresses, setAddresses] = useState<any[]>([])
    const [paymentMethods, setPaymentMethods] = useState<any[]>([])

    const [achievements, setAchievements] = useState<any[]>([])
    const [userLevel, setUserLevel] = useState(1)
    const [levelProgress, setLevelProgress] = useState(0)
    const [nextLevelPoints, setNextLevelPoints] = useState(1000)

    // Новые состояния для анимаций
    const [hoveredCard, setHoveredCard] = useState<string | null>(null)
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
    const [showConfetti, setShowConfetti] = useState(false)

    // Загрузка всех данных
    useEffect(() => {
        const loadAllData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }
                setUser(user)

                // Параллельная загрузка всех данных
                const [
                    { data: profileData },
                    { data: ordersData },
                    { data: bonusHistoryData },
                    { data: newsData },
                    { data: notificationsData },
                    { data: wishlistData },
                    { data: achievementsData },
                    { data: addressesData },
                    { data: paymentMethodsData },
                ] = await Promise.all([
                    supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single(),
                    supabase
                        .from('orders')
                        .select('*, order_items(*, products(*))')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false }),
                    supabase
                        .from('bonus_history')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(20),
                    supabase
                        .from('news')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(10),
                    supabase
                        .from('notifications')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('read', false)
                        .order('created_at', { ascending: false })
                        .limit(5),
                    supabase
                        .from('wishlist')
                        .select('*, products(*)')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false }),
                    supabase
                        .from('achievements')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('unlocked_at', { ascending: false }),
                    supabase
                        .from('addresses')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('is_default', { ascending: false }),
                    supabase
                        .from('payment_methods')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('is_default', { ascending: false }),
                ])

                // Обработка данных профиля
                if (profileData) {
                    setAvailablePoints(profileData.available_points || 0)
                    setUsername(profileData.username || user.email?.split('@')[0] || '')
                    setUserRank(profileData.rank || 'RECRUIT')
                    setCashbackPercentage(profileData.cashback_percentage || 5)
                    setReferralCode(profileData.referral_code || '')

                    // Расчет уровня пользователя
                    const points = profileData.available_points || 0
                    const level = Math.floor(points / 1000) + 1
                    setUserLevel(level)
                    setLevelProgress((points % 1000) / 10)
                    setNextLevelPoints(level * 1000)
                }

                // Обработка заказов
                if (ordersData) {
                    const formattedOrders = ordersData.map(order => ({
                        ...order,
                        items: order.order_items?.map((item: any) => ({
                            ...item.products,
                            quantity: item.quantity,
                            price: item.price,
                        })) || [],
                    }))

                    setOrders(formattedOrders)

                    const stats = {
                        totalOrders: formattedOrders.length,
                        totalSpent: formattedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
                        completedOrders: formattedOrders.filter(o => o.status === 'Получен').length,
                        canceledOrders: formattedOrders.filter(o => o.status === 'Отменен').length,
                        favoriteCategory: 'Электроника', // Можно рассчитать на основе истории
                        averageOrder: formattedOrders.length > 0
                            ? formattedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / formattedOrders.length
                            : 0,
                    }
                    setUserStats(stats)
                }

                // Остальные данные
                if (bonusHistoryData) setBonusHistory(bonusHistoryData)
                if (newsData) setNews(newsData)
                if (notificationsData) setNotifications(notificationsData)
                if (wishlistData) setWishlist(wishlistData.map(item => item.products))
                if (achievementsData) setAchievements(achievementsData)
                if (addressesData) setAddresses(addressesData)
                if (paymentMethodsData) setPaymentMethods(paymentMethodsData)

                // Загрузка просмотренных товаров
                const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
                if (viewedIds.length > 0) {
                    const { data: viewedProducts } = await supabase
                        .from('products')
                        .select('*')
                        .in('id', viewedIds.slice(0, 12))

                    if (viewedProducts) setRecentlyViewed(viewedProducts)
                }

                // Загрузка реферальной статистики
                const { data: referralsData } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('referred_by', user.id)

                if (referralsData) {
                    setReferralStats({
                        totalReferrals: referralsData.length,
                        earnedFromReferrals: referralsData.length * 500, // 500 бонусов за каждого реферала
                        pendingReferrals: 0,
                    })
                }

                // Загрузка подписки
                const { data: subscriptionData } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'active')
                    .single()

                if (subscriptionData) setSubscription(subscriptionData)

                // Загрузка последних поисков
                const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]')
                setRecentSearches(searches.slice(0, 5))

            } catch (error) {
                console.error('Error loading data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadAllData()
    }, [router])

    // Функции для работы с данными
    const handleAddToWishlist = async (productId: string) => {
        if (!user) return

        const { error } = await supabase
            .from('wishlist')
            .insert({
                user_id: user.id,
                product_id: productId,
                added_at: new Date().toISOString(),
            })

        if (!error) {
            // Обновляем список избранного
            const { data } = await supabase
                .from('wishlist')
                .select('*, products(*)')
                .eq('user_id', user.id)

            if (data) {
                setWishlist(data.map(item => item.products))
            }
        }
    }

    const handleRemoveFromWishlist = async (productId: string) => {
        if (!user) return

        const { error } = await supabase
            .from('wishlist')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId)

        if (!error) {
            setWishlist(prev => prev.filter(item => item.id !== productId))
        }
    }

    const handleMarkNotificationAsRead = async (notificationId: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId)

        if (!error) {
            setNotifications(prev => prev.filter(n => n.id !== notificationId))
        }
    }

    const handleAddAddress = async (addressData: any) => {
        if (!user) return

        const { error } = await supabase
            .from('addresses')
            .insert({
                user_id: user.id,
                ...addressData,
                created_at: new Date().toISOString(),
            })

        if (!error) {
            const { data } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', user.id)

            if (data) setAddresses(data)
        }
    }

    const handleSetDefaultAddress = async (addressId: string) => {
        // Сначала снимаем default со всех адресов
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user?.id)

        // Устанавливаем новый default
        const { error } = await supabase
            .from('addresses')
            .update({ is_default: true })
            .eq('id', addressId)

        if (!error) {
            const { data } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', user?.id)

            if (data) setAddresses(data)
        }
    }

    const handleAddPaymentMethod = async (paymentData: any) => {
        if (!user) return

        const { error } = await supabase
            .from('payment_methods')
            .insert({
                user_id: user.id,
                ...paymentData,
                created_at: new Date().toISOString(),
            })

        if (!error) {
            const { data } = await supabase
                .from('payment_methods')
                .select('*')
                .eq('user_id', user.id)

            if (data) setPaymentMethods(data)
        }
    }

    const handleUpdateSubscription = async (plan: string) => {
        if (!user) return

        const { error } = await supabase
            .from('subscriptions')
            .upsert({
                user_id: user.id,
                plan: plan,
                status: 'active',
                updated_at: new Date().toISOString(),
            })

        if (!error) {
            const { data } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (data) setSubscription(data)
        }
    }

    // Анимации и эффекты
    const ConfettiExplosion = () => {
        if (!showConfetti) return null

        return (
            <div className="fixed inset-0 pointer-events-none z-50">
                {Array.from({ length: 150 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2"
                        initial={{
                            x: window.innerWidth / 2,
                            y: window.innerHeight / 2,
                            opacity: 1,
                            scale: 1,
                        }}
                        animate={{
                            x: window.innerWidth / 2 + (Math.random() - 0.5) * 1000,
                            y: window.innerHeight + 100,
                            opacity: 0,
                            rotate: Math.random() * 360,
                            scale: 0,
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            ease: "circOut",
                        }}
                        style={{
                            background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                        }}
                    />
                ))}
            </div>
        )
    }

    const LevelUpAnimation = ({ level }: { level: number }) => {
        return (
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
                <div className="relative">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#ffcc00] via-[#ff9900] to-[#ffcc00] rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                    />

                    <div className="relative bg-black/90 backdrop-blur-3xl border-2 border-[#ffcc00] rounded-3xl p-12 text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="mb-8"
                        >
                            <Trophy size={80} className="text-[#ffcc00] mx-auto" />
                        </motion.div>

                        <h2 className="text-4xl font-black uppercase tracking-widest text-white mb-4">
                            УРОВЕНЬ {level}!
                        </h2>
                        <p className="text-white/60 text-lg mb-8">
                            Поздравляем! Вы достигли нового уровня
                        </p>

                        <div className="flex items-center justify-center gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#ffcc00]">+{level * 100}</div>
                                <div className="text-sm text-white/40">бонусов</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#ffcc00]">+{level}%</div>
                                <div className="text-sm text-white/40">кэшбек</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-[#ffcc00]">VIP</div>
                                <div className="text-sm text-white/40">статус</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    // Новые компоненты для вкладок
    const WishlistTab = () => {
        return (
            <div className="space-y-8">
                <GlassmorphismCard className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#ff3366] to-[#ff0066] rounded-2xl flex items-center justify-center">
                                <Heart size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                                    ИЗБРАННОЕ
                                </h2>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                    {wishlist.length} сохраненных товаров
                                </p>
                            </div>
                        </div>

                        {wishlist.length > 0 && (
                            <button
                                onClick={() => {
                                    if (confirm('Очистить все избранное?')) {
                                        wishlist.forEach(item => handleRemoveFromWishlist(item.id))
                                    }
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-red-500 transition-colors px-4 py-2 border border-white/10 rounded-xl hover:border-red-500/30"
                            >
                                Очистить все
                            </button>
                        )}
                    </div>

                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlist.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -8 }}
                                    className="group relative"
                                >
                                    <button
                                        onClick={() => handleRemoveFromWishlist(product.id)}
                                        className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:border-red-500/50"
                                    >
                                        <X size={14} className="text-white" />
                                    </button>

                                    <Link href={`/product/${product.id}`}>
                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 hover:border-white/20 transition-all h-full">
                                            <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-black/50 relative">
                                                <img
                                                    src={product.image}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    alt={product.name}
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                    {product.in_stock ? (
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500">
                                                            В наличии
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">
                                                            Под заказ
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#71b3c9] mb-1">
                                                    {product.category}
                                                </p>
                                                <h3 className="text-[14px] font-black uppercase leading-tight mb-2 line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {product.rating && (
                                                        <>
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={12}
                                                                    className={i < Math.floor(product.rating) ? "text-[#ffcc00] fill-[#ffcc00]" : "text-white/20"}
                                                                />
                                                            ))}
                                                            <span className="text-[10px] text-white/40">{product.rating}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-black">{product.price?.toLocaleString()} ₽</p>
                                                    {product.old_price && (
                                                        <p className="text-[11px] text-white/40 line-through">
                                                            {product.old_price.toLocaleString()} ₽
                                                        </p>
                                                    )}
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        // Добавить в корзину
                                                    }}
                                                    className="w-10 h-10 bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] rounded-xl flex items-center justify-center"
                                                >
                                                    <ShoppingBag size={18} className="text-black" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                                <Heart size={40} className="text-white/20" />
                            </div>
                            <h3 className="text-xl font-black italic uppercase mb-3">Избранное пусто</h3>
                            <p className="text-white/40 mb-8 max-w-md mx-auto">
                                Добавляйте товары в избранное, чтобы не потерять их
                            </p>
                            <Link href="/catalog">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-black px-8 py-4 rounded-2xl font-black uppercase text-[12px] tracking-widest"
                                >
                                    Найти товары
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </GlassmorphismCard>
            </div>
        )
    }

    const ReferralTab = () => {
        const [copied, setCopied] = useState(false)

        const copyReferralLink = () => {
            const link = `${window.location.origin}/register?ref=${referralCode}`
            navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }

        return (
            <div className="space-y-8">
                <GlassmorphismCard className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#00ffcc] to-[#0088cc] rounded-2xl flex items-center justify-center">
                                <Users size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                                    ПРИГЛАСИТЬ ДРУЗЕЙ
                                </h2>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                    Зарабатывайте бонусы вместе
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="lg:col-span-2">
                            <div className="bg-gradient-to-br from-[#00ffcc]/10 to-[#0088cc]/10 border border-[#00ffcc]/20 rounded-3xl p-8">
                                <h3 className="text-2xl font-black italic uppercase mb-4">
                                    Приглашайте друзей и получайте бонусы
                                </h3>
                                <p className="text-white/60 mb-6">
                                    Дайте свою реферальную ссылку друзьям. За каждого приведенного друга вы получите 500 Giga Coins, а ваш друг получит 300 Giga Coins на первый заказ.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                                                Ваша реферальная ссылка
                                            </p>
                                            <p className="text-sm font-mono truncate">
                                                {window.location.origin}/register?ref={referralCode}
                                            </p>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={copyReferralLink}
                                            className={`px-6 py-4 rounded-xl font-black uppercase text-[12px] tracking-widest ${copied
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gradient-to-r from-[#00ffcc] to-[#0088cc] text-black'
                                                }`}
                                        >
                                            {copied ? 'СКОПИРОВАНО!' : 'КОПИРОВАТЬ'}
                                        </motion.button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                                                Ваш реферальный код
                                            </p>
                                            <p className="text-2xl font-black tracking-widest">{referralCode}</p>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-3xl font-black text-[#00ffcc]">{referralStats.totalReferrals}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">друзей</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#ffcc00] to-[#ff9900] rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <Coins size={28} className="text-white" />
                                    </div>
                                    <p className="text-3xl font-black text-white">{referralStats.earnedFromReferrals}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">
                                        Заработано всего
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                                <h4 className="text-[12px] font-black uppercase tracking-widest text-white/40 mb-4">
                                    Как это работает
                                </h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#00ffcc]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-[10px] font-black text-[#00ffcc]">1</span>
                                        </div>
                                        <p className="text-[11px] text-white/60">Друг регистрируется по вашей ссылке</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#00ffcc]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-[10px] font-black text-[#00ffcc]">2</span>
                                        </div>
                                        <p className="text-[11px] text-white/60">Друг делает первый заказ от 2000 ₽</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#00ffcc]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-[10px] font-black text-[#00ffcc]">3</span>
                                        </div>
                                        <p className="text-[11px] text-white/60">Вы получаете 500 Giga Coins</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Таблица рефералов */}
                    {referralStats.totalReferrals > 0 && (
                        <div className="mt-8">
                            <h4 className="text-[12px] font-black uppercase tracking-widest text-white/40 mb-4">
                                Ваши рефералы
                            </h4>
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                                                Друг
                                            </th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                                                Дата регистрации
                                            </th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                                                Статус
                                            </th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                                                Бонусы
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(referralStats.totalReferrals)].map((_, i) => (
                                            <tr key={i} className="border-b border-white/5 last:border-0">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-[#d67a9d] to-[#71b3c9] rounded-full" />
                                                        <div>
                                                            <p className="text-[12px] font-medium">Друг {i + 1}</p>
                                                            <p className="text-[10px] text-white/40">user{i + 1}@email.com</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-[12px] text-white/60">
                                                    {new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-500">
                                                        Активен
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-[12px] font-black text-[#00ffcc]">+500</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </GlassmorphismCard>
            </div>
        )
    }

    const SettingsTab = () => {
        const [activeSettingsTab, setActiveSettingsTab] = useState('account')
        const [emailNotifications, setEmailNotifications] = useState(true)
        const [pushNotifications, setPushNotifications] = useState(true)
        const [marketingEmails, setMarketingEmails] = useState(false)
        const [twoFactorAuth, setTwoFactorAuth] = useState(false)
        const [deleteConfirm, setDeleteConfirm] = useState('')

        const settingsTabs = [
            { id: 'account', label: 'Аккаунт', icon: <User size={16} /> },
            { id: 'security', label: 'Безопасность', icon: <Shield size={16} /> },
            { id: 'notifications', label: 'Уведомления', icon: <Bell size={16} /> },
            { id: 'privacy', label: 'Конфиденциальность', icon: <Lock size={16} /> },
        ]

        const handleDeleteAccount = async () => {
            if (deleteConfirm !== 'УДАЛИТЬ') {
                alert('Введите "УДАЛИТЬ" для подтверждения')
                return
            }

            if (confirm('Вы уверены? Это действие нельзя отменить.')) {
                // Удаление аккаунта
                const { error } = await supabase.rpc('delete_user_account', {
                    user_id: user?.id
                })

                if (!error) {
                    await supabase.auth.signOut()
                    router.push('/')
                }
            }
        }

        return (
            <div className="space-y-8">
                <GlassmorphismCard className="p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Боковое меню настроек */}
                        <div className="lg:w-1/4">
                            <div className="sticky top-32 space-y-2">
                                {settingsTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveSettingsTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeSettingsTab === tab.id
                                                ? 'bg-white/10 border border-white/20'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        {tab.icon}
                                        <span className="text-[12px] font-black uppercase tracking-widest">
                                            {tab.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Основное содержание настроек */}
                        <div className="lg:w-3/4">
                            <AnimatePresence mode="wait">
                                {activeSettingsTab === 'account' && (
                                    <motion.div
                                        key="account"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-2xl font-black italic uppercase mb-6">
                                            Настройки аккаунта
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                                                    Имя пользователя
                                                </label>
                                                <div className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                                                    />
                                                    <button
                                                        onClick={handleUsernameSave}
                                                        className="px-6 py-3 bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-black rounded-xl font-black uppercase text-[12px] tracking-widest"
                                                    >
                                                        Сохранить
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={user?.email}
                                                    disabled
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                                                    Телефон
                                                </label>
                                                <div className="flex gap-3">
                                                    <input
                                                        type="tel"
                                                        placeholder="+7 (999) 999-99-99"
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                                                    />
                                                    <button className="px-6 py-3 bg-white/10 border border-white/10 rounded-xl font-black uppercase text-[12px] tracking-widest hover:bg-white/20 transition-colors">
                                                        Подтвердить
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                                                    Язык
                                                </label>
                                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                                                    <option>Русский</option>
                                                    <option>English</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                                                    Часовой пояс
                                                </label>
                                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                                                    <option>Москва (GMT+3)</option>
                                                    <option>Калининград (GMT+2)</option>
                                                    <option>Екатеринбург (GMT+5)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeSettingsTab === 'security' && (
                                    <motion.div
                                        key="security"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-2xl font-black italic uppercase mb-6">
                                            Безопасность
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                                <div>
                                                    <h4 className="text-[14px] font-black uppercase mb-1">
                                                        Двухфакторная аутентификация
                                                    </h4>
                                                    <p className="text-[12px] text-white/60">
                                                        Добавьте дополнительный уровень безопасности
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${twoFactorAuth ? 'bg-green-500' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${twoFactorAuth ? 'left-7' : 'left-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                                <h4 className="text-[14px] font-black uppercase mb-4">
                                                    Смена пароля
                                                </h4>
                                                <div className="space-y-4">
                                                    <input
                                                        type="password"
                                                        placeholder="Текущий пароль"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                                                    />
                                                    <input
                                                        type="password"
                                                        placeholder="Новый пароль"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                                                    />
                                                    <input
                                                        type="password"
                                                        placeholder="Подтвердите новый пароль"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                                                    />
                                                    <button className="px-6 py-3 bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-black rounded-xl font-black uppercase text-[12px] tracking-widest">
                                                        Сменить пароль
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                                <h4 className="text-[14px] font-black uppercase mb-4">
                                                    Активные сессии
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[12px] font-medium">Текущее устройство</p>
                                                            <p className="text-[10px] text-white/40">Chrome • Windows • Москва</p>
                                                        </div>
                                                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-full">
                                                            Активна
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="mt-4 text-[12px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
                                                    Завершить все другие сессии
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeSettingsTab === 'notifications' && (
                                    <motion.div
                                        key="notifications"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-2xl font-black italic uppercase mb-6">
                                            Уведомления
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                                <div>
                                                    <h4 className="text-[14px] font-black uppercase mb-1">
                                                        Email уведомления
                                                    </h4>
                                                    <p className="text-[12px] text-white/60">
                                                        Получать уведомления на email
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setEmailNotifications(!emailNotifications)}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${emailNotifications ? 'bg-green-500' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${emailNotifications ? 'left-7' : 'left-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                                <div>
                                                    <h4 className="text-[14px] font-black uppercase mb-1">
                                                        Push уведомления
                                                    </h4>
                                                    <p className="text-[12px] text-white/60">
                                                        Получать push-уведомления в браузере
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setPushNotifications(!pushNotifications)}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${pushNotifications ? 'bg-green-500' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${pushNotifications ? 'left-7' : 'left-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                                <div>
                                                    <h4 className="text-[14px] font-black uppercase mb-1">
                                                        Маркетинговые рассылки
                                                    </h4>
                                                    <p className="text-[12px] text-white/60">
                                                        Получать информацию об акциях и новинках
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setMarketingEmails(!marketingEmails)}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${marketingEmails ? 'bg-green-500' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${marketingEmails ? 'left-7' : 'left-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h4 className="text-[14px] font-black uppercase mb-4">
                                                Настройки уведомлений по типам
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Новые заказы', enabled: true },
                                                    { label: 'Изменение статуса заказа', enabled: true },
                                                    { label: 'Начисление бонусов', enabled: true },
                                                    { label: 'Акции и скидки', enabled: false },
                                                    { label: 'Новости и обновления', enabled: true },
                                                    { label: 'Напоминания о корзине', enabled: false },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                                        <span className="text-[12px]">{item.label}</span>
                                                        <div className={`w-8 h-4 rounded-full ${item.enabled ? 'bg-green-500' : 'bg-white/10'}`}>
                                                            <div className={`w-4 h-4 rounded-full bg-white transform ${item.enabled ? 'translate-x-4' : ''}`} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeSettingsTab === 'privacy' && (
                                    <motion.div
                                        key="privacy"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-2xl font-black italic uppercase mb-6">
                                            Конфиденциальность
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                                <h4 className="text-[14px] font-black uppercase mb-4">
                                                    Экспорт данных
                                                </h4>
                                                <p className="text-[12px] text-white/60 mb-4">
                                                    Вы можете запросить экспорт всех ваших личных данных в формате JSON.
                                                </p>
                                                <button className="px-6 py-3 bg-white/10 border border-white/10 rounded-xl font-black uppercase text-[12px] tracking-widest hover:bg-white/20 transition-colors">
                                                    Запросить экспорт данных
                                                </button>
                                            </div>

                                            <div className="p-4 bg-white/5 border border-red-500/20 rounded-xl">
                                                <h4 className="text-[14px] font-black uppercase mb-4 text-red-500">
                                                    Удаление аккаунта
                                                </h4>
                                                <p className="text-[12px] text-white/60 mb-4">
                                                    Это действие нельзя отменить. Все ваши данные будут удалены без возможности восстановления.
                                                </p>
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        placeholder='Введите "УДАЛИТЬ" для подтверждения'
                                                        value={deleteConfirm}
                                                        onChange={(e) => setDeleteConfirm(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                                                    />
                                                    <button
                                                        onClick={handleDeleteAccount}
                                                        disabled={deleteConfirm !== 'УДАЛИТЬ'}
                                                        className={`px-6 py-3 rounded-xl font-black uppercase text-[12px] tracking-widest ${deleteConfirm === 'УДАЛИТЬ'
                                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                                                            } transition-colors`}
                                                    >
                                                        Удалить аккаунт навсегда
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </GlassmorphismCard>
            </div>
        )
    }

    const AchievementsTab = () => {
        const allAchievements = [
            {
                id: 1,
                name: 'Первая покупка',
                description: 'Совершите первую покупку',
                icon: '🎯',
                points: 100,
                unlocked: true,
                progress: 100,
                unlocked_at: '2023-12-01',
            },
            {
                id: 2,
                name: 'Коллекционер',
                description: 'Купите 10 различных товаров',
                icon: '🏆',
                points: 500,
                unlocked: false,
                progress: 70,
            },
            {
                id: 3,
                name: 'Экономист',
                description: 'Сэкономьте 5000 ₽ с помощью скидок',
                icon: '💰',
                points: 300,
                unlocked: true,
                progress: 100,
                unlocked_at: '2023-12-15',
            },
            {
                id: 4,
                name: 'Постоянный клиент',
                description: 'Совершите 50 покупок',
                icon: '⭐',
                points: 1000,
                unlocked: false,
                progress: 25,
            },
            {
                id: 5,
                name: 'Реферальный мастер',
                description: 'Пригласите 5 друзей',
                icon: '👥',
                points: 750,
                unlocked: false,
                progress: 60,
            },
            {
                id: 6,
                name: 'Ранняя пташка',
                description: 'Совершите покупку в 7 утра',
                icon: '🌅',
                points: 150,
                unlocked: false,
                progress: 0,
            },
        ]

        return (
            <div className="space-y-8">
                <GlassmorphismCard className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#ffcc00] to-[#ff9900] rounded-2xl flex items-center justify-center">
                                <Trophy size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                                    ДОСТИЖЕНИЯ
                                </h2>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                    {achievements.length} из {allAchievements.length} разблокировано
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-3xl font-black text-[#ffcc00]">
                                {allAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                Всего очков
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {allAchievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className={`relative p-6 rounded-3xl border ${achievement.unlocked
                                        ? 'bg-gradient-to-br from-[#ffcc00]/10 to-[#ff9900]/10 border-[#ffcc00]/20'
                                        : 'bg-white/[0.02] border-white/10'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                                        {achievement.icon}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-[14px] font-black uppercase mb-1">
                                            {achievement.name}
                                        </h3>
                                        <p className="text-[12px] text-white/60 mb-3">
                                            {achievement.description}
                                        </p>

                                        <div className="mb-3">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                                                <span className={achievement.unlocked ? 'text-[#ffcc00]' : 'text-white/40'}>
                                                    {achievement.points} очков
                                                </span>
                                                <span>{achievement.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${achievement.progress}%` }}
                                                    transition={{ duration: 1, delay: index * 0.1 }}
                                                    className={`h-full ${achievement.unlocked
                                                            ? 'bg-gradient-to-r from-[#ffcc00] to-[#ff9900]'
                                                            : 'bg-gradient-to-r from-[#71b3c9] to-[#d67a9d]'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {achievement.unlocked && achievement.unlocked_at && (
                                            <p className="text-[10px] text-white/40">
                                                Разблокировано: {new Date(achievement.unlocked_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {achievement.unlocked && (
                                    <motion.div
                                        className="absolute -top-2 -right-2"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles size={24} className="text-[#ffcc00]" />
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-8">
                        <h4 className="text-[14px] font-black uppercase tracking-widest text-white/40 mb-4">
                            Ваш прогресс
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-2xl font-black text-[#ffcc00]">
                                    {userLevel}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                    Уровень
                                </p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-2xl font-black text-[#ffcc00]">
                                    {levelProgress}%
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                    Прогресс уровня
                                </p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-2xl font-black text-[#ffcc00]">
                                    {nextLevelPoints}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                    До след. уровня
                                </p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-2xl font-black text-[#ffcc00]">
                                    #{userLevel * 100}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                    Рейтинг
                                </p>
                            </div>
                        </div>
                    </div>
                </GlassmorphismCard>
            </div>
        )
    }

    const SubscriptionTab = () => {
        const plans = [
            {
                name: 'Базовый',
                price: 0,
                features: [
                    'Кэшбек 5%',
                    'Базовая поддержка',
                    'Доступ к акциям',
                    'История заказов',
                ],
                current: !subscription,
            },
            {
                name: 'ПРЕМИУМ',
                price: 299,
                features: [
                    'Кэшбек 10%',
                    'Приоритетная поддержка',
                    'Ранний доступ к скидкам',
                    'Бесплатная доставка',
                    'Эксклюзивные товары',
                ],
                current: subscription?.plan === 'premium',
                popular: true,
            },
            {
                name: 'VIP',
                price: 999,
                features: [
                    'Кэшбек 15%',
                    'Персональный менеджер',
                    'Персональные скидки',
                    'Бесплатная доставка 24/7',
                    'Доступ к лимитированным товарам',
                    'Приглашения на мероприятия',
                ],
                current: subscription?.plan === 'vip',
            },
        ]

        return (
            <div className="space-y-8">
                <GlassmorphismCard className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#9966ff] to-[#6600ff] rounded-2xl flex items-center justify-center">
                                <Crown size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                                    ПОДПИСКА
                                </h2>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                    {subscription ? `Активен план: ${subscription.plan}` : 'Без активной подписки'}
                                </p>
                            </div>
                        </div>

                        {subscription && (
                            <div className="text-right">
                                <p className="text-[12px] font-black uppercase tracking-widest text-green-500">
                                    Активна до {new Date(subscription.ends_at).toLocaleDateString()}
                                </p>
                                <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors mt-1">
                                    Отменить подписку
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                className={`relative p-8 rounded-3xl border ${plan.current
                                        ? 'border-[#9966ff] bg-gradient-to-b from-[#9966ff]/10 to-transparent'
                                        : 'border-white/10 bg-white/[0.02]'
                                    } ${plan.popular ? 'ring-2 ring-[#9966ff] ring-offset-2 ring-offset-black' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 bg-gradient-to-r from-[#9966ff] to-[#6600ff] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                            ПОПУЛЯРНЫЙ
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-black italic uppercase mb-2">
                                        {plan.name}
                                    </h3>
                                    <div className="mb-4">
                                        <span className="text-4xl font-black">{plan.price}</span>
                                        <span className="text-white/60">₽/месяц</span>
                                    </div>

                                    {plan.current ? (
                                        <button className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-[12px] font-black uppercase tracking-widest cursor-default">
                                            ТЕКУЩИЙ ПЛАН
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUpdateSubscription(plan.name.toLowerCase())}
                                            className="w-full py-3 bg-gradient-to-r from-[#9966ff] to-[#6600ff] text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                                        >
                                            ВЫБРАТЬ
                                        </button>
                                    )}
                                </div>

                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-green-500" />
                                            <span className="text-[12px]">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-8">
                        <h4 className="text-[14px] font-black uppercase tracking-widest text-white/40 mb-4">
                            История платежей
                        </h4>
                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                            <div className="divide-y divide-white/10">
                                {[
                                    { date: '2023-12-01', plan: 'ПРЕМИУМ', amount: 299, status: 'Успешно' },
                                    { date: '2023-11-01', plan: 'ПРЕМИУМ', amount: 299, status: 'Успешно' },
                                    { date: '2023-10-01', plan: 'Базовый', amount: 0, status: 'Бесплатно' },
                                ].map((payment, i) => (
                                    <div key={i} className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="text-[12px] font-medium">{payment.plan}</p>
                                            <p className="text-[10px] text-white/40">
                                                {new Date(payment.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[12px] font-black">
                                                {payment.amount > 0 ? `${payment.amount} ₽` : 'Бесплатно'}
                                            </p>
                                            <p className={`text-[10px] font-black uppercase ${payment.status === 'Успешно' ? 'text-green-500' : 'text-white/40'
                                                }`}>
                                                {payment.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </GlassmorphismCard>
            </div>
        )
    }

    // Основной рендеринг продолжается
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-4 border-[#d67a9d] border-t-transparent rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white font-black italic tracking-[0.5em] text-sm">
                            ЗАГРУЗКА...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4 sm:px-6 font-sans overflow-hidden relative">
            {/* Анимационные эффекты */}
            <ParticleField />
            <FloatingSnowflakes />
            <FloatingGifts />
            <NeonGrid />
            <NewYearCountdown />
            <ConfettiExplosion />

            {/* Голографические кольца */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4">
                    <HolographicRing size={300} color="#d67a9d" />
                </div>
                <div className="absolute bottom-1/4 right-1/4">
                    <HolographicRing size={400} color="#71b3c9" />
                </div>
                <div className="absolute top-1/2 right-1/3">
                    <HolographicRing size={200} color="#ffcc00" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Уведомления */}
                {notifications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="bg-gradient-to-r from-[#ffcc00]/10 to-[#ff9900]/10 border border-[#ffcc00]/20 rounded-3xl p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Bell className="text-[#ffcc00]" size={24} />
                                    <div>
                                        <h3 className="text-[14px] font-black uppercase tracking-widest">
                                            {notifications.length} новое уведомление
                                        </h3>
                                        <p className="text-[12px] text-white/60">
                                            У вас есть непрочитанные уведомления
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => notifications.forEach(n => handleMarkNotificationAsRead(n.id))}
                                    className="text-[10px] font-black uppercase tracking-widest text-[#ffcc00] hover:text-white transition-colors"
                                >
                                    Прочитать все
                                </button>
                            </div>

                            <div className="mt-4 space-y-2">
                                {notifications.slice(0, 3).map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="flex items-center justify-between p-3 bg-black/30 rounded-xl"
                                    >
                                        <p className="text-[12px]">{notification.message}</p>
                                        <button
                                            onClick={() => handleMarkNotificationAsRead(notification.id)}
                                            className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Основной контент */}
                {/* ... (предыдущий код с вкладками и контентом) ... */}

                {/* Здесь будет продолжение остальных вкладок */}
            </div>
        </main>
    )
}

// Экспортируем основной компонент
export default function ProfilePage() {
    return <ProfilePageContinued />
}
// Продолжение файла page.tsx

const Advanced3DEffects = () => {
  return (
    <>
      {/* Фоновые голографические сферы */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/5"
            style={{
              width: 100 + i * 150,
              height: 100 + i * 150,
              left: `${(i * 30) % 100}%`,
              top: `${(i * 40) % 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              rotateX: [0, 180, 360],
              rotateY: [0, 180, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Парящие новогодние украшения */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${(Math.sin(i) * 50 + 50)}%`,
              top: `${(Math.cos(i) * 30 + 50)}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className={`w-6 h-6 rounded-full ${
              i % 3 === 0 ? 'bg-[#d67a9d]' : 
              i % 3 === 1 ? 'bg-[#71b3c9]' : 'bg-[#ffcc00]'
            } opacity-20`} />
          </motion.div>
        ))}
      </div>

      {/* Эффект мерцающих звезд */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </>
  )
}

const InteractiveParticles = () => {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
  }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: `rgba(${
        Math.floor(Math.random() * 156) + 100
      }, ${
        Math.floor(Math.random() * 179) + 76
      }, ${
        Math.floor(Math.random() * 201) + 55
      }, 0.3)`
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            background: particle.color,
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            x: [particle.x, particle.x + particle.vx * 100],
            y: [particle.y, particle.y + particle.vy * 100],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Новые компоненты вкладок
const AnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState('month')
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      
      // Загрузка данных аналитики
      const { data: ordersData } = await supabase
        .from('orders')
        .select('created_at, total_amount, status')
        .order('created_at', { ascending: true })

      if (ordersData) {
        // Группировка данных по времени
        const groupedData = groupDataByTime(ordersData, timeRange)
        setChartData(groupedData)
      }
      
      setLoading(false)
    }

    loadAnalytics()
  }, [timeRange])

  const groupDataByTime = (data: any[], range: string) => {
    // Простая группировка для демонстрации
    return Array.from({ length: 12 }, (_, i) => ({
      name: `Неделя ${i + 1}`,
      orders: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 100000) + 20000,
      avgOrder: Math.floor(Math.random() * 5000) + 1000,
    }))
  }

  return (
    <div className="space-y-8">
      <GlassmorphismCard className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00cc88] to-[#008855] rounded-2xl flex items-center justify-center">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                АНАЛИТИКА
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Подробная статистика вашей активности
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {['week', 'month', 'quarter', 'year'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-[#00cc88] to-[#008855] text-white'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {range === 'week' ? 'Неделя' : 
                 range === 'month' ? 'Месяц' : 
                 range === 'quarter' ? 'Квартал' : 'Год'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00cc88]" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-white/40">
                    Общая выручка
                  </h3>
                  <TrendingUp size={16} className="text-green-500" />
                </div>
                <p className="text-3xl font-black">
                  {chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()} ₽
                </p>
                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-2">
                  +12.5% за период
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-white/40">
                    Средний чек
                  </h3>
                  <Target size={16} className="text-[#71b3c9]" />
                </div>
                <p className="text-3xl font-black">
                  {Math.round(chartData.reduce((sum, item) => sum + item.avgOrder, 0) / chartData.length).toLocaleString()} ₽
                </p>
                <p className="text-[10px] text-[#71b3c9] font-black uppercase tracking-widest mt-2">
                  +8.2% за период
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-white/40">
                    Конверсия
                  </h3>
                  <TrendingUp size={16} className="text-[#d67a9d]" />
                </div>
                <p className="text-3xl font-black">4.8%</p>
                <p className="text-[10px] text-[#d67a9d] font-black uppercase tracking-widest mt-2">
                  +2.1% за период
                </p>
              </div>
            </div>

            {/* График активности */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8">
              <h3 className="text-[14px] font-black uppercase tracking-widest text-white/40 mb-6">
                Активность по неделям
              </h3>
              <div className="h-64 flex items-end gap-2">
                {chartData.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.orders / 30) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="w-full bg-gradient-to-t from-[#00cc88] to-[#008855] rounded-t-lg max-h-full"
                    />
                    <span className="text-[8px] text-white/40 mt-2">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Тепловая карта активности */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
              <h3 className="text-[14px] font-black uppercase tracking-widest text-white/40 mb-6">
                Тепловая карта активности
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => {
                  const intensity = Math.floor(Math.random() * 4)
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg ${
                        intensity === 0 ? 'bg-white/[0.02]' :
                        intensity === 1 ? 'bg-[#00cc88]/20' :
                        intensity === 2 ? 'bg-[#00cc88]/40' :
                        'bg-[#00cc88]/60'
                      }`}
                      title={`${intensity * 5} активностей`}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-white/40">
                <span>Меньше</span>
                <span>Больше</span>
              </div>
            </div>
          </>
        )}
      </GlassmorphismCard>
    </div>
  )
}

const SupportTab = () => {
  const [activeTickets, setActiveTickets] = useState<any[]>([])
  const [ticketHistory, setTicketHistory] = useState<any[]>([])
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: '',
  })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    // Загрузка тикетов из базы данных
    const { data: tickets } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (tickets) {
      setActiveTickets(tickets.filter(t => t.status === 'open'))
      setTicketHistory(tickets.filter(t => t.status !== 'open'))
    }
  }

  const handleSubmitTicket = async () => {
    if (!newTicket.subject || !newTicket.message) {
      alert('Заполните все поля')
      return
    }

    setSending(true)
    
    const { error } = await supabase
      .from('support_tickets')
      .insert({
        subject: newTicket.subject,
        category: newTicket.category,
        priority: newTicket.priority,
        message: newTicket.message,
        status: 'open',
        created_at: new Date().toISOString(),
      })

    if (!error) {
      alert('Тикет создан успешно!')
      setNewTicket({ subject: '', category: 'general', priority: 'medium', message: '' })
      loadTickets()
    } else {
      alert('Ошибка при создании тикета')
    }
    
    setSending(false)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Создание нового тикета */}
        <GlassmorphismCard className="p-8 lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff9900] to-[#ff6600] rounded-2xl flex items-center justify-center">
              <Headphones size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                ОБРАЩЕНИЕ В ПОДДЕРЖКУ
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Мы ответим в течение 24 часов
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                Тема обращения
              </label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                placeholder="Опишите проблему кратко"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Категория
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                >
                  <option value="general">Общий вопрос</option>
                  <option value="order">Проблема с заказом</option>
                  <option value="payment">Оплата</option>
                  <option value="technical">Техническая проблема</option>
                  <option value="refund">Возврат</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Приоритет
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                  <option value="critical">Критический</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                Подробное описание
              </label>
              <textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white resize-none"
                placeholder="Опишите проблему подробно..."
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmitTicket}
                disabled={sending}
                className="px-8 py-3 bg-gradient-to-r from-[#ff9900] to-[#ff6600] text-white rounded-xl font-black uppercase text-[12px] tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {sending ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ ОБРАЩЕНИЕ'}
              </button>
              
              <button className="px-8 py-3 bg-white/10 border border-white/10 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors">
                ПРИКРЕПИТЬ ФАЙЛЫ
              </button>
            </div>
          </div>
        </GlassmorphismCard>

        {/* Контакты поддержки */}
        <GlassmorphismCard className="p-8">
          <h3 className="text-[14px] font-black uppercase tracking-widest text-white/40 mb-6">
            КОНТАКТЫ ПОДДЕРЖКИ
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
              <div className="w-12 h-12 bg-[#ff9900]/20 rounded-xl flex items-center justify-center">
                <Phone size={20} className="text-[#ff9900]" />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-widest">
                  Телефон
                </p>
                <p className="text-lg font-black">8-800-555-35-35</p>
                <p className="text-[10px] text-white/40">Круглосуточно</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
              <div className="w-12 h-12 bg-[#71b3c9]/20 rounded-xl flex items-center justify-center">
                <Mail size={20} className="text-[#71b3c9]" />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-widest">
                  Email
                </p>
                <p className="text-lg font-black">support@giga-shop.ru</p>
                <p className="text-[10px] text-white/40">Ответ в течение 24ч</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
              <div className="w-12 h-12 bg-[#d67a9d]/20 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-[#d67a9d]" />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-widest">
                  Время ответа
                </p>
                <p className="text-lg font-black">4.2 часа</p>
                <p className="text-[10px] text-white/40">Среднее время</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl">
              <p className="text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                ЧАТ ПОДДЕРЖКИ
              </p>
              <button className="w-full py-3 bg-gradient-to-r from-[#00cc88] to-[#008855] text-white rounded-xl text-[12px] font-black uppercase tracking-widest">
                ОТКРЫТЬ ЧАТ
              </button>
            </div>
          </div>
        </GlassmorphismCard>
      </div>

      {/* Активные тикеты */}
      {activeTickets.length > 0 && (
        <GlassmorphismCard className="p-8">
          <h3 className="text-[14px] font-black uppercase tracking-widest text-white/40 mb-6">
            АКТИВНЫЕ ОБРАЩЕНИЯ
          </h3>
          
          <div className="space-y-4">
            {activeTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    ticket.priority === 'critical' ? 'bg-red-500' :
                    ticket.priority === 'high' ? 'bg-orange-500' :
                    ticket.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <h4 className="text-[14px] font-black uppercase mb-1">
                      {ticket.subject}
                    </h4>
                    <p className="text-[12px] text-white/60">
                      #{ticket.id.slice(0, 8)} • {ticket.category}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-[12px] font-black text-[#ff9900]">
                    В работе
                  </p>
                  <p className="text-[10px] text-white/40">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassmorphismCard>
      )}

      {/* История обращений */}
      {ticketHistory.length > 0 && (
        <GlassmorphismCard className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-black uppercase tracking-widest text-white/40">
              ИСТОРИЯ ОБРАЩЕНИЙ
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
              ПОКАЗАТЬ ВСЕ
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                    ID
                  </th>
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                    Тема
                  </th>
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                    Статус
                  </th>
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody>
                {ticketHistory.slice(0, 5).map((ticket, i) => (
                  <tr key={ticket.id} className="border-b border-white/5 last:border-0">
                    <td className="p-4 text-[12px] font-mono">#{ticket.id.slice(0, 8)}</td>
                    <td className="p-4">
                      <p className="text-[12px] font-medium max-w-xs truncate">
                        {ticket.subject}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        ticket.status === 'resolved' 
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {ticket.status === 'resolved' ? 'Решено' : 'Закрыто'}
                      </span>
                    </td>
                    <td className="p-4 text-[12px] text-white/60">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassmorphismCard>
      )}
    </div>
  )
}

const RefundsTab = () => {
  const [refundRequests, setRefundRequests] = useState<any[]>([])
  const [showNewRefund, setShowNewRefund] = useState(false)
  const [newRefund, setNewRefund] = useState({
    orderId: '',
    reason: '',
    type: 'refund',
    amount: 0,
    description: '',
  })

  useEffect(() => {
    loadRefunds()
  }, [])

  const loadRefunds = async () => {
    // Загрузка запросов на возврат
    const { data: refunds } = await supabase
      .from('refunds')
      .select('*, orders(id, total_amount)')
      .order('created_at', { ascending: false })

    if (refunds) {
      setRefundRequests(refunds)
    }
  }

  const handleSubmitRefund = async () => {
    if (!newRefund.orderId || !newRefund.reason) {
      alert('Заполните обязательные поля')
      return
    }

    const { error } = await supabase
      .from('refunds')
      .insert({
        order_id: newRefund.orderId,
        reason: newRefund.reason,
        type: newRefund.type,
        amount: newRefund.amount,
        description: newRefund.description,
        status: 'pending',
        created_at: new Date().toISOString(),
      })

    if (!error) {
      alert('Запрос на возврат создан')
      setShowNewRefund(false)
      setNewRefund({
        orderId: '',
        reason: '',
        type: 'refund',
        amount: 0,
        description: '',
      })
      loadRefunds()
    }
  }

  return (
    <div className="space-y-8">
      <GlassmorphismCard className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff3366] to-[#cc0044] rounded-2xl flex items-center justify-center">
              <RefreshCw size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                ВОЗВРАТЫ И ОБМЕН
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Управление возвратами и обменами
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowNewRefund(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#ff3366] to-[#cc0044] text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            НОВЫЙ ВОЗВРАТ
          </button>
        </div>

        {/* Форма нового возврата */}
        {showNewRefund && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-[14px] font-black uppercase tracking-widest mb-6">
                НОВЫЙ ЗАПРОС НА ВОЗВРАТ
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Номер заказа
                  </label>
                  <input
                    type="text"
                    value={newRefund.orderId}
                    onChange={(e) => setNewRefund({...newRefund, orderId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    placeholder="Введите номер заказа"
                  />
                </div>
                
                <div>
                  <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Тип запроса
                  </label>
                  <select
                    value={newRefund.type}
                    onChange={(e) => setNewRefund({...newRefund, type: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  >
                    <option value="refund">Возврат денег</option>
                    <option value="exchange">Обмен товара</option>
                    <option value="repair">Ремонт</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Причина
                  </label>
                  <select
                    value={newRefund.reason}
                    onChange={(e) => setNewRefund({...newRefund, reason: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  >
                    <option value="">Выберите причину</option>
                    <option value="defective">Бракованный товар</option>
                    <option value="wrong">Не тот товар</option>
                    <option value="not_like">Не понравился</option>
                    <option value="damaged">Поврежден при доставке</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Сумма возврата (₽)
                  </label>
                  <input
                    type="number"
                    value={newRefund.amount}
                    onChange={(e) => setNewRefund({...newRefund, amount: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Дополнительное описание
                </label>
                <textarea
                  value={newRefund.description}
                  onChange={(e) => setNewRefund({...newRefund, description: e.target.value})}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white resize-none"
                  placeholder="Опишите проблему подробнее..."
                />
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSubmitRefund}
                  className="px-8 py-3 bg-gradient-to-r from-[#ff3366] to-[#cc0044] text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  ОТПРАВИТЬ ЗАПРОС
                </button>
                
                <button
                  onClick={() => setShowNewRefund(false)}
                  className="px-8 py-3 bg-white/10 border border-white/10 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors"
                >
                  ОТМЕНА
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Список возвратов */}
        <div className="space-y-4">
          {refundRequests.length > 0 ? (
            refundRequests.map((refund, index) => (
              <motion.div
                key={refund.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#ff3366]">
                        #{refund.id.slice(0, 8)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        refund.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                        refund.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {refund.status === 'pending' ? 'На рассмотрении' :
                         refund.status === 'approved' ? 'Одобрен' : 'Отклонен'}
                      </span>
                    </div>
                    
                    <h3 className="text-[16px] font-black uppercase mb-1">
                      {refund.type === 'refund' ? 'Возврат денег' :
                       refund.type === 'exchange' ? 'Обмен товара' : 'Ремонт'}
                    </h3>
                    
                    <p className="text-[12px] text-white/60">
                      Заказ #{refund.order_id?.slice(0, 8) || 'N/A'} • {refund.reason}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-black">
                      {refund.amount ? `${refund.amount.toLocaleString()} ₽` : '—'}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {new Date(refund.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {refund.description && (
                  <div className="mt-4 p-4 bg-black/20 rounded-xl">
                    <p className="text-[12px] text-white/80">{refund.description}</p>
                  </div>
                )}
                
                {refund.status === 'pending' && (
                  <div className="flex items-center gap-3 mt-4">
                    <button className="text-[10px] font-black uppercase tracking-widest text-green-500 hover:text-green-400 transition-colors">
                      ИЗМЕНИТЬ
                    </button>
                    <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
                      ОТМЕНИТЬ
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={32} className="text-white/20" />
              </div>
              <h3 className="text-lg font-black uppercase mb-2">Нет запросов на возврат</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Здесь будут отображаться все ваши запросы на возврат, обмен или ремонт товаров
              </p>
            </div>
          )}
        </div>
      </GlassmorphismCard>

      {/* Информация о политике возвратов */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassmorphismCard className="p-6">
          <div className="w-12 h-12 bg-[#00cc88]/20 rounded-xl flex items-center justify-center mb-4">
            <Clock size={24} className="text-[#00cc88]" />
          </div>
          <h4 className="text-[14px] font-black uppercase mb-2">14 ДНЕЙ</h4>
          <p className="text-[12px] text-white/60">
            На возврат товара надлежащего качества с момента покупки
          </p>
        </GlassmorphismCard>

        <GlassmorphismCard className="p-6">
          <div className="w-12 h-12 bg-[#71b3c9]/20 rounded-xl flex items-center justify-center mb-4">
            <CreditCard size={24} className="text-[#71b3c9]" />
          </div>
          <h4 className="text-[14px] font-black uppercase mb-2">БЕЗОПАСНО</h4>
          <p className="text-[12px] text-white/60">
            Возврат денег на карту в течение 3-10 рабочих дней
          </p>
        </GlassmorphismCard>

        <GlassmorphismCard className="p-6">
          <div className="w-12 h-12 bg-[#ff9900]/20 rounded-xl flex items-center justify-center mb-4">
            <Truck size={24} className="text-[#ff9900]" />
          </div>
          <h4 className="text-[14px] font-black uppercase mb-2">БЕСПЛАТНО</h4>
          <p className="text-[12px] text-white/60">
            Бесплатный вывоз товара при возврате от 5000 ₽
          </p>
        </GlassmorphismCard>
      </div>
    </div>
  )
}

const AddressBookTab = () => {
  const [addresses, setAddresses] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    title: '',
    full_name: '',
    phone: '',
    city: '',
    street: '',
    building: '',
    apartment: '',
    postal_code: '',
    is_default: false,
  })

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .order('is_default', { ascending: false })

    if (data) setAddresses(data)
  }

  const handleAddAddress = async () => {
    const { error } = await supabase
      .from('addresses')
      .insert([{ ...newAddress, created_at: new Date().toISOString() }])

    if (!error) {
      setShowAddForm(false)
      setNewAddress({
        title: '',
        full_name: '',
        phone: '',
        city: '',
        street: '',
        building: '',
        apartment: '',
        postal_code: '',
        is_default: false,
      })
      loadAddresses()
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (confirm('Удалить этот адрес?')) {
      await supabase.from('addresses').delete().eq('id', id)
      loadAddresses()
    }
  }

  return (
    <div className="space-y-8">
      <GlassmorphismCard className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#9966ff] to-[#6600ff] rounded-2xl flex items-center justify-center">
              <MapPin size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white italic">
                АДРЕСНАЯ КНИГА
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                {addresses.length} сохраненных адресов
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#9966ff] to-[#6600ff] text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            + ДОБАВИТЬ АДРЕС
          </button>
        </div>

        {/* Форма добавления адреса */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-[14px] font-black uppercase tracking-widest mb-6">
                НОВЫЙ АДРЕС
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Название адреса *
                  </label>
                  <input
                    type="text"
                    value={newAddress.title}
                    onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    placeholder="Например: Дом, Работа"
                  />
                </div>
                
                <div>
                  <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                    ФИО получателя *
                  </label>
                  <input
                    type="text"
                    value={newAddress.full_name}
                    onChange={(e) => setNewAddress({...newAddress, full_name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    placeholder="Иванов Иван Иванович"
                  />
                </div>
                
                <div>
                  <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
                
                <div>
                  <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Город *
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    placeholder="Москва"
                  />
                </div>
                
                <div>
                  <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Улица *
                  </label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    placeholder="Ленина"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                      Дом *
                    </label>
                    <input
                      type="text"
                      value={newAddress.building}
                      onChange={(e) => setNewAddress({...newAddress, building: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                      placeholder="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                      Квартира
                    </label>
                    <input
                      type="text"
                      value={newAddress.apartment}
                      onChange={(e) => setNewAddress({...newAddress, apartment: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                      placeholder="25"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[12px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Индекс
                  </label>
                  <input
                    type="text"
                    value={newAddress.postal_code}
                    onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    placeholder="123456"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAddress.is_default}
                    onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                    className="w-5 h-5 rounded border-white/10 bg-white/5"
                  />
                  <span className="text-[12px] font-black uppercase tracking-widest">
                    Сделать основным адресом
                  </span>
                </label>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAddAddress}
                    className="px-8 py-3 bg-gradient-to-r from-[#9966ff] to-[#6600ff] text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    СОХРАНИТЬ АДРЕС
                  </button>
                  
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-8 py-3 bg-white/10 border border-white/10 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors"
                  >
                    ОТМЕНА
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Список адресов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-2xl border ${
                address.is_default
                  ? 'border-[#9966ff] bg-gradient-to-b from-[#9966ff]/10 to-transparent'
                  : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[16px] font-black uppercase mb-1">
                    {address.title}
                    {address.is_default && (
                      <span className="ml-3 px-2 py-1 bg-[#9966ff]/20 text-[#9966ff] text-[10px] font-black uppercase tracking-widest rounded">
                        ОСНОВНОЙ
                      </span>
                    )}
                  </h3>
                  <p className="text-[12px] text-white/60">{address.full_name}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-[14px]">
                  {address.city}, ул. {address.street}, д. {address.building}
                  {address.apartment && `, кв. ${address.apartment}`}
                </p>
                <p className="text-[12px] text-white/60">{address.phone}</p>
                {address.postal_code && (
                  <p className="text-[12px] text-white/40">Индекс: {address.postal_code}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {addresses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-white/20" />
            </div>
            <h3 className="text-lg font-black uppercase mb-2">Адресная книга пуста</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Добавьте адреса доставки для быстрого оформления заказов
            </p>
          </div>
        )}
      </GlassmorphismCard>
    </div>
  )
}

// Основной компонент с полным набором вкладок
const EnhancedProfilePage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('main')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState(1)

  // Полный список вкладок
  const tabs = [
    { id: 'main', label: 'ГЛАВНАЯ', icon: <Home size={16} /> },
    { id: 'orders', label: 'МОИ ЗАКАЗЫ', icon: <Package size={16} /> },
    { id: 'viewed', label: 'ВЫ СМОТРЕЛИ', icon: <Eye size={16} /> },
    { id: 'wishlist', label: 'ИЗБРАННОЕ', icon: <Heart size={16} /> },
    { id: 'analytics', label: 'АНАЛИТИКА', icon: <BarChart3 size={16} /> },
    { id: 'bonuses', label: 'БОНУСЫ', icon: <Coins size={16} /> },
    { id: 'referrals', label: 'РЕФЕРАЛЫ', icon: <Users size={16} /> },
    { id: 'achievements', label: 'ДОСТИЖЕНИЯ', icon: <Trophy size={16} /> },
    { id: 'support', label: 'ПОДДЕРЖКА', icon: <Headphones size={16} /> },
    { id: 'refunds', label: 'ВОЗВРАТЫ', icon: <RefreshCw size={16} /> },
    { id: 'addresses', label: 'АДРЕСА', icon: <MapPin size={16} /> },
    { id: 'subscription', label: 'ПОДПИСКА', icon: <Crown size={16} /> },
    { id: 'settings', label: 'НАСТРОЙКИ', icon: <Settings size={16} /> },
  ]

  useEffect(() => {
    const checkLevelUp = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('available_points')
        .single()

      if (profile) {
        const points = profile.available_points || 0
        const currentLevel = Math.floor(points / 1000) + 1
        
        // Проверка на повышение уровня
        const previousLevel = localStorage.getItem('userLevel')
        if (previousLevel && currentLevel > parseInt(previousLevel)) {
          setNewLevel(currentLevel)
          setShowLevelUp(true)
          setTimeout(() => setShowLevelUp(false), 5000)
        }
        
        localStorage.setItem('userLevel', currentLevel.toString())
      }
    }

    checkLevelUp()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border-4 border-[#d67a9d] border-t-transparent rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 border-4 border-[#71b3c9] border-b-transparent rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white font-black italic tracking-[0.5em] text-sm">
              ЗАГРУЗКА...
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'main': return <MainTabContent />
      case 'orders': return <OrdersTabContent />
      case 'viewed': return <ViewedTabContent />
      case 'wishlist': return <WishlistTab />
      case 'analytics': return <AnalyticsTab />
      case 'bonuses': return <BonusesTab />
      case 'referrals': return <ReferralsTab />
      case 'achievements': return <AchievementsTab />
      case 'support': return <SupportTab />
      case 'refunds': return <RefundsTab />
      case 'addresses': return <AddressBookTab />
      case 'subscription': return <SubscriptionTab />
      case 'settings': return <SettingsTab />
      default: return <MainTabContent />
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4 sm:px-6 font-sans overflow-hidden relative">
      {/* Все анимационные эффекты */}
      <Advanced3DEffects />
      <InteractiveParticles />
      <FloatingSnowflakes />
      <FloatingGifts />
      <NeonGrid />
      <NewYearCountdown />
      
      {/* Анимация повышения уровня */}
      {showLevelUp && <LevelUpAnimation level={newLevel} />}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Плавающая навигация */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-24 z-50 mb-12"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#d67a9d] rounded-2xl blur opacity-20" />
            <div className="relative bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-2">
              <div className="flex overflow-x-auto pb-2 custom-scrollbar">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-black shadow-lg shadow-[#d67a9d]/30'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Контент вкладки */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        {/* Футер профиля */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 pt-8 border-t border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-white/40 mb-4">
                СТАТУС СИСТЕМЫ
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[12px]">Сервис онлайн</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-[12px]">База данных активна</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-[12px]">Платежи работают</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-white/40 mb-4">
                БЫСТРЫЕ ДЕЙСТВИЯ
              </h4>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                  ПРАВИЛА
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                  ПОМОЩЬ
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                  ОТЗЫВ
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-white/40 mb-4">
                ВЕРСИЯ
              </h4>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-white/5 rounded-lg">
                  <span className="text-[12px] font-black">v2.4.1</span>
                </div>
                <span className="text-[10px] text-white/40">© 2024 Giga Shop</span>
              </div>
            </div>
          </div>

          {/* Кнопка выхода */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group-hover:border-red-500/30">
                <LogOut size={16} className="text-white/40 group-hover:text-red-500 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/60 group-hover:text-red-500 transition-colors">
                  ВЫХОД
                </span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Новогодние украшения */}
      <motion.div
        className="fixed bottom-8 left-8 z-40"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Gift size={48} className="text-[#d67a9d]/30" />
      </motion.div>

      <motion.div
        className="fixed top-8 right-8 z-40"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Snowflake size={32} className="text-[#71b3c9]/30" />
      </motion.div>
    </main>
  )
}

// Экспорт основного компонента
export default function ProfilePage() {
  return <EnhancedProfilePage />
}