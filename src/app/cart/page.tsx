'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight,
  ShoppingCart, ShieldCheck, AlertCircle, CheckCircle2, X,
  Truck, Package, Coins, MapPin, User, Phone, Ticket, Zap,
  Layers, Activity, Terminal, Lock, Cpu, Globe, Hash, Database, Server, Radio,
  Snowflake, Gift, Star, Sparkles, ZapIcon, Github, Twitter, Instagram,
  Scan, MousePointer2, Binary, Fingerprint, Eye, Code, HardDrive, BarChart3, Wifi,
  Bell, Clock, CreditCard, Download, Upload, Shield, Key, Cloud,
  Heart, Music, Video, Image, Mail, MessageSquare, ThumbsUp,
  Battery, BatteryCharging, BatteryFull, AlertTriangle,
  Wind, Umbrella, Sun, Moon, CloudRain, CloudSnow
} from 'lucide-react'

// ======================================================================
// [SYSTEM_COMPONENT_01]: XMAS_PHYSICS_ENGINE_v3.0 (Улучшенный)
// ======================================================================
function XmasSnowBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Основные снежинки */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={`snow-${i}`}
          initial={{ 
            y: -50, 
            x: Math.random() * window.innerWidth, 
            opacity: 0, 
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: window.innerHeight + 100,
            x: (Math.random() * window.innerWidth) + (Math.cos(i) * 200),
            opacity: [0, 0.8, 0.8, 0],
            rotate: 1080,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 30,
            repeatDelay: Math.random() * 5
          }}
          className="absolute text-white/20"
        >
          <Snowflake size={Math.random() * 20 + 8} />
        </motion.div>
      ))}
      
      {/* Мелкие снежинки */}
      {[...Array(80)].map((_, i) => (
        <motion.div
          key={`snow-small-${i}`}
          initial={{ 
            y: Math.random() * -100, 
            x: Math.random() * window.innerWidth,
            opacity: 0 
          }}
          animate={{
            y: window.innerHeight + 50,
            x: (Math.random() * 100) - 50,
            opacity: [0, 0.4, 0]
          }}
          transition={{
            duration: Math.random() * 25 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 40
          }}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
        />
      ))}
      
      {/* Блестки */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          initial={{ 
            y: Math.random() * window.innerHeight,
            x: Math.random() * window.innerWidth,
            opacity: 0,
            scale: 0 
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: 360
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            repeatDelay: Math.random() * 10 + 5
          }}
          className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"
        />
      ))}
    </div>
  )
}

// ======================================================================
// [SYSTEM_COMPONENT_02]: INTERACTIVE_HOLIDAY_GARLAND (Улучшенный)
// ======================================================================
function XmasGarland() {
  return (
    <div className="absolute top-0 left-0 w-full h-48 pointer-events-none z-40 flex justify-around overflow-hidden">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [i % 2 === 0 ? 8 : -8, i % 2 === 0 ? -8 : 8, i % 2 === 0 ? 8 : -8],
            y: [0, 12, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4 + (i % 3), 
            ease: "easeInOut", 
            delay: i * 0.12 
          }}
          className="origin-top flex flex-col items-center"
        >
          <motion.div
            animate={{
              height: [80, 120, 80],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
            className="w-[1.5px] h-24 bg-gradient-to-b from-white/30 via-white/10 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          />
          <motion.div
            animate={{
              boxShadow: i % 4 === 0
                ? ["0 0 5px #ff007a", "0 0 40px #ff007a", "0 0 5px #ff007a"]
                : i % 4 === 1
                ? ["0 0 5px #00f2ff", "0 0 40px #00f2ff", "0 0 5px #00f2ff"]
                : i % 4 === 2
                ? ["0 0 5px #ffd700", "0 0 40px #ffd700", "0 0 5px #ffd700"]
                : ["0 0 5px #00ff88", "0 0 40px #00ff88", "0 0 5px #00ff88"],
              scale: [1, 1.4, 1],
              opacity: [0.5, 1, 0.5],
              y: [0, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3 }}
            className={`w-6 h-6 rounded-full ${i % 4 === 0 ? 'bg-[#ff007a]' : i % 4 === 1 ? 'bg-[#00f2ff]' : i % 4 === 2 ? 'bg-[#ffd700]' : 'bg-[#00ff88]'}`}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ======================================================================
// [SYSTEM_COMPONENT_03]: NEURAL_LINK_STREAM_VISUALIZER (Улучшенный)
// ======================================================================
function CyberStreamVisualizer() {
  return (
    <div className="w-full py-32 border-t border-b border-white/5 bg-gradient-to-r from-black via-[#ff007a]/10 to-black overflow-hidden relative group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,122,0.05),transparent_70%)]" />
      <div className="flex justify-around items-end h-52 gap-[3px] px-4">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: [20, Math.random() * 180 + 30, 20],
              backgroundColor: 
                i % 20 === 0 ? "#ff007a" : 
                i % 15 === 0 ? "#00f2ff" : 
                i % 10 === 0 ? "#ffd700" : 
                "rgba(255,255,255,0.12)",
              filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 1.5 + 1,
              ease: "easeInOut",
              delay: i * 0.02
            }}
            className="flex-1 rounded-t-full relative overflow-hidden"
          >
            <motion.div
              animate={{ y: ["0%", "100%"] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 1, 0, -1, 0]
          }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="px-16 py-4 bg-black/95 backdrop-blur-3xl border border-[#ff007a]/50 rounded-full shadow-[0_0_60px_rgba(255,0,122,0.3)]"
        >
          <div className="flex items-center gap-6">
            <Activity className="text-[#ff007a] animate-pulse" size={20} />
            <span className="text-[13px] font-black uppercase tracking-[0.8em] text-[#ff007a]">Neural_Link_Streaming_Active</span>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-2 bg-[#ff007a] rounded-full"
            />
          </div>
        </motion.div>
      </div>
      
      {/* Плавающие частицы */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          animate={{
            x: [0, Math.sin(i) * 400, 0],
            y: [0, Math.cos(i) * 200, 0],
            rotate: 360
          }}
          transition={{
            repeat: Infinity,
            duration: 20 + i * 2,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-[#ff007a]/30 rounded-full"
        />
      ))}
    </div>
  )
}

// ======================================================================
// [NEW_COMPONENT]: CHRISTMAS_TREE_ANIMATION
// ======================================================================
function ChristmasTreeAnimation() {
  return (
    <div className="fixed right-8 bottom-32 z-40 pointer-events-none">
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 2, 0, -2, 0]
        }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="relative w-32 h-48"
      >
        {/* Ствол */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-20 bg-amber-900 rounded-t-lg" />
        
        {/* Ветви */}
        {[0, 1, 2, 3].map((level) => (
          <motion.div
            key={level}
            animate={{ 
              scale: [1, 1.05, 1],
              filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
            }}
            transition={{ repeat: Infinity, duration: 4, delay: level * 0.5 }}
            className={`absolute bottom-${level * 10 + 20} left-1/2 -translate-x-1/2 w-${(level + 1) * 24} h-10 bg-green-600 rounded-full`}
          />
        ))}
        
        {/* Гирянды */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`light-${i}`}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
            className={`absolute w-2 h-2 rounded-full ${
              i % 3 === 0 ? 'bg-red-500' :
              i % 3 === 1 ? 'bg-blue-500' : 'bg-yellow-500'
            }`}
            style={{
              left: `${50 + Math.sin(i) * 40}%`,
              top: `${30 + (i % 4) * 15}%`
            }}
          />
        ))}
        
        {/* Звезда на верхушке */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.3, 1]
          }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Star className="text-yellow-400" size={24} fill="currentColor" />
        </motion.div>
        
        {/* Подарки под елкой */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
        >
          <div className="w-10 h-8 bg-red-600 rounded" />
          <div className="w-8 h-10 bg-green-600 rounded" />
          <div className="w-12 h-6 bg-blue-600 rounded" />
        </motion.div>
      </motion.div>
    </div>
  )
}

