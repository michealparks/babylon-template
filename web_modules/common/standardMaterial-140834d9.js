import { _ as __extends, f as Effect, a as __decorate } from './thinEngine-e576a091.js';
import { S as SerializationHelper, d as serializeAsTexture, g as expandToProperty, a as serialize, f as serializeAsColor3, j as serializeAsFresnelParameters } from './node-87d9c658.js';
import { M as Matrix, b as Color3, _ as _TypeStore } from './math.color-fc6e801e.js';
import { E as Engine } from './engine-9a1b5aa7.js';
import { S as SmartArray } from './pointerEvents-12a2451c.js';
import { I as ImageProcessingConfiguration, S as Scene, M as MaterialDefines } from './scene-cbeb8ae2.js';
import { M as Material, V as VertexBuffer } from './sceneComponent-5502b64a.js';
import { T as Texture } from './texture-6b1db4fe.js';
import './helperFunctions-f4fc40e0.js';
import { M as MaterialHelper, E as EffectFallbacks } from './bonesVertex-5b94878d.js';
import './clipPlaneVertex-e6809877.js';
import './morphTargetsVertex-924a5383.js';

/**
 * Configuration needed for prepass-capable materials
 */
var PrePassConfiguration = /** @class */ (function () {
    function PrePassConfiguration() {
        /**
         * Previous world matrices of meshes carrying this material
         * Used for computing velocity
         */
        this.previousWorldMatrices = {};
        /**
         * Previous bones of meshes carrying this material
         * Used for computing velocity
         */
        this.previousBones = {};
    }
    /**
     * Add the required uniforms to the current list.
     * @param uniforms defines the current uniform list.
     */
    PrePassConfiguration.AddUniforms = function (uniforms) {
        uniforms.push("previousWorld", "previousViewProjection");
    };
    /**
     * Add the required samplers to the current list.
     * @param samplers defines the current sampler list.
     */
    PrePassConfiguration.AddSamplers = function (samplers) {
        // pass
    };
    /**
     * Binds the material data.
     * @param effect defines the effect to update
     * @param scene defines the scene the material belongs to.
     * @param mesh The mesh
     * @param world World matrix of this mesh
     * @param isFrozen Is the material frozen
     */
    PrePassConfiguration.prototype.bindForSubMesh = function (effect, scene, mesh, world, isFrozen) {
        if (scene.prePassRenderer && scene.prePassRenderer.enabled) {
            if (scene.prePassRenderer.getIndex(2) !== -1) {
                if (!this.previousWorldMatrices[mesh.uniqueId]) {
                    this.previousWorldMatrices[mesh.uniqueId] = Matrix.Identity();
                }
                if (!this.previousViewProjection) {
                    this.previousViewProjection = scene.getTransformMatrix();
                }
                effect.setMatrix("previousWorld", this.previousWorldMatrices[mesh.uniqueId]);
                effect.setMatrix("previousViewProjection", this.previousViewProjection);
                this.previousWorldMatrices[mesh.uniqueId] = world.clone();
                this.previousViewProjection = scene.getTransformMatrix().clone();
            }
        }
    };
    return PrePassConfiguration;
}());

/**
 * Base class of materials working in push mode in babylon JS
 * @hidden
 */
var PushMaterial = /** @class */ (function (_super) {
    __extends(PushMaterial, _super);
    function PushMaterial(name, scene) {
        var _this = _super.call(this, name, scene) || this;
        _this._normalMatrix = new Matrix();
        _this._storeEffectOnSubMeshes = true;
        return _this;
    }
    PushMaterial.prototype.getEffect = function () {
        return this._activeEffect;
    };
    PushMaterial.prototype.isReady = function (mesh, useInstances) {
        if (!mesh) {
            return false;
        }
        if (!mesh.subMeshes || mesh.subMeshes.length === 0) {
            return true;
        }
        return this.isReadyForSubMesh(mesh, mesh.subMeshes[0], useInstances);
    };
    PushMaterial.prototype._isReadyForSubMesh = function (subMesh) {
        var defines = subMesh._materialDefines;
        if (!this.checkReadyOnEveryCall && subMesh.effect && defines) {
            if (defines._renderId === this.getScene().getRenderId()) {
                return true;
            }
        }
        return false;
    };
    /**
    * Binds the given world matrix to the active effect
    *
    * @param world the matrix to bind
    */
    PushMaterial.prototype.bindOnlyWorldMatrix = function (world) {
        this._activeEffect.setMatrix("world", world);
    };
    /**
     * Binds the given normal matrix to the active effect
     *
     * @param normalMatrix the matrix to bind
     */
    PushMaterial.prototype.bindOnlyNormalMatrix = function (normalMatrix) {
        this._activeEffect.setMatrix("normalMatrix", normalMatrix);
    };
    PushMaterial.prototype.bind = function (world, mesh) {
        if (!mesh) {
            return;
        }
        this.bindForSubMesh(world, mesh, mesh.subMeshes[0]);
    };
    PushMaterial.prototype._afterBind = function (mesh, effect) {
        if (effect === void 0) { effect = null; }
        _super.prototype._afterBind.call(this, mesh);
        this.getScene()._cachedEffect = effect;
    };
    PushMaterial.prototype._mustRebind = function (scene, effect, visibility) {
        if (visibility === void 0) { visibility = 1; }
        return scene.isCachedMaterialInvalid(this, effect, visibility);
    };
    return PushMaterial;
}(Material));

/**
 * This groups all the flags used to control the materials channel.
 */
