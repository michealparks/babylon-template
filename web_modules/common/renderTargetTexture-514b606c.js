import { _ as __extends, O as Observable } from './thinEngine-e576a091.js';
import { V as Vector3, M as Matrix } from './math.color-fc6e801e.js';
import { E as Engine } from './engine-9a1b5aa7.js';
import { T as Tools } from './tools-ab6f1dea.js';
import { P as PostProcessManager, R as RenderingManager } from './scene-cbeb8ae2.js';
import { T as Texture } from './texture-6b1db4fe.js';
import './postProcess-3bcb67b3.js';

/**
 * This Helps creating a texture that will be created from a camera in your scene.
 * It is basically a dynamic texture that could be used to create special effects for instance.
 * Actually, It is the base of lot of effects in the framework like post process, shadows, effect layers and rendering pipelines...
 */
var RenderTargetTexture = /** @class */ (function (_super) {
    __extends(RenderTargetTexture, _super);
    /**
     * Instantiate a render target texture. This is mainly used to render of screen the scene to for instance apply post processse
     * or used a shadow, depth texture...
     * @param name The friendly name of the texture
     * @param size The size of the RTT (number if square, or {width: number, height:number} or {ratio:} to define a ratio from the main scene)
     * @param scene The scene the RTT belongs to. The latest created scene will be used if not precised.
     * @param generateMipMaps True if mip maps need to be generated after render.
     * @param doNotChangeAspectRatio True to not change the aspect ratio of the scene in the RTT
     * @param type The type of the buffer in the RTT (int, half float, float...)
     * @param isCube True if a cube texture needs to be created
     * @param samplingMode The sampling mode to be usedwith the render target (Linear, Nearest...)
     * @param generateDepthBuffer True to generate a depth buffer
     * @param generateStencilBuffer True to generate a stencil buffer
     * @param isMulti True if multiple textures need to be created (Draw Buffers)
     * @param format The internal format of the buffer in the RTT (RED, RG, RGB, RGBA, ALPHA...)
     * @param delayAllocation if the texture allocation should be delayed (default: false)
     */
    function RenderTargetTexture(name, size, scene, generateMipMaps, doNotChangeAspectRatio, type, isCube, samplingMode, generateDepthBuffer, generateStencilBuffer, isMulti, format, delayAllocation) {
        if (doNotChangeAspectRatio === void 0) { doNotChangeAspectRatio = true; }
        if (type === void 0) { type = 0; }
        if (isCube === void 0) { isCube = false; }
        if (samplingMode === void 0) { samplingMode = Texture.TRILINEAR_SAMPLINGMODE; }
        if (generateDepthBuffer === void 0) { generateDepthBuffer = true; }
        if (generateStencilBuffer === void 0) { generateStencilBuffer = false; }
        if (isMulti === void 0) { isMulti = false; }
        if (format === void 0) { format = 5; }
        if (delayAllocation === void 0) { delayAllocation = false; }
        var _this = _super.call(this, null, scene, !generateMipMaps) || this;
        /**
         * Define if particles should be rendered in your texture.
         */
        _this.renderParticles = true;
        /**
         * Define if sprites should be rendered in your texture.
         */
        _this.renderSprites = false;
        /**
         * Define if the camera viewport should be respected while rendering the texture or if the render should be done to the entire texture.
         */
        _this.ignoreCameraViewport = false;
        /**
        * An event triggered when the texture is unbind.
        */
        _this.onBeforeBindObservable = new Observable();
        /**
        * An event triggered when the texture is unbind.
        */
        _this.onAfterUnbindObservable = new Observable();
        /**
        * An event triggered before rendering the texture
        */
        _this.onBeforeRenderObservable = new Observable();
        /**
        * An event triggered after rendering the texture
        */
        _this.onAfterRenderObservable = new Observable();
        /**
        * An event triggered after the texture clear
        */
        _this.onClearObservable = new Observable();
        /**
         * An event triggered when the texture is resized.
         */
        _this.onResizeObservable = new Observable();
        _this._currentRefreshId = -1;
        _this._refreshRate = 1;
        _this._samples = 1;
        /**
         * Gets or sets the center of the bounding box associated with the texture (when in cube mode)
         * It must define where the camera used to render the texture is set
         */
        _this.boundingBoxPosition = Vector3.Zero();
        scene = _this.getScene();
        if (!scene) {
            return _this;
        }
        _this._coordinatesMode = Texture.PROJECTION_MODE;
        _this.renderList = new Array();
        _this.name = name;
        _this.isRenderTarget = true;
        _this._initialSizeParameter = size;
        _this._processSizeParameter(size);
        _this._resizeObserver = _this.getScene().getEngine().onResizeObservable.add(function () {
        });
        _this._generateMipMaps = generateMipMaps ? true : false;
        _this._doNotChangeAspectRatio = doNotChangeAspectRatio;
        // Rendering groups
        _this._renderingManager = new RenderingManager(scene);
        _this._renderingManager._useSceneAutoClearSetup = true;
        if (isMulti) {
            return _this;
        }
        _this._renderTargetOptions = {
            generateMipMaps: generateMipMaps,
            type: type,
            format: format,
            samplingMode: samplingMode,
            generateDepthBuffer: generateDepthBuffer,
            generateStencilBuffer: generateStencilBuffer
        };
        if (samplingMode === Texture.NEAREST_SAMPLINGMODE) {
            _this.wrapU = Texture.CLAMP_ADDRESSMODE;
            _this.wrapV = Texture.CLAMP_ADDRESSMODE;
        }
        if (!delayAllocation) {
            if (isCube) {
                _this._texture = scene.getEngine().createRenderTargetCubeTexture(_this.getRenderSize(), _this._renderTargetOptions);
                _this.coordinatesMode = Texture.INVCUBIC_MODE;
                _this._textureMatrix = Matrix.Identity();
            }
            else {
                _this._texture = scene.getEngine().createRenderTargetTexture(_this._size, _this._renderTargetOptions);
            }
        }
        return _this;
    }
    Object.defineProperty(RenderTargetTexture.prototype, "renderList", {
        /**
        * Use this list to define the list of mesh you want to render.
        */
        get: function () {
            return this._renderList;
        },
        set: function (value) {
            this._renderList = value;
            if (this._renderList) {
                this._hookArray(this._renderList);
            }
        },
        enumerable: false,
        configurable: true
    });
    RenderTargetTexture.prototype._hookArray = function (array) {
        var _this = this;
        var oldPush = array.push;
        array.push = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            var wasEmpty = array.length === 0;
            var result = oldPush.apply(array, items);
            if (wasEmpty && _this.getScene()) {
                _this.getScene().meshes.forEach(function (mesh) {
                    mesh._markSubMeshesAsLightDirty();
                });
            }
            return result;
        };
        var oldSplice = array.splice;
        array.splice = function (index, deleteCount) {
            var deleted = oldSplice.apply(array, [index, deleteCount]);
            if (array.length === 0) {
                _this.getScene().meshes.forEach(function (mesh) {
                    mesh._markSubMeshesAsLightDirty();
                });
            }
            return deleted;
        };
    };
    Object.defineProperty(RenderTargetTexture.prototype, "onAfterUnbind", {
        /**
         * Set a after unbind callback in the texture.
         * This has been kept for backward compatibility and use of onAfterUnbindObservable is recommended.
         */
        set: function (callback) {
            if (this._onAfterUnbindObserver) {
                this.onAfterUnbindObservable.remove(this._onAfterUnbindObserver);
            }
            this._onAfterUnbindObserver = this.onAfterUnbindObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderTargetTexture.prototype, "onBeforeRender", {
        /**
         * Set a before render callback in the texture.
         * This has been kept for backward compatibility and use of onBeforeRenderObservable is recommended.
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
    Object.defineProperty(RenderTargetTexture.prototype, "onAfterRender", {
        /**
         * Set a after render callback in the texture.
         * This has been kept for backward compatibility and use of onAfterRenderObservable is recommended.
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
    Object.defineProperty(RenderTargetTexture.prototype, "onClear", {
        /**
         * Set a clear callback in the texture.
         * This has been kept for backward compatibility and use of onClearObservable is recommended.
         */
        set: function (callback) {
            if (this._onClearObserver) {
                this.onClearObservable.remove(this._onClearObserver);
            }
            this._onClearObserver = this.onClearObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderTargetTexture.prototype, "renderTargetOptions", {
        /**
         * Gets render target creation options that were used.
         */
        get: function () {
            return this._renderTargetOptions;
        },
        enumerable: false,
        configurable: true
    });
    RenderTargetTexture.prototype._onRatioRescale = function () {
        if (this._sizeRatio) {
            this.resize(this._initialSizeParameter);
        }
    };
    Object.defineProperty(RenderTargetTexture.prototype, "boundingBoxSize", {
        get: function () {
            return this._boundingBoxSize;
        },
        /**
         * Gets or sets the size of the bounding box associated with the texture (when in cube mode)
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
    Object.defineProperty(RenderTargetTexture.prototype, "depthStencilTexture", {
        /**
         * In case the RTT has been created with a depth texture, get the associated
         * depth texture.
         * Otherwise, return null.
         */
        get: function () {
            var _a;
            return ((_a = this.getInternalTexture()) === null || _a === void 0 ? void 0 : _a._depthStencilTexture) || null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Creates a depth stencil texture.
     * This is only available in WebGL 2 or with the depth texture extension available.
     * @param comparisonFunction Specifies the comparison function to set on the texture. If 0 or undefined, the texture is not in comparison mode
     * @param bilinearFiltering Specifies whether or not bilinear filtering is enable on the texture
     * @param generateStencil Specifies whether or not a stencil should be allocated in the texture
     */
    RenderTargetTexture.prototype.createDepthStencilTexture = function (comparisonFunction, bilinearFiltering, generateStencil) {
        if (comparisonFunction === void 0) { comparisonFunction = 0; }
        if (bilinearFiltering === void 0) { bilinearFiltering = true; }
        if (generateStencil === void 0) { generateStencil = false; }
        var internalTexture = this.getInternalTexture();
        if (!this.getScene() || !internalTexture) {
            return;
        }
        var engine = this.getScene().getEngine();
        internalTexture._depthStencilTexture = engine.createDepthStencilTexture(this._size, {
            bilinearFiltering: bilinearFiltering,
            comparisonFunction: comparisonFunction,
            generateStencil: generateStencil,
            isCube: this.isCube
        });
    };
    RenderTargetTexture.prototype._processSizeParameter = function (size) {
        if (size.ratio) {
            this._sizeRatio = size.ratio;
            var engine = this._getEngine();
            this._size = {
                width: this._bestReflectionRenderTargetDimension(engine.getRenderWidth(), this._sizeRatio),
                height: this._bestReflectionRenderTargetDimension(engine.getRenderHeight(), this._sizeRatio)
            };
        }
        else {
            this._size = size;
        }
    };
    Object.defineProperty(RenderTargetTexture.prototype, "samples", {
        /**
         * Define the number of samples to use in case of MSAA.
         * It defaults to one meaning no MSAA has been enabled.
         */
        get: function () {
            return this._samples;
        },
        set: function (value) {
            if (this._samples === value) {
                return;
            }
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            this._samples = scene.getEngine().updateRenderTargetTextureSampleCount(this._texture, value);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Resets the refresh counter of the texture and start bak from scratch.
     * Could be useful to regenerate the texture if it is setup to render only once.
     */
    RenderTargetTexture.prototype.resetRefreshCounter = function () {
        this._currentRefreshId = -1;
    };
    Object.defineProperty(RenderTargetTexture.prototype, "refreshRate", {
        /**
         * Define the refresh rate of the texture or the rendering frequency.
         * Use 0 to render just once, 1 to render on every frame, 2 to render every two frames and so on...
         */
        get: function () {
            return this._refreshRate;
        },
        set: function (value) {
            this._refreshRate = value;
            this.resetRefreshCounter();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds a post process to the render target rendering passes.
     * @param postProcess define the post process to add
     */
    RenderTargetTexture.prototype.addPostProcess = function (postProcess) {
        if (!this._postProcessManager) {
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            this._postProcessManager = new PostProcessManager(scene);
            this._postProcesses = new Array();
        }
        this._postProcesses.push(postProcess);
        this._postProcesses[0].autoClear = false;
    };
    /**
     * Clear all the post processes attached to the render target
     * @param dispose define if the cleared post processesshould also be disposed (false by default)
     */
    RenderTargetTexture.prototype.clearPostProcesses = function (dispose) {
        if (dispose === void 0) { dispose = false; }
        if (!this._postProcesses) {
            return;
        }
        if (dispose) {
            for (var _i = 0, _a = this._postProcesses; _i < _a.length; _i++) {
                var postProcess = _a[_i];
                postProcess.dispose();
            }
        }
        this._postProcesses = [];
    };
    /**
     * Remove one of the post process from the list of attached post processes to the texture
     * @param postProcess define the post process to remove from the list
     */
    RenderTargetTexture.prototype.removePostProcess = function (postProcess) {
        if (!this._postProcesses) {
            return;
        }
        var index = this._postProcesses.indexOf(postProcess);
        if (index === -1) {
            return;
        }
        this._postProcesses.splice(index, 1);
        if (this._postProcesses.length > 0) {
            this._postProcesses[0].autoClear = false;
        }
    };
    /** @hidden */
    RenderTargetTexture.prototype._shouldRender = function () {
        if (this._currentRefreshId === -1) { // At least render once
            this._currentRefreshId = 1;
            return true;
        }
        if (this.refreshRate === this._currentRefreshId) {
            this._currentRefreshId = 1;
            return true;
        }
        this._currentRefreshId++;
        return false;
    };
    /**
     * Gets the actual render size of the texture.
     * @returns the width of the render size
     */
    RenderTargetTexture.prototype.getRenderSize = function () {
        return this.getRenderWidth();
    };
    /**
     * Gets the actual render width of the texture.
     * @returns the width of the render size
     */
    RenderTargetTexture.prototype.getRenderWidth = function () {
        if (this._size.width) {
            return this._size.width;
        }
        return this._size;
    };
    /**
     * Gets the actual render height of the texture.
     * @returns the height of the render size
     */
    RenderTargetTexture.prototype.getRenderHeight = function () {
        if (this._size.width) {
            return this._size.height;
        }
        return this._size;
    };
    /**
     * Gets the actual number of layers of the texture.
     * @returns the number of layers
     */
    RenderTargetTexture.prototype.getRenderLayers = function () {
        var layers = this._size.layers;
        if (layers) {
            return layers;
        }
        return 0;
    };
    Object.defineProperty(RenderTargetTexture.prototype, "canRescale", {
        /**
         * Get if the texture can be rescaled or not.
         */
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Resize the texture using a ratio.
     * @param ratio the ratio to apply to the texture size in order to compute the new target size
     */
    RenderTargetTexture.prototype.scale = function (ratio) {
        var newSize = Math.max(1, this.getRenderSize() * ratio);
        this.resize(newSize);
    };
    /**
     * Get the texture reflection matrix used to rotate/transform the reflection.
     * @returns the reflection matrix
     */
    RenderTargetTexture.prototype.getReflectionTextureMatrix = function () {
        if (this.isCube) {
            return this._textureMatrix;
        }
        return _super.prototype.getReflectionTextureMatrix.call(this);
    };
    /**
     * Resize the texture to a new desired size.
     * Be carrefull as it will recreate all the data in the new texture.
     * @param size Define the new size. It can be:
     *   - a number for squared texture,
     *   - an object containing { width: number, height: number }
     *   - or an object containing a ratio { ratio: number }
     */
    RenderTargetTexture.prototype.resize = function (size) {
        var wasCube = this.isCube;
        this.releaseInternalTexture();
        var scene = this.getScene();
        if (!scene) {
            return;
        }
        this._processSizeParameter(size);
        if (wasCube) {
            this._texture = scene.getEngine().createRenderTargetCubeTexture(this.getRenderSize(), this._renderTargetOptions);
        }
        else {
            this._texture = scene.getEngine().createRenderTargetTexture(this._size, this._renderTargetOptions);
        }
        if (this.onResizeObservable.hasObservers()) {
            this.onResizeObservable.notifyObservers(this);
        }
    };
    /**
     * Renders all the objects from the render list into the texture.
     * @param useCameraPostProcess Define if camera post processes should be used during the rendering
     * @param dumpForDebug Define if the rendering result should be dumped (copied) for debugging purpose
     */
    RenderTargetTexture.prototype.render = function (useCameraPostProcess, dumpForDebug) {
        if (useCameraPostProcess === void 0) { useCameraPostProcess = false; }
        if (dumpForDebug === void 0) { dumpForDebug = false; }
        var scene = this.getScene();
        if (!scene) {
            return;
        }
        var engine = scene.getEngine();
        if (this.useCameraPostProcesses !== undefined) {
            useCameraPostProcess = this.useCameraPostProcesses;
        }
        if (this._waitingRenderList) {
            this.renderList = [];
            for (var index = 0; index < this._waitingRenderList.length; index++) {
                var id = this._waitingRenderList[index];
                var mesh_1 = scene.getMeshByID(id);
                if (mesh_1) {
                    this.renderList.push(mesh_1);
                }
            }
            this._waitingRenderList = undefined;
        }
        // Is predicate defined?
        if (this.renderListPredicate) {
            if (this.renderList) {
                this.renderList.length = 0; // Clear previous renderList
            }
            else {
                this.renderList = [];
            }
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            var sceneMeshes = scene.meshes;
            for (var index = 0; index < sceneMeshes.length; index++) {
                var mesh = sceneMeshes[index];
                if (this.renderListPredicate(mesh)) {
                    this.renderList.push(mesh);
                }
            }
        }
        this.onBeforeBindObservable.notifyObservers(this);
        // Set custom projection.
        // Needs to be before binding to prevent changing the aspect ratio.
        var camera;
        if (this.activeCamera) {
            camera = this.activeCamera;
            engine.setViewport(this.activeCamera.viewport, this.getRenderWidth(), this.getRenderHeight());
            if (this.activeCamera !== scene.activeCamera) {
                scene.setTransformMatrix(this.activeCamera.getViewMatrix(), this.activeCamera.getProjectionMatrix(true));
            }
        }
        else {
            camera = scene.activeCamera;
            if (camera) {
                engine.setViewport(camera.viewport, this.getRenderWidth(), this.getRenderHeight());
            }
        }
        this._defaultRenderListPrepared = false;
        if (this.is2DArray) {
            for (var layer = 0; layer < this.getRenderLayers(); layer++) {
                this.renderToTarget(0, useCameraPostProcess, dumpForDebug, layer, camera);
                scene.incrementRenderId();
                scene.resetCachedMaterial();
            }
        }
        else if (this.isCube) {
            for (var face = 0; face < 6; face++) {
                this.renderToTarget(face, useCameraPostProcess, dumpForDebug, undefined, camera);
                scene.incrementRenderId();
                scene.resetCachedMaterial();
            }
        }
        else {
            this.renderToTarget(0, useCameraPostProcess, dumpForDebug, undefined, camera);
        }
        this.onAfterUnbindObservable.notifyObservers(this);
        if (scene.activeCamera) {
            // Do not avoid setting uniforms when multiple scenes are active as another camera may have overwrite these
            if (scene.getEngine().scenes.length > 1 || (this.activeCamera && this.activeCamera !== scene.activeCamera)) {
                scene.setTransformMatrix(scene.activeCamera.getViewMatrix(), scene.activeCamera.getProjectionMatrix(true));
            }
            engine.setViewport(scene.activeCamera.viewport);
        }
        scene.resetCachedMaterial();
    };
    RenderTargetTexture.prototype._bestReflectionRenderTargetDimension = function (renderDimension, scale) {
        var minimum = 128;
        var x = renderDimension * scale;
        var curved = Engine.NearestPOT(x + (minimum * minimum / (minimum + x)));
        // Ensure we don't exceed the render dimension (while staying POT)
        return Math.min(Engine.FloorPOT(renderDimension), curved);
    };
    RenderTargetTexture.prototype._prepareRenderingManager = function (currentRenderList, currentRenderListLength, camera, checkLayerMask) {
        var scene = this.getScene();
        if (!scene) {
            return;
        }
        this._renderingManager.reset();
        var sceneRenderId = scene.getRenderId();
        for (var meshIndex = 0; meshIndex < currentRenderListLength; meshIndex++) {
            var mesh = currentRenderList[meshIndex];
            if (mesh && !mesh.isBlocked) {
                if (this.customIsReadyFunction) {
                    if (!this.customIsReadyFunction(mesh, this.refreshRate)) {
                        this.resetRefreshCounter();
                        continue;
                    }
                }
                else if (!mesh.isReady(this.refreshRate === 0)) {
                    this.resetRefreshCounter();
                    continue;
                }
                if (!mesh._internalAbstractMeshDataInfo._currentLODIsUpToDate && scene.activeCamera) {
                    mesh._internalAbstractMeshDataInfo._currentLOD = scene.customLODSelector ? scene.customLODSelector(mesh, scene.activeCamera) : mesh.getLOD(scene.activeCamera);
                    mesh._internalAbstractMeshDataInfo._currentLODIsUpToDate = true;
                }
                if (!mesh._internalAbstractMeshDataInfo._currentLOD) {
                    continue;
                }
                var meshToRender = mesh._internalAbstractMeshDataInfo._currentLOD;
                meshToRender._preActivateForIntermediateRendering(sceneRenderId);
                var isMasked = void 0;
                if (checkLayerMask && camera) {
                    isMasked = ((mesh.layerMask & camera.layerMask) === 0);
                }
                else {
                    isMasked = false;
                }
                if (mesh.isEnabled() && mesh.isVisible && mesh.subMeshes && !isMasked) {
                    if (meshToRender !== mesh) {
                        meshToRender._activate(sceneRenderId, true);
                    }
                    if (mesh._activate(sceneRenderId, true) && mesh.subMeshes.length) {
                        if (!mesh.isAnInstance) {
                            meshToRender._internalAbstractMeshDataInfo._onlyForInstancesIntermediate = false;
                        }
                        else {
                            if (mesh._internalAbstractMeshDataInfo._actAsRegularMesh) {
                                meshToRender = mesh;
                            }
                        }
                        meshToRender._internalAbstractMeshDataInfo._isActiveIntermediate = true;
                        for (var subIndex = 0; subIndex < meshToRender.subMeshes.length; subIndex++) {
                            var subMesh = meshToRender.subMeshes[subIndex];
                            this._renderingManager.dispatch(subMesh, meshToRender);
                        }
                    }
                }
            }
        }
        for (var particleIndex = 0; particleIndex < scene.particleSystems.length; particleIndex++) {
            var particleSystem = scene.particleSystems[particleIndex];
            var emitter = particleSystem.emitter;
            if (!particleSystem.isStarted() || !emitter || !emitter.position || !emitter.isEnabled()) {
                continue;
            }
            if (currentRenderList.indexOf(emitter) >= 0) {
                this._renderingManager.dispatchParticles(particleSystem);
            }
        }
    };
    /**
     * @hidden
     * @param faceIndex face index to bind to if this is a cubetexture
     * @param layer defines the index of the texture to bind in the array
     */
    RenderTargetTexture.prototype._bindFrameBuffer = function (faceIndex, layer) {
        if (faceIndex === void 0) { faceIndex = 0; }
        if (layer === void 0) { layer = 0; }
        var scene = this.getScene();
        if (!scene) {
            return;
        }
        var engine = scene.getEngine();
        if (this._texture) {
            engine.bindFramebuffer(this._texture, this.isCube ? faceIndex : undefined, undefined, undefined, this.ignoreCameraViewport, 0, layer);
        }
    };
    RenderTargetTexture.prototype.unbindFrameBuffer = function (engine, faceIndex) {
        var _this = this;
        if (!this._texture) {
            return;
        }
        engine.unBindFramebuffer(this._texture, this.isCube, function () {
            _this.onAfterRenderObservable.notifyObservers(faceIndex);
        });
    };
    RenderTargetTexture.prototype.renderToTarget = function (faceIndex, useCameraPostProcess, dumpForDebug, layer, camera) {
        if (layer === void 0) { layer = 0; }
        if (camera === void 0) { camera = null; }
        var scene = this.getScene();
        if (!scene) {
            return;
        }
        var engine = scene.getEngine();
        if (!this._texture) {
            return;
        }
        // Bind
        if (this._postProcessManager) {
            this._postProcessManager._prepareFrame(this._texture, this._postProcesses);
        }
        else if (!useCameraPostProcess || !scene.postProcessManager._prepareFrame(this._texture)) {
            this._bindFrameBuffer(faceIndex, layer);
        }
        if (this.is2DArray) {
            this.onBeforeRenderObservable.notifyObservers(layer);
        }
        else {
            this.onBeforeRenderObservable.notifyObservers(faceIndex);
        }
        // Get the list of meshes to render
        var currentRenderList = null;
        var defaultRenderList = this.renderList ? this.renderList : scene.getActiveMeshes().data;
        var defaultRenderListLength = this.renderList ? this.renderList.length : scene.getActiveMeshes().length;
        if (this.getCustomRenderList) {
            currentRenderList = this.getCustomRenderList(this.is2DArray ? layer : faceIndex, defaultRenderList, defaultRenderListLength);
        }
        if (!currentRenderList) {
            // No custom render list provided, we prepare the rendering for the default list, but check
            // first if we did not already performed the preparation before so as to avoid re-doing it several times
            if (!this._defaultRenderListPrepared) {
                this._prepareRenderingManager(defaultRenderList, defaultRenderListLength, camera, !this.renderList);
                this._defaultRenderListPrepared = true;
            }
            currentRenderList = defaultRenderList;
        }
        else {
            // Prepare the rendering for the custom render list provided
            this._prepareRenderingManager(currentRenderList, currentRenderList.length, camera, false);
        }
        // Clear
        if (this.onClearObservable.hasObservers()) {
            this.onClearObservable.notifyObservers(engine);
        }
        else {
            engine.clear(this.clearColor || scene.clearColor, true, true, true);
        }
        if (!this._doNotChangeAspectRatio) {
            scene.updateTransformMatrix(true);
        }
        // Before Camera Draw
        for (var _i = 0, _a = scene._beforeRenderTargetDrawStage; _i < _a.length; _i++) {
            var step = _a[_i];
            step.action(this);
        }
        // Render
        this._renderingManager.render(this.customRenderFunction, currentRenderList, this.renderParticles, this.renderSprites);
        // After Camera Draw
        for (var _b = 0, _c = scene._afterRenderTargetDrawStage; _b < _c.length; _b++) {
            var step = _c[_b];
            step.action(this);
        }
        if (this._postProcessManager) {
            this._postProcessManager._finalizeFrame(false, this._texture, faceIndex, this._postProcesses, this.ignoreCameraViewport);
        }
        else if (useCameraPostProcess) {
            scene.postProcessManager._finalizeFrame(false, this._texture, faceIndex);
        }
        if (!this._doNotChangeAspectRatio) {
            scene.updateTransformMatrix(true);
        }
        // Dump ?
        if (dumpForDebug) {
            Tools.DumpFramebuffer(this.getRenderWidth(), this.getRenderHeight(), engine);
        }
        // Unbind
        if (!this.isCube || faceIndex === 5) {
            if (this.isCube) {
                if (faceIndex === 5) {
                    engine.generateMipMapsForCubemap(this._texture);
                }
            }
            this.unbindFrameBuffer(engine, faceIndex);
        }
        else {
            this.onAfterRenderObservable.notifyObservers(faceIndex);
        }
    };
    /**
     * Overrides the default sort function applied in the renderging group to prepare the meshes.
     * This allowed control for front to back rendering or reversly depending of the special needs.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param opaqueSortCompareFn The opaque queue comparison function use to sort.
     * @param alphaTestSortCompareFn The alpha test queue comparison function use to sort.
     * @param transparentSortCompareFn The transparent queue comparison function use to sort.
     */
    RenderTargetTexture.prototype.setRenderingOrder = function (renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn) {
        if (opaqueSortCompareFn === void 0) { opaqueSortCompareFn = null; }
        if (alphaTestSortCompareFn === void 0) { alphaTestSortCompareFn = null; }
        if (transparentSortCompareFn === void 0) { transparentSortCompareFn = null; }
        this._renderingManager.setRenderingOrder(renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn);
    };
    /**
     * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
     */
    RenderTargetTexture.prototype.setRenderingAutoClearDepthStencil = function (renderingGroupId, autoClearDepthStencil) {
        this._renderingManager.setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil);
        this._renderingManager._useSceneAutoClearSetup = false;
    };
    /**
     * Clones the texture.
     * @returns the cloned texture
     */
    RenderTargetTexture.prototype.clone = function () {
        var textureSize = this.getSize();
        var newTexture = new RenderTargetTexture(this.name, textureSize, this.getScene(), this._renderTargetOptions.generateMipMaps, this._doNotChangeAspectRatio, this._renderTargetOptions.type, this.isCube, this._renderTargetOptions.samplingMode, this._renderTargetOptions.generateDepthBuffer, this._renderTargetOptions.generateStencilBuffer);
        // Base texture
        newTexture.hasAlpha = this.hasAlpha;
        newTexture.level = this.level;
        // RenderTarget Texture
        newTexture.coordinatesMode = this.coordinatesMode;
        if (this.renderList) {
            newTexture.renderList = this.renderList.slice(0);
        }
        return newTexture;
    };
    /**
     * Serialize the texture to a JSON representation we can easily use in the resepective Parse function.
     * @returns The JSON representation of the texture
     */
    RenderTargetTexture.prototype.serialize = function () {
        if (!this.name) {
            return null;
        }
        var serializationObject = _super.prototype.serialize.call(this);
        serializationObject.renderTargetSize = this.getRenderSize();
        serializationObject.renderList = [];
        if (this.renderList) {
            for (var index = 0; index < this.renderList.length; index++) {
                serializationObject.renderList.push(this.renderList[index].id);
            }
        }
        return serializationObject;
    };
    /**
     *  This will remove the attached framebuffer objects. The texture will not be able to be used as render target anymore
     */
    RenderTargetTexture.prototype.disposeFramebufferObjects = function () {
        var objBuffer = this.getInternalTexture();
        var scene = this.getScene();
        if (objBuffer && scene) {
            scene.getEngine()._releaseFramebufferObjects(objBuffer);
        }
    };
    /**
     * Dispose the texture and release its associated resources.
     */
    RenderTargetTexture.prototype.dispose = function () {
        this.onResizeObservable.clear();
        this.onClearObservable.clear();
        this.onAfterRenderObservable.clear();
        this.onAfterUnbindObservable.clear();
        this.onBeforeBindObservable.clear();
        this.onBeforeRenderObservable.clear();
        if (this._postProcessManager) {
            this._postProcessManager.dispose();
            this._postProcessManager = null;
        }
        this.clearPostProcesses(true);
        if (this._resizeObserver) {
            this.getScene().getEngine().onResizeObservable.remove(this._resizeObserver);
            this._resizeObserver = null;
        }
        this.renderList = null;
        // Remove from custom render targets
        var scene = this.getScene();
        if (!scene) {
            return;
        }
        var index = scene.customRenderTargets.indexOf(this);
        if (index >= 0) {
            scene.customRenderTargets.splice(index, 1);
        }
        for (var _i = 0, _a = scene.cameras; _i < _a.length; _i++) {
            var camera = _a[_i];
            index = camera.customRenderTargets.indexOf(this);
            if (index >= 0) {
                camera.customRenderTargets.splice(index, 1);
            }
        }
        if (this.depthStencilTexture) {
            this.getScene().getEngine()._releaseTexture(this.depthStencilTexture);
        }
        _super.prototype.dispose.call(this);
    };
    /** @hidden */
    RenderTargetTexture.prototype._rebuild = function () {
        if (this.refreshRate === RenderTargetTexture.REFRESHRATE_RENDER_ONCE) {
            this.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        }
        if (this._postProcessManager) {
            this._postProcessManager._rebuild();
        }
    };
    /**
     * Clear the info related to rendering groups preventing retention point in material dispose.
     */
    RenderTargetTexture.prototype.freeRenderingGroups = function () {
        if (this._renderingManager) {
            this._renderingManager.freeRenderingGroups();
        }
    };
    /**
     * Gets the number of views the corresponding to the texture (eg. a MultiviewRenderTarget will have > 1)
     * @returns the view count
     */
    RenderTargetTexture.prototype.getViewCount = function () {
        return 1;
    };
    /**
     * The texture will only be rendered once which can be useful to improve performance if everything in your render is static for instance.
     */
    RenderTargetTexture.REFRESHRATE_RENDER_ONCE = 0;
    /**
     * The texture will only be rendered rendered every frame and is recomended for dynamic contents.
     */
    RenderTargetTexture.REFRESHRATE_RENDER_ONEVERYFRAME = 1;
    /**
     * The texture will be rendered every 2 frames which could be enough if your dynamic objects are not
     * the central point of your effect and can save a lot of performances.
     */
    RenderTargetTexture.REFRESHRATE_RENDER_ONEVERYTWOFRAMES = 2;
    return RenderTargetTexture;
}(Texture));
Texture._CreateRenderTargetTexture = function (name, renderTargetSize, scene, generateMipMaps) {
    return new RenderTargetTexture(name, renderTargetSize, scene, generateMipMaps);
};

export { RenderTargetTexture as R };
