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

function Point2(x, y) {
    this.x = x;
    this.y = y;

    this.set = function(xx, yy) {
        this.x = xx;
        this.y = yy;
    }

    this.copy = function() {
        let copyPt = new Point2(this.x, this.y);
        return copyPt;
    }
}

function Point3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.set = function(xx, yy, zz) {
        this.x = xx;
        this.y = yy;
        this.z = zz;
    }

    this.copy = function() {
        let copyPt = new Point3(this.x, this.y, this.z);
        return copyPt;
    }
}

function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.set = function(xx, yy, zz) {
        this.x = xx;
        this.y = yy;
        this.z = zz;
    }

    this.flip = function() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }

    this.normalize = function() {
        let base = Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
        this.x = this.x / Math.pow(base, 0.5);
        this.y = this.y / Math.pow(base, 0.5);
        this.z = this.z / Math.pow(base, 0.5);
    }

    this.cross = function(b) {
        let x1 = this.y*b.z - this.z*b.y;
        let y1 = this.z*b.x - this.x*b.z;
        let z1 = this.x*b.y - this.y*b.x;
        return new Vector3(x1, y1, z1);
    }

    this.dot = function(b) {
        return this.x*b.x + this.y*b.y + this.z*b.z;
    }
}

function Rect2D(x1, y1, x2, y2) {
    this.min = new Point2(x1, y1);
    this.max = new Point2(x2, y2);

    this.set = function(xx1, yy1, xx2, yy2) {
        this.min.x = xx1;
        this.min.y = yy1;
        this.max.x = xx2;
        this.max.y = yy2;
    }

    this.copy = function(rect2D) {
        this.min.x = rect2D.min.x;
        this.min.y = rect2D.min.y;
        this.max.x = rect2D.max.x;
        this.max.y = rect2D.max.y;
    }

    this.normalize = function() {
        let min_x = Math.min(this.min.x, this.max.x);
        let min_y = Math.min(this.min.y, this.max.y);
        let max_x = Math.max(this.min.x, this.max.x);
        let max_y = Math.max(this.min.y, this.max.y);
        this.min.x = min_x, this.min.y = min_y;
        this.max.x = max_x, this.max.y = max_y;
    }

    this.isPointInside = function(pt) {
        if (pt.x > this.min.x && pt.x < this.max.x &&
            pt.y > this.min.y && pt.y < this.max.y) {
            return true;
        }
        return false;
    }
}

// 远裁面
function GL_FarPlane() {
    this.vertex = [
        -1.0, -1.0, 1.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 1.0, 0.0, 0.0,
        1.0, 1.0, 1.0, 0.0, 0.0,
        -1.0, 1.0, 1.0, 1.0, 0.0,
        -1.0, -1.0, 1.0, 1.0, 1.0];

    this.count = 6;
}

// 包围盒数据，一个包围盒由8顶点构成
// 其中index 0和7分别为最小最大顶点
function GL_Box() {
    this._Vertex = new Array(8);
    this._Vertex[0] = new Point3(0, 0, 0);
    this._Vertex[1] = new Point3(0, 0, 0);
    this._Vertex[2] = new Point3(0, 0, 0);
    this._Vertex[3] = new Point3(0, 0, 0);
    this._Vertex[4] = new Point3(0, 0, 0);
    this._Vertex[5] = new Point3(0, 0, 0);
    this._Vertex[6] = new Point3(0, 0, 0);
    this._Vertex[7] = new Point3(0, 0, 0);

    this.Copy = function(data) {
        for (let i=0; i<this._Vertex.length; i++) {
            this._Vertex[i] = data._Vertex[i];
        }
    }

    this.MinVertex = function(minPoint) {
        let minX = this._Vertex[0].x, minY = this._Vertex[0].y, minZ = this._Vertex[0].z;
        for (let i=1; i<this._Vertex.length; i++) {
            if (this._Vertex[i].x < minX) {
                minX = this._Vertex[i].x;
            }
            if (this._Vertex[i].y < minY) {
                minY = this._Vertex[i].y;
            }
            if (this._Vertex[i].z < minZ) {
                minZ = this._Vertex[i].z;
            }
        }
        minPoint.x = minX, minPoint.y = minY, minPoint.z = minZ;
    }

    this.MaxVertex = function(maxPoint) {
        let maxX = this._Vertex[0].x, maxY = this._Vertex[0].y, maxZ = this._Vertex[0].z;
        for (let i=1; i<this._Vertex.length; i++) {
            if (this._Vertex[i].x > maxX) {
                maxX = this._Vertex[i].x;
            }
            if (this._Vertex[i].y > maxY) {
                maxY = this._Vertex[i].y;
            }
            if (this._Vertex[i].z > maxZ) {
                maxZ = this._Vertex[i].z;
            }
        }
        maxPoint.x = maxX, maxPoint.y = maxY, maxPoint.z = maxZ;
    }
}

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
    this._arrVertex = null;
    this._arrSubsetPrimitType = null;
    this._arrSurfaceVertexNum = new Array();
    this._arrGeomSurfaceIndex = new Array();
    this._arrCurveVertexNum = new Array();
    this._arrGeomCurveIndex = new Array();
    this._boxset = new GL_BoxSet();
    this._uIsUV = 1;

    this.Clear = function() {
        // if (this._arrVertex != null) {    // float32array数据不能用此方法清空内存
        //     this._arrVertex.splice(0, this._arrVertex.length);
        // }
        if (this._arrSubsetPrimitType != null) {
            this._arrSubsetPrimitType.splice(0, this._arrSubsetPrimitType.length);
        }
        this._arrSurfaceVertexNum.splice(0, this._arrSurfaceVertexNum.length);
        this._arrGeomSurfaceIndex.splice(0, this._arrGeomSurfaceIndex.length);
        this._arrCurveVertexNum.splice(0, this._arrCurveVertexNum.length);
        this._arrGeomCurveIndex.splice(0, this._arrGeomCurveIndex.length);
        this._boxset.Clear();
    }

    this.GetSurfaceVertexSum = function(fromIndex, toIndex) {
        let sum = 0;
        for (let i = fromIndex; i < toIndex; ++i) {
            sum += this._arrSurfaceVertexNum[i];
        }
        return sum;
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
}

