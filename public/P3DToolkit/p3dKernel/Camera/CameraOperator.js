var a20_0x5040=['draw3D','34315xCIMXJ','ePan','133884dpAFaQ','1LzUgDF','fAspect','_fInterocularDistance','179379yfKRTs','41579FyBgby','eRotPos','eRotDir','lockUpAxis','rotPos','from','721113dHpmLr','8CHaxyc','216956ByvVII','fromCleCamera','7dspnPV','desc','_fFOVY','flush','zoomWithMouseWheel','_onTick','updateDesc','1619tABNxt','setControl','max','3fnvZWN','isCompleted','selfRotateAnimRun()'];var a20_0x33fd3c=a20_0x3489;(function(_0x27f6d6,_0x3b50db){var _0x281b89=a20_0x3489;while(!![]){try{var _0xaff4ca=parseInt(_0x281b89(0x7b))*parseInt(_0x281b89(0x89))+-parseInt(_0x281b89(0x79))+parseInt(_0x281b89(0x82))*-parseInt(_0x281b89(0x78))+-parseInt(_0x281b89(0x85))*parseInt(_0x281b89(0x70))+parseInt(_0x281b89(0x8c))*-parseInt(_0x281b89(0x71))+parseInt(_0x281b89(0x8b))+parseInt(_0x281b89(0x77));if(_0xaff4ca===_0x3b50db)break;else _0x27f6d6['push'](_0x27f6d6['shift']());}catch(_0xc7ebd1){_0x27f6d6['push'](_0x27f6d6['shift']());}}}(a20_0x5040,0x45b8a));var g_camera=null,g_cameraController=null,g_cameraDesc=null,g_cameraTweener=null,g_fElapseTimeInSeconds=null,g_selfRotateHandle=null,g_selfRotateElapse=0x1e,g_selfRotateDelta=float2[a20_0x33fd3c(0x76)](-0x1,0x0),g_isCameraAnimMode=!![];function shiftViewOnTick(_0x31fd69){var _0x53244f=a20_0x33fd3c;if(g_cameraTweener==null){g_render['_onTick']=null,g_fElapseTimeInSeconds=null;return;}let _0x272355=0x0;g_fElapseTimeInSeconds!=null&&(_0x272355=_0x31fd69-g_fElapseTimeInSeconds,_0x272355=Math[_0x53244f(0x84)](_0x272355,0x0),_0x272355*=0.001),g_fElapseTimeInSeconds=_0x31fd69,CameraTweener[_0x53244f(0x86)](g_cameraTweener)==![]&&(CameraTweener['tick'](g_cameraTweener,_0x272355),Camera[_0x53244f(0x81)](g_camera,g_cameraTweener['desc']),glRunTime['flush']()),CameraTweener[_0x53244f(0x86)](g_cameraTweener)==![]?window['requestAnimationFrame'](function(_0x588e34){shiftViewOnTick(_0x588e34);}):g_cameraTweener=null;}function shiftViewAnim(_0x52f869,_0x982ecc){var _0x332504=a20_0x33fd3c;g_isCameraAnimMode?(g_cameraTweener=CameraTweener['make'](g_camera[_0x332504(0x7c)],_0x52f869,_0x982ecc),g_fElapseTimeInSeconds=null,g_render[_0x332504(0x80)]=shiftViewOnTick,glRunTime['flush']()):(Camera['updateDesc'](g_camera,_0x52f869),glRunTime[_0x332504(0x7e)]());}function enableCameraAnimation(_0xeed831){_0xeed831?g_isCameraAnimMode=!![]:g_isCameraAnimMode=![];}function selfRotateAnimRun(){var _0x5501aa=a20_0x33fd3c;CameraController[_0x5501aa(0x75)](g_cameraController,g_camera,g_selfRotateDelta),glRunTime[_0x5501aa(0x7e)](),g_selfRotateHandle=setTimeout(_0x5501aa(0x87),g_selfRotateElapse);}function selfRotateAnimStop(){g_selfRotateHandle!=null&&clearTimeout(g_selfRotateHandle),g_selfRotateHandle=null;}function setCameraControlMode(_0x304550){var _0x5e8084=a20_0x33fd3c;if(_0x304550==0x0)selfRotateAnimStop(),CameraController[_0x5e8084(0x83)](g_cameraController,CameraController[_0x5e8084(0x72)]);else{if(_0x304550==0x1)CameraController[_0x5e8084(0x74)](g_cameraController,g_sceneConfig['_upAxis']),CameraController[_0x5e8084(0x83)](g_cameraController,CameraController[_0x5e8084(0x72)]),selfRotateAnimRun();else{if(_0x304550==0x2)selfRotateAnimStop(),CameraController[_0x5e8084(0x83)](g_cameraController,CameraController[_0x5e8084(0x8a)]);else{if(_0x304550==0x3)selfRotateAnimStop(),CameraController[_0x5e8084(0x83)](g_cameraController,CameraController['eRotDir']);else{if(_0x304550==0x4)selfRotateAnimStop(),CameraController['setControl'](g_cameraController,CameraController[_0x5e8084(0x73)]);else _0x304550==0x5&&(selfRotateAnimStop(),CameraController[_0x5e8084(0x83)](g_cameraController,CameraController[_0x5e8084(0x73)]));}}}}}function getCameraCurView(){var _0x28cec4=a20_0x33fd3c;let _0xc70ea3=new P3D_CAMERA();return Common['exportToCleCamera'](_0xc70ea3,g_camera[_0x28cec4(0x7c)]),_0xc70ea3[_0x28cec4(0x7d)]=g_camera[_0x28cec4(0x7c)]['fFOVInRadian'],_0xc70ea3['_fAspect']=g_camera['desc']['fAspect'],_0xc70ea3[_0x28cec4(0x6f)]=0x0,_0xc70ea3;}function setCameraCurView(_0x102029){var _0x401763=a20_0x33fd3c;return Common[_0x401763(0x7a)](g_cameraDesc,_0x102029),g_cameraDesc[_0x401763(0x6e)]=g_camera[_0x401763(0x7c)][_0x401763(0x6e)],Camera[_0x401763(0x81)](g_camera,g_cameraDesc),glRunTime[_0x401763(0x88)](),!![];}function a20_0x3489(_0x4b3922,_0x4f6a43){_0x4b3922=_0x4b3922-0x6e;var _0x5040aa=a20_0x5040[_0x4b3922];return _0x5040aa;}function setCameraRotate(_0x3adbe8,_0x57cded,_0x4d0f3c){var _0x1b6b65=a20_0x33fd3c;let _0x3d041b=float2[_0x1b6b65(0x76)](-_0x3adbe8,_0x57cded);CameraController['rotate'](g_cameraController,g_camera,CameraController[_0x1b6b65(0x72)],_0x3d041b),glRunTime[_0x1b6b65(0x88)]();}function setCameraZoom(_0x406c86){var _0x40dedd=a20_0x33fd3c;CameraController[_0x40dedd(0x7f)](g_cameraController,g_camera,_0x406c86),glRunTime[_0x40dedd(0x88)]();}function setCameraSlide(_0xea87ba,_0x1d3a86){var _0x5c4789=a20_0x33fd3c;let _0x9f91a6=float2[_0x5c4789(0x76)](-_0xea87ba,_0x1d3a86);CameraController['pan'](g_cameraController,g_camera,_0x9f91a6),glRunTime[_0x5c4789(0x88)]();}