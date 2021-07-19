import { ethers } from "hardhat";
import { NRPK__factory, NRPK } from "../typechain";
// run:
// hh run --network rinkeby scripts/deploy-rinkeby.ts
// verify:
// hh verify --network rinkeby --contract contracts/NRPK.sol:NRPK <contract address> 0xf57b2c51ded3a29e6891aba85459d600256cf317
// https://rinkeby.etherscan.io/address/<contract address>

const INFURA_API_KEY = process.env.INFURA_API_KEY || '';
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || '';

const URL = `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`;
console.log(`url: ${URL}`);

let nrpk: NRPK;
let nrpkFactory: NRPK__factory;

const PROXY_REGISTRATION_ADDRESS = '0xf57b2c51ded3a29e6891aba85459d600256cf317';

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(URL);
  const deployer = new ethers.Wallet(RINKEBY_PRIVATE_KEY, provider);
  const address = await deployer.getAddress();
  console.log(`deployer address: ${address}`);

  nrpkFactory = (await ethers.getContractFactory(
    'NRPK',
    deployer
  )) as NRPK__factory;

  nrpk = (await nrpkFactory.deploy(PROXY_REGISTRATION_ADDRESS)) as NRPK;
  console.log("deployed to:", nrpk.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
