'use strict';const a21_0x223b=['setViewMatrix','437677tRKoXN','647LnLxom','vUp','1SMjMEr','max','lerp','429631WEoRyr','distance','293686NhXzHx','inverse','easeOutQuad','assignDesc','1288004VvvJUk','sphereLerp','fTime','29675qJptEH','505GPAVNj','fPeriod','descTarget','desc','vEye','rotateQuaternion','descStart','fWidth','mView','vAt','5VoyCAU','updateDesc','copyDesc','computeSafeMinDistance','1EPUYGt','make','assign','172439bFplWU'];(function(_0x50db79,_0x46204f){const _0x4701be=a21_0x2e1a;while(!![]){try{const _0x1af0f4=parseInt(_0x4701be(0xce))*parseInt(_0x4701be(0xcb))+-parseInt(_0x4701be(0xe2))*parseInt(_0x4701be(0xd7))+parseInt(_0x4701be(0xd0))+parseInt(_0x4701be(0xe9))*parseInt(_0x4701be(0xe6))+parseInt(_0x4701be(0xeb))+parseInt(_0x4701be(0xec))*parseInt(_0x4701be(0xd8))+-parseInt(_0x4701be(0xd4));if(_0x1af0f4===_0x46204f)break;else _0x50db79['push'](_0x50db79['shift']());}catch(_0x229adc){_0x50db79['push'](_0x50db79['shift']());}}}(a21_0x223b,0x36a2d));import*as a21_0x411df2 from'../Math/math.js';import*as a21_0x25815e from'../Math/float3.js';import*as a21_0x31cde5 from'../Math/matrix.js';import*as a21_0x6f2649 from'../Math/quaternion.js';import*as a21_0x49090a from'./Camera.js';export function make(_0x2fa9b6,_0x20a00a,_0x53ee83){const _0x1a931c=a21_0x2e1a;let _0x1d1785={'descStart':a21_0x49090a[_0x1a931c(0xe4)](_0x2fa9b6),'descTarget':a21_0x49090a[_0x1a931c(0xe4)](_0x20a00a),'fPeriod':_0x53ee83,'desc':a21_0x49090a[_0x1a931c(0xe4)](_0x2fa9b6),'fTime':0x0};return _0x1d1785;}export function isCompleted(_0x3dee13){const _0xc5e16a=a21_0x2e1a;return _0x3dee13[_0xc5e16a(0xd6)]>=_0x3dee13[_0xc5e16a(0xd9)];}export function tick(_0x3d2a82,_0x306b24){const _0x20ee49=a21_0x2e1a;_0x3d2a82[_0x20ee49(0xd6)]+=_0x306b24,updateDesc(_0x3d2a82);}export function setTime(_0x1fa275,_0x3b1971){const _0x26a3fc=a21_0x2e1a;_0x1fa275[_0x26a3fc(0xd6)]=_0x3b1971,updateDesc(_0x1fa275);}export function setTweener(_0x1acc1b,_0x9c0021,_0x289443,_0x4c99e4){const _0x280c34=a21_0x2e1a;a21_0x49090a['assignDesc'](_0x1acc1b[_0x280c34(0xde)],_0x9c0021),a21_0x49090a['assignDesc'](_0x1acc1b[_0x280c34(0xda)],_0x289443),_0x1acc1b[_0x280c34(0xd9)]=_0x4c99e4,a21_0x49090a['assignDesc'](_0x1acc1b['desc'],_0x9c0021),_0x1acc1b['fTime']=0x0;}function a21_0x2e1a(_0xdca94,_0x11e0e9){_0xdca94=_0xdca94-0xca;let _0x223ba5=a21_0x223b[_0xdca94];return _0x223ba5;}export function updateDesc(_0x6c0aab){const _0x254986=a21_0x2e1a;if(_0x6c0aab['fTime']<=0x0)a21_0x49090a['assignDesc'](_0x6c0aab[_0x254986(0xdb)],_0x6c0aab[_0x254986(0xde)]);else{if(_0x6c0aab['fTime']>=_0x6c0aab['fPeriod'])a21_0x49090a[_0x254986(0xd3)](_0x6c0aab[_0x254986(0xdb)],_0x6c0aab['descTarget']);else{let _0x44789c=[a21_0x49090a[_0x254986(0xe7)](),a21_0x49090a[_0x254986(0xe7)]()];a21_0x49090a[_0x254986(0xe3)](_0x44789c[0x0],_0x6c0aab[_0x254986(0xde)]),a21_0x49090a[_0x254986(0xe3)](_0x44789c[0x1],_0x6c0aab[_0x254986(0xda)]);let _0x49ad6a=new Array(0x2),_0x4d4e5f=new Array(0x2);for(let _0x14fc25=0x0;_0x14fc25<0x2;++_0x14fc25){_0x49ad6a[_0x14fc25]=a21_0x6f2649['make'](),_0x4d4e5f[_0x14fc25]=a21_0x25815e[_0x254986(0xe7)](),decomposeViewMatrix(_0x49ad6a[_0x14fc25],_0x4d4e5f[_0x14fc25],_0x44789c[_0x14fc25][_0x254986(0xe0)]);}let _0x5269b2=a21_0x411df2[_0x254986(0xd2)](_0x6c0aab[_0x254986(0xd6)],0x0,0x1,_0x6c0aab['fPeriod']),_0x2bfb11=a21_0x6f2649[_0x254986(0xd5)](null,_0x49ad6a[0x0],_0x49ad6a[0x1],_0x5269b2),_0x509d19=a21_0x25815e[_0x254986(0xcd)](null,_0x4d4e5f[0x0],_0x4d4e5f[0x1],_0x5269b2),_0xaf44b8;{_0xaf44b8=a21_0x31cde5[_0x254986(0xdd)](null,_0x2bfb11),_0xaf44b8=a21_0x31cde5['mul'](_0xaf44b8,_0xaf44b8,a21_0x31cde5['translation'](null,_0x509d19)),_0xaf44b8=a21_0x31cde5[_0x254986(0xd1)](_0xaf44b8,_0xaf44b8);}let _0x23ff5f=a21_0x49090a['make']();{a21_0x49090a[_0x254986(0xea)](_0x23ff5f,_0xaf44b8);}let _0x3713a2=a21_0x411df2[_0x254986(0xcd)](a21_0x25815e[_0x254986(0xcf)](_0x6c0aab[_0x254986(0xde)]['vEye'],_0x6c0aab['descStart'][_0x254986(0xe1)]),a21_0x25815e['distance'](_0x6c0aab[_0x254986(0xda)][_0x254986(0xdc)],_0x6c0aab[_0x254986(0xda)][_0x254986(0xe1)]),_0x5269b2);_0x3713a2=a21_0x411df2[_0x254986(0xcc)](_0x3713a2,a21_0x49090a[_0x254986(0xe5)](_0x44789c[0x0])),a21_0x49090a['assignDesc'](_0x6c0aab[_0x254986(0xdb)],_0x6c0aab[_0x254986(0xde)]);{a21_0x25815e[_0x254986(0xe8)](_0x6c0aab[_0x254986(0xdb)]['vEye'],_0x23ff5f['desc'][_0x254986(0xdc)]),a21_0x25815e['assign'](_0x6c0aab['desc']['vUp'],_0x23ff5f[_0x254986(0xdb)][_0x254986(0xca)]),_0x6c0aab[_0x254986(0xdb)][_0x254986(0xe1)]=a21_0x49090a['viewAxisInWorld'](_0x6c0aab[_0x254986(0xdb)][_0x254986(0xe1)],_0x23ff5f,a21_0x411df2['eAxisZ']),_0x6c0aab[_0x254986(0xdb)][_0x254986(0xe1)]=a21_0x25815e['mul'](_0x6c0aab[_0x254986(0xdb)]['vAt'],_0x6c0aab[_0x254986(0xdb)]['vAt'],_0x3713a2),_0x6c0aab['desc'][_0x254986(0xe1)]=a21_0x25815e['sub'](_0x6c0aab[_0x254986(0xdb)][_0x254986(0xe1)],_0x6c0aab['desc']['vEye'],_0x6c0aab[_0x254986(0xdb)][_0x254986(0xe1)]),_0x6c0aab[_0x254986(0xdb)][_0x254986(0xdf)]=a21_0x411df2['lerp'](_0x6c0aab[_0x254986(0xde)]['fWidth'],_0x6c0aab[_0x254986(0xda)][_0x254986(0xdf)],_0x5269b2);}}}}function decomposeViewMatrix(_0x56aa74,_0x569899,_0x9f091f){_0x56aa74=a21_0x6f2649['rotateMatrix'](_0x56aa74,_0x9f091f),_0x569899[0x0]=_0x9f091f[0xc],_0x569899[0x1]=_0x9f091f[0xd],_0x569899[0x2]=_0x9f091f[0xe];}