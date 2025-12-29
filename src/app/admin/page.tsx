'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useToast } from '@/context/ToastContext'
import {
  Package, MapPin, ChevronDown, ChevronUp, User, ShoppingBag,
  Phone, Contact2, X, Image as ImageIcon, Plus, Ticket,
  Trash2, Zap, Target, EyeOff, LayoutGrid, RefreshCw, Search, Save,
  Newspaper, ShieldCheck, Globe, Barcode // Добавлены иконки для новых полей
} from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const { showToast } = useToast()

  // Добавили 'news' в активные вкладки
  const [activeTab, setActiveTab] = useState<'inventory' | 'logistics' | 'promocodes' | 'operations' | 'users' | 'news'>('inventory')

  // Данные из БД
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [promocodes, setPromocodes] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [news, setNews] = useState<any[]>([]) // Состояние для новостей

  // Состояния для пользователей
  const [users, setUsers] = useState<any[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  // Состояния интерфейса
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})
  const [uploading, setUploading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  const ADMIN_EMAIL = 'plutoset8@gmail.com'

  // --- ФУНКЦИЯ TELEGRAM УВЕДОМЛЕНИЙ ---
  const sendTelegramNotify = async (text: string) => {
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
  }

  // --- КОНСТАНТЫ РАЗМЕРОВ ---
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

  // Формы (ОБНОВЛЕНО: добавлены material, origin, article)
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'apparel',
    image: '',
    images: [] as string[],
    description: '',
    sizes: CLOTHES_SIZES,
    material: '', // New
    origin: '',   // New
    article: ''   // New
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

  // ФОРМА ДЛЯ НОВОСТЕЙ
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    image_url: ''
  })

  const STATUSES = [
    'Оформлен',
    'На сборке в другом городе',
    'Приехал на склад',
    'Отгружен на складе',
    'Отправлен в город получателя',
    'В пункте выдачи',
    'Получен'
  ]

  // Инициализация
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

  const refreshData = async () => {
    await Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchPromocodes(),
      fetchTasks(),
      fetchUsers(),
      fetchNews() // Добавили загрузку новостей
    ])
  }

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
  }

  const fetchPromocodes = async () => {
    const { data } = await supabase
      .from('promocodes')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPromocodes(data)
  }

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTasks(data)
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('email', { ascending: true })
    if (!error && data) setUsers(data)
  }

  // ЗАГРУЗКА НОВОСТЕЙ
  const fetchNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setNews(data)
  }

  const updateUserProgress = async (userId: string, newProgress: number) => {
    setUpdatingUser(userId)
    const { error } = await supabase
      .from('profiles')
      .update({ progress: newProgress })
      .eq('id', userId)

    if (!error) {
      const user = users.find(u => u.id === userId)
      setUsers(users.map(u => u.id === userId ? { ...u, progress: newProgress } : u))
      showToast('ПРОГРЕСС_ОБНОВЛЕН', 'success')

      await sendTelegramNotify(
        `📈 <b>vsgiga shop: Прогресс</b>\n` +
        `Пользователь: <code>${user?.email}</code>\n` +
        `Установлен прогресс: <b>${newProgress}%</b>`
      )
    } else {
      showToast('ОШИБКА_ОБНОВЛЕНИЯ', 'error')
    }
    setUpdatingUser(null)
  }

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
      showToast('МЕДИА_ЗАГРУЖЕНО', 'success')
    } catch (err) {
      showToast('ОШИБКА_ЗАГРУЗКИ', 'error')
    } finally {
      setUploading(false)
    }
  }

  // --- НОВЫЙ ОБРАБОТЧИК ЗАГРУЗКИ КАРТИНКИ ДЛЯ НОВОСТЕЙ ---
  const handleNewsFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `news/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images') // Используем тот же бакет
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      setNewsForm(prev => ({ ...prev, image_url: data.publicUrl }))
      showToast('КАРТИНКА_ЗАГРУЖЕНА', 'success')
    } catch (err) {
      showToast('ОШИБКА_ЗАГРУЗКИ', 'error')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    const newImages = form.images.filter((_, i) => i !== index)
    setForm({
      ...form,
      images: newImages,
      image: newImages.length > 0 ? newImages[0] : ''
    })
  }

  const toggleSizeStock = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    const updatedSizes = [...form.sizes]
    updatedSizes[index].inStock = !updatedSizes[index].inStock
    setForm({ ...form, sizes: updatedSizes })
  }

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

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    // ЛОГИКА АРТИКУЛА: Если пустой -> генерируем VSG-{рандом}
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
      // Новые поля
      material: form.material || 'CYBER_FIBER_SYNTH',
      origin: form.origin || 'KOREA_REPUBLIC',
      article: finalArticle
    }

    const { error } = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert([payload])

    if (!error) {
      showToast(editingId ? 'ДАННЫЕ_ОБНОВЛЕНЫ' : 'ТОВАР_СОЗДАН', 'success')

      await sendTelegramNotify(
        `✨ <b>vsgiga shop: Инвентарь</b>\n` +
        `Действие: <b>${editingId ? 'Обновление' : 'Создание'} товара</b>\n` +
        `Название: <code>${form.name}</code>\n` +
        `Артикул: <code>${finalArticle}</code>\n` +
        `Цена: <b>${form.price} ₽</b>`
      )

      cancelEdit()
      fetchProducts()
    }
  }

  const startEdit = (product: any) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      image: product.image,
      images: product.images || [product.image],
      sizes: product.sizes || [],
      // Заполняем новые поля
      material: product.material || '',
      origin: product.origin || '',
      article: product.article || ''
    })
  }

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

  const deleteProduct = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    if (!confirm('УДАЛИТЬ_ТОВАР?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) fetchProducts()
  }

  const updateOrderStatus = async (e: React.MouseEvent, orderId: string, status: string) => {
    e.preventDefault()
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
      showToast('СТАТУС_ОБНОВЛЕН', 'success')

      await sendTelegramNotify(
        `📦 <b>vsgiga shop: Логистика</b>\n` +
        `Заказ: <code>${orderId.slice(0, 8)}...</code>\n` +
        `Новый статус: <b>${status}</b>`
      )
    }
  }

  const toggleOrder = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }))
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
      showToast('ПРОМОКОД_СОЗДАН', 'success')
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
      return showToast('ЗАПОЛНИТЕ_ВСЕ_ПОЛЯ', 'error')
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
      showToast('МИССИЯ_АКТИВИРОВАНА', 'success')
      router.refresh()
    } else {
      showToast(`ОШИБКА: ${error.message}`, 'error')
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

  // ОБРАБОТКА СОЗДАНИЯ НОВОСТИ
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('news').insert([newsForm])
    if (!error) {
      setNewsForm({ title: '', content: '', image_url: '' })
      fetchNews()
      showToast('НОВОСТЬ_ОПУБЛИКОВАНА', 'success')
    }
  }

  const deleteNews = async (id: string) => {
    if (!confirm('УДАЛИТЬ_НОВОСТЬ?')) return
    const { error } = await supabase.from('news').delete().eq('id', id)
    if (!error) fetchNews()
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic">
      vsgiga_loading...
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              vsgiga<span className="text-[#d67a9d]">_admin</span>
            </h1>
            <button
              onClick={refreshData}
              className="p-2 bg-white/5 rounded-full hover:rotate-180 transition-all duration-500"
            >
              <RefreshCw size={20} className="text-[#d67a9d]" />
            </button>
          </div>

          <div className="flex flex-wrap bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            {(['inventory', 'logistics', 'promocodes', 'operations', 'users', 'news'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                  }`}
              >
                {tab === 'inventory' ? 'ИНВЕНТАРЬ' :
                  tab === 'logistics' ? 'ЛОГИСТИКА' :
                    tab === 'promocodes' ? 'ПРОМОКОДЫ' :
                      tab === 'operations' ? 'КВЕСТЫ' :
                        tab === 'users' ? 'ПОЛЬЗОВАТЕЛИ' : 'НОВОСТИ'}
              </button>
            ))}
          </div>
        </div>

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
                <form onSubmit={handleSubmitProduct} className="space-y-4 p-8 rounded-[2.5rem] border border-white/10 bg-white/5">
                  <input
                    placeholder="НАЗВАНИЕ ТОВАРА"
                    className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="ЦЕНА (₽)"
                      type="number"
                      className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
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

                  {/* НОВЫЙ БЛОК: ХАРАКТЕРИСТИКИ ТОВАРА */}
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

                  <div className="grid grid-cols-4 gap-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                        <img src={img} className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => removeImage(e, i)}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg"
                        ><X size={12} /></button>
                      </div>
                    ))}
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#d67a9d] transition-all">
                      <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                      {uploading ? <RefreshCw className="animate-spin" /> : <Plus />}
                    </label>
                  </div>

                  {form.category !== 'accessories' && (
                    <div className="space-y-2 pt-4">
                      <p className="text-[9px] font-black text-white/30 uppercase ml-2 tracking-widest">Доступные размеры:</p>
                      <div className="flex flex-wrap gap-2">
                        {form.sizes.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => toggleSizeStock(e, i)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${s.inStock ? 'bg-white text-black border-white' : 'bg-transparent text-white/20 border-white/5'
                              }`}
                          >{s.size}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-5 rounded-2xl font-black uppercase bg-[#d67a9d] text-white tracking-[0.2em] shadow-[0_10px_30px_rgba(214,122,157,0.3)]"
                  >
                    {editingId ? 'ОБНОВИТЬ КАРТОЧКУ' : 'СОЗДАТЬ ТОВАР'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="w-full py-3 text-[10px] font-black opacity-50 uppercase italic"
                    >ОТМЕНИТЬ РЕДАКТИРОВАНИЕ</button>
                  )}
                </form>
              </section>

              <section className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-3xl group hover:border-white/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-black overflow-hidden border border-white/5">
                        <img src={product.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-black text-xs uppercase italic">{product.name}</h3>
                        <p className="text-[#71b3c9] text-[10px] font-bold mt-1">{product.price} ₽</p>
                        {/* Показываем артикул в списке */}
                        <p className="text-white/20 text-[8px] font-black mt-1 uppercase">{product.article || 'NO_ARTICLE'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => startEdit(product)} className="p-3 bg-white/5 rounded-xl hover:bg-white hover:text-black transition-all"><LayoutGrid size={18} /></button>
                      <button onClick={(e) => deleteProduct(e, product.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </section>
            </motion.div>
          )}

          {activeTab === 'logistics' && (
            <motion.div key="log" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                  <div className="p-8 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#d67a9d]/10 rounded-2xl flex items-center justify-center border border-[#d67a9d]/20">
                        <Package className="text-[#d67a9d]" size={28} />
                      </div>
                      <div>
                        <h3 className="font-black text-xl italic uppercase tracking-tighter">ЗАКАЗ_{order.id.slice(0, 8)}</h3>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-[9px] font-black text-white/20 uppercase mb-1 tracking-widest">Сумма</p>
                        <p className="text-xl font-black italic">{order.total_amount.toLocaleString()} ₽</p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(e as any, order.id, e.target.value)}
                        className="bg-white text-black text-[10px] font-black uppercase px-6 py-4 rounded-2xl outline-none"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button
                        onClick={(e) => toggleOrder(e, order.id)}
                        className="p-4 bg-white/5 rounded-2xl"
                      >
                        {expandedOrders[order.id] ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrders[order.id] && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-white/5 bg-black/20"
                      >
                        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                          <div className="space-y-6">
                            <h4 className="flex items-center gap-3 text-[10px] font-black text-[#71b3c9] uppercase tracking-[0.3em] italic">
                              <User size={14} /> Клиент
                            </h4>
                            <div className="space-y-4">
                              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-white/20 uppercase font-black mb-1">ФИО</p>
                                <p className="font-black italic uppercase">
                                  {order.first_name || order.firstName || '—'} {order.last_name || order.lastName || ''}
                                </p>
                              </div>
                              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-white/20 uppercase font-black mb-1">Связь</p>
                                <p className="font-black italic">{order.phone || '—'}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h4 className="flex items-center gap-3 text-[10px] font-black text-[#d67a9d] uppercase tracking-[0.3em] italic">
                              <MapPin size={14} /> Адрес доставки
                            </h4>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 min-h-[120px]">
                              <p className="text-[9px] text-white/20 uppercase font-black mb-2 tracking-widest">Строка адреса</p>
                              <p className="font-bold text-sm leading-relaxed italic uppercase">{order.address || '—'}</p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h4 className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-[0.3em] italic">
                              <ShoppingBag size={14} /> Состав заказа
                            </h4>
                            <div className="space-y-2">
                              {order.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center bg-white text-black p-4 rounded-xl">
                                  <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase leading-none">{item.name || 'Товар'}</p>
                                    <div className="flex gap-2 mt-1">
                                      <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 rounded italic">
                                        РАЗМЕР: {item.size || item.selectedSize || 'OS'}
                                      </span>
                                      <span className="text-[9px] font-bold opacity-50">
                                        КОЛ-ВО: {item.quantity || 1}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="font-black italic ml-4">
                                    {((item.price || 0) * (item.quantity || 1)).toLocaleString()} ₽
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'promocodes' && (
            <motion.div key="promo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-16">
              <section>
                <form onSubmit={handleCreatePromo} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-4">
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
                    <div key={p.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group">
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
                <form onSubmit={handleCreateTask} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-4">
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
                    <div key={t.id} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] group relative overflow-hidden">
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
                  className="w-full bg-white/5 border border-white/10 p-6 pl-16 rounded-3xl outline-none font-black italic uppercase tracking-widest focus:border-[#d67a9d]/50 transition-all"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase())).map((user) => (
                  <div key={user.id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col gap-6 group hover:border-[#d67a9d]/30 transition-all">
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

          {/* НОВАЯ ВКЛАДКА: НОВОСТИ */}
          {activeTab === 'news' && (
            <motion.div key="news" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-16">
              <section>
                <form onSubmit={handleCreateNews} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-4">
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
                  <div key={item.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] group relative">
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d67a9d; border-radius: 10px; }
      `}</style>
    </div>
  )
}