// File: SceneSection.js

/**
 * @author wujiali
 */
 
//===================================================================================================

var g_clippingPlaneMtlData = null;
var g_originPt = new Point3(0, 0, 0);
var g_vec4Value = [0, 0, 0, 0];
var g_vec3Dir = new Vector3(0, 0, 0);
var g_vecAngle = new Array(3);

// 全局坐标系
var g_axisX = new Vector3(1.0, 0, 0);
var g_axisY = new Vector3(0, 1.0, 0);
var g_axisZ = new Vector3(0, 0, 1.0);
var g_defaultOrigin = new Vector3(0, 0, 0);
var g_defaultDir = new Vector3(0, 1.0, 0);

// 剖切工具物件
var g_secToolObjectSet = null;
var g_secToolPartSet = null;

// 场景长度
var g_sceneLength = 0;

function SceneSection() {
    // 剖切过程计算参数
    this.sceneBox = null;
    this.sceneOrigin = new Point3(0, 0, 0);
    this.sceneMinLen = 0;
    // 剖切面
    this.arrClipPlanes = new Array();
    this.arrClipPlaneEnable = new Array();    // bool值，标志剖切面是否使用
    this.arrClipPlanePicked = new Array();
    this.sectionFactory = null;
    this.bSectionFactoryInit = false;
    // 交互参数
    this.sectionCallback = null;
    this.enableClipPlanePicked = false;
    this.pickedCilpPlaneIndex = -1;
    this.pickedPlaneUnit = new GL_PICK_ADDITION_UNIT();
    this.m_arrObjectClipEnable = new Array();
    this.pickUnit = new GL_PICK_UNIT();
    this.m_operatorTool = new SectionOperatorTool();
    this.m_intersectTool = new ObjectIntersectTool();
    this.arrObjSurIntersect = new Array();
    this.arrObjectIndex = new Array();
    this.opeObjMatrix = mat4.create();
    this.curOrigin3d = new Point3(0, 0, 0);
    this.curOrigin2d = new Point2(0, 0);
    this.curDir3d = new Vector3(0, 0, 0);
    this.curDir2d = new Point2(0, 0);
    this.MVPMatrix = mat4.create();
    this.RealPoint1 = new Point3(0, 0, 0);
    this.viewMatInverse = mat4.create();
    this.projectionMatInverse = mat4.create();
    this.inverseMVPMatrix = mat4.create();
    this.PointNDCCenter = new Point3(0, 0, 0);
    this.ObjectMoveCenterStart = new Point3(0, 0, 0);
    this.ObjectMoveCenterEnd = new Point3(0, 0, 0);
    // 临时数据
    this.isInitilized = false;
    this.modelMatrixTmp = mat4.create();
    this.RealPoint1 = new Point3(0, 0, 0);
    this.RealPoint2 = new Point3(0, 0, 0);
    this.RealPoint3 = new Point3(0, 0, 0);
    this.pIntersectPt = new ADF_BASEFLOAT3();
    this.arrMeshIndex = new Array();
    this.arrMeshDistance = new Array();
    this.arrMeshIntersectPt = new Array();

    this.initSection = function(callbackFunc) {
        if (glRunTime.m_modelBox != null) {
            this.sceneBox = glRunTime.m_modelBox;
            this.sceneOrigin.set(glRunTime.ObjectOriginalCenter.x, glRunTime.ObjectOriginalCenter.y,
                glRunTime.ObjectOriginalCenter.z);
            this.sceneMinLen = 0.5; // 表示剖切切面占据窗口0.5
        }
        this.sectionCallback = callbackFunc;

        g_clippingPlaneMtlData = new PlaneMaterialData();

        this.initClipPlaneX();
        this.initClipPlaneY();
        this.initClipPlaneZ();
        this.initClipObjectEnable();
        this.isInitilized = true;
        g_webglControl.enbaleCullFace = false;
        g_webglControl.isSectionOn = true;

        this.sectionFactory = new SectionPlaneFactory();
    
        g_webgl.initSection();
        g_sceneLength = glRunTime.m_fModelLength;
    }

    this.clearSection = function() {
        for (let i = 0; i < this.arrClipPlanes.length; ++i) {
            this.arrClipPlanes[i].clear();
        }
        this.arrClipPlanes.splice(0, this.arrClipPlanes.length);
        this.arrClipPlaneEnable.splice(0, this.arrClipPlaneEnable.length);
        this.arrClipPlanePicked.splice(0, this.arrClipPlanePicked.length);
        this.m_arrObjectClipEnable.splice(0, this.m_arrObjectClipEnable.length);
        this.isInitilized = false;
        g_webglControl.enbaleCullFace = true;
        g_webglControl.m_arrClipPlaneVAOs.splice(0, g_webglControl.m_arrClipPlaneVAOs.length);
        g_webglControl.m_arrClipPlaneVBOs.splice(0, g_webglControl.m_arrClipPlaneVBOs.length);
        g_webglControl.isSectionOn = false;
    }

    this.uninitSection = function() {
        this.clearSection();
        this.m_operatorTool.uninit();
    }

    this.initClipPlaneVertex = function(arrPtVertex) {
        arrPtVertex.push(new Point3(-this.sceneMinLen, 0, -this.sceneMinLen));
        arrPtVertex.push(new Point3(this.sceneMinLen, 0, -this.sceneMinLen));
        arrPtVertex.push(new Point3(this.sceneMinLen, 0, this.sceneMinLen));
        arrPtVertex.push(new Point3(-this.sceneMinLen, 0, -this.sceneMinLen));
        arrPtVertex.push(new Point3(this.sceneMinLen, 0, this.sceneMinLen));
        arrPtVertex.push(new Point3(-this.sceneMinLen, 0, this.sceneMinLen));
    }

    /* 剖切面正方向：x轴正向 */
    this.initClipPlaneX = function() {
        let arrPtVertex = new Array();
        let moveMatrix = mat4.create();
        let rotateMatrix = mat4.create();
        let clipPlaneX = new GL_ClipPlane();

        this.initClipPlaneVertex(arrPtVertex);
        // 围绕Z轴顺时针旋转90°
        // CalRotationAxisMatrix(rotateMatrix, g_axisZ, Math.PI / 2);
        mat4.rotate(rotateMatrix, rotateMatrix, -Math.PI / 2, vec3.fromValues(g_axisZ.x, g_axisZ.y, g_axisZ.z));
        clipPlaneX.init(rotateMatrix, moveMatrix, arrPtVertex, g_clippingPlaneMtlData.clipPlaneMtlBlue);
        this.arrClipPlanes.push(clipPlaneX);
        this.arrClipPlaneEnable.push(false);
        this.arrClipPlanePicked.push(false);
    }

    /* 剖切面正方向：y轴正向 */
    this.initClipPlaneY = function() {
        let arrPtVertex = new Array();
        let moveMatrix = mat4.create();
        let rotateMatrix = mat4.create();
        let clipPlaneY = new GL_ClipPlane();

        this.initClipPlaneVertex(arrPtVertex);

        clipPlaneY.init(rotateMatrix, moveMatrix, arrPtVertex, g_clippingPlaneMtlData.clipPlaneMtlBlue);
        this.arrClipPlanes.push(clipPlaneY);
        this.arrClipPlaneEnable.push(false);
        this.arrClipPlanePicked.push(false);
    }

    /* 剖切面正方向：z轴正向 */
    this.initClipPlaneZ = function() {
        let arrPtVertex = new Array();
        let moveMatrix = mat4.create();
        let rotateMatrix = mat4.create();
        let clipPlaneZ = new GL_ClipPlane();

        this.initClipPlaneVertex(arrPtVertex);
        // 围绕X轴逆时针旋转90°
        // CalRotationAxisMatrix(rotateMatrix, g_axisX, Math.PI / 2);
        mat4.rotate(rotateMatrix, rotateMatrix, Math.PI / 2, vec3.fromValues(g_axisX.x, g_axisX.y, g_axisX.z));

        clipPlaneZ.init(rotateMatrix, moveMatrix, arrPtVertex, g_clippingPlaneMtlData.clipPlaneMtlBlue);
        this.arrClipPlanes.push(clipPlaneZ);
        this.arrClipPlaneEnable.push(false);
        this.arrClipPlanePicked.push(false);
    }

    this.initClipObjectEnable = function() {
        if (this.m_arrObjectClipEnable.length == 0) {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                this.m_arrObjectClipEnable.push(true);
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                this.m_arrObjectClipEnable[i] = true;
            }
        }
    }

    this.setClipPlaneMatrix = function(modelMatrix) {
        for (let i = 0; i < this.arrClipPlanes.length; ++i) {
            this.arrClipPlanes[i].setClipPlaneMatrix(modelMatrix);
        }
    }

    this.getClippingEnable = function(index) {
        if (this.isInitilized && index > -1 && index < this.arrClipPlanes.length) {
            return this.arrClipPlaneEnable[index];
        }
        return false;
    }

    this.setEnableClippingPlanes = function(enableX, enableY, enableZ) {
        if (this.isInitilized) {
            this.arrClipPlaneEnable[0] = enableX;
            this.arrClipPlaneEnable[1] = enableY;
            this.arrClipPlaneEnable[2] = enableZ;
        }
    }

    this.setEnableClipping = function(index, enable) {
        if (this.isInitilized && index > -1 && index < this.arrClipPlanes.length) {
            this.arrClipPlaneEnable[index] = enable;
            this.enableSectionOperation(index, enable);
        }
    }

    this.getVisibleClipping = function(index) {
        if (this.isInitilized && index > -1 && index < this.arrClipPlanes.length) {
            return this.arrClipPlanes[index].isVisible;
        }
    }

    this.setVisibleClipping = function(index, visible) {
        if (this.isInitilized && index > -1 && index < this.arrClipPlanes.length) {
            this.arrClipPlanes[index].isVisible = visible;
        }
    }

    this.getRevertClipping = function(index) {
        if (this.isInitilized && index > -1 && index < this.arrClipPlanes.length) {
            return this.arrClipPlanes[index].isRevert;
        }
    }

    this.setRevertClipping = function(index) {
        if (this.isInitilized && index > -1 && index < this.arrClipPlanes.length) {
            this.arrClipPlanes[index].revertClipPlane();
        }
    }

    this.getPickedPlane = function() {
        if (this.isInitilized) {
            for (let i = 0; i < this.arrClipPlanePicked.length; ++i) {
                if (this.arrClipPlanePicked[i] == true) {
                    return i;
                }
            }
        }
        return -1;
    }

    this.setPlanePicked = function(index) {
        if (this.isInitilized) {
            for (let i = 0; i < this.arrClipPlanePicked.length; ++i) {
                if (i == index) {
                    this.arrClipPlanePicked[i] = true;
                    this.pickedCilpPlaneIndex = index;
                } else {
                    this.arrClipPlanePicked[i] = false;
                }
            }

            if (index < 0 || index >= this.arrClipPlanePicked.length) {
                this.pickedCilpPlaneIndex = -1;
            }
        }
    }

    this.isPlanePicked = function() {
        for (let i = 0; i < this.arrClipPlanePicked.length; ++i) {
            if (this.arrClipPlanePicked[i]) {
                return true;
            }
        }
        return false;
    }

    this.getPlaneMaterial = function(index) {
        if (this.isInitilized) {
            if (this.arrClipPlanePicked[index]) {
                return g_clippingPlaneMtlData.clipPlaneMtlRed;
            } else {
                return this.arrClipPlanes[index].material;
            }
        }
        return null;
    }

    this.pickByRay = function(RayPoint1, RayPoint2, isMult, isDoPick, distance) {
        let retIndex = this.pickClipPlane(RayPoint1, RayPoint2);
        if (retIndex >= 0 && retIndex < 3 && (distance == 0 || this.pickedPlaneUnit.distance < distance)) {
            if (isDoPick) {
                if (isMult) {
                    this.setPlanePicked(retIndex);
                } else {
                    this.setPlanePicked(-1);
                    this.arrClipPlanePicked[retIndex] = true;
                }
            }
            return retIndex;
        } else {
            this.setPlanePicked(-1);
            return -1;
        }
    }

    this.pickClipPlane = function(RayPoint1, RayPoint2) {
        this.arrMeshIndex.splice(0, this.arrMeshIndex.length);
        this.arrMeshDistance.splice(0, this.arrMeshDistance.length);
        this.arrMeshIntersectPt.splice(0, this.arrMeshIntersectPt.length);

        for (let i = 0; i < this.arrClipPlanes.length; ++i) {
            for (let j = 0; j < this.arrClipPlanes[i].arrVertex.length; j += 3 * DEFAULT_VERTEX_DATA_COUNT) {
                CalTranslatePoint(this.arrClipPlanes[i].arrVertex[j],
                                  this.arrClipPlanes[i].arrVertex[j + 1],
                                  this.arrClipPlanes[i].arrVertex[j + 2],
                                  this.arrClipPlanes[i].displayMatrix, this.RealPoint1);
                CalTranslatePoint(this.arrClipPlanes[i].arrVertex[j + DEFAULT_VERTEX_DATA_COUNT],
                                  this.arrClipPlanes[i].arrVertex[j + DEFAULT_VERTEX_DATA_COUNT + 1],
                                  this.arrClipPlanes[i].arrVertex[j + DEFAULT_VERTEX_DATA_COUNT + 2],
                                  this.arrClipPlanes.displayMatrix, this.RealPoint2);
                CalTranslatePoint(this.arrClipPlanes[i].arrVertex[j + 2 * DEFAULT_VERTEX_DATA_COUNT],
                                  this.arrClipPlanes[i].arrVertex[j + 2 * DEFAULT_VERTEX_DATA_COUNT + 1],
                                  this.arrClipPlanes[i].arrVertex[j + 2 * DEFAULT_VERTEX_DATA_COUNT + 2],
                                  this.arrClipPlanes[i].displayMatrix, this.RealPoint3);
                if (CalcIntersectOfLineSegTriangle(RayPoint1, RayPoint2, this.RealPoint1, this.RealPoint2, this.RealPoint3, this.pIntersectPt)) {
                    let tempDistance = CalDistanceOfPoint3d(this.pIntersectPt, RayPoint1);
                    let tempIntersetPt = new ADF_BASEFLOAT3();
                    CalInversePoint(this.pIntersectPt, this.arrClipPlanes[i].displayMatrix, tempIntersetPt);
                    this.arrMeshIndex.push(i);
                    this.arrMeshDistance.push(tempDistance);
                    this.arrMeshIntersectPt.push(tempIntersetPt);
                }
            }
        }

        // 计算最小值
        if (this.arrMeshDistance.length == 0) {
            return -1;
        } else {
            let minDistance = Infinity;
            let index = 0;
            for (let i = 0; i < this.arrMeshDistance.length; i++) {
                if (this.arrMeshDistance[i] < minDistance) {
                    minDistance = this.arrMeshDistance[i];
                    index = i;
                }
            }
            this.pickedPlaneUnit.elementType = ADDITION_OBJECT_CLIP_PLANE;
            this.pickedPlaneUnit.elementIndex = this.arrMeshIndex[index];
            this.pickedPlaneUnit.distance = minDistance;
            this.pickedPlaneUnit.intersectPt.set(
                this.arrMeshIntersectPt[index].x, this.arrMeshIntersectPt[index].y, this.arrMeshIntersectPt[index].z);
            return this.arrMeshIndex[index];
        }
    }

    this.pickClipPlaneByIndex = function(index, isMult) {
        if (isMult) {
            this.arrClipPlanePicked[index] = true;
        } else {
            this.setPlanePicked(-1);
            this.arrClipPlanePicked[index] = true;
        }
        return index;
    }

    this.startClipping = function(modelMatrix) {
        if (!this.isInitilized) {
            return;
        }
        for (let i = 0; i < this.arrClipPlanes.length; ++i) {
            if (this.arrClipPlaneEnable[i]) {
                this.arrClipPlanes[i].setClipPlaneMatrix(modelMatrix);
                this.arrClipPlanes[i].calClippingPrepare();
            }
        }
    }

    this.doIsClipping = function(point) {
        if (!this.isInitilized) {
            return false;
        }
        for (let i = 0; i < this.arrClipPlanes.length; ++i) {
            if (this.arrClipPlaneEnable[i]) {
                if (this.arrClipPlanes[i].calIsPointClipped(point)) {
                    return true;
                }
            }
        }
        return false;
    }

    this.endClipping = function() {
        return;
    }

    this.moveClipPlane = function(index, moveDist) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    this.arrClipPlanes[i].moveClipPlaneByDir(moveDist);
                    this.enableSectionOperation(i, true);
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            this.arrClipPlanes[index].moveClipPlaneByDir(moveDist);
            this.enableSectionOperation(index, true);
        }
    }

    this.startMoveClipPlane = function(index) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    this.arrClipPlanes[i].moveClipPlaneByDirBegin();
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            this.arrClipPlanes[index].moveClipPlaneByDirBegin();
        }
    }

    this.doMoveClipPlane = function(index, moveDist) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    this.arrClipPlanes[i].moveClipPlaneByDirUpdate(moveDist);
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            this.arrClipPlanes[index].moveClipPlaneByDirUpdate(moveDist);
        }
    }

    this.endMoveClipPlane = function(index) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    this.arrClipPlanes[i].moveClipPlaneByDirFinal();
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            this.arrClipPlanes[index].moveClipPlaneByDirFinal();
        }
    }

    this.getDistClipPlane = function(index) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    return this.arrClipPlanes[i].getClipPlaneDist();
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            return this.arrClipPlanes[index].getClipPlaneDist();
        }
    }

    this.getPosClipPlane = function(index, pos) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    return this.arrClipPlanes[i].getClipPlaneOrigin(pos);
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            return this.arrClipPlanes[index].getClipPlaneOrigin(pos);
        }
    }

    this.rotateClipPlaneAxis = function(index, angleX, angleY, angleZ) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    if (angleX != 0) {
                        this.arrClipPlanes[i].rotateClipPlaneAxisX(angleX);
                    }
                    if (angleY != 0) {
                        this.arrClipPlanes[i].rotateClipPlaneAxisY(angleY);
                    }
                    if (angleZ != 0) {
                        this.arrClipPlanes[i].rotateClipPlaneAxisZ(angleZ);
                    }
                    this.enableSectionOperation(i, true);
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            if (angleX != 0) {
                this.arrClipPlanes[index].rotateClipPlaneAxisX(angleX);
            }
            if (angleY != 0) {
                this.arrClipPlanes[index].rotateClipPlaneAxisY(angleY);
            }
            if (angleZ != 0) {
                this.arrClipPlanes[index].rotateClipPlaneAxisZ(angleZ);
            }
            this.enableSectionOperation(index, true);
        }
    }

    this.startRotateClipPlaneAxis = function(index, axisX, axisY, axisZ) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    if (axisX) {
                        this.arrClipPlanes[i].setClipPlaneRotateAxisXBegin();
                    }
                    if (axisY) {
                        this.arrClipPlanes[i].setClipPlaneRotateAxisYBegin();
                    }
                    if (axisZ) {
                        this.arrClipPlanes[i].setClipPlaneRotateAxisZBegin();
                    }
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            if (axisX) {
                this.arrClipPlanes[index].setClipPlaneRotateAxisXBegin();
            }
            if (axisY) {
                this.arrClipPlanes[index].setClipPlaneRotateAxisYBegin();
            }
            if (axisZ) {
                this.arrClipPlanes[index].setClipPlaneRotateAxisZBegin();
            }
        }
    }

    this.doRotateClipPlaneAxis = function(index, angleX, angleY, angleZ) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    if (angleX != 0) {
                        this.arrClipPlanes[i].setClipPlaneRotateAxisXUpdate(angleX);
                    }
                    if (angleY != 0) {
                        this.arrClipPlanes[i].setClipPlaneRotateAxisYUpdate(angleY);
                    }
                    if (angleZ != 0) {
                        this.arrClipPlanes[i].setClipPlaneRotateAxisZUpdate(angleZ);
                    }
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            if (angleX != 0) {
                this.arrClipPlanes[index].setClipPlaneRotateAxisXUpdate(angleX);
            }
            if (angleY != 0) {
                this.arrClipPlanes[index].setClipPlaneRotateAxisYUpdate(angleY);
            }
            if (angleZ != 0) {
                this.arrClipPlanes[index].setClipPlaneRotateAxisZUpdate(angleZ);
            }
        }
    }

    this.endRotateClipPlaneAxis = function(index, axisX, axisY, axisZ) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    if (axisX) {
                        this.arrClipPlanes[i].setClipPlaneRotateAxisXFinal();
                    }
                    if (axisY) {
                        this.arrClipPlanes[i].setClipPlaneRotateAxisYFinal();
                    }
                    if (axisZ) {
                        this.arrClipPlanes[i].setClipPlaneRotateAxisZFinal();
                    }
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            if (axisX) {
                this.arrClipPlanes[index].setClipPlaneRotateAxisXFinal();
            }
            if (axisY) {
                this.arrClipPlanes[index].setClipPlaneRotateAxisYFinal();
            }
            if (axisZ) {
                this.arrClipPlanes[index].setClipPlaneRotateAxisZFinal();
            }
        }
    }

    this.getAngleClipPlane = function(index, vecAngles) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    return this.arrClipPlanes[i].getClipPlaneRotateAngles(vecAngles);
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            return this.arrClipPlanes[index].getClipPlaneRotateAngles(vecAngles);
        }
    }

    this.getDirAngleClipPlane = function(index, vecAngles) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    return this.arrClipPlanes[i].getClipPlaneDirAngles(vecAngles);
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            return this.arrClipPlanes[index].getClipPlaneDirAngles(vecAngles);
        }
    }

    this.resetClipPlanePos = function(index) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    this.arrClipPlanes[i].resetClipPlanePos();
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            this.arrClipPlanes[index].resetClipPlanePos();
        }
    }

    this.resetClipPlaneDir = function(index) {
        if (!this.isInitilized) {
            return;
        }
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    this.arrClipPlanes[i].resetClipPlaneDir();
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            this.arrClipPlanes[index].resetClipPlaneDir();
        }
    }

    this.beginSectionOperation = function() {
        if (g_CLESection == "no") {
            return false;
        }
        if (!this.bSectionFactoryInit) {
            this.sectionFactory.Create(null);
            this.sectionFactory.InitData(g_GLPartSet._arrPartSet, 0.000001);
            this.bSectionFactoryInit = true;
        }
        return true;
    }

    this.enableSectionOperation = function(index, enable) {
        if (!this.bSectionFactoryInit) {
            return;
        }
        if (enable) {
            this.sectionFactory.CreateSectionPlaneElemData(g_GLObjectSet._arrObjectSet, g_webglControl.m_arrObjectMatrix, this.arrClipPlanes[index]);
            g_webgl.updateSection();
        } else {

        }
    }

    this.finishSectionOperation = function() {
        if (g_CLESection == "no") {
            return false;
        }
        if (!this.bSectionFactoryInit) {
            return;
        }
        this.sectionFactory.Release();
        g_webgl.uninitSection();
        this.bSectionFactoryInit = false;
    }

    this.isSecToolsInit = function() {
        return this.m_operatorTool.m_bInit;
    }

    this.importSecTools = function(arrObjectSet, arrPartSet) {
        this.m_operatorTool.init(arrObjectSet, arrPartSet);
    }

    this.pickSecTools = function(RayPoint1, RayPoint2) {
        if (!this.isPlanePicked) {
            return null;
        }
        let curPickUnit = this.pickSecToolsCal(RayPoint1, RayPoint2, this.pickUnit);
        if (curPickUnit != null && curPickUnit.objectIndex > -1) {
            this.m_operatorTool.setPickedIndex(curPickUnit.objectIndex);
            return curPickUnit;
        } else {
            this.m_operatorTool.setPickedIndex(-1);
            return null;
        }
    }

    this.pickSecToolsCal = function(RayPoint1, RayPoint2, pickUnitOut) {
        this.m_intersectTool.init(g_secToolObjectSet._arrObjectSet, g_secToolPartSet._arrPartSet, null, null);
        this.arrObjectIndex.splice(0, this.arrObjectIndex.length);
        this.arrObjSurIntersect.splice(0, this.arrObjSurIntersect.length);

        for (let i = 0; i < g_secToolObjectSet._arrObjectSet.length; ++i) {
            mat4.multiply(this.opeObjMatrix, this.arrClipPlanes[this.pickedCilpPlaneIndex].getClipPlaneMatrix(), this.m_operatorTool.m_arrOpeObjMatrix[i]);
            let intersectRet = this.m_intersectTool.intersectRayObjectSurface(RayPoint1, RayPoint2, i, this.opeObjMatrix);
            if (intersectRet != null) {
                this.arrObjectIndex.push(i);
                this.arrObjSurIntersect.push(intersectRet);
            }
        }
        if (this.arrObjSurIntersect.length == 0) {
            return null;
        } else {
            // 取最近的相交Object
            let index = -1;
            let minDistance = Infinity;
            for (let i = 0; i < this.arrObjSurIntersect.length; i++) {
                if (this.arrObjSurIntersect[i].dDistance < minDistance) {
                    minDistance = this.arrObjSurIntersect[i].dDistance;
                    index = i;
                }
            }

            pickUnitOut.elementType = PICK_OBJECT;
            pickUnitOut.objectIndex = this.arrObjectIndex[index];
            pickUnitOut.surfaceIndex = this.arrObjSurIntersect[index].uSurfaceIndex;
            pickUnitOut.distance = this.arrObjSurIntersect[index].dDistance;
            pickUnitOut.intersectPt.set(this.arrObjSurIntersect[index].ptIntersect.x,
                this.arrObjSurIntersect[index].ptIntersect.y, this.arrObjSurIntersect[index].ptIntersect.z);
            return pickUnitOut;
        }
    }

    this.operateSectionStart = function(index) {
        if (index < 0 || index >= this.m_operatorTool.m_arrOpeObjects.length) {
            return;
        }
        if (this.pickedCilpPlaneIndex < 0 || this.pickedCilpPlaneIndex >= this.arrClipPlanes.length) {
            return;
        }

        g_webgl.isDisplayDynamic = false;

        // 记录初始位置和方向
        this.getOpeToolOriginProj(this.curOrigin2d);
        this.getOpeToolDirProj(this.curDir2d);

        switch (index) {
            case SEC_OPERATOR_TYPE_AXIS:
                return this.startMoveClipPlane(this.pickedCilpPlaneIndex);
            case SEC_OPERATOR_TYPE_ORIGIN:
                return;
            case SEC_OPERATOR_TYPE_ROTATE_X:
                return this.startRotateClipPlaneAxis(this.pickedCilpPlaneIndex, 1, 0, 0);
            case SEC_OPERATOR_TYPE_ROTATE_Z:
                return this.startRotateClipPlaneAxis(this.pickedCilpPlaneIndex, 0, 0, 1);
        }
    }

    this.operateSectionUpdate = function(index, stepX, stepY) {
        if (index < 0 || index >= this.m_operatorTool.m_arrOpeObjects.length) {
            return;
        }
        if (this.pickedCilpPlaneIndex < 0 || this.pickedCilpPlaneIndex >= this.arrClipPlanes.length) {
            return;
        }
        switch (index) {
            case SEC_OPERATOR_TYPE_AXIS:
                this.doMoveClipPlane(this.pickedCilpPlaneIndex, this.getOpeMoveDistByDir(stepX, stepY));
                break;
            case SEC_OPERATOR_TYPE_ORIGIN:
                return;
            case SEC_OPERATOR_TYPE_ROTATE_X:
                this.doRotateClipPlaneAxis(this.pickedCilpPlaneIndex, this.getOpeXRotateAngleByDir(stepX, stepY), 0, 0);
                break;
            case SEC_OPERATOR_TYPE_ROTATE_Z:
                this.doRotateClipPlaneAxis(this.pickedCilpPlaneIndex, 0, 0, this.getOpeZRotateAngleByDir(stepX, stepY));
                break;
            default:
                return;
        }
        if (this.sectionCallback != null) {
            this.sectionCallback();
        }
    }

    this.operateSectionFinish = function(index) {
        if (index < 0 || index >= this.m_operatorTool.m_arrOpeObjects.length) {
            return;
        }
        if (this.pickedCilpPlaneIndex < 0 || this.pickedCilpPlaneIndex >= this.arrClipPlanes.length) {
            return;
        }

        g_webgl.isDisplayDynamic = true;
        for (let i = 0; i < this.arrClipPlanePicked.length; ++i) {
            if (this.arrClipPlanePicked[i]) {
                this.enableSectionOperation(i, true);
            }
        }
        switch (index) {
            case SEC_OPERATOR_TYPE_AXIS:
                return this.endMoveClipPlane(this.pickedCilpPlaneIndex);
            case SEC_OPERATOR_TYPE_ORIGIN:
                return;
            case SEC_OPERATOR_TYPE_ROTATE_X:
                return this.endRotateClipPlaneAxis(this.pickedCilpPlaneIndex, 1, 0, 0);
            case SEC_OPERATOR_TYPE_ROTATE_Z:
                return this.endRotateClipPlaneAxis(this.pickedCilpPlaneIndex, 0, 0, 1);
            default:
                return;
        }
    }

    this.operateSectionReset = function(index) {
        if (index == -1) {
            for (let i = 0; i < this.arrClipPlanes.length; ++i) {
                if (this.arrClipPlanePicked[i]) {
                    this.enableSectionOperation(i, true);
                }
            }
        } else if (index > -1 && index < this.arrClipPlanes.length) {
            this.enableSectionOperation(index, true);
        }
    }

    this.getOpeToolOriginProj = function(pt2d) {
        this.arrClipPlanes[this.pickedCilpPlaneIndex].getClipPlaneOrigin(this.curOrigin3d);
        mat4.multiply(this.MVPMatrix, g_webgl.PVMattrix, g_webglControl.m_modelMatrix);
        CalTranslatePoint(this.curOrigin3d.x, this.curOrigin3d.y, this.curOrigin3d.z, this.MVPMatrix, this.RealPoint1);
        pt2d.x = (this.RealPoint1.x + 1.0) * glRunTime.WIDTH / 2;
        pt2d.y = (1.0 - this.RealPoint1.y) * glRunTime.HEIGHT / 2;
    }

    this.getOpeToolDirProj = function(pt2d) {
        this.arrClipPlanes[this.pickedCilpPlaneIndex].getClipPlaneDir(this.curDir3d);
        mat4.multiply(this.MVPMatrix, g_webgl.PVMattrix, g_webglControl.m_modelMatrix);
        CalVec3TransformNormal(this.curDir3d, this.curDir3d, this.MVPMatrix);
        this.curDir3d.normalize();
        pt2d.x = this.curDir3d.x;
        pt2d.y = this.curDir3d.y;
    }

    this.getOpeMoveDistByDir = function(stepX, stepY) {
        let x = stepX / glRunTime.WIDTH * g_sceneLength;
        let y = stepY / glRunTime.HEIGHT * g_sceneLength;
        return 2 * x * this.curDir2d.x - 2 * y * this.curDir2d.y;
    }

    this.getOpeXRotateAngleByDir = function(stepX, stepY) {
        // 绕X轴旋转，正方向是Z轴负向
        this.arrClipPlanes[this.pickedCilpPlaneIndex].getClipPlaneAxisZ(this.curDir3d);
        mat4.multiply(this.MVPMatrix, g_webgl.PVMattrix, g_webglControl.m_modelMatrix);
        CalVec3TransformNormal(this.curDir3d, this.curDir3d, this.MVPMatrix);
        this.curDir3d.normalize();
        let dist = stepX * this.curDir3d.x - stepY * this.curDir3d.y;
        return dist;
    }

    this.getOpeZRotateAngleByDir = function(stepX, stepY) {
        // 绕Z轴旋转，正方向是X轴正向
        this.arrClipPlanes[this.pickedCilpPlaneIndex].getClipPlaneAxisX(this.curDir3d);
        mat4.multiply(this.MVPMatrix, g_webgl.PVMattrix, g_webglControl.m_modelMatrix);
        CalVec3TransformNormal(this.curDir3d, this.curDir3d, this.MVPMatrix);
        this.curDir3d.normalize();
        let dist = stepX * this.curDir3d.x - stepY * this.curDir3d.y;
        return -dist;
    }
}

