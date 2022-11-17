// File: GLProgram.js

/**
 * @author wujiali
 */
 
//===================================================================================================

var g_boxVertexIndex = new GL_Box_Vertex_Index();

function GLProgram() {
    if (isWebgl2) {
        g_webgl = new WebGL2();
    } else {
        g_webgl = new WebGL1();
    }

    // 动画模式所需的参数
    this.isAnimationMode = false;
    this.uCurFrame = 0;
    // 渲染过程计算所需数据，置为全局变量，能减小内存
    this.aspect = 1.0;
    this.eyeLocation = new Point3();
    this.defaultMaterial = g_materialData.Default;
    this.defaultRed = g_materialData.Red;
    this.RealPoint4 = new Point3(0, 0, 0);
    this.fTransparent = 1.0;
    this.animMatrix = mat4.create();
    this.modelMatrixTmp = mat4.create();
    this.modelInvertMat = mat4.create();
    this.localInvertMat = mat4.create();
    this.objectMatrix = mat4.create();
    this.worldMat = mat4.create();
    this.modelCenter = new Point3(0, 0, 0);
    this.arrPickIndexs = new Array();
    // 零件多选、曲面多选参数
    this.isMultPick = false;
    this.curPickType = PICK_OBJECT;
    // 拾取数据
    this.pickUnit = new GL_PICK_UNIT();
    this.arrObjSurIntersect = new Array();
    this.arrObjectIndex = new Array();
    // test
    this.arrTestDistance = new Array();
    // 控制量
    this.isEnableSurface = false;
    this.isEnableCurve = false;
    // 场景求交计算工具
    this.m_intersectTool = new ObjectIntersectTool();

    /**
     * 初始化渲染3D场景数据
     */
    this.initGLData = function() {
        if (g_GLObjectSet != null) {
            g_webglControl.initControlParams();
            this.initObjectModelMat();
            this.initObjectTransparent();
            this.initObjectVisible();
            this.initObjectMaterial();
            this.initPickIndexs();
            g_webgl.initScene();
        }
    }

    /**
     * 卸载渲染3D数据
     */
     this.uninitGLData = function() {
        if (g_GLObjectSet != null) {
            g_webgl.uninitScene();
            g_webglControl.clearParams();
        }
    }

    /**
     * 清空3D数据
     */
    this.clearGLData = function() {
        if (g_GLObjectSet != null) {
            g_webgl.clearScene();
            g_webglControl.clearParams();
        }
    }

    /**
     * 重置3D数据
     */
    this.resetGLData = function() {
        if (g_GLObjectSet != null) {
            g_webglControl.initControlParams();
            this.initObjectModelMat();
            this.initObjectTransparent();
            this.initObjectVisible();
            this.initObjectMaterial();
            this.initPickIndexs();
            g_webgl.resetScene();
        }
    }

    /**
     * 初始化曲面操作
     */
    this.initSurfaceGLData = function() {
        if (!this.isEnableSurface) {
            this.setObjectCurveUnit();
            this.initObjectSurfaceMaterial();
            this.initSurfacePickIndex();
            this.isEnableSurface = true;
            g_webgl.initGeom();
        }
    }
    /**
     * 清除曲面操作数据
     */
    this.uninitSurfaceGLData = function() {
        if (this.isEnableSurface) {
            this.clearObjectCurveUnit();
            g_webglControl.m_arrObjectSurfaceMaterial.splice(0, g_webglControl.m_arrObjectSurfaceMaterial.length);
            g_webglControl.arrPickObjectSurfaceIndexs.splice(0, g_webglControl.arrPickObjectSurfaceIndexs.length);
            this.isEnableSurface = false;
            g_webgl.uninitGeom();
            g_webglControl.isHighlightSurface = false;
            g_webglControl.isHighlightCurve = false;
        }
    }

    /**
     * 初始化曲线操作
     */
    this.initCurveGLData = function() {
        this.initCurvePickIndex();
        this.isEnableCurve = true;
    }

    /**
     * 清除曲线操作数据
     */
    this.uninitCurveGLData = function() {
        for (let i = 0; i < g_webglControl.arrPickObjectCurveIndexs.length; ++i) {
            g_webglControl.arrPickObjectCurveIndexs[i].splice(0, g_webglControl.arrPickObjectCurveIndexs[i].length);
        }
        this.isEnableCurve = false;
    }

    /**
     * 设置包围盒显示
     */
    this.setBoxShow = function(isShow) {
        g_webglControl.isShowBox = isShow;
    }

    /**
     * 设置高亮显示
     */
    this.setHighlightShow = function(isHighlight) {
        g_webglControl.isHighlight = isHighlight;
    }

    /**
     * 零件拾取
     */
    this.pickNone = function() {
        this.clearPickIndes();
        this.clearPickStatus();
    }
    this.pickObjects = function(objectIndex) {
        if (!this.isMultPick) {
            // 单选，清空之前所有选取标记
            this.clearPickObjectIndexs();
        }
        g_webglControl.arrPickObjectIndexs[objectIndex] = true;
        g_webglControl.isHighlightObject = true;
        g_webglControl.isShowBox = true;
        g_webglControl.isHighlightSurface = false;
        g_webglControl.isHighlightCurve = false;
    }
    this.pickObjectSurfaces = function(objectIndex, surfaceIndex) {
        if (!this.isMultPick) {
            this.clearPickSurfaceIndex();
        }
        g_webglControl.arrPickObjectSurfaceIndexs[objectIndex][surfaceIndex] = true;
        g_webglControl.splitMeshVAOVertexCounts(objectIndex, surfaceIndex, GL_USERPICKED);
        g_webglControl.isHighlightObject = false;
        g_webglControl.isShowBox = false;
        g_webglControl.isHighlightSurface = true;
        g_webglControl.isHighlightCurve = false;
    }
    this.pickObjectCurves = function(objectIndex, curveIndex) {
        if (!this.isMultPick) {
            this.clearPickCurveIndex();
        }
        g_webglControl.arrPickObjectCurveIndexs[objectIndex][curveIndex] = true;
        g_webglControl.splitCurveVAOVertexCounts(objectIndex, curveIndex);
        g_webglControl.isHighlightObject = false;
        g_webglControl.isShowBox = false;
        g_webglControl.isHighlightSurface = false;
        g_webglControl.isHighlightCurve = true;
    }
    this.pickMultObjectByIndexs = function(indexs) {
        let isAllNull = true;
        this.clearPickObjectIndexs();
        g_webglControl.isHighlightObject = true;

        for (let i = 0; i < indexs.length; i++) {
            if (indexs[i] < 0 || indexs[i] >= g_GLObjectSet._arrObjectSet.length) {
                continue;
            }
            g_webglControl.arrPickObjectIndexs[indexs[i]] = true;
            isAllNull = false;
        }
        if (isAllNull) {
            this.clearPickStatus();
            return;
        } else if (indexs.length == 1) {
            this.setPickStatus(false);
        } else {
            this.setPickStatus(true);
        }
    }
    this.pickObjectByIndex = function(objectIndex, isMult) {
        if (objectIndex < 0 || objectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return;
        }
        this.setPickStatus(isMult);
        this.pickObjects(objectIndex);
    }
    this.pickObjectSurfaceByIndex = function(objectIndex, surfaceIndex, isMult) {
        if (objectIndex < 0 || objectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return;
        }
        this.setPickStatus(isMult);
        this.pickObjectSurfaces(objectIndex, surfaceIndex);
    }
    this.pickObjectCurveByIndex = function(objectIndex, curveIndex, isMult) {
        if (objectIndex < 0 || objectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return;
        }
        this.setPickStatus(isMult);
        this.pickObjectCurves(objectIndex, curveIndex);
    }
    this.pickByRay = function(RayPoint1, RayPoint2, isMult, isDoPick) {
        let intersecRet = this.intersectRayScene(RayPoint1, RayPoint2, this.pickUnit);
        if (intersecRet == null) {
            this.pickUnit.Reset();
        }
        // 判断拾取的是否是剖切面
        if (g_sceneSection.enableClipPlanePicked &&
            g_sceneSection.pickByRay(RayPoint1, RayPoint2, isMult, isDoPick, this.pickUnit.distance) >= 0) {
            this.pickUnit.Reset();
        }

        if (isDoPick) {
            if (this.pickUnit.objectIndex == -1) {
                this.pickNone();
            } else {
                this.setPickStatus(isMult);
    
                if (this.curPickType == PICK_OBJECT) {
                    // 只是拾取物件
                    this.pickObjects(this.pickUnit.objectIndex);
                } else if (this.curPickType == PICK_GEOM_SURFACE) {
                    // 只是拾取曲面
                    this.pickObjectSurfaces(this.pickUnit.objectIndex, this.pickUnit.surfaceIndex);
                } else if (this.curPickType == PICK_GEOM_CURVE) {
                    // 只是拾取零件曲线
                    this.pickObjectCurves(this.pickUnit.objectIndex, this.pickUnit.geomCurveIndex);
                } else if (this.curPickType == PICK_GEOM_POINT) {
                    // 只是拾取顶点
                }
            }
        }
        return this.pickUnit;
    }
    this.setPickType = function(type) {
        if (type == PICK_GEOM_CURVE || type == PICK_GEOM_POINT) {
            g_webglControl.isShowGeomtry = true;
        } else {
            g_webglControl.isShowGeomtry = false;
        }
        this.curPickType = type;
    }

    /**
     * 获取零件拾取状态
     */
    this.setPickStatus = function(isMult) {
        g_webglControl.isPicked = true;
        g_webglControl.eMaterialPriority = GL_USERPICKED;
        this.isMultPick = isMult;
        if (!isMult) {
            g_webglControl.GL_PICKSTATUS = 1;
        } else {
            g_webglControl.GL_PICKSTATUS = 2;
        }
    }
    this.clearPickStatus = function() {
        g_webglControl.GL_PICKSTATUS = 0;
        g_webglControl.isPicked = false;
        g_webglControl.eMaterialPriority = GL_ORIGINAL;
    }
    this.getPickStatus = function() {
        return g_webglControl.GL_PICKSTATUS;
    }
    this.getPickedIndex = function() {
        this.arrPickIndexs.splice(0, this.arrPickIndexs.length);
        if (g_webglControl.GL_PICKSTATUS == 1 || g_webglControl.GL_PICKSTATUS == 2) {
            for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
                if (g_webglControl.arrPickObjectIndexs[i]) {
                    this.arrPickIndexs.push(i);
                }
            }
            return this.arrPickIndexs;
        } else {
            return this.arrPickIndexs;
        }
    }

    /**
     * 设置指定object模型的Model矩阵
     */
    this.initObjectModelMat = function() {
        if (g_webglControl.m_arrObjectMatrix.length == 0) {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                let objectMatrix = mat4.create();
                g_GLObjectSet._arrObjectSet[i].GetAnimMatrix(0, objectMatrix);
                g_webglControl.m_arrObjectMatrix.push(objectMatrix);
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                g_GLObjectSet._arrObjectSet[i].GetAnimMatrix(0, g_webglControl.m_arrObjectMatrix[i]);
            }
        }
    }
    this.setObjectModelMatrixPicked = function(modelMatrix) {
        for (let i = 0; i <= g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                mat4.multiply(g_webglControl.m_arrObjectMatrix[i], modelMatrix, g_webglControl.m_arrObjectMatrix[i]);
            }
        }
    }
    this.setObjectMatrixTranslate = function(arrObjectIndex, modelMatrix) {
        for (let i = 0; i < arrObjectIndex.length; ++i) {
            if (arrObjectIndex[i] < 0 || arrObjectIndex[i] >= g_webglControl.m_arrObjectMatrix.length) {
                continue;
            }
            mat4.multiply(g_webglControl.m_arrObjectMatrix[i], modelMatrix, g_webglControl.m_arrObjectMatrix[i]);
        }
    }
    this.setObjectMatrixByIndex = function(index, matrix) {
        if (index < 0 || index >= g_webglControl.m_arrObjectMatrix.length) {
            return;
        }
        mat4.copy(g_webglControl.m_arrObjectMatrix[index], matrix);
    }
    this.getObjectModelMatrix = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return g_webglControl.m_modelMatrix;
        }
        mat4.multiply(this.objectMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[nObjectIndex]);
        return this.objectMatrix;
    }
    this.getObjectOriginMatrix = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return mat4.create();
        }

        g_GLObjectSet._arrObjectSet[nObjectIndex].GetAnimMatrix(this.uCurFrame, this.animMatrix);
        return this.animMatrix;
    }
    this.getObjectWorldMatrix = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return mat4.create();
        }
        // 求物件local矩阵的逆
        CalMat4(g_GLObjectSet._arrObjectSet[nObjectIndex]._matLocal, this.modelMatrixTmp);
        mat4.invert(this.localInvertMat, this.modelMatrixTmp);
        // 矩阵连乘
        mat4.multiply(this.worldMat, g_webglControl.m_arrObjectMatrix[nObjectIndex], this.localInvertMat);
        return this.worldMat;
    }

    /**
     * 设置所有Object透明度
     */
    this.initObjectTransparent = function() {
        // 默认第0帧数据
        if (g_webglControl.m_arrObjectTransparent.length == 0) {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                let tempTrans =  g_GLObjectSet._arrObjectSet[i].GetAnimTransparent(0);
                if (tempTrans > -0.5) {
                    g_webglControl.m_arrObjectTransparent.push(tempTrans);
                    // g_webglControl.switchObjectTranList(i, tempTrans);
                }
                else {
                    g_webglControl.m_arrObjectTransparent.push(1.0);
                    // g_webglControl.switchObjectTranList(i, 1.0);
                }
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                let tempTrans =  g_GLObjectSet._arrObjectSet[i].GetAnimTransparent(0);
                if (tempTrans > -0.5) {
                    g_webglControl.m_arrObjectTransparent[i] = tempTrans;
                } else {
                    g_webglControl.m_arrObjectTransparent[i] = 1.0;
                }
                // g_webglControl.switchObjectTranList(i, g_webglControl.m_arrObjectTransparent[i]);
            }
        }
    }
    this.setObjectTransparent = function(objectIndex, fTransparent) {
        if (objectIndex < -1 || objectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return;
        }
        if (objectIndex == -1) {
            for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
                if (g_webglControl.arrPickObjectIndexs[i]) {
                    g_webglControl.switchObjectTranList(i, fTransparent);
                    g_webglControl.m_arrObjectTransparent[i] = fTransparent;
                }
            }
        } else {
            g_webglControl.switchObjectTranList(objectIndex, fTransparent);
            g_webglControl.m_arrObjectTransparent[objectIndex] = fTransparent;
        }
        
    }
    this.setObjectTransparentByIndex = function(arrObjectIndex, fTransparent) {
        for (let i = 0; i < arrObjectIndex.length; i++) {
            if (arrObjectIndex[i] < 0 || arrObjectIndex[i] >= g_webglControl.m_arrObjectTransparent.length) {
                continue;
            }
            g_webglControl.switchObjectTranList(arrObjectIndex[i], fTransparent);
            g_webglControl.m_arrObjectTransparent[arrObjectIndex[i]] = fTransparent;
        }
    }
    this.getObjectTransparent = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return 0.0;
        }
        return g_webglControl.m_arrObjectTransparent[nObjectIndex];
    }

    /**
     * 设置所有Object显隐性
     */
    this.initObjectVisible = function() {
        if (g_webglControl.m_arrObjectVisiable.length == 0) {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                if (g_GLObjectSet._arrObjectSet[i]._nFillMode == ADFFILL_INVISIBLE) {
                    g_webglControl.m_arrObjectVisiable.push(false);
                } else {
                    g_webglControl.m_arrObjectVisiable.push(true);
                }
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                if (g_GLObjectSet._arrObjectSet[i]._nFillMode == ADFFILL_INVISIBLE) {
                    g_webglControl.m_arrObjectVisiable[i] = false;
                } else {
                    g_webglControl.m_arrObjectVisiable[i] = true;
                }
            }
        }
    }
    this.setObjectVisible = function(objectIndex, bVisible) {
        if (objectIndex < -1 || objectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return;
        }
        if (objectIndex == -1) {
            for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
                if (g_webglControl.arrPickObjectIndexs[i]) {
                    g_webglControl.m_arrObjectVisiable[i] = bVisible;
                }
            }
        } else {
            g_webglControl.m_arrObjectVisiable[objectIndex] = bVisible;
        }
    }
    this.getObjectVisible = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return false;
        }
        return g_webglControl.m_arrObjectVisiable[nObjectIndex];
    }
    this.setObjectVisibleByIndexs = function(indexs, bVisible) {
        for (let i = 0; i < indexs.length; i++) {
            if (indexs[i]<0 || indexs[i] > g_webglControl.m_arrObjectVisiable.length) {
                continue;
            }
            g_webglControl.m_arrObjectVisiable[indexs[i]] = bVisible;
        }
    }

    /**
     * 设置指定Object材质颜色
     */
    this.initObjectMaterial = function() {
        if (g_webglControl.m_arrObjectMaterial.length == 0) {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                g_webglControl.m_arrObjectMaterial.push(null);
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                g_webglControl.m_arrObjectMaterial[i] = null;
            }
        }
    }
    this.setObjectMaterial = function(objectIndex, objectMaterial) {
        if (objectIndex < -1 || objectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return;
        }
        if (objectIndex == -1) {
            for (let i = 0; i <= g_webglControl.arrPickObjectIndexs.length; i++) {
                if (g_webglControl.arrPickObjectIndexs[i]) {
                    g_webglControl.m_arrObjectMaterial[i] = objectMaterial;
                }
            }
        } else {
            g_webglControl.m_arrObjectMaterial[objectIndex] = objectMaterial;
        }
        g_webglControl.eMaterialPriority = GL_USERDEFINE;
    }

    this.initObjectSurfaceMaterial = function() {
        if (g_webglControl.m_arrObjectSurfaceMaterial.length == 0) {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                let arrSurfaceMtl = new Array();
                let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                for (let j = 0; j < g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length; ++j) {
                    arrSurfaceMtl.push(null);
                }
                g_webglControl.m_arrObjectSurfaceMaterial.push(arrSurfaceMtl);
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                for (let j = 0; j < g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length; ++j) {
                    g_webglControl.m_arrObjectSurfaceMaterial[i][j] = null;
                }
            }
        }
    }

    this.setObjectSurfaceMaterial = function(objectIndex, surfaceIndex, material) {
        if (objectIndex < -1 || objectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return;
        }
        
        if (objectIndex == -1) {
            // 清除当前场景所有被设置的材质
            for (let i = 0; i < g_webglControl.m_arrObjectSurfaceMaterial.length; ++i) {
                for (let j = 0; j < g_webglControl.m_arrObjectSurfaceMaterial[i].length; ++j) {
                    g_webglControl.clearUsrDefineMaterial(i, j);
                }
            }
            g_webglControl.splitMeshVAOVertexCounts(-1, -1, GL_USERDEFINE);
        } else {
            let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
            if (surfaceIndex < -1 ||
                surfaceIndex >= g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length) {
                return;
            }
            if (surfaceIndex == -1) {
                // 清除当前零件所有被设置的材质
                for (let j = 0; j < g_webglControl.m_arrObjectSurfaceMaterial[objectIndex].length; ++j) {
                    g_webglControl.clearUsrDefineMaterial(i, j);
                }
                g_webglControl.splitMeshVAOVertexCounts(-1, -1, GL_USERDEFINE);
            } else {
                // 设置指定的曲面材质
                g_webglControl.arrPickObjectSurfaceIndexs[objectIndex][surfaceIndex] = true;
                g_webglControl.splitMeshVAOVertexCounts(objectIndex, surfaceIndex, GL_USERDEFINE);
                g_webglControl.clearUsrDefineMaterial(objectIndex, surfaceIndex);
                g_webglControl.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex] = material;
                g_webglControl.isHighlightObject = false;
                g_webglControl.isShowBox = false;
                g_webglControl.isHighlightSurface = true;
                g_webglControl.isHighlightCurve = false;
                g_webglControl.eMaterialPriority = GL_USERDEFINE;
            }
        }
    }

    this.setObjectSurfaceMaterialIndex = function(objectIndex, surfaceIndex, materialIndex) {
        if (materialIndex < 0 || materialIndex >= g_GLMaterialSet._arrMaterialSet.length) {
            return;
        }

        let objectMaterial = g_GLMaterialSet._arrMaterialSet[materialIndex];
        this.setObjectSurfaceMaterial(objectIndex, surfaceIndex, objectMaterial);
    }

    /**
     * 清除所有临时设置数据
     */
    this.home = function(type) {
        switch (type) {
            case HOME_ALL:
                this.initObjectModelMat();
                this.initObjectTransparent();
                this.initObjectVisible();
                this.initObjectMaterial();
                break;
            case HOME_POSITION:
                this.initObjectModelMat();
                break;
            case HOME_COLOR:
                this.initObjectMaterial();
                break;
            case HOME_TRANS:
                this.initObjectTransparent();
                break;
            case HOME_VISIBLE:
                this.initObjectVisible();
                break;
            default:
                return;
        }
    }

    /**
     * 计算物件动画数据
     */
    this.setObjectAnim = function(uStartFrame) {
        this.isAnimationMode = true;
        this.uCurFrame = uStartFrame;
        for (let i = 0; i < g_webglControl.m_arrObjectMatrix.length; i++) {
            // 矩阵数据
            g_GLObjectSet._arrObjectSet[i].GetAnimMatrix(uStartFrame, g_webglControl.m_arrObjectMatrix[i]);
            // 透明度数据
            this.fTransparent = g_GLObjectSet._arrObjectSet[i].GetAnimTransparent(uStartFrame);
            g_webglControl.switchObjectTranList(i, this.fTransparent);
            g_webglControl.m_arrObjectTransparent[i] = this.fTransparent;
        }
    }

    /**
     * 设置模型中心点或者焦点
     */
    this.setModelCenter = function(center) {
        this.modelCenter.x = center.x, this.modelCenter.y = center.y, this.modelCenter.z = center.z;
        mat4.identity(g_webglControl.m_modelMatrix);
        mat4.translate(g_webglControl.m_modelMatrix, g_webglControl.m_modelMatrix, vec3.fromValues(-center.x, -center.y, -center.z));
        mat4.translate(g_webglControl.m_clipOriginMatrix, g_webglControl.m_clipOriginMatrix, vec3.fromValues(-center.x, -center.y, -center.z));
    }

    /**
     * 获取模型中心点或者焦点
     */
    this.getModelCenter = function() {
        return {x: this.modelCenter.x, y: this.modelCenter.y, z: this.modelCenter.z }
    }

    this.moveModelCenter = function(trans) {
        this.modelCenter.x += trans.x, this.modelCenter.y += trans.y, this.modelCenter.z += trans.z;
        mat4.translate(g_webglControl.m_modelMatrix, g_webglControl.m_modelMatrix, vec3.fromValues(trans.x, trans.y, trans.z));
        mat4.translate(g_webglControl.m_clipMatrix, g_webglControl.m_clipMatrix, vec3.fromValues(trans.x, trans.y, trans.z));
    }

    /**
     * 设置背景图片
     */
    this.setBackground = function(index) {
        g_webglControl.m_bgIndex = index;
    }
    this.addBackground = function(imageDataGL) {
        if (imageDataGL instanceof WebGLTexture) {
            g_webglControl.m_arrBgTexId.push(imageDataGL);
            g_webglControl.m_bgIndex = g_webglControl.m_arrBgTexId.length - 1;
        }
    }

    this.setObjectMeshMaterialUnitByPart = function(uCurPartIndex, partData) {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; ++i) {
            if (g_GLObjectSet._arrObjectSet[i]._uPartIndex == uCurPartIndex) {
                g_webglControl.setVertexDataNum(uCurPartIndex);
                this.setObjectMeshMaterialUnit(i, partData);
            }
        }
    }

    /**
     * 材质批量处理
     */
    this.setObjectMeshMaterialUnit = function(i, partData) {
        if (partData._uPrimitType == ADFPT_TRIANGLELIST) {
            var uSurfaceNum = partData._arrPartLODData[0]._arrSurfaceVertexNum.length;

            // 只有曲面数据的合并材质
            var isContainsNotTrans = false;
            var isContainsTrans = false;
            // 合并材质，固定长度为surface长度，但是合并后长度由size记录
            var arrObjectVAOUint = new Array();

            if (g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length == 1) {
                var materialIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0];
                if (materialIndex >= 0 && materialIndex < g_GLMaterialSet._arrMaterialSet.length) {
                    if (g_GLMaterialSet._arrMaterialSet[materialIndex]._MtlData._mtlPhysics.vEmissive.w < 1.0) {
                        isContainsTrans = true;
                    } else {
                        isContainsNotTrans = true;
                    }
                }
                // object只有一种材质
                var vaoUnit = new GL_MESH_VAO_UNIT();
                vaoUnit.uintVertexNum = partData._arrPartLODData[0]._arrIndex.length;
                vaoUnit.uintMaterialIndex = materialIndex;
                vaoUnit.surfaceStart = 0;
                vaoUnit.surfaceCount = uSurfaceNum;
                arrObjectVAOUint.push(vaoUnit);
            } else {
                // Object有多个Surface，并且有多个材质
                var uCurIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0];
                var uVertexCount = partData._arrPartLODData[0]._arrSurfaceVertexNum[0];
                // 记录第一个材质VAO数据
                arrObjectVAOUint.push(new GL_MESH_VAO_UNIT());
                arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceStart = 0;
                arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceCount = 1;

                // 初始物体透明度标志
                if (uCurIndex >= 0 && uCurIndex < g_GLMaterialSet._arrMaterialSet.length) {
                    if (g_GLMaterialSet._arrMaterialSet[uCurIndex]._MtlData._mtlPhysics.vEmissive.w < 1.0) {
                        isContainsTrans = true;
                    } else {
                        isContainsNotTrans = true;
                    }
                }
                for (let j = 1; j < g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length; j++) {
                    if (g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j] == uCurIndex) {
                        // 归并到上一段材质VAO数据
                        uVertexCount += partData._arrPartLODData[0]._arrSurfaceVertexNum[j];
                        arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceCount++;

                        if (j == g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length-1) {
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].uintVertexNum = uVertexCount;
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex = uCurIndex;
                        }
                    } else {
                        // 存储上一段材质的VAO数据
                        arrObjectVAOUint[arrObjectVAOUint.length - 1].uintVertexNum = uVertexCount;
                        arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex = uCurIndex;
                        // 开始新一段材质VAO数据的记录
                        arrObjectVAOUint.push(new GL_MESH_VAO_UNIT());
                        arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceStart = j;
                        arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceCount = 1;

                        if (j == g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length-1) {
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].uintVertexNum = partData._arrPartLODData[0]._arrSurfaceVertexNum[j];
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                        } else {
                            uCurIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                            uVertexCount = partData._arrPartLODData[0]._arrSurfaceVertexNum[j];
                        }
                    }
                    // 设置物体透明度标志
                    var materialIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                    if (materialIndex >= 0 && materialIndex < g_GLMaterialSet._arrMaterialSet.length) {
                        if (g_GLMaterialSet._arrMaterialSet[materialIndex]._MtlData._mtlPhysics.vEmissive.w < 1.0) {
                            isContainsTrans = true;
                        } else {
                            isContainsNotTrans = true;
                        }
                    }
                }
            }
            g_webglControl.m_arrObjectMeshVAOUint[i] = arrObjectVAOUint;

            if (isContainsTrans && (!isContainsNotTrans)) {
                // 全透明
                g_webglControl.m_arrObjectTransModeOrig[i] = GLTRANS_ALL;
                g_webglControl.m_arrObjectTransMode[i] = GLTRANS_ALL;
            } else if (isContainsTrans && isContainsNotTrans) {
                // 部分透明
                g_webglControl.m_arrObjectTransModeOrig[i] = GLTRANS_PART;
                g_webglControl.m_arrObjectTransMode[i] = GLTRANS_PART;
            } else {
                // 全不透明
                g_webglControl.m_arrObjectTransModeOrig[i] = GLTRANS_NO;
                g_webglControl.m_arrObjectTransMode[i] = GLTRANS_NO;
            }
        } else {
            // 只有线缆数据的合并材质
            var arrObjectVAOUint = new Array();
            arrObjectVAOUint.push(new GL_MESH_VAO_UNIT(0));
                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintVertexNum = partData._arrPartLODData[0]._arrIndex.length;
                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0];

            g_webglControl.m_arrObjectMeshVAOUint[i] = arrObjectVAOUint;
            g_webglControl.m_arrObjectTransModeOrig[i] = GLTRANS_NO;
            g_webglControl.m_arrObjectTransMode[i] = GLTRANS_NO;
        }

        /* init vao unit object vertex */
        for (let j = 0; j < g_webglControl.m_arrObjectMeshVAOUint[i].length; ++j) {
            g_webglControl.m_arrObjectMeshVAOUint[i][j].InitObjectMesh();
            g_webglControl.m_arrObjectMeshVAOUint[i][j].InitFlags();
        }
    }

    this.setSurfaceMeshMaterialSplit = function() {
        /* init vao unit surface vertex */
        for (let i = 0; i < g_webglControl.m_arrObjectMeshVAOUint.length; ++i) {
            for (let j = 0; j < g_webglControl.m_arrObjectMeshVAOUint[i].length; ++j) {
                g_webglControl.m_arrObjectMeshVAOUint[i][j].InitSurfaceMesh();
                g_webglControl.m_arrObjectMeshVAOUint[i][j].InitFlags();
            }
        }
    }

    /**
     * 生成零件拾取标识数组
     */
    this.initPickIndexs = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            g_webglControl.arrPickObjectIndexs.push(false);
        }
    }
    this.initSurfacePickIndex = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            let curPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            let surfaceFlags = new Array();

            for (let j = 0; j < g_GLPartSet._arrPartSet[curPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length; ++j) {
                surfaceFlags.push(false);
            }
            g_webglControl.arrPickObjectSurfaceIndexs.push(surfaceFlags);
        }
    }
    this.initCurvePickIndex = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            let curPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;

            if (g_GLPartSet._arrPartSet[curPartIndex]._CurveShape == null ||
                g_GLPartSet._arrPartSet[curPartIndex]._CurveShape._arrCurve == null) {
                continue;
            }

            let curveFlags = new Array();
            for (let j = 0; j < g_GLPartSet._arrPartSet[curPartIndex]._CurveShape._arrCurve.length; ++j) {
                curveFlags.push(false);
            }
            g_webglControl.arrPickObjectCurveIndexs.push(curveFlags);
        }
    }

    /**
     * 清空零件拾取标志
     */
    this.clearPickIndes = function() {
        this.clearPickObjectIndexs();
        if (this.isEnableSurface) {
            this.clearPickSurfaceIndex();
        }
        if (this.isEnableCurve) {
            this.clearPickCurveIndex();
        }
    }

    this.clearPickObjectIndexs = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            g_webglControl.arrPickObjectIndexs[i] = false;
        }
    }

    this.clearPickSurfaceIndex = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            let curPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            for (let j = 0; j < g_GLPartSet._arrPartSet[curPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length; ++j) {
                g_webglControl.arrPickObjectSurfaceIndexs[i][j] = false;
            }
        }
        g_webglControl.splitMeshVAOVertexCounts(-1, -1, GL_USERPICKED);
    }
    this.clearPickCurveIndex = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            let curPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            if (g_GLPartSet._arrPartSet[curPartIndex]._CurveShape == null ||
                g_GLPartSet._arrPartSet[curPartIndex]._CurveShape._arrCurve == null) {
                continue;
            }
            for (let j = 0; j < g_GLPartSet._arrPartSet[curPartIndex]._CurveShape._arrCurve.length; ++j) {
                g_webglControl.arrPickObjectCurveIndexs[i][j] = false;
            }
        }
        g_webglControl.splitCurveVAOVertexCounts(-1, -1);
    }

    this.setObjectSurfaceUnit = function() {

    }

    this.setObjectCurveUnit = function() {
        let uCurPartIndex = -1;
        let uCurPartCurveNum = -1;
        let uCurPartCurveVertexSum = -1;
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            if (g_GLPartSet._arrPartSet[uCurPartIndex]._SurfaceShape == null ||
                g_GLPartSet._arrPartSet[uCurPartIndex]._SurfaceShape._arrSurface == null ||
                g_GLPartSet._arrPartSet[uCurPartIndex]._SurfaceShape._arrShapeOfPointsCounts.length == 0) {
                g_webglControl.m_arrObjectCurveVAOUnit.push(null);
                continue;
            }

            uCurPartCurveNum = g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts.length;
            uCurPartCurveVertexSum = g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints.length / 3;
            let vaoUnit = new GL_CURVE_VAO_UNIT(uCurPartCurveNum, uCurPartCurveVertexSum);
            g_webglControl.m_arrObjectCurveVAOUnit.push(vaoUnit);
            g_webglControl.isContainsGeom = true;
            g_canvas.isContainsGeom = true;
        }
    }

    this.clearObjectCurveUnit = function() {
        for (let i = 0; i < g_webglControl.m_arrObjectCurveVAOUnit.length; ++i) {
            g_webglControl.m_arrObjectCurveVAOUnit[i].Clear();
        }
        g_webglControl.m_arrObjectCurveVAOUnit.splice(0, g_webglControl.m_arrObjectCurveVAOUnit.length);
    }

    /**
     * 射线与场景中的object的最近的交点
     * 返回：object索引、交点距离和坐标
     */
    this.intersectRayScene = function(RayPoint1, RayPoint2, pickUnitOut) {
        this.m_intersectTool.init(g_GLObjectSet._arrObjectSet, g_GLPartSet._arrPartSet, this.checkValidPt, this.checkValidBox);
        this.arrObjectIndex.splice(0, this.arrObjectIndex.length);
        this.arrObjSurIntersect.splice(0, this.arrObjSurIntersect.length);
        g_sceneSection.startClipping(g_webglControl.m_modelMatrix);

        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; ++i) {
            let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            // 若是线缆数据则不能拾取
            if (g_GLPartSet._arrPartSet[uCurPartIndex] == null || g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_LINELIST) {
                continue;
            }
            // 若不可见则不能拾取
            if (!g_webglControl.m_arrObjectVisiable[i]) {
                continue;
            }
            if (g_webglControl.m_arrObjectTransparent[i] <= GL_ZERO) {
                continue;
            }
            
            mat4.multiply(this.objectMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[i]);
            let intersectRet = this.m_intersectTool.intersectRayObjectSurface(RayPoint1, RayPoint2, i, this.objectMatrix);
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

            if (this.curPickType == PICK_OBJECT) {
                pickUnitOut.elementType = PICK_OBJECT;
                pickUnitOut.objectIndex = this.arrObjectIndex[index];
                pickUnitOut.surfaceIndex = this.arrObjSurIntersect[index].uSurfaceIndex;
                pickUnitOut.distance = this.arrObjSurIntersect[index].dDistance;
                pickUnitOut.intersectPt.set(this.arrObjSurIntersect[index].ptIntersect.x,
                    this.arrObjSurIntersect[index].ptIntersect.y, this.arrObjSurIntersect[index].ptIntersect.z);
                return pickUnitOut;
                
            } else if (this.curPickType == PICK_GEOM_SURFACE || this.curPickType == PICK_GEOM_CURVE ||
                this.curPickType == PICK_GEOM_POINT) {
                // 根据最近的物件交点计算精确几何数据
                pickUnitOut.objectIndex = this.arrObjectIndex[index];
                pickUnitOut.surfaceIndex = this.arrObjSurIntersect[index].uSurfaceIndex;
                return this.m_intersectTool.intersectRayGeomtry(this.arrObjectIndex[index], this.arrObjSurIntersect[index], this.curPickType, pickUnitOut);

            }
            return null;
        }
    }

    /**
     * 求解零件是否在矩形框内部
     */
    this.isObjectInRect = function(part, mvpMat, rect2D) {
        let retBox = this.isObjBoxInRect(part._boxset._ObjectBox, mvpMat, rect2D);
        if (retBox == RECT_ALL) {
            return true;
        } else if (retBox == RECT_NOT) {
            return false;
        }

        let subInsideCount = 0;
        let retSubset = RECT_NOT;
        let subsetStartIndex = 0;
        for (let i = 0; i < part._boxset._SurfaceBoxes.length; ++i) {
            retSubset = this.isObjBoxInRect(part._boxset._SurfaceBoxes[i], mvpMat, rect2D);
            if (retSubset == RECT_ALL) {
                subInsideCount++;
            } else if (retSubset == RECT_NOT) {
                return false;
            } else {
                for (let j = 0; j < i; ++j) {
                    subsetStartIndex += part._arrSurfaceVertexNum[j];
                }
                if (this.isSurfaceInRect(part, subsetStartIndex, part._arrSurfaceVertexNum[i], mvpMat, rect2D)) {
                    subInsideCount++;
                } else {
                    return false;
                }
            }
        }

        if (subInsideCount == part._boxset._SurfaceBoxes.length) {
            return true;
        } else {
            return false;
        }
    }

    this.isSurfaceInRect = function(part, surfaceStartIndex, surfaceVertexCount, mvpMat, rect2D) {
        for (let i = 0; i < surfaceVertexCount; ++i) {
            let vertexIndex = part._arrIndex[(surfaceStartIndex + i)] * NUM_VERTEX;
            CalTranslatePoint(part._arrVertexPosition[vertexIndex],
                              part._arrVertexPosition[vertexIndex + 1],
                              part._arrVertexPosition[vertexIndex + 2],
                              mvpMat, this.RealPoint4);
            if (!rect2D.isPointInside(this.RealPoint4)) {
                return false;
            }
        }
        return true;
    }

    this.isObjBoxInRect = function(objBox, mvpMat, rect2D) {
        let insideCount = 0;
        for (let i = 0; i < objBox._Vertex.length; ++i) {
            CalTranslatePoint(objBox._Vertex[i].x, objBox._Vertex[i].y, objBox._Vertex[i].z, mvpMat, this.RealPoint4);
            if (rect2D.isPointInside(this.RealPoint4)) {
                insideCount++;
            }
        }
        if (insideCount == objBox._Vertex.length) {
            return RECT_ALL;
        } else if (insideCount == 0) {
            return RECT_NOT;
        } else {
            return RECT_PARTITION;
        }
    }

    this.isObjBoxClipped = function(objBox, modelMatrix) {
        for (let i = 0; i < objBox._Vertex.length; ++i) {
            CalTranslatePoint(objBox._Vertex[i].x, objBox._Vertex[i].y, objBox._Vertex[i].z, modelMatrix, this.RealPoint4);
            if (!g_sceneSection.doIsClipping(this.RealPoint4)) {
                return false;
            }
        }
        return true;
    }

    this.isIntersectClipped = function(intersect) {
        return g_sceneSection.doIsClipping(intersect);
    }

    this.checkValidBox = function(objBox, modelMatrix) {
        for (let i = 0; i < objBox._Vertex.length; ++i) {
            CalTranslatePoint(objBox._Vertex[i].x, objBox._Vertex[i].y, objBox._Vertex[i].z, modelMatrix, this.RealPoint4);
            if (!g_sceneSection.doIsClipping(this.RealPoint4)) {
                return true;
            }
        }
        return false;
    }

    this.checkValidPt = function(pt) {
        return g_sceneSection.doIsClipping(pt) ? false : true;
    }
}