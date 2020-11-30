import {
  Drawer,
  Icon,
  message,
  Popover,
  Radio,
  Slider,
  Tabs,
  Tooltip,
} from "antd";
import { Component, PureComponent } from "react";
import { ChromePicker } from "react-color";
import { fullScreen, exitFullscreen, IEVersion } from "../../utils/Browser";
import ScleAttrTree from "../scleAttrTree/ScleAttrTree";
import "./scleTools.less";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1616415_x0co1i09pnp.js",
});
const { TabPane } = Tabs;

message.config({
  maxCount: 1,
});
export default class scleTools extends PureComponent {

  #tools = [
    { type: "home", title: "复位", onClick: () => window.setHome() },
    {
      type: "drag", title: "移动零件", onClick: () => this.isPickNull(() => window.moveModel())
    },
    {
      type: "apartment",
      title: "属性",
      onClick: () => this.drawerToggle(),
    },
    { type: "eye", title: "隐藏" },
    { type: "bg-colors", title: "颜色", popover: () => this.renderColor() },
    {
      type: "icon-toumingdu",
      title: "透明度",
      isFont: true,
      popover: () => this.renderSlider(),
    },
    {
      type: "icon-background-l",
      // title: "背景色",
      isFont: true,
      popover: () => this.renderBackground(),
    },
    {
      type: "icon-box",
      isFont: true,
      popover: () => this.renderViewDire(),
    },
    {
      type: "play-circle",
      title: "播放",
      onClick: () => {
        this.setState({
          tools: [...this.#playerTools],
        });
      },
    },
    { type: "fullscreen", title: "全屏" },
  ];

