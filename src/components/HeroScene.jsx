import React, { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
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
    title: '關於我們',
    subtitle: '3D 眼睛導覽',
    // 桌機/平板：水平排在畫面垂直高度約 1/2；手機：垂直排列
    desktopPosition: [-2.85, 0.22, -3.35],
    tabletPosition: [-2.05, 0.2, -3.4],
    mobilePosition: [0, 1.78, -3.05],
    desktopScale: 0.92,
    tabletScale: 0.76,
    mobileScale: 0.46,
    shortLabel: '看懂網站入口',
    accent: '#8fd3ff',
    // 手機版專用色暈：眼睛本體偏天空藍，色暈改用對比的柔橘金；平板 / 電腦版不受影響
    mobileHalo: { core: '#ffb15c', glow: '#ff7a3d', rim: '#fff3dc' },
    route: '/guide',
    hoverText: '用一雙明亮的眼睛帶你快速看見網站功能、入口與探索方向。'
  },
  {
    key: 'map',
    title: '附近的友善海鮮地圖',
    subtitle: '3D 友善小魚',
    desktopPosition: [0, 0.22, -3.6],
    tabletPosition: [0, 0.2, -3.6],
    mobilePosition: [0, 0.82, -3.12],
    desktopScale: 0.98,
    tabletScale: 0.78,
    mobileScale: 0.47,
    shortLabel: '找附近友善海鮮',
    accent: '#7ee7d4',
    // 手機版專用色暈：小魚本體偏薄荷綠，色暈改用對比的珊瑚粉橘；柔和不搶主體
    mobileHalo: { core: '#ff8f86', glow: '#ff5f73', rim: '#fff0ec' },
    route: '/map',
    hoverText: '跟著小魚游向附近友善海鮮據點，探索推薦路線與在地永續資訊。'
  },
  {
    key: 'ar',
    title: 'AR 互動與永續標籤',
    subtitle: '3D 牛頓擺球組',
    desktopPosition: [2.85, 0.22, -3.35],
    tabletPosition: [2.05, 0.2, -3.4],
    mobilePosition: [0, -0.12, -3.02],
    desktopScale: 0.92,
    tabletScale: 0.76,
    mobileScale: 0.46,
    shortLabel: '理解永續標籤',
    accent: '#d4b3ff',
    // 手機版專用色暈：牛頓擺球組本體偏柔紫，色暈改用對比的暖黃金；保留科技感但不刺眼
    mobileHalo: { core: '#ffe06a', glow: '#ffb72f', rim: '#fff8d6' },
    route: '/sustainability',
    hoverText: '透過像牛頓擺一樣有節奏的互動，理解海鮮來源、標籤與永續價值。'
  }
]

