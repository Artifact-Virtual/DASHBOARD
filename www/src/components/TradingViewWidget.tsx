import React, { useEffect, useRef } from 'react'

const TradingViewWidget: React.FC<{ symbol?: string; autosize?: boolean }> = ({ symbol = 'BINANCE:BTCUSDT', autosize = true }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      // @ts-ignore
      if (window.TradingView && ref.current) {
        // @ts-ignore
        new window.TradingView.widget({
          autosize,
          symbol,
          interval: '60',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#000000',
          enable_publishing: false,
          hide_top_toolbar: false,
          container_id: ref.current.id,
        })
      }
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [symbol, autosize])

  return <div id={`tv-${Math.random().toString(36).slice(2, 9)}`} ref={ref} className="w-full h-96 bg-black/40 rounded-md overflow-hidden" />
}

export default TradingViewWidget
