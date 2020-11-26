import { PureComponent } from "react";
import { Tabs } from "antd";
import "./scleAttrTree.less";

const { TabPane } = Tabs;

export default class ScleAttrTree extends PureComponent {
  render() {
    return (
      <Tabs defaultActiveKey="1" className="scleAttrTree">
        <TabPane tab="模型树" key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="参数" key="2">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    );
  }
}


