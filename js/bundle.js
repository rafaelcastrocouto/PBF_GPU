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
const createTexture2D = (width, height, internalFormat, format, maxFilter, minFilter, type, data = null) => {
    if(contextReady) {
        let texture = gl.createTexture();
        texture.width = width;
        texture.height = height;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, maxFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pbf_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mesher_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_camera_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shaders_utils_vs_renderParticles_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shaders_utils_fs_simpleColor_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shaders_utils_fs_simpleTexture_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shaders_utils_vs_quad_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__shaders_utils_vs_phongTriangles_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__shaders_utils_fs_phongTriangles_js__ = __webpack_require__(26);













//=======================================================================================================
// Variables & Constants
//=======================================================================================================

let canvas = document.querySelector("#canvas3D");
canvas.height = 1000;
canvas.width = canvas.height;
//canvas.style.width = String(canvas.width) + "px";
//canvas.style.height = String(canvas.height) + "px";
__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["f" /* setContext */](canvas);


let camera = new __WEBPACK_IMPORTED_MODULE_3__utils_camera_js__["a" /* Camera */](canvas);
let cameraDistance = 2.5;
let FOV = 30;

//For the Positionn Based Fluids
let updateSimulation = true;
let deltaTime = 0.01;
let constrainsIterations = 2;
let pbfResolution = 32;
let voxelTextureSize = 1048;
let particlesTextureSize = 512;
let particlesPosition = [];
let particlesVelocity = []
let currentFrame = 0;

//Change these values to change marching cubes resolution (128/2048/1024 or 256/4096/2048)
let resolution = 128;

let expandedTextureSize = 2048;
let expandedBuckets = 16;

let compressedTextureSize = 1024;
let compressedBuckets = 8;

let depthLevels = 64;

let compactTextureSize = 1024;

let particleSize = 2.;
let blurSteps = 20;
let range = 0.25;
let maxCells = 3.5;
let fastNormals = false;
let radius = pbfResolution * 0.39;

//Generate the position and velocity
for (let i = 0; i < pbfResolution; i++) {
    for (let j = 0; j < pbfResolution; j++) {
        for (let k = 0; k < pbfResolution; k++) {

            //Condition for the particle position and existence
            let x = i - pbfResolution * 0.5;
            let y = j - pbfResolution * 0.5;
            let z = k - pbfResolution * 0.5;

            if (x * x + y * y + z * z < radius * radius && k < pbfResolution * 0.4) {
                particlesPosition.push(i, j, k, 1);
                particlesVelocity.push(0, 0, 0, 0); //Velocity is zero for all the particles.
            }
        }
    }
}

let renderParticlesProgram = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_4__shaders_utils_vs_renderParticles_js__["a" /* vsParticles */], __WEBPACK_IMPORTED_MODULE_5__shaders_utils_fs_simpleColor_js__["a" /* fsColor */]);
renderParticlesProgram.positionTexture = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(renderParticlesProgram, "uTexturePosition");
renderParticlesProgram.cameraMatrix = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(renderParticlesProgram, "uCameraMatrix");
renderParticlesProgram.perspectiveMatrix = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(renderParticlesProgram, "uPMatrix");
renderParticlesProgram.scale = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(renderParticlesProgram, "uScale");

let textureProgram = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_7__shaders_utils_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_6__shaders_utils_fs_simpleTexture_js__["a" /* fsTextureColor */]);
textureProgram.texture = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(textureProgram, "uTexture");
textureProgram.forceAlpha = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(textureProgram, "uForceAlpha");

let phongTrianglesProgram = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_8__shaders_utils_vs_phongTriangles_js__["a" /* vsPhongTriangles */], __WEBPACK_IMPORTED_MODULE_9__shaders_utils_fs_phongTriangles_js__["a" /* fsPhongTriangles */]);
phongTrianglesProgram.cameraMatrix = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(phongTrianglesProgram, "uCameraMatrix");
phongTrianglesProgram.perspectiveMatrix = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(phongTrianglesProgram, "uPMatrix");
phongTrianglesProgram.textureTriangles = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(phongTrianglesProgram, "uTT");
phongTrianglesProgram.textureNormals = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(phongTrianglesProgram, "uTN");
phongTrianglesProgram.cameraPosition = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(phongTrianglesProgram, "uEye");


