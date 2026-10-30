import { createHash } from "node:crypto";
export default function offlineBuild() {
  return {
    name: "html-lab-offline-bundle",
    generateBundle(_, bundle) {
      const assets = [
        "./index.html",
        "./small.svg",
        "./wide.svg",
        "./tone.wav",
        "./flower.mp4",
        "./captions.vtt",
        ...Object.keys(bundle)
          .filter((n) => /\.(js|css)$/.test(n))
          .map((n) => "./" + n),
      ];
      const version = createHash("sha256")
        .update(JSON.stringify(assets))
        .digest("hex")
        .slice(0, 12);
      this.emitFile({
        type: "asset",
        fileName: "offline-manifest.json",
        source: JSON.stringify({ version, assets }),
      });
      this.emitFile({
        type: "asset",
        fileName: "offline-worker.js",
        source: `const PREFIX='html-lab-offline:'+self.registration.scope+':';const CACHE=PREFIX+${JSON.stringify(version)};const ASSETS=${JSON.stringify(assets)};self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}return response}).catch(()=>caches.match(new URL('./index.html',self.registration.scope))));return}event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(event.request);if(cached)return cached;const response=await fetch(event.request);if(response.ok&&/\.(js|css|svg|wav|mp4|vtt)$/.test(url.pathname))cache.put(event.request,response.clone());return response}))});`,
      });
    },
  };
}
