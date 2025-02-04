import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { IFunToken__factory, MyToken__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

const FunTokenGatewayAddress = "0x0000000000000000000000000000000000000800"
const ERC20Address = "0x76e03400dC49dD3Dbede29f5e11b0e7bc215F202"

async function main() {
  console.log("owner address:", owner.address)
  const funtokenPrecompile = IFunToken__factory.connect(FunTokenGatewayAddress, owner)

  const txResponse = await funtokenPrecompile.sendToEvm("erc20/" + ERC20Address, 1, owner.address)
  console.log("txResponse: ", txResponse)
  const receipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("receipt: ", receipt)
  console.log("balanceOf(recipient): ", await funtokenPrecompile.bankBalance("0xFaF227daD0b91C2dEBD41daE71C959EA4f95f8F8", "erc20/" + ERC20Address))

  const erc20 = MyToken__factory.connect(ERC20Address, owner)
  console.log("balanceOf(owner): ", await erc20.balanceOf(owner.address))
}

main()