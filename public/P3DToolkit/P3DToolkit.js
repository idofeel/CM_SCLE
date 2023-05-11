//===================================================================================================

// 版本号
const P3DTOOLKIT_VERSION = "3.0.0.3004";

// 模型树
function P3D_MODELTREENODE() {
    this._uTreeNodeID = -1;
    this._uObjectID = -1;
    this._strName = "";
    this._uAnnoID = -1;		                // 标注（PMI）ID, Uint32
    this._bVisible = true;
    this._arrNodeParameters = new Array(); // 类型P3D_NODEPARAMETER
    this._arrSubNode = new Array();        // 类型P3D_MODELTREENODE
}

// 模型树节点参数
function P3D_NODEPARAMETER() {
    this._strName = "";     // 字符串
    this._strValue = "";    // 字符串
}

// 材质信息
function P3D_MATERIALINFO() {
    this._strName = "";
    this._uMaterialID = 0;
}

// 包围盒
function P3D_BOX() {
    this._arrVertex = new Array(); // 包围盒8个顶点坐标，每个坐标有x、y、z属性
}

// 三维向量(单精)
function P3D_BASEFLOAT3(){
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
function P3D_CAMERA() {  
    this._vEyePos = new P3D_BASEFLOAT3();			        // 摄像机位置
    this._vFocus = new P3D_BASEFLOAT3();			        // 摄像机焦点
    this._vUp = new P3D_BASEFLOAT3();			            // 摄像机上方向
    this._fFOVY = 0;				                        // Y方向的视角
    this._fAspect = 0;				                        // 宽高比
    this._fZNear = 0;				                        // 近平面, Float32
    this._fZFar = 0;				                        // 远平面, Float32  
    this._fInterocularDistance = 0;				            // 目间距
} 

// 场景事件
function P3D_SCENEANIMNODE() {
    this._uTimeNodeID = -1;					        // 节点对应的时间节点ID, Uint32
	this._strName = '';					            // 名称
	this._strNote = '';					            // 注释
	this._uStart = 0;				                // 起始帧, Uint32
    this._uEnd = 0;					                // 帧长度, Uint32
    this._arrSubNode = new Array();			        // 子节点，存储P3D_SCENEANIMNODE对象
}

// 拾取三维物体
function P3D_PICK_ELEMENT() {
    this._uPickType = P3D_PICK_TYPE_NONE;           // 拾取的元素类型，见P3D_PICK_TYPE枚举值
    this._arrPickElements = new Array();            // 拾取元素的ID数组，单选时只有一个元素
}

// 注释信息
function P3D_COMMENTINFO() {
	this._uCommentID  = -1;					        // 注释ID
	this._szUserName = '';		                    // 注释作者
	this._szDateTime = '';		                    // 注释日期时间,格式:20170810092832，前8位表示日期，后期6位表示时间
	this._stuCamera = new P3D_CAMERA;				 // 注释摄像机数据

	this._szName = '';			                    // 注释名字
	this._szText = '';			                    // 注释内容

	this._planeOrigin = new P3D_BASEFLOAT3();		// 三维注释平面原点坐标
	this._planeX = new P3D_BASEFLOAT3();				// 三维注释平面坐标系x轴方向
	this._planeY = new P3D_BASEFLOAT3();				// 三维注释平面坐标系y轴方向
	this. _planeZ = new P3D_BASEFLOAT3();			// 三维注释平面坐标系z轴方向

	this._bVisible = true;							// 是否可见
	this._bIsFront = false;							// 是否前端显示
	this._bIsScreenAnnot = true;					// 是否为屏幕标注（若为屏幕标注,则"是否前端显示"无意义）

	this._attachPos = new P3D_BASEFLOAT3();			// 放置位置
    this._arrLeaderPos = new Array();			    // 引线位置，存储P3D_BASEFLOAT3对象
    this._arrLeaderObjId = new Array();			    // 引线所指物件id

    this._uStartFrameID = 0;
    this._uEndFrameID = 0;
}

function P3D_SETTINGS() {
    // 设置P3DToolKit内置背景图片，Resource目录下，默认blue.jpg
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

//===================================================================================================

const P3D_HOME_TYPE_ALL = 0;
const P3D_HOME_TYPE_POSITION = 1;
const P3D_HOME_TYPE_COLOR = 2;
const P3D_HOME_TYPE_TRANS = 3;
const P3D_HOME_TYPE_VISIBLE = 4;
const P3D_HOME_TYPE_ANNOT = 5;
const P3D_HOME_TYPE_CAMERA = 6;

const P3D_MEASURE_NONE = 0;
const P3D_MEASURE_OBJECT = 1;
const P3D_MEASURE_SURFACE = 2;
const P3D_MEASURE_CURVE = 3;
const P3D_MEASURE_TWO_CURVES = 4;
const P3D_MEASURE_POINT = 5;
const P3D_MEASURE_TWO_POINTS = 6;

const P3D_CAPTURE_NONE = 0;
const P3D_CAPTURE_OBJECT = 1;
const P3D_CAPTURE_GEOM_SURFACE = 3;
const P3D_CAPTURE_GEOM_CURVE = 4;
const P3D_CAPTURE_GEOM_POINT = 5;

const P3D_BASE_OPT_MODE_DEFAULT = 0;
const P3D_BASE_OPT_MODE_MOVE = 1;
const P3D_BASE_OPT_MODE_ROTATE = 2;

const P3D_AT_UNKNOWN = 0;
const P3D_AT_DIMENSION = 1;
const P3D_AT_NOTE = 2;
const P3D_AT_DATUM = 3;
const P3D_AT_GTOL = 4;
const P3D_AT_SURFFINISH = 5;
const P3D_AT_TECHREQU = 6;

const P3D_RUNTIME_MODE_NORMAL = -1;
const P3D_RUNTIME_MODE_ANNOTATION = 0;
const P3D_RUNTIME_MODE_MEASURE = 1;
const P3D_RUNTIME_MODE_SECTION = 2;
const P3D_RUNTIME_MODE_PMI = 3;

const P3D_PICK_TYPE_NONE = 0;
const P3D_PICK_TYPE_PART = 1;
const P3D_PICK_TYPE_SURFACE = 2;
const P3D_PICK_TYPE_CURVE = 3;
const P3D_PICK_TYPE_POINT = 4;
const P3D_PICK_TYPE_OPT_COORD = 10;
const P3D_PICK_TYPE_OPT_PLANE = 11;
const P3D_PICK_TYPE_PMI_ITEM = 20;

const P3D_OBJ_MOVE_TYPE_WINDOW = 0;
const P3D_OBJ_MOVE_TYPE_WORLD_PARMS = 1;
const P3D_OBJ_MOVE_TYPE_WORLD_NAVIGATOR = 2;

const P3D_EXPLODE_MODE_X = 0;
const P3D_EXPLODE_MODE_Y = 1;
const P3D_EXPLODE_MODE_Z = 2;
const P3D_EXPLODE_MODE_FREE = 3;

const P3D_RENDER_MODE_SHADER = 0;
const P3D_RENDER_MODE_FRAME = 1;
const P3D_RENDER_MODE_PROJECTION = 2;
const P3D_RENDER_MODE_HALF_TRANSPARENT = 3;
const P3D_RENDER_MODE_WIRE_FRAME = 4;
const P3D_RENDER_MODE_INK = 5;
const P3D_RENDER_MODE_X_RAY = 6;
const P3D_RENDER_MODE_PBR = 7;

//===================================================================================================

function P3D_CALLBACKS() {
    // 回调函数，刷新界面
    this.P3D_OnUpdateUICallBack = function () { }
    // 回调函数，使用当前帧数刷新进度条
    this.P3D_OnAnimRefreshCallBack = function (frame) { }
    // 回调函数，设置暂停/继续图标状态，当动画播放完毕时自动设置成暂停状态
    this.P3D_OnAnimFinishCallBack = function (isPause) { }
    // 回调函数，键盘按下事件，发生在P3DToolKit已经执行内部事件之后
    this.P3D_OnKeyboardDownCallBack = function (event) { }
    // 回调函数，键盘抬起事件，发生在P3DToolKit已经执行内部事件之后
    this.P3D_OnKeyboardUpCallBack = function (event) { }
    // 回调函数，鼠标按下事件，发生在P3DToolKit已经执行内部事件之后
    this.P3D_OnMouseDownCallBack = function (event) { }
    // 回调函数，鼠标抬起事件，发生在P3DToolKit已经执行内部事件之后
    this.P3D_OnMouseUpCallBack = function (event) { }
    // 回调函数，鼠标拖拽事件，发生在P3DToolKit已经执行内部事件之后
    this.P3D_OnMouseMoveCallBack = function (event) { }
    // 回调函数，鼠标滚轮事件，发生在P3DToolKit已经执行内部事件之后
    this.P3D_OnMouseWheelCallBack = function (event) { }
    // 回调函数，手机触屏按下事件，发生在P3DToolKit已经执行内部事件之后
    this.P3D_OnTouchStartCallBack = function (event) { }
    // 回调函数，手机触屏滑动事件，发生在P3DToolKit已经执行内部事件之后
    this.P3D_OnTouchMoveCallBack = function (event) { }
    // 回调函数，手机触屏抬起事件，发生在P3DToolKit已经执行内部事件之后
    this.P3D_OnTouchEndCallBack = function (event) { }
    // 回调函数, 摄像机变化, 发生在视图矩阵变化之后
    this.P3D_OnCameraChangeCallback = function() {}
    // 回调函数，模型加载完毕
    this.P3D_OnLoadModelEndCallback = function () { }
    // 回调函数，批注信息创建完毕
    this.P3D_OnCommentCreateCallback = function(commentId) { }
    // 回调函数，批注信息删除完毕
    this.P3D_OnCommentDeleteCallback = function(commentId) { }
}

//===================================================================================================

// P3DToolkit库是否已经加载完毕
let isLoadedLib = false;

// 动态加载P3DToolkit依赖库，解决不同 vue 版本兼容的问题
function loadP3DToolkitLib (cb) {    
    // P3DToolkit库依赖列表，并按顺序加载
    const P3D_LIB_DEPENDENCY_LIST = [
        { type: 'text/javascript', src: 'P3DToolkit/UI/P3Dvendor.js'},
        { type: 'text/javascript', src: 'P3DToolkit/UI/app.js'},
        { type: 'text/javascript', src: 'P3DToolkit/p3dKernel/p3dKerenl1.js'},
        { type: 'module', src: 'P3DToolkit/p3dKernel/Math/module.js'},
        { type: 'module', src: 'P3DToolkit/p3dKernel/Camera/Module.js'},
        { type: 'module', src: 'P3DToolkit/p3dKernel/P3D/Module.js'},
        { type: 'module', src: 'P3DToolkit/p3dKernel/Material/Module.js'},
        { type: 'text/javascript', src: 'P3DToolkit/p3dKernel/p3dKerenl2.js'},
    ] 
   
    // 库已经加载过了，无需再次加载，直接返回
    if (isLoadedLib) {
        cb && cb(false, '');
        return;
    };

    const loadList = P3D_LIB_DEPENDENCY_LIST.map(function(item) { return item; });
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
        script.type = dependency.type;
        script.src = dependency.src;
        // 加载完成事件
        script.onload = function() {
            count++;
            load();
        }
        // 加载失败事件
        script.onerror = function() {
            cb && cb(true, dependency.src);
        }
        document.body.appendChild(script);
    }

    load();
}

//===================================================================================================

function P3DToolkitLib(dom, callbacks, settings) {
    initComponet(dom);
    initModuleCallbacks(callbacks);
    initSettings(settings);

    this.P3D_Version = P3D_Version;
    this.P3D_CreateComponet = P3D_CreateComponet;
    this.P3D_DestoryComponet = P3D_DestoryComponet;

    this.P3D_LoadPMIFlag = P3D_LoadPMIFlag;
    this.P3D_LoadSurfaceAndCurveFlag = P3D_LoadSurfaceAndCurveFlag;
    this.P3D_LoadSectionFlag = P3D_LoadSectionFlag;

    this.P3D_InitData = P3D_InitData;
    this.P3D_UninitData = P3D_UninitData;

    this.P3D_GetSelObjIDs = P3D_GetSelObjIDs;
    this.P3D_SetSelStatusByObjIDs = P3D_SetSelStatusByObjIDs;
    this.P3D_SetClearSelStatus = P3D_SetClearSelStatus;
    this.P3D_GetObjVisible = P3D_GetObjVisible
    this.P3D_SetObjVisible = P3D_SetObjVisible
    this.P3D_GetObjTransparent = P3D_GetObjTransparent;
    this.P3D_SetObjTransparent = P3D_SetObjTransparent;
    this.P3D_SetObjColor = P3D_SetObjColor;
    this.P3D_GetObjName = P3D_GetObjName
    this.P3D_GetObjParams = P3D_GetObjParams
    this.P3D_SetObjsHighlight = P3D_SetObjsHighlight;
    this.P3D_GetObjsCenterPos = P3D_GetObjsCenterPos;
    this.P3D_SetObjsEnhancedDisplay = P3D_SetObjsEnhancedDisplay;
    this.P3D_SetObjsEnhancedDisplayById = P3D_SetObjsEnhancedDisplayById;
    this.P3D_GetObjBox = P3D_GetObjBox;
    this.P3D_GetObjModelID = P3D_GetObjModelID;
    this.P3D_SetObjMoveByWindow = P3D_SetObjMoveByWindow;
    this.P3D_SetObjMoveByNavigator = P3D_SetObjMoveByNavigator;
    this.P3D_SetObjMoveByParams = P3D_SetObjMoveByParams;

    this.P3D_AnimPlay = P3D_AnimPlay;
    this.P3D_AnimPause = P3D_AnimPause;
    this.P3D_AnimResume = P3D_AnimResume;
    this.P3D_AnimStop = P3D_AnimStop;
    this.P3D_GetAnimFrames = P3D_GetAnimFrames;
    this.P3D_SetAnimCurFrame = P3D_SetAnimCurFrame;
    this.P3D_GetAnimCurFrame = P3D_GetAnimCurFrame;
    this.P3D_AnimPlayRange = P3D_AnimPlayRange;
    this.P3D_SetAnimCameraOn = P3D_SetAnimCameraOn;

    this.P3D_Home = P3D_Home;
    this.P3D_GetPickElements = P3D_GetPickElements;
    this.P3D_SetBkImage = P3D_SetBkImage;
    this.P3D_SetBkColor = P3D_SetBkColor;
    this.P3D_GetBkColor = P3D_GetBkColor;
    this.P3D_SetSelShowFlag = P3D_SetSelShowFlag;
    this.P3D_SetMultSelFlag = P3D_SetMultSelFlag;
    this.P3D_SetMouseCaptureFlag = P3D_SetMouseCaptureFlag;
    this.P3D_SetMouseCaptureMode = P3D_SetMouseCaptureMode;
    this.P3D_GetMouseCaptureObjID = P3D_GetMouseCaptureObjID;
    this.P3D_SetMouseOperatorMode = P3D_SetMouseOperatorMode;
    this.P3D_SetRenderMode = P3D_SetRenderMode;
    this.P3D_SetMSAAMode = P3D_SetMSAAMode;

    this.P3D_GetModelTreeRootNode = P3D_GetModelTreeRootNode;
    this.P3D_GetModelTreeObjects = P3D_GetModelTreeObjects;
    this.P3D_SetModelTreeObjectsTrans = P3D_SetModelTreeObjectsTrans;

    this.P3D_GetAllSceneAnimNodeData = P3D_GetAllSceneAnimNodeData;
    this.P3D_PlaySceneAnimRange = P3D_PlaySceneAnimRange;
    
    this.P3D_SetUserCanCommentFlag = P3D_SetUserCanCommentFlag;
    this.P3D_SetCommentUsrName = P3D_SetCommentUsrName;
    this.P3D_AddComment = P3D_AddComment;
    this.P3D_DelComment = P3D_DelComment;
    this.P3D_ImportComment = P3D_ImportComment;
    this.P3D_ExportComment = P3D_ExportComment;
    this.P3D_GetCommentInfoById = P3D_GetCommentInfoById;
    this.P3D_AddCommentByData = P3D_AddCommentByData;
    this.P3D_SetCommentActive = P3D_SetCommentActive;
    this.P3D_SetCommentVisible = P3D_SetCommentVisible;

    this.P3D_ChangeView = P3D_ChangeView;
    this.P3D_SetViewOnSelObjs = P3D_SetViewOnSelObjs;
    this.P3D_ViewRotate = P3D_ViewRotate;
    this.P3D_ViewScale = P3D_ViewScale;
    this.P3D_ViewSlide = P3D_ViewSlide;
    this.P3D_RecoderView = P3D_RecoderView;
    this.P3D_SetCameraView = P3D_SetCameraView;
    this.P3D_GetCameraView = P3D_GetCameraView;
    this.P3D_CameraLockUpAxis = P3D_CameraLockUpAxis;
    this.P3D_CameraSetProjectType = P3D_CameraSetProjectType;
    this.P3D_CameraControlMode = P3D_CameraControlMode;

    this.P3D_InitMeasure = P3D_InitMeasure;
    this.P3D_UnInitMeasure = P3D_UnInitMeasure;
    this.P3D_SetMeasureMode = P3D_SetMeasureMode;
    this.P3D_GetMeasureUnitIndex = P3D_GetMeasureUnitIndex;
    this.P3D_SetMeasureUnitVisibe = P3D_SetMeasureUnitVisibe;
    this.P3D_DeleteMeasureUnit = P3D_DeleteMeasureUnit;
    this.P3D_ExportMeasureUint = P3D_ExportMeasureUint;

    this.P3D_GetMetialList = P3D_GetMetialList;
    this.P3D_GetObjMaterialList = P3D_GetObjMaterialList;
    this.P3D_SetObjMaterialID = P3D_SetObjMaterialID;
    this.P3D_SetObjMaterialIDEx = P3D_SetObjMaterialIDEx;
    this.P3D_SetObjectMaterialBasis = P3D_SetObjectMaterialBasis;
    this.P3D_ClearObjMaterial = P3D_ClearObjMaterial;

    this.P3D_GetModelList = P3D_GetModelList;
    this.P3D_UpdateModel = P3D_UpdateModel;
    this.P3D_FinishLoadModel = P3D_FinishLoadModel;

    this.P3D_InitPmi = P3D_InitPmi;
    this.P3D_UnInitPmi = P3D_UnInitPmi;
    this.P3D_GetAnnotViewIDByTreeID = P3D_GetAnnotViewIDByTreeID;
    this.P3D_GetAnnotViewName = P3D_GetAnnotViewName;
    this.P3D_ShiftAnnotView = P3D_ShiftAnnotView;
    this.P3D_SetAnnotVisibleInView = P3D_SetAnnotVisibleInView;
    this.P3D_GetAnnotIDInView = P3D_GetAnnotIDInView;
    this.P3D_GetViewIDByAnnotID = P3D_GetViewIDByAnnotID;
    this.P3D_GetAnnotName = P3D_GetAnnotName;
    this.P3D_GetAnnotType = P3D_GetAnnotType;
    this.P3D_IsAnnotVisible = P3D_IsAnnotVisible;
    this.P3D_SetAnnotVisible = P3D_SetAnnotVisible;
    this.P3D_GetSelAnnotID = P3D_GetSelAnnotID;
    this.P3D_SelectAnnot = P3D_SelectAnnot;
    this.P3D_ClearAnnotSelected = P3D_ClearAnnotSelected;
    this.P3D_ChangeCameraFaceToAnnot = P3D_ChangeCameraFaceToAnnot;
    this.P3D_ChangeCameraFocusToAnnot = P3D_ChangeCameraFocusToAnnot;
    this.P3D_SetPmiDispColor = P3D_SetPmiDispColor;
    this.P3D_SetPmiSelDispColor = P3D_SetPmiSelDispColor;
    this.P3D_ResetPmiDispColor = P3D_ResetPmiDispColor;

    this.P3D_InitSection = P3D_InitSection;
    this.P3D_UnInitSection = P3D_UnInitSection;
    this.P3D_SetClipEnable = P3D_SetClipEnable;
    this.P3D_GetClipEnable = P3D_GetClipEnable;
    this.P3D_SetClipVisible = P3D_SetClipVisible;
    this.P3D_GetClipVisible = P3D_GetClipVisible;
    this.P3D_SetClipRevert = P3D_SetClipRevert;
    this.P3D_ResetClip = P3D_ResetClip;
    this.P3D_SetClipMove = P3D_SetClipMove;
    this.P3D_GetClipPosition = P3D_GetClipPosition;
    this.P3D_GetClipLastMove = P3D_GetClipLastMove;
    this.P3D_SetClipRoate = P3D_SetClipRoate;
    this.P3D_GetClipDirection = P3D_GetClipDirection;
    this.P3D_GetClipLastRotate = P3D_GetClipLastRotate;
    this.P3D_SelectClip = P3D_SelectClip;
    this.P3D_GetSelectedClip = P3D_GetSelectedClip;

    this.P3D_SetNvgVisible = P3D_SetNvgVisible;
    this.P3D_SetNvgLayout = P3D_SetNvgLayout;

    this.P3D_TwinStart = P3D_TwinStart;
    this.P3D_TwinTerminal = P3D_TwinTerminal;
    this.P3D_SetObjectOriWorldMatrix = P3D_SetObjectOriWorldMatrix;
    this.P3D_GetObjectOriWorldMatrix = P3D_GetObjectOriWorldMatrix;
    this.P3D_GetObjectCurWorldMatrix = P3D_GetObjectCurWorldMatrix;

    this.P3D_ExplodeStart = P3D_ExplodeStart;
    this.P3D_ExplodeUpdate = P3D_ExplodeUpdate;
    this.P3D_ExplodeFinish = P3D_ExplodeFinish;
}

//===================================================================================================

var g_LoadFileTimeTimeID;

//===================================================================================================

// 版本信息
function P3D_Version() {
    return P3DTOOLKIT_VERSION;
}

// PMI数据
function P3D_LoadPMIFlag(flag) {
    if (flag == true){
        g_ExportPMI = 1;
    }else{
        g_ExportPMI = 0;
    }
}

// 曲面和曲线数据，测试时使用
function P3D_LoadSurfaceAndCurveFlag(flag) {
    if (flag == true){
        g_ExportSurfaceAndCurve = 1;
    }else{
        g_ExportSurfaceAndCurve = 0;
    }
};

// 剖切数据
function P3D_LoadSectionFlag (flag) {
    if (flag == true){
        g_ExportSection = 1;
    }else{
        g_ExportSection = 0;
    }
};

// 加载数据
function P3D_InitData(streamdata, licdata) {
    P3D_UninitData();
    KernelInitData(streamdata, licdata);    
}

// 清除数据：模型数据、批注、PMI数据等
function P3D_UninitData() {
    clearModel();
    // 释放解析数据流
    UnitCleStream();
}

// 销毁组件，清除所有数据：模型数据、批注、PMI数据、场景数据、背景等所有资源
function P3D_DestoryComponet() {
    destoryComponet();
    // 释放解析数据流
    UnitCleStream();
}

// 创建组件，包括三维场景所必须的资源
function P3D_CreateComponet(dom) {
    initComponet(dom);
}

// 视图切换
function P3D_ChangeView(type) {
    glRunTime.shiftView(type);
}

// 设置聚焦到选中物件上，模型整体围绕所选零件旋转
// 如果未选中零件或装配体，则默认聚焦到模型整体
function P3D_SetViewOnSelObjs() {
    glRunTime.setFocusOnObject();
}

function P3D_RecoderView(w, h) {
    return glRunTime.recorderViewImage(w, h, 1);
}

// 视图操作：视角旋转
// 屏幕向右为X轴正方向，向上为Y轴正方向，向里为Z轴正方向
// angleX：模型向X轴正方向旋转
// angleY：模型向Y轴正方向旋转
// angleZ：模型饶Z轴正方向旋转，鼠标操作通常为0
function P3D_ViewRotate(angleX, angleY, angleZ) {
    setCameraRotate(angleX, angleY, angleZ);
}

// 视图操作：视角缩放
// scale > 0表示放大一步
// scale < 0表示缩小一步
// 一步：对应于鼠标滚轮滚动一次
function P3D_ViewScale(scale) {
    setCameraZoom(scale);
}

function P3D_ViewSlide(distX, distY, distZ) {
    setCameraSlide(distX, distY);
}

// 模型复位
function P3D_Home(type) {
    glRunTime.home(type);
}

// 获取当前拾取的元素
function P3D_GetPickElements() {
    var p3dPickElem = new P3D_PICK_ELEMENT();
    transP3DTookkitPickElem(p3dPickElem, glRunTime.curPickUnit);
    return p3dPickElem;
}

// 获取选择的物件Id，返回值为array类型
function P3D_GetSelObjIDs() {
    return glRunTime.getPickObjectIds();
}

// 通过物件Id，设置物件为选中状态
function P3D_SetSelStatusByObjIDs(objIDs) {
    return glRunTime.pickModelByIDs(objIDs);
}

// 清空选中选中状态
function P3D_SetClearSelStatus() {
    return glRunTime.pickModelByIDs(null);
}

function P3D_GetObjVisible(objID) {
    let objectIndex = glRunTime.getObjectIndexById(objID);
    return glRunTime.getObjectVisible(objectIndex);
}

function P3D_SetObjVisible(objID, isVisible) {
    let objectIndex = glRunTime.getObjectIndexById(objID);
    return glRunTime.setObjectVisible(objectIndex, isVisible);
}

function P3D_GetObjTransparent(objID) {
    let objectIndex = glRunTime.getObjectIndexById(objID);
    return glRunTime.getObjectTransparent(objectIndex);
}

function P3D_GetObjName(objID) {
    return glRunTime.getObjectNameByID(objID, g_GLData.GLModelTreeNode);
}

function P3D_GetObjParams(objID) {
    return glRunTime.getObjectParamsByID(objID, g_GLData.GLModelTreeNode);
}

// 设置指定物件的透明渲染状态
// 如果objIDs为null或者元素个数为0，则默认表示操作当前选中模型
function P3D_SetObjTransparent(objIDs, alpha) {
    if (alpha < 0.0 || alpha > 1.0) {
        return;
    }
    glRunTime.setObjectTransparent(objIDs, alpha);
}

// 设置选中物件的颜色
function P3D_SetObjColor(objID, r, g, b, a) {
    if (r < 0.0 || r > 1.0 || g < 0.0 || g > 1.0 ||
        b < 0.0 || b > 1.0 || a < 0.0 || a > 1.0) {
        return false;
    }
    return glRunTime.setObjectMaterial(objID, r, g, b, a);
}

// 高亮指定的物件
function P3D_SetObjsHighlight(objIDs) {
    glRunTime.setObjectsPickedByIds(objIDs);
}

// 获取物件的包围盒中心点
// 输入：objIDs 数组
// 输出：center2Ds 数组 在画布上的二维坐标点，数据类型Point2(x, y)
// 如果某个ID计算失败则对应的数组元素为null
function P3D_GetObjsCenterPos(objIDs) {
    let arrCenters = new Array();
    for (let i = 0; i < objIDs.length; ++i) {
        arrCenters.push(glRunTime.getObjectCenterById(objIDs[i]));
    }
    return arrCenters;
}

// 弱化其余模型的透明度，以增强选择模型的显示效果
// 输入：treeNodeId模型树节点ID
function P3D_SetObjsEnhancedDisplay(treeNodeId) {
    return glRunTime.setObjectEnhancedDisplayByTreeId(treeNodeId);
}

// 弱化其余模型的透明度，以增强选择模型的显示效果
// 输入：模型实例数组ID
function P3D_SetObjsEnhancedDisplayById(objIDs) {
    return glRunTime.setObjectEnhancedDisplayById(objIDs);
}

// 获取指定物件的包围盒
function P3D_GetObjBox(objID) {
    return glRunTime.getObjectBoxById(objID);
}

function P3D_GetObjModelID(objID) {
    return glRunTime.getObjectModelId(objID);
}

// 播放动画
function P3D_AnimPlay() {
    if (g_sceneData != null) {
        setAnimationStart();
    }
}

// 暂停播放
function P3D_AnimPause() {
    if (g_sceneData != null) {
        animPause();
    }
}

// 继续动画
function P3D_AnimResume() {
    if (g_sceneData != null) {
        animRun();
    }
}

// 暂停播放
function P3D_AnimStop() {
    if (g_sceneData != null) {
        animTerminal();
    }
}

// 获取动画总帧数
function P3D_GetAnimFrames() {
    return getTotalFrames();
}

// 获取当前动画播放帧数
function P3D_GetAnimCurFrame() {
    return uCurFrame
}

// 设置从指定帧开始播放
function P3D_SetAnimCurFrame(frame) {
    uCurFrame = frame;
}

// 设置动画播放倍速
// 可选值：0.5 - 10.0
function P3D_SetAnimSpeed(speed) {
    return setAnimSpeed(speed);
}

// 获取当前动画播放倍速
function P3D_GetAnimSpeed() {
    return getAnimSpeed();
}

// 从指定帧到指定帧播放动画
function P3D_AnimPlayRange(nStartPos, nEndPos) {
    return PlayUsrFrameAnimation(nStartPos, nEndPos);
}

// 设置是否播放摄像机动画
function P3D_SetAnimCameraOn(isOn) {
    setAnimType(true, isOn, true);
}

// 设置背景图片
function P3D_SetBkImage(imageName) {
    for (let i = 0; i < g_bgImage.length; ++i) {
        if (imageName == g_bgImage[i]) {
            glRunTime.setBackground(i);
            return;
        }
    }
    glRunTime.addUsrBackground(g_bgFoder + imageName);
    g_bgImage.push(imageName);
}

// 设置背景颜色
function P3D_SetBkColor(r, g, b) {
    glRunTime.setBackgroundColor(r, g, b);
}

// 获取背景颜色
// 只有在背景是颜色填充时有效，返回颜色数组，成员分别为r,g,b颜色分量
// 背景是图片时返回null
function P3D_GetBkColor() {
    return glRunTime.getBackgroundColor();
}

// 设置选中物件时是否高亮成红色以及显示包围盒
function P3D_SetSelShowFlag(flag) {
    if (flag == 0) {
        glRunTime.setBoxShow(false);
        glRunTime.setHighlight(false);
    } else {
        glRunTime.setBoxShow(true);
        glRunTime.setHighlight(true);
    }
}

// 设置多选模式
function P3D_SetMultSelFlag(flag) {
    if (flag == 0) {
        isMultPick = false;
    } else {
        isMultPick = true;
    }
}

// 设置移动选中物件的标记
function P3D_SetObjMoveByWindow(flag) {
    if (flag) {
        isMove = true;
    } else {
        isMove = false;
    }
}

function P3D_SetObjMoveByNavigator(enbale) {
    if (g_objectAxisNvg == null) {
        g_objectAxisNvg = new ObjectAxisNavigator();
    }

    if (enbale) {
        g_objectAxisNvg.bind();
        glRunTime.setHighlight(false);
    } else {
        g_objectAxisNvg.unbind();
        glRunTime.setHighlight(true);
    }
}

function P3D_SetObjMoveByParams(x, y, z) {
    
}

// 设置鼠标动态捕捉物件ID标记
function P3D_SetMouseCaptureFlag(flag) {
    if (flag == 0) {
        isMotionCapture = false;
    } else {
        isMotionCapture = true;
    }
}

// 设置基础操作类型
function P3D_SetMouseOperatorMode(mode) {
    setMouseOperationMode(mode);
}

// 设置渲染模式
function P3D_SetRenderMode(mode) {
    g_webglControl.SetRenderMode(mode);
    glRunTime.flush();
}

function P3D_SetMSAAMode(mode) {
    glRunTime.msaaChangeed(mode);
}

// 获取模型树根节点
function P3D_GetModelTreeRootNode() {
    return g_GLData.GLModelTreeNode;
}

// 获取模型树节点下的所有自物件id
function P3D_GetModelTreeObjects(treeId) {
    return glRunTime.getSubObjectsByTreeId(treeId);
}

// 平移模型树节点下的所有物件
// x, y ,z分别为世界坐标系方向上的位移分量
function P3D_SetModelTreeObjectsTrans(treeId, x, y, z) {
    return glRunTime.setSubObjectMoveByTreeId(treeId, x, y, z);
}

// 获取所有场景事件信息
function P3D_GetAllSceneAnimNodeData(data) {
    if (g_sceneData != null) {
        for (var i in g_sceneData.stuTimeNodeTreeTop._arrSubNode){
            data[i] = new P3D_SCENEANIMNODE;
			data[i]._uTimeNodeID = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._uTimeNodeID;
            data[i]._strName = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._strName;
            data[i]._strNote = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._strNote;
            data[i]._uStart = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._uStartFrameID;
            data[i]._uEnd = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._uStartFrameID+g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._uFrameSize;
            for (var j in g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode){
                data[i]._arrSubNode[j] = new P3D_SCENEANIMNODE;
                data[i]._arrSubNode[j]._uTimeNodeID = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._uTimeNodeID;
                data[i]._arrSubNode[j]._strName = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._strName;
                data[i]._arrSubNode[j]._strNote = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._strNote;
                data[i]._arrSubNode[j]._uStart = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._uStartFrameID;
                data[i]._arrSubNode[j]._uEnd = g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._uStartFrameID+g_sceneData.stuTimeNodeTreeTop._arrSubNode[i]._arrSubNode[j]._uFrameSize;
            }
        }
    }
}

// 播放场景事件动画
function P3D_PlaySceneAnimRange(start, end) {
    g_nAnimationStart = start;
    g_nAnimationEnd = end;

    animTerminal();
    PlaySceneAnimation();
}

// 设置批注的权限，
function P3D_SetUserCanCommentFlag(type) {
    setUsrCommentRight(type);
}

// 设置批注作者信息
function P3D_SetCommentUsrName(userName) {
    // 内部需要判断权限
    setCommentUsrName(userName);
}

// 创建批注信息
function P3D_AddComment() {
    setUsrCommentMode(1, 1);
}

// 删除批注信息
function P3D_DelComment(commentId) {
    // 内部需要判断权限
    if (commentId < 0) {
        // 删除当前鼠标选中的批注
        deleteCommentInput();
    } else {
        deleteCommentById(commentId);
    }
}

// 导入批注信息
// 参数xmlDoc: XML Document对象
function P3D_ImportComment(xmlDoc) {
    // 内部需要判断权限
    importComment(xmlDoc);
}

// 导出批注信息
// 返回值: XML Document对象
function P3D_ExportComment(xmlDoc) {
    // 内部需要判断权限
    return exportComment(xmlDoc);
}

function P3D_GetCommentInfoById(commentId) {
    return getCommentInfoById(commentId);
}

function P3D_AddCommentByData(commentInfo) {
    return addCommentByInfo(commentInfo);
}

function P3D_SetCommentActive(arrCommentId, isObjectActive) {
    return setCommentActiveById(arrCommentId, isObjectActive);
}

function P3D_SetCommentVisible(arrCommentId, isVisible) {
    return setCommentVisibleById(arrCommentId, isVisible);
}

// 设置摄像机参数, 参数P3D_CAMERA
function P3D_SetCameraView(camera) {
    return setCameraCurView(camera);
}

// 获取当前状态的摄像机参数，P3D_CAMERA
function P3D_GetCameraView() {
    return getCameraCurView();
}

function P3D_CameraLockUpAxis(isLock) {
    if (isLock) {
        CameraController.lockUpAxis(g_cameraController, g_sceneConfig._upAxis);
    } else {
        CameraController.lockUpAxis(g_cameraController, null);
    }
}

// 设置投影模式：
//  0: 表示透视投影（默认）
//  1: 表示正交投影
function P3D_CameraSetProjectType(projType) {
    Camera.setProjectiveType(g_camera, projType);
    glRunTime.flush();
}

// 设置操作模式：
//  0: 旋转模式（默认）
//  1: 自旋模式
//  2: 平移模式
//  3: 步览模式
//  4: 飞行模式
//  5: 环顾模式
function P3D_CameraControlMode(controlMode) {
    setCameraControlMode(controlMode);
}

// 初始化测量信息
function P3D_InitMeasure() {
    return startMeasureMode();
}

// 退出测量状态
function P3D_UnInitMeasure() {
    return cancelMeacureMode();
}

// 设置测量模式
// measureMode：如果为NONE时表示取消测量；
// 其余有效值为物件、曲面、曲线、曲线与曲线、点、点与点模式
function P3D_SetMeasureMode(measureMode) {
    return setMeasureMode(measureMode);
}

// 获取当前选取的测量单元索引
function P3D_GetMeasureUnitIndex() {
    return getMeasureUnitIndex();
}

// index: 选取的测量单元索引。
// 如果是-1则表示操作全部测量单元。
// 如果是-2，则表示操作当前已拾取的测量单元。
function P3D_SetMeasureUnitVisibe(index, visible) {
    return setMeasureUnitVisible(index, visible);
}

// index: 选取的测量单元索引。
// 如果是-1则表示操作全部测量单元。
// 如果是-2，则默认操作当前已拾取的测量单元。
function P3D_DeleteMeasureUnit(index) {
    return deleteMeasureUnit(index);
}

// index: 选取的测量单元索引。
// 如果是-1则表示导出全部测量单元。
// 如果是-2则表示导出当前已拾取的测量单元。
function P3D_ExportMeasureUint(index) {
    return exportMeasureUnits(index);
}

// 设置鼠标动态捕捉类型
// 实时获取鼠标当前指向的几何元素
// captureMode：如果为NONE则表示关闭捕捉
// 其余有效值为：物件、几何曲面、几何曲线、几何顶点
function P3D_SetMouseCaptureMode(captureMode) {
    if (!g_sceneGeomtryOn) {
        return;
    }
    if (captureMode == P3D_CAPTURE_NONE) {
        isMotionCapture = false;
    } else {
        isMotionCapture = true;
    }
    glRunTime.setCaptureMode(captureMode);
}

// 获取鼠标动态指向的物件Id
function P3D_GetMouseCaptureObjID() {
    return motionCaptureObjID;
}

// 获取材质信息列表
function P3D_GetMetialList() {
    glRunTime.getObjectMetialList(-1);
}

function P3D_GetObjMaterialList(objID) {
    return glRunTime.getObjectMetialList(objID);
}

// 设置物件的材质
function P3D_SetObjMaterialID(objID, objSubsetIndexs, uMtlID) {
    return glRunTime.setObjectSurfaceMaterialById(objID, objSubsetIndexs, uMtlID);
}

function P3D_SetObjMaterialIDEx(objID, objSubsetIndexs, uMtlID, imageUrl) {
    return glRunTime.setObjectMaterialTexture2D(objID, objSubsetIndexs, uMtlID, imageUrl);
}

function P3D_SetObjectMaterialBasis(objID, objSubsetIndexs, uMtlID, basisBuff) {
    return glRunTime.setObjectMaterialTextureBasis(objID, objSubsetIndexs, uMtlID, basisBuff);
}

// 取消物件的材质
function P3D_ClearObjMaterial(objID) {
    glRunTime.clearObjectSurfaceMaterial(objID);
}

// 获取模型列表
function P3D_GetModelList() {
    return getModelList();
}

// 更新模型数据
function P3D_UpdateModel(index, dataStream, isLoop) {
    updateModel(index, dataStream, isLoop);
}

// 加载模型结束
function P3D_FinishLoadModel() {
    glRunTime.endLoadModel();
}

function P3D_InitPmi() {
    if (g_scenePmiManager.init()) {
        glRunTime.curRuntimeMode = P3D_RUNTIME_MODE_PMI;
        return true;
    }
    return false;
}

function P3D_UnInitPmi() {
    g_scenePmiManager.clearPmi();
    glRunTime.curRuntimeMode = P3D_RUNTIME_MODE_NORMAL;
}

// 获取模型树节点的标注视图ID
function P3D_GetAnnotViewIDByTreeID(uTreeID) {
    return g_scenePmiManager.getPmiViewIdByTreeId(uTreeID);
}

// 获取标注视图的名称
function P3D_GetAnnotViewName(uAnnotViewID) {
    return g_scenePmiManager.getPmiViewName(uAnnotViewID);
}

// 切换显示标注视图
function P3D_ShiftAnnotView(uAnnotViewID) {
    return g_scenePmiManager.shiftPmiView(uAnnotViewID);
}

// 设置标注视图内标注的显示/隐藏状态
function P3D_SetAnnotVisibleInView(arrViewIDs, bVisible) {
    return g_scenePmiManager.setPmiViewVisible(arrViewIDs, bVisible);
}

// 获取标注视图内的标注ID
function P3D_GetAnnotIDInView(uAnnotViewID) {
    return g_scenePmiManager.getPmiItemIdByViewId(uAnnotViewID);
}

// 获取标注所属的标注视图ID
function P3D_GetViewIDByAnnotID(uAnnotID) {
    return g_scenePmiManager.getPmiViewIdByItemId(uAnnotID);
}

// 获取标注的名称
function P3D_GetAnnotName(uAnnotID) {
    return g_scenePmiManager.getPmiItemName(uAnnotID);
}

// 获取标注的类型
function P3D_GetAnnotType(uAnnotID) {
    return g_scenePmiManager.getPmiItemType(uAnnotID);
}

// 获取标注的显示状态
function P3D_IsAnnotVisible(uAnnotID) {
    return g_scenePmiManager.getPmiItemVisibleById(uAnnotID) == true ? true : false;
}

// 设置标注的显示/隐藏状态
function P3D_SetAnnotVisible(arrAnnotIDs, bVisible) {
    for (let i in arrAnnotIDs) {
        g_scenePmiManager.setPmiItemVisibleById(arrAnnotIDs[i], bVisible);
    }
}

// 获取选中的标注ID
function P3D_GetSelAnnotID() {
    return g_scenePmiManager.getPickedItemId();
}

// 选取标注
function P3D_SelectAnnot(arrAnnotIDs) {
    for (let i in arrAnnotIDs) {
        g_scenePmiManager.pickItemById(arrAnnotIDs[i], true);
    }
}

// 清除所有标注的选中状态
function P3D_ClearAnnotSelected() {
    g_scenePmiManager.clearPickItem();
}

// 更新当前摄像机使之正视于指定标注
function P3D_ChangeCameraFaceToAnnot(uAnnotID) {
    return g_scenePmiManager.setFaceToPmiItem(uAnnotID);
}

// 更改摄像机焦点至指定标注
function P3D_ChangeCameraFocusToAnnot(uAnnotID) {
    return g_scenePmiManager.setFocusOnPmiItem(uAnnotID);
}

function P3D_SetPmiDispColor(r, g, b) {
    return g_scenePmiManager.setPmiDisplayColor(r, g, b);
}

function P3D_SetPmiSelDispColor(r, g, b) {
    return g_scenePmiManager.setPmiSelectColor(r, g, b);
}
function P3D_ResetPmiDispColor() {
    return g_scenePmiManager.resetPmiColor();
}

function P3D_InitSection(callbackFunc) {
    // 初始化剖切参数
    g_sceneSection.initSection(callbackFunc);
    glRunTime.curRuntimeMode = P3D_RUNTIME_MODE_SECTION;
    g_sceneSection.beginSectionOperation();
}

function P3D_UnInitSection() {
    // 释放剖切数据
    g_sceneSection.finishSectionOperation();
    g_sceneSection.clearSection();
    glRunTime.curRuntimeMode = P3D_RUNTIME_MODE_NORMAL;
}

function P3D_SetClipEnable(clipIndex, isEnable) {
    return g_sceneSection.setEnableClipping(clipIndex, isEnable);
}

function P3D_GetClipEnable(clipIndex) {
    return g_sceneSection.getClippingEnable(clipIndex);
}

function P3D_SetClipVisible(clipIndex, isVisible) {
    return g_sceneSection.setVisibleClipping(clipIndex, isVisible);
}

function P3D_GetClipVisible(clipIndex) {
    return g_sceneSection.getVisibleClipping(clipIndex);
}

function P3D_SetClipRevert(clipIndex) {
    return g_sceneSection.setRevertClipping(clipIndex);
}

function P3D_ResetClip(clipIndex) {
    g_sceneSection.resetClipPlanePos(clipIndex);
    g_sceneSection.resetClipPlaneDir(clipIndex);
    g_sceneSection.operateSectionReset(clipIndex);
}

function P3D_SetClipMove(clipIndex, distance) {
    return g_sceneSection.moveClipPlane(clipIndex, distance);
}

function P3D_GetClipPosition(clipIndex) {
    var pos = new P3D_BASEFLOAT3(0, 0, 0);
    g_sceneSection.getPosClipPlane(clipIndex, pos);
    return pos;
}

function P3D_GetClipLastMove(clipIndex) {
    return g_sceneSection.getDistClipPlane(clipIndex);
}

function P3D_SetClipRoate(clipIndex, angleX, angleZ) {
    return g_sceneSection.rotateClipPlaneAxis(clipIndex, angleX, 0, angleZ);
}

function P3D_GetClipDirection(clipIndex) {
    var dir = new P3D_BASEFLOAT3(0, 0, 0);
    g_sceneSection.getDirAngleClipPlane(clipIndex, dir);
    return dir;
}

function P3D_GetClipLastRotate(clipIndex) {
    var angles = new P3D_BASEFLOAT3(0, 0, 0);
    g_sceneSection.getAngleClipPlane(clipIndex, angles);
    return angles;
}

function P3D_SelectClip(clipIndex) {
    return g_sceneSection.setPlanePicked(clipIndex);
}

function P3D_GetSelectedClip() {
    return g_sceneSection.getPickedPlane();
}

function P3D_SetNvgVisible(visible) {
    if (visible) {
        hideNavigator(false);
    } else {
        hideNavigator(true);
    }
}

function P3D_SetNvgLayout(layout) {
    setNavigatorLayout(layout);
}


// 启动数字孪生模式
function P3D_TwinStart() {
    if (g_sceneData != null) {
        // 进入数字孪生模式
        isDigitalTwinMode = true;
        glRunTime.home(P3D_HOME_TYPE_ALL);
    }
}

// 退出数字孪生模式
function P3D_TwinTerminal() {
    isDigitalTwinMode = false;
}

/**
 * 数字孪生接口
 * 通过物件ID设置原始物件矩阵
 * @param {*} objID 物件ID
 * @param {*} newMatrix ADF_BASEMATRIX矩阵
 */
function P3D_SetObjectOriWorldMatrix(objID, newMatrix) {
    if (g_sceneData != null) {
        // 关闭其余按钮和模型拾取功能那个，只允许用户进行视角变换和缩放
        if (!isDigitalTwinMode) {
            return;
        }
        glRunTime.setObjectOriWorldMatrix(objID, newMatrix);
    }
}

/**
 * 数字孪生接口
 * 通过物件ID获取原始物件矩阵
 * @param {*} objID 物件ID
 */
function P3D_GetObjectOriWorldMatrix(objID) {
    if (g_sceneData != null) {
        return glRunTime.getObjectOriWorldMatrix(objID);
    }
}

/**
 * 数字孪生接口
 * 通过物件ID获取当前物件矩阵
 * @param {*} objID 物件ID
 */
function P3D_GetObjectCurWorldMatrix(objID) {
    if (g_sceneData != null) {
        return glRunTime.getObjectCurWorldMatrix(objID);
    }
}

function P3D_ExplodeStart(arrObjID, expMode, expScope, nTotalFrame) {
    return setExplodeStart(arrObjID, expMode, expScope, nTotalFrame);
}

function P3D_ExplodeUpdate(frame) {
    return updateExplodeFrame(frame);
}

function P3D_ExplodeFinish() {
    return finishExplode();
}