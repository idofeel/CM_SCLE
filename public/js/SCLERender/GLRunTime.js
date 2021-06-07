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
// 全局渲染引擎实例
var g_glprogram = null;
var g_webgl = null;
// 全局摄像机实例
var g_camera = null;
// 全局二维渲染引擎实例
var g_canvas = null;
// 全局xml工具实例
var g_xmlTool = null;

function GLRunTime() {
    // 参数
    this.WIDTH = 0;
    this.HEIGHT = 0;
    this.SCALE_STEP = 10.0;
    this.SCALE_MIN = 10.0;
    this.SCALE_MAX = 2000.0;
    this.m_fModelLength = 1.0;          // 如果相机距离模型比较近，则交互时灵敏度系数应该减小
    this.m_fOperateSensitivity = 1.0;   // 操作灵敏度系数
    this.rotateSensitivity = 1.0;
    // 计算所需数据，置为全局变量，可以减小内存
    this.ray_nds_near = vec3.create();
    this.ray_nds_far = vec3.create();
    this.ray_clip_near = vec4.create();
    this.ray_clip_far = vec4.create();
    this.viewMatInverse = mat4.create();
    this.projectionMatInverse = mat4.create();
    this.MVMatrix = mat4.create();
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
    this.cameraAnmi = null;
    this.adfCamera = new ADF_CAMERA();
    this.adfCameraFocus = new Point3(0, 0, 0);
    this.curModelCenter = new Point3(0, 0, 0);
    this.curObjectCenter = new Point3(0, 0, 0);
    this.hashmapObjectID2Index = new HashMap();
    this.pickIndexs = new Array();
    this.DEFAULT_COMMENT_LINE_X = 0.1;
    this.usrNewComment = null;
    this.isDuringComment = false;
    this.isDuringMultSel = false;
    this.startMouseX = 0;
    this.startMouseY = 0;
    this.runtimeMouseX = 0;
    this.runtimeMouseY = 0;

    /**
     * 渲染引擎数据初始化
     */
    this.initRender = function() {
        var strFirst = g_strCopy.substring(0, 5);
        if (strFirst != "y雪x峰f"){
            return;
        }
        
        g_glprogram = new GLProgram();
        g_camera = new Camera();
        g_canvas = new Canvas2D();

        // 初始化数据
        this.initRuntimeParams();
        // 开始初始化渲染数据
        g_glprogram.initGLData();
        g_canvas.initCanvasView(this.WIDTH, this.HEIGHT);
        g_canvas.initAnnoData();
    }

    this.uninitRender = function() {
        if (g_glprogram != null) {
            g_glprogram.uninitGLData();
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
        
        g_GLData = null;
        if (g_camera != null) {
            g_camera.clear();
        }
        if (this.cameraAnmi != null) {
            this.cameraAnmi.Clear();
        }
        this.adfCamera.Clear();
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
        g_canvas.initAnnoData();
    }

    this.initRuntimeParams = function() {
        this.WIDTH = gl.canvas.clientWidth;
        this.HEIGHT = gl.canvas.clientHeight;

        if (g_GLData == null) {
            g_GLData = Scene2GLData();
            g_GLObjectSet = g_GLData.GLObjectSet;
            g_GLPartSet = g_GLData.GLPartSet;
            g_GLMaterialSet = g_GLData.GLMatertalSet;
            g_GLAnnoSet = g_GLData.GLAnnotData;
        }

        if (g_webglControl.m_arrBgTexId == null) {
            g_webglControl.m_arrBgTexId = GetDefaultBgImg();
        }
        this.m_fModelLength = g_GLData.GLModelLength;
        this.SCALE_MIN = this.m_fModelLength / 20;
        this.SCALE_MAX = this.m_fModelLength * 2;
        this.SCALE_STEP = this.SCALE_MIN;

        this.cameraAnmi = g_GLData.GLCamera;
        this.cameraAnmi.GetAnimCamera(0, this.adfCamera);
        if (this.adfCamera._fFOVY > 0.0001) {
            g_camera.setCamera(this.adfCamera._vEyePos.x - this.adfCamera._vFocus.x,
                                  this.adfCamera._vEyePos.y - this.adfCamera._vFocus.y,
                                  this.adfCamera._vEyePos.z - this.adfCamera._vFocus.z,
                                  0.0, 0.0, 0.0,
                                  this.adfCamera._vUp.x, this.adfCamera._vUp.y, this.adfCamera._vUp.z);
            g_camera.setNearFar(this.adfCamera._fZNear, this.adfCamera._fZFar);
            this.adfCameraFocus.x = this.adfCamera._vFocus.x;
            this.adfCameraFocus.y = this.adfCamera._vFocus.y;
            this.adfCameraFocus.z = this.adfCamera._vFocus.z;
            g_glprogram.setModelCenter(this.adfCameraFocus);
            this.ObjectOriginalCenter.x = this.adfCameraFocus.x;
            this.ObjectOriginalCenter.y = this.adfCameraFocus.y;
            this.ObjectOriginalCenter.z = this.adfCameraFocus.z;
        } else {
            g_camera.setCamera(g_GLData.GLDefEyePos.x, g_GLData.GLDefEyePos.y, g_GLData.GLDefEyePos.z,
                                  0.0, 0.0, 0.0,
                                  g_GLData.GLDefUpAxis.x, g_GLData.GLDefUpAxis.y, g_GLData.GLDefUpAxis.z);
            g_glprogram.setModelCenter(g_GLData.GLModelCenter);
            this.ObjectOriginalCenter.x = g_GLData.GLModelCenter.x;
            this.ObjectOriginalCenter.y = g_GLData.GLModelCenter.y;
            this.ObjectOriginalCenter.z = g_GLData.GLModelCenter.z;
        }
        
        // 模型中心点归零
        g_GLData.GLModelCenter.x = 0;
        g_GLData.GLModelCenter.y = 0;
        g_GLData.GLModelCenter.z = 0;
        g_camera.setPerspectiveMatrix(45 * Math.PI / 180, this.WIDTH / this.HEIGHT);
    }

    /**
     * 绘制3D场景
     */
     this.draw3D = function() {
        // 绘制3D场景
        if (gl != null) {
            g_webgl.draw(g_camera);
        }
    }

    /**
     * 绘制2D注释
     */
    this.draw2D = function() {
        if (gl2d != null) {
            // Clear the 2D canvas
            gl2d.clearRect(0, 0, gl2d.canvas.width, gl2d.canvas.height);
            if (isShowScleComment) {
                g_canvas.drawAnnotation2D();
            }
            if (isShowUsrComment) {
                g_canvas.drawUsrAnnotation();
                if (this.isDuringComment) {
                    g_canvas.drawDuringUsrAnnoation(this.usrNewComment, this.runtimeMouseX, this.runtimeMouseY);
                }
                if (this.isDuringMultSel) {
                    g_canvas.drawFillRect(this.startMouseX, this.startMouseY, this.runtimeMouseX, this.runtimeMouseY);
                }
            }
            if (g_bTestMode) {
                g_canvas.drawTestMode();
            }
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
        // let moveX = deltaX / this.WIDTH * this.m_fModelLength * this.m_fOperateSensitivity;
        // let moveY = deltaY / this.HEIGHT * this.m_fModelLength * this.m_fOperateSensitivity;
        // g_camera.slide(moveX, moveY, 0.0);
        // this.cameraMoveX += moveX;
        // this.cameraMoveY += moveY;

        // 获得整个模型中心
        this.curModelCenter.x = g_GLData.GLModelCenter.x;
        this.curModelCenter.y = g_GLData.GLModelCenter.y;
        this.curModelCenter.z = g_GLData.GLModelCenter.z;
        // 获得中心坐标在设备坐标系下的Z分量
        mat4.multiply(this.MVMatrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        CalTranslatePoint(this.curModelCenter.x, this.curModelCenter.y, this.curModelCenter.z, this.MVMatrix, this.PointNDCCenter);
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
        // let ObjectMat = g_GLData.GLObjectSet._arrObjectSet[nObjectIndex]._matObject;
        let ObjectMat = g_glprogram.getObjectModelMatrix(nObjectIndex);
        let PartIndex = g_GLData.GLObjectSet._arrObjectSet[nObjectIndex]._uPartIndex;
        // 计算Object在世界坐标下的位移量
        getModelBoxCenter(g_GLData.GLPartSet._arrPartSet[PartIndex]._arrPartLODData[0]._boxset._ObjectBox, this.curModelCenter);
        // 获得中心坐标在设备坐标系下的Z分量
        mat4.multiply(this.MVMatrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        mat4.multiply(this.MVPMatrix, this.MVMatrix, ObjectMat);
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
        g_glprogram.setObjectModelMatrixMult(this.ObjectMovematrix);
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
        let inPos = new Point3(pos.x, pos.y, pos.z);
        CalTranslatePoint(inPos.x, inPos.y, inPos.z, g_webglControl.m_arrObjectMatrix[objIndex], inPos);
        CalInversePoint(inPos, g_glprogram.modelMatrix, pos);
    }

    this.cvtWorldToCMOnline = function(pos, objIndex) {
        if (objIndex > 0) {
            let inPos = new Point3(pos.x, pos.y, pos.z);
            CalTranslatePoint(pos.x, pos.y, pos.z, g_glprogram.modelMatrix, inPos);
            CalInversePoint(inPos, g_webglControl.m_arrObjectMatrix[objIndex], pos);
        }
    }

    /**
     * 模型拾取
     */
    this.pick = function(screenX, screenY, isMult, isDoPick) {
        this.cvtScreenToWorld(screenX, screenY, this.RayPoint1, this.RayPoint2);
        // 根据射线，计算与Object的相交
        return g_glprogram.pickByRay(this.RayPoint1, this.RayPoint2, isMult, isDoPick);
    }
    this.pickModelByIndexs = function(indexs) {
        if (indexs == null || indexs.length < 1) {
            return;
        }
        g_glprogram.pickMultByIndex(indexs);
    }

    this.pickModelByIDs = function(objIDs) {
        if (objIDs == null || objIDs.length < 1) {
            g_glprogram.pickByIndex(-1, false);
            return;
        }

        let arrIndex = new Array();
        for (let i = 0; i < objIDs.length; ++i) {
            for (let j = 0; j < g_GLData.GLObjectSet._arrObjectSet.length; ++j) {
                if (g_GLData.GLObjectSet._arrObjectSet[j]._uObjectID == objIDs[i]) {
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
            arrIds.push(g_GLData.GLObjectSet._arrObjectSet[arrIndexs[i]]._uObjectID)
        }
        return arrIds;
    }
    this.getPickObjectIdByIndex = function(index) {
        if (index < 0 || index >= g_GLData.GLObjectSet._arrObjectSet.length) {
            return null;
        }
        return g_GLData.GLObjectSet._arrObjectSet[index]._uObjectID;
    }

    /**
     * 标注数据拾取
     */
    this.pickAnnotation = function(screenX, screenY, isMult) {
        // 屏幕鼠标坐标与常用坐标系y轴反向
        return g_canvas.pickAnnotationByRay(screenX, screenY, isMult);
    }

    /**
     * 对指定零件添加注释数据
     */
    this.addCommentOnObjectById = function(objectID, annoText) {
        let index = this.getObjectIndexById(objectID);
        if (index >= 0) {
            this.addCommentOnObjectByIndex(index, annoText);
        }
    }

    this.addCommentOnObjectByIndex = function(index, annoText) {
        let Center = this.getObjectCenterByIndex(index);
        let center3D = Center.Center3D;
        let center2D = Center.Center2D;
        // 新注释，指向零件包围盒中心点
        let comment = new ADF_COMMENT();

        if (center2D.x > 0 && center2D.x < 0.8) {
            comment.stuAnnot.annoPlaneLocal.x = center2D.x + this.DEFAULT_COMMENT_LINE_X;
        } else if (center2D.x > 0.8) {
            comment.stuAnnot.annoPlaneLocal.x = center2D.x - this.DEFAULT_COMMENT_LINE_X;
        } else if (center2D.x < 0 && center2D.x > -0.8) {
            comment.stuAnnot.annoPlaneLocal.x = center2D.x - this.DEFAULT_COMMENT_LINE_X;
        } else {
            comment.stuAnnot.annoPlaneLocal.x = center2D.x + this.DEFAULT_COMMENT_LINE_X;
        }

        if (center2D.y > 0 && center2D.y < 0.8) {
            comment.stuAnnot.annoPlaneLocal.y = center2D.y + this.DEFAULT_COMMENT_LINE_X;
        } else if (center2D.y > 0.8) {
            comment.stuAnnot.annoPlaneLocal.y = center2D.y - this.DEFAULT_COMMENT_LINE_X;
        } else if (center2D.y < 0 && center2D.y > -0.8) {
            comment.stuAnnot.annoPlaneLocal.y = center2D.y + this.DEFAULT_COMMENT_LINE_X;
        } else {
            comment.stuAnnot.annoPlaneLocal.y = center2D.y + this.DEFAULT_COMMENT_LINE_X;
        }

        center3D.x -= comment.stuAnnot.annoPlaneLocal.x;
        center3D.y -= comment.stuAnnot.annoPlaneLocal.y;

        comment.stuAnnot.pNote.strText = GetSplitStringArray(annoText);
        comment.stuAnnot.pNote.arrLeaderPos.push(center3D);
        comment.stuProperty._strUserName = "";
        comment.stuProperty._strDateTime = "";
        comment.stuProperty._uStartFrameID = 0;

        g_glprogram.addComment(g_camera, comment);
    }

    this.createCommentBegin = function() {
        if (this.usrNewComment != null) {
            this.usrNewComment.Clear();
        } else {
            this.usrNewComment = new ADF_COMMENT();
        }
        this.isDuringComment = true;
    }

    this.createCommentUpdate = function(screenX, screenY) {
        if (this.usrNewComment == null) {
            return;
        }
        this.cvtScreenToWorld(screenX, screenY, this.RayPoint1, this.RayPoint2);
        // 根据射线，计算与Object的相交
        let intersectRet = g_glprogram.intersectRayScene(this.RayPoint1, this.RayPoint2);
        if (intersectRet == null) {
            return false;
        } else {
            g_glprogram.pickByIndex(intersectRet.uObjectIndex, true);
            this.usrNewComment.stuAnnot.pNote.arrLeaderPos.push(intersectRet.ptIntersect);
            // 兼容处理，添加ObjectID数据
            if (this.usrNewComment.stuAnnot.pNote.arrObjectIndexs == null) {
                this.usrNewComment.stuAnnot.pNote.arrObjectIndexs = new Array();
            }
            this.usrNewComment.stuAnnot.pNote.arrObjectIndexs.push(intersectRet.uObjectIndex);
            return true;
        }
    }

    this.createCommentFinal = function(screenX, screenY, info) {
        if (this.usrNewComment == null || this.usrNewComment.stuAnnot.pNote.arrLeaderPos.length == 0) {
            return false;
        } else {
            this.usrNewComment.stuAnnot.pNote.strText = info._uAnnotText;
            this.usrNewComment.stuAnnot.strName = info._uAnnotName;

            this.usrNewComment.stuProperty._strUserName = info._strUsrName;
            this.usrNewComment.stuProperty._strDateTime = info._strCreateTime;
            this.usrNewComment.stuProperty._uStartFrameID = info._uStartFrame;
            this.usrNewComment.stuProperty._uFrameSize = info._uFrameSize;

            g_canvas.adapterScreenToLocal(screenX, screenY, this.usrNewComment.stuAnnot.annoPlaneLocal);
            g_canvas.addUsrComment(this.usrNewComment, false);
            this.usrNewComment = null;
            this.isDuringComment = false;
            return true;
        }
    }

    this.createCommentCancel = function() {
        if (this.usrNewComment != null) {
            this.usrNewComment.Clear();
            this.usrNewComment = null;
            this.isDuringComment = false;
        }
    }

    this.isCommentValid = function() {
        if (this.usrNewComment == null || this.usrNewComment.stuAnnot.pNote.arrLeaderPos.length == 0) {
            return false;
        }
        return true;
    }

    this.updateCommentById = function(x, y, commentInfo) {
        let isNewNote = true;
        let index = -1;
        for (let i = 0; i < g_canvas.m_arrUsrComment.length; ++i) {
            if (g_canvas.m_arrUsrComment[i].stuAnnot.uID == commentInfo._uAnnotID) {
                isNewNote = false;
                index = i;
                break;
            }
        }

        if (!isNewNote) {
            g_canvas.updateUsrComment(commentInfo, index);
            return true;
        }
        return false;
    }

    this.deleteCommentById = function(id) {
        let index = -1;
        for (let i = 0; i < g_canvas.m_arrUsrComment.length; ++i) {
            if (g_canvas.m_arrUsrComment.stuAnnot.uID == id) {
                index = i;
                break;
            }
        }
        g_canvas.deleteUsrComment(index);
    }

    this.importXmlComment = function(xmlDoc) {
        if (g_canvas == null) {
            return false;
        }

        g_xmlTool = new XmlTool();
        let arrComment = g_xmlTool.importXmlComment(xmlDoc);
        if (arrComment == null || arrComment.length == 0) {
            return false;
        }
        for (let i = 0; i < arrComment.length; ++i) {
            g_canvas.addUsrComment(arrComment[i], true);
        }
        return true;
    }

    this.initInputList = function() {
        if (g_canvas.m_arrUsrComment == null || g_canvas.m_arrUsrComment.length == 0) {
            return null;
        }

        var inputData = new Array();
        for (let i = 0; i < g_canvas.m_arrUsrComment.length; ++i) {
            let curComment = g_canvas.m_arrUsrComment[i];
            var newCommentNode = new GL_USRANNOTATION();
            newCommentNode._uAnnotText = curComment.stuAnnot.pNote.strText;
            newCommentNode._strUsrName = curComment.stuProperty._strUserName;
            newCommentNode._strCreateTime = curComment.stuProperty._strDateTime;
            
            let point2d = new Point2(0, 0);
            g_canvas.adapterLocalToScreen(curComment.stuAnnot.annoPlaneLocal.x, curComment.stuAnnot.annoPlaneLocal.y, point2d);
            newCommentNode.value = curComment.stuAnnot.pNote.strText;
            newCommentNode.style = cvtPointToStyle(point2d, newCommentNode.value);
            inputData.push(newCommentNode);
        }
        return inputData;
    }

    this.exportXmlComment = function(xmlDoc) {
        let arrComment = new Array();
        for (let i = 0; i < g_canvas.m_arrIsUsrCommentDel.length; ++i) {
            if (!g_canvas.m_arrIsUsrCommentDel[i]) {
                arrComment.push(g_canvas.m_arrUsrComment[i]);
            }
        }
        if (arrComment.length == 0) {
            return null;
        }

        g_xmlTool = new XmlTool();
        return g_xmlTool.exportXmlComment(xmlDoc, arrComment);
    }

    this.getObjectIndexById = function(objectID) {
        let index = -1;
        for (let i = 0; i < g_GLData.GLObjectSet._arrObjectSet.length; i++) {
            if (objectID == g_GLData.GLObjectSet._arrObjectSet[i]._uObjectID) {
                index = i;
                break;
            }
        }
        return index;
    }

    this.getObjectIdByIndex = function(index) {
        if (index < 0 || index >= g_GLData.GLObjectSet._arrObjectSet.length) {
            return -1;
        }
        return g_GLData.GLObjectSet._arrObjectSet[index]._uObjectID;
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
        let PartIndex = g_GLData.GLObjectSet._arrObjectSet[index]._uPartIndex;

        getModelBoxCenter(g_GLData.GLPartSet._arrPartSet[PartIndex]._arrPartLODData[0]._boxset._ObjectBox, this.curModelCenter);
        mat4.multiply(this.MVMatrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        mat4.multiply(this.MVPMatrix, this.MVMatrix, ObjectMat);
        CalTranslatePoint(this.curModelCenter.x, this.curModelCenter.y, this.curModelCenter.z, this.MVPMatrix, center2D);
        CalTranslatePoint(this.curModelCenter.x, this.curModelCenter.y, this.curModelCenter.z, originObjectMat, center3D);

        return {
            Center2D: center2D,
            Center3D: center3D,
        };
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
        let curModelBox = getPublicModelBox(g_GLData.GLObjectSet, g_GLData.GLPartSet, this.pickIndexs, g_webglControl.m_arrObjectMatrix);
        getModelBoxCenter(curModelBox, this.curModelCenter);
        this.curModelCenter.x = -this.curModelCenter.x;
        this.curModelCenter.y = -this.curModelCenter.y;
        this.curModelCenter.z = -this.curModelCenter.z;
        // 第一步：将模型整体中心移动到当前零件中心
        g_glprogram.moveModelCenter(this.curModelCenter);
        // 第二步：推进摄像机到一定位置
        let distance = 1.5 * getModelBoxLength(curModelBox);
        g_camera.slide(0.0, 0.0, distance - g_camera.getDist());
        g_camera.resetPerspectiveMatrix(45 * Math.PI / 180, this.WIDTH / this.HEIGHT);
    }

    /**
     * 模型树节点拾取
     */
    this.pickModelTreeNode = function(indexs) {
        return g_glprogram.pickMultByIndex(indexs);
    }

    /**
     * 设置背景图片
     */
    this.setBackground = function(index) {
        g_glprogram.setBackground(index);
    }

    this.addUsrBackground = function(imagePath) {
        let newImage = new Image();
        newImage.src = imagePath;
        let imageDataGL = null;
        newImage.onload = function() {
            imageDataGL = getTexImage(newImage, true);
            if (imageDataGL != null) {
                g_glprogram.addBackground(imageDataGL);
            }
        }
    }

    /**
     * 视角切换
     */
    this.shiftView = function(viewType) {
        switch (viewType) {
            case 0:
                // 主视图
                g_camera.setCamera(0.0, 0.0, this.m_fModelLength,
                                      0.0, 0.0, 0.0,
                                      0.0, 1.0, 0.0);
                break;
            case 1:
                // 后视图
                g_camera.setCamera(0.0, 0.0, -this.m_fModelLength,
                                      0.0, 0.0, 0.0,
                                      0.0, 1.0, 0.0);
                break;
            case 2:
                // 左视图
                g_camera.setCamera(-this.m_fModelLength, 0.0, 0.0,
                                      0.0, 0.0, 0.0,
                                      0.0, 1.0, 0.0);
                break;
            case 3:
                // 右视图
                g_camera.setCamera(this.m_fModelLength, 0.0, 0.0,
                                      0.0, 0.0, 0.0,
                                      0.0, 1.0, 0.0);
                break;
            case 4:
                // 俯视图
                g_camera.setCamera(0.0, this.m_fModelLength, 0.0,
                                      0.0, 0.0, 0.0,
                                      0.0, 0.0, 1.0);
                break;
            case 5:
                // 仰视图
                g_camera.setCamera(0.0, -this.m_fModelLength, 0.0,
                                      0.0, 0.0, 0.0,
                                      0.0, 0.0, 1.0);
                break;
            case 6:
                g_camera.setCamera(this.m_fModelLength / 2.0, this.m_fModelLength / Math.cos(45.0*Math.PI/180.0),
                                      this.m_fModelLength / 2.0, 0.0, 0.0, 0.0,
                                      0.0, 1.0, 0.0);
                break;
            default:
                break;
        }
        g_camera.setPerspectiveMatrix(45 * Math.PI / 180, this.WIDTH / this.HEIGHT);
    }

    /**
     * 设置模型透明度
     */
    this.setObjectTransparent = function(transparent) {
        g_glprogram.setObjectTransparentMult(transparent);
    }
    this.getObjectTransparent = function(nObjectIndex) {
        return g_glprogram.getObjectTransparent(nObjectIndex);
    }

    /**
     * 设置模型消隐
     */
    this.setObjectVisible = function(visible) {
        g_glprogram.setObjectVisibleMult(visible);
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
        g_glprogram.setObjectMaterialMult(red, green, blue, alpha);
    }

    /**
     * 清除所有临时数据
     */
    this.home = function(type) {
        g_glprogram.home(type);
        g_canvas.home(type);
    }

    /**
     * 摄像机动画数据
     */
    this.setCameraAnim = function(uStartFrame) {
        if (uStartFrame > g_GLData.GLObjectSet._uFrameSize || uStartFrame < 0) {
            return false;
        }
        this.cameraAnmi.GetAnimCamera(uStartFrame, this.adfCamera);
        if (this.adfCamera._fFOVY <= 0.0001) {
            return true;
        }
        g_camera.setCamera(this.adfCamera._vEyePos.x - this.adfCamera._vFocus.x,
                                this.adfCamera._vEyePos.y - this.adfCamera._vFocus.y,
                                this.adfCamera._vEyePos.z - this.adfCamera._vFocus.z,
                                0.0, 0.0, 0.0,
                                this.adfCamera._vUp.x, this.adfCamera._vUp.y, this.adfCamera._vUp.z);
        g_camera.setNearFar(this.adfCamera._fZNear, this.adfCamera._fZFar);
        g_camera.setPerspectiveMatrix(45 * Math.PI / 180, this.WIDTH / this.HEIGHT);
        this.adfCameraFocus.x = this.adfCamera._vFocus.x;
        this.adfCameraFocus.y = this.adfCamera._vFocus.y;
        this.adfCameraFocus.z = this.adfCamera._vFocus.z;
        g_glprogram.setModelCenter(this.adfCameraFocus);
        return true;
    }
    this.setObjectAnim = function(uStartFrame) {
        if (uStartFrame > g_GLData.GLObjectSet._uFrameSize || uStartFrame < 0) {
            return false;
        }
        g_glprogram.setObjectAnim(uStartFrame);
        return true;
    }
    this.setAnnotationAnim = function(uStartFrame) {
        if (uStartFrame > g_GLData.GLObjectSet._uFrameSize || uStartFrame < 0) {
            return false;
        }
        g_canvas.setAnnotationAnim(uStartFrame);
        return true;
    }
    this.getTotalFrame = function() {
        return g_GLData.GLObjectSet._uFrameSize;
    }

    this.initDigitalTwinData = function() {
        // 用户自定义数据复原
        this.home();
        // g_glprogram.pickByIndex(-1, false);
        // 模型回到原始中心
        // g_glprogram.moveModelCenter(this.ObjectOriginalCenter);
        // 建立索引表
        this.setObjectIDHashMap();
    }

    /**
     * 数字孪生接口
     * 建立哈希表，初始化
     */
    this.setObjectIDHashMap = function() {
        if (this.hashmapObjectID2Index.isEmpty()) {
            for (let i=0; i<g_GLData.GLObjectSet._arrObjectSet.length; i++) {
                this.hashmapObjectID2Index.put(g_GLData.GLObjectSet._arrObjectSet[i]._uObjectID, i);
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
        CalMat4(g_GLData.GLObjectSet._arrObjectSet[nObjectIndex]._matLocal, g_matLocal);
        CalMat4(strMatrix, g_matWorld);
        mat4.multiply(g_matMultiply, g_matWorld, g_matLocal);
        g_glprogram.setObjectMatrixByIndex(nObjectIndex, g_matMultiply);
    }

    this.setObjectsPickedByIds = function(objectIDs) {
        if (objectIDs == null) {
            return;
        }

        let arrObjectIndexs = new Array();
        for (let j=0; j < objectIDs.length; ++j) {
            for (let i=0; i<g_GLData.GLObjectSet._arrObjectSet.length; i++) {
                if (g_GLData.GLObjectSet._arrObjectSet[i]._uObjectID == objectIDs[j]) {
                    arrObjectIndexs.push(i);
                    break;
                }
            }
        }
        
        g_glprogram.pickMultByIndex(arrObjectIndexs);
    }
}