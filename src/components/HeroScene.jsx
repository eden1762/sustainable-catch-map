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
    subtitle: '3D 小旗子路標',
    position: [-4.2, 1.2, -3.4],
    accent: '#8fd3ff',
    route: '/guide',
    hoverText: '跟著旗子路標，快速找到網站功能、入口與探索方向。'
  },
  {
    key: 'map',
    title: '附近的友善海鮮地圖',
    subtitle: '3D 手機 + 地圖定位釘',
    position: [0, 1, -6],
    accent: '#ffe29a',
    route: '/map',
    hoverText: '打開地圖模式，查看附近友善海鮮據點、推薦路線與在地探索資訊。'
  },
  {
    key: 'ar',
    title: 'AR 互動與永續標籤',
    subtitle: '3D 星星徽章',
    position: [4.2, 1.2, -3.4],
    accent: '#d4b3ff',
    route: '/sustainability',
    hoverText: '透過 AR 與永續星章互動，快速理解海鮮來源與永續價值。'
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
        {item.key === 'guide' && <FlagSignpost active={active || hovered} color={item.accent} />}
        {item.key === 'map' && <PhoneMapMarker active={active || hovered} color={item.accent} />}
        {item.key === 'ar' && <StarBadgeTotem active={active || hovered} color={item.accent} />}
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
   1. FlagSignpost —— 3D 小旗子路標
============================================================ */
function FlagSignpost({ active, color }) {
  const rootRef = useRef()
  const flagRef = useRef()
  const arrowRef = useRef()
  const bubbleRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (rootRef.current) {
      rootRef.current.rotation.y = active ? Math.sin(t * 1.1) * 0.16 : Math.sin(t * 0.45) * 0.06
    }

    if (flagRef.current) {
      flagRef.current.rotation.z = active ? Math.sin(t * 3.2) * 0.09 : Math.sin(t * 1.6) * 0.04
      flagRef.current.position.x = 0.2 + (active ? Math.sin(t * 2.8) * 0.02 : 0)
    }

    if (arrowRef.current) {
      arrowRef.current.rotation.z = active ? Math.sin(t * 2.4) * 0.08 : 0
    }

    if (bubbleRef.current) {
      bubbleRef.current.position.y = 1.95 + Math.sin(t * 2.2) * 0.05
      bubbleRef.current.scale.setScalar(active ? 1 + Math.sin(t * 3.6) * 0.05 : 1)
    }
  })

  return (
    <group ref={rootRef} scale={[1, 1, 1]}>
      <RoundBase color={color} accent="#fff5de" />

      {/* 主竿 */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, 1.62, 18]} />
        <meshStandardMaterial color="#c79a67" roughness={0.84} />
      </mesh>

      {/* 底部木樁 */}
      <mesh position={[0, 0.23, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.28, 18]} />
        <meshStandardMaterial color="#a97c50" roughness={0.86} />
      </mesh>

      {/* 箭頭路牌 */}
      <group ref={arrowRef} position={[0.34, 1.12, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.18, 0.06]} />
          <meshStandardMaterial color="#fff7df" roughness={0.78} />
        </mesh>
        <mesh position={[0.27, 0, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.11, 0.2, 3]} />
          <meshStandardMaterial color="#fff7df" roughness={0.78} />
        </mesh>

        <mesh position={[-0.06, 0.02, 0.035]}>
          <boxGeometry args={[0.2, 0.03, 0.01]} />
          <meshStandardMaterial color="#59aee6" />
        </mesh>
        <mesh position={[-0.08, -0.04, 0.035]}>
          <boxGeometry args={[0.15, 0.02, 0.01]} />
          <meshStandardMaterial color="#8dcdf8" />
        </mesh>
      </group>

      {/* 小旗子 */}
      <group ref={flagRef} position={[0.04, 1.7, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.5, 10]} />
          <meshStandardMaterial color="#d4aa78" roughness={0.82} />
        </mesh>

        <mesh position={[0.18, 0.08, 0]} castShadow>
          <boxGeometry args={[0.34, 0.2, 0.02]} />
          <meshStandardMaterial
            color="#ffb86a"
            emissive={active ? '#ffb86a' : '#000000'}
            emissiveIntensity={active ? 0.3 : 0}
            roughness={0.68}
          />
        </mesh>

        <mesh position={[0.32, 0.08, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.16, 3]} />
          <meshStandardMaterial
            color="#ffb86a"
            emissive={active ? '#ffb86a' : '#000000'}
            emissiveIntensity={active ? 0.3 : 0}
            roughness={0.68}
          />
        </mesh>

        <mesh position={[0.16, 0.08, 0.02]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial color="#fff4e7" />
        </mesh>
      </group>

      {/* 浮動小泡泡 */}
      <group ref={bubbleRef} position={[-0.34, 1.95, 0.08]}>
        <mesh>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial
            color="#dff7ff"
            emissive={active ? '#bcefff' : '#8fd3ff'}
            emissiveIntensity={active ? 1 : 0.28}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>

      {/* 小星點 */}
      <mesh position={[0.42, 1.75, 0.16]}>
        <sphereGeometry args={[0.045, 14, 14]} />
        <meshStandardMaterial
          color={color}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.8 : 0}
          transparent
          opacity={0.92}
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   2. PhoneMapMarker —— 3D 手機 + 地圖定位釘
============================================================ */
function PhoneMapMarker({ active, color }) {
  const phoneRef = useRef()
  const pinRef = useRef()
  const pulseRef = useRef()
  const routeDotsRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (phoneRef.current) {
      phoneRef.current.rotation.y = active ? Math.sin(t * 0.9) * 0.22 : Math.sin(t * 0.45) * 0.08
      phoneRef.current.rotation.x = -0.08 + Math.sin(t * 0.8) * 0.02
    }

    if (pinRef.current) {
      pinRef.current.position.y = 1.22 + Math.sin(t * 2.2) * 0.06
      pinRef.current.rotation.z = Math.sin(t * 1.8) * 0.1
    }

    if (pulseRef.current) {
      const s = active ? 1 + Math.sin(t * 3.5) * 0.08 : 1 + Math.sin(t * 1.8) * 0.03
      pulseRef.current.scale.set(s, s, s)
      pulseRef.current.material.opacity = active ? 0.36 + Math.sin(t * 3.5) * 0.08 : 0.18
    }

    if (routeDotsRef.current) {
      routeDotsRef.current.children.forEach((child, index) => {
        child.position.z = 0.052 + Math.sin(t * 2.4 + index * 0.7) * 0.01
      })
    }
  })

  return (
    <group>
      <RoundBase color={color} accent="#fff4d6" />

      {/* 手機本體 */}
      <group ref={phoneRef} position={[0, 0.95, 0]} rotation={[0.1, -0.18, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.92, 1.56, 0.14]} />
          <meshStandardMaterial color="#f4f8fc" roughness={0.45} metalness={0.08} />
        </mesh>

        {/* 邊框 */}
        <mesh position={[0, 0, 0.01]} castShadow>
          <boxGeometry args={[0.82, 1.38, 0.06]} />
          <meshStandardMaterial color="#1f3344" roughness={0.55} />
        </mesh>

        {/* 螢幕 */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.74, 1.28, 0.02]} />
          <meshStandardMaterial
            color="#8fdfff"
            emissive={active ? '#8fdfff' : '#56bfe8'}
            emissiveIntensity={active ? 0.72 : 0.28}
            roughness={0.22}
          />
        </mesh>

        {/* 地圖色塊 */}
        <mesh position={[-0.14, 0.15, 0.062]}>
          <boxGeometry args={[0.16, 0.5, 0.01]} />
          <meshStandardMaterial color="#b7e6a6" />
        </mesh>
        <mesh position={[0.05, -0.05, 0.062]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.12, 0.72, 0.01]} />
          <meshStandardMaterial color="#fff6d7" />
        </mesh>
        <mesh position={[0.18, 0.18, 0.062]}>
          <boxGeometry args={[0.16, 0.32, 0.01]} />
          <meshStandardMaterial color="#c4f0ff" />
        </mesh>

        {/* 路徑 */}
        <mesh position={[-0.03, -0.1, 0.067]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.06, 0.66, 0.005]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>

        {/* 螢幕孔位 */}
        <mesh position={[0, 0.58, 0.062]}>
          <boxGeometry args={[0.18, 0.025, 0.01]} />
          <meshStandardMaterial color="#243949" />
        </mesh>
        <mesh position={[0, -0.58, 0.062]}>
          <circleGeometry args={[0.045, 18]} />
          <meshStandardMaterial color="#e9f0f6" />
        </mesh>

        {/* 路線點 */}
        <group ref={routeDotsRef}>
          {[
            [-0.1, -0.32],
            [-0.02, -0.12],
            [0.08, 0.08],
            [0.16, 0.28]
          ].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.052]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshStandardMaterial
                color={i === 3 ? '#ffb86a' : '#ffffff'}
                emissive={i === 3 ? '#ffb86a' : '#ffffff'}
                emissiveIntensity={i === 3 && active ? 1 : 0.35}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* 浮動定位釘 */}
      <group ref={pinRef} position={[0.26, 1.22, 0.3]}>
        <mesh castShadow>
          <sphereGeometry args={[0.12, 18, 18]} />
          <meshStandardMaterial
            color="#ff9c6a"
            emissive="#ff9c6a"
            emissiveIntensity={active ? 0.95 : 0.35}
          />
        </mesh>
        <mesh position={[0, -0.16, 0]} castShadow>
          <coneGeometry args={[0.08, 0.22, 18]} />
          <meshStandardMaterial color="#ff9c6a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.01, 0.08]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#fff6ef" />
        </mesh>
      </group>

      {/* 定位波紋 */}
      <mesh ref={pulseRef} position={[0.26, 0.34, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.28, 32]} />
        <meshBasicMaterial color="#ffd29a" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

