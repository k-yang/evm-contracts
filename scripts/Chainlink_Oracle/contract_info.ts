import { HDNodeWallet, JsonRpcProvider } from "ethers";
import { NibiruOracleChainLinkLike__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
console.log("owner address:", owner.address)

const nibiUsd = "0x1ee4787898Fa3082e3af8a04e19450b17E97E70a";
const ethUsd = "0x0a713B47d49944908a983F5a42bF743b590137BE";
const btcUsd = "0x445Ca1db886ED3f08b8957e0581c25AfC6f48081";

async function main() {
  const contract = NibiruOracleChainLinkLike__factory.connect(btcUsd, owner)
  console.log("contract address: ", await contract.getAddress())

  console.log("decimals: ", await contract.decimals())
  console.log("description: ", await contract.description())

  const [roundId, answer, startedAt, updatedAt, answeredInRound] = await contract.latestRoundData();
  console.debug("DEBUG %o: ", {
    roundId, answer, startedAt, updatedAt, answeredInRound,
  });

}

main()