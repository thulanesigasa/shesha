import {dismissalPoint,assertAppScreen,navigationPoint,screenContent} from './ui.mjs';
import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const meta=JSON.parse(fs.readFileSync('/tmp/shesha-capture-meta.json'));const adb=(...args)=>execFileSync('adb',args,{encoding:'utf8'});const wait=ms=>new Promise(r=>setTimeout(r,ms));
const routes=JSON.parse(fs.readFileSync(new URL('./routes.json',import.meta.url)))[meta.repository.split('/')[1]]||[{label:'App entry screen',steps:[]}];
const name=meta.repository.split('/')[1],out=path.resolve('capture-output',name);fs.mkdirSync(out,{recursive:true});
adb('install','-r',meta.apk);adb('shell','settings','put','system','accelerometer_rotation','0');adb('shell','settings','put','system','user_rotation','0');
const readUI=()=>{adb('shell','uiautomator','dump','/sdcard/shesha-ui.xml');return adb('shell','cat','/sdcard/shesha-ui.xml');};
async function cleanUI(){let xml=readUI();for(let i=0;i<5;i++){const point=dismissalPoint(xml);if(!point)break;adb('shell','input','tap',String(point.x),String(point.y));await wait(1500);xml=readUI();}assertAppScreen(xml,meta.packageId);return xml;}
const screens=[],seen=new Set();
// Navigate only explicit read-only public screens. Never submit credentials, accept terms or write content.
for(const [index,route] of routes.entries()){
 try{
 adb('shell','am','force-stop',meta.packageId);adb('logcat','-c');adb('shell','monkey','-p',meta.packageId,'-c','android.intent.category.LAUNCHER','1');await wait(index===0?45000:8000);let xml=await cleanUI();
 for(const labels of route.steps){const point=navigationPoint(xml,labels);if(!point)throw Error('Navigation control unavailable');adb('shell','input','tap',String(point.x),String(point.y));await wait(1800);xml=await cleanUI();}
 if(/mInputShown=true|inputShown=true/.test(adb('shell','dumpsys','input_method'))){adb('shell','input','keyevent','KEYCODE_BACK');await wait(500);xml=await cleanUI();}
 const uiHash=createHash('sha256').update(screenContent(xml,meta.packageId)).digest('hex');if(seen.has(uiHash))continue;seen.add(uiHash);
 const image=execFileSync('adb',['exec-out','screencap','-p']);if(!image.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('Invalid PNG');const file=`screen-${screens.length}.png`;fs.writeFileSync(path.join(out,file),image);fs.writeFileSync(path.join(out,file.replace('.png','.xml')),xml);screens.push({file,label:route.label,uiHash});
 }catch(error){console.log(`Capture route ${route.label}: ${error.message}`);}
}
if(!screens.length)throw Error('No usable app screens were captured');
const {apk,...provenance}=meta;fs.writeFileSync(path.join(out,'capture.json'),JSON.stringify({...provenance,capturedAt:new Date().toISOString(),kind:'android-capture',captureVersion:3,screens},null,2));console.log(`Captured ${screens.length} different app screens`);
