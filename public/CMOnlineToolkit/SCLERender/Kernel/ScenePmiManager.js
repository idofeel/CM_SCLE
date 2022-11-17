// File: ScenePmiManager.js

/**
 * @author wujiali
 */
 
//===================================================================================================

const PMI_ELEMENT_TYPE_SYMBOL = 1;
const PMI_ELEMENT_TYPE_WIRE = 2;

function GL_PICK_PMI_UNIT() {
    this.elementType = 0;
    this.pmiIndex = -1;
    this.itemIndex = -1;
    this.distance = Infinity;
    this.intersectPt = new Point3(0, 0, 0);

    this.Reset = function() {
        this.elementType = 0;
        this.pmiIndex = -1;
        this.itemIndex = -1;
        this.distance = Infinity;
        this.intersectPt.set(0, 0, 0);
    }
}

function ScenePmiManager() {

    this.m_isInit = false;
    this.m_arrPmiItemVisible = null;
    this.m_arrPmiItemPicked = null;

    this.defaultMaterial = g_lineMtlData.DarkYellow;
    this.pickedMaterial = g_lineMtlData.Red;
    this.displayColor = new ADF_BASEFLOAT4();
    this.pickedColor = new ADF_BASEFLOAT4();

    this.intersectTool = new PmiIntersectTool();
    this.intersectUnit = new GL_PICK_PMI_UNIT();
    //
    this.screenPoint = new Point2(0, 0);
    this.pickPoint = new Point2(0, 0);
    this.RayPoint1 = new Point3(0, 0, 0);
    this.RayPoint2 = new Point3(0, 0, 0);
    this.MMatrix = mat4.create();

    this.viewOrigin = new Point3(0, 0, 0);
    this.viewDir = new Vector3(0, 0, 0);
    this.viewUp = new Vector3(0, 0, 0);

    this.init = function() {
        if (g_CLEPMI == "n"){
            return false;
        }
        if (g_GLPmiSet.arrPmi == null || g_GLPmiSet.arrPmi.length <= 0) {
            return false;
        }

        g_webglControl.isPmiOn = true;

        if (this.m_isInit) {
            return true;
        }

        this.m_arrPmiItemVisible = new Array(g_GLPmiSet.arrPmi.length);
        this.m_arrPmiItemPicked = new Array(g_GLPmiSet.arrPmi.length);

        for (let i in g_GLPmiSet.arrPmi) {
            let arrPmiItemVisible = new Array(g_GLPmiSet.arrPmi[i].arrPmiItem.length);
            let arrPmiItemPicked = new Array(g_GLPmiSet.arrPmi[i].arrPmiItem.length);
            for (let j in g_GLPmiSet.arrPmi[i].arrPmiItem) {
                arrPmiItemPicked[j] = false;
                arrPmiItemVisible[j] = false;
            }
            this.m_arrPmiItemPicked[i] = arrPmiItemPicked;
            this.m_arrPmiItemVisible[i] = arrPmiItemVisible;
        }

        g_webgl.updatePmiData();
        this.intersectTool.init(g_GLPmiSet.arrPmi, null, null);
        this.m_isInit = true;
        return true;
    }

    this.uninit = function() {
        if (g_CLEPMI == "n"){
            return false;
        }
        if (this.m_arrPmiItemVisible != null) {
            for (let i in this.m_arrPmiItemVisible) {
                if (this.m_arrPmiItemVisible[i] != null) {
                    this.m_arrPmiItemVisible[i].splice(0, this.m_arrPmiItemVisible.length);
                    this.m_arrPmiItemVisible[i] = null;
                }
            }
            this.m_arrPmiItemVisible.splice(0, this.m_arrPmiItemPicked.length);
            this.m_arrPmiItemVisible = null;
        }

        if (this.m_arrPmiItemPicked != null) {
            for (let i in this.m_arrPmiItemPicked) {
                if (this.m_arrPmiItemPicked[i] != null) {
                    this.m_arrPmiItemPicked[i].splice(0, this.m_arrPmiItemPicked.length);
                    this.m_arrPmiItemPicked[i] = null;
                }
            }
            this.m_arrPmiItemPicked.splice(0, this.m_arrPmiItemPicked.length);
            this.m_arrPmiItemPicked = null;
        }

        g_webglControl.isPmiOn = false;
        g_webgl.uninitPmiData();
        this.m_isInit = false;
        return true;
    }

    this.clearPmi = function() {
        if (g_CLEPMI == "n"){
            return false;
        }
        
        if (!this.m_isInit) {
            return false;
        }
        g_webglControl.isPmiOn = false;
        return true;
    }

    this.clearPickItem = function() {
        for (let i = 0; i < this.m_arrPmiItemPicked.length; i++) {
            for (let j = 0; j < this.m_arrPmiItemPicked[i].length; ++j) {
                this.m_arrPmiItemPicked[i][j] = false;
            }
        }
    }

    this.pickItemByIndex = function(i, j, isMult) {
        if (!isMult) {
            this.clearPickItem();
        }
        this.m_arrPmiItemPicked[i][j] = true;
    }

    this.pickItemById = function(pmiItemId, isMult) {
        if (!isMult) {
            this.clearPickItem();
        }
        for (let i in g_GLPmiSet.arrPmi) {
            for (let j in g_GLPmiSet.arrPmi[i].arrPmiItem) {
                if (g_GLPmiSet.arrPmi[i].arrPmiItem[j].uID == pmiItemId) {
                    this.m_arrPmiItemPicked[i][j] = true;
                }
            }
        }
    }
    
    this.pickPmi = function(screenX, screenY, isMult, isDoPick) {
        this.screenPoint.set(screenX, screenY);
        glRunTime.cvtScreenPtToWebGL(this.screenPoint, this.pickPoint);
        glRunTime.cvtScreenToWorld(screenX, screenY, this.RayPoint1, this.RayPoint2);
        let intersect = null;
        this.intersectUnit.Reset();

        for (let i in g_GLPmiSet.arrPmi) {
            mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_GLPmiSet.arrPmi[i].matWorld);

            for (let j in g_GLPmiSet.arrPmi[i].arrPmiItem) {
                if (!this.m_arrPmiItemVisible[i][j]) {
                    continue;
                }
                if (g_GLPmiSet.arrPmi[i].arrPmiItem[j].symbolBox == null) {
                    continue;
                }

                intersect = this.intersectTool.intersectSymbol(this.RayPoint1, this.RayPoint2, i, j, this.MMatrix);
                if (intersect != null) {
                    if (intersect.dDistance < this.intersectUnit.distance) {
                        this.intersectUnit.elementType = PMI_ELEMENT_TYPE_SYMBOL;
                        this.intersectUnit.pmiIndex = i;
                        this.intersectUnit.itemIndex = j;
                        this.intersectUnit.distance = intersect.dDistance;
                        this.intersectUnit.intersectPt.set(intersect.ptIntersect.x, intersect.ptIntersect.y, intersect.ptIntersect.z);
                        continue;
                    }
                }

                intersect = this.intersectTool.intersectWire(this.RayPoint1, this.RayPoint2, i, j, this.MMatrix);
                if (intersect != null) {
                    if (intersect.dDistance < this.intersectUnit.distance) {
                        this.intersectUnit.elementType = PMI_ELEMENT_TYPE_WIRE;
                        this.intersectUnit.pmiIndex = i;
                        this.intersectUnit.itemIndex = j;
                        this.intersectUnit.distance = intersect.dDistance;
                        this.intersectUnit.intersectPt.set(intersect.ptIntersect.x, intersect.ptIntersect.y, intersect.ptIntersect.z);
                        continue;
                    }
                }
            }
        }

        if (this.intersectUnit.pmiIndex < 0) {
            this.clearPickItem();
            return false;
        } else {
            this.pickItemByIndex(this.intersectUnit.pmiIndex, this.intersectUnit.itemIndex, isMult);
            return true;
        }
    }

    this.getPickedItemId = function() {
        let arrItemId = new Array();
        for (let i in this.m_arrPmiItemPicked) {
            for (let j in this.m_arrPmiItemPicked[i]) {
                if (this.m_arrPmiItemPicked[i][j]) {
                    arrItemId.push(g_GLPmiSet.arrPmi[i].arrPmiItem[j].uID);
                }
            }
        }
        return arrItemId;
    }

    this.getPmiViewIdByTreeId = function(treeId) {
        let pmiId = this.getPmiIdByTreeId(treeId);
        if (pmiId < 0) {
            return null;
        }

        let arrPmiViewId = new Array();
        for (let i in g_GLPmiSet.arrPmi) {
            if (g_GLPmiSet.arrPmi[i].uID == pmiId) {
                for (let j in g_GLPmiSet.arrPmi[i].arrPmiView) {
                    arrPmiViewId.push(g_GLPmiSet.arrPmi[i].arrPmiView[j].uID);
                }
                break;
            }
        }
        return arrPmiViewId;
    }

    this.getPmiIdByTreeId = function(treeId) {
        let treeNode = glRunTime.getTreeNodeById(treeId, g_GLData.GLModelTreeNode);
        if (treeNode == null) {
            return -1;
        }

        return treeNode._uAnnoID;
    }

    this.getPmiIndexByTreeId = function(treeId) {
        let pmiId = this.getPmiIdByTreeId(treeId);
        if (pmiId < 0) {
            return null;
        }

        for (let i in g_GLPmiSet.arrPmi) {
            if (g_GLPmiSet.arrPmi[i].uID == pmiId) {
                return i;
            }
        }
        return -1;
    }

    this.getPmiViewName = function(pmiViewId) {
        for (let i in g_GLPmiSet.arrPmi) {
            for (let j in g_GLPmiSet.arrPmi[i].arrPmiView) {
                if (g_GLPmiSet.arrPmi[i].arrPmiView[j].uID == pmiViewId) {
                    return g_GLPmiSet.arrPmi[i].arrPmiView[j].strName;
                }
            }
        }
        return null;
    }

    this.getPmiItemName = function(pmiItemId) {
        for (let i in g_GLPmiSet.arrPmi) {
            for (let j in g_GLPmiSet.arrPmi[i].arrPmiItem) {
                if (g_GLPmiSet.arrPmi[i].arrPmiItem[j].uID == pmiItemId) {
                    return g_GLPmiSet.arrPmi[i].arrPmiItem[j].strName;
                }
            }
        }
        return null;
    }

    this.getPmiItemType = function(pmiItemId) {
        for (let i in g_GLPmiSet.arrPmi) {
            for (let j in g_GLPmiSet.arrPmi[i].arrPmiItem) {
                if (g_GLPmiSet.arrPmi[i].arrPmiItem[j].uID == pmiItemId) {
                    return g_GLPmiSet.arrPmi[i].arrPmiItem[j].nType;
                }
            }
        }
        return null;
    }

    this.getPmiItemIdByViewId = function(pmiViewId) {
        let arrItemId = new Array();

        let arrItemIndex = null;
        for (let i in g_GLPmiSet.arrPmi) {
            for (let j in g_GLPmiSet.arrPmi[i].arrPmiView) {
                if (g_GLPmiSet.arrPmi[i].arrPmiView[j].uID == pmiViewId) {
                    arrItemIndex = g_GLPmiSet.arrPmi[i].arrPmiView[j].arrItemIndex;
                    for (let m in arrItemIndex) {
                        arrItemId.push(g_GLPmiSet.arrPmi[i].arrPmiItem[arrItemIndex[m]].uID);
                    }
                }
            }
        }
        return arrItemId;
    }

    this.getPmiViewIndexByItemIndex = function(pmiIndex, itemIndex) {
        if (pmiIndex < 0 || pmiIndex >= g_GLPmiSet.arrPmi.length) {
            return -1;
        }
        if (itemIndex < 0 || itemIndex >= g_GLPmiSet.arrPmi[pmiIndex].arrPmiItem.length) {
            return -1;
        }

        let arrItemIndex = null;
        for (let i in g_GLPmiSet.arrPmi[pmiIndex].arrPmiView) {
            arrItemIndex = g_GLPmiSet.arrPmi[pmiIndex].arrPmiView[i].arrItemIndex;
            for (let j in arrItemIndex) {
                if (arrItemIndex[j] == itemIndex) {
                    return i;
                }
            }
        }
        return -1;
    }

    this.getPmiViewIndexByItemId = function(pmiItemId) {
        let pmiIndex = -1;
        let viewIndex = -1;
        let itemIndex = -1;
        for (let i in g_GLPmiSet.arrPmi) {
            for (let j in g_GLPmiSet.arrPmi[i].arrPmiItem) {
                if (g_GLPmiSet.arrPmi[i].arrPmiItem[j].uID == pmiItemId) {
                    pmiIndex = i;
                    viewIndex = this.getPmiViewIndexByItemIndex(i, j);
                    itemIndex = j;
                    return {
                        pmi: pmiIndex,
                        view: viewIndex,
                        item: itemIndex,
                    };
                }
            }
        }
        return null;
    }

    this.getPmiViewIdByItemId = function(pmiItemId) {
        let obj = this.getPmiViewIndexByItemId(pmiItemId);
        if (obj != null) {
            return g_GLPmiSet.arrPmi[obj.pmi].arrPmiView[obj.view].uID;
        } else {
            return -1;
        }
    }

    this.hideAllPmiItem = function() {
        for (let i in this.m_arrPmiItemVisible) {
            for (let j in this.m_arrPmiItemVisible[i]) {
                this.m_arrPmiItemVisible[i][j] = false;
            }
        }
    }

    this.getPmiItemVisible = function(pmiIndex, itemIndex) {
        if (pmiIndex < 0 || pmiIndex >= g_GLPmiSet.arrPmi.length) {
            return null;
        }
        if (itemIndex < 0 || itemIndex >= g_GLPmiSet.arrPmi[pmiIndex].arrPmiItem.length) {
            return null;
        }
        return this.m_arrPmiItemVisible[pmiIndex][itemIndex];
    }

    this.getPmiItemVisibleById = function(pmiItemId) {
        for (let i in g_GLPmiSet.arrPmi) {
            for (let j in g_GLPmiSet.arrPmi[i].arrPmiItem) {
                if (g_GLPmiSet.arrPmi[i].arrPmiItem[j].uID == pmiItemId) {
                    return this.m_arrPmiItemVisible[i][j];
                }
            }
        }
        return null;
    }

    this.setPmiItemVisible = function(pmiIndex, itemIndex, bVisible) {
        if (pmiIndex < 0 || pmiIndex >= g_GLPmiSet.arrPmi.length) {
            return;
        }
        if (itemIndex < 0 || itemIndex >= g_GLPmiSet.arrPmi[pmiIndex].arrPmiItem.length) {
            return;
        }
        this.m_arrPmiItemVisible[pmiIndex][itemIndex] = bVisible;
    }

    this.setPmiItemVisibleById = function(pmiItemId, bVisible) {
        for (let i in g_GLPmiSet.arrPmi) {
            for (let j in g_GLPmiSet.arrPmi[i].arrPmiItem) {
                if (g_GLPmiSet.arrPmi[i].arrPmiItem[j].uID == pmiItemId) {
                    this.m_arrPmiItemVisible[i][j] = bVisible;
                    break;
                }
            }
        }
    }

    this.setPmiViewVisibleByIndex = function(pmiIndex, viewIndex, bVisible) {
        if (pmiIndex < 0 || pmiIndex >= g_GLPmiSet.arrPmi.length) {
            return;
        }
        if (viewIndex < 0 || viewIndex >= g_GLPmiSet.arrPmi[pmiIndex].arrPmiView.length) {
            return;
        }

        let arrItemIndex = g_GLPmiSet.arrPmi[pmiIndex].arrPmiView[viewIndex].arrItemIndex;
        for (let i in arrItemIndex) {
            this.m_arrPmiItemVisible[pmiIndex][arrItemIndex[i]] = bVisible;
        }
    }

    this.setPmiViewVisible = function(arrViewIDs, bVisible) {
        for (let v in arrViewIDs) {
            if (arrViewIDs[v] < 0) {
                continue;
            }

            for (let i in g_GLPmiSet.arrPmi) {
                for (let j in g_GLPmiSet.arrPmi[i].arrPmiView) {
                    if (g_GLPmiSet.arrPmi[i].arrPmiView[j].uID == arrViewIDs[v]) {
                        this.setPmiViewVisibleByIndex(i, j, bVisible);
                    }
                }
            }
        }
    }

    this.shiftPmiViewVisible = function(pmiViewId) {
        this.hideAllPmiItem();
        
        let arrViewId = new Array();
        arrViewId.push(pmiViewId);
        this.setPmiViewVisible(arrViewId, true);
    }

    this.setFaceToPmiItem = function(pmiItemId) {
        let obj = this.getPmiViewIndexByItemId(pmiItemId);
        if (obj == null) {
            return false;
        }

        let annoPlane = g_GLPmiSet.arrPmi[obj.pmi].arrPmiView[obj.view].annoPlane;
        mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_GLPmiSet.arrPmi[obj.pmi].matWorld);

        CalTranslateAxis(annoPlane.origin, annoPlane.z, this.MMatrix, this.viewDir);
        CalTranslateAxis(annoPlane.origin, annoPlane.y, this.MMatrix, this.viewUp);
        this.viewDir.normalize();
        this.viewUp.normalize();

        let dist = g_camera.getDist();
        let distEye = new Point3(this.viewDir.x * dist, this.viewDir.y * dist, this.viewDir.z * dist);
        g_camera.shiftView(distEye.x, distEye.y, distEye.z, 0.0, 0.0, 0.0, this.viewUp.x, this.viewUp.y, this.viewUp.z);
    }

    this.setFocusOnPmiItem = function(pmiItemId) {
        let obj = this.getPmiViewIndexByItemId(pmiItemId);
        if (obj == null) {
            return false;
        }

        let view = g_GLPmiSet.arrPmi[obj.pmi].arrPmiView[obj.view];
        let item = g_GLPmiSet.arrPmi[obj.pmi].arrPmiItem[obj.item];
        let annoPlane = view.annoPlane;
        mat4.multiply(this.MMatrix, g_webglControl.m_modelMatrix, g_GLPmiSet.arrPmi[obj.pmi].matWorld);

        getModelBoxCenter(item.itemBox, this.viewOrigin);
        CalTranslatePoint(this.viewOrigin.x, this.viewOrigin.y, this.viewOrigin.z, this.MMatrix, this.viewOrigin);
        CalTranslateAxis(annoPlane.origin, annoPlane.z, this.MMatrix, this.viewDir);
        CalTranslateAxis(annoPlane.origin, annoPlane.y, this.MMatrix, this.viewUp);
        this.viewDir.normalize();
        this.viewUp.normalize();

        let dist = getModelBoxLength(item.itemBox) * 2;
        let distEye = new Point3(
            this.viewOrigin.x + this.viewDir.x * dist,
            this.viewOrigin.y + this.viewDir.y * dist,
            this.viewOrigin.z + this.viewDir.z * dist
        );

        g_camera.shiftView(
            distEye.x, distEye.y, distEye.z,
            this.viewOrigin.x, this.viewOrigin.y, this.viewOrigin.z,
            this.viewUp.x, this.viewUp.y, this.viewUp.z
        );
    }

    this.setPmiDisplayColor = function(r, g, b) {
        if (r < 0) { r = 0.0; }
        if (r > 1) { r = 1.0; }
        if (g < 0) { g = 0.0; }
        if (g > 1) { g = 1.0; }
        if (b < 0) { b = 0.0; }
        if (b > 1) { b = 1.0; }

        this.displayColor.x = r; this.displayColor.y = g; this.displayColor.z = b; this.displayColor.w = 1.0;
        this.defaultMaterial = this.displayColor;
    }

    this.setPmiSelectColor = function(r, g, b) {
        if (r < 0) { r = 0.0; }
        if (r > 1) { r = 1.0; }
        if (g < 0) { g = 0.0; }
        if (g > 1) { g = 1.0; }
        if (b < 0) { b = 0.0; }
        if (b > 1) { b = 1.0; }

        this.pickedColor.x = r; this.pickedColor.y = g; this.pickedColor.z = b; this.pickedColor.w = 1.0;
        this.pickedMaterial = this.pickedColor;
    }

    this.resetPmiColor = function() {
        this.defaultMaterial = g_lineMtlData.DarkYellow;
        this.pickedMaterial = g_lineMtlData.Red;
    }
}