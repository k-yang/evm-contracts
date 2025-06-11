import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { WETH9__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-2.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
console.log("owner address:", owner.address)

async function main() {
  const factory = new WETH9__factory(owner);
  const contract = await factory.deploy({
    gasPrice: "1",
  });
  
  const addr = await contract.getAddress()
  console.log("contract address: ", addr)

  await contract.waitForDeployment()
}

main()