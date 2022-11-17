// File: Global.js

/**
 * @author wujiali
 */
 
//===================================================================================================
// 公共矩阵，减小内存
var g_matLocal = mat4.create();
var g_matWorld = mat4.create();
var g_matMultiply = mat4.create();

//===================================================================================================

function GL_BoxSet() {
    this._ObjectBox = new GL_Box();
    this._SurfaceBoxes = new Array();

    this.Clear = function() {
        this._SurfaceBoxes.splice(0, this._SurfaceBoxes.length);
    }
}

// 曲面顶点在零件顶点数据中的始末索引
function GL_Vertex_Index(start, end) {
    this._startIndex = start;
    this._endIndex = end;

    this.Copy = function(data) {
        this._startIndex = data._startIndex;
        this._endIndex = data._endIndex;
    }
}

// LOD零件数据
// 1. 可包含三角片数据
// 2. 可包含一组曲线数据集，曲线可以表示：线缆、边等
function GL_PARTLODDATA() {
    this._uLevel = 0;
    this._fZDist = 0;
    this._arrVertexPosition = null;
    this._arrVertexNormal = null;
    this._arrVertexUV = null;
    this._arrIndex = null;
    this._arrSubsetPrimitType = null;
    this._arrSubsetType = null;
    this._arrSurfaceStartIndex = new Array();
    this._arrSurfaceVertexNum = new Array();
    this._arrGeomSurfaceIndex = new Array();
    this._arrCurveVertexNum = new Array();
    this._arrGeomCurveIndex = new Array();
    this._boxset = new GL_BoxSet();
    this._uIsUV = 1;
    this._uEleType = gl.UNSIGNED_SHORT;
    this._uEleSize = 2;
    this._arrMdlPtIndex = null;
    this._arrPointIndexByMdlVer = null;

    this.Clear = function() {
        if (this._arrSubsetPrimitType != null) {
            this._arrSubsetPrimitType.splice(0, this._arrSubsetPrimitType.length);
        }
        if (this._arrSubsetType != null) {
            this._arrSubsetType.splice(0, this._arrSubsetType.length);
        }
        this._arrSurfaceStartIndex.splice(0, this._arrSurfaceStartIndex.length);
        this._arrSurfaceVertexNum.splice(0, this._arrSurfaceVertexNum.length);
        this._arrGeomSurfaceIndex.splice(0, this._arrGeomSurfaceIndex.length);
        this._arrCurveVertexNum.splice(0, this._arrCurveVertexNum.length);
        this._arrGeomCurveIndex.splice(0, this._arrGeomCurveIndex.length);
        this._boxset.Clear();
        this._arrVertexPosition = null;
        this._arrVertexNormal = null;
        this._arrVertexUV = null;
        this._arrIndex = null;
    }

    this.ClearCache = function() {
        this._arrVertexNormal = null;
        this._arrVertexUV = null;
    }
}

function GL_CURVE() {
    this._arrCurve = null;
    this._arrShapeOfPoints = null;
    this._arrShapeOfPointsCounts = null;

    this.Clear = function() {
        if (this._arrCurve != null) {
            this._arrCurve.splice(0, this._arrCurve.length);
        }
        if (this._arrShapeOfPoints != null) {
            this._arrShapeOfPoints.splice(0, this._arrShapeOfPoints.length);
        }
        if (this._arrShapeOfPointsCounts != null) {
            this._arrShapeOfPointsCounts.splice(0, this._arrShapeOfPointsCounts.length);
        }
    }

    this.GetCurveVertexSum = function(fromIndex, toIndex) {
        let sum = 0;
        for (let i = fromIndex; i < toIndex; ++i) {
            sum += this._arrShapeOfPointsCounts[i];
        }
        return sum;
    }
}

function GL_SURFACE() {
    this._arrSurface = null;
    this._arrAxisOfPoints = null;
    this._arrShapeOfPoints = null;
    this._arrShapeOfPointsCounts = null;

    this.Clear = function() {
        if (this._arrSurface != null) {
            this._arrSurface.splice(0, this._arrSurface.length); 
        }
        if (this._arrAxisOfPoints != null) {
            this._arrAxisOfPoints.splice(0, this._arrAxisOfPoints.length);
        }
        if (this._arrShapeOfPoints != null) {
            this._arrShapeOfPoints.splice(0, this._arrShapeOfPoints.length);
        }
        if (this._arrShapeOfPointsCounts != null) {
            this._arrShapeOfPointsCounts.splice(0, this._arrShapeOfPointsCounts.length);
        }
    }
}

// 零件数据
// 1. 可包含一组LOD零件数据，这里仅为一层
function GL_PART() {
    this._uPartID = -1;
    this._uPrimitType = ADFPT_TRIANGLELIST;
    this._arrPartLODData = new Array(1);

    this._SurfaceShape = null;    // GL_SURFACE对象，离散化的曲面形状数据
    this._CurveShape = null;      // GL_CURVE对象，离散化的曲线形状数据

    this.Clear = function() {
        for (let i = 0; i < this._arrPartLODData.length; ++i) {
            this._arrPartLODData[i].Clear();
        }
        this._arrPartLODData.splice(0, this._arrPartLODData.length);
        if (this._SurfaceShape != null) {
            this._SurfaceShape.Clear();
        }
        if (this._CurveShape != null) {
            this._CurveShape.Clear();
        }
    }

    this.ClearCache = function() {
        this._arrPartLODData[0].ClearCache();
    }
}

// 零件数据集
function GL_PARTSET() {
    this._uLODLevel = 0;
    this._arrPartSet = new Array();

    this.Clear = function() {
        for (let i = 0; i < this._arrPartSet.length; ++i) {
            if (this._arrPartSet[i] != null) {
                this._arrPartSet[i].Clear();
            }
        }
        this._arrPartSet.splice(0, this._arrPartSet.length);
    }

    this.ClearCache = function() {
        for (let i = 0; i < this._arrPartSet.length; ++i) {
            if (this._arrPartSet[i] != null) {
                this._arrPartSet[i].ClearCache();
            }
        }
    }
}

// 材质集
function GL_MATERIALSET() {
    this._arrMaterialSet = new Array();

    this.Clear = function() {
        this._arrMaterialSet.splice(0, this._arrMaterialSet.length);
    }

    this.Copy = function() {
        let arrMaterialCopys = new Array();
        for (let i = 0; i < this._arrMaterialSet.length; ++i) {
            let tmpCopy = new CM_MATERIALINFO();
            tmpCopy._strName = this._arrMaterialSet[i]._strName;
            tmpCopy._uMaterialID = this._arrMaterialSet[i]._uMtlID;
            arrMaterialCopys.push(tmpCopy);
        }
        return arrMaterialCopys;
    }

    this.GetMaterialInfo = function(mtlIndex) {
        let tmpCopy = new CM_MATERIALINFO();
        tmpCopy._strName = this._arrMaterialSet[mtlIndex]._strName;
        tmpCopy._uMaterialID = this._arrMaterialSet[mtlIndex]._uMtlID;
        return tmpCopy;
    }
}

