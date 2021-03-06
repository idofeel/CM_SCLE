//===================================================================================================
// 全局方法使用的临时变量

// 8个ADF_BASEFLOAT3临时变量
var g_vGVec1 = null;
var g_vGVec2 = null;
var g_vGVec3 = null;
var g_vGVec4 = null;
var g_vGVec5 = null;
var g_vGVec6 = null;
var g_vGVec7 = null;
var g_vGVec8 = null;
var g_vGVec9 = null;
var g_vGVec10 = null;
var g_vGVec11 = null;
var g_vGVec12 = null;
var g_vGVec13 = null;
var g_vGVec14 = null;

// 4个ADF_BASEMATRIX临时变量
var g_vGBaseMatrix_1 = null;
var g_vGBaseMatrix_2 = null;
var g_vGBaseMatrix_3 = null;
var g_vGBaseMatrix_4 = null;

var g_matRot = null;
var g_matTrans = null;
var g_vPublicUp = null;
var g_vAxisY = null;

var g_bGlobalInt = false;

function ADFGlobalInt() {
	if (g_bGlobalInt){
		return;
	}
	g_bGlobalInt = true;

	g_vGVec1 = new ADF_BASEFLOAT3();
	g_vGVec2 = new ADF_BASEFLOAT3();
	g_vGVec3 = new ADF_BASEFLOAT3();
	g_vGVec4 = new ADF_BASEFLOAT3();
	g_vGVec5 = new ADF_BASEFLOAT3();
	g_vGVec6 = new ADF_BASEFLOAT3();
	g_vGVec7 = new ADF_BASEFLOAT3();
	g_vGVec8 = new ADF_BASEFLOAT3();
	g_vGVec9 = new ADF_BASEFLOAT3();
	g_vGVec10 = new ADF_BASEFLOAT3();
	g_vGVec11 = new ADF_BASEFLOAT3();
	g_vGVec12 = new ADF_BASEFLOAT3();
	g_vGVec13 = new ADF_BASEFLOAT3();
	g_vGVec14 = new ADF_BASEFLOAT3();

	g_vGBaseMatrix_1 = new ADF_BASEMATRIX();
	g_vGBaseMatrix_2 = new ADF_BASEMATRIX();
	g_vGBaseMatrix_3 = new ADF_BASEMATRIX();
	g_vGBaseMatrix_4 = new ADF_BASEMATRIX();

	g_matRot = new ADF_BASEMATRIX();
	g_matTrans = new ADF_BASEMATRIX();
	
	g_vPublicUp = new ADF_BASEFLOAT3();
	g_vAxisY = new ADF_BASEFLOAT3();
}

//===================================================================================================
// 根据输入帧号获取对应关键帧索引及时间百分比
function GetObjectKeyFrameIndex(uFrameID, arrKeyFrameData, arrKeyFrameIndex, arrRatio) {
	if (arrKeyFrameData.length == 0){
		return false;
	}

	// 二分法搜寻
	var uBegin = 0;
	var uEnd = arrKeyFrameData.length - 1;
	var uIndex = Math.floor((uBegin + uEnd) / 2);
	while (!(uIndex == uBegin))	{
		if (Math.floor(arrKeyFrameData[uIndex]._uFrameID) == Math.floor(uFrameID)) {
			uBegin = Math.floor(uIndex);
			break;
		}
		if (Math.floor(arrKeyFrameData[uIndex]._uFrameID) < Math.floor(uFrameID)){
			uBegin = Math.floor(uIndex);
		}
		else{
			uEnd = Math.floor(uIndex);
		}
		uIndex = Math.floor((uBegin + uEnd) / 2);
	}

	if (Math.floor(arrKeyFrameData[uBegin]._uFrameID) >= Math.floor(uFrameID)) {
		arrKeyFrameIndex[0] = Math.floor(uBegin);
		arrRatio[0] = 1.0;
	}
	else if (Math.floor(arrKeyFrameData[uEnd]._uFrameID) <= Math.floor(uFrameID)) {
		arrKeyFrameIndex[0] = Math.floor(uEnd);
		arrRatio[0] = 1.0;
	}
	else {
		arrKeyFrameIndex[0] = Math.floor(uEnd);
		arrRatio[0] = (uFrameID - arrKeyFrameData[uBegin]._uFrameID) / (arrKeyFrameData[uEnd]._uFrameID - arrKeyFrameData[uBegin]._uFrameID);
	}

	return true;
}

