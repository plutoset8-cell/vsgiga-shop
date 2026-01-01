// components/canvas/Profile3DScene.tsx
'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useMemo } from 'react'
import * as THREE from 'three'
import Snow from './Snow'
import Aurora from './Aurora'
import { InstancedMesh, Object3D, Color } from 'three'

// Звезды из профиля (упрощенная версия)
const ProfileStars = () => {
  const meshRef = useRef<InstancedMesh>(null!)
  const count = 150
  const dummy = useMemo(() => new Object3D(), [])

  const types = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      size: 0.02 + Math.random() * 0.03,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 40,
      z: -Math.random() * 150 - 30,
      pulseSpeed: Math.random() * 0.3 + 0.1,
      pulseOffset: Math.random() * Math.PI * 2
    })), [count]
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    for (let i = 0; i < count; i++) {
      const star = types[i]
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
      <sphereGeometry args={[0.1, 6, 6]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  )
}

// Упрощенные подарки для профиля
const ProfileGifts = () => {
  const meshRef = useRef<InstancedMesh>(null!)
  const count = 15
  const dummy = useMemo(() => new Object3D(), [])

  const types = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      size: 0.4 + Math.random() * 0.3,
      speed: 0.05 + Math.random() * 0.1,
      rotationSpeed: Math.random() * 0.01,
      x: (Math.random() - 0.5) * 25,
      z: -Math.random() * 60 - 20,
      y: Math.random() * 10 + 5,
      color: i % 3 === 0 ? 0xd67a9d : i % 3 === 1 ? 0x71b3c9 : 0xffd166
    })), [count]
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    for (let i = 0; i < count; i++) {
      const gift = types[i]
      const y = gift.y - (time * gift.speed) % 25
      const rotation = time * gift.rotationSpeed
      
      dummy.position.set(gift.x, y, gift.z)
      dummy.rotation.x = rotation
      dummy.rotation.y = rotation * 1.3
      dummy.scale.setScalar(gift.size)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      
      // Reset position
      if (y < -15) {
        dummy.position.y = gift.y
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#ffffff"
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.5}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  )
}

export default function Profile3DScene() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 75,
          near: 0.1,
          far: 500
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={[1, 1.5]}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          touchAction: 'none'
        }}
        performance={{
          min: 0.5,
          current: 1,
          debounce: 1000
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        }}
      >
        <color attach="background" args={[0x000000]} />
        <fog attach="fog" args={[0x000000, 40, 200]} />
        
        <Suspense fallback={null}>
          {/* Существующий снег */}
          <Snow />
          
          {/* Существующее северное сияние */}
          <Aurora />
          
          {/* Звезды из профиля */}
          <ProfileStars />
          
          {/* Подарки из профиля */}
          <ProfileGifts />
          
          {/* Освещение */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.4} color={0xd67a9d} />
          <pointLight position={[-10, -10, -10]} intensity={0.2} color={0x71b3c9} />
          <pointLight position={[0, 20, 0]} intensity={0.1} color={0xffffff} />
        </Suspense>
      </Canvas>
    </div>
  )
}