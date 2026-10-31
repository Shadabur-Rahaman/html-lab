// Original code-generated educational diagrams. Regenerate from the repo root.
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const kind = Buffer.from(type),
    length = Buffer.alloc(4),
    crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([kind, data])));
  return Buffer.concat([length, kind, data, crc]);
}
function chart(width) {
  const height = (width * 9) / 16,
    rows = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const nx = x / width,
        ny = y / height;
      let color = [245, 239, 223, 255];
      if (nx > 0.12 && nx < 0.88 && ny > 0.82 && ny < 0.84)
        color = [44, 62, 68, 255];
      for (const [a, b, top, c] of [
        [0.2, 0.34, 0.5, [228, 145, 91, 255]],
        [0.43, 0.57, 0.28, [69, 128, 127, 255]],
        [0.66, 0.8, 0.4, [109, 137, 91, 255]],
      ])
        if (nx > a && nx < b && ny > top && ny < 0.82) color = c;
      const at = y * (width * 4 + 1) + 1 + x * 4;
      rows.set(color, at);
    }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
const assets = Object.fromEntries(
  [320, 640, 1280].map((width) => [
    `images/product-${width}.png`,
    {
      type: "image",
      mime: "image/png",
      data: "data:image/png;base64," + chart(width).toString("base64"),
    },
  ]),
);
writeFileSync(
  new URL("../src/data/advancedImages.mjs", import.meta.url),
  "// Original generated diagrams; see scripts/advanced-images.mjs.\nexport const advancedImages = " +
    JSON.stringify(assets) +
    ";\n",
);
