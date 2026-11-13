const projectId = process.env.EXPO_PROJECT_ID || '0c476bbb-2342-4336-bb38-0fa2d6d9f0c8';
module.exports = {expo:{
 name:'Shesha',slug:'shesha',owner:'thulanesigasa0',version:'1.0.2',scheme:'shesha',orientation:'portrait',
 userInterfaceStyle:'light',backgroundColor:'#FFFFFF',icon:'./assets/brand.png',runtimeVersion:'1.0.1',
 android:{package:'com.thulanesigasa.shesha',versionCode:2,adaptiveIcon:{foregroundImage:'./assets/brand.png',backgroundColor:'#FFFFFF'}},
 ios:{bundleIdentifier:'com.thulanesigasa.shesha',buildNumber:'2'},
 web:{favicon:'./assets/brand.png'},
 plugins:['expo-secure-store','expo-updates',['expo-splash-screen',{image:'./assets/brand.png',imageWidth:220,resizeMode:'contain',backgroundColor:'#FFFFFF'}]],
 updates:{enabled:true,checkAutomatically:'ON_LOAD',fallbackToCacheTimeout:0,url:`https://u.expo.dev/${projectId}`},
 extra:{eas:{projectId}}
}};
