import React, { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import SiteNav from '../components/SiteNav'
import { mapPoints } from '../data/mapPoints'

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

export default function MapPage() {
  const [filter, setFilter] = useState('全部')
  const mapRef = useRef(null)
  const leafletRef = useRef(null)
  const markerLayerRef = useRef(null)

  const filteredPoints = useMemo(() => {
    if (filter === '全部') return mapPoints
    return mapPoints.filter(item => item.type === filter)
  }, [filter])

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return

    const map = L.map(mapRef.current).setView([25.033, 121.5654], 11)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    leafletRef.current = map
    markerLayerRef.current = L.layerGroup().addTo(map)
    return () => map.remove()
  }, [])

  useEffect(() => {
    const map = leafletRef.current
    const layer = markerLayerRef.current
    if (!map || !layer) return

    layer.clearLayers()
    const bounds = []

    filteredPoints.forEach(item => {
      const marker = L.marker([item.lat, item.lng], { icon }).addTo(layer)
      marker.bindPopup(`
        <div style="min-width:220px">
          <strong>${item.name}</strong><br/>
          類型：${item.type}<br/>
          魚種：${item.species.join('、')}<br/>
          標籤：${item.certification}<br/>
          區域：${item.district}<br/>
          備註：${item.note}
        </div>
      `)
      bounds.push([item.lat, item.lng])
    })

    if (bounds.length) {
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [filteredPoints])

  return (
    <div className="subpage map-page-bg">
      <SiteNav solid />
      <main className="content-shell map-layout">
        <aside className="map-sidebar glass-card">
          <div className="eyebrow">FRIENDLY SEAFOOD MAP</div>
          <h1>附近的友善海鮮地圖</h1>
          <p>透過地圖快速找到身邊支持永續漁法、友善養殖與產地透明的海鮮店家。從漁獲來源、販售品項到店家位置一目了然，讓你安心選購新鮮海味，也用每一次消費支持海洋永續與在地漁民。</p>

          <div className="filter-group">
            {['全部', '餐廳', '超市', '市場'].map(type => (
              <button
                key={type}
                className={`chip ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="location-list">
            {filteredPoints.map(item => (
              <article key={item.id} className="location-card">
                <strong>{item.name}</strong>
                <span>{item.type}｜{item.district}</span>
                <p>{item.species.join('、')}</p>
                <small>{item.certification}</small>
              </article>
            ))}
          </div>
        </aside>

        <section className="map-stage glass-card">
          <div ref={mapRef} className="leaflet-stage" />
        </section>
      </main>
    </div>
  )
}
