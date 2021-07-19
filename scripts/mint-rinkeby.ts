import dotenv from 'dotenv';
import { ContractTransaction, ethers } from "ethers";
import { NRPK } from "../typechain";

// TODO: https://hardhat.org/guides/create-task.html with tokenURI parameter on commandline
// hh run --network rinkeby scripts/mint-rinkeby.ts
// https://rinkeby.etherscan.io/address/<contract address>

const abi = [
  'function safeMint(address to, string metadataURI) public',
]

async function main() {
  dotenv.config();
  const INFURA_API_KEY = process.env.INFURA_API_KEY || '';
  const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || '';
  const URL = `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`;
  console.log(`url: ${URL}`);

  const provider = new ethers.providers.JsonRpcProvider(URL);
  const deployer = new ethers.Wallet(RINKEBY_PRIVATE_KEY, provider);
  const deployerAddress = await deployer.getAddress();
  console.log(`deployer address: ${deployerAddress}`);

  const contractAddress = process.env.RINKEBY_CONTRACT_ADDRESS || '';
  console.log(`contractAddress: ${contractAddress}`);
  const mintToAddress = process.env.MINT_TO_ADDRESS || '';
  console.log(`mintToAddress: ${mintToAddress}`);  

  const contract: NRPK = new ethers.Contract(contractAddress, abi, deployer) as NRPK;
  const mintTokenURI = 'ar://8_NZWr4K9d6N8k4TDbMzLAkW6cNQnSQMLeoShc8komM';

  const receipt: ContractTransaction = await contract.connect(deployer)
    .safeMint(mintToAddress, mintTokenURI, { gasLimit: 3000000 });

  console.log('minted:', receipt);
  process.exit(0)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });