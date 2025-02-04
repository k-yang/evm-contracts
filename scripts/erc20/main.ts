import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { IFunToken__factory, MyToken__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.devnet-1.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");
const FunTokenGatewayAddress = "0x0000000000000000000000000000000000000800"

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
const recipient = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/1").connect(jsonRpcProvider)

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

  // transfer 100 tokens to another address
  const txResponse = await erc20.transfer(recipient.address, 100)
  console.log("txResponse: ", txResponse)
  const receipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("receipt: ", receipt)

  console.log("balanceOf(recipient): ", await erc20.balanceOf(recipient.address))
  console.log("balanceOf(owner): ", await erc20.balanceOf(owner.address))

  // sendToBank
  const funtoken = IFunToken__factory.connect(FunTokenGatewayAddress, owner)
  const txResponse2 = await funtoken.sendToBank(erc20Addr, 1, "nibi1gc6vpl9j0ty8tkt53787zps9ezc70kj88hluw4")
  console.log("txResponse2: ", txResponse2)
  const receipt2 = await jsonRpcProvider.waitForTransaction(txResponse2.hash)
  console.log("receipt: ", receipt2)

  console.log("balanceOf(owner): ", await erc20.balanceOf(owner.address))
  console.log("balanceOf(recipient): ", await funtoken.bankBalance("nibi1gc6vpl9j0ty8tkt53787zps9ezc70kj88hluw4", "erc20/" + erc20Addr))
}

main()