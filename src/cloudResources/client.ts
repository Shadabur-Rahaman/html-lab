import { createClient } from "@supabase/supabase-js";
import {privateAccess,privateApi,uploadHeaders} from '../access/session';
import {protectedJson} from '../access/http.mjs';
import { Upload } from "tus-js-client";
import { publicConfig } from "./config.mjs";
import {
  fileInfo,
  sha256,
  validateBytes,
} from "../../supabase/functions/_shared/validation.mjs";

export const config = publicConfig(
  (import.meta as ImportMeta & { env: Record<string, string> }).env,
);
export const cloud = config && !privateAccess
  ? createClient(config.url, config.key, {
      auth: {
        storageKey: "html-lab-resource-auth-v5",
        persistSession: true,
        autoRefreshToken: true,
        flowType: "pkce",
        detectSessionInUrl: true,
      },
    })
  : null;
export const resourcesAvailable=privateAccess||!!cloud;
export type Category = {
  id: string;
  name: string;
  display_order: number;
  archived: boolean;
};
export type Resource = {
  id: string;
  title: string;
  description: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  category_id: string | null;
  chapter_id: number | null;
  lesson_id: string | null;
  learning_scope: string;
  project_id: string | null;
  tags: string[];
  status: "draft" | "published" | "archived" | "deleted";
  display_order: number;
  created_at: string;
  updated_at: string;
  version: number;
  published_at?: string | null;
  uploaded_by?: string;
};
export type Metadata = Pick<
  Resource,
  | "title"
  | "description"
  | "category_id"
  | "chapter_id"
  | "lesson_id"
  | "learning_scope"
  | "project_id"
  | "tags"
  | "status"
  | "display_order"
>;
export type Profile = { id: string; email: string; role: "admin" | "teacher" };
export async function api<T = unknown>(
  action: string,
  body: Record<string, unknown> = {},
): Promise<T> {
  if(privateAccess){const value=await privateApi<T>('/api/resources',{action,...body});if(['finalize','edit','purge','category','settings'].includes(action))clearResourceCache();return value;}
  if (!cloud || !config) throw Error("Connect a Supabase project first.");
  const {
    data: { session },
    error,
  } = await cloud.auth.getSession();
  if (error) throw Error("Your session could not be restored. Sign in again.");
  const result = await fetch(config.url + "/functions/v1/html-resource-api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.key,
      ...(session ? { Authorization: "Bearer " + session.access_token } : {}),
    },
    body: JSON.stringify({ action, ...body }),
    signal: AbortSignal.timeout(60000),
  });
  const value = await result
    .json()
    .catch(() => ({ error: "Resource service unavailable. Please retry." }));
  if (!result.ok)
    throw Error(value.error || "The request failed. Please retry.");
  if(['finalize','edit','purge','category','settings'].includes(action)) {
    clearResourceCache();
    if(typeof window!=='undefined') {
      window.dispatchEvent(new Event('html-lab-resources-changed'));
      if(typeof BroadcastChannel!=='undefined'){const channel=new BroadcastChannel('html-lab-resource-updates');channel.postMessage('refresh');channel.close();}
    }
  }
  return value as T;
}
async function fetchCatalogs() {
  if(privateAccess)return api<{categories:Category[];max:number}>('catalogs');
  if (!cloud) throw Error("Connect a Supabase project first.");
  const [categories, settings] = await Promise.all([
    cloud.from("html_resource_categories").select("*").order("display_order"),
    cloud.from("html_resource_settings").select("max_file_size").single(),
  ]);
  if (categories.error || settings.error)
    throw Error(
      "Could not load library settings. Check the connection and database setup.",
    );
  return {
    categories: categories.data as Category[],
    max: settings.data.max_file_size as number,
  };
}
async function fetchPublished() {
  if(privateAccess){const all:Resource[]=[];for(let page=0;;page++){const rows=await api<Resource[]>('published',{page});all.push(...rows);if(rows.length<500)return all;}}
  if (!cloud) return [];
  const rows: Resource[] = [];
  for (let start = 0; ; start += 500) {
    const result = await cloud
      .from("html_published_resources")
      .select("*")
      .order("display_order")
      .order("created_at", { ascending: false })
      .order("id")
      .range(start, start + 499)
      .abortSignal(AbortSignal.timeout(20000));
    if (result.error)
      throw Error(
        "Study materials could not be loaded. Your lessons still work. Retry when your connection is available.",
      );
    rows.push(...(result.data as Resource[]));
    if (result.data.length < 500) return rows;
  }
}
let publicCache: {at:number;promise:Promise<Resource[]>} | null = null;
let catalogCache: {at:number;promise:ReturnType<typeof fetchCatalogs>} | null = null;
export function clearResourceCache(){publicCache=null;catalogCache=null;}
export function catalogs(){if(!catalogCache||Date.now()-catalogCache.at>30000)catalogCache={at:Date.now(),promise:fetchCatalogs().catch(e=>{catalogCache=null;throw e;})};return catalogCache.promise;}
export function published(){if(!publicCache||Date.now()-publicCache.at>30000)publicCache={at:Date.now(),promise:fetchPublished().catch(e=>{publicCache=null;throw e;})};return publicCache.promise;}
export async function managed() {
  const all: Resource[] = [];
  for (let page = 0; ; page++) {
    const rows = await api<Resource[]>("list", { page });
    all.push(...rows);
    if (rows.length < 100) break;
  }
  return all;
}
export function blank(): Metadata {
  return {
    title: "",
    description: "",
    category_id: null,
    chapter_id: null,
    lesson_id: null,
    learning_scope: 'general',
    project_id: null,
    tags: [],
    status: "draft",
    display_order: 0,
  };
}
export function editData(resource: Resource): Metadata {
  return {
    title: resource.title,
    description: resource.description,
    category_id: resource.category_id,
    chapter_id: resource.chapter_id,
    lesson_id: resource.lesson_id,
    learning_scope: resource.learning_scope || 'general',
    project_id: resource.project_id || null,
    tags: resource.tags,
    status: resource.status,
    display_order: resource.display_order,
  };
}
export const size = (n: number) =>
  n < 1024
    ? n + " B"
    : n < 1024 * 1024
      ? (n / 1024).toFixed(1) + " KB"
      : (n / 1024 / 1024).toFixed(1) + " MB";
export const extension = (r: Resource) =>
  r.original_filename?.split(".").at(-1)?.toLowerCase() || "";
export const previewable = (r: Resource) =>
  ["pdf", "jpg", "jpeg", "png", "gif", "webp", "txt", "csv", "md"].includes(
    extension(r),
  );
export async function link(resource: Resource, preview = false) {
  const { url } = await api<{ url: string }>("link", {
    id: resource.id,
    preview,
  });
  if(privateAccess){const parsed=new URL(url,location.origin);if(parsed.origin!==location.origin||!/^\/api\/files\/[a-f0-9-]{36}$/.test(parsed.pathname))throw Error('Unexpected file endpoint.');return parsed.href;}
  const parsed = new URL(url);
  const project = new URL(config!.url);
  if (
    parsed.origin !== project.origin &&
    parsed.hostname !==
      project.hostname.replace(".supabase.co", ".storage.supabase.co")
  )
    throw Error("Unexpected file host.");
  if (parsed.protocol !== project.protocol)
    throw Error("Unexpected file protocol.");
  return parsed.href;
}
export async function download(resource: Resource) {
  const response = await fetch(await link(resource), {cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(120000)});
  if(!response.ok) throw Error('Download failed or the link expired. Retry for a fresh authorized link.');
  const bytes = await response.blob();
  if(bytes.size!==resource.file_size) throw Error('The downloaded file is incomplete. Retry the download.');
  const url = URL.createObjectURL(bytes);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = resource.original_filename;
  anchor.rel = "noopener";
  anchor.click();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
export type UploadJob = {
  file: File;
  metadata: Metadata;
  requestId: string;
  resource?: Resource;
  uploadId?: string;
};
export function uploadJob(
  job: UploadJob,
  max: number,
  progress: (phase: string, percent: number) => void,
) {
  let privateTransfer:XMLHttpRequest|undefined;
  let transfer: Upload | undefined,
    cancelled = false,
    reservation: string | undefined = job.uploadId;
  let rejectTransfer: ((reason: Error) => void) | undefined;
  const done = (async () => {
    if ((!cloud || !config)&&!privateAccess) throw Error("Connect Supabase first.");
    progress("Checking file", 0);
    const info = fileInfo(job.file.name, job.file.size, job.file.type, max);
    const bytes = new Uint8Array(await job.file.arrayBuffer());
    validateBytes(bytes, info.ext);
    const digest = await sha256(bytes);
    if (cancelled) throw Error("Upload cancelled.");
    const reserved = await api<{
      id: string;
      storage_path: string;
      state: string;
      object_exists: boolean;
    }>("prepare", {
      request_id: job.requestId,
      resource_id: job.resource?.id,
      version: job.resource?.version,
      original_filename: info.name,
      file_size: info.size,
      mime_type: info.mime,
      sha256: digest,
      metadata: job.metadata,
    });
    reservation = job.uploadId = reserved.id;
    if (cancelled) {
      await api("cancel", { upload_id: reservation });
      throw Error("Upload cancelled.");
    }
    if (reserved.state !== "ready" && !reserved.object_exists) {
      if(privateAccess){
        await new Promise<void>((resolve,reject)=>{const xhr=privateTransfer=new XMLHttpRequest(),endpoint='/api/uploads/'+reserved.id;xhr.open('POST',endpoint);for(const [key,value]of Object.entries(uploadHeaders()))xhr.setRequestHeader(key,value);xhr.upload.onprogress=e=>{if(e.lengthComputable)progress('Uploading',Math.round(e.loaded/e.total*100));};xhr.onerror=()=>reject(Error('Upload interrupted. Retry after checking your connection.'));xhr.onabort=()=>reject(Error('Upload cancelled.'));xhr.timeout=120000;xhr.ontimeout=()=>reject(Error('Upload timed out. Retry to verify the stored object.'));xhr.onload=()=>{if(xhr.responseURL!==new URL(endpoint,location.origin).href){window.dispatchEvent(new Event('htmllab-access-check'));reject(Error('Sign in again before retrying the upload.'));return;}void protectedJson(new Response(xhr.responseText,{status:xhr.status,headers:{'Content-Type':xhr.getResponseHeader('content-type')||''}}),()=>window.dispatchEvent(new Event('htmllab-access-check'))).then(()=>resolve(),reject);};xhr.send(job.file);});
      }else{
      const origin = new URL(config!.url);
      if (origin.hostname.endsWith(".supabase.co"))
        origin.hostname = origin.hostname.replace(
          ".supabase.co",
          ".storage.supabase.co",
        );
      await new Promise<void>((resolve, reject) => {
        rejectTransfer = reject;
        transfer = new Upload(job.file, {
          endpoint: origin.origin + "/storage/v1/upload/resumable",
          retryDelays: [0, 1000, 3000, 5000],
          chunkSize: 6 * 1024 * 1024,
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: "html-lab-resources",
            objectName: reserved.storage_path,
            contentType: info.mime,
            cacheControl: "60",
          },
          headers: { apikey: config!.key, "x-upsert": "false" },
          onBeforeRequest: async (request) => {
            const {
              data: { session },
            } = await cloud!.auth.getSession();
            if (!session) throw Error("Sign in again before uploading.");
            request.setHeader(
              "Authorization",
              "Bearer " + session.access_token,
            );
          },
          onProgress: (sent, total) =>
            progress("Uploading", Math.round((sent / total) * 100)),
          onError: () =>
            reject(
              Error(
                "Upload interrupted. Retry to resume, or cancel. Check your session, network and storage quota.",
              ),
            ),
          onSuccess: () => resolve(),
          fingerprint: async () => `html-lab-resources:${reserved.id}:${digest}`,
        });
        void transfer
          .findPreviousUploads()
          .then((previous) => {
            if (cancelled) return;
            if (previous[0]) transfer!.resumeFromPreviousUpload(previous[0]);
            transfer!.start();
          })
          .catch(reject);
      });
      }
    }
    if (cancelled) throw Error("Upload cancelled.");
    progress("Verifying and saving", 100);
    await api("finalize", { upload_id: reserved.id });
    progress("Saved to cloud", 100);
  })();
  return {
    done,
    cancel: async () => {
      cancelled = true;
      privateTransfer?.abort();
      await transfer?.abort();
      rejectTransfer?.(Error("Upload cancelled."));
      if (reservation) await api("cancel", { upload_id: reservation });
    },
  };
}
