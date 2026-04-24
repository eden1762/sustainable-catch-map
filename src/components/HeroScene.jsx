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
              onClick={() => { window.location.href = item.route }}
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

/* ============================================================
   Beach World — 整體場景
============================================================ */
function BeachWorld({ activeKey, setActiveKey }) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[6, 10, 3]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={35}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      {/* 補光：模擬天空反射 */}
      <directionalLight position={[-4, 3, 8]} intensity={0.6} color="#a8d8f8" />
      <hemisphereLight args={['#ffe8b0', '#7eceff', 1.5]} />

      {/* 晴天天空：加強太陽位置、清晰度 */}
      <Sky
        sunPosition={[6, 5, -8]}
        turbidity={2.5}
        rayleigh={1.2}
        mieCoefficient={0.003}
        mieDirectionalG={0.85}
        inclination={0.48}
        azimuth={0.25}
      />
      <Stars radius={80} depth={40} count={800} factor={1.8} saturation={0} fade speed={0.2} />
      <Sparkles count={100} scale={[28, 10, 28]} size={1.8} speed={0.2} opacity={0.15} color="#fff8e0" />

      <SunGlare />
      <Clouds />
      <Sand />
      <SandDetails />
      <Sea />
      <SeaReflection />
      <WaveLayer offset={0} speed={1.4} opacity={0.55} color="#a8e4f8" z={-9.5} />
      <WaveLayer offset={Math.PI * 0.5} speed={1.1} opacity={0.4} color="#c2eeff" z={-10.5} />
      <ShoreFoam />
      <Footsteps />
      <SeashellDecor />

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

/* ============================================================
   太陽光暈 — 更豐富的光芒效果
============================================================ */
function SunGlare() {
  const coreRef = useRef()
  const halo1Ref = useRef()
  const halo2Ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (halo1Ref.current) {
      halo1Ref.current.material.opacity = 0.12 + Math.sin(t * 0.7) * 0.03
      halo1Ref.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.04)
    }
    if (halo2Ref.current) {
      halo2Ref.current.material.opacity = 0.06 + Math.sin(t * 0.4) * 0.02
    }
  })

  return (
    <group position={[7, 6.5, -16]}>
      {/* 太陽核心 */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshBasicMaterial color="#fff9e0" toneMapped={false} />
      </mesh>
      {/* 暈圈 1 */}
      <mesh ref={halo1Ref} rotation={[0, 0, 0]}>
        <ringGeometry args={[1.0, 2.2, 64]} />
        <meshBasicMaterial color="#fff4c0" transparent opacity={0.12} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* 暈圈 2 */}
      <mesh ref={halo2Ref}>
        <ringGeometry args={[2.4, 4.5, 64]} />
        <meshBasicMaterial color="#ffe8a0" transparent opacity={0.06} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ============================================================
   雲朵 — 多層靜態體積雲
============================================================ */
function CloudPuff({ position, scale = 1 }) {
  return (
    <group position={position}>
      {[
        [0, 0, 0, 1.0],
        [0.9, -0.2, 0.3, 0.8],
        [-0.8, -0.15, 0.2, 0.75],
        [0.3, 0.3, -0.1, 0.65],
        [-0.4, 0.2, 0.4, 0.6],
        [1.5, 0.1, 0, 0.55],
        [-1.4, 0.05, 0.1, 0.5],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x * scale, y * scale, z * scale]}>
          <sphereGeometry args={[s * scale, 12, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={1}
            metalness={0}
            transparent
            opacity={0.82}
          />
        </mesh>
      ))}
    </group>
  )
}

function Clouds() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.025) * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <CloudPuff position={[-14, 9, -22]} scale={1.6} />
      <CloudPuff position={[8, 10.5, -26]} scale={1.2} />
      <CloudPuff position={[20, 8, -30]} scale={2.0} />
      <CloudPuff position={[-22, 11, -35]} scale={1.4} />
      <CloudPuff position={[2, 12, -40]} scale={1.8} />
    </group>
  )
}

/* ============================================================
   沙灘 — 更細緻的沙質材質與漸層
============================================================ */
function Sand() {
  // 使用頂點色彩模擬沙紋顏色變化
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(90, 90, 80, 80)
    const positions = geo.attributes.position
    const colors = new Float32Array(positions.count * 3)

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i) // y in local plane coords = Z in world

      // 越靠近海（y < 0 = world z < 0）越深色、越濕潤
      const wetness = Math.max(0, Math.min(1, (-y - 5) / 20))
      // 加入細微雜訊
      const noise = (Math.sin(x * 3.7 + y * 2.3) * 0.5 + 0.5) * 0.04

      const r = THREE.MathUtils.lerp(0.972, 0.68, wetness) + noise
      const g = THREE.MathUtils.lerp(0.952, 0.62, wetness) + noise * 0.8
      const b = THREE.MathUtils.lerp(0.878, 0.52, wetness) + noise * 0.6

      colors[i * 3] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        roughness={0.96}
        metalness={0.01}
      />
    </mesh>
  )
}

