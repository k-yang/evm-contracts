import { HDNodeWallet, JsonRpcProvider, toUtf8Bytes, toUtf8String } from "ethers";
import { IWasm__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.devnet-1.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

// get command line arguments
const COMMAND_LINE_ARGS = process.argv.slice(2)
const COUNTER_ADDR = COMMAND_LINE_ARGS[0]

async function main() {
  const wasmPrecompile = IWasm__factory.connect("0x0000000000000000000000000000000000000802", owner);
  const resp = await wasmPrecompile.query(COUNTER_ADDR, toUtf8Bytes(JSON.stringify({ "get_counter": {} })))
  console.log("counter value: ", toUtf8String(resp))

  const msgBz = toUtf8Bytes(JSON.stringify({
    "increment_counter": {
      "by": 5,
    }
  }));

  const txResponse = await wasmPrecompile.execute(COUNTER_ADDR, msgBz, [{
    amount: 10,
    denom: "unibi",
  }], {
    gasLimit: 3000000,
  });
  console.log("tx: ", txResponse)
  const txReceipt = await jsonRpcProvider.waitForTransaction(txResponse.hash)
  console.log("txReceipt: ", txReceipt)
}

main()