'use strict';const a81_0x36b8=['LogicError','createStaticVertexBuffer','_arrSubsetMtlID','bounds','_uIsUV','4OmIRLs','6113iiBEuC','transparentView','uploadArrayData','push','cleObjAnimationArray','toTextureFloatArray','_arrKeyFrameData','35UElJZh','_arrTranspKeyFrm','textureMaterialPos','length','_matWorld','38493Ipzzuo','148703WRfCWS','564487XUnlxb','mul','_arrVertexData','_matLocal','1EhGNTY','textureObjPos','solidView','invalid\x20material\x20index\x20','fromCleMatrix','inverseTranspose','textureAlpha','uWorldAlphaRevision','vWorldITMatrixArray','textureWorldIT','_stuModelData','35311oYWlgB','fromCleBox','createStaticIndexBuffer','_uObjectID','fill','textureWorld','vWorldMatrixArray','createForFloatArray','vAlphaArray','cleObjectArray','getArrayData','_box','_uMeshID','make','iBuffer','uObjCount','95892RydZzX','_arrSubset','_uModelID','234849qYBTzR','vFlagArray','vSubsetBuffer','transform','view','xyz<n<uv'];(function(_0x52b62f,_0x59757a){const _0x4d6cdf=a81_0xd64e;while(!![]){try{const _0x3bf1dd=parseInt(_0x4d6cdf(0x221))+parseInt(_0x4d6cdf(0x223))+-parseInt(_0x4d6cdf(0x209))+-parseInt(_0x4d6cdf(0x227))*parseInt(_0x4d6cdf(0x222))+parseInt(_0x4d6cdf(0x206))+parseInt(_0x4d6cdf(0x214))*-parseInt(_0x4d6cdf(0x1f6))+-parseInt(_0x4d6cdf(0x215))*-parseInt(_0x4d6cdf(0x21c));if(_0x3bf1dd===_0x59757a)break;else _0x52b62f['push'](_0x52b62f['shift']());}catch(_0x3dab3e){_0x52b62f['push'](_0x52b62f['shift']());}}}(a81_0x36b8,0x5ebbf));import*as a81_0x509461 from'../Math/math.js';import*as a81_0x3d8aee from'../Math/matrix.js';import*as a81_0x40e6e5 from'../Math/box.js';import*as a81_0x581e66 from'./P3DComm.js';export function from(_0x2c9de2,_0xd00088,_0x1e43c0,_0x3a1fc1,_0x411d71){const _0x39251c=a81_0xd64e;let _0x341e00={'uIndex':_0xd00088[_0x39251c(0x208)],'cleModel':_0xd00088,'bounds':a81_0x581e66[_0x39251c(0x1f7)](null,_0xd00088['_stuModelData'][_0x39251c(0x201)]),'bContainUV':![],'cleObjectArray':new Array(),'cleObjAnimationArray':new Array(),'vFlagArray':new Array(),'vWorldMatrixArray':null,'vWorldITMatrixArray':null,'vAlphaArray':null,'vBuffer':null,'vSubsetBuffer':null,'iBuffer':null,'view':null,'solidView':null,'transparentView':null,'uWorldAlphaRevision':0x0},_0x3e10b9=_0xd00088[_0x39251c(0x1f5)];_0x341e00['bContainUV']=_0x3e10b9['_uIsUV']===0x1,_0x341e00['vBuffer']=Buffer['createStaticVertexBuffer'](_0x2c9de2,_0x3e10b9[_0x39251c(0x225)],_0x341e00['bContainUV']?_0x39251c(0x20e):'xyz<n'),_0x341e00[_0x39251c(0x20b)]=buildVertexSubsetIndex(_0x2c9de2,_0xd00088),_0x341e00[_0x39251c(0x204)]=Buffer[_0x39251c(0x1f8)](_0x2c9de2,_0x3e10b9['_arrIndexData']);const _0x5c3de8=_0x341e00['uIndex'];for(const _0x2d3ac9 of _0x1e43c0['_arrObjSaveData']){if(_0x2d3ac9['_nFillMode']!=ADFFILL_SOLID)continue;if(_0x2d3ac9[_0x39251c(0x202)]==_0x5c3de8){let _0x582e98=computeSubsetFlag(_0xd00088,_0x2d3ac9,_0x411d71);_0x341e00[_0x39251c(0x1ff)]['push'](_0x2d3ac9),_0x341e00[_0x39251c(0x219)][_0x39251c(0x218)](_0x3a1fc1[_0x2d3ac9[_0x39251c(0x1f9)]]),_0x341e00[_0x39251c(0x20a)]['push'](_0x582e98);}}return _0x341e00[_0x39251c(0x1fc)]=new Array(_0x341e00[_0x39251c(0x1ff)][_0x39251c(0x21f)]),_0x341e00[_0x39251c(0x1f3)]=new Array(_0x341e00[_0x39251c(0x1ff)][_0x39251c(0x21f)]),_0x341e00[_0x39251c(0x1fe)]=new Array(_0x341e00[_0x39251c(0x1ff)][_0x39251c(0x21f)])[_0x39251c(0x1fa)](0x1),_0x341e00[_0x39251c(0x20d)]=makeView(_0x2c9de2,_0x341e00[_0x39251c(0x1ff)]['length'],_0xd00088[_0x39251c(0x1f5)][_0x39251c(0x207)][_0x39251c(0x21f)]),_0x341e00['solidView']=makeObjectView(_0x2c9de2,_0x341e00[_0x39251c(0x1ff)][_0x39251c(0x21f)]),_0x341e00[_0x39251c(0x216)]=makeObjectView(_0x2c9de2,_0x341e00['cleObjectArray'][_0x39251c(0x21f)]),initWorldMatrixAndAlpha(_0x341e00),updateObjSubsetView(_0x341e00,_0x411d71),_0x341e00;}function buildVertexSubsetIndex(_0x16e60e,_0xc0897b){const _0x1480ce=a81_0xd64e;let _0x69cca4=_0xc0897b['_stuModelData'],_0x534467=new Array(_0x69cca4[_0x1480ce(0x225)]['length']/(_0x69cca4[_0x1480ce(0x213)]===0x1?0x8:0x6));if(_0xc0897b[_0x1480ce(0x1f5)][_0x1480ce(0x207)]['length']>0x1)for(let _0x113404=0x0;_0x113404<_0xc0897b[_0x1480ce(0x1f5)][_0x1480ce(0x207)]['length'];++_0x113404){let _0x3feb0e=_0xc0897b['_stuModelData'][_0x1480ce(0x207)][_0x113404]['_uStartIndex'],_0x4b6e57=_0xc0897b[_0x1480ce(0x1f5)][_0x1480ce(0x207)][_0x113404]['_uIndexCount'];for(let _0x5ba0e9=0x0;_0x5ba0e9<_0x4b6e57;++_0x5ba0e9){let _0x510878=_0x3feb0e+_0x5ba0e9,_0x2f643d=_0x69cca4['_arrIndexData'][_0x510878];_0x534467[_0x2f643d]=_0x113404;}}else _0x534467['fill'](0x0);return Buffer[_0x1480ce(0x210)](_0x16e60e,new Float32Array(_0x534467),'i1');}function computeSubsetFlag(_0x49b5a9,_0x257056,_0x55ea73){const _0x42a4d5=a81_0xd64e;let _0x33c14e=0x0;if(_0x49b5a9[_0x42a4d5(0x1f5)][_0x42a4d5(0x207)][_0x42a4d5(0x21f)]>0x1&&_0x49b5a9[_0x42a4d5(0x1f5)][_0x42a4d5(0x207)][_0x42a4d5(0x21f)]==_0x257056[_0x42a4d5(0x211)][_0x42a4d5(0x21f)]){let _0x37accb=0x0,_0xd2fce0=0x0;for(let _0x2f1296=0x0;_0x2f1296<_0x257056['_arrSubsetMtlID'][_0x42a4d5(0x21f)];++_0x2f1296){let _0x550ce6=_0x257056[_0x42a4d5(0x211)][_0x2f1296],_0x3733d6=_0x55ea73[_0x550ce6];if(_0x3733d6==null)throw new error[(_0x42a4d5(0x20f))](_0x42a4d5(0x1ee)+_0x550ce6);_0x3733d6['alpha']<0x1?_0xd2fce0++:_0x37accb++;}if(_0x37accb==_0x257056['_arrSubsetMtlID'][_0x42a4d5(0x21f)])_0x33c14e=-0x1;else _0xd2fce0==_0x257056[_0x42a4d5(0x211)][_0x42a4d5(0x21f)]&&(_0x33c14e=0x1);}else{let _0xedc520=0x0;_0x257056[_0x42a4d5(0x211)][_0x42a4d5(0x21f)]>0x0&&(_0xedc520=_0x257056[_0x42a4d5(0x211)][0x0]);let _0x4bbcd6=_0x55ea73[_0xedc520];if(_0x4bbcd6==null)throw new error[(_0x42a4d5(0x20f))]('invalid\x20material\x20index\x20'+_0xedc520);_0x33c14e=_0x4bbcd6['alpha']<0x1?0x1:-0x1;}return _0x33c14e;}export function initWorldMatrixAndAlpha(_0x40312f){const _0x4f508f=a81_0xd64e;resetMeshObjectView(_0x40312f);let _0x1c72e5=new ADF_BASEMATRIX(),_0x2ae705=Texture2D[_0x4f508f(0x200)](_0x40312f[_0x4f508f(0x20d)][_0x4f508f(0x1fb)]),_0x220529=Texture2D[_0x4f508f(0x200)](_0x40312f[_0x4f508f(0x20d)][_0x4f508f(0x1f4)]),_0x3ed046=Texture2D[_0x4f508f(0x200)](_0x40312f[_0x4f508f(0x20d)][_0x4f508f(0x1f1)]);for(let _0x395f43=0x0;_0x395f43<_0x40312f[_0x4f508f(0x1ff)][_0x4f508f(0x21f)];++_0x395f43){let _0x4d2c52=_0x40312f[_0x4f508f(0x1ff)][_0x395f43],_0x1c42df=_0x40312f['cleObjAnimationArray'][_0x395f43];if(_0x1c42df!=null&&_0x1c42df[_0x4f508f(0x21b)][_0x4f508f(0x21f)]>0x0)CalculateObjectWldMatrix(0x0,_0x1c42df,_0x4d2c52[_0x4f508f(0x226)],_0x4d2c52[_0x4f508f(0x220)],_0x1c72e5),_0x40312f[_0x4f508f(0x1fc)][_0x395f43]=a81_0x581e66[_0x4f508f(0x1ef)](_0x40312f[_0x4f508f(0x1fc)][_0x395f43],_0x1c72e5),_0x40312f[_0x4f508f(0x1f3)][_0x395f43]=a81_0x3d8aee[_0x4f508f(0x1f0)](_0x40312f[_0x4f508f(0x1f3)][_0x395f43],_0x40312f[_0x4f508f(0x1fc)][_0x395f43]);else{let _0x15b625=a81_0x581e66[_0x4f508f(0x1ef)](null,_0x4d2c52[_0x4f508f(0x226)]),_0x49a7db=a81_0x581e66[_0x4f508f(0x1ef)](null,_0x4d2c52[_0x4f508f(0x220)]);_0x40312f[_0x4f508f(0x1fc)][_0x395f43]=a81_0x3d8aee[_0x4f508f(0x224)](_0x40312f[_0x4f508f(0x1fc)][_0x395f43],_0x15b625,_0x49a7db),_0x40312f[_0x4f508f(0x1f3)][_0x395f43]=a81_0x3d8aee[_0x4f508f(0x1f0)](_0x40312f['vWorldITMatrixArray'][_0x395f43],_0x40312f['vWorldMatrixArray'][_0x395f43]);}_0x1c42df!=null&&_0x1c42df[_0x4f508f(0x21d)][_0x4f508f(0x21f)]>0x0&&(_0x40312f[_0x4f508f(0x1fe)][_0x395f43]=CalculateObjectNoTransparency(0x0,_0x1c42df)),a81_0x3d8aee[_0x4f508f(0x21a)](_0x40312f['vWorldMatrixArray'][_0x395f43],_0x2ae705,_0x395f43*0xc),a81_0x3d8aee[_0x4f508f(0x21a)](_0x40312f[_0x4f508f(0x1f3)][_0x395f43],_0x220529,_0x395f43*0xc),_0x3ed046[_0x395f43]=_0x40312f['vAlphaArray'][_0x395f43],populateMeshObjectView(_0x40312f,_0x395f43);}Texture2D[_0x4f508f(0x217)](_0x40312f[_0x4f508f(0x20d)][_0x4f508f(0x1fb)]),Texture2D[_0x4f508f(0x217)](_0x40312f['view']['textureWorldIT']),Texture2D[_0x4f508f(0x217)](_0x40312f[_0x4f508f(0x20d)]['textureAlpha']),uploadMeshObjectView(_0x40312f);}export function updateWorldMatrixAndAlpha(_0x3ca4e0,_0x1bab81,_0x592934){const _0x4e459e=a81_0xd64e;if(_0x3ca4e0[_0x4e459e(0x1f2)]!=_0x592934){resetMeshObjectView(_0x3ca4e0);let _0x2d9bc2=new ADF_BASEMATRIX(),_0x257186=Texture2D[_0x4e459e(0x200)](_0x3ca4e0[_0x4e459e(0x20d)][_0x4e459e(0x1fb)]),_0x4dea44=Texture2D['getArrayData'](_0x3ca4e0[_0x4e459e(0x20d)]['textureWorldIT']),_0xe71d4b=Texture2D['getArrayData'](_0x3ca4e0['view']['textureAlpha']),_0x30c049=![],_0x4aaed4=![];for(let _0x27de9e=0x0;_0x27de9e<_0x3ca4e0[_0x4e459e(0x1ff)][_0x4e459e(0x21f)];++_0x27de9e){let _0x28e57e=_0x3ca4e0[_0x4e459e(0x1ff)][_0x27de9e],_0x5a4747=_0x3ca4e0[_0x4e459e(0x219)][_0x27de9e];_0x5a4747!=null&&(_0x5a4747[_0x4e459e(0x21b)][_0x4e459e(0x21f)]>0x0&&(CalculateObjectWldMatrix(_0x1bab81,_0x5a4747,_0x28e57e[_0x4e459e(0x226)],_0x28e57e[_0x4e459e(0x220)],_0x2d9bc2),_0x3ca4e0[_0x4e459e(0x1fc)][_0x27de9e]=a81_0x581e66['fromCleMatrix'](_0x3ca4e0['vWorldMatrixArray'][_0x27de9e],_0x2d9bc2),_0x3ca4e0['vWorldITMatrixArray'][_0x27de9e]=a81_0x3d8aee[_0x4e459e(0x1f0)](_0x3ca4e0[_0x4e459e(0x1f3)][_0x27de9e],_0x3ca4e0[_0x4e459e(0x1fc)][_0x27de9e]),a81_0x3d8aee[_0x4e459e(0x21a)](_0x3ca4e0[_0x4e459e(0x1fc)][_0x27de9e],_0x257186,_0x27de9e*0xc),a81_0x3d8aee[_0x4e459e(0x21a)](_0x3ca4e0[_0x4e459e(0x1f3)][_0x27de9e],_0x4dea44,_0x27de9e*0xc),_0x30c049=!![]),_0x5a4747[_0x4e459e(0x21d)][_0x4e459e(0x21f)]>0x0&&(_0x3ca4e0[_0x4e459e(0x1fe)][_0x27de9e]=CalculateObjectNoTransparency(_0x1bab81,_0x5a4747),_0xe71d4b[_0x27de9e]=_0x3ca4e0[_0x4e459e(0x1fe)][_0x27de9e],_0x4aaed4=!![])),populateMeshObjectView(_0x3ca4e0,_0x27de9e);}_0x30c049&&(Texture2D[_0x4e459e(0x217)](_0x3ca4e0[_0x4e459e(0x20d)][_0x4e459e(0x1fb)]),Texture2D[_0x4e459e(0x217)](_0x3ca4e0['view']['textureWorldIT'])),_0x4aaed4&&(Texture2D[_0x4e459e(0x217)](_0x3ca4e0['view'][_0x4e459e(0x1f1)]),uploadMeshObjectView(_0x3ca4e0)),_0x3ca4e0['uWorldAlphaRevision']=_0x592934;}}function a81_0xd64e(_0x585975,_0x50ca3c){_0x585975=_0x585975-0x1ee;let _0x36b869=a81_0x36b8[_0x585975];return _0x36b869;}export function updateBounds(_0x31cd3a,_0x30ef4d){const _0x13b9c2=a81_0xd64e;let _0x4fd198=a81_0x40e6e5[_0x13b9c2(0x203)]();for(const _0x10d15b of _0x31cd3a[_0x13b9c2(0x1fc)]){_0x4fd198=a81_0x40e6e5[_0x13b9c2(0x20c)](_0x4fd198,_0x31cd3a[_0x13b9c2(0x212)],_0x10d15b),_0x30ef4d=a81_0x40e6e5['merge'](_0x30ef4d,_0x30ef4d,_0x4fd198);}}function makeView(_0x109500,_0x315ccd,_0x21b11e){const _0x237ae4=a81_0xd64e;let _0x5a5f10={'textureWorld':Texture2D[_0x237ae4(0x1fd)](_0x109500,0x4,_0x315ccd*0x3),'textureWorldIT':Texture2D['createForFloatArray'](_0x109500,0x4,_0x315ccd*0x3),'textureAlpha':Texture2D['createForFloatArray'](_0x109500,0x1,_0x315ccd),'textureMaterialPos':Texture2D[_0x237ae4(0x1fd)](_0x109500,0x1,_0x315ccd*_0x21b11e)};return _0x5a5f10;}function resetMeshObjectView(_0x562780){const _0x4446d6=a81_0xd64e;resetObjectView(_0x562780['solidView']),resetObjectView(_0x562780[_0x4446d6(0x216)]);}function populateMeshObjectView(_0x119f5d,_0x3063a1){const _0x17ae26=a81_0xd64e,_0x4e6981=_0x119f5d[_0x17ae26(0x1fe)][_0x3063a1];if(_0x4e6981>=0.001){let _0x2e4b6e=![],_0x9da61d=![];if(_0x4e6981<0x1)_0x9da61d=!![];else{const _0x318013=_0x119f5d[_0x17ae26(0x20a)][_0x3063a1];_0x2e4b6e=_0x318013<=0x0,_0x9da61d=_0x318013>=0x0;}_0x2e4b6e&&populateObjectView(_0x119f5d[_0x17ae26(0x229)],_0x3063a1),_0x9da61d&&populateObjectView(_0x119f5d[_0x17ae26(0x216)],_0x3063a1);}}function uploadMeshObjectView(_0x27cfb5){const _0x5ce2a5=a81_0xd64e;uploadObjectView(_0x27cfb5[_0x5ce2a5(0x229)]),uploadObjectView(_0x27cfb5[_0x5ce2a5(0x216)]);}function makeObjectView(_0x615f49,_0x221ca4){const _0x630d37=a81_0xd64e;let _0x55df63={'uObjCount':0x0,'textureObjPos':Texture2D[_0x630d37(0x1fd)](_0x615f49,0x1,_0x221ca4)};return _0x55df63;}function resetObjectView(_0x3a1d97){const _0x18b548=a81_0xd64e;_0x3a1d97[_0x18b548(0x205)]=0x0;}function populateObjectView(_0x4f1526,_0x13cd79){const _0x5c2377=a81_0xd64e;let _0x7bb54=Texture2D[_0x5c2377(0x200)](_0x4f1526['textureObjPos']);{_0x7bb54[_0x4f1526[_0x5c2377(0x205)]]=_0x13cd79;}_0x4f1526['uObjCount']++;}function uploadObjectView(_0x1ba683){const _0x46ab56=a81_0xd64e;Texture2D[_0x46ab56(0x217)](_0x1ba683[_0x46ab56(0x228)]);}function updateObjSubsetView(_0x5d64ff,_0x323fa7){const _0x1c5a78=a81_0xd64e;let _0x1ad53f=Texture2D[_0x1c5a78(0x200)](_0x5d64ff[_0x1c5a78(0x20d)]['textureMaterialPos']),_0x5901d1=_0x5d64ff['cleModel'][_0x1c5a78(0x1f5)][_0x1c5a78(0x207)][_0x1c5a78(0x21f)];for(let _0x30cddf=0x0;_0x30cddf<_0x5d64ff[_0x1c5a78(0x1ff)][_0x1c5a78(0x21f)];++_0x30cddf){const _0x1e6702=_0x5d64ff['cleObjectArray'][_0x30cddf];let _0x57767=0x0;for(let _0x129963=0x0;_0x129963<_0x5901d1;++_0x129963){if(_0x129963<_0x1e6702[_0x1c5a78(0x211)][_0x1c5a78(0x21f)]){const _0x141a82=_0x1e6702[_0x1c5a78(0x211)][_0x129963],_0x1e8ad0=_0x323fa7[_0x141a82];_0x57767=_0x1e8ad0['uPos'];}_0x1ad53f[_0x30cddf*_0x5901d1+_0x129963]=_0x57767;}}Texture2D[_0x1c5a78(0x217)](_0x5d64ff[_0x1c5a78(0x20d)][_0x1c5a78(0x21e)]);}