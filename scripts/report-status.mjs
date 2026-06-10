// Reads Newman's JSON report and writes a compact status.json that the
// qavant.dev site can fetch to show REAL API-test metrics.
// Same contract as qavant-tests: { passed, total, passRate, runs, lastRun }.
import { readFileSync, writeFileSync } from 'node:fs';

let report;
try {
  report = JSON.parse(readFileSync('newman-report.json', 'utf8'));
} catch {
  console.error('newman-report.json not found — did Newman run with the json reporter?');
  process.exit(0); // never fail the build over a missing report
}

// Newman counts assertions: total and failed.
const stats = report?.run?.stats?.assertions ?? { total: 0, failed: 0 };
const total = stats.total ?? 0;
const failed = stats.failed ?? 0;
const passed = total - failed;
const passRate = total ? Math.round((passed / total) * 1000) / 10 : 0;

// carry forward an incrementing run counter from the previous status.json
let runs = 0;
try { runs = JSON.parse(readFileSync('status.json', 'utf8')).runs || 0; } catch {}

const status = { passed, total, passRate, runs: runs + 1, lastRun: new Date().toISOString() };
writeFileSync('status.json', JSON.stringify(status, null, 2) + '\n');
console.log('status.json:', status);
