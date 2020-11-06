// File: EventActionjs

/**
 * @author wujiali
 */
 
//===================================================================================================

// WebGL Context 全局变量

const canvas = document.querySelector('#glcanvas');
var gl = canvas.getContext('webgl2');
var isWebgl2 = true;
if (!gl) {
    gl = canvas.getContext('webgl')
    if (!gl) {
        gl = canvas.getContext( 'experimental-webgl');
    }
    isWebgl2 = false;
}

var textCanvas = document.querySelector("#text");
var gl2d = textCanvas.getContext("2d");
var container = document.getElementsByClassName("container");
var offsetLeft = container[0].offsetLeft;
var offsetTop = container[0].offsetTop;

var isPhone = false;
var isPhoneMove = false;

var glRunTime = new GLRunTime();

var bgImage = [
    "./Resource/Background/blue.jpg",
    "./Resource/Background/white.jpg",
    "./Resource/Background/grey.jpg",
];

// 键盘交互参数
var isLockCavans = false;
var isShiftDown = false;
// 鼠标交互
var isKeyTap = false;
var lastObjectIndex = -1;
var objectIndex = -1;
// 用户拾取零件的返回参数定义
var pickObjectIndexs = null;        // 选中的零件索引，没选中为null
var pickObjectVisible = false;      // 选中的零件的显隐性，单选表示显隐性，多选无效
var pickObjectTransparent = 0.0;    // 选中的零件的透明度参数，单选表示透明度，多选无效
var pickObjectMaterial = null;      // 选中的零件的材质数据，暂时无定义
// 零件移动
var isMove = false;
// 当前动画帧
const ANIMRUN = 0;
const ANIMPAUSE = 1;
const ANIMEND = 2;
const ANIMTERMINAL = 3;
var animationClock = null;
var animationStatus = ANIMTERMINAL;
var uTotalFrame = 0;
var uCurFrame = 0;
var uSleepTime = 30;
// 时间
var curDate = null;
var lastTime = 0;
// 数字孪生
var isDigitalTwinMode = false;
var initRenderFlag = false;

/**
 * 开始循环渲染
 */
function startRender() {
    if (!gl) {
        return;
    }

    glRunTime.initRender();
    initRenderFlag = true;
    function render() {
        glRunTime.draw();
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    addKeyboardListener();
    addMouseListener(textCanvas);
    document.addEventListener('DOMMouseScroll',fireFoxScollFun,false);
    window.onunload = addCloseListenser;
}

/**
 * 添加键盘响应
 */
function addKeyboardListener() {
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);
}

function onDocumentKeyDown(event) {
    if (isLockCavans) {
        return;
    }
    if (event.ctrlKey) {
        isShiftDown = true;
    } else {
        isShiftDown = false;
        if (event.keyCode == 32) {
            // 空格响应事件
            setFocusOnModel();
        }
    }
}

function onDocumentKeyUp(event) {
    if (isLockCavans) {
        return;
    }
    isShiftDown = false;
}

// 火狐浏览器滚轮事件
function fireFoxScollFun(event) {
    if (isLockCavans) {
        return;
    }
    isKeyTap = false;
    let fScale = 1.0 - event.detail / 25;
    glRunTime.scale(fScale);
    return false;
}

/**
 * 添加鼠标响应事
 */

var lastX1 = -1, lastY1 = -1, lastX2 = -1, lastY2 = -1;
var x1 = -1, y1 = -1, x2 = - 1, y2 = -1;
var touch1 = null, touch2 = null;
var factor = 200.0 / textCanvas.height;
var scaleFactor = 2.0;

function phoneKeyDown(event) {
    isKeyTap = true;
    if (event.targetTouches.length == 1) {
        // 单指
        touch1 = event.targetTouches[0];
        x1 = touch1.clientX - offsetLeft, y1 = touch1.clientY - offsetTop;
        lastX1 = x1, lastY1 = y1;
    }
    else if (event.targetTouches.length == 2) {
        // 双指
        touch1 = event.targetTouches[0], touch2 = event.targetTouches[1];
        lastX1 = touch1.clientX - offsetLeft, lastY1 = touch1.clientY - offsetTop;
        lastX2 = touch2.clientX - offsetLeft, lastY2 = touch2.clientY - offsetTop;
    }
}

