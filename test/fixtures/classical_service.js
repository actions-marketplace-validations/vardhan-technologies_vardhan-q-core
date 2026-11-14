// Sample legacy banking authorization service using classical RSA and unhybridized secp256k1
import crypto from 'node:crypto';

export function signTransaction(payload, privateKeyPem) {
  // Classical RSA signature (vulnerable to Shor's algorithm)
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(payload);
  return signer.sign({
    key: privateKeyPem,
    padding: crypto.constants.RSA_PKCS1_PADDING
  });
}

export function generateLegacyKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048 // Deprecated under NIST post-quantum transition
  });
}

export function signSecp256k1(digest) {
  // Classical ECDSA without lattice-based hybrid protection
  const ec = new (require('elliptic')).ec('secp256k1');
  return ec.sign(digest, 'key');
}
