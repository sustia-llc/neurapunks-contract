# NRPK for OpenSea
Adapted for hardhat from https://github.com/ProjectOpenSea/opensea-creatures. Uses Arweave to store contract and image metadata.

Contract Features: Mintable with Auto Increment Ids, Burnable, Enumerable, URI Storage

Access Control: Ownable

Whitelists OpenSea's trading address


## Quick start

```sh
git clone https://github.com/dynamiculture/neurapunks-contract
cd neurapunks-contract
npm i
# list hardhat tasks:
npx hardhat
```
## Install hardhat-shorthand
```sh
npm i -g hardhat-shorthand
hardhat-completion install
# hh == npx hardhat
```
## Create Infura and Etherscan Accounts
Create free accounts on:
* https://infura.io
* https://etherscan.io

Create .env (listed in .gitignore). **Important!** Do **not** check in .env to public repo:
```sh
cp .env.sample .env
```
enter the following values into .env:
* INFURA_API_KEY=
* ETHERSCAN_API_KEY=

## Deploy and test locally

Clean, compile and test:
```sh
hh clean
hh compile
hh test
hh coverage
```
## Local deployment
```sh
hh node
```
In a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
hh run --network localhost scripts/deploy-localhost.ts
```

## Set up Metadata and Image for Contract
```sh
npx arweave key-save <json file>

npx arweave deploy assets/neurapunks.png
```

After Arweave deployment, update value for "image" in nrpk-contract.json. Deploy nrpk-contract.json:
```sh
npx arweave deploy assets/nrpk-contract.json
```

Update "contractURI" in contracts/NRPK.sol

## Set up Metadata and Images for First Minted Work
Upload image as a 512x512 png:
```sh
npx arweave deploy assets/nrpk-0.png
```

After Arweave deployment, update "image" with the resulting Arweave URL in neurapunk-0.json.

Deploy neurapunk-0.json:
```sh
npx arweave deploy assets/neurapunk-0.json
```

Update mintTokenURI in scripts/mint-rinkeby.ts and scripts/mint-mainnet.ts with Arweave path to token metadata file

## Deploy to Rinkeby
Get ether on Rinkeby:
https://faucet.rinkeby.io/

Supply the private key of the contract owner in .env:
* RINKEBY_PRIVATE_KEY=

Deploy contract to Rinkeby:
```sh
hh run --network rinkeby scripts/deploy-rinkeby.ts
```
Note the deployed contract's address and update value in .env:
* RINKEBY_CONTRACT_ADDRESS=

### Verify on Rinkeby
Run the following command, by providing the new contract address. The last value is a constructor argument, OpenSea's proxy address on Rinkeby:
```sh
hh verify --network rinkeby --contract contracts/NRPK.sol:NRPK <contract-address> 0xf57b2c51ded3a29e6891aba85459d600256cf317
```
### Check code and abi on Rinkeby
Visit the following URL, by providing the new contract address:
https://rinkeby.etherscan.io/address/_contract-address_

### Mint to Rinkeby
Verify mintTokenURI in `mint-rinkeby.ts` then run:
```sh
hh run --network rinkeby scripts/mint-rinkeby.ts
```

### Check contract on OpenSea
Go to https://testnets.opensea.io/ connect wallet using the Rinkeby network. Choose "My Collections" and "Import an existing smart contract". Enter the Rinkeby Contract Address.

### Burn Token on Rinkeby
Verify tokenId in `burn-rinkeby.ts` then run:
```sh
hh run --network rinkeby scripts/burn-rinkeby.ts
```
Token will be transferred to the zero address and marked as nonexistent token

## Deploy to mainnet
```sh
hh run --network mainnet scripts/deploy-mainnet.ts
```

note the depoloyed contract's address and update value in .env:
* MAINNET_CONTRACT_ADDRESS=

### Verify on mainnet
Run the following command, by providing the new contract address. The last value is a constructor argument, OpenSea's proxy address on mainnet:
```sh
hh verify --network mainnet --contract contracts/NRPK.sol:NRPK <contract-address> 0xa5409ec958c83c3f309868babaca7c86dcb077c1
```
### Check code and abi on mainnet
Visit the following URL, by providing the new contract address:
https://etherscan.io/address/_contract-address__#code

### Mint to mainnet
Verify mintTokenURI in `mint-mainnet.ts` then run:
```sh
hh run --network mainnet scripts/mint-mainnet.ts
```

### Check contract on OpenSea
Go to https://opensea.io/ and connect wallet using the mainnet network. Choose "My Collections" and "Import an existing smart contract". Enter the mainnet Contract Address.