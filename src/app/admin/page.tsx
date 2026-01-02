'use client'
import { useEffect, useState, useCallback, useMemo, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
    Package, MapPin, ChevronDown, ChevronUp, User, ShoppingBag,
    Phone, X, ImageIcon, Plus, Ticket, Trash2, Zap, Target,
    EyeOff, LayoutGrid, RefreshCw, Search, Save, ShieldCheck,
    Globe, Barcode, ArrowRight, CreditCard, Truck, Clock,
    Sparkles, Cpu, Database
} from 'lucide-react'
import React from 'react'

// --- ТИПЫ ДЛЯ TypeScript ---
type DeliveryInfo = {
    fullName: string
    phone: string
    address: string
    method: 'pickup' | 'delivery'
}

type OrderItem = {
    id: string
    name: string
    price: number
    quantity: number
    size?: string
    selectedSize?: string
    sizes?: Array<{ name: string, selected?: boolean }>
    image?: string
    images?: string[]
}

type Order = {
    id: string
    created_at: string
    status: string
    total_amount: number
    delivery_info: DeliveryInfo
    payment_code: string
    items: OrderItem[]
    applied_promo?: string
    discount_amount?: number
}

type Product = {
    id: string
    name: string
    price: number
    category: string
    image: string
    images: string[]
    description: string
    sizes: Array<{ size: string, inStock: boolean }>
    material: string
    origin: string
    article: string
}

type Promocode = {
    id: string
    code: string
    discount: number
    usage_limit: number
    used_count: number
    is_hidden: boolean
}

type Task = {
    id: string
    title: string
    description: string
    secret_word: string
    reward_code: string
}

type News = {
    id: string
    title: string
    content: string
    image_url: string
    created_at: string
}

type UserProfile = {
    id: string
    email: string
    progress: number
}

