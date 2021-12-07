// File: SceneToGLData.js

/**
 * @author wujiali
 */
 
//===================================================================================================

var RealMinPoint3 = new Point3(0, 0, 0);
var ObjectMin = new Point3(0, 0, 0);
var ObjectMax = new Point3(0, 0, 0);
var objectMat = mat4.create();

var t = 0.05;
var alpha = 0.157;
var axisLen = 10;

var prePoint = null;
var srcPoint = new Point3(0, 0, 0);
var splitPoint = new Point3(0, 0, 0);
var coordsTransMatrix = mat4.create();
var arcTransMatrix = mat4.create();
var bpCoordsTransMatrix = new ADF_BASEMATRIX();
var bpArcTransMatrix = new ADF_BASEMATRIX();

var arrAxisPoints = new Array();
var arrCirclePoints = new Array();
var arrArcPoints = new Array();
var arrLinePoints = new Array();

/**
 * 将ADFUSDK的g_sceneData数据转化为Global的WebGL数据
 * 返回：GLObjectSet    零件实例数据�?
 *      GLPartSet      零件数据�?
 *      GLMatertalSet  材质数据�?
 */
function Scene2GLData() {
    var partSet = GetSVZPartSet();
    var matertalSet = GetSVZMaterialSet();
    var objectSet = new GL_OBJECTSET();
    var modelTreeTopNode = GetModelTreeData(g_sceneData.stuObjTreeTopNode, objectSet);
    objectSet._uFrameSize = GetAnimFrameSize();
    var camera = GetAnimCameraData();
    var modelBox = getModelBox(objectSet, partSet);
    var modelLen = getModelBoxLength(modelBox);
    var modelCenter = new Point3(0, 0, 0);
    getModelBoxCenter(modelBox, modelCenter);
    var defEyePos = new Point3(0, 0, 0);
    var defUpAxis = new Point3(0, 0, 0);
    getModelDefEyePos(modelBox, defEyePos, defUpAxis);
    var annotSet = new GL_ANNOTATION();
    getAnnotationData(g_sceneData.arrComment, annotSet);
    var sceneUnit = new GL_SECNE_UNIT();
    getSceneUnit(g_sceneData.stuConfig, sceneUnit);
    // 释放内存
    g_sceneData.Clear();
    g_cleParser = null;

    return {
        GLObjectSet: objectSet,
        GLPartSet: partSet,
        GLMatertalSet: matertalSet,
        GLModelTreeNode: modelTreeTopNode,
        GLCamera: camera,
        GLModelBox: modelBox,
        GLModelLength: modelLen,
        GLModelCenter: modelCenter,
        GLDefEyePos: defEyePos,
        GLDefUpAxis: defUpAxis,
        GLAnnotData: annotSet,
        GLSceneUnit: sceneUnit,
    };
}

// 获取�?��材质数据�?
function GetSVZMaterialSet() {
    var GLMatertalSet = new GL_MATERIALSET();
    // 获取材质数据
    for (let i=0; i<g_sceneData.stuMtlSaveDataMgr._arrMtlSaveData.length; i++) {
        GLMatertalSet._arrMaterialSet.push(g_sceneData.stuMtlSaveDataMgr._arrMtlSaveData[i]);
    }
    // 设置默认材质数据
    GLMatertalSet._arrMaterialSet.push(g_materialData.Red);
    GLMatertalSet._arrMaterialSet.push(g_materialData.Brightgreen);
    GLMatertalSet._arrMaterialSet.push(g_materialData.Blue);
    GLMatertalSet._arrMaterialSet.push(g_materialData.Yellow);
    GLMatertalSet._arrMaterialSet.push(g_materialData.Pink);
    GLMatertalSet._arrMaterialSet.push(g_materialData.CyanGreen);
    GLMatertalSet._arrMaterialSet.push(g_materialData.Black);
    GLMatertalSet._arrMaterialSet.push(g_materialData.White);
    GLMatertalSet._arrMaterialSet.push(g_materialData.Grey);
    GLMatertalSet._arrMaterialSet.push(g_materialData.DarkRed);
    GLMatertalSet._arrMaterialSet.push(g_materialData.Green);
    GLMatertalSet._arrMaterialSet.push(g_materialData.DarkBlue);
    GLMatertalSet._arrMaterialSet.push(g_materialData.DarkYellow);
    GLMatertalSet._arrMaterialSet.push(g_materialData.Violet);
    GLMatertalSet._arrMaterialSet.push(g_materialData.CyanBlue);
    // 将贴图材质绑定到OpenGL
    GetTextureMtlByUrl(GLMatertalSet);

    return GLMatertalSet;
}

// 获取�?��零件数据�?
function GetSVZPartSet() {
    let GLPartSet = new GL_PARTSET();
    let uMaxLevel = 1;  // 统计量，标志LOD数据层级
    for (let i=0; i<g_sceneData.arrModelData.length; i++) {
        // 没有LOD数据
        let tempGLPart = new GL_PART();
        let tempGLPartData = GetSVZPartData(g_sceneData.arrModelData[i]._ModelInfo._stuModelData, 0, 0.0)
        tempGLPart._arrPartLODData[0] = tempGLPartData.PARTLODDATA;
        tempGLPart._SurfaceShape = tempGLPartData.PARTSURFACEDATA;
        tempGLPart._CurveShape = tempGLPartData.PARTCURVEDATA;

        GLPartSet._arrPartSet.push(tempGLPart);
    }
    return GLPartSet;
}

