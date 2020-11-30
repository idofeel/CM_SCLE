/* eslint-disable */

import JSZip from "jszip";
/**
 *
 */
class SCLE_CONTROLLER {
  g_sclehttp = null;
  #g_loaded_pos = 0;
  NetTimeTimeID = null;

  constructor({ onProgress = () => {} }) {
    this.updateProgress = onProgress;
  }
  getByRequest(url) {
    this.g_sclehttp = new XMLHttpRequest();
    this.g_sclehttp.addEventListener("progress", this.updateProgress, false);
    this.g_sclehttp.addEventListener("load", this.transferComplete, false);
    this.g_sclehttp.addEventListener("error", this.transferFailed, false);
    this.g_sclehttp.addEventListener("abort", this.transferCanceled, false);
    this.g_sclehttp.open("GET", url, true); // true 表示异步，false表示同步
    this.g_sclehttp.responseType = "arraybuffer"; // XMLHttpRequest Level 2 规范中新加入了 responseType 属性 ，使得发送和接收二进制数据变得更加容易
    this.g_sclehttp.onreadystatechange = (e) => this.readcleStreamChange(e);
    this.g_sclehttp.send();
    return this;
  }
  // updateProgress(evt) {

  // }
  transferComplete(evt) {}
  transferFailed(evt) {}

  readcleStreamChange(evt) {
    if (this.g_sclehttp.readyState === 4 && this.g_sclehttp.status === 200) {
      // 4 = "loaded" // 200 = OK
      // 兼容写法
      const new_zip = new JSZip();
      new_zip.loadAsync(this.g_sclehttp.response).then((zip) => {
        const key = function () {
          for (let i in zip.files) {
            return i;
          }
        };
        zip.files[key()].async("arraybuffer").then((data) => {
          g_arrayByteBuffer = data;
          g_arrayCleBuffer = new DataView(
            g_arrayByteBuffer,
            0,
            g_arrayByteBuffer.byteLength
          );
          window.g_nCleBufferlength = g_arrayByteBuffer.byteLength;
          // 循环执行，每隔0.1秒钟执行一次
          this.NetTimeTimeID = setInterval(() => {
            this.starLoadNetCLEFile();
          }, 100);
        });
      });
    }
  }

  transferCanceled(evt) {}

  starLoadNetCLEFile() {
    // 去掉定时器的方法
    window.clearTimeout(this.NetTimeTimeID);
    // 解析cle文件
    var bResult = ParseCleStream();
    if (bResult) {
      // alert("An error occurred while transferring the file.");
    }

    // 释放内存
    // console.log(g_sclehttp);
    // g_sclehttp.response = null;
    g_arrayByteBuffer = null;
    g_arrayCleBuffer = null;
    this.g_sclehttp = null;

    // 绘制三维模型
    startRender();

    // let custom = new CustomEvent('cleStreamReady', { detail: {} })
    // window.dispatchEvent(custom)

    var event = document.createEvent("CustomEvent");
    event.initCustomEvent("cleStreamReady", true, true, {detail: {}})
    window.dispatchEvent(event)
    // window.cleStreamReady && cleStreamReady();
  }
}

/**
 * 
 * 
 * 
 * 
 * 
 * 

let g_sclehttp = null,
    g_loaded_pos = 0,
    NetTimeTimeID = null;


const getByRequest = function (url) {
    g_sclehttp = new XMLHttpRequest();
    // 事件件套
    g_sclehttp.addEventListener("progress", updateProgress, false);
    g_sclehttp.addEventListener("load", transferComplete, false);
    g_sclehttp.addEventListener("error", transferFailed, false);
    g_sclehttp.addEventListener("abort", transferCanceled, false);

    g_sclehttp.open("GET", url, true);                                  // true 表示异步，false表示同步
    g_sclehttp.responseType = "arraybuffer";           // XMLHttpRequest Level 2 规范中新加入了 responseType 属性 ，使得发送和接收二进制数据变得更加容易 

    g_sclehttp.onreadystatechange = ReadcleStreamChange;
    g_sclehttp.send();
}


var updateProgress = function (evt) {
    // progress 事件的 lengthComputable 属性存在时，可以计算数据已经传输的比例(loaded 已传输大小，total 总大小）
    if (evt.lengthComputable) {
        //  var percentComplete = evt.loaded / evt.total;
        g_nCleBufferlength = evt.total;
        g_loaded_pos = evt.loaded;
    }
    else {
    }
}

const transferComplete = function (evt) {
    // alert("The transfer is complete.");
}

const transferFailed = function (evt) {
    // alert("下载文件失败！");
}

const transferCanceled = function (evt) {
    // alert("下载已取消！");
}


const ReadcleStreamChange = function () {
    if (g_sclehttp.readyState === 4 && g_sclehttp.status === 200) { // 4 = "loaded" // 200 = OK		
        // 兼容写法
        const new_zip = new JSZip();
        new_zip.loadAsync(g_sclehttp.response).then(function (zip) {
            const key = function () {
                for (let i in zip.files) {
                    return i
                }
            }
            zip.files[key()].async('arraybuffer').then(function (data) {
                g_arrayByteBuffer = data;
                g_arrayCleBuffer = new DataView(g_arrayByteBuffer, 0, g_arrayByteBuffer.byteLength);
                g_nCleBufferlength = g_arrayByteBuffer.byteLength;
                // 循环执行，每隔0.1秒钟执行一次
                NetTimeTimeID = setInterval(StarLoadNetCLEFile, 100);
            });
        });
    }
}


// 解析数据
function StarLoadNetCLEFile() {
    // 去掉定时器的方法
    window.clearTimeout(NetTimeTimeID);

    // 解析cle文件
    var bResult = ParseCleStream()
    if (bResult) {
        // alert("An error occurred while transferring the file.");
    }

    // 释放内存
    console.log(g_sclehttp);
    // g_sclehttp.response = null;
    g_arrayByteBuffer = null;
    g_arrayCleBuffer = null;
    g_sclehttp = null;

    // 绘制三维模型
    startRender && startRender();
    cleStreamReady && cleStreamReady();
}

// const cleStreamReady = function () { } // 


*/

export default SCLE_CONTROLLER;

// export { getByRequest }

/* eslint-disable */