// 根据关键帧参数计算矩阵
function CalcObjectMatrixByKeyParam(matrix, param, fRatio) {
	switch (param._eType)
	{
		case ADFKFT_ROTATION:
		{
			g_matRot.Clear();
			g_matTrans.Clear();

			ADFMatrixTranslation(matrix, -1*param._rotation._vOrigin.x, -1*param._rotation._vOrigin.y, -1*param._rotation._vOrigin.z);
			ADFMatrixTranslation(g_matTrans, param._rotation._vOrigin.x, param._rotation._vOrigin.y, param._rotation._vOrigin.z);
			ADFMatrixRotationAxis(g_matRot, param._rotation._vAxis, fRatio * param._rotation._fRotValue);
			ADFMatrixMultiply(matrix, g_matRot, matrix);
			ADFMatrixMultiply(matrix, g_matTrans, matrix);
			break;
		}
		case ADFKFT_TRANSLATION:
			ADFMatrixTranslation(matrix, fRatio * param._vTranslation.x, fRatio * param._vTranslation.y, fRatio * param._vTranslation.z);
			break;
		default:
			break;
	}
	return true;
}

// 根据关键帧数据计算旋转平移世界矩阵
function CalcObjectRTWorldMatrix(matStartStatus, arrLocalTransform, arrGlobalTransform, fRatio, matRTWorld) {    
	g_vGBaseMatrix_1.Clear();

    if (arrLocalTransform.length > 0) 
    {
        CalcObjectMatrixByKeyParam(matRTWorld, arrLocalTransform[0], fRatio);
        
		// 局部变换
		for (var i = 1; i < arrLocalTransform.length; i++)
		{
			if (!CalcObjectMatrixByKeyParam(g_vGBaseMatrix_1, arrLocalTransform[i], fRatio)) {
				continue;
			}
			ADFMatrixMultiply(matRTWorld, g_vGBaseMatrix_1, matRTWorld);
		}
		// 起始状态
		ADFMatrixMultiply(matRTWorld, matStartStatus, matRTWorld);
		// 全局变换
		for (var i = 0; i < arrGlobalTransform.length; i++)	{
			if (!CalcObjectMatrixByKeyParam(g_vGBaseMatrix_1, arrGlobalTransform[i], fRatio)) {
				continue;
			}
			ADFMatrixMultiply(matRTWorld, g_vGBaseMatrix_1, matRTWorld);
		}
    }
    else
    {
		matRTWorld.Copy(matStartStatus);
		// 全局变换
		for (var i = 0; i < arrGlobalTransform.length; i++)	{
			if (!CalcObjectMatrixByKeyParam(g_vGBaseMatrix_1, arrGlobalTransform[i], fRatio)) {
				continue;
			}
			ADFMatrixMultiply(matRTWorld, g_vGBaseMatrix_1, matRTWorld);
		}
	}

    return true;
}

//===================================================================================================

