import { f as Effect, T as ThinEngine, L as Logger, I as InternalTexture, e as InternalTextureSource, d as __assign, R as RenderTargetCreationOptions, a as __decorate, O as Observable } from './thinEngine-e576a091.js';
import { S as SerializationHelper, a as serialize, e as serializeAsColor4 } from './node-87d9c658.js';
import { _ as _TypeStore, a as Vector2 } from './math.color-fc6e801e.js';
import { E as Engine } from './engine-9a1b5aa7.js';
import { S as SmartArray } from './pointerEvents-12a2451c.js';

var name = 'postprocessVertexShader';
var shader = "\nattribute vec2 position;\nuniform vec2 scale;\n\nvarying vec2 vUV;\nconst vec2 madd=vec2(0.5,0.5);\nvoid main(void) {\nvUV=(position*madd+madd)*scale;\ngl_Position=vec4(position,0.0,1.0);\n}";
Effect.ShadersStore[name] = shader;

ThinEngine.prototype.createRenderTargetTexture = function (size, options) {
    var fullOptions = new RenderTargetCreationOptions();
    if (options !== undefined && typeof options === "object") {
        fullOptions.generateMipMaps = options.generateMipMaps;
        fullOptions.generateDepthBuffer = !!options.generateDepthBuffer;
        fullOptions.generateStencilBuffer = !!options.generateStencilBuffer;
        fullOptions.type = options.type === undefined ? 0 : options.type;
        fullOptions.samplingMode = options.samplingMode === undefined ? 3 : options.samplingMode;
        fullOptions.format = options.format === undefined ? 5 : options.format;
    }
    else {
        fullOptions.generateMipMaps = options;
        fullOptions.generateDepthBuffer = true;
        fullOptions.generateStencilBuffer = false;
        fullOptions.type = 0;
        fullOptions.samplingMode = 3;
        fullOptions.format = 5;
    }
    if (fullOptions.type === 1 && !this._caps.textureFloatLinearFiltering) {
        // if floating point linear (gl.FLOAT) then force to NEAREST_SAMPLINGMODE
        fullOptions.samplingMode = 1;
    }
    else if (fullOptions.type === 2 && !this._caps.textureHalfFloatLinearFiltering) {
        // if floating point linear (HALF_FLOAT) then force to NEAREST_SAMPLINGMODE
        fullOptions.samplingMode = 1;
    }
    if (fullOptions.type === 1 && !this._caps.textureFloat) {
        fullOptions.type = 0;
        Logger.Warn("Float textures are not supported. Render target forced to TEXTURETYPE_UNSIGNED_BYTE type");
    }
    var gl = this._gl;
    var texture = new InternalTexture(this, InternalTextureSource.RenderTarget);
    var width = size.width || size;
    var height = size.height || size;
    var layers = size.layers || 0;
    var filters = this._getSamplingParameters(fullOptions.samplingMode, fullOptions.generateMipMaps ? true : false);
    var target = layers !== 0 ? gl.TEXTURE_2D_ARRAY : gl.TEXTURE_2D;
    var sizedFormat = this._getRGBABufferInternalSizedFormat(fullOptions.type, fullOptions.format);
    var internalFormat = this._getInternalFormat(fullOptions.format);
    var type = this._getWebGLTextureType(fullOptions.type);
    // Bind
    this._bindTextureDirectly(target, texture);
    if (layers !== 0) {
        texture.is2DArray = true;
        gl.texImage3D(target, 0, sizedFormat, width, height, layers, 0, internalFormat, type, null);
    }
    else {
        gl.texImage2D(target, 0, sizedFormat, width, height, 0, internalFormat, type, null);
    }
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, filters.mag);
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, filters.min);
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // MipMaps
    if (fullOptions.generateMipMaps) {
        this._gl.generateMipmap(target);
    }
    this._bindTextureDirectly(target, null);
    var currentFrameBuffer = this._currentFramebuffer;
    // Create the framebuffer
    var framebuffer = gl.createFramebuffer();
    this._bindUnboundFramebuffer(framebuffer);
    texture._depthStencilBuffer = this._setupFramebufferDepthAttachments(fullOptions.generateStencilBuffer ? true : false, fullOptions.generateDepthBuffer, width, height);
    // No need to rebind on every frame
    if (!texture.is2DArray) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture._webGLTexture, 0);
    }
    this._bindUnboundFramebuffer(currentFrameBuffer);
    texture._framebuffer = framebuffer;
    texture.baseWidth = width;
    texture.baseHeight = height;
    texture.width = width;
    texture.height = height;
    texture.depth = layers;
    texture.isReady = true;
    texture.samples = 1;
    texture.generateMipMaps = fullOptions.generateMipMaps ? true : false;
    texture.samplingMode = fullOptions.samplingMode;
    texture.type = fullOptions.type;
    texture.format = fullOptions.format;
    texture._generateDepthBuffer = fullOptions.generateDepthBuffer;
    texture._generateStencilBuffer = fullOptions.generateStencilBuffer ? true : false;
    this._internalTexturesCache.push(texture);
    return texture;
};
ThinEngine.prototype.createDepthStencilTexture = function (size, options) {
    if (options.isCube) {
        var width = size.width || size;
        return this._createDepthStencilCubeTexture(width, options);
    }
    else {
        return this._createDepthStencilTexture(size, options);
    }
};
ThinEngine.prototype._createDepthStencilTexture = function (size, options) {
    var gl = this._gl;
    var layers = size.layers || 0;
    var target = layers !== 0 ? gl.TEXTURE_2D_ARRAY : gl.TEXTURE_2D;
    var internalTexture = new InternalTexture(this, InternalTextureSource.Depth);
    if (!this._caps.depthTextureExtension) {
        Logger.Error("Depth texture is not supported by your browser or hardware.");
        return internalTexture;
    }
    var internalOptions = __assign({ bilinearFiltering: false, comparisonFunction: 0, generateStencil: false }, options);
    this._bindTextureDirectly(target, internalTexture, true);
    this._setupDepthStencilTexture(internalTexture, size, internalOptions.generateStencil, internalOptions.bilinearFiltering, internalOptions.comparisonFunction);
    var type = internalOptions.generateStencil ? gl.UNSIGNED_INT_24_8 : gl.UNSIGNED_INT;
    var internalFormat = internalOptions.generateStencil ? gl.DEPTH_STENCIL : gl.DEPTH_COMPONENT;
    var sizedFormat = internalFormat;
    if (this.webGLVersion > 1) {
        sizedFormat = internalOptions.generateStencil ? gl.DEPTH24_STENCIL8 : gl.DEPTH_COMPONENT24;
    }
    if (internalTexture.is2DArray) {
        gl.texImage3D(target, 0, sizedFormat, internalTexture.width, internalTexture.height, layers, 0, internalFormat, type, null);
    }
    else {
        gl.texImage2D(target, 0, sizedFormat, internalTexture.width, internalTexture.height, 0, internalFormat, type, null);
    }
    this._bindTextureDirectly(target, null);
    return internalTexture;
};

