import NFTManager from '../index';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe("index.ts", function () {
    const tokenURI_1 = "https://example.com/token/1";
    let owner: any = null;

    this.beforeAll(async () => {
        const signers = await ethers.getSigners();
        owner = signers[0];
    });

    async function mineNBlocks(n: number) {
        const latestBlock = (await ethers.provider.getBlock("latest")).timestamp;
        await ethers.provider.send("evm_mine", [latestBlock + 1]);
        await new Promise((resolve: any) => setTimeout(resolve, 500));
        if (n > 0) {
            mineNBlocks(n - 1);
        }
    }

    it("deployContract should deploy the smart contarct", async () => {
        const nft = (new NFTManager()).connect(owner);
        mineNBlocks(5);
        const address = await nft.deployContract("Test NFT", "TNFT");
        expect(address).to.not.equal(null);
    });

    it("mintNFT should create an NFT with the given contract and tokenURI", async () => {
        const nft = (new NFTManager()).connect(owner);
        mineNBlocks(5);
        const address = await nft.deployContract("Test NFT", "TNFT");
        expect(address).to.not.equal(null);
        const tx = await nft.mintNFT(address, tokenURI_1);
        expect(tx.hash).to.not.equal(null);
    });

    it.skip("verify should verify the contract on the blockchain", async () => {
        const nft = (new NFTManager()).connect(owner);
        mineNBlocks(5);
        const address = await nft.deployContract("Test NFT", "TNFT");
        expect(address).to.not.equal(null);
        await nft.verify(address, "Test NFT", "TNFT");
    });
});