import {useEffect,useRef,useState} from 'react';
import {Keyboard,TextInput,ScrollView,type KeyboardEvent} from 'react-native';
import {keyboardOverlap} from './shared/projects.mjs';
export function useKeyboardSafeScroll(){const scrollRef=useRef<ScrollView>(null),scrollY=useRef(0),keyboardTop=useRef(Infinity),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);const [keyboardOpen,setKeyboardOpen]=useState(false);
 function revealFocused(){const input=TextInput.State.currentlyFocusedInput();input?.measureInWindow((_x,y,_w,h)=>{const overlap=keyboardOverlap(y,h,keyboardTop.current);if(overlap>0)scrollRef.current?.scrollTo({y:scrollY.current+overlap,animated:true});});}
 useEffect(()=>{const show=(event:KeyboardEvent)=>{keyboardTop.current=event.endCoordinates.screenY;setKeyboardOpen(true);clearTimeout(timer.current);timer.current=setTimeout(revealFocused,120);};const hide=()=>{keyboardTop.current=Infinity;setKeyboardOpen(false);clearTimeout(timer.current);};const a=Keyboard.addListener('keyboardDidShow',show),b=Keyboard.addListener('keyboardDidHide',hide);return()=>{a.remove();b.remove();clearTimeout(timer.current);};},[]);
 return {scrollRef,scrollY,keyboardOpen,onInputFocus:()=>{clearTimeout(timer.current);timer.current=setTimeout(revealFocused,180);}};
}
