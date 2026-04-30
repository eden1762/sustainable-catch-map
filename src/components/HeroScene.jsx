// 請把這份檔案完整覆蓋到：src/components/HeroScene.jsx
// 目的：
// 1. 手機版三個 3D 模型垂直排列、不重疊、看得到牛頓擺球組
// 2. 平板與電腦版三個 3D 模型水平排列，位於畫面垂直高度約 1/2
// 3. 每個模型下方固定顯示：選項標題 + 說明文字，不用 hover
// 4. 首頁不再另外顯示重複的選項按鈕與狀態卡
// 5. 「永續漁獲地圖」只在左上角網站品牌區顯示一次

import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Float,
  Html,
  OrbitControls,
  Sky,
  Sparkles,
  Stars,
  useCursor
} from '@react-three/drei'
import * as THREE from 'three'

const MENU_ITEMS = [
  {
    key: 'guide',
    title: '網站導覽',
    shortLabel: '看懂網站入口',
    accent: '#8fd3ff',
    route: '/guide',
    hoverText: '用一雙明亮的眼睛帶你快速看見網站功能、入口與探索方向。',
    desktopPosition: [-3.05, 0.0, -3.35],
    tabletPosition: [-2.15, 0.0, -3.35],
    mobilePosition: [0, 2.0, -3.15],
    desktopScale: 1.05,
    tabletScale: 0.9,
    mobileScale: 0.74
  },
  {
    key: 'map',
    title: '附近的友善海鮮地圖',
    shortLabel: '找附近友善海鮮',
    accent: '#7ee7d4',
    route: '/map',
    hoverText: '跟著小魚游向附近友善海鮮據點，探索推薦路線與在地永續資訊。',
    desktopPosition: [0, 0.0, -3.55],
    tabletPosition: [0, 0.0, -3.55],
    mobilePosition: [0, 0.25, -3.2],
    desktopScale: 1.08,
    tabletScale: 0.92,
    mobileScale: 0.76
  },
  {
    key: 'ar',
    title: 'AR 互動與永續標籤',
    shortLabel: '理解永續標籤',
    accent: '#d4b3ff',
    route: '/sustainability',
    hoverText: '透過牛頓擺的節奏互動，理解海鮮來源、永續標籤與友善選擇。',
    desktopPosition: [3.05, 0.0, -3.35],
    tabletPosition: [2.15, 0.0, -3.35],
    mobilePosition: [0, -1.55, -3.15],
    desktopScale: 1.05,
    tabletScale: 0.9,
    mobileScale: 0.74
  }
]

export default function HeroScene() {
  const [activeKey, setActiveKey] = useState('guide')

  return (
    <div className="hero-shell">
      <Canvas camera={{ position: [0, 1.9, 7.2], fov: 48 }} dpr={[1, 2]} shadows>
        <color attach="background" args={['#d6eeff']} />
        <fog attach="fog" args={['#c8e8ff', 18, 42]} />
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

      <div className="hero-overlay" aria-hidden="true" />
    </div>
  )
}

function BeachWorld({ activeKey, setActiveKey }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[8, 12, 4]}
        intensity={3.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-4, 4, -4]} intensity={1.2} color="#90d5ff" />
      <hemisphereLight args={['#ffffff', '#87CEEB', 2]} />

      <Sky
        sunPosition={[8, 6, -10]}
        turbidity={0.8}
        rayleigh={0.5}
        mieCoefficient={0.002}
        mieDirectionalG={0.9}
      />
      <Stars radius={80} depth={40} count={500} factor={2} saturation={0} fade speed={0.5} />
      <Sparkles count={150} scale={[30, 10, 30]} size={2} speed={0.3} opacity={0.2} color="#ffffff" />

      <SunGlare />
      <Clouds />
      <Sand />
      <SandDetails />
      <Sea />
      <SeaReflection />
      <WaveLayer offset={0} speed={1.2} opacity={0.6} color="#ffffff" z={-9.5} />
      <WaveLayer offset={Math.PI * 0.5} speed={0.9} opacity={0.4} color="#e0f7ff" z={-10.5} />
      <ShoreFoam />
      <Footsteps />
      <Shells />
      <InteractiveObjects activeKey={activeKey} setActiveKey={setActiveKey} />
    </>
  )
}

