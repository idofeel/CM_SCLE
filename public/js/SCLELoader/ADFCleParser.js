//===================================================================================================

// CLE数据流的数据集类�?
// 系统数据�?
let	CSDST_SYS_NULL = 0;			        // 位置类型
let	CSDST_SYS_MODEL = 1;			    // 模型�?
let	CSDST_SYS_LODMODEL = 2;				// LOD模型数据�?
let	CSDST_SYS_MODELTREE = 3;			// 模型�?
let	CSDST_SYS_OBJECT = 4;				// 物件数据
let	CSDST_SYS_MATERIAL = 5;				// 材质数据
let	CSDST_SYS_ANIMATION = 6;			// 动画数据
let	CSDST_SYS_CAMERA = 7;				// 摄像机数�?
let	CSDST_SYS_CONFIG = 8;				// 配置选项数据
let	CSDST_SYS_TIMENODETREE = 9;			// 时间节点�?工艺规程)
let	CSDST_SYS_SCENEPARAM = 10;			// 场景参数数据
let	CSDST_SYS_IMAGEFILEINFO = 11;		// 图片文件信息
let	CSDST_SYS_AUDIOFILEINFO = 12;		// 音频文件信息
let	CSDST_SYS_DOCFILEINFO = 13;			// 文档文件信息
let	CSDST_SYS_VIDEOFILEINFO = 14;		// 视频文件信息
let	CSDST_SYS_COMMENT = 15;				// 批注数据

// 系统内部使用的数据集
let	CSDST_SYS_MODELDATA = 1001;			// 模型数据
let	CSDST_SYS_ANNOTATIONDATA = 1002;	// 标注(单个)数据
let	CSDST_SYS_END = 10000;				// 系统数据集类型的终止编号
let	CSDST_RES_FILE = 10001;				// 文件
var g_strCopy = "y雪x峰f版权所有：圜晖科技，请申请正式授权!";

// var g_strCopy = "y雪x峰f哈电电机";

//===================================================================================================

// CLE数据流的数据集描�?
function CleStreamDataSetDesc() {  
    this._type = CSDST_SYS_NULL;            // 类型，参看枚举型CSDataSetType，Int32
    this._size = 0;                         // 长度(单位:字节)，Uint32
}

// 是否解析精确数据
var g_bParsejq = true;
// 资源文件个数
var g_nResFileCount = 0;
// 资源文件的存储路�?
var g_strResbaseUrl;

//===================================================================================================

// cle数据存储, DataView数据
var g_arrayCleBuffer;
var g_arrayByteBuffer;
var g_nCleBufferlength = 0;

//===================================================================================================

