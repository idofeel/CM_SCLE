'use strict';const a76_0xaea7=['cross','atan2','327829qznObt','35478kpSSQg','sin','isNearlyZero','2432MUrboR','5uqJFGb','from','sqrt','2098eZeUBi','62279mMKuAp','2731WaoLGK','safeReciprocal','46vLHrLT','cos','1biwfJS','acos','normalize','135672GhemcX','1KQqeyI','nonParallel','reciprocal','add','hypot','64tszTGb'];(function(_0x128722,_0xac588){const _0x4c09cf=a76_0x4a44;while(!![]){try{const _0x42bd5c=-parseInt(_0x4c09cf(0x1f3))*-parseInt(_0x4c09cf(0x1ec))+parseInt(_0x4c09cf(0x1f7))*parseInt(_0x4c09cf(0x1e1))+parseInt(_0x4c09cf(0x1de))+parseInt(_0x4c09cf(0x1f0))*-parseInt(_0x4c09cf(0x1e3))+parseInt(_0x4c09cf(0x1e6))+-parseInt(_0x4c09cf(0x1df))*-parseInt(_0x4c09cf(0x1f4))+parseInt(_0x4c09cf(0x1e7))*-parseInt(_0x4c09cf(0x1ef));if(_0x42bd5c===_0xac588)break;else _0x128722['push'](_0x128722['shift']());}catch(_0x286368){_0x128722['push'](_0x128722['shift']());}}}(a76_0xaea7,0x18867));import*as a76_0x4e3f16 from'./math.js';import*as a76_0x120179 from'./float3.js';export function make(){let _0x3573d8=new Float32Array(0x4);{_0x3573d8[0x3]=0x1;}return _0x3573d8;}export function copy(_0x5cbd87){let _0x170810=make();{_0x170810[0x0]=_0x5cbd87[0x0],_0x170810[0x1]=_0x5cbd87[0x1],_0x170810[0x2]=_0x5cbd87[0x2],_0x170810[0x3]=_0x5cbd87[0x3];}return v;}export function x(_0x35b7f0){return _0x35b7f0[0x0];}export function y(_0x4a8d89){return _0x4a8d89[0x1];}export function z(_0x4c9d5d){return _0x4c9d5d[0x2];}export function w(_0x25493a){return _0x25493a[0x3];}export function setX(_0x2614ea,_0x3b752f){_0x2614ea[0x0]=_0x3b752f;}export function setY(_0x13aba9,_0x256a50){_0x13aba9[0x1]=_0x256a50;}export function setZ(_0x51e353,_0x42161b){_0x51e353[0x2]=_0x42161b;}export function setW(_0x10725e,_0xe1a342){_0x10725e[0x3]=_0xe1a342;}export function set(_0x3e9ce9,_0x3eb328,_0x57b667,_0x434791,_0xd3d74b){_0x3e9ce9[0x0]=_0x3eb328,_0x3e9ce9[0x1]=_0x57b667,_0x3e9ce9[0x2]=_0x434791,_0x3e9ce9[0x3]=_0xd3d74b;}export function from(_0x132126,_0x3bf924,_0x38a17c,_0x387875){let _0x23f391=make();{_0x23f391[0x0]=_0x132126,_0x23f391[0x1]=_0x3bf924,_0x23f391[0x2]=_0x38a17c,_0x23f391[0x3]=_0x387875;}return _0x23f391;}export function fromArray(_0x2a2ee8){let _0x55ba35=make();{_0x55ba35[0x0]=_0x2a2ee8[0x0],_0x55ba35[0x1]=_0x2a2ee8[0x1],_0x55ba35[0x2]=_0x2a2ee8[0x2],_0x55ba35[0x3]=_0x2a2ee8[0x3];}return _0x55ba35;}export function assign(_0x169026,_0x5942f6){return _0x169026[0x0]=_0x5942f6[0x0],_0x169026[0x1]=_0x5942f6[0x1],_0x169026[0x2]=_0x5942f6[0x2],_0x169026[0x3]=_0x5942f6[0x3],_0x169026;}export function identity(_0x316d66){return _0x316d66[0x0]=0x0,_0x316d66[0x1]=0x0,_0x316d66[0x2]=0x0,_0x316d66[0x3]=0x1,_0x316d66;}export function isIdentity(_0x342e4d){return _0x342e4d[0x0]===0x0&&_0x342e4d[0x1]===0x0&&_0x342e4d[0x2]===0x0&&_0x342e4d[0x3]===0x1;}export function isEmpty(_0x1ef143){return _0x1ef143[0x0]===0x0&&_0x1ef143[0x1]===0x0&&_0x1ef143[0x2]===0x0&&_0x1ef143[0x3]===0x0;}export function isNearlyEmpty(_0x44415b){const _0x1f297f=a76_0x4a44;return a76_0x4e3f16[_0x1f297f(0x1f2)](_0x44415b[0x0])&&a76_0x4e3f16[_0x1f297f(0x1f2)](_0x44415b[0x1])&&a76_0x4e3f16[_0x1f297f(0x1f2)](_0x44415b[0x2])&&a76_0x4e3f16[_0x1f297f(0x1f2)](_0x44415b[0x3]);}export function isEqual(_0xac5166,_0x24b6f5){return _0xac5166[0x0]===_0x24b6f5[0x0]&&_0xac5166[0x1]===_0x24b6f5[0x1]&&_0xac5166[0x2]===_0x24b6f5[0x2]&&_0xac5166[0x3]===_0x24b6f5[0x3];}export function isNearlyEqual(_0x33bb85,_0x7ab649){const _0x57660e=a76_0x4a44;return a76_0x4e3f16[_0x57660e(0x1f2)](_0x33bb85[0x0]-_0x7ab649[0x0])&&a76_0x4e3f16['isNearlyZero'](_0x33bb85[0x1]-_0x7ab649[0x1])&&a76_0x4e3f16[_0x57660e(0x1f2)](_0x33bb85[0x2]-_0x7ab649[0x2])&&a76_0x4e3f16[_0x57660e(0x1f2)](_0x33bb85[0x3]-_0x7ab649[0x3]);}export function length(_0x1b066b){const _0x49a394=a76_0x4a44;return Math[_0x49a394(0x1eb)](_0x1b066b[0x0],_0x1b066b[0x1],_0x1b066b[0x2],_0x1b066b[0x3]);}export function lengthSq(_0x2ac286){return _0x2ac286[0x0]*_0x2ac286[0x0]+_0x2ac286[0x1]*_0x2ac286[0x1]+_0x2ac286[0x2]*_0x2ac286[0x2]+_0x2ac286[0x3]*_0x2ac286[0x3];}export function normalize(_0xba8526,_0x405027){const _0x11efb5=a76_0x4a44;_0xba8526=_0xba8526||make();const _0x2b9c10=a76_0x4e3f16[_0x11efb5(0x1e0)](length(_0x405027));return _0xba8526[0x0]=_0x405027[0x0]*_0x2b9c10,_0xba8526[0x1]=_0x405027[0x1]*_0x2b9c10,_0xba8526[0x2]=_0x405027[0x2]*_0x2b9c10,_0xba8526[0x3]=_0x405027[0x3]*_0x2b9c10,_0xba8526;}export function conjugate(_0x136630,_0x3a2b07){return _0x136630=_0x136630||make(),_0x136630[0x0]=-_0x3a2b07[0x0],_0x136630[0x1]=-_0x3a2b07[0x1],_0x136630[0x2]=-_0x3a2b07[0x2],_0x136630[0x3]=_0x3a2b07[0x3],_0x136630;}export function exp(_0x5e08a4,_0x1447ae){const _0xf819ba=a76_0x4a44;_0x5e08a4=_0x5e08a4||make();let _0x28fd14=_0x1447ae[0x0],_0x4b2d2a=_0x1447ae[0x1],_0x11acfd=_0x1447ae[0x2],_0x1d100d=_0x1447ae[0x3],_0x3f6231=Math[_0xf819ba(0x1eb)](_0x28fd14,_0x4b2d2a,_0x11acfd),_0x48ee43=Math[_0xf819ba(0x1f1)](_0x3f6231),_0x17ef3f=Math[_0xf819ba(0x1e2)](_0x3f6231);if(a76_0x4e3f16['isNearlyZero'](_0x3f6231,1.192092896e-7)===![]){let _0x2429fe=_0x48ee43/_0x3f6231;_0x28fd14*=_0x2429fe,_0x4b2d2a*=_0x2429fe,_0x11acfd*=_0x2429fe,_0x1d100d*=_0x2429fe;}return _0x5e08a4[0x0]=_0x28fd14,_0x5e08a4[0x1]=_0x4b2d2a,_0x5e08a4[0x2]=_0x11acfd,_0x5e08a4[0x3]=_0x17ef3f,_0x5e08a4;}export function ln(_0xbfc75e,_0x1ca048){const _0x4690d4=a76_0x4a44;_0xbfc75e=_0xbfc75e||make();let _0x3e0211=_0x1ca048[0x0],_0x475c71=_0x1ca048[0x1],_0x4e730d=_0x1ca048[0x2],_0x2b7216=_0x1ca048[0x3];const _0x5cd81b=0x1-0.00001;if(_0x2b7216>=-_0x5cd81b&&_0x2b7216<=_0x5cd81b){let _0x4d8b49=Math[_0x4690d4(0x1e4)](_0x2b7216),_0x37bfe3=Math[_0x4690d4(0x1f1)](_0x4d8b49),_0x2efbe7=_0x4d8b49*a76_0x4e3f16[_0x4690d4(0x1e0)](_0x37bfe3);_0x3e0211*=_0x2efbe7,_0x475c71*=_0x2efbe7,_0x4e730d*=_0x2efbe7;}return _0xbfc75e[0x0]=_0x3e0211,_0xbfc75e[0x1]=_0x475c71,_0xbfc75e[0x2]=_0x4e730d,_0xbfc75e[0x3]=0x0,_0xbfc75e;}export function inverse(_0x3fe60d,_0x49fcf3){const _0x2e050a=a76_0x4a44;_0x3fe60d=_0x3fe60d||make();let _0x450068=_0x49fcf3[0x0],_0x1735bb=_0x49fcf3[0x1],_0x39d96a=_0x49fcf3[0x2],_0x4d05d0=_0x49fcf3[0x3],_0x363195=_0x450068*_0x450068+_0x1735bb*_0x1735bb+_0x39d96a*_0x39d96a+_0x4d05d0*_0x4d05d0;return _0x363195>1.192092896e-7?(_0x363195=a76_0x4e3f16[_0x2e050a(0x1e9)](_0x363195),_0x3fe60d[0x0]=-_0x450068*_0x363195,_0x3fe60d[0x1]=-_0x1735bb*_0x363195,_0x3fe60d[0x2]=-_0x39d96a*_0x363195,_0x3fe60d[0x3]=_0x4d05d0*_0x363195):(_0x3fe60d[0x0]=0x0,_0x3fe60d[0x1]=0x0,_0x3fe60d[0x2]=0x0,_0x3fe60d[0x3]=0x0),_0x3fe60d;}export function sphereLerp(_0x1dcda5,_0x29b23d,_0x9a6c38,_0x399e3e){const _0x264ebd=a76_0x4a44;_0x1dcda5=_0x1dcda5||make();let _0x2d5cf5=_0x29b23d[0x0],_0x486623=_0x29b23d[0x1],_0x33e38c=_0x29b23d[0x2],_0x152d06=_0x29b23d[0x3],_0x681ea5=_0x9a6c38[0x0],_0x14d41f=_0x9a6c38[0x1],_0x424161=_0x9a6c38[0x2],_0x455719=_0x9a6c38[0x3],_0x3aa9fa,_0x48bd17;{_0x3aa9fa=_0x2d5cf5*_0x681ea5+_0x486623*_0x14d41f+_0x33e38c*_0x424161+_0x152d06*_0x455719,_0x48bd17=_0x3aa9fa<0x0?-0x1:0x1,_0x3aa9fa*=_0x48bd17;}let _0x342b7d,_0x4bfce6;{_0x342b7d=Math[_0x264ebd(0x1f6)](0x1-_0x3aa9fa*_0x3aa9fa),_0x4bfce6=Math[_0x264ebd(0x1ee)](_0x342b7d,_0x3aa9fa);}let _0x4c33ae=0x1-_0x399e3e,_0x596e29=_0x399e3e;if(_0x3aa9fa<0x1-0.00001){let _0x3b880b=a76_0x4e3f16[_0x264ebd(0x1e9)](_0x342b7d);_0x4c33ae=Math[_0x264ebd(0x1f1)](_0x4c33ae*_0x4bfce6)*_0x3b880b,_0x596e29=Math[_0x264ebd(0x1f1)](_0x596e29*_0x4bfce6)*_0x3b880b;}let _0x184490=_0x4c33ae,_0x242373=_0x596e29*_0x48bd17;return _0x1dcda5[0x0]=_0x681ea5*_0x242373+_0x2d5cf5*_0x184490,_0x1dcda5[0x1]=_0x14d41f*_0x242373+_0x486623*_0x184490,_0x1dcda5[0x2]=_0x424161*_0x242373+_0x33e38c*_0x184490,_0x1dcda5[0x3]=_0x455719*_0x242373+_0x152d06*_0x184490,_0x1dcda5;}export function mul(_0xc8675b,_0x2a5e8d,_0x9a79f1){_0xc8675b=_0xc8675b||make();let _0x5ebb23=_0x2a5e8d[0x0],_0x3975ed=_0x2a5e8d[0x1],_0x464390=_0x2a5e8d[0x2],_0x32e50d=_0x2a5e8d[0x3],_0x197a1a=_0x9a79f1[0x0],_0x5efef7=_0x9a79f1[0x1],_0x340fdb=_0x9a79f1[0x2],_0x3cfa3f=_0x9a79f1[0x3];return _0xc8675b[0x0]=_0x3cfa3f*_0x5ebb23+_0x197a1a*_0x32e50d+_0x5efef7*_0x464390-_0x340fdb*_0x3975ed,_0xc8675b[0x1]=_0x3cfa3f*_0x3975ed-_0x197a1a*_0x464390+_0x5efef7*_0x32e50d+_0x340fdb*_0x5ebb23,_0xc8675b[0x2]=_0x3cfa3f*_0x464390+_0x197a1a*_0x3975ed-_0x5efef7*_0x5ebb23+_0x340fdb*_0x32e50d,_0xc8675b[0x3]=_0x3cfa3f*_0x32e50d-_0x197a1a*_0x5ebb23-_0x5efef7*_0x3975ed-_0x340fdb*_0x464390,_0xc8675b;}export function rotate(_0x40bbad,_0x25cb88,_0x154c09){const _0x20036a=a76_0x4a44;_0x40bbad=_0x40bbad||make();let _0x291584=_0x25cb88[0x0],_0x58bf81=_0x25cb88[0x1],_0x1e2df8=_0x25cb88[0x2],_0x2e7a6f=Math[_0x20036a(0x1eb)](_0x291584,_0x58bf81,_0x1e2df8);_0x2e7a6f>0x0&&(_0x2e7a6f=0x1/_0x2e7a6f,_0x291584*=_0x2e7a6f,_0x58bf81*=_0x2e7a6f,_0x1e2df8*=_0x2e7a6f);let _0x5426c6=_0x154c09*0.5,_0x406489=Math[_0x20036a(0x1f1)](_0x5426c6),_0x518815=Math['cos'](_0x5426c6);return _0x40bbad[0x0]=_0x406489*_0x291584,_0x40bbad[0x1]=_0x406489*_0x58bf81,_0x40bbad[0x2]=_0x406489*_0x1e2df8,_0x40bbad[0x3]=_0x518815,_0x40bbad;}export function rotateNormal(_0x5e3740,_0x307d8e,_0xd8aed1){const _0x5d235d=a76_0x4a44;_0x5e3740=_0x5e3740||make();let _0x2ac923=_0xd8aed1*0.5,_0x2c2a02=Math[_0x5d235d(0x1f1)](_0x2ac923),_0x18a3a0=Math[_0x5d235d(0x1e2)](_0x2ac923);return _0x5e3740[0x0]=_0x2c2a02*_0x307d8e[0x0],_0x5e3740[0x1]=_0x2c2a02*_0x307d8e[0x1],_0x5e3740[0x2]=_0x2c2a02*_0x307d8e[0x2],_0x5e3740[0x3]=_0x18a3a0,_0x5e3740;}function a76_0x4a44(_0x2bc473,_0x2861e3){_0x2bc473=_0x2bc473-0x1de;let _0xaea7cb=a76_0xaea7[_0x2bc473];return _0xaea7cb;}export function rotatePitchYawRoll(_0xa21af1,_0x5df4b6,_0x5ad8f8,_0x460ed3){const _0x383267=a76_0x4a44;_0xa21af1=_0xa21af1||make();let _0x47f707=_0x5df4b6*0.5,_0x17e240=_0x5ad8f8*0.5,_0x404b58=_0x460ed3*0.5,_0x420e58=Math[_0x383267(0x1f1)](_0x47f707),_0x4904e3=Math[_0x383267(0x1f1)](_0x17e240),_0x319cfc=Math[_0x383267(0x1f1)](_0x404b58),_0x408ef7=Math[_0x383267(0x1e2)](_0x47f707),_0x199158=Math[_0x383267(0x1e2)](_0x17e240),_0x56c3d7=Math['cos'](_0x404b58),_0x181e9a=_0x420e58*_0x199158*_0x56c3d7,_0x13f434=_0x408ef7*_0x4904e3*_0x56c3d7,_0x37a274=_0x408ef7*_0x199158*_0x319cfc,_0x596ff9=_0x408ef7*_0x199158*_0x56c3d7,_0x4ac928=_0x420e58*_0x199158,_0x2f4824=-_0x408ef7*_0x4904e3,_0x5e8da0=-_0x408ef7*_0x199158,_0x403984=_0x408ef7*_0x199158;return _0xa21af1[0x0]=_0x4ac928*_0x56c3d7+_0x181e9a,_0xa21af1[0x1]=_0x2f4824*_0x56c3d7+_0x13f434,_0xa21af1[0x2]=_0x5e8da0*_0x319cfc+_0x37a274,_0xa21af1[0x3]=_0x403984*_0x56c3d7+_0x596ff9,_0xa21af1;}export function rotateMatrix(_0x1f8be5,_0x1b75ca){const _0x118c4c=a76_0x4a44;_0x1f8be5=_0x1f8be5||make();let _0x34d005=_0x1b75ca[0xa];if(_0x34d005<=0x0){let _0x413fb7=_0x1b75ca[0x5]-_0x1b75ca[0x0],_0x5c1a44=0x1-_0x34d005;if(_0x413fb7<=0x0){let _0x23e9cd=_0x5c1a44-_0x413fb7,_0x2f1b58=0.5/Math[_0x118c4c(0x1f6)](_0x23e9cd);_0x1f8be5[0x0]=_0x23e9cd*_0x2f1b58,_0x1f8be5[0x1]=(_0x1b75ca[0x1]+_0x1b75ca[0x4])*_0x2f1b58,_0x1f8be5[0x2]=(_0x1b75ca[0x2]+_0x1b75ca[0x8])*_0x2f1b58,_0x1f8be5[0x3]=(_0x1b75ca[0x6]-_0x1b75ca[0x9])*_0x2f1b58;}else{let _0x2871e2=_0x5c1a44+_0x413fb7,_0x43b1b6=0.5/Math[_0x118c4c(0x1f6)](_0x2871e2);_0x1f8be5[0x0]=(_0x1b75ca[0x1]+_0x1b75ca[0x4])*_0x43b1b6,_0x1f8be5[0x1]=_0x2871e2*_0x43b1b6,_0x1f8be5[0x2]=(_0x1b75ca[0x6]+_0x1b75ca[0x9])*_0x43b1b6,_0x1f8be5[0x3]=(_0x1b75ca[0x8]-_0x1b75ca[0x2])*_0x43b1b6;}}else{let _0x1eccd6=_0x1b75ca[0x5]+_0x1b75ca[0x0],_0x4952d5=0x1+_0x34d005;if(_0x1eccd6<=0x0){let _0x112597=_0x4952d5-_0x1eccd6,_0x286a37=0.5/Math[_0x118c4c(0x1f6)](_0x112597);_0x1f8be5[0x0]=(_0x1b75ca[0x2]+_0x1b75ca[0x8])*_0x286a37,_0x1f8be5[0x1]=(_0x1b75ca[0x6]+_0x1b75ca[0x9])*_0x286a37,_0x1f8be5[0x2]=_0x112597*_0x286a37,_0x1f8be5[0x3]=(_0x1b75ca[0x1]-_0x1b75ca[0x4])*_0x286a37;}else{let _0x5b581d=_0x4952d5+_0x1eccd6,_0x5b8389=0.5/Math['sqrt'](_0x5b581d);_0x1f8be5[0x0]=(_0x1b75ca[0x6]-_0x1b75ca[0x9])*_0x5b8389,_0x1f8be5[0x1]=(_0x1b75ca[0x8]-_0x1b75ca[0x2])*_0x5b8389,_0x1f8be5[0x2]=(_0x1b75ca[0x1]-_0x1b75ca[0x4])*_0x5b8389,_0x1f8be5[0x3]=_0x5b581d*_0x5b8389;}}return _0x1f8be5;}export function rotateBetweenVec(_0x4a30bd,_0x2a2f5b,_0x27c74d){const _0x5c526c=a76_0x4a44;_0x4a30bd=_0x4a30bd||make();let _0x1f1c09=a76_0x120179[_0x5c526c(0x1e5)](null,_0x2a2f5b),_0x94eeaf=a76_0x120179[_0x5c526c(0x1e5)](null,_0x27c74d);if(a76_0x4e3f16[_0x5c526c(0x1f2)](_0x1f1c09[0x0]-_0x94eeaf[0x0])&&a76_0x4e3f16[_0x5c526c(0x1f2)](_0x1f1c09[0x1]-_0x94eeaf[0x1])&&a76_0x4e3f16['isNearlyZero'](_0x1f1c09[0x2]-_0x94eeaf[0x2]))return identity(_0x4a30bd);if(a76_0x4e3f16[_0x5c526c(0x1f2)](_0x1f1c09[0x0]+_0x94eeaf[0x0])&&a76_0x4e3f16[_0x5c526c(0x1f2)](_0x1f1c09[0x1]+_0x94eeaf[0x1])&&a76_0x4e3f16['isNearlyZero'](_0x1f1c09[0x2]+_0x94eeaf[0x2])){let _0x2be224=a76_0x120179[_0x5c526c(0x1e8)](null,_0x1f1c09);return rotateNormal(_0x4a30bd,_0x2be224,a76_0x4e3f16['pi']);}let _0x75b617,_0x190c87;{_0x75b617=a76_0x120179[_0x5c526c(0x1ea)](_0x75b617,_0x1f1c09,_0x94eeaf),_0x75b617=a76_0x120179['normalize'](_0x75b617,_0x75b617),_0x190c87=a76_0x120179[_0x5c526c(0x1ed)](_0x190c87,_0x1f1c09,_0x75b617);}return _0x4a30bd[0x0]=_0x190c87[0x0],_0x4a30bd[0x1]=_0x190c87[0x1],_0x4a30bd[0x2]=_0x190c87[0x2],_0x4a30bd[0x3]=a76_0x120179['dot'](_0x1f1c09,_0x75b617),_0x4a30bd;}export function decompose(_0x18d503){const _0x506a32=a76_0x4a44;let _0x4d592f=a76_0x120179[_0x506a32(0x1f5)](_0x18d503[0x0],_0x18d503[0x1],_0x18d503[0x2]),_0x14bd69=0x2*Math[_0x506a32(0x1e4)](_0x18d503[0x3]);return[_0x4d592f,_0x14bd69];}