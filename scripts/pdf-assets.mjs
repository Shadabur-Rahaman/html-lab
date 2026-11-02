import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
export default function pdfAssets() {
  const files = new Map();
  for (const folder of ["cmaps", "standard_fonts", "wasm"])
    for (const name of readdirSync(
      resolve("node_modules/pdfjs-dist", folder),
    )) {
      if (name === "quickjs-eval.wasm") continue; // No PDF scripting engine in previews.
      files.set(
        `pdf-assets/${folder}/${name}`,
        readFileSync(resolve("node_modules/pdfjs-dist", folder, name)),
      );
    }
  files.set(
    "pdf-assets/LICENSE",
    readFileSync(resolve("node_modules/pdfjs-dist/LICENSE")),
  );
  return {
    name: "local-pdf-assets",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = new URL(req.url || "/", "http://localhost").pathname.slice(
          1,
        );
        const body = files.get(path);
        if (!body) return next();
        res.setHeader(
          "Content-Type",
          path.endsWith(".wasm")
            ? "application/wasm"
            : path.endsWith(".js")
              ? "text/javascript"
              : "application/octet-stream",
        );
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.end(body);
      });
    },
    generateBundle() {
      for (const [fileName, source] of files)
        this.emitFile({ type: "asset", fileName, source });
    },
  };
}
