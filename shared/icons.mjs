import icons from '../project-icons.json' with {type:'json'};
export function projectIcon(project){return icons[project.id]||project.logo||'';}
