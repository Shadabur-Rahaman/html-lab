// Append-only shared Auth redirect setup. Never push the minimal tracked config.
import fs from 'node:fs';
import path from 'node:path';
import {publicSettings,supabase} from './resource-cloud-tools.mjs';
if(!process.argv.includes('--confirm-append-html-redirects'))throw Error('Explicit append-only redirect confirmation required.');
const {ref}=publicSettings(),folder=path.resolve('.deployment/auth-'+Date.now()),file=path.join(folder,'supabase/config.toml');
fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'project_id = "html-lab-resources"\n');
try{
 supabase(['config','pull','--remote='+ref,'--workdir',folder,'--yes']);
 const original=fs.readFileSync(file,'utf8'),match=original.match(/additional_redirect_urls\s*=\s*\[([\s\S]*?)\]/);if(!match)throw Error('No redirect list returned; nothing pushed.');
 const urls=[...match[1].matchAll(/"(?:\\.|[^"\\])*"/g)].map(m=>JSON.parse(m[0]));
 const desired=['https://shadabur-rahaman.github.io/html-lab/?html-resource-recovery=1','http://127.0.0.1:5174/?html-resource-recovery=1','http://127.0.0.1:5178/?html-resource-recovery=1'];
 fs.writeFileSync(file,original.replace(match[0],'additional_redirect_urls = '+JSON.stringify([...new Set([...urls,...desired])])));
 const diff=JSON.parse(supabase(['config','diff','--remote='+ref,'--workdir',folder,'--output-format','json']));
 if(diff.changes.length){if(diff.changes.length!==1||diff.changes[0].path.join('.')!=='auth.additional_redirect_urls'||!diff.changes[0].remote.every(u=>diff.changes[0].local.includes(u)))throw Error('Non-additive Auth change detected; nothing pushed.');supabase(['config','push','--remote='+ref,'--workdir',folder,'--yes']);}
 const verified=JSON.parse(supabase(['config','diff','--remote='+ref,'--workdir',folder,'--output-format','json']));if(verified.changes.length)throw Error('Redirect verification did not match.');
 console.log('HTML redirects verified. Existing shared Auth settings preserved.');
}finally{if(fs.existsSync(file))fs.unlinkSync(file);}