// 根据输入帧号获取对应透明度关键帧索引及时间百分比
function GetObjectTranspKeyFrameIndex(uFrameID, arrTranspKeyFrm, arrKeyFrameIndex, arrRatio) {    
    if (arrTranspKeyFrm.length == 0) {
		return false;
	}

    // 二分法搜寻
	var uBegin = 0;
	var uEnd = arrTranspKeyFrm.length - 1;
	var uIndex = Math.floor((uBegin + uEnd) / 2);
	while (!(uIndex == uBegin))
	{
		if (Math.floor(arrTranspKeyFrm[uIndex]._uFrameID) == Math.floor(uFrameID)) {
			uBegin = Math.floor(uIndex);
			break;
		}
		if (Math.floor(arrTranspKeyFrm[uIndex]._uFrameID) < Math.floor(uFrameID)) {
			uBegin = Math.floor(uIndex);
		}
		else {
			uEnd = Math.floor(uIndex);
		}
		uIndex = Math.floor((uBegin + uEnd) / 2);
	}

	if (Math.floor(arrTranspKeyFrm[uBegin]._uFrameID) >= Math.floor(uFrameID))	{
		arrKeyFrameIndex[0] = Math.floor(uBegin);
		arrRatio[0] = 1.0;
	}
	else if (Math.floor(arrTranspKeyFrm[uEnd]._uFrameID) <= Math.floor(uFrameID)) {
		arrKeyFrameIndex[0] = Math.floor(uEnd);
		arrRatio[0] = 1.0;
	} 
	else {
		arrKeyFrameIndex[0] = Math.floor(uEnd);
		arrRatio[0] = (uFrameID - arrTranspKeyFrm[uBegin]._uFrameID) / (arrTranspKeyFrm[uEnd]._uFrameID - arrTranspKeyFrm[uBegin]._uFrameID);
	}

	return true;
}

//===================================================================================================

// 根据输入帧号获取摄像机对应关键帧索引及时间百分比
function GetCameraKeyFrameIndex(uFrameID, arrCameraKeyFrameData, arrKeyFrameIndex, arrRatio) {
	if (arrCameraKeyFrameData.length == 0) {
		return false;
	}

	// 二分法搜寻
	var uBegin = 0;
	var uEnd = arrCameraKeyFrameData.length - 1;
	var uIndex = Math.floor((uBegin + uEnd) / 2);
	while (!(uIndex == uBegin))
	{
		if (Math.floor(arrCameraKeyFrameData[uIndex]._uFrameID) == Math.floor(uFrameID)) {
			uBegin = Math.floor(uIndex);
			break;
		}
		if (Math.floor(arrCameraKeyFrameData[uIndex]._uFrameID) < Math.floor(uFrameID)) {
			uBegin = Math.floor(uIndex);
		}
		else {
			uEnd = Math.floor(uIndex);
		}
		uIndex = Math.floor((uBegin + uEnd) / 2);
	}

	if (Math.floor(arrCameraKeyFrameData[uBegin]._uFrameID) >= Math.floor(uFrameID)) {
		arrKeyFrameIndex[0] = Math.floor(uBegin);
		arrRatio[0] = 1.0;
	}
	else if (Math.floor(arrCameraKeyFrameData[uEnd]._uFrameID) <= Math.floor(uFrameID))	{
		arrKeyFrameIndex[0] = Math.floor(uEnd);
		arrRatio[0] = 1.0;
	}
	else if (Math.floor(arrCameraKeyFrameData[uBegin]._uFrameID) < Math.floor(uFrameID) && Math.floor(arrCameraKeyFrameData[uEnd]._uFrameID) > Math.floor(uFrameID)) {
		arrKeyFrameIndex[0] = Math.floor(uEnd);
		arrRatio[0] = (uFrameID - arrCameraKeyFrameData[uBegin]._uFrameID) / (arrCameraKeyFrameData[uEnd]._uFrameID - arrCameraKeyFrameData[uBegin]._uFrameID);
	}

	return true;
}