// 遍历模型树，每一个叶节点包含�?��物件
function GetModelTreeData(ObjectTreeNode, GLObjectSet) {
    let GLModelTreeNode = new GL_MODELTREENODE();
    // 树节点信�?
    GLModelTreeNode._uTreeNodeID = ObjectTreeNode._uTreeNodeID;
    GLModelTreeNode._strName = ObjectTreeNode._strName;
    for (let i=0; i<ObjectTreeNode._arrParamData.length; i++) {
        let nodeParameter = new GL_NODEPARAMETER();
        nodeParameter._strName = ObjectTreeNode._arrParamData[i]._strName;
        let strParameterValue;
        switch (ObjectTreeNode._arrParamData[i]._stuValue._nType) {
            case ADF_PARAMT_INT:
                strParameterValue = ObjectTreeNode._arrParamData[i]._stuValue._nValue.toString();
                break;
            case ADF_PARAMT_FLOAT:
                strParameterValue = ObjectTreeNode._arrParamData[i]._stuValue._fValue.toString();
                break;
            case ADF_PARAMT_DOUBLE:
                strParameterValue = ObjectTreeNode._arrParamData[i]._stuValue._dValue.toString();
                break;
            case ADF_PARAMT_FLOAT3:
                strParameterValue = ObjectTreeNode._arrParamData[i]._stuValue._vFloat3Value.x.toString() + " "
                                    + ObjectTreeNode._arrParamData[i]._stuValue._vFloat3Value.y.toString() + " "
                                    + ObjectTreeNode._arrParamData[i]._stuValue._vFloat3Value.z.toString();
                break;
            case ADF_PARAMT_DOUBLE3:
                strParameterValue = ObjectTreeNode._arrParamData[i]._stuValue._vDouble3Value.x.toString() + " "
                                    + ObjectTreeNode._arrParamData[i]._stuValue._vDouble3Value.y.toString() + " "
                                    + ObjectTreeNode._arrParamData[i]._stuValue._vDouble3Value.z.toString();
                break;
            case ADF_PARAMT_BOOL:
                strParameterValue = ObjectTreeNode._arrParamData[i]._stuValue._bValue.toString();
                break;
            case ADF_PARAMT_STRING:
                strParameterValue = ObjectTreeNode._arrParamData[i]._stuValue._strValue;
                break;
        }
        nodeParameter._strValue = strParameterValue;
        GLModelTreeNode._arrNodeParameters.push(nodeParameter);
    }
    // 判断是否为叶节点
    if (ObjectTreeNode._arrSubNode.length < 1) {
        let GLObject = GetObjectData(ObjectTreeNode._uObjectID);
        if (GLObject != null) {
            GLObjectSet._arrObjectSet.push(GLObject);
            GLModelTreeNode._uObjectID = ObjectTreeNode._uObjectID;
            GLModelTreeNode._uObjectIndex = GLObjectSet._arrObjectSet.length-1;
            GLModelTreeNode._uObjectTriangleCount = GLObject._uObjectVertexNum / 3;
            if (GLObject._nFillMode == ADFFILL_INVISIBLE) {
                GLModelTreeNode._bVisibleOriginal = false;
                GLModelTreeNode._bVisible = false;
            }
        } else {
            GLModelTreeNode._bVisibleOriginal = false;
            GLModelTreeNode._bVisible = false;
        }
    } else {
        let uTriangleCount = 0;
        let bIsvisible = false;
        for (let i=0; i<ObjectTreeNode._arrSubNode.length; i++) {
            let subTreeNode = GetModelTreeData(ObjectTreeNode._arrSubNode[i], GLObjectSet);
            uTriangleCount += subTreeNode._uObjectTriangleCount;
            GLModelTreeNode._arrSubNode.push(subTreeNode);
            if (subTreeNode._bVisibleOriginal) {
                bIsvisible = true;
            }
        }
        GLModelTreeNode._uObjectTriangleCount = uTriangleCount;
        if (!bIsvisible) {
            GLModelTreeNode._bVisibleOriginal = false;
            GLModelTreeNode._bVisible = false;
        }
    }

    return GLModelTreeNode;
}

// 获取�?��相机数据�?
function GetAnimCameraData() {
    let GL_Camera = new GL_CAMERA();
    GL_Camera.Copy(g_sceneData.stuCameraSaveDataMgr)
    return GL_Camera;
}

// 获取动画总帧�?
function GetAnimFrameSize() {
    if (g_sceneData.stuAnimSaveDataMgr._arrObjAnimSaveData.length > 0
        || g_sceneData.stuCameraSaveDataMgr._arrCameraAnimSaveData.length > 0) {
        return g_sceneData.stuAnimSaveDataMgr._uFrameSize;
    } else {
        return 0;
    }
}

