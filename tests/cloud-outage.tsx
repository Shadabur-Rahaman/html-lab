// Development fault injection: only provider calls fail; local learning code is real.
import React from 'react';import{createRoot}from'react-dom/client';import App from '../src/App';import'../src/styles.css';import'../src/v2.css';
const originalFetch=window.fetch.bind(window);
window.fetch=(input,init)=>String(input instanceof Request?input.url:input).includes('.supabase.co')?Promise.reject(new TypeError('Cloud unavailable during deliberate outage check.')):originalFetch(input,init);
if(!location.hash)location.hash='resources';
createRoot(document.getElementById('root')!).render(<App/>);
