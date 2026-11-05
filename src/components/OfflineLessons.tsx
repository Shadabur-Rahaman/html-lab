import { useState } from "react";
import {privateAccess} from '../access/session';
export default function OfflineLessons() {
  const [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  if(privateAccess)return <section className="note-card"><h3>Private classroom access</h3><p>Lessons require a current online enrollment check. Exported work and downloaded copies remain on your device.</p></section>;
  async function install() {
    if (!("serviceWorker" in navigator)) {
      setNotice(
        "This browser does not support offline lesson storage. Download revision notes and project ZIPs instead.",
      );
      return;
    }
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.register(
        new URL("./offline-worker.js", location.href),
        { scope: new URL(".", location.href).pathname },
      );
      const worker = registration.installing || registration.waiting;
      if (worker && worker.state !== "activated")
        await new Promise<void>((resolve, reject) => {
          const check = () => {
            if (worker.state === "activated") resolve();
            if (worker.state === "redundant")
              reject(
                Error(
                  "The offline download did not finish. Check your connection and try again.",
                ),
              );
          };
          worker.addEventListener("statechange", check);
          check();
        });
      setNotice(
        "Bundled lessons, toolkit, and sample assets are saved for offline use in this browser. Reopen this same site. External documentation and first-time downloads still need a connection. Browser storage can be cleared or evicted.",
      );
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="note-card">
      <h3>Keep learning offline</h3>
      <p>
        On the published site, explicitly save the app’s bundled lessons and
        sample assets. Your projects remain in separate device-local IndexedDB
        storage. No learner source is uploaded.
      </p>
      {import.meta.env.PROD ? (
        <button
          className="button secondary compact"
          disabled={busy}
          onClick={install}
        >
          {busy
            ? "Saving bundled lessons…"
            : "Save bundled lessons for offline use"}
        </button>
      ) : (
        <p className="muted">
          Offline caching is available in the production build. Downloaded notes
          and exported projects can already be used offline.
        </p>
      )}
      <p role="status">{notice}</p>
    </div>
  );
}
