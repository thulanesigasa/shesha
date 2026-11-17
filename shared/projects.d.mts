export function visibleProjects<T extends {id:string;name:string;description?:string;commit_count?:number|null}>(projects:T[],query?:string):T[];
export function keyboardOverlap(top:number,height:number,keyboardTop:number):number;
