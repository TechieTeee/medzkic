import hre from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = hre;

async function main() {
  // Use a public Holesky RPC
  const provider = new ethers.JsonRpcProvider("https://holesky.rpc.thirdweb.com");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying from:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Balance (raw):", balance.toString());
  console.log("Balance (ETH):", ethers.formatEther(balance.toString()));

  const network = await provider.getNetwork();
  console.log("Network:", network);

  // Deploy contract
  const MedZKic = await ethers.getContractFactory("MedZKic", wallet);
  const medzkic = await MedZKic.deploy({
    gasLimit: 3000000,
    gasPrice: ethers.parseUnits("10", "gwei"),
  });
  await medzkic.waitForDeployment();

  const address = await medzkic.getAddress();
  console.log("MedZKic deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });