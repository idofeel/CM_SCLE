//===================================================================================================

// 模型树
function CM_MODELTREENODE() {
    this._uTreeNodeID = -1;
    this._uObjectID = -1;
    this._strName = "";
    this._bVisible = true;
    this._arrNodeParameters = new Array(); // 类型CM_NODEPARAMETER
    this._arrSubNode = new Array();        // 类型CM_MODELTREENODE
}

// 模型树节点参数
function CM_NODEPARAMETER() {
    this._strName = "";     // 字符串
    this._strValue = "";    // 字符串
}

const CMHOME_TYPE_ALL = 0;
const CMHOME_TYPE_POSITION = 1;
const CMHOME_TYPE_COLOR = 2;
const CMHOME_TYPE_TRANS = 3;
const CMHOME_TYPE_VISIBLE = 4;

function CM_CALLBACKS() {
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
}

//===================================================================================================

function CMOnlineLib(dom, callbacks) {
    g_nEventVersion = 3;
    initComponet(dom);
    initModuleCallbacks(callbacks);

    this.CMInitData = CMInitData;
    this.CMUninitData = CMUninitData;
    this.CMChangeView = CMChangeView;
    this.CMSetViewOnSelObjs = CMSetViewOnSelObjs;
    this.CMHome = CMHome;
    this.CMGetSelObjIDs = CMGetSelObjIDs;
    this.CMGetMotionCaptureObjID = CMGetMotionCaptureObjID;
    this.CMSetClearSelStatus = CMSetClearSelStatus;
    this.CMSetSelObjVisible = CMSetSelObjVisible;
    this.CMGetSelObjTransparent = CMGetSelObjTransparent;
    this.CMSetSelObjTransparent = CMSetSelObjTransparent;
    this.CMSetSelObjTransparent = CMSetSelObjTransparent;
    this.CMSetObjsHighlight = CMSetObjsHighlight;
    this.CMGetObjsCenterPos = CMGetObjsCenterPos;
        
    this.CMAnimPlay = CMAnimPlay;
    this.CMAnimPause = CMAnimPause;
    this.CMAnimResume = CMAnimResume;
    this.CMAnimStop = CMAnimStop;
    this.CMGetAnimFrames = CMGetAnimFrames;
    this.CMSetAnimCurFrame = CMSetAnimCurFrame;
    this.CMGetAnimCurFrame = CMGetAnimCurFrame;

    this.CMSetBkImage = CMSetBkImage;
    this.CMSetSelStatusByObjIDs = CMSetSelStatusByObjIDs;
    this.CMSetMultSelFlag = CMSetMultSelFlag;
    this.CMSetMoveObjFlag = CMSetMoveObjFlag;
    this.CMSetMotionCaptureFlag = CMSetMotionCaptureFlag;
    this.CMGetModelTreeRootNode = CMGetModelTreeRootNode;

    this.CMGetSceneCount = CMGetSceneCount;
    this.CMGetSceneInfo = CMGetSceneInfo;
    this.CMPlaySceneAnim = CMPlaySceneAnim;

    this.CMTwinStart = CMTwinStart;
    this.CMTwinTerminal = CMTwinTerminal;
    this.CMSetObjectOriWorldMatrix = CMSetObjectOriWorldMatrix;

    this.CMSetUserCanCommentFlag = CMSetUserCanCommentFlag;
    this.CMSetCommentUsrName = CMSetCommentUsrName;
    this.CMAddComment = CMAddComment;
    this.CMDelComment = CMDelComment;
    this.CMImportComment = CMImportComment;
    this.CMExportComment = CMExportComment;

    this.CMSetCameraPersonControl = CMSetCameraPersonControl;
    this.CMCameraRotate = CMCameraRotate;
    this.CMCameraSlide = CMCameraSlide;
    this.CMSetCameraViewMat = CMSetCameraViewMat;
}

//===================================================================================================

var g_LoadFileTimeTimeID;

function RealLoadSCLEFile() {
       // 解析cle文件
       var bResult = ParseCleStream();
       if (!bResult) {
          // 清除缓存                        
         // delete g_arrayCleBuffer;
          g_arrayCleBuffer = null;
          g_arrayByteBuffer = null;
          return;
      }
       // 清除缓存                        
       // delete g_arrayCleBuffer;
       g_arrayCleBuffer = null;
       g_arrayByteBuffer = null;
       
       // 绘制三维模型
       startRender();		
}

function StartLoadSCLEFile() {
     window.clearTimeout(g_LoadFileTimeTimeID); 
     RealLoadSCLEFile();  	
}

