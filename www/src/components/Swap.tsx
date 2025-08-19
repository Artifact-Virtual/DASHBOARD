import React, { useState, useEffect } from 'react'
import { parseUnits, formatUnits, isAddress } from 'viem'
import { ChevronDownIcon, ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useSwap, Token, SwapQuote } from '../hooks/useSwap'
import TradingViewWidget from './TradingViewWidget'
import TopRightConnect from './wallet/TopRightConnect'

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
        // Set default: sellToken = 0xA409...f44, buyToken = WETH
        const defaultSell = tokens.find(t => t.address.toLowerCase() === '0xa4093669dafbd123e37d52e0939b3ab3c2272f44');
        const defaultBuy = tokens.find(t => t.symbol === 'WETH');
        setSellToken(defaultSell || tokens[0]);
        setBuyToken(defaultBuy || tokens[1]);
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
      <section className="flex min-h-screen items-center justify-center bg-background px-2 sm:px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-6 flex flex-col items-center">
          <p className="text-lg font-light text-foreground mb-2 font-mono truncate w-full text-center">
            Connect Wallet to Access DEX
          </p>
          <p className="text-muted-foreground font-mono text-center">
            Please connect your wallet to access decentralized trading
          </p>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Invisible header with wallet button */}
      <header className="w-full h-16 flex items-center justify-end px-4 md:px-8" style={{background:'transparent',border:'none',boxShadow:'none',position:'relative',zIndex:10}}>
        <div className="ml-auto">
          <TopRightConnect />
        </div>
      </header>
      <section className="flex flex-col md:flex-row min-h-screen bg-background text-foreground px-2 py-4 md:px-8 md:py-12 gap-6">
      {/* Trading Interface */}
      <div className="w-full md:w-2/5 max-w-lg mx-auto md:mx-0 bg-card border border-border rounded-2xl shadow-xl p-4 md:p-8 flex flex-col justify-center">
        {/* Sell Token */}
        <div className="space-y-2 mb-4">
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
            className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground text-lg placeholder:text-muted-foreground focus:border-primary focus:outline-none font-mono truncate"
          />
        </div>
        {/* Swap Direction Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={swapTokens}
            className="p-2 bg-secondary hover:bg-secondary/80 rounded-full border border-border transition-colors"
            aria-label="Swap token positions"
            title="Swap sell and buy tokens"
          >
            <ArrowPathIcon className="w-5 h-5 text-secondary-foreground" />
          </button>
        </div>
        {/* Buy Token */}
        <div className="space-y-2 mb-4">
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
            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-muted-foreground text-lg font-mono truncate"
          />
        </div>
        {/* Quote Information */}
        {quote && (
          <div className="bg-muted rounded-lg p-4 mb-4 space-y-2 border border-border">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="text-foreground font-mono">
                1 {sellToken?.symbol} = {parseFloat(quote.price).toFixed(6)} {buyToken?.symbol}
              </span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Estimated Gas</span>
              <span className="text-foreground font-mono">{quote.estimatedGas} wei</span>
            </div>
            {quote.priceImpact && (
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">Price Impact</span>
                <span className={`font-mono ${parseFloat(quote.priceImpact) > 5 ? 'text-destructive' : 'text-green-500'}`}>
                  {quote.priceImpact}%
                </span>
              </div>
            )}
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Output Amount</span>
              <span className="font-mono text-foreground">
                {buyToken ? formatUnits(BigInt(quote.buyAmount), buyToken.decimals) : '0'} {buyToken?.symbol}
              </span>
            </div>
          </div>
        )}
        {/* Loading State */}
        {isLoading && !quote && (
          <div className="bg-muted rounded-lg p-4 mb-4 border border-border flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-xs text-muted-foreground font-mono">
              Fetching optimal rates from aggregators...
            </span>
          </div>
        )}
        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!sellAmount || !quote || isLoading || isSwapping}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-mono font-semibold py-3 px-6 rounded-lg transition-colors tracking-wide mb-2"
        >
          {isSwapping ? 'Executing Exchange...' : isLoading ? 'Getting Quote...' : quote ? 'Execute Exchange' : 'Enter Amount'}
        </button>
        {/* Add Custom Token */}
        <div className="mt-4 pt-4 border-t border-border">
          {!showAddToken ? (
            <button
              onClick={() => setShowAddToken(true)}
              className="flex items-center space-x-2 text-primary hover:text-primary/80 text-xs font-mono"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Custom Token</span>
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="0x... Token Address"
                value={customTokenAddress}
                onChange={(e) => setCustomTokenAddress(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none font-mono truncate"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddCustomToken}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2 px-3 rounded-lg transition-colors font-mono"
                >
                  Add Token
                </button>
                <button
                  onClick={() => setShowAddToken(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs py-2 px-3 rounded-lg transition-colors font-mono"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-mono">
            {error}
          </div>
        )}
      </div>
      {/* Market Information */}
      <div className="w-full md:w-3/5 flex flex-col gap-6">
        {/* TradingView Chart Integration */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-4 md:p-8 flex-1 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-mono text-card-foreground font-semibold">Price Chart</span>
            <span className="text-xs font-mono text-muted-foreground">{sellToken?.symbol}/{buyToken?.symbol}</span>
          </div>
          <div className="w-full h-64 md:h-96 bg-muted rounded-lg flex items-center justify-center border border-border overflow-hidden">
            <div className="w-full h-full">
              <TradingViewWidget symbol={`BINANCE:${sellToken?.symbol || 'BTC'}${buyToken?.symbol || 'USDT'}`} autosize={true} />
            </div>
          </div>
        </div>
        {/* Order Book Placeholder */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-4 md:p-8 flex-1 min-h-[200px] flex flex-col">
          <span className="text-base font-mono text-card-foreground font-semibold mb-2">Liquidity Sources</span>
          <div className="space-y-2 flex-1">
            {quote?.sources && quote.sources.length > 0 ? (
              quote.sources.slice(0, 5).map((source, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg border border-border">
                  <span className="text-xs font-mono font-medium text-foreground truncate max-w-[120px]">{source.name}</span>
                  <span className="text-xs font-mono text-primary">{source.proportion}</span>
                </div>
              ))
            ) : isLoading ? (
              <div className="h-20 flex items-center justify-center text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span className="font-mono">Finding optimal liquidity sources...</span>
                </div>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center text-muted-foreground">
                <span className="font-mono">Enter trade amount to see liquidity sources</span>
              </div>
            )}
          </div>
        </div>
        {/* Token Information */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-4 md:p-8 flex-1 min-h-[200px] flex flex-col">
          <span className="text-base font-mono text-card-foreground font-semibold mb-2">Token Information</span>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-3 bg-muted rounded-lg border border-border">
              <span className="font-mono font-semibold text-primary">{sellToken?.symbol}</span>
              <p className="text-xs text-card-foreground font-mono truncate">{sellToken?.name}</p>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">{sellToken?.address}</p>
            </div>
            <div className="flex-1 p-3 bg-muted rounded-lg border border-border">
              <span className="font-mono font-semibold text-green-500">{buyToken?.symbol}</span>
              <p className="text-xs text-card-foreground font-mono truncate">{buyToken?.name}</p>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">{buyToken?.address}</p>
            </div>
          </div>
        </div>
        {/* Trading Statistics */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-4 md:p-8 flex-1 min-h-[120px] flex flex-col">
          <span className="text-base font-mono text-card-foreground font-semibold mb-2">Network Status</span>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground font-mono">Blockchain</span>
              <span className="text-primary font-mono">Base Network</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-mono">Protocol</span>
              <span className="text-green-500 font-mono">Multi-DEX Aggregator</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-mono">Available Tokens</span>
              <span className="text-foreground font-mono">{allTokens.length}</span>
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  )
}