function GetSVZPartData (modelData, uLevel, fZDist) {
    let GL_PartLODData = new GL_PARTLODDATA();
    GL_PartLODData._uLevel = uLevel;
    GL_PartLODData._fZDist = fZDist;
    this.CalGLBox(modelData._box, GL_PartLODData._boxset._ObjectBox);
    GL_PartLODData._arrSubsetPrimitType = new Array(modelData._arrSubset.length);
    // 取网格数�?
    GL_PartLODData._uIsUV = modelData._uIsUV;
    GL_PartLODData._arrVertex = modelData._arrVertexData;

    for (let j=0; j<modelData._arrSubset.length; j++) {
        if (modelData._arrSubset[j]._nPrimitType == ADFPT_TRIANGLELIST) {
            GL_PartLODData._arrSubsetPrimitType[j] = ADFPT_TRIANGLELIST;
            // Surface网格顶点数量
            GL_PartLODData._arrSurfaceVertexNum.push(modelData._arrSubset[j]._uIndexCount);
            GL_PartLODData._arrGeomSurfaceIndex.push(modelData._arrSubset[j]._uGeomIndex);
            // 计算子集包围�?
            let tmpBox = new GL_Box();
            this.CalGLBox(modelData._arrSubset[j]._box, tmpBox);
            GL_PartLODData._boxset._SurfaceBoxes.push(tmpBox);
        }
    }
    // 取曲线数据（线缆)
    // 注意：只有一个零件中不存在线缆数据与曲面数据混合的现象时才有�?
    for (let j=0; j<modelData._arrSubset.length; j++) {
        if (modelData._arrSubset[j]._nPrimitType == ADFPT_LINELIST) {
            GL_PartLODData._arrSubsetPrimitType[j] = ADFPT_LINELIST;
            // Curve顶点数量
            GL_PartLODData._arrCurveVertexNum.push(modelData._arrSubset[j]._uIndexCount);
            GL_PartLODData._arrGeomCurveIndex.push(modelData._arrSubset[j]._uGeomIndex);
            // 计算子集包围�?
            let tmpBox = new GL_Box();
            this.CalGLBox(modelData._arrSubset[j]._box, tmpBox);
            GL_PartLODData._boxset._SurfaceBoxes.push(tmpBox);
        }
    }

    let tmpGeomData = null;
    // 取几何数据，曲面数据
    let GL_SurfaceData = null;
    if (modelData._arrSurface != null) {
        GL_SurfaceData = new GL_SURFACE();
        GL_SurfaceData._arrSurface = modelData._arrSurface;
        GL_SurfaceData._arrShapeOfPoints = new Array();
        GL_SurfaceData._arrShapeOfPointsCounts = new Array();
        for (let j = 0; j < modelData._arrSurface.length; j++) {
            // tmpGeomData = GetSurfaceShapeData(modelData._arrSurface[j]);
            // if (tmpGeomData != null) {
            //     for (let p = 0; p < tmpGeomData.length; ++p) {
            //         GL_SurfaceData._arrShapeOfPoints.push(tmpGeomData[p]);
            //     }
            //     GL_SurfaceData._arrShapeOfPointsCounts.push(tmpGeomData.length);
            // } else {
            //     GL_SurfaceData._arrShapeOfPointsCounts.push(0)
            // }
            GL_SurfaceData._arrShapeOfPointsCounts.push(0);
        }
    }
    
    // 取几何数据，曲线数据
    let GL_CurveData = null;
    if (modelData._arrCurve != null) {
        GL_CurveData = new GL_CURVE();
        GL_CurveData._arrCurve = modelData._arrCurve;
        GL_CurveData._arrShapeOfPoints = new Array();
        GL_CurveData._arrShapeOfPointsCounts = new Array();
        for (let j = 0; j < modelData._arrCurve.length; j++) {
            tmpGeomData = GetCurveShapeData(modelData._arrCurve[j]);
            if (tmpGeomData != null) {
                for (let p = 0; p < tmpGeomData.length; ++p) {
                    GL_CurveData._arrShapeOfPoints.push(tmpGeomData[p]);
                }
                GL_CurveData._arrShapeOfPointsCounts.push(tmpGeomData.length / 3);
            } else {
                GL_CurveData._arrShapeOfPointsCounts.push(0);
            }
        }
    }

    return {
        PARTLODDATA: GL_PartLODData,
        PARTSURFACEDATA: GL_SurfaceData,
        PARTCURVEDATA: GL_CurveData,
    };
}

function CalGLBox (ModelBox, gl_box) {
    gl_box._Vertex[0].x = ModelBox._min.x;  gl_box._Vertex[0].y = ModelBox._min.y; gl_box._Vertex[0].z = ModelBox._min.z;
    gl_box._Vertex[1].x = ModelBox._min.x;  gl_box._Vertex[1].y = ModelBox._max.y; gl_box._Vertex[1].z = ModelBox._min.z;
    gl_box._Vertex[2].x = ModelBox._min.x;  gl_box._Vertex[2].y = ModelBox._min.y; gl_box._Vertex[2].z = ModelBox._max.z;
    gl_box._Vertex[3].x = ModelBox._min.x;  gl_box._Vertex[3].y = ModelBox._max.y; gl_box._Vertex[3].z = ModelBox._max.z;
    gl_box._Vertex[4].x = ModelBox._max.x;  gl_box._Vertex[4].y = ModelBox._min.y; gl_box._Vertex[4].z = ModelBox._min.z;
    gl_box._Vertex[5].x = ModelBox._max.x;  gl_box._Vertex[5].y = ModelBox._max.y; gl_box._Vertex[5].z = ModelBox._min.z;
    gl_box._Vertex[6].x = ModelBox._max.x;  gl_box._Vertex[6].y = ModelBox._min.y; gl_box._Vertex[6].z = ModelBox._max.z;
    gl_box._Vertex[7].x = ModelBox._max.x;  gl_box._Vertex[7].y = ModelBox._max.y; gl_box._Vertex[7].z = ModelBox._max.z;
}

