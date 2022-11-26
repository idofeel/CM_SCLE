//===================================================================================================

// 版本号
const CMONLINE_VERSION = "2.2.0.2012";

// 模型树
function CM_MODELTREENODE() {
    this._uTreeNodeID = -1;
    this._uObjectID = -1;
    this._strName = "";
    this._uAnnoID = -1;		                // 标注（PMI）ID, Uint32
    this._bVisible = true;
    this._arrNodeParameters = new Array(); // 类型CM_NODEPARAMETER
    this._arrSubNode = new Array();        // 类型CM_MODELTREENODE
}

// 模型树节点参数
function CM_NODEPARAMETER() {
    this._strName = "";     // 字符串
    this._strValue = "";    // 字符串
}

// 材质信息
function CM_MATERIALINFO() {
    this._strName = "";
    this._uMaterialID = 0;
}

// 包围盒
function CM_BOX() {
    this._arrVertex = new Array(); // 包围盒8个顶点坐标，每个坐标有x、y、z属性
}

// 三维向量(单精)
function CM_BASEFLOAT3(){
	this.x = 0.0;				// Float32
	this.y = 0.0;				// Float32
	this.z = 0.0;				// Float32

    this.set = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

// 摄像机
function CM_CAMERA() {  
    this._vEyePos = new CM_BASEFLOAT3();			        // 摄像机位置
    this._vFocus = new CM_BASEFLOAT3();			            // 摄像机焦点
    this._vUp = new CM_BASEFLOAT3();			            // 摄像机上方向
    this._fZNear = 0;				                        // 近平面, Float32
    this._fZFar = 0;				                        // 远平面, Float32  
} 

// 场景事件
function CM_SCENEANIMNODE() {
    this._uTimeNodeID = -1;					        // 节点对应的时间节点ID, Uint32
	this._strName = '';					            // 名称
	this._strNote = '';					            // 注释
	this._uStart = 0;				                // 起始帧, Uint32
    this._uEnd = 0;					                // 帧长度, Uint32
    this._arrSubNode = new Array();			        // 子节点，存储CM_SCENEANIMNODE对象
}

// 拾取三维物体
function CM_PICK_ELEMENT() {
    this._uPickType = CM_PICK_TYPE_NONE;            // 拾取的元素类型，见CM_PICK_TYPE枚举值
    this._arrPickElements = new Array();            // 拾取元素的ID数组，单选时只有一个元素
}

const CMHOME_TYPE_ALL = 0;
const CMHOME_TYPE_POSITION = 1;
const CMHOME_TYPE_COLOR = 2;
const CMHOME_TYPE_TRANS = 3;
const CMHOME_TYPE_VISIBLE = 4;
const CMHOME_TYPE_ANNOT = 5;
const CMHOME_TYPE_CAMERA = 6;

const CMMEASURE_NONE = 0;
const CMMEASURE_OBJECT = 1;
const CMMEASURE_SURFACE = 2;
const CMMEASURE_CURVE = 3;
const CMMEASURE_TWO_CURVES = 4;
const CMMEASURE_POINT = 5;
const CMMEASURE_TWO_POINTS = 6;

const CMCAPTURE_NONE = 0;
const CMCAPTURE_OBJECT = 1;
const CMCAPTURE_GEOM_SURFACE = 3;
const CMCAPTURE_GEOM_CURVE = 4;
const CMCAPTURE_GEOM_POINT = 5;

const CM_BASE_OPT_MODE_DEFAULT = 0;
const CM_BASE_OPT_MODE_MOVE = 1;
const CM_BASE_OPT_MODE_ROTATE = 2;

const CM_AT_UNKNOWN = 0;
const CM_AT_DIMENSION = 1;
const CM_AT_NOTE = 2;
const CM_AT_DATUM = 3;
const CM_AT_GTOL = 4;
const CM_AT_SURFFINISH = 5;
const CM_AT_TECHREQU = 6;

const CM_RUNTIME_MODE_NORMAL = -1;
const CM_RUNTIME_MODE_ANNOTATION = 0;
const CM_RUNTIME_MODE_MEASURE = 1;
const CM_RUNTIME_MODE_SECTION = 2;
const CM_RUNTIME_MODE_PMI = 3;

const CM_PICK_TYPE_NONE = 0;
const CM_PICK_TYPE_PART = 1;
const CM_PICK_TYPE_SURFACE = 2;
const CM_PICK_TYPE_CURVE = 3;
const CM_PICK_TYPE_POINT = 4;
const CM_PICK_TYPE_OPT_COORD = 10;
const CM_PICK_TYPE_OPT_PLANE = 11;
const CM_PICK_TYPE_PMI_ITEM = 20;

function CM_CALLBACKS() {
    // 回调函数，刷新界面
    this.CMOnUpdateUICallBack = function () { }
    // 回调函数，使用当前帧数刷新进度条
    this.CMOnAnimRefreshCallBack = function (frame) { }
    // 回调函数，设置暂停/继续图标状态，当动画播放完毕时自动设置成暂停状态
    this.CMOnAnimFinishCallBack = function (isPause) { }
    // 回调函数，键盘按下事件，发生在CMOnline已经执行内部事件之后
    this.CMOnKeyboardDownCallBack = function (event) { }
    // 回调函数，键盘抬起事件，发生在CMOnline已经执行内部事件之后
    this.CMOnKeyboardUpCallBack = function (event) { }
    // 回调函数，鼠标按下事件，发生在CMOnline已经执行内部事件之后
    this.CMOnMouseDownCallBack = function (event) { }
    // 回调函数，鼠标抬起事件，发生在CMOnline已经执行内部事件之后
    this.CMOnMouseUpCallBack = function (event) { }
    // 回调函数，鼠标拖拽事件，发生在CMOnline已经执行内部事件之后
    this.CMOnMouseMoveCallBack = function (event) { }
    // 回调函数，鼠标滚轮事件，发生在CMOnline已经执行内部事件之后
    this.CMOnMouseWheelCallBack = function (event) { }
    // 回调函数，手机触屏按下事件，发生在CMOnline已经执行内部事件之后
    this.CMOnTouchStartCallBack = function (event) { }
    // 回调函数，手机触屏滑动事件，发生在CMOnline已经执行内部事件之后
    this.CMOnTouchMoveCallBack = function (event) { }
    // 回调函数，手机触屏抬起事件，发生在CMOnline已经执行内部事件之后
    this.CMOnTouchEndCallBack = function (event) { }
    // 回调函数, 摄像机变化, 发生在视图矩阵变化之后
    this.CMOnCameraChangeCallback = function() {}
    // 回调函数，模型加载完毕
    this.CMOnLoadModelEndCallback = function () { }
}

function CM_SETTINGS() {
    // 设置CMOnline内置背景图片，Resource目录下，默认blue.jpg
    this.defaultBgImage = "";
    // 设置背景图片URL，如果不为空则使用此背景图片
    this.defaultBgUrl = "";
    // 设置场景灯光，默认开启
    this.defaultLightOn = true;
    // 设置几何数据开关，默认开启
    this.defaultGeomtryOn = true;
    // 设置基础操作类型
    this.defaultBaseOptMode = 0;
    // 设置canvas是否透明，默认不透明 （true为透明效果， false为不透明效果）
    this.defaultCanvasTransparency = false;
}

// CMOnline 库是否已经加载完毕
let isLoadedLib = false;
let g_CLEModule = true; // CLE到SCLE数据转换使能开关
var g_BasisModule = false;
let isCleModuleReady = false;

// 动态加载 CMOnline 依赖库，解决不同 vue 版本兼容的问题
function loadCMOnlineLib (cb) {
    // CMOnline 库依赖列表，并按顺序加载
    const CMONLINE_LIB_DEPENDENCY_LIST = [
        'CMOnlineToolkit/UI/CMvendor.js',
        'CMOnlineToolkit/UI/app.js',
        'CMOnlineToolkit/JSZip/jszip.js',
        'CMOnlineToolkit/base64/base64.js',
        'CMOnlineToolkit/SCLELoader/ADFBaseDef.js',
        'CMOnlineToolkit/SCLELoader/ADFGeomDef.js',
        'CMOnlineToolkit/SCLELoader/ADFSceneDef.js',
        'CMOnlineToolkit/SCLELoader/ADFCleParser.js',
        'CMOnlineToolkit/SCLELoader/ADFMath.js',
        'CMOnlineToolkit/SCLELoader/ADFGlobal.js',
        'CMOnlineToolkit/SCLELoader/ADFUSDK.js',
        'CMOnlineToolkit/SCLERender/glmatrix.js',
        'CMOnlineToolkit/SCLERender/GLSL.js',
        'CMOnlineToolkit/SCLERender/MaterialDefine.js',
        'CMOnlineToolkit/SCLERender/GeomtryDefine.js',
        'CMOnlineToolkit/SCLERender/Global.js',
        'CMOnlineToolkit/SCLERender/SceneToGLData.js',
        'CMOnlineToolkit/SCLERender/Camera.js',
        'CMOnlineToolkit/SCLERender/WebGL3D.js',
        'CMOnlineToolkit/SCLERender/Kernel/Canvas2D.js',
        'CMOnlineToolkit/SCLERender/Kernel/SceneAnnotation.js',
        'CMOnlineToolkit/SCLERender/Kernel/SceneMeasure.js',
        'CMOnlineToolkit/SCLERender/Kernel/SceneSectionCal.js',
        'CMOnlineToolkit/SCLERender/Kernel/SceneSection.js',
        'CMOnlineToolkit/SCLERender/Kernel/ScenePmiManager.js',
        'CMOnlineToolkit/SCLERender/Kernel/IntersectTool.js',
        'CMOnlineToolkit/SCLERender/Kernel/GLProgram.js',
        'CMOnlineToolkit/SCLERender/GLRunTime.js',
        'CMOnlineToolkit/SCLERender/EventAction.js',
        'CMOnlineToolkit/SCLERender/Kernel/XmlTool.js',
        'CMOnlineToolkit/SCLERender/Kernel/Texturer.js',
    ]
    
    if (g_CLEModule) {
        CMONLINE_LIB_DEPENDENCY_LIST.push('CMOnlineToolkit/CLEParser/CLEBindings.js');
    }
    if (g_BasisModule) {
        CMONLINE_LIB_DEPENDENCY_LIST.push('CMOnlineToolkit/basis/texture_basisu.js');
        CMONLINE_LIB_DEPENDENCY_LIST.push('CMOnlineToolkit/basis/basis_transcoder.js');
    }

    // 库已经加载过了，无需再次加载，直接返回
    if (isLoadedLib) {
        cb && cb(false, '');
        return;
    };

    const loadList = CMONLINE_LIB_DEPENDENCY_LIST.map(function(item) { return item; });
    const total = loadList.length;
    let count = 0;

    function load () {
        // 加载完毕
        if (count === total) {
            isLoadedLib = true;
            cb && cb(false, '');
            return;
        }

        // 按顺序取出依赖
        const dependency = loadList.shift();
        // 创建 script 标签，加载依赖
        const script = document.createElement('script');
        script.src = dependency;
        // 加载完成事件
        script.onload = function() {
            count++;
            load();
        }
        // 加载失败事件
        script.onerror = function() {
            cb && cb(true, dependency);
        }
        document.body.appendChild(script);
    }

    load();
}

// 声明 Module，用于在 CMOnline 库初始化完成之后接收到通知
var Module = {        
    onRuntimeInitialized: function() {
        // 没有 g_CLEModule 时轮询检查
        if (!g_CLEModule) {
            var _this = this;
            setTimeout(function() {
                _this.onRuntimeInitialized();
            }, 1000);
            return;
        }else{
            isCleModuleReady = true;
        }

        Module._init();
    }
};

//===================================================================================================

function CMOnlineLib(dom, callbacks, settings) {
    g_nEventVersion = 3;
    initComponet(dom);
    initModuleCallbacks(callbacks);
    initSettings(settings);

    this.CMVersion = CMVersion;
    this.CMInitData = CMInitData;
    this.CMUninitData = CMUninitData;
    this.CMHome = CMHome;
    this.CMGetPickElements = CMGetPickElements;

    this.CMChangeView = CMChangeView;
    this.CMSetViewOnSelObjs = CMSetViewOnSelObjs;
    this.CMViewRotate = CMViewRotate;
    this.CMViewScale = CMViewScale;

    this.CMGetSelObjIDs = CMGetSelObjIDs;
    this.CMSetClearSelStatus = CMSetClearSelStatus;
    this.CMSetSelObjVisible = CMSetSelObjVisible;
    this.CMGetSelObjTransparent = CMGetSelObjTransparent;
    this.CMSetSelObjTransparent = CMSetSelObjTransparent;
    this.CMGetObjVisible = CMGetObjVisible
    this.CMSetObjVisible = CMSetObjVisible
    this.CMGetObjTransparent = CMGetObjTransparent;
    this.CMSetObjTransparent = CMSetObjTransparent;
    this.CMGetObjName = CMGetObjName
    this.CMGetObjParams = CMGetObjParams
    this.CMSetObjsHighlight = CMSetObjsHighlight;
    this.CMGetObjsCenterPos = CMGetObjsCenterPos;
    this.CMSetObjsEnhancedDisplay = CMSetObjsEnhancedDisplay;
    this.CMGetObjBox = CMGetObjBox;
    this.CMGetObjModelID = CMGetObjModelID;

    this.CMAnimPlay = CMAnimPlay;
    this.CMAnimPause = CMAnimPause;
    this.CMAnimResume = CMAnimResume;
    this.CMAnimStop = CMAnimStop;
    this.CMGetAnimFrames = CMGetAnimFrames;
    this.CMSetAnimCurFrame = CMSetAnimCurFrame;
    this.CMGetAnimCurFrame = CMGetAnimCurFrame;
    this.CMAnimPlayRange = CMAnimPlayRange;
    this.CMSetAnimCameraOn = CMSetAnimCameraOn;

    this.CMSetBkImage = CMSetBkImage;
    this.CMSetBkColor = CMSetBkColor;
    this.CMGetBkColor = CMGetBkColor;
    
    this.CMSetSelShowFlag = CMSetSelShowFlag;
    this.CMSetSelStatusByObjIDs = CMSetSelStatusByObjIDs;
    this.CMSetMultSelFlag = CMSetMultSelFlag;
    this.CMSetMoveObjFlag = CMSetMoveObjFlag;
    this.CMSetMotionCaptureFlag = CMSetMotionCaptureFlag;
    this.CMSetBaseOperatorMode = CMSetBaseOperatorMode;

    this.CMGetModelTreeRootNode = CMGetModelTreeRootNode;
    this.CMGetModelTreeObjects = CMGetModelTreeObjects;
    this.CMSetModelTreeObjectsTrans = CMSetModelTreeObjectsTrans;

    this.CMGetSceneCount = CMGetSceneCount;
    this.CMGetSceneInfo = CMGetSceneInfo;
    this.CMPlaySceneAnim = CMPlaySceneAnim;
    this.CMGetAllSceneAnimNodeData = CMGetAllSceneAnimNodeData;
    this.CMPlaySceneAnimRange = CMPlaySceneAnimRange;
    
    this.CMTwinStart = CMTwinStart;
    this.CMTwinTerminal = CMTwinTerminal;
    this.CMSetObjectOriWorldMatrix = CMSetObjectOriWorldMatrix;
    this.CMGetObjectOriWorldMatrix = CMGetObjectOriWorldMatrix;
    this.CMGetObjectCurWorldMatrix = CMGetObjectCurWorldMatrix;
    this.CMSetCameraCurView = CMSetCameraCurView;

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
    this.CMSetCameraView = CMSetCameraView;
    this.CMGetCameraView = CMGetCameraView;

    this.CMSetMotionCaptureMode = CMSetMotionCaptureMode;
    this.CMGetMotionCaptureObjID = CMGetMotionCaptureObjID;

    this.CMSetMeasureMode = CMSetMeasureMode;
    this.CMCancelMeasureMode = CMCancelMeasureMode;
    this.CMGetMeasureUnitIndex = CMGetMeasureUnitIndex;
    this.CMSetMeasureUnitVisibe = CMSetMeasureUnitVisibe;
    this.CMDeleteMeasureUnit = CMDeleteMeasureUnit;
    this.CMExportMeasureUint = CMExportMeasureUint;

    this.CMGetMetialList = CMGetMetialList;
    this.CMGetObjMaterialList = CMGetObjMaterialList;
    this.CMSetObjMaterialID = CMSetObjMaterialID;
    this.CMSetObjMaterialIDEx = CMSetObjMaterialIDEx;
    this.CMSetObjectMaterialBasis = CMSetObjectMaterialBasis;
    this.CMClearObjMaterial = CMClearObjMaterial;

    this.CMSetSceneLightOn = CMSetSceneLightOn;
    this.CMSetSceneLightPower = CMSetSceneLightPower;

    this.CMGetModelList = CMGetModelList;
    this.CMUpdateModel = CMUpdateModel;
    this.CMFinishLoadModel = CMFinishLoadModel;

    this.CMInitPmi = CMInitPmi;
    this.CMUnInitPmi = CMUnInitPmi;
    this.CMGetAnnotViewIDByTreeID = CMGetAnnotViewIDByTreeID;
    this.CMGetAnnotViewName = CMGetAnnotViewName;
    this.CMShiftAnnotView = CMShiftAnnotView;
    this.CMSetAnnotVisibleInView = CMSetAnnotVisibleInView;
    this.CMGetAnnotIDInView = CMGetAnnotIDInView;
    this.CMGetViewIDByAnnotID = CMGetViewIDByAnnotID;
    this.CMGetAnnotName = CMGetAnnotName;
    this.CMGetAnnotType = CMGetAnnotType;
    this.CMIsAnnotVisible = CMIsAnnotVisible;
    this.CMSetAnnotVisible = CMSetAnnotVisible;
    this.CMGetSelAnnotID = CMGetSelAnnotID;
    this.CMSelectAnnot = CMSelectAnnot;
    this.CMClearAnnotSelected = CMClearAnnotSelected;
    this.CMChangeCameraFaceToAnnot = CMChangeCameraFaceToAnnot;
    this.CMChangeCameraFocusToAnnot = CMChangeCameraFocusToAnnot;
    this.CMSetPmiDispColor = CMSetPmiDispColor;
    this.CMSetPmiSelDispColor = CMSetPmiSelDispColor;
    this.CMResetPmiDispColor = CMResetPmiDispColor;

    this.CMInitSection = CMInitSection;
    this.CMUnInitSection = CMUnInitSection;
    this.CMSetClipEnable = CMSetClipEnable;
    this.CMGetClipEnable = CMGetClipEnable;
    this.CMSetClipVisible = CMSetClipVisible;
    this.CMGetClipVisible = CMGetClipVisible;
    this.CMSetClipRevert = CMSetClipRevert;
    this.CMResetClip = CMResetClip;
    this.CMSetClipMove = CMSetClipMove;
    this.CMGetClipPosition = CMGetClipPosition;
    this.CMGetClipLastMove = CMGetClipLastMove;
    this.CMSetClipRoate = CMSetClipRoate;
    this.CMGetClipDirection = CMGetClipDirection;
    this.CMGetClipLastRotate = CMGetClipLastRotate;
    this.CMSelectClip = CMSelectClip;
    this.CMGetSelectedClip = CMGetSelectedClip;
}

//===================================================================================================

var g_ImportSecFileFlag = false;
var g_LoadFileTimeTimeID;

//===================================================================================================

// 版本信息
function CMVersion() {
    return CMONLINE_VERSION;
}

function RealLoadSCLEFile() {
    // 解析cle文件
    var bResult = ParseCleStream();
    if (!bResult) {
        // 清除缓存                        
        // delete g_cleParser._arrayCleBuffer;
        g_cleParser._arrayCleBuffer = null;
        g_cleParser._arrayByteBuffer = null;
        return;
    }
    // 清除缓存                        
    // delete g_cleParser._arrayCleBuffer;
    g_cleParser._arrayCleBuffer = null;
    g_cleParser._arrayByteBuffer = null;

    if (g_ImportSecFileFlag) {
        // 导入剖切图标
        glRunTime.importScle(ADDITION_OBJECT_SECTION_TOOL);
    } else {
        // 绘制三维模型
        startRender();
    }
}

function StartLoadSCLEFile() {
    window.clearInterval(g_LoadFileTimeTimeID);
    RealLoadSCLEFile();
}

function StartLoadCLEFile(cledata) {
    if (!isCleModuleReady) {
        return;
    }

    window.clearInterval(g_LoadFileTimeTimeID);
    // 以当前时间作为随机文件名
    var name = Date.now().toString();
    // 与WebAssembly约定的数据交换目录
    var path = "/tmp/";
    // 将CLE数据保存至约定的内存文件系统目录
    var fs = FS.open(path + name + ".cle", "w+");
    var inputData = new Uint8Array(cledata);
    FS.write(fs, inputData, 0, inputData.length, 0);
    FS.close(fs);
    FS.syncfs(true, function (err) {
    });

    // 从CLE到SCLE的格式转换
    Module._do(name);

    // 初始化数据
    InitCleStream();

    // 从内存文件系统读取转换后的SCLE数据
    var OutData = FS.readFile(path + name + ".scle");
    g_cleParser._arrayByteBuffer = OutData.buffer;
    g_cleParser._arrayCleBuffer = new DataView(g_cleParser._arrayByteBuffer, 0, g_cleParser._arrayByteBuffer.byteLength);
    g_cleParser._nCleBufferlength = OutData.length;

    RealLoadSCLEFile();
}

// 加载数据
function CMInitData(cledata, licdata) {
    CMUninitData();
    
    g_ImportSecFileFlag = false;

    if (cledata.length < 10) {
        return;
    }
    if (cledata.licdata < 4) {
        return;
    }
    g_licData = licdata;

    // 读取文件头，判断是cle文件，还是scle文件
    var tempDataView = new DataView(cledata, 0, 2);
    var byteHeaer = tempDataView.getUint16(0, true);
    // 无压缩的scle文件
    if (byteHeaer == 2 || byteHeaer == 3) {
        // 初始化数据
        InitCleStream();

        g_cleParser._arrayByteBuffer = cledata;
        g_cleParser._arrayCleBuffer = new DataView(g_cleParser._arrayByteBuffer, 0, g_cleParser._arrayByteBuffer.byteLength);
        g_cleParser._nCleBufferlength = g_cleParser._arrayByteBuffer.byteLength;

        RealLoadSCLEFile();
        return;
    }

    // 判断是否为CLE文件
    if (g_CLEModule) {
        if (byteHeaer == 67) {
            g_LoadFileTimeTimeID = window.setInterval(function(){ StartLoadCLEFile(cledata) }, 100);
            return;
        }
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
            // 初始化数据
            InitCleStream();

            g_cleParser._arrayByteBuffer = data;
            g_cleParser._arrayCleBuffer = new DataView(g_cleParser._arrayByteBuffer, 0, g_cleParser._arrayByteBuffer.byteLength);
            g_cleParser._nCleBufferlength = g_cleParser._arrayByteBuffer.byteLength;

            g_LoadFileTimeTimeID = window.setInterval(StartLoadSCLEFile(), 100);
        });
    });
}

