// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./ITRC721.sol";

/**
 * @title TRC-721 Non-Fungible Token Standard, optional metadata extension
 */
abstract contract ITRC721Metadata is ITRC721 {
    function name() external virtual view returns (string memory);
    function symbol() external virtual view returns (string memory);
    function tokenURI(uint256 tokenId) external virtual view returns (string memory);
}