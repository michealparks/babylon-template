import { f as Effect, I as InternalTexture, L as Logger, e as InternalTextureSource } from './thinEngine-e576a091.js';
import { S as Scalar, V as Vector3 } from './math.color-fc6e801e.js';
import './engine-9a1b5aa7.js';
import { T as Tools } from './tools-ab6f1dea.js';
import { S as Scene } from './scene-cbeb8ae2.js';
import { B as BaseTexture } from './baseTexture-827d5047.js';
import { S as SphericalPolynomial } from './baseTexture.polynomial-54f1194f.js';
import { P as PostProcess } from './postProcess-3bcb67b3.js';
import './helperFunctions-f4fc40e0.js';

var name = 'rgbdEncodePixelShader';
var shader = "\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n#include<helperFunctions>\nvoid main(void)\n{\ngl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);\n}";
Effect.ShadersStore[name] = shader;

var name$1 = 'rgbdDecodePixelShader';
var shader$1 = "\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n#include<helperFunctions>\nvoid main(void)\n{\ngl_FragColor=vec4(fromRGBD(texture2D(textureSampler,vUV)),1.0);\n}";
Effect.ShadersStore[name$1] = shader$1;

/**
 * Sets of helpers addressing the serialization and deserialization of environment texture
 * stored in a BabylonJS env file.
 * Those files are usually stored as .env files.
 */
