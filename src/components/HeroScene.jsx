import React, { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Billboard,
  Float,
  Html,
  OrbitControls,
  Sky,
  Sparkles,
  Stars,
  Text,
  useCursor
} from '@react-three/drei'
import * as THREE from 'three'

const MENU_ITEMS = [
  {
    key: 'guide',
    title: '網站導覽',
    subtitle: '3D 星星',
    position: [-4.2, 1.2, -3.4],
    accent: '#8fd3ff',
    route: '/guide',
    hoverText: '跟著星星指引，快速找到網站功能、入口與探索方向。'
  },
  {
    key: 'map',
    title: '附近的友善海鮮地圖',
    subtitle: '3D 太陽',
    position: [0, 1, -6],
    accent: '#ffe29a',
    route: '/map',
    hoverText: '像太陽照亮地圖一樣，查看附近友善海鮮據點、推薦路線與在地探索資訊。'
  },
  {
    key: 'ar',
    title: 'AR 互動與永續標籤',
    subtitle: '3D 月亮',
    position: [4.2, 1.2, -3.4],
    accent: '#d4b3ff',
    route: '/sustainability',
    hoverText: '透過月亮般柔和的互動體驗，理解海鮮來源與永續價值。'
  }
]

export default function HeroScene() {
  const [activeKey, setActiveKey] = useState('guide')
  const activeItem = MENU_ITEMS.find(item => item.key === activeKey) || MENU_ITEMS[0]

  return (
    <div className="hero-shell">
      <Canvas camera={{ position: [0, 1.7, 8], fov: 55 }} dpr={[1, 2]} shadows>
        <color attach="background" args={['#eef8ff']} />
        <fog attach="fog" args={['#eef8ff', 14, 38]} />
        <Suspense fallback={null}>
          <BeachWorld activeKey={activeKey} setActiveKey={setActiveKey} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI - 0.55}
          rotateSpeed={0.55}
        />
      </Canvas>

      <div className="hero-overlay">
        <div className="hero-copy glass-card">
          <div className="eyebrow">IMMERSIVE BEACH EXPERIENCE</div>
          <h1>像走進白色沙灘一樣，開始探索永續漁獲世界</h1>
          <p>
            這不是一般首頁，而是一個可以拖曳環視的沉浸式入口。抬頭看天空、低頭看腳下沙灘，
            在陽光、海浪、粒子與互動物件之間進入地圖、導覽與 AR 標籤。
          </p>
        </div>

        <div className="hero-menu glass-card">
          {MENU_ITEMS.map(item => (
            <button
              key={item.key}
              className={`hero-menu-item ${item.key === activeKey ? 'active' : ''}`}
              onMouseEnter={() => setActiveKey(item.key)}
              onFocus={() => setActiveKey(item.key)}
              onClick={() => {
                window.location.href = item.route
              }}
            >
              <span className="hero-menu-title">{item.title}</span>
              <span className="hero-menu-subtitle">{item.subtitle}</span>
            </button>
          ))}
        </div>

        <div className="hero-status glass-card">
          <span className="status-kicker">目前聚焦</span>
          <h2>{activeItem.title}</h2>
          <p>{activeItem.hoverText}</p>
          <div className="status-hint">提示：滑鼠拖曳可 720° 環視，移到 3D 物件上會觸發動態效果。</div>
        </div>
      </div>
    </div>
  )
}

function BeachWorld({ activeKey, setActiveKey }) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[5, 9, 4]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <hemisphereLight args={['#fff8dd', '#a9dcff', 1.3]} />
      <Sky sunPosition={[8, 6, -5]} turbidity={4} rayleigh={1.6} />
      <Stars radius={60} depth={30} count={1000} factor={2} saturation={0} fade speed={0.3} />
      <Sparkles count={80} scale={[24, 8, 24]} size={2.2} speed={0.25} opacity={0.2} />

      <SunGlare />
      <Sand />
      <Sea />
      <ShoreFoam />
      <Footsteps />

      {MENU_ITEMS.map(item => (
        <InteractiveMenuObject
          key={item.key}
          item={item}
          active={item.key === activeKey}
          setActiveKey={setActiveKey}
        />
      ))}
    </>
  )
}

function SunGlare() {
  return (
    <mesh position={[9, 6, -14]}>
      <sphereGeometry args={[1.1, 32, 32]} />
      <meshBasicMaterial color="#fff9db" toneMapped={false} />
    </mesh>
  )
}

