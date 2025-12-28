'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Snow() {
  const meshRef = useRef<THREE.Points>(null!)
  const count = 35000 // Оптимально для густоты

  // Увеличиваем диапазон, чтобы при поворотах углы не вылезали
  const range = 120
  const halfRange = range / 2

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Используем кубическое распределение, но в ОГРОМНОМ объеме
      // Это надежнее сферы, когда нужно закрыть все углы обзора
      pos[i * 3] = (Math.random() - 0.5) * range
      pos[i * 3 + 1] = (Math.random() - 0.5) * range
      pos[i * 3 + 2] = (Math.random() - 0.5) * range

      spd[i] = 1.5 + Math.random() * 3.5
    }
    return [pos, spd]
  }, [])

  const snowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64; canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    // В твоем файле Snow.tsx измени эти строки:
    gradient.addColorStop(0, 'rgba(255, 0, 127, 1)')   // Ярко-розовый в центре
    gradient.addColorStop(0.3, 'rgba(255, 0, 127, 0.5)') // Полупрозрачный розовый
    gradient.addColorStop(1, 'rgba(255, 0, 127, 0)')   // Прозрачный край
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const attr = meshRef.current.geometry.attributes.position
    const time = state.clock.elapsedTime

    // Ограничиваем delta, чтобы снег не "прыгал" при лагах
    const d = Math.min(delta, 0.05)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // 1. Движение вниз
      attr.array[i3 + 1] -= speeds[i] * d * 3

      // 2. Горизонтальный дрейф (более естественный)
      attr.array[i3] += Math.sin(time * 0.3 + i) * 0.015

      // 3. Бесшовный перезапуск через границы range
      // Если частица падает ниже -halfRange, она плавно появляется сверху
      if (attr.array[i3 + 1] < -halfRange) {
        attr.array[i3 + 1] = halfRange
      }

      // Проверка по X и Z (на случай сильных поворотов мыши)
      if (attr.array[i3] < -halfRange) attr.array[i3] = halfRange
      if (attr.array[i3] > halfRange) attr.array[i3] = -halfRange
    }

    attr.needsUpdate = true

    // Уменьшаем интенсивность вращения, чтобы края облака не заходили в экран
    const targetRY = state.mouse.x * 0.12
    const targetRX = -state.mouse.y * 0.08

    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRY, 0.02)
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRX, 0.02)
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
        size={0.16}
        map={snowTexture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        opacity={0.5}
      />
    </points>
  )
}