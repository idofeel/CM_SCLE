// File: SceneSectionCal.js

/**
 * @author wujiali
 */
 
//===================================================================================================

const INVALID_ID = -1;
const POSOFFSETOFMDLVERTEX = 0;

// 第二版剖切算法的枚举型和数据结构

function ISNEAR(value, dist) {
    return (Math.abs(value - dist) <= ZERO);
}

function SecPlanePoint() {
    this.uMdlPtIndex = 0;
    this.bIsScanned = false;
    this.fDisToPlane = 0;

    this.clear = function() {
        this.uMdlPtIndex = 0;
        this.bIsScanned = false;
        this.fDisToPlane = 0;
    }
}

function SecPlaneEdgeAdjTriIndex() {
    this.arrOtherTriIndex = null;
    this.uOtherTriNum = 0;
    
    this.AddOtherAdjTriIndex = function(uTriIndex) {
        arrOtherTriIndex[uOtherTriNum] = uTriIndex;
        uOtherTriNum++;
    }
    this.GetOtherAdjTriIndex = function(arrOtherTriangleIndex) {
        return this.arrOtherTriIndex;
    }
}

function SecPlaneEdge() {
    this.uTriIndex1 = 0;
    this.uTriIndex2 = 0;
    this.pOtherAdjTriIndex = null;

    this.AddOtherAdjTriIndex = function(uTriIndex) {
        if (this.pOtherAdjTriIndex == null) {
            this.pOtherAdjTriIndex = new Array();
        }
        this.pOtherAdjTriIndex.push(uTriIndex);
    }
    this.GetOtherAdjTriIndex = function() {
        return this.pOtherAdjTriIndex;
    }

    this.clear = function() {
        this.uTriIndex1 = 0;
        this.uTriIndex2 = 0;
        if (this.pOtherAdjTriIndex != null) {
            this.pOtherAdjTriIndex.splice(0, this.pOtherAdjTriIndex,length);
        }
    }
}

function SecPlaneTriangle() {
    this.uPtIndex1 = 0;
    this.uPtIndex2 = 0;
    this.uPtIndex3 = 0;
    this.bIsScanned = false;

    this.clear = function() {
        this.uPtIndex1 = 0;
        this.uPtIndex2 = 0;
        this.uPtIndex3 = 0;
        this.bIsScanned = false;
    }
}

function SecPlaneSubset() {
    this.bIsValid = false;
    this.arrTriangleIndex = new Array();

    this.clear = function() {
        this.bIsValid = false;
        this.arrTriangleIndex.splice(0, this.arrTriangleIndex.length);
    }
}

// 下一个待遍历三角片的数据
function SecPlaneNextTriData() {
	this.uTriIndex = -1;			// 三角片的索引
	this.bNextToContourFragEnd = false;	// 三角片是否位于轮廓线片段(折线)尾端点之后;否则位于轮廓线片段(折线)首端点之前

	this.bIsPtVisited1 = false;		// 三角片第一个角点是否已遍历
	this.bIsPtVisited2 = false;		// 三角片第二个角点是否已遍历
	this.bIsPtVisited3 = false;		// 三角片第三个角点是否已遍历
	// 若三个点都未访问,则该三角片为当前轮廓线片段访问的第一个三角片；若只有一个点被访问，则该点必然在曲面上（该点必然是当前轮廓线片段的末尾点）；若有两个点被访问，则这两个点所在边与平面相交（这两个点必然不在平面上，交点必然是当前轮廓线片段的末尾点）；不可能存在三个点都被访问的情况，此种情况不做任何处理直接返回FALSE。
}

