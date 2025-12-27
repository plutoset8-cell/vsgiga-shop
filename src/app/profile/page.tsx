'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([]) 
  const [userBonuses, setUserBonuses] = useState(0)
  const [bonusHistory, setBonusHistory] = useState<any[]>([]) // Состояние для истории
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

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

      // 1. Загружаем заказы
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (ordersData) setOrders(ordersData)

      // 2. Загружаем баланс бонусов
      const { data: profileData } = await supabase
        .from('profiles')
        .select('bonuses')
        .eq('id', user.id)
        .single()
      
      if (profileData) {
        setUserBonuses(profileData.bonuses || 0)
      }

      // 3. ЗАГРУЗКА ИСТОРИИ БОНУСОВ (bonus_history)
      const { data: historyData } = await supabase
        .from('bonus_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10) // Берем последние 10 записей

      if (historyData) setBonusHistory(historyData)

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

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      if (updateError) throw updateError

      setUser({ ...user, user_metadata: { ...user.user_metadata, avatar_url: publicUrl } })
      router.refresh()
      alert('SYSTEM_MESSAGE: AVATAR_SYNC_COMPLETE')
    } catch (error: any) {
      alert('CRITICAL_ERROR: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic animate-pulse tracking-[0.5em]">
      INITIALIZING_PROFILE...
    </div>
  )

  const stats = [
    { label: 'ORDERS', value: orders.length.toString() },
    { label: 'POINTS', value: userBonuses.toString() },
    { label: 'STATUS', value: user?.user_metadata?.rank || 'RECRUIT' },
  ]

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* КАРТОЧКА АГЕНТА */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/5 border border-white/10 rounded-[4rem] p-10 mb-12 overflow-hidden backdrop-blur-3xl"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d67a9d]/20 rounded-full blur-[100px]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <label htmlFor="avatar-input" className="cursor-pointer block relative">
                <div className={`w-40 h-40 rounded-full border-2 ${uploading ? 'border-yellow-500 animate-spin' : 'border-[#d67a9d]'} p-2 transition-all group-hover:scale-105 shadow-2xl shadow-[#d67a9d]/20`}>
                  <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=d67a9d&color=fff`} className="w-full h-full rounded-full object-cover bg-black" alt="avatar" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload_New</span>
                </div>
              </label>
              <input type="file" id="avatar-input" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-black" />
            </div>

            <div className="text-center md:text-left">
              <p className="text-[#d67a9d] font-black text-[10px] tracking-[0.5em] mb-2 uppercase italic">
                {uploading ? 'UPLOADING_TO_SERVER...' : `ACCESS_LEVEL: ${user?.user_metadata?.rank || 'GIGA_MEMBER'}`}
              </p>
              <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4 truncate max-w-md">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/5">{user?.email}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* СТАТИСТИКА */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] text-center">
              <p className="text-white/30 font-black text-[10px] tracking-[0.3em] mb-2 uppercase">{stat.label}</p>
              <p className="text-4xl font-black italic text-[#71b3c9]">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* БЛОК БОНУСОВ И ИСТОРИИ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* ОБЩИЙ БАЛАНС */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] rounded-[3rem] blur opacity-15"></div>
            <div className="relative bg-[#080808] border border-white/10 p-8 rounded-[3rem] h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
                  <Coins size={28} className="text-[#d67a9d]" />
                </div>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-1 italic">Current_Balance</p>
                <h3 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-8">
                  {userBonuses} <span className="text-[10px] text-[#71b3c9] tracking-normal uppercase ml-2">GIGA_COINS</span>
                </h3>
              </div>
              
              <Link href="/catalog" className="w-full">
                <button className="group w-full flex items-center justify-center gap-3 px-8 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#d67a9d] hover:text-white transition-all duration-300">
                  СПИСАТЬ БОНУСЫ
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* ИСТОРИЯ ТРАНЗАКЦИЙ (ИСПРАВЛЕНА ВИЗУАЛИЗАЦИЯ) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2 italic">
                <Clock size={12} /> Transaction_Log
              </h4>
              <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest italic">Latest_10</span>
            </div>

            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
              {bonusHistory.length > 0 ? (
                bonusHistory.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Если сумма > 0 — иконка вверх и зеленый цвет, если < 0 — вниз и красный */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${Number(log.amount) > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {Number(log.amount) > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase leading-tight italic">{log.reason || 'Transaction'}</p>
                        <p className="text-[8px] text-white/20 font-bold uppercase mt-1">
                          {log.created_at ? new Date(log.created_at).toLocaleDateString() : 'Date Unknown'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-black italic ${Number(log.amount) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Number(log.amount) > 0 ? `+${log.amount}` : log.amount}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-10">
                  <Clock size={32} strokeWidth={1} />
                  <p className="text-[9px] font-black uppercase tracking-widest mt-4 italic">No_Activity_Yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* СЕКЦИЯ ЗАКАЗОВ С ТРЕКЕРОМ */}
        <section className="space-y-12">
          <h2 className="text-xs font-black italic uppercase tracking-[0.5em] text-white/30 mb-10 pl-4">Active_Deployments_Status</h2>
          
          <AnimatePresence>
            {orders.map((order) => (
              <motion.div 
                key={order.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] relative overflow-hidden group"
              >
                <div className="flex flex-wrap justify-between items-start mb-10 gap-6">
                  <div>
                    <span className="text-[8px] font-black text-[#d67a9d] uppercase tracking-widest">Order_Ref: {order.id.slice(0,18)}</span>
                    <p className="text-xs font-bold text-white/40 mt-1 uppercase tracking-tighter">Placed: {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black italic">{order.total_amount.toLocaleString()} ₽</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{order.address}</p>
                  </div>
                </div>

                {/* ШКАЛА ПРОГРЕССА */}
                <div className="relative pt-4">
                  <div className="flex justify-between mb-4 items-end">
                    <span className="text-[10px] font-black uppercase text-[#71b3c9] tracking-[0.2em]">Deployment_Progress</span>
                    <span className="text-xs font-black uppercase text-white bg-white/10 px-4 py-1 rounded-full border border-white/10 italic">
                      {order.status}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${STATUS_PROGRESS[order.status] || 0}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-[#71b3c9] to-[#d67a9d] shadow-[0_0_20px_rgba(214,122,157,0.4)]"
                    />
                  </div>
                  <div className="flex justify-between mt-4 text-[7px] font-black text-white/10 uppercase tracking-widest">
                    <span>Origin</span>
                    <span>Processing</span>
                    <span>Transit</span>
                    <span>Destination</span>
                  </div>
                </div>

                {/* ПРЕДПРОСМОТР ТОВАРОВ */}
                <div className="mt-10 flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex-shrink-0 flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                      <div>
                        <p className="text-[9px] font-black uppercase leading-tight max-w-[80px] truncate">{item.name}</p>
                        <p className="text-[8px] text-[#71b3c9] font-bold">{item.quantity} PCS</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {orders.length === 0 && (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-[4rem]">
              <p className="text-white/10 font-black italic uppercase tracking-[0.5em]">System_Idle: No_Active_Orders</p>
            </div>
          )}
        </section>

        {/* КНОПКА ВЫХОДА */}
        <div className="mt-20 flex justify-center">
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="group flex flex-col items-center gap-2"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20 group-hover:text-red-500 transition-all">Terminate_Session</span>
            <div className="h-[1px] w-12 bg-white/10 group-hover:w-24 group-hover:bg-red-500 transition-all" />
          </button>
        </div>

      </div>
    </main>
  )
}