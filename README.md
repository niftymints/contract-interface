
# contract-interface 🦍
Programmatically deploy and interact with NFT smart contracts.
Deployed contracts and their NFTs are compatible with [OpenSea](https://opensea.io/), [Rarible](https://rarible.com/).

Bootstrapped with [Hardhat](https://hardhat.org/) and Solidity 0.8.9.

<a href="https://trackgit.com">
<img src="https://us-central1-trackgit-analytics.cloudfunctions.net/token/ping/kydbvcpuvqnnmmccnjky" alt="trackgit-views" />
</a>


## Installation
```
npm i @niftymints/contract-interface --save
```
Import class
```
import NFTManager from "@niftymints/contract-interface"
```

### Supported functions
#### NFTManager
* **constructor** (rpcURL: string, privateKey: string) - Optionally accepts rpc URL (Alchemy, Infura, etc.) and private key of wallet. If left blank, use ``connect`` function to assign a signer.
* **connect** (signer: Signer): void - Set the signer
* **deployContract** (tokenName: string, tokenSymbol: string): Promise<string> - Deploy `NFT.sol` with the given args. Returns the contract address.
* **mintNFT** (contractAddress: string, tokenURI: string, artist: string): Promise<string> - Mint a new NFT. Returns the transaction hash. The minted NFT is set to belong to the artist.
* **getContract** (contractAddress: string): Promise<Contract> - Get the deployed instanced of a smart contract. Can be used to execute functions in the smart contract.
* **txWait** (txHash: string, confirmations: number): Promise<void> - Wait for block confirmations of the transaction.
* **verify** (contractAddress: string, ...args: any[]): Promise<void> - Verify the smart contract on the blockchain. Requires `POLYGONSCAN_KEY` environment variable to be set.

### Examples
##### Deploy a contract
```
import NFTManager from "@niftymints/contract-interface";

const rpcURL = "<rpc-url>";
const privateKey = "<wallet-key>";

async function deploy() {
    const nft = new NFTManager(rpcURL, privateKey);
    const address = await nft.deployContract("Test NFT", "TNFT");
}

async function depoyWithSigner(signer) {
    const nft = (new NFTManager()).connect(signer);
    const address = await nft.deployContract("Test NFT", "TNFT");
}
```

##### Mint NFT
```
import NFTManager from "@niftymints/contract-interface";

const rpcURL = "<rpc-url>";
const privateKey = "<wallet-key>";

async function mintNFT(tokenURI) {
    const nft = new NFTManager(rpcURL, privateKey);
    const address = await nft.deployContract("Test NFT", "TNFT");
    const txHash = await nft.mintNFT(address, tokenURI);
    
    console.log(txHash)
}
```



### Local development
```
npm i                   # install
npx hardhat compile     # compile
npx hardhat test        # unit test
```
#### Deploy on-chain
Create a ``.env`` file at the root directory with the following variables:
* **POLYGONSCAN_KEY**: Polygonscan API key [[video tutorial](https://youtu.be/51IC0dZGTbg)]
* **ALCHEMY_PROD_URL**: Alchemy project key (prod env) [[video tutorial](https://youtu.be/tfggWxfG9o0)]
* **ALCHEMY_DEV_URL**: Alchemy project key (dev env) [[video tutorial](https://youtu.be/tfggWxfG9o0)]
* **PRIVATE_KEY_DEV**: Crypto wallet account private key. You can request some ``MATIC`` tokens from the [polygon faucet](https://faucet.polygon.technology/).
* **PRIVATE_KEY_PROD**: Crypto wallet account private key. Can be the same as PRIVATE_KEY_DEV but I like to use two separate accounts for dev and prod.

Deploy to [Polygon mumbai testnet](https://mumbai.polygonscan.com/)
```
npx hardhat deploy --network mumbai_dev
```
Deploy to [Polygon mainnet](https://polygonscan.com/)
```
npx hardhat deploy --network matic_prod
```
**Note:** Please ensure you have the minimum number of ``MATIC`` tokens in your wallet (roughly 0.008 `MATIC`, or $0.20 USD - [see latest MATIC-USD rate](https://coinmarketcap.com/currencies/polygon/))

Deploy to [Ethereum mainnet](https://etherscan.io/) (untested)
```
npx hardhat deploy --network eth_prod
```

### Contributing 👋
Contributions are always welcome! Feel free to open any issue or send a pull request.
For questions, please contact [shanzid.com](shanzid.com).