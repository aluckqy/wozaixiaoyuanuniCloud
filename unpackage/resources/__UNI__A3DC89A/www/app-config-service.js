
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/basics/login","pages/basics/health","pages/basics/location","pages/basics/today","pages/basics/blue","pages/basics/log","pages/basics/sign","pages/basics/password","pages/basics/record","pages/basics/notify"],"window":{"navigationBarBackgroundColor":"#0081ff","navigationBarTitleText":"ColorUi for UniApp","navigationStyle":"custom","navigationBarTextStyle":"white"},"nvueCompiler":"uni-app","nvueStyleCompiler":"weex","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"ColorUI-UniApp","compilerVersion":"3.4.7","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true},"window":{}},{"path":"/pages/basics/login","meta":{},"window":{}},{"path":"/pages/basics/health","meta":{},"window":{}},{"path":"/pages/basics/location","meta":{},"window":{}},{"path":"/pages/basics/today","meta":{},"window":{}},{"path":"/pages/basics/blue","meta":{},"window":{}},{"path":"/pages/basics/log","meta":{},"window":{}},{"path":"/pages/basics/sign","meta":{},"window":{}},{"path":"/pages/basics/password","meta":{},"window":{}},{"path":"/pages/basics/record","meta":{},"window":{}},{"path":"/pages/basics/notify","meta":{},"window":{}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});