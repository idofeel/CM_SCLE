'use strict';const a20_0x5bd0=['vUp','tan','mul','842JDCNFv','556SZNpEW','desc','50pNKILX','fHeight','distance','ePerspective','fWidth','make','mView','vDragPoint','rotate','fSensPanP','sign','mProjI','vAt','transformVec3','67VaoFwl','rotateY','5338JxRLwN','575627kpOWgB','eLockAxis','rotateZ','viewAxisInWorld','negate','fSensPanO','187972cwGymv','assign','1nTzcWe','add','bDragging','vEye','29xfRmNX','eAxisY','fSensZoomO','fNear','bInvertRot','eAxisX','max','fFOVInRadian','eControl','viewport','5683EUrHUN','screenToClipV','fSensRot','camera','transformPoint3','309449CeukTq','setViewParam','3vdhKvh','8513cbYyME','eAxisZ','from','translation','fSensZoomP','makeAxis','rotateX'];(function(_0x519c0a,_0x9a0434){const _0x3688a5=a20_0x2e4c;while(!![]){try{const _0x1eb683=-parseInt(_0x3688a5(0x112))*parseInt(_0x3688a5(0x108))+-parseInt(_0x3688a5(0x102))*parseInt(_0x3688a5(0x119))+-parseInt(_0x3688a5(0x125))*-parseInt(_0x3688a5(0x124))+parseInt(_0x3688a5(0xfc))+-parseInt(_0x3688a5(0x127))*-parseInt(_0x3688a5(0xfb))+parseInt(_0x3688a5(0xf9))*-parseInt(_0x3688a5(0x11a))+parseInt(_0x3688a5(0x117))*parseInt(_0x3688a5(0x104));if(_0x1eb683===_0x9a0434)break;else _0x519c0a['push'](_0x519c0a['shift']());}catch(_0x37eace){_0x519c0a['push'](_0x519c0a['shift']());}}}(a20_0x5bd0,0x4e60a));import*as a20_0x1afad6 from'../Math/math.js';import*as a20_0x13e9e4 from'../Math/float2.js';import*as a20_0x302522 from'../Math/float3.js';import*as a20_0x40af13 from'../Math/matrix.js';import*as a20_0x2453f6 from'../Math/box.js';import*as a20_0x1a4e8d from'./camera.js';export const eZoom=0x0;export const ePan=0x1;export const eRotPos=0x2;export const eRotDir=0x3;export function make(){const _0x14a7f9=a20_0x2e4c;let _0x15ac8b={'fSensZoomP':0x1,'fSensZoomO':0x2,'fSensPanP':0x1,'fSensPanO':0x1,'fSensMoveZ':0x1,'fSensRoll':0x1,'fSensRot':0x3,'eLockAxis':a20_0x1afad6[_0x14a7f9(0x109)],'bDragging':![],'eControl':eZoom,'vDragPoint':a20_0x13e9e4[_0x14a7f9(0x11c)](0x0,0x0),'bInvertRot':![],'boudnsScene':a20_0x2453f6[_0x14a7f9(0x12c)](),'camera':null};return _0x15ac8b;}export function setControl(_0x292d7d,_0x3ecf77){const _0x14f73f=a20_0x2e4c;(_0x3ecf77<eZoom||_0x3ecf77>eRotDir)&&(_0x292d7d[_0x14f73f(0x110)]=eRotPos),_0x292d7d['eControl']=_0x3ecf77;}export function beginDrag(_0x1fa030,_0x563665,_0x15fce8,_0x4debf8){const _0x5700ff=a20_0x2e4c;_0x1fa030['bDragging']=!![],_0x1fa030[_0x5700ff(0x115)]=_0x563665,_0x1fa030[_0x5700ff(0xfd)]!=null?_0x1fa030[_0x5700ff(0x10c)]=a20_0x302522['dot'](_0x563665[_0x5700ff(0x126)][_0x5700ff(0x121)],a20_0x302522[_0x5700ff(0x11f)](_0x1fa030['eLockAxis']))<0x0:_0x1fa030[_0x5700ff(0x10c)]=![],a20_0x13e9e4[_0x5700ff(0x103)](_0x1fa030[_0x5700ff(0x12e)],_0x15fce8),_0x4debf8!=null&&a20_0x2453f6['assign'](_0x1fa030['boundsScene'],_0x4debf8);}export function endDrag(_0x22ec32){const _0x2b82a8=a20_0x2e4c;_0x22ec32[_0x2b82a8(0x106)]=![],_0x22ec32[_0x2b82a8(0x115)]=null;}export function drag(_0x4a12f7,_0x576ff4){const _0x51af65=a20_0x2e4c;if(_0x4a12f7[_0x51af65(0x106)]){let _0x381ad3=a20_0x13e9e4['sub'](null,_0x4a12f7[_0x51af65(0x12e)],_0x576ff4);a20_0x13e9e4['assign'](_0x4a12f7[_0x51af65(0x12e)],_0x576ff4);if(_0x4a12f7[_0x51af65(0x110)]==eZoom)zoom(_0x4a12f7,_0x4a12f7[_0x51af65(0x115)],_0x381ad3);else{if(_0x4a12f7[_0x51af65(0x110)]==ePan)pan(_0x4a12f7,_0x4a12f7[_0x51af65(0x115)],_0x381ad3);else{if(_0x4a12f7['eControl']==eRotPos)rotPos(_0x4a12f7,_0x4a12f7[_0x51af65(0x115)],_0x381ad3);else _0x4a12f7['eControl']==eRotDir&&rotDir(_0x4a12f7,_0x4a12f7[_0x51af65(0x115)],_0x381ad3);}}}}function a20_0x2e4c(_0x1da69f,_0x14c1a8){_0x1da69f=_0x1da69f-0xf7;let _0x5bd043=a20_0x5bd0[_0x1da69f];return _0x5bd043;}export function zoomWithMouseWheel(_0x382bf6,_0x37b9e8,_0x451bbf,_0x20725b=0.05){const _0x2c6266=a20_0x2e4c;zoom(_0x382bf6,_0x37b9e8,a20_0x13e9e4['from'](0x0,a20_0x1afad6[_0x2c6266(0x131)](_0x451bbf)*_0x37b9e8[_0x2c6266(0x111)][_0x2c6266(0x128)]*_0x20725b));}export function zoomWithTouch(_0x2bdbef,_0x236497,_0x59b2e1,_0x1aa768=0.05){const _0xb40679=a20_0x2e4c;zoom(_0x2bdbef,_0x236497,a20_0x13e9e4[_0xb40679(0x11c)](0x0,a20_0x1afad6[_0xb40679(0x131)](_0x59b2e1)*_0x236497[_0xb40679(0x111)][_0xb40679(0x128)]*_0x1aa768));}export function zoom(_0x2b0a01,_0x3c87ab,_0x221bc7){const _0x1f4148=a20_0x2e4c;let _0x3c6456=a20_0x1a4e8d[_0x1f4148(0x113)](null,_0x3c87ab,_0x221bc7);if(_0x3c87ab[_0x1f4148(0x126)]['eProjType']==a20_0x1a4e8d['ePerspective']){const _0x7adb39=_0x3c87ab['desc'][_0x1f4148(0x107)],_0x1f212a=_0x3c87ab[_0x1f4148(0x126)][_0x1f4148(0xf7)];let _0xbbed11=a20_0x302522[_0x1f4148(0x129)](_0x7adb39,_0x1f212a),_0x2c51a4=(_0x3c6456[0x0]+_0x3c6456[0x1])*_0x2b0a01[_0x1f4148(0x11e)]*_0xbbed11,_0x523ada=_0xbbed11+_0x2c51a4,_0x37eef3=_0x3c87ab[_0x1f4148(0x126)][_0x1f4148(0x10b)]*(0x1+0.001);if(_0x523ada<_0x37eef3){let _0x23922e=a20_0x1a4e8d[_0x1f4148(0xff)](null,_0x3c87ab,a20_0x1afad6['eAxisZ']),_0x1d184c;{_0x1d184c=a20_0x302522[_0x1f4148(0x123)](null,_0x23922e,_0x37eef3),_0x1d184c=a20_0x302522[_0x1f4148(0x105)](_0x1d184c,_0x1d184c,_0x1f212a);}a20_0x1a4e8d[_0x1f4148(0x118)](_0x3c87ab,_0x1d184c,null,null);}else{let _0x1e9637=a20_0x1a4e8d[_0x1f4148(0xff)](null,_0x3c87ab,a20_0x1afad6[_0x1f4148(0x11b)]),_0x2ce49a;{_0x2ce49a=a20_0x302522[_0x1f4148(0x123)](null,_0x1e9637,_0x2c51a4),_0x2ce49a=a20_0x302522[_0x1f4148(0x105)](_0x2ce49a,_0x2ce49a,_0x7adb39);}a20_0x1a4e8d[_0x1f4148(0x118)](_0x3c87ab,_0x2ce49a,null,null);}}else{let _0x21b83b;{_0x21b83b=a20_0x302522[_0x1f4148(0x11c)]((_0x3c6456[0x0]+_0x3c6456[0x1])*_0x2b0a01[_0x1f4148(0x10a)],0x0,0x0),_0x21b83b=a20_0x40af13[_0x1f4148(0xf8)](_0x21b83b,_0x21b83b,_0x3c87ab[_0x1f4148(0x132)]);}let _0x44b498=a20_0x1afad6[_0x1f4148(0x10e)](_0x3c87ab[_0x1f4148(0x126)][_0x1f4148(0x12b)]+_0x21b83b[0x0],0.001);a20_0x1a4e8d['setOrthographic'](_0x3c87ab,_0x44b498,null,null,null);}}export function pan(_0x549bac,_0x33ccf5,_0x5c5e16){const _0x184075=a20_0x2e4c;if(_0x33ccf5[_0x184075(0x126)]['eProjType']==a20_0x1a4e8d[_0x184075(0x12a)]){let _0x2d303b;{_0x2d303b=a20_0x40af13[_0x184075(0x116)](null,_0x33ccf5[_0x184075(0x126)][_0x184075(0xf7)],_0x33ccf5[_0x184075(0x12d)])[0x2],_0x2d303b*=-Math[_0x184075(0x122)](0.5*_0x33ccf5[_0x184075(0x126)][_0x184075(0x10f)]);}let _0x46828d;{_0x46828d=a20_0x1a4e8d[_0x184075(0x113)](null,_0x33ccf5,_0x5c5e16),_0x46828d=a20_0x13e9e4[_0x184075(0x123)](_0x46828d,_0x46828d,_0x2d303b*_0x549bac[_0x184075(0x130)]);}let _0x139b1f;{_0x139b1f=a20_0x1a4e8d[_0x184075(0xff)](null,_0x33ccf5,a20_0x1afad6['eAxisX']),_0x139b1f=a20_0x302522[_0x184075(0x123)](_0x139b1f,_0x139b1f,_0x46828d[0x0]*_0x33ccf5['desc']['fAspect']);}let _0x4c21d6;{_0x4c21d6=a20_0x1a4e8d[_0x184075(0xff)](null,_0x33ccf5,a20_0x1afad6[_0x184075(0x109)]),_0x4c21d6=a20_0x302522[_0x184075(0x123)](_0x4c21d6,_0x4c21d6,_0x46828d[0x1]);}let _0x3515b1=a20_0x302522[_0x184075(0x105)](null,_0x139b1f,_0x4c21d6),_0x2afa5f=a20_0x302522[_0x184075(0x105)](null,_0x33ccf5['desc'][_0x184075(0x107)],_0x3515b1),_0x5ecb92=a20_0x302522[_0x184075(0x105)](null,_0x33ccf5[_0x184075(0x126)][_0x184075(0xf7)],_0x3515b1);a20_0x1a4e8d[_0x184075(0x118)](_0x33ccf5,_0x2afa5f,_0x5ecb92,null);}else{let _0x4aa742=-_0x33ccf5[_0x184075(0x126)][_0x184075(0x12b)]/_0x33ccf5[_0x184075(0x111)]['fWidth'],_0x18ebb6=-_0x4aa742,_0x195f71=_0x5c5e16[0x0]*_0x4aa742*_0x549bac[_0x184075(0x101)],_0x240db8=_0x5c5e16[0x1]*_0x18ebb6*_0x549bac['fSensPanO'],_0x31d966;{_0x31d966=a20_0x1a4e8d[_0x184075(0xff)](null,_0x33ccf5,a20_0x1afad6[_0x184075(0x10d)]),_0x31d966=a20_0x302522[_0x184075(0x123)](_0x31d966,_0x31d966,_0x195f71);}let _0x1cfb6a;{_0x1cfb6a=a20_0x1a4e8d['viewAxisInWorld'](null,_0x33ccf5,a20_0x1afad6[_0x184075(0x109)]),_0x1cfb6a=a20_0x302522['mul'](_0x1cfb6a,_0x1cfb6a,_0x240db8);}let _0x238666=a20_0x302522[_0x184075(0x105)](null,_0x31d966,_0x1cfb6a),_0x133dd1=a20_0x302522['add'](null,_0x33ccf5['desc'][_0x184075(0x107)],_0x238666),_0x23ba3a=a20_0x302522[_0x184075(0x105)](null,_0x33ccf5['desc']['vAt'],_0x238666);a20_0x1a4e8d['setViewParam'](_0x33ccf5,_0x133dd1,_0x23ba3a,null);}}export function rotPos(_0x4c295f,_0x55ec5e,_0x594191){const _0x54da68=a20_0x2e4c;let _0x504235;{_0x504235=a20_0x13e9e4['mul'](_0x504235,_0x594191,a20_0x13e9e4['from'](0x1,-0x1)),_0x504235=a20_0x1a4e8d['screenToClipV'](_0x504235,_0x55ec5e,_0x504235),_0x4c295f[_0x54da68(0x10c)]&&(_0x504235[0x0]=-_0x504235[0x0]);}let _0xb38de7;{if(_0x4c295f['eLockAxis']==a20_0x1afad6['eAxisX'])_0xb38de7=a20_0x40af13[_0x54da68(0x120)](null,_0x504235[0x1]*_0x4c295f[_0x54da68(0x114)]);else{if(_0x4c295f['eLockAxis']==a20_0x1afad6[_0x54da68(0x109)])_0xb38de7=a20_0x40af13['rotateY'](null,_0x504235[0x0]*_0x4c295f['fSensRot']);else{if(_0x4c295f['eLockAxis']==a20_0x1afad6[_0x54da68(0x11b)])_0xb38de7=a20_0x40af13[_0x54da68(0xfe)](null,_0x504235[0x0]*_0x4c295f[_0x54da68(0x114)]);else{let _0x29f1e8=a20_0x1a4e8d[_0x54da68(0xff)](null,_0x55ec5e,a20_0x1afad6[_0x54da68(0x109)]);_0xb38de7=a20_0x40af13[_0x54da68(0x12f)](null,_0x29f1e8,_0x504235[0x0]*_0x4c295f[_0x54da68(0x114)]);}}}}let _0x40651d;{let _0x320aa6=a20_0x1a4e8d[_0x54da68(0xff)](null,_0x55ec5e,a20_0x1afad6[_0x54da68(0x10d)]);_0x40651d=a20_0x40af13['rotate'](null,_0x320aa6,_0x504235[0x1]*_0x4c295f[_0x54da68(0x114)]);}let _0x35824b;{_0x35824b=a20_0x40af13[_0x54da68(0x11d)](null,a20_0x302522['negate'](null,_0x55ec5e[_0x54da68(0x126)][_0x54da68(0xf7)])),_0x35824b=a20_0x40af13[_0x54da68(0x123)](_0x35824b,_0x35824b,_0x40651d),_0x35824b=a20_0x40af13[_0x54da68(0x123)](_0x35824b,_0x35824b,_0xb38de7),_0x35824b=a20_0x40af13['mul'](_0x35824b,_0x35824b,a20_0x40af13[_0x54da68(0x11d)](null,_0x55ec5e[_0x54da68(0x126)][_0x54da68(0xf7)]));}let _0x57d9f0=a20_0x40af13[_0x54da68(0x116)](null,_0x55ec5e[_0x54da68(0x126)]['vEye'],_0x35824b),_0x5911d4;{let _0x4a0be0=a20_0x40af13[_0x54da68(0x123)](null,_0x40651d,_0xb38de7);_0x5911d4=a20_0x1a4e8d[_0x54da68(0xff)](null,_0x55ec5e,a20_0x1afad6[_0x54da68(0x109)]),_0x5911d4=a20_0x40af13[_0x54da68(0xf8)](_0x5911d4,_0x5911d4,_0x4a0be0);}a20_0x1a4e8d[_0x54da68(0x118)](_0x55ec5e,_0x57d9f0,null,_0x5911d4);}export function rotDir(_0x1bcfde,_0x3f4579,_0x5a696d){const _0x249c26=a20_0x2e4c;let _0xb4c298;{_0xb4c298=a20_0x13e9e4[_0x249c26(0x123)](_0xb4c298,_0x5a696d,a20_0x13e9e4['from'](-0x1,0x1)),_0xb4c298=a20_0x1a4e8d[_0x249c26(0x113)](_0xb4c298,_0x3f4579,_0xb4c298),_0xb4c298=a20_0x13e9e4[_0x249c26(0x100)](_0xb4c298,_0xb4c298),_0x1bcfde[_0x249c26(0x10c)]&&(_0xb4c298[0x0]=-_0xb4c298[0x0]);}let _0x1ef115;{if(_0x1bcfde['eLockAxis']==a20_0x1afad6['eAxisX'])_0x1ef115=a20_0x40af13[_0x249c26(0x120)](null,_0xb4c298[0x0]*_0x1bcfde[_0x249c26(0x114)]);else _0x1bcfde[_0x249c26(0xfd)]==a20_0x1afad6[_0x249c26(0x109)]?_0x1ef115=a20_0x40af13[_0x249c26(0xfa)](null,_0xb4c298[0x0]*_0x1bcfde[_0x249c26(0x114)]):_0x1ef115=a20_0x40af13[_0x249c26(0xfe)](null,_0xb4c298[0x0]*_0x1bcfde['fSensRot']);}let _0x3ecc4e;{let _0x3003a4=a20_0x1a4e8d[_0x249c26(0xff)](null,_0x3f4579,a20_0x1afad6[_0x249c26(0x10d)]);_0x3ecc4e=a20_0x40af13[_0x249c26(0x12f)](null,_0x3003a4,_0xb4c298[0x1]*_0x1bcfde[_0x249c26(0x114)]);}let _0xa791db;{_0xa791db=a20_0x40af13[_0x249c26(0x11d)](null,a20_0x302522[_0x249c26(0x100)](null,_0x3f4579[_0x249c26(0x126)][_0x249c26(0x107)])),_0xa791db=a20_0x40af13[_0x249c26(0x123)](_0xa791db,_0xa791db,_0x3ecc4e),_0xa791db=a20_0x40af13['mul'](_0xa791db,_0xa791db,_0x1ef115),_0xa791db=a20_0x40af13[_0x249c26(0x123)](_0xa791db,_0xa791db,a20_0x40af13[_0x249c26(0x11d)](null,_0x3f4579[_0x249c26(0x126)][_0x249c26(0x107)]));}let _0x4eebf9=a20_0x40af13[_0x249c26(0x116)](null,_0x3f4579['desc']['vAt'],_0xa791db),_0x4c2bbf;{let _0xbeb8c2=a20_0x40af13[_0x249c26(0x123)](null,_0x3ecc4e,_0x1ef115);_0x4c2bbf=a20_0x1a4e8d[_0x249c26(0xff)](null,_0x3f4579,a20_0x1afad6[_0x249c26(0x109)]),_0x4c2bbf=a20_0x40af13[_0x249c26(0xf8)](_0x4c2bbf,_0x4c2bbf,_0xbeb8c2);}a20_0x1a4e8d[_0x249c26(0x118)](_0x3f4579,null,_0x4eebf9,_0x4c2bbf);}export function lockUpAxis(_0x36702c,_0x54ab7e){const _0x43dc4c=a20_0x2e4c;_0x54ab7e!=a20_0x1afad6[_0x43dc4c(0x10d)]&&_0x54ab7e!=a20_0x1afad6[_0x43dc4c(0x109)]&&_0x54ab7e!=a20_0x1afad6[_0x43dc4c(0x11b)]?_0x36702c[_0x43dc4c(0xfd)]=null:_0x36702c[_0x43dc4c(0xfd)]=_0x54ab7e;}export function rotate(_0xb89284,_0x1f099c,_0x179596,_0x361b9b){const _0x6366ed=a20_0x2e4c;_0xb89284[_0x6366ed(0x115)]=_0x1f099c;if(_0x179596==eZoom)zoom(_0xb89284,_0xb89284[_0x6366ed(0x115)],_0x361b9b);else{if(_0x179596==ePan)pan(_0xb89284,_0xb89284[_0x6366ed(0x115)],_0x361b9b);else{if(_0x179596==eRotPos)rotPos(_0xb89284,_0xb89284[_0x6366ed(0x115)],_0x361b9b);else _0x179596==eRotDir&&rotDir(_0xb89284,_0xb89284[_0x6366ed(0x115)],_0x361b9b);}}}