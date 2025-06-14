import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { MyToken__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-2.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.devnet-1.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

async function main() {
  console.log("owner address:", owner.address)
  const factory = new MyToken__factory(owner);
  const erc20 = await factory.deploy(owner, {
    gasPrice: "1",
  });

  const erc20Addr = await erc20.getAddress()
  console.log("ERC20 contract address: ", erc20Addr)
  await erc20.waitForDeployment()

  // obtain the total supply of the ERC-20 contract
  console.log("totalSupply: ", await erc20.totalSupply())
  console.log("balanceOf(owner): ", await erc20.balanceOf(owner.address))

}

main()