// File: MaterialDefine.js

/**
 * @author wujiali
 */
 
//===================================================================================================
var g_newMaterialID = 200000;

// 三角面片材质数据
function MeshMaterialData() {
    // 默认材质
    this.Default = new ADF_MTL_SAVEDATA();
        this.Default._uMtlID = -1;
        this.Default._strName = "默认材质";
        this.Default._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.Default._MtlData._mtlPhysics.vDiffuse.x = 0.7, this.Default._MtlData._mtlPhysics.vDiffuse.y = 0.7, this.Default._MtlData._mtlPhysics.vDiffuse.z = 0.7,
            this.Default._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.Default._MtlData._mtlPhysics.vAmbient.x = 0.7, this.Default._MtlData._mtlPhysics.vAmbient.y = 0.7, this.Default._MtlData._mtlPhysics.vAmbient.z = 0.7,
            this.Default._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.Default._MtlData._mtlPhysics.vSpecular.x = 0.7, this.Default._MtlData._mtlPhysics.vSpecular.y = 0.7, this.Default._MtlData._mtlPhysics.vSpecular.z = 0.7,
            this.Default._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.Default._MtlData._mtlPhysics.vEmissive.x = 0.0, this.Default._MtlData._mtlPhysics.vEmissive.y = 0.0, this.Default._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.Default._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.Default._MtlData._mtlPhysics.fPower = 10;

    // 默认红色
    this.Red = new ADF_MTL_SAVEDATA();
        this.Red._uMtlID = 100;
        this.Red._strName = "默认红色";
        this.Red._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.Red._MtlData._mtlPhysics.vDiffuse.x = 1.0, this.Red._MtlData._mtlPhysics.vDiffuse.y = 0.0, this.Red._MtlData._mtlPhysics.vDiffuse.z = 0.0,
            this.Red._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.Red._MtlData._mtlPhysics.vAmbient.x = 1.0, this.Red._MtlData._mtlPhysics.vAmbient.y = 0.0, this.Red._MtlData._mtlPhysics.vAmbient.z = 0.0,
            this.Red._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.Red._MtlData._mtlPhysics.vSpecular.x = 1.0, this.Red._MtlData._mtlPhysics.vSpecular.y = 0.0, this.Red._MtlData._mtlPhysics.vSpecular.z = 0.0,
            this.Red._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.Red._MtlData._mtlPhysics.vEmissive.x = 0.0, this.Red._MtlData._mtlPhysics.vEmissive.y = 0.0, this.Red._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.Red._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.Red._MtlData._mtlPhysics.fPower = 10;

    // 默认亮绿
    this.Brightgreen = new ADF_MTL_SAVEDATA();
        this.Brightgreen._uMtlID = 101;
        this.Brightgreen._strName = "默认亮绿色";
        this.Brightgreen._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.Brightgreen._MtlData._mtlPhysics.vDiffuse.x = 0.5, this.Brightgreen._MtlData._mtlPhysics.vDiffuse.y = 1.0, this.Brightgreen._MtlData._mtlPhysics.vDiffuse.z = 0.0,
            this.Brightgreen._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.Brightgreen._MtlData._mtlPhysics.vAmbient.x = 0.5, this.Brightgreen._MtlData._mtlPhysics.vAmbient.y = 1.0, this.Brightgreen._MtlData._mtlPhysics.vAmbient.z = 0.0,
            this.Brightgreen._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.Brightgreen._MtlData._mtlPhysics.vSpecular.x = 0.5, this.Brightgreen._MtlData._mtlPhysics.vSpecular.y = 1.0, this.Brightgreen._MtlData._mtlPhysics.vSpecular.z = 0.0,
            this.Brightgreen._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.Brightgreen._MtlData._mtlPhysics.vEmissive.x = 0.0, this.Brightgreen._MtlData._mtlPhysics.vEmissive.y = 0.0, this.Brightgreen._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.Brightgreen._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.Brightgreen._MtlData._mtlPhysics.fPower = 10;

    // 默认蓝色
    this.Blue = new ADF_MTL_SAVEDATA();
        this.Blue._uMtlID = 102;
        this.Blue._strName = "默认蓝色";
        this.Blue._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.Blue._MtlData._mtlPhysics.vDiffuse.x = 0.0, this.Blue._MtlData._mtlPhysics.vDiffuse.y = 0.0, this.Blue._MtlData._mtlPhysics.vDiffuse.z = 1.0,
            this.Blue._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.Blue._MtlData._mtlPhysics.vAmbient.x = 0.0, this.Blue._MtlData._mtlPhysics.vAmbient.y = 0.0, this.Blue._MtlData._mtlPhysics.vAmbient.z = 1.0,
            this.Blue._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.Blue._MtlData._mtlPhysics.vSpecular.x = 0.0, this.Blue._MtlData._mtlPhysics.vSpecular.y = 0.0, this.Blue._MtlData._mtlPhysics.vSpecular.z = 1.0,
            this.Blue._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.Blue._MtlData._mtlPhysics.vEmissive.x = 0.0, this.Blue._MtlData._mtlPhysics.vEmissive.y = 0.0, this.Blue._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.Blue._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.Blue._MtlData._mtlPhysics.fPower = 10;

    // 默认黄色
    this.Yellow = new ADF_MTL_SAVEDATA();
        this.Yellow._uMtlID = 103;
        this.Yellow._strName = "默认黄色";
        this.Yellow._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.Yellow._MtlData._mtlPhysics.vDiffuse.x = 1.0, this.Yellow._MtlData._mtlPhysics.vDiffuse.y = 1.0, this.Yellow._MtlData._mtlPhysics.vDiffuse.z = 0.0,
            this.Yellow._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.Yellow._MtlData._mtlPhysics.vAmbient.x = 1.0, this.Yellow._MtlData._mtlPhysics.vAmbient.y = 1.0, this.Yellow._MtlData._mtlPhysics.vAmbient.z = 0.0,
            this.Yellow._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.Yellow._MtlData._mtlPhysics.vSpecular.x = 1.0, this.Yellow._MtlData._mtlPhysics.vSpecular.y = 1.0, this.Yellow._MtlData._mtlPhysics.vSpecular.z = 0.0,
            this.Yellow._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.Yellow._MtlData._mtlPhysics.vEmissive.x = 0.0, this.Yellow._MtlData._mtlPhysics.vEmissive.y = 0.0, this.Yellow._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.Yellow._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.Yellow._MtlData._mtlPhysics.fPower = 10;

    // 默认粉色
    this.Pink = new ADF_MTL_SAVEDATA();
        this.Pink._uMtlID = 104;
        this.Pink._strName = "默认粉色";
        this.Pink._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.Pink._MtlData._mtlPhysics.vDiffuse.x = 1.0, this.Pink._MtlData._mtlPhysics.vDiffuse.y = 0.75, this.Pink._MtlData._mtlPhysics.vDiffuse.z = 0.8,
            this.Pink._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.Pink._MtlData._mtlPhysics.vAmbient.x = 1.0, this.Pink._MtlData._mtlPhysics.vAmbient.y = 0.75, this.Pink._MtlData._mtlPhysics.vAmbient.z = 0.8,
            this.Pink._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.Pink._MtlData._mtlPhysics.vSpecular.x = 1.0, this.Pink._MtlData._mtlPhysics.vSpecular.y = 0.75, this.Pink._MtlData._mtlPhysics.vSpecular.z = 0.8,
            this.Pink._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.Pink._MtlData._mtlPhysics.vEmissive.x = 0.0, this.Pink._MtlData._mtlPhysics.vEmissive.y = 0.0, this.Pink._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.Pink._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.Pink._MtlData._mtlPhysics.fPower = 10;


    // 默认CyanGreen
    this.CyanGreen = new ADF_MTL_SAVEDATA();
        this.CyanGreen._uMtlID = 105;
        this.CyanGreen._strName = "默认青绿色";
        this.CyanGreen._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.CyanGreen._MtlData._mtlPhysics.vDiffuse.x = 0.25, this.CyanGreen._MtlData._mtlPhysics.vDiffuse.y = 0.87, this.CyanGreen._MtlData._mtlPhysics.vDiffuse.z = 0.8,
            this.CyanGreen._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.CyanGreen._MtlData._mtlPhysics.vAmbient.x = 0.25, this.CyanGreen._MtlData._mtlPhysics.vAmbient.y = 0.87, this.CyanGreen._MtlData._mtlPhysics.vAmbient.z = 0.8,
            this.CyanGreen._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.CyanGreen._MtlData._mtlPhysics.vSpecular.x = 0.25, this.CyanGreen._MtlData._mtlPhysics.vSpecular.y = 0.87, this.CyanGreen._MtlData._mtlPhysics.vSpecular.z = 0.8,
            this.CyanGreen._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.CyanGreen._MtlData._mtlPhysics.vEmissive.x = 0.0, this.CyanGreen._MtlData._mtlPhysics.vEmissive.y = 0.0, this.CyanGreen._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.CyanGreen._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.CyanGreen._MtlData._mtlPhysics.fPower = 10;

    // 默认黑色
    this.Black = new ADF_MTL_SAVEDATA();
        this.Black._uMtlID = 106;
        this.Black._strName = "默认黑色";
        this.Black._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.Black._MtlData._mtlPhysics.vDiffuse.x = 0.0, this.Black._MtlData._mtlPhysics.vDiffuse.y = 0.0, this.Black._MtlData._mtlPhysics.vDiffuse.z = 0.0,
            this.Black._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.Black._MtlData._mtlPhysics.vAmbient.x = 0.0, this.Black._MtlData._mtlPhysics.vAmbient.y = 0.0, this.Black._MtlData._mtlPhysics.vAmbient.z = 0.0,
            this.Black._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.Black._MtlData._mtlPhysics.vSpecular.x = 0.0, this.Black._MtlData._mtlPhysics.vSpecular.y = 0.0, this.Black._MtlData._mtlPhysics.vSpecular.z = 0.0,
            this.Black._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.Black._MtlData._mtlPhysics.vEmissive.x = 0.0, this.Black._MtlData._mtlPhysics.vEmissive.y = 0.0, this.Black._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.Black._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.Black._MtlData._mtlPhysics.fPower = 10;

    // 默认白色
    this.White = new ADF_MTL_SAVEDATA();
        this.White._uMtlID = 107;
        this.White._strName = "默认白色";
        this.White._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.White._MtlData._mtlPhysics.vDiffuse.x = 1.0, this.White._MtlData._mtlPhysics.vDiffuse.y = 1.0, this.White._MtlData._mtlPhysics.vDiffuse.z = 1.0,
            this.White._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.White._MtlData._mtlPhysics.vAmbient.x = 1.0, this.White._MtlData._mtlPhysics.vAmbient.y = 1.0, this.White._MtlData._mtlPhysics.vAmbient.z = 1.0,
            this.White._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.White._MtlData._mtlPhysics.vSpecular.x = 1.0, this.White._MtlData._mtlPhysics.vSpecular.y = 1.0, this.White._MtlData._mtlPhysics.vSpecular.z = 1.0,
            this.White._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.White._MtlData._mtlPhysics.vEmissive.x = 0.0, this.White._MtlData._mtlPhysics.vEmissive.y = 0.0, this.White._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.White._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.White._MtlData._mtlPhysics.fPower = 10;

    // 默认Grey
    this.Grey = new ADF_MTL_SAVEDATA();
        this.Grey._uMtlID = 108;
        this.Grey._strName = "默认灰色";
        this.Grey._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.Grey._MtlData._mtlPhysics.vDiffuse.x = 0.5, this.Grey._MtlData._mtlPhysics.vDiffuse.y = 0.5, this.Grey._MtlData._mtlPhysics.vDiffuse.z = 0.5,
            this.Grey._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.Grey._MtlData._mtlPhysics.vAmbient.x = 0.5, this.Grey._MtlData._mtlPhysics.vAmbient.y = 0.5, this.Grey._MtlData._mtlPhysics.vAmbient.z = 0.5,
            this.Grey._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.Grey._MtlData._mtlPhysics.vSpecular.x = 0.5, this.Grey._MtlData._mtlPhysics.vSpecular.y = 0.5, this.Grey._MtlData._mtlPhysics.vSpecular.z = 0.5,
            this.Grey._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.Grey._MtlData._mtlPhysics.vEmissive.x = 0.0, this.Grey._MtlData._mtlPhysics.vEmissive.y = 0.0, this.Grey._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.Grey._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.Grey._MtlData._mtlPhysics.fPower = 10;

    // 默认DarkRed
    this.DarkRed = new ADF_MTL_SAVEDATA();
        this.DarkRed._uMtlID = 109;
        this.DarkRed._strName = "默认深红色";
        this.DarkRed._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.DarkRed._MtlData._mtlPhysics.vDiffuse.x = 0.7, this.DarkRed._MtlData._mtlPhysics.vDiffuse.y = 0.1, this.DarkRed._MtlData._mtlPhysics.vDiffuse.z = 0.1,
            this.DarkRed._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.DarkRed._MtlData._mtlPhysics.vAmbient.x = 0.7, this.DarkRed._MtlData._mtlPhysics.vAmbient.y = 0.1, this.DarkRed._MtlData._mtlPhysics.vAmbient.z = 0.1,
            this.DarkRed._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.DarkRed._MtlData._mtlPhysics.vSpecular.x = 0.7, this.DarkRed._MtlData._mtlPhysics.vSpecular.y = 0.1, this.DarkRed._MtlData._mtlPhysics.vSpecular.z = 0.1,
            this.DarkRed._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.DarkRed._MtlData._mtlPhysics.vEmissive.x = 0.0, this.DarkRed._MtlData._mtlPhysics.vEmissive.y = 0.0, this.DarkRed._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.DarkRed._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.DarkRed._MtlData._mtlPhysics.fPower = 10;

    // 默认Green
    this.Green = new ADF_MTL_SAVEDATA();
        this.Green._uMtlID = 110;
        this.Green._strName = "默认绿色";
        this.Green._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.Green._MtlData._mtlPhysics.vDiffuse.x = 0.0, this.Green._MtlData._mtlPhysics.vDiffuse.y = 1.0, this.Green._MtlData._mtlPhysics.vDiffuse.z = 0.0,
            this.Green._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.Green._MtlData._mtlPhysics.vAmbient.x = 0.0, this.Green._MtlData._mtlPhysics.vAmbient.y = 1.0, this.Green._MtlData._mtlPhysics.vAmbient.z = 0.0,
            this.Green._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.Green._MtlData._mtlPhysics.vSpecular.x = 0.0, this.Green._MtlData._mtlPhysics.vSpecular.y = 1.0, this.Green._MtlData._mtlPhysics.vSpecular.z = 0.0,
            this.Green._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.Green._MtlData._mtlPhysics.vEmissive.x = 0.0, this.Green._MtlData._mtlPhysics.vEmissive.y = 0.0, this.Green._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.Green._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.Green._MtlData._mtlPhysics.fPower = 10;

    // 默认DarkBlue
    this.DarkBlue = new ADF_MTL_SAVEDATA();
        this.DarkBlue._uMtlID = 111;
        this.DarkBlue._strName = "默认深蓝色";
        this.DarkBlue._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.DarkBlue._MtlData._mtlPhysics.vDiffuse.x = 0.1, this.DarkBlue._MtlData._mtlPhysics.vDiffuse.y = 0.1, this.DarkBlue._MtlData._mtlPhysics.vDiffuse.z = 0.44,
            this.DarkBlue._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.DarkBlue._MtlData._mtlPhysics.vAmbient.x = 0.1, this.DarkBlue._MtlData._mtlPhysics.vAmbient.y = 0.1, this.DarkBlue._MtlData._mtlPhysics.vAmbient.z = 0.44,
            this.DarkBlue._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.DarkBlue._MtlData._mtlPhysics.vSpecular.x = 0.1, this.DarkBlue._MtlData._mtlPhysics.vSpecular.y = 0.1, this.DarkBlue._MtlData._mtlPhysics.vSpecular.z = 0.44,
            this.DarkBlue._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.DarkBlue._MtlData._mtlPhysics.vEmissive.x = 0.0, this.DarkBlue._MtlData._mtlPhysics.vEmissive.y = 0.0, this.DarkBlue._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.DarkBlue._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.DarkBlue._MtlData._mtlPhysics.fPower = 10;

    // 默认DarkYellow
    this.DarkYellow = new ADF_MTL_SAVEDATA();
        this.DarkYellow._uMtlID = 112;
        this.DarkYellow._strName = "默认深黄色";
        this.DarkYellow._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.DarkYellow._MtlData._mtlPhysics.vDiffuse.x = 1.0, this.DarkYellow._MtlData._mtlPhysics.vDiffuse.y = 0.84, this.DarkYellow._MtlData._mtlPhysics.vDiffuse.z = 0.0,
            this.DarkYellow._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.DarkYellow._MtlData._mtlPhysics.vAmbient.x = 1.0, this.DarkYellow._MtlData._mtlPhysics.vAmbient.y = 0.84, this.DarkYellow._MtlData._mtlPhysics.vAmbient.z = 0.0,
            this.DarkYellow._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.DarkYellow._MtlData._mtlPhysics.vSpecular.x = 1.0, this.DarkYellow._MtlData._mtlPhysics.vSpecular.y = 0.84, this.DarkYellow._MtlData._mtlPhysics.vSpecular.z = 0.0,
            this.DarkYellow._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.DarkYellow._MtlData._mtlPhysics.vEmissive.x = 0.0, this.DarkYellow._MtlData._mtlPhysics.vEmissive.y = 0.0, this.DarkYellow._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.DarkYellow._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.DarkYellow._MtlData._mtlPhysics.fPower = 10;

    // 默认Violet
    this.Violet = new ADF_MTL_SAVEDATA();
        this.Violet._uMtlID = 113;
        this.Violet._strName = "默认紫色";
        this.Violet._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.Violet._MtlData._mtlPhysics.vDiffuse.x = 0.54, this.Violet._MtlData._mtlPhysics.vDiffuse.y = 0.17, this.Violet._MtlData._mtlPhysics.vDiffuse.z = 0.89,
            this.Violet._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.Violet._MtlData._mtlPhysics.vAmbient.x = 0.54, this.Violet._MtlData._mtlPhysics.vAmbient.y = 0.17, this.Violet._MtlData._mtlPhysics.vAmbient.z = 0.89,
            this.Violet._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.Violet._MtlData._mtlPhysics.vSpecular.x = 0.54, this.Violet._MtlData._mtlPhysics.vSpecular.y = 0.17, this.Violet._MtlData._mtlPhysics.vSpecular.z = 0.89,
            this.Violet._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.Violet._MtlData._mtlPhysics.vEmissive.x = 0.0, this.Violet._MtlData._mtlPhysics.vEmissive.y = 0.0, this.Violet._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.Violet._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.Violet._MtlData._mtlPhysics.fPower = 10;

    // 默认CyanBlue
    this.CyanBlue = new ADF_MTL_SAVEDATA();
        this.CyanBlue._uMtlID = 114;
        this.CyanBlue._strName = "默认青蓝色";
        this.CyanBlue._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
        this.CyanBlue._MtlData._mtlPhysics.vDiffuse.x = 0.0, this.CyanBlue._MtlData._mtlPhysics.vDiffuse.y = 1.0, this.CyanBlue._MtlData._mtlPhysics.vDiffuse.z = 1.0,
            this.CyanBlue._MtlData._mtlPhysics.vDiffuse.w = 1.0;
        this.CyanBlue._MtlData._mtlPhysics.vAmbient.x = 0.0, this.CyanBlue._MtlData._mtlPhysics.vAmbient.y = 1.0, this.CyanBlue._MtlData._mtlPhysics.vAmbient.z = 1.0,
            this.CyanBlue._MtlData._mtlPhysics.vAmbient.w = 1.0; 
        this.CyanBlue._MtlData._mtlPhysics.vSpecular.x = 0.0, this.CyanBlue._MtlData._mtlPhysics.vSpecular.y = 1.0, this.CyanBlue._MtlData._mtlPhysics.vSpecular.z = 1.0,
            this.CyanBlue._MtlData._mtlPhysics.vSpecular.w = 1.0;
        this.CyanBlue._MtlData._mtlPhysics.vEmissive.x = 0.0, this.CyanBlue._MtlData._mtlPhysics.vEmissive.y = 0.0, this.CyanBlue._MtlData._mtlPhysics.vEmissive.z = 0.0,
            this.CyanBlue._MtlData._mtlPhysics.vEmissive.w = 1.0;
        this.CyanBlue._MtlData._mtlPhysics.fPower = 10;
}

