import fs from 'node:fs';import {createHash} from 'node:crypto';
const baseline=JSON.parse(fs.readFileSync('native-baseline.json'));
for(const [file,digest] of Object.entries(baseline)){const actual=createHash('sha256').update(fs.readFileSync(file)).digest('hex');if(actual!==digest)throw Error(`${file} changes native compatibility. Build and verify a new APK before updating the baseline; do not OTA to incompatible existing installations.`);}
console.log('Native inputs match runtime 1.0.1 baseline');
