import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Auto-copy user generated images from brain folder to public images
try {
  const brainDir = "C:\\Users\\athar\\.gemini\\antigravity-ide\\brain\\75c5da19-1f07-462e-92cd-7ba3956e8f85";
  const publicImagesDir = path.join(process.cwd(), "public", "images");

  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  const mapping = [
    { src: "media__1783499010335.jpg", dest: "mrl.jpg" },
    { src: "media__1783499010355.jpg", dest: "home.jpg" },
    { src: "media__1783499010386.jpg", dest: "escalators.jpg" },
    { src: "media__1783499010404.jpg", dest: "capsule.jpg" },
    { src: "media__1783499010414.jpg", dest: "hospital.jpg" },
    { src: "akash_dokhale_1783501597940.png", dest: "akash.png" },
    { src: "vivek_borkar_1783501612971.png", dest: "vivek.png" }
  ];

  for (const item of mapping) {
    const srcPath = path.join(brainDir, item.src);
    const destPath = path.join(publicImagesDir, item.dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
} catch (err) {
  console.error("Error copying images in next.config.ts:", err);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
