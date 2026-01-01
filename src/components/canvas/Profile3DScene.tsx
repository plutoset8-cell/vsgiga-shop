// src/components/canvas/Profile3DScene.tsx
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

// 1. СИСТЕМА ЧАСТИЦ ДЛЯ ЗВЕЗДНОГО НЕБА
const StarField = () => {
  const meshRef = useRef<THREE.Points>(null!)
  const count = 2000
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count * 3; i += 3) {
      // Равномерное распределение в сфере
      const radius = 50 + Math.random() * 250
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
    }
    
    return positions
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0001
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        sizeAttenuation
        transparent
        opacity={1}
        color="#ffffff"
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 2. НАСТОЯЩИЕ ПЛАВНЫЕ СНЕЖИНКИ
const RealSnowflakes = () => {
  const groupRef = useRef<THREE.Group>(null!)
  const count = 400 // Оптимальное количество для плавности
  
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const speed = Math.random() * 0.02 + 0.01 // Скорость падения
      const drift = (Math.random() - 0.5) * 0.02 // Случайный дрейф
      const rotationSpeed = Math.random() * 0.02 + 0.005 // Скорость вращения
      
      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 80, // X от -40 до 40
          30 + Math.random() * 40,    // Y начальная позиция
          (Math.random() - 0.5) * 80  // Z от -40 до 40
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotationSpeed: new THREE.Vector3(
          rotationSpeed * (Math.random() - 0.5),
          rotationSpeed,
          rotationSpeed * (Math.random() - 0.5)
        ),
        speed,
        drift,
        size: Math.random() * 0.08 + 0.04, // Размер снежинки
        wobble: {
          frequency: Math.random() * 0.5 + 0.3,
          amplitude: Math.random() * 0.3 + 0.1
        }
      }
    })
  }, [count])

  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    
    snowflakes.forEach((flake) => {
      // Плавное падение с дрейфом
      flake.position.y -= flake.speed
      
      // Плавные колебания из стороны в сторону
      flake.position.x += Math.sin(time * flake.wobble.frequency + flake.position.z) * flake.wobble.amplitude * 0.01
      flake.position.z += Math.cos(time * flake.wobble.frequency + flake.position.x) * flake.wobble.amplitude * 0.01
      
      // Небольшой дрейф
      flake.position.x += flake.drift * 0.1
      
      // Вращение
      flake.rotation.x += flake.rotationSpeed.x
      flake.rotation.y += flake.rotationSpeed.y
      flake.rotation.z += flake.rotationSpeed.z
      
      // Если снежинка упала ниже уровня, сбрасываем ее вверх
      if (flake.position.y < -30) {
        flake.position.set(
          (Math.random() - 0.5) * 80,
          30 + Math.random() * 40,
          (Math.random() - 0.5) * 80
        )
        flake.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        )
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
          {/* Используем шестиугольник для снежинки */}
          <ringGeometry args={[0.5, 0.7, 6]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// 3. ОСВЕЩЕНИЕ
const SceneLighting = () => {
  return (
    <>
      <ambientLight intensity={0.3} color={0xffffff} />
      
      {/* Цветные источники света для атмосферы */}
      <pointLight 
        position={[15, 10, 15]} 
        intensity={0.6} 
        color={0xd67a9d} 
        distance={60}
        decay={2}
      />
      <pointLight 
        position={[-15, 8, 10]} 
        intensity={0.5} 
        color={0x71b3c9} 
        distance={60}
        decay={2}
      />
      <pointLight 
        position={[10, 5, -15]} 
        intensity={0.4} 
        color={0xffd166} 
        distance={50}
        decay={2}
      />
    </>
  )
}

// 4. ПРОЗРАЧНЫЙ ФОН И АТМОСФЕРА
const BackgroundAtmosphere = () => {
  return (
    <>
      {/* Темный фон */}
      <mesh position={[0, 0, -100]}>
        <sphereGeometry args={[90, 32, 32]} />
        <meshBasicMaterial
          color={0x000000}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Легкая цветная дымка для глубины */}
      <mesh position={[0, 0, -80]}>
        <sphereGeometry args={[70, 32, 32]} />
        <meshBasicMaterial
          color={0x0a1a2a}
          side={THREE.BackSide}
          transparent
          opacity={0.1}
        />
      </mesh>
    </>
  )
}

// 5. ЭФФЕКТ ПАРАЛЛАКСА ДЛЯ ГЛУБИНЫ
const ParallaxLayer = () => {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Медленное движение для эффекта параллакса
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Легкие частицы для глубины */}
      {Array.from({ length: 50 }).map((_, i) => {
        const radius = 20 + Math.random() * 60
        const angle = Math.random() * Math.PI * 2
        const height = Math.random() * 40 - 20
        
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius - 50
            ]}
          >
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial
              color={Math.random() > 0.5 ? 0xd67a9d : 0x71b3c9}
              transparent
              opacity={0.1}
            />
          </mesh>
        )
      })}
    </group>
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
          background: 'transparent',
        }}
        gl={{
          antialias: true, // ОДИН РАЗ - без дублирования
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 1)
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
          
          // Легкий туман для атмосферы
          scene.fog = new THREE.Fog(0x000000, 40, 120)
        }}
      >
        <SceneLighting />
        
        <Suspense fallback={null}>
          <BackgroundAtmosphere />
          <StarField />
          <ParallaxLayer />
          
          {/* Только снежинки - подарки убраны */}
          <RealSnowflakes />
        </Suspense>
        
        {/* Легкий пол для отражений */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -25, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshBasicMaterial
            color={0x000000}
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Canvas>
    </div>
  )
}