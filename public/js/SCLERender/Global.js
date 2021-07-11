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

// 默认数据
function DefaultData() {}
// 默认材质
DefaultData.DefaultMaterial = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.7, material._mtlPhysics.vDiffuse.y = 0.7, material._mtlPhysics.vDiffuse.z = 0.7,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.7, material._mtlPhysics.vAmbient.y = 0.7, material._mtlPhysics.vAmbient.z = 0.7,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.7, material._mtlPhysics.vSpecular.y = 0.7, material._mtlPhysics.vSpecular.z = 0.7,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}
// 默认红色
DefaultData.Red = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 1.0, material._mtlPhysics.vDiffuse.y = 0.0, material._mtlPhysics.vDiffuse.z = 0.0,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 1.0, material._mtlPhysics.vAmbient.y = 0.0, material._mtlPhysics.vAmbient.z = 0.0,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 1.0, material._mtlPhysics.vSpecular.y = 0.0, material._mtlPhysics.vSpecular.z = 0.0,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}
// 默认亮绿
DefaultData.Brightgreen = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.5, material._mtlPhysics.vDiffuse.y = 1.0, material._mtlPhysics.vDiffuse.z = 0.0,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.5, material._mtlPhysics.vAmbient.y = 1.0, material._mtlPhysics.vAmbient.z = 0.0,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.5, material._mtlPhysics.vSpecular.y = 1.0, material._mtlPhysics.vSpecular.z = 0.0,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认蓝色
DefaultData.Blue = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.0, material._mtlPhysics.vDiffuse.y = 0.0, material._mtlPhysics.vDiffuse.z = 1.0,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.0, material._mtlPhysics.vAmbient.y = 0.0, material._mtlPhysics.vAmbient.z = 1.0,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.0, material._mtlPhysics.vSpecular.y = 0.0, material._mtlPhysics.vSpecular.z = 1.0,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认黄色
DefaultData.Yellow = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 1.0, material._mtlPhysics.vDiffuse.y = 1.0, material._mtlPhysics.vDiffuse.z = 0.0,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 1.0, material._mtlPhysics.vAmbient.y = 1.0, material._mtlPhysics.vAmbient.z = 0.0,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 1.0, material._mtlPhysics.vSpecular.y = 1.0, material._mtlPhysics.vSpecular.z = 0.0,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认粉色
DefaultData.Pink = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 1.0, material._mtlPhysics.vDiffuse.y = 0.75, material._mtlPhysics.vDiffuse.z = 0.8,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 1.0, material._mtlPhysics.vAmbient.y = 0.75, material._mtlPhysics.vAmbient.z = 0.8,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 1.0, material._mtlPhysics.vSpecular.y = 0.75, material._mtlPhysics.vSpecular.z = 0.8,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认CyanGreen
DefaultData.CyanGreen = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.25, material._mtlPhysics.vDiffuse.y = 0.87, material._mtlPhysics.vDiffuse.z = 0.8,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.25, material._mtlPhysics.vAmbient.y = 0.87, material._mtlPhysics.vAmbient.z = 0.8,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.25, material._mtlPhysics.vSpecular.y = 0.87, material._mtlPhysics.vSpecular.z = 0.8,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认黑色
DefaultData.Black = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.0, material._mtlPhysics.vDiffuse.y = 0.0, material._mtlPhysics.vDiffuse.z = 0.0,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.0, material._mtlPhysics.vAmbient.y = 0.0, material._mtlPhysics.vAmbient.z = 0.0,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.0, material._mtlPhysics.vSpecular.y = 0.0, material._mtlPhysics.vSpecular.z = 0.0,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认白色
DefaultData.White = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 1.0, material._mtlPhysics.vDiffuse.y = 1.0, material._mtlPhysics.vDiffuse.z = 1.0,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 1.0, material._mtlPhysics.vAmbient.y = 1.0, material._mtlPhysics.vAmbient.z = 1.0,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 1.0, material._mtlPhysics.vSpecular.y = 1.0, material._mtlPhysics.vSpecular.z = 1.0,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认Grey
DefaultData.Grey = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.5, material._mtlPhysics.vDiffuse.y = 0.5, material._mtlPhysics.vDiffuse.z = 0.5,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.5, material._mtlPhysics.vAmbient.y = 0.5, material._mtlPhysics.vAmbient.z = 0.5,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.5, material._mtlPhysics.vSpecular.y = 0.5, material._mtlPhysics.vSpecular.z = 0.5,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认DarkRed
DefaultData.DarkRed = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.7, material._mtlPhysics.vDiffuse.y = 0.1, material._mtlPhysics.vDiffuse.z = 0.1,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.7, material._mtlPhysics.vAmbient.y = 0.1, material._mtlPhysics.vAmbient.z = 0.1,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.7, material._mtlPhysics.vSpecular.y = 0.1, material._mtlPhysics.vSpecular.z = 0.1,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认Green
DefaultData.Green = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.0, material._mtlPhysics.vDiffuse.y = 1.0, material._mtlPhysics.vDiffuse.z = 0.0,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.0, material._mtlPhysics.vAmbient.y = 1.0, material._mtlPhysics.vAmbient.z = 0.0,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.0, material._mtlPhysics.vSpecular.y = 1.0, material._mtlPhysics.vSpecular.z = 0.0,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认DarkBlue
DefaultData.DarkBlue = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.1, material._mtlPhysics.vDiffuse.y = 0.1, material._mtlPhysics.vDiffuse.z = 0.44,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.1, material._mtlPhysics.vAmbient.y = 0.1, material._mtlPhysics.vAmbient.z = 0.44,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.1, material._mtlPhysics.vSpecular.y = 0.1, material._mtlPhysics.vSpecular.z = 0.44,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认DarkYellow
DefaultData.DarkYellow = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 1.0, material._mtlPhysics.vDiffuse.y = 0.84, material._mtlPhysics.vDiffuse.z = 0.0,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 1.0, material._mtlPhysics.vAmbient.y = 0.84, material._mtlPhysics.vAmbient.z = 0.0,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 1.0, material._mtlPhysics.vSpecular.y = 0.84, material._mtlPhysics.vSpecular.z = 0.0,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认Violet
DefaultData.Violet = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.54, material._mtlPhysics.vDiffuse.y = 0.17, material._mtlPhysics.vDiffuse.z = 0.89,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.54, material._mtlPhysics.vAmbient.y = 0.17, material._mtlPhysics.vAmbient.z = 0.89,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.54, material._mtlPhysics.vSpecular.y = 0.17, material._mtlPhysics.vSpecular.z = 0.89,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认CyanBlue
DefaultData.CyanBlue = function() {
    var material = new ADF_MATERIAL();
    material._eMtlType = ADFMTLTYPE_PHYSICS;
    material._mtlPhysics.vDiffuse.x = 0.0, material._mtlPhysics.vDiffuse.y = 1.0, material._mtlPhysics.vDiffuse.z = 1.0,
        material._mtlPhysics.vDiffuse.w = 1.0;
    material._mtlPhysics.vAmbient.x = 0.0, material._mtlPhysics.vAmbient.y = 1.0, material._mtlPhysics.vAmbient.z = 1.0,
        material._mtlPhysics.vAmbient.w = 1.0; 
    material._mtlPhysics.vSpecular.x = 0.0, material._mtlPhysics.vSpecular.y = 1.0, material._mtlPhysics.vSpecular.z = 1.0,
        material._mtlPhysics.vSpecular.w = 1.0;
    material._mtlPhysics.vEmissive.x = 0.0, material._mtlPhysics.vEmissive.y = 0.0, material._mtlPhysics.vEmissive.z = 0.0,
        material._mtlPhysics.vEmissive.w = 1.0;
    material._mtlPhysics.fPower = 10;
    return material;
}

