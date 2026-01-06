// src/components/canvas/Profile3DScene.tsx
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

// ==================== УЛУЧШЕННЫЙ КОМПОНЕНТ СНЕЖИНОК ====================
const EnhancedSnowflakes = () => {
  const groupRef = useRef<THREE.Group>(null!)
  const count = 600 // Увеличили для более плотного снега
  
  // Оптимизированное создание снежинок с разными параметрами
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Разные скорости падения
      const speed = Math.random() * 0.015 + 0.01
      // Разный горизонтальный дрейф
      const drift = (Math.random() - 0.5) * 0.015
      // Разная скорость вращения
      const rotationSpeed = Math.random() * 0.02 + 0.005
      // Разные размеры (от маленьких к большим)
      const size = Math.pow(Math.random(), 2) * 0.12 + 0.03
      // Разная прозрачность
      const opacity = Math.random() * 0.5 + 0.3
      // Разные типы покачивания
      const wobbleIntensity = Math.random() * 0.4 + 0.2
      
      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 120, // Широкий охват по X
          40 + Math.random() * 40,     // Начальная высота
          (Math.random() - 0.5) * 80   // Глубина
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
        size,
        opacity,
        wobble: {
          frequency: Math.random() * 0.4 + 0.2,
          amplitude: wobbleIntensity,
          phase: Math.random() * Math.PI * 2 // Разная фаза покачивания
        },
        originalX: 0 // Для сохранения оригинальной позиции
      }
    })
  }, [count])

  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    
    snowflakes.forEach((flake) => {
      // Плавное падение вниз
      flake.position.y -= flake.speed
      
      // Реалистичное боковое покачивание (синусоидальное движение)
      const wobbleX = Math.sin(time * flake.wobble.frequency + flake.wobble.phase) * flake.wobble.amplitude
      const wobbleZ = Math.cos(time * flake.wobble.frequency * 0.8 + flake.wobble.phase) * flake.wobble.amplitude * 0.5
      
      flake.position.x += wobbleX * 0.02
      flake.position.z += wobbleZ * 0.01
      
      // Легкий горизонтальный дрейф
      flake.position.x += flake.drift * 0.05
      
      // Вращение снежинок
      flake.rotation.x += flake.rotationSpeed.x
      flake.rotation.y += flake.rotationSpeed.y
      flake.rotation.z += flake.rotationSpeed.z
      
      // Перезапуск снежинок, когда они падают слишком низко
      if (flake.position.y < -40) {
        flake.position.set(
          (Math.random() - 0.5) * 120,
          40 + Math.random() * 40,
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
          {/* Разные формы снежинок */}
          {Math.random() > 0.5 ? (
            <ringGeometry args={[0.4, 0.8, 6]} />
          ) : (
            <circleGeometry args={[0.6, 8]} />
          )}
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={flake.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

// ==================== МИНИМАЛЬНОЕ ОСВЕЩЕНИЕ ====================
const MinimalLighting = () => {
  return (
    <>
      {/* Мягкое окружающее освещение для объема */}
      <ambientLight intensity={0.2} color={0xffffff} />
      
      {/* Легкое направленное освещение сверху (как от неба) */}
      <directionalLight 
        position={[0, 30, 0]} 
        intensity={0.1} 
        color={0xffffff}
        castShadow={false}
      />
    </>
  )
}

// ==================== ОСНОВНОЙ КОМПОНЕНТ 3D СЦЕНЫ ====================
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
        zIndex: -100, // Глубокий z-index для фона
      }}
    >
      <Canvas
        camera={{
          position: [0, 5, 30], // Отодвигаем камеру дальше
          fov: 70,
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
          zIndex: -100,
          background: 'transparent',
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl, scene }) => {
          // Чистый черный прозрачный фон
          gl.setClearColor(0x000000, 0)
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        }}
      >
        <MinimalLighting />
        
        <Suspense fallback={null}>
          <EnhancedSnowflakes />
        </Suspense>
        
        {/* Невидимая плоскость для создания глубины */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -40, 0]}>
          <planeGeometry args={[400, 400]} />
          <meshBasicMaterial
            color={0x000000}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Canvas>
    </div>
  )
}