function SecPlaneModel() {
    this.m_fRelativeZero = 0;
    this.m_fZero = 0;
    this.m_fEpsilon = 0;
    this.m_fModelSizeInPlane = 0;

    this.m_bIsReBuild = 0;
    this.m_arrPoints = null;            // 点数据(无重复) SecPlanePoint
    this.m_arrEdges = null;            // 边数据 SecPlaneEdge
    this.m_arrTriangles = null;    // 三角片数据 SecPlaneTriangle
    this.m_arrSubset = null;            // 子集数据 SecPlaneSubset

    this.m_pPointMemPool = null;                    // 点数据内存池
    this.m_uPointMemPoolSize = 0;                // 点数据内存池尺寸
    this.m_pEdgeMemPool = null;                        // 边数据内存池
    this.m_uEdgeMemPoolSize = 0;                    // 边数据内存池尺寸
    this.m_pTriangleMemPool = null;                    // 三角片数据内存池
    this.m_uTriangleMemPoolSize = 0;                // 三角片数据内存池尺寸

    this.m_mapPtEdgeRalationship = new Map();                // map(端点索引值, m_arrPtEdgeRalationship中的索引)
    this.m_arrPtEdgeRalationship = null;        // 外层std::vector：拥有相同端点的边；内层std::vector：第一个元素为相同的端点索引，后面所有元素为各个边的另一个端点索引；
    this.m_arrPtEdgeIndexRalationship = null;    // 与m_arrPtEdgeRalationship一一对应;内层std::vector为边对应的索引值（m_arrEdges中的位置）
    this.m_arrPointIndexByMdlVer = null;            // 记录模型顶点对应的无重复点数据,与模型顶点一一对应。（重建拓扑后该数据不再使用）
    this.bIsPreCalData = false;

    this.m_vPlanePt = new Point3(0, 0, 0);
    this.m_vPlaneNorm = new Vector3(0, 0, 0);
    this.m_dPlaneParamD = 0;

    this.m_uTempIndex = 0;
    this.m_arrTempIndex = new Array();
    this.m_vPos = new Point3(0, 0, 0);

    this.FLOATNUMPERMDLVERTEX = 3;

    this.Create = function(pDescMesh, fRelativeZero) {
        // 记录模型信息
        this.m_pDescMesh = pDescMesh;
        // 记录相对精度
        this.m_fRelativeZero = fRelativeZero;
        // 计算绝对精度
        if (pDescMesh != null) {
            let boxSet = this.m_pDescMesh._arrPartLODData[0]._boxset;
            this.m_fZero = this.m_fRelativeZero * 0.5 * CalDistanceOfPoint3d(boxSet._ObjectBox._Vertex[7], boxSet._ObjectBox._Vertex[0]);
            this.m_fEpsilon = this.m_fZero * 1000.0;
            let fCurZero = 0.0;
            for (let i = 0; i < boxSet._SurfaceBoxes.length; i++) {
                fCurZero = this.m_fRelativeZero * 10.0 * 0.5 * CalDistanceOfPoint3d(boxSet._SurfaceBoxes[i]._Vertex[7], boxSet._SurfaceBoxes[i]._Vertex[0]);
                if (fCurZero < this.m_fZero) {
                    this.m_fZero = fCurZero;
                }
            }
        } else {
            this.m_fZero = this.m_fRelativeZero;
            this.m_fEpsilon = this.m_fZero * 1000.0;
        }
        return true;
    }
    this.Release = function() {
	    this.ClearData();

        this.m_pDescMesh = null;
    
        this.m_fRelativeZero = 0;
        this.m_fZero = 0;
        this.m_fEpsilon = 0;
        this.m_fModelSizeInPlane = 0;
    }

    this.InitData = function() {
        // 重建模型的拓扑数据
        if (!this.IsReBuild()) {
            this.ReBuildTopologicalData();
        }
    }

    // 重建拓扑数据
    this.ReBuildTopologicalData = function() {
        // 重建拓扑数据_子集的数据
        let uTriNum = this.ReBuildTopologicalData_Subset();

        // 预分配内存
        this.ResetPointPool(uTriNum/2);
        this.ResetEdgePool(uTriNum*3/2);
        this.ResetTrianglePool(uTriNum);

        // 重建拓扑数据_位置无重复的生成点的数据
        this.ReBuildTopologicalData_Point();

        this.m_arrPtEdgeRalationship = new Array();
        this.m_arrPtEdgeIndexRalationship = new Array();

        // 重建拓扑数据_边和三角片的数据
        this.ReBuildTopologicalData_EdgeTriangle();

        this.m_bIsReBuild = true;
        return true;
    }

    // 释放数据
    this.ClearData = function() {
        this.m_vPlanePt.set(0, 0, 0);
        this.m_vPlaneNorm.set(0, 0, 0);
        this.m_dPlaneParamD = 0.0;
    
        this.m_mapPtEdgeRalationship.clear();
        this.m_arrPtEdgeRalationship.splice(0, this.m_arrPtEdgeRalationship.length);
        this.m_arrPtEdgeIndexRalationship.splice(0, this.m_arrPtEdgeIndexRalationship.length);
        if (!this.bIsPreCalData) {
            this.m_arrPointIndexByMdlVer.splice(0, this.m_arrPointIndexByMdlVer.length);
        }
    
        this.ClearAllSubset();
        this.ClearAllTriangle();
        this.ClearAllEdge();
        this.ClearAllPoint();
    
        this.m_bIsReBuild = false;
    }

    // 初始化拓扑数据
    this.InitTopologicalData = function() {
        for (let i = 0; i < this.m_arrPoints.length; i++) {
            this.m_arrPoints[i].bIsScanned = false;
        }
        for (let i = 0; i < this.m_arrTriangles.length; i++) {
            this.m_arrTriangles[i].bIsScanned = false;
        }
    }

    // 重建拓扑数据_子集的数据
    this.ReBuildTopologicalData_Subset = function() {
        let pMesh = this.m_pDescMesh._arrPartLODData[0];
        let pMdl = this.m_pDescMesh;
        let uTriNum = 0, uValidSubsetNum = 0;
    
        // 验证是否含有拓扑数据
        let bIsTopologicalDataExist = false;
        for (let i = 0; i < pMesh._arrSubsetType.length; i++) {
            if (pMesh._arrSubsetType[i] != ADF_MDLSUBSET_SURFACE) {
                continue;
            }
            if (pMdl._SurfaceShape == null || pMesh._arrGeomSurfaceIndex[i] >= pMdl._SurfaceShape._arrSurface.length) {
                continue;
            }
            if (pMdl._SurfaceShape._arrSurface[pMesh._arrGeomSurfaceIndex[i]].bIsTopological) {
                bIsTopologicalDataExist = true;
                break;
            }
        }
    
        // 初始化子集数据
        this.m_arrSubset = new Array(pMesh._arrSubsetType.length);

        for (let i = 0; i < this.m_arrSubset.length; i++) {
            let secPlaneSubset = new SecPlaneSubset();

            if (pMesh._arrSubsetPrimitType[i] != ADFPT_TRIANGLELIST) {
                secPlaneSubset.bIsValid = false;
                continue;
            }
            if (bIsTopologicalDataExist) {
                if (pMesh._arrSubsetType[i] == ADF_MDLSUBSET_SURFACE) {
                    if (pMesh._arrGeomSurfaceIndex[i] < pMdl._SurfaceShape._arrSurface.length) {
                        if (!pMdl._SurfaceShape._arrSurface[pMesh._arrGeomSurfaceIndex[i]].bIsTopological) {
                            secPlaneSubset.bIsValid = false;
                            continue;
                        }
                    }
                }
            }

            secPlaneSubset.bIsValid = true;
            secPlaneSubset.arrTriangleIndex = new Array();
            this.m_arrSubset[i] = secPlaneSubset;
            uTriNum += pMesh._arrSurfaceVertexNum[i] / 3;
            uValidSubsetNum++;
        }

        return uTriNum;
    }

    // 重建拓扑数据_位置无重复的生成点的数据
    this.ReBuildTopologicalData_Point = function() {
        let pVBData = this.m_pDescMesh._arrPartLODData[0]._arrVertexPosition;
        let pVBIndex = this.m_pDescMesh._arrPartLODData[0]._arrIndex;
        let mdlPtIndex = this.m_pDescMesh._arrPartLODData[0]._arrMdlPtIndex;
        let ptIndexByMdlVer = this.m_pDescMesh._arrPartLODData[0]._arrPointIndexByMdlVer;
        let uIndex = INVALID_ID;
        let ptNum = pVBData.length / this.FLOATNUMPERMDLVERTEX;
        this.m_arrPointIndexByMdlVer = null;

        if (mdlPtIndex == null || ptIndexByMdlVer == null) {
            // 如果SCLE剖切顶点索引数据为空
            this.m_arrPointIndexByMdlVer = new Array(ptNum);
            let pPt = new Point3(0, 0, 0);
            let mapPtIndex = new Array();
    
            for (let i = 0; i < ptNum; i++) {
                // to do point3去重
                pPt.x = pVBData[i*this.FLOATNUMPERMDLVERTEX+POSOFFSETOFMDLVERTEX];
                pPt.y = pVBData[i*this.FLOATNUMPERMDLVERTEX+POSOFFSETOFMDLVERTEX+1];
                pPt.z = pVBData[i*this.FLOATNUMPERMDLVERTEX+POSOFFSETOFMDLVERTEX+2];
                let j = 0;
                for (; j < mapPtIndex.length; j += 3) {
                    if (pPt.x == mapPtIndex[j] && pPt.y == mapPtIndex[j+1] && pPt.z == mapPtIndex[j+2]) {
                        break;
                    }
                }
                if (j >= mapPtIndex.length) {
                    uIndex = this.AddPoint(i);
                    mapPtIndex.push(pPt.x);
                    mapPtIndex.push(pPt.y);
                    mapPtIndex.push(pPt.z);
                } else {
                    uIndex = j / 3;
                }
                this.m_arrPointIndexByMdlVer[i] = uIndex;
            }
            mapPtIndex.splice(0, mapPtIndex.length);
            this.bIsPreCalData = false;
        } else {
            // 如果SCLE剖切顶点索引数据已提前生成
            for (let i = 0; i < mdlPtIndex.length; ++i) {
                this.AddPoint(mdlPtIndex[i]);
            }
            this.m_arrPointIndexByMdlVer = ptIndexByMdlVer;
            this.bIsPreCalData = true;
        }

        return true;
    }

    // 重建拓扑数据_边和三角片的数据
    this.ReBuildTopologicalData_EdgeTriangle = function() {
        let pMesh = this.m_pDescMesh._arrPartLODData[0];

        let tmpEdge1 = null, tmpEdge2 = null, tmpEdge3 = null;
        let arrEdgePort1 = 0, arrEdgePort2 = 0, arrEdgePort3 = 0;
        let uEdgeIndex1 = 0, uEdgeIndex2 = 0, uEdgeIndex3 = 0;
        let tmpEdge = null, pEdge1 = null, pEdge2 = null, pEdge3 = null;
        let uCurTriIndex = INVALID_ID;
        let pIndexData = pMesh._arrIndex;
        let uCurStartIndex = 0, uCurTriNum = 0;
        let pCurSubset = null;

        for (let i = 0; i < this.m_arrSubset.length; i++) {
            if (this.m_arrSubset[i] == null || !this.m_arrSubset[i].bIsValid) {
                continue;
            }
            pCurSubset = this.m_arrSubset[i];
            uCurStartIndex = pMesh._arrSurfaceStartIndex[i];
            uCurTriNum = pMesh._arrSurfaceVertexNum[i] / 3;
            for (let j = 0; j < uCurTriNum; j++) {
                arrEdgePort1 = this.m_arrPointIndexByMdlVer[pIndexData[uCurStartIndex + j*3 + 0]];
                arrEdgePort2 = this.m_arrPointIndexByMdlVer[pIndexData[uCurStartIndex + j*3 + 1]];
                arrEdgePort3 = this.m_arrPointIndexByMdlVer[pIndexData[uCurStartIndex + j*3 + 2]];
                if (arrEdgePort1 == arrEdgePort2 || arrEdgePort1 == arrEdgePort3 || arrEdgePort2 == arrEdgePort3) {
                    continue;
                }
                tmpEdge1 = this.GetEdgeIndexByPort(arrEdgePort1, arrEdgePort2);
                tmpEdge2 = this.GetEdgeIndexByPort(arrEdgePort2, arrEdgePort3);
                tmpEdge3 = this.GetEdgeIndexByPort(arrEdgePort3, arrEdgePort1);
                uEdgeIndex1 = tmpEdge1.edgeIndex, uRelationIndex1 = tmpEdge1.relationIndexStart;
                uEdgeIndex2 = tmpEdge2.edgeIndex, uRelationIndex2 = tmpEdge2.relationIndexStart;
                uEdgeIndex3 = tmpEdge3.edgeIndex, uRelationIndex3 = tmpEdge3.relationIndexStart;

                uCurTriIndex = this.AddTriangle(arrEdgePort1, arrEdgePort2, arrEdgePort3);
                pCurSubset.arrTriangleIndex.push(uCurTriIndex);

                // 生成边数据和三角片数据
                if (uEdgeIndex1 == INVALID_ID) {
                    tmpEdge1 = this.AddEdge(uCurTriIndex, INVALID_ID);
                    pEdge1 = tmpEdge1.edge, uEdgeIndex1 = tmpEdge1.edgeIndex;
                    tmpEdge1 = this.AddPortEdgeRalationship(arrEdgePort1, arrEdgePort2, uEdgeIndex1, uRelationIndex1, uRelationIndex2);
                    if (tmpEdge1.start != INVALID_ID) {
                        uRelationIndex1 = tmpEdge1.start;
                    }
                    if (tmpEdge1.end != INVALID_ID) {
                        uRelationIndex2 = tmpEdge1.end;
                    }
                }
                else
                {
                    pEdge1 = this.m_arrEdges[uEdgeIndex1];
                    if (pEdge1.uTriIndex2 == INVALID_ID) {
                        pEdge1.uTriIndex2 = uCurTriIndex;
                    } else {
                        pEdge1.AddOtherAdjTriIndex(uCurTriIndex);
                    }
                }
                if (uEdgeIndex2 == INVALID_ID)
                {
                    tmpEdge2 = this.AddEdge(uCurTriIndex, INVALID_ID);
                    pEdge2 = tmpEdge2.edge, uEdgeIndex2 = tmpEdge2.edgeIndex;
                    tmpEdge2 = this.AddPortEdgeRalationship(arrEdgePort2, arrEdgePort3, uEdgeIndex2, uRelationIndex2, uRelationIndex3);
                    if (tmpEdge2.start != INVALID_ID) {
                        uRelationIndex2 = tmpEdge2.start;
                    }
                    if (tmpEdge2.uOutRelationIndexEnd != INVALID_ID) {
                        uRelationIndex3 = tmpEdge2.end;
                    }
                }
                else
                {
                    pEdge2 = this.m_arrEdges[uEdgeIndex2];
                    if (pEdge2.uTriIndex2 == INVALID_ID) {
                        pEdge2.uTriIndex2 = uCurTriIndex;
                    } else {
                        pEdge2.AddOtherAdjTriIndex(uCurTriIndex);
                    }
                }
                if (uEdgeIndex3 == INVALID_ID)
                {
                    tmpEdge3 = this.AddEdge(uCurTriIndex, INVALID_ID);
                    pEdge3 = tmpEdge3.edge, uEdgeIndex3 = tmpEdge3.edgeIndex;
                    tmpEdge3 = this.AddPortEdgeRalationship(arrEdgePort3, arrEdgePort1, uEdgeIndex3, uRelationIndex3, uRelationIndex1);
                    if (tmpEdge3.start != INVALID_ID) {
                        uRelationIndex3 = tmpEdge3.start;
                    }
                    if (tmpEdge3.end != INVALID_ID) {
                        uRelationIndex1 = tmpEdge3.end;
                    }
                }
                else
                {
                    pEdge3 = this.m_arrEdges[uEdgeIndex3];
                    if (pEdge3.uTriIndex2 == INVALID_ID) {
                        pEdge3.uTriIndex2 = uCurTriIndex;
                    } else {
                        pEdge3.AddOtherAdjTriIndex(uCurTriIndex);
                    }
                }
            }
        }

        return true;
    }

    // 初始化平面数据
    this.InitPlaneData = function(vPlanePtInMdlCoords, vPlaneNormInMdlCoords) {
        this.m_vPlanePt.set(vPlanePtInMdlCoords.x, vPlanePtInMdlCoords.y, vPlanePtInMdlCoords.z);
        this.m_vPlaneNorm.set(vPlaneNormInMdlCoords.x, vPlaneNormInMdlCoords.y, vPlaneNormInMdlCoords.z);

        // 将包围盒中心转换为平面上一点记录下来（保证其他点的计算精度）
        let pMesh = this.m_pDescMesh._arrPartLODData[0];
        let vDMdlCenter = new Point3((pMesh._boxset._ObjectBox._Vertex[7].x + pMesh._boxset._ObjectBox._Vertex[0].x) / 2,
            (pMesh._boxset._ObjectBox._Vertex[7].y + pMesh._boxset._ObjectBox._Vertex[0].y) / 2,
            (pMesh._boxset._ObjectBox._Vertex[7].z + pMesh._boxset._ObjectBox._Vertex[0].z) / 2);
        CalProjectPtToPlane(this.m_vPlanePt, this.m_vPlaneNorm, vDMdlCenter, this.m_vPlanePt);

        this.m_dPlaneParamD = - (this.m_vPlanePt.x*this.m_vPlaneNorm.x + this.m_vPlanePt.y*this.m_vPlaneNorm.y + this.m_vPlanePt.z*this.m_vPlaneNorm.z);

        // 计算模型在平面上的尺寸
        this.CalcModelSizeInPlane();
    }

    // 计算模型在平面上的尺寸
    this.CalcModelSizeInPlane = function() {
        let pMesh = this.m_pDescMesh._arrPartLODData[0];
        let vPlanePt = this.m_vPlanePt;
        let vPlaneNorm = this.m_vPlaneNorm;
        let vPlaneAxisX = new Vector3(1.0, 0.0, 0.0);
        let vPlaneAxisY = new Vector3(0.0, 1.0, 0.0);
        let fDot = vPlaneNorm.dot(vPlaneAxisY);
        if (ISNEAR(fDot, 1.0) || ISNEAR(fDot, -1.0))
        {
            vPlaneNorm.cross(vPlaneAxisX, vPlaneAxisY);
            vPlaneAxisY.cross(vPlaneNorm, vPlaneAxisX);
        }
        else
        {
            vPlaneAxisY.cross(vPlaneNorm, vPlaneAxisX);
            vPlaneNorm.cross(vPlaneAxisX, vPlaneAxisY);
        }
        let matToPlane = mat4.create();
        let matToMdl = mat4.create();
        CalCoordsTransformMatrix(vPlanePt, vPlaneAxisX, vPlaneAxisY, vPlaneNorm, matToMdl);
        mat4.invert(matToPlane, matToMdl);
        this.m_fModelSizeInPlane = getBoxLengthInPlane(pMesh._boxset._ObjectBox, matToPlane);
    }

    // 获取点的平面法矢向量长度（包含正负号）
    this.GetDisToPlaneByPoint = function(uPtIndex) {
        let pPt = this.m_arrPoints[uPtIndex];
        if (!pPt.bIsScanned) {
            this.GetPointPosition(uPtIndex, this.m_vPos);
            pPt.fDisToPlane = this.m_vPlaneNorm.x * this.m_vPos.x + this.m_vPlaneNorm.y * this.m_vPos.y + this.m_vPlaneNorm.z * this.m_vPos.z + this.m_dPlaneParamD;
            pPt.bIsScanned = true;
        }
        return pPt.fDisToPlane;
    }

    // 获取点的位置
    this.GetPointPosition = function(uPtIndex, vPos) {
        let pPt = this.m_arrPoints[uPtIndex];
        let pMesh = this.m_pDescMesh._arrPartLODData[0];    
        let pVBData = pMesh._arrVertexPosition;
        vPos.x = pVBData[(pPt.uMdlPtIndex)*this.FLOATNUMPERMDLVERTEX + 0];
        vPos.y = pVBData[(pPt.uMdlPtIndex)*this.FLOATNUMPERMDLVERTEX + 1];
        vPos.z = pVBData[(pPt.uMdlPtIndex)*this.FLOATNUMPERMDLVERTEX + 2];
    }

    // 获取点与平面的位置关系(返回值为1表示点位于平面正侧,-1表示点位于平面反侧,0表示点位于平面上)
    this.GetRelationshipOfPointAndPlane = function(uPtIndex) {
        let fDisToPlane = this.GetDisToPlaneByPoint(uPtIndex);
        if (fDisToPlane < this.m_fZero && fDisToPlane > -this.m_fZero) {
            return 0;
        } else if (fDisToPlane > 0.0) {
            return 1;
        } else {
            return -1;
        }
    }

    // 计算边与平面的交点(返回值表示是否相交)
    this.CalcIntersectionOfEdgeAndPlane = function(uEdgeStartPtIndex, uEdgeEndPtIndex, pIntersectionPt, pIsStartOnPlane, pIsEndOnPlane) {
        let bIntersect = false;
        let fDisToPlane1 = this.GetDisToPlaneByPoint(uEdgeStartPtIndex);
        let fDisToPlane2 = this.GetDisToPlaneByPoint(uEdgeEndPtIndex);
        let vIntersectionPt = new Point3(0, 0, 0);

        let bIsStartOnPlane = false, bIsEndOnPlane = false;
        if (fDisToPlane1 < this.m_fZero && fDisToPlane1 > -this.m_fZero)
        {
            bIsStartOnPlane = true;
            this.GetPointPosition(uEdgeStartPtIndex, vIntersectionPt);
            bIntersect = true;
        }

        if (fDisToPlane2 < this.m_fZero && fDisToPlane2 > -this.m_fZero)
        {
            bIsEndOnPlane = true;
            if (!bIsStartOnPlane) {
                this.GetPointPosition(uEdgeEndPtIndex, vIntersectionPt);
            }
            bIntersect = true;
        }

        if ((!bIsStartOnPlane) && (!bIsEndOnPlane))
        {
            if (fDisToPlane1*fDisToPlane2 > 0.0) {
                bIntersect = false;
            } else {
                bIntersect = true;
                let p1 = new Point3(0, 0, 0), p2 = new Point3(0, 0, 0);
                this.GetPointPosition(uEdgeStartPtIndex, p1);
                this.GetPointPosition(uEdgeEndPtIndex, p2);
                vIntersectionPt = new Point3(
                    p1.x + (p2.x - p1.x) * fDisToPlane1 / (fDisToPlane1 - fDisToPlane2),
                    p1.y + (p2.y - p1.y) * fDisToPlane1 / (fDisToPlane1 - fDisToPlane2),
                    p1.z + (p2.z - p1.z) * fDisToPlane1 / (fDisToPlane1 - fDisToPlane2)
                );
            }
        }

        if (pIntersectionPt != null) {
            pIntersectionPt.set(vIntersectionPt.x, vIntersectionPt.y, vIntersectionPt.z);
        }
        if (pIsStartOnPlane != null) {
            pIsStartOnPlane = bIsStartOnPlane;
        }
        if (pIsEndOnPlane != null) {
            pIsEndOnPlane = bIsEndOnPlane;
        }
        return bIntersect;
    }
    // 计算直线与平面的交点
    this.CalcIntersectionOfLineAndPlane = function(uEdgeStartPtIndex, uEdgeEndPtIndex, vIntersectionPt) {
        let fDisToPlane1 = this.GetDisToPlaneByPoint(uEdgeStartPtIndex);
        let fDisToPlane2 = this.GetDisToPlaneByPoint(uEdgeEndPtIndex);
        let p1 = new Point3();
        let p2 = new Point3();
        this.GetPointPosition(uEdgeStartPtIndex, p1);
        this.GetPointPosition(uEdgeEndPtIndex, p2);

        vIntersectionPt.set(
            p1.x + (p2.x - p1.x) * fDisToPlane1 / (fDisToPlane1 - fDisToPlane2),
            p1.y + (p2.y - p1.y) * fDisToPlane1 / (fDisToPlane1 - fDisToPlane2),
            p1.z + (p2.z - p1.z) * fDisToPlane1 / (fDisToPlane1 - fDisToPlane2)
        );
    }

    // 通过边获取相邻三角片
    this.GetTriangleByEdge = function(uEdgeStartPtIndex, uEdgeEndPtIndex, arrAdjacentTriIndex) {
        arrAdjacentTriIndex.splice(0, arrAdjacentTriIndex.length);
        let ret = this.GetEdgeIndexByPort(uEdgeStartPtIndex, uEdgeEndPtIndex);
        let uEdgeIndex = ret.edgeIndex;
        if (uEdgeIndex == INVALID_ID) {
            return;
        }
        let pEdge = this.m_arrEdges[uEdgeIndex];

        if (pEdge.uTriIndex1 != INVALID_ID) {
            arrAdjacentTriIndex.push(pEdge.uTriIndex1);
        }
        if (pEdge.uTriIndex2 != INVALID_ID) {
            arrAdjacentTriIndex.push(pEdge.uTriIndex2);
        }
        this.m_arrTempIndex = pEdge.GetOtherAdjTriIndex();
        if (this.m_arrTempIndex != null && this.m_arrTempIndex.length > 0)
        {
            this.m_uTempIndex = arrAdjacentTriIndex.length;
            for (let i = 0; i < this.m_arrTempIndex.length; ++i) {
                arrAdjacentTriIndex.push(this.m_arrTempIndex[i]);
            }
        }
    }
    // 通过点获取相邻三角片(无重复)
    this.GetTriangleByPoint = function(uPtIndex, arrAdjacentTriIndex) {
        arrAdjacentTriIndex.splice(0, arrAdjacentTriIndex.length);
        let uIndex = this.m_mapPtEdgeRalationship.get(uPtIndex);
        if (uIndex == undefined || uIndex == null) {
            return;
        }
        if (uIndex >= this.m_arrPtEdgeIndexRalationship.length) {
            return;
        }
    
        let mapIDIndex = new Map();
        let pEdge = null;
        for (let i=0; i<this.m_arrPtEdgeIndexRalationship[uIndex].length; i++)
        {
            pEdge = this.m_arrEdges[this.m_arrPtEdgeIndexRalationship[uIndex][i]];
            if (pEdge == null) {
                continue;
            }
            if (mapIDIndex.get(pEdge.uTriIndex1) == undefined)
            {
                arrAdjacentTriIndex.push(pEdge.uTriIndex1);
                mapIDIndex.set(pEdge.uTriIndex1, arrAdjacentTriIndex.length-1);
            }
            if (mapIDIndex.get(pEdge.uTriIndex2) == undefined)
            {
                arrAdjacentTriIndex.push(pEdge.uTriIndex2);
                mapIDIndex.set(pEdge.uTriIndex2, arrAdjacentTriIndex.length-1);
            }
            this.m_arrTempIndex = pEdge.GetOtherAdjTriIndex();
            if (this.m_arrTempIndex != null) {
                for (let j=0; j<this.m_arrTempIndex.length; j++)
                {
                    if (mapIDIndex.get(this.m_arrTempIndex[j]) == undefined)
                    {
                        arrAdjacentTriIndex.push(this.m_arrTempIndex[j]);
                        mapIDIndex.set(this.m_arrTempIndex[j], arrAdjacentTriIndex.length-1);
                    }
                }
            }
        }
        mapIDIndex.clear();
    }

    // // 验证模型包围球是否与剖切平面相交
    // this.CheckCrashOfModelBoundSphereAndPlane = function() {
    //     let pMesh = this.m_pDescMesh._arrPartLODData[0];

    //     let vMax = pMesh._boxset._ObjectBox._Vertex[7];
    //     let vMin = pMesh._boxset._ObjectBox._Vertex[0];
    //     let vCenter = new Point3((vMax.x + vMin.x) / 2, (vMax.y + vMin.y) / 2, (vMax.z + vMin.z) / 2);
    //     let vPtToC = new Vector3(vCenter.x - this.m_vPlanePt.x, vCenter.y - this.m_vPlanePt.y, vCenter.z - this.m_vPlanePt.z);
    //     let dRadius = CalDistanceOfPoint3d(vMax, vMin) / 2;
    //     let dDist = Math.abs(this.m_vPlaneNorm.dot(vPtToC));

    //     return dDist < dRadius ? true : false;
    // }
    // 验证模型包围球是否与剖切平面相交
    this.CheckCrashOfModelBoundSphereAndPlane = function(vPlanePt, vPlaneNorm) {
        let pMesh = this.m_pDescMesh._arrPartLODData[0];

        let vMax = pMesh._boxset._ObjectBox._Vertex[7];
        let vMin = pMesh._boxset._ObjectBox._Vertex[0];
        let vCenter = new Point3((vMax.x + vMin.x) / 2, (vMax.y + vMin.y) / 2, (vMax.z + vMin.z) / 2);
        let vPtToC = new Vector3(vCenter.x - vPlanePt.x, vCenter.y - vPlanePt.y, vCenter.z - vPlanePt.z);
        let dRadius = CalDistanceOfPoint3d(vMax, vMin) / 2;
        let dDist = Math.abs(vPlaneNorm.dot(vPtToC));

        return dDist < dRadius ? true : false;
    }
    // 验证模型子集包围球是否与剖切平面相交
    this.CheckCrashOfSubsetBoundSphereAndPlane = function(uSubsetIndex) {
        let pMesh = this.m_pDescMesh._arrPartLODData[0];
        let vMax = pMesh._boxset._SurfaceBoxes[uSubsetIndex]._Vertex[7];
        let vMin = pMesh._boxset._SurfaceBoxes[uSubsetIndex]._Vertex[0];
        let vCenter = new Point3((vMax.x + vMin.x) / 2, (vMax.y + vMin.y) / 2, (vMax.z + vMin.z) / 2);
        let vPtToC = new Vector3(vCenter.x - this.m_vPlanePt.x, vCenter.y - this.m_vPlanePt.y, vCenter.z - this.m_vPlanePt.z);
        let dRadius = CalDistanceOfPoint3d(vMax, vMin) / 2;
        let dDist = Math.abs(this.m_vPlaneNorm.dot(vPtToC));

        return dDist < dRadius ? true : false;
    }
    // 验证模型子集平面是否与剖切平面平行
    this.IsSubsetParallelWithPlane = function(uSubsetIndex) {
        let pMesh = this.m_pDescMesh._arrPartLODData[0];
        if (pMesh._arrSubsets[uSubsetIndex]._nSubsetType != ADF_MDLSUBSET_SURFACE) {
            return false;
        }
        if (pMesh._arrSubsets[uSubsetIndex]._uGeomIndex >= pMesh._arrSurface.length) {
            return false;
        }
        if (pMesh._arrSurface[pMesh._arrSubsets[uSubsetIndex]._uGeomIndex].nType != BPSURFTYPE_PLANE) {
            return false;
        }
    
        let dPlaneNorm = pMesh._arrSurface[pMesh._arrSubsets[uSubsetIndex]._uGeomIndex].Surfacedata.plane.vAxisZ;
        let dCos = IKS_MATH.BPVec3Dot(dPlaneNorm, this.m_vPlaneNorm);
        if (dCos < 0.999 && dCos > -0.999) {
            // 夹角大于2.56度直接判定为不平行
            return false;
        } else if (dCos > 1.0) {
            dCos = 1.0;
        } else if (dCos < -1.0) {
            dCos = -1.0;
        }

        let dSin = Math.sqrt(1.0 - dCos*dCos);
        let vMax = pMesh._arrSubsets[uSubsetIndex]._box._max;
        let vMin = pMesh._arrSubsets[uSubsetIndex]._box._min;
        let dLength = IKS_MATH.CalculateDistance(vMax, vMin);
        let fDist = dLength * dSin;
    
        return ISDEQUALEX(fDist, 0.0, this.m_fZero);
    }

    // 通过端点获取边索引
    this.GetEdgeIndexByPort = function(uEdgeStartPtIndex, uEdgeEndPtIndex) {
        let ret = {edgeIndex: INVALID_ID, relationIndexStart: INVALID_ID}
        let uIndex = this.m_mapPtEdgeRalationship.get(uEdgeStartPtIndex);

        if (uIndex == undefined || uIndex >= this.m_arrPtEdgeRalationship.length) {
            return ret;
        }

        ret.relationIndexStart = uIndex;
        let uIndex2 = INVALID_ID;
        for (let i = 1; i < this.m_arrPtEdgeRalationship[uIndex].length; i++) {
            if (this.m_arrPtEdgeRalationship[uIndex][i] == uEdgeEndPtIndex) {
                uIndex2 = i - 1;
                break;
            }
        }
        if (uIndex2 == INVALID_ID) {
            return ret;
        }

        ret.edgeIndex = this.m_arrPtEdgeIndexRalationship[uIndex][uIndex2];
        return ret;
    }

    // 添加端点与边的关系(不验证边是否已添加)
    this.AddPortEdgeRalationship = function(uEdgeStartPtIndex, uEdgeEndPtIndex, uEdgeIndex, pRelationIndexStart, pRelationIndexEnd) {
        let uOutRelationIndexStart = INVALID_ID;
        let uOutRelationIndexEnd = INVALID_ID;
        // 记录起点关系
        let uIndex = pRelationIndexStart;

        if (uIndex == INVALID_ID) {
            uIndex = this.m_arrPtEdgeRalationship.length;
            this.m_mapPtEdgeRalationship.set(uEdgeStartPtIndex, uIndex);

            let ptEdgeRatationship = new Array();
            ptEdgeRatationship.push(uEdgeStartPtIndex);
            ptEdgeRatationship.push(uEdgeEndPtIndex);
            this.m_arrPtEdgeRalationship.push(ptEdgeRatationship);

            let ptEdgeIndexRatationship = new Array();
            ptEdgeIndexRatationship.push(uEdgeIndex);
            this.m_arrPtEdgeIndexRalationship.push(ptEdgeIndexRatationship);

            uOutRelationIndexStart = uIndex;
        } else {
            this.m_arrPtEdgeRalationship[uIndex].push(uEdgeEndPtIndex);
            this.m_arrPtEdgeIndexRalationship[uIndex].push(uEdgeIndex);
            uOutRelationIndexStart = pRelationIndexStart;
        }

        // 记录终点关系
        uIndex = pRelationIndexEnd;

        if (uIndex == INVALID_ID) {
            uIndex = this.m_arrPtEdgeRalationship.length;
            this.m_mapPtEdgeRalationship.set(uEdgeEndPtIndex, uIndex);

            let ptEdgeRatationship = new Array();
            ptEdgeRatationship.push(uEdgeEndPtIndex);
            ptEdgeRatationship.push(uEdgeStartPtIndex);
            this.m_arrPtEdgeRalationship.push(ptEdgeRatationship);

            let ptEdgeIndexRatationship = new Array();
            ptEdgeIndexRatationship.push(uEdgeIndex);
            this.m_arrPtEdgeIndexRalationship.push(ptEdgeIndexRatationship);
    
            uOutRelationIndexEnd = uIndex;
        } else {
            this.m_arrPtEdgeRalationship[uIndex].push(uEdgeStartPtIndex);
            this.m_arrPtEdgeIndexRalationship[uIndex].push(uEdgeIndex);
            uOutRelationIndexEnd = pRelationIndexEnd;
        }

        return {
            start: uOutRelationIndexStart,
            end: uOutRelationIndexEnd,
        };
    }

    this.ClearAllPoint = function() {
        this.m_arrPoints.splice(0, this.m_arrPoints.length);

        this.m_uPointMemPoolSize = 0;
    }
    this.ClearAllEdge = function() {
        for (let i = 0; i < this.m_arrEdges.length; i++) {
            this.m_arrEdges[i].clear();
        }
        this.m_arrEdges.splice(0, this.m_arrEdges.length);

        this.m_uEdgeMemPoolSize = 0;
    }
    this.ClearAllTriangle = function() {
        this.m_arrTriangles.splice(0, this.m_arrTriangles.length);

        this.m_uTriangleMemPoolSize = 0;
    }
    this.ClearAllSubset = function() {
        for (let i = 0; i < this.m_arrSubset.length; ++i) {
            if (this.m_arrSubset[i] == null) {
                continue;
            }
            this.m_arrSubset[i].clear();
        }
        this.m_arrSubset.splice(0, this.m_arrSubset.length);
    }

    this.ResetPointPool = function(uSize) {
        this.m_uPointMemPoolSize = uSize;
        if (this.m_uPointMemPoolSize > 0)
        {
            // this.m_pPointMemPool = new Array(this.m_uPointMemPoolSize);
            // for (let i = 0; i < this.m_uPointMemPoolSize; ++i) {
            //     this.m_pPointMemPool[i] = new SecPlanePoint();
            // }

            this.m_arrPoints = new Array();
        }
    }
    this.AddPoint = function(mdlPtIndex) {
        this.m_uTempIndex = this.m_arrPoints.length;
        let pPt = null;

        // if (this.m_uTempIndex < this.m_uPointMemPoolSize) {
        //     pPt = this.m_pPointMemPool[this.m_uTempIndex];
        // } else {
        //     pPt = new SecPlanePoint();
        // }

        pPt = new SecPlanePoint();
        pPt.uMdlPtIndex = mdlPtIndex;
        this.m_arrPoints.push(pPt);
        return this.m_uTempIndex;
    }

    this.ResetEdgePool = function(uSize) {
        this.m_uEdgeMemPoolSize = uSize;
        if (this.m_uEdgeMemPoolSize > 0)
        {
            // this.m_pEdgeMemPool = new Array(this.m_uEdgeMemPoolSize);
            // for (let i = 0; i < this.m_uEdgeMemPoolSize; ++i) {
            //     this.m_pEdgeMemPool[i] = new SecPlaneEdge();
            // }

            this.m_arrEdges = new Array();
        }
    }
    this.AddEdge = function(triIndex1, triIndex2) {
        this.m_uTempIndex = this.m_arrEdges.length;
        let pEdge = null;

        // if (this.m_uTempIndex < this.m_uEdgeMemPoolSize) {
        //     pEdge = this.m_pEdgeMemPool[this.m_uTempIndex];
        // } else {
        //     pEdge = new SecPlaneEdge();
        // }

        pEdge = new SecPlaneEdge();
        pEdge.uTriIndex1 = triIndex1;
        pEdge.uTriIndex2 = triIndex2;
        this.m_arrEdges.push(pEdge);

        return {
            edge: pEdge,
            edgeIndex: this.m_uTempIndex,
        };
    }

    this.ResetTrianglePool = function(uSize) {
        this.m_uTriangleMemPoolSize = uSize;
        if (this.m_uTriangleMemPoolSize > 0)
        {
            // this.m_pTriangleMemPool = new Array(this.m_uTriangleMemPoolSize);
            // for (let i = 0; i < this.m_uTriangleMemPoolSize; ++i) {
            //     this.m_pTriangleMemPool[i] = new SecPlaneTriangle();
            // }

            this.m_arrTriangles = new Array();
        }
    }
    this.AddTriangle = function(edgePort1, edgePort2, edgePort3) {
        this.m_uTempIndex = this.m_arrTriangles.length;
        let pTriangle = null;

        // if (this.m_uTempIndex < this.m_uTriangleMemPoolSize) {
        //     pTriangle = this.m_pTriangleMemPool[this.m_uTempIndex];
        // } else {
        //     pTriangle = new SecPlaneTriangle();
        // }

        pTriangle = new SecPlaneTriangle();
        pTriangle.uPtIndex1 = edgePort1;
        pTriangle.uPtIndex2 = edgePort2;
        pTriangle.uPtIndex3 = edgePort3;
        pTriangle.bIsScanned = false;
        this.m_arrTriangles.push(pTriangle);

        return this.m_uTempIndex;
    }

    this.GetZero = function() {
        return this.m_fZero;
    }

    this.GetEpsilon = function() {
        return this.m_fEpsilon;
    }

    this.GetModelSizeInPlane = function() {
        return this.m_fModelSizeInPlane;
    }

    this.IsReBuild = function() {
        return this.m_bIsReBuild;
    }

    this.GetPoint = function(uIndex) {
        return this.m_arrPoints[uIndex];
    }
    this.GetEdge = function(uIndex) {
        return this.m_arrEdges[uIndex];
    }
    this.GetTriangle = function(uIndex) {
        return this.m_arrTriangles[uIndex];
    }
    this.GetSubsetNum = function() {
        return this.m_arrSubset.length;
    }
}

