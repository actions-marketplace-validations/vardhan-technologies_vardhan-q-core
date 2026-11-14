import fs from 'node:fs';

export class ActionReporter {
  static formatStepSummary(result) {
    const { summary, findings } = result;

    const scoreBadge = summary.pqcScore >= 80 
      ? `🟢 **${summary.pqcScore}% (Resilient)**`
      : summary.pqcScore >= 50
      ? `🟡 **${summary.pqcScore}% (Transitioning)**`
      : `🔴 **${summary.pqcScore}% (Critical Exposure)**`;

    const fipsBadge = summary.fips204Compliant ? '✅ Compliant' : '⚠️ Non-Compliant';
    const doraBadge = summary.doraCompliant ? '✅ Resilient' : '⚠️ Gaps Detected';

    let markdown = `## 🛡️ Vardhan Post-Quantum & DORA Cryptographic Audit Report\n\n`;
    markdown += `> Automated security gate by [Vardhan Labs](https://vishnuvardhanburri.in) — auditing NIST FIPS 203/204 & DORA compliance.\n\n`;

    markdown += `### Executive Summary\n\n`;
    markdown += `| Assessment Dimension | Result | Status |\n`;
    markdown += `| :--- | :--- | :--- |\n`;
    markdown += `| **Post-Quantum Readiness Score** | ${scoreBadge} | Harvest-Now-Decrypt-Later (HNDL) Risk |\n`;
    markdown += `| **NIST FIPS 204 (ML-DSA)** | ${fipsBadge} | Lattice Digital Signatures |\n`;
    markdown += `| **DORA Article 9 Compliance** | ${doraBadge} | Cryptographic Agility & Key Hygiene |\n`;
    markdown += `| **Classical Deprecated Primitives** | \`${summary.classicalCount}\` instances | RSA / Unhybridized ECC |\n`;
    markdown += `| **Post-Quantum Implementations** | \`${summary.pqcCount}\` instances | ML-KEM / ML-DSA / Hybrid |\n`;
    markdown += `| **Scanned Files** | \`${summary.scannedFilesCount}\` files (${summary.scanDurationMs}ms) | Comprehensive AST scan |\n\n`;

    if (summary.classicalCount > 0) {
      markdown += `### ⚠️ Deprecated Classical Primitives Detected (Quantum Shor Vulnerable)\n\n`;
      markdown += `| File & Line | Primitive / Finding | Severity | NIST Migration Recommendation |\n`;
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
      markdown += `### 🛑 DORA Article 9 Cryptographic Gaps\n\n`;
      for (const d of findings.dora) {
        markdown += `- 🔴 **${d.ruleName}** at \`${d.file}:${d.line}\`: ${d.description}\n`;
      }
      markdown += `\n`;
    }

    if (findings.pqc.length > 0) {
      markdown += `### 🛡️ Verified Post-Quantum Safe Primitives\n\n`;
      for (const p of findings.pqc.slice(0, 5)) {
        markdown += `- 🟢 **${p.ruleName}** at \`${p.file}:${p.line}\` (${p.description})\n`;
      }
      markdown += `\n`;
    }

    markdown += `---\n\n`;
    markdown += `### 🏛️ Commercial Remediation & Architecture\n`;
    markdown += `Need institutional post-quantum migration, dual-signing infrastructure, or DORA regulatory sign-off?\n\n`;
    markdown += `- **Stage 1 Assessment (£21,001):** 48-hour formal cryptographic inventory, HNDL risk model, and hybrid architecture blueprint.\n`;
    markdown += `- **Enterprise Retainer (£1.2M ARR):** Production ML-DSA-87 / Ed25519 hybrid dual-signing rails for tier-1 banks, custodians, and fintechs.\n`;
    markdown += `- **Book Assessment:** [Contact Vishnu Vardhan Burri](https://vishnuvardhanburri.in) | [hello@vishnulabs.com](mailto:hello@vishnulabs.com)\n`;

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
