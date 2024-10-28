import { HDNodeWallet, JsonRpcProvider, toUtf8Bytes } from "ethers";
import { Scenario2__factory } from "../../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

// get command line arguments
const COMMAND_LINE_ARGS = process.argv.slice(2)
const CONTRACT_ADDR = COMMAND_LINE_ARGS[0]
const COUNTER_ADDR = COMMAND_LINE_ARGS[1]

async function main() {
  const contract = Scenario2__factory.connect(CONTRACT_ADDR, owner)
  console.log("contract address: ", await contract.getAddress())

  const msgBz = toUtf8Bytes(JSON.stringify({
    "increment_counter": {
      "by": 5,
    }
  }));
  console.log(msgBz)

  const txResponse = await contract.execute(COUNTER_ADDR, msgBz);
  console.log("tx: ", txResponse)
  const txReceipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("txReceipt: ", txReceipt)
}

main()