var MaterialFlags = /** @class */ (function () {
    function MaterialFlags() {
    }
    Object.defineProperty(MaterialFlags, "DiffuseTextureEnabled", {
        /**
         * Are diffuse textures enabled in the application.
         */
        get: function () {
            return this._DiffuseTextureEnabled;
        },
        set: function (value) {
            if (this._DiffuseTextureEnabled === value) {
                return;
            }
            this._DiffuseTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "DetailTextureEnabled", {
        /**
         * Are detail textures enabled in the application.
         */
        get: function () {
            return this._DetailTextureEnabled;
        },
        set: function (value) {
            if (this._DetailTextureEnabled === value) {
                return;
            }
            this._DetailTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "AmbientTextureEnabled", {
        /**
         * Are ambient textures enabled in the application.
         */
        get: function () {
            return this._AmbientTextureEnabled;
        },
        set: function (value) {
            if (this._AmbientTextureEnabled === value) {
                return;
            }
            this._AmbientTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "OpacityTextureEnabled", {
        /**
         * Are opacity textures enabled in the application.
         */
        get: function () {
            return this._OpacityTextureEnabled;
        },
        set: function (value) {
            if (this._OpacityTextureEnabled === value) {
                return;
            }
            this._OpacityTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "ReflectionTextureEnabled", {
        /**
         * Are reflection textures enabled in the application.
         */
        get: function () {
            return this._ReflectionTextureEnabled;
        },
        set: function (value) {
            if (this._ReflectionTextureEnabled === value) {
                return;
            }
            this._ReflectionTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "EmissiveTextureEnabled", {
        /**
         * Are emissive textures enabled in the application.
         */
        get: function () {
            return this._EmissiveTextureEnabled;
        },
        set: function (value) {
            if (this._EmissiveTextureEnabled === value) {
                return;
            }
            this._EmissiveTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "SpecularTextureEnabled", {
        /**
         * Are specular textures enabled in the application.
         */
        get: function () {
            return this._SpecularTextureEnabled;
        },
        set: function (value) {
            if (this._SpecularTextureEnabled === value) {
                return;
            }
            this._SpecularTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "BumpTextureEnabled", {
        /**
         * Are bump textures enabled in the application.
         */
        get: function () {
            return this._BumpTextureEnabled;
        },
        set: function (value) {
            if (this._BumpTextureEnabled === value) {
                return;
            }
            this._BumpTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "LightmapTextureEnabled", {
        /**
         * Are lightmap textures enabled in the application.
         */
        get: function () {
            return this._LightmapTextureEnabled;
        },
        set: function (value) {
            if (this._LightmapTextureEnabled === value) {
                return;
            }
            this._LightmapTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "RefractionTextureEnabled", {
        /**
         * Are refraction textures enabled in the application.
         */
        get: function () {
            return this._RefractionTextureEnabled;
        },
        set: function (value) {
            if (this._RefractionTextureEnabled === value) {
                return;
            }
            this._RefractionTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "ColorGradingTextureEnabled", {
        /**
         * Are color grading textures enabled in the application.
         */
        get: function () {
            return this._ColorGradingTextureEnabled;
        },
        set: function (value) {
            if (this._ColorGradingTextureEnabled === value) {
                return;
            }
            this._ColorGradingTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "FresnelEnabled", {
        /**
         * Are fresnels enabled in the application.
         */
        get: function () {
            return this._FresnelEnabled;
        },
        set: function (value) {
            if (this._FresnelEnabled === value) {
                return;
            }
            this._FresnelEnabled = value;
            Engine.MarkAllMaterialsAsDirty(4);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "ClearCoatTextureEnabled", {
        /**
         * Are clear coat textures enabled in the application.
         */
        get: function () {
            return this._ClearCoatTextureEnabled;
        },
        set: function (value) {
            if (this._ClearCoatTextureEnabled === value) {
                return;
            }
            this._ClearCoatTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "ClearCoatBumpTextureEnabled", {
        /**
         * Are clear coat bump textures enabled in the application.
         */
        get: function () {
            return this._ClearCoatBumpTextureEnabled;
        },
        set: function (value) {
            if (this._ClearCoatBumpTextureEnabled === value) {
                return;
            }
            this._ClearCoatBumpTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "ClearCoatTintTextureEnabled", {
        /**
         * Are clear coat tint textures enabled in the application.
         */
        get: function () {
            return this._ClearCoatTintTextureEnabled;
        },
        set: function (value) {
            if (this._ClearCoatTintTextureEnabled === value) {
                return;
            }
            this._ClearCoatTintTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "SheenTextureEnabled", {
        /**
         * Are sheen textures enabled in the application.
         */
        get: function () {
            return this._SheenTextureEnabled;
        },
        set: function (value) {
            if (this._SheenTextureEnabled === value) {
                return;
            }
            this._SheenTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "AnisotropicTextureEnabled", {
        /**
         * Are anisotropic textures enabled in the application.
         */
        get: function () {
            return this._AnisotropicTextureEnabled;
        },
        set: function (value) {
            if (this._AnisotropicTextureEnabled === value) {
                return;
            }
            this._AnisotropicTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MaterialFlags, "ThicknessTextureEnabled", {
        /**
         * Are thickness textures enabled in the application.
         */
        get: function () {
            return this._ThicknessTextureEnabled;
        },
        set: function (value) {
            if (this._ThicknessTextureEnabled === value) {
                return;
            }
            this._ThicknessTextureEnabled = value;
            Engine.MarkAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    // Flags used to enable or disable a type of texture for all Standard Materials
    MaterialFlags._DiffuseTextureEnabled = true;
    MaterialFlags._DetailTextureEnabled = true;
    MaterialFlags._AmbientTextureEnabled = true;
    MaterialFlags._OpacityTextureEnabled = true;
    MaterialFlags._ReflectionTextureEnabled = true;
    MaterialFlags._EmissiveTextureEnabled = true;
    MaterialFlags._SpecularTextureEnabled = true;
    MaterialFlags._BumpTextureEnabled = true;
    MaterialFlags._LightmapTextureEnabled = true;
    MaterialFlags._RefractionTextureEnabled = true;
    MaterialFlags._ColorGradingTextureEnabled = true;
    MaterialFlags._FresnelEnabled = true;
    MaterialFlags._ClearCoatTextureEnabled = true;
    MaterialFlags._ClearCoatBumpTextureEnabled = true;
    MaterialFlags._ClearCoatTintTextureEnabled = true;
    MaterialFlags._SheenTextureEnabled = true;
    MaterialFlags._AnisotropicTextureEnabled = true;
    MaterialFlags._ThicknessTextureEnabled = true;
    return MaterialFlags;
}());

var name = 'defaultFragmentDeclaration';
var shader = "uniform vec4 vDiffuseColor;\n#ifdef SPECULARTERM\nuniform vec4 vSpecularColor;\n#endif\nuniform vec3 vEmissiveColor;\nuniform float visibility;\n\n#ifdef DIFFUSE\nuniform vec2 vDiffuseInfos;\n#endif\n#ifdef AMBIENT\nuniform vec2 vAmbientInfos;\n#endif\n#ifdef OPACITY\nuniform vec2 vOpacityInfos;\n#endif\n#ifdef EMISSIVE\nuniform vec2 vEmissiveInfos;\n#endif\n#ifdef LIGHTMAP\nuniform vec2 vLightmapInfos;\n#endif\n#ifdef BUMP\nuniform vec3 vBumpInfos;\nuniform vec2 vTangentSpaceParams;\n#endif\n#if defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_PROJECTION) || defined(REFRACTION)\nuniform mat4 view;\n#endif\n#ifdef REFRACTION\nuniform vec4 vRefractionInfos;\n#ifndef REFRACTIONMAP_3D\nuniform mat4 refractionMatrix;\n#endif\n#ifdef REFRACTIONFRESNEL\nuniform vec4 refractionLeftColor;\nuniform vec4 refractionRightColor;\n#endif\n#endif\n#if defined(SPECULAR) && defined(SPECULARTERM)\nuniform vec2 vSpecularInfos;\n#endif\n#ifdef DIFFUSEFRESNEL\nuniform vec4 diffuseLeftColor;\nuniform vec4 diffuseRightColor;\n#endif\n#ifdef OPACITYFRESNEL\nuniform vec4 opacityParts;\n#endif\n#ifdef EMISSIVEFRESNEL\nuniform vec4 emissiveLeftColor;\nuniform vec4 emissiveRightColor;\n#endif\n\n#ifdef REFLECTION\nuniform vec2 vReflectionInfos;\n#if defined(REFLECTIONMAP_PLANAR) || defined(REFLECTIONMAP_CUBIC) || defined(REFLECTIONMAP_PROJECTION) || defined(REFLECTIONMAP_EQUIRECTANGULAR) || defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_SKYBOX)\nuniform mat4 reflectionMatrix;\n#endif\n#ifndef REFLECTIONMAP_SKYBOX\n#if defined(USE_LOCAL_REFLECTIONMAP_CUBIC) && defined(REFLECTIONMAP_CUBIC)\nuniform vec3 vReflectionPosition;\nuniform vec3 vReflectionSize;\n#endif\n#endif\n#ifdef REFLECTIONFRESNEL\nuniform vec4 reflectionLeftColor;\nuniform vec4 reflectionRightColor;\n#endif\n#endif";
Effect.IncludesShadersStore[name] = shader;

var name$1 = 'defaultUboDeclaration';
var shader$1 = "layout(std140,column_major) uniform;\nuniform Material\n{\nvec4 diffuseLeftColor;\nvec4 diffuseRightColor;\nvec4 opacityParts;\nvec4 reflectionLeftColor;\nvec4 reflectionRightColor;\nvec4 refractionLeftColor;\nvec4 refractionRightColor;\nvec4 emissiveLeftColor;\nvec4 emissiveRightColor;\nvec2 vDiffuseInfos;\nvec2 vAmbientInfos;\nvec2 vOpacityInfos;\nvec2 vReflectionInfos;\nvec3 vReflectionPosition;\nvec3 vReflectionSize;\nvec2 vEmissiveInfos;\nvec2 vLightmapInfos;\nvec2 vSpecularInfos;\nvec3 vBumpInfos;\nmat4 diffuseMatrix;\nmat4 ambientMatrix;\nmat4 opacityMatrix;\nmat4 reflectionMatrix;\nmat4 emissiveMatrix;\nmat4 lightmapMatrix;\nmat4 specularMatrix;\nmat4 bumpMatrix;\nvec2 vTangentSpaceParams;\nfloat pointSize;\nmat4 refractionMatrix;\nvec4 vRefractionInfos;\nvec4 vSpecularColor;\nvec3 vEmissiveColor;\nfloat visibility;\nvec4 vDiffuseColor;\nvec4 vDetailInfos;\nmat4 detailMatrix;\n};\nuniform Scene {\nmat4 viewProjection;\n#ifdef MULTIVIEW\nmat4 viewProjectionR;\n#endif\nmat4 view;\n};\n";
Effect.IncludesShadersStore[name$1] = shader$1;

var name$2 = 'prePassDeclaration';
var shader$2 = "#ifdef PREPASS\n#extension GL_EXT_draw_buffers : require\n#ifdef WEBGL2\nlayout(location=0) out highp vec4 glFragData[{X}];\nhighp vec4 gl_FragColor;\n#endif\n#ifdef PREPASS_DEPTHNORMAL\nvarying highp vec3 vViewPos;\n#endif\n#ifdef PREPASS_VELOCITY\nvarying highp vec4 vCurrentPosition;\nvarying highp vec4 vPreviousPosition;\n#endif\n#endif\n";
Effect.IncludesShadersStore[name$2] = shader$2;

var name$3 = 'lightFragmentDeclaration';
var shader$3 = "#ifdef LIGHT{X}\nuniform vec4 vLightData{X};\nuniform vec4 vLightDiffuse{X};\n#ifdef SPECULARTERM\nuniform vec4 vLightSpecular{X};\n#else\nvec4 vLightSpecular{X}=vec4(0.);\n#endif\n#ifdef SHADOW{X}\n#ifdef SHADOWCSM{X}\nuniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];\nuniform float viewFrustumZ{X}[SHADOWCSMNUM_CASCADES{X}];\nuniform float frustumLengths{X}[SHADOWCSMNUM_CASCADES{X}];\nuniform float cascadeBlendFactor{X};\nvarying vec4 vPositionFromLight{X}[SHADOWCSMNUM_CASCADES{X}];\nvarying float vDepthMetric{X}[SHADOWCSMNUM_CASCADES{X}];\nvarying vec4 vPositionFromCamera{X};\n#if defined(SHADOWPCSS{X})\nuniform highp sampler2DArrayShadow shadowSampler{X};\nuniform highp sampler2DArray depthSampler{X};\nuniform vec2 lightSizeUVCorrection{X}[SHADOWCSMNUM_CASCADES{X}];\nuniform float depthCorrection{X}[SHADOWCSMNUM_CASCADES{X}];\nuniform float penumbraDarkness{X};\n#elif defined(SHADOWPCF{X})\nuniform highp sampler2DArrayShadow shadowSampler{X};\n#else\nuniform highp sampler2DArray shadowSampler{X};\n#endif\n#ifdef SHADOWCSMDEBUG{X}\nconst vec3 vCascadeColorsMultiplier{X}[8]=vec3[8]\n(\nvec3 ( 1.5,0.0,0.0 ),\nvec3 ( 0.0,1.5,0.0 ),\nvec3 ( 0.0,0.0,5.5 ),\nvec3 ( 1.5,0.0,5.5 ),\nvec3 ( 1.5,1.5,0.0 ),\nvec3 ( 1.0,1.0,1.0 ),\nvec3 ( 0.0,1.0,5.5 ),\nvec3 ( 0.5,3.5,0.75 )\n);\nvec3 shadowDebug{X};\n#endif\n#ifdef SHADOWCSMUSESHADOWMAXZ{X}\nint index{X}=-1;\n#else\nint index{X}=SHADOWCSMNUM_CASCADES{X}-1;\n#endif\nfloat diff{X}=0.;\n#elif defined(SHADOWCUBE{X})\nuniform samplerCube shadowSampler{X};\n#else\nvarying vec4 vPositionFromLight{X};\nvarying float vDepthMetric{X};\n#if defined(SHADOWPCSS{X})\nuniform highp sampler2DShadow shadowSampler{X};\nuniform highp sampler2D depthSampler{X};\n#elif defined(SHADOWPCF{X})\nuniform highp sampler2DShadow shadowSampler{X};\n#else\nuniform sampler2D shadowSampler{X};\n#endif\nuniform mat4 lightMatrix{X};\n#endif\nuniform vec4 shadowsInfo{X};\nuniform vec2 depthValues{X};\n#endif\n#ifdef SPOTLIGHT{X}\nuniform vec4 vLightDirection{X};\nuniform vec4 vLightFalloff{X};\n#elif defined(POINTLIGHT{X})\nuniform vec4 vLightFalloff{X};\n#elif defined(HEMILIGHT{X})\nuniform vec3 vLightGround{X};\n#endif\n#ifdef PROJECTEDLIGHTTEXTURE{X}\nuniform mat4 textureProjectionMatrix{X};\nuniform sampler2D projectionLightSampler{X};\n#endif\n#endif";
Effect.IncludesShadersStore[name$3] = shader$3;

var name$4 = 'lightUboDeclaration';
var shader$4 = "#ifdef LIGHT{X}\nuniform Light{X}\n{\nvec4 vLightData;\nvec4 vLightDiffuse;\nvec4 vLightSpecular;\n#ifdef SPOTLIGHT{X}\nvec4 vLightDirection;\nvec4 vLightFalloff;\n#elif defined(POINTLIGHT{X})\nvec4 vLightFalloff;\n#elif defined(HEMILIGHT{X})\nvec3 vLightGround;\n#endif\nvec4 shadowsInfo;\nvec2 depthValues;\n} light{X};\n#ifdef PROJECTEDLIGHTTEXTURE{X}\nuniform mat4 textureProjectionMatrix{X};\nuniform sampler2D projectionLightSampler{X};\n#endif\n#ifdef SHADOW{X}\n#ifdef SHADOWCSM{X}\nuniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];\nuniform float viewFrustumZ{X}[SHADOWCSMNUM_CASCADES{X}];\nuniform float frustumLengths{X}[SHADOWCSMNUM_CASCADES{X}];\nuniform float cascadeBlendFactor{X};\nvarying vec4 vPositionFromLight{X}[SHADOWCSMNUM_CASCADES{X}];\nvarying float vDepthMetric{X}[SHADOWCSMNUM_CASCADES{X}];\nvarying vec4 vPositionFromCamera{X};\n#if defined(SHADOWPCSS{X})\nuniform highp sampler2DArrayShadow shadowSampler{X};\nuniform highp sampler2DArray depthSampler{X};\nuniform vec2 lightSizeUVCorrection{X}[SHADOWCSMNUM_CASCADES{X}];\nuniform float depthCorrection{X}[SHADOWCSMNUM_CASCADES{X}];\nuniform float penumbraDarkness{X};\n#elif defined(SHADOWPCF{X})\nuniform highp sampler2DArrayShadow shadowSampler{X};\n#else\nuniform highp sampler2DArray shadowSampler{X};\n#endif\n#ifdef SHADOWCSMDEBUG{X}\nconst vec3 vCascadeColorsMultiplier{X}[8]=vec3[8]\n(\nvec3 ( 1.5,0.0,0.0 ),\nvec3 ( 0.0,1.5,0.0 ),\nvec3 ( 0.0,0.0,5.5 ),\nvec3 ( 1.5,0.0,5.5 ),\nvec3 ( 1.5,1.5,0.0 ),\nvec3 ( 1.0,1.0,1.0 ),\nvec3 ( 0.0,1.0,5.5 ),\nvec3 ( 0.5,3.5,0.75 )\n);\nvec3 shadowDebug{X};\n#endif\n#ifdef SHADOWCSMUSESHADOWMAXZ{X}\nint index{X}=-1;\n#else\nint index{X}=SHADOWCSMNUM_CASCADES{X}-1;\n#endif\nfloat diff{X}=0.;\n#elif defined(SHADOWCUBE{X})\nuniform samplerCube shadowSampler{X};\n#else\nvarying vec4 vPositionFromLight{X};\nvarying float vDepthMetric{X};\n#if defined(SHADOWPCSS{X})\nuniform highp sampler2DShadow shadowSampler{X};\nuniform highp sampler2D depthSampler{X};\n#elif defined(SHADOWPCF{X})\nuniform highp sampler2DShadow shadowSampler{X};\n#else\nuniform sampler2D shadowSampler{X};\n#endif\nuniform mat4 lightMatrix{X};\n#endif\n#endif\n#endif";
Effect.IncludesShadersStore[name$4] = shader$4;

var name$5 = 'lightsFragmentFunctions';
var shader$5 = "\nstruct lightingInfo\n{\nvec3 diffuse;\n#ifdef SPECULARTERM\nvec3 specular;\n#endif\n#ifdef NDOTL\nfloat ndl;\n#endif\n};\nlightingInfo computeLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec3 diffuseColor,vec3 specularColor,float range,float glossiness) {\nlightingInfo result;\nvec3 lightVectorW;\nfloat attenuation=1.0;\nif (lightData.w == 0.)\n{\nvec3 direction=lightData.xyz-vPositionW;\nattenuation=max(0.,1.0-length(direction)/range);\nlightVectorW=normalize(direction);\n}\nelse\n{\nlightVectorW=normalize(-lightData.xyz);\n}\n\nfloat ndl=max(0.,dot(vNormal,lightVectorW));\n#ifdef NDOTL\nresult.ndl=ndl;\n#endif\nresult.diffuse=ndl*diffuseColor*attenuation;\n#ifdef SPECULARTERM\n\nvec3 angleW=normalize(viewDirectionW+lightVectorW);\nfloat specComp=max(0.,dot(vNormal,angleW));\nspecComp=pow(specComp,max(1.,glossiness));\nresult.specular=specComp*specularColor*attenuation;\n#endif\nreturn result;\n}\nlightingInfo computeSpotLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec4 lightDirection,vec3 diffuseColor,vec3 specularColor,float range,float glossiness) {\nlightingInfo result;\nvec3 direction=lightData.xyz-vPositionW;\nvec3 lightVectorW=normalize(direction);\nfloat attenuation=max(0.,1.0-length(direction)/range);\n\nfloat cosAngle=max(0.,dot(lightDirection.xyz,-lightVectorW));\nif (cosAngle>=lightDirection.w)\n{\ncosAngle=max(0.,pow(cosAngle,lightData.w));\nattenuation*=cosAngle;\n\nfloat ndl=max(0.,dot(vNormal,lightVectorW));\n#ifdef NDOTL\nresult.ndl=ndl;\n#endif\nresult.diffuse=ndl*diffuseColor*attenuation;\n#ifdef SPECULARTERM\n\nvec3 angleW=normalize(viewDirectionW+lightVectorW);\nfloat specComp=max(0.,dot(vNormal,angleW));\nspecComp=pow(specComp,max(1.,glossiness));\nresult.specular=specComp*specularColor*attenuation;\n#endif\nreturn result;\n}\nresult.diffuse=vec3(0.);\n#ifdef SPECULARTERM\nresult.specular=vec3(0.);\n#endif\n#ifdef NDOTL\nresult.ndl=0.;\n#endif\nreturn result;\n}\nlightingInfo computeHemisphericLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec3 diffuseColor,vec3 specularColor,vec3 groundColor,float glossiness) {\nlightingInfo result;\n\nfloat ndl=dot(vNormal,lightData.xyz)*0.5+0.5;\n#ifdef NDOTL\nresult.ndl=ndl;\n#endif\nresult.diffuse=mix(groundColor,diffuseColor,ndl);\n#ifdef SPECULARTERM\n\nvec3 angleW=normalize(viewDirectionW+lightData.xyz);\nfloat specComp=max(0.,dot(vNormal,angleW));\nspecComp=pow(specComp,max(1.,glossiness));\nresult.specular=specComp*specularColor;\n#endif\nreturn result;\n}\n#define inline\nvec3 computeProjectionTextureDiffuseLighting(sampler2D projectionLightSampler,mat4 textureProjectionMatrix){\nvec4 strq=textureProjectionMatrix*vec4(vPositionW,1.0);\nstrq/=strq.w;\nvec3 textureColor=texture2D(projectionLightSampler,strq.xy).rgb;\nreturn textureColor;\n}";
Effect.IncludesShadersStore[name$5] = shader$5;

var name$6 = 'shadowsFragmentFunctions';
var shader$6 = "#ifdef SHADOWS\n#ifndef SHADOWFLOAT\n\nfloat unpack(vec4 color)\n{\nconst vec4 bit_shift=vec4(1.0/(255.0*255.0*255.0),1.0/(255.0*255.0),1.0/255.0,1.0);\nreturn dot(color,bit_shift);\n}\n#endif\nfloat computeFallOff(float value,vec2 clipSpace,float frustumEdgeFalloff)\n{\nfloat mask=smoothstep(1.0-frustumEdgeFalloff,1.00000012,clamp(dot(clipSpace,clipSpace),0.,1.));\nreturn mix(value,1.0,mask);\n}\n#define inline\nfloat computeShadowCube(vec3 lightPosition,samplerCube shadowSampler,float darkness,vec2 depthValues)\n{\nvec3 directionToLight=vPositionW-lightPosition;\nfloat depth=length(directionToLight);\ndepth=(depth+depthValues.x)/(depthValues.y);\ndepth=clamp(depth,0.,1.0);\ndirectionToLight=normalize(directionToLight);\ndirectionToLight.y=-directionToLight.y;\n#ifndef SHADOWFLOAT\nfloat shadow=unpack(textureCube(shadowSampler,directionToLight));\n#else\nfloat shadow=textureCube(shadowSampler,directionToLight).x;\n#endif\nreturn depth>shadow ? darkness : 1.0;\n}\n#define inline\nfloat computeShadowWithPoissonSamplingCube(vec3 lightPosition,samplerCube shadowSampler,float mapSize,float darkness,vec2 depthValues)\n{\nvec3 directionToLight=vPositionW-lightPosition;\nfloat depth=length(directionToLight);\ndepth=(depth+depthValues.x)/(depthValues.y);\ndepth=clamp(depth,0.,1.0);\ndirectionToLight=normalize(directionToLight);\ndirectionToLight.y=-directionToLight.y;\nfloat visibility=1.;\nvec3 poissonDisk[4];\npoissonDisk[0]=vec3(-1.0,1.0,-1.0);\npoissonDisk[1]=vec3(1.0,-1.0,-1.0);\npoissonDisk[2]=vec3(-1.0,-1.0,-1.0);\npoissonDisk[3]=vec3(1.0,-1.0,1.0);\n\n#ifndef SHADOWFLOAT\nif (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[0]*mapSize))<depth) visibility-=0.25;\nif (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[1]*mapSize))<depth) visibility-=0.25;\nif (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[2]*mapSize))<depth) visibility-=0.25;\nif (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[3]*mapSize))<depth) visibility-=0.25;\n#else\nif (textureCube(shadowSampler,directionToLight+poissonDisk[0]*mapSize).x<depth) visibility-=0.25;\nif (textureCube(shadowSampler,directionToLight+poissonDisk[1]*mapSize).x<depth) visibility-=0.25;\nif (textureCube(shadowSampler,directionToLight+poissonDisk[2]*mapSize).x<depth) visibility-=0.25;\nif (textureCube(shadowSampler,directionToLight+poissonDisk[3]*mapSize).x<depth) visibility-=0.25;\n#endif\nreturn min(1.0,visibility+darkness);\n}\n#define inline\nfloat computeShadowWithESMCube(vec3 lightPosition,samplerCube shadowSampler,float darkness,float depthScale,vec2 depthValues)\n{\nvec3 directionToLight=vPositionW-lightPosition;\nfloat depth=length(directionToLight);\ndepth=(depth+depthValues.x)/(depthValues.y);\nfloat shadowPixelDepth=clamp(depth,0.,1.0);\ndirectionToLight=normalize(directionToLight);\ndirectionToLight.y=-directionToLight.y;\n#ifndef SHADOWFLOAT\nfloat shadowMapSample=unpack(textureCube(shadowSampler,directionToLight));\n#else\nfloat shadowMapSample=textureCube(shadowSampler,directionToLight).x;\n#endif\nfloat esm=1.0-clamp(exp(min(87.,depthScale*shadowPixelDepth))*shadowMapSample,0.,1.-darkness);\nreturn esm;\n}\n#define inline\nfloat computeShadowWithCloseESMCube(vec3 lightPosition,samplerCube shadowSampler,float darkness,float depthScale,vec2 depthValues)\n{\nvec3 directionToLight=vPositionW-lightPosition;\nfloat depth=length(directionToLight);\ndepth=(depth+depthValues.x)/(depthValues.y);\nfloat shadowPixelDepth=clamp(depth,0.,1.0);\ndirectionToLight=normalize(directionToLight);\ndirectionToLight.y=-directionToLight.y;\n#ifndef SHADOWFLOAT\nfloat shadowMapSample=unpack(textureCube(shadowSampler,directionToLight));\n#else\nfloat shadowMapSample=textureCube(shadowSampler,directionToLight).x;\n#endif\nfloat esm=clamp(exp(min(87.,-depthScale*(shadowPixelDepth-shadowMapSample))),darkness,1.);\nreturn esm;\n}\n#ifdef WEBGL2\n#define inline\nfloat computeShadowCSM(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArray shadowSampler,float darkness,float frustumEdgeFalloff)\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec2 uv=0.5*clipSpace.xy+vec2(0.5);\nvec3 uvLayer=vec3(uv.x,uv.y,layer);\nfloat shadowPixelDepth=clamp(depthMetric,0.,1.0);\n#ifndef SHADOWFLOAT\nfloat shadow=unpack(texture2D(shadowSampler,uvLayer));\n#else\nfloat shadow=texture2D(shadowSampler,uvLayer).x;\n#endif\nreturn shadowPixelDepth>shadow ? computeFallOff(darkness,clipSpace.xy,frustumEdgeFalloff) : 1.;\n}\n#endif\n#define inline\nfloat computeShadow(vec4 vPositionFromLight,float depthMetric,sampler2D shadowSampler,float darkness,float frustumEdgeFalloff)\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec2 uv=0.5*clipSpace.xy+vec2(0.5);\nif (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0)\n{\nreturn 1.0;\n}\nelse\n{\nfloat shadowPixelDepth=clamp(depthMetric,0.,1.0);\n#ifndef SHADOWFLOAT\nfloat shadow=unpack(texture2D(shadowSampler,uv));\n#else\nfloat shadow=texture2D(shadowSampler,uv).x;\n#endif\nreturn shadowPixelDepth>shadow ? computeFallOff(darkness,clipSpace.xy,frustumEdgeFalloff) : 1.;\n}\n}\n#define inline\nfloat computeShadowWithPoissonSampling(vec4 vPositionFromLight,float depthMetric,sampler2D shadowSampler,float mapSize,float darkness,float frustumEdgeFalloff)\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec2 uv=0.5*clipSpace.xy+vec2(0.5);\nif (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0)\n{\nreturn 1.0;\n}\nelse\n{\nfloat shadowPixelDepth=clamp(depthMetric,0.,1.0);\nfloat visibility=1.;\nvec2 poissonDisk[4];\npoissonDisk[0]=vec2(-0.94201624,-0.39906216);\npoissonDisk[1]=vec2(0.94558609,-0.76890725);\npoissonDisk[2]=vec2(-0.094184101,-0.92938870);\npoissonDisk[3]=vec2(0.34495938,0.29387760);\n\n#ifndef SHADOWFLOAT\nif (unpack(texture2D(shadowSampler,uv+poissonDisk[0]*mapSize))<shadowPixelDepth) visibility-=0.25;\nif (unpack(texture2D(shadowSampler,uv+poissonDisk[1]*mapSize))<shadowPixelDepth) visibility-=0.25;\nif (unpack(texture2D(shadowSampler,uv+poissonDisk[2]*mapSize))<shadowPixelDepth) visibility-=0.25;\nif (unpack(texture2D(shadowSampler,uv+poissonDisk[3]*mapSize))<shadowPixelDepth) visibility-=0.25;\n#else\nif (texture2D(shadowSampler,uv+poissonDisk[0]*mapSize).x<shadowPixelDepth) visibility-=0.25;\nif (texture2D(shadowSampler,uv+poissonDisk[1]*mapSize).x<shadowPixelDepth) visibility-=0.25;\nif (texture2D(shadowSampler,uv+poissonDisk[2]*mapSize).x<shadowPixelDepth) visibility-=0.25;\nif (texture2D(shadowSampler,uv+poissonDisk[3]*mapSize).x<shadowPixelDepth) visibility-=0.25;\n#endif\nreturn computeFallOff(min(1.0,visibility+darkness),clipSpace.xy,frustumEdgeFalloff);\n}\n}\n#define inline\nfloat computeShadowWithESM(vec4 vPositionFromLight,float depthMetric,sampler2D shadowSampler,float darkness,float depthScale,float frustumEdgeFalloff)\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec2 uv=0.5*clipSpace.xy+vec2(0.5);\nif (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0)\n{\nreturn 1.0;\n}\nelse\n{\nfloat shadowPixelDepth=clamp(depthMetric,0.,1.0);\n#ifndef SHADOWFLOAT\nfloat shadowMapSample=unpack(texture2D(shadowSampler,uv));\n#else\nfloat shadowMapSample=texture2D(shadowSampler,uv).x;\n#endif\nfloat esm=1.0-clamp(exp(min(87.,depthScale*shadowPixelDepth))*shadowMapSample,0.,1.-darkness);\nreturn computeFallOff(esm,clipSpace.xy,frustumEdgeFalloff);\n}\n}\n#define inline\nfloat computeShadowWithCloseESM(vec4 vPositionFromLight,float depthMetric,sampler2D shadowSampler,float darkness,float depthScale,float frustumEdgeFalloff)\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec2 uv=0.5*clipSpace.xy+vec2(0.5);\nif (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0)\n{\nreturn 1.0;\n}\nelse\n{\nfloat shadowPixelDepth=clamp(depthMetric,0.,1.0);\n#ifndef SHADOWFLOAT\nfloat shadowMapSample=unpack(texture2D(shadowSampler,uv));\n#else\nfloat shadowMapSample=texture2D(shadowSampler,uv).x;\n#endif\nfloat esm=clamp(exp(min(87.,-depthScale*(shadowPixelDepth-shadowMapSample))),darkness,1.);\nreturn computeFallOff(esm,clipSpace.xy,frustumEdgeFalloff);\n}\n}\n#ifdef WEBGL2\n#define GREATEST_LESS_THAN_ONE 0.99999994\n\n#define inline\nfloat computeShadowWithCSMPCF1(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArrayShadow shadowSampler,float darkness,float frustumEdgeFalloff)\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));\nuvDepth.z=clamp(uvDepth.z,0.,GREATEST_LESS_THAN_ONE);\nvec4 uvDepthLayer=vec4(uvDepth.x,uvDepth.y,layer,uvDepth.z);\nfloat shadow=texture(shadowSampler,uvDepthLayer);\nshadow=mix(darkness,1.,shadow);\nreturn computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);\n}\n\n\n\n#define inline\nfloat computeShadowWithCSMPCF3(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArrayShadow shadowSampler,vec2 shadowMapSizeAndInverse,float darkness,float frustumEdgeFalloff)\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));\nuvDepth.z=clamp(uvDepth.z,0.,GREATEST_LESS_THAN_ONE);\nvec2 uv=uvDepth.xy*shadowMapSizeAndInverse.x;\nuv+=0.5;\nvec2 st=fract(uv);\nvec2 base_uv=floor(uv)-0.5;\nbase_uv*=shadowMapSizeAndInverse.y;\n\n\n\n\nvec2 uvw0=3.-2.*st;\nvec2 uvw1=1.+2.*st;\nvec2 u=vec2((2.-st.x)/uvw0.x-1.,st.x/uvw1.x+1.)*shadowMapSizeAndInverse.y;\nvec2 v=vec2((2.-st.y)/uvw0.y-1.,st.y/uvw1.y+1.)*shadowMapSizeAndInverse.y;\nfloat shadow=0.;\nshadow+=uvw0.x*uvw0.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[0],v[0]),layer,uvDepth.z));\nshadow+=uvw1.x*uvw0.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[1],v[0]),layer,uvDepth.z));\nshadow+=uvw0.x*uvw1.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[0],v[1]),layer,uvDepth.z));\nshadow+=uvw1.x*uvw1.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[1],v[1]),layer,uvDepth.z));\nshadow=shadow/16.;\nshadow=mix(darkness,1.,shadow);\nreturn computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);\n}\n\n\n\n#define inline\nfloat computeShadowWithCSMPCF5(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArrayShadow shadowSampler,vec2 shadowMapSizeAndInverse,float darkness,float frustumEdgeFalloff)\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));\nuvDepth.z=clamp(uvDepth.z,0.,GREATEST_LESS_THAN_ONE);\nvec2 uv=uvDepth.xy*shadowMapSizeAndInverse.x;\nuv+=0.5;\nvec2 st=fract(uv);\nvec2 base_uv=floor(uv)-0.5;\nbase_uv*=shadowMapSizeAndInverse.y;\n\n\nvec2 uvw0=4.-3.*st;\nvec2 uvw1=vec2(7.);\nvec2 uvw2=1.+3.*st;\nvec3 u=vec3((3.-2.*st.x)/uvw0.x-2.,(3.+st.x)/uvw1.x,st.x/uvw2.x+2.)*shadowMapSizeAndInverse.y;\nvec3 v=vec3((3.-2.*st.y)/uvw0.y-2.,(3.+st.y)/uvw1.y,st.y/uvw2.y+2.)*shadowMapSizeAndInverse.y;\nfloat shadow=0.;\nshadow+=uvw0.x*uvw0.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[0],v[0]),layer,uvDepth.z));\nshadow+=uvw1.x*uvw0.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[1],v[0]),layer,uvDepth.z));\nshadow+=uvw2.x*uvw0.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[2],v[0]),layer,uvDepth.z));\nshadow+=uvw0.x*uvw1.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[0],v[1]),layer,uvDepth.z));\nshadow+=uvw1.x*uvw1.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[1],v[1]),layer,uvDepth.z));\nshadow+=uvw2.x*uvw1.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[2],v[1]),layer,uvDepth.z));\nshadow+=uvw0.x*uvw2.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[0],v[2]),layer,uvDepth.z));\nshadow+=uvw1.x*uvw2.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[1],v[2]),layer,uvDepth.z));\nshadow+=uvw2.x*uvw2.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[2],v[2]),layer,uvDepth.z));\nshadow=shadow/144.;\nshadow=mix(darkness,1.,shadow);\nreturn computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);\n}\n\n#define inline\nfloat computeShadowWithPCF1(vec4 vPositionFromLight,float depthMetric,sampler2DShadow shadowSampler,float darkness,float frustumEdgeFalloff)\n{\nif (depthMetric>1.0 || depthMetric<0.0) {\nreturn 1.0;\n}\nelse\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));\nfloat shadow=texture2D(shadowSampler,uvDepth);\nshadow=mix(darkness,1.,shadow);\nreturn computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);\n}\n}\n\n\n\n#define inline\nfloat computeShadowWithPCF3(vec4 vPositionFromLight,float depthMetric,sampler2DShadow shadowSampler,vec2 shadowMapSizeAndInverse,float darkness,float frustumEdgeFalloff)\n{\nif (depthMetric>1.0 || depthMetric<0.0) {\nreturn 1.0;\n}\nelse\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));\nvec2 uv=uvDepth.xy*shadowMapSizeAndInverse.x;\nuv+=0.5;\nvec2 st=fract(uv);\nvec2 base_uv=floor(uv)-0.5;\nbase_uv*=shadowMapSizeAndInverse.y;\n\n\n\n\nvec2 uvw0=3.-2.*st;\nvec2 uvw1=1.+2.*st;\nvec2 u=vec2((2.-st.x)/uvw0.x-1.,st.x/uvw1.x+1.)*shadowMapSizeAndInverse.y;\nvec2 v=vec2((2.-st.y)/uvw0.y-1.,st.y/uvw1.y+1.)*shadowMapSizeAndInverse.y;\nfloat shadow=0.;\nshadow+=uvw0.x*uvw0.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[0],v[0]),uvDepth.z));\nshadow+=uvw1.x*uvw0.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[1],v[0]),uvDepth.z));\nshadow+=uvw0.x*uvw1.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[0],v[1]),uvDepth.z));\nshadow+=uvw1.x*uvw1.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[1],v[1]),uvDepth.z));\nshadow=shadow/16.;\nshadow=mix(darkness,1.,shadow);\nreturn computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);\n}\n}\n\n\n\n#define inline\nfloat computeShadowWithPCF5(vec4 vPositionFromLight,float depthMetric,sampler2DShadow shadowSampler,vec2 shadowMapSizeAndInverse,float darkness,float frustumEdgeFalloff)\n{\nif (depthMetric>1.0 || depthMetric<0.0) {\nreturn 1.0;\n}\nelse\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));\nvec2 uv=uvDepth.xy*shadowMapSizeAndInverse.x;\nuv+=0.5;\nvec2 st=fract(uv);\nvec2 base_uv=floor(uv)-0.5;\nbase_uv*=shadowMapSizeAndInverse.y;\n\n\nvec2 uvw0=4.-3.*st;\nvec2 uvw1=vec2(7.);\nvec2 uvw2=1.+3.*st;\nvec3 u=vec3((3.-2.*st.x)/uvw0.x-2.,(3.+st.x)/uvw1.x,st.x/uvw2.x+2.)*shadowMapSizeAndInverse.y;\nvec3 v=vec3((3.-2.*st.y)/uvw0.y-2.,(3.+st.y)/uvw1.y,st.y/uvw2.y+2.)*shadowMapSizeAndInverse.y;\nfloat shadow=0.;\nshadow+=uvw0.x*uvw0.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[0],v[0]),uvDepth.z));\nshadow+=uvw1.x*uvw0.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[1],v[0]),uvDepth.z));\nshadow+=uvw2.x*uvw0.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[2],v[0]),uvDepth.z));\nshadow+=uvw0.x*uvw1.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[0],v[1]),uvDepth.z));\nshadow+=uvw1.x*uvw1.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[1],v[1]),uvDepth.z));\nshadow+=uvw2.x*uvw1.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[2],v[1]),uvDepth.z));\nshadow+=uvw0.x*uvw2.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[0],v[2]),uvDepth.z));\nshadow+=uvw1.x*uvw2.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[1],v[2]),uvDepth.z));\nshadow+=uvw2.x*uvw2.y*texture2D(shadowSampler,vec3(base_uv.xy+vec2(u[2],v[2]),uvDepth.z));\nshadow=shadow/144.;\nshadow=mix(darkness,1.,shadow);\nreturn computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);\n}\n}\nconst vec3 PoissonSamplers32[64]=vec3[64](\nvec3(0.06407013,0.05409927,0.),\nvec3(0.7366577,0.5789394,0.),\nvec3(-0.6270542,-0.5320278,0.),\nvec3(-0.4096107,0.8411095,0.),\nvec3(0.6849564,-0.4990818,0.),\nvec3(-0.874181,-0.04579735,0.),\nvec3(0.9989998,0.0009880066,0.),\nvec3(-0.004920578,-0.9151649,0.),\nvec3(0.1805763,0.9747483,0.),\nvec3(-0.2138451,0.2635818,0.),\nvec3(0.109845,0.3884785,0.),\nvec3(0.06876755,-0.3581074,0.),\nvec3(0.374073,-0.7661266,0.),\nvec3(0.3079132,-0.1216763,0.),\nvec3(-0.3794335,-0.8271583,0.),\nvec3(-0.203878,-0.07715034,0.),\nvec3(0.5912697,0.1469799,0.),\nvec3(-0.88069,0.3031784,0.),\nvec3(0.5040108,0.8283722,0.),\nvec3(-0.5844124,0.5494877,0.),\nvec3(0.6017799,-0.1726654,0.),\nvec3(-0.5554981,0.1559997,0.),\nvec3(-0.3016369,-0.3900928,0.),\nvec3(-0.5550632,-0.1723762,0.),\nvec3(0.925029,0.2995041,0.),\nvec3(-0.2473137,0.5538505,0.),\nvec3(0.9183037,-0.2862392,0.),\nvec3(0.2469421,0.6718712,0.),\nvec3(0.3916397,-0.4328209,0.),\nvec3(-0.03576927,-0.6220032,0.),\nvec3(-0.04661255,0.7995201,0.),\nvec3(0.4402924,0.3640312,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.),\nvec3(0.,0.,0.)\n);\nconst vec3 PoissonSamplers64[64]=vec3[64](\nvec3(-0.613392,0.617481,0.),\nvec3(0.170019,-0.040254,0.),\nvec3(-0.299417,0.791925,0.),\nvec3(0.645680,0.493210,0.),\nvec3(-0.651784,0.717887,0.),\nvec3(0.421003,0.027070,0.),\nvec3(-0.817194,-0.271096,0.),\nvec3(-0.705374,-0.668203,0.),\nvec3(0.977050,-0.108615,0.),\nvec3(0.063326,0.142369,0.),\nvec3(0.203528,0.214331,0.),\nvec3(-0.667531,0.326090,0.),\nvec3(-0.098422,-0.295755,0.),\nvec3(-0.885922,0.215369,0.),\nvec3(0.566637,0.605213,0.),\nvec3(0.039766,-0.396100,0.),\nvec3(0.751946,0.453352,0.),\nvec3(0.078707,-0.715323,0.),\nvec3(-0.075838,-0.529344,0.),\nvec3(0.724479,-0.580798,0.),\nvec3(0.222999,-0.215125,0.),\nvec3(-0.467574,-0.405438,0.),\nvec3(-0.248268,-0.814753,0.),\nvec3(0.354411,-0.887570,0.),\nvec3(0.175817,0.382366,0.),\nvec3(0.487472,-0.063082,0.),\nvec3(-0.084078,0.898312,0.),\nvec3(0.488876,-0.783441,0.),\nvec3(0.470016,0.217933,0.),\nvec3(-0.696890,-0.549791,0.),\nvec3(-0.149693,0.605762,0.),\nvec3(0.034211,0.979980,0.),\nvec3(0.503098,-0.308878,0.),\nvec3(-0.016205,-0.872921,0.),\nvec3(0.385784,-0.393902,0.),\nvec3(-0.146886,-0.859249,0.),\nvec3(0.643361,0.164098,0.),\nvec3(0.634388,-0.049471,0.),\nvec3(-0.688894,0.007843,0.),\nvec3(0.464034,-0.188818,0.),\nvec3(-0.440840,0.137486,0.),\nvec3(0.364483,0.511704,0.),\nvec3(0.034028,0.325968,0.),\nvec3(0.099094,-0.308023,0.),\nvec3(0.693960,-0.366253,0.),\nvec3(0.678884,-0.204688,0.),\nvec3(0.001801,0.780328,0.),\nvec3(0.145177,-0.898984,0.),\nvec3(0.062655,-0.611866,0.),\nvec3(0.315226,-0.604297,0.),\nvec3(-0.780145,0.486251,0.),\nvec3(-0.371868,0.882138,0.),\nvec3(0.200476,0.494430,0.),\nvec3(-0.494552,-0.711051,0.),\nvec3(0.612476,0.705252,0.),\nvec3(-0.578845,-0.768792,0.),\nvec3(-0.772454,-0.090976,0.),\nvec3(0.504440,0.372295,0.),\nvec3(0.155736,0.065157,0.),\nvec3(0.391522,0.849605,0.),\nvec3(-0.620106,-0.328104,0.),\nvec3(0.789239,-0.419965,0.),\nvec3(-0.545396,0.538133,0.),\nvec3(-0.178564,-0.596057,0.)\n);\n\n\n\n\n\n#define inline\nfloat computeShadowWithCSMPCSS(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArray depthSampler,highp sampler2DArrayShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff,int searchTapCount,int pcfTapCount,vec3[64] poissonSamplers,vec2 lightSizeUVCorrection,float depthCorrection,float penumbraDarkness)\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));\nuvDepth.z=clamp(uvDepth.z,0.,GREATEST_LESS_THAN_ONE);\nvec4 uvDepthLayer=vec4(uvDepth.x,uvDepth.y,layer,uvDepth.z);\nfloat blockerDepth=0.0;\nfloat sumBlockerDepth=0.0;\nfloat numBlocker=0.0;\nfor (int i=0; i<searchTapCount; i ++) {\nblockerDepth=texture(depthSampler,vec3(uvDepth.xy+(lightSizeUV*lightSizeUVCorrection*shadowMapSizeInverse*PoissonSamplers32[i].xy),layer)).r;\nif (blockerDepth<depthMetric) {\nsumBlockerDepth+=blockerDepth;\nnumBlocker++;\n}\n}\nif (numBlocker<1.0) {\nreturn 1.0;\n}\nelse\n{\nfloat avgBlockerDepth=sumBlockerDepth/numBlocker;\n\nfloat AAOffset=shadowMapSizeInverse*10.;\n\n\nfloat penumbraRatio=((depthMetric-avgBlockerDepth)*depthCorrection+AAOffset);\nvec4 filterRadius=vec4(penumbraRatio*lightSizeUV*lightSizeUVCorrection*shadowMapSizeInverse,0.,0.);\nfloat random=getRand(vPositionFromLight.xy);\nfloat rotationAngle=random*3.1415926;\nvec2 rotationVector=vec2(cos(rotationAngle),sin(rotationAngle));\nfloat shadow=0.;\nfor (int i=0; i<pcfTapCount; i++) {\nvec4 offset=vec4(poissonSamplers[i],0.);\n\noffset=vec4(offset.x*rotationVector.x-offset.y*rotationVector.y,offset.y*rotationVector.x+offset.x*rotationVector.y,0.,0.);\nshadow+=texture2D(shadowSampler,uvDepthLayer+offset*filterRadius);\n}\nshadow/=float(pcfTapCount);\n\nshadow=mix(shadow,1.,min((depthMetric-avgBlockerDepth)*depthCorrection*penumbraDarkness,1.));\n\nshadow=mix(darkness,1.,shadow);\n\nreturn computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);\n}\n}\n\n\n\n\n\n#define inline\nfloat computeShadowWithPCSS(vec4 vPositionFromLight,float depthMetric,sampler2D depthSampler,sampler2DShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff,int searchTapCount,int pcfTapCount,vec3[64] poissonSamplers)\n{\nif (depthMetric>1.0 || depthMetric<0.0) {\nreturn 1.0;\n}\nelse\n{\nvec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;\nvec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));\nfloat blockerDepth=0.0;\nfloat sumBlockerDepth=0.0;\nfloat numBlocker=0.0;\nfor (int i=0; i<searchTapCount; i ++) {\nblockerDepth=texture(depthSampler,uvDepth.xy+(lightSizeUV*shadowMapSizeInverse*PoissonSamplers32[i].xy)).r;\nif (blockerDepth<depthMetric) {\nsumBlockerDepth+=blockerDepth;\nnumBlocker++;\n}\n}\nif (numBlocker<1.0) {\nreturn 1.0;\n}\nelse\n{\nfloat avgBlockerDepth=sumBlockerDepth/numBlocker;\n\nfloat AAOffset=shadowMapSizeInverse*10.;\n\n\nfloat penumbraRatio=((depthMetric-avgBlockerDepth)+AAOffset);\nfloat filterRadius=penumbraRatio*lightSizeUV*shadowMapSizeInverse;\nfloat random=getRand(vPositionFromLight.xy);\nfloat rotationAngle=random*3.1415926;\nvec2 rotationVector=vec2(cos(rotationAngle),sin(rotationAngle));\nfloat shadow=0.;\nfor (int i=0; i<pcfTapCount; i++) {\nvec3 offset=poissonSamplers[i];\n\noffset=vec3(offset.x*rotationVector.x-offset.y*rotationVector.y,offset.y*rotationVector.x+offset.x*rotationVector.y,0.);\nshadow+=texture2D(shadowSampler,uvDepth+offset*filterRadius);\n}\nshadow/=float(pcfTapCount);\n\nshadow=mix(shadow,1.,depthMetric-avgBlockerDepth);\n\nshadow=mix(darkness,1.,shadow);\n\nreturn computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);\n}\n}\n}\n#define inline\nfloat computeShadowWithPCSS16(vec4 vPositionFromLight,float depthMetric,sampler2D depthSampler,sampler2DShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff)\n{\nreturn computeShadowWithPCSS(vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,16,16,PoissonSamplers32);\n}\n#define inline\nfloat computeShadowWithPCSS32(vec4 vPositionFromLight,float depthMetric,sampler2D depthSampler,sampler2DShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff)\n{\nreturn computeShadowWithPCSS(vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,16,32,PoissonSamplers32);\n}\n#define inline\nfloat computeShadowWithPCSS64(vec4 vPositionFromLight,float depthMetric,sampler2D depthSampler,sampler2DShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff)\n{\nreturn computeShadowWithPCSS(vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,32,64,PoissonSamplers64);\n}\n#define inline\nfloat computeShadowWithCSMPCSS16(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArray depthSampler,highp sampler2DArrayShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff,vec2 lightSizeUVCorrection,float depthCorrection,float penumbraDarkness)\n{\nreturn computeShadowWithCSMPCSS(layer,vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,16,16,PoissonSamplers32,lightSizeUVCorrection,depthCorrection,penumbraDarkness);\n}\n#define inline\nfloat computeShadowWithCSMPCSS32(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArray depthSampler,highp sampler2DArrayShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff,vec2 lightSizeUVCorrection,float depthCorrection,float penumbraDarkness)\n{\nreturn computeShadowWithCSMPCSS(layer,vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,16,32,PoissonSamplers32,lightSizeUVCorrection,depthCorrection,penumbraDarkness);\n}\n#define inline\nfloat computeShadowWithCSMPCSS64(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArray depthSampler,highp sampler2DArrayShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff,vec2 lightSizeUVCorrection,float depthCorrection,float penumbraDarkness)\n{\nreturn computeShadowWithCSMPCSS(layer,vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,32,64,PoissonSamplers64,lightSizeUVCorrection,depthCorrection,penumbraDarkness);\n}\n#endif\n#endif\n";
Effect.IncludesShadersStore[name$6] = shader$6;

var name$7 = 'fresnelFunction';
var shader$7 = "#ifdef FRESNEL\nfloat computeFresnelTerm(vec3 viewDirection,vec3 worldNormal,float bias,float power)\n{\nfloat fresnelTerm=pow(bias+abs(dot(viewDirection,worldNormal)),power);\nreturn clamp(fresnelTerm,0.,1.);\n}\n#endif";
Effect.IncludesShadersStore[name$7] = shader$7;

var name$8 = 'reflectionFunction';
var shader$8 = "vec3 parallaxCorrectNormal( vec3 vertexPos,vec3 origVec,vec3 cubeSize,vec3 cubePos ) {\n\nvec3 invOrigVec=vec3(1.0,1.0,1.0)/origVec;\nvec3 halfSize=cubeSize*0.5;\nvec3 intersecAtMaxPlane=(cubePos+halfSize-vertexPos)*invOrigVec;\nvec3 intersecAtMinPlane=(cubePos-halfSize-vertexPos)*invOrigVec;\n\nvec3 largestIntersec=max(intersecAtMaxPlane,intersecAtMinPlane);\n\nfloat distance=min(min(largestIntersec.x,largestIntersec.y),largestIntersec.z);\n\nvec3 intersectPositionWS=vertexPos+origVec*distance;\n\nreturn intersectPositionWS-cubePos;\n}\nvec3 computeFixedEquirectangularCoords(vec4 worldPos,vec3 worldNormal,vec3 direction)\n{\nfloat lon=atan(direction.z,direction.x);\nfloat lat=acos(direction.y);\nvec2 sphereCoords=vec2(lon,lat)*RECIPROCAL_PI2*2.0;\nfloat s=sphereCoords.x*0.5+0.5;\nfloat t=sphereCoords.y;\nreturn vec3(s,t,0);\n}\nvec3 computeMirroredFixedEquirectangularCoords(vec4 worldPos,vec3 worldNormal,vec3 direction)\n{\nfloat lon=atan(direction.z,direction.x);\nfloat lat=acos(direction.y);\nvec2 sphereCoords=vec2(lon,lat)*RECIPROCAL_PI2*2.0;\nfloat s=sphereCoords.x*0.5+0.5;\nfloat t=sphereCoords.y;\nreturn vec3(1.0-s,t,0);\n}\nvec3 computeEquirectangularCoords(vec4 worldPos,vec3 worldNormal,vec3 eyePosition,mat4 reflectionMatrix)\n{\nvec3 cameraToVertex=normalize(worldPos.xyz-eyePosition);\nvec3 r=normalize(reflect(cameraToVertex,worldNormal));\nr=vec3(reflectionMatrix*vec4(r,0));\nfloat lon=atan(r.z,r.x);\nfloat lat=acos(r.y);\nvec2 sphereCoords=vec2(lon,lat)*RECIPROCAL_PI2*2.0;\nfloat s=sphereCoords.x*0.5+0.5;\nfloat t=sphereCoords.y;\nreturn vec3(s,t,0);\n}\nvec3 computeSphericalCoords(vec4 worldPos,vec3 worldNormal,mat4 view,mat4 reflectionMatrix)\n{\nvec3 viewDir=normalize(vec3(view*worldPos));\nvec3 viewNormal=normalize(vec3(view*vec4(worldNormal,0.0)));\nvec3 r=reflect(viewDir,viewNormal);\nr=vec3(reflectionMatrix*vec4(r,0));\nr.z=r.z-1.0;\nfloat m=2.0*length(r);\nreturn vec3(r.x/m+0.5,1.0-r.y/m-0.5,0);\n}\nvec3 computePlanarCoords(vec4 worldPos,vec3 worldNormal,vec3 eyePosition,mat4 reflectionMatrix)\n{\nvec3 viewDir=worldPos.xyz-eyePosition;\nvec3 coords=normalize(reflect(viewDir,worldNormal));\nreturn vec3(reflectionMatrix*vec4(coords,1));\n}\nvec3 computeCubicCoords(vec4 worldPos,vec3 worldNormal,vec3 eyePosition,mat4 reflectionMatrix)\n{\nvec3 viewDir=normalize(worldPos.xyz-eyePosition);\n\nvec3 coords=reflect(viewDir,worldNormal);\ncoords=vec3(reflectionMatrix*vec4(coords,0));\n#ifdef INVERTCUBICMAP\ncoords.y*=-1.0;\n#endif\nreturn coords;\n}\nvec3 computeCubicLocalCoords(vec4 worldPos,vec3 worldNormal,vec3 eyePosition,mat4 reflectionMatrix,vec3 reflectionSize,vec3 reflectionPosition)\n{\nvec3 viewDir=normalize(worldPos.xyz-eyePosition);\n\nvec3 coords=reflect(viewDir,worldNormal);\ncoords=parallaxCorrectNormal(worldPos.xyz,coords,reflectionSize,reflectionPosition);\ncoords=vec3(reflectionMatrix*vec4(coords,0));\n#ifdef INVERTCUBICMAP\ncoords.y*=-1.0;\n#endif\nreturn coords;\n}\nvec3 computeProjectionCoords(vec4 worldPos,mat4 view,mat4 reflectionMatrix)\n{\nreturn vec3(reflectionMatrix*(view*worldPos));\n}\nvec3 computeSkyBoxCoords(vec3 positionW,mat4 reflectionMatrix)\n{\nreturn vec3(reflectionMatrix*vec4(positionW,1.));\n}\n#ifdef REFLECTION\nvec3 computeReflectionCoords(vec4 worldPos,vec3 worldNormal)\n{\n#ifdef REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED\nvec3 direction=normalize(vDirectionW);\nreturn computeMirroredFixedEquirectangularCoords(worldPos,worldNormal,direction);\n#endif\n#ifdef REFLECTIONMAP_EQUIRECTANGULAR_FIXED\nvec3 direction=normalize(vDirectionW);\nreturn computeFixedEquirectangularCoords(worldPos,worldNormal,direction);\n#endif\n#ifdef REFLECTIONMAP_EQUIRECTANGULAR\nreturn computeEquirectangularCoords(worldPos,worldNormal,vEyePosition.xyz,reflectionMatrix);\n#endif\n#ifdef REFLECTIONMAP_SPHERICAL\nreturn computeSphericalCoords(worldPos,worldNormal,view,reflectionMatrix);\n#endif\n#ifdef REFLECTIONMAP_PLANAR\nreturn computePlanarCoords(worldPos,worldNormal,vEyePosition.xyz,reflectionMatrix);\n#endif\n#ifdef REFLECTIONMAP_CUBIC\n#ifdef USE_LOCAL_REFLECTIONMAP_CUBIC\nreturn computeCubicLocalCoords(worldPos,worldNormal,vEyePosition.xyz,reflectionMatrix,vReflectionSize,vReflectionPosition);\n#else\nreturn computeCubicCoords(worldPos,worldNormal,vEyePosition.xyz,reflectionMatrix);\n#endif\n#endif\n#ifdef REFLECTIONMAP_PROJECTION\nreturn computeProjectionCoords(worldPos,view,reflectionMatrix);\n#endif\n#ifdef REFLECTIONMAP_SKYBOX\nreturn computeSkyBoxCoords(vPositionUVW,reflectionMatrix);\n#endif\n#ifdef REFLECTIONMAP_EXPLICIT\nreturn vec3(0,0,0);\n#endif\n}\n#endif";
Effect.IncludesShadersStore[name$8] = shader$8;

var name$9 = 'bumpFragmentMainFunctions';
var shader$9 = "#if defined(BUMP) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(DETAIL)\n#if defined(TANGENT) && defined(NORMAL)\nvarying mat3 vTBN;\n#endif\n#ifdef OBJECTSPACE_NORMALMAP\nuniform mat4 normalMatrix;\n#endif\nvec3 perturbNormalBase(mat3 cotangentFrame,vec3 normal,float scale)\n{\n#ifdef NORMALXYSCALE\nnormal=normalize(normal*vec3(scale,scale,1.0));\n#endif\nreturn normalize(cotangentFrame*normal);\n}\nvec3 perturbNormal(mat3 cotangentFrame,vec3 textureSample,float scale)\n{\nreturn perturbNormalBase(cotangentFrame,textureSample*2.0-1.0,scale);\n}\n\nmat3 cotangent_frame(vec3 normal,vec3 p,vec2 uv,vec2 tangentSpaceParams)\n{\n\nuv=gl_FrontFacing ? uv : -uv;\n\nvec3 dp1=dFdx(p);\nvec3 dp2=dFdy(p);\nvec2 duv1=dFdx(uv);\nvec2 duv2=dFdy(uv);\n\nvec3 dp2perp=cross(dp2,normal);\nvec3 dp1perp=cross(normal,dp1);\nvec3 tangent=dp2perp*duv1.x+dp1perp*duv2.x;\nvec3 bitangent=dp2perp*duv1.y+dp1perp*duv2.y;\n\ntangent*=tangentSpaceParams.x;\nbitangent*=tangentSpaceParams.y;\n\nfloat invmax=inversesqrt(max(dot(tangent,tangent),dot(bitangent,bitangent)));\nreturn mat3(tangent*invmax,bitangent*invmax,normal);\n}\n#endif\n";
Effect.IncludesShadersStore[name$9] = shader$9;

var name$a = 'bumpFragmentFunctions';
var shader$a = "#if defined(BUMP)\n#if BUMPDIRECTUV == 1\n#define vBumpUV vMainUV1\n#elif BUMPDIRECTUV == 2\n#define vBumpUV vMainUV2\n#else\nvarying vec2 vBumpUV;\n#endif\nuniform sampler2D bumpSampler;\nvec3 perturbNormal(mat3 cotangentFrame,vec2 uv)\n{\nreturn perturbNormal(cotangentFrame,texture2D(bumpSampler,uv).xyz,vBumpInfos.y);\n}\n#endif\n#if defined(DETAIL)\n#if DETAILDIRECTUV == 1\n#define vDetailUV vMainUV1\n#elif DETAILDIRECTUV == 2\n#define vDetailUV vMainUV2\n#else\nvarying vec2 vDetailUV;\n#endif\nuniform sampler2D detailSampler;\n#endif\n#if defined(BUMP)\nvec3 perturbNormal(mat3 cotangentFrame,vec3 color)\n{\nreturn perturbNormal(cotangentFrame,color,vBumpInfos.y);\n}\n\nmat3 cotangent_frame(vec3 normal,vec3 p,vec2 uv)\n{\nreturn cotangent_frame(normal,p,uv,vTangentSpaceParams);\n}\n#endif\n#if defined(BUMP) && defined(PARALLAX)\nconst float minSamples=4.;\nconst float maxSamples=15.;\nconst int iMaxSamples=15;\n\nvec2 parallaxOcclusion(vec3 vViewDirCoT,vec3 vNormalCoT,vec2 texCoord,float parallaxScale) {\nfloat parallaxLimit=length(vViewDirCoT.xy)/vViewDirCoT.z;\nparallaxLimit*=parallaxScale;\nvec2 vOffsetDir=normalize(vViewDirCoT.xy);\nvec2 vMaxOffset=vOffsetDir*parallaxLimit;\nfloat numSamples=maxSamples+(dot(vViewDirCoT,vNormalCoT)*(minSamples-maxSamples));\nfloat stepSize=1.0/numSamples;\n\nfloat currRayHeight=1.0;\nvec2 vCurrOffset=vec2(0,0);\nvec2 vLastOffset=vec2(0,0);\nfloat lastSampledHeight=1.0;\nfloat currSampledHeight=1.0;\nfor (int i=0; i<iMaxSamples; i++)\n{\ncurrSampledHeight=texture2D(bumpSampler,vBumpUV+vCurrOffset).w;\n\nif (currSampledHeight>currRayHeight)\n{\nfloat delta1=currSampledHeight-currRayHeight;\nfloat delta2=(currRayHeight+stepSize)-lastSampledHeight;\nfloat ratio=delta1/(delta1+delta2);\nvCurrOffset=(ratio)* vLastOffset+(1.0-ratio)*vCurrOffset;\n\nbreak;\n}\nelse\n{\ncurrRayHeight-=stepSize;\nvLastOffset=vCurrOffset;\nvCurrOffset+=stepSize*vMaxOffset;\nlastSampledHeight=currSampledHeight;\n}\n}\nreturn vCurrOffset;\n}\nvec2 parallaxOffset(vec3 viewDir,float heightScale)\n{\n\nfloat height=texture2D(bumpSampler,vBumpUV).w;\nvec2 texCoordOffset=heightScale*viewDir.xy*height;\nreturn -texCoordOffset;\n}\n#endif";
Effect.IncludesShadersStore[name$a] = shader$a;

var name$b = 'logDepthDeclaration';
var shader$b = "#ifdef LOGARITHMICDEPTH\nuniform float logarithmicDepthConstant;\nvarying float vFragmentDepth;\n#endif";
Effect.IncludesShadersStore[name$b] = shader$b;

var name$c = 'fogFragmentDeclaration';
var shader$c = "#ifdef FOG\n#define FOGMODE_NONE 0.\n#define FOGMODE_EXP 1.\n#define FOGMODE_EXP2 2.\n#define FOGMODE_LINEAR 3.\n#define E 2.71828\nuniform vec4 vFogInfos;\nuniform vec3 vFogColor;\nvarying vec3 vFogDistance;\nfloat CalcFogFactor()\n{\nfloat fogCoeff=1.0;\nfloat fogStart=vFogInfos.y;\nfloat fogEnd=vFogInfos.z;\nfloat fogDensity=vFogInfos.w;\nfloat fogDistance=length(vFogDistance);\nif (FOGMODE_LINEAR == vFogInfos.x)\n{\nfogCoeff=(fogEnd-fogDistance)/(fogEnd-fogStart);\n}\nelse if (FOGMODE_EXP == vFogInfos.x)\n{\nfogCoeff=1.0/pow(E,fogDistance*fogDensity);\n}\nelse if (FOGMODE_EXP2 == vFogInfos.x)\n{\nfogCoeff=1.0/pow(E,fogDistance*fogDistance*fogDensity*fogDensity);\n}\nreturn clamp(fogCoeff,0.0,1.0);\n}\n#endif";
Effect.IncludesShadersStore[name$c] = shader$c;

var name$d = 'bumpFragment';
var shader$d = "vec2 uvOffset=vec2(0.0,0.0);\n#if defined(BUMP) || defined(PARALLAX) || defined(DETAIL)\n#ifdef NORMALXYSCALE\nfloat normalScale=1.0;\n#elif defined(BUMP)\nfloat normalScale=vBumpInfos.y;\n#else\nfloat normalScale=1.0;\n#endif\n#if defined(TANGENT) && defined(NORMAL)\nmat3 TBN=vTBN;\n#elif defined(BUMP)\nmat3 TBN=cotangent_frame(normalW*normalScale,vPositionW,vBumpUV);\n#else\nmat3 TBN=cotangent_frame(normalW*normalScale,vPositionW,vDetailUV,vec2(1.,1.));\n#endif\n#elif defined(ANISOTROPIC)\n#if defined(TANGENT) && defined(NORMAL)\nmat3 TBN=vTBN;\n#else\nmat3 TBN=cotangent_frame(normalW,vPositionW,vMainUV1,vec2(1.,1.));\n#endif\n#endif\n#ifdef PARALLAX\nmat3 invTBN=transposeMat3(TBN);\n#ifdef PARALLAXOCCLUSION\nuvOffset=parallaxOcclusion(invTBN*-viewDirectionW,invTBN*normalW,vBumpUV,vBumpInfos.z);\n#else\nuvOffset=parallaxOffset(invTBN*viewDirectionW,vBumpInfos.z);\n#endif\n#endif\n#ifdef DETAIL\nvec4 detailColor=texture2D(detailSampler,vDetailUV+uvOffset);\nvec2 detailNormalRG=detailColor.wy*2.0-1.0;\nfloat detailNormalB=sqrt(1.-saturate(dot(detailNormalRG,detailNormalRG)));\nvec3 detailNormal=vec3(detailNormalRG,detailNormalB);\n#endif\n#ifdef BUMP\n#ifdef OBJECTSPACE_NORMALMAP\nnormalW=normalize(texture2D(bumpSampler,vBumpUV).xyz*2.0-1.0);\nnormalW=normalize(mat3(normalMatrix)*normalW);\n#elif !defined(DETAIL)\nnormalW=perturbNormal(TBN,vBumpUV+uvOffset);\n#else\nvec3 bumpNormal=texture2D(bumpSampler,vBumpUV+uvOffset).xyz*2.0-1.0;\n\n#if DETAIL_NORMALBLENDMETHOD == 0\ndetailNormal.xy*=vDetailInfos.z;\nvec3 blendedNormal=normalize(vec3(bumpNormal.xy+detailNormal.xy,bumpNormal.z*detailNormal.z));\n#elif DETAIL_NORMALBLENDMETHOD == 1\ndetailNormal.xy*=vDetailInfos.z;\nbumpNormal+=vec3(0.0,0.0,1.0);\ndetailNormal*=vec3(-1.0,-1.0,1.0);\nvec3 blendedNormal=bumpNormal*dot(bumpNormal,detailNormal)/bumpNormal.z-detailNormal;\n#endif\nnormalW=perturbNormalBase(TBN,blendedNormal,vBumpInfos.y);\n#endif\n#elif defined(DETAIL)\ndetailNormal.xy*=vDetailInfos.z;\nnormalW=perturbNormalBase(TBN,detailNormal,vDetailInfos.z);\n#endif";
Effect.IncludesShadersStore[name$d] = shader$d;

var name$e = 'depthPrePass';
var shader$e = "#ifdef DEPTHPREPASS\ngl_FragColor=vec4(0.,0.,0.,1.0);\nreturn;\n#endif";
Effect.IncludesShadersStore[name$e] = shader$e;

var name$f = 'lightFragment';
var shader$f = "#ifdef LIGHT{X}\n#if defined(SHADOWONLY) || defined(LIGHTMAP) && defined(LIGHTMAPEXCLUDED{X}) && defined(LIGHTMAPNOSPECULAR{X})\n\n#else\n#ifdef PBR\n\n#ifdef SPOTLIGHT{X}\npreInfo=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);\n#elif defined(POINTLIGHT{X})\npreInfo=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);\n#elif defined(HEMILIGHT{X})\npreInfo=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);\n#elif defined(DIRLIGHT{X})\npreInfo=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);\n#endif\npreInfo.NdotV=NdotV;\n\n#ifdef SPOTLIGHT{X}\n#ifdef LIGHT_FALLOFF_GLTF{X}\npreInfo.attenuation=computeDistanceLightFalloff_GLTF(preInfo.lightDistanceSquared,light{X}.vLightFalloff.y);\npreInfo.attenuation*=computeDirectionalLightFalloff_GLTF(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);\n#elif defined(LIGHT_FALLOFF_PHYSICAL{X})\npreInfo.attenuation=computeDistanceLightFalloff_Physical(preInfo.lightDistanceSquared);\npreInfo.attenuation*=computeDirectionalLightFalloff_Physical(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightDirection.w);\n#elif defined(LIGHT_FALLOFF_STANDARD{X})\npreInfo.attenuation=computeDistanceLightFalloff_Standard(preInfo.lightOffset,light{X}.vLightFalloff.x);\npreInfo.attenuation*=computeDirectionalLightFalloff_Standard(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightDirection.w,light{X}.vLightData.w);\n#else\npreInfo.attenuation=computeDistanceLightFalloff(preInfo.lightOffset,preInfo.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);\npreInfo.attenuation*=computeDirectionalLightFalloff(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightDirection.w,light{X}.vLightData.w,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);\n#endif\n#elif defined(POINTLIGHT{X})\n#ifdef LIGHT_FALLOFF_GLTF{X}\npreInfo.attenuation=computeDistanceLightFalloff_GLTF(preInfo.lightDistanceSquared,light{X}.vLightFalloff.y);\n#elif defined(LIGHT_FALLOFF_PHYSICAL{X})\npreInfo.attenuation=computeDistanceLightFalloff_Physical(preInfo.lightDistanceSquared);\n#elif defined(LIGHT_FALLOFF_STANDARD{X})\npreInfo.attenuation=computeDistanceLightFalloff_Standard(preInfo.lightOffset,light{X}.vLightFalloff.x);\n#else\npreInfo.attenuation=computeDistanceLightFalloff(preInfo.lightOffset,preInfo.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);\n#endif\n#else\npreInfo.attenuation=1.0;\n#endif\n\n\n#ifdef HEMILIGHT{X}\npreInfo.roughness=roughness;\n#else\npreInfo.roughness=adjustRoughnessFromLightProperties(roughness,light{X}.vLightSpecular.a,preInfo.lightDistance);\n#endif\n\n#ifdef HEMILIGHT{X}\ninfo.diffuse=computeHemisphericDiffuseLighting(preInfo,light{X}.vLightDiffuse.rgb,light{X}.vLightGround);\n#elif defined(SS_TRANSLUCENCY)\ninfo.diffuse=computeDiffuseAndTransmittedLighting(preInfo,light{X}.vLightDiffuse.rgb,subSurfaceOut.transmittance);\n#else\ninfo.diffuse=computeDiffuseLighting(preInfo,light{X}.vLightDiffuse.rgb);\n#endif\n\n#ifdef SPECULARTERM\n#ifdef ANISOTROPIC\ninfo.specular=computeAnisotropicSpecularLighting(preInfo,viewDirectionW,normalW,anisotropicOut.anisotropicTangent,anisotropicOut.anisotropicBitangent,anisotropicOut.anisotropy,clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,AARoughnessFactors.x,light{X}.vLightDiffuse.rgb);\n#else\ninfo.specular=computeSpecularLighting(preInfo,normalW,clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,AARoughnessFactors.x,light{X}.vLightDiffuse.rgb);\n#endif\n#endif\n\n#ifdef SHEEN\n#ifdef SHEEN_LINKWITHALBEDO\n\npreInfo.roughness=sheenOut.sheenIntensity;\n#else\n#ifdef HEMILIGHT{X}\npreInfo.roughness=sheenOut.sheenRoughness;\n#else\npreInfo.roughness=adjustRoughnessFromLightProperties(sheenOut.sheenRoughness,light{X}.vLightSpecular.a,preInfo.lightDistance);\n#endif\n#endif\ninfo.sheen=computeSheenLighting(preInfo,normalW,sheenOut.sheenColor,specularEnvironmentR90,AARoughnessFactors.x,light{X}.vLightDiffuse.rgb);\n#endif\n\n#ifdef CLEARCOAT\n\n#ifdef HEMILIGHT{X}\npreInfo.roughness=clearcoatOut.clearCoatRoughness;\n#else\npreInfo.roughness=adjustRoughnessFromLightProperties(clearcoatOut.clearCoatRoughness,light{X}.vLightSpecular.a,preInfo.lightDistance);\n#endif\ninfo.clearCoat=computeClearCoatLighting(preInfo,clearcoatOut.clearCoatNormalW,clearcoatOut.clearCoatAARoughnessFactors.x,clearcoatOut.clearCoatIntensity,light{X}.vLightDiffuse.rgb);\n#ifdef CLEARCOAT_TINT\n\nabsorption=computeClearCoatLightingAbsorption(clearcoatOut.clearCoatNdotVRefract,preInfo.L,clearcoatOut.clearCoatNormalW,clearcoatOut.clearCoatColor,clearcoatOut.clearCoatThickness,clearcoatOut.clearCoatIntensity);\ninfo.diffuse*=absorption;\n#ifdef SPECULARTERM\ninfo.specular*=absorption;\n#endif\n#endif\n\ninfo.diffuse*=info.clearCoat.w;\n#ifdef SPECULARTERM\ninfo.specular*=info.clearCoat.w;\n#endif\n#ifdef SHEEN\ninfo.sheen*=info.clearCoat.w;\n#endif\n#endif\n#else\n#ifdef SPOTLIGHT{X}\ninfo=computeSpotLighting(viewDirectionW,normalW,light{X}.vLightData,light{X}.vLightDirection,light{X}.vLightDiffuse.rgb,light{X}.vLightSpecular.rgb,light{X}.vLightDiffuse.a,glossiness);\n#elif defined(HEMILIGHT{X})\ninfo=computeHemisphericLighting(viewDirectionW,normalW,light{X}.vLightData,light{X}.vLightDiffuse.rgb,light{X}.vLightSpecular.rgb,light{X}.vLightGround,glossiness);\n#elif defined(POINTLIGHT{X}) || defined(DIRLIGHT{X})\ninfo=computeLighting(viewDirectionW,normalW,light{X}.vLightData,light{X}.vLightDiffuse.rgb,light{X}.vLightSpecular.rgb,light{X}.vLightDiffuse.a,glossiness);\n#endif\n#endif\n#ifdef PROJECTEDLIGHTTEXTURE{X}\ninfo.diffuse*=computeProjectionTextureDiffuseLighting(projectionLightSampler{X},textureProjectionMatrix{X});\n#endif\n#endif\n#ifdef SHADOW{X}\n#ifdef SHADOWCSM{X}\nfor (int i=0; i<SHADOWCSMNUM_CASCADES{X}; i++)\n{\n#ifdef SHADOWCSM_RIGHTHANDED{X}\ndiff{X}=viewFrustumZ{X}[i]+vPositionFromCamera{X}.z;\n#else\ndiff{X}=viewFrustumZ{X}[i]-vPositionFromCamera{X}.z;\n#endif\nif (diff{X}>=0.) {\nindex{X}=i;\nbreak;\n}\n}\n#ifdef SHADOWCSMUSESHADOWMAXZ{X}\nif (index{X}>=0)\n#endif\n{\n#if defined(SHADOWPCF{X})\n#if defined(SHADOWLOWQUALITY{X})\nshadow=computeShadowWithCSMPCF1(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#elif defined(SHADOWMEDIUMQUALITY{X})\nshadow=computeShadowWithCSMPCF3(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#else\nshadow=computeShadowWithCSMPCF5(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#endif\n#elif defined(SHADOWPCSS{X})\n#if defined(SHADOWLOWQUALITY{X})\nshadow=computeShadowWithCSMPCSS16(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});\n#elif defined(SHADOWMEDIUMQUALITY{X})\nshadow=computeShadowWithCSMPCSS32(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});\n#else\nshadow=computeShadowWithCSMPCSS64(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});\n#endif\n#else\nshadow=computeShadowCSM(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#endif\n#ifdef SHADOWCSMDEBUG{X}\nshadowDebug{X}=vec3(shadow)*vCascadeColorsMultiplier{X}[index{X}];\n#endif\n#ifndef SHADOWCSMNOBLEND{X}\nfloat frustumLength=frustumLengths{X}[index{X}];\nfloat diffRatio=clamp(diff{X}/frustumLength,0.,1.)*cascadeBlendFactor{X};\nif (index{X}<(SHADOWCSMNUM_CASCADES{X}-1) && diffRatio<1.)\n{\nindex{X}+=1;\nfloat nextShadow=0.;\n#if defined(SHADOWPCF{X})\n#if defined(SHADOWLOWQUALITY{X})\nnextShadow=computeShadowWithCSMPCF1(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#elif defined(SHADOWMEDIUMQUALITY{X})\nnextShadow=computeShadowWithCSMPCF3(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#else\nnextShadow=computeShadowWithCSMPCF5(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#endif\n#elif defined(SHADOWPCSS{X})\n#if defined(SHADOWLOWQUALITY{X})\nnextShadow=computeShadowWithCSMPCSS16(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});\n#elif defined(SHADOWMEDIUMQUALITY{X})\nnextShadow=computeShadowWithCSMPCSS32(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});\n#else\nnextShadow=computeShadowWithCSMPCSS64(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});\n#endif\n#else\nnextShadow=computeShadowCSM(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#endif\nshadow=mix(nextShadow,shadow,diffRatio);\n#ifdef SHADOWCSMDEBUG{X}\nshadowDebug{X}=mix(vec3(nextShadow)*vCascadeColorsMultiplier{X}[index{X}],shadowDebug{X},diffRatio);\n#endif\n}\n#endif\n}\n#elif defined(SHADOWCLOSEESM{X})\n#if defined(SHADOWCUBE{X})\nshadow=computeShadowWithCloseESMCube(light{X}.vLightData.xyz,shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.depthValues);\n#else\nshadow=computeShadowWithCloseESM(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.shadowsInfo.w);\n#endif\n#elif defined(SHADOWESM{X})\n#if defined(SHADOWCUBE{X})\nshadow=computeShadowWithESMCube(light{X}.vLightData.xyz,shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.depthValues);\n#else\nshadow=computeShadowWithESM(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.shadowsInfo.w);\n#endif\n#elif defined(SHADOWPOISSON{X})\n#if defined(SHADOWCUBE{X})\nshadow=computeShadowWithPoissonSamplingCube(light{X}.vLightData.xyz,shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.x,light{X}.depthValues);\n#else\nshadow=computeShadowWithPoissonSampling(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#endif\n#elif defined(SHADOWPCF{X})\n#if defined(SHADOWLOWQUALITY{X})\nshadow=computeShadowWithPCF1(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#elif defined(SHADOWMEDIUMQUALITY{X})\nshadow=computeShadowWithPCF3(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#else\nshadow=computeShadowWithPCF5(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#endif\n#elif defined(SHADOWPCSS{X})\n#if defined(SHADOWLOWQUALITY{X})\nshadow=computeShadowWithPCSS16(vPositionFromLight{X},vDepthMetric{X},depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#elif defined(SHADOWMEDIUMQUALITY{X})\nshadow=computeShadowWithPCSS32(vPositionFromLight{X},vDepthMetric{X},depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#else\nshadow=computeShadowWithPCSS64(vPositionFromLight{X},vDepthMetric{X},depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#endif\n#else\n#if defined(SHADOWCUBE{X})\nshadow=computeShadowCube(light{X}.vLightData.xyz,shadowSampler{X},light{X}.shadowsInfo.x,light{X}.depthValues);\n#else\nshadow=computeShadow(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);\n#endif\n#endif\n#ifdef SHADOWONLY\n#ifndef SHADOWINUSE\n#define SHADOWINUSE\n#endif\nglobalShadow+=shadow;\nshadowLightCount+=1.0;\n#endif\n#else\nshadow=1.;\n#endif\n#ifndef SHADOWONLY\n#ifdef CUSTOMUSERLIGHTING\ndiffuseBase+=computeCustomDiffuseLighting(info,diffuseBase,shadow);\n#ifdef SPECULARTERM\nspecularBase+=computeCustomSpecularLighting(info,specularBase,shadow);\n#endif\n#elif defined(LIGHTMAP) && defined(LIGHTMAPEXCLUDED{X})\ndiffuseBase+=lightmapColor.rgb*shadow;\n#ifdef SPECULARTERM\n#ifndef LIGHTMAPNOSPECULAR{X}\nspecularBase+=info.specular*shadow*lightmapColor.rgb;\n#endif\n#endif\n#ifdef CLEARCOAT\n#ifndef LIGHTMAPNOSPECULAR{X}\nclearCoatBase+=info.clearCoat.rgb*shadow*lightmapColor.rgb;\n#endif\n#endif\n#ifdef SHEEN\n#ifndef LIGHTMAPNOSPECULAR{X}\nsheenBase+=info.sheen.rgb*shadow;\n#endif\n#endif\n#else\n#ifdef SHADOWCSMDEBUG{X}\ndiffuseBase+=info.diffuse*shadowDebug{X};\n#else\ndiffuseBase+=info.diffuse*shadow;\n#endif\n#ifdef SPECULARTERM\nspecularBase+=info.specular*shadow;\n#endif\n#ifdef CLEARCOAT\nclearCoatBase+=info.clearCoat.rgb*shadow;\n#endif\n#ifdef SHEEN\nsheenBase+=info.sheen.rgb*shadow;\n#endif\n#endif\n#endif\n#endif";
Effect.IncludesShadersStore[name$f] = shader$f;

var name$g = 'logDepthFragment';
var shader$g = "#ifdef LOGARITHMICDEPTH\ngl_FragDepthEXT=log2(vFragmentDepth)*logarithmicDepthConstant*0.5;\n#endif";
Effect.IncludesShadersStore[name$g] = shader$g;

var name$h = 'fogFragment';
var shader$h = "#ifdef FOG\nfloat fog=CalcFogFactor();\ncolor.rgb=fog*color.rgb+(1.0-fog)*vFogColor;\n#endif";
Effect.IncludesShadersStore[name$h] = shader$h;

var name$i = 'defaultPixelShader';
var shader$i = "#include<__decl__defaultFragment>\n#if defined(BUMP) || !defined(NORMAL)\n#extension GL_OES_standard_derivatives : enable\n#endif\n#include<prePassDeclaration>[SCENE_MRT_COUNT]\n#define CUSTOM_FRAGMENT_BEGIN\n#ifdef LOGARITHMICDEPTH\n#extension GL_EXT_frag_depth : enable\n#endif\n\n#define RECIPROCAL_PI2 0.15915494\nuniform vec3 vEyePosition;\nuniform vec3 vAmbientColor;\n\nvarying vec3 vPositionW;\n#ifdef NORMAL\nvarying vec3 vNormalW;\n#endif\n#ifdef VERTEXCOLOR\nvarying vec4 vColor;\n#endif\n#ifdef MAINUV1\nvarying vec2 vMainUV1;\n#endif\n#ifdef MAINUV2\nvarying vec2 vMainUV2;\n#endif\n\n#include<helperFunctions>\n\n#include<__decl__lightFragment>[0..maxSimultaneousLights]\n#include<lightsFragmentFunctions>\n#include<shadowsFragmentFunctions>\n\n#ifdef DIFFUSE\n#if DIFFUSEDIRECTUV == 1\n#define vDiffuseUV vMainUV1\n#elif DIFFUSEDIRECTUV == 2\n#define vDiffuseUV vMainUV2\n#else\nvarying vec2 vDiffuseUV;\n#endif\nuniform sampler2D diffuseSampler;\n#endif\n#ifdef AMBIENT\n#if AMBIENTDIRECTUV == 1\n#define vAmbientUV vMainUV1\n#elif AMBIENTDIRECTUV == 2\n#define vAmbientUV vMainUV2\n#else\nvarying vec2 vAmbientUV;\n#endif\nuniform sampler2D ambientSampler;\n#endif\n#ifdef OPACITY\n#if OPACITYDIRECTUV == 1\n#define vOpacityUV vMainUV1\n#elif OPACITYDIRECTUV == 2\n#define vOpacityUV vMainUV2\n#else\nvarying vec2 vOpacityUV;\n#endif\nuniform sampler2D opacitySampler;\n#endif\n#ifdef EMISSIVE\n#if EMISSIVEDIRECTUV == 1\n#define vEmissiveUV vMainUV1\n#elif EMISSIVEDIRECTUV == 2\n#define vEmissiveUV vMainUV2\n#else\nvarying vec2 vEmissiveUV;\n#endif\nuniform sampler2D emissiveSampler;\n#endif\n#ifdef LIGHTMAP\n#if LIGHTMAPDIRECTUV == 1\n#define vLightmapUV vMainUV1\n#elif LIGHTMAPDIRECTUV == 2\n#define vLightmapUV vMainUV2\n#else\nvarying vec2 vLightmapUV;\n#endif\nuniform sampler2D lightmapSampler;\n#endif\n#ifdef REFRACTION\n#ifdef REFRACTIONMAP_3D\nuniform samplerCube refractionCubeSampler;\n#else\nuniform sampler2D refraction2DSampler;\n#endif\n#endif\n#if defined(SPECULAR) && defined(SPECULARTERM)\n#if SPECULARDIRECTUV == 1\n#define vSpecularUV vMainUV1\n#elif SPECULARDIRECTUV == 2\n#define vSpecularUV vMainUV2\n#else\nvarying vec2 vSpecularUV;\n#endif\nuniform sampler2D specularSampler;\n#endif\n#ifdef ALPHATEST\nuniform float alphaCutOff;\n#endif\n\n#include<fresnelFunction>\n\n#ifdef REFLECTION\n#ifdef REFLECTIONMAP_3D\nuniform samplerCube reflectionCubeSampler;\n#else\nuniform sampler2D reflection2DSampler;\n#endif\n#ifdef REFLECTIONMAP_SKYBOX\nvarying vec3 vPositionUVW;\n#else\n#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)\nvarying vec3 vDirectionW;\n#endif\n#endif\n#include<reflectionFunction>\n#endif\n#include<imageProcessingDeclaration>\n#include<imageProcessingFunctions>\n#include<bumpFragmentMainFunctions>\n#include<bumpFragmentFunctions>\n#include<clipPlaneFragmentDeclaration>\n#include<logDepthDeclaration>\n#include<fogFragmentDeclaration>\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void) {\n#define CUSTOM_FRAGMENT_MAIN_BEGIN\n#include<clipPlaneFragment>\nvec3 viewDirectionW=normalize(vEyePosition-vPositionW);\n\nvec4 baseColor=vec4(1.,1.,1.,1.);\nvec3 diffuseColor=vDiffuseColor.rgb;\n\nfloat alpha=vDiffuseColor.a;\n\n#ifdef NORMAL\nvec3 normalW=normalize(vNormalW);\n#else\nvec3 normalW=normalize(-cross(dFdx(vPositionW),dFdy(vPositionW)));\n#endif\n#include<bumpFragment>\n#ifdef TWOSIDEDLIGHTING\nnormalW=gl_FrontFacing ? normalW : -normalW;\n#endif\n#ifdef DIFFUSE\nbaseColor=texture2D(diffuseSampler,vDiffuseUV+uvOffset);\n#if defined(ALPHATEST) && !defined(ALPHATEST_AFTERALLALPHACOMPUTATIONS)\nif (baseColor.a<alphaCutOff)\ndiscard;\n#endif\n#ifdef ALPHAFROMDIFFUSE\nalpha*=baseColor.a;\n#endif\n#define CUSTOM_FRAGMENT_UPDATE_ALPHA\nbaseColor.rgb*=vDiffuseInfos.y;\n#endif\n#include<depthPrePass>\n#ifdef VERTEXCOLOR\nbaseColor.rgb*=vColor.rgb;\n#endif\n#ifdef DETAIL\nbaseColor.rgb=baseColor.rgb*2.0*mix(0.5,detailColor.r,vDetailInfos.y);\n#endif\n#define CUSTOM_FRAGMENT_UPDATE_DIFFUSE\n\nvec3 baseAmbientColor=vec3(1.,1.,1.);\n#ifdef AMBIENT\nbaseAmbientColor=texture2D(ambientSampler,vAmbientUV+uvOffset).rgb*vAmbientInfos.y;\n#endif\n#define CUSTOM_FRAGMENT_BEFORE_LIGHTS\n\n#ifdef SPECULARTERM\nfloat glossiness=vSpecularColor.a;\nvec3 specularColor=vSpecularColor.rgb;\n#ifdef SPECULAR\nvec4 specularMapColor=texture2D(specularSampler,vSpecularUV+uvOffset);\nspecularColor=specularMapColor.rgb;\n#ifdef GLOSSINESS\nglossiness=glossiness*specularMapColor.a;\n#endif\n#endif\n#else\nfloat glossiness=0.;\n#endif\n\nvec3 diffuseBase=vec3(0.,0.,0.);\nlightingInfo info;\n#ifdef SPECULARTERM\nvec3 specularBase=vec3(0.,0.,0.);\n#endif\nfloat shadow=1.;\n#ifdef LIGHTMAP\nvec4 lightmapColor=texture2D(lightmapSampler,vLightmapUV+uvOffset);\n#ifdef RGBDLIGHTMAP\nlightmapColor.rgb=fromRGBD(lightmapColor);\n#endif\nlightmapColor.rgb*=vLightmapInfos.y;\n#endif\n#include<lightFragment>[0..maxSimultaneousLights]\n\nvec4 refractionColor=vec4(0.,0.,0.,1.);\n#ifdef REFRACTION\nvec3 refractionVector=normalize(refract(-viewDirectionW,normalW,vRefractionInfos.y));\n#ifdef REFRACTIONMAP_3D\nrefractionVector.y=refractionVector.y*vRefractionInfos.w;\nif (dot(refractionVector,viewDirectionW)<1.0) {\nrefractionColor=textureCube(refractionCubeSampler,refractionVector);\n}\n#else\nvec3 vRefractionUVW=vec3(refractionMatrix*(view*vec4(vPositionW+refractionVector*vRefractionInfos.z,1.0)));\nvec2 refractionCoords=vRefractionUVW.xy/vRefractionUVW.z;\nrefractionCoords.y=1.0-refractionCoords.y;\nrefractionColor=texture2D(refraction2DSampler,refractionCoords);\n#endif\n#ifdef RGBDREFRACTION\nrefractionColor.rgb=fromRGBD(refractionColor);\n#endif\n#ifdef IS_REFRACTION_LINEAR\nrefractionColor.rgb=toGammaSpace(refractionColor.rgb);\n#endif\nrefractionColor.rgb*=vRefractionInfos.x;\n#endif\n\nvec4 reflectionColor=vec4(0.,0.,0.,1.);\n#ifdef REFLECTION\nvec3 vReflectionUVW=computeReflectionCoords(vec4(vPositionW,1.0),normalW);\n#ifdef REFLECTIONMAP_3D\n#ifdef ROUGHNESS\nfloat bias=vReflectionInfos.y;\n#ifdef SPECULARTERM\n#ifdef SPECULAR\n#ifdef GLOSSINESS\nbias*=(1.0-specularMapColor.a);\n#endif\n#endif\n#endif\nreflectionColor=textureCube(reflectionCubeSampler,vReflectionUVW,bias);\n#else\nreflectionColor=textureCube(reflectionCubeSampler,vReflectionUVW);\n#endif\n#else\nvec2 coords=vReflectionUVW.xy;\n#ifdef REFLECTIONMAP_PROJECTION\ncoords/=vReflectionUVW.z;\n#endif\ncoords.y=1.0-coords.y;\nreflectionColor=texture2D(reflection2DSampler,coords);\n#endif\n#ifdef RGBDREFLECTION\nreflectionColor.rgb=fromRGBD(reflectionColor);\n#endif\n#ifdef IS_REFLECTION_LINEAR\nreflectionColor.rgb=toGammaSpace(reflectionColor.rgb);\n#endif\nreflectionColor.rgb*=vReflectionInfos.x;\n#ifdef REFLECTIONFRESNEL\nfloat reflectionFresnelTerm=computeFresnelTerm(viewDirectionW,normalW,reflectionRightColor.a,reflectionLeftColor.a);\n#ifdef REFLECTIONFRESNELFROMSPECULAR\n#ifdef SPECULARTERM\nreflectionColor.rgb*=specularColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*reflectionRightColor.rgb;\n#else\nreflectionColor.rgb*=reflectionLeftColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*reflectionRightColor.rgb;\n#endif\n#else\nreflectionColor.rgb*=reflectionLeftColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*reflectionRightColor.rgb;\n#endif\n#endif\n#endif\n#ifdef REFRACTIONFRESNEL\nfloat refractionFresnelTerm=computeFresnelTerm(viewDirectionW,normalW,refractionRightColor.a,refractionLeftColor.a);\nrefractionColor.rgb*=refractionLeftColor.rgb*(1.0-refractionFresnelTerm)+refractionFresnelTerm*refractionRightColor.rgb;\n#endif\n#ifdef OPACITY\nvec4 opacityMap=texture2D(opacitySampler,vOpacityUV+uvOffset);\n#ifdef OPACITYRGB\nopacityMap.rgb=opacityMap.rgb*vec3(0.3,0.59,0.11);\nalpha*=(opacityMap.x+opacityMap.y+opacityMap.z)* vOpacityInfos.y;\n#else\nalpha*=opacityMap.a*vOpacityInfos.y;\n#endif\n#endif\n#ifdef VERTEXALPHA\nalpha*=vColor.a;\n#endif\n#ifdef OPACITYFRESNEL\nfloat opacityFresnelTerm=computeFresnelTerm(viewDirectionW,normalW,opacityParts.z,opacityParts.w);\nalpha+=opacityParts.x*(1.0-opacityFresnelTerm)+opacityFresnelTerm*opacityParts.y;\n#endif\n#ifdef ALPHATEST\n#ifdef ALPHATEST_AFTERALLALPHACOMPUTATIONS\nif (alpha<alphaCutOff)\ndiscard;\n#endif\n#ifndef ALPHABLEND\n\nalpha=1.0;\n#endif\n#endif\n\nvec3 emissiveColor=vEmissiveColor;\n#ifdef EMISSIVE\nemissiveColor+=texture2D(emissiveSampler,vEmissiveUV+uvOffset).rgb*vEmissiveInfos.y;\n#endif\n#ifdef EMISSIVEFRESNEL\nfloat emissiveFresnelTerm=computeFresnelTerm(viewDirectionW,normalW,emissiveRightColor.a,emissiveLeftColor.a);\nemissiveColor*=emissiveLeftColor.rgb*(1.0-emissiveFresnelTerm)+emissiveFresnelTerm*emissiveRightColor.rgb;\n#endif\n\n#ifdef DIFFUSEFRESNEL\nfloat diffuseFresnelTerm=computeFresnelTerm(viewDirectionW,normalW,diffuseRightColor.a,diffuseLeftColor.a);\ndiffuseBase*=diffuseLeftColor.rgb*(1.0-diffuseFresnelTerm)+diffuseFresnelTerm*diffuseRightColor.rgb;\n#endif\n\n#ifdef EMISSIVEASILLUMINATION\nvec3 finalDiffuse=clamp(diffuseBase*diffuseColor+vAmbientColor,0.0,1.0)*baseColor.rgb;\n#else\n#ifdef LINKEMISSIVEWITHDIFFUSE\nvec3 finalDiffuse=clamp((diffuseBase+emissiveColor)*diffuseColor+vAmbientColor,0.0,1.0)*baseColor.rgb;\n#else\nvec3 finalDiffuse=clamp(diffuseBase*diffuseColor+emissiveColor+vAmbientColor,0.0,1.0)*baseColor.rgb;\n#endif\n#endif\n#ifdef SPECULARTERM\nvec3 finalSpecular=specularBase*specularColor;\n#ifdef SPECULAROVERALPHA\nalpha=clamp(alpha+dot(finalSpecular,vec3(0.3,0.59,0.11)),0.,1.);\n#endif\n#else\nvec3 finalSpecular=vec3(0.0);\n#endif\n#ifdef REFLECTIONOVERALPHA\nalpha=clamp(alpha+dot(reflectionColor.rgb,vec3(0.3,0.59,0.11)),0.,1.);\n#endif\n\n#ifdef EMISSIVEASILLUMINATION\nvec4 color=vec4(clamp(finalDiffuse*baseAmbientColor+finalSpecular+reflectionColor.rgb+emissiveColor+refractionColor.rgb,0.0,1.0),alpha);\n#else\nvec4 color=vec4(finalDiffuse*baseAmbientColor+finalSpecular+reflectionColor.rgb+refractionColor.rgb,alpha);\n#endif\n\n#ifdef LIGHTMAP\n#ifndef LIGHTMAPEXCLUDED\n#ifdef USELIGHTMAPASSHADOWMAP\ncolor.rgb*=lightmapColor.rgb;\n#else\ncolor.rgb+=lightmapColor.rgb;\n#endif\n#endif\n#endif\n#define CUSTOM_FRAGMENT_BEFORE_FOG\ncolor.rgb=max(color.rgb,0.);\n#include<logDepthFragment>\n#include<fogFragment>\n\n\n#ifdef IMAGEPROCESSINGPOSTPROCESS\ncolor.rgb=toLinearSpace(color.rgb);\n#else\n#ifdef IMAGEPROCESSING\ncolor.rgb=toLinearSpace(color.rgb);\ncolor=applyImageProcessing(color);\n#endif\n#endif\ncolor.a*=visibility;\n#ifdef PREMULTIPLYALPHA\n\ncolor.rgb*=color.a;\n#endif\n#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR\n#ifdef PREPASS\ngl_FragData[0]=color;\n#ifdef PREPASS_POSITION\ngl_FragData[PREPASS_POSITION_INDEX]=vec4(vPositionW,1.0);\n#endif\n#ifdef PREPASS_VELOCITY\nvec2 a=(vCurrentPosition.xy/vCurrentPosition.w)*0.5+0.5;\nvec2 b=(vPreviousPosition.xy/vPreviousPosition.w)*0.5+0.5;\nvec2 velocity=abs(a-b);\nvelocity=vec2(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;\ngl_FragData[PREPASS_VELOCITY_INDEX]=vec4(velocity,0.0,1.0);\n#endif\n#ifdef PREPASS_IRRADIANCE\ngl_FragData[PREPASS_IRRADIANCE_INDEX]=vec4(0.0,0.0,0.0,1.0);\n#endif\n#ifdef PREPASS_DEPTHNORMAL\ngl_FragData[PREPASS_DEPTHNORMAL_INDEX]=vec4(vViewPos.z,(view*vec4(normalW,0.0)).rgb);\n#endif\n#ifdef PREPASS_ALBEDO\ngl_FragData[PREPASS_ALBEDO_INDEX]=vec4(0.0,0.0,0.0,1.0);\n#endif\n#ifdef PREPASS_REFLECTIVITY\n#if defined(SPECULAR)\ngl_FragData[PREPASS_REFLECTIVITY_INDEX]=specularMapColor;\n#else\ngl_FragData[PREPASS_REFLECTIVITY_INDEX]=vec4(0.0,0.0,0.0,1.0);\n#endif\n#endif\n#endif\n#if !defined(PREPASS) || defined(WEBGL2)\ngl_FragColor=color;\n#endif\n}\n";
Effect.ShadersStore[name$i] = shader$i;

var name$j = 'defaultVertexDeclaration';
var shader$j = "\nuniform mat4 viewProjection;\nuniform mat4 view;\n#ifdef DIFFUSE\nuniform mat4 diffuseMatrix;\nuniform vec2 vDiffuseInfos;\n#endif\n#ifdef AMBIENT\nuniform mat4 ambientMatrix;\nuniform vec2 vAmbientInfos;\n#endif\n#ifdef OPACITY\nuniform mat4 opacityMatrix;\nuniform vec2 vOpacityInfos;\n#endif\n#ifdef EMISSIVE\nuniform vec2 vEmissiveInfos;\nuniform mat4 emissiveMatrix;\n#endif\n#ifdef LIGHTMAP\nuniform vec2 vLightmapInfos;\nuniform mat4 lightmapMatrix;\n#endif\n#if defined(SPECULAR) && defined(SPECULARTERM)\nuniform vec2 vSpecularInfos;\nuniform mat4 specularMatrix;\n#endif\n#ifdef BUMP\nuniform vec3 vBumpInfos;\nuniform mat4 bumpMatrix;\n#endif\n#ifdef REFLECTION\nuniform mat4 reflectionMatrix;\n#endif\n#ifdef POINTSIZE\nuniform float pointSize;\n#endif\n";
Effect.IncludesShadersStore[name$j] = shader$j;

var name$k = 'prePassVertexDeclaration';
var shader$k = "#ifdef PREPASS\n#ifdef PREPASS_DEPTHNORMAL\nvarying vec3 vViewPos;\n#endif\n#ifdef PREPASS_VELOCITY\nuniform mat4 previousWorld;\nuniform mat4 previousViewProjection;\nvarying vec4 vCurrentPosition;\nvarying vec4 vPreviousPosition;\n#endif\n#endif";
Effect.IncludesShadersStore[name$k] = shader$k;

var name$l = 'bumpVertexDeclaration';
var shader$l = "#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)\n#if defined(TANGENT) && defined(NORMAL)\nvarying mat3 vTBN;\n#endif\n#endif\n";
Effect.IncludesShadersStore[name$l] = shader$l;

var name$m = 'fogVertexDeclaration';
var shader$m = "#ifdef FOG\nvarying vec3 vFogDistance;\n#endif";
Effect.IncludesShadersStore[name$m] = shader$m;

var name$n = 'prePassVertex';
var shader$n = "#ifdef PREPASS_DEPTHNORMAL\nvViewPos=(view*worldPos).rgb;\n#endif\n#if defined(PREPASS_VELOCITY) && defined(BONES_VELOCITY_ENABLED)\nvCurrentPosition=viewProjection*worldPos;\n#if NUM_BONE_INFLUENCERS>0\nmat4 previousInfluence;\npreviousInfluence=mPreviousBones[int(matricesIndices[0])]*matricesWeights[0];\n#if NUM_BONE_INFLUENCERS>1\npreviousInfluence+=mPreviousBones[int(matricesIndices[1])]*matricesWeights[1];\n#endif\n#if NUM_BONE_INFLUENCERS>2\npreviousInfluence+=mPreviousBones[int(matricesIndices[2])]*matricesWeights[2];\n#endif\n#if NUM_BONE_INFLUENCERS>3\npreviousInfluence+=mPreviousBones[int(matricesIndices[3])]*matricesWeights[3];\n#endif\n#if NUM_BONE_INFLUENCERS>4\npreviousInfluence+=mPreviousBones[int(matricesIndicesExtra[0])]*matricesWeightsExtra[0];\n#endif\n#if NUM_BONE_INFLUENCERS>5\npreviousInfluence+=mPreviousBones[int(matricesIndicesExtra[1])]*matricesWeightsExtra[1];\n#endif\n#if NUM_BONE_INFLUENCERS>6\npreviousInfluence+=mPreviousBones[int(matricesIndicesExtra[2])]*matricesWeightsExtra[2];\n#endif\n#if NUM_BONE_INFLUENCERS>7\npreviousInfluence+=mPreviousBones[int(matricesIndicesExtra[3])]*matricesWeightsExtra[3];\n#endif\nvPreviousPosition=previousViewProjection*previousWorld*previousInfluence*vec4(positionUpdated,1.0);\n#else\nvPreviousPosition=previousViewProjection*previousWorld*vec4(positionUpdated,1.0);\n#endif\n#endif";
Effect.IncludesShadersStore[name$n] = shader$n;

var name$o = 'bumpVertex';
var shader$o = "#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)\n#if defined(TANGENT) && defined(NORMAL)\nvec3 tbnNormal=normalize(normalUpdated);\nvec3 tbnTangent=normalize(tangentUpdated.xyz);\nvec3 tbnBitangent=cross(tbnNormal,tbnTangent)*tangentUpdated.w;\nvTBN=mat3(finalWorld)*mat3(tbnTangent,tbnBitangent,tbnNormal);\n#endif\n#endif";
Effect.IncludesShadersStore[name$o] = shader$o;

var name$p = 'fogVertex';
var shader$p = "#ifdef FOG\nvFogDistance=(view*worldPos).xyz;\n#endif";
Effect.IncludesShadersStore[name$p] = shader$p;

var name$q = 'shadowsVertex';
var shader$q = "#ifdef SHADOWS\n#if defined(SHADOWCSM{X})\nvPositionFromCamera{X}=view*worldPos;\nfor (int i=0; i<SHADOWCSMNUM_CASCADES{X}; i++) {\nvPositionFromLight{X}[i]=lightMatrix{X}[i]*worldPos;\nvDepthMetric{X}[i]=((vPositionFromLight{X}[i].z+light{X}.depthValues.x)/(light{X}.depthValues.y));\n}\n#elif defined(SHADOW{X}) && !defined(SHADOWCUBE{X})\nvPositionFromLight{X}=lightMatrix{X}*worldPos;\nvDepthMetric{X}=((vPositionFromLight{X}.z+light{X}.depthValues.x)/(light{X}.depthValues.y));\n#endif\n#endif";
Effect.IncludesShadersStore[name$q] = shader$q;

var name$r = 'pointCloudVertex';
var shader$r = "#ifdef POINTSIZE\ngl_PointSize=pointSize;\n#endif";
Effect.IncludesShadersStore[name$r] = shader$r;

var name$s = 'logDepthVertex';
var shader$s = "#ifdef LOGARITHMICDEPTH\nvFragmentDepth=1.0+gl_Position.w;\ngl_Position.z=log2(max(0.000001,vFragmentDepth))*logarithmicDepthConstant;\n#endif";
Effect.IncludesShadersStore[name$s] = shader$s;

var name$t = 'defaultVertexShader';
var shader$t = "#include<__decl__defaultVertex>\n\n#define CUSTOM_VERTEX_BEGIN\nattribute vec3 position;\n#ifdef NORMAL\nattribute vec3 normal;\n#endif\n#ifdef TANGENT\nattribute vec4 tangent;\n#endif\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#ifdef VERTEXCOLOR\nattribute vec4 color;\n#endif\n#include<helperFunctions>\n#include<bonesDeclaration>\n\n#include<instancesDeclaration>\n#include<prePassVertexDeclaration>\n#ifdef MAINUV1\nvarying vec2 vMainUV1;\n#endif\n#ifdef MAINUV2\nvarying vec2 vMainUV2;\n#endif\n#if defined(DIFFUSE) && DIFFUSEDIRECTUV == 0\nvarying vec2 vDiffuseUV;\n#endif\n#if defined(DETAIL) && DETAILDIRECTUV == 0\nvarying vec2 vDetailUV;\n#endif\n#if defined(AMBIENT) && AMBIENTDIRECTUV == 0\nvarying vec2 vAmbientUV;\n#endif\n#if defined(OPACITY) && OPACITYDIRECTUV == 0\nvarying vec2 vOpacityUV;\n#endif\n#if defined(EMISSIVE) && EMISSIVEDIRECTUV == 0\nvarying vec2 vEmissiveUV;\n#endif\n#if defined(LIGHTMAP) && LIGHTMAPDIRECTUV == 0\nvarying vec2 vLightmapUV;\n#endif\n#if defined(SPECULAR) && defined(SPECULARTERM) && SPECULARDIRECTUV == 0\nvarying vec2 vSpecularUV;\n#endif\n#if defined(BUMP) && BUMPDIRECTUV == 0\nvarying vec2 vBumpUV;\n#endif\n\nvarying vec3 vPositionW;\n#ifdef NORMAL\nvarying vec3 vNormalW;\n#endif\n#ifdef VERTEXCOLOR\nvarying vec4 vColor;\n#endif\n#include<bumpVertexDeclaration>\n#include<clipPlaneVertexDeclaration>\n#include<fogVertexDeclaration>\n#include<__decl__lightFragment>[0..maxSimultaneousLights]\n#include<morphTargetsVertexGlobalDeclaration>\n#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]\n#ifdef REFLECTIONMAP_SKYBOX\nvarying vec3 vPositionUVW;\n#endif\n#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)\nvarying vec3 vDirectionW;\n#endif\n#include<logDepthDeclaration>\n#define CUSTOM_VERTEX_DEFINITIONS\nvoid main(void) {\n#define CUSTOM_VERTEX_MAIN_BEGIN\nvec3 positionUpdated=position;\n#ifdef NORMAL\nvec3 normalUpdated=normal;\n#endif\n#ifdef TANGENT\nvec4 tangentUpdated=tangent;\n#endif\n#ifdef UV1\nvec2 uvUpdated=uv;\n#endif\n#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]\n#ifdef REFLECTIONMAP_SKYBOX\nvPositionUVW=positionUpdated;\n#endif\n#define CUSTOM_VERTEX_UPDATE_POSITION\n#define CUSTOM_VERTEX_UPDATE_NORMAL\n#include<instancesVertex>\n#if defined(PREPASS) && defined(PREPASS_VELOCITY) && !defined(BONES_VELOCITY_ENABLED)\n\nvCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);\nvPreviousPosition=previousViewProjection*previousWorld*vec4(positionUpdated,1.0);\n#endif\n#include<bonesVertex>\nvec4 worldPos=finalWorld*vec4(positionUpdated,1.0);\n#ifdef NORMAL\nmat3 normalWorld=mat3(finalWorld);\n#if defined(INSTANCES) && defined(THIN_INSTANCES)\nvNormalW=normalUpdated/vec3(dot(normalWorld[0],normalWorld[0]),dot(normalWorld[1],normalWorld[1]),dot(normalWorld[2],normalWorld[2]));\nvNormalW=normalize(normalWorld*vNormalW);\n#else\n#ifdef NONUNIFORMSCALING\nnormalWorld=transposeMat3(inverseMat3(normalWorld));\n#endif\nvNormalW=normalize(normalWorld*normalUpdated);\n#endif\n#endif\n#define CUSTOM_VERTEX_UPDATE_WORLDPOS\n#ifdef MULTIVIEW\nif (gl_ViewID_OVR == 0u) {\ngl_Position=viewProjection*worldPos;\n} else {\ngl_Position=viewProjectionR*worldPos;\n}\n#else\ngl_Position=viewProjection*worldPos;\n#endif\nvPositionW=vec3(worldPos);\n#include<prePassVertex>\n#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)\nvDirectionW=normalize(vec3(finalWorld*vec4(positionUpdated,0.0)));\n#endif\n\n#ifndef UV1\nvec2 uvUpdated=vec2(0.,0.);\n#endif\n#ifndef UV2\nvec2 uv2=vec2(0.,0.);\n#endif\n#ifdef MAINUV1\nvMainUV1=uvUpdated;\n#endif\n#ifdef MAINUV2\nvMainUV2=uv2;\n#endif\n#if defined(DIFFUSE) && DIFFUSEDIRECTUV == 0\nif (vDiffuseInfos.x == 0.)\n{\nvDiffuseUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(DETAIL) && DETAILDIRECTUV == 0\nif (vDetailInfos.x == 0.)\n{\nvDetailUV=vec2(detailMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvDetailUV=vec2(detailMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(AMBIENT) && AMBIENTDIRECTUV == 0\nif (vAmbientInfos.x == 0.)\n{\nvAmbientUV=vec2(ambientMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvAmbientUV=vec2(ambientMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(OPACITY) && OPACITYDIRECTUV == 0\nif (vOpacityInfos.x == 0.)\n{\nvOpacityUV=vec2(opacityMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvOpacityUV=vec2(opacityMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(EMISSIVE) && EMISSIVEDIRECTUV == 0\nif (vEmissiveInfos.x == 0.)\n{\nvEmissiveUV=vec2(emissiveMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvEmissiveUV=vec2(emissiveMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(LIGHTMAP) && LIGHTMAPDIRECTUV == 0\nif (vLightmapInfos.x == 0.)\n{\nvLightmapUV=vec2(lightmapMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvLightmapUV=vec2(lightmapMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(SPECULAR) && defined(SPECULARTERM) && SPECULARDIRECTUV == 0\nif (vSpecularInfos.x == 0.)\n{\nvSpecularUV=vec2(specularMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvSpecularUV=vec2(specularMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(BUMP) && BUMPDIRECTUV == 0\nif (vBumpInfos.x == 0.)\n{\nvBumpUV=vec2(bumpMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvBumpUV=vec2(bumpMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#include<bumpVertex>\n#include<clipPlaneVertex>\n#include<fogVertex>\n#include<shadowsVertex>[0..maxSimultaneousLights]\n#ifdef VERTEXCOLOR\n\nvColor=color;\n#endif\n#include<pointCloudVertex>\n#include<logDepthVertex>\n#define CUSTOM_VERTEX_MAIN_END\n}\n";
Effect.ShadersStore[name$t] = shader$t;

/**
 * Define the code related to the detail map parameters of a material
 *
 * Inspired from:
 *   Unity: https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@9.0/manual/Mask-Map-and-Detail-Map.html and https://docs.unity3d.com/Manual/StandardShaderMaterialParameterDetail.html
 *   Unreal: https://docs.unrealengine.com/en-US/Engine/Rendering/Materials/HowTo/DetailTexturing/index.html
 *   Cryengine: https://docs.cryengine.com/display/SDKDOC2/Detail+Maps
 */
var DetailMapConfiguration = /** @class */ (function () {
    /**
     * Instantiate a new detail map
     * @param markAllSubMeshesAsTexturesDirty Callback to flag the material to dirty
     */
    function DetailMapConfiguration(markAllSubMeshesAsTexturesDirty) {
        this._texture = null;
        /**
         * Defines how strongly the detail diffuse/albedo channel is blended with the regular diffuse/albedo texture
         * Bigger values mean stronger blending
         */
        this.diffuseBlendLevel = 1;
        /**
         * Defines how strongly the detail roughness channel is blended with the regular roughness value
         * Bigger values mean stronger blending. Only used with PBR materials
         */
        this.roughnessBlendLevel = 1;
        /**
         * Defines how strong the bump effect from the detail map is
         * Bigger values mean stronger effect
         */
        this.bumpLevel = 1;
        this._normalBlendMethod = Material.MATERIAL_NORMALBLENDMETHOD_WHITEOUT;
        this._isEnabled = false;
        /**
         * Enable or disable the detail map on this material
         */
        this.isEnabled = false;
        this._internalMarkAllSubMeshesAsTexturesDirty = markAllSubMeshesAsTexturesDirty;
    }
    /** @hidden */
    DetailMapConfiguration.prototype._markAllSubMeshesAsTexturesDirty = function () {
        this._internalMarkAllSubMeshesAsTexturesDirty();
    };
    /**
     * Gets whether the submesh is ready to be used or not.
     * @param defines the list of "defines" to update.
     * @param scene defines the scene the material belongs to.
     * @returns - boolean indicating that the submesh is ready or not.
     */
    DetailMapConfiguration.prototype.isReadyForSubMesh = function (defines, scene) {
        var engine = scene.getEngine();
        if (defines._areTexturesDirty && scene.texturesEnabled) {
            if (engine.getCaps().standardDerivatives && this._texture && MaterialFlags.DetailTextureEnabled) {
                // Detail texture cannot be not blocking.
                if (!this._texture.isReady()) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * Update the defines for detail map usage
     * @param defines the list of "defines" to update.
     * @param scene defines the scene the material belongs to.
     */
    DetailMapConfiguration.prototype.prepareDefines = function (defines, scene) {
        if (this._isEnabled) {
            defines.DETAIL_NORMALBLENDMETHOD = this._normalBlendMethod;
            var engine = scene.getEngine();
            if (defines._areTexturesDirty) {
                if (engine.getCaps().standardDerivatives && this._texture && MaterialFlags.DetailTextureEnabled && this._isEnabled) {
                    MaterialHelper.PrepareDefinesForMergedUV(this._texture, defines, "DETAIL");
                    defines.DETAIL_NORMALBLENDMETHOD = this._normalBlendMethod;
                }
                else {
                    defines.DETAIL = false;
                }
            }
        }
        else {
            defines.DETAIL = false;
        }
    };
    /**
     * Binds the material data.
     * @param uniformBuffer defines the Uniform buffer to fill in.
     * @param scene defines the scene the material belongs to.
     * @param isFrozen defines whether the material is frozen or not.
     */
    DetailMapConfiguration.prototype.bindForSubMesh = function (uniformBuffer, scene, isFrozen) {
        if (!this._isEnabled) {
            return;
        }
        if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
            if (this._texture && MaterialFlags.DetailTextureEnabled) {
                uniformBuffer.updateFloat4("vDetailInfos", this._texture.coordinatesIndex, this.diffuseBlendLevel, this.bumpLevel, this.roughnessBlendLevel);
                MaterialHelper.BindTextureMatrix(this._texture, uniformBuffer, "detail");
            }
        }
        // Textures
        if (scene.texturesEnabled) {
            if (this._texture && MaterialFlags.DetailTextureEnabled) {
                uniformBuffer.setTexture("detailSampler", this._texture);
            }
        }
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param texture - Base texture to use.
     * @returns - Boolean specifying if a texture is used in the material.
     */
    DetailMapConfiguration.prototype.hasTexture = function (texture) {
        if (this._texture === texture) {
            return true;
        }
        return false;
    };
    /**
     * Returns an array of the actively used textures.
     * @param activeTextures Array of BaseTextures
     */
    DetailMapConfiguration.prototype.getActiveTextures = function (activeTextures) {
        if (this._texture) {
            activeTextures.push(this._texture);
        }
    };
    /**
     * Returns the animatable textures.
     * @param animatables Array of animatable textures.
     */
    DetailMapConfiguration.prototype.getAnimatables = function (animatables) {
        if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
            animatables.push(this._texture);
        }
    };
    /**
     * Disposes the resources of the material.
     * @param forceDisposeTextures - Forces the disposal of all textures.
     */
    DetailMapConfiguration.prototype.dispose = function (forceDisposeTextures) {
        var _a;
        if (forceDisposeTextures) {
            (_a = this._texture) === null || _a === void 0 ? void 0 : _a.dispose();
        }
    };
    /**
    * Get the current class name useful for serialization or dynamic coding.
    * @returns "DetailMap"
    */
    DetailMapConfiguration.prototype.getClassName = function () {
        return "DetailMap";
    };
    /**
     * Add the required uniforms to the current list.
     * @param uniforms defines the current uniform list.
     */
    DetailMapConfiguration.AddUniforms = function (uniforms) {
        uniforms.push("vDetailInfos");
    };
    /**
     * Add the required samplers to the current list.
     * @param samplers defines the current sampler list.
     */
    DetailMapConfiguration.AddSamplers = function (samplers) {
        samplers.push("detailSampler");
    };
    /**
     * Add the required uniforms to the current buffer.
     * @param uniformBuffer defines the current uniform buffer.
     */
    DetailMapConfiguration.PrepareUniformBuffer = function (uniformBuffer) {
        uniformBuffer.addUniform("vDetailInfos", 4);
        uniformBuffer.addUniform("detailMatrix", 16);
    };
    /**
     * Makes a duplicate of the current instance into another one.
     * @param detailMap define the instance where to copy the info
     */
    DetailMapConfiguration.prototype.copyTo = function (detailMap) {
        SerializationHelper.Clone(function () { return detailMap; }, this);
    };
    /**
     * Serializes this detail map instance
     * @returns - An object with the serialized instance.
     */
    DetailMapConfiguration.prototype.serialize = function () {
        return SerializationHelper.Serialize(this);
    };
    /**
     * Parses a detail map setting from a serialized object.
     * @param source - Serialized object.
     * @param scene Defines the scene we are parsing for
     * @param rootUrl Defines the rootUrl to load from
     */
    DetailMapConfiguration.prototype.parse = function (source, scene, rootUrl) {
        var _this = this;
        SerializationHelper.Parse(function () { return _this; }, source, scene, rootUrl);
    };
    __decorate([
        serializeAsTexture("detailTexture"),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], DetailMapConfiguration.prototype, "texture", void 0);
    __decorate([
        serialize()
    ], DetailMapConfiguration.prototype, "diffuseBlendLevel", void 0);
    __decorate([
        serialize()
    ], DetailMapConfiguration.prototype, "roughnessBlendLevel", void 0);
    __decorate([
        serialize()
    ], DetailMapConfiguration.prototype, "bumpLevel", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], DetailMapConfiguration.prototype, "normalBlendMethod", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], DetailMapConfiguration.prototype, "isEnabled", void 0);
    return DetailMapConfiguration;
}());

var onCreatedEffectParameters = { effect: null, subMesh: null };
/** @hidden */
var StandardMaterialDefines = /** @class */ (function (_super) {
    __extends(StandardMaterialDefines, _super);
    function StandardMaterialDefines() {
        var _this = _super.call(this) || this;
        _this.MAINUV1 = false;
        _this.MAINUV2 = false;
        _this.DIFFUSE = false;
        _this.DIFFUSEDIRECTUV = 0;
        _this.DETAIL = false;
        _this.DETAILDIRECTUV = 0;
        _this.DETAIL_NORMALBLENDMETHOD = 0;
        _this.AMBIENT = false;
        _this.AMBIENTDIRECTUV = 0;
        _this.OPACITY = false;
        _this.OPACITYDIRECTUV = 0;
        _this.OPACITYRGB = false;
        _this.REFLECTION = false;
        _this.EMISSIVE = false;
        _this.EMISSIVEDIRECTUV = 0;
        _this.SPECULAR = false;
        _this.SPECULARDIRECTUV = 0;
        _this.BUMP = false;
        _this.BUMPDIRECTUV = 0;
        _this.PARALLAX = false;
        _this.PARALLAXOCCLUSION = false;
        _this.SPECULAROVERALPHA = false;
        _this.CLIPPLANE = false;
        _this.CLIPPLANE2 = false;
        _this.CLIPPLANE3 = false;
        _this.CLIPPLANE4 = false;
        _this.CLIPPLANE5 = false;
        _this.CLIPPLANE6 = false;
        _this.ALPHATEST = false;
        _this.DEPTHPREPASS = false;
        _this.ALPHAFROMDIFFUSE = false;
        _this.POINTSIZE = false;
        _this.FOG = false;
        _this.SPECULARTERM = false;
        _this.DIFFUSEFRESNEL = false;
        _this.OPACITYFRESNEL = false;
        _this.REFLECTIONFRESNEL = false;
        _this.REFRACTIONFRESNEL = false;
        _this.EMISSIVEFRESNEL = false;
        _this.FRESNEL = false;
        _this.NORMAL = false;
        _this.UV1 = false;
        _this.UV2 = false;
        _this.VERTEXCOLOR = false;
        _this.VERTEXALPHA = false;
        _this.NUM_BONE_INFLUENCERS = 0;
        _this.BonesPerMesh = 0;
        _this.BONETEXTURE = false;
        _this.BONES_VELOCITY_ENABLED = false;
        _this.INSTANCES = false;
        _this.THIN_INSTANCES = false;
        _this.GLOSSINESS = false;
        _this.ROUGHNESS = false;
        _this.EMISSIVEASILLUMINATION = false;
        _this.LINKEMISSIVEWITHDIFFUSE = false;
        _this.REFLECTIONFRESNELFROMSPECULAR = false;
        _this.LIGHTMAP = false;
        _this.LIGHTMAPDIRECTUV = 0;
        _this.OBJECTSPACE_NORMALMAP = false;
        _this.USELIGHTMAPASSHADOWMAP = false;
        _this.REFLECTIONMAP_3D = false;
        _this.REFLECTIONMAP_SPHERICAL = false;
        _this.REFLECTIONMAP_PLANAR = false;
        _this.REFLECTIONMAP_CUBIC = false;
        _this.USE_LOCAL_REFLECTIONMAP_CUBIC = false;
        _this.REFLECTIONMAP_PROJECTION = false;
        _this.REFLECTIONMAP_SKYBOX = false;
        _this.REFLECTIONMAP_EXPLICIT = false;
        _this.REFLECTIONMAP_EQUIRECTANGULAR = false;
        _this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
        _this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
        _this.INVERTCUBICMAP = false;
        _this.LOGARITHMICDEPTH = false;
        _this.REFRACTION = false;
        _this.REFRACTIONMAP_3D = false;
        _this.REFLECTIONOVERALPHA = false;
        _this.TWOSIDEDLIGHTING = false;
        _this.SHADOWFLOAT = false;
        _this.MORPHTARGETS = false;
        _this.MORPHTARGETS_NORMAL = false;
        _this.MORPHTARGETS_TANGENT = false;
        _this.MORPHTARGETS_UV = false;
        _this.NUM_MORPH_INFLUENCERS = 0;
        _this.NONUNIFORMSCALING = false; // https://playground.babylonjs.com#V6DWIH
        _this.PREMULTIPLYALPHA = false; // https://playground.babylonjs.com#LNVJJ7
        _this.ALPHATEST_AFTERALLALPHACOMPUTATIONS = false;
        _this.ALPHABLEND = true;
        _this.PREPASS = false;
        _this.PREPASS_IRRADIANCE = false;
        _this.PREPASS_IRRADIANCE_INDEX = -1;
        _this.PREPASS_ALBEDO = false;
        _this.PREPASS_ALBEDO_INDEX = -1;
        _this.PREPASS_DEPTHNORMAL = false;
        _this.PREPASS_DEPTHNORMAL_INDEX = -1;
        _this.PREPASS_POSITION = false;
        _this.PREPASS_POSITION_INDEX = -1;
        _this.PREPASS_VELOCITY = false;
        _this.PREPASS_VELOCITY_INDEX = -1;
        _this.PREPASS_REFLECTIVITY = false;
        _this.PREPASS_REFLECTIVITY_INDEX = -1;
        _this.SCENE_MRT_COUNT = 0;
        _this.RGBDLIGHTMAP = false;
        _this.RGBDREFLECTION = false;
        _this.RGBDREFRACTION = false;
        _this.IMAGEPROCESSING = false;
        _this.VIGNETTE = false;
        _this.VIGNETTEBLENDMODEMULTIPLY = false;
        _this.VIGNETTEBLENDMODEOPAQUE = false;
        _this.TONEMAPPING = false;
        _this.TONEMAPPING_ACES = false;
        _this.CONTRAST = false;
        _this.COLORCURVES = false;
        _this.COLORGRADING = false;
        _this.COLORGRADING3D = false;
        _this.SAMPLER3DGREENDEPTH = false;
        _this.SAMPLER3DBGRMAP = false;
        _this.IMAGEPROCESSINGPOSTPROCESS = false;
        _this.MULTIVIEW = false;
        /**
         * If the reflection texture on this material is in linear color space
         * @hidden
         */
        _this.IS_REFLECTION_LINEAR = false;
        /**
         * If the refraction texture on this material is in linear color space
         * @hidden
         */
        _this.IS_REFRACTION_LINEAR = false;
        _this.EXPOSURE = false;
        _this.rebuild();
        return _this;
    }
    StandardMaterialDefines.prototype.setReflectionMode = function (modeToEnable) {
        var modes = [
            "REFLECTIONMAP_CUBIC", "REFLECTIONMAP_EXPLICIT", "REFLECTIONMAP_PLANAR",
            "REFLECTIONMAP_PROJECTION", "REFLECTIONMAP_PROJECTION", "REFLECTIONMAP_SKYBOX",
            "REFLECTIONMAP_SPHERICAL", "REFLECTIONMAP_EQUIRECTANGULAR", "REFLECTIONMAP_EQUIRECTANGULAR_FIXED",
            "REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED"
        ];
        for (var _i = 0, modes_1 = modes; _i < modes_1.length; _i++) {
            var mode = modes_1[_i];
            this[mode] = (mode === modeToEnable);
        }
    };
    return StandardMaterialDefines;
}(MaterialDefines));
/**
 * This is the default material used in Babylon. It is the best trade off between quality
 * and performances.
 * @see https://doc.babylonjs.com/babylon101/materials
 */
var StandardMaterial = /** @class */ (function (_super) {
    __extends(StandardMaterial, _super);
    /**
     * Instantiates a new standard material.
     * This is the default material used in Babylon. It is the best trade off between quality
     * and performances.
     * @see https://doc.babylonjs.com/babylon101/materials
     * @param name Define the name of the material in the scene
     * @param scene Define the scene the material belong to
     */
    function StandardMaterial(name, scene) {
        var _this = _super.call(this, name, scene) || this;
        _this._diffuseTexture = null;
        _this._ambientTexture = null;
        _this._opacityTexture = null;
        _this._reflectionTexture = null;
        _this._emissiveTexture = null;
        _this._specularTexture = null;
        _this._bumpTexture = null;
        _this._lightmapTexture = null;
        _this._refractionTexture = null;
        /**
         * The color of the material lit by the environmental background lighting.
         * @see https://doc.babylonjs.com/babylon101/materials#ambient-color-example
         */
        _this.ambientColor = new Color3(0, 0, 0);
        /**
         * The basic color of the material as viewed under a light.
         */
        _this.diffuseColor = new Color3(1, 1, 1);
        /**
         * Define how the color and intensity of the highlight given by the light in the material.
         */
        _this.specularColor = new Color3(1, 1, 1);
        /**
         * Define the color of the material as if self lit.
         * This will be mixed in the final result even in the absence of light.
         */
        _this.emissiveColor = new Color3(0, 0, 0);
        /**
         * Defines how sharp are the highlights in the material.
         * The bigger the value the sharper giving a more glossy feeling to the result.
         * Reversely, the smaller the value the blurrier giving a more rough feeling to the result.
         */
        _this.specularPower = 64;
        _this._useAlphaFromDiffuseTexture = false;
        _this._useEmissiveAsIllumination = false;
        _this._linkEmissiveWithDiffuse = false;
        _this._useSpecularOverAlpha = false;
        _this._useReflectionOverAlpha = false;
        _this._disableLighting = false;
        _this._useObjectSpaceNormalMap = false;
        _this._useParallax = false;
        _this._useParallaxOcclusion = false;
        /**
         * Apply a scaling factor that determine which "depth" the height map should reprensent. A value between 0.05 and 0.1 is reasonnable in Parallax, you can reach 0.2 using Parallax Occlusion.
         */
        _this.parallaxScaleBias = 0.05;
        _this._roughness = 0;
        /**
         * In case of refraction, define the value of the index of refraction.
         * @see https://doc.babylonjs.com/how_to/reflect#how-to-obtain-reflections-and-refractions
         */
        _this.indexOfRefraction = 0.98;
        /**
         * Invert the refraction texture alongside the y axis.
         * It can be useful with procedural textures or probe for instance.
         * @see https://doc.babylonjs.com/how_to/reflect#how-to-obtain-reflections-and-refractions
         */
        _this.invertRefractionY = true;
        /**
         * Defines the alpha limits in alpha test mode.
         */
        _this.alphaCutOff = 0.4;
        _this._useLightmapAsShadowmap = false;
        _this._useReflectionFresnelFromSpecular = false;
        _this._useGlossinessFromSpecularMapAlpha = false;
        _this._maxSimultaneousLights = 4;
        _this._invertNormalMapX = false;
        _this._invertNormalMapY = false;
        _this._twoSidedLighting = false;
        /**
         * Defines the detail map parameters for the material.
         */
        _this.detailMap = new DetailMapConfiguration(_this._markAllSubMeshesAsTexturesDirty.bind(_this));
        _this._renderTargets = new SmartArray(16);
        _this._worldViewProjectionMatrix = Matrix.Zero();
        _this._globalAmbientColor = new Color3(0, 0, 0);
        _this._rebuildInParallel = false;
        // Setup the default processing configuration to the scene.
        _this._attachImageProcessingConfiguration(null);
        _this.prePassConfiguration = new PrePassConfiguration();
        _this.getRenderTargetTextures = function () {
            _this._renderTargets.reset();
            if (StandardMaterial.ReflectionTextureEnabled && _this._reflectionTexture && _this._reflectionTexture.isRenderTarget) {
                _this._renderTargets.push(_this._reflectionTexture);
            }
            if (StandardMaterial.RefractionTextureEnabled && _this._refractionTexture && _this._refractionTexture.isRenderTarget) {
                _this._renderTargets.push(_this._refractionTexture);
            }
            return _this._renderTargets;
        };
        return _this;
    }
    Object.defineProperty(StandardMaterial.prototype, "imageProcessingConfiguration", {
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
            this._attachImageProcessingConfiguration(value);
            // Ensure the effect will be rebuilt.
            this._markAllSubMeshesAsTexturesDirty();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Attaches a new image processing configuration to the Standard Material.
     * @param configuration
     */
    StandardMaterial.prototype._attachImageProcessingConfiguration = function (configuration) {
        var _this = this;
        if (configuration === this._imageProcessingConfiguration) {
            return;
        }
        // Detaches observer
        if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
            this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
        }
        // Pick the scene configuration if needed
        if (!configuration) {
            this._imageProcessingConfiguration = this.getScene().imageProcessingConfiguration;
        }
        else {
            this._imageProcessingConfiguration = configuration;
        }
        // Attaches observer
        if (this._imageProcessingConfiguration) {
            this._imageProcessingObserver = this._imageProcessingConfiguration.onUpdateParameters.add(function () {
                _this._markAllSubMeshesAsImageProcessingDirty();
            });
        }
    };
    Object.defineProperty(StandardMaterial.prototype, "cameraColorCurvesEnabled", {
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
    Object.defineProperty(StandardMaterial.prototype, "cameraColorGradingEnabled", {
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
    Object.defineProperty(StandardMaterial.prototype, "cameraToneMappingEnabled", {
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
    Object.defineProperty(StandardMaterial.prototype, "cameraExposure", {
        /**
         * The camera exposure used on this material.
         * This property is here and not in the camera to allow controlling exposure without full screen post process.
         * This corresponds to a photographic exposure.
         */
        get: function () {
            return this._imageProcessingConfiguration.exposure;
        },
        /**
         * The camera exposure used on this material.
         * This property is here and not in the camera to allow controlling exposure without full screen post process.
         * This corresponds to a photographic exposure.
         */
        set: function (value) {
            this._imageProcessingConfiguration.exposure = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial.prototype, "cameraContrast", {
        /**
         * Gets The camera contrast used on this material.
         */
        get: function () {
            return this._imageProcessingConfiguration.contrast;
        },
        /**
         * Sets The camera contrast used on this material.
         */
        set: function (value) {
            this._imageProcessingConfiguration.contrast = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial.prototype, "cameraColorGradingTexture", {
        /**
         * Gets the Color Grading 2D Lookup Texture.
         */
        get: function () {
            return this._imageProcessingConfiguration.colorGradingTexture;
        },
        /**
         * Sets the Color Grading 2D Lookup Texture.
         */
        set: function (value) {
            this._imageProcessingConfiguration.colorGradingTexture = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial.prototype, "cameraColorCurves", {
        /**
         * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
         * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
         * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
         * corresponding to low luminance, medium luminance, and high luminance areas respectively.
         */
        get: function () {
            return this._imageProcessingConfiguration.colorCurves;
        },
        /**
         * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
         * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
         * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
         * corresponding to low luminance, medium luminance, and high luminance areas respectively.
         */
        set: function (value) {
            this._imageProcessingConfiguration.colorCurves = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial.prototype, "canRenderToMRT", {
        /**
         * Can this material render to several textures at once
         */
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial.prototype, "hasRenderTargetTextures", {
        /**
         * Gets a boolean indicating that current material needs to register RTT
         */
        get: function () {
            if (StandardMaterial.ReflectionTextureEnabled && this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                return true;
            }
            if (StandardMaterial.RefractionTextureEnabled && this._refractionTexture && this._refractionTexture.isRenderTarget) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the current class name of the material e.g. "StandardMaterial"
     * Mainly use in serialization.
     * @returns the class name
     */
    StandardMaterial.prototype.getClassName = function () {
        return "StandardMaterial";
    };
    Object.defineProperty(StandardMaterial.prototype, "useLogarithmicDepth", {
        /**
         * In case the depth buffer does not allow enough depth precision for your scene (might be the case in large scenes)
         * You can try switching to logarithmic depth.
         * @see https://doc.babylonjs.com/how_to/using_logarithmic_depth_buffer
         */
        get: function () {
            return this._useLogarithmicDepth;
        },
        set: function (value) {
            this._useLogarithmicDepth = value && this.getScene().getEngine().getCaps().fragmentDepthSupported;
            this._markAllSubMeshesAsMiscDirty();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Specifies if the material will require alpha blending
     * @returns a boolean specifying if alpha blending is needed
     */
    StandardMaterial.prototype.needAlphaBlending = function () {
        if (this._disableAlphaBlending) {
            return false;
        }
        return (this.alpha < 1.0) || (this._opacityTexture != null) || this._shouldUseAlphaFromDiffuseTexture() || this._opacityFresnelParameters && this._opacityFresnelParameters.isEnabled;
    };
    /**
     * Specifies if this material should be rendered in alpha test mode
     * @returns a boolean specifying if an alpha test is needed.
     */
    StandardMaterial.prototype.needAlphaTesting = function () {
        if (this._forceAlphaTest) {
            return true;
        }
        return this._hasAlphaChannel() && (this._transparencyMode == null || this._transparencyMode === Material.MATERIAL_ALPHATEST);
    };
    /**
     * Specifies whether or not the alpha value of the diffuse texture should be used for alpha blending.
     */
    StandardMaterial.prototype._shouldUseAlphaFromDiffuseTexture = function () {
        return this._diffuseTexture != null && this._diffuseTexture.hasAlpha && this._useAlphaFromDiffuseTexture && this._transparencyMode !== Material.MATERIAL_OPAQUE;
    };
    /**
     * Specifies whether or not there is a usable alpha channel for transparency.
     */
    StandardMaterial.prototype._hasAlphaChannel = function () {
        return (this._diffuseTexture != null && this._diffuseTexture.hasAlpha) || this._opacityTexture != null;
    };
    /**
     * Get the texture used for alpha test purpose.
     * @returns the diffuse texture in case of the standard material.
     */
    StandardMaterial.prototype.getAlphaTestTexture = function () {
        return this._diffuseTexture;
    };
    /**
     * Get if the submesh is ready to be used and all its information available.
     * Child classes can use it to update shaders
     * @param mesh defines the mesh to check
     * @param subMesh defines which submesh to check
     * @param useInstances specifies that instances should be used
     * @returns a boolean indicating that the submesh is ready or not
     */
    StandardMaterial.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
        if (useInstances === void 0) { useInstances = false; }
        if (subMesh.effect && this.isFrozen) {
            if (subMesh.effect._wasPreviouslyReady) {
                return true;
            }
        }
        if (!subMesh._materialDefines) {
            subMesh._materialDefines = new StandardMaterialDefines();
        }
        var scene = this.getScene();
        var defines = subMesh._materialDefines;
        if (this._isReadyForSubMesh(subMesh)) {
            return true;
        }
        var engine = scene.getEngine();
        // Lights
        defines._needNormals = MaterialHelper.PrepareDefinesForLights(scene, mesh, defines, true, this._maxSimultaneousLights, this._disableLighting);
        // Multiview
        MaterialHelper.PrepareDefinesForMultiview(scene, defines);
        // PrePass
        MaterialHelper.PrepareDefinesForPrePass(scene, defines, this.canRenderToMRT);
        // Textures
        if (defines._areTexturesDirty) {
            defines._needUVs = false;
            defines.MAINUV1 = false;
            defines.MAINUV2 = false;
            if (scene.texturesEnabled) {
                if (this._diffuseTexture && StandardMaterial.DiffuseTextureEnabled) {
                    if (!this._diffuseTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                    else {
                        MaterialHelper.PrepareDefinesForMergedUV(this._diffuseTexture, defines, "DIFFUSE");
                    }
                }
                else {
                    defines.DIFFUSE = false;
                }
                if (this._ambientTexture && StandardMaterial.AmbientTextureEnabled) {
                    if (!this._ambientTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                    else {
                        MaterialHelper.PrepareDefinesForMergedUV(this._ambientTexture, defines, "AMBIENT");
                    }
                }
                else {
                    defines.AMBIENT = false;
                }
                if (this._opacityTexture && StandardMaterial.OpacityTextureEnabled) {
                    if (!this._opacityTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                    else {
                        MaterialHelper.PrepareDefinesForMergedUV(this._opacityTexture, defines, "OPACITY");
                        defines.OPACITYRGB = this._opacityTexture.getAlphaFromRGB;
                    }
                }
                else {
                    defines.OPACITY = false;
                }
                if (this._reflectionTexture && StandardMaterial.ReflectionTextureEnabled) {
                    if (!this._reflectionTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                    else {
                        defines._needNormals = true;
                        defines.REFLECTION = true;
                        defines.ROUGHNESS = (this._roughness > 0);
                        defines.REFLECTIONOVERALPHA = this._useReflectionOverAlpha;
                        defines.INVERTCUBICMAP = (this._reflectionTexture.coordinatesMode === Texture.INVCUBIC_MODE);
                        defines.REFLECTIONMAP_3D = this._reflectionTexture.isCube;
                        defines.RGBDREFLECTION = this._reflectionTexture.isRGBD;
                        switch (this._reflectionTexture.coordinatesMode) {
                            case Texture.EXPLICIT_MODE:
                                defines.setReflectionMode("REFLECTIONMAP_EXPLICIT");
                                break;
                            case Texture.PLANAR_MODE:
                                defines.setReflectionMode("REFLECTIONMAP_PLANAR");
                                break;
                            case Texture.PROJECTION_MODE:
                                defines.setReflectionMode("REFLECTIONMAP_PROJECTION");
                                break;
                            case Texture.SKYBOX_MODE:
                                defines.setReflectionMode("REFLECTIONMAP_SKYBOX");
                                break;
                            case Texture.SPHERICAL_MODE:
                                defines.setReflectionMode("REFLECTIONMAP_SPHERICAL");
                                break;
                            case Texture.EQUIRECTANGULAR_MODE:
                                defines.setReflectionMode("REFLECTIONMAP_EQUIRECTANGULAR");
                                break;
                            case Texture.FIXED_EQUIRECTANGULAR_MODE:
                                defines.setReflectionMode("REFLECTIONMAP_EQUIRECTANGULAR_FIXED");
                                break;
                            case Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE:
                                defines.setReflectionMode("REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED");
                                break;
                            case Texture.CUBIC_MODE:
                            case Texture.INVCUBIC_MODE:
                            default:
                                defines.setReflectionMode("REFLECTIONMAP_CUBIC");
                                break;
                        }
                        defines.USE_LOCAL_REFLECTIONMAP_CUBIC = this._reflectionTexture.boundingBoxSize ? true : false;
                    }
                }
                else {
                    defines.REFLECTION = false;
                }
                if (this._emissiveTexture && StandardMaterial.EmissiveTextureEnabled) {
                    if (!this._emissiveTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                    else {
                        MaterialHelper.PrepareDefinesForMergedUV(this._emissiveTexture, defines, "EMISSIVE");
                    }
                }
                else {
                    defines.EMISSIVE = false;
                }
                if (this._lightmapTexture && StandardMaterial.LightmapTextureEnabled) {
                    if (!this._lightmapTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                    else {
                        MaterialHelper.PrepareDefinesForMergedUV(this._lightmapTexture, defines, "LIGHTMAP");
                        defines.USELIGHTMAPASSHADOWMAP = this._useLightmapAsShadowmap;
                        defines.RGBDLIGHTMAP = this._lightmapTexture.isRGBD;
                    }
                }
                else {
                    defines.LIGHTMAP = false;
                }
                if (this._specularTexture && StandardMaterial.SpecularTextureEnabled) {
                    if (!this._specularTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                    else {
                        MaterialHelper.PrepareDefinesForMergedUV(this._specularTexture, defines, "SPECULAR");
                        defines.GLOSSINESS = this._useGlossinessFromSpecularMapAlpha;
                    }
                }
                else {
                    defines.SPECULAR = false;
                }
                if (scene.getEngine().getCaps().standardDerivatives && this._bumpTexture && StandardMaterial.BumpTextureEnabled) {
                    // Bump texure can not be not blocking.
                    if (!this._bumpTexture.isReady()) {
                        return false;
                    }
                    else {
                        MaterialHelper.PrepareDefinesForMergedUV(this._bumpTexture, defines, "BUMP");
                        defines.PARALLAX = this._useParallax;
                        defines.PARALLAXOCCLUSION = this._useParallaxOcclusion;
                    }
                    defines.OBJECTSPACE_NORMALMAP = this._useObjectSpaceNormalMap;
                }
                else {
                    defines.BUMP = false;
                }
                if (this._refractionTexture && StandardMaterial.RefractionTextureEnabled) {
                    if (!this._refractionTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                    else {
                        defines._needUVs = true;
                        defines.REFRACTION = true;
                        defines.REFRACTIONMAP_3D = this._refractionTexture.isCube;
                        defines.RGBDREFRACTION = this._refractionTexture.isRGBD;
                    }
                }
                else {
                    defines.REFRACTION = false;
                }
                defines.TWOSIDEDLIGHTING = !this._backFaceCulling && this._twoSidedLighting;
            }
            else {
                defines.DIFFUSE = false;
                defines.AMBIENT = false;
                defines.OPACITY = false;
                defines.REFLECTION = false;
                defines.EMISSIVE = false;
                defines.LIGHTMAP = false;
                defines.BUMP = false;
                defines.REFRACTION = false;
            }
            defines.ALPHAFROMDIFFUSE = this._shouldUseAlphaFromDiffuseTexture();
            defines.EMISSIVEASILLUMINATION = this._useEmissiveAsIllumination;
            defines.LINKEMISSIVEWITHDIFFUSE = this._linkEmissiveWithDiffuse;
            defines.SPECULAROVERALPHA = this._useSpecularOverAlpha;
            defines.PREMULTIPLYALPHA = (this.alphaMode === 7 || this.alphaMode === 8);
            defines.ALPHATEST_AFTERALLALPHACOMPUTATIONS = this.transparencyMode !== null;
            defines.ALPHABLEND = this.transparencyMode === null || this.needAlphaBlendingForMesh(mesh); // check on null for backward compatibility
        }
        if (!this.detailMap.isReadyForSubMesh(defines, scene)) {
            return false;
        }
        if (defines._areImageProcessingDirty && this._imageProcessingConfiguration) {
            if (!this._imageProcessingConfiguration.isReady()) {
                return false;
            }
            this._imageProcessingConfiguration.prepareDefines(defines);
            defines.IS_REFLECTION_LINEAR = (this.reflectionTexture != null && !this.reflectionTexture.gammaSpace);
            defines.IS_REFRACTION_LINEAR = (this.refractionTexture != null && !this.refractionTexture.gammaSpace);
        }
        if (defines._areFresnelDirty) {
            if (StandardMaterial.FresnelEnabled) {
                // Fresnel
                if (this._diffuseFresnelParameters || this._opacityFresnelParameters ||
                    this._emissiveFresnelParameters || this._refractionFresnelParameters ||
                    this._reflectionFresnelParameters) {
                    defines.DIFFUSEFRESNEL = (this._diffuseFresnelParameters && this._diffuseFresnelParameters.isEnabled);
                    defines.OPACITYFRESNEL = (this._opacityFresnelParameters && this._opacityFresnelParameters.isEnabled);
                    defines.REFLECTIONFRESNEL = (this._reflectionFresnelParameters && this._reflectionFresnelParameters.isEnabled);
                    defines.REFLECTIONFRESNELFROMSPECULAR = this._useReflectionFresnelFromSpecular;
                    defines.REFRACTIONFRESNEL = (this._refractionFresnelParameters && this._refractionFresnelParameters.isEnabled);
                    defines.EMISSIVEFRESNEL = (this._emissiveFresnelParameters && this._emissiveFresnelParameters.isEnabled);
                    defines._needNormals = true;
                    defines.FRESNEL = true;
                }
            }
            else {
                defines.FRESNEL = false;
            }
        }
        // Misc.
        MaterialHelper.PrepareDefinesForMisc(mesh, scene, this._useLogarithmicDepth, this.pointsCloud, this.fogEnabled, this._shouldTurnAlphaTestOn(mesh) || this._forceAlphaTest, defines);
        // Attribs
        MaterialHelper.PrepareDefinesForAttributes(mesh, defines, true, true, true);
        // Values that need to be evaluated on every frame
        MaterialHelper.PrepareDefinesForFrameBoundValues(scene, engine, defines, useInstances, null, subMesh.getRenderingMesh().hasThinInstances);
        // External config
        this.detailMap.prepareDefines(defines, scene);
        // Get correct effect
        if (defines.isDirty) {
            var lightDisposed = defines._areLightsDisposed;
            defines.markAsProcessed();
            // Fallbacks
            var fallbacks = new EffectFallbacks();
            if (defines.REFLECTION) {
                fallbacks.addFallback(0, "REFLECTION");
            }
            if (defines.SPECULAR) {
                fallbacks.addFallback(0, "SPECULAR");
            }
            if (defines.BUMP) {
                fallbacks.addFallback(0, "BUMP");
            }
            if (defines.PARALLAX) {
                fallbacks.addFallback(1, "PARALLAX");
            }
            if (defines.PARALLAXOCCLUSION) {
                fallbacks.addFallback(0, "PARALLAXOCCLUSION");
            }
            if (defines.SPECULAROVERALPHA) {
                fallbacks.addFallback(0, "SPECULAROVERALPHA");
            }
            if (defines.FOG) {
                fallbacks.addFallback(1, "FOG");
            }
            if (defines.POINTSIZE) {
                fallbacks.addFallback(0, "POINTSIZE");
            }
            if (defines.LOGARITHMICDEPTH) {
                fallbacks.addFallback(0, "LOGARITHMICDEPTH");
            }
            MaterialHelper.HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights);
            if (defines.SPECULARTERM) {
                fallbacks.addFallback(0, "SPECULARTERM");
            }
            if (defines.DIFFUSEFRESNEL) {
                fallbacks.addFallback(1, "DIFFUSEFRESNEL");
            }
            if (defines.OPACITYFRESNEL) {
                fallbacks.addFallback(2, "OPACITYFRESNEL");
            }
            if (defines.REFLECTIONFRESNEL) {
                fallbacks.addFallback(3, "REFLECTIONFRESNEL");
            }
            if (defines.EMISSIVEFRESNEL) {
                fallbacks.addFallback(4, "EMISSIVEFRESNEL");
            }
            if (defines.FRESNEL) {
                fallbacks.addFallback(4, "FRESNEL");
            }
            if (defines.MULTIVIEW) {
                fallbacks.addFallback(0, "MULTIVIEW");
            }
            //Attributes
            var attribs = [VertexBuffer.PositionKind];
            if (defines.NORMAL) {
                attribs.push(VertexBuffer.NormalKind);
            }
            if (defines.UV1) {
                attribs.push(VertexBuffer.UVKind);
            }
            if (defines.UV2) {
                attribs.push(VertexBuffer.UV2Kind);
            }
            if (defines.VERTEXCOLOR) {
                attribs.push(VertexBuffer.ColorKind);
            }
            MaterialHelper.PrepareAttributesForBones(attribs, mesh, defines, fallbacks);
            MaterialHelper.PrepareAttributesForInstances(attribs, defines);
            MaterialHelper.PrepareAttributesForMorphTargets(attribs, mesh, defines);
            var shaderName = "default";
            var uniforms = ["world", "view", "viewProjection", "vEyePosition", "vLightsType", "vAmbientColor", "vDiffuseColor", "vSpecularColor", "vEmissiveColor", "visibility",
                "vFogInfos", "vFogColor", "pointSize",
                "vDiffuseInfos", "vAmbientInfos", "vOpacityInfos", "vReflectionInfos", "vEmissiveInfos", "vSpecularInfos", "vBumpInfos", "vLightmapInfos", "vRefractionInfos",
                "mBones",
                "vClipPlane", "vClipPlane2", "vClipPlane3", "vClipPlane4", "vClipPlane5", "vClipPlane6", "diffuseMatrix", "ambientMatrix", "opacityMatrix", "reflectionMatrix", "emissiveMatrix", "specularMatrix", "bumpMatrix", "normalMatrix", "lightmapMatrix", "refractionMatrix",
                "diffuseLeftColor", "diffuseRightColor", "opacityParts", "reflectionLeftColor", "reflectionRightColor", "emissiveLeftColor", "emissiveRightColor", "refractionLeftColor", "refractionRightColor",
                "vReflectionPosition", "vReflectionSize",
                "logarithmicDepthConstant", "vTangentSpaceParams", "alphaCutOff", "boneTextureWidth"
            ];
            var samplers = ["diffuseSampler", "ambientSampler", "opacitySampler", "reflectionCubeSampler",
                "reflection2DSampler", "emissiveSampler", "specularSampler", "bumpSampler", "lightmapSampler",
                "refractionCubeSampler", "refraction2DSampler", "boneSampler"];
            var uniformBuffers = ["Material", "Scene"];
            DetailMapConfiguration.AddUniforms(uniforms);
            DetailMapConfiguration.AddSamplers(samplers);
            PrePassConfiguration.AddUniforms(uniforms);
            PrePassConfiguration.AddSamplers(uniforms);
            if (ImageProcessingConfiguration) {
                ImageProcessingConfiguration.PrepareUniforms(uniforms, defines);
                ImageProcessingConfiguration.PrepareSamplers(samplers, defines);
            }
            MaterialHelper.PrepareUniformsAndSamplersList({
                uniformsNames: uniforms,
                uniformBuffersNames: uniformBuffers,
                samplers: samplers,
                defines: defines,
                maxSimultaneousLights: this._maxSimultaneousLights
            });
            var csnrOptions = {};
            if (this.customShaderNameResolve) {
                shaderName = this.customShaderNameResolve(shaderName, uniforms, uniformBuffers, samplers, defines, attribs, csnrOptions);
            }
            var join = defines.toString();
            var previousEffect = subMesh.effect;
            var effect = scene.getEngine().createEffect(shaderName, {
                attributes: attribs,
                uniformsNames: uniforms,
                uniformBuffersNames: uniformBuffers,
                samplers: samplers,
                defines: join,
                fallbacks: fallbacks,
                onCompiled: this.onCompiled,
                onError: this.onError,
                indexParameters: { maxSimultaneousLights: this._maxSimultaneousLights, maxSimultaneousMorphTargets: defines.NUM_MORPH_INFLUENCERS },
                processFinalCode: csnrOptions.processFinalCode,
                multiTarget: defines.PREPASS
            }, engine);
            if (effect) {
                if (this._onEffectCreatedObservable) {
                    onCreatedEffectParameters.effect = effect;
                    onCreatedEffectParameters.subMesh = subMesh;
                    this._onEffectCreatedObservable.notifyObservers(onCreatedEffectParameters);
                }
                // Use previous effect while new one is compiling
                if (this.allowShaderHotSwapping && previousEffect && !effect.isReady()) {
                    effect = previousEffect;
                    this._rebuildInParallel = true;
                    defines.markAsUnprocessed();
                    if (lightDisposed) {
                        // re register in case it takes more than one frame.
                        defines._areLightsDisposed = true;
                        return false;
                    }
                }
                else {
                    this._rebuildInParallel = false;
                    scene.resetCachedMaterial();
                    subMesh.setEffect(effect, defines);
                    this.buildUniformLayout();
                }
            }
        }
        if (!subMesh.effect || !subMesh.effect.isReady()) {
            return false;
        }
        defines._renderId = scene.getRenderId();
        subMesh.effect._wasPreviouslyReady = true;
        return true;
    };
    /**
     * Builds the material UBO layouts.
     * Used internally during the effect preparation.
     */
    StandardMaterial.prototype.buildUniformLayout = function () {
        // Order is important !
        var ubo = this._uniformBuffer;
        ubo.addUniform("diffuseLeftColor", 4);
        ubo.addUniform("diffuseRightColor", 4);
        ubo.addUniform("opacityParts", 4);
        ubo.addUniform("reflectionLeftColor", 4);
        ubo.addUniform("reflectionRightColor", 4);
        ubo.addUniform("refractionLeftColor", 4);
        ubo.addUniform("refractionRightColor", 4);
        ubo.addUniform("emissiveLeftColor", 4);
        ubo.addUniform("emissiveRightColor", 4);
        ubo.addUniform("vDiffuseInfos", 2);
        ubo.addUniform("vAmbientInfos", 2);
        ubo.addUniform("vOpacityInfos", 2);
        ubo.addUniform("vReflectionInfos", 2);
        ubo.addUniform("vReflectionPosition", 3);
        ubo.addUniform("vReflectionSize", 3);
        ubo.addUniform("vEmissiveInfos", 2);
        ubo.addUniform("vLightmapInfos", 2);
        ubo.addUniform("vSpecularInfos", 2);
        ubo.addUniform("vBumpInfos", 3);
        ubo.addUniform("diffuseMatrix", 16);
        ubo.addUniform("ambientMatrix", 16);
        ubo.addUniform("opacityMatrix", 16);
        ubo.addUniform("reflectionMatrix", 16);
        ubo.addUniform("emissiveMatrix", 16);
        ubo.addUniform("lightmapMatrix", 16);
        ubo.addUniform("specularMatrix", 16);
        ubo.addUniform("bumpMatrix", 16);
        ubo.addUniform("vTangentSpaceParams", 2);
        ubo.addUniform("pointSize", 1);
        ubo.addUniform("refractionMatrix", 16);
        ubo.addUniform("vRefractionInfos", 4);
        ubo.addUniform("vSpecularColor", 4);
        ubo.addUniform("vEmissiveColor", 3);
        ubo.addUniform("visibility", 1);
        ubo.addUniform("vDiffuseColor", 4);
        DetailMapConfiguration.PrepareUniformBuffer(ubo);
        ubo.create();
    };
    /**
     * Unbinds the material from the mesh
     */
    StandardMaterial.prototype.unbind = function () {
        if (this._activeEffect) {
            var needFlag = false;
            if (this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                this._activeEffect.setTexture("reflection2DSampler", null);
                needFlag = true;
            }
            if (this._refractionTexture && this._refractionTexture.isRenderTarget) {
                this._activeEffect.setTexture("refraction2DSampler", null);
                needFlag = true;
            }
            if (needFlag) {
                this._markAllSubMeshesAsTexturesDirty();
            }
        }
        _super.prototype.unbind.call(this);
    };
    /**
     * Binds the submesh to this material by preparing the effect and shader to draw
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh containing the submesh
     * @param subMesh defines the submesh to bind the material to
     */
    StandardMaterial.prototype.bindForSubMesh = function (world, mesh, subMesh) {
        var scene = this.getScene();
        var defines = subMesh._materialDefines;
        if (!defines) {
            return;
        }
        var effect = subMesh.effect;
        if (!effect) {
            return;
        }
        this._activeEffect = effect;
        // Matrices
        if (!defines.INSTANCES || defines.THIN_INSTANCES) {
            this.bindOnlyWorldMatrix(world);
        }
        // PrePass
        this.prePassConfiguration.bindForSubMesh(this._activeEffect, scene, mesh, world, this.isFrozen);
        // Normal Matrix
        if (defines.OBJECTSPACE_NORMALMAP) {
            world.toNormalMatrix(this._normalMatrix);
            this.bindOnlyNormalMatrix(this._normalMatrix);
        }
        var mustRebind = this._mustRebind(scene, effect, mesh.visibility);
        // Bones
        MaterialHelper.BindBonesParameters(mesh, effect);
        var ubo = this._uniformBuffer;
        if (mustRebind) {
            ubo.bindToEffect(effect, "Material");
            this.bindViewProjection(effect);
            if (!ubo.useUbo || !this.isFrozen || !ubo.isSync) {
                if (StandardMaterial.FresnelEnabled && defines.FRESNEL) {
                    // Fresnel
                    if (this.diffuseFresnelParameters && this.diffuseFresnelParameters.isEnabled) {
                        ubo.updateColor4("diffuseLeftColor", this.diffuseFresnelParameters.leftColor, this.diffuseFresnelParameters.power);
                        ubo.updateColor4("diffuseRightColor", this.diffuseFresnelParameters.rightColor, this.diffuseFresnelParameters.bias);
                    }
                    if (this.opacityFresnelParameters && this.opacityFresnelParameters.isEnabled) {
                        ubo.updateColor4("opacityParts", new Color3(this.opacityFresnelParameters.leftColor.toLuminance(), this.opacityFresnelParameters.rightColor.toLuminance(), this.opacityFresnelParameters.bias), this.opacityFresnelParameters.power);
                    }
                    if (this.reflectionFresnelParameters && this.reflectionFresnelParameters.isEnabled) {
                        ubo.updateColor4("reflectionLeftColor", this.reflectionFresnelParameters.leftColor, this.reflectionFresnelParameters.power);
                        ubo.updateColor4("reflectionRightColor", this.reflectionFresnelParameters.rightColor, this.reflectionFresnelParameters.bias);
                    }
                    if (this.refractionFresnelParameters && this.refractionFresnelParameters.isEnabled) {
                        ubo.updateColor4("refractionLeftColor", this.refractionFresnelParameters.leftColor, this.refractionFresnelParameters.power);
                        ubo.updateColor4("refractionRightColor", this.refractionFresnelParameters.rightColor, this.refractionFresnelParameters.bias);
                    }
                    if (this.emissiveFresnelParameters && this.emissiveFresnelParameters.isEnabled) {
                        ubo.updateColor4("emissiveLeftColor", this.emissiveFresnelParameters.leftColor, this.emissiveFresnelParameters.power);
                        ubo.updateColor4("emissiveRightColor", this.emissiveFresnelParameters.rightColor, this.emissiveFresnelParameters.bias);
                    }
                }
                // Textures
                if (scene.texturesEnabled) {
                    if (this._diffuseTexture && StandardMaterial.DiffuseTextureEnabled) {
                        ubo.updateFloat2("vDiffuseInfos", this._diffuseTexture.coordinatesIndex, this._diffuseTexture.level);
                        MaterialHelper.BindTextureMatrix(this._diffuseTexture, ubo, "diffuse");
                    }
                    if (this._ambientTexture && StandardMaterial.AmbientTextureEnabled) {
                        ubo.updateFloat2("vAmbientInfos", this._ambientTexture.coordinatesIndex, this._ambientTexture.level);
                        MaterialHelper.BindTextureMatrix(this._ambientTexture, ubo, "ambient");
                    }
                    if (this._opacityTexture && StandardMaterial.OpacityTextureEnabled) {
                        ubo.updateFloat2("vOpacityInfos", this._opacityTexture.coordinatesIndex, this._opacityTexture.level);
                        MaterialHelper.BindTextureMatrix(this._opacityTexture, ubo, "opacity");
                    }
                    if (this._hasAlphaChannel()) {
                        effect.setFloat("alphaCutOff", this.alphaCutOff);
                    }
                    if (this._reflectionTexture && StandardMaterial.ReflectionTextureEnabled) {
                        ubo.updateFloat2("vReflectionInfos", this._reflectionTexture.level, this.roughness);
                        ubo.updateMatrix("reflectionMatrix", this._reflectionTexture.getReflectionTextureMatrix());
                        if (this._reflectionTexture.boundingBoxSize) {
                            var cubeTexture = this._reflectionTexture;
                            ubo.updateVector3("vReflectionPosition", cubeTexture.boundingBoxPosition);
                            ubo.updateVector3("vReflectionSize", cubeTexture.boundingBoxSize);
                        }
                    }
                    if (this._emissiveTexture && StandardMaterial.EmissiveTextureEnabled) {
                        ubo.updateFloat2("vEmissiveInfos", this._emissiveTexture.coordinatesIndex, this._emissiveTexture.level);
                        MaterialHelper.BindTextureMatrix(this._emissiveTexture, ubo, "emissive");
                    }
                    if (this._lightmapTexture && StandardMaterial.LightmapTextureEnabled) {
                        ubo.updateFloat2("vLightmapInfos", this._lightmapTexture.coordinatesIndex, this._lightmapTexture.level);
                        MaterialHelper.BindTextureMatrix(this._lightmapTexture, ubo, "lightmap");
                    }
                    if (this._specularTexture && StandardMaterial.SpecularTextureEnabled) {
                        ubo.updateFloat2("vSpecularInfos", this._specularTexture.coordinatesIndex, this._specularTexture.level);
                        MaterialHelper.BindTextureMatrix(this._specularTexture, ubo, "specular");
                    }
                    if (this._bumpTexture && scene.getEngine().getCaps().standardDerivatives && StandardMaterial.BumpTextureEnabled) {
                        ubo.updateFloat3("vBumpInfos", this._bumpTexture.coordinatesIndex, 1.0 / this._bumpTexture.level, this.parallaxScaleBias);
                        MaterialHelper.BindTextureMatrix(this._bumpTexture, ubo, "bump");
                        if (scene._mirroredCameraPosition) {
                            ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? 1.0 : -1.0, this._invertNormalMapY ? 1.0 : -1.0);
                        }
                        else {
                            ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? -1.0 : 1.0, this._invertNormalMapY ? -1.0 : 1.0);
                        }
                    }
                    if (this._refractionTexture && StandardMaterial.RefractionTextureEnabled) {
                        var depth = 1.0;
                        if (!this._refractionTexture.isCube) {
                            ubo.updateMatrix("refractionMatrix", this._refractionTexture.getReflectionTextureMatrix());
                            if (this._refractionTexture.depth) {
                                depth = this._refractionTexture.depth;
                            }
                        }
                        ubo.updateFloat4("vRefractionInfos", this._refractionTexture.level, this.indexOfRefraction, depth, this.invertRefractionY ? -1 : 1);
                    }
                }
                // Point size
                if (this.pointsCloud) {
                    ubo.updateFloat("pointSize", this.pointSize);
                }
                if (defines.SPECULARTERM) {
                    ubo.updateColor4("vSpecularColor", this.specularColor, this.specularPower);
                }
                ubo.updateColor3("vEmissiveColor", StandardMaterial.EmissiveTextureEnabled ? this.emissiveColor : Color3.BlackReadOnly);
                // Diffuse
                ubo.updateColor4("vDiffuseColor", this.diffuseColor, this.alpha);
            }
            // Visibility
            ubo.updateFloat("visibility", mesh.visibility);
            // Textures
            if (scene.texturesEnabled) {
                if (this._diffuseTexture && StandardMaterial.DiffuseTextureEnabled) {
                    effect.setTexture("diffuseSampler", this._diffuseTexture);
                }
                if (this._ambientTexture && StandardMaterial.AmbientTextureEnabled) {
                    effect.setTexture("ambientSampler", this._ambientTexture);
                }
                if (this._opacityTexture && StandardMaterial.OpacityTextureEnabled) {
                    effect.setTexture("opacitySampler", this._opacityTexture);
                }
                if (this._reflectionTexture && StandardMaterial.ReflectionTextureEnabled) {
                    if (this._reflectionTexture.isCube) {
                        effect.setTexture("reflectionCubeSampler", this._reflectionTexture);
                    }
                    else {
                        effect.setTexture("reflection2DSampler", this._reflectionTexture);
                    }
                }
                if (this._emissiveTexture && StandardMaterial.EmissiveTextureEnabled) {
                    effect.setTexture("emissiveSampler", this._emissiveTexture);
                }
                if (this._lightmapTexture && StandardMaterial.LightmapTextureEnabled) {
                    effect.setTexture("lightmapSampler", this._lightmapTexture);
                }
                if (this._specularTexture && StandardMaterial.SpecularTextureEnabled) {
                    effect.setTexture("specularSampler", this._specularTexture);
                }
                if (this._bumpTexture && scene.getEngine().getCaps().standardDerivatives && StandardMaterial.BumpTextureEnabled) {
                    effect.setTexture("bumpSampler", this._bumpTexture);
                }
                if (this._refractionTexture && StandardMaterial.RefractionTextureEnabled) {
                    var depth = 1.0;
                    if (this._refractionTexture.isCube) {
                        effect.setTexture("refractionCubeSampler", this._refractionTexture);
                    }
                    else {
                        effect.setTexture("refraction2DSampler", this._refractionTexture);
                    }
                }
            }
            this.detailMap.bindForSubMesh(ubo, scene, this.isFrozen);
            // Clip plane
            MaterialHelper.BindClipPlane(effect, scene);
            // Colors
            scene.ambientColor.multiplyToRef(this.ambientColor, this._globalAmbientColor);
            MaterialHelper.BindEyePosition(effect, scene);
            effect.setColor3("vAmbientColor", this._globalAmbientColor);
        }
        if (mustRebind || !this.isFrozen) {
            // Lights
            if (scene.lightsEnabled && !this._disableLighting) {
                MaterialHelper.BindLights(scene, mesh, effect, defines, this._maxSimultaneousLights, this._rebuildInParallel);
            }
            // View
            if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== Scene.FOGMODE_NONE || this._reflectionTexture || this._refractionTexture) {
                this.bindView(effect);
            }
            // Fog
            MaterialHelper.BindFogParameters(scene, mesh, effect);
            // Morph targets
            if (defines.NUM_MORPH_INFLUENCERS) {
                MaterialHelper.BindMorphTargetParameters(mesh, effect);
            }
            // Log. depth
            if (this.useLogarithmicDepth) {
                MaterialHelper.BindLogDepth(defines, effect, scene);
            }
            // image processing
            if (this._imageProcessingConfiguration && !this._imageProcessingConfiguration.applyByPostProcess) {
                this._imageProcessingConfiguration.bind(this._activeEffect);
            }
        }
        ubo.update();
        this._afterBind(mesh, this._activeEffect);
    };
    /**
     * Get the list of animatables in the material.
     * @returns the list of animatables object used in the material
     */
    StandardMaterial.prototype.getAnimatables = function () {
        var results = [];
        if (this._diffuseTexture && this._diffuseTexture.animations && this._diffuseTexture.animations.length > 0) {
            results.push(this._diffuseTexture);
        }
        if (this._ambientTexture && this._ambientTexture.animations && this._ambientTexture.animations.length > 0) {
            results.push(this._ambientTexture);
        }
        if (this._opacityTexture && this._opacityTexture.animations && this._opacityTexture.animations.length > 0) {
            results.push(this._opacityTexture);
        }
        if (this._reflectionTexture && this._reflectionTexture.animations && this._reflectionTexture.animations.length > 0) {
            results.push(this._reflectionTexture);
        }
        if (this._emissiveTexture && this._emissiveTexture.animations && this._emissiveTexture.animations.length > 0) {
            results.push(this._emissiveTexture);
        }
        if (this._specularTexture && this._specularTexture.animations && this._specularTexture.animations.length > 0) {
            results.push(this._specularTexture);
        }
        if (this._bumpTexture && this._bumpTexture.animations && this._bumpTexture.animations.length > 0) {
            results.push(this._bumpTexture);
        }
        if (this._lightmapTexture && this._lightmapTexture.animations && this._lightmapTexture.animations.length > 0) {
            results.push(this._lightmapTexture);
        }
        if (this._refractionTexture && this._refractionTexture.animations && this._refractionTexture.animations.length > 0) {
            results.push(this._refractionTexture);
        }
        this.detailMap.getAnimatables(results);
        return results;
    };
    /**
     * Gets the active textures from the material
     * @returns an array of textures
     */
    StandardMaterial.prototype.getActiveTextures = function () {
        var activeTextures = _super.prototype.getActiveTextures.call(this);
        if (this._diffuseTexture) {
            activeTextures.push(this._diffuseTexture);
        }
        if (this._ambientTexture) {
            activeTextures.push(this._ambientTexture);
        }
        if (this._opacityTexture) {
            activeTextures.push(this._opacityTexture);
        }
        if (this._reflectionTexture) {
            activeTextures.push(this._reflectionTexture);
        }
        if (this._emissiveTexture) {
            activeTextures.push(this._emissiveTexture);
        }
        if (this._specularTexture) {
            activeTextures.push(this._specularTexture);
        }
        if (this._bumpTexture) {
            activeTextures.push(this._bumpTexture);
        }
        if (this._lightmapTexture) {
            activeTextures.push(this._lightmapTexture);
        }
        if (this._refractionTexture) {
            activeTextures.push(this._refractionTexture);
        }
        this.detailMap.getActiveTextures(activeTextures);
        return activeTextures;
    };
    /**
     * Specifies if the material uses a texture
     * @param texture defines the texture to check against the material
     * @returns a boolean specifying if the material uses the texture
     */
    StandardMaterial.prototype.hasTexture = function (texture) {
        if (_super.prototype.hasTexture.call(this, texture)) {
            return true;
        }
        if (this._diffuseTexture === texture) {
            return true;
        }
        if (this._ambientTexture === texture) {
            return true;
        }
        if (this._opacityTexture === texture) {
            return true;
        }
        if (this._reflectionTexture === texture) {
            return true;
        }
        if (this._emissiveTexture === texture) {
            return true;
        }
        if (this._specularTexture === texture) {
            return true;
        }
        if (this._bumpTexture === texture) {
            return true;
        }
        if (this._lightmapTexture === texture) {
            return true;
        }
        if (this._refractionTexture === texture) {
            return true;
        }
        return this.detailMap.hasTexture(texture);
    };
    /**
     * Disposes the material
     * @param forceDisposeEffect specifies if effects should be forcefully disposed
     * @param forceDisposeTextures specifies if textures should be forcefully disposed
     */
    StandardMaterial.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (forceDisposeTextures) {
            (_a = this._diffuseTexture) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this._ambientTexture) === null || _b === void 0 ? void 0 : _b.dispose();
            (_c = this._opacityTexture) === null || _c === void 0 ? void 0 : _c.dispose();
            (_d = this._reflectionTexture) === null || _d === void 0 ? void 0 : _d.dispose();
            (_e = this._emissiveTexture) === null || _e === void 0 ? void 0 : _e.dispose();
            (_f = this._specularTexture) === null || _f === void 0 ? void 0 : _f.dispose();
            (_g = this._bumpTexture) === null || _g === void 0 ? void 0 : _g.dispose();
            (_h = this._lightmapTexture) === null || _h === void 0 ? void 0 : _h.dispose();
            (_j = this._refractionTexture) === null || _j === void 0 ? void 0 : _j.dispose();
        }
        this.detailMap.dispose(forceDisposeTextures);
        if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
            this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
        }
        _super.prototype.dispose.call(this, forceDisposeEffect, forceDisposeTextures);
    };
    /**
     * Makes a duplicate of the material, and gives it a new name
     * @param name defines the new name for the duplicated material
     * @returns the cloned material
     */
    StandardMaterial.prototype.clone = function (name) {
        var _this = this;
        var result = SerializationHelper.Clone(function () { return new StandardMaterial(name, _this.getScene()); }, this);
        result.name = name;
        result.id = name;
        return result;
    };
    /**
     * Serializes this material in a JSON representation
     * @returns the serialized material object
     */
    StandardMaterial.prototype.serialize = function () {
        return SerializationHelper.Serialize(this);
    };
    /**
     * Creates a standard material from parsed material data
     * @param source defines the JSON representation of the material
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a new standard material
     */
    StandardMaterial.Parse = function (source, scene, rootUrl) {
        return SerializationHelper.Parse(function () { return new StandardMaterial(source.name, scene); }, source, scene, rootUrl);
    };
    Object.defineProperty(StandardMaterial, "DiffuseTextureEnabled", {
        // Flags used to enable or disable a type of texture for all Standard Materials
        /**
         * Are diffuse textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.DiffuseTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.DiffuseTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "DetailTextureEnabled", {
        /**
         * Are detail textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.DetailTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.DetailTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "AmbientTextureEnabled", {
        /**
         * Are ambient textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.AmbientTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.AmbientTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "OpacityTextureEnabled", {
        /**
         * Are opacity textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.OpacityTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.OpacityTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "ReflectionTextureEnabled", {
        /**
         * Are reflection textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.ReflectionTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.ReflectionTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "EmissiveTextureEnabled", {
        /**
         * Are emissive textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.EmissiveTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.EmissiveTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "SpecularTextureEnabled", {
        /**
         * Are specular textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.SpecularTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.SpecularTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "BumpTextureEnabled", {
        /**
         * Are bump textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.BumpTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.BumpTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "LightmapTextureEnabled", {
        /**
         * Are lightmap textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.LightmapTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.LightmapTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "RefractionTextureEnabled", {
        /**
         * Are refraction textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.RefractionTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.RefractionTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "ColorGradingTextureEnabled", {
        /**
         * Are color grading textures enabled in the application.
         */
        get: function () {
            return MaterialFlags.ColorGradingTextureEnabled;
        },
        set: function (value) {
            MaterialFlags.ColorGradingTextureEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial, "FresnelEnabled", {
        /**
         * Are fresnels enabled in the application.
         */
        get: function () {
            return MaterialFlags.FresnelEnabled;
        },
        set: function (value) {
            MaterialFlags.FresnelEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        serializeAsTexture("diffuseTexture")
    ], StandardMaterial.prototype, "_diffuseTexture", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
    ], StandardMaterial.prototype, "diffuseTexture", void 0);
    __decorate([
        serializeAsTexture("ambientTexture")
    ], StandardMaterial.prototype, "_ambientTexture", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "ambientTexture", void 0);
    __decorate([
        serializeAsTexture("opacityTexture")
    ], StandardMaterial.prototype, "_opacityTexture", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
    ], StandardMaterial.prototype, "opacityTexture", void 0);
    __decorate([
        serializeAsTexture("reflectionTexture")
    ], StandardMaterial.prototype, "_reflectionTexture", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "reflectionTexture", void 0);
    __decorate([
        serializeAsTexture("emissiveTexture")
    ], StandardMaterial.prototype, "_emissiveTexture", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "emissiveTexture", void 0);
    __decorate([
        serializeAsTexture("specularTexture")
    ], StandardMaterial.prototype, "_specularTexture", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "specularTexture", void 0);
    __decorate([
        serializeAsTexture("bumpTexture")
    ], StandardMaterial.prototype, "_bumpTexture", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "bumpTexture", void 0);
    __decorate([
        serializeAsTexture("lightmapTexture")
    ], StandardMaterial.prototype, "_lightmapTexture", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "lightmapTexture", void 0);
    __decorate([
        serializeAsTexture("refractionTexture")
    ], StandardMaterial.prototype, "_refractionTexture", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "refractionTexture", void 0);
    __decorate([
        serializeAsColor3("ambient")
    ], StandardMaterial.prototype, "ambientColor", void 0);
    __decorate([
        serializeAsColor3("diffuse")
    ], StandardMaterial.prototype, "diffuseColor", void 0);
    __decorate([
        serializeAsColor3("specular")
    ], StandardMaterial.prototype, "specularColor", void 0);
    __decorate([
        serializeAsColor3("emissive")
    ], StandardMaterial.prototype, "emissiveColor", void 0);
    __decorate([
        serialize()
    ], StandardMaterial.prototype, "specularPower", void 0);
    __decorate([
        serialize("useAlphaFromDiffuseTexture")
    ], StandardMaterial.prototype, "_useAlphaFromDiffuseTexture", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
    ], StandardMaterial.prototype, "useAlphaFromDiffuseTexture", void 0);
    __decorate([
        serialize("useEmissiveAsIllumination")
    ], StandardMaterial.prototype, "_useEmissiveAsIllumination", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "useEmissiveAsIllumination", void 0);
    __decorate([
        serialize("linkEmissiveWithDiffuse")
    ], StandardMaterial.prototype, "_linkEmissiveWithDiffuse", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "linkEmissiveWithDiffuse", void 0);
    __decorate([
        serialize("useSpecularOverAlpha")
    ], StandardMaterial.prototype, "_useSpecularOverAlpha", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "useSpecularOverAlpha", void 0);
    __decorate([
        serialize("useReflectionOverAlpha")
    ], StandardMaterial.prototype, "_useReflectionOverAlpha", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "useReflectionOverAlpha", void 0);
    __decorate([
        serialize("disableLighting")
    ], StandardMaterial.prototype, "_disableLighting", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsLightsDirty")
    ], StandardMaterial.prototype, "disableLighting", void 0);
    __decorate([
        serialize("useObjectSpaceNormalMap")
    ], StandardMaterial.prototype, "_useObjectSpaceNormalMap", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "useObjectSpaceNormalMap", void 0);
    __decorate([
        serialize("useParallax")
    ], StandardMaterial.prototype, "_useParallax", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "useParallax", void 0);
    __decorate([
        serialize("useParallaxOcclusion")
    ], StandardMaterial.prototype, "_useParallaxOcclusion", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "useParallaxOcclusion", void 0);
    __decorate([
        serialize()
    ], StandardMaterial.prototype, "parallaxScaleBias", void 0);
    __decorate([
        serialize("roughness")
    ], StandardMaterial.prototype, "_roughness", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "roughness", void 0);
    __decorate([
        serialize()
    ], StandardMaterial.prototype, "indexOfRefraction", void 0);
    __decorate([
        serialize()
    ], StandardMaterial.prototype, "invertRefractionY", void 0);
    __decorate([
        serialize()
    ], StandardMaterial.prototype, "alphaCutOff", void 0);
    __decorate([
        serialize("useLightmapAsShadowmap")
    ], StandardMaterial.prototype, "_useLightmapAsShadowmap", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "useLightmapAsShadowmap", void 0);
    __decorate([
        serializeAsFresnelParameters("diffuseFresnelParameters")
    ], StandardMaterial.prototype, "_diffuseFresnelParameters", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsFresnelDirty")
    ], StandardMaterial.prototype, "diffuseFresnelParameters", void 0);
    __decorate([
        serializeAsFresnelParameters("opacityFresnelParameters")
    ], StandardMaterial.prototype, "_opacityFresnelParameters", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsFresnelAndMiscDirty")
    ], StandardMaterial.prototype, "opacityFresnelParameters", void 0);
    __decorate([
        serializeAsFresnelParameters("reflectionFresnelParameters")
    ], StandardMaterial.prototype, "_reflectionFresnelParameters", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsFresnelDirty")
    ], StandardMaterial.prototype, "reflectionFresnelParameters", void 0);
    __decorate([
        serializeAsFresnelParameters("refractionFresnelParameters")
    ], StandardMaterial.prototype, "_refractionFresnelParameters", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsFresnelDirty")
    ], StandardMaterial.prototype, "refractionFresnelParameters", void 0);
    __decorate([
        serializeAsFresnelParameters("emissiveFresnelParameters")
    ], StandardMaterial.prototype, "_emissiveFresnelParameters", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsFresnelDirty")
    ], StandardMaterial.prototype, "emissiveFresnelParameters", void 0);
    __decorate([
        serialize("useReflectionFresnelFromSpecular")
    ], StandardMaterial.prototype, "_useReflectionFresnelFromSpecular", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsFresnelDirty")
    ], StandardMaterial.prototype, "useReflectionFresnelFromSpecular", void 0);
    __decorate([
        serialize("useGlossinessFromSpecularMapAlpha")
    ], StandardMaterial.prototype, "_useGlossinessFromSpecularMapAlpha", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "useGlossinessFromSpecularMapAlpha", void 0);
    __decorate([
        serialize("maxSimultaneousLights")
    ], StandardMaterial.prototype, "_maxSimultaneousLights", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsLightsDirty")
    ], StandardMaterial.prototype, "maxSimultaneousLights", void 0);
    __decorate([
        serialize("invertNormalMapX")
    ], StandardMaterial.prototype, "_invertNormalMapX", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "invertNormalMapX", void 0);
    __decorate([
        serialize("invertNormalMapY")
    ], StandardMaterial.prototype, "_invertNormalMapY", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "invertNormalMapY", void 0);
    __decorate([
        serialize("twoSidedLighting")
    ], StandardMaterial.prototype, "_twoSidedLighting", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], StandardMaterial.prototype, "twoSidedLighting", void 0);
    __decorate([
        serialize()
    ], StandardMaterial.prototype, "useLogarithmicDepth", null);
    return StandardMaterial;
}(PushMaterial));
_TypeStore.RegisteredTypes["BABYLON.StandardMaterial"] = StandardMaterial;
Scene.DefaultMaterialFactory = function (scene) {
    return new StandardMaterial("default material", scene);
};

export { DetailMapConfiguration as D, MaterialFlags as M, PushMaterial as P, StandardMaterial as S, StandardMaterialDefines as a, PrePassConfiguration as b };
