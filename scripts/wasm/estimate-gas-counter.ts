import { HDNodeWallet, JsonRpcProvider, toUtf8Bytes } from "ethers";
import { IWasm__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.devnet-1.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

// get command line arguments
const COMMAND_LINE_ARGS = process.argv.slice(2)
const CONTRACT_ADDR = COMMAND_LINE_ARGS[0]

async function main() {
  const wasmPrecompile = IWasm__factory.connect("0x0000000000000000000000000000000000000802", owner);


  console.log("increment_counter:",
    await wasmPrecompile.execute.estimateGas(
      CONTRACT_ADDR,
      toUtf8Bytes(JSON.stringify({
        "increment_counter": {
          "by": 5,
        }
      })),
      [],
      {
        gasLimit: 100_000,
      }
    )
  );

  console.log("reset_counter:", await wasmPrecompile.execute.estimateGas(
    CONTRACT_ADDR,
    toUtf8Bytes(JSON.stringify({
      "reset_counter": {}
    })),
    []));
}

main()