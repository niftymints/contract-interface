// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./NFT.sol";

contract CloneCollection {
    event ContractDeployed(address indexed addr);

    function copyContract(address contractAddress) public {
        NFT originalContract = NFT(contractAddress);
        address owner = originalContract.owner();
        string memory name = originalContract.name();
        string memory symbol = originalContract.symbol();

        NFT newContract = new NFT(name, symbol, owner);
        emit ContractDeployed(address(newContract));
    }

    function copyMints(
        address originalContract,
        address newContract,
        uint256 tokenFrom,
        uint256 tokenTo
    ) public {
        NFT originalNFT = NFT(originalContract);
        NFT newNFT = NFT(newContract);
        for (uint256 i = tokenFrom; i <= tokenTo; i++) {
            string memory tokenURI = originalNFT.tokenURI(i);
            address owner = originalNFT.ownerOf(i);
            newNFT.mint(tokenURI, owner);
        }
    }

    function burnTokens(
        address contractAddress,
        uint256 tokenFrom,
        uint256 tokenTo
    ) public {
        NFT nftContract = NFT(contractAddress);
        for (uint256 i = tokenFrom; i <= tokenTo; i++) {
            nftContract.burn(i);
        }
    }
}
