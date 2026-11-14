import fs from 'node:fs';

export class ActionReporter {
  static formatStepSummary(result) {
    const { summary, findings } = result;

    const scoreBadge = summary.pqcScore >= 80 
      ? `🟢 **${summary.pqcScore}% (Quantum Sovereign)**`
      : summary.pqcScore >= 50
      ? `🟡 **${summary.pqcScore}% (Transitioning)**`
      : `🔴 **${summary.pqcScore}% (Critical HNDL Exposure)**`;

    const fipsBadge = summary.fips204Compliant ? '✅ Compliant (ML-DSA-87)' : '⚠️ Non-Compliant';
    const aerBadge = summary.aerKepQCompliant ? '✅ Active (Epoch-Resilient)' : 'ℹ️ Standard / Static';
    const doraBadge = summary.doraCompliant ? '✅ Resilient (DORA Art. 9)' : '⚠️ Gaps Detected';

    let markdown = `## ⚛️ Vardhan Q-Core Sovereign Cryptographic Gate\n\n`;
    markdown += `> **Vardhan Technologies · BE DIFFERENT**  \n`;
    markdown += `> Continuous Post-Quantum Verification & DORA Article 9 Assurance powered by **Vardhan Q-Core**.\n\n`;

    markdown += `### Institutional Assurance Summary\n\n`;
    markdown += `| Verification Dimension | Assessment Result | Security Architecture |\n`;
    markdown += `| :--- | :--- | :--- |\n`;
    markdown += `| **Q-Core PQC Readiness Score** | ${scoreBadge} | Harvest-Now-Decrypt-Later (HNDL) Risk |\n`;
    markdown += `| **NIST FIPS 204 (ML-DSA-87)** | ${fipsBadge} | Vardhan \`hybrid_core\` Dual-Signing |\n`;
    markdown += `| **AER-KEP-Q Key Lifecycle** | ${aerBadge} | Asynchronous Exposure-Resilient Quarantine |\n`;
    markdown += `| **DORA Article 9 Compliance** | ${doraBadge} | Cryptographic Agility & Key Hygiene |\n`;
    markdown += `| **Classical Deprecated Primitives** | \`${summary.classicalCount}\` instances | Classical RSA / Unhybridized ECC |\n`;
    markdown += `| **Post-Quantum Implementations** | \`${summary.pqcCount}\` instances | ML-KEM-1024 / ML-DSA-87 / BLAKE3 |\n`;
    markdown += `| **Scanned Files** | \`${summary.scannedFilesCount}\` files (${summary.scanDurationMs}ms) | AST & Dependency Scanner |\n\n`;

    if (summary.classicalCount > 0) {
      markdown += `### ⚠️ Deprecated Classical Primitives (Quantum Shor Vulnerable)\n\n`;
      markdown += `| File & Line | Primitive / Finding | Severity | Vardhan Q-Core Migration Path |\n`;
      markdown += `| :--- | :--- | :--- | :--- |\n`;
      for (const f of findings.classical.slice(0, 15)) {
        markdown += `| \`${f.file}:${f.line}\` | **${f.ruleName}** | \`${f.severity}\` | ${f.recommendation} |\n`;
      }
      if (findings.classical.length > 15) {
        markdown += `\n*...and ${findings.classical.length - 15} additional classical instances.*\n`;
      }
      markdown += `\n`;
    }

    if (findings.dora.length > 0) {
      markdown += `### 🛑 DORA Chapter II Article 9 Violations\n\n`;
      for (const d of findings.dora) {
        markdown += `- 🔴 **${d.ruleName}** at \`${d.file}:${d.line}\`: ${d.description}\n`;
      }
      markdown += `\n`;
    }

    if (findings.pqc.length > 0) {
      markdown += `### 🛡️ Verified Vardhan Q-Core / PQC Primitives\n\n`;
      for (const p of findings.pqc.slice(0, 6)) {
        markdown += `- 🟢 **${p.ruleName}** at \`${p.file}:${p.line}\` — ${p.description}\n`;
      }
      markdown += `\n`;
    }

    markdown += `---\n\n`;
    markdown += `### 🏛️ Vardhan Technologies Institutional Solutions\n`;
    markdown += `Vardhan Q-Core powers sovereign post-quantum security infrastructure across **7 Industry Planes**:\n`;
    markdown += `*GSIB Tier-1 Banks · Digital Asset Custody · Prime Clearing & HPC · Challenger Rails · Institutional Settlement*\n\n`;
    markdown += `- **Stage 1 Institutional Assessment (£21,001):** 48-hour automated cryptographic inventory, HNDL risk model, and hybrid architecture blueprint.\n`;
    markdown += `- **Enterprise Q-Core Retainer (£1.2M ARR / £5M-£15M TCV):** Full deployment of Vardhan Q-Core (\`hybrid_core\`, \`pq_shield\`, \`AER-KEP-Q\`, Raft-backed HA consensus).\n`;
    markdown += `- **Contact:** [Burri Vishnu Vardhan](https://vishnuvardhanburri.in) | [hello@vishnulabs.com](mailto:hello@vishnulabs.com)\n`;

    return markdown;
  }

  static emitAnnotations(result) {
    const { findings } = result;

    for (const f of findings.classical) {
      console.log(`::warning file=${f.file},line=${f.line},title=${f.ruleName}::${f.description} Recommendation: ${f.recommendation}`);
    }

    for (const d of findings.dora) {
      console.log(`::error file=${d.file},line=${d.line},title=DORA Violation: ${d.ruleName}::${d.description}`);
    }
  }

  static writeOutputs(result) {
    const { summary } = result;
    const outputFile = process.env.GITHUB_OUTPUT;
    if (!outputFile) return;

    const outputs = [
      ['pqc-score', summary.pqcScore],
      ['classical-count', summary.classicalCount],
      ['pqc-count', summary.pqcCount],
      ['fips204-compliant', summary.fips204Compliant ? 'true' : 'false'],
      ['aer-kep-q-compliant', summary.aerKepQCompliant ? 'true' : 'false'],
      ['dora-compliant', summary.doraCompliant ? 'true' : 'false'],
      ['report-json', JSON.stringify(result)]
    ];

    for (const [k, v] of outputs) {
      fs.appendFileSync(outputFile, `${k}=${v}\n`, 'utf8');
    }
  }

  static writeSummaryFile(markdown) {
    const summaryFile = process.env.GITHUB_STEP_SUMMARY;
    if (!summaryFile) return;

    try {
      fs.appendFileSync(summaryFile, markdown, 'utf8');
    } catch (e) {
      console.warn('Could not write GITHUB_STEP_SUMMARY:', e.message);
    }
  }
}
