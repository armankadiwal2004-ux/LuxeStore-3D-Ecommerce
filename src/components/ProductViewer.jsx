import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, RoundedBox, Float, Text } from '@react-three/drei'
import * as THREE from 'three'

// ── Headphones Model (audio category) ──
function HeadphonesModel({ color = '#8b5cf6' }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Headband */}
        <mesh position={[0, 1.1, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1, 0.08, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#333" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Headband padding */}
        <mesh position={[0, 1.15, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1, 0.12, 16, 32, Math.PI * 0.7]} />
          <meshStandardMaterial color="#222" roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Left ear cup outer */}
        <group position={[-1, 0.1, 0]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.55, 0.35, 32]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
          </mesh>
          {/* Ear cushion */}
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4, 0.12, 16, 32]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.9} metalness={0} />
          </mesh>
          {/* Logo circle */}
          <mesh position={[0, 0, -0.18]} rotation={[0, 0, 0]}>
            <circleGeometry args={[0.25, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Connector arm */}
          <mesh position={[0.15, 0.55, 0]}>
            <boxGeometry args={[0.06, 0.6, 0.06]} />
            <meshStandardMaterial color="#444" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>

        {/* Right ear cup outer */}
        <group position={[1, 0.1, 0]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.55, 0.35, 32]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4, 0.12, 16, 32]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.9} metalness={0} />
          </mesh>
          <mesh position={[0, 0, -0.18]} rotation={[0, 0, 0]}>
            <circleGeometry args={[0.25, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[-0.15, 0.55, 0]}>
            <boxGeometry args={[0.06, 0.6, 0.06]} />
            <meshStandardMaterial color="#444" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      </group>
    </Float>
  )
}

