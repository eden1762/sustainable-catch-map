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
   1. GuideStatue —— 泳褲帥哥導遊(重新打造)
   - 用 LatheGeometry 做出軀幹、腿部的人體曲線
   - 真正的手臂分段(上臂/前臂/手掌)帶關節旋轉
   - 髮型用多層 CapsuleGeometry 疊出蓬鬆感
   - 臉部加入鼻子、耳朵、口腔深度
   - 泳褲加入椰子樹印花細節
============================================================ */

function GuideStatue({ active, color }) {
  const upperArmRef = useRef()
  const forearmRef = useRef()
  const headRef = useRef()
  const hipRef = useRef()
  const signRef = useRef()

  // 軀幹輪廓 - 用 Lathe 車削出肌肉曲線
  const torsoProfile = useMemo(() => {
    const pts = []
    pts.push(new THREE.Vector2(0.0, 0.0))      // 腰部底
    pts.push(new THREE.Vector2(0.26, 0.02))    // 髖
    pts.push(new THREE.Vector2(0.30, 0.18))    // 腰
    pts.push(new THREE.Vector2(0.34, 0.42))    // 腹
    pts.push(new THREE.Vector2(0.40, 0.62))    // 胸下
    pts.push(new THREE.Vector2(0.46, 0.78))    // 胸
    pts.push(new THREE.Vector2(0.38, 0.94))    // 鎖骨
    pts.push(new THREE.Vector2(0.20, 1.02))    // 脖子底
    pts.push(new THREE.Vector2(0.14, 1.08))    // 脖子
    return pts
  }, [])

  // 腿部輪廓
  const legProfile = useMemo(() => {
    const pts = []
    pts.push(new THREE.Vector2(0.0, 0.0))
    pts.push(new THREE.Vector2(0.12, 0.02))    // 腳踝
    pts.push(new THREE.Vector2(0.13, 0.12))
    pts.push(new THREE.Vector2(0.15, 0.28))    // 小腿肚
    pts.push(new THREE.Vector2(0.11, 0.42))    // 膝蓋
    pts.push(new THREE.Vector2(0.13, 0.52))
    pts.push(new THREE.Vector2(0.17, 0.70))    // 大腿
    pts.push(new THREE.Vector2(0.18, 0.82))
    return pts
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (upperArmRef.current) {
      upperArmRef.current.rotation.z = active ? Math.sin(t * 3.2) * 0.25 - 1.4 : -1.2
    }
    if (forearmRef.current) {
      forearmRef.current.rotation.z = active ? Math.sin(t * 3.2 + 0.5) * 0.35 - 0.6 : -0.4
    }
    if (headRef.current) {
      headRef.current.rotation.y = active ? Math.sin(t * 2.0) * 0.18 : Math.sin(t * 0.6) * 0.05
      headRef.current.rotation.z = active ? Math.sin(t * 1.8) * 0.04 : 0
    }
    if (hipRef.current) {
      hipRef.current.rotation.y = active ? Math.sin(t * 2.4) * 0.06 : 0
    }
    if (signRef.current) {
      signRef.current.rotation.z = active ? Math.sin(t * 2.4) * 0.08 - 0.06 : -0.06
      signRef.current.rotation.y = active ? Math.sin(t * 1.8) * 0.12 : 0
    }
  })

  const skin = '#f5ccab'
  const skinShadow = '#d8a785'
  const hair = '#2a1a0f'

  return (
    <group scale={0.95}>
      {/* === 基座:沙丘狀帶貝殼 === */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.68, 0.82, 0.18, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.25 : 0}
        />
      </mesh>
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.58, 0.68, 0.06, 48]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} opacity={0.7} transparent />
      </mesh>
      {/* 貝殼裝飾 */}
      <mesh position={[0.48, 0.16, 0.15]} rotation={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.07, 12, 8, 0, Math.PI]} />
        <meshStandardMaterial color="#ffd7c2" roughness={0.7} />
      </mesh>

      {/* === 腿部(用 Lathe 車削)=== */}
      <group position={[-0.16, 0.22, 0]}>
        <mesh castShadow>
          <latheGeometry args={[legProfile, 24]} />
          <meshStandardMaterial color={skin} roughness={0.72} />
        </mesh>
      </group>
      <group position={[0.16, 0.22, 0]}>
        <mesh castShadow>
          <latheGeometry args={[legProfile, 24]} />
          <meshStandardMaterial color={skin} roughness={0.72} />
        </mesh>
      </group>

      {/* 膝蓋高光 */}
      <mesh position={[-0.16, 0.62, 0.11]} castShadow>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={skinShadow} roughness={0.85} />
      </mesh>
      <mesh position={[0.16, 0.62, 0.11]} castShadow>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={skinShadow} roughness={0.85} />
      </mesh>

      {/* === 夾腳拖 === */}
      {[-0.16, 0.16].map((x, i) => (
        <group key={`flipflop-${i}`} position={[x, 0.2, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.11, 0.13, 0.04, 20]} />
            <meshStandardMaterial color="#2b4d5a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.03, 0.06]} rotation={[0, 0, 0]} castShadow>
            <torusGeometry args={[0.03, 0.012, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#f7c948" roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* === 泳褲(用 Lathe + 裝飾)=== */}
      <group ref={hipRef} position={[0, 0.82, 0]}>
        <mesh castShadow>
          <latheGeometry args={[
            [
              new THREE.Vector2(0.0, 0.0),
              new THREE.Vector2(0.28, 0.0),
              new THREE.Vector2(0.34, 0.08),
              new THREE.Vector2(0.36, 0.22),
              new THREE.Vector2(0.34, 0.32),
              new THREE.Vector2(0.30, 0.38),
              new THREE.Vector2(0.0, 0.38)
            ], 28
          ]} />
          <meshStandardMaterial color="#0f6bbd" roughness={0.55} />
        </mesh>
        {/* 泳褲腰帶 */}
        <mesh position={[0, 0.34, 0]} castShadow>
          <torusGeometry args={[0.33, 0.025, 12, 36]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        {/* 腰帶繩結 */}
        <mesh position={[0, 0.34, 0.32]} castShadow>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <mesh position={[-0.05, 0.28, 0.3]} rotation={[0.3, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.15, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <mesh position={[0.05, 0.28, 0.3]} rotation={[0.3, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.15, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* 椰子樹印花(小圓點象徵)*/}
        {[[0.18, 0.15, 0.3], [-0.2, 0.1, 0.28], [0.1, 0.2, -0.3], [-0.15, 0.05, -0.28]].map((p, i) => (
          <mesh key={`dot-${i}`} position={p} castShadow>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#ffd54d" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* === 軀幹(車削曲線)=== */}
      <group position={[0, 1.2, 0]}>
        <mesh castShadow>
          <latheGeometry args={[torsoProfile, 32]} />
          <meshStandardMaterial color={skin} roughness={0.68} />
        </mesh>

        {/* 胸肌分線(用細長 capsule)*/}
        <mesh position={[0, 0.78, 0.36]} rotation={[0, 0, 0]} castShadow>
          <capsuleGeometry args={[0.008, 0.2, 4, 8]} />
          <meshStandardMaterial color={skinShadow} roughness={0.9} />
        </mesh>
        {/* 胸肌陰影 */}
        <mesh position={[-0.14, 0.76, 0.36]} castShadow>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color={skinShadow} roughness={0.9} transparent opacity={0.35} />
        </mesh>
        <mesh position={[0.14, 0.76, 0.36]} castShadow>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color={skinShadow} roughness={0.9} transparent opacity={0.35} />
        </mesh>

        {/* 腹部中線 */}
        <mesh position={[0, 0.4, 0.34]} castShadow>
          <capsuleGeometry args={[0.006, 0.32, 4, 8]} />
          <meshStandardMaterial color={skinShadow} roughness={0.9} />
        </mesh>
        {/* 腹肌(兩排四塊,柔和橢圓,非方塊)*/}
        {[
          [-0.09, 0.52], [0.09, 0.52],
          [-0.09, 0.38], [0.09, 0.38],
          [-0.09, 0.24], [0.09, 0.24]
        ].map(([x, y], i) => (
          <mesh key={`abs-${i}`} position={[x, y, 0.34]} scale={[1, 0.7, 1]} castShadow>
            <sphereGeometry args={[0.062, 14, 10]} />
            <meshStandardMaterial color={skin} roughness={0.72} />
          </mesh>
        ))}

        {/* 肚臍 */}
        <mesh position={[0, 0.12, 0.35]} castShadow>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color={skinShadow} roughness={0.9} />
        </mesh>
      </group>

      {/* === 肩膀 === */}
      <mesh position={[-0.42, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color={skin} roughness={0.68} />
      </mesh>
      <mesh position={[0.42, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color={skin} roughness={0.68} />
      </mesh>

      {/* === 左手臂(自然垂下)=== */}
      <group position={[-0.42, 2.0, 0]}>
        <mesh position={[-0.05, -0.32, 0]} rotation={[0, 0, 0.18]} castShadow>
          <capsuleGeometry args={[0.095, 0.42, 6, 14]} />
          <meshStandardMaterial color={skin} roughness={0.72} />
        </mesh>
        {/* 肘部 */}
        <mesh position={[-0.12, -0.56, 0]} castShadow>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color={skin} roughness={0.72} />
        </mesh>
        {/* 前臂 */}
        <mesh position={[-0.14, -0.82, 0.03]} rotation={[0.2, 0, 0.08]} castShadow>
          <capsuleGeometry args={[0.085, 0.4, 6, 14]} />
          <meshStandardMaterial color={skin} roughness={0.72} />
        </mesh>
        {/* 手 */}
        <mesh position={[-0.16, -1.06, 0.08]} scale={[1, 1.2, 0.7]} castShadow>
          <sphereGeometry args={[0.08, 16, 12]} />
          <meshStandardMaterial color={skin} roughness={0.75} />
        </mesh>
      </group>

      {/* === 右手臂(揮手歡迎)=== */}
      <group position={[0.42, 2.0, 0]}>
        <group ref={upperArmRef} rotation={[0, 0, -1.2]}>
          {/* 上臂 */}
          <mesh position={[0, -0.24, 0]} castShadow>
            <capsuleGeometry args={[0.095, 0.42, 6, 14]} />
            <meshStandardMaterial color={skin} roughness={0.72} />
          </mesh>
          {/* 肘 */}
          <mesh position={[0, -0.48, 0]} castShadow>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={skin} roughness={0.72} />
          </mesh>
          {/* 前臂 + 手 */}
          <group ref={forearmRef} position={[0, -0.48, 0]} rotation={[0, 0, -0.4]}>
            <mesh position={[0, -0.24, 0]} castShadow>
              <capsuleGeometry args={[0.085, 0.42, 6, 14]} />
              <meshStandardMaterial color={skin} roughness={0.72} />
            </mesh>
            {/* 手掌 */}
            <mesh position={[0, -0.52, 0]} scale={[0.9, 1.1, 0.5]} castShadow>
              <sphereGeometry args={[0.1, 18, 14]} />
              <meshStandardMaterial color={skin} roughness={0.75} />
            </mesh>
            {/* 手指(5根)*/}
            {[-0.06, -0.03, 0, 0.03, 0.06].map((dx, i) => (
              <mesh key={`finger-${i}`} position={[dx, -0.65, 0]} castShadow>
                <capsuleGeometry args={[0.018, 0.07, 4, 8]} />
                <meshStandardMaterial color={skin} roughness={0.75} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* === 脖子 === */}
      <mesh position={[0, 2.08, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.18, 20]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>

      {/* === 頭部 === */}
      <group ref={headRef} position={[0, 2.3, 0]}>
        {/* 頭 — 稍微蛋形 */}
        <mesh scale={[1, 1.15, 1.05]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color={skin} roughness={0.62} />
        </mesh>

        {/* 下顎線 */}
        <mesh position={[0, -0.14, 0.06]} scale={[0.92, 0.5, 0.92]} castShadow>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color={skin} roughness={0.65} />
        </mesh>

        {/* 耳朵 */}
        <mesh position={[-0.28, -0.02, 0]} rotation={[0, -0.3, 0]} scale={[0.4, 1, 0.6]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
        <mesh position={[0.28, -0.02, 0]} rotation={[0, 0.3, 0]} scale={[0.4, 1, 0.6]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>

        {/* 頭髮 — 多層次蓬鬆 */}
        <group position={[0, 0.05, 0]}>
          {/* 底層 */}
          <mesh scale={[1.06, 0.85, 1.06]} castShadow>
            <sphereGeometry args={[0.29, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={hair} roughness={0.95} />
          </mesh>
          {/* 劉海束 1 */}
          <mesh position={[-0.12, 0.08, 0.22]} rotation={[0.3, 0.2, -0.3]} scale={[0.6, 1.4, 0.4]} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={hair} roughness={0.95} />
          </mesh>
          {/* 劉海束 2 */}
          <mesh position={[0.06, 0.12, 0.23]} rotation={[0.2, -0.15, 0.4]} scale={[0.5, 1.2, 0.4]} castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color={hair} roughness={0.95} />
          </mesh>
          {/* 後腦勺蓬鬆 */}
          <mesh position={[0, 0.06, -0.08]} scale={[1, 0.9, 1.15]} castShadow>
            <sphereGeometry args={[0.28, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color={hair} roughness={0.95} />
          </mesh>
        </group>

        {/* 眉毛 */}
        <mesh position={[-0.1, 0.05, 0.24]} rotation={[0, 0, 0.12]} castShadow>
          <boxGeometry args={[0.08, 0.014, 0.02]} />
          <meshStandardMaterial color={hair} />
        </mesh>
        <mesh position={[0.1, 0.05, 0.24]} rotation={[0, 0, -0.12]} castShadow>
          <boxGeometry args={[0.08, 0.014, 0.02]} />
          <meshStandardMaterial color={hair} />
        </mesh>

        {/* 太陽眼鏡 — 飛行員款 */}
        <group position={[0, -0.02, 0.22]}>
          <mesh position={[-0.11, 0, 0]} rotation={[0, 0, 0]} castShadow>
            <torusGeometry args={[0.07, 0.01, 8, 24]} />
            <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[-0.11, 0, 0.005]} castShadow>
            <circleGeometry args={[0.068, 24]} />
            <meshStandardMaterial color="#0a1a26" metalness={0.5} roughness={0.1} transparent opacity={0.85} />
          </mesh>
          <mesh position={[0.11, 0, 0]} rotation={[0, 0, 0]} castShadow>
            <torusGeometry args={[0.07, 0.01, 8, 24]} />
            <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0.11, 0, 0.005]} castShadow>
            <circleGeometry args={[0.068, 24]} />
            <meshStandardMaterial color="#0a1a26" metalness={0.5} roughness={0.1} transparent opacity={0.85} />
          </mesh>
          {/* 鏡框橋 */}
          <mesh position={[0, 0.006, 0]} castShadow>
            <boxGeometry args={[0.08, 0.006, 0.008]} />
            <meshStandardMaterial color="#d4a547" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* 反光點 */}
          <mesh position={[-0.09, 0.02, 0.018]} castShadow>
            <circleGeometry args={[0.015, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.13, 0.02, 0.018]} castShadow>
            <circleGeometry args={[0.015, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* 鼻子 */}
        <mesh position={[0, -0.04, 0.28]} scale={[0.6, 1.2, 1]} castShadow>
          <coneGeometry args={[0.035, 0.12, 8]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.1, 0.3]} scale={[1, 0.6, 1]} castShadow>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>

        {/* 嘴巴 — 微笑 */}
        <mesh position={[0, -0.16, 0.26]} rotation={[0.15, 0, 0]} castShadow>
          <torusGeometry args={[0.05, 0.012, 10, 20, Math.PI]} />
          <meshStandardMaterial color="#b84742" roughness={0.6} />
        </mesh>
        {/* 牙齒閃光 */}
        <mesh position={[0, -0.18, 0.29]} castShadow>
          <boxGeometry args={[0.06, 0.01, 0.005]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* 腮紅 */}
        <mesh position={[-0.2, -0.08, 0.22]} castShadow>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#ffb5a8" transparent opacity={0.45} />
        </mesh>
        <mesh position={[0.2, -0.08, 0.22]} castShadow>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#ffb5a8" transparent opacity={0.45} />
        </mesh>
      </group>

      {/* === 手上舉的小旗幟 === */}
      <group ref={signRef} position={[1.05, 1.05, 0.12]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.02, 1.0, 12]} />
          <meshStandardMaterial color="#8a5a36" roughness={0.92} />
        </mesh>
        {/* 旗幟 */}
        <mesh position={[0.2, 0.75, 0]} rotation={[0, 0, 0]} castShadow>
          <planeGeometry args={[0.4, 0.26, 8, 4]} />
          <meshStandardMaterial
            color="#fff5cd"
            roughness={0.6}
            side={THREE.DoubleSide}
            emissive={active ? color : '#000000'}
            emissiveIntensity={active ? 0.2 : 0}
          />
        </mesh>
        {/* 旗幟上的愛心 */}
        <mesh position={[0.2, 0.76, 0.01]} castShadow>
          <circleGeometry args={[0.06, 20]} />
          <meshStandardMaterial color="#e8584f" roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* 旗桿頂小球 */}
        <mesh position={[0, 0.92, 0]} castShadow>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
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
