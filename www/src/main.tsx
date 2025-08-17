import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Lazy-load heavy provider wrapper to avoid bundling wagmi/viem into the initial chunk
const mountApp = async () => {
  const [{ AppWagmiProvider }, { ToastProvider }] = await Promise.all([
    import('./contexts/WagmiSetup'),
    import('./contexts/ToastContext'),
  ])

  try {
    // Force AMOLED theme on app bootstrap per design request
    try { document.documentElement.classList.add('amoled') } catch (e) {}

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <AppWagmiProvider>
          <ToastProvider>
            <Suspense fallback={<div className="min-h-screen" />}>
              <App />
            </Suspense>
          </ToastProvider>
        </AppWagmiProvider>
      </StrictMode>,
    )

    // Ensure AMOLED + dark classes are present
    try { document.body.classList.add('amoled') } catch (e) {}
    try { document.documentElement.classList.add('amoled'); document.documentElement.classList.add('dark') } catch (e) {}
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Error rendering React app:', error);
  }
}

mountApp();
