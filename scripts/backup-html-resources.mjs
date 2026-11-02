// Read-only owner backup. Private credentials remain in memory. Output contains
// private materials; keep it outside Git, encrypt it and restrict access.
import fs from 'node:fs';
import path from 'node:path';
import {createClient} from '@supabase/supabase-js';
import {publicSettings,serverKey} from './resource-cloud-tools.mjs';
import {sha256} from '../supabase/functions/_shared/validation.mjs';
if(!process.argv.includes('--confirm-private-backup'))throw Error('Pass --confirm-private-backup to export private HTML files locally.');
const {url,ref}=publicSettings(),db=createClient(url,serverKey(ref),{auth:{persistSession:false,autoRefreshToken:false}});
const folder=path.resolve('.deployment/backups/html-'+new Date().toISOString().replace(/[:.]/g,'-'));
fs.mkdirSync(folder,{recursive:true});
const manifest={created_at:new Date().toISOString(),bucket:'html-lab-resources',tables:{},files:[]};
for(const table of ['html_learning_resources','html_resource_versions','html_resource_categories','html_resource_settings','html_authorized_teachers','html_resource_audit_log']){
 const rows=[];for(let offset=0;;offset+=500){const result=await db.from(table).select('*').order(table==='html_authorized_teachers'?'user_id':'id').range(offset,offset+499);if(result.error)throw Error('HTML metadata backup failed: '+table);rows.push(...result.data);if(result.data.length<500)break;}manifest.tables[table]=rows;
}
for(const version of manifest.tables.html_resource_versions){
 if(version.state==='purged')continue;
 const prefix='html-resources/'+version.resource_id+'/';
 if(!version.storage_path?.startsWith(prefix)||version.storage_path.includes('..'))throw Error('Unexpected HTML object path.');
 const result=await db.storage.from('html-lab-resources').download(version.storage_path);
 if(result.error){if(version.state==='uploading'||version.state==='cancelled'){manifest.files.push({path:version.storage_path,unavailable:true});continue;}throw Error('A retained/current file could not be backed up.');}
 const bytes=new Uint8Array(await result.data.arrayBuffer()),digest=await sha256(bytes);
 if(digest!==version.sha256)throw Error('Backup checksum mismatch.');
 const filename=path.join(folder,'objects',...version.storage_path.split('/'));fs.mkdirSync(path.dirname(filename),{recursive:true});fs.writeFileSync(filename,bytes);manifest.files.push({path:version.storage_path,sha256:digest,size:bytes.length});
}
fs.writeFileSync(path.join(folder,'manifest.json'),JSON.stringify(manifest,null,2));
console.log('HTML metadata and '+manifest.files.filter(f=>!f.unavailable).length+' checksum-verified files backed up under .deployment/backups. No cloud records changed.');
