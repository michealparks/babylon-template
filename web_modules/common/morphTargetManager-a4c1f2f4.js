import { T as ThinEngine, I as InternalTexture, e as InternalTextureSource, L as Logger, d as __assign, _ as __extends, S as StringTools, a as __decorate, O as Observable, f as Effect, E as EngineStore } from './thinEngine-e576a091.js';
import { S as SerializationHelper, a as serialize, i as serializeAsMatrix, N as Node } from './node-87d9c658.js';
import { M as Matrix, V as Vector3, _ as _TypeStore, S as Scalar, Q as Quaternion, a as Vector2, b as Color3, C as Color4, T as TmpVectors, A as ArrayTools } from './math.color-fc6e801e.js';
import { P as PrecisionDate, E as Engine } from './engine-9a1b5aa7.js';
import { S as SmartArray } from './pointerEvents-12a2451c.js';
import { T as Tools, D as DeepCopier } from './tools-ab6f1dea.js';
import { F as FileTools, W as WebRequest, a as FilesInputStore } from './guid-495ff9c7.js';
import { S as Space } from './math.axis-e7db27a6.js';
import { S as Scene, A as AbstractScene } from './scene-cbeb8ae2.js';
import { V as VertexBuffer } from './sceneComponent-5502b64a.js';
import { S as Size } from './math.size-6398c1e8.js';
import { B as BaseTexture } from './baseTexture-827d5047.js';
import { T as Texture } from './texture-6b1db4fe.js';
import { S as SceneLoaderFlags, M as Mesh } from './mesh-cfdd36e7.js';

ThinEngine.prototype._createDepthStencilCubeTexture = function (size, options) {
    var internalTexture = new InternalTexture(this, InternalTextureSource.Unknown);
    internalTexture.isCube = true;
    if (this.webGLVersion === 1) {
        Logger.Error("Depth cube texture is not supported by WebGL 1.");
        return internalTexture;
    }
    var internalOptions = __assign({ bilinearFiltering: false, comparisonFunction: 0, generateStencil: false }, options);
    var gl = this._gl;
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, internalTexture, true);
    this._setupDepthStencilTexture(internalTexture, size, internalOptions.generateStencil, internalOptions.bilinearFiltering, internalOptions.comparisonFunction);
    // Create the depth/stencil buffer
    for (var face = 0; face < 6; face++) {
        if (internalOptions.generateStencil) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, gl.DEPTH24_STENCIL8, size, size, 0, gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8, null);
        }
        else {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, gl.DEPTH_COMPONENT24, size, size, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        }
    }
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
    return internalTexture;
};
ThinEngine.prototype._partialLoadFile = function (url, index, loadedFiles, onfinish, onErrorCallBack) {
    if (onErrorCallBack === void 0) { onErrorCallBack = null; }
    var onload = function (data) {
        loadedFiles[index] = data;
        loadedFiles._internalCount++;
        if (loadedFiles._internalCount === 6) {
            onfinish(loadedFiles);
        }
    };
    var onerror = function (request, exception) {
        if (onErrorCallBack && request) {
            onErrorCallBack(request.status + " " + request.statusText, exception);
        }
    };
    this._loadFile(url, onload, undefined, undefined, true, onerror);
};
ThinEngine.prototype._cascadeLoadFiles = function (scene, onfinish, files, onError) {
    if (onError === void 0) { onError = null; }
    var loadedFiles = [];
    loadedFiles._internalCount = 0;
    for (var index = 0; index < 6; index++) {
        this._partialLoadFile(files[index], index, loadedFiles, onfinish, onError);
    }
};
ThinEngine.prototype._cascadeLoadImgs = function (scene, onfinish, files, onError, mimeType) {
    if (onError === void 0) { onError = null; }
    var loadedImages = [];
    loadedImages._internalCount = 0;
    for (var index = 0; index < 6; index++) {
        this._partialLoadImg(files[index], index, loadedImages, scene, onfinish, onError, mimeType);
    }
};
ThinEngine.prototype._partialLoadImg = function (url, index, loadedImages, scene, onfinish, onErrorCallBack, mimeType) {
    if (onErrorCallBack === void 0) { onErrorCallBack = null; }
    var img;
    var onload = function () {
        if (img) {
            loadedImages[index] = img;
            loadedImages._internalCount++;
            if (scene) {
                scene._removePendingData(img);
            }
        }
        if (loadedImages._internalCount === 6) {
            onfinish(loadedImages);
        }
    };
    var onerror = function (message, exception) {
        if (scene) {
            scene._removePendingData(img);
        }
        if (onErrorCallBack) {
            onErrorCallBack(message, exception);
        }
    };
    img = FileTools.LoadImage(url, onload, onerror, scene ? scene.offlineProvider : null, mimeType);
    if (scene && img) {
        scene._addPendingData(img);
    }
};
ThinEngine.prototype._setCubeMapTextureParams = function (texture, loadMipmap) {
    var gl = this._gl;
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, loadMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    texture.samplingMode = loadMipmap ? 3 : 2;
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
};
ThinEngine.prototype.createCubeTexture = function (rootUrl, scene, files, noMipmap, onLoad, onError, format, forcedExtension, createPolynomials, lodScale, lodOffset, fallback, loaderOptions) {
    var _this = this;
    if (onLoad === void 0) { onLoad = null; }
    if (onError === void 0) { onError = null; }
    if (forcedExtension === void 0) { forcedExtension = null; }
    if (createPolynomials === void 0) { createPolynomials = false; }
    if (lodScale === void 0) { lodScale = 0; }
    if (lodOffset === void 0) { lodOffset = 0; }
    if (fallback === void 0) { fallback = null; }
    var gl = this._gl;
    var texture = fallback ? fallback : new InternalTexture(this, InternalTextureSource.Cube);
    texture.isCube = true;
    texture.url = rootUrl;
    texture.generateMipMaps = !noMipmap;
    texture._lodGenerationScale = lodScale;
    texture._lodGenerationOffset = lodOffset;
    if (!this._doNotHandleContextLost) {
        texture._extension = forcedExtension;
        texture._files = files;
    }
    var originalRootUrl = rootUrl;
    if (this._transformTextureUrl && !fallback) {
        rootUrl = this._transformTextureUrl(rootUrl);
    }
    var lastDot = rootUrl.lastIndexOf('.');
    var extension = forcedExtension ? forcedExtension : (lastDot > -1 ? rootUrl.substring(lastDot).toLowerCase() : "");
    var loader = null;
    for (var _i = 0, _a = ThinEngine._TextureLoaders; _i < _a.length; _i++) {
        var availableLoader = _a[_i];
        if (availableLoader.canLoad(extension)) {
            loader = availableLoader;
            break;
        }
    }
    var onInternalError = function (request, exception) {
        if (rootUrl === originalRootUrl) {
            if (onError && request) {
                onError(request.status + " " + request.statusText, exception);
            }
        }
        else {
            // fall back to the original url if the transformed url fails to load
            Logger.Warn("Failed to load " + rootUrl + ", falling back to the " + originalRootUrl);
            _this.createCubeTexture(originalRootUrl, scene, files, noMipmap, onLoad, onError, format, forcedExtension, createPolynomials, lodScale, lodOffset, texture, loaderOptions);
        }
    };
    if (loader) {
        var onloaddata_1 = function (data) {
            _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
            loader.loadCubeData(data, texture, createPolynomials, onLoad, onError);
        };
        if (files && files.length === 6) {
            if (loader.supportCascades) {
                this._cascadeLoadFiles(scene, function (images) { return onloaddata_1(images.map(function (image) { return new Uint8Array(image); })); }, files, onError);
            }
            else {
                if (onError) {
                    onError("Textures type does not support cascades.");
                }
                else {
                    Logger.Warn("Texture loader does not support cascades.");
                }
            }
        }
        else {
            this._loadFile(rootUrl, function (data) { return onloaddata_1(new Uint8Array(data)); }, undefined, undefined, true, onInternalError);
        }
    }
    else {
        if (!files) {
            throw new Error("Cannot load cubemap because files were not defined");
        }
        this._cascadeLoadImgs(scene, function (imgs) {
            var width = _this.needPOTTextures ? ThinEngine.GetExponentOfTwo(imgs[0].width, _this._caps.maxCubemapTextureSize) : imgs[0].width;
            var height = width;
            var faces = [
                gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
            ];
            _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
            _this._unpackFlipY(false);
            var internalFormat = format ? _this._getInternalFormat(format) : _this._gl.RGBA;
            for (var index = 0; index < faces.length; index++) {
                if (imgs[index].width !== width || imgs[index].height !== height) {
                    _this._prepareWorkingCanvas();
                    if (!_this._workingCanvas || !_this._workingContext) {
                        Logger.Warn("Cannot create canvas to resize texture.");
                        return;
                    }
                    _this._workingCanvas.width = width;
                    _this._workingCanvas.height = height;
                    _this._workingContext.drawImage(imgs[index], 0, 0, imgs[index].width, imgs[index].height, 0, 0, width, height);
                    gl.texImage2D(faces[index], 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, _this._workingCanvas);
                }
                else {
                    gl.texImage2D(faces[index], 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, imgs[index]);
                }
            }
            if (!noMipmap) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }
            _this._setCubeMapTextureParams(texture, !noMipmap);
            texture.width = width;
            texture.height = height;
            texture.isReady = true;
            if (format) {
                texture.format = format;
            }
            texture.onLoadedObservable.notifyObservers(texture);
            texture.onLoadedObservable.clear();
            if (onLoad) {
                onLoad();
            }
        }, files, onError);
    }
    this._internalTexturesCache.push(texture);
    return texture;
};

/**
 * Class for creating a cube texture
 */
var CubeTexture = /** @class */ (function (_super) {
    __extends(CubeTexture, _super);
    /**
     * Creates a cube texture to use with reflection for instance. It can be based upon dds or six images as well
     * as prefiltered data.
     * @param rootUrl defines the url of the texture or the root name of the six images
     * @param null defines the scene or engine the texture is attached to
     * @param extensions defines the suffixes add to the picture name in case six images are in use like _px.jpg...
     * @param noMipmap defines if mipmaps should be created or not
     * @param files defines the six files to load for the different faces in that order: px, py, pz, nx, ny, nz
     * @param onLoad defines a callback triggered at the end of the file load if no errors occured
     * @param onError defines a callback triggered in case of error during load
     * @param format defines the internal format to use for the texture once loaded
     * @param prefiltered defines whether or not the texture is created from prefiltered data
     * @param forcedExtension defines the extensions to use (force a special type of file to load) in case it is different from the file name
     * @param createPolynomials defines whether or not to create polynomial harmonics from the texture data if necessary
     * @param lodScale defines the scale applied to environment texture. This manages the range of LOD level used for IBL according to the roughness
     * @param lodOffset defines the offset applied to environment texture. This manages first LOD level used for IBL according to the roughness
     * @param loaderOptions options to be passed to the loader
     * @return the cube texture
     */
    function CubeTexture(rootUrl, sceneOrEngine, extensions, noMipmap, files, onLoad, onError, format, prefiltered, forcedExtension, createPolynomials, lodScale, lodOffset, loaderOptions) {
        if (extensions === void 0) { extensions = null; }
        if (noMipmap === void 0) { noMipmap = false; }
        if (files === void 0) { files = null; }
        if (onLoad === void 0) { onLoad = null; }
        if (onError === void 0) { onError = null; }
        if (format === void 0) { format = 5; }
        if (prefiltered === void 0) { prefiltered = false; }
        if (forcedExtension === void 0) { forcedExtension = null; }
        if (createPolynomials === void 0) { createPolynomials = false; }
        if (lodScale === void 0) { lodScale = 0.8; }
        if (lodOffset === void 0) { lodOffset = 0; }
        var _a;
        var _this = _super.call(this, sceneOrEngine) || this;
        /**
         * Observable triggered once the texture has been loaded.
         */
        _this.onLoadObservable = new Observable();
        /**
         * Gets or sets the center of the bounding box associated with the cube texture.
         * It must define where the camera used to render the texture was set
         * @see https://doc.babylonjs.com/how_to/reflect#using-local-cubemap-mode
         */
        _this.boundingBoxPosition = Vector3.Zero();
        _this._rotationY = 0;
        _this._files = null;
        _this._forcedExtension = null;
        _this._extensions = null;
        _this.name = rootUrl;
        _this.url = rootUrl;
        _this._noMipmap = noMipmap;
        _this.hasAlpha = false;
        _this._format = format;
        _this.isCube = true;
        _this._textureMatrix = Matrix.Identity();
        _this._createPolynomials = createPolynomials;
        _this.coordinatesMode = Texture.CUBIC_MODE;
        _this._extensions = extensions;
        _this._files = files;
        _this._forcedExtension = forcedExtension;
        _this._loaderOptions = loaderOptions;
        if (!rootUrl && !files) {
            return _this;
        }
        var lastDot = rootUrl.lastIndexOf(".");
        var extension = forcedExtension ? forcedExtension : (lastDot > -1 ? rootUrl.substring(lastDot).toLowerCase() : "");
        var isDDS = (extension === ".dds");
        var isEnv = (extension === ".env");
        if (isEnv) {
            _this.gammaSpace = false;
            _this._prefiltered = false;
            _this.anisotropicFilteringLevel = 1;
        }
        else {
            _this._prefiltered = prefiltered;
            if (prefiltered) {
                _this.gammaSpace = false;
                _this.anisotropicFilteringLevel = 1;
            }
        }
        _this._texture = _this._getFromCache(rootUrl, noMipmap);
        if (!files) {
            if (!isEnv && !isDDS && !extensions) {
                extensions = ["_px.jpg", "_py.jpg", "_pz.jpg", "_nx.jpg", "_ny.jpg", "_nz.jpg"];
            }
            files = [];
            if (extensions) {
                for (var index = 0; index < extensions.length; index++) {
                    files.push(rootUrl + extensions[index]);
                }
            }
        }
        _this._files = files;
        var onLoadProcessing = function () {
            _this.onLoadObservable.notifyObservers(_this);
            if (onLoad) {
                onLoad();
            }
        };
        if (!_this._texture) {
            var scene = _this.getScene();
            if (!(scene === null || scene === void 0 ? void 0 : scene.useDelayedTextureLoading)) {
                if (prefiltered) {
                    _this._texture = _this._getEngine().createPrefilteredCubeTexture(rootUrl, scene, lodScale, lodOffset, onLoad, onError, format, forcedExtension, _this._createPolynomials);
                }
                else {
                    _this._texture = _this._getEngine().createCubeTexture(rootUrl, scene, files, noMipmap, onLoad, onError, _this._format, forcedExtension, false, lodScale, lodOffset, null, loaderOptions);
                }
                (_a = _this._texture) === null || _a === void 0 ? void 0 : _a.onLoadedObservable.add(function () { return _this.onLoadObservable.notifyObservers(_this); });
            }
            else {
                _this.delayLoadState = 4;
            }
        }
        else {
            if (_this._texture.isReady) {
                Tools.SetImmediate(function () { return onLoadProcessing(); });
            }
            else {
                _this._texture.onLoadedObservable.add(function () { return onLoadProcessing(); });
            }
        }
        return _this;
    }
    Object.defineProperty(CubeTexture.prototype, "boundingBoxSize", {
        /**
         * Returns the bounding box size
         * @see https://doc.babylonjs.com/how_to/reflect#using-local-cubemap-mode
         */
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
    Object.defineProperty(CubeTexture.prototype, "rotationY", {
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
    Object.defineProperty(CubeTexture.prototype, "noMipmap", {
        /**
         * Are mip maps generated for this texture or not.
         */
        get: function () {
            return this._noMipmap;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Creates a cube texture from an array of image urls
     * @param files defines an array of image urls
     * @param scene defines the hosting scene
     * @param noMipmap specifies if mip maps are not used
     * @returns a cube texture
     */
    CubeTexture.CreateFromImages = function (files, scene, noMipmap) {
        var rootUrlKey = "";
        files.forEach(function (url) { return rootUrlKey += url; });
        return new CubeTexture(rootUrlKey, scene, null, noMipmap, files);
    };
    /**
     * Creates and return a texture created from prefilterd data by tools like IBL Baker or Lys.
     * @param url defines the url of the prefiltered texture
     * @param scene defines the scene the texture is attached to
     * @param forcedExtension defines the extension of the file if different from the url
     * @param createPolynomials defines whether or not to create polynomial harmonics from the texture data if necessary
     * @return the prefiltered texture
     */
    CubeTexture.CreateFromPrefilteredData = function (url, scene, forcedExtension, createPolynomials) {
        if (forcedExtension === void 0) { forcedExtension = null; }
        if (createPolynomials === void 0) { createPolynomials = true; }
        var oldValue = scene.useDelayedTextureLoading;
        scene.useDelayedTextureLoading = false;
        var result = new CubeTexture(url, scene, null, false, null, null, null, undefined, true, forcedExtension, createPolynomials);
        scene.useDelayedTextureLoading = oldValue;
        return result;
    };
    /**
     * Get the current class name of the texture useful for serialization or dynamic coding.
     * @returns "CubeTexture"
     */
    CubeTexture.prototype.getClassName = function () {
        return "CubeTexture";
    };
    /**
     * Update the url (and optional buffer) of this texture if url was null during construction.
     * @param url the url of the texture
     * @param forcedExtension defines the extension to use
     * @param onLoad callback called when the texture is loaded  (defaults to null)
     * @param prefiltered Defines whether the updated texture is prefiltered or not
     */
    CubeTexture.prototype.updateURL = function (url, forcedExtension, onLoad, prefiltered) {
        var _a;
        if (prefiltered === void 0) { prefiltered = false; }
        if (this.url) {
            this.releaseInternalTexture();
            (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.markAllMaterialsAsDirty(1);
        }
        if (!this.name || StringTools.StartsWith(this.name, "data:")) {
            this.name = url;
        }
        this.url = url;
        this.delayLoadState = 4;
        this._prefiltered = prefiltered;
        if (this._prefiltered) {
            this.gammaSpace = false;
            this.anisotropicFilteringLevel = 1;
        }
        this._forcedExtension = forcedExtension || null;
        if (onLoad) {
            this._delayedOnLoad = onLoad;
        }
        this.delayLoad(forcedExtension);
    };
    /**
     * Delays loading of the cube texture
     * @param forcedExtension defines the extension to use
     */
    CubeTexture.prototype.delayLoad = function (forcedExtension) {
        var _this = this;
        var _a;
        if (this.delayLoadState !== 4) {
            return;
        }
        this.delayLoadState = 1;
        this._texture = this._getFromCache(this.url, this._noMipmap);
        if (!this._texture) {
            var scene = this.getScene();
            if (this._prefiltered) {
                this._texture = this._getEngine().createPrefilteredCubeTexture(this.url, scene, 0.8, 0, this._delayedOnLoad, undefined, this._format, forcedExtension, this._createPolynomials);
            }
            else {
                this._texture = this._getEngine().createCubeTexture(this.url, scene, this._files, this._noMipmap, this._delayedOnLoad, null, this._format, forcedExtension, false, 0, 0, null, this._loaderOptions);
            }
            (_a = this._texture) === null || _a === void 0 ? void 0 : _a.onLoadedObservable.add(function () { return _this.onLoadObservable.notifyObservers(_this); });
        }
    };
    /**
     * Returns the reflection texture matrix
     * @returns the reflection texture matrix
     */
    CubeTexture.prototype.getReflectionTextureMatrix = function () {
        return this._textureMatrix;
    };
    /**
     * Sets the reflection texture matrix
     * @param value Reflection texture matrix
     */
    CubeTexture.prototype.setReflectionTextureMatrix = function (value) {
        var _this = this;
        var _a;
        if (value.updateFlag === this._textureMatrix.updateFlag) {
            return;
        }
        if (value.isIdentity() !== this._textureMatrix.isIdentity()) {
            (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.markAllMaterialsAsDirty(1, function (mat) { return mat.getActiveTextures().indexOf(_this) !== -1; });
        }
        this._textureMatrix = value;
    };
    /**
     * Parses text to create a cube texture
     * @param parsedTexture define the serialized text to read from
     * @param scene defines the hosting scene
     * @param rootUrl defines the root url of the cube texture
     * @returns a cube texture
     */
    CubeTexture.Parse = function (parsedTexture, scene, rootUrl) {
        var texture = SerializationHelper.Parse(function () {
            var prefiltered = false;
            if (parsedTexture.prefiltered) {
                prefiltered = parsedTexture.prefiltered;
            }
            return new CubeTexture(rootUrl + parsedTexture.name, scene, parsedTexture.extensions, false, parsedTexture.files || null, null, null, undefined, prefiltered, parsedTexture.forcedExtension);
        }, parsedTexture, scene);
        // Local Cubemaps
        if (parsedTexture.boundingBoxPosition) {
            texture.boundingBoxPosition = Vector3.FromArray(parsedTexture.boundingBoxPosition);
        }
        if (parsedTexture.boundingBoxSize) {
            texture.boundingBoxSize = Vector3.FromArray(parsedTexture.boundingBoxSize);
        }
        // Animations
        if (parsedTexture.animations) {
            for (var animationIndex = 0; animationIndex < parsedTexture.animations.length; animationIndex++) {
                var parsedAnimation = parsedTexture.animations[animationIndex];
                var internalClass = _TypeStore.GetClass("BABYLON.Animation");
                if (internalClass) {
                    texture.animations.push(internalClass.Parse(parsedAnimation));
                }
            }
        }
        return texture;
    };
    /**
     * Makes a clone, or deep copy, of the cube texture
     * @returns a new cube texture
     */
    CubeTexture.prototype.clone = function () {
        var _this = this;
        var uniqueId = 0;
        var newCubeTexture = SerializationHelper.Clone(function () {
            var cubeTexture = new CubeTexture(_this.url, _this.getScene() || _this._getEngine(), _this._extensions, _this._noMipmap, _this._files);
            uniqueId = cubeTexture.uniqueId;
            return cubeTexture;
        }, this);
        newCubeTexture.uniqueId = uniqueId;
        return newCubeTexture;
    };
    __decorate([
        serialize()
    ], CubeTexture.prototype, "url", void 0);
    __decorate([
        serialize("rotationY")
    ], CubeTexture.prototype, "rotationY", null);
    __decorate([
        serialize("files")
    ], CubeTexture.prototype, "_files", void 0);
    __decorate([
        serialize("forcedExtension")
    ], CubeTexture.prototype, "_forcedExtension", void 0);
    __decorate([
        serialize("extensions")
    ], CubeTexture.prototype, "_extensions", void 0);
    __decorate([
        serializeAsMatrix("textureMatrix")
    ], CubeTexture.prototype, "_textureMatrix", void 0);
    return CubeTexture;
}(BaseTexture));
Texture._CubeTextureParser = CubeTexture.Parse;
// Some exporters relies on Tools.Instantiate
_TypeStore.RegisteredTypes["BABYLON.CubeTexture"] = CubeTexture;

var name = 'importanceSampling';
var shader = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvec3 hemisphereCosSample(vec2 u) {\n\nfloat phi=2.*PI*u.x;\nfloat cosTheta2=1.-u.y;\nfloat cosTheta=sqrt(cosTheta2);\nfloat sinTheta=sqrt(1.-cosTheta2);\nreturn vec3(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);\n}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvec3 hemisphereImportanceSampleDggx(vec2 u,float a) {\n\nfloat phi=2.*PI*u.x;\n\nfloat cosTheta2=(1.-u.y)/(1.+(a+1.)*((a-1.)*u.y));\nfloat cosTheta=sqrt(cosTheta2);\nfloat sinTheta=sqrt(1.-cosTheta2);\nreturn vec3(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);\n}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvec3 hemisphereImportanceSampleDCharlie(vec2 u,float a) {\n\nfloat phi=2.*PI*u.x;\nfloat sinTheta=pow(u.y,a/(2.*a+1.));\nfloat cosTheta=sqrt(1.-sinTheta*sinTheta);\nreturn vec3(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);\n}";
Effect.IncludesShadersStore[name] = shader;

var name$1 = 'pbrBRDFFunctions';
var shader$1 = "\n#define FRESNEL_MAXIMUM_ON_ROUGH 0.25\n\n\n\n\n#ifdef MS_BRDF_ENERGY_CONSERVATION\n\n\nvec3 getEnergyConservationFactor(const vec3 specularEnvironmentR0,const vec3 environmentBrdf) {\nreturn 1.0+specularEnvironmentR0*(1.0/environmentBrdf.y-1.0);\n}\n#endif\n#ifdef ENVIRONMENTBRDF\nvec3 getBRDFLookup(float NdotV,float perceptualRoughness) {\n\nvec2 UV=vec2(NdotV,perceptualRoughness);\n\nvec4 brdfLookup=texture2D(environmentBrdfSampler,UV);\n#ifdef ENVIRONMENTBRDF_RGBD\nbrdfLookup.rgb=fromRGBD(brdfLookup.rgba);\n#endif\nreturn brdfLookup.rgb;\n}\nvec3 getReflectanceFromBRDFLookup(const vec3 specularEnvironmentR0,const vec3 specularEnvironmentR90,const vec3 environmentBrdf) {\n#ifdef BRDF_V_HEIGHT_CORRELATED\nvec3 reflectance=(specularEnvironmentR90-specularEnvironmentR0)*environmentBrdf.x+specularEnvironmentR0*environmentBrdf.y;\n\n#else\nvec3 reflectance=specularEnvironmentR0*environmentBrdf.x+specularEnvironmentR90*environmentBrdf.y;\n#endif\nreturn reflectance;\n}\nvec3 getReflectanceFromBRDFLookup(const vec3 specularEnvironmentR0,const vec3 environmentBrdf) {\n#ifdef BRDF_V_HEIGHT_CORRELATED\nvec3 reflectance=mix(environmentBrdf.xxx,environmentBrdf.yyy,specularEnvironmentR0);\n#else\nvec3 reflectance=specularEnvironmentR0*environmentBrdf.x+environmentBrdf.y;\n#endif\nreturn reflectance;\n}\n#endif\n\n#if !defined(ENVIRONMENTBRDF) || defined(REFLECTIONMAP_SKYBOX) || defined(ALPHAFRESNEL)\nvec3 getReflectanceFromAnalyticalBRDFLookup_Jones(float VdotN,vec3 reflectance0,vec3 reflectance90,float smoothness)\n{\n\nfloat weight=mix(FRESNEL_MAXIMUM_ON_ROUGH,1.0,smoothness);\nreturn reflectance0+weight*(reflectance90-reflectance0)*pow5(saturate(1.0-VdotN));\n}\n#endif\n#if defined(SHEEN) && defined(ENVIRONMENTBRDF)\n\nvec3 getSheenReflectanceFromBRDFLookup(const vec3 reflectance0,const vec3 environmentBrdf) {\nvec3 sheenEnvironmentReflectance=reflectance0*environmentBrdf.b;\nreturn sheenEnvironmentReflectance;\n}\n#endif\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvec3 fresnelSchlickGGX(float VdotH,vec3 reflectance0,vec3 reflectance90)\n{\nreturn reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);\n}\nfloat fresnelSchlickGGX(float VdotH,float reflectance0,float reflectance90)\n{\nreturn reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);\n}\n#ifdef CLEARCOAT\n\n\n\n\n\nvec3 getR0RemappedForClearCoat(vec3 f0) {\n#ifdef CLEARCOAT_DEFAULTIOR\n#ifdef MOBILE\nreturn saturate(f0*(f0*0.526868+0.529324)-0.0482256);\n#else\nreturn saturate(f0*(f0*(0.941892-0.263008*f0)+0.346479)-0.0285998);\n#endif\n#else\nvec3 s=sqrt(f0);\nvec3 t=(vClearCoatRefractionParams.z+vClearCoatRefractionParams.w*s)/(vClearCoatRefractionParams.w+vClearCoatRefractionParams.z*s);\nreturn t*t;\n#endif\n}\n#endif\n\n\n\n\n\n\nfloat normalDistributionFunction_TrowbridgeReitzGGX(float NdotH,float alphaG)\n{\n\n\n\nfloat a2=square(alphaG);\nfloat d=NdotH*NdotH*(a2-1.0)+1.0;\nreturn a2/(PI*d*d);\n}\n#ifdef SHEEN\n\n\nfloat normalDistributionFunction_CharlieSheen(float NdotH,float alphaG)\n{\nfloat invR=1./alphaG;\nfloat cos2h=NdotH*NdotH;\nfloat sin2h=1.-cos2h;\nreturn (2.+invR)*pow(sin2h,invR*.5)/(2.*PI);\n}\n#endif\n#ifdef ANISOTROPIC\n\n\nfloat normalDistributionFunction_BurleyGGX_Anisotropic(float NdotH,float TdotH,float BdotH,const vec2 alphaTB) {\nfloat a2=alphaTB.x*alphaTB.y;\nvec3 v=vec3(alphaTB.y*TdotH,alphaTB.x*BdotH,a2*NdotH);\nfloat v2=dot(v,v);\nfloat w2=a2/v2;\nreturn a2*w2*w2*RECIPROCAL_PI;\n}\n#endif\n\n\n\n\n#ifdef BRDF_V_HEIGHT_CORRELATED\n\n\n\nfloat smithVisibility_GGXCorrelated(float NdotL,float NdotV,float alphaG) {\n#ifdef MOBILE\n\nfloat GGXV=NdotL*(NdotV*(1.0-alphaG)+alphaG);\nfloat GGXL=NdotV*(NdotL*(1.0-alphaG)+alphaG);\nreturn 0.5/(GGXV+GGXL);\n#else\nfloat a2=alphaG*alphaG;\nfloat GGXV=NdotL*sqrt(NdotV*(NdotV-a2*NdotV)+a2);\nfloat GGXL=NdotV*sqrt(NdotL*(NdotL-a2*NdotL)+a2);\nreturn 0.5/(GGXV+GGXL);\n#endif\n}\n#else\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nfloat smithVisibilityG1_TrowbridgeReitzGGXFast(float dot,float alphaG)\n{\n#ifdef MOBILE\n\nreturn 1.0/(dot+alphaG+(1.0-alphaG)*dot ));\n#else\nfloat alphaSquared=alphaG*alphaG;\nreturn 1.0/(dot+sqrt(alphaSquared+(1.0-alphaSquared)*dot*dot));\n#endif\n}\nfloat smithVisibility_TrowbridgeReitzGGXFast(float NdotL,float NdotV,float alphaG)\n{\nfloat visibility=smithVisibilityG1_TrowbridgeReitzGGXFast(NdotL,alphaG)*smithVisibilityG1_TrowbridgeReitzGGXFast(NdotV,alphaG);\n\nreturn visibility;\n}\n#endif\n#ifdef ANISOTROPIC\n\n\nfloat smithVisibility_GGXCorrelated_Anisotropic(float NdotL,float NdotV,float TdotV,float BdotV,float TdotL,float BdotL,const vec2 alphaTB) {\nfloat lambdaV=NdotL*length(vec3(alphaTB.x*TdotV,alphaTB.y*BdotV,NdotV));\nfloat lambdaL=NdotV*length(vec3(alphaTB.x*TdotL,alphaTB.y*BdotL,NdotL));\nfloat v=0.5/(lambdaV+lambdaL);\nreturn v;\n}\n#endif\n#ifdef CLEARCOAT\nfloat visibility_Kelemen(float VdotH) {\n\n\n\nreturn 0.25/(VdotH*VdotH);\n}\n#endif\n#ifdef SHEEN\n\n\n\nfloat visibility_Ashikhmin(float NdotL,float NdotV)\n{\nreturn 1./(4.*(NdotL+NdotV-NdotL*NdotV));\n}\n\n#endif\n\n\n\n\n\n\n\nfloat diffuseBRDF_Burley(float NdotL,float NdotV,float VdotH,float roughness) {\n\n\nfloat diffuseFresnelNV=pow5(saturateEps(1.0-NdotL));\nfloat diffuseFresnelNL=pow5(saturateEps(1.0-NdotV));\nfloat diffuseFresnel90=0.5+2.0*VdotH*VdotH*roughness;\nfloat fresnel =\n(1.0+(diffuseFresnel90-1.0)*diffuseFresnelNL) *\n(1.0+(diffuseFresnel90-1.0)*diffuseFresnelNV);\nreturn fresnel/PI;\n}\n#ifdef SS_TRANSLUCENCY\n\n\nvec3 transmittanceBRDF_Burley(const vec3 tintColor,const vec3 diffusionDistance,float thickness) {\nvec3 S=1./maxEps(diffusionDistance);\nvec3 temp=exp((-0.333333333*thickness)*S);\nreturn tintColor.rgb*0.25*(temp*temp*temp+3.0*temp);\n}\n\n\nfloat computeWrappedDiffuseNdotL(float NdotL,float w) {\nfloat t=1.0+w;\nfloat invt2=1.0/square(t);\nreturn saturate((NdotL+w)*invt2);\n}\n#endif\n";
Effect.IncludesShadersStore[name$1] = shader$1;

var name$2 = 'hdrFilteringFunctions';
var shader$2 = "#ifdef NUM_SAMPLES\n#if NUM_SAMPLES>0\n#ifdef WEBGL2\n\n\nfloat radicalInverse_VdC(uint bits)\n{\nbits=(bits << 16u) | (bits >> 16u);\nbits=((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);\nbits=((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);\nbits=((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);\nbits=((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);\nreturn float(bits)*2.3283064365386963e-10;\n}\nvec2 hammersley(uint i,uint N)\n{\nreturn vec2(float(i)/float(N),radicalInverse_VdC(i));\n}\n#else\nfloat vanDerCorpus(int n,int base)\n{\nfloat invBase=1.0/float(base);\nfloat denom=1.0;\nfloat result=0.0;\nfor(int i=0; i<32; ++i)\n{\nif(n>0)\n{\ndenom=mod(float(n),2.0);\nresult+=denom*invBase;\ninvBase=invBase/2.0;\nn=int(float(n)/2.0);\n}\n}\nreturn result;\n}\nvec2 hammersley(int i,int N)\n{\nreturn vec2(float(i)/float(N),vanDerCorpus(i,2));\n}\n#endif\nfloat log4(float x) {\nreturn log2(x)/2.;\n}\nconst float NUM_SAMPLES_FLOAT=float(NUM_SAMPLES);\nconst float NUM_SAMPLES_FLOAT_INVERSED=1./NUM_SAMPLES_FLOAT;\nconst float K=4.;\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n#define inline\nvec3 irradiance(samplerCube inputTexture,vec3 inputN,vec2 filteringInfo)\n{\nvec3 n=normalize(inputN);\nvec3 result=vec3(0.0);\nvec3 tangent=abs(n.z)<0.999 ? vec3(0.,0.,1.) : vec3(1.,0.,0.);\ntangent=normalize(cross(tangent,n));\nvec3 bitangent=cross(n,tangent);\nmat3 tbn=mat3(tangent,bitangent,n);\nfloat maxLevel=filteringInfo.y;\nfloat dim0=filteringInfo.x;\nfloat omegaP=(4.*PI)/(6.*dim0*dim0);\n#ifdef WEBGL2\nfor(uint i=0u; i<NUM_SAMPLES; ++i)\n#else\nfor(int i=0; i<NUM_SAMPLES; ++i)\n#endif\n{\nvec2 Xi=hammersley(i,NUM_SAMPLES);\nvec3 Ls=hemisphereCosSample(Xi);\nLs=normalize(Ls);\nvec3 Ns=vec3(0.,0.,1.);\nfloat NoL=dot(Ns,Ls);\nif (NoL>0.) {\nfloat pdf_inversed=PI/NoL;\nfloat omegaS=NUM_SAMPLES_FLOAT_INVERSED*pdf_inversed;\nfloat l=log4(omegaS)-log4(omegaP)+log4(K);\nfloat mipLevel=clamp(l,0.0,maxLevel);\nvec3 c=textureCubeLodEXT(inputTexture,tbn*Ls,mipLevel).rgb;\n#ifdef GAMMA_INPUT\nc=toLinearSpace(c);\n#endif\nresult+=c;\n}\n}\nresult=result*NUM_SAMPLES_FLOAT_INVERSED;\nreturn result;\n}\n#define inline\nvec3 radiance(float alphaG,samplerCube inputTexture,vec3 inputN,vec2 filteringInfo)\n{\nvec3 n=normalize(inputN);\nif (alphaG == 0.) {\nvec3 c=textureCube(inputTexture,n).rgb;\n#ifdef GAMMA_INPUT\nc=toLinearSpace(c);\n#endif\nreturn c;\n}\nvec3 result=vec3(0.);\nvec3 tangent=abs(n.z)<0.999 ? vec3(0.,0.,1.) : vec3(1.,0.,0.);\ntangent=normalize(cross(tangent,n));\nvec3 bitangent=cross(n,tangent);\nmat3 tbn=mat3(tangent,bitangent,n);\nfloat maxLevel=filteringInfo.y;\nfloat dim0=filteringInfo.x;\nfloat omegaP=(4.*PI)/(6.*dim0*dim0);\nfloat weight=0.;\n#ifdef WEBGL2\nfor(uint i=0u; i<NUM_SAMPLES; ++i)\n#else\nfor(int i=0; i<NUM_SAMPLES; ++i)\n#endif\n{\nvec2 Xi=hammersley(i,NUM_SAMPLES);\nvec3 H=hemisphereImportanceSampleDggx(Xi,alphaG);\nfloat NoV=1.;\nfloat NoH=H.z;\nfloat NoH2=H.z*H.z;\nfloat NoL=2.*NoH2-1.;\nvec3 L=vec3(2.*NoH*H.x,2.*NoH*H.y,NoL);\nL=normalize(L);\nif (NoL>0.) {\nfloat pdf_inversed=4./normalDistributionFunction_TrowbridgeReitzGGX(NoH,alphaG);\nfloat omegaS=NUM_SAMPLES_FLOAT_INVERSED*pdf_inversed;\nfloat l=log4(omegaS)-log4(omegaP)+log4(K);\nfloat mipLevel=clamp(float(l),0.0,maxLevel);\nweight+=NoL;\nvec3 c=textureCubeLodEXT(inputTexture,tbn*L,mipLevel).rgb;\n#ifdef GAMMA_INPUT\nc=toLinearSpace(c);\n#endif\nresult+=c*NoL;\n}\n}\nresult=result/weight;\nreturn result;\n}\n#endif\n#endif";
Effect.IncludesShadersStore[name$2] = shader$2;

ThinEngine.prototype.updateRawTexture = function (texture, data, format, invertY, compression, type) {
    if (compression === void 0) { compression = null; }
    if (type === void 0) { type = 0; }
    if (!texture) {
        return;
    }
    // Babylon's internalSizedFomat but gl's texImage2D internalFormat
    var internalSizedFomat = this._getRGBABufferInternalSizedFormat(type, format);
    // Babylon's internalFormat but gl's texImage2D format
    var internalFormat = this._getInternalFormat(format);
    var textureType = this._getWebGLTextureType(type);
    this._bindTextureDirectly(this._gl.TEXTURE_2D, texture, true);
    this._unpackFlipY(invertY === undefined ? true : (invertY ? true : false));
    if (!this._doNotHandleContextLost) {
        texture._bufferView = data;
        texture.format = format;
        texture.type = type;
        texture.invertY = invertY;
        texture._compression = compression;
    }
    if (texture.width % 4 !== 0) {
        this._gl.pixelStorei(this._gl.UNPACK_ALIGNMENT, 1);
    }
    if (compression && data) {
        this._gl.compressedTexImage2D(this._gl.TEXTURE_2D, 0, this.getCaps().s3tc[compression], texture.width, texture.height, 0, data);
    }
    else {
        this._gl.texImage2D(this._gl.TEXTURE_2D, 0, internalSizedFomat, texture.width, texture.height, 0, internalFormat, textureType, data);
    }
    if (texture.generateMipMaps) {
        this._gl.generateMipmap(this._gl.TEXTURE_2D);
    }
    this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
    //  this.resetTextureCache();
    texture.isReady = true;
};
ThinEngine.prototype.createRawTexture = function (data, width, height, format, generateMipMaps, invertY, samplingMode, compression, type) {
    if (compression === void 0) { compression = null; }
    if (type === void 0) { type = 0; }
    var texture = new InternalTexture(this, InternalTextureSource.Raw);
    texture.baseWidth = width;
    texture.baseHeight = height;
    texture.width = width;
    texture.height = height;
    texture.format = format;
    texture.generateMipMaps = generateMipMaps;
    texture.samplingMode = samplingMode;
    texture.invertY = invertY;
    texture._compression = compression;
    texture.type = type;
    if (!this._doNotHandleContextLost) {
        texture._bufferView = data;
    }
    this.updateRawTexture(texture, data, format, invertY, compression, type);
    this._bindTextureDirectly(this._gl.TEXTURE_2D, texture, true);
    // Filters
    var filters = this._getSamplingParameters(samplingMode, generateMipMaps);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, filters.mag);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, filters.min);
    if (generateMipMaps) {
        this._gl.generateMipmap(this._gl.TEXTURE_2D);
    }
    this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
    this._internalTexturesCache.push(texture);
    return texture;
};
ThinEngine.prototype.createRawCubeTexture = function (data, size, format, type, generateMipMaps, invertY, samplingMode, compression) {
    if (compression === void 0) { compression = null; }
    var gl = this._gl;
    var texture = new InternalTexture(this, InternalTextureSource.CubeRaw);
    texture.isCube = true;
    texture.format = format;
    texture.type = type;
    if (!this._doNotHandleContextLost) {
        texture._bufferViewArray = data;
    }
    var textureType = this._getWebGLTextureType(type);
    var internalFormat = this._getInternalFormat(format);
    if (internalFormat === gl.RGB) {
        internalFormat = gl.RGBA;
    }
    // Mipmap generation needs a sized internal format that is both color-renderable and texture-filterable
    if (textureType === gl.FLOAT && !this._caps.textureFloatLinearFiltering) {
        generateMipMaps = false;
        samplingMode = 1;
        Logger.Warn("Float texture filtering is not supported. Mipmap generation and sampling mode are forced to false and TEXTURE_NEAREST_SAMPLINGMODE, respectively.");
    }
    else if (textureType === this._gl.HALF_FLOAT_OES && !this._caps.textureHalfFloatLinearFiltering) {
        generateMipMaps = false;
        samplingMode = 1;
        Logger.Warn("Half float texture filtering is not supported. Mipmap generation and sampling mode are forced to false and TEXTURE_NEAREST_SAMPLINGMODE, respectively.");
    }
    else if (textureType === gl.FLOAT && !this._caps.textureFloatRender) {
        generateMipMaps = false;
        Logger.Warn("Render to float textures is not supported. Mipmap generation forced to false.");
    }
    else if (textureType === gl.HALF_FLOAT && !this._caps.colorBufferFloat) {
        generateMipMaps = false;
        Logger.Warn("Render to half float textures is not supported. Mipmap generation forced to false.");
    }
    var width = size;
    var height = width;
    texture.width = width;
    texture.height = height;
    // Double check on POT to generate Mips.
    var isPot = !this.needPOTTextures || (Tools.IsExponentOfTwo(texture.width) && Tools.IsExponentOfTwo(texture.height));
    if (!isPot) {
        generateMipMaps = false;
    }
    // Upload data if needed. The texture won't be ready until then.
    if (data) {
        this.updateRawCubeTexture(texture, data, format, type, invertY, compression);
    }
    this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, texture, true);
    // Filters
    if (data && generateMipMaps) {
        this._gl.generateMipmap(this._gl.TEXTURE_CUBE_MAP);
    }
    var filters = this._getSamplingParameters(samplingMode, generateMipMaps);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, filters.mag);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, filters.min);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
    texture.generateMipMaps = generateMipMaps;
    return texture;
};
ThinEngine.prototype.updateRawCubeTexture = function (texture, data, format, type, invertY, compression, level) {
    if (compression === void 0) { compression = null; }
    if (level === void 0) { level = 0; }
    texture._bufferViewArray = data;
    texture.format = format;
    texture.type = type;
    texture.invertY = invertY;
    texture._compression = compression;
    var gl = this._gl;
    var textureType = this._getWebGLTextureType(type);
    var internalFormat = this._getInternalFormat(format);
    var internalSizedFomat = this._getRGBABufferInternalSizedFormat(type);
    var needConversion = false;
    if (internalFormat === gl.RGB) {
        internalFormat = gl.RGBA;
        needConversion = true;
    }
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
    this._unpackFlipY(invertY === undefined ? true : (invertY ? true : false));
    if (texture.width % 4 !== 0) {
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    }
    // Data are known to be in +X +Y +Z -X -Y -Z
    for (var faceIndex = 0; faceIndex < 6; faceIndex++) {
        var faceData = data[faceIndex];
        if (compression) {
            gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, level, (this.getCaps().s3tc)[compression], texture.width, texture.height, 0, faceData);
        }
        else {
            if (needConversion) {
                faceData = _convertRGBtoRGBATextureData(faceData, texture.width, texture.height, type);
            }
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, level, internalSizedFomat, texture.width, texture.height, 0, internalFormat, textureType, faceData);
        }
    }
    var isPot = !this.needPOTTextures || (Tools.IsExponentOfTwo(texture.width) && Tools.IsExponentOfTwo(texture.height));
    if (isPot && texture.generateMipMaps && level === 0) {
        this._gl.generateMipmap(this._gl.TEXTURE_CUBE_MAP);
    }
    this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
    // this.resetTextureCache();
    texture.isReady = true;
};
ThinEngine.prototype.createRawCubeTextureFromUrl = function (url, scene, size, format, type, noMipmap, callback, mipmapGenerator, onLoad, onError, samplingMode, invertY) {
    var _this = this;
    if (onLoad === void 0) { onLoad = null; }
    if (onError === void 0) { onError = null; }
    if (samplingMode === void 0) { samplingMode = 3; }
    if (invertY === void 0) { invertY = false; }
    var gl = this._gl;
    var texture = this.createRawCubeTexture(null, size, format, type, !noMipmap, invertY, samplingMode, null);
    scene === null || scene === void 0 ? void 0 : scene._addPendingData(texture);
    texture.url = url;
    this._internalTexturesCache.push(texture);
    var onerror = function (request, exception) {
        scene === null || scene === void 0 ? void 0 : scene._removePendingData(texture);
        if (onError && request) {
            onError(request.status + " " + request.statusText, exception);
        }
    };
    var internalCallback = function (data) {
        var width = texture.width;
        var faceDataArrays = callback(data);
        if (!faceDataArrays) {
            return;
        }
        if (mipmapGenerator) {
            var textureType = _this._getWebGLTextureType(type);
            var internalFormat = _this._getInternalFormat(format);
            var internalSizedFomat = _this._getRGBABufferInternalSizedFormat(type);
            var needConversion = false;
            if (internalFormat === gl.RGB) {
                internalFormat = gl.RGBA;
                needConversion = true;
            }
            _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
            _this._unpackFlipY(false);
            var mipData = mipmapGenerator(faceDataArrays);
            for (var level = 0; level < mipData.length; level++) {
                var mipSize = width >> level;
                for (var faceIndex = 0; faceIndex < 6; faceIndex++) {
                    var mipFaceData = mipData[level][faceIndex];
                    if (needConversion) {
                        mipFaceData = _convertRGBtoRGBATextureData(mipFaceData, mipSize, mipSize, type);
                    }
                    gl.texImage2D(faceIndex, level, internalSizedFomat, mipSize, mipSize, 0, internalFormat, textureType, mipFaceData);
                }
            }
            _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
        }
        else {
            _this.updateRawCubeTexture(texture, faceDataArrays, format, type, invertY);
        }
        texture.isReady = true;
        // this.resetTextureCache();
        scene === null || scene === void 0 ? void 0 : scene._removePendingData(texture);
        if (onLoad) {
            onLoad();
        }
    };
    this._loadFile(url, function (data) {
        internalCallback(data);
    }, undefined, scene === null || scene === void 0 ? void 0 : scene.offlineProvider, true, onerror);
    return texture;
};
/** @hidden */
function _convertRGBtoRGBATextureData(rgbData, width, height, textureType) {
    // Create new RGBA data container.
    var rgbaData;
    if (textureType === 1) {
        rgbaData = new Float32Array(width * height * 4);
    }
    else {
        rgbaData = new Uint32Array(width * height * 4);
    }
    // Convert each pixel.
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var index = (y * width + x) * 3;
            var newIndex = (y * width + x) * 4;
            // Map Old Value to new value.
            rgbaData[newIndex + 0] = rgbData[index + 0];
            rgbaData[newIndex + 1] = rgbData[index + 1];
            rgbaData[newIndex + 2] = rgbData[index + 2];
            // Add fully opaque alpha channel.
            rgbaData[newIndex + 3] = 1;
        }
    }
    return rgbaData;
}
/**
 * Create a function for createRawTexture3D/createRawTexture2DArray
 * @param is3D true for TEXTURE_3D and false for TEXTURE_2D_ARRAY
 * @hidden
 */