function phoneKeyMove(event) {
    if (event.targetTouches.length == 1) {
        touch1 = event.targetTouches[0];
        x1 = touch1.clientX - offsetLeft, y1 = touch1.clientY - offsetTop;
        // 手机端移动零件
        if (isPhone) {
            if (isMove) {
                if (objectIndex != -1) {
                    if (Math.abs(x1 - lastX1) > 2 || Math.abs(y1 - lastY1) > 2) {
                        glRunTime.objectMove(objectIndex, 2 * (x1 - lastX1), -2 * (y1 - lastY1));
                        lastX1 = x1, lastY1 = y1;
                        return;
                    }
                }
            }
        }               
        // 单指滑动：旋转
        if (isKeyTap) {
            if (Math.abs(x1 - lastX1) > 3 || Math.abs(y1 - lastY1) > 3) {
                let degreeX = factor * (x1 - lastX1);
                let degreeY = factor * (y1 - lastY1);
                glRunTime.rotate(degreeX, degreeY, 0);
            }
        }
        lastX1 = x1, lastY1 = y1;
        
    } else if (event.targetTouches.length == 2) {
        // 双指滑动：缩放
        touch1 = event.targetTouches[0], touch2 = event.targetTouches[1];
        x1 = touch1.clientX - offsetLeft, y1 = touch1.clientY - offsetTop;
        x2 = touch2.clientX - offsetLeft, y2 = touch2.clientY - offsetTop;
        let vecX1 = lastX1 - lastX2, vecY1 = lastY1 - lastY2;
        let vecX2 = x1 - x2, vecY2 = y1 - y2;
        // 计算距离
        let mVec1 = Math.sqrt(vecX1*vecX1 + vecY1*vecY1);
        let mVec2 = Math.sqrt(vecX2*vecX2 + vecY2*vecY2);
        // 计算角度
        let seta1 = Math.atan2(lastY2-lastY1, lastX2-lastX1);
        let seta2 = Math.atan2(y2-y1, x2-x1);
        if (Math.abs(seta1-seta2)<=0.01 && Math.abs(mVec2-mVec1)<=5.0) {
            // 距离变化不大，角度变化不大，且同指位移较大，则为平移
            if (Math.abs(x1-lastX1)>5 || Math.abs(y1-lastY1)>5) {
                glRunTime.move(2 * (x1 - lastX1), -2 * (y1 - lastY1));
            }
        } else {
            // 缩放
            let dist1 = Math.pow(Math.pow(lastX1 - lastX2, 2) + Math.pow(lastY1 - lastY2, 2), 0.5);
            let dist2 = Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
            let scale = 0;
            if (dist2 / dist1 > 1.0) {
                scale = dist2 / dist1 * scaleFactor;
            } else {
                scale = dist2 / dist1 / scaleFactor;
            }
            glRunTime.scale(scale);
        }
        lastX1 = x1, lastY1 = y1;
        lastX2 = x2, lastY2 = y2;
    }
}

function phoneKeyUp(event) {
    if (isKeyTap) {
        if (event.targetTouches.length == 1) {
            if (isDigitalTwinMode) {
                return;
            }
            // 单指
            touch1 = event.targetTouches[0];
            x1 = touch1.clientX - offsetLeft, y1 = touch1.clientY - offsetTop;
            objectIndex = glRunTime.pick(x1, y1, true, false);
        }
    }
    isKeyTap = false;
    isPhoneMove = false;
}

var dragLeft = false, dragMid = false, dragRight = false;
var lastX = -1, lastY = -1;

function webKeyDown(event, textCanvas) {
    if (isLockCavans) {
        return;
    }
    isKeyTap = true;
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - offsetLeft, y = event.clientY - offsetTop;
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        lastX = x, lastY = y;
        switch (event.button) {
            case 0:
                // 左键
                dragLeft = true;
                //在textCanvas里屏蔽浏览器右键菜单,不兼容火狐
                textCanvas.oncontextmenu = function () {
                    return false;
                }
                if (isShiftDown) {
                    objectIndex = glRunTime.pick(x, y, false, false);
                }
                break;
            case 1:
                // 中键
                dragMid = true;
                break;
            case 2:
                // 右键
                dragRight = true;
                // 取消控件操作
                isMove = false;
                // 右键测试
                // animTerminal();
                //在textCanvas里屏蔽浏览器右键菜单,不兼容火狐
                textCanvas.oncontextmenu = function () {
                    return false;
                }
                break;
        }
    }
}

