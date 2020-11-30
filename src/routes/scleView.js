import React, { Component, PureComponent } from "react";
import { Drawer, message, Progress } from "antd";
import { queryString } from "../utils";

import SCLE_CONTROLLER from "./scleControl";
import ScleToolsBar from "./scleTools/scleToolsBar";
import ScleAttrTree from "./scleAttrTree/ScleAttrTree";

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
  #customStyle = false;
  state = {
    loading: true,
    percent: 0,
    drawerVisible: false,
    isFullScreen: false,
    containerStyle: {
      width: 0,
      height: 0,
    },
  };
  render() {
    return (
        <>
      <div
        className={
          this.state.isFullScreen ? "fullScreen container" : "container"
        }
        ref={(el) => (this.fullScreenEl = el)}
        style={
          !this.state.isFullScreen
            ? this.state.containerStyle
            : { width: "100%", height: "100%" }
        }
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
          <ScleToolsBar
            onFullScreen={(f) => this.onFullScreen(f)}
          ></ScleToolsBar>
        )}
      </div>
      <div className="scleDesc" style={{
          height:this.state.containerStyle.height,
          width: IsPhone()? '100%': '20%'
          }}>
            名称： xxxxxxxxxxxxxxxxxxxxx
      </div>
      </>
    );
  }

  componentDidMount() {
    this.#customStyle = !!this.fullScreenEl.offsetWidth;
    this.openScle();
    this.eventHandle();
    this.resizeContainer();
  }
  eventHandle() {
    this.fullScreenEl.addEventListener("transitionend", function () {
      window.canvasOnResize();
    });

    window.isPhone = IsPhone();
    window.history.pushState(null, null, document.URL);
    window.addEventListener("popstate", function () {
      window.history.pushState(null, null, document.URL);
    });

    window.addEventListener("resize", () => {
      this.resizeContainer();
    });
  }

  resizeContainer() {
    // 默认值
    if (!this.#customStyle) {
      let width = "100%",
        height = "100%";
      if (IsPhone()) {
        height = 450;
      } else {
        height = window.innerHeight;
        width = "80%";
      }

      this.setState({
        containerStyle: {
          width,
          height,
        },
      });
    }
  }

  onFullScreen(isFullScreen) {
    this.setState({
      isFullScreen,
    });
  }

  //   // 脚本全部加载完成
  //   onReady() {
  //     let custom = new CustomEvent("scleloaded", { detail: {} });
  //     window.dispatchEvent(custom);
  //     this.openScle();
  //   }

  // 打开scle 文件
  openScle() {
    const { pid, title, link, lic } = queryString(window.location.href);
    console.log(link);
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
      /* eslint-disable */
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
          window.canvasOnResize
        );
        await this.sleep(250);
        window.canvasOnResize();
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
