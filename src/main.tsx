import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './polyfills' // Import polyfills first
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
