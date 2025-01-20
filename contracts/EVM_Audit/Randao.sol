// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract RandomConsumer {
    function getRandom() public view returns (uint256) {
        return block.prevrandao; // Will panic on Nibiru <-- not really, 0 is returned
    }
}
