import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-screen h-screen flex-shrink-0 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper;
