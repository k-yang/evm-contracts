// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../Precompiles/IFunToken.sol";

contract WNIBI9 {
    string public name = "Wrapped NIBI";
    string public symbol = "WNIBI";
    uint8 public decimals = 6;

    event Approval(address indexed src, address indexed guy, uint wad);
    event Transfer(address indexed src, address indexed dst, uint wad);
    event Deposit(address indexed dst, uint wad);
    event Withdrawal(address indexed src, uint wad);

    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    address canonicalContract;
    string bankDenom;

    constructor(address _canonicalContract, string memory _bankDeom) {
        canonicalContract = _canonicalContract;
        bankDenom = _bankDeom;
    }

    // default fallback function
    fallback() external payable {
        deposit();
    }

    receive() external payable {
        deposit();
    }

    // convert unibi to ERC20 representation via fungible token mapping
    function deposit() public payable {
        // need to divide by a scaling factor to obtain unibi amount from wei amount
        uint256 scalingFactor = 10 ** (18 - decimals);
        uint256 unibiAmount = msg.value / scalingFactor;

        FUNTOKEN_PRECOMPILE.sendToEvm(
            bankDenom,
            unibiAmount,
            Strings.toHexString(uint256(uint160(address(this))), 20)
        );

        balanceOf[msg.sender] += unibiAmount;

        emit Deposit(msg.sender, msg.value);
    }

    // convert back to unibi
    function withdraw(uint256 wad) public {
        require(balanceOf[msg.sender] >= wad);
        balanceOf[msg.sender] -= wad;

        FUNTOKEN_PRECOMPILE.sendToBank(
            canonicalContract,
            wad,
            Strings.toHexString(uint256(uint160(address(this))), 20)
        );

        payable(msg.sender).transfer(wad);

        emit Withdrawal(msg.sender, wad);
    }

    // all calls below are proxied to the underlying canonical WNIBI contract

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256) {
        return IERC20(canonicalContract).balanceOf(address(this));
    }

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address dst, uint wad) public returns (bool) {
        return transferFrom(msg.sender, dst, wad);
    }

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address guy, uint wad) public returns (bool) {
        allowance[msg.sender][guy] = wad;
        emit Approval(msg.sender, guy, wad);
        return true;
    }

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address src,
        address dst,
        uint wad
    ) public returns (bool) {
        require(balanceOf[src] >= wad);

        if (src != msg.sender && allowance[src][msg.sender] != type(uint).max) {
            require(allowance[src][msg.sender] >= wad);
            allowance[src][msg.sender] -= wad;
        }

        balanceOf[src] -= wad;
        balanceOf[dst] += wad;

        emit Transfer(src, dst, wad);

        return true;
    }
}
