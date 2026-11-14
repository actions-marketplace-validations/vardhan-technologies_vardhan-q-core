import fs from 'node:fs';
import path from 'node:path';
import { CRYPTO_RULES } from './rules.js';

const EXTENSIONS_TO_SCAN = new Set([
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx',
  '.rs', '.go', '.py', '.java', '.c', '.cpp', '.h', '.hpp',
  '.cs', '.sol', '.yaml', '.yml', '.json', '.env', '.pem', '.crt', '.key'
]);

const DEFAULT_IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'target', '.build',
  'coverage', 'vendor', '.next', '.cache', '__pycache__', '.pytest_cache'
]);

export class CryptoScanner {
  constructor(options = {}) {
    this.rootDir = path.resolve(options.path || '.');
    this.ignorePatterns = (options.ignorePaths || '')
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);
    this.failOnVulnerable = options.failOnVulnerable === true || options.failOnVulnerable === 'true';
    this.minPqcScore = parseInt(options.minPqcScore || '0', 10);
  }

  shouldIgnore(filePath) {
    const rel = path.relative(this.rootDir, filePath);
    const parts = rel.split(path.sep);

    for (const part of parts) {
      if (DEFAULT_IGNORED_DIRS.has(part)) return true;
      for (const pattern of this.ignorePatterns) {
        if (part === pattern || rel.includes(pattern)) return true;
      }
    }
    return false;
  }

  isBinary(buffer) {
    const bytes = buffer.slice(0, 1024);
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] === 0) return true;
    }
    return false;
  }

  walkDir(dir, fileList = []) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return fileList;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (this.shouldIgnore(fullPath)) continue;

      if (entry.isDirectory()) {
        this.walkDir(fullPath, fileList);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (EXTENSIONS_TO_SCAN.has(ext) || entry.name.startsWith('.env')) {
          fileList.push(fullPath);
        }
      }
    }
    return fileList;
  }

  scanFile(filePath) {
    let content;
    try {
      const buf = fs.readFileSync(filePath);
      if (this.isBinary(buf)) return [];
      content = buf.toString('utf8');
    } catch {
      return [];
    }

    const relPath = path.relative(this.rootDir, filePath);
    const lines = content.split('\n');
    const findings = [];

    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      const trimmed = lineText.trim();
      // Skip commented-out explanation lines
      if (trimmed.startsWith('//') && trimmed.includes('https://')) return;

      for (const rule of CRYPTO_RULES) {
        if (rule.regex.test(lineText)) {
          findings.push({
            ruleId: rule.id,
            ruleName: rule.name,
            category: rule.category,
            severity: rule.severity,
            shorVulnerable: rule.shorVulnerable,
            fipsCompliant: rule.fipsCompliant,
            file: relPath,
            line: lineNum,
            snippet: lineText.trim().slice(0, 120),
            description: rule.description,
            recommendation: rule.recommendation
          });
        }
      }
    });

    return findings;
  }

  run() {
    const startTime = Date.now();
    const files = this.walkDir(this.rootDir);
    const allFindings = [];

    for (const file of files) {
      const findings = this.scanFile(file);
      if (findings.length > 0) {
        allFindings.push(...findings);
      }
    }

    const classicalFindings = allFindings.filter(f => f.category === 'CLASSICAL_DEPRECATED' || f.category === 'LEGACY_BROKEN');
    const pqcFindings = allFindings.filter(f => f.category === 'POST_QUANTUM_SAFE');
    const doraGaps = allFindings.filter(f => f.category === 'DORA_COMPLIANCE_GAP');

    const classicalCount = classicalFindings.length;
    const pqcCount = pqcFindings.length;
    const doraCount = doraGaps.length;

    // Calculate PQC Readiness Score (0 - 100%)
    let pqcScore = 100;
    if (classicalCount > 0 || pqcCount > 0) {
      const totalCryptoSignals = classicalCount + pqcCount;
      const rawRatio = Math.round((pqcCount / totalCryptoSignals) * 100);
      pqcScore = Math.max(0, Math.min(100, rawRatio));
      if (doraCount > 0) pqcScore = Math.max(0, pqcScore - (doraCount * 15));
    } else {
      pqcScore = 100; // Zero deprecated crypto found
    }

    const fips204Compliant = pqcCount > 0 && classicalCount === 0;
    const doraCompliant = doraCount === 0 && (classicalCount === 0 || pqcScore >= 80);

    const hasFailed = (this.failOnVulnerable && (classicalCount > 0 || doraCount > 0)) ||
                      (pqcScore < this.minPqcScore);

    return {
      summary: {
        scannedFilesCount: files.length,
        totalFindings: allFindings.length,
        classicalCount,
        pqcCount,
        doraCount,
        pqcScore,
        fips204Compliant,
        doraCompliant,
        hasFailed,
        scanDurationMs: Date.now() - startTime
      },
      findings: {
        classical: classicalFindings,
        pqc: pqcFindings,
        dora: doraGaps
      }
    };
  }
}
