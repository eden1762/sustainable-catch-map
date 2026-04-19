import React, { Suspense, useRef, useState } from 'react'
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
  RoundedBox,
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
    hoverText: '歡迎來到永續漁獲地圖，跟著導遊開始探索。'
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
    hoverText: '揮動魔法棒，召喚永續標籤、符文與 AR 體驗。'
  }
]

export default function HeroScene() {
  const [activeKey, setActiveKey] = useState('guide')
  const activeItem = MENU_ITEMS.find(item => item.key === activeKey) || MENU_ITEMS[0]

  return (
    <div className="hero-shell">
      <Canvas camera={{ position: [0, 1.7, 8], fov: 55 }} dpr={[1, 2]}>
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
      <ambientLight intensity={1.2} />
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
      <meshStandardMaterial
        color="#f8f3df"
        roughness={0.98}
        metalness={0.02}
        bumpScale={0.02}
      />
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

      <Billboard position={[0, 1.9, 0]} follow>
        <Text fontSize={0.28} color="#183b56" anchorX="center" anchorY="middle" maxWidth={3.2}>
          {item.title}
        </Text>
      </Billboard>

      {(hovered || active) && (
        <Html position={[0, 2.45, 0]} center distanceFactor={10}>
          <div className="floating-tooltip">{item.hoverText}</div>
        </Html>
      )}
    </group>
  )
}

