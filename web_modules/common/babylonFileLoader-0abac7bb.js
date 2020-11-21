import { d as __assign, O as Observable, f as Effect, L as Logger, _ as __extends, E as EngineStore, a as __decorate, S as StringTools } from './thinEngine-e576a091.js';
import { S as SerializationHelper, b as serializeAsMeshReference, s as serializeAsVector3 } from './node-87d9c658.js';
import { V as Vector3, S as Scalar, M as Matrix, _ as _TypeStore, e as ToGammaSpace, a as Vector2, b as Color3, C as Color4, d as Vector4, Q as Quaternion } from './math.color-fc6e801e.js';
import { C as Camera } from './pointerEvents-12a2451c.js';
import { T as Tools, D as DeepCopier } from './tools-ab6f1dea.js';
import { V as Viewport } from './math.frustum-2cd1d420.js';
import './math.axis-e7db27a6.js';
import { a as AbstractActionManager, A as AbstractScene } from './scene-cbeb8ae2.js';
import { V as VertexBuffer, d as SceneComponentConstants, M as Material, T as TransformNode } from './sceneComponent-5502b64a.js';
import { L as Light } from './light-a23926e9.js';
import './math.size-6398c1e8.js';
import { B as BaseTexture } from './baseTexture-827d5047.js';
import { T as Texture } from './texture-6b1db4fe.js';
import { G as Geometry, a as MultiMaterial, M as Mesh } from './mesh-cfdd36e7.js';
import { S as SceneLoader, a as Skeleton, M as MorphTargetManager, A as AssetContainer, C as CubeTexture, b as AnimationGroup } from './morphTargetManager-a4c1f2f4.js';
import { C as CubeMapToSphericalPolynomialTools } from './baseTexture.polynomial-54f1194f.js';
import './math.path-c216bc6f.js';
import './math.vertexFormat-0458f7ef.js';
import { P as PostProcess } from './postProcess-3bcb67b3.js';
import './helperFunctions-f4fc40e0.js';
import { P as PhysicsJoint } from './physicsJoint-3c3d48cb.js';
import { P as PhysicsImpostor } from './physicsImpostor-3a0fd09f.js';
import { P as PhysicsEngine } from './physicsEngine-9650ba74.js';
import { P as PhysicsRaycastResult, A as AmmoJSPlugin } from './ammoJSPlugin-15ce3c42.js';
import { R as RenderTargetTexture } from './renderTargetTexture-514b606c.js';

/**
 * Helper class useful to convert panorama picture to their cubemap representation in 6 faces.
 */
var PanoramaToCubeMapTools = /** @class */ (function () {
    function PanoramaToCubeMapTools() {
    }
    /**
     * Converts a panorma stored in RGB right to left up to down format into a cubemap (6 faces).
     *
     * @param float32Array The source data.
     * @param inputWidth The width of the input panorama.
     * @param inputHeight The height of the input panorama.
     * @param size The willing size of the generated cubemap (each faces will be size * size pixels)
     * @return The cubemap data
     */
    PanoramaToCubeMapTools.ConvertPanoramaToCubemap = function (float32Array, inputWidth, inputHeight, size) {
        if (!float32Array) {
            throw "ConvertPanoramaToCubemap: input cannot be null";
        }
        if (float32Array.length != inputWidth * inputHeight * 3) {
            throw "ConvertPanoramaToCubemap: input size is wrong";
        }
        var textureFront = this.CreateCubemapTexture(size, this.FACE_FRONT, float32Array, inputWidth, inputHeight);
        var textureBack = this.CreateCubemapTexture(size, this.FACE_BACK, float32Array, inputWidth, inputHeight);
        var textureLeft = this.CreateCubemapTexture(size, this.FACE_LEFT, float32Array, inputWidth, inputHeight);
        var textureRight = this.CreateCubemapTexture(size, this.FACE_RIGHT, float32Array, inputWidth, inputHeight);
        var textureUp = this.CreateCubemapTexture(size, this.FACE_UP, float32Array, inputWidth, inputHeight);
        var textureDown = this.CreateCubemapTexture(size, this.FACE_DOWN, float32Array, inputWidth, inputHeight);
        return {
            front: textureFront,
            back: textureBack,
            left: textureLeft,
            right: textureRight,
            up: textureUp,
            down: textureDown,
            size: size,
            type: 1,
            format: 4,
            gammaSpace: false,
        };
    };
    PanoramaToCubeMapTools.CreateCubemapTexture = function (texSize, faceData, float32Array, inputWidth, inputHeight) {
        var buffer = new ArrayBuffer(texSize * texSize * 4 * 3);
        var textureArray = new Float32Array(buffer);
        var rotDX1 = faceData[1].subtract(faceData[0]).scale(1 / texSize);
        var rotDX2 = faceData[3].subtract(faceData[2]).scale(1 / texSize);
        var dy = 1 / texSize;
        var fy = 0;
        for (var y = 0; y < texSize; y++) {
            var xv1 = faceData[0];
            var xv2 = faceData[2];
            for (var x = 0; x < texSize; x++) {
                var v = xv2.subtract(xv1).scale(fy).add(xv1);
                v.normalize();
                var color = this.CalcProjectionSpherical(v, float32Array, inputWidth, inputHeight);
                // 3 channels per pixels
                textureArray[y * texSize * 3 + (x * 3) + 0] = color.r;
                textureArray[y * texSize * 3 + (x * 3) + 1] = color.g;
                textureArray[y * texSize * 3 + (x * 3) + 2] = color.b;
                xv1 = xv1.add(rotDX1);
                xv2 = xv2.add(rotDX2);
            }
            fy += dy;
        }
        return textureArray;
    };
    PanoramaToCubeMapTools.CalcProjectionSpherical = function (vDir, float32Array, inputWidth, inputHeight) {
        var theta = Math.atan2(vDir.z, vDir.x);
        var phi = Math.acos(vDir.y);
        while (theta < -Math.PI) {
            theta += 2 * Math.PI;
        }
        while (theta > Math.PI) {
            theta -= 2 * Math.PI;
        }
        var dx = theta / Math.PI;
        var dy = phi / Math.PI;
        // recenter.
        dx = dx * 0.5 + 0.5;
        var px = Math.round(dx * inputWidth);
        if (px < 0) {
            px = 0;
        }
        else if (px >= inputWidth) {
            px = inputWidth - 1;
        }
        var py = Math.round(dy * inputHeight);
        if (py < 0) {
            py = 0;
        }
        else if (py >= inputHeight) {
            py = inputHeight - 1;
        }
        var inputY = (inputHeight - py - 1);
        var r = float32Array[inputY * inputWidth * 3 + (px * 3) + 0];
        var g = float32Array[inputY * inputWidth * 3 + (px * 3) + 1];
        var b = float32Array[inputY * inputWidth * 3 + (px * 3) + 2];
        return {
            r: r,
            g: g,
            b: b
        };
    };
    PanoramaToCubeMapTools.FACE_LEFT = [
        new Vector3(-1.0, -1.0, -1.0),
        new Vector3(1.0, -1.0, -1.0),
        new Vector3(-1.0, 1.0, -1.0),
        new Vector3(1.0, 1.0, -1.0)
    ];
    PanoramaToCubeMapTools.FACE_RIGHT = [
        new Vector3(1.0, -1.0, 1.0),
        new Vector3(-1.0, -1.0, 1.0),
        new Vector3(1.0, 1.0, 1.0),
        new Vector3(-1.0, 1.0, 1.0)
    ];
    PanoramaToCubeMapTools.FACE_FRONT = [
        new Vector3(1.0, -1.0, -1.0),
        new Vector3(1.0, -1.0, 1.0),
        new Vector3(1.0, 1.0, -1.0),
        new Vector3(1.0, 1.0, 1.0)
    ];
    PanoramaToCubeMapTools.FACE_BACK = [
        new Vector3(-1.0, -1.0, 1.0),
        new Vector3(-1.0, -1.0, -1.0),
        new Vector3(-1.0, 1.0, 1.0),
        new Vector3(-1.0, 1.0, -1.0)
    ];
    PanoramaToCubeMapTools.FACE_DOWN = [
        new Vector3(1.0, 1.0, -1.0),
        new Vector3(1.0, 1.0, 1.0),
        new Vector3(-1.0, 1.0, -1.0),
        new Vector3(-1.0, 1.0, 1.0),
    ];
    PanoramaToCubeMapTools.FACE_UP = [
        new Vector3(-1.0, -1.0, -1.0),
        new Vector3(-1.0, -1.0, 1.0),
        new Vector3(1.0, -1.0, -1.0),
        new Vector3(1.0, -1.0, 1.0),
    ];
    return PanoramaToCubeMapTools;
}());

/**
 * This groups tools to convert HDR texture to native colors array.
 */
var HDRTools = /** @class */ (function () {
    function HDRTools() {
    }
    HDRTools.Ldexp = function (mantissa, exponent) {
        if (exponent > 1023) {
            return mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023);
        }
        if (exponent < -1074) {
            return mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074);
        }
        return mantissa * Math.pow(2, exponent);
    };
    HDRTools.Rgbe2float = function (float32array, red, green, blue, exponent, index) {
        if (exponent > 0) { /*nonzero pixel*/
            exponent = this.Ldexp(1.0, exponent - (128 + 8));
            float32array[index + 0] = red * exponent;
            float32array[index + 1] = green * exponent;
            float32array[index + 2] = blue * exponent;
        }
        else {
            float32array[index + 0] = 0;
            float32array[index + 1] = 0;
            float32array[index + 2] = 0;
        }
    };
    HDRTools.readStringLine = function (uint8array, startIndex) {
        var line = "";
        var character = "";
        for (var i = startIndex; i < uint8array.length - startIndex; i++) {
            character = String.fromCharCode(uint8array[i]);
            if (character == "\n") {
                break;
            }
            line += character;
        }
        return line;
    };
    /**
     * Reads header information from an RGBE texture stored in a native array.
     * More information on this format are available here:
     * https://en.wikipedia.org/wiki/RGBE_image_format
     *
     * @param uint8array The binary file stored in  native array.
     * @return The header information.
     */
    HDRTools.RGBE_ReadHeader = function (uint8array) {
        var height = 0;
        var width = 0;
        var line = this.readStringLine(uint8array, 0);
        if (line[0] != '#' || line[1] != '?') {
            throw "Bad HDR Format.";
        }
        var endOfHeader = false;
        var findFormat = false;
        var lineIndex = 0;
        do {
            lineIndex += (line.length + 1);
            line = this.readStringLine(uint8array, lineIndex);
            if (line == "FORMAT=32-bit_rle_rgbe") {
                findFormat = true;
            }
            else if (line.length == 0) {
                endOfHeader = true;
            }
        } while (!endOfHeader);
        if (!findFormat) {
            throw "HDR Bad header format, unsupported FORMAT";
        }
        lineIndex += (line.length + 1);
        line = this.readStringLine(uint8array, lineIndex);
        var sizeRegexp = /^\-Y (.*) \+X (.*)$/g;
        var match = sizeRegexp.exec(line);
        // TODO. Support +Y and -X if needed.
        if (!match || match.length < 3) {
            throw "HDR Bad header format, no size";
        }
        width = parseInt(match[2]);
        height = parseInt(match[1]);
        if (width < 8 || width > 0x7fff) {
            throw "HDR Bad header format, unsupported size";
        }
        lineIndex += (line.length + 1);
        return {
            height: height,
            width: width,
            dataPosition: lineIndex
        };
    };
    /**
     * Returns the cubemap information (each faces texture data) extracted from an RGBE texture.
     * This RGBE texture needs to store the information as a panorama.
     *
     * More information on this format are available here:
     * https://en.wikipedia.org/wiki/RGBE_image_format
     *
     * @param buffer The binary file stored in an array buffer.
     * @param size The expected size of the extracted cubemap.
     * @return The Cube Map information.
     */
    HDRTools.GetCubeMapTextureData = function (buffer, size) {
        var uint8array = new Uint8Array(buffer);
        var hdrInfo = this.RGBE_ReadHeader(uint8array);
        var data = this.RGBE_ReadPixels(uint8array, hdrInfo);
        var cubeMapData = PanoramaToCubeMapTools.ConvertPanoramaToCubemap(data, hdrInfo.width, hdrInfo.height, size);
        return cubeMapData;
    };
    /**
     * Returns the pixels data extracted from an RGBE texture.
     * This pixels will be stored left to right up to down in the R G B order in one array.
     *
     * More information on this format are available here:
     * https://en.wikipedia.org/wiki/RGBE_image_format
     *
     * @param uint8array The binary file stored in an array buffer.
     * @param hdrInfo The header information of the file.
     * @return The pixels data in RGB right to left up to down order.
     */
    HDRTools.RGBE_ReadPixels = function (uint8array, hdrInfo) {
        return this.RGBE_ReadPixels_RLE(uint8array, hdrInfo);
    };
    HDRTools.RGBE_ReadPixels_RLE = function (uint8array, hdrInfo) {
        var num_scanlines = hdrInfo.height;
        var scanline_width = hdrInfo.width;
        var a, b, c, d, count;
        var dataIndex = hdrInfo.dataPosition;
        var index = 0, endIndex = 0, i = 0;
        var scanLineArrayBuffer = new ArrayBuffer(scanline_width * 4); // four channel R G B E
        var scanLineArray = new Uint8Array(scanLineArrayBuffer);
        // 3 channels of 4 bytes per pixel in float.
        var resultBuffer = new ArrayBuffer(hdrInfo.width * hdrInfo.height * 4 * 3);
        var resultArray = new Float32Array(resultBuffer);
        // read in each successive scanline
        while (num_scanlines > 0) {
            a = uint8array[dataIndex++];
            b = uint8array[dataIndex++];
            c = uint8array[dataIndex++];
            d = uint8array[dataIndex++];
            if (a != 2 || b != 2 || (c & 0x80) || hdrInfo.width < 8 || hdrInfo.width > 32767) {
                return this.RGBE_ReadPixels_NOT_RLE(uint8array, hdrInfo);
            }
            if (((c << 8) | d) != scanline_width) {
                throw "HDR Bad header format, wrong scan line width";
            }
            index = 0;
            // read each of the four channels for the scanline into the buffer
            for (i = 0; i < 4; i++) {
                endIndex = (i + 1) * scanline_width;
                while (index < endIndex) {
                    a = uint8array[dataIndex++];
                    b = uint8array[dataIndex++];
                    if (a > 128) {
                        // a run of the same value
                        count = a - 128;
                        if ((count == 0) || (count > endIndex - index)) {
                            throw "HDR Bad Format, bad scanline data (run)";
                        }
                        while (count-- > 0) {
                            scanLineArray[index++] = b;
                        }
                    }
                    else {
                        // a non-run
                        count = a;
                        if ((count == 0) || (count > endIndex - index)) {
                            throw "HDR Bad Format, bad scanline data (non-run)";
                        }
                        scanLineArray[index++] = b;
                        if (--count > 0) {
                            for (var j = 0; j < count; j++) {
                                scanLineArray[index++] = uint8array[dataIndex++];
                            }
                        }
                    }
                }
            }
            // now convert data from buffer into floats
            for (i = 0; i < scanline_width; i++) {
                a = scanLineArray[i];
                b = scanLineArray[i + scanline_width];
                c = scanLineArray[i + 2 * scanline_width];
                d = scanLineArray[i + 3 * scanline_width];
                this.Rgbe2float(resultArray, a, b, c, d, (hdrInfo.height - num_scanlines) * scanline_width * 3 + i * 3);
            }
            num_scanlines--;
        }
        return resultArray;
    };
    HDRTools.RGBE_ReadPixels_NOT_RLE = function (uint8array, hdrInfo) {
        // this file is not run length encoded
        // read values sequentially
        var num_scanlines = hdrInfo.height;
        var scanline_width = hdrInfo.width;
        var a, b, c, d, i;
        var dataIndex = hdrInfo.dataPosition;
        // 3 channels of 4 bytes per pixel in float.
        var resultBuffer = new ArrayBuffer(hdrInfo.width * hdrInfo.height * 4 * 3);
        var resultArray = new Float32Array(resultBuffer);
        // read in each successive scanline
        while (num_scanlines > 0) {
            for (i = 0; i < hdrInfo.width; i++) {
                a = uint8array[dataIndex++];
                b = uint8array[dataIndex++];
                c = uint8array[dataIndex++];
                d = uint8array[dataIndex++];
                this.Rgbe2float(resultArray, a, b, c, d, (hdrInfo.height - num_scanlines) * scanline_width * 3 + i * 3);
            }
            num_scanlines--;
        }
        return resultArray;
    };
    return HDRTools;
}());

/**
 * Helper class to render one or more effects.
 * You can access the previous rendering in your shader by declaring a sampler named textureSampler
 */
var EffectRenderer = /** @class */ (function () {
    /**
     * Creates an effect renderer
     * @param engine the engine to use for rendering
     * @param options defines the options of the effect renderer
     */
    function EffectRenderer(engine, options) {
        var _a;
        if (options === void 0) { options = EffectRenderer._DefaultOptions; }
        this.engine = engine;
        this._fullscreenViewport = new Viewport(0, 0, 1, 1);
        options = __assign(__assign({}, EffectRenderer._DefaultOptions), options);
        this._vertexBuffers = (_a = {},
            _a[VertexBuffer.PositionKind] = new VertexBuffer(engine, options.positions, VertexBuffer.PositionKind, false, false, 2),
            _a);
        this._indexBuffer = engine.createIndexBuffer(options.indices);
    }
    /**
     * Sets the current viewport in normalized coordinates 0-1
     * @param viewport Defines the viewport to set (defaults to 0 0 1 1)
     */
    EffectRenderer.prototype.setViewport = function (viewport) {
        if (viewport === void 0) { viewport = this._fullscreenViewport; }
        this.engine.setViewport(viewport);
    };
    /**
     * Binds the embedded attributes buffer to the effect.
     * @param effect Defines the effect to bind the attributes for
     */
    EffectRenderer.prototype.bindBuffers = function (effect) {
        this.engine.bindBuffers(this._vertexBuffers, this._indexBuffer, effect);
    };
    /**
     * Sets the current effect wrapper to use during draw.
     * The effect needs to be ready before calling this api.
     * This also sets the default full screen position attribute.
     * @param effectWrapper Defines the effect to draw with
     */
    EffectRenderer.prototype.applyEffectWrapper = function (effectWrapper) {
        this.engine.depthCullingState.depthTest = false;
        this.engine.stencilState.stencilTest = false;
        this.engine.enableEffect(effectWrapper.effect);
        this.bindBuffers(effectWrapper.effect);
        effectWrapper.onApplyObservable.notifyObservers({});
    };
    /**
     * Restores engine states
     */
    EffectRenderer.prototype.restoreStates = function () {
        this.engine.depthCullingState.depthTest = true;
        this.engine.stencilState.stencilTest = true;
    };
    /**
     * Draws a full screen quad.
     */
    EffectRenderer.prototype.draw = function () {
        this.engine.drawElementsType(0, 0, 6);
    };
    EffectRenderer.prototype.isRenderTargetTexture = function (texture) {
        return texture.renderList !== undefined;
    };
    /**
     * renders one or more effects to a specified texture
     * @param effectWrapper the effect to renderer
     * @param outputTexture texture to draw to, if null it will render to the screen.
     */
    EffectRenderer.prototype.render = function (effectWrapper, outputTexture) {
        if (outputTexture === void 0) { outputTexture = null; }
        // Ensure effect is ready
        if (!effectWrapper.effect.isReady()) {
            return;
        }
        // Reset state
        this.setViewport();
        var out = outputTexture === null ? null : this.isRenderTargetTexture(outputTexture) ? outputTexture.getInternalTexture() : outputTexture;
        if (out) {
            this.engine.bindFramebuffer(out);
        }
        this.applyEffectWrapper(effectWrapper);
        this.draw();
        if (out) {
            this.engine.unBindFramebuffer(out);
        }
        this.restoreStates();
    };
    /**
     * Disposes of the effect renderer
     */
    EffectRenderer.prototype.dispose = function () {
        var vertexBuffer = this._vertexBuffers[VertexBuffer.PositionKind];
        if (vertexBuffer) {
            vertexBuffer.dispose();
            delete this._vertexBuffers[VertexBuffer.PositionKind];
        }
        if (this._indexBuffer) {
            this.engine._releaseBuffer(this._indexBuffer);
        }
    };
    // Fullscreen quad buffers by default.
    EffectRenderer._DefaultOptions = {
        positions: [1, 1, -1, 1, -1, -1, 1, -1],
        indices: [0, 1, 2, 0, 2, 3],
    };
    return EffectRenderer;
}());
/**
 * Wraps an effect to be used for rendering
 */
