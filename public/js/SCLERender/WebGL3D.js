// File: WebGL.js

/**
 * @author wujiali
 */
 
//===================================================================================================

const NUM_VERTEX = 3;
const NUM_VECTOR = 3;
const NUM_UV = 2;
const BOX_LINEVERTEX_COUNT = 48;
const BOX_DATA_COUNT = BOX_LINEVERTEX_COUNT * NUM_VERTEX;
const BG_VERTEX = new GL_FarPlane();
const GL_ZERO = 0.00001;

var VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
var STRIDE = (NUM_VERTEX + NUM_VECTOR + NUM_UV) * 4;

var SOLIDPROGRAMINFO = null;
var PICTUREPROGRAMINFO = null;
var LINEPROGRAMINFO = null;

function WebGLControl() {
    // 显示控制开关
    this.isBackground = false;
    this.isSolid = false;
    this.isPicked = false;
    this.isShowBox = true;
    this.isHighlight = true;
    this.isHighlightObject = true;
    this.isHighlightSurface = true;
    this.isHighlightCurve = true;
    // GPU缓存数据
    this.m_arrObjectSurface_VAOs = new Array();
    this.m_arrObjectSurface_VBOs = new Array();
    this.m_arrObjectBox_VAOs = new Array();
    this.m_arrObjectBox_VBOs = new Array();
    this.m_bgIndex = 0;
    this.m_arrBgTexId = null;
    this.m_uBgVAO = -1;
    this.m_uBgVBO = -1;
    // 辅助显示数据，合并材质所需数据
    this.m_arrObjectMeshVAOUint = new Array();
    // 拾取所需显示数据
    this.m_arrBoxLines = new Array(BOX_DATA_COUNT);
    this.arrPickObjectIndexs = new Array();         // bool值，标志object是否被选中
    this.arrPickObjectSurfaceIndexs = new Array();  // bool值，标志object及其surface是否被选中
    this.eMaterialPriority = GL_ORIGINAL;
    this.GL_PICKSTATUS = 0;
    // 用户交互所需数据：变换矩阵/透明度/显隐/材质设置
    this.m_arrObjectTransMode = new Array();
    this.m_arrObjectTransModeOrig = new Array();
    this.m_arrObjectMatrix = new Array();
    this.m_arrObjectTransparent = new Array();       // float值，标志object透明度
    this.m_arrObjectSurfaceTransparent = new Array();// float值，标志object及其surface是否被设置透明度
    this.m_arrObjectVisiable = new Array();          // bool值，标志object是否隐藏
    this.m_arrObjectSurfaceVisiable = new Array();   // bool值，标志object及其surface是否被设置隐藏
    this.m_arrObjectMaterial = new Array();          // 材质对象，标志object被设置材质
    this.m_arrObjectSurfaceMaterial = new Array();     // 材质对象，标志object及其surface被设置材质
    // 默认配置
    this.defaultMaterial = g_materialData.Default;
    this.defaultRed = g_materialData.Red;
    // 精确数据标志
    this.isContainsGeom = false;
    this.isShowGeomtry = false;
    this.isSplitCurve = false;
    this.m_arrPartGeomSurface_VAOs = new Array();
    this.m_arrPartGeomSurface_VBOs = new Array();
    this.m_arrPartGeomCurve_VAOs = new Array();
    this.m_arrPartGeomCurve_VBOs = new Array();
    this.m_arrObjectSurfaceVAOUnit = new Array();
    this.m_arrObjectCurveVAOUnit = new Array();
    this.arrPickObjectCurveIndexs = new Array();    // bool值，标志object及其curve是否被选中

    this.clearParams = function() {
        this.m_arrObjectSurface_VAOs.splice(0, this.m_arrObjectSurface_VAOs.length);
        this.m_arrObjectSurface_VBOs.splice(0, this.m_arrObjectSurface_VBOs.length);
        this.m_arrObjectBox_VAOs.splice(0, this.m_arrObjectBox_VAOs.length);
        this.m_arrObjectBox_VBOs.splice(0, this.m_arrObjectBox_VBOs.length);
        this.m_arrPartGeomSurface_VAOs.splice(0, this.m_arrPartGeomSurface_VAOs.length);
        this.m_arrPartGeomSurface_VBOs.splice(0, this.m_arrPartGeomSurface_VBOs.length);
        this.m_arrPartGeomCurve_VAOs.splice(0, this.m_arrPartGeomCurve_VAOs.length);
        this.m_arrPartGeomCurve_VBOs.splice(0, this.m_arrPartGeomCurve_VBOs.length);

        this.m_arrBoxLines.splice(0, this.m_arrBoxLines.length);
        this.arrPickObjectIndexs.splice(0, this.arrPickObjectIndexs.length);
        this.arrPickObjectSurfaceIndexs.splice(0, this.arrPickObjectSurfaceIndexs.length);
        this.arrPickObjectCurveIndexs.splice(0, this.arrPickObjectCurveIndexs.length);

        this.m_arrObjectTransMode.splice(0, this.m_arrObjectTransMode.length);
        this.m_arrObjectTransModeOrig.splice(0, this.m_arrObjectTransModeOrig.length);
        this.m_arrObjectMatrix.splice(0, this.m_arrObjectMatrix.length);
        this.m_arrObjectTransparent.splice(0, this.m_arrObjectTransparent.length);
        this.m_arrObjectVisiable.splice(0, this.m_arrObjectVisiable.length);
        this.m_arrObjectMaterial.splice(0, this.m_arrObjectMaterial.length);

        for (let i = 0; i < this.m_arrObjectSurfaceMaterial.length; ++i) {
            this.m_arrObjectSurfaceMaterial[i].splice(0, this.m_arrObjectSurfaceMaterial[i].length);
        }
        this.m_arrObjectSurfaceMaterial.splice(0, this.m_arrObjectSurfaceMaterial.length);

        this.ClearUnits();
        this.isContainsGeom = false;
    }

    this.ClearUnits = function() {
        for (let i = 0; i < this.m_arrObjectMeshVAOUint.length; ++i) {
            for (let j = 0; j < this.m_arrObjectMeshVAOUint[i].length; ++j) {
                this.m_arrObjectMeshVAOUint[i][j].Clear();
            }
            this.m_arrObjectMeshVAOUint[i].splice(0, this.m_arrObjectMeshVAOUint[i].length);
        }
        this.m_arrObjectMeshVAOUint.splice(0, this.m_arrObjectMeshVAOUint.length);

        if (this.isContainsGeom) {
            for (let i = 0; i < this.m_arrObjectCurveVAOUnit.length; ++i) {
                if (this.m_arrObjectCurveVAOUnit[i] != null) {
                    this.m_arrObjectCurveVAOUnit[i].Clear();
                }
            }
            this.m_arrObjectCurveVAOUnit.splice(0, this.m_arrObjectCurveVAOUnit.length);
    
            this.m_arrObjectSurfaceVAOUnit.splice(0, this.m_arrObjectSurfaceVAOUnit.length);
        }
    }

    this.GetOriginMaterial = function(objectIndex, vaoIndex) {
        let materialIndex = this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].uintMaterialIndex;
        if (materialIndex == -1) {
            return this.defaultMaterial;
        } else {
            return g_GLMaterialSet._arrMaterialSet[materialIndex];
        }
    }

    this.GetUsrDefinedMaterial = function(objectIndex, vaoIndex, splitIndex) {
        let surfaceIndex = this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags[splitIndex].fromIndex;
        if (this.m_arrObjectMaterial[objectIndex] == null) {
            return this.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex] == null ?
                this.defaultMaterial : this.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex];
        }
        else {
            return this.m_arrObjectMaterial[objectIndex];
        }
    }

    this.GetUsrPickedMaterial = function(objectIndex, vaoIndex, splitIndex) {
        let objectMaterial = null;
        if (this.isHighlightObject) {
            // 允许高亮显示零件
            objectMaterial = this.defaultRed;
        } else {
            // 不允许高亮显示零件
            objectMaterial = this.GetOriginMaterial(objectIndex, vaoIndex);
        }

        if (!this.isHighlightSurface) {
            // 不允许高亮曲面
            return objectMaterial;
        }

        if (this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags != null &&
            this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags.length >= 1 &&
            this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags[splitIndex].flag == GL_USERPICKED) {
            return g_materialData.Red;
        } else {
            return objectMaterial;
        }
    }

    this.GetObjectShowMaterial = function(objectIndex, vaoIndex, splitIndex) {
        if (!this.isHighlight) {
            // 不允许高亮显示，则显示原色或用户定义材质
            return this.GetUsrDefinedMaterial(objectIndex, vaoIndex, splitIndex);
        } else {
            // 允许高亮显示，则根据显示优先级做判断
            let surfaceIndex = this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags[splitIndex].fromIndex;
            if ((this.arrPickObjectIndexs[objectIndex] && this.m_arrObjectMaterial[objectIndex] != null) ||
                (this.arrPickObjectSurfaceIndexs[objectIndex][surfaceIndex] && this.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex] != null)) {
                switch (this.eMaterialPriority) {
                    case GL_USERPICKED:
                        return this.GetUsrPickedMaterial(objectIndex, vaoIndex, splitIndex);
                    case GL_ORIGINAL:
                        return this.GetOriginMaterial(objectIndex, vaoIndex);
                    case GL_USERDEFINE:
                        return this.GetUsrDefinedMaterial(objectIndex, vaoIndex, splitIndex);
                }
            } else if (this.arrPickObjectIndexs[objectIndex] || this.arrPickObjectSurfaceIndexs[objectIndex][surfaceIndex]) {
                return this.GetUsrPickedMaterial(objectIndex, vaoIndex, splitIndex);
            } else if (this.m_arrObjectMaterial[objectIndex] != null || this.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex] != null) {
                return this.GetUsrDefinedMaterial(objectIndex, vaoIndex, splitIndex);
            } else {
                return this.GetOriginMaterial(objectIndex, vaoIndex)
            }
        }
    }

    this.setShaderMaterial = function(curMaterial, objectTrans) {
        gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialDiffuse,
            curMaterial._MtlData._mtlPhysics.vDiffuse.x,
            curMaterial._MtlData._mtlPhysics.vDiffuse.y,
            curMaterial._MtlData._mtlPhysics.vDiffuse.z,
            curMaterial._MtlData._mtlPhysics.vDiffuse.w);
        gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialAmbient,
            curMaterial._MtlData._mtlPhysics.vAmbient.x,
            curMaterial._MtlData._mtlPhysics.vAmbient.y,
            curMaterial._MtlData._mtlPhysics.vAmbient.z,
            curMaterial._MtlData._mtlPhysics.vAmbient.w);
        gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialSpecular,
            curMaterial._MtlData._mtlPhysics.vSpecular.x,
            curMaterial._MtlData._mtlPhysics.vSpecular.y,
            curMaterial._MtlData._mtlPhysics.vSpecular.z,
            curMaterial._MtlData._mtlPhysics.vSpecular.w);
        gl.uniform1f(SOLIDPROGRAMINFO.uniformLocations.power, curMaterial._MtlData._mtlPhysics.fPower);
        gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialEmissive,
            curMaterial._MtlData._mtlPhysics.vEmissive.x,
            curMaterial._MtlData._mtlPhysics.vEmissive.y,
            curMaterial._MtlData._mtlPhysics.vEmissive.z,
            curMaterial._MtlData._mtlPhysics.vEmissive.w * objectTrans);
        if (curMaterial._MtlData._eMtlType == ADFMTLTYPE_PHYSICS) {
            // 自然材质
            gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 0);
        } else if (curMaterial._MtlData._eMtlType == ADFMTLTYPE_PICTURE) {
            if (curMaterial._MtlData._arrTexID[0] instanceof WebGLTexture) {
                // 贴图材质
                gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 1);
                // 设置贴图
                gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.textureUnit, 0);
                gl.bindTexture(gl.TEXTURE_2D, curMaterial._MtlData._arrTexID[0]);
            } else {
                gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 0);
            }
        } else {
            // 纯色材质
            gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 2);
            // 设置纯色
            if (curMaterial._MtlData._arrData.length > 0) {
                gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.pureColor, 
                    curMaterial._MtlData._arrData[0].x,
                    curMaterial._MtlData._arrData[0].y,
                    curMaterial._MtlData._arrData[0].z,
                    curMaterial._MtlData._arrData[0].w * objectTrans);
            }
        }
    }

    this.GetEqualFlags = function(uPartIndex, uObjectIndex, arrPartUsedFlag) {
        let uBeforeObjectIndex = -1;
        let isEqualToBefore = false;
        if (arrPartUsedFlag[uPartIndex].length > 0) {
            for (let j=0; j<arrPartUsedFlag[uPartIndex].length; j++) {
                uBeforeObjectIndex = arrPartUsedFlag[uPartIndex][j];
                // 判断俩Object是否完全相同
                if (this.m_arrObjectMeshVAOUint[uObjectIndex].length == this.m_arrObjectMeshVAOUint[uBeforeObjectIndex].length) {
                    let k = 0;
                    for (; k<this.m_arrObjectMeshVAOUint[uObjectIndex].length; k++) {
                        if (this.m_arrObjectMeshVAOUint[uObjectIndex][k].arrVertexCounts.length !=
                            this.m_arrObjectMeshVAOUint[uBeforeObjectIndex][k].arrVertexCounts.length) {
                            break;
                        }
                    }
                    if (k == this.m_arrObjectMeshVAOUint[uObjectIndex].length) {
                        isEqualToBefore = true;
                        break;
                    }   
                }
            }
            if (!isEqualToBefore) {
                arrPartUsedFlag[uPartIndex].push(uObjectIndex);
            }
        } else {
            arrPartUsedFlag[uPartIndex].push(uObjectIndex);
        }

        return {
            EqualBeforeIndex: uBeforeObjectIndex,
            EqualBeforeFlag: isEqualToBefore,
        };
    }

    /**
     * 零件透明度变换
     */
     this.switchObjectTranList = function(nObjectIndex, fTransparent) {
        if (fTransparent < 1.0 && this.m_arrObjectTransMode[nObjectIndex] != GLTRANS_ALL) {
            // Object从非完全透明变为完全透明
            this.m_arrObjectTransMode[nObjectIndex] = GLTRANS_ALL;
        } else if (fTransparent < 1.0 && this.m_arrObjectTransMode[nObjectIndex] == GLTRANS_ALL) {
            // Object保持完全透明状态
        } else {
            // Object恢复原始状态
            this.m_arrObjectTransMode[nObjectIndex] = this.m_arrObjectTransModeOrig[nObjectIndex];
        }
    }

    /**
     * 生成包围盒数据
     */
     this.addBoxLines = function(nIndex, ver1, ver2, nCurt)
     {
         // 起点
         this.m_arrBoxLines[nIndex * 6 + 0] = ver1.x;
         this.m_arrBoxLines[nIndex * 6 + 1] = ver1.y;
         this.m_arrBoxLines[nIndex * 6 + 2] = ver1.z;
         // 终点
         this.m_arrBoxLines[nIndex * 6 + 3] = (ver1.x + (ver2.x - ver1.x) / nCurt);
         this.m_arrBoxLines[nIndex * 6 + 4] = (ver1.y + (ver2.y - ver1.y) / nCurt);
         this.m_arrBoxLines[nIndex * 6 + 5] = (ver1.z + (ver2.z - ver1.z) / nCurt);
     }
 
     this.setBoxLines = function(nPartIndex) {
         if (nPartIndex == -1) {
             // 选中整个模型，不高亮，但是绘制模型包围盒
             return;
         }
         // 从8个顶点出发，每个顶点绘制3条包络线，长度为对应边长的1/4，颜色为黄色
         let nCurt = 3;
         let curBox = g_GLPartSet._arrPartSet[nPartIndex]._arrPartLODData[0]._boxset._ObjectBox;
         // 端点0，0-1，0-2，0-4
         this.addBoxLines(0, curBox._Vertex[0], curBox._Vertex[1], nCurt);
         this.addBoxLines(1, curBox._Vertex[0], curBox._Vertex[2], nCurt);
         this.addBoxLines(2, curBox._Vertex[0], curBox._Vertex[4], nCurt);
         // 端点1，1-0，1-3，1-5
         this.addBoxLines(3, curBox._Vertex[1], curBox._Vertex[0], nCurt);
         this.addBoxLines(4, curBox._Vertex[1], curBox._Vertex[3], nCurt);
         this.addBoxLines(5, curBox._Vertex[1], curBox._Vertex[5], nCurt);
         // 端点2，2-0，2-3，2-6
         this.addBoxLines(6, curBox._Vertex[2], curBox._Vertex[0], nCurt);
         this.addBoxLines(7, curBox._Vertex[2], curBox._Vertex[3], nCurt);
         this.addBoxLines(8, curBox._Vertex[2], curBox._Vertex[6], nCurt);
         // 端点3，3-1，3-2，3-7
         this.addBoxLines(9, curBox._Vertex[3], curBox._Vertex[1], nCurt);
         this.addBoxLines(10, curBox._Vertex[3], curBox._Vertex[2], nCurt);
         this.addBoxLines(11, curBox._Vertex[3], curBox._Vertex[7], nCurt);
         // 端点4，4-0，4-5，4-6
         this.addBoxLines(12, curBox._Vertex[4], curBox._Vertex[0], nCurt);
         this.addBoxLines(13, curBox._Vertex[4], curBox._Vertex[5], nCurt);
         this.addBoxLines(14, curBox._Vertex[4], curBox._Vertex[6], nCurt);
         // 端点5，5-1，5-4，5-7
         this.addBoxLines(15, curBox._Vertex[5], curBox._Vertex[1], nCurt);
         this.addBoxLines(16, curBox._Vertex[5], curBox._Vertex[4], nCurt);
         this.addBoxLines(17, curBox._Vertex[5], curBox._Vertex[7], nCurt);
         // 端点6，6-2，6-4，6-7
         this.addBoxLines(18, curBox._Vertex[6], curBox._Vertex[2], nCurt);
         this.addBoxLines(19, curBox._Vertex[6], curBox._Vertex[4], nCurt);
         this.addBoxLines(20, curBox._Vertex[6], curBox._Vertex[7], nCurt);
         // 端点7，7-3，7-5，7-6
         this.addBoxLines(21, curBox._Vertex[7], curBox._Vertex[3], nCurt);
         this.addBoxLines(22, curBox._Vertex[7], curBox._Vertex[5], nCurt);
         this.addBoxLines(23, curBox._Vertex[7], curBox._Vertex[6], nCurt);
     }

     /**
     * 判断有无UV信息
     * 内部调用
     */
    this.setVertexDataNum = function(uPartIndex) {
        if (g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
            VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
        } else {
            VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR;
        }
    }
    this.setVertexStride = function(uPartIndex) {
        if (g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
            STRIDE = (NUM_VERTEX + NUM_VECTOR + NUM_UV) * 4;
        } else {
            STRIDE = (NUM_VERTEX + NUM_VECTOR) * 4;
        }
    }

    /**
     * 曲面面片数据被选中或者被设置材质、透明度后，VAO或VBO将被分割
     */
    this.splitMeshSurfaceCounts = function(objectIndex, curFlagUnit, flagType) {
        let fromIndex = curFlagUnit.fromIndex;
        let toIndex = curFlagUnit.toIndex;
        let newSplitFlags = new Array();
        let prePicked = false;
        if (this.arrPickObjectSurfaceIndexs[objectIndex][fromIndex]) {
            prePicked = true;
        }

        let tmpFlagUnit = curFlagUnit.copy();
        if (toIndex - fromIndex == 1) {
            tmpFlagUnit.setFlag(flagType);
        } else {
            for (let s = fromIndex + 1; s < toIndex; ++s) {
                if (this.arrPickObjectSurfaceIndexs[objectIndex][s] != prePicked) {
                    if (prePicked) {
                        tmpFlagUnit.setFlag(flagType);
                    }
                    tmpFlagUnit.toIndex = s;
                    newSplitFlags.push(tmpFlagUnit);
                    tmpFlagUnit = curFlagUnit.copy();
                    tmpFlagUnit.fromIndex = s;
                }
                prePicked = this.arrPickObjectSurfaceIndexs[objectIndex][s];
            }
            if (prePicked) {
                tmpFlagUnit.setFlag(flagType);
            }
        }
        newSplitFlags.push(tmpFlagUnit);
        return newSplitFlags;
    }
    this.splitMeshVAOVertexCounts = function(objectIndex, surfaceIndex, flagType) {
        if (objectIndex < 0) {
            // 恢复初始状态
            for (let i = 0; i < this.m_arrObjectMeshVAOUint.length; ++i) {
                for (let j = 0; j < this.m_arrObjectMeshVAOUint[i].length; ++j) {
                    this.m_arrObjectMeshVAOUint[i][j].Reset(flagType);
                }
            }
            return;
        }

        let vaoIndex = -1;
        for (let j = 0; j < this.m_arrObjectMeshVAOUint[objectIndex].length; ++j) {
            // 找到被分割的VAO
            if (this.m_arrObjectMeshVAOUint[objectIndex][j].isSurfaceInside(surfaceIndex)) {
                vaoIndex = j;
                break;
            }
        }
        if (vaoIndex < 0) {
            return;
        }

        // 找到被分割的vao flag
        let flagIndex = -1;
        for (let f = 0; f < this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags.length; ++f) {
            if (this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags[f].isSurfaceInside(surfaceIndex)) {
                flagIndex = f;
                break;
            }
        }
        if (flagIndex < 0) {
            return;
        }

        let curFlagUnit = this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags[flagIndex];
        let splitFlagUnits = this.splitMeshSurfaceCounts(objectIndex, curFlagUnit, flagType);

        let curVAOSplitFlags = new Array();
        for (let i = 0; i < flagIndex; ++i) {
            curVAOSplitFlags.push(this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags[i].copy());
        }
        for (let i = 0; i < splitFlagUnits.length; ++i) {
            curVAOSplitFlags.push(splitFlagUnits[i].copy());
        }
        for (let i = flagIndex + 1; i < this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags.length; ++i) {
            curVAOSplitFlags.push(this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags[i].copy());
        }
        this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags.splice(0, this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags.length);
        this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags = curVAOSplitFlags;
        this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitSize = curVAOSplitFlags.length;

        let uPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        for (let s = 0; s < curVAOSplitFlags.length; ++s) {
            this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].arrVertexCounts[s] =
                g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0].GetSurfaceVertexSum(curVAOSplitFlags[s].fromIndex, curVAOSplitFlags[s].toIndex);
        }
    }

    /**
     * 曲线被选中后，VAO或VBO将被分割
     */
    this.GetObjectCurvePickFlag = function(objectIndex, curveIndex) {
        return this.arrPickObjectCurveIndexs[objectIndex][curveIndex] == true ? GL_USERPICKED : GL_ORIGINAL;
    }

    this.splitCurveVAOVertexCounts = function(objectIndex, curveIndex) {
        if (!this.isContainsGeom || !this.isSplitCurve) {
            return;
        }
        if (objectIndex < 0 || curveIndex < 0) {
            // 恢复初始状态
            for (let i = 0; i < this.m_arrObjectCurveVAOUnit.length; ++i) {
                this.m_arrObjectCurveVAOUnit[i].Reset();
            }
            return;
        }

        let uPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        let arrSplitFlags = new Array();
        arrSplitFlags.push(new GL_VAO_FLAG());
        arrSplitFlags[arrSplitFlags.length - 1].flag = this.GetObjectCurvePickFlag(objectIndex, 0);
        arrSplitFlags[arrSplitFlags.length - 1].fromIndex = 0;
        arrSplitFlags[arrSplitFlags.length - 1].toIndex = 0;
        for (let s = 1; s < this.m_arrObjectCurveVAOUnit[objectIndex].arrVertexCounts.length; ++s) {
            if (this.GetObjectCurvePickFlag(objectIndex, s) != arrSplitFlags[arrSplitFlags.length - 1].flag) {
                arrSplitFlags[arrSplitFlags.length - 1].toIndex = s;
                arrSplitFlags.push(new GL_VAO_FLAG());
                arrSplitFlags[arrSplitFlags.length - 1].flag = this.GetObjectCurvePickFlag(objectIndex, s);
                arrSplitFlags[arrSplitFlags.length - 1].fromIndex = s;
                arrSplitFlags[arrSplitFlags.length - 1].toIndex = 0;
            }
        }
        arrSplitFlags[arrSplitFlags.length - 1].toIndex = this.m_arrObjectCurveVAOUnit[objectIndex].arrVertexCounts.length;

        if (arrSplitFlags.length > 0) {
            for (let s = 0; s < arrSplitFlags.length; ++s) {
                this.m_arrObjectCurveVAOUnit[objectIndex].arrVertexCounts[s] =
                    g_GLPartSet._arrPartSet[uPartIndex]._CurveShape.GetCurveVertexSum(arrSplitFlags[s].fromIndex, arrSplitFlags[s].toIndex);
            }
            this.m_arrObjectCurveVAOUnit[objectIndex].splitSize = arrSplitFlags.length;
            this.m_arrObjectCurveVAOUnit[objectIndex].splitFlags = arrSplitFlags;
        }
    }
}