var matAdfOut = new ADF_BASEMATRIX();
// 物件数据
function GL_OBJECT() {
    this._uObjectID = 0;
    this._uPartIndex = 0;
    this._arrSurfaceMaterialIndex = new Array();
    this._nFillMode = ADFFILL_SOLID;
    this._nCullMode = ADFCULL_NONE;
    this._matLocal = new ADF_BASEMATRIX();
    this._matWorld = new ADF_BASEMATRIX();
    this._matObject = mat4.create();
    this._objectAnim = new ADF_OBJ_ANIM_SAVEDATA();

    this.Clear = function() {
        this._arrSurfaceMaterialIndex.splice(0, this._arrSurfaceMaterialIndex.length);
        this._objectAnim.Clear();
    }

    this.GetAnimMatrix = function(uFrame, matGlOut) {
        ADFMatrixIdentity(matAdfOut);
        if (this._objectAnim._arrKeyFrameData.length == 0) {
            CalMat4(this._matLocal, g_matLocal);
            CalMat4(this._matWorld, g_matWorld);
            mat4.multiply(matGlOut, g_matWorld, g_matLocal);
        } else {
            CalculateObjectWldMatrix(uFrame, this._objectAnim, this._matLocal, this._matWorld, matAdfOut);
            CalMat4(matAdfOut, matGlOut);
        }
    }

    this.GetAnimTransparent = function(uFrame) {
        return CalculateObjectNoTransparency(uFrame, this._objectAnim);
    }

    this.GetObjectMat = function() {
        this.GetAnimMatrix(0, this._matObject);
    }
}

// 物件集
function GL_OBJECTSET() {
    this._uFrameSize = 0;
    this._arrObjectSet = new Array();

    this.Clear = function() {
        this._arrObjectSet.splice(0, this._arrObjectSet.length);
    }
}

// 摄像机
function GL_CAMERA() {
    this._DefaultCamera = new ADF_CAMERA();
    this._arrCameraAnimSaveData = new Array();

    this.Clear = function() {
        this._DefaultCamera.Clear();
        this._arrCameraAnimSaveData.splice(0, this._arrCameraAnimSaveData.length);
    }

    this.Copy = function(data) {
        this._DefaultCamera.Copy(data._DefaultCamera); 
        this._arrCameraAnimSaveData.splice(0, this._arrCameraAnimSaveData.length);
		for (var i in data._arrCameraAnimSaveData) {
			this._arrCameraAnimSaveData[i] = data._arrCameraAnimSaveData[i];
        }
    }

    this.GetAnimCamera = function(uFrame, cameraOut) {
        CalculateCameraDataByKeyFrame(uFrame, this._arrCameraAnimSaveData, cameraOut);
        return cameraOut;
    }
}

// 模型树
function GL_MODELTREENODE() {
    this._uTreeNodeID = -1;
    this._uJSTreeID = -1;
    this._strName = "";
    this._arrNodeParameters = new Array();
    this._uObjectID = -1;
    this._uObjectIndex = -1;
    this._bVisibleOriginal = true;
    this._bVisible = true;
    this._uObjectTriangleCount = -1;
    this._arrSubNode = new Array();
    this._uAnnoID = -1;
    this._uAnnoIndex = -1;
    this._matTranform = mat4.create();

    this.Clear = function() {
        this._arrNodeParameters.splice(0, this._arrNodeParameters.length);
        this._arrSubNode.splice(0, this._arrSubNode.length);
    }
}

// 模型树节点参数
function GL_NODEPARAMETER() {
    this._strName = "";
    this._strValue = "";
}

// 标注、注释数据
function GL_ANNOTATION() {
    this._arrComment = new Array();

    this.Clear = function() {
        this._arrComment.splice(0, this._arrComment.length);
    }
}

var minPt = new Point3(0, 0, 0);
var maxPt = new Point3(0, 0, 0);
// 标注项
function GL_PMI_ITEM() {
	this.uID = -1;                      // 标注ID, ADF_UINT类型
	this.nType = ADF_AT_UNKNOWN;        // 标注类型,参看"标注类型"定义
	this.strName = '';                  // 名称
	this.bIsScreenAnnot = false;        // 是否平行于屏幕, Int32
	this.normal = null;

    this.symbolVertexStart = 0;
    this.symbolVertexEnd = 0;
    this.symbolVertexNum = 0;
    this.symbolBox = null;

    this.wireVertexStart = 0;
    this.wireVertexEnd = 0;
    this.wiresVertexNum = 0;
    this.wireBox = null;

    this.itemBox = null;

    this.Clear = function () {
    }

    this.Copy = function(adfItem) {
        this.uID = adfItem.uID;
        this.nType = adfItem.nType;
        this.strName = adfItem.strName;
        this.bIsScreenAnnot = adfItem.bIsScreenAnnot;
        this.normal = adfItem.normal;

        if (adfItem.graphicData.points.length <= 0) {
            return;
        }

        let point = null;
        let min_x = Infinity, min_y = Infinity, min_z = Infinity;
        let max_x = -Infinity, max_y = -Infinity, max_z = -Infinity;

        for (let i in adfItem.graphicData.points) {
            point = adfItem.graphicData.points[i];
            min_x = Math.min(min_x, point.x);
            min_y = Math.min(min_y, point.y);
            min_z = Math.min(min_z, point.z);
            max_x = Math.max(max_x, point.x);
            max_y = Math.max(max_y, point.y);
            max_z = Math.max(max_z, point.z);
        }
        this.symbolBox = new GL_Box();
        minPt.set(min_x, min_y, min_z);
        maxPt.set(max_x, max_y, max_z);
        TranGLBox(minPt, maxPt, this.symbolBox);

        let wire = null;
        min_x = Infinity, min_y = Infinity, min_z = Infinity;
        max_x = -Infinity, max_y = -Infinity, max_z = -Infinity;
        for (let i in adfItem.graphicData.wires) {
            wire = adfItem.graphicData.wires[i];
            for (let j in wire.points) {
                point = wire.points[j];
                min_x = Math.min(min_x, point.x);
                min_y = Math.min(min_y, point.y);
                min_z = Math.min(min_z, point.z);
                max_x = Math.max(max_x, point.x);
                max_y = Math.max(max_y, point.y);
                max_z = Math.max(max_z, point.z);
            }
        }
        this.wireBox = new GL_Box();
        minPt.set(min_x, min_y, min_z);
        maxPt.set(max_x, max_y, max_z);
        TranGLBox(minPt, maxPt, this.wireBox);

        this.itemBox = new GL_Box();
        min_x = Math.min(this.symbolBox._Vertex[0].x, this.wireBox._Vertex[0].x);
        min_y = Math.min(this.symbolBox._Vertex[0].y, this.wireBox._Vertex[0].y);
        min_z = Math.min(this.symbolBox._Vertex[0].z, this.wireBox._Vertex[0].z);
        max_x = Math.max(this.symbolBox._Vertex[7].x, this.wireBox._Vertex[7].x);
        max_y = Math.max(this.symbolBox._Vertex[7].y, this.wireBox._Vertex[7].y);
        max_z = Math.max(this.symbolBox._Vertex[7].z, this.wireBox._Vertex[7].z);
        minPt.set(min_x, min_y, min_z);
        maxPt.set(max_x, max_y, max_z);
        TranGLBox(minPt, maxPt, this.itemBox);
    }
}

