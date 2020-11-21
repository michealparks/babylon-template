import { f as Effect, _ as __extends, a as __decorate, d as __assign, b as _DevTools, O as Observable, E as EngineStore, L as Logger } from './thinEngine-e576a091.js';
import { S as SerializationHelper, a as serialize, k as serializeAsVector2, e as serializeAsColor4, l as serializeAsCameraReference } from './node-87d9c658.js';
import { _ as _TypeStore, C as Color4, a as Vector2, e as ToGammaSpace } from './math.color-fc6e801e.js';
import { E as Engine } from './engine-9a1b5aa7.js';
import { C as Camera } from './pointerEvents-12a2451c.js';
import { T as Tools } from './tools-ab6f1dea.js';
import { A as AbstractScene, I as ImageProcessingConfiguration, S as Scene } from './scene-cbeb8ae2.js';
import { V as VertexBuffer, M as Material, d as SceneComponentConstants } from './sceneComponent-5502b64a.js';
import { T as Texture } from './texture-6b1db4fe.js';
import { P as PostProcess } from './postProcess-3bcb67b3.js';
import './helperFunctions-f4fc40e0.js';
import { M as MaterialHelper, E as EffectFallbacks } from './bonesVertex-5b94878d.js';
import { R as RenderTargetTexture } from './renderTargetTexture-514b606c.js';
import './morphTargetsVertex-924a5383.js';

var name = 'kernelBlurVaryingDeclaration';
var shader = "varying vec2 sampleCoord{X};";
Effect.IncludesShadersStore[name] = shader;

var name$1 = 'packingFunctions';
var shader$1 = "vec4 pack(float depth)\n{\nconst vec4 bit_shift=vec4(255.0*255.0*255.0,255.0*255.0,255.0,1.0);\nconst vec4 bit_mask=vec4(0.0,1.0/255.0,1.0/255.0,1.0/255.0);\nvec4 res=fract(depth*bit_shift);\nres-=res.xxyz*bit_mask;\nreturn res;\n}\nfloat unpack(vec4 color)\n{\nconst vec4 bit_shift=vec4(1.0/(255.0*255.0*255.0),1.0/(255.0*255.0),1.0/255.0,1.0);\nreturn dot(color,bit_shift);\n}";
Effect.IncludesShadersStore[name$1] = shader$1;

var name$2 = 'kernelBlurFragment';
var shader$2 = "#ifdef DOF\nfactor=sampleCoC(sampleCoord{X});\ncomputedWeight=KERNEL_WEIGHT{X}*factor;\nsumOfWeights+=computedWeight;\n#else\ncomputedWeight=KERNEL_WEIGHT{X};\n#endif\n#ifdef PACKEDFLOAT\nblend+=unpack(texture2D(textureSampler,sampleCoord{X}))*computedWeight;\n#else\nblend+=texture2D(textureSampler,sampleCoord{X})*computedWeight;\n#endif";
Effect.IncludesShadersStore[name$2] = shader$2;

var name$3 = 'kernelBlurFragment2';
var shader$3 = "#ifdef DOF\nfactor=sampleCoC(sampleCenter+delta*KERNEL_DEP_OFFSET{X});\ncomputedWeight=KERNEL_DEP_WEIGHT{X}*factor;\nsumOfWeights+=computedWeight;\n#else\ncomputedWeight=KERNEL_DEP_WEIGHT{X};\n#endif\n#ifdef PACKEDFLOAT\nblend+=unpack(texture2D(textureSampler,sampleCenter+delta*KERNEL_DEP_OFFSET{X}))*computedWeight;\n#else\nblend+=texture2D(textureSampler,sampleCenter+delta*KERNEL_DEP_OFFSET{X})*computedWeight;\n#endif";
Effect.IncludesShadersStore[name$3] = shader$3;

var name$4 = 'kernelBlurPixelShader';
var shader$4 = "\nuniform sampler2D textureSampler;\nuniform vec2 delta;\n\nvarying vec2 sampleCenter;\n#ifdef DOF\nuniform sampler2D circleOfConfusionSampler;\nuniform vec2 cameraMinMaxZ;\nfloat sampleDistance(const in vec2 offset) {\nfloat depth=texture2D(circleOfConfusionSampler,offset).g;\nreturn cameraMinMaxZ.x+(cameraMinMaxZ.y-cameraMinMaxZ.x)*depth;\n}\nfloat sampleCoC(const in vec2 offset) {\nfloat coc=texture2D(circleOfConfusionSampler,offset).r;\nreturn coc;\n}\n#endif\n#include<kernelBlurVaryingDeclaration>[0..varyingCount]\n#ifdef PACKEDFLOAT\n#include<packingFunctions>\n#endif\nvoid main(void)\n{\nfloat computedWeight=0.0;\n#ifdef PACKEDFLOAT\nfloat blend=0.;\n#else\nvec4 blend=vec4(0.);\n#endif\n#ifdef DOF\nfloat sumOfWeights=CENTER_WEIGHT;\nfloat factor=0.0;\n\n#ifdef PACKEDFLOAT\nblend+=unpack(texture2D(textureSampler,sampleCenter))*CENTER_WEIGHT;\n#else\nblend+=texture2D(textureSampler,sampleCenter)*CENTER_WEIGHT;\n#endif\n#endif\n#include<kernelBlurFragment>[0..varyingCount]\n#include<kernelBlurFragment2>[0..depCount]\n#ifdef PACKEDFLOAT\ngl_FragColor=pack(blend);\n#else\ngl_FragColor=blend;\n#endif\n#ifdef DOF\ngl_FragColor/=sumOfWeights;\n#endif\n}";
Effect.ShadersStore[name$4] = shader$4;

var name$5 = 'kernelBlurVertex';
var shader$5 = "sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};";
Effect.IncludesShadersStore[name$5] = shader$5;

var name$6 = 'kernelBlurVertexShader';
var shader$6 = "\nattribute vec2 position;\n\nuniform vec2 delta;\n\nvarying vec2 sampleCenter;\n#include<kernelBlurVaryingDeclaration>[0..varyingCount]\nconst vec2 madd=vec2(0.5,0.5);\nvoid main(void) {\nsampleCenter=(position*madd+madd);\n#include<kernelBlurVertex>[0..varyingCount]\ngl_Position=vec4(position,0.0,1.0);\n}";
Effect.ShadersStore[name$6] = shader$6;

/**
 * The Blur Post Process which blurs an image based on a kernel and direction.
 * Can be used twice in x and y directions to perform a guassian blur in two passes.
 */