function Sand() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[80, 80, 64, 64]} />
      <meshStandardMaterial color="#f8f3df" roughness={0.98} metalness={0.02} />
    </mesh>
  )
}

function Sea() {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.material.opacity = 0.9 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    ref.current.position.z = -15 + Math.sin(state.clock.elapsedTime * 0.4) * 0.2
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -15]}>
      <planeGeometry args={[80, 28, 2, 2]} />
      <meshStandardMaterial color="#83d8ff" transparent opacity={0.92} roughness={0.2} metalness={0.05} />
    </mesh>
  )
}

function ShoreFoam() {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.z = -8.8 + Math.sin(state.clock.elapsedTime * 1.4) * 0.16
    ref.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 1.6) * 0.09
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -8.8]}>
      <planeGeometry args={[80, 5]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.56} />
    </mesh>
  )
}

function Footsteps() {
  return (
    <group position={[0, 0.01, 4.2]} rotation={[-Math.PI / 2, 0, 0]}>
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0, i * 0.6]}>
          <circleGeometry args={[0.18, 20]} />
          <meshBasicMaterial color="#d6c3a4" transparent opacity={0.45} />
        </mesh>
      ))}
      {[-0.38, 0.38].map((x, i) => (
        <mesh key={`b${i}`} position={[x, -0.6, 0.8 + i * 0.65]}>
          <circleGeometry args={[0.18, 20]} />
          <meshBasicMaterial color="#d6c3a4" transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  )
}

function InteractiveMenuObject({ item, active, setActiveKey }) {
  const ref = useRef()
  const haloRef = useRef()
  const [hovered, setHovered] = useState(false)

  useCursor(hovered)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime

    ref.current.position.y = item.position[1] + Math.sin(t * 1.4 + item.position[0]) * 0.08
    ref.current.rotation.y = Math.sin(t * 0.5 + item.position[0]) * 0.18

    if (haloRef.current) {
      haloRef.current.material.opacity = active || hovered ? 0.42 : 0.18
      haloRef.current.rotation.z += 0.01
      haloRef.current.scale.setScalar(active || hovered ? 1.15 : 1)
    }
  })

  const events = {
    onPointerEnter: () => {
      setHovered(true)
      setActiveKey(item.key)
    },
    onPointerLeave: () => setHovered(false),
    onClick: () => {
      window.location.href = item.route
    }
  }

  return (
    <group ref={ref} position={item.position} {...events}>
      <Float speed={active ? 2.3 : 1.4} rotationIntensity={0.25} floatIntensity={0.3}>
        {item.key === 'guide' && <StarGuide active={active || hovered} color={item.accent} />}
        {item.key === 'map' && <SunMap active={active || hovered} color={item.accent} />}
        {item.key === 'ar' && <MoonBadge active={active || hovered} color={item.accent} />}
      </Float>

      <mesh ref={haloRef} position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.25, 50]} />
        <meshBasicMaterial color={item.accent} transparent opacity={0.2} />
      </mesh>

      <Billboard position={[0, 2.35, 0]} follow>
        <Text fontSize={0.28} color="#183b56" anchorX="center" anchorY="middle" maxWidth={3.2}>
          {item.title}
        </Text>
      </Billboard>

      {(hovered || active) && (
        <Html position={[0, 2.9, 0]} center distanceFactor={10}>
          <div className="floating-tooltip">{item.hoverText}</div>
        </Html>
      )}
    </group>
  )
}

