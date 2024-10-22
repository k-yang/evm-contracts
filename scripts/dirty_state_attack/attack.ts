import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { DirtyStateAbuser__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

async function main() {
  const contract = DirtyStateAbuser__factory.connect("0xe5F54D19AA5c3c16ba70bC1E5112Fe37F1764134", owner)
  console.log("contract address: ", await contract.getAddress())

  // transfer 100 tokens to another address
  const txResponse = await contract.attack("0x76F635e60b7f765C426c78D07a1ec9ac6752De13", "nibi1gc6vpl9j0ty8tkt53787zps9ezc70kj88hluw4")
  const txReceipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("txReceipt: ", txReceipt)
}

main()