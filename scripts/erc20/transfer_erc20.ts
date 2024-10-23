import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { MyToken__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.devnet-1.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

const COMMAND_LINE_ARGS = process.argv.slice(2)
const erc20 = COMMAND_LINE_ARGS[0]
const recipientAddress = COMMAND_LINE_ARGS[1]

async function main() {
  const contract = MyToken__factory.connect(erc20, owner);

  // obtain the total supply of the ERC-20 contract
  console.log("totalSupply: ", await contract.totalSupply())
  console.log("balanceOf(owner): ", await contract.balanceOf(owner.address))

  // transfer 1 token to another address
  const txResponse = await contract.transfer(recipientAddress, 1)
  await jsonRpcProvider.waitForTransaction(txResponse.hash)

  console.log("balanceOf(recipient): ", await contract.balanceOf(recipientAddress))
  console.log("balanceOf(owner): ", await contract.balanceOf(owner.address))
}

main()