/* ============================================================
   1. StarGuide —— 一顆星星
============================================================ */
function StarGuide({ active, color }) {
  const starRef = useRef()
  const glowRef = useRef()
  const orbitRef = useRef()

  const starShape = useMemo(() => {
    const shape = new THREE.Shape()
    const outer = 0.4
    const inner = 0.18
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 - Math.PI / 2
      const radius = i % 2 === 0 ? outer : inner
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    return shape
  }, [])

  const starExtrude = useMemo(
    () => ({
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025
    }),
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (starRef.current) {
      starRef.current.rotation.y += active ? 0.03 : 0.012
      starRef.current.rotation.z = active ? Math.sin(t * 1.8) * 0.08 : Math.sin(t * 0.8) * 0.03
      starRef.current.position.y = 1.08 + Math.sin(t * 1.9) * 0.06
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(active ? 1.08 + Math.sin(t * 3.2) * 0.06 : 1)
      glowRef.current.material.opacity = active ? 0.42 : 0.22
    }

    if (orbitRef.current) {
      orbitRef.current.rotation.z += active ? 0.03 : 0.012
    }
  })

  return (
    <group>
      <RoundBase color={color} accent="#fff7df" />

      <group ref={starRef} position={[0, 1.08, 0]}>
        <mesh castShadow rotation={[0, 0, 0.08]}>
          <extrudeGeometry args={[starShape, starExtrude]} />
          <meshStandardMaterial
            color="#ffd86a"
            emissive={active ? '#ffd86a' : '#f2c84d'}
            emissiveIntensity={active ? 1 : 0.28}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>

        <mesh ref={glowRef} position={[0, 0, -0.02]}>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 40]} />
          <meshBasicMaterial color="#fff4b0" transparent opacity={0.24} />
        </mesh>
      </group>

      <mesh ref={orbitRef} position={[0, 1.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.025, 16, 80]} />
        <meshStandardMaterial color="#9fe3ff" emissive="#9fe3ff" emissiveIntensity={active ? 0.9 : 0.2} />
      </mesh>

      {[
        [0.58, 1.34, 0.1],
        [-0.5, 1.2, 0.16],
        [0.12, 1.58, -0.18]
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.045, 14, 14]} />
          <meshStandardMaterial
            color={i === 0 ? '#ffffff' : i === 1 ? '#dff6ff' : '#ffe9a8'}
            emissive={i === 0 ? '#ffffff' : i === 1 ? '#dff6ff' : '#ffe9a8'}
            emissiveIntensity={active ? 1 : 0.35}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ============================================================
   2. SunMap —— 一顆太陽
