var a3_0x5496=['Sub','_fFOVY','34FUyDdL','1018876WmVemU','_fAspect','_vTranslation','Copy','_vEyePos','181520iKbaon','_rotation','_fZNear','_eType','204164tZhjZl','80405chYewS','_vOrigin','floor','_vAxis','1Ayxykt','acos','1OKRlby','Clear','length','61091PUsnIn','_vUp','Add','_vFocus','_fZFar','_uFrameID','3037zmNVti','20121xinVsM','7DcGfvH','Mul'];(function(_0x2ae00,_0x4eebbf){var _0x25f6b4=a3_0x221c;while(!![]){try{var _0x22fccd=parseInt(_0x25f6b4(0xc0))+parseInt(_0x25f6b4(0xbb))+-parseInt(_0x25f6b4(0xd0))+parseInt(_0x25f6b4(0xd6))*parseInt(_0x25f6b4(0xc4))+parseInt(_0x25f6b4(0xd1))*-parseInt(_0x25f6b4(0xc9))+parseInt(_0x25f6b4(0xcf))*parseInt(_0x25f6b4(0xd5))+-parseInt(_0x25f6b4(0xbf))*parseInt(_0x25f6b4(0xc6));if(_0x22fccd===_0x4eebbf)break;else _0x2ae00['push'](_0x2ae00['shift']());}catch(_0x495d39){_0x2ae00['push'](_0x2ae00['shift']());}}}(a3_0x5496,0xb2be9));var g_vGVec1=null,g_vGVec2=null,g_vGVec3=null,g_vGVec4=null,g_vGVec5=null,g_vGVec6=null,g_vGVec7=null,g_vGVec8=null,g_vGVec9=null,g_vGVec10=null,g_vGVec11=null,g_vGVec12=null,g_vGVec13=null,g_vGVec14=null,g_vGBaseMatrix_1=null,g_vGBaseMatrix_2=null,g_vGBaseMatrix_3=null,g_vGBaseMatrix_4=null,g_matRot=null,g_matTrans=null,g_vPublicUp=null,g_vAxisY=null,g_bGlobalInt=![];function ADFGlobalInt(){if(g_bGlobalInt)return;g_bGlobalInt=!![],g_vGVec1=new ADF_BASEFLOAT3(),g_vGVec2=new ADF_BASEFLOAT3(),g_vGVec3=new ADF_BASEFLOAT3(),g_vGVec4=new ADF_BASEFLOAT3(),g_vGVec5=new ADF_BASEFLOAT3(),g_vGVec6=new ADF_BASEFLOAT3(),g_vGVec7=new ADF_BASEFLOAT3(),g_vGVec8=new ADF_BASEFLOAT3(),g_vGVec9=new ADF_BASEFLOAT3(),g_vGVec10=new ADF_BASEFLOAT3(),g_vGVec11=new ADF_BASEFLOAT3(),g_vGVec12=new ADF_BASEFLOAT3(),g_vGVec13=new ADF_BASEFLOAT3(),g_vGVec14=new ADF_BASEFLOAT3(),g_vGBaseMatrix_1=new ADF_BASEMATRIX(),g_vGBaseMatrix_2=new ADF_BASEMATRIX(),g_vGBaseMatrix_3=new ADF_BASEMATRIX(),g_vGBaseMatrix_4=new ADF_BASEMATRIX(),g_matRot=new ADF_BASEMATRIX(),g_matTrans=new ADF_BASEMATRIX(),g_vPublicUp=new ADF_BASEFLOAT3(),g_vAxisY=new ADF_BASEFLOAT3();}function GetObjectKeyFrameIndex(_0x5b1705,_0x367342,_0x3facb4,_0x371e6f){var _0x444358=a3_0x221c;if(_0x367342['length']==0x0)return![];var _0x174bb9=0x0,_0x34564c=_0x367342[_0x444358(0xc8)]-0x1,_0x59207a=Math['floor']((_0x174bb9+_0x34564c)/0x2);while(!(_0x59207a==_0x174bb9)){if(Math[_0x444358(0xc2)](_0x367342[_0x59207a][_0x444358(0xce)])==Math[_0x444358(0xc2)](_0x5b1705)){_0x174bb9=Math[_0x444358(0xc2)](_0x59207a);break;}Math[_0x444358(0xc2)](_0x367342[_0x59207a][_0x444358(0xce)])<Math[_0x444358(0xc2)](_0x5b1705)?_0x174bb9=Math[_0x444358(0xc2)](_0x59207a):_0x34564c=Math[_0x444358(0xc2)](_0x59207a),_0x59207a=Math['floor']((_0x174bb9+_0x34564c)/0x2);}if(Math[_0x444358(0xc2)](_0x367342[_0x174bb9][_0x444358(0xce)])>=Math[_0x444358(0xc2)](_0x5b1705))_0x3facb4[0x0]=Math[_0x444358(0xc2)](_0x174bb9),_0x371e6f[0x0]=0x1;else Math['floor'](_0x367342[_0x34564c][_0x444358(0xce)])<=Math['floor'](_0x5b1705)?(_0x3facb4[0x0]=Math['floor'](_0x34564c),_0x371e6f[0x0]=0x1):(_0x3facb4[0x0]=Math[_0x444358(0xc2)](_0x34564c),_0x371e6f[0x0]=(_0x5b1705-_0x367342[_0x174bb9][_0x444358(0xce)])/(_0x367342[_0x34564c][_0x444358(0xce)]-_0x367342[_0x174bb9]['_uFrameID']));return!![];}function CalcObjectMatrixByKeyParam(_0x327305,_0x1a81f6,_0x4edf97){var _0x36dbe2=a3_0x221c;switch(_0x1a81f6[_0x36dbe2(0xbe)]){case ADFKFT_ROTATION:{g_matRot[_0x36dbe2(0xc7)](),g_matTrans[_0x36dbe2(0xc7)](),ADFMatrixTranslation(_0x327305,-0x1*_0x1a81f6[_0x36dbe2(0xbc)][_0x36dbe2(0xc1)]['x'],-0x1*_0x1a81f6['_rotation'][_0x36dbe2(0xc1)]['y'],-0x1*_0x1a81f6[_0x36dbe2(0xbc)][_0x36dbe2(0xc1)]['z']),ADFMatrixTranslation(g_matTrans,_0x1a81f6[_0x36dbe2(0xbc)][_0x36dbe2(0xc1)]['x'],_0x1a81f6['_rotation']['_vOrigin']['y'],_0x1a81f6[_0x36dbe2(0xbc)][_0x36dbe2(0xc1)]['z']),ADFMatrixRotationAxis(g_matRot,_0x1a81f6['_rotation'][_0x36dbe2(0xc3)],_0x4edf97*_0x1a81f6['_rotation']['_fRotValue']),ADFMatrixMultiply(_0x327305,g_matRot,_0x327305),ADFMatrixMultiply(_0x327305,g_matTrans,_0x327305);break;}case ADFKFT_TRANSLATION:ADFMatrixTranslation(_0x327305,_0x4edf97*_0x1a81f6[_0x36dbe2(0xd8)]['x'],_0x4edf97*_0x1a81f6['_vTranslation']['y'],_0x4edf97*_0x1a81f6['_vTranslation']['z']);break;default:break;}return!![];}function CalcObjectRTWorldMatrix(_0x3ecbd8,_0x33a2c7,_0x2ae015,_0x1d2264,_0x474b6c){var _0x521b72=a3_0x221c;g_vGBaseMatrix_1[_0x521b72(0xc7)]();if(_0x33a2c7[_0x521b72(0xc8)]>0x0){CalcObjectMatrixByKeyParam(_0x474b6c,_0x33a2c7[0x0],_0x1d2264);for(var _0x1053c3=0x1;_0x1053c3<_0x33a2c7[_0x521b72(0xc8)];_0x1053c3++){if(!CalcObjectMatrixByKeyParam(g_vGBaseMatrix_1,_0x33a2c7[_0x1053c3],_0x1d2264))continue;ADFMatrixMultiply(_0x474b6c,g_vGBaseMatrix_1,_0x474b6c);}ADFMatrixMultiply(_0x474b6c,_0x3ecbd8,_0x474b6c);for(var _0x1053c3=0x0;_0x1053c3<_0x2ae015[_0x521b72(0xc8)];_0x1053c3++){if(!CalcObjectMatrixByKeyParam(g_vGBaseMatrix_1,_0x2ae015[_0x1053c3],_0x1d2264))continue;ADFMatrixMultiply(_0x474b6c,g_vGBaseMatrix_1,_0x474b6c);}}else{_0x474b6c[_0x521b72(0xb9)](_0x3ecbd8);for(var _0x1053c3=0x0;_0x1053c3<_0x2ae015[_0x521b72(0xc8)];_0x1053c3++){if(!CalcObjectMatrixByKeyParam(g_vGBaseMatrix_1,_0x2ae015[_0x1053c3],_0x1d2264))continue;ADFMatrixMultiply(_0x474b6c,g_vGBaseMatrix_1,_0x474b6c);}}return!![];}function GetObjectTranspKeyFrameIndex(_0x1a809c,_0x139c4b,_0x5e9034,_0x1fa9b6){var _0x2eda7d=a3_0x221c;if(_0x139c4b[_0x2eda7d(0xc8)]==0x0)return![];var _0xe0ed2c=0x0,_0x26c83a=_0x139c4b[_0x2eda7d(0xc8)]-0x1,_0x5bb3e9=Math[_0x2eda7d(0xc2)]((_0xe0ed2c+_0x26c83a)/0x2);while(!(_0x5bb3e9==_0xe0ed2c)){if(Math[_0x2eda7d(0xc2)](_0x139c4b[_0x5bb3e9][_0x2eda7d(0xce)])==Math[_0x2eda7d(0xc2)](_0x1a809c)){_0xe0ed2c=Math[_0x2eda7d(0xc2)](_0x5bb3e9);break;}Math[_0x2eda7d(0xc2)](_0x139c4b[_0x5bb3e9][_0x2eda7d(0xce)])<Math[_0x2eda7d(0xc2)](_0x1a809c)?_0xe0ed2c=Math[_0x2eda7d(0xc2)](_0x5bb3e9):_0x26c83a=Math[_0x2eda7d(0xc2)](_0x5bb3e9),_0x5bb3e9=Math[_0x2eda7d(0xc2)]((_0xe0ed2c+_0x26c83a)/0x2);}if(Math[_0x2eda7d(0xc2)](_0x139c4b[_0xe0ed2c][_0x2eda7d(0xce)])>=Math[_0x2eda7d(0xc2)](_0x1a809c))_0x5e9034[0x0]=Math[_0x2eda7d(0xc2)](_0xe0ed2c),_0x1fa9b6[0x0]=0x1;else Math['floor'](_0x139c4b[_0x26c83a]['_uFrameID'])<=Math[_0x2eda7d(0xc2)](_0x1a809c)?(_0x5e9034[0x0]=Math[_0x2eda7d(0xc2)](_0x26c83a),_0x1fa9b6[0x0]=0x1):(_0x5e9034[0x0]=Math[_0x2eda7d(0xc2)](_0x26c83a),_0x1fa9b6[0x0]=(_0x1a809c-_0x139c4b[_0xe0ed2c][_0x2eda7d(0xce)])/(_0x139c4b[_0x26c83a]['_uFrameID']-_0x139c4b[_0xe0ed2c][_0x2eda7d(0xce)]));return!![];}function GetCameraKeyFrameIndex(_0x17e63e,_0x483c4c,_0x16091c,_0x4028b6){var _0x11f7c4=a3_0x221c;if(_0x483c4c[_0x11f7c4(0xc8)]==0x0)return![];var _0x10ee0f=0x0,_0x2c2996=_0x483c4c[_0x11f7c4(0xc8)]-0x1,_0x1666e9=Math[_0x11f7c4(0xc2)]((_0x10ee0f+_0x2c2996)/0x2);while(!(_0x1666e9==_0x10ee0f)){if(Math[_0x11f7c4(0xc2)](_0x483c4c[_0x1666e9][_0x11f7c4(0xce)])==Math['floor'](_0x17e63e)){_0x10ee0f=Math['floor'](_0x1666e9);break;}Math[_0x11f7c4(0xc2)](_0x483c4c[_0x1666e9][_0x11f7c4(0xce)])<Math['floor'](_0x17e63e)?_0x10ee0f=Math[_0x11f7c4(0xc2)](_0x1666e9):_0x2c2996=Math['floor'](_0x1666e9),_0x1666e9=Math[_0x11f7c4(0xc2)]((_0x10ee0f+_0x2c2996)/0x2);}if(Math[_0x11f7c4(0xc2)](_0x483c4c[_0x10ee0f][_0x11f7c4(0xce)])>=Math[_0x11f7c4(0xc2)](_0x17e63e))_0x16091c[0x0]=Math[_0x11f7c4(0xc2)](_0x10ee0f),_0x4028b6[0x0]=0x1;else{if(Math[_0x11f7c4(0xc2)](_0x483c4c[_0x2c2996][_0x11f7c4(0xce)])<=Math[_0x11f7c4(0xc2)](_0x17e63e))_0x16091c[0x0]=Math['floor'](_0x2c2996),_0x4028b6[0x0]=0x1;else Math[_0x11f7c4(0xc2)](_0x483c4c[_0x10ee0f][_0x11f7c4(0xce)])<Math[_0x11f7c4(0xc2)](_0x17e63e)&&Math[_0x11f7c4(0xc2)](_0x483c4c[_0x2c2996][_0x11f7c4(0xce)])>Math['floor'](_0x17e63e)&&(_0x16091c[0x0]=Math[_0x11f7c4(0xc2)](_0x2c2996),_0x4028b6[0x0]=(_0x17e63e-_0x483c4c[_0x10ee0f]['_uFrameID'])/(_0x483c4c[_0x2c2996][_0x11f7c4(0xce)]-_0x483c4c[_0x10ee0f][_0x11f7c4(0xce)]));}return!![];}function InterpolateCameraDataEx_CalcPublicUpDir(_0x5ef475,_0x10a83d,_0x30e927){var _0x21f646=a3_0x221c;g_vGVec1['Copy'](_0x5ef475['_vUp']),ADFVec3Normalize(g_vGVec1),g_vGVec2[_0x21f646(0xb9)](_0x10a83d[_0x21f646(0xca)]),ADFVec3Normalize(g_vGVec2),g_vGVec3[_0x21f646(0xd3)](_0x5ef475[_0x21f646(0xcc)],_0x5ef475[_0x21f646(0xba)]),ADFVec3Normalize(g_vGVec3),g_vGVec4[_0x21f646(0xd3)](_0x10a83d[_0x21f646(0xcc)],_0x10a83d[_0x21f646(0xba)]),ADFVec3Normalize(g_vGVec4),ADFVec3Cross(g_vGVec5,g_vGVec1,g_vGVec3),ADFVec3Cross(g_vGVec1,g_vGVec3,g_vGVec5),ADFVec3Cross(g_vGVec6,g_vGVec2,g_vGVec4),ADFVec3Cross(g_vGVec2,g_vGVec4,g_vGVec6);if(IsVecSameDir(g_vGVec5,g_vGVec6)||IsVecReverseDir(g_vGVec5,g_vGVec6))return![];g_vGVec7[_0x21f646(0xc7)](),ADFVec3Cross(g_vGVec7,g_vGVec5,g_vGVec6),ADFVec3Normalize(g_vGVec7);var _0x2de951=ADFVec3Dot(g_vGVec1,g_vGVec7),_0x20c6f3=ADFVec3Dot(g_vGVec2,g_vGVec7);if(_0x2de951*_0x20c6f3<0x0)return![];return _0x2de951<0x0&&g_vGVec7[_0x21f646(0xd2)](-0x1),_0x30e927[_0x21f646(0xb9)](g_vGVec7),!![];}function InterpolateCameraDataEx_CalcViewDirByPublicUp(_0x3b986b,_0x2d50fc,_0x44f922,_0x90cd5,_0x2d51a0,_0x5af89a,_0x295557){var _0x2a7de7=a3_0x221c;_0x295557['Copy'](_0x3b986b);var _0x29af44=Math[_0x2a7de7(0xc5)](GetCorrectSinCosValue(ADFVec3Dot(_0x3b986b,_0x5af89a))),_0x512b38=Math[_0x2a7de7(0xc5)](GetCorrectSinCosValue(ADFVec3Dot(_0x2d50fc,_0x5af89a)));g_matRot[_0x2a7de7(0xc7)](),ADFMatrixRotationAxis(g_matRot,_0x44f922,(_0x512b38-_0x29af44)*(0x1-_0x2d51a0)),ADFVec3TransformNormal(_0x295557,_0x295557,g_matRot);var _0x5f175f=Math[_0x2a7de7(0xc5)](GetCorrectSinCosValue(ADFVec3Dot(_0x44f922,_0x90cd5)));_0x5f175f=_0x5f175f*(0x1-_0x2d51a0),g_vAxisY[_0x2a7de7(0xc7)](),ADFVec3Cross(g_vAxisY,_0x44f922,_0x90cd5),ADFVec3Dot(g_vAxisY,_0x5af89a)<0x0&&(_0x5f175f=_0x5f175f*-0x1),ADFMatrixRotationAxis(g_matRot,_0x5af89a,_0x5f175f),ADFVec3TransformNormal(_0x295557,_0x295557,g_matRot),ADFVec3Normalize(_0x295557);}function InterpolateCameraDataEx_Focus(_0xcae2be,_0x5ea60a,_0x5c3ee2,_0x567a6b,_0x3f9d78){var _0x3a51e9=a3_0x221c,_0xe35ed6=CalculateDistance(_0xcae2be[_0x3a51e9(0xba)],_0xcae2be[_0x3a51e9(0xcc)]),_0x2c45a1=CalculateDistance(_0x5ea60a[_0x3a51e9(0xba)],_0x5ea60a['_vFocus']);g_vGVec1['Sub'](_0x5ea60a['_vFocus'],_0xcae2be[_0x3a51e9(0xcc)]);if(ADFVec3Length(g_vGVec1)>IKS_MIN(_0xe35ed6,_0x2c45a1)*0.05)return![];g_vGVec2[_0x3a51e9(0xb9)](_0xcae2be[_0x3a51e9(0xcc)]),g_vGVec2['Mul'](_0x5c3ee2),g_vGVec3[_0x3a51e9(0xb9)](_0x5ea60a['_vFocus']),g_vGVec3[_0x3a51e9(0xd2)](0x1-_0x5c3ee2),_0x3f9d78[_0x3a51e9(0xcc)]['Add'](g_vGVec2,g_vGVec3);var _0xf5ad3d=_0xe35ed6*_0x5c3ee2+_0x2c45a1*(0x1-_0x5c3ee2);return g_vGVec4['Copy'](_0xcae2be[_0x3a51e9(0xca)]),ADFVec3Normalize(g_vGVec4),g_vGVec5[_0x3a51e9(0xb9)](_0x5ea60a[_0x3a51e9(0xca)]),ADFVec3Normalize(g_vGVec5),g_vGVec6[_0x3a51e9(0xd3)](_0xcae2be[_0x3a51e9(0xcc)],_0xcae2be[_0x3a51e9(0xba)]),ADFVec3Normalize(g_vGVec6),g_vGVec7[_0x3a51e9(0xd3)](_0x5ea60a[_0x3a51e9(0xcc)],_0x5ea60a[_0x3a51e9(0xba)]),ADFVec3Normalize(g_vGVec7),ADFVec3Cross(g_vGVec8,g_vGVec4,g_vGVec6),ADFVec3Cross(g_vGVec4,g_vGVec6,g_vGVec8),ADFVec3Cross(g_vGVec9,g_vGVec5,g_vGVec7),ADFVec3Cross(g_vGVec5,g_vGVec7,g_vGVec9),g_vGVec10['Clear'](),InterpolateCameraDataEx_CalcViewDirByPublicUp(g_vGVec6,g_vGVec7,g_vGVec8,g_vGVec9,_0x5c3ee2,_0x567a6b,g_vGVec10),g_vGVec11[_0x3a51e9(0xb9)](g_vGVec10),g_vGVec11[_0x3a51e9(0xd2)](_0xf5ad3d),_0x3f9d78[_0x3a51e9(0xba)][_0x3a51e9(0xd3)](_0x3f9d78[_0x3a51e9(0xcc)],g_vGVec11),ADFVec3Cross(g_vGVec12,_0x567a6b,g_vGVec10),ADFVec3Cross(g_vGVec13,g_vGVec10,g_vGVec12),ADFVec3Normalize(g_vGVec13),_0x3f9d78['_vUp'][_0x3a51e9(0xb9)](g_vGVec13),!![];}function InterpolateCameraDataEx_Position(_0x53248d,_0x384760,_0x5d19c0,_0x922df0,_0x7d2e96){var _0x4d77cb=a3_0x221c;g_vGVec1[_0x4d77cb(0xb9)](_0x53248d['_vEyePos']),g_vGVec1['Mul'](_0x5d19c0),g_vGVec2[_0x4d77cb(0xb9)](_0x384760[_0x4d77cb(0xba)]),g_vGVec2[_0x4d77cb(0xd2)](0x1-_0x5d19c0),_0x7d2e96[_0x4d77cb(0xba)][_0x4d77cb(0xcb)](g_vGVec1,g_vGVec2);var _0xf37fcc=CalculateDistance(_0x53248d['_vEyePos'],_0x53248d[_0x4d77cb(0xcc)]),_0x1ae349=CalculateDistance(_0x384760[_0x4d77cb(0xba)],_0x384760[_0x4d77cb(0xcc)]),_0x5d386f=_0xf37fcc*_0x5d19c0+_0x1ae349*(0x1-_0x5d19c0);return g_vGVec3['Copy'](_0x53248d[_0x4d77cb(0xca)]),ADFVec3Normalize(g_vGVec3),g_vGVec4[_0x4d77cb(0xb9)](_0x384760[_0x4d77cb(0xca)]),ADFVec3Normalize(g_vGVec4),g_vGVec5[_0x4d77cb(0xd3)](_0x53248d[_0x4d77cb(0xcc)],_0x53248d[_0x4d77cb(0xba)]),ADFVec3Normalize(g_vGVec5),g_vGVec6[_0x4d77cb(0xd3)](_0x384760[_0x4d77cb(0xcc)],_0x384760[_0x4d77cb(0xba)]),ADFVec3Normalize(g_vGVec6),ADFVec3Cross(g_vGVec7,g_vGVec3,g_vGVec5),ADFVec3Cross(g_vGVec3,g_vGVec5,g_vGVec7),ADFVec3Cross(g_vGVec8,g_vGVec4,g_vGVec6),ADFVec3Cross(g_vGVec4,g_vGVec6,g_vGVec8),g_vGVec9['Clear'](),InterpolateCameraDataEx_CalcViewDirByPublicUp(g_vGVec5,g_vGVec6,g_vGVec7,g_vGVec8,_0x5d19c0,_0x922df0,g_vGVec9),g_vGVec10[_0x4d77cb(0xb9)](g_vGVec9),g_vGVec10[_0x4d77cb(0xd2)](_0x5d386f),_0x7d2e96[_0x4d77cb(0xcc)][_0x4d77cb(0xcb)](_0x7d2e96[_0x4d77cb(0xba)],g_vGVec10),g_vGVec11[_0x4d77cb(0xc7)](),g_vGVec12[_0x4d77cb(0xc7)](),ADFVec3Cross(g_vGVec11,_0x922df0,g_vGVec9),ADFVec3Cross(g_vGVec12,g_vGVec9,g_vGVec11),ADFVec3Normalize(g_vGVec12),_0x7d2e96['_vUp'][_0x4d77cb(0xb9)](g_vGVec12),!![];}function a3_0x221c(_0x3ef4dc,_0x7cb920){_0x3ef4dc=_0x3ef4dc-0xb9;var _0x5496ca=a3_0x5496[_0x3ef4dc];return _0x5496ca;}function InterpolateCameraDataEx_General(_0x4cdf45,_0x157cc8,_0x4ff80a,_0x59adcc){var _0x20eebf=a3_0x221c;g_vGVec1['Clear'](),g_vGVec2[_0x20eebf(0xc7)]();var _0x55306e=CalculateDistance(_0x4cdf45['_vEyePos'],_0x4cdf45[_0x20eebf(0xcc)]),_0x12569a=CalculateDistance(_0x157cc8[_0x20eebf(0xba)],_0x157cc8[_0x20eebf(0xcc)]),_0x5f7bdd=_0x55306e*_0x4ff80a+_0x12569a*(0x1-_0x4ff80a);g_vGVec3['Copy'](_0x4cdf45['_vUp']),ADFVec3Normalize(g_vGVec3),g_vGVec4[_0x20eebf(0xb9)](_0x157cc8[_0x20eebf(0xca)]),ADFVec3Normalize(g_vGVec4),g_vGVec5['Sub'](_0x4cdf45[_0x20eebf(0xcc)],_0x4cdf45[_0x20eebf(0xba)]),ADFVec3Normalize(g_vGVec5),g_vGVec6[_0x20eebf(0xd3)](_0x157cc8[_0x20eebf(0xcc)],_0x157cc8[_0x20eebf(0xba)]),ADFVec3Normalize(g_vGVec6),ADFVec3Cross(g_vGVec2,g_vGVec3,g_vGVec5),ADFVec3Cross(g_vGVec3,g_vGVec5,g_vGVec2),ADFVec3Cross(g_vGVec2,g_vGVec4,g_vGVec6),ADFVec3Cross(g_vGVec4,g_vGVec6,g_vGVec2),g_vGVec7[_0x20eebf(0xc7)]();var _0x4199da=0x0;g_matRot[_0x20eebf(0xc7)](),g_vGBaseMatrix_1['Clear'](),g_vGBaseMatrix_2['Clear']();IsVecSameDir(g_vGVec5,g_vGVec6)?g_vGVec7[_0x20eebf(0xb9)](g_vGVec6):(IsVecReverseDir(g_vGVec5,g_vGVec6)?(_0x4199da=ADF_PI,IsVecSameDir(g_vGVec4,g_vGVec6)||IsVecReverseDir(g_vGVec4,g_vGVec6)?GetVerticalVector(g_vGVec6,g_vGVec1):g_vGVec1[_0x20eebf(0xb9)](g_vGVec4)):(ADFVec3Cross(g_vGVec1,g_vGVec5,g_vGVec6),_0x4199da=Math[_0x20eebf(0xc5)](GetCorrectSinCosValue(ADFVec3Dot(g_vGVec5,g_vGVec6)))),ADFVec3Normalize(g_vGVec1),ADFMatrixRotationAxis(g_matRot,g_vGVec1,_0x4199da*(0x1-_0x4ff80a)),ADFMatrixRotationAxis(g_vGBaseMatrix_1,g_vGVec1,_0x4199da),ADFVec3TransformNormal(g_vGVec7,g_vGVec5,g_matRot));ADFVec3Normalize(g_vGVec7),g_vGVec8[_0x20eebf(0xd3)](_0x157cc8['_vFocus'],_0x4cdf45[_0x20eebf(0xcc)]),g_vGVec9['Clear'](),g_vGVec10['Clear']();ADFVec3Length(g_vGVec8)<IKS_MIN(_0x55306e,_0x12569a)*0.05?(g_vGVec11['Copy'](_0x4cdf45[_0x20eebf(0xcc)]),g_vGVec11['Mul'](_0x4ff80a),g_vGVec12[_0x20eebf(0xb9)](_0x157cc8['_vFocus']),g_vGVec12[_0x20eebf(0xd2)](0x1-_0x4ff80a),g_vGVec10['Add'](g_vGVec11,g_vGVec12),g_vGVec13[_0x20eebf(0xb9)](g_vGVec7),g_vGVec13['Mul'](_0x5f7bdd),g_vGVec9[_0x20eebf(0xd3)](g_vGVec10,g_vGVec13)):(g_vGVec11['Copy'](_0x4cdf45[_0x20eebf(0xba)]),g_vGVec11[_0x20eebf(0xd2)](_0x4ff80a),g_vGVec12['Copy'](_0x157cc8[_0x20eebf(0xba)]),g_vGVec12[_0x20eebf(0xd2)](0x1-_0x4ff80a),g_vGVec9[_0x20eebf(0xcb)](g_vGVec11,g_vGVec12),g_vGVec13[_0x20eebf(0xb9)](g_vGVec7),g_vGVec13[_0x20eebf(0xd2)](_0x5f7bdd),g_vGVec10['Add'](g_vGVec9,g_vGVec13));_0x59adcc[_0x20eebf(0xba)][_0x20eebf(0xb9)](g_vGVec9),_0x59adcc[_0x20eebf(0xcc)]['Copy'](g_vGVec10),g_vGVec11[_0x20eebf(0xc7)](),g_vGVec12[_0x20eebf(0xc7)](),ADFVec3TransformNormal(g_vGVec12,g_vGVec3,g_vGBaseMatrix_1);if(IsVecSameDir(g_vGVec12,g_vGVec4))ADFVec3TransformNormal(g_vGVec11,g_vGVec3,g_matRot);else{var _0x27a822=0x0,_0x1c1f02=new Float64Array(0x1);_0x1c1f02[0x0]=0x0,RotateAxisFromVecToVec(g_vGVec6,g_vGVec12,g_vGVec4,_0x1c1f02)?(_0x27a822=_0x1c1f02[0x0],g_vGBaseMatrix_3[_0x20eebf(0xc7)](),g_vGBaseMatrix_4[_0x20eebf(0xc7)](),ADFMatrixRotationAxis(g_vGBaseMatrix_3,g_vGVec6,_0x27a822*(0x1-_0x4ff80a)),ADFMatrixMultiply(g_matRot,g_vGBaseMatrix_3,g_vGBaseMatrix_4),ADFVec3TransformNormal(g_vGVec11,g_vGVec3,g_vGBaseMatrix_4)):IsVecSameDir(g_vGVec3,g_vGVec4)?g_vGVec11['Copy'](g_vGVec4):(_0x4199da=0x0,IsVecReverseDir(g_vGVec3,g_vGVec4)?(_0x4199da=ADF_PI,IsVecSameDir(g_vGVec7,g_vGVec4)||IsVecReverseDir(g_vGVec7,g_vGVec4)?GetVerticalVector(g_vGVec4,g_vGVec1):ADFVec3Cross(g_vGVec1,g_vGVec4,g_vGVec7)):(ADFVec3Cross(g_vGVec1,g_vGVec3,g_vGVec4),_0x4199da=Math[_0x20eebf(0xc5)](GetCorrectSinCosValue(ADFVec3Dot(g_vGVec3,g_vGVec4)))),ADFVec3Normalize(g_vGVec1),ADFMatrixRotationAxis(g_vGBaseMatrix_2,g_vGVec1,_0x4199da*(0x1-_0x4ff80a)),ADFVec3TransformNormal(g_vGVec11,g_vGVec3,g_vGBaseMatrix_2));}return ADFVec3Cross(g_vGVec2,g_vGVec11,g_vGVec7),ADFVec3Cross(g_vGVec11,g_vGVec7,g_vGVec2),ADFVec3Normalize(g_vGVec11),_0x59adcc[_0x20eebf(0xca)][_0x20eebf(0xb9)](g_vGVec11),!![];}function InterpolateCameraDataEx(_0x1ae853,_0x3f6293,_0x4c294c,_0x4ac9b9){var _0x1d9a91=a3_0x221c;_0x4ac9b9[_0x1d9a91(0xd4)]=_0x4c294c*_0x1ae853['_fFOVY']+(0x1-_0x4c294c)*_0x3f6293['_fFOVY'],_0x4ac9b9['_fAspect']=_0x4c294c*_0x1ae853[_0x1d9a91(0xd7)]+(0x1-_0x4c294c)*_0x3f6293['_fAspect'],_0x4ac9b9[_0x1d9a91(0xbd)]=_0x4c294c*_0x1ae853['_fZNear']+(0x1-_0x4c294c)*_0x3f6293['_fZNear'],_0x4ac9b9[_0x1d9a91(0xcd)]=_0x4c294c*_0x1ae853[_0x1d9a91(0xcd)]+(0x1-_0x4c294c)*_0x3f6293['_fZFar'];var _0x87793e=![];return g_vPublicUp[_0x1d9a91(0xc7)](),InterpolateCameraDataEx_CalcPublicUpDir(_0x1ae853,_0x3f6293,g_vPublicUp)?(_0x87793e=InterpolateCameraDataEx_Focus(_0x1ae853,_0x3f6293,_0x4c294c,g_vPublicUp,_0x4ac9b9),!_0x87793e&&(_0x87793e=InterpolateCameraDataEx_Position(_0x1ae853,_0x3f6293,_0x4c294c,g_vPublicUp,_0x4ac9b9))):_0x87793e=InterpolateCameraDataEx_General(_0x1ae853,_0x3f6293,_0x4c294c,_0x4ac9b9),_0x87793e;}