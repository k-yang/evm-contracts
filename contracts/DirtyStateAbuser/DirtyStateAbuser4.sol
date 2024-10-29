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
        funds[0] = IWasm.BankCoin({denom: "unibi", amount: 1_000_000}); // 1 NIBI

        (bool success, ) = WASM_PRECOMPILE_ADDRESS.call(
            abi.encodeWithSignature(
                "execute(string,bytes,BankCoin[])",
                wasmAddr,
                msgArgs,
                funds
            )
        );
        require(success, "WASM execution failed");
    }

    function getCounter() external view returns (uint) {
        return counter;
    }
}
