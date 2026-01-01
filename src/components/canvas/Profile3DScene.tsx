// src/components/canvas/Profile3DScene.tsx
'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three'; // ✅ ПРАВИЛЬНО

// 1. УЛУЧШЕННАЯ СИСТЕМА ЧАСТИЦ ДЛЯ ЗВЕЗДНОГО НЕБА
const StarField = () => {
  const meshRef = useRef<THREE.Points>(null!)
  const count = 3000 // Много звезд для реалистичности
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count * 3; i += 3) {
      const radius = 100 + Math.random() * 200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
      
      const color = new THREE.Color(
        0xffffff
      )
      colors[i] = color.r
      colors[i + 1] = color.g
      colors[i + 2] = color.b
    }
    
    return { positions, colors }
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.005
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
  const count = 1500
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100
      positions[i + 1] = Math.random() * 50
      positions[i + 2] = (Math.random() - 0.5) * 100
      
      velocities[i] = (Math.random() - 0.5) * 0.02
      velocities[i + 1] = -Math.random() * 0.02 - 0.005
      velocities[i + 2] = (Math.random() - 0.5) * 0.02
    }
    
    return { positions, velocities }
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array
    const velocities = particles.velocities
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] += velocities[i] + Math.sin(state.clock.elapsedTime + i) * 0.005
      positions[i + 1] += velocities[i + 1]
      positions[i + 2] += velocities[i + 2] + Math.cos(state.clock.elapsedTime + i) * 0.005
      
      if (positions[i + 1] < -25) {
        positions[i] = (Math.random() - 0.5) * 100
        positions[i + 1] = 50
        positions[i + 2] = (Math.random() - 0.5) * 100
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true
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
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.9}
        color="#ffffff"
        blending={THREE.NormalBlending}
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
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.2
    }
  })

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>
      
      <mesh position={[0, 0, 0.51]}>
        <boxGeometry args={[1.1, 0.15, 0.05]} />
        <meshStandardMaterial
          color={0xffd166}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      <mesh position={[0, 0.25, 0.55]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color={0xff6b9d}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

// 4. НАСТОЯЩИЙ ДЕД МОРОЗ (детализированная модель)
const SantaClaus = () => {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
      groupRef.current.position.y = -8 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[0, -8, -40]} scale={1.5}>
      {/* Тело (шуба) */}
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[2, 5, 16]} />
        <meshStandardMaterial
          color={0xff0000}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Голова */}
      <mesh position={[0, 5.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={0xffccaa}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Шапка */}
      <mesh position={[0, 6.8, 0]}>
        <coneGeometry args={[1.3, 2, 16]} />
        <meshStandardMaterial
          color={0xff0000}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Помпон */}
      <mesh position={[0, 7.8, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={0xffffff}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>
      
      {/* Борода */}
      <mesh position={[0, 4.8, 0.8]}>
        <coneGeometry args={[1.4, 2.2, 16]} />
        <meshStandardMaterial
          color={0xffffff}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Усы */}
      <mesh position={[0, 5.2, 1]}>
        <cylinderGeometry args={[1.2, 1.2, 0.3, 16]} />
        <meshStandardMaterial
          color={0xffffff}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Глаза */}
      <mesh position={[-0.4, 5.8, 1.1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={0x000000}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0.4, 5.8, 1.1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={0x000000}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>
      
      {/* Нос */}
      <mesh position={[0, 5.4, 1.4]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={0xff6600}
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>
      
      {/* Ремень */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[1.1, 1.1, 0.3, 16]} />
        <meshStandardMaterial
          color={0x000000}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Пряжка */}
      <mesh position={[0, 0, 0.35]}>
        <boxGeometry args={[0.6, 0.4, 0.1]} />
        <meshStandardMaterial
          color={0xffd700}
          metalness={0.8}
          roughness={0.2}
          emissive={0xffd700}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Руки */}
      <mesh position={[1.8, 2, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.3, 0.2, 2.5, 16]} />
        <meshStandardMaterial
          color={0xff0000}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[-1.8, 2, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.3, 0.2, 2.5, 16]} />
        <meshStandardMaterial
          color={0xff0000}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Рукавицы */}
      <mesh position={[1.8, 0.8, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={0xff0000}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[-1.8, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={0xff0000}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Ноги */}
      <mesh position={[0.6, -2.5, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 2, 16]} />
        <meshStandardMaterial
          color={0xff0000}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[-0.6, -2.5, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 2, 16]} />
        <meshStandardMaterial
          color={0xff0000}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Сапоги */}
      <mesh position={[0.6, -3.5, 0.3]}>
        <boxGeometry args={[0.7, 0.6, 1]} />
        <meshStandardMaterial
          color={0x000000}
          metalness={0.3}
          roughness={0.9}
        />
      </mesh>
      <mesh position={[-0.6, -3.5, 0.3]}>
        <boxGeometry args={[0.7, 0.6, 1]} />
        <meshStandardMaterial
          color={0x000000}
          metalness={0.3}
          roughness={0.9}
        />
      </mesh>
      
      {/* Мешок с подарками */}
      <mesh position={[3, -2, -1]} rotation={[0, 0.5, -0.2]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial
          color={0x8b4513}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Свет от Деда Мороза */}
      <pointLight
        position={[0, 4, 2]}
        intensity={0.8}
        color={0xff4444}
        distance={20}
      />
    </group>
  )
}

// 5. АНИМИРОВАННЫЕ ОГНИ НА ЗАДНЕМ ПЛАНЕ
const BackgroundLights = () => {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 25
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <pointLight
            key={i}
            position={[x, Math.sin(angle * 2) * 3 + 5, z]}
            intensity={0.4}
            color={i % 4 === 0 ? 0xd67a9d : i % 4 === 1 ? 0x71b3c9 : i % 4 === 2 ? 0xffd166 : 0xff6b9d}
            distance={25}
            decay={2}
          />
        )
      })}
    </group>
  )
}

// 6. НЕБО И АТМОСФЕРА
const SkyAndAtmosphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!)

  return (
    <>
      {/* Глубокий фон (космос) */}
      <mesh position={[0, 0, -200]} ref={meshRef}>
        <sphereGeometry args={[180, 32, 32]} />
        <meshBasicMaterial
          color={0x000011}
          side={THREE.BackSide}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Легкая дымка/туман */}
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
          position: [0, 0, 20],
          fov: 50,
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
          background: 'transparent', // УБРАН СИНИЙ ФОН!
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0) // Прозрачный фон!
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        }}
      >
        {/* Основное освещение */}
        <ambientLight intensity={0.3} color={0xffffff} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.4}
          color={0xffffff}
        />
        
        <BackgroundLights />
        
        {/* Графические эффекты */}
        <Suspense fallback={null}>
          <SkyAndAtmosphere />
          <StarField />
          <Snowfall />
          
          {/* Подарки на заднем плане */}
          <GiftBox position={[-15, -5, -30]} scale={1.5} color={0xd67a9d} />
          <GiftBox position={[12, -3, -35]} scale={1.3} color={0x71b3c9} />
          <GiftBox position={[-8, -8, -25]} scale={1} color={0xffd166} />
          <GiftBox position={[18, -6, -40]} scale={0.9} color={0xff6b9d} />
          <GiftBox position={[-20, -2, -45]} scale={1.2} color={0xd67a9d} />
          <GiftBox position={[5, -10, -30]} scale={0.8} color={0x71b3c9} />
          
          {/* Настоящий Дед Мороз на фоне */}
          <SantaClaus />
        </Suspense>
      </Canvas>
    </div>
  )
}