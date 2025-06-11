import 'dotenv/config';
import { HDNodeWallet, JsonRpcProvider, parseEther } from "ethers";

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

  const resp = await owner.sendTransaction({
    to: "0x4634c0fcB27ac875d9748f8fe10605C8B1e7da47",
    value: parseEther("389348"),
  })

  const receipt = await resp.wait();
  console.log("receipt: ", receipt)

  const ownerBalanceAfter = await jsonRpcProvider.getBalance(owner.address);
  console.log("owner unibi balance after deposit: ", ownerBalanceAfter.toString())
}

main()