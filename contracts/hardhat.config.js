require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: '0.8.21',
  paths: {
    // sources live in ./src to avoid accidental node_modules solidity files
    sources: './src',
    // keep artifacts and cache inside the contracts folder
    artifacts: './artifacts',
    cache: './cache'
  },
  external: {
    // Treat solidity files inside node_modules as external to avoid being treated as local sources
    contracts: [
      './node_modules/**'
    ]
  },
  networks: {
    hardhat: {
      chainId: 1337,
    }
  }
};