// 裁剪面
function GL_ClipPlane() {
    // 几何定义
    this.origin = new Vector3(0, 0, 0);
    this.originDir = new Vector3(0, 1, 0);
    this.originRotateMat = mat4.create();
    this.rotateAngle = new Vector3(0, 0, 0);
    this.rotateMatrix = null;
    this.moveDist = 0;
    this.moveMatrix = null;
    this.material = null;
    // 显示数据
    this.arrVertex = null;
    this.vertexCount = 0;
    this.displayMatrix = mat4.create();
    this.isVisible = true;
    // 剖切轮廓线和填充面
    this.arrSecPlaneElemDataInfo = new Array(); // 截面数据(每一个被剖切的模型均对应一个元素) SecPlaneElemDataInfo
    this.arrRefObjIndex = new Array();
    // 辅助计算数据
    this.curOriginPt = new Vector3(0, 0, 0);
    this.curDir = new Vector3(0, 1, 0);
    this.curPlaneDist = 0;
    this.curMoveVec = vec3.create();
    this.curRotateVec = vec3.create();
    this.tmpMat = mat4.create();
    this.statusMove = 0;
    this.statusRotateX = 0;
    this.statusRotateY = 0;
    this.statusRotateZ = 0;
    this.scaleMatrix = mat4.create();
    this.worldMatrix = mat4.create();
    this.wldOriginPt = new Point3(0, 0, 0);
    this.vec4Value = [0, 0, 0, 0];
    this.moveMatrix2 = mat4.create();

    this.init = function(rotateMatrix, moveMatrix, arrPtVertex, material) {
        this.rotateMatrix = rotateMatrix;
        mat4.copy(this.originRotateMat, rotateMatrix);

        this.arrVertex = new Float32Array(arrPtVertex.length * 3);
        for (let i = 0; i < arrPtVertex.length; ++i) {
            this.arrVertex[i*3] = arrPtVertex[i].x;
            this.arrVertex[i*3+1] = arrPtVertex[i].y;
            this.arrVertex[i*3+2] = arrPtVertex[i].z;
        }
        this.vertexCount = arrPtVertex.length;
        this.moveMatrix = moveMatrix;
        this.material = material;

        CalTranslatePoint(this.origin.x, this.origin.y, this.origin.z, this.moveMatrix, this.curOriginPt);
        CalTranslateAxis(this.origin, this.originDir, this.rotateMatrix, this.curDir);

        this.setFakeClipMoveMatrix();
    }

    this.clear = function() {
        this.origin.set(0, 0, 0);
        this.originDir.set(0, 1, 0);
        this.rotateAngle.set(0, 0, 0);
        this.moveDist = 0;
        this.isVisible = true;
        this.isRevert = false;
        this.statusMove = 0;
        this.statusRotateX = 0;
        this.statusRotateY = 0;
        this.statusRotateZ = 0;
    }

    this.setClipPlaneMatrix = function(modelMatrix) {
        mat4.multiply(this.displayMatrix, this.moveMatrix, this.rotateMatrix);
        mat4.multiply(this.displayMatrix, modelMatrix, this.displayMatrix);
    }

    this.getClipPlaneMatrix = function() {
        CalTranslatePoint(this.origin.x, this.origin.y, this.origin.z, this.displayMatrix, this.curOriginPt);
        let scale = g_camera.getProjectScale(this.curOriginPt);
        this.scaleMatrix[0] = scale;
        this.scaleMatrix[5] = scale;
        this.scaleMatrix[10] = scale;
        mat4.multiply(this.worldMatrix, this.displayMatrix, this.scaleMatrix);
        return this.worldMatrix;
    }

    this.getClipPlaneParams = function() {
        CalTranslatePoint(this.origin.x, this.origin.y, this.origin.z, this.displayMatrix, this.curOriginPt);
        CalTranslateAxis(this.origin, this.originDir, this.rotateMatrix, this.curDir);

        this.vec4Value[0] = this.curDir.x;
        this.vec4Value[1] = this.curDir.y;
        this.vec4Value[2] = this.curDir.z;
        this.vec4Value[3] = CalDistanceToDir(this.curOriginPt, this.curDir);
        return this.vec4Value;
    }

    this.clear = function() {
        this.arrVertex = null;
    }

    this.calClippingPrepare = function() {
        CalTranslatePoint(this.origin.x, this.origin.y, this.origin.z, this.displayMatrix, this.curOriginPt);
        CalTranslateAxis(this.origin, this.originDir, this.rotateMatrix, this.curDir);
        this.curPlaneDist = CalDistanceToDir(this.curOriginPt, this.curDir);
    }

    this.calIsPointClipped = function(point) {
        let pointDist = CalDistanceToDir(point, this.curDir);
        return (pointDist > this.curPlaneDist) ? true : false;
    }

    this.getClipPlaneOrigin = function(pt) {
        CalTranslatePoint(this.origin.x, this.origin.y, this.origin.z, this.moveMatrix, this.curOriginPt);
        pt.set(this.curOriginPt.x, this.curOriginPt.y, this.curOriginPt.z);
    }

    this.setClipPlaneOrigin = function(pt) {
        this.curOriginPt.set(pt.x, pt.y, pt.z);
    }

    this.getClipPlaneDist = function() {
        return this.moveDist;
    }

    this.getClipPlaneDir = function(dir) {
        CalTranslateAxis(this.origin, this.originDir, this.rotateMatrix, dir);
    }

    this.getClipPlaneAxisX = function(axisX) {
        CalTranslateAxis(this.origin, g_axisX, this.rotateMatrix, axisX);
    }

    this.getClipPlaneAxisZ = function(axisZ) {
        CalTranslateAxis(this.origin, g_axisZ, this.rotateMatrix, axisZ);
    }

    this.moveClipPlaneByDir = function(dist) {
        CalTranslateAxis(this.origin, this.originDir, this.rotateMatrix, this.curDir);
        vec3.set(this.curMoveVec, dist * this.curDir.x, dist * this.curDir.y, dist * this.curDir.z)
        mat4.translate(this.moveMatrix, this.moveMatrix, this.curMoveVec);
        this.moveDist = dist;
        this.setFakeClipMoveMatrix();
    }

    this.moveClipPlaneByDirBegin = function() {
        this.moveDist = 0;
        this.statusMove = 1;
    }

    this.moveClipPlaneByDirUpdate = function(dist) {
        if (this.statusMove == 0) {
            return;
        }
        CalTranslateAxis(this.origin, this.originDir, this.rotateMatrix, this.curDir);
        vec3.set(this.curMoveVec, dist * this.curDir.x, dist * this.curDir.y, dist * this.curDir.z)
        mat4.translate(this.moveMatrix, this.moveMatrix, this.curMoveVec);
        this.moveDist += dist;
        this.setFakeClipMoveMatrix();
    }

    this.moveClipPlaneByDirFinal = function() {
        this.statusMove = 0;
    }

    this.resetClipPlanePos = function() {
        mat4.identity(this.moveMatrix);
        this.setFakeClipMoveMatrix();
        this.moveDist = 0;
    }

    this.getClipPlaneDirAngles = function(vecAngles) {
        CalTranslateAxis(this.origin, this.originDir, this.rotateMatrix, this.curDir);
        vecAngles.x = this.curDir.angle(g_axisX) * 180 / Math.PI;
        vecAngles.y = this.curDir.angle(g_axisY) * 180 / Math.PI;
        vecAngles.z = this.curDir.angle(g_axisZ) * 180 / Math.PI;
    }

    this.setClipPlaneDirAngles = function(vecAngles) {

    }

    this.getClipPlaneRotateAngles = function(vecAngles) {
        vecAngles.set(this.rotateAngle.x, this.rotateAngle.y, this.rotateAngle.z);
    }

    this.rotateClipPlaneAxisX = function(angleX) {
        vec3.set(this.curRotateVec, g_axisX.x, g_axisX.y, g_axisX.z);
        mat4.rotate(this.rotateMatrix, this.rotateMatrix, angleX * Math.PI / 180, this.curRotateVec);
        this.rotateAngle.x = angleX;
    }

    this.setClipPlaneRotateAxisXBegin = function() {
        this.rotateAngle.x = 0;
        this.statusRotateX = 1;
    }

    this.setClipPlaneRotateAxisXUpdate = function(angleX) {
        if (this.statusRotateX == 0) {
            return;
        }
        vec3.set(this.curRotateVec, g_axisX.x, g_axisX.y, g_axisX.z);
        mat4.rotate(this.rotateMatrix, this.rotateMatrix, angleX * Math.PI / 180, this.curRotateVec);
        this.rotateAngle.x += angleX;
    }

    this.setClipPlaneRotateAxisXFinal = function() {
        this.statusRotateX = 0;
    }

    this.rotateClipPlaneAxisY = function(angleY) {
        vec3.set(this.curRotateVec, g_axisY.x, g_axisY.y, g_axisY.z);
        mat4.rotate(this.rotateMatrix, this.rotateMatrix, angleY * Math.PI / 180, this.curRotateVec);
        this.rotateAngle.y = angleY;
    }

    this.setClipPlaneRotateAxisYBegin = function() {
        this.rotateAngle.y = 0;
        this.statusRotateY = 1;
    }

    this.setClipPlaneRotateAxisYUpdate = function(angleY) {
        if (this.statusRotateY == 0) {
            return;
        }
        vec3.set(this.curRotateVec, g_axisY.x, g_axisY.y, g_axisY.z);
        mat4.rotate(this.rotateMatrix, this.rotateMatrix, angleY * Math.PI / 180, this.curRotateVec);
        this.rotateAngle.y += angleY;
    }

    this.setClipPlaneRotateAxisYFinal = function() {
        this.statusRotateY = 0;
    }

    this.rotateClipPlaneAxisZ = function(angleZ) {
        vec3.set(this.curRotateVec, g_axisZ.x, g_axisZ.y, g_axisZ.z);
        mat4.rotate(this.rotateMatrix, this.rotateMatrix, angleZ * Math.PI / 180, this.curRotateVec);
        this.rotateAngle.z = angleZ;
    }

    this.setClipPlaneRotateAxisZBegin = function() {
        this.rotateAngle.z = 0;
        this.statusRotateZ = 1;
    }

    this.setClipPlaneRotateAxisZUpdate = function(angleZ) {
        if (this.statusRotateZ == 0) {
            return;
        }
        vec3.set(this.curRotateVec, g_axisZ.x, g_axisZ.y, g_axisZ.z);
        mat4.rotate(this.rotateMatrix, this.rotateMatrix, angleZ * Math.PI / 180, this.curRotateVec);
        this.rotateAngle.z += angleZ;
    }

    this.setClipPlaneRotateAxisZFinal = function() {
        this.statusRotateZ = 0;
    }

    this.resetClipPlaneDir = function() {
        mat4.copy(this.rotateMatrix, this.originRotateMat);
        this.rotateAngle.set(0, 0, 0);
    }

    this.revertClipPlane = function() {
        // this.originDir.flip();
        // 反转定义为绕Z旋转180
        vec3.set(this.curRotateVec, g_axisZ.x, g_axisZ.y, g_axisZ.z);
        mat4.rotate(this.rotateMatrix, this.rotateMatrix, 180 * Math.PI / 180, this.curRotateVec);
        this.rotateAngle.z += 180;
    }

    this.getCurAxis = function(axis_x, axis_y, axis_z) {
        CalTranslateAxis(this.origin, g_axisX, this.rotateMatrix, axis_x);
        CalTranslateAxis(this.origin, g_axisY, this.rotateMatrix, axis_y);
        CalTranslateAxis(this.origin, g_axisZ, this.rotateMatrix, axis_z);
    }

    this.getWorldClipPlaneOrigin = function() {
        CalTranslatePoint(this.origin.x, this.origin.y, this.origin.z, this.moveMatrix, this.curOriginPt);
        mat4.invert(this.tmpMat, g_webglControl.m_clipOriginMatrix);
        CalTranslatePoint(this.curOriginPt.x, this.curOriginPt.y, this.curOriginPt.z, this.tmpMat, this.wldOriginPt);
        return this.wldOriginPt;
    }

    this.getWorldClipPlaneDir = function() {
        CalTranslateAxis(this.origin, this.originDir, this.rotateMatrix, this.curDir);
        return this.curDir;
    }

    this.getWorldClipPlaneMatrix = function() {
        mat4.multiply(this.worldMatrix, this.moveMatrix, this.rotateMatrix);
        return this.worldMatrix;
    }

    this.setFakeClipMoveMatrix = function() {
        vec3.set(this.curMoveVec,
            0.01 * g_sceneLength * this.curDir.x,
            0.01 * g_sceneLength * this.curDir.y,
            0.01 * g_sceneLength * this.curDir.z)
        mat4.translate(this.moveMatrix2, this.moveMatrix, this.curMoveVec);
    }

    this.getFakeClipPlaneMatrix = function(modelMatrix) {
        mat4.multiply(this.displayMatrix, this.moveMatrix2, this.rotateMatrix);
        mat4.multiply(this.displayMatrix, modelMatrix, this.displayMatrix);
        CalTranslatePoint(this.origin.x, this.origin.y, this.origin.z, this.displayMatrix, this.curOriginPt);
        let scale = g_camera.getProjectScale(this.curOriginPt);
        this.scaleMatrix[0] = scale;
        this.scaleMatrix[5] = scale;
        this.scaleMatrix[10] = scale;
        mat4.multiply(this.worldMatrix, this.displayMatrix, this.scaleMatrix);
        return this.worldMatrix;
    }
}

