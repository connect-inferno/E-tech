// Builds the mobile hero sequence from the existing desktop WebP frames.
//
// Same 240 frames as desktop — only the pixel dimensions shrink. A phone paints
// the canvas at ~780 CSS px wide (390pt viewport × DPR capped at 2), so 1280px
// source frames are ~40% larger than anything the screen can resolve. 720px is
// visually identical on device and cuts both transfer and decoded size to ~1/3.
//
// Decoded cost matters because HeroSequence keeps a sliding window of frames
// live at any moment (see the ImageBitmap window in HeroSequence.tsx):
//
//   720*405*4 = 1.17 MB per frame × 60-frame window ≈ 70 MB peak
//
// versus the old approach of holding all 240 desktop frames decoded at once,
// which was 1280*720*4*240 ≈ 844 MB and got tabs killed on iOS Safari.
//
// Source JPGs are no longer in the repo, so we downscale from the WebP set.
// Usage:  node scripts/gen-mobile-frames.mjs

import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC_DIR = path.resolve("public/images/elevator-sequence-webp");
const OUT_DIR = path.resolve("public/images/elevator-sequence-webp-mobile");
const TARGET_WIDTH = 720;
const QUALITY = 72;

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR))
  .filter((f) => f.endsWith(".webp"))
  .map((f) => ({ f, n: parseInt(f, 10) }))
  .filter((x) => Number.isFinite(x.n))
  .sort((a, b) => a.n - b.n);

if (!files.length) {
  console.error("No .webp files found in", SRC_DIR);
  process.exit(1);
}

console.log(
  `Found ${files.length} source frames. Writing all of them at ${TARGET_WIDTH}px to ${OUT_DIR}`
);

let totalIn = 0;
let totalOut = 0;

for (let i = 0; i < files.length; i++) {
  const src = path.join(SRC_DIR, files[i].f);
  // Keep the 1-based numbering identical to the desktop set so the same
  // FRAME_URL indexing works for both.
  const dst = path.join(OUT_DIR, `${i + 1}.webp`);
  totalIn += (await stat(src)).size;
  await sharp(src)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(dst);
  totalOut += (await stat(dst)).size;
  if ((i + 1) % 40 === 0) process.stdout.write(`  ${i + 1} frames converted…\n`);
}

const mb = (b) => (b / 1024 / 1024).toFixed(2) + " MB";
console.log(`\nDone. ${files.length} frames written.`);
console.log(`  Source total: ${mb(totalIn)}`);
console.log(`  Output total: ${mb(totalOut)}  (held compressed in RAM as Blobs)`);
console.log(
  `  Decoded window cost: ${((TARGET_WIDTH * Math.round(TARGET_WIDTH * 9 / 16) * 4 * 60) / 1048576).toFixed(0)} MB for 60 live frames`
);
