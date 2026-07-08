import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Torus } from '@react-three/drei'
import * as THREE from 'three'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// Animated floating sphere with distortion
function HeroSphere({ position = [0, 0, 0], color = '#8b5cf6', speed = 2, distort = 0.4, size = 1 }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

// Floating ring
function FloatingRing({ position = [3, -1, -2] }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.5
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.3
    }
  })
  return (
    <Float speed={2} rotationIntensity={2}>
      <Torus ref={ref} args={[1, 0.1, 16, 100]} position={position}>
        <meshStandardMaterial color="#ec4899" metalness={0.9} roughness={0.1} />
      </Torus>
    </Float>
  )
}

// Particle field
function Particles({ count = 200 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [count])

  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#8b5cf6" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Main 3D hero scene
export default function HeroScene() {
  const isMobile = useIsMobile()

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      dpr={isMobile ? 1 : [1, 2]}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#ec4899" />

      <HeroSphere position={[0, 0, 0]} color="#8b5cf6" size={1.5} distort={0.5} speed={2} />
      {!isMobile && <HeroSphere position={[-3, 1, -3]} color="#ec4899" size={0.7} distort={0.3} speed={3} />}
      {!isMobile && <HeroSphere position={[3.5, -1.5, -2]} color="#06b6d4" size={0.5} distort={0.6} speed={1.5} />}

      {!isMobile && <FloatingRing />}
      <Particles count={isMobile ? 80 : 300} />
      <Stars radius={50} depth={50} count={isMobile ? 300 : 1000} factor={3} fade speed={1} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}
