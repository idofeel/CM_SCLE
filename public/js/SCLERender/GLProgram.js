// File: GLProgram.js

/**
 * @author wujiali
 */
 
//===================================================================================================

function GLProgram() {
    if (isWebgl2) {
        g_webgl = new WebGL2();
    } else {
        g_webgl = new WebGL1();
    }

    // 拾取计算
    this.m_arrPartSurfaceIndex = new Array();
    // 动画模式所需的参数
    this.isAnimationMode = false;
    this.uCurFrame = 0;
    // 渲染过程计算所需数据，置为全局变量，能减小内存
    this.aspect = 1.0;
    this.eyeLocation = new Point3();
    this.defaultMaterial = g_materialData.Default;
    this.defaultRed = g_materialData.Red;
    this.vLinePt1 = new ADF_BASEFLOAT3();
    this.vLinePt2 = new ADF_BASEFLOAT3();
    this.vTriVer1 = new ADF_BASEFLOAT3();
    this.vTriVer2 = new ADF_BASEFLOAT3();
    this.vTriVer3 = new ADF_BASEFLOAT3();
    this.RealPoint1 = new Point3(0, 0, 0);
    this.RealPoint2 = new Point3(0, 0, 0);
    this.RealPoint3 = new Point3(0, 0, 0);
    this.pIntersectPt = new ADF_BASEFLOAT3();
    this.fTransparent = 1.0;
    this.animMatrix = mat4.create();
    this.modelMatrix = mat4.create();
    this.modelMatrixTmp = mat4.create();
    this.modelCenter = new Point3(0, 0, 0);
    this.arrPickIndexs = new Array();
    // 零件多选、曲面多选参数
    this.isMultPick = false;
    this.curPickType = PICK_OBJECT;
    // 拾取数据
    this.pickUnit = new GL_PICK_UNIT();
    this.arrObjSurIntersect = new Array();
    this.arrObjectIndex = new Array();
    this.arrSubsetSurfaceIndex = new Array();
    this.arrSubsetDistance = new Array();
    this.arrSubsetIntersectPt = new Array();
    this.arrMeshDistance = new Array();
    this.arrMeshIntersectPt = new Array();
    this.arrBoxVertexIndex = new Array();
    this.arrCurveIndex = new Array();
    this.arrObjectCurveDistance = new Array();
    this.arrObjectCurveIntersectPt = new Array();
    this.arrCurveDistance = new Array();
    this.arrCurveIntersectPt = new Array();
    this.arrObjectPickType = new Array();
    // 测量参数
    this.MVMatrix = mat4.create();
    this.MVPMatrix = mat4.create();
    this.inverseMVPMatrix = mat4.create();
    this.ptNDC = new Point3(0, 0, 0);
    this.ptNDCOffset = new Point3(0, 0, 0);
    this.ptOffset = new Point3(0, 0, 0);
    this.intersectCurveZero = 4;
    this.intersectPointZero = 6;
    this.intersectZero = 0;

    this.arrTestDistance = new Array();


    /**
     * 初始化渲染3D场景数据
     */
    this.initGLData = function() {
        if (g_GLObjectSet != null) {
            this.setObjectMeshMaterialUnit();
            this.setObjectCurveUnit();
            this.initObjectModelMat();
            this.initObjectTransparent();
            this.initObjectVisible();
            this.initObjectMaterial();
            this.initSubsetIndex();
            this.initPickIndexs();
            this.setBoxVertexIndexs();

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

            this.m_arrPartSurfaceIndex.splice(0, this.m_arrPartSurfaceIndex.length);
            this.arrBoxVertexIndex.splice(0, this.arrBoxVertexIndex.length);
        }
    }

    /**
     * 清空3D数据
     */
    this.clearGLData = function() {
        if (g_GLObjectSet != null) {
            g_webgl.clearScene();
            g_webglControl.clearParams();

            this.m_arrPartSurfaceIndex.splice(0, this.m_arrPartSurfaceIndex.length);
            this.arrBoxVertexIndex.splice(0, this.arrBoxVertexIndex.length);
        }
    }

    /**
     * 重置3D数据
     */
    this.resetGLData = function() {
        if (g_GLObjectSet != null) {
            this.setObjectMeshMaterialUnit();
            this.setObjectCurveUnit();
            this.initObjectModelMat();
            this.initObjectTransparent();
            this.initObjectVisible();
            this.initObjectMaterial();
            this.initSubsetIndex();
            this.initPickIndexs();

            g_webgl.resetScene();
        }
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
            this.clearPickIndes();
        }
        g_webglControl.arrPickObjectIndexs[objectIndex] = true;
        g_webglControl.isHighlightObject = true;
        g_webglControl.isShowBox = true;
        g_webglControl.isHighlightSurface = false;
        g_webglControl.isHighlightCurve = false;
    }
    this.pickObjectSurfaces = function(objectIndex, surfaceIndex) {
        if (!this.isMultPick) {
            this.clearPickIndes();
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
            this.clearPickIndes();
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
        this.clearPickIndes();
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

        if (isDoPick) {
            if (this.pickUnit.objectIndex == -1) {
                this.clearPickStatus();
                this.clearPickIndes();
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
                g_GLObjectSet._arrObjectSet[i].GetAnimMatrix(0, this.animMatrix);
                mat4.multiply(objectMatrix, this.modelMatrix, this.animMatrix);
                g_webglControl.m_arrObjectMatrix.push(objectMatrix);
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                g_GLObjectSet._arrObjectSet[i].GetAnimMatrix(0, this.animMatrix);
                mat4.multiply(g_webglControl.m_arrObjectMatrix[i], this.modelMatrix, this.animMatrix);
            }
        }
    }
    this.setObjectModelMatrixAll = function(modelMatrix) {
        for (let i = 0; i <= g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                mat4.multiply(g_webglControl.m_arrObjectMatrix[i], modelMatrix, g_webglControl.m_arrObjectMatrix[i]);
            }
        }
    }
    this.setObjectMatrixByIndex = function(index, matrix) {
        if (index < 0 || index >= g_webglControl.m_arrObjectMatrix.length) {
            return;
        }
        mat4.multiply(g_webglControl.m_arrObjectMatrix[index], this.modelMatrix, matrix);
    }
    this.getObjectModelMatrix = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return this.modelMatrix;
        }
        return g_webglControl.m_arrObjectMatrix[nObjectIndex];
    }
    this.getObjectOriginMatrix = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return mat4.create();
        }

        g_GLObjectSet._arrObjectSet[nObjectIndex].GetAnimMatrix(this.uCurFrame, this.animMatrix);
        return this.animMatrix;
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
                    g_webglControl.switchObjectTranList(i, tempTrans);
                }
                else {
                    g_webglControl.m_arrObjectTransparent.push(1.0);
                    g_webglControl.switchObjectTranList(i, 1.0);
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
                g_webglControl.switchObjectTranList(i, g_webglControl.m_arrObjectTransparent[i]);
            }
        }
    }
    this.setObjectTransparent = function(objectIndex, fTransparent) {
        if (objectIndex < -1 || objectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return;
        }
        if (objectIndex == -1) {
            for (let i = 0; i <= g_webglControl.arrPickObjectIndexs.length; i++) {
                if (g_webglControl.arrPickObjectIndexs[i]) {
                    g_webglControl.switchObjectTranList(i, fTransparent);
                    g_webglControl.m_arrObjectTransparent[i] = fTransparent;
                }
            }
        } else {
            g_webglControl.switchObjectTranList(i, fTransparent);
            g_webglControl.m_arrObjectTransparent[objectIndex] = fTransparent;
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
        // 初始化所有曲面材质
        this.initObjectSurfaceMaterial();
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
                    g_webglControl.m_arrObjectSurfaceMaterial[i][j] = null;
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
                for (let j = 0; j < g_webglControl.m_arrObjectSurfaceMaterial[i].length; ++j) {
                    g_webglControl.m_arrObjectSurfaceMaterial[objectIndex][j] = null;
                }
                g_webglControl.splitMeshVAOVertexCounts(-1, -1, GL_USERDEFINE);
            } else {
                // 设置指定的曲面材质
                g_webglControl.arrPickObjectSurfaceIndexs[objectIndex][surfaceIndex] = true;
                g_webglControl.splitMeshVAOVertexCounts(objectIndex, surfaceIndex, GL_USERDEFINE);
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

        let objectMaterial = g_GLMaterialSet._arrMaterialSet[materialIndex]._MtlData;
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
            g_GLObjectSet._arrObjectSet[i].GetAnimMatrix(uStartFrame, this.animMatrix);
            mat4.multiply(g_webglControl.m_arrObjectMatrix[i], this.modelMatrix, this.animMatrix);
            // 透明度数据
            this.fTransparent = g_GLObjectSet._arrObjectSet[i].GetAnimTransparent(uStartFrame);
            g_webglControl.switchObjectTranList(i, this.fTransparent);
            g_webglControl.m_arrObjectTransparent[i] = this.fTransparent;
        }
    }

    /**
     * 设置模型中心点或者焦点，但是不更新零件实际矩阵
     */
    this.setModelCenter = function(center) {
        this.modelCenter.x = center.x, this.modelCenter.y = center.y, this.modelCenter.z = center.z;
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(-center.x, -center.y, -center.z));
    }

    /**
     * 将模型平移到中心点或者焦点，更新零件实际矩阵
     */
    this.moveModelCenter = function(center) {
        mat4.identity(this.modelMatrixTmp);
        mat4.translate(this.modelMatrixTmp, this.modelMatrixTmp, vec3.fromValues(center.x, center.y, center.z));
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(center.x, center.y, center.z));
        // 更新矩阵
        for (let i = 0; i < g_webglControl.m_arrObjectMatrix.length; i++) {
            // 矩阵数据
            mat4.multiply(g_webglControl.m_arrObjectMatrix[i], this.modelMatrixTmp, g_webglControl.m_arrObjectMatrix[i]);
        }
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

    /**
     * 材质批量处理
     */
    this.setObjectMeshMaterialUnit = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            var uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            g_webglControl.setVertexDataNum(uCurPartIndex);
            if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                var uSurfaceNum = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length;

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
                    var vaoUnit = new GL_MESH_VAO_UNIT(uSurfaceNum);
                    vaoUnit.arrVertexCounts[0] = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.length / VERTEX_DATA_COUNT;
                    vaoUnit.uintVertexNum = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.length / VERTEX_DATA_COUNT;
                    vaoUnit.uintMaterialIndex = materialIndex;
                    vaoUnit.surfaceStart = 0;
                    vaoUnit.surfaceCount = uSurfaceNum;
                    arrObjectVAOUint.push(vaoUnit);
                } else {
                    // Object有多个Surface，并且有多个材质
                    var uCurIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0];
                    var uVertexCount = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[0];
                    // 记录第一个材质VAO数据
                    arrObjectVAOUint.push(new GL_MESH_VAO_UNIT(0));
                    arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts.push(0);
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
                            uVertexCount += g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j];
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts.push(0);
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceCount++;

                            if (j == g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length-1) {
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts[0] = uVertexCount;
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintVertexNum = uVertexCount;
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex = uCurIndex;
                            }
                        } else {
                            // 存储上一段材质的VAO数据
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts[0] = uVertexCount;
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].uintVertexNum = uVertexCount;
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex = uCurIndex;
                            // 开始新一段材质VAO数据的记录
                            arrObjectVAOUint.push(new GL_MESH_VAO_UNIT(0));
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts.push(0);
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceStart = j;
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceCount = 1;

                            if (j == g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length-1) {
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts[0] =
                                    g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j];
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintVertexNum =
                                    g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j];
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex =
                                    g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                            } else {
                                uCurIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                                uVertexCount = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j];
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
                g_webglControl.m_arrObjectMeshVAOUint.push(arrObjectVAOUint);

                if (isContainsTrans && (!isContainsNotTrans)) {
                    // 全透明
                    g_webglControl.m_arrObjectTransModeOrig.push(GLTRANS_ALL);
                    g_webglControl.m_arrObjectTransMode.push(GLTRANS_ALL);
                } else if (isContainsTrans && isContainsNotTrans) {
                    // 部分透明
                    g_webglControl.m_arrObjectTransModeOrig.push(GLTRANS_PART);
                    g_webglControl.m_arrObjectTransMode.push(GLTRANS_PART);
                } else {
                    // 全不透明
                    g_webglControl.m_arrObjectTransModeOrig.push(GLTRANS_NO);
                    g_webglControl.m_arrObjectTransMode.push(GLTRANS_NO);
                }
            } else {
                // 只有线缆数据的合并材质
                var arrObjectVAOUint = new Array();
                arrObjectVAOUint.push(new GL_MESH_VAO_UNIT(0));
                arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts.push(
                    g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.length / VERTEX_DATA_COUNT);
                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0];

                g_webglControl.m_arrObjectMeshVAOUint.push(arrObjectVAOUint);
                g_webglControl.m_arrObjectTransModeOrig.push(GLTRANS_NO);
                g_webglControl.m_arrObjectTransMode.push(GLTRANS_NO);
            }
        }

        /* init vao unit flags */
        for (let i = 0; i < g_webglControl.m_arrObjectMeshVAOUint.length; ++i) {
            for (let j = 0; j < g_webglControl.m_arrObjectMeshVAOUint[i].length; ++j) {
                g_webglControl.m_arrObjectMeshVAOUint[i][j].InitFlags();
            }
        }
    }

    /**
     * 生成零件曲面的面片索引，用于拾取求
     */
    this.initSubsetIndex = function() {
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            let arrSurfaceIndex = new Array();
            let index = 0;
            for (let j = 0; j < g_GLPartSet._arrPartSet[i]._arrPartLODData[0]._arrSurfaceVertexNum.length; j++)
            {
                let surfaceIndex = new GL_Vertex_Index(index, index+g_GLPartSet._arrPartSet[i]._arrPartLODData[0]._arrSurfaceVertexNum[j]);
                arrSurfaceIndex.push(surfaceIndex);
                index += g_GLPartSet._arrPartSet[i]._arrPartLODData[0]._arrSurfaceVertexNum[j];
            }
            this.m_arrPartSurfaceIndex.push(arrSurfaceIndex);
        }
    }

    /**
     * 生成零件拾取标识数组
     */
    this.initPickIndexs = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            g_webglControl.arrPickObjectIndexs.push(false);

            let curPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            let surfaceFlags = new Array();
            let curveFlags = new Array();

            for (let j = 0; j < g_GLPartSet._arrPartSet[curPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length; ++j) {
                surfaceFlags.push(false);
            }
            g_webglControl.arrPickObjectSurfaceIndexs.push(surfaceFlags);

            if (g_GLPartSet._arrPartSet[curPartIndex]._CurveShape == null ||
                g_GLPartSet._arrPartSet[curPartIndex]._CurveShape._arrCurve == null) {
                continue;
            }

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
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            g_webglControl.arrPickObjectIndexs[i] = false;

            let curPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            for (let j = 0; j < g_GLPartSet._arrPartSet[curPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length; ++j) {
                g_webglControl.arrPickObjectSurfaceIndexs[i][j] = false;
            }

            if (g_GLPartSet._arrPartSet[curPartIndex]._CurveShape == null ||
                g_GLPartSet._arrPartSet[curPartIndex]._CurveShape._arrCurve == null) {
                continue;
            }
            for (let j = 0; j < g_GLPartSet._arrPartSet[curPartIndex]._CurveShape._arrCurve.length; ++j) {
                g_webglControl.arrPickObjectCurveIndexs[i][j] = false;
            }
        }
        g_webglControl.splitMeshVAOVertexCounts(-1, -1, GL_USERPICKED);
        g_webglControl.splitCurveVAOVertexCounts(-1, -1);
    }

    this.clearPickObjectIndexs = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            g_webglControl.arrPickObjectIndexs[i] = false;
        }
    }

    this.clearPickSurfaceIndexs = function() {
        g_webglControl.splitMeshVAOVertexCounts(-1, -1, GL_USERPICKED);
    }

    this.clearPickCurveIndexs = function() {
        g_webglControl.splitCurveVAOVertexCounts(-1, -1);
    }

    this.setBoxVertexIndexs = function() {
        // 包围盒6各面拆成12个三角形
        this.arrBoxVertexIndex.push(0); this.arrBoxVertexIndex.push(1); this.arrBoxVertexIndex.push(3);
        this.arrBoxVertexIndex.push(0); this.arrBoxVertexIndex.push(2); this.arrBoxVertexIndex.push(3);
        this.arrBoxVertexIndex.push(0); this.arrBoxVertexIndex.push(1); this.arrBoxVertexIndex.push(5);
        this.arrBoxVertexIndex.push(0); this.arrBoxVertexIndex.push(4); this.arrBoxVertexIndex.push(5);
        this.arrBoxVertexIndex.push(0); this.arrBoxVertexIndex.push(2); this.arrBoxVertexIndex.push(6);
        this.arrBoxVertexIndex.push(0); this.arrBoxVertexIndex.push(4); this.arrBoxVertexIndex.push(6);
        this.arrBoxVertexIndex.push(7); this.arrBoxVertexIndex.push(5); this.arrBoxVertexIndex.push(4);
        this.arrBoxVertexIndex.push(7); this.arrBoxVertexIndex.push(6); this.arrBoxVertexIndex.push(4);
        this.arrBoxVertexIndex.push(7); this.arrBoxVertexIndex.push(5); this.arrBoxVertexIndex.push(1);
        this.arrBoxVertexIndex.push(7); this.arrBoxVertexIndex.push(3); this.arrBoxVertexIndex.push(1);
        this.arrBoxVertexIndex.push(7); this.arrBoxVertexIndex.push(3); this.arrBoxVertexIndex.push(2);
        this.arrBoxVertexIndex.push(7); this.arrBoxVertexIndex.push(6); this.arrBoxVertexIndex.push(2);
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

    /**
     * 射线与包围盒求交
     */
    this.intersectRayBox = function(RayPoint1, RayPoint2, ObjectBox, ObjectMat) {
        this.vLinePt1.x = RayPoint1.x; this.vLinePt1.y = RayPoint1.y; this.vLinePt1.z = RayPoint1.z;
        this.vLinePt2.x = RayPoint2.x; this.vLinePt2.y = RayPoint2.y; this.vLinePt2.z = RayPoint2.z;
        for (let i = 0; i < 12; i++) {
            CalTranslatePoint(ObjectBox._Vertex[this.arrBoxVertexIndex[i * 3 + 0]].x,
                              ObjectBox._Vertex[this.arrBoxVertexIndex[i * 3 + 0]].y,
                              ObjectBox._Vertex[this.arrBoxVertexIndex[i * 3 + 0]].z, ObjectMat, this.vTriVer1);
            CalTranslatePoint(ObjectBox._Vertex[this.arrBoxVertexIndex[i * 3 + 1]].x,
                              ObjectBox._Vertex[this.arrBoxVertexIndex[i * 3 + 1]].y,
                              ObjectBox._Vertex[this.arrBoxVertexIndex[i * 3 + 1]].z, ObjectMat, this.vTriVer2);
            CalTranslatePoint(ObjectBox._Vertex[this.arrBoxVertexIndex[i * 3 + 2]].x,
                              ObjectBox._Vertex[this.arrBoxVertexIndex[i * 3 + 2]].y,
                              ObjectBox._Vertex[this.arrBoxVertexIndex[i * 3 + 2]].z, ObjectMat, this.vTriVer3);
            if (CalcIntersectOfLineSegTriangle(this.vLinePt1, this.vLinePt2, this.vTriVer1, this.vTriVer2, this.vTriVer3, this.pIntersectPt))
            {
                return true;
            }
        }
        return false;
    }

    /**
     * 射线与场景中的object的最近的交点
     * 返回：object索引、交点距离和坐标
     */
    this.intersectRayScene = function(RayPoint1, RayPoint2, pickUnitOut) {
        this.arrObjectIndex.splice(0, this.arrObjectIndex.length);
        this.arrObjSurIntersect.splice(0, this.arrObjSurIntersect.length);

        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; ++i) {
            // 若是线缆数据则不能拾取
            if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST) {
                continue;
            }
            // 若不可见则不能拾取
            if (!g_webglControl.m_arrObjectVisiable[i]) {
                continue;
            }
            if (g_webglControl.m_arrObjectTransparent[i] <= GL_ZERO) {
                continue;
            }
            
            let CurMat = g_webglControl.m_arrObjectMatrix[i];
            let intersectRet = this.intersectRayObjectSurface(RayPoint1, RayPoint2, i, CurMat);
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
                return this.intersectRayGeomtry(this.arrObjectIndex[index], this.arrObjSurIntersect[index], pickUnitOut);

            }
            return null;
        }
    }

    this.intersectRayObjectSurface = function(RayPoint1, RayPoint2, ObjectIndex, ObjectMat) {
        this.arrSubsetSurfaceIndex.splice(0, this.arrSubsetSurfaceIndex.length);
        this.arrSubsetIntersectPt.splice(0, this.arrSubsetIntersectPt.length);
        this.arrSubsetDistance.splice(0, this.arrSubsetDistance.length);
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[ObjectIndex]._uPartIndex;
        if (this.intersectRayBox(RayPoint1, RayPoint2, g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox, ObjectMat)) {
            // 计算与子集mesh的交点
            for (let j = 0; j < g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._SurfaceBoxes.length; j++) {
                if (this.intersectRayBox(RayPoint1, RayPoint2, g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._SurfaceBoxes[j], ObjectMat)) {
                    let intersetRet = this.intersectRaySurface(RayPoint1, RayPoint2, uCurPartIndex, j, ObjectMat)
                    if (intersetRet != null) {
                        this.arrSubsetDistance.push(intersetRet.dDistance);
                        this.arrSubsetIntersectPt.push(intersetRet.ptIntersect);
                        this.arrSubsetSurfaceIndex.push(j);
                    }
                }
            }
        }

        if (this.arrSubsetDistance.length == 0) {
            return null;
        } else {
            let minDistance = Infinity;
            let index = 0;
            for (let j = 0; j < this.arrSubsetDistance.length; j++) {
                if (this.arrSubsetDistance[j] < minDistance) {
                    minDistance = this.arrSubsetDistance[j];
                    index = j;
                }
            }
            return {
                uSurfaceIndex: this.arrSubsetSurfaceIndex[index],
                dDistance: minDistance,
                ptIntersect: this.arrSubsetIntersectPt[index],
            };
        }
    }

    /**
     * 射线与曲面子集的最近的交点
     * 返回：交点距离和坐标
     */
     this.intersectRaySurface = function(RayPoint1, RayPoint2, uPartIndex, uSurfaceIndex, ObjectMat) {
        this.vLinePt1.x = RayPoint1.x; this.vLinePt1.y = RayPoint1.y; this.vLinePt1.z = RayPoint1.z;
        this.vLinePt2.x = RayPoint2.x; this.vLinePt2.y = RayPoint2.y; this.vLinePt2.z = RayPoint2.z;
        this.arrMeshDistance.splice(0, this.arrMeshDistance.length);
        this.arrMeshIntersectPt.splice(0, this.arrMeshIntersectPt.length);

        g_webglControl.setVertexDataNum(uPartIndex);
        for (let i = this.m_arrPartSurfaceIndex[uPartIndex][uSurfaceIndex]._startIndex; i<this.m_arrPartSurfaceIndex[uPartIndex][uSurfaceIndex]._endIndex; i += 3) {
            CalTranslatePoint(g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[i * VERTEX_DATA_COUNT],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[i * VERTEX_DATA_COUNT + 1],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[i * VERTEX_DATA_COUNT + 2], ObjectMat, this.RealPoint1);
            CalTranslatePoint(g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 1) * VERTEX_DATA_COUNT],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 1) * VERTEX_DATA_COUNT + 1],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 1) * VERTEX_DATA_COUNT + 2], ObjectMat, this.RealPoint2);
            CalTranslatePoint(g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 2) * VERTEX_DATA_COUNT],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 2) * VERTEX_DATA_COUNT + 1],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 2) * VERTEX_DATA_COUNT + 2], ObjectMat, this.RealPoint3);
            this.vTriVer1.x = this.RealPoint1.x; this.vTriVer1.y = this.RealPoint1.y; this.vTriVer1.z = this.RealPoint1.z;
            this.vTriVer2.x = this.RealPoint2.x; this.vTriVer2.y = this.RealPoint2.y; this.vTriVer2.z = this.RealPoint2.z;
            this.vTriVer3.x = this.RealPoint3.x; this.vTriVer3.y = this.RealPoint3.y; this.vTriVer3.z = this.RealPoint3.z;
            if (CalcIntersectOfLineSegTriangle(this.vLinePt1, this.vLinePt2, this.vTriVer1, this.vTriVer2, this.vTriVer3, this.pIntersectPt)) {
                let tempDistance = CalDistanceOfPoint3d(this.pIntersectPt, this.vLinePt1);
                let tempIntersetPt = new ADF_BASEFLOAT3();
                CalInversePoint(this.pIntersectPt, ObjectMat, tempIntersetPt);
                this.arrMeshDistance.push(tempDistance);
                this.arrMeshIntersectPt.push(tempIntersetPt);
            }
        }

        // 计算最小值
        if (this.arrMeshDistance.length == 0) {
            return null;
        } else {
            let minDistance = Infinity;
            let index = 0;
            for (let i = 0; i < this.arrMeshDistance.length; i++) {
                if (this.arrMeshDistance[i] < minDistance) {
                    minDistance = this.arrMeshDistance[i];
                    index = i;
                }
            }
            return {
                dDistance: minDistance,
                ptIntersect: this.arrMeshIntersectPt[index],
            };
        }
    }

    this.intersectRayObjectCurve = function(RayPoint1, RayPoint2, ObjectIndex, ObjectMat) {
        if (!g_webglControl.isContainsGeom) {
            return null;
        }
        this.arrCurveIndex.splice(0, this.arrCurveIndex.length)
        this.arrObjectCurveDistance.splice(0, this.arrObjectCurveDistance.length);
        this.arrObjectCurveIntersectPt.splice(0, this.arrObjectCurveIntersectPt.length);
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[ObjectIndex]._uPartIndex;
        if (this.intersectRayBox(RayPoint1, RayPoint2, g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox, ObjectMat)) {
            let ptOffset = 0;
            for (let j = 0; j < g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts.length; ++j) {
                let intersetRet = this.intersectRayCurve(RayPoint1, RayPoint2, uCurPartIndex, j, ptOffset, ObjectMat);
                if (intersetRet != null) {
                    this.arrObjectCurveDistance.push(intersetRet.dDistance);
                    this.arrObjectCurveIntersectPt.push(intersetRet.ptIntersect);
                    this.arrCurveIndex.push(j);
                }
                ptOffset += g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts[j] * 3;
            }
        }
        
        if (this.arrObjectCurveDistance.length == 0) {
            return null;
        } else {
            let minDistance = Infinity;
            let index = 0;
            for (let j = 0; j < this.arrObjectCurveDistance.length; j++) {
                if (this.arrObjectCurveDistance[j] < minDistance) {
                    minDistance = this.arrObjectCurveDistance[j];
                    index = j;
                }
            }
            return {
                uCurveIndex: this.arrCurveIndex[index],
                dDistance: minDistance,
                ptIntersect: this.arrObjectCurveIntersectPt[index],
            };
        }
    }

    /**
     * 射线与曲线的最近的交点
     * 返回：交点距离和坐标
     */
    this.intersectRayCurve = function(RayPoint1, RayPoint2, uPartIndex, uCurveIndex, uCurvePointsOffset, ObjectMat) {
        this.vLinePt1.x = RayPoint1.x; this.vLinePt1.y = RayPoint1.y; this.vLinePt1.z = RayPoint1.z;
        this.vLinePt2.x = RayPoint2.x; this.vLinePt2.y = RayPoint2.y; this.vLinePt2.z = RayPoint2.z;
        this.arrCurveDistance.splice(0, this.arrCurveDistance.length);
        this.arrCurveIntersectPt.splice(0, this.arrCurveIntersectPt.length);

        let uCurPtIndex = 0;
        let tempDistance = 0;
        for (let i = 0; i < g_GLPartSet._arrPartSet[uPartIndex]._CurveShape._arrShapeOfPointsCounts[uCurveIndex] * 3; i += 6) {
            uCurPtIndex = uCurvePointsOffset + i;
            CalTranslatePoint(g_GLPartSet._arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex],
                g_GLPartSet._arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex + 1],
                g_GLPartSet._arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex + 2], ObjectMat, this.RealPoint1);
            CalTranslatePoint(g_GLPartSet._arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex + 3],
                g_GLPartSet._arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex + 4],
                g_GLPartSet._arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex + 5], ObjectMat, this.RealPoint2);
            this.vTriVer1.x = this.RealPoint1.x; this.vTriVer1.y = this.RealPoint1.y; this.vTriVer1.z = this.RealPoint1.z;
            this.vTriVer2.x = this.RealPoint2.x; this.vTriVer2.y = this.RealPoint2.y; this.vTriVer2.z = this.RealPoint2.z;
            tempDistance = CalcDistanceOfTwoLineSeg(this.vLinePt1, this.vLinePt2, this.vTriVer1, this.vTriVer2, this.pIntersectPt);
            if (ISDEQUALEX(tempDistance, 0.0, this.intersectZero)) {
                tempDistance = CalDistanceOfPoint3d(this.pIntersectPt, this.vLinePt1);
                let tempIntersetPt = new ADF_BASEFLOAT3();
                CalInversePoint(this.pIntersectPt, ObjectMat, tempIntersetPt);
                this.arrCurveDistance.push(tempDistance);
                this.arrCurveIntersectPt.push(tempIntersetPt);
            }
        }

        // 计算最小值
        if (this.arrCurveDistance.length == 0) {
            return null;
        } else {
            let minDistance = Infinity;
            let index = 0;
            for (let i = 0; i < this.arrCurveDistance.length; i++) {
                if (this.arrCurveDistance[i] < minDistance) {
                    minDistance = this.arrCurveDistance[i];
                    index = i;
                }
            }
            return {
                dDistance: minDistance,
                ptIntersect: this.arrCurveIntersectPt[index],
            };
        }
    }

    this.intersectRayGeomtry = function(ObjectIndex, ObjSurIntersect, pickUnitOut) {
        let CurMat = g_webglControl.m_arrObjectMatrix[ObjectIndex];
        let InsecPt = ObjSurIntersect.ptIntersect;
        if (this.curPickType == PICK_GEOM_SURFACE) {
            let uCurPartIndex = g_GLObjectSet._arrObjectSet[ObjectIndex]._uPartIndex;
            pickUnitOut.elementType = PICK_GEOM_SURFACE;
            pickUnitOut.geomSurfaceIndex =
                g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrGeomSurfaceIndex[ObjSurIntersect.uSurfaceIndex];
            pickUnitOut.distance = ObjSurIntersect.dDistance;
            pickUnitOut.intersectPt.set(InsecPt.x, InsecPt.y, InsecPt.z);
            return pickUnitOut;
        
        } else if (this.curPickType == PICK_GEOM_CURVE) {
            this.intersectZero = this.calIntersectZero(InsecPt, CurMat, this.intersectCurveZero);
            let intersectCurve = this.calcMinDistanceCurve(InsecPt, ObjectIndex);
            if (intersectCurve == null || intersectCurve.dDistance > this.intersectZero) {
                return null;
            }
            pickUnitOut.elementType = PICK_GEOM_CURVE;
            pickUnitOut.geomCurveIndex = intersectCurve.uCurveIndex;
            pickUnitOut.distance = CalDistanceOfPoint3d(InsecPt, intersectCurve.ptIntersect);
            pickUnitOut.intersectPt.set(intersectCurve.ptIntersect.x, intersectCurve.ptIntersect.y, intersectCurve.ptIntersect.z);
            return pickUnitOut;

        } else if (this.curPickType == PICK_GEOM_POINT) {
            this.intersectZero = this.calIntersectZero(InsecPt, CurMat, this.intersectPointZero);
            pickUnitOut.elementType = PICK_GEOM_POINT;
            let intersectPoint = this.calcMinDistancePoint(InsecPt, ObjectIndex);
            if (intersectPoint == null || intersectPoint.dDistance > this.intersectZero) {
                // 如果没有相交的几何顶点，则取与曲线的交点
                pickUnitOut.geomPointIndex = -1;
                pickUnitOut.distance = ObjSurIntersect.dDistance;
                pickUnitOut.intersectPt.set(InsecPt.x, InsecPt.y, InsecPt.z);
            } else {
                pickUnitOut.geomPointIndex = intersectPoint.uPointIndex;
                pickUnitOut.distance = CalDistanceOfPoint3d(InsecPt, intersectPoint.ptIntersect);
                pickUnitOut.intersectPt.set(intersectPoint.ptIntersect.x, intersectPoint.ptIntersect.y, intersectPoint.ptIntersect.z);
            }
            return pickUnitOut;

        }
        return null;
    }

    /**
     * 计算object上的曲线到交点的最小距离
     * 返回：曲线索引、最小距离和最小距离点
     */
    this.calcMinDistanceCurve = function(InsecPt, ObjectIndex) {
        if (!g_webglControl.isContainsGeom) {
            return null;
        }

        let uCurPartIndex = g_GLObjectSet._arrObjectSet[ObjectIndex]._uPartIndex;
        let uCurvePointsOffset = 0;
        let arrPointsCounts = g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts;
        let arrPoints = g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints;
        let intersetPtMin = new Point3(0, 0, 0);
        let distanceMin = Infinity;
        let curveIndexMin = 0;
        let tempIntersetPt = new Point3(0, 0, 0);
        let tempDistance = 0;
        
        for (let i = 0; i < arrPointsCounts.length; ++i) {
            for (let j = 0; j < arrPointsCounts[i] * 3; j += 6) {
                this.RealPoint1.set(arrPoints[uCurvePointsOffset + j], arrPoints[uCurvePointsOffset + j + 1], arrPoints[uCurvePointsOffset + j + 2]);
                this.RealPoint2.set(arrPoints[uCurvePointsOffset + j + 3], arrPoints[uCurvePointsOffset + j + 4], arrPoints[uCurvePointsOffset + j + 5]);
                tempDistance = CalcDistanceOfPtLineSeg(InsecPt, this.RealPoint1, this.RealPoint2, tempIntersetPt);
                if (tempDistance < distanceMin) {
                    distanceMin = tempDistance;
                    intersetPtMin.set(tempIntersetPt.x, tempIntersetPt.y, tempIntersetPt.z);
                    curveIndexMin = i;
                }
            }
            uCurvePointsOffset += arrPointsCounts[i] * 3;
        }

        return {
            uCurveIndex: curveIndexMin,
            dDistance: distanceMin,
            ptIntersect: intersetPtMin,
        };
    }

    /**
     * 将设备坐标的像素尺度，转化为交点处的三维空间距离尺度
     * 该距离尺度作为三维空间直线的近似相交判据
     */
    this.calIntersectZero = function(InsecPt, ObjectMat, NDCZero) {
        mat4.multiply(this.MVMatrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        mat4.multiply(this.MVPMatrix, this.MVMatrix, ObjectMat);
        CalTranslatePoint(InsecPt.x, InsecPt.y, InsecPt.z, this.MVPMatrix, this.ptNDC);

        this.ptNDCOffset.set(this.ptNDC.x + NDCZero / glRunTime.WIDTH, this.ptNDC.y + NDCZero / glRunTime.HEIGHT, this.ptNDC.z);
        mat4.invert(this.inverseMVPMatrix, this.MVPMatrix);
        CalTranslatePoint(this.ptNDCOffset.x, this.ptNDCOffset.y, this.ptNDCOffset.z, this.inverseMVPMatrix, this.ptOffset);
        return CalDistanceOfPoint3d(InsecPt, this.ptOffset);
    }

    /**
     * 计算object上的顶点到交点的最小距离
     * 返回：最小距离和顶点坐标
     */
    this.calcMinDistancePoint = function(InsecPt, ObjectIndex) {
        if (!g_webglControl.isContainsGeom) {
            return null;
        }

        let uCurPartIndex = g_GLObjectSet._arrObjectSet[ObjectIndex]._uPartIndex;
        let arrPointsCounts = g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts;
        let arrPoints = g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints;
        let intersetPtMin = new Point3(0, 0, 0);
        let distanceMin = Infinity;
        let intersetPtIndex = -1;
        let tempDistance = 0;
        let end1Index = 0;
        let end2Index = 0;
        
        for (let i = 0; i < arrPointsCounts.length; ++i) {
            // 直线和圆弧都只取首尾两端点计算
            this.RealPoint1.set(arrPoints[end1Index + 0], arrPoints[end1Index + 1], arrPoints[end1Index + 2]);
            tempDistance = CalDistanceOfPoint3d(this.RealPoint1, InsecPt);
            if (tempDistance < distanceMin) {
                distanceMin = tempDistance;
                intersetPtMin.set(this.RealPoint1.x, this.RealPoint1.y, this.RealPoint1.z);
                intersetPtIndex = i * 2;
            }

            end2Index += arrPointsCounts[i] * 3;
            this.RealPoint2.set(arrPoints[end2Index - 3], arrPoints[end2Index - 2], arrPoints[end2Index - 1]);
            tempDistance = CalDistanceOfPoint3d(this.RealPoint2, InsecPt);
            if (tempDistance < distanceMin) {
                distanceMin = tempDistance;
                intersetPtMin.set(this.RealPoint2.x, this.RealPoint2.y, this.RealPoint2.z);
                intersetPtIndex = i * 2 + 1;
            }

            end1Index = end2Index;
        }

        return {
            dDistance: distanceMin,
            ptIntersect: intersetPtMin,
            uPointIndex: intersetPtIndex,
        };
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
        let slideCount = 0;
        if (part._uIsUV) {
            slideCount = VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
        } else {
            slideCount = NUM_VERTEX + NUM_VECTOR;
        }

        let tmpPt = new Point3(0, 0, 0);
        for (let i = 0; i < surfaceVertexCount; ++i) {
            let vertexIndex = (surfaceStartIndex + i) * slideCount;
            CalTranslatePoint(part._arrVertex[vertexIndex], part._arrVertex[vertexIndex + 1], part._arrVertex[vertexIndex + 2],
                mvpMat, tmpPt);
            if (!rect2D.isPointInside(tmpPt)) {
                return false;
            }
        }
        return true;
    }

    this.isObjBoxInRect = function(objBox, mvpMat, rect2D) {
        let tmpPt = new Point3(0, 0, 0);
        let insideCount = 0;
        for (let i = 0; i < objBox._Vertex.length; ++i) {
            CalTranslatePoint(objBox._Vertex[i].x, objBox._Vertex[i].y, objBox._Vertex[i].z,
                mvpMat, tmpPt);
            if (rect2D.isPointInside(tmpPt)) {
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
}