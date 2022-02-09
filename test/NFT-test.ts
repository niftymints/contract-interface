import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFT.sol", function () {
  let smartContract: any;
  let [owner, user1, user2]: any[] = [];
  const tokenURI_1 = "https://example.com/token/1";
  const tokenURI_2 = "https://example.com/token/2";

  this.beforeAll(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    user1 = signers[1];
    user2 = signers[2];
  });

  this.beforeEach(async () => {
    const myNFT = await ethers.getContractFactory("NFT");
    smartContract = await myNFT.deploy("Test NFT", "TNFT", owner.address);
  });

  it("NFT is minted successfully", async () => {
    expect(await smartContract.balanceOf(owner.address)).to.equal(0);
    await smartContract.connect(owner).mint(tokenURI_1, owner.address);

    expect(await smartContract.balanceOf(owner.address)).to.equal(1);
  });

  it("tokenURI is set sucessfully", async () => {
    await smartContract.connect(owner).mint(tokenURI_1, owner.address);
    await smartContract.connect(owner).mint(tokenURI_2, owner.address);

    expect(await smartContract.tokenURI(1)).to.equal(tokenURI_1);
    expect(await smartContract.tokenURI(2)).to.equal(tokenURI_2);
  });

  it("mint should be accessible to only the owner", async () => {
    let pass = false;
    await smartContract.connect(owner).mint(tokenURI_1, owner.address);
    try {
      await smartContract.connect(user1).mint(tokenURI_1, user1.address);
    } catch {
      pass = true;
    }
    expect(pass).to.equal(true);
  });

  it("transferFrom should only be accessible to token owner of the NFT", async () => {
    let pass = false;
    await smartContract.connect(owner).mint(tokenURI_1, owner.address);
    await smartContract
      .connect(owner)
      .transferFrom(owner.address, user1.address, 1);
    try {
      await smartContract
        .connect(owner)
        .transferFrom(user1.address, owner.address, 1);
    } catch {
      pass = true;
    }
    expect(pass).to.equal(true);
  });
});
