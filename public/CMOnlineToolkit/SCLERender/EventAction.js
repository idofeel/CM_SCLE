// File: EventActionjs

/**
 * @author wujiali
 */

//===================================================================================================
// 模块对外接口

function CALLBACK_V2() {
    // 刷新场景事件文本框动态坐标
    this.refreshNotation = function() {}
    // 初始化文本框UI
    this.init = function(dom) {}
    // 刷新批注文本框
    this.showCommentInput = function(option) {}
    // 批注文本框修改提交事件
    this.commentOnSubmit = function(event, newOpion, item, index) {}
    // 批注文本框正在修改事件
    this.commentOnChange = function(event, newOpion, item, index) {}
    // 批注被单击事件
    this.commentOnClick = function(event, newOpion, item, index) {}
    // 批注被删除事件
    this.deleteCommentInput = function() {}
    // 批注被用户拖动修改位置
    this.moveCommentInput = function(event, newOpion, item, index) {}
}

function CALLBACK_V3() {
    // 回调函数，刷新界面
    this.CMOnUpdateUICallBack = function() {}
    // 回调函数，使用当前帧数刷新进度条
    this.CMOnAnimRefreshCallBack = function(frame) {}
    // 回调函数，设置暂停/继续图标状态，当动画播放完毕时自动设置成暂停状态
    this.CMOnAnimFinishCallBack = function(isPause) {}
    // 回调函数，键盘按下事件，发生在CMOnline已经执行内部事件之后
    this.CMOnKeyboardDownCallBack = function(event) {}
    // 回调函数，键盘抬起事件，发生在CMOnline已经执行内部事件之后
    this.CMOnKeyboardUpCallBack = function(event) {}
    // 回调函数，鼠标按下事件，发生在CMOnline已经执行内部事件之后
    this.CMOnMouseDownCallBack = function(event) {}
    // 回调函数，鼠标抬起事件，发生在CMOnline已经执行内部事件之后
    this.CMOnMouseUpCallBack = function(event) {}
    // 回调函数，鼠标拖拽事件，发生在CMOnline已经执行内部事件之后
    this.CMOnMouseMoveCallBack = function(event) {}
    // 回调函数，鼠标滚轮事件，发生在CMOnline已经执行内部事件之后
    this.CMOnMouseWheelCallBack = function(event) {}
    // 回调函数，手机触屏按下事件，发生在CMOnline已经执行内部事件之后
    this.CMOnTouchStartCallBack = function(event) {}
    // 回调函数，手机触屏滑动事件，发生在CMOnline已经执行内部事件之后
    this.CMOnTouchMoveCallBack = function(event) {}
    // 回调函数，手机触屏抬起事件，发生在CMOnline已经执行内部事件之后
    this.CMOnTouchEndCallBack = function(event) {}
    // 回调函数, 摄像机变化, 发生在视图矩阵变化之后
    this.CMOnCameraChangeCallback = function() {}
    // 回调函数，模型加载完毕
    this.CMOnLoadModelEndCallback = function() {}
    // 回调函数，剖切执行过程，更新剖切参数
    this.CMOnSectionUpdateCallback = function() {}
    // 回调函数，剖切执行完成
    this.CMOnSectionFinishCallback = function() {}
}

//===================================================================================================

// WebGL Context 全局变量

var container = null;
var web3dCanvas = null;
var gl = null;
var isWebgl2 = true;
var text2dCanvas = null;
var gl2d = null;
var callback_v2 = new CALLBACK_V2();
var callback_v3 = new CALLBACK_V3();

var g_nEventVersion = 2;
var g_bTestMode = true;
var isPhone = /(iPhone|iPad|iPod|iOS|Android|ipad)/i.test(navigator.userAgent) || (/(Macintosh)/i.test(navigator.userAgent) && 'ontouchend' in document);

var g_resFoder = "./CMOnlineToolkit/Resource/Background/";
var g_bgImage = ["blue.jpg", "white.jpg", "grey.jpg"];
var g_bgImageUrl = [];
var g_bgImageIndex = 0;
var test_note = new GL_USRANNOTATION();
var g_sceneLightOn = true;
var g_sceneGeomtryOn = true;
var g_canvasTransparency = false;

var glRunTime = new GLRunTime();

// 键盘交互参数
var isLockCavans = false;
var isShiftDown = false;
// 鼠标交互
var lastObjectIndex = -1;
var objectIndex = -1;
var g_operationMode = MOUSE_OPERATION_MODE_DEFAULT;
// 用户拾取零件的返回参数定义
var pickObjectIndexs = null;        // 选中的零件索引，没选中为null
var pickObjectVisible = false;      // 选中的零件的显隐性，单选表示显隐性，多选无效
var pickObjectTransparent = 0.0;    // 选中的零件的透明度参数，单选表示透明度，多选无效
var pickObjectMaterial = null;      // 选中的零件的材质数据，暂时无定义
var pickObjectID = null;            // 选中的零件的ID
var pickObjectName = null;          // 选中的零件的名称
var pickObjectParams = null;        // 选中的零件的参数数据

// 零件移动
var isMove = false;
var moveObjectIndex = -1;
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
var usrCommentRight = 1;
var usrCommentName = "unkown";
var isUsrCommentFlag = false;
var isUsrCommInputShow = false;
var isSingleComment = false;
var g_isXmlDocLoaded = false;
var g_usrCommOption = {data: [], show: true};
var pickedCommentIndex = -1;
// 处理页面滚动坐标原点变化
var scrollLeft = 0;
var scrollTop = 0;
var originPt = new Point2(0, 0);
// 框选
var selRect = new Rect2D(0, 0, 0, 0);

/* 手机或平板等终端web浏览器触摸交互事件 */
var lastX1 = -1, lastY1 = -1, lastX2 = -1, lastY2 = -1;
var x1 = -1, y1 = -1, x2 = - 1, y2 = -1;
var touch1 = null, touch2 = null;
var phoneFactor = 0;
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

