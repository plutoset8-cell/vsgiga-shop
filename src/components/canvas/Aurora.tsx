'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

export default function Aurora() {
  const ref = useRef<any>(null!)

  useFrame((state) => {
    // Сияние плавно колышется
    if (ref.current) {
      ref.current.distort = 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    // Ставим в центр (0, 0) и отодвигаем назад
    <group position={[0, 0, -8]}>
      <Sphere args={[1, 64, 64]} scale={[25, 12, 1]}>
        <MeshDistortMaterial
          ref={ref}
          color="#4b0082" // Глубокий фиолетовый
          speed={1.5}
          distort={0.5}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  )
}