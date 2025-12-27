'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#050505] border-t border-white/5 pt-20 pb-10 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          {/* Левая часть */}
          <div className="md:col-span-5">
            <h2 className="text-4xl font-black tracking-tighter mb-6 text-white uppercase italic">
              VSGIGA<span className="text-[#d67a9d]">_SHOP</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium">
              Технологический лидер в сфере электронной коммерции. 
              Мы создаем будущее покупок уже сегодня. V11.0 Build 2025.
            </p>
          </div>

          {/* Колонки меню с твоим голубым цветом #71b3c9 */}
          <div className="md:col-span-2">
            <h3 className="text-[#71b3c9] font-bold uppercase text-[11px] tracking-[0.2em] mb-8">Компания</h3>
            <ul className="space-y-4 text-[13px] text-gray-400 font-medium">
              <li><Link href="/about" className="hover:text-[#d67a9d] transition">О нас</Link></li>
              <li><Link href="/careers" className="hover:text-[#d67a9d] transition">Карьера</Link></li>
              <li><Link href="/press" className="hover:text-[#d67a9d] transition">Пресс-центр</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-[#71b3c9] font-bold uppercase text-[11px] tracking-[0.2em] mb-8">Помощь</h3>
            <ul className="space-y-4 text-[13px] text-gray-400 font-medium">
              <li><Link href="/shipping" className="hover:text-[#d67a9d] transition">Доставка</Link></li>
              <li><Link href="/returns" className="hover:text-[#d67a9d] transition">Возврат</Link></li>
              <li><Link href="/warranty" className="hover:text-[#d67a9d] transition">Гарантия</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[#71b3c9] font-bold uppercase text-[11px] tracking-[0.2em] mb-8">Социальные сети</h3>
            <ul className="space-y-4 text-[13px] text-gray-400 font-medium">
              <li><a href="https://t.me/vsgiga" target="_blank" className="hover:text-[#d67a9d] transition">Telegram</a></li>
              <li><a href="#" className="hover:text-[#d67a9d] transition">YouTube</a></li>
              <li><a href="#" className="hover:text-[#d67a9d] transition">VKontakte</a></li>
            </ul>
          </div>
        </div>

        {/* Нижняя полоса */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">
            © 2025 VSGIGA CORPORATION. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-[0.3em]">
            DESIGNED WITH <span className="text-[#d67a9d]">❤</span> BY VSGIGA TEAM.
          </div>
        </div>
      </div>
    </footer>
  )
}