/* ============================================================
   3. StarBadgeTotem —— 3D 星星徽章
============================================================ */
function StarBadgeTotem({ active, color }) {
  const starRef = useRef()
  const ring1 = useRef()
  const ring2 = useRef()
  const gemRef = useRef()

  const starShape = useMemo(() => {
    const shape = new THREE.Shape()
    const outer = 0.34
    const inner = 0.15
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
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02
    }),
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (starRef.current) {
      starRef.current.rotation.y += active ? 0.03 : 0.01
      starRef.current.position.y = 1.16 + Math.sin(t * 1.9) * 0.06
    }

    if (ring1.current) {
      ring1.current.rotation.z += active ? 0.028 : 0.01
    }

    if (ring2.current) {
      ring2.current.rotation.z -= active ? 0.02 : 0.007
    }

    if (gemRef.current) {
      const s = active ? 1 + Math.sin(t * 3.4) * 0.07 : 1 + Math.sin(t * 1.7) * 0.025
      gemRef.current.scale.set(s, s, s)
    }
  })

  return (
    <group>
      <RoundBase color={color} accent="#f7efff" />

      {/* 展示柱 */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.34, 0.72, 28]} />
        <meshStandardMaterial color="#f7f4fb" roughness={0.72} />
      </mesh>

      {/* 星星徽章 */}
      <group ref={starRef} position={[0, 1.16, 0]}>
        <mesh castShadow rotation={[0, 0, 0.08]}>
          <extrudeGeometry args={[starShape, starExtrude]} />
          <meshStandardMaterial
            color="#ffd96a"
            emissive={active ? '#ffd96a' : '#f2c84d'}
            emissiveIntensity={active ? 0.95 : 0.28}
            roughness={0.42}
            metalness={0.12}
          />
        </mesh>

        <mesh position={[0, 0, 0.08]} castShadow rotation={[0, 0, 0.08]}>
          <circleGeometry args={[0.08, 20]} />
          <meshStandardMaterial color="#fff7da" />
        </mesh>
      </group>

      {/* 發光核心 */}
      <group ref={gemRef} position={[0, 1.14, 0.16]}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#fff4b3"
            emissive={active ? '#fff0a3' : '#ffe17a'}
            emissiveIntensity={active ? 1.15 : 0.35}
            transparent
            opacity={0.96}
          />
        </mesh>
      </group>

      {/* 外環 */}
      <mesh ref={ring1} position={[0, 1.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.02, 16, 80]} />
        <meshStandardMaterial color="#9fe3ff" emissive="#9fe3ff" emissiveIntensity={active ? 0.9 : 0.25} />
      </mesh>

      <mesh ref={ring2} position={[0, 1.13, 0]} rotation={[0.75, 0.55, 0]}>
        <torusGeometry args={[0.34, 0.016, 16, 80]} />
        <meshStandardMaterial color="#d6b8ff" emissive="#d6b8ff" emissiveIntensity={active ? 0.8 : 0.22} />
      </mesh>

      {/* 小珠點綴 */}
      {[
        [0.52, 1.46, 0.08],
        [-0.46, 1.3, 0.15],
        [0.14, 1.62, -0.28]
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