const SEC_OPERATOR_TYPE_AXIS = 0;
const SEC_OPERATOR_TYPE_ORIGIN = 1;
const SEC_OPERATOR_TYPE_ROTATE_X = 2;
const SEC_OPERATOR_TYPE_ROTATE_Z = 3;

function SectionOperatorObj() {
    this.operatorType = -1;
    this.objIndex = -1;
    this.partIndex = -1;
    this.material = g_materialData.Black;
    this.transparent = 1.0;
}

function SectionOperatorTool () {
    this.m_bInit = false;
    this.m_arrOpeObjects = new Array();
    this.m_boxLen = 0;
    this.m_originRotateMat = mat4.create();
    this.m_originScaleMat = mat4.create();

    this.m_arrOpeObjMatrix = new Array();
    this.m_arrOpeObjPicked = new Array(); // bool

    this.init = function(arrObjectSet, arrPartSet) {
        if (this.m_bInit) {
            return;
        }

        g_secToolObjectSet = arrObjectSet;
        g_secToolPartSet = arrPartSet;
    
        let baseBox = getModelBox(arrObjectSet, arrPartSet);
        this.m_boxLen = getModelBoxLength(baseBox);
        let scale = 0.2 / this.m_boxLen; // 表示导航坐标系占据窗口0.2
    
        // 初始时默认方向向上
        mat4.rotate(this.m_originRotateMat, this.m_originRotateMat, -Math.PI / 2, vec3.fromValues(g_axisZ.x, g_axisZ.y, g_axisZ.z));
        // 初始默认缩放倍数
        this.m_originScaleMat[0] = scale; this.m_originScaleMat[5] = scale; this.m_originScaleMat[10] = scale;

        let opeType = 0;
        let partIndexStart = g_webglControl.m_arrBaseScene_VAOs.length;
        for (let i = 0; i < arrObjectSet._arrObjectSet.length; ++i) {
            let objMat = mat4.create();
            arrObjectSet._arrObjectSet[i].GetAnimMatrix(0, objMat);
            mat4.multiply(objMat, this.m_originScaleMat, objMat);
            mat4.multiply(objMat, this.m_originRotateMat, objMat);
            this.m_arrOpeObjMatrix.push(objMat);

            let opeObj = new SectionOperatorObj();
            opeObj.operatorType = opeType;
            opeObj.objIndex = this.m_arrOpeObjMatrix.length - 1;
            opeObj.partIndex = partIndexStart + arrObjectSet._arrObjectSet[i]._uPartIndex;
            this.m_arrOpeObjects.push(opeObj);

            this.m_arrOpeObjPicked.push(false);
        }

        let basePartData = null;
        for (let i = 0; i < arrPartSet._arrPartSet.length; ++i) {
            // 导入零件数据渲染数据
            basePartData = arrPartSet._arrPartSet[i]._arrPartLODData[0];
            g_webgl.updateSecOpeToolData(basePartData);
        }

        this.m_bInit = true;
    }

    this.uninit = function() {
        this.m_arrOpeObjects.splice(0, this.m_arrOpeObjects.length);
        this.m_arrOpeObjPicked.splice(0, this.m_arrOpeObjPicked.length);
        mat4.identity(this.m_originRotateMat);
        mat4.identity(this.m_originScaleMat);
        this.m_bInit = false;
    }

    this.setPickedIndex = function(objIndex) {
        for (let i = 0; i < this.m_arrOpeObjPicked.length; ++i) {
            if (i == objIndex) {
                this.m_arrOpeObjPicked[i] = true;
                this.m_arrOpeObjects[i].material = g_materialData.CyanGreen;
            } else {
                this.m_arrOpeObjPicked[i] = false;
                this.m_arrOpeObjects[i].material = g_materialData.Black;
            }
        }
    }
}

