import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { DirtyStateAbuser__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

const attackContract = "0xFfa7dFF969218b50492c05bF41Ca3583D5D16Bc8"

async function main() {
  const contract = DirtyStateAbuser__factory.connect(attackContract, owner)
  console.log("contract address: ", await contract.getAddress())

  // transfer 100 tokens to another address
  const counter = await contract.counter()
  console.log("counter: ", counter)
}

main()