// ======================================================================
// [NEW_COMPONENT]: FLOATING_HOLIDAY_ICONS (ИСПРАВЛЕННЫЙ)
// ======================================================================
function FloatingHolidayIcons() {
  const icons = [Gift, Star, Snowflake, Heart, Bell, Music];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: 0,
            scale: 0
          }}
          animate={{
            y: [0, -100, 0] as any, // Исправлено: явное приведение типа
            x: [0, Math.sin(index) * 50, 0] as any, // Исправлено: явное приведение типа
            rotate: 360,
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 20 + index * 2,
            repeat: Infinity,
            delay: index * 3,
            ease: "linear"
          }}
          className="absolute"
        >
          <Icon className={`text-${
            index % 3 === 0 ? '[#ff007a]' : 
            index % 3 === 1 ? '[#00f2ff]' : 
            '[#ffd700]'
          }/20`} size={24} />
        </motion.div>
      ))}
    </div>
  )
}


// ======================================================================
// [NEW_COMPONENT]: CYBER_RAIN_ANIMATION
// ======================================================================
function CyberRainAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`rain-${i}`}
          initial={{
            y: -50,
            x: Math.random() * window.innerWidth,
            opacity: 0
          }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className="absolute w-[1px] h-20 bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent"
        />
      ))}
    </div>
  )
}

