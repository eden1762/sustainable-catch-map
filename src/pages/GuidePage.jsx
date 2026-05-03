import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'

const sections = [
  {
    title: '入口體驗',
    text: '進站後先在白色沙灘中環視天空與海浪，再從三個互動角色中選擇探索路線。'
  },
  {
    title: '友善海鮮地圖',
    text: '查看附近餐廳、超市與市場，了解供應魚種、永續標籤、與區域位置。'
  },
  {
    title: 'AR 互動與永續標籤',
    text: '旋轉 3D 魚模型，閱讀標籤說明，並在手機上啟動 AR 模式做教育展示。'
  }
]

export default function GuidePage() {
  return (
    <div className="subpage ocean-gradient">
      <SiteNav solid />
      <main className="content-shell guide-layout">
        <section className="intro-panel glass-card">
          <div className="eyebrow">GUIDED TOUR</div>
          <h1>關於我們</h1>
          <p>
            這一頁像你的數位導遊手冊，幫第一次進站的使用者快速理解整體動線。
            你之後也可以把這裡改成真正的角色導覽頁，接上 3D 帥哥導遊 GLB 模型與語音招呼。
          </p>
          <div className="cta-row">
            <Link className="primary-btn" to="/">回到沉浸式首頁</Link>
            <Link className="secondary-btn" to="/map">查看友善海鮮地圖</Link>
          </div>
        </section>

        <section className="guide-grid">
          {sections.map((item, index) => (
            <article key={item.title} className="guide-card glass-card">
              <div className="guide-badge">0{index + 1}</div>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="timeline-panel glass-card">
          <h2>建議體驗順序</h2>
          <ol className="timeline-list">
            <li>先在首頁拖曳視角，讓使用者感受到沙灘與海洋氛圍。</li>
            <li>進入地圖頁，探索附近的友善海鮮供應點。</li>
            <li>再到永續標籤頁，用 3D / AR 做教育式互動。</li>
          </ol>
        </section>
      </main>
    </div>
  )
}
