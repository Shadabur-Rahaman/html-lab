// Local QA bridge: disposable teacher/session stays in memory. No owner password.
import http from 'node:http';
import fs from 'node:fs';
import {createClient} from '@supabase/supabase-js';
import {publicSettings,serverKey} from './resource-cloud-tools.mjs';
import {browserFixtures} from '../tests/cloud-fixtures.mjs';
import {sha256} from '../supabase/functions/_shared/validation.mjs';
if(!process.argv.includes('--confirm-disposable-tests'))throw Error('Explicit disposable-test confirmation required.');
const {url,key,ref}=publicSettings();
const admin=createClient(url,serverKey(ref),{auth:{persistSession:false,autoRefreshToken:false}}),auth=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const email=`html-browser-${Date.now()}@example.invalid`,password=crypto.randomUUID()+'!Aa9';
const created=await admin.auth.admin.createUser({email,password,email_confirm:true});if(created.error)throw Error('Could not create disposable account.');const id=created.data.user.id;
const granted=await admin.from('html_authorized_teachers').insert({user_id:id,role:'teacher'});if(granted.error)throw Error('Could not authorize disposable HTML teacher.');
const login=await auth.auth.signInWithPassword({email,password});if(login.error)throw Error('Disposable sign-in failed.');
const session={access_token:login.data.session.access_token,refresh_token:login.data.session.refresh_token};
const headers={apikey:key,Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'};
async function api(action,body){const r=await fetch(url+'/functions/v1/html-resource-api',{method:'POST',headers,body:JSON.stringify({action,...body})});const v=await r.json();if(!r.ok)throw Error(v.error);return v;}
fs.mkdirSync('.deployment/cloud-browser-files',{recursive:true});
for(const [filename,file]of Object.entries(browserFixtures))fs.writeFileSync('.deployment/cloud-browser-files/'+filename,file.bytes);
for(const [filename,file]of Object.entries(browserFixtures)){
  const reserved=await api('prepare',{request_id:crypto.randomUUID(),original_filename:filename,file_size:file.bytes.length,mime_type:file.mime,sha256:await sha256(file.bytes),metadata:{title:'Live check · '+filename,description:'Disposable HTML browser verification',chapter_id:3,lesson_id:'document',category_id:null,tags:['browser-check'],status:'published',display_order:0,learning_scope:'general',project_id:null}});
  const upload=await auth.storage.from('html-lab-resources').upload(reserved.storage_path,file.bytes,{contentType:file.mime,upsert:false});if(upload.error)throw Error('Fixture byte upload failed.');await api('finalize',{upload_id:reserved.id});
}
let cleaning=false;
async function cleanup(){if(cleaning)return;cleaning=true;const resources=await admin.from('html_learning_resources').select('id').eq('uploaded_by',id);for(const r of resources.data||[]){const versions=await admin.from('html_resource_versions').select('storage_path').eq('resource_id',r.id);await admin.storage.from('html-lab-resources').remove((versions.data||[]).map(v=>v.storage_path));await admin.from('html_learning_resources').update({status:'deleted',current_version_id:null,storage_path:null}).eq('id',r.id);await admin.from('html_resource_versions').delete().eq('resource_id',r.id);await admin.from('html_learning_resources').delete().eq('id',r.id);}await auth.auth.signOut();await admin.from('html_authorized_teachers').delete().eq('user_id',id);await admin.auth.admin.deleteUser(id);console.log('Disposable browser account and HTML files cleaned up.');server.close();}
const server=http.createServer(async(req,res)=>{if(req.headers.origin!=='http://127.0.0.1:5178'){res.writeHead(403).end();return;}res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5178');res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');if(req.url==='/session'){const fresh=await auth.auth.signInWithPassword({email,password});if(fresh.error){res.writeHead(500).end('{}');return;}res.end(JSON.stringify({access_token:fresh.data.session.access_token,refresh_token:fresh.data.session.refresh_token}));}else res.writeHead(404).end();});
server.listen(5181,'127.0.0.1',()=>console.log('Disposable live fixtures ready. Browser session endpoint is loopback-only; no credentials were printed or saved.'));
process.on('SIGINT',()=>void cleanup());process.on('SIGTERM',()=>void cleanup());
const watcher=setInterval(()=>{if(fs.existsSync('.deployment/finish-cloud-browser')){fs.unlinkSync('.deployment/finish-cloud-browser');clearInterval(watcher);void cleanup();}},1000);
