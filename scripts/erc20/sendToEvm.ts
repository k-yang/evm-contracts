import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { ERC20Minter__factory, IFunToken__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-2.nibiru.fi:443");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
console.log("owner address:", owner.address)

const FunTokenGatewayAddress = "0x0000000000000000000000000000000000000800"
const ERC20Address = "0x7D4B7B8CA7E1a24928Bb96D59249c7a5bd1DfBe6"
const bankDenom = "unibi"

async function main() {
  const funtokenPrecompile = IFunToken__factory.connect(FunTokenGatewayAddress, owner)

  const txResponse = await funtokenPrecompile.sendToEvm(bankDenom, 1, owner.address)
  console.log("txResponse: ", txResponse)

  const receipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("receipt: ", receipt)

  console.log("owner unibi balance in wei: ", await funtokenPrecompile.bankBalance(owner.address, bankDenom))

  const erc20 = ERC20Minter__factory.connect(ERC20Address, owner)
  console.log("owner WNIBI balance: ", await erc20.balanceOf(owner.address))
}

main()