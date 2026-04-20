import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './polyfills' // Import polyfills first
import App from './App.tsx'
import { logEnvironmentInfo, performHealthCheck } from './utils/health-check'

// Log environment information for debugging
logEnvironmentInfo();

// Perform health check in production
if (import.meta.env.PROD) {
  performHealthCheck().then(result => {
    if (result.status === 'unhealthy') {
      console.error('Production health check failed:', result.message);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