//=======================================================================================================
// Simulation and Rendering (Position based fluids)
//=======================================================================================================

//Initiate the position based fluids solver
    __WEBPACK_IMPORTED_MODULE_1__pbf_js__["a" /* init */](particlesPosition, particlesVelocity, pbfResolution, voxelTextureSize, particlesTextureSize);
particlesPosition = null;
particlesVelocity = null;

//Initiate the mesher generator
__WEBPACK_IMPORTED_MODULE_2__mesher_js__["a" /* init */](resolution, expandedTextureSize, compressedTextureSize, compactTextureSize, compressedBuckets, expandedBuckets, depthLevels);

let render = () => {

    requestAnimationFrame(render);

    camera.updateCamera(FOV, 1, cameraDistance);
    let acceleration = {
        x: 0 * Math.sin(currentFrame * Math.PI / 180),
        y: -10,
        z: 0 * Math.cos(currentFrame * Math.PI / 180)
    }


    if (updateSimulation) {
        //Update the simulation
        __WEBPACK_IMPORTED_MODULE_1__pbf_js__["d" /* updateFrame */](acceleration, deltaTime, constrainsIterations);

//        //Generate the mesh from the simulation particles
//        Mesher.generateMesh(PBF.positionTexture, PBF.totalParticles, pbfResolution, particleSize, blurSteps, range, maxCells, fastNormals);

        currentFrame++;

    }


    //Render particles
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, null);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, canvas.height, canvas.height);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(renderParticlesProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](renderParticlesProgram.positionTexture, __WEBPACK_IMPORTED_MODULE_1__pbf_js__["b" /* positionTexture */], 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(renderParticlesProgram.scale, pbfResolution);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniformMatrix4fv(renderParticlesProgram.cameraMatrix, false, camera.cameraTransformMatrix);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniformMatrix4fv(renderParticlesProgram.perspectiveMatrix, false, camera.perspectiveMatrix);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT | __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DEPTH_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DEPTH_TEST);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, __WEBPACK_IMPORTED_MODULE_1__pbf_js__["c" /* totalParticles */]);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DEPTH_TEST);


//    let activeMCells = Math.ceil(maxCells * expandedTextureSize * expandedTextureSize / 100);
//
//
//    //Render the triangles
//    gl.useProgram(phongTrianglesProgram);
//    gl.viewport(0, 0, canvas.height, canvas.height);
//    webGL2.bindTexture(phongTrianglesProgram.textureTriangles, Mesher.tTriangles, 0);
//    webGL2.bindTexture(phongTrianglesProgram.textureNormals, Mesher.tNormals, 1);
//    gl.uniformMatrix4fv(phongTrianglesProgram.cameraMatrix, false, camera.cameraTransformMatrix);
//    gl.uniformMatrix4fv(phongTrianglesProgram.perspectiveMatrix, false, camera.perspectiveMatrix);
//    gl.uniform3f(phongTrianglesProgram.cameraPosition, camera.position[0], camera.position[1], camera.position[2]);
//    gl.enable(gl.DEPTH_TEST);
//    gl.drawArrays(gl.TRIANGLES, 0, 15 * activeMCells);
//    gl.disable(gl.DEPTH_TEST);


};

document.body.addEventListener("keypress", () => {
    updateSimulation = !updateSimulation;
})

