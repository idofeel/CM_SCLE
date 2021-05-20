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
const BG_VERTEX = DefaultData.FarPlane();
const GL_ZERO = 0.00001;

var VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
var STRIDE = (NUM_VERTEX + NUM_VECTOR + NUM_UV) * 4;

var SOLIDPROGRAMINFO = null;
var PICTUREPROGRAMINFO = null;
var LINEPROGRAMINFO = null;

var g_webglControl = new WebGLControl();

function WebGLControl() {
    // 显示控制开关
    this.isBackground = false;
    this.isSolid = false;
    this.isPicked = false;
    this.isShowBox = true;
    this.isHighlight = true;
    // GPU缓存数据
    this.m_arrObjectSurface_VAOs = new Array();
    this.m_arrObjectSurface_VBOs = new Array();
    this.m_arrObjectBox_VAOs = new Array();
    this.m_arrObjectBox_VBOs = new Array();
    this.m_bgIndex = 0;
    this.m_arrBgTexId = null;
    this.m_uBgVAO = -1;
    this.m_uBgVBO = -1;
    // 辅助显示数据，合并材质所需数据
    this.m_arrVAOVertexCounts = new Array();
    this.m_arrMaterialIndex = new Array();
    // 拾取所需显示数据
    this.m_arrBoxLines = new Array(BOX_DATA_COUNT);
    this.arrPickObjectIndexs = new Array();
    this.eMaterialPriority = GL_ORIGINAL;
    this.GL_PICKSTATUS = 0;
    // 用户交互所需数据：变换矩阵/透明度/显隐/材质设置
    this.m_arrObjectTransMode = new Array();
    this.m_arrObjectTransModeOrig = new Array();
    this.m_arrObjectMatrix = new Array();
    this.m_arrObjectTransparent = new Array();
    this.m_arrObjectVisiable = new Array();
    this.m_arrObjectMaterial = new Array();
    // 默认配置
    this.defaultMaterial = DefaultData.DefaultMaterial();
    this.defaultRed = DefaultData.Red();

    this.clearParams = function() {
        this.m_arrObjectSurface_VAOs.splice(0, this.m_arrObjectSurface_VAOs.length);
        this.m_arrObjectSurface_VBOs.splice(0, this.m_arrObjectSurface_VBOs.length);
        this.m_arrObjectBox_VAOs.splice(0, this.m_arrObjectBox_VAOs.length);
        this.m_arrObjectBox_VBOs.splice(0, this.m_arrObjectBox_VBOs.length);

        this.m_arrVAOVertexCounts.splice(0, this.m_arrVAOVertexCounts.length);
        this.m_arrMaterialIndex.splice(0, this.m_arrMaterialIndex.length);

        this.m_arrBoxLines.splice(0, this.m_arrBoxLines.length);
        this.arrPickObjectIndexs.splice(0, this.arrPickObjectIndexs.length);

        this.m_arrObjectTransMode.splice(0, this.m_arrObjectTransMode.length);
        this.m_arrObjectTransModeOrig.splice(0, this.m_arrObjectTransModeOrig.length);
        this.m_arrObjectMatrix.splice(0, this.m_arrObjectMatrix.length);
        this.m_arrObjectTransparent.splice(0, this.m_arrObjectTransparent.length);
        this.m_arrObjectVisiable.splice(0, this.m_arrObjectVisiable.length);
        this.m_arrObjectMaterial.splice(0, this.m_arrObjectMaterial.length);
    }

    this.GetObjectShowMaterial = function(objectIndex, surfaceIndex) {
        // 根据显示优先级做判断
        let curMaterial = null;
        let isObjectUnit = false;
        if (this.arrPickObjectIndexs[objectIndex] && this.isHighlight && this.m_arrObjectMaterial[objectIndex] != null) {
            switch (this.eMaterialPriority) {
                case GL_ORIGINAL:
                    break;
                case GL_USERPICKED:
                    curMaterial = this.defaultRed;
                    break;
                case GL_USERDEFINE:
                    curMaterial = this.m_arrObjectMaterial[objectIndex];
                    break;
            }
            isObjectUnit = true;
        } else if (this.arrPickObjectIndexs[objectIndex] && this.isHighlight) {
            curMaterial = this.defaultRed;
            isObjectUnit = true;
        } else if (this.m_arrObjectMaterial[objectIndex] != null) {
            curMaterial = this.m_arrObjectMaterial[objectIndex];
            isObjectUnit = true;
        }

        let materialIndex = this.m_arrMaterialIndex[objectIndex][surfaceIndex];
        if (!isObjectUnit) {
            if (this.m_arrMaterialIndex[objectIndex][surfaceIndex] == -1) {
                curMaterial = this.defaultMaterial;
            } else {
                curMaterial = g_GLMaterialSet._arrMaterialSet[materialIndex];
            }
        }

        return curMaterial == null ? this.defaultMaterial : curMaterial;
    }

    this.GetEqualFlags = function(uPartIndex, uObjectIndex, arrPartUsedFlag) {
        let uBeforeObjectIndex = -1;
        let isEqualToBefore = false;
        if (arrPartUsedFlag[uPartIndex].length > 0) {
            for (let j=0; j<arrPartUsedFlag[uPartIndex].length; j++) {
                uBeforeObjectIndex = arrPartUsedFlag[uPartIndex][j];
                // 判断俩Object是否完全相同
                if (this.m_arrMaterialIndex[uObjectIndex].length == this.m_arrMaterialIndex[uBeforeObjectIndex].length) {
                    let k = 0;
                    for (; k<this.m_arrMaterialIndex[uObjectIndex].length; k++) {
                        if (this.m_arrMaterialIndex[uObjectIndex][k] != this.m_arrMaterialIndex[uBeforeObjectIndex][k]) {
                            break;
                        }
                    }
                    if (k == this.m_arrMaterialIndex[uObjectIndex].length) {
                        isEqualToBefore = true;
                    }   
                }
            }
            if (!isEqualToBefore) {
                arrPartUsedFlag[uPartIndex].push(uObjectIndex);
            } 
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
        if (g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
            VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
        } else {
            VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR;
        }
    }
    this.setVertexStride = function(uPartIndex) {
        if (g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
            STRIDE = (NUM_VERTEX + NUM_VECTOR + NUM_UV) * 4;
        } else {
            STRIDE = (NUM_VERTEX + NUM_VECTOR) * 4;
        }
    }
}


function WebGL1() {
    SOLIDPROGRAMINFO = initSolidProgramInfo(gl);
    PICTUREPROGRAMINFO = initPictureProgramInfo(gl);
    LINEPROGRAMINFO = initLineProgramInfo(gl);

    this.PVMattrix = mat4.create();
    this.MVPMatrix = mat4.create();

    this.initScene = function() {
        this.setBgVBO_webgl1();
        this.setBoxVBO_webgl1();
        this.setVertexVBO_webgl1();
        this.initGLConfig();
    }

    this.uninitScene = function() {
        this.clearVertexVBO_webgl1();
        this.clearBgVBO_webgl1();
        this.clearBoxVBO_webgl1();
        this.clearTextures();
    }

    this.resetScene = function() {
        this.setBoxVBO_webgl1();
        this.setVertexVBO_webgl1();
    }

    this.clearScene = function() {
        this.clearVertexVBO_webgl1();
        this.clearBoxVBO_webgl1();
        this.clearTextures();
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

    /**
     * 绘制图形
     */
    this.draw = function(camera) {
        // Clear the canvas before we start drawing on it.
        gl.clearColor(0.313, 0.357, 0.467, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 绘制背景图片
        gl.useProgram(PICTUREPROGRAMINFO.program);
        this.drawBackground_webgl1();

        gl.useProgram(SOLIDPROGRAMINFO.program);
        mat4.multiply(this.PVMattrix, camera.projectionMatrix, camera.viewMatrix);
        this.drawObjectArray_webgl1(camera);
        
        // 绘制零件实例包围盒
        gl.useProgram(LINEPROGRAMINFO.program);
        if (g_webglControl.isPicked && g_webglControl.isShowBox) {
            this.drawBox_webgl1();
        }
    }

    this.drawObjectArray_webgl1 = function(camera) {
        gl.uniform3f(SOLIDPROGRAMINFO.uniformLocations.eyeLocation, camera.eye.x, camera.eye.y, camera.eye.z);
        // 绘制全不透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_NO) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
        // 绘制部分透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_PART) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
        // 绘制全透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_ALL) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
    }

    this.drawObjectTriangles_webgl1 = function(objectIndex) {
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
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        g_webglControl.setVertexStride(uCurPartIndex);
        // 正向面定义模式
        if (g_GLObjectSet._arrObjectSet[objectIndex]._nCullMode == ADFCULL_NONE) {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
        }
        // 同一个object矩阵相同
        mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        // 同一个Object的不同Surface材质不同
        for (let j = 0; j < g_webglControl.m_arrObjectSurface_VBOs[objectIndex].length; j++) {
            // 材质数据
            let curMaterial = g_webglControl.GetObjectShowMaterial(objectIndex, j);
            gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialDiffuse,
                curMaterial._mtlPhysics.vDiffuse.x,
                curMaterial._mtlPhysics.vDiffuse.y,
                curMaterial._mtlPhysics.vDiffuse.z,
                curMaterial._mtlPhysics.vDiffuse.w);
            gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialAmbient,
                curMaterial._mtlPhysics.vAmbient.x,
                curMaterial._mtlPhysics.vAmbient.y,
                curMaterial._mtlPhysics.vAmbient.z,
                curMaterial._mtlPhysics.vAmbient.w);
            gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialSpecular,
                curMaterial._mtlPhysics.vSpecular.x,
                curMaterial._mtlPhysics.vSpecular.y,
                curMaterial._mtlPhysics.vSpecular.z,
                curMaterial._mtlPhysics.vSpecular.w);
            gl.uniform1f(SOLIDPROGRAMINFO.uniformLocations.power, curMaterial._mtlPhysics.fPower);
            gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialEmissive,
                curMaterial._mtlPhysics.vEmissive.x,
                curMaterial._mtlPhysics.vEmissive.y,
                curMaterial._mtlPhysics.vEmissive.z,
                curMaterial._mtlPhysics.vEmissive.w * objectTrans);
            if (curMaterial._eMtlType == ADFMTLTYPE_PHYSICS) {
                // 自然材质
                gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 0);
            } else if (curMaterial._eMtlType == ADFMTLTYPE_PICTURE) {
                if (curMaterial._arrTexID[0] instanceof WebGLTexture) {
                    // 贴图材质
                    gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 1);
                    // 设置贴图
                    gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.textureUnit, 0);
                    gl.bindTexture(gl.TEXTURE_2D, curMaterial._arrTexID[0]);
                } else {
                    gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 0);
                }
            } else {
                // 纯色材质
                gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 2);
                // 设置纯色
                if (curMaterial._arrData.length > 0) {
                    gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.pureColor, 
                        curMaterial._arrData[0].x,
                        curMaterial._arrData[0].y,
                        curMaterial._arrData[0].z,
                        curMaterial._arrData[0].w * objectTrans);
                }
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrObjectSurface_VBOs[objectIndex][j]);
            gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, STRIDE, 0);
            gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexPosition);
            gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexVector, NUM_VECTOR, gl.FLOAT, false, STRIDE, NUM_VERTEX*4);
            gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexVector);
            if (g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._uIsUV == 1) {
                gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexUV, NUM_UV, gl.FLOAT, false, STRIDE, (NUM_VERTEX+NUM_VECTOR)*4);
                gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexUV);
            } else {
                gl.disableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexUV);
            }
            gl.drawArrays(gl.TRIANGLES, 0, g_webglControl.m_arrVAOVertexCounts[objectIndex][j]);
        }
    }

    this.drawObjectLines_webgl1 = function(objectIndex) {
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(LINEPROGRAMINFO.program);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        let materialIndex = g_webglControl.m_arrMaterialIndex[objectIndex][0];
        let uCurPartIndex = g_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        g_webglControl.setVertexStride(uCurPartIndex);
        let curMaterial = null;
        if (materialIndex == -1) {
            curMaterial = this.defaultMaterial;
        } else {
            curMaterial = g_GLMaterialSet._arrMaterialSet[materialIndex];
        }
        gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor,
                    curMaterial._mtlPhysics.vEmissive.x,
                    curMaterial._mtlPhysics.vEmissive.y,
                    curMaterial._mtlPhysics.vEmissive.z);
        gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrObjectSurface_VBOs[objectIndex][0]);
        gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, STRIDE, 0);
        gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
        gl.drawArrays(gl.LINES, 0, g_webglControl.m_arrVAOVertexCounts[objectIndex][0]);
    }

    this.drawBox_webgl1 = function() {
        for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[i]);
                gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
                gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 1.0, 1.0, 0.0);
                let nPickPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                gl.bindBuffer(gl.ARRAY_BUFFER, g_webglControl.m_arrObjectBox_VBOs[nPickPartIndex]);
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

    this.setBgVBO_webgl1 = function() {
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

    this.setBoxVBO_webgl1 = function() {
        // 创建包围盒VAO缓存
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            let nVBOId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
            // 建立显存缓存
            g_webglControl.setBoxLines(i);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_webglControl.m_arrBoxLines), gl.STATIC_DRAW);
            g_webglControl.m_arrObjectBox_VBOs.push(nVBOId);
        }
    }

    this.clearBoxVBO_webgl1 = function() {
        for (let i = 0; i < g_webglControl.m_arrObjectBox_VBOs.length; i++) {
            gl.deleteBuffer(g_webglControl.m_arrObjectBox_VBOs[i]);
        }
    }

    this.setVertexVBO_webgl1 = function() {
        // 创建零件VAO缓存
        let arrPartUsedFlag = new Array(g_GLPartSet._arrPartSet.length);
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            arrPartUsedFlag[i] = new Array();
        }
        for (let i = 0; i < g_webglControl.m_arrMaterialIndex.length; i++) {
            let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            let equalFlags = g_webglControl.GetEqualFlags(uCurPartIndex, i, arrPartUsedFlag);
            let uBeforeObjectIndex = equalFlags.EqualBeforeIndex;
            let isEqualToBefore = equalFlags.EqualBeforeFlag;

            let arrSurfaceVBOs = new Array();
            g_webglControl.setVertexDataNum(uCurPartIndex);
            if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                // 创建曲面零件VAO缓存
                if (!isEqualToBefore) {
                    let offset = 0;
                    for (let j = 0; j < g_webglControl.m_arrMaterialIndex[i].length; j++) {
                        // 创建一个VBO
                        let buffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                        let subData = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.subarray(
                            offset, offset+g_webglControl.m_arrVAOVertexCounts[i][j]*VERTEX_DATA_COUNT);
                        gl.bufferData(gl.ARRAY_BUFFER, subData, gl.STATIC_DRAW);
                        // 存值
                        arrSurfaceVBOs.push(buffer);
                        offset += g_webglControl.m_arrVAOVertexCounts[i][j]*VERTEX_DATA_COUNT;
                    }
                } else {
                    for (let j = 0; j < g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex].length; j++) {
                        arrSurfaceVBOs.push(g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex][j]);
                    }
                }
            } else {
                // 创建线缆数据VAO缓存
                if (!isEqualToBefore) {
                    // 创建一个VBO
                    let buffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    let subData = g_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.subarray(
                        0, g_webglControl.m_arrVAOVertexCounts[i][0]*VERTEX_DATA_COUNT);
                    gl.bufferData(gl.ARRAY_BUFFER, subData, gl.STATIC_DRAW);
                    // 存值
                    arrSurfaceVBOs.push(buffer);
                } else {
                    arrSurfaceVBOs.push(g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex][0]);
                }
            }
            g_webglControl.m_arrObjectSurface_VBOs.push(arrSurfaceVBOs);
        }
        // 解除绑定
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    this.clearVertexVBO_webgl1 = function() {
        // 清除顶点缓存数据
        for (let i = 0; i < g_webglControl.m_arrObjectSurface_VBOs.length; i++) {
            for (let j = 0; j < g_webglControl.m_arrObjectSurface_VBOs[i].length; j++) {
                gl.deleteBuffer(g_webglControl.m_arrObjectSurface_VBOs[i][j]);
            }
        }
    }

    this.clearTextures = function() {
        // 清除贴图缓存数据
        for (let i = 0; i < g_GLMaterialSet._arrMaterialSet.length; i++) {
            if (g_GLMaterialSet._arrMaterialSet[i]._eMtlType == ADFMTLTYPE_PICTURE) {
                if (g_GLMaterialSet._arrMaterialSet[i]._arrTexID[0] instanceof WebGLTexture) {
                    gl.deleteTexture(g_GLMaterialSet._arrMaterialSet[i]._arrTexID[0]);
                }
            }
        }
    }
}

