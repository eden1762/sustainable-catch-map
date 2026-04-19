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
  const armRef = useRef()
  const headRef = useRef()
  const signRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (armRef.current) {
      armRef.current.rotation.z = active ? Math.sin(t * 4) * 0.4 - 0.55 : -0.28
      armRef.current.rotation.x = active ? Math.sin(t * 2.5) * 0.08 : 0
    }
    if (headRef.current) {
      headRef.current.rotation.y = active ? Math.sin(t * 2.2) * 0.18 : 0
      headRef.current.rotation.z = active ? Math.sin(t * 1.8) * 0.03 : 0
    }
    if (signRef.current) {
      signRef.current.rotation.z = active ? Math.sin(t * 2.4) * 0.06 - 0.08 : -0.08
    }
  })

  return (
    <group>
      {/* pedestal */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.72, 0.22, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.28 : 0}
        />
      </mesh>

      {/* legs */}
      <mesh position={[-0.16, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.12, 0.78, 18]} />
        <meshStandardMaterial color="#f2c29e" roughness={0.72} />
      </mesh>
      <mesh position={[0.16, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.12, 0.78, 18]} />
        <meshStandardMaterial color="#f2c29e" roughness={0.72} />
      </mesh>

      {/* sandals */}
      <mesh position={[-0.16, 0.18, 0.07]} castShadow>
        <boxGeometry args={[0.22, 0.05, 0.34]} />
        <meshStandardMaterial color="#3f6d7a" roughness={0.8} />
      </mesh>
      <mesh position={[0.16, 0.18, 0.07]} castShadow>
        <boxGeometry args={[0.22, 0.05, 0.34]} />
        <meshStandardMaterial color="#3f6d7a" roughness={0.8} />
      </mesh>

      {/* swim trunks */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.34, 0.44, 24]} />
        <meshStandardMaterial color="#1677c8" roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.8, 0.18]} castShadow>
        <boxGeometry args={[0.22, 0.08, 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.45} />
      </mesh>

      {/* torso */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <capsuleGeometry args={[0.34, 0.72, 8, 16]} />
        <meshStandardMaterial color="#f2c29e" roughness={0.68} />
      </mesh>

      {/* chest / abs details */}
      <mesh position={[0, 1.4, 0.29]} castShadow>
        <boxGeometry args={[0.12, 0.36, 0.04]} />
        <meshStandardMaterial color="#dfae8c" roughness={0.85} />
      </mesh>
      <mesh position={[-0.11, 1.32, 0.28]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.03]} />
        <meshStandardMaterial color="#dfae8c" roughness={0.85} />
      </mesh>
      <mesh position={[0.11, 1.32, 0.28]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.03]} />
        <meshStandardMaterial color="#dfae8c" roughness={0.85} />
      </mesh>
      <mesh position={[-0.11, 1.18, 0.28]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.03]} />
        <meshStandardMaterial color="#dfae8c" roughness={0.85} />
      </mesh>
      <mesh position={[0.11, 1.18, 0.28]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.03]} />
        <meshStandardMaterial color="#dfae8c" roughness={0.85} />
      </mesh>

      {/* shoulders */}
      <mesh position={[-0.34, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color="#f2c29e" roughness={0.68} />
      </mesh>
      <mesh position={[0.34, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color="#f2c29e" roughness={0.68} />
      </mesh>

      {/* left arm */}
      <mesh position={[-0.48, 1.3, 0]} rotation={[0, 0, 0.52]} castShadow>
        <capsuleGeometry args={[0.08, 0.62, 6, 14]} />
        <meshStandardMaterial color="#f2c29e" roughness={0.72} />
      </mesh>

      {/* right arm waving */}
      <group ref={armRef} position={[0.46, 1.48, 0]}>
        <mesh position={[0.13, -0.18, 0]} rotation={[0, 0, -0.28]} castShadow>
          <capsuleGeometry args={[0.08, 0.68, 6, 14]} />
          <meshStandardMaterial color="#f2c29e" roughness={0.72} />
        </mesh>
      </group>

      {/* head */}
      <group ref={headRef} position={[0, 2.0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.28, 28, 28]} />
          <meshStandardMaterial color="#f2c29e" roughness={0.62} />
        </mesh>

        {/* hair */}
        <mesh position={[0, 0.08, -0.02]} castShadow>
          <sphereGeometry args={[0.285, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial color="#3a2718" roughness={0.95} />
        </mesh>

        {/* sunglasses */}
        <mesh position={[-0.08, 0.01, 0.22]} castShadow>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.25} roughness={0.2} />
        </mesh>
        <mesh position={[0.08, 0.01, 0.22]} castShadow>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.25} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.01, 0.22]} castShadow>
          <boxGeometry args={[0.06, 0.015, 0.015]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        {/* smile */}
        <mesh position={[0, -0.11, 0.25]} rotation={[0.2, 0, 0]} castShadow>
          <torusGeometry args={[0.055, 0.01, 10, 20, Math.PI]} />
          <meshStandardMaterial color="#a65a56" roughness={0.8} />
        </mesh>
      </group>

      {/* sign board */}
      <group ref={signRef} position={[-0.72, 1.35, -0.06]} rotation={[0, 0, -0.08]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.78, 12]} />
          <meshStandardMaterial color="#8a613d" roughness={0.92} />
        </mesh>
        <RoundedBox
          args={[0.46, 0.22, 0.06]}
          radius={0.03}
          smoothness={4}
          position={[0.04, 0.12, 0]}
          castShadow
        >
          <meshStandardMaterial color="#fff5cd" roughness={0.7} />
        </RoundedBox>
        <mesh position={[0.04, 0.12, 0.04]} castShadow>
          <boxGeometry args={[0.22, 0.04, 0.01]} />
          <meshStandardMaterial color={color} emissive={active ? color : '#000000'} emissiveIntensity={active ? 0.5 : 0} />
        </mesh>
      </group>
    </group>
  )
}