/* PC端web浏览器鼠标交互事件 */
var isKeyTap = false;
var webFactor = 0;
var dragLeft = false, dragMid = false, dragRight = false;
var lastX = -1, lastY = -1;

function initComponet(dom) {
    if (typeof(dom) == "undefined" || dom == null) {
        return;
    }

    container = dom;

    web3dCanvas = document.createElement('canvas');
    web3dCanvas.id = 'web3dCanvas';
    web3dCanvas.style.position = 'absolute'
    web3dCanvas.style.width = '100%';
    web3dCanvas.style.height = '100%';
    container.appendChild(web3dCanvas);

    text2dCanvas = document.createElement('canvas');
    text2dCanvas.id = 'text2dCanvas';
    text2dCanvas.style.position = 'absolute'
    text2dCanvas.style.width = '100%';
    text2dCanvas.style.height = '100%';
    container.appendChild(text2dCanvas);
}

function initModuleCallbacks(callbacks) {
    if (g_nEventVersion == 3) { // v3接口对第三方开放
        callback_v3 = callbacks;
    }
}

function initSettings(setting) {
    if (typeof(setting) == "undefined" || setting == null) {
        return;
    }

    if (setting.defaultBgUrl != null && setting.defaultBgUrl.length > 0) {
        g_bgImageUrl.push(setting.defaultBgUrl);
        g_bgImageIndex = g_bgImage.length;
    } else {
        for (let i = 0; i < g_bgImage.length; ++i) {
            if (setting.defaultBgImage == g_bgImage[i]) {
                g_bgImageIndex = i;
                break;
            }
        }
    }

    g_sceneLightOn = setting.defaultLightOn;
    g_sceneGeomtryOn = setting.defaultGeomtryOn;
    g_bParsejq = g_sceneGeomtryOn;
    g_operationMode = setting.defaultBaseOptMode;
    g_canvasTransparency = setting.defaultCanvasTransparency;
}

function initCMOnlineUI() {
    callback_v2 = CMOnlineUI;   // v2接口内部集成UI
    callback_v2.init(container);
    callback_v2.commentOnSubmit = commentOnSubmit;
    callback_v2.commentOnChange = commentOnChange;
    callback_v2.commentOnClick = commentOnClick;
    callback_v2.deleteCommentInput = deleteCommentInput;
    callback_v2.moveCommentInput = moveCommentInput;
}

function render3D() {
    glRunTime.draw3D();
    handle3D = requestAnimationFrame(render3D);
}

function render2D() {
    glRunTime.draw2D();
    OnUpdateUICallBack();
    handle2D = requestAnimationFrame(render2D);
}

function destoryComponet() {
    glRunTime.clear();
    commentDataClear();

    window.cancelAnimationFrame(handle2D);
    handle2D = null;
    window.cancelAnimationFrame(handle3D);
    handle3D = null;
}

/**
 * 开始循环渲染
 */
function startRender() {
    initCMOnlineUI();

    web3dCanvas.width = container.offsetWidth;
    web3dCanvas.height = container.offsetHeight;
    text2dCanvas.width = container.offsetWidth;
    text2dCanvas.height = container.offsetHeight;
    phoneFactor = 400.0 / text2dCanvas.height;
    webFactor = 200.0 / text2dCanvas.height;

    gl = web3dCanvas.getContext('webgl2', {alpha: g_canvasTransparency, antialias: true, preserveDrawingBuffer: true});
    if (!gl) {
        gl = web3dCanvas.getContext('webgl', {alpha: g_canvasTransparency, antialias: true, preserveDrawingBuffer: true})
        if (!gl) {
            gl = web3dCanvas.getContext('experimental-webgl', {alpha: g_canvasTransparency, antialias: true, preserveDrawingBuffer: true});
        }
        isWebgl2 = false;
    }

    gl2d = text2dCanvas.getContext("2d", {alpha: true});

    if (!gl || !gl2d) {
        return;
    }

    initRenderFlag = true;
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
    addMouseListener(text2dCanvas);
    document.addEventListener('DOMMouseScroll', fireFoxScollFun, false);
    window.onunload = addCloseListenser;
    window.onresize = canvasOnResize;

    if (g_sceneData.arrModelData.length == 0 || g_sceneData.arrModelData[0]._ModelInfo._Loaded) {
        // scle完整加载
        glRunTime.onceLoadScleModel();
        glRunTime.endLoadScleModel();
        if (callback_v3.CMOnLoadModelEndCallback) {
            callback_v3.CMOnLoadModelEndCallback();
        }
    } else {
        // scle分段加载
        glRunTime.startScelModel();
    }
}

function updateModel(index, dataStream, isLoop) {
    if (index < 0 || index > g_sceneData.arrModelData.length) {
        return;
    }
    // 解析模型数据流
    let cleParser = new ADFCleParser();
    cleParser._arrayByteBuffer = dataStream;
    cleParser._arrayCleBuffer = new DataView(cleParser._arrayByteBuffer, 0, cleParser._arrayByteBuffer.byteLength);
    cleParser._nCleBufferlength = cleParser._arrayByteBuffer.byteLength;

    let stuModelData = new ADF_MODEL_SAVEDATA();
    cleParser.CleStreamModelDataParser(stuModelData);
    g_sceneData.arrModelData[index]._ModelInfo._Loaded = true;
    cleParser = null;

    glRunTime.updateScleModel(index, stuModelData);
    stuModelData.Clear();
    stuModelData = null;

    if (isLoop) {
        startLoadModels(index + 1);
    }
}

