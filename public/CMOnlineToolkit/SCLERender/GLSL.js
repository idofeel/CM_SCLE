// File: GLSL.js

/**
 * @author wujiali
 */
 
//===================================================================================================

// Vertex shader program
// const vsSolid = "attribute vec3 a_Position;attribute vec3 a_Vector;attribute vec2 a_UV;uniform mat4 u_MVPMatrix;uniform vec3 u_eyeLocation;uniform float u_power;varying vec4 v_Diffuse;varying vec4 v_Ambient;varying vec4 v_Specular;varying vec2 v_TextureCoord;void main() {gl_Position = u_MVPMatrix * vec4(a_Position, 1.0); v_TextureCoord = a_UV; vec3 u_LightLocation = vec3(0.0, 0.0, 1.0); vec3 u_LightDiffuse = vec3(0.85, 0.85, 0.85);vec3 u_LightAmbient = vec3(0.4, 0.4, 0.4);vec3 u_LightSpecular = vec3(0.75, 0.75, 0.75);vec3 vertexPosition= gl_Position.xyz; vec3 vectorPosition= (u_MVPMatrix * vec4(a_Vector+a_Position, 1.0)).xyz;vec3 normalVector = normalize(vectorPosition - vertexPosition);   vec3 vectorLight = normalize(-u_LightLocation);float factorDiffuse = abs(dot(vectorLight, normalVector));factorDiffuse = clamp(factorDiffuse, 0.0, 1.0);v_Diffuse = vec4(u_LightDiffuse * factorDiffuse, 1.0);    v_Ambient = vec4(u_LightAmbient, 1.0);vec3 eyeVector = normalize(vertexPosition - u_eyeLocation);vec3 reflection = normalize(2.0 * factorDiffuse * normalVector- vectorLight);float factorSpecular = abs(dot(reflection, eyeVector));factorSpecular = pow(factorSpecular, u_power); v_Specular = vec4(factorSpecular * u_LightSpecular, 1.0);}";
const vsSolid = 
"attribute vec3 a_Position; \
attribute vec3 a_Vector; \
attribute vec2 a_UV; \
uniform mat4 u_MVPMatrix; \
uniform mat4 u_MMatrix; \
uniform mat4 u_VMatrix; \
uniform vec3 u_eyeLocation; \
uniform vec3 u_LightLocation; \
uniform float u_power; \
uniform float u_trans; \
uniform vec4 u_MaterialDiffuse; \
uniform vec4 u_MaterialAmbient; \
uniform vec4 u_MaterialSpecular; \
uniform vec4 u_MaterialEmissive; \
uniform int u_LightType; \
varying vec4 v_FragColor; \
varying vec2 v_textureCoord; \
varying vec3 v_ClipPosition; \
void main() { \
    gl_Position = u_MVPMatrix * vec4(a_Position, 1.0); \
    v_textureCoord = a_UV; \
    vec3 vertexPosition= (u_VMatrix * u_MMatrix * vec4(a_Position, 1.0)).xyz; \
    vec3 vectorPosition= (u_VMatrix * u_MMatrix * vec4(a_Vector+a_Position, 1.0)).xyz; \
    vec3 normalVector = normalize(vectorPosition - vertexPosition); \
    vec3 eyePosition = (u_VMatrix * vec4(u_eyeLocation, 1.0)).xyz; \
    vec3 eyeVector = normalize(eyePosition - vertexPosition); \
    vec3 lightVector = u_LightLocation; \
    float diffuseFactor = clamp(abs(dot(normalVector, eyeVector)), 0.0, 1.0); \
    float reflectionFactor = abs(dot(lightVector, normalVector)); \
    vec3 reflection = normalize(2.0 * reflectionFactor * normalVector - lightVector); \
    float specularFactor = clamp(abs(dot(reflection, eyeVector)), 0.0, 1.0); \
    specularFactor = pow(specularFactor, u_power); \
    vec3 DiffuseColor = (u_MaterialDiffuse.xyz) * diffuseFactor * u_MaterialDiffuse.w; \
    vec3 AmbientColor = (u_MaterialAmbient.xyz) * u_MaterialAmbient.w; \
    vec3 SpecularColor = (u_MaterialSpecular.xyz) * specularFactor * u_MaterialSpecular.w; \
    vec3 EmissiveColor = (u_MaterialEmissive.xyz) * u_MaterialEmissive.w; \
    if (u_LightType == 0) { \
        v_FragColor = vec4(1.0, 1.0, 1.0, u_trans); \
    } else if (u_LightType == 1) { \
        v_FragColor = vec4(DiffuseColor + AmbientColor + SpecularColor + EmissiveColor, u_trans); \
    } \
    v_ClipPosition = (u_MMatrix * vec4(a_Position, 1.0)).xyz; \
}";