render();

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return updateFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return totalParticles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return positionTexture; });
/* unused harmony export velocityTexture */
/* unused harmony export voxelsTexture */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_neightborhoodSearch_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shaders_PBF_vs_applyForces_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shaders_PBF_vs_integrateVelocity_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shaders_PBF_vs_calculateConstrains_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shaders_PBF_vs_calculateDisplacements_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shaders_PBF_vs_calculateViscosity_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shaders_utils_vs_quad_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__shaders_utils_fs_simpleTexture_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__shaders_utils_fs_simpleColor_js__ = __webpack_require__(1);




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

    textureProgram                                          = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_7__shaders_utils_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_8__shaders_utils_fs_simpleTexture_js__["a" /* fsTextureColor */]);
    textureProgram.texture                                  = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(textureProgram, "uTexture");

    predictPositionsProgram                                 = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_PBF_vs_applyForces_js__["a" /* predictPositions */], __WEBPACK_IMPORTED_MODULE_9__shaders_utils_fs_simpleColor_js__["a" /* fsColor */]);
    predictPositionsProgram.positionTexture                 = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(predictPositionsProgram, "uTexturePosition");
    predictPositionsProgram.velocityTexture                 = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(predictPositionsProgram, "uTextureVelocity");
    predictPositionsProgram.deltaTime                       = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(predictPositionsProgram, "uDeltaTime");
    predictPositionsProgram.acceleration                    = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(predictPositionsProgram, "uAcceleration");


    integrateVelocityProgram                                = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_3__shaders_PBF_vs_integrateVelocity_js__["a" /* integrateVelocity */], __WEBPACK_IMPORTED_MODULE_9__shaders_utils_fs_simpleColor_js__["a" /* fsColor */]);
    integrateVelocityProgram.positionTexture                = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(integrateVelocityProgram, "uTexturePosition");
    integrateVelocityProgram.positionOldTexture             = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(integrateVelocityProgram, "uTexturePositionOld");
    integrateVelocityProgram.deltaTime                      = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(integrateVelocityProgram, "uDeltaTime");


    calculateConstrainsProgram                              = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_4__shaders_PBF_vs_calculateConstrains_js__["a" /* calculateConstrains */], __WEBPACK_IMPORTED_MODULE_9__shaders_utils_fs_simpleColor_js__["a" /* fsColor */]);
    calculateConstrainsProgram.positionTexture              = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uTexturePosition");
    calculateConstrainsProgram.neighbors                    = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uNeighbors");
    calculateConstrainsProgram.bucketData                   = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uBucketData");
    calculateConstrainsProgram.restDensity                  = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uRestDensity");
    calculateConstrainsProgram.searchRadius                 = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uSearchRadius");
    calculateConstrainsProgram.kernelConstant               = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uKernelConstant");
    calculateConstrainsProgram.relaxParameter               = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uRelaxParameter");
    calculateConstrainsProgram.gradientKernelConstant       = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateConstrainsProgram, "uGradientKernelConstant");


    calculateDisplacementsProgram                           = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_5__shaders_PBF_vs_calculateDisplacements_js__["a" /* calculateDisplacements */], __WEBPACK_IMPORTED_MODULE_9__shaders_utils_fs_simpleColor_js__["a" /* fsColor */]);
    calculateDisplacementsProgram.positionTexture           = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uTexturePosition");
    calculateDisplacementsProgram.neighbors                 = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uNeighbors");
    calculateDisplacementsProgram.constrains                = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uConstrains");
    calculateDisplacementsProgram.bucketData                = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uBucketData");
    calculateDisplacementsProgram.restDensity               = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uRestDensity");
    calculateDisplacementsProgram.searchRadius              = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uSearchRadius");
    calculateDisplacementsProgram.gradientKernelConstant    = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uGradientKernelConstant");
    calculateDisplacementsProgram.tensileConstant           = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uTensileK");
    calculateDisplacementsProgram.tensilePower              = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uTensilePower");
    calculateDisplacementsProgram.tensileDistance           = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateDisplacementsProgram, "uTensileDistance");


    calculateViscosityProgram                               = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_6__shaders_PBF_vs_calculateViscosity_js__["a" /* calculateViscosity */], __WEBPACK_IMPORTED_MODULE_9__shaders_utils_fs_simpleColor_js__["a" /* fsColor */]);
    calculateViscosityProgram.positionTexture               = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uTexturePosition");
    calculateViscosityProgram.velocityTexture               = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uTextureVelocity");
    calculateViscosityProgram.neighbors                     = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uNeighbors");
    calculateViscosityProgram.bucketData                    = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uBucketData");
    calculateViscosityProgram.restDensity                   = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uRestDensity");
    calculateViscosityProgram.searchRadius                  = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uSearchRadius");
    calculateViscosityProgram.kernelConstant                = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(calculateViscosityProgram, "uKernelConstant");


    //Required textures for simulations
    positionTexture = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](particlesTextureSize, particlesTextureSize, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(particlesPosition));
    velocityTexture = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](particlesTextureSize, particlesTextureSize, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(particlesVelocity));
    pbfTexture1     = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](particlesTextureSize, particlesTextureSize, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT, null);
    pbfTexture2     = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](particlesTextureSize, particlesTextureSize, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT, null);
    voxelsTexture   = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](voxelsTextureSize, voxelsTextureSize, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT, null);


    //Corresponding buffers
    positionBuffer = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](positionTexture);
    velocityBuffer = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](velocityTexture);
    pbfBuffer1     = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](pbfTexture1);
    pbfBuffer2     = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](pbfTexture2);
    voxelsBuffer   = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](voxelsTexture, true, true);
}