/* 沙灘細節：小沙丘起伏感 */
function SandDetails() {
  const ripples = useMemo(() => {
    const items = []
    for (let i = 0; i < 18; i++) {
      items.push({
        x: (Math.random() - 0.5) * 14,
        z: (Math.random() * 6 - 1),
        rot: Math.random() * Math.PI,
        scale: 0.3 + Math.random() * 0.9,
        opacity: 0.1 + Math.random() * 0.18
      })
    }
    return items
  }, [])

  return (
    <group position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {ripples.map((r, i) => (
        <mesh key={i} position={[r.x, r.z, 0]} rotation={[0, 0, r.rot]}>
          <ellipseGeometry args={[r.scale * 1.8, r.scale * 0.35, 24]} />
          <meshBasicMaterial color="#e8d8b0" transparent opacity={r.opacity} />
        </mesh>
      ))}
    </group>
  )
}

/* ============================================================
   海洋 — 多層次、帶波紋反光
============================================================ */
function Sea() {
  const ref = useRef()
  const normalRef = useRef(0)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.material.opacity = 0.88 + Math.sin(t * 0.6) * 0.05
    ref.current.position.z = -16 + Math.sin(t * 0.35) * 0.25
    // 模擬水面起伏
    ref.current.rotation.x = -Math.PI / 2 + Math.sin(t * 0.3) * 0.008
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -16]}>
      <planeGeometry args={[90, 32, 4, 4]} />
      <meshStandardMaterial
        color="#4ab8e8"
        transparent
        opacity={0.9}
        roughness={0.08}
        metalness={0.18}
        envMapIntensity={1.2}
      />
    </mesh>
  )
}

/* 海面高光反射層 */
function SeaReflection() {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.material.opacity = 0.12 + Math.sin(t * 1.8 + 1) * 0.06
    ref.current.position.z = -14 + Math.sin(t * 0.5) * 0.3
    ref.current.position.x = Math.sin(t * 0.4) * 0.8
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[2, 0.055, -14]}>
      <planeGeometry args={[18, 8, 1, 1]} />
      <meshBasicMaterial color="#e8f8ff" transparent opacity={0.15} />
    </mesh>
  )
}

/* 波浪層 */
function WaveLayer({ offset, speed, opacity, color, z }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.z = z + Math.sin(t * speed + offset) * 0.22
    ref.current.material.opacity = opacity * (0.85 + Math.sin(t * speed * 1.3 + offset) * 0.15)
    // 輕微縮放模擬浪高
    ref.current.scale.x = 1 + Math.sin(t * speed * 0.7 + offset) * 0.03
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, z]}>
      <planeGeometry args={[90, 3.5, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}

/* 海浪泡沫 — 更自然的多層泡沫 */
function ShoreFoam() {
  const foam1Ref = useRef()
  const foam2Ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (foam1Ref.current) {
      foam1Ref.current.position.z = -9.0 + Math.sin(t * 1.5) * 0.28
      foam1Ref.current.material.opacity = 0.55 + Math.sin(t * 1.7) * 0.12
      foam1Ref.current.scale.x = 1 + Math.sin(t * 0.9) * 0.04
    }

    if (foam2Ref.current) {
      foam2Ref.current.position.z = -8.2 + Math.sin(t * 1.2 + 1.5) * 0.18
      foam2Ref.current.material.opacity = 0.3 + Math.sin(t * 2.0 + 0.8) * 0.1
      foam2Ref.current.scale.x = 1 + Math.sin(t * 1.1 + 0.5) * 0.05
    }
  })

  return (
    <>
      {/* 主泡沫帶 */}
      <mesh ref={foam1Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, -9.0]}>
        <planeGeometry args={[90, 4.5]} />
        <meshBasicMaterial color="#f0faff" transparent opacity={0.55} />
      </mesh>
      {/* 次泡沫帶（退潮尾跡） */}
      <mesh ref={foam2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -8.2]}>
        <planeGeometry args={[90, 2.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </>
  )
}

/* 腳印 */
function Footsteps() {
  return (
    <group position={[0, 0.012, 4.2]} rotation={[-Math.PI / 2, 0, 0]}>
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0, i * 0.65]}>
          <ellipseGeometry args={[0.12, 0.18, 20]} />
          <meshBasicMaterial color="#c8b08a" transparent opacity={0.5} />
        </mesh>
      ))}
      {[-0.38, 0.38].map((x, i) => (
        <mesh key={`b${i}`} position={[x, -0.65, 0.85 + i * 0.68]}>
          <ellipseGeometry args={[0.12, 0.18, 20]} />
          <meshBasicMaterial color="#c8b08a" transparent opacity={0.5} />
        </mesh>
      ))}
      {/* 腳趾印 */}
      {[[-0.52, 0.14], [-0.42, 0.18], [-0.35, 0.16], [-0.28, 0.12]].map(([x, z], i) => (
        <mesh key={`t${i}`} position={[x, z, 0]}>
          <circleGeometry args={[0.04, 10]} />
          <meshBasicMaterial color="#c0a880" transparent opacity={0.38} />
        </mesh>
      ))}
      {[[0.28, 0.14], [0.38, 0.18], [0.46, 0.16], [0.53, 0.12]].map(([x, z], i) => (
        <mesh key={`tr${i}`} position={[x, z, 0]}>
          <circleGeometry args={[0.04, 10]} />
          <meshBasicMaterial color="#c0a880" transparent opacity={0.38} />
        </mesh>
      ))}
    </group>
  )
}

