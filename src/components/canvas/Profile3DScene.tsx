// src/components/canvas/Profile3DScene.tsx
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

// 1. СИСТЕМА ЧАСТИЦ ДЛЯ ЗВЕЗДНОГО НЕБА (улучшенная)
const StarField = () => {
  const meshRef = useRef<THREE.Points>(null!)
  const count = 5000
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count * 3; i += 3) {
      // Случайная позиция в сфере
      const radius = 50 + Math.random() * 300
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
      
      // Разные цвета звезд для реализма
      const brightness = Math.random()
      const color = new THREE.Color(
        brightness > 0.9 ? 0xd67a9d : 
        brightness > 0.8 ? 0x71b3c9 : 
        brightness > 0.7 ? 0xffd166 : 0xffffff
      )
      colors[i] = color.r
      colors[i + 1] = color.g
      colors[i + 2] = color.b
    }
    
    return { positions, colors }
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      // Очень медленное вращение для реализма
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.002
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={positions.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        sizeAttenuation
        vertexColors
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 2. НАСТОЯЩИЕ СНЕЖИНКИ С ПРАВИЛЬНОЙ ФОРМОЙ
const RealSnowflakes = () => {
  const groupRef = useRef<THREE.Group>(null!)
  const count = 500 // Меньше, но более качественных снежинок
  
  // Создаем текстуру для снежинки
  const snowflakeTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Прозрачный фон
      ctx.clearRect(0, 0, 64, 64)
      
      // Рисуем снежинку в виде шестиконечной звезды
      ctx.save()
      ctx.translate(32, 32)
      
      // Основной круг
      ctx.beginPath()
      ctx.arc(0, 0, 4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fill()
      
      // Лучи снежинки
      for (let i = 0; i < 6; i++) {
        ctx.save()
        ctx.rotate((i * Math.PI) / 3)
        
        // Основной луч
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, 12)
        ctx.lineWidth = 1.5
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.stroke()
        
        // Ветви луча
        for (let j = 1; j <= 2; j++) {
          const length = 5
          ctx.save()
          ctx.translate(0, j * 4)
          ctx.rotate(Math.PI / 3)
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(length, 0)
          ctx.stroke()
          ctx.restore()
          
          ctx.save()
          ctx.translate(0, j * 4)
          ctx.rotate(-Math.PI / 3)
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(length, 0)
          ctx.stroke()
          ctx.restore()
        }
        
        ctx.restore()
      }
      
      ctx.restore()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        Math.random() * 50,
        (Math.random() - 0.5) * 100 - 50
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        -Math.random() * 0.03 - 0.01,
        (Math.random() - 0.5) * 0.05
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      rotationSpeed: new THREE.Vector3(
        Math.random() * 0.02 - 0.01,
        Math.random() * 0.02 - 0.01,
        Math.random() * 0.02 - 0.01
      ),
      size: Math.random() * 0.2 + 0.1,
      wobble: {
        speed: Math.random() * 0.5 + 0.5,
        amount: Math.random() * 0.5 + 0.5
      }
    }))
  }, [count])

  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    
    snowflakes.forEach((flake, i) => {
      // Обновляем позицию с ветром
      flake.position.x += flake.velocity.x + Math.sin(time * flake.wobble.speed + i) * 0.01 * flake.wobble.amount
      flake.position.y += flake.velocity.y
      flake.position.z += flake.velocity.z + Math.cos(time * flake.wobble.speed + i) * 0.01 * flake.wobble.amount
      
      // Обновляем вращение
      flake.rotation.x += flake.rotationSpeed.x
      flake.rotation.y += flake.rotationSpeed.y
      flake.rotation.z += flake.rotationSpeed.z
      
      // Сброс позиции, если снежинка упала слишком низко
      if (flake.position.y < -30) {
        flake.position.set(
          (Math.random() - 0.5) * 100,
          50,
          (Math.random() - 0.5) * 100 - 50
        )
        flake.velocity.y = -Math.random() * 0.03 - 0.01
      }
    })
  })

  return (
    <group ref={groupRef}>
      {snowflakes.map((flake, i) => (
        <mesh
          key={i}
          position={flake.position}
          rotation={flake.rotation}
          scale={flake.size}
        >
          {/* Используем plane для спрайта снежинки */}
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={snowflakeTexture}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

// 3. СТИЛИЗОВАННЫЕ ПОДАРКИ ДЛЯ ФОНА
const GiftBox = ({ position, scale = 1, color = 0xd67a9d }: any) => {
  const meshRef = useRef<THREE.Group>(null!)
  const rotationSpeed = useMemo(() => Math.random() * 0.01 + 0.005, [])
  const floatSpeed = useMemo(() => Math.random() * 0.3 + 0.2, [])
  const floatHeight = useMemo(() => Math.random() * 0.5 + 0.2, [])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed) * floatHeight
    }
  })

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Основная коробка */}
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>
      
      {/* Лента вокруг */}
      <mesh position={[0, 0, 0.51]}>
        <boxGeometry args={[1.1, 0.1, 0.05]} />
        <meshStandardMaterial
          color={0xffd166}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>
      
      {/* Верхняя лента */}
      <mesh position={[0.51, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.1, 0.1, 0.05]} />
        <meshStandardMaterial
          color={0xffd166}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>
      
      {/* Бант */}
      <group position={[0, 0.35, 0.55]}>
        <mesh>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color={0xff6b9d}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.2, 0, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.08]} />
          <meshStandardMaterial
            color={0xff6b9d}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial
            color={0xff6b9d}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  )
}

