import { HDNodeWallet, Interface, JsonRpcProvider } from "ethers";
import { Counter__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

async function main() {
  const factory = new Counter__factory(owner);
  const contract = await factory.deploy();
  console.log("ERC20 contract address: ", await contract.getAddress())
  await contract.waitForDeployment()

  const transaction = await contract.decrement.populateTransaction(5, {
    gasPrice: 1,
    gasLimit: 200_000,
    from: owner.address,
    chainId: 7230,
    nonce: await owner.getNonce(),
  });
  console.log("tx: ", transaction)
  console.log("serialized tx:", await owner.signTransaction(transaction));

  const iface = new Interface(Counter__factory.abi)
  console.log("\n**sighashes**")
  console.log("get:", iface.encodeFunctionData("get"))
  console.log("increment:", iface.encodeFunctionData("increment", [5]))
  console.log("decrement:", iface.encodeFunctionData("decrement", [5]))
  console.log("reset:", iface.encodeFunctionData("reset"))
}

main()