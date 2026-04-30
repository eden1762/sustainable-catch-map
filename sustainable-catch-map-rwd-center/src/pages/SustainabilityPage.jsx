import React from 'react'
import SiteNav from '../components/SiteNav'

const labels = [
  {
    title: '資源狀態',
    desc: '確認是否為非過度捕撈、恢復中或季節性適合食用的魚種。'
  },
  {
    title: '漁法資訊',
    desc: '標示延繩釣、定置網、養殖等方式，協助使用者理解環境影響。'
  },
  {
    title: '產地與足跡',
    desc: '顯示產地、運輸距離與在地採購指標，讓購買更透明。'
  }
]

export default function SustainabilityPage() {
  return (
    <div className="subpage star-page-bg">
      <SiteNav solid />
      <main className="content-shell sustainability-layout">
        <section className="sustainability-copy glass-card">
          <div className="eyebrow">AR & SUSTAINABILITY LABELS</div>
          <h1>AR 互動與永續標籤</h1>
          <p>
            這一頁保留你原本想要的 3D / AR 魚模型展示，並補上永續標籤卡片與教育說明。
            在手機支援的環境裡，可透過 model-viewer 右下角按鈕開啟 AR 模式。
          </p>

          <div className="label-grid">
            {labels.map(item => (
              <article key={item.title} className="label-card">
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="model-stage glass-card">
          <model-viewer
            src="https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/BarramundiFish/glTF-Binary/BarramundiFish.glb"
            alt="永續魚種 3D 模型"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style={{ width: '100%', height: '100%', background: 'transparent', borderRadius: '24px' }}
          />
        </section>
      </main>
    </div>
  )
}
