# 🛡️ Vardhan Post-Quantum & DORA Cryptographic Security Gate

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Vardhan%20PQC%20Gate-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/vardhan-post-quantum-dora-cryptographic-gate)
[![NIST FIPS 204 Compliant](https://img.shields.io/badge/NIST-FIPS%20204%20(ML--DSA)-emerald?style=flat-square)](https://csrc.nist.gov/pubs/fips/204/final)
[![NIST FIPS 203 Compliant](https://img.shields.io/badge/NIST-FIPS%20203%20(ML--KEM)-sky?style=flat-square)](https://csrc.nist.gov/pubs/fips/203/final)
[![DORA Article 9](https://img.shields.io/badge/DORA-Article%209%20Resilience-purple?style=flat-square)](https://www.eiopa.europa.eu/digital-operational-resilience-act-dora_en)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **Continuous Automated Cryptographic Inventory & Quantum-Resilience Audit for CI/CD.**  
> Detects deprecated classical primitives (RSA, unhybridized ECDSA, legacy ciphers) susceptible to **Harvest-Now-Decrypt-Later (HNDL)** attacks and validates adherence to **NIST FIPS 203/204** lattice-based cryptography and **EU DORA Chapter II Article 9** resilience mandates.

---

## ⚡ Why Post-Quantum Cryptography Matters Now

1. **Harvest-Now-Decrypt-Later (HNDL):** Adversaries are actively intercepting and storing encrypted enterprise traffic, financial ledger signatures, and banking authorizations today to decrypt them as soon as Cryptographically Relevant Quantum Computers (CRQCs) emerge.
2. **NIST Standardization:** In August 2024, NIST released final standards for **FIPS 203 (ML-KEM)** and **FIPS 204 (ML-DSA)**, requiring institutions to transition away from classical RSA and discrete-log ECC.
3. **DORA Article 9 Enforcement:** The European Digital Operational Resilience Act (DORA) mandates financial entities to maintain an active inventory of cryptographic assets and ensure continuous cryptographic agility.

---

## 🚀 Quick Start

Add this workflow to your repository in `.github/workflows/crypto-audit.yml`:

```yaml
name: "Cryptographic Security Audit"

on:
  pull_request:
    branches: [ "main", "master" ]
  push:
    branches: [ "main", "master" ]

jobs:
  pqc-audit:
    name: "Vardhan PQC & DORA Gate"
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Run Vardhan Post-Quantum Security Gate
        uses: vishnuvardhanb-ctrl/vardhan-quantum-action@v1
        with:
          path: '.'
          fail-on-vulnerable: 'false'  # Set to 'true' to block PRs with classical crypto
          min-pqc-score: '50'          # Require at least 50% post-quantum readiness
```

---

## 📊 Action Inputs

| Input | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `path` | Root directory to scan for cryptographic primitives | No | `.` |
| `fail-on-vulnerable` | Whether to fail the workflow if deprecated classical crypto (RSA/ECC) is found | No | `'false'` |
| `min-pqc-score` | Minimum Post-Quantum Readiness Score (0-100) required to pass the gate | No | `'0'` |
| `ignore-paths` | Comma-separated paths to ignore during scanning | No | `'node_modules,dist,build,target,.git,coverage,vendor'` |

---

## 📤 Action Outputs

| Output | Description |
| :--- | :--- |
| `pqc-score` | Computed Post-Quantum Readiness Score (`0` - `100%`) |
| `classical-count` | Number of classical deprecated primitives found (RSA, unhybridized ECDSA, legacy hashes) |
| `pqc-count` | Number of verified Post-Quantum implementations found (ML-KEM, ML-DSA, hybrid schemes) |
| `fips204-compliant` | `'true'` if all digital signatures meet NIST FIPS 204 standards |
| `dora-compliant` | `'true'` if key agility and cryptographic inventory pass DORA Article 9 checks |
| `report-json` | Full structured JSON audit report |

---

## 🖼️ Pull Request Job Summary Example

When the Action runs, it automatically appends an executive summary to your GitHub Action Job Summary (`$GITHUB_STEP_SUMMARY`) and emits PR annotations:

```markdown
## 🛡️ Vardhan Post-Quantum & DORA Cryptographic Audit Report

### Executive Summary
| Assessment Dimension | Result | Status |
| :--- | :--- | :--- |
| **Post-Quantum Readiness Score** | 🟡 **38% (Transitioning)** | Harvest-Now-Decrypt-Later (HNDL) Risk |
| **NIST FIPS 204 (ML-DSA)** | ⚠️ Non-Compliant | Lattice Digital Signatures |
| **DORA Article 9 Compliance** | ⚠️ Gaps Detected | Cryptographic Agility & Key Hygiene |
| **Classical Deprecated Primitives** | `4` instances | RSA / Unhybridized ECC |
| **Post-Quantum Implementations** | `2` instances | ML-KEM / ML-DSA / Hybrid |
```

---

## 🏛️ Enterprise Architecture & Institutional Advisory

Need assistance migrating core banking systems, digital asset custody rails, or institutional MPC vaults to post-quantum hybrid dual-signing?

* **Stage 1 Institutional Cryptographic Assessment (£21,001):**
  * 48-hour automated & expert cryptographic inventory.
  * Formal HNDL exposure model and cryptographic dependency map.
  * Zero-latency hybrid architecture specification (Ed25519 + ML-DSA-87 / X25519 + ML-KEM-768).
* **Enterprise Production Retainer (£1.2M ARR):**
  * Turnkey production deployment of the Vardhan Q-Core platform.
  * Raft-backed HA epoch key rotation (`AER-KEP-Q`) and DORA regulatory compliance guarantees.

**Contact:** [Vishnu Vardhan Burri](https://vishnuvardhanburri.in) | [hello@vishnulabs.com](mailto:hello@vishnulabs.com)

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
