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
    subtitle: '3D 海灘導覽員',
    position: [-4.2, 1.2, -3.4],
    accent: '#8fd3ff',
    route: '/guide',
    hoverText: '跟著海灘導覽員，一步步認識網站功能與探索入口。'
  },
  {
    key: 'map',
    title: '附近的友善海鮮地圖',
    subtitle: '3D 立體海灣沙盤',
    position: [0, 1, -6],
    accent: '#ffe29a',
    route: '/map',
    hoverText: '查看附近友善海鮮據點、推薦路線與在地探索資訊。'
  },
  {
    key: 'ar',
    title: 'AR 互動與永續標籤',
    subtitle: '3D 永續徽章展示台',
    position: [4.2, 1.2, -3.4],
    accent: '#d4b3ff',
    route: '/sustainability',
    hoverText: '透過 AR 與永續標章互動，快速理解海鮮來源與永續價值。'
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
            在陽光、海浪、粒子與互動角色之間進入地圖、導覽與 AR 標籤。
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
        {item.key === 'guide' && <BeachGuideHost active={active || hovered} color={item.accent} />}
        {item.key === 'map' && <BayMapDisplay active={active || hovered} color={item.accent} />}
        {item.key === 'ar' && <SustainabilityBadgeStand active={active || hovered} color={item.accent} />}
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
   1. BeachGuideHost —— 3D 海灘導覽員
============================================================ */
function BeachGuideHost({ active, color }) {
  const rootRef = useRef()
  const armRef = useRef()
  const signRef = useRef()
  const hatRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (rootRef.current) {
      rootRef.current.rotation.y = active ? Math.sin(t * 1.2) * 0.18 : Math.sin(t * 0.5) * 0.08
    }
    if (armRef.current) {
      armRef.current.rotation.z = active ? -0.95 + Math.sin(t * 4) * 0.28 : -0.95
    }
    if (signRef.current) {
      signRef.current.rotation.z = active ? Math.sin(t * 2.3) * 0.08 : 0.02
    }
    if (hatRef.current) {
      hatRef.current.rotation.z = active ? Math.sin(t * 1.6) * 0.03 : 0
    }
  })

  return (
    <group ref={rootRef} scale={[0.95, 0.95, 0.95]}>
      <RoundBase color={color} accent="#fff5de" />

      {/* 腳 */}
      <mesh position={[-0.16, 0.38, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.55, 8, 16]} />
        <meshStandardMaterial color="#e8bf96" roughness={0.75} />
      </mesh>
      <mesh position={[0.16, 0.38, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.55, 8, 16]} />
        <meshStandardMaterial color="#e8bf96" roughness={0.75} />
      </mesh>

      {/* 鞋 / 涼鞋 */}
      <mesh position={[-0.16, 0.02, 0.08]} castShadow>
        <boxGeometry args={[0.18, 0.06, 0.28]} />
        <meshStandardMaterial color="#7a5c43" roughness={0.8} />
      </mesh>
      <mesh position={[0.16, 0.02, 0.08]} castShadow>
        <boxGeometry args={[0.18, 0.06, 0.28]} />
        <meshStandardMaterial color="#7a5c43" roughness={0.8} />
      </mesh>

      {/* 短褲 */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.34, 0.42, 24]} />
        <meshStandardMaterial color="#d8c49e" roughness={0.86} />
      </mesh>

      {/* 上身 */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.7, 10, 20]} />
        <meshStandardMaterial color="#f5fcff" roughness={0.72} />
      </mesh>

      {/* 領口 */}
      <mesh position={[0, 1.67, 0.24]} castShadow>
        <torusGeometry args={[0.1, 0.018, 10, 24, Math.PI]} />
        <meshStandardMaterial color="#8fd3ff" roughness={0.55} />
      </mesh>

      {/* 左手 */}
      <mesh position={[-0.42, 1.3, 0]} rotation={[0, 0, 0.18]} castShadow>
        <capsuleGeometry args={[0.07, 0.62, 8, 16]} />
        <meshStandardMaterial color="#e8bf96" roughness={0.75} />
      </mesh>

      {/* 右手（揮手） */}
      <group ref={armRef} position={[0.42, 1.58, 0]} rotation={[0, 0, -0.95]}>
        <mesh position={[0.18, 0, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.55, 8, 16]} />
          <meshStandardMaterial color="#e8bf96" roughness={0.75} />
        </mesh>
      </group>

      {/* 頭 */}
      <mesh position={[0, 2.08, 0]} castShadow>
        <sphereGeometry args={[0.24, 28, 28]} />
        <meshStandardMaterial color="#f0c89f" roughness={0.7} />
      </mesh>

      {/* 帽子 */}
      <group ref={hatRef} position={[0, 2.28, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.16, 24]} />
          <meshStandardMaterial color="#d9c18b" roughness={0.78} />
        </mesh>
        <mesh position={[0, -0.06, 0]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.36, 0.03, 30]} />
          <meshStandardMaterial color="#ead8a6" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.01, 0.17]}>
          <boxGeometry args={[0.28, 0.04, 0.02]} />
          <meshStandardMaterial color="#8fd3ff" roughness={0.6} />
        </mesh>
      </group>

      {/* 臉部簡化 */}
      <mesh position={[-0.07, 2.1, 0.2]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial color="#2a3d4f" />
      </mesh>
      <mesh position={[0.07, 2.1, 0.2]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial color="#2a3d4f" />
      </mesh>
      <mesh position={[0, 2.0, 0.22]}>
        <torusGeometry args={[0.05, 0.01, 8, 18, Math.PI]} />
        <meshStandardMaterial color="#c56d63" roughness={0.65} />
      </mesh>

      {/* 指示牌 */}
      <group ref={signRef} position={[-0.68, 1.16, 0.02]} rotation={[0, 0, 0.02]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.95, 12]} />
          <meshStandardMaterial color="#8c6239" roughness={0.88} />
        </mesh>
        <mesh position={[0.22, 0.14, 0]} castShadow>
          <boxGeometry args={[0.5, 0.28, 0.05]} />
          <meshStandardMaterial color="#fff6df" roughness={0.78} />
        </mesh>
        <mesh position={[0.22, 0.14, 0.03]}>
          <boxGeometry args={[0.3, 0.05, 0.01]} />
          <meshStandardMaterial color="#2c6fa2" roughness={0.7} />
        </mesh>
        <mesh position={[0.29, 0.04, 0.03]} rotation={[0, 0, -0.45]}>
          <coneGeometry args={[0.06, 0.16, 3]} />
          <meshStandardMaterial color="#ffb86a" roughness={0.65} />
        </mesh>
      </group>

      {/* 小背包 */}
      <mesh position={[-0.16, 1.4, -0.2]} castShadow>
        <boxGeometry args={[0.18, 0.28, 0.16]} />
        <meshStandardMaterial color="#6fc1c7" roughness={0.75} />
      </mesh>

      {/* 輕微發光點綴 */}
      <mesh position={[0.55, 2.1, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.8 : 0}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   2. BayMapDisplay —— 3D 立體海灣沙盤
============================================================ */
function BayMapDisplay({ active, color }) {
  const islandRef = useRef()
  const lighthouseRef = useRef()
  const pinGroupRef = useRef()
  const boatRef = useRef()

  const pathCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.65, 0.18, 0.1),
      new THREE.Vector3(-0.25, 0.22, 0.02),
      new THREE.Vector3(0.05, 0.18, -0.08),
      new THREE.Vector3(0.35, 0.22, -0.02),
      new THREE.Vector3(0.62, 0.19, 0.1)
    ])
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (islandRef.current) {
      islandRef.current.rotation.y = active ? Math.sin(t * 0.8) * 0.18 : Math.sin(t * 0.4) * 0.08
    }
    if (lighthouseRef.current) {
      lighthouseRef.current.rotation.y += active ? 0.02 : 0.006
    }
    if (pinGroupRef.current) {
      pinGroupRef.current.children.forEach((child, index) => {
        child.position.y = 0.45 + Math.sin(t * 2 + index * 0.8) * 0.06
      })
    }
    if (boatRef.current) {
      boatRef.current.rotation.z = Math.sin(t * 1.8) * 0.08
      boatRef.current.position.y = 0.26 + Math.sin(t * 1.8) * 0.03
    }
  })

  return (
    <group scale={[1, 1, 1]}>
      <RoundBase color={color} accent="#fff4d6" />

      {/* 海面底盤 */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.02, 0.18, 40]} />
        <meshStandardMaterial color="#8cdfff" roughness={0.28} metalness={0.06} transparent opacity={0.96} />
      </mesh>

      {/* 沙盤島嶼群 */}
      <group ref={islandRef}>
        <mesh position={[0, 0.31, 0.02]} castShadow>
          <cylinderGeometry args={[0.56, 0.66, 0.2, 7]} />
          <meshStandardMaterial color="#edd8a1" roughness={0.92} />
        </mesh>

        <mesh position={[-0.25, 0.37, 0.08]} castShadow>
          <cylinderGeometry args={[0.18, 0.24, 0.12, 6]} />
          <meshStandardMaterial color="#9ccc7c" roughness={0.88} />
        </mesh>

        <mesh position={[0.18, 0.36, -0.1]} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 0.12, 7]} />
          <meshStandardMaterial color="#9ccc7c" roughness={0.88} />
        </mesh>

        <mesh position={[0.02, 0.34, 0.18]} castShadow>
          <cylinderGeometry args={[0.14, 0.18, 0.08, 6]} />
          <meshStandardMaterial color="#9ccc7c" roughness={0.88} />
        </mesh>
      </group>

      {/* 路線 */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <tubeGeometry args={[pathCurve, 50, 0.02, 8, false]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={active ? 0.5 : 0.15} />
      </mesh>

      {/* 定位點 */}
      <group ref={pinGroupRef}>
        {[
          [-0.42, 0.45, 0.12],
          [0.06, 0.45, -0.05],
          [0.42, 0.45, 0.12]
        ].map((pos, i) => (
          <group key={`pin-${i}`} position={pos}>
            <mesh castShadow>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial
                color={i === 1 ? '#ff9c6a' : '#5cc8ff'}
                emissive={i === 1 ? '#ff9c6a' : '#5cc8ff'}
                emissiveIntensity={active ? 0.75 : 0.25}
              />
            </mesh>
            <mesh position={[0, -0.1, 0]} castShadow>
              <coneGeometry args={[0.03, 0.12, 8]} />
              <meshStandardMaterial color={i === 1 ? '#ff9c6a' : '#5cc8ff'} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 燈塔 */}
      <group ref={lighthouseRef} position={[0.45, 0.52, -0.16]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.38, 18]} />
          <meshStandardMaterial color="#fffaf1" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.12, 0.08, 18]} />
          <meshStandardMaterial color="#f3b259" roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <coneGeometry args={[0.11, 0.12, 18]} />
          <meshStandardMaterial color="#ff7f50" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.18, 0.1]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#fff2a8" emissive="#fff2a8" emissiveIntensity={active ? 1.1 : 0.25} />
        </mesh>
      </group>

      {/* 小船 */}
      <group ref={boatRef} position={[-0.5, 0.26, -0.18]} rotation={[0, -0.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.05, 0.1]} />
          <meshStandardMaterial color="#8b5a3c" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.18, 8]} />
          <meshStandardMaterial color="#c49a6c" roughness={0.8} />
        </mesh>
        <mesh position={[0.05, 0.12, 0]} rotation={[0, 0, -0.25]} castShadow>
          <planeGeometry args={[0.12, 0.14]} />
          <meshStandardMaterial color="#fff8e8" side={THREE.DoubleSide} roughness={0.85} />
        </mesh>
      </group>
    </group>
  )
}

