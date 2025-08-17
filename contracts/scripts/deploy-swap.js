const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SimpleSwap contract to Base network...");
  
  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy SimpleSwap
  const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
  const simpleSwap = await SimpleSwap.deploy();
  
  await simpleSwap.deployed();
  
  console.log("✅ SimpleSwap deployed to:", simpleSwap.address);
  
  // Initialize with supported tokens for Base network
  const WETH = "0x4200000000000000000000000000000000000006"; // Base WETH
  const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC
  const ALB_TOKEN = "0xA4093669DAFbD123E37d52e0939b3aB3C2272f44"; // ARCx LP Token
  
  console.log("🔧 Adding supported tokens...");
  
  // Add USDC as supported token (WETH is added by default in constructor)
  try {
    const tx1 = await simpleSwap.addSupportedToken(USDC);
    await tx1.wait();
    console.log("✅ USDC added as supported token");
  } catch (error) {
    console.log("⚠️ USDC might already be supported or error:", error.message);
  }
  
  // Add ALB token as supported
  try {
    const tx2 = await simpleSwap.addSupportedToken(ALB_TOKEN);
    await tx2.wait();
    console.log("✅ ALB token added as supported token");
  } catch (error) {
    console.log("⚠️ ALB token might already be supported or error:", error.message);
  }
  
  // Create initial liquidity pools
  console.log("🏊 Creating liquidity pools...");
  
  try {
    // Create WETH/USDC pool with 0.3% fee (30 basis points)
    const tx3 = await simpleSwap.createPool(WETH, USDC, 30);
    await tx3.wait();
    console.log("✅ WETH/USDC pool created");
  } catch (error) {
    console.log("⚠️ WETH/USDC pool creation error:", error.message);
  }
  
  try {
    // Create WETH/ALB pool with 0.5% fee (50 basis points)
    const tx4 = await simpleSwap.createPool(WETH, ALB_TOKEN, 50);
    await tx4.wait();
    console.log("✅ WETH/ALB pool created");
  } catch (error) {
    console.log("⚠️ WETH/ALB pool creation error:", error.message);
  }
  
  try {
    // Create USDC/ALB pool with 0.3% fee (30 basis points)
    const tx5 = await simpleSwap.createPool(USDC, ALB_TOKEN, 30);
    await tx5.wait();
    console.log("✅ USDC/ALB pool created");
  } catch (error) {
    console.log("⚠️ USDC/ALB pool creation error:", error.message);
  }
  
  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log("SimpleSwap Contract:", simpleSwap.address);
  console.log("Network: Base Mainnet");
  console.log("Deployer:", deployer.address);
  console.log("Gas Used: ~2.5M gas");
  console.log("\n🔗 Supported Tokens:");
  console.log("WETH:", WETH);
  console.log("USDC:", USDC);
  console.log("ALB:", ALB_TOKEN);
  
  console.log("\n📝 Next Steps:");
  console.log("1. Update CONTRACTS.SIMPLE_SWAP in useSimpleSwap.ts with:", simpleSwap.address);
  console.log("2. Add initial liquidity to pools");
  console.log("3. Test swap functionality");
  console.log("4. Verify contract on BaseScan");
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    simpleSwap: simpleSwap.address,
    network: "base",
    tokens: {
      WETH,
      USDC,
      ALB_TOKEN
    },
    deploymentDate: new Date().toISOString(),
    deployer: deployer.address
  };
  
  fs.writeFileSync('./deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
