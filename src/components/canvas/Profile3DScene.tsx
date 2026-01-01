// ==================== ОБНОВЛЕННЫЙ КОМПОНЕНТ 3D СЦЕНЫ ====================
// Вставьте этот код ВМЕСТО текущего Profile3DScene.tsx

'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

// 1. УЛУЧШЕННАЯ СИСТЕМА ЧАСТИЦ ДЛЯ ЗВЕЗДНОГО НЕБА
const StarField = () => {
  const meshRef = useRef<THREE.Points>(null!)
  const count = 5000 // Больше звезд
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count * 3; i += 3) {
      // Случайная позиция в сфере
      const radius = 50 + Math.random() * 200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
      
      // Разные цвета звезд
      const color = new THREE.Color(
        Math.random() > 0.8 ? 0xd67a9d : 
        Math.random() > 0.6 ? 0x71b3c9 : 
        Math.random() > 0.4 ? 0xffd166 : 0xffffff
      )
      colors[i] = color.r
      colors[i + 1] = color.g
      colors[i + 2] = color.b
    }
    
    return { positions, colors }
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      // Медленное вращение звездного поля
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.01
      // Легкое мерцание
      const scale = 0.9 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.scale.setScalar(scale)
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
        size={0.5}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 2. СИСТЕМА ЧАСТИЦ ДЛЯ ПАДАЮЩИХ СНЕЖИНОК
const Snowfall = () => {
  const meshRef = useRef<THREE.Points>(null!)
  const count = 2000
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100
      positions[i + 1] = Math.random() * 50
      positions[i + 2] = (Math.random() - 0.5) * 100
      
      velocities[i] = (Math.random() - 0.5) * 0.05 // X скорость
      velocities[i + 1] = -Math.random() * 0.05 - 0.01 // Y скорость (вниз)
      velocities[i + 2] = (Math.random() - 0.5) * 0.05 // Z скорость
      
      sizes[i / 3] = Math.random() * 0.2 + 0.05 // Размер снежинки
    }
    
    return { positions, velocities, sizes }
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array
    const velocities = particles.velocities
    
    for (let i = 0; i < count * 3; i += 3) {
      // Обновление позиции
      positions[i] += velocities[i] + Math.sin(state.clock.elapsedTime + i) * 0.01
      positions[i + 1] += velocities[i + 1]
      positions[i + 2] += velocities[i + 2] + Math.cos(state.clock.elapsedTime + i) * 0.01
      
      // Сброс позиции, если снежинка упала слишком низко
      if (positions[i + 1] < -25) {
        positions[i] = (Math.random() - 0.5) * 100
        positions[i + 1] = 50
        positions[i + 2] = (Math.random() - 0.5) * 100
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true
    
    // Легкое вращение всей системы снега
    meshRef.current.rotation.y += 0.0001
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        transparent
        opacity={0.9}
        color="#ffffff"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// 3. 3D МОДЕЛЬ ПОДАРКА
const GiftBox = ({ position, scale = 1, color = 0xd67a9d }: any) => {
  const meshRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      // Плавающая анимация
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.3
    }
  })

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Основная коробка */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Лента */}
      <mesh position={[0, 0, 0.51]}>
        <boxGeometry args={[1.2, 0.2, 0.1]} />
        <meshStandardMaterial
          color={0xffd166}
          metalness={0.5}
          roughness={0.2}
          emissive={0xffd166}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Бант */}
      <mesh position={[0, 0.3, 0.6]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color={0xff6b9d}
          metalness={0.5}
          roughness={0.2}
          emissive={0xff6b9d}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  )
}