/* ============================================================
   3. SustainabilityBadgeStand —— 3D 永續徽章展示台
============================================================ */
function SustainabilityBadgeStand({ active, color }) {
  const ring1 = useRef()
  const ring2 = useRef()
  const badgeGroup = useRef()
  const coreRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (ring1.current) ring1.current.rotation.z += active ? 0.03 : 0.01
    if (ring2.current) ring2.current.rotation.z -= active ? 0.022 : 0.008

    if (badgeGroup.current) {
      badgeGroup.current.rotation.y += active ? 0.018 : 0.008
      badgeGroup.current.position.y = 1.08 + Math.sin(t * 1.8) * 0.05
    }

    if (coreRef.current) {
      const pulse = active ? 1 + Math.sin(t * 3.2) * 0.06 : 1 + Math.sin(t * 1.6) * 0.02
      coreRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <group>
      <RoundBase color={color} accent="#f7efff" />

      {/* 展示柱 */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.34, 0.75, 28]} />
        <meshStandardMaterial color="#f6f4fb" roughness={0.72} />
      </mesh>

      {/* 發光核心 */}
      <group ref={coreRef} position={[0, 1.1, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 26, 26]} />
          <meshStandardMaterial
            color="#dff7ff"
            emissive={active ? '#b8f0ff' : '#8adfff'}
            emissiveIntensity={active ? 1.2 : 0.45}
            transparent
            opacity={0.95}
          />
        </mesh>
      </group>

      {/* 光環 */}
      <mesh ref={ring1} position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.02, 16, 80]} />
        <meshStandardMaterial color="#9fe3ff" emissive="#9fe3ff" emissiveIntensity={active ? 0.9 : 0.25} />
      </mesh>

      <mesh ref={ring2} position={[0, 1.1, 0]} rotation={[0.7, 0.5, 0]}>
        <torusGeometry args={[0.34, 0.016, 16, 80]} />
        <meshStandardMaterial color="#d6b8ff" emissive="#d6b8ff" emissiveIntensity={active ? 0.8 : 0.2} />
      </mesh>

      {/* 徽章群 */}
      <group ref={badgeGroup} position={[0, 1.08, 0]}>
        <BadgeFish position={[0.52, 0.05, 0]} active={active} />
        <BadgeLeaf position={[-0.42, 0.12, 0.18]} active={active} />
        <BadgeCheck position={[-0.1, -0.2, -0.46]} active={active} />
        <BadgeAr position={[0.1, 0.24, -0.42]} active={active} />
      </group>

      {/* 小粒子珠 */}
      {[
        [0.55, 1.5, 0.2],
        [-0.48, 1.35, -0.1],
        [0.2, 1.65, -0.35]
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.045, 14, 14]} />
          <meshStandardMaterial
            color={i === 0 ? '#8fe1ff' : i === 1 ? '#d5c0ff' : '#fff0a3'}
            emissive={i === 0 ? '#8fe1ff' : i === 1 ? '#d5c0ff' : '#fff0a3'}
            emissiveIntensity={active ? 1 : 0.35}
          />
        </mesh>
      ))}
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

