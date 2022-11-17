// File: texture.js

/**
 * @author wujiali
 */
 
//===================================================================================================

function Texturer() {

  this.createUrlRgbaTexture = function(image) {
    gl.activeTexture(gl.TEXTURE0);
    let uTexID = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, uTexID);
    //纹理放大缩小使用线�?插�?
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // ST坐标适应图片宽和�?
    if (isWebgl2) {
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T, gl.REPEAT);
    } else {
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    // 内存向GPU传输纹理数据，为1字节对齐
    gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
    if (isWebgl2) {
        gl.pixelStorei(gl.UNPACK_ROW_LENGTH,0);
        gl.pixelStorei(gl.UNPACK_SKIP_PIXELS,0);
        gl.pixelStorei(gl.UNPACK_SKIP_ROWS,0);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return uTexID;
  }

  this.createScleRgbTexture = function(image) {
    gl.activeTexture(gl.TEXTURE0);
    let uTexID = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, uTexID);
    //纹理放大缩小使用线�?插�?
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // ST坐标适应图片宽和�?
    if (isWebgl2) {
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T, gl.REPEAT);
    } else {
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
    if (isWebgl2) {
        gl.pixelStorei(gl.UNPACK_ROW_LENGTH,0);
        gl.pixelStorei(gl.UNPACK_SKIP_PIXELS,0);
        gl.pixelStorei(gl.UNPACK_SKIP_ROWS,0);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image._imageWidth, image._imageHeight, 0, gl.RGB, gl.UNSIGNED_BYTE, image._imageData);
    return uTexID;
  }

}

  
