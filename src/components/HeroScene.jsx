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
    subtitle: '泳褲帥哥導遊',
    position: [-4.2, 1.2, -3.4],
    accent: '#8fd3ff',
    route: '/guide',
    hoverText: '歡迎來到永續漁獲地圖,跟著導遊開始探索。'
  },
  {
    key: 'map',
    title: '附近的友善海鮮地圖',
    subtitle: '3D 古地圖卷軸',
    position: [0, 1, -6],
    accent: '#ffe29a',
    route: '/map',
    hoverText: '展開附近可探索的友善海鮮據點與路線。'
  },
  {
    key: 'ar',
    title: 'AR 互動與永續標籤',
    subtitle: '3D 老魔法師',
    position: [4.2, 1.2, -3.4],
    accent: '#d4b3ff',
    route: '/sustainability',
    hoverText: '揮動魔法棒,召喚永續標籤、符文與 AR 體驗。'
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
          <h1>像走進白色沙灘一樣,開始探索永續漁獲世界</h1>
          <p>
            這不是一般首頁,而是一個可以拖曳環視的沉浸式入口。抬頭看天空、低頭看腳下沙灘,
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
          <div className="status-hint">提示:滑鼠拖曳可 720° 環視,移到 3D 物件上會觸發動態效果。</div>
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
        <InteractiveMenuObject key={item.key} item={item} active={item.key === activeKey} setActiveKey={setActiveKey} />
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
        {item.key === 'guide' && <GuideStatue active={active || hovered} color={item.accent} />}
        {item.key === 'map' && <ScrollMap active={active || hovered} color={item.accent} />}
        {item.key === 'ar' && <WizardStatue active={active || hovered} color={item.accent} />}
      </Float>

      <mesh ref={haloRef} position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.25, 50]} />
        <meshBasicMaterial color={item.accent} transparent opacity={0.2} />
      </mesh>

      <Billboard position={[0, 2.4, 0]} follow>
        <Text fontSize={0.28} color="#183b56" anchorX="center" anchorY="middle" maxWidth={3.2}>
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
   1. GuideStatue —— 泳褲帥哥導遊(精雕版)
   - contrapposto 站姿:重心偏左腿、右腿放鬆微彎、臀部與肩膀反向傾斜
   - 軀幹/四肢用 TubeGeometry 搭 CatmullRom 曲線,做出解剖式膨起(三角肌、二頭、腓腸肌)
   - 頭部改蛋形,加眉骨、顴骨、下頷角小球疊出立體
   - 墨鏡:獨立鏡片/鏡橋/鏡腳,鏡面有漸層反光
   - 髮型:多錐疊出蓬鬆抓髮,不再是半球
   - 新增:貝殼項鍊、運動手環、衝浪刺青、泳褲椰子樹印花、髖骨 V 線
   - 小旗幟升級為刻字木牌並有繩子綁法
============================================================ */

