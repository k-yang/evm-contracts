
import { Interface } from "ethers";

async function main() {
  const iface = new Interface([
    "function balanceOf(address) view returns (uint256)",
    "function name() public view returns (string memory)",
    "function symbol() public view returns (string memory)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
  ]);

  console.log("balanceOf", iface.encodeFunctionData("balanceOf", ["0x22CBd7CbF3b33681abB3Ced4D64d71acB9a9dCd2"]));
  console.log("name", iface.encodeFunctionData("name", []));
  console.log("symbol", iface.encodeFunctionData("symbol", []));
  console.log("decimals", iface.encodeFunctionData("decimals", []));
  console.log("totalSupply", iface.encodeFunctionData("totalSupply", []));
}

main()