function _makeCreateRawTextureFunction(is3D) {
    return function (data, width, height, depth, format, generateMipMaps, invertY, samplingMode, compression, textureType) {
        if (compression === void 0) { compression = null; }
        if (textureType === void 0) { textureType = 0; }
        var target = is3D ? this._gl.TEXTURE_3D : this._gl.TEXTURE_2D_ARRAY;
        var source = is3D ? InternalTextureSource.Raw3D : InternalTextureSource.Raw2DArray;
        var texture = new InternalTexture(this, source);
        texture.baseWidth = width;
        texture.baseHeight = height;
        texture.baseDepth = depth;
        texture.width = width;
        texture.height = height;
        texture.depth = depth;
        texture.format = format;
        texture.type = textureType;
        texture.generateMipMaps = generateMipMaps;
        texture.samplingMode = samplingMode;
        if (is3D) {
            texture.is3D = true;
        }
        else {
            texture.is2DArray = true;
        }
        if (!this._doNotHandleContextLost) {
            texture._bufferView = data;
        }
        if (is3D) {
            this.updateRawTexture3D(texture, data, format, invertY, compression, textureType);
        }
        else {
            this.updateRawTexture2DArray(texture, data, format, invertY, compression, textureType);
        }
        this._bindTextureDirectly(target, texture, true);
        // Filters
        var filters = this._getSamplingParameters(samplingMode, generateMipMaps);
        this._gl.texParameteri(target, this._gl.TEXTURE_MAG_FILTER, filters.mag);
        this._gl.texParameteri(target, this._gl.TEXTURE_MIN_FILTER, filters.min);
        if (generateMipMaps) {
            this._gl.generateMipmap(target);
        }
        this._bindTextureDirectly(target, null);
        this._internalTexturesCache.push(texture);
        return texture;
    };
}
ThinEngine.prototype.createRawTexture2DArray = _makeCreateRawTextureFunction(false);
ThinEngine.prototype.createRawTexture3D = _makeCreateRawTextureFunction(true);
/**
 * Create a function for updateRawTexture3D/updateRawTexture2DArray
 * @param is3D true for TEXTURE_3D and false for TEXTURE_2D_ARRAY
 * @hidden
 */
function _makeUpdateRawTextureFunction(is3D) {
    return function (texture, data, format, invertY, compression, textureType) {
        if (compression === void 0) { compression = null; }
        if (textureType === void 0) { textureType = 0; }
        var target = is3D ? this._gl.TEXTURE_3D : this._gl.TEXTURE_2D_ARRAY;
        var internalType = this._getWebGLTextureType(textureType);
        var internalFormat = this._getInternalFormat(format);
        var internalSizedFomat = this._getRGBABufferInternalSizedFormat(textureType, format);
        this._bindTextureDirectly(target, texture, true);
        this._unpackFlipY(invertY === undefined ? true : (invertY ? true : false));
        if (!this._doNotHandleContextLost) {
            texture._bufferView = data;
            texture.format = format;
            texture.invertY = invertY;
            texture._compression = compression;
        }
        if (texture.width % 4 !== 0) {
            this._gl.pixelStorei(this._gl.UNPACK_ALIGNMENT, 1);
        }
        if (compression && data) {
            this._gl.compressedTexImage3D(target, 0, this.getCaps().s3tc[compression], texture.width, texture.height, texture.depth, 0, data);
        }
        else {
            this._gl.texImage3D(target, 0, internalSizedFomat, texture.width, texture.height, texture.depth, 0, internalFormat, internalType, data);
        }
        if (texture.generateMipMaps) {
            this._gl.generateMipmap(target);
        }
        this._bindTextureDirectly(target, null);
        // this.resetTextureCache();
        texture.isReady = true;
    };
}
ThinEngine.prototype.updateRawTexture2DArray = _makeUpdateRawTextureFunction(false);
ThinEngine.prototype.updateRawTexture3D = _makeUpdateRawTextureFunction(true);

/**
 * Enum for the animation key frame interpolation type
 */
var AnimationKeyInterpolation;
(function (AnimationKeyInterpolation) {
    /**
     * Do not interpolate between keys and use the start key value only. Tangents are ignored
     */
    AnimationKeyInterpolation[AnimationKeyInterpolation["STEP"] = 1] = "STEP";
})(AnimationKeyInterpolation || (AnimationKeyInterpolation = {}));

/**
 * Represents the range of an animation
 */
var AnimationRange = /** @class */ (function () {
    /**
     * Initializes the range of an animation
     * @param name The name of the animation range
     * @param from The starting frame of the animation
     * @param to The ending frame of the animation
     */
    function AnimationRange(
    /**The name of the animation range**/
    name, 
    /**The starting frame of the animation */
    from, 
    /**The ending frame of the animation*/
    to) {
        this.name = name;
        this.from = from;
        this.to = to;
    }
    /**
     * Makes a copy of the animation range
     * @returns A copy of the animation range
     */
    AnimationRange.prototype.clone = function () {
        return new AnimationRange(this.name, this.from, this.to);
    };
    return AnimationRange;
}());

/**
 * @hidden
 */
var _IAnimationState = /** @class */ (function () {
    function _IAnimationState() {
    }
    return _IAnimationState;
}());
/**
 * Class used to store any kind of animation
 */