// 插值摄像机数据_计算两摄像机公共上方向
function InterpolateCameraDataEx_CalcPublicUpDir(camera1, camera2, vPublicUp){
	g_vGVec1.Copy(camera1._vUp);
	ADFVec3Normalize(g_vGVec1);

	g_vGVec2.Copy(camera2._vUp);	
	ADFVec3Normalize(g_vGVec2);

	g_vGVec3.Sub(camera1._vFocus, camera1._vEyePos);
	ADFVec3Normalize(g_vGVec3);

	g_vGVec4.Sub(camera2._vFocus, camera2._vEyePos);
	ADFVec3Normalize(g_vGVec4);

	ADFVec3Cross(g_vGVec5, g_vGVec1, g_vGVec3);
	ADFVec3Cross(g_vGVec1, g_vGVec3, g_vGVec5);
	ADFVec3Cross(g_vGVec6, g_vGVec2, g_vGVec4);
	ADFVec3Cross(g_vGVec2, g_vGVec4, g_vGVec6);

	// 计算两摄像机公共上方向
	if (IsVecSameDir(g_vGVec5, g_vGVec6) || IsVecReverseDir(g_vGVec5, g_vGVec6)) {
		return false;
	}
	
	g_vGVec7.Clear();
	ADFVec3Cross(g_vGVec7, g_vGVec5, g_vGVec6);
	ADFVec3Normalize(g_vGVec7);

	var fDot1 = ADFVec3Dot(g_vGVec1, g_vGVec7);
	var fDot2 = ADFVec3Dot(g_vGVec2, g_vGVec7);
	if (fDot1 * fDot2 < 0.0){
		return false;
	}

	if (fDot1 < 0.0) {
		g_vGVec7.Mul(-1);
	}

	vPublicUp.Copy(g_vGVec7);

	return true;
}

// 插值摄像机数据_根据公共上方向插值视线方向
function InterpolateCameraDataEx_CalcViewDirByPublicUp(vViewDir1, vViewDir2, vDirX1, vDirX2, fRatio, vPublicUp, vViewDirOut) {
	vViewDirOut.Copy(vViewDir1);

	var fRotX1 = Math.acos(GetCorrectSinCosValue(ADFVec3Dot(vViewDir1, vPublicUp)));
	var fRotX2 = Math.acos(GetCorrectSinCosValue(ADFVec3Dot(vViewDir2, vPublicUp)));

	g_matRot.Clear();
	ADFMatrixRotationAxis(g_matRot, vDirX1, (fRotX2 - fRotX1) * (1.0 - fRatio));
	ADFVec3TransformNormal(vViewDirOut, vViewDirOut, g_matRot);

	var fRotY = Math.acos(GetCorrectSinCosValue(ADFVec3Dot(vDirX1, vDirX2)));
	fRotY = fRotY * (1.0 - fRatio);

	g_vAxisY.Clear();
	ADFVec3Cross(g_vAxisY, vDirX1, vDirX2);
	if (ADFVec3Dot(g_vAxisY, vPublicUp) < 0.0) {
		fRotY = fRotY*(-1);
	}
	ADFMatrixRotationAxis(g_matRot, vPublicUp, fRotY);
	ADFVec3TransformNormal(vViewDirOut, vViewDirOut, g_matRot);
	ADFVec3Normalize(vViewDirOut);
}

// 插值摄像机数据_以焦点为中心旋转眼睛位置
function InterpolateCameraDataEx_Focus(camera1, camera2, fRatio, vPublicUp, cameraOut) {
	var fFocusDist1 = CalculateDistance(camera1._vEyePos, camera1._vFocus);
	var fFocusDist2 = CalculateDistance(camera2._vEyePos, camera2._vFocus);

	g_vGVec1.Sub(camera2._vFocus, camera1._vFocus);
	if (ADFVec3Length(g_vGVec1) > IKS_MIN(fFocusDist1, fFocusDist2) * 0.05) {
		return false;
	}

	g_vGVec2.Copy(camera1._vFocus);
	g_vGVec2.Mul(fRatio);
	g_vGVec3.Copy(camera2._vFocus);
	g_vGVec3.Mul(1.0 - fRatio);
	cameraOut._vFocus.Add(g_vGVec2, g_vGVec3);

	var fFocusDistOut = fFocusDist1 * fRatio + fFocusDist2 * (1.0 - fRatio);

	g_vGVec4.Copy(camera1._vUp);
	ADFVec3Normalize(g_vGVec4);

	g_vGVec5.Copy(camera2._vUp);
	ADFVec3Normalize(g_vGVec5);

	g_vGVec6.Sub(camera1._vFocus, camera1._vEyePos);
	ADFVec3Normalize(g_vGVec6);

	g_vGVec7.Sub(camera2._vFocus, camera2._vEyePos);
	ADFVec3Normalize(g_vGVec7);

	ADFVec3Cross(g_vGVec8, g_vGVec4, g_vGVec6);
	ADFVec3Cross(g_vGVec4, g_vGVec6, g_vGVec8);
	ADFVec3Cross(g_vGVec9, g_vGVec5, g_vGVec7);
	ADFVec3Cross(g_vGVec5, g_vGVec7, g_vGVec9);

	g_vGVec10.Clear();
	InterpolateCameraDataEx_CalcViewDirByPublicUp(g_vGVec6, g_vGVec7, g_vGVec8, g_vGVec9, fRatio, vPublicUp, g_vGVec10);
	
	g_vGVec11.Copy(g_vGVec10);
	g_vGVec11.Mul(fFocusDistOut);
	cameraOut._vEyePos.Sub(cameraOut._vFocus, g_vGVec11);

	ADFVec3Cross(g_vGVec12, vPublicUp, g_vGVec10);
	ADFVec3Cross(g_vGVec13, g_vGVec10, g_vGVec12);
	ADFVec3Normalize(g_vGVec13);

	cameraOut._vUp.Copy(g_vGVec13);

	return true;
}

