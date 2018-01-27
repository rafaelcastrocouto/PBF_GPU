/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return gl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return setContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return generateProgram; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return createTexture2D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return bindTexture; });
/* unused harmony export createBuffer */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return createDrawFramebuffer; });

//=======================================================================================================
// Variables
//=======================================================================================================

let gl;
let contextReady = false;

//=======================================================================================================
// Public functions
//=======================================================================================================

//Generate the context using the provided canvas
const setContext = canvas => {
    gl = canvas.getContext('webgl2');

    //Load the extension to draw inside floating point textures
    gl.getExtension('EXT_color_buffer_float');

    //Load the extension to have linear interpolatino for floating point textures
    gl.getExtension("OES_texture_float_linear");

    contextReady = true;
}

//Generates a program from a vertex and fragment shader
const generateProgram = (vertexShader, fragmentShader) => {
    if(contextReady) {
        let program = gl.createProgram();
        gl.attachShader(program, getShader(vertexShader, 0));
        gl.attachShader(program, getShader(fragmentShader, 1));
        gl.linkProgram(program);
        if (! gl.getProgramParameter( program,  gl.LINK_STATUS)) {
            console.log(new Error("Could not generate the program"));
            return null;
        }
        return program;
    } else {
        console.log(new Error("Context not set yet"));
    }
}

//Function used to genarate an array buffer
const createBuffer = data => {
    if(contextReady) {
        let buffer =  gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(data),  gl.STATIC_DRAW);
        gl.bindBuffer(null);
        return buffer;
    } else {
        console.log(new Error("Context not set yet"));
    }
}

//Function used to generate an empty texture2D
let memory = 0;
const createTexture2D = (width, height, internalFormat, format, maxFilter, minFilter, type, data = null, wrap = gl.CLAMP_TO_EDGE) => {
    if(contextReady) {
        let texture = gl.createTexture();
        texture.width = width;
        texture.height = height;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, maxFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);

        gl.bindTexture(gl.TEXTURE_2D, null);

        if(type == gl.FLOAT) memory += width * height * 32 * 4;
        else memory += width * height * 8 * 4;

        let m = memory / 8; //<----- bits to bytes
        m /= 1000000; //<----- bytes to mega bytes

        // console.log("current GPU memory usage: " + m + " Mb");

        return texture;
    } else {
        console.log(new Error("Content not set yet"));
    }
}

//Function used for texture binding
const bindTexture = (programData, texture, texturePos) => {
    if(contextReady) {
        let textures = [gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, gl.TEXTURE3, gl.TEXTURE4, gl.TEXTURE5, gl.TEXTURE6, gl.TEXTURE7, gl.TEXTURE8, gl.TEXTURE9, gl.TEXTURE10, gl.TEXTURE11, gl.TEXTURE12, gl.TEXTURE13, gl.TEXTURE14];
        gl.activeTexture(textures[texturePos]);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(programData, texturePos);
    } else {
        console.log(new Error("Content not set yet"));
    }
}

//Function used to generate multiple drawing buffers
const createDrawFramebuffer = (_textures, useDepth = false, useStencil = false) => {
    if(contextReady) {

        //This allows to either have a single texture as input or an array of textures
        let textures = _textures.length == undefined ? [_textures] : _textures;

        let frameData = gl.createFramebuffer();
        let colorAttachments = [gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2, gl.COLOR_ATTACHMENT3, gl.COLOR_ATTACHMENT4, gl.COLOR_ATTACHMENT5, gl.COLOR_ATTACHMENT6];
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, frameData);
        frameData.width = textures[0].width;
        frameData.height = textures[0].height;
        let drawBuffers = [];
        for(let i = 0; i < textures.length; i ++) {
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, colorAttachments[i], gl.TEXTURE_2D, textures[i], 0);
            drawBuffers.push(colorAttachments[i]);
        }
        if(useDepth) {
            let renderbuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, textures[0].width, textures[0].height);
            if(useStencil) {
                gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_STENCIL,  textures[0].width, textures[0].height);
                gl.framebufferRenderbuffer( gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
            } else {
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
            }
        }
        gl.drawBuffers(drawBuffers);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

        let status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
        if (status != gl.FRAMEBUFFER_COMPLETE) {
            console.log('fb status: ' + status.toString(16));
            return null;
        }

        return frameData;
    } else {
        console.log(new Error("Content not set yet"));
    }
}




//=======================================================================================================
// Private functions
//=======================================================================================================

const getShader = (str, type) => {
    let shader;
    if (type == 1) {
        shader =  gl.createShader( gl.FRAGMENT_SHADER);
    } else  {
        shader =  gl.createShader( gl.VERTEX_SHADER);
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (! gl.getShaderParameter(shader,  gl.COMPILE_STATUS)) {
        console.log(new Error("Could not generate the program"));
        console.log( gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsColor; });
const fsColor = `#version 300 es
    precision highp float;

    in vec4 colorData;
    out vec4 color;

    void main() {
        color = colorData;
    }
`;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsQuad; });
const vsQuad = `#version 300 es

out vec2 uv;

void main() {
    int index = gl_VertexID;
    vec2 position = 2. * vec2(float(index % 2), float(index / 2)) - vec2(1.);
    uv = 0.5 * position + vec2(0.5);
    gl_Position = vec4(position, 0., 1.);
}

`;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsTextureColor; });
const fsTextureColor = `#version 300 es

    precision highp float;
    precision highp sampler2D;

    uniform sampler2D uTexture;
    uniform bool uForceAlpha;
    in vec2 uv;
    out vec4 color;

    void main() {
        color = texture(uTexture, uv);
        if(uForceAlpha) color.a = 1.;
    }

`;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__positionBasedFluids_pbf_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shaders_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__parameters_low_js__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__camera_js__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__paramsUI_js__ = __webpack_require__(42);









//=======================================================================================================
// Variables & Constants
//=======================================================================================================

//Set the canvas
let canvas = document.querySelector("#canvas3D");
const size = 400;
canvas.height = size;
canvas.width = canvas.height;
canvas.style.width = String(canvas.width) + "px";
canvas.style.height = String(canvas.height) + "px";
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["f" /* setContext */](canvas);

//Parameters for the simulation, this is done as a class to allow parameters modifications
//it also allows to have different parameters in different files.

//Function used to reset the simulation with the UI
let resetSimulation = ()=> __WEBPACK_IMPORTED_MODULE_1__positionBasedFluids_pbf_js__["c" /* reset */](particlesData.particlesPosition, particlesData.particlesVelocity);

let params = new __WEBPACK_IMPORTED_MODULE_4__parameters_low_js__["a" /* Params */](resetSimulation);
let particlesData = params.generateParticles();
Object(__WEBPACK_IMPORTED_MODULE_6__paramsUI_js__["a" /* startUIParams */])(params);


//Initiate the shaders programs
__WEBPACK_IMPORTED_MODULE_3__shaders_js__["g" /* init */]();

let camera = new __WEBPACK_IMPORTED_MODULE_5__camera_js__["a" /* Camera */](canvas);

//Generate random positions for the photons
let arrayRays = [];
for (let i = 0; i < params.totalPhotons; i++) arrayRays.push(Math.random(), Math.random(), Math.random(), i);


//=======================================================================================================
// Textures and framebuffers
//=======================================================================================================


//Textures
let tVoxelsHigh = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.expandedTextureSize, params.expandedTextureSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT);
let tVoxelsLow = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.lowResolutionTextureSize, params.lowResolutionTextureSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT);
let tScreenPositions = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.sceneSize, params.sceneSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT);
let tScreenNormals = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.sceneSize, params.sceneSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT);
let tFloorLines = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.floorTextureSize, params.floorTextureSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA8, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR_MIPMAP_LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].UNSIGNED_BYTE, null, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].REPEAT);
let tShadows = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.sceneSize, params.sceneSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA16F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].HALF_FLOAT);
let tShadows2 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.sceneSize, params.sceneSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA16F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].HALF_FLOAT);
let tRaysRandom = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.causticsSize, params.causticsSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(arrayRays));
let tPhotons1 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.causticsSize, params.causticsSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA16F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].HALF_FLOAT,);
let tPhotons2 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.causticsSize, params.causticsSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA16F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].HALF_FLOAT);
let tCaustics = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.causticsSize, params.causticsSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA16F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].HALF_FLOAT);
let tRadiance = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.causticsSize, params.causticsSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA16F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].HALF_FLOAT);
let tRadiance2 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.causticsSize, params.causticsSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA16F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].HALF_FLOAT);
let tScene = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.sceneSize, params.sceneSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA8, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR_MIPMAP_LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].UNSIGNED_BYTE);
let tScene2 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](params.sceneSize, params.sceneSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA8, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LINEAR_MIPMAP_LINEAR, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].UNSIGNED_BYTE);



//Framebuffers
let fbVoxelsHigh = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tVoxelsHigh, true);
let fbVoxelsLow = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tVoxelsLow);
let fbDeferred = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */]([tScreenPositions, tScreenNormals], true);
let fbFloorLines = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tFloorLines);
let fbShadowsData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */]([tShadows, tShadows2]);
let fbShadows = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tShadows);
let fbShadows2 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tShadows2);
let fbPhotons = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */]([tPhotons1, tPhotons2]);
let fbCaustics = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tCaustics);
let fbRadiance = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tRadiance);
let fbRadiance2 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tRadiance2);
let fbScene = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tScene);
let fbScene2 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tScene2);

arrayRays = null;


//=======================================================================================================
// Simulation and Rendering (Position based fluids. marching cubes and raytracing)
//=======================================================================================================

//Floor lines texture
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["d" /* floor */]);
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["d" /* floor */].backgroundColor, 1);
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, fbFloorLines);
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.floorTextureSize, params.floorTextureSize);
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindTexture(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, tFloorLines);
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].generateMipmap(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D);
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindTexture(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, null);


//Initiate the position based fluids solver
__WEBPACK_IMPORTED_MODULE_1__positionBasedFluids_pbf_js__["a" /* init */](particlesData.particlesPosition, particlesData.particlesVelocity, params.pbfResolution, params.voxelTextureSize, params.particlesTextureSize);

//Initiate the mesher generator
__WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["c" /* init */](params.resolution, params.expandedTextureSize, params.compressedTextureSize, params.compactTextureSize, params.compressedBuckets, params.expandedBuckets, params.depthLevels);


//Function used to render the particles in a framebuffer.
let renderParticles = (_x, _u, _width, _height, buffer, cleanBuffer = true) => {
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, buffer);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(_x, _u, _width, _height);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["m" /* renderParticles */]);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["m" /* renderParticles */].positionTexture, __WEBPACK_IMPORTED_MODULE_1__positionBasedFluids_pbf_js__["b" /* positionTexture */], 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["m" /* renderParticles */].scale, params.pbfResolution);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniformMatrix4fv(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["m" /* renderParticles */].cameraMatrix, false, camera.cameraTransformMatrix);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniformMatrix4fv(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["m" /* renderParticles */].perspectiveMatrix, false, camera.perspectiveMatrix);
    if (cleanBuffer) __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT | __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_TEST);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, __WEBPACK_IMPORTED_MODULE_1__positionBasedFluids_pbf_js__["d" /* totalParticles */]);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_TEST);
}

//Function used to check the textures
let checkTexture = (texture, _x, _u, _width, _height, buffer, cleanBuffer = true, forceAlpha = false) => {
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, buffer);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(_x, _u, _width, _height);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["o" /* texture */]);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["o" /* texture */].texture, texture, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["o" /* texture */].forceAlpha, forceAlpha);
    if (cleanBuffer) __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
}

//Function used to evaluate the fsRadiance
let evaluateRadiance = () => {
    
    //Caustics fsRadiance
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["j" /* radiance */]);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["j" /* radiance */].radius, params.radianceRadius);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["j" /* radiance */].radiancePower, params.radiancePower);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.causticsSize, params.causticsSize);

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, fbRadiance);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["j" /* radiance */].photonTexture, tCaustics, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform2f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["j" /* radiance */].axis, 0, 1 / params.causticsSize);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
    
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, fbRadiance2);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform2f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["j" /* radiance */].axis, 1 / params.causticsSize, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["j" /* radiance */].photonTexture, tRadiance, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
    
}

__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].cullFace(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRONT);
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].blendEquation(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FUNC_ADD);
__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].blendFunc(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].ONE, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].ONE);

let currentFrame = 0;
let render = () => {

    requestAnimationFrame(render);

    if(!params.lockCamera) camera.updateCamera(params.FOV, 1, params.cameraDistance);

    //Calculate the light position
    let lightPos = {x: 0, y: 0, z: 0};
    let lAlpha = params.lightAlpha * Math.PI / 180;
    let lBeta = params.lightBeta * Math.PI / 180;
    let r = params.lightDistance;
    let s = Math.sin(lAlpha);
    lightPos.x = r * s * Math.cos(lBeta) + 0.5;
    lightPos.y = r * Math.cos(lAlpha);
    lightPos.z = r * s * Math.sin(lBeta) + 0.5;

    let acceleration = {
        x: 0 * Math.sin(currentFrame * Math.PI / 180),
        y: -10,
        z: 0 * Math.cos(currentFrame * Math.PI / 180)
    }


    if (params.updateSimulation) {

        //Update the simulation
        __WEBPACK_IMPORTED_MODULE_1__positionBasedFluids_pbf_js__["e" /* updateFrame */](acceleration, params.deltaTime, params.constrainsIterations);

        currentFrame++;
    }

    //Generate the mesh from the simulation particles
    if(params.updateMesh) __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["b" /* generateMesh */](__WEBPACK_IMPORTED_MODULE_1__positionBasedFluids_pbf_js__["b" /* positionTexture */], __WEBPACK_IMPORTED_MODULE_1__positionBasedFluids_pbf_js__["d" /* totalParticles */], params.pbfResolution, params.particleSize, params.blurSteps, params.range, params.maxCells, params.fastNormals);


    //Ray tracing section
    if(params.updateImage) {
        let activeMCells = Math.ceil(params.maxCells * params.expandedTextureSize * params.expandedTextureSize / 100);


        //Generate the high resolution grid for the ray tracer
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["f" /* highResGrid */]);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["f" /* highResGrid */].verticesTexture, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["g" /* tVoxelsOffsets */], 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbVoxelsHigh);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.expandedTextureSize, params.expandedTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT | __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_TEST);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, 15 * activeMCells);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_TEST);


        //Generate the low resolution grid for the ray tracer
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["h" /* lowResGrid */]);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["h" /* lowResGrid */].positionTexture, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["f" /* tTriangles */], 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["h" /* lowResGrid */].gridPartitioning, 1 / params.lowResolutionTextureSize, params.lowGridPartitions, params.lowSideBuckets);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.lowResolutionTextureSize, params.lowResolutionTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbVoxelsLow);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, 15 * activeMCells);


        //Render the triangles to save positions and normals for screen space raytracing.
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["c" /* deferred */]);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbDeferred);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clearColor(0, 0, 0, 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT | __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.sceneSize, params.sceneSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["c" /* deferred */].textureTriangles, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["f" /* tTriangles */], 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["c" /* deferred */].textureNormals, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["e" /* tNormals */], 1);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniformMatrix4fv(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["c" /* deferred */].cameraMatrix, false, camera.cameraTransformMatrix);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniformMatrix4fv(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["c" /* deferred */].perspectiveMatrix, false, camera.perspectiveMatrix);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_TEST);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].CULL_FACE);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLES, 0, 15 * activeMCells);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].CULL_FACE);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_TEST);


        if (params.calculateShadows) {

            //Calculate the shadows for the floor
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbShadowsData);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clearColor(0, 0, 0, 0);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT | __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_BUFFER_BIT);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.sceneSize, params.sceneSize);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */]);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].textureTriangles, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["f" /* tTriangles */], 0);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].textureNormals, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["e" /* tNormals */], 1);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].potentialTexture, tVoxelsHigh, 2);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].lowResPotential, tVoxelsLow, 3);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].iterations, params.maxIterations);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].maxStepsPerBounce, params.maxStepsPerBounce);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].texture3DData, params.expandedTextureSize, params.resolution, params.expandedBuckets);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].voxelLowData, tVoxelsLow.size, params.lowGridPartitions, params.lowSideBuckets);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform4f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].lightData, lightPos.x, lightPos.y, lightPos.z, params.lightIntensity);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].scaler, params.floorScale);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].size, params.sceneSize);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["e" /* floorShadows */].compactTextureSize, params.compactTextureSize);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);


            //Evaluate the bounding box of the shadow for the fsCaustics
            let levels = Math.ceil(Math.log(params.sceneSize) / Math.log(2));
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["n" /* shadowBoundingBox */]);
            for (let i = 0; i < levels; i++) {
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["a" /* fbPyramid */][levels - i - 1]);
                let size = Math.pow(2, levels - 1 - i);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, size, size);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["n" /* shadowBoundingBox */].size, Math.pow(2, i + 1) / params.sceneSize);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["n" /* shadowBoundingBox */].potentialTexture, i == 0 ? tShadows2 : __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["d" /* tLevels */][levels - i], 0);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
            }


            //Blur for the shadows
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["a" /* blurShadow */]);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["a" /* blurShadow */].radius, params.blurShadowsRadius);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.sceneSize, params.sceneSize);

            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, fbShadows2);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["a" /* blurShadow */].shadowTexture, tShadows, 0);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform2f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["a" /* blurShadow */].axis, 0, 1 / params.sceneSize);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);

            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, fbShadows);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["a" /* blurShadow */].shadowTexture, tShadows2, 0);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform2f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["a" /* blurShadow */].axis, 1 / params.sceneSize, 0);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);

        }

        let photonHeight = Math.ceil(params.causticsSize * params.photonsToEmit / params.photonSteps);

        //Calculate the caustics
        if (params.calculateCaustics) {

            if (params.causticSteps < params.photonSteps) {

                //Caustics photon map saved in a plane
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */]);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].boundingBoxTexture, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["d" /* tLevels */][0], 0);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].randomTexture, tRaysRandom, 1);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].textureTriangles, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["f" /* tTriangles */], 2);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].textureNormals, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["e" /* tNormals */], 3);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].potentialTexture, tVoxelsHigh, 4);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].lowResPotential, tVoxelsLow, 5);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].lightPosition, lightPos.x, lightPos.y, lightPos.z);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].absorption, 1. - params.absorptionColor[0] / 255, 1. - params.absorptionColor[1] / 255, 1. - params.absorptionColor[2] / 255);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].texture3DData, params.expandedTextureSize, params.resolution, params.expandedBuckets);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].voxelLowData, params.lowResolutionTextureSize, params.lowGridPartitions, params.lowSideBuckets);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].lightColor, params.lightColor[0] / 255, params.lightColor[1] / 255, params.lightColor[2] / 255);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].reflectionPhotons, params.reflectionPhotons);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].scale, params.floorScale);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].photonEnergy, params.photonEnergy);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].refract, params.refraction);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].distanceAbsorptionScale, params.distanceAbsorptionScale);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].refractions, params.refractions);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].reflections, params.reflections);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].iterations, params.maxIterations);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].maxStepsPerBounce, params.maxStepsPerBounce);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].dispersion, params.dispersion);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["b" /* caustics */].compactTextureSize, params.compactTextureSize);


                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbPhotons);
                if (params.causticSteps == 0) {
                    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clearColor(0, 0, 0, 0);
                    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
                }
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.causticsSize, params.causticsSize);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].SCISSOR_TEST);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].scissor(0, photonHeight * params.causticSteps, params.causticsSize, photonHeight);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].SCISSOR_TEST);
                params.causticSteps++;
            }

            else {

                // calculateCaustics = false;
                params.causticSteps = 0;

                //allocate the calculated vsPhotons on the fsCaustics texture
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["i" /* photonsGather */]);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["i" /* photonsGather */].photonSize, params.photonSize);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["i" /* photonsGather */].positions, tPhotons1, 0);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["i" /* photonsGather */].colors, tPhotons2, 1);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbCaustics);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clearColor(0, 0, 0, 0);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.causticsSize, params.causticsSize);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].BLEND);
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, Math.floor(params.totalPhotons * params.photonsToEmit));
                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].BLEND);

                evaluateRadiance();

            }
        }

        //Render the triangles using the raytracer
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, fbScene);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clearColor(0, 0, 0, 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.sceneSize, params.sceneSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */]);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].textureTriangles, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["f" /* tTriangles */], 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].textureNormals, __WEBPACK_IMPORTED_MODULE_2__marchingCubes_mesher_js__["e" /* tNormals */], 1);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].potentialTexture, tVoxelsHigh, 2);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].lowResPotential, tVoxelsLow, 3);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].positions, tScreenPositions, 4);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].normals, tScreenNormals, 5);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].floorTexture, tFloorLines, 6);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].shadowTexture, tShadows, 7);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].radianceTexture, tRadiance2, 8);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].eyeVector, camera.position[0], camera.position[1], camera.position[2]);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].refract, params.refraction);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].energyDecay, 1. - params.energyDecay);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].iterations, params.maxIterations);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].refractions, params.refractions);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].reflections, params.reflections);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].absorption, 1. - params.absorptionColor[0] / 255, 1. - params.absorptionColor[1] / 255, 1. - params.absorptionColor[2] / 255);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].maxStepsPerBounce, params.maxStepsPerBounce);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].distanceAbsorptionScale, params.distanceAbsorptionScale);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].texture3DData, params.expandedTextureSize, params.resolution, params.expandedBuckets);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].voxelLowData, tVoxelsLow.size, params.lowGridPartitions, params.lowSideBuckets);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform4f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].shadeData, params.kS, params.kD, params.kA, params.shinny);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].backgroundColor, params.backgroundColor);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform4f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].lightData, lightPos.x, lightPos.y, lightPos.z, params.lightIntensity);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].shadowIntensity, params.shadowIntensity);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].scaler, params.floorScale);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].compactTextureSize, params.compactTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].killRay, params.killRay);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].lightColor, params.lightColor[0] / 255, params.lightColor[1] / 255, params.lightColor[2] / 255);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["k" /* raytracer */].materialColor, params.materialColor[0] / 255, params.materialColor[1] / 255, params.materialColor[2] / 255);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);

        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindTexture(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, tScene);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].generateMipmap(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindTexture(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, null);


        //Make the composition
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, fbScene2);
        let bg = params.backgroundColor;
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clearColor(bg, bg, bg, 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, params.sceneSize, params.sceneSize);


        //Rendering the floor with shadows and caustics
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */]);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].floorTexture, tFloorLines, 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].shadowTexture, tShadows, 1);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].radianceTexture, tRadiance2, 2);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniformMatrix4fv(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].cameraMatrix, false, camera.cameraTransformMatrix);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniformMatrix4fv(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].perspectiveMatrix, false, camera.perspectiveMatrix);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].backgroundColor, params.backgroundColor);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].scaler, 500);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].scaleShadow, params.floorScale);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].shadowIntensity, params.shadowIntensity);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform4f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].lightData, lightPos.x, lightPos.y, lightPos.z, params.lightIntensity);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["l" /* renderFloor */].lightColor, params.lightColor[0] / 255, params.lightColor[1] / 255, params.lightColor[2] / 255);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);


        //Render the raytraced image on top of the plane.
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["o" /* texture */]);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(__WEBPACK_IMPORTED_MODULE_3__shaders_js__["o" /* texture */].forceAlpha, false);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](__WEBPACK_IMPORTED_MODULE_3__shaders_js__["o" /* texture */].dataTexture, tScene, 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].BLEND);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].blendFunc(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].SRC_ALPHA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].ONE_MINUS_SRC_ALPHA);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].BLEND);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clearColor(0, 0, 0, 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].blendEquation(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FUNC_ADD);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].blendFuncSeparate(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].ONE, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].ONE, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].ONE, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].ONE);

        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindTexture(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, tScene2);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].generateMipmap(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindTexture(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, null);
    }

    //Check the simulation
    //renderParticles(0, 0, 700, 700, null, true);

    //Checking texture results
    //checkTexture(tScene2, 700, 0, 700, 700, null, false, true);
    checkTexture(tScene2, 0, 0, size, size, null, false, true);
};

