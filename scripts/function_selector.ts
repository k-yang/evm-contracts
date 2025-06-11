import { AbiCoder } from "ethers";


async function main() {
  // Get the function selector for "mint(address,uint256)"
  // Function selector is the first 4 bytes of the keccak256 hash of the function signature
  const functionSignature = "mint(address,uint256)";
  const functionSelector = AbiCoder.defaultAbiCoder().encode(["string"], [functionSignature]);
  
  // Take the first 4 bytes (8 hex characters + '0x' prefix) of the keccak256 hash
  const result = "0x" + functionSelector.slice(2, 10);
  console.log("Function selector for mint(address,uint256):", result);
}

main()