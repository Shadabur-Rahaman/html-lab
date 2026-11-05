import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import offlineBuild from "./scripts/offline-build.mjs";
import pdfAssets from './scripts/pdf-assets.mjs';
export default defineConfig({
  base: "./",
  plugins: [react(), pdfAssets(), ...(process.env.VITE_PRIVATE_ACCESS==='true'?[]:[offlineBuild()])],
  build: { outDir: "dist" },
});