var EnvironmentTextureTools = /** @class */ (function () {
    function EnvironmentTextureTools() {
    }
    /**
     * Gets the environment info from an env file.
     * @param data The array buffer containing the .env bytes.
     * @returns the environment file info (the json header) if successfully parsed.
     */
    EnvironmentTextureTools.GetEnvInfo = function (data) {
        var dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
        var pos = 0;
        for (var i = 0; i < EnvironmentTextureTools._MagicBytes.length; i++) {
            if (dataView.getUint8(pos++) !== EnvironmentTextureTools._MagicBytes[i]) {
                Logger.Error('Not a babylon environment map');
                return null;
            }
        }
        // Read json manifest - collect characters up to null terminator
        var manifestString = '';
        var charCode = 0x00;
        while ((charCode = dataView.getUint8(pos++))) {
            manifestString += String.fromCharCode(charCode);
        }
        var manifest = JSON.parse(manifestString);
        if (manifest.specular) {
            // Extend the header with the position of the payload.
            manifest.specular.specularDataPosition = pos;
            // Fallback to 0.8 exactly if lodGenerationScale is not defined for backward compatibility.
            manifest.specular.lodGenerationScale = manifest.specular.lodGenerationScale || 0.8;
        }
        return manifest;
    };
    /**
     * Creates an environment texture from a loaded cube texture.
     * @param texture defines the cube texture to convert in env file
     * @return a promise containing the environment data if succesfull.
     */
    EnvironmentTextureTools.CreateEnvTextureAsync = function (texture) {
        var _this = this;
        var internalTexture = texture.getInternalTexture();
        if (!internalTexture) {
            return Promise.reject("The cube texture is invalid.");
        }
        var engine = internalTexture.getEngine();
        if (engine && engine.premultipliedAlpha) {
            return Promise.reject("Env texture can only be created when the engine is created with the premultipliedAlpha option set to false.");
        }
        if (texture.textureType === 0) {
            return Promise.reject("The cube texture should allow HDR (Full Float or Half Float).");
        }
        var canvas = engine.getRenderingCanvas();
        if (!canvas) {
            return Promise.reject("Env texture can only be created when the engine is associated to a canvas.");
        }
        var textureType = 1;
        if (!engine.getCaps().textureFloatRender) {
            textureType = 2;
            if (!engine.getCaps().textureHalfFloatRender) {
                return Promise.reject("Env texture can only be created when the browser supports half float or full float rendering.");
            }
        }
        var cubeWidth = internalTexture.width;
        var hostingScene = new Scene(engine);
        var specularTextures = {};
        var promises = [];
        // Read and collect all mipmaps data from the cube.
        var mipmapsCount = Scalar.Log2(internalTexture.width);
        mipmapsCount = Math.round(mipmapsCount);
        var _loop_1 = function (i) {
            var faceWidth = Math.pow(2, mipmapsCount - i);
            var _loop_2 = function (face) {
                var data = texture.readPixels(face, i);
                // Creates a temp texture with the face data.
                var tempTexture = engine.createRawTexture(data, faceWidth, faceWidth, 5, false, false, 1, null, textureType);
                // And rgbdEncode them.
                var promise = new Promise(function (resolve, reject) {
                    var rgbdPostProcess = new PostProcess("rgbdEncode", "rgbdEncode", null, null, 1, null, 1, engine, false, undefined, 0, undefined, null, false);
                    rgbdPostProcess.getEffect().executeWhenCompiled(function () {
                        rgbdPostProcess.onApply = function (effect) {
                            effect._bindTexture("textureSampler", tempTexture);
                        };
                        // As the process needs to happen on the main canvas, keep track of the current size
                        var currentW = engine.getRenderWidth();
                        var currentH = engine.getRenderHeight();
                        // Set the desired size for the texture
                        engine.setSize(faceWidth, faceWidth);
                        hostingScene.postProcessManager.directRender([rgbdPostProcess], null);
                        // Reading datas from WebGL
                        Tools.ToBlob(canvas, function (blob) {
                            var fileReader = new FileReader();
                            fileReader.onload = function (event) {
                                var arrayBuffer = event.target.result;
                                specularTextures[i * 6 + face] = arrayBuffer;
                                resolve();
                            };
                            fileReader.readAsArrayBuffer(blob);
                        });
                        // Reapply the previous canvas size
                        engine.setSize(currentW, currentH);
                    });
                });
                promises.push(promise);
            };
            // All faces of the cube.
            for (var face = 0; face < 6; face++) {
                _loop_2(face);
            }
        };
        for (var i = 0; i <= mipmapsCount; i++) {
            _loop_1(i);
        }
        // Once all the textures haves been collected as RGBD stored in PNGs
        return Promise.all(promises).then(function () {
            // We can delete the hosting scene keeping track of all the creation objects
            hostingScene.dispose();
            // Creates the json header for the env texture
            var info = {
                version: 1,
                width: cubeWidth,
                irradiance: _this._CreateEnvTextureIrradiance(texture),
                specular: {
                    mipmaps: [],
                    lodGenerationScale: texture.lodGenerationScale
                }
            };
            // Sets the specular image data information
            var position = 0;
            for (var i = 0; i <= mipmapsCount; i++) {
                for (var face = 0; face < 6; face++) {
                    var byteLength = specularTextures[i * 6 + face].byteLength;
                    info.specular.mipmaps.push({
                        length: byteLength,
                        position: position
                    });
                    position += byteLength;
                }
            }
            // Encode the JSON as an array buffer
            var infoString = JSON.stringify(info);
            var infoBuffer = new ArrayBuffer(infoString.length + 1);
            var infoView = new Uint8Array(infoBuffer); // Limited to ascii subset matching unicode.
            for (var i = 0, strLen = infoString.length; i < strLen; i++) {
                infoView[i] = infoString.charCodeAt(i);
            }
            // Ends up with a null terminator for easier parsing
            infoView[infoString.length] = 0x00;
            // Computes the final required size and creates the storage
            var totalSize = EnvironmentTextureTools._MagicBytes.length + position + infoBuffer.byteLength;
            var finalBuffer = new ArrayBuffer(totalSize);
            var finalBufferView = new Uint8Array(finalBuffer);
            var dataView = new DataView(finalBuffer);
            // Copy the magic bytes identifying the file in
            var pos = 0;
            for (var i = 0; i < EnvironmentTextureTools._MagicBytes.length; i++) {
                dataView.setUint8(pos++, EnvironmentTextureTools._MagicBytes[i]);
            }
            // Add the json info
            finalBufferView.set(new Uint8Array(infoBuffer), pos);
            pos += infoBuffer.byteLength;
            // Finally inserts the texture data
            for (var i = 0; i <= mipmapsCount; i++) {
                for (var face = 0; face < 6; face++) {
                    var dataBuffer = specularTextures[i * 6 + face];
                    finalBufferView.set(new Uint8Array(dataBuffer), pos);
                    pos += dataBuffer.byteLength;
                }
            }
            // Voila
            return finalBuffer;
        });
    };
    /**
     * Creates a JSON representation of the spherical data.
     * @param texture defines the texture containing the polynomials
     * @return the JSON representation of the spherical info
     */
    EnvironmentTextureTools._CreateEnvTextureIrradiance = function (texture) {
        var polynmials = texture.sphericalPolynomial;
        if (polynmials == null) {
            return null;
        }
        return {
            x: [polynmials.x.x, polynmials.x.y, polynmials.x.z],
            y: [polynmials.y.x, polynmials.y.y, polynmials.y.z],
            z: [polynmials.z.x, polynmials.z.y, polynmials.z.z],
            xx: [polynmials.xx.x, polynmials.xx.y, polynmials.xx.z],
            yy: [polynmials.yy.x, polynmials.yy.y, polynmials.yy.z],
            zz: [polynmials.zz.x, polynmials.zz.y, polynmials.zz.z],
            yz: [polynmials.yz.x, polynmials.yz.y, polynmials.yz.z],
            zx: [polynmials.zx.x, polynmials.zx.y, polynmials.zx.z],
            xy: [polynmials.xy.x, polynmials.xy.y, polynmials.xy.z]
        };
    };
    /**
     * Creates the ArrayBufferViews used for initializing environment texture image data.
     * @param data the image data
     * @param info parameters that determine what views will be created for accessing the underlying buffer
     * @return the views described by info providing access to the underlying buffer
     */
    EnvironmentTextureTools.CreateImageDataArrayBufferViews = function (data, info) {
        if (info.version !== 1) {
            throw new Error("Unsupported babylon environment map version \"" + info.version + "\"");
        }
        var specularInfo = info.specular;
        // Double checks the enclosed info
        var mipmapsCount = Scalar.Log2(info.width);
        mipmapsCount = Math.round(mipmapsCount) + 1;
        if (specularInfo.mipmaps.length !== 6 * mipmapsCount) {
            throw new Error("Unsupported specular mipmaps number \"" + specularInfo.mipmaps.length + "\"");
        }
        var imageData = new Array(mipmapsCount);
        for (var i = 0; i < mipmapsCount; i++) {
            imageData[i] = new Array(6);
            for (var face = 0; face < 6; face++) {
                var imageInfo = specularInfo.mipmaps[i * 6 + face];
                imageData[i][face] = new Uint8Array(data.buffer, data.byteOffset + specularInfo.specularDataPosition + imageInfo.position, imageInfo.length);
            }
        }
        return imageData;
    };
    /**
     * Uploads the texture info contained in the env file to the GPU.
     * @param texture defines the internal texture to upload to
     * @param data defines the data to load
     * @param info defines the texture info retrieved through the GetEnvInfo method
     * @returns a promise
     */
    EnvironmentTextureTools.UploadEnvLevelsAsync = function (texture, data, info) {
        if (info.version !== 1) {
            throw new Error("Unsupported babylon environment map version \"" + info.version + "\"");
        }
        var specularInfo = info.specular;
        if (!specularInfo) {
            // Nothing else parsed so far
            return Promise.resolve();
        }
        texture._lodGenerationScale = specularInfo.lodGenerationScale;
        var imageData = EnvironmentTextureTools.CreateImageDataArrayBufferViews(data, info);
        return EnvironmentTextureTools.UploadLevelsAsync(texture, imageData);
    };
    EnvironmentTextureTools._OnImageReadyAsync = function (image, engine, expandTexture, rgbdPostProcess, url, face, i, generateNonLODTextures, lodTextures, cubeRtt, texture) {
        return new Promise(function (resolve, reject) {
            if (expandTexture) {
                var tempTexture_1 = engine.createTexture(null, true, true, null, 1, null, function (message) {
                    reject(message);
                }, image);
                rgbdPostProcess.getEffect().executeWhenCompiled(function () {
                    // Uncompress the data to a RTT
                    rgbdPostProcess.onApply = function (effect) {
                        effect._bindTexture("textureSampler", tempTexture_1);
                        effect.setFloat2("scale", 1, 1);
                    };
                    engine.scenes[0].postProcessManager.directRender([rgbdPostProcess], cubeRtt, true, face, i);
                    // Cleanup
                    engine.restoreDefaultFramebuffer();
                    tempTexture_1.dispose();
                    URL.revokeObjectURL(url);
                    resolve();
                });
            }
            else {
                engine._uploadImageToTexture(texture, image, face, i);
                // Upload the face to the non lod texture support
                if (generateNonLODTextures) {
                    var lodTexture = lodTextures[i];
                    if (lodTexture) {
                        engine._uploadImageToTexture(lodTexture._texture, image, face, 0);
                    }
                }
                resolve();
            }
        });
    };
    /**
     * Uploads the levels of image data to the GPU.
     * @param texture defines the internal texture to upload to
     * @param imageData defines the array buffer views of image data [mipmap][face]
     * @returns a promise
     */
    EnvironmentTextureTools.UploadLevelsAsync = function (texture, imageData) {
        var _this = this;
        if (!Tools.IsExponentOfTwo(texture.width)) {
            throw new Error("Texture size must be a power of two");
        }
        var mipmapsCount = Math.round(Scalar.Log2(texture.width)) + 1;
        // Gets everything ready.
        var engine = texture.getEngine();
        var expandTexture = false;
        var generateNonLODTextures = false;
        var rgbdPostProcess = null;
        var cubeRtt = null;
        var lodTextures = null;
        var caps = engine.getCaps();
        texture.format = 5;
        texture.type = 0;
        texture.generateMipMaps = true;
        texture._cachedAnisotropicFilteringLevel = null;
        engine.updateTextureSamplingMode(3, texture);
        // Add extra process if texture lod is not supported
        if (!caps.textureLOD) {
            expandTexture = false;
            generateNonLODTextures = true;
            lodTextures = {};
        }
        // in webgl 1 there are no ways to either render or copy lod level information for float textures.
        else if (engine.webGLVersion < 2) {
            expandTexture = false;
        }
        // If half float available we can uncompress the texture
        else if (caps.textureHalfFloatRender && caps.textureHalfFloatLinearFiltering) {
            expandTexture = true;
            texture.type = 2;
        }
        // If full float available we can uncompress the texture
        else if (caps.textureFloatRender && caps.textureFloatLinearFiltering) {
            expandTexture = true;
            texture.type = 1;
        }
        // Expand the texture if possible
        if (expandTexture) {
            // Simply run through the decode PP
            rgbdPostProcess = new PostProcess("rgbdDecode", "rgbdDecode", null, null, 1, null, 3, engine, false, undefined, texture.type, undefined, null, false);
            texture._isRGBD = false;
            texture.invertY = false;
            cubeRtt = engine.createRenderTargetCubeTexture(texture.width, {
                generateDepthBuffer: false,
                generateMipMaps: true,
                generateStencilBuffer: false,
                samplingMode: 3,
                type: texture.type,
                format: 5
            });
        }
        else {
            texture._isRGBD = true;
            texture.invertY = true;
            // In case of missing support, applies the same patch than DDS files.
            if (generateNonLODTextures) {
                var mipSlices = 3;
                var scale = texture._lodGenerationScale;
                var offset = texture._lodGenerationOffset;
                for (var i = 0; i < mipSlices; i++) {
                    //compute LOD from even spacing in smoothness (matching shader calculation)
                    var smoothness = i / (mipSlices - 1);
                    var roughness = 1 - smoothness;
                    var minLODIndex = offset; // roughness = 0
                    var maxLODIndex = (mipmapsCount - 1) * scale + offset; // roughness = 1 (mipmaps start from 0)
                    var lodIndex = minLODIndex + (maxLODIndex - minLODIndex) * roughness;
                    var mipmapIndex = Math.round(Math.min(Math.max(lodIndex, 0), maxLODIndex));
                    var glTextureFromLod = new InternalTexture(engine, InternalTextureSource.Temp);
                    glTextureFromLod.isCube = true;
                    glTextureFromLod.invertY = true;
                    glTextureFromLod.generateMipMaps = false;
                    engine.updateTextureSamplingMode(2, glTextureFromLod);
                    // Wrap in a base texture for easy binding.
                    var lodTexture = new BaseTexture(null);
                    lodTexture.isCube = true;
                    lodTexture._texture = glTextureFromLod;
                    lodTextures[mipmapIndex] = lodTexture;
                    switch (i) {
                        case 0:
                            texture._lodTextureLow = lodTexture;
                            break;
                        case 1:
                            texture._lodTextureMid = lodTexture;
                            break;
                        case 2:
                            texture._lodTextureHigh = lodTexture;
                            break;
                    }
                }
            }
        }
        var promises = [];
        var _loop_3 = function (i) {
            var _loop_4 = function (face) {
                // Constructs an image element from image data
                var bytes = imageData[i][face];
                var blob = new Blob([bytes], { type: 'image/png' });
                var url = URL.createObjectURL(blob);
                var promise = void 0;
                if (typeof Image === "undefined") {
                    promise = createImageBitmap(blob).then(function (img) {
                        return _this._OnImageReadyAsync(img, engine, expandTexture, rgbdPostProcess, url, face, i, generateNonLODTextures, lodTextures, cubeRtt, texture);
                    });
                }
                else {
                    var image_1 = new Image();
                    image_1.src = url;
                    // Enqueue promise to upload to the texture.
                    promise = new Promise(function (resolve, reject) {
                        image_1.onload = function () {
                            _this._OnImageReadyAsync(image_1, engine, expandTexture, rgbdPostProcess, url, face, i, generateNonLODTextures, lodTextures, cubeRtt, texture)
                                .then(function () { return resolve(); })
                                .catch(function (reason) {
                                reject(reason);
                            });
                        };
                        image_1.onerror = function (error) {
                            reject(error);
                        };
                    });
                }
                promises.push(promise);
            };
            // All faces
            for (var face = 0; face < 6; face++) {
                _loop_4(face);
            }
        };
        // All mipmaps up to provided number of images
        for (var i = 0; i < imageData.length; i++) {
            _loop_3(i);
        }
        // Fill remaining mipmaps with black textures.
        if (imageData.length < mipmapsCount) {
            var data = void 0;
            var size = Math.pow(2, mipmapsCount - 1 - imageData.length);
            var dataLength = size * size * 4;
            switch (texture.type) {
                case 0: {
                    data = new Uint8Array(dataLength);
                    break;
                }
                case 2: {
                    data = new Uint16Array(dataLength);
                    break;
                }
                case 1: {
                    data = new Float32Array(dataLength);
                    break;
                }
            }
            for (var i = imageData.length; i < mipmapsCount; i++) {
                for (var face = 0; face < 6; face++) {
                    engine._uploadArrayBufferViewToTexture(texture, data, face, i);
                }
            }
        }
        // Once all done, finishes the cleanup and return
        return Promise.all(promises).then(function () {
            // Release temp RTT.
            if (cubeRtt) {
                engine._releaseFramebufferObjects(cubeRtt);
                engine._releaseTexture(texture);
                cubeRtt._swapAndDie(texture);
            }
            // Release temp Post Process.
            if (rgbdPostProcess) {
                rgbdPostProcess.dispose();
            }
            // Flag internal texture as ready in case they are in use.
            if (generateNonLODTextures) {
                if (texture._lodTextureHigh && texture._lodTextureHigh._texture) {
                    texture._lodTextureHigh._texture.isReady = true;
                }
                if (texture._lodTextureMid && texture._lodTextureMid._texture) {
                    texture._lodTextureMid._texture.isReady = true;
                }
                if (texture._lodTextureLow && texture._lodTextureLow._texture) {
                    texture._lodTextureLow._texture.isReady = true;
                }
            }
        });
    };
    /**
     * Uploads spherical polynomials information to the texture.
     * @param texture defines the texture we are trying to upload the information to
     * @param info defines the environment texture info retrieved through the GetEnvInfo method
     */
    EnvironmentTextureTools.UploadEnvSpherical = function (texture, info) {
        if (info.version !== 1) {
            Logger.Warn('Unsupported babylon environment map version "' + info.version + '"');
        }
        var irradianceInfo = info.irradiance;
        if (!irradianceInfo) {
            return;
        }
        var sp = new SphericalPolynomial();
        Vector3.FromArrayToRef(irradianceInfo.x, 0, sp.x);
        Vector3.FromArrayToRef(irradianceInfo.y, 0, sp.y);
        Vector3.FromArrayToRef(irradianceInfo.z, 0, sp.z);
        Vector3.FromArrayToRef(irradianceInfo.xx, 0, sp.xx);
        Vector3.FromArrayToRef(irradianceInfo.yy, 0, sp.yy);
        Vector3.FromArrayToRef(irradianceInfo.zz, 0, sp.zz);
        Vector3.FromArrayToRef(irradianceInfo.yz, 0, sp.yz);
        Vector3.FromArrayToRef(irradianceInfo.zx, 0, sp.zx);
        Vector3.FromArrayToRef(irradianceInfo.xy, 0, sp.xy);
        texture._sphericalPolynomial = sp;
    };
    /** @hidden */
    EnvironmentTextureTools._UpdateRGBDAsync = function (internalTexture, data, sphericalPolynomial, lodScale, lodOffset) {
        internalTexture._source = InternalTextureSource.CubeRawRGBD;
        internalTexture._bufferViewArrayArray = data;
        internalTexture._lodGenerationScale = lodScale;
        internalTexture._lodGenerationOffset = lodOffset;
        internalTexture._sphericalPolynomial = sphericalPolynomial;
        return EnvironmentTextureTools.UploadLevelsAsync(internalTexture, data).then(function () {
            internalTexture.isReady = true;
        });
    };
    /**
     * Magic number identifying the env file.
     */
    EnvironmentTextureTools._MagicBytes = [0x86, 0x16, 0x87, 0x96, 0xf6, 0xd6, 0x96, 0x36];
    return EnvironmentTextureTools;
}());
// References the dependencies.
InternalTexture._UpdateRGBDAsync = EnvironmentTextureTools._UpdateRGBDAsync;

export { EnvironmentTextureTools as E };
