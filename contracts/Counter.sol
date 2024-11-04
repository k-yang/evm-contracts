// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 public counter = 0;

    function increment(uint256 by) public {
        counter += by;
    }

    function decrement(uint256 by) public {
        counter -= by;
    }

    function reset() public {
        counter = 0;
    }

    function get() public view returns (uint256) {
        return counter;
    }
}