function getModelList() {
    if (g_sceneData == null) {
        return null;
    }
    var modelList = new Array();
    for (let i = 0; i < g_sceneData.arrModelData.length; i++) {
        modelList.push(g_sceneData.arrModelData[i]._ModelInfo._strModelName);
    }
    return modelList;
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

// 获取画布左上角坐标真实坐标，考虑dom偏移以及页面滚动
function getCanvasOrigin() {
    let box = container.getBoundingClientRect();
    originPt.x = box.left;
    originPt.y = box.top;
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
            setFocusOnModel();
        } else if (event.keyCode == 27) {
            // esc键，退出
            setUsrCommentMode(0, 1);
        }
    }

    callback_v3.CMOnKeyboardDownCallBack(event);
}

function onDocumentKeyUp(event) {
    if (isLockCavans) {
        return;
    }
    isShiftDown = false;
    isMultPick = false;

    callback_v3.CMOnKeyboardUpCallBack(event);
}

function phoneKeyDown(event) {
    if (isLockCavans) {
        return;
    }
    isKeyDown = true;
    getCanvasOrigin();
    if (event.targetTouches.length == 1) {
        // 单指
        touch1 = event.targetTouches[0];
        x1 = touch1.clientX - originPt.x, y1 = touch1.clientY - originPt.y;
        lastX1 = x1, lastY1 = y1;
    }
    else if (event.targetTouches.length == 2) {
        // 双指
        touch1 = event.targetTouches[0], touch2 = event.targetTouches[1];
        lastX1 = touch1.clientX - originPt.x, lastY1 = touch1.clientY - originPt.y;
        lastX2 = touch2.clientX - originPt.x, lastY2 = touch2.clientY - originPt.y;
    }
}

