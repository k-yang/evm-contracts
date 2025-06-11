import {
  abi as UNIV3_ABI,
  bytecode as UNIV3_BYTECODE,
} from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json';
import {
  abi as SWAP_ROUTER_ABI,
  bytecode as SWAP_ROUTER_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json';
import { ContractFactory, HDNodeWallet, JsonRpcProvider } from "ethers";
import { ERC20Minter__factory, SimpleSwap__factory, WETH9__factory } from '../../typechain-types';

// connects to local node
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.testnet-2.nibiru.fi:443");
const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");
// const jsonRpcProvider = new JsonRpcProvider("https://evm-rpc.nibiru.fi:443");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)
console.log("owner address:", owner.address)

async function main() {
  // deploy WETH9
  const weth9Contract = await new WETH9__factory(owner).deploy({
    gasPrice: "1",
  });

  const weth9Addr = await weth9Contract.getAddress()
  console.log("WETH9 contract address: ", weth9Addr)

  await weth9Contract.waitForDeployment()

  // deploy another ERC20 token
  const erc20Contract = await new ERC20Minter__factory(owner).deploy("DAI Token", "DAI", 18, {
    gasPrice: "1",
  });

  const erc20Addr = await erc20Contract.getAddress()
  console.log("ERC20 contract address: ", erc20Addr)

  await erc20Contract.waitForDeployment()

  // deploy factory contract
  const factoryContract = await new ContractFactory(UNIV3_ABI, UNIV3_BYTECODE, owner).deploy({
    gasPrice: "1",
  });

  const factoryAddr = await factoryContract.getAddress()
  console.log("UniV3 factory contract address: ", factoryAddr)

  await factoryContract.waitForDeployment()

  // deploy swap router contract
  const swapRouterContract = await new ContractFactory(
    SWAP_ROUTER_ABI,
    SWAP_ROUTER_BYTECODE,
    owner
  ).deploy(factoryAddr, weth9Addr, {
    gasPrice: "1",
  });

  const swapRouterAddr = await swapRouterContract.getAddress()
  console.log("UniswapV3 swap router contract address: ", swapRouterAddr)

  await swapRouterContract.waitForDeployment()

  // deploy simple swap contract
  const simpleSwapContract = await new SimpleSwap__factory(owner).deploy(
    swapRouterAddr,
    {
      gasPrice: "1",
    },
  );

  const simpleSwapAddr = await simpleSwapContract.getAddress()
  console.log("SimpleSwap contract address: ", simpleSwapAddr)

  await simpleSwapContract.waitForDeployment()

  // deposit into WETH9
  const depositTx = await weth9Contract.deposit({
    gasPrice: "1",
    value: "1000000000000000000", // 1 NIBI
  })
  console.log("depositTx: ", depositTx)
  await depositTx.wait()

  // approve WETH9 for spending
  const approveTx = await weth9Contract.approve(simpleSwapAddr, "1000000000000000000", {
    gasPrice: "1",
  })
  console.log("approveTx: ", approveTx)
  await approveTx.wait()

  // swap WETH9 for DAI

  const amountIn = "1000000000000000000"
  const amountOut = await simpleSwapContract.swapWETHForDAI(amountIn, weth9Addr, erc20Addr, 3000)
  console.log("amountOut: ", amountOut)
}

main()