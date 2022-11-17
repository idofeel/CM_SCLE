// File: IntersectTool.js

/**
 * @author wujiali
 */
 
//===================================================================================================

function CommonItersectTool() {
    this.MVMatrix = mat4.create();
    this.MVPMatrix = mat4.create();
    this.inverseMVPMatrix = mat4.create();
    this.ptNDC = new Point3(0, 0, 0);
    this.ptNDCOffset = new Point3(0, 0, 0);
    this.ptOffset = new Point3(0, 0, 0);
    this.ptNDC2 = new Point3(0, 0, 0);

    this.m_callbackCheckValidBox = null; // 回调函数：判断包围盒是否有效
    this.vLinePt1 = new ADF_BASEFLOAT3();
    this.vLinePt2 = new ADF_BASEFLOAT3();
    this.vTriVer1 = new ADF_BASEFLOAT3();
    this.vTriVer2 = new ADF_BASEFLOAT3();
    this.vTriVer3 = new ADF_BASEFLOAT3();
    this.RealPoint4 = new Point3(0, 0, 0);
    this.pIntersectPt = new ADF_BASEFLOAT3();

    this.init = function(callbackCheckValidBox) {
        this.m_callbackCheckValidBox = callbackCheckValidBox;
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
     * 判断：两个三维空间点转化为设备坐标像素，该像素距离是否小于指定值
     */
    this.isInIntersectZero = function(InsecPt1, InsecPt2, NDCZero) {
        mat4.multiply(this.MVMatrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        CalTranslatePoint(InsecPt1.x, InsecPt1.y, InsecPt1.z, this.MVMatrix, this.ptNDC);
        CalTranslatePoint(InsecPt2.x, InsecPt2.y, InsecPt2.z, this.MVMatrix, this.ptNDC2);
        return (CalDistanceOfPoint2d(this.ptNDC, this.ptNDC2) < NDCZero / glRunTime.WIDTH);
    }

    /**
     * 射线与包围盒求交
     */
     this.intersectRayBox = function(RayPoint1, RayPoint2, Box, Mat) {
        if ((this.m_callbackCheckValidBox != null) && (!this.m_callbackCheckValidBox(Box, Mat))) {
            return false;
        }
        this.vLinePt1.x = RayPoint1.x; this.vLinePt1.y = RayPoint1.y; this.vLinePt1.z = RayPoint1.z;
        this.vLinePt2.x = RayPoint2.x; this.vLinePt2.y = RayPoint2.y; this.vLinePt2.z = RayPoint2.z;
        for (let i = 0; i < 12; i++) {
            CalTranslatePoint(Box._Vertex[g_boxVertexIndex.vertexIndex[i * 3 + 0]].x,
                              Box._Vertex[g_boxVertexIndex.vertexIndex[i * 3 + 0]].y,
                              Box._Vertex[g_boxVertexIndex.vertexIndex[i * 3 + 0]].z, Mat, this.vTriVer1);
            CalTranslatePoint(Box._Vertex[g_boxVertexIndex.vertexIndex[i * 3 + 1]].x,
                              Box._Vertex[g_boxVertexIndex.vertexIndex[i * 3 + 1]].y,
                              Box._Vertex[g_boxVertexIndex.vertexIndex[i * 3 + 1]].z, Mat, this.vTriVer2);
            CalTranslatePoint(Box._Vertex[g_boxVertexIndex.vertexIndex[i * 3 + 2]].x,
                              Box._Vertex[g_boxVertexIndex.vertexIndex[i * 3 + 2]].y,
                              Box._Vertex[g_boxVertexIndex.vertexIndex[i * 3 + 2]].z, Mat, this.vTriVer3);
            if (CalcIntersectOfLineSegTriangle(this.vLinePt1, this.vLinePt2, this.vTriVer1, this.vTriVer2, this.vTriVer3, this.pIntersectPt))
            {
                return true;
            }
        }
        return false;
    }
}

function ObjectIntersectTool() {
    this.m_bIsInit = false;
    this.m_arrObjectSet = null;
    this.m_arrPartSet = null;
    this.m_callbackCheckValidPt = null; // 回调函数：判断交点是否有效
    this.m_commonTool = new CommonItersectTool();

    this.vLinePt1 = new ADF_BASEFLOAT3();
    this.vLinePt2 = new ADF_BASEFLOAT3();
    this.vTriVer1 = new ADF_BASEFLOAT3();
    this.vTriVer2 = new ADF_BASEFLOAT3();
    this.vTriVer3 = new ADF_BASEFLOAT3();
    this.RealPoint1 = new Point3(0, 0, 0);
    this.RealPoint2 = new Point3(0, 0, 0);
    this.RealPoint3 = new Point3(0, 0, 0);
    this.pIntersectPt = new ADF_BASEFLOAT3();
    this.intersectCurveZero = 4;
    this.intersectPointZero = 6;
    this.intersectZero = 0;

    this.arrSubsetSurfaceIndex = new Array();
    this.arrSubsetDistance = new Array();
    this.arrSubsetIntersectPt = new Array();
    this.arrMeshDistance = new Array();
    this.arrMeshIntersectPt = new Array();
    this.arrObjectCurveDistance = new Array();
    this.arrObjectCurveIntersectPt = new Array();
    this.arrCurveDistance = new Array();
    this.arrCurveIntersectPt = new Array();

    this.objectMatrix = mat4.create();

    this.init = function(arrObjectSet, arrPartSet, callbackCheckValidPt, callbackCheckValidBox) {
        if (this.m_bIsInit) {
            return;
        }
        this.m_arrObjectSet = arrObjectSet;
        this.m_arrPartSet = arrPartSet;
        this.m_callbackCheckValidPt = callbackCheckValidPt;
        this.m_commonTool.init(callbackCheckValidBox);
        this.m_bIsInit = true;
    }

    this.intersectRayObjectSurface = function(RayPoint1, RayPoint2, ObjectIndex, ObjectMat) {
        this.arrSubsetSurfaceIndex.splice(0, this.arrSubsetSurfaceIndex.length);
        this.arrSubsetIntersectPt.splice(0, this.arrSubsetIntersectPt.length);
        this.arrSubsetDistance.splice(0, this.arrSubsetDistance.length);
        let uCurPartIndex = this.m_arrObjectSet[ObjectIndex]._uPartIndex;
        if (this.m_commonTool.intersectRayBox(RayPoint1, RayPoint2, this.m_arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox, ObjectMat)) {
            // 计算与子集mesh的交点
            for (let j = 0; j < this.m_arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._SurfaceBoxes.length; j++) {
                if (this.m_commonTool.intersectRayBox(RayPoint1, RayPoint2, this.m_arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._SurfaceBoxes[j], ObjectMat)) {
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

        let COUNT = NUM_VERTEX;
        let index1 = 0, index2 = 0, index3 = 0;
        let mesh = this.m_arrPartSet[uPartIndex]._arrPartLODData[0];
        let surfaceStart = mesh._arrSurfaceStartIndex[uSurfaceIndex];
        let surfaceEnd = mesh._arrSurfaceStartIndex[uSurfaceIndex] + mesh._arrSurfaceVertexNum[uSurfaceIndex];
        for (let i = surfaceStart; i < surfaceEnd; i += 3) {
            index1 = mesh._arrIndex[i], index2 = mesh._arrIndex[i+1], index3 = mesh._arrIndex[i+2];
            CalTranslatePoint(mesh._arrVertexPosition[index1 * COUNT], mesh._arrVertexPosition[index1 * COUNT + 1], mesh._arrVertexPosition[index1 * COUNT + 2], ObjectMat, this.RealPoint1);
            CalTranslatePoint(mesh._arrVertexPosition[index2 * COUNT], mesh._arrVertexPosition[index2 * COUNT + 1], mesh._arrVertexPosition[index2 * COUNT + 2], ObjectMat, this.RealPoint2);
            CalTranslatePoint(mesh._arrVertexPosition[index3 * COUNT], mesh._arrVertexPosition[index3 * COUNT + 1], mesh._arrVertexPosition[index3 * COUNT + 2], ObjectMat, this.RealPoint3);
            this.vTriVer1.x = this.RealPoint1.x; this.vTriVer1.y = this.RealPoint1.y; this.vTriVer1.z = this.RealPoint1.z;
            this.vTriVer2.x = this.RealPoint2.x; this.vTriVer2.y = this.RealPoint2.y; this.vTriVer2.z = this.RealPoint2.z;
            this.vTriVer3.x = this.RealPoint3.x; this.vTriVer3.y = this.RealPoint3.y; this.vTriVer3.z = this.RealPoint3.z;
            if (CalcIntersectOfLineSegTriangle(this.vLinePt1, this.vLinePt2, this.vTriVer1, this.vTriVer2, this.vTriVer3, this.pIntersectPt)) {
                // 交点没有被裁剪
                if ((this.m_callbackCheckValidPt == null) || (this.m_callbackCheckValidPt(this.pIntersectPt))) {
                    let tempDistance = CalDistanceOfPoint3d(this.pIntersectPt, this.vLinePt1);
                    let tempIntersetPt = new ADF_BASEFLOAT3();
                    CalInversePoint(this.pIntersectPt, ObjectMat, tempIntersetPt);
                    this.arrMeshDistance.push(tempDistance);
                    this.arrMeshIntersectPt.push(tempIntersetPt);
                }
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
        let uCurPartIndex = this.m_arrObjectSet[ObjectIndex]._uPartIndex;
        if (this.m_commonTool.intersectRayBox(RayPoint1, RayPoint2, this.m_arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox, ObjectMat)) {
            let ptOffset = 0;
            for (let j = 0; j < this.m_arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts.length; ++j) {
                let intersetRet = this.intersectRayCurve(RayPoint1, RayPoint2, uCurPartIndex, j, ptOffset, ObjectMat);
                if (intersetRet != null) {
                    this.arrObjectCurveDistance.push(intersetRet.dDistance);
                    this.arrObjectCurveIntersectPt.push(intersetRet.ptIntersect);
                    this.arrCurveIndex.push(j);
                }
                ptOffset += this.m_arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts[j] * 3;
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
        for (let i = 0; i < this.m_arrPartSet[uPartIndex]._CurveShape._arrShapeOfPointsCounts[uCurveIndex] * 3; i += 6) {
            uCurPtIndex = uCurvePointsOffset + i;
            CalTranslatePoint(this.m_arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex],
                this.m_arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex + 1],
                this.m_arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex + 2], ObjectMat, this.RealPoint1);
            CalTranslatePoint(this.m_arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex + 3],
                this.m_arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex + 4],
                this.m_arrPartSet[uPartIndex]._CurveShape._arrShapeOfPoints[uCurPtIndex + 5], ObjectMat, this.RealPoint2);
            this.vTriVer1.x = this.RealPoint1.x; this.vTriVer1.y = this.RealPoint1.y; this.vTriVer1.z = this.RealPoint1.z;
            this.vTriVer2.x = this.RealPoint2.x; this.vTriVer2.y = this.RealPoint2.y; this.vTriVer2.z = this.RealPoint2.z;
            tempDistance = CalcDistanceOfTwoLineSeg(this.vLinePt1, this.vLinePt2, this.vTriVer1, this.vTriVer2, this.pIntersectPt);
            if (ISDEQUALEX(tempDistance, 0.0, this.intersectZero)) {
                // 交点没有被裁剪
                if ((this.m_callbackCheckValidPt == null) || (this.m_callbackCheckValidPt(this.pIntersectPt))) {
                    tempDistance = CalDistanceOfPoint3d(this.pIntersectPt, this.vLinePt1);
                    let tempIntersetPt = new ADF_BASEFLOAT3();
                    CalInversePoint(this.pIntersectPt, ObjectMat, tempIntersetPt);
                    this.arrCurveDistance.push(tempDistance);
                    this.arrCurveIntersectPt.push(tempIntersetPt);
                }
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

    this.intersectRayGeomtry = function(ObjectIndex, ObjSurIntersect, curPickType, pickUnitOut) {
        mat4.multiply(this.objectMatrix, g_webglControl.m_modelMatrix, g_webglControl.m_arrObjectMatrix[ObjectIndex]);
        let InsecPt = ObjSurIntersect.ptIntersect;
        // 交点被裁剪
        if ((this.m_callbackCheckValidPt != null) && (!this.m_callbackCheckValidPt(InsecPt))) {
            return null;
        }

        if (curPickType == PICK_GEOM_SURFACE) {
            let uCurPartIndex = this.m_arrObjectSet[ObjectIndex]._uPartIndex;
            pickUnitOut.elementType = PICK_GEOM_SURFACE;
            pickUnitOut.geomSurfaceIndex =
                this.m_arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrGeomSurfaceIndex[ObjSurIntersect.uSurfaceIndex];
            pickUnitOut.distance = ObjSurIntersect.dDistance;
            pickUnitOut.intersectPt.set(InsecPt.x, InsecPt.y, InsecPt.z);
            return pickUnitOut;
        
        } else if (curPickType == PICK_GEOM_CURVE) {
            this.intersectZero = this.m_commonTool.calIntersectZero(InsecPt, this.objectMatrix, this.intersectCurveZero);
            let intersectCurve = this.calcMinDistanceCurve(InsecPt, ObjectIndex);
            if (intersectCurve == null || intersectCurve.dDistance > this.intersectZero) {
                return null;
            }
            pickUnitOut.elementType = PICK_GEOM_CURVE;
            pickUnitOut.geomCurveIndex = intersectCurve.uCurveIndex;
            pickUnitOut.distance = CalDistanceOfPoint3d(InsecPt, intersectCurve.ptIntersect);
            pickUnitOut.intersectPt.set(intersectCurve.ptIntersect.x, intersectCurve.ptIntersect.y, intersectCurve.ptIntersect.z);
            return pickUnitOut;

        } else if (curPickType == PICK_GEOM_POINT) {
            this.intersectZero = this.m_commonTool.calIntersectZero(InsecPt, this.objectMatrix, this.intersectPointZero);
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

        let uCurPartIndex = this.m_arrObjectSet[ObjectIndex]._uPartIndex;
        let uCurvePointsOffset = 0;
        let arrPointsCounts = this.m_arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts;
        let arrPoints = this.m_arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints;
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
     * 计算object上的顶点到交点的最小距离
     * 返回：最小距离和顶点坐标
     */
    this.calcMinDistancePoint = function(InsecPt, ObjectIndex) {
        if (!g_webglControl.isContainsGeom) {
            return null;
        }

        let uCurPartIndex = this.m_arrObjectSet[ObjectIndex]._uPartIndex;
        let arrPointsCounts = this.m_arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPointsCounts;
        let arrPoints = this.m_arrPartSet[uCurPartIndex]._CurveShape._arrShapeOfPoints;
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
}

function PmiIntersectTool() {
    this.m_bIsInit = false;
    this.m_arrPmiSet = null;
    this.m_callbackCheckValidPt = null; // 回调函数：判断交点是否有效
    this.m_commonTool = new CommonItersectTool();

    this.m_rect = new Rect2D(0, 0, 0 ,0);
    this.vLinePt1 = new ADF_BASEFLOAT3();
    this.vLinePt2 = new ADF_BASEFLOAT3();
    this.vTriVer1 = new ADF_BASEFLOAT3();
    this.vTriVer2 = new ADF_BASEFLOAT3();
    this.vTriVer3 = new ADF_BASEFLOAT3();
    this.RealPoint1 = new Point3(0, 0, 0);
    this.RealPoint2 = new Point3(0, 0, 0);
    this.RealPoint3 = new Point3(0, 0, 0);
    this.pIntersectPt = new ADF_BASEFLOAT3();
    this.intersectCurveZero = 6;
    this.intersectPointZero = 6;

    this.arrPmiItemIndex = new Array();
    this.arrPmiItemDistance = new Array();
    this.arrPmiItemIntersectPt = new Array();
    this.arrDistance = new Array();
    this.arrIntersectPt = new Array();

    this.init = function(arrPmiSet, callbackCheckValidPt, callbackCheckValidBox) {
        if (this.m_bIsInit) {
            return;
        }
        this.m_arrPmiSet = arrPmiSet;
        this.m_callbackCheckValidPt = callbackCheckValidPt;
        this.m_commonTool.init(callbackCheckValidBox);
        this.m_bIsInit = true;
    }

    this.intersectSymbol = function(RayPoint1, RayPoint2, PmiIndex, PmiItemIndex, PmiMat) {
        this.vLinePt1.x = RayPoint1.x; this.vLinePt1.y = RayPoint1.y; this.vLinePt1.z = RayPoint1.z;
        this.vLinePt2.x = RayPoint2.x; this.vLinePt2.y = RayPoint2.y; this.vLinePt2.z = RayPoint2.z;
        this.arrDistance.splice(0, this.arrDistance.length);
        this.arrIntersectPt.splice(0, this.arrIntersectPt.length);

        let index1 = 0, index2 = 0, index3 = 0;
        let vertex = this.m_arrPmiSet[PmiIndex].arrFacetVertex;
        let indics = this.m_arrPmiSet[PmiIndex].arrFacetIndex;
        let item = this.m_arrPmiSet[PmiIndex].arrPmiItem[PmiItemIndex];

        if (this.m_commonTool.intersectRayBox(RayPoint1, RayPoint2, item.symbolBox, PmiMat)) {
            for (let i = item.symbolVertexStart; i < item.symbolVertexEnd; i += 3) {
                index1 = indics[i], index2 = indics[i+1], index3 = indics[i+2];
                CalTranslatePoint(vertex[index1 * 3], vertex[index1 * 3 + 1], vertex[index1 * 3 + 2], PmiMat, this.vTriVer1);
                CalTranslatePoint(vertex[index2 * 3], vertex[index2 * 3 + 1], vertex[index2 * 3 + 2], PmiMat, this.vTriVer2);
                CalTranslatePoint(vertex[index3 * 3], vertex[index3 * 3 + 1], vertex[index3 * 3 + 2], PmiMat, this.vTriVer3);
                if (CalcIntersectOfLineSegTriangle(this.vLinePt1, this.vLinePt2, this.vTriVer1, this.vTriVer2, this.vTriVer3, this.pIntersectPt)) {
                    // 交点没有被裁剪
                    if ((this.m_callbackCheckValidPt == null) || (this.m_callbackCheckValidPt(this.pIntersectPt))) {
                        let tempDistance = CalDistanceOfPoint3d(this.pIntersectPt, this.vLinePt1);
                        let tempIntersetPt = new ADF_BASEFLOAT3();
                        CalInversePoint(this.pIntersectPt, PmiMat, tempIntersetPt);
                        this.arrDistance.push(tempDistance);
                        this.arrIntersectPt.push(tempIntersetPt);
                    }
                } else {
                    // 判断是否与文字轮廓相交
                    CalTranslatePoint(vertex[i*3], vertex[i*3+1], vertex[i*3+2], PmiMat, this.vTriVer1);
                    CalTranslatePoint(vertex[(i+1)*3], vertex[(i+1)*3+1], vertex[(i+1)*3+2], PmiMat, this.vTriVer2);
                    tempDistance = CalcDistanceOfTwoLineSeg(this.vTriVer1, this.vTriVer2, this.vLinePt1, this.vLinePt2, this.pIntersectPt);
                    if (this.m_commonTool.isInIntersectZero(this.pIntersectPt, this.vLinePt1, this.intersectCurveZero)) {
                        // 交点没有被裁剪
                        if ((this.m_callbackCheckValidPt == null) || (this.m_callbackCheckValidPt(this.pIntersectPt))) {
                            tempDistance = CalDistanceOfPoint3d(this.pIntersectPt, this.vLinePt1);
                            let tempIntersetPt = new ADF_BASEFLOAT3();
                            CalInversePoint(this.pIntersectPt, PmiMat, tempIntersetPt);
                            this.arrDistance.push(tempDistance);
                            this.arrIntersectPt.push(tempIntersetPt);
                        }
                    }
                }
            }
        }

        // 计算最小值
        if (this.arrDistance.length == 0) {
            return null;
        } else {
            let minDistance = Infinity;
            let index = 0;
            for (let i = 0; i < this.arrDistance.length; i++) {
                if (this.arrDistance[i] < minDistance) {
                    minDistance = this.arrDistance[i];
                    index = i;
                }
            }
            return {
                dDistance: minDistance,
                ptIntersect: this.arrIntersectPt[index],
            };
        }
    }

    this.intersectWire = function(RayPoint1, RayPoint2, PmiIndex, PmiItemIndex, PmiMat) {
        this.vLinePt1.x = RayPoint1.x; this.vLinePt1.y = RayPoint1.y; this.vLinePt1.z = RayPoint1.z;
        this.vLinePt2.x = RayPoint2.x; this.vLinePt2.y = RayPoint2.y; this.vLinePt2.z = RayPoint2.z;
        this.arrDistance.splice(0, this.arrDistance.length);
        this.arrIntersectPt.splice(0, this.arrIntersectPt.length);

        let vertex = this.m_arrPmiSet[PmiIndex].arrWiresVertex;
        let item = this.m_arrPmiSet[PmiIndex].arrPmiItem[PmiItemIndex];

        if (this.m_commonTool.intersectRayBox(RayPoint1, RayPoint2, item.wireBox, PmiMat)) {
            for (let i = item.wireVertexStart; i < item.wireVertexEnd; i += 2) {
                CalTranslatePoint(vertex[i*3], vertex[i*3 + 1], vertex[i*3 + 2], PmiMat, this.vTriVer1);
                CalTranslatePoint(vertex[(i+1)*3], vertex[(i+1)*3 + 1], vertex[(i+1)*3 + 2], PmiMat, this.vTriVer2);
                tempDistance = CalcDistanceOfTwoLineSeg(this.vTriVer1, this.vTriVer2, this.vLinePt1, this.vLinePt2, this.pIntersectPt);
                if (this.m_commonTool.isInIntersectZero(this.pIntersectPt, this.vLinePt1, this.intersectCurveZero)) {
                    // 交点没有被裁剪
                    if ((this.m_callbackCheckValidPt == null) || (this.m_callbackCheckValidPt(this.pIntersectPt))) {
                        tempDistance = CalDistanceOfPoint3d(this.pIntersectPt, this.vLinePt1);
                        let tempIntersetPt = new ADF_BASEFLOAT3();
                        CalInversePoint(this.pIntersectPt, PmiMat, tempIntersetPt);
                        this.arrDistance.push(tempDistance);
                        this.arrIntersectPt.push(tempIntersetPt);
                    }
                }
            }
        }

        // 计算最小值
        if (this.arrDistance.length == 0) {
            return null;
        } else {
            let minDistance = Infinity;
            let index = 0;
            for (let i = 0; i < this.arrDistance.length; i++) {
                if (this.arrDistance[i] < minDistance) {
                    minDistance = this.arrDistance[i];
                    index = i;
                }
            }
            return {
                dDistance: minDistance,
                ptIntersect: this.arrIntersectPt[index],
            };
        }
    }
}
