'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        alert(error.message)
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) alert(error.message)
      else alert('Проверьте почту для подтверждения регистрации!')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0a0a0a] p-8 md:p-10 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,1)]"
      >
        {/* ОБНОВЛЕННЫЙ НЕОНОВЫЙ ЗАГОЛОВОК */}
        <motion.h1 
          key={isLogin ? 'login' : 'reg'}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.7, 1, 0.8, 1, 0.7],
            textShadow: [
              "0 0 10px #d67a9d, 0 0 20px #d67a9d",
              "0 0 20px #d67a9d, 0 0 40px #d67a9d",
              "0 0 10px #d67a9d, 0 0 20px #d67a9d"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-3xl md:text-4xl font-black italic text-[#d67a9d] mb-10 uppercase tracking-tighter text-center leading-tight"
        >
          {isLogin ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}
        </motion.h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
             <p className="text-[8px] font-black text-white/20 ml-4 uppercase tracking-[0.2em]">User_Email</p>
             <input 
              type="email" placeholder="ПОЧТА" required
              className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl outline-none text-white focus:border-[#d67a9d]/50 focus:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-widest"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
             <p className="text-[8px] font-black text-white/20 ml-4 uppercase tracking-[0.2em]">Access_Key</p>
             <input 
              type="password" placeholder="ПАРОЛЬ" required
              className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl outline-none text-white focus:border-[#d67a9d]/50 focus:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-widest"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-5 mt-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#d67a9d] hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? 'ЗАГРУЗКА...' : isLogin ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
          </button>
        </form>

        <div className="relative py-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[8px] uppercase font-black text-white/20">
            <span className="bg-[#0a0a0a] px-4 tracking-[0.3em]">ИЛИ_ЧЕРЕЗ</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-white/5 text-white py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 border border-white/5 transition-all mb-8"
        >
           <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="google" />
           GOOGLE_ID
        </button>

        <div className="flex flex-col items-center gap-2">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
            {isLogin ? "НЕТ АККАУНТА?" : "УЖЕ ЕСТЬ АККАУНТ?"}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[#d67a9d] text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all underline underline-offset-4"
          >
            {isLogin ? "СОЗДАТЬ НОВЫЙ" : "ВЕРНУТЬСЯ КО ВХОДУ"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}