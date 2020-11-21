import { _ as __extends, O as Observable, L as Logger, b as _DevTools, C as CanvasGenerator } from './thinEngine-e576a091.js';
import { T as Tags, S as SerializationHelper, N as Node } from './node-87d9c658.js';
import { V as Vector3, C as Color4, _ as _TypeStore, a as Vector2, Q as Quaternion, M as Matrix, b as Color3 } from './math.color-fc6e801e.js';
import { T as Tools, A as AsyncLoop, D as DeepCopier } from './tools-ab6f1dea.js';
import { V as VertexBuffer, B as BoundingInfo, e as extractMinAndMax, a as SubMesh, b as VertexData, M as Material, c as Buffer, d as SceneComponentConstants, A as AbstractMesh } from './sceneComponent-5502b64a.js';

/**
 * Class used to represent data loading progression
 */
var SceneLoaderFlags = /** @class */ (function () {
    function SceneLoaderFlags() {
    }
    Object.defineProperty(SceneLoaderFlags, "ForceFullSceneLoadingForIncremental", {
        /**
         * Gets or sets a boolean indicating if entire scene must be loaded even if scene contains incremental data
         */
        get: function () {
            return SceneLoaderFlags._ForceFullSceneLoadingForIncremental;
        },
        set: function (value) {
            SceneLoaderFlags._ForceFullSceneLoadingForIncremental = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneLoaderFlags, "ShowLoadingScreen", {
        /**
         * Gets or sets a boolean indicating if loading screen must be displayed while loading a scene
         */
        get: function () {
            return SceneLoaderFlags._ShowLoadingScreen;
        },
        set: function (value) {
            SceneLoaderFlags._ShowLoadingScreen = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneLoaderFlags, "loggingLevel", {
        /**
         * Defines the current logging level (while loading the scene)
         * @ignorenaming
         */
        get: function () {
            return SceneLoaderFlags._loggingLevel;
        },
        set: function (value) {
            SceneLoaderFlags._loggingLevel = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SceneLoaderFlags, "CleanBoneMatrixWeights", {
        /**
         * Gets or set a boolean indicating if matrix weights must be cleaned upon loading
         */
        get: function () {
            return SceneLoaderFlags._CleanBoneMatrixWeights;
        },
        set: function (value) {
            SceneLoaderFlags._CleanBoneMatrixWeights = value;
        },
        enumerable: false,
        configurable: true
    });
    // Flags
    SceneLoaderFlags._ForceFullSceneLoadingForIncremental = false;
    SceneLoaderFlags._ShowLoadingScreen = true;
    SceneLoaderFlags._CleanBoneMatrixWeights = false;
    SceneLoaderFlags._loggingLevel = 0;
    return SceneLoaderFlags;
}());

/**
 * Class used to store geometry data (vertex buffers + index buffer)
 */
var Geometry = /** @class */ (function () {
    /**
     * Creates a new geometry
     * @param id defines the unique ID
     * @param scene defines the hosting scene
     * @param vertexData defines the VertexData used to get geometry data
     * @param updatable defines if geometry must be updatable (false by default)
     * @param mesh defines the mesh that will be associated with the geometry
     */
    function Geometry(id, scene, vertexData, updatable, mesh) {
        if (updatable === void 0) { updatable = false; }
        if (mesh === void 0) { mesh = null; }
        /**
         * Gets the delay loading state of the geometry (none by default which means not delayed)
         */
        this.delayLoadState = 0;
        this._totalVertices = 0;
        this._isDisposed = false;
        this._indexBufferIsUpdatable = false;
        this._positionsCache = [];
        /**
         * If set to true (false by defaut), the bounding info applied to the meshes sharing this geometry will be the bounding info defined at the class level
         * and won't be computed based on the vertex positions (which is what we get when useBoundingInfoFromGeometry = false)
         */
        this.useBoundingInfoFromGeometry = false;
        this.id = id;
        this.uniqueId = scene.getUniqueId();
        this._engine = scene.getEngine();
        this._meshes = [];
        this._scene = scene;
        //Init vertex buffer cache
        this._vertexBuffers = {};
        this._indices = [];
        this._updatable = updatable;
        // vertexData
        if (vertexData) {
            this.setAllVerticesData(vertexData, updatable);
        }
        else {
            this._totalVertices = 0;
            this._indices = [];
        }
        if (this._engine.getCaps().vertexArrayObject) {
            this._vertexArrayObjects = {};
        }
        // applyToMesh
        if (mesh) {
            this.applyToMesh(mesh);
            mesh.computeWorldMatrix(true);
        }
    }
    Object.defineProperty(Geometry.prototype, "boundingBias", {
        /**
         *  Gets or sets the Bias Vector to apply on the bounding elements (box/sphere), the max extend is computed as v += v * bias.x + bias.y, the min is computed as v -= v * bias.x + bias.y
         */
        get: function () {
            return this._boundingBias;
        },
        /**
         *  Gets or sets the Bias Vector to apply on the bounding elements (box/sphere), the max extend is computed as v += v * bias.x + bias.y, the min is computed as v -= v * bias.x + bias.y
         */
        set: function (value) {
            if (this._boundingBias) {
                this._boundingBias.copyFrom(value);
            }
            else {
                this._boundingBias = value.clone();
            }
            this._updateBoundingInfo(true, null);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Static function used to attach a new empty geometry to a mesh
     * @param mesh defines the mesh to attach the geometry to
     * @returns the new Geometry
     */
    Geometry.CreateGeometryForMesh = function (mesh) {
        var geometry = new Geometry(Geometry.RandomId(), mesh.getScene());
        geometry.applyToMesh(mesh);
        return geometry;
    };
    Object.defineProperty(Geometry.prototype, "meshes", {
        /** Get the list of meshes using this geometry */
        get: function () {
            return this._meshes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometry.prototype, "extend", {
        /**
         * Gets the current extend of the geometry
         */
        get: function () {
            return this._extend;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the hosting scene
     * @returns the hosting Scene
     */
    Geometry.prototype.getScene = function () {
        return this._scene;
    };
    /**
     * Gets the hosting engine
     * @returns the hosting Engine
     */
    Geometry.prototype.getEngine = function () {
        return this._engine;
    };
    /**
     * Defines if the geometry is ready to use
     * @returns true if the geometry is ready to be used
     */
    Geometry.prototype.isReady = function () {
        return this.delayLoadState === 1 || this.delayLoadState === 0;
    };
    Object.defineProperty(Geometry.prototype, "doNotSerialize", {
        /**
         * Gets a value indicating that the geometry should not be serialized
         */
        get: function () {
            for (var index = 0; index < this._meshes.length; index++) {
                if (!this._meshes[index].doNotSerialize) {
                    return false;
                }
            }
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    Geometry.prototype._rebuild = function () {
        if (this._vertexArrayObjects) {
            this._vertexArrayObjects = {};
        }
        // Index buffer
        if (this._meshes.length !== 0 && this._indices) {
            this._indexBuffer = this._engine.createIndexBuffer(this._indices);
        }
        // Vertex buffers
        for (var key in this._vertexBuffers) {
            var vertexBuffer = this._vertexBuffers[key];
            vertexBuffer._rebuild();
        }
    };
    /**
     * Affects all geometry data in one call
     * @param vertexData defines the geometry data
     * @param updatable defines if the geometry must be flagged as updatable (false as default)
     */
    Geometry.prototype.setAllVerticesData = function (vertexData, updatable) {
        vertexData.applyToGeometry(this, updatable);
        this.notifyUpdate();
    };
    /**
     * Set specific vertex data
     * @param kind defines the data kind (Position, normal, etc...)
     * @param data defines the vertex data to use
     * @param updatable defines if the vertex must be flagged as updatable (false as default)
     * @param stride defines the stride to use (0 by default). This value is deduced from the kind value if not specified
     */
    Geometry.prototype.setVerticesData = function (kind, data, updatable, stride) {
        if (updatable === void 0) { updatable = false; }
        if (updatable && Array.isArray(data)) {
            // to avoid converting to Float32Array at each draw call in engine.updateDynamicVertexBuffer, we make the conversion a single time here
            data = new Float32Array(data);
        }
        var buffer = new VertexBuffer(this._engine, data, kind, updatable, this._meshes.length === 0, stride);
        this.setVerticesBuffer(buffer);
    };
    /**
     * Removes a specific vertex data
     * @param kind defines the data kind (Position, normal, etc...)
     */
    Geometry.prototype.removeVerticesData = function (kind) {
        if (this._vertexBuffers[kind]) {
            this._vertexBuffers[kind].dispose();
            delete this._vertexBuffers[kind];
        }
    };
    /**
     * Affect a vertex buffer to the geometry. the vertexBuffer.getKind() function is used to determine where to store the data
     * @param buffer defines the vertex buffer to use
     * @param totalVertices defines the total number of vertices for position kind (could be null)
     */
    Geometry.prototype.setVerticesBuffer = function (buffer, totalVertices) {
        if (totalVertices === void 0) { totalVertices = null; }
        var kind = buffer.getKind();
        if (this._vertexBuffers[kind]) {
            this._vertexBuffers[kind].dispose();
        }
        this._vertexBuffers[kind] = buffer;
        if (kind === VertexBuffer.PositionKind) {
            var data = buffer.getData();
            if (totalVertices != null) {
                this._totalVertices = totalVertices;
            }
            else {
                if (data != null) {
                    this._totalVertices = data.length / (buffer.byteStride / 4);
                }
            }
            this._updateExtend(data);
            this._resetPointsArrayCache();
            var meshes = this._meshes;
            var numOfMeshes = meshes.length;
            for (var index = 0; index < numOfMeshes; index++) {
                var mesh = meshes[index];
                mesh._boundingInfo = new BoundingInfo(this._extend.minimum, this._extend.maximum);
                mesh._createGlobalSubMesh(false);
                mesh.computeWorldMatrix(true);
            }
        }
        this.notifyUpdate(kind);
        if (this._vertexArrayObjects) {
            this._disposeVertexArrayObjects();
            this._vertexArrayObjects = {}; // Will trigger a rebuild of the VAO if supported
        }
    };
    /**
     * Update a specific vertex buffer
     * This function will directly update the underlying DataBuffer according to the passed numeric array or Float32Array
     * It will do nothing if the buffer is not updatable
     * @param kind defines the data kind (Position, normal, etc...)
     * @param data defines the data to use
     * @param offset defines the offset in the target buffer where to store the data
     * @param useBytes set to true if the offset is in bytes
     */
    Geometry.prototype.updateVerticesDataDirectly = function (kind, data, offset, useBytes) {
        if (useBytes === void 0) { useBytes = false; }
        var vertexBuffer = this.getVertexBuffer(kind);
        if (!vertexBuffer) {
            return;
        }
        vertexBuffer.updateDirectly(data, offset, useBytes);
        this.notifyUpdate(kind);
    };
    /**
     * Update a specific vertex buffer
     * This function will create a new buffer if the current one is not updatable
     * @param kind defines the data kind (Position, normal, etc...)
     * @param data defines the data to use
     * @param updateExtends defines if the geometry extends must be recomputed (false by default)
     */
    Geometry.prototype.updateVerticesData = function (kind, data, updateExtends) {
        if (updateExtends === void 0) { updateExtends = false; }
        var vertexBuffer = this.getVertexBuffer(kind);
        if (!vertexBuffer) {
            return;
        }
        vertexBuffer.update(data);
        if (kind === VertexBuffer.PositionKind) {
            this._updateBoundingInfo(updateExtends, data);
        }
        this.notifyUpdate(kind);
    };
    Geometry.prototype._updateBoundingInfo = function (updateExtends, data) {
        if (updateExtends) {
            this._updateExtend(data);
        }
        this._resetPointsArrayCache();
        if (updateExtends) {
            var meshes = this._meshes;
            for (var _i = 0, meshes_1 = meshes; _i < meshes_1.length; _i++) {
                var mesh = meshes_1[_i];
                if (mesh._boundingInfo) {
                    mesh._boundingInfo.reConstruct(this._extend.minimum, this._extend.maximum);
                }
                else {
                    mesh._boundingInfo = new BoundingInfo(this._extend.minimum, this._extend.maximum);
                }
                var subMeshes = mesh.subMeshes;
                for (var _a = 0, subMeshes_1 = subMeshes; _a < subMeshes_1.length; _a++) {
                    var subMesh = subMeshes_1[_a];
                    subMesh.refreshBoundingInfo();
                }
            }
        }
    };
    /** @hidden */
    Geometry.prototype._bind = function (effect, indexToBind) {
        if (!effect) {
            return;
        }
        if (indexToBind === undefined) {
            indexToBind = this._indexBuffer;
        }
        var vbs = this.getVertexBuffers();
        if (!vbs) {
            return;
        }
        if (indexToBind != this._indexBuffer || !this._vertexArrayObjects) {
            this._engine.bindBuffers(vbs, indexToBind, effect);
            return;
        }
        // Using VAO
        if (!this._vertexArrayObjects[effect.key]) {
            this._vertexArrayObjects[effect.key] = this._engine.recordVertexArrayObject(vbs, indexToBind, effect);
        }
        this._engine.bindVertexArrayObject(this._vertexArrayObjects[effect.key], indexToBind);
    };
    /**
     * Gets total number of vertices
     * @returns the total number of vertices
     */
    Geometry.prototype.getTotalVertices = function () {
        if (!this.isReady()) {
            return 0;
        }
        return this._totalVertices;
    };
    /**
     * Gets a specific vertex data attached to this geometry. Float data is constructed if the vertex buffer data cannot be returned directly.
     * @param kind defines the data kind (Position, normal, etc...)
     * @param copyWhenShared defines if the returned array must be cloned upon returning it if the current geometry is shared between multiple meshes
     * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
     * @returns a float array containing vertex data
     */
    Geometry.prototype.getVerticesData = function (kind, copyWhenShared, forceCopy) {
        var vertexBuffer = this.getVertexBuffer(kind);
        if (!vertexBuffer) {
            return null;
        }
        var data = vertexBuffer.getData();
        if (!data) {
            return null;
        }
        var tightlyPackedByteStride = vertexBuffer.getSize() * VertexBuffer.GetTypeByteLength(vertexBuffer.type);
        var count = this._totalVertices * vertexBuffer.getSize();
        if (vertexBuffer.type !== VertexBuffer.FLOAT || vertexBuffer.byteStride !== tightlyPackedByteStride) {
            var copy_1 = [];
            vertexBuffer.forEach(count, function (value) { return copy_1.push(value); });
            return copy_1;
        }
        if (!(data instanceof Array || data instanceof Float32Array) || vertexBuffer.byteOffset !== 0 || data.length !== count) {
            if (data instanceof Array) {
                var offset = vertexBuffer.byteOffset / 4;
                return Tools.Slice(data, offset, offset + count);
            }
            else if (data instanceof ArrayBuffer) {
                return new Float32Array(data, vertexBuffer.byteOffset, count);
            }
            else {
                var offset = data.byteOffset + vertexBuffer.byteOffset;
                if (forceCopy || (copyWhenShared && this._meshes.length !== 1)) {
                    var result = new Float32Array(count);
                    var source = new Float32Array(data.buffer, offset, count);
                    result.set(source);
                    return result;
                }
                // Portect against bad data
                var remainder = offset % 4;
                if (remainder) {
                    offset = Math.max(0, offset - remainder);
                }
                return new Float32Array(data.buffer, offset, count);
            }
        }
        if (forceCopy || (copyWhenShared && this._meshes.length !== 1)) {
            return Tools.Slice(data);
        }
        return data;
    };
    /**
     * Returns a boolean defining if the vertex data for the requested `kind` is updatable
     * @param kind defines the data kind (Position, normal, etc...)
     * @returns true if the vertex buffer with the specified kind is updatable
     */
    Geometry.prototype.isVertexBufferUpdatable = function (kind) {
        var vb = this._vertexBuffers[kind];
        if (!vb) {
            return false;
        }
        return vb.isUpdatable();
    };
    /**
     * Gets a specific vertex buffer
     * @param kind defines the data kind (Position, normal, etc...)
     * @returns a VertexBuffer
     */
    Geometry.prototype.getVertexBuffer = function (kind) {
        if (!this.isReady()) {
            return null;
        }
        return this._vertexBuffers[kind];
    };
    /**
     * Returns all vertex buffers
     * @return an object holding all vertex buffers indexed by kind
     */
    Geometry.prototype.getVertexBuffers = function () {
        if (!this.isReady()) {
            return null;
        }
        return this._vertexBuffers;
    };
    /**
     * Gets a boolean indicating if specific vertex buffer is present
     * @param kind defines the data kind (Position, normal, etc...)
     * @returns true if data is present
     */
    Geometry.prototype.isVerticesDataPresent = function (kind) {
        if (!this._vertexBuffers) {
            if (this._delayInfo) {
                return this._delayInfo.indexOf(kind) !== -1;
            }
            return false;
        }
        return this._vertexBuffers[kind] !== undefined;
    };
    /**
     * Gets a list of all attached data kinds (Position, normal, etc...)
     * @returns a list of string containing all kinds
     */
    Geometry.prototype.getVerticesDataKinds = function () {
        var result = [];
        var kind;
        if (!this._vertexBuffers && this._delayInfo) {
            for (kind in this._delayInfo) {
                result.push(kind);
            }
        }
        else {
            for (kind in this._vertexBuffers) {
                result.push(kind);
            }
        }
        return result;
    };
    /**
     * Update index buffer
     * @param indices defines the indices to store in the index buffer
     * @param offset defines the offset in the target buffer where to store the data
     * @param gpuMemoryOnly defines a boolean indicating that only the GPU memory must be updated leaving the CPU version of the indices unchanged (false by default)
     */
    Geometry.prototype.updateIndices = function (indices, offset, gpuMemoryOnly) {
        if (gpuMemoryOnly === void 0) { gpuMemoryOnly = false; }
        if (!this._indexBuffer) {
            return;
        }
        if (!this._indexBufferIsUpdatable) {
            this.setIndices(indices, null, true);
        }
        else {
            var needToUpdateSubMeshes = indices.length !== this._indices.length;
            if (!gpuMemoryOnly) {
                this._indices = indices.slice();
            }
            this._engine.updateDynamicIndexBuffer(this._indexBuffer, indices, offset);
            if (needToUpdateSubMeshes) {
                for (var _i = 0, _a = this._meshes; _i < _a.length; _i++) {
                    var mesh = _a[_i];
                    mesh._createGlobalSubMesh(true);
                }
            }
        }
    };
    /**
     * Creates a new index buffer
     * @param indices defines the indices to store in the index buffer
     * @param totalVertices defines the total number of vertices (could be null)
     * @param updatable defines if the index buffer must be flagged as updatable (false by default)
     */
    Geometry.prototype.setIndices = function (indices, totalVertices, updatable) {
        if (totalVertices === void 0) { totalVertices = null; }
        if (updatable === void 0) { updatable = false; }
        if (this._indexBuffer) {
            this._engine._releaseBuffer(this._indexBuffer);
        }
        this._disposeVertexArrayObjects();
        this._indices = indices;
        this._indexBufferIsUpdatable = updatable;
        if (this._meshes.length !== 0 && this._indices) {
            this._indexBuffer = this._engine.createIndexBuffer(this._indices, updatable);
        }
        if (totalVertices != undefined) {
            // including null and undefined
            this._totalVertices = totalVertices;
        }
        for (var _i = 0, _a = this._meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            mesh._createGlobalSubMesh(true);
        }
        this.notifyUpdate();
    };
    /**
     * Return the total number of indices
     * @returns the total number of indices
     */
    Geometry.prototype.getTotalIndices = function () {
        if (!this.isReady()) {
            return 0;
        }
        return this._indices.length;
    };
    /**
     * Gets the index buffer array
     * @param copyWhenShared defines if the returned array must be cloned upon returning it if the current geometry is shared between multiple meshes
     * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
     * @returns the index buffer array
     */
    Geometry.prototype.getIndices = function (copyWhenShared, forceCopy) {
        if (!this.isReady()) {
            return null;
        }
        var orig = this._indices;
        if (!forceCopy && (!copyWhenShared || this._meshes.length === 1)) {
            return orig;
        }
        else {
            var len = orig.length;
            var copy = [];
            for (var i = 0; i < len; i++) {
                copy.push(orig[i]);
            }
            return copy;
        }
    };
    /**
     * Gets the index buffer
     * @return the index buffer
     */
    Geometry.prototype.getIndexBuffer = function () {
        if (!this.isReady()) {
            return null;
        }
        return this._indexBuffer;
    };
    /** @hidden */
    Geometry.prototype._releaseVertexArrayObject = function (effect) {
        if (effect === void 0) { effect = null; }
        if (!effect || !this._vertexArrayObjects) {
            return;
        }
        if (this._vertexArrayObjects[effect.key]) {
            this._engine.releaseVertexArrayObject(this._vertexArrayObjects[effect.key]);
            delete this._vertexArrayObjects[effect.key];
        }
    };
    /**
     * Release the associated resources for a specific mesh
     * @param mesh defines the source mesh
     * @param shouldDispose defines if the geometry must be disposed if there is no more mesh pointing to it
     */
    Geometry.prototype.releaseForMesh = function (mesh, shouldDispose) {
        var meshes = this._meshes;
        var index = meshes.indexOf(mesh);
        if (index === -1) {
            return;
        }
        meshes.splice(index, 1);
        mesh._geometry = null;
        if (meshes.length === 0 && shouldDispose) {
            this.dispose();
        }
    };
    /**
     * Apply current geometry to a given mesh
     * @param mesh defines the mesh to apply geometry to
     */
    Geometry.prototype.applyToMesh = function (mesh) {
        if (mesh._geometry === this) {
            return;
        }
        var previousGeometry = mesh._geometry;
        if (previousGeometry) {
            previousGeometry.releaseForMesh(mesh);
        }
        var meshes = this._meshes;
        // must be done before setting vertexBuffers because of mesh._createGlobalSubMesh()
        mesh._geometry = this;
        this._scene.pushGeometry(this);
        meshes.push(mesh);
        if (this.isReady()) {
            this._applyToMesh(mesh);
        }
        else {
            mesh._boundingInfo = this._boundingInfo;
        }
    };
    Geometry.prototype._updateExtend = function (data) {
        if (data === void 0) { data = null; }
        if (this.useBoundingInfoFromGeometry && this._boundingInfo) {
            this._extend = {
                minimum: this._boundingInfo.minimum.clone(),
                maximum: this._boundingInfo.maximum.clone(),
            };
        }
        else {
            if (!data) {
                data = this.getVerticesData(VertexBuffer.PositionKind);
            }
            this._extend = extractMinAndMax(data, 0, this._totalVertices, this.boundingBias, 3);
        }
    };
    Geometry.prototype._applyToMesh = function (mesh) {
        var numOfMeshes = this._meshes.length;
        // vertexBuffers
        for (var kind in this._vertexBuffers) {
            if (numOfMeshes === 1) {
                this._vertexBuffers[kind].create();
            }
            var buffer = this._vertexBuffers[kind].getBuffer();
            if (buffer) {
                buffer.references = numOfMeshes;
            }
            if (kind === VertexBuffer.PositionKind) {
                if (!this._extend) {
                    this._updateExtend();
                }
                mesh._boundingInfo = new BoundingInfo(this._extend.minimum, this._extend.maximum);
                mesh._createGlobalSubMesh(false);
                //bounding info was just created again, world matrix should be applied again.
                mesh._updateBoundingInfo();
            }
        }
        // indexBuffer
        if (numOfMeshes === 1 && this._indices && this._indices.length > 0) {
            this._indexBuffer = this._engine.createIndexBuffer(this._indices);
        }
        if (this._indexBuffer) {
            this._indexBuffer.references = numOfMeshes;
        }
        // morphTargets
        mesh._syncGeometryWithMorphTargetManager();
        // instances
        mesh.synchronizeInstances();
    };
    Geometry.prototype.notifyUpdate = function (kind) {
        if (this.onGeometryUpdated) {
            this.onGeometryUpdated(this, kind);
        }
        for (var _i = 0, _a = this._meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            mesh._markSubMeshesAsAttributesDirty();
        }
    };
    /**
     * Load the geometry if it was flagged as delay loaded
     * @param scene defines the hosting scene
     * @param onLoaded defines a callback called when the geometry is loaded
     */
    Geometry.prototype.load = function (scene, onLoaded) {
        if (this.delayLoadState === 2) {
            return;
        }
        if (this.isReady()) {
            if (onLoaded) {
                onLoaded();
            }
            return;
        }
        this.delayLoadState = 2;
        this._queueLoad(scene, onLoaded);
    };
    Geometry.prototype._queueLoad = function (scene, onLoaded) {
        var _this = this;
        if (!this.delayLoadingFile) {
            return;
        }
        scene._addPendingData(this);
        scene._loadFile(this.delayLoadingFile, function (data) {
            if (!_this._delayLoadingFunction) {
                return;
            }
            _this._delayLoadingFunction(JSON.parse(data), _this);
            _this.delayLoadState = 1;
            _this._delayInfo = [];
            scene._removePendingData(_this);
            var meshes = _this._meshes;
            var numOfMeshes = meshes.length;
            for (var index = 0; index < numOfMeshes; index++) {
                _this._applyToMesh(meshes[index]);
            }
            if (onLoaded) {
                onLoaded();
            }
        }, undefined, true);
    };
    /**
     * Invert the geometry to move from a right handed system to a left handed one.
     */
    Geometry.prototype.toLeftHanded = function () {
        // Flip faces
        var tIndices = this.getIndices(false);
        if (tIndices != null && tIndices.length > 0) {
            for (var i = 0; i < tIndices.length; i += 3) {
                var tTemp = tIndices[i + 0];
                tIndices[i + 0] = tIndices[i + 2];
                tIndices[i + 2] = tTemp;
            }
            this.setIndices(tIndices);
        }
        // Negate position.z
        var tPositions = this.getVerticesData(VertexBuffer.PositionKind, false);
        if (tPositions != null && tPositions.length > 0) {
            for (var i = 0; i < tPositions.length; i += 3) {
                tPositions[i + 2] = -tPositions[i + 2];
            }
            this.setVerticesData(VertexBuffer.PositionKind, tPositions, false);
        }
        // Negate normal.z
        var tNormals = this.getVerticesData(VertexBuffer.NormalKind, false);
        if (tNormals != null && tNormals.length > 0) {
            for (var i = 0; i < tNormals.length; i += 3) {
                tNormals[i + 2] = -tNormals[i + 2];
            }
            this.setVerticesData(VertexBuffer.NormalKind, tNormals, false);
        }
    };
    // Cache
    /** @hidden */
    Geometry.prototype._resetPointsArrayCache = function () {
        this._positions = null;
    };
    /** @hidden */
    Geometry.prototype._generatePointsArray = function () {
        if (this._positions) {
            return true;
        }
        var data = this.getVerticesData(VertexBuffer.PositionKind);
        if (!data || data.length === 0) {
            return false;
        }
        for (var index = this._positionsCache.length * 3, arrayIdx = this._positionsCache.length; index < data.length; index += 3, ++arrayIdx) {
            this._positionsCache[arrayIdx] = Vector3.FromArray(data, index);
        }
        for (var index = 0, arrayIdx = 0; index < data.length; index += 3, ++arrayIdx) {
            this._positionsCache[arrayIdx].set(data[0 + index], data[1 + index], data[2 + index]);
        }
        // just in case the number of positions was reduced, splice the array
        this._positionsCache.length = data.length / 3;
        this._positions = this._positionsCache;
        return true;
    };
    /**
     * Gets a value indicating if the geometry is disposed
     * @returns true if the geometry was disposed
     */
    Geometry.prototype.isDisposed = function () {
        return this._isDisposed;
    };
    Geometry.prototype._disposeVertexArrayObjects = function () {
        if (this._vertexArrayObjects) {
            for (var kind in this._vertexArrayObjects) {
                this._engine.releaseVertexArrayObject(this._vertexArrayObjects[kind]);
            }
            this._vertexArrayObjects = {};
        }
    };
    /**
     * Free all associated resources
     */
    Geometry.prototype.dispose = function () {
        var meshes = this._meshes;
        var numOfMeshes = meshes.length;
        var index;
        for (index = 0; index < numOfMeshes; index++) {
            this.releaseForMesh(meshes[index]);
        }
        this._meshes = [];
        this._disposeVertexArrayObjects();
        for (var kind in this._vertexBuffers) {
            this._vertexBuffers[kind].dispose();
        }
        this._vertexBuffers = {};
        this._totalVertices = 0;
        if (this._indexBuffer) {
            this._engine._releaseBuffer(this._indexBuffer);
        }
        this._indexBuffer = null;
        this._indices = [];
        this.delayLoadState = 0;
        this.delayLoadingFile = null;
        this._delayLoadingFunction = null;
        this._delayInfo = [];
        this._boundingInfo = null;
        this._scene.removeGeometry(this);
        this._isDisposed = true;
    };
    /**
     * Clone the current geometry into a new geometry
     * @param id defines the unique ID of the new geometry
     * @returns a new geometry object
     */
    Geometry.prototype.copy = function (id) {
        var vertexData = new VertexData();
        vertexData.indices = [];
        var indices = this.getIndices();
        if (indices) {
            for (var index = 0; index < indices.length; index++) {
                vertexData.indices.push(indices[index]);
            }
        }
        var updatable = false;
        var stopChecking = false;
        var kind;
        for (kind in this._vertexBuffers) {
            // using slice() to make a copy of the array and not just reference it
            var data = this.getVerticesData(kind);
            if (data) {
                if (data instanceof Float32Array) {
                    vertexData.set(new Float32Array(data), kind);
                }
                else {
                    vertexData.set(data.slice(0), kind);
                }
                if (!stopChecking) {
                    var vb = this.getVertexBuffer(kind);
                    if (vb) {
                        updatable = vb.isUpdatable();
                        stopChecking = !updatable;
                    }
                }
            }
        }
        var geometry = new Geometry(id, this._scene, vertexData, updatable);
        geometry.delayLoadState = this.delayLoadState;
        geometry.delayLoadingFile = this.delayLoadingFile;
        geometry._delayLoadingFunction = this._delayLoadingFunction;
        for (kind in this._delayInfo) {
            geometry._delayInfo = geometry._delayInfo || [];
            geometry._delayInfo.push(kind);
        }
        // Bounding info
        geometry._boundingInfo = new BoundingInfo(this._extend.minimum, this._extend.maximum);
        return geometry;
    };
    /**
     * Serialize the current geometry info (and not the vertices data) into a JSON object
     * @return a JSON representation of the current geometry data (without the vertices data)
     */
    Geometry.prototype.serialize = function () {
        var serializationObject = {};
        serializationObject.id = this.id;
        serializationObject.updatable = this._updatable;
        if (Tags && Tags.HasTags(this)) {
            serializationObject.tags = Tags.GetTags(this);
        }
        return serializationObject;
    };
    Geometry.prototype.toNumberArray = function (origin) {
        if (Array.isArray(origin)) {
            return origin;
        }
        else {
            return Array.prototype.slice.call(origin);
        }
    };
    /**
     * Serialize all vertices data into a JSON oject
     * @returns a JSON representation of the current geometry data
     */
    Geometry.prototype.serializeVerticeData = function () {
        var serializationObject = this.serialize();
        if (this.isVerticesDataPresent(VertexBuffer.PositionKind)) {
            serializationObject.positions = this.toNumberArray(this.getVerticesData(VertexBuffer.PositionKind));
            if (this.isVertexBufferUpdatable(VertexBuffer.PositionKind)) {
                serializationObject.positions._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.NormalKind)) {
            serializationObject.normals = this.toNumberArray(this.getVerticesData(VertexBuffer.NormalKind));
            if (this.isVertexBufferUpdatable(VertexBuffer.NormalKind)) {
                serializationObject.normals._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.TangentKind)) {
            serializationObject.tangets = this.toNumberArray(this.getVerticesData(VertexBuffer.TangentKind));
            if (this.isVertexBufferUpdatable(VertexBuffer.TangentKind)) {
                serializationObject.tangets._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.UVKind)) {
            serializationObject.uvs = this.toNumberArray(this.getVerticesData(VertexBuffer.UVKind));
            if (this.isVertexBufferUpdatable(VertexBuffer.UVKind)) {
                serializationObject.uvs._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.UV2Kind)) {
            serializationObject.uv2s = this.toNumberArray(this.getVerticesData(VertexBuffer.UV2Kind));
            if (this.isVertexBufferUpdatable(VertexBuffer.UV2Kind)) {
                serializationObject.uv2s._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.UV3Kind)) {
            serializationObject.uv3s = this.toNumberArray(this.getVerticesData(VertexBuffer.UV3Kind));
            if (this.isVertexBufferUpdatable(VertexBuffer.UV3Kind)) {
                serializationObject.uv3s._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.UV4Kind)) {
            serializationObject.uv4s = this.toNumberArray(this.getVerticesData(VertexBuffer.UV4Kind));
            if (this.isVertexBufferUpdatable(VertexBuffer.UV4Kind)) {
                serializationObject.uv4s._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.UV5Kind)) {
            serializationObject.uv5s = this.toNumberArray(this.getVerticesData(VertexBuffer.UV5Kind));
            if (this.isVertexBufferUpdatable(VertexBuffer.UV5Kind)) {
                serializationObject.uv5s._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.UV6Kind)) {
            serializationObject.uv6s = this.toNumberArray(this.getVerticesData(VertexBuffer.UV6Kind));
            if (this.isVertexBufferUpdatable(VertexBuffer.UV6Kind)) {
                serializationObject.uv6s._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.ColorKind)) {
            serializationObject.colors = this.toNumberArray(this.getVerticesData(VertexBuffer.ColorKind));
            if (this.isVertexBufferUpdatable(VertexBuffer.ColorKind)) {
                serializationObject.colors._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.MatricesIndicesKind)) {
            serializationObject.matricesIndices = this.toNumberArray(this.getVerticesData(VertexBuffer.MatricesIndicesKind));
            serializationObject.matricesIndices._isExpanded = true;
            if (this.isVertexBufferUpdatable(VertexBuffer.MatricesIndicesKind)) {
                serializationObject.matricesIndices._updatable = true;
            }
        }
        if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
            serializationObject.matricesWeights = this.toNumberArray(this.getVerticesData(VertexBuffer.MatricesWeightsKind));
            if (this.isVertexBufferUpdatable(VertexBuffer.MatricesWeightsKind)) {
                serializationObject.matricesWeights._updatable = true;
            }
        }
        serializationObject.indices = this.toNumberArray(this.getIndices());
        return serializationObject;
    };
    // Statics
    /**
     * Extracts a clone of a mesh geometry
     * @param mesh defines the source mesh
     * @param id defines the unique ID of the new geometry object
     * @returns the new geometry object
     */
    Geometry.ExtractFromMesh = function (mesh, id) {
        var geometry = mesh._geometry;
        if (!geometry) {
            return null;
        }
        return geometry.copy(id);
    };
    /**
     * You should now use Tools.RandomId(), this method is still here for legacy reasons.
     * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
     * Be aware Math.random() could cause collisions, but:
     * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
     * @returns a string containing a new GUID
     */
    Geometry.RandomId = function () {
        return Tools.RandomId();
    };
    /** @hidden */
    Geometry._ImportGeometry = function (parsedGeometry, mesh) {
        var scene = mesh.getScene();
        // Geometry
        var geometryId = parsedGeometry.geometryId;
        if (geometryId) {
            var geometry = scene.getGeometryByID(geometryId);
            if (geometry) {
                geometry.applyToMesh(mesh);
            }
        }
        else if (parsedGeometry instanceof ArrayBuffer) {
            var binaryInfo = mesh._binaryInfo;
            if (binaryInfo.positionsAttrDesc && binaryInfo.positionsAttrDesc.count > 0) {
                var positionsData = new Float32Array(parsedGeometry, binaryInfo.positionsAttrDesc.offset, binaryInfo.positionsAttrDesc.count);
                mesh.setVerticesData(VertexBuffer.PositionKind, positionsData, false);
            }
            if (binaryInfo.normalsAttrDesc && binaryInfo.normalsAttrDesc.count > 0) {
                var normalsData = new Float32Array(parsedGeometry, binaryInfo.normalsAttrDesc.offset, binaryInfo.normalsAttrDesc.count);
                mesh.setVerticesData(VertexBuffer.NormalKind, normalsData, false);
            }
            if (binaryInfo.tangetsAttrDesc && binaryInfo.tangetsAttrDesc.count > 0) {
                var tangentsData = new Float32Array(parsedGeometry, binaryInfo.tangetsAttrDesc.offset, binaryInfo.tangetsAttrDesc.count);
                mesh.setVerticesData(VertexBuffer.TangentKind, tangentsData, false);
            }
            if (binaryInfo.uvsAttrDesc && binaryInfo.uvsAttrDesc.count > 0) {
                var uvsData = new Float32Array(parsedGeometry, binaryInfo.uvsAttrDesc.offset, binaryInfo.uvsAttrDesc.count);
                mesh.setVerticesData(VertexBuffer.UVKind, uvsData, false);
            }
            if (binaryInfo.uvs2AttrDesc && binaryInfo.uvs2AttrDesc.count > 0) {
                var uvs2Data = new Float32Array(parsedGeometry, binaryInfo.uvs2AttrDesc.offset, binaryInfo.uvs2AttrDesc.count);
                mesh.setVerticesData(VertexBuffer.UV2Kind, uvs2Data, false);
            }
            if (binaryInfo.uvs3AttrDesc && binaryInfo.uvs3AttrDesc.count > 0) {
                var uvs3Data = new Float32Array(parsedGeometry, binaryInfo.uvs3AttrDesc.offset, binaryInfo.uvs3AttrDesc.count);
                mesh.setVerticesData(VertexBuffer.UV3Kind, uvs3Data, false);
            }
            if (binaryInfo.uvs4AttrDesc && binaryInfo.uvs4AttrDesc.count > 0) {
                var uvs4Data = new Float32Array(parsedGeometry, binaryInfo.uvs4AttrDesc.offset, binaryInfo.uvs4AttrDesc.count);
                mesh.setVerticesData(VertexBuffer.UV4Kind, uvs4Data, false);
            }
            if (binaryInfo.uvs5AttrDesc && binaryInfo.uvs5AttrDesc.count > 0) {
                var uvs5Data = new Float32Array(parsedGeometry, binaryInfo.uvs5AttrDesc.offset, binaryInfo.uvs5AttrDesc.count);
                mesh.setVerticesData(VertexBuffer.UV5Kind, uvs5Data, false);
            }
            if (binaryInfo.uvs6AttrDesc && binaryInfo.uvs6AttrDesc.count > 0) {
                var uvs6Data = new Float32Array(parsedGeometry, binaryInfo.uvs6AttrDesc.offset, binaryInfo.uvs6AttrDesc.count);
                mesh.setVerticesData(VertexBuffer.UV6Kind, uvs6Data, false);
            }
            if (binaryInfo.colorsAttrDesc && binaryInfo.colorsAttrDesc.count > 0) {
                var colorsData = new Float32Array(parsedGeometry, binaryInfo.colorsAttrDesc.offset, binaryInfo.colorsAttrDesc.count);
                mesh.setVerticesData(VertexBuffer.ColorKind, colorsData, false, binaryInfo.colorsAttrDesc.stride);
            }
            if (binaryInfo.matricesIndicesAttrDesc && binaryInfo.matricesIndicesAttrDesc.count > 0) {
                var matricesIndicesData = new Int32Array(parsedGeometry, binaryInfo.matricesIndicesAttrDesc.offset, binaryInfo.matricesIndicesAttrDesc.count);
                var floatIndices = [];
                for (var i = 0; i < matricesIndicesData.length; i++) {
                    var index = matricesIndicesData[i];
                    floatIndices.push(index & 0x000000ff);
                    floatIndices.push((index & 0x0000ff00) >> 8);
                    floatIndices.push((index & 0x00ff0000) >> 16);
                    floatIndices.push((index >> 24) & 0xff); // & 0xFF to convert to v + 256 if v < 0
                }
                mesh.setVerticesData(VertexBuffer.MatricesIndicesKind, floatIndices, false);
            }
            if (binaryInfo.matricesIndicesExtraAttrDesc && binaryInfo.matricesIndicesExtraAttrDesc.count > 0) {
                var matricesIndicesData = new Int32Array(parsedGeometry, binaryInfo.matricesIndicesExtraAttrDesc.offset, binaryInfo.matricesIndicesExtraAttrDesc.count);
                var floatIndices = [];
                for (var i = 0; i < matricesIndicesData.length; i++) {
                    var index = matricesIndicesData[i];
                    floatIndices.push(index & 0x000000ff);
                    floatIndices.push((index & 0x0000ff00) >> 8);
                    floatIndices.push((index & 0x00ff0000) >> 16);
                    floatIndices.push((index >> 24) & 0xff); // & 0xFF to convert to v + 256 if v < 0
                }
                mesh.setVerticesData(VertexBuffer.MatricesIndicesExtraKind, floatIndices, false);
            }
            if (binaryInfo.matricesWeightsAttrDesc && binaryInfo.matricesWeightsAttrDesc.count > 0) {
                var matricesWeightsData = new Float32Array(parsedGeometry, binaryInfo.matricesWeightsAttrDesc.offset, binaryInfo.matricesWeightsAttrDesc.count);
                mesh.setVerticesData(VertexBuffer.MatricesWeightsKind, matricesWeightsData, false);
            }
            if (binaryInfo.indicesAttrDesc && binaryInfo.indicesAttrDesc.count > 0) {
                var indicesData = new Int32Array(parsedGeometry, binaryInfo.indicesAttrDesc.offset, binaryInfo.indicesAttrDesc.count);
                mesh.setIndices(indicesData, null);
            }
            if (binaryInfo.subMeshesAttrDesc && binaryInfo.subMeshesAttrDesc.count > 0) {
                var subMeshesData = new Int32Array(parsedGeometry, binaryInfo.subMeshesAttrDesc.offset, binaryInfo.subMeshesAttrDesc.count * 5);
                mesh.subMeshes = [];
                for (var i = 0; i < binaryInfo.subMeshesAttrDesc.count; i++) {
                    var materialIndex = subMeshesData[i * 5 + 0];
                    var verticesStart = subMeshesData[i * 5 + 1];
                    var verticesCount = subMeshesData[i * 5 + 2];
                    var indexStart = subMeshesData[i * 5 + 3];
                    var indexCount = subMeshesData[i * 5 + 4];
                    SubMesh.AddToMesh(materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh);
                }
            }
        }
        else if (parsedGeometry.positions && parsedGeometry.normals && parsedGeometry.indices) {
            mesh.setVerticesData(VertexBuffer.PositionKind, parsedGeometry.positions, parsedGeometry.positions._updatable);
            mesh.setVerticesData(VertexBuffer.NormalKind, parsedGeometry.normals, parsedGeometry.normals._updatable);
            if (parsedGeometry.tangents) {
                mesh.setVerticesData(VertexBuffer.TangentKind, parsedGeometry.tangents, parsedGeometry.tangents._updatable);
            }
            if (parsedGeometry.uvs) {
                mesh.setVerticesData(VertexBuffer.UVKind, parsedGeometry.uvs, parsedGeometry.uvs._updatable);
            }
            if (parsedGeometry.uvs2) {
                mesh.setVerticesData(VertexBuffer.UV2Kind, parsedGeometry.uvs2, parsedGeometry.uvs2._updatable);
            }
            if (parsedGeometry.uvs3) {
                mesh.setVerticesData(VertexBuffer.UV3Kind, parsedGeometry.uvs3, parsedGeometry.uvs3._updatable);
            }
            if (parsedGeometry.uvs4) {
                mesh.setVerticesData(VertexBuffer.UV4Kind, parsedGeometry.uvs4, parsedGeometry.uvs4._updatable);
            }
            if (parsedGeometry.uvs5) {
                mesh.setVerticesData(VertexBuffer.UV5Kind, parsedGeometry.uvs5, parsedGeometry.uvs5._updatable);
            }
            if (parsedGeometry.uvs6) {
                mesh.setVerticesData(VertexBuffer.UV6Kind, parsedGeometry.uvs6, parsedGeometry.uvs6._updatable);
            }
            if (parsedGeometry.colors) {
                mesh.setVerticesData(VertexBuffer.ColorKind, Color4.CheckColors4(parsedGeometry.colors, parsedGeometry.positions.length / 3), parsedGeometry.colors._updatable);
            }
            if (parsedGeometry.matricesIndices) {
                if (!parsedGeometry.matricesIndices._isExpanded) {
                    var floatIndices = [];
                    for (var i = 0; i < parsedGeometry.matricesIndices.length; i++) {
                        var matricesIndex = parsedGeometry.matricesIndices[i];
                        floatIndices.push(matricesIndex & 0x000000ff);
                        floatIndices.push((matricesIndex & 0x0000ff00) >> 8);
                        floatIndices.push((matricesIndex & 0x00ff0000) >> 16);
                        floatIndices.push((matricesIndex >> 24) & 0xff); // & 0xFF to convert to v + 256 if v < 0
                    }
                    mesh.setVerticesData(VertexBuffer.MatricesIndicesKind, floatIndices, parsedGeometry.matricesIndices._updatable);
                }
                else {
                    delete parsedGeometry.matricesIndices._isExpanded;
                    mesh.setVerticesData(VertexBuffer.MatricesIndicesKind, parsedGeometry.matricesIndices, parsedGeometry.matricesIndices._updatable);
                }
            }
            if (parsedGeometry.matricesIndicesExtra) {
                if (!parsedGeometry.matricesIndicesExtra._isExpanded) {
                    var floatIndices = [];
                    for (var i = 0; i < parsedGeometry.matricesIndicesExtra.length; i++) {
                        var matricesIndex = parsedGeometry.matricesIndicesExtra[i];
                        floatIndices.push(matricesIndex & 0x000000ff);
                        floatIndices.push((matricesIndex & 0x0000ff00) >> 8);
                        floatIndices.push((matricesIndex & 0x00ff0000) >> 16);
                        floatIndices.push((matricesIndex >> 24) & 0xff); // & 0xFF to convert to v + 256 if v < 0
                    }
                    mesh.setVerticesData(VertexBuffer.MatricesIndicesExtraKind, floatIndices, parsedGeometry.matricesIndicesExtra._updatable);
                }
                else {
                    delete parsedGeometry.matricesIndices._isExpanded;
                    mesh.setVerticesData(VertexBuffer.MatricesIndicesExtraKind, parsedGeometry.matricesIndicesExtra, parsedGeometry.matricesIndicesExtra._updatable);
                }
            }
            if (parsedGeometry.matricesWeights) {
                Geometry._CleanMatricesWeights(parsedGeometry, mesh);
                mesh.setVerticesData(VertexBuffer.MatricesWeightsKind, parsedGeometry.matricesWeights, parsedGeometry.matricesWeights._updatable);
            }
            if (parsedGeometry.matricesWeightsExtra) {
                mesh.setVerticesData(VertexBuffer.MatricesWeightsExtraKind, parsedGeometry.matricesWeightsExtra, parsedGeometry.matricesWeights._updatable);
            }
            mesh.setIndices(parsedGeometry.indices, null);
        }
        // SubMeshes
        if (parsedGeometry.subMeshes) {
            mesh.subMeshes = [];
            for (var subIndex = 0; subIndex < parsedGeometry.subMeshes.length; subIndex++) {
                var parsedSubMesh = parsedGeometry.subMeshes[subIndex];
                SubMesh.AddToMesh(parsedSubMesh.materialIndex, parsedSubMesh.verticesStart, parsedSubMesh.verticesCount, parsedSubMesh.indexStart, parsedSubMesh.indexCount, mesh);
            }
        }
        // Flat shading
        if (mesh._shouldGenerateFlatShading) {
            mesh.convertToFlatShadedMesh();
            mesh._shouldGenerateFlatShading = false;
        }
        // Update
        mesh.computeWorldMatrix(true);
        scene.onMeshImportedObservable.notifyObservers(mesh);
    };
    Geometry._CleanMatricesWeights = function (parsedGeometry, mesh) {
        var epsilon = 1e-3;
        if (!SceneLoaderFlags.CleanBoneMatrixWeights) {
            return;
        }
        var noInfluenceBoneIndex = 0.0;
        if (parsedGeometry.skeletonId > -1) {
            var skeleton = mesh.getScene().getLastSkeletonByID(parsedGeometry.skeletonId);
            if (!skeleton) {
                return;
            }
            noInfluenceBoneIndex = skeleton.bones.length;
        }
        else {
            return;
        }
        var matricesIndices = mesh.getVerticesData(VertexBuffer.MatricesIndicesKind);
        var matricesIndicesExtra = mesh.getVerticesData(VertexBuffer.MatricesIndicesExtraKind);
        var matricesWeights = parsedGeometry.matricesWeights;
        var matricesWeightsExtra = parsedGeometry.matricesWeightsExtra;
        var influencers = parsedGeometry.numBoneInfluencer;
        var size = matricesWeights.length;
        for (var i = 0; i < size; i += 4) {
            var weight = 0.0;
            var firstZeroWeight = -1;
            for (var j = 0; j < 4; j++) {
                var w = matricesWeights[i + j];
                weight += w;
                if (w < epsilon && firstZeroWeight < 0) {
                    firstZeroWeight = j;
                }
            }
            if (matricesWeightsExtra) {
                for (var j = 0; j < 4; j++) {
                    var w = matricesWeightsExtra[i + j];
                    weight += w;
                    if (w < epsilon && firstZeroWeight < 0) {
                        firstZeroWeight = j + 4;
                    }
                }
            }
            if (firstZeroWeight < 0 || firstZeroWeight > influencers - 1) {
                firstZeroWeight = influencers - 1;
            }
            if (weight > epsilon) {
                var mweight = 1.0 / weight;
                for (var j = 0; j < 4; j++) {
                    matricesWeights[i + j] *= mweight;
                }
                if (matricesWeightsExtra) {
                    for (var j = 0; j < 4; j++) {
                        matricesWeightsExtra[i + j] *= mweight;
                    }
                }
            }
            else {
                if (firstZeroWeight >= 4) {
                    matricesWeightsExtra[i + firstZeroWeight - 4] = 1.0 - weight;
                    matricesIndicesExtra[i + firstZeroWeight - 4] = noInfluenceBoneIndex;
                }
                else {
                    matricesWeights[i + firstZeroWeight] = 1.0 - weight;
                    matricesIndices[i + firstZeroWeight] = noInfluenceBoneIndex;
                }
            }
        }
        mesh.setVerticesData(VertexBuffer.MatricesIndicesKind, matricesIndices);
        if (parsedGeometry.matricesWeightsExtra) {
            mesh.setVerticesData(VertexBuffer.MatricesIndicesExtraKind, matricesIndicesExtra);
        }
    };
    /**
     * Create a new geometry from persisted data (Using .babylon file format)
     * @param parsedVertexData defines the persisted data
     * @param scene defines the hosting scene
     * @param rootUrl defines the root url to use to load assets (like delayed data)
     * @returns the new geometry object
     */
    Geometry.Parse = function (parsedVertexData, scene, rootUrl) {
        if (scene.getGeometryByID(parsedVertexData.id)) {
            return null; // null since geometry could be something else than a box...
        }
        var geometry = new Geometry(parsedVertexData.id, scene, undefined, parsedVertexData.updatable);
        if (Tags) {
            Tags.AddTagsTo(geometry, parsedVertexData.tags);
        }
        if (parsedVertexData.delayLoadingFile) {
            geometry.delayLoadState = 4;
            geometry.delayLoadingFile = rootUrl + parsedVertexData.delayLoadingFile;
            geometry._boundingInfo = new BoundingInfo(Vector3.FromArray(parsedVertexData.boundingBoxMinimum), Vector3.FromArray(parsedVertexData.boundingBoxMaximum));
            geometry._delayInfo = [];
            if (parsedVertexData.hasUVs) {
                geometry._delayInfo.push(VertexBuffer.UVKind);
            }
            if (parsedVertexData.hasUVs2) {
                geometry._delayInfo.push(VertexBuffer.UV2Kind);
            }
            if (parsedVertexData.hasUVs3) {
                geometry._delayInfo.push(VertexBuffer.UV3Kind);
            }
            if (parsedVertexData.hasUVs4) {
                geometry._delayInfo.push(VertexBuffer.UV4Kind);
            }
            if (parsedVertexData.hasUVs5) {
                geometry._delayInfo.push(VertexBuffer.UV5Kind);
            }
            if (parsedVertexData.hasUVs6) {
                geometry._delayInfo.push(VertexBuffer.UV6Kind);
            }
            if (parsedVertexData.hasColors) {
                geometry._delayInfo.push(VertexBuffer.ColorKind);
            }
            if (parsedVertexData.hasMatricesIndices) {
                geometry._delayInfo.push(VertexBuffer.MatricesIndicesKind);
            }
            if (parsedVertexData.hasMatricesWeights) {
                geometry._delayInfo.push(VertexBuffer.MatricesWeightsKind);
            }
            geometry._delayLoadingFunction = VertexData.ImportVertexData;
        }
        else {
            VertexData.ImportVertexData(parsedVertexData, geometry);
        }
        scene.pushGeometry(geometry, true);
        return geometry;
    };
    return Geometry;
}());

/**
 * A multi-material is used to apply different materials to different parts of the same object without the need of
 * separate meshes. This can be use to improve performances.
 * @see https://doc.babylonjs.com/how_to/multi_materials
 */
var MultiMaterial = /** @class */ (function (_super) {
    __extends(MultiMaterial, _super);
    /**
     * Instantiates a new Multi Material
     * A multi-material is used to apply different materials to different parts of the same object without the need of
     * separate meshes. This can be use to improve performances.
     * @see https://doc.babylonjs.com/how_to/multi_materials
     * @param name Define the name in the scene
     * @param scene Define the scene the material belongs to
     */
    function MultiMaterial(name, scene) {
        var _this = _super.call(this, name, scene, true) || this;
        scene.multiMaterials.push(_this);
        _this.subMaterials = new Array();
        _this._storeEffectOnSubMeshes = true; // multimaterial is considered like a push material
        return _this;
    }
    Object.defineProperty(MultiMaterial.prototype, "subMaterials", {
        /**
         * Gets or Sets the list of Materials used within the multi material.
         * They need to be ordered according to the submeshes order in the associated mesh
         */
        get: function () {
            return this._subMaterials;
        },
        set: function (value) {
            this._subMaterials = value;
            this._hookArray(value);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Function used to align with Node.getChildren()
     * @returns the list of Materials used within the multi material
     */
    MultiMaterial.prototype.getChildren = function () {
        return this.subMaterials;
    };
    MultiMaterial.prototype._hookArray = function (array) {
        var _this = this;
        var oldPush = array.push;
        array.push = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            var result = oldPush.apply(array, items);
            _this._markAllSubMeshesAsTexturesDirty();
            return result;
        };
        var oldSplice = array.splice;
        array.splice = function (index, deleteCount) {
            var deleted = oldSplice.apply(array, [index, deleteCount]);
            _this._markAllSubMeshesAsTexturesDirty();
            return deleted;
        };
    };
    /**
     * Get one of the submaterial by its index in the submaterials array
     * @param index The index to look the sub material at
     * @returns The Material if the index has been defined
     */
    MultiMaterial.prototype.getSubMaterial = function (index) {
        if (index < 0 || index >= this.subMaterials.length) {
            return this.getScene().defaultMaterial;
        }
        return this.subMaterials[index];
    };
    /**
     * Get the list of active textures for the whole sub materials list.
     * @returns All the textures that will be used during the rendering
     */
    MultiMaterial.prototype.getActiveTextures = function () {
        var _a;
        return (_a = _super.prototype.getActiveTextures.call(this)).concat.apply(_a, this.subMaterials.map(function (subMaterial) {
            if (subMaterial) {
                return subMaterial.getActiveTextures();
            }
            else {
                return [];
            }
        }));
    };
    /**
     * Specifies if any sub-materials of this multi-material use a given texture.
     * @param texture Defines the texture to check against this multi-material's sub-materials.
     * @returns A boolean specifying if any sub-material of this multi-material uses the texture.
     */
    MultiMaterial.prototype.hasTexture = function (texture) {
        var _a;
        if (_super.prototype.hasTexture.call(this, texture)) {
            return true;
        }
        for (var i = 0; i < this.subMaterials.length; i++) {
            if ((_a = this.subMaterials[i]) === null || _a === void 0 ? void 0 : _a.hasTexture(texture)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Gets the current class name of the material e.g. "MultiMaterial"
     * Mainly use in serialization.
     * @returns the class name
     */
    MultiMaterial.prototype.getClassName = function () {
        return "MultiMaterial";
    };
    /**
     * Checks if the material is ready to render the requested sub mesh
     * @param mesh Define the mesh the submesh belongs to
     * @param subMesh Define the sub mesh to look readyness for
     * @param useInstances Define whether or not the material is used with instances
     * @returns true if ready, otherwise false
     */
    MultiMaterial.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
        for (var index = 0; index < this.subMaterials.length; index++) {
            var subMaterial = this.subMaterials[index];
            if (subMaterial) {
                if (subMaterial._storeEffectOnSubMeshes) {
                    if (!subMaterial.isReadyForSubMesh(mesh, subMesh, useInstances)) {
                        return false;
                    }
                    continue;
                }
                if (!subMaterial.isReady(mesh)) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * Clones the current material and its related sub materials
     * @param name Define the name of the newly cloned material
     * @param cloneChildren Define if submaterial will be cloned or shared with the parent instance
     * @returns the cloned material
     */
    MultiMaterial.prototype.clone = function (name, cloneChildren) {
        var newMultiMaterial = new MultiMaterial(name, this.getScene());
        for (var index = 0; index < this.subMaterials.length; index++) {
            var subMaterial = null;
            var current = this.subMaterials[index];
            if (cloneChildren && current) {
                subMaterial = current.clone(name + "-" + current.name);
            }
            else {
                subMaterial = this.subMaterials[index];
            }
            newMultiMaterial.subMaterials.push(subMaterial);
        }
        return newMultiMaterial;
    };
    /**
     * Serializes the materials into a JSON representation.
     * @returns the JSON representation
     */
    MultiMaterial.prototype.serialize = function () {
        var serializationObject = {};
        serializationObject.name = this.name;
        serializationObject.id = this.id;
        if (Tags) {
            serializationObject.tags = Tags.GetTags(this);
        }
        serializationObject.materials = [];
        for (var matIndex = 0; matIndex < this.subMaterials.length; matIndex++) {
            var subMat = this.subMaterials[matIndex];
            if (subMat) {
                serializationObject.materials.push(subMat.id);
            }
            else {
                serializationObject.materials.push(null);
            }
        }
        return serializationObject;
    };
    /**
     * Dispose the material and release its associated resources
     * @param forceDisposeEffect Define if we want to force disposing the associated effect (if false the shader is not released and could be reuse later on)
     * @param forceDisposeTextures Define if we want to force disposing the associated textures (if false, they will not be disposed and can still be use elsewhere in the app)
     * @param forceDisposeChildren Define if we want to force disposing the associated submaterials (if false, they will not be disposed and can still be use elsewhere in the app)
     */
    MultiMaterial.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures, forceDisposeChildren) {
        var scene = this.getScene();
        if (!scene) {
            return;
        }
        if (forceDisposeChildren) {
            for (var index = 0; index < this.subMaterials.length; index++) {
                var subMaterial = this.subMaterials[index];
                if (subMaterial) {
                    subMaterial.dispose(forceDisposeEffect, forceDisposeTextures);
                }
            }
        }
        var index = scene.multiMaterials.indexOf(this);
        if (index >= 0) {
            scene.multiMaterials.splice(index, 1);
        }
        _super.prototype.dispose.call(this, forceDisposeEffect, forceDisposeTextures);
    };
    /**
     * Creates a MultiMaterial from parsed MultiMaterial data.
     * @param parsedMultiMaterial defines parsed MultiMaterial data.
     * @param scene defines the hosting scene
     * @returns a new MultiMaterial
     */
    MultiMaterial.ParseMultiMaterial = function (parsedMultiMaterial, scene) {
        var multiMaterial = new MultiMaterial(parsedMultiMaterial.name, scene);
        multiMaterial.id = parsedMultiMaterial.id;
        if (Tags) {
            Tags.AddTagsTo(multiMaterial, parsedMultiMaterial.tags);
        }
        for (var matIndex = 0; matIndex < parsedMultiMaterial.materials.length; matIndex++) {
            var subMatId = parsedMultiMaterial.materials[matIndex];
            if (subMatId) {
                // If the same multimaterial is loaded twice, the 2nd multimaterial needs to reference the latest material by that id which
                // is why this lookup should use getLastMaterialByID instead of getMaterialByID
                multiMaterial.subMaterials.push(scene.getLastMaterialByID(subMatId));
            }
            else {
                multiMaterial.subMaterials.push(null);
            }
        }
        return multiMaterial;
    };
    return MultiMaterial;
}(Material));
_TypeStore.RegisteredTypes["BABYLON.MultiMaterial"] = MultiMaterial;

/**
 * Class used to represent a specific level of detail of a mesh
 * @see https://doc.babylonjs.com/how_to/how_to_use_lod
 */
var MeshLODLevel = /** @class */ (function () {
    /**
     * Creates a new LOD level
     * @param distance defines the distance where this level should star being displayed
     * @param mesh defines the mesh to use to render this level
     */
    function MeshLODLevel(
    /** Defines the distance where this level should start being displayed */
    distance, 
    /** Defines the mesh to use to render this level */
    mesh) {
        this.distance = distance;
        this.mesh = mesh;
    }
    return MeshLODLevel;
}());

/**
 * @hidden
 **/
var _CreationDataStorage = /** @class */ (function () {
    function _CreationDataStorage() {
    }
    return _CreationDataStorage;
}());
/**
 * @hidden
 **/
var _InstanceDataStorage = /** @class */ (function () {
    function _InstanceDataStorage() {
        this.visibleInstances = {};
        this.batchCache = new _InstancesBatch();
        this.instancesBufferSize = 32 * 16 * 4; // let's start with a maximum of 32 instances
    }
    return _InstanceDataStorage;
}());
/**
 * @hidden
 **/
var _InstancesBatch = /** @class */ (function () {
    function _InstancesBatch() {
        this.mustReturn = false;
        this.visibleInstances = new Array();
        this.renderSelf = new Array();
        this.hardwareInstancedRendering = new Array();
    }
    return _InstancesBatch;
}());
/**
 * @hidden
 **/
var _ThinInstanceDataStorage = /** @class */ (function () {
    function _ThinInstanceDataStorage() {
        this.instancesCount = 0;
        this.matrixBuffer = null;
        this.matrixBufferSize = 32 * 16; // let's start with a maximum of 32 thin instances
        this.boundingVectors = [];
        this.worldMatrices = null;
    }
    return _ThinInstanceDataStorage;
}());
/**
 * @hidden
 **/
var _InternalMeshDataInfo = /** @class */ (function () {
    function _InternalMeshDataInfo() {
        this._areNormalsFrozen = false; // Will be used by ribbons mainly
        // Will be used to save a source mesh reference, If any
        this._source = null;
        // Will be used to for fast cloned mesh lookup
        this.meshMap = null;
        this._preActivateId = -1;
        this._LODLevels = new Array();
        // Morph
        this._morphTargetManager = null;
    }
    return _InternalMeshDataInfo;
}());
/**
 * Class used to represent renderable models
 */
var Mesh = /** @class */ (function (_super) {
    __extends(Mesh, _super);
    /**
     * @constructor
     * @param name The value used by scene.getMeshByName() to do a lookup.
     * @param scene The scene to add this mesh to.
     * @param parent The parent of this mesh, if it has one
     * @param source An optional Mesh from which geometry is shared, cloned.
     * @param doNotCloneChildren When cloning, skip cloning child meshes of source, default False.
     *                  When false, achieved by calling a clone(), also passing False.
     *                  This will make creation of children, recursive.
     * @param clonePhysicsImpostor When cloning, include cloning mesh physics impostor, default True.
     */
    function Mesh(name, scene, parent, source, doNotCloneChildren, clonePhysicsImpostor) {
        if (scene === void 0) { scene = null; }
        if (parent === void 0) { parent = null; }
        if (source === void 0) { source = null; }
        if (clonePhysicsImpostor === void 0) { clonePhysicsImpostor = true; }
        var _this = _super.call(this, name, scene) || this;
        // Internal data
        _this._internalMeshDataInfo = new _InternalMeshDataInfo();
        // Members
        /**
         * Gets the delay loading state of the mesh (when delay loading is turned on)
         * @see https://doc.babylonjs.com/how_to/using_the_incremental_loading_system
         */
        _this.delayLoadState = 0;
        /**
         * Gets the list of instances created from this mesh
         * it is not supposed to be modified manually.
         * Note also that the order of the InstancedMesh wihin the array is not significant and might change.
         * @see https://doc.babylonjs.com/how_to/how_to_use_instances
         */
        _this.instances = new Array();
        // Private
        /** @hidden */
        _this._creationDataStorage = null;
        /** @hidden */
        _this._geometry = null;
        /** @hidden */
        _this._instanceDataStorage = new _InstanceDataStorage();
        /** @hidden */
        _this._thinInstanceDataStorage = new _ThinInstanceDataStorage();
        _this._effectiveMaterial = null;
        /** @hidden */
        _this._shouldGenerateFlatShading = false;
        // Use by builder only to know what orientation were the mesh build in.
        /** @hidden */
        _this._originalBuilderSideOrientation = Mesh.DEFAULTSIDE;
        /**
         * Use this property to change the original side orientation defined at construction time
         */
        _this.overrideMaterialSideOrientation = null;
        scene = _this.getScene();
        if (source) {
            // Geometry
            if (source._geometry) {
                source._geometry.applyToMesh(_this);
            }
            // Deep copy
            DeepCopier.DeepCopy(source, _this, [
                "name", "material", "skeleton", "instances", "parent", "uniqueId", "source", "metadata", "morphTargetManager",
                "hasInstances", "source", "worldMatrixInstancedBuffer", "hasLODLevels", "geometry", "isBlocked", "areNormalsFrozen",
                "facetNb", "isFacetDataEnabled", "lightSources", "useBones", "isAnInstance", "collider", "edgesRenderer", "forward",
                "up", "right", "absolutePosition", "absoluteScaling", "absoluteRotationQuaternion", "isWorldMatrixFrozen",
                "nonUniformScaling", "behaviors", "worldMatrixFromCache", "hasThinInstances", "cloneMeshMap"
            ], ["_poseMatrix"]);
            // Source mesh
            _this._internalMeshDataInfo._source = source;
            if (scene.useClonedMeshMap) {
                if (!source._internalMeshDataInfo.meshMap) {
                    source._internalMeshDataInfo.meshMap = {};
                }
                source._internalMeshDataInfo.meshMap[_this.uniqueId] = _this;
            }
            // Construction Params
            // Clone parameters allowing mesh to be updated in case of parametric shapes.
            _this._originalBuilderSideOrientation = source._originalBuilderSideOrientation;
            _this._creationDataStorage = source._creationDataStorage;
            // Animation ranges
            if (source._ranges) {
                var ranges = source._ranges;
                for (var name in ranges) {
                    if (!ranges.hasOwnProperty(name)) {
                        continue;
                    }
                    if (!ranges[name]) {
                        continue;
                    }
                    _this.createAnimationRange(name, ranges[name].from, ranges[name].to);
                }
            }
            // Metadata
            if (source.metadata && source.metadata.clone) {
                _this.metadata = source.metadata.clone();
            }
            else {
                _this.metadata = source.metadata;
            }
            // Tags
            if (Tags && Tags.HasTags(source)) {
                Tags.AddTagsTo(_this, Tags.GetTags(source, true));
            }
            // Enabled
            _this.setEnabled(source.isEnabled());
            // Parent
            _this.parent = source.parent;
            // Pivot
            _this.setPivotMatrix(source.getPivotMatrix());
            _this.id = name + "." + source.id;
            // Material
            _this.material = source.material;
            var index;
            if (!doNotCloneChildren) {
                // Children
                var directDescendants = source.getDescendants(true);
                for (var index_1 = 0; index_1 < directDescendants.length; index_1++) {
                    var child = directDescendants[index_1];
                    if (child.clone) {
                        child.clone(name + "." + child.name, _this);
                    }
                }
            }
            // Morphs
            if (source.morphTargetManager) {
                _this.morphTargetManager = source.morphTargetManager;
            }
            // Physics clone
            if (scene.getPhysicsEngine) {
                var physicsEngine = scene.getPhysicsEngine();
                if (clonePhysicsImpostor && physicsEngine) {
                    var impostor = physicsEngine.getImpostorForPhysicsObject(source);
                    if (impostor) {
                        _this.physicsImpostor = impostor.clone(_this);
                    }
                }
            }
            // Particles
            for (index = 0; index < scene.particleSystems.length; index++) {
                var system = scene.particleSystems[index];
                if (system.emitter === source) {
                    system.clone(system.name, _this);
                }
            }
            _this.refreshBoundingInfo();
            _this.computeWorldMatrix(true);
        }
        // Parent
        if (parent !== null) {
            _this.parent = parent;
        }
        _this._instanceDataStorage.hardwareInstancedRendering = _this.getEngine().getCaps().instancedArrays;
        return _this;
    }
    /**
     * Gets the default side orientation.
     * @param orientation the orientation to value to attempt to get
     * @returns the default orientation
     * @hidden
     */
    Mesh._GetDefaultSideOrientation = function (orientation) {
        return orientation || Mesh.FRONTSIDE; // works as Mesh.FRONTSIDE is 0
    };
    Object.defineProperty(Mesh.prototype, "computeBonesUsingShaders", {
        get: function () {
            return this._internalAbstractMeshDataInfo._computeBonesUsingShaders;
        },
        set: function (value) {
            if (this._internalAbstractMeshDataInfo._computeBonesUsingShaders === value) {
                return;
            }
            if (value && this._internalMeshDataInfo._sourcePositions) {
                // switch from software to GPU computation: we need to reset the vertex and normal buffers that have been updated by the software process
                this.setVerticesData(VertexBuffer.PositionKind, this._internalMeshDataInfo._sourcePositions.slice(), true);
                if (this._internalMeshDataInfo._sourceNormals) {
                    this.setVerticesData(VertexBuffer.NormalKind, this._internalMeshDataInfo._sourceNormals.slice(), true);
                }
            }
            this._internalAbstractMeshDataInfo._computeBonesUsingShaders = value;
            this._markSubMeshesAsAttributesDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "onBeforeRenderObservable", {
        /**
         * An event triggered before rendering the mesh
         */
        get: function () {
            if (!this._internalMeshDataInfo._onBeforeRenderObservable) {
                this._internalMeshDataInfo._onBeforeRenderObservable = new Observable();
            }
            return this._internalMeshDataInfo._onBeforeRenderObservable;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "onBeforeBindObservable", {
        /**
         * An event triggered before binding the mesh
         */
        get: function () {
            if (!this._internalMeshDataInfo._onBeforeBindObservable) {
                this._internalMeshDataInfo._onBeforeBindObservable = new Observable();
            }
            return this._internalMeshDataInfo._onBeforeBindObservable;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "onAfterRenderObservable", {
        /**
        * An event triggered after rendering the mesh
        */
        get: function () {
            if (!this._internalMeshDataInfo._onAfterRenderObservable) {
                this._internalMeshDataInfo._onAfterRenderObservable = new Observable();
            }
            return this._internalMeshDataInfo._onAfterRenderObservable;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "onBeforeDrawObservable", {
        /**
        * An event triggered before drawing the mesh
        */
        get: function () {
            if (!this._internalMeshDataInfo._onBeforeDrawObservable) {
                this._internalMeshDataInfo._onBeforeDrawObservable = new Observable();
            }
            return this._internalMeshDataInfo._onBeforeDrawObservable;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "onBeforeDraw", {
        /**
         * Sets a callback to call before drawing the mesh. It is recommended to use onBeforeDrawObservable instead
         */
        set: function (callback) {
            if (this._onBeforeDrawObserver) {
                this.onBeforeDrawObservable.remove(this._onBeforeDrawObserver);
            }
            this._onBeforeDrawObserver = this.onBeforeDrawObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "hasInstances", {
        get: function () {
            return this.instances.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "hasThinInstances", {
        get: function () {
            var _a;
            return ((_a = this._thinInstanceDataStorage.instancesCount) !== null && _a !== void 0 ? _a : 0) > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "morphTargetManager", {
        /**
         * Gets or sets the morph target manager
         * @see https://doc.babylonjs.com/how_to/how_to_use_morphtargets
         */
        get: function () {
            return this._internalMeshDataInfo._morphTargetManager;
        },
        set: function (value) {
            if (this._internalMeshDataInfo._morphTargetManager === value) {
                return;
            }
            this._internalMeshDataInfo._morphTargetManager = value;
            this._syncGeometryWithMorphTargetManager();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "source", {
        /**
         * Gets the source mesh (the one used to clone this one from)
         */
        get: function () {
            return this._internalMeshDataInfo._source;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "cloneMeshMap", {
        /**
         * Gets the list of clones of this mesh
         * The scene must have been constructed with useClonedMeshMap=true for this to work!
         * Note that useClonedMeshMap=true is the default setting
         */
        get: function () {
            return this._internalMeshDataInfo.meshMap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "isUnIndexed", {
        /**
         * Gets or sets a boolean indicating that this mesh does not use index buffer
         */
        get: function () {
            return this._unIndexed;
        },
        set: function (value) {
            if (this._unIndexed !== value) {
                this._unIndexed = value;
                this._markSubMeshesAsAttributesDirty();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "worldMatrixInstancedBuffer", {
        /** Gets the array buffer used to store the instanced buffer used for instances' world matrices */
        get: function () {
            return this._instanceDataStorage.instancesData;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "manualUpdateOfWorldMatrixInstancedBuffer", {
        /** Gets or sets a boolean indicating that the update of the instance buffer of the world matrices is manual */
        get: function () {
            return this._instanceDataStorage.manualUpdate;
        },
        set: function (value) {
            this._instanceDataStorage.manualUpdate = value;
        },
        enumerable: false,
        configurable: true
    });
    // Methods
    Mesh.prototype.instantiateHierarchy = function (newParent, options, onNewNodeCreated) {
        if (newParent === void 0) { newParent = null; }
        var instance = (this.getTotalVertices() > 0 && (!options || !options.doNotInstantiate)) ? this.createInstance("instance of " + (this.name || this.id)) : this.clone("Clone of " + (this.name || this.id), newParent || this.parent, true);
        if (instance) {
            instance.parent = newParent || this.parent;
            instance.position = this.position.clone();
            instance.scaling = this.scaling.clone();
            if (this.rotationQuaternion) {
                instance.rotationQuaternion = this.rotationQuaternion.clone();
            }
            else {
                instance.rotation = this.rotation.clone();
            }
            if (onNewNodeCreated) {
                onNewNodeCreated(this, instance);
            }
        }
        for (var _i = 0, _a = this.getChildTransformNodes(true); _i < _a.length; _i++) {
            var child = _a[_i];
            child.instantiateHierarchy(instance, options, onNewNodeCreated);
        }
        return instance;
    };
    /**
     * Gets the class name
     * @returns the string "Mesh".
     */
    Mesh.prototype.getClassName = function () {
        return "Mesh";
    };
    Object.defineProperty(Mesh.prototype, "_isMesh", {
        /** @hidden */
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a description of this mesh
     * @param fullDetails define if full details about this mesh must be used
     * @returns a descriptive string representing this mesh
     */
    Mesh.prototype.toString = function (fullDetails) {
        var ret = _super.prototype.toString.call(this, fullDetails);
        ret += ", n vertices: " + this.getTotalVertices();
        ret += ", parent: " + (this._waitingParentId ? this._waitingParentId : (this.parent ? this.parent.name : "NONE"));
        if (this.animations) {
            for (var i = 0; i < this.animations.length; i++) {
                ret += ", animation[0]: " + this.animations[i].toString(fullDetails);
            }
        }
        if (fullDetails) {
            if (this._geometry) {
                var ib = this.getIndices();
                var vb = this.getVerticesData(VertexBuffer.PositionKind);
                if (vb && ib) {
                    ret += ", flat shading: " + (vb.length / 3 === ib.length ? "YES" : "NO");
                }
            }
            else {
                ret += ", flat shading: UNKNOWN";
            }
        }
        return ret;
    };
    /** @hidden */
    Mesh.prototype._unBindEffect = function () {
        _super.prototype._unBindEffect.call(this);
        for (var _i = 0, _a = this.instances; _i < _a.length; _i++) {
            var instance = _a[_i];
            instance._unBindEffect();
        }
    };
    Object.defineProperty(Mesh.prototype, "hasLODLevels", {
        /**
         * Gets a boolean indicating if this mesh has LOD
         */
        get: function () {
            return this._internalMeshDataInfo._LODLevels.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the list of MeshLODLevel associated with the current mesh
     * @returns an array of MeshLODLevel
     */
    Mesh.prototype.getLODLevels = function () {
        return this._internalMeshDataInfo._LODLevels;
    };
    Mesh.prototype._sortLODLevels = function () {
        this._internalMeshDataInfo._LODLevels.sort(function (a, b) {
            if (a.distance < b.distance) {
                return 1;
            }
            if (a.distance > b.distance) {
                return -1;
            }
            return 0;
        });
    };
    /**
     * Add a mesh as LOD level triggered at the given distance.
     * @see https://doc.babylonjs.com/how_to/how_to_use_lod
     * @param distance The distance from the center of the object to show this level
     * @param mesh The mesh to be added as LOD level (can be null)
     * @return This mesh (for chaining)
     */
    Mesh.prototype.addLODLevel = function (distance, mesh) {
        if (mesh && mesh._masterMesh) {
            Logger.Warn("You cannot use a mesh as LOD level twice");
            return this;
        }
        var level = new MeshLODLevel(distance, mesh);
        this._internalMeshDataInfo._LODLevels.push(level);
        if (mesh) {
            mesh._masterMesh = this;
        }
        this._sortLODLevels();
        return this;
    };
    /**
     * Returns the LOD level mesh at the passed distance or null if not found.
     * @see https://doc.babylonjs.com/how_to/how_to_use_lod
     * @param distance The distance from the center of the object to show this level
     * @returns a Mesh or `null`
     */
    Mesh.prototype.getLODLevelAtDistance = function (distance) {
        var internalDataInfo = this._internalMeshDataInfo;
        for (var index = 0; index < internalDataInfo._LODLevels.length; index++) {
            var level = internalDataInfo._LODLevels[index];
            if (level.distance === distance) {
                return level.mesh;
            }
        }
        return null;
    };
    /**
     * Remove a mesh from the LOD array
     * @see https://doc.babylonjs.com/how_to/how_to_use_lod
     * @param mesh defines the mesh to be removed
     * @return This mesh (for chaining)
     */
    Mesh.prototype.removeLODLevel = function (mesh) {
        var internalDataInfo = this._internalMeshDataInfo;
        for (var index = 0; index < internalDataInfo._LODLevels.length; index++) {
            if (internalDataInfo._LODLevels[index].mesh === mesh) {
                internalDataInfo._LODLevels.splice(index, 1);
                if (mesh) {
                    mesh._masterMesh = null;
                }
            }
        }
        this._sortLODLevels();
        return this;
    };
    /**
     * Returns the registered LOD mesh distant from the parameter `camera` position if any, else returns the current mesh.
     * @see https://doc.babylonjs.com/how_to/how_to_use_lod
     * @param camera defines the camera to use to compute distance
     * @param boundingSphere defines a custom bounding sphere to use instead of the one from this mesh
     * @return This mesh (for chaining)
     */
    Mesh.prototype.getLOD = function (camera, boundingSphere) {
        var internalDataInfo = this._internalMeshDataInfo;
        if (!internalDataInfo._LODLevels || internalDataInfo._LODLevels.length === 0) {
            return this;
        }
        var bSphere;
        if (boundingSphere) {
            bSphere = boundingSphere;
        }
        else {
            var boundingInfo = this.getBoundingInfo();
            bSphere = boundingInfo.boundingSphere;
        }
        var distanceToCamera = bSphere.centerWorld.subtract(camera.globalPosition).length();
        if (internalDataInfo._LODLevels[internalDataInfo._LODLevels.length - 1].distance > distanceToCamera) {
            if (this.onLODLevelSelection) {
                this.onLODLevelSelection(distanceToCamera, this, this);
            }
            return this;
        }
        for (var index = 0; index < internalDataInfo._LODLevels.length; index++) {
            var level = internalDataInfo._LODLevels[index];
            if (level.distance < distanceToCamera) {
                if (level.mesh) {
                    if (level.mesh.delayLoadState === 4) {
                        level.mesh._checkDelayState();
                        return this;
                    }
                    if (level.mesh.delayLoadState === 2) {
                        return this;
                    }
                    level.mesh._preActivate();
                    level.mesh._updateSubMeshesBoundingInfo(this.worldMatrixFromCache);
                }
                if (this.onLODLevelSelection) {
                    this.onLODLevelSelection(distanceToCamera, this, level.mesh);
                }
                return level.mesh;
            }
        }
        if (this.onLODLevelSelection) {
            this.onLODLevelSelection(distanceToCamera, this, this);
        }
        return this;
    };
    Object.defineProperty(Mesh.prototype, "geometry", {
        /**
         * Gets the mesh internal Geometry object
         */
        get: function () {
            return this._geometry;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the total number of vertices within the mesh geometry or zero if the mesh has no geometry.
     * @returns the total number of vertices
     */
    Mesh.prototype.getTotalVertices = function () {
        if (this._geometry === null || this._geometry === undefined) {
            return 0;
        }
        return this._geometry.getTotalVertices();
    };
    /**
     * Returns the content of an associated vertex buffer
     * @param kind defines which buffer to read from (positions, indices, normals, etc). Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     * @param copyWhenShared defines a boolean indicating that if the mesh geometry is shared among some other meshes, the returned array is a copy of the internal one
     * @param forceCopy defines a boolean forcing the copy of the buffer no matter what the value of copyWhenShared is
     * @returns a FloatArray or null if the mesh has no geometry or no vertex buffer for this kind.
     */
    Mesh.prototype.getVerticesData = function (kind, copyWhenShared, forceCopy) {
        if (!this._geometry) {
            return null;
        }
        return this._geometry.getVerticesData(kind, copyWhenShared, forceCopy);
    };
    /**
     * Returns the mesh VertexBuffer object from the requested `kind`
     * @param kind defines which buffer to read from (positions, indices, normals, etc). Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.NormalKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     * @returns a FloatArray or null if the mesh has no vertex buffer for this kind.
     */
    Mesh.prototype.getVertexBuffer = function (kind) {
        if (!this._geometry) {
            return null;
        }
        return this._geometry.getVertexBuffer(kind);
    };
    /**
     * Tests if a specific vertex buffer is associated with this mesh
     * @param kind defines which buffer to check (positions, indices, normals, etc). Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.NormalKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     * @returns a boolean
     */
    Mesh.prototype.isVerticesDataPresent = function (kind) {
        if (!this._geometry) {
            if (this._delayInfo) {
                return this._delayInfo.indexOf(kind) !== -1;
            }
            return false;
        }
        return this._geometry.isVerticesDataPresent(kind);
    };
    /**
     * Returns a boolean defining if the vertex data for the requested `kind` is updatable.
     * @param kind defines which buffer to check (positions, indices, normals, etc). Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     * @returns a boolean
     */
    Mesh.prototype.isVertexBufferUpdatable = function (kind) {
        if (!this._geometry) {
            if (this._delayInfo) {
                return this._delayInfo.indexOf(kind) !== -1;
            }
            return false;
        }
        return this._geometry.isVertexBufferUpdatable(kind);
    };
    /**
     * Returns a string which contains the list of existing `kinds` of Vertex Data associated with this mesh.
     * @param kind defines which buffer to read from (positions, indices, normals, etc). Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.NormalKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     * @returns an array of strings
     */
    Mesh.prototype.getVerticesDataKinds = function () {
        if (!this._geometry) {
            var result = new Array();
            if (this._delayInfo) {
                this._delayInfo.forEach(function (kind) {
                    result.push(kind);
                });
            }
            return result;
        }
        return this._geometry.getVerticesDataKinds();
    };
    /**
     * Returns a positive integer : the total number of indices in this mesh geometry.
     * @returns the numner of indices or zero if the mesh has no geometry.
     */
    Mesh.prototype.getTotalIndices = function () {
        if (!this._geometry) {
            return 0;
        }
        return this._geometry.getTotalIndices();
    };
    /**
     * Returns an array of integers or a typed array (Int32Array, Uint32Array, Uint16Array) populated with the mesh indices.
     * @param copyWhenShared If true (default false) and and if the mesh geometry is shared among some other meshes, the returned array is a copy of the internal one.
     * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
     * @returns the indices array or an empty array if the mesh has no geometry
     */
    Mesh.prototype.getIndices = function (copyWhenShared, forceCopy) {
        if (!this._geometry) {
            return [];
        }
        return this._geometry.getIndices(copyWhenShared, forceCopy);
    };
    Object.defineProperty(Mesh.prototype, "isBlocked", {
        get: function () {
            return this._masterMesh !== null && this._masterMesh !== undefined;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Determine if the current mesh is ready to be rendered
     * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
     * @param forceInstanceSupport will check if the mesh will be ready when used with instances (false by default)
     * @returns true if all associated assets are ready (material, textures, shaders)
     */
    Mesh.prototype.isReady = function (completeCheck, forceInstanceSupport) {
        var _a, _b, _c, _d, _e, _f;
        if (completeCheck === void 0) { completeCheck = false; }
        if (forceInstanceSupport === void 0) { forceInstanceSupport = false; }
        if (this.delayLoadState === 2) {
            return false;
        }
        if (!_super.prototype.isReady.call(this, completeCheck)) {
            return false;
        }
        if (!this.subMeshes || this.subMeshes.length === 0) {
            return true;
        }
        if (!completeCheck) {
            return true;
        }
        var engine = this.getEngine();
        var scene = this.getScene();
        var hardwareInstancedRendering = forceInstanceSupport || engine.getCaps().instancedArrays && (this.instances.length > 0 || this.hasThinInstances);
        this.computeWorldMatrix();
        var mat = this.material || scene.defaultMaterial;
        if (mat) {
            if (mat._storeEffectOnSubMeshes) {
                for (var _i = 0, _g = this.subMeshes; _i < _g.length; _i++) {
                    var subMesh = _g[_i];
                    var effectiveMaterial = subMesh.getMaterial();
                    if (effectiveMaterial) {
                        if (effectiveMaterial._storeEffectOnSubMeshes) {
                            if (!effectiveMaterial.isReadyForSubMesh(this, subMesh, hardwareInstancedRendering)) {
                                return false;
                            }
                        }
                        else {
                            if (!effectiveMaterial.isReady(this, hardwareInstancedRendering)) {
                                return false;
                            }
                        }
                    }
                }
            }
            else {
                if (!mat.isReady(this, hardwareInstancedRendering)) {
                    return false;
                }
            }
        }
        // Shadows
        for (var _h = 0, _j = this.lightSources; _h < _j.length; _h++) {
            var light = _j[_h];
            var generator = light.getShadowGenerator();
            if (generator && (!((_a = generator.getShadowMap()) === null || _a === void 0 ? void 0 : _a.renderList) || ((_b = generator.getShadowMap()) === null || _b === void 0 ? void 0 : _b.renderList) && ((_d = (_c = generator.getShadowMap()) === null || _c === void 0 ? void 0 : _c.renderList) === null || _d === void 0 ? void 0 : _d.indexOf(this)) !== -1)) {
                for (var _k = 0, _l = this.subMeshes; _k < _l.length; _k++) {
                    var subMesh = _l[_k];
                    if (!generator.isReady(subMesh, hardwareInstancedRendering, (_f = (_e = subMesh.getMaterial()) === null || _e === void 0 ? void 0 : _e.needAlphaBlendingForMesh(this)) !== null && _f !== void 0 ? _f : false)) {
                        return false;
                    }
                }
            }
        }
        // LOD
        for (var _m = 0, _o = this._internalMeshDataInfo._LODLevels; _m < _o.length; _m++) {
            var lod = _o[_m];
            if (lod.mesh && !lod.mesh.isReady(hardwareInstancedRendering)) {
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(Mesh.prototype, "areNormalsFrozen", {
        /**
         * Gets a boolean indicating if the normals aren't to be recomputed on next mesh `positions` array update. This property is pertinent only for updatable parametric shapes.
         */
        get: function () {
            return this._internalMeshDataInfo._areNormalsFrozen;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * This function affects parametric shapes on vertex position update only : ribbons, tubes, etc. It has no effect at all on other shapes. It prevents the mesh normals from being recomputed on next `positions` array update.
     * @returns the current mesh
     */
    Mesh.prototype.freezeNormals = function () {
        this._internalMeshDataInfo._areNormalsFrozen = true;
        return this;
    };
    /**
     * This function affects parametric shapes on vertex position update only : ribbons, tubes, etc. It has no effect at all on other shapes. It reactivates the mesh normals computation if it was previously frozen
     * @returns the current mesh
     */
    Mesh.prototype.unfreezeNormals = function () {
        this._internalMeshDataInfo._areNormalsFrozen = false;
        return this;
    };
    Object.defineProperty(Mesh.prototype, "overridenInstanceCount", {
        /**
         * Sets a value overriding the instance count. Only applicable when custom instanced InterleavedVertexBuffer are used rather than InstancedMeshs
         */
        set: function (count) {
            this._instanceDataStorage.overridenInstanceCount = count;
        },
        enumerable: false,
        configurable: true
    });
    // Methods
    /** @hidden */
    Mesh.prototype._preActivate = function () {
        var internalDataInfo = this._internalMeshDataInfo;
        var sceneRenderId = this.getScene().getRenderId();
        if (internalDataInfo._preActivateId === sceneRenderId) {
            return this;
        }
        internalDataInfo._preActivateId = sceneRenderId;
        this._instanceDataStorage.visibleInstances = null;
        return this;
    };
    /** @hidden */
    Mesh.prototype._preActivateForIntermediateRendering = function (renderId) {
        if (this._instanceDataStorage.visibleInstances) {
            this._instanceDataStorage.visibleInstances.intermediateDefaultRenderId = renderId;
        }
        return this;
    };
    /** @hidden */
    Mesh.prototype._registerInstanceForRenderId = function (instance, renderId) {
        if (!this._instanceDataStorage.visibleInstances) {
            this._instanceDataStorage.visibleInstances = {
                defaultRenderId: renderId,
                selfDefaultRenderId: this._renderId
            };
        }
        if (!this._instanceDataStorage.visibleInstances[renderId]) {
            if (this._instanceDataStorage.previousRenderId !== undefined && this._instanceDataStorage.isFrozen) {
                this._instanceDataStorage.visibleInstances[this._instanceDataStorage.previousRenderId] = null;
            }
            this._instanceDataStorage.previousRenderId = renderId;
            this._instanceDataStorage.visibleInstances[renderId] = new Array();
        }
        this._instanceDataStorage.visibleInstances[renderId].push(instance);
        return this;
    };
    Mesh.prototype._afterComputeWorldMatrix = function () {
        _super.prototype._afterComputeWorldMatrix.call(this);
        if (!this.hasThinInstances) {
            return;
        }
        if (!this.doNotSyncBoundingInfo) {
            this.thinInstanceRefreshBoundingInfo(false);
        }
    };
    /** @hidden */
    Mesh.prototype._postActivate = function () {
        if (this.edgesShareWithInstances && this.edgesRenderer && this.edgesRenderer.isEnabled && this._renderingGroup) {
            this._renderingGroup._edgesRenderers.pushNoDuplicate(this.edgesRenderer);
            this.edgesRenderer.customInstances.push(this.getWorldMatrix());
        }
    };
    /**
     * This method recomputes and sets a new BoundingInfo to the mesh unless it is locked.
     * This means the mesh underlying bounding box and sphere are recomputed.
     * @param applySkeleton defines whether to apply the skeleton before computing the bounding info
     * @returns the current mesh
     */
    Mesh.prototype.refreshBoundingInfo = function (applySkeleton) {
        if (applySkeleton === void 0) { applySkeleton = false; }
        if (this._boundingInfo && this._boundingInfo.isLocked) {
            return this;
        }
        var bias = this.geometry ? this.geometry.boundingBias : null;
        this._refreshBoundingInfo(this._getPositionData(applySkeleton), bias);
        return this;
    };
    /** @hidden */
    Mesh.prototype._createGlobalSubMesh = function (force) {
        var totalVertices = this.getTotalVertices();
        if (!totalVertices || !this.getIndices()) {
            return null;
        }
        // Check if we need to recreate the submeshes
        if (this.subMeshes && this.subMeshes.length > 0) {
            var ib = this.getIndices();
            if (!ib) {
                return null;
            }
            var totalIndices = ib.length;
            var needToRecreate = false;
            if (force) {
                needToRecreate = true;
            }
            else {
                for (var _i = 0, _a = this.subMeshes; _i < _a.length; _i++) {
                    var submesh = _a[_i];
                    if (submesh.indexStart + submesh.indexCount > totalIndices) {
                        needToRecreate = true;
                        break;
                    }
                    if (submesh.verticesStart + submesh.verticesCount > totalVertices) {
                        needToRecreate = true;
                        break;
                    }
                }
            }
            if (!needToRecreate) {
                return this.subMeshes[0];
            }
        }
        this.releaseSubMeshes();
        return new SubMesh(0, 0, totalVertices, 0, this.getTotalIndices(), this);
    };
    /**
     * This function will subdivide the mesh into multiple submeshes
     * @param count defines the expected number of submeshes
     */
    Mesh.prototype.subdivide = function (count) {
        if (count < 1) {
            return;
        }
        var totalIndices = this.getTotalIndices();
        var subdivisionSize = (totalIndices / count) | 0;
        var offset = 0;
        // Ensure that subdivisionSize is a multiple of 3
        while (subdivisionSize % 3 !== 0) {
            subdivisionSize++;
        }
        this.releaseSubMeshes();
        for (var index = 0; index < count; index++) {
            if (offset >= totalIndices) {
                break;
            }
            SubMesh.CreateFromIndices(0, offset, index === count - 1 ? totalIndices - offset : subdivisionSize, this);
            offset += subdivisionSize;
        }
        this.synchronizeInstances();
    };
    /**
     * Copy a FloatArray into a specific associated vertex buffer
     * @param kind defines which buffer to write to (positions, indices, normals, etc). Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     * @param data defines the data source
     * @param updatable defines if the updated vertex buffer must be flagged as updatable
     * @param stride defines the data stride size (can be null)
     * @returns the current mesh
     */
    Mesh.prototype.setVerticesData = function (kind, data, updatable, stride) {
        if (updatable === void 0) { updatable = false; }
        if (!this._geometry) {
            var vertexData = new VertexData();
            vertexData.set(data, kind);
            var scene = this.getScene();
            new Geometry(Geometry.RandomId(), scene, vertexData, updatable, this);
        }
        else {
            this._geometry.setVerticesData(kind, data, updatable, stride);
        }
        return this;
    };
    /**
     * Delete a vertex buffer associated with this mesh
     * @param kind defines which buffer to delete (positions, indices, normals, etc). Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     */
    Mesh.prototype.removeVerticesData = function (kind) {
        if (!this._geometry) {
            return;
        }
        this._geometry.removeVerticesData(kind);
    };
    /**
     * Flags an associated vertex buffer as updatable
     * @param kind defines which buffer to use (positions, indices, normals, etc). Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     * @param updatable defines if the updated vertex buffer must be flagged as updatable
     */
    Mesh.prototype.markVerticesDataAsUpdatable = function (kind, updatable) {
        if (updatable === void 0) { updatable = true; }
        var vb = this.getVertexBuffer(kind);
        if (!vb || vb.isUpdatable() === updatable) {
            return;
        }
        this.setVerticesData(kind, this.getVerticesData(kind), updatable);
    };
    /**
     * Sets the mesh global Vertex Buffer
     * @param buffer defines the buffer to use
     * @returns the current mesh
     */
    Mesh.prototype.setVerticesBuffer = function (buffer) {
        if (!this._geometry) {
            this._geometry = Geometry.CreateGeometryForMesh(this);
        }
        this._geometry.setVerticesBuffer(buffer);
        return this;
    };
    /**
     * Update a specific associated vertex buffer
     * @param kind defines which buffer to write to (positions, indices, normals, etc). Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     * @param data defines the data source
     * @param updateExtends defines if extends info of the mesh must be updated (can be null). This is mostly useful for "position" kind
     * @param makeItUnique defines if the geometry associated with the mesh must be cloned to make the change only for this mesh (and not all meshes associated with the same geometry)
     * @returns the current mesh
     */
    Mesh.prototype.updateVerticesData = function (kind, data, updateExtends, makeItUnique) {
        if (!this._geometry) {
            return this;
        }
        if (!makeItUnique) {
            this._geometry.updateVerticesData(kind, data, updateExtends);
        }
        else {
            this.makeGeometryUnique();
            this.updateVerticesData(kind, data, updateExtends, false);
        }
        return this;
    };
    /**
     * This method updates the vertex positions of an updatable mesh according to the `positionFunction` returned values.
     * @see https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#other-shapes-updatemeshpositions
     * @param positionFunction is a simple JS function what is passed the mesh `positions` array. It doesn't need to return anything
     * @param computeNormals is a boolean (default true) to enable/disable the mesh normal recomputation after the vertex position update
     * @returns the current mesh
     */
    Mesh.prototype.updateMeshPositions = function (positionFunction, computeNormals) {
        if (computeNormals === void 0) { computeNormals = true; }
        var positions = this.getVerticesData(VertexBuffer.PositionKind);
        if (!positions) {
            return this;
        }
        positionFunction(positions);
        this.updateVerticesData(VertexBuffer.PositionKind, positions, false, false);
        if (computeNormals) {
            var indices = this.getIndices();
            var normals = this.getVerticesData(VertexBuffer.NormalKind);
            if (!normals) {
                return this;
            }
            VertexData.ComputeNormals(positions, indices, normals);
            this.updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
        }
        return this;
    };
    /**
     * Creates a un-shared specific occurence of the geometry for the mesh.
     * @returns the current mesh
     */
    Mesh.prototype.makeGeometryUnique = function () {
        if (!this._geometry) {
            return this;
        }
        if (this._geometry.meshes.length === 1) {
            return this;
        }
        var oldGeometry = this._geometry;
        var geometry = this._geometry.copy(Geometry.RandomId());
        oldGeometry.releaseForMesh(this, true);
        geometry.applyToMesh(this);
        return this;
    };
    /**
     * Set the index buffer of this mesh
     * @param indices defines the source data
     * @param totalVertices defines the total number of vertices referenced by this index data (can be null)
     * @param updatable defines if the updated index buffer must be flagged as updatable (default is false)
     * @returns the current mesh
     */
    Mesh.prototype.setIndices = function (indices, totalVertices, updatable) {
        if (totalVertices === void 0) { totalVertices = null; }
        if (updatable === void 0) { updatable = false; }
        if (!this._geometry) {
            var vertexData = new VertexData();
            vertexData.indices = indices;
            var scene = this.getScene();
            new Geometry(Geometry.RandomId(), scene, vertexData, updatable, this);
        }
        else {
            this._geometry.setIndices(indices, totalVertices, updatable);
        }
        return this;
    };
    /**
     * Update the current index buffer
     * @param indices defines the source data
     * @param offset defines the offset in the index buffer where to store the new data (can be null)
     * @param gpuMemoryOnly defines a boolean indicating that only the GPU memory must be updated leaving the CPU version of the indices unchanged (false by default)
     * @returns the current mesh
     */
    Mesh.prototype.updateIndices = function (indices, offset, gpuMemoryOnly) {
        if (gpuMemoryOnly === void 0) { gpuMemoryOnly = false; }
        if (!this._geometry) {
            return this;
        }
        this._geometry.updateIndices(indices, offset, gpuMemoryOnly);
        return this;
    };
    /**
     * Invert the geometry to move from a right handed system to a left handed one.
     * @returns the current mesh
     */
    Mesh.prototype.toLeftHanded = function () {
        if (!this._geometry) {
            return this;
        }
        this._geometry.toLeftHanded();
        return this;
    };
    /** @hidden */
    Mesh.prototype._bind = function (subMesh, effect, fillMode) {
        if (!this._geometry) {
            return this;
        }
        var engine = this.getScene().getEngine();
        // Wireframe
        var indexToBind;
        if (this._unIndexed) {
            indexToBind = null;
        }
        else {
            switch (fillMode) {
                case Material.PointFillMode:
                    indexToBind = null;
                    break;
                case Material.WireFrameFillMode:
                    indexToBind = subMesh._getLinesIndexBuffer(this.getIndices(), engine);
                    break;
                default:
                case Material.TriangleFillMode:
                    indexToBind = this._geometry.getIndexBuffer();
                    break;
            }
        }
        // VBOs
        this._geometry._bind(effect, indexToBind);
        return this;
    };
    /** @hidden */
    Mesh.prototype._draw = function (subMesh, fillMode, instancesCount) {
        if (!this._geometry || !this._geometry.getVertexBuffers() || (!this._unIndexed && !this._geometry.getIndexBuffer())) {
            return this;
        }
        if (this._internalMeshDataInfo._onBeforeDrawObservable) {
            this._internalMeshDataInfo._onBeforeDrawObservable.notifyObservers(this);
        }
        var scene = this.getScene();
        var engine = scene.getEngine();
        if (this._unIndexed || fillMode == Material.PointFillMode) {
            // or triangles as points
            engine.drawArraysType(fillMode, subMesh.verticesStart, subMesh.verticesCount, instancesCount);
        }
        else if (fillMode == Material.WireFrameFillMode) {
            // Triangles as wireframe
            engine.drawElementsType(fillMode, 0, subMesh._linesIndexCount, instancesCount);
        }
        else {
            engine.drawElementsType(fillMode, subMesh.indexStart, subMesh.indexCount, instancesCount);
        }
        return this;
    };
    /**
     * Registers for this mesh a javascript function called just before the rendering process
     * @param func defines the function to call before rendering this mesh
     * @returns the current mesh
     */
    Mesh.prototype.registerBeforeRender = function (func) {
        this.onBeforeRenderObservable.add(func);
        return this;
    };
    /**
     * Disposes a previously registered javascript function called before the rendering
     * @param func defines the function to remove
     * @returns the current mesh
     */
    Mesh.prototype.unregisterBeforeRender = function (func) {
        this.onBeforeRenderObservable.removeCallback(func);
        return this;
    };
    /**
     * Registers for this mesh a javascript function called just after the rendering is complete
     * @param func defines the function to call after rendering this mesh
     * @returns the current mesh
     */
    Mesh.prototype.registerAfterRender = function (func) {
        this.onAfterRenderObservable.add(func);
        return this;
    };
    /**
     * Disposes a previously registered javascript function called after the rendering.
     * @param func defines the function to remove
     * @returns the current mesh
     */
    Mesh.prototype.unregisterAfterRender = function (func) {
        this.onAfterRenderObservable.removeCallback(func);
        return this;
    };
    /** @hidden */
    Mesh.prototype._getInstancesRenderList = function (subMeshId, isReplacementMode) {
        if (isReplacementMode === void 0) { isReplacementMode = false; }
        if (this._instanceDataStorage.isFrozen && this._instanceDataStorage.previousBatch) {
            return this._instanceDataStorage.previousBatch;
        }
        var scene = this.getScene();
        var isInIntermediateRendering = scene._isInIntermediateRendering();
        var onlyForInstances = isInIntermediateRendering ? this._internalAbstractMeshDataInfo._onlyForInstancesIntermediate : this._internalAbstractMeshDataInfo._onlyForInstances;
        var batchCache = this._instanceDataStorage.batchCache;
        batchCache.mustReturn = false;
        batchCache.renderSelf[subMeshId] = isReplacementMode || (!onlyForInstances && this.isEnabled() && this.isVisible);
        batchCache.visibleInstances[subMeshId] = null;
        if (this._instanceDataStorage.visibleInstances && !isReplacementMode) {
            var visibleInstances = this._instanceDataStorage.visibleInstances;
            var currentRenderId = scene.getRenderId();
            var defaultRenderId = (isInIntermediateRendering ? visibleInstances.intermediateDefaultRenderId : visibleInstances.defaultRenderId);
            batchCache.visibleInstances[subMeshId] = visibleInstances[currentRenderId];
            if (!batchCache.visibleInstances[subMeshId] && defaultRenderId) {
                batchCache.visibleInstances[subMeshId] = visibleInstances[defaultRenderId];
            }
        }
        batchCache.hardwareInstancedRendering[subMeshId] =
            !isReplacementMode &&
                this._instanceDataStorage.hardwareInstancedRendering
                && (batchCache.visibleInstances[subMeshId] !== null)
                && (batchCache.visibleInstances[subMeshId] !== undefined);
        this._instanceDataStorage.previousBatch = batchCache;
        return batchCache;
    };
    /** @hidden */
    Mesh.prototype._renderWithInstances = function (subMesh, fillMode, batch, effect, engine) {
        var visibleInstances = batch.visibleInstances[subMesh._id];
        if (!visibleInstances) {
            return this;
        }
        var instanceStorage = this._instanceDataStorage;
        var currentInstancesBufferSize = instanceStorage.instancesBufferSize;
        var instancesBuffer = instanceStorage.instancesBuffer;
        var matricesCount = visibleInstances.length + 1;
        var bufferSize = matricesCount * 16 * 4;
        while (instanceStorage.instancesBufferSize < bufferSize) {
            instanceStorage.instancesBufferSize *= 2;
        }
        if (!instanceStorage.instancesData || currentInstancesBufferSize != instanceStorage.instancesBufferSize) {
            instanceStorage.instancesData = new Float32Array(instanceStorage.instancesBufferSize / 4);
        }
        var offset = 0;
        var instancesCount = 0;
        var renderSelf = batch.renderSelf[subMesh._id];
        var needUpdateBuffer = !instancesBuffer || currentInstancesBufferSize !== instanceStorage.instancesBufferSize;
        if (!this._instanceDataStorage.manualUpdate && (!instanceStorage.isFrozen || needUpdateBuffer)) {
            var world = this._effectiveMesh.getWorldMatrix();
            if (renderSelf) {
                world.copyToArray(instanceStorage.instancesData, offset);
                offset += 16;
                instancesCount++;
            }
            if (visibleInstances) {
                for (var instanceIndex = 0; instanceIndex < visibleInstances.length; instanceIndex++) {
                    var instance = visibleInstances[instanceIndex];
                    instance.getWorldMatrix().copyToArray(instanceStorage.instancesData, offset);
                    offset += 16;
                    instancesCount++;
                }
            }
        }
        else {
            instancesCount = (renderSelf ? 1 : 0) + visibleInstances.length;
        }
        if (needUpdateBuffer) {
            if (instancesBuffer) {
                instancesBuffer.dispose();
            }
            instancesBuffer = new Buffer(engine, instanceStorage.instancesData, true, 16, false, true);
            instanceStorage.instancesBuffer = instancesBuffer;
            this.setVerticesBuffer(instancesBuffer.createVertexBuffer("world0", 0, 4));
            this.setVerticesBuffer(instancesBuffer.createVertexBuffer("world1", 4, 4));
            this.setVerticesBuffer(instancesBuffer.createVertexBuffer("world2", 8, 4));
            this.setVerticesBuffer(instancesBuffer.createVertexBuffer("world3", 12, 4));
        }
        else {
            if (!this._instanceDataStorage.isFrozen) {
                instancesBuffer.updateDirectly(instanceStorage.instancesData, 0, instancesCount);
            }
        }
        this._processInstancedBuffers(visibleInstances, renderSelf);
        // Stats
        this.getScene()._activeIndices.addCount(subMesh.indexCount * instancesCount, false);
        // Draw
        this._bind(subMesh, effect, fillMode);
        this._draw(subMesh, fillMode, instancesCount);
        engine.unbindInstanceAttributes();
        return this;
    };
    /** @hidden */
    Mesh.prototype._renderWithThinInstances = function (subMesh, fillMode, effect, engine) {
        var _a, _b;
        // Stats
        var instancesCount = (_b = (_a = this._thinInstanceDataStorage) === null || _a === void 0 ? void 0 : _a.instancesCount) !== null && _b !== void 0 ? _b : 0;
        this.getScene()._activeIndices.addCount(subMesh.indexCount * instancesCount, false);
        // Draw
        this._bind(subMesh, effect, fillMode);
        this._draw(subMesh, fillMode, instancesCount);
        engine.unbindInstanceAttributes();
    };
    /** @hidden */
    Mesh.prototype._processInstancedBuffers = function (visibleInstances, renderSelf) {
        // Do nothing
    };
    /** @hidden */
    Mesh.prototype._processRendering = function (renderingMesh, subMesh, effect, fillMode, batch, hardwareInstancedRendering, onBeforeDraw, effectiveMaterial) {
        var scene = this.getScene();
        var engine = scene.getEngine();
        if (hardwareInstancedRendering && subMesh.getRenderingMesh().hasThinInstances) {
            this._renderWithThinInstances(subMesh, fillMode, effect, engine);
            return this;
        }
        if (hardwareInstancedRendering) {
            this._renderWithInstances(subMesh, fillMode, batch, effect, engine);
        }
        else {
            var instanceCount = 0;
            if (batch.renderSelf[subMesh._id]) {
                // Draw
                if (onBeforeDraw) {
                    onBeforeDraw(false, renderingMesh._effectiveMesh.getWorldMatrix(), effectiveMaterial);
                }
                instanceCount++;
                this._draw(subMesh, fillMode, this._instanceDataStorage.overridenInstanceCount);
            }
            var visibleInstancesForSubMesh = batch.visibleInstances[subMesh._id];
            if (visibleInstancesForSubMesh) {
                var visibleInstanceCount = visibleInstancesForSubMesh.length;
                instanceCount += visibleInstanceCount;
                // Stats
                for (var instanceIndex = 0; instanceIndex < visibleInstanceCount; instanceIndex++) {
                    var instance = visibleInstancesForSubMesh[instanceIndex];
                    // World
                    var world = instance.getWorldMatrix();
                    if (onBeforeDraw) {
                        onBeforeDraw(true, world, effectiveMaterial);
                    }
                    // Draw
                    this._draw(subMesh, fillMode);
                }
            }
            // Stats
            scene._activeIndices.addCount(subMesh.indexCount * instanceCount, false);
        }
        return this;
    };
    /** @hidden */
    Mesh.prototype._rebuild = function () {
        if (this._instanceDataStorage.instancesBuffer) {
            // Dispose instance buffer to be recreated in _renderWithInstances when rendered
            this._instanceDataStorage.instancesBuffer.dispose();
            this._instanceDataStorage.instancesBuffer = null;
        }
        _super.prototype._rebuild.call(this);
    };
    /** @hidden */
    Mesh.prototype._freeze = function () {
        if (!this.subMeshes) {
            return;
        }
        // Prepare batches
        for (var index = 0; index < this.subMeshes.length; index++) {
            this._getInstancesRenderList(index);
        }
        this._effectiveMaterial = null;
        this._instanceDataStorage.isFrozen = true;
    };
    /** @hidden */
    Mesh.prototype._unFreeze = function () {
        this._instanceDataStorage.isFrozen = false;
        this._instanceDataStorage.previousBatch = null;
    };
    /**
     * Triggers the draw call for the mesh. Usually, you don't need to call this method by your own because the mesh rendering is handled by the scene rendering manager
     * @param subMesh defines the subMesh to render
     * @param enableAlphaMode defines if alpha mode can be changed
     * @param effectiveMeshReplacement defines an optional mesh used to provide info for the rendering
     * @returns the current mesh
     */
    Mesh.prototype.render = function (subMesh, enableAlphaMode, effectiveMeshReplacement) {
        var scene = this.getScene();
        if (this._internalAbstractMeshDataInfo._isActiveIntermediate) {
            this._internalAbstractMeshDataInfo._isActiveIntermediate = false;
        }
        else {
            this._internalAbstractMeshDataInfo._isActive = false;
        }
        if (this._checkOcclusionQuery()) {
            return this;
        }
        // Managing instances
        var batch = this._getInstancesRenderList(subMesh._id, !!effectiveMeshReplacement);
        if (batch.mustReturn) {
            return this;
        }
        // Checking geometry state
        if (!this._geometry || !this._geometry.getVertexBuffers() || (!this._unIndexed && !this._geometry.getIndexBuffer())) {
            return this;
        }
        if (this._internalMeshDataInfo._onBeforeRenderObservable) {
            this._internalMeshDataInfo._onBeforeRenderObservable.notifyObservers(this);
        }
        var engine = scene.getEngine();
        var hardwareInstancedRendering = batch.hardwareInstancedRendering[subMesh._id] || subMesh.getRenderingMesh().hasThinInstances;
        var instanceDataStorage = this._instanceDataStorage;
        var material = subMesh.getMaterial();
        if (!material) {
            return this;
        }
        // Material
        if (!instanceDataStorage.isFrozen || !this._effectiveMaterial || this._effectiveMaterial !== material) {
            if (material._storeEffectOnSubMeshes) {
                if (!material.isReadyForSubMesh(this, subMesh, hardwareInstancedRendering)) {
                    return this;
                }
            }
            else if (!material.isReady(this, hardwareInstancedRendering)) {
                return this;
            }
            this._effectiveMaterial = material;
        }
        // Alpha mode
        if (enableAlphaMode) {
            engine.setAlphaMode(this._effectiveMaterial.alphaMode);
        }
        var effect;
        if (this._effectiveMaterial._storeEffectOnSubMeshes) {
            effect = subMesh.effect;
        }
        else {
            effect = this._effectiveMaterial.getEffect();
        }
        for (var _i = 0, _a = scene._beforeRenderingMeshStage; _i < _a.length; _i++) {
            var step = _a[_i];
            step.action(this, subMesh, batch, effect);
        }
        if (!effect) {
            return this;
        }
        var effectiveMesh = effectiveMeshReplacement || this._effectiveMesh;
        var sideOrientation;
        if (!instanceDataStorage.isFrozen &&
            (this._effectiveMaterial.backFaceCulling || this.overrideMaterialSideOrientation !== null)) {
            var mainDeterminant = effectiveMesh._getWorldMatrixDeterminant();
            sideOrientation = this.overrideMaterialSideOrientation;
            if (sideOrientation == null) {
                sideOrientation = this._effectiveMaterial.sideOrientation;
            }
            if (mainDeterminant < 0) {
                sideOrientation = (sideOrientation === Material.ClockWiseSideOrientation ? Material.CounterClockWiseSideOrientation : Material.ClockWiseSideOrientation);
            }
            instanceDataStorage.sideOrientation = sideOrientation;
        }
        else {
            sideOrientation = instanceDataStorage.sideOrientation;
        }
        var reverse = this._effectiveMaterial._preBind(effect, sideOrientation);
        if (this._effectiveMaterial.forceDepthWrite) {
            engine.setDepthWrite(true);
        }
        // Bind
        var fillMode = scene.forcePointsCloud ? Material.PointFillMode : (scene.forceWireframe ? Material.WireFrameFillMode : this._effectiveMaterial.fillMode);
        if (this._internalMeshDataInfo._onBeforeBindObservable) {
            this._internalMeshDataInfo._onBeforeBindObservable.notifyObservers(this);
        }
        if (!hardwareInstancedRendering) { // Binding will be done later because we need to add more info to the VB
            this._bind(subMesh, effect, fillMode);
        }
        var world = effectiveMesh.getWorldMatrix();
        if (this._effectiveMaterial._storeEffectOnSubMeshes) {
            this._effectiveMaterial.bindForSubMesh(world, this, subMesh);
        }
        else {
            this._effectiveMaterial.bind(world, this);
        }
        if (!this._effectiveMaterial.backFaceCulling && this._effectiveMaterial.separateCullingPass) {
            engine.setState(true, this._effectiveMaterial.zOffset, false, !reverse);
            this._processRendering(this, subMesh, effect, fillMode, batch, hardwareInstancedRendering, this._onBeforeDraw, this._effectiveMaterial);
            engine.setState(true, this._effectiveMaterial.zOffset, false, reverse);
        }
        // Draw
        this._processRendering(this, subMesh, effect, fillMode, batch, hardwareInstancedRendering, this._onBeforeDraw, this._effectiveMaterial);
        // Unbind
        this._effectiveMaterial.unbind();
        for (var _b = 0, _c = scene._afterRenderingMeshStage; _b < _c.length; _b++) {
            var step = _c[_b];
            step.action(this, subMesh, batch, effect);
        }
        if (this._internalMeshDataInfo._onAfterRenderObservable) {
            this._internalMeshDataInfo._onAfterRenderObservable.notifyObservers(this);
        }
        return this;
    };
    Mesh.prototype._onBeforeDraw = function (isInstance, world, effectiveMaterial) {
        if (isInstance && effectiveMaterial) {
            effectiveMaterial.bindOnlyWorldMatrix(world);
        }
    };
    /**
     *   Renormalize the mesh and patch it up if there are no weights
     *   Similar to normalization by adding the weights compute the reciprocal and multiply all elements, this wil ensure that everything adds to 1.
     *   However in the case of zero weights then we set just a single influence to 1.
     *   We check in the function for extra's present and if so we use the normalizeSkinWeightsWithExtras rather than the FourWeights version.
     */
    Mesh.prototype.cleanMatrixWeights = function () {
        if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
            if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsExtraKind)) {
                this.normalizeSkinWeightsAndExtra();
            }
            else {
                this.normalizeSkinFourWeights();
            }
        }
    };
    // faster 4 weight version.
    Mesh.prototype.normalizeSkinFourWeights = function () {
        var matricesWeights = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
        var numWeights = matricesWeights.length;
        for (var a = 0; a < numWeights; a += 4) {
            // accumulate weights
            var t = matricesWeights[a] + matricesWeights[a + 1] + matricesWeights[a + 2] + matricesWeights[a + 3];
            // check for invalid weight and just set it to 1.
            if (t === 0) {
                matricesWeights[a] = 1;
            }
            else {
                // renormalize so everything adds to 1 use reciprical
                var recip = 1 / t;
                matricesWeights[a] *= recip;
                matricesWeights[a + 1] *= recip;
                matricesWeights[a + 2] *= recip;
                matricesWeights[a + 3] *= recip;
            }
        }
        this.setVerticesData(VertexBuffer.MatricesWeightsKind, matricesWeights);
    };
    // handle special case of extra verts.  (in theory gltf can handle 12 influences)
    Mesh.prototype.normalizeSkinWeightsAndExtra = function () {
        var matricesWeightsExtra = this.getVerticesData(VertexBuffer.MatricesWeightsExtraKind);
        var matricesWeights = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
        var numWeights = matricesWeights.length;
        for (var a = 0; a < numWeights; a += 4) {
            // accumulate weights
            var t = matricesWeights[a] + matricesWeights[a + 1] + matricesWeights[a + 2] + matricesWeights[a + 3];
            t += matricesWeightsExtra[a] + matricesWeightsExtra[a + 1] + matricesWeightsExtra[a + 2] + matricesWeightsExtra[a + 3];
            // check for invalid weight and just set it to 1.
            if (t === 0) {
                matricesWeights[a] = 1;
            }
            else {
                // renormalize so everything adds to 1 use reciprical
                var recip = 1 / t;
                matricesWeights[a] *= recip;
                matricesWeights[a + 1] *= recip;
                matricesWeights[a + 2] *= recip;
                matricesWeights[a + 3] *= recip;
                // same goes for extras
                matricesWeightsExtra[a] *= recip;
                matricesWeightsExtra[a + 1] *= recip;
                matricesWeightsExtra[a + 2] *= recip;
                matricesWeightsExtra[a + 3] *= recip;
            }
        }
        this.setVerticesData(VertexBuffer.MatricesWeightsKind, matricesWeights);
        this.setVerticesData(VertexBuffer.MatricesWeightsKind, matricesWeightsExtra);
    };
    /**
     * ValidateSkinning is used to determine that a mesh has valid skinning data along with skin metrics, if missing weights,
     * or not normalized it is returned as invalid mesh the string can be used for console logs, or on screen messages to let
     * the user know there was an issue with importing the mesh
     * @returns a validation object with skinned, valid and report string
     */
    Mesh.prototype.validateSkinning = function () {
        var matricesWeightsExtra = this.getVerticesData(VertexBuffer.MatricesWeightsExtraKind);
        var matricesWeights = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
        if (matricesWeights === null || this.skeleton == null) {
            return { skinned: false, valid: true, report: "not skinned" };
        }
        var numWeights = matricesWeights.length;
        var numberNotSorted = 0;
        var missingWeights = 0;
        var maxUsedWeights = 0;
        var numberNotNormalized = 0;
        var numInfluences = matricesWeightsExtra === null ? 4 : 8;
        var usedWeightCounts = new Array();
        for (var a = 0; a <= numInfluences; a++) {
            usedWeightCounts[a] = 0;
        }
        var toleranceEpsilon = 0.001;
        for (var a = 0; a < numWeights; a += 4) {
            var lastWeight = matricesWeights[a];
            var t = lastWeight;
            var usedWeights = t === 0 ? 0 : 1;
            for (var b = 1; b < numInfluences; b++) {
                var d = b < 4 ? matricesWeights[a + b] : matricesWeightsExtra[a + b - 4];
                if (d > lastWeight) {
                    numberNotSorted++;
                }
                if (d !== 0) {
                    usedWeights++;
                }
                t += d;
                lastWeight = d;
            }
            // count the buffer weights usage
            usedWeightCounts[usedWeights]++;
            // max influences
            if (usedWeights > maxUsedWeights) {
                maxUsedWeights = usedWeights;
            }
            // check for invalid weight and just set it to 1.
            if (t === 0) {
                missingWeights++;
            }
            else {
                // renormalize so everything adds to 1 use reciprical
                var recip = 1 / t;
                var tolerance = 0;
                for (b = 0; b < numInfluences; b++) {
                    if (b < 4) {
                        tolerance += Math.abs(matricesWeights[a + b] - (matricesWeights[a + b] * recip));
                    }
                    else {
                        tolerance += Math.abs(matricesWeightsExtra[a + b - 4] - (matricesWeightsExtra[a + b - 4] * recip));
                    }
                }
                // arbitary epsilon value for dicdating not normalized
                if (tolerance > toleranceEpsilon) {
                    numberNotNormalized++;
                }
            }
        }
        // validate bone indices are in range of the skeleton
        var numBones = this.skeleton.bones.length;
        var matricesIndices = this.getVerticesData(VertexBuffer.MatricesIndicesKind);
        var matricesIndicesExtra = this.getVerticesData(VertexBuffer.MatricesIndicesExtraKind);
        var numBadBoneIndices = 0;
        for (var a = 0; a < numWeights; a += 4) {
            for (var b = 0; b < numInfluences; b++) {
                var index = b < 4 ? matricesIndices[a + b] : matricesIndicesExtra[a + b - 4];
                if (index >= numBones || index < 0) {
                    numBadBoneIndices++;
                }
            }
        }
        // log mesh stats
        var output = "Number of Weights = " + numWeights / 4 + "\nMaximum influences = " + maxUsedWeights +
            "\nMissing Weights = " + missingWeights + "\nNot Sorted = " + numberNotSorted +
            "\nNot Normalized = " + numberNotNormalized + "\nWeightCounts = [" + usedWeightCounts + "]" +
            "\nNumber of bones = " + numBones + "\nBad Bone Indices = " + numBadBoneIndices;
        return { skinned: true, valid: missingWeights === 0 && numberNotNormalized === 0 && numBadBoneIndices === 0, report: output };
    };
    /** @hidden */
    Mesh.prototype._checkDelayState = function () {
        var scene = this.getScene();
        if (this._geometry) {
            this._geometry.load(scene);
        }
        else if (this.delayLoadState === 4) {
            this.delayLoadState = 2;
            this._queueLoad(scene);
        }
        return this;
    };
    Mesh.prototype._queueLoad = function (scene) {
        var _this = this;
        scene._addPendingData(this);
        var getBinaryData = (this.delayLoadingFile.indexOf(".babylonbinarymeshdata") !== -1);
        Tools.LoadFile(this.delayLoadingFile, function (data) {
            if (data instanceof ArrayBuffer) {
                _this._delayLoadingFunction(data, _this);
            }
            else {
                _this._delayLoadingFunction(JSON.parse(data), _this);
            }
            _this.instances.forEach(function (instance) {
                instance.refreshBoundingInfo();
                instance._syncSubMeshes();
            });
            _this.delayLoadState = 1;
            scene._removePendingData(_this);
        }, function () { }, scene.offlineProvider, getBinaryData);
        return this;
    };
    /**
     * Returns `true` if the mesh is within the frustum defined by the passed array of planes.
     * A mesh is in the frustum if its bounding box intersects the frustum
     * @param frustumPlanes defines the frustum to test
     * @returns true if the mesh is in the frustum planes
     */
    Mesh.prototype.isInFrustum = function (frustumPlanes) {
        if (this.delayLoadState === 2) {
            return false;
        }
        if (!_super.prototype.isInFrustum.call(this, frustumPlanes)) {
            return false;
        }
        this._checkDelayState();
        return true;
    };
    /**
     * Sets the mesh material by the material or multiMaterial `id` property
     * @param id is a string identifying the material or the multiMaterial
     * @returns the current mesh
     */
    Mesh.prototype.setMaterialByID = function (id) {
        var materials = this.getScene().materials;
        var index;
        for (index = materials.length - 1; index > -1; index--) {
            if (materials[index].id === id) {
                this.material = materials[index];
                return this;
            }
        }
        // Multi
        var multiMaterials = this.getScene().multiMaterials;
        for (index = multiMaterials.length - 1; index > -1; index--) {
            if (multiMaterials[index].id === id) {
                this.material = multiMaterials[index];
                return this;
            }
        }
        return this;
    };
    /**
     * Returns as a new array populated with the mesh material and/or skeleton, if any.
     * @returns an array of IAnimatable
     */
    Mesh.prototype.getAnimatables = function () {
        var results = new Array();
        if (this.material) {
            results.push(this.material);
        }
        if (this.skeleton) {
            results.push(this.skeleton);
        }
        return results;
    };
    /**
     * Modifies the mesh geometry according to the passed transformation matrix.
     * This method returns nothing but it really modifies the mesh even if it's originally not set as updatable.
     * The mesh normals are modified using the same transformation.
     * Note that, under the hood, this method sets a new VertexBuffer each call.
     * @param transform defines the transform matrix to use
     * @see https://doc.babylonjs.com/resources/baking_transformations
     * @returns the current mesh
     */
    Mesh.prototype.bakeTransformIntoVertices = function (transform) {
        // Position
        if (!this.isVerticesDataPresent(VertexBuffer.PositionKind)) {
            return this;
        }
        var submeshes = this.subMeshes.splice(0);
        this._resetPointsArrayCache();
        var data = this.getVerticesData(VertexBuffer.PositionKind);
        var temp = new Array();
        var index;
        for (index = 0; index < data.length; index += 3) {
            Vector3.TransformCoordinates(Vector3.FromArray(data, index), transform).toArray(temp, index);
        }
        this.setVerticesData(VertexBuffer.PositionKind, temp, this.getVertexBuffer(VertexBuffer.PositionKind).isUpdatable());
        // Normals
        if (this.isVerticesDataPresent(VertexBuffer.NormalKind)) {
            data = this.getVerticesData(VertexBuffer.NormalKind);
            temp = [];
            for (index = 0; index < data.length; index += 3) {
                Vector3.TransformNormal(Vector3.FromArray(data, index), transform).normalize().toArray(temp, index);
            }
            this.setVerticesData(VertexBuffer.NormalKind, temp, this.getVertexBuffer(VertexBuffer.NormalKind).isUpdatable());
        }
        // flip faces?
        if (transform.m[0] * transform.m[5] * transform.m[10] < 0) {
            this.flipFaces();
        }
        // Restore submeshes
        this.releaseSubMeshes();
        this.subMeshes = submeshes;
        return this;
    };
    /**
     * Modifies the mesh geometry according to its own current World Matrix.
     * The mesh World Matrix is then reset.
     * This method returns nothing but really modifies the mesh even if it's originally not set as updatable.
     * Note that, under the hood, this method sets a new VertexBuffer each call.
     * @see https://doc.babylonjs.com/resources/baking_transformations
     * @param bakeIndependenlyOfChildren indicates whether to preserve all child nodes' World Matrix during baking
     * @returns the current mesh
     */
    Mesh.prototype.bakeCurrentTransformIntoVertices = function (bakeIndependenlyOfChildren) {
        if (bakeIndependenlyOfChildren === void 0) { bakeIndependenlyOfChildren = true; }
        this.bakeTransformIntoVertices(this.computeWorldMatrix(true));
        this.resetLocalMatrix(bakeIndependenlyOfChildren);
        return this;
    };
    Object.defineProperty(Mesh.prototype, "_positions", {
        // Cache
        /** @hidden */
        get: function () {
            if (this._geometry) {
                return this._geometry._positions;
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    Mesh.prototype._resetPointsArrayCache = function () {
        if (this._geometry) {
            this._geometry._resetPointsArrayCache();
        }
        return this;
    };
    /** @hidden */
    Mesh.prototype._generatePointsArray = function () {
        if (this._geometry) {
            return this._geometry._generatePointsArray();
        }
        return false;
    };
    /**
     * Returns a new Mesh object generated from the current mesh properties.
     * This method must not get confused with createInstance()
     * @param name is a string, the name given to the new mesh
     * @param newParent can be any Node object (default `null`)
     * @param doNotCloneChildren allows/denies the recursive cloning of the original mesh children if any (default `false`)
     * @param clonePhysicsImpostor allows/denies the cloning in the same time of the original mesh `body` used by the physics engine, if any (default `true`)
     * @returns a new mesh
     */
    Mesh.prototype.clone = function (name, newParent, doNotCloneChildren, clonePhysicsImpostor) {
        if (name === void 0) { name = ""; }
        if (newParent === void 0) { newParent = null; }
        if (clonePhysicsImpostor === void 0) { clonePhysicsImpostor = true; }
        return new Mesh(name, this.getScene(), newParent, this, doNotCloneChildren, clonePhysicsImpostor);
    };
    /**
     * Releases resources associated with this mesh.
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
     */
    Mesh.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
        if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
        this.morphTargetManager = null;
        if (this._geometry) {
            this._geometry.releaseForMesh(this, true);
        }
        var internalDataInfo = this._internalMeshDataInfo;
        if (internalDataInfo._onBeforeDrawObservable) {
            internalDataInfo._onBeforeDrawObservable.clear();
        }
        if (internalDataInfo._onBeforeBindObservable) {
            internalDataInfo._onBeforeBindObservable.clear();
        }
        if (internalDataInfo._onBeforeRenderObservable) {
            internalDataInfo._onBeforeRenderObservable.clear();
        }
        if (internalDataInfo._onAfterRenderObservable) {
            internalDataInfo._onAfterRenderObservable.clear();
        }
        // Sources
        if (this._scene.useClonedMeshMap) {
            if (internalDataInfo.meshMap) {
                for (var uniqueId in internalDataInfo.meshMap) {
                    var mesh = internalDataInfo.meshMap[uniqueId];
                    if (mesh) {
                        mesh._internalMeshDataInfo._source = null;
                        internalDataInfo.meshMap[uniqueId] = undefined;
                    }
                }
            }
            if (internalDataInfo._source && internalDataInfo._source._internalMeshDataInfo.meshMap) {
                internalDataInfo._source._internalMeshDataInfo.meshMap[this.uniqueId] = undefined;
            }
        }
        else {
            var meshes = this.getScene().meshes;
            for (var _i = 0, meshes_1 = meshes; _i < meshes_1.length; _i++) {
                var abstractMesh = meshes_1[_i];
                var mesh = abstractMesh;
                if (mesh._internalMeshDataInfo && mesh._internalMeshDataInfo._source && mesh._internalMeshDataInfo._source === this) {
                    mesh._internalMeshDataInfo._source = null;
                }
            }
        }
        internalDataInfo._source = null;
        // Instances
        this._disposeInstanceSpecificData();
        // Thin instances
        this._disposeThinInstanceSpecificData();
        _super.prototype.dispose.call(this, doNotRecurse, disposeMaterialAndTextures);
    };
    /** @hidden */
    Mesh.prototype._disposeInstanceSpecificData = function () {
        // Do nothing
    };
    /** @hidden */
    Mesh.prototype._disposeThinInstanceSpecificData = function () {
        // Do nothing
    };
    /**
     * Modifies the mesh geometry according to a displacement map.
     * A displacement map is a colored image. Each pixel color value (actually a gradient computed from red, green, blue values) will give the displacement to apply to each mesh vertex.
     * The mesh must be set as updatable. Its internal geometry is directly modified, no new buffer are allocated.
     * @param url is a string, the URL from the image file is to be downloaded.
     * @param minHeight is the lower limit of the displacement.
     * @param maxHeight is the upper limit of the displacement.
     * @param onSuccess is an optional Javascript function to be called just after the mesh is modified. It is passed the modified mesh and must return nothing.
     * @param uvOffset is an optional vector2 used to offset UV.
     * @param uvScale is an optional vector2 used to scale UV.
     * @param forceUpdate defines whether or not to force an update of the generated buffers. This is useful to apply on a deserialized model for instance.
     * @returns the Mesh.
     */
    Mesh.prototype.applyDisplacementMap = function (url, minHeight, maxHeight, onSuccess, uvOffset, uvScale, forceUpdate) {
        var _this = this;
        if (forceUpdate === void 0) { forceUpdate = false; }
        var scene = this.getScene();
        var onload = function (img) {
            // Getting height map data
            var heightMapWidth = img.width;
            var heightMapHeight = img.height;
            var canvas = CanvasGenerator.CreateCanvas(heightMapWidth, heightMapHeight);
            var context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            // Create VertexData from map data
            //Cast is due to wrong definition in lib.d.ts from ts 1.3 - https://github.com/Microsoft/TypeScript/issues/949
            var buffer = context.getImageData(0, 0, heightMapWidth, heightMapHeight).data;
            _this.applyDisplacementMapFromBuffer(buffer, heightMapWidth, heightMapHeight, minHeight, maxHeight, uvOffset, uvScale, forceUpdate);
            //execute success callback, if set
            if (onSuccess) {
                onSuccess(_this);
            }
        };
        Tools.LoadImage(url, onload, function () { }, scene.offlineProvider);
        return this;
    };
    /**
     * Modifies the mesh geometry according to a displacementMap buffer.
     * A displacement map is a colored image. Each pixel color value (actually a gradient computed from red, green, blue values) will give the displacement to apply to each mesh vertex.
     * The mesh must be set as updatable. Its internal geometry is directly modified, no new buffer are allocated.
     * @param buffer is a `Uint8Array` buffer containing series of `Uint8` lower than 255, the red, green, blue and alpha values of each successive pixel.
     * @param heightMapWidth is the width of the buffer image.
     * @param heightMapHeight is the height of the buffer image.
     * @param minHeight is the lower limit of the displacement.
     * @param maxHeight is the upper limit of the displacement.
     * @param onSuccess is an optional Javascript function to be called just after the mesh is modified. It is passed the modified mesh and must return nothing.
     * @param uvOffset is an optional vector2 used to offset UV.
     * @param uvScale is an optional vector2 used to scale UV.
     * @param forceUpdate defines whether or not to force an update of the generated buffers. This is useful to apply on a deserialized model for instance.
     * @returns the Mesh.
     */
    Mesh.prototype.applyDisplacementMapFromBuffer = function (buffer, heightMapWidth, heightMapHeight, minHeight, maxHeight, uvOffset, uvScale, forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        if (!this.isVerticesDataPresent(VertexBuffer.PositionKind)
            || !this.isVerticesDataPresent(VertexBuffer.NormalKind)
            || !this.isVerticesDataPresent(VertexBuffer.UVKind)) {
            Logger.Warn("Cannot call applyDisplacementMap: Given mesh is not complete. Position, Normal or UV are missing");
            return this;
        }
        var positions = this.getVerticesData(VertexBuffer.PositionKind, true, true);
        var normals = this.getVerticesData(VertexBuffer.NormalKind);
        var uvs = this.getVerticesData(VertexBuffer.UVKind);
        var position = Vector3.Zero();
        var normal = Vector3.Zero();
        var uv = Vector2.Zero();
        uvOffset = uvOffset || Vector2.Zero();
        uvScale = uvScale || new Vector2(1, 1);
        for (var index = 0; index < positions.length; index += 3) {
            Vector3.FromArrayToRef(positions, index, position);
            Vector3.FromArrayToRef(normals, index, normal);
            Vector2.FromArrayToRef(uvs, (index / 3) * 2, uv);
            // Compute height
            var u = ((Math.abs(uv.x * uvScale.x + uvOffset.x % 1) * (heightMapWidth - 1)) % heightMapWidth) | 0;
            var v = ((Math.abs(uv.y * uvScale.y + uvOffset.y % 1) * (heightMapHeight - 1)) % heightMapHeight) | 0;
            var pos = (u + v * heightMapWidth) * 4;
            var r = buffer[pos] / 255.0;
            var g = buffer[pos + 1] / 255.0;
            var b = buffer[pos + 2] / 255.0;
            var gradient = r * 0.3 + g * 0.59 + b * 0.11;
            normal.normalize();
            normal.scaleInPlace(minHeight + (maxHeight - minHeight) * gradient);
            position = position.add(normal);
            position.toArray(positions, index);
        }
        VertexData.ComputeNormals(positions, this.getIndices(), normals);
        if (forceUpdate) {
            this.setVerticesData(VertexBuffer.PositionKind, positions);
            this.setVerticesData(VertexBuffer.NormalKind, normals);
        }
        else {
            this.updateVerticesData(VertexBuffer.PositionKind, positions);
            this.updateVerticesData(VertexBuffer.NormalKind, normals);
        }
        return this;
    };
    /**
     * Modify the mesh to get a flat shading rendering.
     * This means each mesh facet will then have its own normals. Usually new vertices are added in the mesh geometry to get this result.
     * Warning : the mesh is really modified even if not set originally as updatable and, under the hood, a new VertexBuffer is allocated.
     * @returns current mesh
     */
    Mesh.prototype.convertToFlatShadedMesh = function () {
        var kinds = this.getVerticesDataKinds();
        var vbs = {};
        var data = {};
        var newdata = {};
        var updatableNormals = false;
        var kindIndex;
        var kind;
        for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
            kind = kinds[kindIndex];
            var vertexBuffer = this.getVertexBuffer(kind);
            if (kind === VertexBuffer.NormalKind) {
                updatableNormals = vertexBuffer.isUpdatable();
                kinds.splice(kindIndex, 1);
                kindIndex--;
                continue;
            }
            vbs[kind] = vertexBuffer;
            data[kind] = vbs[kind].getData();
            newdata[kind] = [];
        }
        // Save previous submeshes
        var previousSubmeshes = this.subMeshes.slice(0);
        var indices = this.getIndices();
        var totalIndices = this.getTotalIndices();
        // Generating unique vertices per face
        var index;
        for (index = 0; index < totalIndices; index++) {
            var vertexIndex = indices[index];
            for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
                kind = kinds[kindIndex];
                var stride = vbs[kind].getStrideSize();
                for (var offset = 0; offset < stride; offset++) {
                    newdata[kind].push(data[kind][vertexIndex * stride + offset]);
                }
            }
        }
        // Updating faces & normal
        var normals = [];
        var positions = newdata[VertexBuffer.PositionKind];
        for (index = 0; index < totalIndices; index += 3) {
            indices[index] = index;
            indices[index + 1] = index + 1;
            indices[index + 2] = index + 2;
            var p1 = Vector3.FromArray(positions, index * 3);
            var p2 = Vector3.FromArray(positions, (index + 1) * 3);
            var p3 = Vector3.FromArray(positions, (index + 2) * 3);
            var p1p2 = p1.subtract(p2);
            var p3p2 = p3.subtract(p2);
            var normal = Vector3.Normalize(Vector3.Cross(p1p2, p3p2));
            // Store same normals for every vertex
            for (var localIndex = 0; localIndex < 3; localIndex++) {
                normals.push(normal.x);
                normals.push(normal.y);
                normals.push(normal.z);
            }
        }
        this.setIndices(indices);
        this.setVerticesData(VertexBuffer.NormalKind, normals, updatableNormals);
        // Updating vertex buffers
        for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
            kind = kinds[kindIndex];
            this.setVerticesData(kind, newdata[kind], vbs[kind].isUpdatable());
        }
        // Updating submeshes
        this.releaseSubMeshes();
        for (var submeshIndex = 0; submeshIndex < previousSubmeshes.length; submeshIndex++) {
            var previousOne = previousSubmeshes[submeshIndex];
            SubMesh.AddToMesh(previousOne.materialIndex, previousOne.indexStart, previousOne.indexCount, previousOne.indexStart, previousOne.indexCount, this);
        }
        this.synchronizeInstances();
        return this;
    };
    /**
     * This method removes all the mesh indices and add new vertices (duplication) in order to unfold facets into buffers.
     * In other words, more vertices, no more indices and a single bigger VBO.
     * The mesh is really modified even if not set originally as updatable. Under the hood, a new VertexBuffer is allocated.
     * @returns current mesh
     */
    Mesh.prototype.convertToUnIndexedMesh = function () {
        var kinds = this.getVerticesDataKinds();
        var vbs = {};
        var data = {};
        var newdata = {};
        var kindIndex;
        var kind;
        for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
            kind = kinds[kindIndex];
            var vertexBuffer = this.getVertexBuffer(kind);
            vbs[kind] = vertexBuffer;
            data[kind] = vbs[kind].getData();
            newdata[kind] = [];
        }
        // Save previous submeshes
        var previousSubmeshes = this.subMeshes.slice(0);
        var indices = this.getIndices();
        var totalIndices = this.getTotalIndices();
        // Generating unique vertices per face
        var index;
        for (index = 0; index < totalIndices; index++) {
            var vertexIndex = indices[index];
            for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
                kind = kinds[kindIndex];
                var stride = vbs[kind].getStrideSize();
                for (var offset = 0; offset < stride; offset++) {
                    newdata[kind].push(data[kind][vertexIndex * stride + offset]);
                }
            }
        }
        // Updating indices
        for (index = 0; index < totalIndices; index += 3) {
            indices[index] = index;
            indices[index + 1] = index + 1;
            indices[index + 2] = index + 2;
        }
        this.setIndices(indices);
        // Updating vertex buffers
        for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
            kind = kinds[kindIndex];
            this.setVerticesData(kind, newdata[kind], vbs[kind].isUpdatable());
        }
        // Updating submeshes
        this.releaseSubMeshes();
        for (var submeshIndex = 0; submeshIndex < previousSubmeshes.length; submeshIndex++) {
            var previousOne = previousSubmeshes[submeshIndex];
            SubMesh.AddToMesh(previousOne.materialIndex, previousOne.indexStart, previousOne.indexCount, previousOne.indexStart, previousOne.indexCount, this);
        }
        this._unIndexed = true;
        this.synchronizeInstances();
        return this;
    };
    /**
     * Inverses facet orientations.
     * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
     * @param flipNormals will also inverts the normals
     * @returns current mesh
     */
    Mesh.prototype.flipFaces = function (flipNormals) {
        if (flipNormals === void 0) { flipNormals = false; }
        var vertex_data = VertexData.ExtractFromMesh(this);
        var i;
        if (flipNormals && this.isVerticesDataPresent(VertexBuffer.NormalKind) && vertex_data.normals) {
            for (i = 0; i < vertex_data.normals.length; i++) {
                vertex_data.normals[i] *= -1;
            }
        }
        if (vertex_data.indices) {
            var temp;
            for (i = 0; i < vertex_data.indices.length; i += 3) {
                // reassign indices
                temp = vertex_data.indices[i + 1];
                vertex_data.indices[i + 1] = vertex_data.indices[i + 2];
                vertex_data.indices[i + 2] = temp;
            }
        }
        vertex_data.applyToMesh(this, this.isVertexBufferUpdatable(VertexBuffer.PositionKind));
        return this;
    };
    /**
     * Increase the number of facets and hence vertices in a mesh
     * Vertex normals are interpolated from existing vertex normals
     * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
     * @param numberPerEdge the number of new vertices to add to each edge of a facet, optional default 1
     */
    Mesh.prototype.increaseVertices = function (numberPerEdge) {
        var vertex_data = VertexData.ExtractFromMesh(this);
        var uvs = vertex_data.uvs;
        var currentIndices = vertex_data.indices;
        var positions = vertex_data.positions;
        var normals = vertex_data.normals;
        if (!currentIndices || !positions || !normals || !uvs) {
            Logger.Warn("VertexData contains null entries");
        }
        else {
            var segments = numberPerEdge + 1; //segments per current facet edge, become sides of new facets
            var tempIndices = new Array();
            for (var i = 0; i < segments + 1; i++) {
                tempIndices[i] = new Array();
            }
            var a; //vertex index of one end of a side
            var b; //vertex index of other end of the side
            var deltaPosition = new Vector3(0, 0, 0);
            var deltaNormal = new Vector3(0, 0, 0);
            var deltaUV = new Vector2(0, 0);
            var indices = new Array();
            var vertexIndex = new Array();
            var side = new Array();
            var len;
            var positionPtr = positions.length;
            var uvPtr = uvs.length;
            for (var i = 0; i < currentIndices.length; i += 3) {
                vertexIndex[0] = currentIndices[i];
                vertexIndex[1] = currentIndices[i + 1];
                vertexIndex[2] = currentIndices[i + 2];
                for (var j = 0; j < 3; j++) {
                    a = vertexIndex[j];
                    b = vertexIndex[(j + 1) % 3];
                    if (side[a] === undefined && side[b] === undefined) {
                        side[a] = new Array();
                        side[b] = new Array();
                    }
                    else {
                        if (side[a] === undefined) {
                            side[a] = new Array();
                        }
                        if (side[b] === undefined) {
                            side[b] = new Array();
                        }
                    }
                    if (side[a][b] === undefined && side[b][a] === undefined) {
                        side[a][b] = [];
                        deltaPosition.x = (positions[3 * b] - positions[3 * a]) / segments;
                        deltaPosition.y = (positions[3 * b + 1] - positions[3 * a + 1]) / segments;
                        deltaPosition.z = (positions[3 * b + 2] - positions[3 * a + 2]) / segments;
                        deltaNormal.x = (normals[3 * b] - normals[3 * a]) / segments;
                        deltaNormal.y = (normals[3 * b + 1] - normals[3 * a + 1]) / segments;
                        deltaNormal.z = (normals[3 * b + 2] - normals[3 * a + 2]) / segments;
                        deltaUV.x = (uvs[2 * b] - uvs[2 * a]) / segments;
                        deltaUV.y = (uvs[2 * b + 1] - uvs[2 * a + 1]) / segments;
                        side[a][b].push(a);
                        for (var k = 1; k < segments; k++) {
                            side[a][b].push(positions.length / 3);
                            positions[positionPtr] = positions[3 * a] + k * deltaPosition.x;
                            normals[positionPtr++] = normals[3 * a] + k * deltaNormal.x;
                            positions[positionPtr] = positions[3 * a + 1] + k * deltaPosition.y;
                            normals[positionPtr++] = normals[3 * a + 1] + k * deltaNormal.y;
                            positions[positionPtr] = positions[3 * a + 2] + k * deltaPosition.z;
                            normals[positionPtr++] = normals[3 * a + 2] + k * deltaNormal.z;
                            uvs[uvPtr++] = uvs[2 * a] + k * deltaUV.x;
                            uvs[uvPtr++] = uvs[2 * a + 1] + k * deltaUV.y;
                        }
                        side[a][b].push(b);
                        side[b][a] = new Array();
                        len = side[a][b].length;
                        for (var idx = 0; idx < len; idx++) {
                            side[b][a][idx] = side[a][b][len - 1 - idx];
                        }
                    }
                }
                //Calculate positions, normals and uvs of new internal vertices
                tempIndices[0][0] = currentIndices[i];
                tempIndices[1][0] = side[currentIndices[i]][currentIndices[i + 1]][1];
                tempIndices[1][1] = side[currentIndices[i]][currentIndices[i + 2]][1];
                for (var k = 2; k < segments; k++) {
                    tempIndices[k][0] = side[currentIndices[i]][currentIndices[i + 1]][k];
                    tempIndices[k][k] = side[currentIndices[i]][currentIndices[i + 2]][k];
                    deltaPosition.x = (positions[3 * tempIndices[k][k]] - positions[3 * tempIndices[k][0]]) / k;
                    deltaPosition.y = (positions[3 * tempIndices[k][k] + 1] - positions[3 * tempIndices[k][0] + 1]) / k;
                    deltaPosition.z = (positions[3 * tempIndices[k][k] + 2] - positions[3 * tempIndices[k][0] + 2]) / k;
                    deltaNormal.x = (normals[3 * tempIndices[k][k]] - normals[3 * tempIndices[k][0]]) / k;
                    deltaNormal.y = (normals[3 * tempIndices[k][k] + 1] - normals[3 * tempIndices[k][0] + 1]) / k;
                    deltaNormal.z = (normals[3 * tempIndices[k][k] + 2] - normals[3 * tempIndices[k][0] + 2]) / k;
                    deltaUV.x = (uvs[2 * tempIndices[k][k]] - uvs[2 * tempIndices[k][0]]) / k;
                    deltaUV.y = (uvs[2 * tempIndices[k][k] + 1] - uvs[2 * tempIndices[k][0] + 1]) / k;
                    for (var j = 1; j < k; j++) {
                        tempIndices[k][j] = positions.length / 3;
                        positions[positionPtr] = positions[3 * tempIndices[k][0]] + j * deltaPosition.x;
                        normals[positionPtr++] = normals[3 * tempIndices[k][0]] + j * deltaNormal.x;
                        positions[positionPtr] = positions[3 * tempIndices[k][0] + 1] + j * deltaPosition.y;
                        normals[positionPtr++] = normals[3 * tempIndices[k][0] + 1] + j * deltaNormal.y;
                        positions[positionPtr] = positions[3 * tempIndices[k][0] + 2] + j * deltaPosition.z;
                        normals[positionPtr++] = normals[3 * tempIndices[k][0] + 2] + j * deltaNormal.z;
                        uvs[uvPtr++] = uvs[2 * tempIndices[k][0]] + j * deltaUV.x;
                        uvs[uvPtr++] = uvs[2 * tempIndices[k][0] + 1] + j * deltaUV.y;
                    }
                }
                tempIndices[segments] = side[currentIndices[i + 1]][currentIndices[i + 2]];
                // reform indices
                indices.push(tempIndices[0][0], tempIndices[1][0], tempIndices[1][1]);
                for (var k = 1; k < segments; k++) {
                    for (var j = 0; j < k; j++) {
                        indices.push(tempIndices[k][j], tempIndices[k + 1][j], tempIndices[k + 1][j + 1]);
                        indices.push(tempIndices[k][j], tempIndices[k + 1][j + 1], tempIndices[k][j + 1]);
                    }
                    indices.push(tempIndices[k][j], tempIndices[k + 1][j], tempIndices[k + 1][j + 1]);
                }
            }
            vertex_data.indices = indices;
            vertex_data.applyToMesh(this, this.isVertexBufferUpdatable(VertexBuffer.PositionKind));
        }
    };
    /**
     * Force adjacent facets to share vertices and remove any facets that have all vertices in a line
     * This will undo any application of covertToFlatShadedMesh
     * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
     */
    Mesh.prototype.forceSharedVertices = function () {
        var vertex_data = VertexData.ExtractFromMesh(this);
        var currentUVs = vertex_data.uvs;
        var currentIndices = vertex_data.indices;
        var currentPositions = vertex_data.positions;
        var currentColors = vertex_data.colors;
        if (currentIndices === void 0 || currentPositions === void 0 || currentIndices === null || currentPositions === null) {
            Logger.Warn("VertexData contains empty entries");
        }
        else {
            var positions = new Array();
            var indices = new Array();
            var uvs = new Array();
            var colors = new Array();
            var pstring = new Array(); //lists facet vertex positions (a,b,c) as string "a|b|c"
            var indexPtr = 0; // pointer to next available index value
            var uniquePositions = {}; // unique vertex positions
            var ptr; // pointer to element in uniquePositions
            var facet;
            for (var i = 0; i < currentIndices.length; i += 3) {
                facet = [currentIndices[i], currentIndices[i + 1], currentIndices[i + 2]]; //facet vertex indices
                pstring = new Array();
                for (var j = 0; j < 3; j++) {
                    pstring[j] = "";
                    for (var k = 0; k < 3; k++) {
                        //small values make 0
                        if (Math.abs(currentPositions[3 * facet[j] + k]) < 0.00000001) {
                            currentPositions[3 * facet[j] + k] = 0;
                        }
                        pstring[j] += currentPositions[3 * facet[j] + k] + "|";
                    }
                }
                //check facet vertices to see that none are repeated
                // do not process any facet that has a repeated vertex, ie is a line
                if (!(pstring[0] == pstring[1] || pstring[0] == pstring[2] || pstring[1] == pstring[2])) {
                    //for each facet position check if already listed in uniquePositions
                    // if not listed add to uniquePositions and set index pointer
                    // if listed use its index in uniquePositions and new index pointer
                    for (var j = 0; j < 3; j++) {
                        ptr = uniquePositions[pstring[j]];
                        if (ptr === undefined) {
                            uniquePositions[pstring[j]] = indexPtr;
                            ptr = indexPtr++;
                            //not listed so add individual x, y, z coordinates to positions
                            for (var k = 0; k < 3; k++) {
                                positions.push(currentPositions[3 * facet[j] + k]);
                            }
                            if (currentColors !== null && currentColors !== void 0) {
                                for (var k = 0; k < 4; k++) {
                                    colors.push(currentColors[4 * facet[j] + k]);
                                }
                            }
                            if (currentUVs !== null && currentUVs !== void 0) {
                                for (var k = 0; k < 2; k++) {
                                    uvs.push(currentUVs[2 * facet[j] + k]);
                                }
                            }
                        }
                        // add new index pointer to indices array
                        indices.push(ptr);
                    }
                }
            }
            var normals = new Array();
            VertexData.ComputeNormals(positions, indices, normals);
            //create new vertex data object and update
            vertex_data.positions = positions;
            vertex_data.indices = indices;
            vertex_data.normals = normals;
            if (currentUVs !== null && currentUVs !== void 0) {
                vertex_data.uvs = uvs;
            }
            if (currentColors !== null && currentColors !== void 0) {
                vertex_data.colors = colors;
            }
            vertex_data.applyToMesh(this, this.isVertexBufferUpdatable(VertexBuffer.PositionKind));
        }
    };
    // Instances
    /** @hidden */
    Mesh._instancedMeshFactory = function (name, mesh) {
        throw _DevTools.WarnImport("InstancedMesh");
    };
    /** @hidden */
    Mesh._PhysicsImpostorParser = function (scene, physicObject, jsonObject) {
        throw _DevTools.WarnImport("PhysicsImpostor");
    };
    /**
     * Creates a new InstancedMesh object from the mesh model.
     * @see https://doc.babylonjs.com/how_to/how_to_use_instances
     * @param name defines the name of the new instance
     * @returns a new InstancedMesh
     */
    Mesh.prototype.createInstance = function (name) {
        var geometry = this.geometry;
        if (geometry && geometry.meshes.length > 1) {
            var others = geometry.meshes.slice(0);
            for (var _i = 0, others_1 = others; _i < others_1.length; _i++) {
                var other = others_1[_i];
                if (other === this) {
                    continue;
                }
                other.makeGeometryUnique();
            }
        }
        return Mesh._instancedMeshFactory(name, this);
    };
    /**
     * Synchronises all the mesh instance submeshes to the current mesh submeshes, if any.
     * After this call, all the mesh instances have the same submeshes than the current mesh.
     * @returns the current mesh
     */
    Mesh.prototype.synchronizeInstances = function () {
        if (this._geometry && this._geometry.meshes.length !== 1 && this.instances.length) {
            this.makeGeometryUnique();
        }
        for (var instanceIndex = 0; instanceIndex < this.instances.length; instanceIndex++) {
            var instance = this.instances[instanceIndex];
            instance._syncSubMeshes();
        }
        return this;
    };
    /**
     * Optimization of the mesh's indices, in case a mesh has duplicated vertices.
     * The function will only reorder the indices and will not remove unused vertices to avoid problems with submeshes.
     * This should be used together with the simplification to avoid disappearing triangles.
     * @param successCallback an optional success callback to be called after the optimization finished.
     * @returns the current mesh
     */
    Mesh.prototype.optimizeIndices = function (successCallback) {
        var _this = this;
        var indices = this.getIndices();
        var positions = this.getVerticesData(VertexBuffer.PositionKind);
        if (!positions || !indices) {
            return this;
        }
        var vectorPositions = new Array();
        for (var pos = 0; pos < positions.length; pos = pos + 3) {
            vectorPositions.push(Vector3.FromArray(positions, pos));
        }
        var dupes = new Array();
        AsyncLoop.SyncAsyncForLoop(vectorPositions.length, 40, function (iteration) {
            var realPos = vectorPositions.length - 1 - iteration;
            var testedPosition = vectorPositions[realPos];
            for (var j = 0; j < realPos; ++j) {
                var againstPosition = vectorPositions[j];
                if (testedPosition.equals(againstPosition)) {
                    dupes[realPos] = j;
                    break;
                }
            }
        }, function () {
            for (var i = 0; i < indices.length; ++i) {
                indices[i] = dupes[indices[i]] || indices[i];
            }
            //indices are now reordered
            var originalSubMeshes = _this.subMeshes.slice(0);
            _this.setIndices(indices);
            _this.subMeshes = originalSubMeshes;
            if (successCallback) {
                successCallback(_this);
            }
        });
        return this;
    };
    /**
     * Serialize current mesh
     * @param serializationObject defines the object which will receive the serialization data
     */
    Mesh.prototype.serialize = function (serializationObject) {
        serializationObject.name = this.name;
        serializationObject.id = this.id;
        serializationObject.uniqueId = this.uniqueId;
        serializationObject.type = this.getClassName();
        if (Tags && Tags.HasTags(this)) {
            serializationObject.tags = Tags.GetTags(this);
        }
        serializationObject.position = this.position.asArray();
        if (this.rotationQuaternion) {
            serializationObject.rotationQuaternion = this.rotationQuaternion.asArray();
        }
        else if (this.rotation) {
            serializationObject.rotation = this.rotation.asArray();
        }
        serializationObject.scaling = this.scaling.asArray();
        if (this._postMultiplyPivotMatrix) {
            serializationObject.pivotMatrix = this.getPivotMatrix().asArray();
        }
        else {
            serializationObject.localMatrix = this.getPivotMatrix().asArray();
        }
        serializationObject.isEnabled = this.isEnabled(false);
        serializationObject.isVisible = this.isVisible;
        serializationObject.infiniteDistance = this.infiniteDistance;
        serializationObject.pickable = this.isPickable;
        serializationObject.receiveShadows = this.receiveShadows;
        serializationObject.billboardMode = this.billboardMode;
        serializationObject.visibility = this.visibility;
        serializationObject.checkCollisions = this.checkCollisions;
        serializationObject.isBlocker = this.isBlocker;
        serializationObject.overrideMaterialSideOrientation = this.overrideMaterialSideOrientation;
        // Parent
        if (this.parent) {
            serializationObject.parentId = this.parent.id;
        }
        // Geometry
        serializationObject.isUnIndexed = this.isUnIndexed;
        var geometry = this._geometry;
        if (geometry) {
            var geometryId = geometry.id;
            serializationObject.geometryId = geometryId;
            // SubMeshes
            serializationObject.subMeshes = [];
            for (var subIndex = 0; subIndex < this.subMeshes.length; subIndex++) {
                var subMesh = this.subMeshes[subIndex];
                serializationObject.subMeshes.push({
                    materialIndex: subMesh.materialIndex,
                    verticesStart: subMesh.verticesStart,
                    verticesCount: subMesh.verticesCount,
                    indexStart: subMesh.indexStart,
                    indexCount: subMesh.indexCount
                });
            }
        }
        // Material
        if (this.material) {
            if (!this.material.doNotSerialize) {
                serializationObject.materialId = this.material.id;
            }
        }
        else {
            this.material = null;
        }
        // Morph targets
        if (this.morphTargetManager) {
            serializationObject.morphTargetManagerId = this.morphTargetManager.uniqueId;
        }
        // Skeleton
        if (this.skeleton) {
            serializationObject.skeletonId = this.skeleton.id;
            serializationObject.numBoneInfluencers = this.numBoneInfluencers;
        }
        // Physics
        //TODO implement correct serialization for physics impostors.
        if (this.getScene()._getComponent(SceneComponentConstants.NAME_PHYSICSENGINE)) {
            var impostor = this.getPhysicsImpostor();
            if (impostor) {
                serializationObject.physicsMass = impostor.getParam("mass");
                serializationObject.physicsFriction = impostor.getParam("friction");
                serializationObject.physicsRestitution = impostor.getParam("mass");
                serializationObject.physicsImpostor = impostor.type;
            }
        }
        // Metadata
        if (this.metadata) {
            serializationObject.metadata = this.metadata;
        }
        // Instances
        serializationObject.instances = [];
        for (var index = 0; index < this.instances.length; index++) {
            var instance = this.instances[index];
            if (instance.doNotSerialize) {
                continue;
            }
            var serializationInstance = {
                name: instance.name,
                id: instance.id,
                isEnabled: instance.isEnabled(false),
                isVisible: instance.isVisible,
                isPickable: instance.isPickable,
                checkCollisions: instance.checkCollisions,
                position: instance.position.asArray(),
                scaling: instance.scaling.asArray()
            };
            if (instance.parent) {
                serializationInstance.parentId = instance.parent.id;
            }
            if (instance.rotationQuaternion) {
                serializationInstance.rotationQuaternion = instance.rotationQuaternion.asArray();
            }
            else if (instance.rotation) {
                serializationInstance.rotation = instance.rotation.asArray();
            }
            // Physics
            //TODO implement correct serialization for physics impostors.
            if (this.getScene()._getComponent(SceneComponentConstants.NAME_PHYSICSENGINE)) {
                var impostor = instance.getPhysicsImpostor();
                if (impostor) {
                    serializationInstance.physicsMass = impostor.getParam("mass");
                    serializationInstance.physicsFriction = impostor.getParam("friction");
                    serializationInstance.physicsRestitution = impostor.getParam("mass");
                    serializationInstance.physicsImpostor = impostor.type;
                }
            }
            // Metadata
            if (instance.metadata) {
                serializationInstance.metadata = instance.metadata;
            }
            serializationObject.instances.push(serializationInstance);
            // Animations
            SerializationHelper.AppendSerializedAnimations(instance, serializationInstance);
            serializationInstance.ranges = instance.serializeAnimationRanges();
        }
        // Thin instances
        if (this._thinInstanceDataStorage.instancesCount && this._thinInstanceDataStorage.matrixData) {
            serializationObject.thinInstances = {
                instancesCount: this._thinInstanceDataStorage.instancesCount,
                matrixData: Tools.SliceToArray(this._thinInstanceDataStorage.matrixData),
                matrixBufferSize: this._thinInstanceDataStorage.matrixBufferSize,
            };
            if (this._userThinInstanceBuffersStorage) {
                var userThinInstance = {
                    data: {},
                    sizes: {},
                    strides: {},
                };
                for (var kind in this._userThinInstanceBuffersStorage.data) {
                    userThinInstance.data[kind] = Tools.SliceToArray(this._userThinInstanceBuffersStorage.data[kind]);
                    userThinInstance.sizes[kind] = this._userThinInstanceBuffersStorage.sizes[kind];
                    userThinInstance.strides[kind] = this._userThinInstanceBuffersStorage.strides[kind];
                }
                serializationObject.thinInstances.userThinInstance = userThinInstance;
            }
        }
        // Animations
        SerializationHelper.AppendSerializedAnimations(this, serializationObject);
        serializationObject.ranges = this.serializeAnimationRanges();
        // Layer mask
        serializationObject.layerMask = this.layerMask;
        // Alpha
        serializationObject.alphaIndex = this.alphaIndex;
        serializationObject.hasVertexAlpha = this.hasVertexAlpha;
        // Overlay
        serializationObject.overlayAlpha = this.overlayAlpha;
        serializationObject.overlayColor = this.overlayColor.asArray();
        serializationObject.renderOverlay = this.renderOverlay;
        // Fog
        serializationObject.applyFog = this.applyFog;
        // Action Manager
        if (this.actionManager) {
            serializationObject.actions = this.actionManager.serialize(this.name);
        }
    };
    /** @hidden */
    Mesh.prototype._syncGeometryWithMorphTargetManager = function () {
        if (!this.geometry) {
            return;
        }
        this._markSubMeshesAsAttributesDirty();
        var morphTargetManager = this._internalMeshDataInfo._morphTargetManager;
        if (morphTargetManager && morphTargetManager.vertexCount) {
            if (morphTargetManager.vertexCount !== this.getTotalVertices()) {
                Logger.Error("Mesh is incompatible with morph targets. Targets and mesh must all have the same vertices count.");
                this.morphTargetManager = null;
                return;
            }
            for (var index = 0; index < morphTargetManager.numInfluencers; index++) {
                var morphTarget = morphTargetManager.getActiveTarget(index);
                var positions = morphTarget.getPositions();
                if (!positions) {
                    Logger.Error("Invalid morph target. Target must have positions.");
                    return;
                }
                this.geometry.setVerticesData(VertexBuffer.PositionKind + index, positions, false, 3);
                var normals = morphTarget.getNormals();
                if (normals) {
                    this.geometry.setVerticesData(VertexBuffer.NormalKind + index, normals, false, 3);
                }
                var tangents = morphTarget.getTangents();
                if (tangents) {
                    this.geometry.setVerticesData(VertexBuffer.TangentKind + index, tangents, false, 3);
                }
                var uvs = morphTarget.getUVs();
                if (uvs) {
                    this.geometry.setVerticesData(VertexBuffer.UVKind + "_" + index, uvs, false, 2);
                }
            }
        }
        else {
            var index = 0;
            // Positions
            while (this.geometry.isVerticesDataPresent(VertexBuffer.PositionKind + index)) {
                this.geometry.removeVerticesData(VertexBuffer.PositionKind + index);
                if (this.geometry.isVerticesDataPresent(VertexBuffer.NormalKind + index)) {
                    this.geometry.removeVerticesData(VertexBuffer.NormalKind + index);
                }
                if (this.geometry.isVerticesDataPresent(VertexBuffer.TangentKind + index)) {
                    this.geometry.removeVerticesData(VertexBuffer.TangentKind + index);
                }
                if (this.geometry.isVerticesDataPresent(VertexBuffer.UVKind + index)) {
                    this.geometry.removeVerticesData(VertexBuffer.UVKind + "_" + index);
                }
                index++;
            }
        }
    };
    /**
     * Returns a new Mesh object parsed from the source provided.
     * @param parsedMesh is the source
     * @param scene defines the hosting scene
     * @param rootUrl is the root URL to prefix the `delayLoadingFile` property with
     * @returns a new Mesh
     */
    Mesh.Parse = function (parsedMesh, scene, rootUrl) {
        var mesh;
        if (parsedMesh.type && parsedMesh.type === "GroundMesh") {
            mesh = Mesh._GroundMeshParser(parsedMesh, scene);
        }
        else {
            mesh = new Mesh(parsedMesh.name, scene);
        }
        mesh.id = parsedMesh.id;
        if (Tags) {
            Tags.AddTagsTo(mesh, parsedMesh.tags);
        }
        mesh.position = Vector3.FromArray(parsedMesh.position);
        if (parsedMesh.metadata !== undefined) {
            mesh.metadata = parsedMesh.metadata;
        }
        if (parsedMesh.rotationQuaternion) {
            mesh.rotationQuaternion = Quaternion.FromArray(parsedMesh.rotationQuaternion);
        }
        else if (parsedMesh.rotation) {
            mesh.rotation = Vector3.FromArray(parsedMesh.rotation);
        }
        mesh.scaling = Vector3.FromArray(parsedMesh.scaling);
        if (parsedMesh.localMatrix) {
            mesh.setPreTransformMatrix(Matrix.FromArray(parsedMesh.localMatrix));
        }
        else if (parsedMesh.pivotMatrix) {
            mesh.setPivotMatrix(Matrix.FromArray(parsedMesh.pivotMatrix));
        }
        mesh.setEnabled(parsedMesh.isEnabled);
        mesh.isVisible = parsedMesh.isVisible;
        mesh.infiniteDistance = parsedMesh.infiniteDistance;
        mesh.showBoundingBox = parsedMesh.showBoundingBox;
        mesh.showSubMeshesBoundingBox = parsedMesh.showSubMeshesBoundingBox;
        if (parsedMesh.applyFog !== undefined) {
            mesh.applyFog = parsedMesh.applyFog;
        }
        if (parsedMesh.pickable !== undefined) {
            mesh.isPickable = parsedMesh.pickable;
        }
        if (parsedMesh.alphaIndex !== undefined) {
            mesh.alphaIndex = parsedMesh.alphaIndex;
        }
        mesh.receiveShadows = parsedMesh.receiveShadows;
        mesh.billboardMode = parsedMesh.billboardMode;
        if (parsedMesh.visibility !== undefined) {
            mesh.visibility = parsedMesh.visibility;
        }
        mesh.checkCollisions = parsedMesh.checkCollisions;
        mesh.overrideMaterialSideOrientation = parsedMesh.overrideMaterialSideOrientation;
        if (parsedMesh.isBlocker !== undefined) {
            mesh.isBlocker = parsedMesh.isBlocker;
        }
        mesh._shouldGenerateFlatShading = parsedMesh.useFlatShading;
        // freezeWorldMatrix
        if (parsedMesh.freezeWorldMatrix) {
            mesh._waitingData.freezeWorldMatrix = parsedMesh.freezeWorldMatrix;
        }
        // Parent
        if (parsedMesh.parentId) {
            mesh._waitingParentId = parsedMesh.parentId;
        }
        // Actions
        if (parsedMesh.actions !== undefined) {
            mesh._waitingData.actions = parsedMesh.actions;
        }
        // Overlay
        if (parsedMesh.overlayAlpha !== undefined) {
            mesh.overlayAlpha = parsedMesh.overlayAlpha;
        }
        if (parsedMesh.overlayColor !== undefined) {
            mesh.overlayColor = Color3.FromArray(parsedMesh.overlayColor);
        }
        if (parsedMesh.renderOverlay !== undefined) {
            mesh.renderOverlay = parsedMesh.renderOverlay;
        }
        // Geometry
        mesh.isUnIndexed = !!parsedMesh.isUnIndexed;
        mesh.hasVertexAlpha = parsedMesh.hasVertexAlpha;
        if (parsedMesh.delayLoadingFile) {
            mesh.delayLoadState = 4;
            mesh.delayLoadingFile = rootUrl + parsedMesh.delayLoadingFile;
            mesh._boundingInfo = new BoundingInfo(Vector3.FromArray(parsedMesh.boundingBoxMinimum), Vector3.FromArray(parsedMesh.boundingBoxMaximum));
            if (parsedMesh._binaryInfo) {
                mesh._binaryInfo = parsedMesh._binaryInfo;
            }
            mesh._delayInfo = [];
            if (parsedMesh.hasUVs) {
                mesh._delayInfo.push(VertexBuffer.UVKind);
            }
            if (parsedMesh.hasUVs2) {
                mesh._delayInfo.push(VertexBuffer.UV2Kind);
            }
            if (parsedMesh.hasUVs3) {
                mesh._delayInfo.push(VertexBuffer.UV3Kind);
            }
            if (parsedMesh.hasUVs4) {
                mesh._delayInfo.push(VertexBuffer.UV4Kind);
            }
            if (parsedMesh.hasUVs5) {
                mesh._delayInfo.push(VertexBuffer.UV5Kind);
            }
            if (parsedMesh.hasUVs6) {
                mesh._delayInfo.push(VertexBuffer.UV6Kind);
            }
            if (parsedMesh.hasColors) {
                mesh._delayInfo.push(VertexBuffer.ColorKind);
            }
            if (parsedMesh.hasMatricesIndices) {
                mesh._delayInfo.push(VertexBuffer.MatricesIndicesKind);
            }
            if (parsedMesh.hasMatricesWeights) {
                mesh._delayInfo.push(VertexBuffer.MatricesWeightsKind);
            }
            mesh._delayLoadingFunction = Geometry._ImportGeometry;
            if (SceneLoaderFlags.ForceFullSceneLoadingForIncremental) {
                mesh._checkDelayState();
            }
        }
        else {
            Geometry._ImportGeometry(parsedMesh, mesh);
        }
        // Material
        if (parsedMesh.materialId) {
            mesh.setMaterialByID(parsedMesh.materialId);
        }
        else {
            mesh.material = null;
        }
        // Morph targets
        if (parsedMesh.morphTargetManagerId > -1) {
            mesh.morphTargetManager = scene.getMorphTargetManagerById(parsedMesh.morphTargetManagerId);
        }
        // Skeleton
        if (parsedMesh.skeletonId !== undefined && parsedMesh.skeletonId !== null) {
            mesh.skeleton = scene.getLastSkeletonByID(parsedMesh.skeletonId);
            if (parsedMesh.numBoneInfluencers) {
                mesh.numBoneInfluencers = parsedMesh.numBoneInfluencers;
            }
        }
        // Animations
        if (parsedMesh.animations) {
            for (var animationIndex = 0; animationIndex < parsedMesh.animations.length; animationIndex++) {
                var parsedAnimation = parsedMesh.animations[animationIndex];
                var internalClass = _TypeStore.GetClass("BABYLON.Animation");
                if (internalClass) {
                    mesh.animations.push(internalClass.Parse(parsedAnimation));
                }
            }
            Node.ParseAnimationRanges(mesh, parsedMesh, scene);
        }
        if (parsedMesh.autoAnimate) {
            scene.beginAnimation(mesh, parsedMesh.autoAnimateFrom, parsedMesh.autoAnimateTo, parsedMesh.autoAnimateLoop, parsedMesh.autoAnimateSpeed || 1.0);
        }
        // Layer Mask
        if (parsedMesh.layerMask && (!isNaN(parsedMesh.layerMask))) {
            mesh.layerMask = Math.abs(parseInt(parsedMesh.layerMask));
        }
        else {
            mesh.layerMask = 0x0FFFFFFF;
        }
        // Physics
        if (parsedMesh.physicsImpostor) {
            Mesh._PhysicsImpostorParser(scene, mesh, parsedMesh);
        }
        // Levels
        if (parsedMesh.lodMeshIds) {
            mesh._waitingData.lods = {
                ids: parsedMesh.lodMeshIds,
                distances: (parsedMesh.lodDistances) ? parsedMesh.lodDistances : null,
                coverages: (parsedMesh.lodCoverages) ? parsedMesh.lodCoverages : null
            };
        }
        // Instances
        if (parsedMesh.instances) {
            for (var index = 0; index < parsedMesh.instances.length; index++) {
                var parsedInstance = parsedMesh.instances[index];
                var instance = mesh.createInstance(parsedInstance.name);
                if (parsedInstance.id) {
                    instance.id = parsedInstance.id;
                }
                if (Tags) {
                    if (parsedInstance.tags) {
                        Tags.AddTagsTo(instance, parsedInstance.tags);
                    }
                    else {
                        Tags.AddTagsTo(instance, parsedMesh.tags);
                    }
                }
                instance.position = Vector3.FromArray(parsedInstance.position);
                if (parsedInstance.metadata !== undefined) {
                    instance.metadata = parsedInstance.metadata;
                }
                if (parsedInstance.parentId) {
                    instance._waitingParentId = parsedInstance.parentId;
                }
                if (parsedInstance.isEnabled !== undefined && parsedInstance.isEnabled !== null) {
                    instance.setEnabled(parsedInstance.isEnabled);
                }
                if (parsedInstance.isVisible !== undefined && parsedInstance.isVisible !== null) {
                    instance.isVisible = parsedInstance.isVisible;
                }
                if (parsedInstance.isPickable !== undefined && parsedInstance.isPickable !== null) {
                    instance.isPickable = parsedInstance.isPickable;
                }
                if (parsedInstance.rotationQuaternion) {
                    instance.rotationQuaternion = Quaternion.FromArray(parsedInstance.rotationQuaternion);
                }
                else if (parsedInstance.rotation) {
                    instance.rotation = Vector3.FromArray(parsedInstance.rotation);
                }
                instance.scaling = Vector3.FromArray(parsedInstance.scaling);
                if (parsedInstance.checkCollisions != undefined && parsedInstance.checkCollisions != null) {
                    instance.checkCollisions = parsedInstance.checkCollisions;
                }
                if (parsedInstance.pickable != undefined && parsedInstance.pickable != null) {
                    instance.isPickable = parsedInstance.pickable;
                }
                if (parsedInstance.showBoundingBox != undefined && parsedInstance.showBoundingBox != null) {
                    instance.showBoundingBox = parsedInstance.showBoundingBox;
                }
                if (parsedInstance.showSubMeshesBoundingBox != undefined && parsedInstance.showSubMeshesBoundingBox != null) {
                    instance.showSubMeshesBoundingBox = parsedInstance.showSubMeshesBoundingBox;
                }
                if (parsedInstance.alphaIndex != undefined && parsedInstance.showSubMeshesBoundingBox != null) {
                    instance.alphaIndex = parsedInstance.alphaIndex;
                }
                // Physics
                if (parsedInstance.physicsImpostor) {
                    Mesh._PhysicsImpostorParser(scene, instance, parsedInstance);
                }
                // Animation
                if (parsedInstance.animations) {
                    for (animationIndex = 0; animationIndex < parsedInstance.animations.length; animationIndex++) {
                        parsedAnimation = parsedInstance.animations[animationIndex];
                        var internalClass = _TypeStore.GetClass("BABYLON.Animation");
                        if (internalClass) {
                            instance.animations.push(internalClass.Parse(parsedAnimation));
                        }
                    }
                    Node.ParseAnimationRanges(instance, parsedInstance, scene);
                    if (parsedInstance.autoAnimate) {
                        scene.beginAnimation(instance, parsedInstance.autoAnimateFrom, parsedInstance.autoAnimateTo, parsedInstance.autoAnimateLoop, parsedInstance.autoAnimateSpeed || 1.0);
                    }
                }
            }
        }
        // Thin instances
        if (parsedMesh.thinInstances) {
            var thinInstances = parsedMesh.thinInstances;
            if (thinInstances.matrixData) {
                mesh.thinInstanceSetBuffer("matrix", new Float32Array(thinInstances.matrixData), 16, false);
                mesh._thinInstanceDataStorage.matrixBufferSize = thinInstances.matrixBufferSize;
                mesh._thinInstanceDataStorage.instancesCount = thinInstances.instancesCount;
            }
            else {
                mesh._thinInstanceDataStorage.matrixBufferSize = thinInstances.matrixBufferSize;
            }
            if (parsedMesh.thinInstances.userThinInstance) {
                var userThinInstance = parsedMesh.thinInstances.userThinInstance;
                for (var kind in userThinInstance.data) {
                    mesh.thinInstanceSetBuffer(kind, new Float32Array(userThinInstance.data[kind]), userThinInstance.strides[kind], false);
                    mesh._userThinInstanceBuffersStorage.sizes[kind] = userThinInstance.sizes[kind];
                }
            }
        }
        return mesh;
    };
    /**
     * Creates a ribbon mesh. Please consider using the same method from the MeshBuilder class instead
     * @see https://doc.babylonjs.com/how_to/parametric_shapes
     * @param name defines the name of the mesh to create
     * @param pathArray is a required array of paths, what are each an array of successive Vector3. The pathArray parameter depicts the ribbon geometry.
     * @param closeArray creates a seam between the first and the last paths of the path array (default is false)
     * @param closePath creates a seam between the first and the last points of each path of the path array
     * @param offset is taken in account only if the `pathArray` is containing a single path
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @param instance defines an instance of an existing Ribbon object to be updated with the passed `pathArray` parameter (https://doc.babylonjs.com/how_to/How_to_dynamically_morph_a_mesh#ribbon)
     * @returns a new Mesh
     */
    Mesh.CreateRibbon = function (name, pathArray, closeArray, closePath, offset, scene, updatable, sideOrientation, instance) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
      * Creates a plane polygonal mesh.  By default, this is a disc. Please consider using the same method from the MeshBuilder class instead
      * @param name defines the name of the mesh to create
      * @param radius sets the radius size (float) of the polygon (default 0.5)
      * @param tessellation sets the number of polygon sides (positive integer, default 64). So a tessellation valued to 3 will build a triangle, to 4 a square, etc
      * @param scene defines the hosting scene
      * @param updatable defines if the mesh must be flagged as updatable
      * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
      * @returns a new Mesh
      */
    Mesh.CreateDisc = function (name, radius, tessellation, scene, updatable, sideOrientation) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a box mesh. Please consider using the same method from the MeshBuilder class instead
     * @param name defines the name of the mesh to create
     * @param size sets the size (float) of each box side (default 1)
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @returns a new Mesh
     */
    Mesh.CreateBox = function (name, size, scene, updatable, sideOrientation) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
      * Creates a sphere mesh. Please consider using the same method from the MeshBuilder class instead
      * @param name defines the name of the mesh to create
      * @param segments sets the sphere number of horizontal stripes (positive integer, default 32)
      * @param diameter sets the diameter size (float) of the sphere (default 1)
      * @param scene defines the hosting scene
      * @param updatable defines if the mesh must be flagged as updatable
      * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
      * @returns a new Mesh
      */
    Mesh.CreateSphere = function (name, segments, diameter, scene, updatable, sideOrientation) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
      * Creates a hemisphere mesh. Please consider using the same method from the MeshBuilder class instead
      * @param name defines the name of the mesh to create
      * @param segments sets the sphere number of horizontal stripes (positive integer, default 32)
      * @param diameter sets the diameter size (float) of the sphere (default 1)
      * @param scene defines the hosting scene
      * @returns a new Mesh
      */
    Mesh.CreateHemisphere = function (name, segments, diameter, scene) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a cylinder or a cone mesh. Please consider using the same method from the MeshBuilder class instead
     * @param name defines the name of the mesh to create
     * @param height sets the height size (float) of the cylinder/cone (float, default 2)
     * @param diameterTop set the top cap diameter (floats, default 1)
     * @param diameterBottom set the bottom cap diameter (floats, default 1). This value can't be zero
     * @param tessellation sets the number of cylinder sides (positive integer, default 24). Set it to 3 to get a prism for instance
     * @param subdivisions sets the number of rings along the cylinder height (positive integer, default 1)
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @returns a new Mesh
     */
    Mesh.CreateCylinder = function (name, height, diameterTop, diameterBottom, tessellation, subdivisions, scene, updatable, sideOrientation) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    // Torus  (Code from SharpDX.org)
    /**
     * Creates a torus mesh. Please consider using the same method from the MeshBuilder class instead
     * @param name defines the name of the mesh to create
     * @param diameter sets the diameter size (float) of the torus (default 1)
     * @param thickness sets the diameter size of the tube of the torus (float, default 0.5)
     * @param tessellation sets the number of torus sides (postive integer, default 16)
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @returns a new Mesh
     */
    Mesh.CreateTorus = function (name, diameter, thickness, tessellation, scene, updatable, sideOrientation) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a torus knot mesh. Please consider using the same method from the MeshBuilder class instead
     * @param name defines the name of the mesh to create
     * @param radius sets the global radius size (float) of the torus knot (default 2)
     * @param tube sets the diameter size of the tube of the torus (float, default 0.5)
     * @param radialSegments sets the number of sides on each tube segments (positive integer, default 32)
     * @param tubularSegments sets the number of tubes to decompose the knot into (positive integer, default 32)
     * @param p the number of windings on X axis (positive integers, default 2)
     * @param q the number of windings on Y axis (positive integers, default 3)
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @returns a new Mesh
     */
    Mesh.CreateTorusKnot = function (name, radius, tube, radialSegments, tubularSegments, p, q, scene, updatable, sideOrientation) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a line mesh. Please consider using the same method from the MeshBuilder class instead.
     * @param name defines the name of the mesh to create
     * @param points is an array successive Vector3
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param instance is an instance of an existing LineMesh object to be updated with the passed `points` parameter (https://doc.babylonjs.com/how_to/How_to_dynamically_morph_a_mesh#lines-and-dashedlines).
     * @returns a new Mesh
     */
    Mesh.CreateLines = function (name, points, scene, updatable, instance) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a dashed line mesh. Please consider using the same method from the MeshBuilder class instead
     * @param name defines the name of the mesh to create
     * @param points is an array successive Vector3
     * @param dashSize is the size of the dashes relatively the dash number (positive float, default 3)
     * @param gapSize is the size of the gap between two successive dashes relatively the dash number (positive float, default 1)
     * @param dashNb is the intended total number of dashes (positive integer, default 200)
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param instance is an instance of an existing LineMesh object to be updated with the passed `points` parameter (https://doc.babylonjs.com/how_to/How_to_dynamically_morph_a_mesh#lines-and-dashedlines)
     * @returns a new Mesh
     */
    Mesh.CreateDashedLines = function (name, points, dashSize, gapSize, dashNb, scene, updatable, instance) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a polygon mesh.Please consider using the same method from the MeshBuilder class instead
     * The polygon's shape will depend on the input parameters and is constructed parallel to a ground mesh.
     * The parameter `shape` is a required array of successive Vector3 representing the corners of the polygon in th XoZ plane, that is y = 0 for all vectors.
     * You can set the mesh side orientation with the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
     * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * Remember you can only change the shape positions, not their number when updating a polygon.
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#non-regular-polygon
     * @param name defines the name of the mesh to create
     * @param shape is a required array of successive Vector3 representing the corners of the polygon in th XoZ plane, that is y = 0 for all vectors
     * @param scene defines the hosting scene
     * @param holes is a required array of arrays of successive Vector3 used to defines holes in the polygon
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @param earcutInjection can be used to inject your own earcut reference
     * @returns a new Mesh
     */
    Mesh.CreatePolygon = function (name, shape, scene, holes, updatable, sideOrientation, earcutInjection) {
        if (earcutInjection === void 0) { earcutInjection = earcut; }
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates an extruded polygon mesh, with depth in the Y direction. Please consider using the same method from the MeshBuilder class instead.
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#extruded-non-regular-polygon
     * @param name defines the name of the mesh to create
     * @param shape is a required array of successive Vector3 representing the corners of the polygon in th XoZ plane, that is y = 0 for all vectors
     * @param depth defines the height of extrusion
     * @param scene defines the hosting scene
     * @param holes is a required array of arrays of successive Vector3 used to defines holes in the polygon
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @param earcutInjection can be used to inject your own earcut reference
     * @returns a new Mesh
     */
    Mesh.ExtrudePolygon = function (name, shape, depth, scene, holes, updatable, sideOrientation, earcutInjection) {
        if (earcutInjection === void 0) { earcutInjection = earcut; }
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates an extruded shape mesh.
     * The extrusion is a parametric shape. It has no predefined shape. Its final shape will depend on the input parameters. Please consider using the same method from the MeshBuilder class instead
     * @see https://doc.babylonjs.com/how_to/parametric_shapes
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#extruded-shapes
     * @param name defines the name of the mesh to create
     * @param shape is a required array of successive Vector3. This array depicts the shape to be extruded in its local space : the shape must be designed in the xOy plane and will be extruded along the Z axis
     * @param path is a required array of successive Vector3. This is the axis curve the shape is extruded along
     * @param scale is the value to scale the shape
     * @param rotation is the angle value to rotate the shape each step (each path point), from the former step (so rotation added each step) along the curve
     * @param cap sets the way the extruded shape is capped. Possible values : Mesh.NO_CAP (default), Mesh.CAP_START, Mesh.CAP_END, Mesh.CAP_ALL
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @param instance is an instance of an existing ExtrudedShape object to be updated with the passed `shape`, `path`, `scale` or `rotation` parameters (https://doc.babylonjs.com/how_to/How_to_dynamically_morph_a_mesh#extruded-shape)
     * @returns a new Mesh
     */
    Mesh.ExtrudeShape = function (name, shape, path, scale, rotation, cap, scene, updatable, sideOrientation, instance) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates an custom extruded shape mesh.
     * The custom extrusion is a parametric shape.
     * It has no predefined shape. Its final shape will depend on the input parameters.
     * Please consider using the same method from the MeshBuilder class instead
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#extruded-shapes
     * @param name defines the name of the mesh to create
     * @param shape is a required array of successive Vector3. This array depicts the shape to be extruded in its local space : the shape must be designed in the xOy plane and will be extruded along the Z axis
     * @param path is a required array of successive Vector3. This is the axis curve the shape is extruded along
     * @param scaleFunction is a custom Javascript function called on each path point
     * @param rotationFunction is a custom Javascript function called on each path point
     * @param ribbonCloseArray forces the extrusion underlying ribbon to close all the paths in its `pathArray`
     * @param ribbonClosePath forces the extrusion underlying ribbon to close its `pathArray`
     * @param cap sets the way the extruded shape is capped. Possible values : Mesh.NO_CAP (default), Mesh.CAP_START, Mesh.CAP_END, Mesh.CAP_ALL
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @param instance is an instance of an existing ExtrudedShape object to be updated with the passed `shape`, `path`, `scale` or `rotation` parameters (https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#extruded-shape)
     * @returns a new Mesh
     */
    Mesh.ExtrudeShapeCustom = function (name, shape, path, scaleFunction, rotationFunction, ribbonCloseArray, ribbonClosePath, cap, scene, updatable, sideOrientation, instance) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates lathe mesh.
     * The lathe is a shape with a symetry axis : a 2D model shape is rotated around this axis to design the lathe.
     * Please consider using the same method from the MeshBuilder class instead
     * @param name defines the name of the mesh to create
     * @param shape is a required array of successive Vector3. This array depicts the shape to be rotated in its local space : the shape must be designed in the xOy plane and will be rotated around the Y axis. It's usually a 2D shape, so the Vector3 z coordinates are often set to zero
     * @param radius is the radius value of the lathe
     * @param tessellation is the side number of the lathe.
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @returns a new Mesh
     */
    Mesh.CreateLathe = function (name, shape, radius, tessellation, scene, updatable, sideOrientation) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a plane mesh. Please consider using the same method from the MeshBuilder class instead
     * @param name defines the name of the mesh to create
     * @param size sets the size (float) of both sides of the plane at once (default 1)
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @returns a new Mesh
     */
    Mesh.CreatePlane = function (name, size, scene, updatable, sideOrientation) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a ground mesh.
     * Please consider using the same method from the MeshBuilder class instead
     * @param name defines the name of the mesh to create
     * @param width set the width of the ground
     * @param height set the height of the ground
     * @param subdivisions sets the number of subdivisions per side
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @returns a new Mesh
     */
    Mesh.CreateGround = function (name, width, height, subdivisions, scene, updatable) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a tiled ground mesh.
     * Please consider using the same method from the MeshBuilder class instead
     * @param name defines the name of the mesh to create
     * @param xmin set the ground minimum X coordinate
     * @param zmin set the ground minimum Y coordinate
     * @param xmax set the ground maximum X coordinate
     * @param zmax set the ground maximum Z coordinate
     * @param subdivisions is an object `{w: positive integer, h: positive integer}` (default `{w: 6, h: 6}`). `w` and `h` are the numbers of subdivisions on the ground width and height. Each subdivision is called a tile
     * @param precision is an object `{w: positive integer, h: positive integer}` (default `{w: 2, h: 2}`). `w` and `h` are the numbers of subdivisions on the ground width and height of each tile
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @returns a new Mesh
     */
    Mesh.CreateTiledGround = function (name, xmin, zmin, xmax, zmax, subdivisions, precision, scene, updatable) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a ground mesh from a height map.
     * Please consider using the same method from the MeshBuilder class instead
     * @see https://doc.babylonjs.com/babylon101/height_map
     * @param name defines the name of the mesh to create
     * @param url sets the URL of the height map image resource
     * @param width set the ground width size
     * @param height set the ground height size
     * @param subdivisions sets the number of subdivision per side
     * @param minHeight is the minimum altitude on the ground
     * @param maxHeight is the maximum altitude on the ground
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param onReady  is a callback function that will be called  once the mesh is built (the height map download can last some time)
     * @param alphaFilter will filter any data where the alpha channel is below this value, defaults 0 (all data visible)
     * @returns a new Mesh
     */
    Mesh.CreateGroundFromHeightMap = function (name, url, width, height, subdivisions, minHeight, maxHeight, scene, updatable, onReady, alphaFilter) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a tube mesh.
     * The tube is a parametric shape.
     * It has no predefined shape. Its final shape will depend on the input parameters.
     * Please consider using the same method from the MeshBuilder class instead
     * @see https://doc.babylonjs.com/how_to/parametric_shapes
     * @param name defines the name of the mesh to create
     * @param path is a required array of successive Vector3. It is the curve used as the axis of the tube
     * @param radius sets the tube radius size
     * @param tessellation is the number of sides on the tubular surface
     * @param radiusFunction is a custom function. If it is not null, it overwrittes the parameter `radius`. This function is called on each point of the tube path and is passed the index `i` of the i-th point and the distance of this point from the first point of the path
     * @param cap sets the way the extruded shape is capped. Possible values : Mesh.NO_CAP (default), Mesh.CAP_START, Mesh.CAP_END, Mesh.CAP_ALL
     * @param scene defines the hosting scene
     * @param updatable defines if the mesh must be flagged as updatable
     * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation)
     * @param instance is an instance of an existing Tube object to be updated with the passed `pathArray` parameter (https://doc.babylonjs.com/how_to/How_to_dynamically_morph_a_mesh#tube)
     * @returns a new Mesh
     */
    Mesh.CreateTube = function (name, path, radius, tessellation, radiusFunction, cap, scene, updatable, sideOrientation, instance) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
      * Creates a polyhedron mesh.
      * Please consider using the same method from the MeshBuilder class instead.
      * * The parameter `type` (positive integer, max 14, default 0) sets the polyhedron type to build among the 15 embbeded types. Please refer to the type sheet in the tutorial to choose the wanted type
      * * The parameter `size` (positive float, default 1) sets the polygon size
      * * You can overwrite the `size` on each dimension bu using the parameters `sizeX`, `sizeY` or `sizeZ` (positive floats, default to `size` value)
      * * You can build other polyhedron types than the 15 embbeded ones by setting the parameter `custom` (`polyhedronObject`, default null). If you set the parameter `custom`, this overwrittes the parameter `type`
      * * A `polyhedronObject` is a formatted javascript object. You'll find a full file with pre-set polyhedra here : https://github.com/BabylonJS/Extensions/tree/master/Polyhedron
      * * You can set the color and the UV of each side of the polyhedron with the parameters `faceColors` (Color4, default `(1, 1, 1, 1)`) and faceUV (Vector4, default `(0, 0, 1, 1)`)
      * * To understand how to set `faceUV` or `faceColors`, please read this by considering the right number of faces of your polyhedron, instead of only 6 for the box : https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors
      * * The parameter `flat` (boolean, default true). If set to false, it gives the polyhedron a single global face, so less vertices and shared normals. In this case, `faceColors` and `faceUV` are ignored
      * * You can also set the mesh side orientation with the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
      * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
      * @param name defines the name of the mesh to create
      * @param options defines the options used to create the mesh
      * @param scene defines the hosting scene
      * @returns a new Mesh
      */
    Mesh.CreatePolyhedron = function (name, options, scene) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a sphere based upon an icosahedron with 20 triangular faces which can be subdivided
     * * The parameter `radius` sets the radius size (float) of the icosphere (default 1)
     * * You can set some different icosphere dimensions, for instance to build an ellipsoid, by using the parameters `radiusX`, `radiusY` and `radiusZ` (all by default have the same value than `radius`)
     * * The parameter `subdivisions` sets the number of subdivisions (postive integer, default 4). The more subdivisions, the more faces on the icosphere whatever its size
     * * The parameter `flat` (boolean, default true) gives each side its own normals. Set it to false to get a smooth continuous light reflection on the surface
     * * You can also set the mesh side orientation with the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns a new Mesh
     * @see https://doc.babylonjs.com/how_to/polyhedra_shapes#icosphere
     */
    Mesh.CreateIcoSphere = function (name, options, scene) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /**
     * Creates a decal mesh.
     * Please consider using the same method from the MeshBuilder class instead.
     * A decal is a mesh usually applied as a model onto the surface of another mesh
     * @param name  defines the name of the mesh
     * @param sourceMesh defines the mesh receiving the decal
     * @param position sets the position of the decal in world coordinates
     * @param normal sets the normal of the mesh where the decal is applied onto in world coordinates
     * @param size sets the decal scaling
     * @param angle sets the angle to rotate the decal
     * @returns a new Mesh
     */
    Mesh.CreateDecal = function (name, sourceMesh, position, normal, size, angle) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    /** Creates a Capsule Mesh
     * @param name defines the name of the mesh.
     * @param options the constructors options used to shape the mesh.
     * @param scene defines the scene the mesh is scoped to.
     * @returns the capsule mesh
     * @see https://doc.babylonjs.com/how_to/capsule_shape
     */
    Mesh.CreateCapsule = function (name, options, scene) {
        throw _DevTools.WarnImport("MeshBuilder");
    };
    // Skeletons
    /**
     * Prepare internal position array for software CPU skinning
     * @returns original positions used for CPU skinning. Useful for integrating Morphing with skeletons in same mesh
     */
    Mesh.prototype.setPositionsForCPUSkinning = function () {
        var internalDataInfo = this._internalMeshDataInfo;
        if (!internalDataInfo._sourcePositions) {
            var source = this.getVerticesData(VertexBuffer.PositionKind);
            if (!source) {
                return internalDataInfo._sourcePositions;
            }
            internalDataInfo._sourcePositions = new Float32Array(source);
            if (!this.isVertexBufferUpdatable(VertexBuffer.PositionKind)) {
                this.setVerticesData(VertexBuffer.PositionKind, source, true);
            }
        }
        return internalDataInfo._sourcePositions;
    };
    /**
     * Prepare internal normal array for software CPU skinning
     * @returns original normals used for CPU skinning. Useful for integrating Morphing with skeletons in same mesh.
     */
    Mesh.prototype.setNormalsForCPUSkinning = function () {
        var internalDataInfo = this._internalMeshDataInfo;
        if (!internalDataInfo._sourceNormals) {
            var source = this.getVerticesData(VertexBuffer.NormalKind);
            if (!source) {
                return internalDataInfo._sourceNormals;
            }
            internalDataInfo._sourceNormals = new Float32Array(source);
            if (!this.isVertexBufferUpdatable(VertexBuffer.NormalKind)) {
                this.setVerticesData(VertexBuffer.NormalKind, source, true);
            }
        }
        return internalDataInfo._sourceNormals;
    };
    /**
     * Updates the vertex buffer by applying transformation from the bones
     * @param skeleton defines the skeleton to apply to current mesh
     * @returns the current mesh
     */
    Mesh.prototype.applySkeleton = function (skeleton) {
        if (!this.geometry) {
            return this;
        }
        if (this.geometry._softwareSkinningFrameId == this.getScene().getFrameId()) {
            return this;
        }
        this.geometry._softwareSkinningFrameId = this.getScene().getFrameId();
        if (!this.isVerticesDataPresent(VertexBuffer.PositionKind)) {
            return this;
        }
        if (!this.isVerticesDataPresent(VertexBuffer.MatricesIndicesKind)) {
            return this;
        }
        if (!this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
            return this;
        }
        var hasNormals = this.isVerticesDataPresent(VertexBuffer.NormalKind);
        var internalDataInfo = this._internalMeshDataInfo;
        if (!internalDataInfo._sourcePositions) {
            var submeshes = this.subMeshes.slice();
            this.setPositionsForCPUSkinning();
            this.subMeshes = submeshes;
        }
        if (hasNormals && !internalDataInfo._sourceNormals) {
            this.setNormalsForCPUSkinning();
        }
        // positionsData checks for not being Float32Array will only pass at most once
        var positionsData = this.getVerticesData(VertexBuffer.PositionKind);
        if (!positionsData) {
            return this;
        }
        if (!(positionsData instanceof Float32Array)) {
            positionsData = new Float32Array(positionsData);
        }
        // normalsData checks for not being Float32Array will only pass at most once
        var normalsData = this.getVerticesData(VertexBuffer.NormalKind);
        if (hasNormals) {
            if (!normalsData) {
                return this;
            }
            if (!(normalsData instanceof Float32Array)) {
                normalsData = new Float32Array(normalsData);
            }
        }
        var matricesIndicesData = this.getVerticesData(VertexBuffer.MatricesIndicesKind);
        var matricesWeightsData = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
        if (!matricesWeightsData || !matricesIndicesData) {
            return this;
        }
        var needExtras = this.numBoneInfluencers > 4;
        var matricesIndicesExtraData = needExtras ? this.getVerticesData(VertexBuffer.MatricesIndicesExtraKind) : null;
        var matricesWeightsExtraData = needExtras ? this.getVerticesData(VertexBuffer.MatricesWeightsExtraKind) : null;
        var skeletonMatrices = skeleton.getTransformMatrices(this);
        var tempVector3 = Vector3.Zero();
        var finalMatrix = new Matrix();
        var tempMatrix = new Matrix();
        var matWeightIdx = 0;
        var inf;
        for (var index = 0; index < positionsData.length; index += 3, matWeightIdx += 4) {
            var weight;
            for (inf = 0; inf < 4; inf++) {
                weight = matricesWeightsData[matWeightIdx + inf];
                if (weight > 0) {
                    Matrix.FromFloat32ArrayToRefScaled(skeletonMatrices, Math.floor(matricesIndicesData[matWeightIdx + inf] * 16), weight, tempMatrix);
                    finalMatrix.addToSelf(tempMatrix);
                }
            }
            if (needExtras) {
                for (inf = 0; inf < 4; inf++) {
                    weight = matricesWeightsExtraData[matWeightIdx + inf];
                    if (weight > 0) {
                        Matrix.FromFloat32ArrayToRefScaled(skeletonMatrices, Math.floor(matricesIndicesExtraData[matWeightIdx + inf] * 16), weight, tempMatrix);
                        finalMatrix.addToSelf(tempMatrix);
                    }
                }
            }
            Vector3.TransformCoordinatesFromFloatsToRef(internalDataInfo._sourcePositions[index], internalDataInfo._sourcePositions[index + 1], internalDataInfo._sourcePositions[index + 2], finalMatrix, tempVector3);
            tempVector3.toArray(positionsData, index);
            if (hasNormals) {
                Vector3.TransformNormalFromFloatsToRef(internalDataInfo._sourceNormals[index], internalDataInfo._sourceNormals[index + 1], internalDataInfo._sourceNormals[index + 2], finalMatrix, tempVector3);
                tempVector3.toArray(normalsData, index);
            }
            finalMatrix.reset();
        }
        this.updateVerticesData(VertexBuffer.PositionKind, positionsData);
        if (hasNormals) {
            this.updateVerticesData(VertexBuffer.NormalKind, normalsData);
        }
        return this;
    };
    // Tools
    /**
     * Returns an object containing a min and max Vector3 which are the minimum and maximum vectors of each mesh bounding box from the passed array, in the world coordinates
     * @param meshes defines the list of meshes to scan
     * @returns an object `{min:` Vector3`, max:` Vector3`}`
     */
    Mesh.MinMax = function (meshes) {
        var minVector = null;
        var maxVector = null;
        meshes.forEach(function (mesh) {
            var boundingInfo = mesh.getBoundingInfo();
            var boundingBox = boundingInfo.boundingBox;
            if (!minVector || !maxVector) {
                minVector = boundingBox.minimumWorld;
                maxVector = boundingBox.maximumWorld;
            }
            else {
                minVector.minimizeInPlace(boundingBox.minimumWorld);
                maxVector.maximizeInPlace(boundingBox.maximumWorld);
            }
        });
        if (!minVector || !maxVector) {
            return {
                min: Vector3.Zero(),
                max: Vector3.Zero()
            };
        }
        return {
            min: minVector,
            max: maxVector
        };
    };
    /**
     * Returns the center of the `{min:` Vector3`, max:` Vector3`}` or the center of MinMax vector3 computed from a mesh array
     * @param meshesOrMinMaxVector could be an array of meshes or a `{min:` Vector3`, max:` Vector3`}` object
     * @returns a vector3
     */
    Mesh.Center = function (meshesOrMinMaxVector) {
        var minMaxVector = (meshesOrMinMaxVector instanceof Array) ? Mesh.MinMax(meshesOrMinMaxVector) : meshesOrMinMaxVector;
        return Vector3.Center(minMaxVector.min, minMaxVector.max);
    };
    /**
     * Merge the array of meshes into a single mesh for performance reasons.
     * @param meshes defines he vertices source.  They should all be of the same material.  Entries can empty
     * @param disposeSource when true (default), dispose of the vertices from the source meshes
     * @param allow32BitsIndices when the sum of the vertices > 64k, this must be set to true
     * @param meshSubclass when set, vertices inserted into this Mesh.  Meshes can then be merged into a Mesh sub-class.
     * @param subdivideWithSubMeshes when true (false default), subdivide mesh to his subMesh array with meshes source.
     * @param multiMultiMaterials when true (false default), subdivide mesh and accept multiple multi materials, ignores subdivideWithSubMeshes.
     * @returns a new mesh
     */
    Mesh.MergeMeshes = function (meshes, disposeSource, allow32BitsIndices, meshSubclass, subdivideWithSubMeshes, multiMultiMaterials) {
        if (disposeSource === void 0) { disposeSource = true; }
        var index;
        if (!allow32BitsIndices) {
            var totalVertices = 0;
            // Counting vertices
            for (index = 0; index < meshes.length; index++) {
                if (meshes[index]) {
                    totalVertices += meshes[index].getTotalVertices();
                    if (totalVertices >= 65536) {
                        Logger.Warn("Cannot merge meshes because resulting mesh will have more than 65536 vertices. Please use allow32BitsIndices = true to use 32 bits indices");
                        return null;
                    }
                }
            }
        }
        if (multiMultiMaterials) {
            var newMultiMaterial = null;
            var subIndex;
            var matIndex;
            subdivideWithSubMeshes = false;
        }
        var materialArray = new Array();
        var materialIndexArray = new Array();
        // Merge
        var vertexData = null;
        var otherVertexData;
        var indiceArray = new Array();
        var source = null;
        for (index = 0; index < meshes.length; index++) {
            if (meshes[index]) {
                var mesh = meshes[index];
                if (mesh.isAnInstance) {
                    Logger.Warn("Cannot merge instance meshes.");
                    return null;
                }
                var wm = mesh.computeWorldMatrix(true);
                otherVertexData = VertexData.ExtractFromMesh(mesh, true, true);
                otherVertexData.transform(wm);
                if (vertexData) {
                    vertexData.merge(otherVertexData, allow32BitsIndices);
                }
                else {
                    vertexData = otherVertexData;
                    source = mesh;
                }
                if (subdivideWithSubMeshes) {
                    indiceArray.push(mesh.getTotalIndices());
                }
                if (multiMultiMaterials) {
                    if (mesh.material) {
                        var material = mesh.material;
                        if (material instanceof MultiMaterial) {
                            for (matIndex = 0; matIndex < material.subMaterials.length; matIndex++) {
                                if (materialArray.indexOf(material.subMaterials[matIndex]) < 0) {
                                    materialArray.push(material.subMaterials[matIndex]);
                                }
                            }
                            for (subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
                                materialIndexArray.push(materialArray.indexOf(material.subMaterials[mesh.subMeshes[subIndex].materialIndex]));
                                indiceArray.push(mesh.subMeshes[subIndex].indexCount);
                            }
                        }
                        else {
                            if (materialArray.indexOf(material) < 0) {
                                materialArray.push(material);
                            }
                            for (subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
                                materialIndexArray.push(materialArray.indexOf(material));
                                indiceArray.push(mesh.subMeshes[subIndex].indexCount);
                            }
                        }
                    }
                    else {
                        for (subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
                            materialIndexArray.push(0);
                            indiceArray.push(mesh.subMeshes[subIndex].indexCount);
                        }
                    }
                }
            }
        }
        source = source;
        if (!meshSubclass) {
            meshSubclass = new Mesh(source.name + "_merged", source.getScene());
        }
        vertexData.applyToMesh(meshSubclass);
        // Setting properties
        meshSubclass.checkCollisions = source.checkCollisions;
        meshSubclass.overrideMaterialSideOrientation = source.overrideMaterialSideOrientation;
        // Cleaning
        if (disposeSource) {
            for (index = 0; index < meshes.length; index++) {
                if (meshes[index]) {
                    meshes[index].dispose();
                }
            }
        }
        // Subdivide
        if (subdivideWithSubMeshes || multiMultiMaterials) {
            //-- removal of global submesh
            meshSubclass.releaseSubMeshes();
            index = 0;
            var offset = 0;
            //-- apply subdivision according to index table
            while (index < indiceArray.length) {
                SubMesh.CreateFromIndices(0, offset, indiceArray[index], meshSubclass);
                offset += indiceArray[index];
                index++;
            }
        }
        if (multiMultiMaterials) {
            newMultiMaterial = new MultiMaterial(source.name + "_merged", source.getScene());
            newMultiMaterial.subMaterials = materialArray;
            for (subIndex = 0; subIndex < meshSubclass.subMeshes.length; subIndex++) {
                meshSubclass.subMeshes[subIndex].materialIndex = materialIndexArray[subIndex];
            }
            meshSubclass.material = newMultiMaterial;
        }
        else {
            meshSubclass.material = source.material;
        }
        return meshSubclass;
    };
    /** @hidden */
    Mesh.prototype.addInstance = function (instance) {
        instance._indexInSourceMeshInstanceArray = this.instances.length;
        this.instances.push(instance);
    };
    /** @hidden */
    Mesh.prototype.removeInstance = function (instance) {
        // Remove from mesh
        var index = instance._indexInSourceMeshInstanceArray;
        if (index != -1) {
            if (index !== this.instances.length - 1) {
                var last = this.instances[this.instances.length - 1];
                this.instances[index] = last;
                last._indexInSourceMeshInstanceArray = index;
            }
            instance._indexInSourceMeshInstanceArray = -1;
            this.instances.pop();
        }
    };
    // Consts
    /**
     * Mesh side orientation : usually the external or front surface
     */
    Mesh.FRONTSIDE = VertexData.FRONTSIDE;
    /**
     * Mesh side orientation : usually the internal or back surface
     */
    Mesh.BACKSIDE = VertexData.BACKSIDE;
    /**
     * Mesh side orientation : both internal and external or front and back surfaces
     */
    Mesh.DOUBLESIDE = VertexData.DOUBLESIDE;
    /**
     * Mesh side orientation : by default, `FRONTSIDE`
     */
    Mesh.DEFAULTSIDE = VertexData.DEFAULTSIDE;
    /**
     * Mesh cap setting : no cap
     */
    Mesh.NO_CAP = 0;
    /**
     * Mesh cap setting : one cap at the beginning of the mesh
     */
    Mesh.CAP_START = 1;
    /**
     * Mesh cap setting : one cap at the end of the mesh
     */
    Mesh.CAP_END = 2;
    /**
     * Mesh cap setting : two caps, one at the beginning  and one at the end of the mesh
     */
    Mesh.CAP_ALL = 3;
    /**
     * Mesh pattern setting : no flip or rotate
     */
    Mesh.NO_FLIP = 0;
    /**
     * Mesh pattern setting : flip (reflect in y axis) alternate tiles on each row or column
     */
    Mesh.FLIP_TILE = 1;
    /**
     * Mesh pattern setting : rotate (180degs) alternate tiles on each row or column
     */
    Mesh.ROTATE_TILE = 2;
    /**
     * Mesh pattern setting : flip (reflect in y axis) all tiles on alternate rows
     */
    Mesh.FLIP_ROW = 3;
    /**
     * Mesh pattern setting : rotate (180degs) all tiles on alternate rows
     */
    Mesh.ROTATE_ROW = 4;
    /**
     * Mesh pattern setting : flip and rotate alternate tiles on each row or column
     */
    Mesh.FLIP_N_ROTATE_TILE = 5;
    /**
     * Mesh pattern setting : rotate pattern and rotate
     */
    Mesh.FLIP_N_ROTATE_ROW = 6;
    /**
     * Mesh tile positioning : part tiles same on left/right or top/bottom
     */
    Mesh.CENTER = 0;
    /**
     * Mesh tile positioning : part tiles on left
     */
    Mesh.LEFT = 1;
    /**
     * Mesh tile positioning : part tiles on right
     */
    Mesh.RIGHT = 2;
    /**
     * Mesh tile positioning : part tiles on top
     */
    Mesh.TOP = 3;
    /**
     * Mesh tile positioning : part tiles on bottom
     */
    Mesh.BOTTOM = 4;
    // Statics
    /** @hidden */
    Mesh._GroundMeshParser = function (parsedMesh, scene) {
        throw _DevTools.WarnImport("GroundMesh");
    };
    return Mesh;
}(AbstractMesh));
_TypeStore.RegisteredTypes["BABYLON.Mesh"] = Mesh;

export { Geometry as G, Mesh as M, SceneLoaderFlags as S, _CreationDataStorage as _, MultiMaterial as a, _InstancesBatch as b, MeshLODLevel as c };
