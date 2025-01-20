import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { Counter__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.devnet-3.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-1.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:18545");

// mnemonic for the HD wallet
//const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const mnemonic = "false autumn antique duty found siege balance truth recycle neutral doctor budget ship heart shoe coconut home spoon wide guilt slush skirt garment regular"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

const COMMAND_LINE_ARGS = process.argv.slice(2);
const CONTRACT_ADDR = COMMAND_LINE_ARGS[0];

async function main() {
  const contract = Counter__factory.connect(CONTRACT_ADDR, owner)
  console.log("contract address: ", await contract.getAddress())

  while (true) {
    console.log("increment:", await contract.increment.estimateGas(5));
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

main()