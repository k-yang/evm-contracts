import { HDNodeWallet, JsonRpcProvider, toUtf8Bytes } from "ethers";
import { WastefulGas__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

const WASM_CONTRACT_ADDR = process.argv[2];

async function main() {
  // deploy contract
  const factory = new WastefulGas__factory(owner);
  const attackContract = await factory.deploy();
  await attackContract.waitForDeployment();
  console.log("contract address: ", await attackContract.getAddress())

  const msgBzNoGas = toUtf8Bytes(JSON.stringify({
    "no_gas": {},
  }));

  // call attack
  const txNoGas = await attackContract.attack(WASM_CONTRACT_ADDR, msgBzNoGas, { gasLimit: "200000" });
  const receiptNoGas = await txNoGas.wait();
  console.log("receiptNoGas: ", receiptNoGas);


  const msgBzWasteGas = toUtf8Bytes(JSON.stringify({
    "waste_gas": {
      "gas_limit": 0,
    },
  }));
  // call attack
  const txWasteGas = await attackContract.attack(WASM_CONTRACT_ADDR, msgBzWasteGas, { gasLimit: "200000" });
  const receiptWasteGas = await txWasteGas.wait();
  console.log("receiptWasteGas: ", receiptWasteGas);
}

main();
