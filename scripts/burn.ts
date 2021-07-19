import dotenv from 'dotenv';
import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { NRPK } from "../typechain";

let deployer: SignerWithAddress;

// TODO: https://hardhat.org/guides/create-task.html
// hh run --network hardhat|localhost|rinkeby|mainnet scripts/burn.ts with tokenId parameter on commandline

const abi = [
  'function burn(uint256 tokenId ) public',
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

  const contract: NRPK = new ethers.Contract(contractAddress, abi, deployer) as NRPK;
  const tokenId = ethers.BigNumber.from(0);
  const receipt: ContractTransaction = await contract.connect(deployer)
    .burn(tokenId, { gasLimit: 300000 });

  console.log('burned:', receipt);
  process.exit(0)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });