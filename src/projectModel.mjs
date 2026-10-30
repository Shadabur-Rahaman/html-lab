import { Unzip, UnzipInflate, zipSync, strToU8, strFromU8 } from "fflate";
export const PROJECT_LIMITS = {
  files: 60,
  fileBytes: 2 * 1024 * 1024,
  totalBytes: 8 * 1024 * 1024,
  zipBytes: 8 * 1024 * 1024,
};
const textTypes = {
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  txt: "text/plain",
  md: "text/markdown",
};
const imageTypes = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};
export function safePath(path) {
  if (
    typeof path !== "string" ||
    !path ||
    path.length > 160 ||
    /[^a-zA-Z0-9_ .\/-]/.test(path) ||
    path.startsWith("/") ||
    path.includes("\\") ||
    path
      .split("/")
      .some((p) => !p || p === "." || p === ".." || p.startsWith(".")) ||
    path.split("/").length > 7
  )
    throw Error(
      "Use a relative path such as pages/about.html. Parent traversal, hidden files, and special characters are not supported.",
    );
  return path;
}
export const extension = (path) => path.split(".").at(-1).toLowerCase();
export function fileType(path) {
  safePath(path);
  const ext = extension(path);
  if (textTypes[ext]) return { type: "text", mime: textTypes[ext] };
  if (imageTypes[ext]) return { type: "image", mime: imageTypes[ext] };
  throw Error(
    "Supported files: HTML, CSS, TXT, MD, PNG, JPG, GIF, and WebP. Scripts and SVG imports are not supported.",
  );
}
export function resolvePath(from, reference) {
  if (
    !reference ||
    /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference) ||
    reference.startsWith("/")
  )
    return null;
  let raw = reference.split(/[?#]/)[0];
  try {
    raw = decodeURIComponent(raw);
  } catch {
    return null;
  }
  if (raw.includes("\\")) return null;
  if (!raw) return from;
  const parts = from.split("/").slice(0, -1);
  for (const p of raw.split("/")) {
    if (!p || p === ".") continue;
    if (p === "..") {
      if (!parts.length) return null;
      parts.pop();
    } else parts.push(p);
  }
  try {
    return safePath(parts.join("/"));
  } catch {
    return null;
  }
}
function bytesToData(bytes, mime) {
  let raw = "";
  for (let i = 0; i < bytes.length; i += 4096)
    raw += String.fromCharCode(...bytes.subarray(i, i + 4096));
  return `data:${mime};base64,${btoa(raw)}`;
}
function fileBytes(file) {
  if (file.type === "folder") return new Uint8Array();
  if (file.type === "image") {
    const value = file.data.split(",")[1] || "";
    return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
  }
  return strToU8(file.data);
}
function validImage(bytes, ext) {
  return ext === "png"
    ? bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78
    : ext === "jpg" || ext === "jpeg"
      ? bytes[0] === 255 && bytes[1] === 216
      : ext === "gif"
        ? strFromU8(bytes.subarray(0, 3)) === "GIF"
        : ext === "webp"
          ? strFromU8(bytes.subarray(0, 4)) === "RIFF" &&
            strFromU8(bytes.subarray(8, 12)) === "WEBP"
          : false;
}
export function assetFile(name, bytes) {
  const kind = fileType(name);
  if (kind.type !== "image" || !validImage(bytes, extension(name)))
    throw Error("The image contents do not match a supported image format.");
  if (bytes.length > PROJECT_LIMITS.fileBytes)
    throw Error("Each image must be at most 2 MB.");
  return { ...kind, data: bytesToData(bytes, kind.mime) };
}
export function validateFiles(files) {
  const entries = Object.entries(files);
  if (entries.length > PROJECT_LIMITS.files)
    throw Error("Projects support up to 60 entries.");
  let total = 0;
  for (const [path, file] of entries) {
    safePath(path);
    for (const parent of path
      .split("/")
      .map((_, i, parts) => parts.slice(0, i).join("/"))
      .filter(Boolean))
      if (files[parent] && files[parent].type !== "folder")
        throw Error(`A file cannot also be a folder: ${parent}`);
    if (file.type === "folder") continue;
    if (
      file.type === "text" &&
      (typeof file.data !== "string" || file.data.length > 80000)
    )
      throw Error(`Text files are limited to 80,000 characters: ${path}`);
    const type = fileType(path);
    if (type.type !== file.type)
      throw Error(`Unsupported content type: ${path}`);
    const bytes = fileBytes(file);
    if (bytes.length > PROJECT_LIMITS.fileBytes)
      throw Error(`File exceeds 2 MB: ${path}`);
    if (file.type === "image" && !validImage(bytes, extension(path)))
      throw Error(`Invalid image: ${path}`);
    total += bytes.length;
    if (total > PROJECT_LIMITS.totalBytes)
      throw Error("The uncompressed project exceeds 8 MB.");
  }
  return total;
}
export function exportProject(files) {
  validateFiles(files);
  const out = Object.create(null);
  for (const [path, file] of Object.entries(files))
    out[file.type === "folder" ? path + "/" : path] = fileBytes(file);
  return zipSync(out, { level: 6 });
}
export function importProject(bytes) {
  if (bytes.length > PROJECT_LIMITS.zipBytes)
    throw Error("ZIP imports must be at most 8 MB.");
  const files = Object.create(null);
  let count = 0,
    total = 0;
  const unzip = new Unzip((file) => {
    if (++count > PROJECT_LIMITS.files)
      throw Error("ZIP has more than 60 entries.");
    const folder = file.name.endsWith("/");
    const path = safePath(folder ? file.name.slice(0, -1) : file.name);
    if (Object.hasOwn(files, path))
      throw Error("ZIP contains duplicate file paths.");
    if (file.originalSize > PROJECT_LIMITS.fileBytes)
      throw Error(`Oversized ZIP entry: ${path}`);
    if (folder) {
      files[path] = { type: "folder", data: "" };
      return;
    }
    const kind = fileType(path);
    let size = 0;
    const chunks = [];
    file.ondata = (err, chunk, final) => {
      if (err) throw Error("Could not decompress the ZIP.");
      size += chunk.length;
      total += chunk.length;
      if (
        size > PROJECT_LIMITS.fileBytes ||
        total > PROJECT_LIMITS.totalBytes
      ) {
        file.terminate();
        throw Error("ZIP exceeds decompressed size limits.");
      }
      chunks.push(chunk);
      if (final) {
        const data = new Uint8Array(size);
        let offset = 0;
        for (const c of chunks) {
          data.set(c, offset);
          offset += c.length;
        }
        files[path] =
          kind.type === "image"
            ? assetFile(path, data)
            : { ...kind, data: strFromU8(data) };
      }
    };
    file.start();
  });
  unzip.register(UnzipInflate);
  for (let i = 0; i < bytes.length; i += 1024)
    unzip.push(bytes.subarray(i, i + 1024), i + 1024 >= bytes.length);
  validateFiles(files);
  if (!Object.keys(files).some((p) => /\.html?$/i.test(p)))
    throw Error("The ZIP must contain an HTML page.");
  return files;
}
export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("html-lab-projects-v2", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("projects", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        Error(
          "Project storage is unavailable. Export your work to keep a copy.",
        ),
      );
  });
}
export async function projectStore(action, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      "projects",
      action === "list" ? "readonly" : "readwrite",
    );
    const store = tx.objectStore("projects");
    const req =
      action === "list"
        ? store.getAll()
        : action === "save"
          ? store.put(value)
          : action === "delete"
            ? store.delete(value)
            : store.clear();
    let result;
    req.onsuccess = () => {
      result = req.result;
    };
    tx.oncomplete = () => {
      db.close();
      resolve(result);
    };
    tx.onerror = tx.onabort = () => {
      db.close();
      reject(
        Error(
          "Could not save the project. Storage may be full or blocked. Export a ZIP before leaving.",
        ),
      );
    };
  });
}
