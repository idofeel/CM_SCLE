// File: GLProgram.js

/**
 * @author wujiali
 */
 
//===================================================================================================

function GLProgram() {
    const NUM_VERTEX = 3;
    const NUM_VECTOR = 3;
    const NUM_UV = 2;
    const TYPE = gl.FLOAT;
    const NORMALIZE = false;
    const BOX_LINEVERTEX_COUNT = 48;
    const BOX_DATA_COUNT = BOX_LINEVERTEX_COUNT * NUM_VERTEX;
    const BG_VERTEX = DefaultData.FarPlane();
    const GL_ZERO = 0.00001;

    this.VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
    this.STRIDE = (NUM_VERTEX + NUM_VECTOR + NUM_UV) * 4;

    this.solidProgramInfo = initSolidProgramInfo(gl);
    this.pictureProgramInfo = initPictureProgramInfo(gl);
    this.lineProgramInfo = initLineProgramInfo(gl);

    this.m_GLObjectSet = null;
    this.m_GLPartSet = null;
    this.m_GLMaterialSet = null;
    this.m_GLAnnoSet = null;
    // 显示控制开关
    this.isBackground = false;
    this.isSolid = false;
    this.isPicked = false;
    this.isShowBox = true;
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
    this.m_arrPartSurfaceIndex = new Array();
    this.arrPickObjectIndexs = new Array();
    this.arrPickAnnotIndexs = new Array();
    this.eMaterialPriority = GL_USERPICKED;
    this.GL_PICKSTATUS = 0;
    this.GL_PICKSTATUSANNO = 0;
    // 用户交互所需数据：变换矩阵/透明度/显隐/材质设置
    this.m_arrObjectTransMode = new Array();
    this.m_arrObjectTransModeOrig = new Array();
    this.m_arrObjectMatrix = new Array();
    this.m_arrObjectTransparent = new Array();
    this.m_arrObjectVisiable = new Array();
    this.m_arrObjectMaterial = new Array();
    this.m_arrAnnotVisiable = new Array();
    this.m_arrAnnotRect = new Array();
    // 动画模式所需的参数
    this.isAnimationMode = false;
    this.uCurFrame = 0;
    // 渲染过程计算所需数据，置为全局变量，能减小内存
    this.PVMattrix = mat4.create();
    this.MVPMatrix = mat4.create();
    this.windowWidth = 0;
    this.windowHeight = 0;
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
    this.annotPropertyInfo = "";        // 注释属性信息
    this.annotTextFont = 20;            // 注释文本字号
    this.annotPropGap = 3;              // 注释属性框与注释间隙
    this.annotPropTextFont = 10;        // 注释属性文本字号
    this.annotPropRectWidth = 180;      // 注释属性框宽
    this.annotPropRectHeight = 40;      // 注释属性框高
    this.annotPropTextLineHeight = 5;   // 注释属性框内行距
    this.annotDire = 1;                 // 注释文字底线方向，临时变量
    this.annotTextLength = 0;           // 注释文字总长度，临时变量
    this.isOutWindow = false;           // 注释文字是否超出界限，临时变量

    /**
     * 渲染前初始化数据
     */
    this.initGLData = function() {
        if (this.m_GLObjectSet != null) {
            this.initGLConfig();
            this.setUniteMaterial();
            if (isWebgl2) {
                this.setVAOs();
            } else {
                this.setVBOs_webgl1();
            }
            this.setObjectModelMat();
            this.setObjectTransparent();
            this.setObjectVisible();
            this.setObjectMaterial();
            this.setSubsetIndex();
            this.setPickIndexs();
            this.setAnnotVisible();
            this.setPickAnnotIndexs();
        }
    }

    /**
     * 初始化窗口视图，窗口变化后调用
     */
    this.initViewPort = function(width, height, camera) {
        this.windowWidth = width; this.windowHeight = height;
        this.aspect = width / height;
        gl.viewport(0, 0, width, height);
        if (this.m_GLAnnoSet != null || this.m_GLAnnoSet._arrComment.length > 0) {
            this.setAnnotRect(camera);
        }
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
        if (isWebgl2) {
            gl.lineWidth(3.0);
        }
        // 设置注释样式
        if (gl2d != null) {
            gl2d.font = "20px 微软雅黑";
            gl2d.textBaseline = "bottom"
            gl2d.fillStyle = "#000000";
            gl2d.strokeStyle = "#000000";
            gl2d.lineWidth = 1;
        }
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
        gl.useProgram(this.pictureProgramInfo.program);
        if (isWebgl2) {
            this.drawBackground();
        } else {
            this.drawBackground_webgl1();
        }

        gl.useProgram(this.solidProgramInfo.program);
        mat4.multiply(this.PVMattrix, camera.projectionMatrix, camera.viewMatrix);
        if (isWebgl2) {
            this.drawObjectArray(camera);
        } else {
            this.drawObjectArray_webgl1(camera);
        }
        
        // 绘制零件实例包围盒
        gl.useProgram(this.lineProgramInfo.program);
        if (this.isPicked) {
            if (isWebgl2) {
                this.drawBox();
            } else {
                this.drawBox_webgl1();
            }
        }

        // 绘制标注数据
        if (gl2d != null) {
            this.drawAnnotation2D();
        }
    }

    this.drawObjectArray = function(camera) {
        camera.getEyeLoc(this.eyeLocation);
        gl.uniform3f(this.solidProgramInfo.uniformLocations.eyeLocation, this.eyeLocation.x, this.eyeLocation.y, this.eyeLocation.z);
        // 绘制全不透明物体
        for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
            if (this.m_arrObjectTransMode[i] == GLTRANS_NO) {
                if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
        // 绘制部分透明物体
        for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
            if (this.m_arrObjectTransMode[i] == GLTRANS_PART) {
                if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
        // 绘制全透明物体
        for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
            if (this.m_arrObjectTransMode[i] == GLTRANS_ALL) {
                if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles(i);
                } else if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines(i);
                }
            }
        }
    }

    this.drawObjectArray_webgl1 = function(camera) {
        camera.getEyeLoc(this.eyeLocation);
        gl.uniform3f(this.solidProgramInfo.uniformLocations.eyeLocation, this.eyeLocation.x, this.eyeLocation.y, this.eyeLocation.z);
        // 绘制全不透明物体
        for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
            if (this.m_arrObjectTransMode[i] == GLTRANS_NO) {
                if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
        // 绘制部分透明物体
        for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
            if (this.m_arrObjectTransMode[i] == GLTRANS_PART) {
                if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
        // 绘制全透明物体
        for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
            if (this.m_arrObjectTransMode[i] == GLTRANS_ALL) {
                if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                    this.drawObjectTriangles_webgl1(i);
                } else if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST){
                    this.drawObjectLines_webgl1(i);
                }
            }
        }
    }

    /**
     * 绘制零件实例
     */
    this.drawObjectTriangles = function(objectIndex) {
        // 判断是否可见
        if (!this.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(this.solidProgramInfo.program);
        // 获取Object透明度
        let objectTrans = this.m_arrObjectTransparent[objectIndex];
        if (objectTrans <= GL_ZERO) {
            return;
        }
        // 正向面定义模式
        if (this.m_GLObjectSet._arrObjectSet[objectIndex]._nCullMode == ADFCULL_NONE) {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
        }
        // 同一个object矩阵相同
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(this.solidProgramInfo.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        // 同一个Object的不同Surface材质不同
        let ObjectShowMaterial = this.GetObjectShowMaterial(objectIndex);
        let curMaterial = ObjectShowMaterial.UserMaterial;
        let isObjectUnit = ObjectShowMaterial.UserUnitFlag;
        for (let j=0; j<this.m_arrObjectSurface_VAOs[objectIndex].length; j++) {
            // 材质数据
            let materialIndex = this.m_arrMaterialIndex[objectIndex][j];
            if (!isObjectUnit) {
                if (this.m_arrMaterialIndex[objectIndex][j] == -1) {
                    curMaterial = this.defaultMaterial;
                } else {
                    curMaterial = this.m_GLMaterialSet._arrMaterialSet[materialIndex];
                }
            }

            if (curMaterial == null) {
                curMaterial = this.defaultMaterial;
            }
            
            gl.uniform4f(this.solidProgramInfo.uniformLocations.materialDiffuse,
                curMaterial._mtlPhysics.vDiffuse.x,
                curMaterial._mtlPhysics.vDiffuse.y,
                curMaterial._mtlPhysics.vDiffuse.z,
                curMaterial._mtlPhysics.vDiffuse.w);
            gl.uniform4f(this.solidProgramInfo.uniformLocations.materialAmbient,
                curMaterial._mtlPhysics.vAmbient.x,
                curMaterial._mtlPhysics.vAmbient.y,
                curMaterial._mtlPhysics.vAmbient.z,
                curMaterial._mtlPhysics.vAmbient.w);
            gl.uniform4f(this.solidProgramInfo.uniformLocations.materialSpecular,
                curMaterial._mtlPhysics.vSpecular.x,
                curMaterial._mtlPhysics.vSpecular.y,
                curMaterial._mtlPhysics.vSpecular.z,
                curMaterial._mtlPhysics.vSpecular.w);
            gl.uniform1f(this.solidProgramInfo.uniformLocations.power, curMaterial._mtlPhysics.fPower);
            gl.uniform4f(this.solidProgramInfo.uniformLocations.materialEmissive,
                curMaterial._mtlPhysics.vEmissive.x,
                curMaterial._mtlPhysics.vEmissive.y,
                curMaterial._mtlPhysics.vEmissive.z,
                curMaterial._mtlPhysics.vEmissive.w * objectTrans);
            if (curMaterial._eMtlType == ADFMTLTYPE_PHYSICS) {
                // 自然材质
                gl.uniform1i(this.solidProgramInfo.uniformLocations.fragmentTex, 0);
            } else if (curMaterial._eMtlType == ADFMTLTYPE_PICTURE) {
                if (curMaterial._arrTexID[0] instanceof WebGLTexture) {
                    // 贴图材质
                    gl.uniform1i(this.solidProgramInfo.uniformLocations.fragmentTex, 1);
                    // 设置贴图
                    gl.uniform1i(this.solidProgramInfo.uniformLocations.textureUnit, 0);
                    gl.bindTexture(gl.TEXTURE_2D, curMaterial._arrTexID[0]);
                } else {
                    gl.uniform1i(this.solidProgramInfo.uniformLocations.fragmentTex, 0);
                }
            } else {
                // 纯色材质
                gl.uniform1i(this.solidProgramInfo.uniformLocations.fragmentTex, 2);
                // 设置纯色
                if (curMaterial._arrData.length > 0) {
                    gl.uniform4f(this.solidProgramInfo.uniformLocations.pureColor, 
                        curMaterial._arrData[0].x,
                        curMaterial._arrData[0].y,
                        curMaterial._arrData[0].z,
                        curMaterial._arrData[0].w * objectTrans);
                }
            }
            gl.bindVertexArray(this.m_arrObjectSurface_VAOs[objectIndex][j]);
            gl.drawArrays(gl.TRIANGLES, 0, this.m_arrVAOVertexCounts[objectIndex][j]);
        }
    }

    this.drawObjectLines = function(objectIndex) {
        // 判断是否可见
        if (!this.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(this.lineProgramInfo.program);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(this.lineProgramInfo.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        let materialIndex = this.m_arrMaterialIndex[objectIndex][0];
        let curMaterial = null;
        if (materialIndex == -1) {
            curMaterial = this.defaultMaterial;
        } else {
            curMaterial = this.m_GLMaterialSet._arrMaterialSet[materialIndex];
        }
        gl.uniform3f(this.lineProgramInfo.uniformLocations.lineColor,
                    curMaterial._mtlPhysics.vEmissive.x,
                    curMaterial._mtlPhysics.vEmissive.y,
                    curMaterial._mtlPhysics.vEmissive.z);
        gl.bindVertexArray(this.m_arrObjectSurface_VAOs[objectIndex][0]);
        gl.drawArrays(gl.LINES, 0, this.m_arrVAOVertexCounts[objectIndex][0]);
    }

    this.GetObjectShowMaterial = function(objectIndex) {
        // 根据显示优先级做判断
        let curMaterial = null;
        let isObjectUnit = false;
        if (this.arrPickObjectIndexs[objectIndex] && this.m_arrObjectMaterial[objectIndex] != null) {
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
        } else if (this.arrPickObjectIndexs[objectIndex]) {
            curMaterial = this.defaultRed;
            isObjectUnit = true;
        } else if (this.m_arrObjectMaterial[objectIndex] != null) {
            curMaterial = this.m_arrObjectMaterial[objectIndex];
            isObjectUnit = true;
        }
        return {
            UserMaterial: curMaterial,
            UserUnitFlag: isObjectUnit,
        };
    }

    this.drawObjectTriangles_webgl1 = function(objectIndex) {
        // 判断是否可见
        if (!this.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        // 获取Object透明度
        let objectTrans = this.m_arrObjectTransparent[objectIndex];
        if (objectTrans <= GL_ZERO) {
            return;
        }
        gl.useProgram(this.solidProgramInfo.program);
        let uCurPartIndex = this.m_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        this.setVertexStride(uCurPartIndex);
        // 正向面定义模式
        if (this.m_GLObjectSet._arrObjectSet[objectIndex]._nCullMode == ADFCULL_NONE) {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
        }
        // 同一个object矩阵相同
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(this.solidProgramInfo.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        // 同一个Object的不同Surface材质不同
        let ObjectShowMaterial = this.GetObjectShowMaterial(objectIndex);
        let curMaterial = ObjectShowMaterial.UserMaterial;
        let isObjectUnit = ObjectShowMaterial.UserUnitFlag;
        for (let j=0; j<this.m_arrObjectSurface_VBOs[objectIndex].length; j++) {
            // 材质数据
            let materialIndex = this.m_arrMaterialIndex[objectIndex][j];
            if (!isObjectUnit) {
                if (this.m_arrMaterialIndex[objectIndex][j] == -1) {
                    curMaterial = this.defaultMaterial;
                } else {
                    curMaterial = this.m_GLMaterialSet._arrMaterialSet[materialIndex];
                }
            }

            if (curMaterial == null) {
                curMaterial = this.defaultMaterial;
            }

            gl.uniform4f(this.solidProgramInfo.uniformLocations.materialDiffuse,
                curMaterial._mtlPhysics.vDiffuse.x,
                curMaterial._mtlPhysics.vDiffuse.y,
                curMaterial._mtlPhysics.vDiffuse.z,
                curMaterial._mtlPhysics.vDiffuse.w);
            gl.uniform4f(this.solidProgramInfo.uniformLocations.materialAmbient,
                curMaterial._mtlPhysics.vAmbient.x,
                curMaterial._mtlPhysics.vAmbient.y,
                curMaterial._mtlPhysics.vAmbient.z,
                curMaterial._mtlPhysics.vAmbient.w);
            gl.uniform4f(this.solidProgramInfo.uniformLocations.materialSpecular,
                curMaterial._mtlPhysics.vSpecular.x,
                curMaterial._mtlPhysics.vSpecular.y,
                curMaterial._mtlPhysics.vSpecular.z,
                curMaterial._mtlPhysics.vSpecular.w);
            gl.uniform1f(this.solidProgramInfo.uniformLocations.power, curMaterial._mtlPhysics.fPower);
            gl.uniform4f(this.solidProgramInfo.uniformLocations.materialEmissive,
                curMaterial._mtlPhysics.vEmissive.x,
                curMaterial._mtlPhysics.vEmissive.y,
                curMaterial._mtlPhysics.vEmissive.z,
                curMaterial._mtlPhysics.vEmissive.w * objectTrans);
            if (curMaterial._eMtlType == ADFMTLTYPE_PHYSICS) {
                // 自然材质
                gl.uniform1i(this.solidProgramInfo.uniformLocations.fragmentTex, 0);
            } else if (curMaterial._eMtlType == ADFMTLTYPE_PICTURE) {
                if (curMaterial._arrTexID[0] instanceof WebGLTexture) {
                    // 贴图材质
                    gl.uniform1i(this.solidProgramInfo.uniformLocations.fragmentTex, 1);
                    // 设置贴图
                    gl.uniform1i(this.solidProgramInfo.uniformLocations.textureUnit, 0);
                    gl.bindTexture(gl.TEXTURE_2D, curMaterial._arrTexID[0]);
                } else {
                    gl.uniform1i(this.solidProgramInfo.uniformLocations.fragmentTex, 0);
                }
            } else {
                // 纯色材质
                gl.uniform1i(this.solidProgramInfo.uniformLocations.fragmentTex, 2);
                // 设置纯色
                if (curMaterial._arrData.length > 0) {
                    gl.uniform4f(this.solidProgramInfo.uniformLocations.pureColor, 
                        curMaterial._arrData[0].x,
                        curMaterial._arrData[0].y,
                        curMaterial._arrData[0].z,
                        curMaterial._arrData[0].w * objectTrans);
                }
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this.m_arrObjectSurface_VBOs[objectIndex][j]);
            gl.vertexAttribPointer(this.solidProgramInfo.attribLocations.vertexPosition, NUM_VERTEX, TYPE, NORMALIZE, this.STRIDE, 0);
            gl.enableVertexAttribArray(this.solidProgramInfo.attribLocations.vertexPosition);
            gl.vertexAttribPointer(this.solidProgramInfo.attribLocations.vertexVector, NUM_VECTOR, TYPE, NORMALIZE, this.STRIDE, NUM_VERTEX*4);
            gl.enableVertexAttribArray(this.solidProgramInfo.attribLocations.vertexVector);
            if (this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._uIsUV == 1) {
                gl.vertexAttribPointer(this.solidProgramInfo.attribLocations.vertexUV, NUM_UV, TYPE, NORMALIZE, this.STRIDE, (NUM_VERTEX+NUM_VECTOR)*4);
                gl.enableVertexAttribArray(this.solidProgramInfo.attribLocations.vertexUV);
            } else {
                gl.disableVertexAttribArray(this.solidProgramInfo.attribLocations.vertexUV);
            }
            gl.drawArrays(gl.TRIANGLES, 0, this.m_arrVAOVertexCounts[objectIndex][j]);
        }
    }

    this.drawObjectLines_webgl1 = function(objectIndex) {
        // 判断是否可见
        if (!this.m_arrObjectVisiable[objectIndex]) {
            return;
        }
        gl.useProgram(this.lineProgramInfo.program);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.m_arrObjectMatrix[objectIndex]);
        gl.uniformMatrix4fv(this.lineProgramInfo.uniformLocations.MVPMatrix, false, this.MVPMatrix);
        let materialIndex = this.m_arrMaterialIndex[objectIndex][0];
        let uCurPartIndex = this.m_GLObjectSet._arrObjectSet[objectIndex]._uPartIndex;
        this.setVertexStride(uCurPartIndex);
        let curMaterial = null;
        if (materialIndex == -1) {
            curMaterial = this.defaultMaterial;
        } else {
            curMaterial = this.m_GLMaterialSet._arrMaterialSet[materialIndex];
        }
        gl.uniform3f(this.lineProgramInfo.uniformLocations.lineColor,
                    curMaterial._mtlPhysics.vEmissive.x,
                    curMaterial._mtlPhysics.vEmissive.y,
                    curMaterial._mtlPhysics.vEmissive.z);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_arrObjectSurface_VBOs[objectIndex][0]);
        gl.vertexAttribPointer(this.lineProgramInfo.attribLocations.vertexPosition, NUM_VERTEX, TYPE, NORMALIZE, this.STRIDE, 0);
        gl.enableVertexAttribArray(this.lineProgramInfo.attribLocations.vertexPosition);
        gl.drawArrays(gl.LINES, 0, this.m_arrVAOVertexCounts[objectIndex][0]);
    }

    /**
     * 绘制零件包围盒
     */
    this.drawBox = function() {
        for (let i=0; i<this.arrPickObjectIndexs.length; i++) {
            if (this.arrPickObjectIndexs[i]) {
                mat4.multiply(this.MVPMatrix, this.PVMattrix, this.m_arrObjectMatrix[i]);
                gl.uniformMatrix4fv(this.lineProgramInfo.uniformLocations.MVPMatrix, false, this.MVPMatrix);
                gl.uniform3f(this.lineProgramInfo.uniformLocations.lineColor, 1.0, 1.0, 0.0);
                let nPickPartIndex = this.m_GLObjectSet._arrObjectSet[i]._uPartIndex;
                gl.bindVertexArray(this.m_arrObjectBox_VAOs[nPickPartIndex]);
                gl.drawArrays(gl.LINES, 0, BOX_LINEVERTEX_COUNT);
            }
        }
    }

    this.drawBox_webgl1 = function() {
        for (let i=0; i<this.arrPickObjectIndexs.length; i++) {
            if (this.arrPickObjectIndexs[i]) {
                mat4.multiply(this.MVPMatrix, this.PVMattrix, this.m_arrObjectMatrix[i]);
                gl.uniformMatrix4fv(this.lineProgramInfo.uniformLocations.MVPMatrix, false, this.MVPMatrix);
                gl.uniform3f(this.lineProgramInfo.uniformLocations.lineColor, 1.0, 1.0, 0.0);
                let nPickPartIndex = this.m_GLObjectSet._arrObjectSet[i]._uPartIndex;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.m_arrObjectBox_VBOs[nPickPartIndex]);
                gl.vertexAttribPointer(this.lineProgramInfo.attribLocations.vertexPosition, NUM_VERTEX, TYPE, NORMALIZE, NUM_VERTEX*4, 0);
                gl.enableVertexAttribArray(this.lineProgramInfo.attribLocations.vertexPosition);
                gl.drawArrays(gl.LINES, 0, BOX_LINEVERTEX_COUNT);
            }
        }
    }

    /**
     * 绘制背景图片
     */
    this.drawBackground = function() {
        if (this.m_arrBgTexId != null) {
            if (this.m_arrBgTexId[this.m_bgIndex] instanceof WebGLTexture) {
                gl.bindVertexArray(this.m_uBgVAO);
                gl.uniform1i(this.pictureProgramInfo.textureUnit, 0);
                gl.bindTexture(gl.TEXTURE_2D, this.m_arrBgTexId[this.m_bgIndex]);
                gl.drawArrays(gl.TRIANGLES, 0, BG_VERTEX.count);
            }
        }
    }

    this.drawBackground_webgl1 = function() {
        if (this.m_arrBgTexId != null) {
            if (this.m_arrBgTexId[this.m_bgIndex] instanceof WebGLTexture) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.m_uBgVBO);
                gl.vertexAttribPointer(this.pictureProgramInfo.attribLocations.vertexPosition, NUM_VERTEX, TYPE, NORMALIZE, (NUM_VERTEX + NUM_UV) * 4, 0);
                gl.enableVertexAttribArray(this.pictureProgramInfo.attribLocations.vertexPosition);
                gl.vertexAttribPointer(this.pictureProgramInfo.attribLocations.vertexUV, NUM_UV, TYPE, NORMALIZE, (NUM_VERTEX + NUM_UV) * 4, NUM_VERTEX*4);
                gl.enableVertexAttribArray(this.pictureProgramInfo.attribLocations.vertexUV);
                gl.uniform1i(this.pictureProgramInfo.textureUnit, 0);
                gl.bindTexture(gl.TEXTURE_2D, this.m_arrBgTexId[this.m_bgIndex]);
                gl.drawArrays(gl.TRIANGLES, 0, BG_VERTEX.count);
            }
        }
    }

    /**
     * 绘制注释数据
     */
    this.drawAnnotation2D = function() {
        // Clear the 2D canvas
        gl2d.clearRect(0, 0, gl2d.canvas.width, gl2d.canvas.height);
        mat4.multiply(this.MVPMatrix, this.PVMattrix, this.modelMatrix);
        for (let i=0; i<this.m_GLAnnoSet._arrComment.length; i++) {
            // 判断显隐性
            if (!this.m_arrAnnotVisiable[i]) {
                continue;
            }
            // 判断是否被拾取
            if (this.arrPickAnnotIndexs[i]) {
                gl2d.font = "20px 微软雅黑";
                gl2d.fillStyle = "#ff0000";
                gl2d.strokeStyle = "#ff0000";
            } else {
                gl2d.font = "20px 微软雅黑";
                gl2d.fillStyle = "#000000";
                gl2d.strokeStyle = "#000000";
            }
            // 计算引线位置
            gl2d.beginPath();
            this.RealPoint2.x = (this.m_GLAnnoSet._arrComment[i].stuAnnot.annoPlaneLocal.x + this.windowWidth/this.windowHeight) * this.windowHeight / 2;
            if (this.RealPoint2.x < 0) {
                this.RealPoint2.x = 0;
            }
            if (this.RealPoint2.x > this.windowWidth) {
                this.RealPoint2.x = this.windowWidth;
            }
            this.RealPoint2.y = this.windowHeight - (this.m_GLAnnoSet._arrComment[i].stuAnnot.annoPlaneLocal.y + 1.0) * this.windowHeight / 2;
            for (let j=0; j<this.m_GLAnnoSet._arrComment[i].stuAnnot.pNote.arrLeaderPos.length; j++) {
                CalTranslatePoint(this.m_GLAnnoSet._arrComment[i].stuAnnot.pNote.arrLeaderPos[j].x + this.m_GLAnnoSet._arrComment[i].stuAnnot.annoPlaneLocal.x,
                                this.m_GLAnnoSet._arrComment[i].stuAnnot.pNote.arrLeaderPos[j].y + this.m_GLAnnoSet._arrComment[i].stuAnnot.annoPlaneLocal.y,
                                this.m_GLAnnoSet._arrComment[i].stuAnnot.pNote.arrLeaderPos[j].z,
                                this.MVPMatrix, this.RealPoint1);
                this.RealPoint1.x = (this.RealPoint1.x + 1.0) * this.windowWidth / 2;
                this.RealPoint1.y = (1.0 - this.RealPoint1.y) * this.windowHeight / 2;
                // 绘制引线
                gl2d.moveTo(this.RealPoint1.x, this.RealPoint1.y);
                gl2d.lineTo(this.RealPoint2.x, this.RealPoint2.y);
            }
            // 绘制文字
            gl2d.fillText(this.m_GLAnnoSet._arrComment[i].stuAnnot.pNote.strText, this.m_arrAnnotRect[i].min.x, this.m_arrAnnotRect[i].min.y);
            // 绘制底线
            gl2d.moveTo(this.m_arrAnnotRect[i].min.x, this.m_arrAnnotRect[i].min.y);
            gl2d.lineTo(this.m_arrAnnotRect[i].max.x, this.m_arrAnnotRect[i].min.y);
            gl2d.stroke();
            // 判断是否被拾取，绘制注释属性信息
            if (this.arrPickAnnotIndexs[i]) {
                this.RealPoint3.x = this.m_arrAnnotRect[i].max.x;
                this.RealPoint3.y = this.m_arrAnnotRect[i].min.y;
                if (this.RealPoint3.x + this.annotPropRectWidth > this.windowWidth) {
                    // 超过了右界，文本框在左侧
                    this.RealPoint3.x = this.m_arrAnnotRect[i].min.x - this.annotPropRectWidth - this.annotPropGap*2;
                } else {
                    // 没有超过右界，文本框在右侧
                    this.RealPoint3.x += this.annotPropGap;
                }
                this.RealPoint3.y -= this.annotTextFont/2 + this.annotPropRectHeight/2;

                // 绘制文本矩形
                gl2d.fillStyle = "#fff8dc";
                gl2d.fillRect(this.RealPoint3.x, this.RealPoint3.y, this.annotPropRectWidth, this.annotPropRectHeight);
                gl2d.font = "10px 微软雅黑";
                // 绘制文本信息
                gl2d.fillStyle = "#000000";
                this.annotPropertyInfo =  "【用户名称】" + this.m_GLAnnoSet._arrComment[i].stuProperty._strUserName;
                this.RealPoint3.y += this.annotPropTextFont + this.annotPropTextLineHeight;
                gl2d.fillText(this.annotPropertyInfo, this.RealPoint3.x + this.annotPropGap, this.RealPoint3.y);
                this.annotPropertyInfo = "【批注时间】" + this.m_GLAnnoSet._arrComment[i].stuProperty._strDateTime.substring(0, 4);
                this.annotPropertyInfo += "-" + this.m_GLAnnoSet._arrComment[i].stuProperty._strDateTime.substring(4, 6);
                this.annotPropertyInfo += "-" + this.m_GLAnnoSet._arrComment[i].stuProperty._strDateTime.substring(6, 8);
                this.annotPropertyInfo += " " + this.m_GLAnnoSet._arrComment[i].stuProperty._strDateTime.substring(8, 10);
                this.annotPropertyInfo += ":" + this.m_GLAnnoSet._arrComment[i].stuProperty._strDateTime.substring(10, 12);
                this.annotPropertyInfo += ":" + this.m_GLAnnoSet._arrComment[i].stuProperty._strDateTime.substring(12, 14);
                this.RealPoint3.y += this.annotPropTextFont + this.annotPropTextLineHeight;
                gl2d.fillText(this.annotPropertyInfo, this.RealPoint3.x + this.annotPropGap, this.RealPoint3.y);
                // this.annotPropertyInfo = "起始帧号:" + this.m_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID;
                // this.RealPoint3.y += this.annotPropTextFont + this.annotPropTextLineHeight;
                // gl2d.fillText(this.annotPropertyInfo, this.RealPoint3.x + this.annotPropGap, this.RealPoint3.y);
                // this.annotPropertyInfo = "帧长度:" + this.m_GLAnnoSet._arrComment[i].stuProperty._uFrameSize;
                // this.RealPoint3.y += this.annotPropTextFont + this.annotPropTextLineHeight
                // gl2d.fillText(this.annotPropertyInfo, this.RealPoint3.x + this.annotPropGap, this.RealPoint3.y);
            }
        }
    }

    /**
     * 清除GPU缓存数据
     */
    this.clear = function() {
        // 清除顶点缓存数据
        if (isWebgl2) {
            this.clear_webgl2();
        } else {
            this.clear_webgl1();
        }
    }

    this.clear_webgl2 = function() {
        // 清除顶点缓存数据
        for (let i=0; i<this.m_arrObjectSurface_VAOs.length; i++) {
            for (let j=0; j<this.m_arrObjectSurface_VAOs[i].length; j++) {
                gl.deleteVertexArray(this.m_arrObjectSurface_VAOs[i][j]);
            }
        }
        for (let i=0; i<this.m_arrObjectSurface_VBOs.length; i++) {
            for (let j=0; j<this.m_arrObjectSurface_VBOs[i].length; j++) {
                gl.deleteBuffer(this.m_arrObjectSurface_VBOs[i][j]);
            }
        }
        for (let i=0; i<this.m_arrObjectBox_VAOs.length; i++) {
            gl.deleteVertexArray(this.m_arrObjectBox_VAOs[i]);
        }
        for (let i=0; i<this.m_arrObjectBox_VBOs.length; i++) {
            gl.deleteBuffer(this.m_arrObjectBox_VBOs[i]);
        }
        if (this.m_uBgVBO != -1) {
            gl.deleteBuffer(this.m_uBgVBO);
        }
        if (this.m_uBgVAO != -1) {
            gl.deleteVertexArray(this.m_uBgVAO);
        }
        // 清除贴图缓存数据
        for (let i=0; i<this.m_GLMaterialSet._arrMaterialSet.length; i++) {
            if (this.m_GLMaterialSet._arrMaterialSet[i]._eMtlType == ADFMTLTYPE_PICTURE) {
                if (this.m_GLMaterialSet._arrMaterialSet[i]._arrTexID[0] instanceof WebGLTexture) {
                    gl.deleteTexture(this.m_GLMaterialSet._arrMaterialSet[i]._arrTexID[0]);
                }
            }
        }
        if (this.m_arrBgTexId != null) {
            for (let i=0; i<this.m_arrBgTexId.length; i++) {
                if (this.m_arrBgTexId[i] instanceof WebGLTexture) {
                    gl.deleteTexture(this.m_arrBgTexId[i]);
                }
            }
        }
    }

    this.clear_webgl1 = function() {
        // 清除顶点缓存数据
        for (let i=0; i<this.m_arrObjectSurface_VBOs.length; i++) {
            for (let j=0; j<this.m_arrObjectSurface_VBOs[i].length; j++) {
                gl.deleteBuffer(this.m_arrObjectSurface_VBOs[i][j]);
            }
        }
        for (let i=0; i<this.m_arrObjectBox_VBOs.length; i++) {
            gl.deleteBuffer(this.m_arrObjectBox_VBOs[i]);
        }
        if (this.m_uBgVBO != -1) {
            gl.deleteBuffer(this.m_uBgVBO);
        }
        // 清除贴图缓存数据
        for (let i=0; i<this.m_GLMaterialSet._arrMaterialSet.length; i++) {
            if (this.m_GLMaterialSet._arrMaterialSet[i]._eMtlType == ADFMTLTYPE_PICTURE) {
                if (this.m_GLMaterialSet._arrMaterialSet[i]._arrTexID[0] instanceof WebGLTexture) {
                    gl.deleteTexture(this.m_GLMaterialSet._arrMaterialSet[i]._arrTexID[0]);
                }
            }
        }
        if (this.m_arrBgTexId != null) {
            for (let i=0; i<this.m_arrBgTexId.length; i++) {
                if (this.m_arrBgTexId[i] instanceof WebGLTexture) {
                    gl.deleteTexture(this.m_arrBgTexId[i]);
                }
            }
        }
    }

    /**
     * 零件拾取
     */
    this.pickByIndex = function(index, isMult) {
        if (index < -1 || index >= this.m_GLObjectSet._arrObjectSet.length) {
            return;
        }
        if (index > -1) {
            if (!isMult) {
                this.GL_PICKSTATUS = 1;
                for (let i=0; i<this.arrPickObjectIndexs.length; i++) {
                    this.arrPickObjectIndexs[i] = false;
                }
            } else {
                this.GL_PICKSTATUS = 2;
            }
            this.arrPickObjectIndexs[index] = true;
            this.eMaterialPriority = GL_USERPICKED;
            this.isPicked = true;
        } else {
            for (let i=0; i<this.arrPickObjectIndexs.length; i++) {
                this.arrPickObjectIndexs[i] = false;
            }
            this.GL_PICKSTATUS = 0;
            this.isPicked = false;
        }
    }
    this.pickMultByIndex = function(indexs) {
        let isAllNull = true;
        for (let i=0; i<this.arrPickObjectIndexs.length; i++) {
            this.arrPickObjectIndexs[i] = false;
        }
        for (let i=0; i<indexs.length; i++) {
            if (indexs[i] < 0 || indexs[i] >= this.m_GLObjectSet._arrObjectSet.length) {
                continue;
            }
            this.arrPickObjectIndexs[indexs[i]] = true;
            isAllNull = false;
        }
        if (isAllNull) {
            this.isPicked = false;
            this.GL_PICKSTATUS = 0;
            return;
        }
        this.eMaterialPriority = GL_USERPICKED;
        this.isPicked = true;
        if (indexs.length == 1) {
            this.GL_PICKSTATUS = 1;
            return indexs[0];
        } else {
            this.GL_PICKSTATUS = 2;
            return -1;
        }
    }
    this.pickByRay = function(RayPoint1, RayPoint2, isShow, isMult) {
        // 射线与包围盒相交判定
        let arrDistance = new Array();
        let arrIndex = new Array();
        for (let i = 0; i<this.m_GLObjectSet._arrObjectSet.length; ++i) {
            // 若是线缆数据则不能拾取
            if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_LINELIST) {
                continue;
            }
            // 若不可见则不能拾取
            if (!this.m_arrObjectVisiable[i]) {
                continue;
            }
            if (this.m_arrObjectTransparent[i] <= GL_ZERO) {
                continue;
            }
            let uCurPartIndex = this.m_GLObjectSet._arrObjectSet[i]._uPartIndex;
            let CurMat = this.m_arrObjectMatrix[i];
            if (this.intersectRayBox(RayPoint1, RayPoint2, this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._ObjectBox, CurMat)) {
                let arrSubsetDistance = new Array();
                for (let j=0; j<this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._SurfaceBoxes.length; j++) {
                    if (this.intersectRayBox(RayPoint1, RayPoint2, this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._boxset._SurfaceBoxes[j], CurMat)) {
                        let ret = this.intersectRayMesh(RayPoint1, RayPoint2, uCurPartIndex, j, CurMat)
                        if (ret.result) {
                            arrSubsetDistance.push(ret.distance);
                        }
                    }
                }
                let minDistance = Infinity;
                for (let j=0; j<arrSubsetDistance.length; j++) {
                    if (arrSubsetDistance[j] < minDistance) {
                        minDistance = arrSubsetDistance[j];
                    }
                }
                if (arrSubsetDistance.length > 0) {
                    arrDistance.push(minDistance);
                    arrIndex.push(i);
                }
            }
        }
        // 取最近的相交Object
        let index = -1;
        let minDistance = Infinity;
        for (let i=0; i<arrDistance.length; i++) {
            if (arrDistance[i] < minDistance) {
                minDistance = arrDistance[i];
                index = arrIndex[i];
            }
        }
        // 获取拾取object得索引
        if (isShow) {
            this.pickByIndex(index, isMult);
        }
        return index;
    }

    /**
     * 获取零件拾取状态
     */
    this.getPickStatus = function() {
        return this.GL_PICKSTATUS;
    }
    this.getPickedIndex = function() {
        this.arrPickIndexs.splice(0, this.arrPickIndexs.length);
        if (this.GL_PICKSTATUS == 1 || this.GL_PICKSTATUS == 2) {
            for (let i=0; i<this.arrPickObjectIndexs.length; i++) {
                if (this.arrPickObjectIndexs[i]) {
                    this.arrPickIndexs.push(i);
                }
            }
            return this.arrPickIndexs;
        } else {
            return this.arrPickIndexs;
        }
    }

    /**
     * 注释拾取
     */
    this.pickAnnotationByIndex = function(index, isMult) {
        if (index < -1 || index >= this.m_GLAnnoSet._arrComment.length) {
            return;
        }
        if (index > -1) {
            if (!isMult) {
                this.GL_PICKSTATUSANNO = 1;
                for (let i=0; i<this.arrPickAnnotIndexs.length; i++) {
                    this.arrPickAnnotIndexs[i] = false;
                }
            } else {
                this.GL_PICKSTATUSANNO = 2;
            }
            this.arrPickAnnotIndexs[index] = true;
        } else {
            for (let i=0; i<this.arrPickAnnotIndexs.length; i++) {
                this.arrPickAnnotIndexs[i] = false;
            }
            this.GL_PICKSTATUSANNO = 0;
        }
    }
    this.pickAnnotationMultByIndex = function(indexs) {
        let isAllNull = true;
        for (let i=0; i<this.arrPickAnnotIndexs.length; i++) {
            this.arrPickAnnotIndexs[i] = false;
        }
        for (let i=0; i<indexs.length; i++) {
            if (indexs[i] < 0 || indexs[i] >= this.m_GLAnnoSet._arrComment.length) {
                continue;
            }
            this.arrPickAnnotIndexs[indexs[i]] = true;
            isAllNull = false;
        }
        if (isAllNull) {
            this.GL_PICKSTATUSANNO = 0;
            return -1;
        }
        if (indexs.length == 1) {
            this.GL_PICKSTATUSANNO = 1;
            return indexs[0];
        } else {
            this.GL_PICKSTATUSANNO = 2;
            return -1;
        }
    }
    this.pickAnnotationByRay = function(x, y, isMult) {
        // console.log(x + " " + y);
        let index = -1;
        for (let i=0; i<this.m_GLAnnoSet._arrComment.length; i++) {
            // 判断是否隐藏
            if (!this.m_arrAnnotVisiable[i]) {
                continue;
            }
            // 文字矩形区域求交
            if ((x>this.m_arrAnnotRect[i].min.x && x<this.m_arrAnnotRect[i].max.x) &&
                (y<this.m_arrAnnotRect[i].min.y && y>this.m_arrAnnotRect[i].max.y)) {
                index = i;
                break;
            }
        }
        this.pickAnnotationByIndex(index, isMult);
        return index;
    }

    /**
     * 设置指定object模型的Model矩阵
     */
    this.setObjectModelMat = function() {
        if (this.m_arrObjectMatrix.length == 0) {
            for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
                let objectMatrix = mat4.create();
                this.m_GLObjectSet._arrObjectSet[i].GetAnimMatrix(0, this.animMatrix);
                mat4.multiply(objectMatrix, this.modelMatrix, this.animMatrix);
                this.m_arrObjectMatrix.push(objectMatrix);
            }
        } else {
            for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
                this.m_GLObjectSet._arrObjectSet[i].GetAnimMatrix(0, this.animMatrix);
                mat4.multiply(this.m_arrObjectMatrix[i], this.modelMatrix, this.animMatrix);
            }
        }
    }
    this.setObjectModelMatrixMult = function(modelMatrix) {
        for (let i=0; i<=this.arrPickObjectIndexs.length; i++) {
            if (this.arrPickObjectIndexs[i]) {
                mat4.multiply(this.m_arrObjectMatrix[i], modelMatrix, this.m_arrObjectMatrix[i]);
            }
        }
    }
    this.setObjectMatrixByIndex = function(index, matrix) {
        if (index < 0 || index >= this.m_arrObjectMatrix.length) {
            return;
        }
        mat4.multiply(this.m_arrObjectMatrix[index], this.modelMatrix, matrix);
    }
    this.getObjectModelMatrix = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= this.m_GLObjectSet._arrObjectSet.length) {
            return mat4.create();
        }
        return this.m_arrObjectMatrix[nObjectIndex];
    }

    /**
     * 设置所有Object透明度
     */
    this.setObjectTransparent = function() {
        // 默认第0帧数据
        if (this.m_arrObjectTransparent.length == 0) {
            for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
                let tempTrans =  this.m_GLObjectSet._arrObjectSet[i].GetAnimTransparent(0);
                if (tempTrans > -0.5) {
                    this.m_arrObjectTransparent.push(tempTrans);
                    this.switchObjectTranList(i, tempTrans);
                }
                else {
                    this.m_arrObjectTransparent.push(1.0);
                    this.switchObjectTranList(i, 1.0);
                }
            }
        } else {
            for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
                let tempTrans =  this.m_GLObjectSet._arrObjectSet[i].GetAnimTransparent(0);
                if (tempTrans > -0.5) {
                    this.m_arrObjectTransparent[i] = tempTrans;
                } else {
                    this.m_arrObjectTransparent[i] = 1.0;
                }
                this.switchObjectTranList(i, this.m_arrObjectTransparent[i]);
            }
        }
    }
    this.setObjectTransparentMult = function(fTransparent) {
        for (let i=0; i<=this.arrPickObjectIndexs.length; i++) {
            if (this.arrPickObjectIndexs[i]) {
                this.switchObjectTranList(i, fTransparent);
                this.m_arrObjectTransparent[i] = fTransparent;
            }
        }
    }
    this.getObjectTransparent = function(nObjectIndex) {
        if (nObjectIndex < 0 || nObjectIndex >= this.m_GLObjectSet._arrObjectSet.length) {
            return 0.0;
        }
        return this.m_arrObjectTransparent[nObjectIndex];
    }

    /**
     * 设置所有Object显隐性
     */
    this.setObjectVisible = function() {
        if (this.m_arrObjectVisiable.length == 0) {
            for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
                if (this.m_GLObjectSet._arrObjectSet[i]._nFillMode == ADFFILL_INVISIBLE) {
                    this.m_arrObjectVisiable.push(false);
                } else {
                    this.m_arrObjectVisiable.push(true);
                }
            }
        } else {
            for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
                if (this.m_GLObjectSet._arrObjectSet[i]._nFillMode == ADFFILL_INVISIBLE) {
                    this.m_arrObjectVisiable[i] = false;
                } else {
                    this.m_arrObjectVisiable[i] = true;
                }
            }
        }
    }
    this.setObjectVisibleMult = function(bVisible) {
        for (let i=0; i<this.arrPickObjectIndexs.length; i++) {
            if (this.arrPickObjectIndexs[i]) {
                this.m_arrObjectVisiable[i] = bVisible;
            }
        }
    }
    this.getObjectVisible = function(nObjectIndex) {
        if (this.nObjectIndex < 0 || this.nObjectIndex >= this.m_GLObjectSet._arrObjectSet.length) {
            return false;
        }
        return this.m_arrObjectVisiable[nObjectIndex];
    }
    this.setObjectVisibleByIndexs = function(indexs, bVisible) {
        for (let i=0; i<indexs.length; i++) {
            if (indexs[i]<0 || indexs[i]>this.m_arrObjectVisiable.length) {
                continue;
            }
            this.m_arrObjectVisiable[indexs[i]] = bVisible;
        }
    }

    /**
     * 设置所有注释的显隐性
     */
    this.setAnnotVisible = function() {
        if (this.m_arrAnnotVisiable.length == 0) {
            for (let i=0; i<this.m_GLAnnoSet._arrComment.length; i++) {
                // 判断当前帧是否显示
                if (this.m_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID == 0) {
                    this.m_arrAnnotVisiable.push(true);
                } else {
                    this.m_arrAnnotVisiable.push(false);
                }
            }
        } else {
            for (let i=0; i<this.m_GLAnnoSet._arrComment.length; i++) {
                if (this.m_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID == 0) {
                    this.m_arrAnnotVisiable[i] = true;
                } else {
                    this.m_arrAnnotVisiable[i] = false;
                }
            }
        }
    }
    this.setAnnotVisibleMult = function(bVisible) {
        for (let i=0; i<this.arrPickAnnotIndexs.length; i++) {
            if (this.arrPickAnnotIndexs[i]) {
                this.m_arrAnnotVisiable[i] = bVisible;
            }
        }
    }
    this.getAnnotVisible = function(nAnnoIndex) {
        if (this.nAnnoIndex < 0 || this.nAnnoIndex >= this.m_GLAnnoSet._arrComment.length) {
            return false;
        }
        return this.m_arrAnnotVisiable[nAnnoIndex];
    }
    this.setAnnotVisibleByIndexs = function(indexs, bVisible) {
        for (let i=0; i<indexs.length; i++) {
            if (indexs[i]<0 || indexs[i]>this.m_GLAnnoSet._arrComment.length) {
                continue;
            }
            this.m_arrAnnotVisiable[indexs[i]] = bVisible;
        }
    }

    /**
     * 设置所有注释的矩形区域
     */
    this.setAnnotRect = function(camera) {
        let hasAnnotRect = this.m_arrAnnotRect.length > 0 ? true : false;
        for (let i=0; i<this.m_GLAnnoSet._arrComment.length; i++) {
            // 计算文字总长度
            this.annotTextLength = this.m_GLAnnoSet._arrComment[i].stuAnnot.pNote.strText.length * this.annotTextFont;
            // 计算注释的文字底线方向
            this.RealPoint2.x = (this.m_GLAnnoSet._arrComment[i].stuAnnot.annoPlaneLocal.x + this.windowWidth/this.windowHeight) * this.windowHeight / 2;
            if (this.RealPoint2.x < 0) {
                this.RealPoint2.x = 0;
            }
            if (this.RealPoint2.x > this.windowWidth) {
                this.RealPoint2.x = this.windowWidth;
            }
            this.RealPoint2.y = this.windowHeight - (this.m_GLAnnoSet._arrComment[i].stuAnnot.annoPlaneLocal.y + 1.0) * this.windowHeight / 2;
            // 默认向右，如果超过右界，则向左
            this.isOutWindow = false;
            if (this.RealPoint2.x + this.annotTextLength > this.windowWidth) {
                this.isOutWindow = true;
                this.annotDire = -1;
            } else if (this.RealPoint2.x - this.annotTextLength < 0) {
                this.isOutWindow = true;
                this.annotDire = 1;
            }
            // 只有没有查过界限的情况下，才按照引线方位做进一步计算
            if (!this.isOutWindow) {
                mat4.multiply(this.PVMattrix, camera.projectionMatrix, camera.viewMatrix);
                mat4.multiply(this.MVPMatrix, this.PVMattrix, this.modelMatrix);
                this.annotDire = -1;
                for (let j=0; j<this.m_GLAnnoSet._arrComment[i].stuAnnot.pNote.arrLeaderPos.length; j++) {
                    CalTranslatePoint(this.m_GLAnnoSet._arrComment[i].stuAnnot.pNote.arrLeaderPos[j].x + this.m_GLAnnoSet._arrComment[i].stuAnnot.annoPlaneLocal.x,
                                    this.m_GLAnnoSet._arrComment[i].stuAnnot.pNote.arrLeaderPos[j].y + this.m_GLAnnoSet._arrComment[i].stuAnnot.annoPlaneLocal.y,
                                    this.m_GLAnnoSet._arrComment[i].stuAnnot.pNote.arrLeaderPos[j].z,
                                    this.MVPMatrix, this.RealPoint1);
                    this.RealPoint1.x = (this.RealPoint1.x + 1.0) * this.windowWidth / 2;
                    this.RealPoint1.y = (1.0 - this.RealPoint1.y) * this.windowHeight / 2;
                    // 判断引线方向
                    if (this.RealPoint1.x < this.RealPoint2.x) {
                        this.annotDire = 1;
                        break;
                    }
                }
            }
            // 计算所有注释的矩形区域
            if (this.annotDire == 1) {
                // 底线在右侧
                this.RealPoint1.x = this.RealPoint2.x;
                this.RealPoint1.y = this.RealPoint2.y;
                this.RealPoint2.x = this.RealPoint1.x + this.annotTextLength;
                this.RealPoint2.y = this.RealPoint1.y - this.annotTextFont;
            } else {
                this.RealPoint1.x = this.RealPoint2.x - this.annotTextLength;
                this.RealPoint1.y = this.RealPoint2.y;
                this.RealPoint2.y = this.RealPoint1.y - this.annotTextFont;
            }
            if (hasAnnotRect) {
                this.m_arrAnnotRect[i].set(this.RealPoint1.x, this.RealPoint1.y, this.RealPoint2.x, this.RealPoint2.y);
            } else {
                let rect = new Rect2D(this.RealPoint1.x, this.RealPoint1.y, this.RealPoint2.x, this.RealPoint2.y);
                this.m_arrAnnotRect.push(rect);
            }
        }
    }

    /**
     * 设置指定Object材质颜色
     */
    this.setObjectMaterial = function() {
        if (this.m_arrObjectMaterial.length == 0) {
            for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
                this.m_arrObjectMaterial.push(null);
            }
        } else {
            for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
                this.m_arrObjectMaterial[i] = null;
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
        if (Alpha > 1.0) {Alpha = 1.0;}
        if (Alpha < 0.0) {Alpha = 0.0;}

        let objectMaterial  = new ADF_MATERIAL();
        objectMaterial._eMtlType = ADFMTLTYPE_PHYSICS;
        let tempPhysics  = new ADF_MATERIALPHYSICS();
        tempPhysics.fPower = 10.0;
        tempPhysics.vAmbient.x = Red, tempPhysics.vAmbient.y = Green, tempPhysics.vAmbient.z = Blue, tempPhysics.vAmbient.w = 1.0;
        tempPhysics.vDiffuse.x = Red, tempPhysics.vDiffuse.y = Green, tempPhysics.vDiffuse.z = Blue, tempPhysics.vDiffuse.w = 1.0;
        tempPhysics.vEmissive.x = 0.0, tempPhysics.vEmissive.y = 0.0, tempPhysics.vEmissive.z = 0.0, tempPhysics.vEmissive.w = 1.0;
        tempPhysics.vSpecular.x = Red, tempPhysics.vSpecular.y = Green, tempPhysics.vSpecular.z = Blue, tempPhysics.vSpecular.w = 1.0;
        objectMaterial._mtlPhysics = tempPhysics;

        for (let i=0; i<=this.arrPickObjectIndexs.length; i++) {
            if (this.arrPickObjectIndexs[i]) {
                this.switchObjectTranList(i, Alpha);
                this.m_arrObjectMaterial[i] = objectMaterial;
                this.m_arrObjectTransparent[i] = Alpha;
            }
        }
        this.eMaterialPriority = GL_USERDEFINE;
    }

    /**
     * 清除所有临时设置数据
     */
    this.home = function() {
        this.setObjectModelMat();
        this.setObjectTransparent();
        this.setObjectVisible();
        this.setObjectMaterial();
        this.setAnnotVisible();
    }

    /**
     * 计算物件动画数据
     */
    this.setObjectAnim = function(uStartFrame) {
        this.isAnimationMode = true;
        this.uCurFrame = uStartFrame;
        for (let i=0; i<this.m_arrObjectMatrix.length; i++) {
            // 矩阵数据
            this.m_GLObjectSet._arrObjectSet[i].GetAnimMatrix(uStartFrame, this.animMatrix);
            mat4.multiply(this.m_arrObjectMatrix[i], this.modelMatrix, this.animMatrix);
            // 透明度数据
            this.fTransparent = this.m_GLObjectSet._arrObjectSet[i].GetAnimTransparent(uStartFrame);
            this.switchObjectTranList(i, this.fTransparent);
            this.m_arrObjectTransparent[i] = this.fTransparent;
        }
    }

    /**
     * 计算注释数据显隐性
     */
    this.setAnnotationAnim = function(uStartFrame) {
        for (let i=0; i<this.m_GLAnnoSet._arrComment.length; i++) {
            if (this.m_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID == 0 &&
                this.m_GLAnnoSet._arrComment[i].stuProperty._uFrameSize <= 1) {
                this.m_arrAnnotVisiable[i] = true;
            } else if (uStartFrame >= this.m_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID &&
                      uStartFrame < (this.m_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID
                      + this.m_GLAnnoSet._arrComment[i].stuProperty._uFrameSize)){
                this.m_arrAnnotVisiable[i] = true;
            } else {
                this.m_arrAnnotVisiable[i] = false;
            }
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
        for (let i=0; i<this.m_arrObjectMatrix.length; i++) {
            // 矩阵数据
            mat4.multiply(this.m_arrObjectMatrix[i], this.modelMatrixTmp, this.m_arrObjectMatrix[i]);
        }
    }

    /**
     * 设置背景图片
     */
    this.setBackground = function(index) {
        this.m_bgIndex = index;
    }

    //===================================================================================================
    // 辅助运算数据

    /**
     * 材质批量处理
     */
    this.setUniteMaterial = function() {
        for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
            var uCurPartIndex = this.m_GLObjectSet._arrObjectSet[i]._uPartIndex;
            this.setVertexDataNum(uCurPartIndex);
            if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                // 只有曲面数据的合并材质
                var isContainsNotTrans = false;
                var isContainsTrans = false;

                var arrVAOVertexCount = new Array();
                var arrMaterial = new Array();
                if (this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length == 1) {
                    var materialIndex = this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0];
                    if (materialIndex >= 0 && materialIndex < this.m_GLMaterialSet._arrMaterialSet.length) {
                        if (this.m_GLMaterialSet._arrMaterialSet[materialIndex]._mtlPhysics.vEmissive.w < 1.0) {
                            isContainsTrans = true;
                        } else {
                            isContainsNotTrans = true;
                        }
                    }
                    // object只有一种材质
                    arrVAOVertexCount.push(this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.length / this.VERTEX_DATA_COUNT);
                    arrMaterial.push(this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0]);
                } else {
                    // Object有多个Surface，并且有多个材质
                    var uCurIndex = this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0];
                    var uVertexCount = this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[0];
                    // 初始物体透明度标志
                    if (uCurIndex >= 0 && uCurIndex < this.m_GLMaterialSet._arrMaterialSet.length) {
                        if (this.m_GLMaterialSet._arrMaterialSet[uCurIndex]._mtlPhysics.vEmissive.w < 1.0) {
                            isContainsTrans = true;
                        } else {
                            isContainsNotTrans = true;
                        }
                    }
                    for (let j=1; j<this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length; j++) {
                        if (this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j] == uCurIndex) {
                            uVertexCount += this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j];
                            if (j == this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length-1) {
                                arrMaterial.push(uCurIndex);
                                arrVAOVertexCount.push(uVertexCount);
                            }
                        } else {
                            arrMaterial.push(uCurIndex);
                            arrVAOVertexCount.push(uVertexCount);
                            if (j == this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex.length-1) {
                                arrMaterial.push(this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j]);
                                arrVAOVertexCount.push(this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j]);
                            } else {
                                uCurIndex = this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                                uVertexCount = this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrSurfaceVertexNum[j];
                            }
                        }
                        // 设置物体透明度标志
                        var materialIndex = this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[j];
                        if (materialIndex >= 0 && materialIndex < this.m_GLMaterialSet._arrMaterialSet.length) {
                            if (this.m_GLMaterialSet._arrMaterialSet[materialIndex]._mtlPhysics.vEmissive.w < 1.0) {
                                isContainsTrans = true;
                            } else {
                                isContainsNotTrans = true;
                            }
                        }
                    }
                }
                this.m_arrVAOVertexCounts.push(arrVAOVertexCount);
                this.m_arrMaterialIndex.push(arrMaterial);
                if (isContainsTrans && (!isContainsNotTrans)) {
                    // 全透明
                    this.m_arrObjectTransModeOrig.push(GLTRANS_ALL);
                    this.m_arrObjectTransMode.push(GLTRANS_ALL);
                } else if (isContainsTrans && isContainsNotTrans) {
                    // 部分透明
                    this.m_arrObjectTransModeOrig.push(GLTRANS_PART);
                    this.m_arrObjectTransMode.push(GLTRANS_PART);
                } else {
                    // 全不透明
                    this.m_arrObjectTransModeOrig.push(GLTRANS_NO);
                    this.m_arrObjectTransMode.push(GLTRANS_NO);
                }
            } else {
                // 只有线缆数据的合并材质
                var uCurPartIndex = this.m_GLObjectSet._arrObjectSet[i]._uPartIndex;
                var arrVAOVertexCount = new Array();
                var arrMaterial = new Array();
                arrVAOVertexCount.push(this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.length / this.VERTEX_DATA_COUNT);
                arrMaterial.push(this.m_GLObjectSet._arrObjectSet[i]._arrSurfaceMaterialIndex[0]);
                this.m_arrVAOVertexCounts.push(arrVAOVertexCount);
                this.m_arrMaterialIndex.push(arrMaterial);
                this.m_arrObjectTransModeOrig.push(GLTRANS_NO);
                this.m_arrObjectTransMode.push(GLTRANS_NO);
            }
        }
    }

    /**
     * 生成GPU缓存数据
     */
    this.setVAOs = function() {
        this.setBgVAO();
        this.setBoxVAO();
        // 创建零件VAO缓存
        let arrPartUsedFlag = new Array(this.m_GLPartSet._arrPartSet.length);
        for (let i=0; i<this.m_GLPartSet._arrPartSet.length; i++) {
            arrPartUsedFlag[i] = new Array();
        }
        for (let i=0; i<this.m_arrMaterialIndex.length; i++) {
            let uCurPartIndex = this.m_GLObjectSet._arrObjectSet[i]._uPartIndex;
            let equalFlags = this.GetEqualFlags(uCurPartIndex, i, arrPartUsedFlag);
            let uBeforeObjectIndex = equalFlags.EqualBeforeIndex;
            let isEqualToBefore = equalFlags.EqualBeforeFlag;

            let arrSurfaceVAOs = new Array();
            let arrSurfaceVBOs = new Array();
            if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                // 创建曲面零件VAO缓存
                if (!isEqualToBefore) {
                    this.setSubsetSurfaceVAO(uCurPartIndex, i, arrSurfaceVAOs, arrSurfaceVBOs);
                } else {
                    for (let j=0; j<this.m_arrObjectSurface_VAOs[uBeforeObjectIndex].length; j++) {
                        arrSurfaceVAOs.push(this.m_arrObjectSurface_VAOs[uBeforeObjectIndex][j]);
                    }
                    for (let j=0; j<this.m_arrObjectSurface_VBOs[uBeforeObjectIndex].length; j++) {
                        arrSurfaceVBOs.push(this.m_arrObjectSurface_VBOs[uBeforeObjectIndex][j]);
                    }
                }
            } else {
                // 创建线缆数据VAO缓存
                if (!isEqualToBefore) {
                    this.setSubsetCurveVAO(uCurPartIndex, i, arrSurfaceVAOs, arrSurfaceVBOs);
                } else {
                    arrSurfaceVAOs.push(this.m_arrObjectSurface_VAOs[uBeforeObjectIndex][0]);
                    arrSurfaceVBOs.push(this.m_arrObjectSurface_VBOs[uBeforeObjectIndex][0]);
                }
            }
            this.m_arrObjectSurface_VAOs.push(arrSurfaceVAOs);
            this.m_arrObjectSurface_VBOs.push(arrSurfaceVBOs);
        }
        // 解除绑定
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    this.setBgVAO = function() {
        // 创建背景图片VAO缓存
        this.m_uBgVAO = gl.createVertexArray();
        gl.bindVertexArray(this.m_uBgVAO);
        this.m_uBgVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_uBgVBO);
        gl.bufferData(gl.ARRAY_BUFFER, 6 * (NUM_VERTEX + NUM_UV) * 4, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(BG_VERTEX.vertex), 0, 6 * (NUM_VERTEX + NUM_UV));
        gl.vertexAttribPointer(this.pictureProgramInfo.attribLocations.vertexPosition, NUM_VERTEX, TYPE, NORMALIZE, (NUM_VERTEX + NUM_UV) * 4, 0);
        gl.enableVertexAttribArray(this.pictureProgramInfo.attribLocations.vertexPosition);
        gl.vertexAttribPointer(this.pictureProgramInfo.attribLocations.vertexUV, NUM_UV, TYPE, NORMALIZE, (NUM_VERTEX + NUM_UV) * 4, NUM_VERTEX*4);
        gl.enableVertexAttribArray(this.pictureProgramInfo.attribLocations.vertexUV);
    }

    this.setBoxVAO = function() {
        // 创建包围盒VAO缓存
        for (let i=0; i<this.m_GLPartSet._arrPartSet.length; i++) {
            let nVAOId = -1;
            nVAOId = gl.createVertexArray();
            gl.bindVertexArray(nVAOId);
            let nVBOId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
            // 建立显存缓存
            this.setBoxLines(i);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.m_arrBoxLines), gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.lineProgramInfo.attribLocations.vertexPosition, NUM_VERTEX, TYPE, NORMALIZE, NUM_VERTEX*4, 0);
            gl.enableVertexAttribArray(this.lineProgramInfo.attribLocations.vertexPosition);
            this.m_arrObjectBox_VBOs.push(nVBOId);
            this.m_arrObjectBox_VAOs.push(nVAOId);
        }
    }

    this.setSubsetSurfaceVAO = function(uPartIndex, uObjectIndex, arrSurfaceVAOs, arrSurfaceVBOs) {
        this.setVertexDataNum(uPartIndex);
        this.setVertexStride(uPartIndex);
        // 创建曲面VAO缓存
        let offset = 0;
        for (let j=0; j<this.m_arrMaterialIndex[uObjectIndex].length; j++) {
            // 创建一个VAO
            let VAOArray = -1;
            VAOArray = gl.createVertexArray();
            gl.bindVertexArray(VAOArray);
            // 创建一个VBO
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.m_arrVAOVertexCounts[uObjectIndex][j]*this.STRIDE, gl.STATIC_DRAW);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex,
                             offset, this.m_arrVAOVertexCounts[uObjectIndex][j]*(this.VERTEX_DATA_COUNT));
            // 绑定缓存区数据
            gl.vertexAttribPointer(this.solidProgramInfo.attribLocations.vertexPosition, NUM_VERTEX, TYPE, NORMALIZE, this.STRIDE, 0);
            gl.enableVertexAttribArray(this.solidProgramInfo.attribLocations.vertexPosition);
            gl.vertexAttribPointer(this.solidProgramInfo.attribLocations.vertexVector, NUM_VECTOR, TYPE, NORMALIZE, this.STRIDE, NUM_VERTEX*4);
            gl.enableVertexAttribArray(this.solidProgramInfo.attribLocations.vertexVector);
            if (this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
                gl.vertexAttribPointer(this.solidProgramInfo.attribLocations.vertexUV, NUM_UV, TYPE, NORMALIZE, this.STRIDE, (NUM_VERTEX+NUM_VECTOR)*4);
                gl.enableVertexAttribArray(this.solidProgramInfo.attribLocations.vertexUV);
            }
            // 存值
            arrSurfaceVBOs.push(buffer);
            arrSurfaceVAOs.push(VAOArray);
            offset += this.m_arrVAOVertexCounts[uObjectIndex][j]*(this.VERTEX_DATA_COUNT);
        }
    }

    this.setSubsetCurveVAO = function(uPartIndex, uObjectIndex, arrSurfaceVAOs, arrSurfaceVBOs) {
        this.setVertexDataNum(uPartIndex);
        this.setVertexStride(uPartIndex);
        // 创建一个VAO
        let VAOArray = -1;
        VAOArray = gl.createVertexArray();
        gl.bindVertexArray(VAOArray);
        // 创建一个VBO
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.m_arrVAOVertexCounts[uObjectIndex][0]*this.STRIDE, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex,
                         0, this.m_arrVAOVertexCounts[uObjectIndex][0]*(this.VERTEX_DATA_COUNT));
        // 绑定缓存区数据
        gl.vertexAttribPointer(this.lineProgramInfo.attribLocations.vertexPosition, NUM_VERTEX, TYPE, NORMALIZE, this.STRIDE, 0);
        gl.enableVertexAttribArray(this.lineProgramInfo.attribLocations.vertexPosition);
        // 存值
        arrSurfaceVBOs.push(buffer);
        arrSurfaceVAOs.push(VAOArray);
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

    this.setVBOs_webgl1 = function() {
        // 创建背景图片VAO缓存
        this.m_uBgVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_uBgVBO);
        gl.bufferData(gl.ARRAY_BUFFER, 6 * (NUM_VERTEX + NUM_UV) * 4, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(BG_VERTEX.vertex), 0, 6 * (NUM_VERTEX + NUM_UV));
        // 创建包围盒VAO缓存
        for (let i=0; i<this.m_GLPartSet._arrPartSet.length; i++) {
            let nVBOId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nVBOId);
            // 建立显存缓存
            this.setBoxLines(i);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.m_arrBoxLines), gl.STATIC_DRAW);
            this.m_arrObjectBox_VBOs.push(nVBOId);
        }
        // 创建零件VAO缓存
        let arrPartUsedFlag = new Array(this.m_GLPartSet._arrPartSet.length);
        for (let i=0; i<this.m_GLPartSet._arrPartSet.length; i++) {
            arrPartUsedFlag[i] = new Array();
        }
        for (let i=0; i<this.m_arrMaterialIndex.length; i++) {
            let uCurPartIndex = this.m_GLObjectSet._arrObjectSet[i]._uPartIndex;
            let equalFlags = this.GetEqualFlags(uCurPartIndex, i, arrPartUsedFlag);
            let uBeforeObjectIndex = equalFlags.EqualBeforeIndex;
            let isEqualToBefore = equalFlags.EqualBeforeFlag;

            let arrSurfaceVBOs = new Array();
            this.setVertexDataNum(uCurPartIndex);
            if (this.m_GLObjectSet._arrObjectSet[i]._uPrimitType == ADFPT_TRIANGLELIST) {
                // 创建曲面零件VAO缓存
                if (!isEqualToBefore) {
                    let offset = 0;
                    for (let j=0; j<this.m_arrMaterialIndex[i].length; j++) {
                        // 创建一个VBO
                        let buffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                        let subData = this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.subarray(
                            offset, offset+this.m_arrVAOVertexCounts[i][j]*(this.VERTEX_DATA_COUNT));
                        gl.bufferData(gl.ARRAY_BUFFER, subData, gl.STATIC_DRAW);
                        // 存值
                        arrSurfaceVBOs.push(buffer);
                        offset += this.m_arrVAOVertexCounts[i][j]*(this.VERTEX_DATA_COUNT);
                    }
                } else {
                    for (let j=0; j<this.m_arrObjectSurface_VBOs[uBeforeObjectIndex].length; j++) {
                        arrSurfaceVBOs.push(this.m_arrObjectSurface_VBOs[uBeforeObjectIndex][j]);
                    }
                }
            } else {
                // 创建线缆数据VAO缓存
                if (!isEqualToBefore) {
                    // 创建一个VBO
                    let buffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    let subData = this.m_GLPartSet._arrPartSet[uCurPartIndex]._arrPartLODData[0]._arrVertex.subarray(
                        0, this.m_arrVAOVertexCounts[i][0]*(this.VERTEX_DATA_COUNT));
                    gl.bufferData(gl.ARRAY_BUFFER, subData, gl.STATIC_DRAW);
                    // 存值
                    arrSurfaceVBOs.push(buffer);
                } else {
                    arrSurfaceVBOs.push(this.m_arrObjectSurface_VBOs[uBeforeObjectIndex][0]);
                }
            }
            this.m_arrObjectSurface_VBOs.push(arrSurfaceVBOs);
        }
        // 解除绑定
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
        let curBox = this.m_GLPartSet._arrPartSet[nPartIndex]._arrPartLODData[0]._boxset._ObjectBox;
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
     * 生成零件曲面的面片索引，用于拾取求
     */
    this.setSubsetIndex = function() {
        for (let i=0; i<this.m_GLPartSet._arrPartSet.length; i++) {
            let arrSurfaceIndex = new Array();
            let index = 0;
            for (let j=0; j<this.m_GLPartSet._arrPartSet[i]._arrPartLODData[0]._arrSurfaceVertexNum.length; j++)
            {
                let surfaceIndex = new GL_Vertex_Index(index, index+this.m_GLPartSet._arrPartSet[i]._arrPartLODData[0]._arrSurfaceVertexNum[j]);
                arrSurfaceIndex.push(surfaceIndex);
                index += this.m_GLPartSet._arrPartSet[i]._arrPartLODData[0]._arrSurfaceVertexNum[j];
            }
            this.m_arrPartSurfaceIndex.push(arrSurfaceIndex);
        }
    }

    /**
     * 生成零件拾取标识数组
     */
    this.setPickIndexs = function() {
        for (let i=0; i<this.m_GLObjectSet._arrObjectSet.length; i++) {
            this.arrPickObjectIndexs.push(false);
        }
    }

    /**
     * 生成注释拾取标识数组
     */
    this.setPickAnnotIndexs = function() {
        for (let i=0; i<this.m_GLAnnoSet._arrComment.length; i++) {
            this.arrPickAnnotIndexs.push(false);
        }
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
        for (let i=0; i<12; i++) {
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
     * 射线与三角面片求交
     */
    this.intersectRayMesh = function(RayPoint1, RayPoint2, uPartIndex, uSurfaceIndex, ObjectMat) {
        this.vLinePt1.x = RayPoint1.x; this.vLinePt1.y = RayPoint1.y; this.vLinePt1.z = RayPoint1.z;
        this.vLinePt2.x = RayPoint2.x; this.vLinePt2.y = RayPoint2.y; this.vLinePt2.z = RayPoint2.z;
        let arrDistance = new Array();
        this.setVertexDataNum(uPartIndex);
        for (let i=this.m_arrPartSurfaceIndex[uPartIndex][uSurfaceIndex]._startIndex; i<this.m_arrPartSurfaceIndex[uPartIndex][uSurfaceIndex]._endIndex; i += 3) {
            CalTranslatePoint(this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[i * this.VERTEX_DATA_COUNT],
                              this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[i * this.VERTEX_DATA_COUNT + 1],
                              this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[i * this.VERTEX_DATA_COUNT + 2], ObjectMat, this.RealPoint1);
            CalTranslatePoint(this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 1) * this.VERTEX_DATA_COUNT],
                              this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 1) * this.VERTEX_DATA_COUNT + 1],
                              this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 1) * this.VERTEX_DATA_COUNT + 2], ObjectMat, this.RealPoint2);
            CalTranslatePoint(this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 2) * this.VERTEX_DATA_COUNT],
                              this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 2) * this.VERTEX_DATA_COUNT + 1],
                              this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._arrVertex[(i + 2) * this.VERTEX_DATA_COUNT + 2], ObjectMat, this.RealPoint3);
            this.vTriVer1.x = this.RealPoint1.x; this.vTriVer1.y = this.RealPoint1.y; this.vTriVer1.z = this.RealPoint1.z;
            this.vTriVer2.x = this.RealPoint2.x; this.vTriVer2.y = this.RealPoint2.y; this.vTriVer2.z = this.RealPoint2.z;
            this.vTriVer3.x = this.RealPoint3.x; this.vTriVer3.y = this.RealPoint3.y; this.vTriVer3.z = this.RealPoint3.z;
            if (CalcIntersectOfLineSegTriangle(this.vLinePt1, this.vLinePt2, this.vTriVer1, this.vTriVer2, this.vTriVer3, this.pIntersectPt)) {
                let tempDistance = Math.sqrt((this.pIntersectPt.x-this.vLinePt1.x)*(this.pIntersectPt.x-this.vLinePt1.x) +
                                        (this.pIntersectPt.y-this.vLinePt1.y)*(this.pIntersectPt.y-this.vLinePt1.y) +
                                        (this.pIntersectPt.z-this.vLinePt1.z)*(this.pIntersectPt.z-this.vLinePt1.z));
                arrDistance.push(tempDistance);
            }
        }
        // 计算最小值
        if (arrDistance.length == 0) {
            return {
                result: false,
                distance: -1,
            };
        } else {
            let minDistance = Infinity;
            for (let i=0; i<arrDistance.length; i++) {
                if (arrDistance[i] < minDistance) {
                    minDistance = arrDistance[i];
                }
            }
            return {
                result: true,
                distance: minDistance,
            };
        }
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
     * 判断有无UV信息
     * 内部调用
     */
    this.setVertexDataNum = function(uPartIndex) {
        if (this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
            this.VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
        } else {
            this.VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR;
        }
        // this.VERTEX_DATA_COUNT = NUM_VERTEX + NUM_VECTOR + NUM_UV;
    }
    this.setVertexStride = function(uPartIndex) {
        if (this.m_GLPartSet._arrPartSet[uPartIndex]._arrPartLODData[0]._uIsUV == 1) {
            this.STRIDE = (NUM_VERTEX + NUM_VECTOR + NUM_UV) * 4;
        } else {
            this.STRIDE = (NUM_VERTEX + NUM_VECTOR) * 4;
        }
        // this.STRIDE = (NUM_VERTEX + NUM_VECTOR + NUM_UV) * 4;
    }
}