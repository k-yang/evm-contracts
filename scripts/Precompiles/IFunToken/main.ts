import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { IFunToken__factory } from "../../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
console.log(owner.address)

async function main() {
  const contract = IFunToken__factory.connect("0x0000000000000000000000000000000000000800", owner)
  console.log("contract address: ", await contract.getAddress())

  const txResponse = await contract.bankMsgSend("nibi1gc6vpl9j0ty8tkt53787zps9ezc70kj88hluw4", "unibi", "1", { gasLimit: 63745 });
  console.log("tx: ", txResponse)

  const txReceipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("txReceipt: ", txReceipt)
}

main()