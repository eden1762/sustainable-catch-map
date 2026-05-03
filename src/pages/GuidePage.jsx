import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'

const sections = [
  {
    title: '我們看見的問題',
    text: '過度捕撈、氣候變遷與標示不清，讓消費者很難判斷哪些海鮮真正友善環境，也讓漁業資源管理更需要即時資料支持。'
  },
  {
    title: '我們提出的解法',
    text: '永續漁人地圖結合 AI 分析、季節漁獲資料、永續標準與在地據點，協助大眾理解當季適合選擇的魚種與來源。'
  },
  {
    title: '我們想創造的改變',
    text: '透過友善海鮮地圖、AR 互動標籤與教育內容，讓永續海鮮從專業議題變成日常生活中看得懂、找得到、願意支持的選擇。'
  }
]
export default function GuidePage() {
  return (
    <div className="subpage ocean-gradient">
      <SiteNav solid />
      <main className="content-shell guide-layout">
        <section className="intro-panel glass-card">
          <div className="eyebrow">ABOUT SUSTAINABLE CATCH MAP</div>
          <h1>關於我們</h1>
          <p>
            Sustainable Catch Map（永續漁人地圖）是一個以海洋永續為核心的互動資訊平台。
            我們希望運用 AI、大數據與 AR/VR 互動體驗，整合漁獲季節、產地來源、永續標籤與友善店家資訊，
            讓消費者、漁民、餐飲業者與教育單位都能用更直覺的方式參與永續漁業。
          </p>
          <div className="cta-row">
            <Link className="primary-btn" to="/">回到沉浸式首頁</Link>
            <Link className="secondary-btn" to="/map">探索友善海鮮據點</Link>
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
          <h2>我們的推動方向</h2>
          <ol className="timeline-list">
            <li>先用清楚的文字與互動場景，降低民眾理解永續海鮮的門檻。</li>
            <li>再透過地圖與標籤資訊，串接餐廳、超市、市場與在地漁港等友善據點。</li>
            <li>最後以 AI 推薦與 AR 教育模組，推動更透明、更有參與感的永續消費模式。</li>
          </ol>
        </section>
      </main>
    </div>
  )
}
