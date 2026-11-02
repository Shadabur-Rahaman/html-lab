// Local development harness only. Real Supabase session, no transport mocks.
import React from 'react';import{createRoot}from'react-dom/client';import App from '../src/App';import{cloud}from'../src/cloudResources/client';import'../src/styles.css';import'../src/v2.css';
if(new URLSearchParams(location.search).get('teacher')==='1'){
  const response=await fetch('http://127.0.0.1:5181/session',{cache:'no-store'});if(!response.ok)throw Error('Start the explicit local cloud QA bridge first.');
  const result=await cloud!.auth.setSession(await response.json());if(result.error)throw Error('Could not restore the disposable test session.');
  if(!location.hash)location.hash='teacher/resources';
}else if(!location.hash)location.hash='resources';
createRoot(document.getElementById('root')!).render(<App/>);
// Development test adapter for browser providers whose native file chooser
// cannot resolve local files. This drives the actual file input/change handler.
document.getElementById('queue-fixtures')!.addEventListener('click',async()=>{
 const {browserFixtures}=await import('./cloud-fixtures.mjs');
 const transfer=new DataTransfer();
 for(const filename of ['Cloud worksheet.docx','Cloud diagram.png']){const f=browserFixtures[filename];transfer.items.add(new File([f.bytes],filename,{type:f.mime}));}
 const input=document.querySelector<HTMLInputElement>('input[type=file]');if(!input)throw Error('Open the teacher upload screen first.');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));document.getElementById('queue-fixtures')!.textContent='Disposable fixture selection dispatched';
});