// 零件数据集
function GL_PARTSET() {
    this._uLODLevel = 0;
    this._arrPartSet = new Array();

    this.Clear = function() {
        for (let i = 0; i < this._arrPartSet.length; ++i) {
            this._arrPartSet[i].Clear();
        }
        this._arrPartSet.splice(0, this._arrPartSet.length);
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
    this._uPrimitType = ADFPT_TRIANGLELIST;
    this._arrSurfaceMaterialIndex = new Array();
    this._nFillMode = ADFFILL_SOLID;
    this._nCullMode = ADFCULL_NONE;
    this._uObjectVertexNum = 0;
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

// 文本长度与文本框大小对应关系表
// length: 0-5，   width: 100
//         5-10,   width: 200
const WIDTH_UNIT = 100;
const HEIGHT_UNIT = 25;
function textMapWidth(text) {
    return WIDTH_UNIT;
}

// 用户批注数据
function GL_USRANNOTATION() {
    this.show = true;                      // 文本框使用参数
    this.disabled = false;
    this.style = null;
    this.value = "文本";
    this.type = "";

    this._uAnnotID = -1;
    this._uAnnotName = "节点";              // 模型树显示
    this._uAnnotText = "文本";              // 批注控件显示
    this._strUsrName = "unknow";            // 作者
    this._strCreateTime = "19710101010159"; // 注释日期，精确到秒，总共14位
    this._uStartFrame = 0;                  // 起始帧
    this._uFrameSize = 0;                   // 帧段长度
    this._attachPt = new Point2(0, 0);      // 批注悬挂点

    this.cvtPointToStyle = function(point2d) {
        this.style = {left: 0, top: 0, width: 0};
        this.style.top = point2d.y - HEIGHT_UNIT;
        this.style.width = textMapWidth(this._uAnnotText);
        this.style.left = point2d.x - this.style.width / 2;
        return this.style;
    }

    this.cvtStyleToPoint = function() {
        let y = this.style.top + HEIGHT_UNIT;
        let x = this.style.left + this.style.width / 2;
        return new Point2(x, y);
    }

    this.copyFromScle = function(comment, point2d, isVisible) {
        this._uAnnotID = comment.stuAnnot.uID;
        this._strUsrName = comment.stuProperty._strUserName;
        this._strCreateTime = comment.stuProperty._strDateTime;
        this._uAnnotText = comment.stuAnnot.pNote.strText;
        this.value = comment.stuAnnot.pNote.strText;
        this.style = this.cvtPointToStyle(point2d);
        this.disabled = true;

        // 根据有无引线，判断显示样式
        if (comment.stuAnnot.pNote.arrLeaderPos == null || comment.stuAnnot.pNote.arrLeaderPos.length == 0) {
            this.type = "input";
        }
        
        this.show = isVisible;
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
function GL_MESH_VAO_UNIT(num) {
    this.splitSize = 1;               // VAO被分割时记录
    this.splitFlags = null;
    this.arrVertexCounts = null;      // VAO顶点数量，数组长度等于合并的surface数量

    this.uintVertexNum = 0;           // 记录不变量
    this.uintMaterialIndex = 0;
    this.surfaceStart = -1;
    this.surfaceCount = 0;

    if (num < 0) {
        return;
    } else if (num == 0) {
        this.arrVertexCounts = new Array();
    } else {
        this.arrVertexCounts = new Array();
        for (let i = 0; i < num; ++i) {
            this.arrVertexCounts.push(0);
        }
    }

    this.InitFlags = function() {
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

function GL_MEASURE_SHAPE() {
    this.objectIndex = -1;
    this.surfaceIndex = -1;
    this.geomSurfaceIndex = -1;
    this.geomCurveIndex = -1;
    this.geomPointIndex = -1;
    this.arrAxis = null;
    this.arrShapePos = null;
    this.leaderPos = new Point3(0, 0, 0);

    this.setObjectShape = function(objectIndex, box) {
        this.objectIndex = objectIndex;
        // 包围盒顶点作为引线点
        let end1 = box._Vertex[0].copy();
        let end2 = box._Vertex[7].copy();
        this.arrShapePos = new Array();
        this.arrShapePos.push(end1);
        this.arrShapePos.push(end2);
        getModelBoxCenter(box, this.leaderPos);
    }

    this.setSurfaceShape = function(objectIndex, surfaceIndex, geomSurfaceIndex, geomSurface) {
        this.objectIndex = objectIndex;
        this.surfaceIndex = surfaceIndex;
        this.geomSurfaceIndex = geomSurfaceIndex;
        // 计算轴线坐标（包围盒为轴线长）
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        let surfaceGeom = GetSurfaceGeometry(geomSurface);
        let surfaceBox = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._SurfaceBoxes[surfaceIndex];
        let axisLen = 0;
        if (geomSurface.nType == ADF_SURFT_PLANE) {
            axisLen = getModelBoxLength(surfaceBox) / 10;
        } else {
            axisLen = getModelBoxLength(surfaceBox);
        }
        // 将曲面中心点投影到包围盒中心平面
        let boxCenter = new Point3(0, 0, 0);
        let projectionPt = new ADF_BASEFLOAT3();
        getModelBoxCenter(surfaceBox, boxCenter);
        ProjectPtToPlane(boxCenter, surfaceGeom.vAxisZ, surfaceGeom.vOrigin, projectionPt);
        this.leaderPos.set(projectionPt.x, projectionPt.y, projectionPt.z);
        let end1 = new Point3(this.leaderPos.x + surfaceGeom.vAxisZ.x * axisLen / 2,
            this.leaderPos.y + surfaceGeom.vAxisZ.y * axisLen / 2,
            this.leaderPos.z + surfaceGeom.vAxisZ.z * axisLen / 2);
        let end2 = new Point3(this.leaderPos.x - surfaceGeom.vAxisZ.x * axisLen / 2,
            this.leaderPos.y - surfaceGeom.vAxisZ.y * axisLen / 2,
            this.leaderPos.z - surfaceGeom.vAxisZ.z * axisLen / 2);
        this.arrAxis = new Array();
        this.arrAxis.push(end1);
        this.arrAxis.push(end2);
    }

    this.setCurveShape = function(objectIndex, geomCurveIndex, geomCurve) {
        this.objectIndex = objectIndex;
        this.geomCurveIndex = geomCurveIndex;
        let geom = null;

        switch (geomCurve.nType) {
            case ADF_CURVT_LINE:
                geom = geomCurve.curvedata.line;
                this.leaderPos.set((geom.end1.x + geom.end2.x) / 2, (geom.end1.y + geom.end2.y) / 2, (geom.end1.z + geom.end2.z) / 2);
                break;
            case ADF_CURVT_ARC:
                geom = geomCurve.curvedata.arc;
                this.leaderPos.set(geom.vOrigin.x, geom.vOrigin.y, geom.vOrigin.z);
                break;
            default:
                return;
        }

        // 计算引线坐标
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        let geomShapeCount = g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts[geomCurveIndex];
        let offset = 0;
        for (let i = 0; i < geomCurveIndex; ++i) {
            offset += g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts[i] * 3;
        }
        if (geomCurve.nType == ADF_CURVT_ARC) {
            let end1 = new Point3(
                g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints[offset],
                g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints[offset + 1],
                g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints[offset + 2]);
            let end2 = new Point3(
                g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints[offset + geomShapeCount * 3 - 3],
                g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints[offset + geomShapeCount * 3 - 2],
                g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints[offset + geomShapeCount * 3 - 1]);
            this.arrShapePos = new Array();
            this.arrShapePos.push(end1);
            this.arrShapePos.push(end2);
        }
    }

    this.setPointShape = function(objectIndex, geomPointIndex, point) {
        this.objectIndex = objectIndex;
        this.geomPointIndex = geomPointIndex;
        this.leaderPos.set(point.x, point.y, point.z);
    }

    this.Copy = function() {
        let copyUnit = new GL_MEASURE_SHAPE();
        copyUnit.objectIndex = this.objectIndex;
        copyUnit.surfaceIndex = this.surfaceIndex;
        copyUnit.geomSurfaceIndex = this.geomSurfaceIndex;
        copyUnit.geomCurveIndex = this.geomCurveIndex;
        copyUnit.geomPointIndex = this.geomPointIndex;
        if (this.arrAxis != null) {
            copyUnit.arrAxis = new Array();
            for (let i = 0; i < this.arrAxis.length; ++i) {
                copyUnit.arrAxis.push(this.arrAxis[i].copy());
            }
        }
        if (this.arrShapePos != null) {
            copyUnit.arrShapePos = new Array();
            for (let i = 0; i < this.arrShapePos.length; ++i) {
                copyUnit.arrShapePos.push(this.arrShapePos[i].copy());
            }
        }
        copyUnit.leaderPos.set(this.leaderPos.x, this.leaderPos.y, this.leaderPos.z);
        return copyUnit;
    }

    this.Clear = function() {
        if (this.arrAxis != null) {
            this.arrAxis.splice(0, this.arrAxis.length);
        }
        if (this.arrShapePos != null) {
            this.arrShapePos.splice(0, this.arrShapePos,length);
        }
    }
}

const MEASURE_TEXT_WIDTH = 8;
const MEASURE_TEXT_HEIGHT = 15;
const MEASURE_TEXT_MIN_WIDTH_NUM = 5;
const MEASURE_TEXT_MIN_HEIGHT_NUM = 2;

function GL_MEASURE_INFO() {
    this.attachPos = new Point3(0, 0, 0);
    this.displayText = new Array();
    this.displayTextPos = new Array();
    this.rectWidth = 0;
    this.rectHeight = 0;

    this.setObjectInfo = function(objectIndex, box, mat) {
        this.type = 
        this.displayText.push("物件");
        getModelBoxCenter(box, this.attachPos);
        let center = new Point3(0, 0, 0);
        CalTranslatePoint(this.attachPos.x, this.attachPos.y, this.attachPos.z, mat, center);
        let centerText = "中心点：(" + center.x.toFixed(1) + ", " + center.y.toFixed(1) + ", " + center.z.toFixed(1) + ")";
        this.displayText.push(centerText);
        let objectID = glRunTime.getObjectIdByIndex(objectIndex);
        let subParams = glRunTime.getObjectParamsByID(objectID, g_GLData.GLModelTreeNode);
        for (let i = 0; i < subParams.length; ++i) {
            if (subParams[i]._strName == "质量" || subParams[i]._strName == "重心" || subParams[i]._strName == "表面积" ||
                subParams[i]._strName == "体积" || subParams[i]._strName == "密度") {
                this.displayText.push(subParams[i]._strName + "：" + subParams[i]._strValue);
            }
        }
        this.CalculateText();
    }

    this.setSurfaceCommonInfo = function(geom, mat, center, centerText, axisDir, axisDirText) {
        let realWorldPos = new Point3(0, 0, 0);
        CalTranslatePoint(center.x, center.y, center.z, mat, realWorldPos);
        centerText = "中心点：(" + realWorldPos.x.toFixed(1) + ", " + realWorldPos.y.toFixed(1) + ", " + realWorldPos.z.toFixed(1) + ")";
        this.displayText.push(centerText);
        CalTranslateAxis(center, geom.vAxisZ, mat, axisDir);
        axisDirText = "轴线方向：(" + axisDir.x.toFixed(1) + ", " + axisDir.y.toFixed(1) + ", " + axisDir.z.toFixed(1) + ")";
        this.displayText.push(axisDirText);
    }

    this.setSurfaceInfo = function(objectIndex, geomSurface, center) {
        let geom = null;
        let mat = g_webglControl.m_arrObjectMatrix[objectIndex];
        let tempRadius = 0;
        let centerText = null;
        let axisDir = new Point3(0, 0, 0);
        let axisDirText = null;
        switch (geomSurface.nType) {
            case ADF_SURFT_PLANE:
                geom = geomSurface.Surfacedata.plane;
                this.displayText.push("平面");
                this.setSurfaceCommonInfo(geom, mat, center, centerText, axisDir, axisDirText);
                break;
            case ADF_SURFT_CYLINDER:
                geom = geomSurface.Surfacedata.cylinder;
                tempRadius = geom.radius * GetMeasureScaleByMatrix(mat);
                this.displayText.push("圆柱面");
                this.setSurfaceCommonInfo(geom, mat, center, centerText, axisDir, axisDirText);
                this.displayText.push("半径：" + tempRadius.toFixed(2) + GetSceneLengthUnitString());
                break;
            case ADF_SURFT_CONE:
                geom = geomSurface.Surfacedata.cone;
                this.displayText.push("圆锥面");
                this.setSurfaceCommonInfo(geom, mat, center, centerText, axisDir, axisDirText);
                let angle = 2* geom.alpha * 180 / Math.PI;
                this.displayText.push("锥顶角：" + angle.toFixed(2) + "°");
                break;
            case ADF_SURFT_TORUS:
                geom = geomSurface.Surfacedata.torus;
                this.displayText.push("圆环面");
                this.setSurfaceCommonInfo(geom, mat, center, centerText, axisDir, axisDirText);
                this.displayText.push("内半径：" + tempRadius.toFixed(2) + GetSceneLengthUnitString());
                tempRadius = geom.radius2 * GetMeasureScaleByMatrix(mat);
                this.displayText.push("外半径：" + tempRadius.toFixed(2) + GetSceneLengthUnitString());
                break;
            case ADF_SURFT_REVOLVE:
                geom = geomSurface.Surfacedata.revolve;
                this.displayText.push("旋转面");
                this.setSurfaceCommonInfo(geom, mat, center, centerText, axisDir, axisDirText);
                break;
            case ADF_SURFT_TABCYL:
                geom = geomSurface.Surfacedata.tabcyl;
                this.displayText.push("列表柱面");
                break;
            case ADF_SURFT_SPHERE:
                geom = geomSurface.Surfacedata.sphere;
                this.displayText.push("球面");
                this.setSurfaceCommonInfo(geom, mat, center, centerText, axisDir, axisDirText);
                tempRadius = geom.radius * GetMeasureScaleByMatrix(mat);
                this.displayText.push("半径：" + tempRadius.toFixed(2) + GetSceneLengthUnitString());
                break;
            default:
                return;
        }
        this.attachPos.set(geom.vOrigin.x, geom.vOrigin.y, geom.vOrigin.z);
        this.CalculateText();
    }

    this.setCurveInfo = function(geomCurve, mat) {
        let geom = null;
        let angle = 0;
        switch (geomCurve.nType) {
            case ADF_CURVT_LINE:
                geom = geomCurve.curvedata.line;
                this.attachPos.set((geom.end1.x + geom.end2.x) / 2, (geom.end1.y + geom.end2.y) / 2, (geom.end1.z + geom.end2.z) / 2);
                this.displayText.push("直线");
                let tempDistance = CalDistanceOfPoint3d(geom.end1, geom.end2);
                tempDistance *= GetMeasureScaleByMatrix(mat);
                this.displayText.push("长度：" + tempDistance.toFixed(2) + GetSceneLengthUnitString());
                break;
            case ADF_CURVT_ARC:
                geom = geomCurve.curvedata.arc;
                angle = Math.abs(geom.fEndAngle - geom.fStartAngle);
                this.attachPos.set(geom.vOrigin.x, geom.vOrigin.y, geom.vOrigin.z);
                this.displayText.push("圆弧");
                let tempRadius = geom.fRadius;
                tempRadius *= GetMeasureScaleByMatrix(mat);
                this.displayText.push("半径：" + tempRadius.toFixed(2) + GetSceneLengthUnitString());
                this.displayText.push("角度：" + (angle / Math.PI * 180).toFixed(2) + "°");
                this.displayText.push("圆弧长度：" + (2 * Math.PI * tempRadius).toFixed(2) + GetSceneLengthUnitString());
                break;
            default:
                return;
        }
        this.CalculateText();
    }

    this.setPointInfo = function(geomPointIndex, point, mat) {
        if (geomPointIndex == -1) {
            this.displayText.push("拾取点");
        } else {
            this.displayText.push("顶点");
        }
        this.attachPos.set(point.x, point.y, point.z);
        let ptWld = new Point3();
        CalTranslatePoint(point.x, point.y, point.z, mat, ptWld);
        let centerText = "(" + ptWld.x.toFixed(1) + ", " + ptWld.y.toFixed(1) + ", " + ptWld.z.toFixed(1) + ")";
        this.displayText.push(centerText);
        this.CalculateText();
    }

    this.setTwoPointsInfo = function(firstPtUnit, secondPtUnit) {
        let typeFirstPt = null;
        let typeSecondPt = null;
        let posFirstPt = new Point3(0, 0, 0);
        let posSecondPt = new Point3(0, 0, 0);
        typeFirstPt = firstPtUnit.geomPointIndex == -1 ? "拾取点" : "顶点";
        typeSecondPt = secondPtUnit.geomPointIndex == -1 ? "拾取点" : "顶点";
        let matFirstPt = g_webglControl.m_arrObjectMatrix[firstPtUnit.objectIndex];
        let matSecondPt = g_webglControl.m_arrObjectMatrix[secondPtUnit.objectIndex];
        CalTranslatePoint(firstPtUnit.intersectPt.x, firstPtUnit.intersectPt.y, firstPtUnit.intersectPt.z, matFirstPt, posFirstPt);
        CalTranslatePoint(secondPtUnit.intersectPt.x, secondPtUnit.intersectPt.y, secondPtUnit.intersectPt.z, matSecondPt, posSecondPt);
        this.displayText.push(typeFirstPt + "-" + typeSecondPt);
        this.displayText.push("第一点：(" + posFirstPt.x.toFixed(1) + ", " + posFirstPt.y.toFixed(1) + ", " + posFirstPt.z.toFixed(1) + ")");
        this.displayText.push("第二点：(" + posSecondPt.x.toFixed(1) + ", " + posSecondPt.y.toFixed(1) + ", " + posSecondPt.z.toFixed(1) + ")");
        this.displayText.push("距离：" + CalDistanceOfPoint3d(posFirstPt, posSecondPt).toFixed(1) + GetSceneLengthUnitString());
        this.CalculateText();
        this.attachPos.set(firstPtUnit.intersectPt.x, firstPtUnit.intersectPt.y, firstPtUnit.intersectPt.z);
    }

    this.setTwoCurvesInfo = function(firstCurveUnit, firstGeomCurve, secondCurveUnit, secondGeomCurve) {
        let typeFirstCurve = firstGeomCurve.nType == ADF_CURVT_LINE ? "直线" : "圆弧";
        let typeSecondCurve = secondGeomCurve.nType == ADF_CURVT_LINE ? "直线" : "圆弧";
        this.displayText.push(typeFirstCurve + "-" + typeSecondCurve);

        let matFirstCurve = null, matSecondCurve = null;
        let partIndexFirst = g_GLObjectSet._arrObjectSet[firstCurveUnit.objectIndex]._uPartIndex;
        let partIndexSecond = g_GLObjectSet._arrObjectSet[secondCurveUnit.objectIndex]._uPartIndex;
        let ptOffsetFirst = 0, ptOffsetSecond = 0;
        let ptOfShapeFirst = null, ptOfShapeSecond = null;
        let ptCountFirst = null, ptCountSecond = null;
        let minDistance = 0;
        let tmpIntersectPt = new Point3(0, 0, 0);
        let firstLineEnd1 = new Point3(0, 0, 0), firstLineEnd2 = new Point3(0, 0, 0);
        let secondLineEnd1 = new Point3(0, 0, 0), secondLineEnd2 = new Point3(0, 0, 0);
        if (firstGeomCurve.nType == ADF_CURVT_LINE && secondGeomCurve.nType == ADF_CURVT_LINE) {
            // 两直线之间求解最小距离和空间夹角
            matFirstCurve = g_webglControl.m_arrObjectMatrix[firstCurveUnit.objectIndex];
            matSecondCurve = g_webglControl.m_arrObjectMatrix[secondCurveUnit.objectIndex];
            ptOfShapeFirst = g_GLPartSet._arrPartSet[partIndexFirst]._CurveShape._arrShapeOfPoints;
            ptOfShapeSecond = g_GLPartSet._arrPartSet[partIndexSecond]._CurveShape._arrShapeOfPoints;
            ptCountFirst = g_GLPartSet._arrPartSet[partIndexFirst]._CurveShape._arrShapeOfPointsCounts;
            ptCountSecond = g_GLPartSet._arrPartSet[partIndexSecond]._CurveShape._arrShapeOfPointsCounts;
            for (let i = 0; i < firstCurveUnit.geomCurveIndex; ++i) {
                ptOffsetFirst += ptCountFirst[i] * 3;
            }
            for (let i = 0; i < secondCurveUnit.geomCurveIndex; ++i) {
                ptOffsetSecond += ptCountSecond[i] * 3;
            }
            CalTranslatePoint(ptOfShapeFirst[ptOffsetFirst], ptOfShapeFirst[ptOffsetFirst + 1],
                ptOfShapeFirst[ptOffsetFirst + 2], matFirstCurve, firstLineEnd1);
            CalTranslatePoint(ptOfShapeFirst[ptOffsetFirst + 3], ptOfShapeFirst[ptOffsetFirst + 4],
                ptOfShapeFirst[ptOffsetFirst + 5], matFirstCurve, firstLineEnd2);
            CalTranslatePoint(ptOfShapeSecond[ptOffsetSecond], ptOfShapeSecond[ptOffsetSecond + 1],
                ptOfShapeSecond[ptOffsetSecond + 2], matSecondCurve, secondLineEnd1);
            CalTranslatePoint(ptOfShapeSecond[ptOffsetSecond + 3], ptOfShapeSecond[ptOffsetSecond + 4],
                ptOfShapeSecond[ptOffsetSecond + 5], matSecondCurve, secondLineEnd2);
            minDistance = CalcDistanceOfTwoLineSeg(firstLineEnd1, firstLineEnd2, secondLineEnd1, secondLineEnd2, tmpIntersectPt);
            this.displayText.push("最近距离：" + minDistance.toFixed(1) + GetSceneLengthUnitString());
            this.attachPos.set((firstGeomCurve.curvedata.line.end1.x + firstGeomCurve.curvedata.line.end2.x) / 2,
                (firstGeomCurve.curvedata.line.end1.y + firstGeomCurve.curvedata.line.end2.y) / 2,
                (firstGeomCurve.curvedata.line.end1.z + firstGeomCurve.curvedata.line.end2.z) / 2);
            let dirFirstLine = new Point3(firstLineEnd2.x - firstLineEnd1.x, firstLineEnd2.y - firstLineEnd1.y, firstLineEnd2.z - firstLineEnd1.z);
            let dirSecondLine = new Point3(secondLineEnd2.x - secondLineEnd1.x, secondLineEnd2.y - secondLineEnd1.y, secondLineEnd2.z - secondLineEnd1.z);
            let tmpABC = dirFirstLine.x * dirSecondLine.x + dirFirstLine.y * dirSecondLine.y + dirFirstLine.z * dirSecondLine.z;
            let tmpAA = Math.sqrt(dirFirstLine.x * dirFirstLine.x + dirFirstLine.y * dirFirstLine.y + dirFirstLine.z * dirFirstLine.x);
            let tmpBB = Math.sqrt(dirSecondLine.x * dirSecondLine.x + dirSecondLine.y * dirSecondLine.y + dirSecondLine.z * dirSecondLine.x);
            let angle = Math.acos(tmpABC / tmpAA / tmpBB) / Math.PI * 180;
            this.displayText.push("空间夹角：" + angle.toFixed(1) + "°");

        } else if ((firstGeomCurve.nType == ADF_CURVT_LINE && secondGeomCurve.nType == ADF_CURVT_ARC) ||
            (firstGeomCurve.nType == ADF_CURVT_ARC && secondGeomCurve.nType == ADF_CURVT_LINE)) {
            let tmpArcIndex = 0;
            // 直线-圆弧或圆弧-直线之间求解最小距离，1st表示直线，2nd表示圆弧
            if (firstGeomCurve.nType == ADF_CURVT_LINE && secondGeomCurve.nType == ADF_CURVT_ARC) {
                this.attachPos.set((firstGeomCurve.curvedata.line.end1.x + firstGeomCurve.curvedata.line.end2.x) / 2,
                    (firstGeomCurve.curvedata.line.end1.y + firstGeomCurve.curvedata.line.end2.y) / 2,
                    (firstGeomCurve.curvedata.line.end1.z + firstGeomCurve.curvedata.line.end2.z) / 2);
                matFirstCurve = g_webglControl.m_arrObjectMatrix[firstCurveUnit.objectIndex];
                matSecondCurve = g_webglControl.m_arrObjectMatrix[secondCurveUnit.objectIndex];
                ptOfShapeFirst = g_GLPartSet._arrPartSet[partIndexFirst]._CurveShape._arrShapeOfPoints;
                ptOfShapeSecond = g_GLPartSet._arrPartSet[partIndexSecond]._CurveShape._arrShapeOfPoints;
                ptCountFirst = g_GLPartSet._arrPartSet[partIndexFirst]._CurveShape._arrShapeOfPointsCounts;
                ptCountSecond = g_GLPartSet._arrPartSet[partIndexSecond]._CurveShape._arrShapeOfPointsCounts;
                for (let i = 0; i < firstCurveUnit.geomCurveIndex; ++i) {
                    ptOffsetFirst += ptCountFirst[i] * 3;
                }
                for (let i = 0; i < secondCurveUnit.geomCurveIndex; ++i) {
                    ptOffsetSecond += ptCountSecond[i] * 3;
                }
                tmpArcIndex = secondCurveUnit.geomCurveIndex;
            } else {
                this.attachPos.set(firstGeomCurve.curvedata.arc.vOrigin.x, firstGeomCurve.curvedata.arc.vOrigin.y,
                    firstGeomCurve.curvedata.arc.vOrigin.z);
                matFirstCurve = g_webglControl.m_arrObjectMatrix[secondCurveUnit.objectIndex];
                matSecondCurve = g_webglControl.m_arrObjectMatrix[firstCurveUnit.objectIndex];
                ptOfShapeFirst = g_GLPartSet._arrPartSet[partIndexSecond]._CurveShape._arrShapeOfPoints;
                ptOfShapeSecond = g_GLPartSet._arrPartSet[partIndexFirst]._CurveShape._arrShapeOfPoints;
                ptCountFirst = g_GLPartSet._arrPartSet[partIndexSecond]._CurveShape._arrShapeOfPointsCounts;
                ptCountSecond = g_GLPartSet._arrPartSet[partIndexFirst]._CurveShape._arrShapeOfPointsCounts;
                for (let i = 0; i < secondCurveUnit.geomCurveIndex; ++i) {
                    ptOffsetFirst += ptCountFirst[i] * 3;
                }
                for (let i = 0; i < firstCurveUnit.geomCurveIndex; ++i) {
                    ptOffsetSecond += ptCountSecond[i] * 3;
                }
                tmpArcIndex = firstCurveUnit.geomCurveIndex;
            }
            minDistance = Infinity;
            let tmpMinDistance = Infinity;
            CalTranslatePoint(ptOfShapeFirst[ptOffsetFirst], ptOfShapeFirst[ptOffsetFirst + 1],
                ptOfShapeFirst[ptOffsetFirst + 2], matFirstCurve, firstLineEnd1);
            CalTranslatePoint(ptOfShapeFirst[ptOffsetFirst + 3], ptOfShapeFirst[ptOffsetFirst + 4],
                ptOfShapeFirst[ptOffsetFirst + 5], matFirstCurve, firstLineEnd2);
            for (let i = 0; i < ptCountSecond[tmpArcIndex] * 3; i += 6) {
                CalTranslatePoint(ptOfShapeSecond[ptOffsetSecond + i], ptOfShapeSecond[ptOffsetSecond + i + 1],
                    ptOfShapeSecond[ptOffsetSecond + i + 2], matSecondCurve, secondLineEnd1);
                CalTranslatePoint(ptOfShapeSecond[ptOffsetSecond + i + 3], ptOfShapeSecond[ptOffsetSecond + i + 4],
                    ptOfShapeSecond[ptOffsetSecond + i + 5], matSecondCurve, secondLineEnd2);
                tmpMinDistance = CalcDistanceOfTwoLineSeg(firstLineEnd1, firstLineEnd2, secondLineEnd1, secondLineEnd2, tmpIntersectPt);
                if (tmpMinDistance < minDistance) {
                    minDistance = tmpMinDistance;
                }
            }
            this.displayText.push("最近距离：" + minDistance.toFixed(1) + GetSceneLengthUnitString());

        } else {
            this.attachPos.set(firstGeomCurve.curvedata.arc.vOrigin.x, firstGeomCurve.curvedata.arc.vOrigin.y,
                firstGeomCurve.curvedata.arc.vOrigin.z);
            matFirstCurve = g_webglControl.m_arrObjectMatrix[firstCurveUnit.objectIndex];
            matSecondCurve = g_webglControl.m_arrObjectMatrix[secondCurveUnit.objectIndex];
            // 圆弧-圆弧之间求解圆弧中心点间距
            let realWorldPos1st = new Point3(0, 0, 0);
            let realWorldPos2nd = new Point3(0, 0, 0);
            CalTranslatePoint(firstGeomCurve.curvedata.arc.vOrigin.x, firstGeomCurve.curvedata.arc.vOrigin.y,
                firstGeomCurve.curvedata.arc.vOrigin.z, matFirstCurve,realWorldPos1st);
            CalTranslatePoint(secondGeomCurve.curvedata.arc.vOrigin.x, secondGeomCurve.curvedata.arc.vOrigin.y,
                secondGeomCurve.curvedata.arc.vOrigin.z, matSecondCurve,realWorldPos2nd);
            let centerDistance = CalDistanceOfPoint3d(realWorldPos1st, realWorldPos2nd);
            this.displayText.push("圆心距离：" + centerDistance.toFixed(1) + GetSceneLengthUnitString());    
            // 圆弧-圆弧之间求解最小距离
            ptOfShapeFirst = g_GLPartSet._arrPartSet[partIndexFirst]._CurveShape._arrShapeOfPoints;
            ptOfShapeSecond = g_GLPartSet._arrPartSet[partIndexSecond]._CurveShape._arrShapeOfPoints;
            ptCountFirst = g_GLPartSet._arrPartSet[partIndexFirst]._CurveShape._arrShapeOfPointsCounts;
            ptCountSecond = g_GLPartSet._arrPartSet[partIndexSecond]._CurveShape._arrShapeOfPointsCounts;
            for (let i = 0; i < firstCurveUnit.geomCurveIndex; ++i) {
                ptOffsetFirst += ptCountFirst[i] * 3;
            }
            for (let i = 0; i < secondCurveUnit.geomCurveIndex; ++i) {
                ptOffsetSecond += ptCountSecond[i] * 3;
            }
            minDistance = Infinity;
            let tmpMinDistance = Infinity;
            for (let i = 0; i < ptCountFirst[firstCurveUnit.geomCurveIndex] * 3; i += 6) {
                CalTranslatePoint(ptOfShapeFirst[ptOffsetFirst + i], ptOfShapeFirst[ptOffsetFirst + i + 1],
                    ptOfShapeFirst[ptOffsetFirst + i + 2], matFirstCurve, firstLineEnd1);
                CalTranslatePoint(ptOfShapeFirst[ptOffsetFirst + i + 3], ptOfShapeFirst[ptOffsetFirst + i + 4],
                    ptOfShapeFirst[ptOffsetFirst + i + 5], matFirstCurve, firstLineEnd2);
                for (let j = 0; j < ptCountSecond[secondCurveUnit.geomCurveIndex] * 3; j += 6) {
                    CalTranslatePoint(ptOfShapeSecond[ptOffsetSecond + j], ptOfShapeSecond[ptOffsetSecond + j + 1],
                        ptOfShapeSecond[ptOffsetSecond + j + 2], matSecondCurve, secondLineEnd1);
                    CalTranslatePoint(ptOfShapeSecond[ptOffsetSecond + j + 3], ptOfShapeSecond[ptOffsetSecond + j + 4],
                        ptOfShapeSecond[ptOffsetSecond + j + 5], matSecondCurve, secondLineEnd2);
                    tmpMinDistance = CalcDistanceOfTwoLineSeg(firstLineEnd1, firstLineEnd2, secondLineEnd1, secondLineEnd2, tmpIntersectPt);
                    if (tmpMinDistance < minDistance) {
                        minDistance = tmpMinDistance;
                    }
                }
            }
            this.displayText.push("最近距离：" + minDistance.toFixed(1) + GetSceneLengthUnitString());    
        }
        this.CalculateText();
    }

    this.CalculateText = function() {
        let maxLen = 0;
        let maxCol =  this.displayText.length;
        for (let i = 0; i < maxCol; ++i) {
            if (this.displayText[i].length > maxLen) {
                maxLen = GetStringLength(this.displayText[i]);
            }
        }
        if (maxLen < MEASURE_TEXT_MIN_WIDTH_NUM) {
            maxLen = MEASURE_TEXT_MIN_WIDTH_NUM;
        }
        if (maxCol < MEASURE_TEXT_MIN_HEIGHT_NUM) {
            maxCol = MEASURE_TEXT_MIN_HEIGHT_NUM;
        }
        this.rectWidth = MEASURE_TEXT_WIDTH * (maxLen + 1);
        this.rectHeight = (MEASURE_TEXT_HEIGHT + 2) * maxCol;
        for (let i =  0; i < this.displayText.length; ++i) {
            let tmpPos = new Point2(1, (i + 1) * MEASURE_TEXT_HEIGHT);
            this.displayTextPos.push(tmpPos);
        }
    }

    this.Copy = function() {
        let copyUnit = new GL_MEASURE_INFO();
        copyUnit.attachPos = this.attachPos.copy();
        for (let i = 0; i < this.displayText.length; ++i) {
            copyUnit.displayText.push(this.displayText[i]);
        }
        for (let i = 0; i < this.displayTextPos.length; ++i) {
            copyUnit.displayTextPos.push(this.displayTextPos[i].copy());
        }
        copyUnit.rectWidth = this.rectWidth;
        copyUnit.rectHeight = this.rectHeight;
        return copyUnit;
    }

    this.Clear = function() {
        this.displayText.splice(0, this.displayText.length);
        this.displayTextPos.splice(0, this.displayTextPos.length);
    }
}

// 测量显示的数据，包括文本、显示控件等
function GL_MEASURE_UNIT() {
    this.measureType = 0;
    this.measureInfo = null;
    this.arrMeasureShapes = new Array();

    this.Clear = function() {
        this.measureType = 0;
        if (this.measureInfo != null) {
            this.measureInfo.Clear();
        }
        for (let i = 0; i < this.arrMeasureShapes.length; ++i) {
            this.arrMeasureShapes[i].Clear();
        }
        this.arrMeasureShapes.splice(0, this.arrMeasureShapes.length);
    }

    this.Copy = function() {
        let copyUnit = new GL_MEASURE_UNIT();
        copyUnit.measureType = this.measureType;
        if (this.measureInfo != null) {
            copyUnit.measureInfo = this.measureInfo.Copy();
        }
        for (let i = 0; i < this.arrMeasureShapes.length; ++i) {
            copyUnit.arrMeasureShapes.push(this.arrMeasureShapes[i].Copy());
        }     
        return copyUnit;
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

//===================================================================================================
/**
 * 公共函数
 */
var oldVec = vec3.create();
var newVec = vec3.create();
var invertMat = mat4.create();

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

function CalDistanceOfPoint3d(pt1, pt2) {
    return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y) + (pt1.z - pt2.z) * (pt1.z - pt2.z));
}

function CalDistanceOfPoint2d(pt1, pt2) {
    return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
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