// src/components/canvas/Profile3DScene.tsx
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

// ==================== КАЧЕСТВЕННЫЙ КОМПОНЕНТ СНЕЖИНОК ====================
const QualitySnowflakes = () => {
  const groupRef = useRef<THREE.Group>(null!)
  const count = 400 // Оптимальное количество для производительности
  
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const speed = Math.random() * 0.015 + 0.01 // Скорость падения
      const drift = (Math.random() - 0.5) * 0.01 // Случайный дрейф
      const rotationSpeed = Math.random() * 0.015 + 0.005 // Скорость вращения
      const size = Math.random() * 0.12 + 0.05 // Размер
      const opacity = Math.random() * 0.6 + 0.4 // Прозрачность
      
      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          40 + Math.random() * 30,
          (Math.random() - 0.5) * 80
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
          amplitude: Math.random() * 0.3 + 0.1,
          phase: Math.random() * Math.PI * 2
        }
      }
    })
  }, [count])

  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    
    snowflakes.forEach((flake) => {
      flake.position.y -= flake.speed
      
      // Плавное покачивание с использованием синуса
      const wobbleX = Math.sin(time * flake.wobble.frequency + flake.wobble.phase) * flake.wobble.amplitude
      const wobbleZ = Math.cos(time * flake.wobble.frequency * 0.8 + flake.wobble.phase) * flake.wobble.amplitude * 0.5
      
      flake.position.x += wobbleX * 0.02
      flake.position.z += wobbleZ * 0.01
      
      // Легкий горизонтальный дрейф
      flake.position.x += flake.drift * 0.05
      
      // Вращение
      flake.rotation.x += flake.rotationSpeed.x
      flake.rotation.y += flake.rotationSpeed.y
      flake.rotation.z += flake.rotationSpeed.z
      
      // Перезапуск
      if (flake.position.y < -40) {
        flake.position.set(
          (Math.random() - 0.5) * 100,
          40 + Math.random() * 30,
          (Math.random() - 0.5) * 80
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
          {/* Кристаллическая форма снежинки */}
          <ringGeometry args={[0.4, 0.7, 6]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={flake.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

// ==================== ФОН С ГРАДИЕНТОМ ====================
const GradientBackground = () => {
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    varying vec2 vUv;
    
    void main() {
      // Основной глубокий градиентный фон
      vec3 color1 = vec3(0.04, 0.04, 0.08);  // Темно-синий
      vec3 color2 = vec3(0.08, 0.02, 0.1);   // Темно-фиолетовый
      vec3 color3 = vec3(0.02, 0.04, 0.08);  // Темно-синий
      
      // Создаем сложный градиент
      float gradient = smoothstep(0.0, 1.0, vUv.y * 1.5);
      vec3 color = mix(color1, color2, gradient);
      color = mix(color, color3, vUv.x * 0.3);
      
      // Добавляем легкие сияющие точки (далекие звезды)
      float stars = 0.0;
      for (float i = 0.0; i < 5.0; i++) {
        float seed = 43758.5453 * (i + 1.0);
        vec2 pos = vec2(
          fract(sin(dot(vUv + vec2(i * 12.9898, i * 78.233), vec2(12.9898, 78.233))) * seed),
          fract(cos(dot(vUv + vec2(i * 78.233, i * 12.9898), vec2(78.233, 12.9898))) * seed)
        );
        float dist = distance(vUv, pos);
        stars += smoothstep(0.5, 0.0, dist * 100.0) * 0.03;
      }
      
      color += vec3(stars * 0.5, stars, stars);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  const uniforms = useMemo(() => ({}), [])

  return (
    <mesh position={[0, 0, -100]} scale={[200, 200, 1]}>
      <planeGeometry args={[1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={false}
      />
    </mesh>
  )
}

// ==================== МИНИМАЛЬНОЕ ОСВЕЩЕНИЕ ====================
const SceneLighting = () => {
  return (
    <>
      <ambientLight intensity={0.3} color={0xffffff} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={0.2} 
        color={0xd67a9d} 
        distance={100}
        decay={1.5}
      />
    </>
  )
}

// ==================== ОСНОВНОЙ КОМПОНЕНТ ====================
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
        zIndex: -50, // Чуть выше чем CSS снег для наслоения
      }}
    >
      <Canvas
        camera={{
          position: [0, 5, 30],
          fov: 65,
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
          background: 'transparent',
        }}
        gl={{
          antialias: true,
          alpha: false, // Не прозрачный, так как у нас есть фон
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 1)
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        }}
      >
        <SceneLighting />
        
        <Suspense fallback={null}>
          <GradientBackground />
          <QualitySnowflakes />
        </Suspense>
        
        {/* Пол для создания глубины */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -30, 0]}>
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