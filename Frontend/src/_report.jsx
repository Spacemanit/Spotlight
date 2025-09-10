import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import IssuePage from './IssuePage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IssuePage />
  </StrictMode>,
)
