class Tools {
  static loadScript(url, callback) {
    let old_script = document.getElementById(url);
    if (old_script) {
      if (old_script.ready === true) {
        // console.log("INFO:already load:" + url);
        callback();
        return;
      } else {
        document.body.removeChild(old_script);
        // console.log("INFO:remove an old script that not ready:" + url);
      }
    }
    let script = document.createElement("script");
    script.id = url;
    script.src = url;
    script.onload = script.onreadystatechange = function () {
      if (script.ready) {
        return false;
      }
      if (
        !script.readyState || //这是FF的判断语句，因为ff下没有readyState这个值，IE的readyState肯定有值
        script.readyState === "loaded" ||
        script.readyState === "complete" // 这是IE的判断语句
      ) {
        // console.log("INFO:load:" + url);
        script.ready = true;
        callback();
      }
    };
    document.body.appendChild(script);
  }

  //synchronization
  //同步加载多个脚本
  static syncLoadScripts(scripts, callback) {
    var ok = 0;
    var loadScript = function (url) {
      Tools.loadScript(url, function () {
        ok++;
        // console.log("init:" + url)
        if (ok === scripts.length) {
          callback();
        } else {
          loadScript(scripts[ok].url);
        }
      });
    };
    loadScript(scripts[0].url);
  }

  //asynchronization
  //异步加载多个脚本
  static asyncLoadScripts(scripts, callback) {
    var ok = 0;
    for (var i = 0; i < scripts.length; i++) {
      // eslint-disable-next-line no-loop-func
      Tools.loadScript(scripts[i].url, function () {
        // console.log(scripts[ok]);
        ok++;
        if (ok === scripts.length) {
          callback();
        }
      });
    }
  }
}

export default Tools;
