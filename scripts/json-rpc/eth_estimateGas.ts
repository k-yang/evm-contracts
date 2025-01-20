import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { MyToken__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.devnet-1.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
const recipient = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/1").connect(jsonRpcProvider)

async function main() {
  console.log("owner address:", owner.address)
  const factory = new MyToken__factory(owner);
  const contract = await factory.deploy(owner, {
    gasPrice: "1",
  });
  console.log("ERC20 contract address: ", await contract.getAddress())
  await contract.waitForDeployment()

  // obtain the total supply of the ERC-20 contract
  console.log("totalSupply: ", await contract.totalSupply())
  console.log("balanceOf(owner): ", await contract.balanceOf(owner.address))

  // transfer 100 tokens to another address
  const txResponse = await contract.transfer(recipient.address, 100)
  await jsonRpcProvider.waitForTransaction(txResponse.hash)

  console.log("balanceOf(recipient): ", await contract.balanceOf(recipient.address))
  console.log("balanceOf(owner): ", await contract.balanceOf(owner.address))
}

main()