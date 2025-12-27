'use client'
import { motion } from 'framer-motion'
import Scene from '@/components/canvas/Scene'
import Link from 'next/link'

export default function AuthPage() {
  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center p-6">
      <Scene />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">
            ACCESS<span className="text-[#71b3c9]">_GRANTED</span>
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Войдите в систему vsgiga</p>
        </div>

        <form className="space-y-6">
          <div>
            <input 
              type="email" 
              placeholder="EMAIL_ADDRESS"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 outline-none focus:border-[#d67a9d] transition-colors font-bold text-xs"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="SECURE_PASSWORD"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 outline-none focus:border-[#d67a9d] transition-colors font-bold text-xs"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-white/5 hover:bg-[#d67a9d] hover:text-white transition-all"
          >
            ENTER_DATABASE
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/auth" className="text-white/30 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors">
            Еще нет аккаунта? <span className="text-[#71b3c9]">Регистрация</span>
          </Link>
        </div>
      </motion.div>
    </main>
  )
}