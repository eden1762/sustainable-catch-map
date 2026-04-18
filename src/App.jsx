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
    hoverText: '歡迎來到永續漁獲地圖'
  },
  {
    key: 'map',
    title: '附近的友善海鮮地圖',
    subtitle: '3D 古地圖卷軸',
    position: [0, 1, -6],
    accent: '#ffe29a',
    route: '/map',
    hoverText: '展開附近可探索的永續漁獲據點'
  },
  {
    key: 'ar',
    title: 'AR 互動與永續標籤',
    subtitle: '3D 老魔法師',
    position: [4.2, 1.2, -3.4],
    accent: '#d4b3ff',
    route: '/sustainability',
    hoverText: '揮動魔法棒，召喚永續標籤與光粒'
  }
]

function App() {
  const [activeKey, setActiveKey] = useState('guide')
  const activeItem = MENU_ITEMS.find(item => item.key === activeKey) ?? MENU_ITEMS[0]

  return (
    <div className="page-shell">
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
        <div className="brand-block glass">
          <div className="eyebrow">SUSTAINABLE CATCH MAP</div>
          <h1>走進白色沙灘，開始沉浸式永續漁獲體驗</h1>
          <p>
            滑鼠拖曳可 720° 旋轉視角，向上看天空、向下看腳邊沙灘，
            在海風、浪光與互動角色之間探索地圖、導覽與 AR 標籤。
          </p>
        </div>

        <div className="menu-panel glass">
          {MENU_ITEMS.map(item => (
            <button
              key={item.key}
              className={`menu-card ${item.key === activeKey ? 'active' : ''}`}
              onMouseEnter={() => setActiveKey(item.key)}
              onFocus={() => setActiveKey(item.key)}
              onClick={() => window.location.href = item.route}
            >
              <span className="menu-title">{item.title}</span>
              <span className="menu-subtitle">{item.subtitle}</span>
            </button>
          ))}
        </div>

        <div className="status-card glass">
          <div className="status-label">目前聚焦</div>
          <h2>{activeItem.title}</h2>
          <p>{activeItem.hoverText}</p>
          <div className="hint">提示：拖曳畫面可環視海灘，移到 3D 物件上會有動態反應。</div>
        </div>
      </div>
    </div>
  )
}

function BeachWorld({ activeKey, setActiveKey }) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 9, 4]} intensity={2.4} castShadow />
      <hemisphereLight args={['#fff8dd', '#a9dcff', 1.3]} />
      <Sky sunPosition={[8, 6, -5]} turbidity={4} rayleigh={1.6} />
      <Stars radius={60} depth={30} count={1000} factor={2} saturation={0} fade speed={0.3} />
      <Sparkles count={80} scale={[24, 8, 24]} size={2.2} speed={0.25} opacity={0.2} />

      <SunGlare />
      <Sand />
      <Sea />
      <Footsteps />
      <ShoreFoam />

      {MENU_ITEMS.map(item => (
        <InteractiveMenuObject
          key={item.key}
          item={item}
          active={activeKey === item.key}
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
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#f8f3df',
      roughness: 0.97,
      metalness: 0.02
    })
    return mat
  }, [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} material={material} receiveShadow>
      <planeGeometry args={[80, 80, 64, 64]} />
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

  const commonEvents = {
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
    <group ref={ref} position={item.position} {...commonEvents}>
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
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (armRef.current) armRef.current.rotation.z = active ? Math.sin(t * 4) * 0.45 - 0.45 : -0.2
    if (headRef.current) headRef.current.rotation.y = active ? Math.sin(t * 2.8) * 0.22 : 0
  })

  return (
    <group>
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.42, 1.45, 16]} />
        <meshStandardMaterial color="#5fd2c8" roughness={0.45} />
      </mesh>
      <mesh ref={headRef} position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.32, 28, 28]} />
        <meshStandardMaterial color="#ffd8b8" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.5, 0.28, 18]} />
        <meshStandardMaterial color={color} emissive={active ? color : '#000000'} emissiveIntensity={active ? 0.45 : 0} />
      </mesh>
      <mesh position={[-0.42, 1.08, 0]} rotation={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[0.16, 0.74, 0.16]} />
        <meshStandardMaterial color="#ffd8b8" />
      </mesh>
      <mesh ref={armRef} position={[0.42, 1.25, 0]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[0.16, 0.84, 0.16]} />
        <meshStandardMaterial color="#ffd8b8" />
      </mesh>
      <mesh position={[-0.16, 2.14, 0.24]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#222" />
      </mesh>
      <mesh position={[0.16, 2.14, 0.24]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#222" />
      </mesh>
    </group>
  )
}

function ScrollMap({ active, color }) {
  const paperRef = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (paperRef.current) {
      paperRef.current.scale.x = active ? 1.3 + Math.sin(t * 6) * 0.03 : 0.85
    }
  })

  return (
    <group>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2.2, 20]} />
        <meshStandardMaterial color="#885d3b" />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2.2, 20]} />
        <meshStandardMaterial color="#885d3b" />
      </mesh>
      <mesh ref={paperRef} position={[0, 0.68, 0]}>
        <boxGeometry args={[active ? 2.2 : 1.4, 1.55, 0.08]} />
        <meshStandardMaterial color="#f6e8bf" emissive={active ? color : '#000000'} emissiveIntensity={active ? 0.25 : 0} />
      </mesh>
      <mesh position={[-0.48, 0.7, 0.06]}>
        <sphereGeometry args={[0.08, 18, 18]} />
        <meshBasicMaterial color="#c14b36" />
      </mesh>
      <mesh position={[0.18, 1.02, 0.06]}>
        <sphereGeometry args={[0.06, 18, 18]} />
        <meshBasicMaterial color="#3277ff" />
      </mesh>
      <mesh position={[0.52, 0.38, 0.06]}>
        <sphereGeometry args={[0.06, 18, 18]} />
        <meshBasicMaterial color="#5bbd4d" />
      </mesh>
    </group>
  )
}

function WizardStatue({ active, color }) {
  const wandRef = useRef()
  const runeRef = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (wandRef.current) wandRef.current.rotation.z = active ? Math.sin(t * 5) * 0.4 + 0.2 : 0.2
    if (runeRef.current) {
      runeRef.current.rotation.y += 0.03
      runeRef.current.material.opacity = active ? 0.85 : 0.25
    }
  })

  return (
    <group>
      <mesh position={[0, 1.0, 0]}>
        <coneGeometry args={[0.6, 1.7, 7]} />
        <meshStandardMaterial color="#5e4bb7" roughness={0.45} />
      </mesh>
      <mesh position={[0, 2.06, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#e9d1c2" />
      </mesh>
      <mesh position={[0, 2.56, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.46, 0.92, 12]} />
        <meshStandardMaterial color="#40307f" emissive={active ? color : '#000000'} emissiveIntensity={active ? 0.25 : 0} />
      </mesh>
      <mesh position={[-0.42, 1.3, 0]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.12, 0.76, 0.12]} />
        <meshStandardMaterial color="#e9d1c2" />
      </mesh>
      <mesh ref={wandRef} position={[0.42, 1.5, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.08, 1.0, 0.08]} />
        <meshStandardMaterial color="#f0de9b" />
      </mesh>
      <mesh position={[0.68, 2.0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={runeRef} position={[0.92, 2.28, 0]}>
        <torusGeometry args={[0.28, 0.03, 12, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export default App
