import { AccountData, EncodeObject } from "@cosmjs/proto-signing"
import { assertIsDeliverTxSuccess } from "@cosmjs/stargate"
import {
  Localnet,
  newSignerFromMnemonic,
  NibiruTxClient,
} from "@nibiruchain/nibijs"
import { DynamicFeeTx, MsgEthereumTx } from "@nibiruchain/nibijs/dist/src/protojs/eth/evm/v1/tx"
import { ethers, HDNodeWallet, JsonRpcProvider, Transaction } from "ethers"

const jsonRpcProvider = new JsonRpcProvider("http://localhost:8545");

// mnemonic for the HD wallet
const mnemonic = "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host"
const owner = HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/118'/0'/0/0").connect(jsonRpcProvider)

async function main() {
  const cosmosSigner = await newSignerFromMnemonic(mnemonic)
  const [{ address: fromAddr }]: readonly AccountData[] = await cosmosSigner.getAccounts();
  console.log("Cosmos address:", fromAddr)

  const cosmosTxClient = await NibiruTxClient.connectWithSigner(
    Localnet.endptTm,
    cosmosSigner
  )

  const tx = Transaction.from({
    chainId: "6900",
    to: "0xabf8519d92F1721BfBA6521bF2c32036b17A5Be5",
    value: ethers.parseUnits("123", "gwei"),
    data: null,
    gasLimit: 21000,
    maxPriorityFeePerGas: ethers.parseUnits("456", "gwei"),
    maxFeePerGas: ethers.parseUnits("789", "gwei"),
    nonce: 0, // Get this from provider.getTransactionCount(sender)
    accessList: [],
    type: 2,
  })
  const signature = owner.signingKey.sign(tx.unsignedHash)
  console.log("Signature:", signature)
  tx.signature = signature

  console.log("Tx:", tx.toJSON())

  const txHash = tx.hash
  if (!txHash) throw new Error("Transaction hash is null")
  console.log("Tx hash:", txHash)

  const msgEthTx = MsgEthereumTx.fromPartial({
    from: "0xfaf227dad0b91c2debd41dae71c959ea4f95f8f8",
    hash: txHash,
    data: {
      typeUrl: "/eth.evm.v1.DynamicFeeTx",
      value: DynamicFeeTx.encode(
        DynamicFeeTx.fromPartial({
          chainId: "6900",
          to: "0xabf8519d92F1721BfBA6521bF2c32036b17A5Be5",
          value: ethers.parseUnits("123", "gwei").toString(),
          data: new Uint8Array(0),
          gas: 21000,
          gasTipCap: ethers.parseUnits("456", "gwei").toString(),
          gasFeeCap: ethers.parseUnits("789", "gwei").toString(),
          nonce: 0,
          accesses: [],
          v: ethers.toBeArray(signature.v),
          r: ethers.getBytes(signature.r),
          s: ethers.getBytes(signature.s),
        })
      ).finish(),
    },
  })

  console.log("MsgEthereumTx:", msgEthTx)

  const msg: EncodeObject = {
    typeUrl: "/eth.evm.v1.MsgEthereumTx",
    value: msgEthTx,
  }

  const resp = await cosmosTxClient.signAndBroadcast(fromAddr, [msg], "auto")

  assertIsDeliverTxSuccess(resp)
  console.log("Transaction hash:", resp.transactionHash)
  console.log("Transaction response:", resp)
}

main();