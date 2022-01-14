
# contract-interface 🦍
Programmatically deploy and interact with NFT smart contracts.
Deployed contracts and their NFTs are compatible with [OpenSea](https://opensea.io/), [Rarible](https://rarible.com/), and other markeplaces which support [ERC-721](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721) NFTs.

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

## Supported functions
### NFTManager
#### constructor (contractName: string = "NFT", rpcURL?: string, privateKey?: string)
Initialize the NFTManager using the name of the smart contract (default is "NFT"). Optionally also accepts rpc URL (Alchemy, Infura, etc.) and private key of wallet. If rpcURL and privateKey are left blank, use ``connect`` function to set a signer. Example:
```
const nft = new NFTManager("NFT", rpcUrl, privateKey);
 
// or without any arguments:
// const nft2 = new NFTManager();
// nft2.connect(signer);
```

#### connect (signer: Signer): NFTManager
Set the signer. Example:
```
nft.connect(signer);
```

#### deployContract (tokenName: string, tokenSymbol: string): Promise&lt;string&gt;
Deploy `NFT.sol` with the given constructor args. Returns the contract address. Example:
```
const contractAddress = await nft.deployContract("name", "symbol");
```

#### mintNFT (contractAddress: string, tokenURI: string, artist: string): Promise&lt;string&gt;
Mint a new NFT belonging to the given artist. Returns the transaction hash. Example:
```
const txHash = await nft.mintNFT(contractAddress, tokenURI, artist);
```

#### txWait (txHash: string, confirmations: number): Promise&lt;void&gt;
Wait for block confirmations of the transaction. Example:
```
await nft.txWait(txHash, 5); // wait for 5 block confirmations
```

#### getContract (contractAddress: string): Promise&lt;Contract&gt;
Get the deployed instanced of a smart contract. Can be used to execute functions in the smart contract ([`ERC721URIStorage`](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage)). Example:
```
const myContract = await nft.getContract(contractAddress);

await myContract.transfer(from, to, tokenID); // "transfer" function from smart contract
```

#### verify (contractAddress: string, ...args: any[]): Promise&lt;void&gt;
Verify the smart contract on the blockchain. Requires `POLYGONSCAN_KEY` environment variable to be set.
  

### More examples

#### Deploy a contract
```
import NFTManager from "@niftymints/contract-interface";

const rpcURL = "<rpc-url>";
const privateKey = "<wallet-key>";

async function deploy() {
    const nft = new NFTManager("NFT", rpcURL, privateKey);
    const address = await nft.deployContract("Test NFT", "TNFT");
}

async function depoyWithSigner(signer) {
    const nft = (new NFTManager()).connect(signer);
    const address = await nft.deployContract("Test NFT", "TNFT");
}
```

#### Mint NFT
```
import NFTManager from "@niftymints/contract-interface";

const rpcURL = "<rpc-url>";
const privateKey = "<wallet-key>";

async function mintNFT(tokenURI) {
    const nft = new NFTManager("NFT", rpcURL, privateKey);
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


### Contributing 👋
Contributions are always welcome! Feel free to open any issue or send a pull request.
For questions, please contact [shanzid.com](shanzid.com).