/* 貝殼裝飾 */
function SeashellDecor() {
  const shells = useMemo(() => [
    { x: 2.4, z: 2.1, rot: 0.3, scale: 1.0, color: '#f8e8d0' },
    { x: -1.8, z: 3.5, rot: -0.8, scale: 0.75, color: '#ffd4b8' },
    { x: 3.8, z: 1.2, rot: 1.2, scale: 0.9, color: '#f5dfc8' },
    { x: -3.2, z: 2.8, rot: 0.5, scale: 0.65, color: '#ffe0c8' },
    { x: 0.6, z: 4.8, rot: -0.2, scale: 0.8, color: '#faebd5' },
  ], [])

  return (
    <group position={[0, 0.01, 0]}>
      {shells.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]} rotation={[-Math.PI / 2, s.rot, 0]} scale={[s.scale, s.scale, s.scale * 0.4]}>
          {/* 貝殼主體（扁橢圓） */}
          <mesh>
            <sphereGeometry args={[0.11, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={s.color} roughness={0.6} metalness={0.04} side={THREE.DoubleSide} />
          </mesh>
          {/* 貝殼紋路 */}
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

/* ============================================================
   互動物件容器
============================================================ */
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
      haloRef.current.material.opacity = active || hovered ? 0.48 : 0.2
      haloRef.current.rotation.z += 0.008
      haloRef.current.scale.setScalar(active || hovered ? 1.18 : 1)
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
    <group ref={ref} position={item.position} {...events}>
      <Float speed={active ? 2.3 : 1.4} rotationIntensity={0.25} floatIntensity={0.3}>
        {item.key === 'guide' && <EyesGuide active={active || hovered} color={item.accent} />}
        {item.key === 'map' && <FriendlyFish active={active || hovered} color={item.accent} />}
        {item.key === 'ar' && <NewtonCradle active={active || hovered} color={item.accent} />}
      </Float>

      {/* 光圈 */}
      <mesh ref={haloRef} position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.88, 1.32, 56]} />
        <meshBasicMaterial color={item.accent} transparent opacity={0.22} />
      </mesh>
      {/* 內光圈 */}
      <mesh position={[0, -0.74, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.88, 56]} />
        <meshBasicMaterial color={item.accent} transparent opacity={0.06} />
      </mesh>

      <Billboard position={[0, 2.38, 0]} follow>
        <Text fontSize={0.27} color="#183b56" anchorX="center" anchorY="middle" maxWidth={3.2}
          outlineWidth={0.008} outlineColor="#ffffff">
          {item.title}
        </Text>
      </Billboard>

      {(hovered || active) && (
        <Html position={[0, 2.95, 0]} center distanceFactor={10}>
          <div className="floating-tooltip">{item.hoverText}</div>
        </Html>
      )}
    </group>
  )
}

