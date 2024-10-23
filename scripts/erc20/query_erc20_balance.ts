import { HDNodeWallet, JsonRpcProvider, Wallet } from "ethers";
import { ERC20Minter__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/60'/0'/0/0").connect(jsonRpcProvider)
Wallet.fromPhrase(mnemonic, jsonRpcProvider)

const COMMAND_LINE_ARGS = process.argv.slice(2)
const ERC20Address = COMMAND_LINE_ARGS[0]
const userAddress = COMMAND_LINE_ARGS[1]

async function main() {
  const contract = ERC20Minter__factory.connect(ERC20Address, owner)

  console.log("user balance:", await contract.balanceOf(userAddress))
  console.log("name:", await contract.name())
  console.log("symbol:", await contract.symbol())
  console.log("decimals:", await contract.decimals())
  console.log("totalSupply:", await contract.totalSupply())
  console.log("owner address:", await contract.owner())
}

main()