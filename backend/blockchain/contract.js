require("dotenv").config();

const { ethers } = require("ethers");

const contractData = require("../../blockchain/artifacts/contracts/SupplyChain.sol/SupplyChain.json");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(
    process.env.BLOCKCHAIN_PRIVATE_KEY,
    provider
);

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const contract = new ethers.Contract(
    contractAddress,
    contractData.abi,
    wallet
);

module.exports = contract;