render();


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return updateFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return reset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return totalParticles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return positionTexture; });
/* unused harmony export velocityTexture */
/* unused harmony export voxelsTexture */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__neightborhoodSearch_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shaders_PBF_vs_applyForces_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shaders_PBF_vs_integrateVelocity_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shaders_PBF_vs_calculateConstrains_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shaders_PBF_vs_calculateDisplacements_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shaders_PBF_vs_calculateViscosity_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shaders_general_vs_quad_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__shaders_general_fs_simpleTexture_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__shaders_general_fs_simpleColor_js__ = __webpack_require__(1);




//Shaders










//=======================================================================================================
// Variables & Constants
//=======================================================================================================

let particlesTextureSize;
let bucketSize;
let voxelsTextureSize; // Math.ceil(Math.sqrt(Math.pow(bucketSize, 3)));


//Shader programs
let textureProgram,
    predictPositionsProgram,
    integrateVelocityProgram,
    calculateConstrainsProgram,
    calculateDisplacementsProgram,
    calculateViscosityProgram;


//Textures used.
let positionTexture,
    velocityTexture,
    pbfTexture1,
    pbfTexture2,
    voxelsTexture;


//Buffers used.
let positionBuffer,
    velocityBuffer,
    pbfBuffer1,
    pbfBuffer2,
    voxelsBuffer;


let restDensity = 1000;
let searchRadius = 1.8;
let relaxParameter = .05;  //<<<------------------------------------------- this is very sensible
let tensileConstant = 40;
let tensilePower = 4;
let tensileDistanceMultiplier = 0.3;
let viscosity = 0.1;
let totalParticles = 0;


let particleMass = restDensity; //This comes from mass = density * volume / totalParticles ===> 1000 * bucketSize^3 / bucketSize^3
let wConstant = (315 / (64 * Math.PI * Math.pow(searchRadius, 9)));
let densityConstant = wConstant * particleMass;
let gradWconstant = -45 / (Math.PI * Math.pow(searchRadius, 6));
let viscosityConstant = viscosity * 45 / (Math.PI * Math.pow(searchRadius, 6) * restDensity);
let tensileDistance = tensileDistanceMultiplier * searchRadius;


//=======================================================================================================
// This is used to initiate the simulator
//=======================================================================================================

let init = (particlesPosition, particlesVelocity, _bucketSize, _voxelsTextureSize, _particlesTextureSize) => {

    bucketSize = _bucketSize;
    voxelsTextureSize = _voxelsTextureSize;
    particlesTextureSize = _particlesTextureSize;
    totalParticles = particlesPosition.length / 4.;


    //This fills the rest of buffer to generate the texture
    for(let i = totalParticles; i < particlesTextureSize * particlesTextureSize; i ++) {
        particlesPosition.push(0, 0, 0, 0);
        particlesVelocity.push(0, 0, 0, 0);
    }

    console.log("===============================");
    console.log("Position Based Fluids simulator:")
    console.log("total particles are: " + totalParticles);
    console.log("particles texture size is: " + particlesTextureSize);
    console.log("neighbors texture size is: " + voxelsTextureSize);
    console.log("===============================");

    textureProgram                                          = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_7__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_8__shaders_general_fs_simpleTexture_js__["a" /* fsTextureColor */]);
    textureProgram.texture                                  = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(textureProgram, "uTexture");

    predictPositionsProgram                                 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_PBF_vs_applyForces_js__["a" /* predictPositions */], __WEBPACK_IMPORTED_MODULE_9__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
    predictPositionsProgram.positionTexture                 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(predictPositionsProgram, "uTexturePosition");
    predictPositionsProgram.velocityTexture                 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(predictPositionsProgram, "uTextureVelocity");
    predictPositionsProgram.deltaTime                       = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(predictPositionsProgram, "uDeltaTime");
    predictPositionsProgram.acceleration                    = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(predictPositionsProgram, "uAcceleration");


    integrateVelocityProgram                                = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_3__shaders_PBF_vs_integrateVelocity_js__["a" /* integrateVelocity */], __WEBPACK_IMPORTED_MODULE_9__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
    integrateVelocityProgram.positionTexture                = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(integrateVelocityProgram, "uTexturePosition");
    integrateVelocityProgram.positionOldTexture             = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(integrateVelocityProgram, "uTexturePositionOld");
    integrateVelocityProgram.deltaTime                      = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(integrateVelocityProgram, "uDeltaTime");


    calculateConstrainsProgram                              = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_4__shaders_PBF_vs_calculateConstrains_js__["a" /* calculateConstrains */], __WEBPACK_IMPORTED_MODULE_9__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
    calculateConstrainsProgram.positionTexture              = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uTexturePosition");
    calculateConstrainsProgram.neighbors                    = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uNeighbors");
    calculateConstrainsProgram.bucketData                   = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uBucketData");
    calculateConstrainsProgram.restDensity                  = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uRestDensity");
    calculateConstrainsProgram.searchRadius                 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uSearchRadius");
    calculateConstrainsProgram.kernelConstant               = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uKernelConstant");
    calculateConstrainsProgram.relaxParameter               = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uRelaxParameter");
    calculateConstrainsProgram.gradientKernelConstant       = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uGradientKernelConstant");


    calculateDisplacementsProgram                           = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_5__shaders_PBF_vs_calculateDisplacements_js__["a" /* calculateDisplacements */], __WEBPACK_IMPORTED_MODULE_9__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
    calculateDisplacementsProgram.positionTexture           = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uTexturePosition");
    calculateDisplacementsProgram.neighbors                 = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uNeighbors");
    calculateDisplacementsProgram.constrains                = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uConstrains");
    calculateDisplacementsProgram.bucketData                = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uBucketData");
    calculateDisplacementsProgram.restDensity               = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uRestDensity");
    calculateDisplacementsProgram.searchRadius              = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uSearchRadius");
    calculateDisplacementsProgram.gradientKernelConstant    = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uGradientKernelConstant");
    calculateDisplacementsProgram.tensileConstant           = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uTensileK");
    calculateDisplacementsProgram.tensilePower              = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uTensilePower");
    calculateDisplacementsProgram.tensileDistance           = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uTensileDistance");


    calculateViscosityProgram                               = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_6__shaders_PBF_vs_calculateViscosity_js__["a" /* calculateViscosity */], __WEBPACK_IMPORTED_MODULE_9__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
    calculateViscosityProgram.positionTexture               = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uTexturePosition");
    calculateViscosityProgram.velocityTexture               = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uTextureVelocity");
    calculateViscosityProgram.neighbors                     = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uNeighbors");
    calculateViscosityProgram.bucketData                    = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uBucketData");
    calculateViscosityProgram.restDensity                   = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uRestDensity");
    calculateViscosityProgram.searchRadius                  = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uSearchRadius");
    calculateViscosityProgram.kernelConstant                = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uKernelConstant");


    //Required textures for simulations
    positionTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](particlesTextureSize, particlesTextureSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(particlesPosition));
    velocityTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](particlesTextureSize, particlesTextureSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(particlesVelocity));
    pbfTexture1     = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](particlesTextureSize, particlesTextureSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT, null);
    pbfTexture2     = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](particlesTextureSize, particlesTextureSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT, null);
    voxelsTexture   = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](voxelsTextureSize, voxelsTextureSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT, null);


    //Corresponding buffers
    positionBuffer = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](positionTexture);
    velocityBuffer = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](velocityTexture);
    pbfBuffer1     = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](pbfTexture1);
    pbfBuffer2     = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](pbfTexture2);
    voxelsBuffer   = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](voxelsTexture, true, true);
}


//Fucntion used to reset the simulation
let reset = (particlesPositions, particlesVelocities) => {

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindTexture(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, positionTexture);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].texImage2D(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, 0, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, particlesTextureSize, particlesTextureSize, 0, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(particlesPositions));
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindTexture(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, null);

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindTexture(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, velocityTexture);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].texImage2D(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, 0, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, particlesTextureSize, particlesTextureSize, 0, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(particlesVelocities));
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindTexture(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TEXTURE_2D, null);
}


//=======================================================================================================
// Simulation and Rendering (Particle Based Fluids
//=======================================================================================================

let updateFrame = (acceleration, deltaTime, constrainsIterations) => {

    //Apply external forces (gravity)
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, pbfBuffer1);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(predictPositionsProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(predictPositionsProgram.deltaTime, deltaTime);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(predictPositionsProgram.acceleration, acceleration.x, acceleration.y, acceleration.z);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](predictPositionsProgram.positionTexture, positionTexture, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](predictPositionsProgram.velocityTexture, velocityTexture, 1);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);


    //Obtain the neighbors
    Object(__WEBPACK_IMPORTED_MODULE_1__neightborhoodSearch_js__["a" /* searchNeighbords */])(pbfTexture1, voxelsBuffer, totalParticles, bucketSize);


    //Solve the constrains
    for(let i = 0; i < constrainsIterations; i ++) {

        //Calculate the lambdas
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, pbfBuffer2);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(calculateConstrainsProgram);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](calculateConstrainsProgram.positionTexture, pbfTexture1, 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](calculateConstrainsProgram.neighbors, voxelsTexture, 1);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(calculateConstrainsProgram.bucketData, voxelsTexture.width, bucketSize, voxelsTexture.width / bucketSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateConstrainsProgram.restDensity, restDensity);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateConstrainsProgram.kernelConstant, densityConstant);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateConstrainsProgram.gradientKernelConstant, gradWconstant);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateConstrainsProgram.searchRadius, searchRadius);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateConstrainsProgram.relaxParameter, relaxParameter);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);


        //Calculate displacements
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, velocityBuffer);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(calculateDisplacementsProgram);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](calculateDisplacementsProgram.positionTexture, pbfTexture1, 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](calculateDisplacementsProgram.neighbors, voxelsTexture, 1);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](calculateDisplacementsProgram.constrains, pbfTexture2, 2);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(calculateDisplacementsProgram.bucketData, voxelsTexture.width, bucketSize, voxelsTexture.width / bucketSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.restDensity, restDensity);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.searchRadius, searchRadius);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.gradientKernelConstant, gradWconstant);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.tensileConstant, tensileConstant);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.tensileDistance, tensileDistance);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.tensilePower, tensilePower);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);


        //Update data between helper textures
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, pbfBuffer1);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(textureProgram);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](textureProgram.texture, velocityTexture, 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);

    }

    //Integrate the velocity
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, pbfBuffer2);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(integrateVelocityProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(integrateVelocityProgram.deltaTime, deltaTime);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](integrateVelocityProgram.positionTexture, pbfTexture1, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](integrateVelocityProgram.positionOldTexture, positionTexture, 1);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);


    //Apply viscosity
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, velocityBuffer);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(calculateViscosityProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](calculateViscosityProgram.positionTexture, pbfTexture1, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](calculateViscosityProgram.velocityTexture, pbfTexture2, 1);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](calculateViscosityProgram.neighbors, voxelsTexture, 2);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(calculateViscosityProgram.bucketData, voxelsTexture.width, bucketSize, voxelsTexture.width / bucketSize);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateViscosityProgram.restDensity, restDensity);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateViscosityProgram.searchRadius, searchRadius);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(calculateViscosityProgram.kernelConstant, viscosityConstant);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);


    //Update the positions.
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, positionBuffer);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(textureProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](textureProgram.texture, pbfTexture1, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
}


//=======================================================================================================
// Public variables and functions
//=======================================================================================================




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return searchNeighbords; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shaders_neighbors_vs_neighbors_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shaders_general_fs_simpleColor_js__ = __webpack_require__(1);
/*
Module used to allocate the neighborhood of a particle, based from the original idea of Harada,
based on https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch29.html
 */






let started = false;
let searchProgram;

let searchNeighbords = (inputTexture, _outputBuffers, totalParticles, bucketSize) => {

    //This allows to either have a single framebuffer as input or an array
    let outputBuffers = _outputBuffers.length == undefined ? [_outputBuffers] : _outputBuffers;

    if(!started) {
        searchProgram = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_1__shaders_neighbors_vs_neighbors_js__["a" /* vsNeighbors */], __WEBPACK_IMPORTED_MODULE_2__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
        searchProgram.positionTexture =     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(searchProgram, "uTexPositions");
        searchProgram.bucketData =          __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(searchProgram, "uBucketData");
        searchProgram.totalParticles =      __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(searchProgram, "uTotalParticles");
        started = true;
    }

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, outputBuffers[0]);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, outputBuffers[0].width, outputBuffers[0].height);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clearColor(0.0, 0.0, 0.0, 0.0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT | __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].STENCIL_TEST);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_TEST);

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(searchProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](searchNeighbords.positionTexture, inputTexture, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(searchProgram.bucketData, outputBuffers[0].width, bucketSize, outputBuffers[0].width / bucketSize);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(searchProgram.totalParticles, totalParticles);

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].colorMask(true, false, false, false);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].depthFunc(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LESS);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].colorMask(false, true, false, false);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].depthFunc(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].GREATER);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].stencilFunc(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].GREATER, 1, 1);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].stencilOp(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].KEEP, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].KEEP, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].INCR);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].colorMask(false, false, true, false);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].colorMask(false, false, false, true);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

    if(outputBuffers.length > 1) {
        for(let i = 1; i < outpufBuffer.length; i ++) {
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, outputBuffers[i]);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);

            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].colorMask(true, false, false, false);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].colorMask(false, true, false, false);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].colorMask(false, false, true, false);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].colorMask(false, false, false, true);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);
        }
    }

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].colorMask(true, true, true, true);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].STENCIL_TEST);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DEPTH_TEST);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].depthFunc(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].LESS);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, null);

}



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsNeighbors; });
/*
Shader used to position the particle inside a faked 3d texture
the index is used as color to save it in the corresponding bucket/voxel.
Up to four indexes can be saved in the corresponding fragment (one for each channel).

Layering in the faked 3d texture is done in the "Y" axis, this allows to align the gravity with that axis for fluid simulations
 */

const vsNeighbors = `#version 300 es

    precision highp float;
    uniform sampler2D uTexPositions;
    uniform vec3 uBucketData; //data is defined as: x = textureSize, y = bucketSize, z = amount of buckets per size;
    uniform float uTotalParticles;
    out vec4 colorData;

    void main() {

        int size = textureSize(uTexPositions, 0).x;
        float fSize = float(size);

        //Positions are in the range (x, y, z) => [0 - 128)
        vec3 gridPosition = floor(texture(uTexPositions, vec2(float(gl_VertexID % size) + 0.5, (floor(float(gl_VertexID) + 0.5) / fSize)) / fSize).rgb);

        //This voxel position calculation serializes the 3D position relative to the texture size, it's independent of a mayor axis
        //float gridIndex = dot(gridPosition, vec3(1., uBucketData.y, uBucketData.y * uBucketData.y));
        //vec2 voxelPosition = 2. * ((vec2(mod(gridIndex, uBucketData.x), floor(gridIndex / uBucketData.x)) + vec2(0.5)) / uBucketData.x) - vec2(1.);

        //This voxel position is relative to the mayor (depth) axis, good for visualization.
        vec2 voxelPosition =  2. * (gridPosition.zy + uBucketData.y * vec2(mod(gridPosition.x, uBucketData.z), floor(gridPosition.x / uBucketData.z)) + vec2(0.5)) / uBucketData.x - vec2(1.);

        if(gridPosition.y < 0.) voxelPosition = vec2(1e10);
        gl_Position = vec4(voxelPosition, float(gl_VertexID) / uTotalParticles, 1.0);

        colorData = vec4(floor(float(gl_VertexID)));
        gl_PointSize = 1.;

    }

`;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return predictPositions; });
const predictPositions = `#version 300 es

precision highp sampler2D;
precision highp float;

uniform sampler2D uTexturePosition;
uniform sampler2D uTextureVelocity;
uniform float uDeltaTime;
uniform vec3 uAcceleration;

out vec4 colorData;

void main() {

    int tSize = textureSize(uTexturePosition, 0).x;
    float textureSize = float(tSize);
    vec2 index = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;
    gl_Position = vec4(2. * index - vec2(1.), 0., 1.);
    gl_PointSize = 1.;

    colorData = vec4(texture(uTexturePosition, index).rgb + (texture(uTextureVelocity, index).rgb + uAcceleration * uDeltaTime) * uDeltaTime, 1.);
}

`;




/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return integrateVelocity; });
const integrateVelocity = `#version 300 es

precision highp sampler2D;
precision highp float;

uniform sampler2D uTexturePosition;
uniform sampler2D uTexturePositionOld;
uniform float uDeltaTime;

out vec4 colorData;

const float EPSILON = 0.000001;

void main() {

    int tSize = textureSize(uTexturePosition, 0).x;
    float textureSize = float(tSize);
    vec2 index = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;
    gl_Position = vec4(2. * index - vec2(1.), 0., 1.);
    gl_PointSize = 1.;

    colorData = vec4((texture(uTexturePosition, index).rgb - texture(uTexturePositionOld, index).rgb) / max(uDeltaTime, EPSILON), 1.);

}

`;




/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return calculateConstrains; });
const calculateConstrains = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform sampler2D uTexturePosition;
uniform sampler2D uNeighbors;
uniform vec3 uBucketData;
uniform float uSearchRadius;
uniform float uKernelConstant;
uniform float uRelaxParameter;
uniform float uGradientKernelConstant;
uniform float uRestDensity;

out vec4 colorData;
vec3 offsets[27];
float texturePositionSize;
float h2;

void addToSum(in vec3 particlePosition, in float neighborIndex, inout float density, inout float sum_k_grad_Ci, inout vec3 grad_pi_Ci) {

    vec3 distance = particlePosition - texture(uTexturePosition, vec2(mod(neighborIndex, texturePositionSize) + 0.5, floor(neighborIndex / texturePositionSize) + 0.5) / texturePositionSize).rgb;
    float r = length(distance);

    if(r < uSearchRadius) {

        float partial = h2 - dot(distance, distance);
        density += uKernelConstant * partial * partial * partial;

        if(r > 0.) {
            partial = uSearchRadius - r;
            vec3 grad_pk_Ci = uGradientKernelConstant * partial * partial * normalize(distance) / uRestDensity;
            sum_k_grad_Ci += dot(grad_pk_Ci, grad_pk_Ci);
            grad_pi_Ci += grad_pk_Ci;
        }
    }
}