function GuideStatue({ active, color }) {
  const headRef = useRef()
  const waveArmRef = useRef()
  const chestRef = useRef()
  const boardRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (headRef.current) {
      headRef.current.rotation.y = active ? Math.sin(t * 2.3) * 0.18 : Math.sin(t * 1.2) * 0.05
      headRef.current.rotation.z = active ? Math.sin(t * 1.8) * 0.04 : 0
    }
    if (waveArmRef.current) {
      waveArmRef.current.rotation.z = active ? Math.sin(t * 4.8) * 0.42 - 0.65 : -0.35
      waveArmRef.current.rotation.x = active ? Math.sin(t * 3.2) * 0.08 : 0
    }
    if (chestRef.current) {
      chestRef.current.position.y = 1.15 + Math.sin(t * 1.6) * 0.015
    }
    if (boardRef.current) {
      boardRef.current.rotation.z = active ? -0.08 + Math.sin(t * 1.8) * 0.03 : -0.08
    }
  })

  return (
    <group>
      {/* 底座 */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.82, 0.16, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.08}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.22 : 0}
        />
      </mesh>

      {/* 衝浪板 / 導覽板 */}
      <group ref={boardRef} position={[-0.68, 1.05, -0.12]} rotation={[0, 0.06, -0.08]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.17, 1.45, 8, 16]} />
          <meshStandardMaterial color="#fff8f0" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <capsuleGeometry args={[0.145, 1.2, 8, 16]} />
          <meshStandardMaterial color="#66d7d0" roughness={0.4} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.35, 0.024]}>
          <boxGeometry args={[0.1, 0.18, 0.02]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.02, 0.024]}>
          <ringGeometry args={[0.06, 0.09, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* 腳 */}
      <mesh position={[-0.16, 0.48, 0.03]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.8, 18]} />
        <meshStandardMaterial color="#f3c7a9" roughness={0.62} />
      </mesh>
      <mesh position={[0.16, 0.48, 0.03]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.8, 18]} />
        <meshStandardMaterial color="#f3c7a9" roughness={0.62} />
      </mesh>

      {/* 拖鞋 */}
      <mesh position={[-0.16, 0.05, 0.09]} castShadow>
        <capsuleGeometry args={[0.07, 0.18, 6, 10]} />
        <meshStandardMaterial color="#2c698d" roughness={0.5} />
      </mesh>
      <mesh position={[0.16, 0.05, 0.09]} castShadow>
        <capsuleGeometry args={[0.07, 0.18, 6, 10]} />
        <meshStandardMaterial color="#2c698d" roughness={0.5} />
      </mesh>

      {/* 泳褲 */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.4, 0.38, 24]} />
        <meshStandardMaterial color="#ff7b7b" roughness={0.48} metalness={0.03} />
      </mesh>
      <mesh position={[0, 0.74, 0.18]}>
        <boxGeometry args={[0.24, 0.08, 0.04]} />
        <meshStandardMaterial color="#ffd96b" roughness={0.42} />
      </mesh>

      {/* 軀幹 */}
      <group ref={chestRef}>
        <mesh position={[0, 1.18, 0]} castShadow>
          <capsuleGeometry args={[0.28, 0.72, 10, 18]} />
          <meshStandardMaterial color="#f2c7a8" roughness={0.58} />
        </mesh>

        {/* 肩膀 */}
        <mesh position={[-0.34, 1.38, 0]} castShadow>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshStandardMaterial color="#f2c7a8" roughness={0.58} />
        </mesh>
        <mesh position={[0.34, 1.38, 0]} castShadow>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshStandardMaterial color="#f2c7a8" roughness={0.58} />
        </mesh>

        {/* 腹肌線條 */}
        {[0.98, 1.11, 1.24].map((y, i) => (
          <mesh key={i} position={[0, y, 0.24]}>
            <boxGeometry args={[0.2, 0.02, 0.02]} />
            <meshStandardMaterial color="#d8ab91" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* 左手：叉腰 */}
      <group position={[-0.42, 1.14, 0.02]} rotation={[0, 0, 0.72]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.075, 0.56, 8, 12]} />
          <meshStandardMaterial color="#f2c7a8" roughness={0.58} />
        </mesh>
      </group>

      {/* 右手：揮手 */}
      <group ref={waveArmRef} position={[0.44, 1.34, 0.02]} rotation={[0, 0, -0.38]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.075, 0.72, 8, 12]} />
          <meshStandardMaterial color="#f2c7a8" roughness={0.58} />
        </mesh>
      </group>

      {/* 頭 */}
      <group ref={headRef} position={[0, 1.92, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.27, 28, 28]} />
          <meshStandardMaterial color="#f2c7a8" roughness={0.54} />
        </mesh>

        {/* 頭髮 */}
        <mesh position={[0, 0.1, -0.02]} castShadow>
          <sphereGeometry args={[0.285, 28, 28]} />
          <meshStandardMaterial color="#523724" roughness={0.75} />
        </mesh>
        <mesh position={[0, -0.03, 0.18]}>
          <sphereGeometry args={[0.24, 28, 28]} />
          <meshStandardMaterial color="#f2c7a8" roughness={0.54} />
        </mesh>

        {/* 墨鏡 */}
        <mesh position={[-0.09, 0.01, 0.23]}>
          <sphereGeometry args={[0.055, 18, 18]} />
          <meshStandardMaterial color="#18222f" metalness={0.35} roughness={0.22} />
        </mesh>
        <mesh position={[0.09, 0.01, 0.23]}>
          <sphereGeometry args={[0.055, 18, 18]} />
          <meshStandardMaterial color="#18222f" metalness={0.35} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.01, 0.235]}>
          <boxGeometry args={[0.06, 0.015, 0.01]} />
          <meshStandardMaterial color="#18222f" />
        </mesh>

        {/* 微笑 */}
        <mesh position={[0, -0.1, 0.24]} rotation={[0.25, 0, 0]}>
          <torusGeometry args={[0.055, 0.01, 8, 24, Math.PI]} />
          <meshBasicMaterial color="#9b4f4f" />
        </mesh>
      </group>
    </group>
  )
}

