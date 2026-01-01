'use client'

import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
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

// 1. OPTIMIZED INSTANCEDMESH ДЛЯ СНЕЖИНОК
const SnowflakesInstanced = () => {
  const meshRef = useRef<InstancedMesh>(null!)
  const count = 120
  const dummy = useMemo(() => new Object3D(), [])
  const lastUpdate = useRef(0)
  const updateInterval = 16 // ~60 FPS

  const types = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      size: 0.05 + Math.random() * 0.1,
      speed: 0.2 + Math.random() * 0.3,
      rotationSpeed: Math.random() * 0.02,
      xOffset: (Math.random() - 0.5) * 2,
      zDepth: -Math.random() * 100 - 10,
      yStart: Math.random() * 20 - 10,
      xRotation: Math.random() * Math.PI * 2,
      yRotation: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2
    })), [count]
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const delta = Math.min(state.clock.getDelta(), 0.1) // Защита от больших delta

    // Оптимизация: обновляем только при необходимости
    if (time - lastUpdate.current < updateInterval / 1000) return

    for (let i = 0; i < count; i++) {
      const snowflake = types[i]
      const progress = ((time * snowflake.speed) + snowflake.phase) % 1

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
    lastUpdate.current = time
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

// 2. OPTIMIZED INSTANCEDMESH ДЛЯ ПОДАРКОВ
const GiftsInstanced = () => {
  const meshRef = useRef<InstancedMesh>(null!)
  const count = 25
  const dummy = useMemo(() => new Object3D(), [])
  const lastUpdate = useRef(0)

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
      wobbleAmount: Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    })), [count]
  )

  // Инициализация цветов один раз
  useEffect(() => {
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const color = types[i].color
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    meshRef.current.geometry.setAttribute('color',
      new THREE.InstancedBufferAttribute(colors, 3)
    )
  }, [types])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Оптимизация: пропускаем кадры для слабых ПК
    if (time - lastUpdate.current < 0.032) return // ~30 FPS

    for (let i = 0; i < count; i++) {
      const gift = types[i]
      const progress = ((time * gift.speed) + gift.phase) % 1

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

      // Сброс позиции
      if (y < -15) {
        dummy.position.y = gift.yStart
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    lastUpdate.current = time
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
        vertexColors={true}
      />
    </instancedMesh>
  )
}

// 3. OPTIMIZED INSTANCEDMESH ДЛЯ ЗВЕЗД
const StarsInstanced = () => {
  const meshRef = useRef<InstancedMesh>(null!)
  const count = 200
  const dummy = useMemo(() => new Object3D(), [])
  const lastUpdate = useRef(0)

  const types = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      size: 0.02 + Math.random() * 0.03,
      x: (Math.random() - 0.5) * 50,
      y: (Math.random() - 0.5) * 50,
      z: -Math.random() * 200 - 50,
      pulseSpeed: Math.random() * 0.5 + 0.2,
      pulseOffset: Math.random() * Math.PI * 2
    })), [count]
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Оптимизация: звезды пульсируют медленнее
    if (time - lastUpdate.current < 0.05) return // ~20 FPS

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
    lastUpdate.current = time
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

// 4. OPTIMIZED КОСМИЧЕСКИЕ ЛУЧИ
const SpaceBeamsOptimized = () => {
  const linesRef = useRef<THREE.LineSegments>(null!)
  const lastUpdate = useRef(0)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (time - lastUpdate.current < 0.016) return // ~60 FPS

    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.01
    }
    lastUpdate.current = time
  })

  // Мемоизированная геометрия
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
  const { scene } = useThree()

  // Оптимизация: автоматическая очистка при скрытии страницы
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.visible = false
          }
        })
      } else {
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.visible = true
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [scene])

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

