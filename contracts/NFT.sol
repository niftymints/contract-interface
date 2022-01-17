// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 public currentSupply;
    mapping(address => bool) public minters;
    mapping(uint256 => address) private _artists;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        currentSupply = 0;
        minters[msg.sender] = true;
    }

    modifier onlyAuthorized() {
        require(
            minters[msg.sender] == true || msg.sender == owner(),
            "Not allowed"
        );
        _;
    }

    function mint(string memory _tokenURI, address artist)
        public
        onlyAuthorized
    {
        uint256 tokenId = currentSupply + 1;
        _safeMint(artist, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _artists[tokenId] = artist;

        currentSupply++;
    }

    function addMinter(address minter) public onlyOwner {
        minters[minter] = true;
    }

    function removeMinter(address minter) public onlyOwner {
        minters[minter] = false;
    }
}