// 插值摄像机数据_以视点为中心旋转视线方向
function InterpolateCameraDataEx_Position(camera1, camera2, fRatio, vPublicUp, cameraOut) {
	g_vGVec1.Copy(camera1._vEyePos);
	g_vGVec1.Mul(fRatio);

	g_vGVec2.Copy(camera2._vEyePos);
	g_vGVec2.Mul(1.0 - fRatio);
	cameraOut._vEyePos.Add(g_vGVec1, g_vGVec2);

	var fFocusDist1 = CalculateDistance(camera1._vEyePos, camera1._vFocus);
	var fFocusDist2 = CalculateDistance(camera2._vEyePos, camera2._vFocus);
	var fFocusDistOut = fFocusDist1 * fRatio + fFocusDist2 * (1.0 - fRatio);

	g_vGVec3.Copy(camera1._vUp);
	ADFVec3Normalize(g_vGVec3);

	g_vGVec4.Copy(camera2._vUp);
	ADFVec3Normalize(g_vGVec4);

	g_vGVec5.Sub(camera1._vFocus, camera1._vEyePos);
	ADFVec3Normalize(g_vGVec5);

	g_vGVec6.Sub(camera2._vFocus, camera2._vEyePos);
	ADFVec3Normalize(g_vGVec6);

	ADFVec3Cross(g_vGVec7, g_vGVec3, g_vGVec5);
	ADFVec3Cross(g_vGVec3, g_vGVec5, g_vGVec7);
	ADFVec3Cross(g_vGVec8, g_vGVec4, g_vGVec6);
	ADFVec3Cross(g_vGVec4, g_vGVec6, g_vGVec8);

	g_vGVec9.Clear();
	InterpolateCameraDataEx_CalcViewDirByPublicUp(g_vGVec5, g_vGVec6, g_vGVec7, g_vGVec8, fRatio, vPublicUp, g_vGVec9);
	
	g_vGVec10.Copy(g_vGVec9);
	g_vGVec10.Mul(fFocusDistOut);

	cameraOut._vFocus.Add(cameraOut._vEyePos, g_vGVec10);

	g_vGVec11.Clear();
	g_vGVec12.Clear();
	ADFVec3Cross(g_vGVec11, vPublicUp, g_vGVec9);
	ADFVec3Cross(g_vGVec12, g_vGVec9, g_vGVec11);
	ADFVec3Normalize(g_vGVec12);

	cameraOut._vUp.Copy(g_vGVec12);

	return true;
}