function WebGL2() {
    SOLIDPROGRAMINFO = initSolidProgramInfo(gl);
    PICTUREPROGRAMINFO = initPictureProgramInfo(gl);
    LINEPROGRAMINFO = initLineProgramInfo(gl);

    this.PVMattrix = mat4.create();
    this.MVPMatrix = mat4.create();

    this.initScene = function() {
        this.setBgVAO();
        this.setBoxVAO();
        this.setVertexVAO();
        this.initGLConfig();
    }

    this.uninitScene = function() {
        this.clearVertexVAOs();
        this.clearBoxVAO();
        this.clearBgVAO();
        this.clearTextures();
    }

    this.resetScene = function() {
        this.setBoxVAO();
        this.setVertexVAO();
    }

    this.clearScene = function() {
        this.clearVertexVAOs();
        this.clearBoxVAO();
        this.clearTextures();
    }

    /**
     * 初始化窗口视图，窗口变化后调用
     */
     this.initViewPort = function(width, height, camera) {
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
        gl.lineWidth(3.0);
    }

    /**
     * 绘制图形
     */
     this.draw = function(camera) {
        // Clear the canvas before we start drawing on it.
        gl.clearColor(0.313, 0.357, 0.467, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 绘制背景图片
        gl.useProgram(PICTUREPROGRAMINFO.program);
        this.drawBackground();

        gl.useProgram(SOLIDPROGRAMINFO.program);
        mat4.multiply(this.PVMattrix, camera.projectionMatrix, camera.viewMatrix);
        this.drawObjectArray(camera);
        
        // 绘制零件实例包围盒
        gl.useProgram(LINEPROGRAMINFO.program);
        if (g_webglControl.isPicked && g_webglControl.isShowBox) {
            this.drawBox();
        }
    }

    this.drawObjectArray = function(camera) {
        gl.uniform3f(SOLIDPROGRAMINFO.uniformLocations.eyeLocation, camera.eye.x, camera.eye.y, camera.eye.z);
        // 绘制全不透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_NO) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
        // 绘制部分透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_PART) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
        // 绘制全透明物体
        for (let i = 0; i < g_GLObjectSet._arrObjectSet.length; i++) {
            if (g_webglControl.m_arrObjectTransMode[i] == GLTRANS_ALL) {
                if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
    }

    /**
     * 绘制零件实例
     */
    this.drawObjectTriangles = function(objectIndex) {
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(SOLIDPROGRAMINFO.program);
        // 获取Object透明度
        let objectTrans = g_webglControl.m_arrObjectTransparent[objectIndex];
        if (objectTrans <= GL_ZERO) {
            return;
        }
        // 正向面定义模式
        if (g_GLObjectSet._arrObjectSet[objectIndex]._nCullMode == ADFCULL_NONE) {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
        }
        // 同一个object矩阵相同
        mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(SOLIDPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        // 同一个Object的不同Surface材质不同
        for (let j = 0; j < g_webglControl.m_arrObjectSurface_VAOs[objectIndex].length; j++) {
            // 材质数据
            let curMaterial = g_webglControl.GetObjectShowMaterial(objectIndex, j);
            gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialDiffuse,
                curMaterial._mtlPhysics.vDiffuse.x,
                curMaterial._mtlPhysics.vDiffuse.y,
                curMaterial._mtlPhysics.vDiffuse.z,
                curMaterial._mtlPhysics.vDiffuse.w);
            gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialAmbient,
                curMaterial._mtlPhysics.vAmbient.x,
                curMaterial._mtlPhysics.vAmbient.y,
                curMaterial._mtlPhysics.vAmbient.z,
                curMaterial._mtlPhysics.vAmbient.w);
            gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialSpecular,
                curMaterial._mtlPhysics.vSpecular.x,
                curMaterial._mtlPhysics.vSpecular.y,
                curMaterial._mtlPhysics.vSpecular.z,
                curMaterial._mtlPhysics.vSpecular.w);
            gl.uniform1f(SOLIDPROGRAMINFO.uniformLocations.power, curMaterial._mtlPhysics.fPower);
            gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.materialEmissive,
                curMaterial._mtlPhysics.vEmissive.x,
                curMaterial._mtlPhysics.vEmissive.y,
                curMaterial._mtlPhysics.vEmissive.z,
                curMaterial._mtlPhysics.vEmissive.w * objectTrans);
            if (curMaterial._eMtlType == ADFMTLTYPE_PHYSICS) {
                // 自然材质
                gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 0);
            } else if (curMaterial._eMtlType == ADFMTLTYPE_PICTURE) {
                if (curMaterial._arrTexID[0] instanceof WebGLTexture) {
                    // 贴图材质
                    gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 1);
                    // 设置贴图
                    gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.textureUnit, 0);
                    gl.bindTexture(gl.TEXTURE_2D, curMaterial._arrTexID[0]);
                } else {
                    gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 0);
                }
            } else {
                // 纯色材质
                gl.uniform1i(SOLIDPROGRAMINFO.uniformLocations.fragmentTex, 2);
                // 设置纯色
                if (curMaterial._arrData.length > 0) {
                    gl.uniform4f(SOLIDPROGRAMINFO.uniformLocations.pureColor, 
                        curMaterial._arrData[0].x,
                        curMaterial._arrData[0].y,
                        curMaterial._arrData[0].z,
                        curMaterial._arrData[0].w * objectTrans);
                }
            }
            gl.bindVertexArray(g_webglControl.m_arrObjectSurface_VAOs[objectIndex][j]);
            gl.drawArrays(gl.TRIANGLES, 0, g_webglControl.m_arrVAOVertexCounts[objectIndex][j]);
        }
    }

    this.drawObjectLines = function(objectIndex) {
        // 判断是否可见
        if (!g_webglControl.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(LINEPROGRAMINFO.program);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        let materialIndex = g_webglControl.m_arrMaterialIndex[objectIndex][0];
        let curMaterial = null;
        if (materialIndex == -1) {
            curMaterial = this.defaultMaterial;
        } else {
            curMaterial = g_GLMaterialSet._arrMaterialSet[materialIndex];
        }
        gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor,
                    curMaterial._mtlPhysics.vEmissive.x,
                    curMaterial._mtlPhysics.vEmissive.y,
                    curMaterial._mtlPhysics.vEmissive.z);
        gl.bindVertexArray(g_webglControl.m_arrObjectSurface_VAOs[objectIndex][0]);
        gl.drawArrays(gl.LINES, 0, g_webglControl.m_arrVAOVertexCounts[objectIndex][0]);
    }

    this.drawBox = function() {
        for (let i = 0; i < g_webglControl.arrPickObjectIndexs.length; i++) {
            if (g_webglControl.arrPickObjectIndexs[i]) {
                mat4.multiply(this.MVPMatrix, this.PVMattrix, g_webglControl.m_arrObjectMatrix[i]);
                gl.uniformMatrix4fv(LINEPROGRAMINFO.uniformLocations.MVPMatrix, false, this.MVPMatrix);
                gl.uniform3f(LINEPROGRAMINFO.uniformLocations.lineColor, 1.0, 1.0, 0.0);
                let nPickPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
                gl.bindVertexArray(g_webglControl.m_arrObjectBox_VAOs[nPickPartIndex]);
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
         * 生成GPU缓存数据
         */
    this.setVertexVAO = function() {
        // 创建零件VAO缓存
        let arrPartUsedFlag = new Array(g_GLPartSet._arrPartSet.length);
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            arrPartUsedFlag[i] = new Array();
        }
        for (let i = 0; i < g_webglControl.m_arrMaterialIndex.length; i++) {
            let uCurPartIndex = g_GLObjectSet._arrObjectSet[i]._uPartIndex;
            let equalFlags = g_webglControl.GetEqualFlags(uCurPartIndex, i, arrPartUsedFlag);
            let uBeforeObjectIndex = equalFlags.EqualBeforeIndex;
            let isEqualToBefore = equalFlags.EqualBeforeFlag;

            let arrSurfaceVAOs = new Array();
            let arrSurfaceVBOs = new Array();
            if (g_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                // 创建曲面零件VAO缓存
                if (!isEqualToBefore) {
                    this.setSubsetSurfaceVAO(uCurPartIndex, i, arrSurfaceVAOs, arrSurfaceVBOs);
                } else {
                    for (let j = 0; j < g_webglControl.m_arrObjectSurface_VAOs[uBeforeObjectIndex].length; j++) {
                        arrSurfaceVAOs.push(g_webglControl.m_arrObjectSurface_VAOs[uBeforeObjectIndex][j]);
                    }
                    for (let j = 0; j < g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex].length; j++) {
                        arrSurfaceVBOs.push(g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex][j]);
                    }
                }
            } else {
                // 创建线缆数据VAO缓存
                if (!isEqualToBefore) {
                    this.setSubsetCurveVAO(uCurPartIndex, i, arrSurfaceVAOs, arrSurfaceVBOs);
                } else {
                    arrSurfaceVAOs.push(g_webglControl.m_arrObjectSurface_VAOs[uBeforeObjectIndex][0]);
                    arrSurfaceVBOs.push(g_webglControl.m_arrObjectSurface_VBOs[uBeforeObjectIndex][0]);
                }
            }
            g_webglControl.m_arrObjectSurface_VAOs.push(arrSurfaceVAOs);
            g_webglControl.m_arrObjectSurface_VBOs.push(arrSurfaceVBOs);
        }
        // 解除绑定
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    this.clearVertexVAOs = function() {
        // 清除顶点缓存数据
        for (let i = 0; i < g_webglControl.m_arrObjectSurface_VAOs.length; i++) {
            for (let j = 0; j < g_webglControl.m_arrObjectSurface_VAOs[i].length; j++) {
                gl.deleteVertexArray(g_webglControl.m_arrObjectSurface_VAOs[i][j]);
            }
        }

        for (let i = 0; i < g_webglControl.m_arrObjectSurface_VBOs.length; i++) {
            for (let j = 0; j < g_webglControl.m_arrObjectSurface_VBOs[i].length; j++) {
                gl.deleteBuffer(g_webglControl.m_arrObjectSurface_VBOs[i][j]);
            }
        }
    }

    this.setBgVAO = function() {
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

    this.setBoxVAO = function() {
        // 创建包围盒VAO缓存
        for (let i = 0; i < g_GLPartSet._arrPartSet.length; i++) {
            let nVAOId = -1;
            nVAOId = gl.createVertexArray();
            gl.bindVertexArray(nVAOId);
            let nVBOId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
            // 建立显存缓存
            g_webglControl.setBoxLines(i);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_webglControl.m_arrBoxLines), gl.STATIC_DRAW);
            gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, NUM_VERTEX*4, 0);
            gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
            g_webglControl.m_arrObjectBox_VBOs.push(nVBOId);
            g_webglControl.m_arrObjectBox_VAOs.push(nVAOId);
        }
    }

    this.clearBoxVAO = function() {
        for (let i = 0; i < g_webglControl.m_arrObjectBox_VAOs.length; i++) {
            gl.deleteVertexArray(g_webglControl.m_arrObjectBox_VAOs[i]);
        }

        for (let i = 0; i < g_webglControl.m_arrObjectBox_VBOs.length; i++) {
            gl.deleteBuffer(g_webglControl.m_arrObjectBox_VBOs[i]);
        }
    }

    this.setSubsetSurfaceVAO = function(uPartIndex, uObjectIndex, arrSurfaceVAOs, arrSurfaceVBOs) {
        g_webglControl.setVertexDataNum(uPartIndex);
        g_webglControl.setVertexStride(uPartIndex);
        // 创建曲面VAO缓存
        let offset = 0;
        for (let j = 0; j< g_webglControl.m_arrMaterialIndex[uObjectIndex].length; j++) {
            // 创建一个VAO
            let VAOArray = -1;
            VAOArray = gl.createVertexArray();
            gl.bindVertexArray(VAOArray);
            // 创建一个VBO
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, g_webglControl.m_arrVAOVertexCounts[uObjectIndex][j]*STRIDE, gl.STATIC_DRAW);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex,
                            offset, g_webglControl.m_arrVAOVertexCounts[uObjectIndex][j]*VERTEX_DATA_COUNT);
            // 绑定缓存区数据
            gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, STRIDE, 0);
            gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexPosition);
            gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexVector, NUM_VECTOR, gl.FLOAT, false, STRIDE, NUM_VERTEX*4);
            gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexVector);
            if (g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
                gl.vertexAttribPointer(SOLIDPROGRAMINFO.attribLocations.vertexUV, NUM_UV, gl.FLOAT, false, STRIDE, (NUM_VERTEX+NUM_VECTOR)*4);
                gl.enableVertexAttribArray(SOLIDPROGRAMINFO.attribLocations.vertexUV);
            }
            // 存值
            arrSurfaceVBOs.push(buffer);
            arrSurfaceVAOs.push(VAOArray);
            offset += g_webglControl.m_arrVAOVertexCounts[uObjectIndex][j]*VERTEX_DATA_COUNT;
        }
    }

    this.setSubsetCurveVAO = function(uPartIndex, uObjectIndex, arrSurfaceVAOs, arrSurfaceVBOs) {
        g_webglControl.setVertexDataNum(uPartIndex);
        g_webglControl.setVertexStride(uPartIndex);
        // 创建一个VAO
        let VAOArray = -1;
        VAOArray = gl.createVertexArray();
        gl.bindVertexArray(VAOArray);
        // 创建一个VBO
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.m_arrVAOVertexCounts[uObjectIndex][0]*STRIDE, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, g_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex,
                        0, g_webglControl.m_arrVAOVertexCounts[uObjectIndex][0]*VERTEX_DATA_COUNT);
        // 绑定缓存区数据
        gl.vertexAttribPointer(LINEPROGRAMINFO.attribLocations.vertexPosition, NUM_VERTEX, gl.FLOAT, false, STRIDE, 0);
        gl.enableVertexAttribArray(LINEPROGRAMINFO.attribLocations.vertexPosition);
        // 存值
        arrSurfaceVBOs.push(buffer);
        arrSurfaceVAOs.push(VAOArray);
    }

    this.clearTextures = function() {
        // 清除贴图缓存数据
        for (let i = 0; i < g_GLMaterialSet._arrMaterialSet.length; i++) {
            if (g_GLMaterialSet._arrMaterialSet[i]._eMtlType == ADFMTLTYPE_PICTURE) {
                if (g_GLMaterialSet._arrMaterialSet[i]._arrTexID[0] instanceof WebGLTexture) {
                    gl.deleteTexture(g_GLMaterialSet._arrMaterialSet[i]._arrTexID[0]);
                }
            }
        }
    }
}
