import {validateCaption} from './core.mjs';
export function validateSlides(slides,format='carousel') {
 const count=format==='logo'?1:5;
 if(!Array.isArray(slides)||slides.length!==count)throw Error(`This format requires ${count} slides.`);
 return slides.map(s=>{
 if(!s||typeof s.title!=='string'||!s.title.trim()||s.title.length>52||typeof s.body!=='string'||!s.body.trim()||s.body.length>220)throw Error('Each slide needs a title (up to 52 characters) and body (up to 220 characters).');
 validateCaption(s.title);validateCaption(s.body);return {title:s.title.trim(),body:s.body.trim()};
 });
}
export function validateFeedback(value){if(typeof value!=='string'||!value.trim()||value.length>1500)throw Error('Explain what to fix in 1–1500 characters.');return value.trim();}
export function validateApproval(post,body){if(post.status!=='draft')throw Error('Only a draft can be approved.');if(body.revision!==post.revision)throw Error('This draft changed. Reload and review it again.');const count=post.format==='logo'?1:5;if(!Array.isArray(body.pages)||body.pages.length!==count||body.pages.some(x=>typeof x!=='string'||x.length>1400000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(x)))throw Error('Review and render every slide before approval.');}
export function requireApproval(post){if(post.status!=='approved'||post.approved_revision!==post.revision)throw Error('Approve the current caption and visual previews before publishing.');}
