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

    function attack(
        address payable sendRecipient,
        string memory bech32Recipient
    ) external {
        try
            Scenario1(payable(address(this))).transferFunds(
                sendRecipient,
                bech32Recipient
            )
        {} catch // [1]
        {
            // do nothing
        }
    }

    function transferFunds(
        address payable sendRecipient,
        string memory bech32Recipient
    ) external {
        require(sendRecipient.send(1 ether), "ETH transfer failed"); // 1 NIBI

        (bool success, ) = FUNTOKEN_PRECOMPILE_ADDRESS.call(
            abi.encodeWithSignature(
                "bankSend(address,uint256,string)",
                erc20,
                uint256(1), // 1 micro-WNIBI
                bech32Recipient
            )
        );
        require(success, string.concat("Failed to call bankSend"));

        // revert(); // [4]
    }
}
