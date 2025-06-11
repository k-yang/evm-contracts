import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { Reverter__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

async function main() {
  const factory = new Reverter__factory(owner);
  const contract = await factory.deploy();
  console.log("Contract address: ", await contract.getAddress())
  await contract.waitForDeployment()

  const resp = await jsonRpcProvider.call({
    to: contract.getAddress(),
    data: contract.interface.encodeFunctionData("execute"),
    accessList: [],
    from: owner.address,
    gasLimit: 1e6,
    value: 0,
    nonce: await jsonRpcProvider.getTransactionCount(owner.address),
    type: 2,
  })
  console.log("resp:", resp)
}

main()