import { ethers, web3, run, artifacts } from "hardhat";
import { Contract, Signer } from "ethers";

export default class NFTManager {
  private signer: any;
  private contractName: string;

  /**
   * Create an instance of NFTManager
   * @param contractName Name of the smart contract (e.g. "NFT")
   * @param rpcUrl (optional) RPC url of the node
   * @param privateKey (optional) Private key of the account
   */
  public constructor(
    contractName: string = "NFT",
    rpcUrl?: string,
    privateKey?: string
  ) {
    this.contractName = contractName;
    if (rpcUrl && privateKey) {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      this.signer = new ethers.Wallet(privateKey, provider);
    }
  }

  /**
   * Add a signer to the NFTManager
   * @param signer Signer of the account
   * @returns NFTManager instance
   */
  public connect(signer: Signer): NFTManager {
    this.signer = signer;
    return this;
  }

  /**
   * Deploy a new NFT smart contract
   * @param tokenName Name of the token
   * @param tokenSymbol Symbol of the token
   * @returns Address of the deployed contract
   */
  public async deployContract(
    tokenName: string,
    tokenSymbol: string,
    owner: string
  ): Promise<string> {
    if (!this.signer) {
      throw new Error("Signer is not set");
    }

    const NFT = (await ethers.getContractFactory(this.contractName)).connect(
      this.signer
    );
    const contract = await NFT.deploy(tokenName, tokenSymbol, owner);

    await contract.deployed();
    await this.txWait(contract.deployTransaction.hash, 2);

    return contract.address;
  }

  /**
   *  Verify the NFT smart contract
   * @param contractAddress Address of the contract
   * @param args Arguments of the function
   */
  public async verify(contractAddress: string, ...args: any[]) {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    }).catch((e: Error) => {
      if (!e.message.toLowerCase().includes("already verified")) {
        throw e;
      }
    });
  }

  /**
   * Mint a new NFT
   * @param contractAddress Address of the contract
   * @param tokenURI URI of the token
   */
  public async mintNFT(
    contractAddress: string,
    tokenURI: string,
    artist: string
  ): Promise<string> {
    if (!this.signer) {
      throw new Error("Signer is not set");
    }
    const contract = await this.getContract(contractAddress);

    const tx = await contract.mint(tokenURI, artist);
    return tx.hash;
  }

  /**
   * Get the token ID associated with a transaction
   * @param txHash Transaction hash
   * @param contractAddress (Optional) Address of the contract
   * @returns The token ID associated with the transaction hash
   */
  public async getTokenID(
    txHash: string,
    contractAddress?: string
  ): Promise<string> {
    if (contractAddress == null) {
      contractAddress = (await this.signer.provider.getTransaction(txHash)).to;
    }
    const abi = (await artifacts.readArtifact(this.contractName)).abi;
    const web3Contract = new web3.eth.Contract(abi, contractAddress);
    const events = await web3Contract.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
    });
    const event = events.find((e: any) => e.transactionHash === txHash);
    if (event == null || event.returnValues.tokenId == null) {
      throw new Error("Event not found");
    }
    return event.returnValues.tokenId;
  }

  /**
   * Get the smart contract instance
   * @param contractAddress Address of the contract
   * @returns NFT contract instance
   */
  public async getContract(contractAddress: string): Promise<Contract> {
    if (!this.signer) {
      throw new Error("Signer is not set");
    }

    const NFT = (await ethers.getContractFactory(this.contractName)).connect(
      this.signer
    );
    return NFT.attach(contractAddress);
  }

  /**
   * Wait for a transaction confirmations on the network
   * @param txHash Transaction hash
   * @param confirmations Number of confirmations to wait for
   */
  public async txWait(txHash: string, confirmations: number) {
    if (!this.signer) {
      throw new Error("Signer is not set");
    }

    const provider = this.signer.provider;
    const tx = await provider.getTransaction(txHash);
    let currentBlock = await provider.getBlockNumber();
    while (currentBlock - tx.blockNumber < confirmations) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      currentBlock = await provider.getBlockNumber();
    }
  }
}