void main() {

    texturePositionSize = float(textureSize(uTexturePosition, 0).x);
    h2 = uSearchRadius * uSearchRadius;

    offsets[0] = vec3(-1., -1., -1.);
    offsets[1] = vec3(-1., -1., 0.);
    offsets[2] = vec3(-1., -1., 1.);
    offsets[3] = vec3(-1., 0., -1.);
    offsets[4] = vec3(-1., 0., 0.);
    offsets[5] = vec3(-1., 0., 1.);
    offsets[6] = vec3(-1., 1., -1.);
    offsets[7] = vec3(-1., 1., 0.);
    offsets[8] = vec3(-1., 1., 1.);
    offsets[9] = vec3(0., -1., -1.);
    offsets[10] = vec3(0., -1., 0.);
    offsets[11] = vec3(0., -1., 1.);
    offsets[12] = vec3(0., 0., -1.);
    offsets[13] = vec3(0., 0., 0.);
    offsets[14] = vec3(0., 0., 1.);
    offsets[15] = vec3(0., 1., -1.);
    offsets[16] = vec3(0., 1., 0.);
    offsets[17] = vec3(0., 1., 1.);
    offsets[18] = vec3(1., -1., -1.);
    offsets[19] = vec3(1., -1., 0.);
    offsets[20] = vec3(1., -1., 1.);
    offsets[21] = vec3(1., 0., -1.);
    offsets[22] = vec3(1., 0., 0.);
    offsets[23] = vec3(1., 0., 1.);
    offsets[24] = vec3(1., 1., -1.);
    offsets[25] = vec3(1., 1., 0.);
    offsets[26] = vec3(1., 1., 1.);

    int tSize = textureSize(uTexturePosition, 0).x;
    float textureSize = float(tSize);
    vec2 index = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;
    gl_Position = vec4(2. * index - vec2(1.), 0., 1.);
    gl_PointSize = 1.;

    //Particle position goes from [0 - 128);
    vec3 particlePosition = texture(uTexturePosition, index).rgb;
    vec3 gridPosition = floor(particlePosition);

    float density = 0.;
    float densityConstrain = 0.;
    float lambdaPressure = 0.;
    float sum_k_grad_Ci = 0.;
    vec3 grad_pi_Ci = vec3(0.);

    for(int i = 0; i < 27; i ++) {

        vec3 neighborsVoxel = gridPosition + offsets[i];
        vec2 voxelsIndex =  (neighborsVoxel.zy + uBucketData.y * vec2(mod(neighborsVoxel.x, uBucketData.z), floor(neighborsVoxel.x / uBucketData.z)) + vec2(0.5)) / uBucketData.x;
        //float gridIndex = dot(neighborsVoxel, vec3(1., uBucketData.y, uBucketData.y * uBucketData.y));
        //vec2 voxelsIndex = (vec2(mod(gridIndex, uBucketData.x), floor(gridIndex / uBucketData.x)) + vec2(0.5)) / uBucketData.x;
        vec4 neighbors = texture(uNeighbors, voxelsIndex);

        if(neighbors.r > 0.) addToSum(particlePosition, neighbors.r, density, sum_k_grad_Ci, grad_pi_Ci);
        if(neighbors.g > 0.) addToSum(particlePosition, neighbors.g, density, sum_k_grad_Ci, grad_pi_Ci);
        if(neighbors.b > 0.) addToSum(particlePosition, neighbors.b, density, sum_k_grad_Ci, grad_pi_Ci);
        if(neighbors.a > 0.) addToSum(particlePosition, neighbors.a, density, sum_k_grad_Ci, grad_pi_Ci);
    }

    densityConstrain = density / uRestDensity - 1.;

    sum_k_grad_Ci += dot(grad_pi_Ci, grad_pi_Ci);

    lambdaPressure = -densityConstrain / (sum_k_grad_Ci + uRelaxParameter);

    colorData = vec4(lambdaPressure, densityConstrain, density, 1.);
}
`;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return calculateDisplacements; });
const calculateDisplacements = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform sampler2D uTexturePosition;
uniform sampler2D uNeighbors;
uniform sampler2D uConstrains;
uniform vec3  uBucketData;
uniform float uSearchRadius;
uniform float uRestDensity;
uniform float uGradientKernelConstant;
uniform float uTensileK;
uniform float uTensileDistance;
uniform float uTensilePower;

vec3 offsets[27];
float texturePositionSize;
float h2;

out vec4 colorData;

void addToSum(in vec3 particlePosition, in float neighborIndex, in float lambdaPressure, inout vec3 deltaPosition) {

    vec2 index = vec2(mod(neighborIndex, texturePositionSize) + 0.5, floor(neighborIndex / texturePositionSize) + 0.5) / texturePositionSize;
    vec3 distance = particlePosition - texture(uTexturePosition, index).rgb;
    float r = length(distance);

    if(r > 0. && r < uSearchRadius) {

        float n_lambdaPressure = texture(uConstrains, index).r;
        float partial = uSearchRadius - r;

        //For the lambda Correction
        float lambdaCorrection = -uTensileK * pow((h2 - r * r) / (h2 - uTensileDistance * uTensileDistance), 3. * uTensilePower);

        deltaPosition += (lambdaPressure + n_lambdaPressure + lambdaCorrection) * partial * partial * normalize(distance);
    }
}

void main() {

    texturePositionSize = float(textureSize(uTexturePosition, 0).x);
    h2 = uSearchRadius * uSearchRadius;


    offsets[0] = vec3(-1., -1., -1.);
    offsets[1] = vec3(-1., -1., 0.);
    offsets[2] = vec3(-1., -1., 1.);
    offsets[3] = vec3(-1., 0., -1.);
    offsets[4] = vec3(-1., 0., 0.);
    offsets[5] = vec3(-1., 0., 1.);
    offsets[6] = vec3(-1., 1., -1.);
    offsets[7] = vec3(-1., 1., 0.);
    offsets[8] = vec3(-1., 1., 1.);
    offsets[9] = vec3(0., -1., -1.);
    offsets[10] = vec3(0., -1., 0.);
    offsets[11] = vec3(0., -1., 1.);
    offsets[12] = vec3(0., 0., -1.);
    offsets[13] = vec3(0., 0., 0.);
    offsets[14] = vec3(0., 0., 1.);
    offsets[15] = vec3(0., 1., -1.);
    offsets[16] = vec3(0., 1., 0.);
    offsets[17] = vec3(0., 1., 1.);
    offsets[18] = vec3(1., -1., -1.);
    offsets[19] = vec3(1., -1., 0.);
    offsets[20] = vec3(1., -1., 1.);
    offsets[21] = vec3(1., 0., -1.);
    offsets[22] = vec3(1., 0., 0.);
    offsets[23] = vec3(1., 0., 1.);
    offsets[24] = vec3(1., 1., -1.);
    offsets[25] = vec3(1., 1., 0.);
    offsets[26] = vec3(1., 1., 1.);

    int tSize = textureSize(uTexturePosition, 0).x;
    float textureSize = float(tSize);
    vec2 index = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;
    gl_Position = vec4(2. * index - vec2(1.), 0., 1.);
    gl_PointSize = 1.;

    float lambdaPressure = texture(uConstrains, index).x;
    vec3 particlePosition = texture(uTexturePosition, index).rgb;
    vec3 gridPosition = floor(particlePosition);
    vec3 deltaPosition = vec3(0.);

    for(int i = 0; i < 27; i ++) {

        vec3 neighborsVoxel = gridPosition + offsets[i];
        vec2 voxelsIndex =  (neighborsVoxel.zy + uBucketData.y * vec2(mod(neighborsVoxel.x, uBucketData.z), floor(neighborsVoxel.x / uBucketData.z)) + vec2(0.5)) / uBucketData.x;
        //float gridIndex = dot(neighborsVoxel, vec3(1., uBucketData.y, uBucketData.y * uBucketData.y));
        //vec2 voxelsIndex = (vec2(mod(gridIndex, uBucketData.x), floor(gridIndex / uBucketData.x)) + vec2(0.5)) / uBucketData.x;
        vec4 neighbors = texture(uNeighbors, voxelsIndex);

        if(neighbors.r > 0.) addToSum(particlePosition, neighbors.r, lambdaPressure, deltaPosition);
        if(neighbors.g > 0.) addToSum(particlePosition, neighbors.g, lambdaPressure, deltaPosition);
        if(neighbors.b > 0.) addToSum(particlePosition, neighbors.b, lambdaPressure, deltaPosition);
        if(neighbors.a > 0.) addToSum(particlePosition, neighbors.a, lambdaPressure, deltaPosition);
    }

    vec3 endPosition = particlePosition + (uGradientKernelConstant / uRestDensity) * deltaPosition;

    //Collision handling
    vec3 center = vec3(uBucketData.y * 0.5);
    float radius = uBucketData.y * 0.49;
    vec3 normal = endPosition - center;
    float n = length(normal);
    float distance = n -  radius;

    if(distance > 0. ) {

            normal = normalize(normal);
            endPosition = center + normal * radius;

    }

    // //Collision handling
    // vec3 boxSize = vec3(uBucketData.y * 0.48);
    // vec3 xLocal = endPosition - center;
    // vec3 contactPointLocal = min(boxSize, max(-boxSize, xLocal));
    // vec3 contactPoint = contactPointLocal + center;
    // distance = length(contactPoint - particlePosition);
    //
    // if(distance > 0.0) endPosition = contactPoint;

    colorData = vec4(endPosition, texture(uConstrains, index).g + 1.);
}

`;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return calculateViscosity; });
const calculateViscosity = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform sampler2D uTexturePosition;
uniform sampler2D uNeighbors;
uniform sampler2D uTextureVelocity;
uniform vec3  uBucketData;
uniform float uSearchRadius;
uniform float uRestDensity;
uniform float uKernelConstant;

vec3 offsets[27];
float texturePositionSize;
float h2;

out vec4 colorData;

void addToSum(in vec3 particlePosition, in float neighborIndex, in vec3 particleVelocity, inout vec3 deltaVelocity) {
    vec2 index = vec2(mod(neighborIndex, texturePositionSize) + 0.5, floor(neighborIndex / texturePositionSize) + 0.5) / texturePositionSize;
    vec3 distance = particlePosition - texture(uTexturePosition, index).rgb;
    float r = length(distance);
    if(r > 0. && r < uSearchRadius) deltaVelocity += (particleVelocity - texture(uTextureVelocity, index).rgb) * (uSearchRadius - r);
}

void main() {

    texturePositionSize = float(textureSize(uTexturePosition, 0).x);
    h2 = uSearchRadius * uSearchRadius;

    offsets[0] = vec3(-1., -1., -1.);
    offsets[1] = vec3(-1., -1., 0.);
    offsets[2] = vec3(-1., -1., 1.);
    offsets[3] = vec3(-1., 0., -1.);
    offsets[4] = vec3(-1., 0., 0.);
    offsets[5] = vec3(-1., 0., 1.);
    offsets[6] = vec3(-1., 1., -1.);
    offsets[7] = vec3(-1., 1., 0.);
    offsets[8] = vec3(-1., 1., 1.);
    offsets[9] = vec3(0., -1., -1.);
    offsets[10] = vec3(0., -1., 0.);
    offsets[11] = vec3(0., -1., 1.);
    offsets[12] = vec3(0., 0., -1.);
    offsets[13] = vec3(0., 0., 0.);
    offsets[14] = vec3(0., 0., 1.);
    offsets[15] = vec3(0., 1., -1.);
    offsets[16] = vec3(0., 1., 0.);
    offsets[17] = vec3(0., 1., 1.);
    offsets[18] = vec3(1., -1., -1.);
    offsets[19] = vec3(1., -1., 0.);
    offsets[20] = vec3(1., -1., 1.);
    offsets[21] = vec3(1., 0., -1.);
    offsets[22] = vec3(1., 0., 0.);
    offsets[23] = vec3(1., 0., 1.);
    offsets[24] = vec3(1., 1., -1.);
    offsets[25] = vec3(1., 1., 0.);
    offsets[26] = vec3(1., 1., 1.);

    int tSize = textureSize(uTexturePosition, 0).x;
    float textureSize = float(tSize);
    vec2 index = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;
    gl_Position = vec4(2. * index - vec2(1.), 0., 1.);
    gl_PointSize = 1.;

    vec3 particlePosition = texture(uTexturePosition, index).rgb;
    vec3 particleVelocity = texture(uTextureVelocity, index).rgb;
    vec3 gridPosition = floor(particlePosition);
    vec3 deltaVelocity = vec3(0.);

    for(int i = 0; i < 27; i ++) {

        vec3 neighborsVoxel = gridPosition + offsets[i];
        vec2 voxelsIndex =  (neighborsVoxel.zy + uBucketData.y * vec2(mod(neighborsVoxel.x, uBucketData.z), floor(neighborsVoxel.x / uBucketData.z)) + vec2(0.5)) / uBucketData.x;
        //float gridIndex = dot(neighborsVoxel, vec3(1., uBucketData.y, uBucketData.y * uBucketData.y));
        //vec2 voxelsIndex = (vec2(mod(gridIndex, uBucketData.x), floor(gridIndex / uBucketData.x)) + vec2(0.5)) / uBucketData.x;
        vec4 neighbors = texture(uNeighbors, voxelsIndex);

        if(neighbors.r > 0.) addToSum(particlePosition, neighbors.r, particleVelocity, deltaVelocity);
        if(neighbors.g > 0.) addToSum(particlePosition, neighbors.g, particleVelocity, deltaVelocity);
        if(neighbors.b > 0.) addToSum(particlePosition, neighbors.b, particleVelocity, deltaVelocity);
        if(neighbors.a > 0.) addToSum(particlePosition, neighbors.a, particleVelocity, deltaVelocity);
    }

    particleVelocity += (uKernelConstant / uRestDensity) * deltaVelocity;

    colorData = vec4(particleVelocity, 1.);
}