function webKeyUp(event, textCanvas) {
    if (isLockCavans) {
        return;
    }
    switch (event.button) {
        case 0:
            dragLeft = false;
            if (isDigitalTwinMode) {
                return;
            }
            if (isKeyTap) {
                if (!isShiftDown) {
                    objectIndex = glRunTime.pick(lastX, lastY, true, false);
                    pickObjectVisible = glRunTime.getObjectVisible(objectIndex);
                    pickObjectTransparent = glRunTime.getObjectTransparent(objectIndex);
                    curDate = new Date();
                    let curTime = curDate.getTime();
                    if (curTime - lastTime < 500 && lastObjectIndex == objectIndex) {
                        setFocusOnModel();
                    }
                    lastTime = curTime;
                    lastObjectIndex = objectIndex;
                } else {
                    objectIndex = glRunTime.pick(lastX, lastY, true, true);
                }
                pickObjectIndexs = glRunTime.getPickObjectIndexs();
                setPickObjectParameters();
            }
            break;
        case 1:
            dragMid = false;
            break;
        case 2:
            dragRight = false;
            break;
    }
    isKeyTap = false;
}

function webWheel(event, textCanvas) {
    if (isLockCavans) {
        return;
    }
    isKeyTap = false;
    let fScale = 1.0 + event.wheelDelta / 1000;
    glRunTime.scale(fScale);

    if (event.preventDefault) {
        // Firefox
        event.preventDefault();
        event.stopPropagation();
    } else {
        // IE
        event.cancelBubble = true;
        event.returnValue = false;
    }
}

function webKeyMove(event, textCanvas) {
    if (isLockCavans) {
        return;
    }
    let x = event.clientX - offsetLeft, y = event.clientY - offsetTop;
    if (isKeyTap) {
        // 在鼠标按下的情况下才能进行视角旋转、模型平移等操作
        if ((!isShiftDown) && dragMid) {
            // 视角旋转
            let factor = 200.0 / textCanvas.height;
            let degreeX = factor * (x - lastX);
            let degreeY = factor * (y - lastY);
            glRunTime.rotate(degreeX, degreeY, 0);
        }

        if (isShiftDown && dragMid) {
            if (!isDigitalTwinMode) {
                //视角平移
                glRunTime.move(2 * (x - lastX), -2 * (y - lastY));
            }
        }

        // shift + 左键拖拽：模型平移
        if (isMove) {
            if (isShiftDown && dragLeft) {
                if (objectIndex > -1) {
                    if (Math.abs(x - lastX) > 2 || Math.abs(y - lastY) > 2) {
                        glRunTime.objectMove(objectIndex, 2 * (x - lastX), -2 * (y - lastY));
                    }
                }
            }
        }
    } else {
        // 鼠标没有按下，但滑动，将操作标注信息
        glRunTime.pickAnnotation(x, y, false);
    }
    
    lastX = x, lastY = y;
}

function addMouseListener(textCanvas) {
    textCanvas.ontouchstart = function (event) {
        phoneKeyDown(event);
    }
        
    textCanvas.ontouchmove = function (event) {
        phoneKeyMove(event);
    }

    textCanvas.ontouchend = function (event) {
        phoneKeyUp(event);
    }

    textCanvas.onmousedown = function (event) {
        webKeyDown(event, textCanvas);
    }

    textCanvas.onmouseup = function (event) {
        webKeyUp(event, textCanvas);
    }

    textCanvas.onmousewheel = function (event) {
        webWheel(event, textCanvas);
    }

    textCanvas.onmousemove = function (event) {
        webKeyMove(event, textCanvas);
    }
}

/**
 * 页面关闭事件
 */
function addCloseListenser() {
    glRunTime.clear();
}

// 窗口变化
window.onresize = canvasOnResize;

