// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "../Precompiles/IFunToken.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Scenario1 {
    address erc20;

    constructor(address erc20_) payable {
        erc20 = erc20_;
    }

    function execute(
        address payable sendRecipient,
        string memory bech32Recipient
    ) external {
        require(sendRecipient.send(1 ether), "ETH transfer failed"); // 1 NIBI

        FUNTOKEN_PRECOMPILE.sendToBank(erc20, 1e6, bech32Recipient); // 1 WNIBI
    }
}
