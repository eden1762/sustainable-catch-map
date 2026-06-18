import React, { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Billboard,
  Html,
  OrbitControls,
  Sky,
  Sparkles,
  Stars,
  Text,
  useCursor
} from '@react-three/drei'
import * as THREE from 'three'


function getStoredLanguage() {
  if (typeof window === 'undefined') return 'zh'
  return window.localStorage.getItem('scm-language') === 'en' ? 'en' : 'zh'
}

function tText(lang, zh, en) {
  return lang === 'en' ? en : zh
}

const MENU_ITEMS = [
  {
    key: 'guide',
    title: getStoredLanguage() === 'en' ? 'Our Philosophy' : '我們的理念',
    // 桌機/平板：水平排在畫面垂直高度約 1/2；手機：垂直排列
    desktopPosition: [-2.85, 0.22, -3.35],
    tabletPosition: [-2.05, 0.2, -3.4],
    mobilePosition: [0, 2.32, -3.05],
    desktopScale: 0.92,
    tabletScale: 0.76,
    mobileScale: 0.54,
    shortLabel: getStoredLanguage() === 'en' ? 'See the purpose of sustainability' : '看見永續初衷',
    accent: '#8eddf2',
    // 網站導覽：粉藍色粉圈，降低亮度但清楚標示可點選範圍
    halo: { core: '#9edff5', glow: '#c8f0fb', rim: '#effcff', pressed: '#4fb7d8' },
    mobileHalo: { core: '#9edff5', glow: '#c8f0fb', rim: '#effcff', pressed: '#4fb7d8' },
    route: '/pages/about.html',
    hoverText: '了解我們的理念：以 AI、資料地圖與互動教育，讓每一次海鮮選擇更透明、更友善海洋。'
  },
  {
    key: 'map',
    title: getStoredLanguage() === 'en' ? 'Nearby Friendly Seafood Restaurants' : '附近的友善海鮮地圖',
    desktopPosition: [0, 0.22, -3.6],
    tabletPosition: [0, 0.2, -3.6],
    mobilePosition: [0, 0.62, -3.12],
    desktopScale: 0.98,
    tabletScale: 0.78,
    mobileScale: 0.56,
    shortLabel: getStoredLanguage() === 'en' ? 'Find nearby friendly seafood' : '找附近友善海鮮',
    accent: '#f2ad78',
    // 友善小魚：粉橘色粉圈，和粉藍、粉紅入口明顯區分
    halo: { core: '#ffc99f', glow: '#ffe0c2', rim: '#fff5ea', pressed: '#f28b45' },
    mobileHalo: { core: '#ffc99f', glow: '#ffe0c2', rim: '#fff5ea', pressed: '#f28b45' },
    route: '/pages/map.html',
    hoverText: '跟著小魚游向附近友善海鮮據點，探索推薦路線與在地永續資訊。'
  },
  {
    key: 'ar',
    title: getStoredLanguage() === 'en' ? 'AR Interaction & Sustainability Labels' : 'AR 互動與永續標籤',
    desktopPosition: [2.85, 0.22, -3.35],
    tabletPosition: [2.05, 0.2, -3.4],
    mobilePosition: [0, -1.08, -3.02],
    desktopScale: 0.92,
    tabletScale: 0.76,
    mobileScale: 0.54,
    shortLabel: getStoredLanguage() === 'en' ? 'Understand sustainability labels' : '理解永續標籤',
    accent: '#f4a6bc',
    // AR 牛頓擺球組：粉紅色粉圈，改掉原本偏亮紫色光暈
    halo: { core: '#ffc0d4', glow: '#ffdce8', rim: '#fff3f7', pressed: '#ee6f99' },
    mobileHalo: { core: '#ffc0d4', glow: '#ffdce8', rim: '#fff3f7', pressed: '#ee6f99' },
    route: '/pages/sustainability.html',
    hoverText: '透過像牛頓擺一樣有節奏的互動，理解海鮮來源、標籤與永續價值。'
  }
]