// 禁止浏览器滚轮默认行为
document.onmousewheel = function (event) {
    if (event.preventDefault) {
        // Firefox
        event.preventDefault();
        event.stopPropagation();
    } else {
        // IE
        event.cancelBubble = true;
        event.returnValue = false;
    }
    return false;
}

/**
 * 响应页面控件
 */

// 零件移动
function moveModel() {
    // 手机端
    if (isPhone) {
        if (isMove) {
            isMove = false;
        } else {
            isMove = true;
        }
    }
    // PC端
    isMove = true;
}

// 材质设置
function setMaterial(selectIndex) {
    switch (selectIndex) {
        case 0:
            glRunTime.setObjectMaterial(0.5, 1.0, 0.0, 0.5);
            break;
        case 1:
            glRunTime.setObjectMaterial(0.25, 0.87, 0.8, 0.5);
            break;
        case 2:
            glRunTime.setObjectMaterial(1.0, 1.0, 0.0, 0.5);
            break;
        case 3:
            glRunTime.setObjectMaterial(1.0, 0.75, 0.8, 0.5);
            break;
        default:
            break;
    }
}
/**
 * 
 * @param {*} r 红色分量0.0-1.0
 * @param {*} g 绿色分量0.0-1.0
 * @param {*} b 蓝色分量0.0-1.0
 * @param {*} a 透明度分量0.0-1.0
 */
function setMaterialRGBA(r, g, b, a) {
    glRunTime.setObjectMaterial(r, g, b, a);
}

// 透明度设置
function setTransparentIndex(selectIndex) {
    switch (selectIndex) {
        case 0:
            glRunTime.setObjectTransparent(0.0);
            break;
        case 1:
            glRunTime.setObjectTransparent(0.5);
            break;
        case 2:
            glRunTime.setObjectTransparent(1.0);
            break;
        default:
            break;
    }
}
/**
 * 
 * @param {*} alpha 0.0-1.0之间
 */
function setTransparent(alpha) {
    glRunTime.setObjectTransparent(alpha);
}

// 模型隐藏
function setVisible(isVisible) {
    glRunTime.setObjectVisible(isVisible);
}

// 视图切换
function setView(selectIndex) {
    glRunTime.shiftView(selectIndex);
}

// 复位
function setHome() {
    glRunTime.home();
}

// 开始动画、继续动画
function setAnimationStart() {
    uTotalFrame = glRunTime.getTotalFrame();
    isLockCavans = true;
    if (animationStatus == ANIMTERMINAL) {
        setHome();
    }
    if (uCurFrame >= uTotalFrame) {
        uCurFrame = 0;
    }
    animationStatus = ANIMRUN;
    animRun();
}
// 执行动画循环
function animRun() {
    if (glRunTime.setCameraAnim(uCurFrame)) {
        glRunTime.setObjectAnim(uCurFrame);
        glRunTime.setAnnotationAnim(uCurFrame);
        getCurFrame(uCurFrame);
        uCurFrame++;
        animationClock = setTimeout("animRun()", uSleepTime);
    } else {
        animPause();
        animationStatus = ANIMEND;
        setAnmiIcon(true);
    }
}
// 暂停
function animPause() {
    if (animationClock != null) {
        clearTimeout(animationClock);
    }
    animationClock = null;
    isLockCavans = false;
    animationStatus = ANIMPAUSE;
}
// 终止
function animTerminal() {
    uCurFrame = 0;
    getCurFrame(uCurFrame);
    if (glRunTime.setCameraAnim(uCurFrame)) {
        glRunTime.setObjectAnim(uCurFrame);
        glRunTime.setAnnotationAnim(uCurFrame);
    }
    animPause();
    animationStatus = ANIMTERMINAL;
}
// 设置当前帧
function setCurFrame(frame) {
    if (frame >= 0) {
        uCurFrame = frame;
        if (glRunTime.setCameraAnim(uCurFrame)) {
            glRunTime.setObjectAnim(uCurFrame);
            glRunTime.setAnnotationAnim(uCurFrame);
        }
        animPause();
        setAnmiIcon(true);
        // if (animationStatus == ANIMPAUSE) {
        //     if (glRunTime.setCameraAnim(uCurFrame)) {
        //         glRunTime.setObjectAnim(uCurFrame);
        //     }
        // } else if (animationStatus == ANIMEND) {
        //     animationStatus = ANIMRUN;
        //     setAnmiIcon(false);
        //     animRun();
        // }
    }
}
// 获取动画总帧数
function getTotalFrames() {
    return glRunTime.getTotalFrame();
}
// 获取当前帧数
function getCurFrame(frame) {

}
/**
 * 设置暂停/继续图标状态
 * @param {*} isPause true表示需要设置成暂停态，false表示要设置成继续态
 */
