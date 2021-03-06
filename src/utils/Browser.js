function Browser() {
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    let isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器

    if (userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1) {
        return "IE11";
    };

    if (userAgent.indexOf("Edge") > -1) {
        return 'Edge'
    };
}


function IEVersion() {
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    const IEBrowser = Browser();
    if (IEBrowser === 'IE11') return 11;
    if ('IE' === IEBrowser) {
        let IE = new RegExp("MSIE (\\d+\\.\\d+);");
        IE.test(userAgent);
        let IEV = parseFloat(RegExp["$1"]);
        if (IEV === 7) {
            return 7;
        } else if (IEV === 8) {
            return 8;
        } else if (IEV === 9) {
            return 9;
        } else if (IEV === 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else {
        return false
    }


}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}

function IsPhone() {

    return /(iPhone|iPad|iPod|iOS|Android|ipad)/i.test(navigator.userAgent) || (/(Macintosh)/i.test(navigator.userAgent) && 'ontouchend' in document)
    // if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) || /(Android)/i.test(navigator.userAgent) || /(ipad)/i.test(navigator.userAgent)) {
    //     //alert(navigator.userAgent);  
    //     return true
    // } else {
    //     return false
    // };

}

// // 判断IE浏览器版本
// function IEVersion() {
//     let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
//     let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
//     let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
//     let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
//     if (isIE) {
//         let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
//         reIE.test(userAgent);
//         let fIEVersion = parseFloat(RegExp["$1"]);
//         if (fIEVersion == 7) {
//             return 7;
//         } else if (fIEVersion == 8) {
//             return 8;
//         } else if (fIEVersion == 9) {
//             return 9;
//         } else if (fIEVersion == 10) {
//             return 10;
//         } else {
//             return 6;//IE版本<=7
//         }
//     } else if (isEdge) {
//         return 'Edge';//edge
//     } else if (isIE11) {
//         return 11; //IE11  
//     } else {
//         return -1;//不是ie浏览器
//     }
// }

function fullScreen() {
    var element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

//退出全屏 
function exitFullscreen() {

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

export { IEVersion, IsPC, IsPhone, fullScreen, exitFullscreen }

export default Browser