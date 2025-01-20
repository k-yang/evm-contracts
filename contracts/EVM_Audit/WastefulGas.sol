// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IWasm, WASM_PRECOMPILE_ADDRESS} from "../Precompiles/IWasm.sol";

contract WastefulGas {
    IWasm public wasm = IWasm(WASM_PRECOMPILE_ADDRESS);

    function attack(
        string calldata contractAddr,
        bytes calldata msgArgs
    ) public {
        IWasm.BankCoin[] memory funds = new IWasm.BankCoin[](0);
        wasm.execute(contractAddr, msgArgs, funds);
    }
}