function phoneKeyMove(event) {
    if (isLockCavans) {
        return;
    }
    if (!isKeyDown) {
        return;
    }
    getCanvasOrigin();
    if (event.targetTouches.length == 1) {
        touch1 = event.targetTouches[0];
        x1 = touch1.clientX - originPt.x, y1 = touch1.clientY - originPt.y;
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
        x1 = touch1.clientX - originPt.x, y1 = touch1.clientY - originPt.y;
        x2 = touch2.clientX - originPt.x, y2 = touch2.clientY - originPt.y;
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

    getCanvasOrigin();

    if (isKeyDown && !isKeyMove && !isKeyRotate && !isKeyScale) {
        // 单指
        touch1 = event.changedTouches[0];
        x1 = touch1.clientX - originPt.x, y1 = touch1.clientY - originPt.y;
        objectIndex = glRunTime.pickObjectIndex(x1, y1, isMultPick, true);
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

        // new
        if (event.touches.length == 1) {
            if (isUsrCommentFlag && g_canvas.isDuringComment) {
                // 弹出文本框
                getNewCommentNote(lastX1, lastY1);

            }
        }


        if (isUsrCommentFlag && isSingleComment) {
            addSingleComment(lastX, lastY, test_note);
        } else if (isUsrCommentFlag && g_canvas.isDuringComment) {
            g_sceneAnnotation.createCommentUpdate(lastX1, lastY1);
            return;
        }
    }

    pickedCommentIndex = -1;
    isKeyTap = false;
    isKeyDown = false; isKeyMove = false; isKeyRotate = false; isKeyScale = false;
}

function webKeyDown(event, textCanvas) {
    if (isLockCavans) {
        return;
    }
    isKeyTap = true;
    getCanvasOrigin();
    let x = event.clientX - originPt.x, y = event.clientY - originPt.y;

    switch (event.button) {
        case 0:
            // 左键
            dragLeft = true;
            selRect.min.x = x, selRect.min.y = y;
            //在textCanvas里屏蔽浏览器右键菜单,不兼容火狐
            textCanvas.oncontextmenu = function () {
                return false;
            }
            if (isShiftDown) {
                if (glRunTime.curRuntimeMode == RUNTIME_MODE_NORMAL) {
                    objectIndex = glRunTime.pickObjectIndex(x, y, isMultPick, false);
                }
            } else {
                if (glRunTime.curRuntimeMode == RUNTIME_MODE_MEASURE) {
                    if (g_sceneMeasure.pickMeasureUnitIndex >= 0) {
                        g_sceneMeasure.refreshPickMeasureUnitPos(x, y);
                    }
                } else if (glRunTime.curRuntimeMode == RUNTIME_MODE_SECTION) {
                    objectIndex = glRunTime.pickObjectIndex(x, y, isMultPick, false);
                    g_sceneSection.operateSectionStart(objectIndex);
                }
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
    lastX = x, lastY = y;
}

function webKeyUp(event, textCanvas) {
    if (isLockCavans) {
        return;
    }
    switch (event.button) {
        case 0:
            dragLeft = false;

            if (isKeyTap) {
                if (glRunTime.curRuntimeMode == RUNTIME_MODE_SECTION) {
                    g_sceneSection.operateSectionFinish(objectIndex);
                }

                if (glRunTime.getRectSelectionStatus()) {
                    glRunTime.pickModelByIDs(null);
                    glRunTime.pickModelByRect(selRect);
                    glRunTime.setRectSelection(false, selRect);
                    break;
                }

                if (isUsrCommentFlag && isSingleComment) {
                    addSingleComment(lastX, lastY, test_note);
                } else if (isUsrCommentFlag && g_canvas.isDuringComment) {
                    g_sceneAnnotation.createCommentUpdate(lastX, lastY);
                    break;
                }
                objectIndex = glRunTime.pickObjectIndex(lastX, lastY, isMultPick, true);

                if (isMove) {
                    moveObjectIndex = objectIndex;
                }

                if (isMultPick) {
                    break;
                }
                
                curDate = new Date();
                curTime = curDate.getTime();
                if (curTime - lastTime < doubleClickTimeMS && lastObjectIndex == objectIndex) {
                    setFocusOnModel();
                }
                lastTime = curTime;
                lastObjectIndex = objectIndex;
            }
            break;
        case 1:
            dragMid = false;
            if (isUsrCommentFlag && g_canvas.isDuringComment) {
                // 弹出文本框
                getNewCommentNote(lastX, lastY);
                break;
            }
            break;
        case 2:
            dragRight = false;
            if (isUsrCommentFlag && !isUsrCommInputShow) {
                g_sceneAnnotation.createCommentCancel();
                break;
            }
            if (g_sceneMeasure.pickMeasureMode) {
                g_sceneMeasure.createMeasureCancel();
                break;
            }
            break;
    }
    pickedCommentIndex = -1;
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
    getCanvasOrigin();
    let x = event.clientX - originPt.x, y = event.clientY - originPt.y;
    if (isKeyTap) {
        if (isShiftDown) {
            // 按下shift键
            if (dragLeft) {
                if (isMove && objectIndex > -1) {
                    // 左键拖拽：模型平移
                    if (Math.abs(x - lastX) > moveSensitivity || Math.abs(y - lastY) > moveSensitivity) {
                        glRunTime.objectMove(objectIndex, 2 * (x - lastX), -2 * (y - lastY));
                    }
                }
            } else if (dragMid) {
                // 中键拖拽：视角平移
                glRunTime.move(2 * (x - lastX), -2 * (y - lastY));
            }
        } else {
            if (dragLeft) {
                if (glRunTime.curRuntimeMode == RUNTIME_MODE_NORMAL) {
                    if ((Math.abs(x - selRect.min.x) > 3 || Math.abs(y - selRect.min.y) > 3)) {
                        // 框选零件
                        selRect.max.x = x;
                        selRect.max.y = y;
                        glRunTime.setRectSelection(true, selRect);
                    }
                } else if (glRunTime.curRuntimeMode == RUNTIME_MODE_MEASURE) {
                    // 拖拽测量控件
                    if (g_sceneMeasure.pickMeasureUnitIndex >= 0) {
                        if (Math.abs(x - lastX) > moveSensitivity || Math.abs(y - lastY) > moveSensitivity) {
                            g_sceneMeasure.moveMeasureUnit(g_sceneMeasure.pickMeasureUnitIndex, x, y);
                        }
                    }
                } else if (glRunTime.curRuntimeMode == RUNTIME_MODE_SECTION) {
                    g_sceneSection.operateSectionUpdate(objectIndex, x - lastX, y - lastY);
                    if (callback_v3.CMOnSectionUpdateCallback != null) {
                        callback_v3.CMOnSectionUpdateCallback();
                    }
                }
                
            } else if (dragMid) {
                // 视角旋转
                let degreeX = webFactor * (x - lastX);
                let degreeY = webFactor * (y - lastY);
                glRunTime.rotate(degreeX, degreeY, 0);
            }
        }
    } else {
        // 鼠标没有按下，但滑动，将操作标注信息
        if (isMotionCapture) {
            let captureUnit = glRunTime.captureGeomtry(x, y);
            if (captureUnit != null) {
                motionCaptureObjID = glRunTime.getPickObjectIdByIndex(captureUnit.objectIndex);
            } else {
                motionCaptureObjID = null;
            }
        }
    }

    // 创建批注状态时，捕获鼠标位置
    if ((isUsrCommentFlag && !isUsrCommInputShow) || (g_sceneMeasure.pickMeasureMode)) {
        g_canvas.mousePt.set(x, y);
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
            callback_v3.CMOnTouchStartCallBack(event);
        }

        textCanvas.ontouchmove = function (event) {
            phoneKeyMove(event);
            callback_v3.CMOnTouchMoveCallBack(event);
        }

        textCanvas.ontouchend = function (event) {
            phoneKeyUp(event);
            callback_v3.CMOnTouchEndCallBack(event);
        }
    } else {
        textCanvas.onmousedown = function (event) {
            webKeyDown(event, textCanvas);
            stopDefault(event);
            callback_v3.CMOnMouseDownCallBack(event);
        }

        textCanvas.onmouseup = function (event) {
            webKeyUp(event, textCanvas);
            // stopDefault(event);
            callback_v3.CMOnMouseUpCallBack(event);
        }

        textCanvas.onmousewheel = function (event) {
            webWheel(event, textCanvas);
            stopDefault(event);
            callback_v3.CMOnMouseWheelCallBack(event);
        }

        textCanvas.onmousemove = function (event) {
            webKeyMove(event, textCanvas);
            // stopDefault(event);
            callback_v3.CMOnMouseMoveCallBack(event);
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

// 鼠标选中零件时获取零件相关数据
function getPickObjectUnit(objectIndex) {
    if (objectIndex < 0) {
        pickObjectVisible = null;
        pickObjectTransparent = null;
        pickObjectIndexs = null;
        pickObjectID = null;
        pickObjectName = null;
        pickObjectParams = null;
    } else {
        pickObjectVisible = glRunTime.getObjectVisible(objectIndex);
        pickObjectTransparent = glRunTime.getObjectTransparent(objectIndex);
        pickObjectIndexs = glRunTime.getPickObjectIndexs();
        pickObjectID = glRunTime.getObjectIdByIndex(objectIndex);
        pickObjectName = glRunTime.getObjectNameByID(pickObjectID, g_GLData.GLModelTreeNode);
        pickObjectParams = glRunTime.getObjectParamsByID(pickObjectID, g_GLData.GLModelTreeNode);
    }
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
    glRunTime.setObjectTransparent(null, alpha);
}

// 模型隐藏
function setVisible(isVisible) {
    glRunTime.setObjectVisible(-1, isVisible);
}

// 视图切换
function setView(selectIndex) {
    glRunTime.shiftView(selectIndex);
}

// 复位
function setHome() {
    glRunTime.home(HOME_ALL);
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
var uFrameStep = 1;
var uSleepTime = 40;
var uBaseTime = 40;
var uAnimSpeed = 1.0;
// 场景动画参数
var g_nAnimationStart = 0;
var g_nAnimationEnd = 0;
var g_animMode = 0;
// 是否播放物价动画、摄像机动画
var g_doObjectAnim = true;
var g_doCameraAnim = true;
var g_doTransAnim = true;

// 设置是否打开摄像机动画
function setAnimType(objAnim, camAnim, transAnim) {
    g_doObjectAnim = objAnim;
    g_doCameraAnim = camAnim;
    g_doTransAnim = transAnim;
}

// 设置动画播放倍速
// 可选值：0.5 - 10.0
function setAnimSpeed(speed) {
    if (speed < 0.5 || speed > 10.0) {
        return;
    }
    if (speed > 4.0) {
        uAnimSpeed = 1.0;
        uSleepTime = uBaseTime;
        uFrameStep = Math.ceil(speed);
    } else {
        uFrameStep = 1;
        uAnimSpeed = speed;
        uSleepTime = uBaseTime / uAnimSpeed;
    }
}
// 获取当前动画播放倍速
function getAnimSpeed() {
    return uAnimSpeed * uFrameStep;
}

// 获取动画总帧数
function getTotalFrames() {
    return glRunTime.getTotalFrame();
}

// 开始动画、继续动画
function setAnimationStart() {
    animTerminal();
    uTotalFrame = glRunTime.getTotalFrame();
    if (animationStatus == ANIMTERMINAL) {
        setHome();
    }
    if (uCurFrame >= uTotalFrame) {
        uCurFrame = 0;
    }
    animRun();
    g_animMode = 1;
}
// 场景动画接口
function PlaySceneAnimation() {
    animTerminal(); // 初始状态
    uCurFrame = g_nAnimationStart;
    uTotalFrame = g_nAnimationEnd;
    if (uCurFrame >= uTotalFrame) {
        uCurFrame = g_nAnimationStart;
    }
    animationStatus = ANIMRUN;
    animRun();
    g_animMode = 2;
}
// 从指定帧播放动画
function PlayUsrFrameAnimation(frameStart, frameEnd) {
    if (frameEnd <= frameStart || frameEnd >= glRunTime.getTotalFrame()) {
        return -1;
    }
    animTerminal(); // 初始状态
    uCurFrame = frameStart;
    uTotalFrame = frameEnd;
    animationStatus = ANIMRUN;
    animRun();
    g_animMode = 2;
}
// 执行动画循环
function animRun() {
    if (uCurFrame < uTotalFrame && glRunTime.setObjectAnim(uCurFrame)) {
        if (g_doCameraAnim) {
            glRunTime.setCameraAnim(uCurFrame);
        }
        if (g_doTransAnim) {
            glRunTime.setAnnotationAnim(uCurFrame);
        }
        getCurFrame(uCurFrame);
        uCurFrame += uFrameStep;
        animationClock = setTimeout("animRun()", uSleepTime);
        animationStatus = ANIMRUN;
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
    animationStatus = ANIMPAUSE;
}
// 终止
function animTerminal() {
    uCurFrame = 0;
    getCurFrame(uCurFrame);
    uTotalFrame = 0;
    if (glRunTime.setObjectAnim(uCurFrame)) {
        if (g_doCameraAnim) {
            glRunTime.setCameraAnim(uCurFrame);
        }
        if (g_doTransAnim) {
            glRunTime.setAnnotationAnim(uCurFrame);
        }
    }
    animPause();
    animationStatus = ANIMTERMINAL;
    g_animMode = 0;
}
// 设置当前帧
function setCurFrame(frame) {
    if (g_animMode == 1) {
        // 正常动画播放
        if (frame < 0 || frame >= uTotalFrame) {
            return;
        }
    } else if (g_animMode == 2) {
        // 场景动画播放
        if (frame < g_nAnimationStart || frame >= uTotalFrame) {
            return;
        }
    } else {
        return;
    }

    uCurFrame = frame;
    if (glRunTime.setObjectAnim(uCurFrame)) {
        if (g_doCameraAnim) {
            glRunTime.setCameraAnim(uCurFrame);
        }
        if (g_doTransAnim) {
            glRunTime.setAnnotationAnim(uCurFrame);
        }
    }
    animPause();
    setAnmiIcon(true);
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

// 设置摄像机视角
function setCameraView(camera) {
    return glRunTime.setCameraView(camera);
}

// 获取摄像机视角
function getCameraView() {
    return glRunTime.getCameraView();
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

        // 刷新CMOnlineUI
        let tmpPt = new Point2(0, 0)
        for (let i = 0; i < g_usrCommOption.data.length; ++i) {
            g_canvas.adapterLocalToScreen(g_usrCommOption.data[i]._attachPt.x, g_usrCommOption.data[i]._attachPt.y, tmpPt);
            g_usrCommOption.data[i].cvtPointToStyle(tmpPt);
        }
        callback_v2.showCommentInput(g_usrCommOption);
    }

    gl2d.canvas.width = gl2d.canvas.clientWidth;
    gl2d.canvas.height = gl2d.canvas.clientHeight;
}

// 获取拾取状态
// 返回值：0 表示没选中， 1 表示单选中， 2 表示多选中
function getPickStatus() {
    return glRunTime.getPickStatus();
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

/**
 * 数字孪生接口
 * 通过物件ID获取原始物件矩阵
 * @param {*} uObjectID 物件ID
 */
 function getObjectOriWorldMatrix(uObjectID) {
    // 关闭其余按钮和模型拾取功能那个，只允许用户进行视角变换和缩放
    // if (!isDigitalTwinMode) {
    //     return;
    // }
    return glRunTime.getObjectOriWorldMatrix(uObjectID);
}

/**
 * 数字孪生接口
 * 通过物件ID获取当前物件矩阵
 * @param {*} uObjectID 物件ID
 */
 function getObjectCurWorldMatrix(uObjectID) {
    // 关闭其余按钮和模型拾取功能那个，只允许用户进行视角变换和缩放
    // if (!isDigitalTwinMode) {
    //     return;
    // }
    return glRunTime.getObjectCurWorldMatrix(uObjectID);
}

function setCameraCurView(cmCamera) {
    if (!isDigitalTwinMode) {
        return;
    }
    return glRunTime.setCameraCurView(cmCamera);
}

// 添加注释信息
// 只能对单个object添加
function addComment(objectID, annoText) {
    g_sceneAnnotation.addCommentOnObjectById(objectID, annoText);
}

// 设置用户批注权限
function setUsrCommentRight(type) {
    if (type == 0) {
        usrCommentRight = 0;
    } else {
        usrCommentRight = 1;
    }
}

// 设置当前用户名
function setCommentUsrName(userName) {
    usrCommentName = userName;
}

// 用户添加批注开关
// flag: 1表示开始批注，0表示结束
// type: 0表示单引脚批注类型，1表示多引脚批注类型
function setUsrCommentMode(flag, type) {
    if (usrCommentRight == 0) {
        // alert("operation is not allowed");
        return;
    }

    if (flag == 1) {
        glRunTime.setBoxShow(false);
        isUsrCommentFlag = true;
        isMultPick = true;
        if (type == 0) {
            isSingleComment = true;
        } else {
            g_sceneAnnotation.createCommentBegin();
            isUsrCommInputShow = false;
        }
    } else {
        g_sceneAnnotation.createCommentCancel();
        glRunTime.setBoxShow(true);
        isUsrCommentFlag = false;
        isUsrCommInputShow = false;
        isMultPick = false;
        isSingleComment = false;
    }
    glRunTime.pickModelByIDs(null);
}

// 更新批注界面列表
function getNewCommentNote(x, y) {
    // 如果没有Update引线，则直接返回
    if (!g_sceneAnnotation.isCommentValid()) {
        return;
    }

    var newCommentNode = new GL_USRANNOTATION();
    newCommentNode.cvtPointToStyle(new Point2(x, y));
    newCommentNode._uAnnotID = g_canvas.commentId;
    newCommentNode._strUsrName = usrCommentName;
    newCommentNode._strCreateTime = getStandardCurTime();
    g_canvas.adapterScreenToLocal(x, y, newCommentNode._attachPt);

    // 弹出输入框
    g_usrCommOption.data.push(newCommentNode);
    callback_v2.showCommentInput(g_usrCommOption);
    isUsrCommInputShow = true;

    // 执行final
    g_sceneAnnotation.createCommentFinal(x, y, newCommentNode);
}

// 更新注释数据
// 更新内容可以包括：位置坐标和注释内容
function commentOnSubmit (event, newOpion, item, index) {
    isUsrCommInputShow = false;
    let curComment = newOpion.data[index];
    curComment._uAnnotText = curComment.value;
    let point2d = curComment.cvtStyleToPoint();
    if (g_sceneAnnotation.updateCommentById(point2d.x, point2d.y, curComment)) {
        setUsrCommentMode(0, 1);
        return true;
    }
    return false;
}

// 批注文本框内容变化时回调
function commentOnChange (event, newOpion, item, index) {
	
}

// 批注本文框被单击时回调
function commentOnClick(event, newOpion, item, index) {
    let curComment = newOpion.data[index];
    let commentObjIndexs = g_sceneAnnotation.getCommentObjectIndexs(curComment._uAnnotID);
    glRunTime.pickModelByIndexs(commentObjIndexs);

    pickedCommentIndex = index;
}

// 批注被删除时回调
function deleteCommentInput() {
    if (usrCommentRight == 0) {
        // alert("operation is not allowed");
        return;
    }

    if (pickedCommentIndex < 0) {
        return;
    }

    let curComment = g_usrCommOption.data[pickedCommentIndex];
    g_sceneAnnotation.deleteCommentById(curComment._uAnnotID);

    g_usrCommOption.data[pickedCommentIndex].show = false;
    callback_v2.showCommentInput(g_usrCommOption);
}

// 批注被用户拖动修改位置时回调
function moveCommentInput(event, newOpion, item, index) {
    if (usrCommentRight == 0) {
        // alert("operation is not allowed");
        return;
    }
}

function commentDataClear() {
    g_usrCommOption.data.splice(0, g_usrCommOption.data.length);
    callback_v2.showCommentInput(g_usrCommOption);
}

function addSingleComment(x, y, commentInfo) {
    g_sceneAnnotation.createCommentBegin();
    if (g_sceneAnnotation.createCommentUpdate(x, y) != true) {
        return;
    }
    g_sceneAnnotation.createCommentFinal(x, y - 30, commentInfo);
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
            g_sceneAnnotation.importXmlComment(xmlDoc);
            callback_v2.showCommentInput(g_usrCommOption);
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

function importComment(xmlDoc) {
    if (usrCommentRight == 0) {
        // alert("operation is not allowed");
        return;
    }

    g_xmlDoc = xmlDoc;
    if (g_xmlDoc != null) {
        g_sceneAnnotation.importXmlComment(g_xmlDoc);
        callback_v2.showCommentInput(g_usrCommOption);
    }
}

function exportComment(xmlDoc) {
    if (usrCommentRight == 0) {
        // alert("operation is not allowed");
        return null;
    }

    g_xmlDoc = xmlDoc;
    if (g_xmlDoc != null) {
        g_xmlDoc = g_sceneAnnotation.exportXmlComment(g_xmlDoc);
    }
    return g_xmlDoc;
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

function startMeasureMode() {
    if (!g_sceneGeomtryOn) {
        return;
    }
    // 初始化精确数据
    g_glprogram.initSurfaceGLData();
    g_glprogram.initCurveGLData();
}

function setMeasureMode(measureMode) {
    if (!g_sceneGeomtryOn) {
        return;
    }
    if (measureMode == MEASURE_NONE) {
        isMotionCapture = false;
    } else {
        isMotionCapture = true;
        glRunTime.curRuntimeMode = RUNTIME_MODE_MEASURE;
        g_sceneMeasure.setMeasureMode(measureMode);
    }
}

function cancelMeacureMode() {
    if (!g_sceneGeomtryOn) {
        return;
    }
    isMotionCapture = false;
    g_sceneMeasure.setMeasureMode(MEASURE_NONE);
    // 清除精确数据
    g_glprogram.uninitSurfaceGLData();
    g_glprogram.uninitCurveGLData();
    // 退出测量状态时，默认删除当前测量数据
    deleteMeasureUnit(-1);
}

// 获取当前选取的测量单元索引
function getMeasureUnitIndex() {
    if (!g_sceneGeomtryOn) {
        return;
    }
    return g_sceneMeasure.pickMeasureUnitIndex;
}

// index: 选取的测量单元索引。
// 如果是-1则表示导出全部测量单元。
// 如果是-2则表示导出当前已拾取的测量单元。
function exportMeasureUnits(index) {
    if (!g_sceneGeomtryOn) {
        return;
    }
    if (index < -2 || index >= g_canvas.m_arrMeasureDispalyInfo.length) {
        return;
    }
    if (index == -1) {
        let arrMeasureUnits = new Array();
        for (let i = 0; i < g_canvas.m_arrMeasureDispalyInfo.length; ++i) {
            if (g_canvas.m_arrMeasureDispalyInfo == null) {
                continue;
            }
            arrMeasureUnits.push(g_canvas.m_arrMeasureDispalyInfo[i].Copy());
        }
        return arrMeasureUnits;
    } else if (index == -2) {
        return g_canvas.m_arrMeasureDispalyInfo[g_sceneMeasure.pickMeasureUnitIndex].Copy();
    } else {
        return g_canvas.m_arrMeasureDispalyInfo[index] == null ? null : g_canvas.m_arrMeasureDispalyInfo[index].Copy();
    }
}

// index: 选取的测量单元索引。
// 如果是-1则表示操作全部测量单元。
// 如果是-2，则表示操作当前已拾取的测量单元。
function setMeasureUnitVisible(index, visible) {
    if (!g_sceneGeomtryOn) {
        return;
    }
    if (index < -2 || index >= g_canvas.m_arrMeasureDispalyInfo.length) {
        return;
    }
    if (index == -2) {
        return g_sceneMeasure.hideMeasureUnit(g_sceneMeasure.pickMeasureUnitIndex, visible);
    } else {
        return g_sceneMeasure.hideMeasureUnit(index, visible);
    }
}

// index: 选取的测量单元索引。
// 如果是-1则表示操作全部测量单元。
// 如果是-2，则默认操作当前已拾取的测量单元。
function deleteMeasureUnit(index) {
    if (!g_sceneGeomtryOn) {
        return;
    }
    if (index < -2 || index >= g_canvas.m_arrMeasureDispalyInfo.length) {
        return;
    }
    if (index == -2) {
        g_sceneMeasure.deleMeasureUnit(glRunTime.pickMeasureUnitIndex);
        g_sceneMeasure.pickMeasureUnitIndex = -1;
    } else {
        return g_sceneMeasure.deleMeasureUnit(index);
    }
}

// 设置动态捕捉模式
function setCaptureMode(captureMode) {
    if (!g_sceneGeomtryOn) {
        return;
    }
    if (captureMode == CAPTURE_NONE) {
        isMotionCapture = false;
    } else {
        isMotionCapture = true;
    }
    glRunTime.setCaptrueMode(captureMode);
}

// 材质操作
function getObjectMetialList(objectId) {
    return glRunTime.getObjectMetialList(objectId);
}

function setObjectMaterialID(objID, objSubsetIndexs, uMtlID) {
    let objectIndex = glRunTime.getObjectIndexById(objID);
    if (objectIndex >= 0) {
        if (objSubsetIndexs == null || objSubsetIndexs.length == 0) {
            let surfaceNum = glRunTime.getObjectSurfacesNum(objectIndex);
            for (let i = 0; i < surfaceNum; ++i) {
                glRunTime.setObjectSurfaceMaterialById(objectIndex, i, uMtlID);
            }
        } else {
            for (let i = 0; i < objSubsetIndexs.length; ++i) {
                glRunTime.setObjectSurfaceMaterialById(objectIndex, objSubsetIndexs[i], uMtlID);
            }
        }
        return 0;
    }
    return -1;
}

function setObjectMaterialTexture2D(objID, objSubsetIndexs, uMtlID, imageUrl) {
    let objectIndex = glRunTime.getObjectIndexById(objID);
    if (objectIndex < 0) {
        return -1;
    }
    let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
    if (g_GLPartSet._arrPartSet[uCurPartIndex] == null || g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._uIsUV != 1) {
        return -1;
    }

    let material = glRunTime.getMaterialById(uMtlID);
    if (material == null) {
        return -1;
    }

    let mtlClone = material.Clone();
    mtlClone._uMtlID = g_newMaterialID++;
    mtlClone._MtlData._eMtlType = ADFMTLTYPE_PICTURE;

    let g_objectIndex = objectIndex;
    let g_objSubsetIndexs = objSubsetIndexs;
    let image = new Image();
    image.onload = function() {
        mtlClone._MtlData._arrTexID[0] = g_texturer.createUrlRgbaTexture(image);

        if (g_objSubsetIndexs == null || g_objSubsetIndexs.length == 0) {
            g_glprogram.setObjectMaterial(g_objectIndex, mtlClone);
        } else {
            for (let i = 0; i < g_objSubsetIndexs.length; ++i) {
                g_glprogram.setObjectSurfaceMaterial(g_objectIndex, g_objSubsetIndexs[i], mtlClone);
            }
        }
    }
    image.src = imageUrl;    
}

function setObjectMaterialTextureBasis(objID, objSubsetIndexs, uMtlID, buff) {
    let objectIndex = glRunTime.getObjectIndexById(objID);
    if (objectIndex < 0) {
        return -1;
    }
    let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
    if (g_GLPartSet._arrPartSet[uCurPartIndex] == null || g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._uIsUV != 1) {
        return -1;
    }

    let material = glRunTime.getMaterialById(uMtlID);
    if (material == null) {
        return -1;
    }

    let mtlClone = material.Clone();
    mtlClone._uMtlID = g_newMaterialID++;
    mtlClone._MtlData._eMtlType = ADFMTLTYPE_PICTURE;

    if (g_texBasisu == null || !g_texBasisu.wasmInit) {
        console.log("basis unversal not support");
        return -1;
    }

    let basisFileObj = g_texBasisu.loadBasisData(buff);
    if (basisFileObj == null) {
        return -1;
    }

    mtlClone._MtlData._arrTexID[0] = g_texBasisu.createCompressedTexture(basisFileObj.dst, basisFileObj.width, basisFileObj.height, basisFileObj.tcFormat);

    if (objSubsetIndexs == null || objSubsetIndexs.length == 0) {
        g_glprogram.setObjectMaterial(objectIndex, mtlClone);
    } else {
        for (let i = 0; i < objSubsetIndexs.length; ++i) {
            g_glprogram.setObjectSurfaceMaterial(objectIndex, objSubsetIndexs[i], mtlClone);
        }
    }
}

function setSurfaceMaterialMode(flag) {
    if (flag == 1) {
        g_glprogram.setPickType(PICK_GEOM_SURFACE);
    } else {
        g_glprogram.setPickType(PICK_OBJECT);
    }
}

function setSurfaceMaterial(red, green, blue, alpha) {
    let curPickUnit = glRunTime.getPickUnit();
    glRunTime.setObjectSurfaceMaterial(curPickUnit.objectIndex, curPickUnit.surfaceIndex, red, green, blue, alpha);
}

function getObjectBoxById(objID) {
    let objectIndex = glRunTime.getObjectIndexById(objID);
    if (objectIndex < 0) {
        return null;
    }

    let nPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
    if (g_GLPartSet._arrPartSet[nPartIndex] == null) {
        return null;
    }
    let partBox = g_GLPartSet._arrPartSet[nPartIndex]._arrPartLODData[0]._boxset._ObjectBox;
    let objBox = new CM_BOX();

    for (let i = 0; i < partBox._Vertex.length; ++i) {
        let curVertex = new Point3();
        CalTranslatePoint(partBox._Vertex[i].x, partBox._Vertex[i].y, partBox._Vertex[i].z,
            g_glprogram.getObjectModelMatrix(objectIndex), curVertex);
        objBox._arrVertex.push(curVertex);
    }
    return objBox;
}

function getSubObjectsByTreeId(treeId) {
    let curTreeNode = glRunTime.getTreeNodeById(treeId, g_GLData.GLModelTreeNode);
    if (curTreeNode == null) {
        return null;
    }

    let arrObjectID = new Array();
    glRunTime.getTreeNodeSubObjectID(curTreeNode, arrObjectID);

    return arrObjectID;
}

function setSubObjectMoveByTreeId(treeId, x, y, z) {
    let curTreeNode = glRunTime.getTreeNodeById(treeId, g_GLData.GLModelTreeNode);
    if (curTreeNode == null) {
        return false;
    }

    let arrObjectIndex = new Array();
    glRunTime.getTreeNodeSubObjectIndex(curTreeNode, arrObjectIndex);
    if (arrObjectIndex.length <= 0) {
        return false;
    }

    glRunTime.objectSetMove(arrObjectIndex, x, y, z);
    return true;
}

function setBaseOperationMode(mode) {
    if (mode < MOUSE_OPERATION_MODE_DEFAULT || mode >= MOUSE_OPERATION_MODE_END) {
        return;
    }
    g_operationMode = mode;
}

// =========================================================================
// CMOnline数据转换

function transCMOnlinePickElem(cmPickElement, runtimePickUnit) {
    cmPickElement._uPickType = CM_PICK_TYPE_NONE;
    cmPickElement._arrPickElements.splice(0, cmPickElement._arrPickElements.length);
    let elementId = 0;

    if (runtimePickUnit._uPickType == RUNTIME_MODE_NORMAL)
    {
        cmPickElement._uPickType = CM_PICK_TYPE_PART;
        elementId = glRunTime.getObjectIdByIndex(runtimePickUnit._oPickUnit.objectIndex);
        cmPickElement._arrPickElements.push(elementId);
    }
    else if (runtimePickUnit._uPickType == RUNTIME_MODE_PMI)
    {
        cmPickElement._uPickType = CM_PICK_TYPE_PMI_ITEM;
        elementId = g_scenePmiManager.getItemIdByIndex(
            runtimePickUnit._oPickUnit.pmiIndex, runtimePickUnit._oPickUnit.itemIndex);
        cmPickElement._arrPickElements.push(elementId);
    }
}

// =========================================================================

// 回调函数，刷新界面
function OnUpdateUICallBack() {
    callback_v2.refreshNotation();
    callback_v3.CMOnUpdateUICallBack();
}

// 回调函数，动画每播放一帧时回调
function getCurFrame(frame) {
    callback_v3.CMOnAnimRefreshCallBack(frame);
}

// 回调函数，当动画播放完毕时回调
function setAnmiIcon(isPause) {
    callback_v3.CMOnAnimFinishCallBack(isPause);
}
