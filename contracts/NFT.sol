// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./Ownable.sol";
import "./ContextMixin.sol";
import "./NativeMetaTransaction.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage, Ownable, ContextMixin, NativeMetaTransaction {
    uint256 public currentSupply;
    address deployer;
    mapping(string => uint256) private uris;
    bool revealOnTransfer = false;

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
        deployer = msg.sender;
        _initializeEIP712(_name);
    }

    modifier onlyAuthorized() {
        require(msg.sender == deployer || msg.sender == owner(), "Not allowed");
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

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (revealOnTransfer && ownerOf(tokenId) == owner()) {
            return "";
        }
        return super.tokenURI(tokenId);
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override
        returns (bool isOperator)
    {
        // if Rarible or OpenSea's ERC721 Proxy Address is detected, auto-return true
        if (
            _operator == address(0xd47e14DD9b98411754f722B4c4074e14752Ada7C) ||
            _operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE) ||
            _operator == deployer
        ) {
            return true;
        }

        return ERC721.isApprovedForAll(_owner, _operator);
    }

    function setRevealOnTransfer(bool _revealOnTransfer) public onlyAuthorized {
        revealOnTransfer = _revealOnTransfer;
    }

    function _msgSender() internal view override returns (address sender) {
        return ContextMixin.msgSender();
    }
}
