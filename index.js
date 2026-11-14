import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CryptoScanner } from './src/scanner.js';
import { ActionReporter } from './src/reporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDiscoveryBinary() {
  const isLinux = process.platform === 'linux';
  const isDarwin = process.platform === 'darwin';
  const arch = process.arch;

  let binaryName = null;
  if (isLinux && arch === 'x64') {
    binaryName = 'qcore-linux-amd64';
  } else if (isDarwin && (arch === 'arm64' || arch === 'x64')) {
    binaryName = 'qcore-darwin-arm64';
  }

  if (binaryName) {
    const fullPath = path.join(__dirname, 'bin', binaryName);
    if (fs.existsSync(fullPath)) {
      try {
        fs.chmodSync(fullPath, 0o755);
        return fullPath;
      } catch (e) {
        console.warn('Could not chmod discovery binary:', e.message);
      }
    }
  }
  return null;
}

function runDiscoveryEngine(binPath, targetPath, options) {
  console.log(`Executing Vardhan Q-Core Industrial Discovery Engine (${path.basename(binPath)})...`);
  
  const reportPath = path.resolve('report.json');
  const cbomPath = path.resolve('cbom.json');
  const sarifPath = path.resolve('results.sarif');

  // 1. JSON Report
  execFileSync(binPath, ['scan', targetPath, '-f', 'json', '-o', reportPath], { stdio: 'inherit' });
  
  // 2. CycloneDX 1.6 CBOM
  try {
    execFileSync(binPath, ['scan', targetPath, '-f', 'cbom', '-o', cbomPath], { stdio: 'inherit' });
  } catch (e) {
    console.warn('CBOM export warning:', e.message);
  }

  // 3. OASIS SARIF 2.1.0
  try {
    execFileSync(binPath, ['scan', targetPath, '-f', 'sarif', '-o', sarifPath], { stdio: 'inherit' });
  } catch (e) {
    console.warn('SARIF export warning:', e.message);
  }

  const rawJson = fs.readFileSync(reportPath, 'utf8');
  const data = JSON.parse(rawJson);
  return { data, reportPath, cbomPath, sarifPath };
}

