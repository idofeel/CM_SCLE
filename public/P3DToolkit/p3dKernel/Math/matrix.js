'use strict';const a79_0x4a50=['13lyKoTg','negate','eAxisX','make','105974NpDJTX','set','41KoIBtE','tan','sub','902618dpBYqS','dot','mul','907277cyCqZW','normalize','from','126065BLHHgC','cos','sin','16902xTkogJ','asin','cross','acos','857221OznYCj','65371IzbfnR','isNearlyZero','atan2','sqrt','safeReciprocal'];(function(_0x382ff6,_0x31bba7){const _0x24249b=a79_0x584d;while(!![]){try{const _0x572ad6=parseInt(_0x24249b(0xd6))+-parseInt(_0x24249b(0xdd))+parseInt(_0x24249b(0xd9))*parseInt(_0x24249b(0xe9))+parseInt(_0x24249b(0xde))+parseInt(_0x24249b(0xd0))+parseInt(_0x24249b(0xd3))+-parseInt(_0x24249b(0xe7))*parseInt(_0x24249b(0xe3));if(_0x572ad6===_0x31bba7)break;else _0x382ff6['push'](_0x382ff6['shift']());}catch(_0x118573){_0x382ff6['push'](_0x382ff6['shift']());}}}(a79_0x4a50,0x702a6));import*as a79_0x4921ca from'./float2.js';import*as a79_0x263da4 from'./float3.js';import*as a79_0x5c38e1 from'./float4.js';import*as a79_0x2aa0f3 from'./math.js';import{reciprocal}from'./float2.js';export function make(){let _0x43c41f=new Float32Array(0x10);{_0x43c41f[0x0]=0x1,_0x43c41f[0x5]=0x1,_0x43c41f[0xa]=0x1,_0x43c41f[0xf]=0x1;}return _0x43c41f;}export function copy(_0x48c483){let _0x38d8ba=make();{_0x38d8ba[0x0]=_0x48c483[0x0],_0x38d8ba[0x1]=_0x48c483[0x1],_0x38d8ba[0x2]=_0x48c483[0x2],_0x38d8ba[0x3]=_0x48c483[0x3],_0x38d8ba[0x4]=_0x48c483[0x4],_0x38d8ba[0x5]=_0x48c483[0x5],_0x38d8ba[0x6]=_0x48c483[0x6],_0x38d8ba[0x7]=_0x48c483[0x7],_0x38d8ba[0x8]=_0x48c483[0x8],_0x38d8ba[0x9]=_0x48c483[0x9],_0x38d8ba[0xa]=_0x48c483[0xa],_0x38d8ba[0xb]=_0x48c483[0xb],_0x38d8ba[0xc]=_0x48c483[0xc],_0x38d8ba[0xd]=_0x48c483[0xd],_0x38d8ba[0xe]=_0x48c483[0xe],_0x38d8ba[0xf]=_0x48c483[0xf];}return _0x38d8ba;}export function fromArray(_0x4dbed1){let _0x565a2f=make();{_0x565a2f[0x0]=_0x4dbed1[0x0],_0x565a2f[0x1]=_0x4dbed1[0x1],_0x565a2f[0x2]=_0x4dbed1[0x2],_0x565a2f[0x3]=_0x4dbed1[0x3],_0x565a2f[0x4]=_0x4dbed1[0x4],_0x565a2f[0x5]=_0x4dbed1[0x5],_0x565a2f[0x6]=_0x4dbed1[0x6],_0x565a2f[0x7]=_0x4dbed1[0x7],_0x565a2f[0x8]=_0x4dbed1[0x8],_0x565a2f[0x9]=_0x4dbed1[0x9],_0x565a2f[0xa]=_0x4dbed1[0xa],_0x565a2f[0xb]=_0x4dbed1[0xb],_0x565a2f[0xc]=_0x4dbed1[0xc],_0x565a2f[0xd]=_0x4dbed1[0xd],_0x565a2f[0xe]=_0x4dbed1[0xe],_0x565a2f[0xf]=_0x4dbed1[0xf];}return _0x565a2f;}export function toArray(_0x2b78da,_0x482631,_0x7ce431){_0x482631[_0x7ce431+0x0]=_0x2b78da[0x0],_0x482631[_0x7ce431+0x1]=_0x2b78da[0x1],_0x482631[_0x7ce431+0x2]=_0x2b78da[0x2],_0x482631[_0x7ce431+0x3]=_0x2b78da[0x3],_0x482631[_0x7ce431+0x4]=_0x2b78da[0x4],_0x482631[_0x7ce431+0x5]=_0x2b78da[0x5],_0x482631[_0x7ce431+0x6]=_0x2b78da[0x6],_0x482631[_0x7ce431+0x7]=_0x2b78da[0x7],_0x482631[_0x7ce431+0x8]=_0x2b78da[0x8],_0x482631[_0x7ce431+0x9]=_0x2b78da[0x9],_0x482631[_0x7ce431+0xa]=_0x2b78da[0xa],_0x482631[_0x7ce431+0xb]=_0x2b78da[0xb],_0x482631[_0x7ce431+0xc]=_0x2b78da[0xc],_0x482631[_0x7ce431+0xd]=_0x2b78da[0xd],_0x482631[_0x7ce431+0xe]=_0x2b78da[0xe],_0x482631[_0x7ce431+0xf]=_0x2b78da[0xf];}export function toTextureFloatArray(_0x76ea3,_0x31f8fd,_0x1d157e){_0x31f8fd[_0x1d157e+0x0]=_0x76ea3[0x0],_0x31f8fd[_0x1d157e+0x1]=_0x76ea3[0x4],_0x31f8fd[_0x1d157e+0x2]=_0x76ea3[0x8],_0x31f8fd[_0x1d157e+0x3]=_0x76ea3[0xc],_0x31f8fd[_0x1d157e+0x4]=_0x76ea3[0x1],_0x31f8fd[_0x1d157e+0x5]=_0x76ea3[0x5],_0x31f8fd[_0x1d157e+0x6]=_0x76ea3[0x9],_0x31f8fd[_0x1d157e+0x7]=_0x76ea3[0xd],_0x31f8fd[_0x1d157e+0x8]=_0x76ea3[0x2],_0x31f8fd[_0x1d157e+0x9]=_0x76ea3[0x6],_0x31f8fd[_0x1d157e+0xa]=_0x76ea3[0xa],_0x31f8fd[_0x1d157e+0xb]=_0x76ea3[0xe];}export function toFloat32Array(_0x3c748e,_0x2ec621,_0x1dee2e){const _0x3f2289=a79_0x584d;_0x2ec621[_0x3f2289(0xe8)](_0x3c748e,_0x1dee2e);}export function assign(_0x1e8d11,_0x292875){return _0x1e8d11[0x0]=_0x292875[0x0],_0x1e8d11[0x1]=_0x292875[0x1],_0x1e8d11[0x2]=_0x292875[0x2],_0x1e8d11[0x3]=_0x292875[0x3],_0x1e8d11[0x4]=_0x292875[0x4],_0x1e8d11[0x5]=_0x292875[0x5],_0x1e8d11[0x6]=_0x292875[0x6],_0x1e8d11[0x7]=_0x292875[0x7],_0x1e8d11[0x8]=_0x292875[0x8],_0x1e8d11[0x9]=_0x292875[0x9],_0x1e8d11[0xa]=_0x292875[0xa],_0x1e8d11[0xb]=_0x292875[0xb],_0x1e8d11[0xc]=_0x292875[0xc],_0x1e8d11[0xd]=_0x292875[0xd],_0x1e8d11[0xe]=_0x292875[0xe],_0x1e8d11[0xf]=_0x292875[0xf],_0x1e8d11;}export function identity(_0x2f5bb8){return _0x2f5bb8[0x0]=0x1,_0x2f5bb8[0x1]=0x0,_0x2f5bb8[0x2]=0x0,_0x2f5bb8[0x3]=0x0,_0x2f5bb8[0x4]=0x0,_0x2f5bb8[0x5]=0x1,_0x2f5bb8[0x6]=0x0,_0x2f5bb8[0x7]=0x0,_0x2f5bb8[0x8]=0x0,_0x2f5bb8[0x9]=0x0,_0x2f5bb8[0xa]=0x1,_0x2f5bb8[0xb]=0x0,_0x2f5bb8[0xc]=0x0,_0x2f5bb8[0xd]=0x0,_0x2f5bb8[0xe]=0x0,_0x2f5bb8[0xf]=0x1,_0x2f5bb8;}function a79_0x584d(_0x564671,_0x1b0785){_0x564671=_0x564671-0xd0;let _0x4a5053=a79_0x4a50[_0x564671];return _0x4a5053;}export function isIdentity(_0x337e4e){return _0x337e4e[0x0]===0x1&&_0x337e4e[0x1]===0x0&&_0x337e4e[0x2]===0x0&&_0x337e4e[0x3]===0x0&&_0x337e4e[0x4]===0x0&&_0x337e4e[0x5]===0x1&&_0x337e4e[0x6]===0x0&&_0x337e4e[0x7]===0x0&&_0x337e4e[0x8]===0x0&&_0x337e4e[0x9]===0x0&&_0x337e4e[0xa]===0x1&&_0x337e4e[0xb]===0x0&&_0x337e4e[0xc]===0x0&&_0x337e4e[0xd]===0x0&&_0x337e4e[0xe]===0x0&&_0x337e4e[0xf]===0x1;}export function isMirrored(_0x353c15){const _0x53ccd6=a79_0x584d;let _0x36855e=a79_0x263da4[_0x53ccd6(0xd5)](_0x353c15[0x0],_0x353c15[0x1],_0x353c15[0x2]),_0x40fa44=a79_0x263da4[_0x53ccd6(0xd5)](_0x353c15[0x4],_0x353c15[0x5],_0x353c15[0x6]),_0xf23a27=a79_0x263da4['from'](_0x353c15[0x8],_0x353c15[0x8],_0x353c15[0xa]);return a79_0x263da4['cross'](_0x36855e,_0x36855e,_0xf23a27),a79_0x263da4['dot'](_0x36855e,_0x40fa44)>0x0;}export function determinant(_0x160ccd){let _0x264a5e=_0x160ccd[0x0],_0x4b8c64=_0x160ccd[0x1],_0xb58508=_0x160ccd[0x2],_0x5cfe74=_0x160ccd[0x3],_0x539c87=_0x160ccd[0x4],_0x4a6c68=_0x160ccd[0x5],_0x449fd6=_0x160ccd[0x6],_0x2059c8=_0x160ccd[0x7],_0x3fb06f=_0x160ccd[0x8],_0x59aef6=_0x160ccd[0x9],_0x55bad7=_0x160ccd[0xa],_0x339957=_0x160ccd[0xb],_0xb41c67=_0x160ccd[0xc],_0x23f3c0=_0x160ccd[0xd],_0x37d3c4=_0x160ccd[0xe],_0x407289=_0x160ccd[0xf],_0x28f39d=_0x264a5e*_0x4a6c68-_0x4b8c64*_0x539c87,_0x78f470=_0x264a5e*_0x449fd6-_0xb58508*_0x539c87,_0x4de0f5=_0x4b8c64*_0x449fd6-_0xb58508*_0x4a6c68,_0x3755b1=_0x3fb06f*_0x23f3c0-_0x59aef6*_0xb41c67,_0x932a2a=_0x3fb06f*_0x37d3c4-_0x55bad7*_0xb41c67,_0x578ca5=_0x59aef6*_0x37d3c4-_0x55bad7*_0x23f3c0,_0x55c058=_0x264a5e*_0x578ca5-_0x4b8c64*_0x932a2a+_0xb58508*_0x3755b1,_0x1ac377=_0x539c87*_0x578ca5-_0x4a6c68*_0x932a2a+_0x449fd6*_0x3755b1,_0x3dcaab=_0x3fb06f*_0x4de0f5-_0x59aef6*_0x78f470+_0x55bad7*_0x28f39d,_0x4fd73f=_0xb41c67*_0x4de0f5-_0x23f3c0*_0x78f470+_0x37d3c4*_0x28f39d;return _0x2059c8*_0x55c058-_0x5cfe74*_0x1ac377+_0x407289*_0x3dcaab-_0x339957*_0x4fd73f;}export function yaw(_0x4e0885){const _0x4c0cd9=a79_0x584d;return Math[_0x4c0cd9(0xe0)](_0x4e0885[0x8],_0x4e0885[0xa]);}export function pitch(_0x72f971){const _0xb98aaf=a79_0x584d;return-Math[_0xb98aaf(0xda)](_0x72f971[0x9]);}export function roll(_0x1cdc49){const _0x2366f9=a79_0x584d,_0xf95d82=Math[_0x2366f9(0xe1)](_0x1cdc49[0xa]*_0x1cdc49[0xa]+_0x1cdc49[0x8]*_0x1cdc49[0x8]);if(a79_0x2aa0f3[_0x2366f9(0xdf)](_0xf95d82,0.000001))return 0x0;const _0x2057d6=(_0x1cdc49[0xa]*_0x1cdc49[0x0]-_0x1cdc49[0x8]*_0x1cdc49[0x2])/_0xf95d82,_0x409926=Math[_0x2366f9(0xdc)](_0x2057d6);return _0x1cdc49[0x1]<0x0?-_0x409926:_0x409926;}export function transpose(_0x1474b4,_0x5e043c){_0x1474b4=_0x1474b4||make();if(_0x1474b4===_0x5e043c){let _0x45ab37=_0x5e043c[0x1],_0x3ab6e0=_0x5e043c[0x2],_0x248a84=_0x5e043c[0x3],_0x4d2fd7=_0x5e043c[0x6],_0x10a7d9=_0x5e043c[0x7],_0x1615a0=_0x5e043c[0xb];_0x1474b4[0x1]=_0x5e043c[0x4],_0x1474b4[0x2]=_0x5e043c[0x8],_0x1474b4[0x3]=_0x5e043c[0xc],_0x1474b4[0x4]=_0x45ab37,_0x1474b4[0x6]=_0x5e043c[0x9],_0x1474b4[0x7]=_0x5e043c[0xd],_0x1474b4[0x8]=_0x3ab6e0,_0x1474b4[0x9]=_0x4d2fd7,_0x1474b4[0xb]=_0x5e043c[0xe],_0x1474b4[0xc]=_0x248a84,_0x1474b4[0xd]=_0x10a7d9,_0x1474b4[0xe]=_0x1615a0;}else _0x1474b4[0x0]=_0x5e043c[0x0],_0x1474b4[0x1]=_0x5e043c[0x4],_0x1474b4[0x2]=_0x5e043c[0x8],_0x1474b4[0x3]=_0x5e043c[0xc],_0x1474b4[0x4]=_0x5e043c[0x1],_0x1474b4[0x5]=_0x5e043c[0x5],_0x1474b4[0x6]=_0x5e043c[0x9],_0x1474b4[0x7]=_0x5e043c[0xd],_0x1474b4[0x8]=_0x5e043c[0x2],_0x1474b4[0x9]=_0x5e043c[0x6],_0x1474b4[0xa]=_0x5e043c[0xa],_0x1474b4[0xb]=_0x5e043c[0xe],_0x1474b4[0xc]=_0x5e043c[0x3],_0x1474b4[0xd]=_0x5e043c[0x7],_0x1474b4[0xe]=_0x5e043c[0xb],_0x1474b4[0xf]=_0x5e043c[0xf];return _0x1474b4;}export function inverse(_0x54b267,_0x14ef3c){const _0x3f3e62=a79_0x584d;_0x54b267=_0x54b267||make();let _0x3bd65c=_0x14ef3c[0x0],_0x47996e=_0x14ef3c[0x1],_0x2f51a1=_0x14ef3c[0x2],_0x512899=_0x14ef3c[0x3],_0x408fa6=_0x14ef3c[0x4],_0x5c1559=_0x14ef3c[0x5],_0x4a0909=_0x14ef3c[0x6],_0x4520b5=_0x14ef3c[0x7],_0xe94cff=_0x14ef3c[0x8],_0x2e8d01=_0x14ef3c[0x9],_0x19e37d=_0x14ef3c[0xa],_0x455533=_0x14ef3c[0xb],_0x1cdea6=_0x14ef3c[0xc],_0x8936c5=_0x14ef3c[0xd],_0x2b4f41=_0x14ef3c[0xe],_0x1b4102=_0x14ef3c[0xf],_0x4f0f28=_0x3bd65c*_0x5c1559-_0x47996e*_0x408fa6,_0x2c36e6=_0x3bd65c*_0x4a0909-_0x2f51a1*_0x408fa6,_0x87047b=_0x3bd65c*_0x4520b5-_0x512899*_0x408fa6,_0x19ad83=_0x47996e*_0x4a0909-_0x2f51a1*_0x5c1559,_0x2f104c=_0x47996e*_0x4520b5-_0x512899*_0x5c1559,_0x39c025=_0x2f51a1*_0x4520b5-_0x512899*_0x4a0909,_0x5a14b1=_0xe94cff*_0x8936c5-_0x2e8d01*_0x1cdea6,_0x5b8943=_0xe94cff*_0x2b4f41-_0x19e37d*_0x1cdea6,_0x50e311=_0xe94cff*_0x1b4102-_0x455533*_0x1cdea6,_0x325f08=_0x2e8d01*_0x2b4f41-_0x19e37d*_0x8936c5,_0xe5b968=_0x2e8d01*_0x1b4102-_0x455533*_0x8936c5,_0x3b45c5=_0x19e37d*_0x1b4102-_0x455533*_0x2b4f41,_0x3a0bee;{_0x3a0bee=_0x4f0f28*_0x3b45c5-_0x2c36e6*_0xe5b968+_0x87047b*_0x325f08+_0x19ad83*_0x50e311-_0x2f104c*_0x5b8943+_0x39c025*_0x5a14b1,_0x3a0bee=a79_0x2aa0f3[_0x3f3e62(0xe2)](_0x3a0bee);}return _0x54b267[0x0]=(_0x5c1559*_0x3b45c5-_0x4a0909*_0xe5b968+_0x4520b5*_0x325f08)*_0x3a0bee,_0x54b267[0x1]=(_0x2f51a1*_0xe5b968-_0x47996e*_0x3b45c5-_0x512899*_0x325f08)*_0x3a0bee,_0x54b267[0x2]=(_0x8936c5*_0x39c025-_0x2b4f41*_0x2f104c+_0x1b4102*_0x19ad83)*_0x3a0bee,_0x54b267[0x3]=(_0x19e37d*_0x2f104c-_0x2e8d01*_0x39c025-_0x455533*_0x19ad83)*_0x3a0bee,_0x54b267[0x4]=(_0x4a0909*_0x50e311-_0x408fa6*_0x3b45c5-_0x4520b5*_0x5b8943)*_0x3a0bee,_0x54b267[0x5]=(_0x3bd65c*_0x3b45c5-_0x2f51a1*_0x50e311+_0x512899*_0x5b8943)*_0x3a0bee,_0x54b267[0x6]=(_0x2b4f41*_0x87047b-_0x1cdea6*_0x39c025-_0x1b4102*_0x2c36e6)*_0x3a0bee,_0x54b267[0x7]=(_0xe94cff*_0x39c025-_0x19e37d*_0x87047b+_0x455533*_0x2c36e6)*_0x3a0bee,_0x54b267[0x8]=(_0x408fa6*_0xe5b968-_0x5c1559*_0x50e311+_0x4520b5*_0x5a14b1)*_0x3a0bee,_0x54b267[0x9]=(_0x47996e*_0x50e311-_0x3bd65c*_0xe5b968-_0x512899*_0x5a14b1)*_0x3a0bee,_0x54b267[0xa]=(_0x1cdea6*_0x2f104c-_0x8936c5*_0x87047b+_0x1b4102*_0x4f0f28)*_0x3a0bee,_0x54b267[0xb]=(_0x2e8d01*_0x87047b-_0xe94cff*_0x2f104c-_0x455533*_0x4f0f28)*_0x3a0bee,_0x54b267[0xc]=(_0x5c1559*_0x5b8943-_0x408fa6*_0x325f08-_0x4a0909*_0x5a14b1)*_0x3a0bee,_0x54b267[0xd]=(_0x3bd65c*_0x325f08-_0x47996e*_0x5b8943+_0x2f51a1*_0x5a14b1)*_0x3a0bee,_0x54b267[0xe]=(_0x8936c5*_0x2c36e6-_0x1cdea6*_0x19ad83-_0x2b4f41*_0x4f0f28)*_0x3a0bee,_0x54b267[0xf]=(_0xe94cff*_0x19ad83-_0x2e8d01*_0x2c36e6+_0x19e37d*_0x4f0f28)*_0x3a0bee,_0x54b267;}export function inverseTranspose(_0x50f8c3,_0xdb204c){return transpose(_0x50f8c3,inverse(_0x50f8c3,_0xdb204c));}export function mul(_0x3ba5ab,_0x3a7ba3,_0x4c58c5){_0x3ba5ab=_0x3ba5ab||make();let _0x27de41=_0x4c58c5[0x0],_0x52cbba=_0x4c58c5[0x1],_0x387852=_0x4c58c5[0x2],_0x2ba23a=_0x4c58c5[0x3],_0x5c6dce=_0x4c58c5[0x4],_0x3cc77e=_0x4c58c5[0x5],_0x501498=_0x4c58c5[0x6],_0x32d113=_0x4c58c5[0x7],_0x2ac38f=_0x4c58c5[0x8],_0x47b942=_0x4c58c5[0x9],_0x1f30b5=_0x4c58c5[0xa],_0x572abc=_0x4c58c5[0xb],_0x3f9623=_0x4c58c5[0xc],_0x38d8ee=_0x4c58c5[0xd],_0x51bc04=_0x4c58c5[0xe],_0x43ca49=_0x4c58c5[0xf],_0x378822=_0x3a7ba3[0x0],_0x40eb34=_0x3a7ba3[0x1],_0x1577a1=_0x3a7ba3[0x2],_0x33f697=_0x3a7ba3[0x3];return _0x3ba5ab[0x0]=_0x378822*_0x27de41+_0x40eb34*_0x5c6dce+_0x1577a1*_0x2ac38f+_0x33f697*_0x3f9623,_0x3ba5ab[0x1]=_0x378822*_0x52cbba+_0x40eb34*_0x3cc77e+_0x1577a1*_0x47b942+_0x33f697*_0x38d8ee,_0x3ba5ab[0x2]=_0x378822*_0x387852+_0x40eb34*_0x501498+_0x1577a1*_0x1f30b5+_0x33f697*_0x51bc04,_0x3ba5ab[0x3]=_0x378822*_0x2ba23a+_0x40eb34*_0x32d113+_0x1577a1*_0x572abc+_0x33f697*_0x43ca49,_0x378822=_0x3a7ba3[0x4],_0x40eb34=_0x3a7ba3[0x5],_0x1577a1=_0x3a7ba3[0x6],_0x33f697=_0x3a7ba3[0x7],_0x3ba5ab[0x4]=_0x378822*_0x27de41+_0x40eb34*_0x5c6dce+_0x1577a1*_0x2ac38f+_0x33f697*_0x3f9623,_0x3ba5ab[0x5]=_0x378822*_0x52cbba+_0x40eb34*_0x3cc77e+_0x1577a1*_0x47b942+_0x33f697*_0x38d8ee,_0x3ba5ab[0x6]=_0x378822*_0x387852+_0x40eb34*_0x501498+_0x1577a1*_0x1f30b5+_0x33f697*_0x51bc04,_0x3ba5ab[0x7]=_0x378822*_0x2ba23a+_0x40eb34*_0x32d113+_0x1577a1*_0x572abc+_0x33f697*_0x43ca49,_0x378822=_0x3a7ba3[0x8],_0x40eb34=_0x3a7ba3[0x9],_0x1577a1=_0x3a7ba3[0xa],_0x33f697=_0x3a7ba3[0xb],_0x3ba5ab[0x8]=_0x378822*_0x27de41+_0x40eb34*_0x5c6dce+_0x1577a1*_0x2ac38f+_0x33f697*_0x3f9623,_0x3ba5ab[0x9]=_0x378822*_0x52cbba+_0x40eb34*_0x3cc77e+_0x1577a1*_0x47b942+_0x33f697*_0x38d8ee,_0x3ba5ab[0xa]=_0x378822*_0x387852+_0x40eb34*_0x501498+_0x1577a1*_0x1f30b5+_0x33f697*_0x51bc04,_0x3ba5ab[0xb]=_0x378822*_0x2ba23a+_0x40eb34*_0x32d113+_0x1577a1*_0x572abc+_0x33f697*_0x43ca49,_0x378822=_0x3a7ba3[0xc],_0x40eb34=_0x3a7ba3[0xd],_0x1577a1=_0x3a7ba3[0xe],_0x33f697=_0x3a7ba3[0xf],_0x3ba5ab[0xc]=_0x378822*_0x27de41+_0x40eb34*_0x5c6dce+_0x1577a1*_0x2ac38f+_0x33f697*_0x3f9623,_0x3ba5ab[0xd]=_0x378822*_0x52cbba+_0x40eb34*_0x3cc77e+_0x1577a1*_0x47b942+_0x33f697*_0x38d8ee,_0x3ba5ab[0xe]=_0x378822*_0x387852+_0x40eb34*_0x501498+_0x1577a1*_0x1f30b5+_0x33f697*_0x51bc04,_0x3ba5ab[0xf]=_0x378822*_0x2ba23a+_0x40eb34*_0x32d113+_0x1577a1*_0x572abc+_0x33f697*_0x43ca49,_0x3ba5ab;}export function lookAt(_0x86ffec,_0xef3984,_0x2174cc,_0x125fb1){const _0xdca1eb=a79_0x584d;_0x86ffec=_0x86ffec||make();let _0x26738f;{_0x26738f=a79_0x263da4[_0xdca1eb(0xeb)](_0x26738f,_0xef3984,_0x2174cc),_0x26738f=a79_0x263da4['normalize'](_0x26738f,_0x26738f);}let _0x97fd71;{_0x97fd71=a79_0x263da4['cross'](_0x97fd71,_0x125fb1,_0x26738f),_0x97fd71=a79_0x263da4[_0xdca1eb(0xd4)](_0x97fd71,_0x97fd71);}let _0x5040c4=a79_0x263da4[_0xdca1eb(0xdb)](null,_0x26738f,_0x97fd71),_0x3aedad=a79_0x263da4[_0xdca1eb(0xe4)](null,_0xef3984),_0x3bf700=a79_0x263da4[_0xdca1eb(0xd1)](_0x97fd71,_0x3aedad),_0x5ba328=a79_0x263da4['dot'](_0x5040c4,_0x3aedad),_0x4b411b=a79_0x263da4[_0xdca1eb(0xd1)](_0x26738f,_0x3aedad);return _0x86ffec[0x0]=_0x97fd71[0x0],_0x86ffec[0x4]=_0x97fd71[0x1],_0x86ffec[0x8]=_0x97fd71[0x2],_0x86ffec[0xc]=_0x3bf700,_0x86ffec[0x1]=_0x5040c4[0x0],_0x86ffec[0x5]=_0x5040c4[0x1],_0x86ffec[0x9]=_0x5040c4[0x2],_0x86ffec[0xd]=_0x5ba328,_0x86ffec[0x2]=_0x26738f[0x0],_0x86ffec[0x6]=_0x26738f[0x1],_0x86ffec[0xa]=_0x26738f[0x2],_0x86ffec[0xe]=_0x4b411b,_0x86ffec[0x3]=0x0,_0x86ffec[0x7]=0x0,_0x86ffec[0xb]=0x0,_0x86ffec[0xf]=0x1,_0x86ffec;}export function projOrtho(_0x58d3f9,_0x14bbc8,_0x232ebd,_0x49625d,_0x29e893){const _0x1f4f58=a79_0x584d;_0x58d3f9=_0x58d3f9||make();let _0x13f4ec=a79_0x2aa0f3[_0x1f4f58(0xe2)](_0x49625d-_0x29e893);return _0x58d3f9[0x0]=0x2*a79_0x2aa0f3[_0x1f4f58(0xe2)](_0x14bbc8),_0x58d3f9[0x1]=0x0,_0x58d3f9[0x2]=0x0,_0x58d3f9[0x3]=0x0,_0x58d3f9[0x4]=0x0,_0x58d3f9[0x5]=0x2*a79_0x2aa0f3[_0x1f4f58(0xe2)](_0x232ebd),_0x58d3f9[0x6]=0x0,_0x58d3f9[0x7]=0x0,_0x58d3f9[0x8]=0x0,_0x58d3f9[0x9]=0x0,_0x58d3f9[0xa]=0x2*_0x13f4ec,_0x58d3f9[0xb]=0x0,_0x58d3f9[0xc]=0x0,_0x58d3f9[0xd]=0x0,_0x58d3f9[0xe]=(_0x49625d+_0x29e893)*_0x13f4ec,_0x58d3f9[0xf]=0x1,_0x58d3f9;}export function projOrthoOffCenter(_0x542a54,_0x1ff9d4,_0x5e266a,_0x4d3a73,_0x462559,_0x4d45a4,_0x1915c8){const _0x11c67c=a79_0x584d;_0x542a54=_0x542a54||make();let _0x4115de=a79_0x2aa0f3[_0x11c67c(0xe2)](_0x5e266a-_0x1ff9d4),_0x2d506a=a79_0x2aa0f3[_0x11c67c(0xe2)](_0x462559-_0x4d3a73),_0x2a350a=a79_0x2aa0f3['safeReciprocal'](_0x4d45a4-_0x1915c8);return _0x542a54[0x0]=_0x4115de+_0x4115de,_0x542a54[0x1]=0x0,_0x542a54[0x2]=0x0,_0x542a54[0x3]=0x0,_0x542a54[0x4]=0x0,_0x542a54[0x5]=_0x2d506a+_0x2d506a,_0x542a54[0x6]=0x0,_0x542a54[0x7]=0x0,_0x542a54[0x8]=0x0,_0x542a54[0x9]=0x0,_0x542a54[0xa]=0x2*_0x2a350a,_0x542a54[0xb]=0x0,_0x542a54[0xc]=-(_0x1ff9d4+_0x5e266a)*_0x4115de,_0x542a54[0xd]=-(_0x462559+_0x4d3a73)*_0x2d506a,_0x542a54[0xe]=(_0x4d45a4+_0x1915c8)*_0x2a350a,_0x542a54[0xf]=0x1,_0x542a54;}export function projPerspective(_0x1f309e,_0x2a361a,_0x464a9e,_0x35a21e,_0x40c90c){const _0x679ba7=a79_0x584d;_0x1f309e=_0x1f309e||make();let _0x4f1435=a79_0x2aa0f3['safeReciprocal'](Math[_0x679ba7(0xea)](_0x2a361a*0.5)),_0xe60b8c=_0x4f1435*a79_0x2aa0f3['safeReciprocal'](_0x464a9e),_0x4c1ebe=a79_0x2aa0f3[_0x679ba7(0xe2)](_0x35a21e-_0x40c90c);return _0x1f309e[0x0]=_0xe60b8c,_0x1f309e[0x1]=0x0,_0x1f309e[0x2]=0x0,_0x1f309e[0x3]=0x0,_0x1f309e[0x4]=0x0,_0x1f309e[0x5]=_0x4f1435,_0x1f309e[0x6]=0x0,_0x1f309e[0x7]=0x0,_0x1f309e[0x8]=0x0,_0x1f309e[0x9]=0x0,_0x1f309e[0xa]=(_0x35a21e+_0x40c90c)*_0x4c1ebe,_0x1f309e[0xb]=-0x1,_0x1f309e[0xc]=0x0,_0x1f309e[0xd]=0x0,_0x1f309e[0xe]=0x2*_0x40c90c*_0x35a21e*_0x4c1ebe,_0x1f309e[0xf]=0x0,_0x1f309e;}export function rotateQuaternion(_0x5d9ac2,_0x3c9fb7){_0x5d9ac2=_0x5d9ac2||make();let _0x2720ca=_0x3c9fb7[0x0],_0x3f544e=_0x3c9fb7[0x1],_0xde0671=_0x3c9fb7[0x2],_0x267c44=_0x3c9fb7[0x3],_0x4eece0=_0x2720ca+_0x2720ca,_0x4c5dd4=_0x3f544e+_0x3f544e,_0x71520c=_0xde0671+_0xde0671,_0x863b02=_0x267c44+_0x267c44,_0x59cde2=_0x2720ca*_0x4eece0,_0x402470=_0x3f544e*_0x4c5dd4,_0x2e529c=_0xde0671*_0x71520c,_0xa921e5=_0x267c44*_0x863b02,_0x3c1be7=_0x402470,_0x5432e3=_0x59cde2,_0x44e444=_0x59cde2,_0x22bc40=0x0,_0x4ef0f6=_0x2e529c,_0x2a80cb=_0x2e529c,_0x46abaf=_0x402470,_0x1a10bf=0x0,_0x2deb19=0x1-_0x3c1be7-_0x4ef0f6,_0x1af4fe=0x1-_0x5432e3-_0x2a80cb,_0x275e59=0x1-_0x44e444-_0x46abaf,_0x280fa9=0x0-_0x22bc40-_0x1a10bf;_0x3c1be7=_0x2720ca,_0x5432e3=_0x2720ca,_0x44e444=_0x3f544e,_0x22bc40=_0x267c44,_0x4ef0f6=_0x71520c,_0x2a80cb=_0x4c5dd4,_0x46abaf=_0x71520c,_0x1a10bf=_0x863b02,_0x3c1be7*=_0x4ef0f6,_0x5432e3*=_0x2a80cb,_0x44e444*=_0x46abaf,_0x22bc40*=_0x1a10bf,_0x4ef0f6=_0x267c44,_0x2a80cb=_0x267c44,_0x46abaf=_0x267c44,_0x1a10bf=_0x267c44;let _0x4d5979=_0x4c5dd4,_0x486574=_0x71520c,_0x5f2f13=_0x4eece0,_0x54a7fd=_0x863b02;_0x4ef0f6*=_0x4d5979,_0x2a80cb*=_0x486574,_0x46abaf*=_0x5f2f13,_0x1a10bf*=_0x54a7fd;let _0x168231=_0x3c1be7+_0x4ef0f6,_0x9677f1=_0x5432e3+_0x2a80cb,_0x409946=_0x44e444+_0x46abaf,_0x534f04=_0x22bc40+_0x1a10bf,_0x34e561=_0x3c1be7-_0x4ef0f6,_0x5ae6fe=_0x5432e3-_0x2a80cb,_0x2b82a7=_0x44e444-_0x46abaf,_0x599aa6=_0x22bc40-_0x1a10bf;return _0x3c1be7=_0x9677f1,_0x5432e3=_0x34e561,_0x44e444=_0x5ae6fe,_0x22bc40=_0x409946,_0x4ef0f6=_0x168231,_0x2a80cb=_0x2b82a7,_0x46abaf=_0x168231,_0x1a10bf=_0x2b82a7,_0x5d9ac2[0x0]=_0x2deb19,_0x5d9ac2[0x1]=_0x3c1be7,_0x5d9ac2[0x2]=_0x5432e3,_0x5d9ac2[0x3]=_0x280fa9,_0x5d9ac2[0x4]=_0x44e444,_0x5d9ac2[0x5]=_0x1af4fe,_0x5d9ac2[0x6]=_0x22bc40,_0x5d9ac2[0x7]=_0x280fa9,_0x5d9ac2[0x8]=_0x4ef0f6,_0x5d9ac2[0x9]=_0x2a80cb,_0x5d9ac2[0xa]=_0x275e59,_0x5d9ac2[0xb]=_0x280fa9,_0x5d9ac2[0xc]=0x0,_0x5d9ac2[0xd]=0x0,_0x5d9ac2[0xe]=0x0,_0x5d9ac2[0xf]=0x1,_0x5d9ac2;}export function scaling(_0x7b8548,_0x437309){return _0x7b8548=_0x7b8548||make(),_0x7b8548[0x0]=_0x437309[0x0],_0x7b8548[0x1]=0x0,_0x7b8548[0x2]=0x0,_0x7b8548[0x3]=0x0,_0x7b8548[0x4]=0x0,_0x7b8548[0x5]=_0x437309[0x1],_0x7b8548[0x6]=0x0,_0x7b8548[0x7]=0x0,_0x7b8548[0x8]=0x0,_0x7b8548[0x9]=0x0,_0x7b8548[0xa]=_0x437309[0x2],_0x7b8548[0xb]=0x0,_0x7b8548[0xc]=0x0,_0x7b8548[0xd]=0x0,_0x7b8548[0xe]=0x0,_0x7b8548[0xf]=0x1,_0x7b8548;}export function scalingUniform(_0x2c4a9c,_0x4a91a1){return _0x2c4a9c=_0x2c4a9c||make(),_0x2c4a9c[0x0]=_0x4a91a1,_0x2c4a9c[0x1]=0x0,_0x2c4a9c[0x2]=0x0,_0x2c4a9c[0x3]=0x0,_0x2c4a9c[0x4]=0x0,_0x2c4a9c[0x5]=_0x4a91a1,_0x2c4a9c[0x6]=0x0,_0x2c4a9c[0x7]=0x0,_0x2c4a9c[0x8]=0x0,_0x2c4a9c[0x9]=0x0,_0x2c4a9c[0xa]=_0x4a91a1,_0x2c4a9c[0xb]=0x0,_0x2c4a9c[0xc]=0x0,_0x2c4a9c[0xd]=0x0,_0x2c4a9c[0xe]=0x0,_0x2c4a9c[0xf]=0x1,_0x2c4a9c;}export function scalingXYZ(_0x525283,_0x33166f,_0x2c97f4,_0x5dc990){return _0x525283=_0x525283||make(),_0x525283[0x0]=_0x33166f,_0x525283[0x1]=0x0,_0x525283[0x2]=0x0,_0x525283[0x3]=0x0,_0x525283[0x4]=0x0,_0x525283[0x5]=_0x2c97f4,_0x525283[0x6]=0x0,_0x525283[0x7]=0x0,_0x525283[0x8]=0x0,_0x525283[0x9]=0x0,_0x525283[0xa]=_0x5dc990,_0x525283[0xb]=0x0,_0x525283[0xc]=0x0,_0x525283[0xd]=0x0,_0x525283[0xe]=0x0,_0x525283[0xf]=0x1,_0x525283;}export function translation(_0x1412a0,_0x2d3cf9){return _0x1412a0=_0x1412a0||make(),_0x1412a0[0x0]=0x1,_0x1412a0[0x1]=0x0,_0x1412a0[0x2]=0x0,_0x1412a0[0x3]=0x0,_0x1412a0[0x4]=0x0,_0x1412a0[0x5]=0x1,_0x1412a0[0x6]=0x0,_0x1412a0[0x7]=0x0,_0x1412a0[0x8]=0x0,_0x1412a0[0x9]=0x0,_0x1412a0[0xa]=0x1,_0x1412a0[0xb]=0x0,_0x1412a0[0xc]=_0x2d3cf9[0x0],_0x1412a0[0xd]=_0x2d3cf9[0x1],_0x1412a0[0xe]=_0x2d3cf9[0x2],_0x1412a0[0xf]=0x1,_0x1412a0;}export function translationUniform(_0x41a15c,_0x811525){return _0x41a15c=_0x41a15c||make(),_0x41a15c[0x0]=0x1,_0x41a15c[0x1]=0x0,_0x41a15c[0x2]=0x0,_0x41a15c[0x3]=0x0,_0x41a15c[0x4]=0x0,_0x41a15c[0x5]=0x1,_0x41a15c[0x6]=0x0,_0x41a15c[0x7]=0x0,_0x41a15c[0x8]=0x0,_0x41a15c[0x9]=0x0,_0x41a15c[0xa]=0x1,_0x41a15c[0xb]=0x0,_0x41a15c[0xc]=_0x811525,_0x41a15c[0xd]=_0x811525,_0x41a15c[0xe]=_0x811525,_0x41a15c[0xf]=0x1,_0x41a15c;}export function translationXYZ(_0x7c9002,_0x27b184,_0x4e73c0,_0x16f05a){return _0x7c9002=_0x7c9002||make(),_0x7c9002[0x0]=0x1,_0x7c9002[0x1]=0x0,_0x7c9002[0x2]=0x0,_0x7c9002[0x3]=0x0,_0x7c9002[0x4]=0x0,_0x7c9002[0x5]=0x1,_0x7c9002[0x6]=0x0,_0x7c9002[0x7]=0x0,_0x7c9002[0x8]=0x0,_0x7c9002[0x9]=0x0,_0x7c9002[0xa]=0x1,_0x7c9002[0xb]=0x0,_0x7c9002[0xc]=_0x27b184,_0x7c9002[0xd]=_0x4e73c0,_0x7c9002[0xe]=_0x16f05a,_0x7c9002[0xf]=0x1,_0x7c9002;}export function rotate(_0x40ece6,_0x359358,_0x387d26){const _0x1388aa=a79_0x584d;_0x40ece6=_0x40ece6||make();let _0x389d37=a79_0x263da4[_0x1388aa(0xd4)](null,_0x359358),_0x521494=_0x389d37[0x0],_0x16b08=_0x389d37[0x1],_0x49b197=_0x389d37[0x2],_0x35ecb9=Math[_0x1388aa(0xd8)](_0x387d26),_0x27d84f=Math[_0x1388aa(0xd7)](_0x387d26),_0x172ad0=0x1-_0x27d84f;return _0x40ece6[0x0]=_0x27d84f+_0x521494*_0x521494*_0x172ad0,_0x40ece6[0x1]=_0x49b197*_0x35ecb9+_0x16b08*_0x521494*_0x172ad0,_0x40ece6[0x2]=-_0x16b08*_0x35ecb9+_0x49b197*_0x521494*_0x172ad0,_0x40ece6[0x3]=0x0,_0x40ece6[0x4]=-_0x49b197*_0x35ecb9+_0x521494*_0x16b08*_0x172ad0,_0x40ece6[0x5]=_0x27d84f+_0x16b08*_0x16b08*_0x172ad0,_0x40ece6[0x6]=_0x521494*_0x35ecb9+_0x49b197*_0x16b08*_0x172ad0,_0x40ece6[0x7]=0x0,_0x40ece6[0x8]=_0x16b08*_0x35ecb9+_0x521494*_0x49b197*_0x172ad0,_0x40ece6[0x9]=-_0x521494*_0x35ecb9+_0x16b08*_0x49b197*_0x172ad0,_0x40ece6[0xa]=_0x27d84f+_0x49b197*_0x49b197*_0x172ad0,_0x40ece6[0xb]=0x0,_0x40ece6[0xc]=0x0,_0x40ece6[0xd]=0x0,_0x40ece6[0xe]=0x0,_0x40ece6[0xf]=0x1,_0x40ece6;}export function rotateX(_0x30937f,_0x14d811){const _0xd5e5b=a79_0x584d;_0x30937f=_0x30937f||make();let _0xc2af29=Math[_0xd5e5b(0xd8)](_0x14d811),_0x390eb6=Math[_0xd5e5b(0xd7)](_0x14d811);return _0x30937f[0x0]=0x1,_0x30937f[0x1]=0x0,_0x30937f[0x2]=0x0,_0x30937f[0x3]=0x0,_0x30937f[0x4]=0x0,_0x30937f[0x5]=_0x390eb6,_0x30937f[0x6]=_0xc2af29,_0x30937f[0x7]=0x0,_0x30937f[0x8]=0x0,_0x30937f[0x9]=-_0xc2af29,_0x30937f[0xa]=_0x390eb6,_0x30937f[0xb]=0x0,_0x30937f[0xc]=0x0,_0x30937f[0xd]=0x0,_0x30937f[0xe]=0x0,_0x30937f[0xf]=0x1,_0x30937f;}export function rotateY(_0x1f1ae0,_0x56a930){const _0x145567=a79_0x584d;_0x1f1ae0=_0x1f1ae0||make();let _0x6dfdef=Math[_0x145567(0xd8)](_0x56a930),_0x3019d3=Math['cos'](_0x56a930);return _0x1f1ae0[0x0]=_0x3019d3,_0x1f1ae0[0x1]=0x0,_0x1f1ae0[0x2]=-_0x6dfdef,_0x1f1ae0[0x3]=0x0,_0x1f1ae0[0x4]=0x0,_0x1f1ae0[0x5]=0x1,_0x1f1ae0[0x6]=0x0,_0x1f1ae0[0x7]=0x0,_0x1f1ae0[0x8]=_0x6dfdef,_0x1f1ae0[0x9]=0x0,_0x1f1ae0[0xa]=_0x3019d3,_0x1f1ae0[0xb]=0x0,_0x1f1ae0[0xc]=0x0,_0x1f1ae0[0xd]=0x0,_0x1f1ae0[0xe]=0x0,_0x1f1ae0[0xf]=0x1,_0x1f1ae0;}export function rotateZ(_0x5cba51,_0x1b776b){const _0x3a8025=a79_0x584d;_0x5cba51=_0x5cba51||make();let _0x5279f5=Math[_0x3a8025(0xd8)](_0x1b776b),_0xfba5ce=Math[_0x3a8025(0xd7)](_0x1b776b);return _0x5cba51[0x0]=_0xfba5ce,_0x5cba51[0x1]=_0x5279f5,_0x5cba51[0x2]=0x0,_0x5cba51[0x3]=0x0,_0x5cba51[0x4]=-_0x5279f5,_0x5cba51[0x5]=_0xfba5ce,_0x5cba51[0x6]=0x0,_0x5cba51[0x7]=0x0,_0x5cba51[0x8]=0x0,_0x5cba51[0x9]=0x0,_0x5cba51[0xa]=0x1,_0x5cba51[0xb]=0x0,_0x5cba51[0xc]=0x0,_0x5cba51[0xd]=0x0,_0x5cba51[0xe]=0x0,_0x5cba51[0xf]=0x1,_0x5cba51;}export function transformUnitAxis(_0x270c13,_0x4efe62,_0x1c54cb){const _0x147341=a79_0x584d;_0x270c13=_0x270c13||a79_0x263da4[_0x147341(0xe6)]();if(_0x4efe62===a79_0x2aa0f3[_0x147341(0xe5)])_0x270c13[0x0]=_0x1c54cb[0x0],_0x270c13[0x1]=_0x1c54cb[0x1],_0x270c13[0x2]=_0x1c54cb[0x2];else _0x4efe62===a79_0x2aa0f3['eAxisY']?(_0x270c13[0x0]=_0x1c54cb[0x4],_0x270c13[0x1]=_0x1c54cb[0x5],_0x270c13[0x2]=_0x1c54cb[0x6]):(_0x270c13[0x0]=_0x1c54cb[0x8],_0x270c13[0x1]=_0x1c54cb[0x9],_0x270c13[0x2]=_0x1c54cb[0xa]);return _0x270c13;}export function transformOrigin(_0x1985b2,_0x445a49){const _0xd9c1fb=a79_0x584d;return _0x1985b2=_0x1985b2||a79_0x263da4[_0xd9c1fb(0xe6)](),_0x1985b2[0x0]=_0x445a49[0xc],_0x1985b2[0x1]=_0x445a49[0xd],_0x1985b2[0x2]=_0x445a49[0xe],_0x1985b2;}export function transformVec2(_0x246790,_0x10c18f,_0x412a88){const _0x5651db=a79_0x584d;_0x246790=_0x246790||a79_0x4921ca[_0x5651db(0xe6)]();let _0x1b1715=_0x10c18f[0x0],_0x51bb01=_0x10c18f[0x1];return _0x246790[0x0]=_0x1b1715*_0x412a88[0x0]+_0x51bb01*_0x412a88[0x4],_0x246790[0x1]=_0x1b1715*_0x412a88[0x1]+_0x51bb01*_0x412a88[0x5],_0x246790;}export function transformVec3(_0x4caf33,_0x4e554e,_0x2ecbfe){const _0x418e43=a79_0x584d;_0x4caf33=_0x4caf33||a79_0x263da4[_0x418e43(0xe6)]();let _0x393c1c=_0x4e554e[0x0],_0x3216cd=_0x4e554e[0x1],_0x274031=_0x4e554e[0x2];return _0x4caf33[0x0]=_0x393c1c*_0x2ecbfe[0x0]+_0x3216cd*_0x2ecbfe[0x4]+_0x274031*_0x2ecbfe[0x8],_0x4caf33[0x1]=_0x393c1c*_0x2ecbfe[0x1]+_0x3216cd*_0x2ecbfe[0x5]+_0x274031*_0x2ecbfe[0x9],_0x4caf33[0x2]=_0x393c1c*_0x2ecbfe[0x2]+_0x3216cd*_0x2ecbfe[0x6]+_0x274031*_0x2ecbfe[0xa],_0x4caf33;}export function transformPoint2(_0x5f3de6,_0x23c4eb,_0xbfd889){const _0x362802=a79_0x584d;_0x5f3de6=_0x5f3de6||a79_0x4921ca[_0x362802(0xe6)]();let _0x32086f=_0x23c4eb[0x0],_0x154bc6=_0x23c4eb[0x1];return _0x5f3de6[0x0]=_0x32086f*_0xbfd889[0x0]+_0x154bc6*_0xbfd889[0x4]+_0xbfd889[0xc],_0x5f3de6[0x1]=_0x32086f*_0xbfd889[0x1]+_0x154bc6*_0xbfd889[0x5]+_0xbfd889[0xd],_0x5f3de6;}export function transformPoint3(_0x2864b2,_0x1b411f,_0x29275e){const _0x51bf39=a79_0x584d;_0x2864b2=_0x2864b2||a79_0x263da4[_0x51bf39(0xe6)]();let _0x3085f7=_0x1b411f[0x0],_0x434d50=_0x1b411f[0x1],_0x530e65=_0x1b411f[0x2];return _0x2864b2[0x0]=_0x3085f7*_0x29275e[0x0]+_0x434d50*_0x29275e[0x4]+_0x530e65*_0x29275e[0x8]+_0x29275e[0xc],_0x2864b2[0x1]=_0x3085f7*_0x29275e[0x1]+_0x434d50*_0x29275e[0x5]+_0x530e65*_0x29275e[0x9]+_0x29275e[0xd],_0x2864b2[0x2]=_0x3085f7*_0x29275e[0x2]+_0x434d50*_0x29275e[0x6]+_0x530e65*_0x29275e[0xa]+_0x29275e[0xe],_0x2864b2;}export function transformPoint3V4(_0x188203,_0x3eefd4,_0x5ecde9){_0x188203=_0x188203||a79_0x5c38e1['make']();let _0x19bc9b=_0x3eefd4[0x0],_0x11c379=_0x3eefd4[0x1],_0x3a6f35=_0x3eefd4[0x2];return _0x188203[0x0]=_0x19bc9b*_0x5ecde9[0x0]+_0x11c379*_0x5ecde9[0x4]+_0x3a6f35*_0x5ecde9[0x8]+_0x5ecde9[0xc],_0x188203[0x1]=_0x19bc9b*_0x5ecde9[0x1]+_0x11c379*_0x5ecde9[0x5]+_0x3a6f35*_0x5ecde9[0x9]+_0x5ecde9[0xd],_0x188203[0x2]=_0x19bc9b*_0x5ecde9[0x2]+_0x11c379*_0x5ecde9[0x6]+_0x3a6f35*_0x5ecde9[0xa]+_0x5ecde9[0xe],_0x188203[0x3]=_0x19bc9b*_0x5ecde9[0x3]+_0x11c379*_0x5ecde9[0x7]+_0x3a6f35*_0x5ecde9[0xb]+_0x5ecde9[0xf],_0x188203;}export function transformPoint3PerspectiveDivide(_0x11e0a2,_0x3cb98b,_0x17f9f8){const _0x574cf1=a79_0x584d;_0x11e0a2=_0x11e0a2||a79_0x263da4[_0x574cf1(0xe6)]();let _0x3787d1=_0x3cb98b[0x0],_0x3df003=_0x3cb98b[0x1],_0x3502c2=_0x3cb98b[0x2],_0x363038;return _0x11e0a2[0x0]=_0x3787d1*_0x17f9f8[0x0]+_0x3df003*_0x17f9f8[0x4]+_0x3502c2*_0x17f9f8[0x8]+_0x17f9f8[0xc],_0x11e0a2[0x1]=_0x3787d1*_0x17f9f8[0x1]+_0x3df003*_0x17f9f8[0x5]+_0x3502c2*_0x17f9f8[0x9]+_0x17f9f8[0xd],_0x11e0a2[0x2]=_0x3787d1*_0x17f9f8[0x2]+_0x3df003*_0x17f9f8[0x6]+_0x3502c2*_0x17f9f8[0xa]+_0x17f9f8[0xe],_0x363038=_0x3787d1*_0x17f9f8[0x3]+_0x3df003*_0x17f9f8[0x7]+_0x3502c2*_0x17f9f8[0xb]+_0x17f9f8[0xf],a79_0x263da4[_0x574cf1(0xd2)](_0x11e0a2,_0x11e0a2,a79_0x2aa0f3['safeReciprocal'](_0x363038)),_0x11e0a2;}export function transformFloat4(_0x48dc71,_0x759ff5,_0x181df3){_0x48dc71=_0x48dc71||a79_0x5c38e1['make']();let _0x570b75=_0x759ff5[0x0],_0xe321d4=_0x759ff5[0x1],_0x2a2f9c=_0x759ff5[0x2],_0xc3c76d=_0x759ff5[0x3];return _0x48dc71[0x0]=_0x570b75*_0x181df3[0x0]+_0xe321d4*_0x181df3[0x4]+_0x2a2f9c*_0x181df3[0x8]+_0xc3c76d*_0x181df3[0xc],_0x48dc71[0x1]=_0x570b75*_0x181df3[0x1]+_0xe321d4*_0x181df3[0x5]+_0x2a2f9c*_0x181df3[0x9]+_0xc3c76d*_0x181df3[0xd],_0x48dc71[0x2]=_0x570b75*_0x181df3[0x2]+_0xe321d4*_0x181df3[0x6]+_0x2a2f9c*_0x181df3[0xa]+_0xc3c76d*_0x181df3[0xe],_0x48dc71[0x3]=_0x570b75*_0x181df3[0x3]+_0xe321d4*_0x181df3[0x7]+_0x2a2f9c*_0x181df3[0xb]+_0xc3c76d*_0x181df3[0xf],_0x48dc71;}export function perspectiveLerp(_0x506878,_0x282e03,_0x1d8246,_0x125996,_0x26bcbc,_0x31a4a6){const _0x912b92=a79_0x584d;let _0x32130a=transformPoint3V4(null,_0x282e03,_0x506878),_0x3186b5=transformPoint3V4(null,_0x1d8246,_0x506878),_0x18112c=a79_0x2aa0f3[_0x912b92(0xe2)](_0x32130a[0x3]),_0x4cfa03=a79_0x2aa0f3[_0x912b92(0xe2)](_0x3186b5[0x3]),_0x14d365=_0x18112c+_0x31a4a6*(_0x4cfa03-_0x18112c);return(_0x125996*_0x18112c+_0x31a4a6*(_0x26bcbc*_0x4cfa03-_0x125996*_0x18112c))*a79_0x2aa0f3['safeReciprocal'](_0x14d365);}export function removeScaling(_0x25b33e,_0x1fa9ec){const _0x29d616=a79_0x584d;_0x25b33e=_0x25b33e||make();let _0x3b4209=a79_0x263da4[_0x29d616(0xd5)](_0x1fa9ec[0x0],_0x1fa9ec[0x1],_0x1fa9ec[0x2]),_0x3691db=a79_0x263da4[_0x29d616(0xd5)](_0x1fa9ec[0x4],_0x1fa9ec[0x5],_0x1fa9ec[0x6]),_0x2037f9=a79_0x263da4['from'](_0x1fa9ec[0x8],_0x1fa9ec[0x9],_0x1fa9ec[0xa]);return _0x3b4209=a79_0x263da4[_0x29d616(0xd4)](_0x3b4209,_0x3b4209),_0x3691db=a79_0x263da4[_0x29d616(0xd4)](_0x3691db,_0x3691db),_0x2037f9=a79_0x263da4[_0x29d616(0xd4)](_0x2037f9,_0x2037f9),_0x25b33e===_0x1fa9ec?(_0x25b33e[0x0]=_0x3b4209[0x0],_0x25b33e[0x1]=_0x3b4209[0x1],_0x25b33e[0x2]=_0x3b4209[0x2],_0x25b33e[0x4]=_0x3691db[0x0],_0x25b33e[0x5]=_0x3691db[0x1],_0x25b33e[0x6]=_0x3691db[0x2],_0x25b33e[0x8]=_0x2037f9[0x0],_0x25b33e[0x9]=_0x2037f9[0x1],_0x25b33e[0xa]=_0x2037f9[0x2]):(_0x25b33e[0x0]=_0x3b4209[0x0],_0x25b33e[0x1]=_0x3b4209[0x1],_0x25b33e[0x2]=_0x3b4209[0x2],_0x25b33e[0x3]=_0x1fa9ec[0x3],_0x25b33e[0x4]=_0x3691db[0x0],_0x25b33e[0x5]=_0x3691db[0x1],_0x25b33e[0x6]=_0x3691db[0x2],_0x25b33e[0x7]=_0x1fa9ec[0x7],_0x25b33e[0x8]=_0x2037f9[0x0],_0x25b33e[0x9]=_0x2037f9[0x1],_0x25b33e[0xa]=_0x2037f9[0x2],_0x25b33e[0xb]=_0x1fa9ec[0xb],_0x25b33e[0xc]=_0x1fa9ec[0xc],_0x25b33e[0xd]=_0x1fa9ec[0xd],_0x25b33e[0xe]=_0x1fa9ec[0xe],_0x25b33e[0xf]=_0x1fa9ec[0xf]),_0x25b33e;}