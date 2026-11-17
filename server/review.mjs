import {validateCaption} from './core.mjs';
export function validateSlides(slides,format='carousel') {
 if(!Array.isArray(slides)||slides.length<1||slides.length>5||(format==='logo'&&slides.length!==1))throw Error('Use one logo page or up to five screen pages.');
 return slides.map(s=>{if(!s||typeof s.title!=='string'||s.title.length>52||typeof s.body!=='string'||s.body.length>220)throw Error('Invalid page metadata.');return {title:'',body:''};});
}

export function validateFeedback(value){if(typeof value!=='string'||!value.trim()||value.length>1500)throw Error('Explain what to fix in 1–1500 characters.');return value.trim();}
export function validateApproval(post,body){if(post.status!=='draft')throw Error('Only a draft can be approved.');if(body.revision!==post.revision)throw Error('This draft changed. Reload and review it again.');const count=post.format==='logo'?1:JSON.parse(post.slides||'[]').length;if(post.format!=='logo'&&(count<2||count>5))throw Error('A carousel needs two to five different app screens.');if(!Array.isArray(body.pages)||body.pages.length!==count||new Set(body.pages).size!==count||body.pages.some(x=>typeof x!=='string'||x.length>1400000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(x)))throw Error('Review and render every slide before approval.');}
export function requireApproval(post){if(post.status!=='approved'||post.approved_revision!==post.revision)throw Error('Approve the current caption and visual previews before publishing.');}
