import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminTable from './AdminTable.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminTable />
  </StrictMode>,
)
