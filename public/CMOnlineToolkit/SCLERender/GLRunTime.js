// File: GLRunTime.js

/**
 * @author wujiali
 */
 
//===================================================================================================

// 三维模型数据
var g_GLData = null;
var g_GLObjectSet = null;
var g_GLPartSet = null;
var g_GLMaterialSet = null;
var g_GLAnnoSet = null;
var g_GLCameraSet = null;
var g_GLPmiSet = null;
// 全局渲染引擎实例
var g_glprogram = null;
var g_webgl = null;
var g_webglControl = null;
// 全局摄像机实例
var g_camera = null;
// 全局二维渲染引擎实例
var g_canvas = null;
// 全局xml工具实例
var g_xmlTool = null;
// 全局材质数据实例
var g_materialData = null;
var g_lineMtlData = null;
// 全局单位数据实例
var g_sceneUnit = null;
// 全局场景测量工具实例
var g_sceneMeasure = null;
// 全局场景批注工具实例
var g_sceneAnnotation = null;
// 全局场景剖切参数
var g_sceneSection = null;
// 全局PMI管理器
var g_scenePmiManager = null;
// 贴图工具
var g_texturer = null;
var g_texBasisu = null;

const RUNTIME_MODE_NORMAL = -1;
const RUNTIME_MODE_ANNOTATION = 0;
const RUNTIME_MODE_MEASURE = 1;
const RUNTIME_MODE_SECTION = 2;
const RUNTIME_MODE_PMI = 3;

