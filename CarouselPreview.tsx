import React,{forwardRef,useImperativeHandle,useRef,useState} from 'react';
import {View,Text,Image} from 'react-native';
import ViewShot from 'react-native-view-shot';
export type Slide={title:string;body:string};
export type PreviewHandle={capture:()=>Promise<string[]>};
type Props={slides:Slide[];name:string;screenshot:string;logo:string;device:string;format:string;onReady:(ready:boolean)=>void};
export const CarouselPreview=forwardRef<PreviewHandle,Props>(function CarouselPreview({slides,name,screenshot,logo,device,format,onReady},ref){
 const shots=useRef<(React.ElementRef<typeof ViewShot>|null)[]>([]);const loaded=useRef(new Set<number>());const [failed,setFailed]=useState(false);
 const asset=format==='logo'?logo:screenshot;
 useImperativeHandle(ref,()=>({capture:async()=>{if(!asset||failed||loaded.current.size!==slides.length)throw Error('Every preview must finish loading before approval.');const pages=[];for(const shot of shots.current){const image=await shot?.capture?.();if(!image)throw Error('Unable to render every slide.');pages.push('data:image/jpeg;base64,'+image);}return pages;}}),[asset,failed,slides.length]);
 return <View style={{gap:20}}>{slides.map((slide,i)=><View key={i} style={{gap:8,alignItems:'center'}}><Text style={{color:'#B6C0B8',fontSize:12}}>Slide {i+1} of {slides.length}</Text><ViewShot ref={el=>{shots.current[i]=el;}} options={{format:'jpg',quality:.9,result:'base64',width:1080,height:1350}} style={{width:320,height:400,backgroundColor:'#fff'}}>
 <View style={{position:'absolute',left:16,top:26,width:135,height:30,justifyContent:'center'}}>{logo?<Image source={{uri:logo}} style={{width:24,height:24}} resizeMode="contain"/>:<Text style={{fontSize:8,color:'#0759F9',fontWeight:'800'}}>{name.replace(/_/g,' ')}</Text>}</View>
 <View style={{position:'absolute',left:159,top:49,bottom:48,width:1,backgroundColor:'#161616'}}/>
 <View style={{position:'absolute',left:12,top:72,bottom:60,width:136,alignItems:'center',justifyContent:'center'}}>
 {asset?<View style={format==='logo'?{width:115,height:155}:device==='laptop'?{width:134,height:89,borderWidth:3,borderColor:'#192A39',borderRadius:4,backgroundColor:'#fff'}:{width:107,height:220,borderWidth:5,borderColor:'#192A39',borderRadius:19,backgroundColor:'#fff',overflow:'hidden'}}><Image key={asset} source={{uri:asset}} style={{width:'100%',height:'100%'}} resizeMode={format==='logo'?'contain':'cover'} onLoad={()=>{loaded.current.add(i);onReady(loaded.current.size===slides.length&&!failed);}} onError={()=>{setFailed(true);onReady(false);}}/></View>:<Text style={{fontSize:10,color:'#777'}}>Add a {format==='logo'?'logo':'screenshot'} in Projects.</Text>}
 {device==='laptop'&&format!=='logo'&&<View style={{height:5,width:144,borderBottomLeftRadius:8,borderBottomRightRadius:8,backgroundColor:'#AAB6C1'}}/>}
 </View>
 <View style={{position:'absolute',left:175,right:16,top:72}}><Text style={{fontSize:5,letterSpacing:.7,fontWeight:'800',color:'#0759F9',marginBottom:12}}>{name.replace(/_/g,' ').toUpperCase()}   <Text style={{color:'#FA3D90'}}>•</Text></Text><Text style={{fontSize:16,lineHeight:20,fontWeight:'800',color:'#121212'}}>{slide.title.split(' ').slice(0,Math.ceil(slide.title.split(' ').length/2)).join(' ')}{'\n'}<Text style={{color:'#0759F9'}}>{slide.title.split(' ').slice(Math.ceil(slide.title.split(' ').length/2)).join(' ')}</Text></Text><View style={{width:14,height:1.5,backgroundColor:'#FA3D90',marginVertical:18}}/><Text style={{fontSize:8.5,lineHeight:12,color:'#151515'}}>{slide.body}</Text></View>
 <Text style={{position:'absolute',left:175,bottom:49,fontSize:5,color:'#0759F9',fontWeight:'700'}}>Built with purpose.</Text><Text style={{position:'absolute',left:175,bottom:36,fontSize:4,color:'#555'}}>{String(i+1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</Text>
 </ViewShot></View>)}{failed&&<Text style={{color:'#FFBAA0'}}>A visual could not load. Fix its URL in Projects before approval.</Text>}</View>;
});
