'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  Coins,
  ArrowRight,
  Package,
  User,
  Gift,
  Snowflake,
  Sparkles,
  Star,
  Zap,
  Crown,
  TrendingUp,
  Shield,
  Rocket,
  Gem,
  Trophy,
  Calendar,
  CreditCard,
  ShoppingCart,
  Box,
  Truck,
  CheckCircle,
  Activity,
  Target,
  Edit3,
  X,
  Type,
  CreditCard as CardIcon,
  LifeBuoy,
  HelpCircle
} from 'lucide-react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color, MathUtils } from 'three'

// ==================== ОПТИМИЗИРОВАННЫЕ 3D КОМПОНЕНТЫ ====================

// 1. INSTANCEDMESH ДЛЯ СНЕЖИНОК
const SnowflakesInstanced = () => {
  const meshRef = useRef<InstancedMesh>(null!)
  const count = 120 // Оптимальное количество
  const dummy = useMemo(() => new Object3D(), [])
  const { clock } = useThree()

  // Типы снежинок
  const types = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      size: 0.05 + Math.random() * 0.1,
      speed: 0.2 + Math.random() * 0.3,
      rotationSpeed: Math.random() * 0.02,
      xOffset: (Math.random() - 0.5) * 2,
      zDepth: -Math.random() * 100 - 10,
      yStart: Math.random() * 20 - 10,
      xRotation: Math.random() * Math.PI * 2,
      yRotation: Math.random() * Math.PI * 2
    })), [count]
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const snowflake = types[i]
      const progress = (time * snowflake.speed) % 1

      // Позиция с эффектом параллакса
      const y = snowflake.yStart - progress * 25
      const x = Math.sin(time * 0.5 + i) * snowflake.xOffset

      dummy.position.set(x, y, snowflake.zDepth)
      dummy.rotation.x = snowflake.xRotation + time * snowflake.rotationSpeed
      dummy.rotation.y = snowflake.yRotation + time * snowflake.rotationSpeed * 0.7
      dummy.scale.setScalar(snowflake.size * (1 + Math.abs(snowflake.zDepth) / 200))
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)

      // Сброс позиции когда снежинка упала
      if (y < -15) {
        dummy.position.y = snowflake.yStart
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#4da6cc"
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.8}
      />
    </instancedMesh>
  )
}

// 2. INSTANCEDMESH ДЛЯ ПОДАРКОВ
const GiftsInstanced = () => {
  const meshRef = useRef<InstancedMesh>(null!)
  const count = 25 // Оптимальное количество подарков
  const dummy = useMemo(() => new Object3D(), [])

  // Типы подарков
  const types = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      size: 0.3 + Math.random() * 0.5,
      speed: 0.1 + Math.random() * 0.2,
      rotationSpeed: Math.random() * 0.01 + 0.005,
      xOffset: (Math.random() - 0.5) * 15,
      zDepth: -Math.random() * 80 - 20,
      yStart: Math.random() * 10 + 5,
      color: new Color(
        i % 3 === 0 ? 0xd67a9d : // розовый
          i % 3 === 1 ? 0x71b3c9 : // голубой
            0xffd166 // желтый
      ),
      wobbleSpeed: Math.random() * 0.5 + 0.5,
      wobbleAmount: Math.random() * 0.5
    })), [count]
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const gift = types[i]
      const progress = (time * gift.speed) % 1

      // Позиция с параллаксом и wobble эффектом
      const y = gift.yStart - progress * 30
      const x = gift.xOffset + Math.sin(time * gift.wobbleSpeed + i) * gift.wobbleAmount
      const z = gift.zDepth + Math.cos(time * gift.wobbleSpeed * 0.7 + i) * 0.5

      dummy.position.set(x, y, z)
      dummy.rotation.x = time * gift.rotationSpeed
      dummy.rotation.y = time * gift.rotationSpeed * 1.3
      dummy.rotation.z = time * gift.rotationSpeed * 0.7
      dummy.scale.setScalar(gift.size * (1 + Math.abs(gift.zDepth) / 100))
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, gift.color)

      // Сброс позиции
      if (y < -15) {
        dummy.position.y = gift.yStart
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#ffffff"
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  )
}

