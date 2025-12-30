'use client'
import { motion } from 'framer-motion'
import Scene from '@/components/canvas/Scene'
import Link from 'next/link'

export default function ContactsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, duration: 0.6 } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* ФОН: Фикс снега и виньетка */}
      <div className="absolute inset-0 z-0 scale-[1.02]">
        <Scene />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <motion.section 
        className="relative flex flex-col items-center justify-center min-h-screen px-4 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ЗАГОЛОВОК */}
        <motion.h1 
          className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-center mb-12 overflow-visible"
          variants={itemVariants}
        >
          <span className="relative inline-block pr-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-[#d67a9d] filter drop-shadow-[0_0_20px_rgba(214,122,157,0.3)]">
            КОНТАКТЫ
          </span>
        </motion.h1>

        {/* СЕТКА С КОНТАКТАМИ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          
          {/* МЕНЕДЖЕР (СВЯЗЬ) */}
          <motion.a 
            href="https://t.me/MERCY_SKAM" 
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{ scale: 1.02, borderColor: '#d67a9d' }}
            whileTap={{ scale: 0.98 }}
            className="group relative p-8 bg-white/5 backdrop-blur-md border-[1px] border-white/10 rounded-[2rem] transition-all duration-500 overflow-hidden cursor-pointer"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-[#d67a9d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <h3 className="text-[#d67a9d] font-black italic tracking-widest text-sm mb-2">MANAGER</h3>
             <p className="text-2xl font-bold tracking-tight">@MERCY_SKAM</p>
             <div className="mt-4 text-xs text-white/40 group-hover:text-white/80 transition-colors uppercase tracking-widest font-black italic">
               Написать менеджеру напрямую →
             </div>
          </motion.a>

          {/* TELEGRAM CHANNEL (НОВОСТИ) */}
          <motion.a 
            href="https://t.me/vsgiga" 
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{ scale: 1.02, borderColor: '#d67a9d' }}
            whileTap={{ scale: 0.98 }}
            className="group relative p-8 bg-white/5 backdrop-blur-md border-[1px] border-white/10 rounded-[2rem] transition-all duration-500 overflow-hidden cursor-pointer"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-[#d67a9d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <h3 className="text-[#d67a9d] font-black italic tracking-widest text-sm mb-2">NEWS CHANNEL</h3>
             <p className="text-2xl font-bold tracking-tight">VSGIGA CHANNEL</p>
             <div className="mt-4 text-xs text-white/40 group-hover:text-white/80 transition-colors uppercase tracking-widest font-black italic">
               Следить за новыми дропами →
             </div>
          </motion.a>

          {/* EMAIL (На весь ряд) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 relative p-8 bg-white/5 backdrop-blur-md border-[1px] border-white/10 rounded-[2rem] overflow-hidden group hover:border-white/20 transition-colors"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50" />
             <h3 className="text-[#d67a9d] font-black italic tracking-widest text-sm mb-2 relative z-10">SUPPORT / BUSINESS EMAIL</h3>
             <p className="text-2xl md:text-3xl font-bold tracking-tight relative z-10 select-all">plutoset8@gmail.com</p>
          </motion.div>

        </div>

        {/* ДОПОЛНИТЕЛЬНАЯ ИНФА */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase italic leading-loose">
            Support: 10:00 — 22:00 <br/>
            Worldwide delivery within 7-14 days
          </p>
        </motion.div>

        {/* КНОПКА НАЗАД */}
        <motion.div variants={itemVariants} className="mt-16">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-[#d67a9d] transition-all uppercase text-[10px] font-black tracking-[0.3em] italic"
            >
              Вернуться в главное меню
            </motion.button>
          </Link>
        </motion.div>

      </motion.section>
    </main>
  )
}
