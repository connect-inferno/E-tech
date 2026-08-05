// One-shot converter: takes the 240 JPG frames in
// public/images/elevator-sequence and writes 120 WebP frames (every other one,
// downscaled to 1280×720, quality 78) into public/images/elevator-sequence-webp.
// Usage:  node scripts/convert-frames.mjs

import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC_DIR = path.resolve("public/images/elevator-sequence");
const OUT_DIR = path.resolve("public/images/elevator-sequence-webp");
const TARGET_WIDTH = 1280;
const QUALITY = 78;
const STEP = 1; // keep every Nth frame; 1 → all 240

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR))
  .filter((f) => f.endsWith(".jpg"))
  .map((f) => ({ f, n: parseInt(f, 10) }))
  .filter((x) => Number.isFinite(x.n))
  .sort((a, b) => a.n - b.n);

if (!files.length) {
  console.error("No .jpg files found in", SRC_DIR);
  process.exit(1);
}

console.log(`Found ${files.length} source frames. Keeping every ${STEP}. Writing to ${OUT_DIR}`);

let outIdx = 0;
let totalIn = 0;
let totalOut = 0;

for (let i = 0; i < files.length; i += STEP) {
  outIdx++;
  const src = path.join(SRC_DIR, files[i].f);
  const dst = path.join(OUT_DIR, `${outIdx}.webp`);
  const srcStat = await stat(src);
  totalIn += srcStat.size;
  await sharp(src)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(dst);
  const dstStat = await stat(dst);
  totalOut += dstStat.size;
  if (outIdx % 20 === 0) {
    process.stdout.write(`  ${outIdx} frames converted…\n`);
  }
}

const mb = (b) => (b / 1024 / 1024).toFixed(2) + " MB";
console.log(`\nDone. ${outIdx} frames written.`);
console.log(`  Source total (frames consumed): ${mb(totalIn)}`);
console.log(`  Output total:                   ${mb(totalOut)}`);
console.log(`  Reduction:                      ${(100 - (totalOut / totalIn) * 100).toFixed(1)}%`);