function WebGL1() {
    SOLIDPROGRAMINFO = initSolidProgramInfo(gl);
    PICTUREPROGRAMINFO = initPictureProgramInfo(gl);
    LINEPROGRAMINFO = initLineProgramInfo(gl);

    this.PVMattrix = mat4.create();
    this.MVPMatrix = mat4.create();

    this.initScene = function() {
        this.setBgVBO_webgl1();
        this.setBoxVBO_webgl1();
        this.setVertexVBO_webgl1();
        this.initGLConfig();
        if (g_webglControl.isContainsGeom) {
            this.setGeomSurfaceVBO_webgl1();
            this.setGeomCurveVBO_webgl1();
        }
    }

    this.uninitScene = function() {
        this.clearVertexVBO_webgl1();
        this.clearBgVBO_webgl1();
        this.clearBoxVBO_webgl1();
        this.clearTextures();
        if (g_webglControl.isContainsGeom) {
            this.clearGeomSurfaceVBO_webgl1();
            this.clearGeomCurveVBO_webgl1();
        }
    }

    this.resetScene = function() {
        this.setBoxVBO_webgl1();
        this.setVertexVBO_webgl1();
        if (g_webglControl.isContainsGeom) {
            this.setGeomSurfaceVBO_webgl1();
            this.setGeomCurveVBO_webgl1();
        }
    }

    this.clearScene = function() {
        this.clearVertexVBO_webgl1();
        this.clearBoxVBO_webgl1();
        this.clearTextures();
        if (g_webglControl.isContainsGeom) {
            this.clearGeomSurfaceVBO_webgl1();
            this.clearGeomCurveVBO_webgl1();
        }
    }

    /**
     * 初始化窗口视图，窗口变化后调用
     */
     this.initViewPort = function(width, height) {
        gl.viewport(0, 0, width, height);
    }

    /**
     * 设置WebGL参数
     */
     this.initGLConfig = function() {
        // 开启背面剔除
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        // 开启深度测试
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        // 启用混色
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    /**
     * 绘制图形
     */
    this.draw = function(camera) {
        // Clear the canvas before we start drawing on it.
        gl.clearColor(0.313, 0.357, 0.467, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 绘制背景图片
        gl.useProgram(PICTUREPROGRAMINFO.program);
        this.drawBackground_webgl1();

        gl.useProgram(SOLIDPROGRAMINFO.program);
        mat4.multiply(this.PVMattrix, camera.projectionMatrix, camera.viewMatrix);
        this.drawObjectArray_webgl1(camera);
        
        // 绘制零件实例包围盒
        gl.useProgram(LINEPROGRAMINFO.program);
        if (g_webglControl.isPicked && g_webglControl.isShowBox) {
            this.drawBox_webgl1();
        }

        // 绘制精确几何数据
        if (g_webglControl.isContainsGeom) {
            gl.useProgram(LINEPROGRAMINFO.program);
            this.drawObjectGeomArray_webgl1();
        }
    }

    this.drawObjectArray_webgl1 = function(camera) {
        gl.uniform3f(SOLIDPROGRAMINFO.uniformLocations.eyeLocation, camera.eye.x, camera.eye.y, camera.eye.z);
        // 绘制全不透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_NO) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
        // 绘制部分透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_PART) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
        // 绘制全透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_ALL) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
    }

    this.drawObjectTriangles_webgl1 = function(objectIndex) {
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        // 获取Object透明度
        let objectTrans = g_webglControl.m_arrObjectTransparent[objectIndex];
        if (objectTrans <= GL_ZERO) {
            return;
        }
        gl.useProgram(SOLIDPROGRAMINFO.program);
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        g_webglControl.setVertexStride(uCurPartIndex);
        // 正向面定义模式
        if (g_GLObjectSet._arrObjectSet[objectIndex]._nCullMode == ADFCULL_NONE) {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
        }
        // 同一个object矩阵相同
        mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        // 同一个Object的不同Surface材质不同
        for (let j = 0; j < g_webglControl.m_arrObjectSurface_VBOs[objectIndex].length; j++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrObjectSurface_VBOs[objectIndex][j]);
            gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, STRIDE, 0);
            gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexPosition);
            gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexVector, NUM_VECTOR, gl.FLOAT, false, STRIDE, NUM_VERTEX*4);
            gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexVector);
            if (g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._uIsUV == 1) {
                gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexUV, NUM_UV, gl.FLOAT, false, STRIDE, (NUM_VERTEX+NUM_VECTOR)*4);
                gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexUV);
            } else {
                gl.disableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexUV);
            }
            let offset = 0;
            for (let s = 0; s < g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].splitSize; ++s) {
                // 材质数据
                let curMaterial = g_webglControl.GetObjectShowMaterial(objectIndex, j, s);
                g_webglControl.setShaderMaterial(curMaterial, objectTrans);
                gl.drawArrays(gl.TRIANGLES, offset, g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].arrVertexCounts[s]);
                offset += g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].arrVertexCounts[s];
            }
        }
    }

    this.drawObjectLines_webgl1 = function(objectIndex) {
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(LINEPROGRAMINFO.program);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        let materialIndex = g_webglControl.m_arrObjectMeshVAOUint[objectIndex][0].uintMaterialIndex;
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        g_webglControl.setVertexStride(uCurPartIndex);
        let curMaterial = null;
        if (materialIndex == -1) {
            curMaterial = this.defaultMaterial;
        } else {
            curMaterial = g_GLMaterialSet._arrMaterialSet[materialIndex];
        }
        gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor,
                    curMaterial._MtlData._mtlPhysics.vEmissive.x,
                    curMaterial._MtlData._mtlPhysics.vEmissive.y,
                    curMaterial._MtlData._mtlPhysics.vEmissive.z);
        gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrObjectSurface_VBOs[objectIndex][0]);
        gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, STRIDE, 0);
        gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
        gl.drawArrays(gl.LINES, 0, g_webglControl.m_arrObjectMeshVAOUint[objectIndex][0].uintVertexNum);
    }

    this.drawBox_webgl1 = function() {
        for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[i]);
                gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
                gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 1.0, 1.0, 0.0);
                let nPickPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrObjectBox_VBOs[nPickPartIndex]);
                gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, NUM_VERTEX*4, 0);
                gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
                gl.drawArrays(gl.LINES, 0, BOX_LINEVERTEX_COUNT);
            }
        }
    }

    this.drawBackground_webgl1 = function() {
        if (g_webglControl.m_arrBgTexId != null) {
            if (g_webglControl.m_arrBgTexId[g_webglControl.m_bgIndex] instanceof WebGLTexture) {
                gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_uBgVBO);
                gl.vertexAttribPointer(PICTUREPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, (NUM_VERTEX + NUM_UV) * 4, 0);
                gl.enableVertexAttribArray(PICTUREPROGRAMINFO.attribLocations.vertexPosition);
                gl.vertexAttribPointer(PICTUREPROGRAMINFO.attribLocations.vertexUV, NUM_UV, gl.FLOAT, false, (NUM_VERTEX + NUM_UV) * 4, NUM_VERTEX*4);
                gl.enableVertexAttribArray(PICTUREPROGRAMINFO.attribLocations.vertexUV);
                gl.uniform1i(PICTUREPROGRAMINFO.textureUnit, 0);
                gl.bindTexture(gl.TEXTURE_2D, g_webglControl.m_arrBgTexId[g_webglControl.m_bgIndex]);
                gl.drawArrays(gl.TRIANGLES, 0, BG_VERTEX.count);
            }
        }
    }

    /**
     * 绘制精确几何数据
     */
     this.drawObjectGeomArray_webgl1 = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            this.drawObjectGeom_webgl1(i);
        }
    }

    this.drawObjectGeom_webgl1 = function(objectIndex) {
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        // 获取Object透明度
        let objectTrans = g_webglControl.m_arrObjectTransparent[objectIndex];
        if (objectTrans <= GL_ZERO) {
            return;
        }

        let nPickPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        if (g_webglControl.m_arrPartGeomCurve_VAOs[nPickPartIndex] == -1) {
            return;
        }

        mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrPartGeomCurve_VBOs[nPickPartIndex]);
        gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, NUM_VERTEX*4, 0);
        gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);

        let offset = 0;
        for (let s = 0; s < g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].splitSize; ++s) {
            if (g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].splitFlags != null &&
                g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].splitFlags.length > s &&
                g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].splitFlags[s].flag == GL_USERPICKED) {
                gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 1.0, 0.0, 0.0);
            } else {
                gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 0.0, 0.0, 0.0);
            }
            gl.drawArrays(gl.LINES, offset, g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].arrVertexCounts[s]);
            offset += g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].arrVertexCounts[s];
        }
    }

    this.setBgVBO_webgl1 = function() {
        // 创建背景图片VAO缓存
        g_webglControl.m_uBgVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_uBgVBO);
        gl.bufferData(gl.ARRAY_BUFFER, 6 * (NUM_VERTEX + NUM_UV) * 4, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(BG_VERTEX.vertex), 0, 6 * (NUM_VERTEX + NUM_UV));
    }

    this.clearBgVBO_webgl1 = function() {
        if (g_webglControl.m_uBgVBO != -1) {
            gl.deleteBuffer(g_webglControl.m_uBgVBO);
        }
        // 清除背景图片缓存数据
        if (g_webglControl.m_arrBgTexId != null) {
            for (let i = 0; i < g_webglControl.m_arrBgTexId.length; i++) {
                if (g_webglControl.m_arrBgTexId[i] instanceof WebGLTexture) {
                    gl.deleteTexture(g_webglControl.m_arrBgTexId[i]);
                }
            }
        }
    }

    this.setBoxVBO_webgl1 = function() {
        // 创建包围盒VAO缓存
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            let nVBOId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
            // 建立显存缓存
            g_webglControl.setBoxLines(i);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_webglControl.m_arrBoxLines), gl.STATIC_DRAW);
            g_webglControl.m_arrObjectBox_VBOs.push(nVBOId);
        }
    }

    this.clearBoxVBO_webgl1 = function() {
        for (let i = 0; i < g_webglControl.m_arrObjectBox_VBOs.length; i++) {
            gl.deleteBuffer(g_webglControl.m_arrObjectBox_VBOs[i]);
        }
    }

    this.setVertexVBO_webgl1 = function() {
        // 创建零件VAO缓存
        let arrPartUsedFlag = new Array(g_GLPartSet._arrPartSet.length);
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            arrPartUsedFlag[i] = new Array();
        }
        for (let i = 0; i < g_webglControl.m_arrObjectMeshVAOUint.length; i++) {
            let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            let equalFlags = g_webglControl.GetEqualFlags(uCurPartIndex, i, arrPartUsedFlag);
            let uBeforeObjectIndex = equalFlags.EqualBeforeIndex;
            let isEqualToBefore = equalFlags.EqualBeforeFlag;

            let arrSurfaceVBOs = new Array();
            g_webglControl.setVertexDataNum(uCurPartIndex);
            if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                // 创建曲面零件VAO缓存
                if (!isEqualToBefore) {
                    let offset = 0;
                    for (let j = 0; j < g_webglControl.m_arrObjectMeshVAOUint[i].length; j++) {
                        // 创建一个VBO
                        let buffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                        let subData = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.subarray(
                            offset, offset+g_webglControl.m_arrObjectMeshVAOUint[i][j].uintVertexNum*VERTEX_DATA_COUNT);
                        gl.bufferData(gl.ARRAY_BUFFER, subData, gl.STATIC_DRAW);
                        // 存值
                        arrSurfaceVBOs.push(buffer);
                        offset += g_webglControl.m_arrObjectMeshVAOUint[i][j].uintVertexNum*VERTEX_DATA_COUNT;
                    }
                } else {
                    for (let j = 0; j < g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex].length; j++) {
                        arrSurfaceVBOs.push(g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex][j]);
                    }
                }
            } else {
                // 创建线缆数据VAO缓存
                if (!isEqualToBefore) {
                    // 创建一个VBO
                    let buffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    let subData = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.subarray(
                        0, g_webglControl.m_arrObjectMeshVAOUint[i][0].uintVertexNum*VERTEX_DATA_COUNT);
                    gl.bufferData(gl.ARRAY_BUFFER, subData, gl.STATIC_DRAW);
                    // 存值
                    arrSurfaceVBOs.push(buffer);
                } else {
                    arrSurfaceVBOs.push(g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex][0]);
                }
            }
            g_webglControl.m_arrObjectSurface_VBOs.push(arrSurfaceVBOs);
        }
        // 解除绑定
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    this.clearVertexVBO_webgl1 = function() {
        // 清除顶点缓存数据
        for (let i = 0; i < g_webglControl.m_arrObjectSurface_VBOs.length; i++) {
            for (let j = 0; j < g_webglControl.m_arrObjectSurface_VBOs[i].length; j++) {
                gl.deleteBuffer(g_webglControl.m_arrObjectSurface_VBOs[i][j]);
            }
        }
    }

    this.clearTextures = function() {
        // 清除贴图缓存数据
        for (let i = 0; i < g_GLMaterialSet._arrMaterialSet.length; i++) {
            if (g_GLMaterialSet._arrMaterialSet[i]._MtlData._eMtlType == ADFMTLTYPE_PICTURE) {
                if (g_GLMaterialSet._arrMaterialSet[i]._MtlData._arrTexID[0] instanceof WebGLTexture) {
                    gl.deleteTexture(g_GLMaterialSet._arrMaterialSet[i]._MtlData._arrTexID[0]);
                }
            }
        }
    }

    this.setGeomSurfaceVBO_webgl1 = function() {
        // 创建精确几何曲面数据VAO缓存
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            if (g_GLPartSet._arrPartSet[i]._SurfaceShape == null) {
                g_webglControl.m_arrPartGeomSurface_VBOs.push(-1);
                continue;
            }

            let nVBOId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
            // 建立显存缓存
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_GLPartSet._arrPartSet[i]._SurfaceShape._arrShapeOfPoints), gl.STATIC_DRAW);
            g_webglControl.m_arrPartGeomSurface_VBOs.push(nVBOId);
        }
    }

    this.clearGeomSurfaceVBO_webgl1 = function() {
        for (let i = 0; i < g_webglControl.m_arrPartGeomSurface_VBOs.length; i++) {
            gl.deleteBuffer(g_webglControl.m_arrPartGeomSurface_VBOs[i]);
        }
    }

    this.setGeomCurveVBO_webgl1 = function() {
        // 创建精确几何曲线数据VAO缓存
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            if (g_GLPartSet._arrPartSet[i]._CurveShape == null ||
                g_GLPartSet._arrPartSet[i]._CurveShape._arrShapeOfPoints.length == 0) {
                g_webglControl.m_arrPartGeomCurve_VBOs.push(-1);
                continue;
            }

            let nVBOId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
            // 建立显存缓存
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_GLPartSet._arrPartSet[i]._CurveShape._arrShapeOfPoints), gl.STATIC_DRAW);
            g_webglControl.m_arrPartGeomCurve_VBOs.push(nVBOId);
        }
    }

    this.clearGeomCurveVBO_webgl1 = function() {
        for (let i = 0; i < g_webglControl.m_arrPartGeomCurve_VBOs.length; i++) {
            if (g_webglControl.m_arrPartGeomCurve_VBOs[i] != -1) {
                gl.deleteBuffer(g_webglControl.m_arrPartGeomCurve_VBOs[i]);
            }
        }
    }
}

