import React, { useState, useEffect } from 'react'
import useWalletWagmi from '@/hooks/useWalletWagmi'
import { useSimpleSwap, type Token } from '@/hooks/useSimpleSwap'

const Swap: React.FC = () => {
  const { address, isConnected, chainId } = useWalletWagmi()
  const { 
    supportedTokens, 
    executeSwap, 
    getQuote, 
    isSwapping, 
    swapError, 
    isConnectedToBase,
    getDisplayPrice 
  } = useSimpleSwap()
  
  const [activeTab, setActiveTab] = useState('Swap')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromToken, setFromToken] = useState<Token>(supportedTokens[0]) // ETH
  const [toToken, setToToken] = useState<Token>(supportedTokens[1]) // ALB
  const [slippage, setSlippage] = useState('0.5%')
  const [isLoading, setIsLoading] = useState(false)
  const [priceRate, setPriceRate] = useState<string>('--')

  const tabs = ['Swap', 'Limit', 'Recurring', 'DCA']

  // Check if we're on Base network (chainId 8453)
  const isOnBase = chainId === 8453
  
  useEffect(() => {
    // Calculate price and output amount when inputs change
    if (fromAmount && parseFloat(fromAmount) > 0) {
      setIsLoading(true)
      
      Promise.all([
        getQuote(fromToken, toToken, fromAmount),
        getDisplayPrice(fromToken, toToken)
      ]).then(([quote, price]) => {
        if (quote) {
          const outputAmount = parseFloat(quote.amountOut.toString()) / Math.pow(10, toToken.decimals)
          setToAmount(outputAmount.toFixed(6))
        }
        setPriceRate(price)
        setIsLoading(false)
      }).catch(() => {
        setIsLoading(false)
      })
    } else {
      setToAmount('')
      setPriceRate('--')
    }
  }, [fromAmount, fromToken, toToken, getQuote, getDisplayPrice])

  const handleSwap = async () => {
    if (!isConnected) {
      console.log('Please connect wallet first')
      return
    }
    
    if (!isOnBase) {
      console.log('Please switch to Base network')
      return
    }

    const success = await executeSwap({
      tokenIn: fromToken,
      tokenOut: toToken,
      amountIn: fromAmount,
      slippageTolerance: parseFloat(slippage.replace('%', ''))
    })

    if (success) {
      console.log('Swap completed successfully!')
    }
  }

  const flipTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const switchToBase = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // Base mainnet
        })
      } catch (error: any) {
        if (error.code === 4902) {
          // Network not added, add it
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x2105',
                chainName: 'Base',
                nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
              }],
            })
          } catch (addError) {
            console.error('Failed to add Base network:', addError)
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Network Warning */}
        {isConnected && !isOnBase && (
          <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm font-medium">Wrong Network</p>
                <p className="text-yellow-300/70 text-xs">Switch to Base for optimal trading</p>
              </div>
              <button
                onClick={switchToBase}
                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-xs font-medium transition-colors"
              >
                Switch to Base
              </button>
            </div>
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
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
                      {fromToken.icon}
                    </span>
                    <span className="font-medium">{fromToken.symbol}</span>
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  {fromToken.symbol === 'ETH' ? '$0.00' : '0'}
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
                    value={isLoading ? 'Calculating...' : toAmount}
                    readOnly
                    placeholder="0"
                    className="bg-transparent text-2xl font-medium outline-none flex-1 text-white"
                  />
                  <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-3 py-2">
                    <span className="text-lg">
                      {toToken.icon}
                    </span>
                    <span className="font-medium">{toToken.symbol}</span>
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  {toToken.symbol === 'ALB' ? '$0.00' : '0'}
                </div>
              </div>
            </div>

            {/* Price Info */}
            <div className="bg-[#111111] rounded-xl p-4 border border-white/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price</span>
                <span className="text-white">
                  {fromAmount && toAmount ? 
                    `1 ${fromToken.symbol} = ${priceRate} ${toToken.symbol}` : 
                    '--'
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Slippage tolerance</span>
                <span className="text-white">{slippage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Network</span>
                <span className={`text-white ${isOnBase ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isOnBase ? 'Base ✓' : chainId ? `Chain ${chainId}` : 'Not connected'}
                </span>
              </div>
              {swapError && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Error</span>
                  <span className="text-red-400 text-xs">{swapError}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">DEX Source</span>
                <span className="text-blue-400 text-xs">
                  {fromAmount && toAmount ? 'Uniswap V3 + 0x API' : 'Multi-DEX'}
                </span>
              </div>
            </div>

            {/* Connect Wallet / Swap Button */}
            {!isConnected ? (
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 rounded-xl transition-colors">
                Connect wallet
              </button>
            ) : !isOnBase ? (
              <button
                onClick={switchToBase}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-medium py-4 rounded-xl transition-colors"
              >
                Switch to Base Network
              </button>
            ) : (
              <button
                onClick={handleSwap}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!fromAmount || fromAmount === '0' || fromAmount === '' || isSwapping}
              >
                {isSwapping ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : !fromAmount || fromAmount === '0' || fromAmount === '' ? 
                  'Enter an amount' : 
                  `Swap ${fromToken.symbol} for ${toToken.symbol}`
                }
              </button>
            )}

            {/* Powered by notice */}
            <div className="text-center text-xs text-gray-500 mt-4">
              Real DEX Integration • Uniswap V3 + 0x Protocol • Base Network
            </div>
            
            {/* DEX Source Info */}
            <div className="text-center text-xs text-gray-400 mt-2">
              Live pricing from Uniswap V3 Quoter • Cross-DEX optimization
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Swap