function setAnmiIcon(isPause) {

}

// 设置背景图片
function setBackground(selectIndex) {
    glRunTime.setBackground(selectIndex);
}

// 空格：视角聚焦到选中零件，模型整体围绕所选零件旋转
// 如果未选中零件或装配体，则默认聚焦到模型整体
function setFocusOnModel() {
        glRunTime.setFocusOnObject();
}

// 模型树节点选择
// 如果indexs == null或者indexs.length==0，清空当前选择
function pickModelByIndex(indexs) {
    objectIndex = glRunTime.pickModelByIndexs(indexs);
    pickObjectIndexs = glRunTime.getPickObjectIndexs();
    if (indexs.length == 1) {
        pickObjectVisible = glRunTime.getObjectVisible(indexs[0]);
        pickObjectTransparent = glRunTime.getObjectTransparent(indexs[0]);
    }
    // setPickObjectParameters();
    if (isPhone) {
        setFocusOnModel();
    }
}

// 模型树节点隐藏
function setModelVisible(indexs, isVisible) {
    glRunTime.setMultObjectVisible(indexs, isVisible);
}

// 窗口大小改变
function canvasOnResize() {
    gl.canvas.width = gl.canvas.clientWidth;
    gl.canvas.height = gl.canvas.clientHeight;

    if (initRenderFlag) {
        glRunTime.resetWindow(gl.canvas.clientWidth, gl.canvas.clientHeight);
    }

    gl2d.canvas.width = gl2d.canvas.clientWidth;
    gl2d.canvas.height = gl2d.canvas.clientHeight;
}

// 获取拾取状态
// 返回值：0 表示没选中， 1 表示单选中， 2 表示多选中
function getPickStatus() {
    return glRunTime.getPickStatus();
}

// 获取选中的零件的数据，包括：所选零件索引、显隐性、透明度等
// 更新界面
function setPickObjectParameters() {
    // console.log(pickObjectIndexs.length + ", " + pickObjectVisible + ", " + pickObjectTransparent);
}


// 开启数字孪生模式
function digitalTwinStart() {
    isDigitalTwinMode = true;
    glRunTime.initDigitalTwinData();
}

// 退出数字孪生模式
function digitalTwinTerminal() {
    isDigitalTwinMode = false;
}

/**
 * 数字孪生接口
 * 通过物件ID设置物件矩阵
 * @param {*} uObjectID 物件ID
 * @param {*} strMatrix ADF_BASEMATRIX矩阵
 */
function setObjectOriWorldMatrix(uObjectID, strMatrix) {
    // 关闭其余按钮和模型拾取功能那个，只允许用户进行视角变换和缩放
    if (!isDigitalTwinMode) {
        return;
    }
    glRunTime.setObjectOriWorldMatrix(uObjectID, strMatrix);
}

// 临时绘制动画接口
var g_nAnimationStart = 0;
var g_nAnimationEnd = 0;
function PlaySceneAnimation() {
    isLockCavans = true;
    if (animationStatus == ANIMTERMINAL) {
        setHome();
    }
    uCurFrame = g_nAnimationStart;
    if (uCurFrame >= g_nAnimationEnd) {
        uCurFrame = g_nAnimationStart;
    }
    animationStatus = ANIMRUN;
    animSceneRun();
}

// 临时动画循环
function animSceneRun() {
    if (glRunTime.setCameraAnim(uCurFrame) && uCurFrame <= g_nAnimationEnd) {
        glRunTime.setObjectAnim(uCurFrame);
        glRunTime.setAnnotationAnim(uCurFrame);
        getCurFrame(uCurFrame);
        uCurFrame++;
        animationClock = setTimeout("animSceneRun()", uSleepTime);
    } else {
        animPause();
        animationStatus = ANIMEND;
        setAnmiIcon(true);
    }
}