// 3. INSTANCEDMESH ДЛЯ ЗВЕЗД
const StarsInstanced = () => {
  const meshRef = useRef<InstancedMesh>(null!)
  const count = 200 // Оптимальное количество звезд
  const dummy = useMemo(() => new Object3D(), [])

  const types = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      size: 0.02 + Math.random() * 0.03,
      x: (Math.random() - 0.5) * 50,
      y: (Math.random() - 0.5) * 50,
      z: -Math.random() * 200 - 50,
      color: new Color(
        Math.random() > 0.7 ? 0xd67a9d :
          Math.random() > 0.5 ? 0x71b3c9 :
            Math.random() > 0.3 ? 0xffd166 :
              0xffffff
      ),
      pulseSpeed: Math.random() * 0.5 + 0.2,
      pulseOffset: Math.random() * Math.PI * 2
    })), [count]
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const star = types[i]

      // Пульсация
      const pulse = 0.7 + Math.sin(time * star.pulseSpeed + star.pulseOffset) * 0.3

      dummy.position.set(star.x, star.y, star.z)
      dummy.scale.setScalar(star.size * pulse)
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  )
}

// 4. КОСМИЧЕСКИЕ ЛУЧИ (оптимизированные)
const SpaceBeamsOptimized = () => {
  const linesRef = useRef<THREE.LineSegments>(null!)

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  // Создаем геометрию для лучей
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const colors = []

    // Горизонтальные лучи
    for (let i = 0; i < 20; i++) {
      const y = (i - 10) * 1.5
      vertices.push(-25, y, -50, 25, y, -50)

      const color = new THREE.Color(0xd67a9d)
      colors.push(color.r, color.g, color.b)
      colors.push(color.r, color.g, color.b)
    }

    // Вертикальные лучи
    for (let i = 0; i < 20; i++) {
      const x = (i - 10) * 1.5
      vertices.push(x, -15, -50, x, 15, -50)

      const color = new THREE.Color(0x71b3c9)
      colors.push(color.r, color.g, color.b)
      colors.push(color.r, color.g, color.b)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    return geometry
  }, [])

  const material = useMemo(() =>
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.1,
      linewidth: 1
    }), []
  )

  return <lineSegments ref={linesRef} geometry={geometry} material={material} />
}

// 5. ГЛАВНЫЙ КОМПОНЕНТ 3D ФОНА С ОПТИМИЗАЦИЯМИ
const Optimized3DBackground = () => {
  // Убрали весь useEffect с ограничением FPS
  
  return (
    <>
      <color attach="background" args={[0x000000]} />
      <fog attach="fog" args={[0x000000, 50, 200]} />
      
      {/* Оптимизированные компоненты */}
      <StarsInstanced />
      <SnowflakesInstanced />
      <GiftsInstanced />
      <SpaceBeamsOptimized />
      
      {/* Освещение */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color={0xd67a9d} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color={0x71b3c9} />
    </>
  )
}

// 6. КОНТЕЙНЕР CANVAS С ОПТИМИЗАЦИЯМИ
const ThreeDBackgroundContainer = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]} // Адаптивный DPR
        style={{
          pointerEvents: 'none',
          touchAction: 'none'
        }}
        performance={{ min: 0.5 }} // Уровень производительности
      >
        <Optimized3DBackground />
      </Canvas>
    </div>
  )
}

