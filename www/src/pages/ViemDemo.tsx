import React, { useEffect, useState } from 'react'
import { getPublicClient } from '@/lib/viemClient'

const ViemDemo: React.FC = () => {
  const [block, setBlock] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
    const client = getPublicClient()

  async function load() {
      try {
    const bn = await client.getBlockNumber()
    setBlock(Number(bn))

    const bal = await client.getBalance({ address: '0x0000000000000000000000000000000000000000' })
    setBalance(bal.toString())
      } catch (err) {
        console.error('viem demo error', err)
      }
    }

    load()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Viem Demo</h2>
      <p>Latest block: {block ?? 'loading...'}</p>
      <p>Balance (zero address): {balance ?? 'loading...'}</p>
    </div>
  )
}

export default ViemDemo