function ScrollMap({ active, color }) {
  const paperRef = useRef()
  const compassRef = useRef()
  const pinRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (paperRef.current) {
      paperRef.current.scale.x = active ? 1.08 + Math.sin(t * 4.5) * 0.02 : 1
      paperRef.current.rotation.x = active ? Math.sin(t * 2.6) * 0.03 : 0
    }
    if (compassRef.current) {
      compassRef.current.rotation.z += active ? 0.02 : 0.007
    }
    if (pinRef.current) {
      pinRef.current.position.y = 0.94 + (active ? Math.sin(t * 5) * 0.03 : 0)
    }
  })

  return (
    <group rotation={[-0.16, 0.2, 0]}>
      {/* base glow stand */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.95, 0.16, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.58}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.24 : 0}
        />
      </mesh>

      {/* bottom roller */}
      <mesh position={[0, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 2.25, 24]} />
        <meshStandardMaterial color="#7a5130" roughness={0.88} />
      </mesh>

      {/* top roller */}
      <mesh position={[0, 1.62, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 2.25, 24]} />
        <meshStandardMaterial color="#7a5130" roughness={0.88} />
      </mesh>

      {/* roller caps */}
      <mesh position={[-1.17, 1.62, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 16]} />
        <meshStandardMaterial color="#c4935f" metalness={0.2} roughness={0.45} />
      </mesh>
      <mesh position={[1.17, 1.62, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 16]} />
        <meshStandardMaterial color="#c4935f" metalness={0.2} roughness={0.45} />
      </mesh>
      <mesh position={[-1.17, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 16]} />
        <meshStandardMaterial color="#c4935f" metalness={0.2} roughness={0.45} />
      </mesh>
      <mesh position={[1.17, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 16]} />
        <meshStandardMaterial color="#c4935f" metalness={0.2} roughness={0.45} />
      </mesh>

      {/* parchment */}
      <group ref={paperRef} position={[0, 1.05, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.05, 1.18, 0.06]} />
          <meshStandardMaterial
            color="#f3e2b1"
            roughness={0.96}
            emissive={active ? color : '#000000'}
            emissiveIntensity={active ? 0.14 : 0}
          />
        </mesh>

        {/* curled edges */}
        <mesh position={[-1.02, 0, 0.03]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 1.18, 18]} />
          <meshStandardMaterial color="#ead39a" roughness={0.95} />
        </mesh>
        <mesh position={[1.02, 0, 0.03]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 1.18, 18]} />
          <meshStandardMaterial color="#ead39a" roughness={0.95} />
        </mesh>

        {/* map route lines */}
        <mesh position={[-0.48, 0.18, 0.04]} castShadow>
          <boxGeometry args={[0.48, 0.02, 0.01]} />
          <meshStandardMaterial color="#87633f" roughness={0.9} />
        </mesh>
        <mesh position={[-0.18, 0.02, 0.04]} rotation={[0, 0, -0.45]} castShadow>
          <boxGeometry args={[0.36, 0.02, 0.01]} />
          <meshStandardMaterial color="#87633f" roughness={0.9} />
        </mesh>
        <mesh position={[0.14, -0.12, 0.04]} rotation={[0, 0, 0.24]} castShadow>
          <boxGeometry args={[0.54, 0.02, 0.01]} />
          <meshStandardMaterial color="#87633f" roughness={0.9} />
        </mesh>

        {/* map markers */}
        <mesh position={[-0.65, 0.22, 0.05]} castShadow>
          <circleGeometry args={[0.05, 20]} />
          <meshStandardMaterial color="#b24e35" roughness={0.65} />
        </mesh>
        <mesh position={[0.22, -0.08, 0.05]} castShadow>
          <circleGeometry args={[0.05, 20]} />
          <meshStandardMaterial color="#b24e35" roughness={0.65} />
        </mesh>

        {/* island blobs */}
        <mesh position={[0.52, 0.2, 0.04]} castShadow>
          <sphereGeometry args={[0.13, 18, 18]} />
          <meshStandardMaterial color="#b99563" roughness={0.95} />
        </mesh>
        <mesh position={[0.68, 0.04, 0.04]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#b99563" roughness={0.95} />
        </mesh>
      </group>

      {/* compass */}
      <group ref={compassRef} position={[0.72, 1.52, 0.08]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 24]} />
          <meshStandardMaterial color="#d5b26f" metalness={0.35} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.03, 0]} castShadow>
          <coneGeometry args={[0.045, 0.12, 4]} />
          <meshStandardMaterial color="#964a36" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.03, 0]} rotation={[0, 0, Math.PI]} castShadow>
          <coneGeometry args={[0.045, 0.12, 4]} />
          <meshStandardMaterial color="#355a92" roughness={0.4} />
        </mesh>
      </group>

      {/* pin */}
      <group ref={pinRef} position={[-0.56, 0.94, 0.1]}>
        <mesh castShadow>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color={color} metalness={0.08} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.14, 0]} castShadow>
          <coneGeometry args={[0.035, 0.18, 12]} />
          <meshStandardMaterial color="#84553b" roughness={0.55} />
        </mesh>
      </group>
    </group>
  )
}

