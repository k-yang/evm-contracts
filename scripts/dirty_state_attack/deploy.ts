import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { DirtyStateAbuser__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.devnet-1.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
// const FunTokenGatewayAddress = "0x0000000000000000000000000000000000000800"

async function main() {
  console.log("owner address:", owner.address)
  const factory = new DirtyStateAbuser__factory(owner);
  const contract = await factory.deploy({
    gasPrice: "1",
  });
  console.log("contract address: ", await contract.getAddress())
  await contract.waitForDeployment()
}

main()