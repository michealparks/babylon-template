import { E as EngineStore, L as Logger, f as Effect } from './thinEngine-e576a091.js';
import { b as Color3 } from './math.color-fc6e801e.js';
import { S as Scene } from './scene-cbeb8ae2.js';
import { V as VertexBuffer } from './sceneComponent-5502b64a.js';
import { L as Light } from './light-a23926e9.js';

/**
 * "Static Class" containing a few commonly used helper while dealing with material for rendering purpose.
 *
 * It is complementary with MaterialHelper but provides completely independent functions (for tree shaking sake)
 *
 * This works by convention in BabylonJS but is meant to be use only with shader following the in place naming rules and conventions.
 */
var ThinMaterialHelper = /** @class */ (function () {
    function ThinMaterialHelper() {
    }
    /**
     * Binds the clip plane information from the holder to the effect.
     * @param effect The effect we are binding the data to
     * @param holder The entity containing the clip plane information
     */
    ThinMaterialHelper.BindClipPlane = function (effect, holder) {
        if (holder.clipPlane) {
            var clipPlane = holder.clipPlane;
            effect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
        }
        if (holder.clipPlane2) {
            var clipPlane = holder.clipPlane2;
            effect.setFloat4("vClipPlane2", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
        }
        if (holder.clipPlane3) {
            var clipPlane = holder.clipPlane3;
            effect.setFloat4("vClipPlane3", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
        }
        if (holder.clipPlane4) {
            var clipPlane = holder.clipPlane4;
            effect.setFloat4("vClipPlane4", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
        }
        if (holder.clipPlane5) {
            var clipPlane = holder.clipPlane5;
            effect.setFloat4("vClipPlane5", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
        }
        if (holder.clipPlane6) {
            var clipPlane = holder.clipPlane6;
            effect.setFloat4("vClipPlane6", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
        }
    };
    return ThinMaterialHelper;
}());

/**
 * "Static Class" containing the most commonly used helper while dealing with material for rendering purpose.
 *
 * It contains the basic tools to help defining defines, binding uniform for the common part of the materials.
 *
 * This works by convention in BabylonJS but is meant to be use only with shader following the in place naming rules and conventions.
 */
var MaterialHelper = /** @class */ (function () {
    function MaterialHelper() {
    }
    /**
     * Bind the current view position to an effect.
     * @param effect The effect to be bound
     * @param scene The scene the eyes position is used from
     * @param variableName name of the shader variable that will hold the eye position
     */
    MaterialHelper.BindEyePosition = function (effect, scene, variableName) {
        if (variableName === void 0) { variableName = "vEyePosition"; }
        if (scene._forcedViewPosition) {
            effect.setVector3(variableName, scene._forcedViewPosition);
            return;
        }
        var globalPosition = scene.activeCamera.globalPosition;
        if (!globalPosition) {
            // Use WebVRFreecamera's device position as global position is not it's actual position in babylon space
            globalPosition = scene.activeCamera.devicePosition;
        }
        effect.setVector3(variableName, scene._mirroredCameraPosition ? scene._mirroredCameraPosition : globalPosition);
    };
    /**
     * Helps preparing the defines values about the UVs in used in the effect.
     * UVs are shared as much as we can accross channels in the shaders.
     * @param texture The texture we are preparing the UVs for
     * @param defines The defines to update
     * @param key The channel key "diffuse", "specular"... used in the shader
     */
    MaterialHelper.PrepareDefinesForMergedUV = function (texture, defines, key) {
        defines._needUVs = true;
        defines[key] = true;
        if (texture.getTextureMatrix().isIdentityAs3x2()) {
            defines[key + "DIRECTUV"] = texture.coordinatesIndex + 1;
            if (texture.coordinatesIndex === 0) {
                defines["MAINUV1"] = true;
            }
            else {
                defines["MAINUV2"] = true;
            }
        }
        else {
            defines[key + "DIRECTUV"] = 0;
        }
    };
    /**
     * Binds a texture matrix value to its corrsponding uniform
     * @param texture The texture to bind the matrix for
     * @param uniformBuffer The uniform buffer receivin the data
     * @param key The channel key "diffuse", "specular"... used in the shader
     */
    MaterialHelper.BindTextureMatrix = function (texture, uniformBuffer, key) {
        var matrix = texture.getTextureMatrix();
        uniformBuffer.updateMatrix(key + "Matrix", matrix);
    };
    /**
     * Gets the current status of the fog (should it be enabled?)
     * @param mesh defines the mesh to evaluate for fog support
     * @param scene defines the hosting scene
     * @returns true if fog must be enabled
     */
    MaterialHelper.GetFogState = function (mesh, scene) {
        return (scene.fogEnabled && mesh.applyFog && scene.fogMode !== Scene.FOGMODE_NONE);
    };
    /**
     * Helper used to prepare the list of defines associated with misc. values for shader compilation
     * @param mesh defines the current mesh
     * @param scene defines the current scene
     * @param useLogarithmicDepth defines if logarithmic depth has to be turned on
     * @param pointsCloud defines if point cloud rendering has to be turned on
     * @param fogEnabled defines if fog has to be turned on
     * @param alphaTest defines if alpha testing has to be turned on
     * @param defines defines the current list of defines
     */
    MaterialHelper.PrepareDefinesForMisc = function (mesh, scene, useLogarithmicDepth, pointsCloud, fogEnabled, alphaTest, defines) {
        if (defines._areMiscDirty) {
            defines["LOGARITHMICDEPTH"] = useLogarithmicDepth;
            defines["POINTSIZE"] = pointsCloud;
            defines["FOG"] = fogEnabled && this.GetFogState(mesh, scene);
            defines["NONUNIFORMSCALING"] = mesh.nonUniformScaling;
            defines["ALPHATEST"] = alphaTest;
        }
    };
    /**
     * Helper used to prepare the list of defines associated with frame values for shader compilation
     * @param scene defines the current scene
     * @param engine defines the current engine
     * @param defines specifies the list of active defines
     * @param useInstances defines if instances have to be turned on
     * @param useClipPlane defines if clip plane have to be turned on
     * @param useInstances defines if instances have to be turned on
     * @param useThinInstances defines if thin instances have to be turned on
     */
    MaterialHelper.PrepareDefinesForFrameBoundValues = function (scene, engine, defines, useInstances, useClipPlane, useThinInstances) {
        if (useClipPlane === void 0) { useClipPlane = null; }
        if (useThinInstances === void 0) { useThinInstances = false; }
        var changed = false;
        var useClipPlane1 = false;
        var useClipPlane2 = false;
        var useClipPlane3 = false;
        var useClipPlane4 = false;
        var useClipPlane5 = false;
        var useClipPlane6 = false;
        useClipPlane1 = useClipPlane == null ? (scene.clipPlane !== undefined && scene.clipPlane !== null) : useClipPlane;
        useClipPlane2 = useClipPlane == null ? (scene.clipPlane2 !== undefined && scene.clipPlane2 !== null) : useClipPlane;
        useClipPlane3 = useClipPlane == null ? (scene.clipPlane3 !== undefined && scene.clipPlane3 !== null) : useClipPlane;
        useClipPlane4 = useClipPlane == null ? (scene.clipPlane4 !== undefined && scene.clipPlane4 !== null) : useClipPlane;
        useClipPlane5 = useClipPlane == null ? (scene.clipPlane5 !== undefined && scene.clipPlane5 !== null) : useClipPlane;
        useClipPlane6 = useClipPlane == null ? (scene.clipPlane6 !== undefined && scene.clipPlane6 !== null) : useClipPlane;
        if (defines["CLIPPLANE"] !== useClipPlane1) {
            defines["CLIPPLANE"] = useClipPlane1;
            changed = true;
        }
        if (defines["CLIPPLANE2"] !== useClipPlane2) {
            defines["CLIPPLANE2"] = useClipPlane2;
            changed = true;
        }
        if (defines["CLIPPLANE3"] !== useClipPlane3) {
            defines["CLIPPLANE3"] = useClipPlane3;
            changed = true;
        }
        if (defines["CLIPPLANE4"] !== useClipPlane4) {
            defines["CLIPPLANE4"] = useClipPlane4;
            changed = true;
        }
        if (defines["CLIPPLANE5"] !== useClipPlane5) {
            defines["CLIPPLANE5"] = useClipPlane5;
            changed = true;
        }
        if (defines["CLIPPLANE6"] !== useClipPlane6) {
            defines["CLIPPLANE6"] = useClipPlane6;
            changed = true;
        }
        if (defines["DEPTHPREPASS"] !== !engine.getColorWrite()) {
            defines["DEPTHPREPASS"] = !defines["DEPTHPREPASS"];
            changed = true;
        }
        if (defines["INSTANCES"] !== useInstances) {
            defines["INSTANCES"] = useInstances;
            changed = true;
        }
        if (defines["THIN_INSTANCES"] !== useThinInstances) {
            defines["THIN_INSTANCES"] = useThinInstances;
            changed = true;
        }
        if (changed) {
            defines.markAsUnprocessed();
        }
    };
    /**
     * Prepares the defines for bones
     * @param mesh The mesh containing the geometry data we will draw
     * @param defines The defines to update
     */
    MaterialHelper.PrepareDefinesForBones = function (mesh, defines) {
        if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
            defines["NUM_BONE_INFLUENCERS"] = mesh.numBoneInfluencers;
            var materialSupportsBoneTexture = defines["BONETEXTURE"] !== undefined;
            if (mesh.skeleton.isUsingTextureForMatrices && materialSupportsBoneTexture) {
                defines["BONETEXTURE"] = true;
            }
            else {
                defines["BonesPerMesh"] = (mesh.skeleton.bones.length + 1);
                defines["BONETEXTURE"] = materialSupportsBoneTexture ? false : undefined;
                var prePassRenderer = mesh.getScene().prePassRenderer;
                if (prePassRenderer && prePassRenderer.enabled) {
                    var nonExcluded = prePassRenderer.excludedSkinnedMesh.indexOf(mesh) === -1;
                    defines["BONES_VELOCITY_ENABLED"] = nonExcluded;
                }
            }
        }
        else {
            defines["NUM_BONE_INFLUENCERS"] = 0;
            defines["BonesPerMesh"] = 0;
        }
    };
    /**
     * Prepares the defines for morph targets
     * @param mesh The mesh containing the geometry data we will draw
     * @param defines The defines to update
     */
    MaterialHelper.PrepareDefinesForMorphTargets = function (mesh, defines) {
        var manager = mesh.morphTargetManager;
        if (manager) {
            defines["MORPHTARGETS_UV"] = manager.supportsUVs && defines["UV1"];
            defines["MORPHTARGETS_TANGENT"] = manager.supportsTangents && defines["TANGENT"];
            defines["MORPHTARGETS_NORMAL"] = manager.supportsNormals && defines["NORMAL"];
            defines["MORPHTARGETS"] = (manager.numInfluencers > 0);
            defines["NUM_MORPH_INFLUENCERS"] = manager.numInfluencers;
        }
        else {
            defines["MORPHTARGETS_UV"] = false;
            defines["MORPHTARGETS_TANGENT"] = false;
            defines["MORPHTARGETS_NORMAL"] = false;
            defines["MORPHTARGETS"] = false;
            defines["NUM_MORPH_INFLUENCERS"] = 0;
        }
    };
    /**
     * Prepares the defines used in the shader depending on the attributes data available in the mesh
     * @param mesh The mesh containing the geometry data we will draw
     * @param defines The defines to update
     * @param useVertexColor Precise whether vertex colors should be used or not (override mesh info)
     * @param useBones Precise whether bones should be used or not (override mesh info)
     * @param useMorphTargets Precise whether morph targets should be used or not (override mesh info)
     * @param useVertexAlpha Precise whether vertex alpha should be used or not (override mesh info)
     * @returns false if defines are considered not dirty and have not been checked
     */
    MaterialHelper.PrepareDefinesForAttributes = function (mesh, defines, useVertexColor, useBones, useMorphTargets, useVertexAlpha) {
        if (useMorphTargets === void 0) { useMorphTargets = false; }
        if (useVertexAlpha === void 0) { useVertexAlpha = true; }
        if (!defines._areAttributesDirty && defines._needNormals === defines._normals && defines._needUVs === defines._uvs) {
            return false;
        }
        defines._normals = defines._needNormals;
        defines._uvs = defines._needUVs;
        defines["NORMAL"] = (defines._needNormals && mesh.isVerticesDataPresent(VertexBuffer.NormalKind));
        if (defines._needNormals && mesh.isVerticesDataPresent(VertexBuffer.TangentKind)) {
            defines["TANGENT"] = true;
        }
        if (defines._needUVs) {
            defines["UV1"] = mesh.isVerticesDataPresent(VertexBuffer.UVKind);
            defines["UV2"] = mesh.isVerticesDataPresent(VertexBuffer.UV2Kind);
        }
        else {
            defines["UV1"] = false;
            defines["UV2"] = false;
        }
        if (useVertexColor) {
            var hasVertexColors = mesh.useVertexColors && mesh.isVerticesDataPresent(VertexBuffer.ColorKind);
            defines["VERTEXCOLOR"] = hasVertexColors;
            defines["VERTEXALPHA"] = mesh.hasVertexAlpha && hasVertexColors && useVertexAlpha;
        }
        if (useBones) {
            this.PrepareDefinesForBones(mesh, defines);
        }
        if (useMorphTargets) {
            this.PrepareDefinesForMorphTargets(mesh, defines);
        }
        return true;
    };
    /**
     * Prepares the defines related to multiview
     * @param scene The scene we are intending to draw
     * @param defines The defines to update
     */
    MaterialHelper.PrepareDefinesForMultiview = function (scene, defines) {
        if (scene.activeCamera) {
            var previousMultiview = defines.MULTIVIEW;
            defines.MULTIVIEW = (scene.activeCamera.outputRenderTarget !== null && scene.activeCamera.outputRenderTarget.getViewCount() > 1);
            if (defines.MULTIVIEW != previousMultiview) {
                defines.markAsUnprocessed();
            }
        }
    };
    /**
     * Prepares the defines related to the prepass
     * @param scene The scene we are intending to draw
     * @param defines The defines to update
     * @param canRenderToMRT Indicates if this material renders to several textures in the prepass
     */
    MaterialHelper.PrepareDefinesForPrePass = function (scene, defines, canRenderToMRT) {
        var previousPrePass = defines.PREPASS;
        if (!defines._arePrePassDirty) {
            return;
        }
        var texturesList = [
            {
                type: 1,
                define: "PREPASS_POSITION",
                index: "PREPASS_POSITION_INDEX",
            },
            {
                type: 2,
                define: "PREPASS_VELOCITY",
                index: "PREPASS_VELOCITY_INDEX",
            },
            {
                type: 3,
                define: "PREPASS_REFLECTIVITY",
                index: "PREPASS_REFLECTIVITY_INDEX",
            },
            {
                type: 0,
                define: "PREPASS_IRRADIANCE",
                index: "PREPASS_IRRADIANCE_INDEX",
            },
            {
                type: 6,
                define: "PREPASS_ALBEDO",
                index: "PREPASS_ALBEDO_INDEX",
            },
            {
                type: 5,
                define: "PREPASS_DEPTHNORMAL",
                index: "PREPASS_DEPTHNORMAL_INDEX",
            }
        ];
        if (scene.prePassRenderer && scene.prePassRenderer.enabled && canRenderToMRT) {
            defines.PREPASS = true;
            defines.SCENE_MRT_COUNT = scene.prePassRenderer.mrtCount;
            for (var i = 0; i < texturesList.length; i++) {
                var index = scene.prePassRenderer.getIndex(texturesList[i].type);
                if (index !== -1) {
                    defines[texturesList[i].define] = true;
                    defines[texturesList[i].index] = index;
                }
                else {
                    defines[texturesList[i].define] = false;
                }
            }
        }
        else {
            defines.PREPASS = false;
            for (var i = 0; i < texturesList.length; i++) {
                defines[texturesList[i].define] = false;
            }
        }
        if (defines.PREPASS != previousPrePass) {
            defines.markAsUnprocessed();
            defines.markAsImageProcessingDirty();
        }
    };
    /**
     * Prepares the defines related to the light information passed in parameter
     * @param scene The scene we are intending to draw
     * @param mesh The mesh the effect is compiling for
     * @param light The light the effect is compiling for
     * @param lightIndex The index of the light
     * @param defines The defines to update
     * @param specularSupported Specifies whether specular is supported or not (override lights data)
     * @param state Defines the current state regarding what is needed (normals, etc...)
     */
    MaterialHelper.PrepareDefinesForLight = function (scene, mesh, light, lightIndex, defines, specularSupported, state) {
        state.needNormals = true;
        if (defines["LIGHT" + lightIndex] === undefined) {
            state.needRebuild = true;
        }
        defines["LIGHT" + lightIndex] = true;
        defines["SPOTLIGHT" + lightIndex] = false;
        defines["HEMILIGHT" + lightIndex] = false;
        defines["POINTLIGHT" + lightIndex] = false;
        defines["DIRLIGHT" + lightIndex] = false;
        light.prepareLightSpecificDefines(defines, lightIndex);
        // FallOff.
        defines["LIGHT_FALLOFF_PHYSICAL" + lightIndex] = false;
        defines["LIGHT_FALLOFF_GLTF" + lightIndex] = false;
        defines["LIGHT_FALLOFF_STANDARD" + lightIndex] = false;
        switch (light.falloffType) {
            case Light.FALLOFF_GLTF:
                defines["LIGHT_FALLOFF_GLTF" + lightIndex] = true;
                break;
            case Light.FALLOFF_PHYSICAL:
                defines["LIGHT_FALLOFF_PHYSICAL" + lightIndex] = true;
                break;
            case Light.FALLOFF_STANDARD:
                defines["LIGHT_FALLOFF_STANDARD" + lightIndex] = true;
                break;
        }
        // Specular
        if (specularSupported && !light.specular.equalsFloats(0, 0, 0)) {
            state.specularEnabled = true;
        }
        // Shadows
        defines["SHADOW" + lightIndex] = false;
        defines["SHADOWCSM" + lightIndex] = false;
        defines["SHADOWCSMDEBUG" + lightIndex] = false;
        defines["SHADOWCSMNUM_CASCADES" + lightIndex] = false;
        defines["SHADOWCSMUSESHADOWMAXZ" + lightIndex] = false;
        defines["SHADOWCSMNOBLEND" + lightIndex] = false;
        defines["SHADOWCSM_RIGHTHANDED" + lightIndex] = false;
        defines["SHADOWPCF" + lightIndex] = false;
        defines["SHADOWPCSS" + lightIndex] = false;
        defines["SHADOWPOISSON" + lightIndex] = false;
        defines["SHADOWESM" + lightIndex] = false;
        defines["SHADOWCLOSEESM" + lightIndex] = false;
        defines["SHADOWCUBE" + lightIndex] = false;
        defines["SHADOWLOWQUALITY" + lightIndex] = false;
        defines["SHADOWMEDIUMQUALITY" + lightIndex] = false;
        if (mesh && mesh.receiveShadows && scene.shadowsEnabled && light.shadowEnabled) {
            var shadowGenerator = light.getShadowGenerator();
            if (shadowGenerator) {
                var shadowMap = shadowGenerator.getShadowMap();
                if (shadowMap) {
                    if (shadowMap.renderList && shadowMap.renderList.length > 0) {
                        state.shadowEnabled = true;
                        shadowGenerator.prepareDefines(defines, lightIndex);
                    }
                }
            }
        }
        if (light.lightmapMode != Light.LIGHTMAP_DEFAULT) {
            state.lightmapMode = true;
            defines["LIGHTMAPEXCLUDED" + lightIndex] = true;
            defines["LIGHTMAPNOSPECULAR" + lightIndex] = (light.lightmapMode == Light.LIGHTMAP_SHADOWSONLY);
        }
        else {
            defines["LIGHTMAPEXCLUDED" + lightIndex] = false;
            defines["LIGHTMAPNOSPECULAR" + lightIndex] = false;
        }
    };
    /**
     * Prepares the defines related to the light information passed in parameter
     * @param scene The scene we are intending to draw
     * @param mesh The mesh the effect is compiling for
     * @param defines The defines to update
     * @param specularSupported Specifies whether specular is supported or not (override lights data)
     * @param maxSimultaneousLights Specfies how manuy lights can be added to the effect at max
     * @param disableLighting Specifies whether the lighting is disabled (override scene and light)
     * @returns true if normals will be required for the rest of the effect
     */
    MaterialHelper.PrepareDefinesForLights = function (scene, mesh, defines, specularSupported, maxSimultaneousLights, disableLighting) {
        if (maxSimultaneousLights === void 0) { maxSimultaneousLights = 4; }
        if (disableLighting === void 0) { disableLighting = false; }
        if (!defines._areLightsDirty) {
            return defines._needNormals;
        }
        var lightIndex = 0;
        var state = {
            needNormals: false,
            needRebuild: false,
            lightmapMode: false,
            shadowEnabled: false,
            specularEnabled: false
        };
        if (scene.lightsEnabled && !disableLighting) {
            for (var _i = 0, _a = mesh.lightSources; _i < _a.length; _i++) {
                var light = _a[_i];
                this.PrepareDefinesForLight(scene, mesh, light, lightIndex, defines, specularSupported, state);
                lightIndex++;
                if (lightIndex === maxSimultaneousLights) {
                    break;
                }
            }
        }
        defines["SPECULARTERM"] = state.specularEnabled;
        defines["SHADOWS"] = state.shadowEnabled;
        // Resetting all other lights if any
        for (var index = lightIndex; index < maxSimultaneousLights; index++) {
            if (defines["LIGHT" + index] !== undefined) {
                defines["LIGHT" + index] = false;
                defines["HEMILIGHT" + index] = false;
                defines["POINTLIGHT" + index] = false;
                defines["DIRLIGHT" + index] = false;
                defines["SPOTLIGHT" + index] = false;
                defines["SHADOW" + index] = false;
                defines["SHADOWCSM" + index] = false;
                defines["SHADOWCSMDEBUG" + index] = false;
                defines["SHADOWCSMNUM_CASCADES" + index] = false;
                defines["SHADOWCSMUSESHADOWMAXZ" + index] = false;
                defines["SHADOWCSMNOBLEND" + index] = false;
                defines["SHADOWCSM_RIGHTHANDED" + index] = false;
                defines["SHADOWPCF" + index] = false;
                defines["SHADOWPCSS" + index] = false;
                defines["SHADOWPOISSON" + index] = false;
                defines["SHADOWESM" + index] = false;
                defines["SHADOWCLOSEESM" + index] = false;
                defines["SHADOWCUBE" + index] = false;
                defines["SHADOWLOWQUALITY" + index] = false;
                defines["SHADOWMEDIUMQUALITY" + index] = false;
            }
        }
        var caps = scene.getEngine().getCaps();
        if (defines["SHADOWFLOAT"] === undefined) {
            state.needRebuild = true;
        }
        defines["SHADOWFLOAT"] = state.shadowEnabled &&
            ((caps.textureFloatRender && caps.textureFloatLinearFiltering) ||
                (caps.textureHalfFloatRender && caps.textureHalfFloatLinearFiltering));
        defines["LIGHTMAPEXCLUDED"] = state.lightmapMode;
        if (state.needRebuild) {
            defines.rebuild();
        }
        return state.needNormals;
    };
    /**
     * Prepares the uniforms and samplers list to be used in the effect (for a specific light)
     * @param lightIndex defines the light index
     * @param uniformsList The uniform list
     * @param samplersList The sampler list
     * @param projectedLightTexture defines if projected texture must be used
     * @param uniformBuffersList defines an optional list of uniform buffers
     * @param updateOnlyBuffersList True to only update the uniformBuffersList array
     */
    MaterialHelper.PrepareUniformsAndSamplersForLight = function (lightIndex, uniformsList, samplersList, projectedLightTexture, uniformBuffersList, updateOnlyBuffersList) {
        if (uniformBuffersList === void 0) { uniformBuffersList = null; }
        if (updateOnlyBuffersList === void 0) { updateOnlyBuffersList = false; }
        if (uniformBuffersList) {
            uniformBuffersList.push("Light" + lightIndex);
        }
        if (updateOnlyBuffersList) {
            return;
        }
        uniformsList.push("vLightData" + lightIndex, "vLightDiffuse" + lightIndex, "vLightSpecular" + lightIndex, "vLightDirection" + lightIndex, "vLightFalloff" + lightIndex, "vLightGround" + lightIndex, "lightMatrix" + lightIndex, "shadowsInfo" + lightIndex, "depthValues" + lightIndex);
        samplersList.push("shadowSampler" + lightIndex);
        samplersList.push("depthSampler" + lightIndex);
        uniformsList.push("viewFrustumZ" + lightIndex, "cascadeBlendFactor" + lightIndex, "lightSizeUVCorrection" + lightIndex, "depthCorrection" + lightIndex, "penumbraDarkness" + lightIndex, "frustumLengths" + lightIndex);
        if (projectedLightTexture) {
            samplersList.push("projectionLightSampler" + lightIndex);
            uniformsList.push("textureProjectionMatrix" + lightIndex);
        }
    };
    /**
     * Prepares the uniforms and samplers list to be used in the effect
     * @param uniformsListOrOptions The uniform names to prepare or an EffectCreationOptions containing the liist and extra information
     * @param samplersList The sampler list
     * @param defines The defines helping in the list generation
     * @param maxSimultaneousLights The maximum number of simultanous light allowed in the effect
     */
    MaterialHelper.PrepareUniformsAndSamplersList = function (uniformsListOrOptions, samplersList, defines, maxSimultaneousLights) {
        if (maxSimultaneousLights === void 0) { maxSimultaneousLights = 4; }
        var uniformsList;
        var uniformBuffersList = null;
        if (uniformsListOrOptions.uniformsNames) {
            var options = uniformsListOrOptions;
            uniformsList = options.uniformsNames;
            uniformBuffersList = options.uniformBuffersNames;
            samplersList = options.samplers;
            defines = options.defines;
            maxSimultaneousLights = options.maxSimultaneousLights || 0;
        }
        else {
            uniformsList = uniformsListOrOptions;
            if (!samplersList) {
                samplersList = [];
            }
        }
        for (var lightIndex = 0; lightIndex < maxSimultaneousLights; lightIndex++) {
            if (!defines["LIGHT" + lightIndex]) {
                break;
            }
            this.PrepareUniformsAndSamplersForLight(lightIndex, uniformsList, samplersList, defines["PROJECTEDLIGHTTEXTURE" + lightIndex], uniformBuffersList);
        }
        if (defines["NUM_MORPH_INFLUENCERS"]) {
            uniformsList.push("morphTargetInfluences");
        }
    };
    /**
     * This helps decreasing rank by rank the shadow quality (0 being the highest rank and quality)
     * @param defines The defines to update while falling back
     * @param fallbacks The authorized effect fallbacks
     * @param maxSimultaneousLights The maximum number of lights allowed
     * @param rank the current rank of the Effect
     * @returns The newly affected rank
     */
    MaterialHelper.HandleFallbacksForShadows = function (defines, fallbacks, maxSimultaneousLights, rank) {
        if (maxSimultaneousLights === void 0) { maxSimultaneousLights = 4; }
        if (rank === void 0) { rank = 0; }
        var lightFallbackRank = 0;
        for (var lightIndex = 0; lightIndex < maxSimultaneousLights; lightIndex++) {
            if (!defines["LIGHT" + lightIndex]) {
                break;
            }
            if (lightIndex > 0) {
                lightFallbackRank = rank + lightIndex;
                fallbacks.addFallback(lightFallbackRank, "LIGHT" + lightIndex);
            }
            if (!defines["SHADOWS"]) {
                if (defines["SHADOW" + lightIndex]) {
                    fallbacks.addFallback(rank, "SHADOW" + lightIndex);
                }
                if (defines["SHADOWPCF" + lightIndex]) {
                    fallbacks.addFallback(rank, "SHADOWPCF" + lightIndex);
                }
                if (defines["SHADOWPCSS" + lightIndex]) {
                    fallbacks.addFallback(rank, "SHADOWPCSS" + lightIndex);
                }
                if (defines["SHADOWPOISSON" + lightIndex]) {
                    fallbacks.addFallback(rank, "SHADOWPOISSON" + lightIndex);
                }
                if (defines["SHADOWESM" + lightIndex]) {
                    fallbacks.addFallback(rank, "SHADOWESM" + lightIndex);
                }
                if (defines["SHADOWCLOSEESM" + lightIndex]) {
                    fallbacks.addFallback(rank, "SHADOWCLOSEESM" + lightIndex);
                }
            }
        }
        return lightFallbackRank++;
    };
    /**
     * Prepares the list of attributes required for morph targets according to the effect defines.
     * @param attribs The current list of supported attribs
     * @param mesh The mesh to prepare the morph targets attributes for
     * @param influencers The number of influencers
     */
    MaterialHelper.PrepareAttributesForMorphTargetsInfluencers = function (attribs, mesh, influencers) {
        this._TmpMorphInfluencers.NUM_MORPH_INFLUENCERS = influencers;
        this.PrepareAttributesForMorphTargets(attribs, mesh, this._TmpMorphInfluencers);
    };
    /**
     * Prepares the list of attributes required for morph targets according to the effect defines.
     * @param attribs The current list of supported attribs
     * @param mesh The mesh to prepare the morph targets attributes for
     * @param defines The current Defines of the effect
     */
    MaterialHelper.PrepareAttributesForMorphTargets = function (attribs, mesh, defines) {
        var influencers = defines["NUM_MORPH_INFLUENCERS"];
        if (influencers > 0 && EngineStore.LastCreatedEngine) {
            var maxAttributesCount = EngineStore.LastCreatedEngine.getCaps().maxVertexAttribs;
            var manager = mesh.morphTargetManager;
            var normal = manager && manager.supportsNormals && defines["NORMAL"];
            var tangent = manager && manager.supportsTangents && defines["TANGENT"];
            var uv = manager && manager.supportsUVs && defines["UV1"];
            for (var index = 0; index < influencers; index++) {
                attribs.push(VertexBuffer.PositionKind + index);
                if (normal) {
                    attribs.push(VertexBuffer.NormalKind + index);
                }
                if (tangent) {
                    attribs.push(VertexBuffer.TangentKind + index);
                }
                if (uv) {
                    attribs.push(VertexBuffer.UVKind + "_" + index);
                }
                if (attribs.length > maxAttributesCount) {
                    Logger.Error("Cannot add more vertex attributes for mesh " + mesh.name);
                }
            }
        }
    };
    /**
     * Prepares the list of attributes required for bones according to the effect defines.
     * @param attribs The current list of supported attribs
     * @param mesh The mesh to prepare the bones attributes for
     * @param defines The current Defines of the effect
     * @param fallbacks The current efffect fallback strategy
     */
    MaterialHelper.PrepareAttributesForBones = function (attribs, mesh, defines, fallbacks) {
        if (defines["NUM_BONE_INFLUENCERS"] > 0) {
            fallbacks.addCPUSkinningFallback(0, mesh);
            attribs.push(VertexBuffer.MatricesIndicesKind);
            attribs.push(VertexBuffer.MatricesWeightsKind);
            if (defines["NUM_BONE_INFLUENCERS"] > 4) {
                attribs.push(VertexBuffer.MatricesIndicesExtraKind);
                attribs.push(VertexBuffer.MatricesWeightsExtraKind);
            }
        }
    };
    /**
     * Check and prepare the list of attributes required for instances according to the effect defines.
     * @param attribs The current list of supported attribs
     * @param defines The current MaterialDefines of the effect
     */
    MaterialHelper.PrepareAttributesForInstances = function (attribs, defines) {
        if (defines["INSTANCES"] || defines["THIN_INSTANCES"]) {
            this.PushAttributesForInstances(attribs);
        }
    };
    /**
     * Add the list of attributes required for instances to the attribs array.
     * @param attribs The current list of supported attribs
     */
    MaterialHelper.PushAttributesForInstances = function (attribs) {
        attribs.push("world0");
        attribs.push("world1");
        attribs.push("world2");
        attribs.push("world3");
    };
    /**
     * Binds the light information to the effect.
     * @param light The light containing the generator
     * @param effect The effect we are binding the data to
     * @param lightIndex The light index in the effect used to render
     */
    MaterialHelper.BindLightProperties = function (light, effect, lightIndex) {
        light.transferToEffect(effect, lightIndex + "");
    };
    /**
     * Binds the lights information from the scene to the effect for the given mesh.
     * @param light Light to bind
     * @param lightIndex Light index
     * @param scene The scene where the light belongs to
     * @param effect The effect we are binding the data to
     * @param useSpecular Defines if specular is supported
     * @param rebuildInParallel Specifies whether the shader is rebuilding in parallel
     */
    MaterialHelper.BindLight = function (light, lightIndex, scene, effect, useSpecular, rebuildInParallel) {
        if (rebuildInParallel === void 0) { rebuildInParallel = false; }
        light._bindLight(lightIndex, scene, effect, useSpecular, rebuildInParallel);
    };
    /**
     * Binds the lights information from the scene to the effect for the given mesh.
     * @param scene The scene the lights belongs to
     * @param mesh The mesh we are binding the information to render
     * @param effect The effect we are binding the data to
     * @param defines The generated defines for the effect
     * @param maxSimultaneousLights The maximum number of light that can be bound to the effect
     * @param rebuildInParallel Specifies whether the shader is rebuilding in parallel
     */
    MaterialHelper.BindLights = function (scene, mesh, effect, defines, maxSimultaneousLights, rebuildInParallel) {
        if (maxSimultaneousLights === void 0) { maxSimultaneousLights = 4; }
        if (rebuildInParallel === void 0) { rebuildInParallel = false; }
        var len = Math.min(mesh.lightSources.length, maxSimultaneousLights);
        for (var i = 0; i < len; i++) {
            var light = mesh.lightSources[i];
            this.BindLight(light, i, scene, effect, typeof defines === "boolean" ? defines : defines["SPECULARTERM"], rebuildInParallel);
        }
    };
    /**
     * Binds the fog information from the scene to the effect for the given mesh.
     * @param scene The scene the lights belongs to
     * @param mesh The mesh we are binding the information to render
     * @param effect The effect we are binding the data to
     * @param linearSpace Defines if the fog effect is applied in linear space
     */
    MaterialHelper.BindFogParameters = function (scene, mesh, effect, linearSpace) {
        if (linearSpace === void 0) { linearSpace = false; }
        if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== Scene.FOGMODE_NONE) {
            effect.setFloat4("vFogInfos", scene.fogMode, scene.fogStart, scene.fogEnd, scene.fogDensity);
            // Convert fog color to linear space if used in a linear space computed shader.
            if (linearSpace) {
                scene.fogColor.toLinearSpaceToRef(this._tempFogColor);
                effect.setColor3("vFogColor", this._tempFogColor);
            }
            else {
                effect.setColor3("vFogColor", scene.fogColor);
            }
        }
    };
    /**
     * Binds the bones information from the mesh to the effect.
     * @param mesh The mesh we are binding the information to render
     * @param effect The effect we are binding the data to
     * @param prePassConfiguration Configuration for the prepass, in case prepass is activated
     */
    MaterialHelper.BindBonesParameters = function (mesh, effect, prePassConfiguration) {
        if (!effect || !mesh) {
            return;
        }
        if (mesh.computeBonesUsingShaders && effect._bonesComputationForcedToCPU) {
            mesh.computeBonesUsingShaders = false;
        }
        if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
            var skeleton = mesh.skeleton;
            if (skeleton.isUsingTextureForMatrices && effect.getUniformIndex("boneTextureWidth") > -1) {
                var boneTexture = skeleton.getTransformMatrixTexture(mesh);
                effect.setTexture("boneSampler", boneTexture);
                effect.setFloat("boneTextureWidth", 4.0 * (skeleton.bones.length + 1));
            }
            else {
                var matrices = skeleton.getTransformMatrices(mesh);
                if (matrices) {
                    effect.setMatrices("mBones", matrices);
                    if (prePassConfiguration && mesh.getScene().prePassRenderer && mesh.getScene().prePassRenderer.getIndex(2)) {
                        if (prePassConfiguration.previousBones[mesh.uniqueId]) {
                            effect.setMatrices("mPreviousBones", prePassConfiguration.previousBones[mesh.uniqueId]);
                        }
                        MaterialHelper._CopyBonesTransformationMatrices(matrices, prePassConfiguration.previousBones[mesh.uniqueId]);
                    }
                }
            }
        }
    };
    // Copies the bones transformation matrices into the target array and returns the target's reference
    MaterialHelper._CopyBonesTransformationMatrices = function (source, target) {
        target.set(source);
        return target;
    };
    /**
     * Binds the morph targets information from the mesh to the effect.
     * @param abstractMesh The mesh we are binding the information to render
     * @param effect The effect we are binding the data to
     */
    MaterialHelper.BindMorphTargetParameters = function (abstractMesh, effect) {
        var manager = abstractMesh.morphTargetManager;
        if (!abstractMesh || !manager) {
            return;
        }
        effect.setFloatArray("morphTargetInfluences", manager.influences);
    };
    /**
     * Binds the logarithmic depth information from the scene to the effect for the given defines.
     * @param defines The generated defines used in the effect
     * @param effect The effect we are binding the data to
     * @param scene The scene we are willing to render with logarithmic scale for
     */
    MaterialHelper.BindLogDepth = function (defines, effect, scene) {
        if (defines["LOGARITHMICDEPTH"]) {
            effect.setFloat("logarithmicDepthConstant", 2.0 / (Math.log(scene.activeCamera.maxZ + 1.0) / Math.LN2));
        }
    };
    /**
     * Binds the clip plane information from the scene to the effect.
     * @param scene The scene the clip plane information are extracted from
     * @param effect The effect we are binding the data to
     */
    MaterialHelper.BindClipPlane = function (effect, scene) {
        ThinMaterialHelper.BindClipPlane(effect, scene);
    };
    MaterialHelper._TmpMorphInfluencers = { "NUM_MORPH_INFLUENCERS": 0 };
    MaterialHelper._tempFogColor = Color3.Black();
    return MaterialHelper;
}());

/**
 * EffectFallbacks can be used to add fallbacks (properties to disable) to certain properties when desired to improve performance.
 * (Eg. Start at high quality with reflection and fog, if fps is low, remove reflection, if still low remove fog)
 */
var EffectFallbacks = /** @class */ (function () {
    function EffectFallbacks() {
        this._defines = {};
        this._currentRank = 32;
        this._maxRank = -1;
        this._mesh = null;
    }
    /**
     * Removes the fallback from the bound mesh.
     */
    EffectFallbacks.prototype.unBindMesh = function () {
        this._mesh = null;
    };
    /**
     * Adds a fallback on the specified property.
     * @param rank The rank of the fallback (Lower ranks will be fallbacked to first)
     * @param define The name of the define in the shader
     */
    EffectFallbacks.prototype.addFallback = function (rank, define) {
        if (!this._defines[rank]) {
            if (rank < this._currentRank) {
                this._currentRank = rank;
            }
            if (rank > this._maxRank) {
                this._maxRank = rank;
            }
            this._defines[rank] = new Array();
        }
        this._defines[rank].push(define);
    };
    /**
     * Sets the mesh to use CPU skinning when needing to fallback.
     * @param rank The rank of the fallback (Lower ranks will be fallbacked to first)
     * @param mesh The mesh to use the fallbacks.
     */
    EffectFallbacks.prototype.addCPUSkinningFallback = function (rank, mesh) {
        this._mesh = mesh;
        if (rank < this._currentRank) {
            this._currentRank = rank;
        }
        if (rank > this._maxRank) {
            this._maxRank = rank;
        }
    };
    Object.defineProperty(EffectFallbacks.prototype, "hasMoreFallbacks", {
        /**
         * Checks to see if more fallbacks are still availible.
         */
        get: function () {
            return this._currentRank <= this._maxRank;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Removes the defines that should be removed when falling back.
     * @param currentDefines defines the current define statements for the shader.
     * @param effect defines the current effect we try to compile
     * @returns The resulting defines with defines of the current rank removed.
     */
    EffectFallbacks.prototype.reduce = function (currentDefines, effect) {
        // First we try to switch to CPU skinning
        if (this._mesh && this._mesh.computeBonesUsingShaders && this._mesh.numBoneInfluencers > 0) {
            this._mesh.computeBonesUsingShaders = false;
            currentDefines = currentDefines.replace("#define NUM_BONE_INFLUENCERS " + this._mesh.numBoneInfluencers, "#define NUM_BONE_INFLUENCERS 0");
            effect._bonesComputationForcedToCPU = true;
            var scene = this._mesh.getScene();
            for (var index = 0; index < scene.meshes.length; index++) {
                var otherMesh = scene.meshes[index];
                if (!otherMesh.material) {
                    if (!this._mesh.material && otherMesh.computeBonesUsingShaders && otherMesh.numBoneInfluencers > 0) {
                        otherMesh.computeBonesUsingShaders = false;
                    }
                    continue;
                }
                if (!otherMesh.computeBonesUsingShaders || otherMesh.numBoneInfluencers === 0) {
                    continue;
                }
                if (otherMesh.material.getEffect() === effect) {
                    otherMesh.computeBonesUsingShaders = false;
                }
                else if (otherMesh.subMeshes) {
                    for (var _i = 0, _a = otherMesh.subMeshes; _i < _a.length; _i++) {
                        var subMesh = _a[_i];
                        var subMeshEffect = subMesh.effect;
                        if (subMeshEffect === effect) {
                            otherMesh.computeBonesUsingShaders = false;
                            break;
                        }
                    }
                }
            }
        }
        else {
            var currentFallbacks = this._defines[this._currentRank];
            if (currentFallbacks) {
                for (var index = 0; index < currentFallbacks.length; index++) {
                    currentDefines = currentDefines.replace("#define " + currentFallbacks[index], "");
                }
            }
            this._currentRank++;
        }
        return currentDefines;
    };
    return EffectFallbacks;
}());

var name = 'bonesDeclaration';
var shader = "#if NUM_BONE_INFLUENCERS>0\n#ifdef BONETEXTURE\nuniform sampler2D boneSampler;\nuniform float boneTextureWidth;\n#else\nuniform mat4 mBones[BonesPerMesh];\n#ifdef BONES_VELOCITY_ENABLED\nuniform mat4 mPreviousBones[BonesPerMesh];\n#endif\n#endif\nattribute vec4 matricesIndices;\nattribute vec4 matricesWeights;\n#if NUM_BONE_INFLUENCERS>4\nattribute vec4 matricesIndicesExtra;\nattribute vec4 matricesWeightsExtra;\n#endif\n#ifdef BONETEXTURE\n#define inline\nmat4 readMatrixFromRawSampler(sampler2D smp,float index)\n{\nfloat offset=index*4.0;\nfloat dx=1.0/boneTextureWidth;\nvec4 m0=texture2D(smp,vec2(dx*(offset+0.5),0.));\nvec4 m1=texture2D(smp,vec2(dx*(offset+1.5),0.));\nvec4 m2=texture2D(smp,vec2(dx*(offset+2.5),0.));\nvec4 m3=texture2D(smp,vec2(dx*(offset+3.5),0.));\nreturn mat4(m0,m1,m2,m3);\n}\n#endif\n#endif";
Effect.IncludesShadersStore[name] = shader;

var name$1 = 'instancesDeclaration';
var shader$1 = "#ifdef INSTANCES\nattribute vec4 world0;\nattribute vec4 world1;\nattribute vec4 world2;\nattribute vec4 world3;\n#ifdef THIN_INSTANCES\nuniform mat4 world;\n#endif\n#else\nuniform mat4 world;\n#endif";
Effect.IncludesShadersStore[name$1] = shader$1;

var name$2 = 'instancesVertex';
var shader$2 = "#ifdef INSTANCES\nmat4 finalWorld=mat4(world0,world1,world2,world3);\n#ifdef THIN_INSTANCES\nfinalWorld=world*finalWorld;\n#endif\n#else\nmat4 finalWorld=world;\n#endif";
Effect.IncludesShadersStore[name$2] = shader$2;

var name$3 = 'bonesVertex';
var shader$3 = "#if NUM_BONE_INFLUENCERS>0\nmat4 influence;\n#ifdef BONETEXTURE\ninfluence=readMatrixFromRawSampler(boneSampler,matricesIndices[0])*matricesWeights[0];\n#if NUM_BONE_INFLUENCERS>1\ninfluence+=readMatrixFromRawSampler(boneSampler,matricesIndices[1])*matricesWeights[1];\n#endif\n#if NUM_BONE_INFLUENCERS>2\ninfluence+=readMatrixFromRawSampler(boneSampler,matricesIndices[2])*matricesWeights[2];\n#endif\n#if NUM_BONE_INFLUENCERS>3\ninfluence+=readMatrixFromRawSampler(boneSampler,matricesIndices[3])*matricesWeights[3];\n#endif\n#if NUM_BONE_INFLUENCERS>4\ninfluence+=readMatrixFromRawSampler(boneSampler,matricesIndicesExtra[0])*matricesWeightsExtra[0];\n#endif\n#if NUM_BONE_INFLUENCERS>5\ninfluence+=readMatrixFromRawSampler(boneSampler,matricesIndicesExtra[1])*matricesWeightsExtra[1];\n#endif\n#if NUM_BONE_INFLUENCERS>6\ninfluence+=readMatrixFromRawSampler(boneSampler,matricesIndicesExtra[2])*matricesWeightsExtra[2];\n#endif\n#if NUM_BONE_INFLUENCERS>7\ninfluence+=readMatrixFromRawSampler(boneSampler,matricesIndicesExtra[3])*matricesWeightsExtra[3];\n#endif\n#else\ninfluence=mBones[int(matricesIndices[0])]*matricesWeights[0];\n#if NUM_BONE_INFLUENCERS>1\ninfluence+=mBones[int(matricesIndices[1])]*matricesWeights[1];\n#endif\n#if NUM_BONE_INFLUENCERS>2\ninfluence+=mBones[int(matricesIndices[2])]*matricesWeights[2];\n#endif\n#if NUM_BONE_INFLUENCERS>3\ninfluence+=mBones[int(matricesIndices[3])]*matricesWeights[3];\n#endif\n#if NUM_BONE_INFLUENCERS>4\ninfluence+=mBones[int(matricesIndicesExtra[0])]*matricesWeightsExtra[0];\n#endif\n#if NUM_BONE_INFLUENCERS>5\ninfluence+=mBones[int(matricesIndicesExtra[1])]*matricesWeightsExtra[1];\n#endif\n#if NUM_BONE_INFLUENCERS>6\ninfluence+=mBones[int(matricesIndicesExtra[2])]*matricesWeightsExtra[2];\n#endif\n#if NUM_BONE_INFLUENCERS>7\ninfluence+=mBones[int(matricesIndicesExtra[3])]*matricesWeightsExtra[3];\n#endif\n#endif\nfinalWorld=finalWorld*influence;\n#endif";
Effect.IncludesShadersStore[name$3] = shader$3;

export { EffectFallbacks as E, MaterialHelper as M, ThinMaterialHelper as T };
