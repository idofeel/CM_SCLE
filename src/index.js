import "@babel/polyfill";
import dva from 'dva';
import './index.css';
// import Tools from "./utils/loadScript";

// const SCLELoader = [
//     { url: "/js/SCLELoader/ADFBaseDef.js", name: "SCLELoader.ADFBaseDef" },
//     { url: "/js/SCLELoader/ADFGeomDef.js", name: "SCLELoader" },
//     { url: "/js/SCLELoader/ADFSceneDef.js" },
//     { url: "/js/SCLELoader/ADFCleParser.js" },
//     { url: "/js/SCLELoader/ADFMath.js" },
//     { url: "/js/SCLELoader/ADFGlobal.js" },
//     { url: "/js/SCLELoader/ADFUSDK.js" },
//   ];
//   const SCLERender = [
//     { url: "/js/SCLERender/glmatrix.js" },
//     { url: "/js/SCLERender/GLSL.js" },
//     { url: "/js/SCLERender/Global.js" },
//     { url: "/js/SCLERender/SceneToGLData.js" },
//     { url: "/js/SCLERender/Camera.js" },
//     { url: "/js/SCLERender/GLProgram.js" },
//     { url: "/js/SCLERender/GLRunTime.js" },
//     // { url: "/js/SCLERender/EventAction.js" },
//   ];

  


// Tools.syncLoadScripts(SCLELoader.concat(SCLERender),()=>{
//     window.onload = ()=>{
//         Tools.asyncLoadScripts([{ url: "/js/SCLERender/EventAction.js" }],()=>{})
//     }
// })

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
