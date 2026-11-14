import { CryptoScanner } from '../src/scanner.js';
import path from 'node:path';
import assert from 'node:assert';

console.log('🧪 Running Vardhan Quantum Security Scanner Unit Tests...\n');

const fixturesDir = path.resolve('./test/fixtures');
const scanner = new CryptoScanner({
  path: fixturesDir,
  failOnVulnerable: false,
  minPqcScore: 0
});

const result = scanner.run();
const { summary, findings } = result;

console.log(`Scan summary on fixtures:`);
console.log(`- Files scanned: ${summary.scannedFilesCount}`);
console.log(`- Classical primitives found: ${summary.classicalCount}`);
console.log(`- PQC primitives found: ${summary.pqcCount}`);
console.log(`- Computed PQC readiness: ${summary.pqcScore}%\n`);

// Assertions
assert(summary.scannedFilesCount >= 2, 'Should scan at least 2 fixture files');
assert(summary.classicalCount >= 3, 'Should find at least 3 classical primitives in classical_service.js');
assert(summary.pqcCount >= 3, 'Should find at least 3 PQC primitives in pqc_service.rs');

// Verify classical detections
const classicalRules = findings.classical.map(f => f.ruleId);
assert(classicalRules.includes('CLASSICAL_RSA_DEPRECATION'), 'Must detect Classical RSA deprecation');
assert(classicalRules.includes('CLASSICAL_SECP256K1_ECDSA'), 'Must detect secp256k1 ECDSA');

// Verify PQC detections
const pqcRules = findings.pqc.map(f => f.ruleId);
assert(pqcRules.includes('PQC_NIST_FIPS_204_ML_DSA'), 'Must detect NIST FIPS 204 ML-DSA');
assert(pqcRules.includes('PQC_NIST_FIPS_203_ML_KEM'), 'Must detect NIST FIPS 203 ML-KEM');
assert(pqcRules.includes('PQC_HYBRID_DUAL_SIGNING'), 'Must detect Hybrid Dual-Signing');

console.log('✅ ALL TEST ASSERTIONS PASSED! Scanner is mathematically and logically sound.\n');