// 剖切平面模型信息
function SecPlaneMdlInfo ()
{
    this._arrVertexData = null; // 顶点数据(顶点位置) Uint32Array
    this._arrIndexData = null;   // 索引组，组内3个元素为一组(三角片)或2个元素为一组(线段) Uint32Array

    this.copy = function(info)
    {
        if (this._arrVertexData != null) {
            info._arrVertexData = new Float32Array(this._arrVertexData.length);
            info._arrVertexData.set(this._arrVertexData);
        }
        if (this._arrIndexData != null) {
            info._arrIndexData = new Uint16Array(this._arrIndexData.length);
            info._arrIndexData.set(this._arrIndexData);
        }
    }

    this.set = function(info)
    {
        this._arrVertexData = info._arrVertexData;
        this._arrIndexData = info._arrIndexData;
    }
    this.UpdatePosForLenUnit = function(dLenRatio)
    {
        for (let i = 0; i < this._arrVertexData.length; i++) {
            this._arrVertexData[i] = this._arrVertexData[i] * dLenRatio;
        }
    }
    this.UpdateAnnotDataForChangeLHRH = function()
    {
        for (let i = 0; i < this._arrVertexData.length; i+=3) {
            this._arrVertexData[i] = -this._arrVertexData[i];
        }
    }
}

