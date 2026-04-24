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
    subtitle: '3D 眼睛導覽',
    position: [-4.2, 1.2, -3.4],
    accent: '#8fd3ff',
    route: '/guide',
    hoverText: '用一雙明亮的眼睛帶你快速看見網站功能、入口與探索方向。'
  },
  {
    key: 'map',
    title: '附近的友善海鮮地圖',
    subtitle: '3D 友善小魚',
    position: [0, 1, -6],
    accent: '#7ee7d4',
    route: '/map',
    hoverText: '跟著小魚游向附近友善海鮮據點，探索推薦路線與在地永續資訊。'
  },
  {
    key: 'ar',
    title: 'AR 互動與永續標籤',
    subtitle: '3D 牛頓擺球組',
    position: [4.2, 1.2, -3.4],
    accent: '#d4b3ff',
    route: '/sustainability',
    hoverText: '透過像牛頓擺一樣有節奏的互動，理解海鮮來源、標籤與永續價值。'
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
        {item.key === 'guide' && <EyesGuide active={active || hovered} color={item.accent} />}
        {item.key === 'map' && <FriendlyFish active={active || hovered} color={item.accent} />}
        {item.key === 'ar' && <NewtonCradle active={active || hovered} color={item.accent} />}
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
   1. EyesGuide —— 一雙眼睛，適合「網站導覽」
============================================================ */
function EyesGuide({ active, color }) {
  const groupRef = useRef()
  const leftPupil = useRef()
  const rightPupil = useRef()
  const blinkRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.position.y = 1.08 + Math.sin(t * 1.6) * 0.045
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.18
    }

    const lookX = Math.sin(t * 1.3) * 0.045
    const lookY = Math.cos(t * 1.1) * 0.025

    if (leftPupil.current) {
      leftPupil.current.position.x = -0.28 + lookX
      leftPupil.current.position.y = lookY
    }

    if (rightPupil.current) {
      rightPupil.current.position.x = 0.28 + lookX
      rightPupil.current.position.y = lookY
    }

    if (blinkRef.current) {
      const blink = active ? 1 : 0.92 + Math.sin(t * 2.2) * 0.04
      blinkRef.current.scale.y = blink
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = active ? 0.36 + Math.sin(t * 3) * 0.06 : 0.18
      glowRef.current.scale.setScalar(active ? 1.08 + Math.sin(t * 2.4) * 0.04 : 1)
    }
  })

  return (
    <group>
      <RoundBase color={color} accent="#eefaff" />

      <mesh ref={glowRef} position={[0, 1.08, -0.04]}>
        <cylinderGeometry args={[0.86, 0.86, 0.035, 56]} />
        <meshBasicMaterial color="#dff7ff" transparent opacity={0.2} />
      </mesh>

      <group ref={groupRef}>
        <group ref={blinkRef} position={[0, 1.08, 0]}>
          <mesh position={[-0.28, 0, 0]} castShadow>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.28} metalness={0.02} />
          </mesh>

          <mesh position={[0.28, 0, 0]} castShadow>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.28} metalness={0.02} />
          </mesh>

          <mesh ref={leftPupil} position={[-0.28, 0, 0.23]}>
            <sphereGeometry args={[0.105, 24, 24]} />
            <meshStandardMaterial
              color="#15324a"
              emissive={active ? '#244f6f' : '#000000'}
              emissiveIntensity={active ? 0.45 : 0.08}
              roughness={0.2}
            />
          </mesh>

          <mesh ref={rightPupil} position={[0.28, 0, 0.23]}>
            <sphereGeometry args={[0.105, 24, 24]} />
            <meshStandardMaterial
              color="#15324a"
              emissive={active ? '#244f6f' : '#000000'}
              emissiveIntensity={active ? 0.45 : 0.08}
              roughness={0.2}
            />
          </mesh>

          <mesh position={[-0.32, 0.12, 0.31]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          <mesh position={[0.24, 0.12, 0.31]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        <mesh position={[0, 0.72, 0]}>
          <torusGeometry args={[0.7, 0.025, 16, 90]} />
          <meshStandardMaterial
            color="#8fd3ff"
            emissive="#8fd3ff"
            emissiveIntensity={active ? 0.8 : 0.18}
            roughness={0.35}
          />
        </mesh>
      </group>

      {[[-0.62, 1.42, 0.1], [0.62, 1.38, 0.1], [0, 1.63, -0.12]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.045, 14, 14]} />
          <meshStandardMaterial
            color={i === 2 ? '#fff4b8' : '#dff8ff'}
            emissive={i === 2 ? '#fff4b8' : '#dff8ff'}
            emissiveIntensity={active ? 1 : 0.35}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ============================================================
   2. FriendlyFish —— 一條魚，適合「附近的友善海鮮地圖」
============================================================ */
function FriendlyFish({ active, color }) {
  const fishRef = useRef()
  const tailRef = useRef()
  const finRef = useRef()
  const bubbleRef = useRef()

  const tailShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0.02, 0)
    shape.lineTo(-0.46, 0.34)
    shape.lineTo(-0.38, 0)
    shape.lineTo(-0.46, -0.34)
    shape.lineTo(0.02, 0)
    shape.closePath()
    return shape
  }, [])

  const tailExtrude = useMemo(
    () => ({
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015
    }),
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (fishRef.current) {
      fishRef.current.position.y = 1.08 + Math.sin(t * 1.6) * 0.06
      fishRef.current.rotation.y = Math.sin(t * 0.75) * 0.22
      fishRef.current.rotation.z = Math.sin(t * 1.2) * 0.04
    }

    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * (active ? 6 : 3.2)) * 0.42
    }

    if (finRef.current) {
      finRef.current.rotation.z = -0.4 + Math.sin(t * 2.8) * 0.18
    }

    if (bubbleRef.current) {
      bubbleRef.current.children.forEach((child, index) => {
        child.position.y = 0.75 + index * 0.23 + Math.sin(t * 1.4 + index) * 0.06
        child.material.opacity = active ? 0.55 : 0.28
      })
    }
  })

  return (
    <group>
      <RoundBase color={color} accent="#e9fff9" />

      <group ref={fishRef} position={[0, 1.08, 0]}>
        <mesh castShadow scale={[1.15, 0.62, 0.48]}>
          <sphereGeometry args={[0.42, 36, 36]} />
          <meshStandardMaterial
            color="#47d6c7"
            emissive={active ? '#4ee7d8' : '#1aaea0'}
            emissiveIntensity={active ? 0.55 : 0.14}
            roughness={0.38}
            metalness={0.03}
          />
        </mesh>

        <group ref={tailRef} position={[-0.55, 0, -0.04]}>
          <mesh castShadow>
            <extrudeGeometry args={[tailShape, tailExtrude]} />
            <meshStandardMaterial
              color="#ffca7a"
              emissive={active ? '#ffd89b' : '#e7a94d'}
              emissiveIntensity={active ? 0.45 : 0.12}
              roughness={0.42}
            />
          </mesh>
        </group>

        <mesh ref={finRef} position={[0.05, 0.36, 0.03]} rotation={[0, 0, -0.45]}>
          <coneGeometry args={[0.16, 0.35, 3]} />
          <meshStandardMaterial color="#ffdf9c" roughness={0.45} />
        </mesh>

        <mesh position={[0.12, -0.36, 0.03]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.13, 0.28, 3]} />
          <meshStandardMaterial color="#ffdf9c" roughness={0.45} />
        </mesh>

        <mesh position={[0.36, 0.1, 0.35]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>

        <mesh position={[0.385, 0.1, 0.39]}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshStandardMaterial color="#123345" roughness={0.25} />
        </mesh>

        <mesh position={[0.5, -0.08, 0.34]} rotation={[0, 0, -0.15]}>
          <torusGeometry args={[0.085, 0.012, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#15515d" roughness={0.4} />
        </mesh>
      </group>

      <group ref={bubbleRef}>
        {[0, 1, 2, 3].map((_, i) => (
          <mesh key={i} position={[0.68 + i * 0.12, 0.75 + i * 0.22, 0.18]}>
            <sphereGeometry args={[0.045 + i * 0.01, 12, 12]} />
            <meshBasicMaterial color="#dffaff" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ============================================================
   3. NewtonCradle —— 牛頓擺球組，適合「AR 互動與永續標籤」
============================================================ */
function NewtonCradle({ active, color }) {
  const frameRef = useRef()
  const leftSwing = useRef()
  const rightSwing = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (frameRef.current) {
      frameRef.current.position.y = 1.02 + Math.sin(t * 1.25) * 0.035
      frameRef.current.rotation.y = Math.sin(t * 0.55) * 0.16
    }

    const swing = Math.sin(t * 2.4)
    const power = active ? 0.46 : 0.25

    if (leftSwing.current) {
      leftSwing.current.rotation.z = swing > 0 ? swing * power : 0
    }

    if (rightSwing.current) {
      rightSwing.current.rotation.z = swing < 0 ? swing * power : 0
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = active ? 0.32 + Math.sin(t * 2.6) * 0.05 : 0.16
      glowRef.current.scale.setScalar(active ? 1.06 + Math.sin(t * 2.2) * 0.04 : 1)
    }
  })

  const Ball = ({ x, color = '#eef3ff' }) => (
    <group position={[x, 0, 0]}>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.58, 8]} />
        <meshStandardMaterial color="#9aa9bd" roughness={0.38} metalness={0.35} />
      </mesh>
      <mesh position={[0, -0.62, 0]} castShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial
          color={color}
          metalness={0.35}
          roughness={0.22}
          emissive={active ? '#dfe8ff' : '#000000'}
          emissiveIntensity={active ? 0.2 : 0}
        />
      </mesh>
    </group>
  )

  return (
    <group>
      <RoundBase color={color} accent="#f7efff" />

      <mesh ref={glowRef} position={[0, 1.05, -0.06]}>
        <cylinderGeometry args={[0.82, 0.82, 0.035, 56]} />
        <meshBasicMaterial color="#ece2ff" transparent opacity={0.18} />
      </mesh>

      <group ref={frameRef} position={[0, 1.02, 0]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[1.35, 0.08, 0.08]} />
          <meshStandardMaterial color="#d7def0" metalness={0.25} roughness={0.35} />
        </mesh>

        <mesh position={[-0.72, -0.12, 0]} castShadow>
          <boxGeometry args={[0.08, 1.12, 0.08]} />
          <meshStandardMaterial color="#d7def0" metalness={0.25} roughness={0.35} />
        </mesh>

        <mesh position={[0.72, -0.12, 0]} castShadow>
          <boxGeometry args={[0.08, 1.12, 0.08]} />
          <meshStandardMaterial color="#d7def0" metalness={0.25} roughness={0.35} />
        </mesh>

        <mesh position={[0, -0.7, 0]} castShadow>
          <boxGeometry args={[1.55, 0.08, 0.12]} />
          <meshStandardMaterial color="#f3f0fb" roughness={0.45} />
        </mesh>

        <group ref={leftSwing} position={[-0.46, 0.38, 0]}>
          <Ball x={0} color="#cfefff" />
        </group>

        <group position={[-0.23, 0.38, 0]}>
          <Ball x={0} color="#eef3ff" />
        </group>

        <group position={[0, 0.38, 0]}>
          <Ball x={0} color="#eef3ff" />
        </group>

        <group position={[0.23, 0.38, 0]}>
          <Ball x={0} color="#eef3ff" />
        </group>

        <group ref={rightSwing} position={[0.46, 0.38, 0]}>
          <Ball x={0} color="#eadcff" />
        </group>

        <mesh position={[0, -0.02, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.78, 0.018, 16, 90]} />
          <meshStandardMaterial
            color="#c9b7ff"
            emissive="#c9b7ff"
            emissiveIntensity={active ? 0.75 : 0.16}
          />
        </mesh>
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