  #playerTools = [
    {
      type: "pause-circle",
      title: "暂停",
    },
    {
      type: "renderPlayerBar",
      tabComponent: () => this.renderPlayerBar(),
    },
    {
      type: "icon-Stop",
      isFont: true,
      title: "停止",
      onClick: () => this.playerStop(),
    },
  ];

  state = {
    activeTab: null,
    tools: [...this.#tools],
    background: {
      // 调色板
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    },
    playPercent: 0,
    alpha: 1,
    drawerVisible: false,
  };

  totalFrames = 0;

  componentDidMount() {
    window.addEventListener("cleStreamReady", this.cleStreamReady.bind(this), {
      passive: false,
    });
  }
  componentWillUnmount() {
    window.removeEventListener(
      "cleStreamReady",
      this.cleStreamReady.bind(this),
      {
        passive: false,
      }
    );
  }
  //   cleStreamReady
  cleStreamReady() {
    this.totalFrames = window.getTotalFrames();
    window.setAnmiIcon = this.setAnmiIcon;
    window.getCurFrame = (CurFrame) => this.getCurFrame(CurFrame);
  }

  render() {
    return (
      <>
        <Drawer
          title={null}
          closable={false}
          mask={false}
          placement="left"
          width="auto"
          visible={this.state.drawerVisible}
          getContainer={false}
          bodyStyle={{ padding: 0 }}
          className="cleTreeDrawer"
        >
          <ScleAttrTree></ScleAttrTree>
        </Drawer>
        <div className="scleToolsBar">
          <Tabs
            activeKey={this.state.activeTab}
            tabPosition="bottom"
            animated={false}
            onChange={(activeTab) => this.setState({ activeTab })}
          >
            {this.renderTools()}
          </Tabs>
        </div>
      </>
    );
  }

  drawerToggle() {
    this.setState({
      drawerVisible: !this.state.drawerVisible,
    });
  }

  renderTools() {
    const { tools } = this.state;
    return tools.map((item, index) => (
      <TabPane
        tab={
          item.tabComponent
            ? item.tabComponent(item, index)
            : this.renderPopover(item, index)
        }
        key={item.type}
      ></TabPane>
    ));
  }

  renderPopover(item, index) {
    return (
      <Tooltip title={item.title}>
        {item.popover ? (
          <Popover
            content={item.popover()}
            trigger="click"
            visible={item.visible}
            onVisibleChange={(visible) => {
              //   if (index === 5) {
              //     return;
              //   }
              this.changeVisible(visible, index);
            }}
          >
            {this.renderToolsIcon(item, index)}
          </Popover>
        ) : (
            this.renderToolsIcon(item, index)
          )}
      </Tooltip>
    );
  }

  renderColor() {
    return (
      <ChromePicker
        onChange={(e) => {
          this.isPickNull(() => {
            const { r, g, b, a } = e.rgb;
            this.setState({
              background: e.rgb,
            });
            window.setMaterialRGBA(r / 255, g / 255, b / 255, a);
          });
        }}
        color={this.state.background}
      ></ChromePicker>
    );
  }

  renderPlayerBar(item, index) {
    return (
      <Slider
        className="progressSlider"
        min={0}
        max={100}
        value={this.state.playPercent}
        key={index}
        tipFormatter={(e) => e + "%"}
        onChange={(playPercent) => {
          this.setState({ playPercent });
          window.setCurFrame(this.totalFrames * (playPercent / 100));
        }}
      />
    );
  }

  // 渲染透明度进度条
  renderSlider() {
    return (
      <div className="transparent">
        <Slider
          defaultValue={1}
          step={0.1}
          min={0}
          max={1}
          value={this.state.alpha}
          onChange={(value) => {
            this.isPickNull(() => {
              this.setState({
                alpha: value,
              });
              window.setTransparent(value);
            });
          }}
        />
      </div>
    );
  }

  // 渲染背景色
  renderBackground() {
    return (
      <Radio.Group
        defaultValue="0"
        buttonStyle="solid"
        onChange={(e) => {
          window.setBackground(e.target.value * 1);
        }}
      >
        <Radio.Button value="0">淡蓝色</Radio.Button>
        <Radio.Button value="1">浅白色</Radio.Button>
        <Radio.Button value="2">银灰色</Radio.Button>
      </Radio.Group>
    );
  }

  renderViewDire() {
    const bg = { background: "rgba(24,144,255, 0.6)" };
    const viewDirections = [
      { title: "正视图", value: 0, forward: bg },
      { title: "后视图", value: 1, back: bg },
      { title: "左视图", value: 2, left: bg },
      { title: "右视图", value: 3, right: bg },
      { title: "俯视图", value: 4, up: bg },
      { title: "仰视图", value: 5, down: bg },
      { title: "等轴侧", value: 6, forward: bg, right: bg },
    ];
    return (
      <div className="DivBox">
        {!IEVersion() ? (
          viewDirections.map((item) => (
            <DivBox
              key={item.value}
              {...item}
              onTouchEnd={() => window.setView(item.value)}
              onClick={() => window.setView(item.value)}
            />
          ))
        ) : (
            <Radio.Group
              defaultValue={0}
              buttonStyle="solid"
              onChange={(item) => {
                window.setView(item.target.value);
              }}
            >
              {viewDirections.map((item) => (
                <Radio.Button value={item.value} key={item.value}>
                  {item.title}
                </Radio.Button>
              ))}
            </Radio.Group>
          )}
      </div>
    );
  }

  renderToolsIcon(item, index) {
    return item.isFont ? (
      <IconFont
        type={item.type}
        onClick={() => {
          this.changeVisible(!item.visible, index);
          this.toolsClickHandle(item, index);
        }}
      />
    ) : (
        <Icon
          type={item.type}
          onClick={() => {
            this.changeVisible(!item.visible, index);
            this.toolsClickHandle(item, index);
          }}
        />
      );
  }

  // player
  playHandle(item, index) {
    const newTools = this.state.tools;
    if (item.type === "play-circle") {
      newTools[index] = {
        type: "pause-circle",
        title: "暂停",
      };
      window.setAnimationStart();
    }
    if (item.type === "pause-circle") {
      newTools[index] = {
        type: "play-circle",
        title: "播放",
      };
      window.animPause();
    }
    this.setState({ tools: newTools });
  }

  // 工具栏 触发事件统一处理
  toolsClickHandle(item, index) {
    const newTools = this.state.tools;
    if (item.type === "eye") {
      //
      newTools[index].type = "eye";
      window.setVisible(!newTools[index].pickObjectVisible);
      newTools[index].pickObjectVisible = !newTools[index].pickObjectVisible;
    }

    if (item.type === "pause-circle" || item.type === "play-circle") {
      this.playHandle(item, index);
    }

    if (item.type === "fullscreen") {
      newTools[index] = { type: "fullscreen-exit", title: "退出全屏" };
      fullScreen();
    }
    if (item.type === "fullscreen-exit") {
      newTools[index] = { type: "fullscreen", title: "全屏" };
      exitFullscreen();
    }

    this.setState({
      tools: [...newTools],
    }, () => item.onClick && item.onClick());

  }

  pickObjectParameters() {
    console.log("pickObjectParameters");
  }

  //   停止播放
  playerStop() {
    window.animTerminal();
    this.setState({
      tools: [...this.#tools],
    });
  }

  changeVisible(visible, index) {
    const newTools = this.state.tools;
    newTools[index].visible = visible;
    this.setState({
      tools: [...newTools],
    });
  }

  isPickNull = (callback = () => { }) => {
    if (window.getPickStatus() < 1) {
      this.setState({
        activeTab: null
      })
      return message.info("需先选中模型")
    };
    callback();
  };

  // 需要暴露到window的方法
  setAnmiIcon = (isPause) => {
    const newTools = this.state.tools;
    const newStatus = isPause
      ? {
        type: "play-circle",
        title: "播放",
      }
      : {
        type: "pause-circle",
        title: "暂停",
      };

    this.setState({
      tools: newTools.map((item) => {
        if (item.type === "pause-circle" || item.type === "play-circle") {
          return {
            ...item,
            ...newStatus,
          };
        }
        return item;
      }),
    });
  };

  getCurFrame(CurFrame) {
    const playPercent = (CurFrame / this.totalFrames) * 100;
    this.setState({
      playPercent,
    });
  }
}

class DivBox extends Component {
  static defaultProps = {
    up: {},
    down: {},
    left: {},
    right: {},
    forward: {},
    back: {},
  };
  render() {
    const { up, down, left, right, forward, back } = this.props;

    return (
      <Tooltip title={this.props.title}>
        <div className="box" {...this.props}>
          <div className="up" style={up}></div>
          <div className="down" style={down}></div>
          <div className="left" style={left}></div>
          <div className="right" style={right}></div>
          <div className="forward" style={forward}></div>
          <div className="back" style={back}></div>
        </div>
      </Tooltip>
    );
  }
}