// 插值摄像机数据_一般方法
function InterpolateCameraDataEx_General(camera1, camera2, fRatio, cameraOut) {	
	g_vGVec1.Clear();
	g_vGVec2.Clear();
	
	var fFocusDist1 = CalculateDistance(camera1._vEyePos, camera1._vFocus);
	var fFocusDist2 = CalculateDistance(camera2._vEyePos, camera2._vFocus);
	var fFocusDistOut = fFocusDist1 * fRatio + fFocusDist2 * (1.0 - fRatio);

	g_vGVec3.Copy(camera1._vUp);
	ADFVec3Normalize(g_vGVec3);

	g_vGVec4.Copy(camera2._vUp);
	ADFVec3Normalize(g_vGVec4);

	g_vGVec5.Sub(camera1._vFocus, camera1._vEyePos);
	ADFVec3Normalize(g_vGVec5);

	g_vGVec6.Sub(camera2._vFocus, camera2._vEyePos);
	ADFVec3Normalize(g_vGVec6);

	ADFVec3Cross(g_vGVec2, g_vGVec3, g_vGVec5);
	ADFVec3Cross(g_vGVec3, g_vGVec5, g_vGVec2);
	ADFVec3Cross(g_vGVec2, g_vGVec4, g_vGVec6);
	ADFVec3Cross(g_vGVec4, g_vGVec6, g_vGVec2);

	// 插值视线方向
	g_vGVec7.Clear();
	var fRotValue = 0.0;

	g_matRot.Clear();
	g_vGBaseMatrix_1.Clear();
	g_vGBaseMatrix_2.Clear();

	if (IsVecSameDir(g_vGVec5, g_vGVec6)) {
		g_vGVec7.Copy(g_vGVec6);
	}
	else {
		if (IsVecReverseDir(g_vGVec5, g_vGVec6)) {
			fRotValue = ADF_PI;
			if (IsVecSameDir(g_vGVec4, g_vGVec6) || IsVecReverseDir(g_vGVec4, g_vGVec6)) {
				GetVerticalVector(g_vGVec6, g_vGVec1);
			}
			else {
				g_vGVec1.Copy(g_vGVec4);
			}
		}
		else {
			ADFVec3Cross(g_vGVec1, g_vGVec5, g_vGVec6);
			fRotValue = Math.acos(GetCorrectSinCosValue(ADFVec3Dot(g_vGVec5, g_vGVec6)));
		}

		ADFVec3Normalize(g_vGVec1);
		ADFMatrixRotationAxis(g_matRot, g_vGVec1, fRotValue*(1.0 - fRatio));
		ADFMatrixRotationAxis(g_vGBaseMatrix_1, g_vGVec1, fRotValue);
		ADFVec3TransformNormal(g_vGVec7, g_vGVec5, g_matRot);
	}
	ADFVec3Normalize(g_vGVec7);

	g_vGVec8.Sub(camera2._vFocus, camera1._vFocus);

	g_vGVec9.Clear();
	g_vGVec10.Clear();

	if (ADFVec3Length(g_vGVec8) < IKS_MIN(fFocusDist1, fFocusDist2) * 0.05)	{
		// 插值焦点位置
		g_vGVec11.Copy(camera1._vFocus);
		g_vGVec11.Mul(fRatio);
		
		g_vGVec12.Copy(camera2._vFocus);
		g_vGVec12.Mul(1.0 - fRatio);
		g_vGVec10.Add(g_vGVec11, g_vGVec12);

		// 插值眼睛位置
		g_vGVec13.Copy(g_vGVec7);
		g_vGVec13.Mul(fFocusDistOut);

		g_vGVec9.Sub(g_vGVec10, g_vGVec13);
	}
	else {
		// 插值眼睛位置
		g_vGVec11.Copy(camera1._vEyePos);
		g_vGVec11.Mul(fRatio);

		g_vGVec12.Copy(camera2._vEyePos);
		g_vGVec12.Mul(1.0 - fRatio);
		g_vGVec9.Add(g_vGVec11, g_vGVec12);

		// 插值焦点位置
		g_vGVec13.Copy(g_vGVec7);
		g_vGVec13.Mul(fFocusDistOut);

		g_vGVec10.Add(g_vGVec9, g_vGVec13);
	}
	cameraOut._vEyePos.Copy(g_vGVec9);
	cameraOut._vFocus.Copy(g_vGVec10);

	// 插值上方向
	g_vGVec11.Clear();
	g_vGVec12.Clear();
	ADFVec3TransformNormal(g_vGVec12, g_vGVec3, g_vGBaseMatrix_1);
	if (IsVecSameDir(g_vGVec12, g_vGVec4)) {
		ADFVec3TransformNormal(g_vGVec11, g_vGVec3, g_matRot);
	}
	else {
		var fRollValue = 0.0;
		var arrRatio = new Float64Array(1);
		arrRatio[0] = 0.0;
		if (RotateAxisFromVecToVec(g_vGVec6, g_vGVec12, g_vGVec4, arrRatio)) {
			fRollValue = arrRatio[0];
			g_vGBaseMatrix_3.Clear();
			g_vGBaseMatrix_4.Clear();
			ADFMatrixRotationAxis(g_vGBaseMatrix_3, g_vGVec6, fRollValue*(1.0 - fRatio));
			ADFMatrixMultiply(g_matRot, g_vGBaseMatrix_3, g_vGBaseMatrix_4);
			ADFVec3TransformNormal(g_vGVec11, g_vGVec3, g_vGBaseMatrix_4);
		}
		else {
			if (IsVecSameDir(g_vGVec3, g_vGVec4)) {
				g_vGVec11.Copy(g_vGVec4);
			}
			else
			{
				fRotValue = 0.0;
				if (IsVecReverseDir(g_vGVec3, g_vGVec4)) {
					fRotValue = ADF_PI;
					if (IsVecSameDir(g_vGVec7, g_vGVec4) || IsVecReverseDir(g_vGVec7, g_vGVec4)) {
						GetVerticalVector(g_vGVec4, g_vGVec1);
					}
					else {
						ADFVec3Cross(g_vGVec1, g_vGVec4, g_vGVec7);
					}
				}
				else {
					ADFVec3Cross(g_vGVec1, g_vGVec3, g_vGVec4);
					fRotValue = Math.acos(GetCorrectSinCosValue(ADFVec3Dot(g_vGVec3, g_vGVec4)));
				}
				ADFVec3Normalize(g_vGVec1);
				ADFMatrixRotationAxis(g_vGBaseMatrix_2, g_vGVec1, fRotValue*(1.0 - fRatio));
				ADFVec3TransformNormal(g_vGVec11, g_vGVec3, g_vGBaseMatrix_2);
			}
		}
	}

	ADFVec3Cross(g_vGVec2, g_vGVec11, g_vGVec7);
	ADFVec3Cross(g_vGVec11, g_vGVec7, g_vGVec2);
	ADFVec3Normalize(g_vGVec11);
	
	cameraOut._vUp.Copy(g_vGVec11);

	return true;
}

// 插值摄像机数据
function InterpolateCameraDataEx(camera1, camera2, fRatio, cameraOut) {
	cameraOut._fFOVY = fRatio * camera1._fFOVY + (1.0 - fRatio) * camera2._fFOVY;
	cameraOut._fAspect = fRatio * camera1._fAspect + (1.0 - fRatio) * camera2._fAspect;
	cameraOut._fZNear = fRatio * camera1._fZNear + (1.0 - fRatio) * camera2._fZNear;
	cameraOut._fZFar = fRatio * camera1._fZFar + (1.0 - fRatio) * camera2._fZFar;

	var bResult = false;
	g_vPublicUp.Clear();
	if (InterpolateCameraDataEx_CalcPublicUpDir(camera1, camera2, g_vPublicUp))	{
		bResult = InterpolateCameraDataEx_Focus(camera1, camera2, fRatio, g_vPublicUp, cameraOut);
		if (!bResult) {
			bResult = InterpolateCameraDataEx_Position(camera1, camera2, fRatio, g_vPublicUp, cameraOut);
		}
	}
	else {
		bResult = InterpolateCameraDataEx_General(camera1, camera2, fRatio, cameraOut);
	}

	return bResult;
}