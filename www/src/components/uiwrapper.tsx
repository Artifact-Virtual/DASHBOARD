import { ReactNode } from "react";
import { AppWithWalletModal, Wallet, ConnectWallet, Avatar, Name, WalletDropdown, Identity, Address, EthBalance, WalletDropdownDisconnect } from "artifactvirtual";

interface UIWrapperProps {
  children?: ReactNode;
}

export const UIWrapper = ({ children }: UIWrapperProps) => (
  <AppWithWalletModal>
    <div className="my-10 flex justify-center">
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className="text-foreground-muted" />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
    {children}
  </AppWithWalletModal>
);
