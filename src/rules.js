/**
 * Vardhan Post-Quantum & DORA Cryptographic Ruleset
 * Grounded in NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA),
 * and EU DORA (Digital Operational Resilience Act - Chapter II, Art. 9).
 */

export const CRYPTO_RULES = [
  // ── 1. CLASSICAL VULNERABLE ASYMMETRIC ALGORITHMS (CRITICAL HNDL EXPOSURE) ──
  {
    id: 'CLASSICAL_RSA_DEPRECATION',
    name: 'Classical RSA Asymmetric Cryptography',
    category: 'CLASSICAL_DEPRECATED',
    severity: 'CRITICAL',
    shorVulnerable: true,
    fipsCompliant: false,
    regex: /\b(rsa-sha1|rsa-sha256|rsa-sha384|rsa-sha512|rsassa-pkcs1-v1_5|rsa_pkcs1_padding|rsa_pkcs1_oaep_padding|moduluslength\s*:\s*(1024|2048|3072|4096)|creatediffiehellman|rsa\.generate|rsa_key|rsapublickey|rsaprivatekey)\b/i,
    description: 'Classical RSA encryption/signing is vulnerable to Shor\'s algorithm (Harvest-Now-Decrypt-Later attack vector).',
    recommendation: 'Migrate to NIST FIPS 204 (ML-DSA-87 / Dilithium) or implement a hybrid dual-signing scheme (Ed25519 + ML-DSA-87).'
  },
  {
    id: 'CLASSICAL_SECP256K1_ECDSA',
    name: 'Classical secp256k1 Elliptic Curve (Unhybridized)',
    category: 'CLASSICAL_DEPRECATED',
    severity: 'HIGH',
    shorVulnerable: true,
    fipsCompliant: false,
    regex: /\b(secp256k1|ecdsa\.sign|ecdsa\.verify|ec_key|recoverpublickey|ecrecover|elliptic\.ec\s*\(\s*['"]secp256k1['"]\))\b/i,
    description: 'Unhybridized secp256k1 signatures can be forged by a Cryptographically Relevant Quantum Computer (CRQC).',
    recommendation: 'Wrap transactional signatures in a lattice-based hybrid dual-signing envelope with ML-DSA-87.'
  },
  {
    id: 'CLASSICAL_NIST_ECC',
    name: 'Classical NIST Elliptic Curves (P-256 / P-384 / P-521)',
    category: 'CLASSICAL_DEPRECATED',
    severity: 'HIGH',
    shorVulnerable: true,
    fipsCompliant: false,
    regex: /\b(prime256v1|secp256r1|secp384r1|secp521r1|ecdh|curve25519|x25519)\b(?!.*\b(ml-kem|kyber|hybrid)\b)/i,
    description: 'Classical ECDH/ECDSA key agreement is vulnerable to quantum Shor factoring.',
    recommendation: 'Upgrade to NIST FIPS 203 (ML-KEM-768 or ML-KEM-1024) or hybrid X25519 + ML-KEM-768 encapsulation.'
  },
  {
    id: 'DEPRECATED_HASH_CIPHER',
    name: 'Broken Legacy Cipher / Hash (MD5, SHA-1, DES, RC4)',
    category: 'LEGACY_BROKEN',
    severity: 'HIGH',
    shorVulnerable: true,
    fipsCompliant: false,
    regex: /\b(createhash\s*\(\s*['"](md5|sha1)['"]\)|crypto\.subtle\.digest\s*\(\s*['"](MD5|SHA-1)['"]\)|des-ede3|rc4|blowfish)\b/i,
    description: 'Cryptographically broken primitive violating baseline compliance standards.',
    recommendation: 'Upgrade to SHA-256, SHA-384, SHA-3, or SHAKE-256 (NIST FIPS 202).'
  },

  // ── 2. DORA REGULATORY & RESILIENCE COMPLIANCE ──
  {
    id: 'HARDCODED_PRIVATE_KEY',
    name: 'Hardcoded Private Key / Secret Material',
    category: 'DORA_COMPLIANCE_GAP',
    severity: 'CRITICAL',
    shorVulnerable: false,
    fipsCompliant: false,
    regex: /-----BEGIN\s+(RSA|EC|DSA|OPENSSH|ENCRYPTED)?\s*PRIVATE\s+KEY-----/,
    description: 'Hardcoded private key material detected in repository files. Violates DORA Chapter II Article 9 on cryptographic hygiene.',
    recommendation: 'Move all cryptographic credentials to a cloud HSM (AWS CloudHSM, Azure Key Vault, HashiCorp Vault).'
  },

  // ── 3. POST-QUANTUM CRYPTOGRAPHY IMPLEMENTATIONS (PQC SAFE) ──
  {
    id: 'PQC_NIST_FIPS_203_ML_KEM',
    name: 'NIST FIPS 203 ML-KEM (Module-Lattice Key Encapsulation / Kyber)',
    category: 'POST_QUANTUM_SAFE',
    severity: 'SAFE',
    shorVulnerable: false,
    fipsCompliant: true,
    regex: /\b(ml-kem-512|ml-kem-768|ml-kem-1024|ml_kem|kyber512|kyber768|kyber1024|crystals-kyber|oqs_kem)\b/i,
    description: 'Post-Quantum key encapsulation mechanism standardized in NIST FIPS 203.',
    recommendation: 'Production ready. Maintain automated key epoch rotation.'
  },
  {
    id: 'PQC_NIST_FIPS_204_ML_DSA',
    name: 'NIST FIPS 204 ML-DSA (Module-Lattice Digital Signatures / Dilithium)',
    category: 'POST_QUANTUM_SAFE',
    severity: 'SAFE',
    shorVulnerable: false,
    fipsCompliant: true,
    regex: /\b(ml-dsa-44|ml-dsa-65|ml-dsa-87|ml_dsa|dilithium2|dilithium3|dilithium5|crystals-dilithium|oqs_sig)\b/i,
    description: 'Post-Quantum digital signature algorithm standardized in NIST FIPS 204.',
    recommendation: 'Production ready. Certified for banking and custody transaction authorization.'
  },
  {
    id: 'PQC_NIST_FIPS_205_SLH_DSA',
    name: 'NIST FIPS 205 SLH-DSA (Stateless Hash-Based Signatures / SPHINCS+)',
    category: 'POST_QUANTUM_SAFE',
    severity: 'SAFE',
    shorVulnerable: false,
    fipsCompliant: true,
    regex: /\b(slh-dsa|slh_dsa|sphincs\+|sphincsplus)\b/i,
    description: 'Stateless hash-based signature algorithm providing conservative fallback security.',
    recommendation: 'Suitable for root of trust certificates and firmware signing.'
  },
  {
    id: 'PQC_HYBRID_DUAL_SIGNING',
    name: 'Hybrid Dual-Signing / Cryptographic Agility Architecture',
    category: 'POST_QUANTUM_SAFE',
    severity: 'SAFE',
    shorVulnerable: false,
    fipsCompliant: true,
    regex: /\b(dual[-_]?sign|hybrid[-_]?sign|pqc[-_]?agile|pqc[-_]?hybrid|ml[-_]?dsa.*ed25519|ed25519.*ml[-_]?dsa|x25519.*ml[-_]?kem|ml[-_]?kem.*x25519)\b/i,
    description: 'Zero-latency hybrid post-quantum architecture ensuring backwards compatibility while providing quantum immunity.',
    recommendation: 'Gold-standard implementation for institutional financial market infrastructure.'
  }
];
