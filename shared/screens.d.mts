export type ProjectScreen={uri:string;kind:string;label?:string;sha256?:string;uiHash?:string};
export function distinctScreens(screens:ProjectScreen[]):ProjectScreen[];
export function projectScreens(project:{id:string;screenshot?:string}):ProjectScreen[];
export function visualPageCount(project:{id:string;screenshot?:string},format?:string):number;
