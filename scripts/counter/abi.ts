import { HDNodeWallet, Interface, JsonRpcProvider } from "ethers";
import { Counter__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

// get command line arguments
const COMMAND_LINE_ARGS = process.argv.slice(2)
const CONTRACT_ADDR = COMMAND_LINE_ARGS[0]

async function main() {
  const contract = Counter__factory.connect(CONTRACT_ADDR, owner)
  console.log("contract address: ", await contract.getAddress())

  const transaction = await contract.increment.populateTransaction(5, {
    gasPrice: 1,
    gasLimit: 200_000,
    from: owner.address,
    chainId: 7230,
    nonce: await owner.getNonce(),
  });
  console.log("tx: ", transaction)

  console.log("serialized tx:", await owner.signTransaction(transaction));

  const iface = new Interface(Counter__factory.abi)
  console.log("increment:", iface.encodeFunctionData("increment", [5]))
  console.log("get:", iface.encodeFunctionData("get"))
}

main()