import { ReactNode } from 'react';
// Placeholder for Identity UI
export function Identity({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={className}>Identity (placeholder){children}</div>;
}