//=======================================================================================================
// Simulation and Rendering (Particle Based Fluids
//=======================================================================================================

let updateFrame = (acceleration, deltaTime, constrainsIterations) => {

    //Apply external forces (gravity)
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, pbfBuffer1);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(predictPositionsProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(predictPositionsProgram.deltaTime, deltaTime);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(predictPositionsProgram.acceleration, acceleration.x, acceleration.y, acceleration.z);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](predictPositionsProgram.positionTexture, positionTexture, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](predictPositionsProgram.velocityTexture, velocityTexture, 1);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);


    //Obtain the neighbors
    Object(__WEBPACK_IMPORTED_MODULE_1__utils_neightborhoodSearch_js__["a" /* searchNeighbords */])(pbfTexture1, voxelsBuffer, totalParticles, bucketSize);


    //Solve the constrains
    for(let i = 0; i < constrainsIterations; i ++) {

        //Calculate the lambdas
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, pbfBuffer2);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(calculateConstrainsProgram);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](calculateConstrainsProgram.positionTexture, pbfTexture1, 0);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](calculateConstrainsProgram.neighbors, voxelsTexture, 1);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(calculateConstrainsProgram.bucketData, voxelsTexture.width, bucketSize, voxelsTexture.width / bucketSize);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateConstrainsProgram.restDensity, restDensity);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateConstrainsProgram.kernelConstant, densityConstant);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateConstrainsProgram.gradientKernelConstant, gradWconstant);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateConstrainsProgram.searchRadius, searchRadius);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateConstrainsProgram.relaxParameter, relaxParameter);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);


        //Calculate displacements
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, velocityBuffer);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(calculateDisplacementsProgram);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](calculateDisplacementsProgram.positionTexture, pbfTexture1, 0);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](calculateDisplacementsProgram.neighbors, voxelsTexture, 1);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](calculateDisplacementsProgram.constrains, pbfTexture2, 2);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(calculateDisplacementsProgram.bucketData, voxelsTexture.width, bucketSize, voxelsTexture.width / bucketSize);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.restDensity, restDensity);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.searchRadius, searchRadius);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.gradientKernelConstant, gradWconstant);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.tensileConstant, tensileConstant);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.tensileDistance, tensileDistance);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateDisplacementsProgram.tensilePower, tensilePower);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);


        //Update data between helper textures
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, pbfBuffer1);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(textureProgram);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](textureProgram.texture, velocityTexture, 0);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);

    }

    //Integrate the velocity
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, pbfBuffer2);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(integrateVelocityProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(integrateVelocityProgram.deltaTime, deltaTime);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](integrateVelocityProgram.positionTexture, pbfTexture1, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](integrateVelocityProgram.positionOldTexture, positionTexture, 1);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);


    //Apply viscosity
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, velocityBuffer);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(calculateViscosityProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](calculateViscosityProgram.positionTexture, pbfTexture1, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](calculateViscosityProgram.velocityTexture, pbfTexture2, 1);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](calculateViscosityProgram.neighbors, voxelsTexture, 2);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(calculateViscosityProgram.bucketData, voxelsTexture.width, bucketSize, voxelsTexture.width / bucketSize);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateViscosityProgram.restDensity, restDensity);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateViscosityProgram.searchRadius, searchRadius);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(calculateViscosityProgram.kernelConstant, viscosityConstant);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);


    //Update the positions.
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, positionBuffer);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, particlesTextureSize, particlesTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(textureProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](textureProgram.texture, pbfTexture1, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
}