function GetObjectData (ObjectID) {
    let uMdlIndex = -1, nObjIndex = -1;
    // 找到物件索引
    for (let i=0; i<g_sceneData.stuObjSaveDataMgr._arrObjSaveData.length; ++i) {
        if (g_sceneData.stuObjSaveDataMgr._arrObjSaveData[i]._uObjectID == ObjectID) {
            nObjIndex = i;
            break;
        }
    }
    if (nObjIndex == -1) {
        return null;
    }
    // 判断物件对应的模型是否有�?
    for (let j=0; j< g_sceneData.arrModelData.length; j++) {
        if (g_sceneData.arrModelData[j]._ModelInfo._uModelID == g_sceneData.stuObjSaveDataMgr._arrObjSaveData[nObjIndex]._uMeshID) {
            uMdlIndex = j;
            break;
        }
    }
    let nValidModel = 0;
    let bContainSurfacfe = false, bContainCurve = false;
    if (uMdlIndex != -1) {
        nValidModel++;
        if (g_sceneData.arrModelData[uMdlIndex]._ModelInfo._stuModelData._arrVertexData.length == 0
            || g_sceneData.arrModelData[uMdlIndex]._ModelInfo._stuModelData._arrIndexData.length == 0
            || g_sceneData.arrModelData[uMdlIndex]._ModelInfo._stuModelData._arrSubset.length == 0) {
                nValidModel--;
        }
        if (nValidModel != 0) {
            // 只有当零件不存在线缆与曲面混合时，才有效
            for (let i=0; i<g_sceneData.arrModelData[uMdlIndex]._ModelInfo._stuModelData._arrSubset.length; i++) {
                if (g_sceneData.arrModelData[uMdlIndex]._ModelInfo._stuModelData._arrSubset[i]._nPrimitType == ADFPT_TRIANGLELIST) {
                    bContainSurfacfe = true;
                } else if (g_sceneData.arrModelData[uMdlIndex]._ModelInfo._stuModelData._arrSubset[i]._nPrimitType == ADFPT_LINELIST) {
                    bContainCurve = true;
                }
            }
            if (bContainSurfacfe && bContainCurve) {
                nValidModel--;
            }
        }
    }
    if (nValidModel == 0) {
        return null;
    }
    // 当前Object数据
    let GL_Object = new GL_OBJECT();
    GL_Object._uObjectID = g_sceneData.stuObjSaveDataMgr._arrObjSaveData[nObjIndex]._uObjectID;
    if (bContainCurve) {
        GL_Object._uPrimitType = ADFPT_LINELIST;
    }
    // 获取Object在GL_PARTSET中的索引
    GL_Object._uPartIndex = uMdlIndex;
    // 获取Object的Surface材质在GL_MATERIALSET中的索引
    for (let i=0; i<g_sceneData.stuObjSaveDataMgr._arrObjSaveData[nObjIndex]._arrSubsetMtlID.length; i++)
    {
        let unMaterialID = g_sceneData.stuObjSaveDataMgr._arrObjSaveData[nObjIndex]._arrSubsetMtlID[i];
        if (unMaterialID >= 100 && unMaterialID <= 114) {
            let defalutMaterialIndex = (unMaterialID - 100) + g_sceneData.stuMtlSaveDataMgr._arrMtlSaveData.length;
            GL_Object._arrSurfaceMaterialIndex.push(defalutMaterialIndex);
            continue;
        }
        let j = 0;
        for (; j<g_sceneData.stuMtlSaveDataMgr._arrMtlSaveData.length; j++) {
            if (g_sceneData.stuMtlSaveDataMgr._arrMtlSaveData[j]._uMtlID == unMaterialID) {
                GL_Object._arrSurfaceMaterialIndex.push(j);
                break;
            }
        }
        if (j >= g_sceneData.stuMtlSaveDataMgr._arrMtlSaveData.length) {
            GL_Object._arrSurfaceMaterialIndex.push(-1);
        }
    }
    if (GL_Object._arrSurfaceMaterialIndex.length == 0) {
        GL_Object._arrSurfaceMaterialIndex.push(-1);
    }
    // 获取Object渲染模式
    GL_Object._nFillMode = g_sceneData.stuObjSaveDataMgr._arrObjSaveData[nObjIndex]._nFillMode;
    GL_Object._nCullMode = g_sceneData.stuObjSaveDataMgr._arrObjSaveData[nObjIndex]._nCullMode;
    // 获取Object网格顶点数量
    let uTriNum = 0;
    for (let j=0; j<g_sceneData.arrModelData[uMdlIndex]._ModelInfo._stuModelData._arrSubset.length; j++) {
        if (g_sceneData.arrModelData[uMdlIndex]._ModelInfo._stuModelData._arrSubset[j]._nPrimitType == ADFPT_TRIANGLELIST) {
            continue;
        }
        uTriNum += g_sceneData.arrModelData[uMdlIndex]._ModelInfo._stuModelData._arrSubset[j]._uIndexCount;
    }
    GL_Object._uObjectVertexNum = uTriNum;
    // 获取Object的真实矩�?
    GL_Object._matLocal.Copy(g_sceneData.stuObjSaveDataMgr._arrObjSaveData[nObjIndex]._matLocal);
    GL_Object._matWorld.Copy(g_sceneData.stuObjSaveDataMgr._arrObjSaveData[nObjIndex]._matWorld);
    // 获取Object的动画数�?
    for (let i=0; i<g_sceneData.stuAnimSaveDataMgr._arrObjAnimSaveData.length; i++) {
        if (g_sceneData.stuAnimSaveDataMgr._arrObjAnimSaveData[i]._uObjectID == ObjectID) {
            GL_Object._objectAnim.Copy(g_sceneData.stuAnimSaveDataMgr._arrObjAnimSaveData[i]);
            break;
        }
    }
    GL_Object.GetObjectMat();

    return GL_Object;
}

/**
 * 计算整个模型包围�?
 */
