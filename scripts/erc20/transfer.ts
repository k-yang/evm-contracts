import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { ERC20Minter__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-2.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
const recipient = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/1").connect(jsonRpcProvider)
console.log("owner address:", owner.address)

const ERC20Address = '0xcA0a9Fb5FBF692fa12fD13c0A900EC56Bb3f0a7b';

async function main() {
  const erc20 = ERC20Minter__factory.connect(ERC20Address, owner);
  console.log("balanceOf(owner): ", await erc20.balanceOf(owner.address))

  const resp = await erc20.transfer(recipient.address, 100);
  console.log("transfer response: ", resp);

  const receipt = await resp.wait();
  console.log("transfer receipt: ", receipt);

  console.log("balanceOf(owner): ", await erc20.balanceOf(owner.address))
}

main()