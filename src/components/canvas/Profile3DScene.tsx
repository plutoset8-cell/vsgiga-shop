// src/components/canvas/Profile3DScene.tsx
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// Минимальный 3D компонент для тестирования
function TestCube() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })
  
  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#d67a9d"
        emissive="#d67a9d"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

// Простые звезды
function SimpleStars() {
  const count = 100
  const positions = new Float32Array(count * 3)
  
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100
    positions[i + 1] = (Math.random() - 0.5) * 100
    positions[i + 2] = (Math.random() - 0.5) * 100 - 50
  }
  
  return (
    <points>
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
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

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
          position: [0, 0, 5],
          fov: 75,
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
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 1)
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        }}
      >
        <color attach="background" args={[0x000000]} />
        
        {/* Освещение */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#d67a9d" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#71b3c9" />
        
        {/* Тестовые объекты */}
        <TestCube />
        <SimpleStars />
        
        {/* Простой фон */}
        <mesh position={[0, 0, -100]}>
          <planeGeometry args={[200, 200]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.1} />
        </mesh>
      </Canvas>
    </div>
  )
}