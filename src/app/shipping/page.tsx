'use client'
import Scene from '@/components/canvas/Scene'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function InfoPage() {
  const path = usePathname()
  const titles: Record<string, string> = {
    '/about': 'О БРЕНДЕ VSGIGA',
    '/shipping': 'ИНФОРМАЦИЯ О ДОСТАВКЕ',
    '/returns': 'УСЛОВИЯ ВОЗВРАТА'
  }

  return (
    <main className="relative min-h-screen pt-32 pb-20 px-6">
      <Scene />
      <div className="container mx-auto max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h1 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase italic">
            {titles[path] || 'ИНФОРМАЦИЯ'}
          </h1>
          <div className="space-y-6 text-gray-400 leading-relaxed font-medium">
            <p className="text-[#71b3c9] text-lg italic">"Мы меняем представление о цифровом ритейле."</p>
            <p>Добро пожаловать в **vsgiga shop**. В 2025 году мы поставили цель объединить высокую моду и передовые технологии.</p>
            <p>Все процессы в VSGIGA_ENTERPRISE автоматизированы, чтобы вы получали лучшие товары в кратчайшие сроки. Мы ценим каждого клиента и гарантируем качество каждого шва.</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}