function GL_PMI_VIEW() {
	this.uID = -1;  						            // 标注ID, ADF_UINT类型
	this.strName = '';					                // 名称
    this.annoPlane = new ADF_AnnotationPlane();	        // 标注平面
    this.arrItemIndex = new Array();                 // 标注item索引

    this.Clear = function () {
        this.arrItemIndex.splice(0, this.arrItemIndex.length);
    }

    this.Copy = function(adfView, adfItem) {
        this.uID = adfView.uID;
	    this.strName = adfView.strName;
        this.annoPlane = adfView.annoPlane;

        for (let i in adfView.arrAnnotationID){
            this.arrItemIndex[i] = -1;
            for (let j in adfItem) {
                if (adfView.arrAnnotationID[i] == adfItem[j].uID) {
                    this.arrItemIndex[i] = j;
                    break;
                }
            }
        }
    }
}

function GL_PMI() {
    this.uID = -1;  						     // 标注ID, ADF_UINT类型
	this.strName = '';					         // 名称
    this.arrFacetVertex = null;
    this.arrFacetIndex = null;
    this.arrWiresVertex = null;
    this.arrPmiItem = new Array();               // 标注项
    this.arrPmiView = new Array();               // 视图集
    this.objectIndex = -1;
    this.matWorld = null;

    this.Clear = function () {
        for (let i in this.arrPmiItem) {
            this.arrPmiItem[i].Clear();
        }
        this.arrPmiItem.splice(0, this.arrPmiItem.length);

        for (let i in this.arrPmiView) {
            this.arrPmiView[i].Clear();
        }
        this.arrPmiView.splice(0, this.arrPmiView.length);

        this.arrFacetVertex = null;
        this.arrFacetIndex = null;
        this.arrWiresVertex = null;
    }

    this.Copy = function(adfAnno) {
        this.uID = adfAnno.uID;
	    this.strName = adfAnno.strName;

        let num = 0;
        let index = 0;
        let offset = 0;
        let anno = null;

        for (let i in adfAnno.arrAnnotationItem){
            num += adfAnno.arrAnnotationItem[i].graphicData.points.length * 3;
        }
        this.arrFacetVertex = new Float32Array(num);
        for (let i in adfAnno.arrAnnotationItem){
            anno = adfAnno.arrAnnotationItem[i].graphicData;
            for (let j in anno.points) {
                this.arrFacetVertex[index] = anno.points[j].x;
                this.arrFacetVertex[index+1] = anno.points[j].y;
                this.arrFacetVertex[index+2] = anno.points[j].z;
                index+=3;
            }
        }

        num = 0, index = 0, offset = 0;
        for (let i in adfAnno.arrAnnotationItem){
            num += adfAnno.arrAnnotationItem[i].graphicData.facetIndexes.length;
        }
        this.arrFacetIndex = new Uint16Array(num);
        for (let i in adfAnno.arrAnnotationItem){
            anno = adfAnno.arrAnnotationItem[i].graphicData;
            for (let j in anno.facetIndexes) {
                this.arrFacetIndex[index] = offset + anno.facetIndexes[j];
                index++;
            }
            offset += anno.points.length;
        }

        num = 0, index = 0, offset = 0;
        for (let i in adfAnno.arrAnnotationItem){
            for (let j in adfAnno.arrAnnotationItem[i].graphicData.wires) {
                num += adfAnno.arrAnnotationItem[i].graphicData.wires[j].points.length * 3;
            }
        }
        this.arrWiresVertex = new Float32Array(num);
        for (let i in adfAnno.arrAnnotationItem){
            anno = adfAnno.arrAnnotationItem[i].graphicData;
            for (let j in anno.wires) {
                for (let k in anno.wires[j].points) {
                    this.arrWiresVertex[index] = anno.wires[j].points[k].x;
                    this.arrWiresVertex[index+1] = anno.wires[j].points[k].y;
                    this.arrWiresVertex[index+2] = anno.wires[j].points[k].z;
                    index += 3;
                }
            }
        }

        let symbolIndex = 0;
        let wireIndex = 0;
        let pmiItem = null;
        for (let i in adfAnno.arrAnnotationItem){
            pmiItem = new GL_PMI_ITEM();
            pmiItem.Copy(adfAnno.arrAnnotationItem[i]);
            pmiItem.symbolVertexNum = adfAnno.arrAnnotationItem[i].graphicData.facetIndexes.length;
            pmiItem.symbolVertexStart = symbolIndex;
            pmiItem.symbolVertexEnd = symbolIndex + pmiItem.symbolVertexNum;

            for (let j = 0; j < adfAnno.arrAnnotationItem[i].graphicData.wires.length; ++j) {
                pmiItem.wiresVertexNum += adfAnno.arrAnnotationItem[i].graphicData.wires[j].points.length;
            }
            pmiItem.wireVertexStart = wireIndex;
            pmiItem.wireVertexEnd = wireIndex + pmiItem.wiresVertexNum;

            this.arrPmiItem[i] = pmiItem;
            symbolIndex += pmiItem.symbolVertexNum;
            wireIndex += pmiItem.wiresVertexNum;
        }

        index = 0;
        let pmiView = null;
        for (let i in adfAnno.arrAnnotationView){
            pmiView = new GL_PMI_VIEW();
            pmiView.Copy(adfAnno.arrAnnotationView[i], adfAnno.arrAnnotationItem);
            this.arrPmiView[i] = pmiView;
        }
    }
}

// PMI数据
function GL_PMISET() {
    this.arrPmi = null;

    this.Copy = function(arrAdfAnno) {
        if (arrAdfAnno.length <= 0) {
            return;
        }

        let pmi = null;
        this.arrPmi = new Array(arrAdfAnno.length);
        for (let i in arrAdfAnno) {
            pmi = new GL_PMI();
            pmi.Copy(arrAdfAnno[i]);
            this.arrPmi[i] = pmi;
        }
    }

    this.Clear = function() {
        if (this.arrPmi == null) {
            return;
        }

        for (let i in this.arrPmi) {
            this.arrPmi[i].Clear();
        }
    }
}


