# Vardhan Q-Core

### Sovereign Post-Quantum Cryptographic Gate & Security Audit

> **The Era of Classical Cryptography Has Ended.**  
> Adversaries are executing **Store Now, Decrypt Later (SNDL)** campaigns against institutional networks today. Every transaction, clearing payload, and cryptographic key secured by RSA or ECC is an unexploded liability waiting for Cryptographically Relevant Quantum Computers (CRQCs).  
>
> **Vardhan Q-Core** is the institutional security gate that continuously audits software supply chains, halts classical cryptographic degradation, and enforces NIST FIPS 203 / 204 post-quantum standards across enterprise repositories before vulnerabilities reach production.

---

## The Executive Problem: Why You Must Upgrade Today

### 1. The Store Now, Decrypt Later (SNDL) Threat Vector
Hostile state actors and advanced persistent threats (APTs) are intercepting and archiving encrypted financial traffic, interbank messaging, and custody operations across public and private transit. When quantum decryption capability scales, historical ciphertext will be decoded retroactively. 

If your data, regulatory records, or customer liabilities have a legal shelf-life exceeding three years, **your institution is currently experiencing a silent compromise.**

### 2. The Regulatory & Legal Mandates Are Active
Post-quantum readiness is no longer an academic research topic. It is an active regulatory compliance mandate:
- **DORA Article 9 (EU):** Mandates continuous cryptographic resilience, cryptographic inventory tracking, and elimination of deprecated cryptographic algorithms.
- **NIST FIPS 203 & 204 (August 2024):** Formally codified ML-KEM (Key Encapsulation) and ML-DSA (Digital Signatures) as federal cryptographic standards, placing RSA, Diffie-Hellman, and ECDSA on formal deprecation runways.
- **BIS Project Leap & Project Agorá:** Recommends immediate operational deployment of quantum-proof financial market infrastructure.
- **White House NSM-10 / OMB M-23-02:** Directs critical infrastructure and financial entities to transition vulnerable systems to quantum-resistant cryptography immediately.

### 3. The Migration Paradox: Complexity vs. Inaction
Traditional cryptographic migrations take 5 to 7 years and carry immense regression risks for legacy core banking ledgers. The **Vardhan Q-Core Architecture** solves this through an adaptive, zero-touch envelope:
- **Zero changes** to legacy core banking code, transaction processing engines, or underlying database schemas.
- **Hybrid dual-signing:** Classical Ed25519 for backwards compatibility paired with NIST FIPS 204 ML-DSA-87 for quantum immunity.
- **AER-KEP-Q (Proof-Carrying Key Epoch):** Continuous exposure detection, automatic quarantine, and non-disruptive key reissue.

This GitHub Action serves as the **first operational line of defense**: a 60-second merge gate that maps, scores, and blocks classical cryptographic liabilities before they enter your deployment pipeline.

---

## What This Gate Audits in Every Pull Request

```
┌────────────────────────────────────────────────────────────────────────┐
│                   VARDHAN Q-CORE AUDIT PIPELINE                        │
└────────────────────────────────────────────────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    [ CLASSICAL DEGRADATION ]        [ POST-QUANTUM POSTURE ]
    - RSA Key Generation (<4096)     - NIST FIPS 203 (ML-KEM-1024)
    - ECDSA / ECDH (secp256k1/P256)  - NIST FIPS 204 (ML-DSA-87)
    - AES-128 / DES / 3DES / RC4     - AER-KEP-Q Key Epoch Lifecycle
    - MD5 / SHA-1 Hash Collision     - Hybrid Signing Envelopes
    - Hardcoded Private Key Tokens   - BLAKE3 Payload Integrity
               │                               │
               └───────────────┬───────────────┘
                               ▼
        [ DORA ARTICLE 9 RESILIENCE REPORT & SCORE ]
        - Automated Step Summary for CISO / CTO review
        - Inline GitHub Annotations on non-compliant lines
        - Cryptographic Health Score (0 - 100)
        - Zero-Tolerance Build Failure (Optional Gate)
```

