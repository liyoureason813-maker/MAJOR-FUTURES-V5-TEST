#!/usr/bin/env node
/**
 * Extracts data-only literals from the user's own public, compiled global-majors-guide.
 * It never executes the downloaded React bundle. Only bounded literal expressions are
 * evaluated inside an isolated VM with no require/process/network/window access.
 * Usage: node tools/build-atlas.mjs [--source path/to/bundle.js]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE_URL = 'https://raw.githubusercontent.com/liyoureason813-maker/global-majors-guide/main/assets/index-ZjQvt1sT.js';
const EXPECTED_BLOB = '7231269af1b9265df3dc4d49ac9ad7fc5250ca8e';
const arg = process.argv.indexOf('--source');
const local = arg >= 0 ? process.argv[arg+1] : undefined;
const testFixture = Boolean(local && process.argv.includes('--test-fixture'));
const origin = local ? fs.readFileSync(local,'utf8') : await (async()=>{
 const ctrl = new AbortController(); const timer = setTimeout(()=>ctrl.abort(),30000);
 try {const r=await fetch(SOURCE_URL,{signal:ctrl.signal,headers:{'Accept':'application/javascript'}});if(!r.ok)throw Error(`Source returned ${r.status}`);return await r.text();}
 finally{clearTimeout(timer)}
})();
if(!testFixture && origin.length<300000)throw Error(`Source bundle unexpectedly small (${origin.length})`);
const sha=crypto.createHash('sha1').update(`blob ${Buffer.byteLength(origin,'utf8')}\0`).update(origin,'utf8').digest('hex');
if(!testFixture && sha!==EXPECTED_BLOB)throw Error(`Source file has changed. Expected git blob ${EXPECTED_BLOB}, got ${sha}. Review the new bundle before extracting.`);

function curlyLiteral(anchor){
 const start=origin.indexOf(anchor);if(start<0)throw Error(`Missing literal ${anchor}`);
 const brace=start+anchor.indexOf('{');if(brace<start)throw Error(`No opening brace after ${anchor}`);
 let depth=0,quote='',escaped=false;
 for(let i=brace;i<origin.length;i++){
  const ch=origin[i];
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='"'||ch==='\''||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'&&!--depth)return origin.slice(brace,i+1);
 }
 throw Error(`Unclosed expression ${anchor}`);
}
function bracketLiteral(anchor){
 const start=origin.indexOf(anchor);if(start<0)throw Error(`Missing array ${anchor}`);
 const at=start+anchor.indexOf('[');let count=0,quote='',escaped=false;
 for(let i=at;i<origin.length;i++){const ch=origin[i];
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='`'||ch==='\''||ch==='"'){quote=ch;continue}
  if(ch==='[')count++;else if(ch===']'&&!--count)return origin.slice(at,i+1);
 }
 throw Error(`Unclosed array ${anchor}`);
}
function onlyData(anchor){const literal=curlyLiteral(anchor);if(literal.includes('${'))throw Error(`Interpolation found in ${anchor}`);return vm.runInNewContext('('+literal+')',Object.create(null),{timeout:5000,microtaskMode:'afterEvaluate'});}
const sourceReferences=vm.runInNewContext('('+bracketLiteral('var v=[')+')',Object.create(null),{timeout:5000,microtaskMode:'afterEvaluate'});
const salaryBands=onlyData(',p={generalBusiness:');
const onlineLinks=onlyData(',y={accountingIntro:');
const courseKeys=onlyData(',b={');
const details=onlyData('var ee={accounting:');
let i=origin.indexOf(',m=`accounting§');if(i<0)throw Error('Missing 100-major table');i+=4;
let j=origin.indexOf('`,h={',i);if(j<0)throw Error('Missing end of 100-major table');
const table=origin.slice(i,j);
const level={'!':'core','+':'suggested','~':'bridge'};
const majors=table.split('\n').map((line,index)=>{
 const parts=line.split('§');if(parts.length!==14)throw Error(`Row ${index}: unexpected ${parts.length} fields`);
 const [id,zh,en,category,summary,courses,riasec,mbti,careerTxt,frontiers,salaryKey,outlook,salaryNote,outsidePrep]=parts;
 const courseRows=courses.split(';').map(s=>{const x=s.match(/^(数学|高数|物理|经济|化学|生物|商务)([!+~])(.*)$/);if(!x)throw Error(`Invalid A-Level row ${id}: ${s}`);return {name:x[1],level:level[x[2]],reason:x[3]}});
 const extra=details[id];if(!extra)throw Error(`Missing original long-form record ${id}`);
 const salary=salaryBands[salaryKey];if(!salary)throw Error(`Missing salary band ${id}: ${salaryKey}`);
 const links=(courseKeys[id]||[]).map(k=>{if(!onlineLinks[k])throw Error(`Missing course resource ${id}: ${k}`);return {...onlineLinks[k]}});
 return {id,zh,en,category,summary,riasec:riasec.split(','),mbti:mbti.split(','),courses:courseRows,careers:careerTxt.split(';'),frontiers:frontiers.split(';'),outlook,salaryNote,outsidePrep,salaryKey,salary:salary.map(s=>({label:s.label,range:[...s.range]})),fit:extra.fit,overview:extra.overview,careerContext:extra.careerContext,related:extra.related,activities:extra.activities,onlineCourses:extra.onlineCourses,sourcePages:extra.sourcePages,courseLinks:links};
});
if(majors.length!==100||new Set(majors.map(x=>x.id)).size!==100)throw Error(`Expected 100 unique majors, got ${majors.length}`);
for(const m of majors){if(typeof m.overview!=='string'||!m.overview.trim()||!Array.isArray(m.activities)||!Array.isArray(m.courseLinks)||m.courses.length!==3||m.salary.length!==3)throw Error(`Incomplete major ${m.id}`)}
const manifest={sourceRepository:'liyoureason813-maker/global-majors-guide',sourceAsset:'assets/index-ZjQvt1sT.js',sourceGitBlob:sha,majorCount:majors.length,sourceReferences,refreshedAt:new Date().toISOString(),salaryNote:'职业簇规划参考区间；一线/新一线城市税前年薪总包估算，单位万元；非毕业收入承诺；不用于推荐概率。'};
const outDir=path.join(ROOT,'data');fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'atlas-full.json'),JSON.stringify({manifest,majors},null,2));
fs.writeFileSync(path.join(outDir,'atlas-full.js'),'/* Generated from the user-owned global-majors-guide; do not hand-edit. */\nwindow.MF_ATLAS_FULL='+JSON.stringify({manifest,majors})+';\n');
console.log(JSON.stringify({status:'ok',records:majors.length,sourceGitBlob:sha,files:['data/atlas-full.json','data/atlas-full.js'],first:majors[0].id,last:majors.at(-1).id},null,2));
