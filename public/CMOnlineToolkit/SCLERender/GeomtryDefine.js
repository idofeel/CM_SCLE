// File: GeomtryDefine.js

/**
 * @author wujiali
 */
 
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

function Point4(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    this.set = function(xx, yy, zz, ww) {
        this.x = xx;
        this.y = yy;
        this.z = zz;
        this.w = ww;
    }

    this.copy = function() {
        let copyPt = new Point4(this.x, this.y, this.z, this.w);
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
        let len = Math.pow(base, 0.5);
        this.x = this.x / len;
        this.y = this.y / len;
        this.z = this.z / len;
    }

    this.cross = function(b, vecOut) {
        vecOut.x = this.y*b.z - this.z*b.y;
        vecOut.y = this.z*b.x - this.x*b.z;
        vecOut.z = this.x*b.y - this.y*b.x;
        vecOut.normalize();
    }

    this.dot = function(b) {
        return this.x*b.x + this.y*b.y + this.z*b.z;
    }

    this.copy = function(vec3) {
        this.x = vec3.x;
        this.y = vec3.y;
        this.z = vec3.z;
    }

    this.angle = function(vec3) {
        return Math.acos(this.dot(vec3));
    }

    this.equal = function(vec3) {
        return (this.x == vec3.x && this.y == vec3.y && this.z == vec3.z) ? true : false;
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

function GL_BBox() {
    this._min = new Point3(0, 0, 0);
    this._max = new Point3(0, 0, 0);
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

function GL_Box_Vertex_Index() {
    this.vertexIndex = new Array();

    // 包围盒6各面拆成12个三角形
    this.vertexIndex.push(0); this.vertexIndex.push(1); this.vertexIndex.push(3);
    this.vertexIndex.push(0); this.vertexIndex.push(2); this.vertexIndex.push(3);
    this.vertexIndex.push(0); this.vertexIndex.push(1); this.vertexIndex.push(5);
    this.vertexIndex.push(0); this.vertexIndex.push(4); this.vertexIndex.push(5);
    this.vertexIndex.push(0); this.vertexIndex.push(2); this.vertexIndex.push(6);
    this.vertexIndex.push(0); this.vertexIndex.push(4); this.vertexIndex.push(6);
    this.vertexIndex.push(7); this.vertexIndex.push(5); this.vertexIndex.push(4);
    this.vertexIndex.push(7); this.vertexIndex.push(6); this.vertexIndex.push(4);
    this.vertexIndex.push(7); this.vertexIndex.push(5); this.vertexIndex.push(1);
    this.vertexIndex.push(7); this.vertexIndex.push(3); this.vertexIndex.push(1);
    this.vertexIndex.push(7); this.vertexIndex.push(3); this.vertexIndex.push(2);
    this.vertexIndex.push(7); this.vertexIndex.push(6); this.vertexIndex.push(2);
}

// 远裁面，背景贴图使用
function GL_FarPlane() {
    this.vertex = [
        -1.0, -1.0, 1.0, 0.0, 1.0,
        1.0, -1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 0.0,
        1.0, 1.0, 1.0, 1.0, 0.0,
        -1.0, 1.0, 1.0, 0.0, 0.0,
        -1.0, -1.0, 1.0, 0.0, 1.0];

    this.count = 6;
}

/** 立方体 */
function Cube() {
    // create a Cube
    this.mesh = [
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

    this.subMeshCounts = [6, 6, 6, 6, 6, 6];
}

