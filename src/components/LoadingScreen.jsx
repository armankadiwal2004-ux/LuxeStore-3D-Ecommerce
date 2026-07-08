import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'

// 3D animated loading sphere
function LoadingSphere() {
  return (
    <Sphere args={[1, 64, 64]} scale={2}>
      <MeshDistortMaterial
        color="#8b5cf6"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => p >= 100 ? 100 : p + Math.random() * 15)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 3D Loading animation */}
        <div className="w-48 h-48 mb-8">
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <LoadingSphere />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={4} />
          </Canvas>
        </div>

        {/* Brand text */}
        <motion.h1
          className="text-3xl font-bold text-white mb-4 glow-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          LuxeStore
        </motion.h1>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-white/40 text-sm mt-3 animate-pulse-glow">Loading experience...</p>
      </motion.div>
    </AnimatePresence>
  )
}
