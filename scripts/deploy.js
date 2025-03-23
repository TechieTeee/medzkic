import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners(); // Get the deployer account
  console.log("Deploying from:", deployer.address);

  const MedZKic = await ethers.getContractFactory("MedZKic");
  const medzkic = await MedZKic.deploy();
  await medzkic.waitForDeployment();

  const address = await medzkic.getAddress(); // Get deployed address
  console.log("MedZKic deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });