import { ethers } from "hardhat";
import chai from "chai";
import { NRPK__factory, NRPK } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const { expect } = chai;

let nrpk: NRPK;
let nrpkFactory: NRPK__factory;
let deployer: SignerWithAddress;
let other: SignerWithAddress;

const PROXY_REGISTRATION_ADDRESS = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

describe("nrpk", () => {

    beforeEach(async () => {
        [deployer, other] = await ethers.getSigners();
        nrpkFactory = (await ethers.getContractFactory(
            'NRPK',
            deployer
        )) as NRPK__factory;

        nrpk = (await nrpkFactory.deploy(PROXY_REGISTRATION_ADDRESS)) as NRPK;
        expect(nrpk.address).to.properAddress;
    });

    describe("deployment", async () => {
        it('deployer is owner', async () => {
            expect(await nrpk.owner()).to.equal(deployer.address);
        });

        it("has expected name and symbol", async function () {
            expect(await nrpk.name()).to.equal("NeuraPunks");
            expect(await nrpk.symbol()).to.equal("NRPK");
        });
    });

    describe("minting", async () => {
        it('contract owner can mint tokens', async () => {
            const tokenId = ethers.BigNumber.from(0);
            const tokenURI = "https://eth.iwahi.com/1df0";

            await expect(nrpk.connect(deployer).safeMint(other.address, tokenURI))
                .to.emit(nrpk, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId)
                .to.emit(nrpk, 'PermanentURI')
                .withArgs(tokenURI, tokenId);

            expect(await nrpk.balanceOf(other.address)).to.equal(1);
            expect(await nrpk.ownerOf(tokenId)).to.equal(other.address);
            expect(await nrpk.tokenURI(tokenId)).to.equal(tokenURI);
        });

        it('other accounts cannot mint tokens', async () => {
            const tokenURI = "https://eth.iwahi.com/2d3a";
            await expect(nrpk.connect(other).safeMint(other.address, tokenURI))
                .to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe("burning", async () => {
        it('holders can burn their tokens', async () => {
            const tokenId = ethers.BigNumber.from(0);
            const tokenURI = "https://eth.iwahi.com/e01b";

            await expect(nrpk.connect(deployer).safeMint(other.address, tokenURI))
                .to.emit(nrpk, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId);

            await expect(nrpk.connect(other).burn(tokenId))
                .to.emit(nrpk, 'Transfer')
                .withArgs(other.address, ZERO_ADDRESS, tokenId);
            expect(await nrpk.balanceOf(other.address)).to.equal(0);
            await expect(nrpk.ownerOf(tokenId))
                .to.be.revertedWith('ERC721: owner query for nonexistent token');
            expect(await nrpk.totalSupply()).to.equal(0);
        });

        it('cannot burn if not token owner', async () => {
            const tokenId = ethers.BigNumber.from(0);
            const tokenURI = "https://eth.iwahi.com/e01b";

            await expect(nrpk.connect(deployer).safeMint(other.address, tokenURI))
                .to.emit(nrpk, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId);

            await expect(nrpk.connect(deployer).burn(tokenId))
                .to.be.revertedWith('function call to a non-contract account');

            expect(await nrpk.balanceOf(other.address)).to.equal(1);
            expect(await nrpk.totalSupply()).to.equal(1);
        });
    });
});