// 曲线材质数据
function LineMaterialData() {
    // 默认材质
    this.DefaultMaterial = new ADF_BASEFLOAT4();
        this.DefaultMaterial.x = 0.7, this.DefaultMaterial.y = 0.7, this.DefaultMaterial.z = 0.7, this.DefaultMaterial.w = 1.0;

    // 默认红色
    this.Red = new ADF_BASEFLOAT4();
        this.Red.x = 1.0, this.Red.y = 0.0, this.Red.z = 0.0, this.Red.w = 1.0;
        
    // 默认亮绿
    this.Brightgreen = new ADF_BASEFLOAT4();
        this.Brightgreen.x = 0.5, this.Brightgreen.y = 1.0, this.Brightgreen.z = 0.0, this.Brightgreen.w = 1.0;
        
    // 默认CyanBlue
    this.CyanBlue = new ADF_BASEFLOAT4();
        this.CyanBlue.x = 0.0, this.CyanBlue.y = 1.0, this.CyanBlue.z = 1.0, this.CyanBlue.w = 1.0;
        
    // 默认DarkYellow
    this.DarkYellow = new ADF_BASEFLOAT4();
        this.DarkYellow.x = 1.0, this.DarkYellow.y = 0.84, this.DarkYellow.z = 0.0, this.DarkYellow.w = 1.0;
}

