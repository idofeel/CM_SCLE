// File: EventActionjs

/**
 * @author wujiali
 */

//===================================================================================================

// WebGL Context 全局变量
var g_nEventVersion = 2;
var g_bTestMode = true;

const canvas = document.querySelector('#glcanvas');
var gl = canvas.getContext('webgl2');
var isWebgl2 = true;
if (!gl) {
    gl = canvas.getContext('webgl')
    if (!gl) {
        gl = canvas.getContext('experimental-webgl');
    }
    isWebgl2 = false;
}

var textCanvas = document.querySelector("#text");
var gl2d = textCanvas.getContext("2d");
var container = document.getElementsByClassName("container");
var offsetLeft = container[0].offsetLeft;
var offsetTop = container[0].offsetTop;

var isPhone = false;

var glRunTime = new GLRunTime();

var g_resFoder = "./Resource/Background/";
var g_bgImage = ["blue.jpg", "white.jpg", "grey.jpg"];
var test_download_xml = "./Resource/111.xml";
// var test_upload_xml = "../../lab/index.php?contentid=202105172230wjl&filesize=60";
var test_upload_xml = "../../lab/index.php";
// contentid=202105172230wjl&filesize=60




var test_note = new GL_USRANNOTATION();

// 键盘交互参数
var isLockCavans = false;
var isShiftDown = false;
// 鼠标交互
var lastObjectIndex = -1;
var objectIndex = -1;
// 用户拾取零件的返回参数定义
var pickObjectIndexs = null;        // 选中的零件索引，没选中为null
var pickObjectVisible = false;      // 选中的零件的显隐性，单选表示显隐性，多选无效
var pickObjectTransparent = 0.0;    // 选中的零件的透明度参数，单选表示透明度，多选无效
var pickObjectMaterial = null;      // 选中的零件的材质数据，暂时无定义
// 零件移动
var isMove = false;
// 时间
var curDate = null;
var lastTime = 0;
var curTime = 0;
// 数字孪生模式标志，该模式下仅允许模型缩放和视角操作
var isDigitalTwinMode = false;
// 模型是否开始渲染标志
var initRenderFlag = false;
// 设置拾取显示效果
var isMultPick = false;
// 设置鼠标动态捕捉物件id
var isMotionCapture = false;
var motionCaptureObjID = null;
// 渲染循环句柄
var handle2D = null;
var handle3D = null;
// 用户添加注释
var isUsrCommentFlag = false;
var isSingleComment = false;
var isShowUsrComment = true;
var isShowScleComment = true;
var g_xmlDoc = null;
var g_xmlHttp = null;
var g_isXmlDocLoaded = false;

function render3D() {
    glRunTime.draw3D();
    handle3D = requestAnimationFrame(render3D);
}

function render2D() {
    glRunTime.draw2D();
    OnUpdateUICallBack();
    handle2D = requestAnimationFrame(render2D);
}

/**
 * 开始循环渲染
 */
function startRender() {
    if (!gl) {
        return;
    }

    initRenderFlag = true;
    // requestAnimationFrame(render3D);
    // requestAnimationFrame(render2D);
    if (handle3D == null) {
        glRunTime.initRender();
        render3D();
    } else {
        glRunTime.reset();
    }

    if (handle2D == null) {
        render2D();
    }

    addKeyboardListener();
    addMouseListener(textCanvas);
    document.addEventListener('DOMMouseScroll', fireFoxScollFun, false);
    window.onunload = addCloseListenser;
    window.onresize = canvasOnResize;
}

/* 通用浏览器设置 */
// 禁止浏览器默认行为
function stopDefault(event) {
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

// 火狐浏览器滚轮事件
function fireFoxScollFun(event) {
    if (isLockCavans) {
        return;
    }
    if (isPhone) {
        return;
    }
    isKeyTap = false;
    let fScale = 1.0 - event.detail / 25;
    glRunTime.scale(fScale);
    return false;
}

/* 键盘响应事件 */
function addKeyboardListener() {
    if (isPhone) {
        return;
    }
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);
}

function onDocumentKeyDown(event) {
    if (isLockCavans) {
        return;
    }
    if (event.ctrlKey) {
        isShiftDown = true;
        isMultPick = true;
    } else {
        isShiftDown = false;
        isMultPick = false;
        if (event.keyCode == 32) {
            // 空格响应事件
            // setFocusOnModel();
            // setUsrCommentMode(1, 1);
            // glRunTime.createCommentBegin();
            uploadXmlCommentToCloud(test_upload_xml);
            // syncXmlCommentFromCloud(test_download_xml);
        }
    }

    if (g_nEventVersion == 3) {
        CMOnKeyboardDownCallBack(event);
    }
}

