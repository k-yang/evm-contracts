import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { Scenario1__factory } from "../../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

// get command line arguments
const COMMAND_LINE_ARGS = process.argv.slice(2)
const contractAddress = COMMAND_LINE_ARGS[0]
const aliceHex = COMMAND_LINE_ARGS[1]
const charlieBech32 = COMMAND_LINE_ARGS[2]

async function main() {
  const contract = Scenario1__factory.connect(contractAddress, owner)
  console.log("contract address: ", await contract.getAddress())

  const txResponse = await contract.execute(aliceHex, charlieBech32)
  console.log("tx: ", txResponse)
  const txReceipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("txReceipt: ", txReceipt)
}

main()