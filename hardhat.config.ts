import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import "hardhat-typechain";
import "solidity-coverage";
import { ContractTransaction } from "ethers";
import { NRPK } from "./typechain";

task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// hh burntoken --network rinkeby|mainnet --token-id 22
task("burntoken", "Burns a token by token id")
    .addParam("tokenId", "The token id")
    .setAction(async (args, hre) => {
        const abi = [
            'function burn(uint256 tokenId ) public',
        ]

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
        }
        console.log(`contractAddress: ${contractAddress}`);  

        const contract: NRPK = new hre.ethers.Contract(contractAddress, abi, deployer) as NRPK;
        const tokenId = args['tokenId'];
        console.log('burning:', tokenId)
        const receipt: ContractTransaction = await contract.connect(deployer)
          .burn(tokenId, { gasLimit: 300000 });
      
        console.log('burned:', receipt);
        process.exit(0)
    });

// hh minttoken --network rinkeby|mainnet --metadata-uri ar://8_NZWr4K9d6N8k4TDbMzLAkW6cNQnSQMLeoShc8komM
task("minttoken", "Mints a token with token metadata uri")
    .addParam("metadataUri", "The token URI")
    .setAction(async (args, hre) => {
        const abi = [
            'function safeMint(address to, string metadataURI) public',
          ]

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
        }
        console.log(`contractAddress: ${contractAddress}`);  

        const mintToAddress = process.env.MINT_TO_ADDRESS || '';
        console.log(`mintToAddress: ${mintToAddress}`);  

        const contract: NRPK = new hre.ethers.Contract(contractAddress, abi, deployer) as NRPK;
        const mintTokenURI = args['metadataUri'];
        console.log('mintTokenURI:', mintTokenURI)

        const receipt: ContractTransaction = await contract.connect(deployer)
        .safeMint(mintToAddress, mintTokenURI, { gasLimit: 300000 });
    
        console.log('minted:', receipt);
        process.exit(0)
    });

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const MAINNET_PRIVATE_KEY =
    process.env.MAINNET_PRIVATE_KEY ||
    "";
const RINKEBY_PRIVATE_KEY =
    process.env.RINKEBY_PRIVATE_KEY ||
    "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [{ version: "0.8.6", settings: {} }],
    },
    networks: {
        hardhat: {},
        localhost: {},
        mainnet: {
            url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [MAINNET_PRIVATE_KEY],
            gasPrice: 50000000000, // 50 gwei,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [RINKEBY_PRIVATE_KEY],
            gasPrice: 50000000000, // 50 gwei,
        },
        coverage: {
            url: "http://127.0.0.1:8555", // Coverage launches its own ganache-cli client
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: ETHERSCAN_API_KEY,
    },
};

export default config;