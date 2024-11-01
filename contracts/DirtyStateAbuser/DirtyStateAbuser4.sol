// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "../Precompiles/IWasm.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DirtyStateAbuser4 {
    uint counter = 0;

    constructor() payable {}

    function attack(string calldata wasmAddr, bytes calldata msgArgs) external {
        counter++;

        IWasm.BankCoin[] memory funds = new IWasm.BankCoin[](1);
        funds[0] = IWasm.BankCoin({denom: "unibi", amount: 1e6}); // 1 NIBI

        WASM_PRECOMPILE.execute(wasmAddr, msgArgs, funds);
    }

    function getCounter() external view returns (uint) {
        return counter;
    }
}
