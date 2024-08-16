import { HDNodeWallet, JsonRpcProvider, Wallet } from "ethers";
import { ERC20Minter__factory } from "../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/60'/0'/0/0").connect(jsonRpcProvider)
Wallet.fromPhrase(mnemonic, jsonRpcProvider)


async function main() {
  const contract = await ERC20Minter__factory.connect("0x7D4B7B8CA7E1a24928Bb96D59249c7a5bd1DfBe6", owner)

  const deploymentTx = contract.deploymentTransaction()
  if (deploymentTx != null) {
    console.log(deploymentTx)
    jsonRpcProvider.getTransactionReceipt(deploymentTx.hash).then(console.log)
  }

  console.log(await contract.balanceOf("0xFAF227DAD0B91C2DEBD41DAE71C959EA4F95F8F8"))
  console.log("totalSupply:", await contract.totalSupply())
  console.log("name:", await contract.name())
  console.log("owner:", await contract.owner())
  console.log("symbol:", await contract.symbol())
  console.log("decimals:", await contract.decimals())
}

main()