// GL绘制单元
// 分割Uint标志量
function GL_VAO_FLAG() {
    this.flag = GL_ORIGINAL;
    this.fromIndex = 0;
    this.toIndex = 0;
    this.oriFlag = GL_ORIGINAL;

    this.set = function(flagType, fromSufIndex, toSurIndex, oriFlag) {
        this.flag = flagType;
        this.fromIndex = fromSufIndex;
        this.toIndex = toSurIndex;
        this.oriFlag = oriFlag;
    }

    this.copy = function() {
        let copyFalg = new GL_VAO_FLAG();
        copyFalg.flag = this.flag;
        copyFalg.fromIndex = this.fromIndex;
        copyFalg.toIndex = this.toIndex;
        copyFalg.oriFlag = this.oriFlag;
        return copyFalg;
    }

    this.isSurfaceInside = function(surfaceIndex) {
        return (surfaceIndex >= this.fromIndex && surfaceIndex < this.toIndex) ? true : false;
    }

    this.setFlag = function(flagType) {
        this.flag = flagType;
        if (flagType == GL_USERDEFINE) {
            this.oriFlag = flagType;
        }
    }

    this.resetFlag = function(flagType) {
        if (flagType == GL_USERDEFINE) {
            this.oriFlag = GL_ORIGINAL;
        }
        this.flag = this.oriFlag;
    }
}

// GL三角面片绘制单元
// 用于合并材质与材质分割
function GL_MESH_VAO_UNIT() {
    this.splitSize = 1;               // VAO被分割时记录
    this.splitFlags = null;
    this.arrVertexCounts = null;      // VAO顶点数量，数组长度等于合并的surface数量

    this.uintVertexNum = 0;           // 记录不变量
    this.uintMaterialIndex = 0;
    this.surfaceStart = -1;
    this.surfaceCount = 0;

    this.InitObjectMesh = function() {
        if (this.arrVertexCounts != null) {
            this.arrVertexCounts.splice(0, this.arrVertexCounts.length);
        }
        this.arrVertexCounts = new Array();
        this.arrVertexCounts.push(this.uintVertexNum);
    }

    this.InitSurfaceMesh = function() {
        if (this.arrVertexCounts != null) {
            this.arrVertexCounts.splice(0, this.arrVertexCounts.length);
        }
        this.arrVertexCounts = new Array();
        for (let i = 0; i < this.surfaceCount; ++i) {
            this.arrVertexCounts.push(0);
        }
        this.arrVertexCounts[0] = this.uintVertexNum;
    }

    this.InitFlags = function() {
        if (this.splitFlags != null) {
            this.splitFlags.splice(0, this.splitFlags.length);
        }
        this.splitFlags  = new Array();
        let tmpFlag = new GL_VAO_FLAG();
        tmpFlag.set(GL_ORIGINAL, this.surfaceStart, this.surfaceStart + this.surfaceCount, GL_ORIGINAL);
        this.splitFlags.push(tmpFlag);
    }

    this.Clear = function() {
        this.splitSize = 1;
        if (this.splitFlags != null) {
            this.splitFlags.splice(0, this.splitFlags.length);
            this.splitFlags == null;
        }
        if (this.arrVertexCounts != null) {
            this.arrVertexCounts.splice(0, this.arrVertexCounts.length);
            this.arrVertexCounts = null;
        }
    }

    this.Reset = function(flagType) {
        if (this.splitSize == 1 || flagType == GL_ORIGINAL) {
            return;
        }

        let newVertexCounts = new Array();
        let preVertexCount = this.arrVertexCounts[0];
        let newSplitFlags = new Array();
        let preFlagUnit = this.splitFlags[0].copy();
        if (preFlagUnit.flag == flagType) {
            preFlagUnit.resetFlag(flagType);
        }
        
        for (let i = 1; i < this.splitFlags.length; ++i) {
            if (this.splitFlags[i].flag == flagType) {
                this.splitFlags[i].resetFlag(flagType);
            }

            if (preFlagUnit.flag == this.splitFlags[i].flag) {
                preFlagUnit.toIndex = this.splitFlags[i].toIndex;
                preVertexCount += this.arrVertexCounts[i];
            } else {
                preFlagUnit.toIndex = this.splitFlags[i - 1].toIndex;
                newVertexCounts.push(preVertexCount);
                preVertexCount = this.arrVertexCounts[i];
                newSplitFlags.push(preFlagUnit);
                preFlagUnit = this.splitFlags[i].copy();
            }
        }
        newSplitFlags.push(preFlagUnit);
        newVertexCounts.push(preVertexCount);
        this.splitFlags.splice(0, this.splitFlags.length);
        this.splitFlags = newSplitFlags;
        this.arrVertexCounts.splice(0, this.arrVertexCounts.length);
        this.arrVertexCounts = newVertexCounts;
        this.splitSize = newSplitFlags.length;
    }

    this.isSurfaceInside = function(surfaceIndex) {
        return (surfaceIndex >= this.surfaceStart && surfaceIndex < this.surfaceStart + this.surfaceCount) ? true : false;
    }
}

// GL曲线数据绘制单元
function GL_CURVE_VAO_UNIT(num, sum) {
    this.splitSize = 1;               // VAO被分割时记录
    this.splitFlags = null;           // VAO分割标志
    this.arrVertexCounts = null;      // VAO顶点数量，数组长度等于part curve数量

    this.uintVertexNum = 0;           // 记录总的顶点数量
    this.uintMaterialIndex = 0;       // 记录原始材质，暂时不用

    if (num < 0) {
        return;
    } else if (num == 0) {
        this.arrVertexCounts = new Array();
    } else {
        this.arrVertexCounts = new Array();
        for (let i = 0; i < num; ++i) {
            this.arrVertexCounts.push(0);
        }
        this.arrVertexCounts[0] = sum;
        this.uintVertexNum = sum;
    }

    this.Clear = function() {
        if (this.splitFlags != null) {
            this.splitFlags.splice(0, this.splitFlags.length);
            this.splitFlags = null;
        }
        if (this.arrVertexCounts != null) {
            this.arrVertexCounts.splice(0, this.arrVertexCounts.length);
        }
    }

    this.Reset = function() {
        this.splitSize = 1;
        this.arrVertexCounts[0] = this.uintVertexNum;
        if (this.splitFlags != null) {
            this.splitFlags.splice(0, this.splitFlags.length);
            this.splitFlags == null;
        }
    }
}