// 加载数据
function CMInitData(cledata) { 
    CMUninitData();

    if (cledata.length < 10) {
        return;
    }

    var tempDataView = new DataView(cledata, 0, 2);
    var byteHeaer = tempDataView.getUint16(0, true);
    if (byteHeaer == 2 || byteHeaer == 3){
        g_arrayByteBuffer = cledata;
        g_arrayCleBuffer = new DataView(g_arrayByteBuffer, 0, g_arrayByteBuffer.byteLength);
        g_nCleBufferlength = g_arrayByteBuffer.byteLength;

        RealLoadSCLEFile();  
        return;        
    }

    // 兼容写法
    var new_zip = new JSZip();
    new_zip.loadAsync(cledata).then(function (zip) {
        var key = function () {
            for (let i in zip.files) {
                return i
            }
        }
        zip.files[key()].async('arraybuffer').then(function (data) {
            g_arrayByteBuffer = data;
            g_arrayCleBuffer = new DataView(g_arrayByteBuffer, 0, g_arrayByteBuffer.byteLength);
            g_nCleBufferlength = g_arrayByteBuffer.byteLength;

            g_LoadFileTimeTimeID = window.setInterval(StartLoadSCLEFile, 100);
        });
    });
}

// 清除数据
function CMUninitData() {
    glRunTime.clear();
    commentDataClear();

    // 释放解析数据流
    UnitCleStream();
}

// 视图切换
function CMChangeView(type) {
    glRunTime.shiftView(type);
}

// 设置聚焦到选中物件上，模型整体围绕所选零件旋转
// 如果未选中零件或装配体，则默认聚焦到模型整体
function CMSetViewOnSelObjs() {
    glRunTime.setFocusOnObject();
}

// 模型复位
function CMHome(type) {
    glRunTime.home(type);
}

// 获取选择的物件Id，返回值为array类型
function CMGetSelObjIDs() {
    return glRunTime.getPickObjectIds();
}

// 获取鼠标动态指向的物件Id
function CMGetMotionCaptureObjID() {
    return motionCaptureObjID;
}

// 通过物件Id，设置物件为选中状态
function CMSetSelStatusByObjIDs(objIDs) {
    return glRunTime.pickModelByIDs(objIDs);
}

// 清空选中选中状态
function CMSetClearSelStatus() {
    return glRunTime.pickModelByIDs(null);
}

// 设置选中物件的显示/隐藏状态
function CMSetSelObjVisible(isVisible) {
    glRunTime.setObjectVisible(isVisible);
}

// 获取选择的物件的透明度值，仅单选有效
function CMGetSelObjTransparent() {
    return pickObjectTransparent;
}

// 设置选中物件的透明渲染状态
function CMSetSelObjTransparent(alpha) {
    if (alpha < 0.0 || alpha > 1.0) {
        return;
    }
    glRunTime.setObjectTransparent(alpha);
}

// 设置选中物件的颜色
function CMSetSelObjColor(r, g, b, a) {
    if (r < 0.0 || r > 1.0 || g < 0.0 || g > 1.0 ||
        b < 0.0 || b > 1.0 || a < 0.0 || a > 1.0) {
        return;
    }
    glRunTime.setObjectMaterial(r, g, b, a);
}

// 高亮指定的物件
function CMSetObjsHighlight(objIDs) {
    glRunTime.setObjectsPickedByIds(objIDs);
}

// 获取物件的包围盒中心点
// 输入：objIDs 数组
// 输出：center2Ds 数组 在画布上的二维坐标点，数据类型Point2(x, y)
// 如果某个ID计算失败则对应的数组元素为null
function CMGetObjsCenterPos(objIDs) {
    let arrCenters = new Array();
    for (let i = 0; i < objIDs.length; ++i) {
        arrCenters.push(glRunTime.getObjectCenterById(objIDs[i]));
    }
    return arrCenters;
}

// 播放动画
function CMAnimPlay() { 
    if (g_sceneData != null) {
        setAnimationStart();              
    } 
}

// 暂停播放
function CMAnimPause() { 
    if (g_sceneData != null) {
        animPause();              
    } 
}

// 继续动画
function CMAnimResume() { 
    if (g_sceneData != null) {
        setAnimationStart();              
    } 
}

// 暂停播放
function CMAnimStop() { 
    if (g_sceneData != null) {
        animTerminal();              
    } 
}

// 获取动画总帧数
function CMGetAnimFrames() {
    return glRunTime.getTotalFrame();
}

