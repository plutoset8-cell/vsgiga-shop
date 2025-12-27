'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
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
      if (error) alert(error.message)
      else router.push('/')
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) alert(error.message)
      else alert('Check your email for the confirmation link!')
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Декоративные фоновые элементы */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#d67a9d]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#71b3c9]/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">
              {isLogin ? 'Welcome_Back' : 'Join_The_Giga'}
            </h1>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">
              {isLogin ? 'Identity_Verification' : 'Creation_Protocol'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="EMAIL_ADDRESS" 
                required
                className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl outline-none text-white font-medium focus:border-[#d67a9d]/50 focus:bg-black/60 transition-all placeholder:text-white/10"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="ACCESS_PASSWORD" 
                required
                className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl outline-none text-white font-medium focus:border-[#71b3c9]/50 focus:bg-black/60 transition-all placeholder:text-white/10"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#d67a9d] hover:text-white transition-all shadow-lg shadow-white/5 active:scale-95"
            >
              {loading ? 'Processing...' : isLogin ? 'Authorize_Session' : 'Initialize_Account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[8px] uppercase font-black text-white/20">
              <span className="bg-[#0a0a0a] px-3">Secure_Oauth_Bridge</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white/[0.05] border border-white/5 text-white py-4 rounded-2xl font-bold uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all mb-6"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="google" />
            Continue_with_Google
          </button>

          <p className="text-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
            {isLogin ? "No account?" : "Already a member?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-[#71b3c9] hover:text-white underline underline-offset-4 transition-colors"
            >
              {isLogin ? "Generate_One" : "Login_Here"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}