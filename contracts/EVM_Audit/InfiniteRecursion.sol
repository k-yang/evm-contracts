// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../Precompiles/IFunToken.sol";

contract InfiniteRecursionERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function balanceOf(
        address who
    ) public view virtual override returns (uint) {
        // recurse into this method through funtoken.balance(who, address(this))
        address(FUNTOKEN_PRECOMPILE_ADDRESS).staticcall(
            abi.encodeWithSignature(
                "balance(address,address)",
                who,
                address(this)
            )
        );
        return 0;
    }

    function go() public {
        balanceOf(address(0));
    }
}