function ScrollMap({ active, color }) {
  const mapRef = useRef()
  const pinRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mapRef.current) {
      mapRef.current.scale.x = active ? 1.18 + Math.sin(t * 3.4) * 0.025 : 0.98
      mapRef.current.rotation.x = active ? Math.sin(t * 1.5) * 0.03 : 0
    }
    if (pinRef.current) {
      pinRef.current.position.y = 0.95 + Math.sin(t * 3.2) * 0.05
      pinRef.current.rotation.y += 0.03
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = active ? 0.28 + Math.sin(t * 3) * 0.06 : 0.12
      glowRef.current.rotation.z += 0.01
    }
  })

  return (
    <group>
      {/* 光環 */}
      <mesh ref={glowRef} position={[0, 0.8, -0.02]} rotation={[0, 0, 0]}>
        <ringGeometry args={[1.0, 1.36, 42]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>

      {/* 底座 */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.88, 0.14, 32]} />
        <meshStandardMaterial color="#caa56f" roughness={0.65} />
      </mesh>

      {/* 上下木軸 */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 2.25, 24]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#7a5334" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 2.25, 24]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#7a5334" roughness={0.82} />
      </mesh>

      {/* 卷軸兩端 */}
      <mesh position={[-1.04, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.07, 14, 28]} />
        <meshStandardMaterial color="#8c6239" roughness={0.8} />
      </mesh>
      <mesh position={[1.04, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.07, 14, 28]} />
        <meshStandardMaterial color="#8c6239" roughness={0.8} />
      </mesh>

      {/* 紙面 */}
      <group ref={mapRef} position={[0, 0.82, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[2.02, 1.12, 0.06]} />
          <meshStandardMaterial
            color="#f5e4b8"
            roughness={0.9}
            emissive={active ? color : '#000000'}
            emissiveIntensity={active ? 0.12 : 0}
          />
        </mesh>

        {/* 紙張內框 */}
        <mesh position={[0, 0, 0.031]}>
          <boxGeometry args={[1.8, 0.9, 0.01]} />
          <meshStandardMaterial color="#ead7a3" roughness={0.88} />
        </mesh>

        {/* 地圖路線 */}
        <mesh position={[-0.45, 0.15, 0.04]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.03, 0.34, 6, 10]} />
          <meshBasicMaterial color="#a16a3c" />
        </mesh>
        <mesh position={[-0.12, 0.02, 0.04]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.03, 0.38, 6, 10]} />
          <meshBasicMaterial color="#a16a3c" />
        </mesh>
        <mesh position={[0.22, -0.12, 0.04]} rotation={[0, 0, 0.35]}>
          <capsuleGeometry args={[0.03, 0.36, 6, 10]} />
          <meshBasicMaterial color="#a16a3c" />
        </mesh>

        {/* 地圖點位 */}
        {[
          [-0.68, 0.28],
          [-0.28, 0.08],
          [0.1, -0.08],
          [0.48, -0.22]
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.05]}>
            <circleGeometry args={[0.05, 18]} />
            <meshBasicMaterial color={i === 3 ? '#c54d4d' : '#8f6d42'} />
          </mesh>
        ))}

        {/* 指南針 */}
        <group position={[0.62, 0.26, 0.05]}>
          <mesh>
            <ringGeometry args={[0.12, 0.16, 24]} />
            <meshBasicMaterial color="#8c6239" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.02, 0.22, 0.01]} />
            <meshBasicMaterial color="#8c6239" />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.02, 0.22, 0.01]} />
            <meshBasicMaterial color="#8c6239" />
          </mesh>
        </group>
      </group>

      {/* 浮動定位圖釘 */}
      <group ref={pinRef} position={[0.18, 0.95, 0.18]}>
        <mesh castShadow>
          <coneGeometry args={[0.12, 0.22, 18]} />
          <meshStandardMaterial color="#d94f4f" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.1, 18, 18]} />
          <meshStandardMaterial color="#ff6f6f" metalness={0.08} roughness={0.38} />
        </mesh>
      </group>
    </group>
  )
}

