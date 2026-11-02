import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import offlineBuild from "./scripts/offline-build.mjs";
import pdfAssets from './scripts/pdf-assets.mjs';
export default defineConfig({
  base: "./",
  plugins: [react(), pdfAssets(), offlineBuild()],
  build: { outDir: "dist" },
});
