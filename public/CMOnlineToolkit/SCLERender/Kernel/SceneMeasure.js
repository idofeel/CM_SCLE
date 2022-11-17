// File: SceneMeasure.js

/**
 * @author wujiali
 */
 
//===================================================================================================

const MEASURE_TEXT_WIDTH = 8;
const MEASURE_TEXT_HEIGHT = 15;
const MEASURE_TEXT_MIN_WIDTH_NUM = 5;
const MEASURE_TEXT_MIN_HEIGHT_NUM = 2;

function SceneMeasure() {
    // 几何测量参数
    this.measureMode = MEASURE_NONE;
    this.pickUnitFirst = new GL_PICK_UNIT();
    this.pickUnitSecond = new GL_PICK_UNIT();
    this.pickUnitNum = 0;
    this.pickLeaderPos = new Point3();
    this.pickMeasureUnit = null;
    this.pickMeasureUnitIndex = -1;
    this.pickMeasureUnitPos = new Point2(0, 0);
    this.pickMeasureMode = false;
    this.MeasureMoveMatrix = mat4.create();
    this.measureInfoPt = new Point2(0, 0);
    this.webglMousePt = new Point2(0, 0);
    // 运算参数
    this.MVMatrix = mat4.create();
    this.MVPMatrix = mat4.create();
    this.PointNDCCenter = new Point3(0, 0, 0);
    this.inverseMVPMatrix = mat4.create();

    this.setMeasureMode = function(mode) {
        if (g_CLEMeasure == "n") {
            return;
        }
        if (!g_webglControl.isContainsGeom) {
            return;
        }
        if (mode == MEASURE_NONE) {
            g_glprogram.setPickType(PICK_OBJECT);
            this.pickMeasureMode = false;
            this.clearMeasureMode();
        } else if (mode == MEASURE_OBJECT) {
            g_glprogram.setPickType(PICK_OBJECT);
            this.pickMeasureMode = true;
        } else if (mode == MEASURE_SURFACE) {
            g_glprogram.setPickType(PICK_GEOM_SURFACE);
            this.pickMeasureMode = true;
        } else if (mode == MEASURE_CURVE) {
            g_glprogram.setPickType(PICK_GEOM_CURVE);
            this.pickMeasureMode = true;
        } else if (mode == MEASURE_POINT) {
            g_glprogram.setPickType(PICK_GEOM_POINT);
            this.pickMeasureMode = true;
        } else if (mode == MEASURE_TWO_CURVES) {
            g_glprogram.setPickType(PICK_GEOM_CURVE);
            this.pickMeasureMode = true;
        } else if (mode == MEASURE_TWO_POINTS) {
            g_glprogram.setPickType(PICK_GEOM_POINT);
            this.pickMeasureMode = true;
        }
        this.measureMode = mode;

        // 开启几何元素动态捕捉
        if (glRunTime.isCaptureGeomtry) {
            glRunTime.setCaptureModeByMeasure(mode);
        }
    }

    this.clearMeasureMode = function() {
        if (g_CLEMeasure == "n") {
            return;
        }
        this.pickUnitFirst.Reset();
        this.pickUnitSecond.Reset();
        this.pickUnitNum = 0;
        this.pickLeaderPos.set(0, 0, 0);
        this.pickMeasureUnit = null;
        this.pickMeasureUnitIndex = -1;
        this.pickMeasureUnitPos.set(0, 0);
        this.measureInfoPt.set(0, 0);
    }

    this.doGetPickMeasureIndex = function(screenX, screenY) {
        this.pickMeasureUnitIndex = g_canvas.pickMeasureUintByRay(screenX, screenY, false);
        this.doPickMeasureByIndex(this.pickMeasureUnitIndex)
        return this.pickMeasureUnitIndex;
    }

    this.doPickMeasureByIndex = function(measureIndex) {
        if (measureIndex > -1) {
            this.pickMeasureUnit = g_canvas.m_arrMeasureDispalyInfo[measureIndex];
            if (this.pickMeasureUnit.measureType == MEASURE_SURFACE) {
                g_glprogram.pickObjectSurfaceByIndex(this.pickMeasureUnit.arrMeasureShapes[0].objectIndex,
                    this.pickMeasureUnit.arrMeasureShapes[0].surfaceIndex, false);
            } else if (this.pickMeasureUnit.measureType == MEASURE_CURVE) {
                // 不需要处理canvas3d
            } else if (this.pickMeasureUnit.measureType == MEASURE_OBJECT) {
                g_glprogram.setPickStatus(false);
                g_glprogram.pickObjects(this.pickMeasureUnit.arrMeasureShapes[0].objectIndex);
            } else if (this.pickMeasureUnit.measureType == MEASURE_POINT) {
                // 不需要处理canvas3d
            } else if (this.pickMeasureUnit.measureType == MEASURE_TWO_CURVES) {
                // 不需要处理canvas3d
            } else if (this.pickMeasureUnit.measureType == MEASURE_TWO_POINTS) {
                // 不需要处理canvas3d
            }
            g_canvas.pickMeasureUnitByIndex(measureIndex, false);
        } else {
            g_canvas.pickMeasureUnitByIndex(-1, false);
        }
    }

    this.doMeasureAction = function(curPickUnit) {
        if (g_CLEMeasure == "n") {
            return;
        }
        if (this.measureMode == MEASURE_OBJECT) {
            this.measureObject(curPickUnit.objectIndex);
        } else if (this.measureMode == MEASURE_SURFACE) {
            if (curPickUnit.geomSurfaceIndex < 0) {
                return;
            }
            this.measureSurface(curPickUnit.objectIndex, curPickUnit.surfaceIndex, curPickUnit.geomSurfaceIndex);
        } else if (this.measureMode == MEASURE_CURVE) {
            if (curPickUnit.geomCurveIndex < 0) {
                return;
            }
            this.measureCurve(curPickUnit.objectIndex, curPickUnit.geomCurveIndex);
        } else if (this.measureMode == MEASURE_POINT) {
            this.measurePoint(curPickUnit.objectIndex, curPickUnit.geomPointIndex, curPickUnit.intersectPt);
        } else if (this.measureMode == MEASURE_TWO_CURVES) {
            if (curPickUnit.geomCurveIndex < 0) {
                return;
            }
            if (this.pickUnitNum == 0) {
                curPickUnit.Copy(this.pickUnitFirst);
                this.pickUnitNum ++;
                this.getPickMeasureLeaderPos(this.pickUnitFirst, this.pickLeaderPos);
                g_canvas.isDuringMeasure = true;
            } else if (this.pickUnitNum == 1) {
                curPickUnit.Copy(this.pickUnitSecond);
                this.measureTwoCurves();
                this.pickUnitNum = 0;
                g_canvas.isDuringMeasure = false;
            }
        } else if (this.measureMode == MEASURE_TWO_POINTS) {
            if (this.pickUnitNum == 0) {
                curPickUnit.Copy(this.pickUnitFirst);
                this.pickUnitNum ++;
                g_canvas.isDuringMeasure = true;
            } else if (this.pickUnitNum == 1) {
                curPickUnit.Copy(this.pickUnitSecond);
                this.measureTwoPoints();
                this.pickUnitNum = 0;
                g_canvas.isDuringMeasure = false;
            }
        }

        // 执行测量之后，取消测量状态
        if (g_canvas.isDuringMeasure == false) {
            this.setMeasureMode(MEASURE_NONE);
        }
    }

    this.getPickMeasureLeaderPos = function(pickMeasureUnit, leaderPos) {
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[pickMeasureUnit.objectIndex]._uPartIndex;
        let geomCurve = g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrCurve[pickMeasureUnit.geomCurveIndex];
        switch (geomCurve.nType) {
            case ADF_CURVT_LINE:
                geom = geomCurve.curvedata.line;
                leaderPos.set((geom.end1.x + geom.end2.x) / 2, (geom.end1.y + geom.end2.y) / 2, (geom.end1.z + geom.end2.z) / 2);
                break;
            case ADF_CURVT_ARC:
                geom = geomCurve.curvedata.arc;
                leaderPos.set(geom.vOrigin.x, geom.vOrigin.y, geom.vOrigin.z);
                break;
            default:
                return;
        }
    }

    this.measureObject = function(objectIndex) {
        if (objectIndex < 0) {
            return;
        }
        // 判断是否重复
        let repeatedMeasureIndex = g_canvas.isContainMeasureUnit(objectIndex, -1, MEASURE_OBJECT);
        if (repeatedMeasureIndex > -1) {
            this.doPickMeasureByIndex(repeatedMeasureIndex);
            return;
        }
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        let measureUnit = new GL_MEASURE_UNIT();
        let partBox = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox;
        measureUnit.measureType = MEASURE_OBJECT;
        measureUnit.arrMeasureShapes.push(new GL_MEASURE_SHAPE());
        measureUnit.arrMeasureShapes[0].setObjectShape(objectIndex, partBox);
        measureUnit.measureInfo = new GL_MEASURE_INFO();
        measureUnit.measureInfo.setObjectInfo(objectIndex, partBox, g_glprogram.getObjectModelMatrix(objectIndex));
        g_canvas.addMeasureUnit(measureUnit);
    }

    this.measureSurface = function(objectIndex, surfaceIndex, geomSurfaceIndex) {
        if (objectIndex < 0 || surfaceIndex < 0 || geomSurfaceIndex < 0) {
            return;
        }
        // 判断是否重复
        let repeatedMeasureIndex = g_canvas.isContainMeasureUnit(objectIndex, geomSurfaceIndex, MEASURE_SURFACE);
        if (repeatedMeasureIndex > -1) {
            this.doPickMeasureByIndex(repeatedMeasureIndex);
            return;
        }
        // 判断是没有曲面数据
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        if (g_GLPartSet._arrPartSet[uCurPartIndex]._SurfaceShape == null || geomSurfaceIndex < 0 ||
            geomSurfaceIndex >= g_GLPartSet._arrPartSet[uCurPartIndex]._SurfaceShape._arrSurface.length) {
            return;
        }
        let geomSurface = g_GLPartSet._arrPartSet[uCurPartIndex]._SurfaceShape._arrSurface[geomSurfaceIndex];
        if (geomSurface.nType == ADF_SURFT_UNKOWN) {
            return;
        }

        let measureUnit = new GL_MEASURE_UNIT();
        measureUnit.measureType = MEASURE_SURFACE;
        measureUnit.arrMeasureShapes.push(new GL_MEASURE_SHAPE());
        measureUnit.arrMeasureShapes[0].setSurfaceShape(objectIndex, surfaceIndex, geomSurfaceIndex, geomSurface);
        measureUnit.measureInfo = new GL_MEASURE_INFO();
        measureUnit.measureInfo.setSurfaceInfo(objectIndex, geomSurface, measureUnit.arrMeasureShapes[0].leaderPos);
        measureUnit.measureInfo.attachPos.set(measureUnit.arrMeasureShapes[0].leaderPos.x,
            measureUnit.arrMeasureShapes[0].leaderPos.y, measureUnit.arrMeasureShapes[0].leaderPos.z);
        g_canvas.addMeasureUnit(measureUnit);
    }

    this.measureCurve = function(objectIndex, geomCurveIndex) {
        if (objectIndex < 0 || geomCurveIndex < 0) {
            return;
        }
        // 判断是否重复
        let repeatedMeasureIndex = g_canvas.isContainMeasureUnit(objectIndex, geomCurveIndex, MEASURE_CURVE);
        if (repeatedMeasureIndex > -1) {
            this.doPickMeasureByIndex(repeatedMeasureIndex);
            return;
        }
        // 判断是没有曲面数据
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        if (g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrCurve == null ||
            geomCurveIndex < 0 || geomCurveIndex >= g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrCurve.length) {
            return;
        }
        let geomCurve = g_GLPartSet._arrPartSet[uCurPartIndex]._CurveShape._arrCurve[geomCurveIndex];
        if (geomCurve.nType == ADF_CURVT_UNKOWN) {
            return;
        }

        let measureUnit = new GL_MEASURE_UNIT();
        measureUnit.measureType = MEASURE_CURVE;
        measureUnit.arrMeasureShapes.push(new GL_MEASURE_SHAPE());
        measureUnit.arrMeasureShapes[0].setCurveShape(objectIndex, geomCurveIndex, geomCurve);
        measureUnit.measureInfo = new GL_MEASURE_INFO();
        measureUnit.measureInfo.setCurveInfo(geomCurve, g_glprogram.getObjectModelMatrix(objectIndex));
        g_canvas.addMeasureUnit(measureUnit);
    }

    this.measureTwoCurves = function() {
        if (this.pickUnitFirst.objectIndex < 0 || this.pickUnitSecond.objectIndex < 0) {
            return;
        }
        // 判断是否重复
        let repeatedMeasureIndex = g_canvas.isContainMeasureUnit(this.pickUnitFirst, this.pickUnitSecond, MEASURE_TWO_POINTS);
        if (repeatedMeasureIndex > -1) {
            this.doPickMeasureByIndex(repeatedMeasureIndex);
            return;
        }
        // 判断曲线数据
        let firstPartIndex = g_GLObjectSet._arrObjectSet[this.pickUnitFirst.objectIndex]._uPartIndex;
        let secondPartIndex = g_GLObjectSet._arrObjectSet[this.pickUnitSecond.objectIndex]._uPartIndex;
        if (g_GLPartSet._arrPartSet[firstPartIndex]._CurveShape._arrCurve == null ||
            g_GLPartSet._arrPartSet[secondPartIndex]._CurveShape._arrCurve == null ||
            this.pickUnitFirst.geomCurveIndex < 0 || this.pickUnitSecond.geomCurveIndex < 0) {
            return;
        }
        let firstGeomCurve = g_GLPartSet._arrPartSet[firstPartIndex]._CurveShape._arrCurve[this.pickUnitFirst.geomCurveIndex];
        let secondGeomCurve = g_GLPartSet._arrPartSet[secondPartIndex]._CurveShape._arrCurve[this.pickUnitSecond.geomCurveIndex];
        if (firstGeomCurve.nType == ADF_CURVT_UNKOWN || secondGeomCurve.nType == ADF_CURVT_UNKOWN) {
            return;
        }

        let measureUnit = new GL_MEASURE_UNIT();
        measureUnit.measureType = MEASURE_TWO_CURVES;
        measureUnit.arrMeasureShapes.push(new GL_MEASURE_SHAPE());
        measureUnit.arrMeasureShapes[0].setCurveShape(this.pickUnitFirst.objectIndex,
            this.pickUnitFirst.geomCurveIndex, firstGeomCurve);
        measureUnit.arrMeasureShapes.push(new GL_MEASURE_SHAPE());
        measureUnit.arrMeasureShapes[1].setCurveShape(this.pickUnitSecond.objectIndex,
            this.pickUnitSecond.geomCurveIndex, secondGeomCurve);
        measureUnit.measureInfo = new GL_MEASURE_INFO();
        measureUnit.measureInfo.setTwoCurvesInfo(this.pickUnitFirst, firstGeomCurve, this.pickUnitSecond, secondGeomCurve);
        g_canvas.addMeasureUnit(measureUnit);
    }

    this.measurePoint = function(objectIndex, geomPointIndex, intersectPt) {
        if (objectIndex < 0 || intersectPt == null) {
            return;
        }
        // 判断是否重复
        let repeatedMeasureIndex = g_canvas.isContainMeasureUnit(objectIndex, geomPointIndex, MEASURE_POINT);
        if (repeatedMeasureIndex > -1) {
            this.doPickMeasureByIndex(repeatedMeasureIndex);
            return;
        }
        let measureUnit = new GL_MEASURE_UNIT();
        measureUnit.measureType = MEASURE_POINT;
        measureUnit.arrMeasureShapes.push(new GL_MEASURE_SHAPE());
        measureUnit.arrMeasureShapes[0].setPointShape(objectIndex, geomPointIndex, intersectPt);
        measureUnit.measureInfo = new GL_MEASURE_INFO();
        measureUnit.measureInfo.setPointInfo(geomPointIndex, intersectPt, g_glprogram.getObjectModelMatrix(objectIndex));
        g_canvas.addMeasureUnit(measureUnit);
    }

    this.measureTwoPoints = function() {
        if (this.pickUnitFirst.objectIndex < 0 || this.pickUnitSecond.objectIndex < 0) {
            return;
        }
        // 判断是否重复
        let repeatedMeasureIndex = g_canvas.isContainMeasureUnit(this.pickUnitFirst, this.pickUnitSecond, MEASURE_TWO_POINTS);
        if (repeatedMeasureIndex > -1) {
            this.doPickMeasureByIndex(repeatedMeasureIndex);
            return;
        }
        let measureUnit = new GL_MEASURE_UNIT();
        measureUnit.measureType = MEASURE_TWO_POINTS;
        measureUnit.arrMeasureShapes.push(new GL_MEASURE_SHAPE());
        measureUnit.arrMeasureShapes[0].setPointShape(this.pickUnitFirst.objectIndex,
            this.pickUnitFirst.geomPointIndex, this.pickUnitFirst.intersectPt);
        measureUnit.arrMeasureShapes.push(new GL_MEASURE_SHAPE());
        measureUnit.arrMeasureShapes[1].setPointShape(this.pickUnitSecond.objectIndex,
            this.pickUnitSecond.geomPointIndex, this.pickUnitSecond.intersectPt);
        measureUnit.measureInfo = new GL_MEASURE_INFO();
        measureUnit.measureInfo.setTwoPointsInfo(this.pickUnitFirst, this.pickUnitSecond);
        g_canvas.addMeasureUnit(measureUnit);
    }

    this.createMeasureBegin = function() {

    }

    this.createMeasureUpdate = function() {

    }

    this.createMeasureFinal = function() {

    }

    this.createMeasureCancel = function() {
        this.pickUnitFirst.Reset();
        this.pickUnitSecond.Reset();
        this.pickUnitNum = 0;
    }

    this.refreshPickMeasureUnitPos = function(screenX, screenY) {
        g_canvas.getPickMeasureUnitPos(this.pickMeasureUnitIndex, screenX, screenY, this.pickMeasureUnitPos);
    }

    this.moveMeasureUnit = function(measureUnitIndex, mouseX, mouseY) {
        let nObjectIndex = g_canvas.m_arrMeasureDispalyInfo[measureUnitIndex].arrMeasureShapes[0].objectIndex;
        let ObjectMat = g_glprogram.getObjectModelMatrix(nObjectIndex);
        let AttachPos = g_canvas.m_arrMeasureDispalyInfo[measureUnitIndex].measureInfo.attachPos;
        mat4.multiply(this.MVMatrix, g_camera.projectionMatrix, g_camera.viewMatrix);
        mat4.multiply(this.MVPMatrix, this.MVMatrix, ObjectMat);
        CalTranslatePoint(AttachPos.x, AttachPos.y, AttachPos.z, this.MVPMatrix, this.PointNDCCenter);
        // 获得位移终点的世界坐标
        this.measureInfoPt.set(mouseX - this.pickMeasureUnitPos.x, mouseY - this.pickMeasureUnitPos.y);
        glRunTime.cvtScreenPtToWebGL(this.measureInfoPt, this.webglMousePt);
        mat4.invert(this.inverseMVPMatrix, this.MVPMatrix);
        CalTranslatePoint(this.webglMousePt.x, this.webglMousePt.y, this.PointNDCCenter.z, this.inverseMVPMatrix, AttachPos);
    }

    this.hideMeasureUnit = function(measureUnitIndex, visible) {
        if (measureUnitIndex == -1) {
            for (let i = 0; i < g_canvas.m_arrMeasureUnitVisible.length; ++i) {
                g_canvas.hideMeasureUnit(i, visible);
            }
        }
        g_canvas.hideMeasureUnit(measureUnitIndex, visible);
    }

    this.deleMeasureUnit = function(measureUnitIndex) {
        if (measureUnitIndex == -1) {
            for (let i = 0; i < g_canvas.m_arrMeasureDispalyInfo.length; ++i) {
                g_canvas.deleteMeasureUnit(i);
            }
        }
        g_canvas.deleteMeasureUnit(measureUnitIndex);
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
        let mat = g_glprogram.getObjectModelMatrix(objectIndex);
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
        let matFirstPt = g_glprogram.getObjectModelMatrix(firstPtUnit.objectIndex);
        let matSecondPt = g_glprogram.getObjectModelMatrix(secondPtUnit.objectIndex);
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
            matFirstCurve = g_glprogram.getObjectModelMatrix(firstCurveUnit.objectIndex);
            matSecondCurve = g_glprogram.getObjectModelMatrix(secondCurveUnit.objectIndex);
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
                matFirstCurve = g_webglControl.getObjectModelMatrix(firstCurveUnit.objectIndex);
                matSecondCurve = g_webglControl.getObjectModelMatrix(secondCurveUnit.objectIndex);
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
                matFirstCurve = g_webglControl.getObjectModelMatrix(secondCurveUnit.objectIndex);
                matSecondCurve = g_webglControl.getObjectModelMatrix(firstCurveUnit.objectIndex);
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
            matFirstCurve = g_webglControl.getObjectModelMatrix(firstCurveUnit.objectIndex);
            matSecondCurve = g_webglControl.getObjectModelMatrix(secondCurveUnit.objectIndex);
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
            if (GetStringLength(this.displayText[i]) > maxLen) {
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