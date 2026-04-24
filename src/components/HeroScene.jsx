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

      {/* 優化：更晴朗、帶深藍色的天空 */}
      <Sky
        sunPosition={[8, 12, -10]} // 稍微提高太陽位置
        turbidity={0.05}   // 大幅降低混濁度，天空更清澈
        rayleigh={0.15}    // 降低散射，呈現深藍色的天空
        mieCoefficient={0.001} // 降低霧氣
        mieDirectionalG={0.95}
      />
      <Stars radius={80} depth={40} count={500} factor={2} saturation={0} fade speed={0.5} />
      <Sparkles count={150} scale={[30, 10, 30]} size={2} speed={0.3} opacity={0.2} color="#ffffff" />

      <SunGlare />
      <Clouds />
      <Sand />
      <SandDetails />
      <BeachDecor /> {/* 新增：沙灘上的自然變化 (遮陽傘、沙雕、泳裝) */}
      <Sea />
      <SeaReflection />
      <OceanDecor /> {/* 新增：海面遊艇 */}
      
      {/* 增強海浪層次 */}
      <WaveLayer offset={0} speed={1.2} opacity={0.6} color="#ffffff" z={-9.5} />
      <WaveLayer offset={Math.PI * 0.5} speed={0.9} opacity={0.4} color="#e0f7ff" z={-10.5} />
      <WaveLayer offset={Math.PI} speed={1.5} opacity={0.3} color="#b3e5fc" z={-12.5} /> {/* 新增遠處海浪 */}
      
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
   新增：沙灘裝飾物 (遮陽傘、沙雕、泳裝墊子、沙灘球)