`;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return generateMesh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return tTriangles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return tNormals; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return tVoxelsOffsets; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return tLevels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fbPyramid; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__marchingCubesTables_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shaders_general_vs_quad_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shaders_general_fs_simpleColor_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shaders_general_fs_simpleTexture_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shaders_marchingCubes_vs_partticlesPlacement_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shaders_marchingCubes_fs_blu2D_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shaders_marchingCubes_fs_blurDepth_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__shaders_marchingCubes_fs_getCorners_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__shaders_marchingCubes_fs_splitChannels_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__shaders_marchingCubes_fs_marchCase_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__shaders_marchingCubes_fs_generatePyramid_js__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__shaders_marchingCubes_fs_generateTriangles_js__ = __webpack_require__(22);




//Shaders













//=======================================================================================================
// Variables & Constants
//=======================================================================================================

//Change these values to change marching cubes resolution (128/2048/1024 or 256/4096/2048), compactTextureSize
//holds the results for the triangles vertices positions and normals.
let resolution;
let expandedTextureSize;
let compressedTextureSize;
let compactTextureSize;
let compressedBuckets;
let expandedBuckets;
let depthLevels;
const amountOfTrianglesTextureSize = 16;
const indexesTextureSize = 64;


//Textures required
let tVoxels1,
    tVoxels2,
    tTriangles,
    tNormals,
    tVoxelsOffsets,
    tHelper,
    t3DExpanded,
    tMarchingCase,
    tAmountOfTrianglesPerIndex,
    tIndexes;

//Framebuffers for textures
let fbVoxels1,
    fbVoxels2,
    fb3DExpanded,
    fbIndexes,
    fbAmountOfTrianglesPerIndex,
    fbHelper,
    fbMarchingCase,
    fbTriangles;

//Shader programs
let setVoxelsProgram,
    blur2DProgram,
    blurDepthProgram,
    getCornersProgram,
    marchCaseProgram,
    splitChannelsProgram,
    generatePyramidProgram,
    textureProgram,
    generateTrianglesProgram;

//For the pyramid generation (stream compaction)
let tLevels, fbPyramid;

let tInV = [];
for (let i = 0; i <__WEBPACK_IMPORTED_MODULE_1__marchingCubesTables_js__["b" /* trianglesOnVoxels */].length; i ++) tInV.push(__WEBPACK_IMPORTED_MODULE_1__marchingCubesTables_js__["b" /* trianglesOnVoxels */][i].length);

let arrayTriIndex = [];
for(let i = 0; i < indexesTextureSize * indexesTextureSize; i ++) {
    if (i < __WEBPACK_IMPORTED_MODULE_1__marchingCubesTables_js__["a" /* ti5 */].length) {
        let val = __WEBPACK_IMPORTED_MODULE_1__marchingCubesTables_js__["a" /* ti5 */][i];
        let val2 = tInV[Math.floor(i / 15)];
        arrayTriIndex.push(val, val2, val2, 1.);
    } else arrayTriIndex.push(0, 0, 0, 0);
}

//Buffers for positions in a 256 texture, and triangles in voxel.
let arrayTriVoxel = [];
for(let i = 0; i < 256; i++) {
    let u = tInV[i] / 3;
    arrayTriVoxel.push(u, u, u, 1);
}


//Function used to initiate the marching cubes, should provide the resolution expected
let init = (_resolution, _expandedTextureSize, _compressedTextureSize, _compactTextureSize, _compressedbuckets, _expandedBuckets, _depthLevels) => {
    resolution = _resolution;
    expandedTextureSize = _expandedTextureSize;
    compressedTextureSize = _compressedTextureSize;
    compactTextureSize = _compactTextureSize;
    compressedBuckets = _compressedbuckets;
    expandedBuckets = _expandedBuckets;
    depthLevels = _depthLevels;

    tVoxels1 =                      __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](compressedTextureSize, compressedTextureSize,               __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA8,   __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].UNSIGNED_BYTE);
    tVoxels2 =                      __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](compressedTextureSize, compressedTextureSize,               __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA8,   __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].UNSIGNED_BYTE);
    tTriangles =                    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](compactTextureSize, compactTextureSize,                     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT);
    tNormals =                      __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](compactTextureSize, compactTextureSize,                     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT);
    tVoxelsOffsets =                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](compactTextureSize, compactTextureSize,                     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT);
    tHelper =                       __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](expandedTextureSize, expandedTextureSize,                   __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT);
    t3DExpanded =                   __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](expandedTextureSize, expandedTextureSize,                   __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT);
    tMarchingCase =                 __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](expandedTextureSize, expandedTextureSize,                   __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT);
    tAmountOfTrianglesPerIndex =    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](amountOfTrianglesTextureSize, amountOfTrianglesTextureSize, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(arrayTriVoxel));
    tIndexes =                      __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](indexesTextureSize, indexesTextureSize,                     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(arrayTriIndex));


    fbVoxels1 =                    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tVoxels1);
    fbVoxels2 =                    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tVoxels2);
    fb3DExpanded =                 __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](t3DExpanded);
    fbIndexes =                    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tIndexes);
    fbAmountOfTrianglesPerIndex =  __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tAmountOfTrianglesPerIndex);
    fbHelper =                     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tHelper);
    fbMarchingCase =               __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tMarchingCase);
    fbTriangles =                  __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */]([tTriangles, tNormals, tVoxelsOffsets]);

    tLevels = [];
    fbPyramid = [];
    for (let i = 0; i < Math.ceil(Math.log(_expandedTextureSize) / Math.log(2)); i++) {
        let size = Math.pow(2, i);
        tLevels.push(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["c" /* createTexture2D */](size, size, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FLOAT));
        fbPyramid.push(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["b" /* createDrawFramebuffer */](tLevels[i]));
    }

    arrayTriIndex = null;
    arrayTriVoxel = null;


    //programs generation
    setVoxelsProgram =                              __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_5__shaders_marchingCubes_vs_partticlesPlacement_js__["a" /* vsParticlesPlacement */], __WEBPACK_IMPORTED_MODULE_3__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
    setVoxelsProgram.positionTexture =              __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(setVoxelsProgram, "uTexturePosition");
    setVoxelsProgram.phase =                        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(setVoxelsProgram, "uPhase");
    setVoxelsProgram.particleSize =                 __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(setVoxelsProgram, "uSize");
    setVoxelsProgram.gridPartitioning =             __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(setVoxelsProgram, "u3D");
    setVoxelsProgram.particlesGridScale =           __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(setVoxelsProgram, "uParticlesGridScale");

    blur2DProgram =                                 __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_6__shaders_marchingCubes_fs_blu2D_js__["a" /* blur2D */]);
    blur2DProgram.dataTexture =                     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blur2DProgram, "uDT");
    blur2DProgram.axis =                            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blur2DProgram, "uAxis");
    blur2DProgram.steps =                           __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blur2DProgram, "uSteps");
    blur2DProgram.gridPartitioning =                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blur2DProgram, "u3D");


    blurDepthProgram =                              __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_7__shaders_marchingCubes_fs_blurDepth_js__["a" /* blurDepth */]);
    blurDepthProgram.dataTexture =                  __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blurDepthProgram, "uDT");
    blurDepthProgram.steps =                        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blurDepthProgram, "uSteps");
    blurDepthProgram.gridPartitioning =             __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blurDepthProgram, "u3D");
    blurDepthProgram.depthLevels =                  __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blurDepthProgram, "uDepth");

    getCornersProgram =                             __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_8__shaders_marchingCubes_fs_getCorners_js__["a" /* getCorners */]);
    getCornersProgram.dataTexture =                 __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(getCornersProgram, "uDataTexture");
    getCornersProgram.gridPartitioning =            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(getCornersProgram, "u3D");
    getCornersProgram.depthLevels =                 __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(getCornersProgram, "uDepth");

    splitChannelsProgram =                          __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_9__shaders_marchingCubes_fs_splitChannels_js__["a" /* splitChannels */]);
    splitChannelsProgram.dataTexture =              __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(splitChannelsProgram, "uDataTexture");
    splitChannelsProgram.gridPartitioningLow =      __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(splitChannelsProgram, "u3D_l");
    splitChannelsProgram.gridPartitioningHigh =     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(splitChannelsProgram, "u3D_h");
    splitChannelsProgram.depthLevels =              __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(splitChannelsProgram, "uDepth");

    marchCaseProgram =                              __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_10__shaders_marchingCubes_fs_marchCase_js__["a" /* marchCase */]);
    marchCaseProgram.dataTexture =                  __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(marchCaseProgram, "uDT");
    marchCaseProgram.trianglesPerIndexTexture =     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(marchCaseProgram, "uTrianglesIndex");
    marchCaseProgram.range =                        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(marchCaseProgram, "uRange");
    marchCaseProgram.gridPartitioning =             __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(marchCaseProgram, "u3D");

    generatePyramidProgram =                        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_11__shaders_marchingCubes_fs_generatePyramid_js__["a" /* generatePyramid */]);
    generatePyramidProgram.potentialTexture =       __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generatePyramidProgram, "uPyT");
    generatePyramidProgram.size =                   __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generatePyramidProgram, "uSize");

    textureProgram =                                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_4__shaders_general_fs_simpleTexture_js__["a" /* fsTextureColor */]);
    textureProgram.texture =                        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(textureProgram, "uTexture");
    textureProgram.forceAlpha =                     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(textureProgram, "uForceAlpha");

    generateTrianglesProgram =                      __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_12__shaders_marchingCubes_fs_generateTriangles_js__["a" /* generateTriangles */]);
    generateTrianglesProgram.pyramid =              __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uPyramid");
    generateTrianglesProgram.base =                 __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uBase");
    generateTrianglesProgram.gridPartitioning =     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "u3D");
    generateTrianglesProgram.potentialTexture =     __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uPot");
    generateTrianglesProgram.tiTexture =            __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uTrianglesIndexes");
    generateTrianglesProgram.range =                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uRange");
    generateTrianglesProgram.limit =                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uLimit");
    generateTrianglesProgram.total =                __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uTotal");
    generateTrianglesProgram.fastNormals =          __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uFastNormals");
    generateTrianglesProgram.compactTextureSize =   __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uCompactSize");
    generateTrianglesProgram.levels =               __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uLevels");


}

//Function used to generate a 3D mesh using the marching cubes algorithm
let generateMesh = (positionTexture, totalParticles, particlesGridScale, particlesSize, _blurSteps, range, maxCells, fastNormals) => {

    let blurSteps = 2 * _blurSteps;

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].blendEquation(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FUNC_ADD);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].blendFunc(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].ONE, __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].ONE);


    //Working with the compressed texture size
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, compressedTextureSize, compressedTextureSize);


    //Place particles in the voxel space
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(setVoxelsProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](setVoxelsProgram.positionTexture, positionTexture, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(setVoxelsProgram.particleSize, particlesSize);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(setVoxelsProgram.particlesGridScale, particlesGridScale);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(setVoxelsProgram.gridPartitioning, 1. / compressedTextureSize, resolution, compressedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbVoxels1);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].BLEND);

    for (let i = 0; i < particlesSize; i++) {
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(setVoxelsProgram.phase, i);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);
    }

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].BLEND);


    //Use a 3D blur for the potential generation.
    let blurXY = (buffer, texture, axis) => {
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform2fv(blur2DProgram.axis, axis);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(blur2DProgram.steps, blurSteps);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(blur2DProgram.gridPartitioning, 1. / compressedTextureSize, resolution, compressedBuckets);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](blur2DProgram.dataTexture, texture, 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, buffer);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
    };

    let k = 1 / compressedTextureSize;
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(blur2DProgram);
    blurXY(fbVoxels2, tVoxels1, [k, 0]);
    blurXY(fbVoxels1, tVoxels2, [0, k]);

    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(blurDepthProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](blurDepthProgram.dataTexture, tVoxels1, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(blurDepthProgram.steps, blurSteps);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(blurDepthProgram.depthLevels, depthLevels);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(blurDepthProgram.gridPartitioning, 1. / compressedTextureSize, resolution, compressedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbVoxels2);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);


    //Evaluate the corners values for the potentials
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(getCornersProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbVoxels1);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](getCornersProgram.dataTexture, tVoxels2, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(getCornersProgram.gridPartitioning, 1. / compressedTextureSize, resolution, compressedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(getCornersProgram.depthLevels, depthLevels);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);


    //Working with the expanded texture size
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, expandedTextureSize, expandedTextureSize);


    //Split the channels for expansion of the potential
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(splitChannelsProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](splitChannelsProgram.dataTexture, tVoxels1, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fb3DExpanded);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(splitChannelsProgram.gridPartitioningLow, 1. / compressedTextureSize, resolution, compressedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(splitChannelsProgram.gridPartitioningHigh, 1. / expandedTextureSize, resolution, expandedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(splitChannelsProgram.depthLevels, depthLevels);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);


    //Evaluate the cells active for the marching cubes
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(marchCaseProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](marchCaseProgram.dataTexture, t3DExpanded, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](marchCaseProgram.trianglesPerIndexTexture, tAmountOfTrianglesPerIndex, 1);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(marchCaseProgram.range, range);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(marchCaseProgram.gridPartitioning, 1. / expandedTextureSize, resolution, expandedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbMarchingCase);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);


    //This part set the levels of the pyramid for compaction.
    let levels = Math.ceil(Math.log(expandedTextureSize) / Math.log(2));
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(generatePyramidProgram);
    for (let i = 0; i < levels; i++) {
        let size = Math.pow(2, levels - 1 - i);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbPyramid[levels - i - 1]);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, size, size);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(generatePyramidProgram.size, Math.pow(2, i + 1) / expandedTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](generatePyramidProgram.potentialTexture, i == 0 ? tMarchingCase : tLevels[levels - i], 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
    }


    //Copy the pyramid partial result into the helper texture.
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbHelper);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clearColor(0, 0, 0, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    let offset = 0;
    for(let i = 0; i < levels; i ++) {
        let size = Math.pow(2, levels - 1 - i);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(offset, 0, size, size);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(textureProgram);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](textureProgram.texture, tLevels[levels - i - 1], 0);
        __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
        offset += size;
    }


    //Parse the pyramid and generate the positions and normals
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].useProgram(generateTrianglesProgram);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](generateTrianglesProgram.pyramid, tHelper, 0);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](generateTrianglesProgram.base, tMarchingCase, 1);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](generateTrianglesProgram.tiTexture, tIndexes, 2);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](generateTrianglesProgram.potentialTexture, t3DExpanded, 3);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["a" /* bindTexture */](generateTrianglesProgram.total, tLevels[0], 4);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(generateTrianglesProgram.range, range);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(generateTrianglesProgram.levels, levels);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1f(generateTrianglesProgram.compactTextureSize, compactTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform3f(generateTrianglesProgram.gridPartitioning, expandedTextureSize, resolution, expandedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].uniform1i(generateTrianglesProgram.fastNormals, fastNormals);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].FRAMEBUFFER, fbTriangles);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].viewport(0, 0, compactTextureSize, compactTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);

}



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ti5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return trianglesOnVoxels; });
//Indexes for the marching cubes
const ti5 = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, 3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, 3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, 9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, 9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, 2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, 8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, 9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, 4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, 3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, 1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, 4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, 4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, 1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, 5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, 2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, 9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, 0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, 2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, 10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, 4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, 5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, 5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, 9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, 0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, 1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, 10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, 8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, 2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, 7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, 9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, 2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, 11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, 9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, 5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, 11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, 11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, 1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, 9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, 5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, 2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, 0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, 5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, 6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, 0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, 3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, 6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, 5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, 1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, 10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, 6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, 1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, 8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, 7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, 3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, 5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, 0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, 9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, 8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, 5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, 0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, 6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, 10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, 10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, 8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, 1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, 0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, 10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, 0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, 3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, 6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, 9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, 8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, 3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, 6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, 0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, 10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, 10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, 1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, 2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, 7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, 7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, 2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, 1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, 11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, 8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, 0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, 7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, 10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, 2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, 6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, 7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, 2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, 1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, 10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, 10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, 0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, 7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, 6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, 8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, 9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, 6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, 4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, 10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, 8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, 0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, 1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, 8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, 10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, 4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, 10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, 5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, 11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, 9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, 6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, 7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, 3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, 7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, 3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, 6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, 9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, 1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, 4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, 7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, 6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, 3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, 0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, 6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, 0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, 11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, 6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, 5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, 9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, 1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, 1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, 10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, 0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, 5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, 10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, 11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, 9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, 7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, 2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, 8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, 9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, 9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, 1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, 9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, 9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, 5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, 5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, 0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, 10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, 2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, 0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, 0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, 9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, 5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, 3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, 5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, 8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, 0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, 9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, 1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, 3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, 4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, 9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, 11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, 11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, 2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, 9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, 3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, 1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, 4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, 0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, 3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, 0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, 9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, 1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

const trianglesOnVoxels = [[], [0, 8, 3], [0, 1, 9], [1, 8, 3, 9, 8, 1], [1, 2, 10], [0, 8, 3, 1, 2, 10], [9, 2, 10, 0, 2, 9], [2, 8, 3, 2, 10, 8, 10, 9, 8], [3, 11, 2], [0, 11, 2, 8, 11, 0], [1, 9, 0, 2, 3, 11], [1, 11, 2, 1, 9, 11, 9, 8, 11], [3, 10, 1, 11, 10, 3], [0, 10, 1, 0, 8, 10, 8, 11, 10], [3, 9, 0, 3, 11, 9, 11, 10, 9], [9, 8, 10, 10, 8, 11], [4, 7, 8], [4, 3, 0, 7, 3, 4], [0, 1, 9, 8, 4, 7], [4, 1, 9, 4, 7, 1, 7, 3, 1], [1, 2, 10, 8, 4, 7], [3, 4, 7, 3, 0, 4, 1, 2, 10], [9, 2, 10, 9, 0, 2, 8, 4, 7], [2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4], [8, 4, 7, 3, 11, 2], [11, 4, 7, 11, 2, 4, 2, 0, 4], [9, 0, 1, 8, 4, 7, 2, 3, 11], [4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1], [3, 10, 1, 3, 11, 10, 7, 8, 4], [1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4], [4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3], [4, 7, 11, 4, 11, 9, 9, 11, 10], [9, 5, 4], [9, 5, 4, 0, 8, 3], [0, 5, 4, 1, 5, 0], [8, 5, 4, 8, 3, 5, 3, 1, 5], [1, 2, 10, 9, 5, 4], [3, 0, 8, 1, 2, 10, 4, 9, 5], [5, 2, 10, 5, 4, 2, 4, 0, 2], [2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8], [9, 5, 4, 2, 3, 11], [0, 11, 2, 0, 8, 11, 4, 9, 5], [0, 5, 4, 0, 1, 5, 2, 3, 11], [2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5], [10, 3, 11, 10, 1, 3, 9, 5, 4], [4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10], [5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3], [5, 4, 8, 5, 8, 10, 10, 8, 11], [9, 7, 8, 5, 7, 9], [9, 3, 0, 9, 5, 3, 5, 7, 3], [0, 7, 8, 0, 1, 7, 1, 5, 7], [1, 5, 3, 3, 5, 7], [9, 7, 8, 9, 5, 7, 10, 1, 2], [10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3], [8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2], [2, 10, 5, 2, 5, 3, 3, 5, 7], [7, 9, 5, 7, 8, 9, 3, 11, 2], [9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11], [2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7], [11, 2, 1, 11, 1, 7, 7, 1, 5], [9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11], [5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0], [11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0], [11, 10, 5, 7, 11, 5], [10, 6, 5], [0, 8, 3, 5, 10, 6], [9, 0, 1, 5, 10, 6], [1, 8, 3, 1, 9, 8, 5, 10, 6], [1, 6, 5, 2, 6, 1], [1, 6, 5, 1, 2, 6, 3, 0, 8], [9, 6, 5, 9, 0, 6, 0, 2, 6], [5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8], [2, 3, 11, 10, 6, 5], [11, 0, 8, 11, 2, 0, 10, 6, 5], [0, 1, 9, 2, 3, 11, 5, 10, 6], [5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11], [6, 3, 11, 6, 5, 3, 5, 1, 3], [0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6], [3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9], [6, 5, 9, 6, 9, 11, 11, 9, 8], [5, 10, 6, 4, 7, 8], [4, 3, 0, 4, 7, 3, 6, 5, 10], [1, 9, 0, 5, 10, 6, 8, 4, 7], [10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4], [6, 1, 2, 6, 5, 1, 4, 7, 8], [1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7], [8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6], [7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9], [3, 11, 2, 7, 8, 4, 10, 6, 5], [5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11], [0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6], [9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6], [8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6], [5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11], [0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7], [6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9], [10, 4, 9, 6, 4, 10], [4, 10, 6, 4, 9, 10, 0, 8, 3], [10, 0, 1, 10, 6, 0, 6, 4, 0], [8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10], [1, 4, 9, 1, 2, 4, 2, 6, 4], [3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4], [0, 2, 4, 4, 2, 6], [8, 3, 2, 8, 2, 4, 4, 2, 6], [10, 4, 9, 10, 6, 4, 11, 2, 3], [0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6], [3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10], [6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1], [9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3], [8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1], [3, 11, 6, 3, 6, 0, 0, 6, 4], [6, 4, 8, 11, 6, 8], [7, 10, 6, 7, 8, 10, 8, 9, 10], [0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10], [10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0], [10, 6, 7, 10, 7, 1, 1, 7, 3], [1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7], [2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9], [7, 8, 0, 7, 0, 6, 6, 0, 2], [7, 3, 2, 6, 7, 2], [2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7], [2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7], [1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11], [11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1], [8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6], [0, 9, 1, 11, 6, 7], [7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0], [7, 11, 6], [7, 6, 11], [3, 0, 8, 11, 7, 6], [0, 1, 9, 11, 7, 6], [8, 1, 9, 8, 3, 1, 11, 7, 6], [10, 1, 2, 6, 11, 7], [1, 2, 10, 3, 0, 8, 6, 11, 7], [2, 9, 0, 2, 10, 9, 6, 11, 7], [6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8], [7, 2, 3, 6, 2, 7], [7, 0, 8, 7, 6, 0, 6, 2, 0], [2, 7, 6, 2, 3, 7, 0, 1, 9], [1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6], [10, 7, 6, 10, 1, 7, 1, 3, 7], [10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8], [0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7], [7, 6, 10, 7, 10, 8, 8, 10, 9], [6, 8, 4, 11, 8, 6], [3, 6, 11, 3, 0, 6, 0, 4, 6], [8, 6, 11, 8, 4, 6, 9, 0, 1], [9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6], [6, 8, 4, 6, 11, 8, 2, 10, 1], [1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6], [4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9], [10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3], [8, 2, 3, 8, 4, 2, 4, 6, 2], [0, 4, 2, 4, 6, 2], [1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8], [1, 9, 4, 1, 4, 2, 2, 4, 6], [8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1], [10, 1, 0, 10, 0, 6, 6, 0, 4], [4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3], [10, 9, 4, 6, 10, 4], [4, 9, 5, 7, 6, 11], [0, 8, 3, 4, 9, 5, 11, 7, 6], [5, 0, 1, 5, 4, 0, 7, 6, 11], [11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5], [9, 5, 4, 10, 1, 2, 7, 6, 11], [6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5], [7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2], [3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6], [7, 2, 3, 7, 6, 2, 5, 4, 9], [9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7], [3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0], [6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8], [9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7], [1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4], [4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10], [7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10], [6, 9, 5, 6, 11, 9, 11, 8, 9], [3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5], [0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11], [6, 11, 3, 6, 3, 5, 5, 3, 1], [1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6], [0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10], [11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5], [6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3], [5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2], [9, 5, 6, 9, 6, 0, 0, 6, 2], [1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8], [1, 5, 6, 2, 1, 6], [1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6], [10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0], [0, 3, 8, 5, 6, 10], [10, 5, 6], [11, 5, 10, 7, 5, 11], [11, 5, 10, 11, 7, 5, 8, 3, 0], [5, 11, 7, 5, 10, 11, 1, 9, 0], [10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1], [11, 1, 2, 11, 7, 1, 7, 5, 1], [0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11], [9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7], [7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2], [2, 5, 10, 2, 3, 5, 3, 7, 5], [8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5], [9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2], [9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2], [1, 3, 5, 3, 7, 5], [0, 8, 7, 0, 7, 1, 1, 7, 5], [9, 0, 3, 9, 3, 5, 5, 3, 7], [9, 8, 7, 5, 9, 7], [5, 8, 4, 5, 10, 8, 10, 11, 8], [5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0], [0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5], [10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4], [2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8], [0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11], [0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5], [9, 4, 5, 2, 11, 3], [2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4], [5, 10, 2, 5, 2, 4, 4, 2, 0], [3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9], [5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2], [8, 4, 5, 8, 5, 3, 3, 5, 1], [0, 4, 5, 1, 0, 5], [8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5], [9, 4, 5], [4, 11, 7, 4, 9, 11, 9, 10, 11], [0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11], [1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11], [3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4], [4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2], [9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3], [11, 7, 4, 11, 4, 2, 2, 4, 0], [11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4], [2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9], [9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7], [3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10], [1, 10, 2, 8, 7, 4], [4, 9, 1, 4, 1, 7, 7, 1, 3], [4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1], [4, 0, 3, 7, 4, 3], [4, 8, 7], [9, 10, 8, 10, 11, 8], [3, 0, 9, 3, 9, 11, 11, 9, 10], [0, 1, 10, 0, 10, 8, 8, 10, 11], [3, 1, 10, 11, 3, 10], [1, 2, 11, 1, 11, 9, 9, 11, 8], [3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9], [0, 2, 11, 8, 0, 11], [3, 2, 11], [2, 3, 8, 2, 8, 10, 10, 8, 9], [9, 10, 2, 0, 9, 2], [2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8], [1, 10, 2], [1, 3, 8, 9, 1, 8], [0, 9, 1], [0, 3, 8], []];



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsParticlesPlacement; });
const vsParticlesPlacement = `#version 300 es

uniform sampler2D uTexturePosition;
uniform float uPhase;
uniform float uSize;
uniform vec3 u3D;
uniform float uParticlesGridScale;

out vec4 colorData;

void main() {

    float textureSize = float(textureSize(uTexturePosition, 0).x);
    float index1D = float(gl_VertexID);
    vec2 index2D = (vec2(mod(index1D, textureSize), floor(index1D / textureSize)) + vec2(0.5)) / textureSize;
    
    vec4 data = texture(uTexturePosition, index2D);
    vec3 position = data.rgb;

    vec3 gPP = floor(position * u3D.y / uParticlesGridScale);
    gPP.y -= uPhase;

    //The buckets are aligned with the Y axis
    vec2 gP = u3D.x * (gPP.xz + u3D.y * vec2(mod(gPP.y, u3D.z), floor(gPP.y / u3D.z)) + vec2(0.5));
    float depthLevel = floor(gP.y);
    gP.y = fract(gP.y);
    gP = 2. * gP - vec2(1.);

    colorData = 0.7 * data.a * vec4(equal(vec4(depthLevel), vec4(0., 1., 2., 3.)));

    gl_PointSize = uSize;
    gl_Position = vec4(gP, 0., 1.0);
}
`;



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return blur2D; });
const blur2D = `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uDT;
uniform vec2 uAxis;
uniform int uSteps;
uniform vec3 u3D;

in vec2 uv;
out vec4 colorData;


void main(void) {

    float border = .1;
    
    vec4 blend = vec4(0.);
    float sum = 1.;
    float m = 1.;
    float n = float(uSteps);
    for (int i = 0; i < 2 * uSteps; i += 1) {
        float k = float(i);
        float j = float(i) - 0.5 * float(uSteps);
        blend +=  m * texture(uDT, uv + j * uAxis.xy);
        m *= (n - k) / (k + 1.);
        sum += m;
    } 
    blend /= sum;
    
    //This avoids to spread information between the different buckets.
    vec2 pos = floor(uv / u3D.x);
    blend *= float(mod(pos.x, u3D.y) > border && mod(pos.y, u3D.y) > border && mod(pos.x, u3D.y) < u3D.y - 1. - border && mod(pos.y, u3D.y) < u3D.y - 1. - border);


    colorData = blend;
}
`;





/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return blurDepth; });
const blurDepth = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform sampler2D uDataTexture;
uniform int uSteps;
uniform float uDepth;


in vec2 uv;
out vec4 colorData;

uniform vec3 u3D;
    
void main(void) {

    float sum = 1.;
    float m = 1.;
    float n = float(uSteps);
    float border = .1;


    //Obtain the 3D pos of the corresponding fragment.
    vec2 pos = floor(uv / u3D.x);
    vec3 pos3D = vec3(mod(pos.y, u3D.y), u3D.z * floor(pos.y / u3D.y) + floor(pos.x / u3D.y), mod(pos.x, u3D.y));
    vec3 newPos3D = vec3(0.);
    vec2 uv = vec2(0.);
    vec4 blend = vec4(0.);
    float depthLevel = 0.;

    //Obtain the depth level for the corresponding fragment.
    float currentDepthLevel = floor(pos3D.y / uDepth); 

    for (int i = 0; i < 2 * uSteps; i += 1) {
        float j = float(i) - 0.5 * float(uSteps);
        float k = float(i);
        //Obtain the new 3D pos of the fragment to use for blurring.
        newPos3D = pos3D - j * vec3(0., 1., 0.);

        //Obtain the z level for the new fragment to read.
        depthLevel = floor(newPos3D.y / uDepth);  

        uv = u3D.x * (newPos3D.xz + u3D.y * vec2(mod(newPos3D.y, u3D.z), floor(newPos3D.y / u3D.z)) + vec2(0.5));;
        uv.y = fract(uv.y);

        vec4 newBucket = texture(uDataTexture, uv);

        //If the new fragment is in the same depth range than the original fragment to blur then the same channels are used.
        //If the new depthLevel is different than the current Z level the blurring have to be done taking into account the
        //channel differences between the two fragments.

        vec3 cases = vec3(bvec3(depthLevel < currentDepthLevel, depthLevel == currentDepthLevel, depthLevel > currentDepthLevel));
        blend += m * (vec4(0., newBucket.rgb) * cases.x + newBucket * cases.y + vec4(newBucket.gba, 0.) * cases.z);
        m *= (n - k) / (k + 1.);
        sum += m;
    }

    blend /= sum;

    //This avoids to spread information between the different buckets.
    blend *= float(mod(pos.x, u3D.y) > border && mod(pos.y, u3D.y) > border && mod(pos.x, u3D.y) < u3D.y - 1. - border && mod(pos.y, u3D.y) < u3D.y - 1. - border);

    colorData = blend;
}
`;



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getCorners; });
const getCorners = `#version 300 es

precision highp float;
precision highp sampler2D;
uniform sampler2D uDataTexture;
uniform vec3 u3D;
uniform float uDepth;

vec3 data[7];

in vec2 uv;
out vec4 colorData;

vec2 index2D(vec3 pos) {
    return u3D.x * (pos.xz + u3D.y * vec2(mod(pos.y, u3D.z), floor(pos.y / u3D.z)) + vec2(0.5));
}

void main(void) {
    vec2 pos = floor(uv / u3D.x);
    vec3 pos3D = vec3(mod(pos.y, u3D.y), u3D.z * floor(pos.y / u3D.y) + floor(pos.x / u3D.y), mod(pos.x, u3D.y));

    data[0] = vec3(-1., -1., -1.);
    data[1] = vec3(0., -1., -1.);
    data[2] = vec3(0., 0., -1.);
    data[3] = vec3(-1., 0., -1);
    data[4] = vec3(-1., -1., 0.);
    data[5] = vec3(0., -1., 0.);
    data[6] = vec3(-1., 0., 0.);

    float currentZLevel = floor(pos3D.y / uDepth);
    vec2 uv  = index2D(pos3D);
    uv.y = fract(uv.y);
    vec4 corner = texture(uDataTexture, uv);

    vec3 newPos3D = vec3(0.);
    float zLevel = 0.;

    for(int i = 0; i < 7; i ++) {

        newPos3D = pos3D + data[i];
        zLevel = floor(newPos3D.y / uDepth);
        uv = index2D(newPos3D);
        uv.y = fract(uv.y);

        vec4 newBucket = texture(uDataTexture, uv);
        vec3 cases = vec3(bvec3(zLevel < currentZLevel, zLevel == currentZLevel, zLevel > currentZLevel));
        corner += vec4(0., newBucket.rgb) * cases.x + newBucket * cases.y + vec4(newBucket.gba, 0.) * cases.z;

    }

    colorData = vec4(corner * 0.125);
}

`;



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return splitChannels; });
const splitChannels = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform sampler2D uDataTexture;
uniform vec3 u3D_h;
uniform vec3 u3D_l;
uniform float uDepth;


in vec2 uv;
out vec4 colorData;

void main(void) {

    //Obtain the 3D position of the corresponding fragment in the expanded texture
    vec2 pos = floor(uv / u3D_h.x);
    vec3 pos3D = vec3(mod(pos.y, u3D_h.y), u3D_h.z * floor(pos.y / u3D_h.y) + floor(pos.x / u3D_h.y), mod(pos.x, u3D_h.y));

    //Define the depth range for the corresponding fragment.
    float zLevel = floor(pos3D.y / uDepth);
    vec2 uv  = u3D_l.x * (pos3D.zx + u3D_l.y * vec2(mod(pos3D.y, u3D_l.z), floor(pos3D.y / u3D_l.z)) + vec2(0.5));
    uv.y = fract(uv.y);

    //Set the value of the fragment based on the depth and the corresponding channel.
    colorData = vec4(dot(texture(uDataTexture, uv), vec4(equal(vec4(zLevel), vec4(0., 1., 2., 3.)))));
}

`;



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return marchCase; });
const marchCase = `#version 300 es

precision mediump float;
precision mediump sampler2D;

//Texture container the potential values in the corners of the voxels.
uniform sampler2D uCornersTexture;

//Texture holding the numbers of triangles to generate on each of the 256 cases from the MC
uniform sampler2D uTrianglesIndex;

//Iso level used to define the surface required from the potential.
uniform float uRange;

//Constants used to simulate the 3D texture in a 2D texture
uniform vec3 u3D;

in vec2 uv;
out vec4 colorData;

