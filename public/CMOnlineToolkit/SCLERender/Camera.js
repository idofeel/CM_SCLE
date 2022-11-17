// File: Camera.js

/**
 * @author wujiali
 */
 
//===================================================================================================

function Camera() {

    this.eye = new Point3(0, 0, 0);
    this.look = new Point3(0, 0, 0);
    this.up = new Point3(0, 0, 0);
    this.n = new Vector3(0, 0, 0);
    this.u = new Vector3(0, 0, 0);
    this.v = new Vector3(0, 0, 0);
    this.upVec = new Vector3(0, 0, 0);
    this.eVec = new Vector3(0, 0, 0);
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.angle = 0;
    this.aspect = 0;
    this.zNear = -1.0;
    this.zFar = -1.0;
    this.personControl = 0;
    this.distance = 0;

    // 辅助计算数据
    this.t = new Vector3(0, 0, 0);
    this.s = new Vector3(0, 0, 0);

    this.vViewPos = new Point3(0, 0, 0);
    this.vPrjPos = new Point3(0, 0, 0);

    this.adfCamera = new ADF_CAMERA();
    this.animCamera = new ADF_CAMERA();
    this.dstCamera = new ADF_CAMERA();
    this.curRatio = 0;
    this.animationClock = null;
    this.animationTime = 0;
    this.animationFrameStep = 30;
    this.actionTime = 600; // 500ms
    this.slideEyeDir = new Vector3(0, 0, 0);
    this.slideEyeDist = 0;
    this.slideFocusDir = new Vector3(0, 0, 0);
    this.slideFocusDist = 0;
    
    /**
     * 设置摄像机参数
     */
    this.setCamera = function(eyeX, eyeY, eyeZ, lookX, lookY, lookZ, upX, upY, upZ) {
        this.eye.x = eyeX, this.eye.y = eyeY, this.eye.z = eyeZ;
        this.look.x = lookX, this.look.y = lookY, this.look.z = lookZ;
        this.up.x = upX, this.up.y = upY, this.up.z = upZ; 

        this.setCameraAxis(eyeX, eyeY, eyeZ, lookX, lookY, lookZ, upX, upY, upZ);

        this.updateEyeVec();
        this.setViewMatrix();

        let dist = Math.pow(this.eye.x, 2) + Math.pow(this.eye.y, 2) + Math.pow(this.eye.z, 2);
        this.distance = Math.pow(dist, 0.5);
    }

    /**
     * 获取摄像机参数
     */
    this.getCameraViewData = function() {
        return {
            eye: {
                x: this.eye.x, y: this.eye.y, z: this.eye.z,
            },
            up: {
                x: this.v.x, y: this.v.y, z: this.v.z,
            },
            dis: {
                near: this.zNear,
                far: this.zFar,
            }  
        }
    }

    /**
     * 设置摄像机坐标系
     */
    this.setCameraAxis = function(eyeX, eyeY, eyeZ, lookX, lookY, lookZ, upX, upY, upZ) {
        this.upVec.x = upX, this.upVec.y = upY, this.upVec.z = upZ;
        this.n.x = eyeX-lookX, this.n.y = eyeY-lookY, this.n.z = eyeZ-lookZ;
        this.n.normalize();
        // this.u.x = this.upVec.cross(this.n).x, this.u.y = this.upVec.cross(this.n).y, this.u.z = this.upVec.cross(this.n).z;
        // this.v.x = this.n.cross(this.u).x, this.v.y = this.n.cross(this.u).y, this.v.z = this.n.cross(this.u).z;
        this.upVec.cross(this.n, this.u);
        this.n.cross(this.u, this.v);
    }

    /**
     * 计算变换后的视点矩阵
     */
    this.setViewMatrix = function() {
        this.viewMatrix[0] = this.u.x; this.viewMatrix[4] = this.u.y; this.viewMatrix[8] = this.u.z; this.viewMatrix[12] = -this.eVec.dot(this.u);
        this.viewMatrix[1] = this.v.x; this.viewMatrix[5] = this.v.y; this.viewMatrix[9] = this.v.z; this.viewMatrix[13] = -this.eVec.dot(this.v);
        this.viewMatrix[2] = this.n.x; this.viewMatrix[6] = this.n.y; this.viewMatrix[10] = this.n.z; this.viewMatrix[14] = -this.eVec.dot(this.n);
        this.viewMatrix[3] = 0.0; this.viewMatrix[7] = 0.0; this.viewMatrix[11] = 0.0; this.viewMatrix[15] = 1.0;
        callback_v3.CMOnCameraChangeCallback()
    }

    /**
     * 计算投影矩阵
     */
    this.setPerspectiveMatrix = function(angle, aspect) {
        if (this.zFar <= 0.0001) {
            let focusDistance = this.getDist();
            this.zNear = focusDistance * 0.02;
            this.zFar = focusDistance * 200.0;
        }
        this.angle = angle;
        this.aspect = aspect;
        mat4.perspective(this.projectionMatrix, angle, aspect, this.zNear, this.zFar);
    }

    this.setNearFar = function(near, far) {
        this.zNear = near; this.zFar = far;
    }

    this.setPerspective = function(angle, aspect) {
        this.angle = angle;
        this.aspect = aspect;
    }

    this.updatePerspectiveMatrix = function() {
        let focusDistance = this.getDist();
        this.zNear = focusDistance * 0.02;
        this.zFar = focusDistance * 200.0;
        mat4.perspective(this.projectionMatrix, this.angle, this.aspect, this.zNear, this.zFar);
    }

    /**
     * 设置摄像机视角，0位第三视角，1为第一视角
     */
    this.setPersonControl = function(personControl) {
        this.personControl = personControl;
    }

    /**
     * 摄像机旋转
     */
    this.rotateX = function(degreeX) {
        if (this.personControl == 0) {
            // 第三视角控制
            let d = this.distance;
            let cnt = 10;
            let theta = degreeX / cnt;
            let slide_d = -2 * d * Math.sin(theta * Math.PI / 360);

            this.yaw(theta / 2);
            for(; cnt!=0; --cnt) {
                this.slide(slide_d, 0, 0);
                this.yaw(theta);
            }
            this.yaw(-theta / 2);
        } else {
            // 第一视角控制
            this.yaw(degreeX);
        }
    }

    this.rotateY = function(degreeY) {
        if (this.personControl == 0) {
            // 第三视角控制
            let d = this.distance;
            let cnt = 10;
            let theta = degreeY / cnt;
            let slide_d = 2 * d * Math.sin(theta * Math.PI / 360);

            this.pitch(theta / 2);
            for(; cnt!=0; --cnt) {
                this.slide(0, slide_d, 0);
                this.pitch(theta);
            }
            this.pitch(-theta / 2);
        } else {
            // 第一视角控制
            this.pitch(degreeY);
        }
    }

    this.rotateZ = function(degreeZ) {
        this.roll(degreeZ);
    }

    /**
     * 摄像机绕n、v、u轴旋转的计算函数
     */
    this.roll = function(angle) {
        let cs = Math.cos(angle * Math.PI / 180);
        let sn = Math.sin(angle * Math.PI / 180);
        let t = new Vector3(this.u.x, this.u.y, this.u.z);
        let s = new Vector3(this.v.x, this.v.y, this.v.z);
        this.u.set(cs*t.x - sn*s.x, cs*t.y - sn*s.y, cs*t.z - sn*s.z);
        this.v.set(sn*t.x + cs*s.x, sn*t.y + cs*s.y, sn*t.z + cs*s.z);
        //每次计算完坐标轴变化后调用此函数更新视点矩阵
        this.updateEyeVec();
        this.setViewMatrix();
    }

    this.yaw = function(angle) {
        let cs = Math.cos(angle * Math.PI / 180);
        let sn = Math.sin(angle * Math.PI / 180);
        this.t.x = this.n.x, this.t.y = this.n.y, this.t.z = this.n.z;
        this.s.x = this.u.x, this.s.y = this.u.y, this.s.z = this.u.z;
        this.n.set(cs*this.t.x - sn*this.s.x, cs*this.t.y - sn*this.s.y, cs*this.t.z - sn*this.s.z);
        this.u.set(sn*this.t.x + cs*this.s.x, sn*this.t.y + cs*this.s.y, sn*this.t.z + cs*this.s.z);
        //每次计算完坐标轴变化后调用此函数更新视点矩阵
        this.updateEyeVec();
        this.setViewMatrix();
    }

    this.pitch = function(angle) {
        let cs = Math.cos(angle * Math.PI / 180);
        let sn = Math.sin(angle * Math.PI / 180);
        this.t.x = this.v.x, this.t.y = this.v.y, this.t.z = this.v.z;
        this.s.x = this.n.x, this.s.y = this.n.y, this.s.z = this.n.z;
        this.v.set(cs*this.t.x - sn*this.s.x, cs*this.t.y - sn*this.s.y, cs*this.t.z - sn*this.s.z);
        this.n.set(sn*this.t.x + cs*this.s.x, sn*this.t.y + cs*this.s.y, sn*this.t.z + cs*this.s.z);
        //每次计算完坐标轴变化后调用此函数更新视点矩阵
        this.updateEyeVec();
        this.setViewMatrix();
    }

    /**
     * 摄像机绕三个轴平移的计算函数
     */
    this.slide = function(du, dv, dn) {
        this.eye.x += du*this.u.x + dv*this.v.x + dn*this.n.x;
        this.eye.y += du*this.u.y + dv*this.v.y + dn*this.n.y;
        this.eye.z += du*this.u.z + dv*this.v.z + dn*this.n.z;
        // this.look.x += du*this.u.x + dv*this.v.x + dn*this.n.x;
        // this.look.y += du*this.u.y + dv*this.v.y + dn*this.n.y;
        // this.look.z += du*this.u.z + dv*this.v.z + dn*this.n.z;
        this.updateEyeVec();
        this.setViewMatrix();
        this.updatePerspectiveMatrix();
        this.updateDist();
    }

    this.updateEyeLoc = function() {
        this.eye.x = this.distance * this.n.x;
        this.eye.y = this.distance * this.n.y;
        this.eye.z = this.distance * this.n.z;
    }

    /**
     * 获取摄像机位置，作为着色器参数之一
     */
    this.getEyeLoc = function(eyeLocation) {
        eyeLocation.x = this.eye.x, eyeLocation.y = this.eye.y, eyeLocation.z = this.eye.z;
    }

    this.updateDist = function() {
        let dist = Math.pow(this.eye.x, 2) + Math.pow(this.eye.y, 2) + Math.pow(this.eye.z, 2);
        this.distance = Math.pow(dist, 0.5);
    }

    /**
     * 获取摄像机与视点距离，用于修正near和far的值
     */
    this.getDist = function() {
        return this.distance;
    }

    this.updateEyeVec = function() {
        this.eVec.x = this.eye.x - this.look.x, this.eVec.y = this.eye.y - this.look.y, this.eVec.z = this.eye.z - this.look.z;
    }

    /**
     * 设置用户View矩阵
     */
    this.setUsrViewMatrix = function(viewMat) {
        this.u.set(viewMat[0], viewMat[4], viewMat[8]);
        this.v.set(viewMat[1], viewMat[5], viewMat[9]);
        this.n.set(viewMat[2], viewMat[6], viewMat[10]);

        let oriVec = vec3.create();
        oriVec[0] = -viewMat[12], oriVec[1] = -viewMat[13], oriVec[2] = -viewMat[14];
        let tmpMat = mat3.create();
        tmpMat[0] = this.u.x; tmpMat[3] = this.u.y; tmpMat[6] = this.u.z;
        tmpMat[1] = this.v.x; tmpMat[4] = this.v.y; tmpMat[7] = this.v.z;
        tmpMat[2] = this.n.x; tmpMat[5] = this.n.y; tmpMat[8] = this.n.z;
        let invertMat = mat3.create();
        mat3.invert(invertMat, tmpMat);

        let tmpVec = vec3.create();
        vec3.transformMat3(tmpVec, oriVec, invertMat);
        this.eVec.set(tmpVec[0], tmpVec[1], tmpVec[2]);
        this.eye.x = this.eVec.x + this.look.x;
        this.eye.y = this.eVec.y + this.look.y;
        this.eye.z = this.eVec.z + this.look.z;

        // this.setViewMatrix();
        this.viewMatrix[0] = viewMat[0]; this.viewMatrix[4] = viewMat[4]; this.viewMatrix[8] = viewMat[8]; this.viewMatrix[12] = viewMat[12];
        this.viewMatrix[1] = viewMat[1]; this.viewMatrix[5] = viewMat[5]; this.viewMatrix[9] = viewMat[9]; this.viewMatrix[13] = viewMat[13];
        this.viewMatrix[2] = viewMat[2]; this.viewMatrix[6] = viewMat[6]; this.viewMatrix[10] = viewMat[10]; this.viewMatrix[14] = viewMat[14];
        this.viewMatrix[3] = viewMat[3]; this.viewMatrix[7] = viewMat[7]; this.viewMatrix[11] = viewMat[11]; this.viewMatrix[15] = viewMat[15];
    }

    this.clear = function() {
        this.eye.set(0, 0, 0);
        this.look.set(0, 0, 0);
        this.up.set(0, 0, 0);
        this.n.set(0, 0, 0);
        this.u.set(0, 0, 0);
        this.v.set(0, 0, 0);
        this.upVec.set(0, 0, 0);
        this.eVec.set(0, 0, 0);
        mat4.identity(this.viewMatrix);
        mat4.identity(this.projectionMatrix);
        this.zNear = -1.0;
        this.zFar = -1.0;
        this.t.set(0, 0, 0);
        this.s.set(0, 0, 0);
    }

    this.getProjectScale = function(vWorldPos) {
        CalVec3TransformCoord(this.vViewPos, vWorldPos, this.viewMatrix);
        this.vViewPos.x = 0.0;
        this.vViewPos.y = 1.0;
        CalVec3TransformCoord(this.vPrjPos, this.vViewPos, this.projectionMatrix);

        return 1.0 / this.vPrjPos.y;
    }

    this.setCurCameraByAdfCamera = function(adfCamera) {
        this.setCamera(
            adfCamera._vEyePos.x - adfCamera._vFocus.x,
            adfCamera._vEyePos.y - adfCamera._vFocus.y,
            adfCamera._vEyePos.z - adfCamera._vFocus.z,
            0.0, 0.0, 0.0,
            adfCamera._vUp.x, adfCamera._vUp.y, adfCamera._vUp.z);
        
        this.zNear = this.adfCamera._fZNear;
        this.zFar = this.adfCamera._fZFar;

        this.updatePerspectiveMatrix();
        // to do
        g_glprogram.setModelCenter(adfCamera._vFocus);
    }

    this.setCurAdfCamera = function() {
        this.adfCamera._vEyePos.x = this.eye.x + g_glprogram.modelCenter.x;
        this.adfCamera._vEyePos.y = this.eye.y + g_glprogram.modelCenter.y;
        this.adfCamera._vEyePos.z = this.eye.z + g_glprogram.modelCenter.z,

        this.adfCamera._vFocus.x = g_glprogram.modelCenter.x;
        this.adfCamera._vFocus.y = g_glprogram.modelCenter.y;
        this.adfCamera._vFocus.z = g_glprogram.modelCenter.z;

        this.adfCamera._vUp.x = this.v.x;
        this.adfCamera._vUp.y = this.v.y;
        this.adfCamera._vUp.z = this.v.z,

        this.adfCamera._fFOVY = this.angle;
        this.adfCamera._fAspect = this.aspect;
        this.adfCamera._fZNear = this.zNear;
        this.adfCamera._fZFar = this.zFar;
    }

    this.setDstAdfCamera = function(dstAdfCamera) {
        if (dstAdfCamera != null) {
            this.dstCamera.Copy(dstAdfCamera);
        }
        this.curRatio = 0;
    }

    this.setDstAdfCameraParam = function(eyeX, eyeY, eyeZ, lookX, lookY, lookZ, upX, upY, upZ) {
        this.dstCamera._vEyePos.x = eyeX + g_glprogram.modelCenter.x;
        this.dstCamera._vEyePos.y = eyeY + g_glprogram.modelCenter.y;
        this.dstCamera._vEyePos.z = eyeZ + g_glprogram.modelCenter.z;

        this.dstCamera._vFocus.x = lookX + g_glprogram.modelCenter.x;
        this.dstCamera._vFocus.y = lookY + g_glprogram.modelCenter.y;
        this.dstCamera._vFocus.z = lookZ + g_glprogram.modelCenter.z;

        this.dstCamera._vUp.x = upX;
        this.dstCamera._vUp.y = upY;
        this.dstCamera._vUp.z = upZ,

        this.dstCamera._fFOVY = this.angle;
        this.dstCamera._fAspect = this.aspect;
        this.dstCamera._fZNear = this.zNear;
        this.dstCamera._fZFar = this.zFar;
    }

    this.shiftView = function(eyeX, eyeY, eyeZ, lookX, lookY, lookZ, upX, upY, upZ) {
        this.setCurAdfCamera();
        this.setDstAdfCameraParam(eyeX, eyeY, eyeZ, lookX, lookY, lookZ, upX, upY, upZ);
        this.shiftViewAnimRun();
    }

    this.shiftViewAnimRun = function() {
        if (this.animationTime < this.actionTime) {
            this.animationTime += this.animationFrameStep;
            this.curRatio = this.animationTime / this.actionTime;

            if (this.curRatio >= 1.0) {
                this.setCurCameraByAdfCamera(this.dstCamera);
                this.animationTime = 0;
                this.animationClock = null;
            } else {
                if (InterpolateCameraDataEx(this.dstCamera, this.adfCamera, this.curRatio, this.animCamera)) {
                    this.setCurCameraByAdfCamera(this.animCamera);
                    this.animationClock = setTimeout("g_camera.shiftViewAnimRun()", this.animationFrameStep);
                } else {
                    console.log("camera shift view error");
                    this.animationTime = 0;
                    this.animationClock = null;
                }
            }
        } else {
            if (this.animationClock != null) {
                clearTimeout(this.animationClock);
            }
            this.animationTime = 0;
            this.animationClock = null;
        }
    }

    this.slideView = function(eyeX, eyeY, eyeZ, lookX, lookY, lookZ) {
        this.setCurAdfCamera();
        this.setDstAdfCameraParam(eyeX, eyeY, eyeZ, lookX, lookY, lookZ, this.v.x, this.v.y, this.v.z);

        this.slideEyeDir.set(
            this.dstCamera._vEyePos.x - this.adfCamera._vEyePos.x,
            this.dstCamera._vEyePos.y - this.adfCamera._vEyePos.y,
            this.dstCamera._vEyePos.z - this.adfCamera._vEyePos.z
        );
        this.slideEyeDir.normalize();
        this.slideEyeDist = CalDistanceOfPoint3d(this.dstCamera._vEyePos, this.adfCamera._vEyePos);
        
        this.slideFocusDir.set(
            this.dstCamera._vFocus.x - this.adfCamera._vFocus.x,
            this.dstCamera._vFocus.y - this.adfCamera._vFocus.y,
            this.dstCamera._vFocus.z - this.adfCamera._vFocus.z
        );
        this.slideFocusDir.normalize();
        this.slideFocusDist = CalDistanceOfPoint3d(this.dstCamera._vFocus, this.adfCamera._vFocus);

        this.animCamera.Copy(this.adfCamera);
        
        this.shiftViewAnimRun();
    }

    this.slideViewAnimRun = function() {
        if (this.animationTime < this.actionTime) {
            this.animationTime += this.animationFrameStep;
            this.curRatio = this.animationTime / this.actionTime;

            // 线性插值，不作旋转
            this.animCamera._vEyePos.x = this.adfCamera._vEyePos.x + this.slideEyeDir.x * this.slideEyeDist * this.curRatio;
            this.animCamera._vEyePos.y = this.adfCamera._vEyePos.y + this.slideEyeDir.y * this.slideEyeDist * this.curRatio;
            this.animCamera._vEyePos.z = this.adfCamera._vEyePos.z + this.slideEyeDir.z * this.slideEyeDist * this.curRatio;

            this.animCamera._vFocus.x = this.adfCamera._vFocus.x + this.slideFocusDir.x * this.slideFocusDist * this.curRatio;
            this.animCamera._vFocus.y = this.adfCamera._vFocus.y + this.slideFocusDir.y * this.slideFocusDist * this.curRatio;
            this.animCamera._vFocus.z = this.adfCamera._vFocus.z + this.slideFocusDir.z * this.slideFocusDist * this.curRatio;

            this.setCurCameraByAdfCamera(this.animCamera);
            this.animationClock = setTimeout("g_camera.slideViewAnimRun()", this.animationFrameStep);
        } else {
            if (this.animationClock != null) {
                clearTimeout(this.animationClock);
            }
            this.animationTime = 0;
            this.animationClock = null;
        }
    }
}