// ==================== ОПТИМИЗИРОВАННЫЙ МАГИЧЕСКИЙ ПОДАРОК ====================
const MagicGift = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const confettiRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    setShowConfetti(true)
    setPromoCode('HAPPY2026')
    setIsOpen(true)

    toast.success(
      <div className="text-center">
        <p className="font-bold text-lg">🎉 ВАШ ПРОМОКОД АКТИВИРОВАН!</p>
        <p className="text-sm mt-1">HAPPY2026 на 1000 ₽</p>
      </div>,
      {
        duration: 5000,
        style: {
          background: 'linear-gradient(90deg, #d67a9d, #71b3c9)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.2)'
        }
      }
    )

    setTimeout(() => setShowConfetti(false), 3000)
  }

  // Оптимизированный конфетти
  const ConfettiParticle = ({ index }: { index: number }) => {
    const style = {
      '--x-start': `${50 + Math.sin(index) * 20}vw`,
      '--y-start': '100vh',
      '--x-end': `${Math.random() * 100}vw`,
      '--y-end': '-100vh',
      '--rotation': `${Math.random() * 720}deg`,
      '--duration': `${Math.random() * 2 + 2}s`,
      '--delay': `${Math.random() * 2}s`,
      '--size': `${Math.random() * 20 + 10}px`,
      '--color': ['#d67a9d', '#71b3c9', '#ffd166', '#ff6b9d', '#4da6cc'][Math.floor(Math.random() * 5)]
    } as React.CSSProperties

    const emojis = ['🎉', '✨', '⭐', '🎁', '🎊']

    return (
      <div
        className="absolute text-2xl opacity-0 animate-confetti"
        style={style}
      >
        {emojis[Math.floor(Math.random() * 5)]}
      </div>
    )
  }

  return (
    <>
      {/* Оптимизированный конфетти эффект с CSS анимациями */}
      <div
        ref={confettiRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ display: showConfetti ? 'block' : 'none' }}
      >
        {Array.from({ length: 80 }).map((_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}
      </div>

      {/* Компонент подарка */}
      <motion.div
        className="fixed bottom-32 left-8 z-40 cursor-pointer"
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, -8, 8, -8, 0],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 1
        }}
        onClick={handleClick}
      >
        {/* Аврора эффект */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-50"
          style={{
            background: 'linear-gradient(45deg, #d67a9d, #ff6b9d, #71b3c9, #4da6cc)',
            backgroundSize: '400% 400%',
            animation: 'gradient 6s ease infinite'
          }}
        />

        <div className="relative bg-gradient-to-br from-[#d67a9d] via-[#71b3c9] to-[#ffd166] p-1.5 rounded-2xl shadow-2xl">
          <div className="bg-black rounded-xl p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="animate-spin-slow w-12 h-12">
                  <Gift className="w-full h-full text-yellow-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 border-2 border-black flex items-center justify-center">
                  <span className="text-[10px] font-black">!</span>
                </div>
              </div>
              <p className="text-sm font-black tracking-widest text-center leading-tight">
                МАГИЧЕСКИЙ<br />ПОДАРОК
              </p>
              <div className="mt-2 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full" />
            </div>
          </div>
        </div>

        {/* Всплывающее окно с промокодом */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute left-full ml-4 bottom-0 min-w-[320px] z-50"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-yellow-500/50 p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black tracking-widest flex items-center gap-2">
                    <Sparkles className="text-yellow-400" />
                    ВАШ ПРОМОКОД
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsOpen(false)
                    }}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-black/50 rounded-xl p-6 border border-yellow-500/30 text-center mb-4">
                  <p className="text-4xl font-black tracking-wider text-yellow-400 font-mono">
                    {promoCode}
                  </p>
                  <p className="text-sm text-white/60 mt-2">1000 ₽ на первый заказ</p>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(promoCode)
                        toast.success('Промокод скопирован!')
                      }}
                      className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm font-bold hover:bg-yellow-500/20 transition-colors"
                    >
                      КОПИРОВАТЬ
                    </button>
                  </div>
                </div>

                <p className="text-xs text-white/40 text-center">
                  Промокод действителен до 31.01.2026
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

// ==================== ОПТИМИЗИРОВАННЫЕ КОМПОНЕНТЫ ====================

