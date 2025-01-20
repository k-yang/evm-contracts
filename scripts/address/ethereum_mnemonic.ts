import { bech32 } from 'bech32';
import { ripemd160 } from 'ethereum-cryptography/ripemd160';
import { sha256 } from 'ethereum-cryptography/sha256';
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils';
import { HDNodeWallet } from 'ethers';

interface Keypair {
  privateKey: string;
  compressedPublicKey: string;
  uncompressedPublicKey: string;
  address: string;
}

function mnemonicToKeypair(
  mnemonic: string,
  hdPath: string = "m/44'/60'/0'/0/0" // Ethereum default HD path
): Keypair {
  // Validate mnemonic (basic check)
  if (mnemonic.split(' ').length !== 24) {
    throw new Error('Mnemonic must be 24 words long');
  }

  // Method 1: Using ethers.js (simplest approach)
  const wallet = HDNodeWallet.fromPhrase(mnemonic, "", hdPath);

  return {
    privateKey: wallet.privateKey.slice(2).toUpperCase(),
    compressedPublicKey: wallet.signingKey.compressedPublicKey.slice(2).toUpperCase(),
    uncompressedPublicKey: wallet.signingKey.publicKey.slice(2).toUpperCase(),
    address: wallet.address
  };
}

function publicKeyToCosmosAddress(publicKey: string, prefix: string = 'nibi'): string {
  // Remove '0x' prefix and '04' prefix for uncompressed public key if present
  let cleanPublicKey = publicKey.replace(/^(0x)?04/, '');
  console.log(cleanPublicKey);

  // Convert hex string to Uint8Array
  const publicKeyBytes = hexToBytes(cleanPublicKey);

  // ripemd160 hash of sha256 hash of public key
  const hash = ripemd160(sha256(publicKeyBytes));
  console.log(bytesToHex(hash));

  const words = bech32.toWords(hash);

  // Encode with specified prefix
  return bech32.encode(prefix, words);
}


// Example usage
function main() {
  // Your 24-word mnemonic
  const mnemonic = 'guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host';

  try {
    // Using ethers.js method (recommended)
    const keypair = mnemonicToKeypair(mnemonic, hdPaths.ethereum);
    console.log('Keypair using ethers.js:');
    console.log('Private Key:', keypair.privateKey);
    console.log('Public Key (Compressed):', keypair.compressedPublicKey);
    console.log('Public Key (Uncompressed):', keypair.uncompressedPublicKey);
    console.log('Address:', keypair.address);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Common HD paths
const hdPaths = {
  ethereum: "m/44'/60'/0'/0/0",
  cosmos: "m/44'/118'/0'/0/0",
};

main();