import type {Slide} from './CarouselPreview';
export type Project={id:string;name:string;description:string;url:string;enabled:number;screenshot:string;device:string;canva:string;logo:string;brand?:string};
export type Post={project_id:string;slides:string;format:string;revision:number;id:string;name:string;caption:string;status:string;error?:string;created_at:string};
export type Draft={id:string;caption:string;slides:Slide[];format:string;revision:number;status:string;project:Project};
