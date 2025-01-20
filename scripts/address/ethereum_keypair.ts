import { keccak256 } from 'ethereum-cryptography/keccak';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils';

function generateKeypair() {
  // Generate private key
  const privateKey = hexToBytes('0x' + 'FF15BD81CDDF469FD807C069F0542E5287EED9009888B71D7CD6925A456487D0');

  // Derive public key
  const publicKey = secp256k1.getPublicKey(privateKey);

  // Convert to hex strings
  const privateKeyHex = bytesToHex(privateKey);
  const publicKeyHex = bytesToHex(publicKey);

  // Derive Ethereum address
  const addressBytes = keccak256(publicKey.slice(1)).slice(-20);
  const address = '0x' + bytesToHex(addressBytes);

  return {
    privateKey: privateKeyHex,
    publicKey: publicKeyHex,
    address: address
  };
}

const keypair = generateKeypair();
console.log('Private Key:', keypair.privateKey);
console.log('Public Key:', keypair.publicKey);
console.log('Ethereum Address:', keypair.address);