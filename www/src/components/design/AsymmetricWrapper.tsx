import React from 'react'

type Props = {
  children?: React.ReactNode
  className?: string
}

const AsymmetricWrapper: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] ${className}`}>
      {/* subtle asymmetric background */}
      <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-blue-500/6 rotate-[12deg] pointer-events-none blur-2xl" />
      <div className="absolute right-[-8rem] top-20 w-72 h-72 bg-gradient-to-tr from-rose-500/6 to-yellow-400/6 rounded-full opacity-60 pointer-events-none blur-sm" />
      <div className="relative p-6 md:p-8">
        {children}
      </div>
    </div>
  )
}

export default AsymmetricWrapper