// 拾取数据单元
// 包括：
// 选中元素类型、object、surface、curve、point
// 交点距离和交点坐标
function GL_PICK_UNIT() {
    this.elementType = 0;
    this.objectIndex = -1;
    this.surfaceIndex = -1;
    this.geomSurfaceIndex = -1;
    this.geomCurveIndex = -1;
    this.geomPointIndex = -1;

    this.distance = 0;
    this.intersectPt = new Point3(0, 0, 0);

    this.Reset = function() {
        this.elementType = 0;
        this.objectIndex = -1;
        this.surfaceIndex = -1;
        this.geomSurfaceIndex = -1;
        this.geomCurveIndex = -1;
        this.geomPointIndex = -1;
        this.distance = 0;
        this.intersectPt.set(0, 0, 0);
    }

    this.Copy = function(copyUnit) {
        copyUnit.elementType = this.elementType;
        copyUnit.objectIndex = this.objectIndex;
        copyUnit.surfaceIndex = this.surfaceIndex;
        copyUnit.geomSurfaceIndex = this.geomSurfaceIndex;
        copyUnit.geomCurveIndex = this.geomCurveIndex;
        copyUnit.geomPointIndex = this.geomPointIndex;
        copyUnit.distance = this.distance;
        copyUnit.intersectPt.set(this.intersectPt.x, this.intersectPt.y, this.intersectPt.z);
    }
}

// 拾取附加数据单元
// 包括：场景坐标系、三维标注、剖切面、辅助操作轴、轮盘等三维场景物件
// 交点距离和交点坐标
function GL_PICK_ADDITION_UNIT() {
    this.elementType = 0;
    this.elementIndex = -1;
    this.distance = 0;
    this.intersectPt = new Point3(0, 0, 0);

    this.Reset = function() {
        this.elementType = 0;
        this.elementIndex = -1;
        this.distance = 0;
        this.intersectPt.set(0, 0, 0);
    }

    this.Copy = function(copyUnit) {
        copyUnit.elementType = this.elementType;
        copyUnit.elementIndex = this.elementIndex;
        copyUnit.distance = this.distance;
        copyUnit.intersectPt.set(this.intersectPt.x, this.intersectPt.y, this.intersectPt.z);
    }
}

// 场景数据单位
function GL_SECNE_UNIT() {
    this._nLengthUnit = ADF_LENUNITTYPE_UNKOWN;                     // 长度单位,参看枚举型ADF_LENGTHUNITTYPE，Int32
    this._nMassUnit = ADF_MASSUNITTYPE_UNKOWN;                      // 质量单位,参看枚举型ADF_MASSUNITTYPE，Int32
    this._nTimeUnit = ADF_TIMEUNITTYPE_UNKOWN;                      // 时间单位,参看枚举型ADF_TIMEUNITTYPE，Int32

    this.Clone = function(adfUnit) {
        this._nLengthUnit = adfUnit._nLengthUnit;
        this._nMassUnit = adfUnit._nMassUnit;
        this._nTimeUnit = adfUnit._nTimeUnit;
    }
}

//===================================================================================================
/**
 * GLProgram显示相关控制量
 */

 // 材质显示优先级
const GL_ORIGINAL         = 0;        // 模型原始材质
const GL_USERDEFINE       = 1;        // 用户设置零件材质
const GL_USERPICKED       = 2;        // 用户拾取零件材质
const GL_COMMENT_PICKED   = 3;
const GL_MEASURE_PICKED   = 4;
const GL_CAPTURE_PICKED   = 5;

// 零件透明属性
const GLTRANS_ALL         = 1;        // 零件全透明
const GLTRANS_PART        = 2;        // 零件部分透明
const GLTRANS_NO          = 3;        // 零件全不透明

// 场景上方向
const GL_SCENEUPTYPEX     = 0;        // X轴
const GL_SCENEUPTYPEY     = 1;        // Y轴
const GL_SCENEUPTYPEZ     = 2;        // Z轴

// 复位数据类型
const HOME_ALL = 0;
const HOME_POSITION = 1;
const HOME_COLOR = 2;
const HOME_TRANS = 3;
const HOME_VISIBLE = 4;
const HOME_ANNOT = 5;
const HOME_TYPE_CAMERA = 6;

// 包围盒处于框选内
const RECT_ALL = 0;
const RECT_PARTITION = 1;
const RECT_NOT = 2;

// 拾取元素类型
const PICK_NONE = 0;
const PICK_OBJECT = 1;
const PICK_SURFACE = 2;
const PICK_GEOM_SURFACE = 3;
const PICK_GEOM_CURVE = 4;
const PICK_GEOM_POINT = 5;

// 测量模式
const MEASURE_NONE = 0;
const MEASURE_OBJECT = 1;
const MEASURE_SURFACE = 2;
const MEASURE_CURVE = 3;
const MEASURE_TWO_CURVES = 4;
const MEASURE_POINT = 5;
const MEASURE_TWO_POINTS = 6;
// 零件
const MEASURE_OBJECT_START = 10;
const MEASURE_OBJECT_CENTROID = MEASURE_OBJECT_START + 1;
const MEASURE_OBJECT_MASS = MEASURE_OBJECT_START + 2;
// 曲面
const MEASURE_SURFACE_START = 20;
const MEASURE_SURAFCE_AREA = MEASURE_SURFACE_START + 1;
const MEASURE_SURFACE_NORMAL = MEASURE_SURFACE_START + 2;
const MEASURE_SURFACE_CENTER = MEASURE_SURFACE_START + 3;
const MEASURE_TWO_SURFACES_DISTANCE = MEASURE_SURFACE_START + 4;
// 曲线
const MEASURE_CURVE_START = 30;
const MEASURE_CIRCLE_CENTER = MEASURE_CURVE_START + 1;
const MEASURE_CIRCLE_RADUS = MEASURE_CURVE_START + 2;
const MEASURE_ARC_CENTER = MEASURE_CURVE_START + 3;
const MEASURE_ARC_RADUS = MEASURE_CURVE_START + 4;
const MEASURE_ARC_ANGLE = MEASURE_CURVE_START + 5;
const MEASURE_LINE_LENGTH = MEASURE_CURVE_START + 6;
// 点
const MEASURE_POINT_START = 40;
const MEASURE_LINE_END_PT = MEASURE_POINT_START + 1;
// 曲线与曲线
const MEASURE_TWO_CURVE_START = 50;
const MEASURE_TWO_LINE_DISTANCE = MEASURE_TWO_CURVE_START + 1;
const MEASURE_TWO_LINE_ANGLE = MEASURE_TWO_CURVE_START + 2;
// 点与点
const MEASURE_TWO_POINT_START = 60;
const MEASURE_TWO_POINT_DISTANCE = MEASURE_TWO_POINT_START + 1;
//
const MEASURE_END = 100;

