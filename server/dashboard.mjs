export function repositoryDraft(project){
 const clean=s=>s.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'').replace(/(^|\s)#([\p{L}\p{N}_]+)/gu,'$1$2').trim();
 const name=clean(project.name.replace(/_/g,' '))||'Project';const description=(clean(project.description||'')||'A project from my GitHub portfolio.').slice(0,210);
 return {caption:`${name} is part of my development portfolio.

${description}

The repository is available for a closer look at the implementation, documentation and development history. If this project connects with a problem you are working on, I would welcome your perspective.

${project.url}`,slides:Array.from({length:5},()=>({title:'',body:''}))};
}