function InteractiveObjects({ activeKey, setActiveKey }) {
  const { size } = useThree()

  const getLayout = (item) => {
    if (size.width <= 600) {
      return {
        position: item.mobilePosition,
        scale: item.mobileScale,
        captionY: -1.0,
        captionDistance: 9.5
      }
    }

    if (size.width <= 1024) {
      return {
        position: item.tabletPosition,
        scale: item.tabletScale,
        captionY: -1.42,
        captionDistance: 10.5
      }
    }

    return {
      position: item.desktopPosition,
      scale: item.desktopScale,
      captionY: -1.45,
      captionDistance: 11
    }
  }

  return (
    <group position={[0, 0.35, 0]}>
      {MENU_ITEMS.map((item) => {
        const layout = getLayout(item)
        return (
          <InteractiveMenuObject
            key={item.key}
            item={{
              ...item,
              position: layout.position,
              objectScale: layout.scale,
              captionY: layout.captionY,
              captionDistance: layout.captionDistance
            }}
            active={activeKey === item.key}
            setActiveKey={setActiveKey}
          />
        )
      })}
    </group>
  )
}

function SunGlare() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.material.opacity = 0.16 + Math.sin(t * 0.8) * 0.03
  })

  return (
    <group ref={ref} position={[7.5, 5.8, -9]}>
      <mesh>
        <sphereGeometry args={[2.2, 48, 48]} />
        <meshBasicMaterial color="#fff9d7" transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.6, 48, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Clouds() {
  return (
    <group>
      {[
        [-6, 4.4, -12, 1.2],
        [-2.5, 5.1, -13, 0.9],
        [3.8, 4.8, -12.5, 1.1],
        [7.5, 5.4, -14, 1.4]
      ].map(([x, y, z, s], i) => (
        <group key={i} position={[x, y, z]} scale={s}>
          <mesh position={[-0.5, 0, 0]}>
            <sphereGeometry args={[0.65, 24, 24]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.26} />
          </mesh>
          <mesh position={[0.1, 0.15, 0]}>
            <sphereGeometry args={[0.85, 24, 24]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
          <mesh position={[0.8, -0.02, 0]}>
            <sphereGeometry args={[0.55, 24, 24]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Sand() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
        <planeGeometry args={[70, 50, 128, 128]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} metalness={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.145, -1.2]}>
        <planeGeometry args={[70, 18, 64, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.32} />
      </mesh>
    </group>
  )
}

function SandDetails() {
  return (
    <group>
      {[
        [-6.2, -1.12, 4.6, 1.3, 0.5, 0.15],
        [-1.2, -1.11, 2.4, 1.0, 0.28, -0.05],
        [3.4, -1.1, 3.2, 0.9, 0.32, 0.1],
        [6.2, -1.105, 5.1, 0.95, 0.38, -0.2],
        [1.4, -1.108, 6.7, 1.2, 0.5, 0.4]
      ].map(([x, y, z, sx, sy, r], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[-Math.PI / 2, 0, r]}>
          <circleGeometry args={[1.0, 48]} />
          <meshBasicMaterial color="#d8c9aa" transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  )
}

function Sea() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.72 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.08, -8.8]} receiveShadow>
      <planeGeometry args={[80, 18, 96, 32]} />
      <meshPhysicalMaterial
        color="#48c6ee"
        transmission={0.25}
        transparent
        opacity={0.75}
        roughness={0.08}
        metalness={0.02}
        clearcoat={1}
        clearcoatRoughness={0.08}
      />
    </mesh>
  )
}

function SeaReflection() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.08
  })

  return (
    <group ref={ref} position={[0, -1.04, -6.4]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[i * 1.8 - 1.8, 0, i * -0.4]}>
          <circleGeometry args={[1.2 + i * 0.25, 48]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  )
}

function WaveLayer({ offset, speed, opacity, color, z }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + offset
    ref.current.position.x = Math.sin(t) * 0.25
    ref.current.scale.x = 1 + Math.sin(t * 1.2) * 0.04
  })

  return (
    <group ref={ref} position={[0, -0.98, z]}>
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh key={i} position={[(i - 5) * 1.55, 0, Math.sin(i) * 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.035, 8, 48, Math.PI]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  )
}

function ShoreFoam() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.z = -4.1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.18
  })

  return (
    <group ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.03, -4.15]}>
        <planeGeometry args={[70, 0.28, 64, 2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.025, -3.75]}>
        <planeGeometry args={[70, 0.18, 64, 2]} />
        <meshBasicMaterial color="#ddf9ff" transparent opacity={0.42} />
      </mesh>
    </group>
  )
}

