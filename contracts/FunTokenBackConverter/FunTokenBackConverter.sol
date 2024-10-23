// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "../IFunToken.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FunTokenBackConverter {
    address erc20;

    constructor(address erc20_) {
        erc20 = erc20_;
    }

    function callPrecompile(string memory bech32Recipient) public {
        (bool success, ) = FUNTOKEN_PRECOMPILE_ADDRESS.call(
            abi.encodeWithSignature(
                "bankSend(address,uint256,string)",
                erc20,
                uint256(1e6),
                bech32Recipient
            )
        );

        require(success, string.concat("Failed to call bankSend"));
    }
}
