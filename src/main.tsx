import React from "react";
import { createRoot } from "react-dom/client";
import {privateAccess} from './access/session';
import PrivateGate from './access/PrivateGate';
const App=React.lazy(()=>import('./App'));
import "./styles.css";
import "./v2.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {privateAccess?<PrivateGate><React.Suspense fallback={<p role="status">Opening HTML LAB…</p>}><App/></React.Suspense></PrivateGate>:<React.Suspense fallback={<p role="status">Opening HTML LAB…</p>}><App/></React.Suspense>}
  </React.StrictMode>,
);