function onDocumentKeyUp(event) {
    if (isLockCavans) {
        return;
    }
    isShiftDown = false;
    isMultPick = false;

    if (g_nEventVersion == 3) {
        CMOnKeyboardUpCallBack(event);
    }
}

/* 手机或平板等终端web浏览器触摸交互事件 */
var lastX1 = -1, lastY1 = -1, lastX2 = -1, lastY2 = -1;
var x1 = -1, y1 = -1, x2 = - 1, y2 = -1;
var touch1 = null, touch2 = null;
var phoneFactor = 400.0 / textCanvas.height;
var scaleFactor = 1.2;
var moveSensitivity = 1;
var rotateSensitivity = 1;
var zRotateSensitive = 0.03;
var cameraMoveSensitivity = 3;
var scaleSensitivity = 0.1;
var doubleClickTimeMS = 300;
var isKeyDown = false;
var isKeyMove = false;
var isKeyRotate = false;
var isKeyScale = false;
var nullPickIndexs = [-1];

function phoneKeyDown(event) {
    if (isLockCavans) {
        return;
    }
    isKeyDown = true;
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
    if (isLockCavans) {
        return;
    }
    if (!isKeyDown) {
        return;
    }
    if (event.targetTouches.length == 1) {
        touch1 = event.targetTouches[0];
        x1 = touch1.clientX - offsetLeft, y1 = touch1.clientY - offsetTop;
        // 移动零件
        if (isMove) {
            if (objectIndex != -1) {
                if (Math.abs(x1 - lastX1) > moveSensitivity || Math.abs(y1 - lastY1) > moveSensitivity) {
                    glRunTime.objectMove(objectIndex, 2 * (x1 - lastX1), -2 * (y1 - lastY1));
                    lastX1 = x1, lastY1 = y1;
                    isKeyMove = true;
                }
            }
        } else {
            // 旋转
            if (Math.abs(x1 - lastX1) > rotateSensitivity || Math.abs(y1 - lastY1) > rotateSensitivity) {
                let degreeX = phoneFactor * (x1 - lastX1);
                let degreeY = phoneFactor * (y1 - lastY1);
                glRunTime.rotate(degreeX, degreeY, 0);
                isKeyRotate = true;
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
        let mVec1 = Math.sqrt(vecX1 * vecX1 + vecY1 * vecY1);
        let mVec2 = Math.sqrt(vecX2 * vecX2 + vecY2 * vecY2);
        // 计算角度
        let seta1 = Math.atan2(lastY2 - lastY1, lastX2 - lastX1);
        let seta2 = Math.atan2(y2 - y1, x2 - x1);
        if (Math.abs(seta1 - seta2) <= zRotateSensitive && Math.abs(mVec2 - mVec1) <= cameraMoveSensitivity) {
            // 距离变化不大，角度变化不大，且同指位移较大，则为平移
            if ((Math.abs(x1 - lastX1) > moveSensitivity || Math.abs(y1 - lastY1) > moveSensitivity) &&
                ((x1 - lastX1) * (x2 - lastX2) > 0)) {
                glRunTime.move(2 * (x1 - lastX1), -2 * (y1 - lastY1));
                isKeyMove = true;
            }
        }
        // else if (Math.abs(seta1-seta2)>zRotateSensitive) {
        //     // 距离变化不大，角度变化大，且同指位移较大，则为Z向旋转
        //     let angleZ = (seta2 - seta1) * 180 / Math.PI;
        //     if (Math.abs(seta1-seta2)>1.0) {
        //         let DetaSeta = Math.PI*2 - Math.abs(seta1) - Math.abs(seta2);
        //         if (seta2 < 0)
        //             angleZ = (-DetaSeta*180/Math.PI);
        //         else
        //             angleZ = (DetaSeta*180/Math.PI);
        //     }
        //     glRunTime.rotate(0, 0, -angleZ);
        //     isKeyRotate = true;
        // }
        else {
            // 缩放
            let dist1 = Math.pow(Math.pow(lastX1 - lastX2, 2) + Math.pow(lastY1 - lastY2, 2), 0.5);
            let dist2 = Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
            let scale = 0;
            if (dist2 / dist1 > 1.0) {
                scale = dist2 / dist1 * scaleFactor;
            } else {
                scale = dist2 / dist1 / scaleFactor;
            }
            if (Math.abs(scale - 1.0) >= scaleSensitivity) {
                glRunTime.scale(scale);
                isKeyScale = true;
            }
        }
        lastX1 = x1, lastY1 = y1;
        lastX2 = x2, lastY2 = y2;
    }
}

function phoneKeyUp(event) {
    if (isLockCavans) {
        return;
    }

    if (isKeyDown && !isKeyMove && !isKeyRotate && !isKeyScale) {
        // 单指
        touch1 = event.changedTouches[0];
        x1 = touch1.clientX - offsetLeft, y1 = touch1.clientY - offsetTop;
        objectIndex = glRunTime.pick(x1, y1, isMultPick, true);
        pickObjectVisible = glRunTime.getObjectVisible(objectIndex);
        pickObjectTransparent = glRunTime.getObjectTransparent(objectIndex);
        curDate = new Date();
        curTime = curDate.getTime();
        if (curTime - lastTime < doubleClickTimeMS && lastObjectIndex == objectIndex) {
            setFocusOnModel();
        }
        lastTime = curTime;
        lastObjectIndex = objectIndex;
        lastX1 = x1, lastY1 = y1;
        // 回调上层界面
        pickObjectIndexs = glRunTime.getPickObjectIndexs();
        setPickObjectParameters();
    }

    isKeyDown = false; isKeyMove = false; isKeyRotate = false; isKeyScale = false;
}

/* PC端web浏览器鼠标交互事件 */
var isKeyTap = false;
var webFactor = 200.0 / textCanvas.height;
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
                    objectIndex = glRunTime.pick(x, y, isMultPick, false);
                }
                break;
            case 1:
                // 中键
                dragMid = true;
                break;
            case 2:
                // 右键
                dragRight = true;
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
            if (isKeyTap) {
                if (isUsrCommentFlag && isSingleComment) {
                    addSingleComment(lastX, lastY, test_note);
                } else if (isUsrCommentFlag) {
                    glRunTime.createCommentUpdate(lastX, lastY);
                    break;
                }

                objectIndex = glRunTime.pick(lastX, lastY, isMultPick, true);
                if (isMove || isMultPick) {
                    break;
                }

                pickObjectVisible = glRunTime.getObjectVisible(objectIndex);
                pickObjectTransparent = glRunTime.getObjectTransparent(objectIndex);
                pickObjectIndexs = glRunTime.getPickObjectIndexs();
                curDate = new Date();
                curTime = curDate.getTime();
                if (curTime - lastTime < doubleClickTimeMS && lastObjectIndex == objectIndex) {
                    setFocusOnModel();
                }
                lastTime = curTime;
                lastObjectIndex = objectIndex;
                setPickObjectParameters();
            }
            break;
        case 1:
            dragMid = false;
            if (isUsrCommentFlag) {
                glRunTime.createCommentFinal(lastX, lastY, test_note);
                break;
            }
            break;
        case 2:
            dragRight = false;
            if (isUsrCommentFlag) {
                glRunTime.createCommentCancel();
                break;
            }
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

    stopDefault(event);
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
            let degreeX = webFactor * (x - lastX);
            let degreeY = webFactor * (y - lastY);
            glRunTime.rotate(degreeX, degreeY, 0);
        }

        if (isShiftDown && dragMid) {
            //视角平移
            glRunTime.move(2 * (x - lastX), -2 * (y - lastY));
        }

        if (isShiftDown && dragLeft) {
            // shift + 左键拖拽：模型平移
            if (isMove) {
                if (objectIndex > -1) {
                    if (Math.abs(x - lastX) > moveSensitivity || Math.abs(y - lastY) > moveSensitivity) {
                        glRunTime.objectMove(objectIndex, 2 * (x - lastX), -2 * (y - lastY));
                    }
                }
            }
        }
    } else {
        // 鼠标没有按下，但滑动，将操作标注信息
        if (glRunTime.pickAnnotation(x, y, false) > -1) {
            if (isMotionCapture) {
                motionCaptureObjID = glRunTime.getPickObjectIdByIndex(glRunTime.pick(x, y, false, false));
            }
        }
    }

    // 创建批注状态时，捕获鼠标位置
    if (isUsrCommentFlag) {
        glRunTime.runtimeMouseX = x;
        glRunTime.runtimeMouseY = y;
    }

    lastX = x, lastY = y;
}