// 动态捕捉几何元素类型
const CAPTURE_NONE = 0;
const CAPTURE_OBJECT = 1;
const CAPTURE_GEOM_SURFACE = 3;
const CAPTURE_GEOM_CURVE = 4;
const CAPTURE_GEOM_POINT = 5;

// 鼠标操作模式
const MOUSE_OPERATION_MODE_DEFAULT = 0;
const MOUSE_OPERATION_MODE_MOVE = 1;
const MOUSE_OPERATION_MODE_ROTATE = 2;
const MOUSE_OPERATION_MODE_END = 3;

// 场景附加物件类型
const ADDITION_OBJECT_CLIP_PLANE = 0;
const ADDITION_OBJECT_SECTION_TOOL = 1;

//===================================================================================================
/**
 * 公共函数
 */
var oldVec = vec3.create();
var newVec = vec3.create();
var oldVec4 = vec4.create();
var newVec4 = vec4.create();
var invertMat = mat4.create();
var vecAxis1 = new Vector3(0, 0, 0);
var vecAxis2 = new Vector3(0, 0, 0);
var vecAxis3 = new Vector3(0, 0, 0);

function CalTranslatePoint(x, y, z, ObjectMat, newPoint) {
    oldVec[0] = x, oldVec[1] = y, oldVec[2] = z;
    vec3.transformMat4(newVec, oldVec, ObjectMat);
    newPoint.x = newVec[0], newPoint.y = newVec[1], newPoint.z = newVec[2];
}

function CalInversePoint(inPoint, ObjectMat, oriPoint) {
    mat4.invert(invertMat, ObjectMat);
    oldVec[0] = inPoint.x, oldVec[1] = inPoint.y, oldVec[2] = inPoint.z;
    vec3.transformMat4(newVec, oldVec, invertMat);
    oriPoint.x = newVec[0], oriPoint.y = newVec[1], oriPoint.z = newVec[2];
}

function CalMat4(matAdfOut, matGlOut) {
    mat4.set(matGlOut,
             matAdfOut._11, matAdfOut._12, matAdfOut._13, matAdfOut._14,
             matAdfOut._21, matAdfOut._22, matAdfOut._23, matAdfOut._24,
             matAdfOut._31, matAdfOut._32, matAdfOut._33, matAdfOut._34,
             matAdfOut._41, matAdfOut._42, matAdfOut._43, matAdfOut._44);
}

function CalADFMat(matrix) {
    let adfMat = new ADF_BASEMATRIX();
    adfMat._11 = matrix[0], adfMat._12 = matrix[1], adfMat._13 = matrix[2], adfMat._14 = matrix[3];
    adfMat._21 = matrix[4], adfMat._22 = matrix[5], adfMat._23 = matrix[6], adfMat._24 = matrix[7];
    adfMat._31 = matrix[8], adfMat._32 = matrix[9], adfMat._33 = matrix[10], adfMat._34 = matrix[11];
    adfMat._41 = matrix[12], adfMat._42 = matrix[13], adfMat._43 = matrix[14], adfMat._44 = matrix[15];
    return adfMat;
}

function CalTranslateAxis(origin, vecIn, mat, vecOut) {
    let temStart = new Point3(0, 0, 0);
    CalTranslatePoint(origin.x, origin.y, origin.z, mat, temStart);
    let temEnd = new Point3(0, 0, 0);
    CalTranslatePoint(origin.x + vecIn.x, origin.y + vecIn.y, origin.z + vecIn.z, mat, temEnd);
    vecOut.x = temEnd.x - temStart.x;
    vecOut.y = temEnd.y - temStart.y;
    vecOut.z = temEnd.z - temStart.z;
    ADFVec3Normalize(vecOut);
}

function ConvertCommetText(comment) {
   comment.stuAnnot.pNote.strText = GetSplitStringArray(comment.stuAnnot.pNote.strText);

    let tmpDateTime = comment.stuProperty._strDateTime.substring(0, 4);
    tmpDateTime += comment.stuProperty._strDateTime.substring(4, 6);
    tmpDateTime += comment.stuProperty._strDateTime.substring(6, 8);
    tmpDateTime += comment.stuProperty._strDateTime.substring(8, 10);
    tmpDateTime += comment.stuProperty._strDateTime.substring(10, 12);
    tmpDateTime += comment.stuProperty._strDateTime.substring(12, 14);
    comment.stuProperty._strDateTime = tmpDateTime;
}

function getStandardCurTime() {
    let tmpTime = "";
    curDate = new Date();
    tmpTime += curDate.getFullYear();
    tmpTime += curDate.getMonth() + 1;
    tmpTime += curDate.getDate();
    tmpTime += curDate.getHours();
    tmpTime += curDate.getMinutes();
    tmpTime += curDate.getSeconds();
    return tmpTime;
}

function GetStringLength(str) {
    var slength=0;
    for(i = 0; i < str.length; i++) {
        if ((str.charCodeAt(i) >= 0) && (str.charCodeAt(i) <= 255)) {
            slength = slength + 1;
        }
        else {
            slength = slength + 2;
        }
    }
    return slength;
}

function GetSplitStringArray(str) {
    // 转换成数组
    var snsArr = new Array(); 
    snsArr = str.split(/[(\r\n)\r\n]+/);
    return snsArr;
}

function ArrayPushPoint3(arr, point3) {
    arr.push(point3.x);
    arr.push(point3.y);
    arr.push(point3.z);
}

function CalDistanceToOrigin(pt1) {
    return Math.sqrt(pt1.x * pt1.x + pt1.y * pt1.y + pt1.z * pt1.z);
}

function CalDistanceOfPoint3d(pt1, pt2) {
    return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y) + (pt1.z - pt2.z) * (pt1.z - pt2.z));
}

function CalDistanceOfPoint2d(pt1, pt2) {
    return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
}

function CalDistanceToDir(pt, dir) {
    return dir.dot(pt);
}

function CalCoordsTransformMatrix(origin, axisX, axisY, axisZ, matrix) {
    vecAxis1.copy(axisX);
    vecAxis2.copy(axisY);
    vecAxis3.copy(axisZ);

	vecAxis3.normalize();
    vecAxis3.cross(vecAxis1, vecAxis2);
    vecAxis2.cross(vecAxis3, vecAxis1);

    mat4.set(matrix,
        vecAxis1.x, vecAxis1.y, vecAxis1.z, 0.0,
        vecAxis2.x, vecAxis2.y, vecAxis2.z, 0.0,
        vecAxis3.x, vecAxis3.y, vecAxis3.z, 0.0,
        origin.x, origin.y, origin.z, 0.0);
}

