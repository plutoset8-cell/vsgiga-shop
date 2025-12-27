'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec2 mouse;
  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Функция для вращения координат
  vec2 rotate(vec2 uv, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c) * uv;
  }

  void main() {
    // 1. Центрируем координаты и учитываем мышь по всему экрану
    vec2 uv = vUv - 0.5;
    
    // 2. АВТОМАТИЧЕСКОЕ ВРАЩЕНИЕ
    // Медленно крутим всё пространство со временем
    float angle = time * 0.05; 
    vec2 rotatedUV = rotate(uv, angle);
    
    // 3. ПАРАЛЛАКС ОТ МЫШИ
    // Звезды и сияние теперь смещаются корректно
    vec2 starsUV = rotatedUV + (mouse * 0.1); 
    vec2 auroraUV = rotatedUV + (mouse * 0.03);
    
    vec3 color = vec3(0.01, 0.005, 0.04); // Глубокий космос
    
    // 4. СЕВЕРНОЕ СИЯНИЕ (Aurora)
    float aurora = sin(auroraUV.x * 2.0 + time * 0.3) * 0.5 + 0.5;
    // Распределяем сияние по всему экрану, а не только снизу
    float mask = smoothstep(-1.5, 0.0, auroraUV.y) * smoothstep(1.5, 0.0, auroraUV.y);
    color += vec3(0.4, 0.0, 0.7) * aurora * mask * 0.5;

    // 5. ЗВЕЗДЫ (Крутятся и реагируют на мышь)
    vec2 gridUv = starsUV * 40.0; 
    vec2 ipos = floor(gridUv);
    vec2 fpos = fract(gridUv);
    
    float n = noise(ipos);
    if (n > 0.98) {
        // Звезды пульсируют, но не исчезают
        float twinkle = 0.6 + sin(time * 1.5 + n * 100.0) * 0.4;
        float shape = 1.0 - smoothstep(0.0, 0.5, length(fpos - 0.5));
        color += vec3(1.0) * shape * twinkle;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function SkyBox() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const smoothMouse = useRef(new THREE.Vector2(0, 0))

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    mouse: { value: new THREE.Vector2(0, 0) }
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      
      // Плавное следование за мышью
      smoothMouse.current.lerp(state.mouse, 0.05);
      materialRef.current.uniforms.mouse.value.copy(smoothMouse.current);
    }
  })

  return (
    // Огромный меш, чтобы при вращении и движении мыши не вылезать за края
    <mesh scale={[40, 40, 1]} position={[0, 0, -10]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}