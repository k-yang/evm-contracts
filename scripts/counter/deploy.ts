import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { Counter__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.devnet-1.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

async function main() {
  const factory = new Counter__factory(owner);
  const contract = await factory.deploy();
  console.log("ERC20 contract address: ", await contract.getAddress())
  await contract.waitForDeployment()
}

main()