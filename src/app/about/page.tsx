'use client'
import { motion } from 'framer-motion'
import Scene from '@/components/canvas/Scene'
import Link from 'next/link'

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        delayChildren: 0.3, 
        staggerChildren: 0.2,
        duration: 0.8,
        ease: "easeOut"
      } 
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* ФОН: Фикс снега (масштаб + виньетка) */}
      <div className="absolute inset-0 z-0 scale-[1.02]">
        <Scene />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      <motion.section 
        className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* ЗАГОЛОВОК: Фикс линии и обрезки текста */}
        <motion.div 
          className="relative mb-16 flex flex-col items-center"
          variants={itemVariants}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-center relative overflow-visible px-4">
            <span className="relative inline-block pr-6 bg-clip-text text-transparent bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-white filter drop-shadow-[0_0_30px_rgba(214,122,157,0.5)]">
              О НАС
            </span>
          </h1>
          {/* ИСПРАВЛЕННАЯ ЛИНИЯ: Теперь она внутри flex-контейнера и центрируется автоматически */}
          <motion.div 
            className="h-[2px] bg-gradient-to-r from-transparent via-[#d67a9d] to-transparent mt-4 w-[200px] md:w-[300px]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "circOut" }}
          />
        </motion.div>

        {/* ОСНОВНОЙ КОНТЕНТНЫЙ БЛОК */}
        <motion.div 
          className="max-w-4xl mx-auto bg-gradient-to-br from-black/90 to-[#0f0a1a]/90 border-[1.5px] border-[#d67a9d]/30 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Внутреннее неоновое свечение */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              className="absolute top-0 right-0 w-64 h-64 bg-[#d67a9d]/10 rounded-full blur-[100px]"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </div>

          <motion.p 
            className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 font-medium z-10 relative"
            variants={itemVariants}
          >
            В <span className="text-[#d67a9d] font-black italic tracking-wider">vsgiga shop</span> мы не просто продаем одежду — мы создаем культуру. Мы погружаемся в мир, где уличный стиль встречается с футуристической эстетикой, а твой образ — это манифест.
          </motion.p>

          <motion.h2 
            className="text-3xl md:text-4xl font-black tracking-tight italic text-[#71b3c9] mb-6 mt-10 z-10 relative"
            variants={itemVariants}
          >
            Эстетика Viper, Opium & Y2K
          </motion.h2>

          <div className="space-y-6 z-10 relative">
            <motion.div variants={itemVariants} className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <p className="text-white/80 leading-relaxed">
                <span className="text-[#d67a9d] font-bold uppercase tracking-widest block mb-2">Viper</span>
                Мрачная романтика и дерзость улиц. Графичные принты, функциональный крой и доминирование черного с ядовитыми акцентами.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <p className="text-white/80 leading-relaxed">
                <span className="text-[#71b3c9] font-bold uppercase tracking-widest block mb-2">Opium</span>
                Элегантный андеграунд. Свободные силуэты, деконструктивизм и многослойность для тех, кто ценит сложную эстетику.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <p className="text-white/80 leading-relaxed">
                <span className="text-white font-bold uppercase tracking-widest block mb-2">Y2K</span>
                Ностальгия по цифровому будущему. Металлик, смелые лого и оверсайз, переосмысленный для нового поколения.
              </p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="text-center mt-12">
            <Link href="/catalog">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(214, 122, 157, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#d67a9d] to-[#4b0082] text-white font-black py-4 px-10 rounded-2xl shadow-lg uppercase tracking-[0.2em] text-sm italic"
              >
                Начать ШОППИНГ
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* На главную */}
        <motion.div variants={itemVariants} className="mt-16 z-10">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, color: "#fff" }}
              whileTap={{ scale: 0.95 }}
              className="text-white/40 text-xs md:text-sm uppercase font-black tracking-[0.3em] italic py-2 px-6 border-b border-white/10 hover:border-[#d67a9d] transition-all"
            >
              Вернуться назад
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>
    </main>
  )
}