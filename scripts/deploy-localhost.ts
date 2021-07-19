import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { NRPK__factory, NRPK } from "../typechain";

let nrpk: NRPK;
let nrpkFactory: NRPK__factory;
let deployer: SignerWithAddress;

const PROXY_REGISTRATION_ADDRESS = '0xa5409ec958c83c3f309868babaca7c86dcb077c1';

async function main() {
  [deployer] = await ethers.getSigners();
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
