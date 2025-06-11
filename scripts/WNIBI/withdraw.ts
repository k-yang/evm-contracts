import 'dotenv/config';
import { HDNodeWallet, JsonRpcProvider, parseEther } from "ethers";
import { WNIBI9__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-2.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = process.env.MNEMONIC!
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
console.log("owner address:", owner.address)

async function main() {
  const ownerBalance = await jsonRpcProvider.getBalance(owner.address);
  console.log("owner unibi balance before deposit: ", ownerBalance.toString())

  const contract = WNIBI9__factory.connect("0x0CaCF669f8446BeCA826913a3c6B96aCD4b02a97", owner);

  const resp = await contract.withdraw(parseEther("390000"))
  console.log("withdraw tx: ", resp)

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