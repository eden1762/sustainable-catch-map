import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function SiteNav({ solid = false }) {
  return (
    <header className={`site-nav ${solid ? 'solid' : ''}`}>
      <Link to="/" className="brand-mark">
        <span className="brand-kicker">SUSTAINABLE CATCH MAP</span>
        <strong>永續漁獲地圖</strong>
      </Link>

      <nav className="nav-links">
        <NavLink to="/pages/about.html">我們的理念</NavLink>
        <NavLink to="/pages/map.html">友善海鮮地圖</NavLink>
        <NavLink to="/pages/sustainability.html">AR 與永續標籤</NavLink>
      </nav>
    </header>
  )
}
