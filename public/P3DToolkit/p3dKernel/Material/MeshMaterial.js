'use strict';const a64_0xe20a=['默认青绿色','from','默认材质','specularB','unpackBGBA','specularR','4CqxeRd','默认红色','默认深红色','默认深黄色','5IvqscF','6044NECqYV','默认白色','specularG','ambientB','log','emissiveB','type','默认青蓝色','ambientR','935204TqdQdx','553529KZJJKL','默认黑色','diffuseG','emissiveR','ambientG','默认黄色','diffuseB','roughness','默认紫色','173527wBrlMS','默认灰色','alpha','612605duGUGl','853329kyAIyH','133aVyeKL','默认粉色','sRGBToLinear','diffuseR','默认亮绿色','默认深蓝色','emissiveG','260114NdlyAi','saturate'];(function(_0x43bc74,_0x6072c2){const _0xb1847c=a64_0xb694;while(!![]){try{const _0x4ee146=-parseInt(_0xb1847c(0x98))*-parseInt(_0xb1847c(0xac))+-parseInt(_0xb1847c(0xaf))+-parseInt(_0xb1847c(0xc0))*parseInt(_0xb1847c(0xb8))+parseInt(_0xb1847c(0x99))*parseInt(_0xb1847c(0xb1))+parseInt(_0xb1847c(0xa3))+-parseInt(_0xb1847c(0xb0))+parseInt(_0xb1847c(0xa2));if(_0x4ee146===_0x6072c2)break;else _0x43bc74['push'](_0x43bc74['shift']());}catch(_0x11c650){_0x43bc74['push'](_0x43bc74['shift']());}}}(a64_0xe20a,0x9fa06));function a64_0xb694(_0x35b80c,_0x3c72b0){_0x35b80c=_0x35b80c-0x95;let _0xe20adb=a64_0xe20a[_0x35b80c];return _0xe20adb;}import*as a64_0x59cf74 from'../Math/float4.js';export function make(_0x392b4f){let _0x47ce3d={'name':'','type':P3D_MATERIAL_TYPE_MESH_COLOR,'uPos':0x0,'uID':_0x392b4f,'emissiveR':0x0,'emissiveG':0x0,'emissiveB':0x0,'ambientR':0x1,'ambientG':0x1,'ambientB':0x1,'diffuseR':0x1,'diffuseG':0x1,'diffuseB':0x1,'specularR':0.9,'specularG':0.9,'specularB':0.9,'roughness':0.1,'alpha':0x1,'texSlicePos':0x0};return _0x47ce3d;}export function fromSysMaterial(_0x3e2836,_0x3759ea){const _0x19eb3a=a64_0xb694;let _0x28a6cc=make(_0x3e2836),_0x753496=getSystemMaterialPureFlag(_0x3e2836),_0x411723=null;return _0x3759ea?(_0x411723=a64_0x59cf74[_0x19eb3a(0xbe)](null,getSystemMaterialColor(_0x3e2836)),_0x411723=a64_0x59cf74[_0x19eb3a(0xb3)](_0x411723,_0x411723),_0x28a6cc['roughness']=phongPowerToRoughness(0x28*2.55)):(_0x411723=a64_0x59cf74[_0x19eb3a(0xbe)](null,getSystemMaterialSrgbColor(_0x3e2836)),_0x28a6cc[_0x19eb3a(0xaa)]=0xa),_0x28a6cc['emissiveR']=_0x753496==!![]?_0x411723[0x0]:0x0,_0x28a6cc[_0x19eb3a(0xb7)]=_0x753496==!![]?_0x411723[0x1]:0x0,_0x28a6cc[_0x19eb3a(0x9e)]=_0x753496==!![]?_0x411723[0x2]:0x0,_0x28a6cc[_0x19eb3a(0xa1)]=_0x753496==![]?_0x411723[0x0]:0x0,_0x28a6cc[_0x19eb3a(0xa7)]=_0x753496==![]?_0x411723[0x1]:0x0,_0x28a6cc['ambientB']=_0x753496==![]?_0x411723[0x2]:0x0,_0x28a6cc[_0x19eb3a(0xb4)]=_0x753496==![]?_0x411723[0x0]:0x0,_0x28a6cc[_0x19eb3a(0xa5)]=_0x753496==![]?_0x411723[0x1]:0x0,_0x28a6cc[_0x19eb3a(0xa9)]=_0x753496==![]?_0x411723[0x2]:0x0,_0x28a6cc['specularR']=_0x753496==![]?_0x411723[0x0]:0x0,_0x28a6cc['specularG']=_0x753496==![]?_0x411723[0x1]:0x0,_0x28a6cc[_0x19eb3a(0xbd)]=_0x753496==![]?_0x411723[0x2]:0x0,_0x28a6cc['name']=getSystemMaterialName(_0x3e2836),_0x28a6cc;}export function isSystemMaterial(_0x116e61){return _0x116e61>=0x64&&_0x116e61<=0x81;}export function getSystemMaterialPureFlag(_0xec4421){return _0xec4421>=0x73&&_0xec4421<=0x81;}export function getSystemMaterialName(_0x2aac03){const _0x45b598=a64_0xb694;if(_0x2aac03==0x64||_0x2aac03==0x73)return _0x45b598(0x95);if(_0x2aac03==0x65||_0x2aac03==0x74)return _0x45b598(0xb5);if(_0x2aac03==0x66||_0x2aac03==0x75)return'默认蓝色';if(_0x2aac03==0x67||_0x2aac03==0x76)return _0x45b598(0xa8);if(_0x2aac03==0x68||_0x2aac03==0x77)return _0x45b598(0xb2);if(_0x2aac03==0x69||_0x2aac03==0x78)return _0x45b598(0xba);if(_0x2aac03==0x6a||_0x2aac03==0x79)return _0x45b598(0xa4);if(_0x2aac03==0x6b||_0x2aac03==0x7a)return _0x45b598(0x9a);if(_0x2aac03==0x6c||_0x2aac03==0x7b)return _0x45b598(0xad);if(_0x2aac03==0x6d||_0x2aac03==0x7c)return _0x45b598(0x96);if(_0x2aac03==0x6e||_0x2aac03==0x7d)return'默认绿色';if(_0x2aac03==0x6f||_0x2aac03==0x7e)return _0x45b598(0xb6);if(_0x2aac03==0x70||_0x2aac03==0x7f)return _0x45b598(0x97);if(_0x2aac03==0x71||_0x2aac03==0x80)return _0x45b598(0xab);if(_0x2aac03==0x72||_0x2aac03==0x81)return _0x45b598(0xa0);if(_0x2aac03==-0x1)return _0x45b598(0xbc);return'默认颜色';}export function getSystemMaterialColor(_0x64de1c){if(_0x64de1c==0x64||_0x64de1c==0x73)return 0xffff0000;if(_0x64de1c==0x65||_0x64de1c==0x74)return 0xff00ff00;if(_0x64de1c==0x66||_0x64de1c==0x75)return 0xff0000ff;if(_0x64de1c==0x67||_0x64de1c==0x76)return 0xffffff00;if(_0x64de1c==0x68||_0x64de1c==0x77)return 0xffff00ff;if(_0x64de1c==0x69||_0x64de1c==0x78)return 0xff00ffff;if(_0x64de1c==0x6a||_0x64de1c==0x79)return 0xff000000;if(_0x64de1c==0x6b||_0x64de1c==0x7a)return 0xffffffff;if(_0x64de1c==0x6c||_0x64de1c==0x7b)return 0xff7f7f7f;if(_0x64de1c==0x6d||_0x64de1c==0x7c)return 0xff7f0000;if(_0x64de1c==0x6e||_0x64de1c==0x7d)return 0xff007f00;if(_0x64de1c==0x6f||_0x64de1c==0x7e)return 0xff00007f;if(_0x64de1c==0x70||_0x64de1c==0x7f)return 0xff7f7f00;if(_0x64de1c==0x71||_0x64de1c==0x80)return 0xff7f007f;if(_0x64de1c==0x72||_0x64de1c==0x81)return 0xff007f7f;return 0xff000000;}export function getSystemMaterialSrgbColor(_0x51465a){if(_0x51465a==0x64||_0x51465a==0x73)return 0xffff0000;if(_0x51465a==0x65||_0x51465a==0x74)return 0xff7fff00;if(_0x51465a==0x66||_0x51465a==0x75)return 0xff0000ff;if(_0x51465a==0x67||_0x51465a==0x76)return 0xffffff00;if(_0x51465a==0x68||_0x51465a==0x77)return 0xffffbfcc;if(_0x51465a==0x69||_0x51465a==0x78)return 0xff40decc;if(_0x51465a==0x6a||_0x51465a==0x79)return 0xff000000;if(_0x51465a==0x6b||_0x51465a==0x7a)return 0xffffffff;if(_0x51465a==0x6c||_0x51465a==0x7b)return 0xff7f7f7f;if(_0x51465a==0x6d||_0x51465a==0x7c)return 0xffb31a1a;if(_0x51465a==0x6e||_0x51465a==0x7d)return 0xff00ff00;if(_0x51465a==0x6f||_0x51465a==0x7e)return 0xff1a1a70;if(_0x51465a==0x70||_0x51465a==0x7f)return 0xffffd600;if(_0x51465a==0x71||_0x51465a==0x80)return 0xff8a2be3;if(_0x51465a==0x72||_0x51465a==0x81)return 0xff00ffff;if(_0x51465a==-0x1)return 0xff999999;return 0xff000000;}export function phongPowerToRoughness(_0x12aa19){const _0x42d0e3=a64_0xb694;if(_0x12aa19<=0x0)return 0x1;const _0x5a16b8=Math[_0x42d0e3(0x9d)](_0x12aa19);if(_0x12aa19<=0x18)return math[_0x42d0e3(0xb9)](0.773871-0.160132*_0x5a16b8);if(_0x12aa19<=0x3c)return math[_0x42d0e3(0xb9)](0.606127-0.105979*_0x5a16b8);return math[_0x42d0e3(0xb9)](0.4008-0.0562807*_0x5a16b8);}export function fromColor(_0x20e688,_0x2dcae9,_0xb3f4bc,_0x58ee0f,_0x13d341){const _0x125f95=a64_0xb694;let _0x15c21a=make(g_newMaterialID++),_0x1a0acc=a64_0x59cf74[_0x125f95(0xbb)](_0x20e688,_0x2dcae9,_0xb3f4bc,0x1);return _0x13d341&&(_0x1a0acc=a64_0x59cf74[_0x125f95(0xb3)](_0x1a0acc,_0x1a0acc)),_0x15c21a[_0x125f95(0xa1)]=_0x1a0acc[0x0],_0x15c21a[_0x125f95(0xa7)]=_0x1a0acc[0x1],_0x15c21a[_0x125f95(0x9c)]=_0x1a0acc[0x2],_0x1a0acc=a64_0x59cf74['from'](_0x20e688,_0x2dcae9,_0xb3f4bc,0x1),_0x13d341&&(_0x1a0acc=a64_0x59cf74[_0x125f95(0xb3)](_0x1a0acc,_0x1a0acc)),_0x15c21a[_0x125f95(0xb4)]=_0x1a0acc[0x0],_0x15c21a['diffuseG']=_0x1a0acc[0x1],_0x15c21a['diffuseB']=_0x1a0acc[0x2],_0x1a0acc=a64_0x59cf74['from'](_0x20e688,_0x2dcae9,_0xb3f4bc,0x1),_0x13d341&&(_0x1a0acc=a64_0x59cf74[_0x125f95(0xb3)](_0x1a0acc,_0x1a0acc)),_0x15c21a[_0x125f95(0xbf)]=_0x1a0acc[0x0],_0x15c21a[_0x125f95(0x9b)]=_0x1a0acc[0x1],_0x15c21a['specularB']=_0x1a0acc[0x2],_0x15c21a['alpha']=_0x58ee0f,_0x15c21a[_0x125f95(0x9f)]=P3D_MATERIAL_TYPE_MESH_COLOR,_0x15c21a;}export function fromMaterial(_0x48c66f,_0x17af59,_0x34fc0c,_0x2be2c4,_0xf33357,_0x3c2fdb){const _0xd87ac9=a64_0xb694;let _0x338e88=make(g_newMaterialID++);return _0x338e88[_0xd87ac9(0xa6)]=_0x48c66f[0x0],_0x338e88[_0xd87ac9(0xb7)]=_0x48c66f[0x1],_0x338e88['emissiveB']=_0x48c66f[0x2],_0x338e88[_0xd87ac9(0xa1)]=_0x17af59[0x0],_0x338e88[_0xd87ac9(0xa7)]=_0x17af59[0x1],_0x338e88[_0xd87ac9(0x9c)]=_0x17af59[0x2],_0x338e88[_0xd87ac9(0xb4)]=_0x34fc0c[0x0],_0x338e88['diffuseG']=_0x34fc0c[0x1],_0x338e88[_0xd87ac9(0xa9)]=_0x34fc0c[0x2],_0x338e88[_0xd87ac9(0xbf)]=_0x2be2c4[0x0],_0x338e88[_0xd87ac9(0x9b)]=_0x2be2c4[0x1],_0x338e88[_0xd87ac9(0xbd)]=_0x2be2c4[0x2],_0x338e88[_0xd87ac9(0xae)]=_0xf33357,_0x338e88[_0xd87ac9(0xaa)]=_0x3c2fdb,_0x338e88[_0xd87ac9(0x9f)]=P3D_MATERIAL_TYPE_MESH_COLOR,_0x338e88;}