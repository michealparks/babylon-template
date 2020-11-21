import { _ as __extends, a as __decorate, O as Observable, E as EngineStore } from './thinEngine-e576a091.js';
import { S as SerializationHelper, a as serialize, d as serializeAsTexture } from './node-87d9c658.js';
import { M as Matrix } from './math.color-fc6e801e.js';
import { G as GUID } from './guid-495ff9c7.js';
import { S as Size } from './math.size-6398c1e8.js';

/**
 * Base class of all the textures in babylon.
 * It groups all the common properties required to work with Thin Engine.
 */
var ThinTexture = /** @class */ (function () {
    /**
     * Instantiates a new ThinTexture.
     * Base class of all the textures in babylon.
     * This can be used as an internal texture wrapper in ThinEngine to benefit from the cache
     * @param internalTexture Define the internalTexture to wrap
     */
    function ThinTexture(internalTexture) {
        this._wrapU = 1;
        this._wrapV = 1;
        /**
         * | Value | Type               | Description |
         * | ----- | ------------------ | ----------- |
         * | 0     | CLAMP_ADDRESSMODE  |             |
         * | 1     | WRAP_ADDRESSMODE   |             |
         * | 2     | MIRROR_ADDRESSMODE |             |
         */
        this.wrapR = 1;
        /**
         * With compliant hardware and browser (supporting anisotropic filtering)
         * this defines the level of anisotropic filtering in the texture.
         * The higher the better but the slower. This defaults to 4 as it seems to be the best tradeoff.
         */
        this.anisotropicFilteringLevel = 4;
        /**
         * Define the current state of the loading sequence when in delayed load mode.
         */
        this.delayLoadState = 0;
        /** @hidden */
        this._texture = null;
        this._engine = null;
        this._cachedSize = Size.Zero();
        this._cachedBaseSize = Size.Zero();
        this._texture = internalTexture;
        if (this._texture) {
            this._engine = this._texture.getEngine();
        }
    }
    Object.defineProperty(ThinTexture.prototype, "wrapU", {
        /**
        * | Value | Type               | Description |
        * | ----- | ------------------ | ----------- |
        * | 0     | CLAMP_ADDRESSMODE  |             |
        * | 1     | WRAP_ADDRESSMODE   |             |
        * | 2     | MIRROR_ADDRESSMODE |             |
        */
        get: function () {
            return this._wrapU;
        },
        set: function (value) {
            this._wrapU = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinTexture.prototype, "wrapV", {
        /**
        * | Value | Type               | Description |
        * | ----- | ------------------ | ----------- |
        * | 0     | CLAMP_ADDRESSMODE  |             |
        * | 1     | WRAP_ADDRESSMODE   |             |
        * | 2     | MIRROR_ADDRESSMODE |             |
        */
        get: function () {
            return this._wrapV;
        },
        set: function (value) {
            this._wrapV = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinTexture.prototype, "coordinatesMode", {
        /**
         * How a texture is mapped.
         * Unused in thin texture mode.
         */
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinTexture.prototype, "isCube", {
        /**
         * Define if the texture is a cube texture or if false a 2d texture.
         */
        get: function () {
            if (!this._texture) {
                return false;
            }
            return this._texture.isCube;
        },
        set: function (value) {
            if (!this._texture) {
                return;
            }
            this._texture.isCube = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinTexture.prototype, "is3D", {
        /**
         * Define if the texture is a 3d texture (webgl 2) or if false a 2d texture.
         */
        get: function () {
            if (!this._texture) {
                return false;
            }
            return this._texture.is3D;
        },
        set: function (value) {
            if (!this._texture) {
                return;
            }
            this._texture.is3D = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinTexture.prototype, "is2DArray", {
        /**
         * Define if the texture is a 2d array texture (webgl 2) or if false a 2d texture.
         */
        get: function () {
            if (!this._texture) {
                return false;
            }
            return this._texture.is2DArray;
        },
        set: function (value) {
            if (!this._texture) {
                return;
            }
            this._texture.is2DArray = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the class name of the texture.
     * @returns "ThinTexture"
     */
    ThinTexture.prototype.getClassName = function () {
        return "ThinTexture";
    };
    /**
     * Get if the texture is ready to be used (downloaded, converted, mip mapped...).
     * @returns true if fully ready
     */
    ThinTexture.prototype.isReady = function () {
        if (this.delayLoadState === 4) {
            this.delayLoad();
            return false;
        }
        if (this._texture) {
            return this._texture.isReady;
        }
        return false;
    };
    /**
     * Triggers the load sequence in delayed load mode.
     */
    ThinTexture.prototype.delayLoad = function () {
    };
    /**
     * Get the underlying lower level texture from Babylon.
     * @returns the insternal texture
     */
    ThinTexture.prototype.getInternalTexture = function () {
        return this._texture;
    };
    /**
     * Get the size of the texture.
     * @returns the texture size.
     */
    ThinTexture.prototype.getSize = function () {
        if (this._texture) {
            if (this._texture.width) {
                this._cachedSize.width = this._texture.width;
                this._cachedSize.height = this._texture.height;
                return this._cachedSize;
            }
            if (this._texture._size) {
                this._cachedSize.width = this._texture._size;
                this._cachedSize.height = this._texture._size;
                return this._cachedSize;
            }
        }
        return this._cachedSize;
    };
    /**
     * Get the base size of the texture.
     * It can be different from the size if the texture has been resized for POT for instance
     * @returns the base size
     */
    ThinTexture.prototype.getBaseSize = function () {
        if (!this.isReady() || !this._texture) {
            this._cachedBaseSize.width = 0;
            this._cachedBaseSize.height = 0;
            return this._cachedBaseSize;
        }
        if (this._texture._size) {
            this._cachedBaseSize.width = this._texture._size;
            this._cachedBaseSize.height = this._texture._size;
            return this._cachedBaseSize;
        }
        this._cachedBaseSize.width = this._texture.baseWidth;
        this._cachedBaseSize.height = this._texture.baseHeight;
        return this._cachedBaseSize;
    };
    /**
     * Update the sampling mode of the texture.
     * Default is Trilinear mode.
     *
     * | Value | Type               | Description |
     * | ----- | ------------------ | ----------- |
     * | 1     | NEAREST_SAMPLINGMODE or NEAREST_NEAREST_MIPLINEAR  | Nearest is: mag = nearest, min = nearest, mip = linear |
     * | 2     | BILINEAR_SAMPLINGMODE or LINEAR_LINEAR_MIPNEAREST | Bilinear is: mag = linear, min = linear, mip = nearest |
     * | 3     | TRILINEAR_SAMPLINGMODE or LINEAR_LINEAR_MIPLINEAR | Trilinear is: mag = linear, min = linear, mip = linear |
     * | 4     | NEAREST_NEAREST_MIPNEAREST |             |
     * | 5    | NEAREST_LINEAR_MIPNEAREST |             |
     * | 6    | NEAREST_LINEAR_MIPLINEAR |             |
     * | 7    | NEAREST_LINEAR |             |
     * | 8    | NEAREST_NEAREST |             |
     * | 9   | LINEAR_NEAREST_MIPNEAREST |             |
     * | 10   | LINEAR_NEAREST_MIPLINEAR |             |
     * | 11   | LINEAR_LINEAR |             |
     * | 12   | LINEAR_NEAREST |             |
     *
     *    > _mag_: magnification filter (close to the viewer)
     *    > _min_: minification filter (far from the viewer)
     *    > _mip_: filter used between mip map levels
     *@param samplingMode Define the new sampling mode of the texture
     */
    ThinTexture.prototype.updateSamplingMode = function (samplingMode) {
        if (this._texture && this._engine) {
            this._engine.updateTextureSamplingMode(samplingMode, this._texture);
        }
    };
    /**
     * Release and destroy the underlying lower level texture aka internalTexture.
     */
    ThinTexture.prototype.releaseInternalTexture = function () {
        if (this._texture) {
            this._texture.dispose();
            this._texture = null;
        }
    };
    /**
     * Dispose the texture and release its associated resources.
     */
    ThinTexture.prototype.dispose = function () {
        if (this._texture) {
            this.releaseInternalTexture();
            this._engine = null;
        }
    };
    return ThinTexture;
}());

/**
 * Base class of all the textures in babylon.
 * It groups all the common properties the materials, post process, lights... might need
 * in order to make a correct use of the texture.
 */
var BaseTexture = /** @class */ (function (_super) {
    __extends(BaseTexture, _super);
    /**
     * Instantiates a new BaseTexture.
     * Base class of all the textures in babylon.
     * It groups all the common properties the materials, post process, lights... might need
     * in order to make a correct use of the texture.
     * @param sceneOrEngine Define the scene or engine the texture blongs to
     */
    function BaseTexture(sceneOrEngine) {
        var _this = _super.call(this, null) || this;
        /**
         * Gets or sets an object used to store user defined information.
         */
        _this.metadata = null;
        /**
         * For internal use only. Please do not use.
         */
        _this.reservedDataStore = null;
        _this._hasAlpha = false;
        /**
         * Defines if the alpha value should be determined via the rgb values.
         * If true the luminance of the pixel might be used to find the corresponding alpha value.
         */
        _this.getAlphaFromRGB = false;
        /**
         * Intensity or strength of the texture.
         * It is commonly used by materials to fine tune the intensity of the texture
         */
        _this.level = 1;
        /**
         * Define the UV chanel to use starting from 0 and defaulting to 0.
         * This is part of the texture as textures usually maps to one uv set.
         */
        _this.coordinatesIndex = 0;
        _this._coordinatesMode = 0;
        /**
        * | Value | Type               | Description |
        * | ----- | ------------------ | ----------- |
        * | 0     | CLAMP_ADDRESSMODE  |             |
        * | 1     | WRAP_ADDRESSMODE   |             |
        * | 2     | MIRROR_ADDRESSMODE |             |
        */
        _this.wrapR = 1;
        /**
         * With compliant hardware and browser (supporting anisotropic filtering)
         * this defines the level of anisotropic filtering in the texture.
         * The higher the better but the slower. This defaults to 4 as it seems to be the best tradeoff.
         */
        _this.anisotropicFilteringLevel = BaseTexture.DEFAULT_ANISOTROPIC_FILTERING_LEVEL;
        _this._isCube = false;
        _this._gammaSpace = true;
        /**
         * Is Z inverted in the texture (useful in a cube texture).
         */
        _this.invertZ = false;
        /**
         * @hidden
         */
        _this.lodLevelInAlpha = false;
        /**
         * Define if the texture is a render target.
         */
        _this.isRenderTarget = false;
        /** @hidden */
        _this._prefiltered = false;
        /**
         * Define the list of animation attached to the texture.
         */
        _this.animations = new Array();
        /**
        * An event triggered when the texture is disposed.
        */
        _this.onDisposeObservable = new Observable();
        _this._onDisposeObserver = null;
        _this._scene = null;
        /** @hidden */
        _this._texture = null;
        _this._uid = null;
        if (sceneOrEngine) {
            if (BaseTexture._isScene(sceneOrEngine)) {
                _this._scene = sceneOrEngine;
            }
            else {
                _this._engine = sceneOrEngine;
            }
        }
        else {
            _this._scene = EngineStore.LastCreatedScene;
        }
        if (_this._scene) {
            _this.uniqueId = _this._scene.getUniqueId();
            _this._scene.addTexture(_this);
            _this._engine = _this._scene.getEngine();
        }
        _this._uid = null;
        return _this;
    }
    Object.defineProperty(BaseTexture.prototype, "hasAlpha", {
        get: function () {
            return this._hasAlpha;
        },
        /**
         * Define if the texture is having a usable alpha value (can be use for transparency or glossiness for instance).
         */
        set: function (value) {
            if (this._hasAlpha === value) {
                return;
            }
            this._hasAlpha = value;
            if (this._scene) {
                this._scene.markAllMaterialsAsDirty(1 | 16);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "coordinatesMode", {
        get: function () {
            return this._coordinatesMode;
        },
        /**
        * How a texture is mapped.
        *
        * | Value | Type                                | Description |
        * | ----- | ----------------------------------- | ----------- |
        * | 0     | EXPLICIT_MODE                       |             |
        * | 1     | SPHERICAL_MODE                      |             |
        * | 2     | PLANAR_MODE                         |             |
        * | 3     | CUBIC_MODE                          |             |
        * | 4     | PROJECTION_MODE                     |             |
        * | 5     | SKYBOX_MODE                         |             |
        * | 6     | INVCUBIC_MODE                       |             |
        * | 7     | EQUIRECTANGULAR_MODE                |             |
        * | 8     | FIXED_EQUIRECTANGULAR_MODE          |             |
        * | 9     | FIXED_EQUIRECTANGULAR_MIRRORED_MODE |             |
        */
        set: function (value) {
            if (this._coordinatesMode === value) {
                return;
            }
            this._coordinatesMode = value;
            if (this._scene) {
                this._scene.markAllMaterialsAsDirty(1);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "wrapU", {
        /**
         * | Value | Type               | Description |
         * | ----- | ------------------ | ----------- |
         * | 0     | CLAMP_ADDRESSMODE  |             |
         * | 1     | WRAP_ADDRESSMODE   |             |
         * | 2     | MIRROR_ADDRESSMODE |             |
         */
        get: function () {
            return this._wrapU;
        },
        set: function (value) {
            this._wrapU = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "wrapV", {
        /**
         * | Value | Type               | Description |
         * | ----- | ------------------ | ----------- |
         * | 0     | CLAMP_ADDRESSMODE  |             |
         * | 1     | WRAP_ADDRESSMODE   |             |
         * | 2     | MIRROR_ADDRESSMODE |             |
         */
        get: function () {
            return this._wrapV;
        },
        set: function (value) {
            this._wrapV = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "isCube", {
        /**
         * Define if the texture is a cube texture or if false a 2d texture.
         */
        get: function () {
            if (!this._texture) {
                return this._isCube;
            }
            return this._texture.isCube;
        },
        set: function (value) {
            if (!this._texture) {
                this._isCube = value;
            }
            else {
                this._texture.isCube = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "is3D", {
        /**
         * Define if the texture is a 3d texture (webgl 2) or if false a 2d texture.
         */
        get: function () {
            if (!this._texture) {
                return false;
            }
            return this._texture.is3D;
        },
        set: function (value) {
            if (!this._texture) {
                return;
            }
            this._texture.is3D = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "is2DArray", {
        /**
         * Define if the texture is a 2d array texture (webgl 2) or if false a 2d texture.
         */
        get: function () {
            if (!this._texture) {
                return false;
            }
            return this._texture.is2DArray;
        },
        set: function (value) {
            if (!this._texture) {
                return;
            }
            this._texture.is2DArray = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "gammaSpace", {
        /**
         * Define if the texture contains data in gamma space (most of the png/jpg aside bump).
         * HDR texture are usually stored in linear space.
         * This only impacts the PBR and Background materials
         */
        get: function () {
            if (!this._texture) {
                return this._gammaSpace;
            }
            else {
                if (this._texture._gammaSpace === null) {
                    this._texture._gammaSpace = this._gammaSpace;
                }
            }
            return this._texture._gammaSpace;
        },
        set: function (gamma) {
            if (!this._texture) {
                if (this._gammaSpace === gamma) {
                    return;
                }
                this._gammaSpace = gamma;
            }
            else {
                if (this._texture._gammaSpace === gamma) {
                    return;
                }
                this._texture._gammaSpace = gamma;
            }
            this._markAllSubMeshesAsTexturesDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "isRGBD", {
        /**
         * Gets or sets whether or not the texture contains RGBD data.
         */
        get: function () {
            return this._texture != null && this._texture._isRGBD;
        },
        set: function (value) {
            if (this._texture) {
                this._texture._isRGBD = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "noMipmap", {
        /**
         * Are mip maps generated for this texture or not.
         */
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "lodGenerationOffset", {
        /**
         * With prefiltered texture, defined the offset used during the prefiltering steps.
         */
        get: function () {
            if (this._texture) {
                return this._texture._lodGenerationOffset;
            }
            return 0.0;
        },
        set: function (value) {
            if (this._texture) {
                this._texture._lodGenerationOffset = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "lodGenerationScale", {
        /**
         * With prefiltered texture, defined the scale used during the prefiltering steps.
         */
        get: function () {
            if (this._texture) {
                return this._texture._lodGenerationScale;
            }
            return 0.0;
        },
        set: function (value) {
            if (this._texture) {
                this._texture._lodGenerationScale = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "linearSpecularLOD", {
        /**
         * With prefiltered texture, defined if the specular generation is based on a linear ramp.
         * By default we are using a log2 of the linear roughness helping to keep a better resolution for
         * average roughness values.
         */
        get: function () {
            if (this._texture) {
                return this._texture._linearSpecularLOD;
            }
            return false;
        },
        set: function (value) {
            if (this._texture) {
                this._texture._linearSpecularLOD = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "irradianceTexture", {
        /**
         * In case a better definition than spherical harmonics is required for the diffuse part of the environment.
         * You can set the irradiance texture to rely on a texture instead of the spherical approach.
         * This texture need to have the same characteristics than its parent (Cube vs 2d, coordinates mode, Gamma/Linear, RGBD).
         */
        get: function () {
            if (this._texture) {
                return this._texture._irradianceTexture;
            }
            return null;
        },
        set: function (value) {
            if (this._texture) {
                this._texture._irradianceTexture = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "uid", {
        /**
         * Define the unique id of the texture in the scene.
         */
        get: function () {
            if (!this._uid) {
                this._uid = GUID.RandomId();
            }
            return this._uid;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Return a string representation of the texture.
     * @returns the texture as a string
     */
    BaseTexture.prototype.toString = function () {
        return this.name;
    };
    /**
     * Get the class name of the texture.
     * @returns "BaseTexture"
     */
    BaseTexture.prototype.getClassName = function () {
        return "BaseTexture";
    };
    Object.defineProperty(BaseTexture.prototype, "onDispose", {
        /**
         * Callback triggered when the texture has been disposed.
         * Kept for back compatibility, you can use the onDisposeObservable instead.
         */
        set: function (callback) {
            if (this._onDisposeObserver) {
                this.onDisposeObservable.remove(this._onDisposeObserver);
            }
            this._onDisposeObserver = this.onDisposeObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "isBlocking", {
        /**
         * Define if the texture is preventinga material to render or not.
         * If not and the texture is not ready, the engine will use a default black texture instead.
         */
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the scene the texture belongs to.
     * @returns the scene or null if undefined
     */
    BaseTexture.prototype.getScene = function () {
        return this._scene;
    };
    /** @hidden */
    BaseTexture.prototype._getEngine = function () {
        return this._engine;
    };
    /**
     * Checks if the texture has the same transform matrix than another texture
     * @param texture texture to check against
     * @returns true if the transforms are the same, else false
     */
    BaseTexture.prototype.checkTransformsAreIdentical = function (texture) {
        return texture !== null;
    };
    /**
     * Get the texture transform matrix used to offset tile the texture for istance.
     * @returns the transformation matrix
     */
    BaseTexture.prototype.getTextureMatrix = function () {
        return Matrix.IdentityReadOnly;
    };
    /**
     * Get the texture reflection matrix used to rotate/transform the reflection.
     * @returns the reflection matrix
     */
    BaseTexture.prototype.getReflectionTextureMatrix = function () {
        return Matrix.IdentityReadOnly;
    };
    /**
     * Get if the texture is ready to be consumed (either it is ready or it is not blocking)
     * @returns true if ready or not blocking
     */
    BaseTexture.prototype.isReadyOrNotBlocking = function () {
        return !this.isBlocking || this.isReady();
    };
    /**
     * Scales the texture if is `canRescale()`
     * @param ratio the resize factor we want to use to rescale
     */
    BaseTexture.prototype.scale = function (ratio) {
    };
    Object.defineProperty(BaseTexture.prototype, "canRescale", {
        /**
         * Get if the texture can rescale.
         */
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    BaseTexture.prototype._getFromCache = function (url, noMipmap, sampling, invertY) {
        var engine = this._getEngine();
        if (!engine) {
            return null;
        }
        var texturesCache = engine.getLoadedTexturesCache();
        for (var index = 0; index < texturesCache.length; index++) {
            var texturesCacheEntry = texturesCache[index];
            if (invertY === undefined || invertY === texturesCacheEntry.invertY) {
                if (texturesCacheEntry.url === url && texturesCacheEntry.generateMipMaps === !noMipmap) {
                    if (!sampling || sampling === texturesCacheEntry.samplingMode) {
                        texturesCacheEntry.incrementReferences();
                        return texturesCacheEntry;
                    }
                }
            }
        }
        return null;
    };
    /** @hidden */
    BaseTexture.prototype._rebuild = function () {
    };
    /**
     * Clones the texture.
     * @returns the cloned texture
     */
    BaseTexture.prototype.clone = function () {
        return null;
    };
    Object.defineProperty(BaseTexture.prototype, "textureType", {
        /**
         * Get the texture underlying type (INT, FLOAT...)
         */
        get: function () {
            if (!this._texture) {
                return 0;
            }
            return (this._texture.type !== undefined) ? this._texture.type : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "textureFormat", {
        /**
         * Get the texture underlying format (RGB, RGBA...)
         */
        get: function () {
            if (!this._texture) {
                return 5;
            }
            return (this._texture.format !== undefined) ? this._texture.format : 5;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Indicates that textures need to be re-calculated for all materials
     */
    BaseTexture.prototype._markAllSubMeshesAsTexturesDirty = function () {
        var scene = this.getScene();
        if (!scene) {
            return;
        }
        scene.markAllMaterialsAsDirty(1);
    };
    /**
     * Reads the pixels stored in the webgl texture and returns them as an ArrayBuffer.
     * This will returns an RGBA array buffer containing either in values (0-255) or
     * float values (0-1) depending of the underlying buffer type.
     * @param faceIndex defines the face of the texture to read (in case of cube texture)
     * @param level defines the LOD level of the texture to read (in case of Mip Maps)
     * @param buffer defines a user defined buffer to fill with data (can be null)
     * @returns The Array buffer containing the pixels data.
     */
    BaseTexture.prototype.readPixels = function (faceIndex, level, buffer) {
        if (faceIndex === void 0) { faceIndex = 0; }
        if (level === void 0) { level = 0; }
        if (buffer === void 0) { buffer = null; }
        if (!this._texture) {
            return null;
        }
        var size = this.getSize();
        var width = size.width;
        var height = size.height;
        var engine = this._getEngine();
        if (!engine) {
            return null;
        }
        if (level != 0) {
            width = width / Math.pow(2, level);
            height = height / Math.pow(2, level);
            width = Math.round(width);
            height = Math.round(height);
        }
        try {
            if (this._texture.isCube) {
                return engine._readTexturePixels(this._texture, width, height, faceIndex, level, buffer);
            }
            return engine._readTexturePixels(this._texture, width, height, -1, level, buffer);
        }
        catch (e) {
            return null;
        }
    };
    Object.defineProperty(BaseTexture.prototype, "_lodTextureHigh", {
        /** @hidden */
        get: function () {
            if (this._texture) {
                return this._texture._lodTextureHigh;
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "_lodTextureMid", {
        /** @hidden */
        get: function () {
            if (this._texture) {
                return this._texture._lodTextureMid;
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseTexture.prototype, "_lodTextureLow", {
        /** @hidden */
        get: function () {
            if (this._texture) {
                return this._texture._lodTextureLow;
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Dispose the texture and release its associated resources.
     */
    BaseTexture.prototype.dispose = function () {
        if (this._scene) {
            // Animations
            if (this._scene.stopAnimation) {
                this._scene.stopAnimation(this);
            }
            // Remove from scene
            this._scene._removePendingData(this);
            var index = this._scene.textures.indexOf(this);
            if (index >= 0) {
                this._scene.textures.splice(index, 1);
            }
            this._scene.onTextureRemovedObservable.notifyObservers(this);
            this._scene = null;
        }
        // Callback
        this.onDisposeObservable.notifyObservers(this);
        this.onDisposeObservable.clear();
        _super.prototype.dispose.call(this);
    };
    /**
     * Serialize the texture into a JSON representation that can be parsed later on.
     * @returns the JSON representation of the texture
     */
    BaseTexture.prototype.serialize = function () {
        if (!this.name) {
            return null;
        }
        var serializationObject = SerializationHelper.Serialize(this);
        // Animations
        SerializationHelper.AppendSerializedAnimations(this, serializationObject);
        return serializationObject;
    };
    /**
     * Helper function to be called back once a list of texture contains only ready textures.
     * @param textures Define the list of textures to wait for
     * @param callback Define the callback triggered once the entire list will be ready
     */
    BaseTexture.WhenAllReady = function (textures, callback) {
        var numRemaining = textures.length;
        if (numRemaining === 0) {
            callback();
            return;
        }
        for (var i = 0; i < textures.length; i++) {
            var texture = textures[i];
            if (texture.isReady()) {
                if (--numRemaining === 0) {
                    callback();
                }
            }
            else {
                var onLoadObservable = texture.onLoadObservable;
                if (onLoadObservable) {
                    onLoadObservable.addOnce(function () {
                        if (--numRemaining === 0) {
                            callback();
                        }
                    });
                }
            }
        }
    };
    BaseTexture._isScene = function (sceneOrEngine) {
        return sceneOrEngine.getClassName() === "Scene";
    };
    /**
     * Default anisotropic filtering level for the application.
     * It is set to 4 as a good tradeoff between perf and quality.
     */
    BaseTexture.DEFAULT_ANISOTROPIC_FILTERING_LEVEL = 4;
    __decorate([
        serialize()
    ], BaseTexture.prototype, "uniqueId", void 0);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "name", void 0);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "metadata", void 0);
    __decorate([
        serialize("hasAlpha")
    ], BaseTexture.prototype, "_hasAlpha", void 0);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "getAlphaFromRGB", void 0);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "level", void 0);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "coordinatesIndex", void 0);
    __decorate([
        serialize("coordinatesMode")
    ], BaseTexture.prototype, "_coordinatesMode", void 0);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "wrapU", null);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "wrapV", null);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "wrapR", void 0);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "anisotropicFilteringLevel", void 0);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "isCube", null);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "is3D", null);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "is2DArray", null);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "gammaSpace", null);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "invertZ", void 0);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "lodLevelInAlpha", void 0);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "lodGenerationOffset", null);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "lodGenerationScale", null);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "linearSpecularLOD", null);
    __decorate([
        serializeAsTexture()
    ], BaseTexture.prototype, "irradianceTexture", null);
    __decorate([
        serialize()
    ], BaseTexture.prototype, "isRenderTarget", void 0);
    return BaseTexture;
}(ThinTexture));

export { BaseTexture as B };
