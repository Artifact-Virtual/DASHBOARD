import React, { useState } from 'react'
import useWalletWagmi from '@/hooks/useWalletWagmi'

const Swap: React.FC = () => {
  const { address, isConnected } = useWalletWagmi()
  const [activeTab, setActiveTab] = useState('Swap')
  const [fromAmount, setFromAmount] = useState('0')
  const [toAmount, setToAmount] = useState('0')
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('ALB')
  const [slippage, setSlippage] = useState('0.5%')

  const tabs = ['Swap', 'Limit', 'Recurring', 'DCA']

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', icon: '⚡' },
    { symbol: 'ALB', name: 'ARCx LP Token', icon: '🔷' },
    { symbol: 'USDC', name: 'USD Coin', icon: '💰' },
    { symbol: 'WETH', name: 'Wrapped Ethereum', icon: '🔄' }
  ]

  const handleSwap = () => {
    if (!isConnected) {
      console.log('Please connect wallet first')
      return
    }
    console.log(`Swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`)
  }

  const flipTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
        {/* Header Tabs */}
        <div className="flex bg-[#111111] border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#2a2a2a] text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Swap Interface */}
        <div className="p-6 space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Sell</span>
              <span>Balance: --</span>
            </div>
            <div className="bg-[#111111] rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0"
                  className="bg-transparent text-2xl font-medium outline-none flex-1 text-white"
                />
                <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-3 py-2">
                  <span className="text-lg">
                    {tokens.find(t => t.symbol === fromToken)?.icon}
                  </span>
                  <span className="font-medium">{fromToken}</span>
                  <span className="text-gray-400">▼</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {fromToken === 'ETH' ? '$0.00' : '0'}
              </div>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <button
              onClick={flipTokens}
              className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl p-2 border border-white/10 transition-colors"
              title="Flip tokens"
              aria-label="Flip tokens"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Buy</span>
              <span>Balance: --</span>
            </div>
            <div className="bg-[#111111] rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  placeholder="0"
                  className="bg-transparent text-2xl font-medium outline-none flex-1 text-white"
                />
                <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-3 py-2">
                  <span className="text-lg">
                    {tokens.find(t => t.symbol === toToken)?.icon}
                  </span>
                  <span className="font-medium">{toToken}</span>
                  <span className="text-gray-400">▼</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {toToken === 'ALB' ? '$0.00' : '0'}
              </div>
            </div>
          </div>

          {/* Price Info */}
          <div className="bg-[#111111] rounded-xl p-4 border border-white/10 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price</span>
              <span className="text-white">--</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Slippage tolerance</span>
              <span className="text-white">{slippage}</span>
            </div>
          </div>

          {/* Connect Wallet / Swap Button */}
          {!isConnected ? (
            <button className="w-full bg-gray-600 hover:bg-gray-500 text-white font-medium py-4 rounded-xl transition-colors">
              Connect wallet
            </button>
          ) : (
            <button
              onClick={handleSwap}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!fromAmount || fromAmount === '0'}
            >
              {!fromAmount || fromAmount === '0' ? 'Enter an amount' : 'Swap'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Swap
