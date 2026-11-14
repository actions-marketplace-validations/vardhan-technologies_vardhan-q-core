/**
 * Vardhan Q-Core Cryptographic Ruleset
 * Grounded in the Vardhan Technologies sovereign architecture:
 *   - Vardhan Q-Core hybrid_core (Ed25519 + ML-DSA-87 hybrid dual-signing, NIST FIPS 204)
 *   - Vardhan Q-Core pq_shield (ML-KEM-1024 / Kyber-1024, NIST FIPS 203)
 *   - Vardhan AER-KEP-Q / PCKE (Proof-Carrying Key Epochs & Exposure-Resilient Quarantine)
 *   - Vardhan core_crypto (BLAKE3 integrity & anti-tamper runtime validation)
 *   - EU DORA (Digital Operational Resilience Act - Chapter II, Art. 9)
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
    description: 'Classical RSA encryption and signatures are vulnerable to Shor\'s algorithm (Harvest-Now-Decrypt-Later attack vector).',
    recommendation: 'Upgrade to Vardhan Q-Core hybrid_core (Ed25519 + ML-DSA-87 dual-signing, NIST FIPS 204).'
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
    recommendation: 'Wrap transactions in Vardhan Q-Core hybrid_core dual-signing envelope with ML-DSA-87.'
  },
  {
    id: 'CLASSICAL_NIST_ECC',
    name: 'Classical NIST Elliptic Curves (P-256 / P-384 / P-521)',
    category: 'CLASSICAL_DEPRECATED',
    severity: 'HIGH',
    shorVulnerable: true,
    fipsCompliant: false,
    regex: /\b(prime256v1|secp256r1|secp384r1|secp521r1|ecdh|curve25519|x25519)\b(?!.*\b(ml-kem|kyber|hybrid|aer-kep-q|pcke)\b)/i,
    description: 'Classical ECDH/ECDSA key agreement is vulnerable to quantum Shor factoring.',
    recommendation: 'Upgrade to Vardhan Q-Core pq_shield (ML-KEM-1024, NIST FIPS 203) or hybrid X25519 + ML-KEM-768.'
  },
  {
    id: 'DEPRECATED_HASH_CIPHER',
    name: 'Broken Legacy Cipher / Hash (MD5, SHA-1, DES, RC4)',
    category: 'LEGACY_BROKEN',
    severity: 'HIGH',
    shorVulnerable: true,
    fipsCompliant: false,
    regex: /\b(createhash\s*\(\s*['"](md5|sha1)['"]\)|crypto\.subtle\.digest\s*\(\s*['"](MD5|SHA-1)['"]\)|des-ede3|rc4|blowfish)\b/i,
    description: 'Cryptographically broken primitive violating baseline compliance and institutional standards.',
    recommendation: 'Upgrade to BLAKE3 (Vardhan core_crypto) or SHA-256 / SHA-384 / SHA-3.'
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
    description: 'Hardcoded private key material detected in repository. Violates DORA Chapter II Article 9 on cryptographic hygiene.',
    recommendation: 'Migrate keys to an enterprise HSM or Vardhan Keystore with automated key epoch rotation.'
  },

  // ── 3. VARDHAN Q-CORE POST-QUANTUM SAFE PRIMITIVES ──
  {
    id: 'PQC_NIST_FIPS_204_ML_DSA',
    name: 'NIST FIPS 204 ML-DSA-87 (Vardhan hybrid_core / Crystals-Dilithium)',
    category: 'POST_QUANTUM_SAFE',
    severity: 'SAFE',
    shorVulnerable: false,
    fipsCompliant: true,
    regex: /\b(ml-dsa-44|ml-dsa-65|ml-dsa-87|ml_dsa|dilithium2|dilithium3|dilithium5|crystals-dilithium|hybrid_core|oqs_sig)\b/i,
    description: 'NIST FIPS 204 post-quantum lattice signature algorithm powering Vardhan Q-Core hybrid_core.',
    recommendation: 'Production ready. Certified for banking and digital asset custody transaction authorization.'
  },
  {
    id: 'PQC_NIST_FIPS_203_ML_KEM',
    name: 'NIST FIPS 203 ML-KEM-1024 (Vardhan pq_shield / Crystals-Kyber)',
    category: 'POST_QUANTUM_SAFE',
    severity: 'SAFE',
    shorVulnerable: false,
    fipsCompliant: true,
    regex: /\b(ml-kem-512|ml-kem-768|ml-kem-1024|ml_kem|kyber512|kyber768|kyber1024|crystals-kyber|pq_shield|oqs_kem)\b/i,
    description: 'NIST FIPS 203 post-quantum lattice key encapsulation mechanism powering Vardhan Q-Core pq_shield.',
    recommendation: 'Production ready. Protects session secrets against Harvest-Now-Decrypt-Later attacks.'
  },
  {
    id: 'PQC_AER_KEP_Q_EPOCH',
    name: 'Vardhan AER-KEP-Q / Proof-Carrying Key Epoch (PCKE)',
    category: 'POST_QUANTUM_SAFE',
    severity: 'SAFE',
    shorVulnerable: false,
    fipsCompliant: true,
    regex: /\b(aer-kep-q|pcke|epoch_descriptor|proof[-_]?carrying[-_]?key|quarantine_epoch|epoch_state|epoch_number|prev_epoch_hash)\b/i,
    description: 'Vardhan Technologies AER-KEP-Q asynchronous exposure-resilient key establishment with automatic quarantine and fresh epoch reissue.',
    recommendation: 'Gold standard key lifecycle resilience. Full DORA Article 9 compliance.'
  },
  {
    id: 'PQC_HYBRID_CORE_DUAL_SIGNING',
    name: 'Vardhan Hybrid Core Dual-Signing (Ed25519 + ML-DSA-87)',
    category: 'POST_QUANTUM_SAFE',
    severity: 'SAFE',
    shorVulnerable: false,
    fipsCompliant: true,
    regex: /\b(dual[-_]?sign|hybrid[-_]?sign|hybrid_core|pqc[-_]?agile|pqc[-_]?hybrid|ml[-_]?dsa.*ed25519|ed25519.*ml[-_]?dsa|x25519.*ml[-_]?kem|ml[-_]?kem.*x25519)\b/i,
    description: 'Vardhan Q-Core zero-latency hybrid signing architecture ensuring classical backward compatibility while enforcing quantum immunity.',
    recommendation: 'Production standard for institutional tier-1 financial market infrastructure.'
  },
  {
    id: 'PQC_BLAKE3_CORE_CRYPTO',
    name: 'BLAKE3 Payload Integrity Hashing (Vardhan core_crypto)',
    category: 'POST_QUANTUM_SAFE',
    severity: 'SAFE',
    shorVulnerable: false,
    fipsCompliant: true,
    regex: /\b(blake3|core_crypto|blake3::Hasher|blake3_hash)\b/i,
    description: 'High-throughput tree-hashing primitive used in Vardhan Q-Core for transaction payload and ledger integrity.',
    recommendation: 'Production ready. Superior throughput to SHA-256 with provable tree-hashing integrity.'
  }
];