export default function HeroScene() {
  const [activeKey, setActiveKey] = useState('guide')
  const activeItem = MENU_ITEMS.find(item => item.key === activeKey) || MENU_ITEMS[0]

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

      <div className="hero-overlay">
        <div className="hero-copy glass-card">
          <div className="eyebrow">IMMERSIVE BEACH EXPERIENCE</div>
          <h1>從白色沙灘出發，探索友善海鮮、關於我們與 AR 永續標籤</h1>
          <p>
            進入首頁即可看見三個中央 3D 入口：眼睛代表關於我們，小魚代表附近友善海鮮地圖，
            牛頓擺球組代表 AR 互動與永續標籤。
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

      {/* 優化：更晴朗的天空 */}
      <Sky
        sunPosition={[8, 6, -10]}
        turbidity={0.8}    // 降低混濁度，天空更乾淨
        rayleigh={0.5}     // 降低散射，顏色更偏深藍
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
      <SeashellDecor />

      <ResponsiveMenuObjects activeKey={activeKey} setActiveKey={setActiveKey} />
    </>
  )
}
function ResponsiveMenuObjects({ activeKey, setActiveKey }) {
  const { size } = useThree()

  const getLayout = (item) => {
    const isMobile = size.width <= 600

    if (isMobile) {
      return {
        position: item.mobilePosition,
        scale: item.mobileScale,
        // 手機版：眼睛與小魚不顯示基座；牛頓擺球組保留基座
        showBase: item.key === 'ar',
        // 手機版：光圈改成直立 O 型，第一次進入畫面就像把 3D 模型圈起來
        haloVertical: true
      }
    }
    if (size.width <= 1024) {
      return { position: item.tabletPosition, scale: item.tabletScale, showBase: true, haloVertical: false }
    }
    return { position: item.desktopPosition, scale: item.desktopScale, showBase: true, haloVertical: false }
  }

  return (
    <>
      {/* 中央三入口：桌機/平板/手機都固定在視覺中央附近，並用 scale 避免小螢幕互相重疊 */}
      {MENU_ITEMS.map(item => {
        const layout = getLayout(item)
        return (
          <InteractiveMenuObject
            key={item.key}
            item={{
              ...item,
              position: layout.position,
              objectScale: layout.scale,
              showBase: layout.showBase,
              haloVertical: layout.haloVertical,
              mobileHalo: item.mobileHalo
            }}
            active={item.key === activeKey}
            setActiveKey={setActiveKey}
          />
        )
      })}
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
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(90, 90, 80, 80)
    const positions = geo.attributes.position
    const colors = new Float32Array(positions.count * 3)

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)

      const wetness = Math.max(0, Math.min(1, (-y - 5) / 20))
      const noise = (Math.sin(x * 4.0 + y * 3.0) * 0.5 + 0.5) * 0.03

      // 改為偏向純白的貝殼沙色系
      const r = THREE.MathUtils.lerp(0.98, 0.82, wetness) + noise
      const g = THREE.MathUtils.lerp(0.96, 0.80, wetness) + noise
      const b = THREE.MathUtils.lerp(0.94, 0.78, wetness) + noise

      colors[i * 3] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0,-0.4, 0]} receiveShadow geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={0.9} metalness={0.0} />
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
    <group position={[0, -0.375, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {ripples.map((r, i) => (
        <mesh key={i} position={[r.x, r.z, 0]} rotation={[0, 0, r.rot]} scale={[r.scale * 1.8, r.scale * 0.35, 1]}>
          <circleGeometry args={[1, 24]} />
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

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.z = -16 + Math.sin(t * 0.35) * 0.2
    ref.current.rotation.x = -Math.PI / 2 + Math.sin(t * 0.3) * 0.01
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, -16]} receiveShadow>
      <planeGeometry args={[90, 32, 16, 16]} />
      {/* 使用 PhysicalMaterial 打造清澈透水感 */}
      <meshPhysicalMaterial
        color="#00aaff"
        transmission={0.8}
        opacity={1}
        transparent
        roughness={0.05}
        metalness={0.1}
        ior={1.33}
        thickness={2}
        envMapIntensity={1.5}
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
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[2, -0.075, -14]}>
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
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.33, z]}>
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
      <mesh ref={foam1Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.325, -9.0]}>
        <planeGeometry args={[90, 4.5]} />
        <meshBasicMaterial color="#f0faff" transparent opacity={0.55} />
      </mesh>
      {/* 次泡沫帶（退潮尾跡） */}
      <mesh ref={foam2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.325, -8.2]}>
        <planeGeometry args={[90, 2.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </>
  )
}

