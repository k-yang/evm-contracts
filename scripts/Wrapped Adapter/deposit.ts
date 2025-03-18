import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { WNIBI9__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-2.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

async function main() {
  const ownerBalance = await jsonRpcProvider.getBalance(owner.address);
  console.log("owner unibi balance before deposit: ", ownerBalance.toString())

  const contract = WNIBI9__factory.connect("0xA6DC14e5e2080F1E297f13fE8FBe3d41b70E58A7", owner);

  const resp = await contract.deposit({
    value: "1000000000000", // 1 unibi
  })
  console.log("deposit tx: ", resp)

  const receipt = await resp.wait();
  console.log("receipt: ", receipt)

  const ownerBalanceAfter = await jsonRpcProvider.getBalance(owner.address);
  console.log("owner unibi balance after deposit: ", ownerBalanceAfter.toString())

  console.log("name: ", await contract.name())
  console.log("symbol: ", await contract.symbol())
  console.log("decimals:", await contract.decimals())
  console.log("totalSupply: ", await contract.totalSupply())
  console.log("balanceOf(owner): ", await contract.balanceOf(owner.address))
}

main()