---

## 30-Second Quickstart

Add this step to your repository's `.github/workflows/security.yml`:

```yaml
name: Cryptographic Audit & DORA Gate

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  pqc-audit:
    name: Vardhan Q-Core Security Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Execute Vardhan Q-Core Gate
        id: qcore
        uses: vishnuvardhanburri/vardhan-q-core@v1
        with:
          path: '.'
          fail_on_vulnerable: 'true'
          min_pqc_score: '60'

      - name: Post-Audit Telemetry
        if: always()
        run: |
          echo "PQC Security Score: ${{ steps.qcore.outputs.pqc_score }}/100"
          echo "Quantum-Vulnerable Instances: ${{ steps.qcore.outputs.classical_count }}"
          echo "DORA Regulatory Gaps: ${{ steps.qcore.outputs.dora_gaps }}"
```

---

## Action Inputs & Configuration

| Parameter | Required | Default | Technical Purpose |
|:---|:---:|:---:|:---|
| `path` | No | `.` | Target directory or repository root to recursively analyze. |
| `fail_on_vulnerable` | No | `true` | **Recommended `true` for regulated environments.** Fails the CI/CD job immediately if unmitigated classical cryptography (RSA, ECC, deprecated hashes) is detected. |
| `min_pqc_score` | No | `0` | Minimum cryptographic score (0–100) required to merge code. Tier-1 banks target `≥75`. |

---

## Action Outputs

| Key | Format | Description |
|:---|:---|:---|
| `pqc_score` | `Integer` | Overall post-quantum maturity rating (0 = Pure Classical Exposure, 100 = Fully Hardened Quantum Sovereign). |
| `classical_count` | `Integer` | Number of detected quantum-vulnerable functions, keys, and algorithms. |
| `pqc_count` | `Integer` | Number of verified NIST FIPS 203/204 and AER-KEP-Q primitives detected. |
| `dora_gaps` | `Integer` | Explicit violations of DORA Article 9 operational resilience guidelines. |
| `report` | `Filepath` | Path to the structured Markdown audit artifact suitable for regulatory evidentiary filing. |

---

## Cryptographic Ruleset & Severity Classification

### Critical Vulnerabilities (Immediate Merge Block)
* **`HARDCODED_KEY`**: Unsealed private key material or PEM certificate blocks discovered in code.
* **`CLASSICAL_ASYMMETRIC`**: RSA key generation, decryption, or signing without post-quantum encapsulation; ECDSA/ECDH curves vulnerable to Shor's algorithm.
* **`BROKEN_HASH`**: MD5, SHA-1, or broken digest functions used in security-critical context.
* **`SUBPAR_SYMMETRIC`**: AES-128 or legacy ciphers failing Grover's algorithm security thresholds.

### Approved Post-Quantum Primitives (Score Elevators)
* **`FIPS_203_ML_KEM`**: Verified implementation of ML-KEM-1024 or ML-KEM-768 key encapsulation.
* **`FIPS_204_ML_DSA`**: Verified implementation of ML-DSA-87, ML-DSA-65, or ML-DSA-44 digital signature algorithms.
* **`AER_KEP_Q_EPOCH`**: Implementation of Proof-Carrying Key Epoch with dynamic quarantine, transaction binding, and replay prevention.
* **`HYBRID_DUAL_SEAL`**: Concurrent dual-signing combining Ed25519 with ML-DSA-87.
* **`IMMUTABLE_DIGEST`**: BLAKE3 or SHA3-512 cryptographic payload integrity.
* **`SECURE_ZEROIZE`**: Explicit memory wiping (`zeroize`) on sensitive key lifecycle drops.

---

## Institutional Audit Report Output

When executed in GitHub Actions, Vardhan Q-Core generates an institutional-grade Step Summary visible to engineering managers, security engineers, and auditors:

