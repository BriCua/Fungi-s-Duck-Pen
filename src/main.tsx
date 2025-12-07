import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/ui/button-animations.css'
import './firebase/init'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom' // Import BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* Add BrowserRouter here */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