============================================================ */
function BeachDecor() {
  return (
    <group position={[0, 0, 0]}>
      {/* 沙雕 */}
      <group position={[-5.5, 0.1, 2]} rotation={[0, Math.PI / 4, 0]}>
        <mesh castShadow position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.3, 16]} />
          <meshStandardMaterial color="#e8d8b0" roughness={0.95} />
        </mesh>
        <mesh castShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.3, 16]} />
          <meshStandardMaterial color="#e8d8b0" roughness={0.95} />
        </mesh>
        <mesh castShadow position={[0, 0.65, 0]}>
          <coneGeometry args={[0.15, 0.3, 16]} />
          <meshStandardMaterial color="#e8d8b0" roughness={0.95} />
        </mesh>
      </group>

      {/* 遮陽傘 A 與沙灘墊(泳裝意象) */}
      <group position={[6.5, 0, -1]}>
        {/* 傘柄 */}
        <mesh castShadow position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 3, 8]} />
          <meshStandardMaterial color="#eeeeee" metalness={0.5} />
        </mesh>
        {/* 傘面 */}
        <mesh castShadow position={[0, 3, 0]}>
          <coneGeometry args={[2.2, 0.8, 16]} />
          <meshStandardMaterial color="#ff6b6b" roughness={0.7} />
        </mesh>
        {/* 鮮豔的沙灘巾/泳裝鋪墊 */}
        <mesh receiveShadow position={[1.2, 0.02, 0.5]} rotation={[-Math.PI / 2, 0, 0.5]}>
          <planeGeometry args={[1.5, 2.5]} />
          <meshStandardMaterial color="#4ecdc4" roughness={0.9} />
        </mesh>
        {/* 海灘球 */}
        <mesh castShadow position={[2, 0.15, 1.5]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ffe66d" roughness={0.5} />
        </mesh>
      </group>

      {/* 遮陽傘 B */}
      <group position={[-7, 0, -4.5]} rotation={[0, -0.5, 0]}>
        <mesh castShadow position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.4, 8]} />
          <meshStandardMaterial color="#eeeeee" metalness={0.5} />
        </mesh>
        <mesh castShadow position={[0, 2.4, 0]}>
          <coneGeometry args={[1.8, 0.6, 16]} />
          <meshStandardMaterial color="#feca57" roughness={0.7} />
        </mesh>
        <mesh receiveShadow position={[-1, 0.02, 0.2]} rotation={[-Math.PI / 2, 0, -0.2]}>
          <planeGeometry args={[1.2, 2.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

/* ============================================================
   新增：海洋遊艇
============================================================ */
function OceanDecor() {
  const yachtRef = useRef()

  useFrame((state) => {
    if (!yachtRef.current) return
    const t = state.clock.elapsedTime
    // 遊艇隨海浪浮動與搖擺
    yachtRef.current.position.y = 0.05 + Math.sin(t * 1.5) * 0.15
    yachtRef.current.rotation.z = Math.sin(t * 1.2) * 0.05
    yachtRef.current.rotation.x = Math.sin(t * 0.8) * 0.03
    // 緩慢在遠方海面航行
    yachtRef.current.position.x = 20 - ((t * 0.8) % 40)
  })

  return (
    <group ref={yachtRef} position={[15, 0.1, -22]}>
      {/* 船體主結構 */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[3.5, 0.6, 1.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* 船首 */}
      <mesh castShadow position={[-2.1, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* 船艙 */}
      <mesh castShadow position={[0.2, 0.9, 0]}>
        <boxGeometry args={[1.8, 0.8, 0.9]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.2} />
      </mesh>
      {/* 船艙深色玻璃窗 */}
      <mesh position={[0.2, 0.9, 0.46]}>
        <planeGeometry args={[1.4, 0.4]} />
        <meshBasicMaterial color="#112233" />
      </mesh>
      {/* 雷達架/天線 */}
      <mesh castShadow position={[0.2, 1.6, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.8} />
      </mesh>
    </group>
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow geometry={geometry}>
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
    <group position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -16]} receiveShadow>
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
   互動物件容器 (已優化：增強點選感與視覺提示)
============================================================ */
function InteractiveMenuObject({ item, active, setActiveKey }) {
  const ref = useRef()
  const haloRef = useRef()
  const [hovered, setHovered] = useState(false)

  // 讓滑鼠游標在移上去時變成手指 (原有功能保留)
  useCursor(hovered)

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    
    // 原本的呼吸起伏
    ref.current.position.y = item.position[1] + Math.sin(t * 1.5 + item.position[0]) * 0.06

    // 1. 優化：整體放大縮小 (使用 lerp 達成平滑過渡，增加「彈跳選中」感)
    const targetScale = active || hovered ? 1.15 : 1
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6)

    if (haloRef.current) {
      // 2. 優化：讓底部的光圈在 Hover 時變得更亮、範圍更大
      const targetOpacity = active || hovered ? 0.7 : 0.2
      haloRef.current.material.opacity = THREE.MathUtils.lerp(haloRef.current.material.opacity, targetOpacity, delta * 6)
      haloRef.current.rotation.z += 0.01
      
      const targetHaloScale = active || hovered ? 1.5 : 1
      haloRef.current.scale.lerp(new THREE.Vector3(targetHaloScale, targetHaloScale, targetHaloScale), delta * 6)
    }
  })

  const events = {
    onPointerEnter: (e) => {
      e.stopPropagation() // 防止觸發背後的海水或沙灘
      setHovered(true)
      setActiveKey(item.key)
    },
    onPointerLeave: () => setHovered(false),
    onClick: (e) => {
      e.stopPropagation()
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

      {/* 外圍光圈 */}
      <mesh ref={haloRef} position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.88, 1.32, 56]} />
        <meshBasicMaterial color={item.accent} transparent opacity={0.22} />
      </mesh>
      
      {/* 內光圈 (Hover 時也會稍微提亮) */}
      <mesh position={[0, -0.74, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.88, 56]} />
        <meshBasicMaterial color={item.accent} transparent opacity={hovered || active ? 0.4 : 0.06} />
      </mesh>

      {/* 3. 優化：加強標題字體，並加入指示箭頭 ▼ */}
      <Billboard position={[0, 2.38, 0]} follow>
        <Text 
          fontSize={active || hovered ? 0.32 : 0.27} // Hover 時字體稍微放大
          color="#183b56" 
          anchorX="center" 
          anchorY="middle" 
          maxWidth={3.2}
          outlineWidth={0.015} // 加粗外框讓文字從背景跳出來
          outlineColor="#ffffff"
          fontWeight="bold"
        >
          {item.title}
        </Text>
        
        {/* 動態小箭頭，視覺引導往下看模型 */}
        <Text 
          position={[0, -0.32, 0]} 
          fontSize={0.18} 
          color={item.accent} 
          outlineWidth={0.01} 
          outlineColor="#ffffff"
        >
          ▼
        </Text>
      </Billboard>

      {/* 4. 優化：Tooltip 加上明確的「點擊進入」按鈕標籤 */}
      <Html 
        position={[0, active || hovered ? 3.15 : 2.85, 0]} // Hover 時浮上來一點
        center 
        distanceFactor={10}
        style={{
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          opacity: hovered || active ? 1 : 0,
          pointerEvents: 'none',
          transform: `scale(${hovered || active ? 1 : 0.8})`, // 加入縮放進場動畫
          zIndex: hovered || active ? 10 : 0
        }}
      >
        <div className="floating-tooltip" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          width: 'max-content',
          maxWidth: '250px',
          textAlign: 'center'
        }}>
          <span style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}>{item.hoverText}</span>
          
          {/* 明確的 Call to action (CTA) */}
          <div style={{
            backgroundColor: item.accent,
            color: '#0b1b2b',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: '2px solid #ffffff'
          }}>
            👆 點擊進入
          </div>
        </div>
      </Html>
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
      <RoundBase color={color} accent="#eefaff" />
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
function FriendlyFish({ active, color }) {
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
      <RoundBase color={color} accent="#e9fff9" />
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
function NewtonCradle({ active, color }) {
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
      <RoundBase color={color} accent="#f7efff" />
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
