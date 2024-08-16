import { HDNodeWallet, JsonRpcProvider, Wallet } from "ethers";
import { IFunToken__factory } from "../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
Wallet.fromPhrase(mnemonic, jsonRpcProvider)

const FunTokenGatewayAddress = "0x0000000000000000000000000000000000000800"
const ERC20Address = "0x76e03400dC49dD3Dbede29f5e11b0e7bc215F202"
const to = "nibi1zaavvzxez0elundtn32qnk9lkm8kmcsz44g7xl"

async function main() {
  console.log("owner address:", owner.address)
  const contract = IFunToken__factory.connect(FunTokenGatewayAddress, owner)

  const txResponse = await contract.bankSend(ERC20Address, 1, to)
  console.log(txResponse)
  console.log(await jsonRpcProvider.waitForTransaction(txResponse.hash))
}

main()