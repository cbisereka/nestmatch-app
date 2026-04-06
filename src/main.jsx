import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ── Mount React app ──────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// ── Register PWA Service Worker ──────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[NestMatch] Service Worker registered:', registration.scope)
      })
      .catch((error) => {
        console.log('[NestMatch] Service Worker registration failed:', error)
      })
  })
}

// ── PWA Install Prompt ───────────────────────────────────────
// Capture the install event so we can show it at the right time
let deferredPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  // Dispatch a custom event so App.jsx can show the install banner
  window.dispatchEvent(new CustomEvent('pwa-installable'))
  console.log('[NestMatch] PWA install prompt ready')
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  console.log('[NestMatch] App installed successfully!')
})

// Export so App.jsx can trigger it
export function triggerPWAInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((result) => {
      console.log('[NestMatch] Install choice:', result.outcome)
      deferredPrompt = null
    })
  }
}