// ── Smartwatch Model (wearables category) ──
function SmartwatchModel({ color = '#8b5cf6' }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
  })

  const screenShape = useMemo(() => {
    const shape = new THREE.Shape()
    const w = 0.55, h = 0.65, r = 0.12
    shape.moveTo(-w + r, -h)
    shape.lineTo(w - r, -h)
    shape.quadraticCurveTo(w, -h, w, -h + r)
    shape.lineTo(w, h - r)
    shape.quadraticCurveTo(w, h, w - r, h)
    shape.lineTo(-w + r, h)
    shape.quadraticCurveTo(-w, h, -w, h - r)
    shape.lineTo(-w, -h + r)
    shape.quadraticCurveTo(-w, -h, -w + r, -h)
    return shape
  }, [])

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} position={[0, 0, 0]} scale={1.6}>
        {/* Watch body */}
        <mesh>
          <extrudeGeometry args={[screenShape, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 5 }]} />
          <meshStandardMaterial color="#2a2a3e" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Screen */}
        <mesh position={[0, 0, 0.2]}>
          <planeGeometry args={[1, 1.2]} />
          <meshStandardMaterial color="#0a0a1a" roughness={0.1} metalness={0.3} />
        </mesh>
        {/* Screen content - time */}
        <mesh position={[0, 0.15, 0.21]}>
          <planeGeometry args={[0.7, 0.3]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.8} />
        </mesh>
        {/* Screen widget 1 */}
        <mesh position={[-0.2, -0.2, 0.21]}>
          <circleGeometry args={[0.12, 32]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1} transparent opacity={0.6} />
        </mesh>
        {/* Screen widget 2 */}
        <mesh position={[0.2, -0.2, 0.21]}>
          <circleGeometry args={[0.12, 32]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1} transparent opacity={0.6} />
        </mesh>

        {/* Crown button */}
        <mesh position={[0.62, 0.1, 0.09]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Top strap */}
        <mesh position={[0, 0.95, 0.09]}>
          <boxGeometry args={[0.5, 0.7, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, 1.4, 0.09]}>
          <boxGeometry args={[0.45, 0.3, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Bottom strap */}
        <mesh position={[0, -0.95, 0.09]}>
          <boxGeometry args={[0.5, 0.7, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, -1.4, 0.09]}>
          <boxGeometry args={[0.45, 0.3, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Strap holes */}
        {[-1.1, -1.25, -1.4].map((y, i) => (
          <mesh key={i} position={[0, y, 0.14]}>
            <circleGeometry args={[0.03, 16]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// ── Laptop Model (computers category) ──
function LaptopModel({ color = '#8b5cf6' }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
  })

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={groupRef} position={[0, -0.3, 0]}>
        {/* Base / keyboard area */}
        <RoundedBox args={[3, 0.12, 2]} radius={0.04} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial color="#2a2a3e" roughness={0.3} metalness={0.8} />
        </RoundedBox>

        {/* Keyboard keys */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <mesh key={`${row}-${col}`} position={[-1.15 + col * 0.25, 0.07, -0.5 + row * 0.28]}>
              <boxGeometry args={[0.18, 0.02, 0.18]} />
              <meshStandardMaterial color="#1a1a2e" roughness={0.6} metalness={0.3} />
            </mesh>
          ))
        )}

        {/* Trackpad */}
        <mesh position={[0, 0.07, 0.6]}>
          <planeGeometry args={[0.9, 0.5]} />
          <meshStandardMaterial color="#333" roughness={0.2} metalness={0.5} />
        </mesh>

        {/* Screen lid - angled open */}
        <group position={[0, 0.06, -1]} rotation={[-0.5, 0, 0]}>
          {/* Lid body */}
          <RoundedBox args={[3, 2, 0.08]} radius={0.03} smoothness={4} position={[0, 1, 0]}>
            <meshStandardMaterial color="#2a2a3e" roughness={0.3} metalness={0.8} />
          </RoundedBox>

          {/* Screen */}
          <mesh position={[0, 1, 0.045]}>
            <planeGeometry args={[2.7, 1.7]} />
            <meshStandardMaterial color="#0a0a1a" roughness={0.05} metalness={0.2} />
          </mesh>

          {/* Screen wallpaper glow */}
          <mesh position={[0, 1, 0.05]}>
            <planeGeometry args={[2.5, 1.5]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.15} />
          </mesh>

          {/* Screen content blocks */}
          <mesh position={[-0.6, 1.3, 0.05]}>
            <planeGeometry args={[0.8, 0.15]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.5} />
          </mesh>
          <mesh position={[0, 0.9, 0.05]}>
            <planeGeometry args={[2, 0.6]} />
            <meshStandardMaterial color="#1e1e3a" emissive="#1e1e3a" emissiveIntensity={0.5} transparent opacity={0.6} />
          </mesh>

          {/* Camera dot */}
          <mesh position={[0, 1.9, 0.05]}>
            <circleGeometry args={[0.025, 16]} />
            <meshStandardMaterial color="#333" emissive="#22d3ee" emissiveIntensity={0.3} />
          </mesh>

          {/* Logo on back of lid */}
          <mesh position={[0, 1, -0.045]}>
            <circleGeometry args={[0.2, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
      </group>
    </Float>
  )
}

// ── Mouse Model (accessories category) ──
function MouseModel({ color = '#8b5cf6' }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} position={[0, 0, 0]} scale={1.8}>
        {/* Mouse body */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.4, 0.6, 16, 32]} />
          <meshStandardMaterial color="#2a2a3e" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Top shell */}
        <mesh position={[0, 0.25, 0]} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Button divider line */}
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.01, 0.15, 0.6]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
        </mesh>

        {/* Scroll wheel */}
        <mesh position={[0, 0.35, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
          <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Side grips */}
        <mesh position={[-0.42, 0, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.05, 0.3, 0.5]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.9} metalness={0.1} />
        </mesh>
        <mesh position={[0.42, 0, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.05, 0.3, 0.5]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* LED strip at bottom */}
        <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.015, 8, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.7} />
        </mesh>

        {/* Bottom base */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.35, 0.38, 0.05, 32]} />
          <meshStandardMaterial color="#111" roughness={0.9} metalness={0.1} />
        </mesh>
      </group>
    </Float>
  )
}

// ── Fallback generic product ──
function GenericModel({ color = '#8b5cf6' }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        <RoundedBox args={[2, 2, 2]} radius={0.2} smoothness={4}>
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.9} />
        </RoundedBox>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.02, 16, 100]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

// Ground plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#0f0f23" transparent opacity={0.3} />
    </mesh>
  )
}

const categoryModelMap = {
  audio: HeadphonesModel,
  wearables: SmartwatchModel,
  computers: LaptopModel,
  accessories: MouseModel,
}

export default function ProductViewer({ color, category }) {
  const ModelComponent = categoryModelMap[category] || GenericModel

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden glass-card">
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 0, 5]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[5, 0, -5]} intensity={0.4} color="#ec4899" />
        <pointLight position={[0, 3, 0]} intensity={0.3} color="#22d3ee" />

        <ModelComponent color={color} />
        <Ground />

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