function WizardStatue({ active, color }) {
  const wandRef = useRef()
  const runeRef = useRef()
  const crystalRef = useRef()
  const beardRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (wandRef.current) {
      wandRef.current.rotation.z = active ? Math.sin(t * 4.6) * 0.24 + 0.32 : 0.24
      wandRef.current.rotation.x = active ? Math.sin(t * 2.2) * 0.05 : 0
    }

    if (runeRef.current) {
      runeRef.current.rotation.y += active ? 0.05 : 0.02
      runeRef.current.rotation.z += active ? 0.02 : 0.008
      runeRef.current.material.opacity = active ? 0.82 : 0.28
    }

    if (crystalRef.current) {
      crystalRef.current.position.y = 2.62 + (active ? Math.sin(t * 5) * 0.04 : 0)
      crystalRef.current.rotation.y += 0.03
    }

    if (beardRef.current) {
      beardRef.current.rotation.z = active ? Math.sin(t * 1.8) * 0.03 : 0
    }
  })

  return (
    <group>
      {/* pedestal */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.68, 0.8, 0.22, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          emissive={active ? color : '#000000'}
          emissiveIntensity={active ? 0.26 : 0}
        />
      </mesh>

      {/* outer robe */}
      <mesh position={[0, 1.06, 0]} castShadow>
        <coneGeometry args={[0.58, 1.74, 20]} />
        <meshStandardMaterial color="#4f3aa3" roughness={0.58} />
      </mesh>

      {/* inner robe */}
      <mesh position={[0, 1.0, 0.14]} castShadow>
        <coneGeometry args={[0.28, 1.2, 16]} />
        <meshStandardMaterial color="#7f6ad6" roughness={0.5} />
      </mesh>

      {/* sleeves */}
      <mesh position={[-0.42, 1.36, 0]} rotation={[0, 0, 0.5]} castShadow>
        <capsuleGeometry args={[0.09, 0.54, 6, 14]} />
        <meshStandardMaterial color="#5e49bd" roughness={0.58} />
      </mesh>
      <group ref={wandRef} position={[0.42, 1.5, 0]}>
        <mesh position={[0.12, -0.1, 0]} rotation={[0, 0, 0.28]} castShadow>
          <capsuleGeometry args={[0.09, 0.6, 6, 14]} />
          <meshStandardMaterial color="#5e49bd" roughness={0.58} />
        </mesh>
      </group>

      {/* hands */}
      <mesh position={[-0.65, 1.18, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#e7d2c4" roughness={0.7} />
      </mesh>
      <mesh position={[0.72, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#e7d2c4" roughness={0.7} />
      </mesh>

      {/* head */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color="#e7d2c4" roughness={0.72} />
      </mesh>

      {/* beard */}
      <group ref={beardRef} position={[0, 1.8, 0.16]}>
        <mesh castShadow>
          <coneGeometry args={[0.16, 0.46, 14]} />
          <meshStandardMaterial color="#d7d8e2" roughness={0.88} />
        </mesh>
        <mesh position={[-0.08, 0.02, 0]} rotation={[0, 0, 0.12]} castShadow>
          <coneGeometry args={[0.06, 0.24, 10]} />
          <meshStandardMaterial color="#ececf3" roughness={0.88} />
        </mesh>
        <mesh position={[0.08, 0.02, 0]} rotation={[0, 0, -0.12]} castShadow>
          <coneGeometry args={[0.06, 0.24, 10]} />
          <meshStandardMaterial color="#ececf3" roughness={0.88} />
        </mesh>
      </group>

      {/* eyebrows */}
      <mesh position={[-0.08, 2.05, 0.2]} rotation={[0, 0, 0.18]} castShadow>
        <boxGeometry args={[0.09, 0.02, 0.02]} />
        <meshStandardMaterial color="#f4f4fa" />
      </mesh>
      <mesh position={[0.08, 2.05, 0.2]} rotation={[0, 0, -0.18]} castShadow>
        <boxGeometry args={[0.09, 0.02, 0.02]} />
        <meshStandardMaterial color="#f4f4fa" />
      </mesh>

      {/* hat brim */}
      <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.42, 0.04, 28]} />
        <meshStandardMaterial color="#3b2b7c" roughness={0.72} />
      </mesh>

      {/* wizard hat */}
      <mesh position={[0, 2.55, 0]} castShadow>
        <coneGeometry args={[0.3, 0.9, 20]} />
        <meshStandardMaterial color="#4a36a0" roughness={0.62} />
      </mesh>
      <mesh position={[0.05, 2.84, 0]} rotation={[0, 0, 0.18]} castShadow>
        <coneGeometry args={[0.08, 0.28, 12]} />
        <meshStandardMaterial color="#4a36a0" roughness={0.62} />
      </mesh>

      {/* staff */}
      <mesh position={[0.86, 1.66, 0]} rotation={[0, 0, -0.14]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 1.62, 12]} />
        <meshStandardMaterial color="#8e6a45" roughness={0.9} />
      </mesh>

      {/* crystal */}
      <group ref={crystalRef} position={[0.96, 2.62, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={active ? 1.0 : 0.45}
            metalness={0.15}
            roughness={0.18}
          />
        </mesh>
      </group>

      {/* magic rune */}
      <mesh ref={runeRef} position={[0.96, 2.34, 0]}>
        <torusGeometry args={[0.3, 0.03, 12, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.48} />
      </mesh>
      <mesh position={[0.96, 2.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.015, 8, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={active ? 0.65 : 0.16} />
      </mesh>
    </group>
  )
}
