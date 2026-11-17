export const LINKEDIN_PROFILE_URL='https://www.linkedin.com/in/thulanesigasa/';
export const LINKEDIN_PROFILE_NAME='Thulane Sigasa';
export function pinnedLinkedInUrn(member,existing=''){
 if(typeof member?.sub!=='string'||!/^[-\w]+$/.test(member.sub))throw Error('LinkedIn did not return a valid member ID. Use a token with openid and profile permissions.');
 const name=(member.name||`${member.given_name||''} ${member.family_name||''}`).toLowerCase().replace(/[^a-z ]/g,' ').split(/\s+/);
 if(!name.includes('thulane')||!name.includes('sigasa'))throw Error('This app is reserved for Thulane Sigasa. The LinkedIn token belongs to a different named account.');
 const urn='urn:li:person:'+member.sub;if(existing&&existing!==urn)throw Error('This token belongs to a different LinkedIn member. The posting account is locked.');return urn;
}
