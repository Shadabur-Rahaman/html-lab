import {zipSync,strToU8} from 'fflate';
import {projectImage} from '../src/data/projectImage.mjs';
export function samplePDF(){
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Count 2 /Kids [4 0 R 6 0 R] >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  for(let page=1;page<=2;page++){const stream=`BT /F1 20 Tf 40 740 Td (HTML LAB cloud preview - page ${page}) Tj ET`;objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5+(page-1)*2} 0 R >>`,`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);}
  let pdf='%PDF-1.4\n',offsets=[0];objects.forEach((obj,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`;});const start=pdf.length;
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return strToU8(pdf);
}
export const browserFixtures={
  'Cloud preview.pdf':{mime:'application/pdf',bytes:samplePDF()},
  'Cloud diagram.png':{mime:'image/png',bytes:Uint8Array.from(atob(projectImage.data.split(',')[1]),c=>c.charCodeAt(0))},
  'Cloud worksheet.docx':{mime:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',bytes:zipSync({'[Content_Types].xml':strToU8('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'),'word/document.xml':strToU8('<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>HTML LAB disposable worksheet</w:t></w:r></w:p></w:body></w:document>')})},
  'Cloud practice.zip':{mime:'application/zip',bytes:zipSync({'index.html':strToU8('<!doctype html><html lang="en"><title>Practice</title><h1>Cloud practice</h1></html>'),'style.css':strToU8('body{font-family:system-ui}')})},
  'Cloud notes.txt':{mime:'text/plain',bytes:strToU8('<h1>This is escaped source text, not active HTML.</h1>')},
};