function WizardStatue({ active, color }) {
  const staffRef = useRef()
  const runeRef = useRef()
  const hatRef = useRef()
  const orbRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (staffRef.current) {
      staffRef.current.rotation.z = active ? 0.2 + Math.sin(t * 4.5) * 0.18 : 0.18
    }
    if (runeRef.current) {
      runeRef.current.rotation.y += 0.035
      runeRef.current.rotation.z += 0.01
      runeRef.current.material.opacity = active ? 0.78 : 0.22
    }
    if (hatRef.current) {
      hatRef.current.rotation.z = active ? Math.sin(t * 1.4) * 0.03 : 0
    }
    if (orbRef.current) {
      orbRef.current.position.y = 2.55 + Math.sin(t * 2.5) * 0.08
      orbRef.current.scale.setScalar(active ? 1.06 + Math.sin(t * 5) * 0.04 : 1)
    }
  })

  return (
    <group>
      {/* 底座 */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.76, 0.86, 0.16, 32]} />
        <meshStandardMaterial color="#5a4a8d" roughness={0.45} />
      </mesh>

      {/* 袍子 */}
      <mesh position={[0, 0.96, 0]} castShadow>
        <coneGeometry args={[0.58, 1.72, 20]} />
        <meshStandardMaterial color="#5d48b5" roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <torusGeometry args={[0.42, 0.08, 12, 32]} />
        <meshStandardMaterial color="#3e3278" roughness={0.55} />
      </mesh>

      {/* 手臂 */}
      <group position={[-0.42, 1.2, 0]} rotation={[0, 0, 0.52]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.07, 0.52, 8, 10]} />
          <meshStandardMaterial color="#6d5cc2" roughness={0.5} />
        </mesh>
      </group>
      <group position={[0.42, 1.34, 0]} rotation={[0, 0, -0.32]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.07, 0.58, 8, 10]} />
          <meshStandardMaterial color="#6d5cc2" roughness={0.5} />
        </mesh>
      </group>

      {/* 頭 */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.25, 26, 26]} />
        <meshStandardMaterial color="#e8cdb9" roughness={0.58} />
      </mesh>

      {/* 鬍子 */}
      <mesh position={[0, 1.78, 0.18]} castShadow>
        <coneGeometry args={[0.2, 0.48, 18]} />
        <meshStandardMaterial color="#edf0f8" roughness={0.72} />
      </mesh>
      <mesh position={[0, 1.89, 0.2]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color="#edf0f8" roughness={0.72} />
      </mesh>

      {/* 帽子 */}
      <group ref={hatRef} position={[0, 2.28, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.34, 0.9, 18]} />
          <meshStandardMaterial color="#4b3998" roughness={0.44} />
        </mesh>
        <mesh position={[0, -0.34, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.28, 0.05, 10, 32]} />
          <meshStandardMaterial color="#6f5bd1" roughness={0.42} />
        </mesh>
      </group>

      {/* 法杖 */}
      <group ref={staffRef} position={[0.64, 1.5, 0]} rotation={[0, 0, 0.18]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.055, 1.18, 12]} />
          <meshStandardMaterial color="#9e7b4d" roughness={0.84} />
        </mesh>
        <mesh position={[0, 0.68, 0]} castShadow>
          <octahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial
            color="#8ee7ff"
            emissive={active ? '#8ee7ff' : '#23404d'}
            emissiveIntensity={active ? 1.15 : 0.2}
            metalness={0.16}
            roughness={0.18}
          />
        </mesh>
      </group>

      {/* 魔法球 */}
      <mesh ref={orbRef} position={[0.86, 2.55, 0]} castShadow>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 1.2 : 0.35}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* 符文環 */}
      <mesh ref={runeRef} position={[0.92, 2.28, 0]}>
        <torusGeometry args={[0.3, 0.035, 14, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.92, 2.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.012, 10, 28]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={active ? 0.45 : 0.14} />
      </mesh>
    </group>
  )
}