// 7. OPTIMIZED КОНТЕЙНЕР CANVAS
const ThreeDBackgroundContainer = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -50,
        transform: 'translate3d(0,0,0)',
      }}
    >
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
          depth: true,
          preserveDrawingBuffer: false
        }}
        dpr={[1, 1.5]}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          touchAction: 'none',
          zIndex: -50,
        }}
        performance={{
          min: 0.5,
          current: 1,
          debounce: 1000
        }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        }}
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

  const handleClick = useCallback(() => {
    if (isOpen) return

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

    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [isOpen])

  // Оптимизированный конфетти с useMemo
  const confettiParticles = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      xStart: 50 + Math.sin(i) * 20,
      yStart: 100,
      xEnd: Math.random() * 100,
      yEnd: -100,
      rotation: Math.random() * 720,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 2,
      size: Math.random() * 20 + 10,
      color: ['#d67a9d', '#71b3c9', '#ffd166', '#ff6b9d', '#4da6cc'][Math.floor(Math.random() * 5)],
      emoji: ['🎉', '✨', '⭐', '🎁', '🎊'][Math.floor(Math.random() * 5)]
    })), []
  )

  return (
    <>
      {/* Оптимизированный конфетти эффект */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            ref={confettiRef}
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute text-2xl"
                style={{
                  left: `${particle.xStart}vw`,
                  top: `${particle.yStart}vh`,
                  color: particle.color,
                  fontSize: `${particle.size}px`
                }}
                animate={{
                  x: [`${particle.xStart}vw`, `${particle.xEnd}vw`],
                  y: [`${particle.yStart}vh`, `${particle.yEnd}vh`],
                  rotate: [0, particle.rotation],
                  scale: [0, 1, 0.5],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  times: [0, 0.1, 0.9, 1],
                  ease: "easeOut"
                }}
              >
                {particle.emoji}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
          repeatDelay: 1,
          ease: "easeInOut"
        }}
        onClick={handleClick}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Аврора эффект */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-50"
          style={{
            background: 'linear-gradient(45deg, #d67a9d, #ff6b9d, #71b3c9, #4da6cc)',
            backgroundSize: '400% 400%'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="relative bg-gradient-to-br from-[#d67a9d] via-[#71b3c9] to-[#ffd166] p-1.5 rounded-2xl shadow-2xl">
          <div className="bg-black rounded-xl p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12"
                >
                  <Gift className="w-full h-full text-yellow-400" />
                </motion.div>
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
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 50 + 45 * Math.cos((i * 45 * Math.PI) / 180),
      top: 50 + 45 * Math.sin((i * 45 * Math.PI) / 180),
      color: i % 3 === 0 ? '#d67a9d' : i % 3 === 1 ? '#71b3c9' : '#ffd166'
    })), []
  )

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-56 h-56">
        {/* Внешняя аура */}
        <motion.div
          className="absolute -inset-10 rounded-full bg-gradient-to-r from-[#d67a9d]/20 via-[#71b3c9]/20 to-[#ffd166]/20 blur-3xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Средняя сфера */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-r from-[#d67a9d]/40 via-[#71b3c9]/40 to-transparent blur-lg"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

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
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              background: `linear-gradient(45deg, ${particle.color}, transparent)`
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 2,
              delay: particle.id * 0.1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}

// OPTIMIZED ПАРАЛЛАКС КАРТОЧКА
const ParallaxCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), {
    stiffness: 300,
    damping: 30,
    mass: 0.5
  })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), {
    stiffness: 300,
    damping: 30,
    mass: 0.5
  })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      className={`${className} will-change-transform`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.5
      }}
    >
      {children}
    </motion.div>
  )
}