function getModelBox(objectSet, partSet) {
    let m_ModelBox = new GL_Box();
    // 先求得最大最小顶�?
    let min_x = Infinity, min_y = Infinity, min_z = Infinity;
    let max_x = -Infinity, max_y = -Infinity, max_z = -Infinity;
    for (let i=0; i<objectSet._arrObjectSet.length; i++) {
        let uCurPartIndex = objectSet._arrObjectSet[i]._uPartIndex;
        partSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox.MinVertex(ObjectMin);
        objectSet._arrObjectSet[i].GetAnimMatrix(0, objectMat);
        CalTranslatePoint(ObjectMin.x, ObjectMin.y, ObjectMin.z, objectMat, RealMinPoint3);
        ObjectMin.x = RealMinPoint3.x; ObjectMin.y = RealMinPoint3.y; ObjectMin.z = RealMinPoint3.z;
        partSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox.MaxVertex(ObjectMax);
        CalTranslatePoint(ObjectMax.x, ObjectMax.y, ObjectMax.z, objectMat, RealMinPoint3);
        ObjectMax.x = RealMinPoint3.x; ObjectMax.y = RealMinPoint3.y; ObjectMax.z = RealMinPoint3.z;

        if (ObjectMin.x < min_x) {min_x = ObjectMin.x;}
        if (ObjectMin.y < min_y) {min_y = ObjectMin.y;}
        if (ObjectMin.z < min_z) {min_z = ObjectMin.z;}
        if (ObjectMax.x > max_x) {max_x = ObjectMax.x;}
        if (ObjectMax.y > max_y) {max_y = ObjectMax.y;}
        if (ObjectMax.z > max_z) {max_z = ObjectMax.z;}
    }
    // 根据�?���?��点设置模型包围盒
    m_ModelBox._Vertex[0].x = min_x, m_ModelBox._Vertex[0].y = min_y, m_ModelBox._Vertex[0].z = min_z;
    m_ModelBox._Vertex[1].x = min_x, m_ModelBox._Vertex[1].y = max_y, m_ModelBox._Vertex[1].z = min_z;
    m_ModelBox._Vertex[2].x = min_x, m_ModelBox._Vertex[2].y = min_y, m_ModelBox._Vertex[2].z = max_z;
    m_ModelBox._Vertex[3].x = min_x, m_ModelBox._Vertex[3].y = max_y, m_ModelBox._Vertex[3].z = max_z;
    m_ModelBox._Vertex[4].x = max_x, m_ModelBox._Vertex[4].y = min_y, m_ModelBox._Vertex[4].z = min_z;
    m_ModelBox._Vertex[5].x = max_x, m_ModelBox._Vertex[5].y = max_y, m_ModelBox._Vertex[5].z = min_z;
    m_ModelBox._Vertex[6].x = max_x, m_ModelBox._Vertex[6].y = min_y, m_ModelBox._Vertex[6].z = max_z;
    m_ModelBox._Vertex[7].x = max_x, m_ModelBox._Vertex[7].y = max_y, m_ModelBox._Vertex[7].z = max_z;
    return m_ModelBox;
}

/**
 * 计算多个零件的多个包围盒
 */
function getPublicModelBox(objectSet, partSet, indexs, objectMatrixs) {
    let m_ModelBox = new GL_Box();
    // 先求得最大最小顶�?
    let min_x = Infinity, min_y = Infinity, min_z = Infinity;
    let max_x = -Infinity, max_y = -Infinity, max_z = -Infinity;
    let tmpMinX = Infinity, tmpMinY = Infinity, tmpMinZ = Infinity;
    let tmpMaxX = -Infinity, tmpMaxY = -Infinity, tmpMaxZ = -Infinity;
    for (let i=0; i<indexs.length; i++) {
        let uCurPartIndex = objectSet._arrObjectSet[indexs[i]]._uPartIndex;
        partSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox.MinVertex(ObjectMin);
        CalTranslatePoint(ObjectMin.x, ObjectMin.y, ObjectMin.z, objectMatrixs[indexs[i]], RealMinPoint3);
        ObjectMin.x = RealMinPoint3.x; ObjectMin.y = RealMinPoint3.y; ObjectMin.z = RealMinPoint3.z;
        partSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox.MaxVertex(ObjectMax);
        CalTranslatePoint(ObjectMax.x, ObjectMax.y, ObjectMax.z, objectMatrixs[indexs[i]], RealMinPoint3);
        ObjectMax.x = RealMinPoint3.x; ObjectMax.y = RealMinPoint3.y; ObjectMax.z = RealMinPoint3.z;

        tmpMinX = Math.min(ObjectMin.x, ObjectMax.x);
        tmpMinY = Math.min(ObjectMin.y, ObjectMax.y);
        tmpMinZ = Math.min(ObjectMin.z, ObjectMax.z);
        tmpMaxX = Math.max(ObjectMin.x, ObjectMax.x);
        tmpMaxY = Math.max(ObjectMin.y, ObjectMax.y);
        tmpMaxZ = Math.max(ObjectMin.z, ObjectMax.z);

        if (tmpMinX < min_x) {min_x = tmpMinX;}
        if (tmpMinY < min_y) {min_y = tmpMinY;}
        if (tmpMinZ < min_z) {min_z = tmpMinZ;}
        if (tmpMaxX > max_x) {max_x = tmpMaxX;}
        if (tmpMaxY > max_y) {max_y = tmpMaxY;}
        if (tmpMaxZ > max_z) {max_z = tmpMaxZ;}
    }
    // 根据�?���?��点设置模型包围盒
    m_ModelBox._Vertex[0].x = min_x, m_ModelBox._Vertex[0].y = min_y, m_ModelBox._Vertex[0].z = min_z;
    m_ModelBox._Vertex[1].x = min_x, m_ModelBox._Vertex[1].y = max_y, m_ModelBox._Vertex[1].z = min_z;
    m_ModelBox._Vertex[2].x = min_x, m_ModelBox._Vertex[2].y = min_y, m_ModelBox._Vertex[2].z = max_z;
    m_ModelBox._Vertex[3].x = min_x, m_ModelBox._Vertex[3].y = max_y, m_ModelBox._Vertex[3].z = max_z;
    m_ModelBox._Vertex[4].x = max_x, m_ModelBox._Vertex[4].y = min_y, m_ModelBox._Vertex[4].z = min_z;
    m_ModelBox._Vertex[5].x = max_x, m_ModelBox._Vertex[5].y = max_y, m_ModelBox._Vertex[5].z = min_z;
    m_ModelBox._Vertex[6].x = max_x, m_ModelBox._Vertex[6].y = min_y, m_ModelBox._Vertex[6].z = max_z;
    m_ModelBox._Vertex[7].x = max_x, m_ModelBox._Vertex[7].y = max_y, m_ModelBox._Vertex[7].z = max_z;
    return m_ModelBox;
}