function SectionPlaneCalc() {
    this.m_arrSecPlaneModel = new Array();
    this.m_uCurModelIndex = -1;            // 当前正在计算的模型的索引

    this.m_pCurModel = new SecPlaneModel();
    this.m_pCurSubset = new SecPlaneSubset();
    this.m_uCurSubsetTriIndex = -1;
    this.m_arrCurSubsetNextTriData_Rear = new Array();
    this.m_arrCurSubsetNextTriData_Front = new Array();
    this.m_arrCurContourFrag_Rear = new Array();                // 当前轮廓线片段的后半段，例如P1、P2、P3...(轮廓线的方向是从前向后)
    this.m_arrCurContourFrag_Front = new Array();            // 当前轮廓线片段的前半段，例如P2、P1、P0...(轮廓线的方向是从后向前)
    this.m_arrContourFrag = new Array();    // 轮廓线片段

    // 临时变量
    this.m_arrContourPt = new Array();        // 轮廓线的点
    this.m_arrCurContourPt = new Array();                    // 当前访问的轮廓线片段
    this.m_arrContourMask = new Array();                            // 轮廓线片段拼接标志
    this.m_arrCurContourMask = new Array();                        // 轮廓线片段访问标志
    this.m_arrContourRecord = new Array();                        // 轮廓线片段连接记录
    this.m_arrTempAdjacentTriIndex = new Array();
    this.m_arrTempPtIndex = new Array();
    this.m_arrTempPtPreNextIndex = new Array();
    this.m_arrTempEdgePtIndex = new Array();
    this.m_vTempPreNextPtIndex = -1;
    this.m_fZero = 0.000001;
    this.m_fRelativeZero = 0.000001;
    this.m_matMdlWorldInv = mat4.create();
    this.m_vMdlPlanePt = new Point3(0, 0, 0);
    this.m_vMdlPlaneNormal = new Vector3(0, 0, 0);

    this.m_ptCross1 = new Point3(0, 0, 0);
    this.m_ptCross2 = new Point3(0, 0, 0);

    this.m_arrWjlTest1 = new Array();
    this.m_arrWjlTest2 = new Array();
    this.m_arrWjlTest3 = new Array();
    this.m_arrWjlTest4 = new Array();


    // 创建剖切平面计算器所需资源
    this.Create = function() {
        return true;
    }
    // 释放剖切平面计算器所需资源
    this.Release = function() {
        for (let i=0; i<this.m_arrSecPlaneModel.length; i++)
        {
            this.m_arrSecPlaneModel[i].Release();
        }
    }

    // 初始化数据
    this.InitData = function(arrModelDesc, fRelativeZero) {
        this.m_arrSecPlaneModel = new Array(arrModelDesc.length);
        for (let i=0; i<this.m_arrSecPlaneModel.length; i++)
        {
            this.m_arrSecPlaneModel[i] = new SecPlaneModel();
            this.m_arrSecPlaneModel[i].Create(arrModelDesc[i], fRelativeZero);
            this.m_arrSecPlaneModel[i].InitData();
        }

        this.m_fRelativeZero = fRelativeZero;
        return true;
    }
    // 清除初始化数据
    this.UnInitData = function() {
        for (let i=0; i<this.m_arrSecPlaneModel.length; i++)
        {
            if (this.m_arrSecPlaneModel[i] == null) {
                continue;
            }
            this.m_arrSecPlaneModel[i].Release();
        }
        this.m_arrSecPlaneModel.splice(0, this.m_arrSecPlaneModel.length);
        this.m_uCurModelIndex = INVALID_ID;

        this.m_pCurModel = null;
        this.m_pCurSubset = null;
        this.m_arrCurSubsetNextTriData_Rear.splice(0, this.m_arrCurSubsetNextTriData_Rear.length);
        this.m_arrCurSubsetNextTriData_Front.splice(0, this.m_arrCurSubsetNextTriData_Front.length);
        this.m_arrCurContourFrag_Rear.splice(0, this.m_arrCurContourFrag_Rear.length);
        this.m_arrCurContourFrag_Front.splice(0, this.m_arrCurContourFrag_Front.length);
        for (let i = 0; i < this.m_arrContourFrag.length; ++i) {
            if (this.m_arrContourFrag[i] != null) {
                this.m_arrContourFrag[i].splice(0, this.m_arrContourFrag[i].length);
            }
        }
        for (let i = 0; i < this.m_arrContourPt.length; ++i) {
            if (this.m_arrContourPt[i] != null) {
                this.m_arrContourPt[i].splice(0, this.m_arrContourPt[i].length);
            }
        }
        this.m_arrCurContourPt.splice(0, this.m_arrCurContourPt.length);
        this.m_arrContourMask.splice(0, this.m_arrContourMask.length);
        this.m_arrCurContourMask.splice(0, this.m_arrCurContourMask.length);
        this.m_arrContourRecord.splice(0, this.m_arrContourRecord.length);
        this.m_arrTempAdjacentTriIndex.splice(0, this.m_arrTempAdjacentTriIndex.length);
        this.m_arrTempPtIndex.splice(0, this.m_arrTempPtIndex.length);
        this.m_arrTempPtPreNextIndex.splice(0, this.m_arrTempPtIndex.length);
        this.m_arrTempEdgePtIndex.splice(0, this.m_arrTempPtIndex.length);
    }

    // 生成剖切平面的轮廓线(若未相交则返回的轮廓线中的点集和索引集均为空)
    this.CreateSectionPlaneContour = function(modelIndex, matMdlWorld, vPlanePt, vPlaneNormal, stuSecPlaneContourInfo) {
        this.m_uCurModelIndex = modelIndex;
        return this.CreateSectionPlaneContour_Ver2(matMdlWorld, vPlanePt, vPlaneNormal, stuSecPlaneContourInfo);
    }

    // 检验模型与剖切平面是否相交
    this.CheckSecPlaneMdlIntersect = function (modelIndex, matMdlWorld, vPlanePt, vPlaneNormal) {
        if (modelIndex >= this.m_arrSecPlaneModel.length) {
            return false;
        }
        let pModel = this.m_arrSecPlaneModel[modelIndex];

        // 将剖切平面变换到模型的局部坐标系下
        mat4.invert(this.m_matMdlWorldInv, matMdlWorld);
        CalVec3TransformCoord(this.m_vMdlPlanePt, vPlanePt, this.m_matMdlWorldInv);
        CalVec3TransformNormal(this.m_vMdlPlaneNormal, vPlaneNormal, this.m_matMdlWorldInv);
        this.m_vMdlPlaneNormal.normalize();

        // 验证模型包围球是否与剖切平面相交
        if(!pModel.CheckCrashOfModelBoundSphereAndPlane(this.m_vMdlPlanePt, this.m_vMdlPlaneNormal)) {
            return false;
        }

        // // 重建模型的拓扑数据
        // if (!pModel.IsReBuild()) {
        //     pModel.ReBuildTopologicalData();
        // }

        // 初始化模型的平面数据
        pModel.InitPlaneData(this.m_vMdlPlanePt, this.m_vMdlPlaneNormal);

        // 初始化拓扑数据
        pModel.InitTopologicalData();

        // 创建轮廓线片段
        let bIntersect = false;
        let i, j;
        let uSubsetNum = pModel.GetSubsetNum();
        let pCurSubset = null;
        let pTri = null;
        let nRel1, nRel2, nRel3, nRelSum;
        for (i=0; i<uSubsetNum; i++)
        {
            pCurSubset = pModel.m_arrSubset[i];
            if (!pCurSubset.bIsValid) {
                continue;
            }
            if (!pModel.CheckCrashOfSubsetBoundSphereAndPlane(i)) {
                continue;
            }
            // if (pModel.IsSubsetParallelWithPlane(i)) {
            //     continue;
            // }

            for (j=0; j<pCurSubset.arrTriangleIndex.length; j++)
            {
                pTri = pModel.GetTriangle(pCurSubset.arrTriangleIndex[j]);
                if (pTri == undefined) {
                    continue;
                }
                nRel1 = pModel.GetRelationshipOfPointAndPlane(pTri.uPtIndex1);
                nRel2 = pModel.GetRelationshipOfPointAndPlane(pTri.uPtIndex2);
                nRel3 = pModel.GetRelationshipOfPointAndPlane(pTri.uPtIndex3);
                nRelSum = nRel1 + nRel2 + nRel3;
                if (nRelSum >= 2 || nRelSum <= -2) {
                    continue;
                }
                bIntersect = true;
                break;
            }

            if (bIntersect) {
                break;
            }
        }

        return bIntersect;
    }

    // 获取模型的精度
    this.GetModelZero = function(modelIndex) {
        if (modelIndex >= this.m_arrSecPlaneModel.length) {
            return 0.0;
        }
    
        return this.m_arrSecPlaneModel[modelIndex].GetZero();
    }
    // 获取模型的尺寸
    this.GetModelSize = function(modelIndex) {
        if (modelIndex >= this.m_arrSecPlaneModel.length) {
            return 0.0;
        }
        let pMesh = this.m_arrSecPlaneModel[modelIndex].m_pDescMesh._arrPartLODData[0];
        if (pMesh == null) {
            return 0.0;
        }
    
        return CalDistanceOfPoint3d(pMesh._boxset._ObjectBox._Vertex[7], pMesh._boxset._ObjectBox._Vertex[0]);
    }
    // 获取模型在平面上的尺寸
    this.GetModelSizeInPlane = function(modelIndex) {
        if (modelIndex >= this.m_arrSecPlaneModel.length) {
            return 0.0;
        }

        return this.m_arrSecPlaneModel[modelIndex].GetModelSizeInPlane();
    }

    // 生成剖切平面的轮廓线(若未相交则返回的轮廓线中的点集和索引集均为空)
    this.CreateSectionPlaneContour_Ver2 = function(matMdlWorld, vPlanePt, vPlaneNormal, stuSecPlaneContourInfo) {
        let pModel = this.m_arrSecPlaneModel[this.m_uCurModelIndex];

        // 将剖切平面变换到模型的局部坐标系下
        mat4.invert(this.m_matMdlWorldInv, matMdlWorld);
        CalVec3TransformCoord(this.m_vMdlPlanePt, vPlanePt, this.m_matMdlWorldInv);
        CalVec3TransformNormal(this.m_vMdlPlaneNormal, vPlaneNormal, this.m_matMdlWorldInv);
        this.m_vMdlPlaneNormal.normalize();

        // 验证模型包围球是否与剖切平面相交
        if(!pModel.CheckCrashOfModelBoundSphereAndPlane(this.m_vMdlPlanePt, this.m_vMdlPlaneNormal)) {
            return false;
        }

        // // 重建模型的拓扑数据
        // if (!pModel.IsReBuild()) {
        //     pModel.ReBuildTopologicalData();
        // }

        // 初始化模型的平面数据
        pModel.InitPlaneData(this.m_vMdlPlanePt, this.m_vMdlPlaneNormal);

        // 初始化拓扑数据
        pModel.InitTopologicalData();

        // 初始化数据
        this.m_arrContourFrag.splice(0, this.m_arrContourFrag.length);
        this.m_pCurModel = pModel;

        // 创建轮廓线片段
        let i, j;
        let arrNextTriData = null;
        let uSubsetNum = pModel.GetSubsetNum();

        // this.m_arrWjlTest1.splice(0, this.m_arrWjlTest1.length);
        // this.m_arrWjlTest2.splice(0, this.m_arrWjlTest2.length);

        for (i=0; i<uSubsetNum; i++)
        {
            this.m_pCurSubset = pModel.m_arrSubset[i];
            if (this.m_pCurSubset == null) {
                continue;
            }
            if (!this.m_pCurSubset.bIsValid) {
                continue;
            }
            if (!pModel.CheckCrashOfSubsetBoundSphereAndPlane(i)) {
                continue;
            }
            // if (pModel.IsSubsetParallelWithPlane(i)) {
            //     continue;
            // }

            this.m_uCurSubsetTriIndex = 0;
            this.m_arrCurSubsetNextTriData_Rear.splice(0, this.m_arrCurSubsetNextTriData_Rear.length);
            this.m_arrCurSubsetNextTriData_Front.splice(0, this.m_arrCurSubsetNextTriData_Front.length);
            this.m_arrCurContourFrag_Rear.splice(0, this.m_arrCurContourFrag_Rear.length);
            this.m_arrCurContourFrag_Front.splice(0, this.m_arrCurContourFrag_Front.length);

            while (arrNextTriData = this.GetNextTriData())
            {
                for (j=0; j<arrNextTriData.length; j++)
                {
                    if (this.CalcNextContourPt(arrNextTriData[j])) {
                        // this.m_arrWjlTest1.push(arrNextTriData[j].uTriIndex);
                        break;
                    }
                }
                this.BuildContourFrag();
            }
        }

        // if (this.m_arrWjlTest1.length > 0) {
        //     console.log(this.m_arrWjlTest1.toString());
        //     console.log(uSubsetNum);
        // }

        // 创建轮廓线
        this.BuildContour(stuSecPlaneContourInfo);

        return true;
    }

    // 获取下一个三角片数据
    this.GetNextTriData = function() {
        let arrNextTriData = null;
        if (this.m_arrCurSubsetNextTriData_Rear.length > 0)
        {
            arrNextTriData = this.m_arrCurSubsetNextTriData_Rear;
            this.m_arrCurSubsetNextTriData_Rear = new Array();
            return arrNextTriData;
        }
        else if (this.m_arrCurSubsetNextTriData_Front.length > 0)
        {
            arrNextTriData = this.m_arrCurSubsetNextTriData_Front;
            this.m_arrCurSubsetNextTriData_Front = new Array();
            return arrNextTriData;
        }
        else
        {
            let pTri = null;
            while (this.m_uCurSubsetTriIndex < this.m_pCurSubset.arrTriangleIndex.length)
            {
                pTri = this.m_pCurModel.GetTriangle(this.m_pCurSubset.arrTriangleIndex[this.m_uCurSubsetTriIndex]);
                this.m_uCurSubsetTriIndex++;
                if (pTri == undefined || pTri.bIsScanned) {
                    continue;
                }
                
                arrNextTriData = new Array();
                let nextTri = new SecPlaneNextTriData();
                nextTri.uTriIndex = this.m_pCurSubset.arrTriangleIndex[this.m_uCurSubsetTriIndex-1];
                nextTri.bNextToContourFragEnd = true;
                nextTri.bIsPtVisited1 = false;
                nextTri.bIsPtVisited2 = false;
                nextTri.bIsPtVisited3 = false;
                arrNextTriData.push(nextTri);

                return arrNextTriData;
            }
        }

        return null;
    }
    // 创建轮廓线片段
    this.BuildContourFrag = function() {
        let bBuild = false;

        if (this.m_arrCurContourFrag_Rear.length > 2 || this.m_arrCurContourFrag_Front.length > 2)
        {
            // 使用绝对零判断是否重合(理论上遍历回最起始的那个点/边时,计算出的交点必然完全相同--相同的输入必然有相同的输出)
            let rearPt = this.m_arrCurContourFrag_Rear[this.m_arrCurContourFrag_Rear.length-1];
            let frontPt = this.m_arrCurContourFrag_Front[this.m_arrCurContourFrag_Front.length-1];
            if (rearPt.x == frontPt.x && rearPt.y == frontPt.y && rearPt.z == frontPt.z) {
                bBuild = true;
            }
        }
        if (!bBuild)
        {
            if (this.m_arrCurSubsetNextTriData_Rear.length == 0 && this.m_arrCurSubsetNextTriData_Front.length == 0)
            {
                if (this.m_arrCurContourFrag_Rear.length >= 2 || this.m_arrCurContourFrag_Front.length >= 2) {
                    bBuild = true;
                }
            }
        }
    
        if (bBuild)
        {
            let backContourFrag = new Array();
            for (let i=0; i<this.m_arrCurContourFrag_Front.length; i++) {
                backContourFrag.push(this.m_arrCurContourFrag_Front[this.m_arrCurContourFrag_Front.length-1-i]);
            }
            if (this.m_arrCurContourFrag_Rear.length > 2) {
                for (let i=2; i<this.m_arrCurContourFrag_Rear.length; i++) {
                    backContourFrag.push(this.m_arrCurContourFrag_Rear[i]);
                }
            }
    
            this.m_arrCurContourFrag_Rear.splice(0, this.m_arrCurContourFrag_Rear.length);
            this.m_arrCurContourFrag_Front.splice(0, this.m_arrCurContourFrag_Front.length);
            this.m_arrCurSubsetNextTriData_Rear.splice(0, this.m_arrCurSubsetNextTriData_Rear.length);
            this.m_arrCurSubsetNextTriData_Front.splice(0, this.m_arrCurSubsetNextTriData_Front.length);
            this.m_arrContourFrag.push(backContourFrag);
        }
    
        return bBuild;
    }
    // 计算下一个轮廓线上的点
    this.CalcNextContourPt = function(stuNextTriData) {
        if (stuNextTriData.bIsPtVisited1 && stuNextTriData.bIsPtVisited2 && stuNextTriData.bIsPtVisited3) {
            return false;
        }

        let pTri = this.m_pCurModel.GetTriangle(stuNextTriData.uTriIndex);
        if (pTri == undefined || pTri.bIsScanned) {
            return false;
        }

        pTri.bIsScanned = true;
        let ret = null;

        if ((!stuNextTriData.bIsPtVisited1) && (!stuNextTriData.bIsPtVisited2) && (!stuNextTriData.bIsPtVisited3)) {
            ret = this.CalcNextContourPt_NoPtVisited(stuNextTriData, pTri);
        } else {
            ret = this.CalcNextContourPt_PtVisited(stuNextTriData, pTri);
        }

        // if (ret.bFind) {
        //     this.m_arrWjlTest2.push(stuNextTriData.uTriIndex);
        // }

        // 找到下一个轮廓线上的点,但该点对于当前轮廓线片段不合理
        if (ret.bFind && (!ret.bValid))
        {
            pTri.bIsScanned = false;
        }

        return ret.bValid;
    }
    // 计算下一个轮廓线上的点
    this.CalcNextContourPt_NoPtVisited = function(stuNextTriData, pTri) {
        let ret = {bFind: false, bValid: false};
        let pModel = this.m_arrSecPlaneModel[this.m_uCurModelIndex];

        // 获取三角片与平面相交的且未访问的点和边数据
        this.m_arrTempPtIndex.splice(0, this.m_arrTempPtIndex.length);
        this.m_arrTempPtPreNextIndex.splice(0, this.m_arrTempPtPreNextIndex.length);
        this.m_arrTempEdgePtIndex.splice(0, this.m_arrTempEdgePtIndex.length);
        if (!this.GetUnVisitedTriPointEdgeDateCrossWithPlane(stuNextTriData, pModel, pTri,
            this.m_arrTempPtIndex, this.m_arrTempPtPreNextIndex, this.m_arrTempEdgePtIndex)) {
            return ret;
        }

        // 计算交点,生成下一组待遍历三角片的数据
        let ptCross1 = new Point3(0, 0, 0);
        let ptCross2 = new Point3(0, 0, 0);
        let bIsCurCrossEnd = false;
        for (let i=0; i<this.m_arrTempPtIndex.length; i++)
        {
            bIsCurCrossEnd = this.IsContourPtEnd(this.m_arrTempPtPreNextIndex[i*2], this.m_arrTempPtPreNextIndex[i*2+1], pModel);
            if (bIsCurCrossEnd) {
                pModel.GetPointPosition(this.m_arrTempPtIndex[i], ptCross2);
            } else {
                pModel.GetPointPosition(this.m_arrTempPtIndex[i], ptCross1);
            }
            this.GenerateNextTriDataByPoint(this.m_arrTempPtIndex[i], bIsCurCrossEnd);
        }
        let vCurCross = new Point3(0, 0, 0);
        for (let i=0; i<this.m_arrTempEdgePtIndex.length; i+=2)
        {
            pModel.CalcIntersectionOfLineAndPlane(this.m_arrTempEdgePtIndex[i], this.m_arrTempEdgePtIndex[i+1], vCurCross);
            bIsCurCrossEnd = this.IsContourPtEnd(this.m_arrTempEdgePtIndex[i], this.m_arrTempEdgePtIndex[i+1], pModel);
            if (bIsCurCrossEnd) {
                ptCross2.set(vCurCross.x, vCurCross.y, vCurCross.z);
            } else {
                ptCross1.set(vCurCross.x, vCurCross.y, vCurCross.z);
            }
            this.GenerateNextTriDataByEdge(this.m_arrTempEdgePtIndex[i], this.m_arrTempEdgePtIndex[i+1], bIsCurCrossEnd);
        }

        // 生成轮廓线片段的数据
        this.m_arrCurContourFrag_Rear.push(ptCross1);
        this.m_arrCurContourFrag_Rear.push(ptCross2);
        this.m_arrCurContourFrag_Front.push(ptCross2);
        this.m_arrCurContourFrag_Front.push(ptCross1);

        ret.bFind = true, ret.bValid = true;
        return ret;
    }
    // 计算下一个轮廓线上的点
    this.CalcNextContourPt_PtVisited = function(stuNextTriData, pTri) {
        let ret = {bFind: false, bValid: false};
        let pModel = this.m_arrSecPlaneModel[this.m_uCurModelIndex];
        if (pTri == null) {
            pTri = pModel.GetTriangle(stuNextTriData.uTriIndex);
        }

        // 获取三角片与平面相交的且未访问的点和边数据
        this.m_arrTempPtIndex.splice(0, this.m_arrTempPtIndex.length);
        this.m_arrTempPtPreNextIndex.splice(0, this.m_arrTempPtPreNextIndex.length);
        this.m_arrTempEdgePtIndex.splice(0, this.m_arrTempEdgePtIndex.length);
        ret.bFind = this.GetUnVisitedTriPointEdgeDateCrossWithPlane(stuNextTriData, pModel, pTri,
            this.m_arrTempPtIndex, this.m_arrTempPtPreNextIndex, this.m_arrTempEdgePtIndex);
        if (!ret.bFind) {
            return ret;
        }
        let bIsTriPtOnPlane = (this.m_arrTempPtIndex.length == 1);
        if (!bIsTriPtOnPlane)
        {
            if (this.m_arrTempEdgePtIndex.length != 2)
            {
                ret.bFind = false;
                return ret;
            }
        }

        // 验证交点是否合理
        let bIsCurCrossEnd = false;
        if (bIsTriPtOnPlane) {
            bIsCurCrossEnd = this.IsContourPtEnd(this.m_arrTempPtPreNextIndex[0], this.m_arrTempPtPreNextIndex[1], pModel);
        } else {
            bIsCurCrossEnd = this.IsContourPtEnd(this.m_arrTempEdgePtIndex[0], this.m_arrTempEdgePtIndex[1], pModel);
        }
        if (bIsCurCrossEnd != stuNextTriData.bNextToContourFragEnd) {
            return ret;
        }

        // 计算交点,生成下一组待遍历三角片的数据
        let ptCross = new Point3(0, 0, 0);
        if (bIsTriPtOnPlane)
        {
            pModel.GetPointPosition(this.m_arrTempPtIndex[0], ptCross);
            this.GenerateNextTriDataByPoint(this.m_arrTempPtIndex[0], bIsCurCrossEnd);
        }
        else
        {
            pModel.CalcIntersectionOfLineAndPlane(this.m_arrTempEdgePtIndex[0], this.m_arrTempEdgePtIndex[1], ptCross);
            this.GenerateNextTriDataByEdge(this.m_arrTempEdgePtIndex[0], this.m_arrTempEdgePtIndex[1], bIsCurCrossEnd);
        }
        if (bIsCurCrossEnd) {
            this.m_arrCurContourFrag_Rear.push(ptCross);
        } else {
            this.m_arrCurContourFrag_Front.push(ptCross);
        }

        ret.bValid = true;
        return ret;
    }

    // 创建轮廓线
    this.BuildContour = function(stuSecPlaneContourInfo) {
        // 连接轮廓线片段
        if (!this.BuildContour_JointContourFrag()) {
            return false;
        }

        // 创建轮廓线_优化轮廓线
        this.BuildContour_OptimizeContour();

        // 将闭合的轮廓线输出
        let uNum = 0, uOffset = 0;
        for (let i=0; i<this.m_arrContourPt.length; i++) {
            uNum += this.m_arrContourPt[i].length - 1;
        }
        if (uNum == 0) {
            return false;
        }

        stuSecPlaneContourInfo._arrVertexData = new Float32Array(uNum * 3);
        stuSecPlaneContourInfo._arrIndexData = new Array(this.m_arrContourPt.length);
        for (let i=0; i<this.m_arrContourPt.length; i++)
        {
            uNum = this.m_arrContourPt[i].length - 1;
            if (uNum == 0) {
                continue;
            }

            for (let j=0; j<this.m_arrContourPt[i].length; ++j) {
                stuSecPlaneContourInfo._arrVertexData[(uOffset+j)*3+0] = this.m_arrContourPt[i][j].x;
                stuSecPlaneContourInfo._arrVertexData[(uOffset+j)*3+1] = this.m_arrContourPt[i][j].y;
                stuSecPlaneContourInfo._arrVertexData[(uOffset+j)*3+2] = this.m_arrContourPt[i][j].z;
            }

            stuSecPlaneContourInfo._arrIndexData[i] = new Uint16Array(uNum + 1);
            for (let j=0; j<uNum; j++) {
                stuSecPlaneContourInfo._arrIndexData[i][j] = uOffset + j;
            }
            stuSecPlaneContourInfo._arrIndexData[i][uNum] = uOffset;
            uOffset += uNum;
        }

        return true;
    }
    // 创建轮廓线_连接轮廓线片段
    this.BuildContour_JointContourFrag = function() {
        this.m_arrContourPt.splice(0, this.m_arrContourPt.length);

        // 初始化访问标志数组
        this.m_arrContourMask = new Array(this.m_arrContourFrag.length);
        this.m_arrCurContourMask = new Array(this.m_arrContourFrag.length);

        let ptBegin = null, ptEnd = null;
        let fDisMin = 0, fTemp = 0;
        let uNextIndex = INVALID_ID, uIndex = INVALID_ID;
        let bConnected = false;
        let fEpsilon = this.m_arrSecPlaneModel[this.m_uCurModelIndex].GetEpsilon();
        let fZero = this.GetModelSizeInPlane(this.m_uCurModelIndex) * ZERO * 10.0;

        for (let i = 0; i < this.m_arrContourFrag.length; i++)
        {
            if (this.m_arrContourMask[i]) {
                continue;
            }
            this.m_arrCurContourPt = new Array();
            for (let j = 0; j < this.m_arrContourFrag[i].length; ++j) {
                this.m_arrCurContourPt.push(this.m_arrContourFrag[i][j]);
            }
            for (let j = 0; j < this.m_arrContourFrag.length; ++j) {
                this.m_arrCurContourMask[j] = false;
            }

            this.m_arrCurContourMask[i] = true;
            this.m_arrContourRecord = new Array(1);
            this.m_arrContourRecord[0] = i;

            ptBegin = this.m_arrContourFrag[i][0];
            ptEnd = this.m_arrContourFrag[i][this.m_arrContourFrag[i].length - 1];

            uNextIndex = i;
            while (uNextIndex != INVALID_ID)
            {
                fTemp = CalDistanceOfPoint3d(ptBegin, ptEnd);
                // 如果轮廓片段闭合
                if (ISDEQUALEX(fTemp, 0.0, fZero))
                {
                    this.m_arrContourPt.push(this.m_arrCurContourPt);
                    for (let j = 0; j < this.m_arrContourRecord.length; j ++) {
                        this.m_arrContourMask[this.m_arrContourRecord[j]] = true;
                    }
                    break;
                }

                fDisMin = fEpsilon;
                bConnected = false;
                if (ISDEQUALEX(fTemp, 0.0, fEpsilon))
                {
                    fDisMin = fTemp;
                    bConnected = true;
                }

                // 寻找下一个片段
                uNextIndex = INVALID_ID;
                for (let j = 0; j < this.m_arrContourFrag.length; j++)
                {
                    // 如果该段当前被访问过
                    if (this.m_arrContourMask[j] || this.m_arrCurContourMask[j]) {
                        continue;
                    }
                    fTemp = CalDistanceOfPoint3d(this.m_arrContourFrag[j][0], ptEnd);
                    if (ISDEQUALEX(fTemp, 0.0, fEpsilon))
                    {
                        // 如果之前未访问其他片段且当前首尾不相连
                        if ((uNextIndex == INVALID_ID) && (!bConnected))
                        {
                            uNextIndex = j;
                            fDisMin = fTemp;
                        }
                        else
                        {
                            if (fTemp < fDisMin)
                            {
                                uNextIndex = j;
                                fDisMin = fTemp;
                            }
                        }
                    }
                }

                // 未找到下一段
                if (uNextIndex == INVALID_ID)
                {
                    // 如果精度范围内首尾相连且未找到下一段，则表示连接的是最短距离并且已闭合；
                    if (bConnected)
                    {
                        this.m_arrContourPt.push(this.m_arrCurContourPt);
                        for (let j = 0; j < this.m_arrContourRecord.length; j ++) {
                            this.m_arrContourMask[this.m_arrContourRecord[j]] = true;
                        }
                    }
                    // 如果首尾在精度内不相连且未找到下一段，则当前段无法形成闭合
                    break;
                }
                // 如果找到一段与尾端距离更小，则继续寻找下一段
                else
                {
                    let backIndex = this.m_arrContourFrag[uNextIndex].length - 1;
                    ptEnd = this.m_arrContourFrag[uNextIndex][backIndex];
                    this.m_arrContourRecord.push(uNextIndex);
                    this.m_arrCurContourMask[uNextIndex] = true;
                    for (let j = 0; j < this.m_arrContourFrag[uNextIndex].length; j++) {
                        this.m_arrCurContourPt.push(this.m_arrContourFrag[uNextIndex][j]);
                    }
                }
            }
        }

        return true;
    }
    // 创建轮廓线_优化轮廓线
    this.BuildContour_OptimizeContour = function() {
        // 创建轮廓线_优化轮廓线_共线
        this.BuildContour_OptimizeContour_Collinear();
        // 创建轮廓线_优化轮廓线_重合
        this.BuildContour_OptimizeContour_Overlap();

        // 创建轮廓线_优化轮廓线_去除不合理的轮廓线
        this.BuildContour_OptimizeContour_EraseInvalid();
    }
    // 创建轮廓线_优化轮廓线_共线
    this.BuildContour_OptimizeContour_Collinear = function() {
        let i=0, j=0, uCurNum=0;
        let vLastPt = null, vCurPt = null, vNextPt = null;
        let v1 = new Vector3(0, 0, 0);
        let v2 = new Vector3(0, 0, 0);
        let dDot = 0.0, dDist = 0.0;
        let fZero = this.GetModelSizeInPlane(this.m_uCurModelIndex) * ZERO * 10.0;

        for (i=0; i<this.m_arrContourPt.length; i++)
        {
            uCurNum = this.m_arrContourPt[i].length;
            vLastPt = this.m_arrContourPt[i][0];
            this.m_arrCurContourPt = new Array();
            this.m_arrCurContourPt.push(vLastPt);
            for (j=1; j<uCurNum-1; j++)
            {
                vCurPt = this.m_arrContourPt[i][j];
                vNextPt = this.m_arrContourPt[i][j+1];
                if (ISDEQUALEX(CalDistanceOfPoint3d(vNextPt, vLastPt), 0.0, fZero))
                {
                    dDist = 0.0;
                }
                else
                {
                    v1.set(vNextPt.x - vLastPt.x, vNextPt.y - vLastPt.y, vNextPt.z - vLastPt.z);
                    v2.set(vCurPt.x - vLastPt.x, vCurPt.y - vLastPt.y, vCurPt.z - vLastPt.z);
                    v1.normalize();
                    dDot = v1.dot(v2);
                    dDist = Math.sqrt(v2.x*v2.x + v2.y*v2.y + v2.z*v2.z - dDot*dDot);
                }
                if (!ISDEQUALEX(dDist, 0.0, fZero))
                {
                    vLastPt = this.m_arrContourPt[i][j];
                    this.m_arrCurContourPt.push(vLastPt);
                }
            }
            if (this.m_arrCurContourPt.length > 2)
            {
                if (ISDEQUALEX(CalDistanceOfPoint3d(this.m_arrCurContourPt[1], this.m_arrCurContourPt[this.m_arrCurContourPt.length-1]), 0.0, fZero))
                {
                    this.m_arrCurContourPt.pop();
                    this.m_arrCurContourPt.shift();
                    this.m_arrCurContourPt.push(this.m_arrCurContourPt[0]);
                }
                else
                {
                    vLastPt = this.m_arrCurContourPt[this.m_arrCurContourPt.length-1];
                    vCurPt = this.m_arrCurContourPt[0];
                    vNextPt = this.m_arrCurContourPt[1];
                    v1.set(vNextPt.x - vLastPt.x, vNextPt.y - vLastPt.y, vNextPt.z - vLastPt.z);
                    v2.set(vCurPt.x - vLastPt.x, vCurPt.y - vLastPt.y, vCurPt.z - vLastPt.z);
                    v1.normalize();
                    dDot = v1.dot(v2);
                    dDist = Math.sqrt(v2.x*v2.x + v2.y*v2.y + v2.z*v2.z - dDot*dDot);
                    if (!ISDEQUALEX(dDist, 0.0, fZero))
                    {
                        this.m_arrCurContourPt.push(this.m_arrCurContourPt[0]);
                    }
                    else
                    {
                        this.m_arrCurContourPt.shift();
                        this.m_arrCurContourPt.push(this.m_arrCurContourPt[0]);
                    }
                }
            }

            if (this.m_arrCurContourPt.length != this.m_arrContourPt[i].length) {
                this.m_arrContourPt[i].splice(0, this.m_arrContourPt[i].length);
                for (j = 0; j < this.m_arrCurContourPt.length; ++j) {
                    this.m_arrContourPt[i].push(this.m_arrCurContourPt[j]);
                }
                this.m_arrCurContourPt.splice(0, this.m_arrCurContourPt.length)
            }
        }
    }
    // 创建轮廓线_优化轮廓线_重合
    this.BuildContour_OptimizeContour_Overlap = function() {
        let fModelSizeInPlane = this.GetModelSizeInPlane(this.m_uCurModelIndex);
        let fZero = 0.0;
        let fZero1 = fModelSizeInPlane * ZERO * 20.0;	// 20.0是经验值,建议取值范围：1.0~1000.0
        let fZero2 = fModelSizeInPlane * ZERO * 30.0;
        let fZero3 = fModelSizeInPlane * ZERO * 50.0;
        let v1 = new Vector3(0, 0, 0), v2 = new Vector3(0, 0, 0);
        let i = 0, j = 0, uCurNum = 0;
        let fDist = 0.0, fDist2 = 0.0, fDot = 0.0;
        let vLastPt = null, vCurPt = null, vNextPt = null;

        // 过滤相邻的重合点及间隔一个的重合点(若P1与P3重合,则将P2过滤而后再将P3过滤)
        for (i=0; i<this.m_arrContourPt.length; i++)
        {
            uCurNum = this.m_arrContourPt[i].length;
            this.m_arrCurContourPt = new Array();
            this.m_arrCurContourPt.push(this.m_arrContourPt[i][0]);

            for (j=1; j<uCurNum-1; j++)
            {
                vCurPt = this.m_arrContourPt[i][j];
                vNextPt = this.m_arrContourPt[i][j+1];
                vLastPt = this.m_arrCurContourPt[this.m_arrCurContourPt.length-1];

                v1.set(vCurPt.x - vLastPt.x, vCurPt.y - vLastPt.y, vCurPt.z - vLastPt.z);
                v2.set(vNextPt.x - vLastPt.x, vNextPt.y - vLastPt.y, vNextPt.z - vLastPt.z);
                v1.normalize();
                v2.normalize();
                fDot = v1.dot(v2);
                if (fDot > 0.966)
                {
                    // 前后两边夹角 < 15度
                    fZero = fZero3;
                }
                else if (fDot > 0.866)
                {
                    // 15度 < 前后两边夹角 < 30度
                    fZero = fZero2;
                }
                else
                {
                    // 30度 < 前后两边夹角
                    fZero = fZero1;
                }
                fDist = CalDistanceOfPoint3d(vLastPt, vCurPt);
                fDist2 = CalDistanceOfPoint3d(vLastPt, vNextPt);
                if ((!ISDEQUALEX(fDist, 0.0, fZero)) && (!ISDEQUALEX(fDist2, 0.0, fZero)))
                {
                    this.m_arrCurContourPt.push(this.m_arrContourPt[i][j]);
                }
            }
            if (this.m_arrCurContourPt.length > 2)
            {
                vCurPt = this.m_arrCurContourPt[0];
                vNextPt = this.m_arrCurContourPt[1];
                vLastPt = this.m_arrCurContourPt[this.m_arrCurContourPt.length-1];

                v1.set(vCurPt.x - vLastPt.x, vCurPt.y - vLastPt.y, vCurPt.z - vLastPt.z);
                v2.set(vNextPt.x - vCurPt.x, vNextPt.y - vCurPt.y, vNextPt.z - vCurPt.z);
                v1.normalize();
                v2.normalize();
                fDot = v1.dot(v2);
                if (fDot > 0.966)
                {
                    // 前后两边夹角 < 15度
                    fZero = fZero3;
                }
                else if (fDot > 0.866)
                {
                    // 15度 < 前后两边夹角 < 30度
                    fZero = fZero2;
                }
                else
                {
                    // 30度 < 前后两边夹角
                    fZero = fZero1;
                }
                fDist = CalDistanceOfPoint3d(vLastPt, vCurPt);
                fDist2 = CalDistanceOfPoint3d(vLastPt, vNextPt);
                if (ISDEQUALEX(fDist2, 0.0, fZero))
                {
                    this.m_arrCurContourPt.pop();
                    this.m_arrCurContourPt.shift();
                    this.m_arrCurContourPt.push(this.m_arrCurContourPt[0]);
                }
                else if (ISDEQUALEX(fDist, 0.0, fZero))
                {
                    this.m_arrCurContourPt[this.m_arrCurContourPt.length-1] = this.m_arrCurContourPt[0];
                }
                else
                {
                    this.m_arrCurContourPt.push(this.m_arrCurContourPt[0]);
                }
            }

            if (this.m_arrCurContourPt.length != this.m_arrContourPt[i].length)
            {
                this.m_arrContourPt[i].splice(0, this.m_arrContourPt[i].length);
                for (j=0; j < this.m_arrCurContourPt.length; ++j)
                {
                    this.m_arrContourPt[i].push(this.m_arrCurContourPt[j]);
                }
                this.m_arrCurContourPt.splice(0, this.m_arrCurContourPt.length);
            }
        }
    }
    // 创建轮廓线_优化轮廓线_去除不合理的轮廓线
    this.BuildContour_OptimizeContour_EraseInvalid = function() {
        if (this.m_arrContourPt.length == 0) {
            return;
        }

        let arrValid = new Array(this.m_arrContourPt.length);
        for (let i=0; i<this.m_arrContourPt.length; i++)
        {
            if (this.m_arrContourPt[i].length > 3) {
                arrValid[i] = true;
            }
        }

        let uIndex = 0;
        for (let i=0; i<this.m_arrContourPt.length; i++)
        {
            if (arrValid[i])
            {
                if (uIndex != i) {
                    this.m_arrContourPt[uIndex] = this.m_arrContourPt[i];
                }
                uIndex++;
            }
        }
        if (uIndex != this.m_arrContourPt.length) {
            this.m_arrContourPt.splice(uIndex, this.m_arrContourPt.length);
        }
    }

    // 生成下一个三角片的数据
    this.GenerateNextTriDataByPoint = function(uPtIndex, bRear) {
        let pModel = this.m_arrSecPlaneModel[this.m_uCurModelIndex];
        let pTempTri = null;

        if (bRear) {
            this.m_arrCurSubsetNextTriData_Rear.splice(0, this.m_arrCurSubsetNextTriData_Rear.length);
        }
        else {
            this.m_arrCurSubsetNextTriData_Front.splice(0, this.m_arrCurSubsetNextTriData_Front.length);
        }

        this.m_arrTempAdjacentTriIndex.splice(0, this.m_arrTempAdjacentTriIndex.length);
        pModel.GetTriangleByPoint(uPtIndex, this.m_arrTempAdjacentTriIndex);
        for (let i = 0; i < this.m_arrTempAdjacentTriIndex.length; i++)
        {
            pTempTri = pModel.GetTriangle(this.m_arrTempAdjacentTriIndex[i]);
            if (pTempTri == undefined || pTempTri.bIsScanned) {
                continue;
            }

            let stuNextTriData = new SecPlaneNextTriData();
            stuNextTriData.uTriIndex = this.m_arrTempAdjacentTriIndex[i];
            stuNextTriData.bNextToContourFragEnd = bRear;
            stuNextTriData.bIsPtVisited1 = false;
            stuNextTriData.bIsPtVisited2 = false;
            stuNextTriData.bIsPtVisited3 = false;

            if (pTempTri.uPtIndex1 == uPtIndex) {
                stuNextTriData.bIsPtVisited1 = true;
            }
            else if (pTempTri.uPtIndex2 == uPtIndex) {
                stuNextTriData.bIsPtVisited2 = true;
            }
            else if (pTempTri.uPtIndex3 == uPtIndex) {
                stuNextTriData.bIsPtVisited3 = true;
            }
            else {
                continue;
            }

            if (bRear) {
                this.m_arrCurSubsetNextTriData_Rear.push(stuNextTriData);
            }
            else {
                this.m_arrCurSubsetNextTriData_Front.push(stuNextTriData);
            }
        }
    }
    // 生成下一个三角片的数据
    this.GenerateNextTriDataByEdge = function(uPtIndex1, uPtIndex2, bRear) {
        let pModel = this.m_arrSecPlaneModel[this.m_uCurModelIndex];
        let pTempTri = null;

        if (bRear) {
            this.m_arrCurSubsetNextTriData_Rear.splice(0, this.m_arrCurSubsetNextTriData_Rear.length);
        }
        else {
            this.m_arrCurSubsetNextTriData_Front.splice(0, this.m_arrCurSubsetNextTriData_Front.length);
        }

        pModel.GetTriangleByEdge(uPtIndex1, uPtIndex2, this.m_arrTempAdjacentTriIndex);
        for (let i = 0; i < this.m_arrTempAdjacentTriIndex.length; i++)
        {
            pTempTri = pModel.GetTriangle(this.m_arrTempAdjacentTriIndex[i]);
            if (pTempTri == undefined || pTempTri.bIsScanned) {
                continue;
            }

            let stuNextTriData = new SecPlaneNextTriData();
            stuNextTriData.uTriIndex = this.m_arrTempAdjacentTriIndex[i];
            stuNextTriData.bNextToContourFragEnd = bRear;
            stuNextTriData.bIsPtVisited1 = false;
            stuNextTriData.bIsPtVisited2 = false;
            stuNextTriData.bIsPtVisited3 = false;

            if (pTempTri.uPtIndex1 != uPtIndex1 && pTempTri.uPtIndex1 != uPtIndex2) {
                stuNextTriData.bIsPtVisited2 = true;
                stuNextTriData.bIsPtVisited3 = true;
            }
            else if(pTempTri.uPtIndex2 != uPtIndex1 && pTempTri.uPtIndex2 != uPtIndex2) {
                stuNextTriData.bIsPtVisited1 = true;
                stuNextTriData.bIsPtVisited3 = true;
            }
            else if(pTempTri.uPtIndex3 != uPtIndex1 && pTempTri.uPtIndex3 != uPtIndex2) {
                stuNextTriData.bIsPtVisited1 = true;
                stuNextTriData.bIsPtVisited2 = true;
            }
            else {
                continue;
            }

            if (bRear) {
                this.m_arrCurSubsetNextTriData_Rear.push(stuNextTriData);
            }
            else {
                this.m_arrCurSubsetNextTriData_Front.push(stuNextTriData);
            }
        }
    }
    // 判断轮廓线上的一点是否为终点
    this.IsContourPtEnd = function(uPrePortIndex, uNextPortIndex, pModel) {
        let nRel = pModel.GetRelationshipOfPointAndPlane(uNextPortIndex);
        if (nRel > 0) {
            return false;
        }
        else if (nRel < 0) {
            return true;
        }
        else {
            nRel = pModel.GetRelationshipOfPointAndPlane(uPrePortIndex);
            if (nRel > 0) {
                return true;
            }
            else if (nRel < 0) {
                return false;
            }
            else {
                return true;
            }
        }
    }
    // 获取三角片与平面相交的且未访问的点和边数据
    this.GetUnVisitedTriPointEdgeDateCrossWithPlane = function(stuNextTriData, pModel, pTri,
        arrPtIndex, arrPtPreNextIndex, arrEdgePtIndex) {
        if (pModel == null || pTri == null) {
            return false;
        }

        let nRel1 = pModel.GetRelationshipOfPointAndPlane(pTri.uPtIndex1);
        let nRel2 = pModel.GetRelationshipOfPointAndPlane(pTri.uPtIndex2);
        if (stuNextTriData.uTriIndex == 1) {
            pTri.uPtIndex3 = pTri.uPtIndex3;
        }
        let nRel3 = pModel.GetRelationshipOfPointAndPlane(pTri.uPtIndex3);
        let nRelSum = nRel1 + nRel2 + nRel3;

        if (nRelSum >= 2 || nRelSum <= -2 || (nRel1 == 0 && nRel2 == 0 && nRel3 == 0)) {
            return false;
        }

        if (nRelSum == 0)
        {
            // 一个顶点位于平面上，另外两个顶点分别位于正负侧
            if (nRel1 == 0)
            {
                if (!stuNextTriData.bIsPtVisited1)
                {
                    arrPtIndex.push(pTri.uPtIndex1);
                    arrPtPreNextIndex.push(pTri.uPtIndex3);
                    arrPtPreNextIndex.push(pTri.uPtIndex2);
                }
                if (!(stuNextTriData.bIsPtVisited2 && stuNextTriData.bIsPtVisited3))
                {
                    arrEdgePtIndex.push(pTri.uPtIndex2);
                    arrEdgePtIndex.push(pTri.uPtIndex3);
                }
            }
            else if (nRel2 == 0)
            {
                if (!stuNextTriData.bIsPtVisited2)
                {
                    arrPtIndex.push(pTri.uPtIndex2);
                    arrPtPreNextIndex.push(pTri.uPtIndex1);
                    arrPtPreNextIndex.push(pTri.uPtIndex3);
                }
                if (!(stuNextTriData.bIsPtVisited3 && stuNextTriData.bIsPtVisited1))
                {
                    arrEdgePtIndex.push(pTri.uPtIndex3);
                    arrEdgePtIndex.push(pTri.uPtIndex1);
                }
            }
            else if (nRel3 == 0)
            {
                if (!stuNextTriData.bIsPtVisited3)
                {
                    arrPtIndex.push(pTri.uPtIndex3);
                    arrPtPreNextIndex.push(pTri.uPtIndex2);
                    arrPtPreNextIndex.push(pTri.uPtIndex1);
                }
                if (!(stuNextTriData.bIsPtVisited1 && stuNextTriData.bIsPtVisited2))
                {
                    arrEdgePtIndex.push(pTri.uPtIndex1);
                    arrEdgePtIndex.push(pTri.uPtIndex2);
                }
            }
        }
        else
        {
            // 三角片与平面相交
            if (nRel1==0 && nRel2==0)
            {
                if (!stuNextTriData.bIsPtVisited1)
                {
                    arrPtIndex.push(pTri.uPtIndex1);
                    arrPtPreNextIndex.push(pTri.uPtIndex3);
                    arrPtPreNextIndex.push(pTri.uPtIndex2);
                }
                if (!stuNextTriData.bIsPtVisited2)
                {
                    arrPtIndex.push(pTri.uPtIndex2);
                    arrPtPreNextIndex.push(pTri.uPtIndex1);
                    arrPtPreNextIndex.push(pTri.uPtIndex3);
                }
            }
            else if (nRel2==0 && nRel3==0)
            {
                if (!stuNextTriData.bIsPtVisited2)
                {
                    arrPtIndex.push(pTri.uPtIndex2);
                    arrPtPreNextIndex.push(pTri.uPtIndex1);
                    arrPtPreNextIndex.push(pTri.uPtIndex3);
                }
                if (!stuNextTriData.bIsPtVisited3)
                {
                    arrPtIndex.push(pTri.uPtIndex3);
                    arrPtPreNextIndex.push(pTri.uPtIndex2);
                    arrPtPreNextIndex.push(pTri.uPtIndex1);
                }
            }
            else if (nRel3==0 && nRel1==0)
            {
                if (!stuNextTriData.bIsPtVisited3)
                {
                    arrPtIndex.push(pTri.uPtIndex3);
                    arrPtPreNextIndex.push(pTri.uPtIndex2);
                    arrPtPreNextIndex.push(pTri.uPtIndex1);
                }
                if (!stuNextTriData.bIsPtVisited1)
                {
                    arrPtIndex.push(pTri.uPtIndex1);
                    arrPtPreNextIndex.push(pTri.uPtIndex3);
                    arrPtPreNextIndex.push(pTri.uPtIndex2);
                }
            }
            else if (nRel2*nRel3 > 0)
            {
                if (!(stuNextTriData.bIsPtVisited1 && stuNextTriData.bIsPtVisited2))
                {
                    arrEdgePtIndex.push(pTri.uPtIndex1);
                    arrEdgePtIndex.push(pTri.uPtIndex2);
                }
                if (!(stuNextTriData.bIsPtVisited3 && stuNextTriData.bIsPtVisited1))
                {
                    arrEdgePtIndex.push(pTri.uPtIndex3);
                    arrEdgePtIndex.push(pTri.uPtIndex1);
                }
            }
            else if (nRel1*nRel3 > 0)
            {
                if (!(stuNextTriData.bIsPtVisited1 && stuNextTriData.bIsPtVisited2))
                {
                    arrEdgePtIndex.push(pTri.uPtIndex1);
                    arrEdgePtIndex.push(pTri.uPtIndex2);
                }
                if (!(stuNextTriData.bIsPtVisited2 && stuNextTriData.bIsPtVisited3))
                {
                    arrEdgePtIndex.push(pTri.uPtIndex2);
                    arrEdgePtIndex.push(pTri.uPtIndex3);
                }
            }
            else if (nRel1*nRel2 > 0)
            {
                if (!(stuNextTriData.bIsPtVisited2 && stuNextTriData.bIsPtVisited3))
                {
                    arrEdgePtIndex.push(pTri.uPtIndex2);
                    arrEdgePtIndex.push(pTri.uPtIndex3);
                }
                if (!(stuNextTriData.bIsPtVisited3 && stuNextTriData.bIsPtVisited1))
                {
                    arrEdgePtIndex.push(pTri.uPtIndex3);
                    arrEdgePtIndex.push(pTri.uPtIndex1);
                }
            }
        }

        return true;
    }

    this.GetCurModel = function() {
        return this.m_arrSecPlaneModel[this.m_uCurModelIndex];
    }
};

