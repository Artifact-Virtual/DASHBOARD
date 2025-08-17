const nf = require('node-fetch')
const fetch = nf.default || nf

async function run() {
  try {
    const h = await fetch('http://127.0.0.1:4000/health')
    console.log('health status', h.status)
    const health = await h.text()
    console.log('health body', health)
  } catch (e) {
    console.error('health error', e.message)
  }

  try {
    const q = await fetch('http://127.0.0.1:4000/api/aggregator/quote?sellToken=0x4200000000000000000000000000000000000006&buyToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&sellAmount=1000000000000000000')
    console.log('quote status', q.status)
    const body = await q.text()
    console.log('quote body', body)
  } catch (e) {
    console.error('quote error', e.message)
  }
}

run()