//=======================================================================================================
// Public variables and functions
//=======================================================================================================




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return searchNeighbords; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shaders_neighbors_vs_neighbors_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shaders_utils_fs_simpleColor_js__ = __webpack_require__(1);
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
        searchProgram = __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_1__shaders_neighbors_vs_neighbors_js__["a" /* vsNeighbors */], __WEBPACK_IMPORTED_MODULE_2__shaders_utils_fs_simpleColor_js__["a" /* fsColor */]);
        searchProgram.positionTexture =     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(searchProgram, "uTexPositions");
        searchProgram.bucketData =          __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(searchProgram, "uBucketData");
        searchProgram.totalParticles =      __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(searchProgram, "uTotalParticles");
        started = true;
    }

    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FRAMEBUFFER, outputBuffers[0]);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, outputBuffers[0].width, outputBuffers[0].height);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clearColor(0.0, 0.0, 0.0, 0.0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT | __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DEPTH_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].STENCIL_TEST);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DEPTH_TEST);

    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(searchProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](searchNeighbords.positionTexture, inputTexture, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(searchProgram.bucketData, outputBuffers[0].width, bucketSize, outputBuffers[0].width / bucketSize);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(searchProgram.totalParticles, totalParticles);

    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].colorMask(true, false, false, false);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].depthFunc(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].LESS);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].colorMask(false, true, false, false);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].depthFunc(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].GREATER);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].stencilFunc(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].GREATER, 1, 1);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].stencilOp(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].KEEP, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].KEEP, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].INCR);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].colorMask(false, false, true, false);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].colorMask(false, false, false, true);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

    if(outputBuffers.length > 1) {
        for(let i = 1; i < outpufBuffer.length; i ++) {
            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FRAMEBUFFER, outputBuffers[i]);
            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);

            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].colorMask(true, false, false, false);
            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].colorMask(false, true, false, false);
            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].colorMask(false, false, true, false);
            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);

            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].colorMask(false, false, false, true);
            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].STENCIL_BUFFER_BIT);
            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);
        }
    }

    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].colorMask(true, true, true, true);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].STENCIL_TEST);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DEPTH_TEST);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].depthFunc(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].LESS);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FRAMEBUFFER, null);

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
    float radius = uBucketData.y * 0.4;
    vec3 normal = endPosition - center;
    float n = length(normal);
    float distance = n -  radius;

    if(distance > 0. ) {

            normal = normalize(normal);
            endPosition = center + normal * radius;

    }

    // //Collision handling
    // vec3 boxSize = vec3(uBucketData.y * 0.46);
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return init; });
/* unused harmony export generateMesh */
/* unused harmony export tTriangles */
/* unused harmony export tNormals */
/* unused harmony export tVoxelsOffsets */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_marchingCubesTables_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shaders_utils_vs_quad_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shaders_utils_fs_simpleColor_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shaders_utils_fs_simpleTexture_js__ = __webpack_require__(3);
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
for (let i = 0; i <__WEBPACK_IMPORTED_MODULE_1__utils_marchingCubesTables_js__["b" /* trianglesOnVoxels */].length; i ++) tInV.push(__WEBPACK_IMPORTED_MODULE_1__utils_marchingCubesTables_js__["b" /* trianglesOnVoxels */][i].length);