// cle数据�?
function ADFCleParser() {
    // 读取的当前位置，Uint32
    this._cur_pos = 0;
    // 当前cle文件的版本号
    this._curVersion = 0;                             
 
    this.parseStreamADF_BYTE = function() {
        this._last_pos = this._cur_pos;
        this._cur_pos += 1;
        return g_arrayCleBuffer.getInt8(this._last_pos, true);	
    }

    this.parseStreamADF_INT = function() {
        this._last_pos = this._cur_pos;
        this._cur_pos += 4;
        return g_arrayCleBuffer.getInt32(this._last_pos, true);	
    }
    
    this.parseStreamADF_UINT16 = function(){
        this._last_pos = this._cur_pos;
        this._cur_pos += 2;
        return g_arrayCleBuffer.getUint16(this._last_pos, true);	
    }

    this.parseStreamADF_UINT = function(){
        this._last_pos = this._cur_pos;
        this._cur_pos += 4;
        return g_arrayCleBuffer.getUint32(this._last_pos, true);	
    }
    
    this.parseStreamADF_FLOAT = function(){
        this._last_pos = this._cur_pos;
        this._cur_pos += 4;
        return g_arrayCleBuffer.getFloat32(this._last_pos, true);
    }

    this.parseStreamADF_DOUBLE = function(){
        this._last_pos = this._cur_pos;
        this._cur_pos += 8;
        return g_arrayCleBuffer.getFloat64(this._last_pos, true);
    }

    this.parseStreamADF_BASEUINT2 = function(data){
        this._last_pos = this._cur_pos;
        this._cur_pos += 4*2;
        data.x = g_arrayCleBuffer.getUint32(this._last_pos, true);
        data.y = g_arrayCleBuffer.getUint32(this._last_pos+4, true);
    }

    this.parseStreamADF_BASEFLOAT2 = function(data){
        this._last_pos = this._cur_pos;
        this._cur_pos += 4*2;
        data.x = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        data.y = g_arrayCleBuffer.getFloat32(this._last_pos+4, true);        
    }

    this.parseStreamADF_BASEFLOAT3 = function(data){
        this._last_pos = this._cur_pos;
        this._cur_pos += 4*3;
        data.x = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        data.y = g_arrayCleBuffer.getFloat32(this._last_pos+4, true);   
        data.z = g_arrayCleBuffer.getFloat32(this._last_pos+8, true); 
    }

    this.parseStreamADF_BASEFLOAT4 = function(data){
        this._last_pos = this._cur_pos;
        this._cur_pos += 4*4;
        data.x = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        data.y = g_arrayCleBuffer.getFloat32(this._last_pos+4, true);   
        data.z = g_arrayCleBuffer.getFloat32(this._last_pos+8, true); 
        data.w = g_arrayCleBuffer.getFloat32(this._last_pos+12, true); 
    }

    this.parseStreamADF_BASETRIANGLE = function(data){
        this._last_pos = this._cur_pos;
        this._cur_pos += 4*3*3;

        data.p1.x = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data.p1.y = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;   
        data.p1.z = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;

        data.p2.x = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data.p2.y = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;   
        data.p2.z = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;

        data.p3.x = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data.p3.y = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;   
        data.p3.z = g_arrayCleBuffer.getFloat32(this._last_pos, true);
    }

    this.parseStreamADF_BASEMATRIX = function(data){
        this._last_pos = this._cur_pos;
        this._cur_pos += 4*4*4;

        data._11 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data._12 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;   
        data._13 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data._14 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;

        data._21 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data._22 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;   
        data._23 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data._24 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;

        data._31 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data._32 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;   
        data._33 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data._34 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;

        data._41 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data._42 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;   
        data._43 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
        this._last_pos += 4;
        data._44 = g_arrayCleBuffer.getFloat32(this._last_pos, true);
    }

    this.parseStreamADF_BASEDOUBLE2 = function(data){
        this._last_pos = this._cur_pos;
        this._cur_pos += 8*2;
        data.x = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        data.y = g_arrayCleBuffer.getFloat64(this._last_pos+8, true);  
    }

    this.parseStreamADF_BASEDOUBLE3 = function(data){
        this._last_pos = this._cur_pos;
        this._cur_pos += 8*3;
        data.x = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        data.y = g_arrayCleBuffer.getFloat64(this._last_pos+8, true);   
        data.z = g_arrayCleBuffer.getFloat64(this._last_pos+16, true); 
    }

    this.parseStreamADF_BASEDOUBLE4 = function(data){
        this._last_pos = this._cur_pos;
        this._cur_pos += 8*4;
        data.x = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        data.y = g_arrayCleBuffer.getFloat64(this._last_pos+8, true);   
        data.z = g_arrayCleBuffer.getFloat64(this._last_pos+16, true); 
        data.w = g_arrayCleBuffer.getFloat64(this._last_pos+24, true); 
    }    

    this.parseStreamADF_BASEMATRIXD = function(data){
        this._last_pos = this._cur_pos;
        this._cur_pos += 8*4*4;

        data._11 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;
        data._12 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;   
        data._13 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;
        data._14 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;

        data._21 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;
        data._22 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;   
        data._23 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;
        data._24 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;

        data._31 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;
        data._32 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;   
        data._33 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;
        data._34 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;

        data._41 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;
        data._42 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;   
        data._43 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
        this._last_pos += 8;
        data._44 = g_arrayCleBuffer.getFloat64(this._last_pos, true);
    }

    this.parseStreamADF_WString = function(){
        this._last_pos = this._cur_pos;
        this._cur_pos += 4;
        var nSrcLen = g_arrayCleBuffer.getInt32(this._last_pos, true);  
        if (nSrcLen == 0) {
            return '';
        }
        else{
            this._last_pos = this._cur_pos;
            var dvTextReader = new Uint16Array(g_arrayByteBuffer, this._last_pos, nSrcLen-1);
            this._cur_pos += nSrcLen*2;
            return String.fromCharCode.apply(null, dvTextReader);
        }
    }

    this.parseStreamADF_Uint8Array= function(size, data){
        this._last_pos = this._cur_pos;
        this._cur_pos += size;

        if (size > 0) { 
            data = new Uint8Array(g_arrayByteBuffer, this._last_pos, size);
        }
    }

    // 平面
    this.parseStreamADF_PlaneData = function(data){
        this.parseStreamADF_BASEFLOAT3(data.vAxisX);
        this.parseStreamADF_BASEFLOAT3(data.vAxisY);
        this.parseStreamADF_BASEFLOAT3(data.vAxisZ);
        this.parseStreamADF_BASEFLOAT3(data.vOrigin);
    }

    this.parseStreamADF_PlaneDataLen = function(){
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
    }

    // 圆柱�?
    this.parseStreamADF_CylinderData = function(data){
        this.parseStreamADF_BASEFLOAT3(data.vAxisX);
        this.parseStreamADF_BASEFLOAT3(data.vAxisY);
        this.parseStreamADF_BASEFLOAT3(data.vAxisZ);
        this.parseStreamADF_BASEFLOAT3(data.vOrigin);
        data.radius = this.parseStreamADF_FLOAT();
    }
  
    this.parseStreamADF_CylinderDataLen = function(){
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4;
    }

    // 圆锥�?
    this.parseStreamADF_ConeData = function(data){
        this.parseStreamADF_BASEFLOAT3(data.vAxisX);
        this.parseStreamADF_BASEFLOAT3(data.vAxisY);
        this.parseStreamADF_BASEFLOAT3(data.vAxisZ);
        this.parseStreamADF_BASEFLOAT3(data.vOrigin);
        data.alpha = this.parseStreamADF_FLOAT();
    }

    this.parseStreamADF_ConeDataLen = function(){
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4;
    }

    // 圆环�?
    this.parseStreamADF_TorusData = function(data){
        this.parseStreamADF_BASEFLOAT3(data.vAxisX);
        this.parseStreamADF_BASEFLOAT3(data.vAxisY);
        this.parseStreamADF_BASEFLOAT3(data.vAxisZ);
        this.parseStreamADF_BASEFLOAT3(data.vOrigin);
        data.radius1 = this.parseStreamADF_FLOAT();
        data.radius2 = this.parseStreamADF_FLOAT();
    }

    this.parseStreamADF_TorusDataLen = function(){
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4;
        this._cur_pos += 4;
    }

    // 旋转�?
    this.parseStreamADF_RevolveData = function(data){
        this.parseStreamADF_BASEFLOAT3(data.vAxisX);
        this.parseStreamADF_BASEFLOAT3(data.vAxisY);
        this.parseStreamADF_BASEFLOAT3(data.vAxisZ);
        this.parseStreamADF_BASEFLOAT3(data.vOrigin);
    }

    this.parseStreamADF_RevolveDataLen = function(){
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
    }
    
    // 列表柱面
    this.parseStreamADF_TabCylData = function(data){
        this.parseStreamADF_BASEFLOAT3(data.vAxisX);
        this.parseStreamADF_BASEFLOAT3(data.vAxisY);
        this.parseStreamADF_BASEFLOAT3(data.vAxisZ);
        this.parseStreamADF_BASEFLOAT3(data.vOrigin);
    }

    this.parseStreamADF_TabCylDataLen = function(){
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
    }

    // 球面
    this.parseStreamADF_SphereData = function(data){
        this.parseStreamADF_BASEFLOAT3(data.vAxisX);
        this.parseStreamADF_BASEFLOAT3(data.vAxisY);
        this.parseStreamADF_BASEFLOAT3(data.vAxisZ);
        this.parseStreamADF_BASEFLOAT3(data.vOrigin);
        data.radius = this.parseStreamADF_FLOAT();
    }

    this.parseStreamADF_SphereDataLen = function(){
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4;
    }

    // 面的形状数据
    this.parseStreamADF_Surface = function(data){
        data.nID  = this.parseStreamADF_INT();
        data.nType  = this.parseStreamADF_INT();

        switch (data.nType)
        {
        case ADF_SURFT_PLANE:       // 平面
            data.Surfacedata.plane = new ADF_PlaneData();
            this.parseStreamADF_PlaneData(data.Surfacedata.plane);
            break;
        case ADF_SURFT_CYLINDER:    // 圆柱�?
            data.Surfacedata.cylinder = new ADF_CylinderData();
            this.parseStreamADF_CylinderData(data.Surfacedata.cylinder);
            break;
        case ADF_SURFT_CONE:        // 圆锥�?
            data.Surfacedata.cone = new ADF_ConeData();
            this.parseStreamADF_ConeData(data.Surfacedata.cone);
            break;
        case ADF_SURFT_TORUS:       // 圆环�?
            data.Surfacedata.torus = new ADF_TorusData();
            this.parseStreamADF_TorusData(data.Surfacedata.torus);  
            break;
        case ADF_SURFT_REVOLVE:     // 旋转�?
            data.Surfacedata.revolve = new ADF_RevolveData();
            this.parseStreamADF_RevolveData(data.Surfacedata.revolve); 
            break;
        case ADF_SURFT_TABCYL:      // 列表柱面
            data.Surfacedata.tabcyl = new ADF_TabCylData();
            this.parseStreamADF_TabCylData(data.Surfacedata.tabcyl);
            break;
        case ADF_SURFT_SPHERE:      // 球面
            data.Surfacedata.sphere = new ADF_SphereData();
            this.parseStreamADF_SphereData(data.Surfacedata.sphere);
            break;
        default:
            break;
        }
        
        var nTempt = this.parseStreamADF_INT();
        if (nTempt != 0) {
            data.bIsTopological = true;
        }
        else{
            data.bIsTopological = false;
        }        
    }

    this.parseStreamADF_SurfaceLen = function(){
        this._cur_pos += 4;
        var nType  = this.parseStreamADF_INT();

        switch (nType)
        {
        case ADF_SURFT_PLANE:       // 平面
            this.parseStreamADF_PlaneDataLen();
            break;
        case ADF_SURFT_CYLINDER:    // 圆柱�?
            this.parseStreamADF_CylinderDataLen();
            break;
        case ADF_SURFT_CONE:        // 圆锥�?
            this.parseStreamADF_ConeDataLen();
            break;
        case ADF_SURFT_TORUS:       // 圆环�?
            this.parseStreamADF_TorusDataLen();  
            break;
        case ADF_SURFT_REVOLVE:     // 旋转�?
            this.parseStreamADF_RevolveDataLen(); 
            break;
        case ADF_SURFT_TABCYL:      // 列表柱面
            this.parseStreamADF_TabCylDataLen();
            break;
        case ADF_SURFT_SPHERE:      // 球面
            this.parseStreamADF_SphereDataLen();
            break;
        default:
            break;
        }        
        this._cur_pos += 4;     
    }

    // 直线
    this.parseStreamADF_LineData = function(data){
        this.parseStreamADF_BASEFLOAT3(data.end1);
        this.parseStreamADF_BASEFLOAT3(data.end2);
    }

    this.parseStreamADF_LineDataLen = function(){
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
    }

    // 圆弧
    this.parseStreamADF_ArcData = function(data){
        this.parseStreamADF_BASEFLOAT3(data.vOrigin);
        this.parseStreamADF_BASEFLOAT3(data.vVector1);
        this.parseStreamADF_BASEFLOAT3(data.vVector2);

        data.fStartAngle = this.parseStreamADF_FLOAT();
        data.fEndAngle = this.parseStreamADF_FLOAT();
        data.fRadius = this.parseStreamADF_FLOAT();
    }

    this.parseStreamADF_ArcDataLen = function(){
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;
        this._cur_pos += 4*3;

        this._cur_pos += 4;
        this._cur_pos += 4;
        this._cur_pos += 4;
    }

    // 曲线的形�?
    this.parseStreamADF_Curve = function(data){
        data.nID  = this.parseStreamADF_INT();
        data.nType  = this.parseStreamADF_INT();

        switch (data.nType)
        {
        case ADF_CURVT_LINE:
            data.curvedata.line = new ADF_LineData();
            this.parseStreamADF_LineData(data.curvedata.line);
            break;
        case ADF_CURVT_ARC:
            data.curvedata.arc = new ADF_ArcData();
            this.parseStreamADF_ArcData(data.curvedata.arc);
            break;
        default:
            break;
        }
    
        var nTempt = this.parseStreamADF_INT();
        if (nTempt != 0) {
            data.bIsTopological = true;
        }
        else{
            data.bIsTopological = false;
        } 
    }

    this.parseStreamADF_CurveLen = function(){
        this._cur_pos += 4;
        var nType  = this.parseStreamADF_INT();

        switch (nType)
        {
        case ADF_CURVT_LINE:
            this.parseStreamADF_LineDataLen();
            break;
        case ADF_CURVT_ARC:
            this.parseStreamADF_ArcDataLen();
            break;
        default:
            break;
        }
    
        this._cur_pos += 4;
    }

    // 二维直线
    this.parseStreamADF_Line2D = function(data){
        this.parseStreamADF_BASEFLOAT2(data.start);
        this.parseStreamADF_BASEFLOAT2(data.end);
    }

    // 二维圆弧
    this.parseStreamADF_Arc2D = function(data){
        this.parseStreamADF_BASEFLOAT2(data.center);
        this.parseStreamADF_BASEFLOAT2(data.axisX);

        data.fRadius = this.parseStreamADF_FLOAT();
        data.fStartAngle = this.parseStreamADF_FLOAT();
        data.fEndAngle = this.parseStreamADF_FLOAT();
    }

    // 二维多边形填�?
    this.parseStreamADF_Polygon2D = function(data){
        var nCount  = this.parseStreamADF_UINT();

        for (var i  = 0; i < nCount; i++) {
            data.arrPoints[i] = new ADF_BASEFLOAT2();
            this.parseStreamADF_BASEFLOAT2(data.arrPoints[i]);
        }        
    }

    // 二维曲线数据信息
    this.parseStreamADF_Curve2D = function(data){
        data.nID  = this.parseStreamADF_INT();
        data.nType  = this.parseStreamADF_INT();

        switch (data.nType)
        {
        case ADF_2DCURVT_LINE:          // 直线
            data.stuLine = new ADF_Line2D();
            this.parseStreamADF_Line2D(data.stuLine);
            break;
        case ADF_2DCURVT_ARC:           // 圆弧
            data.stuArc = new ADF_Arc2D();
            this.parseStreamADF_Arc2D(data.stuArc);
            break;
        case ADF_2DCURVT_POLYGON:       // 多边�?
            data.stuPolygon = new ADF_Polygon2D();
            this.parseStreamADF_Polygon2D(data.stuPolygon);
            break;
        default:
            break;
        }       
    }

    // 立方体包围盒
    this.parseStreamADF_BBOX = function(data){
        this.parseStreamADF_BASEFLOAT3(data._min);
        this.parseStreamADF_BASEFLOAT3(data._max);
    }

    // 球形包围�?
    this.parseStreamADF_BSPHERE = function(data){
        this.parseStreamADF_BASEFLOAT3(data._center);
        data._radius = this.parseStreamADF_FLOAT();
    }

    // 坐标�?单精)
    this.parseStreamADF_COORDSYSTEM = function(data){
        // 坐标系原�?
        this.parseStreamADF_BASEFLOAT3(data._vOrigin);
        // 坐标系X轴向�?
        this.parseStreamADF_BASEFLOAT3(data._vAxisX);
        // 坐标系Y轴向�?坐标系Z轴向�?由X向量叉乘Y向量获得)
        this.parseStreamADF_BASEFLOAT3(data._vAxisY);
    }

    // 坐标�?双精)
    this.parseStreamADF_COORDSYSTEMD = function(data){
        // 坐标系原�?
        this.parseStreamADF_BASEDOUBLE3(data._vOrigin);
        // 坐标系X轴向�?
        this.parseStreamADF_BASEDOUBLE3(data._vAxisX);
        // 坐标系Y轴向�?坐标系Z轴向�?由X向量叉乘Y向量获得)
        this.parseStreamADF_BASEDOUBLE3(data._vAxisY);
    }

    // 参数数�?
    this.parseStreamADF_PARAMETERVALUE = function(data){

        data._nType  = this.parseStreamADF_INT();

        switch (data._nType)
        {
        case ADF_PARAMT_INT:
            data._nValue  = this.parseStreamADF_INT();
            break;
        case ADF_PARAMT_FLOAT:
            data._fValue  = this.parseStreamADF_FLOAT();
            break;
        case ADF_PARAMT_DOUBLE:
            data._dValue  = this.parseStreamADF_DOUBLE();
            break;
        case ADF_PARAMT_STRING:
            data._strValue  = this.parseStreamADF_WString();
            break;
        case ADF_PARAMT_FLOAT3:
            data._vFloat3Value = new ADF_BASEFLOAT3();
            this.parseStreamADF_BASEFLOAT3(data._vFloat3Value);
            break;
        case ADF_PARAMT_DOUBLE3:
            data._vDouble3Value = new ADF_BASEDOUBLE3();
            this.parseStreamADF_BASEDOUBLE3(data._vDouble3Value);
            break;
        case ADF_PARAMT_BOOL:
            {
                var nTempt = this.parseStreamADF_INT();
                if (nTempt != 0){
                    data._bValue = true;
                }
                else{
                    data._bValue = false;
                } 
                break;
            }
        default:
            break;
        }
    }

    // 参数
    this.parseStreamADF_PARAMETER = function(data){
        data._strName  = this.parseStreamADF_WString();
        this.parseStreamADF_PARAMETERVALUE(data._stuValue);
    }

    // 摄像�?
    this.parseStreamADF_CAMERA = function(data){
        this.parseStreamADF_BASEFLOAT3(data._vEyePos);
        this.parseStreamADF_BASEFLOAT3(data._vFocus);
        this.parseStreamADF_BASEFLOAT3(data._vUp);

        data._fFOVY = this.parseStreamADF_FLOAT();
        data._fAspect = this.parseStreamADF_FLOAT();
        data._fZNear = this.parseStreamADF_FLOAT();
        data._fZFar = this.parseStreamADF_FLOAT();
    }

    // 文件信息
    this.parseStreamADF_ResFileInfo = function(data){
        data.uResID = this.parseStreamADF_UINT();
        data.nType = this.parseStreamADF_INT();
        data.strFileName = this.parseStreamADF_WString();
    }

    // 文件的操作数据信�?
    this.parseStreamADF_FILE_OPINFO = function(data){
        this.parseStreamADF_ResFileInfo(data._FileInfo);
        data._nFileOpType = this.parseStreamADF_INT();
    } 
    
    // 模型子集数据
    this.parseStreamADF_MODELSUBSET_SAVEDATA = function(data){
        data._nPrimitType = this.parseStreamADF_INT();
        data._uStartIndex = this.parseStreamADF_UINT();
        data._uIndexCount = this.parseStreamADF_UINT();
        this.parseStreamADF_BBOX(data._box);
        this._cur_pos += 4;
        this._cur_pos += 4;
       // data._nSubsetType = this.parseStreamADF_INT();
       // data._uGeomIndex = this.parseStreamADF_UINT();
    } 

    // 模型数据
    this.CleStreamModelDataParser = function(data){
        // 版本�?
        var modelVersion = this.parseStreamADF_INT();

        // 版本3，增加是否存在UV坐标�?表示不存在，1表示存在，默认�?�?
	    if (modelVersion == 3) {
            data._uIsUV = this.parseStreamADF_UINT();
        }

        var nVertexDataStartIndex = this._cur_pos;

        // 跳过顶点数据的解�?
        var sizeByte = this.parseStreamADF_UINT();
        this._cur_pos += sizeByte;
          
        // 索引组，组内3个元素为�?��(三角�?�?个元素为�?��(线段)
        if (modelVersion == 1) {
            sizeByte = this.parseStreamADF_UINT(); 
            nCount = sizeByte / 4; // 4表示sizeof(Uint32)

            // 存储Uint32类型
            data._arrIndexData = new Uint32Array(nCount);
            for (var i = 0; i < nCount; i++) {
                data._arrIndexData[i] = this.parseStreamADF_UINT();
            }
        } 
        else if (modelVersion == 2 || modelVersion == 3) {
            var nVertexDataLen = sizeByte / 4;
            // 不存在UV坐标，顶点数据从6扩展�?
            if (data._uIsUV != 1) {
                nVertexDataLen = nVertexDataLen * 8 / 6;
            }

            if (nVertexDataLen  < 65535) {
                sizeByte = this.parseStreamADF_UINT(); 
                nCount = sizeByte / 2; // 4表示sizeof(Uint16)
    
                // 存储Uint16类型
                data._arrIndexData = new Uint16Array(nCount);
                for (var i = 0; i < nCount; i++) {
                    data._arrIndexData[i] = this.parseStreamADF_UINT16();
                }
            } else {
                sizeByte = this.parseStreamADF_UINT(); 
                nCount = sizeByte / 4; // 4表示sizeof(Uint32)
    
                // 存储Uint32类型
                data._arrIndexData = new Uint32Array(nCount);
                for (var i = 0; i < nCount; i++) {
                    data._arrIndexData[i] = this.parseStreamADF_UINT();
                }
            }   
        } 
    
        // 子集数据
        var nSubsetStartIndex = this._cur_pos;      
        var nCount = this.parseStreamADF_UINT();
        for (var i = 0; i < nCount; i++) {
            data._arrSubset[i] = new ADF_MODELSUBSET_SAVEDATA();
            this.parseStreamADF_MODELSUBSET_SAVEDATA(data._arrSubset[i]);
        }
        var nSubsetCount = this._cur_pos - nSubsetStartIndex;

        // 重新定位数据位置
        this._cur_pos = nVertexDataStartIndex;
        // 顶点数据(每个顶点包含8个ADF_FLOAT(3个位�?3个法矢向�?2纹理坐标))
        sizeByte = this.parseStreamADF_UINT();
        var tempPos = this._cur_pos;
        // 计算有效三角面片和直线段数量
        var partVertexNum = 0;
        for (var i = 0; i < data._arrSubset.length; i++){
            if (data._arrSubset[i]._nPrimitType == ADFPT_TRIANGLELIST
                || data._arrSubset[i]._nPrimitType == ADFPT_LINELIST){
                partVertexNum += data._arrSubset[i]._uIndexCount;
            }
        }
                     
       // 读取三角面片数据
        var pos = 0;
        if (data._uIsUV  == 1) {
            data._arrVertexData = new Float32Array(partVertexNum * 8);
            for (var i = 0; i < data._arrSubset.length; i++) {
                if (data._arrSubset[i]._nPrimitType == ADFPT_TRIANGLELIST){
                    for (var j = 0; j < data._arrSubset[i]._uIndexCount; j++){
                        var index = data._arrIndexData[data._arrSubset[i]._uStartIndex + j];
                        this._cur_pos = tempPos + 8 * index * 4;
                        for (var k=0; k<8; k++) {
                            data._arrVertexData[pos++] = this.parseStreamADF_FLOAT();
                        }
                    }
                }
            }
        } 
        else { // todo�?wjl�?uv坐标可以不存�?
            data._arrVertexData = new Float32Array(partVertexNum * 6);
            for (var i = 0; i < data._arrSubset.length; i++) {
                if (data._arrSubset[i]._nPrimitType == ADFPT_TRIANGLELIST){
                    for (var j = 0; j < data._arrSubset[i]._uIndexCount; j++){
                        var index = data._arrIndexData[data._arrSubset[i]._uStartIndex + j];
                        this._cur_pos = tempPos + 6 * index * 4;
                        for (var k=0; k<6; k++) {
                            data._arrVertexData[pos++] = this.parseStreamADF_FLOAT();
                        }
                    }
                }
            }
        }

        // 读取直线段数�?
        for (var i = 0; i < data._arrSubset.length; i++){
            if (data._arrSubset[i]._nPrimitType == ADFPT_LINELIST){
                for (var j = 0; j < data._arrSubset[i]._uIndexCount; j++){
                    var index = data._arrIndexData[data._arrSubset[i]._uStartIndex + j];
                    this._cur_pos = tempPos + 8 * index * 4;
                    for (var k=0; k<8; k++) {
                      data._arrVertexData[pos++] = this.parseStreamADF_FLOAT();
                    }
                }
            }
        }
  
        // 跳过子集数据的解�?
        this._cur_pos = nSubsetStartIndex + nSubsetCount;

        // 曲面数据
        nCount = this.parseStreamADF_UINT();
        for (var i = 0; i < nCount; i++){
            if (g_bParsejq) {
                data._arrSurface[i] = new ADF_Surface();
                this.parseStreamADF_Surface(data._arrSurface[i]);
            }else{
                this.parseStreamADF_SurfaceLen();
            }
        }
    
        // 曲线数据
        nCount = this.parseStreamADF_UINT();
        for (var i = 0; i < nCount; i++){
            if (g_bParsejq) {
                data._arrCurve[i] = new ADF_Curve();
                this.parseStreamADF_Curve(data._arrCurve[i]);
            }else{
                this.parseStreamADF_CurveLen();
            }
        }

        // 模型包围�?
        this.parseStreamADF_BBOX(data._box);
    }

    // 模型�?
    this.CleStreamModelSetParser = function(data){
        // 版本�?
        var modelVersion = this.parseStreamADF_INT();
 
        var size = this.parseStreamADF_UINT();
        for (var i = 0; i < size; i++){
            data[i] = new ADF_MODEL_OPINFO();

            // 模型信息
            data[i]._ModelInfo._uModelID = this.parseStreamADF_INT();
            data[i]._ModelInfo._strModelName = this.parseStreamADF_WString();
            // data[i]._ModelInfo._strModelFilePath = this.parseStreamADF_WString();
            this.parseStreamADF_WString();
            this.CleStreamModelDataParser(data[i]._ModelInfo._stuModelData);

            // 文件操作类型,参看类型ADF_FILEOPTYPE�?Int32
            // data[i]._nFileOpType = this.parseStreamADF_INT();
            this._cur_pos += 4;
        }  
    } 

    // 模型�?
    this.CleStreamModelTreeParser = function(data){
        data._uTreeNodeID = this.parseStreamADF_UINT();
        data._uObjectID = this.parseStreamADF_UINT();
        data._strName = this.parseStreamADF_WString();
        this.parseStreamADF_BASEMATRIX(data._matTranform);

        // 参数信息，存储ADF_PARAMETER对象
        var nCount = this.parseStreamADF_UINT(); 
        for (var i = 0; i < nCount; i++){
            data._arrParamData[i] = new ADF_PARAMETER();
            this.parseStreamADF_PARAMETER(data._arrParamData[i]);
        }

        // 子节点信息，存储ADF_OBJ_TREENODE对象 
        nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++){
            data._arrSubNode[i] = new ADF_OBJ_TREENODE();
            this.CleStreamModelTreeParser(data._arrSubNode[i]);
        }	        
    } 

    // 产品信息
    this.CleStreamProductInfo = function(data){
        this.parseStreamADF_BASEFLOAT3(data.vCenterOfMass);         // 质心
        data.dMass = this.parseStreamADF_DOUBLE();                  // 质量
        data.dVolume = this.parseStreamADF_DOUBLE();                // 体积
        data.dSurfaceArea = this.parseStreamADF_DOUBLE();           // 表面�?
        
    }

    // 物件存储数据
    this.CleStreamObjSaveData = function(data){
        data._uObjectID = this.parseStreamADF_UINT();       // 物件ID
        data._uMeshID = this.parseStreamADF_UINT();         // 物件对应模型Mesh的ID
        this.parseStreamADF_BASEMATRIX(data._matLocal);     // �?��矩阵
        this.parseStreamADF_BASEMATRIX(data._matWorld);     // 世界矩阵
        this.CleStreamProductInfo(data._ProductInfo);       // 产品信息

        data._nReverse1 = this.parseStreamADF_INT();        // 预留1
        data._nFillMode = this.parseStreamADF_INT();        // 渲染实体填充方式
        data._nCullMode = this.parseStreamADF_INT();        // 渲染剪裁方式
        data._nReverse4 = this.parseStreamADF_INT();        // 预留4
            
        // 物件子集的材质ID
        var size = this.parseStreamADF_UINT()/4;  
        for (var i = 0; i < size; i++){
            data._arrSubsetMtlID[i] = this.parseStreamADF_UINT();  
        }	

        // 物件子集的扩展材质ID(第二套材质数�? 
        size = this.parseStreamADF_UINT()/4;  
        for (var i = 0; i < size; i++){
            data._arrSubsetMtlID_Ex[i] = this.parseStreamADF_UINT();  
        }
    } 

    // 物件存储数据管理
    this.CleStreamObjSaveDataMgr = function(data){
        // 物件对象数量
        var nObjCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nObjCount; i++) {
            data._arrObjSaveData[i] = new ADF_OBJ_SAVEDATA();
            this.CleStreamObjSaveData(data._arrObjSaveData[i]);
        }	        
    } 

    // 自然材质
    this.CleStreamMtlPhysics= function(data){	
        this.parseStreamADF_BASEFLOAT4(data.vDiffuse);
        this.parseStreamADF_BASEFLOAT4(data.vAmbient);
        this.parseStreamADF_BASEFLOAT4(data.vSpecular);
        this.parseStreamADF_BASEFLOAT4(data.vEmissive);
        data.fPower = this.parseStreamADF_FLOAT();   
    } 

    // 材质数据
    this.CleStreamMtlData = function(data){
        data._eMtlType = this.parseStreamADF_INT();                 // 材质类型
        this.CleStreamMtlPhysics(data._mtlPhysics);                 // 自然材质
        
        // 纹理材质ID
        var nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++) {
            data._arrTexID[i] = this.parseStreamADF_UINT();
        }

        // 纹理数据	
        nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++) {
            data._arrData[i] = new ADF_BASEFLOAT4();
            this.parseStreamADF_BASEFLOAT4(data._arrData[i]);
        }
    } 

    // 材质存储数据
    this.CleStreamMtlSaveData = function(data){
        data._uMtlID = this.parseStreamADF_UINT();              // 材质ID
        data._strName = this.parseStreamADF_WString();          // 材质名称
        this.CleStreamMtlData(data._MtlData);                   // 材质数据	
    } 
    
    // 材质存储数据管理
    this.CleStreamMtlSaveDataMgr = function(data){
        // 材质数据数量
        var nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++) {
            data._arrMtlSaveData[i] = new ADF_MTL_SAVEDATA();
            this.CleStreamMtlSaveData(data._arrMtlSaveData[i]);
        }	        
    } 

    this.CleStreamADF_KEYFRAMEROTATION = function(data){        
        this.parseStreamADF_BASEFLOAT3(data._vOrigin); 
        this.parseStreamADF_BASEFLOAT3(data._vAxis); 
        data._fRotValue = this.parseStreamADF_FLOAT();
    } 

    this.CleStreamADF_KEYPARAMETER = function(data){
        // 类型
        data._eType = this.parseStreamADF_INT();
        // 自由旋转	
        this.CleStreamADF_KEYFRAMEROTATION(data._rotation);
        // 平移
        this.parseStreamADF_BASEFLOAT3(data._vTranslation); 
    } 
    
    this.CleStreamADF_KEYFRAME = function(data, amiVersion){
        // 帧号
        data._uFrameID = this.parseStreamADF_UINT();
        // 起始状�?
        if (amiVersion == 1){
            this.parseStreamADF_BASEMATRIX(data._matStartStatus);
        } 
        else if (amiVersion == 2) {
            data._matStartStatus._11 = this.parseStreamADF_FLOAT();
            data._matStartStatus._12 = this.parseStreamADF_FLOAT();
            data._matStartStatus._13 = this.parseStreamADF_FLOAT();
            data._matStartStatus._14 = 0;

            data._matStartStatus._21 = this.parseStreamADF_FLOAT();
            data._matStartStatus._22 = this.parseStreamADF_FLOAT();
            data._matStartStatus._23 = this.parseStreamADF_FLOAT();
            data._matStartStatus._24 = 0;

            data._matStartStatus._31 = this.parseStreamADF_FLOAT();
            data._matStartStatus._32 = this.parseStreamADF_FLOAT();
            data._matStartStatus._33 = this.parseStreamADF_FLOAT();
            data._matStartStatus._34 = 0;

            data._matStartStatus._41 = this.parseStreamADF_FLOAT();
            data._matStartStatus._42 = this.parseStreamADF_FLOAT();
            data._matStartStatus._43 = this.parseStreamADF_FLOAT();
            data._matStartStatus._44 = 1;
        }

        // �?��变换的关键帧参数(有顺�?
        var nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++) {
            data._arrLocalTransform[i] = new ADF_KEYPARAMETER();
            this.CleStreamADF_KEYPARAMETER(data._arrLocalTransform[i]);
        }	
        
        // 全局变换的关键帧参数(有顺�?
        nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++) {
            data._arrGlobalTransform[i] = new ADF_KEYPARAMETER();
            this.CleStreamADF_KEYPARAMETER(data._arrGlobalTransform[i]);
        } 
    } 

    // 动画存储数据
    this.CleStreamAnimSaveData = function(data, amiVersion){
        data._uObjectID = this.parseStreamADF_UINT(); 
        
        // 物件的关键帧(旋转平移变换)
        var nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++){
            data._arrKeyFrameData[i] = new ADF_KEYFRAME();
            this.CleStreamADF_KEYFRAME(data._arrKeyFrameData[i], amiVersion);
        }	
        
        // 物件的�?明度关键帧，存储ADF_TRANSPARENCY_KEYFRAME对象 
        nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++) {
            data._arrTranspKeyFrm[i] = new ADF_TRANSPARENCY_KEYFRAME();
            // 帧号
            data._arrTranspKeyFrm[i]._uFrameID = this.parseStreamADF_UINT();
            // 非�?明度
            data._arrTranspKeyFrm[i]._fNoTransparency = this.parseStreamADF_FLOAT();
        }	 
    } 

    // 动画存储数据管理
    this.CleStreamAnimSaveDataMgr = function(data, amiVersion){
        data._uFrameSize = this.parseStreamADF_UINT();  

        // 动画数据数量
        var nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++){
            data._arrObjAnimSaveData[i] = new ADF_OBJ_ANIM_SAVEDATA();
            this.CleStreamAnimSaveData(data._arrObjAnimSaveData[i], amiVersion);
        }	        
    }     

    // 摄像机数�?
    this.CleStreamCameraSaveData = function(data){
        // 帧号
        data._uFrameID = this.parseStreamADF_UINT();         
        // 摄像机数�?
        this.parseStreamADF_CAMERA(data._camera);        
    } 

    // 摄像机存储数据管�?
    this.CleStreamCameraSaveDataMgr = function(data){        
        // 默认摄像机数�?
        this.parseStreamADF_CAMERA(data._DefaultCamera);  

        var nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++){
            data._arrCameraAnimSaveData[i] = new ADF_CAMERA_KEYFRAME();
            this.CleStreamCameraSaveData(data._arrCameraAnimSaveData[i]);
        }	        
    }    
    
    // 配置选项数据
    this.CleStreamConfig = function(data){
        data._nCameraProjectType = this.parseStreamADF_INT();
        data._nCoordsType = this.parseStreamADF_INT();
        data._nSceneUpType = this.parseStreamADF_INT();
        data._stuSceneUnit._nLengthUnit = this.parseStreamADF_INT();
        data._stuSceneUnit._nMassUnit = this.parseStreamADF_INT();
        data._stuSceneUnit._nTimeUnit = this.parseStreamADF_INT();    
    }     

    // 时间节点�?
    this.CleStreamTimeNode = function(data){        
         // 节点对应的时间节点ID
        data._uTimeNodeID = this.parseStreamADF_UINT();
        // 类型,参看枚举值ADF_SCENETIMENODETYPE
        data._nType = this.parseStreamADF_INT();
        // 名称
        data._strName = this.parseStreamADF_WString();
        // 注释
        data._strNote = this.parseStreamADF_WString();
        // 音频路径
        data._strAudioPath = this.parseStreamADF_WString();
        // 文档路径
        data._strDocPath = this.parseStreamADF_WString();

        // 其他文档名称
        var nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++){
             data._vecOtherDocName[i] = this.parseStreamADF_WString();
        }	

        // 视频文件ID
        data._uVideoFileID = this.parseStreamADF_UINT();
        // 图像文件ID
        nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++){
             data._arrImageFileID[i] = this.parseStreamADF_UINT();
        }	

        // 超链�?
        data._strHyperlink = this.parseStreamADF_WString();
        // 起始帧号
        data._uStartFrameID = this.parseStreamADF_UINT();
        // 帧长�?
        data._uFrameSize = this.parseStreamADF_UINT();
    
        // 子节�?
        nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++){
            data._arrSubNode[i] = new ADF_TIMENODE();
            this.CleStreamTimeNode(data._arrSubNode[i]);
        }
    } 

    // 场景参数数据
    this.CleStreamSceneParam = function(data){  
        var nCount = this.parseStreamADF_UINT();  
        for (var i = 0; i < nCount; i++){
            data._arrParamSaveData[i] = new ADF_PARAMETER();
            this.parseStreamADF_PARAMETER(data._arrParamSaveData[i]);
        }	        
    }

    // 资源文件
    this.CleStreamResFile = function(version, data){  
        // 文件名，长度260字符
        data._name =  this.parseStreamADF_WString();
        data._size = this.parseStreamADF_UINT(); 
        data._reserve = this.parseStreamADF_UINT(); 

        // 版本号为2时，解析图像数据
        if (version == 2) { 
            data._imageWidth = this.parseStreamADF_UINT();
            data._imageHeight = this.parseStreamADF_UINT();

            this._last_pos = this._cur_pos;
            this._cur_pos += data._size;

            if (data._size > 0) { 
                data._imageData = new Uint8Array(g_arrayByteBuffer, this._last_pos, data._size);
            }

            if (data._size % 2 != 0) {
                this.parseStreamADF_BYTE();
            }
        } 
    }

    // 解析文字样式
    this.CleStreamTextStyle = function(data) {
        data.strFont = this.parseStreamADF_WString();
        data.fHeight = this.parseStreamADF_FLOAT();
        data.fWidth = this.parseStreamADF_FLOAT();
        data.fThickness = this.parseStreamADF_FLOAT();
        data.fSlant = this.parseStreamADF_FLOAT();

        var nTemp = this.parseStreamADF_INT();
        if (nTemp == 0){
            data.bUnderline = false;
        }
        else {
            data.bUnderline = true;
        }

        data.nHorJust = this.parseStreamADF_INT();
        data.nVerJust = this.parseStreamADF_INT();    

        nTemp = this.parseStreamADF_INT();
        if (nTemp == 0){
            data.bMirror = false;
        }
        else {
            data.bMirror = true;
        }

        nTemp = this.parseStreamADF_INT();
        if (nTemp == 0) {
            data.bReadonly = false;
        }
        else {
            data.bReadonly = true;
        }
        data.fLineSpace = this.parseStreamADF_FLOAT();
    }

     // 解析Note
    this.CleStreamNoteData = function(data) {
        this.parseStreamADF_BASEFLOAT3(data.attachPos);

        var size = this.parseStreamADF_INT();
        for (var i = 0; i < size; i++){
            data.arrLeaderPos[i] = new ADF_BASEFLOAT3();
            this.parseStreamADF_BASEFLOAT3(data.arrLeaderPos[i]);
        }
    
        data.strText =  this.parseStreamADF_WString();
        data.strText2 =  this.parseStreamADF_WString();

        this.CleStreamTextStyle(data.textStyle);

        data.nArrowStyle = this.parseStreamADF_INT();
        data.nLeaderStyle = this.parseStreamADF_INT();
        data.fElbowLength = this.parseStreamADF_FLOAT();
        data.nTextDir = this.parseStreamADF_INT();
        data.strReserve = this.parseStreamADF_WString();
    }
 
     // 解析批注
    this.CleStreamAnnotData = function(data) {
        var version = this.parseStreamADF_INT();

        data.uID = this.parseStreamADF_UINT(); 
        data.strOriAnnotID =  this.parseStreamADF_WString();
        data.nType = this.parseStreamADF_INT(); 
        data.strName =  this.parseStreamADF_WString();

        // 标注的局部注释平面，3*3个float, 暂时不用
        this.parseStreamADF_BASEFLOAT3(data.annoPlaneLocal);
        // this.annoPlaneLocal;	                
        this._cur_pos += 3*3*4;

         // 标注的渲染属性， 3个Int32, 暂时不用
        // this.annoRenderProp;	               
        this._cur_pos += 3*4;
  
        data.uMtlID = this.parseStreamADF_UINT(); 

        if (data.nType == 2) {                          // ADF_AT_NOTE = 2,	// 注释
            this.CleStreamNoteData(data.pNote);         // 注释�?
        }
    }

    // 解析注释数据
    this.CleStreamComment = function(data) {
        this.CleStreamAnnotData(data.stuAnnot);

        // 注释的属性信�?
        data.stuProperty._strUserName = this.parseStreamADF_WString();
        data.stuProperty._strDateTime = this.parseStreamADF_WString();
        data.stuProperty._nCommentType = this.parseStreamADF_INT(); 

        this.parseStreamADF_CAMERA(data.stuProperty._stuCamera); 
        data.stuProperty._uStartFrameID = this.parseStreamADF_UINT(); 
        data.stuProperty._uFrameSize = this.parseStreamADF_UINT();     
    }

    // 主入口函�?
    this.parseMain = function(data) {
        this._curVersion = this.parseStreamADF_INT();

        var strFirst = g_strCopy.substring(0, 5);
        if (strFirst != "y雪x峰f"){
            return;
        }
        var ret = true;
        var dataSetDesc = new CleStreamDataSetDesc();

        var nCleBufferlength = g_arrayByteBuffer.byteLength;
        while (this._cur_pos < nCleBufferlength)
        {
            // CLE数据流的数据集描�?
            dataSetDesc._type = this.parseStreamADF_INT();
            dataSetDesc._size = this.parseStreamADF_UINT();

            switch (dataSetDesc._type)
            {
            case CSDST_SYS_MODEL:           // 模型�?
            {
                this.CleStreamModelSetParser(data.arrModelData);
                break;
            }
            case CSDST_SYS_LODMODEL:        // LOD模型数据�?
            {
                break;
            }
            case CSDST_SYS_MODELTREE:       // 模型�?
            {
                // 版本�?
                var modelTreeVersion = this.parseStreamADF_INT();
                this.CleStreamModelTreeParser(data.stuObjTreeTopNode);
                break;
            }
            case CSDST_SYS_OBJECT:          // 物件数据
            {
                // 版本�?
                var ObjectVersion = this.parseStreamADF_INT();
                this.CleStreamObjSaveDataMgr(data.stuObjSaveDataMgr);
                break;
            }
            case CSDST_SYS_MATERIAL:        // 材质数据   
            {
                // 版本�?
                var MtlVersion = this.parseStreamADF_INT();
                this.CleStreamMtlSaveDataMgr(data.stuMtlSaveDataMgr);
                break;
            }
            case CSDST_SYS_ANIMATION:       // 动画数据
            {
                var AnimSaveDataVersion = this.parseStreamADF_INT();
                this.CleStreamAnimSaveDataMgr(data.stuAnimSaveDataMgr, AnimSaveDataVersion);
                break;
            }
            case CSDST_SYS_CAMERA:          // 摄像机数�?
            {
                var CameraSaveDataVersion = this.parseStreamADF_INT();
                this.CleStreamCameraSaveDataMgr(data.stuCameraSaveDataMgr);
                break;
            }
            case CSDST_SYS_CONFIG:          // 配置选项数据
            {
                var ConfigVersion = this.parseStreamADF_INT();
                this.CleStreamConfig(data.stuConfig);  
                break;
            }
            case CSDST_SYS_TIMENODETREE:    // 时间节点�?工艺规程)
            {
                var TimeNodeVersion = this.parseStreamADF_INT();
                this.CleStreamTimeNode(data.stuTimeNodeTreeTop);  
                break;
            }
            case CSDST_SYS_SCENEPARAM:      // 场景参数数据
            {
                var SceneParamVersion = this.parseStreamADF_INT();
                this.CleStreamSceneParam(data.stuSceneParam);  
                break;
            }
            case CSDST_SYS_COMMENT:         // 批注数据   
            {
                var commentVersion = this.parseStreamADF_INT();
                var nCount = this.parseStreamADF_UINT();  
                for (var i = 0; i < nCount; i++){
                    data.arrComment[i] = new ADF_COMMENT();
                    this.CleStreamComment(data.arrComment[i]);
                }
                break;
            }
            case CSDST_SYS_IMAGEFILEINFO:   // 图片文件信息
            {
                var ImageFieInfosion = this.parseStreamADF_INT();
                var nCount = this.parseStreamADF_UINT();  
                for (var i = 0; i < nCount; i++){
                    data.arrImageFile[i] = new ADF_FILE_OPINFO();
                    this.parseStreamADF_FILE_OPINFO(data.arrImageFile[i]);
                }
                break;
            }
            case CSDST_SYS_AUDIOFILEINFO:   // 音频文件信息
            {
                var AudioFieInfosion = this.parseStreamADF_INT();
                var nCount = this.parseStreamADF_UINT();  
                for (var i = 0; i < nCount; i++){
                    data.arrAudioFile[i] = new ADF_FILE_OPINFO();
                    this.parseStreamADF_FILE_OPINFO(data.arrAudioFile[i]);
                }                
                break;
            }
            case CSDST_SYS_DOCFILEINFO:
            {
                break;
            }
            case CSDST_SYS_VIDEOFILEINFO:
            { 
                break;
            }
            case CSDST_RES_FILE:            // 资源文件
            {   
                var ResFieInfosion = 1;
                if (this._curVersion == 2) { // scle大版本号�?时，才解析资源文件的小版本号，当时设计时考虑不全
                    ResFieInfosion = this.parseStreamADF_INT();
                }
                data.arrResFile[g_nResFileCount] = new CleStreamResFileInfo();
                this.CleStreamResFile(ResFieInfosion, data.arrResFile[g_nResFileCount]);             
                g_nResFileCount++;
                break;
            }
            default:
                break;
            }
        } 

        // 如果摄像机动画不为空，装配动画为空，总帧数默认问1000
	    if (data.stuCameraSaveDataMgr._arrCameraAnimSaveData.length > 0){
            if (data.stuAnimSaveDataMgr._uFrameSize == 0) {
                data.stuAnimSaveDataMgr._uFrameSize = 1000;
            }
        }
        return ret;      
    }     
}