import converter from "bech32-converting";

// mnemonic for the HD wallet

const COMMAND_LINE_ARGS = process.argv.slice(2)
const address = COMMAND_LINE_ARGS[0]

async function main() {
  console.log("input address:", address)

  if (address.startsWith("nibi")) {
    console.log("output address:", converter("nibi").toHex(address))
  } else if (address.startsWith("0x")) {
    console.log("output address:", converter("nibi").toBech32(address))
  }
}

main()