// 清除数据
function CMUninitData() {
    destoryComponet();

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

// 视图操作：视角旋转
// 屏幕向右为X轴正方向，向上为Y轴正方向，向里为Z轴正方向
// angleX：模型向X轴正方向旋转
// angleY：模型向Y轴正方向旋转
// angleZ：模型饶Z轴正方向旋转，鼠标操作通常为0
function CMViewRotate(angleX, angleY, angleZ) {
    glRunTime.rotate(angleX, angleY, angleZ);
}

// 视图操作：视角缩放
// scale > 1.0表示放大一步
// scale < 1.0表示缩小一步
// 一步：对应于鼠标滚轮滚动一次
function CMViewScale(scale) {
    glRunTime.scale(scale);
}

// 模型复位
function CMHome(type) {
    glRunTime.home(type);
}

// 获取当前拾取的元素
function CMGetPickElements() {
    var cmPickElem = new CM_PICK_ELEMENT();
    transCMOnlinePickElem(cmPickElem, glRunTime.curPickUnit);
    return cmPickElem;
}

// 获取选择的物件Id，返回值为array类型
function CMGetSelObjIDs() {
    return glRunTime.getPickObjectIds();
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
    glRunTime.setObjectVisible(-1, isVisible);
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
    glRunTime.setObjectTransparent(null, alpha);
}

function CMGetObjVisible(objID) {
    let objectIndex = glRunTime.getObjectIndexById(objID);
    return glRunTime.getObjectVisible(objectIndex);
}

function CMSetObjVisible(objID, isVisible) {
    let objectIndex = glRunTime.getObjectIndexById(objID);
    return glRunTime.setObjectVisible(objectIndex, isVisible);
}

function CMGetObjTransparent(objID) {
    let objectIndex = glRunTime.getObjectIndexById(objID);
    return glRunTime.getObjectTransparent(objectIndex);
}

function CMGetObjName(objID) {
    return glRunTime.getObjectNameByID(objID, g_GLData.GLModelTreeNode);
}

function CMGetObjParams(objID) {
    return glRunTime.getObjectParamsByID(objID, g_GLData.GLModelTreeNode);
}

// 设置指定物件的透明渲染状态
// 如果objIDs为null或者元素个数为0，则默认表示操作当前选中模型
function CMSetObjTransparent(objIDs, alpha) {
    if (alpha < 0.0 || alpha > 1.0) {
        return;
    }
    glRunTime.setObjectTransparent(objIDs, alpha);
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

// 弱化其余模型的透明度，以增强选择模型的显示效果
// 输入：treeNodeId模型树节点ID
function CMSetObjsEnhancedDisplay(treeNodeId) {
    return glRunTime.setObjectEnhancedDisplayByTreeId(treeNodeId);
}

// 获取指定物件的包围盒
function CMGetObjBox(objID) {
    return getObjectBoxById(objID);
}

function CMGetObjModelID(objID) {
    return glRunTime.getObjectModelId(objID);
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
        animRun();
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

// 设置动画播放倍速
// 可选值：0.5 - 10.0
function CMSetAnimSpeed(speed) {
    return setAnimSpeed(speed);
}

// 获取当前动画播放倍速
function CMGetAnimSpeed() {
    return getAnimSpeed();
}

// 从指定帧到指定帧播放动画
function CMAnimPlayRange(nStartPos, nEndPos) {
    return PlayUsrFrameAnimation(nStartPos, nEndPos);
}

// 设置是否播放摄像机动画
function CMSetAnimCameraOn(isOn) {
    setAnimType(true, isOn, true);
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

// 设置背景颜色
function CMSetBkColor(r, g, b) {
    glRunTime.setBackgroundColor(r, g, b);
}

// 获取背景颜色
// 只有在背景是颜色填充时有效，返回颜色数组，成员分别为r,g,b颜色分量
// 背景是图片时返回null
function CMGetBkColor() {
    return glRunTime.getBackgroundColor();
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

// 设置基础操作类型
function CMSetBaseOperatorMode(mode) {
    setBaseOperationMode(mode);
}

// 获取模型树根节点
function CMGetModelTreeRootNode() {
    return g_GLData.GLModelTreeNode;
}

// 获取模型树节点下的所有自物件id
function CMGetModelTreeObjects(treeId) {
    return getSubObjectsByTreeId(treeId);
}

// 平移模型树节点下的所有物件
// x, y ,z分别为世界坐标系方向上的位移分量
function CMSetModelTreeObjectsTrans(treeId, x, y, z) {
    return setSubObjectMoveByTreeId(treeId, x, y, z);
}

// 获取第一层场景事件数量
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
        if (index >= 0 && index < g_sceneData.stuTimeNodeTreeTop._arrSubNode.length) {
            data._uTimeNodeID = g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._uTimeNodeID;
            data._strName = g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._strName;
            data._strNote = g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._strNote;
            data._uStart = g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._uStartFrameID;
            data._uEnd = g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._uStartFrameID+g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._uFrameSize;
        }
    }
}

// 播放场景事件动画
function CMPlaySceneAnim(index) {
    if (g_sceneData != null) {
        if (index >= 0 && index < g_sceneData.stuTimeNodeTreeTop._arrSubNode.length) {
            g_nAnimationStart = g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._uStartFrameID;
            g_nAnimationEnd = g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._uStartFrameID + g_sceneData.stuTimeNodeTreeTop._arrSubNode[index]._uFrameSize;

            animTerminal();
            PlaySceneAnimation();
        }
    }
}

// 播放场景事件动画
function CMPlaySceneAnimRange(start, end) {
    g_nAnimationStart = start;
    g_nAnimationEnd = end;

    animTerminal();
    PlaySceneAnimation();
}

// 获取所有场景事件信息
function CMGetAllSceneAnimNodeData(data) {
    if (g_sceneData != null) {
        for (var i in g_sceneData.stuTimeNodeTreeTop._arrSubNode){
            data[i] = new CM_SCENEANIMNODE;
			data[i]._uTimeNodeID = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._uTimeNodeID;
            data[i]._strName = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._strName;
            data[i]._strNote = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._strNote;
            data[i]._uStart = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._uStartFrameID;
            data[i]._uEnd = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._uStartFrameID+g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._uFrameSize;
            for (var j in g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode){
                data[i]._arrSubNode[j] = new CM_SCENEANIMNODE;
                data[i]._arrSubNode[j]._uTimeNodeID = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._uTimeNodeID;
                data[i]._arrSubNode[j]._strName = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._strName;
                data[i]._arrSubNode[j]._strNote = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._strNote;
                data[i]._arrSubNode[j]._uStart = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._uStartFrameID;
                data[i]._arrSubNode[j]._uEnd = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._uStartFrameID+g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._uFrameSize;
            }
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

// 获取物件的原始世界矩阵
function CMGetObjectOriWorldMatrix(objID) {
    if (g_sceneData != null) {
        return getObjectOriWorldMatrix(objID);
    }
}

// 获取物件当前的世界矩阵
function CMGetObjectCurWorldMatrix(objID) {
    if (g_sceneData != null) {
        return getObjectCurWorldMatrix(objID);
    }
}

// 设置当前摄像机参数
function CMSetCameraCurView(cmCamera) {
    if (g_sceneData != null) {
        return setCameraCurView(cmCamera);
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
function CMExportComment(xmlDoc) {
    // 内部需要判断权限
    return exportComment(xmlDoc);
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

// 设置摄像机参数, 参数是从 CMGetCameraView 得到的值
function CMSetCameraView(camera) {
    return setCameraView(camera); 
}

// 获取当前状态的摄像机参数
function CMGetCameraView() {
    return getCameraView();
}

// 设置测量模式
// measureMode：如果为NONE时表示取消测量；
// 其余有效值为物件、曲面、曲线、曲线与曲线、点、点与点模式
function CMSetMeasureMode(measureMode) {
    return setMeasureMode(measureMode);
}

// 取消测量状态
function CMCancelMeasureMode() {
    return cancelMeacureMode();
}

// 获取当前选取的测量单元索引
function CMGetMeasureUnitIndex() {
    return getMeasureUnitIndex();
}

// index: 选取的测量单元索引。
// 如果是-1则表示操作全部测量单元。
// 如果是-2，则表示操作当前已拾取的测量单元。
function CMSetMeasureUnitVisibe(index, visible) {
    return setMeasureUnitVisible(index, visible);
}

// index: 选取的测量单元索引。
// 如果是-1则表示操作全部测量单元。
// 如果是-2，则默认操作当前已拾取的测量单元。
function CMDeleteMeasureUnit(index) {
    return deleteMeasureUnit(index);
}

// index: 选取的测量单元索引。
// 如果是-1则表示导出全部测量单元。
// 如果是-2则表示导出当前已拾取的测量单元。
function CMExportMeasureUint(index) {
    return exportMeasureUnits(index);
}

// 设置鼠标动态捕捉类型
// 实时获取鼠标当前指向的几何元素
// captureMode：如果为NONE则表示关闭捕捉
// 其余有效值为：物件、几何曲面、几何曲线、几何顶点
function CMSetMotionCaptureMode(captureMode) {
    return setCaptureMode(captureMode);
}

// 获取鼠标动态指向的物件Id
function CMGetMotionCaptureObjID() {
    return motionCaptureObjID;
}

// 获取材质信息列表
function CMGetMetialList() {
    return getObjectMetialList(-1);
}

function CMGetObjMaterialList(objID) {
    return glRunTime.getObjectMetialList(objID);
}

// 设置物件的材质
function CMSetObjMaterialID(objID, objSubsetIndexs, uMtlID) {
    return setObjectMaterialID(objID, objSubsetIndexs, uMtlID);
}

function CMSetObjMaterialIDEx(objID, objSubsetIndexs, uMtlID, imageUrl) {
    return setObjectMaterialTexture2D(objID, objSubsetIndexs, uMtlID, imageUrl);
}

function CMSetObjectMaterialBasis(objID, objSubsetIndexs, uMtlID, basisBuff) {
    return setObjectMaterialTextureBasis(objID, objSubsetIndexs, uMtlID, basisBuff);
}

// 取消物件的材质
function CMClearObjMaterial(objID) {
    glRunTime.clearObjectSurfaceMaterial(objID);
}

// 设置场景光源开关
// isOn：true表示开启，false表示关闭，默认开启
function CMSetSceneLightOn(isOn) {
    glRunTime.setSceneLightOn(isOn);
}

// 设置场景光强，光源关闭时无效
// diffuse: 漫反射光 取值：0.0-1.0
// ambient: 自然光 取值：0.0-1.0
// sepcular: 高光 取值：0.0-1.0
function CMSetSceneLightPower(diffuse, ambient, sepcular) {
    glRunTime.setSceneLightPower(diffuse, ambient, sepcular);
}

// 获取模型列表
function CMGetModelList() {
    return getModelList();
}

// 更新模型数据
function CMUpdateModel(index, dataStream, isLoop) {
    updateModel(index, dataStream, isLoop);
}

// 加载模型结束
function CMFinishLoadModel() {
    glRunTime.endLoadScleModel();
}

// 导入剖切图标
function ImportSecTools() {
    g_ImportSecFileFlag = true;

    // 剖切坐标轴模型文件url
    var urlHref = window.location.href
    var urlSplitArr = urlHref.split('/')
    urlSplitArr.pop()
    var OriginUrlPath = urlSplitArr.join('/')
    var scleurl = OriginUrlPath + "/CMOnlineToolkit/Resource/SceneTool/SectionOperatorTool.scle";

    g_sclehttp = new XMLHttpRequest();

    g_sclehttp.open("GET", scleurl, true);
    g_sclehttp.responseType = "arraybuffer";
    g_sclehttp.overrideMimeType("text/plain; charset=x-user-defined");

    // 下载成功打开文件
    g_sclehttp.onreadystatechange = function (e) {
        if (g_sclehttp.readyState === 4 && g_sclehttp.status === 200) { // 4 = "loaded" // 200 = OK
            // 加载SCLE文件
            if (g_sclehttp.response < 10) {
                return;
            }
            // 兼容写法
            var new_zip = new JSZip();
            new_zip.loadAsync(g_sclehttp.response).then(function (zip) {
                var key = function () {
                    for (let i in zip.files) {
                        return i
                    }
                }
                zip.files[key()].async('arraybuffer').then(function (data) {
                    // 初始化数据
                    InitCleStream();
    
                    g_cleParser._arrayByteBuffer = data;
                    g_cleParser._arrayCleBuffer = new DataView(g_cleParser._arrayByteBuffer, 0, g_cleParser._arrayByteBuffer.byteLength);
                    g_cleParser._nCleBufferlength = g_cleParser._arrayByteBuffer.byteLength;
    
                    g_LoadFileTimeTimeID = window.setInterval(StartLoadSCLEFile(), 100);
                });
            });
        }
    }
    g_sclehttp.send();
}

function CMInitPmi() {
    if (g_scenePmiManager.init()) {
        glRunTime.curRuntimeMode = CM_RUNTIME_MODE_PMI;
        return true;
    }
    return false;
}

function CMUnInitPmi() {
    g_scenePmiManager.clearPmi();
    glRunTime.curRuntimeMode = CM_RUNTIME_MODE_NORMAL;
}

// 获取模型树节点的标注视图ID
function CMGetAnnotViewIDByTreeID(uTreeID) {
    return g_scenePmiManager.getPmiViewIdByTreeId(uTreeID);
}

// 获取标注视图的名称
function CMGetAnnotViewName(uAnnotViewID) {
    return g_scenePmiManager.getPmiViewName(uAnnotViewID);
}

// 切换显示标注视图
function CMShiftAnnotView(uAnnotViewID) {
    return g_scenePmiManager.shiftPmiView(uAnnotViewID);
}

// 设置标注视图内标注的显示/隐藏状态
function CMSetAnnotVisibleInView(arrViewIDs, bVisible) {
    return g_scenePmiManager.setPmiViewVisible(arrViewIDs, bVisible);
}

// 获取标注视图内的标注ID
function CMGetAnnotIDInView(uAnnotViewID) {
    return g_scenePmiManager.getPmiItemIdByViewId(uAnnotViewID);
}

// 获取标注所属的标注视图ID
function CMGetViewIDByAnnotID(uAnnotID) {
    return g_scenePmiManager.getPmiViewIdByItemId(uAnnotID);
}

// 获取标注的名称
function CMGetAnnotName(uAnnotID) {
    return g_scenePmiManager.getPmiItemName(uAnnotID);
}

// 获取标注的类型
function CMGetAnnotType(uAnnotID) {
    return g_scenePmiManager.getPmiItemType(uAnnotID);
}

// 获取标注的显示状态
function CMIsAnnotVisible(uAnnotID) {
    return g_scenePmiManager.getPmiItemVisibleById(uAnnotID) == true ? true : false;
}

// 设置标注的显示/隐藏状态
function CMSetAnnotVisible(arrAnnotIDs, bVisible) {
    for (let i in arrAnnotIDs) {
        g_scenePmiManager.setPmiItemVisibleById(arrAnnotIDs[i], bVisible);
    }
}

// 获取选中的标注ID
function CMGetSelAnnotID() {
    return g_scenePmiManager.getPickedItemId();
}

// 选取标注
function CMSelectAnnot(arrAnnotIDs) {
    for (let i in arrAnnotIDs) {
        g_scenePmiManager.pickItemById(arrAnnotIDs[i], true);
    }
}

// 清除所有标注的选中状态
function CMClearAnnotSelected() {
    g_scenePmiManager.clearPickItem();
}

// 更新当前摄像机使之正视于指定标注
function CMChangeCameraFaceToAnnot(uAnnotID) {
    return g_scenePmiManager.setFaceToPmiItem(uAnnotID);
}

// 更改摄像机焦点至指定标注
function CMChangeCameraFocusToAnnot(uAnnotID) {
    return g_scenePmiManager.setFocusOnPmiItem(uAnnotID);
}

function CMSetPmiDispColor(r, g, b) {
    return g_scenePmiManager.setPmiDisplayColor(r, g, b);
}

function CMSetPmiSelDispColor(r, g, b) {
    return g_scenePmiManager.setPmiSelectColor(r, g, b);
}
function CMResetPmiDispColor() {
    return g_scenePmiManager.resetPmiColor();
}

function CMInitSection(callbackFunc) {
    // 初始化剖切参数
    g_sceneSection.initSection(callbackFunc);
    glRunTime.curRuntimeMode = CM_RUNTIME_MODE_SECTION;

    g_sceneSection.beginSectionOperation();
    if (!g_sceneSection.isSecToolsInit()) {
        ImportSecTools();
    }
}

function CMUnInitSection() {
    // 释放剖切数据
    g_sceneSection.finishSectionOperation();
    g_sceneSection.clearSection();
    glRunTime.curRuntimeMode = CM_RUNTIME_MODE_NORMAL;
}

function CMSetClipEnable(clipIndex, isEnable) {
    return g_sceneSection.setEnableClipping(clipIndex, isEnable);
}

function CMGetClipEnable(clipIndex) {
    return g_sceneSection.getClippingEnable(clipIndex);
}

function CMSetClipVisible(clipIndex, isVisible) {
    return g_sceneSection.setVisibleClipping(clipIndex, isVisible);
}

function CMGetClipVisible(clipIndex) {
    return g_sceneSection.getVisibleClipping(clipIndex);
}

function CMSetClipRevert(clipIndex) {
    return g_sceneSection.setRevertClipping(clipIndex);
}

function CMResetClip(clipIndex) {
    g_sceneSection.resetClipPlanePos(clipIndex);
    g_sceneSection.resetClipPlaneDir(clipIndex);
    g_sceneSection.operateSectionReset(clipIndex);
}

function CMSetClipMove(clipIndex, distance) {
    return g_sceneSection.moveClipPlane(clipIndex, distance);
}

function CMGetClipPosition(clipIndex) {
    var pos = new CM_BASEFLOAT3(0, 0, 0);
    g_sceneSection.getPosClipPlane(clipIndex, pos);
    return pos;
}

function CMGetClipLastMove(clipIndex) {
    return g_sceneSection.getDistClipPlane(clipIndex);
}

function CMSetClipRoate(clipIndex, angleX, angleZ) {
    return g_sceneSection.rotateClipPlaneAxis(clipIndex, angleX, 0, angleZ);
}

function CMGetClipDirection(clipIndex) {
    var dir = new CM_BASEFLOAT3(0, 0, 0);
    g_sceneSection.getDirAngleClipPlane(clipIndex, dir);
    return dir;
}

function CMGetClipLastRotate(clipIndex) {
    var angles = new CM_BASEFLOAT3(0, 0, 0);
    g_sceneSection.getAngleClipPlane(clipIndex, angles);
    return angles;
}

function CMSelectClip(clipIndex) {
    return g_sceneSection.setPlanePicked(clipIndex);
}

function CMGetSelectedClip() {
    return g_sceneSection.getPickedPlane();
}
