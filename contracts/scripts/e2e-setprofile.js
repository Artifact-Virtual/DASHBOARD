const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

  // Hardhat default account 0 private key (local testing only)
  const pk = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const wallet = new ethers.Wallet(pk, provider);

  const registryAddress = process.env.PROFILE_REGISTRY_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const abi = [
    'function setProfile(string calldata cid) external',
    'function getProfile(address owner) external view returns (string memory)'
  ];

  const registry = new ethers.Contract(registryAddress, abi, wallet);
  const testCid = 'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/test-profile.json';

  console.log('Sending setProfile tx with CID:', testCid);
  const tx = await registry.setProfile(testCid);
  console.log('tx hash:', tx.hash);
  await tx.wait();
  console.log('tx mined. Fetching profile...');
  const stored = await registry.getProfile(wallet.address);
  console.log('Stored CID:', stored);
}

main().catch((err) => { console.error(err); process.exitCode = 1; });
