import React, {  PureComponent } from "react";
import {  message, Progress } from "antd";
import { queryString } from "../utils";

import SCLE_CONTROLLER from "./scleControl";
import ScleToolsBar from "./scleTools/scleToolsBar";

import "./scle.less";
import { IsPhone } from "../utils/Browser";

const logo = require("../assets/images/downloadAppIcon.png");
export default class scleView extends PureComponent {
  constructor(props) {
    super(props);
    this.SCLE = new SCLE_CONTROLLER({
      onProgress: this.onProgress.bind(this),
    });
  }
  fullScreenEl = null;
  state = {
    loading: true,
    percent: 0,
    drawerVisible: false,
    isFullScreen: false,
  };
  render() {
    return (
      <>
        <div
          className={
            this.state.isFullScreen ? "fullScreen container" : "container"
          }
          ref={(el) => (this.fullScreenEl = el)}
        >
          <>
            <canvas id="glcanvas" width="800" height="600"></canvas>
            <canvas id="text" width="800" height="600"></canvas>
          </>
          {this.state.loading ? (
            <div className="scle_loading">
              <div className="scle_loadImg">
                <img src={logo} alt="loading" />
                <Progress
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                  percent={this.state.percent}
                  status="active"
                />
                <p>模型下载中...</p>
              </div>
            </div>
          ) : (
            <ScleToolsBar></ScleToolsBar>
          )}
        </div>
      </>
    );
  }

  componentDidMount() {
    this.openScle();
    window.addEventListener("scleStreamReady", () => {
      this.eventHandle();
    });
  }
  eventHandle() {
    this.fullScreenEl.addEventListener("transitionend", function () {
      window.canvasOnResize && window.canvasOnResize();
    });
    window.isPhone = IsPhone();

    // window.history.pushState(null, null, document.URL);
    // window.addEventListener("popstate", function () {
    //   window.history.pushState(null, null, document.URL);
    // });

    // window.addEventListener("fullscreenchange", () => {
    //   this.setState({
    //     isFullScreen: !!document.fullscreenElement,
    //   });
    // });

    // window.addEventListener("MSFullscreenChange", () => {
    //   this.setState({
    //     isFullScreen: document.msFullscreenElement != null,
    //   });
    // });

    [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ].forEach((item, index) => {
      window.addEventListener(item, () => {
        this.setState({
          isFullScreen:
            document.fullScreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen ||
            !!document.msFullscreenElement,
        },async ()=>{
           await this.sleep(10)
            window.canvasOnResize()
        });
      });
    });
  }

  // 打开scle 文件
  openScle() {
    const { title, link } = queryString(window.location.href);
    document.title = title || "三维模型";
    if (link) {
      this.openLink(link);
      return;
    } else {
      message.warning("请输入正确的链接");
    }
  }

  async onProgress(evt) {
    if (evt.lengthComputable) {
      let percentComplete = evt.loaded / evt.total;
      window.g_nCleBufferlength = evt.total;
      // g_loaded_pos = evt.loaded;

      this.setState({
        percent: Math.floor(percentComplete * 100),
      });

      if (percentComplete === 1) {
        this.setState(
          {
            loading: false,
          },
          () => window.canvasOnResize && window.canvasOnResize()
        );
        await this.sleep(250);
        window.canvasOnResize && window.canvasOnResize();
      }
    }
  }

  async sleep(time) {
    return new Promise((r1, r2) => setTimeout(r1, time));
  }
  // 从link 打开
  openLink(link) {
    window.g_strResbaseUrl = link.replace(/(.scle|.zip)$/, "/");
    this.SCLE.getByRequest(link);
  }
}

// class scleView extends SCLE_CONTROLLER extends Component{

// }