ThinEngine.prototype.createRenderTargetCubeTexture = function (size, options) {
    var fullOptions = __assign({ generateMipMaps: true, generateDepthBuffer: true, generateStencilBuffer: false, type: 0, samplingMode: 3, format: 5 }, options);
    fullOptions.generateStencilBuffer = fullOptions.generateDepthBuffer && fullOptions.generateStencilBuffer;
    if (fullOptions.type === 1 && !this._caps.textureFloatLinearFiltering) {
        // if floating point linear (gl.FLOAT) then force to NEAREST_SAMPLINGMODE
        fullOptions.samplingMode = 1;
    }
    else if (fullOptions.type === 2 && !this._caps.textureHalfFloatLinearFiltering) {
        // if floating point linear (HALF_FLOAT) then force to NEAREST_SAMPLINGMODE
        fullOptions.samplingMode = 1;
    }
    var gl = this._gl;
    var texture = new InternalTexture(this, InternalTextureSource.RenderTarget);
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
    var filters = this._getSamplingParameters(fullOptions.samplingMode, fullOptions.generateMipMaps);
    if (fullOptions.type === 1 && !this._caps.textureFloat) {
        fullOptions.type = 0;
        Logger.Warn("Float textures are not supported. Cube render target forced to TEXTURETYPE_UNESIGNED_BYTE type");
    }
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, filters.mag);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, filters.min);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    for (var face = 0; face < 6; face++) {
        gl.texImage2D((gl.TEXTURE_CUBE_MAP_POSITIVE_X + face), 0, this._getRGBABufferInternalSizedFormat(fullOptions.type, fullOptions.format), size, size, 0, this._getInternalFormat(fullOptions.format), this._getWebGLTextureType(fullOptions.type), null);
    }
    // Create the framebuffer
    var framebuffer = gl.createFramebuffer();
    this._bindUnboundFramebuffer(framebuffer);
    texture._depthStencilBuffer = this._setupFramebufferDepthAttachments(fullOptions.generateStencilBuffer, fullOptions.generateDepthBuffer, size, size);
    // MipMaps
    if (fullOptions.generateMipMaps) {
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    }
    // Unbind
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
    this._bindUnboundFramebuffer(null);
    texture._framebuffer = framebuffer;
    texture.width = size;
    texture.height = size;
    texture.isReady = true;
    texture.isCube = true;
    texture.samples = 1;
    texture.generateMipMaps = fullOptions.generateMipMaps;
    texture.samplingMode = fullOptions.samplingMode;
    texture.type = fullOptions.type;
    texture.format = fullOptions.format;
    texture._generateDepthBuffer = fullOptions.generateDepthBuffer;
    texture._generateStencilBuffer = fullOptions.generateStencilBuffer;
    this._internalTexturesCache.push(texture);
    return texture;
};

