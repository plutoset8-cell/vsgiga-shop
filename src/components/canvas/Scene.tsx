'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Snow from './Snow' 
import Aurora from './Aurora'

export default function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10 bg-[#000000]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Snow /> 
          <Aurora />
        </Suspense>
      </Canvas>
    </div>
  )
}