import {createClient} from '@supabase/supabase-js';import{publicSettings,serverKey,supabase}from'./resource-cloud-tools.mjs';
if(!process.argv.includes('--confirm-add-html-enrollment'))throw Error('Review the additive HTML-only migration, then pass --confirm-add-html-enrollment.');
const{url,ref}=publicSettings('.env.private.local'),db=createClient(url,serverKey(ref),{auth:{persistSession:false,autoRefreshToken:false}});
const existing=await db.from('html_student_enrollments').select('id').limit(1);
if(existing.error){supabase(['db','query','--remote='+ref,'--file','supabase/migrations/202611050001_html_private_classroom.sql','--yes','--output','json']);console.log('Applied independent HTML enrollment schema and audit functions.');}
supabase(['db','query','--remote='+ref,'--file','supabase/migrations/202611050002_html_identity_observation.sql','--yes','--output','json']);
const admins=await db.from('html_student_enrollments').select('id').eq('role','admin').eq('status','active');if(admins.error||!admins.data.length)throw Error('No existing confirmed HTML admin was available. Owner must approve a confirmed HTML teacher before configuring Access.');
console.log('Confirmed '+admins.data.length+' existing HTML administrator mapping(s). No JS enrollment/resource records or public HTML policies changed.');