============================================================ */
function SunMap({ active, color }) {
  const sunRef = useRef()
  const coreRef = useRef()
  const rayRef = useRef()
  const pulseRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (sunRef.current) {
      sunRef.current.rotation.z += active ? 0.02 : 0.008
      sunRef.current.position.y = 1.08 + Math.sin(t * 1.7) * 0.05
    }

    if (coreRef.current) {
      const s = active ? 1 + Math.sin(t * 3.4) * 0.06 : 1 + Math.sin(t * 1.5) * 0.025
      coreRef.current.scale.set(s, s, s)
    }

    if (rayRef.current) {
      rayRef.current.rotation.z -= active ? 0.018 : 0.006
    }

    if (pulseRef.current) {
      const s = active ? 1.05 + Math.sin(t * 2.8) * 0.06 : 1
      pulseRef.current.scale.set(s, s, s)
      pulseRef.current.material.opacity = active ? 0.3 : 0.16
    }
  })

  return (
    <group>
      <RoundBase color={color} accent="#fff4d6" />

      <mesh ref={pulseRef} position={[0, 1.08, -0.02]}>
        <cylinderGeometry args={[0.72, 0.72, 0.03, 48]} />
        <meshBasicMaterial color="#ffe49b" transparent opacity={0.18} />
      </mesh>

      <group ref={sunRef} position={[0, 1.08, 0]}>
        <group ref={rayRef}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const x = Math.cos(angle) * 0.62
            const y = Math.sin(angle) * 0.62
            return (
              <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
                <boxGeometry args={[0.12, 0.36, 0.06]} />
                <meshStandardMaterial
                  color="#ffd972"
                  emissive={active ? '#ffd972' : '#f4c957'}
                  emissiveIntensity={active ? 0.85 : 0.2}
                  roughness={0.45}
                />
              </mesh>
            )
          })}
        </group>

        <group ref={coreRef}>
          <mesh castShadow>
            <sphereGeometry args={[0.34, 28, 28]} />
            <meshStandardMaterial
              color="#ffcf5f"
              emissive={active ? '#ffd56d' : '#ffbf47'}
              emissiveIntensity={active ? 1.1 : 0.35}
              roughness={0.35}
            />
          </mesh>

          <mesh position={[0, 0, 0.26]}>
            <sphereGeometry args={[0.11, 18, 18]} />
            <meshStandardMaterial color="#fff2b6" emissive="#fff2b6" emissiveIntensity={active ? 1 : 0.3} />
          </mesh>
        </group>
      </group>

      {[
        [-0.54, 1.46, 0.1],
        [0.56, 1.26, 0.16],
        [0.08, 1.68, -0.14]
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color={i === 0 ? '#fff8de' : i === 1 ? '#ffd899' : '#fff0a3'}
            emissive={i === 0 ? '#fff8de' : i === 1 ? '#ffd899' : '#fff0a3'}
            emissiveIntensity={active ? 1 : 0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ============================================================
   3. MoonBadge —— 一枚月亮
============================================================ */
function MoonBadge({ active, color }) {
  const moonRef = useRef()
  const halo1 = useRef()
  const halo2 = useRef()
  const starDots = useRef()

  const crescentShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.absarc(0, 0, 0.42, 0, Math.PI * 2, false)

    const hole = new THREE.Path()
    hole.absarc(0.18, 0.06, 0.34, 0, Math.PI * 2, true)
    shape.holes.push(hole)

    return shape
  }, [])

  const moonExtrude = useMemo(
    () => ({
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.018,
      bevelThickness: 0.02
    }),
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (moonRef.current) {
      moonRef.current.rotation.y += active ? 0.025 : 0.01
      moonRef.current.rotation.z = active ? Math.sin(t * 1.6) * 0.06 : Math.sin(t * 0.7) * 0.025
      moonRef.current.position.y = 1.12 + Math.sin(t * 1.8) * 0.055
    }

    if (halo1.current) {
      halo1.current.rotation.z += active ? 0.02 : 0.008
    }

    if (halo2.current) {
      halo2.current.rotation.z -= active ? 0.016 : 0.006
    }

    if (starDots.current) {
      starDots.current.children.forEach((child, index) => {
        child.position.y += Math.sin(t * 2 + index) * 0.0009
      })
    }
  })

  return (
    <group>
      <RoundBase color={color} accent="#f7efff" />

      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.34, 0.72, 28]} />
        <meshStandardMaterial color="#f7f4fb" roughness={0.72} />
      </mesh>

      <group ref={moonRef} position={[0, 1.12, 0]}>
        <mesh castShadow rotation={[0, 0, 0.08]}>
          <extrudeGeometry args={[crescentShape, moonExtrude]} />
          <meshStandardMaterial
            color="#f5edff"
            emissive={active ? '#e9dcff' : '#cdb8f5'}
            emissiveIntensity={active ? 0.95 : 0.25}
            roughness={0.32}
            metalness={0.08}
          />
        </mesh>
      </group>

      <mesh ref={halo1} position={[0, 1.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.018, 16, 80]} />
        <meshStandardMaterial color="#cbb7ff" emissive="#cbb7ff" emissiveIntensity={active ? 0.85 : 0.22} />
      </mesh>

      <mesh ref={halo2} position={[0, 1.12, 0]} rotation={[0.8, 0.5, 0]}>
        <torusGeometry args={[0.38, 0.014, 16, 80]} />
        <meshStandardMaterial color="#9fe3ff" emissive="#9fe3ff" emissiveIntensity={active ? 0.8 : 0.18} />
      </mesh>

      <group ref={starDots}>
        {[
          [0.48, 1.46, 0.08],
          [-0.4, 1.28, 0.12],
          [0.12, 1.62, -0.18],
          [-0.14, 0.96, 0.18]
        ].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#fff8d8' : '#d8f2ff'}
              emissive={i % 2 === 0 ? '#fff8d8' : '#d8f2ff'}
              emissiveIntensity={active ? 1 : 0.35}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ============================================================
   共用基座
============================================================ */
function RoundBase({ color, accent }) {
  return (
    <group>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.9, 0.16, 48]} />
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.02} />
      </mesh>

      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.75, 0.05, 48]} />
        <meshStandardMaterial color={accent} roughness={0.86} />
      </mesh>

      <mesh position={[0, 0.155, 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 24, 1, 0.5, Math.PI * 0.65]} />
        <meshStandardMaterial color="#bfe8ff" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[-0.38, 0.16, 0.12]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <circleGeometry args={[0.06, 18]} />
        <meshBasicMaterial color="#d9c2a0" transparent opacity={0.42} />
      </mesh>

      <mesh position={[0.36, 0.16, 0.18]} rotation={[-Math.PI / 2, 0, -0.15]}>
        <circleGeometry args={[0.07, 18]} />
        <meshBasicMaterial color="#d9c2a0" transparent opacity={0.42} />
      </mesh>
    </group>
  )
}
