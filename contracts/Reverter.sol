// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Reverter {
    error CustomError();

    function execute() public {
        revert CustomError();
    }

    function execute2() public {
        revert("CustomError");
    }
}
