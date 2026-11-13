export type VisualProfile={primary:string;secondary:string;background:string;text:string;surface:string;device:'phone'|'laptop';layout:string;label:string;sections:string[];source:string};
export function visualProfile(project:{id?:string;name?:string;brand?:string|Partial<VisualProfile>}):VisualProfile;
export function inferVisualProfile(project:object,files:(string|{path:string})[],contents?:Record<string,string>):VisualProfile;
export function discoverVisualAssets(project:{id:string},files:(string|{path:string})[],contents?:Record<string,string>,branch?:string):{logo:string;screenshot:string};
export const neutralProfile:VisualProfile;
