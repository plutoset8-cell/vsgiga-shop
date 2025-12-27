'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion'
import Link from 'next/link'
import Scene from '@/components/canvas/Scene'
import BonusSystem from '@/components/BonusSystem'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'main' | 'bonuses' | 'quests'>('main')
  const [promoCode, setPromoCode] = useState('')
  const [promoStatus, setPromoStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // СОСТОЯНИЕ ДЛЯ КВЕСТОВ ИЗ БАЗЫ
  const [dbQuests, setDbQuests] = useState<any[]>([])
  const [loadingQuests, setLoadingQuests] = useState(true)

  // НОВОЕ СОСТОЯНИЕ ДЛЯ НОВОСТЕЙ
  const [dbNews, setDbNews] = useState<any[]>([])

  // Координаты мыши (MotionValues)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Мягкие пружины для плавности шлейфа
  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 })

  // ПРЕДЕЛЬНО МАЛЕНЬКИЙ ШЛЕЙФ (радиус 100px)
  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(100px circle at ${x}px ${y}px, rgba(214, 122, 157, 0.3), transparent 80%)`
  )

  // Функция отправки уведомлений в Telegram для vsgiga shop
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

  // Функция загрузки квестов из базы vsgiga shop
  const fetchQuests = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setDbQuests(data || [])
    } finally {
      setLoadingQuests(false)
    }
  }

  // НОВАЯ ФУНКЦИЯ ЗАГРУЗКИ НОВОСТЕЙ
  const fetchNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (data) setDbNews(data)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    
    // Загружаем данные при монтировании
    fetchQuests()
    fetchNews()

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const categories = [
    { name: 'ОДЕЖДА', slug: 'apparel' },
    { name: 'АКСЕССУАРЫ', slug: 'accessories' },
    { name: 'ОБУВЬ', slug: 'footwear' },
    { name: 'LIMITED', slug: 'limited' }
  ]

  const navItems = [
    { id: 'main', label: 'ГЛАВНАЯ' },
    { id: 'bonuses', label: 'БОНУСЫ' },
    { id: 'about', href: '/about', label: 'О НАС' },
    { id: 'contacts', href: '/contacts', label: 'КОНТАКТЫ' }
  ]

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = promoCode.toUpperCase()
    
    if (code === 'VSGIGA2025') {
      setPromoStatus('success')
      await sendTelegramNotify(`🔥 <b>vsgiga shop</b>\nПользователь успешно активировал промокод: <code>${code}</code>`)
    } else {
      setPromoStatus('error')
      await sendTelegramNotify(`⚠️ <b>vsgiga shop</b>\nПопытка ввода неверного промокода: <code>${code}</code>`)
      setTimeout(() => setPromoStatus('idle'), 2000)
    }
  }

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      
      {/* ИСПРАВЛЕННЫЙ ИНТЕРАКТИВНЫЙ ШЛЕЙФ (МИКРО) */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10"
        style={{ background }}
      />
      
      <motion.div 
        className="fixed top-0 left-0 w-[60px] h-[60px] rounded-full bg-[#d67a9d] mix-blend-screen blur-[40px] pointer-events-none z-10 opacity-40"
        style={{ 
          x: springX, 
          y: springY, 
          translateX: '-50%', 
          translateY: '-50%',
          willChange: 'transform'
        }}
      />

      {/* ФИКС СНЕГА */}
      <div className="absolute inset-0 z-0 scale-[1.02]">
        <Scene />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 z-20 pt-20">
        
        {/* ЦЕНТРАЛЬНЫЙ ЛОГОТИП */}
        <motion.div 
          animate={{ 
            y: [0, -5, 0],
            rotate: [-1, 1, -1],
            filter: [
              "drop-shadow(0 0 10px rgba(214, 122, 157, 0.2))",
              "drop-shadow(0 0 25px rgba(214, 122, 157, 0.4))",
              "drop-shadow(0 0 10px rgba(214, 122, 157, 0.2))"
            ]
          }} 
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          className="overflow-visible flex flex-col items-center" 
        >
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[1.1] select-none text-center">
            <span 
              className="text-white"
              style={{ textShadow: '0 0 15px rgba(255,255,255,0.3)' }}
            >
              vsgiga
            </span>
            <span 
              className="text-[#d67a9d] ml-4 md:ml-6"
              style={{ 
                textShadow: `
                  0 0 10px #d67a9d,
                  0 0 20px #d67a9d,
                  0 0 40px rgba(214, 122, 157, 0.4)
                `
              }}
            >
              shop
            </span>
          </h1>
        </motion.div>

        {/* НАВИГАЦИЯ */}
        <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-8 mt-24 mb-16 relative z-20">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            
            const NavContent = (
              <motion.div
                initial="rest"
                whileHover="hover"
                animate={isActive ? "active" : "rest"}
                className="relative cursor-pointer px-8 md:px-10 py-4 flex items-center justify-center transition-all duration-300"
              >
                <motion.div
                  variants={{
                    rest: { opacity: 0.2, scale: 0.9, borderColor: "#d67a9d44" },
                    hover: { opacity: 1, scale: 1.05, borderColor: "#d67a9d", borderWidth: "2px" },
                    active: { opacity: 1, scale: 1, borderColor: "#d67a9d", borderWidth: "2px" }
                  }}
                  className="absolute inset-0 border-[1px] rounded-2xl z-0 transition-all"
                  style={{ 
                    boxShadow: isActive ? `0 0 25px #d67a9d44` : 'none',
                  }}
                />

                <motion.div
                  variants={{
                    rest: { opacity: 0 },
                    hover: { opacity: 1 }
                  }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                      variants={{
                        hover: {
                          y: [0, -30, -50],
                          x: [0, (i - 3) * 15, (i - 3) * 30],
                          opacity: [0, 1, 0],
                          scale: [0, 2, 0],
                        }
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                      style={{ left: '50%', top: '50%' }}
                    />
                  ))}
                </motion.div>

                <span 
                  className={`relative z-10 text-sm md:text-base font-black tracking-[0.3em] md:tracking-[0.4em] italic transition-all duration-500 ${
                    isActive ? 'text-white' : 'text-white/60'
                  }`}
                  style={{ 
                    textShadow: isActive ? `0 0 15px #d67a9d` : 'none',
                  }}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div 
                    layoutId="navLine"
                    className="absolute -bottom-2 left-6 right-6 h-[2px] rounded-full z-10"
                    style={{ 
                      backgroundColor: "#d67a9d",
                      boxShadow: `0 0 20px #d67a9d`
                    }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                  />
                )}
              </motion.div>
            );

            return "href" in item ? (
              <Link key={item.label} href={item.href!}>{NavContent}</Link>
            ) : (
              <button key={item.label} onClick={() => setActiveTab(item.id as any)}>{NavContent}</button>
            );
          })}
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="w-full max-w-6xl relative z-20 pb-24">
          <AnimatePresence mode="wait">
            {activeTab === 'main' && (
              <motion.div 
                key="main"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full flex flex-col items-center"
              >
                {/* ТВОИ КАТЕГОРИИ */}
                <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 mb-24">
                  {categories.map((cat) => (
                    <Link key={cat.slug} href={`/catalog?cat=${cat.slug}`} className="group">
                      <motion.div 
                        whileHover={{ 
                          y: -8,
                          x: [0, -2, 2, -1, 2, 0],
                          transition: { duration: 0.2, repeat: Infinity }
                        }} 
                        className="relative px-4 py-2"
                      >
                        <span className="text-[12px] tracking-[0.6em] font-black text-white/30 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all uppercase italic">
                          {cat.name}
                        </span>
                        <motion.div 
                          className="mt-3 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#d67a9d] to-transparent group-hover:w-full transition-all duration-1000 mx-auto" 
                        />
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* НОВЫЙ БЛОК НОВОСТЕЙ (ДОБАВЛЕН В КОНЕЦ ТАБА 'MAIN') */}
                {dbNews.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                    {dbNews.map((item) => (
                      <div key={item.id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-sm group hover:border-[#d67a9d]/50 transition-all">
                        {item.image_url && (
                          <img src={item.image_url} className="w-full h-48 object-cover rounded-3xl mb-6 opacity-80 group-hover:opacity-100 transition-all" />
                        )}
                        <h3 className="text-2xl font-black italic uppercase text-[#d67a9d] mb-2">{item.title}</h3>
                        <p className="text-white/60 font-bold uppercase text-[10px] tracking-widest leading-relaxed">{item.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'bonuses' && (
              <motion.div 
                key="bonuses"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.6 }}
              >
                <BonusSystem />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}