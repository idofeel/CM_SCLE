import { Button, Upload } from "antd";
import React from "react";
import { connect } from "dva";
import styles from "./IndexPage.css";
import ScleScript from "../components/scleScript";

const { Dragger } = Upload;

const dprops = {
  name: "file",
  multiple: true,
  showUploadList: false,
  beforeUpload(file) {
    TestLocalFile(file);
    return false;
  },
};

function IndexPage(props) {
  return (
    <div className="container">
      <Dragger {...dprops} className={styles.container2}>
        <br />
        <br />
        <br />
        <Button type="primary">测试引入后的按钮样式</Button>
        <p>单击或拖动文件到此区域上载</p>
        <br />
        <br />
        <br />
      </Dragger>
      {/* <input name="测试" type="file" onChange={TestLocalFile} /> */}
      <canvas id="glcanvas" width="800" height="600"></canvas>
      <canvas id="text" width="800" height="600"></canvas>
      <ScleScript />
    </div>
  );
}

var sclereader, localTimeTimeID;
function StartLoadSCLEFile() {
  // 去掉定时器的方法
  window.clearTimeout(localTimeTimeID);

  // 解析cle文件
  // eslint-disable-next-line no-undef
  var bResult = ParseCleStream();
  if (bResult) {
    // alert("An error occurred while transferring the file.");
  }
  // 清除缓存

  // eslint-disable-next-line no-undef
  g_arrayCleBuffer = null;
  // eslint-disable-next-line no-undef
  g_arrayByteBuffer = null;

  delete this.result;
  this.result = null;
  if (sclereader) {
    sclereader = null;
  }

  // 绘制三维模型
  // eslint-disable-next-line no-undef
  startRender();
}
function TestLocalFile(file) {
  // 按字节读取文件内容，结果用ArrayBuffer对象表示
  sclereader = new FileReader();
  sclereader.readAsArrayBuffer(file);

  sclereader.onload = function () {
    // eslint-disable-next-line no-undef
    g_nCleBufferlength = this.result.byteLength;
    // eslint-disable-next-line no-undef
    g_arrayByteBuffer = this.result;
    // eslint-disable-next-line no-undef
    g_arrayCleBuffer = new DataView(this.result, 0, g_nCleBufferlength);

    // 循环执行，每隔0.1秒钟执行一次
    localTimeTimeID = window.setInterval(StartLoadSCLEFile, 100);
  };
}

IndexPage.propTypes = {};

export default connect(({ global }) => global)(IndexPage);
