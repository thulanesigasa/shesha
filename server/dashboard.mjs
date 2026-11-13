export function repositoryDraft(project){
 const clean=s=>s.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'').replace(/(^|\s)#([\p{L}\p{N}_]+)/gu,'$1$2').trim();
 const name=clean(project.name.replace(/_/g,' '))||'Project';const short=name.slice(0,48);const description=(clean(project.description||'')||'A project from my GitHub portfolio.').slice(0,210);
 return {caption:`A closer look at ${name}.\n\n${description}\n\nExplore the repository: ${project.url}`,slides:[{title:short,body:description},{title:'Explore the project',body:'Browse the repository to see the project and its available files.'},{title:'Look at the details',body:'Review the available documentation and source before deciding how this project could be useful.'},{title:'Follow its development',body:'Use the repository to follow the work and explore its history.'},{title:'Take a closer look',body:'Find the project on GitHub. The repository link is included in the caption.'}]};
}
