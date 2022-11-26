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
const DEFAULT_VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
const DEFAULT_STRIDE = (NUM_VERTEX + NUM_VECTOR + NUM_UV) * 4;
const DEFAULT_NOUV_STRIDE = (NUM_VERTEX + NUM_VECTOR) * 4;
const DEFAULT_NOUV_DATA_COUNT = NUM_VERTEX + NUM_VECTOR;
const DEFAULT_POS_STRIDE = NUM_VERTEX * 4;
const DEFAULT_POS_DATA_COUNT = NUM_VERTEX;

const SHADER_DIFFUSE_LIGHT_POWER = 0.75;
const SHADER_AMBIENT_LIGHT_POWER = 0.3;
const SHADER_SPECULAR_LIGHT_POWER = 0.85;
const SHADER_EMISSIVE_LIGHT_POWER = 0.8;

var VERTEX_DATA_COUNT = DEFAULT_VERTEX_DATA_COUNT;
var STRIDE = DEFAULT_STRIDE;

var SOLIDPROGRAMINFO = null;
var PICTUREPROGRAMINFO = null;
var LINEPROGRAMINFO = null;
var BASEPROGRAMINFO = null;

function WebGLControl() {
    // 显示控制开关
    this.isBackground = false;
    this.isSolid = false;
    this.isPicked = false;
    this.isShowBox = true;
    this.isHighlight = true;
    this.isHighlightObject = true;
    this.isHighlightSurface = false;
    this.isHighlightCurve = false;
    this.isShowImageBk = true;
    this.isSectionOn = true;
    this.isPmiOn = true;
    // 渲染效果参数
    this.vecLightType = [1, 0, 0]
    this.ptLightPosition = new Point3(0.0, 0.0, 1.0);
    this.pcLightPower = [SHADER_DIFFUSE_LIGHT_POWER, SHADER_AMBIENT_LIGHT_POWER,
        SHADER_SPECULAR_LIGHT_POWER, SHADER_EMISSIVE_LIGHT_POWER];
    // 模型缓存数据
    this.m_arrPartVertex_VAOs = null;
    this.m_arrPartVertexPosition_VBOs = null;
    this.m_arrPartVertexNormal_VBOs = null;
    this.m_arrPartVertexUV_VBOs = null;
    this.m_arrPartVertex_IBOs = null;
    // 模型包围盒数据
    this.m_arrPartBox_VAOs = null;
    this.m_arrPartBox_VBOs = null;
    // 背景图像数据
    this.m_bgIndex = 0;
    this.m_arrBgTexId = null;
    this.m_uBgVAO = -1;
    this.m_uBgVBO = -1;
    this.m_BgColor = new Point3();
    // 辅助显示数据，合并材质所需数据
    this.m_arrObjectMeshVAOUint = null;
    // 拾取所需显示数据
    this.m_arrBoxLines = new Array(BOX_DATA_COUNT);
    this.arrPickObjectIndexs = new Array();         // bool值，标志object是否被选中
    this.arrPickObjectSurfaceIndexs = new Array();  // bool值，标志object及其surface是否被选中
    this.eMaterialPriority = GL_ORIGINAL;
    this.GL_PICKSTATUS = 0;
    // 用户交互所需数据：变换矩阵/透明度/显隐/材质设置
    this.m_modelMatrix = mat4.create();
    this.m_arrObjectTransMode = null;
    this.m_arrObjectTransModeOrig = null;
    this.m_arrObjectMatrix = new Array();
    this.m_arrObjectTransparent = new Array();       // float值，标志object透明度
    this.m_arrObjectVisiable = new Array();          // bool值，标志object是否隐藏
    this.m_arrObjectMaterial = new Array();          // 材质对象，标志object被设置材质
    this.m_arrObjectSurfaceTransparent = new Array();// float值，标志object及其surface是否被设置透明度
    this.m_arrObjectSurfaceVisiable = new Array();   // bool值，标志object及其surface是否被设置隐藏
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
    // 剖切所需控制参数
    this.enbaleCullFace = true;
    this.m_arrClipPlaneVAOs = new Array();
    this.m_arrClipPlaneVBOs = new Array();
    this.m_arrBaseScene_VAOs = new Array();
    this.m_arrBaseScene_VBOs = new Array();
    this.m_arrBaseScene_IBOs = new Array();
    this.m_arrBaseSceneVertextNum = new Array();
    this.m_arrBaseSceneMatrix = new Array();
    this.m_arrDynamicContour_VAOs = new Array();
    this.m_arrDynamicContour_VBOs = new Array();
    this.m_arrDynamicContour_IBOs = new Array();
    this.m_arrDynamicContourVertexNum = new Array();
    this.m_dynamicObjMatrix = mat4.create();
    this.m_arrDynamicFacet_VAOs = new Array();
    this.m_arrDynamicFacet_VBOs = new Array();
    this.m_arrDynamicFacet_IBOs = new Array();
    this.m_arrDynamicFacetVertexNum = new Array();
    this.m_clipOriginMatrix = mat4.create();
    this.m_clipMatrix = mat4.create();
    // pmi所需控制参数
    this.m_arrPmiSymbol_VAOs = new Array();
    this.m_arrPmiSymbol_VBOs = new Array();
    this.m_arrPmiSymbol_IBOs = new Array();
    this.m_arrPmiWire_VAOs = new Array();
    this.m_arrPmiWire_VBOs = new Array();
    this.m_arrPmiWire_IBOs = new Array();
    this.m_pmiMatrixWld = mat4.create();
    
    this.initControlParams = function() {
        this.m_arrObjectMeshVAOUint = new Array(g_GLObjectSet._arrObjectSet.length);
        this.m_arrObjectTransModeOrig = new Array(g_GLObjectSet._arrObjectSet.length);
        this.m_arrObjectTransMode = new Array(g_GLObjectSet._arrObjectSet.length);

        this.m_arrPartVertex_VAOs = new Array();
        this.m_arrPartVertexPosition_VBOs = new Array();
        this.m_arrPartVertexNormal_VBOs = new Array();
        this.m_arrPartVertexUV_VBOs = new Array();
        this.m_arrPartVertex_IBOs = new Array();
        this.m_arrPartBox_VAOs = new Array();
        this.m_arrPartBox_VBOs = new Array();
    }

    this.clearParams = function() {
        this.m_arrPartVertex_VAOs.splice(0, this.m_arrPartVertex_VAOs.length);
        this.m_arrPartVertexPosition_VBOs.splice(0, this.m_arrPartVertexPosition_VBOs.length);
        this.m_arrPartVertexNormal_VBOs.splice(0, this.m_arrPartVertexNormal_VBOs.length);
        this.m_arrPartVertexUV_VBOs.splice(0, this.m_arrPartVertexUV_VBOs.length);
        this.m_arrPartVertex_IBOs.splice(0, this.m_arrPartVertex_IBOs.length);
        this.m_arrPartBox_VAOs.splice(0, this.m_arrPartBox_VAOs.length);
        this.m_arrPartBox_VBOs.splice(0, this.m_arrPartBox_VBOs.length);
        this.m_arrPartGeomSurface_VAOs.splice(0, this.m_arrPartGeomSurface_VAOs.length);
        this.m_arrPartGeomSurface_VBOs.splice(0, this.m_arrPartGeomSurface_VBOs.length);
        this.m_arrPartGeomCurve_VAOs.splice(0, this.m_arrPartGeomCurve_VAOs.length);
        this.m_arrPartGeomCurve_VBOs.splice(0, this.m_arrPartGeomCurve_VBOs.length);
        this.m_arrClipPlaneVAOs.splice(0, this.m_arrClipPlaneVAOs.length);
        this.m_arrClipPlaneVBOs.splice(0, this.m_arrClipPlaneVBOs.length);

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
            for (let j = 0; j < this.m_arrObjectSurfaceMaterial[i].length; ++j) {
                this.clearUsrDefineMaterial(i, j);
            }
            this.m_arrObjectSurfaceMaterial[i].splice(0, this.m_arrObjectSurfaceMaterial[i].length);
        }
        this.m_arrObjectSurfaceMaterial.splice(0, this.m_arrObjectSurfaceMaterial.length);

        this.ClearUnits();
        this.isContainsGeom = false;
    }

    this.ClearUnits = function() {
        if (this.m_arrObjectMeshVAOUint != null) {
            for (let i = 0; i < this.m_arrObjectMeshVAOUint.length; ++i) {
                if (this.m_arrObjectMeshVAOUint[i] != null) {
                    for (let j = 0; j < this.m_arrObjectMeshVAOUint[i].length; ++j) {
                        this.m_arrObjectMeshVAOUint[i][j].Clear();
                    }
                    this.m_arrObjectMeshVAOUint[i].splice(0, this.m_arrObjectMeshVAOUint[i].length);
                }
            }
            this.m_arrObjectMeshVAOUint.splice(0, this.m_arrObjectMeshVAOUint.length);
        }

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
            return (this.m_arrObjectSurfaceMaterial[objectIndex] == null ||
                this.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex] == null) ?
                this.defaultMaterial : this.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex];
        }
        else {
            return this.m_arrObjectMaterial[objectIndex];
        }
    }

    /**
     * 清除用户定义的物件曲面材质：尤其是贴图数据清除缓存
     */
     this.clearUsrDefineMaterial = function(objectIndex, surfaceIndex) {
        let curMaterail = this.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex];
        if (curMaterail != null && curMaterail._MtlData._eMtlType == ADFMTLTYPE_PICTURE) {
            if (curMaterail._MtlData._arrTexID[0] instanceof WebGLTexture &&
                curMaterail._uMtlID >= g_cmonlineMtlIDBase) {
                gl.deleteTexture(curMaterail._MtlData._arrTexID[0]);
            }
        }
        this.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex] = null;
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
            if (this.m_arrObjectMaterial[objectIndex] != null) {
                return this.GetUsrDefinedMaterial(objectIndex, vaoIndex, splitIndex);
            } else {
                return this.GetOriginMaterial(objectIndex, vaoIndex);
            }
        } else {
            // 允许高亮显示，则根据显示优先级做判断
            if (!this.isHighlightSurface) {
                if ((this.arrPickObjectIndexs[objectIndex] && this.m_arrObjectMaterial[objectIndex] != null)) {
                    switch (this.eMaterialPriority) {
                        case GL_USERPICKED:
                            return this.GetUsrPickedMaterial(objectIndex, vaoIndex, splitIndex);
                        case GL_ORIGINAL:
                            return this.GetOriginMaterial(objectIndex, vaoIndex);
                        case GL_USERDEFINE:
                            return this.GetUsrDefinedMaterial(objectIndex, vaoIndex, splitIndex);
                    }
                } else if (this.arrPickObjectIndexs[objectIndex]) {
                    return this.GetUsrPickedMaterial(objectIndex, vaoIndex, splitIndex);
                } else if (this.m_arrObjectMaterial[objectIndex] != null) {
                    return this.GetUsrDefinedMaterial(objectIndex, vaoIndex, splitIndex);
                } else {
                    return this.GetOriginMaterial(objectIndex, vaoIndex)
                }
            } else {
                let surfaceIndex = this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].splitFlags[splitIndex].fromIndex;
                if (this.arrPickObjectSurfaceIndexs[objectIndex][surfaceIndex] && this.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex] != null) {
                    switch (this.eMaterialPriority) {
                        case GL_USERPICKED:
                            return this.GetUsrPickedMaterial(objectIndex, vaoIndex, splitIndex);
                        case GL_ORIGINAL:
                            return this.GetOriginMaterial(objectIndex, vaoIndex);
                        case GL_USERDEFINE:
                            return this.GetUsrDefinedMaterial(objectIndex, vaoIndex, splitIndex);
                    }
                } else if (this.arrPickObjectSurfaceIndexs[objectIndex][surfaceIndex]) {
                    return this.GetUsrPickedMaterial(objectIndex, vaoIndex, splitIndex);
                } else if (this.m_arrObjectSurfaceMaterial[objectIndex][surfaceIndex] != null) {
                    return this.GetUsrDefinedMaterial(objectIndex, vaoIndex, splitIndex);
                } else {
                    return this.GetOriginMaterial(objectIndex, vaoIndex)
                }
            }
        }
    }

    this.setShaderMaterial = function(curMaterial, objectTrans) {
        gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialDiffuse,
            curMaterial._MtlData._mtlPhysics.vDiffuse.x,
            curMaterial._MtlData._mtlPhysics.vDiffuse.y,
            curMaterial._MtlData._mtlPhysics.vDiffuse.z,
            curMaterial._MtlData._mtlPhysics.vDiffuse.w * this.pcLightPower[0]);
        gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialAmbient,
            curMaterial._MtlData._mtlPhysics.vAmbient.x,
            curMaterial._MtlData._mtlPhysics.vAmbient.y,
            curMaterial._MtlData._mtlPhysics.vAmbient.z,
            curMaterial._MtlData._mtlPhysics.vAmbient.w * this.pcLightPower[1]);
        gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialSpecular,
            curMaterial._MtlData._mtlPhysics.vSpecular.x,
            curMaterial._MtlData._mtlPhysics.vSpecular.y,
            curMaterial._MtlData._mtlPhysics.vSpecular.z,
            curMaterial._MtlData._mtlPhysics.vSpecular.w * this.pcLightPower[2]);
        gl.uniform1f(SOLIDPROGRAMINFO.uniformLocations.power, curMaterial._MtlData._mtlPhysics.fPower);
        gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialEmissive,
            curMaterial._MtlData._mtlPhysics.vEmissive.x,
            curMaterial._MtlData._mtlPhysics.vEmissive.y,
            curMaterial._MtlData._mtlPhysics.vEmissive.z,
            this.pcLightPower[3]);
        gl.uniform1f(SOLIDPROGRAMINFO.uniformLocations.trans, curMaterial._MtlData._mtlPhysics.vEmissive.w * objectTrans);
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
                    this.pcLightPower[3]);
            }
        }
    }

    this.GetEqualFlags = function(uPartIndex, uObjectIndex, arrPartUsedFlag) {
        let uBeforeObjectIndex = -1;
        let isEqualToBefore = false;
        if (arrPartUsedFlag[uPartIndex].length > 0) {
            uBeforeObjectIndex = arrPartUsedFlag[uPartIndex][0];
            isEqualToBefore = true;
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
        // if (g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
        //     VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
        // } else {
        //     VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR;
        // }
        VERTEX_DATA_COUNT = 3;
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
            let pMesh = g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0];
            this.m_arrObjectMeshVAOUint[objectIndex][vaoIndex].arrVertexCounts[s] =
                pMesh._arrSurfaceStartIndex[curVAOSplitFlags[s].toIndex] - pMesh._arrSurfaceStartIndex[curVAOSplitFlags[s].fromIndex];
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
    BASEPROGRAMINFO = initBaseProgramInfo(gl);

    this.MMatrix = mat4.create();
    this.PVMattrix = mat4.create();
    this.MVPMatrix = mat4.create();

    this.initScene = function() {
        this.setBgVBO_webgl1();
        this.initGLConfig();
    }

    this.uninitScene = function() {
        this.clearVertexVBO_webgl1();
        this.clearBgVBO_webgl1();
        this.clearBoxVBO_webgl1();
        this.clearTextures();
        this.uninitGeom();
    }

    this.resetScene = function() {
        
    }

    this.clearScene = function() {
        this.clearVertexVBO_webgl1();
        this.clearBoxVBO_webgl1();
        this.clearTextures();
        this.uninitGeom();
    }

    this.initGeom = function() {
        if (g_webglControl.isContainsGeom) {
            this.setGeomSurfaceVBO_webgl1();
            this.setGeomCurveVBO_webgl1();
        }
    }

    this.uninitGeom = function() {
        if (g_webglControl.isContainsGeom) {
            this.clearGeomSurfaceVBO_webgl1();
            this.clearGeomCurveVBO_webgl1();
        }
    }

    this.initSection = function() {
        this.setBaseVAO();
    }

    this.uninitSection = function() {
        this.clearClipPlaneVAO();
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

    this.updatePartData = function(index) {
        this.setBoxVBOByIndex_webgl1(index);
        this.setPartSetVertexVBOByIndex_webgl1(index);
    }

    /**
     * 绘制图形
     */
    this.draw = function() {
        // Clear the canvas before we start drawing on it.
        if (!g_canvasTransparency) {
            gl.clearColor(g_webglControl.m_BgColor.x, g_webglControl.m_BgColor.y, g_webglControl.m_BgColor.z, 1.0);  // Clear to black, fully opaque
        }
        gl.clearDepth(1.0);                 // Clear everything
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 绘制背景图片
        if (g_webglControl.isShowImageBk) {
            gl.useProgram(PICTUREPROGRAMINFO.program);
            this.drawBackground_webgl1();
        }

        gl.useProgram(SOLIDPROGRAMINFO.program);
        mat4.multiply(this.PVMattrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        this.drawObjectArray_webgl1();
        
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

    this.drawObjectArray_webgl1 = function() {
        gl.uniform3f(SOLIDPROGRAMINFO.uniformLocations.eyeLocation, g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.VMatrix, false, g_camera.viewMatrix);
        gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.lightType, g_webglControl.vecLightType[0]);
        gl.uniform3f(SOLIDPROGRAMINFO.uniformLocations.lightLocation,
            g_webglControl.ptLightPosition.x, g_webglControl.ptLightPosition.y, g_webglControl.ptLightPosition.z);
        // 绘制全不透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_NO) {
                let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
        // 绘制部分透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_PART) {
                let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
        // 绘制全透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_ALL) {
                let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
    }

    this.drawObjectTriangles_webgl1 = function(objectIndex) {
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        let mesh = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0];
        if (g_webglControl.m_arrPartVertexPosition_VBOs[uCurPartIndex] == null) {
            return;
        }
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
        g_webglControl.setVertexStride(uCurPartIndex);
        // 正向面定义模式
        if (g_webglControl.enbaleCullFace && g_GLObjectSet._arrObjectSet[objectIndex]._nCullMode != ADFCULL_NONE) {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
        } else {
            gl.disable(gl.CULL_FACE);
        }
        // 同一个object矩阵相同
        mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.MMatrix, false, this.MMatrix);
        // 同一个Object的不同Surface材质不同
        gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrPartVertexPosition_VBOs[uCurPartIndex]);
        gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrPartVertexNormal_VBOs[uCurPartIndex]);
        gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexVector, NUM_VECTOR, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexVector);
        if (mesh._uIsUV == 1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrPartVertexUV_VBOs[uCurPartIndex]);
            gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexUV, NUM_UV, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexUV);
        } else {
            gl.disableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexUV);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g_webglControl.m_arrPartVertex_IBOs[uCurPartIndex]);
        let offset = 0;
        for (let j = 0; j < g_webglControl.m_arrObjectMeshVAOUint[objectIndex].length; j++) {
            for (let s = 0; s < g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].splitSize; ++s) {
                // 材质数据
                let curMaterial = g_webglControl.GetObjectShowMaterial(objectIndex, j, s);
                g_webglControl.setShaderMaterial(curMaterial, objectTrans);
                gl.drawElements(gl.TRIANGLES, g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].arrVertexCounts[s], mesh._uEleType, offset);
                offset += g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].arrVertexCounts[s] * mesh._uEleSize;
            }
        }
    }

    this.drawObjectLines_webgl1 = function(objectIndex) {
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(LINEPROGRAMINFO.program);
        mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
        gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        let materialIndex = g_webglControl.m_arrObjectMeshVAOUint[objectIndex][0].uintMaterialIndex;
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        g_webglControl.setVertexStride(uCurPartIndex);
        let curMaterial = null;
        if (materialIndex == -1) {
            curMaterial = g_webglControl.defaultMaterial;
        } else {
            curMaterial = g_GLMaterialSet._arrMaterialSet[materialIndex];
        }
        gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor,
                    curMaterial._MtlData._mtlPhysics.vEmissive.x,
                    curMaterial._MtlData._mtlPhysics.vEmissive.y,
                    curMaterial._MtlData._mtlPhysics.vEmissive.z);
        gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrPartVertexPosition_VBOs[uCurPartIndex]);
        gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, STRIDE, 0);
        gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g_webglControl.m_arrPartVertex_IBOs[uCurPartIndex]);
        gl.drawElements(gl.LINES, 0, gg_webglControl.m_arrObjectMeshVAOUint[objectIndex][0].uintVertexNum, gl.UNSIGNED_SHORT,0);
    }

    this.drawBox_webgl1 = function() {
        for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                let nPickPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                if (g_webglControl.m_arrPartBox_VBOs[nPickPartIndex] == null) {
                    return;
                }
                mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[i]);
                mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
                gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
                gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 1.0, 1.0, 0.0);
                gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrPartBox_VBOs[nPickPartIndex]);
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

        mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
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
        g_webglControl.m_BgColor.set(0.313, 0.357, 0.467);
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

    this.setBoxVBOByIndex_webgl1 = function(index) {
        // 创建包围盒VAO缓存
        let nVBOId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
        // 建立显存缓存
        g_webglControl.setBoxLines(index);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_webglControl.m_arrBoxLines), gl.STATIC_DRAW);
        g_webglControl.m_arrPartBox_VBOs[index] = nVBOId;
    }

    this.clearBoxVBO_webgl1 = function() {
        for (let i = 0; i < g_webglControl.m_arrPartBox_VBOs.length; i++) {
            if (g_webglControl.m_arrPartBox_VBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPartBox_VBOs[i]);
            }
        }
    }

    this.setPartSetVertexVBOByIndex_webgl1 = function(index) {
        // 创建一个VBO
        let posBuffer = null;
        let normalBuffer = null;
        let uvBuffer = null;
        posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, g_GLPartSet._arrPartSet[index]._arrPartLODData[0]._arrVertexPosition, gl.STATIC_DRAW);
        normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, g_GLPartSet._arrPartSet[index]._arrPartLODData[0]._arrVertexNormal, gl.STATIC_DRAW);
        if (g_GLPartSet._arrPartSet[index]._arrPartLODData[0]._uIsUV == 1) {
            uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, g_GLPartSet._arrPartSet[index]._arrPartLODData[0]._arrVertexUV, gl.STATIC_DRAW);
        }
        // 创建一个IBO
        let ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g_GLPartSet._arrPartSet[index]._arrPartLODData[0]._arrIndex, gl.STATIC_DRAW);
        // 存值
        g_webglControl.m_arrPartVertexPosition_VBOs[index] = posBuffer;
        g_webglControl.m_arrPartVertexNormal_VBOs[index] = normalBuffer;
        g_webglControl.m_arrPartVertexUV_VBOs[index] = uvBuffer;
        g_webglControl.m_arrPartVertex_IBOs[index] = ibo;
    }

    this.clearVertexVBO_webgl1 = function() {
        // 清除顶点缓存数据
        for (let i = 0; i < g_webglControl.m_arrPartVertexPosition_VBOs.length; i++) {
            if (g_webglControl.m_arrPartVertexPosition_VBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPartVertexPosition_VBOs[i]);
            }
        }
        for (let i = 0; i < g_webglControl.m_arrPartVertexNormal_VBOs.length; i++) {
            if (g_webglControl.m_arrPartVertexNormal_VBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPartVertexNormal_VBOs[i]);
            }
        }
        for (let i = 0; i < g_webglControl.m_arrPartVertexUV_VBOs.length; i++) {
            if (g_webglControl.m_arrPartVertexUV_VBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPartVertexUV_VBOs[i]);
            }
        }
        for (let i = 0; i < g_webglControl.m_arrPartVertex_IBOs.length; i++) {
            if (g_webglControl.m_arrPartVertex_IBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPartVertex_IBOs[i]);
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
    BASEPROGRAMINFO = initBaseProgramInfo(gl);

    this.MMatrix = mat4.create();
    this.PVMattrix = mat4.create();
    this.MVPMatrix = mat4.create();

    this.clipPlaneParam = new Array(3);

    this.dynamicBuffer = null;
    this.dynamicBufLength = 0;
    this.isDisplayDynamic = true;

    this.initScene = function() {
        this.setBgVAO();
        this.initGLConfig();
    }

    this.uninitScene = function() {
        this.clearVertexVAOs();
        this.clearBoxVAO();
        this.clearTextures();
        this.clearBgVAO();
        this.uninitGeom();
        this.clearBaseSceneVAOs();
    }

    this.resetScene = function() {
    }

    this.clearScene = function() {
        this.clearVertexVAOs();
        this.clearBoxVAO();
        this.clearTextures();
        this.uninitGeom();
    }

    this.initGeom = function() {
        if (g_webglControl.isContainsGeom) {
            this.setGeomSurfaceVAO();
            this.setGeomCurveVAO();
        }
    }

    this.uninitGeom = function() {
        if (g_webglControl.isContainsGeom) {
            this.clearGeomSurfaceVAO();
            this.clearGeomCurveVAO();
        }
    }

    this.initSection = function() {
        let buffer = null;
        let clipPlaneData = null;

        for (let i = 0; i < g_sceneSection.arrClipPlanes.length; i++) {
            clipPlaneData = g_sceneSection.arrClipPlanes[i];

            buffer = this.setBaseVAO(clipPlaneData.arrVertex, NUM_VERTEX);
            g_webglControl.m_arrClipPlaneVBOs.push(buffer.VBO);
            g_webglControl.m_arrClipPlaneVAOs.push(buffer.VAO);
        }

        g_webglControl.m_arrDynamicContour_VAOs = new Array(g_sceneSection.arrClipPlanes.length);
        g_webglControl.m_arrDynamicContour_VBOs = new Array (g_sceneSection.arrClipPlanes.length);
        g_webglControl.m_arrDynamicContourVertexNum = new Array(g_sceneSection.arrClipPlanes.length);
        g_webglControl.m_arrDynamicFacet_VAOs = new Array(g_sceneSection.arrClipPlanes.length);
        g_webglControl.m_arrDynamicFacet_VBOs = new Array(g_sceneSection.arrClipPlanes.length);
        g_webglControl.m_arrDynamicFacetVertexNum = new Array(g_sceneSection.arrClipPlanes.length);
    }

    this.updateSection = function() {
        let clipElemData = null;
        let contourBuffer = null;
        let facetBuffer = null;

        for (let i = 0; i < g_sceneSection.arrClipPlanes.length; i++) {
            clipElemData = g_sceneSection.arrClipPlanes[i].arrSecPlaneElemDataInfo;
            if (clipElemData == null || clipElemData.length <= 0) {
                this.clearSectionByClipIndex(i);
            } else {
                let arrClipContourVAO = new Array(clipElemData.length);
                let arrClipContourVBO = new Array(clipElemData.length);
                let arrClipContourVertexNum = new Array(clipElemData.length);
                let arrClipFacetVAO = new Array(clipElemData.length);
                let arrClipFacetVBO = new Array(clipElemData.length);
                let arrClipFacetVertexNum = new Array(clipElemData.length);

                for (let j = 0; j < clipElemData.length; ++j) {
                    contourBuffer = this.setDynamicContourVBO(arrClipContourVAO[j], arrClipContourVBO[j], clipElemData[j].infoContour);
                    arrClipContourVAO[j] = contourBuffer.VAO;
                    arrClipContourVBO[j] = contourBuffer.VBO;
                    let arrIndexNum = new Array();
                    for (let k = 0; k < clipElemData[j].infoContour._arrIndexData.length; ++k) {
                        arrIndexNum.push(clipElemData[j].infoContour._arrIndexData[k].length);
                    }
                    arrClipContourVertexNum[j] = arrIndexNum;

                    facetBuffer = this.setDynamicFacetVBO(arrClipFacetVAO[j], arrClipFacetVBO[j], clipElemData[j].mdlSection);
                    arrClipFacetVAO[j] = facetBuffer.VAO;
                    arrClipFacetVBO[j] = facetBuffer.VBO;
                    arrClipFacetVertexNum[j] = clipElemData[j].mdlSection._arrIndexData.length;
                }

                g_webglControl.m_arrDynamicContour_VAOs[i] = (arrClipContourVAO);
                g_webglControl.m_arrDynamicContour_VBOs[i] = (arrClipContourVBO);
                g_webglControl.m_arrDynamicContourVertexNum[i] = (arrClipContourVertexNum);
                g_webglControl.m_arrDynamicFacet_VAOs[i] = arrClipFacetVAO;
                g_webglControl.m_arrDynamicFacet_VBOs[i] = arrClipFacetVBO;
                g_webglControl.m_arrDynamicFacetVertexNum[i] = arrClipFacetVertexNum;
            }
        }
    }

    this.uninitSection = function() {
        this.clearClipPlaneVAO();
        for (let i = 0; i < g_sceneSection.arrClipPlanes.length; i++) {
            this.clearSectionByClipIndex(i);
        }
        g_webglControl.m_arrDynamicContour_VAOs.splice(0, g_webglControl.m_arrDynamicContour_VAOs.length);
        g_webglControl.m_arrDynamicContour_VBOs.splice(0, g_webglControl.m_arrDynamicContour_VBOs.length);
        g_webglControl.m_arrDynamicContourVertexNum.splice(0, g_webglControl.m_arrDynamicContourVertexNum.length);
        g_webglControl.m_arrDynamicFacet_VAOs.splice(0, g_webglControl.m_arrDynamicFacet_VAOs.length);
        g_webglControl.m_arrDynamicFacet_VBOs.splice(0, g_webglControl.m_arrDynamicFacet_VBOs.length);
        g_webglControl.m_arrDynamicFacetVertexNum.splice(0, g_webglControl.m_arrDynamicFacetVertexNum.length);
    }

    this.clearSectionByClipIndex = function(i) {
        if (g_webglControl.m_arrDynamicContour_VAOs[i] == null ||
            g_webglControl.m_arrDynamicFacet_VAOs[i] == null) {
            return;
        }
        for (let j = 0; j < g_webglControl.m_arrDynamicContour_VAOs[i].length; ++j) {
            if (g_webglControl.m_arrDynamicContour_VAOs[i][j] != null) {
                gl.deleteVertexArray(g_webglControl.m_arrDynamicContour_VAOs[i][j]);
            }
            if (g_webglControl.m_arrDynamicContour_VBOs[i][j] != null) {
                gl.deleteBuffer(g_webglControl.m_arrDynamicContour_VBOs[i][j]);
            }
        }
        for (let j = 0; j < g_webglControl.m_arrDynamicFacet_VAOs[i].length; ++j) {
            if (g_webglControl.m_arrDynamicFacet_VAOs[i][j] != null) {
                gl.deleteVertexArray(g_webglControl.m_arrDynamicFacet_VAOs[i][j]);
            }
            if (g_webglControl.m_arrDynamicFacet_VBOs[i][j] != null) {
                gl.deleteBuffer(g_webglControl.m_arrDynamicFacet_VBOs[i][j]);
            }
        }

        g_webglControl.m_arrDynamicContour_VAOs[i].splice(0, g_webglControl.m_arrDynamicContour_VAOs[i].length);
        g_webglControl.m_arrDynamicContour_VBOs[i].splice(0, g_webglControl.m_arrDynamicContour_VBOs[i].length);
        g_webglControl.m_arrDynamicContourVertexNum[i].splice(0, g_webglControl.m_arrDynamicContourVertexNum[i].length);
        g_webglControl.m_arrDynamicFacet_VAOs[i].splice(0, g_webglControl.m_arrDynamicFacet_VAOs[i].length);
        g_webglControl.m_arrDynamicFacet_VBOs[i].splice(0, g_webglControl.m_arrDynamicFacet_VBOs.length);
        g_webglControl.m_arrDynamicFacetVertexNum[i].splice(0, g_webglControl.m_arrDynamicFacetVertexNum[i].length);
        g_webglControl.m_arrDynamicContour_VAOs[i] = null;
        g_webglControl.m_arrDynamicContour_VBOs[i] = null;
        g_webglControl.m_arrDynamicContourVertexNum[i] = null;
        g_webglControl.m_arrDynamicFacet_VAOs[i] = null;
        g_webglControl.m_arrDynamicFacet_VBOs[i] = null;
        g_webglControl.m_arrDynamicFacetVertexNum[i] = null;
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
        // 设置线宽
        // gl.lineWidth(3.0);
    }

    this.updatePartData = function(index) {
        this.setPartVertexVAOByIndex(index);
        this.setBoxVAOByIndex(index);
    }

    this.updateSecOpeToolData = function(data) {
        let baseBuffer = this.setBaseIndexVAO(data._arrVertexPosition, data._arrIndex, NUM_VERTEX);
        g_webglControl.m_arrBaseScene_VAOs.push(baseBuffer.VAO);
        g_webglControl.m_arrBaseScene_VBOs.push(baseBuffer.VBO);
        g_webglControl.m_arrBaseScene_IBOs.push(baseBuffer.IBO);
        g_webglControl.m_arrBaseSceneVertextNum.push(data._arrIndex.length);
    }

    
    this.initPmi = function() {

    }

    this.updatePmiData = function() {
        let pmiBuffer = null;
        for(let i in g_GLPmiSet.arrPmi) {
            pmiBuffer = this.setBaseIndexVAO(g_GLPmiSet.arrPmi[i].arrFacetVertex,
                g_GLPmiSet.arrPmi[i].arrFacetIndex, NUM_VERTEX);
            g_webglControl.m_arrPmiSymbol_VAOs.push(pmiBuffer.VAO);
            g_webglControl.m_arrPmiSymbol_VBOs.push(pmiBuffer.VBO);
            g_webglControl.m_arrPmiSymbol_IBOs.push(pmiBuffer.IBO);

            pmiBuffer = this.setLineVAO(g_GLPmiSet.arrPmi[i].arrWiresVertex, NUM_VERTEX);
            g_webglControl.m_arrPmiWire_VAOs.push(pmiBuffer.VAO);
            g_webglControl.m_arrPmiWire_VBOs.push(pmiBuffer.VBO);
            g_webglControl.m_arrPmiWire_IBOs.push(pmiBuffer.IBO);
        }
    }

    this.uninitPmiData = function() {
        for (let i = 0; i < g_webglControl.m_arrPmiSymbol_VAOs.length; i++) {
            if (g_webglControl.m_arrPmiSymbol_VAOs[i] != null) {
                gl.deleteVertexArray(g_webglControl.m_arrPmiSymbol_VAOs[i]);
            }
            if (g_webglControl.m_arrPmiSymbol_VBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPmiSymbol_VBOs[i]);
            }
            if (g_webglControl.m_arrPmiSymbol_IBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPmiSymbol_IBOs[i]);
            }
        }
        g_webglControl.m_arrPmiSymbol_VAOs.splice(0, g_webglControl.m_arrPmiSymbol_VAOs.length);
        g_webglControl.m_arrPmiSymbol_VBOs.splice(0, g_webglControl.m_arrPmiSymbol_VBOs.length);
        g_webglControl.m_arrPmiSymbol_IBOs.splice(0, g_webglControl.m_arrPmiSymbol_IBOs.length);

        for (let i = 0; i < g_webglControl.m_arrPmiWire_VAOs.length; ++i) {
            if (g_webglControl.m_arrPmiWire_VAOs[i] != null) {
                gl.deleteVertexArray(g_webglControl.m_arrPmiWire_VAOs[i]);
            }
            if (g_webglControl.m_arrPmiWire_VBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPmiWire_VBOs[i]);
            }
            if (g_webglControl.m_arrPmiWire_IBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPmiWire_IBOs[i]);
            }
        }
        g_webglControl.m_arrPmiWire_VAOs.splice(0, g_webglControl.m_arrPmiWire_VAOs.length);
        g_webglControl.m_arrPmiWire_VBOs.splice(0, g_webglControl.m_arrPmiWire_VBOs.length);
        g_webglControl.m_arrPmiWire_IBOs.splice(0, g_webglControl.m_arrPmiWire_IBOs.length);
    }

    /**
     * 绘制图形
     */
     this.draw = function() {
        // Clear the canvas before we start drawing on it.
        if (!g_canvasTransparency) {
            gl.clearColor(g_webglControl.m_BgColor.x, g_webglControl.m_BgColor.y, g_webglControl.m_BgColor.z, 1.0);  // Clear to black, fully opaque
        }
        gl.clearDepth(1.0);                 // Clear everything
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 绘制背景图片
        if (g_webglControl.isShowImageBk) {
            gl.useProgram(PICTUREPROGRAMINFO.program);
            this.drawBackground();
        }

        // 绘制零件
        gl.useProgram(SOLIDPROGRAMINFO.program);
        mat4.multiply(this.PVMattrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        this.drawObjectArray();

        // 绘制剖切面
        if (g_webglControl.isSectionOn) {
            this.drawClipFacet();
        }
        
        // 绘制零件实例包围盒
        gl.useProgram(LINEPROGRAMINFO.program);
        if (g_webglControl.isPicked && g_webglControl.isShowBox) {
            this.drawBox();
        }

        // 绘制精确几何数据
        if (g_webglControl.isContainsGeom && g_webglControl.isShowGeomtry) {
            this.drawObjectGeomArray();
        }

        // 绘制剖切轮廓线
        if (g_webglControl.isSectionOn) {
            this.drawClipContours();
        }

        // 绘制pmi线框
        if (g_webglControl.isPmiOn) {
            this.drawPmiWires();
        }

        // 绘制剖切平面和工具
        gl.useProgram(BASEPROGRAMINFO.program);
        if (g_webglControl.isSectionOn) {
            this.drawClipPlane();
            if (g_sceneSection.isSecToolsInit) {
                this.drawClipOpeTool();
            }
        }

        // 绘制pmi文字信息
        if (g_webglControl.isPmiOn) {
            gl.enable(gl.POLYGON_OFFSET_FILL);
            gl.polygonOffset(-1, -1);
            this.drawPmiSymbols();
            gl.disable(gl.POLYGON_OFFSET_FILL);
        }
    }

    this.drawObjectArray = function() {
        if (g_webglControl.isSectionOn) {
            this.setClipPlaneParams();
        } else {
            this.disableClipPlaneParams();
        }
    
        gl.uniform3f(SOLIDPROGRAMINFO.uniformLocations.eyeLocation, g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.VMatrix, false, g_camera.viewMatrix);
        gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.lightType, g_webglControl.vecLightType[0]);
        gl.uniform3f(SOLIDPROGRAMINFO.uniformLocations.lightLocation,
            g_webglControl.ptLightPosition.x, g_webglControl.ptLightPosition.y, g_webglControl.ptLightPosition.z);

        // 绘制全不透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_NO) {
                let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
        // 绘制部分透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_PART) {
                let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
        // 绘制全透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_ALL) {
                let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (g_GLPartSet._arrPartSet[uCurPartIndex]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
    }

    /**
     * 绘制零件实例
     */
    this.drawObjectTriangles = function(objectIndex) {
        let partIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        let mesh = g_GLPartSet._arrPartSet[partIndex]._arrPartLODData[0];
        if (g_webglControl.m_arrPartVertex_VAOs[partIndex] == null) {
            return;
        }
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        this.setObjectClipStatus(objectIndex);

        // 获取Object透明度
        let objectTrans = g_webglControl.m_arrObjectTransparent[objectIndex];
        if (objectTrans <= GL_ZERO) {
            return;
        }
        // 正向面定义模式
        if (g_webglControl.enbaleCullFace && g_GLObjectSet._arrObjectSet[objectIndex]._nCullMode != ADFCULL_NONE) {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
        } else {
            gl.disable(gl.CULL_FACE);
        }
        // 同一个object矩阵相同
        mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.MMatrix, false, this.MMatrix);
        // 同一个Object的不同Surface材质不同
        gl.bindVertexArray(g_webglControl.m_arrPartVertex_VAOs[partIndex]);
        let offset = 0;
        for (let j = 0; j < g_webglControl.m_arrObjectMeshVAOUint[objectIndex].length; j++) {
            for (let s = 0; s < g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].splitSize; ++s) {
                // 材质数据
                let curMaterial = g_webglControl.GetObjectShowMaterial(objectIndex, j, s);
                g_webglControl.setShaderMaterial(curMaterial, objectTrans);
                gl.drawElements(gl.TRIANGLES, g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].arrVertexCounts[s], mesh._uEleType, offset);
                offset += g_webglControl.m_arrObjectMeshVAOUint[objectIndex][j].arrVertexCounts[s] * mesh._uEleSize;
            }
        }
    }

    this.drawObjectLines = function(objectIndex) {
        let partIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        if (g_webglControl.m_arrPartVertex_VAOs[partIndex] == null) {
            return;
        }     
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(LINEPROGRAMINFO.program);
        mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
        gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        let materialIndex = g_webglControl.m_arrObjectMeshVAOUint[objectIndex][0].uintMaterialIndex;
        let curMaterial = null;
        if (materialIndex == -1) {
            curMaterial = g_webglControl.defaultMaterial;
        } else {
            curMaterial = g_GLMaterialSet._arrMaterialSet[materialIndex];
        }
        gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor,
                    curMaterial._MtlData._mtlPhysics.vEmissive.x,
                    curMaterial._MtlData._mtlPhysics.vEmissive.y,
                    curMaterial._MtlData._mtlPhysics.vEmissive.z);        
        gl.bindVertexArray(g_webglControl.m_arrPartVertex_VAOs[partIndex]);
        gl.drawElements(gl.LINES, g_webglControl.m_arrObjectMeshVAOUint[objectIndex][0].uintVertexNum, gl.UNSIGNED_SHORT, 0);
    }

    this.drawBox = function() {
        for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                let nPickPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                if (g_webglControl.m_arrPartBox_VAOs[nPickPartIndex] == null) {
                    return;
                }
                gl.lineWidth(3.0);
                mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[i]);
                mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
                gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
                gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 1.0, 1.0, 0.0);
                gl.bindVertexArray(g_webglControl.m_arrPartBox_VAOs[nPickPartIndex]);
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

        mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
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

    this.drawClipPlane = function() {
        let clipMat = null;
        for (let j = 0; j < g_webglControl.m_arrClipPlaneVAOs.length; j++) {
            if (!g_sceneSection.arrClipPlaneEnable[j] || !g_sceneSection.getVisibleClipping(j)) {
                continue;
            }
            clipMat = g_sceneSection.arrClipPlanes[j].getFakeClipPlaneMatrix(g_webglControl.m_clipMatrix);
            mat4.multiply(this.MVPMatrix, this.PVMattrix, clipMat);
            gl.uniformMatrix4fv(BASEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
            gl.bindVertexArray(g_webglControl.m_arrClipPlaneVAOs[j]);
            let curMaterial = g_sceneSection.getPlaneMaterial(j);
            gl.uniform4f(BASEPROGRAMINFO.uniformLocations.materialEmissive,
                curMaterial._MtlData._mtlPhysics.vEmissive.x,
                curMaterial._MtlData._mtlPhysics.vEmissive.y,
                curMaterial._MtlData._mtlPhysics.vEmissive.z,
                curMaterial._MtlData._mtlPhysics.vEmissive.w);
            gl.drawArrays(gl.TRIANGLES, 0, g_sceneSection.arrClipPlanes[j].vertexCount);
        }
    }

    this.drawClipOpeTool = function() {
        gl.disable(gl.CULL_FACE);
        let clipMat = null;
        for (let j = 0; j < g_webglControl.m_arrClipPlaneVAOs.length; j++) {
            if (!g_sceneSection.arrClipPlaneEnable[j] || !g_sceneSection.getVisibleClipping(j) ||
                !g_sceneSection.arrClipPlanePicked[j]) {
                continue;
            }

            clipMat = g_sceneSection.arrClipPlanes[j].getFakeClipPlaneMatrix(g_webglControl.m_clipMatrix);
            for (let i = 0; i < g_sceneSection.m_operatorTool.m_arrOpeObjMatrix.length; ++i) {
                let secOpeObj = g_sceneSection.m_operatorTool.m_arrOpeObjects[i];
                let secPartIndex = secOpeObj.partIndex;
                mat4.multiply(this.MMatrix, clipMat, g_sceneSection.m_operatorTool.m_arrOpeObjMatrix[i]);
                mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
                gl.uniformMatrix4fv(BASEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
                gl.bindVertexArray(g_webglControl.m_arrBaseScene_VAOs[secPartIndex]);
                // 材质数据
                gl.uniform4f(BASEPROGRAMINFO.uniformLocations.materialEmissive,
                    secOpeObj.material._MtlData._mtlPhysics.vAmbient.x,
                    secOpeObj.material._MtlData._mtlPhysics.vAmbient.y,
                    secOpeObj.material._MtlData._mtlPhysics.vAmbient.z,
                    secOpeObj.transparent);
                gl.drawElements(gl.TRIANGLES, g_webglControl.m_arrBaseSceneVertextNum[secPartIndex], gl.UNSIGNED_SHORT, 0);
            }
        }
    }

    this.drawClipContours = function() {
        this.setClipPlaneParamsLine();
        gl.lineWidth(3.0);
        mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_dynamicObjMatrix);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
        gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MMatrix, false, this.MMatrix);
        gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 1.0, 1.0, 0.0);
        for (let i = 0; i < g_webglControl.m_arrDynamicContour_VAOs.length; i++) {
            if (!this.isDisplayDynamic || !g_sceneSection.arrClipPlaneEnable[i] || g_webglControl.m_arrDynamicContour_VAOs[i] == null) {
                continue;
            }
            this.setLineClipStatus(i);
            for (let j = 0; j < g_webglControl.m_arrDynamicContour_VAOs[i].length; ++j) {
                if (g_webglControl.m_arrDynamicContour_VAOs[i][j] == null) {
                    continue;
                }
                gl.bindVertexArray(g_webglControl.m_arrDynamicContour_VAOs[i][j]);
                let offset = 0;
                for (let k = 0; k < g_webglControl.m_arrDynamicContourVertexNum[i][j].length; ++k) {
                    gl.drawArrays(gl.LINE_LOOP, offset, g_webglControl.m_arrDynamicContourVertexNum[i][j][k]-1);
                    offset += (g_webglControl.m_arrDynamicContourVertexNum[i][j][k]-1);
                }
            }
        }
    }

    this.drawClipFacet = function() {
        gl.disable(gl.CULL_FACE);
        mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_dynamicObjMatrix);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.MMatrix, false, this.MMatrix);
        let curMaterial = null;
        let curMtlIndex = -1;

        for (let i = 0; i < g_webglControl.m_arrDynamicFacet_VAOs.length; i++) {
            if (!this.isDisplayDynamic || !g_sceneSection.arrClipPlaneEnable[i] || g_webglControl.m_arrDynamicFacet_VAOs[i] == null) {
                continue;
            }
            this.setFacetClipStatus(i);
            for (let j = 0; j < g_webglControl.m_arrDynamicFacet_VAOs[i].length; ++j) {
                if (g_webglControl.m_arrDynamicFacet_VAOs[i][j] == null ||
                    g_sceneSection.arrClipPlanes[i].arrSecPlaneElemDataInfo[j] == null) {
                    continue;
                }
                
                curMtlIndex = g_sceneSection.arrClipPlanes[i].arrSecPlaneElemDataInfo[j].uSectionMtlIndex;
                if (curMtlIndex < 0) {
                    curMaterial = g_webglControl.defaultMaterial;
                } else {
                    curMaterial = g_GLMaterialSet._arrMaterialSet[curMtlIndex];
                }
                g_webglControl.setShaderMaterial(curMaterial, 1.0);
                gl.bindVertexArray(g_webglControl.m_arrDynamicFacet_VAOs[i][j]);
                // 材质数据
                gl.drawArrays(gl.TRIANGLES, 0, g_webglControl.m_arrDynamicFacetVertexNum[i][j]);
            }
        }
    }

    this.drawPmiSymbols = function() {
        gl.disable(gl.CULL_FACE);
        let pmiMat = null;
        let anno = null;
        let offset = 0;

        for (let j = 0; j < g_webglControl.m_arrPmiSymbol_VAOs.length; j++) {
            pmiMat = g_GLPmiSet.arrPmi[j].matWorld;
            if (pmiMat == null) {
                continue;
            }
            mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, pmiMat);
            mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
            gl.uniformMatrix4fv(BASEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
            gl.bindVertexArray(g_webglControl.m_arrPmiSymbol_VAOs[j]);

            anno = g_GLPmiSet.arrPmi[j].arrPmiItem;
            offset = 0;
            for (let i = 0; i < anno.length; ++i) {
                if (!g_scenePmiManager.m_arrPmiItemVisible[j][i]) {
                    offset += anno[i].symbolVertexNum * 2;
                    continue;
                }

                if (g_scenePmiManager.m_arrPmiItemPicked[j][i]) {
                    gl.uniform4f(BASEPROGRAMINFO.uniformLocations.materialEmissive,
                        g_scenePmiManager.pickedMaterial.x,
                        g_scenePmiManager.pickedMaterial.y,
                        g_scenePmiManager.pickedMaterial.z,
                        g_scenePmiManager.pickedMaterial.w);
                    
                } else {
                    gl.uniform4f(BASEPROGRAMINFO.uniformLocations.materialEmissive,
                        g_scenePmiManager.defaultMaterial.x,
                        g_scenePmiManager.defaultMaterial.y,
                        g_scenePmiManager.defaultMaterial.z,
                        g_scenePmiManager.defaultMaterial.w);
                }
                gl.drawElements(gl.TRIANGLES, anno[i].symbolVertexNum, gl.UNSIGNED_SHORT, offset);
                offset += anno[i].symbolVertexNum * 2;
            }
        }
    }

    this.drawPmiWires = function() {
        let pmiMat = null;
        let anno = null;
        let offset = 0;

        for (let j = 0; j < g_webglControl.m_arrPmiSymbol_VAOs.length; j++) {
            pmiMat = g_GLPmiSet.arrPmi[j].matWorld;
            if (pmiMat == null) {
                continue;
            }
            mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, pmiMat);
            mat4.multiply(this.MVPMatrix, this.PVMattrix, this.MMatrix);
            gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
            gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MMatrix, false, this.MMatrix);
            gl.bindVertexArray(g_webglControl.m_arrPmiWire_VAOs[j]);

            anno = g_GLPmiSet.arrPmi[j].arrPmiItem;
            offset = 0;
            for (let i = 0; i < anno.length; ++i) {
                if (!g_scenePmiManager.m_arrPmiItemVisible[j][i]) {
                    offset += anno[i].wiresVertexNum;
                    continue;
                }
                if (g_scenePmiManager.m_arrPmiItemPicked[j][i]) {
                    gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor,
                        g_scenePmiManager.pickedMaterial.x,
                        g_scenePmiManager.pickedMaterial.y,
                        g_scenePmiManager.pickedMaterial.z);
                } else {
                    gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor,
                        g_scenePmiManager.defaultMaterial.x,
                        g_scenePmiManager.defaultMaterial.y,
                        g_scenePmiManager.defaultMaterial.z);
                }
                gl.drawArrays(gl.LINES, offset, anno[i].wiresVertexNum);
                offset += anno[i].wiresVertexNum;
            }
        }
    }

    /**
     * 生成GPU缓存数据
     */
     this.setPartVertexVAOByIndex = function(index) {
        let partBuffer = null;
        if (g_GLPartSet._arrPartSet[index]._uPrimitType == ADFPT_TRIANGLELIST) {
            partBuffer = this.setSubsetSurfaceVAO(index);
        } else {
            partBuffer = this.setSubsetCurveVAO(index);
        }
        g_webglControl.m_arrPartVertex_VAOs[index] = partBuffer.VAO;
        g_webglControl.m_arrPartVertexPosition_VBOs[index] = partBuffer.POS_VBO;
        g_webglControl.m_arrPartVertexNormal_VBOs[index] = partBuffer.NOR_VBO;
        g_webglControl.m_arrPartVertexUV_VBOs[index] = partBuffer.UV_VBO;
        g_webglControl.m_arrPartVertex_IBOs[index] = partBuffer.IBO;
    }

    this.clearVertexVAOs = function() {
        // 清除顶点缓存数据
        for (let i = 0; i < g_webglControl.m_arrPartVertex_VAOs.length; i++) {
            if (g_webglControl.m_arrPartVertex_VAOs[i] != null) {
                gl.deleteVertexArray(g_webglControl.m_arrPartVertex_VAOs[i]);
            }
        }
        for (let i = 0; i < g_webglControl.m_arrPartVertexPosition_VBOs.length; i++) {
            if (g_webglControl.m_arrPartVertexPosition_VBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPartVertexPosition_VBOs[i]);
            }
        }
        for (let i = 0; i < g_webglControl.m_arrPartVertexNormal_VBOs.length; i++) {
            if (g_webglControl.m_arrPartVertexNormal_VBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPartVertexNormal_VBOs[i]);
            }
        }for (let i = 0; i < g_webglControl.m_arrPartVertexUV_VBOs.length; i++) {
            if (g_webglControl.m_arrPartVertexUV_VBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPartVertexUV_VBOs[i]);
            }
        }
        for (let i = 0; i < g_webglControl.m_arrPartVertex_IBOs.length; ++i) {
            if (g_webglControl.m_arrPartVertex_IBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPartVertex_IBOs[i]);
            }
        }
    }

    this.setBgVAO = function() {
        g_webglControl.m_BgColor.set(0.313, 0.357, 0.467);
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

    this.setBoxVAOByIndex = function(index) {
        let buffer = null;
        g_webglControl.setBoxLines(index);
        buffer = this.setLineVAO(new Float32Array(g_webglControl.m_arrBoxLines), NUM_VERTEX);
        g_webglControl.m_arrPartBox_VBOs[index] = buffer.VBO;
        g_webglControl.m_arrPartBox_VAOs[index] = buffer.VAO;
    }

    this.clearBoxVAO = function() {
        for (let i = 0; i < g_webglControl.m_arrPartBox_VAOs.length; i++) {
            if (g_webglControl.m_arrPartBox_VAOs[i] != null) {
                gl.deleteVertexArray(g_webglControl.m_arrPartBox_VAOs[i]);
            }
        }

        for (let i = 0; i < g_webglControl.m_arrPartBox_VBOs.length; i++) {
            if (g_webglControl.m_arrPartBox_VBOs[i] != null) {
                gl.deleteBuffer(g_webglControl.m_arrPartBox_VBOs[i]);
            }
        }
    }

    this.setSubsetSurfaceVAO = function(uPartIndex) {
        let vertexPosition = g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertexPosition;
        let vertexNormal = g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertexNormal;
        let vertexUV = g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertexUV;
        let posBuffer = null;
        let normalBuffer = null;
        let uvBuffer = null;
        // 创建一个VAO
        let VAOArray = gl.createVertexArray();
        gl.bindVertexArray(VAOArray);
        // 创建顶点VBO
        posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexPosition, gl.STATIC_DRAW);
        gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexPosition);
        // 创建法矢VBO
        normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexNormal, gl.STATIC_DRAW);
        gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexVector, NUM_VECTOR, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexVector);
        // 创建贴图VBO
        if (g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
            uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexUV, gl.STATIC_DRAW);
            gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexUV, NUM_UV, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexUV);
        }
        // 创建一个IBO
        let ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrIndex, gl.STATIC_DRAW);
        // 存值
        return {
            VAO: VAOArray,
            POS_VBO: posBuffer,
            NOR_VBO: normalBuffer,
            UV_VBO: uvBuffer,
            IBO: ibo,
        };
    }

    this.setSubsetCurveVAO = function(uPartIndex) {
        return this.setLineIndexVAO(g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertexPosition,
            g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrIndex, 0);
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
        let buffer = null;
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            if (g_GLPartSet._arrPartSet[i]._SurfaceShape == null) {
                g_webglControl.m_arrPartGeomSurface_VAOs.push(-1);
                g_webglControl.m_arrPartGeomSurface_VBOs.push(-1);
                continue;
            }

            buffer = this.setLineVAO(new Float32Array(g_GLPartSet._arrPartSet[i]._SurfaceShape._arrShapeOfPoints), NUM_VERTEX);
            g_webglControl.m_arrPartGeomSurface_VAOs.push(buffer.VAO);
            g_webglControl.m_arrPartGeomSurface_VBOs.push(buffer.VBO);
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
        let buffer = null;
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            if (g_GLPartSet._arrPartSet[i]._CurveShape == null ||
                g_GLPartSet._arrPartSet[i]._CurveShape._arrShapeOfPoints.length == 0) {
                g_webglControl.m_arrPartGeomCurve_VAOs.push(-1);
                g_webglControl.m_arrPartGeomCurve_VBOs.push(-1);
                continue;
            }

            buffer = this.setLineVAO(new Float32Array(g_GLPartSet._arrPartSet[i]._CurveShape._arrShapeOfPoints), NUM_VERTEX);
            g_webglControl.m_arrPartGeomCurve_VAOs.push(buffer.VAO);
            g_webglControl.m_arrPartGeomCurve_VBOs.push(buffer.VBO);
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

    this.setLineVAO = function(arrVertex, dataCount) {
        let nVAOId = -1;
        nVAOId = gl.createVertexArray();
        gl.bindVertexArray(nVAOId);
        let nVBOId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
        // 建立显存缓存
        gl.bufferData(gl.ARRAY_BUFFER, arrVertex, gl.STATIC_DRAW);
        gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, dataCount*4, 0);
        gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);

        return {
            VAO: nVAOId,
            VBO: nVBOId,
        };
    }

    this.setLineIndexVAO = function(arrVertex, arrIndex, dataCount) {
        // 创建一个VAO
        let VAOArray = -1;
        VAOArray = gl.createVertexArray();
        gl.bindVertexArray(VAOArray);
        // 创建一个VBO
        let posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, arrVertex, gl.STATIC_DRAW);
        // 绑定缓存区数据
        gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, dataCount, 0);
        gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
        // 创建一个IBO
        let ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrIndex, gl.STATIC_DRAW);
        // 存值
        return {
            VAO: VAOArray,
            POS_VBO: posBuffer,
            NOR_VBO: null,
            UV_VBO: null,
            IBO: ibo,
        };
    }

    this.setBaseVAO = function(arrVertex, dataCount) {
        // 创建剖切平面VAO缓存
        let nVAOId = -1;
        nVAOId = gl.createVertexArray();
        gl.bindVertexArray(nVAOId);
        let nVBOId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
        // 建立显存缓存
        gl.bufferData(gl.ARRAY_BUFFER, arrVertex, gl.STATIC_DRAW);
        gl.vertexAttribPointer(BASEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, dataCount*4, 0);
        gl.enableVertexAttribArray(BASEPROGRAMINFO.attribLocations.vertexPosition);

        return {
            VAO: nVAOId,
            VBO: nVBOId,
        };
    }

    this.clearClipPlaneVAO = function() {
        for (let i = 0; i < g_webglControl.m_arrClipPlaneVAOs.length; i++) {
            if (g_webglControl.m_arrClipPlaneVAOs[i] != -1) {
                gl.deleteVertexArray(g_webglControl.m_arrClipPlaneVAOs[i]);
            }
        }

        for (let i = 0; i < g_webglControl.m_arrClipPlaneVBOs.length; i++) {
            if (g_webglControl.m_arrClipPlaneVBOs[i] != -1) {
                gl.deleteBuffer(g_webglControl.m_arrClipPlaneVBOs[i]);
            }
        }
    }

    this.setClipPlaneParams = function() {
        if (g_sceneSection.isInitilized) {
            g_sceneSection.setClipPlaneMatrix(g_webglControl.m_clipMatrix);
            this.clipPlaneParam[0] = g_sceneSection.arrClipPlanes[0].getClipPlaneParams();
            this.clipPlaneParam[1] = g_sceneSection.arrClipPlanes[1].getClipPlaneParams();
            this.clipPlaneParam[2] = g_sceneSection.arrClipPlanes[2].getClipPlaneParams();

            gl.uniform4fv(SOLIDPROGRAMINFO.uniformLocations.clippingPlanesX, this.clipPlaneParam[0]);
            gl.uniform4fv(SOLIDPROGRAMINFO.uniformLocations.clippingPlanesY, this.clipPlaneParam[1]);
            gl.uniform4fv(SOLIDPROGRAMINFO.uniformLocations.clippingPlanesZ, this.clipPlaneParam[2]);
        }
    }

    this.setObjectClipStatus = function(objectIndex) {
        if (g_sceneSection.isInitilized) {
            let clippingX = g_sceneSection.arrClipPlaneEnable[0] && g_sceneSection.m_arrObjectClipEnable[objectIndex];
            gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.isClippingsX, clippingX);
            let clippingY = g_sceneSection.arrClipPlaneEnable[1] && g_sceneSection.m_arrObjectClipEnable[objectIndex];
            gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.isClippingsY, clippingY);
            let clippingZ = g_sceneSection.arrClipPlaneEnable[2] && g_sceneSection.m_arrObjectClipEnable[objectIndex];
            gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.isClippingsZ, clippingZ);
        }
    }

    this.disableClipPlaneParams = function() {
        gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.isClippingsX, 0);
        gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.isClippingsY, 0);
        gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.isClippingsZ, 0);
    }

    this.setClipPlaneParamsLine = function() {
        if (g_sceneSection.isInitilized) {
            gl.uniform4fv(LINEPROGRAMINFO.uniformLocations.clippingPlanesX, this.clipPlaneParam[0]);
            gl.uniform4fv(LINEPROGRAMINFO.uniformLocations.clippingPlanesY, this.clipPlaneParam[1]);
            gl.uniform4fv(LINEPROGRAMINFO.uniformLocations.clippingPlanesZ, this.clipPlaneParam[2]);

            gl.uniform1i(LINEPROGRAMINFO.uniformLocations.isClippingsX, g_sceneSection.arrClipPlaneEnable[0]);
            gl.uniform1i(LINEPROGRAMINFO.uniformLocations.isClippingsY, g_sceneSection.arrClipPlaneEnable[1]);
            gl.uniform1i(LINEPROGRAMINFO.uniformLocations.isClippingsZ, g_sceneSection.arrClipPlaneEnable[2]);
        }
    }

    this.setLineClipStatus = function(clipIndex) {
        if (g_sceneSection.isInitilized) {
            let clippingX = g_sceneSection.arrClipPlaneEnable[0] && (clipIndex != 0);
            gl.uniform1i(LINEPROGRAMINFO.uniformLocations.isClippingsX, clippingX);
            let clippingY = g_sceneSection.arrClipPlaneEnable[1] && (clipIndex != 1);
            gl.uniform1i(LINEPROGRAMINFO.uniformLocations.isClippingsY, clippingY);
            let clippingZ = g_sceneSection.arrClipPlaneEnable[2] && (clipIndex != 2);
            gl.uniform1i(LINEPROGRAMINFO.uniformLocations.isClippingsZ, clippingZ);
        }
    }

    this.setFacetClipStatus = function(clipIndex) {
        if (g_sceneSection.isInitilized) {
            let clippingX = g_sceneSection.arrClipPlaneEnable[0] && (clipIndex != 0);
            gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.isClippingsX, clippingX);
            let clippingY = g_sceneSection.arrClipPlaneEnable[1] && (clipIndex != 1);
            gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.isClippingsY, clippingY);
            let clippingZ = g_sceneSection.arrClipPlaneEnable[2] && (clipIndex != 2);
            gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.isClippingsZ, clippingZ);
        }
    }

    this.disableClipPlaneParamsLine = function() {
        gl.uniform1i(LINEPROGRAMINFO.uniformLocations.isClippingsX, 0);
        gl.uniform1i(LINEPROGRAMINFO.uniformLocations.isClippingsY, 0);
        gl.uniform1i(LINEPROGRAMINFO.uniformLocations.isClippingsZ, 0);
    }

    this.setBaseIndexVAO = function(arrVertex, arrIndex, dataCount) {
        // 创建一个VAO
        let VAOArray = gl.createVertexArray();
        gl.bindVertexArray(VAOArray);
        // 创建一个VBO
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, arrVertex, gl.STATIC_DRAW);
        // 绑定缓存区数据
        gl.vertexAttribPointer(BASEPROGRAMINFO.attribLocations.vertexPosition, dataCount, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(BASEPROGRAMINFO.attribLocations.vertexPosition);
        // 创建一个IBO
        let ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrIndex, gl.STATIC_DRAW);
        // 存值
        return {
            VAO: VAOArray,
            VBO: buffer,
            IBO: ibo,
        };
    }

    this.clearBaseSceneVAOs = function() {
        // 清除顶点缓存数据
        for (let i = 0; i < g_webglControl.m_arrBaseScene_VAOs.length; i++) {
            gl.deleteVertexArray(g_webglControl.m_arrBaseScene_VAOs[i]);
        }

        for (let i = 0; i < g_webglControl.m_arrBaseScene_VBOs.length; i++) {
            gl.deleteBuffer(g_webglControl.m_arrBaseScene_VBOs[i]);
        }
        for (let i = 0; i < g_webglControl.m_arrBaseScene_IBOs.length; ++i) {
            gl.deleteBuffer(g_webglControl.m_arrBaseScene_IBOs[i]);
        }
    }

    this.setDynamicContourVBO = function(vao, vbo, data) {
        let ret = { VAO: vao, VBO: vbo, IBO: null };
        if (data == null) {
            return ret;
        }

        // 创建一个VAO
        if (vao == null) {
            ret.VAO = gl.createVertexArray();
        }
        gl.bindVertexArray(ret.VAO);

        if (vbo == null) {
            // 创建一个VBO
            ret.VBO = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, ret.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, data._arrVertexData, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, NUM_VERTEX*4, 0);
        gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
        return ret;
    }

    this.setDynamicFacetVBO = function(vao, vbo, data) {
        let ret = { VAO: vao, VBO: vbo, IBO: null };
        if (data == null) {
            return ret;
        }

        // 创建一个VAO
        if (vao == null) {
            ret.VAO = gl.createVertexArray();
        }
        gl.bindVertexArray(ret.VAO);

        if (vbo == null) {
            // 创建一个VBO
            ret.VBO = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, ret.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, data._arrVertexData, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, DEFAULT_NOUV_STRIDE, 0);
        gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexPosition);
        gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexVector, NUM_VECTOR, gl.FLOAT, false, DEFAULT_NOUV_STRIDE, NUM_VERTEX*4);
        gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexVector);
        return ret;
    }
}
