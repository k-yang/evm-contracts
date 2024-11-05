// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./Precompiles/IWasm.sol";

contract WasmPrecompile {
    constructor() payable {}

    function executeWithoutFunds(
        string calldata contractAddr,
        bytes calldata msgArgs
    ) external returns (bytes memory) {
        IWasm.BankCoin[] memory funds = new IWasm.BankCoin[](0);

        return = WASM_PRECOMPILE.execute(
            contractAddr,
            msgArgs,
            funds
        );
    }

    function executeWithFunds(
        string calldata contractAddr,
        bytes calldata msgArgs
    ) external returns (bytes memory) {
        IWasm.BankCoin[] memory funds = new IWasm.BankCoin[](1);
        funds[0] = IWasm.BankCoin({denom: "unibi", amount: 1e6}); // 1 NIBI

        return WASM_PRECOMPILE.execute(
            contractAddr,
            msgArgs,
            funds
        );
    }
}
