import {visualProfile,inferVisualProfile,discoverVisualAssets} from '../shared/visuals.mjs';
export function brandedProject(project){const brand=visualProfile(project);return {...project,device:brand.device,brand:JSON.stringify(brand)};}
export async function refreshProjectVisuals(env,settings,project){
 if(!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(project.id))throw Error('Invalid repository.');
 const headers={'User-Agent':'Shesha',Accept:'application/vnd.github+json',...(settings.githubToken?{Authorization:`Bearer ${settings.githubToken}`}:{})};
 async function get(path,raw=false){const r=await fetch('https://api.github.com/repos/'+project.id+path,{headers:{...headers,...(raw?{Accept:'application/vnd.github.raw+json'}:{})},signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('GitHub source read failed. Check the GitHub connection or try again.');return raw?r.text():r.json();}
 const repo=await get('');const tree=await get('/git/trees/'+encodeURIComponent(repo.default_branch)+'?recursive=1');const files=(tree.tree||[]).filter(x=>x.type==='blob').map(x=>x.path).filter(x=>!/(node_modules|\.npm-cache|\.git)\//.test(x));
 const sources=files.filter(x=>/(^|\/)(app\.json|package\.json)$|(?:colors?|theme)\.[cm]?[jt]sx?$|(?:globals|styles)\.css$/i.test(x)).slice(0,8);const contents={};
 await Promise.all(sources.map(async path=>{const file=tree.tree.find(x=>x.path===path);if(file?.size>100000)return;try{contents[path]=(await get('/contents/'+path.split('/').map(encodeURIComponent).join('/')+'?ref='+encodeURIComponent(repo.default_branch),true)).slice(0,100000);}catch{}}));
 const brand=inferVisualProfile({...project,brand:'{}'},files,contents);const assets=discoverVisualAssets(project,files,contents,repo.default_branch);
 const next={...project,device:brand.device,brand:JSON.stringify(brand),logo:project.logo||assets.logo,screenshot:project.screenshot||assets.screenshot};
 await env.DB.prepare('UPDATE projects SET brand=?,device=?,logo=?,screenshot=? WHERE id=?').bind(next.brand,next.device,next.logo,next.screenshot,next.id).run();return next;
}
