import captures from '../capture-manifest.json' with {type:'json'};
export function projectScreens(project){const entry=captures[project.id];const screens=entry?.screens?.filter(s=>s?.uri?.startsWith('https://')&&s.kind==='android-capture')||[];if(screens.length)return screens;return project.screenshot?[{uri:project.screenshot,kind:'project-image',label:'Project screen'}]:[];}