```markdown
# 🏛️ Vardhan Q-Core Cryptographic Audit Report

### Operational Status: NON-COMPLIANT (MERGE BLOCKED)
- **Scanned Files:** 1,248
- **Post-Quantum Compliance Score:** 38 / 100 (Threshold: 60)
- **Quantum-Vulnerable Primitives Found:** 14
- **Post-Quantum Primitives Detected:** 6
- **DORA Article 9 Gaps Identified:** 4

---

### Critical Findings Requiring Remediation
| Severity | Location | Component | Recommended Remediation |
|:---|:---|:---|:---|
| **CRITICAL** | `src/auth/jwt.rs:42` | `RSA-2048 Signing` | Migrate to ML-DSA-87 or Hybrid Ed25519+ML-DSA-87 envelope |
| **CRITICAL** | `src/crypto/tls.go:88` | `ECDH secp256k1` | Upgrade to NIST FIPS 203 ML-KEM-1024 key encapsulation |
| **HIGH** | `crates/ledger/state.rs:114`| `SHA-1 Checksum` | Replace with BLAKE3 or SHA3-512 immutable digest |
| **MEDIUM** | `sdk/client.ts:51` | `Ephemeral Key Leak`| Enforce secure zeroize on drop semantics |
```

---

## The Zero-Touch Pathway to Full Quantum Sovereignty

Running this GitHub Action identifies your institutional exposure. Upgrading your core infrastructure resolves it.

The full **Vardhan Q-Core Platform** provides the production-grade sovereign substrate for institutions that cannot afford downtime or multi-year rewrite cycles:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   VARDHAN Q-CORE SOVEREIGN SUBSTRATE                   │
├────────────────────────────────────────────────────────────────────────┤
│  1. 35 Rust Micro-Crates (~47,800 lines of zero-unsafe code)           │
│  2. Dual-Layer Trust Boundary (14 TypeScript + 10 Rust Hardened Checks)│
│  3. Raft Consensus Ledger with Append-Only State Persistence           │
│  4. Zero-Knowledge Compliance Engine (Circom / Groth16 Prover)         │
│  5. Linux eBPF Kernel-Level Packet Filtering for Peer Isolation        │
│  6. Multi-Tenant Enterprise Authority Gate & Idempotency Isolation     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Commercial Engagements & Institutional Advisory

Vardhan Technologies partners directly with Chief Information Security Officers, Chief Technology Officers, and Enterprise Risk Committees across regulated finance, digital custody, and critical infrastructure.

| Engagement Tier | Scope | Deliverables |
|:---|:---|:---|
| **Stage 1: Institutional Cryptographic Assessment** | Fixed-scope 4-week deep technical review | Full architectural audit, DORA Article 9 gap matrix, NIST PQC migration roadmap, executive board briefing. |
| **Stage 2: Pilot Envelope Integration** | 8-week non-invasive sandbox deployment | Integration of Q-Core hybrid dual-signing and ML-KEM encapsulation over existing clearing or custody rails. |
| **Stage 3: Enterprise Platform Retainer** | Full sovereign production substrate | 24/7 dedicated engineering SLA, quarterly cryptographic posture audits, customized eBPF kernel enforcement, full Raft ledger deployment. |

### Direct Executive Inquiries
* **Principal:** Burri Vishnu Vardhan, Founder & Chief Architect
* **Executive Office:** [hello@vishnulabs.com](mailto:hello@vishnulabs.com)
* **Technical Portal:** [vishnuvardhanburri.in](https://www.vishnuvardhanburri.in)
* **Enterprise Registry:** London, United Kingdom

---

## Intellectual Property & Licensing

* **GitHub Action Code:** Open-source under the [MIT License](LICENSE).
* **Vardhan Q-Core™ Substrate, AER-KEP-Q™ Protocol, & Cryptographic Rules Engine:** Proprietary to Vardhan Technologies. All rights reserved.