function GuideStatue({ active, color }) {
  const upperArmRef = useRef()
  const forearmRef = useRef()
  const headRef = useRef()
  const hipRef = useRef()
  const signRef = useRef()
  const chestRef = useRef()

  const skin = '#f2c9a6'
  const skinMid = '#e3af86'
  const skinDeep = '#c9906a'
  const hair = '#231309'
  const hairHighlight = '#5a3620'

  // === 肢體用 Tube + 曲線做出「解剖膨起」 ===
  // 上臂:肩膀處粗、二頭膨、肘收
  const upperArmCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.0, -0.15, 0.02),
    new THREE.Vector3(-0.02, -0.3, 0),
    new THREE.Vector3(-0.04, -0.45, 0)
  ]), [])
  // 前臂:前細後粗、略彎
  const forearmCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.0, -0.14, 0.03),
    new THREE.Vector3(0.02, -0.28, 0.02),
    new THREE.Vector3(0.04, -0.42, 0)
  ]), [])
  // 腿:大腿 → 膝 → 小腿腓腸肌
  const legCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.85, 0),
    new THREE.Vector3(0.0, 0.62, 0.02),
    new THREE.Vector3(-0.02, 0.42, 0),
    new THREE.Vector3(0.0, 0.25, 0.04),
    new THREE.Vector3(0.0, 0.08, 0.02),
    new THREE.Vector3(0.0, 0.0, 0)
  ]), [])

  // 軀幹輪廓 — V 型
  const torsoProfile = useMemo(() => ([
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.24, 0.0),
    new THREE.Vector2(0.28, 0.08),
    new THREE.Vector2(0.30, 0.22),
    new THREE.Vector2(0.32, 0.38),
    new THREE.Vector2(0.36, 0.58),
    new THREE.Vector2(0.42, 0.78),
    new THREE.Vector2(0.45, 0.92),
    new THREE.Vector2(0.38, 1.02),
    new THREE.Vector2(0.18, 1.08),
    new THREE.Vector2(0.12, 1.12)
  ]), [])

  // 腿部有變粗度的 tube radius 函式
  const legRadius = (t) => {
    // t: 0 = 腳踝, 1 = 大腿頂
    // 腳踝 0.085,小腿肚 0.15,膝蓋 0.11,大腿 0.18
    if (t < 0.12) return 0.085 + t * 0.3
    if (t < 0.35) return 0.12 + Math.sin((t - 0.12) / 0.23 * Math.PI) * 0.03 + 0.12
    if (t < 0.55) return 0.14 - (t - 0.35) * 0.15
    return 0.135 + (t - 0.55) * 0.11
  }

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (upperArmRef.current) {
      upperArmRef.current.rotation.z = active ? Math.sin(t * 3.4) * 0.22 - 1.35 : -1.15
      upperArmRef.current.rotation.x = active ? Math.sin(t * 2.8) * 0.06 : 0
    }
    if (forearmRef.current) {
      forearmRef.current.rotation.z = active ? Math.sin(t * 3.4 + 0.6) * 0.4 - 0.7 : -0.5
    }
    if (headRef.current) {
      headRef.current.rotation.y = active ? Math.sin(t * 2.0) * 0.2 : Math.sin(t * 0.6) * 0.06
      headRef.current.rotation.z = active ? Math.sin(t * 1.8) * 0.05 : Math.sin(t * 0.5) * 0.02
      headRef.current.rotation.x = active ? Math.sin(t * 1.4) * 0.04 - 0.02 : -0.02
    }
    if (hipRef.current) {
      hipRef.current.rotation.y = active ? Math.sin(t * 2.4) * 0.07 : 0
      hipRef.current.rotation.z = active ? Math.sin(t * 2.4) * 0.015 : 0
    }
    if (chestRef.current) {
      const breathe = Math.sin(t * 1.2) * 0.012
      chestRef.current.scale.set(1 + breathe, 1, 1 + breathe)
    }
    if (signRef.current) {
      signRef.current.rotation.z = active ? Math.sin(t * 2.6) * 0.1 - 0.04 : -0.04
      signRef.current.rotation.y = active ? Math.sin(t * 1.8) * 0.18 : Math.sin(t * 0.8) * 0.05
    }
  })

  return (
    <group scale={0.92} rotation={[0, 0.08, 0]}>
      {/* ====== 基座:濕沙丘 + 貝殼 + 小螃蟹腳印 ====== */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.88, 0.16, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.25 : 0}
        />
      </mesh>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.72, 0.04, 48]} />
        <meshStandardMaterial color="#fff4e4" roughness={0.75} />
      </mesh>
      {/* 海浪潑上來 */}
      <mesh position={[0, 0.16, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.55, 24, 1, 0.4, Math.PI * 0.7]} />
        <meshStandardMaterial color="#b8e6ff" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* 扇貝 */}
      <group position={[0.42, 0.16, 0.2]} rotation={[0, 0.5, 0.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.08, 16, 10, 0, Math.PI, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffc9a0" roughness={0.6} />
        </mesh>
        {/* 貝殼條紋 */}
        {[-0.4, -0.2, 0, 0.2, 0.4].map((a, i) => (
          <mesh key={`shell-${i}`} rotation={[0, a, 0]} position={[0, 0.001, 0]}>
            <boxGeometry args={[0.003, 0.002, 0.08]} />
            <meshStandardMaterial color="#d89060" roughness={0.8} />
          </mesh>
        ))}
      </group>
      {/* 海星 */}
      <group position={[-0.4, 0.15, 0.15]} rotation={[-Math.PI / 2, 0, 0.3]}>
        {[0, 1, 2, 3, 4].map(i => {
          const a = (i / 5) * Math.PI * 2
          return (
            <mesh key={`star-arm-${i}`} position={[Math.cos(a) * 0.05, Math.sin(a) * 0.05, 0]} rotation={[0, 0, a + Math.PI / 2]}>
              <coneGeometry args={[0.025, 0.08, 6]} />
              <meshStandardMaterial color="#ff8a5b" roughness={0.7} />
            </mesh>
          )
        })}
        <mesh>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#ff8a5b" roughness={0.7} />
        </mesh>
      </group>

      {/* ====== 腿部(contrapposto)====== */}
      {/* 左腿 — 承重腿,挺直 */}
      <group position={[-0.15, 0.18, 0]}>
        <mesh castShadow>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0.0, 0.2, 0.02),
              new THREE.Vector3(-0.01, 0.42, 0),
              new THREE.Vector3(0.0, 0.62, 0.02),
              new THREE.Vector3(0.01, 0.8, 0)
            ]), 32, 0.13, 18, false
          ]} />
          <meshStandardMaterial color={skin} roughness={0.68} />
        </mesh>
        {/* 小腿腓腸肌隆起 */}
        <mesh position={[0, 0.3, -0.06]} scale={[1, 1.4, 0.8]} castShadow>
          <sphereGeometry args={[0.08, 16, 12]} />
          <meshStandardMaterial color={skinMid} roughness={0.78} transparent opacity={0.65} />
        </mesh>
        {/* 膝蓋骨 */}
        <mesh position={[0, 0.5, 0.11]} castShadow>
          <sphereGeometry args={[0.07, 16, 12]} />
          <meshStandardMaterial color={skinMid} roughness={0.82} />
        </mesh>
        {/* 大腿股四頭 */}
        <mesh position={[0, 0.7, 0.08]} scale={[1, 1.5, 0.7]} castShadow>
          <sphereGeometry args={[0.12, 20, 14]} />
          <meshStandardMaterial color={skinMid} roughness={0.78} transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 右腿 — 放鬆腿,膝蓋微彎、重心稍前 */}
      <group position={[0.17, 0.18, 0.05]} rotation={[0.08, 0, -0.03]}>
        <mesh castShadow>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0.01, 0.2, 0.04),
              new THREE.Vector3(0.02, 0.4, 0.08),
              new THREE.Vector3(0.02, 0.6, 0.04),
              new THREE.Vector3(0.0, 0.78, -0.02)
            ]), 32, 0.13, 18, false
          ]} />
          <meshStandardMaterial color={skin} roughness={0.68} />
        </mesh>
        <mesh position={[0.02, 0.3, 0]} scale={[1, 1.4, 0.8]} castShadow>
          <sphereGeometry args={[0.08, 16, 12]} />
          <meshStandardMaterial color={skinMid} roughness={0.78} transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.02, 0.48, 0.13]} castShadow>
          <sphereGeometry args={[0.07, 16, 12]} />
          <meshStandardMaterial color={skinMid} roughness={0.82} />
        </mesh>
        <mesh position={[0.01, 0.68, 0.08]} scale={[1, 1.5, 0.7]} castShadow>
          <sphereGeometry args={[0.12, 20, 14]} />
          <meshStandardMaterial color={skinMid} roughness={0.78} transparent opacity={0.5} />
        </mesh>
      </group>

      {/* ====== 腳 & 夾腳拖 ====== */}
      {[[-0.15, 0, 0], [0.17, 0.03, 0.05]].map((p, i) => (
        <group key={`foot-${i}`} position={[p[0], 0.18 + p[1], 0.06 + p[2]]}>
          {/* 腳板 */}
          <mesh position={[0, -0.02, 0.04]} scale={[1, 0.5, 1.8]} castShadow>
            <sphereGeometry args={[0.085, 16, 12]} />
            <meshStandardMaterial color={skin} roughness={0.72} />
          </mesh>
          {/* 腳趾(5 根)*/}
          {[-0.055, -0.028, 0, 0.028, 0.055].map((dx, j) => (
            <mesh key={`toe-${j}`} position={[dx, -0.035, 0.17 + (j === 0 ? 0.015 : 0)]} scale={[1, 0.7, 1.3]} castShadow>
              <sphereGeometry args={[j === 0 ? 0.025 : 0.02, 12, 10]} />
              <meshStandardMaterial color={skin} roughness={0.75} />
            </mesh>
          ))}
          {/* 夾腳拖底板 */}
          <mesh position={[0, -0.055, 0.04]} rotation={[0.05, 0, 0]} scale={[1, 1, 1.8]} castShadow>
            <cylinderGeometry args={[0.11, 0.12, 0.03, 24]} />
            <meshStandardMaterial color="#1f3a47" roughness={0.85} />
          </mesh>
          {/* 拖鞋 Y 帶 */}
          <mesh position={[0, -0.03, 0.08]} castShadow>
            <torusGeometry args={[0.025, 0.01, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#f7c948" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[-0.018, -0.025, 0.13]} rotation={[0, 0, -0.5]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
            <meshStandardMaterial color="#f7c948" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0.018, -0.025, 0.13]} rotation={[0, 0, 0.5]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
            <meshStandardMaterial color="#f7c948" roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ====== 泳褲(contrapposto + 皺褶 + 椰樹印花)====== */}
      <group ref={hipRef} position={[0, 0.94, 0]} rotation={[0, 0, 0.04]}>
        <mesh castShadow>
          <latheGeometry args={[
            [
              new THREE.Vector2(0.0, 0.0),
              new THREE.Vector2(0.26, 0.0),
              new THREE.Vector2(0.32, 0.04),
              new THREE.Vector2(0.36, 0.14),
              new THREE.Vector2(0.38, 0.26),
              new THREE.Vector2(0.36, 0.34),
              new THREE.Vector2(0.32, 0.4),
              new THREE.Vector2(0.0, 0.4)
            ], 32
          ]} />
          <meshStandardMaterial color="#0e6cc1" roughness={0.58} />
        </mesh>
        {/* 皺褶(6 條垂向 capsule)*/}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const a = (i / 6) * Math.PI * 2
          return (
            <mesh
              key={`pleat-${i}`}
              position={[Math.cos(a) * 0.36, 0.18, Math.sin(a) * 0.36]}
              rotation={[0, -a, 0]}
              castShadow
            >
              <capsuleGeometry args={[0.008, 0.3, 4, 8]} />
              <meshStandardMaterial color="#0a5aa0" roughness={0.7} />
            </mesh>
          )
        })}
        {/* 腰帶 */}
        <mesh position={[0, 0.36, 0]} castShadow>
          <torusGeometry args={[0.33, 0.022, 12, 36]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        {/* 繩結 */}
        <mesh position={[0, 0.36, 0.34]} scale={[1, 1.2, 1]} castShadow>
          <sphereGeometry args={[0.042, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.34, 0.37]} castShadow>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* 繩尾 x 2(有鬚尾)*/}
        <mesh position={[-0.05, 0.25, 0.34]} rotation={[0.3, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.012, 0.015, 0.2, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <mesh position={[-0.06, 0.14, 0.34]} rotation={[0.35, 0, 0.25]} castShadow>
          <cylinderGeometry args={[0.004, 0.012, 0.06, 8]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.7} />
        </mesh>
        <mesh position={[0.05, 0.25, 0.34]} rotation={[0.3, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.012, 0.015, 0.2, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <mesh position={[0.06, 0.14, 0.34]} rotation={[0.35, 0, -0.25]} castShadow>
          <cylinderGeometry args={[0.004, 0.012, 0.06, 8]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.7} />
        </mesh>
        {/* 椰子樹印花 x 5 */}
        {[
          [0.2, 0.22, 0.3, 0.4],
          [-0.25, 0.14, 0.25, -0.3],
          [0.15, 0.08, -0.32, 0.6],
          [-0.22, 0.28, -0.28, -0.6],
          [0.0, 0.2, 0.38, 0]
        ].map(([x, y, z, rotY], i) => (
          <group key={`palm-${i}`} position={[x, y, z]} rotation={[0, rotY, 0]} scale={0.06}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
              <meshStandardMaterial color="#f4e07a" />
            </mesh>
            {[0, 1, 2, 3, 4].map(j => {
              const a = (j / 5) * Math.PI * 2
              return (
                <mesh key={`leaf-${j}`} position={[Math.cos(a) * 0.15, 0.5, Math.sin(a) * 0.15]} rotation={[0, -a, 0.8]}>
                  <coneGeometry args={[0.06, 0.3, 4]} />
                  <meshStandardMaterial color="#f4e07a" />
                </mesh>
              )
            })}
          </group>
        ))}
      </group>

      {/* ====== 軀幹(V 型 + 呼吸起伏)====== */}
      <group ref={chestRef} position={[0, 1.34, 0]} rotation={[0, 0, -0.03]}>
        <mesh castShadow>
          <latheGeometry args={[torsoProfile, 36]} />
          <meshStandardMaterial color={skin} roughness={0.62} />
        </mesh>

        {/* 三角肌(肩膀圓膨)*/}
        <mesh position={[-0.38, 1.0, 0]} castShadow>
          <sphereGeometry args={[0.16, 24, 20]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>
        <mesh position={[0.38, 1.0, 0]} castShadow>
          <sphereGeometry args={[0.16, 24, 20]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>
        {/* 三角肌陰影紋 */}
        <mesh position={[-0.42, 0.88, 0.08]} castShadow>
          <sphereGeometry args={[0.06, 12, 10]} />
          <meshStandardMaterial color={skinMid} roughness={0.85} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.42, 0.88, 0.08]} castShadow>
          <sphereGeometry args={[0.06, 12, 10]} />
          <meshStandardMaterial color={skinMid} roughness={0.85} transparent opacity={0.5} />
        </mesh>

        {/* 胸肌(兩塊飽滿,有下緣陰影)*/}
        <mesh position={[-0.16, 0.82, 0.32]} scale={[1.2, 0.85, 0.9]} castShadow>
          <sphereGeometry args={[0.15, 24, 18]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>
        <mesh position={[0.16, 0.82, 0.32]} scale={[1.2, 0.85, 0.9]} castShadow>
          <sphereGeometry args={[0.15, 24, 18]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>
        {/* 胸肌下緣陰影 */}
        <mesh position={[-0.16, 0.72, 0.4]}>
          <boxGeometry args={[0.2, 0.015, 0.02]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.35} />
        </mesh>
        <mesh position={[0.16, 0.72, 0.4]}>
          <boxGeometry args={[0.2, 0.015, 0.02]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.35} />
        </mesh>
        {/* 胸中線 */}
        <mesh position={[0, 0.78, 0.42]}>
          <capsuleGeometry args={[0.005, 0.22, 4, 8]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.45} />
        </mesh>
        {/* 乳暈小點 */}
        <mesh position={[-0.14, 0.84, 0.46]}>
          <circleGeometry args={[0.012, 16]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.14, 0.84, 0.46]}>
          <circleGeometry args={[0.012, 16]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.5} />
        </mesh>

        {/* 腹肌(3 對 6 塊 + 中線 + 兩側斜腹肌)*/}
        <mesh position={[0, 0.52, 0.38]}>
          <capsuleGeometry args={[0.004, 0.36, 4, 8]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.55} />
        </mesh>
        {[
          [-0.08, 0.62], [0.08, 0.62],
          [-0.08, 0.48], [0.08, 0.48],
          [-0.08, 0.34], [0.08, 0.34]
        ].map(([x, y], i) => (
          <group key={`abs-${i}`}>
            <mesh position={[x, y, 0.37]} scale={[1.1, 0.7, 0.6]} castShadow>
              <sphereGeometry args={[0.055, 16, 12]} />
              <meshStandardMaterial color={skin} roughness={0.65} />
            </mesh>
            <mesh position={[x, y - 0.05, 0.4]}>
              <boxGeometry args={[0.1, 0.006, 0.006]} />
              <meshStandardMaterial color={skinDeep} transparent opacity={0.35} />
            </mesh>
          </group>
        ))}

        {/* 肚臍 */}
        <mesh position={[0, 0.22, 0.4]}>
          <circleGeometry args={[0.015, 16]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0.21, 0.395]}>
          <sphereGeometry args={[0.01, 12, 8]} />
          <meshStandardMaterial color={skinDeep} roughness={0.9} />
        </mesh>

        {/* 髖骨 V 線 */}
        <mesh position={[-0.14, 0.1, 0.38]} rotation={[0, 0, -0.4]}>
          <capsuleGeometry args={[0.006, 0.2, 4, 8]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.45} />
        </mesh>
        <mesh position={[0.14, 0.1, 0.38]} rotation={[0, 0, 0.4]}>
          <capsuleGeometry args={[0.006, 0.2, 4, 8]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.45} />
        </mesh>

        {/* 肋骨微影 */}
        <mesh position={[-0.22, 0.58, 0.3]} rotation={[0, 0, 0.4]}>
          <capsuleGeometry args={[0.003, 0.1, 4, 8]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.25} />
        </mesh>
        <mesh position={[0.22, 0.58, 0.3]} rotation={[0, 0, -0.4]}>
          <capsuleGeometry args={[0.003, 0.1, 4, 8]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.25} />
        </mesh>
      </group>

      {/* ====== 貝殼項鍊 ====== */}
      <group position={[0, 2.08, 0.22]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.008, 8, 36]} />
          <meshStandardMaterial color="#6b4a2a" roughness={0.85} />
        </mesh>
        {/* 小貝殼墜飾 */}
        {[-0.6, -0.2, 0.2, 0.6].map((a, i) => (
          <mesh key={`bead-${i}`} position={[Math.sin(a) * 0.14, -0.02, Math.cos(a) * 0.12]} castShadow>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshStandardMaterial color="#fff0d6" roughness={0.5} metalness={0.2} />
          </mesh>
        ))}
        {/* 中間大貝殼 */}
        <mesh position={[0, -0.05, 0.14]} rotation={[0.2, 0, 0]} castShadow>
          <sphereGeometry args={[0.03, 16, 10, 0, Math.PI, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffe0b8" roughness={0.55} />
        </mesh>
      </group>

      {/* ====== 肩膀關節球(Contrapposto 肩膀會傾斜,與臀相反)====== */}
      <group rotation={[0, 0, -0.04]}>
        {/* 脖子 */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.115, 0.135, 0.16, 20]} />
          <meshStandardMaterial color={skin} roughness={0.68} />
        </mesh>
        {/* 胸鎖乳突肌 */}
        <mesh position={[-0.055, 2.14, 0.08]} rotation={[0.2, 0, -0.35]} castShadow>
          <capsuleGeometry args={[0.018, 0.14, 4, 10]} />
          <meshStandardMaterial color={skinMid} roughness={0.78} />
        </mesh>
        <mesh position={[0.055, 2.14, 0.08]} rotation={[0.2, 0, 0.35]} castShadow>
          <capsuleGeometry args={[0.018, 0.14, 4, 10]} />
          <meshStandardMaterial color={skinMid} roughness={0.78} />
        </mesh>
        {/* 鎖骨 */}
        <mesh position={[-0.18, 2.03, 0.16]} rotation={[0, 0, -0.18]}>
          <capsuleGeometry args={[0.014, 0.24, 4, 10]} />
          <meshStandardMaterial color={skinMid} roughness={0.8} />
        </mesh>
        <mesh position={[0.18, 2.03, 0.16]} rotation={[0, 0, 0.18]}>
          <capsuleGeometry args={[0.014, 0.24, 4, 10]} />
          <meshStandardMaterial color={skinMid} roughness={0.8} />
        </mesh>
      </group>

      {/* ====== 左手臂(自然垂下,放口袋邊)====== */}
      <group position={[-0.4, 2.3, 0]}>
        {/* 上臂(用 tube 做出二頭膨)*/}
        <group rotation={[0, 0, 0.12]}>
          <mesh position={[0, -0.23, 0]} castShadow>
            <tubeGeometry args={[upperArmCurve, 24, 0.1, 14, false]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
          {/* 二頭肌膨起 */}
          <mesh position={[-0.02, -0.2, 0.06]} scale={[0.9, 1.3, 0.8]} castShadow>
            <sphereGeometry args={[0.09, 18, 14]} />
            <meshStandardMaterial color={skin} roughness={0.68} transparent opacity={0.65} />
          </mesh>
        </group>
        {/* 手肘 */}
        <mesh position={[-0.08, -0.48, 0]} castShadow>
          <sphereGeometry args={[0.09, 18, 14]} />
          <meshStandardMaterial color={skinMid} roughness={0.78} />
        </mesh>
        {/* 前臂 */}
        <group position={[-0.08, -0.48, 0]} rotation={[0.1, 0, 0.05]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <tubeGeometry args={[forearmCurve, 24, 0.08, 14, false]} />
            <meshStandardMaterial color={skin} roughness={0.72} />
          </mesh>
          {/* 手錶 */}
          <mesh position={[0, -0.38, 0.05]} rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.03, 24]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.38, 0.075]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.005, 24]} />
            <meshStandardMaterial color="#3a8ad4" metalness={0.8} roughness={0.15} emissive="#2a6aaa" emissiveIntensity={0.2} />
          </mesh>
          {/* 錶帶 */}
          <mesh position={[0, -0.38, -0.04]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.065, 0.015, 10, 24, Math.PI]} />
            <meshStandardMaterial color="#111111" roughness={0.7} />
          </mesh>
          {/* 手掌 */}
          <mesh position={[0.04, -0.48, 0.02]} rotation={[0, 0, 0.1]} scale={[1, 1.2, 0.55]} castShadow>
            <sphereGeometry args={[0.095, 18, 14]} />
            <meshStandardMaterial color={skin} roughness={0.75} />
          </mesh>
          {/* 手指(稍微彎曲)*/}
          {[-0.06, -0.03, 0, 0.03].map((dx, j) => (
            <group key={`L-f-${j}`} position={[0.04 + dx, -0.58, 0.02]} rotation={[0.3, 0, 0]}>
              <mesh castShadow>
                <capsuleGeometry args={[0.017, 0.07, 4, 8]} />
                <meshStandardMaterial color={skin} roughness={0.75} />
              </mesh>
              {/* 指關節 */}
              <mesh position={[0, -0.045, 0]} castShadow>
                <sphereGeometry args={[0.019, 10, 10]} />
                <meshStandardMaterial color={skinMid} roughness={0.78} />
              </mesh>
              <mesh position={[0, -0.08, 0.012]} rotation={[0.5, 0, 0]} castShadow>
                <capsuleGeometry args={[0.016, 0.05, 4, 8]} />
                <meshStandardMaterial color={skin} roughness={0.75} />
              </mesh>
            </group>
          ))}
          {/* 拇指 */}
          <mesh position={[-0.04, -0.5, 0.05]} rotation={[0.4, 0, 0.6]} castShadow>
            <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
            <meshStandardMaterial color={skin} roughness={0.75} />
          </mesh>
        </group>
      </group>

      {/* ====== 右手臂(揮手)====== */}
      <group position={[0.4, 2.35, 0]}>
        <group ref={upperArmRef} rotation={[0, 0, -1.15]}>
          {/* 上臂 */}
          <mesh position={[0, -0.23, 0]} castShadow>
            <tubeGeometry args={[upperArmCurve, 24, 0.1, 14, false]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
          <mesh position={[-0.02, -0.2, 0.06]} scale={[0.9, 1.3, 0.8]} castShadow>
            <sphereGeometry args={[0.09, 18, 14]} />
            <meshStandardMaterial color={skin} roughness={0.68} transparent opacity={0.65} />
          </mesh>
          {/* 衝浪刺青(音符波浪)*/}
          <mesh position={[-0.08, -0.2, 0.07]} rotation={[0.4, 0, 0]}>
            <torusGeometry args={[0.03, 0.005, 8, 16, Math.PI * 1.3]} />
            <meshStandardMaterial color="#2a3a6a" roughness={0.9} />
          </mesh>
          {/* 運動手環 */}
          <mesh position={[0, -0.4, 0]} rotation={[0.2, 0, 0]} castShadow>
            <torusGeometry args={[0.095, 0.014, 12, 24]} />
            <meshStandardMaterial color="#ff6a4a" roughness={0.5} />
          </mesh>
          {/* 手肘 */}
          <mesh position={[-0.04, -0.48, 0]} castShadow>
            <sphereGeometry args={[0.09, 18, 14]} />
            <meshStandardMaterial color={skinMid} roughness={0.78} />
          </mesh>
          {/* 前臂 + 手掌 + 手指 */}
          <group ref={forearmRef} position={[-0.04, -0.48, 0]} rotation={[0, 0, -0.5]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <tubeGeometry args={[forearmCurve, 24, 0.08, 14, false]} />
              <meshStandardMaterial color={skin} roughness={0.72} />
            </mesh>
            {/* 手掌 */}
            <mesh position={[0.03, -0.5, 0]} scale={[1, 1.2, 0.55]} castShadow>
              <sphereGeometry args={[0.1, 20, 16]} />
              <meshStandardMaterial color={skin} roughness={0.75} />
            </mesh>
            {/* 張開的 5 根手指(歡迎姿勢)*/}
            {[
              [-0.075, -0.65, 0.02, 0, 0, -0.3],
              [-0.04, -0.68, 0.01, 0, 0, -0.15],
              [0, -0.69, 0, 0, 0, 0],
              [0.04, -0.68, 0.01, 0, 0, 0.15],
              [0.075, -0.65, 0.02, 0, 0, 0.3]
            ].map((cfg, j) => (
              <group key={`R-f-${j}`} position={[cfg[0], cfg[1], cfg[2]]} rotation={[cfg[3], cfg[4], cfg[5]]}>
                <mesh castShadow>
                  <capsuleGeometry args={[0.017, 0.085, 4, 8]} />
                  <meshStandardMaterial color={skin} roughness={0.75} />
                </mesh>
                <mesh position={[0, -0.05, 0]} castShadow>
                  <sphereGeometry args={[0.018, 10, 10]} />
                  <meshStandardMaterial color={skinMid} roughness={0.78} />
                </mesh>
                <mesh position={[0, -0.1, 0]} castShadow>
                  <capsuleGeometry args={[0.016, 0.06, 4, 8]} />
                  <meshStandardMaterial color={skin} roughness={0.75} />
                </mesh>
              </group>
            ))}
            {/* 拇指 */}
            <mesh position={[-0.1, -0.55, 0.04]} rotation={[0, 0, -0.9]} castShadow>
              <capsuleGeometry args={[0.02, 0.09, 4, 8]} />
              <meshStandardMaterial color={skin} roughness={0.75} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ====== 頭部 ====== */}
      <group ref={headRef} position={[0, 2.4, 0]}>
        {/* 頭(蛋形偏長)*/}
        <mesh scale={[1, 1.18, 1.05]} castShadow>
          <sphereGeometry args={[0.24, 36, 36]} />
          <meshStandardMaterial color={skin} roughness={0.58} />
        </mesh>

        {/* 下顎線 */}
        <mesh position={[0, -0.14, 0.04]} scale={[0.95, 0.55, 1]} castShadow>
          <sphereGeometry args={[0.22, 28, 28]} />
          <meshStandardMaterial color={skin} roughness={0.62} />
        </mesh>
        {/* 下頷角(左右兩點強化方形感)*/}
        <mesh position={[-0.16, -0.1, 0.02]} scale={[0.7, 0.8, 0.7]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
        <mesh position={[0.16, -0.1, 0.02]} scale={[0.7, 0.8, 0.7]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
        {/* 下巴 */}
        <mesh position={[0, -0.22, 0.1]} scale={[1, 0.6, 1]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={skin} roughness={0.62} />
        </mesh>
        {/* 下巴中溝 */}
        <mesh position={[0, -0.22, 0.17]}>
          <sphereGeometry args={[0.015, 10, 10]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.4} />
        </mesh>

        {/* 顴骨 */}
        <mesh position={[-0.18, 0.0, 0.12]} scale={[1, 0.7, 0.7]} castShadow>
          <sphereGeometry args={[0.06, 14, 14]} />
          <meshStandardMaterial color={skin} roughness={0.58} />
        </mesh>
        <mesh position={[0.18, 0.0, 0.12]} scale={[1, 0.7, 0.7]} castShadow>
          <sphereGeometry args={[0.06, 14, 14]} />
          <meshStandardMaterial color={skin} roughness={0.58} />
        </mesh>

        {/* 眉骨(突出)*/}
        <mesh position={[0, 0.08, 0.17]} scale={[2.3, 0.4, 0.9]} castShadow>
          <sphereGeometry args={[0.07, 14, 14]} />
          <meshStandardMaterial color={skin} roughness={0.55} />
        </mesh>

        {/* 耳朵(耳廓 + 凹陷)*/}
        <group position={[-0.24, -0.02, -0.02]} rotation={[0, -0.3, 0]}>
          <mesh scale={[0.35, 1, 0.65]} castShadow>
            <sphereGeometry args={[0.075, 18, 18]} />
            <meshStandardMaterial color={skin} roughness={0.68} />
          </mesh>
          <mesh position={[0.02, 0, 0.02]} scale={[0.25, 0.75, 0.4]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color={skinDeep} roughness={0.8} transparent opacity={0.6} />
          </mesh>
        </group>
        <group position={[0.24, -0.02, -0.02]} rotation={[0, 0.3, 0]}>
          <mesh scale={[0.35, 1, 0.65]} castShadow>
            <sphereGeometry args={[0.075, 18, 18]} />
            <meshStandardMaterial color={skin} roughness={0.68} />
          </mesh>
          <mesh position={[-0.02, 0, 0.02]} scale={[0.25, 0.75, 0.4]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color={skinDeep} roughness={0.8} transparent opacity={0.6} />
          </mesh>
        </group>

        {/* ====== 頭髮(抓髮造型,多錐疊出)====== */}
        <group position={[0, 0.04, 0]}>
          {/* 底層 */}
          <mesh scale={[1.05, 0.85, 1.08]} castShadow>
            <sphereGeometry args={[0.245, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
            <meshStandardMaterial color={hair} roughness={0.92} />
          </mesh>
          {/* 抓起的髮束 - 多個方向不同的錐 */}
          {[
            [-0.12, 0.13, 0.02, 0.3, 0.2, -0.35, 1.5],
            [-0.04, 0.17, 0.08, 0.2, 0, -0.1, 1.3],
            [0.06, 0.16, 0.1, 0.15, 0.1, 0.15, 1.4],
            [0.14, 0.14, 0.04, 0.25, -0.2, 0.4, 1.5],
            [0.18, 0.1, -0.06, 0.2, -0.3, 0.6, 1.2],
            [-0.18, 0.1, -0.06, 0.2, 0.3, -0.6, 1.2],
            [0, 0.2, -0.04, 0, 0, 0, 1.6],
            [-0.1, 0.14, -0.14, 0.1, 0.3, -0.2, 1.0]
          ].map(([x, y, z, rx, ry, rz, scale], i) => (
            <group key={`hair-${i}`} position={[x, y, z]} rotation={[rx, ry, rz]}>
              <mesh castShadow>
                <coneGeometry args={[0.05, 0.15 * scale, 8]} />
                <meshStandardMaterial color={hair} roughness={0.92} />
              </mesh>
              {/* 髮束高光 */}
              <mesh position={[0.015, 0.02, 0.02]} castShadow>
                <coneGeometry args={[0.015, 0.12 * scale, 6]} />
                <meshStandardMaterial color={hairHighlight} roughness={0.85} />
              </mesh>
            </group>
          ))}
          {/* 後腦勺 */}
          <mesh position={[0, 0.04, -0.08]} scale={[1, 0.9, 1.15]} castShadow>
            <sphereGeometry args={[0.24, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={hair} roughness={0.92} />
          </mesh>
          {/* 鬢角 */}
          <mesh position={[-0.21, -0.04, 0.02]} scale={[0.3, 1, 0.6]} rotation={[0, 0, 0.1]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
          <mesh position={[0.21, -0.04, 0.02]} scale={[0.3, 1, 0.6]} rotation={[0, 0, -0.1]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
        </group>

        {/* 眉毛(厚實弓形)*/}
        <mesh position={[-0.09, 0.075, 0.21]} rotation={[0, 0, 0.1]} scale={[1.2, 0.8, 0.8]} castShadow>
          <sphereGeometry args={[0.028, 12, 10]} />
          <meshStandardMaterial color={hair} roughness={0.9} />
        </mesh>
        <mesh position={[0.09, 0.075, 0.21]} rotation={[0, 0, -0.1]} scale={[1.2, 0.8, 0.8]} castShadow>
          <sphereGeometry args={[0.028, 12, 10]} />
          <meshStandardMaterial color={hair} roughness={0.9} />
        </mesh>

        {/* ====== 墨鏡(真正的眼鏡結構)====== */}
        <group position={[0, 0.005, 0.2]}>
          {/* 左鏡片 */}
          <mesh position={[-0.09, 0, 0]} rotation={[0, -0.08, 0]}>
            <sphereGeometry args={[0.065, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#0b1420"
              metalness={0.9}
              roughness={0.08}
              transparent
              opacity={0.92}
              emissive="#1a3050"
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* 左鏡框 */}
          <mesh position={[-0.09, 0, 0]} rotation={[0, -0.08, 0]}>
            <torusGeometry args={[0.065, 0.008, 10, 32]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* 右鏡片 */}
          <mesh position={[0.09, 0, 0]} rotation={[0, 0.08, 0]}>
            <sphereGeometry args={[0.065, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#0b1420"
              metalness={0.9}
              roughness={0.08}
              transparent
              opacity={0.92}
              emissive="#1a3050"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[0.09, 0, 0]} rotation={[0, 0.08, 0]}>
            <torusGeometry args={[0.065, 0.008, 10, 32]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* 鼻橋 */}
          <mesh position={[0, 0.015, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.025, 0.006, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* 鏡腳 */}
          <mesh position={[-0.15, 0.01, -0.1]} rotation={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0.15, 0.01, -0.1]} rotation={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* 鏡片反光(漸層白條)*/}
          <mesh position={[-0.1, 0.03, 0.04]} rotation={[0, -0.1, -0.5]}>
            <planeGeometry args={[0.04, 0.015]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
          </mesh>
          <mesh position={[0.08, 0.03, 0.04]} rotation={[0, 0.1, -0.5]}>
            <planeGeometry args={[0.04, 0.015]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
          </mesh>
        </group>

        {/* 鼻子 */}
        <group position={[0, -0.02, 0.2]}>
          {/* 鼻樑 */}
          <mesh scale={[0.5, 1.6, 1]} castShadow>
            <sphereGeometry args={[0.035, 14, 14]} />
            <meshStandardMaterial color={skin} roughness={0.65} />
          </mesh>
          {/* 鼻頭 */}
          <mesh position={[0, -0.05, 0.04]} scale={[1, 0.7, 1]} castShadow>
            <sphereGeometry args={[0.032, 14, 14]} />
            <meshStandardMaterial color={skin} roughness={0.65} />
          </mesh>
          {/* 鼻翼 */}
          <mesh position={[-0.025, -0.05, 0.025]} scale={[0.8, 0.8, 0.8]} castShadow>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshStandardMaterial color={skin} roughness={0.68} />
          </mesh>
          <mesh position={[0.025, -0.05, 0.025]} scale={[0.8, 0.8, 0.8]} castShadow>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshStandardMaterial color={skin} roughness={0.68} />
          </mesh>
          {/* 鼻孔陰影 */}
          <mesh position={[-0.017, -0.07, 0.035]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color={skinDeep} />
          </mesh>
          <mesh position={[0.017, -0.07, 0.035]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color={skinDeep} />
          </mesh>
        </group>

        {/* 人中 */}
        <mesh position={[0, -0.12, 0.22]}>
          <capsuleGeometry args={[0.003, 0.03, 4, 8]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.4} />
        </mesh>

        {/* 嘴巴(上下唇分開 + 微笑)*/}
        <group position={[0, -0.155, 0.2]} rotation={[0.15, 0, 0]}>
          {/* 上唇 */}
          <mesh position={[0, 0.008, 0]} castShadow>
            <torusGeometry args={[0.042, 0.011, 10, 20, Math.PI]} />
            <meshStandardMaterial color="#b35350" roughness={0.6} />
          </mesh>
          {/* 下唇(較飽滿)*/}
          <mesh position={[0, -0.012, 0]} rotation={[Math.PI, 0, 0]} castShadow>
            <torusGeometry args={[0.04, 0.015, 10, 20, Math.PI]} />
            <meshStandardMaterial color="#b85a57" roughness={0.55} />
          </mesh>
          {/* 牙齒閃光 */}
          <mesh position={[0, -0.002, 0.008]}>
            <boxGeometry args={[0.06, 0.011, 0.004]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.025, -0.002, 0.009]}>
            <boxGeometry args={[0.004, 0.007, 0.002]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* 嘴角上揚點 */}
          <mesh position={[-0.045, 0.004, 0.005]}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshStandardMaterial color={skinDeep} />
          </mesh>
          <mesh position={[0.045, 0.004, 0.005]}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshStandardMaterial color={skinDeep} />
          </mesh>
        </group>

        {/* 腮紅(日曬感)*/}
        <mesh position={[-0.18, -0.04, 0.18]}>
          <circleGeometry args={[0.045, 16]} />
          <meshBasicMaterial color="#e88e78" transparent opacity={0.35} />
        </mesh>
        <mesh position={[0.18, -0.04, 0.18]}>
          <circleGeometry args={[0.045, 16]} />
          <meshBasicMaterial color="#e88e78" transparent opacity={0.35} />
        </mesh>

        {/* 小酒窩(微笑時)*/}
        <mesh position={[-0.13, -0.15, 0.18]}>
          <circleGeometry args={[0.008, 10]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.13, -0.15, 0.18]}>
          <circleGeometry args={[0.008, 10]} />
          <meshStandardMaterial color={skinDeep} transparent opacity={0.5} />
        </mesh>

        {/* 下巴鬍渣(幾顆小點)*/}
        {[
          [-0.07, -0.21, 0.19],
          [-0.03, -0.22, 0.2],
          [0.03, -0.22, 0.2],
          [0.07, -0.21, 0.19],
          [-0.05, -0.19, 0.2],
          [0.05, -0.19, 0.2]
        ].map((p, i) => (
          <mesh key={`stubble-${i}`} position={p}>
            <sphereGeometry args={[0.003, 6, 6]} />
            <meshStandardMaterial color={hair} />
          </mesh>
        ))}
      </group>

      {/* ====== 木牌(手上掛著「WELCOME」)====== */}
      <group ref={signRef} position={[1.12, 1.1, 0.1]}>
        {/* 繩子 */}
        <mesh position={[-0.05, 0.28, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.004, 0.004, 0.35, 8]} />
          <meshStandardMaterial color="#c99d6a" roughness={0.9} />
        </mesh>
        <mesh position={[0.05, 0.28, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.004, 0.004, 0.35, 8]} />
          <meshStandardMaterial color="#c99d6a" roughness={0.9} />
        </mesh>
        {/* 木牌主體 */}
        <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.24, 0.04]} />
          <meshStandardMaterial color="#c28a54" roughness={0.92} />
        </mesh>
        {/* 木牌邊框 */}
        <mesh position={[0, 0.05, 0.022]}>
          <boxGeometry args={[0.38, 0.2, 0.005]} />
          <meshStandardMaterial color="#f1d8a4" roughness={0.75} />
        </mesh>
        {/* 刻字區塊(象徵 WELCOME 的色塊)*/}
        <mesh position={[-0.1, 0.08, 0.027]}>
          <boxGeometry args={[0.05, 0.04, 0.002]} />
          <meshStandardMaterial color="#6b4323" roughness={0.9} />
        </mesh>
        <mesh position={[-0.03, 0.08, 0.027]}>
          <boxGeometry args={[0.05, 0.04, 0.002]} />
          <meshStandardMaterial color="#6b4323" roughness={0.9} />
        </mesh>
        <mesh position={[0.04, 0.08, 0.027]}>
          <boxGeometry args={[0.05, 0.04, 0.002]} />
          <meshStandardMaterial color="#6b4323" roughness={0.9} />
        </mesh>
        <mesh position={[0.11, 0.08, 0.027]}>
          <boxGeometry args={[0.05, 0.04, 0.002]} />
          <meshStandardMaterial color="#6b4323" roughness={0.9} />
        </mesh>
        {/* 愛心(標誌)*/}
        <mesh position={[0, 0.01, 0.027]} scale={[1, 0.9, 0.3]}>
          <sphereGeometry args={[0.035, 20, 16]} />
          <meshStandardMaterial color="#e85c52" roughness={0.5} emissive={active ? '#e85c52' : '#000000'} emissiveIntensity={active ? 0.3 : 0} />
        </mesh>
        {/* 木紋 */}
        <mesh position={[0, 0.12, 0.022]}>
          <boxGeometry args={[0.38, 0.003, 0.003]} />
          <meshStandardMaterial color="#8c5a2e" roughness={0.95} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, -0.02, 0.022]}>
          <boxGeometry args={[0.38, 0.003, 0.003]} />
          <meshStandardMaterial color="#8c5a2e" roughness={0.95} transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  )
}

/* ============================================================
   2. ScrollMap —— 3D 古地圖卷軸(重新打造)
   - 真正的卷軸形狀:兩端捲起、中間展開的弧面(用 ShapeGeometry 或 TubeGeometry)
   - 路線用 TubeGeometry + CatmullRomCurve3 做出彎曲的航線
   - 島嶼用不規則的多邊形塊
   - 加入羅盤玫瑰圖、海怪裝飾、破損邊緣
   - 立體 X 標記、航線虛線、海浪符號
============================================================ */

function ScrollMap({ active, color }) {
  const paperRef = useRef()
  const compassRef = useRef()
  const pinRef = useRef()
  const shipRef = useRef()

  // 航線曲線
  const routeCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.8, 0, 0.08),
      new THREE.Vector3(-0.45, 0.15, 0.08),
      new THREE.Vector3(-0.1, -0.05, 0.08),
      new THREE.Vector3(0.25, 0.1, 0.08),
      new THREE.Vector3(0.6, -0.1, 0.08),
      new THREE.Vector3(0.85, 0.05, 0.08)
    ])
  }, [])

  // 紙張弧形剖面(模擬卷軸微微捲起)
  const paperShape = useMemo(() => {
    const shape = new THREE.Shape()
    const w = 1.05
    const h = 0.62
    shape.moveTo(-w, -h)
    shape.quadraticCurveTo(-w - 0.02, 0, -w, h)
    shape.lineTo(w, h)
    shape.quadraticCurveTo(w + 0.02, 0, w, -h)
    shape.lineTo(-w, -h)
    return shape
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (paperRef.current) {
      paperRef.current.rotation.x = active ? Math.sin(t * 2.2) * 0.025 : 0
      paperRef.current.position.y = 1.05 + (active ? Math.sin(t * 3) * 0.015 : 0)
    }
    if (compassRef.current) {
      compassRef.current.rotation.z += active ? 0.025 : 0.008
    }
    if (pinRef.current) {
      pinRef.current.position.y = 1.22 + (active ? Math.abs(Math.sin(t * 4)) * 0.05 : 0)
    }
    if (shipRef.current) {
      // 船沿著航線移動
      const u = (Math.sin(t * 0.4) * 0.5 + 0.5)
      const point = routeCurve.getPoint(u)
      const tangent = routeCurve.getTangent(u)
      shipRef.current.position.set(point.x, 1.05 + point.y, 0.12)
      shipRef.current.rotation.z = Math.atan2(tangent.y, tangent.x)
      shipRef.current.rotation.x = active ? Math.sin(t * 6) * 0.1 : Math.sin(t * 2) * 0.03
    }
  })

  const parchment = '#f0dfa8'
  const parchmentShade = '#e0c97f'
  const ink = '#6b4523'

  return (
    <group rotation={[-0.12, 0.15, 0]} scale={1.1}>
      {/* === 底座 === */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.88, 1.0, 0.16, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.58}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.24 : 0}
        />
      </mesh>
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.78, 0.88, 0.04, 48]} />
        <meshStandardMaterial color="#d4a547" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* === 左卷軸(上下兩個圓柱組成看似捲起的紙卷)=== */}
      <group position={[-1.08, 1.05, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.4, 32]} />
          <meshStandardMaterial color={parchment} roughness={0.95} />
        </mesh>
        {/* 外層捲起陰影 */}
        <mesh>
          <cylinderGeometry args={[0.155, 0.155, 1.42, 32, 1, true]} />
          <meshStandardMaterial color={parchmentShade} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
        {/* 木製捲軸桿 */}
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.6, 16]} />
          <meshStandardMaterial color="#6b4a2a" roughness={0.85} />
        </mesh>
        {/* 金屬端帽上 */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.1, 16]} />
          <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* 金屬端帽下 */}
        <mesh position={[0, -0.82, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.1, 16]} />
          <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.9, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* === 右卷軸 === */}
      <group position={[1.08, 1.05, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.4, 32]} />
          <meshStandardMaterial color={parchment} roughness={0.95} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.155, 0.155, 1.42, 32, 1, true]} />
          <meshStandardMaterial color={parchmentShade} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.6, 16]} />
          <meshStandardMaterial color="#6b4a2a" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.1, 16]} />
          <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.82, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.1, 16]} />
          <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.9, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* === 主紙張(弧形展開)=== */}
      <group ref={paperRef} position={[0, 1.05, 0]}>
        <mesh castShadow receiveShadow>
          <extrudeGeometry args={[paperShape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.01, bevelSegments: 4 }]} />
          <meshStandardMaterial
            color={parchment}
            roughness={0.96}
            emissive={active ? color : '#000000'}
            emissiveIntensity={active ? 0.12 : 0}
          />
        </mesh>

        {/* 紙張焦黃汙漬(邊緣)*/}
        <mesh position={[-0.85, 0.5, 0.025]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color={parchmentShade} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.78, -0.48, 0.025]}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial color={parchmentShade} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.3, 0.52, 0.025]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color={parchmentShade} transparent opacity={0.4} />
        </mesh>

        {/* 航線(tube geometry)*/}
        <mesh>
          <tubeGeometry args={[routeCurve, 60, 0.012, 8, false]} />
          <meshStandardMaterial color={ink} roughness={0.9} />
        </mesh>
        {/* 航線虛線點 */}
        {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((u, i) => {
          const p = routeCurve.getPoint(u)
          return (
            <mesh key={`dash-${i}`} position={[p.x, p.y, p.z + 0.015]}>
              <circleGeometry args={[0.02, 12]} />
              <meshBasicMaterial color="#8a5a36" />
            </mesh>
          )
        })}

        {/* === 島嶼(不規則多邊形)=== */}
        {/* 大島 */}
        <group position={[-0.55, -0.28, 0.045]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.22, 0.03, 8]} />
            <meshStandardMaterial color="#c9a670" roughness={0.95} />
          </mesh>
          {/* 椰子樹 */}
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.012, 0.08, 8]} />
            <meshStandardMaterial color="#6b4a2a" />
          </mesh>
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#3d7a3d" roughness={0.9} />
          </mesh>
        </group>

        {/* 小島 */}
        <group position={[0.65, 0.3, 0.045]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.13, 0.025, 7]} />
            <meshStandardMaterial color="#c9a670" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.03, 0]} castShadow>
            <coneGeometry args={[0.05, 0.09, 6]} />
            <meshStandardMaterial color="#9a7b4f" roughness={0.9} />
          </mesh>
        </group>

        {/* 中島 */}
        <group position={[0.1, 0.25, 0.045]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.09, 0.022, 6]} />
            <meshStandardMaterial color="#c9a670" roughness={0.95} />
          </mesh>
        </group>

        {/* === 海浪符號 === */}
        {[
          [-0.2, 0.45], [0.4, -0.35], [-0.75, 0.15], [0.85, -0.15]
        ].map((p, i) => (
          <group key={`wave-${i}`} position={[p[0], p[1], 0.045]}>
            <mesh>
              <torusGeometry args={[0.04, 0.005, 6, 12, Math.PI]} />
              <meshBasicMaterial color="#2d6ba5" />
            </mesh>
            <mesh position={[0.05, 0, 0]}>
              <torusGeometry args={[0.035, 0.005, 6, 12, Math.PI]} />
              <meshBasicMaterial color="#2d6ba5" />
            </mesh>
          </group>
        ))}

        {/* === X 寶藏標記 === */}
        <group position={[-0.55, -0.24, 0.08]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.1, 0.018, 0.008]} />
            <meshStandardMaterial color="#b8342c" roughness={0.6} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.1, 0.018, 0.008]} />
            <meshStandardMaterial color="#b8342c" roughness={0.6} />
          </mesh>
        </group>

        {/* === 裝飾用羅盤玫瑰圖(紙張右上)=== */}
        <group position={[0.7, 0.4, 0.045]} ref={compassRef}>
          <mesh>
            <circleGeometry args={[0.1, 32]} />
            <meshBasicMaterial color={parchmentShade} transparent opacity={0.3} />
          </mesh>
          {/* 8 個方向 */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
            const angle = (i / 8) * Math.PI * 2
            const isMain = i % 2 === 0
            return (
              <mesh
                key={`rose-${i}`}
                rotation={[0, 0, angle]}
              >
                <coneGeometry args={[isMain ? 0.018 : 0.01, isMain ? 0.09 : 0.05, 3]} />
                <meshStandardMaterial
                  color={isMain ? ink : '#a07a50'}
                  roughness={0.8}
                />
              </mesh>
            )
          })}
          <mesh>
            <circleGeometry args={[0.012, 16]} />
            <meshStandardMaterial color="#d4a547" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>

        {/* === 海怪裝飾(左下角小章魚)=== */}
        <group position={[-0.78, -0.4, 0.045]}>
          <mesh>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#8a5a36" transparent opacity={0.7} />
          </mesh>
          {[0, 1, 2, 3, 4].map(i => {
            const angle = (i / 5) * Math.PI * 2
            return (
              <mesh
                key={`tent-${i}`}
                position={[Math.cos(angle) * 0.05, Math.sin(angle) * 0.05, 0]}
                rotation={[0, 0, angle]}
              >
                <boxGeometry args={[0.04, 0.008, 0.004]} />
                <meshBasicMaterial color="#8a5a36" transparent opacity={0.7} />
              </mesh>
            )
          })}
        </group>

        {/* === 小船沿航線移動 === */}
        <group ref={shipRef}>
          {/* 船身 */}
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.03, 0.02]} />
            <meshStandardMaterial color="#8a5a36" roughness={0.8} />
          </mesh>
          {/* 桅杆 */}
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.003, 0.003, 0.08, 8]} />
            <meshStandardMaterial color="#6b4a2a" />
          </mesh>
          {/* 帆 */}
          <mesh position={[0, 0.06, 0.005]} castShadow>
            <planeGeometry args={[0.05, 0.05]} />
            <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* === 浮動的圖釘(標記當前位置)=== */}
      <group ref={pinRef} position={[-0.55, 1.22, 0.15]}>
        <mesh castShadow>
          <sphereGeometry args={[0.07, 20, 20]} />
          <meshStandardMaterial
            color="#e8584f"
            metalness={0.3}
            roughness={0.35}
            emissive="#e8584f"
            emissiveIntensity={active ? 0.5 : 0.2}
          />
        </mesh>
        <mesh position={[0, 0.04, 0]} castShadow>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.12, 0]} castShadow>
          <coneGeometry args={[0.035, 0.18, 16]} />
          <meshStandardMaterial color="#c44640" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

