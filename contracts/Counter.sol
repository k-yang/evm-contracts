// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 public counter = 0;

    event Increment(address indexed from, uint256 by);
    event Decrement(address indexed from, uint256 by);
    event Reset(address indexed from);

    function increment(uint256 by) public {
        counter += by;
        emit Increment(msg.sender, by);
    }

    function decrement(uint256 by) public {
        counter -= by;
        emit Decrement(msg.sender, by);
    }

    function reset() public {
        counter = 0;
        emit Reset(msg.sender);
    }

    function get() public view returns (uint256) {
        return counter;
    }
}
