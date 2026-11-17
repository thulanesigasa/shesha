import captures from '../capture-manifest.json' with {type:'json'};
export function distinctScreens(screens){const seen=new Set(),uris=new Set();return screens.filter(s=>{if(!s?.uri?.startsWith('https://'))return false;const key=s.uiHash||s.sha256||s.uri;if(seen.has(key)||uris.has(s.uri))return false;seen.add(key);uris.add(s.uri);return true;}).slice(0,5);}
export function projectScreens(project){const saved=(captures[project.id]?.screens||[]).filter(s=>s.kind==='android-capture');return distinctScreens([...(project.screenshot?[{uri:project.screenshot,kind:'project-image',label:'Project screen'}]:[]),...saved]);}
export function visualPageCount(project,format='carousel'){return format==='logo'?1:Math.max(1,projectScreens(project).length);}
