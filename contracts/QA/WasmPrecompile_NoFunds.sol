// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "../Precompiles/IWasm.sol";

contract Scenario2 {
    constructor() payable {}

    function execute(
        string calldata contractAddr,
        bytes calldata msgArgs
    ) external returns (bytes memory) {
        IWasm.BankCoin[] memory funds = new IWasm.BankCoin[](0); // empty array

        return WASM_PRECOMPILE.execute(contractAddr, msgArgs, funds);
    }
}
