import { HDNodeWallet, JsonRpcProvider, Wallet } from "ethers";
import { IFunToken__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
Wallet.fromPhrase(mnemonic, jsonRpcProvider)

const FunTokenGatewayAddress = "0x0000000000000000000000000000000000000800"
const ERC20Address = "0xe5F54D19AA5c3c16ba70bC1E5112Fe37F1764134"
const to = "nibi1gc6vpl9j0ty8tkt53787zps9ezc70kj88hluw4"

async function main() {
  console.log("owner address:", owner.address)
  const contract = IFunToken__factory.connect(FunTokenGatewayAddress, owner)

  const txResponse = await contract.bankSend(ERC20Address, 1, to)
  console.log(txResponse)
  console.log(await jsonRpcProvider.waitForTransaction(txResponse.hash))
}

main()