function ConvertColorToMaterial(red, green, blue, alpha) {
    if (red < 0.0) {red = 0.0;}
    if (red > 1.0) {red = 1.0;}
    if (green < 0.0) {green = 0.0;}
    if (green > 1.0) {green = 1.0;}
    if (blue < 0.0) {blue = 0.0;}
    if (blue > 1.0) {blue = 1.0;}

    let material  = new ADF_MTL_SAVEDATA();
    material._uMtlID = g_newMaterialID++;
    material._strName = "用户自定义";
    material._MtlData._eMtlType = ADFMTLTYPE_PHYSICS;
    material._MtlData._mtlPhysics.fPower = 10.0;
    material._MtlData._mtlPhysics.vAmbient.x = red, material._MtlData._mtlPhysics.vAmbient.y = green, material._MtlData._mtlPhysics.vAmbient.z = blue, material._MtlData._mtlPhysics.vAmbient.w = 1.0;
    material._MtlData._mtlPhysics.vDiffuse.x = red, material._MtlData._mtlPhysics.vDiffuse.y = green, material._MtlData._mtlPhysics.vDiffuse.z = blue, material._MtlData._mtlPhysics.vDiffuse.w = 1.0;
    material._MtlData._mtlPhysics.vEmissive.x = 0.0, material._MtlData._mtlPhysics.vEmissive.y = 0.0, material._MtlData._mtlPhysics.vEmissive.z = 0.0, material._MtlData._mtlPhysics.vEmissive.w = alpha;
    material._MtlData._mtlPhysics.vSpecular.x = red, material._MtlData._mtlPhysics.vSpecular.y = green, material._MtlData._mtlPhysics.vSpecular.z = blue, material._MtlData._mtlPhysics.vSpecular.w = 1.0;

    return material;
}