// АНИМИРОВАННАЯ СФЕРА ДЛЯ БОНУСОВ
const AnimatedSphere = ({ value }: { value: number }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-56 h-56">
        {/* Внешняя аура */}
        <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-[#d67a9d]/20 via-[#71b3c9]/20 to-[#ffd166]/20 blur-3xl animate-pulse-slow" />

        {/* Средняя сфера */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-[#d67a9d]/40 via-[#71b3c9]/40 to-transparent blur-lg animate-spin-slow" />

        {/* Внутренняя сфера */}
        <div className="absolute inset-10 rounded-full bg-gradient-to-br from-black to-gray-900 border-2 border-white/10 flex items-center justify-center shadow-2xl">
          <div className="text-center">
            <p className="text-5xl font-black bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] bg-clip-text text-transparent">
              {value}
            </p>
            <p className="text-xs font-black tracking-widest text-white/60 mt-3">GIGA COINS</p>
          </div>
        </div>

        {/* Сияющие частицы */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-pulse"
            style={{
              left: `${50 + 45 * Math.cos((i * 45 * Math.PI) / 180)}%`,
              top: `${50 + 45 * Math.sin((i * 45 * Math.PI) / 180)}%`,
              background: `linear-gradient(45deg, ${i % 3 === 0 ? '#d67a9d' : i % 3 === 1 ? '#71b3c9' : '#ffd166'}, transparent)`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ПАРАЛЛАКС КАРТОЧКА
const ParallaxCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  )
}

// АНИМИРОВАННЫЙ ГРАДИЕНТНЫЙ БОРДЕР
const BorderBeam = () => {
  return (
    <div className="absolute inset-0 rounded-3xl overflow-hidden">
      <div
        className="absolute inset-0 animate-gradient-border"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            #d67a9d 25%, 
            #71b3c9 50%, 
            #ffd166 75%, 
            transparent 100%
          )`,
          backgroundSize: '300% 300%',
          filter: 'blur(12px)',
        }}
      />
    </div>
  )
}

// ==================== CSS АНИМАЦИИ ДЛЯ ОПТИМИЗАЦИИ ====================
const OptimizedAnimations = () => {
  useEffect(() => {
    // Добавляем CSS анимации в документ
    const style = document.createElement('style')
    style.textContent = `
      @keyframes gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      @keyframes gradient-border {
        0% { background-position: 0% 0%; }
        100% { background-position: 300% 300%; }
      }
      
      @keyframes confetti {
        0% {
          opacity: 0;
          transform: translate3d(var(--x-start), var(--y-start), 0) rotate(0deg) scale(0);
        }
        10% {
          opacity: 1;
          transform: translate3d(var(--x-start), calc(var(--y-start) - 20vh), 0) rotate(calc(var(--rotation) * 0.1)) scale(1);
        }
        90% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translate3d(var(--x-end), var(--y-end), 0) rotate(var(--rotation)) scale(0.5);
        }
      }
      
      .animate-gradient {
        animation: gradient 6s ease infinite;
      }
      
      .animate-gradient-border {
        animation: gradient-border 4s linear infinite;
      }
      
      .animate-confetti {
        animation: confetti var(--duration) ease-out var(--delay) forwards;
      }
      
      .animate-spin-slow {
        animation: spin 8s linear infinite;
      }
      
      .animate-pulse-slow {
        animation: pulse 3s ease-in-out infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.3); }
      }
      
      /* Оптимизация для GPU */
      .gpu-accelerated {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        will-change: transform, opacity;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}

// ==================== МОДАЛЬНОЕ ОКНО ПОПОЛНЕНИЯ ====================
const TopUpModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [text, setText] = useState('')
  const fullText = "ФУНКЦИЯ В РАЗРАБОТКЕ"

  useEffect(() => {
    if (!isOpen) {
      setText('')
      return
    }

    let i = 0
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border-2 border-white/10 p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="animate-spin-slow w-24 h-24 mx-auto mb-6">
                    <CardIcon className="w-full h-full text-cyan-400" />
                  </div>

                  <h2 className="text-2xl font-black tracking-widest mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    ПОПОЛНЕНИЕ БАЛАНСА
                  </h2>

                  <div className="h-12 flex items-center justify-center">
                    <p className="text-xl font-mono tracking-widest">
                      {text}
                      <span className="inline-block w-[2px] h-6 bg-cyan-400 ml-1 animate-pulse" />
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="НОМЕР КАРТЫ"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm tracking-widest"
                      disabled
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm tracking-widest"
                      disabled
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="СУММА (₽)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm tracking-widest"
                    disabled
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={onClose}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white/60 font-bold tracking-widest text-sm w-full hover:from-gray-600 hover:to-gray-700 transition-all"
                  >
                    ЗАКРЫТЬ
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ==================== КОМПОНЕНТ НОВОСТЕЙ ====================
interface NewsItem {
  id: string
  title: string
  content: string
  image_url: string | null
  created_at: string
}

const NewsFeed = ({ news }: { news: NewsItem[] }) => {
  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#d67a9d]/20 to-[#71b3c9]/20 flex items-center justify-center mx-auto mb-6">
          <Type size={32} className="text-white/20" />
        </div>
        <p className="text-xl font-bold tracking-widest mb-3">НОВОСТЕЙ ПОКА НЕТ</p>
        <p className="text-white/60">Следите за обновлениями!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {news.map((item) => (
        <ParallaxCard key={item.id}>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex gap-4">
              {item.image_url && (
                <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold tracking-widest">{item.title}</h3>
                  <span className="text-xs text-white/40">
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{item.content}</p>
              </div>
            </div>
          </div>
        </ParallaxCard>
      ))}
    </div>
  )
}

// ==================== ОСНОВНАЯ СТРАНИЦА ====================

interface UserProfile {
  id: string
  email?: string
  user_metadata?: {
    username?: string
    avatar_url?: string
    rank?: string
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [userBonuses, setUserBonuses] = useState(3450)
  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [topUpModalOpen, setTopUpModalOpen] = useState(false)

  // Добавляем состояние для проверки клиента
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const getData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }

      const userData: UserProfile = {
        id: authUser.id,
        email: authUser.email || undefined,
        user_metadata: authUser.user_metadata as any || {}
      }

      setUser(userData)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url, available_points')
        .eq('id', authUser.id)
        .single()

      if (profileData) {
        setUserBonuses(profileData.available_points || 3450)
        setUsernameInput(profileData.username || '')
        setUser(prev => ({
          ...prev!,
          user_metadata: {
            ...prev?.user_metadata,
            avatar_url: profileData.avatar_url || undefined,
            username: profileData.username || undefined
          }
        }))
      }

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      if (ordersData) setOrders(ordersData)

      // Загрузка новостей
      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (newsData) setNews(newsData)

      setLoading(false)
    }
    getData()
  }, [router, isClient])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0 || !user) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setUser(prev => ({
        ...prev!,
        user_metadata: {
          ...prev?.user_metadata,
          avatar_url: publicUrl
        }
      }))

      toast.success('Аватар успешно обновлен!', {
        style: {
          background: 'linear-gradient(90deg, #71b3c9, #d67a9d)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.2)'
        },
        icon: '✅'
      })
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message, {
        style: {
          background: 'linear-gradient(90deg, #ff6b6b, #ffa726)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.2)'
        }
      })
    } finally {
      setUploading(false)
    }
  }

  const handleUsernameSave = async () => {
    if (!user || !usernameInput.trim()) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: usernameInput.trim() })
        .eq('id', user.id)

      if (error) throw error

      setUser(prev => ({
        ...prev!,
        user_metadata: {
          ...prev?.user_metadata,
          username: usernameInput.trim()
        }
      }))

      setEditingName(false)

      toast.success('Имя успешно обновлено!', {
        style: {
          background: 'linear-gradient(90deg, #71b3c9, #d67a9d)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.2)'
        },
        icon: '✅'
      })
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message, {
        style: {
          background: 'linear-gradient(90deg, #ff6b6b, #ffa726)',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.2)'
        }
      })
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 border-4 border-transparent border-t-[#d67a9d] border-r-[#71b3c9] border-b-[#ffd166] border-l-[#ff6b9d] rounded-full animate-spin" />
          <p className="text-xl font-bold tracking-widest text-white">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 text-center">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#d67a9d] border-r-[#71b3c9] border-b-[#ffd166] border-l-[#ff6b9d] animate-spin" />
          <div className="absolute inset-4 rounded-full border-4 border-white/10" />
        </div>
        <p className="text-xl font-bold tracking-widest bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] bg-clip-text text-transparent">
          ЗАГРУЗКА ИНТЕРФЕЙСА...
        </p>
      </div>
    </div>
  )

  // ОБНОВЛЕННЫЙ МАССИВ БЫСТРЫХ ДЕЙСТВИЙ - ЗАМЕНА ПОДПИСКИ НА ПОМОЩЬ
  const quickActions = [
    { label: 'НОВЫЙ ЗАКАЗ', icon: ShoppingCart, color: '#d67a9d', link: '/catalog' },
    { label: 'ПОПОЛНИТЬ', icon: CreditCard, color: '#71b3c9', action: () => setTopUpModalOpen(true) },
    { label: 'ПОДАРКИ', icon: Gift, color: '#ffd166', link: '/layout/BonusSystem' },
    { label: 'ПОМОЩЬ', icon: LifeBuoy, color: '#ff6b9d', link: '/contacts' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
      {/* Модальное окно пополнения */}
      <TopUpModal isOpen={topUpModalOpen} onClose={() => setTopUpModalOpen(false)} />

      {/* Оптимизированные CSS анимации */}
      <OptimizedAnimations />

      {/* Оптимизированный 3D фон с InstancedMesh */}
      <ThreeDBackgroundContainer />

      {/* Магический подарок */}
      <MagicGift />

      {/* Новогодний топ-баннер */}
      <div className="fixed top-0 left-0 right-0 z-50 animate-slideDown">
        <div className="bg-gradient-to-r from-[#d67a9d]/10 via-[#71b3c9]/10 to-[#ffd166]/10 backdrop-blur-2xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-center gap-4">
              <Sparkles className="text-yellow-400 animate-pulse" size={20} />
              <span className="text-sm font-bold tracking-widest bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                🎄 НОВОГОДНИЙ СЕЗОН • КЭШБЭК ДО 15% • ПОДАРКИ КАЖДОМУ 🎁
              </span>
              <Sparkles className="text-yellow-400 animate-pulse" size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-28 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* ГЛАВНАЯ КАРТОЧКА ПОЛЬЗОВАТЕЛЯ */}
        <ParallaxCard className="relative mb-12 gpu-accelerated">
          <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-10 overflow-hidden">
            {/* Анимированный градиентный бордер */}
            <BorderBeam />

            {/* Внутренний контент */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              {/* Аватар с голограммой */}
              <div className="relative group">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#d67a9d]/30 via-[#71b3c9]/30 to-[#ffd166]/30 blur-xl animate-spin-slow" />

                  <label htmlFor="avatar-input" className="cursor-pointer block">
                    <div className={`relative w-40 h-40 rounded-full border-2 ${uploading ? 'border-yellow-500' : 'border-transparent'} overflow-hidden bg-gradient-to-br from-black to-gray-900 p-1`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] rounded-full animate-spin" />
                      <div className="absolute inset-1 rounded-full bg-black" />
                      <img
                        src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=d67a9d&color=fff&bold=true&size=256`}
                        className="relative z-10 w-full h-full rounded-full object-cover"
                        alt="Аватар"
                      />

                      {uploading && (
                        <div className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center z-20">
                          <div className="w-12 h-12 border-4 border-[#d67a9d]/30 border-t-[#d67a9d] rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="absolute -bottom-2 -right-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] flex items-center justify-center border-4 border-black animate-pulse">
                        <User size={16} />
                      </div>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="avatar-input"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </div>
              </div>

              {/* Информация пользователя */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-4">
                  {/* ИЗМЕНЕНО: CYBER-AGENT НА ПОЛЬЗОВАТЕЛЬ */}
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#d67a9d]/20 to-[#71b3c9]/20 border border-white/10">
                    <span className="text-xs font-bold tracking-widest flex items-center gap-2">
                      <User size={12} className="text-yellow-400" />
                      ПОЛЬЗОВАТЕЛЬ
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4 mb-3">
                  {editingName ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="bg-black/50 border-2 border-[#d67a9d] rounded-xl px-6 py-3 text-3xl font-bold tracking-widest text-center lg:text-left min-w-[300px]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUsernameSave()
                          if (e.key === 'Escape') {
                            setEditingName(false)
                            setUsernameInput(user?.user_metadata?.username || '')
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUsernameSave}
                          className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <CheckCircle size={20} className="text-green-400" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingName(false)
                            setUsernameInput(user?.user_metadata?.username || '')
                          }}
                          className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                        >
                          <X size={20} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        {user?.user_metadata?.username || user?.email?.split('@')[0]?.toUpperCase()}
                      </h1>
                      <button
                        onClick={() => setEditingName(true)}
                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#d67a9d] hover:bg-[#d67a9d]/10 transition-all group"
                      >
                        <Edit3 size={20} className="text-white/60 group-hover:text-[#d67a9d]" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="w-2 h-2 rounded-full bg-[#d67a9d]" />
                    <span className="text-sm font-bold tracking-widest">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="w-2 h-2 rounded-full bg-[#71b3c9]" />
                    <span className="text-sm font-bold tracking-widest">ID: {user?.id?.slice(0, 8)}</span>
                  </div>
                </div>

                {/* НОВЫЙ БЛОК: ЗАКАЗЫ ВМЕСТО КЭШБЭКА */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-white/60 mb-1">ЗАКАЗЫ</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-yellow-400">{orders.length}</span>
                        <span className="text-sm text-white/40">завершено</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d67a9d] to-[#71b3c9] bg-opacity-20 flex items-center justify-center">
                        <Package size={28} className="bg-gradient-to-br from-[#d67a9d] to-[#71b3c9] bg-clip-text text-transparent" />
                      </div>
                    </div>
                  </div>

                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] rounded-full relative animate-gradient"
                      style={{ width: `${Math.min(orders.length * 10, 100)}%` }}
                    >
                      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-slide" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ParallaxCard>

        {/* БЫСТРЫЕ ДЕЙСТВИЯ С ОБНОВЛЕННОЙ КНОПКОЙ ПОМОЩИ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {quickActions.map((action, i) => (
            <ParallaxCard key={i} className="relative gpu-accelerated">
              {action.link ? (
                <Link href={action.link}>
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center group hover:border-white/30 transition-all duration-300">
                    <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${action.color}20` }}>
                      <action.icon size={28} style={{ color: action.color }} />
                    </div>
                    <p className="text-sm font-bold tracking-widest">{action.label}</p>
                    <div className="h-0.5 w-0 group-hover:w-full mx-auto mt-3 transition-all duration-300"
                      style={{ background: `linear-gradient(90deg, transparent, ${action.color}, transparent)` }} />
                  </div>
                </Link>
              ) : (
                <button
                  onClick={action.action}
                  className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center group hover:border-white/30 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${action.color}20` }}>
                    <action.icon size={28} style={{ color: action.color }} />
                  </div>
                  <p className="text-sm font-bold tracking-widest">{action.label}</p>
                  <div className="h-0.5 w-0 group-hover:w-full mx-auto mt-3 transition-all duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${action.color}, transparent)` }} />
                </button>
              )}
            </ParallaxCard>
          ))}
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ЛЕВАЯ КОЛОНКА - ТОЛЬКО СФЕРА С БОНУСАМИ (БЛОКИ СТАТИСТИКИ УДАЛЕНЫ) */}
          <div className="lg:w-2/5 space-y-8">
            {/* БАЛАНС В СФЕРЕ */}
            <ParallaxCard className="relative gpu-accelerated">
              <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-8 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#d67a9d]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#71b3c9]/10 rounded-full blur-3xl" />

                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                    <Gem size={16} className="text-[#ffd166]" />
                    <span className="text-xs font-bold tracking-widest">GIGA COINS</span>
                  </div>
                  <p className="text-sm text-white/60 mb-2">ВАШ БАЛАНС</p>
                </div>

                <div className="flex justify-center">
                  <AnimatedSphere value={userBonuses} />
                </div>

                <div className="text-center mt-6">
                  <Link href="/catalog">
                    <button className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] font-bold text-sm tracking-widest overflow-hidden">
                      <span className="relative z-10 flex items-center gap-3">
                        ПОТРАТИТЬ БОНУСЫ
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#71b3c9] to-[#d67a9d] animate-gradient" />
                    </button>
                  </Link>
                </div>
              </div>
            </ParallaxCard>

            {/* БЛОКИ СТАТИСТИКИ УДАЛЕНЫ */}
          </div>

          {/* ПРАВАЯ КОЛОНКА - ЗАКАЗЫ И ИСТОРИЯ */}
          <div className="lg:w-3/5">
            {/* ТАБЫ */}
            <div className="flex gap-2 mb-8 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-widest transition-all ${activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-white'
                  : 'text-white/60 hover:text-white'}`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Activity size={16} />
                  ОБЗОР
                </span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-widest transition-all ${activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-white'
                  : 'text-white/60 hover:text-white'}`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Package size={16} />
                  ЗАКАЗЫ ({orders.length})
                </span>
              </button>
            </div>

            {/* КОНТЕНТ ТАБОВ */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <ParallaxCard>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold tracking-widest flex items-center gap-2">
                          <TrendingUp size={20} className="text-green-400" />
                          ЛЕНТА НОВОСТЕЙ
                        </h3>
                        <span className="text-xs font-bold text-white/40">АКТУАЛЬНО</span>
                      </div>
                      <NewsFeed news={news} />
                    </div>
                  </ParallaxCard>
                </motion.div>
              ) : (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <ParallaxCard key={order.id}>
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                  <span className="text-xs font-bold tracking-widest text-[#71b3c9]">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                  </span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              </div>
                              <p className="text-lg font-bold">
                                {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-sm text-white/60 mt-1">{order.address}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-black bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] bg-clip-text text-transparent">
                                {order.total_amount.toLocaleString()} ₽
                              </p>
                              <div className="inline-flex items-center gap-2 mt-2 px-4 py-1 rounded-full bg-white/10">
                                <Truck size={12} />
                                <span className="text-xs font-bold tracking-widest">{order.status}</span>
                              </div>
                            </div>
                          </div>

                          {/* Голографический прогресс бар */}
                          <div className="relative mb-6">
                            <div className="flex justify-between text-xs font-bold text-white/40 mb-2">
                              <span>СТАТУС ДОСТАВКИ</span>
                              <span className="flex items-center gap-2">
                                <Target size={10} />
                                {order.status}
                              </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                              <div
                                className="h-full bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] rounded-full animate-gradient"
                                style={{ width: `${(Math.random() * 30 + 70)}%` }}
                              >
                                <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-slide" />
                              </div>
                            </div>
                          </div>

                          {/* Товары в голографическом стиле */}
                          {order.items && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex-shrink-0">
                                  <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                                    <div className="relative bg-black rounded-xl p-3 min-w-[180px]">
                                      <div className="flex items-center gap-3">
                                        <div className="relative">
                                          <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-14 h-14 rounded-lg object-cover"
                                          />
                                          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/50 to-transparent" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-white/60">x{item.quantity}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-xs font-bold text-[#71b3c9]">
                                              {(item.price * item.quantity).toLocaleString()} ₽
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </ParallaxCard>
                    ))
                  ) : (
                    <ParallaxCard>
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#d67a9d]/20 to-[#71b3c9]/20 flex items-center justify-center mx-auto mb-6">
                          <Package size={32} className="text-white/20" />
                        </div>
                        <p className="text-2xl font-bold tracking-widest mb-3">АКТИВНЫХ ЗАКАЗОВ НЕТ</p>
                        <p className="text-white/60 mb-8">Совершите первую покупку и получите бонусы!</p>
                        <Link href="/catalog">
                          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] font-bold text-sm tracking-widest hover:scale-105 transition-all">
                            ПЕРЕЙТИ В КАТАЛОГ
                          </button>
                        </Link>
                      </div>
                    </ParallaxCard>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* КНОПКА ВЫХОДА */}
        <div className="mt-16 text-center">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="group relative px-8 py-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-all"
          >
            <span className="text-sm font-bold tracking-widest text-white/60 group-hover:text-red-400 transition-colors">
              ЗАВЕРШИТЬ СЕССИЮ
            </span>
            <div className="absolute inset-x-4 bottom-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-red-500/50 transition-all" />
          </button>
        </div>
      </div>
    </main>
  )
}