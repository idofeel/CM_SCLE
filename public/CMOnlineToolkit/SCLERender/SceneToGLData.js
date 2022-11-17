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
    var matertalSet = GetSVZMaterialSet();
    var objectSet = new GL_OBJECTSET();
    var modelTreeTopNode = GetModelTreeData(g_sceneData.stuObjTreeTopNode, objectSet);
    objectSet._uFrameSize = GetAnimFrameSize();
    var camera = GetAnimCameraData();
    var annotSet = new GL_ANNOTATION();
    getAnnotationData(g_sceneData.arrComment, annotSet);
    var sceneUnit = new GL_SECNE_UNIT();
    getSceneUnit(g_sceneData.stuConfig, sceneUnit);
    var pmiSet = new GL_PMISET();
    GetScenePmiData(g_sceneData.arrAnnotation, modelTreeTopNode, pmiSet);

    return {
        GLObjectSet: objectSet,
        GLMatertalSet: matertalSet,
        GLModelTreeNode: modelTreeTopNode,
        GLCamera: camera,
        GLAnnotData: annotSet,
        GLSceneUnit: sceneUnit,
        GLPmiSet: pmiSet,
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

    // 将rgb贴图材质绑定到OpenGL
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
        let tempGLPartData = GetSVZPartData(g_sceneData.arrModelData[i]._ModelInfo._stuModelData, 0, 0.0);
        tempGLPart._arrPartLODData[0] = tempGLPartData.PARTLODDATA;
        tempGLPart._SurfaceShape = tempGLPartData.PARTSURFACEDATA;
        tempGLPart._CurveShape = tempGLPartData.PARTCURVEDATA;
        // 零件不存在线缆与曲面混合
        tempGLPart._uPartID = g_sceneData.arrModelData[i]._ModelInfo._uModelID;
        tempGLPart._uPrimitType = g_sceneData.arrModelData[i]._ModelInfo._stuModelData._arrSubset[0]._nPrimitType;

        GLPartSet._arrPartSet.push(tempGLPart);
    }
    return GLPartSet;
}