var BlurPostProcess = /** @class */ (function (_super) {
    __extends(BlurPostProcess, _super);
    /**
     * Creates a new instance BlurPostProcess
     * @param name The name of the effect.
     * @param direction The direction in which to blur the image.
     * @param kernel The size of the kernel to be used when computing the blur. eg. Size of 3 will blur the center pixel by 2 pixels surrounding it.
     * @param options The required width/height ratio to downsize to before computing the render pass. (Use 1.0 for full size)
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    function BlurPostProcess(name, direction, kernel, options, camera, samplingMode, engine, reusable, textureType, defines, blockCompilation) {
        if (samplingMode === void 0) { samplingMode = Texture.BILINEAR_SAMPLINGMODE; }
        if (textureType === void 0) { textureType = 0; }
        if (defines === void 0) { defines = ""; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, name, "kernelBlur", ["delta", "direction", "cameraMinMaxZ"], ["circleOfConfusionSampler"], options, camera, samplingMode, engine, reusable, null, textureType, "kernelBlur", { varyingCount: 0, depCount: 0 }, true) || this;
        _this.blockCompilation = blockCompilation;
        _this._packedFloat = false;
        _this._staticDefines = "";
        _this._staticDefines = defines;
        _this.direction = direction;
        _this.onApplyObservable.add(function (effect) {
            if (_this._outputTexture) {
                effect.setFloat2('delta', (1 / _this._outputTexture.width) * _this.direction.x, (1 / _this._outputTexture.height) * _this.direction.y);
            }
            else {
                effect.setFloat2('delta', (1 / _this.width) * _this.direction.x, (1 / _this.height) * _this.direction.y);
            }
        });
        _this.kernel = kernel;
        return _this;
    }
    Object.defineProperty(BlurPostProcess.prototype, "kernel", {
        /**
         * Gets the length in pixels of the blur sample region
         */
        get: function () {
            return this._idealKernel;
        },
        /**
         * Sets the length in pixels of the blur sample region
         */
        set: function (v) {
            if (this._idealKernel === v) {
                return;
            }
            v = Math.max(v, 1);
            this._idealKernel = v;
            this._kernel = this._nearestBestKernel(v);
            if (!this.blockCompilation) {
                this._updateParameters();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BlurPostProcess.prototype, "packedFloat", {
        /**
         * Gets wether or not the blur is unpacking/repacking floats
         */
        get: function () {
            return this._packedFloat;
        },
        /**
         * Sets wether or not the blur needs to unpack/repack floats
         */
        set: function (v) {
            if (this._packedFloat === v) {
                return;
            }
            this._packedFloat = v;
            if (!this.blockCompilation) {
                this._updateParameters();
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets a string identifying the name of the class
     * @returns "BlurPostProcess" string
     */
    BlurPostProcess.prototype.getClassName = function () {
        return "BlurPostProcess";
    };
    /**
     * Updates the effect with the current post process compile time values and recompiles the shader.
     * @param defines Define statements that should be added at the beginning of the shader. (default: null)
     * @param uniforms Set of uniform variables that will be passed to the shader. (default: null)
     * @param samplers Set of Texture2D variables that will be passed to the shader. (default: null)
     * @param indexParameters The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
     * @param onCompiled Called when the shader has been compiled.
     * @param onError Called if there is an error when compiling a shader.
     */
    BlurPostProcess.prototype.updateEffect = function (defines, uniforms, samplers, indexParameters, onCompiled, onError) {
        this._updateParameters(onCompiled, onError);
    };
    BlurPostProcess.prototype._updateParameters = function (onCompiled, onError) {
        // Generate sampling offsets and weights
        var N = this._kernel;
        var centerIndex = (N - 1) / 2;
        // Generate Gaussian sampling weights over kernel
        var offsets = [];
        var weights = [];
        var totalWeight = 0;
        for (var i = 0; i < N; i++) {
            var u = i / (N - 1);
            var w = this._gaussianWeight(u * 2.0 - 1);
            offsets[i] = (i - centerIndex);
            weights[i] = w;
            totalWeight += w;
        }
        // Normalize weights
        for (var i = 0; i < weights.length; i++) {
            weights[i] /= totalWeight;
        }
        // Optimize: combine samples to take advantage of hardware linear sampling
        // Walk from left to center, combining pairs (symmetrically)
        var linearSamplingWeights = [];
        var linearSamplingOffsets = [];
        var linearSamplingMap = [];
        for (var i = 0; i <= centerIndex; i += 2) {
            var j = Math.min(i + 1, Math.floor(centerIndex));
            var singleCenterSample = i === j;
            if (singleCenterSample) {
                linearSamplingMap.push({ o: offsets[i], w: weights[i] });
            }
            else {
                var sharedCell = j === centerIndex;
                var weightLinear = (weights[i] + weights[j] * (sharedCell ? .5 : 1.));
                var offsetLinear = offsets[i] + 1 / (1 + weights[i] / weights[j]);
                if (offsetLinear === 0) {
                    linearSamplingMap.push({ o: offsets[i], w: weights[i] });
                    linearSamplingMap.push({ o: offsets[i + 1], w: weights[i + 1] });
                }
                else {
                    linearSamplingMap.push({ o: offsetLinear, w: weightLinear });
                    linearSamplingMap.push({ o: -offsetLinear, w: weightLinear });
                }
            }
        }
        for (var i = 0; i < linearSamplingMap.length; i++) {
            linearSamplingOffsets[i] = linearSamplingMap[i].o;
            linearSamplingWeights[i] = linearSamplingMap[i].w;
        }
        // Replace with optimized
        offsets = linearSamplingOffsets;
        weights = linearSamplingWeights;
        // Generate shaders
        var maxVaryingRows = this.getEngine().getCaps().maxVaryingVectors;
        var freeVaryingVec2 = Math.max(maxVaryingRows, 0.) - 1; // Because of sampleCenter
        var varyingCount = Math.min(offsets.length, freeVaryingVec2);
        var defines = "";
        defines += this._staticDefines;
        // The DOF fragment should ignore the center pixel when looping as it is handled manualy in the fragment shader.
        if (this._staticDefines.indexOf("DOF") != -1) {
            defines += "#define CENTER_WEIGHT " + this._glslFloat(weights[varyingCount - 1]) + "\r\n";
            varyingCount--;
        }
        for (var i = 0; i < varyingCount; i++) {
            defines += "#define KERNEL_OFFSET" + i + " " + this._glslFloat(offsets[i]) + "\r\n";
            defines += "#define KERNEL_WEIGHT" + i + " " + this._glslFloat(weights[i]) + "\r\n";
        }
        var depCount = 0;
        for (var i = freeVaryingVec2; i < offsets.length; i++) {
            defines += "#define KERNEL_DEP_OFFSET" + depCount + " " + this._glslFloat(offsets[i]) + "\r\n";
            defines += "#define KERNEL_DEP_WEIGHT" + depCount + " " + this._glslFloat(weights[i]) + "\r\n";
            depCount++;
        }
        if (this.packedFloat) {
            defines += "#define PACKEDFLOAT 1";
        }
        this.blockCompilation = false;
        _super.prototype.updateEffect.call(this, defines, null, null, {
            varyingCount: varyingCount,
            depCount: depCount
        }, onCompiled, onError);
    };
    /**
     * Best kernels are odd numbers that when divided by 2, their integer part is even, so 5, 9 or 13.
     * Other odd kernels optimize correctly but require proportionally more samples, even kernels are
     * possible but will produce minor visual artifacts. Since each new kernel requires a new shader we
     * want to minimize kernel changes, having gaps between physical kernels is helpful in that regard.
     * The gaps between physical kernels are compensated for in the weighting of the samples
     * @param idealKernel Ideal blur kernel.
     * @return Nearest best kernel.
     */
    BlurPostProcess.prototype._nearestBestKernel = function (idealKernel) {
        var v = Math.round(idealKernel);
        for (var _i = 0, _a = [v, v - 1, v + 1, v - 2, v + 2]; _i < _a.length; _i++) {
            var k = _a[_i];
            if (((k % 2) !== 0) && ((Math.floor(k / 2) % 2) === 0) && k > 0) {
                return Math.max(k, 3);
            }
        }
        return Math.max(v, 3);
    };
    /**
     * Calculates the value of a Gaussian distribution with sigma 3 at a given point.
     * @param x The point on the Gaussian distribution to sample.
     * @return the value of the Gaussian function at x.
     */
    BlurPostProcess.prototype._gaussianWeight = function (x) {
        //reference: Engines/ImageProcessingBlur.cpp #dcc760
        // We are evaluating the Gaussian (normal) distribution over a kernel parameter space of [-1,1],
        // so we truncate at three standard deviations by setting stddev (sigma) to 1/3.
        // The choice of 3-sigma truncation is common but arbitrary, and means that the signal is
        // truncated at around 1.3% of peak strength.
        //the distribution is scaled to account for the difference between the actual kernel size and the requested kernel size
        var sigma = (1 / 3);
        var denominator = Math.sqrt(2.0 * Math.PI) * sigma;
        var exponent = -((x * x) / (2.0 * sigma * sigma));
        var weight = (1.0 / denominator) * Math.exp(exponent);
        return weight;
    };
    /**
      * Generates a string that can be used as a floating point number in GLSL.
      * @param x Value to print.
      * @param decimalFigures Number of decimal places to print the number to (excluding trailing 0s).
      * @return GLSL float string.
      */
    BlurPostProcess.prototype._glslFloat = function (x, decimalFigures) {
        if (decimalFigures === void 0) { decimalFigures = 8; }
        return x.toFixed(decimalFigures).replace(/0+$/, '');
    };
    /** @hidden */
    BlurPostProcess._Parse = function (parsedPostProcess, targetCamera, scene, rootUrl) {
        return SerializationHelper.Parse(function () {
            return new BlurPostProcess(parsedPostProcess.name, parsedPostProcess.direction, parsedPostProcess.kernel, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable, parsedPostProcess.textureType, undefined, false);
        }, parsedPostProcess, scene, rootUrl);
    };
    __decorate([
        serialize("kernel")
    ], BlurPostProcess.prototype, "_kernel", void 0);
    __decorate([
        serialize("packedFloat")
    ], BlurPostProcess.prototype, "_packedFloat", void 0);
    __decorate([
        serializeAsVector2()
    ], BlurPostProcess.prototype, "direction", void 0);
    return BlurPostProcess;
}(PostProcess));
_TypeStore.RegisteredTypes["BABYLON.BlurPostProcess"] = BlurPostProcess;

var name$7 = 'glowMapGenerationPixelShader';
var shader$7 = "#ifdef DIFFUSE\nvarying vec2 vUVDiffuse;\nuniform sampler2D diffuseSampler;\n#endif\n#ifdef OPACITY\nvarying vec2 vUVOpacity;\nuniform sampler2D opacitySampler;\nuniform float opacityIntensity;\n#endif\n#ifdef EMISSIVE\nvarying vec2 vUVEmissive;\nuniform sampler2D emissiveSampler;\n#endif\n#ifdef VERTEXALPHA\nvarying vec4 vColor;\n#endif\nuniform vec4 glowColor;\nvoid main(void)\n{\nvec4 finalColor=glowColor;\n\n#ifdef DIFFUSE\nvec4 albedoTexture=texture2D(diffuseSampler,vUVDiffuse);\n#ifdef GLOW\n\nfinalColor.a*=albedoTexture.a;\n#endif\n#ifdef HIGHLIGHT\n\nfinalColor.a=albedoTexture.a;\n#endif\n#endif\n#ifdef OPACITY\nvec4 opacityMap=texture2D(opacitySampler,vUVOpacity);\n#ifdef OPACITYRGB\nfinalColor.a*=getLuminance(opacityMap.rgb);\n#else\nfinalColor.a*=opacityMap.a;\n#endif\nfinalColor.a*=opacityIntensity;\n#endif\n#ifdef VERTEXALPHA\nfinalColor.a*=vColor.a;\n#endif\n#ifdef ALPHATEST\nif (finalColor.a<ALPHATESTVALUE)\ndiscard;\n#endif\n#ifdef EMISSIVE\ngl_FragColor=texture2D(emissiveSampler,vUVEmissive)*finalColor;\n#else\ngl_FragColor=finalColor;\n#endif\n#ifdef HIGHLIGHT\n\ngl_FragColor.a=glowColor.a;\n#endif\n}";
Effect.ShadersStore[name$7] = shader$7;

var name$8 = 'glowMapGenerationVertexShader';
var shader$8 = "\nattribute vec3 position;\n#include<bonesDeclaration>\n#include<morphTargetsVertexGlobalDeclaration>\n#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]\n\n#include<instancesDeclaration>\nuniform mat4 viewProjection;\nvarying vec4 vPosition;\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#ifdef DIFFUSE\nvarying vec2 vUVDiffuse;\nuniform mat4 diffuseMatrix;\n#endif\n#ifdef OPACITY\nvarying vec2 vUVOpacity;\nuniform mat4 opacityMatrix;\n#endif\n#ifdef EMISSIVE\nvarying vec2 vUVEmissive;\nuniform mat4 emissiveMatrix;\n#endif\n#ifdef VERTEXALPHA\nattribute vec4 color;\nvarying vec4 vColor;\n#endif\nvoid main(void)\n{\nvec3 positionUpdated=position;\n#ifdef UV1\nvec2 uvUpdated=uv;\n#endif\n#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]\n#include<instancesVertex>\n#include<bonesVertex>\n#ifdef CUBEMAP\nvPosition=finalWorld*vec4(positionUpdated,1.0);\ngl_Position=viewProjection*finalWorld*vec4(position,1.0);\n#else\nvPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);\ngl_Position=vPosition;\n#endif\n#ifdef DIFFUSE\n#ifdef DIFFUSEUV1\nvUVDiffuse=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));\n#endif\n#ifdef DIFFUSEUV2\nvUVDiffuse=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));\n#endif\n#endif\n#ifdef OPACITY\n#ifdef OPACITYUV1\nvUVOpacity=vec2(opacityMatrix*vec4(uvUpdated,1.0,0.0));\n#endif\n#ifdef OPACITYUV2\nvUVOpacity=vec2(opacityMatrix*vec4(uv2,1.0,0.0));\n#endif\n#endif\n#ifdef EMISSIVE\n#ifdef EMISSIVEUV1\nvUVEmissive=vec2(emissiveMatrix*vec4(uvUpdated,1.0,0.0));\n#endif\n#ifdef EMISSIVEUV2\nvUVEmissive=vec2(emissiveMatrix*vec4(uv2,1.0,0.0));\n#endif\n#endif\n#ifdef VERTEXALPHA\nvColor=color;\n#endif\n}";
Effect.ShadersStore[name$8] = shader$8;

/**
 * The effect layer Helps adding post process effect blended with the main pass.
 *
 * This can be for instance use to generate glow or higlight effects on the scene.
 *
 * The effect layer class can not be used directly and is intented to inherited from to be
 * customized per effects.
 */
var EffectLayer = /** @class */ (function () {
    /**
     * Instantiates a new effect Layer and references it in the scene.
     * @param name The name of the layer
     * @param scene The scene to use the layer in
     */
    function EffectLayer(
    /** The Friendly of the effect in the scene */
    name, scene) {
        this._vertexBuffers = {};
        this._maxSize = 0;
        this._mainTextureDesiredSize = { width: 0, height: 0 };
        this._shouldRender = true;
        this._postProcesses = [];
        this._textures = [];
        this._emissiveTextureAndColor = { texture: null, color: new Color4() };
        /**
         * The clear color of the texture used to generate the glow map.
         */
        this.neutralColor = new Color4();
        /**
         * Specifies whether the highlight layer is enabled or not.
         */
        this.isEnabled = true;
        /**
         * Specifies if the bounding boxes should be rendered normally or if they should undergo the effect of the layer
         */
        this.disableBoundingBoxesFromEffectLayer = false;
        /**
         * An event triggered when the effect layer has been disposed.
         */
        this.onDisposeObservable = new Observable();
        /**
         * An event triggered when the effect layer is about rendering the main texture with the glowy parts.
         */
        this.onBeforeRenderMainTextureObservable = new Observable();
        /**
         * An event triggered when the generated texture is being merged in the scene.
         */
        this.onBeforeComposeObservable = new Observable();
        /**
         * An event triggered when the mesh is rendered into the effect render target.
         */
        this.onBeforeRenderMeshToEffect = new Observable();
        /**
         * An event triggered after the mesh has been rendered into the effect render target.
         */
        this.onAfterRenderMeshToEffect = new Observable();
        /**
         * An event triggered when the generated texture has been merged in the scene.
         */
        this.onAfterComposeObservable = new Observable();
        /**
         * An event triggered when the efffect layer changes its size.
         */
        this.onSizeChangedObservable = new Observable();
        this.name = name;
        this._scene = scene || EngineStore.LastCreatedScene;
        EffectLayer._SceneComponentInitialization(this._scene);
        this._engine = this._scene.getEngine();
        this._maxSize = this._engine.getCaps().maxTextureSize;
        this._scene.effectLayers.push(this);
        // Generate Buffers
        this._generateIndexBuffer();
        this._generateVertexBuffer();
    }
    Object.defineProperty(EffectLayer.prototype, "camera", {
        /**
         * Gets the camera attached to the layer.
         */
        get: function () {
            return this._effectLayerOptions.camera;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EffectLayer.prototype, "renderingGroupId", {
        /**
         * Gets the rendering group id the layer should render in.
         */
        get: function () {
            return this._effectLayerOptions.renderingGroupId;
        },
        set: function (renderingGroupId) {
            this._effectLayerOptions.renderingGroupId = renderingGroupId;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initializes the effect layer with the required options.
     * @param options Sets of none mandatory options to use with the layer (see IEffectLayerOptions for more information)
     */
    EffectLayer.prototype._init = function (options) {
        // Adapt options
        this._effectLayerOptions = __assign({ mainTextureRatio: 0.5, alphaBlendingMode: 2, camera: null, renderingGroupId: -1 }, options);
        this._setMainTextureSize();
        this._createMainTexture();
        this._createTextureAndPostProcesses();
        this._mergeEffect = this._createMergeEffect();
    };
    /**
     * Generates the index buffer of the full screen quad blending to the main canvas.
     */
    EffectLayer.prototype._generateIndexBuffer = function () {
        // Indices
        var indices = [];
        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(0);
        indices.push(2);
        indices.push(3);
        this._indexBuffer = this._engine.createIndexBuffer(indices);
    };
    /**
     * Generates the vertex buffer of the full screen quad blending to the main canvas.
     */
    EffectLayer.prototype._generateVertexBuffer = function () {
        // VBO
        var vertices = [];
        vertices.push(1, 1);
        vertices.push(-1, 1);
        vertices.push(-1, -1);
        vertices.push(1, -1);
        var vertexBuffer = new VertexBuffer(this._engine, vertices, VertexBuffer.PositionKind, false, false, 2);
        this._vertexBuffers[VertexBuffer.PositionKind] = vertexBuffer;
    };
    /**
     * Sets the main texture desired size which is the closest power of two
     * of the engine canvas size.
     */
    EffectLayer.prototype._setMainTextureSize = function () {
        if (this._effectLayerOptions.mainTextureFixedSize) {
            this._mainTextureDesiredSize.width = this._effectLayerOptions.mainTextureFixedSize;
            this._mainTextureDesiredSize.height = this._effectLayerOptions.mainTextureFixedSize;
        }
        else {
            this._mainTextureDesiredSize.width = this._engine.getRenderWidth() * this._effectLayerOptions.mainTextureRatio;
            this._mainTextureDesiredSize.height = this._engine.getRenderHeight() * this._effectLayerOptions.mainTextureRatio;
            this._mainTextureDesiredSize.width = this._engine.needPOTTextures ? Engine.GetExponentOfTwo(this._mainTextureDesiredSize.width, this._maxSize) : this._mainTextureDesiredSize.width;
            this._mainTextureDesiredSize.height = this._engine.needPOTTextures ? Engine.GetExponentOfTwo(this._mainTextureDesiredSize.height, this._maxSize) : this._mainTextureDesiredSize.height;
        }
        this._mainTextureDesiredSize.width = Math.floor(this._mainTextureDesiredSize.width);
        this._mainTextureDesiredSize.height = Math.floor(this._mainTextureDesiredSize.height);
    };
    /**
     * Creates the main texture for the effect layer.
     */
    EffectLayer.prototype._createMainTexture = function () {
        var _this = this;
        this._mainTexture = new RenderTargetTexture("HighlightLayerMainRTT", {
            width: this._mainTextureDesiredSize.width,
            height: this._mainTextureDesiredSize.height
        }, this._scene, false, true, 0);
        this._mainTexture.activeCamera = this._effectLayerOptions.camera;
        this._mainTexture.wrapU = Texture.CLAMP_ADDRESSMODE;
        this._mainTexture.wrapV = Texture.CLAMP_ADDRESSMODE;
        this._mainTexture.anisotropicFilteringLevel = 1;
        this._mainTexture.updateSamplingMode(Texture.BILINEAR_SAMPLINGMODE);
        this._mainTexture.renderParticles = false;
        this._mainTexture.renderList = null;
        this._mainTexture.ignoreCameraViewport = true;
        // Custom render function
        this._mainTexture.customRenderFunction = function (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) {
            _this.onBeforeRenderMainTextureObservable.notifyObservers(_this);
            var index;
            var engine = _this._scene.getEngine();
            if (depthOnlySubMeshes.length) {
                engine.setColorWrite(false);
                for (index = 0; index < depthOnlySubMeshes.length; index++) {
                    _this._renderSubMesh(depthOnlySubMeshes.data[index]);
                }
                engine.setColorWrite(true);
            }
            for (index = 0; index < opaqueSubMeshes.length; index++) {
                _this._renderSubMesh(opaqueSubMeshes.data[index]);
            }
            for (index = 0; index < alphaTestSubMeshes.length; index++) {
                _this._renderSubMesh(alphaTestSubMeshes.data[index]);
            }
            var previousAlphaMode = engine.getAlphaMode();
            for (index = 0; index < transparentSubMeshes.length; index++) {
                _this._renderSubMesh(transparentSubMeshes.data[index], true);
            }
            engine.setAlphaMode(previousAlphaMode);
        };
        this._mainTexture.onClearObservable.add(function (engine) {
            engine.clear(_this.neutralColor, true, true, true);
        });
        var boundingBoxRendererEnabled = this._scene.getBoundingBoxRenderer().enabled;
        this._mainTexture.onBeforeBindObservable.add(function () {
            _this._scene.getBoundingBoxRenderer().enabled = !_this.disableBoundingBoxesFromEffectLayer && boundingBoxRendererEnabled;
        });
        this._mainTexture.onAfterUnbindObservable.add(function () {
            _this._scene.getBoundingBoxRenderer().enabled = boundingBoxRendererEnabled;
        });
    };
    /**
     * Adds specific effects defines.
     * @param defines The defines to add specifics to.
     */
    EffectLayer.prototype._addCustomEffectDefines = function (defines) {
        // Nothing to add by default.
    };
    /**
     * Checks for the readiness of the element composing the layer.
     * @param subMesh the mesh to check for
     * @param useInstances specify whether or not to use instances to render the mesh
     * @param emissiveTexture the associated emissive texture used to generate the glow
     * @return true if ready otherwise, false
     */
    EffectLayer.prototype._isReady = function (subMesh, useInstances, emissiveTexture) {
        var material = subMesh.getMaterial();
        if (!material) {
            return false;
        }
        if (!material.isReadyForSubMesh(subMesh.getMesh(), subMesh, useInstances)) {
            return false;
        }
        var defines = [];
        var attribs = [VertexBuffer.PositionKind];
        var mesh = subMesh.getMesh();
        var uv1 = false;
        var uv2 = false;
        // Diffuse
        if (material) {
            var needAlphaTest = material.needAlphaTesting();
            var diffuseTexture = material.getAlphaTestTexture();
            var needAlphaBlendFromDiffuse = diffuseTexture && diffuseTexture.hasAlpha &&
                (material.useAlphaFromDiffuseTexture || material._useAlphaFromAlbedoTexture);
            if (diffuseTexture && (needAlphaTest || needAlphaBlendFromDiffuse)) {
                defines.push("#define DIFFUSE");
                if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind) &&
                    diffuseTexture.coordinatesIndex === 1) {
                    defines.push("#define DIFFUSEUV2");
                    uv2 = true;
                }
                else if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
                    defines.push("#define DIFFUSEUV1");
                    uv1 = true;
                }
                if (needAlphaTest) {
                    defines.push("#define ALPHATEST");
                    defines.push("#define ALPHATESTVALUE 0.4");
                }
            }
            var opacityTexture = material.opacityTexture;
            if (opacityTexture) {
                defines.push("#define OPACITY");
                if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind) &&
                    opacityTexture.coordinatesIndex === 1) {
                    defines.push("#define OPACITYUV2");
                    uv2 = true;
                }
                else if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
                    defines.push("#define OPACITYUV1");
                    uv1 = true;
                }
            }
        }
        // Emissive
        if (emissiveTexture) {
            defines.push("#define EMISSIVE");
            if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind) &&
                emissiveTexture.coordinatesIndex === 1) {
                defines.push("#define EMISSIVEUV2");
                uv2 = true;
            }
            else if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
                defines.push("#define EMISSIVEUV1");
                uv1 = true;
            }
        }
        // Vertex
        if (mesh.isVerticesDataPresent(VertexBuffer.ColorKind) && mesh.hasVertexAlpha) {
            attribs.push(VertexBuffer.ColorKind);
            defines.push("#define VERTEXALPHA");
        }
        if (uv1) {
            attribs.push(VertexBuffer.UVKind);
            defines.push("#define UV1");
        }
        if (uv2) {
            attribs.push(VertexBuffer.UV2Kind);
            defines.push("#define UV2");
        }
        // Bones
        var fallbacks = new EffectFallbacks();
        if (mesh.useBones && mesh.computeBonesUsingShaders) {
            attribs.push(VertexBuffer.MatricesIndicesKind);
            attribs.push(VertexBuffer.MatricesWeightsKind);
            if (mesh.numBoneInfluencers > 4) {
                attribs.push(VertexBuffer.MatricesIndicesExtraKind);
                attribs.push(VertexBuffer.MatricesWeightsExtraKind);
            }
            defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
            var skeleton = mesh.skeleton;
            if (skeleton && skeleton.isUsingTextureForMatrices) {
                defines.push("#define BONETEXTURE");
            }
            else {
                defines.push("#define BonesPerMesh " + (skeleton ? (skeleton.bones.length + 1) : 0));
            }
            if (mesh.numBoneInfluencers > 0) {
                fallbacks.addCPUSkinningFallback(0, mesh);
            }
        }
        else {
            defines.push("#define NUM_BONE_INFLUENCERS 0");
        }
        // Morph targets
        var manager = mesh.morphTargetManager;
        var morphInfluencers = 0;
        if (manager) {
            if (manager.numInfluencers > 0) {
                defines.push("#define MORPHTARGETS");
                morphInfluencers = manager.numInfluencers;
                defines.push("#define NUM_MORPH_INFLUENCERS " + morphInfluencers);
                MaterialHelper.PrepareAttributesForMorphTargetsInfluencers(attribs, mesh, morphInfluencers);
            }
        }
        // Instances
        if (useInstances) {
            defines.push("#define INSTANCES");
            MaterialHelper.PushAttributesForInstances(attribs);
            if (subMesh.getRenderingMesh().hasThinInstances) {
                defines.push("#define THIN_INSTANCES");
            }
        }
        this._addCustomEffectDefines(defines);
        // Get correct effect
        var join = defines.join("\n");
        if (this._cachedDefines !== join) {
            this._cachedDefines = join;
            this._effectLayerMapGenerationEffect = this._scene.getEngine().createEffect("glowMapGeneration", attribs, ["world", "mBones", "viewProjection",
                "glowColor", "morphTargetInfluences", "boneTextureWidth",
                "diffuseMatrix", "emissiveMatrix", "opacityMatrix", "opacityIntensity"], ["diffuseSampler", "emissiveSampler", "opacitySampler", "boneSampler"], join, fallbacks, undefined, undefined, { maxSimultaneousMorphTargets: morphInfluencers });
        }
        return this._effectLayerMapGenerationEffect.isReady();
    };
    /**
     * Renders the glowing part of the scene by blending the blurred glowing meshes on top of the rendered scene.
     */
    EffectLayer.prototype.render = function () {
        var currentEffect = this._mergeEffect;
        // Check
        if (!currentEffect.isReady()) {
            return;
        }
        for (var i = 0; i < this._postProcesses.length; i++) {
            if (!this._postProcesses[i].isReady()) {
                return;
            }
        }
        var engine = this._scene.getEngine();
        this.onBeforeComposeObservable.notifyObservers(this);
        // Render
        engine.enableEffect(currentEffect);
        engine.setState(false);
        // VBOs
        engine.bindBuffers(this._vertexBuffers, this._indexBuffer, currentEffect);
        // Cache
        var previousAlphaMode = engine.getAlphaMode();
        // Go Blend.
        engine.setAlphaMode(this._effectLayerOptions.alphaBlendingMode);
        // Blends the map on the main canvas.
        this._internalRender(currentEffect);
        // Restore Alpha
        engine.setAlphaMode(previousAlphaMode);
        this.onAfterComposeObservable.notifyObservers(this);
        // Handle size changes.
        var size = this._mainTexture.getSize();
        this._setMainTextureSize();
        if (size.width !== this._mainTextureDesiredSize.width || size.height !== this._mainTextureDesiredSize.height) {
            // Recreate RTT and post processes on size change.
            this.onSizeChangedObservable.notifyObservers(this);
            this._disposeTextureAndPostProcesses();
            this._createMainTexture();
            this._createTextureAndPostProcesses();
        }
    };
    /**
     * Determine if a given mesh will be used in the current effect.
     * @param mesh mesh to test
     * @returns true if the mesh will be used
     */
    EffectLayer.prototype.hasMesh = function (mesh) {
        if (this.renderingGroupId === -1 || mesh.renderingGroupId === this.renderingGroupId) {
            return true;
        }
        return false;
    };
    /**
     * Returns true if the layer contains information to display, otherwise false.
     * @returns true if the glow layer should be rendered
     */
    EffectLayer.prototype.shouldRender = function () {
        return this.isEnabled && this._shouldRender;
    };
    /**
     * Returns true if the mesh should render, otherwise false.
     * @param mesh The mesh to render
     * @returns true if it should render otherwise false
     */
    EffectLayer.prototype._shouldRenderMesh = function (mesh) {
        return true;
    };
    /**
     * Returns true if the mesh can be rendered, otherwise false.
     * @param mesh The mesh to render
     * @param material The material used on the mesh
     * @returns true if it can be rendered otherwise false
     */
    EffectLayer.prototype._canRenderMesh = function (mesh, material) {
        return !material.needAlphaBlendingForMesh(mesh);
    };
    /**
     * Returns true if the mesh should render, otherwise false.
     * @param mesh The mesh to render
     * @returns true if it should render otherwise false
     */
    EffectLayer.prototype._shouldRenderEmissiveTextureForMesh = function () {
        return true;
    };
    /**
     * Renders the submesh passed in parameter to the generation map.
     */
    EffectLayer.prototype._renderSubMesh = function (subMesh, enableAlphaMode) {
        var _this = this;
        var _a;
        if (enableAlphaMode === void 0) { enableAlphaMode = false; }
        if (!this.shouldRender()) {
            return;
        }
        var material = subMesh.getMaterial();
        var ownerMesh = subMesh.getMesh();
        var replacementMesh = subMesh.getReplacementMesh();
        var renderingMesh = subMesh.getRenderingMesh();
        var effectiveMesh = subMesh.getEffectiveMesh();
        var scene = this._scene;
        var engine = scene.getEngine();
        effectiveMesh._internalAbstractMeshDataInfo._isActiveIntermediate = false;
        if (!material) {
            return;
        }
        // Do not block in blend mode.
        if (!this._canRenderMesh(renderingMesh, material)) {
            return;
        }
        // Culling
        var sideOrientation = (_a = renderingMesh.overrideMaterialSideOrientation) !== null && _a !== void 0 ? _a : material.sideOrientation;
        var mainDeterminant = renderingMesh._getWorldMatrixDeterminant();
        if (mainDeterminant < 0) {
            sideOrientation = (sideOrientation === Material.ClockWiseSideOrientation ? Material.CounterClockWiseSideOrientation : Material.ClockWiseSideOrientation);
        }
        var reverse = sideOrientation === Material.ClockWiseSideOrientation;
        engine.setState(material.backFaceCulling, material.zOffset, undefined, reverse);
        // Managing instances
        var batch = renderingMesh._getInstancesRenderList(subMesh._id, !!replacementMesh);
        if (batch.mustReturn) {
            return;
        }
        // Early Exit per mesh
        if (!this._shouldRenderMesh(renderingMesh)) {
            return;
        }
        var hardwareInstancedRendering = batch.hardwareInstancedRendering[subMesh._id] || renderingMesh.hasThinInstances;
        this._setEmissiveTextureAndColor(renderingMesh, subMesh, material);
        this.onBeforeRenderMeshToEffect.notifyObservers(ownerMesh);
        if (this._useMeshMaterial(renderingMesh)) {
            renderingMesh.render(subMesh, hardwareInstancedRendering, replacementMesh || undefined);
        }
        else if (this._isReady(subMesh, hardwareInstancedRendering, this._emissiveTextureAndColor.texture)) {
            engine.enableEffect(this._effectLayerMapGenerationEffect);
            renderingMesh._bind(subMesh, this._effectLayerMapGenerationEffect, Material.TriangleFillMode);
            this._effectLayerMapGenerationEffect.setMatrix("viewProjection", scene.getTransformMatrix());
            this._effectLayerMapGenerationEffect.setMatrix("world", effectiveMesh.getWorldMatrix());
            this._effectLayerMapGenerationEffect.setFloat4("glowColor", this._emissiveTextureAndColor.color.r, this._emissiveTextureAndColor.color.g, this._emissiveTextureAndColor.color.b, this._emissiveTextureAndColor.color.a);
            var needAlphaTest = material.needAlphaTesting();
            var diffuseTexture = material.getAlphaTestTexture();
            var needAlphaBlendFromDiffuse = diffuseTexture && diffuseTexture.hasAlpha &&
                (material.useAlphaFromDiffuseTexture || material._useAlphaFromAlbedoTexture);
            if (diffuseTexture && (needAlphaTest || needAlphaBlendFromDiffuse)) {
                this._effectLayerMapGenerationEffect.setTexture("diffuseSampler", diffuseTexture);
                var textureMatrix = diffuseTexture.getTextureMatrix();
                if (textureMatrix) {
                    this._effectLayerMapGenerationEffect.setMatrix("diffuseMatrix", textureMatrix);
                }
            }
            var opacityTexture = material.opacityTexture;
            if (opacityTexture) {
                this._effectLayerMapGenerationEffect.setTexture("opacitySampler", opacityTexture);
                this._effectLayerMapGenerationEffect.setFloat("opacityIntensity", opacityTexture.level);
                var textureMatrix = opacityTexture.getTextureMatrix();
                if (textureMatrix) {
                    this._effectLayerMapGenerationEffect.setMatrix("opacityMatrix", textureMatrix);
                }
            }
            // Glow emissive only
            if (this._emissiveTextureAndColor.texture) {
                this._effectLayerMapGenerationEffect.setTexture("emissiveSampler", this._emissiveTextureAndColor.texture);
                this._effectLayerMapGenerationEffect.setMatrix("emissiveMatrix", this._emissiveTextureAndColor.texture.getTextureMatrix());
            }
            // Bones
            if (renderingMesh.useBones && renderingMesh.computeBonesUsingShaders && renderingMesh.skeleton) {
                var skeleton = renderingMesh.skeleton;
                if (skeleton.isUsingTextureForMatrices) {
                    var boneTexture = skeleton.getTransformMatrixTexture(renderingMesh);
                    if (!boneTexture) {
                        return;
                    }
                    this._effectLayerMapGenerationEffect.setTexture("boneSampler", boneTexture);
                    this._effectLayerMapGenerationEffect.setFloat("boneTextureWidth", 4.0 * (skeleton.bones.length + 1));
                }
                else {
                    this._effectLayerMapGenerationEffect.setMatrices("mBones", skeleton.getTransformMatrices((renderingMesh)));
                }
            }
            // Morph targets
            MaterialHelper.BindMorphTargetParameters(renderingMesh, this._effectLayerMapGenerationEffect);
            // Alpha mode
            if (enableAlphaMode) {
                engine.setAlphaMode(material.alphaMode);
            }
            // Draw
            renderingMesh._processRendering(effectiveMesh, subMesh, this._effectLayerMapGenerationEffect, material.fillMode, batch, hardwareInstancedRendering, function (isInstance, world) { return _this._effectLayerMapGenerationEffect.setMatrix("world", world); });
        }
        else {
            // Need to reset refresh rate of the main map
            this._mainTexture.resetRefreshCounter();
        }
        this.onAfterRenderMeshToEffect.notifyObservers(ownerMesh);
    };
    /**
     * Defines whether the current material of the mesh should be use to render the effect.
     * @param mesh defines the current mesh to render
     */
    EffectLayer.prototype._useMeshMaterial = function (mesh) {
        return false;
    };
    /**
     * Rebuild the required buffers.
     * @hidden Internal use only.
     */
    EffectLayer.prototype._rebuild = function () {
        var vb = this._vertexBuffers[VertexBuffer.PositionKind];
        if (vb) {
            vb._rebuild();
        }
        this._generateIndexBuffer();
    };
    /**
     * Dispose only the render target textures and post process.
     */
    EffectLayer.prototype._disposeTextureAndPostProcesses = function () {
        this._mainTexture.dispose();
        for (var i = 0; i < this._postProcesses.length; i++) {
            if (this._postProcesses[i]) {
                this._postProcesses[i].dispose();
            }
        }
        this._postProcesses = [];
        for (var i = 0; i < this._textures.length; i++) {
            if (this._textures[i]) {
                this._textures[i].dispose();
            }
        }
        this._textures = [];
    };
    /**
     * Dispose the highlight layer and free resources.
     */
    EffectLayer.prototype.dispose = function () {
        var vertexBuffer = this._vertexBuffers[VertexBuffer.PositionKind];
        if (vertexBuffer) {
            vertexBuffer.dispose();
            this._vertexBuffers[VertexBuffer.PositionKind] = null;
        }
        if (this._indexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
        // Clean textures and post processes
        this._disposeTextureAndPostProcesses();
        // Remove from scene
        var index = this._scene.effectLayers.indexOf(this, 0);
        if (index > -1) {
            this._scene.effectLayers.splice(index, 1);
        }
        // Callback
        this.onDisposeObservable.notifyObservers(this);
        this.onDisposeObservable.clear();
        this.onBeforeRenderMainTextureObservable.clear();
        this.onBeforeComposeObservable.clear();
        this.onBeforeRenderMeshToEffect.clear();
        this.onAfterRenderMeshToEffect.clear();
        this.onAfterComposeObservable.clear();
        this.onSizeChangedObservable.clear();
    };
    /**
      * Gets the class name of the effect layer
      * @returns the string with the class name of the effect layer
      */
    EffectLayer.prototype.getClassName = function () {
        return "EffectLayer";
    };
    /**
     * Creates an effect layer from parsed effect layer data
     * @param parsedEffectLayer defines effect layer data
     * @param scene defines the current scene
     * @param rootUrl defines the root URL containing the effect layer information
     * @returns a parsed effect Layer
     */
    EffectLayer.Parse = function (parsedEffectLayer, scene, rootUrl) {
        var effectLayerType = Tools.Instantiate(parsedEffectLayer.customType);
        return effectLayerType.Parse(parsedEffectLayer, scene, rootUrl);
    };
    /** @hidden */
    EffectLayer._SceneComponentInitialization = function (_) {
        throw _DevTools.WarnImport("EffectLayerSceneComponent");
    };
    __decorate([
        serialize()
    ], EffectLayer.prototype, "name", void 0);
    __decorate([
        serializeAsColor4()
    ], EffectLayer.prototype, "neutralColor", void 0);
    __decorate([
        serialize()
    ], EffectLayer.prototype, "isEnabled", void 0);
    __decorate([
        serializeAsCameraReference()
    ], EffectLayer.prototype, "camera", null);
    __decorate([
        serialize()
    ], EffectLayer.prototype, "renderingGroupId", null);
    __decorate([
        serialize()
    ], EffectLayer.prototype, "disableBoundingBoxesFromEffectLayer", void 0);
    return EffectLayer;
}());

var name$9 = 'glowMapMergePixelShader';
var shader$9 = "\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n#ifdef EMISSIVE\nuniform sampler2D textureSampler2;\n#endif\n\nuniform float offset;\nvoid main(void) {\nvec4 baseColor=texture2D(textureSampler,vUV);\n#ifdef EMISSIVE\nbaseColor+=texture2D(textureSampler2,vUV);\nbaseColor*=offset;\n#else\nbaseColor.a=abs(offset-baseColor.a);\n#ifdef STROKE\nfloat alpha=smoothstep(.0,.1,baseColor.a);\nbaseColor.a=alpha;\nbaseColor.rgb=baseColor.rgb*alpha;\n#endif\n#endif\ngl_FragColor=baseColor;\n}";
Effect.ShadersStore[name$9] = shader$9;

var name$a = 'glowMapMergeVertexShader';
var shader$a = "\nattribute vec2 position;\n\nvarying vec2 vUV;\nconst vec2 madd=vec2(0.5,0.5);\nvoid main(void) {\nvUV=position*madd+madd;\ngl_Position=vec4(position,0.0,1.0);\n}";
Effect.ShadersStore[name$a] = shader$a;

// Adds the parser to the scene parsers.
AbstractScene.AddParser(SceneComponentConstants.NAME_EFFECTLAYER, function (parsedData, scene, container, rootUrl) {
    if (parsedData.effectLayers) {
        if (!container.effectLayers) {
            container.effectLayers = new Array();
        }
        for (var index = 0; index < parsedData.effectLayers.length; index++) {
            var effectLayer = EffectLayer.Parse(parsedData.effectLayers[index], scene, rootUrl);
            container.effectLayers.push(effectLayer);
        }
    }
});
AbstractScene.prototype.removeEffectLayer = function (toRemove) {
    var index = this.effectLayers.indexOf(toRemove);
    if (index !== -1) {
        this.effectLayers.splice(index, 1);
    }
    return index;
};
AbstractScene.prototype.addEffectLayer = function (newEffectLayer) {
    this.effectLayers.push(newEffectLayer);
};
/**
 * Defines the layer scene component responsible to manage any effect layers
 * in a given scene.
 */
var EffectLayerSceneComponent = /** @class */ (function () {
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    function EffectLayerSceneComponent(scene) {
        /**
         * The component name helpfull to identify the component in the list of scene components.
         */
        this.name = SceneComponentConstants.NAME_EFFECTLAYER;
        this._renderEffects = false;
        this._needStencil = false;
        this._previousStencilState = false;
        this.scene = scene;
        this._engine = scene.getEngine();
        scene.effectLayers = new Array();
    }
    /**
     * Registers the component in a given scene
     */
    EffectLayerSceneComponent.prototype.register = function () {
        this.scene._isReadyForMeshStage.registerStep(SceneComponentConstants.STEP_ISREADYFORMESH_EFFECTLAYER, this, this._isReadyForMesh);
        this.scene._cameraDrawRenderTargetStage.registerStep(SceneComponentConstants.STEP_CAMERADRAWRENDERTARGET_EFFECTLAYER, this, this._renderMainTexture);
        this.scene._beforeCameraDrawStage.registerStep(SceneComponentConstants.STEP_BEFORECAMERADRAW_EFFECTLAYER, this, this._setStencil);
        this.scene._afterRenderingGroupDrawStage.registerStep(SceneComponentConstants.STEP_AFTERRENDERINGGROUPDRAW_EFFECTLAYER_DRAW, this, this._drawRenderingGroup);
        this.scene._afterCameraDrawStage.registerStep(SceneComponentConstants.STEP_AFTERCAMERADRAW_EFFECTLAYER, this, this._setStencilBack);
        this.scene._afterCameraDrawStage.registerStep(SceneComponentConstants.STEP_AFTERCAMERADRAW_EFFECTLAYER_DRAW, this, this._drawCamera);
    };
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    EffectLayerSceneComponent.prototype.rebuild = function () {
        var layers = this.scene.effectLayers;
        for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
            var effectLayer = layers_1[_i];
            effectLayer._rebuild();
        }
    };
    /**
     * Serializes the component data to the specified json object
     * @param serializationObject The object to serialize to
     */
    EffectLayerSceneComponent.prototype.serialize = function (serializationObject) {
        // Effect layers
        serializationObject.effectLayers = [];
        var layers = this.scene.effectLayers;
        for (var _i = 0, layers_2 = layers; _i < layers_2.length; _i++) {
            var effectLayer = layers_2[_i];
            if (effectLayer.serialize) {
                serializationObject.effectLayers.push(effectLayer.serialize());
            }
        }
    };
    /**
     * Adds all the elements from the container to the scene
     * @param container the container holding the elements
     */
    EffectLayerSceneComponent.prototype.addFromContainer = function (container) {
        var _this = this;
        if (!container.effectLayers) {
            return;
        }
        container.effectLayers.forEach(function (o) {
            _this.scene.addEffectLayer(o);
        });
    };
    /**
     * Removes all the elements in the container from the scene
     * @param container contains the elements to remove
     * @param dispose if the removed element should be disposed (default: false)
     */
    EffectLayerSceneComponent.prototype.removeFromContainer = function (container, dispose) {
        var _this = this;
        if (!container.effectLayers) {
            return;
        }
        container.effectLayers.forEach(function (o) {
            _this.scene.removeEffectLayer(o);
            if (dispose) {
                o.dispose();
            }
        });
    };
    /**
     * Disposes the component and the associated ressources.
     */
    EffectLayerSceneComponent.prototype.dispose = function () {
        var layers = this.scene.effectLayers;
        while (layers.length) {
            layers[0].dispose();
        }
    };
    EffectLayerSceneComponent.prototype._isReadyForMesh = function (mesh, hardwareInstancedRendering) {
        var layers = this.scene.effectLayers;
        for (var _i = 0, layers_3 = layers; _i < layers_3.length; _i++) {
            var layer = layers_3[_i];
            if (!layer.hasMesh(mesh)) {
                continue;
            }
            for (var _a = 0, _b = mesh.subMeshes; _a < _b.length; _a++) {
                var subMesh = _b[_a];
                if (!layer.isReady(subMesh, hardwareInstancedRendering)) {
                    return false;
                }
            }
        }
        return true;
    };
    EffectLayerSceneComponent.prototype._renderMainTexture = function (camera) {
        this._renderEffects = false;
        this._needStencil = false;
        var needRebind = false;
        var layers = this.scene.effectLayers;
        if (layers && layers.length > 0) {
            this._previousStencilState = this._engine.getStencilBuffer();
            for (var _i = 0, layers_4 = layers; _i < layers_4.length; _i++) {
                var effectLayer = layers_4[_i];
                if (effectLayer.shouldRender() &&
                    (!effectLayer.camera ||
                        (effectLayer.camera.cameraRigMode === Camera.RIG_MODE_NONE && camera === effectLayer.camera) ||
                        (effectLayer.camera.cameraRigMode !== Camera.RIG_MODE_NONE && effectLayer.camera._rigCameras.indexOf(camera) > -1))) {
                    this._renderEffects = true;
                    this._needStencil = this._needStencil || effectLayer.needStencil();
                    var renderTarget = effectLayer._mainTexture;
                    if (renderTarget._shouldRender()) {
                        this.scene.incrementRenderId();
                        renderTarget.render(false, false);
                        needRebind = true;
                    }
                }
            }
            this.scene.incrementRenderId();
        }
        return needRebind;
    };
    EffectLayerSceneComponent.prototype._setStencil = function () {
        // Activate effect Layer stencil
        if (this._needStencil) {
            this._engine.setStencilBuffer(true);
        }
    };
    EffectLayerSceneComponent.prototype._setStencilBack = function () {
        // Restore effect Layer stencil
        if (this._needStencil) {
            this._engine.setStencilBuffer(this._previousStencilState);
        }
    };
    EffectLayerSceneComponent.prototype._draw = function (renderingGroupId) {
        if (this._renderEffects) {
            this._engine.setDepthBuffer(false);
            var layers = this.scene.effectLayers;
            for (var i = 0; i < layers.length; i++) {
                var effectLayer = layers[i];
                if (effectLayer.renderingGroupId === renderingGroupId) {
                    if (effectLayer.shouldRender()) {
                        effectLayer.render();
                    }
                }
            }
            this._engine.setDepthBuffer(true);
        }
    };
    EffectLayerSceneComponent.prototype._drawCamera = function () {
        if (this._renderEffects) {
            this._draw(-1);
        }
    };
    EffectLayerSceneComponent.prototype._drawRenderingGroup = function (index) {
        if (!this.scene._isInIntermediateRendering() && this._renderEffects) {
            this._draw(index);
        }
    };
    return EffectLayerSceneComponent;
}());
EffectLayer._SceneComponentInitialization = function (scene) {
    var component = scene._getComponent(SceneComponentConstants.NAME_EFFECTLAYER);
    if (!component) {
        component = new EffectLayerSceneComponent(scene);
        scene._addComponent(component);
    }
};

AbstractScene.prototype.getGlowLayerByName = function (name) {
    for (var index = 0; index < this.effectLayers.length; index++) {
        if (this.effectLayers[index].name === name && this.effectLayers[index].getEffectName() === GlowLayer.EffectName) {
            return this.effectLayers[index];
        }
    }
    return null;
};
/**
 * The glow layer Helps adding a glow effect around the emissive parts of a mesh.
 *
 * Once instantiated in a scene, by default, all the emissive meshes will glow.
 *
 * Documentation: https://doc.babylonjs.com/how_to/glow_layer
 */
var GlowLayer = /** @class */ (function (_super) {
    __extends(GlowLayer, _super);
    /**
     * Instantiates a new glow Layer and references it to the scene.
     * @param name The name of the layer
     * @param scene The scene to use the layer in
     * @param options Sets of none mandatory options to use with the layer (see IGlowLayerOptions for more information)
     */
    function GlowLayer(name, scene, options) {
        var _this = _super.call(this, name, scene) || this;
        _this._intensity = 1.0;
        _this._includedOnlyMeshes = [];
        _this._excludedMeshes = [];
        _this._meshesUsingTheirOwnMaterials = [];
        _this.neutralColor = new Color4(0, 0, 0, 1);
        // Adapt options
        _this._options = __assign({ mainTextureRatio: GlowLayer.DefaultTextureRatio, blurKernelSize: 32, mainTextureFixedSize: undefined, camera: null, mainTextureSamples: 1, renderingGroupId: -1 }, options);
        // Initialize the layer
        _this._init({
            alphaBlendingMode: 1,
            camera: _this._options.camera,
            mainTextureFixedSize: _this._options.mainTextureFixedSize,
            mainTextureRatio: _this._options.mainTextureRatio,
            renderingGroupId: _this._options.renderingGroupId
        });
        return _this;
    }
    Object.defineProperty(GlowLayer.prototype, "blurKernelSize", {
        /**
         * Gets the kernel size of the blur.
         */
        get: function () {
            return this._horizontalBlurPostprocess1.kernel;
        },
        /**
         * Sets the kernel size of the blur.
         */
        set: function (value) {
            this._horizontalBlurPostprocess1.kernel = value;
            this._verticalBlurPostprocess1.kernel = value;
            this._horizontalBlurPostprocess2.kernel = value;
            this._verticalBlurPostprocess2.kernel = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlowLayer.prototype, "intensity", {
        /**
         * Gets the glow intensity.
         */
        get: function () {
            return this._intensity;
        },
        /**
         * Sets the glow intensity.
         */
        set: function (value) {
            this._intensity = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the effect name of the layer.
     * @return The effect name
     */
    GlowLayer.prototype.getEffectName = function () {
        return GlowLayer.EffectName;
    };
    /**
     * Create the merge effect. This is the shader use to blit the information back
     * to the main canvas at the end of the scene rendering.
     */
    GlowLayer.prototype._createMergeEffect = function () {
        // Effect
        return this._engine.createEffect("glowMapMerge", [VertexBuffer.PositionKind], ["offset"], ["textureSampler", "textureSampler2"], "#define EMISSIVE \n");
    };
    /**
     * Creates the render target textures and post processes used in the glow layer.
     */
    GlowLayer.prototype._createTextureAndPostProcesses = function () {
        var _this = this;
        var blurTextureWidth = this._mainTextureDesiredSize.width;
        var blurTextureHeight = this._mainTextureDesiredSize.height;
        blurTextureWidth = this._engine.needPOTTextures ? Engine.GetExponentOfTwo(blurTextureWidth, this._maxSize) : blurTextureWidth;
        blurTextureHeight = this._engine.needPOTTextures ? Engine.GetExponentOfTwo(blurTextureHeight, this._maxSize) : blurTextureHeight;
        var textureType = 0;
        if (this._engine.getCaps().textureHalfFloatRender) {
            textureType = 2;
        }
        else {
            textureType = 0;
        }
        this._blurTexture1 = new RenderTargetTexture("GlowLayerBlurRTT", {
            width: blurTextureWidth,
            height: blurTextureHeight
        }, this._scene, false, true, textureType);
        this._blurTexture1.wrapU = Texture.CLAMP_ADDRESSMODE;
        this._blurTexture1.wrapV = Texture.CLAMP_ADDRESSMODE;
        this._blurTexture1.updateSamplingMode(Texture.BILINEAR_SAMPLINGMODE);
        this._blurTexture1.renderParticles = false;
        this._blurTexture1.ignoreCameraViewport = true;
        var blurTextureWidth2 = Math.floor(blurTextureWidth / 2);
        var blurTextureHeight2 = Math.floor(blurTextureHeight / 2);
        this._blurTexture2 = new RenderTargetTexture("GlowLayerBlurRTT2", {
            width: blurTextureWidth2,
            height: blurTextureHeight2
        }, this._scene, false, true, textureType);
        this._blurTexture2.wrapU = Texture.CLAMP_ADDRESSMODE;
        this._blurTexture2.wrapV = Texture.CLAMP_ADDRESSMODE;
        this._blurTexture2.updateSamplingMode(Texture.BILINEAR_SAMPLINGMODE);
        this._blurTexture2.renderParticles = false;
        this._blurTexture2.ignoreCameraViewport = true;
        this._textures = [this._blurTexture1, this._blurTexture2];
        this._horizontalBlurPostprocess1 = new BlurPostProcess("GlowLayerHBP1", new Vector2(1.0, 0), this._options.blurKernelSize / 2, {
            width: blurTextureWidth,
            height: blurTextureHeight
        }, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, textureType);
        this._horizontalBlurPostprocess1.width = blurTextureWidth;
        this._horizontalBlurPostprocess1.height = blurTextureHeight;
        this._horizontalBlurPostprocess1.onApplyObservable.add(function (effect) {
            effect.setTexture("textureSampler", _this._mainTexture);
        });
        this._verticalBlurPostprocess1 = new BlurPostProcess("GlowLayerVBP1", new Vector2(0, 1.0), this._options.blurKernelSize / 2, {
            width: blurTextureWidth,
            height: blurTextureHeight
        }, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, textureType);
        this._horizontalBlurPostprocess2 = new BlurPostProcess("GlowLayerHBP2", new Vector2(1.0, 0), this._options.blurKernelSize / 2, {
            width: blurTextureWidth2,
            height: blurTextureHeight2
        }, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, textureType);
        this._horizontalBlurPostprocess2.width = blurTextureWidth2;
        this._horizontalBlurPostprocess2.height = blurTextureHeight2;
        this._horizontalBlurPostprocess2.onApplyObservable.add(function (effect) {
            effect.setTexture("textureSampler", _this._blurTexture1);
        });
        this._verticalBlurPostprocess2 = new BlurPostProcess("GlowLayerVBP2", new Vector2(0, 1.0), this._options.blurKernelSize / 2, {
            width: blurTextureWidth2,
            height: blurTextureHeight2
        }, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, textureType);
        this._postProcesses = [this._horizontalBlurPostprocess1, this._verticalBlurPostprocess1, this._horizontalBlurPostprocess2, this._verticalBlurPostprocess2];
        this._postProcesses1 = [this._horizontalBlurPostprocess1, this._verticalBlurPostprocess1];
        this._postProcesses2 = [this._horizontalBlurPostprocess2, this._verticalBlurPostprocess2];
        this._mainTexture.samples = this._options.mainTextureSamples;
        this._mainTexture.onAfterUnbindObservable.add(function () {
            var internalTexture = _this._blurTexture1.getInternalTexture();
            if (internalTexture) {
                _this._scene.postProcessManager.directRender(_this._postProcesses1, internalTexture, true);
                var internalTexture2 = _this._blurTexture2.getInternalTexture();
                if (internalTexture2) {
                    _this._scene.postProcessManager.directRender(_this._postProcesses2, internalTexture2, true);
                }
                _this._engine.unBindFramebuffer(internalTexture2 !== null && internalTexture2 !== void 0 ? internalTexture2 : internalTexture, true);
            }
        });
        // Prevent autoClear.
        this._postProcesses.map(function (pp) { pp.autoClear = false; });
    };
    /**
     * Checks for the readiness of the element composing the layer.
     * @param subMesh the mesh to check for
     * @param useInstances specify wether or not to use instances to render the mesh
     * @param emissiveTexture the associated emissive texture used to generate the glow
     * @return true if ready otherwise, false
     */
    GlowLayer.prototype.isReady = function (subMesh, useInstances) {
        var material = subMesh.getMaterial();
        var mesh = subMesh.getRenderingMesh();
        if (!material || !mesh) {
            return false;
        }
        var emissiveTexture = material.emissiveTexture;
        return _super.prototype._isReady.call(this, subMesh, useInstances, emissiveTexture);
    };
    /**
     * Returns whether or nood the layer needs stencil enabled during the mesh rendering.
     */
    GlowLayer.prototype.needStencil = function () {
        return false;
    };
    /**
     * Returns true if the mesh can be rendered, otherwise false.
     * @param mesh The mesh to render
     * @param material The material used on the mesh
     * @returns true if it can be rendered otherwise false
     */
    GlowLayer.prototype._canRenderMesh = function (mesh, material) {
        return true;
    };
    /**
     * Implementation specific of rendering the generating effect on the main canvas.
     * @param effect The effect used to render through
     */
    GlowLayer.prototype._internalRender = function (effect) {
        // Texture
        effect.setTexture("textureSampler", this._blurTexture1);
        effect.setTexture("textureSampler2", this._blurTexture2);
        effect.setFloat("offset", this._intensity);
        // Cache
        var engine = this._engine;
        var previousStencilBuffer = engine.getStencilBuffer();
        // Draw order
        engine.setStencilBuffer(false);
        engine.drawElementsType(Material.TriangleFillMode, 0, 6);
        // Draw order
        engine.setStencilBuffer(previousStencilBuffer);
    };
    /**
     * Sets the required values for both the emissive texture and and the main color.
     */
    GlowLayer.prototype._setEmissiveTextureAndColor = function (mesh, subMesh, material) {
        var textureLevel = 1.0;
        if (this.customEmissiveTextureSelector) {
            this._emissiveTextureAndColor.texture = this.customEmissiveTextureSelector(mesh, subMesh, material);
        }
        else {
            if (material) {
                this._emissiveTextureAndColor.texture = material.emissiveTexture;
                if (this._emissiveTextureAndColor.texture) {
                    textureLevel = this._emissiveTextureAndColor.texture.level;
                }
            }
            else {
                this._emissiveTextureAndColor.texture = null;
            }
        }
        if (this.customEmissiveColorSelector) {
            this.customEmissiveColorSelector(mesh, subMesh, material, this._emissiveTextureAndColor.color);
        }
        else {
            if (material.emissiveColor) {
                this._emissiveTextureAndColor.color.set(material.emissiveColor.r * textureLevel, material.emissiveColor.g * textureLevel, material.emissiveColor.b * textureLevel, material.alpha);
            }
            else {
                this._emissiveTextureAndColor.color.set(this.neutralColor.r, this.neutralColor.g, this.neutralColor.b, this.neutralColor.a);
            }
        }
    };
    /**
     * Returns true if the mesh should render, otherwise false.
     * @param mesh The mesh to render
     * @returns true if it should render otherwise false
     */
    GlowLayer.prototype._shouldRenderMesh = function (mesh) {
        return this.hasMesh(mesh);
    };
    /**
     * Adds specific effects defines.
     * @param defines The defines to add specifics to.
     */
    GlowLayer.prototype._addCustomEffectDefines = function (defines) {
        defines.push("#define GLOW");
    };
    /**
     * Add a mesh in the exclusion list to prevent it to impact or being impacted by the glow layer.
     * @param mesh The mesh to exclude from the glow layer
     */
    GlowLayer.prototype.addExcludedMesh = function (mesh) {
        if (this._excludedMeshes.indexOf(mesh.uniqueId) === -1) {
            this._excludedMeshes.push(mesh.uniqueId);
        }
    };
    /**
      * Remove a mesh from the exclusion list to let it impact or being impacted by the glow layer.
      * @param mesh The mesh to remove
      */
    GlowLayer.prototype.removeExcludedMesh = function (mesh) {
        var index = this._excludedMeshes.indexOf(mesh.uniqueId);
        if (index !== -1) {
            this._excludedMeshes.splice(index, 1);
        }
    };
    /**
     * Add a mesh in the inclusion list to impact or being impacted by the glow layer.
     * @param mesh The mesh to include in the glow layer
     */
    GlowLayer.prototype.addIncludedOnlyMesh = function (mesh) {
        if (this._includedOnlyMeshes.indexOf(mesh.uniqueId) === -1) {
            this._includedOnlyMeshes.push(mesh.uniqueId);
        }
    };
    /**
      * Remove a mesh from the Inclusion list to prevent it to impact or being impacted by the glow layer.
      * @param mesh The mesh to remove
      */
    GlowLayer.prototype.removeIncludedOnlyMesh = function (mesh) {
        var index = this._includedOnlyMeshes.indexOf(mesh.uniqueId);
        if (index !== -1) {
            this._includedOnlyMeshes.splice(index, 1);
        }
    };
    /**
     * Determine if a given mesh will be used in the glow layer
     * @param mesh The mesh to test
     * @returns true if the mesh will be highlighted by the current glow layer
     */
    GlowLayer.prototype.hasMesh = function (mesh) {
        if (!_super.prototype.hasMesh.call(this, mesh)) {
            return false;
        }
        // Included Mesh
        if (this._includedOnlyMeshes.length) {
            return this._includedOnlyMeshes.indexOf(mesh.uniqueId) !== -1;
        }
        // Excluded Mesh
        if (this._excludedMeshes.length) {
            return this._excludedMeshes.indexOf(mesh.uniqueId) === -1;
        }
        return true;
    };
    /**
     * Defines whether the current material of the mesh should be use to render the effect.
     * @param mesh defines the current mesh to render
     */
    GlowLayer.prototype._useMeshMaterial = function (mesh) {
        if (this._meshesUsingTheirOwnMaterials.length == 0) {
            return false;
        }
        return this._meshesUsingTheirOwnMaterials.indexOf(mesh.uniqueId) > -1;
    };
    /**
     * Add a mesh to be rendered through its own material and not with emissive only.
     * @param mesh The mesh for which we need to use its material
     */
    GlowLayer.prototype.referenceMeshToUseItsOwnMaterial = function (mesh) {
        this._meshesUsingTheirOwnMaterials.push(mesh.uniqueId);
    };
    /**
     * Remove a mesh from being rendered through its own material and not with emissive only.
     * @param mesh The mesh for which we need to not use its material
     */
    GlowLayer.prototype.unReferenceMeshFromUsingItsOwnMaterial = function (mesh) {
        var index = this._meshesUsingTheirOwnMaterials.indexOf(mesh.uniqueId);
        while (index >= 0) {
            this._meshesUsingTheirOwnMaterials.splice(index, 1);
            index = this._meshesUsingTheirOwnMaterials.indexOf(mesh.uniqueId);
        }
    };
    /**
     * Free any resources and references associated to a mesh.
     * Internal use
     * @param mesh The mesh to free.
     * @hidden
     */
    GlowLayer.prototype._disposeMesh = function (mesh) {
        this.removeIncludedOnlyMesh(mesh);
        this.removeExcludedMesh(mesh);
    };
    /**
      * Gets the class name of the effect layer
      * @returns the string with the class name of the effect layer
      */
    GlowLayer.prototype.getClassName = function () {
        return "GlowLayer";
    };
    /**
     * Serializes this glow layer
     * @returns a serialized glow layer object
     */
    GlowLayer.prototype.serialize = function () {
        var serializationObject = SerializationHelper.Serialize(this);
        serializationObject.customType = "BABYLON.GlowLayer";
        var index;
        // Included meshes
        serializationObject.includedMeshes = [];
        if (this._includedOnlyMeshes.length) {
            for (index = 0; index < this._includedOnlyMeshes.length; index++) {
                var mesh = this._scene.getMeshByUniqueID(this._includedOnlyMeshes[index]);
                if (mesh) {
                    serializationObject.includedMeshes.push(mesh.id);
                }
            }
        }
        // Excluded meshes
        serializationObject.excludedMeshes = [];
        if (this._excludedMeshes.length) {
            for (index = 0; index < this._excludedMeshes.length; index++) {
                var mesh = this._scene.getMeshByUniqueID(this._excludedMeshes[index]);
                if (mesh) {
                    serializationObject.excludedMeshes.push(mesh.id);
                }
            }
        }
        return serializationObject;
    };
    /**
     * Creates a Glow Layer from parsed glow layer data
     * @param parsedGlowLayer defines glow layer data
     * @param scene defines the current scene
     * @param rootUrl defines the root URL containing the glow layer information
     * @returns a parsed Glow Layer
     */
    GlowLayer.Parse = function (parsedGlowLayer, scene, rootUrl) {
        var gl = SerializationHelper.Parse(function () { return new GlowLayer(parsedGlowLayer.name, scene, parsedGlowLayer.options); }, parsedGlowLayer, scene, rootUrl);
        var index;
        // Excluded meshes
        for (index = 0; index < parsedGlowLayer.excludedMeshes.length; index++) {
            var mesh = scene.getMeshByID(parsedGlowLayer.excludedMeshes[index]);
            if (mesh) {
                gl.addExcludedMesh(mesh);
            }
        }
        // Included meshes
        for (index = 0; index < parsedGlowLayer.includedMeshes.length; index++) {
            var mesh = scene.getMeshByID(parsedGlowLayer.includedMeshes[index]);
            if (mesh) {
                gl.addIncludedOnlyMesh(mesh);
            }
        }
        return gl;
    };
    /**
     * Effect Name of the layer.
     */
    GlowLayer.EffectName = "GlowLayer";
    /**
     * The default blur kernel size used for the glow.
     */
    GlowLayer.DefaultBlurKernelSize = 32;
    /**
     * The default texture size ratio used for the glow.
     */
    GlowLayer.DefaultTextureRatio = 0.5;
    __decorate([
        serialize()
    ], GlowLayer.prototype, "blurKernelSize", null);
    __decorate([
        serialize()
    ], GlowLayer.prototype, "intensity", null);
    __decorate([
        serialize("options")
    ], GlowLayer.prototype, "_options", void 0);
    return GlowLayer;
}(EffectLayer));
_TypeStore.RegisteredTypes["BABYLON.GlowLayer"] = GlowLayer;

var name$b = 'sharpenPixelShader';
var shader$b = "\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\nuniform vec2 screenSize;\nuniform vec2 sharpnessAmounts;\nvoid main(void)\n{\nvec2 onePixel=vec2(1.0,1.0)/screenSize;\nvec4 color=texture2D(textureSampler,vUV);\nvec4 edgeDetection=texture2D(textureSampler,vUV+onePixel*vec2(0,-1)) +\ntexture2D(textureSampler,vUV+onePixel*vec2(-1,0)) +\ntexture2D(textureSampler,vUV+onePixel*vec2(1,0)) +\ntexture2D(textureSampler,vUV+onePixel*vec2(0,1)) -\ncolor*4.0;\ngl_FragColor=max(vec4(color.rgb*sharpnessAmounts.y,color.a)-(sharpnessAmounts.x*vec4(edgeDetection.rgb,0)),0.);\n}";
Effect.ShadersStore[name$b] = shader$b;

/**
 * The SharpenPostProcess applies a sharpen kernel to every pixel
 * See http://en.wikipedia.org/wiki/Kernel_(image_processing)
 */
var SharpenPostProcess = /** @class */ (function (_super) {
    __extends(SharpenPostProcess, _super);
    /**
     * Creates a new instance ConvolutionPostProcess
     * @param name The name of the effect.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    function SharpenPostProcess(name, options, camera, samplingMode, engine, reusable, textureType, blockCompilation) {
        if (textureType === void 0) { textureType = 0; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, name, "sharpen", ["sharpnessAmounts", "screenSize"], null, options, camera, samplingMode, engine, reusable, null, textureType, undefined, null, blockCompilation) || this;
        /**
         * How much of the original color should be applied. Setting this to 0 will display edge detection. (default: 1)
         */
        _this.colorAmount = 1.0;
        /**
         * How much sharpness should be applied (default: 0.3)
         */
        _this.edgeAmount = 0.3;
        _this.onApply = function (effect) {
            effect.setFloat2("screenSize", _this.width, _this.height);
            effect.setFloat2("sharpnessAmounts", _this.edgeAmount, _this.colorAmount);
        };
        return _this;
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "SharpenPostProcess" string
     */
    SharpenPostProcess.prototype.getClassName = function () {
        return "SharpenPostProcess";
    };
    /** @hidden */
    SharpenPostProcess._Parse = function (parsedPostProcess, targetCamera, scene, rootUrl) {
        return SerializationHelper.Parse(function () {
            return new SharpenPostProcess(parsedPostProcess.name, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.textureType, parsedPostProcess.reusable);
        }, parsedPostProcess, scene, rootUrl);
    };
    __decorate([
        serialize()
    ], SharpenPostProcess.prototype, "colorAmount", void 0);
    __decorate([
        serialize()
    ], SharpenPostProcess.prototype, "edgeAmount", void 0);
    return SharpenPostProcess;
}(PostProcess));
_TypeStore.RegisteredTypes["BABYLON.SharpenPostProcess"] = SharpenPostProcess;

var name$c = 'imageProcessingPixelShader';
var shader$c = "\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n#include<imageProcessingDeclaration>\n#include<helperFunctions>\n#include<imageProcessingFunctions>\nvoid main(void)\n{\nvec4 result=texture2D(textureSampler,vUV);\n#ifdef IMAGEPROCESSING\n#ifndef FROMLINEARSPACE\n\nresult.rgb=toLinearSpace(result.rgb);\n#endif\nresult=applyImageProcessing(result);\n#else\n\n#ifdef FROMLINEARSPACE\nresult=applyImageProcessing(result);\n#endif\n#endif\ngl_FragColor=result;\n}";
Effect.ShadersStore[name$c] = shader$c;

/**
 * ImageProcessingPostProcess
 * @see https://doc.babylonjs.com/how_to/how_to_use_postprocesses#imageprocessing
 */
var ImageProcessingPostProcess = /** @class */ (function (_super) {
    __extends(ImageProcessingPostProcess, _super);
    function ImageProcessingPostProcess(name, options, camera, samplingMode, engine, reusable, textureType, imageProcessingConfiguration) {
        if (camera === void 0) { camera = null; }
        if (textureType === void 0) { textureType = 0; }
        var _this = _super.call(this, name, "imageProcessing", [], [], options, camera, samplingMode, engine, reusable, null, textureType, "postprocess", null, true) || this;
        _this._fromLinearSpace = true;
        /**
         * Defines cache preventing GC.
         */
        _this._defines = {
            IMAGEPROCESSING: false,
            VIGNETTE: false,
            VIGNETTEBLENDMODEMULTIPLY: false,
            VIGNETTEBLENDMODEOPAQUE: false,
            TONEMAPPING: false,
            TONEMAPPING_ACES: false,
            CONTRAST: false,
            COLORCURVES: false,
            COLORGRADING: false,
            COLORGRADING3D: false,
            FROMLINEARSPACE: false,
            SAMPLER3DGREENDEPTH: false,
            SAMPLER3DBGRMAP: false,
            IMAGEPROCESSINGPOSTPROCESS: false,
            EXPOSURE: false,
        };
        // Setup the configuration as forced by the constructor. This would then not force the
        // scene materials output in linear space and let untouched the default forward pass.
        if (imageProcessingConfiguration) {
            imageProcessingConfiguration.applyByPostProcess = true;
            _this._attachImageProcessingConfiguration(imageProcessingConfiguration, true);
            // This will cause the shader to be compiled
            _this.fromLinearSpace = false;
        }
        // Setup the default processing configuration to the scene.
        else {
            _this._attachImageProcessingConfiguration(null, true);
            _this.imageProcessingConfiguration.applyByPostProcess = true;
        }
        _this.onApply = function (effect) {
            _this.imageProcessingConfiguration.bind(effect, _this.aspectRatio);
        };
        return _this;
    }
    Object.defineProperty(ImageProcessingPostProcess.prototype, "imageProcessingConfiguration", {
        /**
         * Gets the image processing configuration used either in this material.
         */
        get: function () {
            return this._imageProcessingConfiguration;
        },
        /**
         * Sets the Default image processing configuration used either in the this material.
         *
         * If sets to null, the scene one is in use.
         */
        set: function (value) {
            // We are almost sure it is applied by post process as
            // We are in the post process :-)
            value.applyByPostProcess = true;
            this._attachImageProcessingConfiguration(value);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Attaches a new image processing configuration to the PBR Material.
     * @param configuration
     */
    ImageProcessingPostProcess.prototype._attachImageProcessingConfiguration = function (configuration, doNotBuild) {
        var _this = this;
        if (doNotBuild === void 0) { doNotBuild = false; }
        if (configuration === this._imageProcessingConfiguration) {
            return;
        }
        // Detaches observer.
        if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
            this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
        }
        // Pick the scene configuration if needed.
        if (!configuration) {
            var scene = null;
            var engine = this.getEngine();
            var camera = this.getCamera();
            if (camera) {
                scene = camera.getScene();
            }
            else if (engine && engine.scenes) {
                var scenes = engine.scenes;
                scene = scenes[scenes.length - 1];
            }
            else {
                scene = EngineStore.LastCreatedScene;
            }
            if (scene) {
                this._imageProcessingConfiguration = scene.imageProcessingConfiguration;
            }
            else {
                this._imageProcessingConfiguration = new ImageProcessingConfiguration();
            }
        }
        else {
            this._imageProcessingConfiguration = configuration;
        }
        // Attaches observer.
        if (this._imageProcessingConfiguration) {
            this._imageProcessingObserver = this._imageProcessingConfiguration.onUpdateParameters.add(function () {
                _this._updateParameters();
            });
        }
        // Ensure the effect will be rebuilt.
        if (!doNotBuild) {
            this._updateParameters();
        }
    };
    Object.defineProperty(ImageProcessingPostProcess.prototype, "isSupported", {
        /**
         * If the post process is supported.
         */
        get: function () {
            var effect = this.getEffect();
            return !effect || effect.isSupported;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "colorCurves", {
        /**
         * Gets Color curves setup used in the effect if colorCurvesEnabled is set to true .
         */
        get: function () {
            return this.imageProcessingConfiguration.colorCurves;
        },
        /**
         * Sets Color curves setup used in the effect if colorCurvesEnabled is set to true .
         */
        set: function (value) {
            this.imageProcessingConfiguration.colorCurves = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "colorCurvesEnabled", {
        /**
         * Gets wether the color curves effect is enabled.
         */
        get: function () {
            return this.imageProcessingConfiguration.colorCurvesEnabled;
        },
        /**
         * Sets wether the color curves effect is enabled.
         */
        set: function (value) {
            this.imageProcessingConfiguration.colorCurvesEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "colorGradingTexture", {
        /**
         * Gets Color grading LUT texture used in the effect if colorGradingEnabled is set to true.
         */
        get: function () {
            return this.imageProcessingConfiguration.colorGradingTexture;
        },
        /**
         * Sets Color grading LUT texture used in the effect if colorGradingEnabled is set to true.
         */
        set: function (value) {
            this.imageProcessingConfiguration.colorGradingTexture = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "colorGradingEnabled", {
        /**
         * Gets wether the color grading effect is enabled.
         */
        get: function () {
            return this.imageProcessingConfiguration.colorGradingEnabled;
        },
        /**
         * Gets wether the color grading effect is enabled.
         */
        set: function (value) {
            this.imageProcessingConfiguration.colorGradingEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "exposure", {
        /**
         * Gets exposure used in the effect.
         */
        get: function () {
            return this.imageProcessingConfiguration.exposure;
        },
        /**
         * Sets exposure used in the effect.
         */
        set: function (value) {
            this.imageProcessingConfiguration.exposure = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "toneMappingEnabled", {
        /**
         * Gets wether tonemapping is enabled or not.
         */
        get: function () {
            return this._imageProcessingConfiguration.toneMappingEnabled;
        },
        /**
         * Sets wether tonemapping is enabled or not
         */
        set: function (value) {
            this._imageProcessingConfiguration.toneMappingEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "toneMappingType", {
        /**
         * Gets the type of tone mapping effect.
         */
        get: function () {
            return this._imageProcessingConfiguration.toneMappingType;
        },
        /**
         * Sets the type of tone mapping effect.
         */
        set: function (value) {
            this._imageProcessingConfiguration.toneMappingType = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "contrast", {
        /**
         * Gets contrast used in the effect.
         */
        get: function () {
            return this.imageProcessingConfiguration.contrast;
        },
        /**
         * Sets contrast used in the effect.
         */
        set: function (value) {
            this.imageProcessingConfiguration.contrast = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "vignetteStretch", {
        /**
         * Gets Vignette stretch size.
         */
        get: function () {
            return this.imageProcessingConfiguration.vignetteStretch;
        },
        /**
         * Sets Vignette stretch size.
         */
        set: function (value) {
            this.imageProcessingConfiguration.vignetteStretch = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "vignetteCentreX", {
        /**
         * Gets Vignette centre X Offset.
         */
        get: function () {
            return this.imageProcessingConfiguration.vignetteCentreX;
        },
        /**
         * Sets Vignette centre X Offset.
         */
        set: function (value) {
            this.imageProcessingConfiguration.vignetteCentreX = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "vignetteCentreY", {
        /**
         * Gets Vignette centre Y Offset.
         */
        get: function () {
            return this.imageProcessingConfiguration.vignetteCentreY;
        },
        /**
         * Sets Vignette centre Y Offset.
         */
        set: function (value) {
            this.imageProcessingConfiguration.vignetteCentreY = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "vignetteWeight", {
        /**
         * Gets Vignette weight or intensity of the vignette effect.
         */
        get: function () {
            return this.imageProcessingConfiguration.vignetteWeight;
        },
        /**
         * Sets Vignette weight or intensity of the vignette effect.
         */
        set: function (value) {
            this.imageProcessingConfiguration.vignetteWeight = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "vignetteColor", {
        /**
         * Gets Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode)
         * if vignetteEnabled is set to true.
         */
        get: function () {
            return this.imageProcessingConfiguration.vignetteColor;
        },
        /**
         * Sets Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode)
         * if vignetteEnabled is set to true.
         */
        set: function (value) {
            this.imageProcessingConfiguration.vignetteColor = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "vignetteCameraFov", {
        /**
         * Gets Camera field of view used by the Vignette effect.
         */
        get: function () {
            return this.imageProcessingConfiguration.vignetteCameraFov;
        },
        /**
         * Sets Camera field of view used by the Vignette effect.
         */
        set: function (value) {
            this.imageProcessingConfiguration.vignetteCameraFov = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "vignetteBlendMode", {
        /**
         * Gets the vignette blend mode allowing different kind of effect.
         */
        get: function () {
            return this.imageProcessingConfiguration.vignetteBlendMode;
        },
        /**
         * Sets the vignette blend mode allowing different kind of effect.
         */
        set: function (value) {
            this.imageProcessingConfiguration.vignetteBlendMode = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "vignetteEnabled", {
        /**
         * Gets wether the vignette effect is enabled.
         */
        get: function () {
            return this.imageProcessingConfiguration.vignetteEnabled;
        },
        /**
         * Sets wether the vignette effect is enabled.
         */
        set: function (value) {
            this.imageProcessingConfiguration.vignetteEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingPostProcess.prototype, "fromLinearSpace", {
        /**
         * Gets wether the input of the processing is in Gamma or Linear Space.
         */
        get: function () {
            return this._fromLinearSpace;
        },
        /**
         * Sets wether the input of the processing is in Gamma or Linear Space.
         */
        set: function (value) {
            if (this._fromLinearSpace === value) {
                return;
            }
            this._fromLinearSpace = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    /**
     *  "ImageProcessingPostProcess"
     * @returns "ImageProcessingPostProcess"
     */
    ImageProcessingPostProcess.prototype.getClassName = function () {
        return "ImageProcessingPostProcess";
    };
    /**
     * @hidden
     */
    ImageProcessingPostProcess.prototype._updateParameters = function () {
        this._defines.FROMLINEARSPACE = this._fromLinearSpace;
        this.imageProcessingConfiguration.prepareDefines(this._defines, true);
        var defines = "";
        for (var define in this._defines) {
            if (this._defines[define]) {
                defines += "#define " + define + ";\r\n";
            }
        }
        var samplers = ["textureSampler"];
        var uniforms = ["scale"];
        if (ImageProcessingConfiguration) {
            ImageProcessingConfiguration.PrepareSamplers(samplers, this._defines);
            ImageProcessingConfiguration.PrepareUniforms(uniforms, this._defines);
        }
        this.updateEffect(defines, uniforms, samplers);
    };
    ImageProcessingPostProcess.prototype.dispose = function (camera) {
        _super.prototype.dispose.call(this, camera);
        if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
            this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
        }
        if (this._imageProcessingConfiguration) {
            this.imageProcessingConfiguration.applyByPostProcess = false;
        }
    };
    __decorate([
        serialize()
    ], ImageProcessingPostProcess.prototype, "_fromLinearSpace", void 0);
    return ImageProcessingPostProcess;
}(PostProcess));

var name$d = 'chromaticAberrationPixelShader';
var shader$d = "\nuniform sampler2D textureSampler;\n\nuniform float chromatic_aberration;\nuniform float radialIntensity;\nuniform vec2 direction;\nuniform vec2 centerPosition;\nuniform float screen_width;\nuniform float screen_height;\n\nvarying vec2 vUV;\nvoid main(void)\n{\nvec2 centered_screen_pos=vec2(vUV.x-centerPosition.x,vUV.y-centerPosition.y);\nvec2 directionOfEffect=direction;\nif(directionOfEffect.x == 0. && directionOfEffect.y == 0.){\ndirectionOfEffect=normalize(centered_screen_pos);\n}\nfloat radius2=centered_screen_pos.x*centered_screen_pos.x\n+centered_screen_pos.y*centered_screen_pos.y;\nfloat radius=sqrt(radius2);\nvec4 original=texture2D(textureSampler,vUV);\n\nvec3 ref_indices=vec3(-0.3,0.0,0.3);\nfloat ref_shiftX=chromatic_aberration*pow(radius,radialIntensity)*directionOfEffect.x/screen_width;\nfloat ref_shiftY=chromatic_aberration*pow(radius,radialIntensity)*directionOfEffect.y/screen_height;\n\nvec2 ref_coords_r=vec2(vUV.x+ref_indices.r*ref_shiftX,vUV.y+ref_indices.r*ref_shiftY*0.5);\nvec2 ref_coords_g=vec2(vUV.x+ref_indices.g*ref_shiftX,vUV.y+ref_indices.g*ref_shiftY*0.5);\nvec2 ref_coords_b=vec2(vUV.x+ref_indices.b*ref_shiftX,vUV.y+ref_indices.b*ref_shiftY*0.5);\noriginal.r=texture2D(textureSampler,ref_coords_r).r;\noriginal.g=texture2D(textureSampler,ref_coords_g).g;\noriginal.b=texture2D(textureSampler,ref_coords_b).b;\noriginal.a=clamp(texture2D(textureSampler,ref_coords_r).a+texture2D(textureSampler,ref_coords_g).a+texture2D(textureSampler,ref_coords_b).a,0.,1.);\ngl_FragColor=original;\n}";
Effect.ShadersStore[name$d] = shader$d;

/**
 * The ChromaticAberrationPostProcess separates the rgb channels in an image to produce chromatic distortion around the edges of the screen
 */
var ChromaticAberrationPostProcess = /** @class */ (function (_super) {
    __extends(ChromaticAberrationPostProcess, _super);
    /**
     * Creates a new instance ChromaticAberrationPostProcess
     * @param name The name of the effect.
     * @param screenWidth The width of the screen to apply the effect on.
     * @param screenHeight The height of the screen to apply the effect on.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    function ChromaticAberrationPostProcess(name, screenWidth, screenHeight, options, camera, samplingMode, engine, reusable, textureType, blockCompilation) {
        if (textureType === void 0) { textureType = 0; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, name, "chromaticAberration", ["chromatic_aberration", "screen_width", "screen_height", "direction", "radialIntensity", "centerPosition"], [], options, camera, samplingMode, engine, reusable, null, textureType, undefined, null, blockCompilation) || this;
        /**
         * The amount of seperation of rgb channels (default: 30)
         */
        _this.aberrationAmount = 30;
        /**
         * The amount the effect will increase for pixels closer to the edge of the screen. (default: 0)
         */
        _this.radialIntensity = 0;
        /**
         * The normilized direction in which the rgb channels should be seperated. If set to 0,0 radial direction will be used. (default: Vector2(0.707,0.707))
         */
        _this.direction = new Vector2(0.707, 0.707);
        /**
         * The center position where the radialIntensity should be around. [0.5,0.5 is center of screen, 1,1 is top right corder] (default: Vector2(0.5 ,0.5))
         */
        _this.centerPosition = new Vector2(0.5, 0.5);
        _this.screenWidth = screenWidth;
        _this.screenHeight = screenHeight;
        _this.onApplyObservable.add(function (effect) {
            effect.setFloat('chromatic_aberration', _this.aberrationAmount);
            effect.setFloat('screen_width', screenWidth);
            effect.setFloat('screen_height', screenHeight);
            effect.setFloat('radialIntensity', _this.radialIntensity);
            effect.setFloat2('direction', _this.direction.x, _this.direction.y);
            effect.setFloat2('centerPosition', _this.centerPosition.x, _this.centerPosition.y);
        });
        return _this;
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "ChromaticAberrationPostProcess" string
     */
    ChromaticAberrationPostProcess.prototype.getClassName = function () {
        return "ChromaticAberrationPostProcess";
    };
    /** @hidden */
    ChromaticAberrationPostProcess._Parse = function (parsedPostProcess, targetCamera, scene, rootUrl) {
        return SerializationHelper.Parse(function () {
            return new ChromaticAberrationPostProcess(parsedPostProcess.name, parsedPostProcess.screenWidth, parsedPostProcess.screenHeight, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable, parsedPostProcess.textureType, false);
        }, parsedPostProcess, scene, rootUrl);
    };
    __decorate([
        serialize()
    ], ChromaticAberrationPostProcess.prototype, "aberrationAmount", void 0);
    __decorate([
        serialize()
    ], ChromaticAberrationPostProcess.prototype, "radialIntensity", void 0);
    __decorate([
        serialize()
    ], ChromaticAberrationPostProcess.prototype, "direction", void 0);
    __decorate([
        serialize()
    ], ChromaticAberrationPostProcess.prototype, "centerPosition", void 0);
    __decorate([
        serialize()
    ], ChromaticAberrationPostProcess.prototype, "screenWidth", void 0);
    __decorate([
        serialize()
    ], ChromaticAberrationPostProcess.prototype, "screenHeight", void 0);
    return ChromaticAberrationPostProcess;
}(PostProcess));
_TypeStore.RegisteredTypes["BABYLON.ChromaticAberrationPostProcess"] = ChromaticAberrationPostProcess;

var name$e = 'grainPixelShader';
var shader$e = "#include<helperFunctions>\n\nuniform sampler2D textureSampler;\n\nuniform float intensity;\nuniform float animatedSeed;\n\nvarying vec2 vUV;\nvoid main(void)\n{\ngl_FragColor=texture2D(textureSampler,vUV);\nvec2 seed=vUV*(animatedSeed);\nfloat grain=dither(seed,intensity);\n\nfloat lum=getLuminance(gl_FragColor.rgb);\nfloat grainAmount=(cos(-PI+(lum*PI*2.))+1.)/2.;\ngl_FragColor.rgb+=grain*grainAmount;\ngl_FragColor.rgb=max(gl_FragColor.rgb,0.0);\n}";
Effect.ShadersStore[name$e] = shader$e;

/**
 * The GrainPostProcess adds noise to the image at mid luminance levels
 */
var GrainPostProcess = /** @class */ (function (_super) {
    __extends(GrainPostProcess, _super);
    /**
     * Creates a new instance of @see GrainPostProcess
     * @param name The name of the effect.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    function GrainPostProcess(name, options, camera, samplingMode, engine, reusable, textureType, blockCompilation) {
        if (textureType === void 0) { textureType = 0; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, name, "grain", ["intensity", "animatedSeed"], [], options, camera, samplingMode, engine, reusable, null, textureType, undefined, null, blockCompilation) || this;
        /**
         * The intensity of the grain added (default: 30)
         */
        _this.intensity = 30;
        /**
         * If the grain should be randomized on every frame
         */
        _this.animated = false;
        _this.onApplyObservable.add(function (effect) {
            effect.setFloat('intensity', _this.intensity);
            effect.setFloat('animatedSeed', _this.animated ? Math.random() + 1 : 1);
        });
        return _this;
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "GrainPostProcess" string
     */
    GrainPostProcess.prototype.getClassName = function () {
        return "GrainPostProcess";
    };
    /** @hidden */
    GrainPostProcess._Parse = function (parsedPostProcess, targetCamera, scene, rootUrl) {
        return SerializationHelper.Parse(function () {
            return new GrainPostProcess(parsedPostProcess.name, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable);
        }, parsedPostProcess, scene, rootUrl);
    };
    __decorate([
        serialize()
    ], GrainPostProcess.prototype, "intensity", void 0);
    __decorate([
        serialize()
    ], GrainPostProcess.prototype, "animated", void 0);
    return GrainPostProcess;
}(PostProcess));
_TypeStore.RegisteredTypes["BABYLON.GrainPostProcess"] = GrainPostProcess;

var name$f = 'fxaaPixelShader';
var shader$f = "uniform sampler2D textureSampler;\nuniform vec2 texelSize;\nvarying vec2 vUV;\nvarying vec2 sampleCoordS;\nvarying vec2 sampleCoordE;\nvarying vec2 sampleCoordN;\nvarying vec2 sampleCoordW;\nvarying vec2 sampleCoordNW;\nvarying vec2 sampleCoordSE;\nvarying vec2 sampleCoordNE;\nvarying vec2 sampleCoordSW;\nconst float fxaaQualitySubpix=1.0;\nconst float fxaaQualityEdgeThreshold=0.166;\nconst float fxaaQualityEdgeThresholdMin=0.0833;\nconst vec3 kLumaCoefficients=vec3(0.2126,0.7152,0.0722);\n#define FxaaLuma(rgba) dot(rgba.rgb,kLumaCoefficients)\nvoid main(){\nvec2 posM;\nposM.x=vUV.x;\nposM.y=vUV.y;\nvec4 rgbyM=texture2D(textureSampler,vUV,0.0);\nfloat lumaM=FxaaLuma(rgbyM);\nfloat lumaS=FxaaLuma(texture2D(textureSampler,sampleCoordS,0.0));\nfloat lumaE=FxaaLuma(texture2D(textureSampler,sampleCoordE,0.0));\nfloat lumaN=FxaaLuma(texture2D(textureSampler,sampleCoordN,0.0));\nfloat lumaW=FxaaLuma(texture2D(textureSampler,sampleCoordW,0.0));\nfloat maxSM=max(lumaS,lumaM);\nfloat minSM=min(lumaS,lumaM);\nfloat maxESM=max(lumaE,maxSM);\nfloat minESM=min(lumaE,minSM);\nfloat maxWN=max(lumaN,lumaW);\nfloat minWN=min(lumaN,lumaW);\nfloat rangeMax=max(maxWN,maxESM);\nfloat rangeMin=min(minWN,minESM);\nfloat rangeMaxScaled=rangeMax*fxaaQualityEdgeThreshold;\nfloat range=rangeMax-rangeMin;\nfloat rangeMaxClamped=max(fxaaQualityEdgeThresholdMin,rangeMaxScaled);\n#ifndef MALI\nif(range<rangeMaxClamped)\n{\ngl_FragColor=rgbyM;\nreturn;\n}\n#endif\nfloat lumaNW=FxaaLuma(texture2D(textureSampler,sampleCoordNW,0.0));\nfloat lumaSE=FxaaLuma(texture2D(textureSampler,sampleCoordSE,0.0));\nfloat lumaNE=FxaaLuma(texture2D(textureSampler,sampleCoordNE,0.0));\nfloat lumaSW=FxaaLuma(texture2D(textureSampler,sampleCoordSW,0.0));\nfloat lumaNS=lumaN+lumaS;\nfloat lumaWE=lumaW+lumaE;\nfloat subpixRcpRange=1.0/range;\nfloat subpixNSWE=lumaNS+lumaWE;\nfloat edgeHorz1=(-2.0*lumaM)+lumaNS;\nfloat edgeVert1=(-2.0*lumaM)+lumaWE;\nfloat lumaNESE=lumaNE+lumaSE;\nfloat lumaNWNE=lumaNW+lumaNE;\nfloat edgeHorz2=(-2.0*lumaE)+lumaNESE;\nfloat edgeVert2=(-2.0*lumaN)+lumaNWNE;\nfloat lumaNWSW=lumaNW+lumaSW;\nfloat lumaSWSE=lumaSW+lumaSE;\nfloat edgeHorz4=(abs(edgeHorz1)*2.0)+abs(edgeHorz2);\nfloat edgeVert4=(abs(edgeVert1)*2.0)+abs(edgeVert2);\nfloat edgeHorz3=(-2.0*lumaW)+lumaNWSW;\nfloat edgeVert3=(-2.0*lumaS)+lumaSWSE;\nfloat edgeHorz=abs(edgeHorz3)+edgeHorz4;\nfloat edgeVert=abs(edgeVert3)+edgeVert4;\nfloat subpixNWSWNESE=lumaNWSW+lumaNESE;\nfloat lengthSign=texelSize.x;\nbool horzSpan=edgeHorz>=edgeVert;\nfloat subpixA=subpixNSWE*2.0+subpixNWSWNESE;\nif (!horzSpan)\n{\nlumaN=lumaW;\n}\nif (!horzSpan)\n{\nlumaS=lumaE;\n}\nif (horzSpan)\n{\nlengthSign=texelSize.y;\n}\nfloat subpixB=(subpixA*(1.0/12.0))-lumaM;\nfloat gradientN=lumaN-lumaM;\nfloat gradientS=lumaS-lumaM;\nfloat lumaNN=lumaN+lumaM;\nfloat lumaSS=lumaS+lumaM;\nbool pairN=abs(gradientN)>=abs(gradientS);\nfloat gradient=max(abs(gradientN),abs(gradientS));\nif (pairN)\n{\nlengthSign=-lengthSign;\n}\nfloat subpixC=clamp(abs(subpixB)*subpixRcpRange,0.0,1.0);\nvec2 posB;\nposB.x=posM.x;\nposB.y=posM.y;\nvec2 offNP;\noffNP.x=(!horzSpan) ? 0.0 : texelSize.x;\noffNP.y=(horzSpan) ? 0.0 : texelSize.y;\nif (!horzSpan)\n{\nposB.x+=lengthSign*0.5;\n}\nif (horzSpan)\n{\nposB.y+=lengthSign*0.5;\n}\nvec2 posN;\nposN.x=posB.x-offNP.x*1.5;\nposN.y=posB.y-offNP.y*1.5;\nvec2 posP;\nposP.x=posB.x+offNP.x*1.5;\nposP.y=posB.y+offNP.y*1.5;\nfloat subpixD=((-2.0)*subpixC)+3.0;\nfloat lumaEndN=FxaaLuma(texture2D(textureSampler,posN,0.0));\nfloat subpixE=subpixC*subpixC;\nfloat lumaEndP=FxaaLuma(texture2D(textureSampler,posP,0.0));\nif (!pairN)\n{\nlumaNN=lumaSS;\n}\nfloat gradientScaled=gradient*1.0/4.0;\nfloat lumaMM=lumaM-lumaNN*0.5;\nfloat subpixF=subpixD*subpixE;\nbool lumaMLTZero=lumaMM<0.0;\nlumaEndN-=lumaNN*0.5;\nlumaEndP-=lumaNN*0.5;\nbool doneN=abs(lumaEndN)>=gradientScaled;\nbool doneP=abs(lumaEndP)>=gradientScaled;\nif (!doneN)\n{\nposN.x-=offNP.x*3.0;\n}\nif (!doneN)\n{\nposN.y-=offNP.y*3.0;\n}\nbool doneNP=(!doneN) || (!doneP);\nif (!doneP)\n{\nposP.x+=offNP.x*3.0;\n}\nif (!doneP)\n{\nposP.y+=offNP.y*3.0;\n}\nif (doneNP)\n{\nif (!doneN) lumaEndN=FxaaLuma(texture2D(textureSampler,posN.xy,0.0));\nif (!doneP) lumaEndP=FxaaLuma(texture2D(textureSampler,posP.xy,0.0));\nif (!doneN) lumaEndN=lumaEndN-lumaNN*0.5;\nif (!doneP) lumaEndP=lumaEndP-lumaNN*0.5;\ndoneN=abs(lumaEndN)>=gradientScaled;\ndoneP=abs(lumaEndP)>=gradientScaled;\nif (!doneN) posN.x-=offNP.x*12.0;\nif (!doneN) posN.y-=offNP.y*12.0;\ndoneNP=(!doneN) || (!doneP);\nif (!doneP) posP.x+=offNP.x*12.0;\nif (!doneP) posP.y+=offNP.y*12.0;\n}\nfloat dstN=posM.x-posN.x;\nfloat dstP=posP.x-posM.x;\nif (!horzSpan)\n{\ndstN=posM.y-posN.y;\n}\nif (!horzSpan)\n{\ndstP=posP.y-posM.y;\n}\nbool goodSpanN=(lumaEndN<0.0) != lumaMLTZero;\nfloat spanLength=(dstP+dstN);\nbool goodSpanP=(lumaEndP<0.0) != lumaMLTZero;\nfloat spanLengthRcp=1.0/spanLength;\nbool directionN=dstN<dstP;\nfloat dst=min(dstN,dstP);\nbool goodSpan=directionN ? goodSpanN : goodSpanP;\nfloat subpixG=subpixF*subpixF;\nfloat pixelOffset=(dst*(-spanLengthRcp))+0.5;\nfloat subpixH=subpixG*fxaaQualitySubpix;\nfloat pixelOffsetGood=goodSpan ? pixelOffset : 0.0;\nfloat pixelOffsetSubpix=max(pixelOffsetGood,subpixH);\nif (!horzSpan)\n{\nposM.x+=pixelOffsetSubpix*lengthSign;\n}\nif (horzSpan)\n{\nposM.y+=pixelOffsetSubpix*lengthSign;\n}\n#ifdef MALI\nif(range<rangeMaxClamped)\n{\ngl_FragColor=rgbyM;\n}\nelse\n{\ngl_FragColor=texture2D(textureSampler,posM,0.0);\n}\n#else\ngl_FragColor=texture2D(textureSampler,posM,0.0);\n#endif\n}";
Effect.ShadersStore[name$f] = shader$f;

var name$g = 'fxaaVertexShader';
var shader$g = "\nattribute vec2 position;\nuniform vec2 texelSize;\n\nvarying vec2 vUV;\nvarying vec2 sampleCoordS;\nvarying vec2 sampleCoordE;\nvarying vec2 sampleCoordN;\nvarying vec2 sampleCoordW;\nvarying vec2 sampleCoordNW;\nvarying vec2 sampleCoordSE;\nvarying vec2 sampleCoordNE;\nvarying vec2 sampleCoordSW;\nconst vec2 madd=vec2(0.5,0.5);\nvoid main(void) {\nvUV=(position*madd+madd);\nsampleCoordS=vUV+vec2( 0.0,1.0)*texelSize;\nsampleCoordE=vUV+vec2( 1.0,0.0)*texelSize;\nsampleCoordN=vUV+vec2( 0.0,-1.0)*texelSize;\nsampleCoordW=vUV+vec2(-1.0,0.0)*texelSize;\nsampleCoordNW=vUV+vec2(-1.0,-1.0)*texelSize;\nsampleCoordSE=vUV+vec2( 1.0,1.0)*texelSize;\nsampleCoordNE=vUV+vec2( 1.0,-1.0)*texelSize;\nsampleCoordSW=vUV+vec2(-1.0,1.0)*texelSize;\ngl_Position=vec4(position,0.0,1.0);\n}";
Effect.ShadersStore[name$g] = shader$g;

/**
 * Fxaa post process
 * @see https://doc.babylonjs.com/how_to/how_to_use_postprocesses#fxaa
 */
var FxaaPostProcess = /** @class */ (function (_super) {
    __extends(FxaaPostProcess, _super);
    function FxaaPostProcess(name, options, camera, samplingMode, engine, reusable, textureType) {
        if (camera === void 0) { camera = null; }
        if (textureType === void 0) { textureType = 0; }
        var _this = _super.call(this, name, "fxaa", ["texelSize"], null, options, camera, samplingMode || Texture.BILINEAR_SAMPLINGMODE, engine, reusable, null, textureType, "fxaa", undefined, true) || this;
        var defines = _this._getDefines();
        _this.updateEffect(defines);
        _this.onApplyObservable.add(function (effect) {
            var texelSize = _this.texelSize;
            effect.setFloat2("texelSize", texelSize.x, texelSize.y);
        });
        return _this;
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "FxaaPostProcess" string
     */
    FxaaPostProcess.prototype.getClassName = function () {
        return "FxaaPostProcess";
    };
    FxaaPostProcess.prototype._getDefines = function () {
        var engine = this.getEngine();
        if (!engine) {
            return null;
        }
        var glInfo = engine.getGlInfo();
        if (glInfo && glInfo.renderer && glInfo.renderer.toLowerCase().indexOf("mali") > -1) {
            return "#define MALI 1\n";
        }
        return null;
    };
    /** @hidden */
    FxaaPostProcess._Parse = function (parsedPostProcess, targetCamera, scene, rootUrl) {
        return SerializationHelper.Parse(function () {
            return new FxaaPostProcess(parsedPostProcess.name, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable);
        }, parsedPostProcess, scene, rootUrl);
    };
    return FxaaPostProcess;
}(PostProcess));
_TypeStore.RegisteredTypes["BABYLON.FxaaPostProcess"] = FxaaPostProcess;

/**
 * PostProcessRenderPipeline
 * @see https://doc.babylonjs.com/how_to/how_to_use_postprocessrenderpipeline
 */
var PostProcessRenderPipeline = /** @class */ (function () {
    /**
     * Initializes a PostProcessRenderPipeline
     * @param engine engine to add the pipeline to
     * @param name name of the pipeline
     */
    function PostProcessRenderPipeline(engine, name) {
        this.engine = engine;
        this._name = name;
        this._renderEffects = {};
        this._renderEffectsForIsolatedPass = new Array();
        this._cameras = [];
    }
    Object.defineProperty(PostProcessRenderPipeline.prototype, "name", {
        /**
         * Gets pipeline name
         */
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PostProcessRenderPipeline.prototype, "cameras", {
        /** Gets the list of attached cameras */
        get: function () {
            return this._cameras;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the class name
     * @returns "PostProcessRenderPipeline"
     */
    PostProcessRenderPipeline.prototype.getClassName = function () {
        return "PostProcessRenderPipeline";
    };
    Object.defineProperty(PostProcessRenderPipeline.prototype, "isSupported", {
        /**
         * If all the render effects in the pipeline are supported
         */
        get: function () {
            for (var renderEffectName in this._renderEffects) {
                if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                    if (!this._renderEffects[renderEffectName].isSupported) {
                        return false;
                    }
                }
            }
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds an effect to the pipeline
     * @param renderEffect the effect to add
     */
    PostProcessRenderPipeline.prototype.addEffect = function (renderEffect) {
        this._renderEffects[renderEffect._name] = renderEffect;
    };
    // private
    /** @hidden */
    PostProcessRenderPipeline.prototype._rebuild = function () {
    };
    /** @hidden */
    PostProcessRenderPipeline.prototype._enableEffect = function (renderEffectName, cameras) {
        var renderEffects = this._renderEffects[renderEffectName];
        if (!renderEffects) {
            return;
        }
        renderEffects._enable(Tools.MakeArray(cameras || this._cameras));
    };
    /** @hidden */
    PostProcessRenderPipeline.prototype._disableEffect = function (renderEffectName, cameras) {
        var renderEffects = this._renderEffects[renderEffectName];
        if (!renderEffects) {
            return;
        }
        renderEffects._disable(Tools.MakeArray(cameras || this._cameras));
    };
    /** @hidden */
    PostProcessRenderPipeline.prototype._attachCameras = function (cameras, unique) {
        var cams = Tools.MakeArray(cameras || this._cameras);
        if (!cams) {
            return;
        }
        var indicesToDelete = [];
        var i;
        for (i = 0; i < cams.length; i++) {
            var camera = cams[i];
            if (!camera) {
                continue;
            }
            var cameraName = camera.name;
            if (this._cameras.indexOf(camera) === -1) {
                this._cameras[cameraName] = camera;
            }
            else if (unique) {
                indicesToDelete.push(i);
            }
        }
        for (i = 0; i < indicesToDelete.length; i++) {
            cameras.splice(indicesToDelete[i], 1);
        }
        for (var renderEffectName in this._renderEffects) {
            if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                this._renderEffects[renderEffectName]._attachCameras(cams);
            }
        }
    };
    /** @hidden */
    PostProcessRenderPipeline.prototype._detachCameras = function (cameras) {
        var cams = Tools.MakeArray(cameras || this._cameras);
        if (!cams) {
            return;
        }
        for (var renderEffectName in this._renderEffects) {
            if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                this._renderEffects[renderEffectName]._detachCameras(cams);
            }
        }
        for (var i = 0; i < cams.length; i++) {
            this._cameras.splice(this._cameras.indexOf(cams[i]), 1);
        }
    };
    /** @hidden */
    PostProcessRenderPipeline.prototype._update = function () {
        for (var renderEffectName in this._renderEffects) {
            if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                this._renderEffects[renderEffectName]._update();
            }
        }
        for (var i = 0; i < this._cameras.length; i++) {
            if (!this._cameras[i]) {
                continue;
            }
            var cameraName = this._cameras[i].name;
            if (this._renderEffectsForIsolatedPass[cameraName]) {
                this._renderEffectsForIsolatedPass[cameraName]._update();
            }
        }
    };
    /** @hidden */
    PostProcessRenderPipeline.prototype._reset = function () {
        this._renderEffects = {};
        this._renderEffectsForIsolatedPass = new Array();
    };
    PostProcessRenderPipeline.prototype._enableMSAAOnFirstPostProcess = function (sampleCount) {
        if (this.engine.webGLVersion === 1) {
            return false;
        }
        // Set samples of the very first post process to 4 to enable native anti-aliasing in browsers that support webGL 2.0 (See: https://github.com/BabylonJS/Babylon.js/issues/3754)
        var effectKeys = Object.keys(this._renderEffects);
        if (effectKeys.length > 0) {
            var postProcesses = this._renderEffects[effectKeys[0]].getPostProcesses();
            if (postProcesses) {
                postProcesses[0].samples = sampleCount;
            }
        }
        return true;
    };
    /**
     * Sets the required values to the prepass renderer.
     * @param prePassRenderer defines the prepass renderer to setup.
     * @returns true if the pre pass is needed.
     */
    PostProcessRenderPipeline.prototype.setPrePassRenderer = function (prePassRenderer) {
        // Do Nothing by default
        return false;
    };
    /**
     * Disposes of the pipeline
     */
    PostProcessRenderPipeline.prototype.dispose = function () {
        // Must be implemented by children
    };
    __decorate([
        serialize()
    ], PostProcessRenderPipeline.prototype, "_name", void 0);
    return PostProcessRenderPipeline;
}());

/**
 * This represents a set of one or more post processes in Babylon.
 * A post process can be used to apply a shader to a texture after it is rendered.
 * @example https://doc.babylonjs.com/how_to/how_to_use_postprocessrenderpipeline
 */
var PostProcessRenderEffect = /** @class */ (function () {
    /**
     * Instantiates a post process render effect.
     * A post process can be used to apply a shader to a texture after it is rendered.
     * @param engine The engine the effect is tied to
     * @param name The name of the effect
     * @param getPostProcesses A function that returns a set of post processes which the effect will run in order to be run.
     * @param singleInstance False if this post process can be run on multiple cameras. (default: true)
     */
    function PostProcessRenderEffect(engine, name, getPostProcesses, singleInstance) {
        this._name = name;
        this._singleInstance = singleInstance || true;
        this._getPostProcesses = getPostProcesses;
        this._cameras = {};
        this._indicesForCamera = {};
        this._postProcesses = {};
    }
    Object.defineProperty(PostProcessRenderEffect.prototype, "isSupported", {
        /**
         * Checks if all the post processes in the effect are supported.
         */
        get: function () {
            for (var index in this._postProcesses) {
                if (this._postProcesses.hasOwnProperty(index)) {
                    var pps = this._postProcesses[index];
                    for (var ppIndex = 0; ppIndex < pps.length; ppIndex++) {
                        if (!pps[ppIndex].isSupported) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Updates the current state of the effect
     * @hidden
     */
    PostProcessRenderEffect.prototype._update = function () {
    };
    /**
     * Attaches the effect on cameras
     * @param cameras The camera to attach to.
     * @hidden
     */
    PostProcessRenderEffect.prototype._attachCameras = function (cameras) {
        var _this = this;
        var cameraKey;
        var cams = Tools.MakeArray(cameras || this._cameras);
        if (!cams) {
            return;
        }
        for (var i = 0; i < cams.length; i++) {
            var camera = cams[i];
            if (!camera) {
                continue;
            }
            var cameraName = camera.name;
            if (this._singleInstance) {
                cameraKey = 0;
            }
            else {
                cameraKey = cameraName;
            }
            if (!this._postProcesses[cameraKey]) {
                var postProcess = this._getPostProcesses();
                if (postProcess) {
                    this._postProcesses[cameraKey] = Array.isArray(postProcess) ? postProcess : [postProcess];
                }
            }
            if (!this._indicesForCamera[cameraName]) {
                this._indicesForCamera[cameraName] = [];
            }
            this._postProcesses[cameraKey].forEach(function (postProcess) {
                var index = camera.attachPostProcess(postProcess);
                _this._indicesForCamera[cameraName].push(index);
            });
            if (!this._cameras[cameraName]) {
                this._cameras[cameraName] = camera;
            }
        }
    };
    /**
     * Detatches the effect on cameras
     * @param cameras The camera to detatch from.
     * @hidden
     */
    PostProcessRenderEffect.prototype._detachCameras = function (cameras) {
        var cams = Tools.MakeArray(cameras || this._cameras);
        if (!cams) {
            return;
        }
        for (var i = 0; i < cams.length; i++) {
            var camera = cams[i];
            var cameraName = camera.name;
            var postProcesses = this._postProcesses[this._singleInstance ? 0 : cameraName];
            if (postProcesses) {
                postProcesses.forEach(function (postProcess) {
                    camera.detachPostProcess(postProcess);
                });
            }
            if (this._cameras[cameraName]) {
                this._cameras[cameraName] = null;
            }
        }
    };
    /**
     * Enables the effect on given cameras
     * @param cameras The camera to enable.
     * @hidden
     */
    PostProcessRenderEffect.prototype._enable = function (cameras) {
        var _this = this;
        var cams = Tools.MakeArray(cameras || this._cameras);
        if (!cams) {
            return;
        }
        for (var i = 0; i < cams.length; i++) {
            var camera = cams[i];
            var cameraName = camera.name;
            for (var j = 0; j < this._indicesForCamera[cameraName].length; j++) {
                if (camera._postProcesses[this._indicesForCamera[cameraName][j]] === undefined || camera._postProcesses[this._indicesForCamera[cameraName][j]] === null) {
                    this._postProcesses[this._singleInstance ? 0 : cameraName].forEach(function (postProcess) {
                        cams[i].attachPostProcess(postProcess, _this._indicesForCamera[cameraName][j]);
                    });
                }
            }
        }
    };
    /**
     * Disables the effect on the given cameras
     * @param cameras The camera to disable.
     * @hidden
     */
    PostProcessRenderEffect.prototype._disable = function (cameras) {
        var cams = Tools.MakeArray(cameras || this._cameras);
        if (!cams) {
            return;
        }
        for (var i = 0; i < cams.length; i++) {
            var camera = cams[i];
            var cameraName = camera.name;
            this._postProcesses[this._singleInstance ? 0 : cameraName].forEach(function (postProcess) {
                camera.detachPostProcess(postProcess);
            });
        }
    };
    /**
     * Gets a list of the post processes contained in the effect.
     * @param camera The camera to get the post processes on.
     * @returns The list of the post processes in the effect.
     */
    PostProcessRenderEffect.prototype.getPostProcesses = function (camera) {
        if (this._singleInstance) {
            return this._postProcesses[0];
        }
        else {
            if (!camera) {
                return null;
            }
            return this._postProcesses[camera.name];
        }
    };
    return PostProcessRenderEffect;
}());

var name$h = 'circleOfConfusionPixelShader';
var shader$h = "\nuniform sampler2D depthSampler;\n\nvarying vec2 vUV;\n\nuniform vec2 cameraMinMaxZ;\n\nuniform float focusDistance;\nuniform float cocPrecalculation;\nvoid main(void)\n{\nfloat depth=texture2D(depthSampler,vUV).r;\nfloat pixelDistance=(cameraMinMaxZ.x+(cameraMinMaxZ.y-cameraMinMaxZ.x)*depth)*1000.0;\nfloat coc=abs(cocPrecalculation* ((focusDistance-pixelDistance)/pixelDistance));\ncoc=clamp(coc,0.0,1.0);\ngl_FragColor=vec4(coc,depth,coc,1.0);\n}\n";
Effect.ShadersStore[name$h] = shader$h;

/**
 * The CircleOfConfusionPostProcess computes the circle of confusion value for each pixel given required lens parameters. See https://en.wikipedia.org/wiki/Circle_of_confusion
 */
var CircleOfConfusionPostProcess = /** @class */ (function (_super) {
    __extends(CircleOfConfusionPostProcess, _super);
    /**
     * Creates a new instance CircleOfConfusionPostProcess
     * @param name The name of the effect.
     * @param depthTexture The depth texture of the scene to compute the circle of confusion. This must be set in order for this to function but may be set after initialization if needed.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    function CircleOfConfusionPostProcess(name, depthTexture, options, camera, samplingMode, engine, reusable, textureType, blockCompilation) {
        if (textureType === void 0) { textureType = 0; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, name, "circleOfConfusion", ["cameraMinMaxZ", "focusDistance", "cocPrecalculation"], ["depthSampler"], options, camera, samplingMode, engine, reusable, null, textureType, undefined, null, blockCompilation) || this;
        /**
         * Max lens size in scene units/1000 (eg. millimeter). Standard cameras are 50mm. (default: 50) The diamater of the resulting aperture can be computed by lensSize/fStop.
         */
        _this.lensSize = 50;
        /**
         * F-Stop of the effect's camera. The diamater of the resulting aperture can be computed by lensSize/fStop. (default: 1.4)
         */
        _this.fStop = 1.4;
        /**
         * Distance away from the camera to focus on in scene units/1000 (eg. millimeter). (default: 2000)
         */
        _this.focusDistance = 2000;
        /**
         * Focal length of the effect's camera in scene units/1000 (eg. millimeter). (default: 50)
         */
        _this.focalLength = 50;
        _this._depthTexture = null;
        _this._depthTexture = depthTexture;
        _this.onApplyObservable.add(function (effect) {
            if (!_this._depthTexture) {
                Logger.Warn("No depth texture set on CircleOfConfusionPostProcess");
                return;
            }
            effect.setTexture("depthSampler", _this._depthTexture);
            // Circle of confusion calculation, See https://developer.nvidia.com/gpugems/GPUGems/gpugems_ch23.html
            var aperture = _this.lensSize / _this.fStop;
            var cocPrecalculation = ((aperture * _this.focalLength) / ((_this.focusDistance - _this.focalLength))); // * ((this.focusDistance - pixelDistance)/pixelDistance) [This part is done in shader]
            effect.setFloat('focusDistance', _this.focusDistance);
            effect.setFloat('cocPrecalculation', cocPrecalculation);
            effect.setFloat2('cameraMinMaxZ', _this._depthTexture.activeCamera.minZ, _this._depthTexture.activeCamera.maxZ);
        });
        return _this;
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "CircleOfConfusionPostProcess" string
     */
    CircleOfConfusionPostProcess.prototype.getClassName = function () {
        return "CircleOfConfusionPostProcess";
    };
    Object.defineProperty(CircleOfConfusionPostProcess.prototype, "depthTexture", {
        /**
         * Depth texture to be used to compute the circle of confusion. This must be set here or in the constructor in order for the post process to function.
         */
        set: function (value) {
            this._depthTexture = value;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        serialize()
    ], CircleOfConfusionPostProcess.prototype, "lensSize", void 0);
    __decorate([
        serialize()
    ], CircleOfConfusionPostProcess.prototype, "fStop", void 0);
    __decorate([
        serialize()
    ], CircleOfConfusionPostProcess.prototype, "focusDistance", void 0);
    __decorate([
        serialize()
    ], CircleOfConfusionPostProcess.prototype, "focalLength", void 0);
    return CircleOfConfusionPostProcess;
}(PostProcess));
_TypeStore.RegisteredTypes["BABYLON.CircleOfConfusionPostProcess"] = CircleOfConfusionPostProcess;

/**
 * The DepthOfFieldBlurPostProcess applied a blur in a give direction.
 * This blur differs from the standard BlurPostProcess as it attempts to avoid blurring pixels
 * based on samples that have a large difference in distance than the center pixel.
 * See section 2.6.2 http://fileadmin.cs.lth.se/cs/education/edan35/lectures/12dof.pdf
 */
var DepthOfFieldBlurPostProcess = /** @class */ (function (_super) {
    __extends(DepthOfFieldBlurPostProcess, _super);
    /**
     * Creates a new instance CircleOfConfusionPostProcess
     * @param name The name of the effect.
     * @param scene The scene the effect belongs to.
     * @param direction The direction the blur should be applied.
     * @param kernel The size of the kernel used to blur.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param circleOfConfusion The circle of confusion + depth map to be used to avoid blurring accross edges
     * @param imageToBlur The image to apply the blur to (default: Current rendered frame)
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    function DepthOfFieldBlurPostProcess(name, scene, direction, kernel, options, camera, circleOfConfusion, imageToBlur, samplingMode, engine, reusable, textureType, blockCompilation) {
        if (imageToBlur === void 0) { imageToBlur = null; }
        if (samplingMode === void 0) { samplingMode = Texture.BILINEAR_SAMPLINGMODE; }
        if (textureType === void 0) { textureType = 0; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, name, direction, kernel, options, camera, samplingMode = 2, engine, reusable, textureType = 0, "#define DOF 1\r\n", blockCompilation) || this;
        _this.direction = direction;
        _this.onApplyObservable.add(function (effect) {
            if (imageToBlur != null) {
                effect.setTextureFromPostProcess("textureSampler", imageToBlur);
            }
            effect.setTextureFromPostProcessOutput("circleOfConfusionSampler", circleOfConfusion);
            if (scene.activeCamera) {
                effect.setFloat2('cameraMinMaxZ', scene.activeCamera.minZ, scene.activeCamera.maxZ);
            }
        });
        return _this;
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "DepthOfFieldBlurPostProcess" string
     */
    DepthOfFieldBlurPostProcess.prototype.getClassName = function () {
        return "DepthOfFieldBlurPostProcess";
    };
    __decorate([
        serialize()
    ], DepthOfFieldBlurPostProcess.prototype, "direction", void 0);
    return DepthOfFieldBlurPostProcess;
}(BlurPostProcess));
_TypeStore.RegisteredTypes["BABYLON.DepthOfFieldBlurPostProcess"] = DepthOfFieldBlurPostProcess;

var name$i = 'depthOfFieldMergePixelShader';
var shader$i = "uniform sampler2D textureSampler;\nvarying vec2 vUV;\nuniform sampler2D circleOfConfusionSampler;\nuniform sampler2D blurStep0;\n#if BLUR_LEVEL>0\nuniform sampler2D blurStep1;\n#endif\n#if BLUR_LEVEL>1\nuniform sampler2D blurStep2;\n#endif\nvoid main(void)\n{\nfloat coc=texture2D(circleOfConfusionSampler,vUV).r;\n#if BLUR_LEVEL == 0\nvec4 original=texture2D(textureSampler,vUV);\nvec4 blurred0=texture2D(blurStep0,vUV);\ngl_FragColor=mix(original,blurred0,coc);\n#endif\n#if BLUR_LEVEL == 1\nif(coc<0.5){\nvec4 original=texture2D(textureSampler,vUV);\nvec4 blurred1=texture2D(blurStep1,vUV);\ngl_FragColor=mix(original,blurred1,coc/0.5);\n}else{\nvec4 blurred0=texture2D(blurStep0,vUV);\nvec4 blurred1=texture2D(blurStep1,vUV);\ngl_FragColor=mix(blurred1,blurred0,(coc-0.5)/0.5);\n}\n#endif\n#if BLUR_LEVEL == 2\nif(coc<0.33){\nvec4 original=texture2D(textureSampler,vUV);\nvec4 blurred2=texture2D(blurStep2,vUV);\ngl_FragColor=mix(original,blurred2,coc/0.33);\n}else if(coc<0.66){\nvec4 blurred1=texture2D(blurStep1,vUV);\nvec4 blurred2=texture2D(blurStep2,vUV);\ngl_FragColor=mix(blurred2,blurred1,(coc-0.33)/0.33);\n}else{\nvec4 blurred0=texture2D(blurStep0,vUV);\nvec4 blurred1=texture2D(blurStep1,vUV);\ngl_FragColor=mix(blurred1,blurred0,(coc-0.66)/0.34);\n}\n#endif\n}\n";
Effect.ShadersStore[name$i] = shader$i;

/**
 * Options to be set when merging outputs from the default pipeline.
 */
var DepthOfFieldMergePostProcessOptions = /** @class */ (function () {
    function DepthOfFieldMergePostProcessOptions() {
    }
    return DepthOfFieldMergePostProcessOptions;
}());
/**
 * The DepthOfFieldMergePostProcess merges blurred images with the original based on the values of the circle of confusion.
 */
var DepthOfFieldMergePostProcess = /** @class */ (function (_super) {
    __extends(DepthOfFieldMergePostProcess, _super);
    /**
     * Creates a new instance of DepthOfFieldMergePostProcess
     * @param name The name of the effect.
     * @param originalFromInput Post process which's input will be used for the merge.
     * @param circleOfConfusion Circle of confusion post process which's output will be used to blur each pixel.
     * @param blurSteps Blur post processes from low to high which will be mixed with the original image.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    function DepthOfFieldMergePostProcess(name, originalFromInput, circleOfConfusion, blurSteps, options, camera, samplingMode, engine, reusable, textureType, blockCompilation) {
        if (textureType === void 0) { textureType = 0; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, name, "depthOfFieldMerge", [], ["circleOfConfusionSampler", "blurStep0", "blurStep1", "blurStep2"], options, camera, samplingMode, engine, reusable, null, textureType, undefined, null, true) || this;
        _this.blurSteps = blurSteps;
        _this.onApplyObservable.add(function (effect) {
            effect.setTextureFromPostProcess("textureSampler", originalFromInput);
            effect.setTextureFromPostProcessOutput("circleOfConfusionSampler", circleOfConfusion);
            blurSteps.forEach(function (step, index) {
                effect.setTextureFromPostProcessOutput("blurStep" + (blurSteps.length - index - 1), step);
            });
        });
        if (!blockCompilation) {
            _this.updateEffect();
        }
        return _this;
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "DepthOfFieldMergePostProcess" string
     */
    DepthOfFieldMergePostProcess.prototype.getClassName = function () {
        return "DepthOfFieldMergePostProcess";
    };
    /**
     * Updates the effect with the current post process compile time values and recompiles the shader.
     * @param defines Define statements that should be added at the beginning of the shader. (default: null)
     * @param uniforms Set of uniform variables that will be passed to the shader. (default: null)
     * @param samplers Set of Texture2D variables that will be passed to the shader. (default: null)
     * @param indexParameters The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
     * @param onCompiled Called when the shader has been compiled.
     * @param onError Called if there is an error when compiling a shader.
     */
    DepthOfFieldMergePostProcess.prototype.updateEffect = function (defines, uniforms, samplers, indexParameters, onCompiled, onError) {
        if (defines === void 0) { defines = null; }
        if (uniforms === void 0) { uniforms = null; }
        if (samplers === void 0) { samplers = null; }
        if (!defines) {
            defines = "";
            defines += "#define BLUR_LEVEL " + (this.blurSteps.length - 1) + "\n";
        }
        _super.prototype.updateEffect.call(this, defines, uniforms, samplers, indexParameters, onCompiled, onError);
    };
    return DepthOfFieldMergePostProcess;
}(PostProcess));

/**
 * Specifies the level of max blur that should be applied when using the depth of field effect
 */
var DepthOfFieldEffectBlurLevel;
(function (DepthOfFieldEffectBlurLevel) {
    /**
     * Subtle blur
     */
    DepthOfFieldEffectBlurLevel[DepthOfFieldEffectBlurLevel["Low"] = 0] = "Low";
    /**
     * Medium blur
     */
    DepthOfFieldEffectBlurLevel[DepthOfFieldEffectBlurLevel["Medium"] = 1] = "Medium";
    /**
     * Large blur
     */
    DepthOfFieldEffectBlurLevel[DepthOfFieldEffectBlurLevel["High"] = 2] = "High";
})(DepthOfFieldEffectBlurLevel || (DepthOfFieldEffectBlurLevel = {}));
/**
 * The depth of field effect applies a blur to objects that are closer or further from where the camera is focusing.
 */
var DepthOfFieldEffect = /** @class */ (function (_super) {
    __extends(DepthOfFieldEffect, _super);
    /**
     * Creates a new instance DepthOfFieldEffect
     * @param scene The scene the effect belongs to.
     * @param depthTexture The depth texture of the scene to compute the circle of confusion.This must be set in order for this to function but may be set after initialization if needed.
     * @param pipelineTextureType The type of texture to be used when performing the post processing.
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    function DepthOfFieldEffect(scene, depthTexture, blurLevel, pipelineTextureType, blockCompilation) {
        if (blurLevel === void 0) { blurLevel = DepthOfFieldEffectBlurLevel.Low; }
        if (pipelineTextureType === void 0) { pipelineTextureType = 0; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, scene.getEngine(), "depth of field", function () {
            return _this._effects;
        }, true) || this;
        /**
         * @hidden Internal post processes in depth of field effect
         */
        _this._effects = [];
        // Circle of confusion value for each pixel is used to determine how much to blur that pixel
        _this._circleOfConfusion = new CircleOfConfusionPostProcess("circleOfConfusion", depthTexture, 1, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, pipelineTextureType, blockCompilation);
        // Create a pyramid of blurred images (eg. fullSize 1/4 blur, half size 1/2 blur, quarter size 3/4 blur, eith size 4/4 blur)
        // Blur the image but do not blur on sharp far to near distance changes to avoid bleeding artifacts
        // See section 2.6.2 http://fileadmin.cs.lth.se/cs/education/edan35/lectures/12dof.pdf
        _this._depthOfFieldBlurY = [];
        _this._depthOfFieldBlurX = [];
        var blurCount = 1;
        var kernelSize = 15;
        switch (blurLevel) {
            case DepthOfFieldEffectBlurLevel.High: {
                blurCount = 3;
                kernelSize = 51;
                break;
            }
            case DepthOfFieldEffectBlurLevel.Medium: {
                blurCount = 2;
                kernelSize = 31;
                break;
            }
            default: {
                kernelSize = 15;
                blurCount = 1;
                break;
            }
        }
        var adjustedKernelSize = kernelSize / Math.pow(2, blurCount - 1);
        var ratio = 1.0;
        for (var i = 0; i < blurCount; i++) {
            var blurY = new DepthOfFieldBlurPostProcess("verticle blur", scene, new Vector2(0, 1.0), adjustedKernelSize, ratio, null, _this._circleOfConfusion, i == 0 ? _this._circleOfConfusion : null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, pipelineTextureType, blockCompilation);
            blurY.autoClear = false;
            ratio = 0.75 / Math.pow(2, i);
            var blurX = new DepthOfFieldBlurPostProcess("horizontal blur", scene, new Vector2(1.0, 0), adjustedKernelSize, ratio, null, _this._circleOfConfusion, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, pipelineTextureType, blockCompilation);
            blurX.autoClear = false;
            _this._depthOfFieldBlurY.push(blurY);
            _this._depthOfFieldBlurX.push(blurX);
        }
        // Set all post processes on the effect.
        _this._effects = [_this._circleOfConfusion];
        for (var i = 0; i < _this._depthOfFieldBlurX.length; i++) {
            _this._effects.push(_this._depthOfFieldBlurY[i]);
            _this._effects.push(_this._depthOfFieldBlurX[i]);
        }
        // Merge blurred images with original image based on circleOfConfusion
        _this._dofMerge = new DepthOfFieldMergePostProcess("dofMerge", _this._circleOfConfusion, _this._circleOfConfusion, _this._depthOfFieldBlurX, ratio, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, pipelineTextureType, blockCompilation);
        _this._dofMerge.autoClear = false;
        _this._effects.push(_this._dofMerge);
        return _this;
    }
    Object.defineProperty(DepthOfFieldEffect.prototype, "focalLength", {
        get: function () {
            return this._circleOfConfusion.focalLength;
        },
        /**
         * The focal the length of the camera used in the effect in scene units/1000 (eg. millimeter)
         */
        set: function (value) {
            this._circleOfConfusion.focalLength = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DepthOfFieldEffect.prototype, "fStop", {
        get: function () {
            return this._circleOfConfusion.fStop;
        },
        /**
         * F-Stop of the effect's camera. The diameter of the resulting aperture can be computed by lensSize/fStop. (default: 1.4)
         */
        set: function (value) {
            this._circleOfConfusion.fStop = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DepthOfFieldEffect.prototype, "focusDistance", {
        get: function () {
            return this._circleOfConfusion.focusDistance;
        },
        /**
         * Distance away from the camera to focus on in scene units/1000 (eg. millimeter). (default: 2000)
         */
        set: function (value) {
            this._circleOfConfusion.focusDistance = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DepthOfFieldEffect.prototype, "lensSize", {
        get: function () {
            return this._circleOfConfusion.lensSize;
        },
        /**
         * Max lens size in scene units/1000 (eg. millimeter). Standard cameras are 50mm. (default: 50) The diamater of the resulting aperture can be computed by lensSize/fStop.
         */
        set: function (value) {
            this._circleOfConfusion.lensSize = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
    * Get the current class name of the current effet
    * @returns "DepthOfFieldEffect"
    */
    DepthOfFieldEffect.prototype.getClassName = function () {
        return "DepthOfFieldEffect";
    };
    Object.defineProperty(DepthOfFieldEffect.prototype, "depthTexture", {
        /**
         * Depth texture to be used to compute the circle of confusion. This must be set here or in the constructor in order for the post process to function.
         */
        set: function (value) {
            this._circleOfConfusion.depthTexture = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Disposes each of the internal effects for a given camera.
     * @param camera The camera to dispose the effect on.
     */
    DepthOfFieldEffect.prototype.disposeEffects = function (camera) {
        for (var effectIndex = 0; effectIndex < this._effects.length; effectIndex++) {
            this._effects[effectIndex].dispose(camera);
        }
    };
    /**
     * @hidden Internal
     */
    DepthOfFieldEffect.prototype._updateEffects = function () {
        for (var effectIndex = 0; effectIndex < this._effects.length; effectIndex++) {
            this._effects[effectIndex].updateEffect();
        }
    };
    /**
     * Internal
     * @returns if all the contained post processes are ready.
     * @hidden
     */
    DepthOfFieldEffect.prototype._isReady = function () {
        for (var effectIndex = 0; effectIndex < this._effects.length; effectIndex++) {
            if (!this._effects[effectIndex].isReady()) {
                return false;
            }
        }
        return true;
    };
    return DepthOfFieldEffect;
}(PostProcessRenderEffect));

var name$j = 'extractHighlightsPixelShader';
var shader$j = "#include<helperFunctions>\n\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\nuniform float threshold;\nuniform float exposure;\nvoid main(void)\n{\ngl_FragColor=texture2D(textureSampler,vUV);\nfloat luma=getLuminance(gl_FragColor.rgb*exposure);\ngl_FragColor.rgb=step(threshold,luma)*gl_FragColor.rgb;\n}";
Effect.ShadersStore[name$j] = shader$j;

/**
 * The extract highlights post process sets all pixels to black except pixels above the specified luminance threshold. Used as the first step for a bloom effect.
 */
var ExtractHighlightsPostProcess = /** @class */ (function (_super) {
    __extends(ExtractHighlightsPostProcess, _super);
    function ExtractHighlightsPostProcess(name, options, camera, samplingMode, engine, reusable, textureType, blockCompilation) {
        if (textureType === void 0) { textureType = 0; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, name, "extractHighlights", ["threshold", "exposure"], null, options, camera, samplingMode, engine, reusable, null, textureType, undefined, null, blockCompilation) || this;
        /**
         * The luminance threshold, pixels below this value will be set to black.
         */
        _this.threshold = 0.9;
        /** @hidden */
        _this._exposure = 1;
        /**
         * Post process which has the input texture to be used when performing highlight extraction
         * @hidden
         */
        _this._inputPostProcess = null;
        _this.onApplyObservable.add(function (effect) {
            if (_this._inputPostProcess) {
                effect.setTextureFromPostProcess("textureSampler", _this._inputPostProcess);
            }
            effect.setFloat('threshold', Math.pow(_this.threshold, ToGammaSpace));
            effect.setFloat('exposure', _this._exposure);
        });
        return _this;
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "ExtractHighlightsPostProcess" string
     */
    ExtractHighlightsPostProcess.prototype.getClassName = function () {
        return "ExtractHighlightsPostProcess";
    };
    __decorate([
        serialize()
    ], ExtractHighlightsPostProcess.prototype, "threshold", void 0);
    return ExtractHighlightsPostProcess;
}(PostProcess));
_TypeStore.RegisteredTypes["BABYLON.ExtractHighlightsPostProcess"] = ExtractHighlightsPostProcess;

var name$k = 'bloomMergePixelShader';
var shader$k = "uniform sampler2D textureSampler;\nuniform sampler2D bloomBlur;\nvarying vec2 vUV;\nuniform float bloomWeight;\nvoid main(void)\n{\ngl_FragColor=texture2D(textureSampler,vUV);\nvec3 blurred=texture2D(bloomBlur,vUV).rgb;\ngl_FragColor.rgb=gl_FragColor.rgb+(blurred.rgb*bloomWeight);\n}\n";
Effect.ShadersStore[name$k] = shader$k;

/**
 * The BloomMergePostProcess merges blurred images with the original based on the values of the circle of confusion.
 */
var BloomMergePostProcess = /** @class */ (function (_super) {
    __extends(BloomMergePostProcess, _super);
    /**
     * Creates a new instance of @see BloomMergePostProcess
     * @param name The name of the effect.
     * @param originalFromInput Post process which's input will be used for the merge.
     * @param blurred Blurred highlights post process which's output will be used.
     * @param weight Weight of the bloom to be added to the original input.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    function BloomMergePostProcess(name, originalFromInput, blurred, 
    /** Weight of the bloom to be added to the original input. */
    weight, options, camera, samplingMode, engine, reusable, textureType, blockCompilation) {
        if (textureType === void 0) { textureType = 0; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, name, "bloomMerge", ["bloomWeight"], ["circleOfConfusionSampler", "blurStep0", "blurStep1", "blurStep2", "bloomBlur"], options, camera, samplingMode, engine, reusable, null, textureType, undefined, null, true) || this;
        /** Weight of the bloom to be added to the original input. */
        _this.weight = 1;
        _this.weight = weight;
        _this.onApplyObservable.add(function (effect) {
            effect.setTextureFromPostProcess("textureSampler", originalFromInput);
            effect.setTextureFromPostProcessOutput("bloomBlur", blurred);
            effect.setFloat("bloomWeight", _this.weight);
        });
        if (!blockCompilation) {
            _this.updateEffect();
        }
        return _this;
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "BloomMergePostProcess" string
     */
    BloomMergePostProcess.prototype.getClassName = function () {
        return "BloomMergePostProcess";
    };
    __decorate([
        serialize()
    ], BloomMergePostProcess.prototype, "weight", void 0);
    return BloomMergePostProcess;
}(PostProcess));
_TypeStore.RegisteredTypes["BABYLON.BloomMergePostProcess"] = BloomMergePostProcess;

/**
 * The bloom effect spreads bright areas of an image to simulate artifacts seen in cameras
 */
var BloomEffect = /** @class */ (function (_super) {
    __extends(BloomEffect, _super);
    /**
     * Creates a new instance of @see BloomEffect
     * @param scene The scene the effect belongs to.
     * @param bloomScale The ratio of the blur texture to the input texture that should be used to compute the bloom.
     * @param bloomKernel The size of the kernel to be used when applying the blur.
     * @param bloomWeight The the strength of bloom.
     * @param pipelineTextureType The type of texture to be used when performing the post processing.
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    function BloomEffect(scene, bloomScale, bloomWeight, bloomKernel, pipelineTextureType, blockCompilation) {
        if (pipelineTextureType === void 0) { pipelineTextureType = 0; }
        if (blockCompilation === void 0) { blockCompilation = false; }
        var _this = _super.call(this, scene.getEngine(), "bloom", function () {
            return _this._effects;
        }, true) || this;
        _this.bloomScale = bloomScale;
        /**
         * @hidden Internal
         */
        _this._effects = [];
        _this._downscale = new ExtractHighlightsPostProcess("highlights", 1.0, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, pipelineTextureType, blockCompilation);
        _this._blurX = new BlurPostProcess("horizontal blur", new Vector2(1.0, 0), 10.0, bloomScale, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, pipelineTextureType, undefined, blockCompilation);
        _this._blurX.alwaysForcePOT = true;
        _this._blurX.autoClear = false;
        _this._blurY = new BlurPostProcess("vertical blur", new Vector2(0, 1.0), 10.0, bloomScale, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, pipelineTextureType, undefined, blockCompilation);
        _this._blurY.alwaysForcePOT = true;
        _this._blurY.autoClear = false;
        _this.kernel = bloomKernel;
        _this._effects = [_this._downscale, _this._blurX, _this._blurY];
        _this._merge = new BloomMergePostProcess("bloomMerge", _this._downscale, _this._blurY, bloomWeight, bloomScale, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, pipelineTextureType, blockCompilation);
        _this._merge.autoClear = false;
        _this._effects.push(_this._merge);
        return _this;
    }
    Object.defineProperty(BloomEffect.prototype, "threshold", {
        /**
         * The luminance threshold to find bright areas of the image to bloom.
         */
        get: function () {
            return this._downscale.threshold;
        },
        set: function (value) {
            this._downscale.threshold = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BloomEffect.prototype, "weight", {
        /**
         * The strength of the bloom.
         */
        get: function () {
            return this._merge.weight;
        },
        set: function (value) {
            this._merge.weight = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BloomEffect.prototype, "kernel", {
        /**
         * Specifies the size of the bloom blur kernel, relative to the final output size
         */
        get: function () {
            return this._blurX.kernel / this.bloomScale;
        },
        set: function (value) {
            this._blurX.kernel = value * this.bloomScale;
            this._blurY.kernel = value * this.bloomScale;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Disposes each of the internal effects for a given camera.
     * @param camera The camera to dispose the effect on.
     */
    BloomEffect.prototype.disposeEffects = function (camera) {
        for (var effectIndex = 0; effectIndex < this._effects.length; effectIndex++) {
            this._effects[effectIndex].dispose(camera);
        }
    };
    /**
     * @hidden Internal
     */
    BloomEffect.prototype._updateEffects = function () {
        for (var effectIndex = 0; effectIndex < this._effects.length; effectIndex++) {
            this._effects[effectIndex].updateEffect();
        }
    };
    /**
     * Internal
     * @returns if all the contained post processes are ready.
     * @hidden
     */
    BloomEffect.prototype._isReady = function () {
        for (var effectIndex = 0; effectIndex < this._effects.length; effectIndex++) {
            if (!this._effects[effectIndex].isReady()) {
                return false;
            }
        }
        return true;
    };
    return BloomEffect;
}(PostProcessRenderEffect));

/**
 * PostProcessRenderPipelineManager class
 * @see https://doc.babylonjs.com/how_to/how_to_use_postprocessrenderpipeline
 */
var PostProcessRenderPipelineManager = /** @class */ (function () {
    /**
     * Initializes a PostProcessRenderPipelineManager
     * @see https://doc.babylonjs.com/how_to/how_to_use_postprocessrenderpipeline
     */
    function PostProcessRenderPipelineManager() {
        this._renderPipelines = {};
    }
    Object.defineProperty(PostProcessRenderPipelineManager.prototype, "supportedPipelines", {
        /**
         * Gets the list of supported render pipelines
         */
        get: function () {
            var result = [];
            for (var renderPipelineName in this._renderPipelines) {
                if (this._renderPipelines.hasOwnProperty(renderPipelineName)) {
                    var pipeline = this._renderPipelines[renderPipelineName];
                    if (pipeline.isSupported) {
                        result.push(pipeline);
                    }
                }
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds a pipeline to the manager
     * @param renderPipeline The pipeline to add
     */
    PostProcessRenderPipelineManager.prototype.addPipeline = function (renderPipeline) {
        this._renderPipelines[renderPipeline._name] = renderPipeline;
    };
    /**
     * Attaches a camera to the pipeline
     * @param renderPipelineName The name of the pipeline to attach to
     * @param cameras the camera to attach
     * @param unique if the camera can be attached multiple times to the pipeline
     */
    PostProcessRenderPipelineManager.prototype.attachCamerasToRenderPipeline = function (renderPipelineName, cameras, unique) {
        if (unique === void 0) { unique = false; }
        var renderPipeline = this._renderPipelines[renderPipelineName];
        if (!renderPipeline) {
            return;
        }
        renderPipeline._attachCameras(cameras, unique);
    };
    /**
     * Detaches a camera from the pipeline
     * @param renderPipelineName The name of the pipeline to detach from
     * @param cameras the camera to detach
     */
    PostProcessRenderPipelineManager.prototype.detachCamerasFromRenderPipeline = function (renderPipelineName, cameras) {
        var renderPipeline = this._renderPipelines[renderPipelineName];
        if (!renderPipeline) {
            return;
        }
        renderPipeline._detachCameras(cameras);
    };
    /**
     * Enables an effect by name on a pipeline
     * @param renderPipelineName the name of the pipeline to enable the effect in
     * @param renderEffectName the name of the effect to enable
     * @param cameras the cameras that the effect should be enabled on
     */
    PostProcessRenderPipelineManager.prototype.enableEffectInPipeline = function (renderPipelineName, renderEffectName, cameras) {
        var renderPipeline = this._renderPipelines[renderPipelineName];
        if (!renderPipeline) {
            return;
        }
        renderPipeline._enableEffect(renderEffectName, cameras);
    };
    /**
     * Disables an effect by name on a pipeline
     * @param renderPipelineName the name of the pipeline to disable the effect in
     * @param renderEffectName the name of the effect to disable
     * @param cameras the cameras that the effect should be disabled on
     */
    PostProcessRenderPipelineManager.prototype.disableEffectInPipeline = function (renderPipelineName, renderEffectName, cameras) {
        var renderPipeline = this._renderPipelines[renderPipelineName];
        if (!renderPipeline) {
            return;
        }
        renderPipeline._disableEffect(renderEffectName, cameras);
    };
    /**
     * Updates the state of all contained render pipelines and disposes of any non supported pipelines
     */
    PostProcessRenderPipelineManager.prototype.update = function () {
        for (var renderPipelineName in this._renderPipelines) {
            if (this._renderPipelines.hasOwnProperty(renderPipelineName)) {
                var pipeline = this._renderPipelines[renderPipelineName];
                if (!pipeline.isSupported) {
                    pipeline.dispose();
                    delete this._renderPipelines[renderPipelineName];
                }
                else {
                    pipeline._update();
                }
            }
        }
    };
    /** @hidden */
    PostProcessRenderPipelineManager.prototype._rebuild = function () {
        for (var renderPipelineName in this._renderPipelines) {
            if (this._renderPipelines.hasOwnProperty(renderPipelineName)) {
                var pipeline = this._renderPipelines[renderPipelineName];
                pipeline._rebuild();
            }
        }
    };
    /**
     * Disposes of the manager and pipelines
     */
    PostProcessRenderPipelineManager.prototype.dispose = function () {
        for (var renderPipelineName in this._renderPipelines) {
            if (this._renderPipelines.hasOwnProperty(renderPipelineName)) {
                var pipeline = this._renderPipelines[renderPipelineName];
                pipeline.dispose();
            }
        }
    };
    return PostProcessRenderPipelineManager;
}());

Object.defineProperty(Scene.prototype, "postProcessRenderPipelineManager", {
    get: function () {
        if (!this._postProcessRenderPipelineManager) {
            // Register the G Buffer component to the scene.
            var component = this._getComponent(SceneComponentConstants.NAME_POSTPROCESSRENDERPIPELINEMANAGER);
            if (!component) {
                component = new PostProcessRenderPipelineManagerSceneComponent(this);
                this._addComponent(component);
            }
            this._postProcessRenderPipelineManager = new PostProcessRenderPipelineManager();
        }
        return this._postProcessRenderPipelineManager;
    },
    enumerable: true,
    configurable: true
});
/**
 * Defines the Render Pipeline scene component responsible to rendering pipelines
 */
var PostProcessRenderPipelineManagerSceneComponent = /** @class */ (function () {
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    function PostProcessRenderPipelineManagerSceneComponent(scene) {
        /**
         * The component name helpfull to identify the component in the list of scene components.
         */
        this.name = SceneComponentConstants.NAME_POSTPROCESSRENDERPIPELINEMANAGER;
        this.scene = scene;
    }
    /**
     * Registers the component in a given scene
     */
    PostProcessRenderPipelineManagerSceneComponent.prototype.register = function () {
        this.scene._gatherRenderTargetsStage.registerStep(SceneComponentConstants.STEP_GATHERRENDERTARGETS_POSTPROCESSRENDERPIPELINEMANAGER, this, this._gatherRenderTargets);
    };
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    PostProcessRenderPipelineManagerSceneComponent.prototype.rebuild = function () {
        if (this.scene._postProcessRenderPipelineManager) {
            this.scene._postProcessRenderPipelineManager._rebuild();
        }
    };
    /**
     * Disposes the component and the associated ressources
     */
    PostProcessRenderPipelineManagerSceneComponent.prototype.dispose = function () {
        if (this.scene._postProcessRenderPipelineManager) {
            this.scene._postProcessRenderPipelineManager.dispose();
        }
    };
    PostProcessRenderPipelineManagerSceneComponent.prototype._gatherRenderTargets = function () {
        if (this.scene._postProcessRenderPipelineManager) {
            this.scene._postProcessRenderPipelineManager.update();
        }
    };
    return PostProcessRenderPipelineManagerSceneComponent;
}());

/**
 * The default rendering pipeline can be added to a scene to apply common post processing effects such as anti-aliasing or depth of field.
 * See https://doc.babylonjs.com/how_to/using_default_rendering_pipeline
 */
var DefaultRenderingPipeline = /** @class */ (function (_super) {
    __extends(DefaultRenderingPipeline, _super);
    /**
     * @constructor
     * @param name - The rendering pipeline name (default: "")
     * @param hdr - If high dynamic range textures should be used (default: true)
     * @param scene - The scene linked to this pipeline (default: the last created scene)
     * @param cameras - The array of cameras that the rendering pipeline will be attached to (default: scene.cameras)
     * @param automaticBuild - if false, you will have to manually call prepare() to update the pipeline (default: true)
     */
    function DefaultRenderingPipeline(name, hdr, scene, cameras, automaticBuild) {
        if (name === void 0) { name = ""; }
        if (hdr === void 0) { hdr = true; }
        if (scene === void 0) { scene = EngineStore.LastCreatedScene; }
        if (automaticBuild === void 0) { automaticBuild = true; }
        var _this = _super.call(this, scene.getEngine(), name) || this;
        _this._camerasToBeAttached = [];
        /**
         * ID of the sharpen post process,
         */
        _this.SharpenPostProcessId = "SharpenPostProcessEffect";
        /**
         * @ignore
         * ID of the image processing post process;
         */
        _this.ImageProcessingPostProcessId = "ImageProcessingPostProcessEffect";
        /**
         * @ignore
         * ID of the Fast Approximate Anti-Aliasing post process;
         */
        _this.FxaaPostProcessId = "FxaaPostProcessEffect";
        /**
         * ID of the chromatic aberration post process,
         */
        _this.ChromaticAberrationPostProcessId = "ChromaticAberrationPostProcessEffect";
        /**
         * ID of the grain post process
         */
        _this.GrainPostProcessId = "GrainPostProcessEffect";
        /**
         * Glow post process which adds a glow to emissive areas of the image
         */
        _this._glowLayer = null;
        /**
         * Animations which can be used to tweak settings over a period of time
         */
        _this.animations = [];
        _this._imageProcessingConfigurationObserver = null;
        // Values
        _this._sharpenEnabled = false;
        _this._bloomEnabled = false;
        _this._depthOfFieldEnabled = false;
        _this._depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low;
        _this._fxaaEnabled = false;
        _this._imageProcessingEnabled = true;
        _this._bloomScale = 0.5;
        _this._chromaticAberrationEnabled = false;
        _this._grainEnabled = false;
        _this._buildAllowed = true;
        /**
         * This is triggered each time the pipeline has been built.
         */
        _this.onBuildObservable = new Observable();
        _this._resizeObserver = null;
        _this._hardwareScaleLevel = 1.0;
        _this._bloomKernel = 64;
        /**
         * Specifies the weight of the bloom in the final rendering
         */
        _this._bloomWeight = 0.15;
        /**
         * Specifies the luma threshold for the area that will be blurred by the bloom
         */
        _this._bloomThreshold = 0.9;
        _this._samples = 1;
        _this._hasCleared = false;
        _this._prevPostProcess = null;
        _this._prevPrevPostProcess = null;
        _this._depthOfFieldSceneObserver = null;
        _this._cameras = cameras || scene.cameras;
        _this._cameras = _this._cameras.slice();
        _this._camerasToBeAttached = _this._cameras.slice();
        _this._buildAllowed = automaticBuild;
        // Initialize
        _this._scene = scene;
        var caps = _this._scene.getEngine().getCaps();
        _this._hdr = hdr && (caps.textureHalfFloatRender || caps.textureFloatRender);
        // Misc
        if (_this._hdr) {
            if (caps.textureHalfFloatRender) {
                _this._defaultPipelineTextureType = 2;
            }
            else if (caps.textureFloatRender) {
                _this._defaultPipelineTextureType = 1;
            }
        }
        else {
            _this._defaultPipelineTextureType = 0;
        }
        // Attach
        scene.postProcessRenderPipelineManager.addPipeline(_this);
        var engine = _this._scene.getEngine();
        // Create post processes before hand so they can be modified before enabled.
        // Block compilation flag is set to true to avoid compilation prior to use, these will be updated on first use in build pipeline.
        _this.sharpen = new SharpenPostProcess("sharpen", 1.0, null, Texture.BILINEAR_SAMPLINGMODE, engine, false, _this._defaultPipelineTextureType, true);
        _this._sharpenEffect = new PostProcessRenderEffect(engine, _this.SharpenPostProcessId, function () { return _this.sharpen; }, true);
        _this.depthOfField = new DepthOfFieldEffect(_this._scene, null, _this._depthOfFieldBlurLevel, _this._defaultPipelineTextureType, true);
        _this.bloom = new BloomEffect(_this._scene, _this._bloomScale, _this._bloomWeight, _this.bloomKernel, _this._defaultPipelineTextureType, true);
        _this.chromaticAberration = new ChromaticAberrationPostProcess("ChromaticAberration", engine.getRenderWidth(), engine.getRenderHeight(), 1.0, null, Texture.BILINEAR_SAMPLINGMODE, engine, false, _this._defaultPipelineTextureType, true);
        _this._chromaticAberrationEffect = new PostProcessRenderEffect(engine, _this.ChromaticAberrationPostProcessId, function () { return _this.chromaticAberration; }, true);
        _this.grain = new GrainPostProcess("Grain", 1.0, null, Texture.BILINEAR_SAMPLINGMODE, engine, false, _this._defaultPipelineTextureType, true);
        _this._grainEffect = new PostProcessRenderEffect(engine, _this.GrainPostProcessId, function () { return _this.grain; }, true);
        _this._resizeObserver = engine.onResizeObservable.add(function () {
            _this._hardwareScaleLevel = engine.getHardwareScalingLevel();
            _this.bloomKernel = _this.bloomKernel;
        });
        _this._imageProcessingConfigurationObserver = _this._scene.imageProcessingConfiguration.onUpdateParameters.add(function () {
            _this.bloom._downscale._exposure = _this._scene.imageProcessingConfiguration.exposure;
            if (_this.imageProcessingEnabled !== _this._scene.imageProcessingConfiguration.isEnabled) {
                _this._imageProcessingEnabled = _this._scene.imageProcessingConfiguration.isEnabled;
                _this._buildPipeline();
            }
        });
        _this._buildPipeline();
        return _this;
    }
    Object.defineProperty(DefaultRenderingPipeline.prototype, "scene", {
        /**
         * Gets active scene
         */
        get: function () {
            return this._scene;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "sharpenEnabled", {
        get: function () {
            return this._sharpenEnabled;
        },
        /**
         * Enable or disable the sharpen process from the pipeline
         */
        set: function (enabled) {
            if (this._sharpenEnabled === enabled) {
                return;
            }
            this._sharpenEnabled = enabled;
            this._buildPipeline();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomKernel", {
        /**
         * Specifies the size of the bloom blur kernel, relative to the final output size
         */
        get: function () {
            return this._bloomKernel;
        },
        set: function (value) {
            this._bloomKernel = value;
            this.bloom.kernel = value / this._hardwareScaleLevel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomWeight", {
        get: function () {
            return this._bloomWeight;
        },
        /**
         * The strength of the bloom.
         */
        set: function (value) {
            if (this._bloomWeight === value) {
                return;
            }
            this.bloom.weight = value;
            this._bloomWeight = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomThreshold", {
        get: function () {
            return this._bloomThreshold;
        },
        /**
         * The strength of the bloom.
         */
        set: function (value) {
            if (this._bloomThreshold === value) {
                return;
            }
            this.bloom.threshold = value;
            this._bloomThreshold = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomScale", {
        get: function () {
            return this._bloomScale;
        },
        /**
         * The scale of the bloom, lower value will provide better performance.
         */
        set: function (value) {
            if (this._bloomScale === value) {
                return;
            }
            this._bloomScale = value;
            // recreate bloom and dispose old as this setting is not dynamic
            this._rebuildBloom();
            this._buildPipeline();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomEnabled", {
        get: function () {
            return this._bloomEnabled;
        },
        /**
         * Enable or disable the bloom from the pipeline
         */
        set: function (enabled) {
            if (this._bloomEnabled === enabled) {
                return;
            }
            this._bloomEnabled = enabled;
            this._buildPipeline();
        },
        enumerable: false,
        configurable: true
    });
    DefaultRenderingPipeline.prototype._rebuildBloom = function () {
        // recreate bloom and dispose old as this setting is not dynamic
        var oldBloom = this.bloom;
        this.bloom = new BloomEffect(this._scene, this.bloomScale, this._bloomWeight, this.bloomKernel, this._defaultPipelineTextureType, false);
        this.bloom.threshold = oldBloom.threshold;
        for (var i = 0; i < this._cameras.length; i++) {
            oldBloom.disposeEffects(this._cameras[i]);
        }
    };
    Object.defineProperty(DefaultRenderingPipeline.prototype, "depthOfFieldEnabled", {
        /**
         * If the depth of field is enabled.
         */
        get: function () {
            return this._depthOfFieldEnabled;
        },
        set: function (enabled) {
            if (this._depthOfFieldEnabled === enabled) {
                return;
            }
            this._depthOfFieldEnabled = enabled;
            this._buildPipeline();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "depthOfFieldBlurLevel", {
        /**
         * Blur level of the depth of field effect. (Higher blur will effect performance)
         */
        get: function () {
            return this._depthOfFieldBlurLevel;
        },
        set: function (value) {
            if (this._depthOfFieldBlurLevel === value) {
                return;
            }
            this._depthOfFieldBlurLevel = value;
            // recreate dof and dispose old as this setting is not dynamic
            var oldDof = this.depthOfField;
            this.depthOfField = new DepthOfFieldEffect(this._scene, null, this._depthOfFieldBlurLevel, this._defaultPipelineTextureType, false);
            this.depthOfField.focalLength = oldDof.focalLength;
            this.depthOfField.focusDistance = oldDof.focusDistance;
            this.depthOfField.fStop = oldDof.fStop;
            this.depthOfField.lensSize = oldDof.lensSize;
            for (var i = 0; i < this._cameras.length; i++) {
                oldDof.disposeEffects(this._cameras[i]);
            }
            this._buildPipeline();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "fxaaEnabled", {
        get: function () {
            return this._fxaaEnabled;
        },
        /**
         * If the anti aliasing is enabled.
         */
        set: function (enabled) {
            if (this._fxaaEnabled === enabled) {
                return;
            }
            this._fxaaEnabled = enabled;
            this._buildPipeline();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "samples", {
        get: function () {
            return this._samples;
        },
        /**
         * MSAA sample count, setting this to 4 will provide 4x anti aliasing. (default: 1)
         */
        set: function (sampleCount) {
            if (this._samples === sampleCount) {
                return;
            }
            this._samples = sampleCount;
            this._buildPipeline();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "imageProcessingEnabled", {
        get: function () {
            return this._imageProcessingEnabled;
        },
        /**
         * If image processing is enabled.
         */
        set: function (enabled) {
            if (this._imageProcessingEnabled === enabled) {
                return;
            }
            this._scene.imageProcessingConfiguration.isEnabled = enabled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "glowLayerEnabled", {
        get: function () {
            return this._glowLayer != null;
        },
        /**
         * If glow layer is enabled. (Adds a glow effect to emmissive materials)
         */
        set: function (enabled) {
            if (enabled && !this._glowLayer) {
                this._glowLayer = new GlowLayer("", this._scene);
            }
            else if (!enabled && this._glowLayer) {
                this._glowLayer.dispose();
                this._glowLayer = null;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "glowLayer", {
        /**
         * Gets the glow layer (or null if not defined)
         */
        get: function () {
            return this._glowLayer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "chromaticAberrationEnabled", {
        get: function () {
            return this._chromaticAberrationEnabled;
        },
        /**
         * Enable or disable the chromaticAberration process from the pipeline
         */
        set: function (enabled) {
            if (this._chromaticAberrationEnabled === enabled) {
                return;
            }
            this._chromaticAberrationEnabled = enabled;
            this._buildPipeline();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DefaultRenderingPipeline.prototype, "grainEnabled", {
        get: function () {
            return this._grainEnabled;
        },
        /**
         * Enable or disable the grain process from the pipeline
         */
        set: function (enabled) {
            if (this._grainEnabled === enabled) {
                return;
            }
            this._grainEnabled = enabled;
            this._buildPipeline();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the class name
     * @returns "DefaultRenderingPipeline"
     */
    DefaultRenderingPipeline.prototype.getClassName = function () {
        return "DefaultRenderingPipeline";
    };
    /**
     * Force the compilation of the entire pipeline.
     */
    DefaultRenderingPipeline.prototype.prepare = function () {
        var previousState = this._buildAllowed;
        this._buildAllowed = true;
        this._buildPipeline();
        this._buildAllowed = previousState;
    };
    DefaultRenderingPipeline.prototype._setAutoClearAndTextureSharing = function (postProcess, skipTextureSharing) {
        if (skipTextureSharing === void 0) { skipTextureSharing = false; }
        if (this._hasCleared) {
            postProcess.autoClear = false;
        }
        else {
            postProcess.autoClear = true;
            this._scene.autoClear = false;
            this._hasCleared = true;
        }
        if (!skipTextureSharing) {
            if (this._prevPrevPostProcess) {
                postProcess.shareOutputWith(this._prevPrevPostProcess);
            }
            else {
                postProcess.useOwnOutput();
            }
            if (this._prevPostProcess) {
                this._prevPrevPostProcess = this._prevPostProcess;
            }
            this._prevPostProcess = postProcess;
        }
    };
    DefaultRenderingPipeline.prototype._buildPipeline = function () {
        var _this = this;
        if (!this._buildAllowed) {
            return;
        }
        this._scene.autoClear = true;
        var engine = this._scene.getEngine();
        this._disposePostProcesses();
        if (this._cameras !== null) {
            this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
            // get back cameras to be used to reattach pipeline
            this._cameras = this._camerasToBeAttached.slice();
        }
        this._reset();
        this._prevPostProcess = null;
        this._prevPrevPostProcess = null;
        this._hasCleared = false;
        if (this.depthOfFieldEnabled) {
            // Multi camera suport
            if (this._cameras.length > 1) {
                for (var _i = 0, _a = this._cameras; _i < _a.length; _i++) {
                    var camera = _a[_i];
                    var depthRenderer = this._scene.enableDepthRenderer(camera);
                    depthRenderer.useOnlyInActiveCamera = true;
                }
                this._depthOfFieldSceneObserver = this._scene.onAfterRenderTargetsRenderObservable.add(function (scene) {
                    if (_this._cameras.indexOf(scene.activeCamera) > -1) {
                        _this.depthOfField.depthTexture = scene.enableDepthRenderer(scene.activeCamera).getDepthMap();
                    }
                });
            }
            else {
                this._scene.onAfterRenderTargetsRenderObservable.remove(this._depthOfFieldSceneObserver);
                var depthRenderer = this._scene.enableDepthRenderer(this._cameras[0]);
                this.depthOfField.depthTexture = depthRenderer.getDepthMap();
            }
            if (!this.depthOfField._isReady()) {
                this.depthOfField._updateEffects();
            }
            this.addEffect(this.depthOfField);
            this._setAutoClearAndTextureSharing(this.depthOfField._effects[0], true);
        }
        else {
            this._scene.onAfterRenderTargetsRenderObservable.remove(this._depthOfFieldSceneObserver);
        }
        if (this.bloomEnabled) {
            if (!this.bloom._isReady()) {
                this.bloom._updateEffects();
            }
            this.addEffect(this.bloom);
            this._setAutoClearAndTextureSharing(this.bloom._effects[0], true);
        }
        if (this._imageProcessingEnabled) {
            this.imageProcessing = new ImageProcessingPostProcess("imageProcessing", 1.0, null, Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
            if (this._hdr) {
                this.addEffect(new PostProcessRenderEffect(engine, this.ImageProcessingPostProcessId, function () { return _this.imageProcessing; }, true));
                this._setAutoClearAndTextureSharing(this.imageProcessing);
            }
            else {
                this._scene.imageProcessingConfiguration.applyByPostProcess = false;
            }
            if (!this.cameras || this.cameras.length === 0) {
                this._scene.imageProcessingConfiguration.applyByPostProcess = false;
            }
            if (!this.imageProcessing.getEffect()) {
                this.imageProcessing._updateParameters();
            }
        }
        if (this.sharpenEnabled) {
            if (!this.sharpen.isReady()) {
                this.sharpen.updateEffect();
            }
            this.addEffect(this._sharpenEffect);
            this._setAutoClearAndTextureSharing(this.sharpen);
        }
        if (this.grainEnabled) {
            if (!this.grain.isReady()) {
                this.grain.updateEffect();
            }
            this.addEffect(this._grainEffect);
            this._setAutoClearAndTextureSharing(this.grain);
        }
        if (this.chromaticAberrationEnabled) {
            if (!this.chromaticAberration.isReady()) {
                this.chromaticAberration.updateEffect();
            }
            this.addEffect(this._chromaticAberrationEffect);
            this._setAutoClearAndTextureSharing(this.chromaticAberration);
        }
        if (this.fxaaEnabled) {
            this.fxaa = new FxaaPostProcess("fxaa", 1.0, null, Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
            this.addEffect(new PostProcessRenderEffect(engine, this.FxaaPostProcessId, function () { return _this.fxaa; }, true));
            this._setAutoClearAndTextureSharing(this.fxaa, true);
        }
        if (this._cameras !== null) {
            this._scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this._name, this._cameras);
        }
        // In multicamera mode, the scene needs to autoclear in between cameras.
        if (this._scene.activeCameras && this._scene.activeCameras.length > 1) {
            this._scene.autoClear = true;
        }
        if (!this._enableMSAAOnFirstPostProcess(this.samples) && this.samples > 1) {
            Logger.Warn("MSAA failed to enable, MSAA is only supported in browsers that support webGL >= 2.0");
        }
        this.onBuildObservable.notifyObservers(this);
    };
    DefaultRenderingPipeline.prototype._disposePostProcesses = function (disposeNonRecreated) {
        if (disposeNonRecreated === void 0) { disposeNonRecreated = false; }
        for (var i = 0; i < this._cameras.length; i++) {
            var camera = this._cameras[i];
            if (this.imageProcessing) {
                this.imageProcessing.dispose(camera);
            }
            if (this.fxaa) {
                this.fxaa.dispose(camera);
            }
            // These are created in the constructor and should not be disposed on every pipeline change
            if (disposeNonRecreated) {
                if (this.sharpen) {
                    this.sharpen.dispose(camera);
                }
                if (this.depthOfField) {
                    this._scene.onAfterRenderTargetsRenderObservable.remove(this._depthOfFieldSceneObserver);
                    this.depthOfField.disposeEffects(camera);
                }
                if (this.bloom) {
                    this.bloom.disposeEffects(camera);
                }
                if (this.chromaticAberration) {
                    this.chromaticAberration.dispose(camera);
                }
                if (this.grain) {
                    this.grain.dispose(camera);
                }
                if (this._glowLayer) {
                    this._glowLayer.dispose();
                }
            }
        }
        this.imageProcessing = null;
        this.fxaa = null;
        if (disposeNonRecreated) {
            this.sharpen = null;
            this._sharpenEffect = null;
            this.depthOfField = null;
            this.bloom = null;
            this.chromaticAberration = null;
            this._chromaticAberrationEffect = null;
            this.grain = null;
            this._grainEffect = null;
            this._glowLayer = null;
        }
    };
    /**
     * Adds a camera to the pipeline
     * @param camera the camera to be added
     */
    DefaultRenderingPipeline.prototype.addCamera = function (camera) {
        this._camerasToBeAttached.push(camera);
        this._buildPipeline();
    };
    /**
     * Removes a camera from the pipeline
     * @param camera the camera to remove
     */
    DefaultRenderingPipeline.prototype.removeCamera = function (camera) {
        var index = this._camerasToBeAttached.indexOf(camera);
        this._camerasToBeAttached.splice(index, 1);
        this._buildPipeline();
    };
    /**
     * Dispose of the pipeline and stop all post processes
     */
    DefaultRenderingPipeline.prototype.dispose = function () {
        this.onBuildObservable.clear();
        this._disposePostProcesses(true);
        this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
        this._scene.autoClear = true;
        if (this._resizeObserver) {
            this._scene.getEngine().onResizeObservable.remove(this._resizeObserver);
            this._resizeObserver = null;
        }
        this._scene.imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingConfigurationObserver);
        _super.prototype.dispose.call(this);
    };
    /**
     * Serialize the rendering pipeline (Used when exporting)
     * @returns the serialized object
     */
    DefaultRenderingPipeline.prototype.serialize = function () {
        var serializationObject = SerializationHelper.Serialize(this);
        serializationObject.customType = "DefaultRenderingPipeline";
        return serializationObject;
    };
    /**
     * Parse the serialized pipeline
     * @param source Source pipeline.
     * @param scene The scene to load the pipeline to.
     * @param rootUrl The URL of the serialized pipeline.
     * @returns An instantiated pipeline from the serialized object.
     */
    DefaultRenderingPipeline.Parse = function (source, scene, rootUrl) {
        return SerializationHelper.Parse(function () { return new DefaultRenderingPipeline(source._name, source._name._hdr, scene); }, source, scene, rootUrl);
    };
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "sharpenEnabled", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "bloomKernel", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "_bloomWeight", void 0);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "_bloomThreshold", void 0);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "_hdr", void 0);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "bloomWeight", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "bloomThreshold", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "bloomScale", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "bloomEnabled", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "depthOfFieldEnabled", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "depthOfFieldBlurLevel", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "fxaaEnabled", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "samples", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "imageProcessingEnabled", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "glowLayerEnabled", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "chromaticAberrationEnabled", null);
    __decorate([
        serialize()
    ], DefaultRenderingPipeline.prototype, "grainEnabled", null);
    return DefaultRenderingPipeline;
}(PostProcessRenderPipeline));
_TypeStore.RegisteredTypes["BABYLON.DefaultRenderingPipeline"] = DefaultRenderingPipeline;

export { BlurPostProcess as B, ChromaticAberrationPostProcess as C, DefaultRenderingPipeline as D, EffectLayer as E, FxaaPostProcess as F, GlowLayer as G, ImageProcessingPostProcess as I, PostProcessRenderEffect as P, SharpenPostProcess as S, PostProcessRenderPipeline as a, EffectLayerSceneComponent as b, BloomEffect as c, BloomMergePostProcess as d, CircleOfConfusionPostProcess as e, DepthOfFieldBlurPostProcess as f, DepthOfFieldEffectBlurLevel as g, DepthOfFieldEffect as h, DepthOfFieldMergePostProcessOptions as i, DepthOfFieldMergePostProcess as j, ExtractHighlightsPostProcess as k, GrainPostProcess as l, PostProcessRenderPipelineManager as m, PostProcessRenderPipelineManagerSceneComponent as n };