var Animation = /** @class */ (function () {
    /**
     * Initializes the animation
     * @param name Name of the animation
     * @param targetProperty Property to animate
     * @param framePerSecond The frames per second of the animation
     * @param dataType The data type of the animation
     * @param loopMode The loop mode of the animation
     * @param enableBlending Specifies if blending should be enabled
     */
    function Animation(
    /**Name of the animation */
    name, 
    /**Property to animate */
    targetProperty, 
    /**The frames per second of the animation */
    framePerSecond, 
    /**The data type of the animation */
    dataType, 
    /**The loop mode of the animation */
    loopMode, 
    /**Specifies if blending should be enabled */
    enableBlending) {
        this.name = name;
        this.targetProperty = targetProperty;
        this.framePerSecond = framePerSecond;
        this.dataType = dataType;
        this.loopMode = loopMode;
        this.enableBlending = enableBlending;
        /**
         * @hidden Internal use only
         */
        this._runtimeAnimations = new Array();
        /**
         * The set of event that will be linked to this animation
         */
        this._events = new Array();
        /**
         * Stores the blending speed of the animation
         */
        this.blendingSpeed = 0.01;
        /**
         * Stores the animation ranges for the animation
         */
        this._ranges = {};
        this.targetPropertyPath = targetProperty.split(".");
        this.dataType = dataType;
        this.loopMode = loopMode === undefined ? Animation.ANIMATIONLOOPMODE_CYCLE : loopMode;
    }
    /**
     * @hidden Internal use
     */
    Animation._PrepareAnimation = function (name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction) {
        var dataType = undefined;
        if (!isNaN(parseFloat(from)) && isFinite(from)) {
            dataType = Animation.ANIMATIONTYPE_FLOAT;
        }
        else if (from instanceof Quaternion) {
            dataType = Animation.ANIMATIONTYPE_QUATERNION;
        }
        else if (from instanceof Vector3) {
            dataType = Animation.ANIMATIONTYPE_VECTOR3;
        }
        else if (from instanceof Vector2) {
            dataType = Animation.ANIMATIONTYPE_VECTOR2;
        }
        else if (from instanceof Color3) {
            dataType = Animation.ANIMATIONTYPE_COLOR3;
        }
        else if (from instanceof Color4) {
            dataType = Animation.ANIMATIONTYPE_COLOR4;
        }
        else if (from instanceof Size) {
            dataType = Animation.ANIMATIONTYPE_SIZE;
        }
        if (dataType == undefined) {
            return null;
        }
        var animation = new Animation(name, targetProperty, framePerSecond, dataType, loopMode);
        var keys = [{ frame: 0, value: from }, { frame: totalFrame, value: to }];
        animation.setKeys(keys);
        if (easingFunction !== undefined) {
            animation.setEasingFunction(easingFunction);
        }
        return animation;
    };
    /**
     * Sets up an animation
     * @param property The property to animate
     * @param animationType The animation type to apply
     * @param framePerSecond The frames per second of the animation
     * @param easingFunction The easing function used in the animation
     * @returns The created animation
     */
    Animation.CreateAnimation = function (property, animationType, framePerSecond, easingFunction) {
        var animation = new Animation(property + "Animation", property, framePerSecond, animationType, Animation.ANIMATIONLOOPMODE_CONSTANT);
        animation.setEasingFunction(easingFunction);
        return animation;
    };
    /**
     * Create and start an animation on a node
     * @param name defines the name of the global animation that will be run on all nodes
     * @param node defines the root node where the animation will take place
     * @param targetProperty defines property to animate
     * @param framePerSecond defines the number of frame per second yo use
     * @param totalFrame defines the number of frames in total
     * @param from defines the initial value
     * @param to defines the final value
     * @param loopMode defines which loop mode you want to use (off by default)
     * @param easingFunction defines the easing function to use (linear by default)
     * @param onAnimationEnd defines the callback to call when animation end
     * @returns the animatable created for this animation
     */
    Animation.CreateAndStartAnimation = function (name, node, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
        var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
        if (!animation) {
            return null;
        }
        return node.getScene().beginDirectAnimation(node, [animation], 0, totalFrame, (animation.loopMode === 1), 1.0, onAnimationEnd);
    };
    /**
     * Create and start an animation on a node and its descendants
     * @param name defines the name of the global animation that will be run on all nodes
     * @param node defines the root node where the animation will take place
     * @param directDescendantsOnly if true only direct descendants will be used, if false direct and also indirect (children of children, an so on in a recursive manner) descendants will be used
     * @param targetProperty defines property to animate
     * @param framePerSecond defines the number of frame per second to use
     * @param totalFrame defines the number of frames in total
     * @param from defines the initial value
     * @param to defines the final value
     * @param loopMode defines which loop mode you want to use (off by default)
     * @param easingFunction defines the easing function to use (linear by default)
     * @param onAnimationEnd defines the callback to call when an animation ends (will be called once per node)
     * @returns the list of animatables created for all nodes
     * @example https://www.babylonjs-playground.com/#MH0VLI
     */
    Animation.CreateAndStartHierarchyAnimation = function (name, node, directDescendantsOnly, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
        var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
        if (!animation) {
            return null;
        }
        var scene = node.getScene();
        return scene.beginDirectHierarchyAnimation(node, directDescendantsOnly, [animation], 0, totalFrame, (animation.loopMode === 1), 1.0, onAnimationEnd);
    };
    /**
     * Creates a new animation, merges it with the existing animations and starts it
     * @param name Name of the animation
     * @param node Node which contains the scene that begins the animations
     * @param targetProperty Specifies which property to animate
     * @param framePerSecond The frames per second of the animation
     * @param totalFrame The total number of frames
     * @param from The frame at the beginning of the animation
     * @param to The frame at the end of the animation
     * @param loopMode Specifies the loop mode of the animation
     * @param easingFunction (Optional) The easing function of the animation, which allow custom mathematical formulas for animations
     * @param onAnimationEnd Callback to run once the animation is complete
     * @returns Nullable animation
     */
    Animation.CreateMergeAndStartAnimation = function (name, node, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
        var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
        if (!animation) {
            return null;
        }
        node.animations.push(animation);
        return node.getScene().beginAnimation(node, 0, totalFrame, (animation.loopMode === 1), 1.0, onAnimationEnd);
    };
    /**
     * Convert the keyframes for all animations belonging to the group to be relative to a given reference frame.
     * @param sourceAnimation defines the Animation containing keyframes to convert
     * @param referenceFrame defines the frame that keyframes in the range will be relative to
     * @param range defines the name of the AnimationRange belonging to the Animation to convert
     * @param cloneOriginal defines whether or not to clone the animation and convert the clone or convert the original animation (default is false)
     * @param clonedName defines the name of the resulting cloned Animation if cloneOriginal is true
     * @returns a new Animation if cloneOriginal is true or the original Animation if cloneOriginal is false
     */
    Animation.MakeAnimationAdditive = function (sourceAnimation, referenceFrame, range, cloneOriginal, clonedName) {
        if (referenceFrame === void 0) { referenceFrame = 0; }
        if (cloneOriginal === void 0) { cloneOriginal = false; }
        var animation = sourceAnimation;
        if (cloneOriginal) {
            animation = sourceAnimation.clone();
            animation.name = clonedName || animation.name;
        }
        if (!animation._keys.length) {
            return animation;
        }
        referenceFrame = referenceFrame >= 0 ? referenceFrame : 0;
        var startIndex = 0;
        var firstKey = animation._keys[0];
        var endIndex = animation._keys.length - 1;
        var lastKey = animation._keys[endIndex];
        var valueStore = {
            referenceValue: firstKey.value,
            referencePosition: TmpVectors.Vector3[0],
            referenceQuaternion: TmpVectors.Quaternion[0],
            referenceScaling: TmpVectors.Vector3[1],
            keyPosition: TmpVectors.Vector3[2],
            keyQuaternion: TmpVectors.Quaternion[1],
            keyScaling: TmpVectors.Vector3[3]
        };
        var referenceFound = false;
        var from = firstKey.frame;
        var to = lastKey.frame;
        if (range) {
            var rangeValue = animation.getRange(range);
            if (rangeValue) {
                from = rangeValue.from;
                to = rangeValue.to;
            }
        }
        var fromKeyFound = firstKey.frame === from;
        var toKeyFound = lastKey.frame === to;
        // There's only one key, so use it
        if (animation._keys.length === 1) {
            var value = animation._getKeyValue(animation._keys[0]);
            valueStore.referenceValue = value.clone ? value.clone() : value;
            referenceFound = true;
        }
        // Reference frame is before the first frame, so just use the first frame
        else if (referenceFrame <= firstKey.frame) {
            var value = animation._getKeyValue(firstKey.value);
            valueStore.referenceValue = value.clone ? value.clone() : value;
            referenceFound = true;
        }
        // Reference frame is after the last frame, so just use the last frame
        else if (referenceFrame >= lastKey.frame) {
            var value = animation._getKeyValue(lastKey.value);
            valueStore.referenceValue = value.clone ? value.clone() : value;
            referenceFound = true;
        }
        // Find key bookends, create them if they don't exist
        var index = 0;
        while (!referenceFound || !fromKeyFound || !toKeyFound && index < animation._keys.length - 1) {
            var currentKey = animation._keys[index];
            var nextKey = animation._keys[index + 1];
            // If reference frame wasn't found yet, check if we can interpolate to it
            if (!referenceFound && referenceFrame >= currentKey.frame && referenceFrame <= nextKey.frame) {
                var value = void 0;
                if (referenceFrame === currentKey.frame) {
                    value = animation._getKeyValue(currentKey.value);
                }
                else if (referenceFrame === nextKey.frame) {
                    value = animation._getKeyValue(nextKey.value);
                }
                else {
                    var animationState = {
                        key: index,
                        repeatCount: 0,
                        loopMode: this.ANIMATIONLOOPMODE_CONSTANT
                    };
                    value = animation._interpolate(referenceFrame, animationState);
                }
                valueStore.referenceValue = value.clone ? value.clone() : value;
                referenceFound = true;
            }
            // If from key wasn't found yet, check if we can interpolate to it
            if (!fromKeyFound && from >= currentKey.frame && from <= nextKey.frame) {
                if (from === currentKey.frame) {
                    startIndex = index;
                }
                else if (from === nextKey.frame) {
                    startIndex = index + 1;
                }
                else {
                    var animationState = {
                        key: index,
                        repeatCount: 0,
                        loopMode: this.ANIMATIONLOOPMODE_CONSTANT
                    };
                    var value = animation._interpolate(from, animationState);
                    var key = {
                        frame: from,
                        value: value.clone ? value.clone() : value
                    };
                    animation._keys.splice(index + 1, 0, key);
                    startIndex = index + 1;
                }
                fromKeyFound = true;
            }
            // If to key wasn't found yet, check if we can interpolate to it
            if (!toKeyFound && to >= currentKey.frame && to <= nextKey.frame) {
                if (to === currentKey.frame) {
                    endIndex = index;
                }
                else if (to === nextKey.frame) {
                    endIndex = index + 1;
                }
                else {
                    var animationState = {
                        key: index,
                        repeatCount: 0,
                        loopMode: this.ANIMATIONLOOPMODE_CONSTANT
                    };
                    var value = animation._interpolate(to, animationState);
                    var key = {
                        frame: to,
                        value: value.clone ? value.clone() : value
                    };
                    animation._keys.splice(index + 1, 0, key);
                    endIndex = index + 1;
                }
                toKeyFound = true;
            }
            index++;
        }
        // Conjugate the quaternion
        if (animation.dataType === Animation.ANIMATIONTYPE_QUATERNION) {
            valueStore.referenceValue.normalize().conjugateInPlace();
        }
        // Decompose matrix and conjugate the quaternion
        else if (animation.dataType === Animation.ANIMATIONTYPE_MATRIX) {
            valueStore.referenceValue.decompose(valueStore.referenceScaling, valueStore.referenceQuaternion, valueStore.referencePosition);
            valueStore.referenceQuaternion.normalize().conjugateInPlace();
        }
        // Subtract the reference value from all of the key values
        for (var index = startIndex; index <= endIndex; index++) {
            var key = animation._keys[index];
            // If this key was duplicated to create a frame 0 key, skip it because its value has already been updated
            if (index && animation.dataType !== Animation.ANIMATIONTYPE_FLOAT && key.value === firstKey.value) {
                continue;
            }
            switch (animation.dataType) {
                case Animation.ANIMATIONTYPE_MATRIX:
                    key.value.decompose(valueStore.keyScaling, valueStore.keyQuaternion, valueStore.keyPosition);
                    valueStore.keyPosition.subtractInPlace(valueStore.referencePosition);
                    valueStore.keyScaling.divideInPlace(valueStore.referenceScaling);
                    valueStore.referenceQuaternion.multiplyToRef(valueStore.keyQuaternion, valueStore.keyQuaternion);
                    Matrix.ComposeToRef(valueStore.keyScaling, valueStore.keyQuaternion, valueStore.keyPosition, key.value);
                    break;
                case Animation.ANIMATIONTYPE_QUATERNION:
                    valueStore.referenceValue.multiplyToRef(key.value, key.value);
                    break;
                case Animation.ANIMATIONTYPE_VECTOR2:
                case Animation.ANIMATIONTYPE_VECTOR3:
                case Animation.ANIMATIONTYPE_COLOR3:
                case Animation.ANIMATIONTYPE_COLOR4:
                    key.value.subtractToRef(valueStore.referenceValue, key.value);
                    break;
                case Animation.ANIMATIONTYPE_SIZE:
                    key.value.width -= valueStore.referenceValue.width;
                    key.value.height -= valueStore.referenceValue.height;
                    break;
                default:
                    key.value -= valueStore.referenceValue;
            }
        }
        return animation;
    };
    /**
     * Transition property of an host to the target Value
     * @param property The property to transition
     * @param targetValue The target Value of the property
     * @param host The object where the property to animate belongs
     * @param scene Scene used to run the animation
     * @param frameRate Framerate (in frame/s) to use
     * @param transition The transition type we want to use
     * @param duration The duration of the animation, in milliseconds
     * @param onAnimationEnd Callback trigger at the end of the animation
     * @returns Nullable animation
     */
    Animation.TransitionTo = function (property, targetValue, host, scene, frameRate, transition, duration, onAnimationEnd) {
        if (onAnimationEnd === void 0) { onAnimationEnd = null; }
        if (duration <= 0) {
            host[property] = targetValue;
            if (onAnimationEnd) {
                onAnimationEnd();
            }
            return null;
        }
        var endFrame = frameRate * (duration / 1000);
        transition.setKeys([{
                frame: 0,
                value: host[property].clone ? host[property].clone() : host[property]
            },
            {
                frame: endFrame,
                value: targetValue
            }]);
        if (!host.animations) {
            host.animations = [];
        }
        host.animations.push(transition);
        var animation = scene.beginAnimation(host, 0, endFrame, false);
        animation.onAnimationEnd = onAnimationEnd;
        return animation;
    };
    Object.defineProperty(Animation.prototype, "runtimeAnimations", {
        /**
         * Return the array of runtime animations currently using this animation
         */
        get: function () {
            return this._runtimeAnimations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "hasRunningRuntimeAnimations", {
        /**
         * Specifies if any of the runtime animations are currently running
         */
        get: function () {
            for (var _i = 0, _a = this._runtimeAnimations; _i < _a.length; _i++) {
                var runtimeAnimation = _a[_i];
                if (!runtimeAnimation.isStopped) {
                    return true;
                }
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    // Methods
    /**
     * Converts the animation to a string
     * @param fullDetails support for multiple levels of logging within scene loading
     * @returns String form of the animation
     */
    Animation.prototype.toString = function (fullDetails) {
        var ret = "Name: " + this.name + ", property: " + this.targetProperty;
        ret += ", datatype: " + (["Float", "Vector3", "Quaternion", "Matrix", "Color3", "Vector2"])[this.dataType];
        ret += ", nKeys: " + (this._keys ? this._keys.length : "none");
        ret += ", nRanges: " + (this._ranges ? Object.keys(this._ranges).length : "none");
        if (fullDetails) {
            ret += ", Ranges: {";
            var first = true;
            for (var name in this._ranges) {
                if (first) {
                    ret += ", ";
                    first = false;
                }
                ret += name;
            }
            ret += "}";
        }
        return ret;
    };
    /**
     * Add an event to this animation
     * @param event Event to add
     */
    Animation.prototype.addEvent = function (event) {
        this._events.push(event);
        this._events.sort(function (a, b) { return a.frame - b.frame; });
    };
    /**
     * Remove all events found at the given frame
     * @param frame The frame to remove events from
     */
    Animation.prototype.removeEvents = function (frame) {
        for (var index = 0; index < this._events.length; index++) {
            if (this._events[index].frame === frame) {
                this._events.splice(index, 1);
                index--;
            }
        }
    };
    /**
     * Retrieves all the events from the animation
     * @returns Events from the animation
     */
    Animation.prototype.getEvents = function () {
        return this._events;
    };
    /**
     * Creates an animation range
     * @param name Name of the animation range
     * @param from Starting frame of the animation range
     * @param to Ending frame of the animation
     */
    Animation.prototype.createRange = function (name, from, to) {
        // check name not already in use; could happen for bones after serialized
        if (!this._ranges[name]) {
            this._ranges[name] = new AnimationRange(name, from, to);
        }
    };
    /**
     * Deletes an animation range by name
     * @param name Name of the animation range to delete
     * @param deleteFrames Specifies if the key frames for the range should also be deleted (true) or not (false)
     */
    Animation.prototype.deleteRange = function (name, deleteFrames) {
        if (deleteFrames === void 0) { deleteFrames = true; }
        var range = this._ranges[name];
        if (!range) {
            return;
        }
        if (deleteFrames) {
            var from = range.from;
            var to = range.to;
            // this loop MUST go high to low for multiple splices to work
            for (var key = this._keys.length - 1; key >= 0; key--) {
                if (this._keys[key].frame >= from && this._keys[key].frame <= to) {
                    this._keys.splice(key, 1);
                }
            }
        }
        this._ranges[name] = null; // said much faster than 'delete this._range[name]'
    };
    /**
     * Gets the animation range by name, or null if not defined
     * @param name Name of the animation range
     * @returns Nullable animation range
     */
    Animation.prototype.getRange = function (name) {
        return this._ranges[name];
    };
    /**
     * Gets the key frames from the animation
     * @returns The key frames of the animation
     */
    Animation.prototype.getKeys = function () {
        return this._keys;
    };
    /**
     * Gets the highest frame rate of the animation
     * @returns Highest frame rate of the animation
     */
    Animation.prototype.getHighestFrame = function () {
        var ret = 0;
        for (var key = 0, nKeys = this._keys.length; key < nKeys; key++) {
            if (ret < this._keys[key].frame) {
                ret = this._keys[key].frame;
            }
        }
        return ret;
    };
    /**
     * Gets the easing function of the animation
     * @returns Easing function of the animation
     */
    Animation.prototype.getEasingFunction = function () {
        return this._easingFunction;
    };
    /**
     * Sets the easing function of the animation
     * @param easingFunction A custom mathematical formula for animation
     */
    Animation.prototype.setEasingFunction = function (easingFunction) {
        this._easingFunction = easingFunction;
    };
    /**
     * Interpolates a scalar linearly
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated scalar value
     */
    Animation.prototype.floatInterpolateFunction = function (startValue, endValue, gradient) {
        return Scalar.Lerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a scalar cubically
     * @param startValue Start value of the animation curve
     * @param outTangent End tangent of the animation
     * @param endValue End value of the animation curve
     * @param inTangent Start tangent of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated scalar value
     */
    Animation.prototype.floatInterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
        return Scalar.Hermite(startValue, outTangent, endValue, inTangent, gradient);
    };
    /**
     * Interpolates a quaternion using a spherical linear interpolation
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated quaternion value
     */
    Animation.prototype.quaternionInterpolateFunction = function (startValue, endValue, gradient) {
        return Quaternion.Slerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a quaternion cubically
     * @param startValue Start value of the animation curve
     * @param outTangent End tangent of the animation curve
     * @param endValue End value of the animation curve
     * @param inTangent Start tangent of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated quaternion value
     */
    Animation.prototype.quaternionInterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
        return Quaternion.Hermite(startValue, outTangent, endValue, inTangent, gradient).normalize();
    };
    /**
     * Interpolates a Vector3 linearl
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated scalar value
     */
    Animation.prototype.vector3InterpolateFunction = function (startValue, endValue, gradient) {
        return Vector3.Lerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a Vector3 cubically
     * @param startValue Start value of the animation curve
     * @param outTangent End tangent of the animation
     * @param endValue End value of the animation curve
     * @param inTangent Start tangent of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns InterpolatedVector3 value
     */
    Animation.prototype.vector3InterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
        return Vector3.Hermite(startValue, outTangent, endValue, inTangent, gradient);
    };
    /**
     * Interpolates a Vector2 linearly
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated Vector2 value
     */
    Animation.prototype.vector2InterpolateFunction = function (startValue, endValue, gradient) {
        return Vector2.Lerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a Vector2 cubically
     * @param startValue Start value of the animation curve
     * @param outTangent End tangent of the animation
     * @param endValue End value of the animation curve
     * @param inTangent Start tangent of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated Vector2 value
     */
    Animation.prototype.vector2InterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
        return Vector2.Hermite(startValue, outTangent, endValue, inTangent, gradient);
    };
    /**
     * Interpolates a size linearly
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated Size value
     */
    Animation.prototype.sizeInterpolateFunction = function (startValue, endValue, gradient) {
        return Size.Lerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a Color3 linearly
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated Color3 value
     */
    Animation.prototype.color3InterpolateFunction = function (startValue, endValue, gradient) {
        return Color3.Lerp(startValue, endValue, gradient);
    };
    /**
     * Interpolates a Color4 linearly
     * @param startValue Start value of the animation curve
     * @param endValue End value of the animation curve
     * @param gradient Scalar amount to interpolate
     * @returns Interpolated Color3 value
     */
    Animation.prototype.color4InterpolateFunction = function (startValue, endValue, gradient) {
        return Color4.Lerp(startValue, endValue, gradient);
    };
    /**
     * @hidden Internal use only
     */
    Animation.prototype._getKeyValue = function (value) {
        if (typeof value === "function") {
            return value();
        }
        return value;
    };
    /**
     * @hidden Internal use only
     */
    Animation.prototype._interpolate = function (currentFrame, state) {
        if (state.loopMode === Animation.ANIMATIONLOOPMODE_CONSTANT && state.repeatCount > 0) {
            return state.highLimitValue.clone ? state.highLimitValue.clone() : state.highLimitValue;
        }
        var keys = this._keys;
        if (keys.length === 1) {
            return this._getKeyValue(keys[0].value);
        }
        var startKeyIndex = state.key;
        if (keys[startKeyIndex].frame >= currentFrame) {
            while (startKeyIndex - 1 >= 0 && keys[startKeyIndex].frame >= currentFrame) {
                startKeyIndex--;
            }
        }
        for (var key = startKeyIndex; key < keys.length; key++) {
            var endKey = keys[key + 1];
            if (endKey.frame >= currentFrame) {
                state.key = key;
                var startKey = keys[key];
                var startValue = this._getKeyValue(startKey.value);
                if (startKey.interpolation === AnimationKeyInterpolation.STEP) {
                    return startValue;
                }
                var endValue = this._getKeyValue(endKey.value);
                var useTangent = startKey.outTangent !== undefined && endKey.inTangent !== undefined;
                var frameDelta = endKey.frame - startKey.frame;
                // gradient : percent of currentFrame between the frame inf and the frame sup
                var gradient = (currentFrame - startKey.frame) / frameDelta;
                // check for easingFunction and correction of gradient
                var easingFunction = this.getEasingFunction();
                if (easingFunction != null) {
                    gradient = easingFunction.ease(gradient);
                }
                switch (this.dataType) {
                    // Float
                    case Animation.ANIMATIONTYPE_FLOAT:
                        var floatValue = useTangent ? this.floatInterpolateFunctionWithTangents(startValue, startKey.outTangent * frameDelta, endValue, endKey.inTangent * frameDelta, gradient) : this.floatInterpolateFunction(startValue, endValue, gradient);
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return floatValue;
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return state.offsetValue * state.repeatCount + floatValue;
                        }
                        break;
                    // Quaternion
                    case Animation.ANIMATIONTYPE_QUATERNION:
                        var quatValue = useTangent ? this.quaternionInterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.quaternionInterpolateFunction(startValue, endValue, gradient);
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return quatValue;
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return quatValue.addInPlace(state.offsetValue.scale(state.repeatCount));
                        }
                        return quatValue;
                    // Vector3
                    case Animation.ANIMATIONTYPE_VECTOR3:
                        var vec3Value = useTangent ? this.vector3InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.vector3InterpolateFunction(startValue, endValue, gradient);
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return vec3Value;
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return vec3Value.add(state.offsetValue.scale(state.repeatCount));
                        }
                    // Vector2
                    case Animation.ANIMATIONTYPE_VECTOR2:
                        var vec2Value = useTangent ? this.vector2InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.vector2InterpolateFunction(startValue, endValue, gradient);
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return vec2Value;
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return vec2Value.add(state.offsetValue.scale(state.repeatCount));
                        }
                    // Size
                    case Animation.ANIMATIONTYPE_SIZE:
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return this.sizeInterpolateFunction(startValue, endValue, gradient);
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return this.sizeInterpolateFunction(startValue, endValue, gradient).add(state.offsetValue.scale(state.repeatCount));
                        }
                    // Color3
                    case Animation.ANIMATIONTYPE_COLOR3:
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return this.color3InterpolateFunction(startValue, endValue, gradient);
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return this.color3InterpolateFunction(startValue, endValue, gradient).add(state.offsetValue.scale(state.repeatCount));
                        }
                    // Color4
                    case Animation.ANIMATIONTYPE_COLOR4:
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                return this.color4InterpolateFunction(startValue, endValue, gradient);
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return this.color4InterpolateFunction(startValue, endValue, gradient).add(state.offsetValue.scale(state.repeatCount));
                        }
                    // Matrix
                    case Animation.ANIMATIONTYPE_MATRIX:
                        switch (state.loopMode) {
                            case Animation.ANIMATIONLOOPMODE_CYCLE:
                            case Animation.ANIMATIONLOOPMODE_CONSTANT:
                                if (Animation.AllowMatricesInterpolation) {
                                    return this.matrixInterpolateFunction(startValue, endValue, gradient, state.workValue);
                                }
                            case Animation.ANIMATIONLOOPMODE_RELATIVE:
                                return startValue;
                        }
                }
                break;
            }
        }
        return this._getKeyValue(keys[keys.length - 1].value);
    };
    /**
     * Defines the function to use to interpolate matrices
     * @param startValue defines the start matrix
     * @param endValue defines the end matrix
     * @param gradient defines the gradient between both matrices
     * @param result defines an optional target matrix where to store the interpolation
     * @returns the interpolated matrix
     */
    Animation.prototype.matrixInterpolateFunction = function (startValue, endValue, gradient, result) {
        if (Animation.AllowMatrixDecomposeForInterpolation) {
            if (result) {
                Matrix.DecomposeLerpToRef(startValue, endValue, gradient, result);
                return result;
            }
            return Matrix.DecomposeLerp(startValue, endValue, gradient);
        }
        if (result) {
            Matrix.LerpToRef(startValue, endValue, gradient, result);
            return result;
        }
        return Matrix.Lerp(startValue, endValue, gradient);
    };
    /**
     * Makes a copy of the animation
     * @returns Cloned animation
     */
    Animation.prototype.clone = function () {
        var clone = new Animation(this.name, this.targetPropertyPath.join("."), this.framePerSecond, this.dataType, this.loopMode);
        clone.enableBlending = this.enableBlending;
        clone.blendingSpeed = this.blendingSpeed;
        if (this._keys) {
            clone.setKeys(this._keys);
        }
        if (this._ranges) {
            clone._ranges = {};
            for (var name in this._ranges) {
                var range = this._ranges[name];
                if (!range) {
                    continue;
                }
                clone._ranges[name] = range.clone();
            }
        }
        return clone;
    };
    /**
     * Sets the key frames of the animation
     * @param values The animation key frames to set
     */
    Animation.prototype.setKeys = function (values) {
        this._keys = values.slice(0);
    };
    /**
     * Serializes the animation to an object
     * @returns Serialized object
     */
    Animation.prototype.serialize = function () {
        var serializationObject = {};
        serializationObject.name = this.name;
        serializationObject.property = this.targetProperty;
        serializationObject.framePerSecond = this.framePerSecond;
        serializationObject.dataType = this.dataType;
        serializationObject.loopBehavior = this.loopMode;
        serializationObject.enableBlending = this.enableBlending;
        serializationObject.blendingSpeed = this.blendingSpeed;
        var dataType = this.dataType;
        serializationObject.keys = [];
        var keys = this.getKeys();
        for (var index = 0; index < keys.length; index++) {
            var animationKey = keys[index];
            var key = {};
            key.frame = animationKey.frame;
            switch (dataType) {
                case Animation.ANIMATIONTYPE_FLOAT:
                    key.values = [animationKey.value];
                    if (animationKey.inTangent !== undefined) {
                        key.values.push(animationKey.inTangent);
                    }
                    if (animationKey.outTangent !== undefined) {
                        if (animationKey.inTangent === undefined) {
                            key.values.push(undefined);
                        }
                        key.values.push(animationKey.outTangent);
                    }
                    break;
                case Animation.ANIMATIONTYPE_QUATERNION:
                case Animation.ANIMATIONTYPE_MATRIX:
                case Animation.ANIMATIONTYPE_VECTOR3:
                case Animation.ANIMATIONTYPE_COLOR3:
                case Animation.ANIMATIONTYPE_COLOR4:
                    key.values = animationKey.value.asArray();
                    if (animationKey.inTangent != undefined) {
                        key.values.push(animationKey.inTangent.asArray());
                    }
                    if (animationKey.outTangent != undefined) {
                        if (animationKey.inTangent === undefined) {
                            key.values.push(undefined);
                        }
                        key.values.push(animationKey.outTangent.asArray());
                    }
                    break;
            }
            serializationObject.keys.push(key);
        }
        serializationObject.ranges = [];
        for (var name in this._ranges) {
            var source = this._ranges[name];
            if (!source) {
                continue;
            }
            var range = {};
            range.name = name;
            range.from = source.from;
            range.to = source.to;
            serializationObject.ranges.push(range);
        }
        return serializationObject;
    };
    /** @hidden */
    Animation._UniversalLerp = function (left, right, amount) {
        var constructor = left.constructor;
        if (constructor.Lerp) { // Lerp supported
            return constructor.Lerp(left, right, amount);
        }
        else if (constructor.Slerp) { // Slerp supported
            return constructor.Slerp(left, right, amount);
        }
        else if (left.toFixed) { // Number
            return left * (1.0 - amount) + amount * right;
        }
        else { // Blending not supported
            return right;
        }
    };
    /**
     * Parses an animation object and creates an animation
     * @param parsedAnimation Parsed animation object
     * @returns Animation object
     */
    Animation.Parse = function (parsedAnimation) {
        var animation = new Animation(parsedAnimation.name, parsedAnimation.property, parsedAnimation.framePerSecond, parsedAnimation.dataType, parsedAnimation.loopBehavior);
        var dataType = parsedAnimation.dataType;
        var keys = [];
        var data;
        var index;
        if (parsedAnimation.enableBlending) {
            animation.enableBlending = parsedAnimation.enableBlending;
        }
        if (parsedAnimation.blendingSpeed) {
            animation.blendingSpeed = parsedAnimation.blendingSpeed;
        }
        for (index = 0; index < parsedAnimation.keys.length; index++) {
            var key = parsedAnimation.keys[index];
            var inTangent;
            var outTangent;
            switch (dataType) {
                case Animation.ANIMATIONTYPE_FLOAT:
                    data = key.values[0];
                    if (key.values.length >= 1) {
                        inTangent = key.values[1];
                    }
                    if (key.values.length >= 2) {
                        outTangent = key.values[2];
                    }
                    break;
                case Animation.ANIMATIONTYPE_QUATERNION:
                    data = Quaternion.FromArray(key.values);
                    if (key.values.length >= 8) {
                        var _inTangent = Quaternion.FromArray(key.values.slice(4, 8));
                        if (!_inTangent.equals(Quaternion.Zero())) {
                            inTangent = _inTangent;
                        }
                    }
                    if (key.values.length >= 12) {
                        var _outTangent = Quaternion.FromArray(key.values.slice(8, 12));
                        if (!_outTangent.equals(Quaternion.Zero())) {
                            outTangent = _outTangent;
                        }
                    }
                    break;
                case Animation.ANIMATIONTYPE_MATRIX:
                    data = Matrix.FromArray(key.values);
                    break;
                case Animation.ANIMATIONTYPE_COLOR3:
                    data = Color3.FromArray(key.values);
                    break;
                case Animation.ANIMATIONTYPE_COLOR4:
                    data = Color4.FromArray(key.values);
                    break;
                case Animation.ANIMATIONTYPE_VECTOR3:
                default:
                    data = Vector3.FromArray(key.values);
                    break;
            }
            var keyData = {};
            keyData.frame = key.frame;
            keyData.value = data;
            if (inTangent != undefined) {
                keyData.inTangent = inTangent;
            }
            if (outTangent != undefined) {
                keyData.outTangent = outTangent;
            }
            keys.push(keyData);
        }
        animation.setKeys(keys);
        if (parsedAnimation.ranges) {
            for (index = 0; index < parsedAnimation.ranges.length; index++) {
                data = parsedAnimation.ranges[index];
                animation.createRange(data.name, data.from, data.to);
            }
        }
        return animation;
    };
    /**
     * Appends the serialized animations from the source animations
     * @param source Source containing the animations
     * @param destination Target to store the animations
     */
    Animation.AppendSerializedAnimations = function (source, destination) {
        SerializationHelper.AppendSerializedAnimations(source, destination);
    };
    /**
     * Creates a new animation or an array of animations from a snippet saved in a remote file
     * @param name defines the name of the animation to create (can be null or empty to use the one from the json data)
     * @param url defines the url to load from
     * @returns a promise that will resolve to the new animation or an array of animations
     */
    Animation.ParseFromFileAsync = function (name, url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = new WebRequest();
            request.addEventListener("readystatechange", function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        var serializationObject = JSON.parse(request.responseText);
                        if (serializationObject.length) {
                            var output = new Array();
                            for (var _i = 0, serializationObject_1 = serializationObject; _i < serializationObject_1.length; _i++) {
                                var serializedAnimation = serializationObject_1[_i];
                                output.push(_this.Parse(serializedAnimation));
                            }
                            resolve(output);
                        }
                        else {
                            var output = _this.Parse(serializationObject);
                            if (name) {
                                output.name = name;
                            }
                            resolve(output);
                        }
                    }
                    else {
                        reject("Unable to load the animation");
                    }
                }
            });
            request.open("GET", url);
            request.send();
        });
    };
    /**
     * Creates an animation or an array of animations from a snippet saved by the Inspector
     * @param snippetId defines the snippet to load
     * @returns a promise that will resolve to the new animation or a new array of animations
     */
    Animation.CreateFromSnippetAsync = function (snippetId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = new WebRequest();
            request.addEventListener("readystatechange", function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        var snippet = JSON.parse(JSON.parse(request.responseText).jsonPayload);
                        if (snippet.animations) {
                            var serializationObject = JSON.parse(snippet.animations);
                            var output = new Array();
                            for (var _i = 0, serializationObject_2 = serializationObject; _i < serializationObject_2.length; _i++) {
                                var serializedAnimation = serializationObject_2[_i];
                                output.push(_this.Parse(serializedAnimation));
                            }
                            resolve(output);
                        }
                        else {
                            var serializationObject = JSON.parse(snippet.animation);
                            var output = _this.Parse(serializationObject);
                            output.snippetId = snippetId;
                            resolve(output);
                        }
                    }
                    else {
                        reject("Unable to load the snippet " + snippetId);
                    }
                }
            });
            request.open("GET", _this.SnippetUrl + "/" + snippetId.replace(/#/g, "/"));
            request.send();
        });
    };
    /**
     * Use matrix interpolation instead of using direct key value when animating matrices
     */
    Animation.AllowMatricesInterpolation = false;
    /**
     * When matrix interpolation is enabled, this boolean forces the system to use Matrix.DecomposeLerp instead of Matrix.Lerp. Interpolation is more precise but slower
     */
    Animation.AllowMatrixDecomposeForInterpolation = true;
    /** Define the Url to load snippets */
    Animation.SnippetUrl = "https://snippet.babylonjs.com";
    // Statics
    /**
     * Float animation type
     */
    Animation.ANIMATIONTYPE_FLOAT = 0;
    /**
     * Vector3 animation type
     */
    Animation.ANIMATIONTYPE_VECTOR3 = 1;
    /**
     * Quaternion animation type
     */
    Animation.ANIMATIONTYPE_QUATERNION = 2;
    /**
     * Matrix animation type
     */
    Animation.ANIMATIONTYPE_MATRIX = 3;
    /**
     * Color3 animation type
     */
    Animation.ANIMATIONTYPE_COLOR3 = 4;
    /**
     * Color3 animation type
     */
    Animation.ANIMATIONTYPE_COLOR4 = 7;
    /**
     * Vector2 animation type
     */
    Animation.ANIMATIONTYPE_VECTOR2 = 5;
    /**
     * Size animation type
     */
    Animation.ANIMATIONTYPE_SIZE = 6;
    /**
     * Relative Loop Mode
     */
    Animation.ANIMATIONLOOPMODE_RELATIVE = 0;
    /**
     * Cycle Loop Mode
     */
    Animation.ANIMATIONLOOPMODE_CYCLE = 1;
    /**
     * Constant Loop Mode
     */
    Animation.ANIMATIONLOOPMODE_CONSTANT = 2;
    return Animation;
}());
_TypeStore.RegisteredTypes["BABYLON.Animation"] = Animation;
Node._AnimationRangeFactory = function (name, from, to) { return new AnimationRange(name, from, to); };

// Static values to help the garbage collector
// Quaternion
var _staticOffsetValueQuaternion = Object.freeze(new Quaternion(0, 0, 0, 0));
// Vector3
var _staticOffsetValueVector3 = Object.freeze(Vector3.Zero());
// Vector2
var _staticOffsetValueVector2 = Object.freeze(Vector2.Zero());
// Size
var _staticOffsetValueSize = Object.freeze(Size.Zero());
// Color3
var _staticOffsetValueColor3 = Object.freeze(Color3.Black());
/**
 * Defines a runtime animation
 */
