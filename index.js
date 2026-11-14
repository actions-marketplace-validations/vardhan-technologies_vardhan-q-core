import { CryptoScanner } from './src/scanner.js';
import { ActionReporter } from './src/reporter.js';

async function main() {
  console.log('🛡️ Initializing Vardhan Post-Quantum & DORA Cryptographic Security Gate...');

  const options = {
    path: process.env.INPUT_PATH || '.',
    failOnVulnerable: process.env.INPUT_FAIL_ON_VULNERABLE || 'false',
    minPqcScore: process.env.INPUT_MIN_PQC_SCORE || '0',
    ignorePaths: process.env.INPUT_IGNORE_PATHS || 'node_modules,dist,build,target,.git,coverage,vendor'
  };

  const scanner = new CryptoScanner(options);
  const result = scanner.run();

  const markdownSummary = ActionReporter.formatStepSummary(result);
  console.log('\n' + markdownSummary);

  ActionReporter.emitAnnotations(result);
  ActionReporter.writeOutputs(result);
  ActionReporter.writeSummaryFile(markdownSummary);

  console.log(`\n✅ Scan complete in ${result.summary.scanDurationMs}ms.`);
  console.log(`PQC Readiness Score: ${result.summary.pqcScore}% | Classical: ${result.summary.classicalCount} | PQC: ${result.summary.pqcCount}`);

  if (result.summary.hasFailed) {
    console.error('❌ Gate check failed: Codebase contains critical classical cryptographic vulnerabilities or fell below the minimum PQC score threshold.');
    process.exit(1);
  } else {
    console.log('✨ Gate check passed successfully.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal scanner error:', err);
  process.exit(1);
});
