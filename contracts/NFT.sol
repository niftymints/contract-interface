// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 public currentSupply;
    mapping(address => bool) public minters;
    mapping(string => uint256) private uris;

    event SimulatedTransfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner
    ) ERC721(_name, _symbol) Ownable(_owner) {
        currentSupply = 1;
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
        if (uris[_tokenURI] != 0) {
            emit SimulatedTransfer(artist, artist, uris[_tokenURI]);
            return;
        }
        uint256 tokenId = currentSupply;
        _safeMint(artist, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        uris[_tokenURI] = tokenId;

        currentSupply++;
    }

    function totalSupply() public view returns (uint256) {
        return currentSupply - 1;
    }

    function addMinter(address minter) public onlyOwner {
        minters[minter] = true;
    }

    function removeMinter(address minter) public onlyOwner {
        minters[minter] = false;
    }
}