// 剖切平面轮廓线信息
function SecPlaneContourInfo()
{
    this._arrVertexData = null;            // 顶点数据(顶点位置) Uint32Array
    this._arrIndexData = null;      // 轮廓线(折线)索引组,组内相邻2个元素为一组表示一条线段(理论上必然是首索引等于尾索引的闭合曲线),组内记录多条内外轮廓线
                                          // Array(Uint32Array)

    this.copy = function(info)
    {
        if (this._arrVertexData != null) {
            info._arrVertexData = new Float32Array(this._arrVertexData.length);
            info._arrVertexData.set(this._arrVertexData);
        }
        if (this._arrIndexData != null) {
            info._arrIndexData = new Array(this._arrIndexData.length);
            for (let i = 0; i < this._arrIndexData.length; ++i) {
                info._arrIndexData[i] = new Uint16Array(this._arrIndexData[i].length);
                info._arrIndexData[i].set(this._arrIndexData[i]);
            }
        }
    }

    this.set = function(info)
    {
        this._arrVertexData = info._arrVertexData;
        this._arrIndexData = info._arrIndexData;
    }
    this.UpdatePosForLenUnit = function(dLenRatio)
    {
        for (let i = 0; i < this._arrVertexData.length; i++) {
            this._arrVertexData[i] = this._arrVertexData[i] * dLenRatio;
        }
    }
    this.UpdateAnnotDataForChangeLHRH = function()
    {
        for (let i = 0; i < this._arrVertexData.length; i+3) {
            this._arrVertexData[i] = -this._arrVertexData[i];
        }
    }
}

