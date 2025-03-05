import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { IFunToken__factory, MyToken__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-2.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");
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

  // internal transfer
  {
    const txResponse = await erc20.transfer(recipient.address, 100)
    console.log("txResponse: ", txResponse)
    const receipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
    console.log("receipt: ", receipt)

    console.log("balanceOf(recipient): ", await erc20.balanceOf(recipient.address))
    console.log("balanceOf(owner): ", await erc20.balanceOf(owner.address))
  }

  {
    // sendToBank
    const funtokenPrecompile = IFunToken__factory.connect(FunTokenGatewayAddress, owner)

    const txResponse = await funtokenPrecompile.sendToBank(erc20Addr, 50, "nibi1ltez0kkshywzm675rkh8rj2eaf8et78cqjqrhc")
    console.log("txResponse: ", txResponse)
    const receipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
    console.log("receipt: ", receipt)

    console.log("balanceOf(recipient): ", await funtokenPrecompile.bankBalance(owner.address, "erc20/" + erc20Addr))
    console.log("balanceOf(owner): ", await erc20.balanceOf(owner.address))
  }

  // sendToEvm
  {
    const funtokenPrecompile = IFunToken__factory.connect(FunTokenGatewayAddress, owner)

    const txResponse = await funtokenPrecompile.sendToEvm("erc20/" + erc20Addr, 50, owner.address)
    console.log("txResponse: ", txResponse)
    const receipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
    console.log("receipt: ", receipt)

    console.log("balanceOf(recipient): ", await funtokenPrecompile.bankBalance(owner.address, "erc20/" + erc20Addr))
    console.log("balanceOf(owner): ", await erc20.balanceOf(owner.address))
  }
}

main()

// Helper function to create a delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}