let arrayTriIndex = [];
for(let i = 0; i < indexesTextureSize * indexesTextureSize; i ++) {
    if (i < __WEBPACK_IMPORTED_MODULE_1__utils_marchingCubesTables_js__["a" /* ti5 */].length) {
        let val = __WEBPACK_IMPORTED_MODULE_1__utils_marchingCubesTables_js__["a" /* ti5 */][i];
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

    tVoxels1 =                      __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](compressedTextureSize, compressedTextureSize,               __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA8,   __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].UNSIGNED_BYTE);
    tVoxels2 =                      __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](compressedTextureSize, compressedTextureSize,               __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA8,   __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].UNSIGNED_BYTE);
    tTriangles =                    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](compactTextureSize, compactTextureSize,                     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT);
    tNormals =                      __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](compactTextureSize, compactTextureSize,                     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT);
    tVoxelsOffsets =                __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](compactTextureSize, compactTextureSize,                     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT);
    tHelper =                       __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](expandedTextureSize, expandedTextureSize,                   __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT);
    t3DExpanded =                   __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](expandedTextureSize, expandedTextureSize,                   __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT);
    tMarchingCase =                 __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](expandedTextureSize, expandedTextureSize,                   __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT);
    tAmountOfTrianglesPerIndex =    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](amountOfTrianglesTextureSize, amountOfTrianglesTextureSize, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(arrayTriVoxel));
    tIndexes =                      __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](indexesTextureSize, indexesTextureSize,                     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT, new Float32Array(arrayTriIndex));


    fbVoxels1 =                    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](tVoxels1);
    fbVoxels2 =                    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](tVoxels2);
    fb3DExpanded =                 __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](t3DExpanded);
    fbIndexes =                    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](tIndexes);
    fbAmountOfTrianglesPerIndex =  __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](tAmountOfTrianglesPerIndex);
    fbHelper =                     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](tHelper);
    fbMarchingCase =               __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](tMarchingCase);
    fbTriangles =                  __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */]([tTriangles, tNormals, tVoxelsOffsets]);

    tLevels = [];
    fbPyramid = [];
    for (let i = 0; i < Math.ceil(Math.log(_expandedTextureSize) / Math.log(2)); i++) {
        let size = Math.pow(2, i);
        tLevels.push(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["c" /* createTexture2D */](size, size, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA32F, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].RGBA, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].NEAREST, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FLOAT));
        fbPyramid.push(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["b" /* createDrawFramebuffer */](tLevels[i]));
    }
    
    arrayTriIndex = null;
    arrayTriVoxel = null;


    //programs generation
    setVoxelsProgram =                              __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_5__shaders_marchingCubes_vs_partticlesPlacement_js__["a" /* vsParticlesPlacement */], __WEBPACK_IMPORTED_MODULE_3__shaders_utils_fs_simpleColor_js__["a" /* fsColor */]);
    setVoxelsProgram.positionTexture =              __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(setVoxelsProgram, "uTexturePosition");
    setVoxelsProgram.phase =                        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(setVoxelsProgram, "uPhase");
    setVoxelsProgram.particleSize =                 __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(setVoxelsProgram, "uSize");
    setVoxelsProgram.gridPartitioning =             __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(setVoxelsProgram, "u3D");
    setVoxelsProgram.particlesGridScale =           __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(setVoxelsProgram, "uParticlesGridScale");

    blur2DProgram =                                 __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_utils_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_6__shaders_marchingCubes_fs_blu2D_js__["a" /* blur2D */]);
    blur2DProgram.dataTexture =                     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(blur2DProgram, "uDT");
    blur2DProgram.axis =                            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(blur2DProgram, "uAxis");
    blur2DProgram.steps =                           __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(blur2DProgram, "uSteps");
    blur2DProgram.gridPartitioning =                __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(blur2DProgram, "u3D");


    blurDepthProgram =                              __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_utils_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_7__shaders_marchingCubes_fs_blurDepth_js__["a" /* blurDepth */]);
    blurDepthProgram.dataTexture =                  __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(blurDepthProgram, "uDT");
    blurDepthProgram.steps =                        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(blurDepthProgram, "uSteps");
    blurDepthProgram.gridPartitioning =             __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(blurDepthProgram, "u3D");
    blurDepthProgram.depthLevels =                  __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(blurDepthProgram, "uDepth");

    getCornersProgram =                             __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_utils_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_8__shaders_marchingCubes_fs_getCorners_js__["a" /* getCorners */]);
    getCornersProgram.dataTexture =                 __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(getCornersProgram, "uDataTexture");
    getCornersProgram.gridPartitioning =            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(getCornersProgram, "u3D");
    getCornersProgram.depthLevels =                 __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(getCornersProgram, "uDepth");

    splitChannelsProgram =                          __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_utils_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_9__shaders_marchingCubes_fs_splitChannels_js__["a" /* splitChannels */]);
    splitChannelsProgram.dataTexture =              __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(splitChannelsProgram, "uDataTexture");
    splitChannelsProgram.gridPartitioningLow =      __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(splitChannelsProgram, "u3D_l");
    splitChannelsProgram.gridPartitioningHigh =     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(splitChannelsProgram, "u3D_h");
    splitChannelsProgram.depthLevels =              __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(splitChannelsProgram, "uDepth");

    marchCaseProgram =                              __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_utils_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_10__shaders_marchingCubes_fs_marchCase_js__["a" /* marchCase */]);
    marchCaseProgram.dataTexture =                  __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(marchCaseProgram, "uDT");
    marchCaseProgram.trianglesPerIndexTexture =     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(marchCaseProgram, "uTrianglesIndex");
    marchCaseProgram.range =                        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(marchCaseProgram, "uRange");
    marchCaseProgram.gridPartitioning =             __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(marchCaseProgram, "u3D");

    generatePyramidProgram =                        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_utils_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_11__shaders_marchingCubes_fs_generatePyramid_js__["a" /* generatePyramid */]);
    generatePyramidProgram.potentialTexture =       __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generatePyramidProgram, "uPyT");
    generatePyramidProgram.size =                   __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generatePyramidProgram, "uSize");

    textureProgram =                                __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_utils_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_4__shaders_utils_fs_simpleTexture_js__["a" /* fsTextureColor */]);
    textureProgram.texture =                        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(textureProgram, "uTexture");
    textureProgram.forceAlpha =                     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(textureProgram, "uForceAlpha");

    generateTrianglesProgram =                      __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["d" /* generateProgram */](__WEBPACK_IMPORTED_MODULE_2__shaders_utils_vs_quad_js__["a" /* vsQuad */], __WEBPACK_IMPORTED_MODULE_12__shaders_marchingCubes_fs_generateTriangles_js__["a" /* generateTriangles */]);
    generateTrianglesProgram.pyramid =              __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uPyramid");
    generateTrianglesProgram.base =                 __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uBase");
    generateTrianglesProgram.gridPartitioning =     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "u3D");
    generateTrianglesProgram.potentialTexture =     __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uPot");
    generateTrianglesProgram.tiTexture =            __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uTrianglesIndexes");
    generateTrianglesProgram.range =                __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uRange");
    generateTrianglesProgram.limit =                __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uLimit");
    generateTrianglesProgram.total =                __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uTotal");
    generateTrianglesProgram.fastNormals =          __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uFastNormals");
    generateTrianglesProgram.compactTextureSize =   __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uCompactSize");
    generateTrianglesProgram.levels =               __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].getUniformLocation(generateTrianglesProgram, "uLevels");


}