function WebGL2() {
    SOLIDPROGRAMINFO = initSolidProgramInfo(gl);
    PICTUREPROGRAMINFO = initPictureProgramInfo(gl);
    LINEPROGRAMINFO = initLineProgramInfo(gl);

    this.PVMattrix = mat4.create();
    this.MVPMatrix = mat4.create();

    this.initScene = function() {
        this.setBgVAO();
        this.setBoxVAO();
        this.setVertexVAO();
        this.initGLConfig();
        if (g_webglControl.isContainsGeom) {
            this.setGeomSurfaceVAO();
            this.setGeomCurveVAO();
        }
    }

    this.uninitScene = function() {
        this.clearVertexVAOs();
        this.clearBoxVAO();
        this.clearBgVAO();
        this.clearGeomSurfaceVAO();
        if (g_webglControl.isContainsGeom) {
            this.clearGeomCurveVAO();
            this.clearTextures();
        }
    }

    this.resetScene = function() {
        this.setBoxVAO();
        this.setVertexVAO();
        if (g_webglControl.isContainsGeom) {
            this.setGeomSurfaceVAO();
            this.setGeomCurveVAO();
        }
    }

    this.clearScene = function() {
        this.clearVertexVAOs();
        this.clearBoxVAO();
        this.clearTextures();
        if (g_webglControl.isContainsGeom) {
            this.clearGeomSurfaceVAO();
            this.clearGeomCurveVAO();
        }
    }

    /**
     * 初始化窗口视图，窗口变化后调用
     */
     this.initViewPort = function(width, height, camera) {
        gl.viewport(0, 0, width, height);
    }

    /**
     * 设置WebGL参数
     */
     this.initGLConfig = function() {
        // 开启背面剔除
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        // 开启深度测试
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        // 启用混色
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // 设置线宽
        // gl.lineWidth(3.0);

    }

    /**
     * 绘制图形
     */
     this.draw = function(camera) {
        // Clear the canvas before we start drawing on it.
        gl.clearColor(0.313, 0.357, 0.467, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 绘制背景图片
        gl.useProgram(PICTUREPROGRAMINFO.program);
        this.drawBackground();

        gl.useProgram(SOLIDPROGRAMINFO.program);
        mat4.multiply(this.PVMattrix, camera.projectionMatrix, camera.viewMatrix);
        this.drawObjectArray(camera);
        
        // 绘制零件实例包围盒
        gl.useProgram(LINEPROGRAMINFO.program);
        if (g_webglControl.isPicked && g_webglControl.isShowBox) {
            this.drawBox();
        }

        // 绘制精确几何数据
        if (g_webglControl.isContainsGeom && g_webglControl.isShowGeomtry) {
            gl.useProgram(LINEPROGRAMINFO.program);
            this.drawObjectGeomArray();
        }
    }

    this.drawObjectArray = function(camera) {
        gl.uniform3f(SOLIDPROGRAMINFO.uniformLocations.eyeLocation, camera.eye.x, camera.eye.y, camera.eye.z);
        // 绘制全不透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_NO) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
        // 绘制部分透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_PART) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
        // 绘制全透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_ALL) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
    }

    /**
     * 绘制零件实例
     */
    this.drawObjectTriangles = function(objectIndex) {
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(SOLIDPROGRAMINFO.program);
        // 获取Object透明度
        let objectTrans = g_webglControl.m_arrObjectTransparent[objectIndex];
        if (objectTrans <= GL_ZERO) {
            return;
        }
        // 正向面定义模式
        if (g_GLObjectSet._arrObjectSet[objectIndex]._nCullMode == ADFCULL_NONE) {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
        }
        // 同一个object矩阵相同
        mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        // 同一个Object的不同Surface材质不同
        for (let j = 0; j < g_webglControl.m_arrObjectSurface_VAOs[objectIndex].length; j++) {
            gl.bindVertexArray(g_webglControl.m_arrObjectSurface_VAOs[objectIndex][j]);
            let offset = 0;
            for (let s = 0; s < g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].splitSize; ++s) {
                // 材质数据
                let curMaterial = g_webglControl.GetObjectShowMaterial(objectIndex, j, s);
                g_webglControl.setShaderMaterial(curMaterial, objectTrans);
                gl.drawArrays(gl.TRIANGLES, offset, g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].arrVertexCounts[s]);
                offset += g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].arrVertexCounts[s];
            }
        }
    }

    this.drawObjectLines = function(objectIndex) {
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(LINEPROGRAMINFO.program);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        let materialIndex = g_webglControl.m_arrObjectMeshVAOUint[objectIndex][0].uintMaterialIndex;
        let curMaterial = null;
        if (materialIndex == -1) {
            curMaterial = this.defaultMaterial;
        } else {
            curMaterial = g_GLMaterialSet._arrMaterialSet[materialIndex];
        }
        gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor,
                    curMaterial._MtlData._mtlPhysics.vEmissive.x,
                    curMaterial._MtlData._mtlPhysics.vEmissive.y,
                    curMaterial._MtlData._mtlPhysics.vEmissive.z);
        gl.bindVertexArray(g_webglControl.m_arrObjectSurface_VAOs[objectIndex][0]);
        gl.drawArrays(gl.LINES, 0, g_webglControl.m_arrObjectMeshVAOUint[objectIndex][0].uintVertexNum);
    }

    this.drawBox = function() {
        for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                gl.lineWidth(3.0);
                mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[i]);
                gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
                gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 1.0, 1.0, 0.0);
                let nPickPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                gl.bindVertexArray(g_webglControl.m_arrObjectBox_VAOs[nPickPartIndex]);
                gl.drawArrays(gl.LINES, 0, BOX_LINEVERTEX_COUNT);
            }
        }
    }

    /**
     * 绘制背景图片
     */
     this.drawBackground = function() {
        if (g_webglControl.m_arrBgTexId != null) {
            if (g_webglControl.m_arrBgTexId[g_webglControl.m_bgIndex] instanceof WebGLTexture) {
                gl.bindVertexArray(g_webglControl.m_uBgVAO);
                gl.uniform1i(PICTUREPROGRAMINFO.textureUnit, 0);
                gl.bindTexture(gl.TEXTURE_2D, g_webglControl.m_arrBgTexId[g_webglControl.m_bgIndex]);
                gl.drawArrays(gl.TRIANGLES, 0, BG_VERTEX.count);
            }
        }
    }

    /**
     * 绘制精确几何数据
     */
    this.drawObjectGeomArray = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            this.drawObjectGeom(i);
        }
    }

    this.drawObjectGeom = function(objectIndex) {
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        // 获取Object透明度
        let objectTrans = g_webglControl.m_arrObjectTransparent[objectIndex];
        if (objectTrans <= GL_ZERO) {
            return;
        }

        let nPickPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        if (g_webglControl.m_arrPartGeomCurve_VAOs[nPickPartIndex] == -1) {
            return;
        }

        mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        gl.bindVertexArray(g_webglControl.m_arrPartGeomCurve_VAOs[nPickPartIndex]);

        let offset = 0;
        for (let s = 0; s < g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].splitSize; ++s) {
            if (g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].splitFlags != null &&
                g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].splitFlags.length > s &&
                g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].splitFlags[s].flag == GL_USERPICKED) {
                gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 1.0, 1.0, 1.0);
            } else {
                gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 0.0, 0.0, 0.0);
            }
            gl.drawArrays(gl.LINES, offset, g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].arrVertexCounts[s]);
            offset += g_webglControl.m_arrObjectCurveVAOUnit[objectIndex].arrVertexCounts[s];
        }
    }

    /**
         * 生成GPU缓存数据
         */
    this.setVertexVAO = function() {
        // 创建零件VAO缓存
        let arrPartUsedFlag = new Array(g_GLPartSet._arrPartSet.length);
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            arrPartUsedFlag[i] = new Array();
        }
        for (let i = 0; i < g_webglControl.m_arrObjectMeshVAOUint.length; i++) {
            let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            let equalFlags = g_webglControl.GetEqualFlags(uCurPartIndex, i, arrPartUsedFlag);
            let uBeforeObjectIndex = equalFlags.EqualBeforeIndex;
            let isEqualToBefore = equalFlags.EqualBeforeFlag;

            let arrSurfaceVAOs = new Array();
            let arrSurfaceVBOs = new Array();
            if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                // 创建曲面零件VAO缓存
                if (!isEqualToBefore) {
                    this.setSubsetSurfaceVAO(uCurPartIndex, i, arrSurfaceVAOs, arrSurfaceVBOs);
                } else {
                    for (let j = 0; j < g_webglControl.m_arrObjectSurface_VAOs[uBeforeObjectIndex].length; j++) {
                        arrSurfaceVAOs.push(g_webglControl.m_arrObjectSurface_VAOs[uBeforeObjectIndex][j]);
                    }
                    for (let j = 0; j < g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex].length; j++) {
                        arrSurfaceVBOs.push(g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex][j]);
                    }
                }
            } else {
                // 创建线缆数据VAO缓存
                if (!isEqualToBefore) {
                    this.setSubsetCurveVAO(uCurPartIndex, i, arrSurfaceVAOs, arrSurfaceVBOs);
                } else {
                    arrSurfaceVAOs.push(g_webglControl.m_arrObjectSurface_VAOs[uBeforeObjectIndex][0]);
                    arrSurfaceVBOs.push(g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex][0]);
                }
            }
            g_webglControl.m_arrObjectSurface_VAOs.push(arrSurfaceVAOs);
            g_webglControl.m_arrObjectSurface_VBOs.push(arrSurfaceVBOs);
        }
        // 解除绑定
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    this.clearVertexVAOs = function() {
        // 清除顶点缓存数据
        for (let i = 0; i < g_webglControl.m_arrObjectSurface_VAOs.length; i++) {
            for (let j = 0; j < g_webglControl.m_arrObjectSurface_VAOs[i].length; j++) {
                gl.deleteVertexArray(g_webglControl.m_arrObjectSurface_VAOs[i][j]);
            }
        }

        for (let i = 0; i < g_webglControl.m_arrObjectSurface_VBOs.length; i++) {
            for (let j = 0; j < g_webglControl.m_arrObjectSurface_VBOs[i].length; j++) {
                gl.deleteBuffer(g_webglControl.m_arrObjectSurface_VBOs[i][j]);
            }
        }
    }

    this.setBgVAO = function() {
        // 创建背景图片VAO缓存
        g_webglControl.m_uBgVAO = gl.createVertexArray();
        gl.bindVertexArray(g_webglControl.m_uBgVAO);
        g_webglControl.m_uBgVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_uBgVBO);
        gl.bufferData(gl.ARRAY_BUFFER, 6 * (NUM_VERTEX + NUM_UV) * 4, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(BG_VERTEX.vertex), 0, 6 * (NUM_VERTEX + NUM_UV));
        gl.vertexAttribPointer(PICTUREPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, (NUM_VERTEX + NUM_UV) * 4, 0);
        gl.enableVertexAttribArray(PICTUREPROGRAMINFO.attribLocations.vertexPosition);
        gl.vertexAttribPointer(PICTUREPROGRAMINFO.attribLocations.vertexUV, NUM_UV, gl.FLOAT, false, (NUM_VERTEX + NUM_UV) * 4, NUM_VERTEX*4);
        gl.enableVertexAttribArray(PICTUREPROGRAMINFO.attribLocations.vertexUV);
    }

    this.clearBgVAO = function() {
        if (g_webglControl.m_uBgVBO != -1) {
            gl.deleteBuffer(this.m_uBgVBO);
        }
        if (g_webglControl.m_uBgVAO != -1) {
            gl.deleteVertexArray(this.m_uBgVAO);
        }
        // 清除背景图片缓存数据
        if (g_webglControl.m_arrBgTexId != null) {
            for (let i = 0; i < g_webglControl.m_arrBgTexId.length; i++) {
                if (g_webglControl.m_arrBgTexId[i] instanceof WebGLTexture) {
                    gl.deleteTexture(g_webglControl.m_arrBgTexId[i]);
                }
            }
        }
    }

    this.setBoxVAO = function() {
        // 创建包围盒VAO缓存
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            let nVAOId = -1;
            nVAOId = gl.createVertexArray();
            gl.bindVertexArray(nVAOId);
            let nVBOId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
            // 建立显存缓存
            g_webglControl.setBoxLines(i);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_webglControl.m_arrBoxLines), gl.STATIC_DRAW);
            gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, NUM_VERTEX*4, 0);
            gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
            g_webglControl.m_arrObjectBox_VBOs.push(nVBOId);
            g_webglControl.m_arrObjectBox_VAOs.push(nVAOId);
        }
    }

    this.clearBoxVAO = function() {
        for (let i = 0; i < g_webglControl.m_arrObjectBox_VAOs.length; i++) {
            gl.deleteVertexArray(g_webglControl.m_arrObjectBox_VAOs[i]);
        }

        for (let i = 0; i < g_webglControl.m_arrObjectBox_VBOs.length; i++) {
            gl.deleteBuffer(g_webglControl.m_arrObjectBox_VBOs[i]);
        }
    }

    this.setSubsetSurfaceVAO = function(uPartIndex, uObjectIndex, arrSurfaceVAOs, arrSurfaceVBOs) {
        g_webglControl.setVertexDataNum(uPartIndex);
        g_webglControl.setVertexStride(uPartIndex);
        // 创建曲面VAO缓存
        let offset = 0;
        for (let j = 0; j< g_webglControl.m_arrObjectMeshVAOUint[uObjectIndex].length; j++) {
            // 创建一个VAO
            let VAOArray = -1;
            VAOArray = gl.createVertexArray();
            gl.bindVertexArray(VAOArray);
            // 创建一个VBO
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, g_webglControl.m_arrObjectMeshVAOUint[uObjectIndex][j].uintVertexNum*STRIDE, gl.STATIC_DRAW);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex,
                            offset, g_webglControl.m_arrObjectMeshVAOUint[uObjectIndex][j].uintVertexNum*VERTEX_DATA_COUNT);
            // 绑定缓存区数据
            gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, STRIDE, 0);
            gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexPosition);
            gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexVector, NUM_VECTOR, gl.FLOAT, false, STRIDE, NUM_VERTEX*4);
            gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexVector);
            if (g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
                gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexUV, NUM_UV, gl.FLOAT, false, STRIDE, (NUM_VERTEX+NUM_VECTOR)*4);
                gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexUV);
            }
            // 存值
            arrSurfaceVBOs.push(buffer);
            arrSurfaceVAOs.push(VAOArray);
            offset += g_webglControl.m_arrObjectMeshVAOUint[uObjectIndex][j].uintVertexNum*VERTEX_DATA_COUNT;
        }
    }

    this.setSubsetCurveVAO = function(uPartIndex, uObjectIndex, arrSurfaceVAOs, arrSurfaceVBOs) {
        g_webglControl.setVertexDataNum(uPartIndex);
        g_webglControl.setVertexStride(uPartIndex);
        // 创建一个VAO
        let VAOArray = -1;
        VAOArray = gl.createVertexArray();
        gl.bindVertexArray(VAOArray);
        // 创建一个VBO
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, g_webglControl.m_arrObjectMeshVAOUint[uObjectIndex][0].uintVertexNum*STRIDE, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex,
                        0, g_webglControl.m_arrObjectMeshVAOUint[uObjectIndex][0].uintVertexNum*VERTEX_DATA_COUNT);
        // 绑定缓存区数据
        gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, STRIDE, 0);
        gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
        // 存值
        arrSurfaceVBOs.push(buffer);
        arrSurfaceVAOs.push(VAOArray);
    }

    this.clearTextures = function() {
        // 清除贴图缓存数据
        for (let i = 0; i < g_GLMaterialSet._arrMaterialSet.length; i++) {
            if (g_GLMaterialSet._arrMaterialSet[i]._MtlData._eMtlType == ADFMTLTYPE_PICTURE) {
                if (g_GLMaterialSet._arrMaterialSet[i]._MtlData._arrTexID[0] instanceof WebGLTexture) {
                    gl.deleteTexture(g_GLMaterialSet._arrMaterialSet[i]._MtlData._arrTexID[0]);
                }
            }
        }
    }

    this.setGeomSurfaceVAO = function() {
        // 创建精确几何曲面数据VAO缓存
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            if (g_GLPartSet._arrPartSet[i]._SurfaceShape == null) {
                g_webglControl.m_arrPartGeomSurface_VAOs.push(-1);
                g_webglControl.m_arrPartGeomSurface_VBOs.push(-1);
                continue;
            }

            let nVAOId = -1;
            nVAOId = gl.createVertexArray();
            gl.bindVertexArray(nVAOId);
            let nVBOId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
            // 建立显存缓存
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_GLPartSet._arrPartSet[i]._SurfaceShape._arrShapeOfPoints), gl.STATIC_DRAW);
            gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, NUM_VERTEX*4, 0);
            gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
            g_webglControl.m_arrPartGeomSurface_VAOs.push(nVAOId);
            g_webglControl.m_arrPartGeomSurface_VBOs.push(nVBOId);
        }
    }

    this.clearGeomSurfaceVAO = function() {
        for (let i = 0; i < g_webglControl.m_arrPartGeomSurface_VAOs.length; i++) {
            gl.deleteVertexArray(g_webglControl.m_arrPartGeomSurface_VAOs[i]);
        }

        for (let i = 0; i < g_webglControl.m_arrPartGeomSurface_VBOs.length; i++) {
            gl.deleteBuffer(g_webglControl.m_arrPartGeomSurface_VBOs[i]);
        }
    }

    this.setGeomCurveVAO = function() {
        // 创建精确几何曲线数据VAO缓存
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            if (g_GLPartSet._arrPartSet[i]._CurveShape == null ||
                g_GLPartSet._arrPartSet[i]._CurveShape._arrShapeOfPoints.length == 0) {
                g_webglControl.m_arrPartGeomCurve_VAOs.push(-1);
                g_webglControl.m_arrPartGeomCurve_VBOs.push(-1);
                continue;
            }

            let nVAOId = -1;
            nVAOId = gl.createVertexArray();
            gl.bindVertexArray(nVAOId);
            let nVBOId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
            // 建立显存缓存
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_GLPartSet._arrPartSet[i]._CurveShape._arrShapeOfPoints), gl.STATIC_DRAW);
            gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, NUM_VERTEX*4, 0);
            gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
            g_webglControl.m_arrPartGeomCurve_VAOs.push(nVAOId);
            g_webglControl.m_arrPartGeomCurve_VBOs.push(nVBOId);
        }
    }

    this.clearGeomCurveVAO = function() {
        for (let i = 0; i < g_webglControl.m_arrPartGeomCurve_VAOs.length; i++) {
            if (g_webglControl.m_arrPartGeomCurve_VAOs[i] != -1) {
                gl.deleteVertexArray(g_webglControl.m_arrPartGeomCurve_VAOs[i]);
            }
        }

        for (let i = 0; i < g_webglControl.m_arrPartGeomCurve_VBOs.length; i++) {
            if (g_webglControl.m_arrPartGeomCurve_VBOs[i] != -1) {
                gl.deleteBuffer(g_webglControl.m_arrPartGeomCurve_VBOs[i]);
            }
        }
    }
}