/* 腳印 */
function Footsteps() {
  return (
    <group position={[0, -0.368, 4.2]} rotation={[-Math.PI / 2, 0, 0]}>
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0, i * 0.65]} scale={[0.12, 0.18, 1]}>
          <circleGeometry args={[1, 20]} />
          <meshBasicMaterial color="#c8b08a" transparent opacity={0.5} />
        </mesh>
      ))}
      {[-0.38, 0.38].map((x, i) => (
        <mesh key={`b${i}`} position={[x, -0.65, 0.85 + i * 0.68]} scale={[0.12, 0.18, 1]}>
          <circleGeometry args={[1, 20]} />
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
    <group position={[0, -0.37, 0]}>
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
   手機版 O 型光暈
   - 只在 item.haloVertical = true 時使用
   - 多層透明 ring 疊出柔和 halo，不影響桌機 / 平板原本水平光圈
============================================================ */
function MobileObjectHalo({ colors, active }) {
  const groupRef = useRef()
  const coreRef = useRef()
  const softRef = useRef()
  const outerRef = useRef()
  const rimRef = useRef()

  const haloColors = colors || { core: '#8fd3ff', glow: '#4fc3ff', rim: '#ffffff' }

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // 很輕微的呼吸感即可，避免色暈搶走 3D 模型本體注意力
    const pulse = 1 + Math.sin(t * 1.05) * 0.018

    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0025
      groupRef.current.scale.setScalar((active ? 1.045 : 1) * pulse)
    }

    if (coreRef.current) coreRef.current.material.opacity = active ? 0.24 : 0.18
    if (softRef.current) softRef.current.material.opacity = active ? 0.105 : 0.075
    if (outerRef.current) outerRef.current.material.opacity = active ? 0.06 : 0.042
    if (rimRef.current) rimRef.current.material.opacity = active ? 0.16 : 0.105
  })

  return (
    <group
      ref={groupRef}
      // 手機版專用：放在模型後方，並略低於標題文字，避免遮擋模型與說明文字
      position={[0, 0.74, -0.32]}
      scale={[0.82, 0.98, 1]}
      rotation={[0, 0, 0]}
    >
      {/* 外層色暈：範圍保守、透明度低，只形成柔和 O 型氛圍 */}
      <mesh ref={outerRef} renderOrder={0}>
        <ringGeometry args={[0.72, 1.26, 96]} />
        <meshBasicMaterial
          color={haloColors.glow}
          transparent
          opacity={0.052}
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 中層色暈：讓三個模型各自有不同色系，但不會蓋住 3D 模型 */}
      <mesh ref={softRef} position={[0, 0, 0.01]} renderOrder={1}>
        <ringGeometry args={[0.58, 1.16, 96]} />
        <meshBasicMaterial
          color={haloColors.core}
          transparent
          opacity={0.09}
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 核心 O 型色圈：細、淡、清楚，但不喧賓奪主 */}
      <mesh ref={coreRef} position={[0, 0, 0.02]} renderOrder={2}>
        <ringGeometry args={[0.89, 0.99, 128]} />
        <meshBasicMaterial
          color={haloColors.core}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 內側高光：用極淡亮邊增加質感，避免看起來像粗色框 */}
      <mesh ref={rimRef} position={[0, 0, 0.03]} renderOrder={3}>
        <ringGeometry args={[0.99, 1.035, 128]} />
        <meshBasicMaterial
          color={haloColors.rim}
          transparent
          opacity={0.13}
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight color={haloColors.glow} intensity={active ? 0.32 : 0.2} distance={2.1} decay={2} />
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
    // 增加一點整體的呼吸起伏
    ref.current.position.y = item.position[1] + Math.sin(t * 1.5 + item.position[0]) * 0.06
    if (haloRef.current) {
      haloRef.current.material.opacity = active || hovered ? 0.6 : 0.2
      haloRef.current.rotation.z += 0.01
      haloRef.current.scale.setScalar(active || hovered ? 1.2 : 1)
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
      <Float speed={active ? 2.3 : 1.4} rotationIntensity={0.25} floatIntensity={0.3}>
        {item.key === 'guide' && <EyesGuide active={active || hovered} color={item.accent} showBase={item.showBase} />}
        {item.key === 'map' && <FriendlyFish active={active || hovered} color={item.accent} showBase={item.showBase} />}
        {item.key === 'ar' && <NewtonCradle active={active || hovered} color={item.accent} showBase={item.showBase} />}
      </Float>

      {/* 光圈 / 光暈
          桌機、平板：完全維持原本水平光圈。
          手機版：改成直立 O 型柔光光暈，第一次進入畫面就像 3D 模型外圍被光暈包住。 */}
      {item.haloVertical ? (
        <MobileObjectHalo colors={item.mobileHalo} active={active || hovered} />
      ) : (
        <>
          <mesh
            ref={haloRef}
            position={[0, -0.75, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.88, 1.32, 56]} />
            <meshBasicMaterial color={item.accent} transparent opacity={0.22} side={THREE.DoubleSide} />
          </mesh>
          {/* 內光圈 */}
          <mesh
            position={[0, -0.74, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.5, 0.88, 56]} />
            <meshBasicMaterial color={item.accent} transparent opacity={0.06} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}

      <Billboard position={[0, 2.05, 0]} follow>
        <Text
          fontSize={0.22}
          color="#183b56"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.6}
          textAlign="center"
          outlineWidth={0.012}
          outlineColor="#ffffff"
        >
          {item.title}
        </Text>
        <Text
          position={[0, -0.32, 0]}
          fontSize={0.13}
          color="#2c6f97"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
          textAlign="center"
          outlineWidth={0.01}
          outlineColor="#ffffff"
        >
          {item.shortLabel}
        </Text>
      </Billboard>

      <Html position={[0, -1.52, 0]} center distanceFactor={10}>
        <div className="floating-tooltip model-description">{item.hoverText}</div>
      </Html>
    </group>
  )
}