var EffectWrapper = /** @class */ (function () {
    /**
     * Creates an effect to be renderer
     * @param creationOptions options to create the effect
     */
    function EffectWrapper(creationOptions) {
        var _this = this;
        /**
         * Event that is fired right before the effect is drawn (should be used to update uniforms)
         */
        this.onApplyObservable = new Observable();
        var effectCreationOptions;
        var uniformNames = creationOptions.uniformNames || [];
        if (creationOptions.vertexShader) {
            effectCreationOptions = {
                fragmentSource: creationOptions.fragmentShader,
                vertexSource: creationOptions.vertexShader,
                spectorName: creationOptions.name || "effectWrapper"
            };
        }
        else {
            // Default scale to use in post process vertex shader.
            uniformNames.push("scale");
            effectCreationOptions = {
                fragmentSource: creationOptions.fragmentShader,
                vertex: "postprocess",
                spectorName: creationOptions.name || "effectWrapper"
            };
            // Sets the default scale to identity for the post process vertex shader.
            this.onApplyObservable.add(function () {
                _this.effect.setFloat2("scale", 1, 1);
            });
        }
        var defines = creationOptions.defines ? creationOptions.defines.join("\n") : "";
        if (creationOptions.useShaderStore) {
            effectCreationOptions.fragment = effectCreationOptions.fragmentSource;
            if (!effectCreationOptions.vertex) {
                effectCreationOptions.vertex = effectCreationOptions.vertexSource;
            }
            delete effectCreationOptions.fragmentSource;
            delete effectCreationOptions.vertexSource;
            this.effect = creationOptions.engine.createEffect(effectCreationOptions.spectorName, creationOptions.attributeNames || ["position"], uniformNames, creationOptions.samplerNames, defines, undefined, creationOptions.onCompiled);
        }
        else {
            this.effect = new Effect(effectCreationOptions, creationOptions.attributeNames || ["position"], uniformNames, creationOptions.samplerNames, creationOptions.engine, defines, undefined, creationOptions.onCompiled);
        }
    }
    /**
    * Disposes of the effect wrapper
    */
    EffectWrapper.prototype.dispose = function () {
        this.effect.dispose();
    };
    return EffectWrapper;
}());

var name = 'hdrFilteringVertexShader';
var shader = "\nattribute vec2 position;\n\nvarying vec3 direction;\n\nuniform vec3 up;\nuniform vec3 right;\nuniform vec3 front;\nvoid main(void) {\nmat3 view=mat3(up,right,front);\ndirection=view*vec3(position,1.0);\ngl_Position=vec4(position,0.0,1.0);\n}";
Effect.ShadersStore[name] = shader;

var name$1 = 'hdrFilteringPixelShader';
var shader$1 = "#include<helperFunctions>\n#include<importanceSampling>\n#include<pbrBRDFFunctions>\n#include<hdrFilteringFunctions>\nuniform float alphaG;\nuniform samplerCube inputTexture;\nuniform vec2 vFilteringInfo;\nuniform float hdrScale;\nvarying vec3 direction;\nvoid main() {\nvec3 color=radiance(alphaG,inputTexture,direction,vFilteringInfo);\ngl_FragColor=vec4(color*hdrScale,1.0);\n}";
Effect.ShadersStore[name$1] = shader$1;

/**
 * Filters HDR maps to get correct renderings of PBR reflections
 */
var HDRFiltering = /** @class */ (function () {
    /**
     * Instantiates HDR filter for reflection maps
     *
     * @param engine Thin engine
     * @param options Options
     */
    function HDRFiltering(engine, options) {
        if (options === void 0) { options = {}; }
        this._lodGenerationOffset = 0;
        this._lodGenerationScale = 0.8;
        /**
         * Quality switch for prefiltering. Should be set to `4096` unless
         * you care about baking speed.
         */
        this.quality = 4096;
        /**
         * Scales pixel intensity for the input HDR map.
         */
        this.hdrScale = 1;
        // pass
        this._engine = engine;
        this.hdrScale = options.hdrScale || this.hdrScale;
        this.quality = options.hdrScale || this.quality;
    }
    HDRFiltering.prototype._createRenderTarget = function (size) {
        var textureType = 0;
        if (this._engine.getCaps().textureHalfFloatRender) {
            textureType = 2;
        }
        else if (this._engine.getCaps().textureFloatRender) {
            textureType = 1;
        }
        var texture = this._engine.createRenderTargetCubeTexture(size, {
            format: 5,
            type: textureType,
            generateMipMaps: false,
            generateDepthBuffer: false,
            generateStencilBuffer: false,
            samplingMode: 1
        });
        this._engine.updateTextureWrappingMode(texture, 0, 0, 0);
        this._engine.updateTextureSamplingMode(3, texture, true);
        return texture;
    };
    HDRFiltering.prototype._prefilterInternal = function (texture) {
        var width = texture.getSize().width;
        var mipmapsCount = Math.round(Scalar.Log2(width)) + 1;
        var effect = this._effectWrapper.effect;
        var outputTexture = this._createRenderTarget(width);
        this._effectRenderer.setViewport();
        var intTexture = texture.getInternalTexture();
        if (intTexture) {
            // Just in case generate fresh clean mips.
            this._engine.updateTextureSamplingMode(3, intTexture, true);
        }
        this._effectRenderer.applyEffectWrapper(this._effectWrapper);
        var directions = [
            [new Vector3(0, 0, -1), new Vector3(0, -1, 0), new Vector3(1, 0, 0)],
            [new Vector3(0, 0, 1), new Vector3(0, -1, 0), new Vector3(-1, 0, 0)],
            [new Vector3(1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 1, 0)],
            [new Vector3(1, 0, 0), new Vector3(0, 0, -1), new Vector3(0, -1, 0)],
            [new Vector3(1, 0, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1)],
            [new Vector3(-1, 0, 0), new Vector3(0, -1, 0), new Vector3(0, 0, -1)],
        ];
        effect.setFloat("hdrScale", this.hdrScale);
        effect.setFloat2("vFilteringInfo", texture.getSize().width, mipmapsCount);
        effect.setTexture("inputTexture", texture);
        for (var face = 0; face < 6; face++) {
            effect.setVector3("up", directions[face][0]);
            effect.setVector3("right", directions[face][1]);
            effect.setVector3("front", directions[face][2]);
            for (var lod = 0; lod < mipmapsCount; lod++) {
                this._engine.bindFramebuffer(outputTexture, face, undefined, undefined, true, lod);
                this._effectRenderer.applyEffectWrapper(this._effectWrapper);
                var alpha = Math.pow(2, (lod - this._lodGenerationOffset) / this._lodGenerationScale) / width;
                if (lod === 0) {
                    alpha = 0;
                }
                effect.setFloat("alphaG", alpha);
                this._effectRenderer.draw();
            }
        }
        // Cleanup
        this._effectRenderer.restoreStates();
        this._engine.restoreDefaultFramebuffer();
        this._engine._releaseFramebufferObjects(outputTexture);
        this._engine._releaseTexture(texture._texture);
        // Internal Swap
        outputTexture._swapAndDie(texture._texture);
        texture._prefiltered = true;
        return texture;
    };
    HDRFiltering.prototype._createEffect = function (texture, onCompiled) {
        var defines = [];
        if (texture.gammaSpace) {
            defines.push("#define GAMMA_INPUT");
        }
        defines.push("#define NUM_SAMPLES " + this.quality + "u"); // unsigned int
        var effectWrapper = new EffectWrapper({
            engine: this._engine,
            name: "hdrFiltering",
            vertexShader: "hdrFiltering",
            fragmentShader: "hdrFiltering",
            samplerNames: ["inputTexture"],
            uniformNames: ["vSampleDirections", "vWeights", "up", "right", "front", "vFilteringInfo", "hdrScale", "alphaG"],
            useShaderStore: true,
            defines: defines,
            onCompiled: onCompiled
        });
        return effectWrapper;
    };
    /**
     * Get a value indicating if the filter is ready to be used
     * @param texture Texture to filter
     * @returns true if the filter is ready
     */
    HDRFiltering.prototype.isReady = function (texture) {
        return (texture.isReady() && this._effectWrapper.effect.isReady());
    };
    /**
      * Prefilters a cube texture to have mipmap levels representing roughness values.
      * Prefiltering will be invoked at the end of next rendering pass.
      * This has to be done once the map is loaded, and has not been prefiltered by a third party software.
      * See http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf for more information
      * @param texture Texture to filter
      * @param onFinished Callback when filtering is done
      * @return Promise called when prefiltering is done
      */
    HDRFiltering.prototype.prefilter = function (texture, onFinished) {
        var _this = this;
        if (onFinished === void 0) { onFinished = null; }
        if (this._engine.webGLVersion === 1) {
            Logger.Warn("HDR prefiltering is not available in WebGL 1., you can use real time filtering instead.");
            return;
        }
        return new Promise(function (resolve) {
            _this._effectRenderer = new EffectRenderer(_this._engine);
            _this._effectWrapper = _this._createEffect(texture);
            _this._effectWrapper.effect.executeWhenCompiled(function () {
                _this._prefilterInternal(texture);
                _this._effectRenderer.dispose();
                _this._effectWrapper.dispose();
                resolve();
                if (onFinished) {
                    onFinished();
                }
            });
        });
    };
    return HDRFiltering;
}());

/**
 * This represents a texture coming from an HDR input.
 *
 * The only supported format is currently panorama picture stored in RGBE format.
 * Example of such files can be found on HDRLib: http://hdrlib.com/
 */
