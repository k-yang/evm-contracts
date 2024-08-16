import { HDNodeWallet, JsonRpcProvider, Wallet } from "ethers";
import { Lock__factory } from "../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/60'/0'/0/0").connect(jsonRpcProvider)
Wallet.fromPhrase(mnemonic,jsonRpcProvider)


async function main() {
  const factory = new Lock__factory(owner);
  const contract = await factory.deploy("10000000000000", {
    gasPrice: 1,
  });
  console.log(await contract.waitForDeployment())

  const deploymentTx = contract.deploymentTransaction()
  if(deploymentTx != null) {
    console.log(deploymentTx)
    jsonRpcProvider.getTransactionReceipt(deploymentTx.hash).then(console.log)
  }

}

main()