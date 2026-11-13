export function validateCaption(text) {
 if(typeof text!=='string'||!text.trim()||text.length>2900) throw Error('Caption must contain 1–2900 characters.');
 if(/(^|\s)#[\p{L}\p{N}_]+/u.test(text)||/\p{Extended_Pictographic}/u.test(text)) throw Error('Remove hashtags and emojis before posting.');
 return text.trim();
}
export function selectProject(projects, recent) {
 const enabled=projects.filter(p=>p.enabled);
 if(!enabled.length) throw Error('Enable at least one project in Projects.');
 const pool=enabled.filter(p=>!recent.includes(p.id));
 const choices=pool.length?pool:enabled;
 return choices[Math.floor(Math.random()*choices.length)];
}
export async function encrypt(value, secret) {
 const key=await crypto.subtle.importKey('raw',await crypto.subtle.digest('SHA-256',new TextEncoder().encode(secret)), 'AES-GCM',false,['encrypt']);
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(value)));
 return JSON.stringify({iv:Array.from(iv),data:Array.from(new Uint8Array(data))});
}
export async function decrypt(value, secret) {
 const {iv,data}=JSON.parse(value);
 const key=await crypto.subtle.importKey('raw',await crypto.subtle.digest('SHA-256',new TextEncoder().encode(secret)), 'AES-GCM',false,['decrypt']);
 return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(iv)},key,new Uint8Array(data))));
}
export async function remote(url, options={}) {
 const response=await fetch(url,{...options,signal:AbortSignal.timeout(45000)});
 if(!response.ok) throw Error(`Provider request failed (${response.status}). Check the connection and permissions in Settings.`);
 return response;
}