// 获取当前动画播放帧数
function CMGetAnimCurFrame() {
    return uCurFrame
}

// 设置从指定帧开始播放
function CMSetAnimCurFrame(frame) {
    uCurFrame = frame;
}

// 设置背景图片
function CMSetBkImage(imageName) {
    for (let i = 0; i < g_bgImage.length; ++i) {
        if (imageName == g_bgImage[i]) {
            glRunTime.setBackground(i);
            return;
        }
    }
    glRunTime.addUsrBackground(g_resFoder + imageName);
    g_bgImage.push(imageName);
}

// 设置选中物件时是否高亮成红色以及显示包围盒
function CMSetSelShowFlag(flag) {
    if (flag == 0) {
        glRunTime.setBoxShow(false);
        glRunTime.setHighlight(false);
    } else {
        glRunTime.setBoxShow(true);
        glRunTime.setHighlight(true);
    }
}

// 设置多选模式
function CMSetMultSelFlag(flag) {
    if (flag == 0) {
        isMultPick = false;
    } else {
        isMultPick = true;
    }
}

// 设置移动选中物件的标记
function CMSetMoveObjFlag(flag) {
    if (flag == 0) {
        isMove = false;
    } else {
        isMove = true;
    }
}

// 设置鼠标动态捕捉物件ID标记
function CMSetMotionCaptureFlag(flag) {
    if (flag == 0) {
        isMotionCapture = false;
    } else {
        isMotionCapture = true;
    }
}

// 获取模型树根节点
function CMGetModelTreeRootNode() {
    return g_GLData.GLModelTreeNode;
}

// 获取场景事件数量
function CMGetSceneCount() { 
    var nResult = 0;
    if (g_sceneData != null) {
        nResult = g_sceneData.stuTimeNodeTreeTop._arrSubNode.length;              
    }  

    return nResult;
}

// 获取场景事件信息
function CMGetSceneInfo(index, data) { 
    if (g_sceneData != null) {  
        if (index >= 0 && index < g_sceneData.stuTimeNodeTreeTop._arrSubNode.length){
            data.Copy(g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]);
        }           
    }
 }

// 播放场景事件动画
function CMPlaySceneAnim(index) { 
    if (g_sceneData != null) {  
        if (index >= 0 && index < g_sceneData.stuTimeNodeTreeTop._arrSubNode.length){     
            g_nAnimationStart = g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._uStartFrameID;
            g_nAnimationEnd = g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._uStartFrameID + g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._uFrameSize;

            animTerminal();
			PlaySceneAnimation();
        }           
    }
}

// 启动数字孪生模式
function CMTwinStart() { 
    if (g_sceneData != null) {  
        // 进入数字孪生模式
        digitalTwinStart();           
    }
}

// 退出数字孪生模式
function CMTwinTerminal() { 
    digitalTwinTerminal();
}

// 设置物件的原始世界矩阵
function CMSetObjectOriWorldMatrix(objID, newMatrix) { 
    if (g_sceneData != null) {  
        // 进入数字孪生模式
        setObjectOriWorldMatrix(objID, newMatrix);           
    }
}

// 设置批注的权限，
function CMSetUserCanCommentFlag(type) {
    setUsrCommentRight(type);
}

// 设置批注作者信息
function CMSetCommentUsrName(userName) {
    // 内部需要判断权限
    setCommentUsrName(userName);
}

// 创建批注信息
function CMAddComment() {
    setUsrCommentMode(1, 1);
}

// 删除批注信息
function CMDelComment() {
    // 内部需要判断权限
    deleteCommentInput();
}

// 导入批注信息
// 参数xmlDoc: XML Document对象
function CMImportComment(xmlDoc) {
    // 内部需要判断权限
    importComment(xmlDoc);
}

// 导出批注信息
// 返回值: XML Document对象
function CMExportComment() {
    // 内部需要判断权限
    return exportComment();
}

// 设置摄像机视角
function CMSetCameraPersonControl(personCtrl) {
    g_camera.setPersonControl(personCtrl);
}

// 摄像机绕u、v、n轴旋转，单位度
function CMCameraRotate(angleU, angleV, angleN) {
    glRunTime.rotate(angleU, angleV, angleN);
}

// 摄像机沿u、v、n轴滑动
function CMCameraSlide(dU, dV, dN) {
    g_camera.slide(dU, dV, dN);
}

// 设置摄像机view矩阵
function CMSetCameraViewMat(viewMat) {
    g_camera.setUsrViewMatrix(viewMat);
}
