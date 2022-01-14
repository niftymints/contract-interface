// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 public currentSupply;
    mapping(uint256 => address) private _artists;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        currentSupply = 0;
    }

    function mint(string memory _tokenURI, address artist)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = currentSupply + 1;
        _safeMint(artist, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _artists[tokenId] = artist;

        currentSupply++;
        return tokenId;
    }
}