export default function HeroScene() {
  const [lang] = useState(getStoredLanguage())
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
          <h1>從白色沙灘出發，看見海鮮選擇與海洋永續的連結</h1>
          <p>
            Sustainable Catch Map 希望整合 AI 推薦、漁獲資訊與永續標籤，
            幫助消費者找到友善海鮮，也讓漁業、餐飲與教育場域一起支持海洋資源管理。
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
          <div className="status-hint">提示：滑鼠拖曳可 720° 環視，點擊任一水晶球即可進入對應頁面。</div>
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
        // 手機版：三顆水晶球維持同樣入口形式，不再顯示原本 3D 模型
        showBase: false,
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
              halo: item.halo,
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
function MobileObjectHalo({ colors, active, pressed }) {
  const groupRef = useRef()
  const coreRef = useRef()
  const softRef = useRef()
  const outerRef = useRef()
  const rimRef = useRef()

  const haloColors = colors || { core: '#9edff5', glow: '#c8f0fb', rim: '#ffffff', pressed: '#4fb7d8' }

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // 很輕微的呼吸感即可，避免色暈搶走 3D 模型本體注意力
    const pulse = 1 + Math.sin(t * 1.05) * 0.018

    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0025
      groupRef.current.scale.setScalar((active ? 1.045 : 1) * pulse)
    }

    const targetCore = pressed ? 0.36 : (active ? 0.24 : 0.18)
    const targetSoft = pressed ? 0.18 : (active ? 0.105 : 0.075)
    const targetOuter = pressed ? 0.11 : (active ? 0.06 : 0.042)
    const targetRim = pressed ? 0.24 : (active ? 0.16 : 0.105)

    if (coreRef.current) coreRef.current.material.opacity = targetCore
    if (softRef.current) softRef.current.material.opacity = targetSoft
    if (outerRef.current) outerRef.current.material.opacity = targetOuter
    if (rimRef.current) rimRef.current.material.opacity = targetRim
  })

  return (
    <group
      ref={groupRef}
      // 手機版專用：放在模型後方，並略低於標題文字，避免遮擋模型與說明文字
      position={[0, 0.72, -0.34]}
      scale={[0.9, 1.08, 1]}
      rotation={[0, 0, 0]}
    >
      {/* 外層色暈：範圍保守、透明度低，只形成柔和 O 型氛圍 */}
      <mesh ref={outerRef} renderOrder={0}>
        <ringGeometry args={[0.76, 1.38, 96]} />
        <meshBasicMaterial
          color={pressed ? haloColors.pressed : haloColors.glow}
          transparent
          opacity={0.045}
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 中層色暈：讓三個模型各自有不同色系，但不會蓋住 3D 模型 */}
      <mesh ref={softRef} position={[0, 0, 0.01]} renderOrder={1}>
        <ringGeometry args={[0.6, 1.24, 96]} />
        <meshBasicMaterial
          color={pressed ? haloColors.pressed : haloColors.core}
          transparent
          opacity={0.075}
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 核心 O 型色圈：細、淡、清楚，但不喧賓奪主 */}
      <mesh ref={coreRef} position={[0, 0, 0.02]} renderOrder={2}>
        <ringGeometry args={[0.92, 1.04, 128]} />
        <meshBasicMaterial
          color={pressed ? haloColors.pressed : haloColors.core}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 內側高光：用極淡亮邊增加質感，避免看起來像粗色框 */}
      <mesh ref={rimRef} position={[0, 0, 0.03]} renderOrder={3}>
        <ringGeometry args={[1.04, 1.085, 128]} />
        <meshBasicMaterial
          color={pressed ? haloColors.pressed : haloColors.rim}
          transparent
          opacity={0.105}
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight color={pressed ? haloColors.pressed : haloColors.glow} intensity={pressed ? 0.34 : (active ? 0.24 : 0.13)} distance={2.2} decay={2} />
    </group>
  )
}


