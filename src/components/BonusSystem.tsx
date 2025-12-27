'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Zap, Gift, Ticket, Lock, RefreshCcw, Target, ChevronRight, CheckCircle2, Unlock, MessageCircle, ExternalLink } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export default function BonusSystem() {
  const [profile, setProfile] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isActivating, setIsActivating] = useState(false)
  const [secretInputs, setSecretInputs] = useState<Record<string, string>>({}) 
  const { showToast } = useToast()

  // Параметры системы лояльности vsgiga shop
  const DISCOUNT_THRESHOLD = 50000 
  const totalSpent = profile?.total_spent || 0
  const progressGlobal = Math.min((totalSpent / DISCOUNT_THRESHOLD) * 100, 100)
  const isEligible = totalSpent >= DISCOUNT_THRESHOLD

  // Твоя ссылка на менеджера
  const TELEGRAM_MANAGER_LINK = "https://t.me/MERCY_SKAM"

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      // Запрашиваем все поля, включая short_info и required_amount
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (!tasksError) {
        setTasks(tasksData || [])
      }

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
        
        if (profileData) setProfile(profileData)

        const { data: userTasksData } = await supabase
          .from('user_tasks')
          .select('task_id')
          .eq('user_id', user.id)
        
        if (userTasksData) {
          setCompletedTaskIds(userTasksData.map((t: any) => t.task_id))
        }
      }
    } catch (err) {
      console.error("CRITICAL_DB_ERROR:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const channel = supabase
      .channel('vsgiga_tasks_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchData()
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    showToast('ПРОМОКОД СКОПИРОВАН', 'success')
  }

  const handleActivateTask = async (taskId: string, correctSecret: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return showToast('НУЖНА АВТОРИЗАЦИЯ', 'error')

    const userInput = secretInputs[taskId]?.trim().toUpperCase()
    if (!userInput) return showToast('ВВЕДИТЕ КОД', 'error')
    
    if (userInput !== correctSecret.toUpperCase()) {
      return showToast('НЕВЕРНЫЙ КОД', 'error')
    }

    setIsActivating(true)
    try {
      const { error } = await supabase
        .from('user_tasks')
        .insert([{ user_id: user.id, task_id: taskId }])
      
      if (!error) {
        setCompletedTaskIds(prev => [...prev, taskId])
        showToast('МИССИЯ ВЫПОЛНЕНА', 'success')
      } else if (error.code === '23505') {
        showToast('ЗАДАНИЕ УЖЕ ВЫПОЛНЕНО', 'success')
      }
    } catch (err) {
      showToast('ОШИБКА СЕТИ', 'error')
    } finally {
      setIsActivating(false)
    }
  }

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
      <RefreshCcw className="text-[#d67a9d] animate-spin" size={24} />
      <div className="text-[#d67a9d] animate-pulse italic font-black text-[10px] tracking-[0.3em]">DATABASE_SYNC...</div>
    </div>
  )

  return (
    <div className="w-full py-12 px-4 relative overflow-visible bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* ЕДИНЫЙ ЗАГОЛОВОК СИСТЕМЫ БОНУСОВ */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-black italic uppercase tracking-[0.3em] flex items-center gap-3 text-white"
          >
            <Gift size={20} className="text-[#d67a9d] drop-shadow-[0_0_8px_#d67a9d]" /> 
            GIGA_BONUS_SYSTEM
          </motion.h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* ОСНОВНОЙ ВИДЖЕТ (GIGA_REACTOR) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#71b3c9]/30 to-[#d67a9d]/30 rounded-[3.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-[#050505] border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden backdrop-blur-3xl shadow-2xl">
              <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                  <span className="text-[10px] font-black text-[#71b3c9] uppercase tracking-widest block mb-2 opacity-80 italic">Core_Stability</span>
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
                    GIGA<span className="text-[#d67a9d]">_REACTOR</span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black italic text-[#d67a9d] drop-shadow-[0_0_15px_rgba(214,122,157,0.5)]">
                    {progressGlobal.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="relative h-16 bg-black border border-white/10 rounded-2xl p-2 overflow-hidden mb-8 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressGlobal}%` }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className={`h-full rounded-xl relative ${isEligible ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-gradient-to-r from-[#71b3c9] to-[#d67a9d]'}`}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                <span>Total Spent: {totalSpent.toLocaleString()} ₽</span>
                <span>Threshold: {DISCOUNT_THRESHOLD.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>

          <div className="relative group h-full">
            <div className="absolute -inset-0.5 bg-[#d67a9d]/30 rounded-[3.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-[#050505] border border-white/10 rounded-[3rem] p-10 h-full flex flex-col justify-between items-center text-center overflow-hidden backdrop-blur-3xl shadow-2xl">
              <Ticket size={56} className={isEligible ? 'text-[#d67a9d] drop-shadow-[0_0_20px_#d67a9d]' : 'text-white/5'} />
              <div className="space-y-3">
                <h4 className="text-2xl font-black italic uppercase text-white tracking-tighter">{isEligible ? 'ACCESS_GRANTED' : 'SYSTEM_LOCKED'}</h4>
                <p className="text-[10px] text-white/40 uppercase font-black italic tracking-wider">
                  {isEligible ? "Скидка -30% активирована во всех секторах." : "Накопите 50,000 ₽ для активации -30%."}
                </p>
              </div>
              <motion.div 
                onClick={() => isEligible && copyToClipboard('VSGIGA30')}
                className={`mt-8 w-full py-6 rounded-2xl border font-black text-3xl tracking-tighter transition-all relative z-10 
                ${isEligible ? 'bg-white text-black cursor-pointer shadow-white/20 shadow-xl' : 'bg-white/5 border-white/5 text-white/5 opacity-50'}`}
              >
                {isEligible ? <span className="italic">VSGIGA30</span> : <Lock className="mx-auto" size={32} />}
              </motion.div>
            </div>
          </div>
        </div>

        {/* СЕКЦИЯ ДОПОЛНИТЕЛЬНЫХ БОНУСОВ (ВМЕСТО ВКЛАДКИ ЗАДАНИЯ) */}
        <div className="space-y-8 pb-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#d67a9d]/10 rounded-xl flex items-center justify-center border border-[#d67a9d]/20">
              <Zap size={20} className="text-[#d67a9d]" />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Extra<span className="text-[#d67a9d]">_Bonuses</span></h3>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Sector: extra_rewards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode='popLayout'>
              {tasks.length > 0 ? (
                tasks.map((task, index) => {
                  const isCompleted = completedTaskIds.includes(task.id)
                  
                  // Исправленная логика прогресса миссий
                  const manualProgress = Number(profile?.progress) || 0
                  const requiredAmount = Number(task.required_amount) || 0
                  
                  // Если сумма покупки > 0, считаем по деньгам. Иначе — берем ручной прогресс из админки.
                  const taskProgress = requiredAmount > 0 
                    ? Math.min((totalSpent / requiredAmount) * 100, 100) 
                    : manualProgress;
                  
                  const canGetCode = taskProgress >= 100

                  return (
                    <motion.div
                      key={task.id}
                      className={`group relative border rounded-[2.5rem] p-8 overflow-hidden transition-all backdrop-blur-md ${
                        isCompleted ? 'bg-[#d67a9d]/5 border-[#d67a9d]/30' : 'bg-[#0a0a0a] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-4">
                            <span className={`${isCompleted ? 'text-[#d67a9d]' : 'text-white/20'} font-black italic text-xl`}>0{index + 1}</span>
                            <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">{task.title}</h3>
                            {isCompleted && <CheckCircle2 size={18} className="text-[#d67a9d]" />}
                            
                            <div className="px-3 py-1 border border-[#d67a9d]/30 rounded-full">
                                <span className="text-[8px] font-black text-[#d67a9d] uppercase italic tracking-widest">
                                    Reward: {isCompleted ? 'CLAIMED' : (task.reward_type || 'CODE')}
                                </span>
                            </div>
                          </div>
                          
                          <p className="text-white/40 text-[11px] font-bold leading-relaxed max-w-xl uppercase italic">
                            {task.short_info || task.description}
                          </p>

                          {!isCompleted && (
                            <div className="space-y-2 max-w-xl">
                              <div className="flex justify-between text-[9px] font-black uppercase text-white/30 tracking-widest italic">
                                <span>Bonus Progress</span>
                                <span>{taskProgress.toFixed(0)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${taskProgress}%` }}
                                  transition={{ duration: 1 }}
                                  className="h-full bg-[#d67a9d] shadow-[0_0_10px_#d67a9d]"
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* ЭЛЕМЕНТЫ ИЗ СКРИНШОТА: REGISTRY & ACTIVE */}
                          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">VSGIGA SHOP REGISTRY</span>
                            <span className="text-[9px] font-black text-[#d67a9d] uppercase italic tracking-[0.2em]">Active</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-4 min-w-[320px]">
                          {isCompleted ? (
                            <div className="flex flex-col items-center md:items-end gap-2 w-full">
                              <span className="text-[9px] font-black text-[#d67a9d] uppercase tracking-widest italic">Bonus Unlocked</span>
                              <button 
                                onClick={() => copyToClipboard(task.reward_code)}
                                className="w-full px-8 py-4 bg-white text-black rounded-2xl flex items-center justify-between hover:bg-[#d67a9d] hover:text-white transition-all duration-500 shadow-xl"
                              >
                                <Ticket size={18} />
                                <span className="font-black italic uppercase text-lg tracking-tighter">{task.reward_code}</span>
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3 w-full">
                              <a 
                                href={TELEGRAM_MANAGER_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-6 py-4 bg-[#d67a9d]/10 border border-[#d67a9d]/30 text-[#d67a9d] rounded-2xl flex items-center justify-center gap-3 font-black italic uppercase text-[10px] hover:bg-[#d67a9d] hover:text-white transition-all group"
                              >
                                <MessageCircle size={18} />
                                Send proof to manager
                                <ExternalLink size={14} className="opacity-50" />
                              </a>

                              <AnimatePresence>
                                {canGetCode && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2 overflow-hidden"
                                  >
                                    <span className="text-[9px] font-black text-[#d67a9d] uppercase tracking-widest text-center md:text-right block italic">Enter Secret Key</span>
                                    <div className="flex gap-2">
                                      <input 
                                        type="text"
                                        placeholder="SECRET_CODE"
                                        value={secretInputs[task.id] || ''}
                                        onChange={(e) => setSecretInputs(prev => ({...prev, [task.id]: e.target.value}))}
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white outline-none focus:border-[#d67a9d] w-full shadow-inner"
                                      />
                                      <button 
                                        disabled={isActivating}
                                        onClick={() => handleActivateTask(task.id, task.secret_word)}
                                        className="px-6 py-3 bg-[#d67a9d] text-white rounded-xl font-black hover:bg-white hover:text-black transition-all shadow-lg"
                                      >
                                        {isActivating ? <RefreshCcw size={14} className="animate-spin" /> : <Unlock size={14} />}
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
                  <p className="text-white/10 font-black italic uppercase text-xs tracking-[0.5em]">No extra bonuses available</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}