function getModelBoxLength(modelBox) {
    let fLen = -Infinity;
    let max_x_len = Math.abs(modelBox._Vertex[7].x - modelBox._Vertex[0].x);
    let max_y_len = Math.abs(modelBox._Vertex[7].y - modelBox._Vertex[0].y);
    let max_z_len = Math.abs(modelBox._Vertex[7].z - modelBox._Vertex[0].z);
    if (max_x_len > fLen) {fLen = max_x_len;}
    if (max_y_len > fLen) {fLen = max_y_len;}
    if (max_z_len > fLen) {fLen = max_z_len;}
    let fBoxLen = fLen / 2 / Math.tan(45.0 * Math.PI / 2.0 / 180.0);
    return fBoxLen;
}

/**
 * 计算模型中心�?
 */
function getModelBoxCenter(modelBox, center) {
    center.x = (modelBox._Vertex[7].x + modelBox._Vertex[0].x) / 2;
    center.y = (modelBox._Vertex[7].y + modelBox._Vertex[0].y) / 2;
    center.z = (modelBox._Vertex[7].z + modelBox._Vertex[0].z) / 2;
}

/**
 * 计算模型�?���?
 */
function getModelBoxLength(modelBox) {
    let max_x_len = Math.abs(modelBox._Vertex[7].x - modelBox._Vertex[0].x);
    let max_y_len = Math.abs(modelBox._Vertex[7].y - modelBox._Vertex[0].y);
    let max_z_len = Math.abs(modelBox._Vertex[7].z - modelBox._Vertex[0].z);
    let fLen = -Infinity;
    if (max_x_len > fLen) {fLen = max_x_len;}
    if (max_y_len > fLen) {fLen = max_y_len;}
    if (max_z_len > fLen) {fLen = max_z_len;}
    return fLen;
}

/**
 * 计算默认摄像机位�?
 */
function getModelDefEyePos(modelBox, eye, up) {
    let fLen = getModelBoxLength(modelBox);
    let dis = fLen / 2 / Math.tan(45.0 * Math.PI / 2.0 / 180.0);
    let defaultCameraAxis = GetDefaultCameraAxis();
    if (defaultCameraAxis.GLSceneUpType == GL_SCENEUPTYPEX) {
        if (defaultCameraAxis.GLUpAxisNegative) {
            eye.x = 0.0, eye.y = 0.0, eye.z = dis;
            up.x = -1.0, up.y = 0.0, up.z = 0.0;
        } else {
            eye.x = 0.0, eye.y = 0.0, eye.z = dis;
            up.x = 1.0, up.y = 0.0, up.z = 0.0;
        }
    } else if (defaultCameraAxis.GLSceneUpType == GL_SCENEUPTYPEY) {
        if (defaultCameraAxis.GLUpAxisNegative) {
            eye.x = 0.0, eye.y = 0.0, eye.z = -dis;
            up.x = 0.0, up.y = -1.0, up.z = 0.0;
        } else {
            eye.x = 0.0, eye.y = 0.0, eye.z = dis;
            up.x = 0.0, up.y = 1.0, up.z = 0.0;
        }
    } else if (defaultCameraAxis.GLSceneUpType == GL_SCENEUPTYPEZ) {
        if (defaultCameraAxis.GLUpAxisNegative) {
            eye.x = 0.0, eye.y = dis, eye.z = 0.0;
            up.x = 0.0, up.y = 0.0, up.z = -1.0;
        } else {
            eye.x = 0.0, eye.y = -dis, eye.z = 0.0;
            up.x = 0.0, up.y = 0.0, up.z = 1.0;
        }
    }
}

/**
 * 转化注释数据
 */
function getAnnotationData(arrComment, annotSet) {
    for (let i=0; i<arrComment.length; i++) {
        annotSet._arrComment.push(arrComment[i].Clone());
    }

    for (let i=0; i<arrComment.length; i++) {
        ConvertCommetText(annotSet._arrComment[i]);
    }
}

/**
 * 
 * 转化场景单位
 */
function getSceneUnit(stuConfig, sceneUnit) {
    sceneUnit.Clone(stuConfig._stuSceneUnit);
}

/**
 * 转化背景图片数据
 */
