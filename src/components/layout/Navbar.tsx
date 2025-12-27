'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'
import SearchBar from './SearchBar'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { totalItems } = useCart()
  const controls = useAnimation()

  const ADMIN_EMAIL = 'plutoset8@gmail.com'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (totalItems > 0) {
      controls.start({
        scale: [1, 1.2, 1],
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.4 }
      })
    }
  }, [totalItems, controls])

  const btnHover = { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] px-4 md:px-10 py-6 flex justify-between items-center bg-transparent backdrop-blur-[4px]">
        
        {/* ЛОГОТИП С МОЩНЫМ НЕОНОВЫМ СВЕЧЕНИЕМ */}
        <Link href="/" className="relative flex items-center group">
          <div className="absolute -top-[15px] -left-[12px] w-8 h-8 pointer-events-none z-20">
            <img 
              src="/santa-hat.png" 
              alt="hat" 
              className="w-full h-full object-contain -rotate-[15deg] group-hover:rotate-0 transition-all duration-500" 
            />
          </div>
          
          <motion.div 
            animate={{ 
              filter: [
                "drop-shadow(0 0 8px rgba(214, 122, 157, 0.4))",
                "drop-shadow(0 0 20px rgba(214, 122, 157, 0.8))",
                "drop-shadow(0 0 8px rgba(214, 122, 157, 0.4))"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl font-black tracking-tighter text-white uppercase italic relative z-10 pr-4"
          >
            <span style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>VSGIGA</span>
            <span 
              className="text-[#d67a9d]"
              style={{ 
                textShadow: `
                  0 0 7px #d67a9d,
                  0 0 15px #d67a9d,
                  0 0 30px #d67a9d,
                  0 0 45px rgba(214, 122, 157, 0.5)
                `
              }}
            >
              _SHOP
            </span>
          </motion.div>
        </Link>

        {/* ЦЕНТРАЛЬНОЕ МЕНЮ */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/catalog" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors relative group">
            КАТАЛОГ
            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d67a9d] group-hover:w-full transition-all duration-300" />
          </Link>
          
          <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors relative group">
            О НАС
            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d67a9d] group-hover:w-full transition-all duration-300" />
          </Link>

          <Link href="/contacts" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors relative group">
            КОНТАКТЫ
            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d67a9d] group-hover:w-full transition-all duration-300" />
          </Link>

          {user?.email === ADMIN_EMAIL && (
            <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d67a9d] hover:text-white transition-colors relative group border border-[#d67a9d]/30 px-3 py-1 rounded-md bg-[#d67a9d]/5">
              ADMIN_PANEL
              <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
            </Link>
          )}

          <Suspense fallback={<div className="ml-4 w-32 h-8 bg-white/5 rounded-full animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/cart">
            <motion.button 
              {...btnHover} 
              animate={controls} 
              className="relative text-white font-bold text-[9px] tracking-widest uppercase flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 transition-colors group"
            >
              CART 
              <span className="relative">
                <span className="bg-[#d67a9d] text-white px-1.5 py-0.5 rounded text-[8px] font-black min-w-[18px] text-center shadow-lg shadow-[#d67a9d]/20 relative z-10">
                  {totalItems || 0}
                </span>
                {totalItems > 0 && (
                   <motion.span 
                    key={totalItems}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    className="absolute inset-0 bg-[#d67a9d] rounded-full z-0"
                   />
                )}
              </span>
            </motion.button>
          </Link>
          
          <div className="flex gap-4 items-center border-l border-white/10 pl-6">
            {user ? (
              <Link href="/profile" className="flex items-center gap-3 group">
                <div className="hidden lg:block text-right">
                  <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none truncate max-w-[80px]">
                    {user.user_metadata?.full_name || user.email.split('@')[0]}
                  </p>
                  <p className="text-[7px] font-bold text-[#71b3c9] uppercase tracking-widest">Online_</p>
                </div>
                <motion.div 
                    {...btnHover}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d67a9d] to-[#71b3c9] p-[2px]"
                >
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        <img 
                          src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=d67a9d&color=fff`} 
                          className="w-full h-full object-cover" 
                          alt="profile" 
                        />
                    </div>
                </motion.div>
              </Link>
            ) : (
              <Link href="/login">
                <motion.button
                  {...btnHover}
                  className="text-[9px] font-black uppercase tracking-widest border border-white/20 px-5 py-2.5 rounded-xl hover:bg-white hover:text-black transition-all"
                >
                  Sign_In
                </motion.button>
              </Link>
            )}
          </div>

          <div className="md:hidden text-white cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
             </svg>
          </div>
        </div>
      </nav>
    </>
  )
}