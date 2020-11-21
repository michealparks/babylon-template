import { T as ThinEngine, W as WebGLDataBuffer, L as Logger } from './thinEngine-e576a091.js';

ThinEngine.prototype.createUniformBuffer = function (elements) {
    var ubo = this._gl.createBuffer();
    if (!ubo) {
        throw new Error("Unable to create uniform buffer");
    }
    var result = new WebGLDataBuffer(ubo);
    this.bindUniformBuffer(result);
    if (elements instanceof Float32Array) {
        this._gl.bufferData(this._gl.UNIFORM_BUFFER, elements, this._gl.STATIC_DRAW);
    }
    else {
        this._gl.bufferData(this._gl.UNIFORM_BUFFER, new Float32Array(elements), this._gl.STATIC_DRAW);
    }
    this.bindUniformBuffer(null);
    result.references = 1;
    return result;
};
ThinEngine.prototype.createDynamicUniformBuffer = function (elements) {
    var ubo = this._gl.createBuffer();
    if (!ubo) {
        throw new Error("Unable to create dynamic uniform buffer");
    }
    var result = new WebGLDataBuffer(ubo);
    this.bindUniformBuffer(result);
    if (elements instanceof Float32Array) {
        this._gl.bufferData(this._gl.UNIFORM_BUFFER, elements, this._gl.DYNAMIC_DRAW);
    }
    else {
        this._gl.bufferData(this._gl.UNIFORM_BUFFER, new Float32Array(elements), this._gl.DYNAMIC_DRAW);
    }
    this.bindUniformBuffer(null);
    result.references = 1;
    return result;
};
ThinEngine.prototype.updateUniformBuffer = function (uniformBuffer, elements, offset, count) {
    this.bindUniformBuffer(uniformBuffer);
    if (offset === undefined) {
        offset = 0;
    }
    if (count === undefined) {
        if (elements instanceof Float32Array) {
            this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, offset, elements);
        }
        else {
            this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, offset, new Float32Array(elements));
        }
    }
    else {
        if (elements instanceof Float32Array) {
            this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, 0, elements.subarray(offset, offset + count));
        }
        else {
            this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, 0, new Float32Array(elements).subarray(offset, offset + count));
        }
    }
    this.bindUniformBuffer(null);
};
ThinEngine.prototype.bindUniformBuffer = function (buffer) {
    this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, buffer ? buffer.underlyingResource : null);
};
ThinEngine.prototype.bindUniformBufferBase = function (buffer, location) {
    this._gl.bindBufferBase(this._gl.UNIFORM_BUFFER, location, buffer ? buffer.underlyingResource : null);
};
ThinEngine.prototype.bindUniformBlock = function (pipelineContext, blockName, index) {
    var program = pipelineContext.program;
    var uniformLocation = this._gl.getUniformBlockIndex(program, blockName);
    this._gl.uniformBlockBinding(program, uniformLocation, index);
};

/**
 * Uniform buffer objects.
 *
 * Handles blocks of uniform on the GPU.
 *
 * If WebGL 2 is not available, this class falls back on traditionnal setUniformXXX calls.
 *
 * For more information, please refer to :
 * https://www.khronos.org/opengl/wiki/Uniform_Buffer_Object
 */
