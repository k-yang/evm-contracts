import { JsonRpcProvider } from "ethers";
import { ERC20Minter__factory } from "../../typechain-types";

// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-1.nibiru.fi:443");

const COMMAND_LINE_ARGS = process.argv.slice(2)
const ERC20Address = COMMAND_LINE_ARGS[0]
const userAddress = COMMAND_LINE_ARGS[1]

async function main() {
  const contract = ERC20Minter__factory.connect(ERC20Address, jsonRpcProvider)

  // console.log("user balance:", await contract.balanceOf(userAddress))
  console.log("name:", await contract.name())
  console.log("symbol:", await contract.symbol())
  console.log("decimals:", await contract.decimals())
  console.log("totalSupply:", await contract.totalSupply())
  console.log("owner address:", await contract.owner())
}

main()