/* ============================================================
   1. EyesGuide — 精緻的一雙眼睛
   改進：虹膜分層、睫毛、更豐富的眼部結構
============================================================ */
function EyesGuide({ active, color }) {
  const groupRef = useRef()
  const leftPupilRef = useRef()
  const rightPupilRef = useRef()
  const leftIrisRef = useRef()
  const rightIrisRef = useRef()
  const blinkRef = useRef()
  const glowRef = useRef()
  const lidTopLeftRef = useRef()
  const lidTopRightRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.position.y = 1.1 + Math.sin(t * 1.6) * 0.045
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.18
    }

    // 眼球追蹤運動
    const lookX = Math.sin(t * 1.3) * 0.048
    const lookY = Math.cos(t * 1.05) * 0.026

    if (leftPupilRef.current) {
      leftPupilRef.current.position.x = -0.285 + lookX
      leftPupilRef.current.position.y = lookY
      leftPupilRef.current.position.z = 0.245
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.position.x = 0.285 + lookX
      rightPupilRef.current.position.y = lookY
      rightPupilRef.current.position.z = 0.245
    }
    if (leftIrisRef.current) {
      leftIrisRef.current.position.x = -0.285 + lookX * 0.7
      leftIrisRef.current.position.y = lookY * 0.7
      leftIrisRef.current.position.z = 0.228
    }
    if (rightIrisRef.current) {
      rightIrisRef.current.position.x = 0.285 + lookX * 0.7
      rightIrisRef.current.position.y = lookY * 0.7
      rightIrisRef.current.position.z = 0.228
    }

    // 眨眼動畫
    if (blinkRef.current) {
      const blinkCycle = Math.sin(t * 2.2)
      const isBlinking = active ? false : blinkCycle > 0.93
      blinkRef.current.scale.y = isBlinking ? 0.08 : 1
    }

    // 眼瞼跟隨
    if (lidTopLeftRef.current) {
      lidTopLeftRef.current.position.y = 1.1 + 0.17 + Math.sin(t * 1.6) * 0.045
    }
    if (lidTopRightRef.current) {
      lidTopRightRef.current.position.y = 1.1 + 0.17 + Math.sin(t * 1.6) * 0.045
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = active ? 0.4 + Math.sin(t * 3) * 0.07 : 0.18
      glowRef.current.scale.setScalar(active ? 1.1 + Math.sin(t * 2.4) * 0.04 : 1)
    }
  })

  return (
    <group>
      <RoundBase color={color} accent="#eefaff" />

      {/* 底部發光盤 */}
      <mesh ref={glowRef} position={[0, 1.1, -0.04]}>
        <cylinderGeometry args={[0.9, 0.9, 0.03, 56]} />
        <meshBasicMaterial color="#c8f0ff" transparent opacity={0.2} />
      </mesh>

      <group ref={groupRef}>
        <group ref={blinkRef} position={[0, 1.1, 0]}>

          {/* === 左眼 === */}
          {/* 眼白 */}
          <mesh position={[-0.285, 0, 0]} castShadow>
            <sphereGeometry args={[0.285, 36, 36]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.22} metalness={0.01} />
          </mesh>
          {/* 虹膜（彩色環） */}
          <mesh ref={leftIrisRef} position={[-0.285, 0, 0.228]}>
            <cylinderGeometry args={[0.138, 0.138, 0.02, 36]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial
              color={active ? '#3a9fd8' : '#2a7fba'}
              emissive={active ? '#5bbff8' : '#1060a0'}
              emissiveIntensity={active ? 0.5 : 0.1}
              roughness={0.3}
              metalness={0.05}
            />
          </mesh>
          {/* 虹膜紋路環 */}
          {[0.08, 0.1, 0.12, 0.125].map((r, i) => (
            <mesh key={i} position={[-0.285, 0, 0.232]} rotation={[0, 0, i * 0.8]}>
              <torusGeometry args={[r, 0.003, 6, 24, Math.PI * (0.4 + i * 0.15)]} />
              <meshBasicMaterial color={active ? '#88d4ff' : '#5aaacf'} transparent opacity={0.35} />
            </mesh>
          ))}
          {/* 瞳孔 */}
          <mesh ref={leftPupilRef} position={[-0.285, 0, 0.245]}>
            <sphereGeometry args={[active ? 0.072 : 0.058, 20, 20]} />
            <meshStandardMaterial
              color="#0d1e2e"
              emissive={active ? '#1a3a56' : '#000000'}
              emissiveIntensity={active ? 0.5 : 0.08}
              roughness={0.15}
            />
          </mesh>
          {/* 眼睛高光（大） */}
          <mesh position={[-0.308, 0.10, 0.258]}>
            <sphereGeometry args={[0.038, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* 眼睛高光（小） */}
          <mesh position={[-0.255, 0.06, 0.262]}>
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshBasicMaterial color="#e8f8ff" transparent opacity={0.8} />
          </mesh>

          {/* === 右眼 === */}
          <mesh position={[0.285, 0, 0]} castShadow>
            <sphereGeometry args={[0.285, 36, 36]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.22} metalness={0.01} />
          </mesh>
          <mesh ref={rightIrisRef} position={[0.285, 0, 0.228]}>
            <cylinderGeometry args={[0.138, 0.138, 0.02, 36]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial
              color={active ? '#3a9fd8' : '#2a7fba'}
              emissive={active ? '#5bbff8' : '#1060a0'}
              emissiveIntensity={active ? 0.5 : 0.1}
              roughness={0.3}
              metalness={0.05}
            />
          </mesh>
          {[0.08, 0.1, 0.12, 0.125].map((r, i) => (
            <mesh key={i} position={[0.285, 0, 0.232]} rotation={[0, 0, i * 0.8]}>
              <torusGeometry args={[r, 0.003, 6, 24, Math.PI * (0.4 + i * 0.15)]} />
              <meshBasicMaterial color={active ? '#88d4ff' : '#5aaacf'} transparent opacity={0.35} />
            </mesh>
          ))}
          <mesh ref={rightPupilRef} position={[0.285, 0, 0.245]}>
            <sphereGeometry args={[active ? 0.072 : 0.058, 20, 20]} />
            <meshStandardMaterial
              color="#0d1e2e"
              emissive={active ? '#1a3a56' : '#000000'}
              emissiveIntensity={active ? 0.5 : 0.08}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0.308, 0.10, 0.258]}>
            <sphereGeometry args={[0.038, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.255, 0.06, 0.262]}>
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshBasicMaterial color="#e8f8ff" transparent opacity={0.8} />
          </mesh>

          {/* === 睫毛 === */}
          {/* 左眼睫毛 */}
          {[-0.16, -0.08, 0, 0.08, 0.16, 0.22].map((xOff, i) => (
            <mesh
              key={`ll${i}`}
              position={[-0.285 + xOff * 0.5, 0.26 + Math.abs(xOff) * 0.08, 0.18]}
              rotation={[0, 0, (xOff / 0.22) * 0.35]}
            >
              <cylinderGeometry args={[0.006, 0.003, 0.12 - Math.abs(xOff) * 0.1, 6]} />
              <meshBasicMaterial color="#1a2030" />
            </mesh>
          ))}
          {/* 右眼睫毛 */}
          {[-0.22, -0.16, -0.08, 0, 0.08, 0.16].map((xOff, i) => (
            <mesh
              key={`rl${i}`}
              position={[0.285 + xOff * 0.5, 0.26 + Math.abs(xOff) * 0.08, 0.18]}
              rotation={[0, 0, (xOff / 0.22) * 0.35]}
            >
              <cylinderGeometry args={[0.006, 0.003, 0.12 - Math.abs(xOff) * 0.1, 6]} />
              <meshBasicMaterial color="#1a2030" />
            </mesh>
          ))}
        </group>

        {/* 眉毛 */}
        <mesh position={[-0.285, 1.38, 0.2]} rotation={[0.1, 0, 0.1]}>
          <torusGeometry args={[0.16, 0.016, 8, 20, Math.PI * 0.75]} />
          <meshStandardMaterial color="#3a2a1e" roughness={0.8} />
        </mesh>
        <mesh position={[0.285, 1.38, 0.2]} rotation={[0.1, 0, -0.1]}>
          <torusGeometry args={[0.16, 0.016, 8, 20, Math.PI * 0.75]} />
          <meshStandardMaterial color="#3a2a1e" roughness={0.8} />
        </mesh>

        {/* 眼睛間連接裝飾光環 */}
        <mesh position={[0, 1.1, 0.05]}>
          <torusGeometry args={[0.72, 0.022, 16, 90]} />
          <meshStandardMaterial
            color="#7eceff"
            emissive="#7eceff"
            emissiveIntensity={active ? 0.9 : 0.2}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* 小裝飾光點 */}
      {[[-0.65, 1.45, 0.1], [0.65, 1.40, 0.1], [0, 1.68, -0.1], [-0.3, 1.6, 0.2], [0.32, 1.58, 0.18]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[i < 3 ? 0.042 : 0.028, 12, 12]} />
          <meshStandardMaterial
            color={i === 2 ? '#fff4b8' : i > 2 ? '#c8f0ff' : '#dff8ff'}
            emissive={i === 2 ? '#fff4b8' : '#dff8ff'}
            emissiveIntensity={active ? 1.2 : 0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ============================================================
   2. FriendlyFish — 精緻的友善小魚
   改進：魚鱗、更圓潤的魚身、光澤感、鰭動畫改良
============================================================ */
function FriendlyFish({ active, color }) {
  const fishRef = useRef()
  const tailRef = useRef()
  const finTopRef = useRef()
  const finBotRef = useRef()
  const pectoral1Ref = useRef()
  const pectoral2Ref = useRef()
  const bubbleRef = useRef()

  // 魚尾造型（更飽滿的新月形）
  const tailShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0.04, 0)
    shape.bezierCurveTo(0.0, 0.18, -0.3, 0.38, -0.5, 0.38)
    shape.bezierCurveTo(-0.58, 0.38, -0.58, 0.28, -0.5, 0.2)
    shape.bezierCurveTo(-0.38, 0.1, -0.24, 0.05, -0.18, 0)
    shape.bezierCurveTo(-0.24, -0.05, -0.38, -0.1, -0.5, -0.2)
    shape.bezierCurveTo(-0.58, -0.28, -0.58, -0.38, -0.5, -0.38)
    shape.bezierCurveTo(-0.3, -0.38, 0.0, -0.18, 0.04, 0)
    shape.closePath()
    return shape
  }, [])

  const tailExtrude = useMemo(() => ({
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.018,
    bevelThickness: 0.018
  }), [])

  // 背鰭造型（三角形帆狀）
  const finShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.1, 0.12, 0.22, 0.25, 0.2, 0.36)
    shape.bezierCurveTo(0.15, 0.42, 0.08, 0.38, 0, 0.35)
    shape.bezierCurveTo(-0.06, 0.28, -0.08, 0.16, -0.05, 0.08)
    shape.lineTo(0, 0)
    shape.closePath()
    return shape
  }, [])

  const finExtrude = useMemo(() => ({
    depth: 0.03,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.01,
    bevelThickness: 0.01
  }), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (fishRef.current) {
      fishRef.current.position.y = 1.08 + Math.sin(t * 1.5) * 0.065
      // S形游泳曲線
      fishRef.current.rotation.y = Math.sin(t * 0.7) * 0.24
      fishRef.current.rotation.z = Math.sin(t * 1.4) * 0.035
      fishRef.current.rotation.x = Math.sin(t * 0.5 + 0.8) * 0.025
    }

    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * (active ? 6.5 : 3.5)) * 0.44
    }

    if (finTopRef.current) {
      finTopRef.current.rotation.z = -0.3 + Math.sin(t * 3.2) * 0.14
    }
    if (finBotRef.current) {
      finBotRef.current.rotation.z = Math.PI + 0.3 + Math.sin(t * 2.8 + 1) * 0.12
    }

    // 胸鰭
    if (pectoral1Ref.current) {
      pectoral1Ref.current.rotation.y = -0.4 + Math.sin(t * 2.5) * 0.2
    }
    if (pectoral2Ref.current) {
      pectoral2Ref.current.rotation.y = 0.4 + Math.sin(t * 2.5 + Math.PI) * 0.2
    }

    // 氣泡
    if (bubbleRef.current) {
      bubbleRef.current.children.forEach((child, index) => {
        child.position.y = 0.72 + index * 0.26 + Math.sin(t * 1.6 + index * 1.2) * 0.07
        child.position.x = 0.62 + index * 0.1 + Math.sin(t * 0.8 + index) * 0.04
        child.material.opacity = active ? 0.55 + Math.sin(t * 1.2 + index) * 0.12 : 0.25
      })
    }
  })

  return (
    <group>
      <RoundBase color={color} accent="#e4fff8" />

      <group ref={fishRef} position={[0, 1.08, 0]}>

        {/* 魚身主體（更圓潤的橢球） */}
        <mesh castShadow scale={[1.18, 0.65, 0.52]}>
          <sphereGeometry args={[0.42, 40, 32]} />
          <meshStandardMaterial
            color="#38d4c0"
            emissive={active ? '#50e8d5' : '#189898'}
            emissiveIntensity={active ? 0.55 : 0.15}
            roughness={0.32}
            metalness={0.05}
          />
        </mesh>

        {/* 腹部（淡色） */}
        <mesh scale={[1.0, 0.42, 0.46]} position={[0.05, -0.15, 0.04]}>
          <sphereGeometry args={[0.4, 36, 28]} />
          <meshStandardMaterial
            color="#c8f5ee"
            roughness={0.5}
            metalness={0.01}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* 魚鱗紋路（橫條紋環） */}
        {[-0.1, 0.08, 0.25, 0.38].map((xPos, i) => (
          <mesh key={i} position={[xPos, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.22 - i * 0.025, 0.008, 8, 28, Math.PI * 1.5]} />
            <meshBasicMaterial
              color={active ? '#8af0e8' : '#5ac8bc'}
              transparent
              opacity={0.28}
            />
          </mesh>
        ))}

        {/* 魚尾 */}
        <group ref={tailRef} position={[-0.52, 0, -0.02]}>
          <mesh castShadow>
            <extrudeGeometry args={[tailShape, tailExtrude]} />
            <meshStandardMaterial
              color="#ffc864"
              emissive={active ? '#ffd880' : '#e09830'}
              emissiveIntensity={active ? 0.5 : 0.12}
              roughness={0.38}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* 背鰭 */}
        <group ref={finTopRef} position={[0.08, 0.38, 0.04]} rotation={[0, 0, -0.35]}>
          <mesh castShadow>
            <extrudeGeometry args={[finShape, finExtrude]} />
            <meshStandardMaterial
              color="#ffe09a"
              roughness={0.45}
              transparent
              opacity={0.88}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* 腹鰭 */}
        <group ref={finBotRef} position={[0.05, -0.38, 0.04]} rotation={[0, 0, Math.PI + 0.3]}>
          <mesh castShadow>
            <extrudeGeometry args={[finShape, { ...finExtrude, depth: 0.025 }]} />
            <meshStandardMaterial
              color="#ffe09a"
              roughness={0.45}
              transparent
              opacity={0.75}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* 胸鰭（左右） */}
        <group ref={pectoral1Ref} position={[0.1, -0.08, 0.36]}>
          <mesh rotation={[0.4, 0, 0.3]}>
            <coneGeometry args={[0.09, 0.22, 4]} />
            <meshStandardMaterial color="#ffd888" roughness={0.5} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
        <group ref={pectoral2Ref} position={[0.1, -0.08, -0.36]}>
          <mesh rotation={[-0.4, 0, 0.3]}>
            <coneGeometry args={[0.09, 0.22, 4]} />
            <meshStandardMaterial color="#ffd888" roughness={0.5} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* 眼睛（白） */}
        <mesh position={[0.36, 0.1, 0.36]} castShadow>
          <sphereGeometry args={[0.062, 18, 18]} />
          <meshStandardMaterial color="#ffffff" roughness={0.18} />
        </mesh>
        {/* 眼睛（瞳孔） */}
        <mesh position={[0.395, 0.1, 0.4]}>
          <sphereGeometry args={[0.028, 14, 14]} />
          <meshStandardMaterial color="#0f2535" roughness={0.2} />
        </mesh>
        {/* 眼睛高光 */}
        <mesh position={[0.408, 0.118, 0.41]}>
          <sphereGeometry args={[0.01, 10, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* 嘴巴（弧形） */}
        <mesh position={[0.5, -0.05, 0.3]} rotation={[0, 0, -0.2]}>
          <torusGeometry args={[0.072, 0.013, 8, 22, Math.PI * 0.65]} />
          <meshStandardMaterial color="#0d4d5c" roughness={0.4} />
        </mesh>

        {/* 側線 */}
        <mesh position={[0, 0, 0.42]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.28, 0.006, 6, 40, Math.PI * 1.1]} />
          <meshBasicMaterial color="#20b0a0" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* 氣泡群 */}
      <group ref={bubbleRef}>
        {[0, 1, 2, 3, 4].map((_, i) => (
          <mesh key={i} position={[0.62 + i * 0.1, 0.72 + i * 0.25, 0.22 - i * 0.04]}>
            <sphereGeometry args={[0.038 + i * 0.012, 14, 14]} />
            <meshStandardMaterial
              color="#dffffa"
              transparent
              opacity={0.28}
              roughness={0.1}
              metalness={0.08}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ============================================================
   3. NewtonCradle — 精緻的牛頓擺
   改進：金屬框架、真實懸吊線、碰撞時閃光、底座紋理
============================================================ */
function NewtonCradle({ active, color }) {
  const frameRef = useRef()
  const leftSwingRef = useRef()
  const rightSwingRef = useRef()
  const glowRef = useRef()
  const impactGlowRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (frameRef.current) {
      frameRef.current.position.y = 1.02 + Math.sin(t * 1.25) * 0.035
      frameRef.current.rotation.y = Math.sin(t * 0.55) * 0.16
    }

    const swingCycle = Math.sin(t * (active ? 2.8 : 2.4))
    const power = active ? 0.52 : 0.28

    if (leftSwingRef.current) {
      leftSwingRef.current.rotation.z = swingCycle > 0 ? swingCycle * power : 0
    }
    if (rightSwingRef.current) {
      rightSwingRef.current.rotation.z = swingCycle < 0 ? swingCycle * power : 0
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = active ? 0.35 + Math.sin(t * 2.6) * 0.06 : 0.16
      glowRef.current.scale.setScalar(active ? 1.08 + Math.sin(t * 2.2) * 0.04 : 1)
    }

    // 碰撞閃光：擺球接觸瞬間
    if (impactGlowRef.current) {
      const nearImpact = Math.abs(swingCycle) < 0.15
      impactGlowRef.current.material.opacity = active && nearImpact
        ? 0.6 + Math.sin(t * 12) * 0.3
        : 0
    }
  })

  // 單顆球組件（含懸吊線）
  const PendulumBall = ({ x, ballColor = '#e8ecf8', wireColor = '#a0aac0', emit = false }) => (
    <group position={[x, 0, 0]}>
      {/* 前懸吊線 */}
      <mesh position={[0, -0.25, 0.055]}>
        <cylinderGeometry args={[0.007, 0.007, 0.55, 6]} />
        <meshStandardMaterial color={wireColor} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* 後懸吊線 */}
      <mesh position={[0, -0.25, -0.055]}>
        <cylinderGeometry args={[0.007, 0.007, 0.55, 6]} />
        <meshStandardMaterial color={wireColor} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* 球體 */}
      <mesh position={[0, -0.62, 0]} castShadow>
        <sphereGeometry args={[0.135, 28, 28]} />
        <meshStandardMaterial
          color={ballColor}
          metalness={0.55}
          roughness={0.16}
          emissive={emit && active ? '#c8d8f8' : '#000000'}
          emissiveIntensity={emit && active ? 0.3 : 0}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* 球體頂部連接環 */}
      <mesh position={[0, -0.48, 0]}>
        <torusGeometry args={[0.05, 0.012, 10, 20]} />
        <meshStandardMaterial color="#8898b8" metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  )

  return (
    <group>
      <RoundBase color={color} accent="#f0ecff" />

      {/* 底部光盤 */}
      <mesh ref={glowRef} position={[0, 1.05, -0.06]}>
        <cylinderGeometry args={[0.84, 0.84, 0.03, 56]} />
        <meshBasicMaterial color="#e0d4ff" transparent opacity={0.18} />
      </mesh>

      {/* 碰撞閃光（球中心） */}
      <mesh ref={impactGlowRef} position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} />
      </mesh>

      <group ref={frameRef} position={[0, 1.02, 0]}>

        {/* 頂部橫梁 */}
        <mesh position={[0, 0.44, 0]} castShadow>
          <boxGeometry args={[1.4, 0.07, 0.065]} />
          <meshStandardMaterial color="#ccd4e8" metalness={0.35} roughness={0.28} />
        </mesh>

        {/* 左立柱（前） */}
        <mesh position={[-0.72, -0.1, 0.065]} castShadow>
          <boxGeometry args={[0.065, 1.1, 0.065]} />
          <meshStandardMaterial color="#c8d0e4" metalness={0.32} roughness={0.3} />
        </mesh>
        {/* 左立柱（後） */}
        <mesh position={[-0.72, -0.1, -0.065]}>
          <boxGeometry args={[0.065, 1.1, 0.065]} />
          <meshStandardMaterial color="#c8d0e4" metalness={0.32} roughness={0.3} />
        </mesh>

        {/* 右立柱（前） */}
        <mesh position={[0.72, -0.1, 0.065]} castShadow>
          <boxGeometry args={[0.065, 1.1, 0.065]} />
          <meshStandardMaterial color="#c8d0e4" metalness={0.32} roughness={0.3} />
        </mesh>
        {/* 右立柱（後） */}
        <mesh position={[0.72, -0.1, -0.065]}>
          <boxGeometry args={[0.065, 1.1, 0.065]} />
          <meshStandardMaterial color="#c8d0e4" metalness={0.32} roughness={0.3} />
        </mesh>

        {/* 底座 */}
        <mesh position={[0, -0.72, 0]} castShadow>
          <boxGeometry args={[1.62, 0.07, 0.22]} />
          <meshStandardMaterial color="#eceafc" roughness={0.38} metalness={0.08} />
        </mesh>
        {/* 底座裝飾線 */}
        <mesh position={[0, -0.685, 0.1]}>
          <boxGeometry args={[1.56, 0.012, 0.012]} />
          <meshBasicMaterial color="#b8b4e8" transparent opacity={0.5} />
        </mesh>

        {/* 頂部橫梁連接角（四個角落） */}
        {[[-0.72, 0.44, 0.065], [-0.72, 0.44, -0.065], [0.72, 0.44, 0.065], [0.72, 0.44, -0.065]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#b0bcd4" metalness={0.5} roughness={0.2} />
          </mesh>
        ))}

        {/* 擺球群 */}
        <group ref={leftSwingRef} position={[-0.46, 0.4, 0]}>
          <PendulumBall x={0} ballColor="#c0e4ff" wireColor="#98b0cc" emit />
        </group>

        <group position={[-0.23, 0.4, 0]}>
          <PendulumBall x={0} ballColor="#e8ecf8" />
        </group>

        <group position={[0, 0.4, 0]}>
          <PendulumBall x={0} ballColor="#eeeef8" />
        </group>

        <group position={[0.23, 0.4, 0]}>
          <PendulumBall x={0} ballColor="#e8ecf8" />
        </group>

        <group ref={rightSwingRef} position={[0.46, 0.4, 0]}>
          <PendulumBall x={0} ballColor="#ddd0ff" wireColor="#a898cc" emit />
        </group>

        {/* 裝飾光環（在球後方） */}
        <mesh position={[0, -0.02, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.016, 16, 90]} />
          <meshStandardMaterial
            color="#b8a4f8"
            emissive="#b8a4f8"
            emissiveIntensity={active ? 0.85 : 0.18}
          />
        </mesh>

        {/* 球底水平光圈 */}
        <mesh position={[0, -0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.62, 0.82, 48]} />
          <meshBasicMaterial
            color="#c8b8ff"
            transparent
            opacity={active ? 0.22 : 0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

/* ============================================================
   共用基座 — 精緻版
============================================================ */
function RoundBase({ color, accent }) {
  return (
    <group>
      {/* 主底座 */}
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.94, 0.16, 52]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.04} />
      </mesh>

      {/* 上層平台 */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.68, 0.78, 0.05, 52]} />
        <meshStandardMaterial color={accent} roughness={0.82} metalness={0.01} />
      </mesh>

      {/* 頂面倒角環 */}
      <mesh position={[0, 0.175, 0]}>
        <torusGeometry args={[0.68, 0.015, 12, 60]} />
        <meshStandardMaterial color={color} metalness={0.12} roughness={0.5} />
      </mesh>

      {/* 沙地陰影紋路裝飾 */}
      <mesh position={[0, 0.162, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.52, 28, 1, 0.45, Math.PI * 0.7]} />
        <meshStandardMaterial color="#b8e4ff" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* 小鵝卵石裝飾 */}
      {[[-0.38, 0.17, 0.12, 0.2], [0.36, 0.17, 0.18, -0.15], [-0.18, 0.17, 0.48, 0.1]].map(([x, y, z, rx], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[-Math.PI / 2, rx, 0]}>
          <circleGeometry args={[0.055 + i * 0.008, 16]} />
          <meshBasicMaterial color={i === 2 ? '#c8d8c0' : '#d8c8a8'} transparent opacity={0.48} />
        </mesh>
      ))}
    </group>
  )
}
