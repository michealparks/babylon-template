import { _ as __extends, d as __assign } from './thinEngine-e576a091.js';
import { S as SerializationHelper } from './node-87d9c658.js';
import { b as Color3, C as Color4, a as Vector2, V as Vector3, d as Vector4, M as Matrix, _ as _TypeStore } from './math.color-fc6e801e.js';
import { E as Engine } from './engine-9a1b5aa7.js';
import { W as WebRequest } from './guid-495ff9c7.js';
import { V as VertexBuffer, M as Material } from './sceneComponent-5502b64a.js';
import { T as Texture } from './texture-6b1db4fe.js';
import { M as MaterialHelper, E as EffectFallbacks } from './bonesVertex-5b94878d.js';

var onCreatedEffectParameters = { effect: null, subMesh: null };
/**
 * The ShaderMaterial object has the necessary methods to pass data from your scene to the Vertex and Fragment Shaders and returns a material that can be applied to any mesh.
 *
 * This returned material effects how the mesh will look based on the code in the shaders.
 *
 * @see https://doc.babylonjs.com/how_to/shader_material
 */
var ShaderMaterial = /** @class */ (function (_super) {
    __extends(ShaderMaterial, _super);
    /**
     * Instantiate a new shader material.
     * The ShaderMaterial object has the necessary methods to pass data from your scene to the Vertex and Fragment Shaders and returns a material that can be applied to any mesh.
     * This returned material effects how the mesh will look based on the code in the shaders.
     * @see https://doc.babylonjs.com/how_to/shader_material
     * @param name Define the name of the material in the scene
     * @param scene Define the scene the material belongs to
     * @param shaderPath Defines  the route to the shader code in one of three ways:
     *  * object: { vertex: "custom", fragment: "custom" }, used with Effect.ShadersStore["customVertexShader"] and Effect.ShadersStore["customFragmentShader"]
     *  * object: { vertexElement: "vertexShaderCode", fragmentElement: "fragmentShaderCode" }, used with shader code in script tags
     *  * object: { vertexSource: "vertex shader code string", fragmentSource: "fragment shader code string" } using with strings containing the shaders code
     *  * string: "./COMMON_NAME", used with external files COMMON_NAME.vertex.fx and COMMON_NAME.fragment.fx in index.html folder.
     * @param options Define the options used to create the shader
     */
    function ShaderMaterial(name, scene, shaderPath, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, name, scene) || this;
        _this._textures = {};
        _this._textureArrays = {};
        _this._floats = {};
        _this._ints = {};
        _this._floatsArrays = {};
        _this._colors3 = {};
        _this._colors3Arrays = {};
        _this._colors4 = {};
        _this._colors4Arrays = {};
        _this._vectors2 = {};
        _this._vectors3 = {};
        _this._vectors4 = {};
        _this._matrices = {};
        _this._matrixArrays = {};
        _this._matrices3x3 = {};
        _this._matrices2x2 = {};
        _this._vectors2Arrays = {};
        _this._vectors3Arrays = {};
        _this._vectors4Arrays = {};
        _this._cachedWorldViewMatrix = new Matrix();
        _this._cachedWorldViewProjectionMatrix = new Matrix();
        _this._multiview = false;
        _this._shaderPath = shaderPath;
        _this._options = __assign({ needAlphaBlending: false, needAlphaTesting: false, attributes: ["position", "normal", "uv"], uniforms: ["worldViewProjection"], uniformBuffers: [], samplers: [], defines: [] }, options);
        return _this;
    }
    Object.defineProperty(ShaderMaterial.prototype, "shaderPath", {
        /**
         * Gets the shader path used to define the shader code
         * It can be modified to trigger a new compilation
         */
        get: function () {
            return this._shaderPath;
        },
        /**
         * Sets the shader path used to define the shader code
         * It can be modified to trigger a new compilation
         */
        set: function (shaderPath) {
            this._shaderPath = shaderPath;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShaderMaterial.prototype, "options", {
        /**
         * Gets the options used to compile the shader.
         * They can be modified to trigger a new compilation
         */
        get: function () {
            return this._options;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the current class name of the material e.g. "ShaderMaterial"
     * Mainly use in serialization.
     * @returns the class name
     */
    ShaderMaterial.prototype.getClassName = function () {
        return "ShaderMaterial";
    };
    /**
     * Specifies if the material will require alpha blending
     * @returns a boolean specifying if alpha blending is needed
     */
    ShaderMaterial.prototype.needAlphaBlending = function () {
        return (this.alpha < 1.0) || this._options.needAlphaBlending;
    };
    /**
     * Specifies if this material should be rendered in alpha test mode
     * @returns a boolean specifying if an alpha test is needed.
     */
    ShaderMaterial.prototype.needAlphaTesting = function () {
        return this._options.needAlphaTesting;
    };
    ShaderMaterial.prototype._checkUniform = function (uniformName) {
        if (this._options.uniforms.indexOf(uniformName) === -1) {
            this._options.uniforms.push(uniformName);
        }
    };
    /**
     * Set a texture in the shader.
     * @param name Define the name of the uniform samplers as defined in the shader
     * @param texture Define the texture to bind to this sampler
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setTexture = function (name, texture) {
        if (this._options.samplers.indexOf(name) === -1) {
            this._options.samplers.push(name);
        }
        this._textures[name] = texture;
        return this;
    };
    /**
     * Set a texture array in the shader.
     * @param name Define the name of the uniform sampler array as defined in the shader
     * @param textures Define the list of textures to bind to this sampler
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setTextureArray = function (name, textures) {
        if (this._options.samplers.indexOf(name) === -1) {
            this._options.samplers.push(name);
        }
        this._checkUniform(name);
        this._textureArrays[name] = textures;
        return this;
    };
    /**
     * Set a float in the shader.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setFloat = function (name, value) {
        this._checkUniform(name);
        this._floats[name] = value;
        return this;
    };
    /**
     * Set a int in the shader.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setInt = function (name, value) {
        this._checkUniform(name);
        this._ints[name] = value;
        return this;
    };
    /**
     * Set an array of floats in the shader.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setFloats = function (name, value) {
        this._checkUniform(name);
        this._floatsArrays[name] = value;
        return this;
    };
    /**
     * Set a vec3 in the shader from a Color3.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setColor3 = function (name, value) {
        this._checkUniform(name);
        this._colors3[name] = value;
        return this;
    };
    /**
     * Set a vec3 array in the shader from a Color3 array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setColor3Array = function (name, value) {
        this._checkUniform(name);
        this._colors3Arrays[name] = value.reduce(function (arr, color) {
            color.toArray(arr, arr.length);
            return arr;
        }, []);
        return this;
    };
    /**
     * Set a vec4 in the shader from a Color4.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setColor4 = function (name, value) {
        this._checkUniform(name);
        this._colors4[name] = value;
        return this;
    };
    /**
     * Set a vec4 array in the shader from a Color4 array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setColor4Array = function (name, value) {
        this._checkUniform(name);
        this._colors4Arrays[name] = value.reduce(function (arr, color) {
            color.toArray(arr, arr.length);
            return arr;
        }, []);
        return this;
    };
    /**
     * Set a vec2 in the shader from a Vector2.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setVector2 = function (name, value) {
        this._checkUniform(name);
        this._vectors2[name] = value;
        return this;
    };
    /**
     * Set a vec3 in the shader from a Vector3.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setVector3 = function (name, value) {
        this._checkUniform(name);
        this._vectors3[name] = value;
        return this;
    };
    /**
     * Set a vec4 in the shader from a Vector4.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setVector4 = function (name, value) {
        this._checkUniform(name);
        this._vectors4[name] = value;
        return this;
    };
    /**
     * Set a mat4 in the shader from a Matrix.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setMatrix = function (name, value) {
        this._checkUniform(name);
        this._matrices[name] = value;
        return this;
    };
    /**
     * Set a float32Array in the shader from a matrix array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setMatrices = function (name, value) {
        this._checkUniform(name);
        var float32Array = new Float32Array(value.length * 16);
        for (var index = 0; index < value.length; index++) {
            var matrix = value[index];
            matrix.copyToArray(float32Array, index * 16);
        }
        this._matrixArrays[name] = float32Array;
        return this;
    };
    /**
     * Set a mat3 in the shader from a Float32Array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setMatrix3x3 = function (name, value) {
        this._checkUniform(name);
        this._matrices3x3[name] = value;
        return this;
    };
    /**
     * Set a mat2 in the shader from a Float32Array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setMatrix2x2 = function (name, value) {
        this._checkUniform(name);
        this._matrices2x2[name] = value;
        return this;
    };
    /**
     * Set a vec2 array in the shader from a number array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setArray2 = function (name, value) {
        this._checkUniform(name);
        this._vectors2Arrays[name] = value;
        return this;
    };
    /**
     * Set a vec3 array in the shader from a number array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setArray3 = function (name, value) {
        this._checkUniform(name);
        this._vectors3Arrays[name] = value;
        return this;
    };
    /**
     * Set a vec4 array in the shader from a number array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @return the material itself allowing "fluent" like uniform updates
     */
    ShaderMaterial.prototype.setArray4 = function (name, value) {
        this._checkUniform(name);
        this._vectors4Arrays[name] = value;
        return this;
    };
    ShaderMaterial.prototype._checkCache = function (mesh, useInstances) {
        if (!mesh) {
            return true;
        }
        if (this._effect && (this._effect.defines.indexOf("#define INSTANCES") !== -1) !== useInstances) {
            return false;
        }
        return true;
    };
    /**
     * Specifies that the submesh is ready to be used
     * @param mesh defines the mesh to check
     * @param subMesh defines which submesh to check
     * @param useInstances specifies that instances should be used
     * @returns a boolean indicating that the submesh is ready or not
     */
    ShaderMaterial.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
        return this.isReady(mesh, useInstances);
    };
    /**
     * Checks if the material is ready to render the requested mesh
     * @param mesh Define the mesh to render
     * @param useInstances Define whether or not the material is used with instances
     * @returns true if ready, otherwise false
     */
    ShaderMaterial.prototype.isReady = function (mesh, useInstances) {
        var _a, _b;
        if (this._effect && this.isFrozen) {
            if (this._effect._wasPreviouslyReady) {
                return true;
            }
        }
        var scene = this.getScene();
        var engine = scene.getEngine();
        if (!this.checkReadyOnEveryCall) {
            if (this._renderId === scene.getRenderId()) {
                if (this._checkCache(mesh, useInstances)) {
                    return true;
                }
            }
        }
        // Instances
        var defines = [];
        var attribs = [];
        var fallbacks = new EffectFallbacks();
        // global multiview
        if (engine.getCaps().multiview &&
            scene.activeCamera &&
            scene.activeCamera.outputRenderTarget &&
            scene.activeCamera.outputRenderTarget.getViewCount() > 1) {
            this._multiview = true;
            defines.push("#define MULTIVIEW");
            if (this._options.uniforms.indexOf("viewProjection") !== -1 &&
                this._options.uniforms.push("viewProjectionR") === -1) {
                this._options.uniforms.push("viewProjectionR");
            }
        }
        for (var index = 0; index < this._options.defines.length; index++) {
            defines.push(this._options.defines[index]);
        }
        for (var index = 0; index < this._options.attributes.length; index++) {
            attribs.push(this._options.attributes[index]);
        }
        if (mesh && mesh.isVerticesDataPresent(VertexBuffer.ColorKind)) {
            attribs.push(VertexBuffer.ColorKind);
            defines.push("#define VERTEXCOLOR");
        }
        if (useInstances) {
            defines.push("#define INSTANCES");
            MaterialHelper.PushAttributesForInstances(attribs);
            if (mesh === null || mesh === void 0 ? void 0 : mesh.hasThinInstances) {
                defines.push("#define THIN_INSTANCES");
            }
        }
        // Bones
        var numInfluencers = 0;
        if (mesh && mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
            attribs.push(VertexBuffer.MatricesIndicesKind);
            attribs.push(VertexBuffer.MatricesWeightsKind);
            if (mesh.numBoneInfluencers > 4) {
                attribs.push(VertexBuffer.MatricesIndicesExtraKind);
                attribs.push(VertexBuffer.MatricesWeightsExtraKind);
            }
            var skeleton = mesh.skeleton;
            numInfluencers = mesh.numBoneInfluencers;
            defines.push("#define NUM_BONE_INFLUENCERS " + numInfluencers);
            fallbacks.addCPUSkinningFallback(0, mesh);
            if (skeleton.isUsingTextureForMatrices) {
                defines.push("#define BONETEXTURE");
                if (this._options.uniforms.indexOf("boneTextureWidth") === -1) {
                    this._options.uniforms.push("boneTextureWidth");
                }
                if (this._options.samplers.indexOf("boneSampler") === -1) {
                    this._options.samplers.push("boneSampler");
                }
            }
            else {
                defines.push("#define BonesPerMesh " + (skeleton.bones.length + 1));
                if (this._options.uniforms.indexOf("mBones") === -1) {
                    this._options.uniforms.push("mBones");
                }
            }
        }
        else {
            defines.push("#define NUM_BONE_INFLUENCERS 0");
        }
        // Textures
        for (var name in this._textures) {
            if (!this._textures[name].isReady()) {
                return false;
            }
        }
        // Alpha test
        if (mesh && this._shouldTurnAlphaTestOn(mesh)) {
            defines.push("#define ALPHATEST");
        }
        var shaderName = this._shaderPath, uniforms = this._options.uniforms, uniformBuffers = this._options.uniformBuffers, samplers = this._options.samplers;
        if (this.customShaderNameResolve) {
            uniforms = uniforms.slice();
            uniformBuffers = uniformBuffers.slice();
            samplers = samplers.slice();
            shaderName = this.customShaderNameResolve(shaderName, uniforms, uniformBuffers, samplers, defines, attribs);
        }
        var previousEffect = this._effect;
        var join = defines.join("\n");
        if (this._cachedDefines !== join) {
            this._cachedDefines = join;
            this._effect = engine.createEffect(shaderName, {
                attributes: attribs,
                uniformsNames: uniforms,
                uniformBuffersNames: uniformBuffers,
                samplers: samplers,
                defines: join,
                fallbacks: fallbacks,
                onCompiled: this.onCompiled,
                onError: this.onError,
                indexParameters: { maxSimultaneousMorphTargets: numInfluencers }
            }, engine);
            if (this._onEffectCreatedObservable) {
                onCreatedEffectParameters.effect = this._effect;
                this._onEffectCreatedObservable.notifyObservers(onCreatedEffectParameters);
            }
        }
        if ((_b = !((_a = this._effect) === null || _a === void 0 ? void 0 : _a.isReady())) !== null && _b !== void 0 ? _b : true) {
            return false;
        }
        if (previousEffect !== this._effect) {
            scene.resetCachedMaterial();
        }
        this._renderId = scene.getRenderId();
        this._effect._wasPreviouslyReady = true;
        return true;
    };
    /**
     * Binds the world matrix to the material
     * @param world defines the world transformation matrix
     * @param effectOverride - If provided, use this effect instead of internal effect
     */
    ShaderMaterial.prototype.bindOnlyWorldMatrix = function (world, effectOverride) {
        var scene = this.getScene();
        var effect = effectOverride !== null && effectOverride !== void 0 ? effectOverride : this._effect;
        if (!effect) {
            return;
        }
        if (this._options.uniforms.indexOf("world") !== -1) {
            effect.setMatrix("world", world);
        }
        if (this._options.uniforms.indexOf("worldView") !== -1) {
            world.multiplyToRef(scene.getViewMatrix(), this._cachedWorldViewMatrix);
            effect.setMatrix("worldView", this._cachedWorldViewMatrix);
        }
        if (this._options.uniforms.indexOf("worldViewProjection") !== -1) {
            world.multiplyToRef(scene.getTransformMatrix(), this._cachedWorldViewProjectionMatrix);
            effect.setMatrix("worldViewProjection", this._cachedWorldViewProjectionMatrix);
        }
    };
    /**
     * Binds the submesh to this material by preparing the effect and shader to draw
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh containing the submesh
     * @param subMesh defines the submesh to bind the material to
     */
    ShaderMaterial.prototype.bindForSubMesh = function (world, mesh, subMesh) {
        this.bind(world, mesh, subMesh._effectOverride);
    };
    /**
     * Binds the material to the mesh
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh to bind the material to
     * @param effectOverride - If provided, use this effect instead of internal effect
     */
    ShaderMaterial.prototype.bind = function (world, mesh, effectOverride) {
        // Std values
        this.bindOnlyWorldMatrix(world, effectOverride);
        var effect = effectOverride !== null && effectOverride !== void 0 ? effectOverride : this._effect;
        if (effect && this.getScene().getCachedMaterial() !== this) {
            if (this._options.uniforms.indexOf("view") !== -1) {
                effect.setMatrix("view", this.getScene().getViewMatrix());
            }
            if (this._options.uniforms.indexOf("projection") !== -1) {
                effect.setMatrix("projection", this.getScene().getProjectionMatrix());
            }
            if (this._options.uniforms.indexOf("viewProjection") !== -1) {
                effect.setMatrix("viewProjection", this.getScene().getTransformMatrix());
                if (this._multiview) {
                    effect.setMatrix("viewProjectionR", this.getScene()._transformMatrixR);
                }
            }
            if (this.getScene().activeCamera && this._options.uniforms.indexOf("cameraPosition") !== -1) {
                effect.setVector3("cameraPosition", this.getScene().activeCamera.globalPosition);
            }
            // Bones
            MaterialHelper.BindBonesParameters(mesh, effect);
            var name;
            // Texture
            for (name in this._textures) {
                effect.setTexture(name, this._textures[name]);
            }
            // Texture arrays
            for (name in this._textureArrays) {
                effect.setTextureArray(name, this._textureArrays[name]);
            }
            // Int
            for (name in this._ints) {
                effect.setInt(name, this._ints[name]);
            }
            // Float
            for (name in this._floats) {
                effect.setFloat(name, this._floats[name]);
            }
            // Floats
            for (name in this._floatsArrays) {
                effect.setArray(name, this._floatsArrays[name]);
            }
            // Color3
            for (name in this._colors3) {
                effect.setColor3(name, this._colors3[name]);
            }
            // Color3Array
            for (name in this._colors3Arrays) {
                effect.setArray3(name, this._colors3Arrays[name]);
            }
            // Color4
            for (name in this._colors4) {
                var color = this._colors4[name];
                effect.setFloat4(name, color.r, color.g, color.b, color.a);
            }
            // Color4Array
            for (name in this._colors4Arrays) {
                effect.setArray4(name, this._colors4Arrays[name]);
            }
            // Vector2
            for (name in this._vectors2) {
                effect.setVector2(name, this._vectors2[name]);
            }
            // Vector3
            for (name in this._vectors3) {
                effect.setVector3(name, this._vectors3[name]);
            }
            // Vector4
            for (name in this._vectors4) {
                effect.setVector4(name, this._vectors4[name]);
            }
            // Matrix
            for (name in this._matrices) {
                effect.setMatrix(name, this._matrices[name]);
            }
            // MatrixArray
            for (name in this._matrixArrays) {
                effect.setMatrices(name, this._matrixArrays[name]);
            }
            // Matrix 3x3
            for (name in this._matrices3x3) {
                effect.setMatrix3x3(name, this._matrices3x3[name]);
            }
            // Matrix 2x2
            for (name in this._matrices2x2) {
                effect.setMatrix2x2(name, this._matrices2x2[name]);
            }
            // Vector2Array
            for (name in this._vectors2Arrays) {
                effect.setArray2(name, this._vectors2Arrays[name]);
            }
            // Vector3Array
            for (name in this._vectors3Arrays) {
                effect.setArray3(name, this._vectors3Arrays[name]);
            }
            // Vector4Array
            for (name in this._vectors4Arrays) {
                effect.setArray4(name, this._vectors4Arrays[name]);
            }
        }
        var seffect = this._effect;
        this._effect = effect; // make sure the active effect is the right one if there are some observers for onBind that would need to get the current effect
        this._afterBind(mesh);
        this._effect = seffect;
    };
    ShaderMaterial.prototype._afterBind = function (mesh) {
        _super.prototype._afterBind.call(this, mesh);
        this.getScene()._cachedEffect = this._effect;
    };
    /**
     * Gets the active textures from the material
     * @returns an array of textures
     */
    ShaderMaterial.prototype.getActiveTextures = function () {
        var activeTextures = _super.prototype.getActiveTextures.call(this);
        for (var name in this._textures) {
            activeTextures.push(this._textures[name]);
        }
        for (var name in this._textureArrays) {
            var array = this._textureArrays[name];
            for (var index = 0; index < array.length; index++) {
                activeTextures.push(array[index]);
            }
        }
        return activeTextures;
    };
    /**
     * Specifies if the material uses a texture
     * @param texture defines the texture to check against the material
     * @returns a boolean specifying if the material uses the texture
     */
    ShaderMaterial.prototype.hasTexture = function (texture) {
        if (_super.prototype.hasTexture.call(this, texture)) {
            return true;
        }
        for (var name in this._textures) {
            if (this._textures[name] === texture) {
                return true;
            }
        }
        for (var name in this._textureArrays) {
            var array = this._textureArrays[name];
            for (var index = 0; index < array.length; index++) {
                if (array[index] === texture) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Makes a duplicate of the material, and gives it a new name
     * @param name defines the new name for the duplicated material
     * @returns the cloned material
     */
    ShaderMaterial.prototype.clone = function (name) {
        var _this = this;
        var result = SerializationHelper.Clone(function () { return new ShaderMaterial(name, _this.getScene(), _this._shaderPath, _this._options); }, this);
        result.name = name;
        result.id = name;
        // Shader code path
        if (typeof result._shaderPath === 'object') {
            result._shaderPath = __assign({}, result._shaderPath);
        }
        // Options
        this._options = __assign({}, this._options);
        Object.keys(this._options).forEach(function (propName) {
            var propValue = _this._options[propName];
            if (Array.isArray(propValue)) {
                _this._options[propName] = propValue.slice(0);
            }
        });
        // Texture
        for (var key in this._textures) {
            result.setTexture(key, this._textures[key]);
        }
        // Float
        for (var key in this._floats) {
            result.setFloat(key, this._floats[key]);
        }
        // Floats
        for (var key in this._floatsArrays) {
            result.setFloats(key, this._floatsArrays[key]);
        }
        // Color3
        for (var key in this._colors3) {
            result.setColor3(key, this._colors3[key]);
        }
        // Color4
        for (var key in this._colors4) {
            result.setColor4(key, this._colors4[key]);
        }
        // Vector2
        for (var key in this._vectors2) {
            result.setVector2(key, this._vectors2[key]);
        }
        // Vector3
        for (var key in this._vectors3) {
            result.setVector3(key, this._vectors3[key]);
        }
        // Vector4
        for (var key in this._vectors4) {
            result.setVector4(key, this._vectors4[key]);
        }
        // Matrix
        for (var key in this._matrices) {
            result.setMatrix(key, this._matrices[key]);
        }
        // Matrix 3x3
        for (var key in this._matrices3x3) {
            result.setMatrix3x3(key, this._matrices3x3[key]);
        }
        // Matrix 2x2
        for (var key in this._matrices2x2) {
            result.setMatrix2x2(key, this._matrices2x2[key]);
        }
        return result;
    };
    /**
     * Disposes the material
     * @param forceDisposeEffect specifies if effects should be forcefully disposed
     * @param forceDisposeTextures specifies if textures should be forcefully disposed
     * @param notBoundToMesh specifies if the material that is being disposed is known to be not bound to any mesh
     */
    ShaderMaterial.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures, notBoundToMesh) {
        if (forceDisposeTextures) {
            var name;
            for (name in this._textures) {
                this._textures[name].dispose();
            }
            for (name in this._textureArrays) {
                var array = this._textureArrays[name];
                for (var index = 0; index < array.length; index++) {
                    array[index].dispose();
                }
            }
        }
        this._textures = {};
        _super.prototype.dispose.call(this, forceDisposeEffect, forceDisposeTextures, notBoundToMesh);
    };
    /**
     * Serializes this material in a JSON representation
     * @returns the serialized material object
     */
    ShaderMaterial.prototype.serialize = function () {
        var serializationObject = SerializationHelper.Serialize(this);
        serializationObject.customType = "BABYLON.ShaderMaterial";
        serializationObject.options = this._options;
        serializationObject.shaderPath = this._shaderPath;
        var name;
        // Texture
        serializationObject.textures = {};
        for (name in this._textures) {
            serializationObject.textures[name] = this._textures[name].serialize();
        }
        // Texture arrays
        serializationObject.textureArrays = {};
        for (name in this._textureArrays) {
            serializationObject.textureArrays[name] = [];
            var array = this._textureArrays[name];
            for (var index = 0; index < array.length; index++) {
                serializationObject.textureArrays[name].push(array[index].serialize());
            }
        }
        // Float
        serializationObject.floats = {};
        for (name in this._floats) {
            serializationObject.floats[name] = this._floats[name];
        }
        // Floats
        serializationObject.FloatArrays = {};
        for (name in this._floatsArrays) {
            serializationObject.FloatArrays[name] = this._floatsArrays[name];
        }
        // Color3
        serializationObject.colors3 = {};
        for (name in this._colors3) {
            serializationObject.colors3[name] = this._colors3[name].asArray();
        }
        // Color3 array
        serializationObject.colors3Arrays = {};
        for (name in this._colors3Arrays) {
            serializationObject.colors3Arrays[name] = this._colors3Arrays[name];
        }
        // Color4
        serializationObject.colors4 = {};
        for (name in this._colors4) {
            serializationObject.colors4[name] = this._colors4[name].asArray();
        }
        // Color4 array
        serializationObject.colors4Arrays = {};
        for (name in this._colors4Arrays) {
            serializationObject.colors4Arrays[name] = this._colors4Arrays[name];
        }
        // Vector2
        serializationObject.vectors2 = {};
        for (name in this._vectors2) {
            serializationObject.vectors2[name] = this._vectors2[name].asArray();
        }
        // Vector3
        serializationObject.vectors3 = {};
        for (name in this._vectors3) {
            serializationObject.vectors3[name] = this._vectors3[name].asArray();
        }
        // Vector4
        serializationObject.vectors4 = {};
        for (name in this._vectors4) {
            serializationObject.vectors4[name] = this._vectors4[name].asArray();
        }
        // Matrix
        serializationObject.matrices = {};
        for (name in this._matrices) {
            serializationObject.matrices[name] = this._matrices[name].asArray();
        }
        // MatrixArray
        serializationObject.matrixArray = {};
        for (name in this._matrixArrays) {
            serializationObject.matrixArray[name] = this._matrixArrays[name];
        }
        // Matrix 3x3
        serializationObject.matrices3x3 = {};
        for (name in this._matrices3x3) {
            serializationObject.matrices3x3[name] = this._matrices3x3[name];
        }
        // Matrix 2x2
        serializationObject.matrices2x2 = {};
        for (name in this._matrices2x2) {
            serializationObject.matrices2x2[name] = this._matrices2x2[name];
        }
        // Vector2Array
        serializationObject.vectors2Arrays = {};
        for (name in this._vectors2Arrays) {
            serializationObject.vectors2Arrays[name] = this._vectors2Arrays[name];
        }
        // Vector3Array
        serializationObject.vectors3Arrays = {};
        for (name in this._vectors3Arrays) {
            serializationObject.vectors3Arrays[name] = this._vectors3Arrays[name];
        }
        // Vector4Array
        serializationObject.vectors4Arrays = {};
        for (name in this._vectors4Arrays) {
            serializationObject.vectors4Arrays[name] = this._vectors4Arrays[name];
        }
        return serializationObject;
    };
    /**
     * Creates a shader material from parsed shader material data
     * @param source defines the JSON represnetation of the material
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a new material
     */
    ShaderMaterial.Parse = function (source, scene, rootUrl) {
        var material = SerializationHelper.Parse(function () { return new ShaderMaterial(source.name, scene, source.shaderPath, source.options); }, source, scene, rootUrl);
        var name;
        // Texture
        for (name in source.textures) {
            material.setTexture(name, Texture.Parse(source.textures[name], scene, rootUrl));
        }
        // Texture arrays
        for (name in source.textureArrays) {
            var array = source.textureArrays[name];
            var textureArray = new Array();
            for (var index = 0; index < array.length; index++) {
                textureArray.push(Texture.Parse(array[index], scene, rootUrl));
            }
            material.setTextureArray(name, textureArray);
        }
        // Float
        for (name in source.floats) {
            material.setFloat(name, source.floats[name]);
        }
        // Float s
        for (name in source.floatsArrays) {
            material.setFloats(name, source.floatsArrays[name]);
        }
        // Color3
        for (name in source.colors3) {
            material.setColor3(name, Color3.FromArray(source.colors3[name]));
        }
        // Color3 arrays
        for (name in source.colors3Arrays) {
            var colors = source.colors3Arrays[name].reduce(function (arr, num, i) {
                if (i % 3 === 0) {
                    arr.push([num]);
                }
                else {
                    arr[arr.length - 1].push(num);
                }
                return arr;
            }, []).map(function (color) { return Color3.FromArray(color); });
            material.setColor3Array(name, colors);
        }
        // Color4
        for (name in source.colors4) {
            material.setColor4(name, Color4.FromArray(source.colors4[name]));
        }
        // Color4 arrays
        for (name in source.colors4Arrays) {
            var colors = source.colors4Arrays[name].reduce(function (arr, num, i) {
                if (i % 4 === 0) {
                    arr.push([num]);
                }
                else {
                    arr[arr.length - 1].push(num);
                }
                return arr;
            }, []).map(function (color) { return Color4.FromArray(color); });
            material.setColor4Array(name, colors);
        }
        // Vector2
        for (name in source.vectors2) {
            material.setVector2(name, Vector2.FromArray(source.vectors2[name]));
        }
        // Vector3
        for (name in source.vectors3) {
            material.setVector3(name, Vector3.FromArray(source.vectors3[name]));
        }
        // Vector4
        for (name in source.vectors4) {
            material.setVector4(name, Vector4.FromArray(source.vectors4[name]));
        }
        // Matrix
        for (name in source.matrices) {
            material.setMatrix(name, Matrix.FromArray(source.matrices[name]));
        }
        // MatrixArray
        for (name in source.matrixArray) {
            material._matrixArrays[name] = new Float32Array(source.matrixArray[name]);
        }
        // Matrix 3x3
        for (name in source.matrices3x3) {
            material.setMatrix3x3(name, source.matrices3x3[name]);
        }
        // Matrix 2x2
        for (name in source.matrices2x2) {
            material.setMatrix2x2(name, source.matrices2x2[name]);
        }
        // Vector2Array
        for (name in source.vectors2Arrays) {
            material.setArray2(name, source.vectors2Arrays[name]);
        }
        // Vector3Array
        for (name in source.vectors3Arrays) {
            material.setArray3(name, source.vectors3Arrays[name]);
        }
        // Vector4Array
        for (name in source.vectors4Arrays) {
            material.setArray4(name, source.vectors4Arrays[name]);
        }
        return material;
    };
    /**
     * Creates a new ShaderMaterial from a snippet saved in a remote file
     * @param name defines the name of the ShaderMaterial to create (can be null or empty to use the one from the json data)
     * @param url defines the url to load from
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a promise that will resolve to the new ShaderMaterial
     */
    ShaderMaterial.ParseFromFileAsync = function (name, url, scene, rootUrl) {
        var _this = this;
        if (rootUrl === void 0) { rootUrl = ""; }
        return new Promise(function (resolve, reject) {
            var request = new WebRequest();
            request.addEventListener("readystatechange", function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        var serializationObject = JSON.parse(request.responseText);
                        var output = _this.Parse(serializationObject, scene || Engine.LastCreatedScene, rootUrl);
                        if (name) {
                            output.name = name;
                        }
                        resolve(output);
                    }
                    else {
                        reject("Unable to load the ShaderMaterial");
                    }
                }
            });
            request.open("GET", url);
            request.send();
        });
    };
    /**
     * Creates a ShaderMaterial from a snippet saved by the Inspector
     * @param snippetId defines the snippet to load
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a promise that will resolve to the new ShaderMaterial
     */
    ShaderMaterial.CreateFromSnippetAsync = function (snippetId, scene, rootUrl) {
        var _this = this;
        if (rootUrl === void 0) { rootUrl = ""; }
        return new Promise(function (resolve, reject) {
            var request = new WebRequest();
            request.addEventListener("readystatechange", function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        var snippet = JSON.parse(JSON.parse(request.responseText).jsonPayload);
                        var serializationObject = JSON.parse(snippet.shaderMaterial);
                        var output = _this.Parse(serializationObject, scene || Engine.LastCreatedScene, rootUrl);
                        output.snippetId = snippetId;
                        resolve(output);
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
    /** Define the Url to load snippets */
    ShaderMaterial.SnippetUrl = "https://snippet.babylonjs.com";
    return ShaderMaterial;
}(Material));
_TypeStore.RegisteredTypes["BABYLON.ShaderMaterial"] = ShaderMaterial;

export { ShaderMaterial as S };