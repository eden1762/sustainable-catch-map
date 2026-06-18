import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GuidePage from './pages/GuidePage'
import MapPage from './pages/MapPage'
import SustainabilityPage from './pages/SustainabilityPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/sustainability" element={<SustainabilityPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
