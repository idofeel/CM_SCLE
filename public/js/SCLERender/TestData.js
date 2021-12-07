// File: Test.js

/**
 * @author wujiali
 */
 
//===================================================================================================

function TestData() {}

// 默认几何体
TestData.Cube = function() {
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

/**
 * 测试，两个立方体
 * 返回：GLObjectSet    立方体实例数据集
 *      GLPartSet      立方体零件数据集
 *      GLMatertalSet  材质数据�?
 */
 function TestCube() {
    var Cube = TestData.Cube();
    var CubeLODPart = new GL_PARTLODDATA();
    CubeLODPart._arrVertex = Cube.vertex;
    CubeLODPart._arrSurfaceVertexNum = Cube.surfaceVertexNum;
    var CubePart = new GL_PART();
    CubePart._arrPartLODData.push(CubeLODPart);
    var partSet = new GL_PARTSET();
    partSet._arrPartSet.push(CubePart);

    var matertalSet = new GL_MATERIALSET();
    var defaultMtl = new ADF_MTL_SAVEDATA();
    defaultMtl._uMtlID = 20000;
    defaultMtl._strName = "默认材质";
    defaultMtl._MtlData = g_materialData.Default;
    matertalSet._arrMaterialSet.push(defaultMtl);
    var pinkMtl = new ADF_MTL_SAVEDATA();
    pinkMtl._uMtlID = 20001;
    pinkMtl._strName = "粉色材质";
    pinkMtl._MtlData = g_materialData.Pink;
    matertalSet._arrMaterialSet.push(pinkMtl);
    var greenMtl = new ADF_MTL_SAVEDATA();
    greenMtl._uMtlID = 20002;
    greenMtl._strName = "绿色材质";
    greenMtl._MtlData = g_materialData.Green;
    matertalSet._arrMaterialSet.push(greenMtl);

    var object1 = new GL_OBJECT();
    object1._uPartIndex = 0;
    object1._arrSurfaceMaterialIndex.push(0);
    object1._arrSurfaceMaterialIndex.push(1);
    object1._arrSurfaceMaterialIndex.push(2);
    object1._arrSurfaceMaterialIndex.push(0);
    object1._arrSurfaceMaterialIndex.push(1);
    object1._arrSurfaceMaterialIndex.push(2);
    object1._uObjectVertexNum = 36;
    var object2 = new GL_OBJECT();
    object2._uPartIndex = 0;
    object2._arrSurfaceMaterialIndex.push(1);
    object2._arrSurfaceMaterialIndex.push(1);
    object2._arrSurfaceMaterialIndex.push(1);
    object2._arrSurfaceMaterialIndex.push(1);
    object2._arrSurfaceMaterialIndex.push(1);
    object2._arrSurfaceMaterialIndex.push(1);
    object2._uObjectVertexNum = 36;
    var matTmp = mat4.create();
    var trans = vec3.create();
    trans[0] = -2;
    trans[2] = -2;
    object2._matObject = mat4.translate(matTmp, object2._matObject, trans);
    var objectSet = new GL_OBJECTSET();
    objectSet._arrObjectSet.push(object1);
    objectSet._arrObjectSet.push(object2);

    return {
        GLObjectSet: objectSet,
        GLPartSet: partSet,
        GLMatertalSet: matertalSet,
    };
}
