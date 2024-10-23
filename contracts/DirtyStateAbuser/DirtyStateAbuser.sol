// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "../IFunToken.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DirtyStateAbuser {
    uint256 public counter;

    constructor() {
        counter = 0;
    }

    function attack(address erc20, string memory recipient) public {
        counter++;
        (bool _success, ) = FUNTOKEN_PRECOMPILE_ADDRESS.call(
            abi.encodeWithSignature(
                "bankSend(address,uint256,string)",
                erc20,
                1,
                recipient
            )
        );

        require(_success, string.concat("Failed to call bankSend"));
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