//Function used to evaluate the 2D index from a 3D position.
vec2 index2D(vec3 pos) {
    return u3D.x * (pos.xz + u3D.y * vec2(mod(pos.y, u3D.z), floor(pos.y / u3D.z)) + vec2(0.5));
}
void main(void) {

    //Obtain the 3D voxel position of the corresponding fragment to evaluate.
    vec2 position = floor(uv / u3D.x);
    vec3 pos3D = vec3(mod(position.y, u3D.y), u3D.z * floor(position.y / u3D.y) + floor(position.x / u3D.y), mod(position.x, u3D.y));

    //The MC case to use in the voxel evaluated is calculated as the sum of corners that are below the iso level required.
    float c = step(texture(uCornersTexture, index2D(pos3D)).r, uRange)
            + 2. *   step(  texture(uCornersTexture, index2D(pos3D + vec3(1., 0., 0.))).r, uRange)
            + 4. *   step(  texture(uCornersTexture, index2D(pos3D + vec3(1., 1., 0.))).r, uRange)
            + 8. *   step(  texture(uCornersTexture, index2D(pos3D + vec3(0., 1., 0.))).r, uRange)
            + 16. *  step(  texture(uCornersTexture, index2D(pos3D + vec3(0., 0., 1.))).r, uRange)
            + 32. *  step(  texture(uCornersTexture, index2D(pos3D + vec3(1., 0., 1.))).r, uRange)
            + 64. *  step(  texture(uCornersTexture, index2D(pos3D + vec3(1., 1., 1.))).r, uRange)
            + 128. * step(  texture(uCornersTexture, index2D(pos3D + vec3(0., 1., 1.))).r, uRange);
    c *= step(c, 254.);

    //The total triangles to generate are obtained knowing which one of the 256 cases is required and reading the
    //amount triangles from the 16x16 texture provided.
    float totalTrianglesToGenerate = texture(uTrianglesIndex, vec2(mod(c, 16.), floor(c / 16.)) / 16.).r;

    //The resulting fragment saves the amount of triangles to generate and the MC case obtained.
    colorData = vec4(vec3(totalTrianglesToGenerate * 3.), c);
}
`;



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return generatePyramid; });
const generatePyramid = `#version 300 es

precision mediump float;
precision mediump sampler2D;
uniform sampler2D uPyT;
uniform float uSize;
in vec2 uv;
out vec4 colorData;
void main(void) {
    float k = 0.5 * uSize;
    vec2 position = floor(uv / uSize) * uSize;

    float a = texture(uPyT,  position + vec2(0., 0.)).r;
    float b = texture(uPyT,  position + vec2(k, 0.)).r;
    float c = texture(uPyT,  position + vec2(0., k)).r;
    float d = texture(uPyT,  position + vec2(k, k)).r;

    colorData.a = a;
    colorData.b = a + b;
    colorData.g = a + b + c;
    colorData.r = a + b + c + d;

}

`;



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return generateTriangles; });
const generateTriangles = `#version 300 es

precision highp float;
precision highp sampler2D;

//Pyramid texture containing all the reduction steps.
uniform sampler2D uPyramid;

//Active voxels texture.
uniform sampler2D uBase;

//Potential corners values.
uniform sampler2D uPot;

//triTable data from Paul Bourke 64x64 texture
uniform sampler2D uTrianglesIndexes;

//level 0 of the pyramid.
uniform sampler2D uTotal;

//Uniform used to defined normals quality
uniform bool uFastNormals;

//iso level used to define the surface from the potential
uniform float uRange;
in vec2 uv;

layout(location = 0) out vec4 data1;
layout(location = 1) out vec4 data2;
layout(location = 2) out vec4 data3;

const float EPSILON = 0.00001;

uniform float uCompactSize;

uniform int uLevels;

//Constants used to simulate the 3D texture
uniform vec3 u3D;

//Calculate the 2D index to read the data in the 2D texture based in a 3D position
vec2 index2D(vec3 pos) {
 return (pos.xz + u3D.y * vec2(mod(pos.y, u3D.z), floor(pos.y / u3D.z)) + vec2(0.5)) / u3D.x;
}

void main(void) {
    float p = 1. / u3D.y;
    vec3 p0 = vec3(p, 0., 0.);
    vec3 p1 = vec3(p, p, 0.);
    vec3 p2 = vec3(0., p, 0.);
    vec3 p3 = vec3(0., 0., p);
    vec3 p4 = vec3(p, 0., p);
    vec3 p5 = vec3(p, p, p);
    vec3 p6 = vec3(0., p, p);

    //Evaluate the 1D index of the fragment evaluated.
    float vI = dot(floor(uCompactSize * uv), vec2(1., uCompactSize));
    //If the fragment's key is higher than the total of vertices needed to create the execution is halted.
    if(vI >= texture(uTotal, vec2(0.5)).r) discard;
    else {
        /*
        This is the compaction process, it's explained in
        http://www.miaumiau.cat/2016/10/stream-compaction-in-webgl/
        */
        float offset = u3D.x - 2.;
        float k = 1. / u3D.x;
        vec2 relativePosition = k * vec2(offset, 0.);
        vec4 partialSums = texture(uPyramid, relativePosition);
        float start = 0.;
        vec4 starts = vec4(0.);
        vec4 ends = vec4(0.);
        float div0 = 1. / u3D.y;
        float diff = 2.;
        vec4 m = vec4(0.);
        vec2 position = vec2(0.);
        vec4 vI4 = vec4(vI);
        //12 steps are required to parse the different levels of the pyramid.


        for(int i = 1; i < uLevels; i++) {
            offset -= diff;
            diff *= 2.;
            relativePosition = position + k * vec2(offset, 0.);
            ends = partialSums.wzyx + vec4(start);
            starts = vec4(start, ends.xyz);
            m = vec4(greaterThanEqual(vI4, starts)) * vec4(lessThan(vI4, ends));
            relativePosition += m.y * vec2(k, 0.) + m.z * vec2(0., k) + m.w * vec2(k, k);
            start = dot(m, starts);
            position = 2. * (relativePosition - k * vec2(offset, 0.));
            partialSums = texture(uPyramid, relativePosition);
        }


        ends = partialSums.wzyx + vec4(start);
        starts = vec4(start, ends.xyz);
        m = vec4(greaterThanEqual(vI4, starts)) * vec4(lessThan(vI4, ends));
        position += m.y * vec2(k, 0.) + m.z * vec2(0., k) + m.w * vec2(k, k);
        /*
        * MARCHING CUBES TO GENERATE THE VERTICES
        * POSITIONS AND NORMALS
        */
        //This data contains the 2D position of the voxel reallocated, the index offset for the vertex to generate in the corresponding voxel
        //and the MC case used for that voxel.
        vec4 data = vec4(position * u3D.x,  vI - dot(m, starts), texture(uBase, position).a);
        //Up to 15 vertices can be generated per voxel, the current vertex to generate is saved in this variable
        float currentVertex = data.b;
        //Calculate the 3D position of the voxel based on the 2D position in the scattered data.
        data.xyz = p * vec3(mod(data.y, u3D.y), u3D.z * floor(data.y * p) + floor(data.x * p), mod(data.x, u3D.y));
        //Obtain the one dimensional index to read the corresponding edge to use.
        float mcIndex = 15. * data.a + currentVertex;
        //Obtain the edge to use from the voxel using the previous index and reading the data from the triTable texture.
        vec4 mcData = texture(uTrianglesIndexes, vec2(mod(mcIndex, 64.), floor(mcIndex / 64.)) / 64.);
        mcIndex = mcData.r;
        //To obtain the two points that define the edge the original implementation uses a set of if conditionals.
        //The shader makes a sum of all the corners using masks to discard the values that are not needed.
        vec4 m0 = vec4(mcIndex);
        //Check if values are in the edge
        vec4 m1 = vec4(equal(m0, vec4(0., 1., 2., 3.)));
        vec4 m2 = vec4(equal(m0, vec4(4., 5., 6., 7.)));
        vec4 m3 = vec4(equal(m0, vec4(8., 9., 10., 11.)));
        //The two points are the voxel position plus the point active using the mask calculated before.
        vec3 b0 = data.rgb + m1.y * p0 + m1.z * p1 + m1.w * p2 + m2.x * p3 + m2.y * p4 + m2.z * p5 + m2.w * p6 + m3.y * p0 + m3.z * p1 + m3.w * p2;
        vec3 b1 = data.rgb + m1.x * p0 + m1.y * p1 + m1.z * p2 + m2.x * p4 + m2.y * p5 + m2.z * p6 + m2.w * p3 + m3.x * p3 + m3.y * p4 + m3.z * p5 + m3.w * p6;
        //Potential values in the corresponding corners
        vec4 n0 = texture(uPot, index2D(u3D.y * b0));
        vec4 n1 = texture(uPot, index2D(u3D.y * b1));
        vec2 diff1 = vec2(uRange - n0.a, n1.a - n0.a);
        //Value used to evaluate the linear interpolation between the two corners points to define the position of the vertex to generate.
        vec3 mult = vec3(lessThan(abs(vec3(diff1.x, uRange - n1.a, -diff1.y)), vec3(0.)));
        vec3 normalA = vec3(0.);
        vec3 normalB = vec3(0.);
        //The regular normals evaluation used forward differences to calculate the gradient.
        if(uFastNormals) {
            vec2 deltaX = index2D(u3D.y * (b0 + vec3(p, 0., 0.)));
            vec2 deltaY = index2D(u3D.y * (b0 + vec3(0., p, 0.)));
            vec2 deltaZ = index2D(u3D.y * (b0 + vec3(0., 0., p)));
            normalA = normalize(-vec3(n0.a - texture(uPot, deltaX).a, n0.a - texture(uPot, deltaY).a, n0.a - texture(uPot, deltaZ).a));

            deltaX = index2D(u3D.y * (b1 + vec3(p, 0., 0.)));
            deltaY = index2D(u3D.y * (b1 + vec3(0., p, 0.)));
            deltaZ = index2D(u3D.y * (b1 + vec3(0., 0., p)));
            normalB = normalize(-vec3(n1.a - texture(uPot, deltaX).a, n1.a - texture(uPot, deltaY).a, n1.a - texture(uPot, deltaZ).a));
        } else {
            //If more smooth gradients are required, a higher order Sobel operator is used to calculate them.
            //this gives a more smoothed surface at the expense of less performance.
            float op = 1.;
            float scaler = 1.;
            vec3 S1A_X = vec3(1., op, 1.);
            vec3 S2A_X = vec3(op, scaler * op, op);
            vec3 S3A_X = vec3(1., op, 1.);
            vec3 S1B_X = vec3(0.);
            vec3 S2B_X = vec3(0.);
            vec3 S3B_X = vec3(0.);
            vec3 S1C_X = vec3(-1., -op, -1.);
            vec3 S2C_X = vec3(-op, -scaler * op, -op);
            vec3 S3C_X = vec3(-1., -op, -1.);
            vec3 S1A_Y = vec3(1., op, 1.);
            vec3 S2A_Y = vec3(0., 0., 0.);
            vec3 S3A_Y = vec3(-1., -op, -1.);
            vec3 S1B_Y = vec3(op, scaler * op, op);
            vec3 S2B_Y = vec3(0., 0., 0.);
            vec3 S3B_Y = vec3(-op, -scaler * op, -op);
            vec3 S1A_Z = vec3(-1., 0., 1.);
            vec3 S2A_Z = vec3(-op, 0., op);
            vec3 S3A_Z = vec3(-1., 0., 1.);
            vec3 S1B_Z = vec3(-op, 0., op);
            vec3 S2B_Z = vec3(-scaler * op, 0., scaler * op);
            vec3 S3B_Z = vec3(-op, 0., op);
            vec3 f1A = vec3(texture(uPot, index2D(u3D.y * (b0 + vec3(-p, p, p)))).a,   texture(uPot, index2D(u3D.y * (b0 + vec3(0., p, p)))).a,   texture(uPot, index2D(u3D.y * (b0 + vec3(p, p, p)))).a);
            vec3 f2A = vec3(texture(uPot, index2D(u3D.y * (b0 + vec3(-p, 0., p)))).a,  texture(uPot, index2D(u3D.y * (b0 + vec3(0., 0., p)))).a,  texture(uPot, index2D(u3D.y * (b0 + vec3(p, 0., p)))).a);
            vec3 f3A = vec3(texture(uPot, index2D(u3D.y * (b0 + vec3(-p, -p, p)))).a,  texture(uPot, index2D(u3D.y * (b0 + vec3(0., -p, p)))).a,  texture(uPot, index2D(u3D.y * (b0 + vec3(p, -p, p)))).a);
            vec3 f1B = vec3(texture(uPot, index2D(u3D.y * (b0 + vec3(-p, p, 0.)))).a,  texture(uPot, index2D(u3D.y * (b0 + vec3(0., p, 0.)))).a,  texture(uPot, index2D(u3D.y * (b0 + vec3(p, p, 0.)))).a);
            vec3 f2B = vec3(texture(uPot, index2D(u3D.y * (b0 + vec3(-p, 0., 0.)))).a, texture(uPot, index2D(u3D.y * (b0 + vec3(0., 0., 0.)))).a, texture(uPot, index2D(u3D.y * (b0 + vec3(p, 0., 0.)))).a);
            vec3 f3B = vec3(texture(uPot, index2D(u3D.y * (b0 + vec3(-p, -p, 0.)))).a, texture(uPot, index2D(u3D.y * (b0 + vec3(0., -p, 0.)))).a, texture(uPot, index2D(u3D.y * (b0 + vec3(p, -p, 0.)))).a);
            vec3 f1C = vec3(texture(uPot, index2D(u3D.y * (b0 + vec3(-p, p, -p)))).a,  texture(uPot, index2D(u3D.y * (b0 + vec3(0., p, -p)))).a,  texture(uPot, index2D(u3D.y * (b0 + vec3(p, p, -p)))).a);
            vec3 f2C = vec3(texture(uPot, index2D(u3D.y * (b0 + vec3(-p, 0., -p)))).a, texture(uPot, index2D(u3D.y * (b0 + vec3(0., 0., -p)))).a, texture(uPot, index2D(u3D.y * (b0 + vec3(p, 0., -p)))).a);
            vec3 f3C = vec3(texture(uPot, index2D(u3D.y * (b0 + vec3(-p, -p, -p)))).a, texture(uPot, index2D(u3D.y * (b0 + vec3(0., -p, -p)))).a, texture(uPot, index2D(u3D.y * (b0 + vec3(p, -p, -p)))).a);
            float xGradient = dot(f1A, S1A_X) + dot(f2A, S2A_X) + dot(f3A, S3A_X) + dot(f1B, S1B_X) + dot(f2B, S2B_X) + dot(f3B, S3B_X) + dot(f1C, S1C_X) + dot(f2C, S2C_X) + dot(f3C, S3C_X);
            float yGradient = dot(f1A, S1A_Y) + dot(f2A, S2A_Y) + dot(f3A, S3A_Y) + dot(f1B, S1B_Y) + dot(f2B, S2B_Y) + dot(f3B, S3B_Y) + dot(f1C, S1A_Y) + dot(f2C, S2A_Y) + dot(f3C, S3A_Y);
            float zGradient = dot(f1A, S1A_Z) + dot(f2A, S2A_Z) + dot(f3A, S3A_Z) + dot(f1B, S1B_Z) + dot(f2B, S2B_Z) + dot(f3B, S3B_Z) + dot(f1C, S1A_Z) + dot(f2C, S2A_Z) + dot(f3C, S3A_Z);
            normalA = vec3(zGradient, yGradient, xGradient);
            f1A = vec3(texture(uPot, index2D(u3D.y * (b1 + vec3(-p, p, p)))).a,   texture(uPot, index2D(u3D.y * (b1 + vec3(0., p, p)))).a,   texture(uPot, index2D(u3D.y * (b1 + vec3(p, p, p)))).a);
            f2A = vec3(texture(uPot, index2D(u3D.y * (b1 + vec3(-p, 0., p)))).a,  texture(uPot, index2D(u3D.y * (b1 + vec3(0., 0., p)))).a,  texture(uPot, index2D(u3D.y * (b1 + vec3(p, 0., p)))).a);
            f3A = vec3(texture(uPot, index2D(u3D.y * (b1 + vec3(-p, -p, p)))).a,  texture(uPot, index2D(u3D.y * (b1 + vec3(0., -p, p)))).a,  texture(uPot, index2D(u3D.y * (b1 + vec3(p, -p, p)))).a);
            f1B = vec3(texture(uPot, index2D(u3D.y * (b1 + vec3(-p, p, 0.)))).a,  texture(uPot, index2D(u3D.y * (b1 + vec3(0., p, 0.)))).a,  texture(uPot, index2D(u3D.y * (b1 + vec3(p, p, 0.)))).a);
            f2B = vec3(texture(uPot, index2D(u3D.y * (b1 + vec3(-p, 0., 0.)))).a, texture(uPot, index2D(u3D.y * (b1 + vec3(0., 0., 0.)))).a, texture(uPot, index2D(u3D.y * (b1 + vec3(p, 0., 0.)))).a);
            f3B = vec3(texture(uPot, index2D(u3D.y * (b1 + vec3(-p, -p, 0.)))).a, texture(uPot, index2D(u3D.y * (b1 + vec3(0., -p, 0.)))).a, texture(uPot, index2D(u3D.y * (b1 + vec3(p, -p, 0.)))).a);
            f1C = vec3(texture(uPot, index2D(u3D.y * (b1 + vec3(-p, p, -p)))).a,  texture(uPot, index2D(u3D.y * (b1 + vec3(0., p, -p)))).a,  texture(uPot, index2D(u3D.y * (b1 + vec3(p, p, -p)))).a);
            f2C = vec3(texture(uPot, index2D(u3D.y * (b1 + vec3(-p, 0., -p)))).a, texture(uPot, index2D(u3D.y * (b1 + vec3(0., 0., -p)))).a, texture(uPot, index2D(u3D.y * (b1 + vec3(p, 0., -p)))).a);
            f3C = vec3(texture(uPot, index2D(u3D.y * (b1 + vec3(-p, -p, -p)))).a, texture(uPot, index2D(u3D.y * (b1 + vec3(0., -p, -p)))).a, texture(uPot, index2D(u3D.y * (b1 + vec3(p, -p, -p)))).a);
            xGradient = dot(f1A, S1A_X) + dot(f2A, S2A_X) + dot(f3A, S3A_X) + dot(f1B, S1B_X) + dot(f2B, S2B_X) + dot(f3B, S3B_X) + dot(f1C, S1C_X) + dot(f2C, S2C_X) + dot(f3C, S3C_X);
            yGradient = dot(f1A, S1A_Y) + dot(f2A, S2A_Y) + dot(f3A, S3A_Y) + dot(f1B, S1B_Y) + dot(f2B, S2B_Y) + dot(f3B, S3B_Y) + dot(f1C, S1A_Y) + dot(f2C, S2A_Y) + dot(f3C, S3A_Y);
            zGradient = dot(f1A, S1A_Z) + dot(f2A, S2A_Z) + dot(f3A, S3A_Z) + dot(f1B, S1B_Z) + dot(f2B, S2B_Z) + dot(f3B, S3B_Z) + dot(f1C, S1A_Z) + dot(f2C, S2A_Z) + dot(f3C, S3A_Z);
            normalB = vec3(zGradient, yGradient, xGradient);
        }
        
        //Save the vertex position, uses a linear interpolation between the two corners points of the edge and the iso value required.
        data1 = vec4(mult.x * b0 + mult.y * b1 + mult.z * b0 + (1. - dot(mult, mult)) * mix(b0, b1, (diff1.x) / (diff1.y)), mcData.b);
        
        //Save the vertex normal, calculate as the pondered median of the two normals from the corners.
        data2 = vec4(normalize(- (n0.a * normalA + n1.a * normalB) / max(n0.a + n1.a, EPSILON)), mcIndex);
        
        //Save the voxel position with the corresponding number of triangles
        data3 = vec4(index2D(data.rgb * u3D.y), currentVertex, 1.);
    }
}
`;



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return renderParticles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return texture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return highResGrid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return lowResGrid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return deferred; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return floor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return floorShadows; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return shadowBoundingBox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return blurShadow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return caustics; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return photonsGather; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return radiance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return raytracer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return renderFloor; });
/* harmony export (immutable) */ __webpack_exports__["g"] = init;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shaders_general_vs_renderParticles_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shaders_general_fs_simpleColor_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shaders_general_fs_simpleTexture_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shaders_general_vs_quad_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shaders_raytracer_vs_highResGrid_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shaders_raytracer_vs_lowResGrid_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shaders_raytracer_vs_deferredTriangles_js__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__shaders_raytracer_fs_deferredTriangles_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__shaders_raytracer_fs_floor_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__shaders_raytracer_vs_floorShadows_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__shaders_raytracer_fs_floorShadows_js__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__shaders_raytracer_fs_boundingBox_js__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__shaders_raytracer_fs_blurShadows_js__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__shaders_raytracer_fs_caustics_js__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__shaders_raytracer_vs_photons_js__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__shaders_raytracer_fs_radiance_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__shaders_raytracer_fs_raytracer_js__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__shaders_raytracer_vs_renderFloor_js__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__shaders_raytracer_fs_renderFloor_js__ = __webpack_require__(39);























//=======================================================================================================
// Shader programs
//=======================================================================================================


let renderParticles;
let texture;
let highResGrid;
let lowResGrid;
let deferred;
let floor;
let floorShadows;
let shadowBoundingBox;
let blurShadow;
let caustics;
let photonsGather;
let radiance;
let raytracer;
let renderFloor;


//=======================================================================================================
// Shader programs initiation
//=======================================================================================================

function init() {

    renderParticles = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_1__shaders_general_vs_renderParticles_js__["a" /* vsParticles */], __WEBPACK_IMPORTED_MODULE_2__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
    renderParticles.positionTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderParticles, "uTexturePosition");
    renderParticles.cameraMatrix = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderParticles, "uCameraMatrix");
    renderParticles.perspectiveMatrix = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderParticles, "uPMatrix");
    renderParticles.scale = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderParticles, "uScale");


    texture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_4__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_3__shaders_general_fs_simpleTexture_js__["a" /* fsTextureColor */]);
    texture.texture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(texture, "uTexture");
    texture.forceAlpha = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(texture, "uForceAlpha");


    highResGrid = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_5__shaders_raytracer_vs_highResGrid_js__["a" /* vsHighResGrid */], __WEBPACK_IMPORTED_MODULE_2__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
    highResGrid.verticesTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(highResGrid, "uVoxels");


    lowResGrid = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_6__shaders_raytracer_vs_lowResGrid_js__["a" /* vsLowResGrid */], __WEBPACK_IMPORTED_MODULE_2__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
    lowResGrid.vertex2DIndex = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getAttribLocation(lowResGrid, "aV2I");
    lowResGrid.gridPartitioning = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(lowResGrid, "uTexture3D");
    lowResGrid.positionTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(lowResGrid, "uPT");


    deferred = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_7__shaders_raytracer_vs_deferredTriangles_js__["a" /* vsDeferredTriangles */], __WEBPACK_IMPORTED_MODULE_8__shaders_raytracer_fs_deferredTriangles_js__["a" /* fsDeferredTriangles */]);
    deferred.vertexRepet = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getAttribLocation(deferred, "aVJ");
    deferred.cameraMatrix = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(deferred, "uCameraMatrix");
    deferred.perspectiveMatrix = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(deferred, "uPMatrix");
    deferred.textureTriangles = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(deferred, "uTT");
    deferred.textureNormals = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(deferred, "uTN");


    floor = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_4__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_9__shaders_raytracer_fs_floor_js__["a" /* fsFloorShader */]);
    floor.backgroundColor = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floor, "uBg");


    floorShadows = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_10__shaders_raytracer_vs_floorShadows_js__["a" /* vsFloorShadows */], __WEBPACK_IMPORTED_MODULE_11__shaders_raytracer_fs_floorShadows_js__["a" /* fsFloorShadows */]);
    floorShadows.textureTriangles = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uTT");
    floorShadows.textureNormals = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uTN");
    floorShadows.iterations = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uMaxSteps");
    floorShadows.maxStepsPerBounce = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uMaxBounceSteps");
    floorShadows.scaler = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uScaler");
    floorShadows.potentialTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uPot");
    floorShadows.texture3DData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uTexture3D");
    floorShadows.lowResPotential = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uLowRes");
    floorShadows.voxelLowData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uVoxelLow");
    floorShadows.lightData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uLightData");
    floorShadows.size = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uSize");
    floorShadows.compactTextureSize = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(floorShadows, "uCompactSize");


    shadowBoundingBox = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_4__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_12__shaders_raytracer_fs_boundingBox_js__["a" /* fsBoundingBox */]);
    shadowBoundingBox.potentialTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(shadowBoundingBox, "uPyT");
    shadowBoundingBox.size = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(shadowBoundingBox, "uSize");


    blurShadow = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_4__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_13__shaders_raytracer_fs_blurShadows_js__["a" /* fsBlurShadows */]);
    blurShadow.shadowTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blurShadow, "uShadows");
    blurShadow.axis = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blurShadow, "uAxis");
    blurShadow.radius = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(blurShadow, "uRadius");


    caustics = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_4__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_14__shaders_raytracer_fs_caustics_js__["a" /* fsCaustics */]);
    caustics.vertexIndex = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getAttribLocation(caustics, "aVI");
    caustics.randomTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uRayTexture");
    caustics.boundingBoxTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uBoundingShadow");
    caustics.potentialTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uPot");
    caustics.lowResPotential = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uLowRes");
    caustics.textureTriangles = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uTT");
    caustics.textureNormals = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uTN");
    caustics.lightPosition = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uLightPosition");
    caustics.absorption = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uAbsorption");
    caustics.texture3DData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uTexture3D");
    caustics.voxelLowData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uVoxelLow");
    caustics.lightColor = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uLightColor");
    caustics.reflectionPhotons = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uReflectionPhotons");
    caustics.scale = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uScale");
    caustics.photonEnergy = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uEnergy");
    caustics.refract = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uRefract");
    caustics.distanceAbsorptionScale = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uAbsorptionDistanceScaler");
    caustics.refractions = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uRefractions");
    caustics.reflections = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uReflections");
    caustics.iterations = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uMaxSteps");
    caustics.maxStepsPerBounce = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uMaxBounceSteps");
    caustics.dispersion = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uDispersion");
    caustics.compactTextureSize = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(caustics, "uCompactSize");


    photonsGather = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_15__shaders_raytracer_vs_photons_js__["a" /* vsPhotons */], __WEBPACK_IMPORTED_MODULE_2__shaders_general_fs_simpleColor_js__["a" /* fsColor */]);
    photonsGather.photonSize = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(photonsGather, "uSize");
    photonsGather.positions = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(photonsGather, "uPositions");
    photonsGather.colors = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(photonsGather, "uColors");


    radiance = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_4__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_16__shaders_raytracer_fs_radiance_js__["a" /* fsRadiance */]);
    radiance.photonTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(radiance, "uPhotons");
    radiance.axis = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(radiance, "uAxis");
    radiance.radius = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(radiance, "uRadius");
    radiance.radiancePower = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(radiance, "uRadiancePower");


    raytracer = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_4__shaders_general_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_17__shaders_raytracer_fs_raytracer_js__["a" /* fsRaytracer */]);
    raytracer.textureTriangles = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uTT");
    raytracer.textureNormals = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uTN");
    raytracer.eyeVector = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uEye");
    raytracer.iterations = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uMaxSteps");
    raytracer.maxStepsPerBounce = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uMaxBounceSteps");
    raytracer.refractions = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uRefractions");
    raytracer.reflections = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uReflections");
    raytracer.refract = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uRefract");
    raytracer.absorption = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uAbsorption");
    raytracer.color = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uColor");
    raytracer.shadeData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uShade");
    raytracer.energyDecay = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uEnergyDecay");
    raytracer.distanceAbsorptionScale = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uAbsorptionDistanceScaler");
    raytracer.backgroundColor = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uBg");
    raytracer.lightData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uLightData");
    raytracer.shadowTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uTShadows");
    raytracer.shadowIntensity = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uShadowIntensity");
    raytracer.scaler = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uScaleShadow");
    raytracer.radianceTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uRadiance");
    raytracer.killRay = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uKillRay");
    raytracer.potentialTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uPot");
    raytracer.texture3DData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uTexture3D");
    raytracer.lowResPotential = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uLowRes");
    raytracer.voxelLowData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uVoxelLow");
    raytracer.positions = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uScreenPositions");
    raytracer.normals = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uScreenNormals");
    raytracer.floorTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uFloor");
    raytracer.lightColor = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uLightColor");
    raytracer.materialColor = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uMaterialColor");
    raytracer.compactTextureSize = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(raytracer, "uCompactSize");

    renderFloor = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_18__shaders_raytracer_vs_renderFloor_js__["a" /* vsRenderFloor */], __WEBPACK_IMPORTED_MODULE_19__shaders_raytracer_fs_renderFloor_js__["a" /* fsRenderFloor */]);
    renderFloor.cameraMatrix = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uCameraMatrix");
    renderFloor.perspectiveMatrix = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uPMatrix");
    renderFloor.backgroundColor = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uBg");
    renderFloor.scaler = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uScaler");
    renderFloor.lightData = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uLightData");
    renderFloor.shadowTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uShadows");
    renderFloor.scaleShadow = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uScaleShadow");
    renderFloor.shadowIntensity = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uShadowIntensity");
    renderFloor.radianceTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uRadiance");
    renderFloor.floorTexture = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uFloor");
    renderFloor.lightColor = __WEBPACK_IMPORTED_MODULE_0__webGL_webGL2_js__["e" /* gl */].getUniformLocation(renderFloor, "uLightColor");

}

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsParticles; });
const vsParticles = `#version 300 es
uniform mat4 uCameraMatrix;
uniform mat4 uPMatrix;

