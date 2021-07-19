import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { NRPK__factory, NRPK } from "../typechain";

let nrpk: NRPK;
let nrpkFactory: NRPK__factory;
let deployer: SignerWithAddress;

//hh run --network hardhat|localhost|rinkeby|mainnet scripts/deploy-rinkeby.ts

async function main() {
  var PROXY_REGISTRATION_ADDRESS = '0xa5409ec958c83c3f309868babaca7c86dcb077c1';
  const network = await ethers.provider.getNetwork();
  console.log(`network: ${network.name}`);
  
  if (network.name === "rinkeby") {
    console.log('using opensea registration address for rinkeby');
    PROXY_REGISTRATION_ADDRESS = '0xf57b2c51ded3a29e6891aba85459d600256cf317';
  }

  [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  console.log(`deployer address: ${address}`);

  const nrpkFactory = (await ethers.getContractFactory(
    'NRPK',
    deployer
  )) as NRPK__factory;

  console.log('Deploying NRPK...');
  const nrpk = await nrpkFactory.deploy(PROXY_REGISTRATION_ADDRESS);
  await nrpk.deployed();

  console.log('NRPK deployed to:', nrpk.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });