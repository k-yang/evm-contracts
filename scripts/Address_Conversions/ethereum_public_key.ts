import { keccak256 } from 'ethereum-cryptography/keccak';
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils';

function publicKeyHexToEthereumAddress(publicKeyHex: string): string {
  // Remove '0x' prefix and '04' prefix for uncompressed public key if present
  let cleanPublicKey = publicKeyHex.replace(/^(0x)?04/, '');

  // Convert hex string to Uint8Array
  const publicKeyBytes = hexToBytes(cleanPublicKey);

  // Hash the public key with Keccak-256
  const hash = keccak256(publicKeyBytes);

  // Take the last 20 bytes and convert to hex with '0x' prefix
  const address = '0x' + bytesToHex(hash.slice(-20));

  return address;
}

// Example usage
function main() {
  // Example public key hex string (can be with or without 0x/04 prefix)
  const publicKeyHex = '04FCF004EAE263CB15C045EB5DFD605DA9E14FD8A695F59E5162D0F29331AD1B201B39BD254661402973A6D68099AB8910E17F7730EB3FA5E114E0153BB9131D92';

  try {
    const ethereumAddress = publicKeyHexToEthereumAddress(publicKeyHex);
    console.log('Ethereum Address:', ethereumAddress);
  } catch (error) {
    console.error('Conversion error:', error);
  }
}

main();