import Script from "react-load-script";
import React, { Component } from "react";
import Tools from "../../utils/loadScript";


const SCLELoader = [
  { url: "./js/SCLELoader/ADFBaseDef.js", name: "SCLELoader.ADFBaseDef" },
  { url: "./js/SCLELoader/ADFGeomDef.js", name: "SCLELoader" },
  { url: "./js/SCLELoader/ADFSceneDef.js" },
  { url: "./js/SCLELoader/ADFCleParser.js" },
  { url: "./js/SCLELoader/ADFMath.js" },
  { url: "./js/SCLELoader/ADFGlobal.js" },
  { url: "./js/SCLELoader/ADFUSDK.js" },
];
const SCLERender = [
  { url: "./js/SCLERender/glmatrix.js" },
  { url: "./js/SCLERender/GLSL.js" },
  { url: "./js/SCLERender/Global.js" },
  { url: "./js/SCLERender/SceneToGLData.js" },
  { url: "./js/SCLERender/Camera.js" },
  { url: "./js/SCLERender/GLProgram.js" },
  { url: "./js/SCLERender/GLRunTime.js" },
  { url: "./js/SCLERender/EventAction.js" },
];

const scripts = [].concat(SCLELoader);
// const awaitScript = [ 
//  
//  ]

export default class ScleScript extends Component {
  static defaultProps = {
    loaded: () => {},
  };
  loadSciptNum = 0;
  render() {
    // const { scripts } = this.state;
    return (
      <div>
        {scripts.map((item, index) => {
          return (
            <Script
              key={index}
              url={item.url}
              onCreate={this.handleScriptCreate.bind(this)}
              onError={this.handleScriptError.bind(this)}
              onLoad={this.handleScriptLoad.bind(this)}
            />
          );
        })}
        {this.renderSyncScript(SCLERender)}
      </div>
    );
  }

  renderSyncScript(urls) {
    // return (
    //   <Script
    //     url={item.url}
    //     onCreate={this.handleScriptCreate.bind(this)}
    //     onError={this.handleScriptError.bind(this)}
    //     onLoad={() => {}}
    //   />
    // );
  }

  handleScriptCreate() {}
  handleScriptError() {}
  handleScriptLoad() {
    this.loadSciptNum++;
    if (this.loadSciptNum >= scripts.length) {
      this.scriptLoaded();
    }
    // console.log(window.ADF_BASEUINT2);
  }
  scriptLoaded() {
    console.log("加载完成");
    window.addEventListener("load", () => {
      Tools.syncLoadScripts(SCLERender, () => {
        this.props.loaded();
      });
    });
    //   this.props.loaded()
  }
  componentWillUnmount() {
    window.removeEventListener("load", () => {});
  }
}