// 遍历模型树，每一个叶节点包含所有物件
function GetModelTreeData(ObjectTreeNode, GLObjectSet) {
    let GLModelTreeNode = new GL_MODELTREENODE();
    // 树节点信息
    GLModelTreeNode._uTreeNodeID = ObjectTreeNode._uTreeNodeID;
    GLModelTreeNode._strName = ObjectTreeNode._strName;
    GLModelTreeNode._uAnnoID = ObjectTreeNode._uAnnoID;
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
            // GLModelTreeNode._uObjectTriangleCount = GLObject._uObjectVertexNum / 3;
            CalMat4(GLObject._matWorld, GLModelTreeNode._matTranform);
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
        CalMat4(ObjectTreeNode._matTranform, GLModelTreeNode._matTranform);
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
    CalGLBox(modelData._box, GL_PartLODData._boxset._ObjectBox);
    GL_PartLODData._arrSubsetPrimitType = new Array(modelData._arrSubset.length);
    GL_PartLODData._arrSubsetType = new Array(modelData._arrSubset.length);
    // 取网格数�?
    GL_PartLODData._uIsUV = modelData._uIsUV;
    GL_PartLODData._arrVertexPosition = modelData._arrVertexPosition;
    GL_PartLODData._arrVertexNormal = modelData._arrVertexNormal;
    GL_PartLODData._arrVertexUV = modelData._arrVertexUV;
    GL_PartLODData._arrIndex = modelData._arrIndexData;
    GL_PartLODData._arrMdlPtIndex = modelData._arrMdlPtIndex;
    GL_PartLODData._arrPointIndexByMdlVer = modelData._arrPointIndexByMdlVer;
    if (modelData._arrIndexData instanceof Uint32Array) {
        var ext = gl.getExtension('OES_element_index_uint');
        GL_PartLODData._uEleType = gl.UNSIGNED_INT;
        GL_PartLODData._uEleSize = 4;
    }

    for (let j=0; j<modelData._arrSubset.length; j++) {
        if (modelData._arrSubset[j]._nPrimitType == ADFPT_TRIANGLELIST) {
            GL_PartLODData._arrSubsetPrimitType[j] = ADFPT_TRIANGLELIST;
            GL_PartLODData._arrSubsetType[j] = modelData._arrSubset[j]._nSubsetType;
            // Surface网格顶点数量
            GL_PartLODData._arrSurfaceStartIndex.push(modelData._arrSubset[j]._uStartIndex);
            GL_PartLODData._arrSurfaceVertexNum.push(modelData._arrSubset[j]._uIndexCount);
            GL_PartLODData._arrGeomSurfaceIndex.push(modelData._arrSubset[j]._uGeomIndex);
            // 计算子集包围�?
            let tmpBox = new GL_Box();
            CalGLBox(modelData._arrSubset[j]._box, tmpBox);
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
            CalGLBox(modelData._arrSubset[j]._box, tmpBox);
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

function TranGLBox (_min, _max, gl_box) {
    gl_box._Vertex[0].x = _min.x;  gl_box._Vertex[0].y = _min.y; gl_box._Vertex[0].z = _min.z;
    gl_box._Vertex[1].x = _min.x;  gl_box._Vertex[1].y = _max.y; gl_box._Vertex[1].z = _min.z;
    gl_box._Vertex[2].x = _min.x;  gl_box._Vertex[2].y = _min.y; gl_box._Vertex[2].z = _max.z;
    gl_box._Vertex[3].x = _min.x;  gl_box._Vertex[3].y = _max.y; gl_box._Vertex[3].z = _max.z;
    gl_box._Vertex[4].x = _max.x;  gl_box._Vertex[4].y = _min.y; gl_box._Vertex[4].z = _min.z;
    gl_box._Vertex[5].x = _max.x;  gl_box._Vertex[5].y = _max.y; gl_box._Vertex[5].z = _min.z;
    gl_box._Vertex[6].x = _max.x;  gl_box._Vertex[6].y = _min.y; gl_box._Vertex[6].z = _max.z;
    gl_box._Vertex[7].x = _max.x;  gl_box._Vertex[7].y = _max.y; gl_box._Vertex[7].z = _max.z;
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
    if (uMdlIndex != -1) {
        nValidModel++;
    }
    if (nValidModel == 0) {
        return null;
    }
    // 当前Object数据
    let GL_Object = new GL_OBJECT();
    GL_Object._uObjectID = g_sceneData.stuObjSaveDataMgr._arrObjSaveData[nObjIndex]._uObjectID;
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

function getSliceScleBox (objectSet, stuArrModelData) {
    let m_ModelBox = new GL_Box();
    // 先求得最大最小顶�?
    let min_x = Infinity, min_y = Infinity, min_z = Infinity;
    let max_x = -Infinity, max_y = -Infinity, max_z = -Infinity;
    for (let i=0; i<objectSet._arrObjectSet.length; i++) {
        let uCurPartIndex = objectSet._arrObjectSet[i]._uPartIndex;
        let min = stuArrModelData[uCurPartIndex]._ModelInfo._stuModelData._box._min;
        objectSet._arrObjectSet[i].GetAnimMatrix(0, objectMat);
        CalTranslatePoint(min.x, min.y, min.z, objectMat, RealMinPoint3);
        ObjectMin.x = RealMinPoint3.x; ObjectMin.y = RealMinPoint3.y; ObjectMin.z = RealMinPoint3.z;
        let max = stuArrModelData[uCurPartIndex]._ModelInfo._stuModelData._box._max;
        CalTranslatePoint(max.x, max.y, max.z, objectMat, RealMinPoint3);
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

function getModelBoxLenX(modelBox) {
    return Math.abs(modelBox._Vertex[7].x - modelBox._Vertex[0].x);
}

function getBoxLengthInPlane(modelBox, matToPlane) {
    let tmpMinX = Infinity, tmpMinY = Infinity, tmpMinZ = Infinity;
    let tmpMaxX = -Infinity, tmpMaxY = -Infinity, tmpMaxZ = -Infinity;
    modelBox.MinVertex(ObjectMin);
    CalTranslatePoint(ObjectMin.x, ObjectMin.y, ObjectMin.z, matToPlane, RealMinPoint3);
    ObjectMin.x = RealMinPoint3.x; ObjectMin.y = RealMinPoint3.y; ObjectMin.z = RealMinPoint3.z;
    modelBox.MaxVertex(ObjectMax);
    CalTranslatePoint(ObjectMax.x, ObjectMax.y, ObjectMax.z, matToPlane, RealMinPoint3);
    ObjectMax.x = RealMinPoint3.x; ObjectMax.y = RealMinPoint3.y; ObjectMax.z = RealMinPoint3.z;

    tmpMinX = Math.min(ObjectMin.x, ObjectMax.x);
    tmpMinY = Math.min(ObjectMin.y, ObjectMax.y);
    tmpMinZ = Math.min(ObjectMin.z, ObjectMax.z);
    tmpMaxX = Math.max(ObjectMin.x, ObjectMax.x);
    tmpMaxY = Math.max(ObjectMin.y, ObjectMax.y);
    tmpMaxZ = Math.max(ObjectMin.z, ObjectMax.z);

    return Math.sqrt((tmpMaxX-tmpMinX)*(tmpMaxX-tmpMinX) + (tmpMaxY-tmpMinY)*(tmpMaxY-tmpMinY));
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

function getModelBoxMinLen(modelBox) {
    let x_len = Math.abs(modelBox._Vertex[7].x - modelBox._Vertex[0].x);
    let y_len = Math.abs(modelBox._Vertex[7].y - modelBox._Vertex[0].y);
    let z_len = Math.abs(modelBox._Vertex[7].z - modelBox._Vertex[0].z);
    let fLen = Infinity;
    if (x_len < fLen) {fLen = x_len;}
    if (y_len < fLen) {fLen = y_len;}
    if (z_len < fLen) {fLen = z_len;}
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

function SetPmiObjectIndex(pmiSet, uAnnoID, objectIndex) {
    for (let i in pmiSet.arrPmi) {
        if (pmiSet.arrPmi[i].uID == uAnnoID) {
            pmiSet.arrPmi[i].objectIndex = objectIndex;
            break;
        }
    }
}

function SetPmiWorldMatrix(pmiSet, uAnnoID, worldMax) {
    for (let i in pmiSet.arrPmi) {
        if (pmiSet.arrPmi[i].uID == uAnnoID) {
            pmiSet.arrPmi[i].matWorld = worldMax;
            break;
        }
    }
}

function GetTreeNodeObjIndexByAnnoId(treeNode, pmiSet) {
    if (treeNode._uAnnoID != -1) {
        SetPmiObjectIndex(pmiSet, treeNode._uAnnoID, treeNode._uObjectIndex);
        SetPmiWorldMatrix(pmiSet, treeNode._uAnnoID, treeNode._matTranform);
    }

    if (treeNode._arrSubNode.length <= 0) {
        return;
    }

    for (let i = 0; i < treeNode._arrSubNode.length; ++i) {
        this.GetTreeNodeObjIndexByAnnoId(treeNode._arrSubNode[i], pmiSet);
    }
}

function GetScenePmiData(arrAnno, modelTreeTopNode, pmiSet) {
    pmiSet.Copy(arrAnno);
    GetTreeNodeObjIndexByAnnoId(modelTreeTopNode, pmiSet);
}

/**
 * 转化背景图片数据
 */
function GetDefaultBgImg() {
    var imageData = [];
    let image0 = new Image();
    image0.onload = function() {
        imageData.push(g_texturer.createUrlRgbaTexture(image0));
    }
    image0.src = g_resFoder + g_bgImage[0];
    let image1 = new Image();
    image1.onload = function() {
        imageData.push(g_texturer.createUrlRgbaTexture(image1));
    }
    image1.src = g_resFoder + g_bgImage[1];
    let image2 = new Image();
    image2.onload = function() {
        imageData.push(g_texturer.createUrlRgbaTexture(image2));
    }
    image2.src = g_resFoder + g_bgImage[2];

    if (g_bgImageUrl.length > 0) {
        let image3 = new Image();
        image3.onload = function() {
            imageData.push(g_texturer.createUrlRgbaTexture(image3));
        }
        image3.src = g_bgImageUrl[0];
    }
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
                        if (image._reserve == 0) {
                            // scle rgb
                            texID = g_texturer.createScleRgbTexture(image);
                            for (let k=0; k<curTexMaterial.length; k++) {
                                GLMatertalSet._arrMaterialSet[curTexMaterial[k]]._MtlData._arrTexID[0] = texID;
                            }
                            g_sceneData.arrResFile[j]._imageData = null;
                        }
                    } else {
                        image = new Image();
                        image.onload = function() {
                            texID = g_texturer.createUrlRgbaTexture(image);
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

function GetBasisuTextureMtl(GLMatertalSet) {
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
                    let image = g_sceneData.arrResFile[j];
                    let texID = null;
                    if (image._imageData != null) {
                        if (image._reserve == 1) {
                            // scle basis
                            if (g_texBasisu == null || !g_texBasisu.wasmInit) {
                                console.log("basis unversal not support");
                                break;
                            }
                            let basisFileObj = g_texBasisu.loadBasisData(image._imageData);
                            if (basisFileObj == null) {
                                break;
                            }
                            texID = g_texBasisu.createCompressedTexture(basisFileObj.dst, basisFileObj.width, basisFileObj.height, basisFileObj.tcFormat);
                            for (let k=0; k<curTexMaterial.length; k++) {
                                GLMatertalSet._arrMaterialSet[curTexMaterial[k]]._MtlData._arrTexID[0] = texID;
                            }
                            g_sceneData.arrResFile[j]._imageData = null;
                        }
                    }
                }
            }
        }
    }
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
