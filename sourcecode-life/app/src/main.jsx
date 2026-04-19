import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/bridge.js'       // attaches window.NativeAuth, NativeAllies, etc.
import './lib/questEngine.js'  // XP engine + global QuestEngine_* bindings
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