// 剖切截面(平面)元素数据信息
function SecPlaneElemDataInfo()
{
    this.infoContour = new SecPlaneContourInfo(); // 轮廓线信息
    this.mdlSection = new SecPlaneMdlInfo();      // 截面的模型数据(三角片)
    this.mdlSectionLine = new SecPlaneMdlInfo();  // 剖面线的模型数据(线段)
    this.uRefObjIndex = -1;           // 影响的物件索引
    this.uSectionMtlIndex = -1;          // 截面材质索引
    this.uContourMtlIndex = -1;          // 轮廓线材质索引
    this.uSectionLineMtlIndex = -1;      // 剖面线材质索引

    this.copy = function(data)
    {
        this.infoContour.copy(data.infoContour);
        this.mdlSection.copy(data.mdlSection);
        this.mdlSectionLine.copy(data.mdlSectionLine);

        data.uRefObjIndex = this.uRefObjIndex;
        data.uSectionMtlIndex = this.uSectionMtlIndex;
        data.uContourMtlIndex = this.uContourMtlIndex;
        data.uSectionLineMtlIndex = this.uSectionLineMtlIndex;
    }

    this.set = function(data)
    {
        this.infoContour = data.infoContour;
        this.mdlSection = data.mdlSection;
        this.mdlSectionLine = data.mdlSectionLine;
        this.uRefObjIndex = data.uRefObjIndex;
        this.uSectionMtlIndex = data.uSectionMtlIndex;
        this.uContourMtlIndex = data.uContourMtlIndex;
        this.uSectionLineMtlIndex = data.uSectionLineMtlIndex;
    }
    this.UpdatePosForLenUnit = function(dLenRatio)
    {
        this.infoContour.UpdatePosForLenUnit(dLenRatio);
        this.mdlSection.UpdatePosForLenUnit(dLenRatio);
        this.mdlSectionLine.UpdatePosForLenUnit(dLenRatio);
    }
    this.UpdateAnnotDataForChangeLHRH = function()
    {
        this.infoContour.UpdateAnnotDataForChangeLHRH();
        this.mdlSection.UpdateAnnotDataForChangeLHRH();
        this.mdlSectionLine.UpdateAnnotDataForChangeLHRH();
        let dwTemp = 0;
        for (let i = 0; i < this.mdlSection._arrIndexData.length / 3; i++)
        {
            this.dwTemp = this.mdlSection._arrIndexData[i * 3 + 1];
            this.mdlSection._arrIndexData[i * 3 + 1] = this.mdlSection._arrIndexData[i * 3 + 2];
            this.mdlSection._arrIndexData[i * 3 + 2] = dwTemp;
        }
    }
}