// 4. СТИЛИЗОВАННАЯ МОДЕЛЬ ДЕДА МОРОЗА
const SantaClaus = () => {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Плавное покачивание
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // Медленное движение вперед-назад
      groupRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.1) * 2
    }
  })

  return (
    <group ref={groupRef} position={[0, -5, -15]}>
      {/* Тело */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial
          color={0xff0000}
          metalness={0.2}
          roughness={0.5}
          emissive={0xff0000}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Голова */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color={0xffccaa}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Шапка */}
      <mesh position={[0, 4.2, 0]}>
        <coneGeometry args={[0.9, 1.5, 8]} />
        <meshStandardMaterial
          color={0xff0000}
          metalness={0.2}
          roughness={0.5}
          emissive={0xff0000}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Помпон на шапке */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial
          color={0xffffff}
          emissive={0xffffff}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Борода */}
      <mesh position={[0, 2.8, 0.8]}>
        <coneGeometry args={[0.9, 1.2, 8]} />
        <meshStandardMaterial
          color={0xffffff}
          metalness={0.3}
          roughness={0.7}
          emissive={0xffffff}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Мешок с подарками */}
      <mesh position={[1.5, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial
          color={0x8B4513}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Освещение для Деда Мороза */}
      <pointLight
        position={[0, 4, 2]}
        intensity={1}
        color={0xff6666}
        distance={10}
      />
    </group>
  )
}

// 5. АНИМИРОВАННЫЕ ОГНИ
const AnimatedLights = () => {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Вращающиеся цветные огни */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 20
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <pointLight
            key={i}
            position={[x, 5, z]}
            intensity={0.8}
            color={i % 3 === 0 ? 0xd67a9d : i % 3 === 1 ? 0x71b3c9 : 0xffd166}
            distance={30}
            decay={2}
          />
        )
      })}
    </group>
  )
}

// 6. ОБЛАКА ИЗ ЧАСТИЦ
const MagicClouds = () => {
  const groupRef = useRef<THREE.Group>(null!)
  const cloudsCount = 5
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((cloud, i) => {
        cloud.position.x = Math.sin(state.clock.elapsedTime * 0.1 + i) * 10
        cloud.position.y = Math.sin(state.clock.elapsedTime * 0.2 + i * 2) * 2 + 10
        cloud.rotation.y += 0.001
      })
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: cloudsCount }).map((_, i) => {
        const x = (i - cloudsCount / 2) * 15
        const y = Math.random() * 5 + 10
        const z = -30 - Math.random() * 20
        
        return (
          <mesh key={i} position={[x, y, z]} castShadow>
            <sphereGeometry args={[2 + Math.random() * 1, 8, 8]} />
            <meshStandardMaterial
              color={0xffffff}
              transparent
              opacity={0.1}
              emissive={0xffffff}
              emissiveIntensity={0.05}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// 7. ОСНОВНОЙ КОМПОНЕНТ 3D СЦЕНЫ
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
          position: [0, 5, 15],
          fov: 60,
          near: 0.1,
          far: 500,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: -50,
          background: 'linear-gradient(to bottom, #000428, #004e92)',
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        shadows
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 1)
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
          
          // Включение тумана для глубины
          scene.fog = new THREE.Fog(0x000428, 20, 100)
        }}
      >
        {/* Основное освещение */}
        <ambientLight intensity={0.3} color={0xffffff} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.5}
          color={0xffffff}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <AnimatedLights />
        
        {/* Графические эффекты */}
        <Suspense fallback={null}>
          <StarField />
          <Snowfall />
          <MagicClouds />
          
          {/* Подарки */}
          <GiftBox position={[-8, 2, -10]} scale={1.5} color={0xd67a9d} />
          <GiftBox position={[8, 1, -12]} scale={1.2} color={0x71b3c9} />
          <GiftBox position={[-5, -1, -8]} scale={1} color={0xffd166} />
          <GiftBox position={[6, -2, -14]} scale={0.8} color={0xff6b9d} />
          
          {/* Дед Мороз */}
          <SantaClaus />
        </Suspense>
        
        {/* Пол с отражением */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            color={0x1a1a2e}
            metalness={0.5}
            roughness={0.8}
            emissive={0x1a1a2e}
            emissiveIntensity={0.1}
          />
        </mesh>
      </Canvas>
    </div>
  )
}