async function main() {
  console.log('======================================================================');
  console.log(' VARDHAN Q-CORE :: SOVEREIGN POST-QUANTUM CRYPTOGRAPHIC DISCOVERY & CBOM');
  console.log('======================================================================');

  const targetPath = process.env.INPUT_PATH || '.';
  const failOnVulnerable = (process.env.INPUT_FAIL_ON_VULNERABLE || process.env['INPUT_FAIL-ON-VULNERABLE'] || 'false').toLowerCase() === 'true';
  const minPqcScore = parseInt(process.env.INPUT_MIN_PQC_SCORE || process.env['INPUT_MIN-PQC-SCORE'] || '0', 10);

  const binPath = getDiscoveryBinary();

  if (binPath) {
    try {
      const { data, reportPath, cbomPath, sarifPath } = runDiscoveryEngine(binPath, targetPath, { failOnVulnerable, minPqcScore });
      
      const summary = data.summary || {};
      const metadata = data.metadata || {};
      const vuln = summary.quantum_vulnerable_count || 0;
      const ready = summary.quantum_ready_count || 0;
      const weak = summary.weak_classical_count || 0;
      const maxRisk = summary.max_risk_score || 0;
      const avgRisk = summary.average_risk_score || 0;

      // PQC Readiness Score calculation
      const totalEvaluated = vuln + ready;
      const pqcScore = totalEvaluated > 0 ? Math.round((ready / totalEvaluated) * 100) : 100;

      // Format Institutional Step Summary
      let markdown = `## ⚛️ Vardhan Q-Core Sovereign Cryptographic Discovery\n\n`;
      markdown += `> **Vardhan Technologies · BE DIFFERENT**  \n`;
      markdown += `> Industrial Post-Quantum Cryptographic Discovery & CycloneDX 1.6 CBOM Engine.\n\n`;
      
      markdown += `### Institutional Risk & Standards Summary\n\n`;
      markdown += `| Verification Dimension | Assessment Result | Security Architecture |\n`;
      markdown += `| :--- | :--- | :--- |\n`;
      markdown += `| **PQC Readiness Score** | **${pqcScore}%** | Harvest-Now-Decrypt-Later (HNDL) Horizon |\n`;
      markdown += `| **Quantum-Vulnerable Assets** | \`${vuln}\` instances | Classical RSA / Diffie-Hellman / ECC |\n`;
      markdown += `| **Post-Quantum Ready (NIST FIPS 203/204)** | \`${ready}\` instances | ML-KEM-1024 / ML-DSA-87 / Kyber |\n`;
      markdown += `| **Weak / Deprecated Primitives** | \`${weak}\` instances | MD5 / SHA-1 / ECB-Mode |\n`;
      markdown += `| **Max Risk Severity Score** | \`${maxRisk} / 100\` | Calibrated Cryptographic Risk Formula |\n`;
      markdown += `| **Average Exposure Score** | \`${avgRisk} / 100\` | Network Exposure & Data Lifetime Weighted |\n`;
      markdown += `| **Scanned Files** | \`${metadata.files_scanned || 0}\` files (${metadata.duration_ms || 0}ms) | Multi-Language AST Engine (42 Rules) |\n\n`;

      markdown += `### 📦 Standards-Compliant Audit Artifacts Generated\n\n`;
      markdown += `- **CycloneDX 1.6 CBOM:** \`cbom.json\` (Schema-compliant Cryptographic Bill of Materials)\n`;
      markdown += `- **OASIS SARIF 2.1.0:** \`results.sarif\` (Ready for GitHub Code Scanning ingestion)\n`;
      markdown += `- **Cryptographic Report:** \`report.json\` (Full structured inventory)\n\n`;

      if (data.assets && data.assets.length > 0) {
        markdown += `### ⚠️ Top Prioritized Cryptographic Assets\n\n`;
        markdown += `| Algorithm / Primitive | Location | Severity | Risk Score | Status |\n`;
        markdown += `| :--- | :--- | :--- | :--- | :--- |\n`;
        for (const a of data.assets.slice(0, 15)) {
          markdown += `| **${a.algorithm || a.name || 'Unknown'}** | \`${a.location || a.file || 'N/A'}\` | \`${a.severity || 'HIGH'}\` | \`${a.risk_score || a.score || 'N/A'}\` | ${a.quantum_safe ? '✅ PQC-Ready' : '🔴 Vulnerable'} |\n`;
        }
        markdown += `\n`;
      }

      markdown += `---\n\n`;
      markdown += `### 🏛️ Vardhan Technologies Enterprise Pathways\n`;
      markdown += `- **Stage 1 Institutional Assessment (£21,001):** Dedicated 4-week architectural review, DORA Article 9 compliance matrix, and PQC migration blueprint.\n`;
      markdown += `- **Enterprise Q-Core Retainer (£1.2M ARR / £5M-£15M TCV):** Full deployment of Vardhan Q-Core sovereign substrate, hybrid dual-signing, ML-KEM-1024 encapsulation, and Raft HA ledger.\n`;
      markdown += `- **Portal & Settlement Lab:** [https://vardhantech.vercel.app](https://vardhantech.vercel.app) | [hello@vishnulabs.com](mailto:hello@vishnulabs.com)\n`;

      console.log('\n' + markdown);
      ActionReporter.writeSummaryFile(markdown);

      // Write GitHub Actions Outputs
      const outputFile = process.env.GITHUB_OUTPUT;
      if (outputFile) {
        const outputs = [
          ['pqc-score', pqcScore],
          ['pqc_score', pqcScore],
          ['classical-count', vuln + weak],
          ['classical_count', vuln + weak],
          ['quantum-vulnerable-count', vuln],
          ['pqc-count', ready],
          ['pqc_count', ready],
          ['cbom-file', cbomPath],
          ['cbom_file', cbomPath],
          ['sarif-file', sarifPath],
          ['sarif_file', sarifPath],
          ['report-file', reportPath],
          ['report_file', reportPath]
        ];
        for (const [k, v] of outputs) {
          fs.appendFileSync(outputFile, `${k}=${v}\n`, 'utf8');
        }
      }

      console.log(`Scan completed successfully in ${metadata.duration_ms || 0}ms.`);
      console.log(`PQC Readiness: ${pqcScore}% | Vulnerable: ${vuln} | PQC Ready: ${ready} | CBOM: ${cbomPath}`);

      if (failOnVulnerable && vuln > 0) {
        console.error(`\n❌ Gate check failed: Codebase contains ${vuln} quantum-vulnerable cryptographic assets and fail_on_vulnerable is enabled.`);
        process.exit(1);
      }
      if (pqcScore < minPqcScore) {
        console.error(`\n❌ Gate check failed: PQC Readiness score (${pqcScore}%) is below the minimum threshold (${minPqcScore}%).`);
        process.exit(1);
      }

      console.log('✨ Vardhan Q-Core gate check passed.');
      process.exit(0);

    } catch (err) {
      console.warn('Discovery binary error, falling back to JavaScript engine:', err.message);
    }
  }

  // Fallback JavaScript Engine
  console.log('Running fallback JavaScript AST engine...');
  const scanner = new CryptoScanner({
    path: targetPath,
    failOnVulnerable: failOnVulnerable ? 'true' : 'false',
    minPqcScore: String(minPqcScore),
    ignorePaths: process.env.INPUT_IGNORE_PATHS || 'node_modules,dist,build,target,.git,coverage,vendor'
  });

  const result = scanner.run();
  const markdownSummary = ActionReporter.formatStepSummary(result);
  console.log('\n' + markdownSummary);

  ActionReporter.emitAnnotations(result);
  ActionReporter.writeOutputs(result);
  ActionReporter.writeSummaryFile(markdownSummary);

  if (result.summary.hasFailed) {
    console.error('❌ Gate check failed.');
    process.exit(1);
  } else {
    console.log('✨ Gate check passed.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal scanner error:', err);
  process.exit(1);
});