/* ============================================================
   1. EyesGuide —— 一雙眼睛，適合「關於我們」
============================================================ */
function EyesGuide({ active, color, showBase = true }) {
  const groupRef = useRef()
  const leftPupil = useRef()
  const rightPupil = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 1.5) * 0.15
      // 加入呼吸縮放
      const scale = active ? 1.05 + Math.sin(t * 4) * 0.02 : 1
      groupRef.current.scale.setScalar(scale)
    }
    const lookX = Math.sin(t * 2) * 0.05
    const lookY = Math.cos(t * 1.5) * 0.03
    if (leftPupil.current) leftPupil.current.position.set(-0.28 + lookX, lookY, 0.24)
    if (rightPupil.current) rightPupil.current.position.set(0.28 + lookX, lookY, 0.24)
  })

  return (
    <group>
      {showBase && <RoundBase color={color} accent="#eefaff" />}
      <group ref={groupRef} position={[0, 1.08, 0]}>
        {/* 眼白 */}
        <mesh position={[-0.28, 0, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0.28, 0, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} />
        </mesh>
        {/* 瞳孔 */}
        <mesh ref={leftPupil} position={[-0.28, 0, 0.24]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#0b1b2b" roughness={0.1} metalness={0.5} />
        </mesh>
        <mesh ref={rightPupil} position={[0.28, 0, 0.24]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#0b1b2b" roughness={0.1} metalness={0.5} />
        </mesh>
        {/* 外框 */}
        <mesh position={[0, 0.0, 0]}>
          <torusGeometry args={[0.65, 0.03, 16, 64]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.5 : 0.5} />
        </mesh>
      </group>
    </group>
  )
}

/* ============================================================
   2. FriendlyFish —— 一條魚，適合「附近的友善海鮮地圖」
============================================================ */
function FriendlyFish({ active, color, showBase = true }) {
  const fishRef = useRef()
  const tailRef = useRef()

  // 簡化的尾巴形狀
  const tailShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0); shape.lineTo(-0.4, 0.3); shape.lineTo(-0.3, 0); shape.lineTo(-0.4, -0.3); shape.closePath()
    return shape
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (fishRef.current) {
      // 魚體 S 型搖擺
      fishRef.current.rotation.y = Math.sin(t * (active ? 4 : 2)) * 0.3
      fishRef.current.position.x = Math.sin(t * (active ? 4 : 2)) * 0.05
    }
    if (tailRef.current) {
      // 尾巴反向搖擺疊加
      tailRef.current.rotation.y = Math.sin(t * (active ? 6 : 3) - 1) * 0.5
    }
  })

  return (
    <group>
      {showBase && <RoundBase color={color} accent="#e9fff9" />}
      <group ref={fishRef} position={[0, 1.1, 0]}>
        {/* 魚身：亮眼橘/黃系熱帶魚 */}
        <mesh castShadow scale={[1.2, 0.7, 0.5]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#FF5722" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* 魚尾 */}
        <group ref={tailRef} position={[-0.45, 0, 0]}>
          <mesh castShadow>
            <extrudeGeometry args={[tailShape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.02 }]} />
            <meshStandardMaterial color="#FFC107" roughness={0.3} />
          </mesh>
        </group>
        {/* 魚眼 */}
        <mesh position={[0.35, 0.1, 0.2]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.38, 0.1, 0.23]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </group>
    </group>
  )
}
/* ============================================================
   3. NewtonCradle —— 牛頓擺球組，適合「AR 互動與永續標籤」
============================================================ */
function NewtonCradle({ active, color, showBase = true }) {
  const frameRef = useRef()
  const leftSwing = useRef()
  const rightSwing = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const swing = Math.sin(t * 3.5)
    const power = active ? 0.6 : 0.3

    // 模擬物理碰撞的急停感
    if (leftSwing.current) leftSwing.current.rotation.z = swing > 0 ? swing * power : 0
    if (rightSwing.current) rightSwing.current.rotation.z = swing < 0 ? swing * power : 0
  })

  const Ball = ({ x }) => (
    <group position={[x, 0, 0]}>
      {/* 釣線/金屬絲 (新增) */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.6, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      {/* 金屬球 (極高反射率) */}
      <mesh position={[0, -0.65, 0]} castShadow>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.95} 
          roughness={0.05} 
          envMapIntensity={2} 
        />
      </mesh>
    </group>
  )

  return (
    <group>
      {showBase && <RoundBase color={color} accent="#f7efff" />}
      <group ref={frameRef} position={[0, 1.2, 0]}>
        {/* 頂部支架 */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[1.4, 0.05, 0.05]} />
          <meshStandardMaterial color="#8892b0" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* 兩側立柱 */}
        <mesh position={[-0.7, -0.4, 0]} castShadow>
          <boxGeometry args={[0.05, 1.0, 0.05]} />
          <meshStandardMaterial color="#8892b0" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.7, -0.4, 0]} castShadow>
          <boxGeometry args={[0.05, 1.0, 0.05]} />
          <meshStandardMaterial color="#8892b0" metalness={0.6} roughness={0.3} />
        </mesh>

        <group ref={leftSwing} position={[-0.42, 0.1, 0]}><Ball x={0} /></group>
        <group position={[-0.14, 0.1, 0]}><Ball x={0} /></group>
        <group position={[0.14, 0.1, 0]}><Ball x={0} /></group>
        <group ref={rightSwing} position={[0.42, 0.1, 0]}><Ball x={0} /></group>
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
