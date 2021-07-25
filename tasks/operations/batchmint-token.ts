import { task, types } from "hardhat/config";
import { ContractTransaction } from "ethers";
import { NRPK } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { TASK_BATCHMINT } from "../task-names";
// hh mint-token --network rinkeby|mainnet|localhost --metadata-uri ar://8_NZWr4K9d6N8k4TDbMzLAkW6cNQnSQMLeoShc8komM
task(TASK_BATCHMINT, "Batch mints tokens with token metadata uris")
  .addParam("metadataUris", "The token URI", null, types.string)
  .setAction(async ({ metadataUris }, hre) => {
    const abi = [
      'function safeBatchMint(address to, string[] metadataURIs) public',
    ]

    //TODO parse comma delimited to Arr
    var metadataUriArr: string[] = metadataUris.split(',');

    console.log('mintTokenURIs:', metadataUriArr);

    let deployer: SignerWithAddress;

    [deployer] = await hre.ethers.getSigners();
    const address = await deployer.getAddress();
    console.log(`deployer address: ${address}`);

    const network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    var contractAddress = "";
    if (network.name === "rinkeby") {
      contractAddress = process.env.RINKEBY_CONTRACT_ADDRESS || '';
    } else if (network.name === "homestead") {
      contractAddress = process.env.MAINNET_CONTRACT_ADDRESS || '';
    } else if (network.name === "unknown") { //localhost network
      contractAddress = process.env.LOCALHOST_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const mintToAddress = process.env.MINT_TO_ADDRESS || '';
    console.log(`mintToAddress: ${mintToAddress}`);

    const contract: NRPK = new hre.ethers.Contract(contractAddress, abi, deployer) as NRPK;

    const receipt: ContractTransaction = await contract.connect(deployer)
      .safeBatchMint(mintToAddress, metadataUriArr, { gasLimit: 500000 });

    console.log('minted:', receipt);
    process.exit(0)
  });