// 4. МЯГКИЙ ПОДСВЕТКА
const AmbientLighting = () => {
  return (
    <>
      <ambientLight intensity={0.2} color={0xffffff} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={0.5} 
        color={0xd67a9d} 
        distance={50}
        decay={2}
      />
      <pointLight 
        position={[-10, 5, 5]} 
        intensity={0.4} 
        color={0x71b3c9} 
        distance={50}
        decay={2}
      />
      <pointLight 
        position={[5, 5, -10]} 
        intensity={0.4} 
        color={0xffd166} 
        distance={50}
        decay={2}
      />
    </>
  )
}

// 5. ТУМАН И АТМОСФЕРА
const FogAndAtmosphere = () => {
  return (
    <>
      {/* Темный фон */}
      <mesh position={[0, 0, -200]}>
        <sphereGeometry args={[180, 32, 32]} />
        <meshBasicMaterial
          color={0x000000}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Легкая дымка для глубины */}
      <mesh position={[0, 0, -150]}>
        <sphereGeometry args={[140, 32, 32]} />
        <meshBasicMaterial
          color={0x001122}
          side={THREE.BackSide}
          transparent
          opacity={0.1}
        />
      </mesh>
    </>
  )
}

// 6. ОСНОВНОЙ КОМПОНЕНТ 3D СЦЕНЫ
export default function Profile3DScene() {
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
      }}
    >
      <Canvas
        camera={{
          position: [0, 5, 20],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: -50,
          background: 'transparent', // Полностью прозрачный фон
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 1) // Черный фон
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
          
          // Добавляем туман для атмосферы
          scene.fog = new THREE.Fog(0x000000, 30, 150)
        }}
      >
        <AmbientLighting />
        
        <Suspense fallback={null}>
          <FogAndAtmosphere />
          <StarField />
          <RealSnowflakes />
          
          {/* Подарки на заднем плане */}
          <GiftBox position={[-15, -5, -35]} scale={2} color={0xd67a9d} />
          <GiftBox position={[18, -3, -40]} scale={1.8} color={0x71b3c9} />
          <GiftBox position={[-25, -8, -30]} scale={1.5} color={0xffd166} />
          <GiftBox position={[12, -10, -45]} scale={1.3} color={0xff6b9d} />
          <GiftBox position={[-8, -2, -50]} scale={1.7} color={0x71b3c9} />
          <GiftBox position={[25, -6, -35]} scale={1.4} color={0xd67a9d} />
          <GiftBox position={[-20, -12, -45]} scale={1.2} color={0xffd166} />
          <GiftBox position={[5, -15, -40]} scale={1.6} color={0xff6b9d} />
        </Suspense>
        
        {/* Пол (опционально) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial
            color={0x0a0a0a}
            metalness={0.2}
            roughness={0.9}
            transparent
            opacity={0.3}
          />
        </mesh>
      </Canvas>
    </div>
  )
}