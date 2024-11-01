// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "../Precompiles/IFunToken.sol";
import "../Precompiles/IWasm.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Scenario2 {
    constructor() payable {}

    function execute(
        string calldata contractAddr,
        bytes calldata msgArgs
    ) external returns (bytes memory) {
        IWasm.BankCoin[] memory funds = new IWasm.BankCoin[](0); // empty array

        bytes memory response = WASM_PRECOMPILE.execute(
            contractAddr,
            msgArgs,
            funds
        );

        return response;

        // (bool success, bytes memory data) = WASM_PRECOMPILE_ADDRESS.call(
        //     abi.encodeWithSignature(
        //         "execute(string,bytes,BankCoin[])",
        //         contractAddr,
        //         msgArgs,
        //         funds
        //     )
        // );

        // require(success, "WASM execution failed");

        // return data;
    }
}
