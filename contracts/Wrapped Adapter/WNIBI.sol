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

    event Deposit(address indexed dst, uint wad);
    event Withdrawal(address indexed src, uint wad);

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

    function deposit() public payable {
        // convert unibi to ERC20 representation via fungible token mapping
        FUNTOKEN_PRECOMPILE.sendToEvm(
            bankDenom,
            msg.value,
            Strings.toHexString(uint256(uint160(msg.sender)), 20)
        );

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint wad) public {
        // convert back to unibi
        // TODO: need to figure out how to convert msg.sender into a bech32
        FUNTOKEN_PRECOMPILE.sendToBank(
            canonicalContract,
            wad,
            Strings.toHexString(uint256(uint160(msg.sender)), 20)
        );

        emit Withdrawal(msg.sender, wad);
    }

    // all calls below are proxied to the underlying canonical WNIBI contract

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256) {
        return IERC20(canonicalContract).totalSupply();
    }

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256) {
        return IERC20(canonicalContract).balanceOf(account);
    }

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool) {
        return IERC20(canonicalContract).transfer(to, value);
    }

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256) {
        return IERC20(canonicalContract).allowance(owner, spender);
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
    function approve(address spender, uint256 value) external returns (bool) {
        return IERC20(canonicalContract).approve(spender, value);
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
        address from,
        address to,
        uint256 value
    ) external returns (bool) {
        return IERC20(canonicalContract).transferFrom(from, to, value);
    }
}
