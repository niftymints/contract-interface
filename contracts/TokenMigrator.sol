// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface INFT {
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external;

    function isApprovedForAll(address _owner, address _operator)
        external
        view
        returns (bool);
}

contract TokenMigrator {
    function migrate(
        address contractAddress,
        address newWalletAddress,
        uint256 startTokenID,
        uint256 endTokenID
    ) public {
        INFT nft = INFT(contractAddress);
        require(
            startTokenID <= endTokenID,
            "startTokenID must be less or equal to endTokenID"
        );
        require(
            nft.isApprovedForAll(msg.sender, address(this)),
            "This contract must be approved by your NFT contract to migrate"
        );
        for (uint256 i = startTokenID; i <= endTokenID; i++) {
            nft.safeTransferFrom(msg.sender, newWalletAddress, i);
        }
    }
}
