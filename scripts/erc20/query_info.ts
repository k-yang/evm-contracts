import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { ERC20Minter__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-2.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
console.log("owner address:", owner.address)

const ERC20Address = '0x7D4B7B8CA7E1a24928Bb96D59249c7a5bd1DfBe6';

async function main() {
  const ownerBalance = await jsonRpcProvider.getBalance(owner.address);
  console.log("owner unibi balance: ", ownerBalance.toString())

  const erc20 = ERC20Minter__factory.connect(ERC20Address, owner);

  console.log("name: ", await erc20.name())
  console.log("symbol: ", await erc20.symbol())
  console.log("decimals: ", await erc20.decimals())
  console.log("totalSupply: ", await erc20.totalSupply())
  console.log("owner balance: ", await erc20.balanceOf(owner.address))
}

main()