uniform sampler2D uTexturePosition;
uniform float uScale;
uniform vec3 uBucketData;
out vec4 colorData;

void main() {

    int tSize = textureSize(uTexturePosition, 0).x;
    float textureSize = float(tSize);
    vec2 index = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;

    //Positions are in the [0, 128) range, the division normalizes to the space [0 - 1).
    vec3 position = texture(uTexturePosition, index).rgb / uScale;

    if(position.y < 0.) position = vec3(0.);

    colorData.rgb = position;

    colorData.a = 1.;

    gl_Position = uPMatrix * uCameraMatrix * vec4(position, 1.);

    gl_PointSize = 1.;
}
`;




/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsHighResGrid; });
const vsHighResGrid = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform sampler2D uVoxels;

out vec4 colorData;

void main(void) {

    int tSize = textureSize(uVoxels, 0).x;
    float textureSize = float(tSize);
    vec2 index = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;
    
    vec4 data = texture(uVoxels, index);

    colorData = vec4(vec3(float(gl_VertexID)), 1.);

    //Sets the 2D position in the scattered 3D texture, the offset is used as Z value for depth test.
    gl_Position = vec4(data.rg * 2. - vec2(1.), data.z / 16., 1.);
    gl_PointSize = 1.;
}
`;



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsLowResGrid; });
const vsLowResGrid = `#version 300 es

precision highp float;
precision highp sampler2D;
uniform vec3 uTexture3D;
uniform highp sampler2D uPT;

out vec4 colorData;

void main(void) {
    colorData = vec4(float(gl_VertexID));
    
    int tSize = textureSize(uPT, 0).x;
    float textureSize = float(tSize);
    vec2 index = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;
    
    vec3 gPP = floor(texture(uPT, index).rgb * uTexture3D.y);
    vec2 gP = 2. * uTexture3D.x * (gPP.xz + uTexture3D.y * vec2(mod(gPP.y, uTexture3D.z), floor(gPP.y / uTexture3D.z)) + vec2(0.5)) - vec2(1.);
    gl_PointSize = 1.;
    gl_Position = vec4(gP, 0., 1.0);
    
}


`;



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsDeferredTriangles; });
const vsDeferredTriangles = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform mat4 uCameraMatrix;
uniform mat4 uPMatrix;
uniform highp sampler2D uTT;
uniform highp sampler2D uTN;

out vec3 position;
out vec3 normal;

void main(void) {

    int tSize = textureSize(uTT, 0).x;
    float textureSize = float(tSize);
    vec2 uv = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;
    
    position = texture(uTT, uv).rgb;
    normal = texture(uTN, uv).rgb;
    
    gl_Position = uPMatrix * uCameraMatrix * vec4(position, 1.0);
    
}

`;



/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsDeferredTriangles; });
const fsDeferredTriangles = `#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 uv;

uniform sampler2D uTT;
uniform sampler2D uTN;

in vec3 position;
in vec3 normal;

layout(location = 0) out vec4 trianglesPositions;
layout(location = 1) out vec4 trianglesNormals;

void main() {

    trianglesPositions = vec4(position, 1.);
    trianglesNormals = vec4(normal, 1.);
    
}

`;



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsFloorShader; });
const fsFloorShader = `#version 300 es

precision highp sampler2D;
precision highp float;

uniform float uBg;

in vec2 uv;
out vec4 colorData;

mat3 rotY(float g) {
    g = radians(g);
    vec2 a = vec2(cos(g), sin(g));
    return mat3(a.x, 0.0, a.y,
                0.0, 1.0, 0.0,
                -a.y, 0.0, a.x);
}

void main(void) {

    vec3 color = vec3(1.);

   //Lines for the grid
   // color *= clamp(step(mod(uv.x, .1), 0.095) * step(mod(uv.y, .1), 0.095), 0.5, 1.);
   // color *= clamp(step(mod(uv.x, 1.), 0.985) * step(mod(uv.y, 1.), 0.985), 0.3, 1.);


//    color = mix(color, vec3(0.), vec3(step(mod(uv.x - 0.07, .5), 0.25)));


    colorData = vec4(color, 1.);

}
`;



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsFloorShadows; });
const vsFloorShadows = `#version 300 es

uniform float uScaler;

out vec3 vNor;
out vec3 vPos;
out vec2 vText;

void main(void) {
    float vI = float(gl_VertexID) + 1.;
    vec2 xy = vec2(mod(vI, 2.) == 0. ? -1. : 1., -1. + 2. * step(-vI, -2.1));
    vec2 position = xy;
    vText = 0.5 * xy + 0.5;
    xy = uScaler * (0.5 * xy + 0.5) - floor(uScaler * 0.5);
    vPos = vec3(xy.x, 0., xy.y);
    vNor = vec3(0., 1., 0.);
    gl_Position = vec4(position, 0., 1.);
}

`;




/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsFloorShadows; });
const fsFloorShadows = `#version 300 es

 precision highp sampler2D;
 precision highp float;
 uniform sampler2D uPot;
 uniform sampler2D uTT;
 uniform sampler2D uTN;
 uniform sampler2D uLowRes;

 uniform int uMaxSteps;
 uniform int uMaxBounceSteps;
 uniform vec3 uTexture3D;
 uniform vec3 uVoxelLow;
 uniform vec4 uLightData;
 uniform float uSize;
 uniform float uCompactSize;

 in vec3 vNor;
 in vec3 vPos;
 in vec2 vText;
 
 const float EPSILON = 1.e-10 ;
 const float E = 0.00;
 const float e = 2.71828;
 const float acne = 0.000001;

 const vec3 bordersLimits = vec3(1.1, 1.1, 1.1);
 vec3 limits;
 vec3 limits_l;

 const vec3 yVector = vec3(0., 1., 0.);
 float R0;
 
 layout(location = 0) out vec4 data0;
 layout(location = 1) out vec4 data1;

 vec2 index2D(vec3 pos, vec3 voxelData) {
     return (pos.xz + voxelData.y * vec2(mod(pos.y, voxelData.z), floor(pos.y / voxelData.z)) + vec2(0.5)) / voxelData.x;
 }

 vec2 index_triangles(float index) {
     return (vec2(mod(index, uCompactSize), floor(index / uCompactSize)) + vec2(0.5)) / uCompactSize;
 }

 float triangleIntersect(float index, vec3 rayOrigin, vec3 rayDirection, out vec2 UV) {
      vec3 v1 = texture(uTT, index_triangles(index)).rgb;
      vec3 v2 = texture(uTT, index_triangles(index + 1.)).rgb;
      vec3 v3 = texture(uTT, index_triangles(index + 2.)).rgb;
      vec3 e1 = v2 - v1;
      vec3 e2 = v3 - v1;
      vec3 p = cross(rayDirection, e2);
      float det = dot(e1, p);
      if(abs(det) < EPSILON) return -1.;
      vec3 t = rayOrigin - v1;
      vec3 q = cross(t, e1);
      vec3 tri = vec3(dot(t, p), dot(rayDirection, q), dot(e2, q)) / det;
      UV = tri.xy;
      if(tri.x + tri.y <= 1. && all(greaterThanEqual(tri.xy, vec2(0.)))) return tri.z;
      return -1.;
 }

   float boxIntersect( in vec3 ro, in vec3 rd, in vec3 rad ) {
    vec3 m = 1.0/rd;
    vec3 n = m*ro;
    vec3 k = abs(m)*rad;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
    float tN = max( max( t1.x, t1.y ), t1.z );
    float tF = min( min( t2.x, t2.y ), t2.z );
    if( tN > tF || tF < 0.0) return -1.;
    return tN;
   }

 float rayTrace(vec3 initPos,  vec3 rayDirection) {

    const int maxIter = 600;
    limits = vec3(uTexture3D.y) * bordersLimits;
    limits_l = vec3(uVoxelLow.y) * bordersLimits;
 
    vec3 bouncesLimits = vec3(1, uMaxSteps, uMaxBounceSteps);
    bool inside = true;
    float distanceTraveled = 0.;
    int maxStepsPerBounce = 0;
    int bounces = 0;

    vec3 deltaDist = abs(1. / max(abs(rayDirection), vec3(EPSILON)));
    vec3 rayStep = sign(rayDirection);
    vec3 stepForward;
    float changeToHigh = uTexture3D.y / uVoxelLow.y;
    float changeToLow = uVoxelLow.y / uTexture3D.y;
    float t = 0.;

    initPos += acne * rayDirection;

    vec3 pos = uTexture3D.y * initPos;
    vec3 mapPos = floor(pos);
    vec3 sideDist =  (rayStep * (mapPos - pos + 0.5) + 0.5) * deltaDist;

    bool highResolution = true;
    bool resolution = true;
    vec3 mapPos_h = mapPos;
    vec3 mapPos_l = floor(pos * changeToLow);
    vec3 pos0_l = pos * changeToLow;
    vec3 pos0_h = pos;
    float voxelIndex = 0.;
    vec2 UV = vec2(0.);
    vec2 _UV = vec2(0.);

    for(int i = 0; i < maxIter; i ++) {

        bool stepsLimits = any(greaterThanEqual(vec3(bounces, i, maxStepsPerBounce), bouncesLimits));
        bool borders = any(lessThan(mapPos, vec3(0.))) || any(greaterThan(mapPos_h, limits)) || any(greaterThan(mapPos_l, limits_l));

        t = min(sideDist.x, min(sideDist.y, sideDist.z));

        stepForward = step(sideDist.xyz, sideDist.yxy) * step(sideDist.xyz, sideDist.zzx);

        sideDist += stepForward * deltaDist;
        pos += stepForward * rayStep;
        mapPos = floor(pos);
    	maxStepsPerBounce ++;

        if(borders || stepsLimits) return -1.;

        resolution = texture(uLowRes, index2D(mix(mapPos, floor(mapPos * changeToLow), float(highResolution)), uVoxelLow)).r > 0.;

        if(highResolution) {

            mapPos_h = mapPos;

            if(!resolution) {

                highResolution = false;
                pos0_l = changeToLow * (pos0_h + t * rayDirection);
                pos = pos0_l;
                mapPos = floor(pos);
                sideDist =  (rayStep * (mapPos - pos + 0.5) + 0.5) * deltaDist;

            } else {

                voxelIndex = texture(uPot, index2D(mapPos, uTexture3D)).r;

                if(voxelIndex > 0.) {

                    float comparator = 1e10;
                    float param = 1e10;
                    float partialIndex = 0.;
                    float q = 0.;
                    float numberOfTriangles = texture(uTT, index_triangles(voxelIndex)).a;

                    //Evaulate triangles with if branching.
                    comparator = triangleIntersect(voxelIndex, initPos, rayDirection, UV);
                    if(comparator > 0. && comparator < param) {
                        param = comparator;
                        _UV = UV;
                        partialIndex = 0.;
                    }

                    if(numberOfTriangles > 1.) {

                        comparator = triangleIntersect(voxelIndex + 3., initPos, rayDirection, UV);
                        if(comparator > 0. && comparator < param) {
                            param = comparator;
                            _UV = UV;
                            partialIndex = 3.;
                        }

                        if(numberOfTriangles > 2.) {

                            comparator = triangleIntersect(voxelIndex + 6., initPos, rayDirection, UV);
                            if(comparator > 0. && comparator < param) {
                                param = comparator;
                                _UV = UV;
                                partialIndex = 6.;
                            }

                            if(numberOfTriangles > 3.) {

                                comparator = triangleIntersect(voxelIndex + 9., initPos, rayDirection, UV);
                                if(comparator > 0. && comparator < param) {
                                    param = comparator;
                                    _UV = UV;
                                    partialIndex = 9.;
                                }

                                if(numberOfTriangles > 4.) {

                                    comparator = triangleIntersect(voxelIndex + 12., initPos, rayDirection, UV);
                                    if(comparator > 0. && comparator < param) {
                                        param = comparator;
                                        _UV = UV;
                                        partialIndex = 12.;
                                    }

                                }

                            }

                        }

                    }

                    if(param > 0. && param < 10.) return param;
                }
            }

        } else {

            mapPos_l = mapPos;

            if(resolution) {

                highResolution = true;
                pos0_h = changeToHigh * (pos0_l + 0.99 * t * rayDirection);
                pos = pos0_h;
                mapPos = floor(pos);
                sideDist = (rayStep * (mapPos - pos + 0.5) + 0.5) * deltaDist;
            }
        }

        highResolution = resolution;
    }

     return -1.;
  }



 void main(void) {

    vec3 lightVector = uLightData.rgb - vPos;
    float intensity = 0.;
    vec3 rayDirection = normalize(lightVector);
    vec3 initialPosition = vPos;
    bool shadows = false;
    vec2 posShadows = vec2(0.5);
    float distance = 0.;

    if(all(bvec4(vPos.x >= 0., vPos.x <= 1., vPos.z >= 0., vPos.z <= 1.))) {
        distance = rayTrace(initialPosition, rayDirection);
    } else {
        float t = boxIntersect(vPos - vec3(0.5, 1.0, 0.5), rayDirection, vec3(.5, 1., .5));
        if(t > 0.) {
            initialPosition += 1.01 * t * rayDirection;
            distance = rayTrace(initialPosition, rayDirection);
        }
    }

    if(distance > 0.) {
        intensity = 1.;
        posShadows = gl_FragCoord.xy / uSize;
//        distance *= 2.;
//        distance = 1. / (1. + distance * distance);
    }

    data0 = vec4(intensity, distance, 1., 1.);
    data1 = vec4(posShadows, posShadows);

}

`;



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsBoundingBox; });
const fsBoundingBox = `#version 300 es

precision highp float;
precision highp sampler2D;
uniform sampler2D uPyT;
uniform float uSize;
in vec2 uv;

out vec4 colorData;

void main(void) {

    float k = 0.5 * uSize;
    vec2 position = floor(vec2(gl_FragCoord.x, gl_FragCoord.y)) * uSize;

    vec4 data0 = texture(uPyT,  position + vec2(0., 0.));
    vec4 data1 = texture(uPyT,  position + vec2(0., k));
    vec4 data2 = texture(uPyT,  position + vec2(k, 0.));
    vec4 data3 = texture(uPyT,  position + vec2(k, k));

    colorData = vec4(min(min(data0.rg, data1.rg), min(data2.rg, data3.rg)), max(max(data0.ba, data1.ba), max(data2.ba, data3.ba)));
}
`;



/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsBlurShadows; });
const fsBlurShadows = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform sampler2D uShadows;
uniform float uRadius;
uniform vec2 uAxis;

in vec2 uv;

const float e = 2.7182818284;
const float alpha = 1.;
const float beta = 1.;
const float PI = 3.141592653;

out vec4 colorData;

void main(void) {

    vec4 data = texture(uShadows, uv);

    float shadows = 0.;
    float r = (uRadius + .5) * max(data.g * 3., 1.);
    float r2 = r * r;

    if(uRadius > 0.) {
        for(float i = 0.; i <= r;i ++)  {
            if(i == 0.) shadows += alpha * (1. - (1. - pow(e, - 0.5 * beta * i * i / r2)) / (1. - pow(e, -beta))) * data.r;
            else shadows += alpha * (1. - (1. - pow(e, - 0.5 * beta * i * i / r2)) / (1. - pow(e, -beta))) * (texture(uShadows, uv + i * uAxis).r + texture(uShadows, uv - i * uAxis).r);
        }
        shadows /= sqrt(PI * r2);
    }

    else shadows = data.r;
    colorData = vec4(shadows, data.gba);
}

`;



/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsCaustics; });
const fsCaustics = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform sampler2D   uRayTexture;
uniform sampler2D   uBoundingShadow;
uniform sampler2D   uPot;
uniform sampler2D   uLowRes;
uniform sampler2D   uTT;
uniform sampler2D   uTN;
uniform vec3        uLightPosition;
uniform vec3        uAbsorption;
uniform vec3        uTexture3D;
uniform vec3        uVoxelLow;
uniform vec3        uLightColor;
uniform float       uReflectionPhotons;
uniform float       uScale;
uniform float       uEnergy;
uniform float       uRefract;
uniform float       uAbsorptionDistanceScaler;
uniform float       uDispersion;
uniform float       uCompactSize;
uniform int         uRefractions;
uniform int         uReflections;
uniform int         uMaxSteps;
uniform int         uMaxBounceSteps;


