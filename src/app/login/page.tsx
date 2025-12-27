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
      // ВХОД
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        alert(error.message)
      } else {
        router.push('/') // Перекидываем на главную
        router.refresh()
      }
    } else {
      // РЕГИСТРАЦИЯ
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) alert(error.message)
      else alert('Check your email for confirmation!')
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-3xl"
      >
        <h1 className="text-3xl font-black italic text-white mb-8 uppercase tracking-tighter text-center">
          {isLogin ? 'Auth_Protocol' : 'New_Agent_Registration'}
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" placeholder="EMAIL" required
            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d67a9d] transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="PASSWORD" required
            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d67a9d] transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#71b3c9] transition-all"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign_In' : 'Register_Now'}
          </button>
        </form>

        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-[8px] uppercase font-black text-white/30"><span className="bg-[#0a0a0a] px-2 text-white">Or_Connect_Via</span></div>
        </div>

        <button onClick={handleGoogleLogin} className="w-full bg-white/10 text-white py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-white/20 transition-all mb-6">
           <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="google" />
           Google_Account
        </button>

        <p className="text-center text-[10px] font-bold text-white/30 uppercase">
          {isLogin ? "No account?" : "Already a member?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-[#d67a9d] hover:underline">
            {isLogin ? "Create_One" : "Login_Instead"}
          </button>
        </p>
      </motion.div>
    </div>
  )
}