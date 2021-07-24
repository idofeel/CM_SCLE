// File: GLProgram.js

/**
 * @author wujiali
 */
 
//===================================================================================================

function GLProgram() {
    if (isWebgl2) {
        g_webgl = new WebGL2();
    } else {
        g_webgl = new WebGL1();
    }

    // 拾取计算
    this.m_arrPartSurfaceIndex = new Array();
    // 动画模式所需的参数
    this.isAnimationMode = false;
    this.uCurFrame = 0;
    // 渲染过程计算所需数据，置为全局变量，能减小内存
    this.aspect = 1.0;
    this.eyeLocation = new Point3();
    this.defaultMaterial = DefaultData.DefaultMaterial();
    this.defaultRed = DefaultData.Red();
    this.vLinePt1 = new ADF_BASEFLOAT3();
    this.vLinePt2 = new ADF_BASEFLOAT3();
    this.vTriVer1 = new ADF_BASEFLOAT3();
    this.vTriVer2 = new ADF_BASEFLOAT3();
    this.vTriVer3 = new ADF_BASEFLOAT3();
    this.RealPoint1 = new Point3(0, 0, 0);
    this.RealPoint2 = new Point3(0, 0, 0);
    this.RealPoint3 = new Point3(0, 0, 0);
    this.pIntersectPt = new ADF_BASEFLOAT3();
    this.fTransparent = 1.0;
    this.animMatrix = mat4.create();
    this.modelMatrix = mat4.create();
    this.modelMatrixTmp = mat4.create();
    this.modelCenter = new Point3(0, 0, 0);
    this.arrPickIndexs = new Array();
    // 零件多选、曲面多选参数
    this.isMultPick = false;
    this.isObjectPick = true;
    this.isSurfacePick = false;

    /**
     * 初始化渲染3D场景数据
     */
    this.initGLData = function() {
        if (g_GLObjectSet != null) {
            this.setUniteMaterial();
            this.setObjectModelMat();
            this.setObjectTransparent();
            this.setObjectVisible();
            this.setObjectMaterial();
            this.setSubsetIndex();
            this.setPickIndexs();

            g_webgl.initScene();
        }
    }

    /**
     * 卸载渲染3D数据
     */
     this.uninitGLData = function() {
        if (g_GLObjectSet != null) {
            g_webgl.uninitScene();
            g_webglControl.clearParams();

            this.m_arrPartSurfaceIndex.splice(0, this.m_arrPartSurfaceIndex.length);
        }
    }

    /**
     * 清空3D数据
     */
    this.clearGLData = function() {
        if (g_GLObjectSet != null) {
            g_webgl.clearScene();
            g_webglControl.clearParams();

            this.m_arrPartSurfaceIndex.splice(0, this.m_arrPartSurfaceIndex.length);
        }
    }

    /**
     * 重置3D数据
     */
    this.resetGLData = function() {
        if (g_GLObjectSet != null) {
            this.setUniteMaterial();
            this.setObjectModelMat();
            this.setObjectTransparent();
            this.setObjectVisible();
            this.setObjectMaterial();
            this.setSubsetIndex();
            this.setPickIndexs();

            g_webgl.resetScene();
        }
    }

    /**
     * 设置包围盒显示
     */
    this.setBoxShow = function(isShow) {
        g_webglControl.isShowBox = isShow;
    }

    /**
     * 设置高亮显示
     */
    this.setHighlightShow = function(isHighlight) {
        g_webglControl.isHighlight = isHighlight;
    }

    /**
     * 零件拾取
     */
    this.pickObjectSurfaces = function(objectIndex, surfaceIndex) {
        if (!this.isMultPick) {
            // 单选，清空之前所有选取标记
            this.clearPickIndes();
        } else if (this.isObjectPick) {
            // 多选零件，清空之前曲面选取标记
            this.clearPickSurfaceIndexs();
        }

        g_webglControl.arrPickObjectIndexs[objectIndex] = true;
        if (this.isObjectPick) {
            g_webglControl.isHighlightObject = true;
        } else {
            g_webglControl.arrPickObjectSurfaceIndexs[objectIndex][surfaceIndex] = true;
            g_webglControl.splitVAOVertexCounts(objectIndex, surfaceIndex);
            g_webglControl.isHighlightObject = false;
        }
    }
    this.pickByIndex = function(objectIndex, surfaceIndex, isMult) {
        if (objectIndex < -1 || objectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return;
        }
        if (objectIndex > -1) {
            g_webglControl.isPicked = true;
            g_webglControl.eMaterialPriority = GL_USERPICKED;
            if (g_webglControl.arrPickObjectIndexs[objectIndex]) {
                // 重复点击同一个零件，自动进入拾取曲面模式
                this.isSurfacePick = true;
                this.isObjectPick = false;
            } else {
                this.isObjectPick = true;
                this.isSurfacePick = false;
            }

            this.isMultPick = isMult;
            if (!isMult) {
                g_webglControl.GL_PICKSTATUS = 1;
            } else {
                g_webglControl.GL_PICKSTATUS = 2;
            }
            return this.pickObjectSurfaces(objectIndex, surfaceIndex)
        } else {
            this.clearPickIndes();
            g_webglControl.GL_PICKSTATUS = 0;
            g_webglControl.isPicked = false;
        }
    }
    this.pickMultByIndex = function(indexs) {
        let isAllNull = true;
        this.clearPickIndes();

        for (let i = 0; i < indexs.length; i++) {
            if (indexs[i] < 0 || indexs[i] >= g_GLObjectSet._arrObjectSet.length) {
                continue;
            }
            g_webglControl.arrPickObjectIndexs[indexs[i]] = true;
            isAllNull = false;
        }
        if (isAllNull) {
            g_webglControl.isPicked = false;
            g_webglControl.GL_PICKSTATUS = 0;
            return;
        }
        g_webglControl.eMaterialPriority = GL_USERPICKED;
        g_webglControl.isPicked = true;
        if (indexs.length == 1) {
            g_webglControl.GL_PICKSTATUS = 1;
            return indexs[0];
        } else {
            g_webglControl.GL_PICKSTATUS = 2;
            return -1;
        }
    }
    this.pickByRay = function(RayPoint1, RayPoint2, isMult, isDoPick) {
        let objectIndex = -1;
        let surfaceIndex = -1;
        let intersecRet = this.intersectRayScene(RayPoint1, RayPoint2);
        if (intersecRet != null) {
            objectIndex = intersecRet.uObjectIndex;
            surfaceIndex = intersecRet.uSurfaceIndex;
        }
        // 获取拾取object得索引
        if (isDoPick) {
            this.pickByIndex(objectIndex, surfaceIndex, isMult);
        }
        return objectIndex;
    }

    /**
     * 获取零件拾取状态
     */
    this.getPickStatus = function() {
        return g_webglControl.GL_PICKSTATUS;
    }
    this.getPickedIndex = function() {
        this.arrPickIndexs.splice(0, this.arrPickIndexs.length);
        if (g_webglControl.GL_PICKSTATUS == 1 || g_webglControl.GL_PICKSTATUS == 2) {
            for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
                if (g_webglControl.arrPickObjectIndexs[i]) {
                    this.arrPickIndexs.push(i);
                }
            }
            return this.arrPickIndexs;
        } else {
            return this.arrPickIndexs;
        }
    }

    /**
     * 设置指定object模型的Model矩阵
     */
    this.setObjectModelMat = function() {
        if (g_webglControl.m_arrObjectMatrix.length == 0) {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                let objectMatrix = mat4.create();
                g_GLObjectSet._arrObjectSet[i].GetAnimMatrix(0, this.animMatrix);
                mat4.multiply(objectMatrix, this.modelMatrix, this.animMatrix);
                g_webglControl.m_arrObjectMatrix.push(objectMatrix);
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                g_GLObjectSet._arrObjectSet[i].GetAnimMatrix(0, this.animMatrix);
                mat4.multiply(g_webglControl.m_arrObjectMatrix[i], this.modelMatrix, this.animMatrix);
            }
        }
    }
    this.setObjectModelMatrixMult = function(modelMatrix) {
        for (let i = 0; i <= g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                mat4.multiply(g_webglControl.m_arrObjectMatrix[i], modelMatrix, g_webglControl.m_arrObjectMatrix[i]);
            }
        }
    }
    this.setObjectMatrixByIndex = function(index, matrix) {
        if (index < 0 || index >= g_webglControl.m_arrObjectMatrix.length) {
            return;
        }
        mat4.multiply(g_webglControl.m_arrObjectMatrix[index], this.modelMatrix, matrix);
    }
    this.getObjectModelMatrix = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return this.modelMatrix;
        }
        return g_webglControl.m_arrObjectMatrix[nObjectIndex];
    }
    this.getObjectOriginMatrix = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return mat4.create();
        }

        g_GLObjectSet._arrObjectSet[nObjectIndex].GetAnimMatrix(this.uCurFrame, this.animMatrix);
        return this.animMatrix;
    }

    /**
     * 设置所有Object透明度
     */
    this.setObjectTransparent = function() {
        // 默认第0帧数据
        if (g_webglControl.m_arrObjectTransparent.length == 0) {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                let tempTrans =  g_GLObjectSet._arrObjectSet[i].GetAnimTransparent(0);
                if (tempTrans > -0.5) {
                    g_webglControl.m_arrObjectTransparent.push(tempTrans);
                    g_webglControl.switchObjectTranList(i, tempTrans);
                }
                else {
                    g_webglControl.m_arrObjectTransparent.push(1.0);
                    g_webglControl.switchObjectTranList(i, 1.0);
                }
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                let tempTrans =  g_GLObjectSet._arrObjectSet[i].GetAnimTransparent(0);
                if (tempTrans > -0.5) {
                    g_webglControl.m_arrObjectTransparent[i] = tempTrans;
                } else {
                    g_webglControl.m_arrObjectTransparent[i] = 1.0;
                }
                g_webglControl.switchObjectTranList(i, g_webglControl.m_arrObjectTransparent[i]);
            }
        }
    }
    this.setObjectTransparentMult = function(fTransparent) {
        for (let i = 0; i <= g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                g_webglControl.switchObjectTranList(i, fTransparent);
                g_webglControl.m_arrObjectTransparent[i] = fTransparent;
            }
        }
    }
    this.getObjectTransparent = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return 0.0;
        }
        return g_webglControl.m_arrObjectTransparent[nObjectIndex];
    }

    /**
     * 设置所有Object显隐性
     */
    this.setObjectVisible = function() {
        if (g_webglControl.m_arrObjectVisiable.length == 0) {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                if (g_GLObjectSet._arrObjectSet[i]._nFillMode == ADFFILL_INVISIBLE) {
                    g_webglControl.m_arrObjectVisiable.push(false);
                } else {
                    g_webglControl.m_arrObjectVisiable.push(true);
                }
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                if (g_GLObjectSet._arrObjectSet[i]._nFillMode == ADFFILL_INVISIBLE) {
                    g_webglControl.m_arrObjectVisiable[i] = false;
                } else {
                    g_webglControl.m_arrObjectVisiable[i] = true;
                }
            }
        }
    }
    this.setObjectVisibleMult = function(bVisible) {
        for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                g_webglControl.m_arrObjectVisiable[i] = bVisible;
            }
        }
    }
    this.getObjectVisible = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= g_GLObjectSet._arrObjectSet.length) {
            return false;
        }
        return g_webglControl.m_arrObjectVisiable[nObjectIndex];
    }
    this.setObjectVisibleByIndexs = function(indexs, bVisible) {
        for (let i = 0; i < indexs.length; i++) {
            if (indexs[i]<0 || indexs[i] > g_webglControl.m_arrObjectVisiable.length) {
                continue;
            }
            g_webglControl.m_arrObjectVisiable[indexs[i]] = bVisible;
        }
    }

    /**
     * 设置指定Object材质颜色
     */
    this.setObjectMaterial = function() {
        if (g_webglControl.m_arrObjectMaterial.length == 0) {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                g_webglControl.m_arrObjectMaterial.push(null);
            }
        } else {
            for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
                g_webglControl.m_arrObjectMaterial[i] = null;
            }
        }
    }
    this.setObjectMaterialMult = function(Red, Green, Blue, Alpha) {
        if (Red < 0.0) {Red = 0.0;}
        if (Red > 1.0) {Red = 1.0;}
        if (Green < 0.0) {Green = 0.0;}
        if (Green > 1.0) {Green = 1.0;}
        if (Blue < 0.0) {Blue = 0.0;}
        if (Blue > 1.0) {Blue = 1.0;}

        let objectMaterial  = new ADF_MATERIAL();
        objectMaterial._eMtlType = ADFMTLTYPE_PHYSICS;
        let tempPhysics  = new ADF_MATERIALPHYSICS();
        tempPhysics.fPower = 10.0;
        tempPhysics.vAmbient.x = Red, tempPhysics.vAmbient.y = Green, tempPhysics.vAmbient.z = Blue, tempPhysics.vAmbient.w = 1.0;
        tempPhysics.vDiffuse.x = Red, tempPhysics.vDiffuse.y = Green, tempPhysics.vDiffuse.z = Blue, tempPhysics.vDiffuse.w = 1.0;
        tempPhysics.vEmissive.x = 0.0, tempPhysics.vEmissive.y = 0.0, tempPhysics.vEmissive.z = 0.0, tempPhysics.vEmissive.w = 1.0;
        tempPhysics.vSpecular.x = Red, tempPhysics.vSpecular.y = Green, tempPhysics.vSpecular.z = Blue, tempPhysics.vSpecular.w = 1.0;
        objectMaterial._mtlPhysics = tempPhysics;

        for (let i = 0; i <= g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                g_webglControl.m_arrObjectMaterial[i] = objectMaterial;
            }
        }
        g_webglControl.eMaterialPriority = GL_USERDEFINE;
    }

    /**
     * 清除所有临时设置数据
     */
    this.home = function(type) {
        switch (type) {
            case HOME_ALL:
                this.setObjectModelMat();
                this.setObjectTransparent();
                this.setObjectVisible();
                this.setObjectMaterial();
                break;
            case HOME_POSITION:
                this.setObjectModelMat();
                break;
            case HOME_COLOR:
                this.setObjectMaterial();
                break;
            case HOME_TRANS:
                this.setObjectTransparent();
                break;
            case HOME_VISIBLE:
                this.setObjectVisible();
                break;
            default:
                return;
        }
    }

    /**
     * 计算物件动画数据
     */
    this.setObjectAnim = function(uStartFrame) {
        this.isAnimationMode = true;
        this.uCurFrame = uStartFrame;
        for (let i = 0; i < g_webglControl.m_arrObjectMatrix.length; i++) {
            // 矩阵数据
            g_GLObjectSet._arrObjectSet[i].GetAnimMatrix(uStartFrame, this.animMatrix);
            mat4.multiply(g_webglControl.m_arrObjectMatrix[i], this.modelMatrix, this.animMatrix);
            // 透明度数据
            this.fTransparent = g_GLObjectSet._arrObjectSet[i].GetAnimTransparent(uStartFrame);
            g_webglControl.switchObjectTranList(i, this.fTransparent);
            g_webglControl.m_arrObjectTransparent[i] = this.fTransparent;
        }
    }

    /**
     * 设置模型中心点或者焦点，但是不更新零件实际矩阵
     */
    this.setModelCenter = function(center) {
        this.modelCenter.x = center.x, this.modelCenter.y = center.y, this.modelCenter.z = center.z;
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(-center.x, -center.y, -center.z));
    }

    /**
     * 将模型平移到中心点或者焦点，更新零件实际矩阵
     */
    this.moveModelCenter = function(center) {
        mat4.identity(this.modelMatrixTmp);
        mat4.translate(this.modelMatrixTmp, this.modelMatrixTmp, vec3.fromValues(center.x, center.y, center.z));
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(center.x, center.y, center.z));
        // 更新矩阵
        for (let i = 0; i < g_webglControl.m_arrObjectMatrix.length; i++) {
            // 矩阵数据
            mat4.multiply(g_webglControl.m_arrObjectMatrix[i], this.modelMatrixTmp, g_webglControl.m_arrObjectMatrix[i]);
        }
    }

    /**
     * 设置背景图片
     */
    this.setBackground = function(index) {
        g_webglControl.m_bgIndex = index;
    }
    this.addBackground = function(imageDataGL) {
        if (imageDataGL instanceof WebGLTexture) {
            g_webglControl.m_arrBgTexId.push(imageDataGL);
            g_webglControl.m_bgIndex = g_webglControl.m_arrBgTexId.length - 1;
        }
    }

    /**
     * 材质批量处理
     */
    this.setUniteMaterial = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            var uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            g_webglControl.setVertexDataNum(uCurPartIndex);
            if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                var uSurfaceNum = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length;

                // 只有曲面数据的合并材质
                var isContainsNotTrans = false;
                var isContainsTrans = false;
                // 合并材质，固定长度为surface长度，但是合并后长度由size记录
                var arrObjectVAOUint = new Array();

                if (g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length == 1) {
                    var materialIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0];
                    if (materialIndex >= 0 && materialIndex < g_GLMaterialSet._arrMaterialSet.length) {
                        if (g_GLMaterialSet._arrMaterialSet[materialIndex]._mtlPhysics.vEmissive.w < 1.0) {
                            isContainsTrans = true;
                        } else {
                            isContainsNotTrans = true;
                        }
                    }
                    // object只有一种材质
                    var vaoUnit = new GL_VAO_UNIT(uSurfaceNum);
                    vaoUnit.arrVertexCounts[0] = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.length / VERTEX_DATA_COUNT;
                    vaoUnit.arrMaterialIndexs[0] = materialIndex;
                    vaoUnit.uintVertexNum = vaoUnit.arrVertexCounts[0];
                    vaoUnit.uintMaterialIndex = materialIndex;
                    vaoUnit.surfaceStart = 0;
                    vaoUnit.surfaceCount = uSurfaceNum;
                    arrObjectVAOUint.push(vaoUnit);
                } else {
                    // Object有多个Surface，并且有多个材质
                    var uCurIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0];
                    var uVertexCount = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[0];
                    // 记录第一个材质VAO数据
                    arrObjectVAOUint.push(new GL_VAO_UNIT(0));
                    arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts.push(0);
                    arrObjectVAOUint[arrObjectVAOUint.length - 1].arrMaterialIndexs.push(-1);
                    arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceStart = 0;
                    arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceCount = 1;

                    // 初始物体透明度标志
                    if (uCurIndex >= 0 && uCurIndex < g_GLMaterialSet._arrMaterialSet.length) {
                        if (g_GLMaterialSet._arrMaterialSet[uCurIndex]._mtlPhysics.vEmissive.w < 1.0) {
                            isContainsTrans = true;
                        } else {
                            isContainsNotTrans = true;
                        }
                    }
                    for (let j = 1; j < g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length; j++) {
                        if (g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j] == uCurIndex) {
                            // 归并到上一段材质VAO数据
                            uVertexCount += g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j];
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts.push(0);
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].arrMaterialIndexs.push(-1);
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceCount++;

                            if (j == g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length-1) {
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts[0] = uVertexCount;
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].arrMaterialIndexs[0] = uCurIndex;
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintVertexNum = uVertexCount;
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex = uCurIndex;
                            }
                        } else {
                            // 存储上一段材质的VAO数据
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts[0] = uVertexCount;
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].arrMaterialIndexs[0] = uCurIndex;
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].uintVertexNum = uVertexCount;
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex = uCurIndex;
                            // 开始新一段材质VAO数据的记录
                            arrObjectVAOUint.push(new GL_VAO_UNIT(0));
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts.push(0);
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].arrMaterialIndexs.push(-1);
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceStart = j;
                            arrObjectVAOUint[arrObjectVAOUint.length - 1].surfaceCount = 1;

                            if (j == g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length-1) {
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts[0] =
                                    g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j];
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].arrMaterialIndexs[0] =
                                    g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintVertexNum =
                                    g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j];
                                arrObjectVAOUint[arrObjectVAOUint.length - 1].uintMaterialIndex =
                                    g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                            } else {
                                uCurIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                                uVertexCount = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j];
                            }
                        }
                        // 设置物体透明度标志
                        var materialIndex = g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                        if (materialIndex >= 0 && materialIndex < g_GLMaterialSet._arrMaterialSet.length) {
                            if (g_GLMaterialSet._arrMaterialSet[materialIndex]._mtlPhysics.vEmissive.w < 1.0) {
                                isContainsTrans = true;
                            } else {
                                isContainsNotTrans = true;
                            }
                        }
                    }
                }
                g_webglControl.m_arrObjectVAOUint.push(arrObjectVAOUint);

                if (isContainsTrans && (!isContainsNotTrans)) {
                    // 全透明
                    g_webglControl.m_arrObjectTransModeOrig.push(GLTRANS_ALL);
                    g_webglControl.m_arrObjectTransMode.push(GLTRANS_ALL);
                } else if (isContainsTrans && isContainsNotTrans) {
                    // 部分透明
                    g_webglControl.m_arrObjectTransModeOrig.push(GLTRANS_PART);
                    g_webglControl.m_arrObjectTransMode.push(GLTRANS_PART);
                } else {
                    // 全不透明
                    g_webglControl.m_arrObjectTransModeOrig.push(GLTRANS_NO);
                    g_webglControl.m_arrObjectTransMode.push(GLTRANS_NO);
                }
            } else {
                // 只有线缆数据的合并材质
                var arrObjectVAOUint = new Array();
                arrObjectVAOUint.push(new GL_VAO_UNIT(0));
                arrObjectVAOUint[arrObjectVAOUint.length - 1].arrVertexCounts.push(
                    g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.length / VERTEX_DATA_COUNT);
                arrObjectVAOUint[arrObjectVAOUint.length - 1].arrMaterialIndexs.push(
                    g_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0]);

                g_webglControl.m_arrObjectVAOUint.push(arrObjectVAOUint);
                g_webglControl.m_arrObjectTransModeOrig.push(GLTRANS_NO);
                g_webglControl.m_arrObjectTransMode.push(GLTRANS_NO);
            }
        }
    }

    /**
     * 生成零件曲面的面片索引，用于拾取求
     */
    this.setSubsetIndex = function() {
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            let arrSurfaceIndex = new Array();
            let index = 0;
            for (let j = 0; j < g_GLPartSet._arrPartSet[i]._arrPartLODData[0]._arrSurfaceVertexNum.length; j++)
            {
                let surfaceIndex = new GL_Vertex_Index(index, index+g_GLPartSet._arrPartSet[i]._arrPartLODData[0]._arrSurfaceVertexNum[j]);
                arrSurfaceIndex.push(surfaceIndex);
                index += g_GLPartSet._arrPartSet[i]._arrPartLODData[0]._arrSurfaceVertexNum[j];
            }
            this.m_arrPartSurfaceIndex.push(arrSurfaceIndex);
        }
    }

    /**
     * 生成零件拾取标识数组
     */
    this.setPickIndexs = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            g_webglControl.arrPickObjectIndexs.push(false);

            let curPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            let surfaceFlags = new Array();
            for (let j = 0; j < g_GLPartSet._arrPartSet[curPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length; ++j) {
                surfaceFlags.push(false);
            }
            g_webglControl.arrPickObjectSurfaceIndexs.push(surfaceFlags);
        }
    }

    /**
     * 清空零件拾取标志
     */
    this.clearPickIndes = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            g_webglControl.arrPickObjectIndexs[i] = false;

            let curPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            for (let j = 0; j < g_GLPartSet._arrPartSet[curPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length; ++j) {
                g_webglControl.arrPickObjectSurfaceIndexs[i][j] = false;
            }
        }
        g_webglControl.splitVAOVertexCounts(-1, -1);
    }

    this.clearPickObjectIndexs = function() {
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            g_webglControl.arrPickObjectIndexs[i] = false;

            let curPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            for (let j = 0; j < g_GLPartSet._arrPartSet[curPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum.length; ++j) {
                g_webglControl.arrPickObjectSurfaceIndexs[i][j] = false;
            }
        }
    }

    this.clearPickSurfaceIndexs = function() {
        g_webglControl.splitVAOVertexCounts(-1, -1);
    }

    /**
     * 射线与包围盒求交
     */
    this.intersectRayBox = function(RayPoint1, RayPoint2, ObjectBox, ObjectMat) {
        this.vLinePt1.x = RayPoint1.x; this.vLinePt1.y = RayPoint1.y; this.vLinePt1.z = RayPoint1.z;
        this.vLinePt2.x = RayPoint2.x; this.vLinePt2.y = RayPoint2.y; this.vLinePt2.z = RayPoint2.z;
        // 包围盒6各面拆成12个三角形
        let arrIndex = new Array();
        arrIndex.push(0); arrIndex.push(1); arrIndex.push(3);
        arrIndex.push(0); arrIndex.push(2); arrIndex.push(3);
        arrIndex.push(0); arrIndex.push(1); arrIndex.push(5);
        arrIndex.push(0); arrIndex.push(4); arrIndex.push(5);
        arrIndex.push(0); arrIndex.push(2); arrIndex.push(6);
        arrIndex.push(0); arrIndex.push(4); arrIndex.push(6);
        arrIndex.push(7); arrIndex.push(5); arrIndex.push(4);
        arrIndex.push(7); arrIndex.push(5); arrIndex.push(6);
        arrIndex.push(7); arrIndex.push(3); arrIndex.push(5);
        arrIndex.push(7); arrIndex.push(3); arrIndex.push(1);
        arrIndex.push(7); arrIndex.push(6); arrIndex.push(3);
        arrIndex.push(7); arrIndex.push(6); arrIndex.push(2);
        for (let i = 0; i < 12; i++) {
            CalTranslatePoint(ObjectBox._Vertex[arrIndex[i * 3 + 0]].x,
                              ObjectBox._Vertex[arrIndex[i * 3 + 0]].y,
                              ObjectBox._Vertex[arrIndex[i * 3 + 0]].z, ObjectMat, this.RealPoint1);
            CalTranslatePoint(ObjectBox._Vertex[arrIndex[i * 3 + 1]].x,
                              ObjectBox._Vertex[arrIndex[i * 3 + 1]].y,
                              ObjectBox._Vertex[arrIndex[i * 3 + 1]].z, ObjectMat, this.RealPoint2);
            CalTranslatePoint(ObjectBox._Vertex[arrIndex[i * 3 + 2]].x,
                              ObjectBox._Vertex[arrIndex[i * 3 + 2]].y,
                              ObjectBox._Vertex[arrIndex[i * 3 + 2]].z, ObjectMat, this.RealPoint3);
            this.vTriVer1.x = this.RealPoint1.x; this.vTriVer1.y = this.RealPoint1.y; this.vTriVer1.z = this.RealPoint1.z;
            this.vTriVer2.x = this.RealPoint2.x; this.vTriVer2.y = this.RealPoint2.y; this.vTriVer2.z = this.RealPoint2.z;
            this.vTriVer3.x = this.RealPoint3.x; this.vTriVer3.y = this.RealPoint3.y; this.vTriVer3.z = this.RealPoint3.z;
            if (CalcIntersectOfLineSegTriangle(this.vLinePt1, this.vLinePt2, this.vTriVer1, this.vTriVer2, this.vTriVer3, this.pIntersectPt))
            {
                return true;
            }
        }
        return false;
    }

    /**
     * 射线与场景中的object的最近的交点
     * 返回：object索引、交点距离和坐标
     */
    this.intersectRayScene = function(RayPoint1, RayPoint2) {
        let arrObjectIndex = new Array();
        let arrSurfaceIndex = new Array();
        let arrDistance = new Array();
        let arrIntersectPt = new Array();
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; ++i) {
            // 若是线缆数据则不能拾取
            if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST) {
                continue;
            }
            // 若不可见则不能拾取
            if (!g_webglControl.m_arrObjectVisiable[i]) {
                continue;
            }
            if (g_webglControl.m_arrObjectTransparent[i] <= GL_ZERO) {
                continue;
            }
            
            let CurMat = g_webglControl.m_arrObjectMatrix[i];
            let intersectRet = this.intersectRayObject(RayPoint1, RayPoint2, i, CurMat);
            if (intersectRet != null) {
                arrDistance.push(intersectRet.dDistance);
                arrIntersectPt.push(intersectRet.ptIntersect);
                arrSurfaceIndex.push(intersectRet.uSurfaceIndex);
                arrObjectIndex.push(i);
            }
        }
        if (arrDistance.length == 0) {
            return null;
        } else {
            // 取最近的相交Object
            let index = -1;
            let minDistance = Infinity;
            for (let i = 0; i < arrDistance.length; i++) {
                if (arrDistance[i] < minDistance) {
                    minDistance = arrDistance[i];
                    index = i;
                }
            }

            return {
                uObjectIndex: arrObjectIndex[index],
                uSurfaceIndex: arrSurfaceIndex[index],
                dDistance: minDistance,
                ptIntersect: arrIntersectPt[index],
            };
        }
    }

    /**
     * 射线与object的最近的交点
     * 返回：曲面索引，交点距离和坐标
     */
     this.intersectRayObject = function(RayPoint1, RayPoint2, ObjectIndex, ObjectMat) {
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[ObjectIndex]._uPartIndex;
        if (this.intersectRayBox(RayPoint1, RayPoint2, g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox, ObjectMat)) {
            let arrSubsetDistance = new Array();
            let arrIntersectPt = new Array();
            let arrSurfaceIndex = new Array();
            for (let j = 0; j < g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._SurfaceBoxes.length; j++) {
                if (this.intersectRayBox(RayPoint1, RayPoint2, g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._SurfaceBoxes[j], ObjectMat)) {
                    let intersetRet = this.intersectRaySurface(RayPoint1, RayPoint2, uCurPartIndex, j, ObjectMat)
                    if (intersetRet != null) {
                        arrSubsetDistance.push(intersetRet.dDistance);
                        arrIntersectPt.push(intersetRet.ptIntersect);
                        arrSurfaceIndex.push(j);
                    }
                }
            }

            if (arrSubsetDistance.length == 0) {
                return null;
            } else {
                let minDistance = Infinity;
                let index = 0;
                for (let j = 0; j < arrSubsetDistance.length; j++) {
                    if (arrSubsetDistance[j] < minDistance) {
                        minDistance = arrSubsetDistance[j];
                        index = j;
                    }
                }
                return {
                    uSurfaceIndex: arrSurfaceIndex[index],
                    dDistance: minDistance,
                    ptIntersect: arrIntersectPt[index],
                };
            }
        }
    }

    /**
     * 射线与曲面子集的最近的交点
     * 返回：交点距离和坐标
     */
     this.intersectRaySurface = function(RayPoint1, RayPoint2, uPartIndex, uSurfaceIndex, ObjectMat) {
        this.vLinePt1.x = RayPoint1.x; this.vLinePt1.y = RayPoint1.y; this.vLinePt1.z = RayPoint1.z;
        this.vLinePt2.x = RayPoint2.x; this.vLinePt2.y = RayPoint2.y; this.vLinePt2.z = RayPoint2.z;
        let arrDistance = new Array();
        let arrIntersecPt = new Array();
        g_webglControl.setVertexDataNum(uPartIndex);
        for (let i = this.m_arrPartSurfaceIndex[uPartIndex][uSurfaceIndex]._startIndex; i<this.m_arrPartSurfaceIndex[uPartIndex][uSurfaceIndex]._endIndex; i += 3) {
            CalTranslatePoint(g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[i * VERTEX_DATA_COUNT],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[i * VERTEX_DATA_COUNT + 1],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[i * VERTEX_DATA_COUNT + 2], ObjectMat, this.RealPoint1);
            CalTranslatePoint(g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 1) * VERTEX_DATA_COUNT],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 1) * VERTEX_DATA_COUNT + 1],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 1) * VERTEX_DATA_COUNT + 2], ObjectMat, this.RealPoint2);
            CalTranslatePoint(g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 2) * VERTEX_DATA_COUNT],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 2) * VERTEX_DATA_COUNT + 1],
                              g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 2) * VERTEX_DATA_COUNT + 2], ObjectMat, this.RealPoint3);
            this.vTriVer1.x = this.RealPoint1.x; this.vTriVer1.y = this.RealPoint1.y; this.vTriVer1.z = this.RealPoint1.z;
            this.vTriVer2.x = this.RealPoint2.x; this.vTriVer2.y = this.RealPoint2.y; this.vTriVer2.z = this.RealPoint2.z;
            this.vTriVer3.x = this.RealPoint3.x; this.vTriVer3.y = this.RealPoint3.y; this.vTriVer3.z = this.RealPoint3.z;
            if (CalcIntersectOfLineSegTriangle(this.vLinePt1, this.vLinePt2, this.vTriVer1, this.vTriVer2, this.vTriVer3, this.pIntersectPt)) {
                let tempDistance = Math.sqrt((this.pIntersectPt.x-this.vLinePt1.x)*(this.pIntersectPt.x-this.vLinePt1.x) +
                                        (this.pIntersectPt.y-this.vLinePt1.y)*(this.pIntersectPt.y-this.vLinePt1.y) +
                                        (this.pIntersectPt.z-this.vLinePt1.z)*(this.pIntersectPt.z-this.vLinePt1.z));
                let tempIntersetPt = new ADF_BASEFLOAT3();
                CalInversePoint(this.pIntersectPt, ObjectMat, tempIntersetPt);
                arrDistance.push(tempDistance);
                arrIntersecPt.push(tempIntersetPt);
            }
        }

        // 计算最小值
        if (arrDistance.length == 0) {
            return null;
        } else {
            let minDistance = Infinity;
            let index = 0;
            for (let i = 0; i < arrDistance.length; i++) {
                if (arrDistance[i] < minDistance) {
                    minDistance = arrDistance[i];
                    index = i;
                }
            }
            return {
                dDistance: minDistance,
                ptIntersect: arrIntersecPt[index],
            };
        }
    }

    /**
     * 求解零件是否在矩形框内部
     */
    this.isObjectInRect = function(part, mvpMat, rect2D) {
        let retBox = this.isObjBoxInRect(part._boxset._ObjectBox, mvpMat, rect2D);
        if (retBox == RECT_ALL) {
            return true;
        } else if (retBox == RECT_NOT) {
            return false;
        }

        let subInsideCount = 0;
        let retSubset = RECT_NOT;
        let subsetStartIndex = 0;
        for (let i = 0; i < part._boxset._SurfaceBoxes.length; ++i) {
            retSubset = this.isObjBoxInRect(part._boxset._SurfaceBoxes[i], mvpMat, rect2D);
            if (retSubset == RECT_ALL) {
                subInsideCount++;
            } else if (retSubset == RECT_NOT) {
                return false;
            } else {
                for (let j = 0; j < i; ++j) {
                    subsetStartIndex += part._arrSurfaceVertexNum[j];
                }
                if (this.isSurfaceInRect(part, subsetStartIndex, part._arrSurfaceVertexNum[i], mvpMat, rect2D)) {
                    subInsideCount++;
                } else {
                    return false;
                }
            }
        }

        if (subInsideCount == part._boxset._SurfaceBoxes.length) {
            return true;
        } else {
            return false;
        }
    }

    this.isSurfaceInRect = function(part, surfaceStartIndex, surfaceVertexCount, mvpMat, rect2D) {
        let slideCount = 0;
        if (part._uIsUV) {
            slideCount = VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
        } else {
            slideCount = NUM_VERTEX + NUM_VECTOR;
        }

        let tmpPt = new Point3(0, 0, 0);
        for (let i = 0; i < surfaceVertexCount; ++i) {
            let vertexIndex = (surfaceStartIndex + i) * slideCount;
            CalTranslatePoint(part._arrVertex[vertexIndex], part._arrVertex[vertexIndex + 1], part._arrVertex[vertexIndex + 2],
                mvpMat, tmpPt);
            if (!rect2D.isPointInside(tmpPt)) {
                return false;
            }
        }
        return true;
    }

    this.isObjBoxInRect = function(objBox, mvpMat, rect2D) {
        let tmpPt = new Point3(0, 0, 0);
        let insideCount = 0;
        for (let i = 0; i < objBox._Vertex.length; ++i) {
            CalTranslatePoint(objBox._Vertex[i].x, objBox._Vertex[i].y, objBox._Vertex[i].z,
                mvpMat, tmpPt);
            if (rect2D.isPointInside(tmpPt)) {
                insideCount++;
            }
        }
        if (insideCount == objBox._Vertex.length) {
            return RECT_ALL;
        } else if (insideCount == 0) {
            return RECT_NOT;
        } else {
            return RECT_PARTITION;
        }
    }
}