// АНИМИРОВАННЫЙ ГРАДИЕНТНЫЙ БОРДЕР
const BorderBeam = () => {
  return (
    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
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
        animate={{
          backgroundPosition: ['0% 0%', '300% 300%']
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

// ==================== CSS АНИМАЦИИ ДЛЯ ОПТИМИЗАЦИИ ====================
const OptimizedAnimations = () => {
  useEffect(() => {
    // Добавляем CSS анимации в документ только один раз
    if (document.querySelector('#optimized-animations')) return

    const style = document.createElement('style')
    style.id = 'optimized-animations'
    style.textContent = `
      @keyframes gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      @keyframes slide {
        0% { transform: translateX(-100%) skewX(12deg); }
        100% { transform: translateX(400%) skewX(12deg); }
      }
      
      @keyframes slideDown {
        0% { transform: translateY(-100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      
      .animate-gradient {
        animation: gradient 6s ease infinite;
        background-size: 400% 400%;
      }
      
      .animate-slide {
        animation: slide 3s linear infinite;
      }
      
      .animate-slideDown {
        animation: slideDown 0.5s ease-out;
      }
      
      /* GPU оптимизации */
      .gpu-accelerated {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        will-change: transform, opacity;
        contain: layout style paint;
      }
      
      /* Оптимизация для изображений */
      img {
        content-visibility: auto;
      }
      
      /* Улучшение производительности скролла */
      .overflow-auto {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
    `
    document.head.appendChild(style)

    return () => {
      const existingStyle = document.querySelector('#optimized-animations')
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
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
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 mx-auto mb-6"
                  >
                    <CardIcon className="w-full h-full text-cyan-400" />
                  </motion.div>

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
            <div className="flex flex-col md:flex-row gap-4">
              {item.image_url && (
                <div className="flex-shrink-0 w-full md:w-32 h-32 rounded-xl overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
                  <h3 className="text-lg font-bold tracking-widest line-clamp-2">{item.title}</h3>
                  <span className="text-xs text-white/40 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-3">{item.content}</p>
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
  const [isClient, setIsClient] = useState(false)

  // Инициализация клиентского рендеринга
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Загрузка данных пользователя
  useEffect(() => {
    if (!isClient) return

    const getData = async () => {
      try {
        setLoading(true)

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        if (authError || !authUser) {
          router.push('/login')
          return
        }

        const userData: UserProfile = {
          id: authUser.id,
          email: authUser.email || undefined,
          user_metadata: authUser.user_metadata as any || {}
        }

        setUser(userData)

        // Загрузка профиля
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, avatar_url, available_points')
          .eq('id', authUser.id)
          .single()

        if (!profileError && profileData) {
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

        // Загрузка заказов
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(20)

        if (!ordersError && ordersData) {
          setOrders(ordersData)
        }

        // Загрузка новостей
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (!newsError && newsData) {
          setNews(newsData)
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        toast.error('Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
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

  // Быстрые действия с оптимизацией
  const quickActions = useMemo(() => [
    { label: 'НОВЫЙ ЗАКАЗ', icon: ShoppingCart, color: '#d67a9d', link: '/catalog' },
    { label: 'ПОПОЛНИТЬ', icon: CreditCard, color: '#71b3c9', action: () => setTopUpModalOpen(true) },
    { label: 'ПОДАРКИ', icon: Gift, color: '#ffd166', link: '/layout/BonusSystem' },
    { label: 'ПОМОЩЬ', icon: LifeBuoy, color: '#ff6b9d', link: '/contacts' },
  ], [])

  // 1. Блок загрузки (isClient или loading)
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
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
  }

  return (
    <>
      {/* Модальные окна и фоновые компоненты */}
      <TopUpModal isOpen={topUpModalOpen} onClose={() => setTopUpModalOpen(false)} />
      <OptimizedAnimations />
      <ThreeDBackgroundContainer />
      <MagicGift />

      {/* Новогодний топ-баннер */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="bg-gradient-to-r from-[#d67a9d]/10 via-[#71b3c9]/10 to-[#ffd166]/10 backdrop-blur-2xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="text-yellow-400 flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-bold tracking-widest bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-center">
                🎄 НОВОГОДНИЙ СЕЗОН • КЭШБЭК ДО 15% • ПОДАРКИ КАЖДОМУ 🎁
              </span>
              <Sparkles className="text-yellow-400 flex-shrink-0" size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="relative min-h-screen bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 text-white">
        <div className="relative z-10 pt-24 sm:pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
          {/* 3. Весь контент страницы */}
          {/* ГЛАВНАЯ КАРТОЧКА ПОЛЬЗОВАТЕЛЯ */}
          <ParallaxCard className="relative mb-8 sm:mb-12 gpu-accelerated">
            <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-6 sm:p-8 md:p-10 overflow-hidden">
              {/* Анимированный градиентный бордер */}
              <BorderBeam />

              {/* Внутренний контент */}
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
                {/* Аватар с голограммой */}
                <div className="relative group">
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#d67a9d]/30 via-[#71b3c9]/30 to-[#ffd166]/30 blur-xl"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />

                    <label htmlFor="avatar-input" className="cursor-pointer block">
                      <div className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 ${uploading ? 'border-yellow-500' : 'border-transparent'} overflow-hidden bg-gradient-to-br from-black to-gray-900 p-1`}>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-1 rounded-full bg-black" />
                        <img
                          src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=d67a9d&color=fff&bold=true&size=256`}
                          className="relative z-10 w-full h-full rounded-full object-cover"
                          alt="Аватар"
                          loading="eager"
                        />

                        {uploading && (
                          <motion.div
                            className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center z-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#d67a9d]/30 border-t-[#d67a9d] rounded-full animate-spin" />
                          </motion.div>
                        )}
                      </div>

                      <div className="absolute -bottom-2 -right-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] flex items-center justify-center border-4 border-black">
                          <User size={12} className="sm:w-4 sm:h-4" />
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
                  <div className="inline-flex items-center gap-2 sm:gap-3 mb-4">
                    <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#d67a9d]/20 to-[#71b3c9]/20 border border-white/10">
                      <span className="text-xs font-bold tracking-widest flex items-center gap-1.5 sm:gap-2">
                        <User size={10} className="sm:w-3 sm:h-3 text-yellow-400" />
                        ПОЛЬЗОВАТЕЛЬ
                      </span>
                    </div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-3">
                    {editingName ? (
                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                        <input
                          type="text"
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          className="bg-black/50 border-2 border-[#d67a9d] rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-2xl sm:text-3xl font-bold tracking-widest text-center lg:text-left w-full sm:w-auto min-w-0"
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
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                          >
                            <CheckCircle size={16} className="sm:w-5 sm:h-5 text-green-400" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingName(false)
                              setUsernameInput(user?.user_metadata?.username || '')
                            }}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                          >
                            <X size={16} className="sm:w-5 sm:h-5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent break-words">
                          {user?.user_metadata?.username || user?.email?.split('@')[0]?.toUpperCase()}
                        </h1>
                        <button
                          onClick={() => setEditingName(true)}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#d67a9d] hover:bg-[#d67a9d]/10 transition-all group"
                        >
                          <Edit3 size={18} className="sm:w-5 sm:h-5 text-white/60 group-hover:text-[#d67a9d]" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 mb-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-white/60">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#d67a9d]" />
                      <span className="text-xs sm:text-sm font-bold tracking-widest truncate max-w-[200px] sm:max-w-none">
                        {user?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-white/60">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#71b3c9]" />
                      <span className="text-xs sm:text-sm font-bold tracking-widest">
                        ID: {user?.id?.slice(0, 8)}
                      </span>
                    </div>
                  </div>

                  {/* БЛОК ЗАКАЗОВ */}
                  <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs font-bold tracking-widest text-white/60 mb-1">ЗАКАЗЫ</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-yellow-400">{orders.length}</span>
                          <span className="text-xs sm:text-sm text-white/40">завершено</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#d67a9d] to-[#71b3c9] bg-opacity-20 flex items-center justify-center">
                          <Package size={24} className="sm:w-7 sm:h-7 bg-gradient-to-br from-[#d67a9d] to-[#71b3c9] bg-clip-text text-transparent" />
                        </div>
                      </div>
                    </div>

                    <div className="h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] rounded-full relative animate-gradient"
                        style={{ width: `${Math.min(orders.length * 10, 100)}%` }}
                      >
                        <div className="absolute top-0 left-0 w-16 sm:w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-slide" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ParallaxCard>

          {/* БЫСТРЫЕ ДЕЙСТВИЯ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
            {quickActions.map((action, i) => (
              <ParallaxCard key={i} className="relative gpu-accelerated">
                {action.link ? (
                  <Link href={action.link} className="block">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 text-center group hover:border-white/30 transition-all duration-300 h-full">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `${action.color}20` }}>
                        <action.icon size={20} className="sm:w-7 sm:h-7" style={{ color: action.color }} />
                      </div>
                      <p className="text-xs sm:text-sm font-bold tracking-widest">{action.label}</p>
                      <div className="h-0.5 w-0 group-hover:w-full mx-auto mt-2 sm:mt-3 transition-all duration-300"
                        style={{ background: `linear-gradient(90deg, transparent, ${action.color}, transparent)` }} />
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={action.action}
                    className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 text-center group hover:border-white/30 transition-all duration-300 h-full"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${action.color}20` }}>
                      <action.icon size={20} className="sm:w-7 sm:h-7" style={{ color: action.color }} />
                    </div>
                    <p className="text-xs sm:text-sm font-bold tracking-widest">{action.label}</p>
                    <div className="h-0.5 w-0 group-hover:w-full mx-auto mt-2 sm:mt-3 transition-all duration-300"
                      style={{ background: `linear-gradient(90deg, transparent, ${action.color}, transparent)` }} />
                  </button>
                )}
              </ParallaxCard>
            ))}
          </div>

          {/* ОСНОВНОЙ КОНТЕНТ */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* ЛЕВАЯ КОЛОНКА - СФЕРА С БОНУСАМИ */}
            <div className="lg:w-2/5">
              <ParallaxCard className="relative gpu-accelerated">
                <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-6 sm:p-8 overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-32 h-32 sm:w-40 sm:h-40 bg-[#d67a9d]/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-32 h-32 sm:w-40 sm:h-40 bg-[#71b3c9]/10 rounded-full blur-3xl" />

                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                      <Gem size={14} className="sm:w-4 sm:h-4 text-[#ffd166]" />
                      <span className="text-xs font-bold tracking-widest">GIGA COINS</span>
                    </div>
                    <p className="text-sm text-white/60 mb-2">ВАШ БАЛАНС</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-48 h-48 sm:w-56 sm:h-56">
                      <AnimatedSphere value={userBonuses} />
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <Link href="/catalog">
                      <button className="group relative px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] font-bold text-xs sm:text-sm tracking-widest overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                          ПОТРАТИТЬ БОНУСЫ
                          <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#71b3c9] to-[#d67a9d]"
                          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        />
                      </button>
                    </Link>
                  </div>
                </div>
              </ParallaxCard>
            </div>

            {/* ПРАВАЯ КОЛОНКА - ЗАКАЗЫ И ИСТОРИЯ */}
            <div className="lg:w-3/5">
              {/* ТАБЫ */}
              <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 p-1 sm:p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-sm tracking-widest transition-all ${activeTab === 'overview'
                    ? 'bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-white'
                    : 'text-white/60 hover:text-white'}`}
                >
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Activity size={14} className="sm:w-4 sm:h-4" />
                    ОБЗОР
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-sm tracking-widest transition-all ${activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] text-white'
                    : 'text-white/60 hover:text-white'}`}
                >
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Package size={14} className="sm:w-4 sm:h-4" />
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
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
                          <h3 className="text-lg font-bold tracking-widest flex items-center gap-2">
                            <TrendingUp size={18} className="sm:w-5 sm:h-5 text-green-400" />
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
                          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                  <div className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-white/5 border border-white/10">
                                    <span className="text-xs font-bold tracking-widest text-[#71b3c9]">
                                      #{order.id.slice(0, 8).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" />
                                </div>
                                <p className="text-base sm:text-lg font-bold truncate">
                                  {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-xs sm:text-sm text-white/60 mt-1 truncate">{order.address}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] bg-clip-text text-transparent">
                                  {order.total_amount.toLocaleString()} ₽
                                </p>
                                <div className="inline-flex items-center gap-1.5 sm:gap-2 mt-2 px-3 py-1 sm:px-4 sm:py-1 rounded-full bg-white/10">
                                  <Truck size={10} className="sm:w-3 sm:h-3" />
                                  <span className="text-xs font-bold tracking-widest">{order.status}</span>
                                </div>
                              </div>
                            </div>

                            {/* Прогресс бар */}
                            <div className="relative mb-6">
                              <div className="flex justify-between text-xs font-bold text-white/40 mb-2">
                                <span>СТАТУС ДОСТАВКИ</span>
                                <span className="flex items-center gap-1.5 sm:gap-2">
                                  <Target size={8} className="sm:w-2.5 sm:h-2.5" />
                                  {order.status}
                                </span>
                              </div>
                              <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden relative">
                                <div
                                  className="h-full bg-gradient-to-r from-[#d67a9d] via-[#71b3c9] to-[#ffd166] rounded-full animate-gradient"
                                  style={{ width: `${(Math.random() * 30 + 70)}%` }}
                                >
                                  <div className="absolute top-0 left-0 w-12 sm:w-20 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-slide" />
                                </div>
                              </div>
                            </div>

                            {/* Товары */}
                            {order.items && (
                              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                                {order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex-shrink-0">
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                                      <div className="relative bg-black rounded-xl p-2 sm:p-3 min-w-[140px] sm:min-w-[180px]">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                          <div className="relative">
                                            <img
                                              src={item.image}
                                              alt={item.name}
                                              className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg object-cover"
                                              loading="lazy"
                                            />
                                            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/50 to-transparent" />
                                          </div>
                                          <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-bold line-clamp-1">{item.name}</p>
                                            <div className="flex items-center gap-1 sm:gap-2 mt-1">
                                              <span className="text-xs text-white/60">x{item.quantity}</span>
                                              <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-white/20" />
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
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 sm:p-12 text-center">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#d67a9d]/20 to-[#71b3c9]/20 flex items-center justify-center mx-auto mb-6">
                            <Package size={24} className="sm:w-8 sm:h-8 text-white/20" />
                          </div>
                          <p className="text-xl sm:text-2xl font-bold tracking-widest mb-3">АКТИВНЫХ ЗАКАЗОВ НЕТ</p>
                          <p className="text-white/60 mb-6 sm:mb-8 text-sm sm:text-base">Совершите первую покупку и получите бонусы!</p>
                          <Link href="/catalog">
                            <button className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-[#d67a9d] to-[#71b3c9] font-bold text-xs sm:text-sm tracking-widest hover:scale-105 transition-all">
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
          <div className="mt-12 sm:mt-16 text-center">
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/')
              }}
              className="group relative px-6 py-3 sm:px-8 sm:py-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-all"
            >
              <span className="text-xs sm:text-sm font-bold tracking-widest text-white/60 group-hover:text-red-400 transition-colors">
                ЗАВЕРШИТЬ СЕССИЮ
              </span>
              <div className="absolute inset-x-4 bottom-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-red-500/50 transition-all" />
            </button>
          </div>
        </div>
      </main>
    </>
  )
}