/* ============================================================
   3. WizardStatue —— 3D 老魔法師(重新打造)
   - 用 Lathe 做出真正的長袍垂墜感
   - 鬍子用多層錐體波浪狀排列
   - 水晶球漂浮 + 內部粒子感 + 外圍能量環
   - 法帽加上星星月亮繡飾
   - 袖口、領口加入金邊鑲嵌
   - 手部握住法杖,法杖頂端水晶發光
============================================================ */

function WizardStatue({ active, color }) {
  const wandRef = useRef()
  const runeRef1 = useRef()
  const runeRef2 = useRef()
  const crystalRef = useRef()
  const beardRef = useRef()
  const hatStarRef = useRef()
  const sparklesRef = useRef()

  // 長袍輪廓(車削)
  const robeProfile = useMemo(() => {
    const pts = []
    pts.push(new THREE.Vector2(0, 0))
    pts.push(new THREE.Vector2(0.85, 0))        // 底部展開
    pts.push(new THREE.Vector2(0.78, 0.15))
    pts.push(new THREE.Vector2(0.68, 0.35))
    pts.push(new THREE.Vector2(0.56, 0.6))
    pts.push(new THREE.Vector2(0.44, 0.85))
    pts.push(new THREE.Vector2(0.34, 1.1))      // 腰
    pts.push(new THREE.Vector2(0.30, 1.3))
    pts.push(new THREE.Vector2(0.28, 1.5))      // 胸
    pts.push(new THREE.Vector2(0.22, 1.65))     // 領口
    return pts
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (wandRef.current) {
      wandRef.current.rotation.z = active ? Math.sin(t * 3.8) * 0.2 + 0.15 : 0.12
      wandRef.current.rotation.x = active ? Math.sin(t * 2.4) * 0.06 : 0
    }
    if (runeRef1.current) {
      runeRef1.current.rotation.z += active ? 0.03 : 0.01
      runeRef1.current.rotation.x = Math.PI / 2
    }
    if (runeRef2.current) {
      runeRef2.current.rotation.y += active ? 0.04 : 0.015
    }
    if (crystalRef.current) {
      crystalRef.current.position.y = 2.0 + (active ? Math.sin(t * 4) * 0.05 : Math.sin(t * 1.5) * 0.02)
      crystalRef.current.rotation.y += 0.02
      crystalRef.current.rotation.x += 0.015
    }
    if (beardRef.current) {
      beardRef.current.rotation.z = active ? Math.sin(t * 1.6) * 0.04 : Math.sin(t * 0.8) * 0.015
    }
    if (hatStarRef.current) {
      hatStarRef.current.rotation.z += active ? 0.06 : 0.02
    }
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y += 0.01
    }
  })

  const skin = '#e8c5a8'
  const robeColor = '#3d2a8c'
  const robeLight = '#6a52c7'
  const gold = '#e8b547'
  const whiteBeard = '#ecedf2'

  return (
    <group scale={0.95}>
      {/* === 基座 === */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.86, 0.2, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.58}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.28 : 0}
        />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.64, 0.72, 0.03, 48]} />
        <meshStandardMaterial color={gold} metalness={0.8} roughness={0.25} />
      </mesh>
      {/* 基座符文環 */}
      {[0, 1, 2, 3].map(i => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={`base-rune-${i}`}
            position={[Math.cos(angle) * 0.55, 0.21, Math.sin(angle) * 0.55]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <circleGeometry args={[0.05, 6]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={active ? 0.8 : 0.3}
            />
          </mesh>
        )
      })}

      {/* === 長袍(車削出垂墜感)=== */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <latheGeometry args={[robeProfile, 32]} />
        <meshStandardMaterial color={robeColor} roughness={0.75} />
      </mesh>

      {/* 長袍垂褶(用細長 cone 疊出)*/}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
        const angle = (i / 8) * Math.PI * 2
        const r = 0.82
        return (
          <mesh
            key={`fold-${i}`}
            position={[Math.cos(angle) * r, 0.22, Math.sin(angle) * r]}
            rotation={[0, -angle, 0]}
            castShadow
          >
            <coneGeometry args={[0.04, 0.85, 4]} />
            <meshStandardMaterial color={robeColor} roughness={0.8} />
          </mesh>
        )
      })}

      {/* === 長袍底邊金色鑲邊 === */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <torusGeometry args={[0.83, 0.025, 12, 48]} />
        <meshStandardMaterial color={gold} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* 星星裝飾在袍子底部 */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i / 6) * Math.PI * 2 + 0.3
        return (
          <group
            key={`star-${i}`}
            position={[Math.cos(angle) * 0.72, 0.45, Math.sin(angle) * 0.72]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <Star scale={0.06} color={gold} emissive />
          </group>
        )
      })}

      {/* === 腰帶 === */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <torusGeometry args={[0.32, 0.04, 16, 36]} />
        <meshStandardMaterial color={gold} metalness={0.8} roughness={0.25} />
      </mesh>
      {/* 腰帶寶石 */}
      <mesh position={[0, 1.2, 0.32]} castShadow>
        <octahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.9 : 0.4}
          metalness={0.3}
          roughness={0.15}
        />
      </mesh>

      {/* === 內袍(胸口露出一小塊)=== */}
      <mesh position={[0, 1.55, 0.2]} castShadow>
        <boxGeometry args={[0.18, 0.24, 0.03]} />
        <meshStandardMaterial color={robeLight} roughness={0.6} />
      </mesh>

      {/* === 袖子(寬大的魔法師袖)=== */}
      {/* 左袖 */}
      <mesh position={[-0.46, 1.5, 0]} rotation={[0, 0, 0.4]} castShadow>
        <coneGeometry args={[0.18, 0.7, 16]} />
        <meshStandardMaterial color={robeColor} roughness={0.75} />
      </mesh>
      {/* 左袖金邊 */}
      <mesh position={[-0.61, 1.28, 0]} rotation={[0, 0, 0.4]} castShadow>
        <torusGeometry args={[0.13, 0.022, 12, 24]} />
        <meshStandardMaterial color={gold} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* 左手 */}
      <mesh position={[-0.65, 1.22, 0]} castShadow>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>

      {/* 右袖(舉起握法杖)*/}
      <group ref={wandRef} position={[0.38, 1.7, 0]}>
        <mesh position={[0.1, -0.1, 0]} rotation={[0, 0, -0.4]} castShadow>
          <coneGeometry args={[0.18, 0.7, 16]} />
          <meshStandardMaterial color={robeColor} roughness={0.75} />
        </mesh>
        {/* 右袖金邊 */}
        <mesh position={[0.25, -0.34, 0]} rotation={[0, 0, -0.4]} castShadow>
          <torusGeometry args={[0.13, 0.022, 12, 24]} />
          <meshStandardMaterial color={gold} metalness={0.85} roughness={0.2} />
        </mesh>
        {/* 右手 */}
        <mesh position={[0.28, -0.4, 0]} castShadow>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>

        {/* 法杖 */}
        <group position={[0.28, -0.4, 0]}>
          <mesh position={[0.05, 0.5, 0]} rotation={[0, 0, -0.08]} castShadow>
            <cylinderGeometry args={[0.028, 0.035, 1.8, 16]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.92} />
          </mesh>
          {/* 法杖螺旋刻紋 */}
          {[0.1, 0.4, 0.7, 1.0].map((y, i) => (
            <mesh key={`carve-${i}`} position={[0.05, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.033, 0.005, 8, 20]} />
              <meshStandardMaterial color={gold} metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          {/* 法杖頂端爪子握水晶 */}
          <mesh position={[0.0, 1.35, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.04, 0.1, 12]} />
            <meshStandardMaterial color={gold} metalness={0.85} roughness={0.2} />
          </mesh>
          {/* 三個爪子 */}
          {[0, 1, 2].map(i => {
            const a = (i / 3) * Math.PI * 2
            return (
              <mesh
                key={`claw-${i}`}
                position={[0.0 + Math.cos(a) * 0.06, 1.4, Math.sin(a) * 0.06]}
                rotation={[0, a, -0.4]}
                castShadow
              >
                <coneGeometry args={[0.015, 0.1, 8]} />
                <meshStandardMaterial color={gold} metalness={0.85} roughness={0.2} />
              </mesh>
            )
          })}

          {/* 法杖頂水晶 */}
          <group ref={crystalRef} position={[0, 2.0, 0]}>
            <mesh castShadow>
              <octahedronGeometry args={[0.13, 0]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={active ? 1.3 : 0.6}
                metalness={0.2}
                roughness={0.1}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* 水晶光暈 */}
            <mesh>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={active ? 0.25 : 0.1}
              />
            </mesh>
            {/* 水晶外層光環 */}
            <mesh ref={runeRef1}>
              <torusGeometry args={[0.28, 0.008, 8, 36]} />
              <meshBasicMaterial color={color} transparent opacity={active ? 0.9 : 0.4} />
            </mesh>
            <mesh ref={runeRef2}>
              <torusGeometry args={[0.35, 0.005, 8, 36]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={active ? 0.6 : 0.2} />
            </mesh>
            {/* 水晶周圍粒子 */}
            <group ref={sparklesRef}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                const a = (i / 8) * Math.PI * 2
                const r = 0.3
                return (
                  <mesh
                    key={`sparkle-${i}`}
                    position={[Math.cos(a) * r, Math.sin(a) * r * 0.5, Math.sin(a) * r]}
                  >
                    <sphereGeometry args={[0.012, 8, 8]} />
                    <meshBasicMaterial color={color} />
                  </mesh>
                )
              })}
            </group>
          </group>
        </group>
      </group>

      {/* === 脖子 === */}
      <mesh position={[0, 1.78, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.12, 16]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>

      {/* === 鬍子(波浪狀多層)=== */}
      <group ref={beardRef} position={[0, 1.78, 0.12]}>
        {/* 主鬍子體 */}
        <mesh castShadow>
          <coneGeometry args={[0.22, 0.55, 16]} />
          <meshStandardMaterial color={whiteBeard} roughness={0.9} />
        </mesh>
        {/* 波浪鬍鬚束 */}
        <mesh position={[-0.12, -0.12, 0.04]} rotation={[0.1, 0, 0.2]} castShadow>
          <coneGeometry args={[0.08, 0.3, 12]} />
          <meshStandardMaterial color="#f8f9fd" roughness={0.9} />
        </mesh>
        <mesh position={[0.12, -0.12, 0.04]} rotation={[0.1, 0, -0.2]} castShadow>
          <coneGeometry args={[0.08, 0.3, 12]} />
          <meshStandardMaterial color="#f8f9fd" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.28, 0.02]} castShadow>
          <coneGeometry args={[0.07, 0.22, 12]} />
          <meshStandardMaterial color="#f8f9fd" roughness={0.9} />
        </mesh>
        {/* 小胡子 */}
        <mesh position={[-0.08, 0.16, 0.18]} rotation={[0, 0, 0.3]} scale={[1, 0.6, 0.8]} castShadow>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={whiteBeard} roughness={0.9} />
        </mesh>
        <mesh position={[0.08, 0.16, 0.18]} rotation={[0, 0, -0.3]} scale={[1, 0.6, 0.8]} castShadow>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={whiteBeard} roughness={0.9} />
        </mesh>
      </group>

      {/* === 頭部 === */}
      <group position={[0, 2.05, 0]}>
        {/* 頭 */}
        <mesh scale={[1, 1.12, 1.05]} castShadow>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial color={skin} roughness={0.72} />
        </mesh>

        {/* 眉毛(濃密白色)*/}
        <mesh position={[-0.1, 0.06, 0.2]} rotation={[0, 0, 0.24]} scale={[1.2, 1, 1]} castShadow>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color={whiteBeard} roughness={0.9} />
        </mesh>
        <mesh position={[0.1, 0.06, 0.2]} rotation={[0, 0, -0.24]} scale={[1.2, 1, 1]} castShadow>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color={whiteBeard} roughness={0.9} />
        </mesh>

        {/* 眼睛 */}
        <mesh position={[-0.09, -0.01, 0.21]} castShadow>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color="#1a1a2a" />
        </mesh>
        <mesh position={[0.09, -0.01, 0.21]} castShadow>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color="#1a1a2a" />
        </mesh>
        {/* 眼睛高光 */}
        <mesh position={[-0.086, 0.0, 0.23]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.094, 0.0, 0.23]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* 鼻子 */}
        <mesh position={[0, -0.04, 0.24]} scale={[0.6, 1.4, 1]} castShadow>
          <coneGeometry args={[0.035, 0.14, 8]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>

        {/* 臉頰紅潤 */}
        <mesh position={[-0.15, -0.06, 0.18]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#e89a8a" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0.15, -0.06, 0.18]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#e89a8a" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* === 法師帽 === */}
      {/* 帽簷 */}
      <mesh position={[0, 2.22, 0]} castShadow>
        <torusGeometry args={[0.3, 0.04, 12, 32]} />
        <meshStandardMaterial color={robeColor} roughness={0.75} />
      </mesh>
      <mesh position={[0, 2.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 32]} />
        <meshStandardMaterial color={robeColor} roughness={0.75} />
      </mesh>

      {/* 帽身(彎曲的錐形)- 用多段組成 */}
      <group position={[0, 2.24, 0]}>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.05]} castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.35, 20]} />
          <meshStandardMaterial color={robeColor} roughness={0.72} />
        </mesh>
        <mesh position={[0.04, 0.5, 0]} rotation={[0, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.12, 0.18, 0.3, 20]} />
          <meshStandardMaterial color={robeColor} roughness={0.72} />
        </mesh>
        <mesh position={[0.1, 0.75, 0]} rotation={[0, 0, 0.35]} castShadow>
          <coneGeometry args={[0.1, 0.25, 16]} />
          <meshStandardMaterial color={robeColor} roughness={0.72} />
        </mesh>
      </group>

      {/* 帽子金邊 */}
      <mesh position={[0, 2.28, 0]} castShadow>
        <torusGeometry args={[0.24, 0.022, 12, 32]} />
        <meshStandardMaterial color={gold} metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 帽上星星與月亮 */}
      <group ref={hatStarRef} position={[0.01, 2.55, 0.22]}>
        <Star scale={0.06} color={gold} emissive />
      </group>
      {/* 彎月 */}
      <group position={[-0.08, 2.45, 0.22]} rotation={[0, 0, 0.3]}>
        <mesh castShadow>
          <ringGeometry args={[0.04, 0.065, 16, 1, 0, Math.PI * 1.3]} />
          <meshStandardMaterial color={gold} metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* 帽尖小球(垂墜)*/}
      <mesh position={[0.22, 2.9, 0]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={gold} metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  )
}

// 5 角星 helper
function Star({ scale = 1, color = '#ffd700', emissive = false }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const spikes = 5
    const outerRadius = 1
    const innerRadius = 0.45
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      if (i === 0) s.moveTo(x, y)
      else s.lineTo(x, y)
    }
    s.closePath()
    return s
  }, [])

  return (
    <mesh scale={scale} castShadow>
      <extrudeGeometry args={[shape, { depth: 0.15, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.03, bevelSegments: 2 }]} />
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.3}
        emissive={emissive ? color : '#000000'}
        emissiveIntensity={emissive ? 0.4 : 0}
      />
    </mesh>
  )
}
