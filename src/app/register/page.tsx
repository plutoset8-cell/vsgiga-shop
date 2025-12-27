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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Декоративные фоновые элементы (Неоновые пятна) */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#d67a9d]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#71b3c9]/20 rounded-full blur-[120px] animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          <div className="mb-8 text-center">
            {/* Заголовок с неоновым свечением и адаптивным размером */}
            <h1 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              {isLogin ? (
                <>Welcome_<span className="text-[#d67a9d] drop-shadow-[0_0_10px_#d67a9d]">Back</span></>
              ) : (
                <>Join_The_<span className="text-[#71b3c9] drop-shadow-[0_0_10px_#71b3c9]">Giga</span></>
              )}
            </h1>
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.4em]">
              {isLogin ? 'Identity_Verification' : 'Creation_Protocol'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="EMAIL_ADDRESS" 
                required
                className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none text-white text-sm font-medium focus:border-[#d67a9d]/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="ACCESS_PASSWORD" 
                required
                className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none text-white text-sm font-medium focus:border-[#71b3c9]/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#d67a9d] hover:text-white transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Authorize_Session' : 'Initialize_Account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[7px] uppercase font-black text-white/30">
              <span className="bg-[#050505] px-4">Secure_Oauth_Bridge</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white/[0.03] border border-white/5 text-white py-4 rounded-2xl font-bold uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all mb-6 border-pink-500/10 hover:border-pink-500/30"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="google" />
            Continue_with_Google
          </button>

          <p className="text-center text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
            {isLogin ? "No account?" : "Already a member?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-[#71b3c9] hover:text-[#d67a9d] transition-colors border-b border-[#71b3c9]/30"
            >
              {isLogin ? "Generate_One" : "Login_Here"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}