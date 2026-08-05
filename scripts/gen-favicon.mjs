// Generate favicon + Apple touch icons from the E-Tech logo.
// One-shot script: `node scripts/gen-favicon.mjs`
//
// Notes:
// - Next.js's app/icon.png convention beats app/favicon.ico for modern browsers,
//   so we write a 32x32 PNG at src/app/icon.png (Next auto-serves it) and a
//   180x180 apple-icon.png. We also drop a favicon.ico into /public for legacy
//   browsers that ignore the app-router convention.
// - Source logo has a white background and dark content — perfect for a favicon.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("public/images/etech-logo.png");
const APP_DIR = path.resolve("src/app");
const PUBLIC_DIR = path.resolve("public");

await mkdir(APP_DIR, { recursive: true });

// The logo is 1561×1008 (wider than tall). Crop to a centered square first so
// the favicon isn't stretched. Then resize to each target size.
const meta = await sharp(SRC).metadata();
const size = Math.min(meta.width, meta.height);
const left = Math.round((meta.width - size) / 2);
const top = Math.round((meta.height - size) / 2);

const squareBuffer = await sharp(SRC)
  .extract({ left, top, width: size, height: size })
  .toBuffer();

const write = async (out, dim) => {
  await sharp(squareBuffer)
    .resize(dim, dim, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(out);
  console.log(`  wrote ${path.relative(process.cwd(), out)} (${dim}×${dim})`);
};

await write(path.join(APP_DIR, "icon.png"), 32);
await write(path.join(APP_DIR, "apple-icon.png"), 180);
// Legacy .ico — modern browsers ignore it but some crawlers still request it.
await write(path.join(PUBLIC_DIR, "favicon.ico"), 32);

console.log("\nDone.");