/**
 * 添加鼠标或触摸事件监听
 * @param {*} textCanvas 顶层画布
 */
function addMouseListener(textCanvas) {
    if (isPhone) {
        textCanvas.ontouchstart = function (event) {
            phoneKeyDown(event);
            stopDefault(event);
            if (g_nEventVersion == 3) {
                CMOnTouchStartCallBack(event);
            }
        }

        textCanvas.ontouchmove = function (event) {
            phoneKeyMove(event);
            if (g_nEventVersion == 3) {
                CMOnTouchMoveCallBack(event);
            }
        }

        textCanvas.ontouchend = function (event) {
            phoneKeyUp(event);
            if (g_nEventVersion == 3) {
                CMOnTouchEndCallBack(event);
            }
        }
    } else {
        textCanvas.onmousedown = function (event) {
            webKeyDown(event, textCanvas);
            if (g_nEventVersion == 3) {
                CMOnMouseDownCallBack(event);
            }
        }

        textCanvas.onmouseup = function (event) {
            webKeyUp(event, textCanvas);
            if (g_nEventVersion == 3) {
                CMOnMouseUpCallBack(event);
            }
        }

        textCanvas.onmousewheel = function (event) {
            webWheel(event, textCanvas);
            if (g_nEventVersion == 3) {
                CMOnMouseWheelCallBack(event);
            }
        }

        textCanvas.onmousemove = function (event) {
            webKeyMove(event, textCanvas);
            if (g_nEventVersion == 3) {
                CMOnMouseMoveCallBack(event);
            }
        }
    }
}

