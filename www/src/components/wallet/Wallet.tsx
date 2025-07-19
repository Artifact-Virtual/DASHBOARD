import { ReactNode } from 'react';
import { WalletProvider } from './WalletProvider';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';

interface WalletProps {
  children?: ReactNode;
  className?: string;
  draggable?: boolean;
  draggableStartingPosition?: any;
  isSponsored?: boolean;
}

export function Wallet({ children, className, draggable, draggableStartingPosition, isSponsored }: WalletProps) {
  // For simplicity, omitting drag/drop and theme logic for now
  return (
    <WalletProvider isSponsored={isSponsored}>
      <div className={className}>
        {children ? children : <>
          <ConnectWallet />
          <WalletDropdown />
        </>}
      </div>
    </WalletProvider>
  );
}
