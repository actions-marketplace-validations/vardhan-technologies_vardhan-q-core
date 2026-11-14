# ⚛️ Vardhan Q-Core Sovereign Cryptographic Gate

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Vardhan%20Q--Core%20Gate-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/vardhan-q-core-cryptographic-gate-security-audit)
[![Vardhan Technologies](https://img.shields.io/badge/Vardhan%20Technologies-BE%20DIFFERENT-10b981?style=flat-square)](https://vishnuvardhanburri.in)
[![NIST FIPS 204 Compliant](https://img.shields.io/badge/NIST-FIPS%20204%20(ML--DSA--87)-emerald?style=flat-square)](https://csrc.nist.gov/pubs/fips/204/final)
[![NIST FIPS 203 Compliant](https://img.shields.io/badge/NIST-FIPS%20203%20(ML--KEM--1024)-sky?style=flat-square)](https://csrc.nist.gov/pubs/fips/203/final)
[![AER-KEP-Q Protocol](https://img.shields.io/badge/Vardhan-AER--KEP--Q%20(PCKE)-purple?style=flat-square)](https://vishnuvardhanburri.in)
[![DORA Article 9](https://img.shields.io/badge/DORA-Article%209%20Resilience-purple?style=flat-square)](https://www.eiopa.europa.eu/digital-operational-resilience-act-dora_en)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **Vardhan Technologies · BE DIFFERENT**  
> Continuous Post-Quantum Verification & DORA Chapter II Article 9 Assurance powered by **Vardhan Q-Core**.  
> Audits codebases for deprecated classical primitives (RSA, unhybridized secp256k1/ECDSA, legacy hashes) susceptible to **Harvest-Now-Decrypt-Later (HNDL)** attacks and validates adherence to **Vardhan Q-Core** lattice-based hybrid dual-signing (`hybrid_core`), ML-KEM-1024 key encapsulation (`pq_shield`), and `AER-KEP-Q` exposure-resilient epoch management.

---

## 🏛️ The Vardhan Q-Core Architecture

Vardhan Technologies delivers post-quantum security infrastructure for regulated enterprises, tier-1 banks, and high-consequence digital operations across **7 Industry Planes**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   VARDHAN Q-CORE SOVEREIGN SUBSTRATE                   │
├────────────────────────────────────────────────────────────────────────┤
│  • hybrid_core      Ed25519 + ML-DSA-87 Hybrid Dual-Signing (FIPS 204) │
│  • pq_shield        ML-KEM-1024 Post-Quantum Key Encapsulation (FIPS) │
│  • AER-KEP-Q        Proof-Carrying Key Epoch (PCKE) & Exposure Reissue │
│  • core_crypto      BLAKE3 Payload Integrity & Anti-Tamper Runtime     │
│  • zk_engine        Groth16 Zero-Knowledge Proof Envelopes (Circom)   │
│  • ha_cluster       Raft-Backed Consensus & Append-Only State Ledger   │
└────────────────────────────────────────────────────────────────────────┘
```

This GitHub Action serves as the **CI/CD Trust Boundary Gatekeeper** for development teams transitioning mission-critical repositories into quantum sovereignty.

---

## ⚡ Why Post-Quantum Auditing is Mandatory Now

1. **Harvest-Now-Decrypt-Later (HNDL):** Adversaries are actively capturing and archiving encrypted financial transactions, JWT authorization tokens, and bank settlement payloads today to decrypt them as soon as Cryptographically Relevant Quantum Computers (CRQCs) arrive.
2. **NIST Final Standards (August 2024):** NIST finalized **FIPS 203 (ML-KEM)** and **FIPS 204 (ML-DSA)**. Legacy RSA (<3072 bits) and discrete-log elliptic curves are formally in migration phase-out.
3. **DORA Article 9 Mandate:** The European Union Digital Operational Resilience Act (DORA) mandates continuous cryptographic asset inventory and proven key agility across all financial infrastructure.

---

## 🚀 Quick Start

Add this workflow to your repository in `.github/workflows/crypto-audit.yml`:

```yaml
name: "Vardhan Q-Core Cryptographic Audit"

on:
  pull_request:
    branches: [ "main", "master" ]
  push:
    branches: [ "main", "master" ]

jobs:
  q-core-gate:
    name: "Vardhan Q-Core Gatekeeper"
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Run Vardhan Q-Core Security Gate
        uses: vishnuvardhanb-ctrl/vardhan-quantum-action@v1
        with:
          path: '.'
          fail-on-vulnerable: 'false'  # Set to 'true' to block PRs with classical RSA/ECC
          min-pqc-score: '50'          # Require at least 50% post-quantum readiness
```

---

## 📊 Action Inputs

| Input | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `path` | Root directory to scan for cryptographic primitives | No | `.` |
| `fail-on-vulnerable` | Whether to fail the workflow if deprecated classical crypto (RSA/ECC) or DORA key hygiene gaps are found | No | `'false'` |
| `min-pqc-score` | Minimum Post-Quantum Readiness Score (0-100) required to pass the gate | No | `'0'` |
| `ignore-paths` | Comma-separated paths to ignore during scanning | No | `'node_modules,dist,build,target,.git,coverage,vendor'` |

---

## 📤 Action Outputs

| Output | Description |
| :--- | :--- |
| `pqc-score` | Computed Post-Quantum Readiness Score (`0` - `100%`) |
| `classical-count` | Number of classical deprecated primitives found (RSA, unhybridized ECDSA, legacy hashes) |
| `pqc-count` | Number of verified Post-Quantum implementations found (ML-KEM, ML-DSA, hybrid schemes) |
| `fips204-compliant` | `'true'` if all digital signatures meet NIST FIPS 204 ML-DSA-87 standards |
| `aer-kep-q-compliant` | `'true'` if key establishment implements exposure-resilient epoch lifecycle |
| `dora-compliant` | `'true'` if key agility and cryptographic inventory pass DORA Article 9 checks |
| `report-json` | Full structured JSON audit report |

---

## 🖼️ Pull Request Job Summary Example

When the Action runs, it automatically appends an executive summary to your GitHub Action Job Summary (`$GITHUB_STEP_SUMMARY`) and emits inline PR code review annotations:

```markdown
## ⚛️ Vardhan Q-Core Sovereign Cryptographic Gate
> **Vardhan Technologies · BE DIFFERENT**  
> Continuous Post-Quantum Verification & DORA Article 9 Assurance powered by **Vardhan Q-Core**.

### Institutional Assurance Summary
| Verification Dimension | Assessment Result | Security Architecture |
| :--- | :--- | :--- |
| **Q-Core PQC Readiness Score** | 🟡 **61% (Transitioning)** | Harvest-Now-Decrypt-Later (HNDL) Risk |
| **NIST FIPS 204 (ML-DSA-87)** | ⚠️ Non-Compliant | Vardhan `hybrid_core` Dual-Signing |
| **AER-KEP-Q Key Lifecycle** | ✅ Active (Epoch-Resilient) | Asynchronous Exposure-Resilient Quarantine |
| **DORA Article 9 Compliance** | ⚠️ Gaps Detected | Cryptographic Agility & Key Hygiene |
| **Classical Deprecated Primitives** | `4` instances | Classical RSA / Unhybridized ECC |
| **Post-Quantum Implementations** | `8` instances | ML-KEM-1024 / ML-DSA-87 / BLAKE3 |
```

---

## 🏛️ Enterprise Architecture & Institutional Advisory

Need assistance migrating core banking systems, digital asset custody rails, or institutional MPC vaults to Vardhan Q-Core?

* **Stage 1 Institutional Cryptographic Assessment (£21,001):**
  * 48-hour automated & expert cryptographic inventory.
  * Formal HNDL exposure model and cryptographic dependency map.
  * Zero-latency hybrid architecture specification (Ed25519 + ML-DSA-87 / X25519 + ML-KEM-1024).
* **Enterprise Production Retainer (£1.2M ARR / £5M–£15M TCV):**
  * Turnkey production deployment of the Vardhan Q-Core platform.
  * Raft-backed HA epoch key rotation (`AER-KEP-Q`) and DORA regulatory compliance guarantees.

**Contact:** [Burri Vishnu Vardhan](https://vishnuvardhanburri.in) | [hello@vishnulabs.com](mailto:hello@vishnulabs.com)

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