/**
 * PostProcess can be used to apply a shader to a texture after it has been rendered
 * See https://doc.babylonjs.com/how_to/how_to_use_postprocesses
 */
var PostProcess = /** @class */ (function () {
    /**
     * Creates a new instance PostProcess
     * @param name The name of the PostProcess.
     * @param fragmentUrl The url of the fragment shader to be used.
     * @param parameters Array of the names of uniform non-sampler2D variables that will be passed to the shader.
     * @param samplers Array of the names of uniform sampler2D variables that will be passed to the shader.
     * @param options The required width/height ratio to downsize to before computing the render pass. (Use 1.0 for full size)
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param defines String of defines that will be set when running the fragment shader. (default: null)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param vertexUrl The url of the vertex shader to be used. (default: "postprocess")
     * @param indexParameters The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
     * @param blockCompilation If the shader should not be compiled immediatly. (default: false)
     * @param textureFormat Format of textures used when performing the post process. (default: TEXTUREFORMAT_RGBA)
     */
    function PostProcess(name, fragmentUrl, parameters, samplers, options, camera, samplingMode, engine, reusable, defines, textureType, vertexUrl, indexParameters, blockCompilation, textureFormat) {
        if (samplingMode === void 0) { samplingMode = 1; }
        if (defines === void 0) { defines = null; }
        if (textureType === void 0) { textureType = 0; }
        if (vertexUrl === void 0) { vertexUrl = "postprocess"; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        if (textureFormat === void 0) { textureFormat = 5; }
        /**
        * Width of the texture to apply the post process on
        */
        this.width = -1;
        /**
        * Height of the texture to apply the post process on
        */
        this.height = -1;
        /**
         * Gets the node material used to create this postprocess (null if the postprocess was manually created)
         */
        this.nodeMaterialSource = null;
        /**
        * Internal, reference to the location where this postprocess was output to. (Typically the texture on the next postprocess in the chain)
        * @hidden
        */
        this._outputTexture = null;
        /**
        * If the buffer needs to be cleared before applying the post process. (default: true)
        * Should be set to false if shader will overwrite all previous pixels.
        */
        this.autoClear = true;
        /**
        * Type of alpha mode to use when performing the post process (default: Engine.ALPHA_DISABLE)
        */
        this.alphaMode = 0;
        /**
        * Animations to be used for the post processing
        */
        this.animations = new Array();
        /**
         * Enable Pixel Perfect mode where texture is not scaled to be power of 2.
         * Can only be used on a single postprocess or on the last one of a chain. (default: false)
         */
        this.enablePixelPerfectMode = false;
        /**
         * Force the postprocess to be applied without taking in account viewport
         */
        this.forceFullscreenViewport = true;
        /**
         * Scale mode for the post process (default: Engine.SCALEMODE_FLOOR)
         *
         * | Value | Type                                | Description |
         * | ----- | ----------------------------------- | ----------- |
         * | 1     | SCALEMODE_FLOOR                     | [engine.scalemode_floor](https://doc.babylonjs.com/api/classes/babylon.engine#scalemode_floor) |
         * | 2     | SCALEMODE_NEAREST                   | [engine.scalemode_nearest](https://doc.babylonjs.com/api/classes/babylon.engine#scalemode_nearest) |
         * | 3     | SCALEMODE_CEILING                   | [engine.scalemode_ceiling](https://doc.babylonjs.com/api/classes/babylon.engine#scalemode_ceiling) |
         *
         */
        this.scaleMode = 1;
        /**
        * Force textures to be a power of two (default: false)
        */
        this.alwaysForcePOT = false;
        this._samples = 1;
        /**
        * Modify the scale of the post process to be the same as the viewport (default: false)
        */
        this.adaptScaleToCurrentViewport = false;
        this._reusable = false;
        /**
        * Smart array of input and output textures for the post process.
        * @hidden
        */
        this._textures = new SmartArray(2);
        /**
        * The index in _textures that corresponds to the output texture.
        * @hidden
        */
        this._currentRenderTextureInd = 0;
        this._scaleRatio = new Vector2(1, 1);
        this._texelSize = Vector2.Zero();
        // Events
        /**
        * An event triggered when the postprocess is activated.
        */
        this.onActivateObservable = new Observable();
        /**
        * An event triggered when the postprocess changes its size.
        */
        this.onSizeChangedObservable = new Observable();
        /**
        * An event triggered when the postprocess applies its effect.
        */
        this.onApplyObservable = new Observable();
        /**
        * An event triggered before rendering the postprocess
        */
        this.onBeforeRenderObservable = new Observable();
        /**
        * An event triggered after rendering the postprocess
        */
        this.onAfterRenderObservable = new Observable();
        this.name = name;
        if (camera != null) {
            this._camera = camera;
            this._scene = camera.getScene();
            camera.attachPostProcess(this);
            this._engine = this._scene.getEngine();
            this._scene.postProcesses.push(this);
            this.uniqueId = this._scene.getUniqueId();
        }
        else if (engine) {
            this._engine = engine;
            this._engine.postProcesses.push(this);
        }
        this._options = options;
        this.renderTargetSamplingMode = samplingMode ? samplingMode : 1;
        this._reusable = reusable || false;
        this._textureType = textureType;
        this._textureFormat = textureFormat;
        this._samplers = samplers || [];
        this._samplers.push("textureSampler");
        this._fragmentUrl = fragmentUrl;
        this._vertexUrl = vertexUrl;
        this._parameters = parameters || [];
        this._parameters.push("scale");
        this._indexParameters = indexParameters;
        if (!blockCompilation) {
            this.updateEffect(defines);
        }
    }
    Object.defineProperty(PostProcess.prototype, "samples", {
        /**
        * Number of sample textures (default: 1)
        */
        get: function () {
            return this._samples;
        },
        set: function (n) {
            var _this = this;
            this._samples = Math.min(n, this._engine.getCaps().maxMSAASamples);
            this._textures.forEach(function (texture) {
                if (texture.samples !== _this._samples) {
                    _this._engine.updateRenderTargetTextureSampleCount(texture, _this._samples);
                }
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the fragment url or shader name used in the post process.
     * @returns the fragment url or name in the shader store.
     */
    PostProcess.prototype.getEffectName = function () {
        return this._fragmentUrl;
    };
    Object.defineProperty(PostProcess.prototype, "onActivate", {
        /**
        * A function that is added to the onActivateObservable
        */
        set: function (callback) {
            if (this._onActivateObserver) {
                this.onActivateObservable.remove(this._onActivateObserver);
            }
            if (callback) {
                this._onActivateObserver = this.onActivateObservable.add(callback);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PostProcess.prototype, "onSizeChanged", {
        /**
        * A function that is added to the onSizeChangedObservable
        */
        set: function (callback) {
            if (this._onSizeChangedObserver) {
                this.onSizeChangedObservable.remove(this._onSizeChangedObserver);
            }
            this._onSizeChangedObserver = this.onSizeChangedObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PostProcess.prototype, "onApply", {
        /**
        * A function that is added to the onApplyObservable
        */
        set: function (callback) {
            if (this._onApplyObserver) {
                this.onApplyObservable.remove(this._onApplyObserver);
            }
            this._onApplyObserver = this.onApplyObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PostProcess.prototype, "onBeforeRender", {
        /**
        * A function that is added to the onBeforeRenderObservable
        */
        set: function (callback) {
            if (this._onBeforeRenderObserver) {
                this.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
            }
            this._onBeforeRenderObserver = this.onBeforeRenderObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PostProcess.prototype, "onAfterRender", {
        /**
        * A function that is added to the onAfterRenderObservable
        */
        set: function (callback) {
            if (this._onAfterRenderObserver) {
                this.onAfterRenderObservable.remove(this._onAfterRenderObserver);
            }
            this._onAfterRenderObserver = this.onAfterRenderObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PostProcess.prototype, "inputTexture", {
        /**
        * The input texture for this post process and the output texture of the previous post process. When added to a pipeline the previous post process will
        * render it's output into this texture and this texture will be used as textureSampler in the fragment shader of this post process.
        */
        get: function () {
            return this._textures.data[this._currentRenderTextureInd];
        },
        set: function (value) {
            this._forcedOutputTexture = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
    * Since inputTexture should always be defined, if we previously manually set `inputTexture`,
    * the only way to unset it is to use this function to restore its internal state
    */
    PostProcess.prototype.restoreDefaultInputTexture = function () {
        this._forcedOutputTexture = null;
    };
    /**
    * Gets the camera which post process is applied to.
    * @returns The camera the post process is applied to.
    */
    PostProcess.prototype.getCamera = function () {
        return this._camera;
    };
    Object.defineProperty(PostProcess.prototype, "texelSize", {
        /**
        * Gets the texel size of the postprocess.
        * See https://en.wikipedia.org/wiki/Texel_(graphics)
        */
        get: function () {
            if (this._shareOutputWithPostProcess) {
                return this._shareOutputWithPostProcess.texelSize;
            }
            if (this._forcedOutputTexture) {
                this._texelSize.copyFromFloats(1.0 / this._forcedOutputTexture.width, 1.0 / this._forcedOutputTexture.height);
            }
            return this._texelSize;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets a string identifying the name of the class
     * @returns "PostProcess" string
     */
    PostProcess.prototype.getClassName = function () {
        return "PostProcess";
    };
    /**
     * Gets the engine which this post process belongs to.
     * @returns The engine the post process was enabled with.
     */
    PostProcess.prototype.getEngine = function () {
        return this._engine;
    };
    /**
     * The effect that is created when initializing the post process.
     * @returns The created effect corresponding the the postprocess.
     */
    PostProcess.prototype.getEffect = function () {
        return this._effect;
    };
    /**
     * To avoid multiple redundant textures for multiple post process, the output the output texture for this post process can be shared with another.
     * @param postProcess The post process to share the output with.
     * @returns This post process.
     */
    PostProcess.prototype.shareOutputWith = function (postProcess) {
        this._disposeTextures();
        this._shareOutputWithPostProcess = postProcess;
        return this;
    };
    /**
     * Reverses the effect of calling shareOutputWith and returns the post process back to its original state.
     * This should be called if the post process that shares output with this post process is disabled/disposed.
     */
    PostProcess.prototype.useOwnOutput = function () {
        if (this._textures.length == 0) {
            this._textures = new SmartArray(2);
        }
        this._shareOutputWithPostProcess = null;
    };
    /**
     * Updates the effect with the current post process compile time values and recompiles the shader.
     * @param defines Define statements that should be added at the beginning of the shader. (default: null)
     * @param uniforms Set of uniform variables that will be passed to the shader. (default: null)
     * @param samplers Set of Texture2D variables that will be passed to the shader. (default: null)
     * @param indexParameters The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
     * @param onCompiled Called when the shader has been compiled.
     * @param onError Called if there is an error when compiling a shader.
     * @param vertexUrl The url of the vertex shader to be used (default: the one given at construction time)
     * @param fragmentUrl The url of the fragment shader to be used (default: the one given at construction time)
     */
    PostProcess.prototype.updateEffect = function (defines, uniforms, samplers, indexParameters, onCompiled, onError, vertexUrl, fragmentUrl) {
        if (defines === void 0) { defines = null; }
        if (uniforms === void 0) { uniforms = null; }
        if (samplers === void 0) { samplers = null; }
        this._effect = this._engine.createEffect({ vertex: vertexUrl !== null && vertexUrl !== void 0 ? vertexUrl : this._vertexUrl, fragment: fragmentUrl !== null && fragmentUrl !== void 0 ? fragmentUrl : this._fragmentUrl }, ["position"], uniforms || this._parameters, samplers || this._samplers, defines !== null ? defines : "", undefined, onCompiled, onError, indexParameters || this._indexParameters);
    };
    /**
     * The post process is reusable if it can be used multiple times within one frame.
     * @returns If the post process is reusable
     */
    PostProcess.prototype.isReusable = function () {
        return this._reusable;
    };
    /** invalidate frameBuffer to hint the postprocess to create a depth buffer */
    PostProcess.prototype.markTextureDirty = function () {
        this.width = -1;
    };
    /**
     * Activates the post process by intializing the textures to be used when executed. Notifies onActivateObservable.
     * When this post process is used in a pipeline, this is call will bind the input texture of this post process to the output of the previous.
     * @param camera The camera that will be used in the post process. This camera will be used when calling onActivateObservable.
     * @param sourceTexture The source texture to be inspected to get the width and height if not specified in the post process constructor. (default: null)
     * @param forceDepthStencil If true, a depth and stencil buffer will be generated. (default: false)
     * @returns The target texture that was bound to be written to.
     */
    PostProcess.prototype.activate = function (camera, sourceTexture, forceDepthStencil) {
        var _this = this;
        if (sourceTexture === void 0) { sourceTexture = null; }
        camera = camera || this._camera;
        var scene = camera.getScene();
        var engine = scene.getEngine();
        var maxSize = engine.getCaps().maxTextureSize;
        var requiredWidth = ((sourceTexture ? sourceTexture.width : this._engine.getRenderWidth(true)) * this._options) | 0;
        var requiredHeight = ((sourceTexture ? sourceTexture.height : this._engine.getRenderHeight(true)) * this._options) | 0;
        // If rendering to a webvr camera's left or right eye only half the width should be used to avoid resize when rendered to screen
        var webVRCamera = camera.parent;
        if (webVRCamera && (webVRCamera.leftCamera == camera || webVRCamera.rightCamera == camera)) {
            requiredWidth /= 2;
        }
        var desiredWidth = (this._options.width || requiredWidth);
        var desiredHeight = this._options.height || requiredHeight;
        var needMipMaps = this.renderTargetSamplingMode !== 7 &&
            this.renderTargetSamplingMode !== 1 &&
            this.renderTargetSamplingMode !== 2;
        if (!this._shareOutputWithPostProcess && !this._forcedOutputTexture) {
            if (this.adaptScaleToCurrentViewport) {
                var currentViewport = engine.currentViewport;
                if (currentViewport) {
                    desiredWidth *= currentViewport.width;
                    desiredHeight *= currentViewport.height;
                }
            }
            if (needMipMaps || this.alwaysForcePOT) {
                if (!this._options.width) {
                    desiredWidth = engine.needPOTTextures ? Engine.GetExponentOfTwo(desiredWidth, maxSize, this.scaleMode) : desiredWidth;
                }
                if (!this._options.height) {
                    desiredHeight = engine.needPOTTextures ? Engine.GetExponentOfTwo(desiredHeight, maxSize, this.scaleMode) : desiredHeight;
                }
            }
            if (this.width !== desiredWidth || this.height !== desiredHeight) {
                if (this._textures.length > 0) {
                    for (var i = 0; i < this._textures.length; i++) {
                        this._engine._releaseTexture(this._textures.data[i]);
                    }
                    this._textures.reset();
                }
                this.width = desiredWidth;
                this.height = desiredHeight;
                var textureSize = { width: this.width, height: this.height };
                var textureOptions = {
                    generateMipMaps: needMipMaps,
                    generateDepthBuffer: forceDepthStencil || camera._postProcesses.indexOf(this) === 0,
                    generateStencilBuffer: (forceDepthStencil || camera._postProcesses.indexOf(this) === 0) && this._engine.isStencilEnable,
                    samplingMode: this.renderTargetSamplingMode,
                    type: this._textureType,
                    format: this._textureFormat
                };
                this._textures.push(this._engine.createRenderTargetTexture(textureSize, textureOptions));
                if (this._reusable) {
                    this._textures.push(this._engine.createRenderTargetTexture(textureSize, textureOptions));
                }
                this._texelSize.copyFromFloats(1.0 / this.width, 1.0 / this.height);
                this.onSizeChangedObservable.notifyObservers(this);
            }
            this._textures.forEach(function (texture) {
                if (texture.samples !== _this.samples) {
                    _this._engine.updateRenderTargetTextureSampleCount(texture, _this.samples);
                }
            });
        }
        var target;
        if (this._shareOutputWithPostProcess) {
            target = this._shareOutputWithPostProcess.inputTexture;
        }
        else if (this._forcedOutputTexture) {
            target = this._forcedOutputTexture;
            this.width = this._forcedOutputTexture.width;
            this.height = this._forcedOutputTexture.height;
        }
        else {
            target = this.inputTexture;
        }
        // Bind the input of this post process to be used as the output of the previous post process.
        if (this.enablePixelPerfectMode) {
            this._scaleRatio.copyFromFloats(requiredWidth / desiredWidth, requiredHeight / desiredHeight);
            this._engine.bindFramebuffer(target, 0, requiredWidth, requiredHeight, this.forceFullscreenViewport);
        }
        else {
            this._scaleRatio.copyFromFloats(1, 1);
            this._engine.bindFramebuffer(target, 0, undefined, undefined, this.forceFullscreenViewport);
        }
        this.onActivateObservable.notifyObservers(camera);
        // Clear
        if (this.autoClear && this.alphaMode === 0) {
            this._engine.clear(this.clearColor ? this.clearColor : scene.clearColor, scene._allowPostProcessClearColor, true, true);
        }
        if (this._reusable) {
            this._currentRenderTextureInd = (this._currentRenderTextureInd + 1) % 2;
        }
        return target;
    };
    Object.defineProperty(PostProcess.prototype, "isSupported", {
        /**
         * If the post process is supported.
         */
        get: function () {
            return this._effect.isSupported;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PostProcess.prototype, "aspectRatio", {
        /**
         * The aspect ratio of the output texture.
         */
        get: function () {
            if (this._shareOutputWithPostProcess) {
                return this._shareOutputWithPostProcess.aspectRatio;
            }
            if (this._forcedOutputTexture) {
                return this._forcedOutputTexture.width / this._forcedOutputTexture.height;
            }
            return this.width / this.height;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get a value indicating if the post-process is ready to be used
     * @returns true if the post-process is ready (shader is compiled)
     */
    PostProcess.prototype.isReady = function () {
        return this._effect && this._effect.isReady();
    };
    /**
     * Binds all textures and uniforms to the shader, this will be run on every pass.
     * @returns the effect corresponding to this post process. Null if not compiled or not ready.
     */
    PostProcess.prototype.apply = function () {
        // Check
        if (!this._effect || !this._effect.isReady()) {
            return null;
        }
        // States
        this._engine.enableEffect(this._effect);
        this._engine.setState(false);
        this._engine.setDepthBuffer(false);
        this._engine.setDepthWrite(false);
        // Alpha
        this._engine.setAlphaMode(this.alphaMode);
        if (this.alphaConstants) {
            this.getEngine().setAlphaConstants(this.alphaConstants.r, this.alphaConstants.g, this.alphaConstants.b, this.alphaConstants.a);
        }
        // Bind the output texture of the preivous post process as the input to this post process.
        var source;
        if (this._shareOutputWithPostProcess) {
            source = this._shareOutputWithPostProcess.inputTexture;
        }
        else if (this._forcedOutputTexture) {
            source = this._forcedOutputTexture;
        }
        else {
            source = this.inputTexture;
        }
        this._effect._bindTexture("textureSampler", source);
        // Parameters
        this._effect.setVector2("scale", this._scaleRatio);
        this.onApplyObservable.notifyObservers(this._effect);
        return this._effect;
    };
    PostProcess.prototype._disposeTextures = function () {
        if (this._shareOutputWithPostProcess || this._forcedOutputTexture) {
            return;
        }
        if (this._textures.length > 0) {
            for (var i = 0; i < this._textures.length; i++) {
                this._engine._releaseTexture(this._textures.data[i]);
            }
        }
        this._textures.dispose();
    };
    /**
     * Sets the required values to the prepass renderer.
     * @param prePassRenderer defines the prepass renderer to setup.
     * @returns true if the pre pass is needed.
     */
    PostProcess.prototype.setPrePassRenderer = function (prePassRenderer) {
        if (this._prePassEffectConfiguration) {
            this._prePassEffectConfiguration = prePassRenderer.addEffectConfiguration(this._prePassEffectConfiguration);
            this._prePassEffectConfiguration.enabled = true;
            return true;
        }
        return false;
    };
    /**
     * Disposes the post process.
     * @param camera The camera to dispose the post process on.
     */
    PostProcess.prototype.dispose = function (camera) {
        camera = camera || this._camera;
        this._disposeTextures();
        var index;
        if (this._scene) {
            index = this._scene.postProcesses.indexOf(this);
            if (index !== -1) {
                this._scene.postProcesses.splice(index, 1);
            }
        }
        index = this._engine.postProcesses.indexOf(this);
        if (index !== -1) {
            this._engine.postProcesses.splice(index, 1);
        }
        if (!camera) {
            return;
        }
        camera.detachPostProcess(this);
        index = camera._postProcesses.indexOf(this);
        if (index === 0 && camera._postProcesses.length > 0) {
            var firstPostProcess = this._camera._getFirstPostProcess();
            if (firstPostProcess) {
                firstPostProcess.markTextureDirty();
            }
        }
        this.onActivateObservable.clear();
        this.onAfterRenderObservable.clear();
        this.onApplyObservable.clear();
        this.onBeforeRenderObservable.clear();
        this.onSizeChangedObservable.clear();
    };
    /**
     * Serializes the particle system to a JSON object
     * @returns the JSON object
     */
    PostProcess.prototype.serialize = function () {
        var serializationObject = SerializationHelper.Serialize(this);
        serializationObject.customType = "BABYLON." + this.getClassName();
        serializationObject.cameraId = this.getCamera().id;
        serializationObject.reusable = this._reusable;
        serializationObject.options = this._options;
        serializationObject.textureType = this._textureType;
        return serializationObject;
    };
    /**
     * Creates a material from parsed material data
     * @param parsedPostProcess defines parsed post process data
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures
     * @returns a new post process
     */
    PostProcess.Parse = function (parsedPostProcess, scene, rootUrl) {
        var postProcessType = _TypeStore.GetClass(parsedPostProcess.customType);
        if (!postProcessType || !postProcessType._Parse) {
            return null;
        }
        var camera = scene.getCameraByID(parsedPostProcess.cameraId);
        if (!camera) {
            return null;
        }
        return postProcessType._Parse(parsedPostProcess, camera, scene, rootUrl);
    };
    __decorate([
        serialize()
    ], PostProcess.prototype, "uniqueId", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "name", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "width", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "height", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "renderTargetSamplingMode", void 0);
    __decorate([
        serializeAsColor4()
    ], PostProcess.prototype, "clearColor", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "autoClear", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "alphaMode", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "alphaConstants", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "enablePixelPerfectMode", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "forceFullscreenViewport", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "scaleMode", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "alwaysForcePOT", void 0);
    __decorate([
        serialize("samples")
    ], PostProcess.prototype, "_samples", void 0);
    __decorate([
        serialize()
    ], PostProcess.prototype, "adaptScaleToCurrentViewport", void 0);
    return PostProcess;
}());
_TypeStore.RegisteredTypes["BABYLON.PostProcess"] = PostProcess;

export { PostProcess as P };