/**
 * 页面关闭事件
 */
function addCloseListenser() {
    glRunTime.uninitRender();
}

// 禁止浏览器滚轮默认行为
document.onmousewheel = function (event) {
    stopDefault(event);
    return false;
}

/**
 * 响应页面控件
 */

// 零件移动
function moveModel() {
    if (isMove) {
        isMove = false;
    } else {
        isMove = true;
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
    if (r < 0.0 || r > 1.0 || g < 0.0 || g > 1.0 ||
        b < 0.0 || b > 1.0 || a < 0.0 || a > 1.0) {
        return;
    }
    glRunTime.setObjectMaterial(r, g, b, a);
}

/**
 * 
 * @param {*} alpha 0.0-1.0之间
 */
function setTransparent(alpha) {
    if (alpha < 0.0 || alpha > 1.0) {
        return;
    }
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

// 动画相关参数
const ANIMRUN = 0;
const ANIMPAUSE = 1;
const ANIMEND = 2;
const ANIMTERMINAL = 3;
var animationClock = null;
var animationStatus = ANIMTERMINAL;
var uTotalFrame = 0;
var uCurFrame = 0;
var uSleepTime = 40;

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

// 场景动画接口
var g_nAnimationStart = 0;
var g_nAnimationEnd = 0;
function PlaySceneAnimation() {
    animTerminal(); // 初始状态
    isLockCavans = true;
    uCurFrame = g_nAnimationStart;
    if (uCurFrame >= g_nAnimationEnd) {
        uCurFrame = g_nAnimationStart;
    }
    animationStatus = ANIMRUN;
    animSceneRun();
}

// 场景动画循环
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
    }
}
// 获取动画总帧数
function getTotalFrames() {
    return glRunTime.getTotalFrame();
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
    offsetLeft = container[0].offsetLeft;
    offsetTop = container[0].offsetTop;

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

// 添加注释信息
// 只能对单个object添加
function addComment(objectID, annoText) {
    glRunTime.addCommentOnObjectById(objectID, annoText);
}

// 用户添加批注开关
// flag: 1表示开始批注，0表示结束
// type: 0表示单引脚批注类型，1表示多引脚批注类型
function setUsrCommentMode(flag, type) {
    if (flag == 1) {
        glRunTime.setBoxShow(false);
        isUsrCommentFlag = true;
        isMultPick = true;
        if (type == 0) {
            isSingleComment = true;
        }
    } else {
        glRunTime.setBoxShow(true);
        isUsrCommentFlag = false;
        isMultPick = false;
        isSingleComment = false;
    }
    glRunTime.pickModelByIDs(null);
}

function addSingleComment(x, y, commentInfo) {
    glRunTime.createCommentBegin();
    if (glRunTime.createCommentUpdate(x, y) != true) {
        return;
    }
    glRunTime.createCommentFinal(x, y - 30, commentInfo);
}

// 编辑批注数据确认
function setUsrCommentFinal(x, y, commentInfo) {
    glRunTime.createCommentFinal(x, y, commentInfo);
}

// 读取XML 文件
function uploadXmlLocal(e) {
    if (!e.target.files[0]) return
    // 读取本地xml文件
    var reader = new FileReader()
    reader.readAsText(e.target.files[0])
    reader.onloadend = function () {
        var xmlDoc = cvtToXMLDOM(this.result)
        if (xmlDoc != null) {
            glRunTime.importXmlComment(xmlDoc);
        }
    }
}

function cvtToXMLDOM(xmlStr) {
    var xmlDoc = null
    if (window.ActiveXObject) {
        xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM')
        if (xmlDoc) {
            xmlDoc.async = false
            xmlDoc.loadXML(xmlStr)
        }
    } else if (
        document.implementation &&
        document.implementation.createDocument &&
        DOMParser
    ) {
        xmlDoc = document.implementation.createDocument('', '', null)
        var parser = new DOMParser()
        xmlDoc = parser.parseFromString(xmlStr, 'text/xml')
    }
    return xmlDoc
}

function getXMLDOM() {
    var xmlDoc = null
    if (window.ActiveXObject) {
        // Internet Explorer
        xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM')
    } else if (
        document.implementation &&
        document.implementation.createDocument) {
        // Firefox, Mozilla, Opera
        xmlDoc = document.implementation.createDocument('', '', null)
    }
    return xmlDoc
}

function getXMLHTTP() {
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

function syncXmlCommentFromCloud(url) {
    g_xmlDoc = getXMLDOM();

    try {
        g_xmlDoc.async = "false";
        g_xmlDoc.load(url);
    } catch (e) {
        // Chrome
        g_xmlHttp = new window.XMLHttpRequest();
        g_xmlHttp.open("GET", url, false);
        g_xmlHttp.send(null);
        g_xmlDoc = g_xmlHttp.responseXML.documentElement;
    }

    if (g_xmlDoc != null) {
        glRunTime.importXmlComment(g_xmlDoc);
    }
}

function uploadXmlCommentToCloud(url) {
    g_xmlDoc = getXMLDOM();
    if (g_xmlDoc != null) {
        g_xmlDoc = glRunTime.exportXmlComment(g_xmlDoc);
    }



    var xml = new XMLSerializer().serializeToString(g_xmlDoc)

    // 将xml 转 blob
    var blob = new Blob([xml], { type: "text/xml" });
    // blob 转 File
    var file = new File([blob], "fileName.xml");
    // 使用formData将File包装，进行上传
    var formData = new FormData();

    formData.append("file", file);
    formData.append("filesize", file.size);
    formData.append("contentid", '202105172230wjl');


    console.log('g_xmlDoc', g_xmlDoc);




    g_xmlHttp = getXMLHTTP();
    if (g_xmlHttp != null) {
        g_xmlHttp.open("post", url, true);
        g_xmlHttp.send(formData);
    }
}

function success()//异步处理函数，当服务成功返回时
{
    if (g_xmlHttp.readyState == 4) {
        alert(g_xmlHttp.status);
        if (g_xmlHttp.status == 200) {
            alert(g_xmlHttp.responseText);
        } else {
            alert("test error");
        }
    }
}

// 高亮objects
function setObjectsHighlight(objectIDs) {
    glRunTime.setObjectsPickedByIds(objectIDs);
}

// 计算objects的包围盒中心点
// 输入：objectIDs 数组
// 输出：center2Ds 数组 在画布上的二维坐标点，数据类型Point2(x, y)
// 如果某个ID计算失败则对应的数组元素为null
function getObjectsCenter(objectIDs) {
    let arrCenters = new Array();
    for (let i = 0; i < objectIDs.length; ++i) {
        arrCenters.push(glRunTime.getObjectCenterById(objectIDs[i]));
    }
    return arrCenters;
}

// 回调函数，刷新界面
function OnUpdateUICallBack() {
    if (g_nEventVersion == 2) {
        Scle.refreshNotation();
    }
    else if (g_nEventVersion == 3) {
        CMOnUpdateUICallBack();
    }
}

// 回调函数，动画每播放一帧时回调
function getCurFrame(frame) {
    if (g_nEventVersion == 3) {
        CMOnAnimRefreshCallBack(frame);
    }
}

// 回调函数，当动画播放完毕时回调
function setAnmiIcon(isPause) {
    if (g_nEventVersion == 3) {
        CMOnAnimFinishCallBack(isPause);
    }
}
