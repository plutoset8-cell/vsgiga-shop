// src/components/canvas/Profile3DScene.tsx
'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'
import Snow from './Snow'
import Aurora from './Aurora'
import { InstancedMesh, Object3D, Color, Scene } from 'three'

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

  useEffect(() => {
    // Инициализация позиций при монтировании
    for (let i = 0; i < count; i++) {
      const star = types[i]
      dummy.position.set(star.x, star.y, star.z)
      dummy.scale.setScalar(star.size)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [types, dummy])

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
        opacity={0.9}
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

  // Инициализация цветов
  useEffect(() => {
    if (!meshRef.current) return
    
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const color = new Color(types[i].color)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    const geometry = meshRef.current.geometry
    geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3))
  }, [types])

  useFrame((state) => {
    if (!meshRef.current) return
    
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
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.5}
        transparent
        opacity={0.9}
        vertexColors={true}
      />
    </instancedMesh>
  )
}

// Дополнительный свет для лучшей видимости
const AdditionalLighting = () => {
  return (
    <>
      <ambientLight intensity={0.6} color={0xffffff} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color={0xffffff}
        castShadow
      />
      <pointLight 
        position={[0, 5, 10]} 
        intensity={1.0} 
        color={0xd67a9d} 
        distance={50}
      />
      <pointLight 
        position={[-10, 3, 5]} 
        intensity={0.7} 
        color={0x71b3c9} 
        distance={50}
      />
      <pointLight 
        position={[10, 3, 5]} 
        intensity={0.7} 
        color={0xffd166} 
        distance={50}
      />
    </>
  )
}

// Прозрачная плоскость для эффекта глубины
const DepthPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null!)

  return (
    <mesh position={[0, 0, -100]} ref={meshRef}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial
        color={0x000000}
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
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
        zIndex: -10,
        transform: 'translate3d(0,0,0)',
        willChange: 'transform',
        contain: 'layout style paint',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
          zoom: 1
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
          logarithmicDepthBuffer: true
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
          zIndex: -10,
          background: 'transparent',
          mixBlendMode: 'normal'
        }}
        performance={{
          min: 0.5,
          current: 1,
          debounce: 1000
        }}
        shadows
        frameloop="always"
        onCreated={({ gl, scene }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
          gl.setClearColor(0x000000, 1)
          gl.autoClear = true
          gl.sortObjects = true
          
          // Оптимизация сцены
          scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.frustumCulled = true
              obj.castShadow = false
              obj.receiveShadow = false
            }
          })
        }}
      >
        <color attach="background" args={[0x000000]} />
        <fog attach="fog" args={[0x000000, 20, 150]} />
        
        <AdditionalLighting />
        <DepthPlane />
        
        <Suspense fallback={null}>
          <Snow />
          <Aurora />
        </Suspense>
        
        {/* Профильные элементы - вне Suspense для надежности */}
        <ProfileStars />
        <ProfileGifts />
        
        {/* Дополнительные эффекты */}
        <mesh position={[0, 0, -50]}>
          <sphereGeometry args={[30, 16, 16]} />
          <meshBasicMaterial
            color={0x000000}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      </Canvas>
    </div>
  )
}