// Fragment shader program
// const fsSolid = "precision mediump float;varying vec4 v_Diffuse;varying vec4 v_Ambient;varying vec4 v_Specular;varying vec2 v_TextureCoord;uniform int u_FragmentTex;uniform vec4 u_MaterialDiffuse;uniform vec4 u_MaterialAmbient;uniform vec4 u_MaterialSpecular;uniform vec4 u_MaterialEmissive;uniform sampler2D u_TextureUnit;uniform vec4 u_PureColor;void main() {vec3 DiffuseColor = (u_MaterialDiffuse * v_Diffuse).xyz * u_MaterialDiffuse.w; vec3 AmbientColor = (u_MaterialAmbient * v_Ambient).xyz * u_MaterialAmbient.w; vec3 SpecularColor = (u_MaterialSpecular * v_Specular).xyz * u_MaterialSpecular.w;vec3 EmissiveColor = u_MaterialEmissive.xyz;vec4 color; if (u_FragmentTex == 0) {color = vec4(DiffuseColor + AmbientColor + SpecularColor + EmissiveColor, u_MaterialEmissive.w);} else if (u_FragmentTex == 1) {vec3 TexColor = (texture2D(u_TextureUnit, v_TextureCoord)).xyz;color = vec4(TexColor * (DiffuseColor + AmbientColor + SpecularColor + EmissiveColor), u_MaterialEmissive.w); } else {color = vec4(u_PureColor.xyz, u_MaterialEmissive.w);}gl_FragColor = color;}";
const fsSolid =
"precision mediump float; \
varying vec4 v_FragColor; \
varying vec2 v_textureCoord; \
varying vec3 v_ClipPosition; \
uniform int u_isClipping[3]; \
uniform vec4 u_clippingPlanes[3]; \
uniform int u_FragmentTex; \
uniform sampler2D u_TextureUnit; \
uniform vec4 u_PureColor; \
void main() { \
    for (int i = 0; i < 3; ++i) { \
        if ((u_isClipping[i] > 0) && (dot(v_ClipPosition, u_clippingPlanes[i].xyz) > u_clippingPlanes[i].w)) { \
            discard; \
        }\
    } \
    if (u_FragmentTex == 0) { \
        gl_FragColor = v_FragColor; \
    } else if (u_FragmentTex == 1) { \
        vec4 TexColor = texture2D(u_TextureUnit, v_textureCoord); \
        gl_FragColor = TexColor * v_FragColor; \
    } else { \
        gl_FragColor = vec4(u_PureColor.xyz, v_FragColor.w); \
    } \
}";



const vsPicture = "attribute vec3 a_Position;attribute vec2 a_UV;varying vec2 v_TextureCoord;void main() {v_TextureCoord = a_UV; gl_Position = vec4(a_Position, 1.0);}";

const fsPicture = "precision mediump float;varying vec2 v_TextureCoord;uniform sampler2D u_TextureUnit;void main() {gl_FragColor = texture2D(u_TextureUnit, v_TextureCoord);}";

const vsLine =
"attribute vec3 a_Position; \
uniform mat4 u_MVPMatrix; \
uniform mat4 u_MMatrix; \
varying vec3 v_ClipPosition; \
void main() { \
    gl_Position = u_MVPMatrix * vec4(a_Position, 1.0); \
    v_ClipPosition = (u_MMatrix * vec4(a_Position, 1.0)).xyz; \
}";

const fsLine =
"precision mediump float; \
varying vec3 v_ClipPosition; \
uniform vec3 u_LineColor; \
uniform int u_isClipping[3]; \
uniform vec4 u_clippingPlanes[3]; \
void main() { \
    for (int i = 0; i < 3; ++i) { \
        if ((u_isClipping[i] > 0) && (dot(v_ClipPosition, u_clippingPlanes[i].xyz) > u_clippingPlanes[i].w)) { \
            discard; \
        }\
    } \
    gl_FragColor = vec4(u_LineColor, 1.0);\
}";

const vsBase =
"attribute vec3 a_Position; \
uniform mat4 u_MVPMatrix; \
uniform vec4 u_MaterialEmissive; \
varying vec4 v_FragColor; \
void main() { \
    gl_Position = u_MVPMatrix * vec4(a_Position, 1.0); \
    v_FragColor = u_MaterialEmissive; \
}";

