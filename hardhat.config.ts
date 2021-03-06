import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

task("deploy_NFT", "Deploy the smart contracts", async (args, hre) => {
  const TOKEN_NAME = process.env.TOKEN_NAME ?? "Niftymints";
  const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL ?? "NFTY";
  const OWNER = process.env.OWNER ?? "0x" + "0".repeat(40);

  console.log(`Deploying ${TOKEN_NAME} with symbol ${TOKEN_SYMBOL}`);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const smartContract = await NFT.deploy(TOKEN_NAME, TOKEN_SYMBOL, OWNER);
  await smartContract.deployed();

  await txWait(smartContract.deployTransaction.hash, 5, hre.web3);

  console.log(`Deployed contact at ${smartContract.address}`);

  await hre
    .run("verify:verify", {
      address: smartContract.address,
      constructorArguments: [TOKEN_NAME, TOKEN_SYMBOL, OWNER],
    })
    .catch((e) => {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log("Verified!");
      } else {
        throw e;
      }
    });
});

task(
  "deploy_token_migrator",
  "Deploy the smart contract for Token Migrator",
  async (args, hre) => {
    const TokenMigrator = await hre.ethers.getContractFactory("TokenMigrator");
    const smartContract = await TokenMigrator.deploy();
    await smartContract.deployed();

    await txWait(smartContract.deployTransaction.hash, 5, hre.web3);

    console.log(`Deployed contact at ${smartContract.address}`);

    await hre
      .run("verify:verify", {
        address: smartContract.address,
      })
      .catch((e) => {
        if (e.message.toLowerCase().includes("already verified")) {
          console.log("Verified!");
        } else {
          throw e;
        }
      });
  }
);

task(
  "deploy_clone_collection",
  "Deploy the smart contract for Collection Cloner",
  async (args, hre) => {
    const CloneContract = await hre.ethers.getContractFactory(
      "CloneCollection"
    );
    const smartContract = await CloneContract.deploy();
    await smartContract.deployed();

    await txWait(smartContract.deployTransaction.hash, 5, hre.web3);

    console.log(`Deployed contact at ${smartContract.address}`);

    await hre
      .run("verify:verify", {
        address: smartContract.address,
      })
      .catch((e) => {
        if (e.message.toLowerCase().includes("already verified")) {
          console.log("Verified!");
        } else {
          throw e;
        }
      });
  }
);

task(
  "deploy_airdrop_tokens",
  "Deploy the smart contract for Airdropping tokens",
  async (args, hre) => {
    const AirdropperContract = await hre.ethers.getContractFactory(
      "AirdropTokens"
    );
    const smartContract = await AirdropperContract.deploy();
    await smartContract.deployed();

    await txWait(smartContract.deployTransaction.hash, 5, hre.web3);

    console.log(`Deployed contact at ${smartContract.address}`);

    await hre
      .run("verify:verify", {
        address: smartContract.address,
      })
      .catch((e) => {
        if (e.message.toLowerCase().includes("already verified")) {
          console.log("Verified!");
        } else {
          throw e;
        }
      });
  }
);

async function txWait(txHash: string, confirmations: number, web3: any) {
  const tx = (await web3.eth.getTransaction(txHash)) as any;
  let currentBlock = await web3.eth.getBlockNumber();
  while (currentBlock - tx.blockNumber < confirmations) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    currentBlock = await web3.eth.getBlockNumber();
  }
}

export default {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mumbai_dev: {
      url: process.env.ALCHEMY_DEV_URL ?? "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY_DEV],
    },
    matic_prod: {
      url: process.env.ALCHEMY_PROD_URL,
      accounts: [process.env.PRIVATE_KEY_PROD],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};
