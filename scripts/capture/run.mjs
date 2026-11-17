import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
const meta=JSON.parse(fs.readFileSync('/tmp/shesha-capture-meta.json'));const adb=(...args)=>execFileSync('adb',args,{encoding:'utf8'});const wait=ms=>new Promise(r=>setTimeout(r,ms));
adb('install','-r',meta.apk);adb('shell','settings','put','system','accelerometer_rotation','0');adb('shell','settings','put','system','user_rotation','0');adb('shell','am','force-stop',meta.packageId);adb('logcat','-c');adb('shell','monkey','-p',meta.packageId,'-c','android.intent.category.LAUNCHER','1');
// Capture the real entry screen. Do not sign in, accept terms, fabricate data or change UI code.
await wait(45000);
const resumed=adb('shell','dumpsys','activity','activities');if(!resumed.includes(meta.packageId))throw Error('Target app is not active');
const logs=adb('logcat','-d','-s','AndroidRuntime:E','ReactNativeJS:E');if(/FATAL EXCEPTION|Invariant Violation|Incompatible React versions/.test(logs))throw Error('App failed during capture; refusing to publish a substitute screen');
const name=meta.repository.split('/')[1],out=path.resolve('capture-output',name);fs.mkdirSync(out,{recursive:true});
adb('shell','uiautomator','dump','/sdcard/shesha-ui.xml');const xml=adb('shell','cat','/sdcard/shesha-ui.xml');if(/splashscreen|splash_screen|expo.modules.splashscreen/i.test(xml))throw Error('App is still on its splash screen; capture withheld');if(/keeps stopping|isn.t responding|Application Error|Unable to load script/i.test(xml))throw Error('Error UI detected');
const image=execFileSync('adb',['exec-out','screencap','-p']);if(!image.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('Invalid screenshot');fs.writeFileSync(path.join(out,'screen.png'),image);const {apk,...provenance}=meta;fs.writeFileSync(path.join(out,'capture.json'),JSON.stringify({...provenance,capturedAt:new Date().toISOString(),label:'App entry screen',kind:'android-capture'},null,2));
