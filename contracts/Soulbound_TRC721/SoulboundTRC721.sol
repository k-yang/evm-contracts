// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./TRC721.sol";
import "./TRC721Metadata.sol";
import "./lib/MinterRole.sol";

contract NibiVDoe is TRC721, TRC721Metadata, MinterRole {
    constructor()
        TRC721Metadata("https://nibiru.fi/docs/community/legal/2024-nibi-v-doe.html", "NIBI-v-DOE")
        MinterRole()
    {}

    function mint(address to, uint256 tokenId) public onlyMinter {
        _mint(to, tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyMinter {
        _setTokenURI(tokenId, tokenURI);
    }

    /**
     * @dev Transfer is blocked.
     * @param _from current owner of the token
     * @param _to address to receive the ownership of the given token ID
     * @param _tokenId uint256 ID of the token to be transferred
     */
    function _transferFrom(address _from, address _to, uint256 _tokenId) pure internal override(TRC721) {
        revert("TRC721: transfer is blocked");
    }

    /**
     * @dev Burn is blocked.
     * @param _owner owner of the token to burn
     * @param _tokenId uint256 ID of the token being burned
     */
    function _burn(address _owner, uint256 _tokenId) pure internal override(TRC721) {
        revert("TRC721: burn is blocked");
    }

}