function CalRotationAxisMatrix(matrix, pV, dAngle) {
    mat4.identity(matrix);

    var dSin = Math.sin(dAngle);
    var dCos = Math.cos(dAngle);

    matrix[0] = dCos + pV.x * pV.x * (1.0 - dCos);
    matrix[1] = pV.x * pV.y * (1.0 - dCos) + pV.z * dSin;
    matrix[2] = pV.x * pV.z * (1.0 - dCos) - pV.y * dSin;
    matrix[4] = pV.x * pV.y * (1.0 - dCos) - pV.z * dSin;
    matrix[5] = dCos + pV.y * pV.y * (1.0 - dCos);
    matrix[6] = pV.y * pV.z * (1.0 - dCos) + pV.x * dSin;
    matrix[8] = pV.x * pV.z * (1.0 - dCos) + pV.y * dSin;
    matrix[9] = pV.y * pV.z * (1.0 - dCos) - pV.x * dSin;
    matrix[10] = dCos + pV.z * pV.z * (1.0 - dCos);
}

function CalVec3TransformCoordArray(floate32Arr, offset, len, stride, matrix) {
    for (let i = 0; i < len; i += stride) {
        oldVec[0] = floate32Arr[offset+i], oldVec[1] = floate32Arr[offset+i+1], oldVec[2] = floate32Arr[offset+i+2];
        vec3.transformMat4(newVec, oldVec, matrix);
        floate32Arr[offset+i] = newVec[0], floate32Arr[offset+i+1] = newVec[1], floate32Arr[offset+i+2] = newVec[2];
    }
}

function CalVec4Transform(pOut, pV, pM) {
    pOut.x = pV.x * pM[0] + pV.y * pM[4] + pV.z * pM[8] + pV.w * pM[12];
    pOut.y = pV.x * pM[1] + pV.y * pM[5] + pV.z * pM[9] + pV.w * pM[13];
    pOut.z = pV.x * pM[2] + pV.y * pM[6] + pV.z * pM[10] + pV.w * pM[14];
    pOut.w = pV.x * pM[3] + pV.y * pM[7] + pV.z * pM[11] + pV.w * pM[15];
}

function CalVec3TransformNormal(pOut, pV, pM) {
	oldVec4[0] = pV.x; oldVec4[1] = pV.y; oldVec4[2] = pV.z; oldVec4[3] = 0.0;
    vec4.transformMat4(newVec4, oldVec4, pM);
	pOut.x = newVec4[0]; pOut.y = newVec4[1]; pOut.z = newVec4[2];
}

function CalVec3TransformCoord(pOut, pV, pM) {
    oldVec[0] = pV.x, oldVec[1] = pV.y, oldVec[2] = pV.z;
    vec3.transformMat4(newVec, oldVec, pM);
    pOut.x = newVec[0], pOut.y = newVec[1], pOut.z = newVec[2];
}

function CalProjectPtToPlane(vPlanePt, vPlaneDir, vSrcPt, vPrjPt)
{
	let dDis = vPlaneDir.dot(vSrcPt) - vPlaneDir.dot(vPlanePt);
	vPrjPt.x = vSrcPt.x - vPlaneDir.x * dDis;
	vPrjPt.y = vSrcPt.y - vPlaneDir.y * dDis;
	vPrjPt.z = vSrcPt.z - vPlaneDir.z * dDis;
}

function CalRotateRoundCenter(pCenter, pV)
{

}

function GetSceneLengthUnitString() {
    switch (g_sceneUnit._nLengthUnit) {
        case ADF_LENUNITTYPE_MM:
            return "mm";
        case ADF_LENUNITTYPE_CM:
            return "cm";
        case ADF_LENUNITTYPE_M:
            return "m";
        case ADF_LENUNITTYPE_MICRON:
            return "um";
        case ADF_LENUNITTYPE_NANOMETER:
            return "nm";
        case ADF_LENUNITTYPE_FT:
            return "foot";
        case ADF_LENUNITTYPE_IN:
            return "inch";
        default:
            return "??";
    }
}

function GetSurfaceGeometry(geomSurface) {
    let geom = null;
    switch (geomSurface.nType) {
        case ADF_SURFT_PLANE:
            geom = geomSurface.Surfacedata.plane;
            break;
        case ADF_SURFT_CYLINDER:
            geom = geomSurface.Surfacedata.cylinder;
            break;
        case ADF_SURFT_CONE:
            geom = geomSurface.Surfacedata.cone;
            break;
        case ADF_SURFT_TORUS:
            geom = geomSurface.Surfacedata.torus;
            break;
        case ADF_SURFT_REVOLVE:
            geom = geomSurface.Surfacedata.revolve;
            break;
        case ADF_SURFT_TABCYL:
            geom = geomSurface.Surfacedata.tabcyl;
            break;
        case ADF_SURFT_SPHERE:
            geom = geomSurface.Surfacedata.sphere;
            break;
        default:
            return null;
    }
    return geom;
}

function GetCurveGeometry (geomCurve) {
    let geom = null;
    switch (geomCurve.nType) {
        case ADF_CURVT_LINE:
            geom = geomCurve.curvedata.line;
            break;
        case ADF_CURVT_ARC:
            geom = geomCurve.curvedata.arc;
            break;
        default:
            return;
    }
    return geom;
}

function IsObjectType(type) {
    if (type > MEASURE_OBJECT_START && type < MEASURE_SURFACE_START) {
        return true;
    }
    return false;
}

function IsSurfaceType(type) {
    if (type > MEASURE_SURFACE_START && type < MEASURE_CURVE_START) {
        return true;
    }
    return false;
}

function IsCurveType(type) {
    if (type > MEASURE_CURVE_START && type < MEASURE_POINT_START) {
        return true;
    }
    return false;
}

function IsPointType(type) {
    if (type > MEASURE_POINT_START && type < MEASURE_TWO_CURVE_START) {
        return true;
    }
    return false;
}

function IsTwoCurveType(type) {
    if (type > MEASURE_TWO_CURVE_START && type < MEASURE_TWO_POINT_START) {
        return true;
    }
    return false;
}

function IsTwoPointType(type) {
    if (type > MEASURE_TWO_POINT_START && type < MEASURE_END) {
        return true;
    }
    return false;
}

function GetMeasureScaleByMatrix(pMScale) {
    return Math.sqrt(pMScale[0] * pMScale[0] + pMScale[1] * pMScale[1] + pMScale[2] * pMScale[2]);
}

var vec1 = new Vector3(0, 0, 0);
var vec2 = new Vector3(0, 0, 0);

function CalVectorOfMesh(vertex1, vertex2, vertex3, vecOut) {
    vec1.set(vertex2.x - vertex1.x, vertex2.y - vertex1.y, vertex2.z - vertex1.z);
    vec2.set(vertex3.x - vertex2.x, vertex3.y - vertex2.y, vertex3.z - vertex2.z);
    vec1.cross(vec2, vecOut);
}

