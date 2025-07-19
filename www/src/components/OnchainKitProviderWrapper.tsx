import { ReactNode } from "react";
// Import OnchainKitProvider and base chain from the generated OnchainKit app
import { OnchainKitProvider, base } from "artifactvirtual";

interface OnchainKitProviderWrapperProps {
  children: ReactNode;
}

export const OnchainKitProviderWrapper = ({ children }: OnchainKitProviderWrapperProps) => (
  <OnchainKitProvider
    apiKey={process.env.ONCHAINKIT_API_KEY}
    chain={base}
    config={{
      appearance: {
        name: 'Your App Name',
        logo: 'https://your-logo.com',
        mode: 'auto',
        theme: 'default',
      },
      wallet: {
        display: 'modal',
        termsUrl: 'https://...',
        privacyUrl: 'https://...',
      },
    }}
  >
    {children}
  </OnchainKitProvider>
);
