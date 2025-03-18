// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ReceiveNibi {
    /*
    Which function is called, fallback() or receive()?

           send Nibi
               |
         msg.data is empty?
              / \
            yes  no
            /     \
    receive() exists?  fallback()
         /   \
        yes   no
        /      \
    receive()   fallback()
    */

    // Function to receive Nibi. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

contract SendNibi {
    function sendViaTransfer(address payable _to) public payable {
        // This function is no longer recommended for sending Nibi.
        _to.transfer(msg.value);
    }

    function sendViaSend(address payable _to) public payable {
        // Send returns a boolean value indicating success or failure.
        // This function is not recommended for sending Nibi.
        bool sent = _to.send(msg.value);
        require(sent, "Failed to send Nibi");
    }

    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = _to.call{value : msg.value}("");
        require(sent, "Failed to send Nibi");
    }

    function depositEther() public payable {
        require(msg.value == 1 ether, "You need to send exactly 1 Ether");
    }

    // Function to send 1 Ether from the contract to a specified address
    function sendOneEther(address payable recipient) public {
        require(address(this).balance >= 1 ether, "Insufficient balance in contract");
        (bool sent, ) = recipient.call{value: 1 ether}("");
        require(sent, "Failed to send Ether");
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