function GetDefaultBgImg() {
    var imageData = [-1, -1, -1];
    let image0 = new Image();
    image0.onload = function() {
        imageData[0] = getTexImage(image0, true);
    }
    image0.src = g_resFoder + g_bgImage[0];
    let image1 = new Image();
    image1.onload = function() {
        imageData[1] = getTexImage(image1, true);
    }
    image1.src = g_resFoder + g_bgImage[1];
    let image2 = new Image();
    image2.onload = function() {
        imageData[2] = getTexImage(image2, true);
    }
    image2.src = g_resFoder + g_bgImage[2];
    return imageData;
}

function GetTextureMtlByUrl(GLMatertalSet) {
    for (let i=0; i<g_sceneData.arrImageFile.length; i++) {
        let nCurImageID = g_sceneData.arrImageFile[i]._FileInfo.uResID;
        let curTexMaterial = new Array();
        for (let j=0; j<GLMatertalSet._arrMaterialSet.length; j++) {
            if (GLMatertalSet._arrMaterialSet[j]._MtlData._eMtlType == ADFMTLTYPE_PICTURE) {
                for (let k=0; k<GLMatertalSet._arrMaterialSet[j]._MtlData._arrTexID.length; k++) {
                    if (GLMatertalSet._arrMaterialSet[j]._MtlData._arrTexID[k] == nCurImageID) {
                        curTexMaterial.push(j);
                    }
                }
            }
        }
        if (curTexMaterial.length > 0) {
            // 贴图数据载入WebGL缓存
            let curImageName = g_sceneData.arrImageFile[i]._FileInfo.strFileName;
            for (let j=0; j<g_sceneData.arrResFile.length; j++) {
                if (g_sceneData.arrResFile[j]._name == curImageName) {
                    let image = null;
                    let texID = null;
                    if (g_sceneData.arrResFile[j]._imageData != null) {
                        image = g_sceneData.arrResFile[j];
                        texID = getTexImage(image, false);
                        for (let k=0; k<curTexMaterial.length; k++) {
                            GLMatertalSet._arrMaterialSet[curTexMaterial[k]]._MtlData._arrTexID[0] = texID;
                        }
                    } else {
                        image = new Image();
                        image.onload = function() {
                            texID = getTexImage(image, true);
                            for (let k=0; k<curTexMaterial.length; k++) {
                                GLMatertalSet._arrMaterialSet[curTexMaterial[k]]._MtlData._arrTexID[0] = texID;
                            }
                        }
                        image.src = g_strResbaseUrl + curImageName;
                    }
                    break;
                }
            }
        }
    }
}

/**
 * 获取材质数据
 */
function getTexImage(image, isUrl) {
    gl.activeTexture(gl.TEXTURE0);
    let uTexID = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, uTexID);
    //纹理放大缩小使用线�?插�?
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // ST坐标适应图片宽和�?
    if (isWebgl2) {
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T, gl.REPEAT);
    } else {
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    // 内存向GPU传输纹理数据，为1字节对齐
    gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
    if (isWebgl2) {
        gl.pixelStorei(gl.UNPACK_ROW_LENGTH,0);
        gl.pixelStorei(gl.UNPACK_SKIP_PIXELS,0);
        gl.pixelStorei(gl.UNPACK_SKIP_ROWS,0);
    }
    // 写入GPU缓存
    if (isUrl) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image._imageWidth, image._imageHeight, 0, gl.RGB, gl.UNSIGNED_BYTE, image._imageData);
    }
    return uTexID;
}

/**
 * 获取默认摄像机信�?
 */
function GetDefaultCameraAxis() {
    let nUp = 1, bNeg = false;
    if (g_sceneData.stuConfig._nSceneUpType == ADFCUT_X) {
        nUp = GL_SCENEUPTYPEX; bNeg = false;
    } else if (g_sceneData.stuConfig._nSceneUpType == ADFCUT_NX) {
        nUp = GL_SCENEUPTYPEX; bNeg = true;
    } else if (g_sceneData.stuConfig._nSceneUpType == ADFCUT_Y) {
        nUp = GL_SCENEUPTYPEY; bNeg = false;
    } else if (g_sceneData.stuConfig._nSceneUpType == ADFCUT_NY) {
        nUp = GL_SCENEUPTYPEY; bNeg = true;
    } else if (g_sceneData.stuConfig._nSceneUpType == ADFCUT_Z) {
        nUp = GL_SCENEUPTYPEZ; bNeg = false;
    } else if (g_sceneData.stuConfig._nSceneUpType == ADFCUT_NZ) {
        nUp = GL_SCENEUPTYPEZ; bNeg = true;
    }
    return {
        GLSceneUpType: nUp,
        GLUpAxisNegative: bNeg,
    };
}

/**
 * 计算几何曲面的形状数据
 */