const fsBase =
"precision mediump float; \
varying vec4 v_FragColor; \
void main() { \
    gl_FragColor = v_FragColor; \
}";



function initSolidProgramInfo(gl) {
    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    let shaderProgram = initShaderProgram(gl, vsSolid, fsSolid);

    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.
    return {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'a_Position'),
            vertexVector: gl.getAttribLocation(shaderProgram, 'a_Vector'),
            vertexUV: gl.getAttribLocation(shaderProgram, 'a_UV'),
        },
        uniformLocations: {
            MVPMatrix: gl.getUniformLocation(shaderProgram, 'u_MVPMatrix'),
            MMatrix: gl.getUniformLocation(shaderProgram, 'u_MMatrix'),
            VMatrix: gl.getUniformLocation(shaderProgram, 'u_VMatrix'),
            eyeLocation: gl.getUniformLocation(shaderProgram, 'u_eyeLocation'),
            lightLocation: gl.getUniformLocation(shaderProgram, 'u_LightLocation'),
            power: gl.getUniformLocation(shaderProgram, 'u_power'),
            fragmentTex: gl.getUniformLocation(shaderProgram, 'u_FragmentTex'),
            materialDiffuse: gl.getUniformLocation(shaderProgram, 'u_MaterialDiffuse'),
            materialAmbient: gl.getUniformLocation(shaderProgram, 'u_MaterialAmbient'),
            materialSpecular: gl.getUniformLocation(shaderProgram, 'u_MaterialSpecular'),
            materialEmissive: gl.getUniformLocation(shaderProgram, 'u_MaterialEmissive'),
            trans: gl.getUniformLocation(shaderProgram, 'u_trans'),
            textureUnit: gl.getUniformLocation(shaderProgram, 'u_TextureUnit'),
            pureColor: gl.getUniformLocation(shaderProgram, 'u_PureColor'),
            lightType: gl.getUniformLocation(shaderProgram, 'u_LightType'),
            isClippingsX: gl.getUniformLocation(shaderProgram, 'u_isClipping[0]'),
            isClippingsY: gl.getUniformLocation(shaderProgram, 'u_isClipping[1]'),
            isClippingsZ: gl.getUniformLocation(shaderProgram, 'u_isClipping[2]'),
            clippingPlanesX: gl.getUniformLocation(shaderProgram, 'u_clippingPlanes[0]'),
            clippingPlanesY: gl.getUniformLocation(shaderProgram, 'u_clippingPlanes[1]'),
            clippingPlanesZ: gl.getUniformLocation(shaderProgram, 'u_clippingPlanes[2]'),

        },
    };
}

function initPictureProgramInfo(gl) {
    let shaderProgram = initShaderProgram(gl, vsPicture, fsPicture);

    return {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'a_Position'),
            vertexUV: gl.getAttribLocation(shaderProgram, 'a_UV'),
        },
        uniformLocations: {
            textureUnit: gl.getUniformLocation(shaderProgram, 'u_TextureUnit'),
        },
    };
}

function initLineProgramInfo(gl) {
    let shaderProgram = initShaderProgram(gl, vsLine, fsLine);

    return {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'a_Position'),
        },
        uniformLocations: {
            MVPMatrix: gl.getUniformLocation(shaderProgram, 'u_MVPMatrix'),
            MMatrix: gl.getUniformLocation(shaderProgram, 'u_MMatrix'),
            lineColor: gl.getUniformLocation(shaderProgram, 'u_LineColor'),
            isClippingsX: gl.getUniformLocation(shaderProgram, 'u_isClipping[0]'),
            isClippingsY: gl.getUniformLocation(shaderProgram, 'u_isClipping[1]'),
            isClippingsZ: gl.getUniformLocation(shaderProgram, 'u_isClipping[2]'),
            clippingPlanesX: gl.getUniformLocation(shaderProgram, 'u_clippingPlanes[0]'),
            clippingPlanesY: gl.getUniformLocation(shaderProgram, 'u_clippingPlanes[1]'),
            clippingPlanesZ: gl.getUniformLocation(shaderProgram, 'u_clippingPlanes[2]'),
        }
    };
}

function initBaseProgramInfo(gl) {
    let shaderProgram = initShaderProgram(gl, vsBase, fsBase);

    return {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'a_Position'),
        },
        uniformLocations: {
            MVPMatrix: gl.getUniformLocation(shaderProgram, 'u_MVPMatrix'),
            materialEmissive: gl.getUniformLocation(shaderProgram, 'u_MaterialEmissive'),
        }
    };
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        return null;
    }

    return shaderProgram;
}
  
//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}