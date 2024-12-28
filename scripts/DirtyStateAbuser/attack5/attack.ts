import { HDNodeWallet, JsonRpcProvider, toUtf8Bytes } from "ethers";
import { DirtyStateAbuser5__factory } from "../../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

// get command line arguments
const COMMAND_LINE_ARGS = process.argv.slice(2)
const wasmContract = COMMAND_LINE_ARGS[0]

async function main() {
  const factory = new DirtyStateAbuser5__factory(owner);
  const contract = await factory.deploy(
    {
      value: "10000000000000000000" // 10 NIBI
    });

  console.log("contract address: ", await contract.getAddress())
  await contract.waitForDeployment()

  const msgBz = toUtf8Bytes(JSON.stringify({
    "run": {},
  }));

  const txResponse = await contract.attack(wasmContract, msgBz)
  console.log("tx: ", txResponse)
  const txReceipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("txReceipt: ", txReceipt)
}

main()