function Footsteps() {
  return (
    <group>
      {Array.from({ length: 8 }).map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1
        return (
          <mesh
            key={i}
            position={[side * 0.32 + i * 0.45 - 2.1, -1.075, 5.2 + i * 0.35]}
            rotation={[-Math.PI / 2, 0, side * 0.25]}
            scale={[0.22, 0.12, 1]}
          >
            <circleGeometry args={[1, 20]} />
            <meshBasicMaterial color="#c9b894" transparent opacity={0.35} />
          </mesh>
        )
      })}
    </group>
  )
}

function Shells() {
  const shells = [
    [-6.2, -1.02, 5.4, 0.24, '#fff1dc'],
    [5.8, -1.02, 4.9, 0.2, '#ffe0cf'],
    [1.2, -1.02, 7.2, 0.18, '#fff7ef'],
    [-3.2, -1.02, 7.8, 0.16, '#f7d7bd']
  ]

  return (
    <group>
      {shells.map(([x, y, z, scale, color], i) => (
        <group key={i} position={[x, y, z]} scale={scale} rotation={[0, i * 0.7, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.04} side={THREE.DoubleSide} />
          </mesh>
          {[0.25, 0.5, 0.75, 1.0].map((r, ri) => (
            <mesh key={ri}>
              <torusGeometry args={[r * 0.09, 0.004, 8, 24, Math.PI]} />
              <meshBasicMaterial color="#e8c8a8" transparent opacity={0.55} />
            </mesh>
          ))}
        </group>
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
    ref.current.position.y = item.position[1] + Math.sin(t * 1.5 + item.position[0]) * 0.04
    if (haloRef.current) {
      haloRef.current.material.opacity = active || hovered ? 0.6 : 0.22
      haloRef.current.rotation.z += 0.01
      haloRef.current.scale.setScalar(active || hovered ? 1.12 : 1)
    }
  })

  const events = {
    onPointerEnter: () => {
      setHovered(true)
      setActiveKey(item.key)
    },
    onPointerLeave: () => setHovered(false),
    onClick: () => { window.location.href = item.route }
  }

  return (
    <group ref={ref} position={item.position} scale={item.objectScale || 1} {...events}>
      <Float speed={active ? 2.3 : 1.4} rotationIntensity={0.22} floatIntensity={0.22}>
        {item.key === 'guide' && <EyesGuide active={active || hovered} color={item.accent} />}
        {item.key === 'map' && <FriendlyFish active={active || hovered} color={item.accent} />}
        {item.key === 'ar' && <NewtonCradle active={active || hovered} color={item.accent} />}
      </Float>

      <mesh ref={haloRef} position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.88, 1.32, 56]} />
        <meshBasicMaterial color={item.accent} transparent opacity={0.22} />
      </mesh>
      <mesh position={[0, -0.74, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.88, 56]} />
        <meshBasicMaterial color={item.accent} transparent opacity={0.06} />
      </mesh>

      <Html position={[0, item.captionY ?? -1.45, 0]} center distanceFactor={item.captionDistance ?? 11}>
        <div className={`model-caption ${active || hovered ? 'active' : ''}`}>
          <div className="model-caption-title">{item.title}</div>
          <div className="model-caption-desc">{item.hoverText}</div>
        </div>
      </Html>
    </group>
  )
}

function EyesGuide({ active, color }) {
  const groupRef = useRef()
  const leftPupil = useRef()
  const rightPupil = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      const scale = active ? 1.05 + Math.sin(t * 4) * 0.02 : 1
      groupRef.current.rotation.y = Math.sin(t * 1.5) * 0.15
      groupRef.current.scale.setScalar(scale)
    }
    const lookX = Math.sin(t * 2) * 0.05
    const lookY = Math.cos(t * 1.5) * 0.03
    if (leftPupil.current) leftPupil.current.position.set(-0.28 + lookX, lookY, 0.24)
    if (rightPupil.current) rightPupil.current.position.set(0.28 + lookX, lookY, 0.24)
  })

  return (
    <group>
      <RoundBase color={color} accent="#eefaff" />
      <group ref={groupRef} position={[0, 1.08, 0]}>
        <mesh position={[-0.28, 0, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0.28, 0, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh ref={leftPupil} position={[-0.28, 0, 0.24]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#0b1b2b" roughness={0.1} metalness={0.5} />
        </mesh>
        <mesh ref={rightPupil} position={[0.28, 0, 0.24]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#0b1b2b" roughness={0.1} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <torusGeometry args={[0.65, 0.03, 16, 64]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.5 : 0.5} />
        </mesh>
        <mesh position={[0, 0, -0.03]}>
          <torusGeometry args={[0.82, 0.018, 16, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  )
}

function FriendlyFish({ active, color }) {
  const fishRef = useRef()
  const tailRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (fishRef.current) {
      fishRef.current.rotation.y = Math.sin(t * 1.4) * 0.18
      fishRef.current.position.y = 1.05 + Math.sin(t * 2) * 0.05
      fishRef.current.scale.setScalar(active ? 1.05 + Math.sin(t * 4) * 0.02 : 1)
    }
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 8) * 0.35
  })

  return (
    <group>
      <RoundBase color={color} accent="#edfff9" />
      <group ref={fishRef} position={[0, 1.05, 0]} rotation={[0, -0.3, 0]}>
        <mesh scale={[0.95, 0.48, 0.42]} castShadow>
          <sphereGeometry args={[0.5, 40, 28]} />
          <meshStandardMaterial color="#ff7a22" roughness={0.35} metalness={0.08} emissive="#ff5c00" emissiveIntensity={active ? 0.18 : 0.05} />
        </mesh>
        <mesh ref={tailRef} position={[-0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <coneGeometry args={[0.34, 0.55, 3]} />
          <meshStandardMaterial color="#ffd84d" roughness={0.45} metalness={0.04} />
        </mesh>
        <mesh position={[0.5, 0.12, 0.25]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.53, 0.12, 0.29]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#102a43" />
        </mesh>
        <mesh position={[0.1, 0.34, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.13, 0.35, 3]} />
          <meshStandardMaterial color="#ffb347" roughness={0.4} />
        </mesh>
        <mesh position={[0.12, -0.32, 0]} rotation={[Math.PI, 0, -0.2]}>
          <coneGeometry args={[0.12, 0.3, 3]} />
          <meshStandardMaterial color="#ffb347" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

function NewtonCradle({ active, color }) {
  const groupRef = useRef()
  const ballRefs = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.1
      groupRef.current.scale.setScalar(active ? 1.04 + Math.sin(t * 3) * 0.015 : 1)
    }

    ballRefs.current.forEach((ball, i) => {
      if (!ball) return
      const swing = i === 0 ? Math.sin(t * 2.6) * 0.18 : i === 3 ? -Math.sin(t * 2.6) * 0.18 : 0
      ball.position.x = (i - 1.5) * 0.24 + swing
      ball.position.y = -0.05 + Math.abs(swing) * 0.15
    })
  })

  return (
    <group>
      <RoundBase color={color} accent="#fbf3ff" />
      <group ref={groupRef} position={[0, 1.05, 0]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.3, 0.08, 0.08]} />
          <meshStandardMaterial color="#6a7f99" roughness={0.25} metalness={0.5} />
        </mesh>
        <mesh position={[-0.62, 0.0, 0]}>
          <boxGeometry args={[0.08, 1.15, 0.08]} />
          <meshStandardMaterial color="#6a7f99" roughness={0.25} metalness={0.5} />
        </mesh>
        <mesh position={[0.62, 0.0, 0]}>
          <boxGeometry args={[0.08, 1.15, 0.08]} />
          <meshStandardMaterial color="#6a7f99" roughness={0.25} metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[1.55, 0.08, 0.18]} />
          <meshStandardMaterial color="#f1e6ff" roughness={0.5} metalness={0.04} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <group key={i}>
            <mesh position={[(i - 1.5) * 0.24, 0.26, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.62, 8]} />
              <meshBasicMaterial color="#d8e5ef" />
            </mesh>
            <mesh
              ref={(el) => { ballRefs.current[i] = el }}
              position={[(i - 1.5) * 0.24, -0.05, 0]}
              castShadow
            >
              <sphereGeometry args={[0.16, 32, 32]} />
              <meshStandardMaterial color={i % 2 ? '#34495e' : '#203040'} roughness={0.18} metalness={0.65} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

function RoundBase({ color, accent }) {
  return (
    <group>
      <mesh position={[0, -0.88, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.82, 1.0, 0.16, 64]} />
        <meshStandardMaterial color={accent} roughness={0.45} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.88, 0.035, 16, 80]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} />
      </mesh>
    </group>
  )
}