// ======================================================================
// [SYSTEM_COMPONENT_04]: BIO_INTEGRITY_SCANNER (Улучшенный)
// ======================================================================
function BioCoreStatus() {
  const [pulse, setPulse] = useState(74);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full p-16 bg-[#050505] border-2 border-white/10 rounded-[4.5rem] flex flex-col lg:flex-row items-center gap-20 mb-24 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff007a]/5 via-transparent to-[#00f2ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-[#ff007a]/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute inset-4 border border-[#00f2ff]/20 rounded-full"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 20px rgba(255,0,122,0.3)",
              "0 0 40px rgba(255,0,122,0.5)",
              "0 0 20px rgba(255,0,122,0.3)"
            ]
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="relative z-10 p-10 bg-gradient-to-br from-[#ff007a]/10 to-[#00f2ff]/10 rounded-full backdrop-blur-sm"
        >
          <Fingerprint size={64} className="text-[#ff007a]" />
        </motion.div>
      </div>
      
      <div className="flex-1 space-y-8 text-center lg:text-left">
        <div className="flex items-center gap-6 justify-center lg:justify-start">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter bg-gradient-to-r from-[#ff007a] to-[#00f2ff] bg-clip-text text-transparent">
            User_Integrity_Scanner
          </h2>
          <motion.span
            animate={{ 
              opacity: [1, 0.7, 1],
              scale: [1, 1.05, 1]
            }}
            className="px-5 py-2 bg-green-500/20 text-green-400 text-[11px] font-black rounded-full border border-green-500/40 shadow-[0_0_20px_rgba(0,255,0,0.2)]"
          >
            VERIFIED_AUTH
          </motion.span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Pulse_Rate", val: `${pulse}_BPM`, color: "text-white", icon: Activity },
            { label: "Neural_Load", val: "18.4%", color: "text-[#ff007a]", icon: Cpu },
            { label: "Sync_Quality", val: "0.998", color: "text-green-500", icon: Wifi },
            { label: "Protocol", val: "OPIUM_v6", color: "text-blue-400", icon: Lock }
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl hover:bg-white/[0.06] transition-all backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <stat.icon size={16} className={stat.color} />
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{stat.label}</p>
              </div>
              <p className={`text-lg font-black font-mono ${stat.color}`}>{stat.val}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="shrink-0 w-full lg:w-auto">
        <motion.button
          whileHover={{ 
            scale: 1.08, 
            backgroundColor: '#ff007a', 
            color: '#fff',
            boxShadow: "0 0 40px rgba(255,0,122,0.5)"
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full lg:w-auto px-14 py-7 bg-white/5 border-2 border-white/10 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.3em] transition-all group/btn relative overflow-hidden"
        >
          <span className="relative z-10">System_Recalibrate</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
        </motion.button>
      </div>
    </div>
  )
}

// ======================================================================
// [SYSTEM_COMPONENT_05]: CYBER_TERMINAL_v7.0 (MINIMIZABLE) (Улучшенный)
// ======================================================================
function CyberTerminalHUD({ isVisible, onHide }: { isVisible: boolean, onHide: () => void }) {
  const [logs, setLogs] = useState<string[]>([
    "BOOTING_VSGIGA_OS_v6.5...",
    "HANDSHAKE_NODE_STABLE",
    "ENCRYPTING_MANIFEST...",
    "XMAS_PROTOCOL_LOADED",
    "SYSTEM_CHECK: 100%_OK"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        `DATA_SYNC: ${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
        `TEMP: ${(36 + Math.random() * 8).toFixed(1)}°C`,
        `NODE_${Math.floor(Math.random() * 99)}: ONLINE`,
        `DB_LATENCY: ${Math.floor(Math.random() * 20 + 5)}ms`,
        `OPIUM_SEC: ACTIVE`,
        `PACKET_LOSS: 0.00%`,
        `MEM_USAGE: ${Math.floor(Math.random() * 30 + 50)}%`,
        `NET_SPEED: ${Math.floor(Math.random() * 900 + 100)}Mbps`,
        `ENCRYPTION: AES-256-GCM`,
        `SESSION_ID: ${Math.random().toString(36).substr(2, 12).toUpperCase()}`
      ];
      setLogs(prev => [...prev.slice(-8), messages[Math.floor(Math.random() * messages.length)]]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return (
    <motion.button
      whileHover={{ 
        scale: 1.15, 
        boxShadow: "0 0 40px #ff007a",
        rotate: 5
      }}
      whileTap={{ scale: 0.9 }}
      onClick={onHide}
      className="fixed left-12 bottom-12 z-[100] p-7 bg-black/90 border-2 border-[#ff007a] text-[#ff007a] rounded-[2rem] shadow-2xl backdrop-blur-xl group"
    >
      <Terminal size={30} className="group-hover:animate-pulse" />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
      />
    </motion.button>
  );

  return (
    <div className="hidden xl:block fixed left-12 bottom-12 z-[100]">
      <motion.div
        initial={{ x: -400, opacity: 0, scale: 0.9 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: -400, opacity: 0, scale: 0.9 }}
        className="w-[480px] bg-black/95 border-2 border-white/10 border-l-4 border-l-[#ff007a] p-12 backdrop-blur-3xl relative shadow-[100px_0_200px_rgba(0,0,0,0.9)] rounded-r-[4rem] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff007a]/5 via-transparent to-[#00f2ff]/5" />
        
        <button 
          onClick={onHide} 
          className="absolute top-8 right-8 text-white/20 hover:text-[#ff007a] transition-colors z-20"
        >
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-6 mb-12 text-[#ff007a] relative z-10">
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="p-4 bg-[#ff007a]/10 rounded-2xl"
          >
            <Terminal size={28} />
          </motion.div>
          <div>
            <span className="text-[16px] font-black uppercase tracking-[0.4em] block italic">vsgiga_core</span>
            <span className="text-[10px] opacity-40 font-mono tracking-tighter">
              ID: {Math.random().toString(36).substr(2, 12).toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="space-y-4 font-mono relative z-10">
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 border-b border-white/[0.03] pb-3 group"
            >
              <span className="text-[10px] text-[#ff007a] opacity-60 font-bold">[{i.toString().padStart(2, '0')}]</span>
              <span className="text-[12px] text-white/60 uppercase tracking-tighter leading-none flex-1">
                {log}
              </span>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                className="w-1 h-1 bg-[#ff007a] rounded-full"
              />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center italic relative z-10">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-white/20 font-black tracking-widest uppercase">Kernel_v6.5.0</span>
            <div className="flex gap-1">
              <motion.div 
                animate={{ opacity: [1, 0.5, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5 }} 
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <div className="w-2 h-2 bg-[#ff007a] rounded-full" />
              <div className="w-2 h-2 bg-[#00f2ff] rounded-full" />
            </div>
          </div>
          <span className="text-[9px] text-white/10 font-mono">
            {new Date().toISOString().replace('T', ' ').substring(0, 19)}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

// ======================================================================
// [NEW_COMPONENT]: PAYMENT_SUCCESS_CONFETTI
// ======================================================================
function PaymentSuccessConfetti({ active }: { active: boolean }) {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[150]">
      {[...Array(150)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            rotate: 0,
            scale: 0
          }}
          animate={{
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 1000,
            y: window.innerHeight + 100,
            rotate: 720 + Math.random() * 360,
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            ease: "easeOut"
          }}
          className={`absolute w-3 h-3 rounded ${
            i % 5 === 0 ? 'bg-[#ff007a]' :
            i % 5 === 1 ? 'bg-[#00f2ff]' :
            i % 5 === 2 ? 'bg-[#ffd700]' :
            i % 5 === 3 ? 'bg-[#00ff88]' : 'bg-white'
          }`}
        />
      ))}
    </div>
  )
}

const Toast = ({ message, type, onClose }: { message: string, type: 'error' | 'success', onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 100, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    className={`fixed top-12 right-12 z-[100] flex items-center gap-6 p-8 min-w-[450px] rounded-[2.5rem] border-2 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.7)] ${type === 'error' 
      ? 'bg-red-500/20 border-red-500/40 text-red-400' 
      : 'bg-[#ff007a]/20 border-[#ff007a]/40 text-[#ff007a]'
    }`}
  >
    <div className="shrink-0 p-4 bg-white/5 rounded-2xl">
      {type === 'error' ? 
        <AlertCircle size={32} className="animate-pulse" /> : 
        <Zap size={32} className="animate-bounce" />
      }
    </div>
    <div className="flex-1">
      <p className="font-black uppercase italic text-[12px] tracking-[0.3em] mb-2">SYSTEM_ALGORITHM</p>
      <p className="text-[16px] font-bold text-white uppercase tracking-tight">{message}</p>
    </div>
    <button 
      onClick={onClose} 
      className="p-3 hover:bg-white/10 rounded-full transition-colors"
    >
      <X size={24} className="opacity-40 hover:opacity-100" />
    </button>
  </motion.div>
)

export default function CartPage() {
  // --- [STATE_MANAGEMENT: MAXIMUM_PRECISION] ---
  const [dbCart, setDbCart] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isHudVisible, setIsHudVisible] = useState(true)
  const [explosion, setExplosion] = useState(false)
  const { clearCart: contextClearCart } = useCart()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)
  const [showCheckoutFields, setShowCheckoutFields] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState<'mail' | 'pickup'>('mail')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [userBonuses, setUserBonuses] = useState(0)
  const [useBonuses, setUseBonuses] = useState(false)
  const [toasts, setToasts] = useState<{ id: number, message: string, type: 'error' | 'success' }[]>([])
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<any>(null)
  const [confettiActive, setConfettiActive] = useState(false)
  const router = useRouter()

  const addToast = useCallback((message: string, type: 'error' | 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000)
  }, [])

  // ======================================================================
  // [DATABASE_LOGIC]: ZERO_ZERO_SYNC (Фикс 0 при загрузке)
  // ======================================================================
  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      // Прямой запрос к базе с джоином продуктов
      const { data: cartData, error: cartError } = await supabase
        .from('cart')
        .select('*, product:products(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (cartError) {
        addToast('DATABASE_SYNC_ERROR', 'error')
        console.error('Cart fetch error:', cartError)
        setIsLoading(false)
        return
      }

      if (cartData) {
        const formattedCart = cartData
          .filter((item: any) => item.product !== null)
          .map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
            cartItemId: item.id
          }))
        setDbCart(formattedCart)
      }

      // Подгрузка бонусного счета из профиля VSGIGA
      const { data: profile } = await supabase
        .from('profiles')
        .select('bonuses')
        .eq('id', session.user.id)
        .single()

      if (profile) setUserBonuses(profile.bonuses || 0)

      // Искусственная задержка для красоты анимации инициализации
      setTimeout(() => setIsLoading(false), 800)
    }

    fetchCartData()
  }, [router, addToast])

  const totalItems = dbCart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalPrice = dbCart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
  
  // ======================================================================
  // [LOGIC_HANDLER_01]: QUANTITY_SYNC_PROTOCOL (Исправленный)
  // ======================================================================
  const handleUpdateQuantity = async (id: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta
    if (newQty < 1) return

    // Оптимистичное обновление UI
    setDbCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item))

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from('cart')
        .update({ quantity: newQty })
        .match({ user_id: user.id, product_id: id })

      if (error) {
        addToast('SYNC_QUANTITY_FAILED', 'error')
        console.error('Crit_Error: Quant_Update_Mismatch', error)
        // Откат UI при ошибке
        setDbCart(prev => prev.map(item => item.id === id ? { ...item, quantity: currentQty } : item))
      }
    }
  }

  // ======================================================================
  // [LOGIC_HANDLER_02]: OBJECT_DELETION_PROTOCOL (Исправленный)
  // ======================================================================
  const handleRemoveFromCart = async (id: string) => {
    setDbCart(prev => prev.filter(item => item.id !== id))
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from('cart')
        .delete()
        .match({ user_id: user.id, product_id: id })

      if (!error) {
        addToast('ОБЪЕКТ ИСКЛЮЧЕН ИЗ РЕЕСТРА', 'success')
      } else {
        addToast('DELETION_FAILED', 'error')
        console.error('Delete error:', error)
      }
    }
  }

  // ======================================================================
  // [LOGIC_HANDLER_03]: PROMO_CODE_DECRYPTION (Исправленный)
  // ======================================================================
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      addToast('ВВЕДИТЕ ПРОМОКОД', 'error')
      return
    }
    
    addToast('DECRYPTING_PROMO...', 'success')

    const { data, error } = await supabase
      .from('promocodes')
      .select('*')
      .eq('code', promoInput.toUpperCase().trim())
      .gte('valid_until', new Date().toISOString())
      .maybeSingle()

    if (error || !data) {
      addToast('ПРОМОКОД НЕ ВАЛИДЕН ИЛИ ИСТЕК', 'error')
      return
    }

    if (data.used) {
      addToast('ПРОМОКОД УЖЕ ИСПОЛЬЗОВАН', 'error')
      return
    }

    setAppliedPromo(data)
    addToast('СКИДКА УСПЕШНО АКТИВИРОВАНА', 'success')
  }

  // Расчет финальных коэффициентов
  const spendAmount = useBonuses ? Math.min(userBonuses, Math.floor(totalPrice * 0.3)) : 0
  const finalPrice = Math.max(0, totalPrice - spendAmount - (appliedPromo ? Number(appliedPromo.discount) : 0))

  // ======================================================================
  // [LOGIC_HANDLER_04]: FINAL_TRANSACTION_INIT (ИСПРАВЛЕННЫЙ - ГЛАВНЫЙ ФИКС)
  // ======================================================================
  const handleCheckout = async () => {
    if (!showCheckoutFields) {
      setShowCheckoutFields(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (fullName.length < 2 || phone.replace(/\D/g, '').length < 10) {
      addToast('ОШИБКА ВАЛИДАЦИИ: ПРОВЕРЬТЕ ПОЛЯ', 'error')
      return
    }

    if (dbCart.length === 0) {
      addToast('КОРЗИНА ПУСТА', 'error')
      return
    }

    setIsOrdering(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (!user || authError) {
        throw new Error('AUTH_LOST: ' + (authError?.message || 'No user'))
      }

      // 1. Сохраняем заказ в БД (ИСПРАВЛЕНО: правильные поля)
      const { error: orderError } = await supabase.from('orders').insert([{
        user_id: user.id,
        items: dbCart,
        total_amount: finalPrice,
        address: address || 'Не указан',
        delivery_type: deliveryMethod,
        customer_name: fullName,
        phone: phone.replace(/\D/g, ''),
        status: 'pending',
        payment_method: 'transfer_to_phone',
        payment_details: JSON.stringify({
          target_number: '79278552324',
          bank: 'Ozon Bank',
          amount: finalPrice
        }),
        created_at: new Date().toISOString()
      }])

      if (orderError) {
        console.error('Order insert error:', orderError)
        throw new Error('ORDER_INSERT_FAILED: ' + orderError.message)
      }

      // 2. Если использован промокод, помечаем как использованный
      if (appliedPromo) {
        await supabase
          .from('promocodes')
          .update({ used: true, used_by: user.id, used_at: new Date().toISOString() })
          .eq('id', appliedPromo.id)
      }

      // 3. Если использованы бонусы, списываем их
      if (useBonuses && spendAmount > 0) {
        await supabase
          .from('profiles')
          .update({ bonuses: userBonuses - spendAmount })
          .eq('id', user.id)
      }

      // 4. Очищаем корзину в БД
      const { error: deleteError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id)

      if (deleteError) {
        console.error('Cart clear error:', deleteError)
      }

      // 5. Синхронизируем локальное состояние
      contextClearCart()
      setDbCart([])
      setAppliedPromo(null)
      setUseBonuses(false)

      // 6. Запускаем конфетти и показываем окно оплаты
      setConfettiActive(true)
      setTimeout(() => setConfettiActive(false), 3000)
      setShowPaymentModal(true)

      addToast('ЗАКАЗ УСПЕШНО ОФОРМЛЕН', 'success')

    } catch (error: any) {
      console.error('Checkout error:', error)
      addToast(`КРИТИЧЕСКИЙ СБОЙ ТРАНЗАКЦИИ: ${error.message || 'Unknown error'}`, 'error')
    } finally {
      setIsOrdering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative">
            <div className="w-24 h-24 border-t-2 border-[#ff007a] rounded-full animate-spin" />
            <div className="absolute inset-0 w-24 h-24 border-b-2 border-[#00f2ff] rounded-full animate-spin-reverse" />
          </div>
          <div className="text-center">
            <p className="text-[#ff007a] font-black uppercase tracking-[1em] text-[12px] mb-2">vsgiga_loading...</p>
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
              INITIALIZING_NEURAL_NETWORK
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pt-40 pb-32 px-8 relative overflow-hidden">
      <XmasSnowBackground />
      <XmasGarland />
      <ChristmasTreeAnimation />
      <FloatingHolidayIcons />
      <CyberRainAnimation />
      <PaymentSuccessConfetti active={confettiActive} />
      <CyberTerminalHUD isVisible={isHudVisible} onHide={() => setIsHudVisible(!isHudVisible)} />

      {/* СИСТЕМА УВЕДОМЛЕНИЙ */}
      <AnimatePresence>
        {toasts.map(t => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
          />
        ))}
      </AnimatePresence>

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* --- [HEADER: VSGIGA_MANIFEST] --- */}
        <header className="mb-32 flex flex-col xl:flex-row items-center gap-20 relative">
          <motion.div
            onClick={() => { setExplosion(true); setTimeout(() => setExplosion(false), 800); }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-48 h-48 bg-gradient-to-br from-[#ff007a] to-[#00f2ff] rounded-[5rem] flex items-center justify-center shadow-[0_0_100px_rgba(255,0,122,0.6)] cursor-pointer relative group"
          >
            <ShoppingCart size={72} className="text-white group-hover:animate-bounce" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute inset-4 border-2 border-dashed border-white/20 rounded-[4rem]"
            />
            <AnimatePresence>
              {explosion && [...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 1000,
                    y: (Math.random() - 0.5) * 1000,
                    opacity: 0,
                    scale: 0,
                    rotate: 720 + Math.random() * 360
                  }}
                  className="absolute"
                >
                  <Snowflake size={28} className="text-[#ff007a]" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="text-center xl:text-left">
            <motion.div 
              initial={{ x: -100, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              className="flex items-center gap-6 mb-6"
            >
              <div className="h-[3px] w-24 bg-gradient-to-r from-[#ff007a] to-[#00f2ff]" />
              <span className="text-[#ff007a] font-black uppercase tracking-[0.6em] text-[14px]">vsgiga shop / encrypted_cart</span>
              <div className="h-[3px] w-24 bg-gradient-to-l from-[#ff007a] to-[#00f2ff]" />
            </motion.div>
            <h1 className="text-[12rem] font-black italic uppercase tracking-tighter leading-[0.8] select-none">
              КОРЗИН<span className="text-[#ff007a] animate-pulse">А</span>
            </h1>
            <div className="mt-12 flex flex-wrap justify-center xl:justify-start gap-12 opacity-40 font-black text-[12px] uppercase tracking-[0.4em] italic">
              <div className="flex items-center gap-3 text-green-500"><Activity size={18} /> Net: Stable</div>
              <div className="flex items-center gap-3"><Lock size={18} /> Sec: AES-256</div>
              <div className="flex items-center gap-3 text-[#ff007a]"><Layers size={18} /> Assets: {totalItems}</div>
              <div className="flex items-center gap-3 text-[#00f2ff]"><Clock size={18} /> Sync: Real-time</div>
            </div>
          </div>
        </header>
        
        {dbCart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-96 text-center border-2 border-dashed border-white/5 rounded-[6rem] bg-white/[0.01] backdrop-blur-3xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,122,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <ShoppingBag size={140} className="mx-auto text-white/5 mb-16 group-hover:text-[#ff007a]/20 transition-colors duration-700" />
            <p className="text-white/20 font-black uppercase tracking-[2em] text-sm animate-pulse">Storage_Empty_Waiting_For_Data</p>
            <Link href="/shop" className="inline-block mt-20 px-20 py-10 bg-white/5 border border-white/10 rounded-full font-black uppercase text-[12px] tracking-[0.5em] hover:bg-[#ff007a] hover:border-[#ff007a] hover:text-white transition-all shadow-2xl">
              Return_to_Catalog_Link
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
            {/* --- [SECTION: PRIMARY_ASSET_FEED] --- */}
            <div className="lg:col-span-7 space-y-16">
              <AnimatePresence mode="popLayout">
                {dbCart.map((item, idx) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ x: -200, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 200, opacity: 0, scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: idx * 0.1
                    }}
                    className="bg-[#080808] border-2 border-white/5 p-16 rounded-[5rem] flex flex-col md:flex-row items-center gap-20 group hover:border-[#ff007a]/40 transition-all duration-700 relative overflow-hidden shadow-2xl"
                  >
                    {/* ТЕКСТУРНЫЙ СЛОЙ КАРТОЧКИ */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="absolute -right-32 -bottom-32 w-80 h-80 bg-[#ff007a]/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-[#ff007a]/10 transition-colors" />
                    
                    {/* ПРЕВЬЮ ОБЪЕКТА */}
                    <div className="w-64 h-80 bg-black rounded-[4rem] overflow-hidden border-2 border-white/5 shrink-0 relative shadow-[0_40px_80px_rgba(0,0,0,0.7)] group-hover:border-[#ff007a]/30 transition-all">
                      <motion.img
                        whileHover={{ scale: 1.2, rotate: 1 }}
                        src={item.image}
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                        alt={item.name}
                      />
                      <div className="absolute top-8 left-8 bg-black/90 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
                        <span className="text-[11px] font-black text-[#ff007a] tracking-tighter">OBJ_ID_{item.id?.slice(0, 8).toUpperCase() || 'UNKNOWN'}</span>
                      </div>
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 border-2 border-[#ff007a]/20 rounded-[4rem] pointer-events-none"
                      />
                    </div>

                    {/* ИНФОРМАЦИОННЫЙ СТЕК */}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-12">
                        <div>
                          <motion.div className="flex items-center gap-4 mb-4">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[11px] text-white/20 font-black uppercase tracking-widest">Status: Asset_Synchronized</span>
                          </motion.div>
                          <h3 className="text-6xl font-black italic uppercase tracking-tighter leading-none group-hover:text-[#ff007a] transition-colors duration-500">
                            {item.name}
                          </h3>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="w-16 h-16 rounded-[2rem] border-2 border-white/5 flex items-center justify-center text-white/10 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/5 transition-all duration-300"
                        >
                          <Trash2 size={24} />
                        </motion.button>
                      </div>

                      {/* ТАБЛИЦА ИНЖЕНЕРНЫХ СПЕЦИФИКАЦИЙ */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 p-8 bg-white/[0.02] rounded-[3rem] border-2 border-white/[0.05] mb-12">
                        {[
                          { label: "Protocol", value: `OPIUM_v${idx + 1}`, color: "text-white/60" },
                          { label: "Encryption", value: "AES_256", color: "text-[#ff007a]" },
                          { label: "Hash_Sum", value: "SHA_2025", color: "text-white/60" },
                          { label: "Load", value: "NOMINAL", color: "text-green-500/60" }
                        ].map((spec, specIdx) => (
                          <div key={specIdx} className="space-y-2 border-l border-white/5 pl-4">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">{spec.label}</p>
                            <p className={`text-[12px] font-mono uppercase tracking-tighter ${spec.color}`}>{spec.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-8">
                        <div className="space-y-3">
                          <p className="text-[12px] text-white/20 font-black uppercase italic tracking-[0.3em]">Unit_Value</p>
                          <span className="text-6xl font-black italic text-white tracking-tighter block">
                            {(item.price || 0).toLocaleString()} <span className="text-3xl text-[#ff007a]">₽</span>
                          </span>
                        </div>

                        {/* ПАНЕЛЬ УПРАВЛЕНИЯ КОЛИЧЕСТВОМ */}
                        <div className="flex items-center bg-black border-2 border-white/5 p-5 rounded-[3rem] gap-12 shadow-inner group-hover:border-[#ff007a]/20 transition-all">
                          <motion.button
                            whileTap={{ scale: 0.7 }}
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            className="w-12 h-12 flex items-center justify-center text-white/20 hover:text-[#ff007a] transition-colors rounded-2xl hover:bg-white/5"
                          >
                            <Minus size={28} strokeWidth={3} />
                          </motion.button>
                          <div className="relative">
                            <span className="font-black text-5xl w-16 text-center font-mono text-white flex items-center justify-center">
                              {item.quantity || 1}
                            </span>
                            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#ff007a] rounded-full animate-ping" />
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.7 }}
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            className="w-12 h-12 flex items-center justify-center text-white/20 hover:text-[#ff007a] transition-colors rounded-2xl hover:bg-white/5"
                          >
                            <Plus size={28} strokeWidth={3} />
                          </motion.button>
                        </div>
                      </div>

                      {/* ВИЗУАЛЬНЫЙ СКАНЕР-ПОЛОСКА ВНИЗУ */}
                      <div className="mt-12 flex gap-2 h-1.5 opacity-20">
                        {[...Array(60)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              opacity: [0.2, 1, 0.2],
                              backgroundColor: i % 12 === 0 ? "#ff007a" : i % 8 === 0 ? "#00f2ff" : "#fff"
                            }}
                            transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.03 }}
                            className="flex-1 h-full rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* --- [SECTION: TRANSACTION_SIDEBAR] --- */}
            <div className="lg:col-span-5">
              <div className="bg-[#080808] border-2 border-white/5 p-16 rounded-[5rem] sticky top-40 shadow-[0_80px_160px_rgba(0,0,0,0.9)] overflow-hidden group">
                {/* Анимированный лазерный сканер сверху вниз */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff007a] to-transparent animate-scan z-20" />
                
                {/* МОДУЛЬ ПРОМОКОДОВ И БОНУСОВ С ВАЛИДАЦИЕЙ */}
                <div className="mb-16 space-y-10 relative z-10">
                  <div className="flex gap-6">
                    <div className="relative flex-1 group/input">
                      <Ticket className="absolute left-7 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-[#ff007a] transition-colors" size={22} />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="ENTER_PROMO_CODE"
                        className="w-full bg-white/5 border-2 border-white/10 p-8 pl-16 rounded-[2.5rem] font-black uppercase text-sm outline-none focus:border-[#ff007a] focus:bg-white/[0.08] transition-all tracking-widest"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleApplyPromo}
                      className="px-12 bg-white text-black rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.2em] hover:bg-[#ff007a] hover:text-white transition-all shadow-xl"
                    >
                      APPLY
                    </motion.button>
                  </div>

                  {/* КАРТОЧКА БОНУСНОГО БАЛАНСА */}
                  <div className="bg-white/[0.02] border-2 border-white/5 p-10 rounded-[3.5rem] flex items-center justify-between group/bonus hover:border-[#ff007a]/30 transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff007a]/5 via-transparent to-[#00f2ff]/5 opacity-0 group-hover/bonus:opacity-100 transition-opacity duration-700" />
                    <div className="flex items-center gap-8 relative z-10">
                      <motion.div 
                        animate={{ rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="w-20 h-20 rounded-3xl bg-[#ff007a]/10 flex items-center justify-center text-[#ff007a] shadow-inner"
                      >
                        <Coins size={36} />
                      </motion.div>
                      <div>
                        <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-2">Available_Points</p>
                        <p className="text-4xl font-black text-white italic tracking-tighter">
                          {userBonuses.toLocaleString()} <span className="text-sm opacity-30 not-italic">PTS</span>
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setUseBonuses(!useBonuses)}
                      className={`relative z-10 px-10 py-5 rounded-[2rem] font-black text-[12px] tracking-widest transition-all ${useBonuses
                        ? 'bg-[#ff007a] text-white shadow-[0_0_40px_rgba(255,0,122,0.6)] scale-105'
                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'
                        }`}
                    >
                      {useBonuses ? 'ACTIVE' : 'REDEEM'}
                    </motion.button>
                  </div>
                </div>

                {/* СИСТЕМНЫЙ СТЕК РАСЧЕТОВ */}
                <div className="space-y-8 mb-16 bg-black/50 p-12 rounded-[4rem] border-2 border-white/5 relative shadow-inner">
                  <div className="flex justify-between items-center text-white/30 font-black uppercase text-[12px] tracking-[0.4em]">
                    <div className="flex items-center gap-4"><Package size={16} /> Subtotal_Assets:</div>
                    <span>{totalPrice.toLocaleString()} ₽</span>
                  </div>

                  <AnimatePresence>
                    {useBonuses && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="flex justify-between items-center text-[#ff007a] font-black uppercase text-[12px] tracking-[0.4em] pt-3"
                      >
                        <div className="flex items-center gap-4"><Star size={16} className="animate-spin-slow" /> Bonus_Deduction:</div>
                        <span>-{spendAmount.toLocaleString()} ₽</span>
                      </motion.div>
                    )}

                    {appliedPromo && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="flex justify-between items-center text-green-500 font-black uppercase text-[12px] tracking-[0.4em] pt-3"
                      >
                        <div className="flex items-center gap-4"><ZapIcon size={16} /> Promo_Value:</div>
                        <span>-{(appliedPromo.discount || 0).toLocaleString()} ₽</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-12 mt-8 border-t border-white/10">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <motion.div 
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-2.5 h-2.5 bg-[#ff007a] rounded-full"
                          />
                          <p className="text-[11px] font-black text-[#ff007a] uppercase tracking-[0.5em] italic">READY_FOR_SYNC</p>
                        </div>
                        <p className="text-white/20 text-[12px] font-black uppercase tracking-widest italic">Net_Payable_Amount</p>
                      </div>
                      <div className="text-right">
                        <span className="text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tighter block leading-[0.7] text-white">
                          {finalPrice.toLocaleString()}
                          <span className="text-2xl md:text-3xl text-[#ff007a] ml-6 not-italic">₽</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ДИНАМИЧЕСКИЕ ПОЛЯ ВВОДА ДАННЫХ */}
                <AnimatePresence>
                  {showCheckoutFields && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="space-y-6 mb-14"
                    >
                      <div className="grid grid-cols-1 gap-6">
                        <div className="relative group/input">
                          <User className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-[#ff007a] transition-all" size={22} />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="CLIENT_MANIFEST_NAME"
                            className="w-full bg-white/5 border-2 border-white/10 p-9 pl-20 rounded-[3rem] font-black text-sm uppercase outline-none focus:border-[#ff007a] shadow-lg transition-all"
                          />
                        </div>
                        <div className="relative group/input">
                          <Phone className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-[#ff007a] transition-all" size={22} />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                              setPhone(val.length > 0 ? (val.startsWith('7') ? '+' + val : val) : '');
                            }}
                            placeholder="+7 (999) 000-00-00"
                            className="w-full bg-white/5 border-2 border-white/10 p-9 pl-20 rounded-[3rem] font-black text-sm outline-none focus:border-[#ff007a] shadow-lg transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mt-6">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setDeliveryMethod('mail')}
                          className={`p-10 rounded-[2.5rem] border-2 font-black text-[12px] tracking-[0.3em] flex flex-col items-center gap-5 transition-all ${deliveryMethod === 'mail' 
                            ? 'border-[#ff007a] bg-[#ff007a]/10 text-white shadow-[0_0_60px_rgba(255,0,122,0.3)]' 
                            : 'border-white/5 bg-white/5 text-white/20 hover:bg-white/[0.08] hover:text-white/40'
                          }`}
                        >
                          <Truck size={28} />
                          COURIER_EXP
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setDeliveryMethod('pickup')}
                          className={`p-10 rounded-[2.5rem] border-2 font-black text-[12px] tracking-[0.3em] flex flex-col items-center gap-5 transition-all ${deliveryMethod === 'pickup' 
                            ? 'border-[#ff007a] bg-[#ff007a]/10 text-white shadow-[0_0_60px_rgba(255,0,122,0.3)]' 
                            : 'border-white/5 bg-white/5 text-white/20 hover:bg-white/[0.08] hover:text-white/40'
                          }`}
                        >
                          <Package size={28} />
                          PICKUP_POINT
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ГЛАВНАЯ КНОПКА ТРАНЗАКЦИИ */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  disabled={isOrdering}
                  className="w-full py-14 bg-white text-black rounded-[4rem] font-black uppercase italic tracking-[0.8em] text-sm hover:bg-[#ff007a] hover:text-white transition-all shadow-[0_40px_80px_rgba(255,255,255,0.15)] hover:shadow-[#ff007a]/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">
                    {isOrdering ? 'ENCRYPTING_TRANSACTION...' : showCheckoutFields ? 'INIT_PAYMENT_v2' : 'PROCEED_TO_CHECKOUT'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]" />
                  {isOrdering && (
                    <motion.div
                      animate={{ x: ['0%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute bottom-0 left-0 h-1 bg-[#ff007a]"
                      style={{ width: '30%' }}
                    />
                  )}
                </motion.button>
              </div>

              {/* ДОПОЛНИТЕЛЬНЫЙ ДЕКОРАТИВНЫЙ ОБВЕС */}
              <div className="mt-16 p-14 border-2 border-white/5 rounded-[4rem] bg-gradient-to-br from-white/[0.03] via-black/50 to-transparent backdrop-blur-md">
                <div className="flex items-center gap-8 mb-8">
                  <ShieldCheck className="text-[#ff007a]" size={32} />
                  <span className="text-sm font-black uppercase tracking-[0.5em] italic">Secure_Protocol_Active</span>
                </div>
                <p className="text-[11px] text-white/30 font-bold uppercase leading-relaxed tracking-widest italic">
                  Все транзакции vsgiga shop проходят через многослойный шлюз шифрования. Ваши данные не сохраняются в открытом виде. Праздничный кэшбэк будет начислен в течение 0.001 сек после завершения.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- [NEW: POST-CART DIAGNOSTICS SECTION] --- */}
        {dbCart.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-56 space-y-40">
            <BioCoreStatus />
            <CyberStreamVisualizer />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
              <div className="p-20 bg-[#050505] border-2 border-white/5 rounded-[5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5"><Zap size={120} /></div>
                <h4 className="text-4xl font-black uppercase italic tracking-tighter mb-12 flex items-center gap-5">
                  <div className="w-4 h-10 bg-gradient-to-b from-[#ff007a] to-[#00f2ff]" /> System_Uptime
                </h4>
                <div className="space-y-8">
                  {[
                    { label: "Core_Sync", val: "99.9%", w: "w-[99.9%]" },
                    { label: "Neural_Link", val: "84.2%", w: "w-[84.2%]" },
                    { label: "Storage_Load", val: "12.0%", w: "w-[12%]" }
                  ].map((s, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/30">
                        <span>{s.label}</span>
                        <span>{s.val}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          whileInView={{ width: s.val }} 
                          transition={{ duration: 2, delay: i * 0.3 }} 
                          className="h-full bg-gradient-to-r from-[#ff007a] to-[#00f2ff]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-20 bg-[#050505] border-2 border-white/5 rounded-[5rem] relative overflow-hidden flex flex-col justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff007a]/5 via-transparent to-[#00f2ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <h4 className="text-4xl font-black uppercase italic tracking-tighter mb-8 relative z-10">
                  Node_Status: <span className="text-green-500">OPERATIONAL</span>
                </h4>
                <p className="text-sm font-bold text-white/20 uppercase leading-loose tracking-[0.2em] italic relative z-10">
                  Текущая сессия обслуживается узлом <span className="text-white">VSG-EUROPE-NORTH</span>.
                  Все задействованные нейронные связи стабильны. Праздничные скрипты работают в штатном режиме.
                  Приятного завершения заказа в vsgiga shop.
                </p>
                <div className="mt-12 flex gap-4 relative z-10">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
                      className="w-2 h-2 rounded-full bg-green-500"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="mt-72 border-t border-white/5 pt-28 pb-24">
          <div className="flex flex-col md:flex-row justify-between items-start gap-24 mb-40">
            <div className="max-w-lg">
              <h5 className="text-[#ff007a] font-black uppercase tracking-[0.4em] text-[11px] mb-8 italic">System_Origin</h5>
              <p className="text-5xl font-black uppercase italic tracking-tighter leading-tight mb-12">
                VSGIGA_SHOP <br /> NEURAL_CORE_V6
              </p>
              <p className="text-[12px] font-bold text-white/30 uppercase leading-loose tracking-widest">
                Каждая транзакция в нашем магазине обрабатывается через децентрализованные узлы.
                Мы гарантируем 100% анонимность и безопасность ваших данных с использованием
                квантовых протоколов шифрования.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-24 gap-y-16 flex-1">
              {[
                { label: "Server_Node", val: "FRANKFURT_STABLE_01", icon: <Server size={16} /> },
                { label: "Database", val: "POSTGRES_QL_v15", icon: <Database size={16} /> },
                { label: "Handshake", val: "TLS_1.3_ACTIVE", icon: <Lock size={16} /> },
                { label: "Uptime", val: "99.9992%", icon: <Activity size={16} /> },
                { label: "Latency", val: "0.0024_MS", icon: <Zap size={16} /> },
                { label: "Framework", val: "NEXT_14_APP", icon: <Cpu size={16} /> }
              ].map((info, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="space-y-4 group/info"
                >
                  <div className="flex items-center gap-4 text-white/20 group-hover/info:text-[#ff007a] transition-colors">
                    {info.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest">{info.label}</span>
                  </div>
                  <p className="text-sm font-black font-mono tracking-tighter text-white/60">{info.val}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* --- [NEW: DYNAMIC_WAVE_SEPARATOR] --- */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative mb-32">
            <motion.div
              animate={{ left: ['0%', '100%', '0%'] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 w-24 h-2 bg-gradient-to-r from-[#ff007a] via-[#00f2ff] to-[#ff007a] blur-md rounded-full"
            />
          </div>

          {/* --- [MAIN_FOOTER_NAVIGATION] --- */}
          <footer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
            <div className="space-y-10">
              <div className="flex items-center gap-5 text-[#ff007a]">
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="w-12 h-12 bg-[#ff007a]/10 rounded-xl flex items-center justify-center border-2 border-[#ff007a]/20"
                >
                  <ShoppingCart size={24} />
                </motion.div>
                <span className="text-2xl font-black uppercase italic tracking-tighter text-white">vsgiga shop</span>
              </div>
              <p className="text-[11px] text-white/30 font-bold uppercase leading-relaxed tracking-widest">
                Лучший кибер-магазин 2025 года. <br /> Сделано с любовью к неону и скорости.
              </p>
              <div className="flex gap-8">
                {[Github, Twitter, Instagram].map((Icon, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ scale: 1.2, color: '#ff007a' }}
                    href="#"
                    className="text-white/20 hover:text-white transition-all"
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <h6 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 italic">Resource_Map</h6>
              <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest text-white/20">
                {['Main_Catalog', 'User_Dashboard', 'Tech_Support', 'Bonus_Program'].map((item, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 5 }}
                    className="hover:text-[#ff007a] transition-colors cursor-pointer flex items-center gap-3"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              <h6 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 italic">Legal_Protocols</h6>
              <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest text-white/20">
                {['Privacy_Security', 'Terms_Of_Service', 'Cookie_Manifest', 'Refund_Policy'].map((item, i) => (
                  <li
                    key={i}
                    className="hover:text-[#ff007a] transition-colors cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              <h6 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 italic">System_Newsletter</h6>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="USER@LINK.NET"
                  className="w-full bg-white/5 border-2 border-white/10 p-6 rounded-3xl font-mono text-[11px] outline-none focus:border-[#ff007a] transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[#ff007a] text-white rounded-xl"
                >
                  <ArrowRight size={18} />
                </motion.button>
              </div>
              <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest italic">
                Подпишитесь на системные обновления vsgiga. <br /> Никакого спама, только патч-ноуты.
              </p>
            </div>
          </footer>

          <div className="mt-48 pt-16 border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-[10px] font-black uppercase tracking-[1em] text-white/5 italic">
              © 2025 vsgiga shop. ALL_RIGHTS_RESERVED_V_LINK
            </p>
            <div className="flex items-center gap-6 text-white/5 text-[10px] font-mono uppercase italic">
              <span>Build_Ver: 6.5.0-STABLE</span>
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              <span>Env: Production</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- [PAYMENT_MODAL: NEURAL_TRANSACTION] --- */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              className="relative z-10 w-full max-w-4xl bg-[#0a0a0a] border-2 border-white/10 rounded-[6rem] p-24 text-center shadow-[0_150px_300px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff007a] via-[#00f2ff] to-[#ff007a] animate-pulse" />
              <div className="mb-16 inline-flex p-12 bg-green-500/10 rounded-[4rem] text-green-500 border-2 border-green-500/20">
                <CheckCircle2 size={96} className="animate-bounce" />
              </div>
              <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-12 leading-none">
                ЗАКАЗ <br /> <span className="text-[#ff007a]">УСПЕШНО ПРИНЯТ</span>
              </h2>
              <p className="text-base font-bold text-white/40 uppercase tracking-widest leading-loose mb-16 max-w-2xl mx-auto">
                Ваша транзакция была верифицирована нейронной сетью.
                Мы уже готовим товары к отправке через защищенный гипер-канал.
                Для завершения переведите <span className="text-white font-black">{finalPrice} ₽</span> на номер:
                <span className="text-[#ff007a] font-black ml-2">79278552324</span> (СБП/Перевод/<span className="text-yellow-400">Ozon Bank</span>)
              </p>
              <div className="grid grid-cols-2 gap-8 mb-20">
                <div className="p-10 bg-white/5 rounded-3xl border-2 border-white/5">
                  <p className="text-[11px] font-black text-white/20 uppercase mb-3">Order_Reference</p>
                  <p className="text-xl font-mono font-black text-white italic">
                    #{Math.random().toString(36).substr(2, 12).toUpperCase()}
                  </p>
                </div>
                <div className="p-10 bg-white/5 rounded-3xl border-2 border-white/5">
                  <p className="text-[11px] font-black text-white/20 uppercase mb-3">Sync_Time</p>
                  <p className="text-xl font-mono font-black text-white italic">0.0042_SEC</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/shop')}
                className="w-full py-12 bg-white text-black rounded-[3rem] font-black uppercase italic tracking-[0.5em] text-sm hover:bg-[#ff007a] hover:text-white transition-all shadow-2xl"
              >
                RETURN_TO_SYSTEM_DASHBOARD
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}