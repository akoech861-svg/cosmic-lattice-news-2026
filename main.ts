// Cosmic Lattice - 17 November 2026 World News Infographic Entry
// Node.js 22 standard-library-only implementation with integrity check and validation

import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputDir, { recursive: true });

const srcUrl = new URL('./entry.png', import.meta.url);
const destPath = join(outputDir, 'entry.png');

copyFileSync(srcUrl, destPath);

// Validate copy integrity by comparing file sizes and logging SHA-256 checksum
const srcStats = statSync(srcUrl);
const destStats = statSync(destPath);

if (srcStats.size !== destStats.size) {
  throw new Error(`Copy verification failed: source size (${srcStats.size}) does not match destination size (${destStats.size})`);
}

const fileBuffer = readFileSync(destPath);
const checksum = createHash('sha256').update(fileBuffer).digest('hex');

console.log(`Successfully copied entry.png (${destStats.size} bytes). SHA-256: ${checksum}`);
