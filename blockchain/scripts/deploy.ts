import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {

    const SupplyChain = await ethers.getContractFactory("SupplyChain");

    const supplyChain = await SupplyChain.deploy();

    await supplyChain.waitForDeployment();

    console.log("SupplyChain deployed to:");
    console.log(await supplyChain.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});