// 哈希函数
// 定义为对1000求余
var djb2Code = function (id) {
    return id % 1000;
}

// 定义哈希表
function HashMap() {
    var map = [];
    var keyValPair = function (key, value) {
        this.key = key;
        this.value = value;
    }

    this.put = function (key, value) {
        var position = djb2Code(key);
        if (map[position] == undefined) {
            map[position] = new LinkedList();
        }
        map[position].append(new keyValPair(key, value));
    }

    this.get = function (key) {
        var position = djb2Code(key);
        if (map[position] != undefined) {
            var current = map[position].getHead();
            while (current.next) {
                // 严格判断
                if (current.element.key === key) {      
                    return current.element.value;
                }
                current = current.next;
            }
            // 如果只有head节点，则不会进while.  还有尾节点，不会进while,这个判断必不可少
            if (current.element.key === key) {  
                return current.element.value;
            }
        }
        return undefined;
    }

    this.remove = function (key) {
        var position = djb2Code(key);
        if (map[position] != undefined) {
            var current = map[position].getHead();
            while (current.next) {
                if (current.element.key === key) {
                    map[position].remove(current.element);
                    if (map[position].isEmpty()) {
                        map[position] == undefined;
                    }
                    return true;
                }
                current = current.next;
            }
            if (current.element.key === key) {
                map[position].remove(current.element);
                if (map[position].isEmpty()) {
                    map[position] == undefined;
                }
                return true;
            }
        }
    }

    this.isEmpty = function () {
        if (map.length == 0) {
            return true;
        } else {
            return false;
        }
    }
}

// 定义链表
function LinkedList() {
    // 新元素构造
    var Node = function (element) {                 
        this.element = element;
        this.next = null;
    };
    var length = 0;
    var head = null;

    this.append = function (element) {
        // 构造新的元素节点
        var node = new Node(element);                
        var current;
        
        // 头节点为空时  当前结点作为头节点
        if (head === null) {
            head = node;
        } else {
            current = head;
            // 遍历，直到节点的next为null时停止循环，当前节点为尾节点
            while (current.next) {                  
                current = current.next;
            }
            // 将尾节点指向新的元素，新元素作为尾节点
            current.next = node;
        }
        // 更新链表长度
        length++;                                   
    }

    this.removeAt = function (position) {
        if (position > -1 && position < length) {
            var current = head;
            var index = 0;
            var previous;
            if (position == 0) {
                head = current.next;
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            length--;
            return current.element;
        } else {
            return null;
        }
    }

    this.insert = function (position, element) {
        // 校验边界
        if (position > -1 && position <= length) {
            var node = new Node(element);
            current = head;
            var index = 0;
            var previous;

            // 作为头节点，将新节点的next指向原有的头节点。
            if (position == 0) {
                node.next = current;

                // 新节点赋值给头节点
                head = node;                        
            } else {
                while (index++ < position) {
                    previous = current;
                    // 遍历结束得到当前position所在的current节点，和上一个节点
                    current = current.next;
                }         
                // 上一个节点的next指向新节点  新节点指向当前结点，可以参照上图来看                          
                previous.next = node;
                node.next = current;
            }
            length++;
            return true;
        } else {
            return false;
        }
    }

    this.toString = function () {
        var current = head;
        var string = '';
        while (current) {
            string += ',' + current.element;
            current = current.next;
        }
        return string;
    }

    this.indexOf = function (element) {
        var current = head;
        var index = -1;
        while (current) {
            // 从头节点开始遍历
            if (element === current.element) {
                return index;
            }
            index++;
            current = current.next;
        }
        return -1;
    }

    this.getLength = function () {
        return length;
    }

    this.getHead = function () {
        return head;
    }

    this.isEmpty = function () {
        return length == 0;
    }
}

/**
 * 测试，两个立方体
 * 返回：GLObjectSet    立方体实例数据集
 *      GLPartSet      立方体零件数据集
 *      GLMatertalSet  材质数据�?
 */
 function TestCube() {
    var Cube = new Cube();
    var CubeLODPart = new GL_PARTLODDATA();
    CubeLODPart._arrVertex = Cube.mesh;
    CubeLODPart._arrSurfaceVertexNum = Cube.subMeshCounts;
    var CubePart = new GL_PART();
    CubePart._arrPartLODData.push(CubeLODPart);
    var partSet = new GL_PARTSET();
    partSet._arrPartSet.push(CubePart);

    var matertalSet = new GL_MATERIALSET();
    var defaultMtl = new ADF_MTL_SAVEDATA();
    defaultMtl._uMtlID = 20000;
    defaultMtl._strName = "默认材质";
    defaultMtl._MtlData = g_materialData.Default;
    matertalSet._arrMaterialSet.push(defaultMtl);
    var pinkMtl = new ADF_MTL_SAVEDATA();
    pinkMtl._uMtlID = 20001;
    pinkMtl._strName = "粉色材质";
    pinkMtl._MtlData = g_materialData.Pink;
    matertalSet._arrMaterialSet.push(pinkMtl);
    var greenMtl = new ADF_MTL_SAVEDATA();
    greenMtl._uMtlID = 20002;
    greenMtl._strName = "绿色材质";
    greenMtl._MtlData = g_materialData.Green;
    matertalSet._arrMaterialSet.push(greenMtl);

    var object1 = new GL_OBJECT();
    object1._uPartIndex = 0;
    object1._arrSurfaceMaterialIndex.push(0);
    object1._arrSurfaceMaterialIndex.push(1);
    object1._arrSurfaceMaterialIndex.push(2);
    object1._arrSurfaceMaterialIndex.push(0);
    object1._arrSurfaceMaterialIndex.push(1);
    object1._arrSurfaceMaterialIndex.push(2);
    object1._uObjectVertexNum = 36;
    var object2 = new GL_OBJECT();
    object2._uPartIndex = 0;
    object2._arrSurfaceMaterialIndex.push(1);
    object2._arrSurfaceMaterialIndex.push(1);
    object2._arrSurfaceMaterialIndex.push(1);
    object2._arrSurfaceMaterialIndex.push(1);
    object2._arrSurfaceMaterialIndex.push(1);
    object2._arrSurfaceMaterialIndex.push(1);
    object2._uObjectVertexNum = 36;
    var matTmp = mat4.create();
    var trans = vec3.create();
    trans[0] = -2;
    trans[2] = -2;
    object2._matObject = mat4.translate(matTmp, object2._matObject, trans);
    var objectSet = new GL_OBJECTSET();
    objectSet._arrObjectSet.push(object1);
    objectSet._arrObjectSet.push(object2);

    return {
        GLObjectSet: objectSet,
        GLPartSet: partSet,
        GLMatertalSet: matertalSet,
    };
}