function GetSurfaceShapeData(geomSurface) {
    let surfaceData = null;
    switch (geomSurface.nType) {
        case ADF_SURFT_PLANE:
            surfaceData = geomSurface.Surfacedata.plane;
            return null;
        case ADF_SURFT_CYLINDER:
            surfaceData = geomSurface.Surfacedata.cylinder;
            return SplitCirclePoints(surfaceData.vOrigin, surfaceData.vAxisX, surfaceData.vAxisY, surfaceData.vAxisZ, surfaceData.radius);
        case ADF_SURFT_CONE:
            surfaceData = geomSurface.Surfacedata.cone;
            return null;
        case ADF_SURFT_TORUS:
            surfaceData = geomSurface.Surfacedata.torus;
            return SplitCirclePoints(surfaceData.vOrigin, surfaceData.vAxisX, surfaceData.vAxisY, surfaceData.vAxisZ, (surfaceData.radius1 + surfaceData.radius2) / 2);
        case ADF_SURFT_REVOLVE:
            surfaceData = geomSurface.Surfacedata.revolve;
            return null;
        case ADF_SURFT_TABCYL:
            surfaceData = geomSurface.Surfacedata.tabcyl;
            return null;
        case ADF_SURFT_SPHERE:
            surfaceData = geomSurface.Surfacedata.sphere;
            return SplitCirclePoints(surfaceData.vOrigin, surfaceData.vAxisX, surfaceData.vAxisY, surfaceData.vAxisZ, surfaceData.radius);
        default:
            return null;
    }
}

/**
 * 计算几何曲线的形状数据
 */
function GetCurveShapeData(geomCurve) {
    switch (geomCurve.nType) {
        case ADF_CURVT_LINE:
            arrLinePoints.splice(0, arrLinePoints.length);
            ArrayPushPoint3(arrLinePoints, geomCurve.curvedata.line.end1);
            ArrayPushPoint3(arrLinePoints, geomCurve.curvedata.line.end2);
            return arrLinePoints;
        case ADF_CURVT_ARC:
            return SplitArcPoints(geomCurve.curvedata.arc);
        default:
            return null;
    }
}

/**
 * 轴线数据分割为离散点
 */
function SplitAxisPoints(origin, dir) {
    arrAxisPoints.splice(0, arrAxisPoints.length);
    for (let i = 0; i * t < 1; ++i) {
        if (prePoint != null) {
            ArrayPushPoint3(arrAxisPoints, prePoint);
        }
        splitPoint.x = origin.x + dir.x * axisLen * i * t;
        splitPoint.y = origin.y + dir.y * axisLen * i * t;
        splitPoint.z = origin.z + dir.z * axisLen * i * t;
        ArrayPushPoint3(arrAxisPoints, splitPoint);
        prePoint = splitPoint;
    }

    prePoint = null;
    return arrAxisPoints;
}

/**
 * circle数据分割为离散点
 */
function SplitCirclePoints(origin, axisX, axisY, axisZ, radius) {
    GetCoordsTransformMatrix(origin, axisX, axisY, axisZ, bpCoordsTransMatrix);
    CalMat4(coordsTransMatrix, bpCoordsTransMatrix);

    arrCirclePoints.splice(0, arrCirclePoints.length);
    srcPoint.z = 0;
    let radusEx = radius / Math.cos(alpha / 2);
    for (let i = 0; i * alpha < 2 * Math.PI; ++i) {
        if (prePoint != null) {
            ArrayPushPoint3(arrCirclePoints, prePoint);
        }
        srcPoint.x = radusEx * Math.cos(i * alpha);
        srcPoint.y = radusEx * Math.sin(i * alpha);
        CalTranslatePoint(srcPoint.x, srcPoint.y, srcPoint.z, coordsTransMatrix, splitPoint);
        ArrayPushPoint3(arrCirclePoints, splitPoint);
        prePoint = splitPoint;
    }

    prePoint = null;
    return arrCirclePoints;
}

/**
 * arc数据分割为离散点
 */
function SplitArcPoints(bpArcData) {
    let startAngle = bpArcData.fStartAngle > bpArcData.fEndAngle ? bpArcData.fEndAngle : bpArcData.fStartAngle;
    let endAngle = bpArcData.fStartAngle > bpArcData.fEndAngle ? bpArcData.fStartAngle : bpArcData.fEndAngle;
    GetArcTransformMatrix(bpArcData.vOrigin, bpArcData.vVector1, bpArcData.vVector2, startAngle, endAngle, bpArcData.fRadius, null, bpArcTransMatrix);
    CalMat4(bpArcTransMatrix, arcTransMatrix);

    arrArcPoints.splice(0, arrArcPoints.length);
    srcPoint.z = 0;
    let radusEx = bpArcData.fRadius / Math.cos(alpha / 2);
    let i = 0;
    for (; startAngle + (i + 1) * alpha < endAngle; ++i) {
        srcPoint.x = radusEx * Math.cos(i * alpha);
        srcPoint.y = radusEx * Math.sin(i * alpha);
        CalTranslatePoint(srcPoint.x, srcPoint.y, srcPoint.z, arcTransMatrix, splitPoint);
        ArrayPushPoint3(arrArcPoints, splitPoint);

        srcPoint.x = radusEx * Math.cos((i + 1) * alpha);
        srcPoint.y = radusEx * Math.sin((i + 1) * alpha);
        CalTranslatePoint(srcPoint.x, srcPoint.y, srcPoint.z, arcTransMatrix, splitPoint);
        ArrayPushPoint3(arrArcPoints, splitPoint);
    }

    srcPoint.x = radusEx * Math.cos(i * alpha);
    srcPoint.y = radusEx * Math.sin(i * alpha);
    CalTranslatePoint(srcPoint.x, srcPoint.y, srcPoint.z, arcTransMatrix, splitPoint);
    ArrayPushPoint3(arrArcPoints, splitPoint);
    // 终止点
    srcPoint.x = radusEx * Math.cos(endAngle - startAngle);
    srcPoint.y = radusEx * Math.sin(endAngle - startAngle);
    CalTranslatePoint(srcPoint.x, srcPoint.y, srcPoint.z, arcTransMatrix, splitPoint);
    ArrayPushPoint3(arrArcPoints, splitPoint);
    return arrArcPoints;
}
