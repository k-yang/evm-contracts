import { bech32 } from 'bech32';
import { ripemd160 } from 'ethereum-cryptography/ripemd160';
import { sha256 } from 'ethereum-cryptography/sha256';
import { hexToBytes } from 'ethereum-cryptography/utils';


function publicKeyToCosmosAddress(publicKey: string, prefix: string = 'nibi'): string {
  // Remove '0x' prefix and '04' prefix for uncompressed public key if present
  let cleanPublicKey = publicKey.replace(/^(0x)?04/, '');

  // Convert hex string to Uint8Array
  const publicKeyBytes = hexToBytes(cleanPublicKey);

  // ripemd160 hash of sha256 hash of public key
  const hash = ripemd160(sha256(publicKeyBytes));

  const words = bech32.toWords(hash);

  // Encode with specified prefix
  return bech32.encode(prefix, words);
}

// Example usage
function main() {
  // Example public key hex string (can be with or without 0x/04 prefix)
  const publicKey = '02FCF004EAE263CB15C045EB5DFD605DA9E14FD8A695F59E5162D0F29331AD1B20';

  try {
    const cosmosAddress = publicKeyToCosmosAddress(publicKey);
    console.log('Cosmos Address:', cosmosAddress);
  } catch (error) {
    console.error('Conversion error:', error);
  }
}

main();