var UniformBuffer = /** @class */ (function () {
    /**
     * Instantiates a new Uniform buffer objects.
     *
     * Handles blocks of uniform on the GPU.
     *
     * If WebGL 2 is not available, this class falls back on traditionnal setUniformXXX calls.
     *
     * For more information, please refer to :
     * @see https://www.khronos.org/opengl/wiki/Uniform_Buffer_Object
     * @param engine Define the engine the buffer is associated with
     * @param data Define the data contained in the buffer
     * @param dynamic Define if the buffer is updatable
     */
    function UniformBuffer(engine, data, dynamic) {
        /** @hidden */
        this._alreadyBound = false;
        // Matrix cache
        this._valueCache = {};
        this._engine = engine;
        this._noUBO = !engine.supportsUniformBuffers;
        this._dynamic = dynamic;
        this._data = data || [];
        this._uniformLocations = {};
        this._uniformSizes = {};
        this._uniformLocationPointer = 0;
        this._needSync = false;
        if (this._noUBO) {
            this.updateMatrix3x3 = this._updateMatrix3x3ForEffect;
            this.updateMatrix2x2 = this._updateMatrix2x2ForEffect;
            this.updateFloat = this._updateFloatForEffect;
            this.updateFloat2 = this._updateFloat2ForEffect;
            this.updateFloat3 = this._updateFloat3ForEffect;
            this.updateFloat4 = this._updateFloat4ForEffect;
            this.updateMatrix = this._updateMatrixForEffect;
            this.updateVector3 = this._updateVector3ForEffect;
            this.updateVector4 = this._updateVector4ForEffect;
            this.updateColor3 = this._updateColor3ForEffect;
            this.updateColor4 = this._updateColor4ForEffect;
        }
        else {
            this._engine._uniformBuffers.push(this);
            this.updateMatrix3x3 = this._updateMatrix3x3ForUniform;
            this.updateMatrix2x2 = this._updateMatrix2x2ForUniform;
            this.updateFloat = this._updateFloatForUniform;
            this.updateFloat2 = this._updateFloat2ForUniform;
            this.updateFloat3 = this._updateFloat3ForUniform;
            this.updateFloat4 = this._updateFloat4ForUniform;
            this.updateMatrix = this._updateMatrixForUniform;
            this.updateVector3 = this._updateVector3ForUniform;
            this.updateVector4 = this._updateVector4ForUniform;
            this.updateColor3 = this._updateColor3ForUniform;
            this.updateColor4 = this._updateColor4ForUniform;
        }
    }
    Object.defineProperty(UniformBuffer.prototype, "useUbo", {
        /**
         * Indicates if the buffer is using the WebGL2 UBO implementation,
         * or just falling back on setUniformXXX calls.
         */
        get: function () {
            return !this._noUBO;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UniformBuffer.prototype, "isSync", {
        /**
         * Indicates if the WebGL underlying uniform buffer is in sync
         * with the javascript cache data.
         */
        get: function () {
            return !this._needSync;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Indicates if the WebGL underlying uniform buffer is dynamic.
     * Also, a dynamic UniformBuffer will disable cache verification and always
     * update the underlying WebGL uniform buffer to the GPU.
     * @returns if Dynamic, otherwise false
     */
    UniformBuffer.prototype.isDynamic = function () {
        return this._dynamic !== undefined;
    };
    /**
     * The data cache on JS side.
     * @returns the underlying data as a float array
     */
    UniformBuffer.prototype.getData = function () {
        return this._bufferData;
    };
    /**
     * The underlying WebGL Uniform buffer.
     * @returns the webgl buffer
     */
    UniformBuffer.prototype.getBuffer = function () {
        return this._buffer;
    };
    /**
     * std140 layout specifies how to align data within an UBO structure.
     * See https://khronos.org/registry/OpenGL/specs/gl/glspec45.core.pdf#page=159
     * for specs.
     */
    UniformBuffer.prototype._fillAlignment = function (size) {
        // This code has been simplified because we only use floats, vectors of 1, 2, 3, 4 components
        // and 4x4 matrices
        // TODO : change if other types are used
        var alignment;
        if (size <= 2) {
            alignment = size;
        }
        else {
            alignment = 4;
        }
        if ((this._uniformLocationPointer % alignment) !== 0) {
            var oldPointer = this._uniformLocationPointer;
            this._uniformLocationPointer += alignment - (this._uniformLocationPointer % alignment);
            var diff = this._uniformLocationPointer - oldPointer;
            for (var i = 0; i < diff; i++) {
                this._data.push(0);
            }
        }
    };
    /**
     * Adds an uniform in the buffer.
     * Warning : the subsequents calls of this function must be in the same order as declared in the shader
     * for the layout to be correct !
     * @param name Name of the uniform, as used in the uniform block in the shader.
     * @param size Data size, or data directly.
     */
    UniformBuffer.prototype.addUniform = function (name, size) {
        if (this._noUBO) {
            return;
        }
        if (this._uniformLocations[name] !== undefined) {
            // Already existing uniform
            return;
        }
        // This function must be called in the order of the shader layout !
        // size can be the size of the uniform, or data directly
        var data;
        if (size instanceof Array) {
            data = size;
            size = data.length;
        }
        else {
            size = size;
            data = [];
            // Fill with zeros
            for (var i = 0; i < size; i++) {
                data.push(0);
            }
        }
        this._fillAlignment(size);
        this._uniformSizes[name] = size;
        this._uniformLocations[name] = this._uniformLocationPointer;
        this._uniformLocationPointer += size;
        for (var i = 0; i < size; i++) {
            this._data.push(data[i]);
        }
        this._needSync = true;
    };
    /**
     * Adds a Matrix 4x4 to the uniform buffer.
     * @param name Name of the uniform, as used in the uniform block in the shader.
     * @param mat A 4x4 matrix.
     */
    UniformBuffer.prototype.addMatrix = function (name, mat) {
        this.addUniform(name, Array.prototype.slice.call(mat.toArray()));
    };
    /**
     * Adds a vec2 to the uniform buffer.
     * @param name Name of the uniform, as used in the uniform block in the shader.
     * @param x Define the x component value of the vec2
     * @param y Define the y component value of the vec2
     */
    UniformBuffer.prototype.addFloat2 = function (name, x, y) {
        var temp = [x, y];
        this.addUniform(name, temp);
    };
    /**
     * Adds a vec3 to the uniform buffer.
     * @param name Name of the uniform, as used in the uniform block in the shader.
     * @param x Define the x component value of the vec3
     * @param y Define the y component value of the vec3
     * @param z Define the z component value of the vec3
     */
    UniformBuffer.prototype.addFloat3 = function (name, x, y, z) {
        var temp = [x, y, z];
        this.addUniform(name, temp);
    };
    /**
     * Adds a vec3 to the uniform buffer.
     * @param name Name of the uniform, as used in the uniform block in the shader.
     * @param color Define the vec3 from a Color
     */
    UniformBuffer.prototype.addColor3 = function (name, color) {
        var temp = new Array();
        color.toArray(temp);
        this.addUniform(name, temp);
    };
    /**
     * Adds a vec4 to the uniform buffer.
     * @param name Name of the uniform, as used in the uniform block in the shader.
     * @param color Define the rgb components from a Color
     * @param alpha Define the a component of the vec4
     */
    UniformBuffer.prototype.addColor4 = function (name, color, alpha) {
        var temp = new Array();
        color.toArray(temp);
        temp.push(alpha);
        this.addUniform(name, temp);
    };
    /**
     * Adds a vec3 to the uniform buffer.
     * @param name Name of the uniform, as used in the uniform block in the shader.
     * @param vector Define the vec3 components from a Vector
     */
    UniformBuffer.prototype.addVector3 = function (name, vector) {
        var temp = new Array();
        vector.toArray(temp);
        this.addUniform(name, temp);
    };
    /**
     * Adds a Matrix 3x3 to the uniform buffer.
     * @param name Name of the uniform, as used in the uniform block in the shader.
     */
    UniformBuffer.prototype.addMatrix3x3 = function (name) {
        this.addUniform(name, 12);
    };
    /**
     * Adds a Matrix 2x2 to the uniform buffer.
     * @param name Name of the uniform, as used in the uniform block in the shader.
     */
    UniformBuffer.prototype.addMatrix2x2 = function (name) {
        this.addUniform(name, 8);
    };
    /**
     * Effectively creates the WebGL Uniform Buffer, once layout is completed with `addUniform`.
     */
    UniformBuffer.prototype.create = function () {
        if (this._noUBO) {
            return;
        }
        if (this._buffer) {
            return; // nothing to do
        }
        // See spec, alignment must be filled as a vec4
        this._fillAlignment(4);
        this._bufferData = new Float32Array(this._data);
        this._rebuild();
        this._needSync = true;
    };
    /** @hidden */
    UniformBuffer.prototype._rebuild = function () {
        if (this._noUBO || !this._bufferData) {
            return;
        }
        if (this._dynamic) {
            this._buffer = this._engine.createDynamicUniformBuffer(this._bufferData);
        }
        else {
            this._buffer = this._engine.createUniformBuffer(this._bufferData);
        }
    };
    /**
     * Updates the WebGL Uniform Buffer on the GPU.
     * If the `dynamic` flag is set to true, no cache comparison is done.
     * Otherwise, the buffer will be updated only if the cache differs.
     */
    UniformBuffer.prototype.update = function () {
        if (!this._buffer) {
            this.create();
            return;
        }
        if (!this._dynamic && !this._needSync) {
            return;
        }
        this._engine.updateUniformBuffer(this._buffer, this._bufferData);
        this._needSync = false;
    };
    /**
     * Updates the value of an uniform. The `update` method must be called afterwards to make it effective in the GPU.
     * @param uniformName Define the name of the uniform, as used in the uniform block in the shader.
     * @param data Define the flattened data
     * @param size Define the size of the data.
     */
    UniformBuffer.prototype.updateUniform = function (uniformName, data, size) {
        var location = this._uniformLocations[uniformName];
        if (location === undefined) {
            if (this._buffer) {
                // Cannot add an uniform if the buffer is already created
                Logger.Error("Cannot add an uniform after UBO has been created.");
                return;
            }
            this.addUniform(uniformName, size);
            location = this._uniformLocations[uniformName];
        }
        if (!this._buffer) {
            this.create();
        }
        if (!this._dynamic) {
            // Cache for static uniform buffers
            var changed = false;
            for (var i = 0; i < size; i++) {
                // We are checking the matrix cache before calling updateUniform so we do not need to check it here
                // Hence the test for size === 16 to simply commit the matrix values
                if (size === 16 || this._bufferData[location + i] !== data[i]) {
                    changed = true;
                    this._bufferData[location + i] = data[i];
                }
            }
            this._needSync = this._needSync || changed;
        }
        else {
            // No cache for dynamic
            for (var i = 0; i < size; i++) {
                this._bufferData[location + i] = data[i];
            }
        }
    };
    UniformBuffer.prototype._cacheMatrix = function (name, matrix) {
        var cache = this._valueCache[name];
        var flag = matrix.updateFlag;
        if (cache !== undefined && cache === flag) {
            return false;
        }
        this._valueCache[name] = flag;
        return true;
    };
    // Update methods
    UniformBuffer.prototype._updateMatrix3x3ForUniform = function (name, matrix) {
        // To match std140, matrix must be realigned
        for (var i = 0; i < 3; i++) {
            UniformBuffer._tempBuffer[i * 4] = matrix[i * 3];
            UniformBuffer._tempBuffer[i * 4 + 1] = matrix[i * 3 + 1];
            UniformBuffer._tempBuffer[i * 4 + 2] = matrix[i * 3 + 2];
            UniformBuffer._tempBuffer[i * 4 + 3] = 0.0;
        }
        this.updateUniform(name, UniformBuffer._tempBuffer, 12);
    };
    UniformBuffer.prototype._updateMatrix3x3ForEffect = function (name, matrix) {
        this._currentEffect.setMatrix3x3(name, matrix);
    };
    UniformBuffer.prototype._updateMatrix2x2ForEffect = function (name, matrix) {
        this._currentEffect.setMatrix2x2(name, matrix);
    };
    UniformBuffer.prototype._updateMatrix2x2ForUniform = function (name, matrix) {
        // To match std140, matrix must be realigned
        for (var i = 0; i < 2; i++) {
            UniformBuffer._tempBuffer[i * 4] = matrix[i * 2];
            UniformBuffer._tempBuffer[i * 4 + 1] = matrix[i * 2 + 1];
            UniformBuffer._tempBuffer[i * 4 + 2] = 0.0;
            UniformBuffer._tempBuffer[i * 4 + 3] = 0.0;
        }
        this.updateUniform(name, UniformBuffer._tempBuffer, 8);
    };
    UniformBuffer.prototype._updateFloatForEffect = function (name, x) {
        this._currentEffect.setFloat(name, x);
    };
    UniformBuffer.prototype._updateFloatForUniform = function (name, x) {
        UniformBuffer._tempBuffer[0] = x;
        this.updateUniform(name, UniformBuffer._tempBuffer, 1);
    };
    UniformBuffer.prototype._updateFloat2ForEffect = function (name, x, y, suffix) {
        if (suffix === void 0) { suffix = ""; }
        this._currentEffect.setFloat2(name + suffix, x, y);
    };
    UniformBuffer.prototype._updateFloat2ForUniform = function (name, x, y) {
        UniformBuffer._tempBuffer[0] = x;
        UniformBuffer._tempBuffer[1] = y;
        this.updateUniform(name, UniformBuffer._tempBuffer, 2);
    };
    UniformBuffer.prototype._updateFloat3ForEffect = function (name, x, y, z, suffix) {
        if (suffix === void 0) { suffix = ""; }
        this._currentEffect.setFloat3(name + suffix, x, y, z);
    };
    UniformBuffer.prototype._updateFloat3ForUniform = function (name, x, y, z) {
        UniformBuffer._tempBuffer[0] = x;
        UniformBuffer._tempBuffer[1] = y;
        UniformBuffer._tempBuffer[2] = z;
        this.updateUniform(name, UniformBuffer._tempBuffer, 3);
    };
    UniformBuffer.prototype._updateFloat4ForEffect = function (name, x, y, z, w, suffix) {
        if (suffix === void 0) { suffix = ""; }
        this._currentEffect.setFloat4(name + suffix, x, y, z, w);
    };
    UniformBuffer.prototype._updateFloat4ForUniform = function (name, x, y, z, w) {
        UniformBuffer._tempBuffer[0] = x;
        UniformBuffer._tempBuffer[1] = y;
        UniformBuffer._tempBuffer[2] = z;
        UniformBuffer._tempBuffer[3] = w;
        this.updateUniform(name, UniformBuffer._tempBuffer, 4);
    };
    UniformBuffer.prototype._updateMatrixForEffect = function (name, mat) {
        this._currentEffect.setMatrix(name, mat);
    };
    UniformBuffer.prototype._updateMatrixForUniform = function (name, mat) {
        if (this._cacheMatrix(name, mat)) {
            this.updateUniform(name, mat.toArray(), 16);
        }
    };
    UniformBuffer.prototype._updateVector3ForEffect = function (name, vector) {
        this._currentEffect.setVector3(name, vector);
    };
    UniformBuffer.prototype._updateVector3ForUniform = function (name, vector) {
        vector.toArray(UniformBuffer._tempBuffer);
        this.updateUniform(name, UniformBuffer._tempBuffer, 3);
    };
    UniformBuffer.prototype._updateVector4ForEffect = function (name, vector) {
        this._currentEffect.setVector4(name, vector);
    };
    UniformBuffer.prototype._updateVector4ForUniform = function (name, vector) {
        vector.toArray(UniformBuffer._tempBuffer);
        this.updateUniform(name, UniformBuffer._tempBuffer, 4);
    };
    UniformBuffer.prototype._updateColor3ForEffect = function (name, color, suffix) {
        if (suffix === void 0) { suffix = ""; }
        this._currentEffect.setColor3(name + suffix, color);
    };
    UniformBuffer.prototype._updateColor3ForUniform = function (name, color) {
        color.toArray(UniformBuffer._tempBuffer);
        this.updateUniform(name, UniformBuffer._tempBuffer, 3);
    };
    UniformBuffer.prototype._updateColor4ForEffect = function (name, color, alpha, suffix) {
        if (suffix === void 0) { suffix = ""; }
        this._currentEffect.setColor4(name + suffix, color, alpha);
    };
    UniformBuffer.prototype._updateColor4ForUniform = function (name, color, alpha) {
        color.toArray(UniformBuffer._tempBuffer);
        UniformBuffer._tempBuffer[3] = alpha;
        this.updateUniform(name, UniformBuffer._tempBuffer, 4);
    };
    /**
     * Sets a sampler uniform on the effect.
     * @param name Define the name of the sampler.
     * @param texture Define the texture to set in the sampler
     */
    UniformBuffer.prototype.setTexture = function (name, texture) {
        this._currentEffect.setTexture(name, texture);
    };
    /**
     * Directly updates the value of the uniform in the cache AND on the GPU.
     * @param uniformName Define the name of the uniform, as used in the uniform block in the shader.
     * @param data Define the flattened data
     */
    UniformBuffer.prototype.updateUniformDirectly = function (uniformName, data) {
        this.updateUniform(uniformName, data, data.length);
        this.update();
    };
    /**
     * Binds this uniform buffer to an effect.
     * @param effect Define the effect to bind the buffer to
     * @param name Name of the uniform block in the shader.
     */
    UniformBuffer.prototype.bindToEffect = function (effect, name) {
        this._currentEffect = effect;
        if (this._noUBO || !this._buffer) {
            return;
        }
        this._alreadyBound = true;
        effect.bindUniformBuffer(this._buffer, name);
    };
    /**
     * Disposes the uniform buffer.
     */
    UniformBuffer.prototype.dispose = function () {
        if (this._noUBO) {
            return;
        }
        var uniformBuffers = this._engine._uniformBuffers;
        var index = uniformBuffers.indexOf(this);
        if (index !== -1) {
            uniformBuffers[index] = uniformBuffers[uniformBuffers.length - 1];
            uniformBuffers.pop();
        }
        if (!this._buffer) {
            return;
        }
        if (this._engine._releaseBuffer(this._buffer)) {
            this._buffer = null;
        }
    };
    // Pool for avoiding memory leaks
    UniformBuffer._MAX_UNIFORM_SIZE = 256;
    UniformBuffer._tempBuffer = new Float32Array(UniformBuffer._MAX_UNIFORM_SIZE);
    return UniformBuffer;
}());

export { UniformBuffer as U };
