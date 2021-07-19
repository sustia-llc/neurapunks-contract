import dotenv from 'dotenv';
import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { NRPK } from "../typechain";

let deployer: SignerWithAddress;

// TODO: https://hardhat.org/guides/create-task.html
// hh run --network hardhat|localhost|rinkeby|mainnet scripts/mint.ts with tokenId parameter on commandline

const abi = [
  'function safeMint(address to, string metadataURI) public',
]
async function main() {
  dotenv.config();

  [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  console.log(`deployer address: ${address}`);

  const network = await ethers.provider.getNetwork();
  console.log(`network: ${network.name}`);

  var contractAddress = "";
  if (network.name === "rinkeby") {
    contractAddress = process.env.RINKEBY_CONTRACT_ADDRESS || '';
  } else if (network.name === "homestead") {
    contractAddress = process.env.MAINNET_CONTRACT_ADDRESS || '';
  }
  console.log(`contractAddress: ${contractAddress}`);

  const mintToAddress = process.env.MINT_TO_ADDRESS || '';
  console.log(`mintToAddress: ${mintToAddress}`);  

  const contract: NRPK = new ethers.Contract(contractAddress, abi, deployer) as NRPK;
  const mintTokenURI = 'ar://8_NZWr4K9d6N8k4TDbMzLAkW6cNQnSQMLeoShc8komM';

  const receipt: ContractTransaction = await contract.connect(deployer)
    .safeMint(mintToAddress, mintTokenURI,  { gasLimit: 300000 });

  console.log('minted:', receipt);
  process.exit(0)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });