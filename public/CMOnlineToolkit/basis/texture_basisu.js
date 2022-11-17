// File: texture.js

/**
 * @author wujiali
 */
 
//===================================================================================================

// ASTC format, from:
// https://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_astc/
COMPRESSED_RGBA_ASTC_4x4_KHR = 0x93B0;

// DXT formats, from:
// http://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_s3tc/
COMPRESSED_RGB_S3TC_DXT1_EXT  = 0x83F0;
COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;

// ETC format, from:
// https://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_etc1/
COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

// PVRTC format, from:
// https://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_pvrtc/
COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;

BASIS_FORMAT = {
  cTFETC1: 0,
  cTFETC2: 1,
  cTFBC1: 2,
  cTFBC3: 3,
  cTFBC4: 4,
  cTFBC5: 5,
  cTFBC7_M6_OPAQUE_ONLY: 6,
  cTFBC7_M5: 7,
  cTFPVRTC1_4_RGB: 8,
  cTFPVRTC1_4_RGBA: 9,
  cTFASTC_4x4: 10,
  cTFATC_RGB: 11,
  cTFATC_RGBA_INTERPOLATED_ALPHA: 12,
  cTFRGBA32: 13,
  cTFRGB565: 14,
  cTFBGR565: 15,
  cTFRGBA4444: 16,
};

function TexturerBasisu() {

  this.wasmInit = false;

  this.dxtSupported = false;
  this.bc7Supported = false;
  this.astcSupported = false;
  this.pvrtcSupported = false;

  this.loadSclePicture = function() {
    // 将贴图材质绑定到OpenGL
    GetBasisuTextureMtl(g_GLMaterialSet);
}

  this.getWebglExtension = function() {
    if (this.wasmInit) {
      return;
    }

    BASIS({onRuntimeInitialized : () => {
      this.dxtSupported = !!gl.getExtension('WEBGL_compressed_texture_s3tc'); // true √
      this.bc7Supported = !!gl.getExtension('EXT_texture_compression_bptc'); // true √
      this.astcSupported = !!gl.getExtension('WEBGL_compressed_texture_astc');
      this.pvrtcSupported = !!(gl.getExtension('WEBGL_compressed_texture_pvrtc')) || !!(gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'));
    
      // console.log("dxtSupported: ", this.dxtSupported);
      // console.log("bc7Supported: ", this.bc7Supported);
      // console.log("astcSupported: ", this.astcSupported);
      // console.log("pvrtcSupported: ", this.pvrtcSupported);

      if (!(this.astcSupported || this.etcSupported || this.dxtSupported || this.pvrtcSupported)) {
        console.log("texture compress unsupport!");
      }

      this.wasmInit = true;
    }}).then(module => { window.Module = module; this.loadSclePicture(); });
  }

  this.basis2TcFormate = function(format) {
    var tcFormat = -1;
  
    if (format === BASIS_FORMAT.cTFASTC_4x4)
    {
      tcFormat = COMPRESSED_RGBA_ASTC_4x4_KHR;
    }
    else if (format === BASIS_FORMAT.cTFBC1)
    {
      tcFormat = COMPRESSED_RGB_S3TC_DXT1_EXT;
    }
    else if (format === BASIS_FORMAT.cTFBC3)
    {
      tcFormat = COMPRESSED_RGBA_S3TC_DXT5_EXT;
    }
    else if (format === BASIS_FORMAT.cTFETC1)
    {
      tcFormat = COMPRESSED_RGB_ETC1_WEBGL;
    }
    else if (format === BASIS_FORMAT.cTFPVRTC1_4_RGB)
    {
      tcFormat = COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
    }
    else if (format === BASIS_FORMAT.cTFPVRTC1_4_RGBA)
    {
      tcFormat = COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
    }
  
    return tcFormat;
  }

  this.getBasisFormat = function(hasAlpha) {
    var formatString = 'UNKNOWN';
    var format = -1;

    if (this.astcSupported)
    {
      formatString = 'ASTC';
      format = BASIS_FORMAT.cTFASTC_4x4;
    }
    else if (this.dxtSupported)
    {
      if (hasAlpha)
      {
        formatString = 'BC3';
        format = BASIS_FORMAT.cTFBC3;
      }
      else
      {
        formatString = 'BC1';
        format = BASIS_FORMAT.cTFBC1;
      }
    }
    else if (this.pvrtcSupported)
    {
      if (hasAlpha)
      {
        formatString = 'PVRTC1_RGBA';
        format = BASIS_FORMAT.cTFPVRTC1_4_RGBA;
      }
      else
      {
        formatString = 'PVRTC1_RGB';
        format = BASIS_FORMAT.cTFPVRTC1_4_RGB;
      }
    }
    else if (this.etcSupported)
    {
      formatString = 'ETC1';
      format = BASIS_FORMAT.cTFETC1;
    }
    else
    {
      formatString = 'RGB565';
      format = BASIS_FORMAT.cTFRGB565;
      log('Decoding .basis data to 565');
    }

    return {
      FORMAT: format,
      NAME: formatString,
    };
  }

  this.loadBasisData = function(basisArrayBuffer) {
    // console.log('Done loading .basis file, decoded header:');

    var basisFileObj;

    const { BasisFile, initializeBasis, encodeBasisTexture } = Module;

    initializeBasis();

    const basisFile = new BasisFile(new Uint8Array(basisArrayBuffer));

    var width = basisFile.getImageWidth(0, 0);
    var height = basisFile.getImageHeight(0, 0);
    var images = basisFile.getNumImages();
    var levels = basisFile.getNumLevels(0);
    var hasAlpha = basisFile.getHasAlpha();

    if (!width || !height || !images || !levels) {
      console.warn('Invalid .basis file');
      basisFile.close();
      basisFile.delete();
      return;
    }

    var basisFormat = this.getBasisFormat(hasAlpha);
    var tcFormat = this.basis2TcFormate(basisFormat.FORMAT);

    if (!basisFile.startTranscoding()) {
      console.warn('startTranscoding failed');
      basisFile.close();
      basisFile.delete();
      return;
    }

    const dstSize = basisFile.getImageTranscodedSizeInBytes(0, 0, basisFormat.FORMAT);
    const dst = new Uint8Array(dstSize);

    if (!basisFile.transcodeImage(dst, 0, 0, basisFormat.FORMAT, 0, 0)) {
      console.warn('transcodeImage failed');
      basisFile.close();
      basisFile.delete();

      return;
    }

    basisFile.close();
    basisFile.delete();

    return basisFileObj = {
      width,
      height,
      tcFormat,
      dst
    }
  }

  this.createRgb565Texture = function(rgb565Data, width, height) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGB,
      width,
      height,
      0,
      gl.RGB,
      gl.UNSIGNED_SHORT_5_6_5,
      rgb565Data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  }

  this.createCompressedTexture = function(data, width, height, format) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.compressedTexImage2D(
        gl.TEXTURE_2D,
        0,
        format,
        width,
        height,
        0,
        data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  }

}

  
