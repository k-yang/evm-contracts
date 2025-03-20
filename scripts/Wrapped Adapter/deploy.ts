import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { WNIBI9__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-2.nibiru.fi:443");
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

async function main() {
  const factory = new WNIBI9__factory(owner);
  const contract = await factory.deploy(
    "0x7D4B7B8CA7E1a24928Bb96D59249c7a5bd1DfBe6",
    "unibi",
    {
      gasPrice: "1",
    },
  );
  const contractAddr = await contract.getAddress()
  console.log("WNIBI contract address: ", contractAddr)
  await contract.waitForDeployment()

  // obtain the total supply of the ERC-20 contract
  console.log("name: ", await contract.name())
  console.log("symbol: ", await contract.symbol())
  console.log("decimals:", await contract.decimals())
  console.log("totalSupply: ", await contract.totalSupply())
  console.log("balanceOf(owner): ", await contract.balanceOf(owner.address))
}

main()