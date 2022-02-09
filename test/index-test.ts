import NFTManager from "../index";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("index.ts", function () {
  const tokenURI_1 = "https://example.com/token/1";
  let owner: any = null;
  let user1: any = null;

  this.beforeAll(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    user1 = signers[1];
  });

  async function mineNBlocks(n: number) {
    const latestBlock = (await ethers.provider.getBlock("latest")).timestamp;
    await ethers.provider.send("evm_mine", [latestBlock + 1]).catch((e) => e);
    await new Promise((resolve: any) => setTimeout(resolve, 500));
    if (n > 0) {
      mineNBlocks(n - 1);
    }
  }

  it("deployContract should deploy the smart contarct", async () => {
    const nft = new NFTManager().connect(owner);
    mineNBlocks(5);
    const address = await nft.deployContract("Test NFT", "TNFT", owner.address);
    expect(address).to.not.equal(null);
  });

  it("initial owner is not always the contract creator", async () => {
    const nft = new NFTManager().connect(owner);
    mineNBlocks(5);
    const address = await nft.deployContract("Test NFT", "TNFT", user1.address);
    expect(address).to.not.equal(null);
  });

  it("mintNFT should create an NFT with the given contract and tokenURI", async () => {
    const nft = new NFTManager().connect(owner);
    mineNBlocks(5);
    const address = await nft.deployContract("Test NFT", "TNFT", owner.address);
    expect(address).to.not.equal(null);
    const txHash = await nft.mintNFT(address, tokenURI_1, owner.address);
    expect(txHash).to.not.equal(null);
  });

  it("getTokenID should return the tokenID of the NFT", async () => {
    const nft = new NFTManager().connect(owner);
    mineNBlocks(5);
    const address = await nft.deployContract("Test NFT", "TNFT", owner.address);
    const txHash = await nft.mintNFT(address, tokenURI_1, owner.address);
    await nft.mintNFT(address, tokenURI_1, owner.address);
    const tokenID = await nft.getTokenID(txHash);
    expect(tokenID).to.equal("1");
  });

  it("getTokenID should throw error for invalid transaction hash", async () => {
    const unknownTxHash =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    const nft = new NFTManager().connect(owner);
    mineNBlocks(5);
    const address = await nft.deployContract("Test NFT", "TNFT", owner.address);
    await nft.mintNFT(address, tokenURI_1, owner.address);
    let pass = false;
    await nft.getTokenID(unknownTxHash).catch((e) => {
      pass = true;
    });
    expect(pass).to.equal(true);
  });

  it("getTokenID should throw error for invalid contract address", async () => {
    const unknownContractAddress =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    const nft = new NFTManager().connect(owner);
    mineNBlocks(5);
    const address = await nft.deployContract("Test NFT", "TNFT", owner.address);
    const txHash = await nft.mintNFT(address, tokenURI_1, owner.address);
    let pass = false;
    await nft.getTokenID(txHash, unknownContractAddress).catch((e) => {
      pass = true;
    });
    expect(pass).to.equal(true);
  });

  it("getContract should return the contract instance", async () => {
    const nft = new NFTManager().connect(owner);
    mineNBlocks(5);
    const address = await nft.deployContract("Test NFT", "TNFT", owner.address);
    expect(address).to.not.equal(null);
    const contract = await nft.getContract(address);
    expect(contract).to.not.equal(null);
  });

  it.skip("verify should verify the contract on the blockchain", async () => {
    const nft = new NFTManager().connect(owner);
    mineNBlocks(5);
    const address = await nft.deployContract("Test NFT", "TNFT", owner.address);
    expect(address).to.not.equal(null);
    await nft.verify(address, "Test NFT", "TNFT");
  });
});
