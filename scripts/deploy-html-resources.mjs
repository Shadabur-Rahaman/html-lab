// Owner terminal only. Server keys stay in memory; no JS LAB record is mutated.
import fs from 'node:fs';
import {createClient} from '@supabase/supabase-js';
import {publicSettings,serverKey,supabase} from './resource-cloud-tools.mjs';
if(!process.argv.includes('--confirm-add-html-library'))throw Error('Pass --confirm-add-html-library after reviewing the additive HTML-only migration.');
const {url,ref}=publicSettings();
const db=createClient(url,serverKey(ref),{auth:{persistSession:false,autoRefreshToken:false}});
const existing=await db.from('html_learning_resources').select('id').limit(1);
if(existing.error){
  const checked=JSON.parse(supabase(['db','query','--remote='+ref,'--file','supabase/migrations/202611020001_html_resources.sql','--output','json','--yes']));
  if(checked.error)throw Error('Migration failed. Inspect the SQL privately.');
  console.log('Applied the additive HTML-only schema and private bucket.');
}
supabase(['db','query','--remote='+ref,'--file','supabase/migrations/202611020002_html_rate_housekeeping.sql','--output','json','--yes']);
const {data:owners,error}=await db.from('authorized_teachers').select('user_id').eq('role','admin');
if(error||owners?.length!==1)throw Error('Expected one existing approved JS LAB owner. Select the intended confirmed Auth UID before assigning HTML access.');
const confirmed=await db.auth.admin.getUserById(owners[0].user_id);
if(!confirmed.data.user?.email_confirmed_at)throw Error('The existing owner account is not confirmed.');
const authorized=await db.from('html_authorized_teachers').upsert({user_id:owners[0].user_id,role:'admin'});
if(authorized.error)throw Error('HTML owner authorization failed.');
supabase(['functions','deploy','html-resource-api','--remote='+ref,'--no-verify-jwt','--yes']);
console.log('Deployed html-resource-api and authorized the same confirmed owner in the separate HTML grant table. JS LAB settings, teacher grants and resources were not changed. No cleanup schedule was created.');
