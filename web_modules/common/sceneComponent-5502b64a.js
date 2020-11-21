import { _ as __extends, a as __decorate, O as Observable, L as Logger, b as _DevTools, d as __assign, E as EngineStore } from './thinEngine-e576a091.js';
import { S as SerializationHelper, s as serializeAsVector3, h as serializeAsQuaternion, a as serialize, N as Node } from './node-87d9c658.js';
import { V as Vector3, M as Matrix, T as TmpVectors, Q as Quaternion, d as Vector4, C as Color4, a as Vector2, A as ArrayTools, E as Epsilon, _ as _TypeStore, b as Color3 } from './math.color-fc6e801e.js';
import { E as Engine } from './engine-9a1b5aa7.js';
import { T as Tools } from './tools-ab6f1dea.js';
import { S as Space, A as Axis, P as Plane } from './math.axis-e7db27a6.js';
import { U as UniformBuffer } from './uniformBuffer-e700d3a6.js';

/**
 * A TransformNode is an object that is not rendered but can be used as a center of transformation. This can decrease memory usage and increase rendering speed compared to using an empty mesh as a parent and is less complicated than using a pivot matrix.
 * @see https://doc.babylonjs.com/how_to/transformnode
 */
var TransformNode = /** @class */ (function (_super) {
    __extends(TransformNode, _super);
    function TransformNode(name, scene, isPure) {
        if (scene === void 0) { scene = null; }
        if (isPure === void 0) { isPure = true; }
        var _this = _super.call(this, name, scene) || this;
        _this._forward = new Vector3(0, 0, 1);
        _this._forwardInverted = new Vector3(0, 0, -1);
        _this._up = new Vector3(0, 1, 0);
        _this._right = new Vector3(1, 0, 0);
        _this._rightInverted = new Vector3(-1, 0, 0);
        // Properties
        _this._position = Vector3.Zero();
        _this._rotation = Vector3.Zero();
        _this._rotationQuaternion = null;
        _this._scaling = Vector3.One();
        _this._isDirty = false;
        _this._transformToBoneReferal = null;
        _this._isAbsoluteSynced = false;
        _this._billboardMode = TransformNode.BILLBOARDMODE_NONE;
        _this._preserveParentRotationForBillboard = false;
        /**
         * Multiplication factor on scale x/y/z when computing the world matrix. Eg. for a 1x1x1 cube setting this to 2 will make it a 2x2x2 cube
         */
        _this.scalingDeterminant = 1;
        _this._infiniteDistance = false;
        /**
         * Gets or sets a boolean indicating that non uniform scaling (when at least one component is different from others) should be ignored.
         * By default the system will update normals to compensate
         */
        _this.ignoreNonUniformScaling = false;
        /**
         * Gets or sets a boolean indicating that even if rotationQuaternion is defined, you can keep updating rotation property and Babylon.js will just mix both
         */
        _this.reIntegrateRotationIntoRotationQuaternion = false;
        // Cache
        /** @hidden */
        _this._poseMatrix = null;
        /** @hidden */
        _this._localMatrix = Matrix.Zero();
        _this._usePivotMatrix = false;
        _this._absolutePosition = Vector3.Zero();
        _this._absoluteScaling = Vector3.Zero();
        _this._absoluteRotationQuaternion = Quaternion.Identity();
        _this._pivotMatrix = Matrix.Identity();
        /** @hidden */
        _this._postMultiplyPivotMatrix = false;
        _this._isWorldMatrixFrozen = false;
        /** @hidden */
        _this._indexInSceneTransformNodesArray = -1;
        /**
        * An event triggered after the world matrix is updated
        */
        _this.onAfterWorldMatrixUpdateObservable = new Observable();
        _this._nonUniformScaling = false;
        if (isPure) {
            _this.getScene().addTransformNode(_this);
        }
        return _this;
    }
    Object.defineProperty(TransformNode.prototype, "billboardMode", {
        /**
        * Gets or sets the billboard mode. Default is 0.
        *
        * | Value | Type | Description |
        * | --- | --- | --- |
        * | 0 | BILLBOARDMODE_NONE |  |
        * | 1 | BILLBOARDMODE_X |  |
        * | 2 | BILLBOARDMODE_Y |  |
        * | 4 | BILLBOARDMODE_Z |  |
        * | 7 | BILLBOARDMODE_ALL |  |
        *
        */
        get: function () {
            return this._billboardMode;
        },
        set: function (value) {
            if (this._billboardMode === value) {
                return;
            }
            this._billboardMode = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformNode.prototype, "preserveParentRotationForBillboard", {
        /**
         * Gets or sets a boolean indicating that parent rotation should be preserved when using billboards.
         * This could be useful for glTF objects where parent rotation helps converting from right handed to left handed
         */
        get: function () {
            return this._preserveParentRotationForBillboard;
        },
        set: function (value) {
            if (value === this._preserveParentRotationForBillboard) {
                return;
            }
            this._preserveParentRotationForBillboard = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformNode.prototype, "infiniteDistance", {
        /**
         * Gets or sets the distance of the object to max, often used by skybox
         */
        get: function () {
            return this._infiniteDistance;
        },
        set: function (value) {
            if (this._infiniteDistance === value) {
                return;
            }
            this._infiniteDistance = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets a string identifying the name of the class
     * @returns "TransformNode" string
     */
    TransformNode.prototype.getClassName = function () {
        return "TransformNode";
    };
    Object.defineProperty(TransformNode.prototype, "position", {
        /**
          * Gets or set the node position (default is (0.0, 0.0, 0.0))
          */
        get: function () {
            return this._position;
        },
        set: function (newPosition) {
            this._position = newPosition;
            this._isDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformNode.prototype, "rotation", {
        /**
          * Gets or sets the rotation property : a Vector3 defining the rotation value in radians around each local axis X, Y, Z  (default is (0.0, 0.0, 0.0)).
          * If rotation quaternion is set, this Vector3 will be ignored and copy from the quaternion
          */
        get: function () {
            return this._rotation;
        },
        set: function (newRotation) {
            this._rotation = newRotation;
            this._rotationQuaternion = null;
            this._isDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformNode.prototype, "scaling", {
        /**
         * Gets or sets the scaling property : a Vector3 defining the node scaling along each local axis X, Y, Z (default is (0.0, 0.0, 0.0)).
         */
        get: function () {
            return this._scaling;
        },
        set: function (newScaling) {
            this._scaling = newScaling;
            this._isDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformNode.prototype, "rotationQuaternion", {
        /**
         * Gets or sets the rotation Quaternion property : this a Quaternion object defining the node rotation by using a unit quaternion (undefined by default, but can be null).
         * If set, only the rotationQuaternion is then used to compute the node rotation (ie. node.rotation will be ignored)
         */
        get: function () {
            return this._rotationQuaternion;
        },
        set: function (quaternion) {
            this._rotationQuaternion = quaternion;
            //reset the rotation vector.
            if (quaternion) {
                this._rotation.setAll(0.0);
            }
            this._isDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformNode.prototype, "forward", {
        /**
         * The forward direction of that transform in world space.
         */
        get: function () {
            return Vector3.Normalize(Vector3.TransformNormal(this.getScene().useRightHandedSystem ? this._forwardInverted : this._forward, this.getWorldMatrix()));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformNode.prototype, "up", {
        /**
         * The up direction of that transform in world space.
         */
        get: function () {
            return Vector3.Normalize(Vector3.TransformNormal(this._up, this.getWorldMatrix()));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformNode.prototype, "right", {
        /**
         * The right direction of that transform in world space.
         */
        get: function () {
            return Vector3.Normalize(Vector3.TransformNormal(this.getScene().useRightHandedSystem ? this._rightInverted : this._right, this.getWorldMatrix()));
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Copies the parameter passed Matrix into the mesh Pose matrix.
     * @param matrix the matrix to copy the pose from
     * @returns this TransformNode.
     */
    TransformNode.prototype.updatePoseMatrix = function (matrix) {
        if (!this._poseMatrix) {
            this._poseMatrix = matrix.clone();
            return this;
        }
        this._poseMatrix.copyFrom(matrix);
        return this;
    };
    /**
     * Returns the mesh Pose matrix.
     * @returns the pose matrix
     */
    TransformNode.prototype.getPoseMatrix = function () {
        if (!this._poseMatrix) {
            this._poseMatrix = Matrix.Identity();
        }
        return this._poseMatrix;
    };
    /** @hidden */
    TransformNode.prototype._isSynchronized = function () {
        var cache = this._cache;
        if (this.billboardMode !== cache.billboardMode || this.billboardMode !== TransformNode.BILLBOARDMODE_NONE) {
            return false;
        }
        if (cache.pivotMatrixUpdated) {
            return false;
        }
        if (this.infiniteDistance) {
            return false;
        }
        if (this.position._isDirty) {
            return false;
        }
        if (this.scaling._isDirty) {
            return false;
        }
        if (this._rotationQuaternion && this._rotationQuaternion._isDirty || this.rotation._isDirty) {
            return false;
        }
        return true;
    };
    /** @hidden */
    TransformNode.prototype._initCache = function () {
        _super.prototype._initCache.call(this);
        var cache = this._cache;
        cache.localMatrixUpdated = false;
        cache.billboardMode = -1;
        cache.infiniteDistance = false;
    };
    /**
    * Flag the transform node as dirty (Forcing it to update everything)
    * @param property if set to "rotation" the objects rotationQuaternion will be set to null
    * @returns this transform node
    */
    TransformNode.prototype.markAsDirty = function (property) {
        this._currentRenderId = Number.MAX_VALUE;
        this._isDirty = true;
        return this;
    };
    Object.defineProperty(TransformNode.prototype, "absolutePosition", {
        /**
         * Returns the current mesh absolute position.
         * Returns a Vector3.
         */
        get: function () {
            return this._absolutePosition;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformNode.prototype, "absoluteScaling", {
        /**
         * Returns the current mesh absolute scaling.
         * Returns a Vector3.
         */
        get: function () {
            this._syncAbsoluteScalingAndRotation();
            return this._absoluteScaling;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TransformNode.prototype, "absoluteRotationQuaternion", {
        /**
         * Returns the current mesh absolute rotation.
         * Returns a Quaternion.
         */
        get: function () {
            this._syncAbsoluteScalingAndRotation();
            return this._absoluteRotationQuaternion;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets a new matrix to apply before all other transformation
     * @param matrix defines the transform matrix
     * @returns the current TransformNode
     */
    TransformNode.prototype.setPreTransformMatrix = function (matrix) {
        return this.setPivotMatrix(matrix, false);
    };
    /**
     * Sets a new pivot matrix to the current node
     * @param matrix defines the new pivot matrix to use
     * @param postMultiplyPivotMatrix defines if the pivot matrix must be cancelled in the world matrix. When this parameter is set to true (default), the inverse of the pivot matrix is also applied at the end to cancel the transformation effect
     * @returns the current TransformNode
    */
    TransformNode.prototype.setPivotMatrix = function (matrix, postMultiplyPivotMatrix) {
        if (postMultiplyPivotMatrix === void 0) { postMultiplyPivotMatrix = true; }
        this._pivotMatrix.copyFrom(matrix);
        this._usePivotMatrix = !this._pivotMatrix.isIdentity();
        this._cache.pivotMatrixUpdated = true;
        this._postMultiplyPivotMatrix = postMultiplyPivotMatrix;
        if (this._postMultiplyPivotMatrix) {
            if (!this._pivotMatrixInverse) {
                this._pivotMatrixInverse = Matrix.Invert(this._pivotMatrix);
            }
            else {
                this._pivotMatrix.invertToRef(this._pivotMatrixInverse);
            }
        }
        return this;
    };
    /**
     * Returns the mesh pivot matrix.
     * Default : Identity.
     * @returns the matrix
     */
    TransformNode.prototype.getPivotMatrix = function () {
        return this._pivotMatrix;
    };
    /**
     * Instantiate (when possible) or clone that node with its hierarchy
     * @param newParent defines the new parent to use for the instance (or clone)
     * @param options defines options to configure how copy is done
     * @param onNewNodeCreated defines an option callback to call when a clone or an instance is created
     * @returns an instance (or a clone) of the current node with its hiearchy
     */
    TransformNode.prototype.instantiateHierarchy = function (newParent, options, onNewNodeCreated) {
        if (newParent === void 0) { newParent = null; }
        var clone = this.clone("Clone of " + (this.name || this.id), newParent || this.parent, true);
        if (clone) {
            if (onNewNodeCreated) {
                onNewNodeCreated(this, clone);
            }
        }
        for (var _i = 0, _a = this.getChildTransformNodes(true); _i < _a.length; _i++) {
            var child = _a[_i];
            child.instantiateHierarchy(clone, options, onNewNodeCreated);
        }
        return clone;
    };
    /**
     * Prevents the World matrix to be computed any longer
     * @param newWorldMatrix defines an optional matrix to use as world matrix
     * @returns the TransformNode.
     */
    TransformNode.prototype.freezeWorldMatrix = function (newWorldMatrix) {
        if (newWorldMatrix === void 0) { newWorldMatrix = null; }
        if (newWorldMatrix) {
            this._worldMatrix = newWorldMatrix;
        }
        else {
            this._isWorldMatrixFrozen = false; // no guarantee world is not already frozen, switch off temporarily
            this.computeWorldMatrix(true);
        }
        this._isDirty = false;
        this._isWorldMatrixFrozen = true;
        return this;
    };
    /**
     * Allows back the World matrix computation.
     * @returns the TransformNode.
     */
    TransformNode.prototype.unfreezeWorldMatrix = function () {
        this._isWorldMatrixFrozen = false;
        this.computeWorldMatrix(true);
        return this;
    };
    Object.defineProperty(TransformNode.prototype, "isWorldMatrixFrozen", {
        /**
         * True if the World matrix has been frozen.
         */
        get: function () {
            return this._isWorldMatrixFrozen;
        },
        enumerable: false,
        configurable: true
    });
    /**
    * Retuns the mesh absolute position in the World.
    * @returns a Vector3.
    */
    TransformNode.prototype.getAbsolutePosition = function () {
        this.computeWorldMatrix();
        return this._absolutePosition;
    };
    /**
     * Sets the mesh absolute position in the World from a Vector3 or an Array(3).
     * @param absolutePosition the absolute position to set
     * @returns the TransformNode.
     */
    TransformNode.prototype.setAbsolutePosition = function (absolutePosition) {
        if (!absolutePosition) {
            return this;
        }
        var absolutePositionX;
        var absolutePositionY;
        var absolutePositionZ;
        if (absolutePosition.x === undefined) {
            if (arguments.length < 3) {
                return this;
            }
            absolutePositionX = arguments[0];
            absolutePositionY = arguments[1];
            absolutePositionZ = arguments[2];
        }
        else {
            absolutePositionX = absolutePosition.x;
            absolutePositionY = absolutePosition.y;
            absolutePositionZ = absolutePosition.z;
        }
        if (this.parent) {
            var invertParentWorldMatrix = TmpVectors.Matrix[0];
            this.parent.getWorldMatrix().invertToRef(invertParentWorldMatrix);
            Vector3.TransformCoordinatesFromFloatsToRef(absolutePositionX, absolutePositionY, absolutePositionZ, invertParentWorldMatrix, this.position);
        }
        else {
            this.position.x = absolutePositionX;
            this.position.y = absolutePositionY;
            this.position.z = absolutePositionZ;
        }
        this._absolutePosition.copyFrom(absolutePosition);
        return this;
    };
    /**
     * Sets the mesh position in its local space.
     * @param vector3 the position to set in localspace
     * @returns the TransformNode.
     */
    TransformNode.prototype.setPositionWithLocalVector = function (vector3) {
        this.computeWorldMatrix();
        this.position = Vector3.TransformNormal(vector3, this._localMatrix);
        return this;
    };
    /**
     * Returns the mesh position in the local space from the current World matrix values.
     * @returns a new Vector3.
     */
    TransformNode.prototype.getPositionExpressedInLocalSpace = function () {
        this.computeWorldMatrix();
        var invLocalWorldMatrix = TmpVectors.Matrix[0];
        this._localMatrix.invertToRef(invLocalWorldMatrix);
        return Vector3.TransformNormal(this.position, invLocalWorldMatrix);
    };
    /**
     * Translates the mesh along the passed Vector3 in its local space.
     * @param vector3 the distance to translate in localspace
     * @returns the TransformNode.
     */
    TransformNode.prototype.locallyTranslate = function (vector3) {
        this.computeWorldMatrix(true);
        this.position = Vector3.TransformCoordinates(vector3, this._localMatrix);
        return this;
    };
    /**
     * Orients a mesh towards a target point. Mesh must be drawn facing user.
     * @param targetPoint the position (must be in same space as current mesh) to look at
     * @param yawCor optional yaw (y-axis) correction in radians
     * @param pitchCor optional pitch (x-axis) correction in radians
     * @param rollCor optional roll (z-axis) correction in radians
     * @param space the choosen space of the target
     * @returns the TransformNode.
     */
    TransformNode.prototype.lookAt = function (targetPoint, yawCor, pitchCor, rollCor, space) {
        if (yawCor === void 0) { yawCor = 0; }
        if (pitchCor === void 0) { pitchCor = 0; }
        if (rollCor === void 0) { rollCor = 0; }
        if (space === void 0) { space = Space.LOCAL; }
        var dv = TransformNode._lookAtVectorCache;
        var pos = space === Space.LOCAL ? this.position : this.getAbsolutePosition();
        targetPoint.subtractToRef(pos, dv);
        this.setDirection(dv, yawCor, pitchCor, rollCor);
        // Correct for parent's rotation offset
        if (space === Space.WORLD && this.parent) {
            if (this.rotationQuaternion) {
                // Get local rotation matrix of the looking object
                var rotationMatrix = TmpVectors.Matrix[0];
                this.rotationQuaternion.toRotationMatrix(rotationMatrix);
                // Offset rotation by parent's inverted rotation matrix to correct in world space
                var parentRotationMatrix = TmpVectors.Matrix[1];
                this.parent.getWorldMatrix().getRotationMatrixToRef(parentRotationMatrix);
                parentRotationMatrix.invert();
                rotationMatrix.multiplyToRef(parentRotationMatrix, rotationMatrix);
                this.rotationQuaternion.fromRotationMatrix(rotationMatrix);
            }
            else {
                // Get local rotation matrix of the looking object
                var quaternionRotation = TmpVectors.Quaternion[0];
                Quaternion.FromEulerVectorToRef(this.rotation, quaternionRotation);
                var rotationMatrix = TmpVectors.Matrix[0];
                quaternionRotation.toRotationMatrix(rotationMatrix);
                // Offset rotation by parent's inverted rotation matrix to correct in world space
                var parentRotationMatrix = TmpVectors.Matrix[1];
                this.parent.getWorldMatrix().getRotationMatrixToRef(parentRotationMatrix);
                parentRotationMatrix.invert();
                rotationMatrix.multiplyToRef(parentRotationMatrix, rotationMatrix);
                quaternionRotation.fromRotationMatrix(rotationMatrix);
                quaternionRotation.toEulerAnglesToRef(this.rotation);
            }
        }
        return this;
    };
    /**
      * Returns a new Vector3 that is the localAxis, expressed in the mesh local space, rotated like the mesh.
      * This Vector3 is expressed in the World space.
      * @param localAxis axis to rotate
      * @returns a new Vector3 that is the localAxis, expressed in the mesh local space, rotated like the mesh.
      */
    TransformNode.prototype.getDirection = function (localAxis) {
        var result = Vector3.Zero();
        this.getDirectionToRef(localAxis, result);
        return result;
    };
    /**
     * Sets the Vector3 "result" as the rotated Vector3 "localAxis" in the same rotation than the mesh.
     * localAxis is expressed in the mesh local space.
     * result is computed in the Wordl space from the mesh World matrix.
     * @param localAxis axis to rotate
     * @param result the resulting transformnode
     * @returns this TransformNode.
     */
    TransformNode.prototype.getDirectionToRef = function (localAxis, result) {
        Vector3.TransformNormalToRef(localAxis, this.getWorldMatrix(), result);
        return this;
    };
    /**
     * Sets this transform node rotation to the given local axis.
     * @param localAxis the axis in local space
     * @param yawCor optional yaw (y-axis) correction in radians
     * @param pitchCor optional pitch (x-axis) correction in radians
     * @param rollCor optional roll (z-axis) correction in radians
     * @returns this TransformNode
     */
    TransformNode.prototype.setDirection = function (localAxis, yawCor, pitchCor, rollCor) {
        if (yawCor === void 0) { yawCor = 0; }
        if (pitchCor === void 0) { pitchCor = 0; }
        if (rollCor === void 0) { rollCor = 0; }
        var yaw = -Math.atan2(localAxis.z, localAxis.x) + Math.PI / 2;
        var len = Math.sqrt(localAxis.x * localAxis.x + localAxis.z * localAxis.z);
        var pitch = -Math.atan2(localAxis.y, len);
        if (this.rotationQuaternion) {
            Quaternion.RotationYawPitchRollToRef(yaw + yawCor, pitch + pitchCor, rollCor, this.rotationQuaternion);
        }
        else {
            this.rotation.x = pitch + pitchCor;
            this.rotation.y = yaw + yawCor;
            this.rotation.z = rollCor;
        }
        return this;
    };
    /**
     * Sets a new pivot point to the current node
     * @param point defines the new pivot point to use
     * @param space defines if the point is in world or local space (local by default)
     * @returns the current TransformNode
    */
    TransformNode.prototype.setPivotPoint = function (point, space) {
        if (space === void 0) { space = Space.LOCAL; }
        if (this.getScene().getRenderId() == 0) {
            this.computeWorldMatrix(true);
        }
        var wm = this.getWorldMatrix();
        if (space == Space.WORLD) {
            var tmat = TmpVectors.Matrix[0];
            wm.invertToRef(tmat);
            point = Vector3.TransformCoordinates(point, tmat);
        }
        return this.setPivotMatrix(Matrix.Translation(-point.x, -point.y, -point.z), true);
    };
    /**
     * Returns a new Vector3 set with the mesh pivot point coordinates in the local space.
     * @returns the pivot point
     */
    TransformNode.prototype.getPivotPoint = function () {
        var point = Vector3.Zero();
        this.getPivotPointToRef(point);
        return point;
    };
    /**
     * Sets the passed Vector3 "result" with the coordinates of the mesh pivot point in the local space.
     * @param result the vector3 to store the result
     * @returns this TransformNode.
     */
    TransformNode.prototype.getPivotPointToRef = function (result) {
        result.x = -this._pivotMatrix.m[12];
        result.y = -this._pivotMatrix.m[13];
        result.z = -this._pivotMatrix.m[14];
        return this;
    };
    /**
     * Returns a new Vector3 set with the mesh pivot point World coordinates.
     * @returns a new Vector3 set with the mesh pivot point World coordinates.
     */
    TransformNode.prototype.getAbsolutePivotPoint = function () {
        var point = Vector3.Zero();
        this.getAbsolutePivotPointToRef(point);
        return point;
    };
    /**
     * Sets the Vector3 "result" coordinates with the mesh pivot point World coordinates.
     * @param result vector3 to store the result
     * @returns this TransformNode.
     */
    TransformNode.prototype.getAbsolutePivotPointToRef = function (result) {
        this.getPivotPointToRef(result);
        Vector3.TransformCoordinatesToRef(result, this.getWorldMatrix(), result);
        return this;
    };
    /**
     * Defines the passed node as the parent of the current node.
     * The node will remain exactly where it is and its position / rotation will be updated accordingly
     * @see https://doc.babylonjs.com/how_to/parenting
     * @param node the node ot set as the parent
     * @returns this TransformNode.
     */
    TransformNode.prototype.setParent = function (node) {
        if (!node && !this.parent) {
            return this;
        }
        var quatRotation = TmpVectors.Quaternion[0];
        var position = TmpVectors.Vector3[0];
        var scale = TmpVectors.Vector3[1];
        if (!node) {
            this.computeWorldMatrix(true);
            this.getWorldMatrix().decompose(scale, quatRotation, position);
        }
        else {
            var diffMatrix = TmpVectors.Matrix[0];
            var invParentMatrix = TmpVectors.Matrix[1];
            this.computeWorldMatrix(true);
            node.computeWorldMatrix(true);
            node.getWorldMatrix().invertToRef(invParentMatrix);
            this.getWorldMatrix().multiplyToRef(invParentMatrix, diffMatrix);
            diffMatrix.decompose(scale, quatRotation, position);
        }
        if (this.rotationQuaternion) {
            this.rotationQuaternion.copyFrom(quatRotation);
        }
        else {
            quatRotation.toEulerAnglesToRef(this.rotation);
        }
        this.scaling.copyFrom(scale);
        this.position.copyFrom(position);
        this.parent = node;
        return this;
    };
    Object.defineProperty(TransformNode.prototype, "nonUniformScaling", {
        /**
         * True if the scaling property of this object is non uniform eg. (1,2,1)
         */
        get: function () {
            return this._nonUniformScaling;
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    TransformNode.prototype._updateNonUniformScalingState = function (value) {
        if (this._nonUniformScaling === value) {
            return false;
        }
        this._nonUniformScaling = value;
        return true;
    };
    /**
     * Attach the current TransformNode to another TransformNode associated with a bone
     * @param bone Bone affecting the TransformNode
     * @param affectedTransformNode TransformNode associated with the bone
     * @returns this object
     */
    TransformNode.prototype.attachToBone = function (bone, affectedTransformNode) {
        this._transformToBoneReferal = affectedTransformNode;
        this.parent = bone;
        bone.getSkeleton().prepare();
        if (bone.getWorldMatrix().determinant() < 0) {
            this.scalingDeterminant *= -1;
        }
        return this;
    };
    /**
     * Detach the transform node if its associated with a bone
     * @returns this object
     */
    TransformNode.prototype.detachFromBone = function () {
        if (!this.parent) {
            return this;
        }
        if (this.parent.getWorldMatrix().determinant() < 0) {
            this.scalingDeterminant *= -1;
        }
        this._transformToBoneReferal = null;
        this.parent = null;
        return this;
    };
    /**
     * Rotates the mesh around the axis vector for the passed angle (amount) expressed in radians, in the given space.
     * space (default LOCAL) can be either Space.LOCAL, either Space.WORLD.
     * Note that the property `rotationQuaternion` is then automatically updated and the property `rotation` is set to (0,0,0) and no longer used.
     * The passed axis is also normalized.
     * @param axis the axis to rotate around
     * @param amount the amount to rotate in radians
     * @param space Space to rotate in (Default: local)
     * @returns the TransformNode.
     */
    TransformNode.prototype.rotate = function (axis, amount, space) {
        axis.normalize();
        if (!this.rotationQuaternion) {
            this.rotationQuaternion = this.rotation.toQuaternion();
            this.rotation.setAll(0);
        }
        var rotationQuaternion;
        if (!space || space === Space.LOCAL) {
            rotationQuaternion = Quaternion.RotationAxisToRef(axis, amount, TransformNode._rotationAxisCache);
            this.rotationQuaternion.multiplyToRef(rotationQuaternion, this.rotationQuaternion);
        }
        else {
            if (this.parent) {
                var invertParentWorldMatrix = TmpVectors.Matrix[0];
                this.parent.getWorldMatrix().invertToRef(invertParentWorldMatrix);
                axis = Vector3.TransformNormal(axis, invertParentWorldMatrix);
            }
            rotationQuaternion = Quaternion.RotationAxisToRef(axis, amount, TransformNode._rotationAxisCache);
            rotationQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
        }
        return this;
    };
    /**
     * Rotates the mesh around the axis vector for the passed angle (amount) expressed in radians, in world space.
     * Note that the property `rotationQuaternion` is then automatically updated and the property `rotation` is set to (0,0,0) and no longer used.
     * The passed axis is also normalized. .
     * Method is based on http://www.euclideanspace.com/maths/geometry/affine/aroundPoint/index.htm
     * @param point the point to rotate around
     * @param axis the axis to rotate around
     * @param amount the amount to rotate in radians
     * @returns the TransformNode
     */
    TransformNode.prototype.rotateAround = function (point, axis, amount) {
        axis.normalize();
        if (!this.rotationQuaternion) {
            this.rotationQuaternion = Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
            this.rotation.setAll(0);
        }
        var tmpVector = TmpVectors.Vector3[0];
        var finalScale = TmpVectors.Vector3[1];
        var finalTranslation = TmpVectors.Vector3[2];
        var finalRotation = TmpVectors.Quaternion[0];
        var translationMatrix = TmpVectors.Matrix[0]; // T
        var translationMatrixInv = TmpVectors.Matrix[1]; // T'
        var rotationMatrix = TmpVectors.Matrix[2]; // R
        var finalMatrix = TmpVectors.Matrix[3]; // T' x R x T
        point.subtractToRef(this.position, tmpVector);
        Matrix.TranslationToRef(tmpVector.x, tmpVector.y, tmpVector.z, translationMatrix); // T
        Matrix.TranslationToRef(-tmpVector.x, -tmpVector.y, -tmpVector.z, translationMatrixInv); // T'
        Matrix.RotationAxisToRef(axis, amount, rotationMatrix); // R
        translationMatrixInv.multiplyToRef(rotationMatrix, finalMatrix); // T' x R
        finalMatrix.multiplyToRef(translationMatrix, finalMatrix); // T' x R x T
        finalMatrix.decompose(finalScale, finalRotation, finalTranslation);
        this.position.addInPlace(finalTranslation);
        finalRotation.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
        return this;
    };
    /**
     * Translates the mesh along the axis vector for the passed distance in the given space.
     * space (default LOCAL) can be either Space.LOCAL, either Space.WORLD.
     * @param axis the axis to translate in
     * @param distance the distance to translate
     * @param space Space to rotate in (Default: local)
     * @returns the TransformNode.
     */
    TransformNode.prototype.translate = function (axis, distance, space) {
        var displacementVector = axis.scale(distance);
        if (!space || space === Space.LOCAL) {
            var tempV3 = this.getPositionExpressedInLocalSpace().add(displacementVector);
            this.setPositionWithLocalVector(tempV3);
        }
        else {
            this.setAbsolutePosition(this.getAbsolutePosition().add(displacementVector));
        }
        return this;
    };
    /**
     * Adds a rotation step to the mesh current rotation.
     * x, y, z are Euler angles expressed in radians.
     * This methods updates the current mesh rotation, either mesh.rotation, either mesh.rotationQuaternion if it's set.
     * This means this rotation is made in the mesh local space only.
     * It's useful to set a custom rotation order different from the BJS standard one YXZ.
     * Example : this rotates the mesh first around its local X axis, then around its local Z axis, finally around its local Y axis.
     * ```javascript
     * mesh.addRotation(x1, 0, 0).addRotation(0, 0, z2).addRotation(0, 0, y3);
     * ```
     * Note that `addRotation()` accumulates the passed rotation values to the current ones and computes the .rotation or .rotationQuaternion updated values.
     * Under the hood, only quaternions are used. So it's a little faster is you use .rotationQuaternion because it doesn't need to translate them back to Euler angles.
     * @param x Rotation to add
     * @param y Rotation to add
     * @param z Rotation to add
     * @returns the TransformNode.
     */
    TransformNode.prototype.addRotation = function (x, y, z) {
        var rotationQuaternion;
        if (this.rotationQuaternion) {
            rotationQuaternion = this.rotationQuaternion;
        }
        else {
            rotationQuaternion = TmpVectors.Quaternion[1];
            Quaternion.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, rotationQuaternion);
        }
        var accumulation = TmpVectors.Quaternion[0];
        Quaternion.RotationYawPitchRollToRef(y, x, z, accumulation);
        rotationQuaternion.multiplyInPlace(accumulation);
        if (!this.rotationQuaternion) {
            rotationQuaternion.toEulerAnglesToRef(this.rotation);
        }
        return this;
    };
    /**
     * @hidden
     */
    TransformNode.prototype._getEffectiveParent = function () {
        return this.parent;
    };
    /**
     * Computes the world matrix of the node
     * @param force defines if the cache version should be invalidated forcing the world matrix to be created from scratch
     * @returns the world matrix
     */
    TransformNode.prototype.computeWorldMatrix = function (force) {
        if (this._isWorldMatrixFrozen && !this._isDirty) {
            return this._worldMatrix;
        }
        var currentRenderId = this.getScene().getRenderId();
        if (!this._isDirty && !force && this.isSynchronized()) {
            this._currentRenderId = currentRenderId;
            return this._worldMatrix;
        }
        var camera = this.getScene().activeCamera;
        var useBillboardPosition = (this._billboardMode & TransformNode.BILLBOARDMODE_USE_POSITION) !== 0;
        var useBillboardPath = this._billboardMode !== TransformNode.BILLBOARDMODE_NONE && !this.preserveParentRotationForBillboard;
        // Billboarding based on camera position
        if (useBillboardPath && camera && useBillboardPosition) {
            this.lookAt(camera.position);
            if ((this.billboardMode & TransformNode.BILLBOARDMODE_X) !== TransformNode.BILLBOARDMODE_X) {
                this.rotation.x = 0;
            }
            if ((this.billboardMode & TransformNode.BILLBOARDMODE_Y) !== TransformNode.BILLBOARDMODE_Y) {
                this.rotation.y = 0;
            }
            if ((this.billboardMode & TransformNode.BILLBOARDMODE_Z) !== TransformNode.BILLBOARDMODE_Z) {
                this.rotation.z = 0;
            }
        }
        this._updateCache();
        var cache = this._cache;
        cache.pivotMatrixUpdated = false;
        cache.billboardMode = this.billboardMode;
        cache.infiniteDistance = this.infiniteDistance;
        this._currentRenderId = currentRenderId;
        this._childUpdateId++;
        this._isDirty = false;
        this._position._isDirty = false;
        this._rotation._isDirty = false;
        this._scaling._isDirty = false;
        var parent = this._getEffectiveParent();
        // Scaling
        var scaling = TransformNode._TmpScaling;
        var translation = this._position;
        // Translation
        if (this._infiniteDistance) {
            if (!this.parent && camera) {
                var cameraWorldMatrix = camera.getWorldMatrix();
                var cameraGlobalPosition = new Vector3(cameraWorldMatrix.m[12], cameraWorldMatrix.m[13], cameraWorldMatrix.m[14]);
                translation = TransformNode._TmpTranslation;
                translation.copyFromFloats(this._position.x + cameraGlobalPosition.x, this._position.y + cameraGlobalPosition.y, this._position.z + cameraGlobalPosition.z);
            }
        }
        // Scaling
        scaling.copyFromFloats(this._scaling.x * this.scalingDeterminant, this._scaling.y * this.scalingDeterminant, this._scaling.z * this.scalingDeterminant);
        // Rotation
        var rotation;
        if (this._rotationQuaternion) {
            this._rotationQuaternion._isDirty = false;
            rotation = this._rotationQuaternion;
            if (this.reIntegrateRotationIntoRotationQuaternion) {
                var len = this.rotation.lengthSquared();
                if (len) {
                    this._rotationQuaternion.multiplyInPlace(Quaternion.RotationYawPitchRoll(this._rotation.y, this._rotation.x, this._rotation.z));
                    this._rotation.copyFromFloats(0, 0, 0);
                }
            }
        }
        else {
            rotation = TransformNode._TmpRotation;
            Quaternion.RotationYawPitchRollToRef(this._rotation.y, this._rotation.x, this._rotation.z, rotation);
        }
        // Compose
        if (this._usePivotMatrix) {
            var scaleMatrix = TmpVectors.Matrix[1];
            Matrix.ScalingToRef(scaling.x, scaling.y, scaling.z, scaleMatrix);
            // Rotation
            var rotationMatrix = TmpVectors.Matrix[0];
            rotation.toRotationMatrix(rotationMatrix);
            // Composing transformations
            this._pivotMatrix.multiplyToRef(scaleMatrix, TmpVectors.Matrix[4]);
            TmpVectors.Matrix[4].multiplyToRef(rotationMatrix, this._localMatrix);
            // Post multiply inverse of pivotMatrix
            if (this._postMultiplyPivotMatrix) {
                this._localMatrix.multiplyToRef(this._pivotMatrixInverse, this._localMatrix);
            }
            this._localMatrix.addTranslationFromFloats(translation.x, translation.y, translation.z);
        }
        else {
            Matrix.ComposeToRef(scaling, rotation, translation, this._localMatrix);
        }
        // Parent
        if (parent && parent.getWorldMatrix) {
            if (force) {
                parent.computeWorldMatrix();
            }
            if (useBillboardPath) {
                if (this._transformToBoneReferal) {
                    parent.getWorldMatrix().multiplyToRef(this._transformToBoneReferal.getWorldMatrix(), TmpVectors.Matrix[7]);
                }
                else {
                    TmpVectors.Matrix[7].copyFrom(parent.getWorldMatrix());
                }
                // Extract scaling and translation from parent
                var translation_1 = TmpVectors.Vector3[5];
                var scale = TmpVectors.Vector3[6];
                TmpVectors.Matrix[7].decompose(scale, undefined, translation_1);
                Matrix.ScalingToRef(scale.x, scale.y, scale.z, TmpVectors.Matrix[7]);
                TmpVectors.Matrix[7].setTranslation(translation_1);
                this._localMatrix.multiplyToRef(TmpVectors.Matrix[7], this._worldMatrix);
            }
            else {
                if (this._transformToBoneReferal) {
                    this._localMatrix.multiplyToRef(parent.getWorldMatrix(), TmpVectors.Matrix[6]);
                    TmpVectors.Matrix[6].multiplyToRef(this._transformToBoneReferal.getWorldMatrix(), this._worldMatrix);
                }
                else {
                    this._localMatrix.multiplyToRef(parent.getWorldMatrix(), this._worldMatrix);
                }
            }
            this._markSyncedWithParent();
        }
        else {
            this._worldMatrix.copyFrom(this._localMatrix);
        }
        // Billboarding based on camera orientation (testing PG:http://www.babylonjs-playground.com/#UJEIL#13)
        if (useBillboardPath && camera && this.billboardMode && !useBillboardPosition) {
            var storedTranslation = TmpVectors.Vector3[0];
            this._worldMatrix.getTranslationToRef(storedTranslation); // Save translation
            // Cancel camera rotation
            TmpVectors.Matrix[1].copyFrom(camera.getViewMatrix());
            TmpVectors.Matrix[1].setTranslationFromFloats(0, 0, 0);
            TmpVectors.Matrix[1].invertToRef(TmpVectors.Matrix[0]);
            if ((this.billboardMode & TransformNode.BILLBOARDMODE_ALL) !== TransformNode.BILLBOARDMODE_ALL) {
                TmpVectors.Matrix[0].decompose(undefined, TmpVectors.Quaternion[0], undefined);
                var eulerAngles = TmpVectors.Vector3[1];
                TmpVectors.Quaternion[0].toEulerAnglesToRef(eulerAngles);
                if ((this.billboardMode & TransformNode.BILLBOARDMODE_X) !== TransformNode.BILLBOARDMODE_X) {
                    eulerAngles.x = 0;
                }
                if ((this.billboardMode & TransformNode.BILLBOARDMODE_Y) !== TransformNode.BILLBOARDMODE_Y) {
                    eulerAngles.y = 0;
                }
                if ((this.billboardMode & TransformNode.BILLBOARDMODE_Z) !== TransformNode.BILLBOARDMODE_Z) {
                    eulerAngles.z = 0;
                }
                Matrix.RotationYawPitchRollToRef(eulerAngles.y, eulerAngles.x, eulerAngles.z, TmpVectors.Matrix[0]);
            }
            this._worldMatrix.setTranslationFromFloats(0, 0, 0);
            this._worldMatrix.multiplyToRef(TmpVectors.Matrix[0], this._worldMatrix);
            // Restore translation
            this._worldMatrix.setTranslation(TmpVectors.Vector3[0]);
        }
        // Normal matrix
        if (!this.ignoreNonUniformScaling) {
            if (this._scaling.isNonUniformWithinEpsilon(0.000001)) {
                this._updateNonUniformScalingState(true);
            }
            else if (parent && parent._nonUniformScaling) {
                this._updateNonUniformScalingState(parent._nonUniformScaling);
            }
            else {
                this._updateNonUniformScalingState(false);
            }
        }
        else {
            this._updateNonUniformScalingState(false);
        }
        this._afterComputeWorldMatrix();
        // Absolute position
        this._absolutePosition.copyFromFloats(this._worldMatrix.m[12], this._worldMatrix.m[13], this._worldMatrix.m[14]);
        this._isAbsoluteSynced = false;
        // Callbacks
        this.onAfterWorldMatrixUpdateObservable.notifyObservers(this);
        if (!this._poseMatrix) {
            this._poseMatrix = Matrix.Invert(this._worldMatrix);
        }
        // Cache the determinant
        this._worldMatrixDeterminantIsDirty = true;
        return this._worldMatrix;
    };
    /**
     * Resets this nodeTransform's local matrix to Matrix.Identity().
     * @param independentOfChildren indicates if all child nodeTransform's world-space transform should be preserved.
     */
    TransformNode.prototype.resetLocalMatrix = function (independentOfChildren) {
        if (independentOfChildren === void 0) { independentOfChildren = true; }
        this.computeWorldMatrix();
        if (independentOfChildren) {
            var children = this.getChildren();
            for (var i = 0; i < children.length; ++i) {
                var child = children[i];
                if (child) {
                    child.computeWorldMatrix();
                    var bakedMatrix = TmpVectors.Matrix[0];
                    child._localMatrix.multiplyToRef(this._localMatrix, bakedMatrix);
                    var tmpRotationQuaternion = TmpVectors.Quaternion[0];
                    bakedMatrix.decompose(child.scaling, tmpRotationQuaternion, child.position);
                    if (child.rotationQuaternion) {
                        child.rotationQuaternion = tmpRotationQuaternion;
                    }
                    else {
                        tmpRotationQuaternion.toEulerAnglesToRef(child.rotation);
                    }
                }
            }
        }
        this.scaling.copyFromFloats(1, 1, 1);
        this.position.copyFromFloats(0, 0, 0);
        this.rotation.copyFromFloats(0, 0, 0);
        //only if quaternion is already set
        if (this.rotationQuaternion) {
            this.rotationQuaternion = Quaternion.Identity();
        }
        this._worldMatrix = Matrix.Identity();
    };
    TransformNode.prototype._afterComputeWorldMatrix = function () {
    };
    /**
    * If you'd like to be called back after the mesh position, rotation or scaling has been updated.
    * @param func callback function to add
    *
    * @returns the TransformNode.
    */
    TransformNode.prototype.registerAfterWorldMatrixUpdate = function (func) {
        this.onAfterWorldMatrixUpdateObservable.add(func);
        return this;
    };
    /**
     * Removes a registered callback function.
     * @param func callback function to remove
     * @returns the TransformNode.
     */
    TransformNode.prototype.unregisterAfterWorldMatrixUpdate = function (func) {
        this.onAfterWorldMatrixUpdateObservable.removeCallback(func);
        return this;
    };
    /**
     * Gets the position of the current mesh in camera space
     * @param camera defines the camera to use
     * @returns a position
     */
    TransformNode.prototype.getPositionInCameraSpace = function (camera) {
        if (camera === void 0) { camera = null; }
        if (!camera) {
            camera = this.getScene().activeCamera;
        }
        return Vector3.TransformCoordinates(this.getAbsolutePosition(), camera.getViewMatrix());
    };
    /**
     * Returns the distance from the mesh to the active camera
     * @param camera defines the camera to use
     * @returns the distance
     */
    TransformNode.prototype.getDistanceToCamera = function (camera) {
        if (camera === void 0) { camera = null; }
        if (!camera) {
            camera = this.getScene().activeCamera;
        }
        return this.getAbsolutePosition().subtract(camera.globalPosition).length();
    };
    /**
     * Clone the current transform node
     * @param name Name of the new clone
     * @param newParent New parent for the clone
     * @param doNotCloneChildren Do not clone children hierarchy
     * @returns the new transform node
     */
    TransformNode.prototype.clone = function (name, newParent, doNotCloneChildren) {
        var _this = this;
        var result = SerializationHelper.Clone(function () { return new TransformNode(name, _this.getScene()); }, this);
        result.name = name;
        result.id = name;
        if (newParent) {
            result.parent = newParent;
        }
        if (!doNotCloneChildren) {
            // Children
            var directDescendants = this.getDescendants(true);
            for (var index = 0; index < directDescendants.length; index++) {
                var child = directDescendants[index];
                if (child.clone) {
                    child.clone(name + "." + child.name, result);
                }
            }
        }
        return result;
    };
    /**
     * Serializes the objects information.
     * @param currentSerializationObject defines the object to serialize in
     * @returns the serialized object
     */
    TransformNode.prototype.serialize = function (currentSerializationObject) {
        var serializationObject = SerializationHelper.Serialize(this, currentSerializationObject);
        serializationObject.type = this.getClassName();
        // Parent
        if (this.parent) {
            serializationObject.parentId = this.parent.id;
        }
        serializationObject.localMatrix = this.getPivotMatrix().asArray();
        serializationObject.isEnabled = this.isEnabled();
        // Parent
        if (this.parent) {
            serializationObject.parentId = this.parent.id;
        }
        return serializationObject;
    };
    // Statics
    /**
     * Returns a new TransformNode object parsed from the source provided.
     * @param parsedTransformNode is the source.
     * @param scene the scne the object belongs to
     * @param rootUrl is a string, it's the root URL to prefix the `delayLoadingFile` property with
     * @returns a new TransformNode object parsed from the source provided.
     */
    TransformNode.Parse = function (parsedTransformNode, scene, rootUrl) {
        var transformNode = SerializationHelper.Parse(function () { return new TransformNode(parsedTransformNode.name, scene); }, parsedTransformNode, scene, rootUrl);
        if (parsedTransformNode.localMatrix) {
            transformNode.setPreTransformMatrix(Matrix.FromArray(parsedTransformNode.localMatrix));
        }
        else if (parsedTransformNode.pivotMatrix) {
            transformNode.setPivotMatrix(Matrix.FromArray(parsedTransformNode.pivotMatrix));
        }
        transformNode.setEnabled(parsedTransformNode.isEnabled);
        // Parent
        if (parsedTransformNode.parentId) {
            transformNode._waitingParentId = parsedTransformNode.parentId;
        }
        return transformNode;
    };
    /**
     * Get all child-transformNodes of this node
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @returns an array of TransformNode
     */
    TransformNode.prototype.getChildTransformNodes = function (directDescendantsOnly, predicate) {
        var results = [];
        this._getDescendants(results, directDescendantsOnly, function (node) {
            return ((!predicate || predicate(node)) && (node instanceof TransformNode));
        });
        return results;
    };
    /**
     * Releases resources associated with this transform node.
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
     */
    TransformNode.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
        if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
        // Animations
        this.getScene().stopAnimation(this);
        // Remove from scene
        this.getScene().removeTransformNode(this);
        this.onAfterWorldMatrixUpdateObservable.clear();
        if (doNotRecurse) {
            var transformNodes = this.getChildTransformNodes(true);
            for (var _i = 0, transformNodes_1 = transformNodes; _i < transformNodes_1.length; _i++) {
                var transformNode = transformNodes_1[_i];
                transformNode.parent = null;
                transformNode.computeWorldMatrix(true);
            }
        }
        _super.prototype.dispose.call(this, doNotRecurse, disposeMaterialAndTextures);
    };
    /**
     * Uniformly scales the mesh to fit inside of a unit cube (1 X 1 X 1 units)
     * @param includeDescendants Use the hierarchy's bounding box instead of the mesh's bounding box. Default is false
     * @param ignoreRotation ignore rotation when computing the scale (ie. object will be axis aligned). Default is false
     * @param predicate predicate that is passed in to getHierarchyBoundingVectors when selecting which object should be included when scaling
     * @returns the current mesh
     */
    TransformNode.prototype.normalizeToUnitCube = function (includeDescendants, ignoreRotation, predicate) {
        if (includeDescendants === void 0) { includeDescendants = true; }
        if (ignoreRotation === void 0) { ignoreRotation = false; }
        var storedRotation = null;
        var storedRotationQuaternion = null;
        if (ignoreRotation) {
            if (this.rotationQuaternion) {
                storedRotationQuaternion = this.rotationQuaternion.clone();
                this.rotationQuaternion.copyFromFloats(0, 0, 0, 1);
            }
            else if (this.rotation) {
                storedRotation = this.rotation.clone();
                this.rotation.copyFromFloats(0, 0, 0);
            }
        }
        var boundingVectors = this.getHierarchyBoundingVectors(includeDescendants, predicate);
        var sizeVec = boundingVectors.max.subtract(boundingVectors.min);
        var maxDimension = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
        if (maxDimension === 0) {
            return this;
        }
        var scale = 1 / maxDimension;
        this.scaling.scaleInPlace(scale);
        if (ignoreRotation) {
            if (this.rotationQuaternion && storedRotationQuaternion) {
                this.rotationQuaternion.copyFrom(storedRotationQuaternion);
            }
            else if (this.rotation && storedRotation) {
                this.rotation.copyFrom(storedRotation);
            }
        }
        return this;
    };
    TransformNode.prototype._syncAbsoluteScalingAndRotation = function () {
        if (!this._isAbsoluteSynced) {
            this._worldMatrix.decompose(this._absoluteScaling, this._absoluteRotationQuaternion);
            this._isAbsoluteSynced = true;
        }
    };
    // Statics
    /**
     * Object will not rotate to face the camera
     */
    TransformNode.BILLBOARDMODE_NONE = 0;
    /**
     * Object will rotate to face the camera but only on the x axis
     */
    TransformNode.BILLBOARDMODE_X = 1;
    /**
     * Object will rotate to face the camera but only on the y axis
     */
    TransformNode.BILLBOARDMODE_Y = 2;
    /**
     * Object will rotate to face the camera but only on the z axis
     */
    TransformNode.BILLBOARDMODE_Z = 4;
    /**
     * Object will rotate to face the camera
     */
    TransformNode.BILLBOARDMODE_ALL = 7;
    /**
     * Object will rotate to face the camera's position instead of orientation
     */
    TransformNode.BILLBOARDMODE_USE_POSITION = 128;
    TransformNode._TmpRotation = Quaternion.Zero();
    TransformNode._TmpScaling = Vector3.Zero();
    TransformNode._TmpTranslation = Vector3.Zero();
    TransformNode._lookAtVectorCache = new Vector3(0, 0, 0);
    TransformNode._rotationAxisCache = new Quaternion();
    __decorate([
        serializeAsVector3("position")
    ], TransformNode.prototype, "_position", void 0);
    __decorate([
        serializeAsVector3("rotation")
    ], TransformNode.prototype, "_rotation", void 0);
    __decorate([
        serializeAsQuaternion("rotationQuaternion")
    ], TransformNode.prototype, "_rotationQuaternion", void 0);
    __decorate([
        serializeAsVector3("scaling")
    ], TransformNode.prototype, "_scaling", void 0);
    __decorate([
        serialize("billboardMode")
    ], TransformNode.prototype, "_billboardMode", void 0);
    __decorate([
        serialize()
    ], TransformNode.prototype, "scalingDeterminant", void 0);
    __decorate([
        serialize("infiniteDistance")
    ], TransformNode.prototype, "_infiniteDistance", void 0);
    __decorate([
        serialize()
    ], TransformNode.prototype, "ignoreNonUniformScaling", void 0);
    __decorate([
        serialize()
    ], TransformNode.prototype, "reIntegrateRotationIntoRotationQuaternion", void 0);
    return TransformNode;
}(Node));

/**
 * Class used to store data that will be store in GPU memory
 */
var Buffer = /** @class */ (function () {
    /**
     * Constructor
     * @param engine the engine
     * @param data the data to use for this buffer
     * @param updatable whether the data is updatable
     * @param stride the stride (optional)
     * @param postponeInternalCreation whether to postpone creating the internal WebGL buffer (optional)
     * @param instanced whether the buffer is instanced (optional)
     * @param useBytes set to true if the stride in in bytes (optional)
     * @param divisor sets an optional divisor for instances (1 by default)
     */
    function Buffer(engine, data, updatable, stride, postponeInternalCreation, instanced, useBytes, divisor) {
        if (stride === void 0) { stride = 0; }
        if (postponeInternalCreation === void 0) { postponeInternalCreation = false; }
        if (instanced === void 0) { instanced = false; }
        if (useBytes === void 0) { useBytes = false; }
        this._isAlreadyOwned = false;
        if (engine.getScene) { // old versions of VertexBuffer accepted 'mesh' instead of 'engine'
            this._engine = engine.getScene().getEngine();
        }
        else {
            this._engine = engine;
        }
        this._updatable = updatable;
        this._instanced = instanced;
        this._divisor = divisor || 1;
        this._data = data;
        this.byteStride = useBytes ? stride : stride * Float32Array.BYTES_PER_ELEMENT;
        if (!postponeInternalCreation) { // by default
            this.create();
        }
    }
    /**
     * Create a new VertexBuffer based on the current buffer
     * @param kind defines the vertex buffer kind (position, normal, etc.)
     * @param offset defines offset in the buffer (0 by default)
     * @param size defines the size in floats of attributes (position is 3 for instance)
     * @param stride defines the stride size in floats in the buffer (the offset to apply to reach next value when data is interleaved)
     * @param instanced defines if the vertex buffer contains indexed data
     * @param useBytes defines if the offset and stride are in bytes     *
     * @param divisor sets an optional divisor for instances (1 by default)
     * @returns the new vertex buffer
     */
    Buffer.prototype.createVertexBuffer = function (kind, offset, size, stride, instanced, useBytes, divisor) {
        if (useBytes === void 0) { useBytes = false; }
        var byteOffset = useBytes ? offset : offset * Float32Array.BYTES_PER_ELEMENT;
        var byteStride = stride ? (useBytes ? stride : stride * Float32Array.BYTES_PER_ELEMENT) : this.byteStride;
        // a lot of these parameters are ignored as they are overriden by the buffer
        return new VertexBuffer(this._engine, this, kind, this._updatable, true, byteStride, instanced === undefined ? this._instanced : instanced, byteOffset, size, undefined, undefined, true, this._divisor || divisor);
    };
    // Properties
    /**
     * Gets a boolean indicating if the Buffer is updatable?
     * @returns true if the buffer is updatable
     */
    Buffer.prototype.isUpdatable = function () {
        return this._updatable;
    };
    /**
     * Gets current buffer's data
     * @returns a DataArray or null
     */
    Buffer.prototype.getData = function () {
        return this._data;
    };
    /**
     * Gets underlying native buffer
     * @returns underlying native buffer
     */
    Buffer.prototype.getBuffer = function () {
        return this._buffer;
    };
    /**
     * Gets the stride in float32 units (i.e. byte stride / 4).
     * May not be an integer if the byte stride is not divisible by 4.
     * @returns the stride in float32 units
     * @deprecated Please use byteStride instead.
     */
    Buffer.prototype.getStrideSize = function () {
        return this.byteStride / Float32Array.BYTES_PER_ELEMENT;
    };
    // Methods
    /**
     * Store data into the buffer. If the buffer was already used it will be either recreated or updated depending on isUpdatable property
     * @param data defines the data to store
     */
    Buffer.prototype.create = function (data) {
        if (data === void 0) { data = null; }
        if (!data && this._buffer) {
            return; // nothing to do
        }
        data = data || this._data;
        if (!data) {
            return;
        }
        if (!this._buffer) { // create buffer
            if (this._updatable) {
                this._buffer = this._engine.createDynamicVertexBuffer(data);
                this._data = data;
            }
            else {
                this._buffer = this._engine.createVertexBuffer(data);
            }
        }
        else if (this._updatable) { // update buffer
            this._engine.updateDynamicVertexBuffer(this._buffer, data);
            this._data = data;
        }
    };
    /** @hidden */
    Buffer.prototype._rebuild = function () {
        this._buffer = null;
        this.create(this._data);
    };
    /**
     * Update current buffer data
     * @param data defines the data to store
     */
    Buffer.prototype.update = function (data) {
        this.create(data);
    };
    /**
     * Updates the data directly.
     * @param data the new data
     * @param offset the new offset
     * @param vertexCount the vertex count (optional)
     * @param useBytes set to true if the offset is in bytes
     */
    Buffer.prototype.updateDirectly = function (data, offset, vertexCount, useBytes) {
        if (useBytes === void 0) { useBytes = false; }
        if (!this._buffer) {
            return;
        }
        if (this._updatable) { // update buffer
            this._engine.updateDynamicVertexBuffer(this._buffer, data, useBytes ? offset : offset * Float32Array.BYTES_PER_ELEMENT, (vertexCount ? vertexCount * this.byteStride : undefined));
            this._data = null;
        }
    };
    /** @hidden */
    Buffer.prototype._increaseReferences = function () {
        if (!this._buffer) {
            return;
        }
        if (!this._isAlreadyOwned) {
            this._isAlreadyOwned = true;
            return;
        }
        this._buffer.references++;
    };
    /**
     * Release all resources
     */
    Buffer.prototype.dispose = function () {
        if (!this._buffer) {
            return;
        }
        if (this._engine._releaseBuffer(this._buffer)) {
            this._buffer = null;
        }
    };
    return Buffer;
}());
/**
     * Specialized buffer used to store vertex data
     */
var VertexBuffer = /** @class */ (function () {
    /**
     * Constructor
     * @param engine the engine
     * @param data the data to use for this vertex buffer
     * @param kind the vertex buffer kind
     * @param updatable whether the data is updatable
     * @param postponeInternalCreation whether to postpone creating the internal WebGL buffer (optional)
     * @param stride the stride (optional)
     * @param instanced whether the buffer is instanced (optional)
     * @param offset the offset of the data (optional)
     * @param size the number of components (optional)
     * @param type the type of the component (optional)
     * @param normalized whether the data contains normalized data (optional)
     * @param useBytes set to true if stride and offset are in bytes (optional)
     * @param divisor defines the instance divisor to use (1 by default)
     * @param takeBufferOwnership defines if the buffer should be released when the vertex buffer is disposed
     */
    function VertexBuffer(engine, data, kind, updatable, postponeInternalCreation, stride, instanced, offset, size, type, normalized, useBytes, divisor, takeBufferOwnership) {
        if (normalized === void 0) { normalized = false; }
        if (useBytes === void 0) { useBytes = false; }
        if (divisor === void 0) { divisor = 1; }
        if (takeBufferOwnership === void 0) { takeBufferOwnership = false; }
        if (data instanceof Buffer) {
            this._buffer = data;
            this._ownsBuffer = takeBufferOwnership;
            if (takeBufferOwnership) {
                this._buffer._increaseReferences();
            }
        }
        else {
            this._buffer = new Buffer(engine, data, updatable, stride, postponeInternalCreation, instanced, useBytes);
            this._ownsBuffer = true;
        }
        this._kind = kind;
        if (type == undefined) {
            var data_1 = this.getData();
            this.type = VertexBuffer.FLOAT;
            if (data_1 instanceof Int8Array) {
                this.type = VertexBuffer.BYTE;
            }
            else if (data_1 instanceof Uint8Array) {
                this.type = VertexBuffer.UNSIGNED_BYTE;
            }
            else if (data_1 instanceof Int16Array) {
                this.type = VertexBuffer.SHORT;
            }
            else if (data_1 instanceof Uint16Array) {
                this.type = VertexBuffer.UNSIGNED_SHORT;
            }
            else if (data_1 instanceof Int32Array) {
                this.type = VertexBuffer.INT;
            }
            else if (data_1 instanceof Uint32Array) {
                this.type = VertexBuffer.UNSIGNED_INT;
            }
        }
        else {
            this.type = type;
        }
        var typeByteLength = VertexBuffer.GetTypeByteLength(this.type);
        if (useBytes) {
            this._size = size || (stride ? (stride / typeByteLength) : VertexBuffer.DeduceStride(kind));
            this.byteStride = stride || this._buffer.byteStride || (this._size * typeByteLength);
            this.byteOffset = offset || 0;
        }
        else {
            this._size = size || stride || VertexBuffer.DeduceStride(kind);
            this.byteStride = stride ? (stride * typeByteLength) : (this._buffer.byteStride || (this._size * typeByteLength));
            this.byteOffset = (offset || 0) * typeByteLength;
        }
        this.normalized = normalized;
        this._instanced = instanced !== undefined ? instanced : false;
        this._instanceDivisor = instanced ? divisor : 0;
    }
    Object.defineProperty(VertexBuffer.prototype, "instanceDivisor", {
        /**
         * Gets or sets the instance divisor when in instanced mode
         */
        get: function () {
            return this._instanceDivisor;
        },
        set: function (value) {
            this._instanceDivisor = value;
            if (value == 0) {
                this._instanced = false;
            }
            else {
                this._instanced = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    VertexBuffer.prototype._rebuild = function () {
        if (!this._buffer) {
            return;
        }
        this._buffer._rebuild();
    };
    /**
     * Returns the kind of the VertexBuffer (string)
     * @returns a string
     */
    VertexBuffer.prototype.getKind = function () {
        return this._kind;
    };
    // Properties
    /**
     * Gets a boolean indicating if the VertexBuffer is updatable?
     * @returns true if the buffer is updatable
     */
    VertexBuffer.prototype.isUpdatable = function () {
        return this._buffer.isUpdatable();
    };
    /**
     * Gets current buffer's data
     * @returns a DataArray or null
     */
    VertexBuffer.prototype.getData = function () {
        return this._buffer.getData();
    };
    /**
     * Gets underlying native buffer
     * @returns underlying native buffer
     */
    VertexBuffer.prototype.getBuffer = function () {
        return this._buffer.getBuffer();
    };
    /**
     * Gets the stride in float32 units (i.e. byte stride / 4).
     * May not be an integer if the byte stride is not divisible by 4.
     * @returns the stride in float32 units
     * @deprecated Please use byteStride instead.
     */
    VertexBuffer.prototype.getStrideSize = function () {
        return this.byteStride / VertexBuffer.GetTypeByteLength(this.type);
    };
    /**
     * Returns the offset as a multiple of the type byte length.
     * @returns the offset in bytes
     * @deprecated Please use byteOffset instead.
     */
    VertexBuffer.prototype.getOffset = function () {
        return this.byteOffset / VertexBuffer.GetTypeByteLength(this.type);
    };
    /**
     * Returns the number of components per vertex attribute (integer)
     * @returns the size in float
     */
    VertexBuffer.prototype.getSize = function () {
        return this._size;
    };
    /**
     * Gets a boolean indicating is the internal buffer of the VertexBuffer is instanced
     * @returns true if this buffer is instanced
     */
    VertexBuffer.prototype.getIsInstanced = function () {
        return this._instanced;
    };
    /**
     * Returns the instancing divisor, zero for non-instanced (integer).
     * @returns a number
     */
    VertexBuffer.prototype.getInstanceDivisor = function () {
        return this._instanceDivisor;
    };
    // Methods
    /**
     * Store data into the buffer. If the buffer was already used it will be either recreated or updated depending on isUpdatable property
     * @param data defines the data to store
     */
    VertexBuffer.prototype.create = function (data) {
        this._buffer.create(data);
    };
    /**
     * Updates the underlying buffer according to the passed numeric array or Float32Array.
     * This function will create a new buffer if the current one is not updatable
     * @param data defines the data to store
     */
    VertexBuffer.prototype.update = function (data) {
        this._buffer.update(data);
    };
    /**
     * Updates directly the underlying WebGLBuffer according to the passed numeric array or Float32Array.
     * Returns the directly updated WebGLBuffer.
     * @param data the new data
     * @param offset the new offset
     * @param useBytes set to true if the offset is in bytes
     */
    VertexBuffer.prototype.updateDirectly = function (data, offset, useBytes) {
        if (useBytes === void 0) { useBytes = false; }
        this._buffer.updateDirectly(data, offset, undefined, useBytes);
    };
    /**
     * Disposes the VertexBuffer and the underlying WebGLBuffer.
     */
    VertexBuffer.prototype.dispose = function () {
        if (this._ownsBuffer) {
            this._buffer.dispose();
        }
    };
    /**
     * Enumerates each value of this vertex buffer as numbers.
     * @param count the number of values to enumerate
     * @param callback the callback function called for each value
     */
    VertexBuffer.prototype.forEach = function (count, callback) {
        VertexBuffer.ForEach(this._buffer.getData(), this.byteOffset, this.byteStride, this._size, this.type, count, this.normalized, callback);
    };
    /**
     * Deduces the stride given a kind.
     * @param kind The kind string to deduce
     * @returns The deduced stride
     */
    VertexBuffer.DeduceStride = function (kind) {
        switch (kind) {
            case VertexBuffer.UVKind:
            case VertexBuffer.UV2Kind:
            case VertexBuffer.UV3Kind:
            case VertexBuffer.UV4Kind:
            case VertexBuffer.UV5Kind:
            case VertexBuffer.UV6Kind:
                return 2;
            case VertexBuffer.NormalKind:
            case VertexBuffer.PositionKind:
                return 3;
            case VertexBuffer.ColorKind:
            case VertexBuffer.MatricesIndicesKind:
            case VertexBuffer.MatricesIndicesExtraKind:
            case VertexBuffer.MatricesWeightsKind:
            case VertexBuffer.MatricesWeightsExtraKind:
            case VertexBuffer.TangentKind:
                return 4;
            default:
                throw new Error("Invalid kind '" + kind + "'");
        }
    };
    /**
     * Gets the byte length of the given type.
     * @param type the type
     * @returns the number of bytes
     */
    VertexBuffer.GetTypeByteLength = function (type) {
        switch (type) {
            case VertexBuffer.BYTE:
            case VertexBuffer.UNSIGNED_BYTE:
                return 1;
            case VertexBuffer.SHORT:
            case VertexBuffer.UNSIGNED_SHORT:
                return 2;
            case VertexBuffer.INT:
            case VertexBuffer.UNSIGNED_INT:
            case VertexBuffer.FLOAT:
                return 4;
            default:
                throw new Error("Invalid type '" + type + "'");
        }
    };
    /**
     * Enumerates each value of the given parameters as numbers.
     * @param data the data to enumerate
     * @param byteOffset the byte offset of the data
     * @param byteStride the byte stride of the data
     * @param componentCount the number of components per element
     * @param componentType the type of the component
     * @param count the number of values to enumerate
     * @param normalized whether the data is normalized
     * @param callback the callback function called for each value
     */
    VertexBuffer.ForEach = function (data, byteOffset, byteStride, componentCount, componentType, count, normalized, callback) {
        if (data instanceof Array) {
            var offset = byteOffset / 4;
            var stride = byteStride / 4;
            for (var index = 0; index < count; index += componentCount) {
                for (var componentIndex = 0; componentIndex < componentCount; componentIndex++) {
                    callback(data[offset + componentIndex], index + componentIndex);
                }
                offset += stride;
            }
        }
        else {
            var dataView = data instanceof ArrayBuffer ? new DataView(data) : new DataView(data.buffer, data.byteOffset, data.byteLength);
            var componentByteLength = VertexBuffer.GetTypeByteLength(componentType);
            for (var index = 0; index < count; index += componentCount) {
                var componentByteOffset = byteOffset;
                for (var componentIndex = 0; componentIndex < componentCount; componentIndex++) {
                    var value = VertexBuffer._GetFloatValue(dataView, componentType, componentByteOffset, normalized);
                    callback(value, index + componentIndex);
                    componentByteOffset += componentByteLength;
                }
                byteOffset += byteStride;
            }
        }
    };
    VertexBuffer._GetFloatValue = function (dataView, type, byteOffset, normalized) {
        switch (type) {
            case VertexBuffer.BYTE: {
                var value = dataView.getInt8(byteOffset);
                if (normalized) {
                    value = Math.max(value / 127, -1);
                }
                return value;
            }
            case VertexBuffer.UNSIGNED_BYTE: {
                var value = dataView.getUint8(byteOffset);
                if (normalized) {
                    value = value / 255;
                }
                return value;
            }
            case VertexBuffer.SHORT: {
                var value = dataView.getInt16(byteOffset, true);
                if (normalized) {
                    value = Math.max(value / 32767, -1);
                }
                return value;
            }
            case VertexBuffer.UNSIGNED_SHORT: {
                var value = dataView.getUint16(byteOffset, true);
                if (normalized) {
                    value = value / 65535;
                }
                return value;
            }
            case VertexBuffer.INT: {
                return dataView.getInt32(byteOffset, true);
            }
            case VertexBuffer.UNSIGNED_INT: {
                return dataView.getUint32(byteOffset, true);
            }
            case VertexBuffer.FLOAT: {
                return dataView.getFloat32(byteOffset, true);
            }
            default: {
                throw new Error("Invalid component type " + type);
            }
        }
    };
    /**
     * The byte type.
     */
    VertexBuffer.BYTE = 5120;
    /**
     * The unsigned byte type.
     */
    VertexBuffer.UNSIGNED_BYTE = 5121;
    /**
     * The short type.
     */
    VertexBuffer.SHORT = 5122;
    /**
     * The unsigned short type.
     */
    VertexBuffer.UNSIGNED_SHORT = 5123;
    /**
     * The integer type.
     */
    VertexBuffer.INT = 5124;
    /**
     * The unsigned integer type.
     */
    VertexBuffer.UNSIGNED_INT = 5125;
    /**
     * The float type.
     */
    VertexBuffer.FLOAT = 5126;
    // Enums
    /**
     * Positions
     */
    VertexBuffer.PositionKind = "position";
    /**
     * Normals
     */
    VertexBuffer.NormalKind = "normal";
    /**
     * Tangents
     */
    VertexBuffer.TangentKind = "tangent";
    /**
     * Texture coordinates
     */
    VertexBuffer.UVKind = "uv";
    /**
     * Texture coordinates 2
     */
    VertexBuffer.UV2Kind = "uv2";
    /**
     * Texture coordinates 3
     */
    VertexBuffer.UV3Kind = "uv3";
    /**
     * Texture coordinates 4
     */
    VertexBuffer.UV4Kind = "uv4";
    /**
     * Texture coordinates 5
     */
    VertexBuffer.UV5Kind = "uv5";
    /**
     * Texture coordinates 6
     */
    VertexBuffer.UV6Kind = "uv6";
    /**
     * Colors
     */
    VertexBuffer.ColorKind = "color";
    /**
     * Matrix indices (for bones)
     */
    VertexBuffer.MatricesIndicesKind = "matricesIndices";
    /**
     * Matrix weights (for bones)
     */
    VertexBuffer.MatricesWeightsKind = "matricesWeights";
    /**
     * Additional matrix indices (for bones)
     */
    VertexBuffer.MatricesIndicesExtraKind = "matricesIndicesExtra";
    /**
     * Additional matrix weights (for bones)
     */
    VertexBuffer.MatricesWeightsExtraKind = "matricesWeightsExtra";
    return VertexBuffer;
}());

/**
 * This class contains the various kinds of data on every vertex of a mesh used in determining its shape and appearance
 */
var VertexData = /** @class */ (function () {
    function VertexData() {
    }
    /**
     * Uses the passed data array to set the set the values for the specified kind of data
     * @param data a linear array of floating numbers
     * @param kind the type of data that is being set, eg positions, colors etc
     */
    VertexData.prototype.set = function (data, kind) {
        if (!data.length) {
            Logger.Warn("Setting vertex data kind '" + kind + "' with an empty array");
        }
        switch (kind) {
            case VertexBuffer.PositionKind:
                this.positions = data;
                break;
            case VertexBuffer.NormalKind:
                this.normals = data;
                break;
            case VertexBuffer.TangentKind:
                this.tangents = data;
                break;
            case VertexBuffer.UVKind:
                this.uvs = data;
                break;
            case VertexBuffer.UV2Kind:
                this.uvs2 = data;
                break;
            case VertexBuffer.UV3Kind:
                this.uvs3 = data;
                break;
            case VertexBuffer.UV4Kind:
                this.uvs4 = data;
                break;
            case VertexBuffer.UV5Kind:
                this.uvs5 = data;
                break;
            case VertexBuffer.UV6Kind:
                this.uvs6 = data;
                break;
            case VertexBuffer.ColorKind:
                this.colors = data;
                break;
            case VertexBuffer.MatricesIndicesKind:
                this.matricesIndices = data;
                break;
            case VertexBuffer.MatricesWeightsKind:
                this.matricesWeights = data;
                break;
            case VertexBuffer.MatricesIndicesExtraKind:
                this.matricesIndicesExtra = data;
                break;
            case VertexBuffer.MatricesWeightsExtraKind:
                this.matricesWeightsExtra = data;
                break;
        }
    };
    /**
     * Associates the vertexData to the passed Mesh.
     * Sets it as updatable or not (default `false`)
     * @param mesh the mesh the vertexData is applied to
     * @param updatable when used and having the value true allows new data to update the vertexData
     * @returns the VertexData
     */
    VertexData.prototype.applyToMesh = function (mesh, updatable) {
        this._applyTo(mesh, updatable);
        return this;
    };
    /**
     * Associates the vertexData to the passed Geometry.
     * Sets it as updatable or not (default `false`)
     * @param geometry the geometry the vertexData is applied to
     * @param updatable when used and having the value true allows new data to update the vertexData
     * @returns VertexData
     */
    VertexData.prototype.applyToGeometry = function (geometry, updatable) {
        this._applyTo(geometry, updatable);
        return this;
    };
    /**
     * Updates the associated mesh
     * @param mesh the mesh to be updated
     * @param updateExtends when true the mesh BoundingInfo will be renewed when and if position kind is updated, optional with default false
     * @param makeItUnique when true, and when and if position kind is updated, a new global geometry will be  created from these positions and set to the mesh, optional with default false
     * @returns VertexData
     */
    VertexData.prototype.updateMesh = function (mesh) {
        this._update(mesh);
        return this;
    };
    /**
     * Updates the associated geometry
     * @param geometry the geometry to be updated
     * @param updateExtends when true BoundingInfo will be renewed when and if position kind is updated, optional with default false
     * @param makeItUnique when true, and when and if position kind is updated, a new global geometry will be created from these positions and set to the mesh, optional with default false
     * @returns VertexData.
     */
    VertexData.prototype.updateGeometry = function (geometry) {
        this._update(geometry);
        return this;
    };
    VertexData.prototype._applyTo = function (meshOrGeometry, updatable) {
        if (updatable === void 0) { updatable = false; }
        if (this.positions) {
            meshOrGeometry.setVerticesData(VertexBuffer.PositionKind, this.positions, updatable);
        }
        if (this.normals) {
            meshOrGeometry.setVerticesData(VertexBuffer.NormalKind, this.normals, updatable);
        }
        if (this.tangents) {
            meshOrGeometry.setVerticesData(VertexBuffer.TangentKind, this.tangents, updatable);
        }
        if (this.uvs) {
            meshOrGeometry.setVerticesData(VertexBuffer.UVKind, this.uvs, updatable);
        }
        if (this.uvs2) {
            meshOrGeometry.setVerticesData(VertexBuffer.UV2Kind, this.uvs2, updatable);
        }
        if (this.uvs3) {
            meshOrGeometry.setVerticesData(VertexBuffer.UV3Kind, this.uvs3, updatable);
        }
        if (this.uvs4) {
            meshOrGeometry.setVerticesData(VertexBuffer.UV4Kind, this.uvs4, updatable);
        }
        if (this.uvs5) {
            meshOrGeometry.setVerticesData(VertexBuffer.UV5Kind, this.uvs5, updatable);
        }
        if (this.uvs6) {
            meshOrGeometry.setVerticesData(VertexBuffer.UV6Kind, this.uvs6, updatable);
        }
        if (this.colors) {
            meshOrGeometry.setVerticesData(VertexBuffer.ColorKind, this.colors, updatable);
        }
        if (this.matricesIndices) {
            meshOrGeometry.setVerticesData(VertexBuffer.MatricesIndicesKind, this.matricesIndices, updatable);
        }
        if (this.matricesWeights) {
            meshOrGeometry.setVerticesData(VertexBuffer.MatricesWeightsKind, this.matricesWeights, updatable);
        }
        if (this.matricesIndicesExtra) {
            meshOrGeometry.setVerticesData(VertexBuffer.MatricesIndicesExtraKind, this.matricesIndicesExtra, updatable);
        }
        if (this.matricesWeightsExtra) {
            meshOrGeometry.setVerticesData(VertexBuffer.MatricesWeightsExtraKind, this.matricesWeightsExtra, updatable);
        }
        if (this.indices) {
            meshOrGeometry.setIndices(this.indices, null, updatable);
        }
        else {
            meshOrGeometry.setIndices([], null);
        }
        return this;
    };
    VertexData.prototype._update = function (meshOrGeometry, updateExtends, makeItUnique) {
        if (this.positions) {
            meshOrGeometry.updateVerticesData(VertexBuffer.PositionKind, this.positions, updateExtends, makeItUnique);
        }
        if (this.normals) {
            meshOrGeometry.updateVerticesData(VertexBuffer.NormalKind, this.normals, updateExtends, makeItUnique);
        }
        if (this.tangents) {
            meshOrGeometry.updateVerticesData(VertexBuffer.TangentKind, this.tangents, updateExtends, makeItUnique);
        }
        if (this.uvs) {
            meshOrGeometry.updateVerticesData(VertexBuffer.UVKind, this.uvs, updateExtends, makeItUnique);
        }
        if (this.uvs2) {
            meshOrGeometry.updateVerticesData(VertexBuffer.UV2Kind, this.uvs2, updateExtends, makeItUnique);
        }
        if (this.uvs3) {
            meshOrGeometry.updateVerticesData(VertexBuffer.UV3Kind, this.uvs3, updateExtends, makeItUnique);
        }
        if (this.uvs4) {
            meshOrGeometry.updateVerticesData(VertexBuffer.UV4Kind, this.uvs4, updateExtends, makeItUnique);
        }
        if (this.uvs5) {
            meshOrGeometry.updateVerticesData(VertexBuffer.UV5Kind, this.uvs5, updateExtends, makeItUnique);
        }
        if (this.uvs6) {
            meshOrGeometry.updateVerticesData(VertexBuffer.UV6Kind, this.uvs6, updateExtends, makeItUnique);
        }
        if (this.colors) {
            meshOrGeometry.updateVerticesData(VertexBuffer.ColorKind, this.colors, updateExtends, makeItUnique);
        }
        if (this.matricesIndices) {
            meshOrGeometry.updateVerticesData(VertexBuffer.MatricesIndicesKind, this.matricesIndices, updateExtends, makeItUnique);
        }
        if (this.matricesWeights) {
            meshOrGeometry.updateVerticesData(VertexBuffer.MatricesWeightsKind, this.matricesWeights, updateExtends, makeItUnique);
        }
        if (this.matricesIndicesExtra) {
            meshOrGeometry.updateVerticesData(VertexBuffer.MatricesIndicesExtraKind, this.matricesIndicesExtra, updateExtends, makeItUnique);
        }
        if (this.matricesWeightsExtra) {
            meshOrGeometry.updateVerticesData(VertexBuffer.MatricesWeightsExtraKind, this.matricesWeightsExtra, updateExtends, makeItUnique);
        }
        if (this.indices) {
            meshOrGeometry.setIndices(this.indices, null);
        }
        return this;
    };
    /**
     * Transforms each position and each normal of the vertexData according to the passed Matrix
     * @param matrix the transforming matrix
     * @returns the VertexData
     */
    VertexData.prototype.transform = function (matrix) {
        var flip = matrix.determinant() < 0;
        var transformed = Vector3.Zero();
        var index;
        if (this.positions) {
            var position = Vector3.Zero();
            for (index = 0; index < this.positions.length; index += 3) {
                Vector3.FromArrayToRef(this.positions, index, position);
                Vector3.TransformCoordinatesToRef(position, matrix, transformed);
                this.positions[index] = transformed.x;
                this.positions[index + 1] = transformed.y;
                this.positions[index + 2] = transformed.z;
            }
        }
        if (this.normals) {
            var normal = Vector3.Zero();
            for (index = 0; index < this.normals.length; index += 3) {
                Vector3.FromArrayToRef(this.normals, index, normal);
                Vector3.TransformNormalToRef(normal, matrix, transformed);
                this.normals[index] = transformed.x;
                this.normals[index + 1] = transformed.y;
                this.normals[index + 2] = transformed.z;
            }
        }
        if (this.tangents) {
            var tangent = Vector4.Zero();
            var tangentTransformed = Vector4.Zero();
            for (index = 0; index < this.tangents.length; index += 4) {
                Vector4.FromArrayToRef(this.tangents, index, tangent);
                Vector4.TransformNormalToRef(tangent, matrix, tangentTransformed);
                this.tangents[index] = tangentTransformed.x;
                this.tangents[index + 1] = tangentTransformed.y;
                this.tangents[index + 2] = tangentTransformed.z;
                this.tangents[index + 3] = tangentTransformed.w;
            }
        }
        if (flip && this.indices) {
            for (index = 0; index < this.indices.length; index += 3) {
                var tmp = this.indices[index + 1];
                this.indices[index + 1] = this.indices[index + 2];
                this.indices[index + 2] = tmp;
            }
        }
        return this;
    };
    /**
     * Merges the passed VertexData into the current one
     * @param other the VertexData to be merged into the current one
     * @param use32BitsIndices defines a boolean indicating if indices must be store in a 32 bits array
     * @returns the modified VertexData
     */
    VertexData.prototype.merge = function (other, use32BitsIndices) {
        if (use32BitsIndices === void 0) { use32BitsIndices = false; }
        this._validate();
        other._validate();
        if (!this.normals !== !other.normals ||
            !this.tangents !== !other.tangents ||
            !this.uvs !== !other.uvs ||
            !this.uvs2 !== !other.uvs2 ||
            !this.uvs3 !== !other.uvs3 ||
            !this.uvs4 !== !other.uvs4 ||
            !this.uvs5 !== !other.uvs5 ||
            !this.uvs6 !== !other.uvs6 ||
            !this.colors !== !other.colors ||
            !this.matricesIndices !== !other.matricesIndices ||
            !this.matricesWeights !== !other.matricesWeights ||
            !this.matricesIndicesExtra !== !other.matricesIndicesExtra ||
            !this.matricesWeightsExtra !== !other.matricesWeightsExtra) {
            throw new Error("Cannot merge vertex data that do not have the same set of attributes");
        }
        if (other.indices) {
            if (!this.indices) {
                this.indices = [];
            }
            var offset = this.positions ? this.positions.length / 3 : 0;
            var isSrcTypedArray = this.indices.BYTES_PER_ELEMENT !== undefined;
            if (isSrcTypedArray) {
                var len = this.indices.length + other.indices.length;
                var temp = use32BitsIndices || this.indices instanceof Uint32Array ? new Uint32Array(len) : new Uint16Array(len);
                temp.set(this.indices);
                var decal = this.indices.length;
                for (var index = 0; index < other.indices.length; index++) {
                    temp[decal + index] = other.indices[index] + offset;
                }
                this.indices = temp;
            }
            else {
                for (var index = 0; index < other.indices.length; index++) {
                    this.indices.push(other.indices[index] + offset);
                }
            }
        }
        this.positions = this._mergeElement(this.positions, other.positions);
        this.normals = this._mergeElement(this.normals, other.normals);
        this.tangents = this._mergeElement(this.tangents, other.tangents);
        this.uvs = this._mergeElement(this.uvs, other.uvs);
        this.uvs2 = this._mergeElement(this.uvs2, other.uvs2);
        this.uvs3 = this._mergeElement(this.uvs3, other.uvs3);
        this.uvs4 = this._mergeElement(this.uvs4, other.uvs4);
        this.uvs5 = this._mergeElement(this.uvs5, other.uvs5);
        this.uvs6 = this._mergeElement(this.uvs6, other.uvs6);
        this.colors = this._mergeElement(this.colors, other.colors);
        this.matricesIndices = this._mergeElement(this.matricesIndices, other.matricesIndices);
        this.matricesWeights = this._mergeElement(this.matricesWeights, other.matricesWeights);
        this.matricesIndicesExtra = this._mergeElement(this.matricesIndicesExtra, other.matricesIndicesExtra);
        this.matricesWeightsExtra = this._mergeElement(this.matricesWeightsExtra, other.matricesWeightsExtra);
        return this;
    };
    VertexData.prototype._mergeElement = function (source, other) {
        if (!source) {
            return other;
        }
        if (!other) {
            return source;
        }
        var len = other.length + source.length;
        var isSrcTypedArray = source instanceof Float32Array;
        var isOthTypedArray = other instanceof Float32Array;
        // use non-loop method when the source is Float32Array
        if (isSrcTypedArray) {
            var ret32 = new Float32Array(len);
            ret32.set(source);
            ret32.set(other, source.length);
            return ret32;
            // source is number[], when other is also use concat
        }
        else if (!isOthTypedArray) {
            return source.concat(other);
            // source is a number[], but other is a Float32Array, loop required
        }
        else {
            var ret = source.slice(0); // copy source to a separate array
            for (var i = 0, len = other.length; i < len; i++) {
                ret.push(other[i]);
            }
            return ret;
        }
    };
    VertexData.prototype._validate = function () {
        if (!this.positions) {
            throw new Error("Positions are required");
        }
        var getElementCount = function (kind, values) {
            var stride = VertexBuffer.DeduceStride(kind);
            if ((values.length % stride) !== 0) {
                throw new Error("The " + kind + "s array count must be a multiple of " + stride);
            }
            return values.length / stride;
        };
        var positionsElementCount = getElementCount(VertexBuffer.PositionKind, this.positions);
        var validateElementCount = function (kind, values) {
            var elementCount = getElementCount(kind, values);
            if (elementCount !== positionsElementCount) {
                throw new Error("The " + kind + "s element count (" + elementCount + ") does not match the positions count (" + positionsElementCount + ")");
            }
        };
        if (this.normals) {
            validateElementCount(VertexBuffer.NormalKind, this.normals);
        }
        if (this.tangents) {
            validateElementCount(VertexBuffer.TangentKind, this.tangents);
        }
        if (this.uvs) {
            validateElementCount(VertexBuffer.UVKind, this.uvs);
        }
        if (this.uvs2) {
            validateElementCount(VertexBuffer.UV2Kind, this.uvs2);
        }
        if (this.uvs3) {
            validateElementCount(VertexBuffer.UV3Kind, this.uvs3);
        }
        if (this.uvs4) {
            validateElementCount(VertexBuffer.UV4Kind, this.uvs4);
        }
        if (this.uvs5) {
            validateElementCount(VertexBuffer.UV5Kind, this.uvs5);
        }
        if (this.uvs6) {
            validateElementCount(VertexBuffer.UV6Kind, this.uvs6);
        }
        if (this.colors) {
            validateElementCount(VertexBuffer.ColorKind, this.colors);
        }
        if (this.matricesIndices) {
            validateElementCount(VertexBuffer.MatricesIndicesKind, this.matricesIndices);
        }
        if (this.matricesWeights) {
            validateElementCount(VertexBuffer.MatricesWeightsKind, this.matricesWeights);
        }
        if (this.matricesIndicesExtra) {
            validateElementCount(VertexBuffer.MatricesIndicesExtraKind, this.matricesIndicesExtra);
        }
        if (this.matricesWeightsExtra) {
            validateElementCount(VertexBuffer.MatricesWeightsExtraKind, this.matricesWeightsExtra);
        }
    };
    /**
     * Serializes the VertexData
     * @returns a serialized object
     */
    VertexData.prototype.serialize = function () {
        var serializationObject = this.serialize();
        if (this.positions) {
            serializationObject.positions = this.positions;
        }
        if (this.normals) {
            serializationObject.normals = this.normals;
        }
        if (this.tangents) {
            serializationObject.tangents = this.tangents;
        }
        if (this.uvs) {
            serializationObject.uvs = this.uvs;
        }
        if (this.uvs2) {
            serializationObject.uvs2 = this.uvs2;
        }
        if (this.uvs3) {
            serializationObject.uvs3 = this.uvs3;
        }
        if (this.uvs4) {
            serializationObject.uvs4 = this.uvs4;
        }
        if (this.uvs5) {
            serializationObject.uvs5 = this.uvs5;
        }
        if (this.uvs6) {
            serializationObject.uvs6 = this.uvs6;
        }
        if (this.colors) {
            serializationObject.colors = this.colors;
        }
        if (this.matricesIndices) {
            serializationObject.matricesIndices = this.matricesIndices;
            serializationObject.matricesIndices._isExpanded = true;
        }
        if (this.matricesWeights) {
            serializationObject.matricesWeights = this.matricesWeights;
        }
        if (this.matricesIndicesExtra) {
            serializationObject.matricesIndicesExtra = this.matricesIndicesExtra;
            serializationObject.matricesIndicesExtra._isExpanded = true;
        }
        if (this.matricesWeightsExtra) {
            serializationObject.matricesWeightsExtra = this.matricesWeightsExtra;
        }
        serializationObject.indices = this.indices;
        return serializationObject;
    };
    // Statics
    /**
     * Extracts the vertexData from a mesh
     * @param mesh the mesh from which to extract the VertexData
     * @param copyWhenShared defines if the VertexData must be cloned when shared between multiple meshes, optional, default false
     * @param forceCopy indicating that the VertexData must be cloned, optional, default false
     * @returns the object VertexData associated to the passed mesh
     */
    VertexData.ExtractFromMesh = function (mesh, copyWhenShared, forceCopy) {
        return VertexData._ExtractFrom(mesh, copyWhenShared, forceCopy);
    };
    /**
     * Extracts the vertexData from the geometry
     * @param geometry the geometry from which to extract the VertexData
     * @param copyWhenShared defines if the VertexData must be cloned when the geometrty is shared between multiple meshes, optional, default false
     * @param forceCopy indicating that the VertexData must be cloned, optional, default false
     * @returns the object VertexData associated to the passed mesh
     */
    VertexData.ExtractFromGeometry = function (geometry, copyWhenShared, forceCopy) {
        return VertexData._ExtractFrom(geometry, copyWhenShared, forceCopy);
    };
    VertexData._ExtractFrom = function (meshOrGeometry, copyWhenShared, forceCopy) {
        var result = new VertexData();
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.PositionKind)) {
            result.positions = meshOrGeometry.getVerticesData(VertexBuffer.PositionKind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.NormalKind)) {
            result.normals = meshOrGeometry.getVerticesData(VertexBuffer.NormalKind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.TangentKind)) {
            result.tangents = meshOrGeometry.getVerticesData(VertexBuffer.TangentKind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UVKind)) {
            result.uvs = meshOrGeometry.getVerticesData(VertexBuffer.UVKind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UV2Kind)) {
            result.uvs2 = meshOrGeometry.getVerticesData(VertexBuffer.UV2Kind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UV3Kind)) {
            result.uvs3 = meshOrGeometry.getVerticesData(VertexBuffer.UV3Kind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UV4Kind)) {
            result.uvs4 = meshOrGeometry.getVerticesData(VertexBuffer.UV4Kind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UV5Kind)) {
            result.uvs5 = meshOrGeometry.getVerticesData(VertexBuffer.UV5Kind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UV6Kind)) {
            result.uvs6 = meshOrGeometry.getVerticesData(VertexBuffer.UV6Kind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.ColorKind)) {
            result.colors = meshOrGeometry.getVerticesData(VertexBuffer.ColorKind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.MatricesIndicesKind)) {
            result.matricesIndices = meshOrGeometry.getVerticesData(VertexBuffer.MatricesIndicesKind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
            result.matricesWeights = meshOrGeometry.getVerticesData(VertexBuffer.MatricesWeightsKind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.MatricesIndicesExtraKind)) {
            result.matricesIndicesExtra = meshOrGeometry.getVerticesData(VertexBuffer.MatricesIndicesExtraKind, copyWhenShared, forceCopy);
        }
        if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.MatricesWeightsExtraKind)) {
            result.matricesWeightsExtra = meshOrGeometry.getVerticesData(VertexBuffer.MatricesWeightsExtraKind, copyWhenShared, forceCopy);
        }
        result.indices = meshOrGeometry.getIndices(copyWhenShared, forceCopy);
        return result;
    };
    /**
     * Creates the VertexData for a Ribbon
     * @param options an object used to set the following optional parameters for the ribbon, required but can be empty
      * * pathArray array of paths, each of which an array of successive Vector3
      * * closeArray creates a seam between the first and the last paths of the pathArray, optional, default false
      * * closePath creates a seam between the first and the last points of each path of the path array, optional, default false
      * * offset a positive integer, only used when pathArray contains a single path (offset = 10 means the point 1 is joined to the point 11), default rounded half size of the pathArray length
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
      * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
      * * invertUV swaps in the U and V coordinates when applying a texture, optional, default false
      * * uvs a linear array, of length 2 * number of vertices, of custom UV values, optional
      * * colors a linear array, of length 4 * number of vertices, of custom color values, optional
     * @returns the VertexData of the ribbon
     */
    VertexData.CreateRibbon = function (options) {
        throw _DevTools.WarnImport("ribbonBuilder");
    };
    /**
     * Creates the VertexData for a box
     * @param options an object used to set the following optional parameters for the box, required but can be empty
      * * size sets the width, height and depth of the box to the value of size, optional default 1
      * * width sets the width (x direction) of the box, overwrites the width set by size, optional, default size
      * * height sets the height (y direction) of the box, overwrites the height set by size, optional, default size
      * * depth sets the depth (z direction) of the box, overwrites the depth set by size, optional, default size
      * * faceUV an array of 6 Vector4 elements used to set different images to each box side
      * * faceColors an array of 6 Color3 elements used to set different colors to each box side
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
      * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @returns the VertexData of the box
     */
    VertexData.CreateBox = function (options) {
        throw _DevTools.WarnImport("boxBuilder");
    };
    /**
     * Creates the VertexData for a tiled box
     * @param options an object used to set the following optional parameters for the box, required but can be empty
      * * faceTiles sets the pattern, tile size and number of tiles for a face
      * * faceUV an array of 6 Vector4 elements used to set different images to each box side
      * * faceColors an array of 6 Color3 elements used to set different colors to each box side
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
     * @returns the VertexData of the box
     */
    VertexData.CreateTiledBox = function (options) {
        throw _DevTools.WarnImport("tiledBoxBuilder");
    };
    /**
     * Creates the VertexData for a tiled plane
     * @param options an object used to set the following optional parameters for the box, required but can be empty
      * * pattern a limited pattern arrangement depending on the number
      * * tileSize sets the width, height and depth of the tile to the value of size, optional default 1
      * * tileWidth sets the width (x direction) of the tile, overwrites the width set by size, optional, default size
      * * tileHeight sets the height (y direction) of the tile, overwrites the height set by size, optional, default size
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
      * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @returns the VertexData of the tiled plane
     */
    VertexData.CreateTiledPlane = function (options) {
        throw _DevTools.WarnImport("tiledPlaneBuilder");
    };
    /**
     * Creates the VertexData for an ellipsoid, defaults to a sphere
     * @param options an object used to set the following optional parameters for the box, required but can be empty
      * * segments sets the number of horizontal strips optional, default 32
      * * diameter sets the axes dimensions, diameterX, diameterY and diameterZ to the value of diameter, optional default 1
      * * diameterX sets the diameterX (x direction) of the ellipsoid, overwrites the diameterX set by diameter, optional, default diameter
      * * diameterY sets the diameterY (y direction) of the ellipsoid, overwrites the diameterY set by diameter, optional, default diameter
      * * diameterZ sets the diameterZ (z direction) of the ellipsoid, overwrites the diameterZ set by diameter, optional, default diameter
      * * arc a number from 0 to 1, to create an unclosed ellipsoid based on the fraction of the circumference (latitude) given by the arc value, optional, default 1
      * * slice a number from 0 to 1, to create an unclosed ellipsoid based on the fraction of the height (latitude) given by the arc value, optional, default 1
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
      * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @returns the VertexData of the ellipsoid
     */
    VertexData.CreateSphere = function (options) {
        throw _DevTools.WarnImport("sphereBuilder");
    };
    /**
     * Creates the VertexData for a cylinder, cone or prism
     * @param options an object used to set the following optional parameters for the box, required but can be empty
      * * height sets the height (y direction) of the cylinder, optional, default 2
      * * diameterTop sets the diameter of the top of the cone, overwrites diameter,  optional, default diameter
      * * diameterBottom sets the diameter of the bottom of the cone, overwrites diameter,  optional, default diameter
      * * diameter sets the diameter of the top and bottom of the cone, optional default 1
      * * tessellation the number of prism sides, 3 for a triangular prism, optional, default 24
      * * subdivisions` the number of rings along the cylinder height, optional, default 1
      * * arc a number from 0 to 1, to create an unclosed cylinder based on the fraction of the circumference given by the arc value, optional, default 1
      * * faceColors an array of Color3 elements used to set different colors to the top, rings and bottom respectively
      * * faceUV an array of Vector4 elements used to set different images to the top, rings and bottom respectively
      * * hasRings when true makes each subdivision independantly treated as a face for faceUV and faceColors, optional, default false
      * * enclose when true closes an open cylinder by adding extra flat faces between the height axis and vertical edges, think cut cake
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
      * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @returns the VertexData of the cylinder, cone or prism
     */
    VertexData.CreateCylinder = function (options) {
        throw _DevTools.WarnImport("cylinderBuilder");
    };
    /**
     * Creates the VertexData for a torus
     * @param options an object used to set the following optional parameters for the box, required but can be empty
      * * diameter the diameter of the torus, optional default 1
      * * thickness the diameter of the tube forming the torus, optional default 0.5
      * * tessellation the number of prism sides, 3 for a triangular prism, optional, default 24
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
      * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @returns the VertexData of the torus
     */
    VertexData.CreateTorus = function (options) {
        throw _DevTools.WarnImport("torusBuilder");
    };
    /**
     * Creates the VertexData of the LineSystem
     * @param options an object used to set the following optional parameters for the LineSystem, required but can be empty
     *  - lines an array of lines, each line being an array of successive Vector3
     *  - colors an array of line colors, each of the line colors being an array of successive Color4, one per line point
     * @returns the VertexData of the LineSystem
     */
    VertexData.CreateLineSystem = function (options) {
        throw _DevTools.WarnImport("linesBuilder");
    };
    /**
     * Create the VertexData for a DashedLines
     * @param options an object used to set the following optional parameters for the DashedLines, required but can be empty
     *  - points an array successive Vector3
     *  - dashSize the size of the dashes relative to the dash number, optional, default 3
     *  - gapSize the size of the gap between two successive dashes relative to the dash number, optional, default 1
     *  - dashNb the intended total number of dashes, optional, default 200
     * @returns the VertexData for the DashedLines
     */
    VertexData.CreateDashedLines = function (options) {
        throw _DevTools.WarnImport("linesBuilder");
    };
    /**
     * Creates the VertexData for a Ground
     * @param options an object used to set the following optional parameters for the Ground, required but can be empty
     *  - width the width (x direction) of the ground, optional, default 1
     *  - height the height (z direction) of the ground, optional, default 1
     *  - subdivisions the number of subdivisions per side, optional, default 1
     * @returns the VertexData of the Ground
     */
    VertexData.CreateGround = function (options) {
        throw _DevTools.WarnImport("groundBuilder");
    };
    /**
     * Creates the VertexData for a TiledGround by subdividing the ground into tiles
     * @param options an object used to set the following optional parameters for the Ground, required but can be empty
      * * xmin the ground minimum X coordinate, optional, default -1
      * * zmin the ground minimum Z coordinate, optional, default -1
      * * xmax the ground maximum X coordinate, optional, default 1
      * * zmax the ground maximum Z coordinate, optional, default 1
      * * subdivisions a javascript object {w: positive integer, h: positive integer}, `w` and `h` are the numbers of subdivisions on the ground width and height creating 'tiles', default {w: 6, h: 6}
      * * precision a javascript object {w: positive integer, h: positive integer}, `w` and `h` are the numbers of subdivisions on the tile width and height, default {w: 2, h: 2}
     * @returns the VertexData of the TiledGround
     */
    VertexData.CreateTiledGround = function (options) {
        throw _DevTools.WarnImport("groundBuilder");
    };
    /**
     * Creates the VertexData of the Ground designed from a heightmap
     * @param options an object used to set the following parameters for the Ground, required and provided by MeshBuilder.CreateGroundFromHeightMap
      * * width the width (x direction) of the ground
      * * height the height (z direction) of the ground
      * * subdivisions the number of subdivisions per side
      * * minHeight the minimum altitude on the ground, optional, default 0
      * * maxHeight the maximum altitude on the ground, optional default 1
      * * colorFilter the filter to apply to the image pixel colors to compute the height, optional Color3, default (0.3, 0.59, 0.11)
      * * buffer the array holding the image color data
      * * bufferWidth the width of image
      * * bufferHeight the height of image
      * * alphaFilter Remove any data where the alpha channel is below this value, defaults 0 (all data visible)
     * @returns the VertexData of the Ground designed from a heightmap
     */
    VertexData.CreateGroundFromHeightMap = function (options) {
        throw _DevTools.WarnImport("groundBuilder");
    };
    /**
     * Creates the VertexData for a Plane
     * @param options an object used to set the following optional parameters for the plane, required but can be empty
      * * size sets the width and height of the plane to the value of size, optional default 1
      * * width sets the width (x direction) of the plane, overwrites the width set by size, optional, default size
      * * height sets the height (y direction) of the plane, overwrites the height set by size, optional, default size
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
      * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @returns the VertexData of the box
     */
    VertexData.CreatePlane = function (options) {
        throw _DevTools.WarnImport("planeBuilder");
    };
    /**
     * Creates the VertexData of the Disc or regular Polygon
     * @param options an object used to set the following optional parameters for the disc, required but can be empty
      * * radius the radius of the disc, optional default 0.5
      * * tessellation the number of polygon sides, optional, default 64
      * * arc a number from 0 to 1, to create an unclosed polygon based on the fraction of the circumference given by the arc value, optional, default 1
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
      * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @returns the VertexData of the box
     */
    VertexData.CreateDisc = function (options) {
        throw _DevTools.WarnImport("discBuilder");
    };
    /**
     * Creates the VertexData for an irregular Polygon in the XoZ plane using a mesh built by polygonTriangulation.build()
     * All parameters are provided by MeshBuilder.CreatePolygon as needed
     * @param polygon a mesh built from polygonTriangulation.build()
     * @param sideOrientation takes the values Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
     * @param fUV an array of Vector4 elements used to set different images to the top, rings and bottom respectively
     * @param fColors an array of Color3 elements used to set different colors to the top, rings and bottom respectively
     * @param frontUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
     * @param backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @param wrap a boolean, default false, when true and fUVs used texture is wrapped around all sides, when false texture is applied side
     * @returns the VertexData of the Polygon
     */
    VertexData.CreatePolygon = function (polygon, sideOrientation, fUV, fColors, frontUVs, backUVs, wrap) {
        throw _DevTools.WarnImport("polygonBuilder");
    };
    /**
     * Creates the VertexData of the IcoSphere
     * @param options an object used to set the following optional parameters for the IcoSphere, required but can be empty
      * * radius the radius of the IcoSphere, optional default 1
      * * radiusX allows stretching in the x direction, optional, default radius
      * * radiusY allows stretching in the y direction, optional, default radius
      * * radiusZ allows stretching in the z direction, optional, default radius
      * * flat when true creates a flat shaded mesh, optional, default true
      * * subdivisions increasing the subdivisions increases the number of faces, optional, default 4
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
      * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @returns the VertexData of the IcoSphere
     */
    VertexData.CreateIcoSphere = function (options) {
        throw _DevTools.WarnImport("icoSphereBuilder");
    };
    // inspired from // http://stemkoski.github.io/Three.js/Polyhedra.html
    /**
     * Creates the VertexData for a Polyhedron
     * @param options an object used to set the following optional parameters for the polyhedron, required but can be empty
     * * type provided types are:
     *  * 0 : Tetrahedron, 1 : Octahedron, 2 : Dodecahedron, 3 : Icosahedron, 4 : Rhombicuboctahedron, 5 : Triangular Prism, 6 : Pentagonal Prism, 7 : Hexagonal Prism, 8 : Square Pyramid (J1)
     *  * 9 : Pentagonal Pyramid (J2), 10 : Triangular Dipyramid (J12), 11 : Pentagonal Dipyramid (J13), 12 : Elongated Square Dipyramid (J15), 13 : Elongated Pentagonal Dipyramid (J16), 14 : Elongated Pentagonal Cupola (J20)
     * * size the size of the IcoSphere, optional default 1
     * * sizeX allows stretching in the x direction, optional, default size
     * * sizeY allows stretching in the y direction, optional, default size
     * * sizeZ allows stretching in the z direction, optional, default size
     * * custom a number that overwrites the type to create from an extended set of polyhedron from https://www.babylonjs-playground.com/#21QRSK#15 with minimised editor
     * * faceUV an array of Vector4 elements used to set different images to the top, rings and bottom respectively
     * * faceColors an array of Color3 elements used to set different colors to the top, rings and bottom respectively
     * * flat when true creates a flat shaded mesh, optional, default true
     * * subdivisions increasing the subdivisions increases the number of faces, optional, default 4
     * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
     * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
     * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @returns the VertexData of the Polyhedron
     */
    VertexData.CreatePolyhedron = function (options) {
        throw _DevTools.WarnImport("polyhedronBuilder");
    };
    //
    /**
     * Creates the VertexData for a Capsule, inspired from https://github.com/maximeq/three-js-capsule-geometry/blob/master/src/CapsuleBufferGeometry.js
     * @param options an object used to set the following optional parameters for the capsule, required but can be empty
     * @returns the VertexData of the Capsule
     */
    VertexData.CreateCapsule = function (options) {
        if (options === void 0) { options = {
            orientation: Vector3.Up(),
            subdivisions: 2,
            tessellation: 16,
            height: 1,
            radius: 0.25,
            capSubdivisions: 6
        }; }
        throw _DevTools.WarnImport("capsuleBuilder");
    };
    // based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3D/src/away3d/primitives/TorusKnot.as?spec=svn2473&r=2473
    /**
     * Creates the VertexData for a TorusKnot
     * @param options an object used to set the following optional parameters for the TorusKnot, required but can be empty
      * * radius the radius of the torus knot, optional, default 2
      * * tube the thickness of the tube, optional, default 0.5
      * * radialSegments the number of sides on each tube segments, optional, default 32
      * * tubularSegments the number of tubes to decompose the knot into, optional, default 32
      * * p the number of windings around the z axis, optional,  default 2
      * * q the number of windings around the x axis, optional,  default 3
      * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
      * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
      * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @returns the VertexData of the Torus Knot
     */
    VertexData.CreateTorusKnot = function (options) {
        throw _DevTools.WarnImport("torusKnotBuilder");
    };
    // Tools
    /**
     * Compute normals for given positions and indices
     * @param positions an array of vertex positions, [...., x, y, z, ......]
     * @param indices an array of indices in groups of three for each triangular facet, [...., i, j, k, ......]
     * @param normals an array of vertex normals, [...., x, y, z, ......]
     * @param options an object used to set the following optional parameters for the TorusKnot, optional
      * * facetNormals : optional array of facet normals (vector3)
      * * facetPositions : optional array of facet positions (vector3)
      * * facetPartitioning : optional partitioning array. facetPositions is required for facetPartitioning computation
      * * ratio : optional partitioning ratio / bounding box, required for facetPartitioning computation
      * * bInfo : optional bounding info, required for facetPartitioning computation
      * * bbSize : optional bounding box size data, required for facetPartitioning computation
      * * subDiv : optional partitioning data about subdivsions on  each axis (int), required for facetPartitioning computation
      * * useRightHandedSystem: optional boolean to for right handed system computation
      * * depthSort : optional boolean to enable the facet depth sort computation
      * * distanceTo : optional Vector3 to compute the facet depth from this location
      * * depthSortedFacets : optional array of depthSortedFacets to store the facet distances from the reference location
     */
    VertexData.ComputeNormals = function (positions, indices, normals, options) {
        // temporary scalar variables
        var index = 0; // facet index
        var p1p2x = 0.0; // p1p2 vector x coordinate
        var p1p2y = 0.0; // p1p2 vector y coordinate
        var p1p2z = 0.0; // p1p2 vector z coordinate
        var p3p2x = 0.0; // p3p2 vector x coordinate
        var p3p2y = 0.0; // p3p2 vector y coordinate
        var p3p2z = 0.0; // p3p2 vector z coordinate
        var faceNormalx = 0.0; // facet normal x coordinate
        var faceNormaly = 0.0; // facet normal y coordinate
        var faceNormalz = 0.0; // facet normal z coordinate
        var length = 0.0; // facet normal length before normalization
        var v1x = 0; // vector1 x index in the positions array
        var v1y = 0; // vector1 y index in the positions array
        var v1z = 0; // vector1 z index in the positions array
        var v2x = 0; // vector2 x index in the positions array
        var v2y = 0; // vector2 y index in the positions array
        var v2z = 0; // vector2 z index in the positions array
        var v3x = 0; // vector3 x index in the positions array
        var v3y = 0; // vector3 y index in the positions array
        var v3z = 0; // vector3 z index in the positions array
        var computeFacetNormals = false;
        var computeFacetPositions = false;
        var computeFacetPartitioning = false;
        var computeDepthSort = false;
        var faceNormalSign = 1;
        var ratio = 0;
        var distanceTo = null;
        if (options) {
            computeFacetNormals = (options.facetNormals) ? true : false;
            computeFacetPositions = (options.facetPositions) ? true : false;
            computeFacetPartitioning = (options.facetPartitioning) ? true : false;
            faceNormalSign = (options.useRightHandedSystem === true) ? -1 : 1;
            ratio = options.ratio || 0;
            computeDepthSort = (options.depthSort) ? true : false;
            distanceTo = (options.distanceTo);
            if (computeDepthSort) {
                if (distanceTo === undefined) {
                    distanceTo = Vector3.Zero();
                }
                var depthSortedFacets = options.depthSortedFacets;
            }
        }
        // facetPartitioning reinit if needed
        var xSubRatio = 0;
        var ySubRatio = 0;
        var zSubRatio = 0;
        var subSq = 0;
        if (computeFacetPartitioning && options && options.bbSize) {
            var ox = 0; // X partitioning index for facet position
            var oy = 0; // Y partinioning index for facet position
            var oz = 0; // Z partinioning index for facet position
            var b1x = 0; // X partitioning index for facet v1 vertex
            var b1y = 0; // Y partitioning index for facet v1 vertex
            var b1z = 0; // z partitioning index for facet v1 vertex
            var b2x = 0; // X partitioning index for facet v2 vertex
            var b2y = 0; // Y partitioning index for facet v2 vertex
            var b2z = 0; // Z partitioning index for facet v2 vertex
            var b3x = 0; // X partitioning index for facet v3 vertex
            var b3y = 0; // Y partitioning index for facet v3 vertex
            var b3z = 0; // Z partitioning index for facet v3 vertex
            var block_idx_o = 0; // facet barycenter block index
            var block_idx_v1 = 0; // v1 vertex block index
            var block_idx_v2 = 0; // v2 vertex block index
            var block_idx_v3 = 0; // v3 vertex block index
            var bbSizeMax = (options.bbSize.x > options.bbSize.y) ? options.bbSize.x : options.bbSize.y;
            bbSizeMax = (bbSizeMax > options.bbSize.z) ? bbSizeMax : options.bbSize.z;
            xSubRatio = options.subDiv.X * ratio / options.bbSize.x;
            ySubRatio = options.subDiv.Y * ratio / options.bbSize.y;
            zSubRatio = options.subDiv.Z * ratio / options.bbSize.z;
            subSq = options.subDiv.max * options.subDiv.max;
            options.facetPartitioning.length = 0;
        }
        // reset the normals
        for (index = 0; index < positions.length; index++) {
            normals[index] = 0.0;
        }
        // Loop : 1 indice triplet = 1 facet
        var nbFaces = (indices.length / 3) | 0;
        for (index = 0; index < nbFaces; index++) {
            // get the indexes of the coordinates of each vertex of the facet
            v1x = indices[index * 3] * 3;
            v1y = v1x + 1;
            v1z = v1x + 2;
            v2x = indices[index * 3 + 1] * 3;
            v2y = v2x + 1;
            v2z = v2x + 2;
            v3x = indices[index * 3 + 2] * 3;
            v3y = v3x + 1;
            v3z = v3x + 2;
            p1p2x = positions[v1x] - positions[v2x]; // compute two vectors per facet : p1p2 and p3p2
            p1p2y = positions[v1y] - positions[v2y];
            p1p2z = positions[v1z] - positions[v2z];
            p3p2x = positions[v3x] - positions[v2x];
            p3p2y = positions[v3y] - positions[v2y];
            p3p2z = positions[v3z] - positions[v2z];
            // compute the face normal with the cross product
            faceNormalx = faceNormalSign * (p1p2y * p3p2z - p1p2z * p3p2y);
            faceNormaly = faceNormalSign * (p1p2z * p3p2x - p1p2x * p3p2z);
            faceNormalz = faceNormalSign * (p1p2x * p3p2y - p1p2y * p3p2x);
            // normalize this normal and store it in the array facetData
            length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
            length = (length === 0) ? 1.0 : length;
            faceNormalx /= length;
            faceNormaly /= length;
            faceNormalz /= length;
            if (computeFacetNormals && options) {
                options.facetNormals[index].x = faceNormalx;
                options.facetNormals[index].y = faceNormaly;
                options.facetNormals[index].z = faceNormalz;
            }
            if (computeFacetPositions && options) {
                // compute and the facet barycenter coordinates in the array facetPositions
                options.facetPositions[index].x = (positions[v1x] + positions[v2x] + positions[v3x]) / 3.0;
                options.facetPositions[index].y = (positions[v1y] + positions[v2y] + positions[v3y]) / 3.0;
                options.facetPositions[index].z = (positions[v1z] + positions[v2z] + positions[v3z]) / 3.0;
            }
            if (computeFacetPartitioning && options) {
                // store the facet indexes in arrays in the main facetPartitioning array :
                // compute each facet vertex (+ facet barycenter) index in the partiniong array
                ox = Math.floor((options.facetPositions[index].x - options.bInfo.minimum.x * ratio) * xSubRatio);
                oy = Math.floor((options.facetPositions[index].y - options.bInfo.minimum.y * ratio) * ySubRatio);
                oz = Math.floor((options.facetPositions[index].z - options.bInfo.minimum.z * ratio) * zSubRatio);
                b1x = Math.floor((positions[v1x] - options.bInfo.minimum.x * ratio) * xSubRatio);
                b1y = Math.floor((positions[v1y] - options.bInfo.minimum.y * ratio) * ySubRatio);
                b1z = Math.floor((positions[v1z] - options.bInfo.minimum.z * ratio) * zSubRatio);
                b2x = Math.floor((positions[v2x] - options.bInfo.minimum.x * ratio) * xSubRatio);
                b2y = Math.floor((positions[v2y] - options.bInfo.minimum.y * ratio) * ySubRatio);
                b2z = Math.floor((positions[v2z] - options.bInfo.minimum.z * ratio) * zSubRatio);
                b3x = Math.floor((positions[v3x] - options.bInfo.minimum.x * ratio) * xSubRatio);
                b3y = Math.floor((positions[v3y] - options.bInfo.minimum.y * ratio) * ySubRatio);
                b3z = Math.floor((positions[v3z] - options.bInfo.minimum.z * ratio) * zSubRatio);
                block_idx_v1 = b1x + options.subDiv.max * b1y + subSq * b1z;
                block_idx_v2 = b2x + options.subDiv.max * b2y + subSq * b2z;
                block_idx_v3 = b3x + options.subDiv.max * b3y + subSq * b3z;
                block_idx_o = ox + options.subDiv.max * oy + subSq * oz;
                options.facetPartitioning[block_idx_o] = options.facetPartitioning[block_idx_o] ? options.facetPartitioning[block_idx_o] : new Array();
                options.facetPartitioning[block_idx_v1] = options.facetPartitioning[block_idx_v1] ? options.facetPartitioning[block_idx_v1] : new Array();
                options.facetPartitioning[block_idx_v2] = options.facetPartitioning[block_idx_v2] ? options.facetPartitioning[block_idx_v2] : new Array();
                options.facetPartitioning[block_idx_v3] = options.facetPartitioning[block_idx_v3] ? options.facetPartitioning[block_idx_v3] : new Array();
                // push each facet index in each block containing the vertex
                options.facetPartitioning[block_idx_v1].push(index);
                if (block_idx_v2 != block_idx_v1) {
                    options.facetPartitioning[block_idx_v2].push(index);
                }
                if (!(block_idx_v3 == block_idx_v2 || block_idx_v3 == block_idx_v1)) {
                    options.facetPartitioning[block_idx_v3].push(index);
                }
                if (!(block_idx_o == block_idx_v1 || block_idx_o == block_idx_v2 || block_idx_o == block_idx_v3)) {
                    options.facetPartitioning[block_idx_o].push(index);
                }
            }
            if (computeDepthSort && options && options.facetPositions) {
                var dsf = depthSortedFacets[index];
                dsf.ind = index * 3;
                dsf.sqDistance = Vector3.DistanceSquared(options.facetPositions[index], distanceTo);
            }
            // compute the normals anyway
            normals[v1x] += faceNormalx; // accumulate all the normals per face
            normals[v1y] += faceNormaly;
            normals[v1z] += faceNormalz;
            normals[v2x] += faceNormalx;
            normals[v2y] += faceNormaly;
            normals[v2z] += faceNormalz;
            normals[v3x] += faceNormalx;
            normals[v3y] += faceNormaly;
            normals[v3z] += faceNormalz;
        }
        // last normalization of each normal
        for (index = 0; index < normals.length / 3; index++) {
            faceNormalx = normals[index * 3];
            faceNormaly = normals[index * 3 + 1];
            faceNormalz = normals[index * 3 + 2];
            length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
            length = (length === 0) ? 1.0 : length;
            faceNormalx /= length;
            faceNormaly /= length;
            faceNormalz /= length;
            normals[index * 3] = faceNormalx;
            normals[index * 3 + 1] = faceNormaly;
            normals[index * 3 + 2] = faceNormalz;
        }
    };
    /** @hidden */
    VertexData._ComputeSides = function (sideOrientation, positions, indices, normals, uvs, frontUVs, backUVs) {
        var li = indices.length;
        var ln = normals.length;
        var i;
        var n;
        sideOrientation = sideOrientation || VertexData.DEFAULTSIDE;
        switch (sideOrientation) {
            case VertexData.FRONTSIDE:
                // nothing changed
                break;
            case VertexData.BACKSIDE:
                var tmp;
                // indices
                for (i = 0; i < li; i += 3) {
                    tmp = indices[i];
                    indices[i] = indices[i + 2];
                    indices[i + 2] = tmp;
                }
                // normals
                for (n = 0; n < ln; n++) {
                    normals[n] = -normals[n];
                }
                break;
            case VertexData.DOUBLESIDE:
                // positions
                var lp = positions.length;
                var l = lp / 3;
                for (var p = 0; p < lp; p++) {
                    positions[lp + p] = positions[p];
                }
                // indices
                for (i = 0; i < li; i += 3) {
                    indices[i + li] = indices[i + 2] + l;
                    indices[i + 1 + li] = indices[i + 1] + l;
                    indices[i + 2 + li] = indices[i] + l;
                }
                // normals
                for (n = 0; n < ln; n++) {
                    normals[ln + n] = -normals[n];
                }
                // uvs
                var lu = uvs.length;
                var u = 0;
                for (u = 0; u < lu; u++) {
                    uvs[u + lu] = uvs[u];
                }
                frontUVs = frontUVs ? frontUVs : new Vector4(0.0, 0.0, 1.0, 1.0);
                backUVs = backUVs ? backUVs : new Vector4(0.0, 0.0, 1.0, 1.0);
                u = 0;
                for (i = 0; i < lu / 2; i++) {
                    uvs[u] = frontUVs.x + (frontUVs.z - frontUVs.x) * uvs[u];
                    uvs[u + 1] = frontUVs.y + (frontUVs.w - frontUVs.y) * uvs[u + 1];
                    uvs[u + lu] = backUVs.x + (backUVs.z - backUVs.x) * uvs[u + lu];
                    uvs[u + lu + 1] = backUVs.y + (backUVs.w - backUVs.y) * uvs[u + lu + 1];
                    u += 2;
                }
                break;
        }
    };
    /**
     * Applies VertexData created from the imported parameters to the geometry
     * @param parsedVertexData the parsed data from an imported file
     * @param geometry the geometry to apply the VertexData to
     */
    VertexData.ImportVertexData = function (parsedVertexData, geometry) {
        var vertexData = new VertexData();
        // positions
        var positions = parsedVertexData.positions;
        if (positions) {
            vertexData.set(positions, VertexBuffer.PositionKind);
        }
        // normals
        var normals = parsedVertexData.normals;
        if (normals) {
            vertexData.set(normals, VertexBuffer.NormalKind);
        }
        // tangents
        var tangents = parsedVertexData.tangents;
        if (tangents) {
            vertexData.set(tangents, VertexBuffer.TangentKind);
        }
        // uvs
        var uvs = parsedVertexData.uvs;
        if (uvs) {
            vertexData.set(uvs, VertexBuffer.UVKind);
        }
        // uv2s
        var uv2s = parsedVertexData.uv2s;
        if (uv2s) {
            vertexData.set(uv2s, VertexBuffer.UV2Kind);
        }
        // uv3s
        var uv3s = parsedVertexData.uv3s;
        if (uv3s) {
            vertexData.set(uv3s, VertexBuffer.UV3Kind);
        }
        // uv4s
        var uv4s = parsedVertexData.uv4s;
        if (uv4s) {
            vertexData.set(uv4s, VertexBuffer.UV4Kind);
        }
        // uv5s
        var uv5s = parsedVertexData.uv5s;
        if (uv5s) {
            vertexData.set(uv5s, VertexBuffer.UV5Kind);
        }
        // uv6s
        var uv6s = parsedVertexData.uv6s;
        if (uv6s) {
            vertexData.set(uv6s, VertexBuffer.UV6Kind);
        }
        // colors
        var colors = parsedVertexData.colors;
        if (colors) {
            vertexData.set(Color4.CheckColors4(colors, positions.length / 3), VertexBuffer.ColorKind);
        }
        // matricesIndices
        var matricesIndices = parsedVertexData.matricesIndices;
        if (matricesIndices) {
            vertexData.set(matricesIndices, VertexBuffer.MatricesIndicesKind);
        }
        // matricesWeights
        var matricesWeights = parsedVertexData.matricesWeights;
        if (matricesWeights) {
            vertexData.set(matricesWeights, VertexBuffer.MatricesWeightsKind);
        }
        // indices
        var indices = parsedVertexData.indices;
        if (indices) {
            vertexData.indices = indices;
        }
        geometry.setAllVerticesData(vertexData, parsedVertexData.updatable);
    };
    /**
     * Mesh side orientation : usually the external or front surface
     */
    VertexData.FRONTSIDE = 0;
    /**
     * Mesh side orientation : usually the internal or back surface
     */
    VertexData.BACKSIDE = 1;
    /**
     * Mesh side orientation : both internal and external or front and back surfaces
     */
    VertexData.DOUBLESIDE = 2;
    /**
     * Mesh side orientation : by default, `FRONTSIDE`
     */
    VertexData.DEFAULTSIDE = 0;
    return VertexData;
}());

/**
     * Information about the result of picking within a scene
     * @see https://doc.babylonjs.com/babylon101/picking_collisions
     */
var PickingInfo = /** @class */ (function () {
    function PickingInfo() {
        /** @hidden */
        this._pickingUnavailable = false;
        /**
         * If the pick collided with an object
         */
        this.hit = false;
        /**
         * Distance away where the pick collided
         */
        this.distance = 0;
        /**
         * The location of pick collision
         */
        this.pickedPoint = null;
        /**
         * The mesh corresponding the the pick collision
         */
        this.pickedMesh = null;
        /** (See getTextureCoordinates) The barycentric U coordinate that is used when calculating the texture coordinates of the collision.*/
        this.bu = 0;
        /** (See getTextureCoordinates) The barycentric V coordinate that is used when calculating the texture coordinates of the collision.*/
        this.bv = 0;
        /** The index of the face on the mesh that was picked, or the index of the Line if the picked Mesh is a LinesMesh */
        this.faceId = -1;
        /** The index of the face on the subMesh that was picked, or the index of the Line if the picked Mesh is a LinesMesh */
        this.subMeshFaceId = -1;
        /** Id of the the submesh that was picked */
        this.subMeshId = 0;
        /** If a sprite was picked, this will be the sprite the pick collided with */
        this.pickedSprite = null;
        /** If we are pikcing a mesh with thin instance, this will give you the picked thin instance */
        this.thinInstanceIndex = -1;
        /**
         * If a mesh was used to do the picking (eg. 6dof controller) this will be populated.
         */
        this.originMesh = null;
        /**
         * The ray that was used to perform the picking.
         */
        this.ray = null;
    }
    /**
     * Gets the normal correspodning to the face the pick collided with
     * @param useWorldCoordinates If the resulting normal should be relative to the world (default: false)
     * @param useVerticesNormals If the vertices normals should be used to calculate the normal instead of the normal map
     * @returns The normal correspodning to the face the pick collided with
     */
    PickingInfo.prototype.getNormal = function (useWorldCoordinates, useVerticesNormals) {
        if (useWorldCoordinates === void 0) { useWorldCoordinates = false; }
        if (useVerticesNormals === void 0) { useVerticesNormals = true; }
        if (!this.pickedMesh || !this.pickedMesh.isVerticesDataPresent(VertexBuffer.NormalKind)) {
            return null;
        }
        var indices = this.pickedMesh.getIndices();
        if (!indices) {
            return null;
        }
        var result;
        if (useVerticesNormals) {
            var normals = this.pickedMesh.getVerticesData(VertexBuffer.NormalKind);
            var normal0 = Vector3.FromArray(normals, indices[this.faceId * 3] * 3);
            var normal1 = Vector3.FromArray(normals, indices[this.faceId * 3 + 1] * 3);
            var normal2 = Vector3.FromArray(normals, indices[this.faceId * 3 + 2] * 3);
            normal0 = normal0.scale(this.bu);
            normal1 = normal1.scale(this.bv);
            normal2 = normal2.scale(1.0 - this.bu - this.bv);
            result = new Vector3(normal0.x + normal1.x + normal2.x, normal0.y + normal1.y + normal2.y, normal0.z + normal1.z + normal2.z);
        }
        else {
            var positions = this.pickedMesh.getVerticesData(VertexBuffer.PositionKind);
            var vertex1 = Vector3.FromArray(positions, indices[this.faceId * 3] * 3);
            var vertex2 = Vector3.FromArray(positions, indices[this.faceId * 3 + 1] * 3);
            var vertex3 = Vector3.FromArray(positions, indices[this.faceId * 3 + 2] * 3);
            var p1p2 = vertex1.subtract(vertex2);
            var p3p2 = vertex3.subtract(vertex2);
            result = Vector3.Cross(p1p2, p3p2);
        }
        if (useWorldCoordinates) {
            var wm = this.pickedMesh.getWorldMatrix();
            if (this.pickedMesh.nonUniformScaling) {
                TmpVectors.Matrix[0].copyFrom(wm);
                wm = TmpVectors.Matrix[0];
                wm.setTranslationFromFloats(0, 0, 0);
                wm.invert();
                wm.transposeToRef(TmpVectors.Matrix[1]);
                wm = TmpVectors.Matrix[1];
            }
            result = Vector3.TransformNormal(result, wm);
        }
        result.normalize();
        return result;
    };
    /**
     * Gets the texture coordinates of where the pick occured
     * @returns the vector containing the coordnates of the texture
     */
    PickingInfo.prototype.getTextureCoordinates = function () {
        if (!this.pickedMesh || !this.pickedMesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
            return null;
        }
        var indices = this.pickedMesh.getIndices();
        if (!indices) {
            return null;
        }
        var uvs = this.pickedMesh.getVerticesData(VertexBuffer.UVKind);
        if (!uvs) {
            return null;
        }
        var uv0 = Vector2.FromArray(uvs, indices[this.faceId * 3] * 2);
        var uv1 = Vector2.FromArray(uvs, indices[this.faceId * 3 + 1] * 2);
        var uv2 = Vector2.FromArray(uvs, indices[this.faceId * 3 + 2] * 2);
        uv0 = uv0.scale(this.bu);
        uv1 = uv1.scale(this.bv);
        uv2 = uv2.scale(1.0 - this.bu - this.bv);
        return new Vector2(uv0.x + uv1.x + uv2.x, uv0.y + uv1.y + uv2.y);
    };
    return PickingInfo;
}());

/**
 * Class used to store bounding box information
 */
var BoundingBox = /** @class */ (function () {
    /**
     * Creates a new bounding box
     * @param min defines the minimum vector (in local space)
     * @param max defines the maximum vector (in local space)
     * @param worldMatrix defines the new world matrix
     */
    function BoundingBox(min, max, worldMatrix) {
        /**
         * Gets the 8 vectors representing the bounding box in local space
         */
        this.vectors = ArrayTools.BuildArray(8, Vector3.Zero);
        /**
         * Gets the center of the bounding box in local space
         */
        this.center = Vector3.Zero();
        /**
         * Gets the center of the bounding box in world space
         */
        this.centerWorld = Vector3.Zero();
        /**
         * Gets the extend size in local space
         */
        this.extendSize = Vector3.Zero();
        /**
         * Gets the extend size in world space
         */
        this.extendSizeWorld = Vector3.Zero();
        /**
         * Gets the OBB (object bounding box) directions
         */
        this.directions = ArrayTools.BuildArray(3, Vector3.Zero);
        /**
         * Gets the 8 vectors representing the bounding box in world space
         */
        this.vectorsWorld = ArrayTools.BuildArray(8, Vector3.Zero);
        /**
         * Gets the minimum vector in world space
         */
        this.minimumWorld = Vector3.Zero();
        /**
         * Gets the maximum vector in world space
         */
        this.maximumWorld = Vector3.Zero();
        /**
         * Gets the minimum vector in local space
         */
        this.minimum = Vector3.Zero();
        /**
         * Gets the maximum vector in local space
         */
        this.maximum = Vector3.Zero();
        this.reConstruct(min, max, worldMatrix);
    }
    // Methods
    /**
     * Recreates the entire bounding box from scratch as if we call the constructor in place
     * @param min defines the new minimum vector (in local space)
     * @param max defines the new maximum vector (in local space)
     * @param worldMatrix defines the new world matrix
     */
    BoundingBox.prototype.reConstruct = function (min, max, worldMatrix) {
        var minX = min.x, minY = min.y, minZ = min.z, maxX = max.x, maxY = max.y, maxZ = max.z;
        var vectors = this.vectors;
        this.minimum.copyFromFloats(minX, minY, minZ);
        this.maximum.copyFromFloats(maxX, maxY, maxZ);
        vectors[0].copyFromFloats(minX, minY, minZ);
        vectors[1].copyFromFloats(maxX, maxY, maxZ);
        vectors[2].copyFromFloats(maxX, minY, minZ);
        vectors[3].copyFromFloats(minX, maxY, minZ);
        vectors[4].copyFromFloats(minX, minY, maxZ);
        vectors[5].copyFromFloats(maxX, maxY, minZ);
        vectors[6].copyFromFloats(minX, maxY, maxZ);
        vectors[7].copyFromFloats(maxX, minY, maxZ);
        // OBB
        max.addToRef(min, this.center).scaleInPlace(0.5);
        max.subtractToRef(min, this.extendSize).scaleInPlace(0.5);
        this._worldMatrix = worldMatrix || Matrix.IdentityReadOnly;
        this._update(this._worldMatrix);
    };
    /**
     * Scale the current bounding box by applying a scale factor
     * @param factor defines the scale factor to apply
     * @returns the current bounding box
     */
    BoundingBox.prototype.scale = function (factor) {
        var tmpVectors = BoundingBox.TmpVector3;
        var diff = this.maximum.subtractToRef(this.minimum, tmpVectors[0]);
        var len = diff.length();
        diff.normalizeFromLength(len);
        var distance = len * factor;
        var newRadius = diff.scaleInPlace(distance * 0.5);
        var min = this.center.subtractToRef(newRadius, tmpVectors[1]);
        var max = this.center.addToRef(newRadius, tmpVectors[2]);
        this.reConstruct(min, max, this._worldMatrix);
        return this;
    };
    /**
     * Gets the world matrix of the bounding box
     * @returns a matrix
     */
    BoundingBox.prototype.getWorldMatrix = function () {
        return this._worldMatrix;
    };
    /** @hidden */
    BoundingBox.prototype._update = function (world) {
        var minWorld = this.minimumWorld;
        var maxWorld = this.maximumWorld;
        var directions = this.directions;
        var vectorsWorld = this.vectorsWorld;
        var vectors = this.vectors;
        if (!world.isIdentity()) {
            minWorld.setAll(Number.MAX_VALUE);
            maxWorld.setAll(-Number.MAX_VALUE);
            for (var index = 0; index < 8; ++index) {
                var v = vectorsWorld[index];
                Vector3.TransformCoordinatesToRef(vectors[index], world, v);
                minWorld.minimizeInPlace(v);
                maxWorld.maximizeInPlace(v);
            }
            // Extend
            maxWorld.subtractToRef(minWorld, this.extendSizeWorld).scaleInPlace(0.5);
            maxWorld.addToRef(minWorld, this.centerWorld).scaleInPlace(0.5);
        }
        else {
            minWorld.copyFrom(this.minimum);
            maxWorld.copyFrom(this.maximum);
            for (var index = 0; index < 8; ++index) {
                vectorsWorld[index].copyFrom(vectors[index]);
            }
            // Extend
            this.extendSizeWorld.copyFrom(this.extendSize);
            this.centerWorld.copyFrom(this.center);
        }
        Vector3.FromArrayToRef(world.m, 0, directions[0]);
        Vector3.FromArrayToRef(world.m, 4, directions[1]);
        Vector3.FromArrayToRef(world.m, 8, directions[2]);
        this._worldMatrix = world;
    };
    /**
     * Tests if the bounding box is intersecting the frustum planes
     * @param frustumPlanes defines the frustum planes to test
     * @returns true if there is an intersection
     */
    BoundingBox.prototype.isInFrustum = function (frustumPlanes) {
        return BoundingBox.IsInFrustum(this.vectorsWorld, frustumPlanes);
    };
    /**
     * Tests if the bounding box is entirely inside the frustum planes
     * @param frustumPlanes defines the frustum planes to test
     * @returns true if there is an inclusion
     */
    BoundingBox.prototype.isCompletelyInFrustum = function (frustumPlanes) {
        return BoundingBox.IsCompletelyInFrustum(this.vectorsWorld, frustumPlanes);
    };
    /**
     * Tests if a point is inside the bounding box
     * @param point defines the point to test
     * @returns true if the point is inside the bounding box
     */
    BoundingBox.prototype.intersectsPoint = function (point) {
        var min = this.minimumWorld;
        var max = this.maximumWorld;
        var minX = min.x, minY = min.y, minZ = min.z, maxX = max.x, maxY = max.y, maxZ = max.z;
        var pointX = point.x, pointY = point.y, pointZ = point.z;
        var delta = -Epsilon;
        if (maxX - pointX < delta || delta > pointX - minX) {
            return false;
        }
        if (maxY - pointY < delta || delta > pointY - minY) {
            return false;
        }
        if (maxZ - pointZ < delta || delta > pointZ - minZ) {
            return false;
        }
        return true;
    };
    /**
     * Tests if the bounding box intersects with a bounding sphere
     * @param sphere defines the sphere to test
     * @returns true if there is an intersection
     */
    BoundingBox.prototype.intersectsSphere = function (sphere) {
        return BoundingBox.IntersectsSphere(this.minimumWorld, this.maximumWorld, sphere.centerWorld, sphere.radiusWorld);
    };
    /**
     * Tests if the bounding box intersects with a box defined by a min and max vectors
     * @param min defines the min vector to use
     * @param max defines the max vector to use
     * @returns true if there is an intersection
     */
    BoundingBox.prototype.intersectsMinMax = function (min, max) {
        var myMin = this.minimumWorld;
        var myMax = this.maximumWorld;
        var myMinX = myMin.x, myMinY = myMin.y, myMinZ = myMin.z, myMaxX = myMax.x, myMaxY = myMax.y, myMaxZ = myMax.z;
        var minX = min.x, minY = min.y, minZ = min.z, maxX = max.x, maxY = max.y, maxZ = max.z;
        if (myMaxX < minX || myMinX > maxX) {
            return false;
        }
        if (myMaxY < minY || myMinY > maxY) {
            return false;
        }
        if (myMaxZ < minZ || myMinZ > maxZ) {
            return false;
        }
        return true;
    };
    // Statics
    /**
     * Tests if two bounding boxes are intersections
     * @param box0 defines the first box to test
     * @param box1 defines the second box to test
     * @returns true if there is an intersection
     */
    BoundingBox.Intersects = function (box0, box1) {
        return box0.intersectsMinMax(box1.minimumWorld, box1.maximumWorld);
    };
    /**
     * Tests if a bounding box defines by a min/max vectors intersects a sphere
     * @param minPoint defines the minimum vector of the bounding box
     * @param maxPoint defines the maximum vector of the bounding box
     * @param sphereCenter defines the sphere center
     * @param sphereRadius defines the sphere radius
     * @returns true if there is an intersection
     */
    BoundingBox.IntersectsSphere = function (minPoint, maxPoint, sphereCenter, sphereRadius) {
        var vector = BoundingBox.TmpVector3[0];
        Vector3.ClampToRef(sphereCenter, minPoint, maxPoint, vector);
        var num = Vector3.DistanceSquared(sphereCenter, vector);
        return (num <= (sphereRadius * sphereRadius));
    };
    /**
     * Tests if a bounding box defined with 8 vectors is entirely inside frustum planes
     * @param boundingVectors defines an array of 8 vectors representing a bounding box
     * @param frustumPlanes defines the frustum planes to test
     * @return true if there is an inclusion
     */
    BoundingBox.IsCompletelyInFrustum = function (boundingVectors, frustumPlanes) {
        for (var p = 0; p < 6; ++p) {
            var frustumPlane = frustumPlanes[p];
            for (var i = 0; i < 8; ++i) {
                if (frustumPlane.dotCoordinate(boundingVectors[i]) < 0) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * Tests if a bounding box defined with 8 vectors intersects frustum planes
     * @param boundingVectors defines an array of 8 vectors representing a bounding box
     * @param frustumPlanes defines the frustum planes to test
     * @return true if there is an intersection
     */
    BoundingBox.IsInFrustum = function (boundingVectors, frustumPlanes) {
        for (var p = 0; p < 6; ++p) {
            var canReturnFalse = true;
            var frustumPlane = frustumPlanes[p];
            for (var i = 0; i < 8; ++i) {
                if (frustumPlane.dotCoordinate(boundingVectors[i]) >= 0) {
                    canReturnFalse = false;
                    break;
                }
            }
            if (canReturnFalse) {
                return false;
            }
        }
        return true;
    };
    BoundingBox.TmpVector3 = ArrayTools.BuildArray(3, Vector3.Zero);
    return BoundingBox;
}());

/**
 * Class used to store bounding sphere information
 */
var BoundingSphere = /** @class */ (function () {
    /**
     * Creates a new bounding sphere
     * @param min defines the minimum vector (in local space)
     * @param max defines the maximum vector (in local space)
     * @param worldMatrix defines the new world matrix
     */
    function BoundingSphere(min, max, worldMatrix) {
        /**
         * Gets the center of the bounding sphere in local space
         */
        this.center = Vector3.Zero();
        /**
         * Gets the center of the bounding sphere in world space
         */
        this.centerWorld = Vector3.Zero();
        /**
         * Gets the minimum vector in local space
         */
        this.minimum = Vector3.Zero();
        /**
         * Gets the maximum vector in local space
         */
        this.maximum = Vector3.Zero();
        this.reConstruct(min, max, worldMatrix);
    }
    /**
     * Recreates the entire bounding sphere from scratch as if we call the constructor in place
     * @param min defines the new minimum vector (in local space)
     * @param max defines the new maximum vector (in local space)
     * @param worldMatrix defines the new world matrix
     */
    BoundingSphere.prototype.reConstruct = function (min, max, worldMatrix) {
        this.minimum.copyFrom(min);
        this.maximum.copyFrom(max);
        var distance = Vector3.Distance(min, max);
        max.addToRef(min, this.center).scaleInPlace(0.5);
        this.radius = distance * 0.5;
        this._update(worldMatrix || Matrix.IdentityReadOnly);
    };
    /**
     * Scale the current bounding sphere by applying a scale factor
     * @param factor defines the scale factor to apply
     * @returns the current bounding box
     */
    BoundingSphere.prototype.scale = function (factor) {
        var newRadius = this.radius * factor;
        var tmpVectors = BoundingSphere.TmpVector3;
        var tempRadiusVector = tmpVectors[0].setAll(newRadius);
        var min = this.center.subtractToRef(tempRadiusVector, tmpVectors[1]);
        var max = this.center.addToRef(tempRadiusVector, tmpVectors[2]);
        this.reConstruct(min, max, this._worldMatrix);
        return this;
    };
    /**
     * Gets the world matrix of the bounding box
     * @returns a matrix
     */
    BoundingSphere.prototype.getWorldMatrix = function () {
        return this._worldMatrix;
    };
    // Methods
    /** @hidden */
    BoundingSphere.prototype._update = function (worldMatrix) {
        if (!worldMatrix.isIdentity()) {
            Vector3.TransformCoordinatesToRef(this.center, worldMatrix, this.centerWorld);
            var tempVector = BoundingSphere.TmpVector3[0];
            Vector3.TransformNormalFromFloatsToRef(1.0, 1.0, 1.0, worldMatrix, tempVector);
            this.radiusWorld = Math.max(Math.abs(tempVector.x), Math.abs(tempVector.y), Math.abs(tempVector.z)) * this.radius;
        }
        else {
            this.centerWorld.copyFrom(this.center);
            this.radiusWorld = this.radius;
        }
    };
    /**
     * Tests if the bounding sphere is intersecting the frustum planes
     * @param frustumPlanes defines the frustum planes to test
     * @returns true if there is an intersection
     */
    BoundingSphere.prototype.isInFrustum = function (frustumPlanes) {
        var center = this.centerWorld;
        var radius = this.radiusWorld;
        for (var i = 0; i < 6; i++) {
            if (frustumPlanes[i].dotCoordinate(center) <= -radius) {
                return false;
            }
        }
        return true;
    };
    /**
     * Tests if the bounding sphere center is in between the frustum planes.
     * Used for optimistic fast inclusion.
     * @param frustumPlanes defines the frustum planes to test
     * @returns true if the sphere center is in between the frustum planes
     */
    BoundingSphere.prototype.isCenterInFrustum = function (frustumPlanes) {
        var center = this.centerWorld;
        for (var i = 0; i < 6; i++) {
            if (frustumPlanes[i].dotCoordinate(center) < 0) {
                return false;
            }
        }
        return true;
    };
    /**
     * Tests if a point is inside the bounding sphere
     * @param point defines the point to test
     * @returns true if the point is inside the bounding sphere
     */
    BoundingSphere.prototype.intersectsPoint = function (point) {
        var squareDistance = Vector3.DistanceSquared(this.centerWorld, point);
        if (this.radiusWorld * this.radiusWorld < squareDistance) {
            return false;
        }
        return true;
    };
    // Statics
    /**
     * Checks if two sphere intersct
     * @param sphere0 sphere 0
     * @param sphere1 sphere 1
     * @returns true if the speres intersect
     */
    BoundingSphere.Intersects = function (sphere0, sphere1) {
        var squareDistance = Vector3.DistanceSquared(sphere0.centerWorld, sphere1.centerWorld);
        var radiusSum = sphere0.radiusWorld + sphere1.radiusWorld;
        if (radiusSum * radiusSum < squareDistance) {
            return false;
        }
        return true;
    };
    BoundingSphere.TmpVector3 = ArrayTools.BuildArray(3, Vector3.Zero);
    return BoundingSphere;
}());

var _result0 = { min: 0, max: 0 };
var _result1 = { min: 0, max: 0 };
var computeBoxExtents = function (axis, box, result) {
    var p = Vector3.Dot(box.centerWorld, axis);
    var r0 = Math.abs(Vector3.Dot(box.directions[0], axis)) * box.extendSize.x;
    var r1 = Math.abs(Vector3.Dot(box.directions[1], axis)) * box.extendSize.y;
    var r2 = Math.abs(Vector3.Dot(box.directions[2], axis)) * box.extendSize.z;
    var r = r0 + r1 + r2;
    result.min = p - r;
    result.max = p + r;
};
var axisOverlap = function (axis, box0, box1) {
    computeBoxExtents(axis, box0, _result0);
    computeBoxExtents(axis, box1, _result1);
    return !(_result0.min > _result1.max || _result1.min > _result0.max);
};
/**
 * Info for a bounding data of a mesh
 */
var BoundingInfo = /** @class */ (function () {
    /**
     * Constructs bounding info
     * @param minimum min vector of the bounding box/sphere
     * @param maximum max vector of the bounding box/sphere
     * @param worldMatrix defines the new world matrix
     */
    function BoundingInfo(minimum, maximum, worldMatrix) {
        this._isLocked = false;
        this.boundingBox = new BoundingBox(minimum, maximum, worldMatrix);
        this.boundingSphere = new BoundingSphere(minimum, maximum, worldMatrix);
    }
    /**
     * Recreates the entire bounding info from scratch as if we call the constructor in place
     * @param min defines the new minimum vector (in local space)
     * @param max defines the new maximum vector (in local space)
     * @param worldMatrix defines the new world matrix
     */
    BoundingInfo.prototype.reConstruct = function (min, max, worldMatrix) {
        this.boundingBox.reConstruct(min, max, worldMatrix);
        this.boundingSphere.reConstruct(min, max, worldMatrix);
    };
    Object.defineProperty(BoundingInfo.prototype, "minimum", {
        /**
         * min vector of the bounding box/sphere
         */
        get: function () {
            return this.boundingBox.minimum;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoundingInfo.prototype, "maximum", {
        /**
         * max vector of the bounding box/sphere
         */
        get: function () {
            return this.boundingBox.maximum;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoundingInfo.prototype, "isLocked", {
        /**
         * If the info is locked and won't be updated to avoid perf overhead
         */
        get: function () {
            return this._isLocked;
        },
        set: function (value) {
            this._isLocked = value;
        },
        enumerable: false,
        configurable: true
    });
    // Methods
    /**
     * Updates the bounding sphere and box
     * @param world world matrix to be used to update
     */
    BoundingInfo.prototype.update = function (world) {
        if (this._isLocked) {
            return;
        }
        this.boundingBox._update(world);
        this.boundingSphere._update(world);
    };
    /**
     * Recreate the bounding info to be centered around a specific point given a specific extend.
     * @param center New center of the bounding info
     * @param extend New extend of the bounding info
     * @returns the current bounding info
     */
    BoundingInfo.prototype.centerOn = function (center, extend) {
        var minimum = BoundingInfo.TmpVector3[0].copyFrom(center).subtractInPlace(extend);
        var maximum = BoundingInfo.TmpVector3[1].copyFrom(center).addInPlace(extend);
        this.boundingBox.reConstruct(minimum, maximum, this.boundingBox.getWorldMatrix());
        this.boundingSphere.reConstruct(minimum, maximum, this.boundingBox.getWorldMatrix());
        return this;
    };
    /**
     * Scale the current bounding info by applying a scale factor
     * @param factor defines the scale factor to apply
     * @returns the current bounding info
     */
    BoundingInfo.prototype.scale = function (factor) {
        this.boundingBox.scale(factor);
        this.boundingSphere.scale(factor);
        return this;
    };
    /**
     * Returns `true` if the bounding info is within the frustum defined by the passed array of planes.
     * @param frustumPlanes defines the frustum to test
     * @param strategy defines the strategy to use for the culling (default is BABYLON.AbstractMesh.CULLINGSTRATEGY_STANDARD)
     * @returns true if the bounding info is in the frustum planes
     */
    BoundingInfo.prototype.isInFrustum = function (frustumPlanes, strategy) {
        if (strategy === void 0) { strategy = 0; }
        var inclusionTest = (strategy === 2 || strategy === 3);
        if (inclusionTest) {
            if (this.boundingSphere.isCenterInFrustum(frustumPlanes)) {
                return true;
            }
        }
        if (!this.boundingSphere.isInFrustum(frustumPlanes)) {
            return false;
        }
        var bSphereOnlyTest = (strategy === 1 || strategy === 3);
        if (bSphereOnlyTest) {
            return true;
        }
        return this.boundingBox.isInFrustum(frustumPlanes);
    };
    Object.defineProperty(BoundingInfo.prototype, "diagonalLength", {
        /**
         * Gets the world distance between the min and max points of the bounding box
         */
        get: function () {
            var boundingBox = this.boundingBox;
            var diag = boundingBox.maximumWorld.subtractToRef(boundingBox.minimumWorld, BoundingInfo.TmpVector3[0]);
            return diag.length();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Checks if a cullable object (mesh...) is in the camera frustum
     * Unlike isInFrustum this cheks the full bounding box
     * @param frustumPlanes Camera near/planes
     * @returns true if the object is in frustum otherwise false
     */
    BoundingInfo.prototype.isCompletelyInFrustum = function (frustumPlanes) {
        return this.boundingBox.isCompletelyInFrustum(frustumPlanes);
    };
    /** @hidden */
    BoundingInfo.prototype._checkCollision = function (collider) {
        return collider._canDoCollision(this.boundingSphere.centerWorld, this.boundingSphere.radiusWorld, this.boundingBox.minimumWorld, this.boundingBox.maximumWorld);
    };
    /**
     * Checks if a point is inside the bounding box and bounding sphere or the mesh
     * @see https://doc.babylonjs.com/babylon101/intersect_collisions_-_mesh
     * @param point the point to check intersection with
     * @returns if the point intersects
     */
    BoundingInfo.prototype.intersectsPoint = function (point) {
        if (!this.boundingSphere.centerWorld) {
            return false;
        }
        if (!this.boundingSphere.intersectsPoint(point)) {
            return false;
        }
        if (!this.boundingBox.intersectsPoint(point)) {
            return false;
        }
        return true;
    };
    /**
     * Checks if another bounding info intersects the bounding box and bounding sphere or the mesh
     * @see https://doc.babylonjs.com/babylon101/intersect_collisions_-_mesh
     * @param boundingInfo the bounding info to check intersection with
     * @param precise if the intersection should be done using OBB
     * @returns if the bounding info intersects
     */
    BoundingInfo.prototype.intersects = function (boundingInfo, precise) {
        if (!BoundingSphere.Intersects(this.boundingSphere, boundingInfo.boundingSphere)) {
            return false;
        }
        if (!BoundingBox.Intersects(this.boundingBox, boundingInfo.boundingBox)) {
            return false;
        }
        if (!precise) {
            return true;
        }
        var box0 = this.boundingBox;
        var box1 = boundingInfo.boundingBox;
        if (!axisOverlap(box0.directions[0], box0, box1)) {
            return false;
        }
        if (!axisOverlap(box0.directions[1], box0, box1)) {
            return false;
        }
        if (!axisOverlap(box0.directions[2], box0, box1)) {
            return false;
        }
        if (!axisOverlap(box1.directions[0], box0, box1)) {
            return false;
        }
        if (!axisOverlap(box1.directions[1], box0, box1)) {
            return false;
        }
        if (!axisOverlap(box1.directions[2], box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[0], box1.directions[0]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[0], box1.directions[1]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[0], box1.directions[2]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[1], box1.directions[0]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[1], box1.directions[1]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[1], box1.directions[2]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[2], box1.directions[0]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[2], box1.directions[1]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[2], box1.directions[2]), box0, box1)) {
            return false;
        }
        return true;
    };
    BoundingInfo.TmpVector3 = ArrayTools.BuildArray(2, Vector3.Zero);
    return BoundingInfo;
}());

/**
 * @hidden
 */
var _MeshCollisionData = /** @class */ (function () {
    function _MeshCollisionData() {
        this._checkCollisions = false;
        this._collisionMask = -1;
        this._collisionGroup = -1;
        this._surroundingMeshes = null;
        this._collider = null;
        this._oldPositionForCollisions = new Vector3(0, 0, 0);
        this._diffPositionForCollisions = new Vector3(0, 0, 0);
        this._collisionResponse = true;
    }
    return _MeshCollisionData;
}());

/**
 * Extracts minimum and maximum values from a list of indexed positions
 * @param positions defines the positions to use
 * @param indices defines the indices to the positions
 * @param indexStart defines the start index
 * @param indexCount defines the end index
 * @param bias defines bias value to add to the result
 * @return minimum and maximum values
 */
function extractMinAndMaxIndexed(positions, indices, indexStart, indexCount, bias) {
    if (bias === void 0) { bias = null; }
    var minimum = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    var maximum = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    for (var index = indexStart; index < indexStart + indexCount; index++) {
        var offset = indices[index] * 3;
        var x = positions[offset];
        var y = positions[offset + 1];
        var z = positions[offset + 2];
        minimum.minimizeInPlaceFromFloats(x, y, z);
        maximum.maximizeInPlaceFromFloats(x, y, z);
    }
    if (bias) {
        minimum.x -= minimum.x * bias.x + bias.y;
        minimum.y -= minimum.y * bias.x + bias.y;
        minimum.z -= minimum.z * bias.x + bias.y;
        maximum.x += maximum.x * bias.x + bias.y;
        maximum.y += maximum.y * bias.x + bias.y;
        maximum.z += maximum.z * bias.x + bias.y;
    }
    return {
        minimum: minimum,
        maximum: maximum
    };
}
/**
 * Extracts minimum and maximum values from a list of positions
 * @param positions defines the positions to use
 * @param start defines the start index in the positions array
 * @param count defines the number of positions to handle
 * @param bias defines bias value to add to the result
 * @param stride defines the stride size to use (distance between two positions in the positions array)
 * @return minimum and maximum values
 */
function extractMinAndMax(positions, start, count, bias, stride) {
    if (bias === void 0) { bias = null; }
    var minimum = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    var maximum = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    if (!stride) {
        stride = 3;
    }
    for (var index = start, offset = start * stride; index < start + count; index++, offset += stride) {
        var x = positions[offset];
        var y = positions[offset + 1];
        var z = positions[offset + 2];
        minimum.minimizeInPlaceFromFloats(x, y, z);
        maximum.maximizeInPlaceFromFloats(x, y, z);
    }
    if (bias) {
        minimum.x -= minimum.x * bias.x + bias.y;
        minimum.y -= minimum.y * bias.x + bias.y;
        minimum.z -= minimum.z * bias.x + bias.y;
        maximum.x += maximum.x * bias.x + bias.y;
        maximum.y += maximum.y * bias.x + bias.y;
        maximum.z += maximum.z * bias.x + bias.y;
    }
    return {
        minimum: minimum,
        maximum: maximum
    };
}

/** @hidden */
var _FacetDataStorage = /** @class */ (function () {
    function _FacetDataStorage() {
        this.facetNb = 0; // facet number
        this.partitioningSubdivisions = 10; // number of subdivisions per axis in the partioning space
        this.partitioningBBoxRatio = 1.01; // the partioning array space is by default 1% bigger than the bounding box
        this.facetDataEnabled = false; // is the facet data feature enabled on this mesh ?
        this.facetParameters = {}; // keep a reference to the object parameters to avoid memory re-allocation
        this.bbSize = Vector3.Zero(); // bbox size approximated for facet data
        this.subDiv = {
            max: 1,
            X: 1,
            Y: 1,
            Z: 1
        };
        this.facetDepthSort = false; // is the facet depth sort to be computed
        this.facetDepthSortEnabled = false; // is the facet depth sort initialized
    }
    return _FacetDataStorage;
}());
/**
 * @hidden
 **/
var _InternalAbstractMeshDataInfo = /** @class */ (function () {
    function _InternalAbstractMeshDataInfo() {
        this._hasVertexAlpha = false;
        this._useVertexColors = true;
        this._numBoneInfluencers = 4;
        this._applyFog = true;
        this._receiveShadows = false;
        this._facetData = new _FacetDataStorage();
        this._visibility = 1.0;
        this._skeleton = null;
        this._layerMask = 0x0FFFFFFF;
        this._computeBonesUsingShaders = true;
        this._isActive = false;
        this._onlyForInstances = false;
        this._isActiveIntermediate = false;
        this._onlyForInstancesIntermediate = false;
        this._actAsRegularMesh = false;
        this._currentLOD = null;
        this._currentLODIsUpToDate = false;
    }
    return _InternalAbstractMeshDataInfo;
}());
/**
 * Class used to store all common mesh properties
 */
var AbstractMesh = /** @class */ (function (_super) {
    __extends(AbstractMesh, _super);
    // Constructor
    /**
     * Creates a new AbstractMesh
     * @param name defines the name of the mesh
     * @param scene defines the hosting scene
     */
    function AbstractMesh(name, scene) {
        if (scene === void 0) { scene = null; }
        var _this = _super.call(this, name, scene, false) || this;
        // Internal data
        /** @hidden */
        _this._internalAbstractMeshDataInfo = new _InternalAbstractMeshDataInfo();
        /**
         * The culling strategy to use to check whether the mesh must be rendered or not.
         * This value can be changed at any time and will be used on the next render mesh selection.
         * The possible values are :
         * - AbstractMesh.CULLINGSTRATEGY_STANDARD
         * - AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
         * - AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION
         * - AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY
         * Please read each static variable documentation to get details about the culling process.
         * */
        _this.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
        // Events
        /**
        * An event triggered when this mesh collides with another one
        */
        _this.onCollideObservable = new Observable();
        /**
        * An event triggered when the collision's position changes
        */
        _this.onCollisionPositionChangeObservable = new Observable();
        /**
        * An event triggered when material is changed
        */
        _this.onMaterialChangedObservable = new Observable();
        // Properties
        /**
         * Gets or sets the orientation for POV movement & rotation
         */
        _this.definedFacingForward = true;
        /** @hidden */
        _this._occlusionQuery = null;
        /** @hidden */
        _this._renderingGroup = null;
        /** Gets or sets the alpha index used to sort transparent meshes
         * @see https://doc.babylonjs.com/resources/transparency_and_how_meshes_are_rendered#alpha-index
         */
        _this.alphaIndex = Number.MAX_VALUE;
        /**
         * Gets or sets a boolean indicating if the mesh is visible (renderable). Default is true
         */
        _this.isVisible = true;
        /**
         * Gets or sets a boolean indicating if the mesh can be picked (by scene.pick for instance or through actions). Default is true
         */
        _this.isPickable = true;
        /** Gets or sets a boolean indicating that bounding boxes of subMeshes must be rendered as well (false by default) */
        _this.showSubMeshesBoundingBox = false;
        /** Gets or sets a boolean indicating if the mesh must be considered as a ray blocker for lens flares (false by default)
         * @see https://doc.babylonjs.com/how_to/how_to_use_lens_flares
         */
        _this.isBlocker = false;
        /**
         * Gets or sets a boolean indicating that pointer move events must be supported on this mesh (false by default)
         */
        _this.enablePointerMoveEvents = false;
        _this._renderingGroupId = 0;
        _this._material = null;
        /** Defines color to use when rendering outline */
        _this.outlineColor = Color3.Red();
        /** Define width to use when rendering outline */
        _this.outlineWidth = 0.02;
        /** Defines color to use when rendering overlay */
        _this.overlayColor = Color3.Red();
        /** Defines alpha to use when rendering overlay */
        _this.overlayAlpha = 0.5;
        /** Gets or sets a boolean indicating that internal octree (if available) can be used to boost submeshes selection (true by default) */
        _this.useOctreeForRenderingSelection = true;
        /** Gets or sets a boolean indicating that internal octree (if available) can be used to boost submeshes picking (true by default) */
        _this.useOctreeForPicking = true;
        /** Gets or sets a boolean indicating that internal octree (if available) can be used to boost submeshes collision (true by default) */
        _this.useOctreeForCollisions = true;
        /**
         * True if the mesh must be rendered in any case (this will shortcut the frustum clipping phase)
         */
        _this.alwaysSelectAsActiveMesh = false;
        /**
         * Gets or sets a boolean indicating that the bounding info does not need to be kept in sync (for performance reason)
         */
        _this.doNotSyncBoundingInfo = false;
        /**
         * Gets or sets the current action manager
         * @see https://doc.babylonjs.com/how_to/how_to_use_actions
         */
        _this.actionManager = null;
        // Collisions
        _this._meshCollisionData = new _MeshCollisionData();
        /**
         * Gets or sets the ellipsoid used to impersonate this mesh when using collision engine (default is (0.5, 1, 0.5))
         * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
         */
        _this.ellipsoid = new Vector3(0.5, 1, 0.5);
        /**
         * Gets or sets the ellipsoid offset used to impersonate this mesh when using collision engine (default is (0, 0, 0))
         * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
         */
        _this.ellipsoidOffset = new Vector3(0, 0, 0);
        // Edges
        /**
         * Defines edge width used when edgesRenderer is enabled
         * @see https://www.babylonjs-playground.com/#10OJSG#13
         */
        _this.edgesWidth = 1;
        /**
         * Defines edge color used when edgesRenderer is enabled
         * @see https://www.babylonjs-playground.com/#10OJSG#13
         */
        _this.edgesColor = new Color4(1, 0, 0, 1);
        /** @hidden */
        _this._edgesRenderer = null;
        /** @hidden */
        _this._masterMesh = null;
        /** @hidden */
        _this._boundingInfo = null;
        /** @hidden */
        _this._renderId = 0;
        /** @hidden */
        _this._intersectionsInProgress = new Array();
        /** @hidden */
        _this._unIndexed = false;
        /** @hidden */
        _this._lightSources = new Array();
        // Loading properties
        /** @hidden */
        _this._waitingData = {
            lods: null,
            actions: null,
            freezeWorldMatrix: null
        };
        /** @hidden */
        _this._bonesTransformMatrices = null;
        /** @hidden */
        _this._transformMatrixTexture = null;
        /**
         * An event triggered when the mesh is rebuilt.
         */
        _this.onRebuildObservable = new Observable();
        _this._onCollisionPositionChange = function (collisionId, newPosition, collidedMesh) {
            if (collidedMesh === void 0) { collidedMesh = null; }
            newPosition.subtractToRef(_this._meshCollisionData._oldPositionForCollisions, _this._meshCollisionData._diffPositionForCollisions);
            if (_this._meshCollisionData._diffPositionForCollisions.length() > Engine.CollisionsEpsilon) {
                _this.position.addInPlace(_this._meshCollisionData._diffPositionForCollisions);
            }
            if (collidedMesh) {
                _this.onCollideObservable.notifyObservers(collidedMesh);
            }
            _this.onCollisionPositionChangeObservable.notifyObservers(_this.position);
        };
        _this.getScene().addMesh(_this);
        _this._resyncLightSources();
        return _this;
    }
    Object.defineProperty(AbstractMesh, "BILLBOARDMODE_NONE", {
        /**
         * No billboard
         */
        get: function () {
            return TransformNode.BILLBOARDMODE_NONE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh, "BILLBOARDMODE_X", {
        /** Billboard on X axis */
        get: function () {
            return TransformNode.BILLBOARDMODE_X;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh, "BILLBOARDMODE_Y", {
        /** Billboard on Y axis */
        get: function () {
            return TransformNode.BILLBOARDMODE_Y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh, "BILLBOARDMODE_Z", {
        /** Billboard on Z axis */
        get: function () {
            return TransformNode.BILLBOARDMODE_Z;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh, "BILLBOARDMODE_ALL", {
        /** Billboard on all axes */
        get: function () {
            return TransformNode.BILLBOARDMODE_ALL;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh, "BILLBOARDMODE_USE_POSITION", {
        /** Billboard on using position instead of orientation */
        get: function () {
            return TransformNode.BILLBOARDMODE_USE_POSITION;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "facetNb", {
        /**
         * Gets the number of facets in the mesh
         * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata#what-is-a-mesh-facet
         */
        get: function () {
            return this._internalAbstractMeshDataInfo._facetData.facetNb;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "partitioningSubdivisions", {
        /**
         * Gets or set the number (integer) of subdivisions per axis in the partioning space
         * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata#tweaking-the-partitioning
         */
        get: function () {
            return this._internalAbstractMeshDataInfo._facetData.partitioningSubdivisions;
        },
        set: function (nb) {
            this._internalAbstractMeshDataInfo._facetData.partitioningSubdivisions = nb;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "partitioningBBoxRatio", {
        /**
         * The ratio (float) to apply to the bouding box size to set to the partioning space.
         * Ex : 1.01 (default) the partioning space is 1% bigger than the bounding box
         * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata#tweaking-the-partitioning
         */
        get: function () {
            return this._internalAbstractMeshDataInfo._facetData.partitioningBBoxRatio;
        },
        set: function (ratio) {
            this._internalAbstractMeshDataInfo._facetData.partitioningBBoxRatio = ratio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "mustDepthSortFacets", {
        /**
         * Gets or sets a boolean indicating that the facets must be depth sorted on next call to `updateFacetData()`.
         * Works only for updatable meshes.
         * Doesn't work with multi-materials
         * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata#facet-depth-sort
         */
        get: function () {
            return this._internalAbstractMeshDataInfo._facetData.facetDepthSort;
        },
        set: function (sort) {
            this._internalAbstractMeshDataInfo._facetData.facetDepthSort = sort;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "facetDepthSortFrom", {
        /**
         * The location (Vector3) where the facet depth sort must be computed from.
         * By default, the active camera position.
         * Used only when facet depth sort is enabled
         * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata#facet-depth-sort
         */
        get: function () {
            return this._internalAbstractMeshDataInfo._facetData.facetDepthSortFrom;
        },
        set: function (location) {
            this._internalAbstractMeshDataInfo._facetData.facetDepthSortFrom = location;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "isFacetDataEnabled", {
        /**
         * gets a boolean indicating if facetData is enabled
         * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata#what-is-a-mesh-facet
         */
        get: function () {
            return this._internalAbstractMeshDataInfo._facetData.facetDataEnabled;
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    AbstractMesh.prototype._updateNonUniformScalingState = function (value) {
        if (!_super.prototype._updateNonUniformScalingState.call(this, value)) {
            return false;
        }
        this._markSubMeshesAsMiscDirty();
        return true;
    };
    Object.defineProperty(AbstractMesh.prototype, "onCollide", {
        /** Set a function to call when this mesh collides with another one */
        set: function (callback) {
            if (this._meshCollisionData._onCollideObserver) {
                this.onCollideObservable.remove(this._meshCollisionData._onCollideObserver);
            }
            this._meshCollisionData._onCollideObserver = this.onCollideObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "onCollisionPositionChange", {
        /** Set a function to call when the collision's position changes */
        set: function (callback) {
            if (this._meshCollisionData._onCollisionPositionChangeObserver) {
                this.onCollisionPositionChangeObservable.remove(this._meshCollisionData._onCollisionPositionChangeObserver);
            }
            this._meshCollisionData._onCollisionPositionChangeObserver = this.onCollisionPositionChangeObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "visibility", {
        /**
         * Gets or sets mesh visibility between 0 and 1 (default is 1)
         */
        get: function () {
            return this._internalAbstractMeshDataInfo._visibility;
        },
        /**
         * Gets or sets mesh visibility between 0 and 1 (default is 1)
         */
        set: function (value) {
            if (this._internalAbstractMeshDataInfo._visibility === value) {
                return;
            }
            this._internalAbstractMeshDataInfo._visibility = value;
            this._markSubMeshesAsMiscDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "renderingGroupId", {
        /**
         * Specifies the rendering group id for this mesh (0 by default)
         * @see https://doc.babylonjs.com/resources/transparency_and_how_meshes_are_rendered#rendering-groups
         */
        get: function () {
            return this._renderingGroupId;
        },
        set: function (value) {
            this._renderingGroupId = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "material", {
        /** Gets or sets current material */
        get: function () {
            return this._material;
        },
        set: function (value) {
            if (this._material === value) {
                return;
            }
            // remove from material mesh map id needed
            if (this._material && this._material.meshMap) {
                this._material.meshMap[this.uniqueId] = undefined;
            }
            this._material = value;
            if (value && value.meshMap) {
                value.meshMap[this.uniqueId] = this;
            }
            if (this.onMaterialChangedObservable.hasObservers()) {
                this.onMaterialChangedObservable.notifyObservers(this);
            }
            if (!this.subMeshes) {
                return;
            }
            this._unBindEffect();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "receiveShadows", {
        /**
         * Gets or sets a boolean indicating that this mesh can receive realtime shadows
         * @see https://doc.babylonjs.com/babylon101/shadows
         */
        get: function () {
            return this._internalAbstractMeshDataInfo._receiveShadows;
        },
        set: function (value) {
            if (this._internalAbstractMeshDataInfo._receiveShadows === value) {
                return;
            }
            this._internalAbstractMeshDataInfo._receiveShadows = value;
            this._markSubMeshesAsLightDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "hasVertexAlpha", {
        /** Gets or sets a boolean indicating that this mesh contains vertex color data with alpha values */
        get: function () {
            return this._internalAbstractMeshDataInfo._hasVertexAlpha;
        },
        set: function (value) {
            if (this._internalAbstractMeshDataInfo._hasVertexAlpha === value) {
                return;
            }
            this._internalAbstractMeshDataInfo._hasVertexAlpha = value;
            this._markSubMeshesAsAttributesDirty();
            this._markSubMeshesAsMiscDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "useVertexColors", {
        /** Gets or sets a boolean indicating that this mesh needs to use vertex color data to render (if this kind of vertex data is available in the geometry) */
        get: function () {
            return this._internalAbstractMeshDataInfo._useVertexColors;
        },
        set: function (value) {
            if (this._internalAbstractMeshDataInfo._useVertexColors === value) {
                return;
            }
            this._internalAbstractMeshDataInfo._useVertexColors = value;
            this._markSubMeshesAsAttributesDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "computeBonesUsingShaders", {
        /**
         * Gets or sets a boolean indicating that bone animations must be computed by the CPU (false by default)
         */
        get: function () {
            return this._internalAbstractMeshDataInfo._computeBonesUsingShaders;
        },
        set: function (value) {
            if (this._internalAbstractMeshDataInfo._computeBonesUsingShaders === value) {
                return;
            }
            this._internalAbstractMeshDataInfo._computeBonesUsingShaders = value;
            this._markSubMeshesAsAttributesDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "numBoneInfluencers", {
        /** Gets or sets the number of allowed bone influences per vertex (4 by default) */
        get: function () {
            return this._internalAbstractMeshDataInfo._numBoneInfluencers;
        },
        set: function (value) {
            if (this._internalAbstractMeshDataInfo._numBoneInfluencers === value) {
                return;
            }
            this._internalAbstractMeshDataInfo._numBoneInfluencers = value;
            this._markSubMeshesAsAttributesDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "applyFog", {
        /** Gets or sets a boolean indicating that this mesh will allow fog to be rendered on it (true by default) */
        get: function () {
            return this._internalAbstractMeshDataInfo._applyFog;
        },
        set: function (value) {
            if (this._internalAbstractMeshDataInfo._applyFog === value) {
                return;
            }
            this._internalAbstractMeshDataInfo._applyFog = value;
            this._markSubMeshesAsMiscDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "layerMask", {
        /**
         * Gets or sets the current layer mask (default is 0x0FFFFFFF)
         * @see https://doc.babylonjs.com/how_to/layermasks_and_multi-cam_textures
         */
        get: function () {
            return this._internalAbstractMeshDataInfo._layerMask;
        },
        set: function (value) {
            if (value === this._internalAbstractMeshDataInfo._layerMask) {
                return;
            }
            this._internalAbstractMeshDataInfo._layerMask = value;
            this._resyncLightSources();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "collisionMask", {
        /**
         * Gets or sets a collision mask used to mask collisions (default is -1).
         * A collision between A and B will happen if A.collisionGroup & b.collisionMask !== 0
         */
        get: function () {
            return this._meshCollisionData._collisionMask;
        },
        set: function (mask) {
            this._meshCollisionData._collisionMask = !isNaN(mask) ? mask : -1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "collisionResponse", {
        /**
         * Gets or sets a collision response flag (default is true).
         * when collisionResponse is false, events are still triggered but colliding entity has no response
         * This helps creating trigger volume when user wants collision feedback events but not position/velocity
         * to respond to the collision.
         */
        get: function () {
            return this._meshCollisionData._collisionResponse;
        },
        set: function (response) {
            this._meshCollisionData._collisionResponse = response;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "collisionGroup", {
        /**
         * Gets or sets the current collision group mask (-1 by default).
         * A collision between A and B will happen if A.collisionGroup & b.collisionMask !== 0
         */
        get: function () {
            return this._meshCollisionData._collisionGroup;
        },
        set: function (mask) {
            this._meshCollisionData._collisionGroup = !isNaN(mask) ? mask : -1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "surroundingMeshes", {
        /**
         * Gets or sets current surrounding meshes (null by default).
         *
         * By default collision detection is tested against every mesh in the scene.
         * It is possible to set surroundingMeshes to a defined list of meshes and then only these specified
         * meshes will be tested for the collision.
         *
         * Note: if set to an empty array no collision will happen when this mesh is moved.
         */
        get: function () {
            return this._meshCollisionData._surroundingMeshes;
        },
        set: function (meshes) {
            this._meshCollisionData._surroundingMeshes = meshes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "lightSources", {
        /** Gets the list of lights affecting that mesh */
        get: function () {
            return this._lightSources;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "_positions", {
        /** @hidden */
        get: function () {
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "skeleton", {
        get: function () {
            return this._internalAbstractMeshDataInfo._skeleton;
        },
        /**
         * Gets or sets a skeleton to apply skining transformations
         * @see https://doc.babylonjs.com/how_to/how_to_use_bones_and_skeletons
         */
        set: function (value) {
            var skeleton = this._internalAbstractMeshDataInfo._skeleton;
            if (skeleton && skeleton.needInitialSkinMatrix) {
                skeleton._unregisterMeshWithPoseMatrix(this);
            }
            if (value && value.needInitialSkinMatrix) {
                value._registerMeshWithPoseMatrix(this);
            }
            this._internalAbstractMeshDataInfo._skeleton = value;
            if (!this._internalAbstractMeshDataInfo._skeleton) {
                this._bonesTransformMatrices = null;
            }
            this._markSubMeshesAsAttributesDirty();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the string "AbstractMesh"
     * @returns "AbstractMesh"
     */
    AbstractMesh.prototype.getClassName = function () {
        return "AbstractMesh";
    };
    /**
     * Gets a string representation of the current mesh
     * @param fullDetails defines a boolean indicating if full details must be included
     * @returns a string representation of the current mesh
     */
    AbstractMesh.prototype.toString = function (fullDetails) {
        var ret = "Name: " + this.name + ", isInstance: " + (this.getClassName() !== "InstancedMesh" ? "YES" : "NO");
        ret += ", # of submeshes: " + (this.subMeshes ? this.subMeshes.length : 0);
        var skeleton = this._internalAbstractMeshDataInfo._skeleton;
        if (skeleton) {
            ret += ", skeleton: " + skeleton.name;
        }
        if (fullDetails) {
            ret += ", billboard mode: " + (["NONE", "X", "Y", null, "Z", null, null, "ALL"])[this.billboardMode];
            ret += ", freeze wrld mat: " + (this._isWorldMatrixFrozen || this._waitingData.freezeWorldMatrix ? "YES" : "NO");
        }
        return ret;
    };
    /**
     * @hidden
     */
    AbstractMesh.prototype._getEffectiveParent = function () {
        if (this._masterMesh && this.billboardMode !== TransformNode.BILLBOARDMODE_NONE) {
            return this._masterMesh;
        }
        return _super.prototype._getEffectiveParent.call(this);
    };
    /** @hidden */
    AbstractMesh.prototype._getActionManagerForTrigger = function (trigger, initialCall) {
        if (initialCall === void 0) { initialCall = true; }
        if (this.actionManager && (initialCall || this.actionManager.isRecursive)) {
            if (trigger) {
                if (this.actionManager.hasSpecificTrigger(trigger)) {
                    return this.actionManager;
                }
            }
            else {
                return this.actionManager;
            }
        }
        if (!this.parent) {
            return null;
        }
        return this.parent._getActionManagerForTrigger(trigger, false);
    };
    /** @hidden */
    AbstractMesh.prototype._rebuild = function () {
        this.onRebuildObservable.notifyObservers(this);
        if (this._occlusionQuery) {
            this._occlusionQuery = null;
        }
        if (!this.subMeshes) {
            return;
        }
        for (var _i = 0, _a = this.subMeshes; _i < _a.length; _i++) {
            var subMesh = _a[_i];
            subMesh._rebuild();
        }
    };
    /** @hidden */
    AbstractMesh.prototype._resyncLightSources = function () {
        this._lightSources.length = 0;
        for (var _i = 0, _a = this.getScene().lights; _i < _a.length; _i++) {
            var light = _a[_i];
            if (!light.isEnabled()) {
                continue;
            }
            if (light.canAffectMesh(this)) {
                this._lightSources.push(light);
            }
        }
        this._markSubMeshesAsLightDirty();
    };
    /** @hidden */
    AbstractMesh.prototype._resyncLightSource = function (light) {
        var isIn = light.isEnabled() && light.canAffectMesh(this);
        var index = this._lightSources.indexOf(light);
        var removed = false;
        if (index === -1) {
            if (!isIn) {
                return;
            }
            this._lightSources.push(light);
        }
        else {
            if (isIn) {
                return;
            }
            removed = true;
            this._lightSources.splice(index, 1);
        }
        this._markSubMeshesAsLightDirty(removed);
    };
    /** @hidden */
    AbstractMesh.prototype._unBindEffect = function () {
        for (var _i = 0, _a = this.subMeshes; _i < _a.length; _i++) {
            var subMesh = _a[_i];
            subMesh.setEffect(null);
        }
    };
    /** @hidden */
    AbstractMesh.prototype._removeLightSource = function (light, dispose) {
        var index = this._lightSources.indexOf(light);
        if (index === -1) {
            return;
        }
        this._lightSources.splice(index, 1);
        this._markSubMeshesAsLightDirty(dispose);
    };
    AbstractMesh.prototype._markSubMeshesAsDirty = function (func) {
        if (!this.subMeshes) {
            return;
        }
        for (var _i = 0, _a = this.subMeshes; _i < _a.length; _i++) {
            var subMesh = _a[_i];
            if (subMesh._materialDefines) {
                func(subMesh._materialDefines);
            }
        }
    };
    /** @hidden */
    AbstractMesh.prototype._markSubMeshesAsLightDirty = function (dispose) {
        if (dispose === void 0) { dispose = false; }
        this._markSubMeshesAsDirty(function (defines) { return defines.markAsLightDirty(dispose); });
    };
    /** @hidden */
    AbstractMesh.prototype._markSubMeshesAsAttributesDirty = function () {
        this._markSubMeshesAsDirty(function (defines) { return defines.markAsAttributesDirty(); });
    };
    /** @hidden */
    AbstractMesh.prototype._markSubMeshesAsMiscDirty = function () {
        this._markSubMeshesAsDirty(function (defines) { return defines.markAsMiscDirty(); });
    };
    Object.defineProperty(AbstractMesh.prototype, "scaling", {
        /**
        * Gets or sets a Vector3 depicting the mesh scaling along each local axis X, Y, Z.  Default is (1.0, 1.0, 1.0)
        */
        get: function () {
            return this._scaling;
        },
        set: function (newScaling) {
            this._scaling = newScaling;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "isBlocked", {
        // Methods
        /**
         * Returns true if the mesh is blocked. Implemented by child classes
         */
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the mesh itself by default. Implemented by child classes
     * @param camera defines the camera to use to pick the right LOD level
     * @returns the currentAbstractMesh
     */
    AbstractMesh.prototype.getLOD = function (camera) {
        return this;
    };
    /**
     * Returns 0 by default. Implemented by child classes
     * @returns an integer
     */
    AbstractMesh.prototype.getTotalVertices = function () {
        return 0;
    };
    /**
     * Returns a positive integer : the total number of indices in this mesh geometry.
     * @returns the numner of indices or zero if the mesh has no geometry.
     */
    AbstractMesh.prototype.getTotalIndices = function () {
        return 0;
    };
    /**
     * Returns null by default. Implemented by child classes
     * @returns null
     */
    AbstractMesh.prototype.getIndices = function () {
        return null;
    };
    /**
     * Returns the array of the requested vertex data kind. Implemented by child classes
     * @param kind defines the vertex data kind to use
     * @returns null
     */
    AbstractMesh.prototype.getVerticesData = function (kind) {
        return null;
    };
    /**
     * Sets the vertex data of the mesh geometry for the requested `kind`.
     * If the mesh has no geometry, a new Geometry object is set to the mesh and then passed this vertex data.
     * Note that a new underlying VertexBuffer object is created each call.
     * If the `kind` is the `PositionKind`, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed.
     * @param kind defines vertex data kind:
     * * VertexBuffer.PositionKind
     * * VertexBuffer.UVKind
     * * VertexBuffer.UV2Kind
     * * VertexBuffer.UV3Kind
     * * VertexBuffer.UV4Kind
     * * VertexBuffer.UV5Kind
     * * VertexBuffer.UV6Kind
     * * VertexBuffer.ColorKind
     * * VertexBuffer.MatricesIndicesKind
     * * VertexBuffer.MatricesIndicesExtraKind
     * * VertexBuffer.MatricesWeightsKind
     * * VertexBuffer.MatricesWeightsExtraKind
     * @param data defines the data source
     * @param updatable defines if the data must be flagged as updatable (or static)
     * @param stride defines the vertex stride (size of an entire vertex). Can be null and in this case will be deduced from vertex data kind
     * @returns the current mesh
     */
    AbstractMesh.prototype.setVerticesData = function (kind, data, updatable, stride) {
        return this;
    };
    /**
     * Updates the existing vertex data of the mesh geometry for the requested `kind`.
     * If the mesh has no geometry, it is simply returned as it is.
     * @param kind defines vertex data kind:
     * * VertexBuffer.PositionKind
     * * VertexBuffer.UVKind
     * * VertexBuffer.UV2Kind
     * * VertexBuffer.UV3Kind
     * * VertexBuffer.UV4Kind
     * * VertexBuffer.UV5Kind
     * * VertexBuffer.UV6Kind
     * * VertexBuffer.ColorKind
     * * VertexBuffer.MatricesIndicesKind
     * * VertexBuffer.MatricesIndicesExtraKind
     * * VertexBuffer.MatricesWeightsKind
     * * VertexBuffer.MatricesWeightsExtraKind
     * @param data defines the data source
     * @param updateExtends If `kind` is `PositionKind` and if `updateExtends` is true, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed
     * @param makeItUnique If true, a new global geometry is created from this data and is set to the mesh
     * @returns the current mesh
     */
    AbstractMesh.prototype.updateVerticesData = function (kind, data, updateExtends, makeItUnique) {
        return this;
    };
    /**
     * Sets the mesh indices,
     * If the mesh has no geometry, a new Geometry object is created and set to the mesh.
     * @param indices Expects an array populated with integers or a typed array (Int32Array, Uint32Array, Uint16Array)
     * @param totalVertices Defines the total number of vertices
     * @returns the current mesh
     */
    AbstractMesh.prototype.setIndices = function (indices, totalVertices) {
        return this;
    };
    /**
     * Gets a boolean indicating if specific vertex data is present
     * @param kind defines the vertex data kind to use
     * @returns true is data kind is present
     */
    AbstractMesh.prototype.isVerticesDataPresent = function (kind) {
        return false;
    };
    /**
     * Returns the mesh BoundingInfo object or creates a new one and returns if it was undefined.
     * Note that it returns a shallow bounding of the mesh (i.e. it does not include children).
     * To get the full bounding of all children, call `getHierarchyBoundingVectors` instead.
     * @returns a BoundingInfo
     */
    AbstractMesh.prototype.getBoundingInfo = function () {
        if (this._masterMesh) {
            return this._masterMesh.getBoundingInfo();
        }
        if (!this._boundingInfo) {
            // this._boundingInfo is being created here
            this._updateBoundingInfo();
        }
        // cannot be null.
        return this._boundingInfo;
    };
    /**
     * Uniformly scales the mesh to fit inside of a unit cube (1 X 1 X 1 units)
     * @param includeDescendants Use the hierarchy's bounding box instead of the mesh's bounding box. Default is false
     * @param ignoreRotation ignore rotation when computing the scale (ie. object will be axis aligned). Default is false
     * @param predicate predicate that is passed in to getHierarchyBoundingVectors when selecting which object should be included when scaling
     * @returns the current mesh
     */
    AbstractMesh.prototype.normalizeToUnitCube = function (includeDescendants, ignoreRotation, predicate) {
        if (includeDescendants === void 0) { includeDescendants = true; }
        if (ignoreRotation === void 0) { ignoreRotation = false; }
        return _super.prototype.normalizeToUnitCube.call(this, includeDescendants, ignoreRotation, predicate);
    };
    /**
     * Overwrite the current bounding info
     * @param boundingInfo defines the new bounding info
     * @returns the current mesh
     */
    AbstractMesh.prototype.setBoundingInfo = function (boundingInfo) {
        this._boundingInfo = boundingInfo;
        return this;
    };
    Object.defineProperty(AbstractMesh.prototype, "useBones", {
        /** Gets a boolean indicating if this mesh has skinning data and an attached skeleton */
        get: function () {
            return (this.skeleton && this.getScene().skeletonsEnabled && this.isVerticesDataPresent(VertexBuffer.MatricesIndicesKind) && this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind));
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    AbstractMesh.prototype._preActivate = function () {
    };
    /** @hidden */
    AbstractMesh.prototype._preActivateForIntermediateRendering = function (renderId) {
    };
    /** @hidden */
    AbstractMesh.prototype._activate = function (renderId, intermediateRendering) {
        this._renderId = renderId;
        return true;
    };
    /** @hidden */
    AbstractMesh.prototype._postActivate = function () {
        // Do nothing
    };
    /** @hidden */
    AbstractMesh.prototype._freeze = function () {
        // Do nothing
    };
    /** @hidden */
    AbstractMesh.prototype._unFreeze = function () {
        // Do nothing
    };
    /**
     * Gets the current world matrix
     * @returns a Matrix
     */
    AbstractMesh.prototype.getWorldMatrix = function () {
        if (this._masterMesh && this.billboardMode === TransformNode.BILLBOARDMODE_NONE) {
            return this._masterMesh.getWorldMatrix();
        }
        return _super.prototype.getWorldMatrix.call(this);
    };
    /** @hidden */
    AbstractMesh.prototype._getWorldMatrixDeterminant = function () {
        if (this._masterMesh) {
            return this._masterMesh._getWorldMatrixDeterminant();
        }
        return _super.prototype._getWorldMatrixDeterminant.call(this);
    };
    Object.defineProperty(AbstractMesh.prototype, "isAnInstance", {
        /**
         * Gets a boolean indicating if this mesh is an instance or a regular mesh
         */
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "hasInstances", {
        /**
         * Gets a boolean indicating if this mesh has instances
         */
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "hasThinInstances", {
        /**
         * Gets a boolean indicating if this mesh has thin instances
         */
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    // ================================== Point of View Movement =================================
    /**
     * Perform relative position change from the point of view of behind the front of the mesh.
     * This is performed taking into account the meshes current rotation, so you do not have to care.
     * Supports definition of mesh facing forward or backward
     * @param amountRight defines the distance on the right axis
     * @param amountUp defines the distance on the up axis
     * @param amountForward defines the distance on the forward axis
     * @returns the current mesh
     */
    AbstractMesh.prototype.movePOV = function (amountRight, amountUp, amountForward) {
        this.position.addInPlace(this.calcMovePOV(amountRight, amountUp, amountForward));
        return this;
    };
    /**
     * Calculate relative position change from the point of view of behind the front of the mesh.
     * This is performed taking into account the meshes current rotation, so you do not have to care.
     * Supports definition of mesh facing forward or backward
     * @param amountRight defines the distance on the right axis
     * @param amountUp defines the distance on the up axis
     * @param amountForward defines the distance on the forward axis
     * @returns the new displacement vector
     */
    AbstractMesh.prototype.calcMovePOV = function (amountRight, amountUp, amountForward) {
        var rotMatrix = new Matrix();
        var rotQuaternion = (this.rotationQuaternion) ? this.rotationQuaternion : Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
        rotQuaternion.toRotationMatrix(rotMatrix);
        var translationDelta = Vector3.Zero();
        var defForwardMult = this.definedFacingForward ? -1 : 1;
        Vector3.TransformCoordinatesFromFloatsToRef(amountRight * defForwardMult, amountUp, amountForward * defForwardMult, rotMatrix, translationDelta);
        return translationDelta;
    };
    // ================================== Point of View Rotation =================================
    /**
     * Perform relative rotation change from the point of view of behind the front of the mesh.
     * Supports definition of mesh facing forward or backward
     * @param flipBack defines the flip
     * @param twirlClockwise defines the twirl
     * @param tiltRight defines the tilt
     * @returns the current mesh
     */
    AbstractMesh.prototype.rotatePOV = function (flipBack, twirlClockwise, tiltRight) {
        this.rotation.addInPlace(this.calcRotatePOV(flipBack, twirlClockwise, tiltRight));
        return this;
    };
    /**
     * Calculate relative rotation change from the point of view of behind the front of the mesh.
     * Supports definition of mesh facing forward or backward.
     * @param flipBack defines the flip
     * @param twirlClockwise defines the twirl
     * @param tiltRight defines the tilt
     * @returns the new rotation vector
     */
    AbstractMesh.prototype.calcRotatePOV = function (flipBack, twirlClockwise, tiltRight) {
        var defForwardMult = this.definedFacingForward ? 1 : -1;
        return new Vector3(flipBack * defForwardMult, twirlClockwise, tiltRight * defForwardMult);
    };
    /**
     * This method recomputes and sets a new BoundingInfo to the mesh unless it is locked.
     * This means the mesh underlying bounding box and sphere are recomputed.
     * @param applySkeleton defines whether to apply the skeleton before computing the bounding info
     * @returns the current mesh
     */
    AbstractMesh.prototype.refreshBoundingInfo = function (applySkeleton) {
        if (applySkeleton === void 0) { applySkeleton = false; }
        if (this._boundingInfo && this._boundingInfo.isLocked) {
            return this;
        }
        this._refreshBoundingInfo(this._getPositionData(applySkeleton), null);
        return this;
    };
    /** @hidden */
    AbstractMesh.prototype._refreshBoundingInfo = function (data, bias) {
        if (data) {
            var extend = extractMinAndMax(data, 0, this.getTotalVertices(), bias);
            if (this._boundingInfo) {
                this._boundingInfo.reConstruct(extend.minimum, extend.maximum);
            }
            else {
                this._boundingInfo = new BoundingInfo(extend.minimum, extend.maximum);
            }
        }
        if (this.subMeshes) {
            for (var index = 0; index < this.subMeshes.length; index++) {
                this.subMeshes[index].refreshBoundingInfo(data);
            }
        }
        this._updateBoundingInfo();
    };
    /** @hidden */
    AbstractMesh.prototype._getPositionData = function (applySkeleton) {
        var data = this.getVerticesData(VertexBuffer.PositionKind);
        if (data && applySkeleton && this.skeleton) {
            data = Tools.Slice(data);
            this._generatePointsArray();
            var matricesIndicesData = this.getVerticesData(VertexBuffer.MatricesIndicesKind);
            var matricesWeightsData = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
            if (matricesWeightsData && matricesIndicesData) {
                var needExtras = this.numBoneInfluencers > 4;
                var matricesIndicesExtraData = needExtras ? this.getVerticesData(VertexBuffer.MatricesIndicesExtraKind) : null;
                var matricesWeightsExtraData = needExtras ? this.getVerticesData(VertexBuffer.MatricesWeightsExtraKind) : null;
                this.skeleton.prepare();
                var skeletonMatrices = this.skeleton.getTransformMatrices(this);
                var tempVector = TmpVectors.Vector3[0];
                var finalMatrix = TmpVectors.Matrix[0];
                var tempMatrix = TmpVectors.Matrix[1];
                var matWeightIdx = 0;
                for (var index = 0; index < data.length; index += 3, matWeightIdx += 4) {
                    finalMatrix.reset();
                    var inf;
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
                    Vector3.TransformCoordinatesFromFloatsToRef(data[index], data[index + 1], data[index + 2], finalMatrix, tempVector);
                    tempVector.toArray(data, index);
                    if (this._positions) {
                        this._positions[index / 3].copyFrom(tempVector);
                    }
                }
            }
        }
        return data;
    };
    /** @hidden */
    AbstractMesh.prototype._updateBoundingInfo = function () {
        var effectiveMesh = this._effectiveMesh;
        if (this._boundingInfo) {
            this._boundingInfo.update(effectiveMesh.worldMatrixFromCache);
        }
        else {
            this._boundingInfo = new BoundingInfo(this.absolutePosition, this.absolutePosition, effectiveMesh.worldMatrixFromCache);
        }
        this._updateSubMeshesBoundingInfo(effectiveMesh.worldMatrixFromCache);
        return this;
    };
    /** @hidden */
    AbstractMesh.prototype._updateSubMeshesBoundingInfo = function (matrix) {
        if (!this.subMeshes) {
            return this;
        }
        var count = this.subMeshes.length;
        for (var subIndex = 0; subIndex < count; subIndex++) {
            var subMesh = this.subMeshes[subIndex];
            if (count > 1 || !subMesh.IsGlobal) {
                subMesh.updateBoundingInfo(matrix);
            }
        }
        return this;
    };
    /** @hidden */
    AbstractMesh.prototype._afterComputeWorldMatrix = function () {
        if (this.doNotSyncBoundingInfo) {
            return;
        }
        // Bounding info
        this._updateBoundingInfo();
    };
    Object.defineProperty(AbstractMesh.prototype, "_effectiveMesh", {
        /** @hidden */
        get: function () {
            return (this.skeleton && this.skeleton.overrideMesh) || this;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns `true` if the mesh is within the frustum defined by the passed array of planes.
     * A mesh is in the frustum if its bounding box intersects the frustum
     * @param frustumPlanes defines the frustum to test
     * @returns true if the mesh is in the frustum planes
     */
    AbstractMesh.prototype.isInFrustum = function (frustumPlanes) {
        return this._boundingInfo !== null && this._boundingInfo.isInFrustum(frustumPlanes, this.cullingStrategy);
    };
    /**
     * Returns `true` if the mesh is completely in the frustum defined be the passed array of planes.
     * A mesh is completely in the frustum if its bounding box it completely inside the frustum.
     * @param frustumPlanes defines the frustum to test
     * @returns true if the mesh is completely in the frustum planes
     */
    AbstractMesh.prototype.isCompletelyInFrustum = function (frustumPlanes) {
        return this._boundingInfo !== null && this._boundingInfo.isCompletelyInFrustum(frustumPlanes);
    };
    /**
     * True if the mesh intersects another mesh or a SolidParticle object
     * @param mesh defines a target mesh or SolidParticle to test
     * @param precise Unless the parameter `precise` is set to `true` the intersection is computed according to Axis Aligned Bounding Boxes (AABB), else according to OBB (Oriented BBoxes)
     * @param includeDescendants Can be set to true to test if the mesh defined in parameters intersects with the current mesh or any child meshes
     * @returns true if there is an intersection
     */
    AbstractMesh.prototype.intersectsMesh = function (mesh, precise, includeDescendants) {
        if (precise === void 0) { precise = false; }
        if (!this._boundingInfo || !mesh._boundingInfo) {
            return false;
        }
        if (this._boundingInfo.intersects(mesh._boundingInfo, precise)) {
            return true;
        }
        if (includeDescendants) {
            for (var _i = 0, _a = this.getChildMeshes(); _i < _a.length; _i++) {
                var child = _a[_i];
                if (child.intersectsMesh(mesh, precise, true)) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Returns true if the passed point (Vector3) is inside the mesh bounding box
     * @param point defines the point to test
     * @returns true if there is an intersection
     */
    AbstractMesh.prototype.intersectsPoint = function (point) {
        if (!this._boundingInfo) {
            return false;
        }
        return this._boundingInfo.intersectsPoint(point);
    };
    Object.defineProperty(AbstractMesh.prototype, "checkCollisions", {
        // Collisions
        /**
         * Gets or sets a boolean indicating that this mesh can be used in the collision engine
         * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
         */
        get: function () {
            return this._meshCollisionData._checkCollisions;
        },
        set: function (collisionEnabled) {
            this._meshCollisionData._checkCollisions = collisionEnabled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMesh.prototype, "collider", {
        /**
         * Gets Collider object used to compute collisions (not physics)
         * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
         */
        get: function () {
            return this._meshCollisionData._collider;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Move the mesh using collision engine
     * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
     * @param displacement defines the requested displacement vector
     * @returns the current mesh
     */
    AbstractMesh.prototype.moveWithCollisions = function (displacement) {
        var globalPosition = this.getAbsolutePosition();
        globalPosition.addToRef(this.ellipsoidOffset, this._meshCollisionData._oldPositionForCollisions);
        var coordinator = this.getScene().collisionCoordinator;
        if (!this._meshCollisionData._collider) {
            this._meshCollisionData._collider = coordinator.createCollider();
        }
        this._meshCollisionData._collider._radius = this.ellipsoid;
        coordinator.getNewPosition(this._meshCollisionData._oldPositionForCollisions, displacement, this._meshCollisionData._collider, 3, this, this._onCollisionPositionChange, this.uniqueId);
        return this;
    };
    // Collisions
    /** @hidden */
    AbstractMesh.prototype._collideForSubMesh = function (subMesh, transformMatrix, collider) {
        this._generatePointsArray();
        if (!this._positions) {
            return this;
        }
        // Transformation
        if (!subMesh._lastColliderWorldVertices || !subMesh._lastColliderTransformMatrix.equals(transformMatrix)) {
            subMesh._lastColliderTransformMatrix = transformMatrix.clone();
            subMesh._lastColliderWorldVertices = [];
            subMesh._trianglePlanes = [];
            var start = subMesh.verticesStart;
            var end = (subMesh.verticesStart + subMesh.verticesCount);
            for (var i = start; i < end; i++) {
                subMesh._lastColliderWorldVertices.push(Vector3.TransformCoordinates(this._positions[i], transformMatrix));
            }
        }
        // Collide
        collider._collide(subMesh._trianglePlanes, subMesh._lastColliderWorldVertices, this.getIndices(), subMesh.indexStart, subMesh.indexStart + subMesh.indexCount, subMesh.verticesStart, !!subMesh.getMaterial(), this);
        return this;
    };
    /** @hidden */
    AbstractMesh.prototype._processCollisionsForSubMeshes = function (collider, transformMatrix) {
        var subMeshes = this._scene.getCollidingSubMeshCandidates(this, collider);
        var len = subMeshes.length;
        for (var index = 0; index < len; index++) {
            var subMesh = subMeshes.data[index];
            // Bounding test
            if (len > 1 && !subMesh._checkCollision(collider)) {
                continue;
            }
            this._collideForSubMesh(subMesh, transformMatrix, collider);
        }
        return this;
    };
    /** @hidden */
    AbstractMesh.prototype._checkCollision = function (collider) {
        // Bounding box test
        if (!this._boundingInfo || !this._boundingInfo._checkCollision(collider)) {
            return this;
        }
        // Transformation matrix
        var collisionsScalingMatrix = TmpVectors.Matrix[0];
        var collisionsTransformMatrix = TmpVectors.Matrix[1];
        Matrix.ScalingToRef(1.0 / collider._radius.x, 1.0 / collider._radius.y, 1.0 / collider._radius.z, collisionsScalingMatrix);
        this.worldMatrixFromCache.multiplyToRef(collisionsScalingMatrix, collisionsTransformMatrix);
        this._processCollisionsForSubMeshes(collider, collisionsTransformMatrix);
        return this;
    };
    // Picking
    /** @hidden */
    AbstractMesh.prototype._generatePointsArray = function () {
        return false;
    };
    /**
     * Checks if the passed Ray intersects with the mesh
     * @param ray defines the ray to use
     * @param fastCheck defines if fast mode (but less precise) must be used (false by default)
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @param onlyBoundingInfo defines a boolean indicating if picking should only happen using bounding info (false by default)
     * @param worldToUse defines the world matrix to use to get the world coordinate of the intersection point
     * @param skipBoundingInfo a boolean indicating if we should skip the bounding info check
     * @returns the picking info
     * @see https://doc.babylonjs.com/babylon101/intersect_collisions_-_mesh
     */
    AbstractMesh.prototype.intersects = function (ray, fastCheck, trianglePredicate, onlyBoundingInfo, worldToUse, skipBoundingInfo) {
        var _a;
        if (onlyBoundingInfo === void 0) { onlyBoundingInfo = false; }
        if (skipBoundingInfo === void 0) { skipBoundingInfo = false; }
        var pickingInfo = new PickingInfo();
        var intersectionThreshold = this.getClassName() === "InstancedLinesMesh" || this.getClassName() === "LinesMesh" ? this.intersectionThreshold : 0;
        var boundingInfo = this._boundingInfo;
        if (!this.subMeshes || !boundingInfo) {
            return pickingInfo;
        }
        if (!skipBoundingInfo && (!ray.intersectsSphere(boundingInfo.boundingSphere, intersectionThreshold) || !ray.intersectsBox(boundingInfo.boundingBox, intersectionThreshold))) {
            return pickingInfo;
        }
        if (onlyBoundingInfo) {
            pickingInfo.hit = skipBoundingInfo ? false : true;
            pickingInfo.pickedMesh = skipBoundingInfo ? null : this;
            pickingInfo.distance = skipBoundingInfo ? 0 : Vector3.Distance(ray.origin, boundingInfo.boundingSphere.center);
            pickingInfo.subMeshId = 0;
            return pickingInfo;
        }
        if (!this._generatePointsArray()) {
            return pickingInfo;
        }
        var intersectInfo = null;
        var subMeshes = this._scene.getIntersectingSubMeshCandidates(this, ray);
        var len = subMeshes.length;
        // Check if all submeshes are using a material that don't allow picking (point/lines rendering)
        // if no submesh can be picked that way, then fallback to BBox picking
        var anySubmeshSupportIntersect = false;
        for (var index = 0; index < len; index++) {
            var subMesh = subMeshes.data[index];
            var material = subMesh.getMaterial();
            if (!material) {
                continue;
            }
            if (((_a = this.getIndices()) === null || _a === void 0 ? void 0 : _a.length) && (material.fillMode == 7 ||
                material.fillMode == 0 ||
                material.fillMode == 1 ||
                material.fillMode == 2)) {
                anySubmeshSupportIntersect = true;
                break;
            }
        }
        // no sub mesh support intersection, fallback to BBox that has already be done
        if (!anySubmeshSupportIntersect) {
            pickingInfo.hit = true;
            pickingInfo.pickedMesh = this;
            pickingInfo.distance = Vector3.Distance(ray.origin, boundingInfo.boundingSphere.center);
            pickingInfo.subMeshId = -1;
            return pickingInfo;
        }
        // at least 1 submesh supports intersection, keep going
        for (var index = 0; index < len; index++) {
            var subMesh = subMeshes.data[index];
            // Bounding test
            if (len > 1 && !subMesh.canIntersects(ray)) {
                continue;
            }
            var currentIntersectInfo = subMesh.intersects(ray, this._positions, this.getIndices(), fastCheck, trianglePredicate);
            if (currentIntersectInfo) {
                if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
                    intersectInfo = currentIntersectInfo;
                    intersectInfo.subMeshId = index;
                    if (fastCheck) {
                        break;
                    }
                }
            }
        }
        if (intersectInfo) {
            // Get picked point
            var world = worldToUse !== null && worldToUse !== void 0 ? worldToUse : (this.skeleton && this.skeleton.overrideMesh ? this.skeleton.overrideMesh.getWorldMatrix() : this.getWorldMatrix());
            var worldOrigin = TmpVectors.Vector3[0];
            var direction = TmpVectors.Vector3[1];
            Vector3.TransformCoordinatesToRef(ray.origin, world, worldOrigin);
            ray.direction.scaleToRef(intersectInfo.distance, direction);
            var worldDirection = Vector3.TransformNormal(direction, world);
            var pickedPoint = worldDirection.addInPlace(worldOrigin);
            // Return result
            pickingInfo.hit = true;
            pickingInfo.distance = Vector3.Distance(worldOrigin, pickedPoint);
            pickingInfo.pickedPoint = pickedPoint;
            pickingInfo.pickedMesh = this;
            pickingInfo.bu = intersectInfo.bu || 0;
            pickingInfo.bv = intersectInfo.bv || 0;
            pickingInfo.subMeshFaceId = intersectInfo.faceId;
            pickingInfo.faceId = intersectInfo.faceId + subMeshes.data[intersectInfo.subMeshId].indexStart / (this.getClassName().indexOf("LinesMesh") !== -1 ? 2 : 3);
            pickingInfo.subMeshId = intersectInfo.subMeshId;
            return pickingInfo;
        }
        return pickingInfo;
    };
    /**
     * Clones the current mesh
     * @param name defines the mesh name
     * @param newParent defines the new mesh parent
     * @param doNotCloneChildren defines a boolean indicating that children must not be cloned (false by default)
     * @returns the new mesh
     */
    AbstractMesh.prototype.clone = function (name, newParent, doNotCloneChildren) {
        return null;
    };
    /**
     * Disposes all the submeshes of the current meshnp
     * @returns the current mesh
     */
    AbstractMesh.prototype.releaseSubMeshes = function () {
        if (this.subMeshes) {
            while (this.subMeshes.length) {
                this.subMeshes[0].dispose();
            }
        }
        else {
            this.subMeshes = new Array();
        }
        return this;
    };
    /**
     * Releases resources associated with this abstract mesh.
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
     */
    AbstractMesh.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
        var _this = this;
        if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
        var index;
        // mesh map release.
        if (this._scene.useMaterialMeshMap) {
            // remove from material mesh map id needed
            if (this._material && this._material.meshMap) {
                this._material.meshMap[this.uniqueId] = undefined;
            }
        }
        // Smart Array Retainers.
        this.getScene().freeActiveMeshes();
        this.getScene().freeRenderingGroups();
        // Action manager
        if (this.actionManager !== undefined && this.actionManager !== null) {
            this.actionManager.dispose();
            this.actionManager = null;
        }
        // Skeleton
        this._internalAbstractMeshDataInfo._skeleton = null;
        if (this._transformMatrixTexture) {
            this._transformMatrixTexture.dispose();
            this._transformMatrixTexture = null;
        }
        // Intersections in progress
        for (index = 0; index < this._intersectionsInProgress.length; index++) {
            var other = this._intersectionsInProgress[index];
            var pos = other._intersectionsInProgress.indexOf(this);
            other._intersectionsInProgress.splice(pos, 1);
        }
        this._intersectionsInProgress = [];
        // Lights
        var lights = this.getScene().lights;
        lights.forEach(function (light) {
            var meshIndex = light.includedOnlyMeshes.indexOf(_this);
            if (meshIndex !== -1) {
                light.includedOnlyMeshes.splice(meshIndex, 1);
            }
            meshIndex = light.excludedMeshes.indexOf(_this);
            if (meshIndex !== -1) {
                light.excludedMeshes.splice(meshIndex, 1);
            }
            // Shadow generators
            var generator = light.getShadowGenerator();
            if (generator) {
                var shadowMap = generator.getShadowMap();
                if (shadowMap && shadowMap.renderList) {
                    meshIndex = shadowMap.renderList.indexOf(_this);
                    if (meshIndex !== -1) {
                        shadowMap.renderList.splice(meshIndex, 1);
                    }
                }
            }
        });
        // SubMeshes
        if (this.getClassName() !== "InstancedMesh" || this.getClassName() !== "InstancedLinesMesh") {
            this.releaseSubMeshes();
        }
        // Query
        var engine = this.getScene().getEngine();
        if (this._occlusionQuery) {
            this.isOcclusionQueryInProgress = false;
            engine.deleteQuery(this._occlusionQuery);
            this._occlusionQuery = null;
        }
        // Engine
        engine.wipeCaches();
        // Remove from scene
        this.getScene().removeMesh(this);
        if (disposeMaterialAndTextures) {
            if (this.material) {
                if (this.material.getClassName() === "MultiMaterial") {
                    this.material.dispose(false, true, true);
                }
                else {
                    this.material.dispose(false, true);
                }
            }
        }
        if (!doNotRecurse) {
            // Particles
            for (index = 0; index < this.getScene().particleSystems.length; index++) {
                if (this.getScene().particleSystems[index].emitter === this) {
                    this.getScene().particleSystems[index].dispose();
                    index--;
                }
            }
        }
        // facet data
        if (this._internalAbstractMeshDataInfo._facetData.facetDataEnabled) {
            this.disableFacetData();
        }
        this.onAfterWorldMatrixUpdateObservable.clear();
        this.onCollideObservable.clear();
        this.onCollisionPositionChangeObservable.clear();
        this.onRebuildObservable.clear();
        _super.prototype.dispose.call(this, doNotRecurse, disposeMaterialAndTextures);
    };
    /**
     * Adds the passed mesh as a child to the current mesh
     * @param mesh defines the child mesh
     * @returns the current mesh
     */
    AbstractMesh.prototype.addChild = function (mesh) {
        mesh.setParent(this);
        return this;
    };
    /**
     * Removes the passed mesh from the current mesh children list
     * @param mesh defines the child mesh
     * @returns the current mesh
     */
    AbstractMesh.prototype.removeChild = function (mesh) {
        mesh.setParent(null);
        return this;
    };
    // Facet data
    /** @hidden */
    AbstractMesh.prototype._initFacetData = function () {
        var data = this._internalAbstractMeshDataInfo._facetData;
        if (!data.facetNormals) {
            data.facetNormals = new Array();
        }
        if (!data.facetPositions) {
            data.facetPositions = new Array();
        }
        if (!data.facetPartitioning) {
            data.facetPartitioning = new Array();
        }
        data.facetNb = (this.getIndices().length / 3) | 0;
        data.partitioningSubdivisions = (data.partitioningSubdivisions) ? data.partitioningSubdivisions : 10; // default nb of partitioning subdivisions = 10
        data.partitioningBBoxRatio = (data.partitioningBBoxRatio) ? data.partitioningBBoxRatio : 1.01; // default ratio 1.01 = the partitioning is 1% bigger than the bounding box
        for (var f = 0; f < data.facetNb; f++) {
            data.facetNormals[f] = Vector3.Zero();
            data.facetPositions[f] = Vector3.Zero();
        }
        data.facetDataEnabled = true;
        return this;
    };
    /**
     * Updates the mesh facetData arrays and the internal partitioning when the mesh is morphed or updated.
     * This method can be called within the render loop.
     * You don't need to call this method by yourself in the render loop when you update/morph a mesh with the methods CreateXXX() as they automatically manage this computation
     * @returns the current mesh
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.updateFacetData = function () {
        var data = this._internalAbstractMeshDataInfo._facetData;
        if (!data.facetDataEnabled) {
            this._initFacetData();
        }
        var positions = this.getVerticesData(VertexBuffer.PositionKind);
        var indices = this.getIndices();
        var normals = this.getVerticesData(VertexBuffer.NormalKind);
        var bInfo = this.getBoundingInfo();
        if (data.facetDepthSort && !data.facetDepthSortEnabled) {
            // init arrays, matrix and sort function on first call
            data.facetDepthSortEnabled = true;
            if (indices instanceof Uint16Array) {
                data.depthSortedIndices = new Uint16Array(indices);
            }
            else if (indices instanceof Uint32Array) {
                data.depthSortedIndices = new Uint32Array(indices);
            }
            else {
                var needs32bits = false;
                for (var i = 0; i < indices.length; i++) {
                    if (indices[i] > 65535) {
                        needs32bits = true;
                        break;
                    }
                }
                if (needs32bits) {
                    data.depthSortedIndices = new Uint32Array(indices);
                }
                else {
                    data.depthSortedIndices = new Uint16Array(indices);
                }
            }
            data.facetDepthSortFunction = function (f1, f2) {
                return (f2.sqDistance - f1.sqDistance);
            };
            if (!data.facetDepthSortFrom) {
                var camera = this.getScene().activeCamera;
                data.facetDepthSortFrom = (camera) ? camera.position : Vector3.Zero();
            }
            data.depthSortedFacets = [];
            for (var f = 0; f < data.facetNb; f++) {
                var depthSortedFacet = { ind: f * 3, sqDistance: 0.0 };
                data.depthSortedFacets.push(depthSortedFacet);
            }
            data.invertedMatrix = Matrix.Identity();
            data.facetDepthSortOrigin = Vector3.Zero();
        }
        data.bbSize.x = (bInfo.maximum.x - bInfo.minimum.x > Epsilon) ? bInfo.maximum.x - bInfo.minimum.x : Epsilon;
        data.bbSize.y = (bInfo.maximum.y - bInfo.minimum.y > Epsilon) ? bInfo.maximum.y - bInfo.minimum.y : Epsilon;
        data.bbSize.z = (bInfo.maximum.z - bInfo.minimum.z > Epsilon) ? bInfo.maximum.z - bInfo.minimum.z : Epsilon;
        var bbSizeMax = (data.bbSize.x > data.bbSize.y) ? data.bbSize.x : data.bbSize.y;
        bbSizeMax = (bbSizeMax > data.bbSize.z) ? bbSizeMax : data.bbSize.z;
        data.subDiv.max = data.partitioningSubdivisions;
        data.subDiv.X = Math.floor(data.subDiv.max * data.bbSize.x / bbSizeMax); // adjust the number of subdivisions per axis
        data.subDiv.Y = Math.floor(data.subDiv.max * data.bbSize.y / bbSizeMax); // according to each bbox size per axis
        data.subDiv.Z = Math.floor(data.subDiv.max * data.bbSize.z / bbSizeMax);
        data.subDiv.X = data.subDiv.X < 1 ? 1 : data.subDiv.X; // at least one subdivision
        data.subDiv.Y = data.subDiv.Y < 1 ? 1 : data.subDiv.Y;
        data.subDiv.Z = data.subDiv.Z < 1 ? 1 : data.subDiv.Z;
        // set the parameters for ComputeNormals()
        data.facetParameters.facetNormals = this.getFacetLocalNormals();
        data.facetParameters.facetPositions = this.getFacetLocalPositions();
        data.facetParameters.facetPartitioning = this.getFacetLocalPartitioning();
        data.facetParameters.bInfo = bInfo;
        data.facetParameters.bbSize = data.bbSize;
        data.facetParameters.subDiv = data.subDiv;
        data.facetParameters.ratio = this.partitioningBBoxRatio;
        data.facetParameters.depthSort = data.facetDepthSort;
        if (data.facetDepthSort && data.facetDepthSortEnabled) {
            this.computeWorldMatrix(true);
            this._worldMatrix.invertToRef(data.invertedMatrix);
            Vector3.TransformCoordinatesToRef(data.facetDepthSortFrom, data.invertedMatrix, data.facetDepthSortOrigin);
            data.facetParameters.distanceTo = data.facetDepthSortOrigin;
        }
        data.facetParameters.depthSortedFacets = data.depthSortedFacets;
        VertexData.ComputeNormals(positions, indices, normals, data.facetParameters);
        if (data.facetDepthSort && data.facetDepthSortEnabled) {
            data.depthSortedFacets.sort(data.facetDepthSortFunction);
            var l = (data.depthSortedIndices.length / 3) | 0;
            for (var f = 0; f < l; f++) {
                var sind = data.depthSortedFacets[f].ind;
                data.depthSortedIndices[f * 3] = indices[sind];
                data.depthSortedIndices[f * 3 + 1] = indices[sind + 1];
                data.depthSortedIndices[f * 3 + 2] = indices[sind + 2];
            }
            this.updateIndices(data.depthSortedIndices, undefined, true);
        }
        return this;
    };
    /**
     * Returns the facetLocalNormals array.
     * The normals are expressed in the mesh local spac
     * @returns an array of Vector3
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getFacetLocalNormals = function () {
        var facetData = this._internalAbstractMeshDataInfo._facetData;
        if (!facetData.facetNormals) {
            this.updateFacetData();
        }
        return facetData.facetNormals;
    };
    /**
     * Returns the facetLocalPositions array.
     * The facet positions are expressed in the mesh local space
     * @returns an array of Vector3
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getFacetLocalPositions = function () {
        var facetData = this._internalAbstractMeshDataInfo._facetData;
        if (!facetData.facetPositions) {
            this.updateFacetData();
        }
        return facetData.facetPositions;
    };
    /**
     * Returns the facetLocalPartioning array
     * @returns an array of array of numbers
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getFacetLocalPartitioning = function () {
        var facetData = this._internalAbstractMeshDataInfo._facetData;
        if (!facetData.facetPartitioning) {
            this.updateFacetData();
        }
        return facetData.facetPartitioning;
    };
    /**
     * Returns the i-th facet position in the world system.
     * This method allocates a new Vector3 per call
     * @param i defines the facet index
     * @returns a new Vector3
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getFacetPosition = function (i) {
        var pos = Vector3.Zero();
        this.getFacetPositionToRef(i, pos);
        return pos;
    };
    /**
     * Sets the reference Vector3 with the i-th facet position in the world system
     * @param i defines the facet index
     * @param ref defines the target vector
     * @returns the current mesh
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getFacetPositionToRef = function (i, ref) {
        var localPos = (this.getFacetLocalPositions())[i];
        var world = this.getWorldMatrix();
        Vector3.TransformCoordinatesToRef(localPos, world, ref);
        return this;
    };
    /**
     * Returns the i-th facet normal in the world system.
     * This method allocates a new Vector3 per call
     * @param i defines the facet index
     * @returns a new Vector3
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getFacetNormal = function (i) {
        var norm = Vector3.Zero();
        this.getFacetNormalToRef(i, norm);
        return norm;
    };
    /**
     * Sets the reference Vector3 with the i-th facet normal in the world system
     * @param i defines the facet index
     * @param ref defines the target vector
     * @returns the current mesh
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getFacetNormalToRef = function (i, ref) {
        var localNorm = (this.getFacetLocalNormals())[i];
        Vector3.TransformNormalToRef(localNorm, this.getWorldMatrix(), ref);
        return this;
    };
    /**
     * Returns the facets (in an array) in the same partitioning block than the one the passed coordinates are located (expressed in the mesh local system)
     * @param x defines x coordinate
     * @param y defines y coordinate
     * @param z defines z coordinate
     * @returns the array of facet indexes
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getFacetsAtLocalCoordinates = function (x, y, z) {
        var bInfo = this.getBoundingInfo();
        var data = this._internalAbstractMeshDataInfo._facetData;
        var ox = Math.floor((x - bInfo.minimum.x * data.partitioningBBoxRatio) * data.subDiv.X * data.partitioningBBoxRatio / data.bbSize.x);
        var oy = Math.floor((y - bInfo.minimum.y * data.partitioningBBoxRatio) * data.subDiv.Y * data.partitioningBBoxRatio / data.bbSize.y);
        var oz = Math.floor((z - bInfo.minimum.z * data.partitioningBBoxRatio) * data.subDiv.Z * data.partitioningBBoxRatio / data.bbSize.z);
        if (ox < 0 || ox > data.subDiv.max || oy < 0 || oy > data.subDiv.max || oz < 0 || oz > data.subDiv.max) {
            return null;
        }
        return data.facetPartitioning[ox + data.subDiv.max * oy + data.subDiv.max * data.subDiv.max * oz];
    };
    /**
     * Returns the closest mesh facet index at (x,y,z) World coordinates, null if not found
     * @param projected sets as the (x,y,z) world projection on the facet
     * @param checkFace if true (default false), only the facet "facing" to (x,y,z) or only the ones "turning their backs", according to the parameter "facing" are returned
     * @param facing if facing and checkFace are true, only the facet "facing" to (x, y, z) are returned : positive dot (x, y, z) * facet position. If facing si false and checkFace is true, only the facet "turning their backs" to (x, y, z) are returned : negative dot (x, y, z) * facet position
     * @param x defines x coordinate
     * @param y defines y coordinate
     * @param z defines z coordinate
     * @returns the face index if found (or null instead)
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getClosestFacetAtCoordinates = function (x, y, z, projected, checkFace, facing) {
        if (checkFace === void 0) { checkFace = false; }
        if (facing === void 0) { facing = true; }
        var world = this.getWorldMatrix();
        var invMat = TmpVectors.Matrix[5];
        world.invertToRef(invMat);
        var invVect = TmpVectors.Vector3[8];
        Vector3.TransformCoordinatesFromFloatsToRef(x, y, z, invMat, invVect); // transform (x,y,z) to coordinates in the mesh local space
        var closest = this.getClosestFacetAtLocalCoordinates(invVect.x, invVect.y, invVect.z, projected, checkFace, facing);
        if (projected) {
            // tranform the local computed projected vector to world coordinates
            Vector3.TransformCoordinatesFromFloatsToRef(projected.x, projected.y, projected.z, world, projected);
        }
        return closest;
    };
    /**
     * Returns the closest mesh facet index at (x,y,z) local coordinates, null if not found
     * @param projected sets as the (x,y,z) local projection on the facet
     * @param checkFace if true (default false), only the facet "facing" to (x,y,z) or only the ones "turning their backs", according to the parameter "facing" are returned
     * @param facing if facing and checkFace are true, only the facet "facing" to (x, y, z) are returned : positive dot (x, y, z) * facet position. If facing si false and checkFace is true, only the facet "turning their backs" to (x, y, z) are returned : negative dot (x, y, z) * facet position
     * @param x defines x coordinate
     * @param y defines y coordinate
     * @param z defines z coordinate
     * @returns the face index if found (or null instead)
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getClosestFacetAtLocalCoordinates = function (x, y, z, projected, checkFace, facing) {
        if (checkFace === void 0) { checkFace = false; }
        if (facing === void 0) { facing = true; }
        var closest = null;
        var tmpx = 0.0;
        var tmpy = 0.0;
        var tmpz = 0.0;
        var d = 0.0; // tmp dot facet normal * facet position
        var t0 = 0.0;
        var projx = 0.0;
        var projy = 0.0;
        var projz = 0.0;
        // Get all the facets in the same partitioning block than (x, y, z)
        var facetPositions = this.getFacetLocalPositions();
        var facetNormals = this.getFacetLocalNormals();
        var facetsInBlock = this.getFacetsAtLocalCoordinates(x, y, z);
        if (!facetsInBlock) {
            return null;
        }
        // Get the closest facet to (x, y, z)
        var shortest = Number.MAX_VALUE; // init distance vars
        var tmpDistance = shortest;
        var fib; // current facet in the block
        var norm; // current facet normal
        var p0; // current facet barycenter position
        // loop on all the facets in the current partitioning block
        for (var idx = 0; idx < facetsInBlock.length; idx++) {
            fib = facetsInBlock[idx];
            norm = facetNormals[fib];
            p0 = facetPositions[fib];
            d = (x - p0.x) * norm.x + (y - p0.y) * norm.y + (z - p0.z) * norm.z;
            if (!checkFace || (checkFace && facing && d >= 0.0) || (checkFace && !facing && d <= 0.0)) {
                // compute (x,y,z) projection on the facet = (projx, projy, projz)
                d = norm.x * p0.x + norm.y * p0.y + norm.z * p0.z;
                t0 = -(norm.x * x + norm.y * y + norm.z * z - d) / (norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);
                projx = x + norm.x * t0;
                projy = y + norm.y * t0;
                projz = z + norm.z * t0;
                tmpx = projx - x;
                tmpy = projy - y;
                tmpz = projz - z;
                tmpDistance = tmpx * tmpx + tmpy * tmpy + tmpz * tmpz; // compute length between (x, y, z) and its projection on the facet
                if (tmpDistance < shortest) { // just keep the closest facet to (x, y, z)
                    shortest = tmpDistance;
                    closest = fib;
                    if (projected) {
                        projected.x = projx;
                        projected.y = projy;
                        projected.z = projz;
                    }
                }
            }
        }
        return closest;
    };
    /**
     * Returns the object "parameter" set with all the expected parameters for facetData computation by ComputeNormals()
     * @returns the parameters
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.getFacetDataParameters = function () {
        return this._internalAbstractMeshDataInfo._facetData.facetParameters;
    };
    /**
     * Disables the feature FacetData and frees the related memory
     * @returns the current mesh
     * @see https://doc.babylonjs.com/how_to/how_to_use_facetdata
     */
    AbstractMesh.prototype.disableFacetData = function () {
        var facetData = this._internalAbstractMeshDataInfo._facetData;
        if (facetData.facetDataEnabled) {
            facetData.facetDataEnabled = false;
            facetData.facetPositions = new Array();
            facetData.facetNormals = new Array();
            facetData.facetPartitioning = new Array();
            facetData.facetParameters = null;
            facetData.depthSortedIndices = new Uint32Array(0);
        }
        return this;
    };
    /**
     * Updates the AbstractMesh indices array
     * @param indices defines the data source
     * @param offset defines the offset in the index buffer where to store the new data (can be null)
     * @param gpuMemoryOnly defines a boolean indicating that only the GPU memory must be updated leaving the CPU version of the indices unchanged (false by default)
     * @returns the current mesh
     */
    AbstractMesh.prototype.updateIndices = function (indices, offset, gpuMemoryOnly) {
        return this;
    };
    /**
     * Creates new normals data for the mesh
     * @param updatable defines if the normal vertex buffer must be flagged as updatable
     * @returns the current mesh
     */
    AbstractMesh.prototype.createNormals = function (updatable) {
        var positions = this.getVerticesData(VertexBuffer.PositionKind);
        var indices = this.getIndices();
        var normals;
        if (this.isVerticesDataPresent(VertexBuffer.NormalKind)) {
            normals = this.getVerticesData(VertexBuffer.NormalKind);
        }
        else {
            normals = [];
        }
        VertexData.ComputeNormals(positions, indices, normals, { useRightHandedSystem: this.getScene().useRightHandedSystem });
        this.setVerticesData(VertexBuffer.NormalKind, normals, updatable);
        return this;
    };
    /**
     * Align the mesh with a normal
     * @param normal defines the normal to use
     * @param upDirection can be used to redefined the up vector to use (will use the (0, 1, 0) by default)
     * @returns the current mesh
     */
    AbstractMesh.prototype.alignWithNormal = function (normal, upDirection) {
        if (!upDirection) {
            upDirection = Axis.Y;
        }
        var axisX = TmpVectors.Vector3[0];
        var axisZ = TmpVectors.Vector3[1];
        Vector3.CrossToRef(upDirection, normal, axisZ);
        Vector3.CrossToRef(normal, axisZ, axisX);
        if (this.rotationQuaternion) {
            Quaternion.RotationQuaternionFromAxisToRef(axisX, normal, axisZ, this.rotationQuaternion);
        }
        else {
            Vector3.RotationFromAxisToRef(axisX, normal, axisZ, this.rotation);
        }
        return this;
    };
    /** @hidden */
    AbstractMesh.prototype._checkOcclusionQuery = function () {
        return false;
    };
    /**
     * Disables the mesh edge rendering mode
     * @returns the currentAbstractMesh
     */
    AbstractMesh.prototype.disableEdgesRendering = function () {
        throw _DevTools.WarnImport("EdgesRenderer");
    };
    /**
     * Enables the edge rendering mode on the mesh.
     * This mode makes the mesh edges visible
     * @param epsilon defines the maximal distance between two angles to detect a face
     * @param checkVerticesInsteadOfIndices indicates that we should check vertex list directly instead of faces
     * @param options options to the edge renderer
     * @returns the currentAbstractMesh
     * @see https://www.babylonjs-playground.com/#19O9TU#0
     */
    AbstractMesh.prototype.enableEdgesRendering = function (epsilon, checkVerticesInsteadOfIndices, options) {
        throw _DevTools.WarnImport("EdgesRenderer");
    };
    /**
     * This function returns all of the particle systems in the scene that use the mesh as an emitter.
     * @returns an array of particle systems in the scene that use the mesh as an emitter
     */
    AbstractMesh.prototype.getConnectedParticleSystems = function () {
        var _this = this;
        return this._scene.particleSystems.filter(function (particleSystem) { return particleSystem.emitter === _this; });
    };
    /** No occlusion */
    AbstractMesh.OCCLUSION_TYPE_NONE = 0;
    /** Occlusion set to optimisitic */
    AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC = 1;
    /** Occlusion set to strict */
    AbstractMesh.OCCLUSION_TYPE_STRICT = 2;
    /** Use an accurante occlusion algorithm */
    AbstractMesh.OCCLUSION_ALGORITHM_TYPE_ACCURATE = 0;
    /** Use a conservative occlusion algorithm */
    AbstractMesh.OCCLUSION_ALGORITHM_TYPE_CONSERVATIVE = 1;
    /** Default culling strategy : this is an exclusion test and it's the more accurate.
     *  Test order :
     *  Is the bounding sphere outside the frustum ?
     *  If not, are the bounding box vertices outside the frustum ?
     *  It not, then the cullable object is in the frustum.
     */
    AbstractMesh.CULLINGSTRATEGY_STANDARD = 0;
    /** Culling strategy : Bounding Sphere Only.
     *  This is an exclusion test. It's faster than the standard strategy because the bounding box is not tested.
     *  It's also less accurate than the standard because some not visible objects can still be selected.
     *  Test : is the bounding sphere outside the frustum ?
     *  If not, then the cullable object is in the frustum.
     */
    AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY = 1;
    /** Culling strategy : Optimistic Inclusion.
     *  This in an inclusion test first, then the standard exclusion test.
     *  This can be faster when a cullable object is expected to be almost always in the camera frustum.
     *  This could also be a little slower than the standard test when the tested object center is not the frustum but one of its bounding box vertex is still inside.
     *  Anyway, it's as accurate as the standard strategy.
     *  Test :
     *  Is the cullable object bounding sphere center in the frustum ?
     *  If not, apply the default culling strategy.
     */
    AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION = 2;
    /** Culling strategy : Optimistic Inclusion then Bounding Sphere Only.
     *  This in an inclusion test first, then the bounding sphere only exclusion test.
     *  This can be the fastest test when a cullable object is expected to be almost always in the camera frustum.
     *  This could also be a little slower than the BoundingSphereOnly strategy when the tested object center is not in the frustum but its bounding sphere still intersects it.
     *  It's less accurate than the standard strategy and as accurate as the BoundingSphereOnly strategy.
     *  Test :
     *  Is the cullable object bounding sphere center in the frustum ?
     *  If not, apply the Bounding Sphere Only strategy. No Bounding Box is tested here.
     */
    AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY = 3;
    return AbstractMesh;
}(TransformNode));
_TypeStore.RegisteredTypes["BABYLON.AbstractMesh"] = AbstractMesh;

/**
 * @hidden
 */
var IntersectionInfo = /** @class */ (function () {
    function IntersectionInfo(bu, bv, distance) {
        this.bu = bu;
        this.bv = bv;
        this.distance = distance;
        this.faceId = 0;
        this.subMeshId = 0;
    }
    return IntersectionInfo;
}());

/**
 * Defines a subdivision inside a mesh
 */
var SubMesh = /** @class */ (function () {
    /**
     * Creates a new submesh
     * @param materialIndex defines the material index to use
     * @param verticesStart defines vertex index start
     * @param verticesCount defines vertices count
     * @param indexStart defines index start
     * @param indexCount defines indices count
     * @param mesh defines the parent mesh
     * @param renderingMesh defines an optional rendering mesh
     * @param createBoundingBox defines if bounding box should be created for this submesh
     * @param addToMesh defines a boolean indicating that the submesh must be added to the mesh.subMeshes array (true by default)
     */
    function SubMesh(
    /** the material index to use */
    materialIndex, 
    /** vertex index start */
    verticesStart, 
    /** vertices count */
    verticesCount, 
    /** index start */
    indexStart, 
    /** indices count */
    indexCount, mesh, renderingMesh, createBoundingBox, addToMesh) {
        if (createBoundingBox === void 0) { createBoundingBox = true; }
        if (addToMesh === void 0) { addToMesh = true; }
        this.materialIndex = materialIndex;
        this.verticesStart = verticesStart;
        this.verticesCount = verticesCount;
        this.indexStart = indexStart;
        this.indexCount = indexCount;
        /** @hidden */
        this._materialDefines = null;
        /** @hidden */
        this._materialEffect = null;
        /** @hidden */
        this._effectOverride = null;
        /** @hidden */
        this._linesIndexCount = 0;
        this._linesIndexBuffer = null;
        /** @hidden */
        this._lastColliderWorldVertices = null;
        /** @hidden */
        this._lastColliderTransformMatrix = null;
        /** @hidden */
        this._renderId = 0;
        /** @hidden */
        this._alphaIndex = 0;
        /** @hidden */
        this._distanceToCamera = 0;
        this._currentMaterial = null;
        this._mesh = mesh;
        this._renderingMesh = renderingMesh || mesh;
        if (addToMesh) {
            mesh.subMeshes.push(this);
        }
        this._trianglePlanes = [];
        this._id = mesh.subMeshes.length - 1;
        if (createBoundingBox) {
            this.refreshBoundingInfo();
            mesh.computeWorldMatrix(true);
        }
    }
    Object.defineProperty(SubMesh.prototype, "materialDefines", {
        /**
         * Gets material defines used by the effect associated to the sub mesh
         */
        get: function () {
            return this._materialDefines;
        },
        /**
         * Sets material defines used by the effect associated to the sub mesh
         */
        set: function (defines) {
            this._materialDefines = defines;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubMesh.prototype, "effect", {
        /**
         * Gets associated effect
         */
        get: function () {
            var _a;
            return (_a = this._effectOverride) !== null && _a !== void 0 ? _a : this._materialEffect;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets associated effect (effect used to render this submesh)
     * @param effect defines the effect to associate with
     * @param defines defines the set of defines used to compile this effect
     */
    SubMesh.prototype.setEffect = function (effect, defines) {
        if (defines === void 0) { defines = null; }
        if (this._materialEffect === effect) {
            if (!effect) {
                this._materialDefines = null;
            }
            return;
        }
        this._materialDefines = defines;
        this._materialEffect = effect;
    };
    /**
     * Add a new submesh to a mesh
     * @param materialIndex defines the material index to use
     * @param verticesStart defines vertex index start
     * @param verticesCount defines vertices count
     * @param indexStart defines index start
     * @param indexCount defines indices count
     * @param mesh defines the parent mesh
     * @param renderingMesh defines an optional rendering mesh
     * @param createBoundingBox defines if bounding box should be created for this submesh
     * @returns the new submesh
     */
    SubMesh.AddToMesh = function (materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh, renderingMesh, createBoundingBox) {
        if (createBoundingBox === void 0) { createBoundingBox = true; }
        return new SubMesh(materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh, renderingMesh, createBoundingBox);
    };
    Object.defineProperty(SubMesh.prototype, "IsGlobal", {
        /**
         * Returns true if this submesh covers the entire parent mesh
         * @ignorenaming
         */
        get: function () {
            return (this.verticesStart === 0 && this.verticesCount === this._mesh.getTotalVertices());
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the submesh BoudingInfo object
     * @returns current bounding info (or mesh's one if the submesh is global)
     */
    SubMesh.prototype.getBoundingInfo = function () {
        if (this.IsGlobal) {
            return this._mesh.getBoundingInfo();
        }
        return this._boundingInfo;
    };
    /**
     * Sets the submesh BoundingInfo
     * @param boundingInfo defines the new bounding info to use
     * @returns the SubMesh
     */
    SubMesh.prototype.setBoundingInfo = function (boundingInfo) {
        this._boundingInfo = boundingInfo;
        return this;
    };
    /**
     * Returns the mesh of the current submesh
     * @return the parent mesh
     */
    SubMesh.prototype.getMesh = function () {
        return this._mesh;
    };
    /**
     * Returns the rendering mesh of the submesh
     * @returns the rendering mesh (could be different from parent mesh)
     */
    SubMesh.prototype.getRenderingMesh = function () {
        return this._renderingMesh;
    };
    /**
     * Returns the replacement mesh of the submesh
     * @returns the replacement mesh (could be different from parent mesh)
     */
    SubMesh.prototype.getReplacementMesh = function () {
        return this._mesh._internalAbstractMeshDataInfo._actAsRegularMesh ? this._mesh : null;
    };
    /**
     * Returns the effective mesh of the submesh
     * @returns the effective mesh (could be different from parent mesh)
     */
    SubMesh.prototype.getEffectiveMesh = function () {
        var replacementMesh = this._mesh._internalAbstractMeshDataInfo._actAsRegularMesh ? this._mesh : null;
        return replacementMesh ? replacementMesh : this._renderingMesh;
    };
    /**
     * Returns the submesh material
     * @returns null or the current material
     */
    SubMesh.prototype.getMaterial = function () {
        var rootMaterial = this._renderingMesh.material;
        if (rootMaterial === null || rootMaterial === undefined) {
            return this._mesh.getScene().defaultMaterial;
        }
        else if (this._IsMultiMaterial(rootMaterial)) {
            var effectiveMaterial = rootMaterial.getSubMaterial(this.materialIndex);
            if (this._currentMaterial !== effectiveMaterial) {
                this._currentMaterial = effectiveMaterial;
                this._materialDefines = null;
            }
            return effectiveMaterial;
        }
        return rootMaterial;
    };
    SubMesh.prototype._IsMultiMaterial = function (material) {
        return material.getSubMaterial !== undefined;
    };
    // Methods
    /**
     * Sets a new updated BoundingInfo object to the submesh
     * @param data defines an optional position array to use to determine the bounding info
     * @returns the SubMesh
     */
    SubMesh.prototype.refreshBoundingInfo = function (data) {
        if (data === void 0) { data = null; }
        this._lastColliderWorldVertices = null;
        if (this.IsGlobal || !this._renderingMesh || !this._renderingMesh.geometry) {
            return this;
        }
        if (!data) {
            data = this._renderingMesh.getVerticesData(VertexBuffer.PositionKind);
        }
        if (!data) {
            this._boundingInfo = this._mesh.getBoundingInfo();
            return this;
        }
        var indices = this._renderingMesh.getIndices();
        var extend;
        //is this the only submesh?
        if (this.indexStart === 0 && this.indexCount === indices.length) {
            var boundingInfo = this._renderingMesh.getBoundingInfo();
            //the rendering mesh's bounding info can be used, it is the standard submesh for all indices.
            extend = { minimum: boundingInfo.minimum.clone(), maximum: boundingInfo.maximum.clone() };
        }
        else {
            extend = extractMinAndMaxIndexed(data, indices, this.indexStart, this.indexCount, this._renderingMesh.geometry.boundingBias);
        }
        if (this._boundingInfo) {
            this._boundingInfo.reConstruct(extend.minimum, extend.maximum);
        }
        else {
            this._boundingInfo = new BoundingInfo(extend.minimum, extend.maximum);
        }
        return this;
    };
    /** @hidden */
    SubMesh.prototype._checkCollision = function (collider) {
        var boundingInfo = this.getBoundingInfo();
        return boundingInfo._checkCollision(collider);
    };
    /**
     * Updates the submesh BoundingInfo
     * @param world defines the world matrix to use to update the bounding info
     * @returns the submesh
     */
    SubMesh.prototype.updateBoundingInfo = function (world) {
        var boundingInfo = this.getBoundingInfo();
        if (!boundingInfo) {
            this.refreshBoundingInfo();
            boundingInfo = this.getBoundingInfo();
        }
        if (boundingInfo) {
            boundingInfo.update(world);
        }
        return this;
    };
    /**
     * True is the submesh bounding box intersects the frustum defined by the passed array of planes.
     * @param frustumPlanes defines the frustum planes
     * @returns true if the submesh is intersecting with the frustum
     */
    SubMesh.prototype.isInFrustum = function (frustumPlanes) {
        var boundingInfo = this.getBoundingInfo();
        if (!boundingInfo) {
            return false;
        }
        return boundingInfo.isInFrustum(frustumPlanes, this._mesh.cullingStrategy);
    };
    /**
     * True is the submesh bounding box is completely inside the frustum defined by the passed array of planes
     * @param frustumPlanes defines the frustum planes
     * @returns true if the submesh is inside the frustum
     */
    SubMesh.prototype.isCompletelyInFrustum = function (frustumPlanes) {
        var boundingInfo = this.getBoundingInfo();
        if (!boundingInfo) {
            return false;
        }
        return boundingInfo.isCompletelyInFrustum(frustumPlanes);
    };
    /**
     * Renders the submesh
     * @param enableAlphaMode defines if alpha needs to be used
     * @returns the submesh
     */
    SubMesh.prototype.render = function (enableAlphaMode) {
        this._renderingMesh.render(this, enableAlphaMode, this._mesh._internalAbstractMeshDataInfo._actAsRegularMesh ? this._mesh : undefined);
        return this;
    };
    /**
     * @hidden
     */
    SubMesh.prototype._getLinesIndexBuffer = function (indices, engine) {
        if (!this._linesIndexBuffer) {
            var linesIndices = [];
            for (var index = this.indexStart; index < this.indexStart + this.indexCount; index += 3) {
                linesIndices.push(indices[index], indices[index + 1], indices[index + 1], indices[index + 2], indices[index + 2], indices[index]);
            }
            this._linesIndexBuffer = engine.createIndexBuffer(linesIndices);
            this._linesIndexCount = linesIndices.length;
        }
        return this._linesIndexBuffer;
    };
    /**
     * Checks if the submesh intersects with a ray
     * @param ray defines the ray to test
     * @returns true is the passed ray intersects the submesh bounding box
     */
    SubMesh.prototype.canIntersects = function (ray) {
        var boundingInfo = this.getBoundingInfo();
        if (!boundingInfo) {
            return false;
        }
        return ray.intersectsBox(boundingInfo.boundingBox);
    };
    /**
     * Intersects current submesh with a ray
     * @param ray defines the ray to test
     * @param positions defines mesh's positions array
     * @param indices defines mesh's indices array
     * @param fastCheck defines if the first intersection will be used (and not the closest)
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns intersection info or null if no intersection
     */
    SubMesh.prototype.intersects = function (ray, positions, indices, fastCheck, trianglePredicate) {
        var material = this.getMaterial();
        if (!material) {
            return null;
        }
        var step = 3;
        var checkStopper = false;
        switch (material.fillMode) {
            case 3:
            case 4:
            case 5:
            case 6:
            case 8:
                return null;
            case 7:
                step = 1;
                checkStopper = true;
                break;
        }
        // LineMesh first as it's also a Mesh...
        if (this._mesh.getClassName() === "InstancedLinesMesh" || this._mesh.getClassName() === "LinesMesh") {
            // Check if mesh is unindexed
            if (!indices.length) {
                return this._intersectUnIndexedLines(ray, positions, indices, this._mesh.intersectionThreshold, fastCheck);
            }
            return this._intersectLines(ray, positions, indices, this._mesh.intersectionThreshold, fastCheck);
        }
        else {
            // Check if mesh is unindexed
            if (!indices.length && this._mesh._unIndexed) {
                return this._intersectUnIndexedTriangles(ray, positions, indices, fastCheck, trianglePredicate);
            }
            return this._intersectTriangles(ray, positions, indices, step, checkStopper, fastCheck, trianglePredicate);
        }
    };
    /** @hidden */
    SubMesh.prototype._intersectLines = function (ray, positions, indices, intersectionThreshold, fastCheck) {
        var intersectInfo = null;
        // Line test
        for (var index = this.indexStart; index < this.indexStart + this.indexCount; index += 2) {
            var p0 = positions[indices[index]];
            var p1 = positions[indices[index + 1]];
            var length = ray.intersectionSegment(p0, p1, intersectionThreshold);
            if (length < 0) {
                continue;
            }
            if (fastCheck || !intersectInfo || length < intersectInfo.distance) {
                intersectInfo = new IntersectionInfo(null, null, length);
                intersectInfo.faceId = index / 2;
                if (fastCheck) {
                    break;
                }
            }
        }
        return intersectInfo;
    };
    /** @hidden */
    SubMesh.prototype._intersectUnIndexedLines = function (ray, positions, indices, intersectionThreshold, fastCheck) {
        var intersectInfo = null;
        // Line test
        for (var index = this.verticesStart; index < this.verticesStart + this.verticesCount; index += 2) {
            var p0 = positions[index];
            var p1 = positions[index + 1];
            var length = ray.intersectionSegment(p0, p1, intersectionThreshold);
            if (length < 0) {
                continue;
            }
            if (fastCheck || !intersectInfo || length < intersectInfo.distance) {
                intersectInfo = new IntersectionInfo(null, null, length);
                intersectInfo.faceId = index / 2;
                if (fastCheck) {
                    break;
                }
            }
        }
        return intersectInfo;
    };
    /** @hidden */
    SubMesh.prototype._intersectTriangles = function (ray, positions, indices, step, checkStopper, fastCheck, trianglePredicate) {
        var intersectInfo = null;
        // Triangles test
        var faceID = -1;
        for (var index = this.indexStart; index < this.indexStart + this.indexCount; index += step) {
            faceID++;
            var indexA = indices[index];
            var indexB = indices[index + 1];
            var indexC = indices[index + 2];
            if (checkStopper && indexC === 0xFFFFFFFF) {
                index += 2;
                continue;
            }
            var p0 = positions[indexA];
            var p1 = positions[indexB];
            var p2 = positions[indexC];
            if (trianglePredicate && !trianglePredicate(p0, p1, p2, ray)) {
                continue;
            }
            var currentIntersectInfo = ray.intersectsTriangle(p0, p1, p2);
            if (currentIntersectInfo) {
                if (currentIntersectInfo.distance < 0) {
                    continue;
                }
                if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
                    intersectInfo = currentIntersectInfo;
                    intersectInfo.faceId = faceID;
                    if (fastCheck) {
                        break;
                    }
                }
            }
        }
        return intersectInfo;
    };
    /** @hidden */
    SubMesh.prototype._intersectUnIndexedTriangles = function (ray, positions, indices, fastCheck, trianglePredicate) {
        var intersectInfo = null;
        // Triangles test
        for (var index = this.verticesStart; index < this.verticesStart + this.verticesCount; index += 3) {
            var p0 = positions[index];
            var p1 = positions[index + 1];
            var p2 = positions[index + 2];
            if (trianglePredicate && !trianglePredicate(p0, p1, p2, ray)) {
                continue;
            }
            var currentIntersectInfo = ray.intersectsTriangle(p0, p1, p2);
            if (currentIntersectInfo) {
                if (currentIntersectInfo.distance < 0) {
                    continue;
                }
                if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
                    intersectInfo = currentIntersectInfo;
                    intersectInfo.faceId = index / 3;
                    if (fastCheck) {
                        break;
                    }
                }
            }
        }
        return intersectInfo;
    };
    /** @hidden */
    SubMesh.prototype._rebuild = function () {
        if (this._linesIndexBuffer) {
            this._linesIndexBuffer = null;
        }
    };
    // Clone
    /**
     * Creates a new submesh from the passed mesh
     * @param newMesh defines the new hosting mesh
     * @param newRenderingMesh defines an optional rendering mesh
     * @returns the new submesh
     */
    SubMesh.prototype.clone = function (newMesh, newRenderingMesh) {
        var result = new SubMesh(this.materialIndex, this.verticesStart, this.verticesCount, this.indexStart, this.indexCount, newMesh, newRenderingMesh, false);
        if (!this.IsGlobal) {
            var boundingInfo = this.getBoundingInfo();
            if (!boundingInfo) {
                return result;
            }
            result._boundingInfo = new BoundingInfo(boundingInfo.minimum, boundingInfo.maximum);
        }
        return result;
    };
    // Dispose
    /**
     * Release associated resources
     */
    SubMesh.prototype.dispose = function () {
        if (this._linesIndexBuffer) {
            this._mesh.getScene().getEngine()._releaseBuffer(this._linesIndexBuffer);
            this._linesIndexBuffer = null;
        }
        // Remove from mesh
        var index = this._mesh.subMeshes.indexOf(this);
        this._mesh.subMeshes.splice(index, 1);
    };
    /**
     * Gets the class name
     * @returns the string "SubMesh".
     */
    SubMesh.prototype.getClassName = function () {
        return "SubMesh";
    };
    // Statics
    /**
     * Creates a new submesh from indices data
     * @param materialIndex the index of the main mesh material
     * @param startIndex the index where to start the copy in the mesh indices array
     * @param indexCount the number of indices to copy then from the startIndex
     * @param mesh the main mesh to create the submesh from
     * @param renderingMesh the optional rendering mesh
     * @returns a new submesh
     */
    SubMesh.CreateFromIndices = function (materialIndex, startIndex, indexCount, mesh, renderingMesh) {
        var minVertexIndex = Number.MAX_VALUE;
        var maxVertexIndex = -Number.MAX_VALUE;
        var whatWillRender = (renderingMesh || mesh);
        var indices = whatWillRender.getIndices();
        for (var index = startIndex; index < startIndex + indexCount; index++) {
            var vertexIndex = indices[index];
            if (vertexIndex < minVertexIndex) {
                minVertexIndex = vertexIndex;
            }
            if (vertexIndex > maxVertexIndex) {
                maxVertexIndex = vertexIndex;
            }
        }
        return new SubMesh(materialIndex, minVertexIndex, maxVertexIndex - minVertexIndex + 1, startIndex, indexCount, mesh, renderingMesh);
    };
    return SubMesh;
}());

/**
 * Base class for the main features of a material in Babylon.js
 */
var Material = /** @class */ (function () {
    /**
     * Creates a material instance
     * @param name defines the name of the material
     * @param scene defines the scene to reference
     * @param doNotAdd specifies if the material should be added to the scene
     */
    function Material(name, scene, doNotAdd) {
        /**
         * Custom shadow depth material to use for shadow rendering instead of the in-built one
         */
        this.shadowDepthWrapper = null;
        /**
         * Gets or sets a boolean indicating that the material is allowed (if supported) to do shader hot swapping.
         * This means that the material can keep using a previous shader while a new one is being compiled.
         * This is mostly used when shader parallel compilation is supported (true by default)
         */
        this.allowShaderHotSwapping = true;
        /**
         * Gets or sets user defined metadata
         */
        this.metadata = null;
        /**
         * For internal use only. Please do not use.
         */
        this.reservedDataStore = null;
        /**
         * Specifies if the ready state should be checked on each call
         */
        this.checkReadyOnEveryCall = false;
        /**
         * Specifies if the ready state should be checked once
         */
        this.checkReadyOnlyOnce = false;
        /**
         * The state of the material
         */
        this.state = "";
        /**
         * The alpha value of the material
         */
        this._alpha = 1.0;
        /**
         * Specifies if back face culling is enabled
         */
        this._backFaceCulling = true;
        /**
         * Callback triggered when the material is compiled
         */
        this.onCompiled = null;
        /**
         * Callback triggered when an error occurs
         */
        this.onError = null;
        /**
         * Callback triggered to get the render target textures
         */
        this.getRenderTargetTextures = null;
        /**
         * Specifies if the material should be serialized
         */
        this.doNotSerialize = false;
        /**
         * @hidden
         */
        this._storeEffectOnSubMeshes = false;
        /**
         * Stores the animations for the material
         */
        this.animations = null;
        /**
        * An event triggered when the material is disposed
        */
        this.onDisposeObservable = new Observable();
        /**
         * An observer which watches for dispose events
         */
        this._onDisposeObserver = null;
        this._onUnBindObservable = null;
        /**
         * An observer which watches for bind events
         */
        this._onBindObserver = null;
        /**
         * Stores the value of the alpha mode
         */
        this._alphaMode = 2;
        /**
         * Stores the state of the need depth pre-pass value
         */
        this._needDepthPrePass = false;
        /**
         * Specifies if depth writing should be disabled
         */
        this.disableDepthWrite = false;
        /**
         * Specifies if color writing should be disabled
         */
        this.disableColorWrite = false;
        /**
         * Specifies if depth writing should be forced
         */
        this.forceDepthWrite = false;
        /**
         * Specifies the depth function that should be used. 0 means the default engine function
         */
        this.depthFunction = 0;
        /**
         * Specifies if there should be a separate pass for culling
         */
        this.separateCullingPass = false;
        /**
         * Stores the state specifing if fog should be enabled
         */
        this._fogEnabled = true;
        /**
         * Stores the size of points
         */
        this.pointSize = 1.0;
        /**
         * Stores the z offset value
         */
        this.zOffset = 0;
        /**
         * @hidden
         * Stores the effects for the material
         */
        this._effect = null;
        /**
         * Specifies if uniform buffers should be used
         */
        this._useUBO = false;
        /**
         * Stores the fill mode state
         */
        this._fillMode = Material.TriangleFillMode;
        /**
         * Specifies if the depth write state should be cached
         */
        this._cachedDepthWriteState = false;
        /**
         * Specifies if the color write state should be cached
         */
        this._cachedColorWriteState = false;
        /**
         * Specifies if the depth function state should be cached
         */
        this._cachedDepthFunctionState = 0;
        /** @hidden */
        this._indexInSceneMaterialArray = -1;
        /** @hidden */
        this.meshMap = null;
        /**
         * Enforces alpha test in opaque or blend mode in order to improve the performances of some situations.
         */
        this._forceAlphaTest = false;
        /**
         * The transparency mode of the material.
         */
        this._transparencyMode = null;
        this.name = name;
        var idSubscript = 1;
        this._scene = scene || EngineStore.LastCreatedScene;
        this.id = name || Tools.RandomId();
        while (this._scene.getMaterialByID(this.id)) {
            this.id = name + " " + idSubscript++;
        }
        this.uniqueId = this._scene.getUniqueId();
        if (this._scene.useRightHandedSystem) {
            this.sideOrientation = Material.ClockWiseSideOrientation;
        }
        else {
            this.sideOrientation = Material.CounterClockWiseSideOrientation;
        }
        this._uniformBuffer = new UniformBuffer(this._scene.getEngine());
        this._useUBO = this.getScene().getEngine().supportsUniformBuffers;
        if (!doNotAdd) {
            this._scene.addMaterial(this);
        }
        if (this._scene.useMaterialMeshMap) {
            this.meshMap = {};
        }
    }
    Object.defineProperty(Material.prototype, "canRenderToMRT", {
        /**
         * If the material can be rendered to several textures with MRT extension
         */
        get: function () {
            // By default, shaders are not compatible with MRTs
            // Base classes should override that if their shader supports MRT
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "alpha", {
        /**
         * Gets the alpha value of the material
         */
        get: function () {
            return this._alpha;
        },
        /**
         * Sets the alpha value of the material
         */
        set: function (value) {
            if (this._alpha === value) {
                return;
            }
            this._alpha = value;
            this.markAsDirty(Material.MiscDirtyFlag);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "backFaceCulling", {
        /**
         * Gets the back-face culling state
         */
        get: function () {
            return this._backFaceCulling;
        },
        /**
         * Sets the back-face culling state
         */
        set: function (value) {
            if (this._backFaceCulling === value) {
                return;
            }
            this._backFaceCulling = value;
            this.markAsDirty(Material.TextureDirtyFlag);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "hasRenderTargetTextures", {
        /**
         * Gets a boolean indicating that current material needs to register RTT
         */
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "onDispose", {
        /**
         * Called during a dispose event
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
    Object.defineProperty(Material.prototype, "onBindObservable", {
        /**
        * An event triggered when the material is bound
        */
        get: function () {
            if (!this._onBindObservable) {
                this._onBindObservable = new Observable();
            }
            return this._onBindObservable;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "onBind", {
        /**
         * Called during a bind event
         */
        set: function (callback) {
            if (this._onBindObserver) {
                this.onBindObservable.remove(this._onBindObserver);
            }
            this._onBindObserver = this.onBindObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "onUnBindObservable", {
        /**
        * An event triggered when the material is unbound
        */
        get: function () {
            if (!this._onUnBindObservable) {
                this._onUnBindObservable = new Observable();
            }
            return this._onUnBindObservable;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "onEffectCreatedObservable", {
        /**
        * An event triggered when the effect is (re)created
        */
        get: function () {
            if (!this._onEffectCreatedObservable) {
                this._onEffectCreatedObservable = new Observable();
            }
            return this._onEffectCreatedObservable;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "alphaMode", {
        /**
         * Gets the value of the alpha mode
         */
        get: function () {
            return this._alphaMode;
        },
        /**
         * Sets the value of the alpha mode.
         *
         * | Value | Type | Description |
         * | --- | --- | --- |
         * | 0 | ALPHA_DISABLE |   |
         * | 1 | ALPHA_ADD |   |
         * | 2 | ALPHA_COMBINE |   |
         * | 3 | ALPHA_SUBTRACT |   |
         * | 4 | ALPHA_MULTIPLY |   |
         * | 5 | ALPHA_MAXIMIZED |   |
         * | 6 | ALPHA_ONEONE |   |
         * | 7 | ALPHA_PREMULTIPLIED |   |
         * | 8 | ALPHA_PREMULTIPLIED_PORTERDUFF |   |
         * | 9 | ALPHA_INTERPOLATE |   |
         * | 10 | ALPHA_SCREENMODE |   |
         *
         */
        set: function (value) {
            if (this._alphaMode === value) {
                return;
            }
            this._alphaMode = value;
            this.markAsDirty(Material.TextureDirtyFlag);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "needDepthPrePass", {
        /**
         * Gets the depth pre-pass value
         */
        get: function () {
            return this._needDepthPrePass;
        },
        /**
         * Sets the need depth pre-pass value
         */
        set: function (value) {
            if (this._needDepthPrePass === value) {
                return;
            }
            this._needDepthPrePass = value;
            if (this._needDepthPrePass) {
                this.checkReadyOnEveryCall = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "fogEnabled", {
        /**
         * Gets the value of the fog enabled state
         */
        get: function () {
            return this._fogEnabled;
        },
        /**
         * Sets the state for enabling fog
         */
        set: function (value) {
            if (this._fogEnabled === value) {
                return;
            }
            this._fogEnabled = value;
            this.markAsDirty(Material.MiscDirtyFlag);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "wireframe", {
        get: function () {
            switch (this._fillMode) {
                case Material.WireFrameFillMode:
                case Material.LineListDrawMode:
                case Material.LineLoopDrawMode:
                case Material.LineStripDrawMode:
                    return true;
            }
            return this._scene.forceWireframe;
        },
        /**
         * Sets the state of wireframe mode
         */
        set: function (value) {
            this.fillMode = (value ? Material.WireFrameFillMode : Material.TriangleFillMode);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "pointsCloud", {
        /**
         * Gets the value specifying if point clouds are enabled
         */
        get: function () {
            switch (this._fillMode) {
                case Material.PointFillMode:
                case Material.PointListDrawMode:
                    return true;
            }
            return this._scene.forcePointsCloud;
        },
        /**
         * Sets the state of point cloud mode
         */
        set: function (value) {
            this.fillMode = (value ? Material.PointFillMode : Material.TriangleFillMode);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "fillMode", {
        /**
         * Gets the material fill mode
         */
        get: function () {
            return this._fillMode;
        },
        /**
         * Sets the material fill mode
         */
        set: function (value) {
            if (this._fillMode === value) {
                return;
            }
            this._fillMode = value;
            this.markAsDirty(Material.MiscDirtyFlag);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a string representation of the current material
     * @param fullDetails defines a boolean indicating which levels of logging is desired
     * @returns a string with material information
     */
    Material.prototype.toString = function (fullDetails) {
        var ret = "Name: " + this.name;
        return ret;
    };
    /**
     * Gets the class name of the material
     * @returns a string with the class name of the material
     */
    Material.prototype.getClassName = function () {
        return "Material";
    };
    Object.defineProperty(Material.prototype, "isFrozen", {
        /**
         * Specifies if updates for the material been locked
         */
        get: function () {
            return this.checkReadyOnlyOnce;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Locks updates for the material
     */
    Material.prototype.freeze = function () {
        this.markDirty();
        this.checkReadyOnlyOnce = true;
    };
    /**
     * Unlocks updates for the material
     */
    Material.prototype.unfreeze = function () {
        this.markDirty();
        this.checkReadyOnlyOnce = false;
    };
    /**
     * Specifies if the material is ready to be used
     * @param mesh defines the mesh to check
     * @param useInstances specifies if instances should be used
     * @returns a boolean indicating if the material is ready to be used
     */
    Material.prototype.isReady = function (mesh, useInstances) {
        return true;
    };
    /**
     * Specifies that the submesh is ready to be used
     * @param mesh defines the mesh to check
     * @param subMesh defines which submesh to check
     * @param useInstances specifies that instances should be used
     * @returns a boolean indicating that the submesh is ready or not
     */
    Material.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
        return false;
    };
    /**
     * Returns the material effect
     * @returns the effect associated with the material
     */
    Material.prototype.getEffect = function () {
        return this._effect;
    };
    /**
     * Returns the current scene
     * @returns a Scene
     */
    Material.prototype.getScene = function () {
        return this._scene;
    };
    Object.defineProperty(Material.prototype, "transparencyMode", {
        /**
         * Gets the current transparency mode.
         */
        get: function () {
            return this._transparencyMode;
        },
        /**
         * Sets the transparency mode of the material.
         *
         * | Value | Type                                | Description |
         * | ----- | ----------------------------------- | ----------- |
         * | 0     | OPAQUE                              |             |
         * | 1     | ALPHATEST                           |             |
         * | 2     | ALPHABLEND                          |             |
         * | 3     | ALPHATESTANDBLEND                   |             |
         *
         */
        set: function (value) {
            if (this._transparencyMode === value) {
                return;
            }
            this._transparencyMode = value;
            this._forceAlphaTest = (value === Material.MATERIAL_ALPHATESTANDBLEND);
            this._markAllSubMeshesAsTexturesAndMiscDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "_disableAlphaBlending", {
        /**
         * Returns true if alpha blending should be disabled.
         */
        get: function () {
            return (this._transparencyMode === Material.MATERIAL_OPAQUE ||
                this._transparencyMode === Material.MATERIAL_ALPHATEST);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Specifies whether or not this material should be rendered in alpha blend mode.
     * @returns a boolean specifying if alpha blending is needed
     */
    Material.prototype.needAlphaBlending = function () {
        if (this._disableAlphaBlending) {
            return false;
        }
        return (this.alpha < 1.0);
    };
    /**
     * Specifies if the mesh will require alpha blending
     * @param mesh defines the mesh to check
     * @returns a boolean specifying if alpha blending is needed for the mesh
     */
    Material.prototype.needAlphaBlendingForMesh = function (mesh) {
        if (this._disableAlphaBlending && mesh.visibility >= 1.0) {
            return false;
        }
        return this.needAlphaBlending() || (mesh.visibility < 1.0) || mesh.hasVertexAlpha;
    };
    /**
     * Specifies whether or not this material should be rendered in alpha test mode.
     * @returns a boolean specifying if an alpha test is needed.
     */
    Material.prototype.needAlphaTesting = function () {
        if (this._forceAlphaTest) {
            return true;
        }
        return false;
    };
    /**
     * Specifies if material alpha testing should be turned on for the mesh
     * @param mesh defines the mesh to check
     */
    Material.prototype._shouldTurnAlphaTestOn = function (mesh) {
        return (!this.needAlphaBlendingForMesh(mesh) && this.needAlphaTesting());
    };
    /**
     * Gets the texture used for the alpha test
     * @returns the texture to use for alpha testing
     */
    Material.prototype.getAlphaTestTexture = function () {
        return null;
    };
    /**
     * Marks the material to indicate that it needs to be re-calculated
     */
    Material.prototype.markDirty = function () {
        var meshes = this.getScene().meshes;
        for (var _i = 0, meshes_1 = meshes; _i < meshes_1.length; _i++) {
            var mesh = meshes_1[_i];
            if (!mesh.subMeshes) {
                continue;
            }
            for (var _a = 0, _b = mesh.subMeshes; _a < _b.length; _a++) {
                var subMesh = _b[_a];
                if (subMesh.getMaterial() !== this) {
                    continue;
                }
                if (!subMesh.effect) {
                    continue;
                }
                subMesh.effect._wasPreviouslyReady = false;
            }
        }
    };
    /** @hidden */
    Material.prototype._preBind = function (effect, overrideOrientation) {
        if (overrideOrientation === void 0) { overrideOrientation = null; }
        var engine = this._scene.getEngine();
        var orientation = (overrideOrientation == null) ? this.sideOrientation : overrideOrientation;
        var reverse = orientation === Material.ClockWiseSideOrientation;
        engine.enableEffect(effect ? effect : this._effect);
        engine.setState(this.backFaceCulling, this.zOffset, false, reverse);
        return reverse;
    };
    /**
     * Binds the material to the mesh
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh to bind the material to
     */
    Material.prototype.bind = function (world, mesh) {
    };
    /**
     * Binds the submesh to the material
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh containing the submesh
     * @param subMesh defines the submesh to bind the material to
     */
    Material.prototype.bindForSubMesh = function (world, mesh, subMesh) {
    };
    /**
     * Binds the world matrix to the material
     * @param world defines the world transformation matrix
     */
    Material.prototype.bindOnlyWorldMatrix = function (world) {
    };
    /**
     * Binds the scene's uniform buffer to the effect.
     * @param effect defines the effect to bind to the scene uniform buffer
     * @param sceneUbo defines the uniform buffer storing scene data
     */
    Material.prototype.bindSceneUniformBuffer = function (effect, sceneUbo) {
        sceneUbo.bindToEffect(effect, "Scene");
    };
    /**
     * Binds the view matrix to the effect
     * @param effect defines the effect to bind the view matrix to
     */
    Material.prototype.bindView = function (effect) {
        if (!this._useUBO) {
            effect.setMatrix("view", this.getScene().getViewMatrix());
        }
        else {
            this.bindSceneUniformBuffer(effect, this.getScene().getSceneUniformBuffer());
        }
    };
    /**
     * Binds the view projection matrix to the effect
     * @param effect defines the effect to bind the view projection matrix to
     */
    Material.prototype.bindViewProjection = function (effect) {
        if (!this._useUBO) {
            effect.setMatrix("viewProjection", this.getScene().getTransformMatrix());
        }
        else {
            this.bindSceneUniformBuffer(effect, this.getScene().getSceneUniformBuffer());
        }
    };
    /**
     * Processes to execute after binding the material to a mesh
     * @param mesh defines the rendered mesh
     */
    Material.prototype._afterBind = function (mesh) {
        this._scene._cachedMaterial = this;
        if (mesh) {
            this._scene._cachedVisibility = mesh.visibility;
        }
        else {
            this._scene._cachedVisibility = 1;
        }
        if (this._onBindObservable && mesh) {
            this._onBindObservable.notifyObservers(mesh);
        }
        if (this.disableDepthWrite) {
            var engine = this._scene.getEngine();
            this._cachedDepthWriteState = engine.getDepthWrite();
            engine.setDepthWrite(false);
        }
        if (this.disableColorWrite) {
            var engine = this._scene.getEngine();
            this._cachedColorWriteState = engine.getColorWrite();
            engine.setColorWrite(false);
        }
        if (this.depthFunction !== 0) {
            var engine = this._scene.getEngine();
            this._cachedDepthFunctionState = engine.getDepthFunction() || 0;
            engine.setDepthFunction(this.depthFunction);
        }
    };
    /**
     * Unbinds the material from the mesh
     */
    Material.prototype.unbind = function () {
        if (this._onUnBindObservable) {
            this._onUnBindObservable.notifyObservers(this);
        }
        if (this.depthFunction !== 0) {
            var engine = this._scene.getEngine();
            engine.setDepthFunction(this._cachedDepthFunctionState);
        }
        if (this.disableDepthWrite) {
            var engine = this._scene.getEngine();
            engine.setDepthWrite(this._cachedDepthWriteState);
        }
        if (this.disableColorWrite) {
            var engine = this._scene.getEngine();
            engine.setColorWrite(this._cachedColorWriteState);
        }
    };
    /**
     * Gets the active textures from the material
     * @returns an array of textures
     */
    Material.prototype.getActiveTextures = function () {
        return [];
    };
    /**
     * Specifies if the material uses a texture
     * @param texture defines the texture to check against the material
     * @returns a boolean specifying if the material uses the texture
     */
    Material.prototype.hasTexture = function (texture) {
        return false;
    };
    /**
     * Makes a duplicate of the material, and gives it a new name
     * @param name defines the new name for the duplicated material
     * @returns the cloned material
     */
    Material.prototype.clone = function (name) {
        return null;
    };
    /**
     * Gets the meshes bound to the material
     * @returns an array of meshes bound to the material
     */
    Material.prototype.getBindedMeshes = function () {
        var _this = this;
        if (this.meshMap) {
            var result = new Array();
            for (var meshId in this.meshMap) {
                var mesh = this.meshMap[meshId];
                if (mesh) {
                    result.push(mesh);
                }
            }
            return result;
        }
        else {
            var meshes = this._scene.meshes;
            return meshes.filter(function (mesh) { return mesh.material === _this; });
        }
    };
    /**
     * Force shader compilation
     * @param mesh defines the mesh associated with this material
     * @param onCompiled defines a function to execute once the material is compiled
     * @param options defines the options to configure the compilation
     * @param onError defines a function to execute if the material fails compiling
     */
    Material.prototype.forceCompilation = function (mesh, onCompiled, options, onError) {
        var _this = this;
        var localOptions = __assign({ clipPlane: false, useInstances: false }, options);
        var scene = this.getScene();
        var currentHotSwapingState = this.allowShaderHotSwapping;
        this.allowShaderHotSwapping = false; // Turned off to let us evaluate the real compilation state
        var checkReady = function () {
            if (!_this._scene || !_this._scene.getEngine()) {
                return;
            }
            var clipPlaneState = scene.clipPlane;
            if (localOptions.clipPlane) {
                scene.clipPlane = new Plane(0, 0, 0, 1);
            }
            if (_this._storeEffectOnSubMeshes) {
                var allDone = true, lastError = null;
                if (mesh.subMeshes) {
                    var tempSubMesh = new SubMesh(0, 0, 0, 0, 0, mesh, undefined, false, false);
                    if (tempSubMesh._materialDefines) {
                        tempSubMesh._materialDefines._renderId = -1;
                    }
                    if (!_this.isReadyForSubMesh(mesh, tempSubMesh, localOptions.useInstances)) {
                        if (tempSubMesh.effect && tempSubMesh.effect.getCompilationError() && tempSubMesh.effect.allFallbacksProcessed()) {
                            lastError = tempSubMesh.effect.getCompilationError();
                        }
                        else {
                            allDone = false;
                            setTimeout(checkReady, 16);
                        }
                    }
                }
                if (allDone) {
                    _this.allowShaderHotSwapping = currentHotSwapingState;
                    if (lastError) {
                        if (onError) {
                            onError(lastError);
                        }
                    }
                    if (onCompiled) {
                        onCompiled(_this);
                    }
                }
            }
            else {
                if (_this.isReady()) {
                    _this.allowShaderHotSwapping = currentHotSwapingState;
                    if (onCompiled) {
                        onCompiled(_this);
                    }
                }
                else {
                    setTimeout(checkReady, 16);
                }
            }
            if (localOptions.clipPlane) {
                scene.clipPlane = clipPlaneState;
            }
        };
        checkReady();
    };
    /**
     * Force shader compilation
     * @param mesh defines the mesh that will use this material
     * @param options defines additional options for compiling the shaders
     * @returns a promise that resolves when the compilation completes
     */
    Material.prototype.forceCompilationAsync = function (mesh, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.forceCompilation(mesh, function () {
                resolve();
            }, options, function (reason) {
                reject(reason);
            });
        });
    };
    /**
     * Marks a define in the material to indicate that it needs to be re-computed
     * @param flag defines a flag used to determine which parts of the material have to be marked as dirty
     */
    Material.prototype.markAsDirty = function (flag) {
        if (this.getScene().blockMaterialDirtyMechanism) {
            return;
        }
        Material._DirtyCallbackArray.length = 0;
        if (flag & Material.TextureDirtyFlag) {
            Material._DirtyCallbackArray.push(Material._TextureDirtyCallBack);
        }
        if (flag & Material.LightDirtyFlag) {
            Material._DirtyCallbackArray.push(Material._LightsDirtyCallBack);
        }
        if (flag & Material.FresnelDirtyFlag) {
            Material._DirtyCallbackArray.push(Material._FresnelDirtyCallBack);
        }
        if (flag & Material.AttributesDirtyFlag) {
            Material._DirtyCallbackArray.push(Material._AttributeDirtyCallBack);
        }
        if (flag & Material.MiscDirtyFlag) {
            Material._DirtyCallbackArray.push(Material._MiscDirtyCallBack);
        }
        if (flag & Material.PrePassDirtyFlag) {
            Material._DirtyCallbackArray.push(Material._PrePassDirtyCallBack);
        }
        if (Material._DirtyCallbackArray.length) {
            this._markAllSubMeshesAsDirty(Material._RunDirtyCallBacks);
        }
        this.getScene().resetCachedMaterial();
    };
    /**
     * Marks all submeshes of a material to indicate that their material defines need to be re-calculated
     * @param func defines a function which checks material defines against the submeshes
     */
    Material.prototype._markAllSubMeshesAsDirty = function (func) {
        if (this.getScene().blockMaterialDirtyMechanism) {
            return;
        }
        var meshes = this.getScene().meshes;
        for (var _i = 0, meshes_2 = meshes; _i < meshes_2.length; _i++) {
            var mesh = meshes_2[_i];
            if (!mesh.subMeshes) {
                continue;
            }
            for (var _a = 0, _b = mesh.subMeshes; _a < _b.length; _a++) {
                var subMesh = _b[_a];
                if (subMesh.getMaterial() !== this) {
                    continue;
                }
                if (!subMesh._materialDefines) {
                    continue;
                }
                func(subMesh._materialDefines);
            }
        }
    };
    /**
     * Indicates that the scene should check if the rendering now needs a prepass
     */
    Material.prototype._markScenePrePassDirty = function () {
        if (this.getScene().blockMaterialDirtyMechanism) {
            return;
        }
        var prePassRenderer = this.getScene().enablePrePassRenderer();
        if (prePassRenderer) {
            prePassRenderer.markAsDirty();
        }
    };
    /**
     * Indicates that we need to re-calculated for all submeshes
     */
    Material.prototype._markAllSubMeshesAsAllDirty = function () {
        this._markAllSubMeshesAsDirty(Material._AllDirtyCallBack);
    };
    /**
     * Indicates that image processing needs to be re-calculated for all submeshes
     */
    Material.prototype._markAllSubMeshesAsImageProcessingDirty = function () {
        this._markAllSubMeshesAsDirty(Material._ImageProcessingDirtyCallBack);
    };
    /**
     * Indicates that textures need to be re-calculated for all submeshes
     */
    Material.prototype._markAllSubMeshesAsTexturesDirty = function () {
        this._markAllSubMeshesAsDirty(Material._TextureDirtyCallBack);
    };
    /**
     * Indicates that fresnel needs to be re-calculated for all submeshes
     */
    Material.prototype._markAllSubMeshesAsFresnelDirty = function () {
        this._markAllSubMeshesAsDirty(Material._FresnelDirtyCallBack);
    };
    /**
     * Indicates that fresnel and misc need to be re-calculated for all submeshes
     */
    Material.prototype._markAllSubMeshesAsFresnelAndMiscDirty = function () {
        this._markAllSubMeshesAsDirty(Material._FresnelAndMiscDirtyCallBack);
    };
    /**
     * Indicates that lights need to be re-calculated for all submeshes
     */
    Material.prototype._markAllSubMeshesAsLightsDirty = function () {
        this._markAllSubMeshesAsDirty(Material._LightsDirtyCallBack);
    };
    /**
     * Indicates that attributes need to be re-calculated for all submeshes
     */
    Material.prototype._markAllSubMeshesAsAttributesDirty = function () {
        this._markAllSubMeshesAsDirty(Material._AttributeDirtyCallBack);
    };
    /**
     * Indicates that misc needs to be re-calculated for all submeshes
     */
    Material.prototype._markAllSubMeshesAsMiscDirty = function () {
        this._markAllSubMeshesAsDirty(Material._MiscDirtyCallBack);
    };
    /**
     * Indicates that prepass needs to be re-calculated for all submeshes
     */
    Material.prototype._markAllSubMeshesAsPrePassDirty = function () {
        this._markAllSubMeshesAsDirty(Material._MiscDirtyCallBack);
    };
    /**
     * Indicates that textures and misc need to be re-calculated for all submeshes
     */
    Material.prototype._markAllSubMeshesAsTexturesAndMiscDirty = function () {
        this._markAllSubMeshesAsDirty(Material._TextureAndMiscDirtyCallBack);
    };
    /**
     * Sets the required values to the prepass renderer.
     * @param prePassRenderer defines the prepass renderer to setup.
     * @returns true if the pre pass is needed.
     */
    Material.prototype.setPrePassRenderer = function (prePassRenderer) {
        // Do Nothing by default
        return false;
    };
    /**
     * Disposes the material
     * @param forceDisposeEffect specifies if effects should be forcefully disposed
     * @param forceDisposeTextures specifies if textures should be forcefully disposed
     * @param notBoundToMesh specifies if the material that is being disposed is known to be not bound to any mesh
     */
    Material.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures, notBoundToMesh) {
        var scene = this.getScene();
        // Animations
        scene.stopAnimation(this);
        scene.freeProcessedMaterials();
        // Remove from scene
        scene.removeMaterial(this);
        if (notBoundToMesh !== true) {
            // Remove from meshes
            if (this.meshMap) {
                for (var meshId in this.meshMap) {
                    var mesh = this.meshMap[meshId];
                    if (mesh) {
                        mesh.material = null; // will set the entry in the map to undefined
                        this.releaseVertexArrayObject(mesh, forceDisposeEffect);
                    }
                }
            }
            else {
                var meshes = scene.meshes;
                for (var _i = 0, meshes_3 = meshes; _i < meshes_3.length; _i++) {
                    var mesh = meshes_3[_i];
                    if (mesh.material === this && !mesh.sourceMesh) {
                        mesh.material = null;
                        this.releaseVertexArrayObject(mesh, forceDisposeEffect);
                    }
                }
            }
        }
        this._uniformBuffer.dispose();
        // Shader are kept in cache for further use but we can get rid of this by using forceDisposeEffect
        if (forceDisposeEffect && this._effect) {
            if (!this._storeEffectOnSubMeshes) {
                this._effect.dispose();
            }
            this._effect = null;
        }
        // Callback
        this.onDisposeObservable.notifyObservers(this);
        this.onDisposeObservable.clear();
        if (this._onBindObservable) {
            this._onBindObservable.clear();
        }
        if (this._onUnBindObservable) {
            this._onUnBindObservable.clear();
        }
        if (this._onEffectCreatedObservable) {
            this._onEffectCreatedObservable.clear();
        }
    };
    /** @hidden */
    Material.prototype.releaseVertexArrayObject = function (mesh, forceDisposeEffect) {
        if (mesh.geometry) {
            var geometry = (mesh.geometry);
            if (this._storeEffectOnSubMeshes) {
                for (var _i = 0, _a = mesh.subMeshes; _i < _a.length; _i++) {
                    var subMesh = _a[_i];
                    geometry._releaseVertexArrayObject(subMesh._materialEffect);
                    if (forceDisposeEffect && subMesh._materialEffect) {
                        subMesh._materialEffect.dispose();
                    }
                }
            }
            else {
                geometry._releaseVertexArrayObject(this._effect);
            }
        }
    };
    /**
     * Serializes this material
     * @returns the serialized material object
     */
    Material.prototype.serialize = function () {
        return SerializationHelper.Serialize(this);
    };
    /**
     * Creates a material from parsed material data
     * @param parsedMaterial defines parsed material data
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures
     * @returns a new material
     */
    Material.Parse = function (parsedMaterial, scene, rootUrl) {
        if (!parsedMaterial.customType) {
            parsedMaterial.customType = "BABYLON.StandardMaterial";
        }
        else if (parsedMaterial.customType === "BABYLON.PBRMaterial" && parsedMaterial.overloadedAlbedo) {
            parsedMaterial.customType = "BABYLON.LegacyPBRMaterial";
            if (!BABYLON.LegacyPBRMaterial) {
                Logger.Error("Your scene is trying to load a legacy version of the PBRMaterial, please, include it from the materials library.");
                return null;
            }
        }
        var materialType = Tools.Instantiate(parsedMaterial.customType);
        return materialType.Parse(parsedMaterial, scene, rootUrl);
    };
    /**
     * Returns the triangle fill mode
     */
    Material.TriangleFillMode = 0;
    /**
     * Returns the wireframe mode
     */
    Material.WireFrameFillMode = 1;
    /**
     * Returns the point fill mode
     */
    Material.PointFillMode = 2;
    /**
     * Returns the point list draw mode
     */
    Material.PointListDrawMode = 3;
    /**
     * Returns the line list draw mode
     */
    Material.LineListDrawMode = 4;
    /**
     * Returns the line loop draw mode
     */
    Material.LineLoopDrawMode = 5;
    /**
     * Returns the line strip draw mode
     */
    Material.LineStripDrawMode = 6;
    /**
     * Returns the triangle strip draw mode
     */
    Material.TriangleStripDrawMode = 7;
    /**
     * Returns the triangle fan draw mode
     */
    Material.TriangleFanDrawMode = 8;
    /**
     * Stores the clock-wise side orientation
     */
    Material.ClockWiseSideOrientation = 0;
    /**
     * Stores the counter clock-wise side orientation
     */
    Material.CounterClockWiseSideOrientation = 1;
    /**
     * The dirty texture flag value
     */
    Material.TextureDirtyFlag = 1;
    /**
     * The dirty light flag value
     */
    Material.LightDirtyFlag = 2;
    /**
     * The dirty fresnel flag value
     */
    Material.FresnelDirtyFlag = 4;
    /**
     * The dirty attribute flag value
     */
    Material.AttributesDirtyFlag = 8;
    /**
     * The dirty misc flag value
     */
    Material.MiscDirtyFlag = 16;
    /**
     * The dirty prepass flag value
     */
    Material.PrePassDirtyFlag = 32;
    /**
     * The all dirty flag value
     */
    Material.AllDirtyFlag = 63;
    /**
     * MaterialTransparencyMode: No transparency mode, Alpha channel is not use.
     */
    Material.MATERIAL_OPAQUE = 0;
    /**
     * MaterialTransparencyMode: Alpha Test mode, pixel are discarded below a certain threshold defined by the alpha cutoff value.
     */
    Material.MATERIAL_ALPHATEST = 1;
    /**
     * MaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
     */
    Material.MATERIAL_ALPHABLEND = 2;
    /**
     * MaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
     * They are also discarded below the alpha cutoff threshold to improve performances.
     */
    Material.MATERIAL_ALPHATESTANDBLEND = 3;
    /**
     * The Whiteout method is used to blend normals.
     * Details of the algorithm can be found here: https://blog.selfshadow.com/publications/blending-in-detail/
     */
    Material.MATERIAL_NORMALBLENDMETHOD_WHITEOUT = 0;
    /**
     * The Reoriented Normal Mapping method is used to blend normals.
     * Details of the algorithm can be found here: https://blog.selfshadow.com/publications/blending-in-detail/
     */
    Material.MATERIAL_NORMALBLENDMETHOD_RNM = 1;
    Material._AllDirtyCallBack = function (defines) { return defines.markAllAsDirty(); };
    Material._ImageProcessingDirtyCallBack = function (defines) { return defines.markAsImageProcessingDirty(); };
    Material._TextureDirtyCallBack = function (defines) { return defines.markAsTexturesDirty(); };
    Material._FresnelDirtyCallBack = function (defines) { return defines.markAsFresnelDirty(); };
    Material._MiscDirtyCallBack = function (defines) { return defines.markAsMiscDirty(); };
    Material._PrePassDirtyCallBack = function (defines) { return defines.markAsPrePassDirty(); };
    Material._LightsDirtyCallBack = function (defines) { return defines.markAsLightDirty(); };
    Material._AttributeDirtyCallBack = function (defines) { return defines.markAsAttributesDirty(); };
    Material._FresnelAndMiscDirtyCallBack = function (defines) {
        Material._FresnelDirtyCallBack(defines);
        Material._MiscDirtyCallBack(defines);
    };
    Material._TextureAndMiscDirtyCallBack = function (defines) {
        Material._TextureDirtyCallBack(defines);
        Material._MiscDirtyCallBack(defines);
    };
    Material._DirtyCallbackArray = [];
    Material._RunDirtyCallBacks = function (defines) {
        for (var _i = 0, _a = Material._DirtyCallbackArray; _i < _a.length; _i++) {
            var cb = _a[_i];
            cb(defines);
        }
    };
    __decorate([
        serialize()
    ], Material.prototype, "id", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "uniqueId", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "name", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "checkReadyOnEveryCall", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "checkReadyOnlyOnce", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "state", void 0);
    __decorate([
        serialize("alpha")
    ], Material.prototype, "_alpha", void 0);
    __decorate([
        serialize("backFaceCulling")
    ], Material.prototype, "_backFaceCulling", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "sideOrientation", void 0);
    __decorate([
        serialize("alphaMode")
    ], Material.prototype, "_alphaMode", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "_needDepthPrePass", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "disableDepthWrite", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "disableColorWrite", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "forceDepthWrite", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "depthFunction", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "separateCullingPass", void 0);
    __decorate([
        serialize("fogEnabled")
    ], Material.prototype, "_fogEnabled", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "pointSize", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "zOffset", void 0);
    __decorate([
        serialize()
    ], Material.prototype, "pointsCloud", null);
    __decorate([
        serialize()
    ], Material.prototype, "fillMode", null);
    __decorate([
        serialize()
    ], Material.prototype, "transparencyMode", null);
    return Material;
}());

/**
 * Groups all the scene component constants in one place to ease maintenance.
 * @hidden
 */
var SceneComponentConstants = /** @class */ (function () {
    function SceneComponentConstants() {
    }
    SceneComponentConstants.NAME_EFFECTLAYER = "EffectLayer";
    SceneComponentConstants.NAME_LAYER = "Layer";
    SceneComponentConstants.NAME_LENSFLARESYSTEM = "LensFlareSystem";
    SceneComponentConstants.NAME_BOUNDINGBOXRENDERER = "BoundingBoxRenderer";
    SceneComponentConstants.NAME_PARTICLESYSTEM = "ParticleSystem";
    SceneComponentConstants.NAME_GAMEPAD = "Gamepad";
    SceneComponentConstants.NAME_SIMPLIFICATIONQUEUE = "SimplificationQueue";
    SceneComponentConstants.NAME_GEOMETRYBUFFERRENDERER = "GeometryBufferRenderer";
    SceneComponentConstants.NAME_PREPASSRENDERER = "PrePassRenderer";
    SceneComponentConstants.NAME_DEPTHRENDERER = "DepthRenderer";
    SceneComponentConstants.NAME_POSTPROCESSRENDERPIPELINEMANAGER = "PostProcessRenderPipelineManager";
    SceneComponentConstants.NAME_SPRITE = "Sprite";
    SceneComponentConstants.NAME_SUBSURFACE = "SubSurface";
    SceneComponentConstants.NAME_OUTLINERENDERER = "Outline";
    SceneComponentConstants.NAME_PROCEDURALTEXTURE = "ProceduralTexture";
    SceneComponentConstants.NAME_SHADOWGENERATOR = "ShadowGenerator";
    SceneComponentConstants.NAME_OCTREE = "Octree";
    SceneComponentConstants.NAME_PHYSICSENGINE = "PhysicsEngine";
    SceneComponentConstants.NAME_AUDIO = "Audio";
    SceneComponentConstants.STEP_ISREADYFORMESH_EFFECTLAYER = 0;
    SceneComponentConstants.STEP_BEFOREEVALUATEACTIVEMESH_BOUNDINGBOXRENDERER = 0;
    SceneComponentConstants.STEP_EVALUATESUBMESH_BOUNDINGBOXRENDERER = 0;
    SceneComponentConstants.STEP_PREACTIVEMESH_BOUNDINGBOXRENDERER = 0;
    SceneComponentConstants.STEP_CAMERADRAWRENDERTARGET_EFFECTLAYER = 1;
    SceneComponentConstants.STEP_BEFORECAMERADRAW_EFFECTLAYER = 0;
    SceneComponentConstants.STEP_BEFORECAMERADRAW_LAYER = 1;
    SceneComponentConstants.STEP_BEFORECAMERADRAW_PREPASS = 2;
    SceneComponentConstants.STEP_BEFORERENDERTARGETDRAW_LAYER = 0;
    SceneComponentConstants.STEP_BEFORERENDERINGMESH_PREPASS = 0;
    SceneComponentConstants.STEP_BEFORERENDERINGMESH_OUTLINE = 1;
    SceneComponentConstants.STEP_AFTERRENDERINGMESH_PREPASS = 0;
    SceneComponentConstants.STEP_AFTERRENDERINGMESH_OUTLINE = 1;
    SceneComponentConstants.STEP_AFTERRENDERINGGROUPDRAW_EFFECTLAYER_DRAW = 0;
    SceneComponentConstants.STEP_AFTERRENDERINGGROUPDRAW_BOUNDINGBOXRENDERER = 1;
    SceneComponentConstants.STEP_BEFORECAMERAUPDATE_SIMPLIFICATIONQUEUE = 0;
    SceneComponentConstants.STEP_BEFORECAMERAUPDATE_GAMEPAD = 1;
    SceneComponentConstants.STEP_BEFORECLEAR_PROCEDURALTEXTURE = 0;
    SceneComponentConstants.STEP_AFTERRENDERTARGETDRAW_LAYER = 0;
    SceneComponentConstants.STEP_AFTERCAMERADRAW_EFFECTLAYER = 0;
    SceneComponentConstants.STEP_AFTERCAMERADRAW_LENSFLARESYSTEM = 1;
    SceneComponentConstants.STEP_AFTERCAMERADRAW_EFFECTLAYER_DRAW = 2;
    SceneComponentConstants.STEP_AFTERCAMERADRAW_LAYER = 3;
    SceneComponentConstants.STEP_AFTERCAMERADRAW_PREPASS = 4;
    SceneComponentConstants.STEP_AFTERRENDER_AUDIO = 0;
    SceneComponentConstants.STEP_GATHERRENDERTARGETS_DEPTHRENDERER = 0;
    SceneComponentConstants.STEP_GATHERRENDERTARGETS_GEOMETRYBUFFERRENDERER = 1;
    SceneComponentConstants.STEP_GATHERRENDERTARGETS_SHADOWGENERATOR = 2;
    SceneComponentConstants.STEP_GATHERRENDERTARGETS_POSTPROCESSRENDERPIPELINEMANAGER = 3;
    SceneComponentConstants.STEP_GATHERACTIVECAMERARENDERTARGETS_DEPTHRENDERER = 0;
    SceneComponentConstants.STEP_BEFORECLEARSTAGE_PREPASS = 0;
    SceneComponentConstants.STEP_POINTERMOVE_SPRITE = 0;
    SceneComponentConstants.STEP_POINTERDOWN_SPRITE = 0;
    SceneComponentConstants.STEP_POINTERUP_SPRITE = 0;
    return SceneComponentConstants;
}());
/**
 * Representation of a stage in the scene (Basically a list of ordered steps)
 * @hidden
 */
var Stage = /** @class */ (function (_super) {
    __extends(Stage, _super);
    /**
     * Hide ctor from the rest of the world.
     * @param items The items to add.
     */
    function Stage(items) {
        return _super.apply(this, items) || this;
    }
    /**
     * Creates a new Stage.
     * @returns A new instance of a Stage
     */
    Stage.Create = function () {
        return Object.create(Stage.prototype);
    };
    /**
     * Registers a step in an ordered way in the targeted stage.
     * @param index Defines the position to register the step in
     * @param component Defines the component attached to the step
     * @param action Defines the action to launch during the step
     */
    Stage.prototype.registerStep = function (index, component, action) {
        var i = 0;
        var maxIndex = Number.MAX_VALUE;
        for (; i < this.length; i++) {
            var step = this[i];
            maxIndex = step.index;
            if (index < maxIndex) {
                break;
            }
        }
        this.splice(i, 0, { index: index, component: component, action: action.bind(component) });
    };
    /**
     * Clears all the steps from the stage.
     */
    Stage.prototype.clear = function () {
        this.length = 0;
    };
    return Stage;
}(Array));

export { AbstractMesh as A, BoundingInfo as B, IntersectionInfo as I, Material as M, PickingInfo as P, Stage as S, TransformNode as T, VertexBuffer as V, _MeshCollisionData as _, SubMesh as a, VertexData as b, Buffer as c, SceneComponentConstants as d, extractMinAndMax as e, BoundingBox as f, BoundingSphere as g, extractMinAndMaxIndexed as h };
