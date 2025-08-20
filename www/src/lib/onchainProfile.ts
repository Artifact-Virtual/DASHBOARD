
// Pinata IPFS upload using JWT from .env.master (PINATA_JWT)
export async function uploadJsonToIpfs(obj: any): Promise<string> {
  const jwt = (process.env.PINATA_JWT || (window as any).PINATA_JWT) as string | undefined;
  if (!jwt) throw new Error('Missing Pinata JWT. Set PINATA_JWT in your env.');
  const json = JSON.stringify(obj);
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({ pinataContent: obj }),
  });
  if (!res.ok) throw new Error('Pinata upload failed: ' + res.status);
  const data = await res.json();
  if (!data.IpfsHash) throw new Error('Pinata upload: No IpfsHash in response');
  return `ipfs://${data.IpfsHash}`;
}

export async function readProfileFromIpfs(cid: string): Promise<any> {
  const url = cid.startsWith('ipfs://') ? `https://gateway.pinata.cloud/ipfs/${cid.slice(7)}` : cid;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`IPFS fetch failed: ${res.status}`);
  return res.json();
}

export default { uploadJsonToIpfs, readProfileFromIpfs }