export default function AdminPage() {
    const [isClient, setIsClient] = useState(false)
    const [pendingStatus, setPendingStatus] = useState<string | null>(null)
    const [statusModal, setStatusModal] = useState<{
        show: boolean
        orderId: string
        currentStatus: string
    }>({ show: false, orderId: '', currentStatus: '' })

    const router = useRouter()

    const [activeTab, setActiveTab] = useState<'inventory' | 'logistics' | 'promocodes' | 'operations' | 'users' | 'news'>('inventory')

    // Данные с типами
    const [products, setProducts] = useState<Product[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [promocodes, setPromocodes] = useState<Promocode[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [news, setNews] = useState<News[]>([])
    const [users, setUsers] = useState<UserProfile[]>([])

    // UI состояния
    const [userSearch, setUserSearch] = useState('')
    const [updatingUser, setUpdatingUser] = useState<string | null>(null)
    const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})
    const [uploading, setUploading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)

    const ADMIN_EMAIL = 'plutoset8@gmail.com'

    // --- КОНСТАНТЫ ---
    const CLOTHES_SIZES = [
        { size: 'S', inStock: true },
        { size: 'M', inStock: true },
        { size: 'L', inStock: true },
        { size: 'XL', inStock: true }
    ]

    const FOOTWEAR_SIZES = Array.from({ length: 13 }, (_, i) => ({
        size: (35 + i).toString(),
        inStock: true
    }))

    const STATUSES = [
        'Оформлен',
        'На сборке в другом городе',
        'Приехал на склад',
        'Отгружен на складе',
        'Отправлен в город получателя',
        'В пункте выдачи',
        'Получен',
        'ОТКЛОНЕН: НЕ ОПЛАЧЕН (48Ч)'
    ]

    // Формы
    const [form, setForm] = useState({
        name: '',
        price: '',
        category: 'apparel',
        image: '',
        images: [] as string[],
        description: '',
        sizes: CLOTHES_SIZES,
        material: '',
        origin: '',
        article: ''
    })

    const [promoForm, setPromoForm] = useState({
        code: '',
        discount: '',
        usage_limit: '100',
        is_hidden: false
    })

    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        secret_word: '',
        reward_code: ''
    })

    const [newsForm, setNewsForm] = useState({
        title: '',
        content: '',
        image_url: ''
    })

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null // Это спасет от Application Error при первой загрузке

    // --- TELEGRAM УВЕДОМЛЕНИЯ ---
    const sendTelegramNotify = useCallback(async (text: string) => {
        const BOT_TOKEN = '8394553082:AAHDgNAHq19eNtRY3JlWSqOlEFPt0halL44'
        const CHAT_ID = '5031500409'
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text,
                    parse_mode: 'HTML'
                })
            })
        } catch (e) {
            console.error('TG Notify Error:', e)
        }
    }, [])

    // --- ВОССТАНОВЛЕННЫЕ ФУНКЦИИ ИНВЕНТАРЯ ---

    // 1. ФУНКЦИЯ ЗАГРУЗКИ КАРТИНОК
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) return

            const files = Array.from(e.target.files)
            const uploadedUrls: string[] = []

            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `products/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath)

                uploadedUrls.push(data.publicUrl)
            }

            setForm(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls],
                image: prev.image || uploadedUrls[0]
            }))
            toast.success('МЕДИА_ЗАГРУЖЕНО')
        } catch (err) {
            console.error('Upload error:', err)
            toast.error('ОШИБКА_ЗАГРУЗКИ')
        } finally {
            setUploading(false)
        }
    }

    // 2. ФУНКЦИЯ СОЗДАНИЯ/ОБНОВЛЕНИЯ ТОВАРА
    const handleSubmitProduct = async (e: React.FormEvent) => {
        e.preventDefault()

        // Валидация
        if (!form.name.trim() || !form.price || Number(form.price) <= 0) {
            toast.error('ЗАПОЛНИТЕ_ОБЯЗАТЕЛЬНЫЕ_ПОЛЯ')
            return
        }

        // ЛОГИКА АРТИКУЛА
        const finalArticle = form.article.trim()
            ? form.article.toUpperCase()
            : `VSG-${Math.floor(100000 + Math.random() * 900000)}`

        const payload = {
            name: form.name,
            price: Number(form.price),
            category: form.category,
            description: form.description,
            image: form.images[0] || form.image,
            images: form.images,
            sizes: form.sizes,
            material: form.material || 'CYBER_FIBER_SYNTH',
            origin: form.origin || 'KOREA_REPUBLIC',
            article: finalArticle
        }

        let error = null
        let message = ''

        if (editingId) {
            // Обновление существующего товара
            const { error: updateError } = await supabase
                .from('products')
                .update(payload)
                .eq('id', editingId)
            error = updateError
            message = 'ТОВАР_ОБНОВЛЕН'
        } else {
            // Создание нового товара
            const { error: insertError } = await supabase
                .from('products')
                .insert([payload])
            error = insertError
            message = 'ТОВАР_СОЗДАН'
        }

        if (!error) {
            toast.success(message)

            // Telegram уведомление
            await sendTelegramNotify(
                `✨ <b>vsgiga shop: Инвентарь</b>\n` +
                `Действие: <b>${editingId ? 'Обновление' : 'Создание'} товара</b>\n` +
                `Название: <code>${form.name}</code>\n` +
                `Артикул: <code>${finalArticle}</code>\n` +
                `Цена: <b>${form.price} ₽</b>`
            )

            // Сброс формы и обновление данных
            cancelEdit()
            await fetchProducts()
        } else {
            console.error('Database error:', error)
            toast.error('ОШИБКА_СОХРАНЕНИЯ')
        }
    }

    // 3. ФУНКЦИЯ УДАЛЕНИЯ ТОВАРА
    const deleteProduct = async (id: string) => {
        if (!confirm('УДАЛИТЬ_ТОВАР?')) return

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (!error) {
            toast.success('ТОВАР_УДАЛЕН')
            await fetchProducts()
        } else {
            toast.error('ОШИБКА_УДАЛЕНИЯ')
        }
    }

    // 4. ФУНКЦИЯ НАЧАЛА РЕДАКТИРОВАНИЯ
    const startEdit = (product: Product) => {
        setEditingId(product.id)
        setForm({
            name: product.name,
            price: product.price.toString(),
            category: product.category,
            description: product.description || '',
            image: product.image,
            images: product.images || [product.image],
            sizes: product.sizes || (product.category === 'apparel' ? CLOTHES_SIZES :
                product.category === 'footwear' ? FOOTWEAR_SIZES : []),
            material: product.material || '',
            origin: product.origin || '',
            article: product.article || ''
        })
        // Прокрутка к форме
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 5. ФУНКЦИЯ ОТМЕНЫ РЕДАКТИРОВАНИЯ
    const cancelEdit = () => {
        setEditingId(null)
        setForm({
            name: '',
            price: '',
            category: 'apparel',
            image: '',
            images: [],
            description: '',
            sizes: CLOTHES_SIZES,
            material: '',
            origin: '',
            article: ''
        })
    }

    // 6. УДАЛЕНИЕ КАРТИНКИ ИЗ ФОРМЫ
    const removeImage = (index: number) => {
        const newImages = form.images.filter((_, i) => i !== index)
        setForm({
            ...form,
            images: newImages,
            image: newImages.length > 0 ? newImages[0] : ''
        })
    }

    // 7. ПЕРЕКЛЮЧЕНИЕ НАЛИЧИЯ РАЗМЕРА
    const toggleSizeStock = (index: number) => {
        const updatedSizes = [...form.sizes]
        updatedSizes[index].inStock = !updatedSizes[index].inStock
        setForm({ ...form, sizes: updatedSizes })
    }

    // 8. ИЗМЕНЕНИЕ КАТЕГОРИИ
    const handleCategoryChange = (cat: string) => {
        let newSizes: { size: string; inStock: boolean }[] = []

        if (cat === 'apparel') {
            newSizes = CLOTHES_SIZES
        } else if (cat === 'footwear') {
            newSizes = FOOTWEAR_SIZES
        } else {
            newSizes = []
        }

        setForm({
            ...form,
            category: cat,
            sizes: newSizes
        })
    }

    // --- FETCH ФУНКЦИИ С ТИПАМИ ---
    const fetchOrders = useCallback(async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Ошибка загрузки заказов:', error)
            toast.error('ОШИБКА_ЗАГРУЗКИ_ЗАКАЗОВ')
            return
        }

        if (data) {
            const transformedOrders: Order[] = data.map(order => ({
                ...order,
                delivery_info: order.delivery_info || {
                    fullName: '',
                    phone: '',
                    address: '',
                    method: 'delivery'
                },
                payment_code: order.payment_code || 'БЕЗ_КОДА',
                items: order.items || []
            }))
            setOrders(transformedOrders)
        }
    }, [])

    const fetchProducts = useCallback(async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Ошибка загрузки товаров:', error)
            toast.error('ОШИБКА_ЗАГРУЗКИ_ТОВАРОВ')
            return
        }

        if (data) setProducts(data)
    }, [])

    const fetchPromocodes = useCallback(async () => {
        const { data } = await supabase
            .from('promocodes')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setPromocodes(data)
    }, [])

    const fetchTasks = useCallback(async () => {
        const { data } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setTasks(data)
    }, [])

    const fetchNews = useCallback(async () => {
        const { data } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setNews(data)
    }, [])

    const fetchUsers = useCallback(async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('email', { ascending: true })
        if (!error && data) setUsers(data)
    }, [])

    // Обновление статуса заказа
    const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)

        if (!error) {
            setOrders(prevOrders => prevOrders.map(o =>
                o.id === orderId ? { ...o, status } : o
            ))
            toast.success('СТАТУС_ОБНОВЛЕН')


            await sendTelegramNotify(
                `📦 <b>vsgiga LOGISTICS</b>\n` +
                `Заказ: <code>${orderId.slice(0, 8)}...</code>\n` +
                `Статус: <b>${status}</b>`
            )
        } else {
            console.error('ОШИБКА_БАЗЫ:', error.message)
            toast.error('ОШИБКА_СОХРАНЕНИЯ')
        }
    }, [sendTelegramNotify])

    // Инициализация админа
    useEffect(() => {
        const initAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email === ADMIN_EMAIL) {
                setIsAdmin(true)
                await refreshData()
            } else {
                router.push('/')
            }
            setLoading(false)
        }
        initAdmin()
    }, [router])

    const refreshData = useCallback(async () => {
        await Promise.all([
            fetchProducts(),
            fetchOrders(),
            fetchPromocodes(),
            fetchTasks(),
            fetchUsers(),
            fetchNews()
        ])
    }, [fetchProducts, fetchOrders, fetchPromocodes, fetchTasks, fetchUsers, fetchNews])

    const toggleOrder = useCallback((id: string) => {
        setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }))
    }, [])

    // --- ОРИГИНАЛЬНЫЕ ФУНКЦИИ ИЗ ИСХОДНОГО ФАЙЛА ---
    const updateUserProgress = async (userId: string, newProgress: number) => {
        setUpdatingUser(userId)
        const { error } = await supabase
            .from('profiles')
            .update({ progress: newProgress })
            .eq('id', userId)

        if (!error) {
            const user = users.find(u => u.id === userId)
            setUsers(users.map(u => u.id === userId ? { ...u, progress: newProgress } : u))
            toast.success('ПРОГРЕСС_ОБНОВЛЕН')

            await sendTelegramNotify(
                `📈 <b>vsgiga shop: Прогресс</b>\n` +
                `Пользователь: <code>${user?.email}</code>\n` +
                `Установлен прогресс: <b>${newProgress}%</b>`
            )
        } else {
            toast.error('ОШИБКА_ОБНОВЛЕНИЯ')
        }
        setUpdatingUser(null)
    }

    const handleNewsFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) return

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `news/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            setNewsForm(prev => ({ ...prev, image_url: data.publicUrl }))
            toast.success('КАРТИНКА_ЗАГРУЖЕНА')
        } catch (err) {
            toast.error('ОШИБКА_ЗАГРУЗКИ')
        } finally {
            setUploading(false)
        }
    }

    const handleCreatePromo = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.from('promocodes').insert([{
            code: promoForm.code.toUpperCase().trim(),
            discount: Number(promoForm.discount),
            usage_limit: Number(promoForm.usage_limit),
            is_hidden: promoForm.is_hidden,
            used_count: 0
        }])

        if (!error) {
            setPromoForm({ code: '', discount: '', usage_limit: '100', is_hidden: false })
            await fetchPromocodes()
            toast.success('ПРОМОКОД_СОЗДАН')
        }
    }

    const deletePromo = async (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        const { error } = await supabase.from('promocodes').delete().eq('id', id)
        if (!error) fetchPromocodes()
    }

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!taskForm.title || !taskForm.secret_word || !taskForm.reward_code) {
            return toast.error('ЗАПОЛНИТЕ_ВСЕ_ПОЛЯ')
        }

        const { error } = await supabase.from('tasks').insert([{
            title: taskForm.title,
            description: taskForm.description,
            secret_word: taskForm.secret_word.toUpperCase().trim(),
            reward_code: taskForm.reward_code,
            created_at: new Date().toISOString()
        }])

        if (!error) {
            setTaskForm({ title: '', description: '', secret_word: '', reward_code: '' })
            await fetchTasks()
            toast.success('МИССИЯ_АКТИВИРОВАНА')
            router.refresh()
        } else {
            toast.error(`ОШИБКА: ${error.message}`)
        }
    }

    const deleteTask = async (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        if (!confirm('УДАЛИТЬ_МИССИЮ?')) return
        const { error } = await supabase.from('tasks').delete().eq('id', id)
        if (!error) {
            await fetchTasks()
            router.refresh()
        }
    }

    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.from('news').insert([newsForm])
        if (!error) {
            setNewsForm({ title: '', content: '', image_url: '' })
            fetchNews()
            toast.success('НОВОСТЬ_ОПУБЛИКОВАНА')
        }
    }

    const deleteNews = async (id: string) => {
        if (!confirm('УДАЛИТЬ_НОВОСТЬ?')) return
        const { error } = await supabase.from('news').delete().eq('id', id)
        if (!error) fetchNews()
    }

    // --- КОМПОНЕНТ КАРТОЧКИ ЗАКАЗА ---
    const OrderCard = React.memo(({
        order,
        expanded,
        onToggle,
        onStatusClick
    }: {
        order: Order
        expanded: boolean
        onToggle: () => void
        onStatusClick: (orderId: string, currentStatus: string) => void
    }) => {
        const delivery = order.delivery_info || {
            fullName: 'НЕ УКАЗАНО',
            phone: '—',
            address: '—',
            method: 'delivery'
        }

        const getStatusColor = (status: string) => {
            if (status.includes('ОТКЛОНЕН')) return 'bg-red-500/20 border-red-500/30 text-red-400'
            if (status.includes('Получен')) return 'bg-green-500/20 border-green-500/30 text-green-400'
            if (status.includes('Отправлен')) return 'bg-blue-500/20 border-blue-500/30 text-blue-400'
            return 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
        }

        return (
            <motion.div
                layout
                className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-lg"
                whileHover={{ scale: 1.005, borderColor: 'rgba(214,122,157,0.3)' }}
                transition={{ duration: 0.3 }}
            >
                {/* ВЕРХНЯЯ ПАНЕЛЬ ЗАКАЗА */}
                <div className="p-8 flex flex-wrap items-center justify-between gap-6 relative">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#ff007a]/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />

                    <div className="flex items-center gap-6 relative z-10">
                        <motion.div
                            className="w-16 h-16 bg-gradient-to-br from-[#d67a9d]/20 to-[#71b3c9]/20 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm"
                            whileHover={{ rotate: 10 }}
                        >
                            <Package className="text-white" size={28} />
                        </motion.div>
                        <div>
                            <h3 className="font-black text-xl italic uppercase tracking-tighter bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                                ЗАКАЗ_{order.id.slice(0, 8)}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1 text-[10px] text-white/30">
                                    <Clock size={10} />
                                    {new Date(order.created_at).toLocaleString('ru-RU')}
                                </div>
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                                <div className="text-[10px] text-white/30 font-bold uppercase">
                                    {delivery.method === 'pickup' ? 'САМОВЫВОЗ' : 'ДОСТАВКА'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* БЛОК СТАТУСА И КОДА ОПЛАТЫ */}
                    <div className="flex items-center gap-4 relative z-10">
                        {/* КОД ОПЛАТЫ */}
                        <motion.div
                            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#00ffea]/10 to-[#00ffea]/5 border border-[#00ffea]/30"
                            whileHover={{ scale: 1.05 }}
                            animate={{ boxShadow: ['0 0 10px rgba(0,255,234,0.2)', '0 0 20px rgba(0,255,234,0.3)', '0 0 10px rgba(0,255,234,0.2)'] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <p className="text-[8px] font-black text-[#00ffea] uppercase tracking-widest mb-1">КОД ОПЛАТЫ</p>
                            <p className="text-sm font-black text-white tracking-wider font-mono">
                                {order.payment_code || 'N/A'}
                            </p>
                        </motion.div>

                        {/* КНОПКА СТАТУСА */}
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation()
                                onStatusClick(order.id, order.status)
                            }}
                            className={`px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 border backdrop-blur-sm ${getStatusColor(order.status)}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <RefreshCw size={12} className="animate-spin-slow" />
                            {order.status}
                        </motion.button>

                        {/* КНОПКА РАСКРЫТИЯ */}
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggle()
                            }}
                            className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10"
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            {expanded ? <ChevronUp /> : <ChevronDown />}
                        </motion.button>
                    </div>
                </div>

                {/* РАСКРЫВАЮЩАЯСЯ ЧАСТЬ */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden border-t border-white/5 bg-black/20"
                        >
                            <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* БЛОК 1: ДАННЫЕ КЛИЕНТА */}
                                <div className="space-y-6">
                                    <h4 className="flex items-center gap-3 text-[10px] font-black text-[#71b3c9] uppercase tracking-[0.3em] italic">
                                        <User size={14} /> Данные клиента
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-br from-white/5 to-transparent p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                            <p className="text-[9px] text-white/20 uppercase font-black mb-1">ФИО</p>
                                            <p className="font-black italic uppercase text-white">
                                                {delivery.fullName || 'НЕ УКАЗАНО'}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-white/5 to-transparent p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                            <p className="text-[9px] text-white/20 uppercase font-black mb-1">Телефон</p>
                                            <p className="font-black italic text-white flex items-center gap-2">
                                                <Phone size={12} />
                                                {delivery.phone || '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* БЛОК 2: АДРЕС И СПОСОБ ДОСТАВКИ */}
                                <div className="space-y-6">
                                    <h4 className="flex items-center gap-3 text-[10px] font-black text-[#d67a9d] uppercase tracking-[0.3em] italic">
                                        <Truck size={14} /> Доставка
                                    </h4>
                                    <div className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/10 backdrop-blur-sm min-h-[120px]">
                                        <div className="flex items-start gap-3 mb-4">
                                            <MapPin className="text-[#d67a9d]" size={16} />
                                            <div>
                                                <p className="text-[9px] text-white/20 uppercase font-black mb-2 tracking-widest">Адрес</p>
                                                <p className="font-bold text-sm leading-relaxed italic uppercase text-white">
                                                    {delivery.address || '—'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                            <span className="text-[8px] font-black uppercase text-white/30">Метод:</span>
                                            <span className={`text-[9px] font-black uppercase ${delivery.method === 'pickup' ? 'text-[#00ffea]' : 'text-[#d67a9d]'}`}>
                                                {delivery.method === 'pickup' ? 'САМОВЫВОЗ' : 'КУРЬЕР'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* БЛОК 3: СОСТАВ ЗАКАЗА */}
                                <div className="space-y-6">
                                    <h4 className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-[0.3em] italic">
                                        <ShoppingBag size={14} /> Состав заказа
                                    </h4>

                                    {/* ПРОМОКОД И СКИДКА */}
                                    {(order.applied_promo || (order.discount_amount && order.discount_amount > 0)) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-gradient-to-r from-[#71b3c9]/10 to-transparent p-4 rounded-2xl border border-[#71b3c9]/20 backdrop-blur-sm"
                                        >
                                            <p className="text-[9px] font-black text-[#71b3c9] uppercase tracking-widest mb-1">Примененный бонус</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <Ticket className="text-[#71b3c9]" size={14} />
                                                    <p className="font-black italic text-sm uppercase text-white">{order.applied_promo || 'ПРОМОКОД'}</p>
                                                </div>
                                                <p className="font-black text-[#d67a9d] text-sm">-{order.discount_amount?.toLocaleString()} ₽</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* СПИСОК ТОВАРОВ */}
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {order.items?.map((item, index) => (
                                            <motion.div
                                                key={`${item.id}-${index}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex justify-between items-center bg-gradient-to-r from-white/5 to-transparent p-4 rounded-xl border border-white/10 group hover:border-[#d67a9d]/30 transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-black overflow-hidden border border-white/10 flex-shrink-0">
                                                        <img
                                                            src={item.image || (item.images && item.images[0]) || '/placeholder.jpg'}
                                                            className="w-full h-full object-cover"
                                                            alt={item.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase leading-none text-white">{item.name}</p>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className="text-[9px] font-black bg-black/50 text-white px-2 py-0.5 rounded italic border border-white/10">
                                                                РАЗМЕР: {item.size || item.selectedSize || 'OS'}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-white/50 uppercase">
                                                                ×{item.quantity || 1}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="font-black italic text-white ml-4">
                                                    {((item.price || 0) * (item.quantity || 1)).toLocaleString()} ₽
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* ИТОГО */}
                                    <div className="pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase text-white/30">ИТОГО:</span>
                                            <span className="text-xl font-black italic text-white">{order.total_amount.toLocaleString()} ₽</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        )
    })

    OrderCard.displayName = 'OrderCard'

    // --- КОМПОНЕНТ МОДАЛЬНОГО ОКНА СТАТУСА ---
    const StatusModal = React.memo(() => {
        const handleConfirmStatus = async (status: string) => {
            if (!statusModal.orderId) return

            try {
                await updateOrderStatus(statusModal.orderId, status)
                setStatusModal({ show: false, orderId: '', currentStatus: '' })
            } catch (error) {
                console.error('Ошибка обновления статуса:', error)
            }
        }

        if (!statusModal.show) return null

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
                onClick={() => setStatusModal({ show: false, orderId: '', currentStatus: '' })}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-gradient-to-br from-black to-gray-900 border border-white/10 rounded-[2.5rem] p-8 max-w-lg w-full relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setStatusModal({ show: false, orderId: '', currentStatus: '' })}
                        className="absolute top-6 right-6 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"
                    >
                        <X size={20} />
                    </button>

                    <h3 className="text-2xl font-black italic uppercase mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Обновить статус заказа
                    </h3>

                    <p className="text-sm text-white/50 mb-8 font-bold uppercase">
                        Заказ: <span className="text-[#d67a9d]">{statusModal.orderId.slice(0, 12)}...</span>
                        <br />
                        Текущий статус: <span className="text-[#71b3c9]">{statusModal.currentStatus}</span>
                    </p>

                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {STATUSES.map((status) => (
                            <motion.button
                                key={status}
                                onClick={() => handleConfirmStatus(status)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-5 rounded-2xl text-left font-black uppercase text-sm transition-all ${status === statusModal.currentStatus
                                    ? 'bg-[#d67a9d] text-white border-[#d67a9d]'
                                    : 'bg-white/5 border border-white/10 hover:border-[#d67a9d]/50'
                                    }`}
                            >
                                {status}
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                        <button
                            onClick={() => setStatusModal({ show: false, orderId: '', currentStatus: '' })}
                            className="px-6 py-3 rounded-xl text-[10px] font-black uppercase border border-white/10 hover:bg-white/5 transition-all"
                        >
                            Отмена
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )
    })

    StatusModal.displayName = 'StatusModal'

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic">
            <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">⚡</div>
                <div className="text-xl">VSGIGA_TERMINAL_LOADING...</div>
                <div className="text-xs text-white/30 mt-2">ACCESS: ADMIN_PRIVILEGES</div>
            </div>
        </div>
    )

    // ФИЛЬТРАЦИЯ ЗАКАЗОВ ПО НОМЕРУ (ID) - ТОЛЬКО ПО ID
    const filteredOrders = useMemo(() => {
        if (!userSearch.trim()) return orders;

        const searchTerm = userSearch.toLowerCase().trim();
        return orders.filter(order =>
            order.id.toLowerCase().includes(searchTerm)
        );
    }, [orders, userSearch]);

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 font-sans relative overflow-hidden">
            {/* Фоновые эффекты */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff007a]/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ffea]/5 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* HEADER */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
                >
                    <div className="flex items-center gap-4">
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            vsgiga<span className="text-[#d67a9d]">_admin</span>
                        </h1>
                        <motion.button
                            onClick={refreshData}
                            className="p-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm"
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.5 }}
                        >
                            <RefreshCw size={20} className="text-[#d67a9d]" />
                        </motion.button>
                    </div>

                    {/* НАВИГАЦИЯ С ВКЛАДКАМИ */}
                    <div className="flex flex-wrap bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                        {(['inventory', 'logistics', 'promocodes', 'operations', 'users', 'news'] as const).map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-black' : 'text-white/40 hover:text-white'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">
                                    {tab === 'inventory' ? 'ИНВЕНТАРЬ' :
                                        tab === 'logistics' ? 'ЛОГИСТИКА' :
                                            tab === 'promocodes' ? 'ПРОМОКОДЫ' :
                                                tab === 'operations' ? 'КВЕСТЫ' :
                                                    tab === 'users' ? 'ПОЛЬЗОВАТЕЛИ' : 'НОВОСТИ'}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* ОСНОВНОЕ СОДЕРЖИМОЕ */}
                <AnimatePresence mode="wait">
                    {activeTab === 'inventory' && (
                        <motion.div
                            key="inv"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
                        >
                            <section>
                                <form onSubmit={handleSubmitProduct} className="space-y-4 p-8 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-sm">
                                    <input
                                        placeholder="НАЗВАНИЕ ТОВАРА"
                                        className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="ЦЕНА (₽)"
                                            type="number"
                                            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none"
                                            value={form.price}
                                            onChange={e => setForm({ ...form, price: e.target.value })}
                                            required
                                            min="0"
                                        />
                                        <select
                                            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white outline-none"
                                            value={form.category}
                                            onChange={e => handleCategoryChange(e.target.value)}
                                        >
                                            <option className="bg-black" value="apparel">ОДЕЖДА</option>
                                            <option className="bg-black" value="footwear">ОБУВЬ</option>
                                            <option className="bg-black" value="accessories">АКСЕССУАРЫ</option>
                                        </select>
                                    </div>

                                    {/* ХАРАКТЕРИСТИКИ ТОВАРА */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                            <input
                                                placeholder="МАТЕРИАЛ"
                                                className="w-full bg-black/50 border border-white/10 p-5 pl-12 rounded-2xl outline-none text-[10px] font-bold uppercase"
                                                value={form.material}
                                                onChange={e => setForm({ ...form, material: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                            <input
                                                placeholder="СТРАНА"
                                                className="w-full bg-black/50 border border-white/10 p-5 pl-12 rounded-2xl outline-none text-[10px] font-bold uppercase"
                                                value={form.origin}
                                                onChange={e => setForm({ ...form, origin: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                            <input
                                                placeholder="АРТИКУЛ (AUTO)"
                                                className="w-full bg-black/50 border border-white/10 p-5 pl-12 rounded-2xl outline-none text-[10px] font-bold uppercase"
                                                value={form.article}
                                                onChange={e => setForm({ ...form, article: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder="ОПИСАНИЕ ТОВАРА"
                                        className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl h-32 resize-none outline-none"
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                    />

                                    {/* ГАЛЕРЕЯ ИЗОБРАЖЕНИЙ */}
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-white/30 uppercase ml-2 tracking-widest">Галерея изображений</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {form.images.map((img, i) => (
                                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(i)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#d67a9d] transition-all bg-black/30">
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                    accept="image/*"
                                                />
                                                {uploading ? (
                                                    <RefreshCw className="animate-spin text-[#d67a9d]" size={20} />
                                                ) : (
                                                    <>
                                                        <Plus size={20} className="text-white/50" />
                                                        <span className="text-[8px] text-white/30 mt-1">Загрузить</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* РАЗМЕРЫ */}
                                    {form.category !== 'accessories' && (
                                        <div className="space-y-2 pt-4">
                                            <p className="text-[9px] font-black text-white/30 uppercase ml-2 tracking-widest">Доступные размеры:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {form.sizes.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => toggleSizeStock(i)}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${s.inStock ? 'bg-white text-black border-white' : 'bg-transparent text-white/20 border-white/5'
                                                            }`}
                                                    >
                                                        {s.size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full py-5 rounded-2xl font-black uppercase bg-[#d67a9d] text-white tracking-[0.2em] shadow-[0_10px_30px_rgba(214,122,157,0.3)] hover:opacity-90 transition-opacity"
                                    >
                                        {editingId ? 'ОБНОВИТЬ ТОВАР' : 'СОЗДАТЬ ТОВАР'}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="w-full py-3 text-[10px] font-black opacity-50 uppercase italic hover:opacity-100 transition-opacity"
                                        >
                                            ОТМЕНИТЬ РЕДАКТИРОВАНИЕ
                                        </button>
                                    )}
                                </form>
                            </section>

                            <section className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-3xl group hover:border-white/20 transition-all backdrop-blur-sm"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-black overflow-hidden border border-white/5">
                                                    <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-xs uppercase italic text-white">{product.name}</h3>
                                                    <p className="text-[#71b3c9] text-[10px] font-bold mt-1">{product.price} ₽</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-white/20 text-[8px] font-black uppercase">{product.article || 'NO_ARTICLE'}</span>
                                                        <span className="text-white/10 text-[7px] px-1.5 py-0.5 bg-white/5 rounded">
                                                            {product.category === 'apparel' ? 'ОДЕЖДА' :
                                                                product.category === 'footwear' ? 'ОБУВЬ' : 'АКСЕССУАР'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => startEdit(product)}
                                                    className="p-3 bg-white/5 rounded-xl hover:bg-white hover:text-black transition-all"
                                                    title="Редактировать"
                                                >
                                                    <LayoutGrid size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                    title="Удалить"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
                                        <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                        <p className="text-white/10 font-black uppercase text-sm">НЕТ ТОВАРОВ</p>
                                        <p className="text-white/5 text-[10px] font-black uppercase mt-2">Создайте первый товар</p>
                                    </div>
                                )}
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'logistics' && (
                        <motion.div
                            key="log"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            {/* ПАНЕЛЬ ФИЛЬТРОВ И ПОИСКА - ТОЛЬКО ПО НОМЕРУ ЗАКАЗА */}
                            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-lg">
                                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

                                    {/* ПОИСК - ТОЛЬКО ПО НОМЕРУ ЗАКАЗА */}
                                    <div className="relative flex-1 max-w-xl">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                        <input
                                            placeholder="ПОИСК ПО НОМЕРУ ЗАКАЗА (ID)..."
                                            className="w-full bg-black/30 border border-white/10 p-5 pl-16 rounded-2xl outline-none font-black italic uppercase tracking-widest text-sm focus:border-[#00ffea]/50 transition-all"
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                        />
                                    </div>

                                    {/* СТАТИСТИКА */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Всего</p>
                                            <p className="text-xl font-black italic text-white">{filteredOrders.length}</p>
                                        </div>
                                        <div className="w-px h-6 bg-white/10" />
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Активные</p>
                                            <p className="text-xl font-black italic text-cyan-400">{filteredOrders.filter(o => !o.status.includes('Получен') && !o.status.includes('ОТКЛОНЕН')).length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* СПИСОК ЗАКАЗОВ */}
                            <div className="space-y-6">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            expanded={expandedOrders[order.id] || false}
                                            onToggle={() => toggleOrder(order.id)}
                                            onStatusClick={(orderId, currentStatus) => setStatusModal({
                                                show: true,
                                                orderId,
                                                currentStatus
                                            })}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-20 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent"
                                    >
                                        <Database className="w-16 h-16 text-white/10 mx-auto mb-4" />
                                        <p className="text-white/10 font-black italic uppercase text-lg">ЗАКАЗЫ НЕ НАЙДЕНЫ</p>
                                        <p className="text-white/5 text-[10px] font-black uppercase mt-2">
                                            {userSearch.trim() ? 'Измените параметры поиска' : 'Заказов пока нет'}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'promocodes' && (
                        <motion.div key="promo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-16">
                            <section>
                                <form onSubmit={handleCreatePromo} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-4 backdrop-blur-sm">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-[#71b3c9]">Новый промокод</h2>
                                    <input
                                        placeholder="КОД (НАПР. GIGA30)"
                                        className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl font-black uppercase italic"
                                        value={promoForm.code}
                                        onChange={e => setPromoForm({ ...promoForm, code: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="number"
                                            placeholder="СКИДКА (₽)"
                                            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl"
                                            value={promoForm.discount}
                                            onChange={e => setPromoForm({ ...promoForm, discount: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            placeholder="ЛИМИТ"
                                            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl"
                                            value={promoForm.usage_limit}
                                            onChange={e => setPromoForm({ ...promoForm, usage_limit: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPromoForm({ ...promoForm, is_hidden: !promoForm.is_hidden })}
                                        className={`w-full p-5 rounded-2xl border text-[10px] font-black uppercase transition-all flex items-center justify-center gap-3 ${promoForm.is_hidden ? 'bg-[#d67a9d]/20 border-[#d67a9d] text-[#d67a9d]' : 'bg-white/5 border-white/10 text-white/40'
                                            }`}
                                    >
                                        {promoForm.is_hidden ? <EyeOff size={16} /> : <Ticket size={16} />}
                                        {promoForm.is_hidden ? 'СКРЫТЫЙ (ДЛЯ КВЕСТОВ)' : 'ПУБЛИЧНЫЙ (ОБЩИЙ)'}
                                    </button>
                                    <button type="submit" className="w-full py-5 bg-[#d67a9d] text-white rounded-2xl font-black uppercase tracking-[0.2em]">
                                        ГЕНЕРИРОВАТЬ
                                    </button>
                                </form>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white/30">Активные коды</h2>
                                <div className="grid gap-4">
                                    {promocodes.map(p => (
                                        <div key={p.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group backdrop-blur-sm">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-black italic uppercase text-xl tracking-tighter">{p.code}</h4>
                                                    {p.is_hidden && (
                                                        <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded text-[#d67a9d] font-black uppercase">Скрытый</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-bold text-[#71b3c9] mt-1 italic">
                                                    -{p.discount} ₽ / ОСТАЛОСЬ: {p.usage_limit - (p.used_count || 0)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => deletePromo(e, p.id)}
                                                className="p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                            ><Trash2 size={20} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'operations' && (
                        <motion.div key="ops" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-16">
                            <section>
                                <form onSubmit={handleCreateTask} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-4 backdrop-blur-sm">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-[#71b3c9]">Новая миссия</h2>
                                    <input
                                        placeholder="НАЗВАНИЕ МИССИИ"
                                        className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl font-black uppercase italic"
                                        value={taskForm.title}
                                        onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="ОПИСАНИЕ (ЧТО НУЖНО СДЕЛАТЬ)"
                                        className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl h-24 font-bold outline-none"
                                        value={taskForm.description}
                                        onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                                    />
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-[#d67a9d] uppercase ml-2 tracking-widest">Секретное слово активации</label>
                                        <input
                                            placeholder="НАПР. GIGALOVE"
                                            className="w-full bg-black/50 border border-[#d67a9d]/30 p-5 rounded-2xl font-black uppercase text-[#d67a9d] outline-none"
                                            value={taskForm.secret_word}
                                            onChange={e => setTaskForm({ ...taskForm, secret_word: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-[#71b3c9] uppercase ml-2 tracking-widest">Награда (Промокод)</label>
                                        <select
                                            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl font-black uppercase text-xs outline-none text-white"
                                            value={taskForm.reward_code}
                                            onChange={e => setTaskForm({ ...taskForm, reward_code: e.target.value })}
                                        >
                                            <option value="">ВЫБЕРИ_ПРОМОКОД</option>
                                            {promocodes.filter(p => p.is_hidden).map(p => (
                                                <option key={p.id} value={p.code} className="bg-black">{p.code} (-{p.discount} ₽)</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-[#71b3c9] text-black rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(113,179,201,0.2)]">
                                        АКТИВИРОВАТЬ
                                    </button>
                                </form>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white/30">Реестр миссий</h2>
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {tasks.length > 0 ? tasks.map(t => (
                                        <div key={t.id} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] group relative overflow-hidden backdrop-blur-sm">
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-black italic uppercase text-2xl tracking-tighter">{t.title}</h4>
                                                        <p className="text-[10px] text-white/40 mt-1 uppercase italic leading-relaxed max-w-[80%]">{t.description}</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <div className="inline-block bg-[#d67a9d]/10 px-3 py-1 rounded-lg border border-[#d67a9d]/20 text-[#d67a9d] text-[9px] font-black uppercase">СЕКРЕТ: {t.secret_word}</div>
                                                        <div className="inline-block bg-[#71b3c9]/10 px-3 py-1 rounded-lg border border-[#71b3c9]/20 text-[#71b3c9] text-[9px] font-black uppercase">НАГРАДА: {t.reward_code}</div>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={(e) => deleteTask(e, t.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                                            </div>
                                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                                <Target size={80} />
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] text-white/10 font-black italic uppercase">
                                            НЕТ АКТИВНЫХ МИССИЙ
                                        </div>
                                    )}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div className="relative max-w-xl mx-auto">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                <input
                                    placeholder="ПОИСК ПО EMAIL..."
                                    className="w-full bg-white/5 border border-white/10 p-6 pl-16 rounded-3xl outline-none font-black italic uppercase tracking-widest focus:border-[#d67a9d]/50 transition-all backdrop-blur-sm"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase())).map((user) => (
                                    <div key={user.id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col gap-6 group hover:border-[#d67a9d]/30 transition-all backdrop-blur-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[9px] font-black text-[#d67a9d] uppercase tracking-widest mb-1">User_Auth_ID</p>
                                                <h4 className="font-black italic uppercase text-lg tracking-tighter text-white truncate">{user.email}</h4>
                                            </div>
                                            <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                                                <p className="text-[9px] font-black text-white/20 uppercase">Прогресс</p>
                                                <p className="text-[#71b3c9] font-black italic">{user.progress || 0}%</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Обновить прогресс миссии</label>
                                            <div className="flex gap-4">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={user.progress || 0}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        setUsers(users.map(u => u.id === user.id ? { ...u, progress: val } : u));
                                                    }}
                                                    className="flex-1 accent-[#d67a9d]"
                                                />
                                                <button
                                                    onClick={() => updateUserProgress(user.id, user.progress)}
                                                    disabled={updatingUser === user.id}
                                                    className="bg-[#d67a9d] text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                                >
                                                    {updatingUser === user.id ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'news' && (
                        <motion.div key="news" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-16">
                            <section>
                                <form onSubmit={handleCreateNews} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-4 backdrop-blur-sm">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-[#d67a9d]">Новое объявление</h2>
                                    <input
                                        placeholder="ЗАГОЛОВОК НОВОСТИ"
                                        className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl font-black uppercase italic"
                                        value={newsForm.title}
                                        onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="ТЕКСТ НОВОСТИ"
                                        className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl h-32 font-bold outline-none"
                                        value={newsForm.content}
                                        onChange={e => setNewsForm({ ...newsForm, content: e.target.value })}
                                    />

                                    {/* ГРУППА ЗАГРУЗКИ ИЗОБРАЖЕНИЯ */}
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-white/30 uppercase ml-2 tracking-widest">Изображение новости</label>
                                        <div className="flex gap-4 items-center">
                                            <label className="flex-1 h-20 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-[#d67a9d] transition-all bg-black/50">
                                                <input type="file" className="hidden" onChange={handleNewsFileUpload} />
                                                {uploading ? (
                                                    <RefreshCw className="animate-spin text-[#d67a9d]" />
                                                ) : newsForm.image_url ? (
                                                    <div className="flex items-center gap-2 text-[#71b3c9]">
                                                        <ImageIcon size={20} />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">Заменено</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center opacity-40">
                                                        <Plus size={20} />
                                                        <span className="text-[8px] font-black uppercase mt-1">Загрузить с ПК</span>
                                                    </div>
                                                )}
                                            </label>
                                            {newsForm.image_url && (
                                                <div className="w-20 h-20 rounded-2xl border border-white/10 overflow-hidden bg-black/50">
                                                    <img src={newsForm.image_url} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            placeholder="ИЛИ ВСТАВЬТЕ URL ССЫЛКУ"
                                            className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-[10px] font-bold outline-none"
                                            value={newsForm.image_url}
                                            onChange={e => setNewsForm({ ...newsForm, image_url: e.target.value })}
                                        />
                                    </div>

                                    <button type="submit" className="w-full py-5 bg-[#d67a9d] text-white rounded-2xl font-black uppercase tracking-[0.2em]">
                                        ОПУБЛИКОВАТЬ
                                    </button>
                                </form>
                            </section>

                            <section className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white/30">История новостей</h2>
                                {news.map(item => (
                                    <div key={item.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] group relative backdrop-blur-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4">
                                                {item.image_url && (
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/5 bg-black">
                                                        <img src={item.image_url} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-black italic uppercase text-lg text-[#d67a9d]">{item.title}</h4>
                                                    <p className="text-[10px] text-white/50 mt-2 line-clamp-2 uppercase font-bold">{item.content}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => deleteNews(item.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* МОДАЛЬНОЕ ОКНО СТАТУСА */}
            <StatusModal />

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #d67a9d, #71b3c9);
          border-radius: 10px; 
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
      `}</style>
        </div>
    )
}