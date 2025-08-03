import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WalletProvider } from './contexts/WalletContext'

console.log('Main.tsx is running');
console.log('Root element:', document.getElementById("root"));

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <WalletProvider>
        <App />
      </WalletProvider>
    </StrictMode>,
  )
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Error rendering React app:', error);
}