/* ============================================================
   徽章小元件
============================================================ */
function BadgeFish({ position, active }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
        <meshStandardMaterial color="#f7fdff" roughness={0.72} />
      </mesh>

      <mesh position={[0, 0, 0.04]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.06, 16, 12]} />
        <meshStandardMaterial color="#4abcf5" emissive="#4abcf5" emissiveIntensity={active ? 0.55 : 0.15} />
      </mesh>
      <mesh position={[0.06, 0, 0.04]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.05, 0.1, 3]} />
        <meshStandardMaterial color="#4abcf5" emissive="#4abcf5" emissiveIntensity={active ? 0.55 : 0.15} />
      </mesh>
      <mesh position={[-0.03, 0.02, 0.09]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#214056" />
      </mesh>
    </group>
  )
}

function BadgeLeaf({ position, active }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
        <meshStandardMaterial color="#f8fff6" roughness={0.72} />
      </mesh>

      <mesh position={[0, 0.02, 0.04]} rotation={[0, 0, 0.6]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial color="#6fca7d" emissive="#6fca7d" emissiveIntensity={active ? 0.5 : 0.12} />
      </mesh>
      <mesh position={[0, -0.02, 0.085]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.01, 0.12, 0.01]} />
        <meshStandardMaterial color="#3d8a47" />
      </mesh>
    </group>
  )
}