const float EPSILON = 1.e-10 ;
const float E = 0.00;
const float e = 2.71828;
const float acne = 0.00001;

const vec3 bordersLimits = vec3(1.1, 1.1, 1.1);
vec3 limits;
vec3 limits_l;

vec4 photon = vec4(0.);

in vec2 uv;

layout(location = 0) out vec4 data0;
layout(location = 1) out vec4 data1;

  //Based on Simon Green box ray intersection no lo ha hehco.... Jaume me lo dijo
  float boxRay(vec3 ro, vec3 rd, vec3 boxmin, vec3 boxmax) {
    vec3 invR = 1. / rd;
    vec3 tbot = invR * (boxmin - ro);
    vec3 ttop = invR * (boxmax - ro);
    vec3 tmin = min(ttop, tbot);
    vec3 tmax = max(ttop, tbot);
    vec2 t0 = max(tmin.xx, tmin.yz);
    float tnear = max(t0.x, t0.y);
    t0 = min(tmax.xx, tmax.yz);
    float tfar = min(t0.x, t0.y);
    if( tnear > tfar || tfar < 0.0) return -1.;
    return tnear;
  }

   vec2 index2D(vec3 pos, vec3 voxelData) {
       return (pos.xz + voxelData.y * vec2(mod(pos.y, voxelData.z), floor(pos.y / voxelData.z)) + vec2(0.5)) / voxelData.x;
   }

   vec2 index_triangles(float index) {
       return (vec2(mod(index, uCompactSize), floor(index / uCompactSize)) + vec2(0.5)) / uCompactSize;
   }

    bool planeIntersect(vec3 rayOrigin, vec3 rayDirection, vec3 planeNormal, float d, out float param) {
       param = -1.;
       float ang = dot(rayDirection, planeNormal);
       if(ang > EPSILON || ang == 0.) return false;
       param = -(dot(rayOrigin, planeNormal) - d) / ang;
       return param >= 0.;
    }


  float triangleIntersect(float index, vec3 rayOrigin, vec3 rayDirection, out vec2 UV) {
       vec3 v1 = texture(uTT, index_triangles(index)).rgb;
       vec3 v2 = texture(uTT, index_triangles(index + 1.)).rgb;
       vec3 v3 = texture(uTT, index_triangles(index + 2.)).rgb;
       vec3 e1 = v2 - v1;
       vec3 e2 = v3 - v1;
       vec3 p = cross(rayDirection, e2);
       float det = dot(e1, p);
       if(abs(det) < EPSILON) return -1.;
       vec3 t = rayOrigin - v1;
       vec3 q = cross(t, e1);
       vec3 tri = vec3(dot(t, p), dot(rayDirection, q), dot(e2, q)) / det;
       UV = tri.xy;
       if(tri.x + tri.y <= 1. && all(greaterThanEqual(tri.xy, vec2(0.)))) return tri.z;
       return -1.;
  }

 vec3 rayTrace(vec3 initPos,  vec3 rayDirection,  int rayType,  int totalBounces, out vec3 color) {
 
    limits = vec3(uTexture3D.y) * bordersLimits;
    limits_l = vec3(uVoxelLow.y) * bordersLimits;
    vec3 hitPoint = vec3(0.);
    const int maxIter = 600;
    vec3 normal = vec3(0.);
    vec3 bouncesLimits = vec3(totalBounces, uMaxSteps, uMaxBounceSteps);
    bool inside = true;
    float distanceTraveled = 0.;
    int maxStepsPerBounce = 0;
    int bounces = 0;
    vec3 deltaDist = abs(1. / max(abs(rayDirection), vec3(EPSILON)));
    vec3 rayStep = sign(rayDirection);
    vec3 stepForward;
    float changeToHigh = uTexture3D.y / uVoxelLow.y;
    float changeToLow = uVoxelLow.y / uTexture3D.y;
    float t = 0.;
    initPos += acne * rayDirection;
    vec3 pos = uTexture3D.y * initPos;
    vec3 mapPos = floor(pos);
    vec3 sideDist =  (rayStep * (mapPos - pos + 0.5) + 0.5) * deltaDist;
    bool highResolution = true;
    bool resolution = true;
    vec3 mapPos_h = mapPos;
    vec3 mapPos_l = floor(pos * changeToLow);
    vec3 pos0_l = pos * changeToLow;
    vec3 pos0_h = pos;
    float voxelIndex = 0.;
    vec2 UV = vec2(0.);
    vec2 _UV = vec2(0.);
    float tPlane = 0.;


    //Traverse the 3D grid
    for(int i = 0; i < maxIter; i ++) {
        bool stepsLimits = any(greaterThanEqual(vec3(bounces, i, maxStepsPerBounce), bouncesLimits));
        bool borders = any(lessThan(mapPos, vec3(0.))) || any(greaterThan(mapPos_h, limits)) || any(greaterThan(mapPos_l, limits_l));
        t = min(sideDist.x, min(sideDist.y, sideDist.z));
        stepForward = step(sideDist.xyz, sideDist.yxy) * step(sideDist.xyz, sideDist.zzx);
        sideDist += stepForward * deltaDist;
        pos += stepForward * rayStep;
        mapPos = floor(pos);
    	maxStepsPerBounce ++;

         if(borders || stepsLimits) {
            //out of bounds
            if(planeIntersect(initPos, rayDirection, vec3(0., 1., 0.), 0.0, tPlane)) hitPoint = initPos + tPlane * rayDirection;
            if(rayType == 1) color *= pow(vec3(e), -distanceTraveled * uAbsorption * uAbsorptionDistanceScaler);
//            color *= max(dot(-rayDirection, vec3(0., 1., 0.)), 0.);
            return hitPoint;
         }

        resolution = texture(uLowRes, index2D(mix(mapPos, floor(mapPos * changeToLow), float(highResolution)), uVoxelLow)).r > 0.;
        if(highResolution) {
            mapPos_h = mapPos;
            if(!resolution) {
                highResolution = false;
                pos0_l = changeToLow * (pos0_h + t * rayDirection);
                pos = pos0_l;
                mapPos = floor(pos);
                sideDist =  (rayStep * (mapPos - pos + 0.5) + 0.5) * deltaDist;
            } else {
                voxelIndex = texture(uPot, index2D(mapPos, uTexture3D)).r;
                //There's a hit with a high resolution voxel
                if(voxelIndex > 0.) {
                    float comparator = 1e10;
                    float param = 1e10;
                    float partialIndex = 0.;
                    float q = 0.;
                    float numberOfTriangles = texture(uTT, index_triangles(voxelIndex)).a;
                    //Evaulate triangles with if branching. Much faster then using a for loop
                    comparator = triangleIntersect(voxelIndex, initPos, rayDirection, UV);
                    if(comparator > 0. && comparator < param) {
                        param = comparator;
                        _UV = UV;
                        partialIndex = 0.;
                    }
                    if(numberOfTriangles > 1.) {
                        comparator = triangleIntersect(voxelIndex + 3., initPos, rayDirection, UV);
                        if(comparator > 0. && comparator < param) {
                            param = comparator;
                            _UV = UV;
                            partialIndex = 3.;
                        }
                        if(numberOfTriangles > 2.) {
                            comparator = triangleIntersect(voxelIndex + 6., initPos, rayDirection, UV);
                            if(comparator > 0. && comparator < param) {
                                param = comparator;
                                _UV = UV;
                                partialIndex = 6.;
                            }
                            if(numberOfTriangles > 3.) {
                                comparator = triangleIntersect(voxelIndex + 9., initPos, rayDirection, UV);
                                if(comparator > 0. && comparator < param) {
                                    param = comparator;
                                    _UV = UV;
                                    partialIndex = 9.;
                                }
                                if(numberOfTriangles > 4.) {
                                    comparator = triangleIntersect(voxelIndex + 12., initPos, rayDirection, UV);
                                    if(comparator > 0. && comparator < param) {
                                        param = comparator;
                                        _UV = UV;
                                        partialIndex = 12.;
                                    }
                                }
                            }
                        }
                    }
                    float index = partialIndex + voxelIndex;

                    //There's a hit with a triangle
                     if(param > 0. && param < 10.) {

                        color = vec3(1.);

                        float refractValue = uRefract;

                         if(uDispersion > 0. && rayType == 1) {
                              float module = mod(photon.w, 3.);
                              if(module == 0.) color = vec3(0., 1., 0.);
                              if(module == 1.) color = vec3(1., 0., 0.);
                              if(module == 2.) color = vec3(0., 0., 1.);
                              refractValue = uRefract;
                              if(module == 1.) refractValue = uRefract - uDispersion;
                              if(module == 2.) refractValue = uRefract + uDispersion;
                         }

                         maxStepsPerBounce = 0;
                         vec3 prevPos = initPos;
                         vec3 advance = rayDirection * param;
                         initPos += advance;

                         vec3 ll = vec3(_UV, 1.0 - _UV.x - _UV.y);
                         normal = ll.z * texture(uTN, index_triangles(index)).rgb + ll.x * texture(uTN, index_triangles(index + 1.)).rgb + ll.y * texture(uTN, index_triangles(index + 2.)).rgb;
                         vec3 prevRay = rayDirection;
                         inside = dot(normal, rayDirection) > 0.;
                         vec3 n = inside ? -normal : normal;
                         if(rayType == 1 && inside) distanceTraveled += param;
                         rayDirection = rayType == 1 ? refract(rayDirection, n, inside ? refractValue : 1. / refractValue) : rayDirection = reflect(rayDirection, normal);
                         //Handling total internal reflection.
                         if(rayType == 1 && length(rayDirection) == 0.) {
                           rayDirection = reflect(prevRay, n);
                           inside = true;
                         }
                         initPos += acne * rayDirection;
                         deltaDist = abs(1. / max(abs(rayDirection), vec3(EPSILON)));
                         rayStep = sign(rayDirection);
                         pos = uTexture3D.y * initPos;
                         pos0_h = pos;
                         pos0_l = changeToLow * pos;
                         mapPos = floor(pos);
                         sideDist = (rayStep * (mapPos - pos) + (rayStep * 0.5) + 0.5) * deltaDist;
                         bounces++;
                     }
                }
            }
        } else {
            mapPos_l = mapPos;
            //There's a hit with a low resolution voxel.
            if(resolution) {
                highResolution = true;
                pos0_h = changeToHigh * (pos0_l + 0.99 * t * rayDirection);
                pos = pos0_h;
                mapPos = floor(pos);
                sideDist = (rayStep * (mapPos - pos + 0.5) + 0.5) * deltaDist;
            }
        }
        highResolution = resolution;
    }

     return hitPoint;
  }

void main(void) {

    photon = texture(uRayTexture, uv);
    int rayType = photon.z > uReflectionPhotons ? 1 : 0;
    vec4 position = vec4(1000000., 1000000., 0., 1.);
    vec3 color = vec3(0.);
    vec4 boundingBox = texture(uBoundingShadow, vec2(0.5));

    //Floor position based on white noise
    vec2 st = (2. * (boundingBox.xy + photon.xy * (boundingBox.zw - boundingBox.xy)) - 1.);
    vec3 floorPosition = uScale * vec3(st.x, 0., st.y) + vec3(0.5, 0., 0.5);
    vec3 ray = normalize(floorPosition - uLightPosition);

    float halfScale = 0.5 * uScale;
    //Based on box ray intersection from Simon Green
    float t = boxRay(uLightPosition, ray, vec3(0.), vec3(1.));


    if(t > 0.) {
        vec3 lightPosition = uLightPosition + t * ray;

        vec3 planeHit = rayTrace(lightPosition, ray, rayType, rayType == 1 ? uRefractions : uReflections, color);
        if(planeHit != vec3(0.)) {
            color = uEnergy * color * uLightColor;
            position.xy = planeHit.xz - vec2(0.5);
        }
        position.xy /= halfScale;
    }

    else st = vec2(100000.);

    data0 = vec4(position.xy, 0., 1.);
    data1 = vec4(color, 1.);
}
`;




/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsPhotons; });
const vsPhotons = `#version 300 es

uniform sampler2D uPositions;
uniform sampler2D uColors;
uniform float uSize;

out vec4 colorData;

void main(void) {

    int tSize = textureSize(uPositions, 0).x;
    float textureSize = float(tSize);
    vec2 index = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;

    colorData = texture(uColors, index);
    gl_Position = texture(uPositions, index);
    gl_PointSize = uSize;

}

`;



/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsRadiance; });
const fsRadiance = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform sampler2D uPhotons;
uniform float uRadius;

in vec2 uv;
out vec4 colorData;

const float e = 2.7182818284;
const float alpha = 0.918;
const float beta = 1.953;
const float PI = 3.141592653;

uniform float uRadiancePower;
uniform vec2 uAxis;

void main(void) {

    float r = uRadius + .5;
    float r2 = r * r;

    vec3 radiance = vec3(0.);

    if(uRadius > 0.) {
        //Radiance estimation using a Gaussian Filter, based on: https://graphics.stanford.edu/courses/cs348b-01/course8.pdf
        for(float i = 0.; i <= r; i ++)  {
            vec4 data = texture(uPhotons, uv);
            if(i == 0.) radiance += alpha * (1. - (1. - pow(e, - 0.5 * beta * i * i / r2)) / (1. - pow(e, -beta))) * data.rgb / max(pow(data.a, uRadiancePower), 1.);
            else {
                float k = alpha * (1. - (1. - pow(e, - 0.5 * beta * i * i / r2)) / (1. - pow(e, -beta)));
                vec4 data1 = texture(uPhotons, uv + i * uAxis);
                vec4 data2 = texture(uPhotons, uv - i * uAxis);
                radiance += k * data1.rgb / max(pow(data1.a, uRadiancePower), 1.);
                radiance += k * data2.rgb / max(pow(data2.a, uRadiancePower), 1.);
            }
        }

        radiance /= sqrt(PI * r2);
    }

    else radiance = texture(uPhotons, uv).rgb;

    colorData = vec4(radiance, 1.);
}

`;



/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsRaytracer; });
const fsRaytracer = `#version 300 es

 precision highp sampler2D;
 precision highp float;
 
 uniform sampler2D uPot;
 uniform sampler2D uTT;
 uniform sampler2D uTN;
 uniform sampler2D uScreenPositions;
 uniform sampler2D uScreenNormals;
 uniform sampler2D uFloor;
 uniform sampler2D uLowRes;
 uniform int uMaxSteps;
 uniform int uMaxBounceSteps;
 uniform float uRefract;
 uniform int uReflections;
 uniform int uRefractions;
 uniform float uShadows;
 uniform vec3 uAbsorption;
 uniform vec3 uEye;
 uniform bool uDisableAcceleration;
 uniform vec3 uTexture3D;
 uniform vec3 uVoxelLow;
 uniform vec4 uShade;
 uniform float uAbsorptionDistanceScaler;
 uniform float uBg;
 uniform vec4 uLightData;
 uniform sampler2D uTShadows;
 uniform float uScaleShadow;
 uniform float uShadowIntensity;
 uniform sampler2D uRadiance;
 uniform float uColor;
 uniform float uEnergyDecay;
 uniform float uKillRay;
 uniform vec3 uLightColor;
 uniform vec3 uMaterialColor;
 uniform float uCompactSize;

 in vec2 uv;
 out vec4 colorData;

 const float EPSILON = 1.e-10 ;
 const float e = 2.71828;
 const float acne = 0.00001;

 const vec3 bordersLimits = vec3(1.1, 1.1, 1.1);
 vec3 limits;
 vec3 limits_l;

 float counter = 0.;

 const vec3 yVector = vec3(0., 1., 0.);
 float R0;

 mat3 rotY(float g) {
    g = radians(g);
    vec2 a = vec2(cos(g), sin(g));
    return mat3(a.x, 0.0, a.y,
                0.0, 1.0, 0.0,
                -a.y, 0.0, a.x);
 }

 vec3 lightShade(vec3 matColor, vec3 eye, vec3 norm, vec3 light) {

     float specular = pow(max(dot(normalize(reflect(light, norm)), -eye), 0.), uShade.w);
     float diffuse = max(dot(light, norm), 0.);
     return uShade.x * specular * vec3(1.) + uShade.y * diffuse * matColor * uLightColor;
;
 }

 vec2 index2D(vec3 pos, vec3 voxelData) {
     return (pos.xz + voxelData.y * vec2(mod(pos.y, voxelData.z), floor(pos.y / voxelData.z)) + vec2(0.5)) / voxelData.x;
 }

 vec2 index_triangles(float index) {
     return (vec2(mod(index, uCompactSize), floor(index / uCompactSize)) + vec2(0.5)) / uCompactSize;
 }

 float triangleIntersect(float index, vec3 rayOrigin, vec3 rayDirection, out vec2 UV) {

      vec3 v1 = texture(uTT, index_triangles(index)).rgb;
      vec3 v2 = texture(uTT, index_triangles(index + 1.)).rgb;
      vec3 v3 = texture(uTT, index_triangles(index + 2.)).rgb;

      vec3 e1 = v2 - v1;
      vec3 e2 = v3 - v1;

      vec3 p = cross(rayDirection, e2);
      float det = dot(e1, p);
      if(abs(det) < EPSILON) return -1.;
      vec3 t = rayOrigin - v1;
      vec3 q = cross(t, e1);
      vec3 tri = vec3(dot(t, p), dot(rayDirection, q), dot(e2, q)) / det;
      UV = tri.xy;
      if(tri.x + tri.y <= 1. && all(greaterThanEqual(tri.xy, vec2(0.)))) return tri.z;
      return -1.;
 }

 bool planeIntersect(vec3 rayOrigin, vec3 rayDirection, vec3 planeNormal, float d, out float param) {
    param = -1.;
    float ang = dot(rayDirection, planeNormal);
    if(ang == 0.) return false;
    param = -(dot(rayOrigin, planeNormal) - d) / ang;
    return param >= 0.;
 }

float sphereIntersect(vec3 rayOrigin, vec3 rayDirection, vec3 center, float radius) {
 vec3 op = center - rayOrigin;
 float t = 0.;
 float epsilon = 1e-10;
 float b = dot(op, rayDirection);
 float disc = b * b - dot(op, op) + radius * radius;
 if(disc < 0.) return 0.;
 disc = sqrt(disc);
 return (t = b - disc) > epsilon ? t : ((t = b + disc) > epsilon ? t : 0.);
}

 float Fresnel(in vec3 incom, in vec3 normal, in float index_internal, in float index_external) {
 	float eta = index_internal / index_external;
 	float cos_theta1 = dot(incom, normal);
 	float cos_theta2 = 1.0 - (eta * eta) * (1.0 - cos_theta1 * cos_theta1);

 	if (cos_theta2 < 0.0) return 1.0;

 	else {
 		cos_theta2 = sqrt(cos_theta2);
 		float fresnel_rs = (index_internal * cos_theta1 - index_external * cos_theta2) / (index_internal * cos_theta1 + index_external * cos_theta2);
 		float fresnel_rp = (index_internal * cos_theta2 - index_external * cos_theta1) / (index_internal * cos_theta2 + index_external * cos_theta1);
 		return (fresnel_rs * fresnel_rs + fresnel_rp * fresnel_rp) * 0.5;
 	}
 }

  vec3 floorShade(vec3 matColor, vec3 light) {
      return max(dot(light, yVector), 0.) * matColor * uLightColor;
  }

 vec3 rayTrace( vec3 eye, vec3 initPos,  vec3 rayDirection,  int rayType,  int totalBounces) {
 
    limits = vec3(uTexture3D.y) * bordersLimits;
    limits_l = vec3(uVoxelLow.y) * bordersLimits;
    vec3 color = pow(vec3(uBg), vec3(2.2));
    vec3 normal = vec3(0.);
    const int maxIter = 1200;
    vec3 bouncesLimits = vec3(totalBounces, uMaxSteps, uMaxBounceSteps);
    bool inside = true;
    float distanceTraveled = 0.;
    int maxStepsPerBounce = 0;
    int bounces = 0;

    vec3 deltaDist = abs(1. / max(abs(rayDirection), vec3(EPSILON)));
    vec3 rayStep = sign(rayDirection);
    vec3 stepForward;
    float changeToHigh = uTexture3D.y / uVoxelLow.y;
    float changeToLow = uVoxelLow.y / uTexture3D.y;
    float t = 0.;

    initPos += acne * rayDirection;

    vec3 pos = uTexture3D.y * initPos;
    vec3 mapPos = floor(pos);
    vec3 sideDist =  (rayStep * (mapPos - pos + 0.5) + 0.5) * deltaDist;

    bool highResolution = true;
    bool resolution = true;
    vec3 mapPos_h = mapPos;
    vec3 mapPos_l = floor(pos * changeToLow);
    vec3 pos0_l = pos * changeToLow;
    vec3 pos0_h = pos;
    float tPlane = 0.;
    float voxelIndex = 0.;
    vec2 UV = vec2(0.);
    vec2 _UV = vec2(0.);
    float tPlane2 = 100000.;


    for(int i = 0; i < maxIter; i ++) {

        bool stepsLimits = any(greaterThanEqual(vec3(bounces, i, maxStepsPerBounce), bouncesLimits));
        bool borders = any(lessThan(mapPos, vec3(0.))) || any(greaterThan(mapPos_h, limits)) || any(greaterThan(mapPos_l, limits_l));

        t = min(sideDist.x, min(sideDist.y, sideDist.z));

        stepForward = step(sideDist.xyz, sideDist.yxy) * step(sideDist.xyz, sideDist.zzx);

        sideDist += stepForward * deltaDist;
        pos += stepForward * rayStep;
        mapPos = floor(pos);
    	maxStepsPerBounce ++;

         if(borders || stepsLimits) {

            //Floor plane
            if(planeIntersect(initPos, rayDirection, vec3(0., 1., 0.), 0.0, tPlane)) {
                vec3 pointInPlane = initPos + tPlane * rayDirection;
                vec3 rotVector = rotY(-0.) * pointInPlane;
                vec3 lightVector = uLightData.rgb - pointInPlane;
                vec3 lightDirection = normalize(lightVector);
                color = textureLod(uFloor, rotVector.xz, 3.).rgb;
                color = floorShade(color, lightDirection);
                color *= uLightData.a / pow(length(lightVector), 2.);
                color += pow(vec3(uBg), vec3(2.2));
                vec2 st = (pointInPlane.xz - vec2(0.5)) / uScaleShadow + vec2(0.5);
                if(all(greaterThan(st, vec2(0.))) && all(lessThan(st, vec2(1.)))) {
                    float shadow = 1. - textureLod(uTShadows, st, 3.).r;
                    color *= clamp(shadow, 1.- uShadowIntensity, 1.);
                    color += pow(texture(uRadiance, st).rgb, vec3(2.2));
                }
            }

//            //polar array of white spheres used for reflecting fake lights
//            for(float i = 0.; i < 360.; i += 40.) {
//                float j = radians(i);
//                vec3 center = 10. * vec3(cos(j), sin(j), 0.) + vec3(0.5);
//                if(sphereIntersect(initPos, rayDirection, center, .5) > 0.) color = vec3(2.);
//            }

            break;
         }

        resolution = texture(uLowRes, index2D(mix(mapPos, floor(mapPos * changeToLow), float(highResolution)), uVoxelLow)).r > 0.;

        if(highResolution) {

            mapPos_h = mapPos;

            if(!resolution) {

                highResolution = false;
                pos0_l = changeToLow * (pos0_h + t * rayDirection);
                pos = pos0_l;
                mapPos = floor(pos);
                sideDist =  (rayStep * (mapPos - pos + 0.5) + 0.5) * deltaDist;

            } else {

                voxelIndex = texture(uPot, index2D(mapPos, uTexture3D)).r;

                if(voxelIndex > 0.) {

                    float comparator = 1e10;
                    float param = 1e10;
                    float partialIndex = 0.;
                    float q = 0.;
                    float numberOfTriangles = texture(uTT, index_triangles(voxelIndex)).a;

                    //Evaulate triangles with if branching.
                    comparator = triangleIntersect(voxelIndex, initPos, rayDirection, UV);
                    if(comparator > 0. && comparator < param) {
                        param = comparator;
                        _UV = UV;
                        partialIndex = 0.;
                    }

                    if(numberOfTriangles > 1.) {

                        comparator = triangleIntersect(voxelIndex + 3., initPos, rayDirection, UV);
                        if(comparator > 0. && comparator < param) {
                            param = comparator;
                            _UV = UV;
                            partialIndex = 3.;
                        }

                        if(numberOfTriangles > 2.) {

                            comparator = triangleIntersect(voxelIndex + 6., initPos, rayDirection, UV);
                            if(comparator > 0. && comparator < param) {
                                param = comparator;
                                _UV = UV;
                                partialIndex = 6.;
                            }

                            if(numberOfTriangles > 3.) {

                                comparator = triangleIntersect(voxelIndex + 9., initPos, rayDirection, UV);
                                if(comparator > 0. && comparator < param) {
                                    param = comparator;
                                    _UV = UV;
                                    partialIndex = 9.;
                                }

                                if(numberOfTriangles > 4.) {

                                    comparator = triangleIntersect(voxelIndex + 12., initPos, rayDirection, UV);
                                    if(comparator > 0. && comparator < param) {
                                        param = comparator;
                                        _UV = UV;
                                        partialIndex = 12.;
                                    }

                                }

                            }

                        }

                    }

                    float index = partialIndex + voxelIndex;

                     if(param > 0. && param < 10.) {

                         maxStepsPerBounce = 0;
                         vec3 prevPos = initPos;
                         vec3 advance = rayDirection * param;
                         initPos += advance;

                         vec3 ll = vec3(_UV, 1.0 - _UV.x - _UV.y);
                         normal = ll.z * texture(uTN, index_triangles(index)).rgb + ll.x * texture(uTN, index_triangles(index + 1.)).rgb + ll.y * texture(uTN, index_triangles(index + 2.)).rgb;

                         vec3 prevRay = rayDirection;

                         inside = dot(normal, rayDirection) > 0.;
                         vec3 n = inside ? -normal : normal;

                         if(rayType == 1 && inside) distanceTraveled += param;


                         if(rayType == 1) {
                            float refractValue = uRefract;
                            rayDirection = refract(rayDirection, n, inside ? uRefract : 1. / uRefract);

                             //Handling total internal reflection.
                            if(length(rayDirection) == 0.) {
                               rayDirection = reflect(prevRay, n);
                               inside = true;
                            }
                         }

                         else rayDirection = reflect(rayDirection, normal);

                         initPos += acne * rayDirection;

                         deltaDist = abs(1. / max(abs(rayDirection), vec3(EPSILON)));
                         rayStep = sign(rayDirection);
                         pos = uTexture3D.y * initPos;
                         pos0_h = pos;
                         pos0_l = changeToLow * pos;
                         mapPos = floor(pos);
                         sideDist = (rayStep * (mapPos - pos) + (rayStep * 0.5) + 0.5) * deltaDist;

                         bounces++;

                         counter ++;
                     }
                }
            }

        } else {

            mapPos_l = mapPos;

            if(resolution) {

                highResolution = true;
                pos0_h = changeToHigh * (pos0_l + 0.9999 * t * rayDirection);
                pos = pos0_h;
                mapPos = floor(pos);
                sideDist = (rayStep * (mapPos - pos + 0.5) + 0.5) * deltaDist;
            }
        }

        highResolution = resolution;
    }


     if(rayType == 1) color *= pow(vec3(e), -distanceTraveled * uAbsorption * uAbsorptionDistanceScaler);
     return color;
  }



 void main(void) {

    vec4 data = texture(uScreenPositions, uv);
    if(data.a < EPSILON) discard;

    vec3 position = data.rgb;
    vec3 normal = texture(uScreenNormals, uv).rgb;

    vec3 eye = normalize(position - uEye);
    vec3 initialPos = position;

    vec3 lightVector = uLightData.rgb - position;
    vec3 lightDirection = normalize(lightVector);

    vec3 color = lightShade(uMaterialColor, -eye, normal, lightDirection);
    color *= uLightData.a / pow(length(lightVector), 2.);

    float fresnel = Fresnel(-eye, normal, 1., uRefract);
    float Kr = fresnel;
    float Kt = 1. - Kr;

//    Kr *= step(-Kr, -uKillRay);
//    Kt *= step(-Kt, -uKillRay);

    vec3 dielectricColor = vec3(0.);

    if(uRefractions > 0 && Kt > 0.) dielectricColor += Kt * (rayTrace(eye, initialPos, refract(eye, normal, 1. / uRefract), 1, uRefractions));

    if(uReflections > 0 && Kr > 0.) dielectricColor += Kr * (rayTrace(eye, initialPos, normalize(reflect(eye, normal)), 2, uReflections));

    color += dielectricColor;
    //color = mix(dielectricColor, color, uShade.y);

    colorData = vec4(pow(color, vec3(.4545)), 1.);

}
`;



