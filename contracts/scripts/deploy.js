const hre = require('hardhat');

async function main() {
  await hre.run('compile');

  const ProfileRegistry = await hre.ethers.getContractFactory('ProfileRegistry');
  const registry = await ProfileRegistry.deploy();
  await registry.deployed();

  console.log('ProfileRegistry deployed to:', registry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
