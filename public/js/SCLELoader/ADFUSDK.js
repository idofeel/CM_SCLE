let ERROR_ADF_OK=0;let ERROR_ADF_GENERAL=1;let ERROR_ADF_INIT=2;let ERROR_ADF_INPUT=3;var g_sceneData=null;var g_cleParser=null;var g_matRTWorld=null;var g_arrKeyFrameIndex=null;var g_arrRatio=null;function ParseCleStream(){g_sceneData=new ADF_SCENEDATA();g_cleParser=new ADFCleParser();g_matRTWorld=new ADF_BASEMATRIX();g_arrKeyFrameIndex=new Int32Array(1);g_arrRatio=new Float32Array(1);ADFMathInt();ADFGlobalInt();g_cleParser.parseMain(g_sceneData);}
function CalculateObjectWldMatrix(uCurFrameID,stuObjAnimSaveData,matObjLocal,matObjWorld,matWldOut){if(!GetObjectKeyFrameIndex(uCurFrameID,stuObjAnimSaveData._arrKeyFrameData,g_arrKeyFrameIndex,g_arrRatio)){return;}
var uKeyFrameIndex=g_arrKeyFrameIndex[0];var fRatio=g_arrRatio[0];g_matRTWorld.Clear();var bIsKeyFrameCalc=false;if(uKeyFrameIndex<stuObjAnimSaveData._arrKeyFrameData.length){if(CalcObjectRTWorldMatrix(stuObjAnimSaveData._arrKeyFrameData[uKeyFrameIndex]._matStartStatus,stuObjAnimSaveData._arrKeyFrameData[uKeyFrameIndex]._arrLocalTransform,stuObjAnimSaveData._arrKeyFrameData[uKeyFrameIndex]._arrGlobalTransform,fRatio,g_matRTWorld)){bIsKeyFrameCalc=true;}}
if(!bIsKeyFrameCalc){g_matRTWorld.copy(matObjWorld);}
ADFMatrixMultiply(matObjLocal,g_matRTWorld,matWldOut);}
function CalculateObjectNoTransparency(uCurFrameID,stuObjAnimSaveData){var fNoTransparency=1.0;if(!GetObjectTranspKeyFrameIndex(uCurFrameID,stuObjAnimSaveData._arrTranspKeyFrm,g_arrKeyFrameIndex,g_arrRatio)){return fNoTransparency;}
var uKeyFrameIndex=g_arrKeyFrameIndex[0];var fRatio=g_arrRatio[0];if(ISEQUAL(fRatio,1.0)){fNoTransparency=stuObjAnimSaveData._arrTranspKeyFrm[uKeyFrameIndex]._fNoTransparency;}
else{fNoTransparency=stuObjAnimSaveData._arrTranspKeyFrm[uKeyFrameIndex-1]._fNoTransparency*(1.0-fRatio)+stuObjAnimSaveData._arrTranspKeyFrm[uKeyFrameIndex]._fNoTransparency*fRatio;}
return fNoTransparency;}
function CalculateCameraDataByKeyFrame(uCurFrameID,arrCameraAnimSaveData,stuCameraOut){if(!GetCameraKeyFrameIndex(uCurFrameID,arrCameraAnimSaveData,g_arrKeyFrameIndex,g_arrRatio)){return ERROR_ADF_INPUT;}
var uKeyFrameIndex=g_arrKeyFrameIndex[0];var fRatio=g_arrRatio[0];if(ISEQUAL(fRatio,1.0)){stuCameraOut.Copy(arrCameraAnimSaveData[uKeyFrameIndex]._camera);}
else{fRatio=1.0-fRatio;var uIndex1=uKeyFrameIndex;var uIndex2=uKeyFrameIndex;if(uIndex1>0){uIndex1-=1;}
InterpolateCameraDataEx(arrCameraAnimSaveData[uIndex1]._camera,arrCameraAnimSaveData[uIndex2]._camera,fRatio,stuCameraOut);}}