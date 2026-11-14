# Vardhan Q-Core

**Post-quantum cryptographic security gate for software supply chains.**

Vardhan Q-Core is a GitHub Actions security gate that audits codebases for cryptographic compliance against NIST post-quantum standards (FIPS 203, FIPS 204), detects residual classical cryptography, validates AER-KEP-Q key epoch patterns, and enforces DORA Article 9 operational resilience controls — all within the standard CI/CD pipeline.

The gate is designed for regulated enterprises, Tier-1 banks, digital asset custodians, and any institution undergoing a classical-to-post-quantum cryptographic migration.

---

## Overview

Classical cryptographic primitives — RSA, ECDH, ECDSA, AES-128 — are vulnerable to Cryptographically Relevant Quantum Computers (CRQCs). NIST finalised its post-quantum cryptography (PQC) standards in 2024: FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA). Regulated institutions are required to begin migration planning under DORA Article 9 and emerging FCA/PRA guidance.

Vardhan Q-Core integrates this compliance check directly into the merge gate, making cryptographic posture a first-class CI/CD signal — not an afterthought in a quarterly audit.

---

## What It Checks

### Post-Quantum Compliance

| Check | Standard | Description |
|:---|:---|:---|
| ML-KEM-1024 usage | NIST FIPS 203 | Key encapsulation — quantum-safe replacement for RSA/ECDH |
| ML-DSA-87 usage | NIST FIPS 204 | Digital signatures — quantum-safe replacement for ECDSA/RSA |
| AER-KEP-Q epoch patterns | Vardhan Q-Core | Proof-carrying key epoch with exposure detection and automatic reissue |
| Hybrid signing patterns | RFC 8032 + FIPS 204 | Ed25519 classical + ML-DSA-87 post-quantum dual-signing |
| BLAKE3 payload hashing | — | Cryptographic payload integrity |
| Secure memory patterns | — | Zeroize-on-drop semantics for key material |

### Classical Cryptography Detection (DORA Article 9)

| Pattern | Risk |
|:---|:---|
| RSA key generation / encryption | Quantum-vulnerable |
| ECDH / ECDSA | Quantum-vulnerable |
| AES-128 | Below NIST PQC security Level 3 threshold |
| MD5 / SHA-1 | Cryptographically broken |
| Hardcoded private keys or secrets | Immediate operational risk |

---

## Usage

```yaml
- name: Vardhan Q-Core Security Gate
  uses: vishnuvardhanburri/vardhan-q-core@v1
  with:
    path: '.'
    fail_on_vulnerable: 'true'
    min_pqc_score: '50'
```

### Inputs

| Input | Required | Default | Description |
|:---|:---|:---|:---|
| `path` | No | `.` | Root path to scan |
| `fail_on_vulnerable` | No | `true` | Fail the workflow if classical cryptography is detected |
| `min_pqc_score` | No | `0` | Minimum PQC compliance score (0–100) required to pass |

### Outputs

| Output | Description |
|:---|:---|
| `pqc_score` | Integer score (0–100) representing post-quantum cryptographic coverage |
| `classical_count` | Number of classical cryptographic instances detected |
| `pqc_count` | Number of post-quantum cryptographic instances detected |
| `dora_gaps` | Number of DORA Article 9 control gaps detected |
| `report` | Path to the full Markdown audit report |

---

## Full Workflow Example

```yaml
name: Cryptographic Security Gate

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  cryptographic-audit:
    name: Vardhan Q-Core Cryptographic Gate
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Vardhan Q-Core Security Gate
        id: qcore
        uses: vishnuvardhanburri/vardhan-q-core@v1
        with:
          path: '.'
          fail_on_vulnerable: 'true'
          min_pqc_score: '50'

      - name: Print Results
        run: |
          echo "PQC Score:        ${{ steps.qcore.outputs.pqc_score }}"
          echo "Classical found:  ${{ steps.qcore.outputs.classical_count }}"
          echo "PQC found:        ${{ steps.qcore.outputs.pqc_count }}"
          echo "DORA gaps:        ${{ steps.qcore.outputs.dora_gaps }}"
```

---

## Cryptographic Rules Engine

The gate ships with a rules engine maintained against the Vardhan Q-Core sovereign substrate. Rules are version-controlled and auditable.

### Supported Languages and File Types

The scanner traverses all source files in the target path and applies pattern matching against:

- Rust (`.rs`)
- TypeScript / JavaScript (`.ts`, `.js`, `.mjs`)
- Python (`.py`)
- Go (`.go`)
- Java / Kotlin (`.java`, `.kt`)
- C / C++ (`.c`, `.cpp`, `.h`)
- Configuration files (`.yml`, `.yaml`, `.json`, `.toml`, `.env`)
- Any other text file containing cryptographic identifiers

### PQC Pattern Coverage

