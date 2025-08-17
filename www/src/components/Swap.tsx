import React, { useState, useEffect } from 'react'
import { parseUnits, formatUnits, isAddress } from 'viem'
import { ChevronDownIcon, ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useSwap, Token, SwapQuote } from '../hooks/useSwap'

export default function Swap() {
  const { tokens, getQuote, addToken, executeSwap, isLoading, error, isConnected } = useSwap()
  
  const [sellToken, setSellToken] = useState<Token | null>(null)
  const [buyToken, setBuyToken] = useState<Token | null>(null)
  const [sellAmount, setSellAmount] = useState('')
  const [quote, setQuote] = useState<SwapQuote | null>(null)
  const [customTokenAddress, setCustomTokenAddress] = useState('')
  const [showAddToken, setShowAddToken] = useState(false)
  const [allTokens, setAllTokens] = useState<Token[]>(tokens)
  const [isSwapping, setIsSwapping] = useState(false)

  // Initialize tokens when they load
  useEffect(() => {
    if (tokens.length > 0 && !sellToken && !buyToken) {
      setSellToken(tokens[0]) // WETH
      setBuyToken(tokens[1])  // USDC
    }
    setAllTokens(tokens)
  }, [tokens, sellToken, buyToken])

  // Update quote when inputs change
  useEffect(() => {
    const getQuoteData = async () => {
      if (sellAmount && parseFloat(sellAmount) > 0 && sellToken && buyToken) {
        console.log('Getting quote for:', sellAmount, sellToken.symbol, '→', buyToken.symbol)
        const quoteData = await getQuote(sellToken.address, buyToken.address, sellAmount)
        setQuote(quoteData)
      } else {
        setQuote(null)
      }
    }

    const timeoutId = setTimeout(getQuoteData, 500) // Debounce
    return () => clearTimeout(timeoutId)
  }, [sellAmount, sellToken, buyToken, getQuote])

  const handleSwap = async () => {
    if (!sellToken || !buyToken || !sellAmount || !quote) return
    
    setIsSwapping(true)
    try {
      const result = await executeSwap(sellToken.address, buyToken.address, sellAmount)
      if (result) {
        // Swap successful
        setSellAmount('')
        setQuote(null)
      }
    } catch (err) {
      console.error('Swap failed:', err)
    } finally {
      setIsSwapping(false)
    }
  }

  const handleAddCustomToken = async () => {
    if (!isAddress(customTokenAddress)) {
      alert('Invalid token address')
      return
    }

    const newToken = await addToken(customTokenAddress as any)
    if (newToken) {
      setAllTokens(prev => [...prev, newToken])
      setCustomTokenAddress('')
      setShowAddToken(false)
    }
  }

  const swapTokens = () => {
    setSellToken(buyToken)
    setBuyToken(sellToken)
    setSellAmount('')
    setQuote(null)
  }

  const TokenSelect = ({ 
    selected, 
    onSelect, 
    label 
  }: { 
    selected: Token | null
    onSelect: (token: Token) => void
    label: string 
  }) => {
    if (!selected) return <div>Loading tokens...</div>
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <div className="relative">
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer hover:border-gray-600 focus:border-blue-500 focus:outline-none"
            value={selected.address}
            onChange={(e) => {
              const token = allTokens.find(t => t.address === e.target.value)
              if (token) onSelect(token)
            }}
            aria-label={`Select ${label} token`}
          >
            {allTokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol} - {token.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 overflow-hidden bg-background">
        <div className="text-center relative z-10">
          <h2 className="text-2xl font-precision font-light text-foreground tracking-precision mb-4">
            Connect Wallet to Access DEX
          </h2>
          <p className="text-muted-foreground font-precision">
            Please connect your wallet to access decentralized trading
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen bg-background text-foreground">
      {/* Asymmetric Layout: 1/3 Trading Interface, 2/3 Market Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Trading Interface - 1/3 */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-precision font-light text-card-foreground tracking-precision mb-6">
                Token Exchange
              </h2>
              
              {/* Sell Token */}
              <div className="space-y-4 mb-6">
                <TokenSelect
                  selected={sellToken}
                  onSelect={setSellToken}
                  label="From"
                />
                
                <input
                  type="number"
                  placeholder="0.0"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  className="w-full bg-input border border-border rounded-md px-4 py-3 text-foreground text-lg placeholder:text-muted-foreground focus:border-ring focus:outline-none font-mono-slim"
                />
              </div>

              {/* Swap Direction Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={swapTokens}
                  className="p-2 bg-secondary hover:bg-secondary/80 rounded-md border border-border transition-colors"
                  aria-label="Swap token positions"
                  title="Swap sell and buy tokens"
                >
                  <ArrowPathIcon className="w-5 h-5 text-secondary-foreground" />
                </button>
              </div>

              {/* Buy Token */}
              <div className="space-y-4 mb-6">
                <TokenSelect
                  selected={buyToken}
                  onSelect={setBuyToken}
                  label="To"
                />
                
                <input
                  type="text"
                  placeholder="0.0"
                  value={quote && buyToken ? formatUnits(BigInt(quote.buyAmount), buyToken.decimals) : ''}
                  readOnly
                  className="w-full bg-muted border border-border rounded-md px-4 py-3 text-muted-foreground text-lg font-mono-slim"
                />
              </div>

              {/* Quote Information */}
              {quote && (
                <div className="bg-muted rounded-md p-4 mb-6 space-y-2 border border-border">
                  <div className="flex justify-between text-sm font-precision">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span className="text-foreground font-mono-slim">
                      1 {sellToken?.symbol} = {parseFloat(quote.price).toFixed(6)} {buyToken?.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-precision">
                    <span className="text-muted-foreground">Estimated Gas</span>
                    <span className="text-foreground font-mono-slim">{quote.estimatedGas} wei</span>
                  </div>
                  {quote.priceImpact && (
                    <div className="flex justify-between text-sm font-precision">
                      <span className="text-muted-foreground">Price Impact</span>
                      <span className={`font-mono-slim ${parseFloat(quote.priceImpact) > 5 ? 'text-destructive' : 'text-green-500'}`}>
                        {quote.priceImpact}%
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-precision">
                    <span className="text-muted-foreground">Output Amount</span>
                    <span className="font-mono-slim text-foreground">
                      {buyToken ? formatUnits(BigInt(quote.buyAmount), buyToken.decimals) : '0'} {buyToken?.symbol}
                    </span>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && !quote && (
                <div className="bg-muted rounded-md p-4 mb-6 border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span className="text-sm text-muted-foreground font-precision">
                      Fetching optimal rates from aggregators...
                    </span>
                  </div>
                </div>
              )}

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                disabled={!sellAmount || !quote || isLoading || isSwapping}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-precision font-medium py-3 px-6 rounded-md transition-colors tracking-precision"
              >
                {isSwapping ? 'Executing Exchange...' : isLoading ? 'Getting Quote...' : quote ? 'Execute Exchange' : 'Enter Amount'}
              </button>

              {/* Add Custom Token */}
              <div className="mt-6 pt-6 border-t border-border">
                {!showAddToken ? (
                  <button
                    onClick={() => setShowAddToken(true)}
                    className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm font-precision"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Custom Token</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="0x... Token Address"
                      value={customTokenAddress}
                      onChange={(e) => setCustomTokenAddress(e.target.value)}
                      className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none font-mono-slim"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddCustomToken}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-2 px-3 rounded-md transition-colors font-precision"
                      >
                        Add Token
                      </button>
                      <button
                        onClick={() => setShowAddToken(false)}
                        className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm py-2 px-3 rounded-md transition-colors font-precision"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm font-precision">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Market Information - 2/3 */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Price Chart Placeholder */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-precision font-light text-card-foreground tracking-precision mb-4">
                  Price Chart
                </h3>
                <div className="h-64 bg-muted rounded-md flex items-center justify-center border border-border">
                  <div className="text-center text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-md flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <p className="font-precision">Chart integration coming soon</p>
                    <p className="text-sm font-mono-slim tracking-precision">
                      {sellToken?.symbol}/{buyToken?.symbol}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Book Placeholder */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-precision font-light text-card-foreground tracking-precision mb-4">
                  Liquidity Sources
                </h3>
                <div className="space-y-3">
                  {quote?.sources && quote.sources.length > 0 ? (
                    quote.sources.slice(0, 5).map((source, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-3 bg-muted rounded-md border border-border">
                        <span className="text-sm font-precision font-medium text-foreground">{source.name}</span>
                        <span className="text-sm font-mono-slim text-primary">{source.proportion}</span>
                      </div>
                    ))
                  ) : isLoading ? (
                    <div className="h-32 flex items-center justify-center text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="font-precision">Finding optimal liquidity sources...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center text-muted-foreground">
                      <span className="font-precision">Enter trade amount to see liquidity sources</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Token Information */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-precision font-light text-card-foreground tracking-precision mb-4">
                  Token Information
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-md border border-border">
                    <h4 className="font-precision font-medium text-primary">{sellToken?.symbol}</h4>
                    <p className="text-sm text-card-foreground font-precision">{sellToken?.name}</p>
                    <p className="text-xs text-muted-foreground font-mono-slim tracking-precision">{sellToken?.address}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-md border border-border">
                    <h4 className="font-precision font-medium text-green-500">{buyToken?.symbol}</h4>
                    <p className="text-sm text-card-foreground font-precision">{buyToken?.name}</p>
                    <p className="text-xs text-muted-foreground font-mono-slim tracking-precision">{buyToken?.address}</p>
                  </div>
                </div>
              </div>

              {/* Trading Statistics */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-precision font-light text-card-foreground tracking-precision mb-4">
                  Network Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-precision">Blockchain</span>
                    <span className="text-primary font-precision">Base Network</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-precision">Protocol</span>
                    <span className="text-green-500 font-precision">Multi-DEX Aggregator</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-precision">Available Tokens</span>
                    <span className="text-foreground font-mono-slim">{allTokens.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