/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsRenderFloor; });
const vsRenderFloor = `#version 300 es

uniform mat4 uCameraMatrix;
uniform mat4 uPMatrix;
uniform float uScaler;

out vec3 vNor;
out vec3 vPos;
out vec2 uv;

void main(void) {
    float vI = float(gl_VertexID) + 1.;
    vec2 xy = vec2(mod(vI, 2.) == 0. ? -1. : 1., -1. + 2. * step(-vI, -2.1));
    uv = 0.5 * xy + 0.5;
    xy *= uScaler;
    xy = 0.5 * xy + 0.5;
    vPos = vec3(xy.x, 0.0, xy.y);
    vNor = vec3(0., 1., 0.);
    gl_Position = uPMatrix * uCameraMatrix * vec4(vPos + vec3(0., 0.0, 0.), 1.);
}
`;



/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsRenderFloor; });
const fsRenderFloor = `#version 300 es

 precision highp sampler2D;
 precision highp float;

 uniform float uBg;
 uniform vec4 uLightData;

 uniform sampler2D uFloor;
 uniform sampler2D uShadows;
 uniform sampler2D uRadiance;
 uniform float uScaleShadow;
 uniform float uShadowIntensity;
 uniform vec3 uLightColor;

 in vec3 vNor;
 in vec3 vPos;
 in vec2 uv;
 out vec4 colorData;

const vec3 yVector = vec3(0., 1., 0.);

 mat3 rotY(float g) {
    g = radians(g);
    vec2 a = vec2(cos(g), sin(g));
    return mat3(a.x, 0.0, a.y,
                0.0, 1.0, 0.0,
                -a.y, 0.0, a.x);
 }

 vec3 lightShade(vec3 matColor, vec3 light) {
      return max(dot(light, yVector), 0.) * (matColor * uLightColor);
 }


 void main(void) {
     vec2 index = (rotY(-0.) * vPos).xz;
     vec3 color = texture(uFloor, index).rgb;
     vec3 lightVector = uLightData.rgb - vPos;
     color = lightShade(color, normalize(lightVector));
     color *= uLightData.a / pow(length(lightVector), 2.);
     color += pow(vec3(uBg), vec3(2.2));

     vec2 uv = clamp((vPos.xz - vec2(0.5)) / uScaleShadow + vec2(0.5), vec2(0.), vec2(1.));

    if(all(greaterThan(uv, vec2(0.))) && all(lessThan(uv, vec2(1.)))) {
         //Shadows
         color *= clamp(1. - texture(uShadows, uv).r, 1.- uShadowIntensity, 1.);
         //Caustics
         color += pow(texture(uRadiance, uv).rgb, vec3(2.2));
    }

     colorData = vec4(pow(color, vec3(0.4545)), 1.);
 }
`;



/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Params {

    constructor(resetSimulation) {

        //Function used to update the animation
        this.resetSimulation = resetSimulation;

        //Camera parameters
        this.cameraDistance = 2.8;
        this.FOV = 30;
        this.lockCamera = false;

        //Position based fluids parameters
        this.updateSimulation = true;
        this.deltaTime = 0.2;
        this.constrainsIterations = 5;
        this.pbfResolution = 64;
        this.voxelTextureSize = 2048;
        this.particlesTextureSize = 1000;

        //Marching cubes parameters, Change these values to change marching cubes resolution (128/2048/1024 or 256/4096/2048)
        this.resolution = 64;
        this.expandedTextureSize = 512;
        this.expandedBuckets = 8;
        this.compressedTextureSize = 256;
        this.compressedBuckets = 4;
        this.depthLevels = 16;
        this.compactTextureSize = 2048;
        this.particleSize = 2;
        this.blurSteps = 24;
        this.range = 0.1;
        this.maxCells = 3.5;
        this.fastNormals = false;
        this.updateMesh = true;

        //General raytracer parameters
        this.lowResolutionTextureSize = 256;
        this.lowGridPartitions = 32;
        this.lowSideBuckets = 8;
        this.sceneSize = 256;       //Requires to be a power of two for mip mapping
        this.floorTextureSize = 256;
        this.floorScale = 5;
        this.killRay = 0.02;
        this.updateImage = true;

        //Material parameters (dielectric)
        this.refraction = 1.2;
        this.maxIterations = 600;
        this.refractions = 8;
        this.reflections = 3;
        this.maxStepsPerBounce = 800;
        this.absorptionColor = [150, 150, 152];
        this.dispersion = 0.0;
        this.energyDecay = 0;
        this.distanceAbsorptionScale = 6;
        this.materialColor = [255, 255, 255];
        this.kS = 0.;
        this.kD = 0.;
        this.kA = 0.;
        this.shinny = 60;


        //Light parameters
        this.lightAlpha = 30;
        this.lightBeta = 0;
        this.lightIntensity = 2.5;
        this.lightDistance = 3;
        this.backgroundColor = 0.6;
        this.lightColor = [255, 255, 255];
        this.calculateShadows = true;
        this.shadowIntensity = 0.3;
        this.blurShadowsRadius = 30;

        //Caustics parameters
        this.photonSize = 2;
        this.photonEnergy = 0.2;
        this.reflectionPhotons = 0;
        this.photonsToEmit = 1;
        this.photonSteps = 1;
        this.radianceRadius = 5.6;
        this.radiancePower = 0.2;
        this.calculateCaustics = true;
        this.causticsSize = 512;
        this.totalPhotons = this.causticsSize * this.causticsSize;
        this.causticSteps = 0;

    }

    //Generate the particles, this is done here to have different particles setup in
    //different params files
    generateParticles() {

        let particlesPosition = [];
        let particlesVelocity = [];
        let radius = this.pbfResolution * 0.45;
        //Generate the position and velocity
        for (let i = 0; i < this.pbfResolution; i++) {
            for (let j = 0; j < this.pbfResolution; j++) {
                for (let k = 0; k < this.pbfResolution; k++) {

                    //Condition for the particle position and existence
                    let x = i - this.pbfResolution * 0.5;
                    let y = j - this.pbfResolution * 0.5;
                    let z = k - this.pbfResolution * 0.5;

                    if (x * x + y * y + z * z < radius * radius && k < this.pbfResolution * 0.4) {
                        particlesPosition.push(i, j, k, 1);
                        particlesVelocity.push(0, 0, 0, 0);
                    }
                }
            }
        }

        return {particlesPosition: particlesPosition, particlesVelocity: particlesVelocity}
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Params;







/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Camera; });

class Camera {

    constructor(canvas) {
        this.position = vec3.create();
        this.down = false;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.currentMouseX = 0;
        this.currentMouseY = 0;

        this.alpha = 1 * Math.PI * 0.5;
        this.beta = .5 * Math.PI;
        this._alpha = this.alpha;
        this._beta = this.beta;
        this.ratio = 1;

        this.init = true;
        this.target = [0.5, 0.5, 0.5];

        this.perspectiveMatrix = mat4.create();
        this.cameraTransformMatrix = mat4.create();

        canvas.style.cursor = "-moz-grab";
        canvas.style.cursor = " -webkit-grab";


        document.addEventListener('mousemove', (e) => {
            this.currentMouseX = e.clientX;
            this.currentMouseY = e.clientY;
        }, false);

        document.addEventListener('mousedown', (e) => {
            canvas.style.cursor = "-moz-grabbing";
            canvas.style.cursor = " -webkit-grabbing";
            this.down = true;
        }, false);

        document.addEventListener('mouseup', (e) => {
            canvas.style.cursor = "-moz-grab";
            canvas.style.cursor = " -webkit-grab";
            this.down = false;
        }, false);
    }

    updateCamera(perspective, aspectRatio, radius) {

       this.ratio = radius;

        mat4.perspective(this.perspectiveMatrix, perspective * Math.PI / 180, aspectRatio, 0.01, 10);

        if (this.down) {
            this.alpha -= 0.1 * (this.currentMouseY - this.prevMouseY) * Math.PI / 180;
            this.beta += 0.1 * (this.currentMouseX - this.prevMouseX) * Math.PI / 180;
            if (this.alpha <= 0) this.alpha = 0.001;
            if (this.alpha >= 0.99 *  Math.PI) this.alpha = 0.99 * Math.PI;
        }

        if (this._alpha != this.alpha || this._beta != this.beta || this.init) {
            this._alpha += (this.alpha - this._alpha) / 7;
            this._beta += (this.beta - this._beta) / 7;
            this.position[0] = this.ratio * Math.sin(this._alpha) * Math.sin(this._beta) + this.target[0];
            this.position[1] = this.ratio * Math.cos(this._alpha) + this.target[1];
            this.position[2] = this.ratio * Math.sin(this._alpha) * Math.cos(this._beta) + this.target[2];
            this.cameraTransformMatrix = this.defineTransformMatrix(this.position, this.target);
        }
        this.prevMouseX = this.currentMouseX;
        this.prevMouseY = this.currentMouseY;
    }

    defineTransformMatrix(objectVector, targetVector) {
        let matrix = mat4.create();
        let eyeVector = vec3.create();
        let normalVector = vec3.create();
        let upVector = vec3.create();
        let rightVector = vec3.create();
        let yVector = vec3.create();

        yVector[0] = 0;
        yVector[1] = 1;
        yVector[2] = 0;

        vec3.subtract(eyeVector, objectVector, targetVector);

        vec3.normalize(normalVector, eyeVector);

        let reference = vec3.dot(normalVector, yVector);
        let reference2 = vec3.create();

        vec3.scale(reference2, normalVector, reference);
        vec3.subtract(upVector, yVector, reference2);
        vec3.normalize(upVector, upVector);
        vec3.cross(rightVector, normalVector, upVector);

        matrix[0] = rightVector[0];
        matrix[1] = upVector[0];
        matrix[2] = normalVector[0];
        matrix[3] = 0;
        matrix[4] = rightVector[1];
        matrix[5] = upVector[1];
        matrix[6] = normalVector[1];
        matrix[7] = 0;
        matrix[8] = rightVector[2];
        matrix[9] = upVector[2];
        matrix[10] = normalVector[2];
        matrix[11] = 0;
        matrix[12] = -vec3.dot(objectVector, rightVector);
        matrix[13] = -vec3.dot(objectVector, upVector);
        matrix[14] = -vec3.dot(objectVector, normalVector);
        matrix[15] = 1;
        return matrix;
    }
}



/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = startUIParams;
/*
This is a UI to modify the parameeters in real time
It takes as an input the corresponding params object
used for each animation and sets a visual UI with
DatGUI
 */

function startUIParams(params) {

    let uiContainer = document.querySelector("#uiContainer");

    //Simulation UI
    let simulationUI = new dat.GUI({ autoPlace: false });
    simulationUI.domElement.style.display = "none";
    uiContainer.appendChild(simulationUI.domElement);
    let simulationParamsActive = false;

    //For the position based fluids
    let  pbfFolder = simulationUI.addFolder('Position Based Fluids');
    pbfFolder.add(params, "deltaTime", 0.0000, 0.01, 0.0001).name("simulation speed");
    pbfFolder.add(params, "constrainsIterations", 1, 10, 1).name("constrains iterations").step(1);
    pbfFolder.add(params, "updateSimulation").name("update simulation");
    pbfFolder.add(params, "resetSimulation");

    pbfFolder.open();

    //For the mesh generation
    let meshFolder = simulationUI.addFolder('Marching Cubes');
    meshFolder.add(params, "particleSize", 1, 10, 1).name("particle size").step(1);
    meshFolder.add(params, "blurSteps", 1, 20, 1).name("spread steps").step(1);
    meshFolder.add(params, "range", 0, 1, 0.001).name("range").step(0.001);
    meshFolder.add(params, "maxCells", 0, 5, 0.1).name("max cells").step(0.1);
    meshFolder.add(params, "fastNormals").name("fast normals");
    meshFolder.add(params, "updateMesh").name("update mesh");
    meshFolder.open();


    //material UI
    let materialUI = new dat.GUI({ autoPlace: false });
    materialUI.domElement.style.display = "none";
    uiContainer.appendChild(materialUI.domElement);
    let materialUIActive = false;


    //For the mesh generation
    let materialFolder = materialUI.addFolder('Material Definition');
    materialFolder.add(params, "refraction", 0, 10, 0.1).name("refraction").step(0.1);
    materialFolder.add(params, "refractions", 0, 20, 0.1).name("refraction steps").step(1);
    materialFolder.add(params, "reflections", 0, 20, 0.1).name("reflection steps").step(1);
    materialFolder.add(params, "distanceAbsorptionScale", 0, 10, 1).name("absorption scale").step(1);
    materialFolder.add(params, "kS", 0, 1, 0.001).name("specular intensity").step(0.001);
    materialFolder.add(params, "kD", 0, 1, 0.001).name("diffuse intensity").step(0.001);
    materialFolder.add(params, "kA", 0, 1, 0.001).name("ambient intensity").step(0.001);
    materialFolder.add(params, "shinny", 0, 60, 1).name("specular power").step(1);
    materialFolder.add(params, "dispersion", 0, 0.2, 0.0001).name("dispersion").step(0.0001);
    materialFolder.add(params, "photonSize", 1, 10, 1).name("photons size").step(1);
    materialFolder.add(params, "photonEnergy", 0, 1, 0.001).name("photons energy").step(0.001);
    materialFolder.add(params, "reflectionPhotons", 0, 1, 0.001).name("reflection photons").step(0.01);
    materialFolder.add(params, "radianceRadius", 0, 30, 0.1).name("radiance radius").step(0.1);
    materialFolder.add(params, "radiancePower", 0, 1, 0.01).name("radiance power").step(0.01);
    materialFolder.add(params, "calculateCaustics").name("update caustics");
    materialFolder.addColor(params, 'absorptionColor');
    materialFolder.addColor(params, 'materialColor');
    materialFolder.open();


    //raytracer UI
    let raytracerUI = new dat.GUI({ autoPlace: false });
    raytracerUI.domElement.style.display = "none";
    uiContainer.appendChild(raytracerUI.domElement);
    let raytracerUiActive = false;




    //General raytracer folder
    let raytracerFolder = raytracerUI.addFolder('Ray tracer');
    raytracerFolder.add(params, "floorScale", 1, 15, 1).name("floor scale").step(2);
    raytracerFolder.add(params, "killRay", 0, 1, 0.001).name("kill ray").step(0.001);
    raytracerFolder.add(params, "maxIterations", 0, 1200, 1).name("max steps").step(1);
    raytracerFolder.add(params, "maxStepsPerBounce", 0, 1200, 1).name("max bounce steps").step(1);
    raytracerFolder.add(params, "updateImage").name("update image");
    raytracerFolder.open();

    //Light parameters folder
    let lightFolder = raytracerUI.addFolder('Light parameters');
    lightFolder.add(params, "lightAlpha", 0, 180, 1).name("light alpha").step(1);
    lightFolder.add(params, "lightBeta", 0, 180, 1).name("light beta").step(1);
    lightFolder.add(params, "lightDistance", 0, 20, 1).name("light distance").step(1);
    lightFolder.add(params, "backgroundColor", 0, 1, 0.01).name("background color").step(0.01);
    lightFolder.add(params, "shadowIntensity", 0, 1, 0.01).name("shadows intensity").step(0.01);
    lightFolder.add(params, "blurShadowsRadius", 0, 100, 1).name("shadows spread").step(1);
    lightFolder.add(params, "calculateShadows").name("update shadows");
    lightFolder.addColor(params, 'lightColor');
    lightFolder.open();


    //Light parameters folder
    let cameraFolder = raytracerUI.addFolder('camera parameters');
    cameraFolder.add(params, "cameraDistance", 1, 10, 1).name("camera distance").step(1);
    cameraFolder.add(params, "FOV", 1, 70, 1).name("FOV").step(1);
    cameraFolder.add(params, "lockCamera").name("camera lock");
    cameraFolder.open();


    //Function used to show the different UI params
    document.body.addEventListener("keypress", (e) => {

       if(e.key == "p") {
           simulationParamsActive = !simulationParamsActive;
           simulationUI.domElement.style.display = simulationParamsActive ? "block" : "none";
       }

        if(e.key == "m") {
            materialUIActive = !materialUIActive;
            materialUI.domElement.style.display = materialUIActive ? "block" : "none";
        }

        if(e.key == "r") {
            raytracerUiActive = !raytracerUiActive;
            raytracerUI.domElement.style.display = raytracerUiActive ? "block" : "none";
        }

    });

}

/***/ })
/******/ ]);