function SectionPlaneFactory() {
	this.m_pModelFactory = null;		// 模型工厂
	this.m_pSecPlaneCalc = null;		// 剖切平面计算器
	this.m_fRelativeZero;				// 相对精度

    this.m_tmpMat = mat4.create();
    this.m_tmpInverseMat = mat4.create();
    this.m_tmpMatAdf = new ADF_BASEMATRIX();

    this.m_arrWjlTest1 = new Array();
    this.m_uWjlTest1 = 0;
    this.m_uWjlTest2 = 0;
    this.m_uWjlTest3 = 0;
    this.m_uWjlTest4 = 0;

    // 创建碰撞检测器所需资源
    this.Create = function(pModelFactory)
    {
        let bResult = true;

        // 设置模型工厂
        this.m_pModelFactory = pModelFactory;

        // 创建剖切平面计算器
        this.m_pSecPlaneCalc = new SectionPlaneCalc();
        this.m_pSecPlaneCalc.Create();

        return bResult;
    }

    // 释放碰撞检测器所需资源
    this.Release = function()
    {
        // 销毁初始化数据
        this.DestroyInitData();

        // 释放剖切平面计算器
        if (this.m_pSecPlaneCalc != null)
        {
            this.m_pSecPlaneCalc.Release();
            this.m_pSecPlaneCalc = null;
            this.m_pSecPlaneCalc = null;
        }

        // 清除模型工厂
        this.m_pModelFactory = null;
    }

    // 初始化数据
    this.InitData = function(arrPartSet, fRelativeZero)
    {
        this.UnInitData();

        this.m_fRelativeZero = fRelativeZero;
        this.m_pSecPlaneCalc.InitData(arrPartSet, fRelativeZero);
        return true;
    }

    // 清除初始化数据
    this.UnInitData = function()
    {
        this.m_pSecPlaneCalc.UnInitData();
    }

    // 销毁初始化数据
    this.DestroyInitData = function()
    {
        this.m_pSecPlaneCalc.UnInitData();
    }

    // 生成剖切平面截面数据
    this.CreateSectionPlaneElemData = function(arrRefObjData, arrRefObjMat, stuSecPlaneInfo)
    {
        let arrMdlSecPlaneElemIndex = new Array();
        let mapMdlIndex = new Map();
        let uIndex1=INVALID_ID, uIndex2=INVALID_ID;
        let partIndex = INVALID_ID, objIndex = INVALID_ID;

        stuSecPlaneInfo.arrSecPlaneElemDataInfo.splice(0, stuSecPlaneInfo.arrSecPlaneElemDataInfo.length);
        stuSecPlaneInfo.arrRefObjIndex = new Array(arrRefObjData.length);
        for (let i=0; i<arrRefObjData.length; i++)
        {
            stuSecPlaneInfo.arrRefObjIndex[i] = i;
            partIndex = arrRefObjData[i]._uPartIndex;
            uIndex2 = INVALID_ID;
            uIndex1 = mapMdlIndex.get(partIndex);
            let stuCurSecPlaneElem = new SecPlaneElemDataInfo();

            if (uIndex1 != undefined)
            {
                for (let j=0; j<arrMdlSecPlaneElemIndex[uIndex1].length; j++)
                {
                    objIndex = stuSecPlaneInfo.arrSecPlaneElemDataInfo[arrMdlSecPlaneElemIndex[uIndex1][j]].uRefObjIndex;
                    if (this.IsSameSecPlane(stuSecPlaneInfo.getWorldClipPlaneOrigin(), stuSecPlaneInfo.getWorldClipPlaneDir(),
                        arrRefObjMat[objIndex], arrRefObjMat[i], this.GetModelZero(partIndex), this.GetModelSize(partIndex)))
                    {
                        uIndex2 = j;
                        break;
                    }
                }
            }

            if (uIndex2 == INVALID_ID)
            {
                if (!this.m_pSecPlaneCalc.CreateSectionPlaneContour(partIndex, arrRefObjMat[i],
                    stuSecPlaneInfo.getWorldClipPlaneOrigin(), stuSecPlaneInfo.getWorldClipPlaneDir(), stuCurSecPlaneElem.infoContour)) {
                    continue;
                }
                if (stuCurSecPlaneElem.infoContour._arrIndexData == null || stuCurSecPlaneElem.infoContour._arrVertexData == null) {
                    continue;
                }
                CalVec3TransformCoordArray(stuCurSecPlaneElem.infoContour._arrVertexData, 0, stuCurSecPlaneElem.infoContour._arrVertexData.length, 3, arrRefObjMat[i]);

                // 封闭轮廓线三角剖分
                if (!this.CreateSectionPlaneSecMdl(stuSecPlaneInfo, stuCurSecPlaneElem.infoContour, stuCurSecPlaneElem.mdlSection)) {
                    continue;
                }
                // CalVec3TransformCoordArray(stuCurSecPlaneElem.mdlSection._arrVertexData, 0, stuCurSecPlaneElem.mdlSection._arrVertexData.length, arrRefObjMat[i]);
            }
            else
            {
                objIndex = stuSecPlaneInfo.arrSecPlaneElemDataInfo[arrMdlSecPlaneElemIndex[uIndex1][uIndex2]].uRefObjIndex;
                mat4.invert(this.m_tmpInverseMat, arrRefObjMat[objIndex]);
                // mat4.multiply(this.m_tmpMat, this.m_tmpInverseMat, arrRefObjMat[i]);
                mat4.multiply(this.m_tmpMat, arrRefObjMat[i], this.m_tmpInverseMat);

                stuSecPlaneInfo.arrSecPlaneElemDataInfo[arrMdlSecPlaneElemIndex[uIndex1][uIndex2]].copy(stuCurSecPlaneElem);
                if (stuCurSecPlaneElem.infoContour._arrVertexData.length > 0)
                {
                    CalVec3TransformCoordArray(stuCurSecPlaneElem.infoContour._arrVertexData, 0, stuCurSecPlaneElem.infoContour._arrVertexData.length, 3, this.m_tmpMat);
                }
                if (stuCurSecPlaneElem.mdlSection._arrVertexData.length > 0)
                {
                    CalVec3TransformCoordArray(stuCurSecPlaneElem.mdlSection._arrVertexData, 0, stuCurSecPlaneElem.mdlSection._arrVertexData.length, 6, this.m_tmpMat);
                }
                // if (stuCurSecPlaneElem.mdlSectionLine._arrVertexData.length > 0)
                // {
                //     CalVec3TransformCoordArray(stuCurSecPlaneElem.mdlSectionLine._arrVertexData, 0, stuCurSecPlaneElem.mdlSectionLine._arrVertexData.length, this.m_tmpMat);
                // }

                // continue;
            }

            stuCurSecPlaneElem.uRefObjIndex = i;
            // 设置剖切面材质
            if (arrRefObjData[i]._arrSurfaceMaterialIndex.length > 1) {
                stuCurSecPlaneElem.uSectionMtlIndex = -1;
            } else {
                stuCurSecPlaneElem.uSectionMtlIndex = arrRefObjData[i]._arrSurfaceMaterialIndex[0];
            }
            stuSecPlaneInfo.arrSecPlaneElemDataInfo.push(stuCurSecPlaneElem);

            if (uIndex1 == undefined)
            {
                let arrBackIndex = new Array();
                arrBackIndex.push(stuSecPlaneInfo.arrSecPlaneElemDataInfo.length-1);
                arrMdlSecPlaneElemIndex.push(arrBackIndex);
                mapMdlIndex.set(partIndex, arrMdlSecPlaneElemIndex.length-1);
            }
            else if (uIndex2 == INVALID_ID)
            {
                arrMdlSecPlaneElemIndex[uIndex1].push(stuSecPlaneInfo.arrSecPlaneElemDataInfo.length-1);
            }
        }

        // console.log("test1: " + this.m_uWjlTest1);
        // console.log("test2: " + this.m_uWjlTest2);
        // console.log("test3: " + this.m_uWjlTest3);
        // console.log("test4: " + this.m_uWjlTest4);
        return true;
    }

    // 生成剖切平面的轮廓线(若未相交则返回的轮廓线中的点集和索引集均为空)
    this.CreateSectionPlaneContour = function(arrRefObjData, vPlanePt, vPlaneNormal, arrSecPlaneContourInfo)
    {
        arrSecPlaneContourInfo = new Array(arrRefObjData.length);
        for (let i=0; i<arrRefObjData.length; i++)
        {
            this.m_pSecPlaneCalc.CreateSectionPlaneContour(i, arrRefObjData[i]._matrix, vPlanePt, vPlaneNormal, arrSecPlaneContourInfo[i]);
        }
        return true;
    }

    // 检验模型与剖切平面是否相交
    this.CheckSecPlaneMdlIntersect = function(arrRefObjData, vPlanePt, vPlaneNormal, arrIsIntersect)
    {
        if (this.m_pSecPlaneCalc == null) {
            return false;
        }

        arrIsIntersect = new Array(arrRefObjData.length);
        for (let i=0; i<arrRefObjData.length; i++)
        {
            arrIsIntersect[i] = this.m_pSecPlaneCalc.CheckSecPlaneMdlIntersect(i, arrRefObjData[i]._matrix, vPlanePt, vPlaneNormal);
        }
        return true;
    }

    // 生成剖切平面的截面模型
    this.CreateSectionPlaneSecMdl = function(stuSecPlaneInfo, stuSecPlaneContour, stuSectionMdl)
    {
        // 将三维点转换为二维点
        let planeY = 0;
        let planeMat = stuSecPlaneInfo.getWorldClipPlaneMatrix();
        mat4.invert(this.m_tmpInverseMat, planeMat);

        let tmpContous = new SecPlaneContourInfo();
        stuSecPlaneContour.copy(tmpContous);
        CalVec3TransformCoordArray(tmpContous._arrVertexData, 0, tmpContous._arrVertexData.length, 3, this.m_tmpInverseMat);
        planeY = tmpContous._arrVertexData[1];

        let fMinX = Infinity;
        let fMinZ = Infinity;
        for (let i = 0; i < tmpContous._arrVertexData.length; i += 3) {
            if (tmpContous._arrVertexData[i] < fMinX) {
                fMinX = tmpContous._arrVertexData[i];
            }
            if (tmpContous._arrVertexData[i+2] < fMinZ) {
                fMinZ = tmpContous._arrVertexData[i+2];
            }
        }

        let subroutine = new Module.GetShapeFacetSubroutine();

        // 形状轮廓的二维数据
        let shapePointsCount = tmpContous._arrVertexData.length * 2 / 3;
        let shapePointsFloatValue = subroutine.setshapePointsFloatValue(shapePointsCount);
        for (let i = 0; i < tmpContous._arrVertexData.length/3; i++) {
            shapePointsFloatValue[i*2] = tmpContous._arrVertexData[i*3] - fMinX;
            shapePointsFloatValue[i*2+1] = tmpContous._arrVertexData[i*3+2] - fMinZ;
        }
        
        let arrShapeContours = subroutine.getShapeContours();
        let arrProfiles = new Module.INTVector2();
        for (let i = 0; i < tmpContous._arrIndexData.length; ++i) {
            let arrIndices = new Module.INTVector();
            for (let j = 0; j < tmpContous._arrIndexData[i].length; ++j) {
                arrIndices.push_back(tmpContous._arrIndexData[i][j]);
            }
            arrProfiles.push_back(arrIndices);
        }
        arrShapeContours.push_back(arrProfiles);

        let shapeMove = subroutine.getShapeMove();
        shapeMove.x = fMinX;
        shapeMove.y = fMinZ;
        shapeMove.z = planeY;
        subroutine.scale = 1;

        subroutine.run();

        // 顶点数据
        stuSectionMdl._arrVertexData  = subroutine.getFacetPointsFloatValues();
        let count = stuSectionMdl._arrVertexData.length / 6;
        stuSectionMdl._arrIndexData = new Uint16Array(count);      
        // 索引数据
        for (let i = 0; i < count; ++i) {
            stuSectionMdl._arrIndexData[i] = i;
        }   
    
        subroutine = null;

        CalVec3TransformCoordArray(stuSectionMdl._arrVertexData, 0, stuSectionMdl._arrVertexData.length, 6, planeMat);
        return (stuSectionMdl._arrIndexData.length > 0);
    }

    // 获取模型的精度
    this.GetModelZero = function(objIndex)
    {
        return this.m_pSecPlaneCalc.GetModelZero(objIndex);
    }

    // 获取模型的尺寸
    this.GetModelSize = function(objIndex)
    {
        return this.m_pSecPlaneCalc.GetModelSize(objIndex);
    }

    // 验证是否为相同剖切平面
    this.IsSameSecPlane = function(vPlanePt, vPlaneNormal, matObjMat1, matObjMat2, fMdlZero, fMdlSize)
    {
        let matObj1 = mat4.create();
        let matObj2 = mat4.create();
        mat4.invert(matObj1, matObjMat1);
        mat4.invert(matObj2, matObjMat2);
        let vDMdlPlanePt1 = new Point3(vPlanePt.x, vPlanePt.y, vPlanePt.z);
        let vDMdlPlanePt2 = new Point3(vPlanePt.x, vPlanePt.y, vPlanePt.z);
        let vDMdlPlaneNormal1 = new Vector3(vPlaneNormal.x, vPlaneNormal.y, vPlaneNormal.z);
        let vDMdlPlaneNormal2 = new Vector3(vPlaneNormal.x, vPlaneNormal.y, vPlaneNormal.z);
        CalVec3TransformCoord(vDMdlPlanePt1, vDMdlPlanePt1, matObj1);
        CalVec3TransformCoord(vDMdlPlanePt2, vDMdlPlanePt2, matObj2);
        CalVec3TransformNormal(vDMdlPlaneNormal1, vDMdlPlaneNormal1, matObj1);
        CalVec3TransformNormal(vDMdlPlaneNormal2, vDMdlPlaneNormal2, matObj2);

        // 验证平面2上一点位于平面1上
        let vPtVec = new Vector3(vDMdlPlanePt2.x - vDMdlPlanePt1.x, vDMdlPlanePt2.y - vDMdlPlanePt1.y, vDMdlPlanePt2.z - vDMdlPlanePt1.z);
        let dPtVecDis = vDMdlPlaneNormal1.dot(vPtVec);
        if (!(dPtVecDis<fMdlZero && dPtVecDis>-fMdlZero)) {
            return false;
        }

        // 验证两平面平行
        let dCos = vDMdlPlaneNormal1.dot(vDMdlPlaneNormal2);
        if (dCos < 0.999 && dCos > -0.999) {
            // 夹角大于2.56度直接判定为不平行
            return false;
        }
        else if (dCos > 1.0) {
            dCos = 1.0;
        }
        else if (dCos < -1.0) {
            dCos = -1.0;
        }
        let dSin = Math.sqrt(1.0 - dCos*dCos);
        let dDist = fMdlSize * dSin;
        if (!(dDist<fMdlZero && dDist>-fMdlZero)) {
            return false;
        }

        return true;
    }
}
