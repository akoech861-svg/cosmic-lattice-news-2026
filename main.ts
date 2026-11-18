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

// Validate PNG signature, IHDR chunk length, chunk type, and dimensions (max 1024x1024, non-zero)
const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
if (fileBuffer.length < 33 || !fileBuffer.subarray(0, 8).equals(pngSignature)) {
  throw new Error('Invalid PNG file: truncated or incorrect PNG signature');
}

const ihdrLength = fileBuffer.readUInt32BE(8);
if (ihdrLength !== 13) {
  throw new Error(`Invalid PNG file: IHDR chunk length must be 13 bytes, found ${ihdrLength}`);
}

const ihdrType = fileBuffer.subarray(12, 16).toString('ascii');
if (ihdrType !== 'IHDR') {
  throw new Error(`Invalid PNG file: expected IHDR chunk type, found '${ihdrType}'`);
}

const width = fileBuffer.readUInt32BE(16);
const height = fileBuffer.readUInt32BE(20);

if (width === 0 || height === 0 || width > 1024 || height > 1024) {
  throw new Error(`Invalid PNG dimensions: ${width}x${height} is invalid (must be between 1 and 1024 pixels)`);
}

const checksum = createHash('sha256').update(fileBuffer).digest('hex');

console.log(`Successfully copied and validated entry.png (${width}x${height}, ${destStats.size} bytes). SHA-256: ${checksum}`);
