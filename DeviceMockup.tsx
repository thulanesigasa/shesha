import React,{useEffect,useState} from 'react';
import {View,Text,Image} from 'react-native';
import {visualProfile} from './shared/visuals.mjs';
import {projectScreens} from './shared/screens.mjs';
import type {Project} from './models';
export function DeviceMockup({project,index=0,onReady,logoOnly=false}:{project:Project;index?:number;onReady?:(ready:boolean)=>void;logoOnly?:boolean}){
 const p=visualProfile(project),screens=projectScreens(project);const uri=logoOnly?project.logo:screens[index%screens.length]?.uri;
 const [failed,setFailed]=useState(false);
 useEffect(()=>{setFailed(false);onReady?.(false);},[uri]);
 const laptop=p.device==='laptop';const screen=uri&&!failed?<Image key={uri} source={{uri}} style={{width:'100%',height:'100%'}} resizeMode="contain" onLoad={()=>onReady?.(true)} onError={()=>{setFailed(true);onReady?.(false);}}/>:<View style={{flex:1,alignItems:'center',justifyContent:'center',padding:8,gap:8}}><Text style={{fontSize:9,fontWeight:'700',color:p.text,textAlign:'center'}}>{failed?'Screen could not load':logoOnly?'App logo unavailable':'App screen unavailable'}</Text><Text style={{fontSize:6,lineHeight:9,color:p.text,textAlign:'center'}}>{failed?'Refresh the project capture before approval.':'A real app screen is required. No substitute UI is generated.'}</Text></View>;
 if(logoOnly)return <View style={{width:122,height:160,backgroundColor:p.background}}>{screen}</View>;
 return <View style={{alignItems:'center',justifyContent:'center',width:146,height:250}}><View style={{width:laptop?140:112,height:laptop?96:227,borderColor:'#17202A',borderWidth:laptop?4:5,borderRadius:laptop?6:20,overflow:'hidden',backgroundColor:p.background}}>{screen}</View>{laptop&&<View style={{height:6,width:151,backgroundColor:'#8C98A3',borderBottomLeftRadius:10,borderBottomRightRadius:10}}/>}<Text style={{fontSize:4.5,marginTop:8,color:p.text}}>{uri&&!failed?'PROJECT SCREEN':'WAITING FOR APP CAPTURE'}</Text></View>;
}