var HDRCubeTexture = /** @class */ (function (_super) {
    __extends(HDRCubeTexture, _super);
    /**
     * Instantiates an HDRTexture from the following parameters.
     *
     * @param url The location of the HDR raw data (Panorama stored in RGBE format)
     * @param sceneOrEngine The scene or engine the texture will be used in
     * @param size The cubemap desired size (the more it increases the longer the generation will be)
     * @param noMipmap Forces to not generate the mipmap if true
     * @param generateHarmonics Specifies whether you want to extract the polynomial harmonics during the generation process
     * @param gammaSpace Specifies if the texture will be use in gamma or linear space (the PBR material requires those texture in linear space, but the standard material would require them in Gamma space)
     * @param prefilterOnLoad Prefilters HDR texture to allow use of this texture as a PBR reflection texture.
     */
    function HDRCubeTexture(url, sceneOrEngine, size, noMipmap, generateHarmonics, gammaSpace, prefilterOnLoad, onLoad, onError) {
        if (noMipmap === void 0) { noMipmap = false; }
        if (generateHarmonics === void 0) { generateHarmonics = true; }
        if (gammaSpace === void 0) { gammaSpace = false; }
        if (prefilterOnLoad === void 0) { prefilterOnLoad = false; }
        if (onLoad === void 0) { onLoad = null; }
        if (onError === void 0) { onError = null; }
        var _a;
        var _this = _super.call(this, sceneOrEngine) || this;
        _this._generateHarmonics = true;
        _this._onLoad = null;
        _this._onError = null;
        _this._isBlocking = true;
        _this._rotationY = 0;
        /**
         * Gets or sets the center of the bounding box associated with the cube texture
         * It must define where the camera used to render the texture was set
         */
        _this.boundingBoxPosition = Vector3.Zero();
        if (!url) {
            return _this;
        }
        _this._coordinatesMode = Texture.CUBIC_MODE;
        _this.name = url;
        _this.url = url;
        _this.hasAlpha = false;
        _this.isCube = true;
        _this._textureMatrix = Matrix.Identity();
        _this._prefilterOnLoad = prefilterOnLoad;
        _this._onLoad = onLoad;
        _this._onError = onError;
        _this.gammaSpace = gammaSpace;
        _this._noMipmap = noMipmap;
        _this._size = size;
        _this._generateHarmonics = generateHarmonics;
        _this._texture = _this._getFromCache(url, _this._noMipmap);
        if (!_this._texture) {
            if (!((_a = _this.getScene()) === null || _a === void 0 ? void 0 : _a.useDelayedTextureLoading)) {
                _this.loadTexture();
            }
            else {
                _this.delayLoadState = 4;
            }
        }
        else if (onLoad) {
            if (_this._texture.isReady) {
                Tools.SetImmediate(function () { return onLoad(); });
            }
            else {
                _this._texture.onLoadedObservable.add(onLoad);
            }
        }
        return _this;
    }
    Object.defineProperty(HDRCubeTexture.prototype, "isBlocking", {
        /**
         * Gets wether or not the texture is blocking during loading.
         */
        get: function () {
            return this._isBlocking;
        },
        /**
         * Sets wether or not the texture is blocking during loading.
         */
        set: function (value) {
            this._isBlocking = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HDRCubeTexture.prototype, "rotationY", {
        /**
         * Gets texture matrix rotation angle around Y axis radians.
         */
        get: function () {
            return this._rotationY;
        },
        /**
         * Sets texture matrix rotation angle around Y axis in radians.
         */
        set: function (value) {
            this._rotationY = value;
            this.setReflectionTextureMatrix(Matrix.RotationY(this._rotationY));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HDRCubeTexture.prototype, "boundingBoxSize", {
        get: function () {
            return this._boundingBoxSize;
        },
        /**
         * Gets or sets the size of the bounding box associated with the cube texture
         * When defined, the cubemap will switch to local mode
         * @see https://community.arm.com/graphics/b/blog/posts/reflections-based-on-local-cubemaps-in-unity
         * @example https://www.babylonjs-playground.com/#RNASML
         */
        set: function (value) {
            if (this._boundingBoxSize && this._boundingBoxSize.equals(value)) {
                return;
            }
            this._boundingBoxSize = value;
            var scene = this.getScene();
            if (scene) {
                scene.markAllMaterialsAsDirty(1);
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the current class name of the texture useful for serialization or dynamic coding.
     * @returns "HDRCubeTexture"
     */
    HDRCubeTexture.prototype.getClassName = function () {
        return "HDRCubeTexture";
    };
    /**
     * Occurs when the file is raw .hdr file.
     */
    HDRCubeTexture.prototype.loadTexture = function () {
        var _this = this;
        var engine = this._getEngine();
        var callback = function (buffer) {
            _this.lodGenerationOffset = 0.0;
            _this.lodGenerationScale = 0.8;
            // Extract the raw linear data.
            var data = HDRTools.GetCubeMapTextureData(buffer, _this._size);
            // Generate harmonics if needed.
            if (_this._generateHarmonics) {
                var sphericalPolynomial = CubeMapToSphericalPolynomialTools.ConvertCubeMapToSphericalPolynomial(data);
                _this.sphericalPolynomial = sphericalPolynomial;
            }
            var results = [];
            var byteArray = null;
            // Push each faces.
            for (var j = 0; j < 6; j++) {
                // Create uintarray fallback.
                if (!engine.getCaps().textureFloat) {
                    // 3 channels of 1 bytes per pixel in bytes.
                    var byteBuffer = new ArrayBuffer(_this._size * _this._size * 3);
                    byteArray = new Uint8Array(byteBuffer);
                }
                var dataFace = (data[HDRCubeTexture._facesMapping[j]]);
                // If special cases.
                if (_this.gammaSpace || byteArray) {
                    for (var i = 0; i < _this._size * _this._size; i++) {
                        // Put in gamma space if requested.
                        if (_this.gammaSpace) {
                            dataFace[(i * 3) + 0] = Math.pow(dataFace[(i * 3) + 0], ToGammaSpace);
                            dataFace[(i * 3) + 1] = Math.pow(dataFace[(i * 3) + 1], ToGammaSpace);
                            dataFace[(i * 3) + 2] = Math.pow(dataFace[(i * 3) + 2], ToGammaSpace);
                        }
                        // Convert to int texture for fallback.
                        if (byteArray) {
                            var r = Math.max(dataFace[(i * 3) + 0] * 255, 0);
                            var g = Math.max(dataFace[(i * 3) + 1] * 255, 0);
                            var b = Math.max(dataFace[(i * 3) + 2] * 255, 0);
                            // May use luminance instead if the result is not accurate.
                            var max = Math.max(Math.max(r, g), b);
                            if (max > 255) {
                                var scale = 255 / max;
                                r *= scale;
                                g *= scale;
                                b *= scale;
                            }
                            byteArray[(i * 3) + 0] = r;
                            byteArray[(i * 3) + 1] = g;
                            byteArray[(i * 3) + 2] = b;
                        }
                    }
                }
                if (byteArray) {
                    results.push(byteArray);
                }
                else {
                    results.push(dataFace);
                }
            }
            return results;
        };
        if (this._getEngine().webGLVersion >= 2 && this._prefilterOnLoad) {
            var previousOnLoad_1 = this._onLoad;
            var hdrFiltering_1 = new HDRFiltering(engine);
            this._onLoad = function () {
                hdrFiltering_1.prefilter(_this, previousOnLoad_1);
            };
        }
        this._texture = engine.createRawCubeTextureFromUrl(this.url, this.getScene(), this._size, 4, engine.getCaps().textureFloat ? 1 : 0, this._noMipmap, callback, null, this._onLoad, this._onError);
    };
    HDRCubeTexture.prototype.clone = function () {
        var newTexture = new HDRCubeTexture(this.url, this.getScene() || this._getEngine(), this._size, this._noMipmap, this._generateHarmonics, this.gammaSpace);
        // Base texture
        newTexture.level = this.level;
        newTexture.wrapU = this.wrapU;
        newTexture.wrapV = this.wrapV;
        newTexture.coordinatesIndex = this.coordinatesIndex;
        newTexture.coordinatesMode = this.coordinatesMode;
        return newTexture;
    };
    // Methods
    HDRCubeTexture.prototype.delayLoad = function () {
        if (this.delayLoadState !== 4) {
            return;
        }
        this.delayLoadState = 1;
        this._texture = this._getFromCache(this.url, this._noMipmap);
        if (!this._texture) {
            this.loadTexture();
        }
    };
    /**
     * Get the texture reflection matrix used to rotate/transform the reflection.
     * @returns the reflection matrix
     */
    HDRCubeTexture.prototype.getReflectionTextureMatrix = function () {
        return this._textureMatrix;
    };
    /**
     * Set the texture reflection matrix used to rotate/transform the reflection.
     * @param value Define the reflection matrix to set
     */
    HDRCubeTexture.prototype.setReflectionTextureMatrix = function (value) {
        var _this = this;
        var _a;
        this._textureMatrix = value;
        if (value.updateFlag === this._textureMatrix.updateFlag) {
            return;
        }
        if (value.isIdentity() !== this._textureMatrix.isIdentity()) {
            (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.markAllMaterialsAsDirty(1, function (mat) { return mat.getActiveTextures().indexOf(_this) !== -1; });
        }
    };
    /**
     * Parses a JSON representation of an HDR Texture in order to create the texture
     * @param parsedTexture Define the JSON representation
     * @param scene Define the scene the texture should be created in
     * @param rootUrl Define the root url in case we need to load relative dependencies
     * @returns the newly created texture after parsing
     */
    HDRCubeTexture.Parse = function (parsedTexture, scene, rootUrl) {
        var texture = null;
        if (parsedTexture.name && !parsedTexture.isRenderTarget) {
            texture = new HDRCubeTexture(rootUrl + parsedTexture.name, scene, parsedTexture.size, parsedTexture.noMipmap, parsedTexture.generateHarmonics, parsedTexture.useInGammaSpace);
            texture.name = parsedTexture.name;
            texture.hasAlpha = parsedTexture.hasAlpha;
            texture.level = parsedTexture.level;
            texture.coordinatesMode = parsedTexture.coordinatesMode;
            texture.isBlocking = parsedTexture.isBlocking;
        }
        if (texture) {
            if (parsedTexture.boundingBoxPosition) {
                texture.boundingBoxPosition = Vector3.FromArray(parsedTexture.boundingBoxPosition);
            }
            if (parsedTexture.boundingBoxSize) {
                texture.boundingBoxSize = Vector3.FromArray(parsedTexture.boundingBoxSize);
            }
            if (parsedTexture.rotationY) {
                texture.rotationY = parsedTexture.rotationY;
            }
        }
        return texture;
    };
    HDRCubeTexture.prototype.serialize = function () {
        if (!this.name) {
            return null;
        }
        var serializationObject = {};
        serializationObject.name = this.name;
        serializationObject.hasAlpha = this.hasAlpha;
        serializationObject.isCube = true;
        serializationObject.level = this.level;
        serializationObject.size = this._size;
        serializationObject.coordinatesMode = this.coordinatesMode;
        serializationObject.useInGammaSpace = this.gammaSpace;
        serializationObject.generateHarmonics = this._generateHarmonics;
        serializationObject.customType = "BABYLON.HDRCubeTexture";
        serializationObject.noMipmap = this._noMipmap;
        serializationObject.isBlocking = this._isBlocking;
        serializationObject.rotationY = this._rotationY;
        return serializationObject;
    };
    HDRCubeTexture._facesMapping = [
        "right",
        "left",
        "up",
        "down",
        "front",
        "back"
    ];
    return HDRCubeTexture;
}(BaseTexture));
_TypeStore.RegisteredTypes["BABYLON.HDRCubeTexture"] = HDRCubeTexture;

/**
 * The action to be carried out following a trigger
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#available-actions
 */
var Action = /** @class */ (function () {
    /**
     * Creates a new Action
     * @param triggerOptions the trigger, with or without parameters, for the action
     * @param condition an optional determinant of action
     */
    function Action(
    /** the trigger, with or without parameters, for the action */
    triggerOptions, condition) {
        this.triggerOptions = triggerOptions;
        /**
        * An event triggered prior to action being executed.
        */
        this.onBeforeExecuteObservable = new Observable();
        if (triggerOptions.parameter) {
            this.trigger = triggerOptions.trigger;
            this._triggerParameter = triggerOptions.parameter;
        }
        else if (triggerOptions.trigger) {
            this.trigger = triggerOptions.trigger;
        }
        else {
            this.trigger = triggerOptions;
        }
        this._nextActiveAction = this;
        this._condition = condition;
    }
    /**
     * Internal only
     * @hidden
     */
    Action.prototype._prepare = function () {
    };
    /**
     * Gets the trigger parameters
     * @returns the trigger parameters
     */
    Action.prototype.getTriggerParameter = function () {
        return this._triggerParameter;
    };
    /**
     * Internal only - executes current action event
     * @hidden
     */
    Action.prototype._executeCurrent = function (evt) {
        if (this._nextActiveAction._condition) {
            var condition = this._nextActiveAction._condition;
            var currentRenderId = this._actionManager.getScene().getRenderId();
            // We cache the current evaluation for the current frame
            if (condition._evaluationId === currentRenderId) {
                if (!condition._currentResult) {
                    return;
                }
            }
            else {
                condition._evaluationId = currentRenderId;
                if (!condition.isValid()) {
                    condition._currentResult = false;
                    return;
                }
                condition._currentResult = true;
            }
        }
        this.onBeforeExecuteObservable.notifyObservers(this);
        this._nextActiveAction.execute(evt);
        this.skipToNextActiveAction();
    };
    /**
     * Execute placeholder for child classes
     * @param evt optional action event
     */
    Action.prototype.execute = function (evt) {
    };
    /**
     * Skips to next active action
     */
    Action.prototype.skipToNextActiveAction = function () {
        if (this._nextActiveAction._child) {
            if (!this._nextActiveAction._child._actionManager) {
                this._nextActiveAction._child._actionManager = this._actionManager;
            }
            this._nextActiveAction = this._nextActiveAction._child;
        }
        else {
            this._nextActiveAction = this;
        }
    };
    /**
     * Adds action to chain of actions, may be a DoNothingAction
     * @param action defines the next action to execute
     * @returns The action passed in
     * @see https://www.babylonjs-playground.com/#1T30HR#0
     */
    Action.prototype.then = function (action) {
        this._child = action;
        action._actionManager = this._actionManager;
        action._prepare();
        return action;
    };
    /**
     * Internal only
     * @hidden
     */
    Action.prototype._getProperty = function (propertyPath) {
        return this._actionManager._getProperty(propertyPath);
    };
    /**
     * Internal only
     * @hidden
     */
    Action.prototype._getEffectiveTarget = function (target, propertyPath) {
        return this._actionManager._getEffectiveTarget(target, propertyPath);
    };
    /**
     * Serialize placeholder for child classes
     * @param parent of child
     * @returns the serialized object
     */
    Action.prototype.serialize = function (parent) {
    };
    /**
     * Internal only called by serialize
     * @hidden
     */
    Action.prototype._serialize = function (serializedAction, parent) {
        var serializationObject = {
            type: 1,
            children: [],
            name: serializedAction.name,
            properties: serializedAction.properties || []
        };
        // Serialize child
        if (this._child) {
            this._child.serialize(serializationObject);
        }
        // Check if "this" has a condition
        if (this._condition) {
            var serializedCondition = this._condition.serialize();
            serializedCondition.children.push(serializationObject);
            if (parent) {
                parent.children.push(serializedCondition);
            }
            return serializedCondition;
        }
        if (parent) {
            parent.children.push(serializationObject);
        }
        return serializationObject;
    };
    /**
     * Internal only
     * @hidden
     */
    Action._SerializeValueAsString = function (value) {
        if (typeof value === "number") {
            return value.toString();
        }
        if (typeof value === "boolean") {
            return value ? "true" : "false";
        }
        if (value instanceof Vector2) {
            return value.x + ", " + value.y;
        }
        if (value instanceof Vector3) {
            return value.x + ", " + value.y + ", " + value.z;
        }
        if (value instanceof Color3) {
            return value.r + ", " + value.g + ", " + value.b;
        }
        if (value instanceof Color4) {
            return value.r + ", " + value.g + ", " + value.b + ", " + value.a;
        }
        return value; // string
    };
    /**
     * Internal only
     * @hidden
     */
    Action._GetTargetProperty = function (target) {
        return {
            name: "target",
            targetType: target._isMesh ? "MeshProperties"
                : target._isLight ? "LightProperties"
                    : target._isCamera ? "CameraProperties"
                        : "SceneProperties",
            value: target._isScene ? "Scene" : target.name
        };
    };
    return Action;
}());
_TypeStore.RegisteredTypes["BABYLON.Action"] = Action;

/**
 * A Condition applied to an Action
 */
var Condition = /** @class */ (function () {
    /**
     * Creates a new Condition
     * @param actionManager the manager of the action the condition is applied to
     */
    function Condition(actionManager) {
        this._actionManager = actionManager;
    }
    /**
     * Check if the current condition is valid
     * @returns a boolean
     */
    Condition.prototype.isValid = function () {
        return true;
    };
    /**
     * Internal only
     * @hidden
     */
    Condition.prototype._getProperty = function (propertyPath) {
        return this._actionManager._getProperty(propertyPath);
    };
    /**
     * Internal only
     * @hidden
     */
    Condition.prototype._getEffectiveTarget = function (target, propertyPath) {
        return this._actionManager._getEffectiveTarget(target, propertyPath);
    };
    /**
     * Serialize placeholder for child classes
     * @returns the serialized object
     */
    Condition.prototype.serialize = function () {
    };
    /**
     * Internal only
     * @hidden
     */
    Condition.prototype._serialize = function (serializedCondition) {
        return {
            type: 2,
            children: [],
            name: serializedCondition.name,
            properties: serializedCondition.properties
        };
    };
    return Condition;
}());
/**
 * Defines specific conditional operators as extensions of Condition
 */
var ValueCondition = /** @class */ (function (_super) {
    __extends(ValueCondition, _super);
    /**
     * Creates a new ValueCondition
     * @param actionManager manager for the action the condition applies to
     * @param target for the action
     * @param propertyPath path to specify the property of the target the conditional operator uses
     * @param value the value compared by the conditional operator against the current value of the property
     * @param operator the conditional operator, default ValueCondition.IsEqual
     */
    function ValueCondition(actionManager, target, 
    /** path to specify the property of the target the conditional operator uses  */
    propertyPath, 
    /** the value compared by the conditional operator against the current value of the property */
    value, 
    /** the conditional operator, default ValueCondition.IsEqual */
    operator) {
        if (operator === void 0) { operator = ValueCondition.IsEqual; }
        var _this = _super.call(this, actionManager) || this;
        _this.propertyPath = propertyPath;
        _this.value = value;
        _this.operator = operator;
        _this._target = target;
        _this._effectiveTarget = _this._getEffectiveTarget(target, _this.propertyPath);
        _this._property = _this._getProperty(_this.propertyPath);
        return _this;
    }
    Object.defineProperty(ValueCondition, "IsEqual", {
        /**
         * returns the number for IsEqual
         */
        get: function () {
            return ValueCondition._IsEqual;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueCondition, "IsDifferent", {
        /**
         * Returns the number for IsDifferent
         */
        get: function () {
            return ValueCondition._IsDifferent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueCondition, "IsGreater", {
        /**
         * Returns the number for IsGreater
         */
        get: function () {
            return ValueCondition._IsGreater;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValueCondition, "IsLesser", {
        /**
         * Returns the number for IsLesser
         */
        get: function () {
            return ValueCondition._IsLesser;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Compares the given value with the property value for the specified conditional operator
     * @returns the result of the comparison
     */
    ValueCondition.prototype.isValid = function () {
        switch (this.operator) {
            case ValueCondition.IsGreater:
                return this._effectiveTarget[this._property] > this.value;
            case ValueCondition.IsLesser:
                return this._effectiveTarget[this._property] < this.value;
            case ValueCondition.IsEqual:
            case ValueCondition.IsDifferent:
                var check;
                if (this.value.equals) {
                    check = this.value.equals(this._effectiveTarget[this._property]);
                }
                else {
                    check = this.value === this._effectiveTarget[this._property];
                }
                return this.operator === ValueCondition.IsEqual ? check : !check;
        }
        return false;
    };
    /**
     * Serialize the ValueCondition into a JSON compatible object
     * @returns serialization object
     */
    ValueCondition.prototype.serialize = function () {
        return this._serialize({
            name: "ValueCondition",
            properties: [
                Action._GetTargetProperty(this._target),
                { name: "propertyPath", value: this.propertyPath },
                { name: "value", value: Action._SerializeValueAsString(this.value) },
                { name: "operator", value: ValueCondition.GetOperatorName(this.operator) }
            ]
        });
    };
    /**
     * Gets the name of the conditional operator for the ValueCondition
     * @param operator the conditional operator
     * @returns the name
     */
    ValueCondition.GetOperatorName = function (operator) {
        switch (operator) {
            case ValueCondition._IsEqual: return "IsEqual";
            case ValueCondition._IsDifferent: return "IsDifferent";
            case ValueCondition._IsGreater: return "IsGreater";
            case ValueCondition._IsLesser: return "IsLesser";
            default: return "";
        }
    };
    /**
     * Internal only
     * @hidden
     */
    ValueCondition._IsEqual = 0;
    /**
     * Internal only
     * @hidden
     */
    ValueCondition._IsDifferent = 1;
    /**
     * Internal only
     * @hidden
     */
    ValueCondition._IsGreater = 2;
    /**
     * Internal only
     * @hidden
     */
    ValueCondition._IsLesser = 3;
    return ValueCondition;
}(Condition));
/**
 * Defines a predicate condition as an extension of Condition
 */
var PredicateCondition = /** @class */ (function (_super) {
    __extends(PredicateCondition, _super);
    /**
     * Creates a new PredicateCondition
     * @param actionManager manager for the action the condition applies to
     * @param predicate defines the predicate function used to validate the condition
     */
    function PredicateCondition(actionManager, 
    /** defines the predicate function used to validate the condition */
    predicate) {
        var _this = _super.call(this, actionManager) || this;
        _this.predicate = predicate;
        return _this;
    }
    /**
     * @returns the validity of the predicate condition
     */
    PredicateCondition.prototype.isValid = function () {
        return this.predicate();
    };
    return PredicateCondition;
}(Condition));
/**
 * Defines a state condition as an extension of Condition
 */
var StateCondition = /** @class */ (function (_super) {
    __extends(StateCondition, _super);
    /**
     * Creates a new StateCondition
     * @param actionManager manager for the action the condition applies to
     * @param target of the condition
     * @param value to compare with target state
     */
    function StateCondition(actionManager, target, 
    /** Value to compare with target state  */
    value) {
        var _this = _super.call(this, actionManager) || this;
        _this.value = value;
        _this._target = target;
        return _this;
    }
    /**
     * Gets a boolean indicating if the current condition is met
     * @returns the validity of the state
     */
    StateCondition.prototype.isValid = function () {
        return this._target.state === this.value;
    };
    /**
     * Serialize the StateCondition into a JSON compatible object
     * @returns serialization object
     */
    StateCondition.prototype.serialize = function () {
        return this._serialize({
            name: "StateCondition",
            properties: [
                Action._GetTargetProperty(this._target),
                { name: "value", value: this.value }
            ]
        });
    };
    return StateCondition;
}(Condition));
_TypeStore.RegisteredTypes["BABYLON.ValueCondition"] = ValueCondition;
_TypeStore.RegisteredTypes["BABYLON.PredicateCondition"] = PredicateCondition;
_TypeStore.RegisteredTypes["BABYLON.StateCondition"] = StateCondition;

/**
 * This defines an action responsible to toggle a boolean once triggered.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var SwitchBooleanAction = /** @class */ (function (_super) {
    __extends(SwitchBooleanAction, _super);
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param target defines the object containing the boolean
     * @param propertyPath defines the path to the boolean property in the target object
     * @param condition defines the trigger related conditions
     */
    function SwitchBooleanAction(triggerOptions, target, propertyPath, condition) {
        var _this = _super.call(this, triggerOptions, condition) || this;
        _this.propertyPath = propertyPath;
        _this._target = _this._effectiveTarget = target;
        return _this;
    }
    /** @hidden */
    SwitchBooleanAction.prototype._prepare = function () {
        this._effectiveTarget = this._getEffectiveTarget(this._effectiveTarget, this.propertyPath);
        this._property = this._getProperty(this.propertyPath);
    };
    /**
     * Execute the action toggle the boolean value.
     */
    SwitchBooleanAction.prototype.execute = function () {
        this._effectiveTarget[this._property] = !this._effectiveTarget[this._property];
    };
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    SwitchBooleanAction.prototype.serialize = function (parent) {
        return _super.prototype._serialize.call(this, {
            name: "SwitchBooleanAction",
            properties: [
                Action._GetTargetProperty(this._target),
                { name: "propertyPath", value: this.propertyPath }
            ]
        }, parent);
    };
    return SwitchBooleanAction;
}(Action));
/**
 * This defines an action responsible to set a the state field of the target
 *  to a desired value once triggered.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var SetStateAction = /** @class */ (function (_super) {
    __extends(SetStateAction, _super);
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param target defines the object containing the state property
     * @param value defines the value to store in the state field
     * @param condition defines the trigger related conditions
     */
    function SetStateAction(triggerOptions, target, value, condition) {
        var _this = _super.call(this, triggerOptions, condition) || this;
        _this.value = value;
        _this._target = target;
        return _this;
    }
    /**
     * Execute the action and store the value on the target state property.
     */
    SetStateAction.prototype.execute = function () {
        this._target.state = this.value;
    };
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    SetStateAction.prototype.serialize = function (parent) {
        return _super.prototype._serialize.call(this, {
            name: "SetStateAction",
            properties: [
                Action._GetTargetProperty(this._target),
                { name: "value", value: this.value }
            ]
        }, parent);
    };
    return SetStateAction;
}(Action));
/**
 * This defines an action responsible to set a property of the target
 *  to a desired value once triggered.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var SetValueAction = /** @class */ (function (_super) {
    __extends(SetValueAction, _super);
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param target defines the object containing the property
     * @param propertyPath defines the path of the property to set in the target
     * @param value defines the value to set in the property
     * @param condition defines the trigger related conditions
     */
    function SetValueAction(triggerOptions, target, propertyPath, value, condition) {
        var _this = _super.call(this, triggerOptions, condition) || this;
        _this.propertyPath = propertyPath;
        _this.value = value;
        _this._target = _this._effectiveTarget = target;
        return _this;
    }
    /** @hidden */
    SetValueAction.prototype._prepare = function () {
        this._effectiveTarget = this._getEffectiveTarget(this._effectiveTarget, this.propertyPath);
        this._property = this._getProperty(this.propertyPath);
    };
    /**
     * Execute the action and set the targetted property to the desired value.
     */
    SetValueAction.prototype.execute = function () {
        this._effectiveTarget[this._property] = this.value;
        if (this._target.markAsDirty) {
            this._target.markAsDirty(this._property);
        }
    };
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    SetValueAction.prototype.serialize = function (parent) {
        return _super.prototype._serialize.call(this, {
            name: "SetValueAction",
            properties: [
                Action._GetTargetProperty(this._target),
                { name: "propertyPath", value: this.propertyPath },
                { name: "value", value: Action._SerializeValueAsString(this.value) }
            ]
        }, parent);
    };
    return SetValueAction;
}(Action));
/**
 * This defines an action responsible to increment the target value
 *  to a desired value once triggered.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var IncrementValueAction = /** @class */ (function (_super) {
    __extends(IncrementValueAction, _super);
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param target defines the object containing the property
     * @param propertyPath defines the path of the property to increment in the target
     * @param value defines the value value we should increment the property by
     * @param condition defines the trigger related conditions
     */
    function IncrementValueAction(triggerOptions, target, propertyPath, value, condition) {
        var _this = _super.call(this, triggerOptions, condition) || this;
        _this.propertyPath = propertyPath;
        _this.value = value;
        _this._target = _this._effectiveTarget = target;
        return _this;
    }
    /** @hidden */
    IncrementValueAction.prototype._prepare = function () {
        this._effectiveTarget = this._getEffectiveTarget(this._effectiveTarget, this.propertyPath);
        this._property = this._getProperty(this.propertyPath);
        if (typeof this._effectiveTarget[this._property] !== "number") {
            Logger.Warn("Warning: IncrementValueAction can only be used with number values");
        }
    };
    /**
     * Execute the action and increment the target of the value amount.
     */
    IncrementValueAction.prototype.execute = function () {
        this._effectiveTarget[this._property] += this.value;
        if (this._target.markAsDirty) {
            this._target.markAsDirty(this._property);
        }
    };
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    IncrementValueAction.prototype.serialize = function (parent) {
        return _super.prototype._serialize.call(this, {
            name: "IncrementValueAction",
            properties: [
                Action._GetTargetProperty(this._target),
                { name: "propertyPath", value: this.propertyPath },
                { name: "value", value: Action._SerializeValueAsString(this.value) }
            ]
        }, parent);
    };
    return IncrementValueAction;
}(Action));
/**
 * This defines an action responsible to start an animation once triggered.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var PlayAnimationAction = /** @class */ (function (_super) {
    __extends(PlayAnimationAction, _super);
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param target defines the target animation or animation name
     * @param from defines from where the animation should start (animation frame)
     * @param end defines where the animation should stop (animation frame)
     * @param loop defines if the animation should loop or stop after the first play
     * @param condition defines the trigger related conditions
     */
    function PlayAnimationAction(triggerOptions, target, from, to, loop, condition) {
        var _this = _super.call(this, triggerOptions, condition) || this;
        _this.from = from;
        _this.to = to;
        _this.loop = loop;
        _this._target = target;
        return _this;
    }
    /** @hidden */
    PlayAnimationAction.prototype._prepare = function () {
    };
    /**
     * Execute the action and play the animation.
     */
    PlayAnimationAction.prototype.execute = function () {
        var scene = this._actionManager.getScene();
        scene.beginAnimation(this._target, this.from, this.to, this.loop);
    };
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    PlayAnimationAction.prototype.serialize = function (parent) {
        return _super.prototype._serialize.call(this, {
            name: "PlayAnimationAction",
            properties: [
                Action._GetTargetProperty(this._target),
                { name: "from", value: String(this.from) },
                { name: "to", value: String(this.to) },
                { name: "loop", value: Action._SerializeValueAsString(this.loop) || false }
            ]
        }, parent);
    };
    return PlayAnimationAction;
}(Action));
/**
 * This defines an action responsible to stop an animation once triggered.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var StopAnimationAction = /** @class */ (function (_super) {
    __extends(StopAnimationAction, _super);
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param target defines the target animation or animation name
     * @param condition defines the trigger related conditions
     */
    function StopAnimationAction(triggerOptions, target, condition) {
        var _this = _super.call(this, triggerOptions, condition) || this;
        _this._target = target;
        return _this;
    }
    /** @hidden */
    StopAnimationAction.prototype._prepare = function () {
    };
    /**
     * Execute the action and stop the animation.
     */
    StopAnimationAction.prototype.execute = function () {
        var scene = this._actionManager.getScene();
        scene.stopAnimation(this._target);
    };
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    StopAnimationAction.prototype.serialize = function (parent) {
        return _super.prototype._serialize.call(this, {
            name: "StopAnimationAction",
            properties: [Action._GetTargetProperty(this._target)]
        }, parent);
    };
    return StopAnimationAction;
}(Action));
/**
 * This defines an action responsible that does nothing once triggered.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var DoNothingAction = /** @class */ (function (_super) {
    __extends(DoNothingAction, _super);
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param condition defines the trigger related conditions
     */
    function DoNothingAction(triggerOptions, condition) {
        if (triggerOptions === void 0) { triggerOptions = 0; }
        return _super.call(this, triggerOptions, condition) || this;
    }
    /**
     * Execute the action and do nothing.
     */
    DoNothingAction.prototype.execute = function () {
    };
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    DoNothingAction.prototype.serialize = function (parent) {
        return _super.prototype._serialize.call(this, {
            name: "DoNothingAction",
            properties: []
        }, parent);
    };
    return DoNothingAction;
}(Action));
/**
 * This defines an action responsible to trigger several actions once triggered.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var CombineAction = /** @class */ (function (_super) {
    __extends(CombineAction, _super);
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param children defines the list of aggregated animations to run
     * @param condition defines the trigger related conditions
     */
    function CombineAction(triggerOptions, children, condition) {
        var _this = _super.call(this, triggerOptions, condition) || this;
        _this.children = children;
        return _this;
    }
    /** @hidden */
    CombineAction.prototype._prepare = function () {
        for (var index = 0; index < this.children.length; index++) {
            this.children[index]._actionManager = this._actionManager;
            this.children[index]._prepare();
        }
    };
    /**
     * Execute the action and executes all the aggregated actions.
     */
    CombineAction.prototype.execute = function (evt) {
        for (var index = 0; index < this.children.length; index++) {
            this.children[index].execute(evt);
        }
    };
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    CombineAction.prototype.serialize = function (parent) {
        var serializationObject = _super.prototype._serialize.call(this, {
            name: "CombineAction",
            properties: [],
            combine: []
        }, parent);
        for (var i = 0; i < this.children.length; i++) {
            serializationObject.combine.push(this.children[i].serialize(null));
        }
        return serializationObject;
    };
    return CombineAction;
}(Action));
/**
 * This defines an action responsible to run code (external event) once triggered.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var ExecuteCodeAction = /** @class */ (function (_super) {
    __extends(ExecuteCodeAction, _super);
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param func defines the callback function to run
     * @param condition defines the trigger related conditions
     */
    function ExecuteCodeAction(triggerOptions, func, condition) {
        var _this = _super.call(this, triggerOptions, condition) || this;
        _this.func = func;
        return _this;
    }
    /**
     * Execute the action and run the attached code.
     */
    ExecuteCodeAction.prototype.execute = function (evt) {
        this.func(evt);
    };
    return ExecuteCodeAction;
}(Action));
/**
 * This defines an action responsible to set the parent property of the target once triggered.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var SetParentAction = /** @class */ (function (_super) {
    __extends(SetParentAction, _super);
    /**
     * Instantiate the action
     * @param triggerOptions defines the trigger options
     * @param target defines the target containing the parent property
     * @param parent defines from where the animation should start (animation frame)
     * @param condition defines the trigger related conditions
     */
    function SetParentAction(triggerOptions, target, parent, condition) {
        var _this = _super.call(this, triggerOptions, condition) || this;
        _this._target = target;
        _this._parent = parent;
        return _this;
    }
    /** @hidden */
    SetParentAction.prototype._prepare = function () {
    };
    /**
     * Execute the action and set the parent property.
     */
    SetParentAction.prototype.execute = function () {
        if (this._target.parent === this._parent) {
            return;
        }
        var invertParentWorldMatrix = this._parent.getWorldMatrix().clone();
        invertParentWorldMatrix.invert();
        this._target.position = Vector3.TransformCoordinates(this._target.position, invertParentWorldMatrix);
        this._target.parent = this._parent;
    };
    /**
     * Serializes the actions and its related information.
     * @param parent defines the object to serialize in
     * @returns the serialized object
     */
    SetParentAction.prototype.serialize = function (parent) {
        return _super.prototype._serialize.call(this, {
            name: "SetParentAction",
            properties: [
                Action._GetTargetProperty(this._target),
                Action._GetTargetProperty(this._parent),
            ]
        }, parent);
    };
    return SetParentAction;
}(Action));
_TypeStore.RegisteredTypes["BABYLON.SetParentAction"] = SetParentAction;
_TypeStore.RegisteredTypes["BABYLON.ExecuteCodeAction"] = ExecuteCodeAction;
_TypeStore.RegisteredTypes["BABYLON.DoNothingAction"] = DoNothingAction;
_TypeStore.RegisteredTypes["BABYLON.StopAnimationAction"] = StopAnimationAction;
_TypeStore.RegisteredTypes["BABYLON.PlayAnimationAction"] = PlayAnimationAction;
_TypeStore.RegisteredTypes["BABYLON.IncrementValueAction"] = IncrementValueAction;
_TypeStore.RegisteredTypes["BABYLON.SetValueAction"] = SetValueAction;
_TypeStore.RegisteredTypes["BABYLON.SetStateAction"] = SetStateAction;
_TypeStore.RegisteredTypes["BABYLON.SetParentAction"] = SetParentAction;

/**
 * Action Manager manages all events to be triggered on a given mesh or the global scene.
 * A single scene can have many Action Managers to handle predefined actions on specific meshes.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var ActionManager = /** @class */ (function (_super) {
    __extends(ActionManager, _super);
    /**
     * Creates a new action manager
     * @param scene defines the hosting scene
     */
    function ActionManager(scene) {
        var _this = _super.call(this) || this;
        _this._scene = scene || EngineStore.LastCreatedScene;
        scene.actionManagers.push(_this);
        return _this;
    }
    // Methods
    /**
     * Releases all associated resources
     */
    ActionManager.prototype.dispose = function () {
        var index = this._scene.actionManagers.indexOf(this);
        for (var i = 0; i < this.actions.length; i++) {
            var action = this.actions[i];
            ActionManager.Triggers[action.trigger]--;
            if (ActionManager.Triggers[action.trigger] === 0) {
                delete ActionManager.Triggers[action.trigger];
            }
        }
        if (index > -1) {
            this._scene.actionManagers.splice(index, 1);
        }
    };
    /**
     * Gets hosting scene
     * @returns the hosting scene
     */
    ActionManager.prototype.getScene = function () {
        return this._scene;
    };
    /**
     * Does this action manager handles actions of any of the given triggers
     * @param triggers defines the triggers to be tested
     * @return a boolean indicating whether one (or more) of the triggers is handled
     */
    ActionManager.prototype.hasSpecificTriggers = function (triggers) {
        for (var index = 0; index < this.actions.length; index++) {
            var action = this.actions[index];
            if (triggers.indexOf(action.trigger) > -1) {
                return true;
            }
        }
        return false;
    };
    /**
     * Does this action manager handles actions of any of the given triggers. This function takes two arguments for
     * speed.
     * @param triggerA defines the trigger to be tested
     * @param triggerB defines the trigger to be tested
     * @return a boolean indicating whether one (or more) of the triggers is handled
     */
    ActionManager.prototype.hasSpecificTriggers2 = function (triggerA, triggerB) {
        for (var index = 0; index < this.actions.length; index++) {
            var action = this.actions[index];
            if (triggerA == action.trigger || triggerB == action.trigger) {
                return true;
            }
        }
        return false;
    };
    /**
     * Does this action manager handles actions of a given trigger
     * @param trigger defines the trigger to be tested
     * @param parameterPredicate defines an optional predicate to filter triggers by parameter
     * @return whether the trigger is handled
     */
    ActionManager.prototype.hasSpecificTrigger = function (trigger, parameterPredicate) {
        for (var index = 0; index < this.actions.length; index++) {
            var action = this.actions[index];
            if (action.trigger === trigger) {
                if (parameterPredicate) {
                    if (parameterPredicate(action.getTriggerParameter())) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
        }
        return false;
    };
    Object.defineProperty(ActionManager.prototype, "hasPointerTriggers", {
        /**
         * Does this action manager has pointer triggers
         */
        get: function () {
            for (var index = 0; index < this.actions.length; index++) {
                var action = this.actions[index];
                if (action.trigger >= ActionManager.OnPickTrigger && action.trigger <= ActionManager.OnPointerOutTrigger) {
                    return true;
                }
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ActionManager.prototype, "hasPickTriggers", {
        /**
         * Does this action manager has pick triggers
         */
        get: function () {
            for (var index = 0; index < this.actions.length; index++) {
                var action = this.actions[index];
                if (action.trigger >= ActionManager.OnPickTrigger && action.trigger <= ActionManager.OnPickUpTrigger) {
                    return true;
                }
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Registers an action to this action manager
     * @param action defines the action to be registered
     * @return the action amended (prepared) after registration
     */
    ActionManager.prototype.registerAction = function (action) {
        if (action.trigger === ActionManager.OnEveryFrameTrigger) {
            if (this.getScene().actionManager !== this) {
                Logger.Warn("OnEveryFrameTrigger can only be used with scene.actionManager");
                return null;
            }
        }
        this.actions.push(action);
        if (ActionManager.Triggers[action.trigger]) {
            ActionManager.Triggers[action.trigger]++;
        }
        else {
            ActionManager.Triggers[action.trigger] = 1;
        }
        action._actionManager = this;
        action._prepare();
        return action;
    };
    /**
     * Unregisters an action to this action manager
     * @param action defines the action to be unregistered
     * @return a boolean indicating whether the action has been unregistered
     */
    ActionManager.prototype.unregisterAction = function (action) {
        var index = this.actions.indexOf(action);
        if (index !== -1) {
            this.actions.splice(index, 1);
            ActionManager.Triggers[action.trigger] -= 1;
            if (ActionManager.Triggers[action.trigger] === 0) {
                delete ActionManager.Triggers[action.trigger];
            }
            action._actionManager = null;
            return true;
        }
        return false;
    };
    /**
     * Process a specific trigger
     * @param trigger defines the trigger to process
     * @param evt defines the event details to be processed
     */
    ActionManager.prototype.processTrigger = function (trigger, evt) {
        for (var index = 0; index < this.actions.length; index++) {
            var action = this.actions[index];
            if (action.trigger === trigger) {
                if (evt) {
                    if (trigger === ActionManager.OnKeyUpTrigger
                        || trigger === ActionManager.OnKeyDownTrigger) {
                        var parameter = action.getTriggerParameter();
                        if (parameter && parameter !== evt.sourceEvent.keyCode) {
                            if (!parameter.toLowerCase) {
                                continue;
                            }
                            var lowerCase = parameter.toLowerCase();
                            if (lowerCase !== evt.sourceEvent.key) {
                                var unicode = evt.sourceEvent.charCode ? evt.sourceEvent.charCode : evt.sourceEvent.keyCode;
                                var actualkey = String.fromCharCode(unicode).toLowerCase();
                                if (actualkey !== lowerCase) {
                                    continue;
                                }
                            }
                        }
                    }
                }
                action._executeCurrent(evt);
            }
        }
    };
    /** @hidden */
    ActionManager.prototype._getEffectiveTarget = function (target, propertyPath) {
        var properties = propertyPath.split(".");
        for (var index = 0; index < properties.length - 1; index++) {
            target = target[properties[index]];
        }
        return target;
    };
    /** @hidden */
    ActionManager.prototype._getProperty = function (propertyPath) {
        var properties = propertyPath.split(".");
        return properties[properties.length - 1];
    };
    /**
     * Serialize this manager to a JSON object
     * @param name defines the property name to store this manager
     * @returns a JSON representation of this manager
     */
    ActionManager.prototype.serialize = function (name) {
        var root = {
            children: new Array(),
            name: name,
            type: 3,
            properties: new Array() // Empty for root but required
        };
        for (var i = 0; i < this.actions.length; i++) {
            var triggerObject = {
                type: 0,
                children: new Array(),
                name: ActionManager.GetTriggerName(this.actions[i].trigger),
                properties: new Array()
            };
            var triggerOptions = this.actions[i].triggerOptions;
            if (triggerOptions && typeof triggerOptions !== "number") {
                if (triggerOptions.parameter instanceof Node) {
                    triggerObject.properties.push(Action._GetTargetProperty(triggerOptions.parameter));
                }
                else {
                    var parameter = {};
                    DeepCopier.DeepCopy(triggerOptions.parameter, parameter, ["mesh"]);
                    if (triggerOptions.parameter && triggerOptions.parameter.mesh) {
                        parameter._meshId = triggerOptions.parameter.mesh.id;
                    }
                    triggerObject.properties.push({ name: "parameter", targetType: null, value: parameter });
                }
            }
            // Serialize child action, recursively
            this.actions[i].serialize(triggerObject);
            // Add serialized trigger
            root.children.push(triggerObject);
        }
        return root;
    };
    /**
     * Creates a new ActionManager from a JSON data
     * @param parsedActions defines the JSON data to read from
     * @param object defines the hosting mesh
     * @param scene defines the hosting scene
     */
    ActionManager.Parse = function (parsedActions, object, scene) {
        var actionManager = new ActionManager(scene);
        if (object === null) {
            scene.actionManager = actionManager;
        }
        else {
            object.actionManager = actionManager;
        }
        // instanciate a new object
        var instanciate = function (name, params) {
            var internalClassType = _TypeStore.GetClass("BABYLON." + name);
            if (internalClassType) {
                var newInstance = Object.create(internalClassType.prototype);
                newInstance.constructor.apply(newInstance, params);
                return newInstance;
            }
        };
        var parseParameter = function (name, value, target, propertyPath) {
            if (propertyPath === null) {
                // String, boolean or float
                var floatValue = parseFloat(value);
                if (value === "true" || value === "false") {
                    return value === "true";
                }
                else {
                    return isNaN(floatValue) ? value : floatValue;
                }
            }
            var effectiveTarget = propertyPath.split(".");
            var values = value.split(",");
            // Get effective Target
            for (var i = 0; i < effectiveTarget.length; i++) {
                target = target[effectiveTarget[i]];
            }
            // Return appropriate value with its type
            if (typeof (target) === "boolean") {
                return values[0] === "true";
            }
            if (typeof (target) === "string") {
                return values[0];
            }
            // Parameters with multiple values such as Vector3 etc.
            var split = new Array();
            for (var i = 0; i < values.length; i++) {
                split.push(parseFloat(values[i]));
            }
            if (target instanceof Vector3) {
                return Vector3.FromArray(split);
            }
            if (target instanceof Vector4) {
                return Vector4.FromArray(split);
            }
            if (target instanceof Color3) {
                return Color3.FromArray(split);
            }
            if (target instanceof Color4) {
                return Color4.FromArray(split);
            }
            return parseFloat(values[0]);
        };
        // traverse graph per trigger
        var traverse = function (parsedAction, trigger, condition, action, combineArray) {
            if (combineArray === void 0) { combineArray = null; }
            if (parsedAction.detached) {
                return;
            }
            var parameters = new Array();
            var target = null;
            var propertyPath = null;
            var combine = parsedAction.combine && parsedAction.combine.length > 0;
            // Parameters
            if (parsedAction.type === 2) {
                parameters.push(actionManager);
            }
            else {
                parameters.push(trigger);
            }
            if (combine) {
                var actions = new Array();
                for (var j = 0; j < parsedAction.combine.length; j++) {
                    traverse(parsedAction.combine[j], ActionManager.NothingTrigger, condition, action, actions);
                }
                parameters.push(actions);
            }
            else {
                for (var i = 0; i < parsedAction.properties.length; i++) {
                    var value = parsedAction.properties[i].value;
                    var name = parsedAction.properties[i].name;
                    var targetType = parsedAction.properties[i].targetType;
                    if (name === "target") {
                        if (targetType !== null && targetType === "SceneProperties") {
                            value = target = scene;
                        }
                        else {
                            value = target = scene.getNodeByName(value);
                        }
                    }
                    else if (name === "parent") {
                        value = scene.getNodeByName(value);
                    }
                    else if (name === "sound") {
                        // Can not externalize to component, so only checks for the presence off the API.
                        if (scene.getSoundByName) {
                            value = scene.getSoundByName(value);
                        }
                    }
                    else if (name !== "propertyPath") {
                        if (parsedAction.type === 2 && name === "operator") {
                            value = ValueCondition[value];
                        }
                        else {
                            value = parseParameter(name, value, target, name === "value" ? propertyPath : null);
                        }
                    }
                    else {
                        propertyPath = value;
                    }
                    parameters.push(value);
                }
            }
            if (combineArray === null) {
                parameters.push(condition);
            }
            else {
                parameters.push(null);
            }
            // If interpolate value action
            if (parsedAction.name === "InterpolateValueAction") {
                var param = parameters[parameters.length - 2];
                parameters[parameters.length - 1] = param;
                parameters[parameters.length - 2] = condition;
            }
            // Action or condition(s) and not CombineAction
            var newAction = instanciate(parsedAction.name, parameters);
            if (newAction instanceof Condition && condition !== null) {
                var nothing = new DoNothingAction(trigger, condition);
                if (action) {
                    action.then(nothing);
                }
                else {
                    actionManager.registerAction(nothing);
                }
                action = nothing;
            }
            if (combineArray === null) {
                if (newAction instanceof Condition) {
                    condition = newAction;
                    newAction = action;
                }
                else {
                    condition = null;
                    if (action) {
                        action.then(newAction);
                    }
                    else {
                        actionManager.registerAction(newAction);
                    }
                }
            }
            else {
                combineArray.push(newAction);
            }
            for (var i = 0; i < parsedAction.children.length; i++) {
                traverse(parsedAction.children[i], trigger, condition, newAction, null);
            }
        };
        // triggers
        for (var i = 0; i < parsedActions.children.length; i++) {
            var triggerParams;
            var trigger = parsedActions.children[i];
            if (trigger.properties.length > 0) {
                var param = trigger.properties[0].value;
                var value = trigger.properties[0].targetType === null ? param : scene.getMeshByName(param);
                if (value._meshId) {
                    value.mesh = scene.getMeshByID(value._meshId);
                }
                triggerParams = { trigger: ActionManager[trigger.name], parameter: value };
            }
            else {
                triggerParams = ActionManager[trigger.name];
            }
            for (var j = 0; j < trigger.children.length; j++) {
                if (!trigger.detached) {
                    traverse(trigger.children[j], triggerParams, null, null);
                }
            }
        }
    };
    /**
     * Get a trigger name by index
     * @param trigger defines the trigger index
     * @returns a trigger name
     */
    ActionManager.GetTriggerName = function (trigger) {
        switch (trigger) {
            case 0: return "NothingTrigger";
            case 1: return "OnPickTrigger";
            case 2: return "OnLeftPickTrigger";
            case 3: return "OnRightPickTrigger";
            case 4: return "OnCenterPickTrigger";
            case 5: return "OnPickDownTrigger";
            case 6: return "OnPickUpTrigger";
            case 7: return "OnLongPressTrigger";
            case 8: return "OnPointerOverTrigger";
            case 9: return "OnPointerOutTrigger";
            case 10: return "OnEveryFrameTrigger";
            case 11: return "OnIntersectionEnterTrigger";
            case 12: return "OnIntersectionExitTrigger";
            case 13: return "OnKeyDownTrigger";
            case 14: return "OnKeyUpTrigger";
            case 15: return "OnPickOutTrigger";
            default: return "";
        }
    };
    /**
     * Nothing
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.NothingTrigger = 0;
    /**
     * On pick
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnPickTrigger = 1;
    /**
     * On left pick
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnLeftPickTrigger = 2;
    /**
     * On right pick
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnRightPickTrigger = 3;
    /**
     * On center pick
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnCenterPickTrigger = 4;
    /**
     * On pick down
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnPickDownTrigger = 5;
    /**
     * On double pick
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnDoublePickTrigger = 6;
    /**
     * On pick up
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnPickUpTrigger = 7;
    /**
     * On pick out.
     * This trigger will only be raised if you also declared a OnPickDown
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnPickOutTrigger = 16;
    /**
     * On long press
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnLongPressTrigger = 8;
    /**
     * On pointer over
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnPointerOverTrigger = 9;
    /**
     * On pointer out
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnPointerOutTrigger = 10;
    /**
     * On every frame
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnEveryFrameTrigger = 11;
    /**
     * On intersection enter
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnIntersectionEnterTrigger = 12;
    /**
     * On intersection exit
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnIntersectionExitTrigger = 13;
    /**
     * On key down
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnKeyDownTrigger = 14;
    /**
     * On key up
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    ActionManager.OnKeyUpTrigger = 15;
    return ActionManager;
}(AbstractActionManager));

/** @hidden */
var CannonJSPlugin = /** @class */ (function () {
    function CannonJSPlugin(_useDeltaForWorldStep, iterations, cannonInjection) {
        if (_useDeltaForWorldStep === void 0) { _useDeltaForWorldStep = true; }
        if (iterations === void 0) { iterations = 10; }
        if (cannonInjection === void 0) { cannonInjection = CANNON; }
        this._useDeltaForWorldStep = _useDeltaForWorldStep;
        this.name = "CannonJSPlugin";
        this._physicsMaterials = new Array();
        this._fixedTimeStep = 1 / 60;
        this._physicsBodysToRemoveAfterStep = new Array();
        this._firstFrame = true;
        this._minus90X = new Quaternion(-0.7071067811865475, 0, 0, 0.7071067811865475);
        this._plus90X = new Quaternion(0.7071067811865475, 0, 0, 0.7071067811865475);
        this._tmpPosition = Vector3.Zero();
        this._tmpDeltaPosition = Vector3.Zero();
        this._tmpUnityRotation = new Quaternion();
        this.BJSCANNON = cannonInjection;
        if (!this.isSupported()) {
            Logger.Error("CannonJS is not available. Please make sure you included the js file.");
            return;
        }
        this._extendNamespace();
        this.world = new this.BJSCANNON.World();
        this.world.broadphase = new this.BJSCANNON.NaiveBroadphase();
        this.world.solver.iterations = iterations;
        this._cannonRaycastResult = new this.BJSCANNON.RaycastResult();
        this._raycastResult = new PhysicsRaycastResult();
    }
    CannonJSPlugin.prototype.setGravity = function (gravity) {
        var vec = gravity;
        this.world.gravity.set(vec.x, vec.y, vec.z);
    };
    CannonJSPlugin.prototype.setTimeStep = function (timeStep) {
        this._fixedTimeStep = timeStep;
    };
    CannonJSPlugin.prototype.getTimeStep = function () {
        return this._fixedTimeStep;
    };
    CannonJSPlugin.prototype.executeStep = function (delta, impostors) {
        // due to cannon's architecture, the first frame's before-step is skipped.
        if (this._firstFrame) {
            this._firstFrame = false;
            for (var _i = 0, impostors_1 = impostors; _i < impostors_1.length; _i++) {
                var impostor = impostors_1[_i];
                if (!(impostor.type == PhysicsImpostor.HeightmapImpostor || impostor.type === PhysicsImpostor.PlaneImpostor)) {
                    impostor.beforeStep();
                }
            }
        }
        this.world.step(this._useDeltaForWorldStep ? delta : this._fixedTimeStep);
        this._removeMarkedPhysicsBodiesFromWorld();
    };
    CannonJSPlugin.prototype._removeMarkedPhysicsBodiesFromWorld = function () {
        var _this = this;
        if (this._physicsBodysToRemoveAfterStep.length > 0) {
            this._physicsBodysToRemoveAfterStep.forEach(function (physicsBody) {
                _this.world.remove(physicsBody);
            });
            this._physicsBodysToRemoveAfterStep = [];
        }
    };
    CannonJSPlugin.prototype.applyImpulse = function (impostor, force, contactPoint) {
        var worldPoint = new this.BJSCANNON.Vec3(contactPoint.x, contactPoint.y, contactPoint.z);
        var impulse = new this.BJSCANNON.Vec3(force.x, force.y, force.z);
        impostor.physicsBody.applyImpulse(impulse, worldPoint);
    };
    CannonJSPlugin.prototype.applyForce = function (impostor, force, contactPoint) {
        var worldPoint = new this.BJSCANNON.Vec3(contactPoint.x, contactPoint.y, contactPoint.z);
        var impulse = new this.BJSCANNON.Vec3(force.x, force.y, force.z);
        impostor.physicsBody.applyForce(impulse, worldPoint);
    };
    CannonJSPlugin.prototype.generatePhysicsBody = function (impostor) {
        // When calling forceUpdate generatePhysicsBody is called again, ensure that the updated body does not instantly collide with removed body
        this._removeMarkedPhysicsBodiesFromWorld();
        //parent-child relationship. Does this impostor has a parent impostor?
        if (impostor.parent) {
            if (impostor.physicsBody) {
                this.removePhysicsBody(impostor);
                //TODO is that needed?
                impostor.forceUpdate();
            }
            return;
        }
        //should a new body be created for this impostor?
        if (impostor.isBodyInitRequired()) {
            var shape = this._createShape(impostor);
            //unregister events, if body is being changed
            var oldBody = impostor.physicsBody;
            if (oldBody) {
                this.removePhysicsBody(impostor);
            }
            //create the body and material
            var material = this._addMaterial("mat-" + impostor.uniqueId, impostor.getParam("friction"), impostor.getParam("restitution"));
            var bodyCreationObject = {
                mass: impostor.getParam("mass"),
                material: material,
            };
            // A simple extend, in case native options were used.
            var nativeOptions = impostor.getParam("nativeOptions");
            for (var key in nativeOptions) {
                if (nativeOptions.hasOwnProperty(key)) {
                    bodyCreationObject[key] = nativeOptions[key];
                }
            }
            impostor.physicsBody = new this.BJSCANNON.Body(bodyCreationObject);
            impostor.physicsBody.addEventListener("collide", impostor.onCollide);
            this.world.addEventListener("preStep", impostor.beforeStep);
            this.world.addEventListener("postStep", impostor.afterStep);
            impostor.physicsBody.addShape(shape);
            this.world.add(impostor.physicsBody);
            //try to keep the body moving in the right direction by taking old properties.
            //Should be tested!
            if (oldBody) {
                ["force", "torque", "velocity", "angularVelocity"].forEach(function (param) {
                    var vec = oldBody[param];
                    impostor.physicsBody[param].set(vec.x, vec.y, vec.z);
                });
            }
            this._processChildMeshes(impostor);
        }
        //now update the body's transformation
        this._updatePhysicsBodyTransformation(impostor);
    };
    CannonJSPlugin.prototype._processChildMeshes = function (mainImpostor) {
        var _this = this;
        var meshChildren = mainImpostor.object.getChildMeshes ? mainImpostor.object.getChildMeshes(true) : [];
        var currentRotation = mainImpostor.object.rotationQuaternion;
        if (meshChildren.length) {
            var processMesh_1 = function (mesh) {
                if (!currentRotation || !mesh.rotationQuaternion) {
                    return;
                }
                var childImpostor = mesh.getPhysicsImpostor();
                if (childImpostor) {
                    var parent = childImpostor.parent;
                    if (parent !== mainImpostor) {
                        var pPosition = mesh.getAbsolutePosition().subtract(mesh.parent.getAbsolutePosition());
                        var q = mesh.rotationQuaternion;
                        if (childImpostor.physicsBody) {
                            _this.removePhysicsBody(childImpostor);
                            childImpostor.physicsBody = null;
                        }
                        childImpostor.parent = mainImpostor;
                        childImpostor.resetUpdateFlags();
                        mainImpostor.physicsBody.addShape(_this._createShape(childImpostor), new _this.BJSCANNON.Vec3(pPosition.x, pPosition.y, pPosition.z), new _this.BJSCANNON.Quaternion(q.x, q.y, q.z, q.w));
                        //Add the mass of the children.
                        mainImpostor.physicsBody.mass += childImpostor.getParam("mass");
                    }
                }
                currentRotation.multiplyInPlace(mesh.rotationQuaternion);
                mesh.getChildMeshes(true)
                    .filter(function (m) { return !!m.physicsImpostor; })
                    .forEach(processMesh_1);
            };
            meshChildren.filter(function (m) { return !!m.physicsImpostor; }).forEach(processMesh_1);
        }
    };
    CannonJSPlugin.prototype.removePhysicsBody = function (impostor) {
        impostor.physicsBody.removeEventListener("collide", impostor.onCollide);
        this.world.removeEventListener("preStep", impostor.beforeStep);
        this.world.removeEventListener("postStep", impostor.afterStep);
        // Only remove the physics body after the physics step to avoid disrupting cannon's internal state
        if (this._physicsBodysToRemoveAfterStep.indexOf(impostor.physicsBody) === -1) {
            this._physicsBodysToRemoveAfterStep.push(impostor.physicsBody);
        }
    };
    CannonJSPlugin.prototype.generateJoint = function (impostorJoint) {
        var mainBody = impostorJoint.mainImpostor.physicsBody;
        var connectedBody = impostorJoint.connectedImpostor.physicsBody;
        if (!mainBody || !connectedBody) {
            return;
        }
        var constraint;
        var jointData = impostorJoint.joint.jointData;
        //TODO - https://github.com/schteppe/this.BJSCANNON.js/blob/gh-pages/demos/collisionFilter.html
        var constraintData = {
            pivotA: jointData.mainPivot ? new this.BJSCANNON.Vec3().set(jointData.mainPivot.x, jointData.mainPivot.y, jointData.mainPivot.z) : null,
            pivotB: jointData.connectedPivot ? new this.BJSCANNON.Vec3().set(jointData.connectedPivot.x, jointData.connectedPivot.y, jointData.connectedPivot.z) : null,
            axisA: jointData.mainAxis ? new this.BJSCANNON.Vec3().set(jointData.mainAxis.x, jointData.mainAxis.y, jointData.mainAxis.z) : null,
            axisB: jointData.connectedAxis ? new this.BJSCANNON.Vec3().set(jointData.connectedAxis.x, jointData.connectedAxis.y, jointData.connectedAxis.z) : null,
            maxForce: jointData.nativeParams.maxForce,
            collideConnected: !!jointData.collision,
        };
        switch (impostorJoint.joint.type) {
            case PhysicsJoint.HingeJoint:
            case PhysicsJoint.Hinge2Joint:
                constraint = new this.BJSCANNON.HingeConstraint(mainBody, connectedBody, constraintData);
                break;
            case PhysicsJoint.DistanceJoint:
                constraint = new this.BJSCANNON.DistanceConstraint(mainBody, connectedBody, jointData.maxDistance || 2);
                break;
            case PhysicsJoint.SpringJoint:
                var springData = jointData;
                constraint = new this.BJSCANNON.Spring(mainBody, connectedBody, {
                    restLength: springData.length,
                    stiffness: springData.stiffness,
                    damping: springData.damping,
                    localAnchorA: constraintData.pivotA,
                    localAnchorB: constraintData.pivotB,
                });
                break;
            case PhysicsJoint.LockJoint:
                constraint = new this.BJSCANNON.LockConstraint(mainBody, connectedBody, constraintData);
                break;
            case PhysicsJoint.PointToPointJoint:
            case PhysicsJoint.BallAndSocketJoint:
            default:
                constraint = new this.BJSCANNON.PointToPointConstraint(mainBody, constraintData.pivotA, connectedBody, constraintData.pivotB, constraintData.maxForce);
                break;
        }
        //set the collideConnected flag after the creation, since DistanceJoint ignores it.
        constraint.collideConnected = !!jointData.collision;
        impostorJoint.joint.physicsJoint = constraint;
        //don't add spring as constraint, as it is not one.
        if (impostorJoint.joint.type !== PhysicsJoint.SpringJoint) {
            this.world.addConstraint(constraint);
        }
        else {
            impostorJoint.joint.jointData.forceApplicationCallback =
                impostorJoint.joint.jointData.forceApplicationCallback ||
                    function () {
                        constraint.applyForce();
                    };
            impostorJoint.mainImpostor.registerAfterPhysicsStep(impostorJoint.joint.jointData.forceApplicationCallback);
        }
    };
    CannonJSPlugin.prototype.removeJoint = function (impostorJoint) {
        if (impostorJoint.joint.type !== PhysicsJoint.SpringJoint) {
            this.world.removeConstraint(impostorJoint.joint.physicsJoint);
        }
        else {
            impostorJoint.mainImpostor.unregisterAfterPhysicsStep(impostorJoint.joint.jointData.forceApplicationCallback);
        }
    };
    CannonJSPlugin.prototype._addMaterial = function (name, friction, restitution) {
        var index;
        var mat;
        for (index = 0; index < this._physicsMaterials.length; index++) {
            mat = this._physicsMaterials[index];
            if (mat.friction === friction && mat.restitution === restitution) {
                return mat;
            }
        }
        var currentMat = new this.BJSCANNON.Material(name);
        currentMat.friction = friction;
        currentMat.restitution = restitution;
        this._physicsMaterials.push(currentMat);
        return currentMat;
    };
    CannonJSPlugin.prototype._checkWithEpsilon = function (value) {
        return value < PhysicsEngine.Epsilon ? PhysicsEngine.Epsilon : value;
    };
    CannonJSPlugin.prototype._createShape = function (impostor) {
        var object = impostor.object;
        var returnValue;
        var extendSize = impostor.getObjectExtendSize();
        switch (impostor.type) {
            case PhysicsImpostor.SphereImpostor:
                var radiusX = extendSize.x;
                var radiusY = extendSize.y;
                var radiusZ = extendSize.z;
                returnValue = new this.BJSCANNON.Sphere(Math.max(this._checkWithEpsilon(radiusX), this._checkWithEpsilon(radiusY), this._checkWithEpsilon(radiusZ)) / 2);
                break;
            //TMP also for cylinder - TODO Cannon supports cylinder natively.
            case PhysicsImpostor.CylinderImpostor:
                var nativeParams = impostor.getParam("nativeOptions");
                if (!nativeParams) {
                    nativeParams = {};
                }
                var radiusTop = nativeParams.radiusTop !== undefined ? nativeParams.radiusTop : this._checkWithEpsilon(extendSize.x) / 2;
                var radiusBottom = nativeParams.radiusBottom !== undefined ? nativeParams.radiusBottom : this._checkWithEpsilon(extendSize.x) / 2;
                var height = nativeParams.height !== undefined ? nativeParams.height : this._checkWithEpsilon(extendSize.y);
                var numSegments = nativeParams.numSegments !== undefined ? nativeParams.numSegments : 16;
                returnValue = new this.BJSCANNON.Cylinder(radiusTop, radiusBottom, height, numSegments);
                // Rotate 90 degrees as this shape is horizontal in cannon
                var quat = new this.BJSCANNON.Quaternion();
                quat.setFromAxisAngle(new this.BJSCANNON.Vec3(1, 0, 0), -Math.PI / 2);
                var translation = new this.BJSCANNON.Vec3(0, 0, 0);
                returnValue.transformAllPoints(translation, quat);
                break;
            case PhysicsImpostor.BoxImpostor:
                var box = extendSize.scale(0.5);
                returnValue = new this.BJSCANNON.Box(new this.BJSCANNON.Vec3(this._checkWithEpsilon(box.x), this._checkWithEpsilon(box.y), this._checkWithEpsilon(box.z)));
                break;
            case PhysicsImpostor.PlaneImpostor:
                Logger.Warn("Attention, PlaneImposter might not behave as you expect. Consider using BoxImposter instead");
                returnValue = new this.BJSCANNON.Plane();
                break;
            case PhysicsImpostor.MeshImpostor:
                // should transform the vertex data to world coordinates!!
                var rawVerts = object.getVerticesData ? object.getVerticesData(VertexBuffer.PositionKind) : [];
                var rawFaces = object.getIndices ? object.getIndices() : [];
                if (!rawVerts) {
                    return;
                }
                // get only scale! so the object could transform correctly.
                var oldPosition = object.position.clone();
                var oldRotation = object.rotation && object.rotation.clone();
                var oldQuaternion = object.rotationQuaternion && object.rotationQuaternion.clone();
                object.position.copyFromFloats(0, 0, 0);
                object.rotation && object.rotation.copyFromFloats(0, 0, 0);
                object.rotationQuaternion && object.rotationQuaternion.copyFrom(impostor.getParentsRotation());
                object.rotationQuaternion && object.parent && object.rotationQuaternion.conjugateInPlace();
                var transform = object.computeWorldMatrix(true);
                // convert rawVerts to object space
                var temp = new Array();
                var index;
                for (index = 0; index < rawVerts.length; index += 3) {
                    Vector3.TransformCoordinates(Vector3.FromArray(rawVerts, index), transform).toArray(temp, index);
                }
                Logger.Warn("MeshImpostor only collides against spheres.");
                returnValue = new this.BJSCANNON.Trimesh(temp, rawFaces);
                //now set back the transformation!
                object.position.copyFrom(oldPosition);
                oldRotation && object.rotation && object.rotation.copyFrom(oldRotation);
                oldQuaternion && object.rotationQuaternion && object.rotationQuaternion.copyFrom(oldQuaternion);
                break;
            case PhysicsImpostor.HeightmapImpostor:
                var oldPosition2 = object.position.clone();
                var oldRotation2 = object.rotation && object.rotation.clone();
                var oldQuaternion2 = object.rotationQuaternion && object.rotationQuaternion.clone();
                object.position.copyFromFloats(0, 0, 0);
                object.rotation && object.rotation.copyFromFloats(0, 0, 0);
                object.rotationQuaternion && object.rotationQuaternion.copyFrom(impostor.getParentsRotation());
                object.rotationQuaternion && object.parent && object.rotationQuaternion.conjugateInPlace();
                object.rotationQuaternion && object.rotationQuaternion.multiplyInPlace(this._minus90X);
                returnValue = this._createHeightmap(object);
                object.position.copyFrom(oldPosition2);
                oldRotation2 && object.rotation && object.rotation.copyFrom(oldRotation2);
                oldQuaternion2 && object.rotationQuaternion && object.rotationQuaternion.copyFrom(oldQuaternion2);
                object.computeWorldMatrix(true);
                break;
            case PhysicsImpostor.ParticleImpostor:
                returnValue = new this.BJSCANNON.Particle();
                break;
            case PhysicsImpostor.NoImpostor:
                returnValue = new this.BJSCANNON.Box(new this.BJSCANNON.Vec3(0, 0, 0));
                break;
        }
        return returnValue;
    };
    CannonJSPlugin.prototype._createHeightmap = function (object, pointDepth) {
        var pos = object.getVerticesData(VertexBuffer.PositionKind);
        var transform = object.computeWorldMatrix(true);
        // convert rawVerts to object space
        var temp = new Array();
        var index;
        for (index = 0; index < pos.length; index += 3) {
            Vector3.TransformCoordinates(Vector3.FromArray(pos, index), transform).toArray(temp, index);
        }
        pos = temp;
        var matrix = new Array();
        //For now pointDepth will not be used and will be automatically calculated.
        //Future reference - try and find the best place to add a reference to the pointDepth variable.
        var arraySize = pointDepth || ~~(Math.sqrt(pos.length / 3) - 1);
        var boundingInfo = object.getBoundingInfo();
        var dim = Math.min(boundingInfo.boundingBox.extendSizeWorld.x, boundingInfo.boundingBox.extendSizeWorld.y);
        var minY = boundingInfo.boundingBox.extendSizeWorld.z;
        var elementSize = (dim * 2) / arraySize;
        for (var i = 0; i < pos.length; i = i + 3) {
            var x = Math.round(pos[i + 0] / elementSize + arraySize / 2);
            var z = Math.round((pos[i + 1] / elementSize - arraySize / 2) * -1);
            var y = -pos[i + 2] + minY;
            if (!matrix[x]) {
                matrix[x] = [];
            }
            if (!matrix[x][z]) {
                matrix[x][z] = y;
            }
            matrix[x][z] = Math.max(y, matrix[x][z]);
        }
        for (var x = 0; x <= arraySize; ++x) {
            if (!matrix[x]) {
                var loc = 1;
                while (!matrix[(x + loc) % arraySize]) {
                    loc++;
                }
                matrix[x] = matrix[(x + loc) % arraySize].slice();
                //console.log("missing x", x);
            }
            for (var z = 0; z <= arraySize; ++z) {
                if (!matrix[x][z]) {
                    var loc = 1;
                    var newValue;
                    while (newValue === undefined) {
                        newValue = matrix[x][(z + loc++) % arraySize];
                    }
                    matrix[x][z] = newValue;
                }
            }
        }
        var shape = new this.BJSCANNON.Heightfield(matrix, {
            elementSize: elementSize,
        });
        //For future reference, needed for body transformation
        shape.minY = minY;
        return shape;
    };
    CannonJSPlugin.prototype._updatePhysicsBodyTransformation = function (impostor) {
        var object = impostor.object;
        //make sure it is updated...
        object.computeWorldMatrix && object.computeWorldMatrix(true);
        // The delta between the mesh position and the mesh bounding box center
        if (!object.getBoundingInfo()) {
            return;
        }
        var center = impostor.getObjectCenter();
        //m.getAbsolutePosition().subtract(m.getBoundingInfo().boundingBox.centerWorld)
        this._tmpDeltaPosition.copyFrom(object.getAbsolutePivotPoint().subtract(center));
        this._tmpDeltaPosition.divideInPlace(impostor.object.scaling);
        this._tmpPosition.copyFrom(center);
        var quaternion = object.rotationQuaternion;
        if (!quaternion) {
            return;
        }
        //is shape is a plane or a heightmap, it must be rotated 90 degs in the X axis.
        //ideally these would be rotated at time of creation like cylinder but they dont extend ConvexPolyhedron
        if (impostor.type === PhysicsImpostor.PlaneImpostor || impostor.type === PhysicsImpostor.HeightmapImpostor) {
            //-90 DEG in X, precalculated
            quaternion = quaternion.multiply(this._minus90X);
            //Invert! (Precalculated, 90 deg in X)
            //No need to clone. this will never change.
            impostor.setDeltaRotation(this._plus90X);
        }
        //If it is a heightfield, if should be centered.
        if (impostor.type === PhysicsImpostor.HeightmapImpostor) {
            var mesh = object;
            var boundingInfo = mesh.getBoundingInfo();
            //calculate the correct body position:
            var rotationQuaternion = mesh.rotationQuaternion;
            mesh.rotationQuaternion = this._tmpUnityRotation;
            mesh.computeWorldMatrix(true);
            //get original center with no rotation
            var c = center.clone();
            var oldPivot = mesh.getPivotMatrix();
            if (oldPivot) {
                // create a copy the pivot Matrix as it is modified in place
                oldPivot = oldPivot.clone();
            }
            else {
                oldPivot = Matrix.Identity();
            }
            //calculate the new center using a pivot (since this.BJSCANNON.js doesn't center height maps)
            var p = Matrix.Translation(boundingInfo.boundingBox.extendSizeWorld.x, 0, -boundingInfo.boundingBox.extendSizeWorld.z);
            mesh.setPreTransformMatrix(p);
            mesh.computeWorldMatrix(true);
            //calculate the translation
            var translation = boundingInfo.boundingBox.centerWorld.subtract(center).subtract(mesh.position).negate();
            this._tmpPosition.copyFromFloats(translation.x, translation.y - boundingInfo.boundingBox.extendSizeWorld.y, translation.z);
            //add it inverted to the delta
            this._tmpDeltaPosition.copyFrom(boundingInfo.boundingBox.centerWorld.subtract(c));
            this._tmpDeltaPosition.y += boundingInfo.boundingBox.extendSizeWorld.y;
            //rotation is back
            mesh.rotationQuaternion = rotationQuaternion;
            mesh.setPreTransformMatrix(oldPivot);
            mesh.computeWorldMatrix(true);
        }
        else if (impostor.type === PhysicsImpostor.MeshImpostor) {
            this._tmpDeltaPosition.copyFromFloats(0, 0, 0);
        }
        impostor.setDeltaPosition(this._tmpDeltaPosition);
        //Now update the impostor object
        impostor.physicsBody.position.set(this._tmpPosition.x, this._tmpPosition.y, this._tmpPosition.z);
        impostor.physicsBody.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    };
    CannonJSPlugin.prototype.setTransformationFromPhysicsBody = function (impostor) {
        impostor.object.position.set(impostor.physicsBody.position.x, impostor.physicsBody.position.y, impostor.physicsBody.position.z);
        if (impostor.object.rotationQuaternion) {
            var q = impostor.physicsBody.quaternion;
            impostor.object.rotationQuaternion.set(q.x, q.y, q.z, q.w);
        }
    };
    CannonJSPlugin.prototype.setPhysicsBodyTransformation = function (impostor, newPosition, newRotation) {
        impostor.physicsBody.position.set(newPosition.x, newPosition.y, newPosition.z);
        impostor.physicsBody.quaternion.set(newRotation.x, newRotation.y, newRotation.z, newRotation.w);
    };
    CannonJSPlugin.prototype.isSupported = function () {
        return this.BJSCANNON !== undefined;
    };
    CannonJSPlugin.prototype.setLinearVelocity = function (impostor, velocity) {
        impostor.physicsBody.velocity.set(velocity.x, velocity.y, velocity.z);
    };
    CannonJSPlugin.prototype.setAngularVelocity = function (impostor, velocity) {
        impostor.physicsBody.angularVelocity.set(velocity.x, velocity.y, velocity.z);
    };
    CannonJSPlugin.prototype.getLinearVelocity = function (impostor) {
        var v = impostor.physicsBody.velocity;
        if (!v) {
            return null;
        }
        return new Vector3(v.x, v.y, v.z);
    };
    CannonJSPlugin.prototype.getAngularVelocity = function (impostor) {
        var v = impostor.physicsBody.angularVelocity;
        if (!v) {
            return null;
        }
        return new Vector3(v.x, v.y, v.z);
    };
    CannonJSPlugin.prototype.setBodyMass = function (impostor, mass) {
        impostor.physicsBody.mass = mass;
        impostor.physicsBody.updateMassProperties();
    };
    CannonJSPlugin.prototype.getBodyMass = function (impostor) {
        return impostor.physicsBody.mass;
    };
    CannonJSPlugin.prototype.getBodyFriction = function (impostor) {
        return impostor.physicsBody.material.friction;
    };
    CannonJSPlugin.prototype.setBodyFriction = function (impostor, friction) {
        impostor.physicsBody.material.friction = friction;
    };
    CannonJSPlugin.prototype.getBodyRestitution = function (impostor) {
        return impostor.physicsBody.material.restitution;
    };
    CannonJSPlugin.prototype.setBodyRestitution = function (impostor, restitution) {
        impostor.physicsBody.material.restitution = restitution;
    };
    CannonJSPlugin.prototype.sleepBody = function (impostor) {
        impostor.physicsBody.sleep();
    };
    CannonJSPlugin.prototype.wakeUpBody = function (impostor) {
        impostor.physicsBody.wakeUp();
    };
    CannonJSPlugin.prototype.updateDistanceJoint = function (joint, maxDistance) {
        joint.physicsJoint.distance = maxDistance;
    };
    CannonJSPlugin.prototype.setMotor = function (joint, speed, maxForce, motorIndex) {
        if (!motorIndex) {
            joint.physicsJoint.enableMotor();
            joint.physicsJoint.setMotorSpeed(speed);
            if (maxForce) {
                this.setLimit(joint, maxForce);
            }
        }
    };
    CannonJSPlugin.prototype.setLimit = function (joint, upperLimit, lowerLimit) {
        joint.physicsJoint.motorEquation.maxForce = upperLimit;
        joint.physicsJoint.motorEquation.minForce = lowerLimit === void 0 ? -upperLimit : lowerLimit;
    };
    CannonJSPlugin.prototype.syncMeshWithImpostor = function (mesh, impostor) {
        var body = impostor.physicsBody;
        mesh.position.x = body.position.x;
        mesh.position.y = body.position.y;
        mesh.position.z = body.position.z;
        if (mesh.rotationQuaternion) {
            mesh.rotationQuaternion.x = body.quaternion.x;
            mesh.rotationQuaternion.y = body.quaternion.y;
            mesh.rotationQuaternion.z = body.quaternion.z;
            mesh.rotationQuaternion.w = body.quaternion.w;
        }
    };
    CannonJSPlugin.prototype.getRadius = function (impostor) {
        var shape = impostor.physicsBody.shapes[0];
        return shape.boundingSphereRadius;
    };
    CannonJSPlugin.prototype.getBoxSizeToRef = function (impostor, result) {
        var shape = impostor.physicsBody.shapes[0];
        result.x = shape.halfExtents.x * 2;
        result.y = shape.halfExtents.y * 2;
        result.z = shape.halfExtents.z * 2;
    };
    CannonJSPlugin.prototype.dispose = function () { };
    CannonJSPlugin.prototype._extendNamespace = function () {
        //this will force cannon to execute at least one step when using interpolation
        var step_tmp1 = new this.BJSCANNON.Vec3();
        var Engine = this.BJSCANNON;
        this.BJSCANNON.World.prototype.step = function (dt, timeSinceLastCalled, maxSubSteps) {
            maxSubSteps = maxSubSteps || 10;
            timeSinceLastCalled = timeSinceLastCalled || 0;
            if (timeSinceLastCalled === 0) {
                this.internalStep(dt);
                this.time += dt;
            }
            else {
                var internalSteps = Math.floor((this.time + timeSinceLastCalled) / dt) - Math.floor(this.time / dt);
                internalSteps = Math.min(internalSteps, maxSubSteps) || 1;
                var t0 = performance.now();
                for (var i = 0; i !== internalSteps; i++) {
                    this.internalStep(dt);
                    if (performance.now() - t0 > dt * 1000) {
                        break;
                    }
                }
                this.time += timeSinceLastCalled;
                var h = this.time % dt;
                var h_div_dt = h / dt;
                var interpvelo = step_tmp1;
                var bodies = this.bodies;
                for (var j = 0; j !== bodies.length; j++) {
                    var b = bodies[j];
                    if (b.type !== Engine.Body.STATIC && b.sleepState !== Engine.Body.SLEEPING) {
                        b.position.vsub(b.previousPosition, interpvelo);
                        interpvelo.scale(h_div_dt, interpvelo);
                        b.position.vadd(interpvelo, b.interpolatedPosition);
                    }
                    else {
                        b.interpolatedPosition.set(b.position.x, b.position.y, b.position.z);
                        b.interpolatedQuaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
                    }
                }
            }
        };
    };
    /**
     * Does a raycast in the physics world
     * @param from when should the ray start?
     * @param to when should the ray end?
     * @returns PhysicsRaycastResult
     */
    CannonJSPlugin.prototype.raycast = function (from, to) {
        this._cannonRaycastResult.reset();
        this.world.raycastClosest(from, to, {}, this._cannonRaycastResult);
        this._raycastResult.reset(from, to);
        if (this._cannonRaycastResult.hasHit) {
            // TODO: do we also want to get the body it hit?
            this._raycastResult.setHitData({
                x: this._cannonRaycastResult.hitNormalWorld.x,
                y: this._cannonRaycastResult.hitNormalWorld.y,
                z: this._cannonRaycastResult.hitNormalWorld.z,
            }, {
                x: this._cannonRaycastResult.hitPointWorld.x,
                y: this._cannonRaycastResult.hitPointWorld.y,
                z: this._cannonRaycastResult.hitPointWorld.z,
            });
            this._raycastResult.setHitDistance(this._cannonRaycastResult.distance);
        }
        return this._raycastResult;
    };
    return CannonJSPlugin;
}());
PhysicsEngine.DefaultPluginFactory = function () {
    return new CannonJSPlugin();
};

/** @hidden */
var OimoJSPlugin = /** @class */ (function () {
    function OimoJSPlugin(_useDeltaForWorldStep, iterations, oimoInjection) {
        if (_useDeltaForWorldStep === void 0) { _useDeltaForWorldStep = true; }
        if (oimoInjection === void 0) { oimoInjection = OIMO; }
        this._useDeltaForWorldStep = _useDeltaForWorldStep;
        this.name = "OimoJSPlugin";
        this._fixedTimeStep = 1 / 60;
        this._tmpImpostorsArray = [];
        this._tmpPositionVector = Vector3.Zero();
        this.BJSOIMO = oimoInjection;
        this.world = new this.BJSOIMO.World({
            iterations: iterations,
        });
        this.world.clear();
        this._raycastResult = new PhysicsRaycastResult();
    }
    OimoJSPlugin.prototype.setGravity = function (gravity) {
        this.world.gravity.set(gravity.x, gravity.y, gravity.z);
    };
    OimoJSPlugin.prototype.setTimeStep = function (timeStep) {
        this.world.timeStep = timeStep;
    };
    OimoJSPlugin.prototype.getTimeStep = function () {
        return this.world.timeStep;
    };
    OimoJSPlugin.prototype.executeStep = function (delta, impostors) {
        var _this = this;
        impostors.forEach(function (impostor) {
            impostor.beforeStep();
        });
        this.world.timeStep = this._useDeltaForWorldStep ? delta : this._fixedTimeStep;
        this.world.step();
        impostors.forEach(function (impostor) {
            impostor.afterStep();
            //update the ordered impostors array
            _this._tmpImpostorsArray[impostor.uniqueId] = impostor;
        });
        //check for collisions
        var contact = this.world.contacts;
        while (contact !== null) {
            if (contact.touching && !contact.body1.sleeping && !contact.body2.sleeping) {
                contact = contact.next;
                continue;
            }
            //is this body colliding with any other? get the impostor
            var mainImpostor = this._tmpImpostorsArray[+contact.body1.name];
            var collidingImpostor = this._tmpImpostorsArray[+contact.body2.name];
            if (!mainImpostor || !collidingImpostor) {
                contact = contact.next;
                continue;
            }
            mainImpostor.onCollide({ body: collidingImpostor.physicsBody, point: null });
            collidingImpostor.onCollide({ body: mainImpostor.physicsBody, point: null });
            contact = contact.next;
        }
    };
    OimoJSPlugin.prototype.applyImpulse = function (impostor, force, contactPoint) {
        var mass = impostor.physicsBody.mass;
        impostor.physicsBody.applyImpulse(contactPoint.scale(this.world.invScale), force.scale(this.world.invScale * mass));
    };
    OimoJSPlugin.prototype.applyForce = function (impostor, force, contactPoint) {
        Logger.Warn("Oimo doesn't support applying force. Using impule instead.");
        this.applyImpulse(impostor, force, contactPoint);
    };
    OimoJSPlugin.prototype.generatePhysicsBody = function (impostor) {
        var _this = this;
        //parent-child relationship. Does this impostor has a parent impostor?
        if (impostor.parent) {
            if (impostor.physicsBody) {
                this.removePhysicsBody(impostor);
                //TODO is that needed?
                impostor.forceUpdate();
            }
            return;
        }
        if (impostor.isBodyInitRequired()) {
            var bodyConfig = {
                name: impostor.uniqueId,
                //Oimo must have mass, also for static objects.
                config: [impostor.getParam("mass") || 0.001, impostor.getParam("friction"), impostor.getParam("restitution")],
                size: [],
                type: [],
                pos: [],
                posShape: [],
                rot: [],
                rotShape: [],
                move: impostor.getParam("mass") !== 0,
                density: impostor.getParam("mass"),
                friction: impostor.getParam("friction"),
                restitution: impostor.getParam("restitution"),
                //Supporting older versions of Oimo
                world: this.world,
            };
            var impostors = [impostor];
            var addToArray = function (parent) {
                if (!parent.getChildMeshes) {
                    return;
                }
                parent.getChildMeshes().forEach(function (m) {
                    if (m.physicsImpostor) {
                        impostors.push(m.physicsImpostor);
                        //m.physicsImpostor._init();
                    }
                });
            };
            addToArray(impostor.object);
            var checkWithEpsilon_1 = function (value) {
                return Math.max(value, PhysicsEngine.Epsilon);
            };
            var globalQuaternion_1 = new Quaternion();
            impostors.forEach(function (i) {
                if (!i.object.rotationQuaternion) {
                    return;
                }
                //get the correct bounding box
                var oldQuaternion = i.object.rotationQuaternion;
                globalQuaternion_1.copyFrom(oldQuaternion);
                i.object.rotationQuaternion.set(0, 0, 0, 1);
                i.object.computeWorldMatrix(true);
                var rot = globalQuaternion_1.toEulerAngles();
                var extendSize = i.getObjectExtendSize();
                var radToDeg = 57.295779513082320876;
                if (i === impostor) {
                    var center = impostor.getObjectCenter();
                    impostor.object.getAbsolutePivotPoint().subtractToRef(center, _this._tmpPositionVector);
                    _this._tmpPositionVector.divideInPlace(impostor.object.scaling);
                    //Can also use Array.prototype.push.apply
                    bodyConfig.pos.push(center.x);
                    bodyConfig.pos.push(center.y);
                    bodyConfig.pos.push(center.z);
                    bodyConfig.posShape.push(0, 0, 0);
                    bodyConfig.rotShape.push(0, 0, 0);
                }
                else {
                    var localPosition = i.object.position.clone();
                    bodyConfig.posShape.push(localPosition.x);
                    bodyConfig.posShape.push(localPosition.y);
                    bodyConfig.posShape.push(localPosition.z);
                    // bodyConfig.pos.push(0, 0, 0);
                    bodyConfig.rotShape.push(rot.x * radToDeg, rot.y * radToDeg, rot.z * radToDeg);
                }
                i.object.rotationQuaternion.copyFrom(globalQuaternion_1);
                // register mesh
                switch (i.type) {
                    case PhysicsImpostor.ParticleImpostor:
                        Logger.Warn("No Particle support in OIMO.js. using SphereImpostor instead");
                    case PhysicsImpostor.SphereImpostor:
                        var radiusX = extendSize.x;
                        var radiusY = extendSize.y;
                        var radiusZ = extendSize.z;
                        var size = Math.max(checkWithEpsilon_1(radiusX), checkWithEpsilon_1(radiusY), checkWithEpsilon_1(radiusZ)) / 2;
                        bodyConfig.type.push("sphere");
                        //due to the way oimo works with compounds, add 3 times
                        bodyConfig.size.push(size);
                        bodyConfig.size.push(size);
                        bodyConfig.size.push(size);
                        break;
                    case PhysicsImpostor.CylinderImpostor:
                        var sizeX = checkWithEpsilon_1(extendSize.x) / 2;
                        var sizeY = checkWithEpsilon_1(extendSize.y);
                        bodyConfig.type.push("cylinder");
                        bodyConfig.size.push(sizeX);
                        bodyConfig.size.push(sizeY);
                        //due to the way oimo works with compounds, add one more value.
                        bodyConfig.size.push(sizeY);
                        break;
                    case PhysicsImpostor.PlaneImpostor:
                    case PhysicsImpostor.BoxImpostor:
                    default:
                        var sizeX = checkWithEpsilon_1(extendSize.x);
                        var sizeY = checkWithEpsilon_1(extendSize.y);
                        var sizeZ = checkWithEpsilon_1(extendSize.z);
                        bodyConfig.type.push("box");
                        //if (i === impostor) {
                        bodyConfig.size.push(sizeX);
                        bodyConfig.size.push(sizeY);
                        bodyConfig.size.push(sizeZ);
                        //} else {
                        //    bodyConfig.size.push(0,0,0);
                        //}
                        break;
                }
                //actually not needed, but hey...
                i.object.rotationQuaternion = oldQuaternion;
            });
            impostor.physicsBody = this.world.add(bodyConfig);
            // set the quaternion, ignoring the previously defined (euler) rotation
            impostor.physicsBody.resetQuaternion(globalQuaternion_1);
            // update with delta 0, so the body will receive the new rotation.
            impostor.physicsBody.updatePosition(0);
        }
        else {
            this._tmpPositionVector.copyFromFloats(0, 0, 0);
        }
        impostor.setDeltaPosition(this._tmpPositionVector);
        //this._tmpPositionVector.addInPlace(impostor.mesh.getBoundingInfo().boundingBox.center);
        //this.setPhysicsBodyTransformation(impostor, this._tmpPositionVector, impostor.mesh.rotationQuaternion);
    };
    OimoJSPlugin.prototype.removePhysicsBody = function (impostor) {
        //impostor.physicsBody.dispose();
        //Same as : (older oimo versions)
        this.world.removeRigidBody(impostor.physicsBody);
    };
    OimoJSPlugin.prototype.generateJoint = function (impostorJoint) {
        var mainBody = impostorJoint.mainImpostor.physicsBody;
        var connectedBody = impostorJoint.connectedImpostor.physicsBody;
        if (!mainBody || !connectedBody) {
            return;
        }
        var jointData = impostorJoint.joint.jointData;
        var options = jointData.nativeParams || {};
        var type;
        var nativeJointData = {
            body1: mainBody,
            body2: connectedBody,
            axe1: options.axe1 || (jointData.mainAxis ? jointData.mainAxis.asArray() : null),
            axe2: options.axe2 || (jointData.connectedAxis ? jointData.connectedAxis.asArray() : null),
            pos1: options.pos1 || (jointData.mainPivot ? jointData.mainPivot.asArray() : null),
            pos2: options.pos2 || (jointData.connectedPivot ? jointData.connectedPivot.asArray() : null),
            min: options.min,
            max: options.max,
            collision: options.collision || jointData.collision,
            spring: options.spring,
            //supporting older version of Oimo
            world: this.world,
        };
        switch (impostorJoint.joint.type) {
            case PhysicsJoint.BallAndSocketJoint:
                type = "jointBall";
                break;
            case PhysicsJoint.SpringJoint:
                Logger.Warn("OIMO.js doesn't support Spring Constraint. Simulating using DistanceJoint instead");
                var springData = jointData;
                nativeJointData.min = springData.length || nativeJointData.min;
                //Max should also be set, just make sure it is at least min
                nativeJointData.max = Math.max(nativeJointData.min, nativeJointData.max);
            case PhysicsJoint.DistanceJoint:
                type = "jointDistance";
                nativeJointData.max = jointData.maxDistance;
                break;
            case PhysicsJoint.PrismaticJoint:
                type = "jointPrisme";
                break;
            case PhysicsJoint.SliderJoint:
                type = "jointSlide";
                break;
            case PhysicsJoint.WheelJoint:
                type = "jointWheel";
                break;
            case PhysicsJoint.HingeJoint:
            default:
                type = "jointHinge";
                break;
        }
        nativeJointData.type = type;
        impostorJoint.joint.physicsJoint = this.world.add(nativeJointData);
    };
    OimoJSPlugin.prototype.removeJoint = function (impostorJoint) {
        //Bug in Oimo prevents us from disposing a joint in the playground
        //joint.joint.physicsJoint.dispose();
        //So we will bruteforce it!
        try {
            this.world.removeJoint(impostorJoint.joint.physicsJoint);
        }
        catch (e) {
            Logger.Warn(e);
        }
    };
    OimoJSPlugin.prototype.isSupported = function () {
        return this.BJSOIMO !== undefined;
    };
    OimoJSPlugin.prototype.setTransformationFromPhysicsBody = function (impostor) {
        if (!impostor.physicsBody.sleeping) {
            if (impostor.physicsBody.shapes.next) {
                var parent_1 = impostor.physicsBody.shapes;
                while (parent_1.next) {
                    parent_1 = parent_1.next;
                }
                impostor.object.position.set(parent_1.position.x, parent_1.position.y, parent_1.position.z);
            }
            else {
                var pos = impostor.physicsBody.getPosition();
                impostor.object.position.set(pos.x, pos.y, pos.z);
            }
            //}
            if (impostor.object.rotationQuaternion) {
                var quat = impostor.physicsBody.getQuaternion();
                impostor.object.rotationQuaternion.set(quat.x, quat.y, quat.z, quat.w);
            }
        }
    };
    OimoJSPlugin.prototype.setPhysicsBodyTransformation = function (impostor, newPosition, newRotation) {
        var body = impostor.physicsBody;
        // disable bidirectional for compound meshes
        if (impostor.physicsBody.shapes.next) {
            return;
        }
        body.position.set(newPosition.x, newPosition.y, newPosition.z);
        body.orientation.set(newRotation.x, newRotation.y, newRotation.z, newRotation.w);
        body.syncShapes();
        body.awake();
    };
    /*private _getLastShape(body: any): any {
        var lastShape = body.shapes;
        while (lastShape.next) {
            lastShape = lastShape.next;
        }
        return lastShape;
    }*/
    OimoJSPlugin.prototype.setLinearVelocity = function (impostor, velocity) {
        impostor.physicsBody.linearVelocity.set(velocity.x, velocity.y, velocity.z);
    };
    OimoJSPlugin.prototype.setAngularVelocity = function (impostor, velocity) {
        impostor.physicsBody.angularVelocity.set(velocity.x, velocity.y, velocity.z);
    };
    OimoJSPlugin.prototype.getLinearVelocity = function (impostor) {
        var v = impostor.physicsBody.linearVelocity;
        if (!v) {
            return null;
        }
        return new Vector3(v.x, v.y, v.z);
    };
    OimoJSPlugin.prototype.getAngularVelocity = function (impostor) {
        var v = impostor.physicsBody.angularVelocity;
        if (!v) {
            return null;
        }
        return new Vector3(v.x, v.y, v.z);
    };
    OimoJSPlugin.prototype.setBodyMass = function (impostor, mass) {
        var staticBody = mass === 0;
        //this will actually set the body's density and not its mass.
        //But this is how oimo treats the mass variable.
        impostor.physicsBody.shapes.density = staticBody ? 1 : mass;
        impostor.physicsBody.setupMass(staticBody ? 0x2 : 0x1);
    };
    OimoJSPlugin.prototype.getBodyMass = function (impostor) {
        return impostor.physicsBody.shapes.density;
    };
    OimoJSPlugin.prototype.getBodyFriction = function (impostor) {
        return impostor.physicsBody.shapes.friction;
    };
    OimoJSPlugin.prototype.setBodyFriction = function (impostor, friction) {
        impostor.physicsBody.shapes.friction = friction;
    };
    OimoJSPlugin.prototype.getBodyRestitution = function (impostor) {
        return impostor.physicsBody.shapes.restitution;
    };
    OimoJSPlugin.prototype.setBodyRestitution = function (impostor, restitution) {
        impostor.physicsBody.shapes.restitution = restitution;
    };
    OimoJSPlugin.prototype.sleepBody = function (impostor) {
        impostor.physicsBody.sleep();
    };
    OimoJSPlugin.prototype.wakeUpBody = function (impostor) {
        impostor.physicsBody.awake();
    };
    OimoJSPlugin.prototype.updateDistanceJoint = function (joint, maxDistance, minDistance) {
        joint.physicsJoint.limitMotor.upperLimit = maxDistance;
        if (minDistance !== void 0) {
            joint.physicsJoint.limitMotor.lowerLimit = minDistance;
        }
    };
    OimoJSPlugin.prototype.setMotor = function (joint, speed, force, motorIndex) {
        if (force !== undefined) {
            Logger.Warn("OimoJS plugin currently has unexpected behavior when using setMotor with force parameter");
        }
        else {
            force = 1e6;
        }
        speed *= -1;
        //TODO separate rotational and transational motors.
        var motor = motorIndex ? joint.physicsJoint.rotationalLimitMotor2 : joint.physicsJoint.rotationalLimitMotor1 || joint.physicsJoint.rotationalLimitMotor || joint.physicsJoint.limitMotor;
        if (motor) {
            motor.setMotor(speed, force);
        }
    };
    OimoJSPlugin.prototype.setLimit = function (joint, upperLimit, lowerLimit, motorIndex) {
        //TODO separate rotational and transational motors.
        var motor = motorIndex ? joint.physicsJoint.rotationalLimitMotor2 : joint.physicsJoint.rotationalLimitMotor1 || joint.physicsJoint.rotationalLimitMotor || joint.physicsJoint.limitMotor;
        if (motor) {
            motor.setLimit(upperLimit, lowerLimit === void 0 ? -upperLimit : lowerLimit);
        }
    };
    OimoJSPlugin.prototype.syncMeshWithImpostor = function (mesh, impostor) {
        var body = impostor.physicsBody;
        mesh.position.x = body.position.x;
        mesh.position.y = body.position.y;
        mesh.position.z = body.position.z;
        if (mesh.rotationQuaternion) {
            mesh.rotationQuaternion.x = body.orientation.x;
            mesh.rotationQuaternion.y = body.orientation.y;
            mesh.rotationQuaternion.z = body.orientation.z;
            mesh.rotationQuaternion.w = body.orientation.s;
        }
    };
    OimoJSPlugin.prototype.getRadius = function (impostor) {
        return impostor.physicsBody.shapes.radius;
    };
    OimoJSPlugin.prototype.getBoxSizeToRef = function (impostor, result) {
        var shape = impostor.physicsBody.shapes;
        result.x = shape.halfWidth * 2;
        result.y = shape.halfHeight * 2;
        result.z = shape.halfDepth * 2;
    };
    OimoJSPlugin.prototype.dispose = function () {
        this.world.clear();
    };
    /**
     * Does a raycast in the physics world
     * @param from when should the ray start?
     * @param to when should the ray end?
     * @returns PhysicsRaycastResult
     */
    OimoJSPlugin.prototype.raycast = function (from, to) {
        Logger.Warn("raycast is not currently supported by the Oimo physics plugin");
        this._raycastResult.reset(from, to);
        return this._raycastResult;
    };
    return OimoJSPlugin;
}());

AbstractScene.prototype.removeReflectionProbe = function (toRemove) {
    if (!this.reflectionProbes) {
        return -1;
    }
    var index = this.reflectionProbes.indexOf(toRemove);
    if (index !== -1) {
        this.reflectionProbes.splice(index, 1);
    }
    return index;
};
AbstractScene.prototype.addReflectionProbe = function (newReflectionProbe) {
    if (!this.reflectionProbes) {
        this.reflectionProbes = [];
    }
    this.reflectionProbes.push(newReflectionProbe);
};
/**
 * Class used to generate realtime reflection / refraction cube textures
 * @see https://doc.babylonjs.com/how_to/how_to_use_reflection_probes
 */
var ReflectionProbe = /** @class */ (function () {
    /**
     * Creates a new reflection probe
     * @param name defines the name of the probe
     * @param size defines the texture resolution (for each face)
     * @param scene defines the hosting scene
     * @param generateMipMaps defines if mip maps should be generated automatically (true by default)
     * @param useFloat defines if HDR data (flaot data) should be used to store colors (false by default)
     */
    function ReflectionProbe(
    /** defines the name of the probe */
    name, size, scene, generateMipMaps, useFloat) {
        var _this = this;
        if (generateMipMaps === void 0) { generateMipMaps = true; }
        if (useFloat === void 0) { useFloat = false; }
        this.name = name;
        this._viewMatrix = Matrix.Identity();
        this._target = Vector3.Zero();
        this._add = Vector3.Zero();
        this._invertYAxis = false;
        /** Gets or sets probe position (center of the cube map) */
        this.position = Vector3.Zero();
        this._scene = scene;
        // Create the scene field if not exist.
        if (!this._scene.reflectionProbes) {
            this._scene.reflectionProbes = new Array();
        }
        this._scene.reflectionProbes.push(this);
        var textureType = 0;
        if (useFloat) {
            var caps = this._scene.getEngine().getCaps();
            if (caps.textureHalfFloatRender) {
                textureType = 2;
            }
            else if (caps.textureFloatRender) {
                textureType = 1;
            }
        }
        this._renderTargetTexture = new RenderTargetTexture(name, size, scene, generateMipMaps, true, textureType, true);
        this._renderTargetTexture.onBeforeRenderObservable.add(function (faceIndex) {
            switch (faceIndex) {
                case 0:
                    _this._add.copyFromFloats(1, 0, 0);
                    break;
                case 1:
                    _this._add.copyFromFloats(-1, 0, 0);
                    break;
                case 2:
                    _this._add.copyFromFloats(0, _this._invertYAxis ? 1 : -1, 0);
                    break;
                case 3:
                    _this._add.copyFromFloats(0, _this._invertYAxis ? -1 : 1, 0);
                    break;
                case 4:
                    _this._add.copyFromFloats(0, 0, 1);
                    break;
                case 5:
                    _this._add.copyFromFloats(0, 0, -1);
                    break;
            }
            if (_this._attachedMesh) {
                _this.position.copyFrom(_this._attachedMesh.getAbsolutePosition());
            }
            _this.position.addToRef(_this._add, _this._target);
            Matrix.LookAtLHToRef(_this.position, _this._target, Vector3.Up(), _this._viewMatrix);
            if (scene.activeCamera) {
                _this._projectionMatrix = Matrix.PerspectiveFovLH(Math.PI / 2, 1, scene.activeCamera.minZ, scene.activeCamera.maxZ);
                scene.setTransformMatrix(_this._viewMatrix, _this._projectionMatrix);
            }
            scene._forcedViewPosition = _this.position;
        });
        this._renderTargetTexture.onAfterUnbindObservable.add(function () {
            scene._forcedViewPosition = null;
            scene.updateTransformMatrix(true);
        });
    }
    Object.defineProperty(ReflectionProbe.prototype, "samples", {
        /** Gets or sets the number of samples to use for multi-sampling (0 by default). Required WebGL2 */
        get: function () {
            return this._renderTargetTexture.samples;
        },
        set: function (value) {
            this._renderTargetTexture.samples = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReflectionProbe.prototype, "refreshRate", {
        /** Gets or sets the refresh rate to use (on every frame by default) */
        get: function () {
            return this._renderTargetTexture.refreshRate;
        },
        set: function (value) {
            this._renderTargetTexture.refreshRate = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the hosting scene
     * @returns a Scene
     */
    ReflectionProbe.prototype.getScene = function () {
        return this._scene;
    };
    Object.defineProperty(ReflectionProbe.prototype, "cubeTexture", {
        /** Gets the internal CubeTexture used to render to */
        get: function () {
            return this._renderTargetTexture;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReflectionProbe.prototype, "renderList", {
        /** Gets the list of meshes to render */
        get: function () {
            return this._renderTargetTexture.renderList;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Attach the probe to a specific mesh (Rendering will be done from attached mesh's position)
     * @param mesh defines the mesh to attach to
     */
    ReflectionProbe.prototype.attachToMesh = function (mesh) {
        this._attachedMesh = mesh;
    };
    /**
     * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
     */
    ReflectionProbe.prototype.setRenderingAutoClearDepthStencil = function (renderingGroupId, autoClearDepthStencil) {
        this._renderTargetTexture.setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil);
    };
    /**
     * Clean all associated resources
     */
    ReflectionProbe.prototype.dispose = function () {
        var index = this._scene.reflectionProbes.indexOf(this);
        if (index !== -1) {
            // Remove from the scene if found
            this._scene.reflectionProbes.splice(index, 1);
        }
        if (this._renderTargetTexture) {
            this._renderTargetTexture.dispose();
            this._renderTargetTexture = null;
        }
    };
    /**
     * Converts the reflection probe information to a readable string for debug purpose.
     * @param fullDetails Supports for multiple levels of logging within scene loading
     * @returns the human readable reflection probe info
     */
    ReflectionProbe.prototype.toString = function (fullDetails) {
        var ret = "Name: " + this.name;
        if (fullDetails) {
            ret += ", position: " + this.position.toString();
            if (this._attachedMesh) {
                ret += ", attached mesh: " + this._attachedMesh.name;
            }
        }
        return ret;
    };
    /**
     * Get the class name of the relfection probe.
     * @returns "ReflectionProbe"
     */
    ReflectionProbe.prototype.getClassName = function () {
        return "ReflectionProbe";
    };
    /**
     * Serialize the reflection probe to a JSON representation we can easily use in the resepective Parse function.
     * @returns The JSON representation of the texture
     */
    ReflectionProbe.prototype.serialize = function () {
        var serializationObject = SerializationHelper.Serialize(this, this._renderTargetTexture.serialize());
        serializationObject.isReflectionProbe = true;
        return serializationObject;
    };
    /**
     * Parse the JSON representation of a reflection probe in order to recreate the reflection probe in the given scene.
     * @param parsedReflectionProbe Define the JSON representation of the reflection probe
     * @param scene Define the scene the parsed reflection probe should be instantiated in
     * @param rootUrl Define the root url of the parsing sequence in the case of relative dependencies
     * @returns The parsed reflection probe if successful
     */
    ReflectionProbe.Parse = function (parsedReflectionProbe, scene, rootUrl) {
        var reflectionProbe = null;
        if (scene.reflectionProbes) {
            for (var index = 0; index < scene.reflectionProbes.length; index++) {
                var rp = scene.reflectionProbes[index];
                if (rp.name === parsedReflectionProbe.name) {
                    reflectionProbe = rp;
                    break;
                }
            }
        }
        reflectionProbe = SerializationHelper.Parse(function () { return reflectionProbe || new ReflectionProbe(parsedReflectionProbe.name, parsedReflectionProbe.renderTargetSize, scene, parsedReflectionProbe._generateMipMaps); }, parsedReflectionProbe, scene, rootUrl);
        reflectionProbe.cubeTexture._waitingRenderList = parsedReflectionProbe.renderList;
        if (parsedReflectionProbe._attachedMesh) {
            reflectionProbe.attachToMesh(scene.getMeshByID(parsedReflectionProbe._attachedMesh));
        }
        return reflectionProbe;
    };
    __decorate([
        serializeAsMeshReference()
    ], ReflectionProbe.prototype, "_attachedMesh", void 0);
    __decorate([
        serializeAsVector3()
    ], ReflectionProbe.prototype, "position", void 0);
    return ReflectionProbe;
}());

/** @hidden */
var _BabylonLoaderRegistered = true;
/**
 * Helps setting up some configuration for the babylon file loader.
 */
var BabylonFileLoaderConfiguration = /** @class */ (function () {
    function BabylonFileLoaderConfiguration() {
    }
    /**
     * The loader does not allow injecting custom physix engine into the plugins.
     * Unfortunately in ES6, we need to manually inject them into the plugin.
     * So you could set this variable to your engine import to make it work.
     */
    BabylonFileLoaderConfiguration.LoaderInjectedPhysicsEngine = undefined;
    return BabylonFileLoaderConfiguration;
}());
var parseMaterialById = function (id, parsedData, scene, rootUrl) {
    for (var index = 0, cache = parsedData.materials.length; index < cache; index++) {
        var parsedMaterial = parsedData.materials[index];
        if (parsedMaterial.id === id) {
            return Material.Parse(parsedMaterial, scene, rootUrl);
        }
    }
    return null;
};
var isDescendantOf = function (mesh, names, hierarchyIds) {
    for (var i in names) {
        if (mesh.name === names[i]) {
            hierarchyIds.push(mesh.id);
            return true;
        }
    }
    if (mesh.parentId && hierarchyIds.indexOf(mesh.parentId) !== -1) {
        hierarchyIds.push(mesh.id);
        return true;
    }
    return false;
};
var logOperation = function (operation, producer) {
    return operation + " of " + (producer ? producer.file + " from " + producer.name + " version: " + producer.version + ", exporter version: " + producer.exporter_version : "unknown");
};
var loadDetailLevels = function (scene, mesh) {
    var mastermesh = mesh;
    // Every value specified in the ids array of the lod data points to another mesh which should be used as the lower LOD level.
    // The distances (or coverages) array values specified are used along with the lod mesh ids as a hint to determine the switching threshold for the various LODs.
    if (mesh._waitingData.lods) {
        if (mesh._waitingData.lods.ids && mesh._waitingData.lods.ids.length > 0) {
            var lodmeshes = mesh._waitingData.lods.ids;
            var wasenabled = mastermesh.isEnabled(false);
            if (mesh._waitingData.lods.distances) {
                var distances = mesh._waitingData.lods.distances;
                if (distances.length >= lodmeshes.length) {
                    var culling = (distances.length > lodmeshes.length) ? distances[distances.length - 1] : 0;
                    mastermesh.setEnabled(false);
                    for (var index = 0; index < lodmeshes.length; index++) {
                        var lodid = lodmeshes[index];
                        var lodmesh = scene.getMeshByID(lodid);
                        if (lodmesh != null) {
                            mastermesh.addLODLevel(distances[index], lodmesh);
                        }
                    }
                    if (culling > 0) {
                        mastermesh.addLODLevel(culling, null);
                    }
                    if (wasenabled === true) {
                        mastermesh.setEnabled(true);
                    }
                }
                else {
                    Tools.Warn("Invalid level of detail distances for " + mesh.name);
                }
            }
        }
        mesh._waitingData.lods = null;
    }
};
var loadAssetContainer = function (scene, data, rootUrl, onError, addToScene) {
    if (addToScene === void 0) { addToScene = false; }
    var container = new AssetContainer(scene);
    // Entire method running in try block, so ALWAYS logs as far as it got, only actually writes details
    // when SceneLoader.debugLogging = true (default), or exception encountered.
    // Everything stored in var log instead of writing separate lines to support only writing in exception,
    // and avoid problems with multiple concurrent .babylon loads.
    var log = "importScene has failed JSON parse";
    try {
        var parsedData = JSON.parse(data);
        log = "";
        var fullDetails = SceneLoader.loggingLevel === SceneLoader.DETAILED_LOGGING;
        var index;
        var cache;
        // Environment texture
        if (parsedData.environmentTexture !== undefined && parsedData.environmentTexture !== null) {
            // PBR needed for both HDR texture (gamma space) & a sky box
            var isPBR = parsedData.isPBR !== undefined ? parsedData.isPBR : true;
            if (parsedData.environmentTextureType && parsedData.environmentTextureType === "BABYLON.HDRCubeTexture") {
                var hdrSize = (parsedData.environmentTextureSize) ? parsedData.environmentTextureSize : 128;
                var hdrTexture = new HDRCubeTexture((parsedData.environmentTexture.match(/https?:\/\//g) ? "" : rootUrl) + parsedData.environmentTexture, scene, hdrSize, true, !isPBR);
                if (parsedData.environmentTextureRotationY) {
                    hdrTexture.rotationY = parsedData.environmentTextureRotationY;
                }
                scene.environmentTexture = hdrTexture;
            }
            else {
                if (StringTools.EndsWith(parsedData.environmentTexture, ".env")) {
                    var compressedTexture = new CubeTexture((parsedData.environmentTexture.match(/https?:\/\//g) ? "" : rootUrl) + parsedData.environmentTexture, scene);
                    if (parsedData.environmentTextureRotationY) {
                        compressedTexture.rotationY = parsedData.environmentTextureRotationY;
                    }
                    scene.environmentTexture = compressedTexture;
                }
                else {
                    var cubeTexture = CubeTexture.CreateFromPrefilteredData((parsedData.environmentTexture.match(/https?:\/\//g) ? "" : rootUrl) + parsedData.environmentTexture, scene);
                    if (parsedData.environmentTextureRotationY) {
                        cubeTexture.rotationY = parsedData.environmentTextureRotationY;
                    }
                    scene.environmentTexture = cubeTexture;
                }
            }
            if (parsedData.createDefaultSkybox === true) {
                var skyboxScale = (scene.activeCamera !== undefined && scene.activeCamera !== null) ? (scene.activeCamera.maxZ - scene.activeCamera.minZ) / 2 : 1000;
                var skyboxBlurLevel = parsedData.skyboxBlurLevel || 0;
                scene.createDefaultSkybox(scene.environmentTexture, isPBR, skyboxScale, skyboxBlurLevel);
            }
            container.environmentTexture = scene.environmentTexture;
        }
        // Environment Intensity
        if (parsedData.environmentIntensity !== undefined && parsedData.environmentIntensity !== null) {
            scene.environmentIntensity = parsedData.environmentIntensity;
        }
        // Lights
        if (parsedData.lights !== undefined && parsedData.lights !== null) {
            for (index = 0, cache = parsedData.lights.length; index < cache; index++) {
                var parsedLight = parsedData.lights[index];
                var light = Light.Parse(parsedLight, scene);
                if (light) {
                    container.lights.push(light);
                    log += (index === 0 ? "\n\tLights:" : "");
                    log += "\n\t\t" + light.toString(fullDetails);
                }
            }
        }
        // Reflection probes
        if (parsedData.reflectionProbes !== undefined && parsedData.reflectionProbes !== null) {
            for (index = 0, cache = parsedData.reflectionProbes.length; index < cache; index++) {
                var parsedReflectionProbe = parsedData.reflectionProbes[index];
                var reflectionProbe = ReflectionProbe.Parse(parsedReflectionProbe, scene, rootUrl);
                if (reflectionProbe) {
                    container.reflectionProbes.push(reflectionProbe);
                    log += (index === 0 ? "\n\tReflection Probes:" : "");
                    log += "\n\t\t" + reflectionProbe.toString(fullDetails);
                }
            }
        }
        // Animations
        if (parsedData.animations !== undefined && parsedData.animations !== null) {
            for (index = 0, cache = parsedData.animations.length; index < cache; index++) {
                var parsedAnimation = parsedData.animations[index];
                var internalClass = _TypeStore.GetClass("BABYLON.Animation");
                if (internalClass) {
                    var animation = internalClass.Parse(parsedAnimation);
                    scene.animations.push(animation);
                    container.animations.push(animation);
                    log += (index === 0 ? "\n\tAnimations:" : "");
                    log += "\n\t\t" + animation.toString(fullDetails);
                }
            }
        }
        // Materials
        if (parsedData.materials !== undefined && parsedData.materials !== null) {
            for (index = 0, cache = parsedData.materials.length; index < cache; index++) {
                var parsedMaterial = parsedData.materials[index];
                var mat = Material.Parse(parsedMaterial, scene, rootUrl);
                if (mat) {
                    container.materials.push(mat);
                    log += (index === 0 ? "\n\tMaterials:" : "");
                    log += "\n\t\t" + mat.toString(fullDetails);
                    // Textures
                    var textures = mat.getActiveTextures();
                    textures.forEach(function (t) {
                        if (container.textures.indexOf(t) == -1) {
                            container.textures.push(t);
                        }
                    });
                }
            }
        }
        if (parsedData.multiMaterials !== undefined && parsedData.multiMaterials !== null) {
            for (index = 0, cache = parsedData.multiMaterials.length; index < cache; index++) {
                var parsedMultiMaterial = parsedData.multiMaterials[index];
                var mmat = MultiMaterial.ParseMultiMaterial(parsedMultiMaterial, scene);
                container.multiMaterials.push(mmat);
                log += (index === 0 ? "\n\tMultiMaterials:" : "");
                log += "\n\t\t" + mmat.toString(fullDetails);
                // Textures
                var textures = mmat.getActiveTextures();
                textures.forEach(function (t) {
                    if (container.textures.indexOf(t) == -1) {
                        container.textures.push(t);
                    }
                });
            }
        }
        // Morph targets
        if (parsedData.morphTargetManagers !== undefined && parsedData.morphTargetManagers !== null) {
            for (var _i = 0, _a = parsedData.morphTargetManagers; _i < _a.length; _i++) {
                var managerData = _a[_i];
                container.morphTargetManagers.push(MorphTargetManager.Parse(managerData, scene));
            }
        }
        // Skeletons
        if (parsedData.skeletons !== undefined && parsedData.skeletons !== null) {
            for (index = 0, cache = parsedData.skeletons.length; index < cache; index++) {
                var parsedSkeleton = parsedData.skeletons[index];
                var skeleton = Skeleton.Parse(parsedSkeleton, scene);
                container.skeletons.push(skeleton);
                log += (index === 0 ? "\n\tSkeletons:" : "");
                log += "\n\t\t" + skeleton.toString(fullDetails);
            }
        }
        // Geometries
        var geometries = parsedData.geometries;
        if (geometries !== undefined && geometries !== null) {
            var addedGeometry = new Array();
            // VertexData
            var vertexData = geometries.vertexData;
            if (vertexData !== undefined && vertexData !== null) {
                for (index = 0, cache = vertexData.length; index < cache; index++) {
                    var parsedVertexData = vertexData[index];
                    addedGeometry.push(Geometry.Parse(parsedVertexData, scene, rootUrl));
                }
            }
            addedGeometry.forEach(function (g) {
                if (g) {
                    container.geometries.push(g);
                }
            });
        }
        // Transform nodes
        if (parsedData.transformNodes !== undefined && parsedData.transformNodes !== null) {
            for (index = 0, cache = parsedData.transformNodes.length; index < cache; index++) {
                var parsedTransformNode = parsedData.transformNodes[index];
                var node = TransformNode.Parse(parsedTransformNode, scene, rootUrl);
                container.transformNodes.push(node);
            }
        }
        // Meshes
        if (parsedData.meshes !== undefined && parsedData.meshes !== null) {
            for (index = 0, cache = parsedData.meshes.length; index < cache; index++) {
                var parsedMesh = parsedData.meshes[index];
                var mesh = Mesh.Parse(parsedMesh, scene, rootUrl);
                container.meshes.push(mesh);
                if (mesh.hasInstances) {
                    for (var _b = 0, _c = mesh.instances; _b < _c.length; _b++) {
                        var instance = _c[_b];
                        container.meshes.push(instance);
                    }
                }
                log += (index === 0 ? "\n\tMeshes:" : "");
                log += "\n\t\t" + mesh.toString(fullDetails);
            }
        }
        // Cameras
        if (parsedData.cameras !== undefined && parsedData.cameras !== null) {
            for (index = 0, cache = parsedData.cameras.length; index < cache; index++) {
                var parsedCamera = parsedData.cameras[index];
                var camera = Camera.Parse(parsedCamera, scene);
                container.cameras.push(camera);
                log += (index === 0 ? "\n\tCameras:" : "");
                log += "\n\t\t" + camera.toString(fullDetails);
            }
        }
        // Postprocesses
        if (parsedData.postProcesses !== undefined && parsedData.postProcesses !== null) {
            for (index = 0, cache = parsedData.postProcesses.length; index < cache; index++) {
                var parsedPostProcess = parsedData.postProcesses[index];
                var postProcess = PostProcess.Parse(parsedPostProcess, scene, rootUrl);
                if (postProcess) {
                    container.postProcesses.push(postProcess);
                    log += (index === 0 ? "\n\Postprocesses:" : "");
                    log += "\n\t\t" + postProcess.toString();
                }
            }
        }
        // Animation Groups
        if (parsedData.animationGroups !== undefined && parsedData.animationGroups !== null) {
            for (index = 0, cache = parsedData.animationGroups.length; index < cache; index++) {
                var parsedAnimationGroup = parsedData.animationGroups[index];
                var animationGroup = AnimationGroup.Parse(parsedAnimationGroup, scene);
                container.animationGroups.push(animationGroup);
                log += (index === 0 ? "\n\tAnimationGroups:" : "");
                log += "\n\t\t" + animationGroup.toString(fullDetails);
            }
        }
        // Browsing all the graph to connect the dots
        for (index = 0, cache = scene.cameras.length; index < cache; index++) {
            var camera = scene.cameras[index];
            if (camera._waitingParentId) {
                camera.parent = scene.getLastEntryByID(camera._waitingParentId);
                camera._waitingParentId = null;
            }
        }
        for (index = 0, cache = scene.lights.length; index < cache; index++) {
            var light_1 = scene.lights[index];
            if (light_1 && light_1._waitingParentId) {
                light_1.parent = scene.getLastEntryByID(light_1._waitingParentId);
                light_1._waitingParentId = null;
            }
        }
        // Connect parents & children and parse actions and lods
        for (index = 0, cache = scene.transformNodes.length; index < cache; index++) {
            var transformNode = scene.transformNodes[index];
            if (transformNode._waitingParentId) {
                transformNode.parent = scene.getLastEntryByID(transformNode._waitingParentId);
                transformNode._waitingParentId = null;
            }
        }
        for (index = 0, cache = scene.meshes.length; index < cache; index++) {
            var mesh = scene.meshes[index];
            if (mesh._waitingParentId) {
                mesh.parent = scene.getLastEntryByID(mesh._waitingParentId);
                mesh._waitingParentId = null;
            }
            if (mesh._waitingData.lods) {
                loadDetailLevels(scene, mesh);
            }
        }
        // link skeleton transform nodes
        for (index = 0, cache = scene.skeletons.length; index < cache; index++) {
            var skeleton = scene.skeletons[index];
            if (skeleton._hasWaitingData) {
                if (skeleton.bones != null) {
                    skeleton.bones.forEach(function (bone) {
                        if (bone._waitingTransformNodeId) {
                            var linkTransformNode = scene.getLastEntryByID(bone._waitingTransformNodeId);
                            if (linkTransformNode) {
                                bone.linkTransformNode(linkTransformNode);
                            }
                            bone._waitingTransformNodeId = null;
                        }
                    });
                }
                if (skeleton._waitingOverrideMeshId) {
                    skeleton.overrideMesh = scene.getMeshByID(skeleton._waitingOverrideMeshId);
                    skeleton._waitingOverrideMeshId = null;
                }
                skeleton._hasWaitingData = null;
            }
        }
        // freeze world matrix application
        for (index = 0, cache = scene.meshes.length; index < cache; index++) {
            var currentMesh = scene.meshes[index];
            if (currentMesh._waitingData.freezeWorldMatrix) {
                currentMesh.freezeWorldMatrix();
                currentMesh._waitingData.freezeWorldMatrix = null;
            }
            else {
                currentMesh.computeWorldMatrix(true);
            }
        }
        // Lights exclusions / inclusions
        for (index = 0, cache = scene.lights.length; index < cache; index++) {
            var light_2 = scene.lights[index];
            // Excluded check
            if (light_2._excludedMeshesIds.length > 0) {
                for (var excludedIndex = 0; excludedIndex < light_2._excludedMeshesIds.length; excludedIndex++) {
                    var excludedMesh = scene.getMeshByID(light_2._excludedMeshesIds[excludedIndex]);
                    if (excludedMesh) {
                        light_2.excludedMeshes.push(excludedMesh);
                    }
                }
                light_2._excludedMeshesIds = [];
            }
            // Included check
            if (light_2._includedOnlyMeshesIds.length > 0) {
                for (var includedOnlyIndex = 0; includedOnlyIndex < light_2._includedOnlyMeshesIds.length; includedOnlyIndex++) {
                    var includedOnlyMesh = scene.getMeshByID(light_2._includedOnlyMeshesIds[includedOnlyIndex]);
                    if (includedOnlyMesh) {
                        light_2.includedOnlyMeshes.push(includedOnlyMesh);
                    }
                }
                light_2._includedOnlyMeshesIds = [];
            }
        }
        AbstractScene.Parse(parsedData, scene, container, rootUrl);
        // Actions (scene) Done last as it can access other objects.
        for (index = 0, cache = scene.meshes.length; index < cache; index++) {
            var mesh = scene.meshes[index];
            if (mesh._waitingData.actions) {
                ActionManager.Parse(mesh._waitingData.actions, mesh, scene);
                mesh._waitingData.actions = null;
            }
        }
        if (parsedData.actions !== undefined && parsedData.actions !== null) {
            ActionManager.Parse(parsedData.actions, null, scene);
        }
    }
    catch (err) {
        var msg = logOperation("loadAssets", parsedData ? parsedData.producer : "Unknown") + log;
        if (onError) {
            onError(msg, err);
        }
        else {
            Logger.Log(msg);
            throw err;
        }
    }
    finally {
        if (!addToScene) {
            container.removeAllFromScene();
        }
        if (log !== null && SceneLoader.loggingLevel !== SceneLoader.NO_LOGGING) {
            Logger.Log(logOperation("loadAssets", parsedData ? parsedData.producer : "Unknown") + (SceneLoader.loggingLevel !== SceneLoader.MINIMAL_LOGGING ? log : ""));
        }
    }
    return container;
};
SceneLoader.RegisterPlugin({
    name: "babylon.js",
    extensions: ".babylon",
    canDirectLoad: function (data) {
        if (data.indexOf("babylon") !== -1) { // We consider that the producer string is filled
            return true;
        }
        return false;
    },
    importMesh: function (meshesNames, scene, data, rootUrl, meshes, particleSystems, skeletons, onError) {
        // Entire method running in try block, so ALWAYS logs as far as it got, only actually writes details
        // when SceneLoader.debugLogging = true (default), or exception encountered.
        // Everything stored in var log instead of writing separate lines to support only writing in exception,
        // and avoid problems with multiple concurrent .babylon loads.
        var log = "importMesh has failed JSON parse";
        try {
            var parsedData = JSON.parse(data);
            log = "";
            var fullDetails = SceneLoader.loggingLevel === SceneLoader.DETAILED_LOGGING;
            if (!meshesNames) {
                meshesNames = null;
            }
            else if (!Array.isArray(meshesNames)) {
                meshesNames = [meshesNames];
            }
            var hierarchyIds = new Array();
            if (parsedData.meshes !== undefined && parsedData.meshes !== null) {
                var loadedSkeletonsIds = [];
                var loadedMaterialsIds = [];
                var index;
                var cache;
                for (index = 0, cache = parsedData.meshes.length; index < cache; index++) {
                    var parsedMesh = parsedData.meshes[index];
                    if (meshesNames === null || isDescendantOf(parsedMesh, meshesNames, hierarchyIds)) {
                        if (meshesNames !== null) {
                            // Remove found mesh name from list.
                            delete meshesNames[meshesNames.indexOf(parsedMesh.name)];
                        }
                        //Geometry?
                        if (parsedMesh.geometryId !== undefined && parsedMesh.geometryId !== null) {
                            //does the file contain geometries?
                            if (parsedData.geometries !== undefined && parsedData.geometries !== null) {
                                //find the correct geometry and add it to the scene
                                var found = false;
                                ["boxes", "spheres", "cylinders", "toruses", "grounds", "planes", "torusKnots", "vertexData"].forEach(function (geometryType) {
                                    if (found === true || !parsedData.geometries[geometryType] || !(Array.isArray(parsedData.geometries[geometryType]))) {
                                        return;
                                    }
                                    else {
                                        parsedData.geometries[geometryType].forEach(function (parsedGeometryData) {
                                            if (parsedGeometryData.id === parsedMesh.geometryId) {
                                                switch (geometryType) {
                                                    case "vertexData":
                                                        Geometry.Parse(parsedGeometryData, scene, rootUrl);
                                                        break;
                                                }
                                                found = true;
                                            }
                                        });
                                    }
                                });
                                if (found === false) {
                                    Logger.Warn("Geometry not found for mesh " + parsedMesh.id);
                                }
                            }
                        }
                        // Material ?
                        if (parsedMesh.materialId) {
                            var materialFound = (loadedMaterialsIds.indexOf(parsedMesh.materialId) !== -1);
                            if (materialFound === false && parsedData.multiMaterials !== undefined && parsedData.multiMaterials !== null) {
                                for (var multimatIndex = 0, multimatCache = parsedData.multiMaterials.length; multimatIndex < multimatCache; multimatIndex++) {
                                    var parsedMultiMaterial = parsedData.multiMaterials[multimatIndex];
                                    if (parsedMultiMaterial.id === parsedMesh.materialId) {
                                        for (var matIndex = 0, matCache = parsedMultiMaterial.materials.length; matIndex < matCache; matIndex++) {
                                            var subMatId = parsedMultiMaterial.materials[matIndex];
                                            loadedMaterialsIds.push(subMatId);
                                            var mat = parseMaterialById(subMatId, parsedData, scene, rootUrl);
                                            if (mat) {
                                                log += "\n\tMaterial " + mat.toString(fullDetails);
                                            }
                                        }
                                        loadedMaterialsIds.push(parsedMultiMaterial.id);
                                        var mmat = MultiMaterial.ParseMultiMaterial(parsedMultiMaterial, scene);
                                        if (mmat) {
                                            materialFound = true;
                                            log += "\n\tMulti-Material " + mmat.toString(fullDetails);
                                        }
                                        break;
                                    }
                                }
                            }
                            if (materialFound === false) {
                                loadedMaterialsIds.push(parsedMesh.materialId);
                                var mat = parseMaterialById(parsedMesh.materialId, parsedData, scene, rootUrl);
                                if (!mat) {
                                    Logger.Warn("Material not found for mesh " + parsedMesh.id);
                                }
                                else {
                                    log += "\n\tMaterial " + mat.toString(fullDetails);
                                }
                            }
                        }
                        // Skeleton ?
                        if (parsedMesh.skeletonId > -1 && parsedData.skeletons !== undefined && parsedData.skeletons !== null) {
                            var skeletonAlreadyLoaded = (loadedSkeletonsIds.indexOf(parsedMesh.skeletonId) > -1);
                            if (skeletonAlreadyLoaded === false) {
                                for (var skeletonIndex = 0, skeletonCache = parsedData.skeletons.length; skeletonIndex < skeletonCache; skeletonIndex++) {
                                    var parsedSkeleton = parsedData.skeletons[skeletonIndex];
                                    if (parsedSkeleton.id === parsedMesh.skeletonId) {
                                        var skeleton = Skeleton.Parse(parsedSkeleton, scene);
                                        skeletons.push(skeleton);
                                        loadedSkeletonsIds.push(parsedSkeleton.id);
                                        log += "\n\tSkeleton " + skeleton.toString(fullDetails);
                                    }
                                }
                            }
                        }
                        // Morph targets ?
                        if (parsedData.morphTargetManagers !== undefined && parsedData.morphTargetManagers !== null) {
                            for (var _i = 0, _a = parsedData.morphTargetManagers; _i < _a.length; _i++) {
                                var managerData = _a[_i];
                                MorphTargetManager.Parse(managerData, scene);
                            }
                        }
                        var mesh = Mesh.Parse(parsedMesh, scene, rootUrl);
                        meshes.push(mesh);
                        log += "\n\tMesh " + mesh.toString(fullDetails);
                    }
                }
                // Connecting parents and lods
                var currentMesh;
                for (index = 0, cache = scene.meshes.length; index < cache; index++) {
                    currentMesh = scene.meshes[index];
                    if (currentMesh._waitingParentId) {
                        currentMesh.parent = scene.getLastEntryByID(currentMesh._waitingParentId);
                        currentMesh._waitingParentId = null;
                    }
                    if (currentMesh._waitingData.lods) {
                        loadDetailLevels(scene, currentMesh);
                    }
                }
                // link skeleton transform nodes
                for (index = 0, cache = scene.skeletons.length; index < cache; index++) {
                    var skeleton = scene.skeletons[index];
                    if (skeleton._hasWaitingData) {
                        if (skeleton.bones != null) {
                            skeleton.bones.forEach(function (bone) {
                                if (bone._waitingTransformNodeId) {
                                    var linkTransformNode = scene.getLastEntryByID(bone._waitingTransformNodeId);
                                    if (linkTransformNode) {
                                        bone.linkTransformNode(linkTransformNode);
                                    }
                                    bone._waitingTransformNodeId = null;
                                }
                            });
                        }
                        if (skeleton._waitingOverrideMeshId) {
                            skeleton.overrideMesh = scene.getMeshByID(skeleton._waitingOverrideMeshId);
                            skeleton._waitingOverrideMeshId = null;
                        }
                        skeleton._hasWaitingData = null;
                    }
                }
                // freeze and compute world matrix application
                for (index = 0, cache = scene.meshes.length; index < cache; index++) {
                    currentMesh = scene.meshes[index];
                    if (currentMesh._waitingData.freezeWorldMatrix) {
                        currentMesh.freezeWorldMatrix();
                        currentMesh._waitingData.freezeWorldMatrix = null;
                    }
                    else {
                        currentMesh.computeWorldMatrix(true);
                    }
                }
            }
            // Particles
            if (parsedData.particleSystems !== undefined && parsedData.particleSystems !== null) {
                var parser = AbstractScene.GetIndividualParser(SceneComponentConstants.NAME_PARTICLESYSTEM);
                if (parser) {
                    for (index = 0, cache = parsedData.particleSystems.length; index < cache; index++) {
                        var parsedParticleSystem = parsedData.particleSystems[index];
                        if (hierarchyIds.indexOf(parsedParticleSystem.emitterId) !== -1) {
                            particleSystems.push(parser(parsedParticleSystem, scene, rootUrl));
                        }
                    }
                }
            }
            return true;
        }
        catch (err) {
            var msg = logOperation("importMesh", parsedData ? parsedData.producer : "Unknown") + log;
            if (onError) {
                onError(msg, err);
            }
            else {
                Logger.Log(msg);
                throw err;
            }
        }
        finally {
            if (log !== null && SceneLoader.loggingLevel !== SceneLoader.NO_LOGGING) {
                Logger.Log(logOperation("importMesh", parsedData ? parsedData.producer : "Unknown") + (SceneLoader.loggingLevel !== SceneLoader.MINIMAL_LOGGING ? log : ""));
            }
        }
        return false;
    },
    load: function (scene, data, rootUrl, onError) {
        // Entire method running in try block, so ALWAYS logs as far as it got, only actually writes details
        // when SceneLoader.debugLogging = true (default), or exception encountered.
        // Everything stored in var log instead of writing separate lines to support only writing in exception,
        // and avoid problems with multiple concurrent .babylon loads.
        var log = "importScene has failed JSON parse";
        try {
            var parsedData = JSON.parse(data);
            log = "";
            // Scene
            if (parsedData.useDelayedTextureLoading !== undefined && parsedData.useDelayedTextureLoading !== null) {
                scene.useDelayedTextureLoading = parsedData.useDelayedTextureLoading && !SceneLoader.ForceFullSceneLoadingForIncremental;
            }
            if (parsedData.autoClear !== undefined && parsedData.autoClear !== null) {
                scene.autoClear = parsedData.autoClear;
            }
            if (parsedData.clearColor !== undefined && parsedData.clearColor !== null) {
                scene.clearColor = Color4.FromArray(parsedData.clearColor);
            }
            if (parsedData.ambientColor !== undefined && parsedData.ambientColor !== null) {
                scene.ambientColor = Color3.FromArray(parsedData.ambientColor);
            }
            if (parsedData.gravity !== undefined && parsedData.gravity !== null) {
                scene.gravity = Vector3.FromArray(parsedData.gravity);
            }
            // Fog
            if (parsedData.fogMode && parsedData.fogMode !== 0) {
                scene.fogMode = parsedData.fogMode;
                scene.fogColor = Color3.FromArray(parsedData.fogColor);
                scene.fogStart = parsedData.fogStart;
                scene.fogEnd = parsedData.fogEnd;
                scene.fogDensity = parsedData.fogDensity;
                log += "\tFog mode for scene:  ";
                switch (scene.fogMode) {
                    // getters not compiling, so using hardcoded
                    case 1:
                        log += "exp\n";
                        break;
                    case 2:
                        log += "exp2\n";
                        break;
                    case 3:
                        log += "linear\n";
                        break;
                }
            }
            //Physics
            if (parsedData.physicsEnabled) {
                var physicsPlugin;
                if (parsedData.physicsEngine === "cannon") {
                    physicsPlugin = new CannonJSPlugin(undefined, undefined, BabylonFileLoaderConfiguration.LoaderInjectedPhysicsEngine);
                }
                else if (parsedData.physicsEngine === "oimo") {
                    physicsPlugin = new OimoJSPlugin(undefined, BabylonFileLoaderConfiguration.LoaderInjectedPhysicsEngine);
                }
                else if (parsedData.physicsEngine === "ammo") {
                    physicsPlugin = new AmmoJSPlugin(undefined, BabylonFileLoaderConfiguration.LoaderInjectedPhysicsEngine, undefined);
                }
                log = "\tPhysics engine " + (parsedData.physicsEngine ? parsedData.physicsEngine : "oimo") + " enabled\n";
                //else - default engine, which is currently oimo
                var physicsGravity = parsedData.physicsGravity ? Vector3.FromArray(parsedData.physicsGravity) : null;
                scene.enablePhysics(physicsGravity, physicsPlugin);
            }
            // Metadata
            if (parsedData.metadata !== undefined && parsedData.metadata !== null) {
                scene.metadata = parsedData.metadata;
            }
            //collisions, if defined. otherwise, default is true
            if (parsedData.collisionsEnabled !== undefined && parsedData.collisionsEnabled !== null) {
                scene.collisionsEnabled = parsedData.collisionsEnabled;
            }
            var container = loadAssetContainer(scene, data, rootUrl, onError, true);
            if (!container) {
                return false;
            }
            if (parsedData.autoAnimate) {
                scene.beginAnimation(scene, parsedData.autoAnimateFrom, parsedData.autoAnimateTo, parsedData.autoAnimateLoop, parsedData.autoAnimateSpeed || 1.0);
            }
            if (parsedData.activeCameraID !== undefined && parsedData.activeCameraID !== null) {
                scene.setActiveCameraByID(parsedData.activeCameraID);
            }
            // Finish
            return true;
        }
        catch (err) {
            var msg = logOperation("importScene", parsedData ? parsedData.producer : "Unknown") + log;
            if (onError) {
                onError(msg, err);
            }
            else {
                Logger.Log(msg);
                throw err;
            }
        }
        finally {
            if (log !== null && SceneLoader.loggingLevel !== SceneLoader.NO_LOGGING) {
                Logger.Log(logOperation("importScene", parsedData ? parsedData.producer : "Unknown") + (SceneLoader.loggingLevel !== SceneLoader.MINIMAL_LOGGING ? log : ""));
            }
        }
        return false;
    },
    loadAssetContainer: function (scene, data, rootUrl, onError) {
        var container = loadAssetContainer(scene, data, rootUrl, onError);
        return container;
    }
});

export { Action as A, BabylonFileLoaderConfiguration as B, Condition as C, DoNothingAction as D, ExecuteCodeAction as E, HDRCubeTexture as H, IncrementValueAction as I, OimoJSPlugin as O, PanoramaToCubeMapTools as P, ReflectionProbe as R, StateCondition as S, ValueCondition as V, _BabylonLoaderRegistered as _, ActionManager as a, PredicateCondition as b, SwitchBooleanAction as c, SetStateAction as d, SetValueAction as e, PlayAnimationAction as f, StopAnimationAction as g, CombineAction as h, SetParentAction as i, HDRFiltering as j, EffectRenderer as k, EffectWrapper as l, CannonJSPlugin as m, HDRTools as n };
