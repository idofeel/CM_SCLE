'use strict';const a74_0x3e15=['set','sqrt','eAxisY','635129fzEKHl','cos','normalize','3127JdQoCb','from','dot','isNearlyZero','1102504vMjDdT','cross','sin','asin','safeReciprocal','1fBkJOP','55bFaXOa','927697vqGIZu','mul','acos','16921iyMdMS','19XHJDNH','sub','negate','tan','make','eAxisX','24482XZphOC','175486mQlYBk'];(function(_0x229041,_0x3573cb){const _0x9a2c0f=a74_0x2b1c;while(!![]){try{const _0x3f7516=-parseInt(_0x9a2c0f(0x1e0))+parseInt(_0x9a2c0f(0x1f2))+-parseInt(_0x9a2c0f(0x1d8))*-parseInt(_0x9a2c0f(0x1f0))+-parseInt(_0x9a2c0f(0x1e4))+parseInt(_0x9a2c0f(0x1df))*-parseInt(_0x9a2c0f(0x1d9))+parseInt(_0x9a2c0f(0x1e7))*-parseInt(_0x9a2c0f(0x1f1))+parseInt(_0x9a2c0f(0x1eb));if(_0x3f7516===_0x3573cb)break;else _0x229041['push'](_0x229041['shift']());}catch(_0x1502d2){_0x229041['push'](_0x229041['shift']());}}}(a74_0x3e15,0x92544));import*as a74_0x30b3a3 from'./float2.js';import*as a74_0x18ff9a from'./float3.js';import*as a74_0x5060b0 from'./float4.js';import*as a74_0x22da3e from'./math.js';import{reciprocal}from'./float2.js';export function make(){let _0x2ebec3=new Float32Array(0x10);{_0x2ebec3[0x0]=0x1,_0x2ebec3[0x5]=0x1,_0x2ebec3[0xa]=0x1,_0x2ebec3[0xf]=0x1;}return _0x2ebec3;}export function copy(_0x2ab106){let _0x107c8d=make();{_0x107c8d[0x0]=_0x2ab106[0x0],_0x107c8d[0x1]=_0x2ab106[0x1],_0x107c8d[0x2]=_0x2ab106[0x2],_0x107c8d[0x3]=_0x2ab106[0x3],_0x107c8d[0x4]=_0x2ab106[0x4],_0x107c8d[0x5]=_0x2ab106[0x5],_0x107c8d[0x6]=_0x2ab106[0x6],_0x107c8d[0x7]=_0x2ab106[0x7],_0x107c8d[0x8]=_0x2ab106[0x8],_0x107c8d[0x9]=_0x2ab106[0x9],_0x107c8d[0xa]=_0x2ab106[0xa],_0x107c8d[0xb]=_0x2ab106[0xb],_0x107c8d[0xc]=_0x2ab106[0xc],_0x107c8d[0xd]=_0x2ab106[0xd],_0x107c8d[0xe]=_0x2ab106[0xe],_0x107c8d[0xf]=_0x2ab106[0xf];}return _0x107c8d;}export function fromArray(_0x190c29){let _0x425c43=make();{_0x425c43[0x0]=_0x190c29[0x0],_0x425c43[0x1]=_0x190c29[0x1],_0x425c43[0x2]=_0x190c29[0x2],_0x425c43[0x3]=_0x190c29[0x3],_0x425c43[0x4]=_0x190c29[0x4],_0x425c43[0x5]=_0x190c29[0x5],_0x425c43[0x6]=_0x190c29[0x6],_0x425c43[0x7]=_0x190c29[0x7],_0x425c43[0x8]=_0x190c29[0x8],_0x425c43[0x9]=_0x190c29[0x9],_0x425c43[0xa]=_0x190c29[0xa],_0x425c43[0xb]=_0x190c29[0xb],_0x425c43[0xc]=_0x190c29[0xc],_0x425c43[0xd]=_0x190c29[0xd],_0x425c43[0xe]=_0x190c29[0xe],_0x425c43[0xf]=_0x190c29[0xf];}return _0x425c43;}export function toArray(_0x1198af,_0x4f9395,_0xc8dc3e){_0x4f9395[_0xc8dc3e+0x0]=_0x1198af[0x0],_0x4f9395[_0xc8dc3e+0x1]=_0x1198af[0x1],_0x4f9395[_0xc8dc3e+0x2]=_0x1198af[0x2],_0x4f9395[_0xc8dc3e+0x3]=_0x1198af[0x3],_0x4f9395[_0xc8dc3e+0x4]=_0x1198af[0x4],_0x4f9395[_0xc8dc3e+0x5]=_0x1198af[0x5],_0x4f9395[_0xc8dc3e+0x6]=_0x1198af[0x6],_0x4f9395[_0xc8dc3e+0x7]=_0x1198af[0x7],_0x4f9395[_0xc8dc3e+0x8]=_0x1198af[0x8],_0x4f9395[_0xc8dc3e+0x9]=_0x1198af[0x9],_0x4f9395[_0xc8dc3e+0xa]=_0x1198af[0xa],_0x4f9395[_0xc8dc3e+0xb]=_0x1198af[0xb],_0x4f9395[_0xc8dc3e+0xc]=_0x1198af[0xc],_0x4f9395[_0xc8dc3e+0xd]=_0x1198af[0xd],_0x4f9395[_0xc8dc3e+0xe]=_0x1198af[0xe],_0x4f9395[_0xc8dc3e+0xf]=_0x1198af[0xf];}export function toTextureFloatArray(_0x26a18e,_0x406d69,_0x46020d){_0x406d69[_0x46020d+0x0]=_0x26a18e[0x0],_0x406d69[_0x46020d+0x1]=_0x26a18e[0x4],_0x406d69[_0x46020d+0x2]=_0x26a18e[0x8],_0x406d69[_0x46020d+0x3]=_0x26a18e[0xc],_0x406d69[_0x46020d+0x4]=_0x26a18e[0x1],_0x406d69[_0x46020d+0x5]=_0x26a18e[0x5],_0x406d69[_0x46020d+0x6]=_0x26a18e[0x9],_0x406d69[_0x46020d+0x7]=_0x26a18e[0xd],_0x406d69[_0x46020d+0x8]=_0x26a18e[0x2],_0x406d69[_0x46020d+0x9]=_0x26a18e[0x6],_0x406d69[_0x46020d+0xa]=_0x26a18e[0xa],_0x406d69[_0x46020d+0xb]=_0x26a18e[0xe];}export function toFloat32Array(_0x37c69b,_0x487f9f,_0x1abb27){const _0x414dec=a74_0x2b1c;_0x487f9f[_0x414dec(0x1e1)](_0x37c69b,_0x1abb27);}export function assign(_0x64d5f7,_0x54d4e6){return _0x64d5f7[0x0]=_0x54d4e6[0x0],_0x64d5f7[0x1]=_0x54d4e6[0x1],_0x64d5f7[0x2]=_0x54d4e6[0x2],_0x64d5f7[0x3]=_0x54d4e6[0x3],_0x64d5f7[0x4]=_0x54d4e6[0x4],_0x64d5f7[0x5]=_0x54d4e6[0x5],_0x64d5f7[0x6]=_0x54d4e6[0x6],_0x64d5f7[0x7]=_0x54d4e6[0x7],_0x64d5f7[0x8]=_0x54d4e6[0x8],_0x64d5f7[0x9]=_0x54d4e6[0x9],_0x64d5f7[0xa]=_0x54d4e6[0xa],_0x64d5f7[0xb]=_0x54d4e6[0xb],_0x64d5f7[0xc]=_0x54d4e6[0xc],_0x64d5f7[0xd]=_0x54d4e6[0xd],_0x64d5f7[0xe]=_0x54d4e6[0xe],_0x64d5f7[0xf]=_0x54d4e6[0xf],_0x64d5f7;}function a74_0x2b1c(_0x1900bd,_0x435bdd){_0x1900bd=_0x1900bd-0x1d8;let _0x3e15b1=a74_0x3e15[_0x1900bd];return _0x3e15b1;}export function identity(_0x487e9b){return _0x487e9b[0x0]=0x1,_0x487e9b[0x1]=0x0,_0x487e9b[0x2]=0x0,_0x487e9b[0x3]=0x0,_0x487e9b[0x4]=0x0,_0x487e9b[0x5]=0x1,_0x487e9b[0x6]=0x0,_0x487e9b[0x7]=0x0,_0x487e9b[0x8]=0x0,_0x487e9b[0x9]=0x0,_0x487e9b[0xa]=0x1,_0x487e9b[0xb]=0x0,_0x487e9b[0xc]=0x0,_0x487e9b[0xd]=0x0,_0x487e9b[0xe]=0x0,_0x487e9b[0xf]=0x1,_0x487e9b;}export function isIdentity(_0x53f8df){return _0x53f8df[0x0]===0x1&&_0x53f8df[0x1]===0x0&&_0x53f8df[0x2]===0x0&&_0x53f8df[0x3]===0x0&&_0x53f8df[0x4]===0x0&&_0x53f8df[0x5]===0x1&&_0x53f8df[0x6]===0x0&&_0x53f8df[0x7]===0x0&&_0x53f8df[0x8]===0x0&&_0x53f8df[0x9]===0x0&&_0x53f8df[0xa]===0x1&&_0x53f8df[0xb]===0x0&&_0x53f8df[0xc]===0x0&&_0x53f8df[0xd]===0x0&&_0x53f8df[0xe]===0x0&&_0x53f8df[0xf]===0x1;}export function isMirrored(_0x5038d9){const _0x26bcd1=a74_0x2b1c;let _0x542ed0=a74_0x18ff9a[_0x26bcd1(0x1e8)](_0x5038d9[0x0],_0x5038d9[0x1],_0x5038d9[0x2]),_0x4bb0c1=a74_0x18ff9a[_0x26bcd1(0x1e8)](_0x5038d9[0x4],_0x5038d9[0x5],_0x5038d9[0x6]),_0x26674a=a74_0x18ff9a[_0x26bcd1(0x1e8)](_0x5038d9[0x8],_0x5038d9[0x8],_0x5038d9[0xa]);return a74_0x18ff9a[_0x26bcd1(0x1ec)](_0x542ed0,_0x542ed0,_0x26674a),a74_0x18ff9a['dot'](_0x542ed0,_0x4bb0c1)>0x0;}export function determinant(_0x5c52d2){let _0x35610d=_0x5c52d2[0x0],_0x508b87=_0x5c52d2[0x1],_0x5b33cd=_0x5c52d2[0x2],_0x1ac8bc=_0x5c52d2[0x3],_0x3bfec7=_0x5c52d2[0x4],_0x371b9a=_0x5c52d2[0x5],_0x494a48=_0x5c52d2[0x6],_0x217e7e=_0x5c52d2[0x7],_0x135224=_0x5c52d2[0x8],_0x75011b=_0x5c52d2[0x9],_0x32c238=_0x5c52d2[0xa],_0x542faa=_0x5c52d2[0xb],_0x11b41b=_0x5c52d2[0xc],_0x33c40e=_0x5c52d2[0xd],_0x56bce6=_0x5c52d2[0xe],_0x1a521f=_0x5c52d2[0xf],_0x52ca5f=_0x35610d*_0x371b9a-_0x508b87*_0x3bfec7,_0x2148a2=_0x35610d*_0x494a48-_0x5b33cd*_0x3bfec7,_0x171d87=_0x508b87*_0x494a48-_0x5b33cd*_0x371b9a,_0x32f9e8=_0x135224*_0x33c40e-_0x75011b*_0x11b41b,_0x548477=_0x135224*_0x56bce6-_0x32c238*_0x11b41b,_0x35d780=_0x75011b*_0x56bce6-_0x32c238*_0x33c40e,_0x303563=_0x35610d*_0x35d780-_0x508b87*_0x548477+_0x5b33cd*_0x32f9e8,_0x5cf252=_0x3bfec7*_0x35d780-_0x371b9a*_0x548477+_0x494a48*_0x32f9e8,_0x2dd609=_0x135224*_0x171d87-_0x75011b*_0x2148a2+_0x32c238*_0x52ca5f,_0x3364cb=_0x11b41b*_0x171d87-_0x33c40e*_0x2148a2+_0x56bce6*_0x52ca5f;return _0x217e7e*_0x303563-_0x1ac8bc*_0x5cf252+_0x1a521f*_0x2dd609-_0x542faa*_0x3364cb;}export function yaw(_0x4d2fb0){return Math['atan2'](_0x4d2fb0[0x8],_0x4d2fb0[0xa]);}export function pitch(_0x34b95a){const _0x449908=a74_0x2b1c;return-Math[_0x449908(0x1ee)](_0x34b95a[0x9]);}export function roll(_0x210345){const _0x2185ee=a74_0x2b1c,_0x5547e6=Math[_0x2185ee(0x1e2)](_0x210345[0xa]*_0x210345[0xa]+_0x210345[0x8]*_0x210345[0x8]);if(a74_0x22da3e[_0x2185ee(0x1ea)](_0x5547e6,0.000001))return 0x0;const _0x3f10bd=(_0x210345[0xa]*_0x210345[0x0]-_0x210345[0x8]*_0x210345[0x2])/_0x5547e6,_0x1ab723=Math[_0x2185ee(0x1f4)](_0x3f10bd);return _0x210345[0x1]<0x0?-_0x1ab723:_0x1ab723;}export function transpose(_0x4f3a44,_0x5ce343){_0x4f3a44=_0x4f3a44||make();if(_0x4f3a44===_0x5ce343){let _0x5115a2=_0x5ce343[0x1],_0x3e7a51=_0x5ce343[0x2],_0x106abe=_0x5ce343[0x3],_0x507a10=_0x5ce343[0x6],_0x5c5840=_0x5ce343[0x7],_0x296c9d=_0x5ce343[0xb];_0x4f3a44[0x1]=_0x5ce343[0x4],_0x4f3a44[0x2]=_0x5ce343[0x8],_0x4f3a44[0x3]=_0x5ce343[0xc],_0x4f3a44[0x4]=_0x5115a2,_0x4f3a44[0x6]=_0x5ce343[0x9],_0x4f3a44[0x7]=_0x5ce343[0xd],_0x4f3a44[0x8]=_0x3e7a51,_0x4f3a44[0x9]=_0x507a10,_0x4f3a44[0xb]=_0x5ce343[0xe],_0x4f3a44[0xc]=_0x106abe,_0x4f3a44[0xd]=_0x5c5840,_0x4f3a44[0xe]=_0x296c9d;}else _0x4f3a44[0x0]=_0x5ce343[0x0],_0x4f3a44[0x1]=_0x5ce343[0x4],_0x4f3a44[0x2]=_0x5ce343[0x8],_0x4f3a44[0x3]=_0x5ce343[0xc],_0x4f3a44[0x4]=_0x5ce343[0x1],_0x4f3a44[0x5]=_0x5ce343[0x5],_0x4f3a44[0x6]=_0x5ce343[0x9],_0x4f3a44[0x7]=_0x5ce343[0xd],_0x4f3a44[0x8]=_0x5ce343[0x2],_0x4f3a44[0x9]=_0x5ce343[0x6],_0x4f3a44[0xa]=_0x5ce343[0xa],_0x4f3a44[0xb]=_0x5ce343[0xe],_0x4f3a44[0xc]=_0x5ce343[0x3],_0x4f3a44[0xd]=_0x5ce343[0x7],_0x4f3a44[0xe]=_0x5ce343[0xb],_0x4f3a44[0xf]=_0x5ce343[0xf];return _0x4f3a44;}export function inverse(_0x43642c,_0x1369aa){const _0x133b0b=a74_0x2b1c;_0x43642c=_0x43642c||make();let _0x506bcf=_0x1369aa[0x0],_0x21d8a6=_0x1369aa[0x1],_0x542850=_0x1369aa[0x2],_0x37f514=_0x1369aa[0x3],_0x575e14=_0x1369aa[0x4],_0x2b5a2c=_0x1369aa[0x5],_0x342efa=_0x1369aa[0x6],_0x5565d7=_0x1369aa[0x7],_0x2a25c3=_0x1369aa[0x8],_0x5a4b44=_0x1369aa[0x9],_0x423723=_0x1369aa[0xa],_0x1dc796=_0x1369aa[0xb],_0x571ac0=_0x1369aa[0xc],_0x356d3e=_0x1369aa[0xd],_0xc1b61d=_0x1369aa[0xe],_0x5b804b=_0x1369aa[0xf],_0x43359e=_0x506bcf*_0x2b5a2c-_0x21d8a6*_0x575e14,_0x278cc2=_0x506bcf*_0x342efa-_0x542850*_0x575e14,_0x273dd4=_0x506bcf*_0x5565d7-_0x37f514*_0x575e14,_0x54c27d=_0x21d8a6*_0x342efa-_0x542850*_0x2b5a2c,_0x2a5566=_0x21d8a6*_0x5565d7-_0x37f514*_0x2b5a2c,_0x18515e=_0x542850*_0x5565d7-_0x37f514*_0x342efa,_0x4b61c4=_0x2a25c3*_0x356d3e-_0x5a4b44*_0x571ac0,_0x32496a=_0x2a25c3*_0xc1b61d-_0x423723*_0x571ac0,_0x4fd030=_0x2a25c3*_0x5b804b-_0x1dc796*_0x571ac0,_0x37c1d3=_0x5a4b44*_0xc1b61d-_0x423723*_0x356d3e,_0x45d6e2=_0x5a4b44*_0x5b804b-_0x1dc796*_0x356d3e,_0x38bb46=_0x423723*_0x5b804b-_0x1dc796*_0xc1b61d,_0x1fc750;{_0x1fc750=_0x43359e*_0x38bb46-_0x278cc2*_0x45d6e2+_0x273dd4*_0x37c1d3+_0x54c27d*_0x4fd030-_0x2a5566*_0x32496a+_0x18515e*_0x4b61c4,_0x1fc750=a74_0x22da3e[_0x133b0b(0x1ef)](_0x1fc750);}return _0x43642c[0x0]=(_0x2b5a2c*_0x38bb46-_0x342efa*_0x45d6e2+_0x5565d7*_0x37c1d3)*_0x1fc750,_0x43642c[0x1]=(_0x542850*_0x45d6e2-_0x21d8a6*_0x38bb46-_0x37f514*_0x37c1d3)*_0x1fc750,_0x43642c[0x2]=(_0x356d3e*_0x18515e-_0xc1b61d*_0x2a5566+_0x5b804b*_0x54c27d)*_0x1fc750,_0x43642c[0x3]=(_0x423723*_0x2a5566-_0x5a4b44*_0x18515e-_0x1dc796*_0x54c27d)*_0x1fc750,_0x43642c[0x4]=(_0x342efa*_0x4fd030-_0x575e14*_0x38bb46-_0x5565d7*_0x32496a)*_0x1fc750,_0x43642c[0x5]=(_0x506bcf*_0x38bb46-_0x542850*_0x4fd030+_0x37f514*_0x32496a)*_0x1fc750,_0x43642c[0x6]=(_0xc1b61d*_0x273dd4-_0x571ac0*_0x18515e-_0x5b804b*_0x278cc2)*_0x1fc750,_0x43642c[0x7]=(_0x2a25c3*_0x18515e-_0x423723*_0x273dd4+_0x1dc796*_0x278cc2)*_0x1fc750,_0x43642c[0x8]=(_0x575e14*_0x45d6e2-_0x2b5a2c*_0x4fd030+_0x5565d7*_0x4b61c4)*_0x1fc750,_0x43642c[0x9]=(_0x21d8a6*_0x4fd030-_0x506bcf*_0x45d6e2-_0x37f514*_0x4b61c4)*_0x1fc750,_0x43642c[0xa]=(_0x571ac0*_0x2a5566-_0x356d3e*_0x273dd4+_0x5b804b*_0x43359e)*_0x1fc750,_0x43642c[0xb]=(_0x5a4b44*_0x273dd4-_0x2a25c3*_0x2a5566-_0x1dc796*_0x43359e)*_0x1fc750,_0x43642c[0xc]=(_0x2b5a2c*_0x32496a-_0x575e14*_0x37c1d3-_0x342efa*_0x4b61c4)*_0x1fc750,_0x43642c[0xd]=(_0x506bcf*_0x37c1d3-_0x21d8a6*_0x32496a+_0x542850*_0x4b61c4)*_0x1fc750,_0x43642c[0xe]=(_0x356d3e*_0x278cc2-_0x571ac0*_0x54c27d-_0xc1b61d*_0x43359e)*_0x1fc750,_0x43642c[0xf]=(_0x2a25c3*_0x54c27d-_0x5a4b44*_0x278cc2+_0x423723*_0x43359e)*_0x1fc750,_0x43642c;}export function inverseTranspose(_0x690d9e,_0x5c957b){return transpose(_0x690d9e,inverse(_0x690d9e,_0x5c957b));}export function mul(_0x1d75c0,_0x2d4efe,_0x2c6625){_0x1d75c0=_0x1d75c0||make();let _0x5226dd=_0x2c6625[0x0],_0x2997fa=_0x2c6625[0x1],_0x58d0f0=_0x2c6625[0x2],_0x19dafc=_0x2c6625[0x3],_0x3dbcfe=_0x2c6625[0x4],_0x41bb9b=_0x2c6625[0x5],_0x53a8b8=_0x2c6625[0x6],_0x20bffa=_0x2c6625[0x7],_0x5e5bf4=_0x2c6625[0x8],_0x260bdb=_0x2c6625[0x9],_0x3694a8=_0x2c6625[0xa],_0x5ca295=_0x2c6625[0xb],_0xf9d2b0=_0x2c6625[0xc],_0x5cce9e=_0x2c6625[0xd],_0x20f964=_0x2c6625[0xe],_0x201214=_0x2c6625[0xf],_0x3e2cb6=_0x2d4efe[0x0],_0x140e18=_0x2d4efe[0x1],_0x2a0665=_0x2d4efe[0x2],_0x597628=_0x2d4efe[0x3];return _0x1d75c0[0x0]=_0x3e2cb6*_0x5226dd+_0x140e18*_0x3dbcfe+_0x2a0665*_0x5e5bf4+_0x597628*_0xf9d2b0,_0x1d75c0[0x1]=_0x3e2cb6*_0x2997fa+_0x140e18*_0x41bb9b+_0x2a0665*_0x260bdb+_0x597628*_0x5cce9e,_0x1d75c0[0x2]=_0x3e2cb6*_0x58d0f0+_0x140e18*_0x53a8b8+_0x2a0665*_0x3694a8+_0x597628*_0x20f964,_0x1d75c0[0x3]=_0x3e2cb6*_0x19dafc+_0x140e18*_0x20bffa+_0x2a0665*_0x5ca295+_0x597628*_0x201214,_0x3e2cb6=_0x2d4efe[0x4],_0x140e18=_0x2d4efe[0x5],_0x2a0665=_0x2d4efe[0x6],_0x597628=_0x2d4efe[0x7],_0x1d75c0[0x4]=_0x3e2cb6*_0x5226dd+_0x140e18*_0x3dbcfe+_0x2a0665*_0x5e5bf4+_0x597628*_0xf9d2b0,_0x1d75c0[0x5]=_0x3e2cb6*_0x2997fa+_0x140e18*_0x41bb9b+_0x2a0665*_0x260bdb+_0x597628*_0x5cce9e,_0x1d75c0[0x6]=_0x3e2cb6*_0x58d0f0+_0x140e18*_0x53a8b8+_0x2a0665*_0x3694a8+_0x597628*_0x20f964,_0x1d75c0[0x7]=_0x3e2cb6*_0x19dafc+_0x140e18*_0x20bffa+_0x2a0665*_0x5ca295+_0x597628*_0x201214,_0x3e2cb6=_0x2d4efe[0x8],_0x140e18=_0x2d4efe[0x9],_0x2a0665=_0x2d4efe[0xa],_0x597628=_0x2d4efe[0xb],_0x1d75c0[0x8]=_0x3e2cb6*_0x5226dd+_0x140e18*_0x3dbcfe+_0x2a0665*_0x5e5bf4+_0x597628*_0xf9d2b0,_0x1d75c0[0x9]=_0x3e2cb6*_0x2997fa+_0x140e18*_0x41bb9b+_0x2a0665*_0x260bdb+_0x597628*_0x5cce9e,_0x1d75c0[0xa]=_0x3e2cb6*_0x58d0f0+_0x140e18*_0x53a8b8+_0x2a0665*_0x3694a8+_0x597628*_0x20f964,_0x1d75c0[0xb]=_0x3e2cb6*_0x19dafc+_0x140e18*_0x20bffa+_0x2a0665*_0x5ca295+_0x597628*_0x201214,_0x3e2cb6=_0x2d4efe[0xc],_0x140e18=_0x2d4efe[0xd],_0x2a0665=_0x2d4efe[0xe],_0x597628=_0x2d4efe[0xf],_0x1d75c0[0xc]=_0x3e2cb6*_0x5226dd+_0x140e18*_0x3dbcfe+_0x2a0665*_0x5e5bf4+_0x597628*_0xf9d2b0,_0x1d75c0[0xd]=_0x3e2cb6*_0x2997fa+_0x140e18*_0x41bb9b+_0x2a0665*_0x260bdb+_0x597628*_0x5cce9e,_0x1d75c0[0xe]=_0x3e2cb6*_0x58d0f0+_0x140e18*_0x53a8b8+_0x2a0665*_0x3694a8+_0x597628*_0x20f964,_0x1d75c0[0xf]=_0x3e2cb6*_0x19dafc+_0x140e18*_0x20bffa+_0x2a0665*_0x5ca295+_0x597628*_0x201214,_0x1d75c0;}export function lookAt(_0x592b17,_0x27e0a9,_0x2745c7,_0x9f3585){const _0x295133=a74_0x2b1c;_0x592b17=_0x592b17||make();let _0x13d643;{_0x13d643=a74_0x18ff9a[_0x295133(0x1da)](_0x13d643,_0x27e0a9,_0x2745c7),_0x13d643=a74_0x18ff9a['normalize'](_0x13d643,_0x13d643);}let _0x316fc9;{_0x316fc9=a74_0x18ff9a['cross'](_0x316fc9,_0x9f3585,_0x13d643),_0x316fc9=a74_0x18ff9a[_0x295133(0x1e6)](_0x316fc9,_0x316fc9);}let _0x58d2d8=a74_0x18ff9a[_0x295133(0x1ec)](null,_0x13d643,_0x316fc9),_0x32538b=a74_0x18ff9a[_0x295133(0x1db)](null,_0x27e0a9),_0x18ec92=a74_0x18ff9a['dot'](_0x316fc9,_0x32538b),_0x4d853d=a74_0x18ff9a['dot'](_0x58d2d8,_0x32538b),_0x52bf45=a74_0x18ff9a[_0x295133(0x1e9)](_0x13d643,_0x32538b);return _0x592b17[0x0]=_0x316fc9[0x0],_0x592b17[0x4]=_0x316fc9[0x1],_0x592b17[0x8]=_0x316fc9[0x2],_0x592b17[0xc]=_0x18ec92,_0x592b17[0x1]=_0x58d2d8[0x0],_0x592b17[0x5]=_0x58d2d8[0x1],_0x592b17[0x9]=_0x58d2d8[0x2],_0x592b17[0xd]=_0x4d853d,_0x592b17[0x2]=_0x13d643[0x0],_0x592b17[0x6]=_0x13d643[0x1],_0x592b17[0xa]=_0x13d643[0x2],_0x592b17[0xe]=_0x52bf45,_0x592b17[0x3]=0x0,_0x592b17[0x7]=0x0,_0x592b17[0xb]=0x0,_0x592b17[0xf]=0x1,_0x592b17;}export function projOrtho(_0x3425c3,_0x3a38e8,_0x4163ee,_0x20b782,_0x45a527){const _0xc534aa=a74_0x2b1c;_0x3425c3=_0x3425c3||make();let _0x315f27=a74_0x22da3e[_0xc534aa(0x1ef)](_0x20b782-_0x45a527);return _0x3425c3[0x0]=0x2*a74_0x22da3e[_0xc534aa(0x1ef)](_0x3a38e8),_0x3425c3[0x1]=0x0,_0x3425c3[0x2]=0x0,_0x3425c3[0x3]=0x0,_0x3425c3[0x4]=0x0,_0x3425c3[0x5]=0x2*a74_0x22da3e[_0xc534aa(0x1ef)](_0x4163ee),_0x3425c3[0x6]=0x0,_0x3425c3[0x7]=0x0,_0x3425c3[0x8]=0x0,_0x3425c3[0x9]=0x0,_0x3425c3[0xa]=0x2*_0x315f27,_0x3425c3[0xb]=0x0,_0x3425c3[0xc]=0x0,_0x3425c3[0xd]=0x0,_0x3425c3[0xe]=(_0x20b782+_0x45a527)*_0x315f27,_0x3425c3[0xf]=0x1,_0x3425c3;}export function projOrthoOffCenter(_0xa58085,_0x2846f3,_0xa7e10b,_0x379250,_0x4afa3c,_0x540225,_0x1bc939){const _0x11836f=a74_0x2b1c;_0xa58085=_0xa58085||make();let _0x59828e=a74_0x22da3e[_0x11836f(0x1ef)](_0xa7e10b-_0x2846f3),_0x4bea14=a74_0x22da3e[_0x11836f(0x1ef)](_0x4afa3c-_0x379250),_0x269106=a74_0x22da3e['safeReciprocal'](_0x540225-_0x1bc939);return _0xa58085[0x0]=_0x59828e+_0x59828e,_0xa58085[0x1]=0x0,_0xa58085[0x2]=0x0,_0xa58085[0x3]=0x0,_0xa58085[0x4]=0x0,_0xa58085[0x5]=_0x4bea14+_0x4bea14,_0xa58085[0x6]=0x0,_0xa58085[0x7]=0x0,_0xa58085[0x8]=0x0,_0xa58085[0x9]=0x0,_0xa58085[0xa]=0x2*_0x269106,_0xa58085[0xb]=0x0,_0xa58085[0xc]=-(_0x2846f3+_0xa7e10b)*_0x59828e,_0xa58085[0xd]=-(_0x4afa3c+_0x379250)*_0x4bea14,_0xa58085[0xe]=(_0x540225+_0x1bc939)*_0x269106,_0xa58085[0xf]=0x1,_0xa58085;}export function projPerspective(_0x50172a,_0x52ad1a,_0x78ed31,_0x5e959d,_0x6ecdef){const _0x306b4a=a74_0x2b1c;_0x50172a=_0x50172a||make();let _0x5ffee=a74_0x22da3e[_0x306b4a(0x1ef)](Math[_0x306b4a(0x1dc)](_0x52ad1a*0.5)),_0x4086fd=_0x5ffee*a74_0x22da3e['safeReciprocal'](_0x78ed31),_0x53f136=a74_0x22da3e[_0x306b4a(0x1ef)](_0x5e959d-_0x6ecdef);return _0x50172a[0x0]=_0x4086fd,_0x50172a[0x1]=0x0,_0x50172a[0x2]=0x0,_0x50172a[0x3]=0x0,_0x50172a[0x4]=0x0,_0x50172a[0x5]=_0x5ffee,_0x50172a[0x6]=0x0,_0x50172a[0x7]=0x0,_0x50172a[0x8]=0x0,_0x50172a[0x9]=0x0,_0x50172a[0xa]=(_0x5e959d+_0x6ecdef)*_0x53f136,_0x50172a[0xb]=-0x1,_0x50172a[0xc]=0x0,_0x50172a[0xd]=0x0,_0x50172a[0xe]=0x2*_0x6ecdef*_0x5e959d*_0x53f136,_0x50172a[0xf]=0x0,_0x50172a;}export function rotateQuaternion(_0x408144,_0x345361){_0x408144=_0x408144||make();let _0x4e4e23=_0x345361[0x0],_0x16faa6=_0x345361[0x1],_0x55a403=_0x345361[0x2],_0x1231e1=_0x345361[0x3],_0x2377bc=_0x4e4e23+_0x4e4e23,_0x46effc=_0x16faa6+_0x16faa6,_0x1ed9f4=_0x55a403+_0x55a403,_0x4680b7=_0x1231e1+_0x1231e1,_0x22facc=_0x4e4e23*_0x2377bc,_0x464313=_0x16faa6*_0x46effc,_0x129843=_0x55a403*_0x1ed9f4,_0x4ad511=_0x1231e1*_0x4680b7,_0x5dc149=_0x464313,_0x5ad1fe=_0x22facc,_0xac244=_0x22facc,_0x2c5507=0x0,_0x4019d0=_0x129843,_0x2d4362=_0x129843,_0x136f05=_0x464313,_0x1e100a=0x0,_0x1bd570=0x1-_0x5dc149-_0x4019d0,_0x4b159c=0x1-_0x5ad1fe-_0x2d4362,_0x7af440=0x1-_0xac244-_0x136f05,_0x44e7b7=0x0-_0x2c5507-_0x1e100a;_0x5dc149=_0x4e4e23,_0x5ad1fe=_0x4e4e23,_0xac244=_0x16faa6,_0x2c5507=_0x1231e1,_0x4019d0=_0x1ed9f4,_0x2d4362=_0x46effc,_0x136f05=_0x1ed9f4,_0x1e100a=_0x4680b7,_0x5dc149*=_0x4019d0,_0x5ad1fe*=_0x2d4362,_0xac244*=_0x136f05,_0x2c5507*=_0x1e100a,_0x4019d0=_0x1231e1,_0x2d4362=_0x1231e1,_0x136f05=_0x1231e1,_0x1e100a=_0x1231e1;let _0x22a14d=_0x46effc,_0x921424=_0x1ed9f4,_0x377ee2=_0x2377bc,_0x499a0b=_0x4680b7;_0x4019d0*=_0x22a14d,_0x2d4362*=_0x921424,_0x136f05*=_0x377ee2,_0x1e100a*=_0x499a0b;let _0x3130ac=_0x5dc149+_0x4019d0,_0x1c4fb6=_0x5ad1fe+_0x2d4362,_0x49bd99=_0xac244+_0x136f05,_0x36c8ec=_0x2c5507+_0x1e100a,_0x48584e=_0x5dc149-_0x4019d0,_0x34ca36=_0x5ad1fe-_0x2d4362,_0x228de5=_0xac244-_0x136f05,_0x5693a5=_0x2c5507-_0x1e100a;return _0x5dc149=_0x1c4fb6,_0x5ad1fe=_0x48584e,_0xac244=_0x34ca36,_0x2c5507=_0x49bd99,_0x4019d0=_0x3130ac,_0x2d4362=_0x228de5,_0x136f05=_0x3130ac,_0x1e100a=_0x228de5,_0x408144[0x0]=_0x1bd570,_0x408144[0x1]=_0x5dc149,_0x408144[0x2]=_0x5ad1fe,_0x408144[0x3]=_0x44e7b7,_0x408144[0x4]=_0xac244,_0x408144[0x5]=_0x4b159c,_0x408144[0x6]=_0x2c5507,_0x408144[0x7]=_0x44e7b7,_0x408144[0x8]=_0x4019d0,_0x408144[0x9]=_0x2d4362,_0x408144[0xa]=_0x7af440,_0x408144[0xb]=_0x44e7b7,_0x408144[0xc]=0x0,_0x408144[0xd]=0x0,_0x408144[0xe]=0x0,_0x408144[0xf]=0x1,_0x408144;}export function scaling(_0x15c9a6,_0x19ab6b){return _0x15c9a6=_0x15c9a6||make(),_0x15c9a6[0x0]=_0x19ab6b[0x0],_0x15c9a6[0x1]=0x0,_0x15c9a6[0x2]=0x0,_0x15c9a6[0x3]=0x0,_0x15c9a6[0x4]=0x0,_0x15c9a6[0x5]=_0x19ab6b[0x1],_0x15c9a6[0x6]=0x0,_0x15c9a6[0x7]=0x0,_0x15c9a6[0x8]=0x0,_0x15c9a6[0x9]=0x0,_0x15c9a6[0xa]=_0x19ab6b[0x2],_0x15c9a6[0xb]=0x0,_0x15c9a6[0xc]=0x0,_0x15c9a6[0xd]=0x0,_0x15c9a6[0xe]=0x0,_0x15c9a6[0xf]=0x1,_0x15c9a6;}export function scalingUniform(_0x5655dc,_0x5919eb){return _0x5655dc=_0x5655dc||make(),_0x5655dc[0x0]=_0x5919eb,_0x5655dc[0x1]=0x0,_0x5655dc[0x2]=0x0,_0x5655dc[0x3]=0x0,_0x5655dc[0x4]=0x0,_0x5655dc[0x5]=_0x5919eb,_0x5655dc[0x6]=0x0,_0x5655dc[0x7]=0x0,_0x5655dc[0x8]=0x0,_0x5655dc[0x9]=0x0,_0x5655dc[0xa]=_0x5919eb,_0x5655dc[0xb]=0x0,_0x5655dc[0xc]=0x0,_0x5655dc[0xd]=0x0,_0x5655dc[0xe]=0x0,_0x5655dc[0xf]=0x1,_0x5655dc;}export function scalingXYZ(_0x43e66d,_0x4e097e,_0x86980c,_0x520e5c){return _0x43e66d=_0x43e66d||make(),_0x43e66d[0x0]=_0x4e097e,_0x43e66d[0x1]=0x0,_0x43e66d[0x2]=0x0,_0x43e66d[0x3]=0x0,_0x43e66d[0x4]=0x0,_0x43e66d[0x5]=_0x86980c,_0x43e66d[0x6]=0x0,_0x43e66d[0x7]=0x0,_0x43e66d[0x8]=0x0,_0x43e66d[0x9]=0x0,_0x43e66d[0xa]=_0x520e5c,_0x43e66d[0xb]=0x0,_0x43e66d[0xc]=0x0,_0x43e66d[0xd]=0x0,_0x43e66d[0xe]=0x0,_0x43e66d[0xf]=0x1,_0x43e66d;}export function translation(_0x1a5deb,_0x376b71){return _0x1a5deb=_0x1a5deb||make(),_0x1a5deb[0x0]=0x1,_0x1a5deb[0x1]=0x0,_0x1a5deb[0x2]=0x0,_0x1a5deb[0x3]=0x0,_0x1a5deb[0x4]=0x0,_0x1a5deb[0x5]=0x1,_0x1a5deb[0x6]=0x0,_0x1a5deb[0x7]=0x0,_0x1a5deb[0x8]=0x0,_0x1a5deb[0x9]=0x0,_0x1a5deb[0xa]=0x1,_0x1a5deb[0xb]=0x0,_0x1a5deb[0xc]=_0x376b71[0x0],_0x1a5deb[0xd]=_0x376b71[0x1],_0x1a5deb[0xe]=_0x376b71[0x2],_0x1a5deb[0xf]=0x1,_0x1a5deb;}export function translationUniform(_0x4b955a,_0x54b174){return _0x4b955a=_0x4b955a||make(),_0x4b955a[0x0]=0x1,_0x4b955a[0x1]=0x0,_0x4b955a[0x2]=0x0,_0x4b955a[0x3]=0x0,_0x4b955a[0x4]=0x0,_0x4b955a[0x5]=0x1,_0x4b955a[0x6]=0x0,_0x4b955a[0x7]=0x0,_0x4b955a[0x8]=0x0,_0x4b955a[0x9]=0x0,_0x4b955a[0xa]=0x1,_0x4b955a[0xb]=0x0,_0x4b955a[0xc]=_0x54b174,_0x4b955a[0xd]=_0x54b174,_0x4b955a[0xe]=_0x54b174,_0x4b955a[0xf]=0x1,_0x4b955a;}export function translationXYZ(_0x32859d,_0x2b0b4b,_0x587a52,_0x1052da){return _0x32859d=_0x32859d||make(),_0x32859d[0x0]=0x1,_0x32859d[0x1]=0x0,_0x32859d[0x2]=0x0,_0x32859d[0x3]=0x0,_0x32859d[0x4]=0x0,_0x32859d[0x5]=0x1,_0x32859d[0x6]=0x0,_0x32859d[0x7]=0x0,_0x32859d[0x8]=0x0,_0x32859d[0x9]=0x0,_0x32859d[0xa]=0x1,_0x32859d[0xb]=0x0,_0x32859d[0xc]=_0x2b0b4b,_0x32859d[0xd]=_0x587a52,_0x32859d[0xe]=_0x1052da,_0x32859d[0xf]=0x1,_0x32859d;}export function rotate(_0x878b6f,_0x2145cc,_0x574c51){const _0x336847=a74_0x2b1c;_0x878b6f=_0x878b6f||make();let _0x463928=a74_0x18ff9a[_0x336847(0x1e6)](null,_0x2145cc),_0x4f5d56=_0x463928[0x0],_0x4f98ba=_0x463928[0x1],_0x56c412=_0x463928[0x2],_0x568ae4=Math[_0x336847(0x1ed)](_0x574c51),_0x1ad2cb=Math[_0x336847(0x1e5)](_0x574c51),_0x38bf89=0x1-_0x1ad2cb;return _0x878b6f[0x0]=_0x1ad2cb+_0x4f5d56*_0x4f5d56*_0x38bf89,_0x878b6f[0x1]=_0x56c412*_0x568ae4+_0x4f98ba*_0x4f5d56*_0x38bf89,_0x878b6f[0x2]=-_0x4f98ba*_0x568ae4+_0x56c412*_0x4f5d56*_0x38bf89,_0x878b6f[0x3]=0x0,_0x878b6f[0x4]=-_0x56c412*_0x568ae4+_0x4f5d56*_0x4f98ba*_0x38bf89,_0x878b6f[0x5]=_0x1ad2cb+_0x4f98ba*_0x4f98ba*_0x38bf89,_0x878b6f[0x6]=_0x4f5d56*_0x568ae4+_0x56c412*_0x4f98ba*_0x38bf89,_0x878b6f[0x7]=0x0,_0x878b6f[0x8]=_0x4f98ba*_0x568ae4+_0x4f5d56*_0x56c412*_0x38bf89,_0x878b6f[0x9]=-_0x4f5d56*_0x568ae4+_0x4f98ba*_0x56c412*_0x38bf89,_0x878b6f[0xa]=_0x1ad2cb+_0x56c412*_0x56c412*_0x38bf89,_0x878b6f[0xb]=0x0,_0x878b6f[0xc]=0x0,_0x878b6f[0xd]=0x0,_0x878b6f[0xe]=0x0,_0x878b6f[0xf]=0x1,_0x878b6f;}export function rotateX(_0x17431c,_0x1a8cca){const _0x37fb13=a74_0x2b1c;_0x17431c=_0x17431c||make();let _0x3e8f03=Math['sin'](_0x1a8cca),_0x4423dd=Math[_0x37fb13(0x1e5)](_0x1a8cca);return _0x17431c[0x0]=0x1,_0x17431c[0x1]=0x0,_0x17431c[0x2]=0x0,_0x17431c[0x3]=0x0,_0x17431c[0x4]=0x0,_0x17431c[0x5]=_0x4423dd,_0x17431c[0x6]=_0x3e8f03,_0x17431c[0x7]=0x0,_0x17431c[0x8]=0x0,_0x17431c[0x9]=-_0x3e8f03,_0x17431c[0xa]=_0x4423dd,_0x17431c[0xb]=0x0,_0x17431c[0xc]=0x0,_0x17431c[0xd]=0x0,_0x17431c[0xe]=0x0,_0x17431c[0xf]=0x1,_0x17431c;}export function rotateY(_0x50504c,_0x1cc5b2){const _0x4a8995=a74_0x2b1c;_0x50504c=_0x50504c||make();let _0x48b937=Math[_0x4a8995(0x1ed)](_0x1cc5b2),_0x2cef14=Math[_0x4a8995(0x1e5)](_0x1cc5b2);return _0x50504c[0x0]=_0x2cef14,_0x50504c[0x1]=0x0,_0x50504c[0x2]=-_0x48b937,_0x50504c[0x3]=0x0,_0x50504c[0x4]=0x0,_0x50504c[0x5]=0x1,_0x50504c[0x6]=0x0,_0x50504c[0x7]=0x0,_0x50504c[0x8]=_0x48b937,_0x50504c[0x9]=0x0,_0x50504c[0xa]=_0x2cef14,_0x50504c[0xb]=0x0,_0x50504c[0xc]=0x0,_0x50504c[0xd]=0x0,_0x50504c[0xe]=0x0,_0x50504c[0xf]=0x1,_0x50504c;}export function rotateZ(_0x583326,_0x27c789){const _0x44166a=a74_0x2b1c;_0x583326=_0x583326||make();let _0x366edf=Math[_0x44166a(0x1ed)](_0x27c789),_0x31b42c=Math[_0x44166a(0x1e5)](_0x27c789);return _0x583326[0x0]=_0x31b42c,_0x583326[0x1]=_0x366edf,_0x583326[0x2]=0x0,_0x583326[0x3]=0x0,_0x583326[0x4]=-_0x366edf,_0x583326[0x5]=_0x31b42c,_0x583326[0x6]=0x0,_0x583326[0x7]=0x0,_0x583326[0x8]=0x0,_0x583326[0x9]=0x0,_0x583326[0xa]=0x1,_0x583326[0xb]=0x0,_0x583326[0xc]=0x0,_0x583326[0xd]=0x0,_0x583326[0xe]=0x0,_0x583326[0xf]=0x1,_0x583326;}export function transformUnitAxis(_0x151159,_0x126237,_0x1dd947){const _0x51eff4=a74_0x2b1c;_0x151159=_0x151159||a74_0x18ff9a['make']();if(_0x126237===a74_0x22da3e[_0x51eff4(0x1de)])_0x151159[0x0]=_0x1dd947[0x0],_0x151159[0x1]=_0x1dd947[0x1],_0x151159[0x2]=_0x1dd947[0x2];else _0x126237===a74_0x22da3e[_0x51eff4(0x1e3)]?(_0x151159[0x0]=_0x1dd947[0x4],_0x151159[0x1]=_0x1dd947[0x5],_0x151159[0x2]=_0x1dd947[0x6]):(_0x151159[0x0]=_0x1dd947[0x8],_0x151159[0x1]=_0x1dd947[0x9],_0x151159[0x2]=_0x1dd947[0xa]);return _0x151159;}export function transformOrigin(_0x5b5857,_0x2441a4){const _0x2095b4=a74_0x2b1c;return _0x5b5857=_0x5b5857||a74_0x18ff9a[_0x2095b4(0x1dd)](),_0x5b5857[0x0]=_0x2441a4[0xc],_0x5b5857[0x1]=_0x2441a4[0xd],_0x5b5857[0x2]=_0x2441a4[0xe],_0x5b5857;}export function transformVec2(_0x355724,_0x4f8a6d,_0x47a683){const _0x314825=a74_0x2b1c;_0x355724=_0x355724||a74_0x30b3a3[_0x314825(0x1dd)]();let _0x524b0f=_0x4f8a6d[0x0],_0x42a986=_0x4f8a6d[0x1];return _0x355724[0x0]=_0x524b0f*_0x47a683[0x0]+_0x42a986*_0x47a683[0x4],_0x355724[0x1]=_0x524b0f*_0x47a683[0x1]+_0x42a986*_0x47a683[0x5],_0x355724;}export function transformVec3(_0x56b810,_0x10f822,_0x14659b){const _0x5d5089=a74_0x2b1c;_0x56b810=_0x56b810||a74_0x18ff9a[_0x5d5089(0x1dd)]();let _0x4e902e=_0x10f822[0x0],_0x12d51e=_0x10f822[0x1],_0x238802=_0x10f822[0x2];return _0x56b810[0x0]=_0x4e902e*_0x14659b[0x0]+_0x12d51e*_0x14659b[0x4]+_0x238802*_0x14659b[0x8],_0x56b810[0x1]=_0x4e902e*_0x14659b[0x1]+_0x12d51e*_0x14659b[0x5]+_0x238802*_0x14659b[0x9],_0x56b810[0x2]=_0x4e902e*_0x14659b[0x2]+_0x12d51e*_0x14659b[0x6]+_0x238802*_0x14659b[0xa],_0x56b810;}export function transformPoint2(_0x3b5d46,_0x42f053,_0x1ecf9e){const _0x1a235e=a74_0x2b1c;_0x3b5d46=_0x3b5d46||a74_0x30b3a3[_0x1a235e(0x1dd)]();let _0xab992a=_0x42f053[0x0],_0x4a4a58=_0x42f053[0x1];return _0x3b5d46[0x0]=_0xab992a*_0x1ecf9e[0x0]+_0x4a4a58*_0x1ecf9e[0x4]+_0x1ecf9e[0xc],_0x3b5d46[0x1]=_0xab992a*_0x1ecf9e[0x1]+_0x4a4a58*_0x1ecf9e[0x5]+_0x1ecf9e[0xd],_0x3b5d46;}export function transformPoint3(_0x537ebb,_0x229ed0,_0x544d0c){const _0x4238cf=a74_0x2b1c;_0x537ebb=_0x537ebb||a74_0x18ff9a[_0x4238cf(0x1dd)]();let _0x5de0e3=_0x229ed0[0x0],_0x49b7cf=_0x229ed0[0x1],_0x123acf=_0x229ed0[0x2];return _0x537ebb[0x0]=_0x5de0e3*_0x544d0c[0x0]+_0x49b7cf*_0x544d0c[0x4]+_0x123acf*_0x544d0c[0x8]+_0x544d0c[0xc],_0x537ebb[0x1]=_0x5de0e3*_0x544d0c[0x1]+_0x49b7cf*_0x544d0c[0x5]+_0x123acf*_0x544d0c[0x9]+_0x544d0c[0xd],_0x537ebb[0x2]=_0x5de0e3*_0x544d0c[0x2]+_0x49b7cf*_0x544d0c[0x6]+_0x123acf*_0x544d0c[0xa]+_0x544d0c[0xe],_0x537ebb;}export function transformPoint3V4(_0x4cf046,_0xb28f98,_0xec0d5a){_0x4cf046=_0x4cf046||a74_0x5060b0['make']();let _0x6d99e5=_0xb28f98[0x0],_0x18dfa8=_0xb28f98[0x1],_0x3331d9=_0xb28f98[0x2];return _0x4cf046[0x0]=_0x6d99e5*_0xec0d5a[0x0]+_0x18dfa8*_0xec0d5a[0x4]+_0x3331d9*_0xec0d5a[0x8]+_0xec0d5a[0xc],_0x4cf046[0x1]=_0x6d99e5*_0xec0d5a[0x1]+_0x18dfa8*_0xec0d5a[0x5]+_0x3331d9*_0xec0d5a[0x9]+_0xec0d5a[0xd],_0x4cf046[0x2]=_0x6d99e5*_0xec0d5a[0x2]+_0x18dfa8*_0xec0d5a[0x6]+_0x3331d9*_0xec0d5a[0xa]+_0xec0d5a[0xe],_0x4cf046[0x3]=_0x6d99e5*_0xec0d5a[0x3]+_0x18dfa8*_0xec0d5a[0x7]+_0x3331d9*_0xec0d5a[0xb]+_0xec0d5a[0xf],_0x4cf046;}export function transformPoint3PerspectiveDivide(_0x200749,_0x3906ac,_0x3ca985){const _0x17d9d2=a74_0x2b1c;_0x200749=_0x200749||a74_0x18ff9a[_0x17d9d2(0x1dd)]();let _0x440a56=_0x3906ac[0x0],_0x27984a=_0x3906ac[0x1],_0x4fb41b=_0x3906ac[0x2],_0xafd224;return _0x200749[0x0]=_0x440a56*_0x3ca985[0x0]+_0x27984a*_0x3ca985[0x4]+_0x4fb41b*_0x3ca985[0x8]+_0x3ca985[0xc],_0x200749[0x1]=_0x440a56*_0x3ca985[0x1]+_0x27984a*_0x3ca985[0x5]+_0x4fb41b*_0x3ca985[0x9]+_0x3ca985[0xd],_0x200749[0x2]=_0x440a56*_0x3ca985[0x2]+_0x27984a*_0x3ca985[0x6]+_0x4fb41b*_0x3ca985[0xa]+_0x3ca985[0xe],_0xafd224=_0x440a56*_0x3ca985[0x3]+_0x27984a*_0x3ca985[0x7]+_0x4fb41b*_0x3ca985[0xb]+_0x3ca985[0xf],a74_0x18ff9a[_0x17d9d2(0x1f3)](_0x200749,_0x200749,a74_0x22da3e['safeReciprocal'](_0xafd224)),_0x200749;}export function transformFloat4(_0xb476a0,_0x1465f2,_0x521915){_0xb476a0=_0xb476a0||a74_0x5060b0['make']();let _0x588816=_0x1465f2[0x0],_0x487543=_0x1465f2[0x1],_0x1930d4=_0x1465f2[0x2],_0x5dec77=_0x1465f2[0x3];return _0xb476a0[0x0]=_0x588816*_0x521915[0x0]+_0x487543*_0x521915[0x4]+_0x1930d4*_0x521915[0x8]+_0x5dec77*_0x521915[0xc],_0xb476a0[0x1]=_0x588816*_0x521915[0x1]+_0x487543*_0x521915[0x5]+_0x1930d4*_0x521915[0x9]+_0x5dec77*_0x521915[0xd],_0xb476a0[0x2]=_0x588816*_0x521915[0x2]+_0x487543*_0x521915[0x6]+_0x1930d4*_0x521915[0xa]+_0x5dec77*_0x521915[0xe],_0xb476a0[0x3]=_0x588816*_0x521915[0x3]+_0x487543*_0x521915[0x7]+_0x1930d4*_0x521915[0xb]+_0x5dec77*_0x521915[0xf],_0xb476a0;}export function perspectiveLerp(_0x275324,_0x4e2003,_0x2ec519,_0x38a066,_0x210e97,_0x5afb55){const _0x58a776=a74_0x2b1c;let _0x19a6e5=transformPoint3V4(null,_0x4e2003,_0x275324),_0x3656b6=transformPoint3V4(null,_0x2ec519,_0x275324),_0x744acd=a74_0x22da3e[_0x58a776(0x1ef)](_0x19a6e5[0x3]),_0x821b07=a74_0x22da3e[_0x58a776(0x1ef)](_0x3656b6[0x3]),_0x49ea0c=_0x744acd+_0x5afb55*(_0x821b07-_0x744acd);return(_0x38a066*_0x744acd+_0x5afb55*(_0x210e97*_0x821b07-_0x38a066*_0x744acd))*a74_0x22da3e[_0x58a776(0x1ef)](_0x49ea0c);}export function removeScaling(_0x252a77,_0x5401ca){const _0x165a4d=a74_0x2b1c;_0x252a77=_0x252a77||make();let _0x238b96=a74_0x18ff9a[_0x165a4d(0x1e8)](_0x5401ca[0x0],_0x5401ca[0x1],_0x5401ca[0x2]),_0x75d6e5=a74_0x18ff9a[_0x165a4d(0x1e8)](_0x5401ca[0x4],_0x5401ca[0x5],_0x5401ca[0x6]),_0x5f5380=a74_0x18ff9a['from'](_0x5401ca[0x8],_0x5401ca[0x9],_0x5401ca[0xa]);return _0x238b96=a74_0x18ff9a[_0x165a4d(0x1e6)](_0x238b96,_0x238b96),_0x75d6e5=a74_0x18ff9a[_0x165a4d(0x1e6)](_0x75d6e5,_0x75d6e5),_0x5f5380=a74_0x18ff9a[_0x165a4d(0x1e6)](_0x5f5380,_0x5f5380),_0x252a77===_0x5401ca?(_0x252a77[0x0]=_0x238b96[0x0],_0x252a77[0x1]=_0x238b96[0x1],_0x252a77[0x2]=_0x238b96[0x2],_0x252a77[0x4]=_0x75d6e5[0x0],_0x252a77[0x5]=_0x75d6e5[0x1],_0x252a77[0x6]=_0x75d6e5[0x2],_0x252a77[0x8]=_0x5f5380[0x0],_0x252a77[0x9]=_0x5f5380[0x1],_0x252a77[0xa]=_0x5f5380[0x2]):(_0x252a77[0x0]=_0x238b96[0x0],_0x252a77[0x1]=_0x238b96[0x1],_0x252a77[0x2]=_0x238b96[0x2],_0x252a77[0x3]=_0x5401ca[0x3],_0x252a77[0x4]=_0x75d6e5[0x0],_0x252a77[0x5]=_0x75d6e5[0x1],_0x252a77[0x6]=_0x75d6e5[0x2],_0x252a77[0x7]=_0x5401ca[0x7],_0x252a77[0x8]=_0x5f5380[0x0],_0x252a77[0x9]=_0x5f5380[0x1],_0x252a77[0xa]=_0x5f5380[0x2],_0x252a77[0xb]=_0x5401ca[0xb],_0x252a77[0xc]=_0x5401ca[0xc],_0x252a77[0xd]=_0x5401ca[0xd],_0x252a77[0xe]=_0x5401ca[0xe],_0x252a77[0xf]=_0x5401ca[0xf]),_0x252a77;}