// 默认几何体
DefaultData.Cube = function() {
    // create a Cube
    var mesh = [
        1.0, 1.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,   // 1
        -1.0, 1.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // 2
        1.0, -1.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // 3

        -1.0, 1.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // 2
        1.0, -1.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // 3
        -1.0, -1.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // 4

        1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 0.0,   // 5
        1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0,    // 1
        1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 0.0,  // 7

        1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0,    // 1
        1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 0.0,  // 7
        1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0,   // 3

        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // 6
        1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0,   // 5
        -1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // 8

        1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0,   // 5
        -1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // 8
        1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // 7

        -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0,  // 2
        -1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, // 6
        -1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0, // 4

        -1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, // 6
        -1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0, // 4
        -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0,// 8

        1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 0.0,   // 5
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 0.0,  // 6
        1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0,    // 1

        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 0.0,  // 6
        1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0,    // 1
        -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0,   // 2

        1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 0.0,  // 3
        -1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 0.0, // 4
        1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 0.0, // 7

        -1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 0.0, // 4
        1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 0.0, // 7
        -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 0.0,// 8
    ];

    var subMeshCounts = [6, 6, 6, 6, 6, 6];
    
    return {
        vertex: mesh,
        surfaceVertexNum: subMeshCounts,
    };
}

// 远裁面
DefaultData.FarPlane = function() {
    var mesh = [
        -1.0, -1.0, 1.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 1.0, 0.0, 0.0,
        1.0, 1.0, 1.0, 0.0, 0.0,
        -1.0, 1.0, 1.0, 1.0, 0.0,
        -1.0, -1.0, 1.0, 1.0, 1.0];

    return {
        vertex: mesh,
        count: 6,
    };
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
        this._SurfaceBoxes.splice(0, this.surfaceBoxes.length);
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
    this._arrCurveVertexNum = new Array();
    this._boxset = new GL_BoxSet();
    this._uIsUV = 1;

    this.Clear = function() {
        if (this._arrVertex != null) {
            this._arrVertex.splice(0, this._arrVertex.length);
        }
        if (this._arrSubsetPrimitType != null) {
            this._arrSubsetPrimitType.splice(0, this._arrSubsetPrimitType.length);
        }
        this._arrSurfaceVertexNum.splice(0, this._arrSurfaceVertexNum.length);
        this._arrCurveVertexNum.splice(0, this._arrCurveVertexNum.length)
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

// 零件数据
// 1. 可包含一组LOD零件数据，这里仅为一层
function GL_PART() {
    this._arrPartLODData = new Array(1);

    this.Clear = function() {
        for (let i = 0; i < this._arrPartLODData.length; ++i) {
            this._arrPartLODData[i].Clear();
        }
        this._arrPartLODData.splice(0, this._arrPartLODData.length);
    }
}

// 零件数据集
function GL_PARTSET() {
    this._uLODLevel = 0;
    this._arrPartSet = new Array();

    this.Clear = function() {
        this._arrPartSet.splice(0, this._arrPartSet.length);
    }
}

// 材质集
function GL_MATERIALSET() {
    this._arrMaterialSet = new Array();

    this.Clear = function() {
        this._arrMaterialSet.splice(0, this._arrMaterialSet.length);
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
// 用于合并材质与材质分割
function GL_VAO_UNIT(num) {
    this.splitSize = 1;               // VAO被分割时记录
    this.splitFlags = null;
    this.arrVertexCounts = null;      // VAO顶点数量，数组长度等于合并的surface数量
    this.arrMaterialIndexs = null;    // VAO材质索引，数组长度等于合并的surface数量

    this.uintVertexNum = 0;           // 记录不变量
    this.uintMaterialIndex = 0;
    this.surfaceStart = -1;
    this.surfaceCount = 0;

    if (num < 0) {
        return;
    } else if (num == 0) {
        this.arrVertexCounts = new Array();
        this.arrMaterialIndexs = new Array();
    } else {
        this.arrVertexCounts = new Array();
        this.arrMaterialIndexs = new Array();
        for (let i = 0; i < num; ++i) {
            this.arrVertexCounts.push(0);
            this.arrMaterialIndexs.push(-1);
        }
    }
}

// GL绘制单元
// 分割Uint标志量
function GL_VAO_FLAG() {
    this.flag = false;
    this.fromIndex = 0;
    this.toIndex = 0;
}

//===================================================================================================
/**
 * GLProgram显示相关控制量
 */

 // 材质显示优先级
const GL_ORIGINAL         = 0;        // 模型原始材质
const GL_USERDEFINE       = 1;        // 用户设置零件材质
const GL_USERPICKED       = 2;        // 用户拾取零件材质
const GL_USERSURFACE      = 3;        // 用户拾取曲面材质

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