function GLRunTime() {
    // 参数
    this.WIDTH = 0;
    this.HEIGHT = 0;
    this.SCALE_STEP = 10.0;
    this.SCALE_MIN = 10.0;
    this.SCALE_MAX = 2000.0;
    this.m_fModelLength = 1.0;          // 如果相机距离模型比较近，则交互时灵敏度系数应该减小
    this.m_fOperateSensitivity = 1.0;   // 操作灵敏度系数
    this.m_modelBox = new GL_Box();
    this.rotateSensitivity = 1.0;
    this.m_defEyePos = new Point3(0, 0, 0);
    this.m_defUpAxis = new Point3(0, 0, 0);
    // 计算所需数据，置为全局变量，可以减小内存
    this.ray_nds_near = vec3.create();
    this.ray_nds_far = vec3.create();
    this.ray_clip_near = vec4.create();
    this.ray_clip_far = vec4.create();
    this.viewMatInverse = mat4.create();
    this.projectionMatInverse = mat4.create();
    this.MMatrix = mat4.create();
    this.VPMatrix = mat4.create();
    this.MVPMatrix = mat4.create();
    this.inverseMVPMatrix = mat4.create();
    this.ray_world_near = vec4.create();
    this.ray_world_far = vec4.create();
    this.RayPoint1 = new Point3(0, 0, 0);
    this.RayPoint2 = new Point3(0, 0, 0);
    this.ObjectOriginalCenter = new Point3(0, 0, 0);
    this.PointNDCCenter = new Point3(0, 0, 0);
    this.ObjectMoveCenterStart = new Point3(0, 0, 0);
    this.ObjectMoveCenterEnd = new Point3(0, 0, 0);
    this.ObjectMovematrix = mat4.create();
    this.adfCamera = new ADF_CAMERA();
    this.curModelCenter = new Point3(0, 0, 0);
    this.curObjectCenter = new Point3(0, 0, 0);
    this.hashmapObjectID2Index = new HashMap();
    this.pickIndexs = new Array();
    this.webglRect = new Rect2D(0, 0, 0, 0);
    // 动态捕捉参数
    this.isCaptureGeomtry = true;
    this.captureType = CAPTURE_NONE;
    this.captureUnit = new GL_PICK_UNIT();
    // 数字孪生参数
    this.digitalLocalMat = mat4.create();
    this.digitalWorldMat = mat4.create();
    this.digitalMultiplyMat = mat4.create();
    // 分段加载
    this.isOnceLoad = false;
    // 测量模式
    this.curRuntimeMode = -1;

    /**
     * 渲染引擎数据初始化
     */
    this.initRender = function() {
        if (g_product != "4"){
            return;
        }
        
        g_materialData = new MeshMaterialData();
        g_lineMtlData = new LineMaterialData();
        g_glprogram = new GLProgram();
        g_camera = new Camera();
        g_canvas = new Canvas2D();
        g_webglControl = new WebGLControl();
        g_sceneMeasure = new SceneMeasure();
        g_sceneAnnotation = new SceneAnnotation();
        g_sceneSection = new SceneSection();
        g_scenePmiManager = new ScenePmiManager();
        g_texturer = new Texturer();
        if (g_BasisModule) {
            g_texBasisu = new TexturerBasisu();
            g_texBasisu.getWebglExtension();
        }

        // 初始化数据
        this.initRuntimeParams();
        // 开始初始化渲染数据
        g_glprogram.initGLData();
        g_canvas.initCanvasView(this.WIDTH, this.HEIGHT);
    }

    this.uninitRender = function() {
        if (g_glprogram != null) {
            g_glprogram.uninitGLData();
        }

        if (g_sceneSection != null) {
            g_sceneSection.uninitSection();
        }

        if (g_scenePmiManager != null) {
            g_scenePmiManager.uninit();
        }
        
        this.clearCommon();
    }

    /**
     * 清除数据
     */
    this.clear = function() {
        if (g_glprogram != null) {
            g_glprogram.clearGLData();
        }
        if (g_scenePmiManager != null) {
            g_scenePmiManager.clearPmi();
        }
        
        this.clearCommon();
    }

    this.clearCommon = function() {
        if (g_canvas != null) {
            g_canvas.uninitAnnoData();
        }

        if (g_GLObjectSet != null) {
            g_GLObjectSet.Clear();
        }
        if (g_GLPartSet != null) {
            g_GLPartSet.Clear();
        }
        if (g_GLMaterialSet != null) {
            g_GLMaterialSet.Clear();
        }
        if (g_GLAnnoSet != null) {
            g_GLAnnoSet.Clear();
        }
        if (g_GLCameraSet != null) {
            g_GLCameraSet.Clear();
        }
        
        g_GLData = null;
        if (g_camera != null) {
            g_camera.clear();
        }

        this.adfCamera.Clear();

        if (g_sceneSection != null) {
            g_sceneSection.clearSection();
        }
    }

    /**
     * 重置数据
     */
    this.reset = function() {
        // 初始化数据
        this.initRuntimeParams();
        // 开始初始化渲染数据
        g_glprogram.resetGLData();
        g_canvas.initCanvasView(this.WIDTH, this.HEIGHT);
    }

    this.initRuntimeParams = function() {
        this.WIDTH = gl.canvas.clientWidth;
        this.HEIGHT = gl.canvas.clientHeight;

        if (g_GLData == null) {
            g_GLData = Scene2GLData();
            g_GLObjectSet = g_GLData.GLObjectSet;
            g_GLMaterialSet = g_GLData.GLMatertalSet;
            g_GLAnnoSet = g_GLData.GLAnnotData;
            g_sceneUnit = g_GLData.GLSceneUnit;
            g_GLCameraSet = g_GLData.GLCamera;
            g_GLPmiSet = g_GLData.GLPmiSet;
        }

        if (g_webglControl.m_arrBgTexId == null) {
            g_webglControl.m_arrBgTexId = GetDefaultBgImg();
            g_webglControl.m_bgIndex = g_bgImageIndex;
        }

        this.cameraAnmi = g_GLData.GLCamera;

        // 场景灯光
        this.setSceneLightOn(g_sceneLightOn);
    }

    this.initCamera = function() {
        if (this.cameraAnmi._DefaultCamera._fFOVY > 0.0001) {
            g_camera.setCurCameraByAdfCamera(this.cameraAnmi._DefaultCamera);
            this.ObjectOriginalCenter.x = this.cameraAnmi._DefaultCamera._vFocus.x;
            this.ObjectOriginalCenter.y = this.cameraAnmi._DefaultCamera._vFocus.y;
            this.ObjectOriginalCenter.z = this.cameraAnmi._DefaultCamera._vFocus.z;
        } else {
            getModelBoxCenter(this.m_modelBox, this.ObjectOriginalCenter);
            getModelDefEyePos(this.m_modelBox, this.m_defEyePos, this.m_defUpAxis);
            g_camera.setCamera(this.m_defEyePos.x, this.m_defEyePos.y, this.m_defEyePos.z,
                0.0, 0.0, 0.0, this.m_defUpAxis.x, this.m_defUpAxis.y, this.m_defUpAxis.z);
            g_glprogram.setModelCenter(this.ObjectOriginalCenter);
        }
        g_camera.setPerspectiveMatrix(45 * Math.PI / 180, this.WIDTH / this.HEIGHT);
    }

    this.initSceneBox = function() {
        if (this.isOnceLoad) {
            this.m_modelBox = getModelBox(g_GLObjectSet, g_GLPartSet);
        } else {
            this.m_modelBox = getSliceScleBox(g_GLObjectSet, g_sceneData.arrModelData);
        }
    }

    this.initOperationParams = function() {
        this.m_fModelLength = getModelBoxLength(this.m_modelBox);
        this.SCALE_MIN = this.m_fModelLength / 20;
        this.SCALE_MAX = this.m_fModelLength * 2;
        this.SCALE_STEP = this.SCALE_MIN;
    }

    /**
     * 绘制3D场景
     */
     this.draw3D = function() {
        // 绘制3D场景
        if (gl != null) {
            g_webgl.draw();
        }
    }

    /**
     * 绘制2D注释
     */
    this.draw2D = function() {
        if (gl2d != null) {
            g_canvas.draw();
        }
    }

    /**
     * 窗口变化
     */
    this.resetWindow = function(width, height) {
        this.WIDTH = width, this.HEIGHT = height;
        g_camera.setPerspectiveMatrix(45 * Math.PI / 180, this.WIDTH / this.HEIGHT);
        g_webgl.initViewPort(this.WIDTH, this.HEIGHT);
        g_canvas.initCanvasView(this.WIDTH, this.HEIGHT);
    }

    /**
     * 模型旋转
     */
    this.rotate = function(degreeX, degreeY, degreeZ) {
        g_camera.rotateX(degreeX * this.rotateSensitivity);
        g_camera.rotateY(degreeY * this.rotateSensitivity);
        g_camera.rotateZ(degreeZ * this.rotateSensitivity);

    }

    /**
     * 视角平移
     */
    this.move = function(deltaX, deltaY) {
        // 获得整个模型中心
        getModelBoxCenter(this.m_modelBox, this.curModelCenter);
        // 获得中心坐标在设备坐标系下的Z分量
        mat4.multiply(this.VPMatrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        CalTranslatePoint(this.curModelCenter.x, this.curModelCenter.y, this.curModelCenter.z, this.VPMatrix, this.PointNDCCenter);
        // 获得位移终点的世界坐标
        let x = deltaX / this.WIDTH, y = deltaY / this.HEIGHT;
        mat4.invert(this.viewMatInverse, g_camera.viewMatrix);
        mat4.invert(this.projectionMatInverse, g_camera.projectionMatrix);
        mat4.multiply(this.inverseMVPMatrix, this.viewMatInverse, this.projectionMatInverse);
        CalTranslatePoint(0.0, 0.0, this.PointNDCCenter.z, this.inverseMVPMatrix, this.ObjectMoveCenterStart);
        CalTranslatePoint(x, y, this.PointNDCCenter.z, this.inverseMVPMatrix, this.ObjectMoveCenterEnd);
        // 获得真实中心位移量
        this.curModelCenter.x = this.ObjectMoveCenterEnd.x-this.ObjectMoveCenterStart.x;
        this.curModelCenter.y = this.ObjectMoveCenterEnd.y-this.ObjectMoveCenterStart.y;
        this.curModelCenter.z = this.ObjectMoveCenterEnd.z-this.ObjectMoveCenterStart.z;
        g_glprogram.moveModelCenter(this.curModelCenter);
    }

    /**
     * 模型平移
     */
    this.objectMove = function(nObjectIndex, screenX, screenY) {
        // let ObjectMat = g_GLObjectSet._arrObjectSet[nObjectIndex]._matObject;
        let ObjectMat = g_glprogram.getObjectModelMatrix(nObjectIndex);
        let PartIndex = g_GLObjectSet._arrObjectSet[nObjectIndex]._uPartIndex;
        // 计算Object在世界坐标下的位移量
        getModelBoxCenter(g_GLPartSet._arrPartSet[PartIndex]._arrPartLODData[0]._boxset._ObjectBox, this.curModelCenter);
        // 获得中心坐标在设备坐标系下的Z分量
        mat4.multiply(this.VPMatrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        mat4.multiply(this.MVPMatrix, this.VPMatrix, ObjectMat);
        CalTranslatePoint(this.curModelCenter.x, this.curModelCenter.y, this.curModelCenter.z, this.MVPMatrix, this.PointNDCCenter);
        // 获得位移终点的世界坐标
        let x = screenX / this.WIDTH, y = screenY / this.HEIGHT;
        mat4.invert(this.viewMatInverse, g_camera.viewMatrix);
        mat4.invert(this.projectionMatInverse, g_camera.projectionMatrix);
        mat4.multiply(this.inverseMVPMatrix, this.viewMatInverse, this.projectionMatInverse);
        CalTranslatePoint(0.0, 0.0, this.PointNDCCenter.z, this.inverseMVPMatrix, this.ObjectMoveCenterStart);
        CalTranslatePoint(x, y, this.PointNDCCenter.z, this.inverseMVPMatrix, this.ObjectMoveCenterEnd);
        // 获得真实位移量
        mat4.identity(this.ObjectMovematrix);
        mat4.translate(this.ObjectMovematrix, this.ObjectMovematrix,
                       vec3.fromValues(this.ObjectMoveCenterEnd.x-this.ObjectMoveCenterStart.x,
                                       this.ObjectMoveCenterEnd.y-this.ObjectMoveCenterStart.y,
                                       this.ObjectMoveCenterEnd.z-this.ObjectMoveCenterStart.z));
        g_glprogram.setObjectModelMatrixPicked(this.ObjectMovematrix);
    }

    this.objectSetMove = function(arrObjectIndex, x, y, z) {
        let curModelBox = getPublicModelBox(g_GLObjectSet, g_GLPartSet, arrObjectIndex, g_webglControl.m_arrObjectMatrix);
        getModelBoxCenter(curModelBox, this.curModelCenter);
        // 获得真实位移量
        mat4.identity(this.ObjectMovematrix);
        mat4.translate(this.ObjectMovematrix, this.ObjectMovematrix, vec3.fromValues(x, y, z));
        g_glprogram.setObjectMatrixTranslate(arrObjectIndex, this.ObjectMovematrix);
    }

    /**
     * 模型缩放
     */
    this.scale = function(fScale) {
        if (Math.abs(fScale - 1.0) < 0.0001) {
            return;
        }
        let tempScaleSensitivity = 1.0;
        if (g_camera.getDist() < this.m_fModelLength) {
            tempScaleSensitivity = this.m_fOperateSensitivity * 0.5;
        }
        else {
            tempScaleSensitivity = this.m_fOperateSensitivity * 1.0;
        }
        let fForward = 0.0;
        if (fScale > 1) {
            fForward -= this.SCALE_STEP * tempScaleSensitivity;
        }
        else {
            fForward += this.SCALE_STEP * tempScaleSensitivity;
        }
        g_camera.slide(0.0, 0.0, fForward);
    }

    /**
     * 设置包围盒显示
     */
    this.setBoxShow = function(isShow) {
        g_glprogram.setBoxShow(isShow);
    }

    this.setHighlight = function(isHighlight) {
        g_glprogram.setHighlightShow(isHighlight);
    }

    /**
     * 将屏幕拾取点根据远近剪裁面转化为世界坐标中的一条线段
     */
    this.cvtScreenToWorld = function(screenX, screenY, wldPtX, wldPtY) {
        // 完成视口坐标到3D世界坐标的转换
        let x = (2.0 * screenX) / this.WIDTH - 1.0;
        let y = 1.0 - (2.0 * screenY) / this.HEIGHT;
        this.ray_nds_near[0] = x, this.ray_nds_near[1] = y, this.ray_nds_near[2] = -1.0;
        this.ray_nds_far[0] = x, this.ray_nds_far[1] = y, this.ray_nds_far[2] = 1.0;
        this.ray_clip_near[0] = this.ray_nds_near[0], this.ray_clip_near[1] = this.ray_nds_near[1];
        this.ray_clip_near[2] = this.ray_nds_near[2], this.ray_clip_near[3] = 1.0;
        this.ray_clip_far[0] = this.ray_nds_far[0], this.ray_clip_far[1] = this.ray_nds_far[1];
        this.ray_clip_far[2] = this.ray_nds_far[2], this.ray_clip_far[3] = 1.0;
        mat4.invert(this.viewMatInverse, g_camera.viewMatrix);
        mat4.invert(this.projectionMatInverse, g_camera.projectionMatrix);
        mat4.multiply(this.inverseMVPMatrix, this.viewMatInverse, this.projectionMatInverse);
        vec4.transformMat4(this.ray_world_near, this.ray_clip_near, this.inverseMVPMatrix);
        vec4.transformMat4(this.ray_world_far, this.ray_clip_far, this.inverseMVPMatrix);
        if (this.ray_world_near[3] != 0.0) {
            this.ray_world_near[0] /= this.ray_world_near[3];
            this.ray_world_near[1] /= this.ray_world_near[3];
            this.ray_world_near[2] /= this.ray_world_near[3];
        }
        if (this.ray_world_far[3] != 0.0) {
            this.ray_world_far[0] /= this.ray_world_far[3];
            this.ray_world_far[1] /= this.ray_world_far[3];
            this.ray_world_far[2] /= this.ray_world_far[3];
        }
        // 根据单击点与摄像机坐标点构成拾取射线
        wldPtX.x = this.ray_world_near[0], wldPtX.y = this.ray_world_near[1], wldPtX.z = this.ray_world_near[2];
        wldPtY.x = this.ray_world_far[0], wldPtY.y = this.ray_world_far[1], wldPtY.z = this.ray_world_far[2];
    }

    // CMOnline设置了新的坐标原点，与世界坐标之间的转换
    this.cvtCMOnlineToWorld = function(pos, objIndex) {
        CalTranslatePoint(pos.x, pos.y, pos.z, g_webglControl.m_arrObjectMatrix[objIndex], pos);
    }

    this.cvtWorldToCMOnline = function(pos, objIndex) {
        if (objIndex > -1) {
            let inPos = new Point3(pos.x, pos.y, pos.z);
            CalInversePoint(inPos, g_webglControl.m_arrObjectMatrix[objIndex], pos);
        }
    }

    this.cvtWebGLPtToScreen = function(webglPt, screenPt) {
        screenPt.x = (webglPt.x + 1.0) / 2 * this.WIDTH;
        screenPt.y = (1.0 - webglPt.y) / 2 * this.HEIGHT;
    }

    this.cvtScreenPtToWebGL = function(screenPt, webglPt) {
        webglPt.x = screenPt.x / this.WIDTH * 2 - 1.0;
        webglPt.y = 1.0 - screenPt.y / this.HEIGHT * 2;
    }

    // 将物件坐标转换为屏幕坐标,并返回 在绘制区的坐标 x 和 y 范围在 0~1 之间
    this.getCanvasPosByModelPos = function(modelPos, objIdx) {
        var screenPt = g_canvas.cvtModelToScreen(modelPos, objIdx); 
        return {x: (screenPt.x + 1.0) / 2, y: (1.0 - screenPt.y) / 2}
    }

    /**
     * 模型拾取
     */
    this.pick = function(screenX, screenY, isMult, isDoPick) {
        // 优先判断是否选择了测量控件
        if (this.curRuntimeMode == RUNTIME_MODE_MEASURE) {
            if (g_sceneMeasure.doGetPickMeasureIndex(screenX, screenY) > -1) {
                g_glprogram.pickNone();
                return null;
            }
        }

        // 优先判断是否选择了PMI信息
        if (this.curRuntimeMode == RUNTIME_MODE_PMI) {
            if (g_scenePmiManager.pickPmi(screenX, screenY, isMult, isDoPick)) {
                g_glprogram.pickNone();
                return null;
            }
        }

        // 根据射线，计算与Object的相交
        this.cvtScreenToWorld(screenX, screenY, this.RayPoint1, this.RayPoint2);

        if (this.curRuntimeMode == RUNTIME_MODE_SECTION) {
            g_glprogram.pickNone();
            return g_sceneSection.pickSecTools(this.RayPoint1, this.RayPoint2);
        }

        let curPickUnit = g_glprogram.pickByRay(this.RayPoint1, this.RayPoint2, isMult, isDoPick);
        if (curPickUnit.objectIndex > -1 && g_sceneMeasure.pickMeasureMode == true && g_webglControl.isContainsGeom == true) {
            g_sceneMeasure.doMeasureAction(curPickUnit);
        }
        return curPickUnit;
    }

    /**
     * @description 拾取到objectIndex
     */
    this.pickObjectIndex = function(screenX, screenY, isMult, isDoPick) {
        var curPickUnit = this.pick(screenX, screenY, isMult, isDoPick);
        return curPickUnit == null ? -1 : curPickUnit.objectIndex;
    }

    this.pickModelByIndexs = function(indexs) {
        if (indexs == null || indexs.length < 1) {
            return;
        }
        g_glprogram.pickMultObjectByIndexs(indexs);
    }

    this.pickModelByIDs = function(objIDs) {
        if (objIDs == null || objIDs.length < 1) {
            g_glprogram.pickNone();
            return;
        }

        let arrIndex = new Array();
        for (let i = 0; i < objIDs.length; ++i) {
            for (let j = 0; j < g_GLObjectSet._arrObjectSet.length; ++j) {
                if (g_GLObjectSet._arrObjectSet[j]._uObjectID == objIDs[i]) {
                    arrIndex.push(j);
                    break;
                }
            }
        }
        this.pickModelByIndexs(arrIndex);
    }

    /**
     * 判断当前选中状态：0无选中，1单选，2多选
     */
    this.getPickStatus = function() {
        return g_glprogram.getPickStatus();
    }

    /**
     * 获取选中的零件的索引值
     */
    this.getPickObjectIndexs = function() {
        return g_glprogram.getPickedIndex();
    }

    /**
     * 获取选中的零件的Id
     */
    this.getPickObjectIds = function() {
        let arrIds = new Array();
        let arrIndexs = g_glprogram.getPickedIndex();
        for (let i = 0; i < arrIndexs.length; i++) {
            arrIds.push(g_GLObjectSet._arrObjectSet[arrIndexs[i]]._uObjectID)
        }
        return arrIds;
    }
    this.getPickObjectIdByIndex = function(index) {
        if (index < 0 || index >= g_GLObjectSet._arrObjectSet.length) {
            return null;
        }
        return g_GLObjectSet._arrObjectSet[index]._uObjectID;
    }

    /**
     * 框选零件
     */
    this.pickModelByRect = function(rect2D) {
        rect2D.normalize();
        this.cvtScreenPtToWebGL(rect2D.min, this.webglRect.min);
        this.cvtScreenPtToWebGL(rect2D.max, this.webglRect.max);
        this.webglRect.normalize();

        let arrPickIndex = new Array();
        mat4.multiply(this.VPMatrix, g_camera.projectionMatrix, g_camera.viewMatrix);

        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; ++i) {
            let nPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            mat4.multiply(this.MVPMatrix, this.VPMatrix, g_glprogram.getObjectModelMatrix(i));

            if (g_glprogram.isObjectInRect(g_GLPartSet._arrPartSet[nPartIndex]._arrPartLODData[0], this.MVPMatrix, this.webglRect)) {
                arrPickIndex.push(i);
            }
        }
        return this.pickModelByIndexs(arrPickIndex);
    }

    this.getPickUnit = function() {
        return g_glprogram.pickUnit;
    }

    this.getObjectIndexById = function(objectID) {
        let index = -1;
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (objectID == g_GLObjectSet._arrObjectSet[i]._uObjectID) {
                index = i;
                break;
            }
        }
        return index;
    }

    this.getObjectIdByIndex = function(index) {
        if (index < 0 || index >= g_GLObjectSet._arrObjectSet.length) {
            return -1;
        }
        return g_GLObjectSet._arrObjectSet[index]._uObjectID;
    }

    this.getObjectNameByID = function(objId, treeNode) {
        if (treeNode._uObjectID == objId) {
            return treeNode._strName;
        }

        let subName = null
        for (let i = 0; i < treeNode._arrSubNode.length; ++i) {
            subName = this.getObjectNameByID(objId, treeNode._arrSubNode[i]);
            if (subName != null) {
                return subName;
            }
        }
        return null;
    }

    this.getObjectTreeIDByID = function(objId, treeNode) {
        if (treeNode._uObjectID == objId) {
            return treeNode._uTreeNodeID;
        }

        let treeId = null
        for (let i = 0; i < treeNode._arrSubNode.length; ++i) {
            treeId = this.getObjectTreeIDByID(objId, treeNode._arrSubNode[i]);
            if (treeId != null) {
                return treeId;
            }
        }
        return null;
    }

    this.getObjectParamsByID = function(objId, treeNode) {
        if (treeNode._uObjectID == objId) {
            return treeNode._arrNodeParameters;
        }

        let subParams = null
        for (let i = 0; i < treeNode._arrSubNode.length; ++i) {
            subParams = this.getObjectParamsByID(objId, treeNode._arrSubNode[i]);
            if (subParams != null) {
                return subParams;
            }
        }
        return null;
    }

    this.getObjectCenterById = function(objectID) {
        let index = this.getObjectIndexById(objectID);
        let center = null;
        if (index >= 0) {
            let center2D = this.getObjectCenterByIndex(index).Center2D;
            center = new Point2(0, 0);
            center.x = (center2D.x + 1.0) * this.WIDTH / 2;
            center.y = (1.0 - center2D.y) * this.HEIGHT / 2;
        }
        return center;
    }

    /**
     * 计算零件包围盒，包括三维坐标和投影二维坐标
     */
    this.getObjectCenterByIndex = function(index) {
        let center2D = new Point3(0, 0, 0);
        let center3D = new Point3(0, 0, 0);
        let ObjectMat = g_glprogram.getObjectModelMatrix(index);
        let originObjectMat = g_glprogram.getObjectOriginMatrix(index);
        let PartIndex = g_GLObjectSet._arrObjectSet[index]._uPartIndex;
        if (g_GLPartSet._arrPartSet[PartIndex] == null) {
            return null;
        }

        getModelBoxCenter(g_GLPartSet._arrPartSet[PartIndex]._arrPartLODData[0]._boxset._ObjectBox, this.curModelCenter);
        mat4.multiply(this.VPMatrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        mat4.multiply(this.MVPMatrix, this.VPMatrix, ObjectMat);
        CalTranslatePoint(this.curModelCenter.x, this.curModelCenter.y, this.curModelCenter.z, this.MVPMatrix, center2D);
        CalTranslatePoint(this.curModelCenter.x, this.curModelCenter.y, this.curModelCenter.z, originObjectMat, center3D);

        return {
            Center2D: center2D,
            Center3D: center3D,
        };
    }

    this.getObjectSurfacesNum = function(objIndex) {
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objIndex]._uPartIndex;
        if (g_GLPartSet._arrPartSet[uCurPartIndex] == null) {
            return 0;
        }
        return g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._SurfaceBoxes.length;
    }

    this.getObjectModelIndex = function(objectID) {
        let objIndex = this.getObjectIndexById(objectID);
        if (objIndex < 0) {
            return -1;
        }
        return g_GLObjectSet._arrObjectSet[objIndex]._uPartIndex;
    }

    this.getObjectModelId = function(objectID) {
        let mdlIndex = this.getObjectModelIndex(objectID);
        if (mdlIndex < 0) {
            return -1;
        }
        return g_GLPartSet._arrPartSet[mdlIndex]._uPartID;
    }

    /**
     * 将当前摄像机推进到当前单选中的零件上
     */
    this.setFocusOnObject = function() {
        this.pickIndexs.splice(0, this.pickIndexs.length);
        this.pickIndexs = g_glprogram.getPickedIndex();
        if (this.pickIndexs == null || this.pickIndexs.length == 0) {
            // 如果没有选中任何零件或装配体，默认模型整体聚焦
            for (let i = 0; i < g_webglControl.m_arrObjectMatrix.length; i++) {
                this.pickIndexs.push(i);
            }
        }
        let curModelBox = getPublicModelBox(g_GLObjectSet, g_GLPartSet, this.pickIndexs, g_webglControl.m_arrObjectMatrix);
        getModelBoxCenter(curModelBox, this.curModelCenter);

        let distance = 1.5 * getModelBoxLength(curModelBox);
        let focus_x = this.curModelCenter.x - g_glprogram.modelCenter.x;
        let focus_y = this.curModelCenter.y - g_glprogram.modelCenter.y;
        let focus_z = this.curModelCenter.z - g_glprogram.modelCenter.z;

        let eyeOld = g_camera.eye;
        let eyeDir = new Vector3(eyeOld.x - focus_x, eyeOld.y - focus_y, eyeOld.z - focus_z);
        eyeDir.normalize();
        let eyeNew = new Point3(eyeDir.x * distance, eyeDir.y * distance, eyeDir.z * distance);
        g_camera.slideView(eyeNew.x, eyeNew.y, eyeNew.z, focus_x, focus_y, focus_z);
    }

    /**
     * 模型树节点拾取
     */
    this.pickModelTreeNode = function(indexs) {
        return g_glprogram.pickMultObjectByIndexs(indexs);
    }

    /**
     * 设置背景图片
     */
    this.setBackground = function(index) {
        g_glprogram.setBackground(index);
        g_webglControl.isShowImageBk = true;
    }

    this.addUsrBackground = function(imagePath) {
        let newImage = new Image();
        newImage.src = imagePath;
        let imageDataGL = null;
        newImage.onload = function() {
            imageDataGL = g_texturer.createUrlRgbaTexture(newImage);
            if (imageDataGL != null) {
                g_glprogram.addBackground(imageDataGL);
            }
        }
        g_webglControl.isShowImageBk = true;
    }

    this.setBackgroundColor = function(r, g, b) {
        g_webglControl.m_BgColor.set(r, g, b);
        g_webglControl.isShowImageBk = false;
    }

    this.getBackgroundColor = function() {
        if ((g_webglControl.m_arrBgTexId != null) && (g_webglControl.m_arrBgTexId.length > 0) &&
            g_webglControl.isShowImageBk) {
            return null;
        }
        var arrBgColor = new Array();
        arrBgColor.push(g_webglControl.m_BgColor.x);
        arrBgColor.push(g_webglControl.m_BgColor.y);
        arrBgColor.push(g_webglControl.m_BgColor.z);
        return arrBgColor;
    }

    /**
     * 设置当前摄像机参数
     * @param {*} 摄像机 { focus: {}, eyePos: {}, up: {}, near: 0, far: 0 }
     * @returns 
     */
     this.setCameraView = function(camera) {
        this.setCameraCurView(
            {
                _vEyePos:  camera.eyePos,
                _vFocus: camera.focus,
                _vUp: camera.up,
                _fZNear: camera.near,
                _fZFar: camera.far
            }
        )
    }

    /**
     * 获取当前摄像机参数
     * @returns 摄像机参数
     */
    this.getCameraView = function(cmCamera) {
        var cmCamera = {
            focus: {}, eyePos: {}, up: {}, near: 0, far: 0 //, look: {}
        };
        var data = g_glprogram.getModelCenter();
        cmCamera.focus.x = data.x;
        cmCamera.focus.y = data.y;
        cmCamera.focus.z = data.z;

        var viewData = g_camera.getCameraViewData();
        cmCamera.eyePos.x = viewData.eye.x + cmCamera.focus.x;
        cmCamera.eyePos.y = viewData.eye.y + cmCamera.focus.y;
        cmCamera.eyePos.z = viewData.eye.z + cmCamera.focus.z;
        
        cmCamera.up.x = viewData.up.x; 
        cmCamera.up.y = viewData.up.y; 
        cmCamera.up.z = viewData.up.z;

        cmCamera.near = viewData.dis.near; 
        cmCamera.far = viewData.dis.far; 
       
        return cmCamera;
    }

    /**
     * 视角切换
     */
    this.shiftView = function(viewType) {
        switch (viewType) {
            case 0:
                // 主视图
                g_camera.shiftView(0.0, -this.m_fModelLength, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
                break;
            case 1:
                // 后视图
                g_camera.shiftView(0.0, this.m_fModelLength, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
                break;
            case 2:
                // 左视图
                g_camera.shiftView(-this.m_fModelLength, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
                break;
            case 3:
                // 右视图
                g_camera.shiftView(this.m_fModelLength, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
                break;
            case 4:
                // 俯视图
                g_camera.shiftView(0.0, 0.0, this.m_fModelLength, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
                break;
            case 5:
                // 仰视图
                g_camera.shiftView(0.0, 0.0, -this.m_fModelLength, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
                break;
            case 6:
                g_camera.shiftView(this.m_fModelLength / 2.0, this.m_fModelLength / Math.cos(45.0*Math.PI/180.0),
                    this.m_fModelLength / 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
                break;
            default:
                break;
        }
        // 模型聚焦回到中心
        g_glprogram.pickNone();
    }

    /**
     * 设置模型透明度
     */
    this.setObjectTransparent = function(arrObjIds, transparent) {
        if (arrObjIds == null || arrObjIds.length == 0) {
            g_glprogram.setObjectTransparent(-1, transparent);
        } else {
            let objectIndex = -1;
            for (let i = 0; i < arrObjIds.length; ++i) {
                objectIndex = this.getObjectIndexById(arrObjIds[i]);
                if (objectIndex >= 0) {
                    g_glprogram.setObjectTransparent(objectIndex, transparent);
                }
            }
        }
    }
    this.getObjectTransparent = function(nObjectIndex) {
        return g_glprogram.getObjectTransparent(nObjectIndex);
    }

    /**
     * 设置模型消隐
     */
    this.setObjectVisible = function(visible) {
        g_glprogram.setObjectVisible(-1, visible);
    }
    this.getObjectVisible = function(nObjectIndex) {
        return g_glprogram.getObjectVisible(nObjectIndex);
    }
    this.setMultObjectVisible = function(indexs, visible) {
        if (indexs==null || indexs.length<1) {
            return;
        }
        g_glprogram.setObjectVisibleByIndexs(indexs, visible);
    }

    /**
     * 设置模型材质颜色
     */
    this.setObjectMaterial = function(red, green, blue, alpha) {
        let objectMaterial = ConvertColorToMaterial(red, green, blue, 1.0);
        g_glprogram.setObjectMaterial(-1, objectMaterial);
    }
    this.setObjectMaterialById = function(objectIndex, mtlID) {
        for (let i = 0; i < g_GLMaterialSet._arrMaterialSet.length; ++i) {
            if (g_GLMaterialSet._arrMaterialSet[i]._uMtlID == mtlID) {
                return g_glprogram.setObjectMaterial(objectIndex, g_GLMaterialSet._arrMaterialSet[i]);
            }
        }
    }
    this.setObjectSurfaceMaterial = function(objectIndex, surfaceIndex, red, green, blue, alpha) {
        let objectMaterial = ConvertColorToMaterial(red, green, blue, 1.0);
        g_glprogram.setObjectSurfaceMaterial(objectIndex, surfaceIndex, objectMaterial);
    }
    this.setObjectSurfaceMaterialById = function(objectIndex, surfaceIndex, mtlID) {
        if (objectIndex < 0 || surfaceIndex < 0) {
            return;
        }
        let material = this.getMaterialById(mtlID);
        if (material == null) {
            return -1;
        }
        for (let i = 0; i < g_GLMaterialSet._arrMaterialSet.length; ++i) {
            if (g_GLMaterialSet._arrMaterialSet[i]._uMtlID == mtlID) {
                return g_glprogram.setObjectSurfaceMaterialIndex(objectIndex, surfaceIndex, i);
            }
        }
    }
    this.clearObjectSurfaceMaterial = function(objectID) {
        let objectIndex = this.getObjectIndexById(objectID);
        if (objectIndex >= 0) {
            return g_glprogram.setObjectSurfaceMaterial(objectIndex, -1, null);
        }
    }
    this.getObjectMetialList = function(objectID) {
        if (objectID == -1) {
            // 获取所有材质列表
            return g_GLMaterialSet.Copy();
        } else {
            // 当前零件材质列表
            let objectIndex = this.getObjectIndexById(objectID);
            if (objectIndex >= 0) {
                let arrmtlInfos = new Array();
                for(i = 0; i < g_GLObjectSet._arrObjectSet[objectIndex]._arrSurfaceMaterialIndex.length; ++i) {
                    let tmpInfo = g_GLMaterialSet.GetMaterialInfo(g_GLObjectSet._arrObjectSet[objectIndex]._arrSurfaceMaterialIndex[i]);
                    arrmtlInfos.push(tmpInfo);
                }
                return arrmtlInfos;
            } else {
                return null;
            }
        }
    }

    this.getMaterialById = function(mtlId) {
        for (let i = 0; i < g_GLMaterialSet._arrMaterialSet.length; ++i) {
            if (g_GLMaterialSet._arrMaterialSet[i]._uMtlID == mtlId) {
                return g_GLMaterialSet._arrMaterialSet[i];
            }
        }
        return null;
    }

    this.getTreeNodeById = function(treeId, treeNode) {
        if (treeNode._uTreeNodeID == treeId) {
            return treeNode;
        }

        let subNode = null
        for (let i = 0; i < treeNode._arrSubNode.length; ++i) {
            subNode = this.getTreeNodeById(treeId, treeNode._arrSubNode[i]);
            if (subNode != null) {
                return subNode;
            }
        }
        return null;
    }

    this.getTreeNodeSubObjectIndex = function(treeNode, arrObjIndex) {
        if (treeNode._uObjectIndex >= 0) {
            arrObjIndex.push(treeNode._uObjectIndex);
            return;
        }

        for (let i = 0; i < treeNode._arrSubNode.length; ++i) {
            this.getTreeNodeSubObjectIndex(treeNode._arrSubNode[i], arrObjIndex);
        }
    }

    this.getTreeNodeSubObjectID = function(treeNode, arrObjID) {
        if (treeNode._uObjectIndex >= 0) {
            arrObjID.push(treeNode._uObjectID);
            return;
        }

        for (let i = 0; i < treeNode._arrSubNode.length; ++i) {
            this.getTreeNodeSubObjectID(treeNode._arrSubNode[i], arrObjID);
        }
    }

    this.setObjectEnhancedDisplayByTreeId = function(treeId) {
        let curTreeNode = this.getTreeNodeById(treeId, g_GLData.GLModelTreeNode);
        if (curTreeNode == null) {
            return;
        }

        let arrObjectIndex = new Array();
        this.getTreeNodeSubObjectIndex(curTreeNode, arrObjectIndex);
        return this.setObjectEnhancedDisplayByIndex(arrObjectIndex);
    }

    this.setObjectEnhancedDisplayById = function(arrObjectId) {
        let arrInverseIndex = new Array();
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            let isContained = false;
            let curObjectID = g_GLObjectSet._arrObjectSet[i]._uObjectID;
            for (let j = 0; j < arrObjectId.length; ++j) {
                if (curObjectID == arrObjectId[j]) {
                    isContained = true;
                    break;
                }
            }
            if (!isContained) {
                arrInverseIndex.push(i);
            }
        }

        g_glprogram.setObjectTransparentByIndex(arrInverseIndex, 0.2);
    }

    this.setObjectEnhancedDisplayByIndex = function(arrObjectIndex) {
        let arrInverseIndex = new Array();
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            let isContained = false;
            for (let j = 0; j < arrObjectIndex.length; ++j) {
                if (i == arrObjectIndex[j]) {
                    isContained = true;
                    break;
                }
            }
            if (!isContained) {
                arrInverseIndex.push(i);
            }
        }

        g_glprogram.setObjectTransparentByIndex(arrInverseIndex, 0.2);
    }

    /**
     * 清除所有临时数据
     */
    this.home = function(type) {
        switch (type) {
            case HOME_ALL:
            case HOME_TYPE_CAMERA:
                this.initCamera();
                break;
            default:
                break;
        }
        g_glprogram.home(type);
        g_canvas.home(type);
    }

    /**
     * 摄像机动画数据
     */
    this.setCameraAnim = function(uStartFrame) {
        if (uStartFrame > g_GLObjectSet._uFrameSize || uStartFrame < 0) {
            return false;
        }
        g_GLCameraSet.GetAnimCamera(uStartFrame, this.adfCamera);
        if (this.adfCamera._fFOVY <= 0.0001) {
            return true;
        }
        g_camera.setCurCameraByAdfCamera(this.adfCamera);
        return true;
    }
    this.setObjectAnim = function(uStartFrame) {
        if (uStartFrame > g_GLObjectSet._uFrameSize || uStartFrame < 0) {
            return false;
        }
        g_glprogram.setObjectAnim(uStartFrame);
        return true;
    }
    this.setAnnotationAnim = function(uStartFrame) {
        if (uStartFrame > g_GLObjectSet._uFrameSize || uStartFrame < 0) {
            return false;
        }
        g_canvas.setAnnotationAnim(uStartFrame);
        return true;
    }
    this.getTotalFrame = function() {
        return g_GLObjectSet._uFrameSize;
    }

    this.initDigitalTwinData = function() {
        // 用户自定义数据复原
        this.home();
        // g_glprogram.pickObjectByIndex(-1, false);
        // 模型回到原始中心
        // g_glprogram.setModelCenter(this.ObjectOriginalCenter);
        // 建立索引表
        this.setObjectIDHashMap();
    }

    /**
     * 数字孪生接口
     * 建立哈希表，初始化
     */
    this.setObjectIDHashMap = function() {
        if (this.hashmapObjectID2Index.isEmpty()) {
            for (let i=0; i<g_GLObjectSet._arrObjectSet.length; i++) {
                this.hashmapObjectID2Index.put(g_GLObjectSet._arrObjectSet[i]._uObjectID, i);
            }
        }
    }

    /**
     * 数字孪生接口
     * 通过物件ID设置物件矩阵
     * @param {*} uObjectID 物件ID
     * @param {*} strMatrix ADF_BASEMATRIX矩阵
     */
    this.setObjectOriWorldMatrix = function(uObjectID, strMatrix) {
        // 通过映射表快速查找到Object索引
        let nObjectIndex = this.hashmapObjectID2Index.get(uObjectID);
        if (nObjectIndex == undefined) {
            return;
        }

        // 设置物件World矩阵
        CalMat4(g_GLObjectSet._arrObjectSet[nObjectIndex]._matLocal, this.digitalLocalMat);
        CalMat4(strMatrix, this.digitalWorldMat);
        mat4.multiply(this.digitalMultiplyMat, this.digitalWorldMat, this.digitalLocalMat);
        g_glprogram.setObjectMatrixByIndex(nObjectIndex, this.digitalMultiplyMat);
    }

    /**
     * 数字孪生接口
     * 通过物件ID获取原始物件矩阵
     * @param {*} uObjectID 物件ID
     * @returns 
     */
    this.getObjectOriWorldMatrix = function(uObjectID) {
        let nObjectIndex = this.getObjectIndexById(uObjectID);
        if (nObjectIndex < 0) {
            return;
        }
        // 获取物件World矩阵
        return g_GLObjectSet._arrObjectSet[nObjectIndex]._matWorld;
    }

    /**
     * 数字孪生接口
     * 通过物件ID获取当前物件矩阵
     * @param {*} uObjectID 物件ID
     * @returns 
     */
    this.getObjectCurWorldMatrix = function(uObjectID) {
        let nObjectIndex = this.getObjectIndexById(uObjectID);
        if (nObjectIndex < 0) {
            return;
        }
        // 获取物件World矩阵
        let curWorldMat = g_glprogram.getObjectWorldMatrix(nObjectIndex);
        return CalADFMat(curWorldMat);
    }

    this.setObjectsPickedByIds = function(objectIDs) {
        if (objectIDs == null) {
            return;
        }

        let arrObjectIndexs = new Array();
        for (let j=0; j < objectIDs.length; ++j) {
            for (let i=0; i<g_GLObjectSet._arrObjectSet.length; i++) {
                if (g_GLObjectSet._arrObjectSet[i]._uObjectID == objectIDs[j]) {
                    arrObjectIndexs.push(i);
                    break;
                }
            }
        }
        
        g_glprogram.pickMultObjectByIndexs(arrObjectIndexs);
    }

    /**
     * 数字孪生接口
     * 设置当前摄像机参数
     * @param {*} adfCamera adf格式摄像机
     * @returns 
     */
    this.setCameraCurView = function(cmCamera) {
        g_camera.setCurCameraByAdfCamera(cmCamera);
    }

    this.getRectSelectionStatus = function() {
        return g_canvas.isDuringRectSel;
    }

    this.setRectSelection = function(status, rect) {
        g_canvas.isDuringRectSel = status;
        g_canvas.selRect.copy(rect);
    }

    // 捕捉几何元素
    this.setCaptrueMode = function(captureMode) {
        this.captureType = captureMode;
    }
    this.setCaptureModeByMeasure = function(measureMode) {
        if (!g_webglControl.isContainsGeom) {
            return;
        }
        if (measureMode == MEASURE_NONE) {
            this.captureType = CAPTURE_NONE;
        } else if (measureMode == MEASURE_OBJECT) {
            this.captureType = CAPTURE_OBJECT;
        } else if (measureMode == MEASURE_SURFACE) {
            this.captureType = CAPTURE_GEOM_SURFACE;
        } else if (measureMode == MEASURE_CURVE) {
            this.captureType = CAPTURE_GEOM_CURVE;
        } else if (measureMode == MEASURE_POINT) {
            this.captureType = CAPTURE_GEOM_POINT;
        } else if (measureMode == MEASURE_TWO_CURVES) {
            this.captureType = CAPTURE_GEOM_CURVE;
        } else if (measureMode == MEASURE_TWO_POINTS) {
            this.captureType = CAPTURE_GEOM_POINT;
        }
    }

    this.captureGeomtry = function(screenX, screenY) {
        if (this.captureType == CAPTURE_NONE) {
            g_canvas.captureUnit = null;
            return null;
        }

        if (g_canvas.pickMeasureUintByRay(screenX, screenY, false) > -1) {
            return null;
        }

        this.cvtScreenToWorld(screenX, screenY, this.RayPoint1, this.RayPoint2);
        let intersecRet = g_glprogram.intersectRayScene(this.RayPoint1, this.RayPoint2, this.captureUnit);

        if (this.captureType == CAPTURE_OBJECT) {
            // 不做处理
            g_canvas.captureUnit = null;
            if (intersecRet == null || this.captureUnit.objectIndex == -1) {
                return null;
            }
        } else if (this.captureType == CAPTURE_GEOM_SURFACE) {
            g_canvas.captureUnit = null;
            if (intersecRet == null || this.captureUnit.objectIndex == -1 || this.captureUnit.geomSurfaceIndex < 0) {
                g_glprogram.clearPickSurfaceIndex();
                return null;
            }
            g_glprogram.pickObjectSurfaceByIndex(this.captureUnit.objectIndex, this.captureUnit.surfaceIndex, false);
        } else if (this.captureType == CAPTURE_GEOM_CURVE) {
            if (intersecRet == null || this.captureUnit.objectIndex == -1 || this.captureUnit.geomCurveIndex < 0) {
                g_canvas.captureUnit = null;
                return null;
            }
            // 仅处理canvas2d
            g_canvas.captureUnit = this.captureUnit;
        } else if (this.captureType == CAPTURE_GEOM_POINT) {
            // 仅处理canvas2d
            if (intersecRet == null || this.captureUnit.objectIndex == -1 || this.captureUnit.geomPointIndex < 0) {
                g_canvas.captureUnit = null;
                return null;
            }
            g_canvas.captureUnit = this.captureUnit;
        } else {
            return null;
        }
        return this.captureUnit;
    }

    // 场景设置
    this.setSceneLightOn = function(isOn) {
        g_webglControl.vecLightType[0] = isOn ? 1 : 0;
    }
    this.setSceneLightPosition = function(viewPosX, viewPosY, viewPosZ) {

    }
    this.setSceneLightPower = function(diffuse, ambient, sepcular) {
        if (g_webglControl.vecLightType[0] == 0) {
            return;
        }
        if (diffuse < 0) { diffuse = 0.0; }
        if (diffuse > 1) { diffuse = 1.0; }
        if (ambient < 0) { ambient = 0.0; }
        if (ambient > 1) { ambient = 1.0; }
        if (sepcular < 0) { sepcular = 0.0; }
        if (sepcular > 1) { sepcular = 1.0; }

        g_webglControl.pcLightPower[0] = diffuse;
        g_webglControl.pcLightPower[1] = ambient;
        g_webglControl.pcLightPower[2] = sepcular;

    }

    // 完整加载scle模型
    this.onceLoadScleModel = function() {
        this.isOnceLoad = true;
        g_GLPartSet = GetSVZPartSet();
        this.initSceneBox();
        this.initCamera();
        this.initOperationParams();

        for (let i = 0; i < g_GLPartSet._arrPartSet.length; ++i) {
            // 导入零件数据渲染数据
            g_glprogram.setObjectMeshMaterialUnitByPart(i, g_GLPartSet._arrPartSet[i]);
            g_webgl.updatePartData(i);
        }
        g_GLPartSet.ClearCache();
    }

    // 分段加载scel模型时，初始化数据
    this.startScelModel = function() {
        this.isOnceLoad = false;
        g_GLPartSet = new GL_PARTSET();
        g_GLPartSet._arrPartSet = new Array(g_sceneData.arrModelData.length);
        this.initSceneBox();
        this.initCamera();
        this.initOperationParams();
    }

    // 分段加载scle模型时，更新零件数据
    this.updateScleModel = function(index, stuModelData) {
        if (index < 0 || index > g_GLPartSet._arrPartSet.length) {
            return;
        }
        if (this.isOnceLoad) {
            console.log("current loader is not slice mode");
            return;
        }
        // 转换数据为webgl数据
        let tempGLPart = new GL_PART();
        let tempGLPartData = GetSVZPartData(stuModelData, 0, 0.0)
        tempGLPart._arrPartLODData[0] = tempGLPartData.PARTLODDATA;
        tempGLPart._SurfaceShape = tempGLPartData.PARTSURFACEDATA;
        tempGLPart._CurveShape = tempGLPartData.PARTCURVEDATA;
        tempGLPart._uPrimitType = stuModelData._arrSubset[0]._nPrimitType;
        g_GLPartSet._arrPartSet[index] = tempGLPart;
        
        // 导入零件数据渲染数据
        g_glprogram.setObjectMeshMaterialUnitByPart(index, tempGLPart);
        g_webgl.updatePartData(index);
        g_GLPartSet._arrPartSet[index].ClearCache();
    }

    // 分段加载scle模型时，结束加载
    this.endLoadScleModel = function() {
        // 显示批注数据
        g_canvas.initAnnoData();
        // 清理内存
        g_sceneData.Clear();
    }

    this.importScle = function(type) {
        // 导入一个新的scle模型
        let baseData = Scene2GLData();
        let baseObjectSet = baseData.GLObjectSet;
        let basePartSet = GetSVZPartSet();

        switch (type) {
            case ADDITION_OBJECT_SECTION_TOOL:
                g_sceneSection.importSecTools(baseObjectSet, basePartSet);
                break;
            default:
                ;
        }

        // 清理内存
        g_sceneData.Clear();
    }
}
