import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { RandomConsumer__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

async function main() {
  // deploy contract
  const factory = new RandomConsumer__factory(owner);
  const attackContract = await factory.deploy();
  await attackContract.waitForDeployment();
  console.log("contract address: ", await attackContract.getAddress())

  const random = await attackContract.getRandom();
  console.log("random: ", random);
}

main();
