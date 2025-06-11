import { Interface, JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/NGmUI_T67oGsti8zX4aGy_aqX9jkkQdm");
const contractAddress = "0x8238884ec9668ef77b90c6dff4d1a9f4f4823bfe";

async function main() {
  const blockNumber = await provider.getBlockNumber();
  console.log(blockNumber);

  // Get the function selector for "mint(address,uint256)"
  // Function selector is the first 4 bytes of the keccak256 hash of the function signature
  const iface = new Interface(["function mint(address to,uint256 amount)", "function owner()"]);
  const data = iface.encodeFunctionData("mint", ["0x0000000000000000000000000000000000000000", 100]);
  console.log(data);

  const tx = await provider.call({
    to: contractAddress,
    data: data,
    from: "0x5EaFF7af80488033Bc845709806D5Fae5291eB88"
  })
  console.log(tx);

}

main()