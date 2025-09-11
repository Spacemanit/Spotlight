import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminHome from './AdminHome.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminHome />
  </StrictMode>,
)
