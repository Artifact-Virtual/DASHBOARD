import { ReactNode, createContext, useContext, useState } from 'react';

interface WalletContextType {
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (open: boolean) => void;
  // Add more wallet state as needed
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children, isSponsored }: { children: ReactNode; isSponsored?: boolean }) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  // Add more wallet state as needed
  return (
    <WalletContext.Provider value={{ isConnectModalOpen, setIsConnectModalOpen }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletContext must be used within WalletProvider');
  return ctx;
}
