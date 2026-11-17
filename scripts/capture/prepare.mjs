import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const targets=JSON.parse(fs.readFileSync(new URL('./targets.json',import.meta.url)));
const name=process.env.CAPTURE_PROJECT,target=targets[name];if(!target)throw Error('Unknown capture target');
const repository='thulanesigasa/'+name,work=path.resolve('/tmp/shesha-capture-'+name);fs.mkdirSync(work,{recursive:true});
const run=(cmd,args,cwd=work)=>execFileSync(cmd,args,{cwd,stdio:'inherit',env:{...process.env,CI:'1',NPM_CONFIG_LEGACY_PEER_DEPS:'true'}});
const api=p=>JSON.parse(execFileSync('gh',['api',p],{encoding:'utf8'}));
const releases=api(`repos/${repository}/releases?per_page=10`);let release,asset;
for(const r of releases.filter(r=>!r.draft&&!r.prerelease)){const a=r.assets?.find(a=>/\.apk$/.test(a.name)&&!/preview|debug/i.test(a.name));if(a){release=r;asset=a;break;}}
let sourceRef,sourceSha,apk;
if(asset){sourceRef=release.tag_name;sourceSha=api(`repos/${repository}/commits/${encodeURIComponent(sourceRef)}`).sha;run('gh',['release','download',release.tag_name,'--repo',repository,'--pattern',asset.name,'--dir',work]);apk=path.join(work,asset.name);}
else{
 run('git',['clone','--depth','1',`https://github.com/${repository}.git`,'source']);const source=path.join(work,'source');sourceSha=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();sourceRef=sourceSha;const app=path.join(source,target.path);
 if(!target.native){run('npm',fs.existsSync(path.join(app,'package-lock.json'))?['ci','--legacy-peer-deps']:['install','--legacy-peer-deps'],app);
 // Align an isolated GENI capture build with its installed Expo SDK. App source is unchanged.
 if(name==='GENI'){run('npx',['expo','install','--fix','--npm'],app);const cfg=JSON.parse(fs.readFileSync(path.join(app,'app.json')));cfg.expo.android.package=cfg.expo.android.package.replace(/-/g,'_');fs.writeFileSync(path.join(app,'app.json'),JSON.stringify(cfg));}
 run('npx',['expo','prebuild','--platform','android','--no-install'],app);
 }
 const android=path.join(app,target.native||'android');fs.chmodSync(path.join(android,'gradlew'),0o755);run('./gradlew',[':app:assembleRelease','--no-daemon','-PreactNativeArchitectures=x86_64','-Dorg.gradle.jvmargs=-Xmx4g'],android);
 const out=path.join(android,'app/build/outputs/apk/release');const file=fs.readdirSync(out).find(f=>f.endsWith('.apk'));if(!file)throw Error('Build did not produce an APK');apk=path.join(out,file);
}
const tools=path.join(process.env.ANDROID_HOME,'build-tools');const versions=fs.readdirSync(tools).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));const aapt=path.join(tools,versions.at(-1),'aapt');const badging=execFileSync(aapt,['dump','badging',apk],{encoding:'utf8'});const packageId=badging.match(/package: name='([^']+)'/)?.[1];if(!packageId||!/^[a-zA-Z0-9_.]+$/.test(packageId))throw Error('Cannot identify app package');
fs.writeFileSync('/tmp/shesha-capture-meta.json',JSON.stringify({repository,sourceRef,sourceSha,packageId,apk,apkSha256:createHash('sha256').update(fs.readFileSync(apk)).digest('hex'),release:release?.html_url||null},null,2));