function BadgeCheck({ position, active }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
        <meshStandardMaterial color="#fffef7" roughness={0.72} />
      </mesh>

      <mesh position={[0, 0, 0.05]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.03, 0.14, 0.02]} />
        <meshStandardMaterial color="#f0ba47" emissive="#f0ba47" emissiveIntensity={active ? 0.45 : 0.12} />
      </mesh>
      <mesh position={[0.05, -0.03, 0.05]} rotation={[0, 0, -0.9]}>
        <boxGeometry args={[0.03, 0.24, 0.02]} />
        <meshStandardMaterial color="#f0ba47" emissive="#f0ba47" emissiveIntensity={active ? 0.45 : 0.12} />
      </mesh>
    </group>
  )
}

function BadgeAr({ position, active }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
        <meshStandardMaterial color="#fcf7ff" roughness={0.72} />
      </mesh>

      <mesh position={[0, 0, 0.05]}>
        <torusGeometry args={[0.07, 0.014, 12, 28]} />
        <meshStandardMaterial color="#a77cff" emissive="#a77cff" emissiveIntensity={active ? 0.6 : 0.16} />
      </mesh>
      <mesh position={[0, 0, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.03, 0.01, 10, 20]} />
        <meshStandardMaterial color="#7fd9ff" emissive="#7fd9ff" emissiveIntensity={active ? 0.6 : 0.16} />
      </mesh>
    </group>
  )
}