//Function used to generate a 3D mesh using the marching cubes algorithm
let generateMesh = (positionTexture, totalParticles, particlesGridScale, particlesSize, blurSteps, range, maxCells, fastNormals) => {

    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].blendEquation(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FUNC_ADD);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].blendFunc(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].ONE, __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].ONE);


    //Working with the compressed texture size
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, compressedTextureSize, compressedTextureSize);


    //Place particles in the voxel space
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(setVoxelsProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](setVoxelsProgram.positionTexture, positionTexture, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(setVoxelsProgram.particleSize, particlesSize);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(setVoxelsProgram.particlesGridScale, particlesGridScale);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(setVoxelsProgram.gridPartitioning, 1. / compressedTextureSize, resolution, compressedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbVoxels1);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].enable(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].BLEND);

    for (let i = 0; i < particlesSize; i++) {
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(setVoxelsProgram.phase, i);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].POINTS, 0, totalParticles);
    }

    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].disable(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].BLEND);

    
    //Use a 3D blur for the potential generation.
    let blurXY = (buffer, texture, axis) => {
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform2fv(blur2DProgram.axis, axis);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1i(blur2DProgram.steps, blurSteps);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(blur2DProgram.gridPartitioning, 1. / compressedTextureSize, resolution, compressedBuckets);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](blur2DProgram.dataTexture, texture, 0);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, buffer);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
    };

    let k = 1 / compressedTextureSize;
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(blur2DProgram);
    blurXY(fbVoxels2, tVoxels1, [k, 0]);
    blurXY(fbVoxels1, tVoxels2, [0, k]);

    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(blurDepthProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](blurDepthProgram.dataTexture, tVoxels1, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1i(blurDepthProgram.steps, blurSteps);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(blurDepthProgram.depthLevels, depthLevels);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(blurDepthProgram.gridPartitioning, 1. / compressedTextureSize, resolution, compressedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbVoxels2);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);

    
    //Evaluate the corners values for the potentials
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(getCornersProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbVoxels1);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](getCornersProgram.dataTexture, tVoxels2, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(getCornersProgram.gridPartitioning, 1. / compressedTextureSize, resolution, compressedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(getCornersProgram.depthLevels, depthLevels);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);


    //Working with the expanded texture size
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, expandedTextureSize, expandedTextureSize);


    //Split the channels for expansion of the potential
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(splitChannelsProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](splitChannelsProgram.dataTexture, tVoxels1, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fb3DExpanded);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(splitChannelsProgram.gridPartitioningLow, 1. / compressedTextureSize, resolution, compressedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(splitChannelsProgram.gridPartitioningHigh, 1. / expandedTextureSize, resolution, expandedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(splitChannelsProgram.depthLevels, depthLevels);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);

    
    //Evaluate the cells active for the marching cubes
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(marchCaseProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](marchCaseProgram.dataTexture, t3DExpanded, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](marchCaseProgram.trianglesPerIndexTexture, tAmountOfTrianglesPerIndex, 1);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(marchCaseProgram.range, range);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(marchCaseProgram.gridPartitioning, 1. / expandedTextureSize, resolution, expandedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbMarchingCase);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);


    //This part set the levels of the pyramid for compaction.
    let levels = Math.ceil(Math.log(expandedTextureSize) / Math.log(2));
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(generatePyramidProgram);
    for (let i = 0; i < levels; i++) {
        let size = Math.pow(2, levels - 1 - i);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbPyramid[levels - i - 1]);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, size, size);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(generatePyramidProgram.size, Math.pow(2, i + 1) / expandedTextureSize);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](generatePyramidProgram.potentialTexture, i == 0 ? tMarchingCase : tLevels[levels - i], 0);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
    }


    //Copy the pyramid partial result into the helper texture.
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].DRAW_FRAMEBUFFER, fbHelper);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clearColor(0, 0, 0, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    let offset = 0;
    for(let i = 0; i < levels; i ++) {
        let size = Math.pow(2, levels - 1 - i);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(offset, 0, size, size);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(textureProgram);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](textureProgram.texture, tLevels[levels - i - 1], 0);
        __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
        offset += size;
    }


    //Parse the pyramid and generate the positions and normals
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].useProgram(generateTrianglesProgram);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](generateTrianglesProgram.pyramid, tHelper, 0);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](generateTrianglesProgram.base, tMarchingCase, 1);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](generateTrianglesProgram.tiTexture, tIndexes, 2);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](generateTrianglesProgram.potentialTexture, t3DExpanded, 3);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["a" /* bindTexture */](generateTrianglesProgram.total, tLevels[0], 4);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(generateTrianglesProgram.range, range);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1i(generateTrianglesProgram.levels, levels);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1f(generateTrianglesProgram.compactTextureSize, compactTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform3f(generateTrianglesProgram.gridPartitioning, expandedTextureSize, resolution, expandedBuckets);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].uniform1i(generateTrianglesProgram.fastNormals, fastNormals);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].bindFramebuffer(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].FRAMEBUFFER, fbTriangles);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].viewport(0, 0, compactTextureSize, compactTextureSize);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].clear(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].COLOR_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].drawArrays(__WEBPACK_IMPORTED_MODULE_0__utils_webGL2_js__["e" /* gl */].TRIANGLE_STRIP, 0, 4);
    
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

    colorData = vec4(equal(vec4(depthLevel), vec4(0., 1., 2., 3.)));

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

    gl_PointSize = 2.;
}
`;




/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return vsPhongTriangles; });
const vsPhongTriangles = `#version 300 es

precision highp float;
precision highp sampler2D;

uniform mat4 uCameraMatrix;
uniform mat4 uPMatrix;
uniform highp sampler2D uTT;
uniform highp sampler2D uTN;


out vec2 uv;
out vec3 color;

void main(void) {

    int tSize = textureSize(uTT, 0).x;
    float textureSize = float(tSize);
    uv = vec2(float(gl_VertexID % tSize) + 0.5, (floor(float(gl_VertexID) / textureSize)) + 0.5) / textureSize;
    
    color = 0.5 * texture(uTN, uv).rgb + vec3(0.5);
    gl_Position = uPMatrix * uCameraMatrix * vec4(texture(uTT, uv).rgb, 1.0);
}

`;



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fsPhongTriangles; });
const fsPhongTriangles = `#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 uv;
out vec4 colorData;

uniform sampler2D uTT;

uniform vec3 uEye;

in vec3 color;


void main() {

    colorData = vec4(color, 1.);
}

`;



/***/ })
/******/ ]);