var RuntimeAnimation = /** @class */ (function () {
    /**
     * Create a new RuntimeAnimation object
     * @param target defines the target of the animation
     * @param animation defines the source animation object
     * @param scene defines the hosting scene
     * @param host defines the initiating Animatable
     */
    function RuntimeAnimation(target, animation, scene, host) {
        var _this = this;
        this._events = new Array();
        /**
         * The current frame of the runtime animation
         */
        this._currentFrame = 0;
        /**
         * The original value of the runtime animation
         */
        this._originalValue = new Array();
        /**
         * The original blend value of the runtime animation
         */
        this._originalBlendValue = null;
        /**
         * The offsets cache of the runtime animation
         */
        this._offsetsCache = {};
        /**
         * The high limits cache of the runtime animation
         */
        this._highLimitsCache = {};
        /**
         * Specifies if the runtime animation has been stopped
         */
        this._stopped = false;
        /**
         * The blending factor of the runtime animation
         */
        this._blendingFactor = 0;
        /**
         * The current value of the runtime animation
         */
        this._currentValue = null;
        this._currentActiveTarget = null;
        this._directTarget = null;
        /**
         * The target path of the runtime animation
         */
        this._targetPath = "";
        /**
         * The weight of the runtime animation
         */
        this._weight = 1.0;
        /**
         * The ratio offset of the runtime animation
         */
        this._ratioOffset = 0;
        /**
         * The previous delay of the runtime animation
         */
        this._previousDelay = 0;
        /**
         * The previous ratio of the runtime animation
         */
        this._previousRatio = 0;
        this._targetIsArray = false;
        this._animation = animation;
        this._target = target;
        this._scene = scene;
        this._host = host;
        this._activeTargets = [];
        animation._runtimeAnimations.push(this);
        // State
        this._animationState = {
            key: 0,
            repeatCount: 0,
            loopMode: this._getCorrectLoopMode()
        };
        if (this._animation.dataType === Animation.ANIMATIONTYPE_MATRIX) {
            this._animationState.workValue = Matrix.Zero();
        }
        // Limits
        this._keys = this._animation.getKeys();
        this._minFrame = this._keys[0].frame;
        this._maxFrame = this._keys[this._keys.length - 1].frame;
        this._minValue = this._keys[0].value;
        this._maxValue = this._keys[this._keys.length - 1].value;
        // Add a start key at frame 0 if missing
        if (this._minFrame !== 0) {
            var newKey = { frame: 0, value: this._minValue };
            this._keys.splice(0, 0, newKey);
        }
        // Check data
        if (this._target instanceof Array) {
            var index = 0;
            for (var _i = 0, _a = this._target; _i < _a.length; _i++) {
                var target_1 = _a[_i];
                this._preparePath(target_1, index);
                this._getOriginalValues(index);
                index++;
            }
            this._targetIsArray = true;
        }
        else {
            this._preparePath(this._target);
            this._getOriginalValues();
            this._targetIsArray = false;
            this._directTarget = this._activeTargets[0];
        }
        // Cloning events locally
        var events = animation.getEvents();
        if (events && events.length > 0) {
            events.forEach(function (e) {
                _this._events.push(e._clone());
            });
        }
        this._enableBlending = target && target.animationPropertiesOverride ? target.animationPropertiesOverride.enableBlending : this._animation.enableBlending;
    }
    Object.defineProperty(RuntimeAnimation.prototype, "currentFrame", {
        /**
         * Gets the current frame of the runtime animation
         */
        get: function () {
            return this._currentFrame;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RuntimeAnimation.prototype, "weight", {
        /**
         * Gets the weight of the runtime animation
         */
        get: function () {
            return this._weight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RuntimeAnimation.prototype, "currentValue", {
        /**
         * Gets the current value of the runtime animation
         */
        get: function () {
            return this._currentValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RuntimeAnimation.prototype, "targetPath", {
        /**
         * Gets the target path of the runtime animation
         */
        get: function () {
            return this._targetPath;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RuntimeAnimation.prototype, "target", {
        /**
         * Gets the actual target of the runtime animation
         */
        get: function () {
            return this._currentActiveTarget;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RuntimeAnimation.prototype, "isAdditive", {
        /**
         * Gets the additive state of the runtime animation
         */
        get: function () {
            return this._host && this._host.isAdditive;
        },
        enumerable: false,
        configurable: true
    });
    RuntimeAnimation.prototype._preparePath = function (target, targetIndex) {
        if (targetIndex === void 0) { targetIndex = 0; }
        var targetPropertyPath = this._animation.targetPropertyPath;
        if (targetPropertyPath.length > 1) {
            var property = target[targetPropertyPath[0]];
            for (var index = 1; index < targetPropertyPath.length - 1; index++) {
                property = property[targetPropertyPath[index]];
            }
            this._targetPath = targetPropertyPath[targetPropertyPath.length - 1];
            this._activeTargets[targetIndex] = property;
        }
        else {
            this._targetPath = targetPropertyPath[0];
            this._activeTargets[targetIndex] = target;
        }
    };
    Object.defineProperty(RuntimeAnimation.prototype, "animation", {
        /**
         * Gets the animation from the runtime animation
         */
        get: function () {
            return this._animation;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Resets the runtime animation to the beginning
     * @param restoreOriginal defines whether to restore the target property to the original value
     */
    RuntimeAnimation.prototype.reset = function (restoreOriginal) {
        if (restoreOriginal === void 0) { restoreOriginal = false; }
        if (restoreOriginal) {
            if (this._target instanceof Array) {
                var index = 0;
                for (var _i = 0, _a = this._target; _i < _a.length; _i++) {
                    var target = _a[_i];
                    if (this._originalValue[index] !== undefined) {
                        this._setValue(target, this._activeTargets[index], this._originalValue[index], -1, index);
                    }
                    index++;
                }
            }
            else {
                if (this._originalValue[0] !== undefined) {
                    this._setValue(this._target, this._directTarget, this._originalValue[0], -1, 0);
                }
            }
        }
        this._offsetsCache = {};
        this._highLimitsCache = {};
        this._currentFrame = 0;
        this._blendingFactor = 0;
        // Events
        for (var index = 0; index < this._events.length; index++) {
            this._events[index].isDone = false;
        }
    };
    /**
     * Specifies if the runtime animation is stopped
     * @returns Boolean specifying if the runtime animation is stopped
     */
    RuntimeAnimation.prototype.isStopped = function () {
        return this._stopped;
    };
    /**
     * Disposes of the runtime animation
     */
    RuntimeAnimation.prototype.dispose = function () {
        var index = this._animation.runtimeAnimations.indexOf(this);
        if (index > -1) {
            this._animation.runtimeAnimations.splice(index, 1);
        }
    };
    /**
     * Apply the interpolated value to the target
     * @param currentValue defines the value computed by the animation
     * @param weight defines the weight to apply to this value (Defaults to 1.0)
     */
    RuntimeAnimation.prototype.setValue = function (currentValue, weight) {
        if (this._targetIsArray) {
            for (var index = 0; index < this._target.length; index++) {
                var target = this._target[index];
                this._setValue(target, this._activeTargets[index], currentValue, weight, index);
            }
            return;
        }
        this._setValue(this._target, this._directTarget, currentValue, weight, 0);
    };
    RuntimeAnimation.prototype._getOriginalValues = function (targetIndex) {
        if (targetIndex === void 0) { targetIndex = 0; }
        var originalValue;
        var target = this._activeTargets[targetIndex];
        if (target.getRestPose && this._targetPath === "_matrix") { // For bones
            originalValue = target.getRestPose();
        }
        else {
            originalValue = target[this._targetPath];
        }
        if (originalValue && originalValue.clone) {
            this._originalValue[targetIndex] = originalValue.clone();
        }
        else {
            this._originalValue[targetIndex] = originalValue;
        }
    };
    RuntimeAnimation.prototype._setValue = function (target, destination, currentValue, weight, targetIndex) {
        // Set value
        this._currentActiveTarget = destination;
        this._weight = weight;
        if (this._enableBlending && this._blendingFactor <= 1.0) {
            if (!this._originalBlendValue) {
                var originalValue = destination[this._targetPath];
                if (originalValue.clone) {
                    this._originalBlendValue = originalValue.clone();
                }
                else {
                    this._originalBlendValue = originalValue;
                }
            }
            if (this._originalBlendValue.m) { // Matrix
                if (Animation.AllowMatrixDecomposeForInterpolation) {
                    if (this._currentValue) {
                        Matrix.DecomposeLerpToRef(this._originalBlendValue, currentValue, this._blendingFactor, this._currentValue);
                    }
                    else {
                        this._currentValue = Matrix.DecomposeLerp(this._originalBlendValue, currentValue, this._blendingFactor);
                    }
                }
                else {
                    if (this._currentValue) {
                        Matrix.LerpToRef(this._originalBlendValue, currentValue, this._blendingFactor, this._currentValue);
                    }
                    else {
                        this._currentValue = Matrix.Lerp(this._originalBlendValue, currentValue, this._blendingFactor);
                    }
                }
            }
            else {
                this._currentValue = Animation._UniversalLerp(this._originalBlendValue, currentValue, this._blendingFactor);
            }
            var blendingSpeed = target && target.animationPropertiesOverride ? target.animationPropertiesOverride.blendingSpeed : this._animation.blendingSpeed;
            this._blendingFactor += blendingSpeed;
        }
        else {
            this._currentValue = currentValue;
        }
        if (weight !== -1.0) {
            this._scene._registerTargetForLateAnimationBinding(this, this._originalValue[targetIndex]);
        }
        else {
            destination[this._targetPath] = this._currentValue;
        }
        if (target.markAsDirty) {
            target.markAsDirty(this._animation.targetProperty);
        }
    };
    /**
     * Gets the loop pmode of the runtime animation
     * @returns Loop Mode
     */
    RuntimeAnimation.prototype._getCorrectLoopMode = function () {
        if (this._target && this._target.animationPropertiesOverride) {
            return this._target.animationPropertiesOverride.loopMode;
        }
        return this._animation.loopMode;
    };
    /**
     * Move the current animation to a given frame
     * @param frame defines the frame to move to
     */
    RuntimeAnimation.prototype.goToFrame = function (frame) {
        var keys = this._animation.getKeys();
        if (frame < keys[0].frame) {
            frame = keys[0].frame;
        }
        else if (frame > keys[keys.length - 1].frame) {
            frame = keys[keys.length - 1].frame;
        }
        // Need to reset animation events
        var events = this._events;
        if (events.length) {
            for (var index = 0; index < events.length; index++) {
                if (!events[index].onlyOnce) {
                    // reset events in the future
                    events[index].isDone = events[index].frame < frame;
                }
            }
        }
        this._currentFrame = frame;
        var currentValue = this._animation._interpolate(frame, this._animationState);
        this.setValue(currentValue, -1);
    };
    /**
     * @hidden Internal use only
     */
    RuntimeAnimation.prototype._prepareForSpeedRatioChange = function (newSpeedRatio) {
        var newRatio = this._previousDelay * (this._animation.framePerSecond * newSpeedRatio) / 1000.0;
        this._ratioOffset = this._previousRatio - newRatio;
    };
    /**
     * Execute the current animation
     * @param delay defines the delay to add to the current frame
     * @param from defines the lower bound of the animation range
     * @param to defines the upper bound of the animation range
     * @param loop defines if the current animation must loop
     * @param speedRatio defines the current speed ratio
     * @param weight defines the weight of the animation (default is -1 so no weight)
     * @param onLoop optional callback called when animation loops
     * @returns a boolean indicating if the animation is running
     */
    RuntimeAnimation.prototype.animate = function (delay, from, to, loop, speedRatio, weight) {
        if (weight === void 0) { weight = -1.0; }
        var animation = this._animation;
        var targetPropertyPath = animation.targetPropertyPath;
        if (!targetPropertyPath || targetPropertyPath.length < 1) {
            this._stopped = true;
            return false;
        }
        var returnValue = true;
        // Check limits
        if (from < this._minFrame || from > this._maxFrame) {
            from = this._minFrame;
        }
        if (to < this._minFrame || to > this._maxFrame) {
            to = this._maxFrame;
        }
        var range = to - from;
        var offsetValue;
        // Compute ratio which represents the frame delta between from and to
        var ratio = (delay * (animation.framePerSecond * speedRatio) / 1000.0) + this._ratioOffset;
        var highLimitValue = 0;
        this._previousDelay = delay;
        this._previousRatio = ratio;
        if (!loop && (to >= from && ratio >= range)) { // If we are out of range and not looping get back to caller
            returnValue = false;
            highLimitValue = animation._getKeyValue(this._maxValue);
        }
        else if (!loop && (from >= to && ratio <= range)) {
            returnValue = false;
            highLimitValue = animation._getKeyValue(this._minValue);
        }
        else if (this._animationState.loopMode !== Animation.ANIMATIONLOOPMODE_CYCLE) {
            var keyOffset = to.toString() + from.toString();
            if (!this._offsetsCache[keyOffset]) {
                this._animationState.repeatCount = 0;
                this._animationState.loopMode = Animation.ANIMATIONLOOPMODE_CYCLE;
                var fromValue = animation._interpolate(from, this._animationState);
                var toValue = animation._interpolate(to, this._animationState);
                this._animationState.loopMode = this._getCorrectLoopMode();
                switch (animation.dataType) {
                    // Float
                    case Animation.ANIMATIONTYPE_FLOAT:
                        this._offsetsCache[keyOffset] = toValue - fromValue;
                        break;
                    // Quaternion
                    case Animation.ANIMATIONTYPE_QUATERNION:
                        this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                        break;
                    // Vector3
                    case Animation.ANIMATIONTYPE_VECTOR3:
                        this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                    // Vector2
                    case Animation.ANIMATIONTYPE_VECTOR2:
                        this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                    // Size
                    case Animation.ANIMATIONTYPE_SIZE:
                        this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                    // Color3
                    case Animation.ANIMATIONTYPE_COLOR3:
                        this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                }
                this._highLimitsCache[keyOffset] = toValue;
            }
            highLimitValue = this._highLimitsCache[keyOffset];
            offsetValue = this._offsetsCache[keyOffset];
        }
        if (offsetValue === undefined) {
            switch (animation.dataType) {
                // Float
                case Animation.ANIMATIONTYPE_FLOAT:
                    offsetValue = 0;
                    break;
                // Quaternion
                case Animation.ANIMATIONTYPE_QUATERNION:
                    offsetValue = _staticOffsetValueQuaternion;
                    break;
                // Vector3
                case Animation.ANIMATIONTYPE_VECTOR3:
                    offsetValue = _staticOffsetValueVector3;
                    break;
                // Vector2
                case Animation.ANIMATIONTYPE_VECTOR2:
                    offsetValue = _staticOffsetValueVector2;
                    break;
                // Size
                case Animation.ANIMATIONTYPE_SIZE:
                    offsetValue = _staticOffsetValueSize;
                    break;
                // Color3
                case Animation.ANIMATIONTYPE_COLOR3:
                    offsetValue = _staticOffsetValueColor3;
            }
        }
        // Compute value
        var currentFrame;
        if (this._host && this._host.syncRoot) {
            var syncRoot = this._host.syncRoot;
            var hostNormalizedFrame = (syncRoot.masterFrame - syncRoot.fromFrame) / (syncRoot.toFrame - syncRoot.fromFrame);
            currentFrame = from + (to - from) * hostNormalizedFrame;
        }
        else {
            currentFrame = (returnValue && range !== 0) ? from + ratio % range : to;
        }
        // Reset events if looping
        var events = this._events;
        if (range > 0 && this.currentFrame > currentFrame ||
            range < 0 && this.currentFrame < currentFrame) {
            this._onLoop();
            // Need to reset animation events
            if (events.length) {
                for (var index = 0; index < events.length; index++) {
                    if (!events[index].onlyOnce) {
                        // reset event, the animation is looping
                        events[index].isDone = false;
                    }
                }
            }
        }
        this._currentFrame = currentFrame;
        this._animationState.repeatCount = range === 0 ? 0 : (ratio / range) >> 0;
        this._animationState.highLimitValue = highLimitValue;
        this._animationState.offsetValue = offsetValue;
        var currentValue = animation._interpolate(currentFrame, this._animationState);
        // Set value
        this.setValue(currentValue, weight);
        // Check events
        if (events.length) {
            for (var index = 0; index < events.length; index++) {
                // Make sure current frame has passed event frame and that event frame is within the current range
                // Also, handle both forward and reverse animations
                if ((range > 0 && currentFrame >= events[index].frame && events[index].frame >= from) ||
                    (range < 0 && currentFrame <= events[index].frame && events[index].frame <= from)) {
                    var event = events[index];
                    if (!event.isDone) {
                        // If event should be done only once, remove it.
                        if (event.onlyOnce) {
                            events.splice(index, 1);
                            index--;
                        }
                        event.isDone = true;
                        event.action(currentFrame);
                    } // Don't do anything if the event has already be done.
                }
            }
        }
        if (!returnValue) {
            this._stopped = true;
        }
        return returnValue;
    };
    return RuntimeAnimation;
}());

/**
 * Class used to store bone information
 * @see https://doc.babylonjs.com/how_to/how_to_use_bones_and_skeletons
 */
var Bone = /** @class */ (function (_super) {
    __extends(Bone, _super);
    /**
     * Create a new bone
     * @param name defines the bone name
     * @param skeleton defines the parent skeleton
     * @param parentBone defines the parent (can be null if the bone is the root)
     * @param localMatrix defines the local matrix
     * @param restPose defines the rest pose matrix
     * @param baseMatrix defines the base matrix
     * @param index defines index of the bone in the hiearchy
     */
    function Bone(
    /**
     * defines the bone name
     */
    name, skeleton, parentBone, localMatrix, restPose, baseMatrix, index) {
        if (parentBone === void 0) { parentBone = null; }
        if (localMatrix === void 0) { localMatrix = null; }
        if (restPose === void 0) { restPose = null; }
        if (baseMatrix === void 0) { baseMatrix = null; }
        if (index === void 0) { index = null; }
        var _this = _super.call(this, name, skeleton.getScene()) || this;
        _this.name = name;
        /**
         * Gets the list of child bones
         */
        _this.children = new Array();
        /** Gets the animations associated with this bone */
        _this.animations = new Array();
        /**
         * @hidden Internal only
         * Set this value to map this bone to a different index in the transform matrices
         * Set this value to -1 to exclude the bone from the transform matrices
         */
        _this._index = null;
        _this._absoluteTransform = new Matrix();
        _this._invertedAbsoluteTransform = new Matrix();
        _this._scalingDeterminant = 1;
        _this._worldTransform = new Matrix();
        _this._needToDecompose = true;
        _this._needToCompose = false;
        /** @hidden */
        _this._linkedTransformNode = null;
        /** @hidden */
        _this._waitingTransformNodeId = null;
        _this._skeleton = skeleton;
        _this._localMatrix = localMatrix ? localMatrix.clone() : Matrix.Identity();
        _this._restPose = restPose ? restPose : _this._localMatrix.clone();
        _this._bindPose = _this._localMatrix.clone();
        _this._baseMatrix = baseMatrix ? baseMatrix : _this._localMatrix.clone();
        _this._index = index;
        skeleton.bones.push(_this);
        _this.setParent(parentBone, false);
        if (baseMatrix || localMatrix) {
            _this._updateDifferenceMatrix();
        }
        return _this;
    }
    Object.defineProperty(Bone.prototype, "_matrix", {
        /** @hidden */
        get: function () {
            this._compose();
            return this._localMatrix;
        },
        /** @hidden */
        set: function (value) {
            this._localMatrix.copyFrom(value);
            this._needToDecompose = true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the current object class name.
     * @return the class name
     */
    Bone.prototype.getClassName = function () {
        return "Bone";
    };
    // Members
    /**
     * Gets the parent skeleton
     * @returns a skeleton
     */
    Bone.prototype.getSkeleton = function () {
        return this._skeleton;
    };
    /**
     * Gets parent bone
     * @returns a bone or null if the bone is the root of the bone hierarchy
     */
    Bone.prototype.getParent = function () {
        return this._parent;
    };
    /**
     * Returns an array containing the root bones
     * @returns an array containing the root bones
     */
    Bone.prototype.getChildren = function () {
        return this.children;
    };
    /**
     * Gets the node index in matrix array generated for rendering
     * @returns the node index
     */
    Bone.prototype.getIndex = function () {
        return this._index === null ? this.getSkeleton().bones.indexOf(this) : this._index;
    };
    /**
     * Sets the parent bone
     * @param parent defines the parent (can be null if the bone is the root)
     * @param updateDifferenceMatrix defines if the difference matrix must be updated
     */
    Bone.prototype.setParent = function (parent, updateDifferenceMatrix) {
        if (updateDifferenceMatrix === void 0) { updateDifferenceMatrix = true; }
        if (this._parent === parent) {
            return;
        }
        if (this._parent) {
            var index = this._parent.children.indexOf(this);
            if (index !== -1) {
                this._parent.children.splice(index, 1);
            }
        }
        this._parent = parent;
        if (this._parent) {
            this._parent.children.push(this);
        }
        if (updateDifferenceMatrix) {
            this._updateDifferenceMatrix();
        }
        this.markAsDirty();
    };
    /**
     * Gets the local matrix
     * @returns a matrix
     */
    Bone.prototype.getLocalMatrix = function () {
        this._compose();
        return this._localMatrix;
    };
    /**
     * Gets the base matrix (initial matrix which remains unchanged)
     * @returns a matrix
     */
    Bone.prototype.getBaseMatrix = function () {
        return this._baseMatrix;
    };
    /**
     * Gets the rest pose matrix
     * @returns a matrix
     */
    Bone.prototype.getRestPose = function () {
        return this._restPose;
    };
    /**
     * Sets the rest pose matrix
     * @param matrix the local-space rest pose to set for this bone
     */
    Bone.prototype.setRestPose = function (matrix) {
        this._restPose.copyFrom(matrix);
    };
    /**
     * Gets the bind pose matrix
     * @returns the bind pose matrix
     */
    Bone.prototype.getBindPose = function () {
        return this._bindPose;
    };
    /**
     * Sets the bind pose matrix
     * @param matrix the local-space bind pose to set for this bone
     */
    Bone.prototype.setBindPose = function (matrix) {
        this._bindPose.copyFrom(matrix);
    };
    /**
     * Gets a matrix used to store world matrix (ie. the matrix sent to shaders)
     */
    Bone.prototype.getWorldMatrix = function () {
        return this._worldTransform;
    };
    /**
     * Sets the local matrix to rest pose matrix
     */
    Bone.prototype.returnToRest = function () {
        if (this._skeleton._numBonesWithLinkedTransformNode > 0) {
            this.updateMatrix(this._restPose, false, false);
        }
        else {
            this.updateMatrix(this._restPose, false, true);
        }
    };
    /**
     * Gets the inverse of the absolute transform matrix.
     * This matrix will be multiplied by local matrix to get the difference matrix (ie. the difference between original state and current state)
     * @returns a matrix
     */
    Bone.prototype.getInvertedAbsoluteTransform = function () {
        return this._invertedAbsoluteTransform;
    };
    /**
     * Gets the absolute transform matrix (ie base matrix * parent world matrix)
     * @returns a matrix
     */
    Bone.prototype.getAbsoluteTransform = function () {
        return this._absoluteTransform;
    };
    /**
     * Links with the given transform node.
     * The local matrix of this bone is copied from the transform node every frame.
     * @param transformNode defines the transform node to link to
     */
    Bone.prototype.linkTransformNode = function (transformNode) {
        if (this._linkedTransformNode) {
            this._skeleton._numBonesWithLinkedTransformNode--;
        }
        this._linkedTransformNode = transformNode;
        if (this._linkedTransformNode) {
            this._skeleton._numBonesWithLinkedTransformNode++;
        }
    };
    // Properties (matches AbstractMesh properties)
    /**
     * Gets the node used to drive the bone's transformation
     * @returns a transform node or null
     */
    Bone.prototype.getTransformNode = function () {
        return this._linkedTransformNode;
    };
    Object.defineProperty(Bone.prototype, "position", {
        /** Gets or sets current position (in local space) */
        get: function () {
            this._decompose();
            return this._localPosition;
        },
        set: function (newPosition) {
            this._decompose();
            this._localPosition.copyFrom(newPosition);
            this._markAsDirtyAndCompose();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bone.prototype, "rotation", {
        /** Gets or sets current rotation (in local space) */
        get: function () {
            return this.getRotation();
        },
        set: function (newRotation) {
            this.setRotation(newRotation);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bone.prototype, "rotationQuaternion", {
        /** Gets or sets current rotation quaternion (in local space) */
        get: function () {
            this._decompose();
            return this._localRotation;
        },
        set: function (newRotation) {
            this.setRotationQuaternion(newRotation);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bone.prototype, "scaling", {
        /** Gets or sets current scaling (in local space) */
        get: function () {
            return this.getScale();
        },
        set: function (newScaling) {
            this.setScale(newScaling);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bone.prototype, "animationPropertiesOverride", {
        /**
         * Gets the animation properties override
         */
        get: function () {
            return this._skeleton.animationPropertiesOverride;
        },
        enumerable: false,
        configurable: true
    });
    // Methods
    Bone.prototype._decompose = function () {
        if (!this._needToDecompose) {
            return;
        }
        this._needToDecompose = false;
        if (!this._localScaling) {
            this._localScaling = Vector3.Zero();
            this._localRotation = Quaternion.Zero();
            this._localPosition = Vector3.Zero();
        }
        this._localMatrix.decompose(this._localScaling, this._localRotation, this._localPosition);
    };
    Bone.prototype._compose = function () {
        if (!this._needToCompose) {
            return;
        }
        if (!this._localScaling) {
            this._needToCompose = false;
            return;
        }
        this._needToCompose = false;
        Matrix.ComposeToRef(this._localScaling, this._localRotation, this._localPosition, this._localMatrix);
    };
    /**
     * Update the base and local matrices
     * @param matrix defines the new base or local matrix
     * @param updateDifferenceMatrix defines if the difference matrix must be updated
     * @param updateLocalMatrix defines if the local matrix should be updated
     */
    Bone.prototype.updateMatrix = function (matrix, updateDifferenceMatrix, updateLocalMatrix) {
        if (updateDifferenceMatrix === void 0) { updateDifferenceMatrix = true; }
        if (updateLocalMatrix === void 0) { updateLocalMatrix = true; }
        this._baseMatrix.copyFrom(matrix);
        if (updateDifferenceMatrix) {
            this._updateDifferenceMatrix();
        }
        if (updateLocalMatrix) {
            this._needToCompose = false; // in case there was a pending compose
            this._localMatrix.copyFrom(matrix);
            this._markAsDirtyAndDecompose();
        }
        else {
            this.markAsDirty();
        }
    };
    /** @hidden */
    Bone.prototype._updateDifferenceMatrix = function (rootMatrix, updateChildren) {
        if (updateChildren === void 0) { updateChildren = true; }
        if (!rootMatrix) {
            rootMatrix = this._baseMatrix;
        }
        if (this._parent) {
            rootMatrix.multiplyToRef(this._parent._absoluteTransform, this._absoluteTransform);
        }
        else {
            this._absoluteTransform.copyFrom(rootMatrix);
        }
        this._absoluteTransform.invertToRef(this._invertedAbsoluteTransform);
        if (updateChildren) {
            for (var index = 0; index < this.children.length; index++) {
                this.children[index]._updateDifferenceMatrix();
            }
        }
        this._scalingDeterminant = (this._absoluteTransform.determinant() < 0 ? -1 : 1);
    };
    /**
     * Flag the bone as dirty (Forcing it to update everything)
     */
    Bone.prototype.markAsDirty = function () {
        this._currentRenderId++;
        this._childUpdateId++;
        this._skeleton._markAsDirty();
    };
    /** @hidden */
    Bone.prototype._markAsDirtyAndCompose = function () {
        this.markAsDirty();
        this._needToCompose = true;
    };
    Bone.prototype._markAsDirtyAndDecompose = function () {
        this.markAsDirty();
        this._needToDecompose = true;
    };
    /**
     * Translate the bone in local or world space
     * @param vec The amount to translate the bone
     * @param space The space that the translation is in
     * @param mesh The mesh that this bone is attached to. This is only used in world space
     */
    Bone.prototype.translate = function (vec, space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        var lm = this.getLocalMatrix();
        if (space == Space.LOCAL) {
            lm.addAtIndex(12, vec.x);
            lm.addAtIndex(13, vec.y);
            lm.addAtIndex(14, vec.z);
        }
        else {
            var wm = null;
            //mesh.getWorldMatrix() needs to be called before skeleton.computeAbsoluteTransforms()
            if (mesh) {
                wm = mesh.getWorldMatrix();
            }
            this._skeleton.computeAbsoluteTransforms();
            var tmat = Bone._tmpMats[0];
            var tvec = Bone._tmpVecs[0];
            if (this._parent) {
                if (mesh && wm) {
                    tmat.copyFrom(this._parent.getAbsoluteTransform());
                    tmat.multiplyToRef(wm, tmat);
                }
                else {
                    tmat.copyFrom(this._parent.getAbsoluteTransform());
                }
            }
            else {
                Matrix.IdentityToRef(tmat);
            }
            tmat.setTranslationFromFloats(0, 0, 0);
            tmat.invert();
            Vector3.TransformCoordinatesToRef(vec, tmat, tvec);
            lm.addAtIndex(12, tvec.x);
            lm.addAtIndex(13, tvec.y);
            lm.addAtIndex(14, tvec.z);
        }
        this._markAsDirtyAndDecompose();
    };
    /**
     * Set the postion of the bone in local or world space
     * @param position The position to set the bone
     * @param space The space that the position is in
     * @param mesh The mesh that this bone is attached to.  This is only used in world space
     */
    Bone.prototype.setPosition = function (position, space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        var lm = this.getLocalMatrix();
        if (space == Space.LOCAL) {
            lm.setTranslationFromFloats(position.x, position.y, position.z);
        }
        else {
            var wm = null;
            //mesh.getWorldMatrix() needs to be called before skeleton.computeAbsoluteTransforms()
            if (mesh) {
                wm = mesh.getWorldMatrix();
            }
            this._skeleton.computeAbsoluteTransforms();
            var tmat = Bone._tmpMats[0];
            var vec = Bone._tmpVecs[0];
            if (this._parent) {
                if (mesh && wm) {
                    tmat.copyFrom(this._parent.getAbsoluteTransform());
                    tmat.multiplyToRef(wm, tmat);
                }
                else {
                    tmat.copyFrom(this._parent.getAbsoluteTransform());
                }
                tmat.invert();
            }
            else {
                Matrix.IdentityToRef(tmat);
            }
            Vector3.TransformCoordinatesToRef(position, tmat, vec);
            lm.setTranslationFromFloats(vec.x, vec.y, vec.z);
        }
        this._markAsDirtyAndDecompose();
    };
    /**
     * Set the absolute position of the bone (world space)
     * @param position The position to set the bone
     * @param mesh The mesh that this bone is attached to
     */
    Bone.prototype.setAbsolutePosition = function (position, mesh) {
        this.setPosition(position, Space.WORLD, mesh);
    };
    /**
     * Scale the bone on the x, y and z axes (in local space)
     * @param x The amount to scale the bone on the x axis
     * @param y The amount to scale the bone on the y axis
     * @param z The amount to scale the bone on the z axis
     * @param scaleChildren sets this to true if children of the bone should be scaled as well (false by default)
     */
    Bone.prototype.scale = function (x, y, z, scaleChildren) {
        if (scaleChildren === void 0) { scaleChildren = false; }
        var locMat = this.getLocalMatrix();
        // Apply new scaling on top of current local matrix
        var scaleMat = Bone._tmpMats[0];
        Matrix.ScalingToRef(x, y, z, scaleMat);
        scaleMat.multiplyToRef(locMat, locMat);
        // Invert scaling matrix and apply the inverse to all children
        scaleMat.invert();
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var cm = child.getLocalMatrix();
            cm.multiplyToRef(scaleMat, cm);
            cm.multiplyAtIndex(12, x);
            cm.multiplyAtIndex(13, y);
            cm.multiplyAtIndex(14, z);
            child._markAsDirtyAndDecompose();
        }
        this._markAsDirtyAndDecompose();
        if (scaleChildren) {
            for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                var child = _c[_b];
                child.scale(x, y, z, scaleChildren);
            }
        }
    };
    /**
     * Set the bone scaling in local space
     * @param scale defines the scaling vector
     */
    Bone.prototype.setScale = function (scale) {
        this._decompose();
        this._localScaling.copyFrom(scale);
        this._markAsDirtyAndCompose();
    };
    /**
     * Gets the current scaling in local space
     * @returns the current scaling vector
     */
    Bone.prototype.getScale = function () {
        this._decompose();
        return this._localScaling;
    };
    /**
     * Gets the current scaling in local space and stores it in a target vector
     * @param result defines the target vector
     */
    Bone.prototype.getScaleToRef = function (result) {
        this._decompose();
        result.copyFrom(this._localScaling);
    };
    /**
     * Set the yaw, pitch, and roll of the bone in local or world space
     * @param yaw The rotation of the bone on the y axis
     * @param pitch The rotation of the bone on the x axis
     * @param roll The rotation of the bone on the z axis
     * @param space The space that the axes of rotation are in
     * @param mesh The mesh that this bone is attached to.  This is only used in world space
     */
    Bone.prototype.setYawPitchRoll = function (yaw, pitch, roll, space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        if (space === Space.LOCAL) {
            var quat = Bone._tmpQuat;
            Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, quat);
            this.setRotationQuaternion(quat, space, mesh);
            return;
        }
        var rotMatInv = Bone._tmpMats[0];
        if (!this._getNegativeRotationToRef(rotMatInv, mesh)) {
            return;
        }
        var rotMat = Bone._tmpMats[1];
        Matrix.RotationYawPitchRollToRef(yaw, pitch, roll, rotMat);
        rotMatInv.multiplyToRef(rotMat, rotMat);
        this._rotateWithMatrix(rotMat, space, mesh);
    };
    /**
     * Add a rotation to the bone on an axis in local or world space
     * @param axis The axis to rotate the bone on
     * @param amount The amount to rotate the bone
     * @param space The space that the axis is in
     * @param mesh The mesh that this bone is attached to. This is only used in world space
     */
    Bone.prototype.rotate = function (axis, amount, space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        var rmat = Bone._tmpMats[0];
        rmat.setTranslationFromFloats(0, 0, 0);
        Matrix.RotationAxisToRef(axis, amount, rmat);
        this._rotateWithMatrix(rmat, space, mesh);
    };
    /**
     * Set the rotation of the bone to a particular axis angle in local or world space
     * @param axis The axis to rotate the bone on
     * @param angle The angle that the bone should be rotated to
     * @param space The space that the axis is in
     * @param mesh The mesh that this bone is attached to.  This is only used in world space
     */
    Bone.prototype.setAxisAngle = function (axis, angle, space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        if (space === Space.LOCAL) {
            var quat = Bone._tmpQuat;
            Quaternion.RotationAxisToRef(axis, angle, quat);
            this.setRotationQuaternion(quat, space, mesh);
            return;
        }
        var rotMatInv = Bone._tmpMats[0];
        if (!this._getNegativeRotationToRef(rotMatInv, mesh)) {
            return;
        }
        var rotMat = Bone._tmpMats[1];
        Matrix.RotationAxisToRef(axis, angle, rotMat);
        rotMatInv.multiplyToRef(rotMat, rotMat);
        this._rotateWithMatrix(rotMat, space, mesh);
    };
    /**
     * Set the euler rotation of the bone in local or world space
     * @param rotation The euler rotation that the bone should be set to
     * @param space The space that the rotation is in
     * @param mesh The mesh that this bone is attached to. This is only used in world space
     */
    Bone.prototype.setRotation = function (rotation, space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        this.setYawPitchRoll(rotation.y, rotation.x, rotation.z, space, mesh);
    };
    /**
     * Set the quaternion rotation of the bone in local or world space
     * @param quat The quaternion rotation that the bone should be set to
     * @param space The space that the rotation is in
     * @param mesh The mesh that this bone is attached to. This is only used in world space
     */
    Bone.prototype.setRotationQuaternion = function (quat, space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        if (space === Space.LOCAL) {
            this._decompose();
            this._localRotation.copyFrom(quat);
            this._markAsDirtyAndCompose();
            return;
        }
        var rotMatInv = Bone._tmpMats[0];
        if (!this._getNegativeRotationToRef(rotMatInv, mesh)) {
            return;
        }
        var rotMat = Bone._tmpMats[1];
        Matrix.FromQuaternionToRef(quat, rotMat);
        rotMatInv.multiplyToRef(rotMat, rotMat);
        this._rotateWithMatrix(rotMat, space, mesh);
    };
    /**
     * Set the rotation matrix of the bone in local or world space
     * @param rotMat The rotation matrix that the bone should be set to
     * @param space The space that the rotation is in
     * @param mesh The mesh that this bone is attached to. This is only used in world space
     */
    Bone.prototype.setRotationMatrix = function (rotMat, space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        if (space === Space.LOCAL) {
            var quat = Bone._tmpQuat;
            Quaternion.FromRotationMatrixToRef(rotMat, quat);
            this.setRotationQuaternion(quat, space, mesh);
            return;
        }
        var rotMatInv = Bone._tmpMats[0];
        if (!this._getNegativeRotationToRef(rotMatInv, mesh)) {
            return;
        }
        var rotMat2 = Bone._tmpMats[1];
        rotMat2.copyFrom(rotMat);
        rotMatInv.multiplyToRef(rotMat, rotMat2);
        this._rotateWithMatrix(rotMat2, space, mesh);
    };
    Bone.prototype._rotateWithMatrix = function (rmat, space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        var lmat = this.getLocalMatrix();
        var lx = lmat.m[12];
        var ly = lmat.m[13];
        var lz = lmat.m[14];
        var parent = this.getParent();
        var parentScale = Bone._tmpMats[3];
        var parentScaleInv = Bone._tmpMats[4];
        if (parent && space == Space.WORLD) {
            if (mesh) {
                parentScale.copyFrom(mesh.getWorldMatrix());
                parent.getAbsoluteTransform().multiplyToRef(parentScale, parentScale);
            }
            else {
                parentScale.copyFrom(parent.getAbsoluteTransform());
            }
            parentScaleInv.copyFrom(parentScale);
            parentScaleInv.invert();
            lmat.multiplyToRef(parentScale, lmat);
            lmat.multiplyToRef(rmat, lmat);
            lmat.multiplyToRef(parentScaleInv, lmat);
        }
        else {
            if (space == Space.WORLD && mesh) {
                parentScale.copyFrom(mesh.getWorldMatrix());
                parentScaleInv.copyFrom(parentScale);
                parentScaleInv.invert();
                lmat.multiplyToRef(parentScale, lmat);
                lmat.multiplyToRef(rmat, lmat);
                lmat.multiplyToRef(parentScaleInv, lmat);
            }
            else {
                lmat.multiplyToRef(rmat, lmat);
            }
        }
        lmat.setTranslationFromFloats(lx, ly, lz);
        this.computeAbsoluteTransforms();
        this._markAsDirtyAndDecompose();
    };
    Bone.prototype._getNegativeRotationToRef = function (rotMatInv, mesh) {
        var scaleMatrix = Bone._tmpMats[2];
        rotMatInv.copyFrom(this.getAbsoluteTransform());
        if (mesh) {
            rotMatInv.multiplyToRef(mesh.getWorldMatrix(), rotMatInv);
            Matrix.ScalingToRef(mesh.scaling.x, mesh.scaling.y, mesh.scaling.z, scaleMatrix);
        }
        rotMatInv.invert();
        if (isNaN(rotMatInv.m[0])) {
            // Matrix failed to invert.
            // This can happen if scale is zero for example.
            return false;
        }
        scaleMatrix.multiplyAtIndex(0, this._scalingDeterminant);
        rotMatInv.multiplyToRef(scaleMatrix, rotMatInv);
        return true;
    };
    /**
     * Get the position of the bone in local or world space
     * @param space The space that the returned position is in
     * @param mesh The mesh that this bone is attached to. This is only used in world space
     * @returns The position of the bone
     */
    Bone.prototype.getPosition = function (space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        if (mesh === void 0) { mesh = null; }
        var pos = Vector3.Zero();
        this.getPositionToRef(space, mesh, pos);
        return pos;
    };
    /**
     * Copy the position of the bone to a vector3 in local or world space
     * @param space The space that the returned position is in
     * @param mesh The mesh that this bone is attached to. This is only used in world space
     * @param result The vector3 to copy the position to
     */
    Bone.prototype.getPositionToRef = function (space, mesh, result) {
        if (space === void 0) { space = Space.LOCAL; }
        if (space == Space.LOCAL) {
            var lm = this.getLocalMatrix();
            result.x = lm.m[12];
            result.y = lm.m[13];
            result.z = lm.m[14];
        }
        else {
            var wm = null;
            //mesh.getWorldMatrix() needs to be called before skeleton.computeAbsoluteTransforms()
            if (mesh) {
                wm = mesh.getWorldMatrix();
            }
            this._skeleton.computeAbsoluteTransforms();
            var tmat = Bone._tmpMats[0];
            if (mesh && wm) {
                tmat.copyFrom(this.getAbsoluteTransform());
                tmat.multiplyToRef(wm, tmat);
            }
            else {
                tmat = this.getAbsoluteTransform();
            }
            result.x = tmat.m[12];
            result.y = tmat.m[13];
            result.z = tmat.m[14];
        }
    };
    /**
     * Get the absolute position of the bone (world space)
     * @param mesh The mesh that this bone is attached to
     * @returns The absolute position of the bone
     */
    Bone.prototype.getAbsolutePosition = function (mesh) {
        if (mesh === void 0) { mesh = null; }
        var pos = Vector3.Zero();
        this.getPositionToRef(Space.WORLD, mesh, pos);
        return pos;
    };
    /**
     * Copy the absolute position of the bone (world space) to the result param
     * @param mesh The mesh that this bone is attached to
     * @param result The vector3 to copy the absolute position to
     */
    Bone.prototype.getAbsolutePositionToRef = function (mesh, result) {
        this.getPositionToRef(Space.WORLD, mesh, result);
    };
    /**
     * Compute the absolute transforms of this bone and its children
     */
    Bone.prototype.computeAbsoluteTransforms = function () {
        this._compose();
        if (this._parent) {
            this._localMatrix.multiplyToRef(this._parent._absoluteTransform, this._absoluteTransform);
        }
        else {
            this._absoluteTransform.copyFrom(this._localMatrix);
            var poseMatrix = this._skeleton.getPoseMatrix();
            if (poseMatrix) {
                this._absoluteTransform.multiplyToRef(poseMatrix, this._absoluteTransform);
            }
        }
        var children = this.children;
        var len = children.length;
        for (var i = 0; i < len; i++) {
            children[i].computeAbsoluteTransforms();
        }
    };
    /**
     * Get the world direction from an axis that is in the local space of the bone
     * @param localAxis The local direction that is used to compute the world direction
     * @param mesh The mesh that this bone is attached to
     * @returns The world direction
     */
    Bone.prototype.getDirection = function (localAxis, mesh) {
        if (mesh === void 0) { mesh = null; }
        var result = Vector3.Zero();
        this.getDirectionToRef(localAxis, mesh, result);
        return result;
    };
    /**
     * Copy the world direction to a vector3 from an axis that is in the local space of the bone
     * @param localAxis The local direction that is used to compute the world direction
     * @param mesh The mesh that this bone is attached to
     * @param result The vector3 that the world direction will be copied to
     */
    Bone.prototype.getDirectionToRef = function (localAxis, mesh, result) {
        if (mesh === void 0) { mesh = null; }
        var wm = null;
        //mesh.getWorldMatrix() needs to be called before skeleton.computeAbsoluteTransforms()
        if (mesh) {
            wm = mesh.getWorldMatrix();
        }
        this._skeleton.computeAbsoluteTransforms();
        var mat = Bone._tmpMats[0];
        mat.copyFrom(this.getAbsoluteTransform());
        if (mesh && wm) {
            mat.multiplyToRef(wm, mat);
        }
        Vector3.TransformNormalToRef(localAxis, mat, result);
        result.normalize();
    };
    /**
     * Get the euler rotation of the bone in local or world space
     * @param space The space that the rotation should be in
     * @param mesh The mesh that this bone is attached to.  This is only used in world space
     * @returns The euler rotation
     */
    Bone.prototype.getRotation = function (space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        if (mesh === void 0) { mesh = null; }
        var result = Vector3.Zero();
        this.getRotationToRef(space, mesh, result);
        return result;
    };
    /**
     * Copy the euler rotation of the bone to a vector3.  The rotation can be in either local or world space
     * @param space The space that the rotation should be in
     * @param mesh The mesh that this bone is attached to.  This is only used in world space
     * @param result The vector3 that the rotation should be copied to
     */
    Bone.prototype.getRotationToRef = function (space, mesh, result) {
        if (space === void 0) { space = Space.LOCAL; }
        if (mesh === void 0) { mesh = null; }
        var quat = Bone._tmpQuat;
        this.getRotationQuaternionToRef(space, mesh, quat);
        quat.toEulerAnglesToRef(result);
    };
    /**
     * Get the quaternion rotation of the bone in either local or world space
     * @param space The space that the rotation should be in
     * @param mesh The mesh that this bone is attached to.  This is only used in world space
     * @returns The quaternion rotation
     */
    Bone.prototype.getRotationQuaternion = function (space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        if (mesh === void 0) { mesh = null; }
        var result = Quaternion.Identity();
        this.getRotationQuaternionToRef(space, mesh, result);
        return result;
    };
    /**
     * Copy the quaternion rotation of the bone to a quaternion.  The rotation can be in either local or world space
     * @param space The space that the rotation should be in
     * @param mesh The mesh that this bone is attached to.  This is only used in world space
     * @param result The quaternion that the rotation should be copied to
     */
    Bone.prototype.getRotationQuaternionToRef = function (space, mesh, result) {
        if (space === void 0) { space = Space.LOCAL; }
        if (mesh === void 0) { mesh = null; }
        if (space == Space.LOCAL) {
            this._decompose();
            result.copyFrom(this._localRotation);
        }
        else {
            var mat = Bone._tmpMats[0];
            var amat = this.getAbsoluteTransform();
            if (mesh) {
                amat.multiplyToRef(mesh.getWorldMatrix(), mat);
            }
            else {
                mat.copyFrom(amat);
            }
            mat.multiplyAtIndex(0, this._scalingDeterminant);
            mat.multiplyAtIndex(1, this._scalingDeterminant);
            mat.multiplyAtIndex(2, this._scalingDeterminant);
            mat.decompose(undefined, result, undefined);
        }
    };
    /**
     * Get the rotation matrix of the bone in local or world space
     * @param space The space that the rotation should be in
     * @param mesh The mesh that this bone is attached to.  This is only used in world space
     * @returns The rotation matrix
     */
    Bone.prototype.getRotationMatrix = function (space, mesh) {
        if (space === void 0) { space = Space.LOCAL; }
        var result = Matrix.Identity();
        this.getRotationMatrixToRef(space, mesh, result);
        return result;
    };
    /**
     * Copy the rotation matrix of the bone to a matrix.  The rotation can be in either local or world space
     * @param space The space that the rotation should be in
     * @param mesh The mesh that this bone is attached to.  This is only used in world space
     * @param result The quaternion that the rotation should be copied to
     */
    Bone.prototype.getRotationMatrixToRef = function (space, mesh, result) {
        if (space === void 0) { space = Space.LOCAL; }
        if (space == Space.LOCAL) {
            this.getLocalMatrix().getRotationMatrixToRef(result);
        }
        else {
            var mat = Bone._tmpMats[0];
            var amat = this.getAbsoluteTransform();
            if (mesh) {
                amat.multiplyToRef(mesh.getWorldMatrix(), mat);
            }
            else {
                mat.copyFrom(amat);
            }
            mat.multiplyAtIndex(0, this._scalingDeterminant);
            mat.multiplyAtIndex(1, this._scalingDeterminant);
            mat.multiplyAtIndex(2, this._scalingDeterminant);
            mat.getRotationMatrixToRef(result);
        }
    };
    /**
     * Get the world position of a point that is in the local space of the bone
     * @param position The local position
     * @param mesh The mesh that this bone is attached to
     * @returns The world position
     */
    Bone.prototype.getAbsolutePositionFromLocal = function (position, mesh) {
        if (mesh === void 0) { mesh = null; }
        var result = Vector3.Zero();
        this.getAbsolutePositionFromLocalToRef(position, mesh, result);
        return result;
    };
    /**
     * Get the world position of a point that is in the local space of the bone and copy it to the result param
     * @param position The local position
     * @param mesh The mesh that this bone is attached to
     * @param result The vector3 that the world position should be copied to
     */
    Bone.prototype.getAbsolutePositionFromLocalToRef = function (position, mesh, result) {
        if (mesh === void 0) { mesh = null; }
        var wm = null;
        //mesh.getWorldMatrix() needs to be called before skeleton.computeAbsoluteTransforms()
        if (mesh) {
            wm = mesh.getWorldMatrix();
        }
        this._skeleton.computeAbsoluteTransforms();
        var tmat = Bone._tmpMats[0];
        if (mesh && wm) {
            tmat.copyFrom(this.getAbsoluteTransform());
            tmat.multiplyToRef(wm, tmat);
        }
        else {
            tmat = this.getAbsoluteTransform();
        }
        Vector3.TransformCoordinatesToRef(position, tmat, result);
    };
    /**
     * Get the local position of a point that is in world space
     * @param position The world position
     * @param mesh The mesh that this bone is attached to
     * @returns The local position
     */
    Bone.prototype.getLocalPositionFromAbsolute = function (position, mesh) {
        if (mesh === void 0) { mesh = null; }
        var result = Vector3.Zero();
        this.getLocalPositionFromAbsoluteToRef(position, mesh, result);
        return result;
    };
    /**
     * Get the local position of a point that is in world space and copy it to the result param
     * @param position The world position
     * @param mesh The mesh that this bone is attached to
     * @param result The vector3 that the local position should be copied to
     */
    Bone.prototype.getLocalPositionFromAbsoluteToRef = function (position, mesh, result) {
        if (mesh === void 0) { mesh = null; }
        var wm = null;
        //mesh.getWorldMatrix() needs to be called before skeleton.computeAbsoluteTransforms()
        if (mesh) {
            wm = mesh.getWorldMatrix();
        }
        this._skeleton.computeAbsoluteTransforms();
        var tmat = Bone._tmpMats[0];
        tmat.copyFrom(this.getAbsoluteTransform());
        if (mesh && wm) {
            tmat.multiplyToRef(wm, tmat);
        }
        tmat.invert();
        Vector3.TransformCoordinatesToRef(position, tmat, result);
    };
    /**
     * Set the current local matrix as the restPose for this bone.
     */
    Bone.prototype.setCurrentPoseAsRest = function () {
        this.setRestPose(this.getLocalMatrix());
    };
    Bone._tmpVecs = ArrayTools.BuildArray(2, Vector3.Zero);
    Bone._tmpQuat = Quaternion.Identity();
    Bone._tmpMats = ArrayTools.BuildArray(5, Matrix.Identity);
    return Bone;
}(Node));

/**
 * Class used to store an actual running animation
 */
var Animatable = /** @class */ (function () {
    /**
     * Creates a new Animatable
     * @param scene defines the hosting scene
     * @param target defines the target object
     * @param fromFrame defines the starting frame number (default is 0)
     * @param toFrame defines the ending frame number (default is 100)
     * @param loopAnimation defines if the animation must loop (default is false)
     * @param speedRatio defines the factor to apply to animation speed (default is 1)
     * @param onAnimationEnd defines a callback to call when animation ends if it is not looping
     * @param animations defines a group of animation to add to the new Animatable
     * @param onAnimationLoop defines a callback to call when animation loops
     * @param isAdditive defines whether the animation should be evaluated additively
     */
    function Animatable(scene, 
    /** defines the target object */
    target, 
    /** defines the starting frame number (default is 0) */
    fromFrame, 
    /** defines the ending frame number (default is 100) */
    toFrame, 
    /** defines if the animation must loop (default is false)  */
    loopAnimation, speedRatio, 
    /** defines a callback to call when animation ends if it is not looping */
    onAnimationEnd, animations, 
    /** defines a callback to call when animation loops */
    onAnimationLoop, 
    /** defines whether the animation should be evaluated additively */
    isAdditive) {
        if (fromFrame === void 0) { fromFrame = 0; }
        if (toFrame === void 0) { toFrame = 100; }
        if (loopAnimation === void 0) { loopAnimation = false; }
        if (speedRatio === void 0) { speedRatio = 1.0; }
        if (isAdditive === void 0) { isAdditive = false; }
        this.target = target;
        this.fromFrame = fromFrame;
        this.toFrame = toFrame;
        this.loopAnimation = loopAnimation;
        this.onAnimationEnd = onAnimationEnd;
        this.onAnimationLoop = onAnimationLoop;
        this.isAdditive = isAdditive;
        this._localDelayOffset = null;
        this._pausedDelay = null;
        this._runtimeAnimations = new Array();
        this._paused = false;
        this._speedRatio = 1;
        this._weight = -1.0;
        this._syncRoot = null;
        /**
         * Gets or sets a boolean indicating if the animatable must be disposed and removed at the end of the animation.
         * This will only apply for non looping animation (default is true)
         */
        this.disposeOnEnd = true;
        /**
         * Gets a boolean indicating if the animation has started
         */
        this.animationStarted = false;
        /**
         * Observer raised when the animation ends
         */
        this.onAnimationEndObservable = new Observable();
        /**
         * Observer raised when the animation loops
         */
        this.onAnimationLoopObservable = new Observable();
        this._scene = scene;
        if (animations) {
            this.appendAnimations(target, animations);
        }
        this._speedRatio = speedRatio;
        scene._activeAnimatables.push(this);
    }
    Object.defineProperty(Animatable.prototype, "syncRoot", {
        /**
         * Gets the root Animatable used to synchronize and normalize animations
         */
        get: function () {
            return this._syncRoot;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animatable.prototype, "masterFrame", {
        /**
         * Gets the current frame of the first RuntimeAnimation
         * Used to synchronize Animatables
         */
        get: function () {
            if (this._runtimeAnimations.length === 0) {
                return 0;
            }
            return this._runtimeAnimations[0].currentFrame;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animatable.prototype, "weight", {
        /**
         * Gets or sets the animatable weight (-1.0 by default meaning not weighted)
         */
        get: function () {
            return this._weight;
        },
        set: function (value) {
            if (value === -1) { // -1 is ok and means no weight
                this._weight = -1;
                return;
            }
            // Else weight must be in [0, 1] range
            this._weight = Math.min(Math.max(value, 0), 1.0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animatable.prototype, "speedRatio", {
        /**
         * Gets or sets the speed ratio to apply to the animatable (1.0 by default)
         */
        get: function () {
            return this._speedRatio;
        },
        set: function (value) {
            for (var index = 0; index < this._runtimeAnimations.length; index++) {
                var animation = this._runtimeAnimations[index];
                animation._prepareForSpeedRatioChange(value);
            }
            this._speedRatio = value;
        },
        enumerable: false,
        configurable: true
    });
    // Methods
    /**
     * Synchronize and normalize current Animatable with a source Animatable
     * This is useful when using animation weights and when animations are not of the same length
     * @param root defines the root Animatable to synchronize with
     * @returns the current Animatable
     */
    Animatable.prototype.syncWith = function (root) {
        this._syncRoot = root;
        if (root) {
            // Make sure this animatable will animate after the root
            var index = this._scene._activeAnimatables.indexOf(this);
            if (index > -1) {
                this._scene._activeAnimatables.splice(index, 1);
                this._scene._activeAnimatables.push(this);
            }
        }
        return this;
    };
    /**
     * Gets the list of runtime animations
     * @returns an array of RuntimeAnimation
     */
    Animatable.prototype.getAnimations = function () {
        return this._runtimeAnimations;
    };
    /**
     * Adds more animations to the current animatable
     * @param target defines the target of the animations
     * @param animations defines the new animations to add
     */
    Animatable.prototype.appendAnimations = function (target, animations) {
        var _this = this;
        for (var index = 0; index < animations.length; index++) {
            var animation = animations[index];
            var newRuntimeAnimation = new RuntimeAnimation(target, animation, this._scene, this);
            newRuntimeAnimation._onLoop = function () {
                _this.onAnimationLoopObservable.notifyObservers(_this);
                if (_this.onAnimationLoop) {
                    _this.onAnimationLoop();
                }
            };
            this._runtimeAnimations.push(newRuntimeAnimation);
        }
    };
    /**
     * Gets the source animation for a specific property
     * @param property defines the propertyu to look for
     * @returns null or the source animation for the given property
     */
    Animatable.prototype.getAnimationByTargetProperty = function (property) {
        var runtimeAnimations = this._runtimeAnimations;
        for (var index = 0; index < runtimeAnimations.length; index++) {
            if (runtimeAnimations[index].animation.targetProperty === property) {
                return runtimeAnimations[index].animation;
            }
        }
        return null;
    };
    /**
     * Gets the runtime animation for a specific property
     * @param property defines the propertyu to look for
     * @returns null or the runtime animation for the given property
     */
    Animatable.prototype.getRuntimeAnimationByTargetProperty = function (property) {
        var runtimeAnimations = this._runtimeAnimations;
        for (var index = 0; index < runtimeAnimations.length; index++) {
            if (runtimeAnimations[index].animation.targetProperty === property) {
                return runtimeAnimations[index];
            }
        }
        return null;
    };
    /**
     * Resets the animatable to its original state
     */
    Animatable.prototype.reset = function () {
        var runtimeAnimations = this._runtimeAnimations;
        for (var index = 0; index < runtimeAnimations.length; index++) {
            runtimeAnimations[index].reset(true);
        }
        this._localDelayOffset = null;
        this._pausedDelay = null;
    };
    /**
     * Allows the animatable to blend with current running animations
     * @see https://doc.babylonjs.com/babylon101/animations#animation-blending
     * @param blendingSpeed defines the blending speed to use
     */
    Animatable.prototype.enableBlending = function (blendingSpeed) {
        var runtimeAnimations = this._runtimeAnimations;
        for (var index = 0; index < runtimeAnimations.length; index++) {
            runtimeAnimations[index].animation.enableBlending = true;
            runtimeAnimations[index].animation.blendingSpeed = blendingSpeed;
        }
    };
    /**
     * Disable animation blending
     * @see https://doc.babylonjs.com/babylon101/animations#animation-blending
     */
    Animatable.prototype.disableBlending = function () {
        var runtimeAnimations = this._runtimeAnimations;
        for (var index = 0; index < runtimeAnimations.length; index++) {
            runtimeAnimations[index].animation.enableBlending = false;
        }
    };
    /**
     * Jump directly to a given frame
     * @param frame defines the frame to jump to
     */
    Animatable.prototype.goToFrame = function (frame) {
        var runtimeAnimations = this._runtimeAnimations;
        if (runtimeAnimations[0]) {
            var fps = runtimeAnimations[0].animation.framePerSecond;
            var currentFrame = runtimeAnimations[0].currentFrame;
            var delay = this.speedRatio === 0 ? 0 : ((frame - currentFrame) / fps * 1000) / this.speedRatio;
            if (this._localDelayOffset === null) {
                this._localDelayOffset = 0;
            }
            this._localDelayOffset -= delay;
        }
        for (var index = 0; index < runtimeAnimations.length; index++) {
            runtimeAnimations[index].goToFrame(frame);
        }
    };
    /**
     * Pause the animation
     */
    Animatable.prototype.pause = function () {
        if (this._paused) {
            return;
        }
        this._paused = true;
    };
    /**
     * Restart the animation
     */
    Animatable.prototype.restart = function () {
        this._paused = false;
    };
    Animatable.prototype._raiseOnAnimationEnd = function () {
        if (this.onAnimationEnd) {
            this.onAnimationEnd();
        }
        this.onAnimationEndObservable.notifyObservers(this);
    };
    /**
     * Stop and delete the current animation
     * @param animationName defines a string used to only stop some of the runtime animations instead of all
     * @param targetMask - a function that determines if the animation should be stopped based on its target (all animations will be stopped if both this and animationName are empty)
     */
    Animatable.prototype.stop = function (animationName, targetMask) {
        if (animationName || targetMask) {
            var idx = this._scene._activeAnimatables.indexOf(this);
            if (idx > -1) {
                var runtimeAnimations = this._runtimeAnimations;
                for (var index = runtimeAnimations.length - 1; index >= 0; index--) {
                    var runtimeAnimation = runtimeAnimations[index];
                    if (animationName && runtimeAnimation.animation.name != animationName) {
                        continue;
                    }
                    if (targetMask && !targetMask(runtimeAnimation.target)) {
                        continue;
                    }
                    runtimeAnimation.dispose();
                    runtimeAnimations.splice(index, 1);
                }
                if (runtimeAnimations.length == 0) {
                    this._scene._activeAnimatables.splice(idx, 1);
                    this._raiseOnAnimationEnd();
                }
            }
        }
        else {
            var index = this._scene._activeAnimatables.indexOf(this);
            if (index > -1) {
                this._scene._activeAnimatables.splice(index, 1);
                var runtimeAnimations = this._runtimeAnimations;
                for (var index = 0; index < runtimeAnimations.length; index++) {
                    runtimeAnimations[index].dispose();
                }
                this._raiseOnAnimationEnd();
            }
        }
    };
    /**
     * Wait asynchronously for the animation to end
     * @returns a promise which will be fullfilled when the animation ends
     */
    Animatable.prototype.waitAsync = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.onAnimationEndObservable.add(function () {
                resolve(_this);
            }, undefined, undefined, _this, true);
        });
    };
    /** @hidden */
    Animatable.prototype._animate = function (delay) {
        if (this._paused) {
            this.animationStarted = false;
            if (this._pausedDelay === null) {
                this._pausedDelay = delay;
            }
            return true;
        }
        if (this._localDelayOffset === null) {
            this._localDelayOffset = delay;
            this._pausedDelay = null;
        }
        else if (this._pausedDelay !== null) {
            this._localDelayOffset += delay - this._pausedDelay;
            this._pausedDelay = null;
        }
        if (this._weight === 0) { // We consider that an animation with a weight === 0 is "actively" paused
            return true;
        }
        // Animating
        var running = false;
        var runtimeAnimations = this._runtimeAnimations;
        var index;
        for (index = 0; index < runtimeAnimations.length; index++) {
            var animation = runtimeAnimations[index];
            var isRunning = animation.animate(delay - this._localDelayOffset, this.fromFrame, this.toFrame, this.loopAnimation, this._speedRatio, this._weight);
            running = running || isRunning;
        }
        this.animationStarted = running;
        if (!running) {
            if (this.disposeOnEnd) {
                // Remove from active animatables
                index = this._scene._activeAnimatables.indexOf(this);
                this._scene._activeAnimatables.splice(index, 1);
                // Dispose all runtime animations
                for (index = 0; index < runtimeAnimations.length; index++) {
                    runtimeAnimations[index].dispose();
                }
            }
            this._raiseOnAnimationEnd();
            if (this.disposeOnEnd) {
                this.onAnimationEnd = null;
                this.onAnimationLoop = null;
                this.onAnimationLoopObservable.clear();
                this.onAnimationEndObservable.clear();
            }
        }
        return running;
    };
    return Animatable;
}());
Scene.prototype._animate = function () {
    if (!this.animationsEnabled) {
        return;
    }
    // Getting time
    var now = PrecisionDate.Now;
    if (!this._animationTimeLast) {
        if (this._pendingData.length > 0) {
            return;
        }
        this._animationTimeLast = now;
    }
    this.deltaTime = this.useConstantAnimationDeltaTime ? 16.0 : (now - this._animationTimeLast) * this.animationTimeScale;
    this._animationTimeLast = now;
    var animatables = this._activeAnimatables;
    if (animatables.length === 0) {
        return;
    }
    this._animationTime += this.deltaTime;
    var animationTime = this._animationTime;
    for (var index = 0; index < animatables.length; index++) {
        var animatable = animatables[index];
        if (!animatable._animate(animationTime) && animatable.disposeOnEnd) {
            index--; // Array was updated
        }
    }
    // Late animation bindings
    this._processLateAnimationBindings();
};
Scene.prototype.beginWeightedAnimation = function (target, from, to, weight, loop, speedRatio, onAnimationEnd, animatable, targetMask, onAnimationLoop, isAdditive) {
    if (weight === void 0) { weight = 1.0; }
    if (speedRatio === void 0) { speedRatio = 1.0; }
    if (isAdditive === void 0) { isAdditive = false; }
    var returnedAnimatable = this.beginAnimation(target, from, to, loop, speedRatio, onAnimationEnd, animatable, false, targetMask, onAnimationLoop, isAdditive);
    returnedAnimatable.weight = weight;
    return returnedAnimatable;
};
Scene.prototype.beginAnimation = function (target, from, to, loop, speedRatio, onAnimationEnd, animatable, stopCurrent, targetMask, onAnimationLoop, isAdditive) {
    if (speedRatio === void 0) { speedRatio = 1.0; }
    if (stopCurrent === void 0) { stopCurrent = true; }
    if (isAdditive === void 0) { isAdditive = false; }
    if (from > to && speedRatio > 0) {
        speedRatio *= -1;
    }
    if (stopCurrent) {
        this.stopAnimation(target, undefined, targetMask);
    }
    if (!animatable) {
        animatable = new Animatable(this, target, from, to, loop, speedRatio, onAnimationEnd, undefined, onAnimationLoop, isAdditive);
    }
    var shouldRunTargetAnimations = targetMask ? targetMask(target) : true;
    // Local animations
    if (target.animations && shouldRunTargetAnimations) {
        animatable.appendAnimations(target, target.animations);
    }
    // Children animations
    if (target.getAnimatables) {
        var animatables = target.getAnimatables();
        for (var index = 0; index < animatables.length; index++) {
            this.beginAnimation(animatables[index], from, to, loop, speedRatio, onAnimationEnd, animatable, stopCurrent, targetMask, onAnimationLoop);
        }
    }
    animatable.reset();
    return animatable;
};
Scene.prototype.beginHierarchyAnimation = function (target, directDescendantsOnly, from, to, loop, speedRatio, onAnimationEnd, animatable, stopCurrent, targetMask, onAnimationLoop, isAdditive) {
    if (speedRatio === void 0) { speedRatio = 1.0; }
    if (stopCurrent === void 0) { stopCurrent = true; }
    if (isAdditive === void 0) { isAdditive = false; }
    var children = target.getDescendants(directDescendantsOnly);
    var result = [];
    result.push(this.beginAnimation(target, from, to, loop, speedRatio, onAnimationEnd, animatable, stopCurrent, targetMask, undefined, isAdditive));
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        result.push(this.beginAnimation(child, from, to, loop, speedRatio, onAnimationEnd, animatable, stopCurrent, targetMask, undefined, isAdditive));
    }
    return result;
};
Scene.prototype.beginDirectAnimation = function (target, animations, from, to, loop, speedRatio, onAnimationEnd, onAnimationLoop, isAdditive) {
    if (isAdditive === void 0) { isAdditive = false; }
    if (speedRatio === undefined) {
        speedRatio = 1.0;
    }
    if (from > to && speedRatio > 0) {
        speedRatio *= -1;
    }
    var animatable = new Animatable(this, target, from, to, loop, speedRatio, onAnimationEnd, animations, onAnimationLoop, isAdditive);
    return animatable;
};
Scene.prototype.beginDirectHierarchyAnimation = function (target, directDescendantsOnly, animations, from, to, loop, speedRatio, onAnimationEnd, onAnimationLoop, isAdditive) {
    if (isAdditive === void 0) { isAdditive = false; }
    var children = target.getDescendants(directDescendantsOnly);
    var result = [];
    result.push(this.beginDirectAnimation(target, animations, from, to, loop, speedRatio, onAnimationEnd, onAnimationLoop, isAdditive));
    for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
        var child = children_2[_i];
        result.push(this.beginDirectAnimation(child, animations, from, to, loop, speedRatio, onAnimationEnd, onAnimationLoop, isAdditive));
    }
    return result;
};
Scene.prototype.getAnimatableByTarget = function (target) {
    for (var index = 0; index < this._activeAnimatables.length; index++) {
        if (this._activeAnimatables[index].target === target) {
            return this._activeAnimatables[index];
        }
    }
    return null;
};
Scene.prototype.getAllAnimatablesByTarget = function (target) {
    var result = [];
    for (var index = 0; index < this._activeAnimatables.length; index++) {
        if (this._activeAnimatables[index].target === target) {
            result.push(this._activeAnimatables[index]);
        }
    }
    return result;
};
/**
 * Will stop the animation of the given target
 * @param target - the target
 * @param animationName - the name of the animation to stop (all animations will be stopped if both this and targetMask are empty)
 * @param targetMask - a function that determines if the animation should be stopped based on its target (all animations will be stopped if both this and animationName are empty)
 */
Scene.prototype.stopAnimation = function (target, animationName, targetMask) {
    var animatables = this.getAllAnimatablesByTarget(target);
    for (var _i = 0, animatables_1 = animatables; _i < animatables_1.length; _i++) {
        var animatable = animatables_1[_i];
        animatable.stop(animationName, targetMask);
    }
};
/**
 * Stops and removes all animations that have been applied to the scene
 */
Scene.prototype.stopAllAnimations = function () {
    if (this._activeAnimatables) {
        for (var i = 0; i < this._activeAnimatables.length; i++) {
            this._activeAnimatables[i].stop();
        }
        this._activeAnimatables = [];
    }
    for (var _i = 0, _a = this.animationGroups; _i < _a.length; _i++) {
        var group = _a[_i];
        group.stop();
    }
};
Scene.prototype._registerTargetForLateAnimationBinding = function (runtimeAnimation, originalValue) {
    var target = runtimeAnimation.target;
    this._registeredForLateAnimationBindings.pushNoDuplicate(target);
    if (!target._lateAnimationHolders) {
        target._lateAnimationHolders = {};
    }
    if (!target._lateAnimationHolders[runtimeAnimation.targetPath]) {
        target._lateAnimationHolders[runtimeAnimation.targetPath] = {
            totalWeight: 0,
            totalAdditiveWeight: 0,
            animations: [],
            additiveAnimations: [],
            originalValue: originalValue
        };
    }
    if (runtimeAnimation.isAdditive) {
        target._lateAnimationHolders[runtimeAnimation.targetPath].additiveAnimations.push(runtimeAnimation);
        target._lateAnimationHolders[runtimeAnimation.targetPath].totalAdditiveWeight += runtimeAnimation.weight;
    }
    else {
        target._lateAnimationHolders[runtimeAnimation.targetPath].animations.push(runtimeAnimation);
        target._lateAnimationHolders[runtimeAnimation.targetPath].totalWeight += runtimeAnimation.weight;
    }
};
Scene.prototype._processLateAnimationBindingsForMatrices = function (holder) {
    if (holder.totalWeight === 0 && holder.totalAdditiveWeight === 0) {
        return holder.originalValue;
    }
    var normalizer = 1.0;
    var finalPosition = TmpVectors.Vector3[0];
    var finalScaling = TmpVectors.Vector3[1];
    var finalQuaternion = TmpVectors.Quaternion[0];
    var startIndex = 0;
    var originalAnimation = holder.animations[0];
    var originalValue = holder.originalValue;
    var scale = 1;
    var skipOverride = false;
    if (holder.totalWeight < 1.0) {
        // We need to mix the original value in
        scale = 1.0 - holder.totalWeight;
        originalValue.decompose(finalScaling, finalQuaternion, finalPosition);
    }
    else {
        startIndex = 1;
        // We need to normalize the weights
        normalizer = holder.totalWeight;
        scale = originalAnimation.weight / normalizer;
        if (scale == 1) {
            if (holder.totalAdditiveWeight) {
                skipOverride = true;
            }
            else {
                return originalAnimation.currentValue;
            }
        }
        originalAnimation.currentValue.decompose(finalScaling, finalQuaternion, finalPosition);
    }
    // Add up the override animations
    if (!skipOverride) {
        finalScaling.scaleInPlace(scale);
        finalPosition.scaleInPlace(scale);
        finalQuaternion.scaleInPlace(scale);
        for (var animIndex = startIndex; animIndex < holder.animations.length; animIndex++) {
            var runtimeAnimation = holder.animations[animIndex];
            if (runtimeAnimation.weight === 0) {
                continue;
            }
            var scale = runtimeAnimation.weight / normalizer;
            var currentPosition = TmpVectors.Vector3[2];
            var currentScaling = TmpVectors.Vector3[3];
            var currentQuaternion = TmpVectors.Quaternion[1];
            runtimeAnimation.currentValue.decompose(currentScaling, currentQuaternion, currentPosition);
            currentScaling.scaleAndAddToRef(scale, finalScaling);
            currentQuaternion.scaleAndAddToRef(scale, finalQuaternion);
            currentPosition.scaleAndAddToRef(scale, finalPosition);
        }
    }
    // Add up the additive animations
    for (var animIndex_1 = 0; animIndex_1 < holder.additiveAnimations.length; animIndex_1++) {
        var runtimeAnimation = holder.additiveAnimations[animIndex_1];
        if (runtimeAnimation.weight === 0) {
            continue;
        }
        var currentPosition = TmpVectors.Vector3[2];
        var currentScaling = TmpVectors.Vector3[3];
        var currentQuaternion = TmpVectors.Quaternion[1];
        runtimeAnimation.currentValue.decompose(currentScaling, currentQuaternion, currentPosition);
        currentScaling.multiplyToRef(finalScaling, currentScaling);
        Vector3.LerpToRef(finalScaling, currentScaling, runtimeAnimation.weight, finalScaling);
        finalQuaternion.multiplyToRef(currentQuaternion, currentQuaternion);
        Quaternion.SlerpToRef(finalQuaternion, currentQuaternion, runtimeAnimation.weight, finalQuaternion);
        currentPosition.scaleAndAddToRef(runtimeAnimation.weight, finalPosition);
    }
    var workValue = originalAnimation ? originalAnimation._animationState.workValue : TmpVectors.Matrix[0].clone();
    Matrix.ComposeToRef(finalScaling, finalQuaternion, finalPosition, workValue);
    return workValue;
};
Scene.prototype._processLateAnimationBindingsForQuaternions = function (holder, refQuaternion) {
    if (holder.totalWeight === 0 && holder.totalAdditiveWeight === 0) {
        return refQuaternion;
    }
    var originalAnimation = holder.animations[0];
    var originalValue = holder.originalValue;
    var cumulativeQuaternion = refQuaternion;
    if (holder.totalWeight === 0 && holder.totalAdditiveWeight > 0) {
        cumulativeQuaternion.copyFrom(originalValue);
    }
    else if (holder.animations.length === 1) {
        Quaternion.SlerpToRef(originalValue, originalAnimation.currentValue, Math.min(1.0, holder.totalWeight), cumulativeQuaternion);
        if (holder.totalAdditiveWeight === 0) {
            return cumulativeQuaternion;
        }
    }
    else if (holder.animations.length > 1) {
        // Add up the override animations
        var normalizer = 1.0;
        var quaternions = void 0;
        var weights = void 0;
        if (holder.totalWeight < 1.0) {
            var scale = 1.0 - holder.totalWeight;
            quaternions = [];
            weights = [];
            quaternions.push(originalValue);
            weights.push(scale);
        }
        else {
            if (holder.animations.length === 2) { // Slerp as soon as we can
                Quaternion.SlerpToRef(holder.animations[0].currentValue, holder.animations[1].currentValue, holder.animations[1].weight / holder.totalWeight, refQuaternion);
                if (holder.totalAdditiveWeight === 0) {
                    return refQuaternion;
                }
            }
            quaternions = [];
            weights = [];
            normalizer = holder.totalWeight;
        }
        for (var animIndex = 0; animIndex < holder.animations.length; animIndex++) {
            var runtimeAnimation = holder.animations[animIndex];
            quaternions.push(runtimeAnimation.currentValue);
            weights.push(runtimeAnimation.weight / normalizer);
        }
        // https://gamedev.stackexchange.com/questions/62354/method-for-interpolation-between-3-quaternions
        var cumulativeAmount = 0;
        for (var index = 0; index < quaternions.length;) {
            if (!index) {
                Quaternion.SlerpToRef(quaternions[index], quaternions[index + 1], weights[index + 1] / (weights[index] + weights[index + 1]), refQuaternion);
                cumulativeQuaternion = refQuaternion;
                cumulativeAmount = weights[index] + weights[index + 1];
                index += 2;
                continue;
            }
            cumulativeAmount += weights[index];
            Quaternion.SlerpToRef(cumulativeQuaternion, quaternions[index], weights[index] / cumulativeAmount, cumulativeQuaternion);
            index++;
        }
    }
    // Add up the additive animations
    for (var animIndex_2 = 0; animIndex_2 < holder.additiveAnimations.length; animIndex_2++) {
        var runtimeAnimation = holder.additiveAnimations[animIndex_2];
        if (runtimeAnimation.weight === 0) {
            continue;
        }
        cumulativeQuaternion.multiplyToRef(runtimeAnimation.currentValue, TmpVectors.Quaternion[0]);
        Quaternion.SlerpToRef(cumulativeQuaternion, TmpVectors.Quaternion[0], runtimeAnimation.weight, cumulativeQuaternion);
    }
    return cumulativeQuaternion;
};
Scene.prototype._processLateAnimationBindings = function () {
    if (!this._registeredForLateAnimationBindings.length) {
        return;
    }
    for (var index = 0; index < this._registeredForLateAnimationBindings.length; index++) {
        var target = this._registeredForLateAnimationBindings.data[index];
        for (var path in target._lateAnimationHolders) {
            var holder = target._lateAnimationHolders[path];
            var originalAnimation = holder.animations[0];
            var originalValue = holder.originalValue;
            var matrixDecomposeMode = Animation.AllowMatrixDecomposeForInterpolation && originalValue.m; // ie. data is matrix
            var finalValue = target[path];
            if (matrixDecomposeMode) {
                finalValue = this._processLateAnimationBindingsForMatrices(holder);
            }
            else {
                var quaternionMode = originalValue.w !== undefined;
                if (quaternionMode) {
                    finalValue = this._processLateAnimationBindingsForQuaternions(holder, finalValue || Quaternion.Identity());
                }
                else {
                    var startIndex = 0;
                    var normalizer = 1.0;
                    if (holder.totalWeight < 1.0) {
                        // We need to mix the original value in
                        if (originalAnimation && originalValue.scale) {
                            finalValue = originalValue.scale(1.0 - holder.totalWeight);
                        }
                        else if (originalAnimation) {
                            finalValue = originalValue * (1.0 - holder.totalWeight);
                        }
                        else if (originalValue.clone) {
                            finalValue = originalValue.clone();
                        }
                        else {
                            finalValue = originalValue;
                        }
                    }
                    else if (originalAnimation) {
                        // We need to normalize the weights
                        normalizer = holder.totalWeight;
                        var scale_1 = originalAnimation.weight / normalizer;
                        if (scale_1 !== 1) {
                            if (originalAnimation.currentValue.scale) {
                                finalValue = originalAnimation.currentValue.scale(scale_1);
                            }
                            else {
                                finalValue = originalAnimation.currentValue * scale_1;
                            }
                        }
                        else {
                            finalValue = originalAnimation.currentValue;
                        }
                        startIndex = 1;
                    }
                    // Add up the override animations
                    for (var animIndex = startIndex; animIndex < holder.animations.length; animIndex++) {
                        var runtimeAnimation = holder.animations[animIndex];
                        var scale = runtimeAnimation.weight / normalizer;
                        if (!scale) {
                            continue;
                        }
                        else if (runtimeAnimation.currentValue.scaleAndAddToRef) {
                            runtimeAnimation.currentValue.scaleAndAddToRef(scale, finalValue);
                        }
                        else {
                            finalValue += runtimeAnimation.currentValue * scale;
                        }
                    }
                    // Add up the additive animations
                    for (var animIndex_3 = 0; animIndex_3 < holder.additiveAnimations.length; animIndex_3++) {
                        var runtimeAnimation = holder.additiveAnimations[animIndex_3];
                        var scale = runtimeAnimation.weight;
                        if (!scale) {
                            continue;
                        }
                        else if (runtimeAnimation.currentValue.scaleAndAddToRef) {
                            runtimeAnimation.currentValue.scaleAndAddToRef(scale, finalValue);
                        }
                        else {
                            finalValue += runtimeAnimation.currentValue * scale;
                        }
                    }
                }
            }
            target[path] = finalValue;
        }
        target._lateAnimationHolders = {};
    }
    this._registeredForLateAnimationBindings.reset();
};
Bone.prototype.copyAnimationRange = function (source, rangeName, frameOffset, rescaleAsRequired, skelDimensionsRatio) {
    if (rescaleAsRequired === void 0) { rescaleAsRequired = false; }
    if (skelDimensionsRatio === void 0) { skelDimensionsRatio = null; }
    // all animation may be coming from a library skeleton, so may need to create animation
    if (this.animations.length === 0) {
        this.animations.push(new Animation(this.name, "_matrix", source.animations[0].framePerSecond, Animation.ANIMATIONTYPE_MATRIX, 0));
        this.animations[0].setKeys([]);
    }
    // get animation info / verify there is such a range from the source bone
    var sourceRange = source.animations[0].getRange(rangeName);
    if (!sourceRange) {
        return false;
    }
    var from = sourceRange.from;
    var to = sourceRange.to;
    var sourceKeys = source.animations[0].getKeys();
    // rescaling prep
    var sourceBoneLength = source.length;
    var sourceParent = source.getParent();
    var parent = this.getParent();
    var parentScalingReqd = rescaleAsRequired && sourceParent && sourceBoneLength && this.length && sourceBoneLength !== this.length;
    var parentRatio = parentScalingReqd && parent && sourceParent ? parent.length / sourceParent.length : 1;
    var dimensionsScalingReqd = rescaleAsRequired && !parent && skelDimensionsRatio && (skelDimensionsRatio.x !== 1 || skelDimensionsRatio.y !== 1 || skelDimensionsRatio.z !== 1);
    var destKeys = this.animations[0].getKeys();
    // loop vars declaration
    var orig;
    var origTranslation;
    var mat;
    for (var key = 0, nKeys = sourceKeys.length; key < nKeys; key++) {
        orig = sourceKeys[key];
        if (orig.frame >= from && orig.frame <= to) {
            if (rescaleAsRequired) {
                mat = orig.value.clone();
                // scale based on parent ratio, when bone has parent
                if (parentScalingReqd) {
                    origTranslation = mat.getTranslation();
                    mat.setTranslation(origTranslation.scaleInPlace(parentRatio));
                    // scale based on skeleton dimension ratio when root bone, and value is passed
                }
                else if (dimensionsScalingReqd && skelDimensionsRatio) {
                    origTranslation = mat.getTranslation();
                    mat.setTranslation(origTranslation.multiplyInPlace(skelDimensionsRatio));
                    // use original when root bone, and no data for skelDimensionsRatio
                }
                else {
                    mat = orig.value;
                }
            }
            else {
                mat = orig.value;
            }
            destKeys.push({ frame: orig.frame + frameOffset, value: mat });
        }
    }
    this.animations[0].createRange(rangeName, from + frameOffset, to + frameOffset);
    return true;
};

/**
 * This class defines the direct association between an animation and a target
 */
var TargetedAnimation = /** @class */ (function () {
    function TargetedAnimation() {
    }
    /**
     * Returns the string "TargetedAnimation"
     * @returns "TargetedAnimation"
     */
    TargetedAnimation.prototype.getClassName = function () {
        return "TargetedAnimation";
    };
    /**
     * Serialize the object
     * @returns the JSON object representing the current entity
     */
    TargetedAnimation.prototype.serialize = function () {
        var serializationObject = {};
        serializationObject.animation = this.animation.serialize();
        serializationObject.targetId = this.target.id;
        return serializationObject;
    };
    return TargetedAnimation;
}());
/**
 * Use this class to create coordinated animations on multiple targets
 */
var AnimationGroup = /** @class */ (function () {
    /**
     * Instantiates a new Animation Group.
     * This helps managing several animations at once.
     * @see https://doc.babylonjs.com/how_to/group
     * @param name Defines the name of the group
     * @param scene Defines the scene the group belongs to
     */
    function AnimationGroup(
    /** The name of the animation group */
    name, scene) {
        if (scene === void 0) { scene = null; }
        this.name = name;
        this._targetedAnimations = new Array();
        this._animatables = new Array();
        this._from = Number.MAX_VALUE;
        this._to = -Number.MAX_VALUE;
        this._speedRatio = 1;
        this._loopAnimation = false;
        this._isAdditive = false;
        /**
         * This observable will notify when one animation have ended
         */
        this.onAnimationEndObservable = new Observable();
        /**
         * Observer raised when one animation loops
         */
        this.onAnimationLoopObservable = new Observable();
        /**
         * Observer raised when all animations have looped
         */
        this.onAnimationGroupLoopObservable = new Observable();
        /**
         * This observable will notify when all animations have ended.
         */
        this.onAnimationGroupEndObservable = new Observable();
        /**
         * This observable will notify when all animations have paused.
         */
        this.onAnimationGroupPauseObservable = new Observable();
        /**
         * This observable will notify when all animations are playing.
         */
        this.onAnimationGroupPlayObservable = new Observable();
        this._scene = scene || EngineStore.LastCreatedScene;
        this.uniqueId = this._scene.getUniqueId();
        this._scene.addAnimationGroup(this);
    }
    Object.defineProperty(AnimationGroup.prototype, "from", {
        /**
         * Gets the first frame
         */
        get: function () {
            return this._from;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationGroup.prototype, "to", {
        /**
         * Gets the last frame
         */
        get: function () {
            return this._to;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationGroup.prototype, "isStarted", {
        /**
         * Define if the animations are started
         */
        get: function () {
            return this._isStarted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationGroup.prototype, "isPlaying", {
        /**
         * Gets a value indicating that the current group is playing
         */
        get: function () {
            return this._isStarted && !this._isPaused;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationGroup.prototype, "speedRatio", {
        /**
         * Gets or sets the speed ratio to use for all animations
         */
        get: function () {
            return this._speedRatio;
        },
        /**
         * Gets or sets the speed ratio to use for all animations
         */
        set: function (value) {
            if (this._speedRatio === value) {
                return;
            }
            this._speedRatio = value;
            for (var index = 0; index < this._animatables.length; index++) {
                var animatable = this._animatables[index];
                animatable.speedRatio = this._speedRatio;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationGroup.prototype, "loopAnimation", {
        /**
         * Gets or sets if all animations should loop or not
         */
        get: function () {
            return this._loopAnimation;
        },
        set: function (value) {
            if (this._loopAnimation === value) {
                return;
            }
            this._loopAnimation = value;
            for (var index = 0; index < this._animatables.length; index++) {
                var animatable = this._animatables[index];
                animatable.loopAnimation = this._loopAnimation;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationGroup.prototype, "isAdditive", {
        /**
         * Gets or sets if all animations should be evaluated additively
         */
        get: function () {
            return this._isAdditive;
        },
        set: function (value) {
            if (this._isAdditive === value) {
                return;
            }
            this._isAdditive = value;
            for (var index = 0; index < this._animatables.length; index++) {
                var animatable = this._animatables[index];
                animatable.isAdditive = this._isAdditive;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationGroup.prototype, "targetedAnimations", {
        /**
         * Gets the targeted animations for this animation group
         */
        get: function () {
            return this._targetedAnimations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationGroup.prototype, "animatables", {
        /**
         * returning the list of animatables controlled by this animation group.
         */
        get: function () {
            return this._animatables;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationGroup.prototype, "children", {
        /**
         * Gets the list of target animations
         */
        get: function () {
            return this._targetedAnimations;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Add an animation (with its target) in the group
     * @param animation defines the animation we want to add
     * @param target defines the target of the animation
     * @returns the TargetedAnimation object
     */
    AnimationGroup.prototype.addTargetedAnimation = function (animation, target) {
        var targetedAnimation = new TargetedAnimation();
        targetedAnimation.animation = animation;
        targetedAnimation.target = target;
        var keys = animation.getKeys();
        if (this._from > keys[0].frame) {
            this._from = keys[0].frame;
        }
        if (this._to < keys[keys.length - 1].frame) {
            this._to = keys[keys.length - 1].frame;
        }
        this._targetedAnimations.push(targetedAnimation);
        return targetedAnimation;
    };
    /**
     * This function will normalize every animation in the group to make sure they all go from beginFrame to endFrame
     * It can add constant keys at begin or end
     * @param beginFrame defines the new begin frame for all animations or the smallest begin frame of all animations if null (defaults to null)
     * @param endFrame defines the new end frame for all animations or the largest end frame of all animations if null (defaults to null)
     * @returns the animation group
     */
    AnimationGroup.prototype.normalize = function (beginFrame, endFrame) {
        if (beginFrame === void 0) { beginFrame = null; }
        if (endFrame === void 0) { endFrame = null; }
        if (beginFrame == null) {
            beginFrame = this._from;
        }
        if (endFrame == null) {
            endFrame = this._to;
        }
        for (var index = 0; index < this._targetedAnimations.length; index++) {
            var targetedAnimation = this._targetedAnimations[index];
            var keys = targetedAnimation.animation.getKeys();
            var startKey = keys[0];
            var endKey = keys[keys.length - 1];
            if (startKey.frame > beginFrame) {
                var newKey = {
                    frame: beginFrame,
                    value: startKey.value,
                    inTangent: startKey.inTangent,
                    outTangent: startKey.outTangent,
                    interpolation: startKey.interpolation
                };
                keys.splice(0, 0, newKey);
            }
            if (endKey.frame < endFrame) {
                var newKey = {
                    frame: endFrame,
                    value: endKey.value,
                    inTangent: endKey.inTangent,
                    outTangent: endKey.outTangent,
                    interpolation: endKey.interpolation
                };
                keys.push(newKey);
            }
        }
        this._from = beginFrame;
        this._to = endFrame;
        return this;
    };
    AnimationGroup.prototype._processLoop = function (animatable, targetedAnimation, index) {
        var _this = this;
        animatable.onAnimationLoop = function () {
            _this.onAnimationLoopObservable.notifyObservers(targetedAnimation);
            if (_this._animationLoopFlags[index]) {
                return;
            }
            _this._animationLoopFlags[index] = true;
            _this._animationLoopCount++;
            if (_this._animationLoopCount === _this._targetedAnimations.length) {
                _this.onAnimationGroupLoopObservable.notifyObservers(_this);
                _this._animationLoopCount = 0;
                _this._animationLoopFlags = [];
            }
        };
    };
    /**
     * Start all animations on given targets
     * @param loop defines if animations must loop
     * @param speedRatio defines the ratio to apply to animation speed (1 by default)
     * @param from defines the from key (optional)
     * @param to defines the to key (optional)
     * @param isAdditive defines the additive state for the resulting animatables (optional)
     * @returns the current animation group
     */
    AnimationGroup.prototype.start = function (loop, speedRatio, from, to, isAdditive) {
        var _this = this;
        if (loop === void 0) { loop = false; }
        if (speedRatio === void 0) { speedRatio = 1; }
        if (this._isStarted || this._targetedAnimations.length === 0) {
            return this;
        }
        this._loopAnimation = loop;
        this._animationLoopCount = 0;
        this._animationLoopFlags = [];
        var _loop_1 = function () {
            var targetedAnimation = this_1._targetedAnimations[index];
            var animatable = this_1._scene.beginDirectAnimation(targetedAnimation.target, [targetedAnimation.animation], from !== undefined ? from : this_1._from, to !== undefined ? to : this_1._to, loop, speedRatio, undefined, undefined, isAdditive !== undefined ? isAdditive : this_1._isAdditive);
            animatable.onAnimationEnd = function () {
                _this.onAnimationEndObservable.notifyObservers(targetedAnimation);
                _this._checkAnimationGroupEnded(animatable);
            };
            this_1._processLoop(animatable, targetedAnimation, index);
            this_1._animatables.push(animatable);
        };
        var this_1 = this;
        for (var index = 0; index < this._targetedAnimations.length; index++) {
            _loop_1();
        }
        this._speedRatio = speedRatio;
        if (from !== undefined && to !== undefined) {
            if (from < to && this._speedRatio < 0) {
                var temp = to;
                to = from;
                from = temp;
            }
            else if (from > to && this._speedRatio > 0) {
                this._speedRatio = -speedRatio;
            }
        }
        this._isStarted = true;
        this._isPaused = false;
        this.onAnimationGroupPlayObservable.notifyObservers(this);
        return this;
    };
    /**
     * Pause all animations
     * @returns the animation group
     */
    AnimationGroup.prototype.pause = function () {
        if (!this._isStarted) {
            return this;
        }
        this._isPaused = true;
        for (var index = 0; index < this._animatables.length; index++) {
            var animatable = this._animatables[index];
            animatable.pause();
        }
        this.onAnimationGroupPauseObservable.notifyObservers(this);
        return this;
    };
    /**
     * Play all animations to initial state
     * This function will start() the animations if they were not started or will restart() them if they were paused
     * @param loop defines if animations must loop
     * @returns the animation group
     */
    AnimationGroup.prototype.play = function (loop) {
        // only if all animatables are ready and exist
        if (this.isStarted && this._animatables.length === this._targetedAnimations.length) {
            if (loop !== undefined) {
                this.loopAnimation = loop;
            }
            this.restart();
        }
        else {
            this.stop();
            this.start(loop, this._speedRatio);
        }
        this._isPaused = false;
        return this;
    };
    /**
     * Reset all animations to initial state
     * @returns the animation group
     */
    AnimationGroup.prototype.reset = function () {
        if (!this._isStarted) {
            this.play();
            this.goToFrame(0);
            this.stop();
            return this;
        }
        for (var index = 0; index < this._animatables.length; index++) {
            var animatable = this._animatables[index];
            animatable.reset();
        }
        return this;
    };
    /**
     * Restart animations from key 0
     * @returns the animation group
     */
    AnimationGroup.prototype.restart = function () {
        if (!this._isStarted) {
            return this;
        }
        for (var index = 0; index < this._animatables.length; index++) {
            var animatable = this._animatables[index];
            animatable.restart();
        }
        this.onAnimationGroupPlayObservable.notifyObservers(this);
        return this;
    };
    /**
     * Stop all animations
     * @returns the animation group
     */
    AnimationGroup.prototype.stop = function () {
        if (!this._isStarted) {
            return this;
        }
        var list = this._animatables.slice();
        for (var index = 0; index < list.length; index++) {
            list[index].stop();
        }
        this._isStarted = false;
        return this;
    };
    /**
     * Set animation weight for all animatables
     * @param weight defines the weight to use
     * @return the animationGroup
     * @see https://doc.babylonjs.com/babylon101/animations#animation-weights
     */
    AnimationGroup.prototype.setWeightForAllAnimatables = function (weight) {
        for (var index = 0; index < this._animatables.length; index++) {
            var animatable = this._animatables[index];
            animatable.weight = weight;
        }
        return this;
    };
    /**
     * Synchronize and normalize all animatables with a source animatable
     * @param root defines the root animatable to synchronize with
     * @return the animationGroup
     * @see https://doc.babylonjs.com/babylon101/animations#animation-weights
     */
    AnimationGroup.prototype.syncAllAnimationsWith = function (root) {
        for (var index = 0; index < this._animatables.length; index++) {
            var animatable = this._animatables[index];
            animatable.syncWith(root);
        }
        return this;
    };
    /**
     * Goes to a specific frame in this animation group
     * @param frame the frame number to go to
     * @return the animationGroup
     */
    AnimationGroup.prototype.goToFrame = function (frame) {
        if (!this._isStarted) {
            return this;
        }
        for (var index = 0; index < this._animatables.length; index++) {
            var animatable = this._animatables[index];
            animatable.goToFrame(frame);
        }
        return this;
    };
    /**
     * Dispose all associated resources
     */
    AnimationGroup.prototype.dispose = function () {
        this._targetedAnimations = [];
        this._animatables = [];
        var index = this._scene.animationGroups.indexOf(this);
        if (index > -1) {
            this._scene.animationGroups.splice(index, 1);
        }
        this.onAnimationEndObservable.clear();
        this.onAnimationGroupEndObservable.clear();
        this.onAnimationGroupPauseObservable.clear();
        this.onAnimationGroupPlayObservable.clear();
        this.onAnimationLoopObservable.clear();
        this.onAnimationGroupLoopObservable.clear();
    };
    AnimationGroup.prototype._checkAnimationGroupEnded = function (animatable) {
        // animatable should be taken out of the array
        var idx = this._animatables.indexOf(animatable);
        if (idx > -1) {
            this._animatables.splice(idx, 1);
        }
        // all animatables were removed? animation group ended!
        if (this._animatables.length === 0) {
            this._isStarted = false;
            this.onAnimationGroupEndObservable.notifyObservers(this);
        }
    };
    /**
     * Clone the current animation group and returns a copy
     * @param newName defines the name of the new group
     * @param targetConverter defines an optional function used to convert current animation targets to new ones
     * @returns the new aniamtion group
     */
    AnimationGroup.prototype.clone = function (newName, targetConverter) {
        var newGroup = new AnimationGroup(newName || this.name, this._scene);
        for (var _i = 0, _a = this._targetedAnimations; _i < _a.length; _i++) {
            var targetAnimation = _a[_i];
            newGroup.addTargetedAnimation(targetAnimation.animation.clone(), targetConverter ? targetConverter(targetAnimation.target) : targetAnimation.target);
        }
        return newGroup;
    };
    /**
     * Serializes the animationGroup to an object
     * @returns Serialized object
     */
    AnimationGroup.prototype.serialize = function () {
        var serializationObject = {};
        serializationObject.name = this.name;
        serializationObject.from = this.from;
        serializationObject.to = this.to;
        serializationObject.targetedAnimations = [];
        for (var targetedAnimationIndex = 0; targetedAnimationIndex < this.targetedAnimations.length; targetedAnimationIndex++) {
            var targetedAnimation = this.targetedAnimations[targetedAnimationIndex];
            serializationObject.targetedAnimations[targetedAnimationIndex] = targetedAnimation.serialize();
        }
        return serializationObject;
    };
    // Statics
    /**
     * Returns a new AnimationGroup object parsed from the source provided.
     * @param parsedAnimationGroup defines the source
     * @param scene defines the scene that will receive the animationGroup
     * @returns a new AnimationGroup
     */
    AnimationGroup.Parse = function (parsedAnimationGroup, scene) {
        var animationGroup = new AnimationGroup(parsedAnimationGroup.name, scene);
        for (var i = 0; i < parsedAnimationGroup.targetedAnimations.length; i++) {
            var targetedAnimation = parsedAnimationGroup.targetedAnimations[i];
            var animation = Animation.Parse(targetedAnimation.animation);
            var id = targetedAnimation.targetId;
            if (targetedAnimation.animation.property === "influence") { // morph target animation
                var morphTarget = scene.getMorphTargetById(id);
                if (morphTarget) {
                    animationGroup.addTargetedAnimation(animation, morphTarget);
                }
            }
            else {
                var targetNode = scene.getNodeByID(id);
                if (targetNode != null) {
                    animationGroup.addTargetedAnimation(animation, targetNode);
                }
            }
        }
        if (parsedAnimationGroup.from !== null && parsedAnimationGroup.to !== null) {
            animationGroup.normalize(parsedAnimationGroup.from, parsedAnimationGroup.to);
        }
        return animationGroup;
    };
    /**
     * Convert the keyframes for all animations belonging to the group to be relative to a given reference frame.
     * @param sourceAnimationGroup defines the AnimationGroup containing animations to convert
     * @param referenceFrame defines the frame that keyframes in the range will be relative to
     * @param range defines the name of the AnimationRange belonging to the animations in the group to convert
     * @param cloneOriginal defines whether or not to clone the group and convert the clone or convert the original group (default is false)
     * @param clonedName defines the name of the resulting cloned AnimationGroup if cloneOriginal is true
     * @returns a new AnimationGroup if cloneOriginal is true or the original AnimationGroup if cloneOriginal is false
     */
    AnimationGroup.MakeAnimationAdditive = function (sourceAnimationGroup, referenceFrame, range, cloneOriginal, clonedName) {
        if (referenceFrame === void 0) { referenceFrame = 0; }
        if (cloneOriginal === void 0) { cloneOriginal = false; }
        var animationGroup = sourceAnimationGroup;
        if (cloneOriginal) {
            animationGroup = sourceAnimationGroup.clone(clonedName || animationGroup.name);
        }
        var targetedAnimations = animationGroup.targetedAnimations;
        for (var index = 0; index < targetedAnimations.length; index++) {
            var targetedAnimation = targetedAnimations[index];
            Animation.MakeAnimationAdditive(targetedAnimation.animation, referenceFrame, range);
        }
        animationGroup.isAdditive = true;
        return animationGroup;
    };
    /**
     * Returns the string "AnimationGroup"
     * @returns "AnimationGroup"
     */
    AnimationGroup.prototype.getClassName = function () {
        return "AnimationGroup";
    };
    /**
     * Creates a detailled string about the object
     * @param fullDetails defines if the output string will support multiple levels of logging within scene loading
     * @returns a string representing the object
     */
    AnimationGroup.prototype.toString = function (fullDetails) {
        var ret = "Name: " + this.name;
        ret += ", type: " + this.getClassName();
        if (fullDetails) {
            ret += ", from: " + this._from;
            ret += ", to: " + this._to;
            ret += ", isStarted: " + this._isStarted;
            ret += ", speedRatio: " + this._speedRatio;
            ret += ", targetedAnimations length: " + this._targetedAnimations.length;
            ret += ", animatables length: " + this._animatables;
        }
        return ret;
    };
    return AnimationGroup;
}());

/**
 * Mode that determines how to handle old animation groups before loading new ones.
 */
var SceneLoaderAnimationGroupLoadingMode;
(function (SceneLoaderAnimationGroupLoadingMode) {
    /**
     * Reset all old animations to initial state then dispose them.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["Clean"] = 0] = "Clean";
    /**
     * Stop all old animations.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["Stop"] = 1] = "Stop";
    /**
     * Restart old animations from first frame.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["Sync"] = 2] = "Sync";
    /**
     * Old animations remains untouched.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["NoSync"] = 3] = "NoSync";
})(SceneLoaderAnimationGroupLoadingMode || (SceneLoaderAnimationGroupLoadingMode = {}));
/**
 * Class used to load scene from various file formats using registered plugins
 * @see https://doc.babylonjs.com/how_to/load_from_any_file_type
 */
var SceneLoader = /** @class */ (function () {
    function SceneLoader() {
    }
    Object.defineProperty(SceneLoader, "ForceFullSceneLoadingForIncremental", {
        /**
         * Gets or sets a boolean indicating if entire scene must be loaded even if scene contains incremental data
         */
        get: function () {
            return SceneLoaderFlags.ForceFullSceneLoadingForIncremental;
        },
        set: function (value) {
            SceneLoaderFlags.ForceFullSceneLoadingForIncremental = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneLoader, "ShowLoadingScreen", {
        /**
         * Gets or sets a boolean indicating if loading screen must be displayed while loading a scene
         */
        get: function () {
            return SceneLoaderFlags.ShowLoadingScreen;
        },
        set: function (value) {
            SceneLoaderFlags.ShowLoadingScreen = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneLoader, "loggingLevel", {
        /**
         * Defines the current logging level (while loading the scene)
         * @ignorenaming
         */
        get: function () {
            return SceneLoaderFlags.loggingLevel;
        },
        set: function (value) {
            SceneLoaderFlags.loggingLevel = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneLoader, "CleanBoneMatrixWeights", {
        /**
         * Gets or set a boolean indicating if matrix weights must be cleaned upon loading
         */
        get: function () {
            return SceneLoaderFlags.CleanBoneMatrixWeights;
        },
        set: function (value) {
            SceneLoaderFlags.CleanBoneMatrixWeights = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the default plugin (used to load Babylon files)
     * @returns the .babylon plugin
     */
    SceneLoader.GetDefaultPlugin = function () {
        return SceneLoader._registeredPlugins[".babylon"];
    };
    SceneLoader._GetPluginForExtension = function (extension) {
        var registeredPlugin = SceneLoader._registeredPlugins[extension];
        if (registeredPlugin) {
            return registeredPlugin;
        }
        Logger.Warn("Unable to find a plugin to load " + extension + " files. Trying to use .babylon default plugin. To load from a specific filetype (eg. gltf) see: https://doc.babylonjs.com/how_to/load_from_any_file_type");
        return SceneLoader.GetDefaultPlugin();
    };
    SceneLoader._GetPluginForDirectLoad = function (data) {
        for (var extension in SceneLoader._registeredPlugins) {
            var plugin = SceneLoader._registeredPlugins[extension].plugin;
            if (plugin.canDirectLoad && plugin.canDirectLoad(data)) {
                return SceneLoader._registeredPlugins[extension];
            }
        }
        return SceneLoader.GetDefaultPlugin();
    };
    SceneLoader._GetPluginForFilename = function (sceneFilename) {
        var queryStringPosition = sceneFilename.indexOf("?");
        if (queryStringPosition !== -1) {
            sceneFilename = sceneFilename.substring(0, queryStringPosition);
        }
        var dotPosition = sceneFilename.lastIndexOf(".");
        var extension = sceneFilename.substring(dotPosition, sceneFilename.length).toLowerCase();
        return SceneLoader._GetPluginForExtension(extension);
    };
    SceneLoader._GetDirectLoad = function (sceneFilename) {
        if (sceneFilename.substr(0, 5) === "data:") {
            return sceneFilename.substr(5);
        }
        return null;
    };
    SceneLoader._LoadData = function (fileInfo, scene, onSuccess, onProgress, onError, onDispose, pluginExtension) {
        var directLoad = SceneLoader._GetDirectLoad(fileInfo.name);
        var registeredPlugin = pluginExtension ? SceneLoader._GetPluginForExtension(pluginExtension) : (directLoad ? SceneLoader._GetPluginForDirectLoad(fileInfo.name) : SceneLoader._GetPluginForFilename(fileInfo.name));
        var plugin;
        if (registeredPlugin.plugin.createPlugin !== undefined) {
            plugin = registeredPlugin.plugin.createPlugin();
        }
        else {
            plugin = registeredPlugin.plugin;
        }
        if (!plugin) {
            throw "The loader plugin corresponding to the file type you are trying to load has not been found. If using es6, please import the plugin you wish to use before.";
        }
        SceneLoader.OnPluginActivatedObservable.notifyObservers(plugin);
        if (directLoad) {
            if (plugin.directLoad) {
                var result = plugin.directLoad(scene, directLoad);
                if (result.then) {
                    result.then(function (data) {
                        onSuccess(plugin, data);
                    }).catch(function (error) {
                        onError("Error in directLoad of _loadData: " + error, error);
                    });
                }
                else {
                    onSuccess(plugin, result);
                }
            }
            else {
                onSuccess(plugin, directLoad);
            }
            return plugin;
        }
        var useArrayBuffer = registeredPlugin.isBinary;
        var dataCallback = function (data, responseURL) {
            if (scene.isDisposed) {
                onError("Scene has been disposed");
                return;
            }
            onSuccess(plugin, data, responseURL);
        };
        var request = null;
        var pluginDisposed = false;
        var onDisposeObservable = plugin.onDisposeObservable;
        if (onDisposeObservable) {
            onDisposeObservable.add(function () {
                pluginDisposed = true;
                if (request) {
                    request.abort();
                    request = null;
                }
                onDispose();
            });
        }
        var manifestChecked = function () {
            if (pluginDisposed) {
                return;
            }
            var successCallback = function (data, request) {
                dataCallback(data, request ? request.responseURL : undefined);
            };
            var errorCallback = function (error) {
                onError(error.message, error);
            };
            request = plugin.requestFile
                ? plugin.requestFile(scene, fileInfo.url, successCallback, onProgress, useArrayBuffer, errorCallback)
                : scene._requestFile(fileInfo.url, successCallback, onProgress, true, useArrayBuffer, errorCallback);
        };
        var file = fileInfo.file || FilesInputStore.FilesToLoad[fileInfo.name.toLowerCase()];
        if (fileInfo.rootUrl.indexOf("file:") === -1 || (fileInfo.rootUrl.indexOf("file:") !== -1 && !file)) {
            var engine = scene.getEngine();
            var canUseOfflineSupport = engine.enableOfflineSupport;
            if (canUseOfflineSupport) {
                // Also check for exceptions
                var exceptionFound = false;
                for (var _i = 0, _a = scene.disableOfflineSupportExceptionRules; _i < _a.length; _i++) {
                    var regex = _a[_i];
                    if (regex.test(fileInfo.url)) {
                        exceptionFound = true;
                        break;
                    }
                }
                canUseOfflineSupport = !exceptionFound;
            }
            if (canUseOfflineSupport && Engine.OfflineProviderFactory) {
                // Checking if a manifest file has been set for this scene and if offline mode has been requested
                scene.offlineProvider = Engine.OfflineProviderFactory(fileInfo.url, manifestChecked, engine.disableManifestCheck);
            }
            else {
                manifestChecked();
            }
        }
        // Loading file from disk via input file or drag'n'drop
        else {
            if (file) {
                var errorCallback = function (error) {
                    onError(error.message, error);
                };
                request = plugin.readFile
                    ? plugin.readFile(scene, file, dataCallback, onProgress, useArrayBuffer, errorCallback)
                    : scene._readFile(file, dataCallback, onProgress, useArrayBuffer, errorCallback);
            }
            else {
                onError("Unable to find file named " + fileInfo.name);
            }
        }
        return plugin;
    };
    SceneLoader._GetFileInfo = function (rootUrl, sceneFilename) {
        var url;
        var name;
        var file = null;
        if (!sceneFilename) {
            url = rootUrl;
            name = Tools.GetFilename(rootUrl);
            rootUrl = Tools.GetFolderPath(rootUrl);
        }
        else if (sceneFilename.name) {
            var sceneFile = sceneFilename;
            url = rootUrl + sceneFile.name;
            name = sceneFile.name;
            file = sceneFile;
        }
        else {
            var filename = sceneFilename;
            if (filename.substr(0, 1) === "/") {
                Tools.Error("Wrong sceneFilename parameter");
                return null;
            }
            url = rootUrl + filename;
            name = filename;
        }
        return {
            url: url,
            rootUrl: rootUrl,
            name: name,
            file: file
        };
    };
    // Public functions
    /**
     * Gets a plugin that can load the given extension
     * @param extension defines the extension to load
     * @returns a plugin or null if none works
     */
    SceneLoader.GetPluginForExtension = function (extension) {
        return SceneLoader._GetPluginForExtension(extension).plugin;
    };
    /**
     * Gets a boolean indicating that the given extension can be loaded
     * @param extension defines the extension to load
     * @returns true if the extension is supported
     */
    SceneLoader.IsPluginForExtensionAvailable = function (extension) {
        return !!SceneLoader._registeredPlugins[extension];
    };
    /**
     * Adds a new plugin to the list of registered plugins
     * @param plugin defines the plugin to add
     */
    SceneLoader.RegisterPlugin = function (plugin) {
        if (typeof plugin.extensions === "string") {
            var extension = plugin.extensions;
            SceneLoader._registeredPlugins[extension.toLowerCase()] = {
                plugin: plugin,
                isBinary: false
            };
        }
        else {
            var extensions = plugin.extensions;
            Object.keys(extensions).forEach(function (extension) {
                SceneLoader._registeredPlugins[extension.toLowerCase()] = {
                    plugin: plugin,
                    isBinary: extensions[extension].isBinary
                };
            });
        }
    };
    /**
     * Import meshes into a scene
     * @param meshNames an array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene the instance of BABYLON.Scene to append to
     * @param onSuccess a callback with a list of imported meshes, particleSystems, skeletons, and animationGroups when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @returns The loaded plugin
     */
    SceneLoader.ImportMesh = function (meshNames, rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, pluginExtension) {
        if (sceneFilename === void 0) { sceneFilename = ""; }
        if (scene === void 0) { scene = EngineStore.LastCreatedScene; }
        if (onSuccess === void 0) { onSuccess = null; }
        if (onProgress === void 0) { onProgress = null; }
        if (onError === void 0) { onError = null; }
        if (pluginExtension === void 0) { pluginExtension = null; }
        if (!scene) {
            Logger.Error("No scene available to import mesh to");
            return null;
        }
        var fileInfo = SceneLoader._GetFileInfo(rootUrl, sceneFilename);
        if (!fileInfo) {
            return null;
        }
        var loadingToken = {};
        scene._addPendingData(loadingToken);
        var disposeHandler = function () {
            scene._removePendingData(loadingToken);
        };
        var errorHandler = function (message, exception) {
            var errorMessage = "Unable to import meshes from " + fileInfo.url + ": " + message;
            if (onError) {
                onError(scene, errorMessage, exception);
            }
            else {
                Logger.Error(errorMessage);
                // should the exception be thrown?
            }
            disposeHandler();
        };
        var progressHandler = onProgress ? function (event) {
            try {
                onProgress(event);
            }
            catch (e) {
                errorHandler("Error in onProgress callback: " + e, e);
            }
        } : undefined;
        var successHandler = function (meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights) {
            scene.importedMeshesFiles.push(fileInfo.url);
            if (onSuccess) {
                try {
                    onSuccess(meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights);
                }
                catch (e) {
                    errorHandler("Error in onSuccess callback: " + e, e);
                }
            }
            scene._removePendingData(loadingToken);
        };
        return SceneLoader._LoadData(fileInfo, scene, function (plugin, data, responseURL) {
            if (plugin.rewriteRootURL) {
                fileInfo.rootUrl = plugin.rewriteRootURL(fileInfo.rootUrl, responseURL);
            }
            if (plugin.importMesh) {
                var syncedPlugin = plugin;
                var meshes = new Array();
                var particleSystems = new Array();
                var skeletons = new Array();
                if (!syncedPlugin.importMesh(meshNames, scene, data, fileInfo.rootUrl, meshes, particleSystems, skeletons, errorHandler)) {
                    return;
                }
                scene.loadingPluginName = plugin.name;
                successHandler(meshes, particleSystems, skeletons, [], [], [], []);
            }
            else {
                var asyncedPlugin = plugin;
                asyncedPlugin.importMeshAsync(meshNames, scene, data, fileInfo.rootUrl, progressHandler, fileInfo.name).then(function (result) {
                    scene.loadingPluginName = plugin.name;
                    successHandler(result.meshes, result.particleSystems, result.skeletons, result.animationGroups, result.transformNodes, result.geometries, result.lights);
                }).catch(function (error) {
                    errorHandler(error.message, error);
                });
            }
        }, progressHandler, errorHandler, disposeHandler, pluginExtension);
    };
    /**
     * Import meshes into a scene
     * @param meshNames an array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene the instance of BABYLON.Scene to append to
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @returns The loaded list of imported meshes, particle systems, skeletons, and animation groups
     */
    SceneLoader.ImportMeshAsync = function (meshNames, rootUrl, sceneFilename, scene, onProgress, pluginExtension) {
        if (sceneFilename === void 0) { sceneFilename = ""; }
        if (scene === void 0) { scene = EngineStore.LastCreatedScene; }
        if (onProgress === void 0) { onProgress = null; }
        if (pluginExtension === void 0) { pluginExtension = null; }
        return new Promise(function (resolve, reject) {
            SceneLoader.ImportMesh(meshNames, rootUrl, sceneFilename, scene, function (meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights) {
                resolve({
                    meshes: meshes,
                    particleSystems: particleSystems,
                    skeletons: skeletons,
                    animationGroups: animationGroups,
                    transformNodes: transformNodes,
                    geometries: geometries,
                    lights: lights
                });
            }, onProgress, function (scene, message, exception) {
                reject(exception || new Error(message));
            }, pluginExtension);
        });
    };
    /**
     * Load a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param engine is the instance of BABYLON.Engine to use to create the scene
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @returns The loaded plugin
     */
    SceneLoader.Load = function (rootUrl, sceneFilename, engine, onSuccess, onProgress, onError, pluginExtension) {
        if (sceneFilename === void 0) { sceneFilename = ""; }
        if (engine === void 0) { engine = EngineStore.LastCreatedEngine; }
        if (onSuccess === void 0) { onSuccess = null; }
        if (onProgress === void 0) { onProgress = null; }
        if (onError === void 0) { onError = null; }
        if (pluginExtension === void 0) { pluginExtension = null; }
        if (!engine) {
            Tools.Error("No engine available");
            return null;
        }
        return SceneLoader.Append(rootUrl, sceneFilename, new Scene(engine), onSuccess, onProgress, onError, pluginExtension);
    };
    /**
     * Load a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param engine is the instance of BABYLON.Engine to use to create the scene
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @returns The loaded scene
     */
    SceneLoader.LoadAsync = function (rootUrl, sceneFilename, engine, onProgress, pluginExtension) {
        if (sceneFilename === void 0) { sceneFilename = ""; }
        if (engine === void 0) { engine = EngineStore.LastCreatedEngine; }
        if (onProgress === void 0) { onProgress = null; }
        if (pluginExtension === void 0) { pluginExtension = null; }
        return new Promise(function (resolve, reject) {
            SceneLoader.Load(rootUrl, sceneFilename, engine, function (scene) {
                resolve(scene);
            }, onProgress, function (scene, message, exception) {
                reject(exception || new Error(message));
            }, pluginExtension);
        });
    };
    /**
     * Append a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @returns The loaded plugin
     */
    SceneLoader.Append = function (rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, pluginExtension) {
        var _this = this;
        if (sceneFilename === void 0) { sceneFilename = ""; }
        if (scene === void 0) { scene = EngineStore.LastCreatedScene; }
        if (onSuccess === void 0) { onSuccess = null; }
        if (onProgress === void 0) { onProgress = null; }
        if (onError === void 0) { onError = null; }
        if (pluginExtension === void 0) { pluginExtension = null; }
        if (!scene) {
            Logger.Error("No scene available to append to");
            return null;
        }
        var fileInfo = SceneLoader._GetFileInfo(rootUrl, sceneFilename);
        if (!fileInfo) {
            return null;
        }
        if (SceneLoader.ShowLoadingScreen && !this._showingLoadingScreen) {
            this._showingLoadingScreen = true;
            scene.getEngine().displayLoadingUI();
            scene.executeWhenReady(function () {
                scene.getEngine().hideLoadingUI();
                _this._showingLoadingScreen = false;
            });
        }
        var loadingToken = {};
        scene._addPendingData(loadingToken);
        var disposeHandler = function () {
            scene._removePendingData(loadingToken);
        };
        var errorHandler = function (message, exception) {
            var errorMessage = "Unable to load from " + fileInfo.url + (message ? ": " + message : "");
            if (onError) {
                onError(scene, errorMessage, exception);
            }
            else {
                Logger.Error(errorMessage);
                // should the exception be thrown?
            }
            disposeHandler();
        };
        var progressHandler = onProgress ? function (event) {
            try {
                onProgress(event);
            }
            catch (e) {
                errorHandler("Error in onProgress callback", e);
            }
        } : undefined;
        var successHandler = function () {
            if (onSuccess) {
                try {
                    onSuccess(scene);
                }
                catch (e) {
                    errorHandler("Error in onSuccess callback", e);
                }
            }
            scene._removePendingData(loadingToken);
        };
        return SceneLoader._LoadData(fileInfo, scene, function (plugin, data) {
            if (plugin.load) {
                var syncedPlugin = plugin;
                if (!syncedPlugin.load(scene, data, fileInfo.rootUrl, errorHandler)) {
                    return;
                }
                scene.loadingPluginName = plugin.name;
                successHandler();
            }
            else {
                var asyncedPlugin = plugin;
                asyncedPlugin.loadAsync(scene, data, fileInfo.rootUrl, progressHandler, fileInfo.name).then(function () {
                    scene.loadingPluginName = plugin.name;
                    successHandler();
                }).catch(function (error) {
                    errorHandler(error.message, error);
                });
            }
        }, progressHandler, errorHandler, disposeHandler, pluginExtension);
    };
    /**
     * Append a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @returns The given scene
     */
    SceneLoader.AppendAsync = function (rootUrl, sceneFilename, scene, onProgress, pluginExtension) {
        if (sceneFilename === void 0) { sceneFilename = ""; }
        if (scene === void 0) { scene = EngineStore.LastCreatedScene; }
        if (onProgress === void 0) { onProgress = null; }
        if (pluginExtension === void 0) { pluginExtension = null; }
        return new Promise(function (resolve, reject) {
            SceneLoader.Append(rootUrl, sceneFilename, scene, function (scene) {
                resolve(scene);
            }, onProgress, function (scene, message, exception) {
                reject(exception || new Error(message));
            }, pluginExtension);
        });
    };
    /**
     * Load a scene into an asset container
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @returns The loaded plugin
     */
    SceneLoader.LoadAssetContainer = function (rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, pluginExtension) {
        if (sceneFilename === void 0) { sceneFilename = ""; }
        if (scene === void 0) { scene = EngineStore.LastCreatedScene; }
        if (onSuccess === void 0) { onSuccess = null; }
        if (onProgress === void 0) { onProgress = null; }
        if (onError === void 0) { onError = null; }
        if (pluginExtension === void 0) { pluginExtension = null; }
        if (!scene) {
            Logger.Error("No scene available to load asset container to");
            return null;
        }
        var fileInfo = SceneLoader._GetFileInfo(rootUrl, sceneFilename);
        if (!fileInfo) {
            return null;
        }
        var loadingToken = {};
        scene._addPendingData(loadingToken);
        var disposeHandler = function () {
            scene._removePendingData(loadingToken);
        };
        var errorHandler = function (message, exception) {
            var errorMessage = "Unable to load assets from " + fileInfo.url + (message ? ": " + message : "");
            if (exception && exception.message) {
                errorMessage += " (" + exception.message + ")";
            }
            if (onError) {
                onError(scene, errorMessage, exception);
            }
            else {
                Logger.Error(errorMessage);
                // should the exception be thrown?
            }
            disposeHandler();
        };
        var progressHandler = onProgress ? function (event) {
            try {
                onProgress(event);
            }
            catch (e) {
                errorHandler("Error in onProgress callback", e);
            }
        } : undefined;
        var successHandler = function (assets) {
            if (onSuccess) {
                try {
                    onSuccess(assets);
                }
                catch (e) {
                    errorHandler("Error in onSuccess callback", e);
                }
            }
            scene._removePendingData(loadingToken);
        };
        return SceneLoader._LoadData(fileInfo, scene, function (plugin, data) {
            if (plugin.loadAssetContainer) {
                var syncedPlugin = plugin;
                var assetContainer = syncedPlugin.loadAssetContainer(scene, data, fileInfo.rootUrl, errorHandler);
                if (!assetContainer) {
                    return;
                }
                scene.loadingPluginName = plugin.name;
                successHandler(assetContainer);
            }
            else if (plugin.loadAssetContainerAsync) {
                var asyncedPlugin = plugin;
                asyncedPlugin.loadAssetContainerAsync(scene, data, fileInfo.rootUrl, progressHandler, fileInfo.name).then(function (assetContainer) {
                    scene.loadingPluginName = plugin.name;
                    successHandler(assetContainer);
                }).catch(function (error) {
                    errorHandler(error.message, error);
                });
            }
            else {
                errorHandler("LoadAssetContainer is not supported by this plugin. Plugin did not provide a loadAssetContainer or loadAssetContainerAsync method.");
            }
        }, progressHandler, errorHandler, disposeHandler, pluginExtension);
    };
    /**
     * Load a scene into an asset container
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene (default: empty string)
     * @param scene is the instance of Scene to append to
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @returns The loaded asset container
     */
    SceneLoader.LoadAssetContainerAsync = function (rootUrl, sceneFilename, scene, onProgress, pluginExtension) {
        if (sceneFilename === void 0) { sceneFilename = ""; }
        if (scene === void 0) { scene = EngineStore.LastCreatedScene; }
        if (onProgress === void 0) { onProgress = null; }
        if (pluginExtension === void 0) { pluginExtension = null; }
        return new Promise(function (resolve, reject) {
            SceneLoader.LoadAssetContainer(rootUrl, sceneFilename, scene, function (assetContainer) {
                resolve(assetContainer);
            }, onProgress, function (scene, message, exception) {
                reject(exception || new Error(message));
            }, pluginExtension);
        });
    };
    /**
     * Import animations from a file into a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param overwriteAnimations when true, animations are cleaned before importing new ones. Animations are appended otherwise
     * @param animationGroupLoadingMode defines how to handle old animations groups before importing new ones
     * @param targetConverter defines a function used to convert animation targets from loaded scene to current scene (default: search node by name)
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     */
    SceneLoader.ImportAnimations = function (rootUrl, sceneFilename, scene, overwriteAnimations, animationGroupLoadingMode, targetConverter, onSuccess, onProgress, onError, pluginExtension) {
        if (sceneFilename === void 0) { sceneFilename = ""; }
        if (scene === void 0) { scene = EngineStore.LastCreatedScene; }
        if (overwriteAnimations === void 0) { overwriteAnimations = true; }
        if (animationGroupLoadingMode === void 0) { animationGroupLoadingMode = SceneLoaderAnimationGroupLoadingMode.Clean; }
        if (targetConverter === void 0) { targetConverter = null; }
        if (onSuccess === void 0) { onSuccess = null; }
        if (onProgress === void 0) { onProgress = null; }
        if (onError === void 0) { onError = null; }
        if (pluginExtension === void 0) { pluginExtension = null; }
        if (!scene) {
            Logger.Error("No scene available to load animations to");
            return;
        }
        if (overwriteAnimations) {
            // Reset, stop and dispose all animations before loading new ones
            for (var _i = 0, _a = scene.animatables; _i < _a.length; _i++) {
                var animatable = _a[_i];
                animatable.reset();
            }
            scene.stopAllAnimations();
            scene.animationGroups.slice().forEach(function (animationGroup) {
                animationGroup.dispose();
            });
            var nodes = scene.getNodes();
            nodes.forEach(function (node) {
                if (node.animations) {
                    node.animations = [];
                }
            });
        }
        else {
            switch (animationGroupLoadingMode) {
                case SceneLoaderAnimationGroupLoadingMode.Clean:
                    scene.animationGroups.slice().forEach(function (animationGroup) {
                        animationGroup.dispose();
                    });
                    break;
                case SceneLoaderAnimationGroupLoadingMode.Stop:
                    scene.animationGroups.forEach(function (animationGroup) {
                        animationGroup.stop();
                    });
                    break;
                case SceneLoaderAnimationGroupLoadingMode.Sync:
                    scene.animationGroups.forEach(function (animationGroup) {
                        animationGroup.reset();
                        animationGroup.restart();
                    });
                    break;
                case SceneLoaderAnimationGroupLoadingMode.NoSync:
                    // nothing to do
                    break;
                default:
                    Logger.Error("Unknown animation group loading mode value '" + animationGroupLoadingMode + "'");
                    return;
            }
        }
        var startingIndexForNewAnimatables = scene.animatables.length;
        var onAssetContainerLoaded = function (container) {
            container.mergeAnimationsTo(scene, scene.animatables.slice(startingIndexForNewAnimatables), targetConverter);
            container.dispose();
            scene.onAnimationFileImportedObservable.notifyObservers(scene);
            if (onSuccess) {
                onSuccess(scene);
            }
        };
        this.LoadAssetContainer(rootUrl, sceneFilename, scene, onAssetContainerLoaded, onProgress, onError, pluginExtension);
    };
    /**
     * Import animations from a file into a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param overwriteAnimations when true, animations are cleaned before importing new ones. Animations are appended otherwise
     * @param animationGroupLoadingMode defines how to handle old animations groups before importing new ones
     * @param targetConverter defines a function used to convert animation targets from loaded scene to current scene (default: search node by name)
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @returns the updated scene with imported animations
     */
    SceneLoader.ImportAnimationsAsync = function (rootUrl, sceneFilename, scene, overwriteAnimations, animationGroupLoadingMode, targetConverter, onSuccess, onProgress, onError, pluginExtension) {
        if (sceneFilename === void 0) { sceneFilename = ""; }
        if (scene === void 0) { scene = EngineStore.LastCreatedScene; }
        if (overwriteAnimations === void 0) { overwriteAnimations = true; }
        if (animationGroupLoadingMode === void 0) { animationGroupLoadingMode = SceneLoaderAnimationGroupLoadingMode.Clean; }
        if (targetConverter === void 0) { targetConverter = null; }
        if (onProgress === void 0) { onProgress = null; }
        if (pluginExtension === void 0) { pluginExtension = null; }
        return new Promise(function (resolve, reject) {
            SceneLoader.ImportAnimations(rootUrl, sceneFilename, scene, overwriteAnimations, animationGroupLoadingMode, targetConverter, function (_scene) {
                resolve(_scene);
            }, onProgress, function (_scene, message, exception) {
                reject(exception || new Error(message));
            }, pluginExtension);
        });
    };
    /**
     * No logging while loading
     */
    SceneLoader.NO_LOGGING = 0;
    /**
     * Minimal logging while loading
     */
    SceneLoader.MINIMAL_LOGGING = 1;
    /**
     * Summary logging while loading
     */
    SceneLoader.SUMMARY_LOGGING = 2;
    /**
     * Detailled logging while loading
     */
    SceneLoader.DETAILED_LOGGING = 3;
    // Members
    /**
     * Event raised when a plugin is used to load a scene
     */
    SceneLoader.OnPluginActivatedObservable = new Observable();
    SceneLoader._registeredPlugins = {};
    SceneLoader._showingLoadingScreen = false;
    return SceneLoader;
}());

/**
 * Set of assets to keep when moving a scene into an asset container.
 */
var KeepAssets = /** @class */ (function (_super) {
    __extends(KeepAssets, _super);
    function KeepAssets() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return KeepAssets;
}(AbstractScene));
/**
 * Class used to store the output of the AssetContainer.instantiateAllMeshesToScene function
 */
var InstantiatedEntries = /** @class */ (function () {
    function InstantiatedEntries() {
        /**
         * List of new root nodes (eg. nodes with no parent)
         */
        this.rootNodes = [];
        /**
         * List of new skeletons
         */
        this.skeletons = [];
        /**
         * List of new animation groups
         */
        this.animationGroups = [];
    }
    return InstantiatedEntries;
}());
/**
 * Container with a set of assets that can be added or removed from a scene.
 */
var AssetContainer = /** @class */ (function (_super) {
    __extends(AssetContainer, _super);
    /**
     * Instantiates an AssetContainer.
     * @param scene The scene the AssetContainer belongs to.
     */
    function AssetContainer(scene) {
        var _this = _super.call(this) || this;
        _this._wasAddedToScene = false;
        _this.scene = scene;
        _this["sounds"] = [];
        _this["effectLayers"] = [];
        _this["layers"] = [];
        _this["lensFlareSystems"] = [];
        _this["proceduralTextures"] = [];
        _this["reflectionProbes"] = [];
        scene.onDisposeObservable.add(function () {
            if (!_this._wasAddedToScene) {
                _this.dispose();
            }
        });
        return _this;
    }
    /**
     * Instantiate or clone all meshes and add the new ones to the scene.
     * Skeletons and animation groups will all be cloned
     * @param nameFunction defines an optional function used to get new names for clones
     * @param cloneMaterials defines an optional boolean that defines if materials must be cloned as well (false by default)
     * @returns a list of rootNodes, skeletons and aniamtion groups that were duplicated
     */
    AssetContainer.prototype.instantiateModelsToScene = function (nameFunction, cloneMaterials) {
        var _this = this;
        if (cloneMaterials === void 0) { cloneMaterials = false; }
        var convertionMap = {};
        var storeMap = {};
        var result = new InstantiatedEntries();
        var alreadySwappedSkeletons = [];
        var alreadySwappedMaterials = [];
        var options = {
            doNotInstantiate: true
        };
        var onClone = function (source, clone) {
            convertionMap[source.uniqueId] = clone.uniqueId;
            storeMap[clone.uniqueId] = clone;
            if (nameFunction) {
                clone.name = nameFunction(source.name);
            }
            if (clone instanceof Mesh) {
                var clonedMesh = clone;
                if (clonedMesh.morphTargetManager) {
                    var oldMorphTargetManager = source.morphTargetManager;
                    clonedMesh.morphTargetManager = oldMorphTargetManager.clone();
                    for (var index = 0; index < oldMorphTargetManager.numTargets; index++) {
                        var oldTarget = oldMorphTargetManager.getTarget(index);
                        var newTarget = clonedMesh.morphTargetManager.getTarget(index);
                        convertionMap[oldTarget.uniqueId] = newTarget.uniqueId;
                        storeMap[newTarget.uniqueId] = newTarget;
                    }
                }
            }
        };
        this.transformNodes.forEach(function (o) {
            if (!o.parent) {
                var newOne = o.instantiateHierarchy(null, options, function (source, clone) {
                    onClone(source, clone);
                });
                if (newOne) {
                    result.rootNodes.push(newOne);
                }
            }
        });
        this.meshes.forEach(function (o) {
            if (!o.parent) {
                var newOne = o.instantiateHierarchy(null, options, function (source, clone) {
                    onClone(source, clone);
                    if (clone.material) {
                        var mesh = clone;
                        if (mesh.material) {
                            if (cloneMaterials) {
                                var sourceMaterial = source.material;
                                if (alreadySwappedMaterials.indexOf(sourceMaterial) === -1) {
                                    var swap = sourceMaterial.clone(nameFunction ? nameFunction(sourceMaterial.name) : "Clone of " + sourceMaterial.name);
                                    alreadySwappedMaterials.push(sourceMaterial);
                                    convertionMap[sourceMaterial.uniqueId] = swap.uniqueId;
                                    storeMap[swap.uniqueId] = swap;
                                    if (sourceMaterial.getClassName() === "MultiMaterial") {
                                        var multi = sourceMaterial;
                                        for (var _i = 0, _a = multi.subMaterials; _i < _a.length; _i++) {
                                            var material = _a[_i];
                                            if (!material) {
                                                continue;
                                            }
                                            swap = material.clone(nameFunction ? nameFunction(material.name) : "Clone of " + material.name);
                                            alreadySwappedMaterials.push(material);
                                            convertionMap[material.uniqueId] = swap.uniqueId;
                                            storeMap[swap.uniqueId] = swap;
                                        }
                                        multi.subMaterials = multi.subMaterials.map(function (m) { return m && storeMap[convertionMap[m.uniqueId]]; });
                                    }
                                }
                                mesh.material = storeMap[convertionMap[sourceMaterial.uniqueId]];
                            }
                            else {
                                if (mesh.material.getClassName() === "MultiMaterial") {
                                    if (_this.scene.multiMaterials.indexOf(mesh.material) === -1) {
                                        _this.scene.addMultiMaterial(mesh.material);
                                    }
                                }
                                else {
                                    if (_this.scene.materials.indexOf(mesh.material) === -1) {
                                        _this.scene.addMaterial(mesh.material);
                                    }
                                }
                            }
                        }
                    }
                });
                if (newOne) {
                    result.rootNodes.push(newOne);
                }
            }
        });
        this.skeletons.forEach(function (s) {
            var clone = s.clone(nameFunction ? nameFunction(s.name) : "Clone of " + s.name);
            if (s.overrideMesh) {
                clone.overrideMesh = storeMap[convertionMap[s.overrideMesh.uniqueId]];
            }
            for (var _i = 0, _a = _this.meshes; _i < _a.length; _i++) {
                var m = _a[_i];
                if (m.skeleton === s && !m.isAnInstance) {
                    var copy = storeMap[convertionMap[m.uniqueId]];
                    copy.skeleton = clone;
                    if (alreadySwappedSkeletons.indexOf(clone) !== -1) {
                        continue;
                    }
                    alreadySwappedSkeletons.push(clone);
                    // Check if bones are mesh linked
                    for (var _b = 0, _c = clone.bones; _b < _c.length; _b++) {
                        var bone = _c[_b];
                        if (bone._linkedTransformNode) {
                            bone._linkedTransformNode = storeMap[convertionMap[bone._linkedTransformNode.uniqueId]];
                        }
                    }
                }
            }
            result.skeletons.push(clone);
        });
        this.animationGroups.forEach(function (o) {
            var clone = o.clone(o.name, function (oldTarget) {
                var newTarget = storeMap[convertionMap[oldTarget.uniqueId]];
                return newTarget || oldTarget;
            });
            result.animationGroups.push(clone);
        });
        return result;
    };
    /**
     * Adds all the assets from the container to the scene.
     */
    AssetContainer.prototype.addAllToScene = function () {
        var _this = this;
        this._wasAddedToScene = true;
        this.cameras.forEach(function (o) {
            _this.scene.addCamera(o);
        });
        this.lights.forEach(function (o) {
            _this.scene.addLight(o);
        });
        this.meshes.forEach(function (o) {
            _this.scene.addMesh(o);
        });
        this.skeletons.forEach(function (o) {
            _this.scene.addSkeleton(o);
        });
        this.animations.forEach(function (o) {
            _this.scene.addAnimation(o);
        });
        this.animationGroups.forEach(function (o) {
            _this.scene.addAnimationGroup(o);
        });
        this.multiMaterials.forEach(function (o) {
            _this.scene.addMultiMaterial(o);
        });
        this.materials.forEach(function (o) {
            _this.scene.addMaterial(o);
        });
        this.morphTargetManagers.forEach(function (o) {
            _this.scene.addMorphTargetManager(o);
        });
        this.geometries.forEach(function (o) {
            _this.scene.addGeometry(o);
        });
        this.transformNodes.forEach(function (o) {
            _this.scene.addTransformNode(o);
        });
        this.actionManagers.forEach(function (o) {
            _this.scene.addActionManager(o);
        });
        this.textures.forEach(function (o) {
            _this.scene.addTexture(o);
        });
        this.reflectionProbes.forEach(function (o) {
            _this.scene.addReflectionProbe(o);
        });
        if (this.environmentTexture) {
            this.scene.environmentTexture = this.environmentTexture;
        }
        for (var _i = 0, _a = this.scene._serializableComponents; _i < _a.length; _i++) {
            var component = _a[_i];
            component.addFromContainer(this);
        }
    };
    /**
     * Removes all the assets in the container from the scene
     */
    AssetContainer.prototype.removeAllFromScene = function () {
        var _this = this;
        this._wasAddedToScene = false;
        this.cameras.forEach(function (o) {
            _this.scene.removeCamera(o);
        });
        this.lights.forEach(function (o) {
            _this.scene.removeLight(o);
        });
        this.meshes.forEach(function (o) {
            _this.scene.removeMesh(o);
        });
        this.skeletons.forEach(function (o) {
            _this.scene.removeSkeleton(o);
        });
        this.animations.forEach(function (o) {
            _this.scene.removeAnimation(o);
        });
        this.animationGroups.forEach(function (o) {
            _this.scene.removeAnimationGroup(o);
        });
        this.multiMaterials.forEach(function (o) {
            _this.scene.removeMultiMaterial(o);
        });
        this.materials.forEach(function (o) {
            _this.scene.removeMaterial(o);
        });
        this.morphTargetManagers.forEach(function (o) {
            _this.scene.removeMorphTargetManager(o);
        });
        this.geometries.forEach(function (o) {
            _this.scene.removeGeometry(o);
        });
        this.transformNodes.forEach(function (o) {
            _this.scene.removeTransformNode(o);
        });
        this.actionManagers.forEach(function (o) {
            _this.scene.removeActionManager(o);
        });
        this.textures.forEach(function (o) {
            _this.scene.removeTexture(o);
        });
        this.reflectionProbes.forEach(function (o) {
            _this.scene.removeReflectionProbe(o);
        });
        if (this.environmentTexture === this.scene.environmentTexture) {
            this.scene.environmentTexture = null;
        }
        for (var _i = 0, _a = this.scene._serializableComponents; _i < _a.length; _i++) {
            var component = _a[_i];
            component.removeFromContainer(this);
        }
    };
    /**
     * Disposes all the assets in the container
     */
    AssetContainer.prototype.dispose = function () {
        this.cameras.forEach(function (o) {
            o.dispose();
        });
        this.cameras = [];
        this.lights.forEach(function (o) {
            o.dispose();
        });
        this.lights = [];
        this.meshes.forEach(function (o) {
            o.dispose();
        });
        this.meshes = [];
        this.skeletons.forEach(function (o) {
            o.dispose();
        });
        this.skeletons = [];
        this.animationGroups.forEach(function (o) {
            o.dispose();
        });
        this.animationGroups = [];
        this.multiMaterials.forEach(function (o) {
            o.dispose();
        });
        this.multiMaterials = [];
        this.materials.forEach(function (o) {
            o.dispose();
        });
        this.materials = [];
        this.geometries.forEach(function (o) {
            o.dispose();
        });
        this.geometries = [];
        this.transformNodes.forEach(function (o) {
            o.dispose();
        });
        this.transformNodes = [];
        this.actionManagers.forEach(function (o) {
            o.dispose();
        });
        this.actionManagers = [];
        this.textures.forEach(function (o) {
            o.dispose();
        });
        this.textures = [];
        this.reflectionProbes.forEach(function (o) {
            o.dispose();
        });
        this.reflectionProbes = [];
        if (this.environmentTexture) {
            this.environmentTexture.dispose();
            this.environmentTexture = null;
        }
        for (var _i = 0, _a = this.scene._serializableComponents; _i < _a.length; _i++) {
            var component = _a[_i];
            component.removeFromContainer(this, true);
        }
    };
    AssetContainer.prototype._moveAssets = function (sourceAssets, targetAssets, keepAssets) {
        if (!sourceAssets) {
            return;
        }
        for (var _i = 0, sourceAssets_1 = sourceAssets; _i < sourceAssets_1.length; _i++) {
            var asset = sourceAssets_1[_i];
            var move = true;
            if (keepAssets) {
                for (var _a = 0, keepAssets_1 = keepAssets; _a < keepAssets_1.length; _a++) {
                    var keepAsset = keepAssets_1[_a];
                    if (asset === keepAsset) {
                        move = false;
                        break;
                    }
                }
            }
            if (move) {
                targetAssets.push(asset);
            }
        }
    };
    /**
     * Removes all the assets contained in the scene and adds them to the container.
     * @param keepAssets Set of assets to keep in the scene. (default: empty)
     */
    AssetContainer.prototype.moveAllFromScene = function (keepAssets) {
        this._wasAddedToScene = false;
        if (keepAssets === undefined) {
            keepAssets = new KeepAssets();
        }
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = this[key] || (key === "environmentTexture" ? null : []);
                this._moveAssets(this.scene[key], this[key], keepAssets[key]);
            }
        }
        this.environmentTexture = this.scene.environmentTexture;
        this.removeAllFromScene();
    };
    /**
     * Adds all meshes in the asset container to a root mesh that can be used to position all the contained meshes. The root mesh is then added to the front of the meshes in the assetContainer.
     * @returns the root mesh
     */
    AssetContainer.prototype.createRootMesh = function () {
        var rootMesh = new Mesh("assetContainerRootMesh", this.scene);
        this.meshes.forEach(function (m) {
            if (!m.parent) {
                rootMesh.addChild(m);
            }
        });
        this.meshes.unshift(rootMesh);
        return rootMesh;
    };
    /**
     * Merge animations (direct and animation groups) from this asset container into a scene
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param animatables set of animatables to retarget to a node from the scene
     * @param targetConverter defines a function used to convert animation targets from the asset container to the scene (default: search node by name)
     * @returns an array of the new AnimationGroup added to the scene (empty array if none)
     */
    AssetContainer.prototype.mergeAnimationsTo = function (scene, animatables, targetConverter) {
        if (scene === void 0) { scene = EngineStore.LastCreatedScene; }
        if (targetConverter === void 0) { targetConverter = null; }
        if (!scene) {
            Logger.Error("No scene available to merge animations to");
            return [];
        }
        var _targetConverter = targetConverter ? targetConverter : function (target) {
            var node = null;
            var targetProperty = target.animations.length ? target.animations[0].targetProperty : "";
            /*
                BabylonJS adds special naming to targets that are children of nodes.
                This name attempts to remove that special naming to get the parent nodes name in case the target
                can't be found in the node tree

                Ex: Torso_primitive0 likely points to a Mesh primitive. We take away primitive0 and are left with "Torso" which is the name
                of the primitive's parent.
            */
            var name = target.name.split(".").join("").split("_primitive")[0];
            switch (targetProperty) {
                case "position":
                case "rotationQuaternion":
                    node = scene.getTransformNodeByName(target.name) || scene.getTransformNodeByName(name);
                    break;
                case "influence":
                    node = scene.getMorphTargetByName(target.name) || scene.getMorphTargetByName(name);
                    break;
                default:
                    node = scene.getNodeByName(target.name) || scene.getNodeByName(name);
            }
            return node;
        };
        // Copy new node animations
        var nodesInAC = this.getNodes();
        nodesInAC.forEach(function (nodeInAC) {
            var nodeInScene = _targetConverter(nodeInAC);
            if (nodeInScene !== null) {
                var _loop_1 = function (animationInAC) {
                    // Doing treatment on an array for safety measure
                    var animationsWithSameProperty = nodeInScene.animations.filter(function (animationInScene) {
                        return animationInScene.targetProperty === animationInAC.targetProperty;
                    });
                    for (var _i = 0, animationsWithSameProperty_1 = animationsWithSameProperty; _i < animationsWithSameProperty_1.length; _i++) {
                        var animationWithSameProperty = animationsWithSameProperty_1[_i];
                        var index = nodeInScene.animations.indexOf(animationWithSameProperty, 0);
                        if (index > -1) {
                            nodeInScene.animations.splice(index, 1);
                        }
                    }
                };
                // Remove old animations with same target property as a new one
                for (var _i = 0, _a = nodeInAC.animations; _i < _a.length; _i++) {
                    var animationInAC = _a[_i];
                    _loop_1(animationInAC);
                }
                // Append new animations
                nodeInScene.animations = nodeInScene.animations.concat(nodeInAC.animations);
            }
        });
        var newAnimationGroups = new Array();
        // Copy new animation groups
        this.animationGroups.slice().forEach(function (animationGroupInAC) {
            // Clone the animation group and all its animatables
            newAnimationGroups.push(animationGroupInAC.clone(animationGroupInAC.name, _targetConverter));
            // Remove animatables related to the asset container
            animationGroupInAC.animatables.forEach(function (animatable) {
                animatable.stop();
            });
        });
        // Retarget animatables
        animatables.forEach(function (animatable) {
            var target = _targetConverter(animatable.target);
            if (target) {
                // Clone the animatable and retarget it
                scene.beginAnimation(target, animatable.fromFrame, animatable.toFrame, animatable.loopAnimation, animatable.speedRatio, animatable.onAnimationEnd ? animatable.onAnimationEnd : undefined, undefined, true, undefined, animatable.onAnimationLoop ? animatable.onAnimationLoop : undefined);
                // Stop animation for the target in the asset container
                scene.stopAnimation(animatable.target);
            }
        });
        return newAnimationGroups;
    };
    return AssetContainer;
}(AbstractScene));

/**
 * Raw texture can help creating a texture directly from an array of data.
 * This can be super useful if you either get the data from an uncompressed source or
 * if you wish to create your texture pixel by pixel.
 */
var RawTexture = /** @class */ (function (_super) {
    __extends(RawTexture, _super);
    /**
     * Instantiates a new RawTexture.
     * Raw texture can help creating a texture directly from an array of data.
     * This can be super useful if you either get the data from an uncompressed source or
     * if you wish to create your texture pixel by pixel.
     * @param data define the array of data to use to create the texture
     * @param width define the width of the texture
     * @param height define the height of the texture
     * @param format define the format of the data (RGB, RGBA... Engine.TEXTUREFORMAT_xxx)
     * @param sceneOrEngine defines the scene or engine the texture will belong to
     * @param generateMipMaps define whether mip maps should be generated or not
     * @param invertY define if the data should be flipped on Y when uploaded to the GPU
     * @param samplingMode define the texture sampling mode (Texture.xxx_SAMPLINGMODE)
     * @param type define the format of the data (int, float... Engine.TEXTURETYPE_xxx)
     */
    function RawTexture(data, width, height, 
    /**
     * Define the format of the data (RGB, RGBA... Engine.TEXTUREFORMAT_xxx)
     */
    format, sceneOrEngine, generateMipMaps, invertY, samplingMode, type) {
        if (generateMipMaps === void 0) { generateMipMaps = true; }
        if (invertY === void 0) { invertY = false; }
        if (samplingMode === void 0) { samplingMode = 3; }
        if (type === void 0) { type = 0; }
        var _this = _super.call(this, null, sceneOrEngine, !generateMipMaps, invertY) || this;
        _this.format = format;
        if (!_this._engine) {
            return _this;
        }
        _this._texture = _this._engine.createRawTexture(data, width, height, format, generateMipMaps, invertY, samplingMode, null, type);
        _this.wrapU = Texture.CLAMP_ADDRESSMODE;
        _this.wrapV = Texture.CLAMP_ADDRESSMODE;
        return _this;
    }
    /**
     * Updates the texture underlying data.
     * @param data Define the new data of the texture
     */
    RawTexture.prototype.update = function (data) {
        this._getEngine().updateRawTexture(this._texture, data, this._texture.format, this._texture.invertY, null, this._texture.type);
    };
    /**
     * Creates a luminance texture from some data.
     * @param data Define the texture data
     * @param width Define the width of the texture
     * @param height Define the height of the texture
     * @param sceneOrEngine defines the scene or engine the texture will belong to
     * @param generateMipMaps Define whether or not to create mip maps for the texture
     * @param invertY define if the data should be flipped on Y when uploaded to the GPU
     * @param samplingMode define the texture sampling mode (Texture.xxx_SAMPLINGMODE)
     * @returns the luminance texture
     */
    RawTexture.CreateLuminanceTexture = function (data, width, height, sceneOrEngine, generateMipMaps, invertY, samplingMode) {
        if (generateMipMaps === void 0) { generateMipMaps = true; }
        if (invertY === void 0) { invertY = false; }
        if (samplingMode === void 0) { samplingMode = 3; }
        return new RawTexture(data, width, height, 1, sceneOrEngine, generateMipMaps, invertY, samplingMode);
    };
    /**
     * Creates a luminance alpha texture from some data.
     * @param data Define the texture data
     * @param width Define the width of the texture
     * @param height Define the height of the texture
     * @param sceneOrEngine defines the scene or engine the texture will belong to
     * @param generateMipMaps Define whether or not to create mip maps for the texture
     * @param invertY define if the data should be flipped on Y when uploaded to the GPU
     * @param samplingMode define the texture sampling mode (Texture.xxx_SAMPLINGMODE)
     * @returns the luminance alpha texture
     */
    RawTexture.CreateLuminanceAlphaTexture = function (data, width, height, sceneOrEngine, generateMipMaps, invertY, samplingMode) {
        if (generateMipMaps === void 0) { generateMipMaps = true; }
        if (invertY === void 0) { invertY = false; }
        if (samplingMode === void 0) { samplingMode = 3; }
        return new RawTexture(data, width, height, 2, sceneOrEngine, generateMipMaps, invertY, samplingMode);
    };
    /**
     * Creates an alpha texture from some data.
     * @param data Define the texture data
     * @param width Define the width of the texture
     * @param height Define the height of the texture
     * @param sceneOrEngine defines the scene or engine the texture will belong to
     * @param generateMipMaps Define whether or not to create mip maps for the texture
     * @param invertY define if the data should be flipped on Y when uploaded to the GPU
     * @param samplingMode define the texture sampling mode (Texture.xxx_SAMPLINGMODE)
     * @returns the alpha texture
     */
    RawTexture.CreateAlphaTexture = function (data, width, height, sceneOrEngine, generateMipMaps, invertY, samplingMode) {
        if (generateMipMaps === void 0) { generateMipMaps = true; }
        if (invertY === void 0) { invertY = false; }
        if (samplingMode === void 0) { samplingMode = 3; }
        return new RawTexture(data, width, height, 0, sceneOrEngine, generateMipMaps, invertY, samplingMode);
    };
    /**
     * Creates a RGB texture from some data.
     * @param data Define the texture data
     * @param width Define the width of the texture
     * @param height Define the height of the texture
     * @param sceneOrEngine defines the scene or engine the texture will belong to
     * @param generateMipMaps Define whether or not to create mip maps for the texture
     * @param invertY define if the data should be flipped on Y when uploaded to the GPU
     * @param samplingMode define the texture sampling mode (Texture.xxx_SAMPLINGMODE)
     * @param type define the format of the data (int, float... Engine.TEXTURETYPE_xxx)
     * @returns the RGB alpha texture
     */
    RawTexture.CreateRGBTexture = function (data, width, height, sceneOrEngine, generateMipMaps, invertY, samplingMode, type) {
        if (generateMipMaps === void 0) { generateMipMaps = true; }
        if (invertY === void 0) { invertY = false; }
        if (samplingMode === void 0) { samplingMode = 3; }
        if (type === void 0) { type = 0; }
        return new RawTexture(data, width, height, 4, sceneOrEngine, generateMipMaps, invertY, samplingMode, type);
    };
    /**
     * Creates a RGBA texture from some data.
     * @param data Define the texture data
     * @param width Define the width of the texture
     * @param height Define the height of the texture
     * @param sceneOrEngine defines the scene or engine the texture will belong to
     * @param generateMipMaps Define whether or not to create mip maps for the texture
     * @param invertY define if the data should be flipped on Y when uploaded to the GPU
     * @param samplingMode define the texture sampling mode (Texture.xxx_SAMPLINGMODE)
     * @param type define the format of the data (int, float... Engine.TEXTURETYPE_xxx)
     * @returns the RGBA texture
     */
    RawTexture.CreateRGBATexture = function (data, width, height, sceneOrEngine, generateMipMaps, invertY, samplingMode, type) {
        if (generateMipMaps === void 0) { generateMipMaps = true; }
        if (invertY === void 0) { invertY = false; }
        if (samplingMode === void 0) { samplingMode = 3; }
        if (type === void 0) { type = 0; }
        return new RawTexture(data, width, height, 5, sceneOrEngine, generateMipMaps, invertY, samplingMode, type);
    };
    /**
     * Creates a R texture from some data.
     * @param data Define the texture data
     * @param width Define the width of the texture
     * @param height Define the height of the texture
     * @param sceneOrEngine defines the scene or engine the texture will belong to
     * @param generateMipMaps Define whether or not to create mip maps for the texture
     * @param invertY define if the data should be flipped on Y when uploaded to the GPU
     * @param samplingMode define the texture sampling mode (Texture.xxx_SAMPLINGMODE)
     * @param type define the format of the data (int, float... Engine.TEXTURETYPE_xxx)
     * @returns the R texture
     */
    RawTexture.CreateRTexture = function (data, width, height, sceneOrEngine, generateMipMaps, invertY, samplingMode, type) {
        if (generateMipMaps === void 0) { generateMipMaps = true; }
        if (invertY === void 0) { invertY = false; }
        if (samplingMode === void 0) { samplingMode = Texture.TRILINEAR_SAMPLINGMODE; }
        if (type === void 0) { type = 1; }
        return new RawTexture(data, width, height, 6, sceneOrEngine, generateMipMaps, invertY, samplingMode, type);
    };
    return RawTexture;
}(Texture));

/**
 * Class used to handle skinning animations
 * @see https://doc.babylonjs.com/how_to/how_to_use_bones_and_skeletons
 */
var Skeleton = /** @class */ (function () {
    /**
     * Creates a new skeleton
     * @param name defines the skeleton name
     * @param id defines the skeleton Id
     * @param scene defines the hosting scene
     */
    function Skeleton(
    /** defines the skeleton name */
    name, 
    /** defines the skeleton Id */
    id, scene) {
        this.name = name;
        this.id = id;
        /**
         * Defines the list of child bones
         */
        this.bones = new Array();
        /**
         * Defines a boolean indicating if the root matrix is provided by meshes or by the current skeleton (this is the default value)
         */
        this.needInitialSkinMatrix = false;
        /**
         * Defines a mesh that override the matrix used to get the world matrix (null by default).
         */
        this.overrideMesh = null;
        this._isDirty = true;
        this._meshesWithPoseMatrix = new Array();
        this._identity = Matrix.Identity();
        this._ranges = {};
        this._lastAbsoluteTransformsUpdateId = -1;
        this._canUseTextureForBones = false;
        this._uniqueId = 0;
        /** @hidden */
        this._numBonesWithLinkedTransformNode = 0;
        /** @hidden */
        this._hasWaitingData = null;
        /** @hidden */
        this._waitingOverrideMeshId = null;
        /**
         * Specifies if the skeleton should be serialized
         */
        this.doNotSerialize = false;
        this._useTextureToStoreBoneMatrices = true;
        this._animationPropertiesOverride = null;
        // Events
        /**
         * An observable triggered before computing the skeleton's matrices
         */
        this.onBeforeComputeObservable = new Observable();
        this.bones = [];
        this._scene = scene || EngineStore.LastCreatedScene;
        this._uniqueId = this._scene.getUniqueId();
        this._scene.addSkeleton(this);
        //make sure it will recalculate the matrix next time prepare is called.
        this._isDirty = true;
        var engineCaps = this._scene.getEngine().getCaps();
        this._canUseTextureForBones = engineCaps.textureFloat && engineCaps.maxVertexTextureImageUnits > 0;
    }
    Object.defineProperty(Skeleton.prototype, "useTextureToStoreBoneMatrices", {
        /**
         * Gets or sets a boolean indicating that bone matrices should be stored as a texture instead of using shader uniforms (default is true).
         * Please note that this option is not available if the hardware does not support it
         */
        get: function () {
            return this._useTextureToStoreBoneMatrices;
        },
        set: function (value) {
            this._useTextureToStoreBoneMatrices = value;
            this._markAsDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Skeleton.prototype, "animationPropertiesOverride", {
        /**
         * Gets or sets the animation properties override
         */
        get: function () {
            if (!this._animationPropertiesOverride) {
                return this._scene.animationPropertiesOverride;
            }
            return this._animationPropertiesOverride;
        },
        set: function (value) {
            this._animationPropertiesOverride = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Skeleton.prototype, "isUsingTextureForMatrices", {
        /**
         * Gets a boolean indicating that the skeleton effectively stores matrices into a texture
         */
        get: function () {
            return this.useTextureToStoreBoneMatrices && this._canUseTextureForBones;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Skeleton.prototype, "uniqueId", {
        /**
         * Gets the unique ID of this skeleton
         */
        get: function () {
            return this._uniqueId;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the current object class name.
     * @return the class name
     */
    Skeleton.prototype.getClassName = function () {
        return "Skeleton";
    };
    /**
     * Returns an array containing the root bones
     * @returns an array containing the root bones
     */
    Skeleton.prototype.getChildren = function () {
        return this.bones.filter(function (b) { return !b.getParent(); });
    };
    // Members
    /**
     * Gets the list of transform matrices to send to shaders (one matrix per bone)
     * @param mesh defines the mesh to use to get the root matrix (if needInitialSkinMatrix === true)
     * @returns a Float32Array containing matrices data
     */
    Skeleton.prototype.getTransformMatrices = function (mesh) {
        if (this.needInitialSkinMatrix && mesh._bonesTransformMatrices) {
            return mesh._bonesTransformMatrices;
        }
        if (!this._transformMatrices) {
            this.prepare();
        }
        return this._transformMatrices;
    };
    /**
     * Gets the list of transform matrices to send to shaders inside a texture (one matrix per bone)
     * @param mesh defines the mesh to use to get the root matrix (if needInitialSkinMatrix === true)
     * @returns a raw texture containing the data
     */
    Skeleton.prototype.getTransformMatrixTexture = function (mesh) {
        if (this.needInitialSkinMatrix && mesh._transformMatrixTexture) {
            return mesh._transformMatrixTexture;
        }
        return this._transformMatrixTexture;
    };
    /**
     * Gets the current hosting scene
     * @returns a scene object
     */
    Skeleton.prototype.getScene = function () {
        return this._scene;
    };
    // Methods
    /**
     * Gets a string representing the current skeleton data
     * @param fullDetails defines a boolean indicating if we want a verbose version
     * @returns a string representing the current skeleton data
     */
    Skeleton.prototype.toString = function (fullDetails) {
        var ret = "Name: " + this.name + ", nBones: " + this.bones.length;
        ret += ", nAnimationRanges: " + (this._ranges ? Object.keys(this._ranges).length : "none");
        if (fullDetails) {
            ret += ", Ranges: {";
            var first = true;
            for (var name_1 in this._ranges) {
                if (first) {
                    ret += ", ";
                    first = false;
                }
                ret += name_1;
            }
            ret += "}";
        }
        return ret;
    };
    /**
    * Get bone's index searching by name
    * @param name defines bone's name to search for
    * @return the indice of the bone. Returns -1 if not found
    */
    Skeleton.prototype.getBoneIndexByName = function (name) {
        for (var boneIndex = 0, cache = this.bones.length; boneIndex < cache; boneIndex++) {
            if (this.bones[boneIndex].name === name) {
                return boneIndex;
            }
        }
        return -1;
    };
    /**
     * Creater a new animation range
     * @param name defines the name of the range
     * @param from defines the start key
     * @param to defines the end key
     */
    Skeleton.prototype.createAnimationRange = function (name, from, to) {
        // check name not already in use
        if (!this._ranges[name]) {
            this._ranges[name] = new AnimationRange(name, from, to);
            for (var i = 0, nBones = this.bones.length; i < nBones; i++) {
                if (this.bones[i].animations[0]) {
                    this.bones[i].animations[0].createRange(name, from, to);
                }
            }
        }
    };
    /**
     * Delete a specific animation range
     * @param name defines the name of the range
     * @param deleteFrames defines if frames must be removed as well
     */
    Skeleton.prototype.deleteAnimationRange = function (name, deleteFrames) {
        if (deleteFrames === void 0) { deleteFrames = true; }
        for (var i = 0, nBones = this.bones.length; i < nBones; i++) {
            if (this.bones[i].animations[0]) {
                this.bones[i].animations[0].deleteRange(name, deleteFrames);
            }
        }
        this._ranges[name] = null; // said much faster than 'delete this._range[name]'
    };
    /**
     * Gets a specific animation range
     * @param name defines the name of the range to look for
     * @returns the requested animation range or null if not found
     */
    Skeleton.prototype.getAnimationRange = function (name) {
        return this._ranges[name] || null;
    };
    /**
     * Gets the list of all animation ranges defined on this skeleton
     * @returns an array
     */
    Skeleton.prototype.getAnimationRanges = function () {
        var animationRanges = [];
        var name;
        for (name in this._ranges) {
            animationRanges.push(this._ranges[name]);
        }
        return animationRanges;
    };
    /**
     * Copy animation range from a source skeleton.
     * This is not for a complete retargeting, only between very similar skeleton's with only possible bone length differences
     * @param source defines the source skeleton
     * @param name defines the name of the range to copy
     * @param rescaleAsRequired defines if rescaling must be applied if required
     * @returns true if operation was successful
     */
    Skeleton.prototype.copyAnimationRange = function (source, name, rescaleAsRequired) {
        if (rescaleAsRequired === void 0) { rescaleAsRequired = false; }
        if (this._ranges[name] || !source.getAnimationRange(name)) {
            return false;
        }
        var ret = true;
        var frameOffset = this._getHighestAnimationFrame() + 1;
        // make a dictionary of source skeleton's bones, so exact same order or doublely nested loop is not required
        var boneDict = {};
        var sourceBones = source.bones;
        var nBones;
        var i;
        for (i = 0, nBones = sourceBones.length; i < nBones; i++) {
            boneDict[sourceBones[i].name] = sourceBones[i];
        }
        if (this.bones.length !== sourceBones.length) {
            Logger.Warn("copyAnimationRange: this rig has " + this.bones.length + " bones, while source as " + sourceBones.length);
            ret = false;
        }
        var skelDimensionsRatio = (rescaleAsRequired && this.dimensionsAtRest && source.dimensionsAtRest) ? this.dimensionsAtRest.divide(source.dimensionsAtRest) : null;
        for (i = 0, nBones = this.bones.length; i < nBones; i++) {
            var boneName = this.bones[i].name;
            var sourceBone = boneDict[boneName];
            if (sourceBone) {
                ret = ret && this.bones[i].copyAnimationRange(sourceBone, name, frameOffset, rescaleAsRequired, skelDimensionsRatio);
            }
            else {
                Logger.Warn("copyAnimationRange: not same rig, missing source bone " + boneName);
                ret = false;
            }
        }
        // do not call createAnimationRange(), since it also is done to bones, which was already done
        var range = source.getAnimationRange(name);
        if (range) {
            this._ranges[name] = new AnimationRange(name, range.from + frameOffset, range.to + frameOffset);
        }
        return ret;
    };
    /**
     * Forces the skeleton to go to rest pose
     */
    Skeleton.prototype.returnToRest = function () {
        var _localScaling = TmpVectors.Vector3[0];
        var _localRotation = TmpVectors.Quaternion[0];
        var _localPosition = TmpVectors.Vector3[1];
        for (var index = 0; index < this.bones.length; index++) {
            var bone = this.bones[index];
            if (bone._index !== -1) {
                bone.returnToRest();
                if (bone._linkedTransformNode) {
                    bone.getRestPose().decompose(_localScaling, _localRotation, _localPosition);
                    bone._linkedTransformNode.position = _localPosition.clone();
                    bone._linkedTransformNode.rotationQuaternion = _localRotation.clone();
                    bone._linkedTransformNode.scaling = _localScaling.clone();
                }
            }
        }
    };
    Skeleton.prototype._getHighestAnimationFrame = function () {
        var ret = 0;
        for (var i = 0, nBones = this.bones.length; i < nBones; i++) {
            if (this.bones[i].animations[0]) {
                var highest = this.bones[i].animations[0].getHighestFrame();
                if (ret < highest) {
                    ret = highest;
                }
            }
        }
        return ret;
    };
    /**
     * Begin a specific animation range
     * @param name defines the name of the range to start
     * @param loop defines if looping must be turned on (false by default)
     * @param speedRatio defines the speed ratio to apply (1 by default)
     * @param onAnimationEnd defines a callback which will be called when animation will end
     * @returns a new animatable
     */
    Skeleton.prototype.beginAnimation = function (name, loop, speedRatio, onAnimationEnd) {
        var range = this.getAnimationRange(name);
        if (!range) {
            return null;
        }
        return this._scene.beginAnimation(this, range.from, range.to, loop, speedRatio, onAnimationEnd);
    };
    /**
     * Convert the keyframes for a range of animation on a skeleton to be relative to a given reference frame.
     * @param skeleton defines the Skeleton containing the animation range to convert
     * @param referenceFrame defines the frame that keyframes in the range will be relative to
     * @param range defines the name of the AnimationRange belonging to the Skeleton to convert
     * @returns the original skeleton
     */
    Skeleton.MakeAnimationAdditive = function (skeleton, referenceFrame, range) {
        if (referenceFrame === void 0) { referenceFrame = 0; }
        var rangeValue = skeleton.getAnimationRange(range);
        // We can't make a range additive if it doesn't exist
        if (!rangeValue) {
            return null;
        }
        // Find any current scene-level animatable belonging to the target that matches the range
        var sceneAnimatables = skeleton._scene.getAllAnimatablesByTarget(skeleton);
        var rangeAnimatable = null;
        for (var index = 0; index < sceneAnimatables.length; index++) {
            var sceneAnimatable = sceneAnimatables[index];
            if (sceneAnimatable.fromFrame === (rangeValue === null || rangeValue === void 0 ? void 0 : rangeValue.from) && sceneAnimatable.toFrame === (rangeValue === null || rangeValue === void 0 ? void 0 : rangeValue.to)) {
                rangeAnimatable = sceneAnimatable;
                break;
            }
        }
        // Convert the animations belonging to the skeleton to additive keyframes
        var animatables = skeleton.getAnimatables();
        for (var index = 0; index < animatables.length; index++) {
            var animatable = animatables[index];
            var animations = animatable.animations;
            if (!animations) {
                continue;
            }
            for (var animIndex = 0; animIndex < animations.length; animIndex++) {
                Animation.MakeAnimationAdditive(animations[animIndex], referenceFrame, range);
            }
        }
        // Mark the scene-level animatable as additive
        if (rangeAnimatable) {
            rangeAnimatable.isAdditive = true;
        }
        return skeleton;
    };
    /** @hidden */
    Skeleton.prototype._markAsDirty = function () {
        this._isDirty = true;
    };
    /** @hidden */
    Skeleton.prototype._registerMeshWithPoseMatrix = function (mesh) {
        this._meshesWithPoseMatrix.push(mesh);
    };
    /** @hidden */
    Skeleton.prototype._unregisterMeshWithPoseMatrix = function (mesh) {
        var index = this._meshesWithPoseMatrix.indexOf(mesh);
        if (index > -1) {
            this._meshesWithPoseMatrix.splice(index, 1);
        }
    };
    Skeleton.prototype._computeTransformMatrices = function (targetMatrix, initialSkinMatrix) {
        this.onBeforeComputeObservable.notifyObservers(this);
        for (var index = 0; index < this.bones.length; index++) {
            var bone = this.bones[index];
            bone._childUpdateId++;
            var parentBone = bone.getParent();
            if (parentBone) {
                bone.getLocalMatrix().multiplyToRef(parentBone.getWorldMatrix(), bone.getWorldMatrix());
            }
            else {
                if (initialSkinMatrix) {
                    bone.getLocalMatrix().multiplyToRef(initialSkinMatrix, bone.getWorldMatrix());
                }
                else {
                    bone.getWorldMatrix().copyFrom(bone.getLocalMatrix());
                }
            }
            if (bone._index !== -1) {
                var mappedIndex = bone._index === null ? index : bone._index;
                bone.getInvertedAbsoluteTransform().multiplyToArray(bone.getWorldMatrix(), targetMatrix, mappedIndex * 16);
            }
        }
        this._identity.copyToArray(targetMatrix, this.bones.length * 16);
    };
    /**
     * Build all resources required to render a skeleton
     */
    Skeleton.prototype.prepare = function () {
        // Update the local matrix of bones with linked transform nodes.
        if (this._numBonesWithLinkedTransformNode > 0) {
            for (var _i = 0, _a = this.bones; _i < _a.length; _i++) {
                var bone_1 = _a[_i];
                if (bone_1._linkedTransformNode) {
                    // Computing the world matrix also computes the local matrix.
                    bone_1._linkedTransformNode.computeWorldMatrix();
                    bone_1._matrix = bone_1._linkedTransformNode._localMatrix;
                    bone_1.markAsDirty();
                }
            }
        }
        if (!this._isDirty) {
            return;
        }
        if (this.needInitialSkinMatrix) {
            for (var index = 0; index < this._meshesWithPoseMatrix.length; index++) {
                var mesh = this._meshesWithPoseMatrix[index];
                var poseMatrix = mesh.getPoseMatrix();
                if (!mesh._bonesTransformMatrices || mesh._bonesTransformMatrices.length !== 16 * (this.bones.length + 1)) {
                    mesh._bonesTransformMatrices = new Float32Array(16 * (this.bones.length + 1));
                }
                if (this._synchronizedWithMesh !== mesh) {
                    this._synchronizedWithMesh = mesh;
                    // Prepare bones
                    for (var boneIndex = 0; boneIndex < this.bones.length; boneIndex++) {
                        var bone = this.bones[boneIndex];
                        if (!bone.getParent()) {
                            var matrix = bone.getBaseMatrix();
                            matrix.multiplyToRef(poseMatrix, TmpVectors.Matrix[1]);
                            bone._updateDifferenceMatrix(TmpVectors.Matrix[1]);
                        }
                    }
                    if (this.isUsingTextureForMatrices) {
                        var textureWidth = (this.bones.length + 1) * 4;
                        if (!mesh._transformMatrixTexture || mesh._transformMatrixTexture.getSize().width !== textureWidth) {
                            if (mesh._transformMatrixTexture) {
                                mesh._transformMatrixTexture.dispose();
                            }
                            mesh._transformMatrixTexture = RawTexture.CreateRGBATexture(mesh._bonesTransformMatrices, (this.bones.length + 1) * 4, 1, this._scene, false, false, 1, 1);
                        }
                    }
                }
                this._computeTransformMatrices(mesh._bonesTransformMatrices, poseMatrix);
                if (this.isUsingTextureForMatrices && mesh._transformMatrixTexture) {
                    mesh._transformMatrixTexture.update(mesh._bonesTransformMatrices);
                }
            }
        }
        else {
            if (!this._transformMatrices || this._transformMatrices.length !== 16 * (this.bones.length + 1)) {
                this._transformMatrices = new Float32Array(16 * (this.bones.length + 1));
                if (this.isUsingTextureForMatrices) {
                    if (this._transformMatrixTexture) {
                        this._transformMatrixTexture.dispose();
                    }
                    this._transformMatrixTexture = RawTexture.CreateRGBATexture(this._transformMatrices, (this.bones.length + 1) * 4, 1, this._scene, false, false, 1, 1);
                }
            }
            this._computeTransformMatrices(this._transformMatrices, null);
            if (this.isUsingTextureForMatrices && this._transformMatrixTexture) {
                this._transformMatrixTexture.update(this._transformMatrices);
            }
        }
        this._isDirty = false;
        this._scene._activeBones.addCount(this.bones.length, false);
    };
    /**
     * Gets the list of animatables currently running for this skeleton
     * @returns an array of animatables
     */
    Skeleton.prototype.getAnimatables = function () {
        if (!this._animatables || this._animatables.length !== this.bones.length) {
            this._animatables = [];
            for (var index = 0; index < this.bones.length; index++) {
                this._animatables.push(this.bones[index]);
            }
        }
        return this._animatables;
    };
    /**
     * Clone the current skeleton
     * @param name defines the name of the new skeleton
     * @param id defines the id of the new skeleton
     * @returns the new skeleton
     */
    Skeleton.prototype.clone = function (name, id) {
        var result = new Skeleton(name, id || name, this._scene);
        result.needInitialSkinMatrix = this.needInitialSkinMatrix;
        result.overrideMesh = this.overrideMesh;
        for (var index = 0; index < this.bones.length; index++) {
            var source = this.bones[index];
            var parentBone = null;
            var parent_1 = source.getParent();
            if (parent_1) {
                var parentIndex = this.bones.indexOf(parent_1);
                parentBone = result.bones[parentIndex];
            }
            var bone = new Bone(source.name, result, parentBone, source.getBaseMatrix().clone(), source.getRestPose().clone());
            bone._index = source._index;
            if (source._linkedTransformNode) {
                bone.linkTransformNode(source._linkedTransformNode);
            }
            DeepCopier.DeepCopy(source.animations, bone.animations);
        }
        if (this._ranges) {
            result._ranges = {};
            for (var rangeName in this._ranges) {
                var range = this._ranges[rangeName];
                if (range) {
                    result._ranges[rangeName] = range.clone();
                }
            }
        }
        this._isDirty = true;
        return result;
    };
    /**
     * Enable animation blending for this skeleton
     * @param blendingSpeed defines the blending speed to apply
     * @see https://doc.babylonjs.com/babylon101/animations#animation-blending
     */
    Skeleton.prototype.enableBlending = function (blendingSpeed) {
        if (blendingSpeed === void 0) { blendingSpeed = 0.01; }
        this.bones.forEach(function (bone) {
            bone.animations.forEach(function (animation) {
                animation.enableBlending = true;
                animation.blendingSpeed = blendingSpeed;
            });
        });
    };
    /**
     * Releases all resources associated with the current skeleton
     */
    Skeleton.prototype.dispose = function () {
        this._meshesWithPoseMatrix = [];
        // Animations
        this.getScene().stopAnimation(this);
        // Remove from scene
        this.getScene().removeSkeleton(this);
        if (this._transformMatrixTexture) {
            this._transformMatrixTexture.dispose();
            this._transformMatrixTexture = null;
        }
    };
    /**
     * Serialize the skeleton in a JSON object
     * @returns a JSON object
     */
    Skeleton.prototype.serialize = function () {
        var _a, _b;
        var serializationObject = {};
        serializationObject.name = this.name;
        serializationObject.id = this.id;
        if (this.dimensionsAtRest) {
            serializationObject.dimensionsAtRest = this.dimensionsAtRest.asArray();
        }
        serializationObject.bones = [];
        serializationObject.needInitialSkinMatrix = this.needInitialSkinMatrix;
        serializationObject.overrideMeshId = (_a = this.overrideMesh) === null || _a === void 0 ? void 0 : _a.id;
        for (var index = 0; index < this.bones.length; index++) {
            var bone = this.bones[index];
            var parent_2 = bone.getParent();
            var serializedBone = {
                parentBoneIndex: parent_2 ? this.bones.indexOf(parent_2) : -1,
                index: bone.getIndex(),
                name: bone.name,
                matrix: bone.getBaseMatrix().toArray(),
                rest: bone.getRestPose().toArray(),
                linkedTransformNodeId: (_b = bone.getTransformNode()) === null || _b === void 0 ? void 0 : _b.id
            };
            serializationObject.bones.push(serializedBone);
            if (bone.length) {
                serializedBone.length = bone.length;
            }
            if (bone.metadata) {
                serializedBone.metadata = bone.metadata;
            }
            if (bone.animations && bone.animations.length > 0) {
                serializedBone.animation = bone.animations[0].serialize();
            }
            serializationObject.ranges = [];
            for (var name in this._ranges) {
                var source = this._ranges[name];
                if (!source) {
                    continue;
                }
                var range = {};
                range.name = name;
                range.from = source.from;
                range.to = source.to;
                serializationObject.ranges.push(range);
            }
        }
        return serializationObject;
    };
    /**
     * Creates a new skeleton from serialized data
     * @param parsedSkeleton defines the serialized data
     * @param scene defines the hosting scene
     * @returns a new skeleton
     */
    Skeleton.Parse = function (parsedSkeleton, scene) {
        var skeleton = new Skeleton(parsedSkeleton.name, parsedSkeleton.id, scene);
        if (parsedSkeleton.dimensionsAtRest) {
            skeleton.dimensionsAtRest = Vector3.FromArray(parsedSkeleton.dimensionsAtRest);
        }
        skeleton.needInitialSkinMatrix = parsedSkeleton.needInitialSkinMatrix;
        if (parsedSkeleton.overrideMeshId) {
            skeleton._hasWaitingData = true;
            skeleton._waitingOverrideMeshId = parsedSkeleton.overrideMeshId;
        }
        var index;
        for (index = 0; index < parsedSkeleton.bones.length; index++) {
            var parsedBone = parsedSkeleton.bones[index];
            var parsedBoneIndex = parsedSkeleton.bones[index].index;
            var parentBone = null;
            if (parsedBone.parentBoneIndex > -1) {
                parentBone = skeleton.bones[parsedBone.parentBoneIndex];
            }
            var rest = parsedBone.rest ? Matrix.FromArray(parsedBone.rest) : null;
            var bone = new Bone(parsedBone.name, skeleton, parentBone, Matrix.FromArray(parsedBone.matrix), rest, null, parsedBoneIndex);
            if (parsedBone.id !== undefined && parsedBone.id !== null) {
                bone.id = parsedBone.id;
            }
            if (parsedBone.length) {
                bone.length = parsedBone.length;
            }
            if (parsedBone.metadata) {
                bone.metadata = parsedBone.metadata;
            }
            if (parsedBone.animation) {
                bone.animations.push(Animation.Parse(parsedBone.animation));
            }
            if (parsedBone.linkedTransformNodeId !== undefined && parsedBone.linkedTransformNodeId !== null) {
                skeleton._hasWaitingData = true;
                bone._waitingTransformNodeId = parsedBone.linkedTransformNodeId;
            }
        }
        // placed after bones, so createAnimationRange can cascade down
        if (parsedSkeleton.ranges) {
            for (index = 0; index < parsedSkeleton.ranges.length; index++) {
                var data = parsedSkeleton.ranges[index];
                skeleton.createAnimationRange(data.name, data.from, data.to);
            }
        }
        return skeleton;
    };
    /**
     * Compute all node absolute transforms
     * @param forceUpdate defines if computation must be done even if cache is up to date
     */
    Skeleton.prototype.computeAbsoluteTransforms = function (forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        var renderId = this._scene.getRenderId();
        if (this._lastAbsoluteTransformsUpdateId != renderId || forceUpdate) {
            this.bones[0].computeAbsoluteTransforms();
            this._lastAbsoluteTransformsUpdateId = renderId;
        }
    };
    /**
     * Gets the root pose matrix
     * @returns a matrix
     */
    Skeleton.prototype.getPoseMatrix = function () {
        var poseMatrix = null;
        if (this._meshesWithPoseMatrix.length > 0) {
            poseMatrix = this._meshesWithPoseMatrix[0].getPoseMatrix();
        }
        return poseMatrix;
    };
    /**
     * Sorts bones per internal index
     */
    Skeleton.prototype.sortBones = function () {
        var bones = new Array();
        var visited = new Array(this.bones.length);
        for (var index = 0; index < this.bones.length; index++) {
            this._sortBones(index, bones, visited);
        }
        this.bones = bones;
    };
    Skeleton.prototype._sortBones = function (index, bones, visited) {
        if (visited[index]) {
            return;
        }
        visited[index] = true;
        var bone = this.bones[index];
        if (bone._index === undefined) {
            bone._index = index;
        }
        var parentBone = bone.getParent();
        if (parentBone) {
            this._sortBones(this.bones.indexOf(parentBone), bones, visited);
        }
        bones.push(bone);
    };
    /**
     * Set the current local matrix as the restPose for all bones in the skeleton.
     */
    Skeleton.prototype.setCurrentPoseAsRest = function () {
        this.bones.forEach(function (b) {
            b.setCurrentPoseAsRest();
        });
    };
    return Skeleton;
}());

/**
 * Defines a target to use with MorphTargetManager
 * @see https://doc.babylonjs.com/how_to/how_to_use_morphtargets
 */
var MorphTarget = /** @class */ (function () {
    /**
     * Creates a new MorphTarget
     * @param name defines the name of the target
     * @param influence defines the influence to use
     * @param scene defines the scene the morphtarget belongs to
     */
    function MorphTarget(
    /** defines the name of the target */
    name, influence, scene) {
        if (influence === void 0) { influence = 0; }
        if (scene === void 0) { scene = null; }
        this.name = name;
        /**
         * Gets or sets the list of animations
         */
        this.animations = new Array();
        this._positions = null;
        this._normals = null;
        this._tangents = null;
        this._uvs = null;
        this._uniqueId = 0;
        /**
         * Observable raised when the influence changes
         */
        this.onInfluenceChanged = new Observable();
        /** @hidden */
        this._onDataLayoutChanged = new Observable();
        this._animationPropertiesOverride = null;
        this._scene = scene || EngineStore.LastCreatedScene;
        this.influence = influence;
        if (this._scene) {
            this._uniqueId = this._scene.getUniqueId();
        }
    }
    Object.defineProperty(MorphTarget.prototype, "influence", {
        /**
         * Gets or sets the influence of this target (ie. its weight in the overall morphing)
         */
        get: function () {
            return this._influence;
        },
        set: function (influence) {
            if (this._influence === influence) {
                return;
            }
            var previous = this._influence;
            this._influence = influence;
            if (this.onInfluenceChanged.hasObservers()) {
                this.onInfluenceChanged.notifyObservers(previous === 0 || influence === 0);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTarget.prototype, "animationPropertiesOverride", {
        /**
         * Gets or sets the animation properties override
         */
        get: function () {
            if (!this._animationPropertiesOverride && this._scene) {
                return this._scene.animationPropertiesOverride;
            }
            return this._animationPropertiesOverride;
        },
        set: function (value) {
            this._animationPropertiesOverride = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTarget.prototype, "uniqueId", {
        /**
         * Gets the unique ID of this manager
         */
        get: function () {
            return this._uniqueId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTarget.prototype, "hasPositions", {
        /**
         * Gets a boolean defining if the target contains position data
         */
        get: function () {
            return !!this._positions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTarget.prototype, "hasNormals", {
        /**
         * Gets a boolean defining if the target contains normal data
         */
        get: function () {
            return !!this._normals;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTarget.prototype, "hasTangents", {
        /**
         * Gets a boolean defining if the target contains tangent data
         */
        get: function () {
            return !!this._tangents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTarget.prototype, "hasUVs", {
        /**
         * Gets a boolean defining if the target contains texture coordinates data
         */
        get: function () {
            return !!this._uvs;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Affects position data to this target
     * @param data defines the position data to use
     */
    MorphTarget.prototype.setPositions = function (data) {
        var hadPositions = this.hasPositions;
        this._positions = data;
        if (hadPositions !== this.hasPositions) {
            this._onDataLayoutChanged.notifyObservers(undefined);
        }
    };
    /**
     * Gets the position data stored in this target
     * @returns a FloatArray containing the position data (or null if not present)
     */
    MorphTarget.prototype.getPositions = function () {
        return this._positions;
    };
    /**
     * Affects normal data to this target
     * @param data defines the normal data to use
     */
    MorphTarget.prototype.setNormals = function (data) {
        var hadNormals = this.hasNormals;
        this._normals = data;
        if (hadNormals !== this.hasNormals) {
            this._onDataLayoutChanged.notifyObservers(undefined);
        }
    };
    /**
     * Gets the normal data stored in this target
     * @returns a FloatArray containing the normal data (or null if not present)
     */
    MorphTarget.prototype.getNormals = function () {
        return this._normals;
    };
    /**
     * Affects tangent data to this target
     * @param data defines the tangent data to use
     */
    MorphTarget.prototype.setTangents = function (data) {
        var hadTangents = this.hasTangents;
        this._tangents = data;
        if (hadTangents !== this.hasTangents) {
            this._onDataLayoutChanged.notifyObservers(undefined);
        }
    };
    /**
     * Gets the tangent data stored in this target
     * @returns a FloatArray containing the tangent data (or null if not present)
     */
    MorphTarget.prototype.getTangents = function () {
        return this._tangents;
    };
    /**
     * Affects texture coordinates data to this target
     * @param data defines the texture coordinates data to use
     */
    MorphTarget.prototype.setUVs = function (data) {
        var hadUVs = this.hasUVs;
        this._uvs = data;
        if (hadUVs !== this.hasUVs) {
            this._onDataLayoutChanged.notifyObservers(undefined);
        }
    };
    /**
     * Gets the texture coordinates data stored in this target
     * @returns a FloatArray containing the texture coordinates data (or null if not present)
     */
    MorphTarget.prototype.getUVs = function () {
        return this._uvs;
    };
    /**
     * Clone the current target
     * @returns a new MorphTarget
     */
    MorphTarget.prototype.clone = function () {
        var _this = this;
        var newOne = SerializationHelper.Clone(function () { return new MorphTarget(_this.name, _this.influence, _this._scene); }, this);
        newOne._positions = this._positions;
        newOne._normals = this._normals;
        newOne._tangents = this._tangents;
        newOne._uvs = this._uvs;
        return newOne;
    };
    /**
     * Serializes the current target into a Serialization object
     * @returns the serialized object
     */
    MorphTarget.prototype.serialize = function () {
        var serializationObject = {};
        serializationObject.name = this.name;
        serializationObject.influence = this.influence;
        serializationObject.positions = Array.prototype.slice.call(this.getPositions());
        if (this.id != null) {
            serializationObject.id = this.id;
        }
        if (this.hasNormals) {
            serializationObject.normals = Array.prototype.slice.call(this.getNormals());
        }
        if (this.hasTangents) {
            serializationObject.tangents = Array.prototype.slice.call(this.getTangents());
        }
        if (this.hasUVs) {
            serializationObject.uvs = Array.prototype.slice.call(this.getUVs());
        }
        // Animations
        SerializationHelper.AppendSerializedAnimations(this, serializationObject);
        return serializationObject;
    };
    /**
     * Returns the string "MorphTarget"
     * @returns "MorphTarget"
     */
    MorphTarget.prototype.getClassName = function () {
        return "MorphTarget";
    };
    // Statics
    /**
     * Creates a new target from serialized data
     * @param serializationObject defines the serialized data to use
     * @returns a new MorphTarget
     */
    MorphTarget.Parse = function (serializationObject) {
        var result = new MorphTarget(serializationObject.name, serializationObject.influence);
        result.setPositions(serializationObject.positions);
        if (serializationObject.id != null) {
            result.id = serializationObject.id;
        }
        if (serializationObject.normals) {
            result.setNormals(serializationObject.normals);
        }
        if (serializationObject.tangents) {
            result.setTangents(serializationObject.tangents);
        }
        if (serializationObject.uvs) {
            result.setUVs(serializationObject.uvs);
        }
        // Animations
        if (serializationObject.animations) {
            for (var animationIndex = 0; animationIndex < serializationObject.animations.length; animationIndex++) {
                var parsedAnimation = serializationObject.animations[animationIndex];
                var internalClass = _TypeStore.GetClass("BABYLON.Animation");
                if (internalClass) {
                    result.animations.push(internalClass.Parse(parsedAnimation));
                }
            }
        }
        return result;
    };
    /**
     * Creates a MorphTarget from mesh data
     * @param mesh defines the source mesh
     * @param name defines the name to use for the new target
     * @param influence defines the influence to attach to the target
     * @returns a new MorphTarget
     */
    MorphTarget.FromMesh = function (mesh, name, influence) {
        if (!name) {
            name = mesh.name;
        }
        var result = new MorphTarget(name, influence, mesh.getScene());
        result.setPositions(mesh.getVerticesData(VertexBuffer.PositionKind));
        if (mesh.isVerticesDataPresent(VertexBuffer.NormalKind)) {
            result.setNormals(mesh.getVerticesData(VertexBuffer.NormalKind));
        }
        if (mesh.isVerticesDataPresent(VertexBuffer.TangentKind)) {
            result.setTangents(mesh.getVerticesData(VertexBuffer.TangentKind));
        }
        if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
            result.setUVs(mesh.getVerticesData(VertexBuffer.UVKind));
        }
        return result;
    };
    __decorate([
        serialize()
    ], MorphTarget.prototype, "id", void 0);
    return MorphTarget;
}());

/**
 * This class is used to deform meshes using morphing between different targets
 * @see https://doc.babylonjs.com/how_to/how_to_use_morphtargets
 */
var MorphTargetManager = /** @class */ (function () {
    /**
     * Creates a new MorphTargetManager
     * @param scene defines the current scene
     */
    function MorphTargetManager(scene) {
        if (scene === void 0) { scene = null; }
        this._targets = new Array();
        this._targetInfluenceChangedObservers = new Array();
        this._targetDataLayoutChangedObservers = new Array();
        this._activeTargets = new SmartArray(16);
        this._supportsNormals = false;
        this._supportsTangents = false;
        this._supportsUVs = false;
        this._vertexCount = 0;
        this._uniqueId = 0;
        this._tempInfluences = new Array();
        /**
         * Gets or sets a boolean indicating if normals must be morphed
         */
        this.enableNormalMorphing = true;
        /**
         * Gets or sets a boolean indicating if tangents must be morphed
         */
        this.enableTangentMorphing = true;
        /**
         * Gets or sets a boolean indicating if UV must be morphed
         */
        this.enableUVMorphing = true;
        if (!scene) {
            scene = EngineStore.LastCreatedScene;
        }
        this._scene = scene;
        if (this._scene) {
            this._scene.morphTargetManagers.push(this);
            this._uniqueId = this._scene.getUniqueId();
        }
    }
    Object.defineProperty(MorphTargetManager.prototype, "uniqueId", {
        /**
         * Gets the unique ID of this manager
         */
        get: function () {
            return this._uniqueId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTargetManager.prototype, "vertexCount", {
        /**
         * Gets the number of vertices handled by this manager
         */
        get: function () {
            return this._vertexCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTargetManager.prototype, "supportsNormals", {
        /**
         * Gets a boolean indicating if this manager supports morphing of normals
         */
        get: function () {
            return this._supportsNormals && this.enableNormalMorphing;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTargetManager.prototype, "supportsTangents", {
        /**
         * Gets a boolean indicating if this manager supports morphing of tangents
         */
        get: function () {
            return this._supportsTangents && this.enableTangentMorphing;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTargetManager.prototype, "supportsUVs", {
        /**
         * Gets a boolean indicating if this manager supports morphing of texture coordinates
         */
        get: function () {
            return this._supportsUVs && this.enableUVMorphing;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTargetManager.prototype, "numTargets", {
        /**
         * Gets the number of targets stored in this manager
         */
        get: function () {
            return this._targets.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTargetManager.prototype, "numInfluencers", {
        /**
         * Gets the number of influencers (ie. the number of targets with influences > 0)
         */
        get: function () {
            return this._activeTargets.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MorphTargetManager.prototype, "influences", {
        /**
         * Gets the list of influences (one per target)
         */
        get: function () {
            return this._influences;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the active target at specified index. An active target is a target with an influence > 0
     * @param index defines the index to check
     * @returns the requested target
     */
    MorphTargetManager.prototype.getActiveTarget = function (index) {
        return this._activeTargets.data[index];
    };
    /**
     * Gets the target at specified index
     * @param index defines the index to check
     * @returns the requested target
     */
    MorphTargetManager.prototype.getTarget = function (index) {
        return this._targets[index];
    };
    /**
     * Add a new target to this manager
     * @param target defines the target to add
     */
    MorphTargetManager.prototype.addTarget = function (target) {
        var _this = this;
        this._targets.push(target);
        this._targetInfluenceChangedObservers.push(target.onInfluenceChanged.add(function (needUpdate) {
            _this._syncActiveTargets(needUpdate);
        }));
        this._targetDataLayoutChangedObservers.push(target._onDataLayoutChanged.add(function () {
            _this._syncActiveTargets(true);
        }));
        this._syncActiveTargets(true);
    };
    /**
     * Removes a target from the manager
     * @param target defines the target to remove
     */
    MorphTargetManager.prototype.removeTarget = function (target) {
        var index = this._targets.indexOf(target);
        if (index >= 0) {
            this._targets.splice(index, 1);
            target.onInfluenceChanged.remove(this._targetInfluenceChangedObservers.splice(index, 1)[0]);
            target._onDataLayoutChanged.remove(this._targetDataLayoutChangedObservers.splice(index, 1)[0]);
            this._syncActiveTargets(true);
        }
    };
    /**
     * Clone the current manager
     * @returns a new MorphTargetManager
     */
    MorphTargetManager.prototype.clone = function () {
        var copy = new MorphTargetManager(this._scene);
        for (var _i = 0, _a = this._targets; _i < _a.length; _i++) {
            var target = _a[_i];
            copy.addTarget(target.clone());
        }
        copy.enableNormalMorphing = this.enableNormalMorphing;
        copy.enableTangentMorphing = this.enableTangentMorphing;
        copy.enableUVMorphing = this.enableUVMorphing;
        return copy;
    };
    /**
     * Serializes the current manager into a Serialization object
     * @returns the serialized object
     */
    MorphTargetManager.prototype.serialize = function () {
        var serializationObject = {};
        serializationObject.id = this.uniqueId;
        serializationObject.targets = [];
        for (var _i = 0, _a = this._targets; _i < _a.length; _i++) {
            var target = _a[_i];
            serializationObject.targets.push(target.serialize());
        }
        return serializationObject;
    };
    MorphTargetManager.prototype._syncActiveTargets = function (needUpdate) {
        var influenceCount = 0;
        this._activeTargets.reset();
        this._supportsNormals = true;
        this._supportsTangents = true;
        this._supportsUVs = true;
        this._vertexCount = 0;
        for (var _i = 0, _a = this._targets; _i < _a.length; _i++) {
            var target = _a[_i];
            if (target.influence === 0) {
                continue;
            }
            this._activeTargets.push(target);
            this._tempInfluences[influenceCount++] = target.influence;
            this._supportsNormals = this._supportsNormals && target.hasNormals;
            this._supportsTangents = this._supportsTangents && target.hasTangents;
            this._supportsUVs = this._supportsUVs && target.hasUVs;
            var positions = target.getPositions();
            if (positions) {
                var vertexCount = positions.length / 3;
                if (this._vertexCount === 0) {
                    this._vertexCount = vertexCount;
                }
                else if (this._vertexCount !== vertexCount) {
                    Logger.Error("Incompatible target. Targets must all have the same vertices count.");
                    return;
                }
            }
        }
        if (!this._influences || this._influences.length !== influenceCount) {
            this._influences = new Float32Array(influenceCount);
        }
        for (var index = 0; index < influenceCount; index++) {
            this._influences[index] = this._tempInfluences[index];
        }
        if (needUpdate) {
            this.synchronize();
        }
    };
    /**
     * Syncrhonize the targets with all the meshes using this morph target manager
     */
    MorphTargetManager.prototype.synchronize = function () {
        if (!this._scene) {
            return;
        }
        // Flag meshes as dirty to resync with the active targets
        for (var _i = 0, _a = this._scene.meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            if (mesh.morphTargetManager === this) {
                mesh._syncGeometryWithMorphTargetManager();
            }
        }
    };
    // Statics
    /**
     * Creates a new MorphTargetManager from serialized data
     * @param serializationObject defines the serialized data
     * @param scene defines the hosting scene
     * @returns the new MorphTargetManager
     */
    MorphTargetManager.Parse = function (serializationObject, scene) {
        var result = new MorphTargetManager(scene);
        result._uniqueId = serializationObject.id;
        for (var _i = 0, _a = serializationObject.targets; _i < _a.length; _i++) {
            var targetData = _a[_i];
            result.addTarget(MorphTarget.Parse(targetData));
        }
        return result;
    };
    return MorphTargetManager;
}());

export { AssetContainer as A, Bone as B, CubeTexture as C, InstantiatedEntries as I, KeepAssets as K, MorphTargetManager as M, RawTexture as R, SceneLoader as S, TargetedAnimation as T, _IAnimationState as _, Skeleton as a, AnimationGroup as b, Animation as c, Animatable as d, RuntimeAnimation as e, AnimationKeyInterpolation as f, AnimationRange as g, SceneLoaderAnimationGroupLoadingMode as h, MorphTarget as i };