```
ML-KEM-1024, ML-KEM-768, X25519MLKEM768
ML-DSA-87, ML-DSA-65, ML-DSA-44
AER-KEP-Q, PCKE, pq_shield, hybrid_core
BLAKE3, zeroize, secure_memory
Groth16, Circom, proof-carrying
HKDF-SHA3-512, epoch_number, encapsulate, decapsulate
```

### Classical Risk Pattern Coverage

```
RSA, rsa_generate, rsa_encrypt, rsa_decrypt
ECDH, ECDSA, secp256k1, P-256, P-384
AES-128, DES, 3DES, RC4, MD5, SHA-1
createPrivateKey, generateKeyPair (without PQC context)
Hardcoded private key patterns (-----BEGIN * PRIVATE KEY-----)
```

---

## AER-KEP-Q Detection

AER-KEP-Q (Asynchronous Exposure-Resilient Key Establishment — Quarantine/Reissue) is the Vardhan Q-Core key epoch management protocol. The gate specifically validates:

- Presence of epoch-bound session key derivation (HKDF with transaction_id binding)
- Exposure detection handler registration (`on_exposure`, `on_exposure_persistent`)
- Epoch state machine transitions (Active → Quarantined → Active N+1)
- ML-KEM-1024 encapsulation/decapsulation pairs
- ML-DSA-87 epoch descriptor signing
- BLAKE3 epoch hash chaining

If AER-KEP-Q patterns are present in the codebase without the full epoch lifecycle, the gate flags a DORA gap.

---

## Audit Report

On every run, the gate produces a step summary report and a downloadable Markdown audit file containing:

- Scan metadata (timestamp, files scanned, engine version)
- PQC compliance score with breakdown
- Classical cryptographic findings with file locations and line references
- DORA Article 9 gap analysis
- AER-KEP-Q pattern coverage assessment
- Remediation guidance for each finding category

The report is written to the GitHub Actions step summary and optionally uploaded as a workflow artifact for audit trail purposes.

---

## Security Boundary

This action operates as a **diagnostic wrapper** over the Vardhan Q-Core sovereign substrate. It performs static pattern analysis on source code and configuration files. It does not:

- Execute any code from the scanned repository
- Transmit scanned code or findings to external services
- Access secrets, environment variables, or runtime credentials
- Modify any files in the scanned repository

All scanning logic runs entirely within the GitHub Actions runner. No data leaves the CI environment.

---

## DORA Article 9 Alignment

DORA (Digital Operational Resilience Act) Article 9 requires financial entities to maintain ICT security policies that address cryptographic controls, including key management, algorithm deprecation, and resilience to emerging threats. The Vardhan Q-Core gate supports this obligation by:

- Detecting use of cryptographic algorithms scheduled for deprecation
- Validating presence of post-quantum key encapsulation and signing
- Identifying hardcoded key material and secret exposure risks
- Producing a machine-readable compliance report suitable for audit evidence packages

This gate does not constitute a legal compliance assessment. Use of this action does not confirm or certify DORA compliance. Formal compliance assessment must be conducted by a qualified independent assessor.

---

## Implementation Status

| Capability | Status |
|:---|:---|
| PQC pattern detection (ML-KEM, ML-DSA, BLAKE3) | Implemented |
| Classical cryptography detection | Implemented |
| AER-KEP-Q pattern validation | Implemented |
| DORA Article 9 gap flagging | Implemented |
| Step summary Markdown report | Implemented |
| GitHub annotations (file + line) | Implemented |
| Workflow outputs (score, counts) | Implemented |
| Multi-language support | Implemented |
| AST-level analysis | Planned |
| Policy-as-code rule customisation | Planned |
| SARIF output for GitHub Code Scanning | Planned |

---

## Versioning

This action follows semantic versioning. The `v1` tag tracks the latest stable `1.x.x` release and is updated on every non-breaking release. Pin to `v1.0.0` for a fixed version.

```yaml
uses: vishnuvardhanburri/vardhan-q-core@v1       # latest stable 1.x
uses: vishnuvardhanburri/vardhan-q-core@v1.0.0   # pinned
```

---

## About Vardhan Q-Core

Vardhan Q-Core is the sovereign cryptographic substrate developed by Vardhan Technologies. The full platform includes a 35-crate Rust backend with post-quantum hybrid signing, a Raft-consensus append-only ledger, an eBPF network enforcement layer, a Groth16 ZK proof engine, and a 24-check independent trust boundary — serving Tier-1 banks, digital asset custodians, prime clearing houses, and regulated fintech operators.

Stage 1 Assessment: GBP 21,001 fixed fee.
Enterprise Retainer: GBP 1.2M ARR.

---

## Contact

Burri Vishnu Vardhan — Founder, Vardhan Technologies

- Web: https://www.vishnuvardhanburri.in
- Mail: hello@vishnulabs.com
- GitHub: https://github.com/vishnuvardhanburri

---

## License

MIT License. Copyright Vardhan Technologies. See [LICENSE](LICENSE) for terms.

The cryptographic rules engine, AER-KEP-Q specification, and Vardhan Q-Core platform architecture are proprietary to Vardhan Technologies. All rights reserved.