/* ============================================================
   透明水晶球 — 三個首頁入口改成可點選的玻璃球
   - 以球體玻璃、粉色球緣、前景高光與內部星光，呈現「水晶球」質感
   - 玻璃透明度保守，讓使用者清楚看見球內的標題與內容簡述
   - 放在 InteractiveMenuObject 內，因此點擊水晶球任何位置都能進入對應頁面
============================================================ */

function CrystalBall({ active, pressed, color = '#8eddf2', halo, mobile = false }) {
  const groupRef = useRef()
  const outerShellRef = useRef()
  const innerShellRef = useRef()
  const rimRef = useRef()
  const backRimRef = useRef()
  const sparkleGroupRef = useRef()

  const rimColor = pressed ? ((halo && halo.pressed) || color) : ((halo && halo.core) || color)
  const glowColor = (halo && halo.glow) || color
  const brightColor = (halo && halo.rim) || '#ffffff'

  const sparkles = useMemo(() => [
    [-0.82, -0.24, 0.58, 0.028, 0.2],
    [-0.58, 0.28, -0.38, 0.021, 1.2],
    [-0.32, 0.9, 0.44, 0.022, 2.1],
    [-0.08, -0.58, -0.22, 0.018, 2.8],
    [0.22, 0.56, 0.6, 0.024, 3.7],
    [0.52, -0.08, -0.3, 0.02, 4.3],
    [0.82, 0.18, 0.4, 0.022, 5.1],
    [0.38, 1.0, -0.08, 0.016, 5.9],
    [-0.72, 1.1, 0.24, 0.016, 6.5],
    [0.04, 0.18, 0.72, 0.02, 7.1]
  ], [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      const pulse = 1 + Math.sin(t * 1.05) * (active ? 0.016 : 0.008)
      groupRef.current.scale.setScalar(pulse)
    }
    if (outerShellRef.current) {
      outerShellRef.current.rotation.y = Math.sin(t * 0.25) * 0.04
      outerShellRef.current.material.opacity = pressed ? 0.3 : (active ? 0.25 : 0.2)
    }
    if (innerShellRef.current) {
      innerShellRef.current.rotation.y = -Math.sin(t * 0.2) * 0.03
      innerShellRef.current.material.opacity = pressed ? 0.16 : (active ? 0.12 : 0.09)
    }
    if (rimRef.current) {
      rimRef.current.rotation.z += 0.0032
      rimRef.current.material.opacity = pressed ? 0.52 : (active ? 0.38 : 0.28)
    }
    if (backRimRef.current) {
      backRimRef.current.rotation.z -= 0.0023
      backRimRef.current.material.opacity = pressed ? 0.2 : (active ? 0.16 : 0.12)
    }
    if (sparkleGroupRef.current) {
      sparkleGroupRef.current.children.forEach((sparkle, index) => {
        const base = sparkles[index]
        sparkle.position.y = base[1] + Math.sin(t * 1.25 + base[4]) * 0.045
        sparkle.position.x = base[0] + Math.sin(t * 0.9 + index) * 0.018
        sparkle.material.opacity = pressed ? 0.82 : (active ? 0.66 : 0.44)
        sparkle.scale.setScalar(1 + Math.sin(t * 2.4 + base[4]) * 0.16)
      })
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.72, 0.02]}>
      {/* 外層玻璃球：更明顯的透明玻璃球體 */}
      <mesh ref={outerShellRef} renderOrder={1}>
        <sphereGeometry args={[1.52, 88, 64]} />
        <meshPhysicalMaterial
          color={glowColor}
          transparent
          opacity={0.2}
          roughness={0.01}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.01}
          transmission={0.86}
          thickness={1.25}
          ior={1.48}
          envMapIntensity={2.2}
          attenuationColor={glowColor}
          attenuationDistance={3.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 內層彩色折射感：讓三顆球色系更清楚，但不遮擋內容物 */}
      <mesh ref={innerShellRef} renderOrder={0} scale={[0.93, 0.93, 0.93]}>
        <sphereGeometry args={[1.46, 72, 48]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.09}
          roughness={0.03}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.03}
          transmission={0.42}
          thickness={0.65}
          ior={1.38}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* 正面亮邊，強化「這是一顆玻璃水晶球」的輪廓 */}
      <mesh ref={rimRef} position={[0, 0, 0.05]} renderOrder={4}>
        <torusGeometry args={[1.525, 0.018, 20, 180]} />
        <meshBasicMaterial
          color={brightColor}
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 後側柔和色邊，讓球體更立體 */}
      <mesh ref={backRimRef} position={[0, 0, -0.16]} rotation={[0, 0, Math.PI * 0.08]} renderOrder={1}>
        <torusGeometry args={[1.47, 0.022, 16, 160]} />
        <meshBasicMaterial
          color={rimColor}
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 球體內部的橫向折射亮線 */}
      <mesh position={[0, -0.06, 0.08]} scale={[1.05, 0.34, 1]} renderOrder={2}>
        <torusGeometry args={[1.16, 0.011, 16, 144]} />
        <meshBasicMaterial color={brightColor} transparent opacity={active ? 0.26 : 0.16} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.28, 0.09]} scale={[0.82, 0.18, 1]} renderOrder={2}>
        <torusGeometry args={[1.04, 0.008, 16, 144]} />
        <meshBasicMaterial color={rimColor} transparent opacity={active ? 0.18 : 0.11} depthWrite={false} />
      </mesh>

      {/* 前景玻璃高光 */}
      <mesh position={[-0.58, 0.72, 1.22]} rotation={[0, 0, -0.42]} scale={[0.62, 0.2, 1]} renderOrder={5}>
        <circleGeometry args={[0.46, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={pressed ? 0.6 : (active ? 0.48 : 0.36)} depthWrite={false} />
      </mesh>
      <mesh position={[0.68, -0.26, 1.18]} rotation={[0, 0, -0.2]} scale={[0.42, 0.12, 1]} renderOrder={5}>
        <circleGeometry args={[0.32, 36]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={active ? 0.24 : 0.16} depthWrite={false} />
      </mesh>
      <mesh position={[-0.08, 1.05, 1.18]} rotation={[0, 0, 0.02]} scale={[0.82, 0.05, 1]} renderOrder={5}>
        <circleGeometry args={[0.34, 36]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={active ? 0.18 : 0.12} depthWrite={false} />
      </mesh>

      {/* 球內微光星點 */}
      <group ref={sparkleGroupRef}>
        {sparkles.map(([x, y, z, radius], index) => (
          <mesh key={index} position={[x, y, z]} renderOrder={5}>
            <sphereGeometry args={[radius, 12, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.44} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* 底部柔和接觸影與色光 */}
      <mesh position={[0, -1.52, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.34, 0.46, 1]} renderOrder={0}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial color={rimColor} transparent opacity={active ? 0.16 : 0.09} depthWrite={false} />
      </mesh>

      <pointLight color={glowColor} intensity={pressed ? 0.62 : (active ? 0.42 : 0.24)} distance={mobile ? 2.5 : 3.2} decay={2} />
    </group>
  )
}

function CrystalContentLabel({ item, active, mobile = false }) {
  const panelWidth = mobile ? 1.74 : 2.08
  const panelHeight = mobile ? 0.82 : 0.92
  const xPad = mobile ? 1.46 : 1.78

  return (
    <Billboard position={[0, 0.78, 1.08]} follow>
      {/* 內容說明板：放在水晶球內部前方，只保留標題與內容簡述，確保文字清楚可讀 */}
      <mesh position={[0, -0.14, -0.02]} renderOrder={6}>
        <planeGeometry args={[panelWidth + 0.1, panelHeight + 0.1]} />
        <meshBasicMaterial
          color={item.accent}
          transparent
          opacity={active ? 0.1 : 0.075}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
      <mesh position={[0, -0.14, 0]} renderOrder={7}>
        <planeGeometry args={[panelWidth, panelHeight]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={active ? 0.2 : 0.15}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
      <mesh position={[0, 0.27, 0.01]} scale={[0.78, 0.07, 1]} renderOrder={8}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={active ? 0.18 : 0.12}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <Text
        position={[0, 0.12, 0.02]}
        fontSize={mobile ? 0.128 : 0.158}
        color="#163a52"
        anchorX="center"
        anchorY="middle"
        maxWidth={xPad}
        textAlign="center"
        outlineWidth={0.014}
        outlineColor="#ffffff"
        renderOrder={9}
      >
        {item.title}
      </Text>
      <Text
        position={[0, -0.17, 0.02]}
        fontSize={mobile ? 0.112 : 0.13}
        color="#2b6788"
        anchorX="center"
        anchorY="middle"
        maxWidth={xPad}
        textAlign="center"
        outlineWidth={0.012}
        outlineColor="#ffffff"
        renderOrder={9}
      >
        {item.shortLabel}
      </Text>
    </Billboard>
  )
}

/* ============================================================
   互動物件容器
============================================================ */
function InteractiveMenuObject({ item, active, setActiveKey }) {
  const ref = useRef()
  const haloRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  useCursor(hovered)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // 增加一點整體的呼吸起伏
    ref.current.position.y = item.position[1] + Math.sin(t * 1.5 + item.position[0]) * 0.06
    if (haloRef.current) {
      haloRef.current.material.opacity = pressed ? 0.38 : (active || hovered ? 0.24 : 0.13)
      haloRef.current.rotation.z += 0.006
      haloRef.current.scale.setScalar(pressed ? 1.18 : (active || hovered ? 1.08 : 1))
    }
  })

  const events = {
    onPointerEnter: () => {
      setHovered(true)
      setActiveKey(item.key)
    },
    onPointerLeave: () => {
      setHovered(false)
      setPressed(false)
    },
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerCancel: () => setPressed(false),
    onClick: () => { window.location.href = item.route }
  }

  return (
    <group ref={ref} position={item.position} scale={item.objectScale || 1} {...events}>
      {/* 透明點擊範圍：擴大到整顆水晶球；使用者點球體任何位置都能進入所屬頁面。 */}
      <mesh position={[0, 0.72, 0.04]} scale={[1.08, 1.08, 1.08]} renderOrder={10}>
        <sphereGeometry args={[1.54, 56, 40]} />
        <meshBasicMaterial transparent opacity={0.01} depthWrite={false} color="#ffffff" />
      </mesh>

      <CrystalBall active={active || hovered} pressed={pressed} color={item.accent} halo={item.halo} mobile={item.haloVertical} />

      {/* 水晶球外側輕柔色暈：保留很淡的可點選提示，不影響沙灘與天空背景。 */}
      {item.haloVertical ? (
        <MobileObjectHalo colors={item.mobileHalo} active={active || hovered} pressed={pressed} />
      ) : (
        <>
          <mesh
            ref={haloRef}
            position={[0, -0.75, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.9, 1.42, 72]} />
            <meshBasicMaterial
              color={pressed ? ((item.halo && item.halo.pressed) || item.accent) : ((item.halo && item.halo.core) || item.accent)}
              transparent
              opacity={pressed ? 0.34 : 0.13}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* 外層柔色色暈：標出可點選範圍，但降低亮度避免三個入口過亮 */}
          <mesh
            position={[0, -0.745, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[1.0, 1.78, 72]} />
            <meshBasicMaterial
              color={pressed ? ((item.halo && item.halo.pressed) || item.accent) : ((item.halo && item.halo.glow) || item.accent)}
              transparent
              opacity={pressed ? 0.12 : 0.045}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* 內光圈 */}
          <mesh
            position={[0, -0.735, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.52, 0.9, 64]} />
            <meshBasicMaterial
              color={pressed ? ((item.halo && item.halo.pressed) || item.accent) : ((item.halo && item.halo.rim) || item.accent)}
              transparent
              opacity={pressed ? 0.14 : 0.06}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </>
      )}

      <CrystalContentLabel item={item} active={active || hovered} mobile={item.haloVertical} />

      <Html position={[0, -1.52, 0]} center distanceFactor={10}>
        <div className="floating-tooltip model-description">點擊水晶球進入：{item.shortLabel}</div>
      </Html>
    </group>
  )
}
