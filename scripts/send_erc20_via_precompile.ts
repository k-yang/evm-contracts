import { HDNodeWallet, JsonRpcProvider, Wallet } from "ethers";
import { IFunToken__factory } from "../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
Wallet.fromPhrase(mnemonic, jsonRpcProvider)


async function main() {
  const contract = IFunToken__factory.connect("0x0000000000000000000000000000000000000800", owner)

  const txResponse = await contract.bankSend("0x7D4B7B8CA7E1a24928Bb96D59249c7a5bd1DfBe6", 1, "nibi1gc6vpl9j0ty8tkt53787zps9ezc70kj88hluw4")
  console.log(txResponse)
  console.log(await jsonRpcProvider.waitForTransaction(txResponse.hash))
}

main()