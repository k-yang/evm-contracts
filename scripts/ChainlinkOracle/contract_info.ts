import { JsonRpcProvider } from "ethers";
import { ChainLinkAggregatorV3Interface__factory } from "../../typechain-types";

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");
const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");

const nibiUsd = "0x1ee4787898Fa3082e3af8a04e19450b17E97E70a";
const ethUsd = "0x0a713B47d49944908a983F5a42bF743b590137BE";
const btcUsd = "0x445Ca1db886ED3f08b8957e0581c25AfC6f48081";
const usdcUsd = "0x22A1eBBe1282d9E4EC64FedF71826E1faD056Eb1";
const usdtUsd = "0x86C6814Aa44fA22f7B9e0FCEC6F9de6012F322f8";

async function main() {
  const contract = ChainLinkAggregatorV3Interface__factory.connect(usdtUsd, jsonRpcProvider)
  console.log("contract address: ", await contract.getAddress())

  console.log("decimals: ", await contract.decimals())
  console.log("description: ", await contract.description())

  const [roundId, answer, startedAt, updatedAt, answeredInRound] = await contract.latestRoundData();
  console.debug("DEBUG %o: ", {
    roundId, answer, startedAt, updatedAt, answeredInRound,
  });

}

main()