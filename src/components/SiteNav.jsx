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
        <NavLink to="/guide">網站導覽</NavLink>
        <NavLink to="/map">友善海鮮地圖</NavLink>
        <NavLink to="/sustainability">AR 與永續標籤</NavLink>
      </nav>
    </header>
  )
}
