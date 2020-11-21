import { _ as __extends, a as __decorate } from './thinEngine-e576a091.js';
import { s as serializeAsVector3, a as serialize, N as Node, d as serializeAsTexture } from './node-87d9c658.js';
import { V as Vector3, M as Matrix } from './math.color-fc6e801e.js';
import { A as Axis } from './math.axis-e7db27a6.js';
import { L as Light } from './light-a23926e9.js';
import { T as Texture } from './texture-6b1db4fe.js';

/**
 * Base implementation IShadowLight
 * It groups all the common behaviour in order to reduce dupplication and better follow the DRY pattern.
 */
var ShadowLight = /** @class */ (function (_super) {
    __extends(ShadowLight, _super);
    function ShadowLight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._needProjectionMatrixCompute = true;
        return _this;
    }
    ShadowLight.prototype._setPosition = function (value) {
        this._position = value;
    };
    Object.defineProperty(ShadowLight.prototype, "position", {
        /**
         * Sets the position the shadow will be casted from. Also use as the light position for both
         * point and spot lights.
         */
        get: function () {
            return this._position;
        },
        /**
         * Sets the position the shadow will be casted from. Also use as the light position for both
         * point and spot lights.
         */
        set: function (value) {
            this._setPosition(value);
        },
        enumerable: false,
        configurable: true
    });
    ShadowLight.prototype._setDirection = function (value) {
        this._direction = value;
    };
    Object.defineProperty(ShadowLight.prototype, "direction", {
        /**
         * In 2d mode (needCube being false), gets the direction used to cast the shadow.
         * Also use as the light direction on spot and directional lights.
         */
        get: function () {
            return this._direction;
        },
        /**
         * In 2d mode (needCube being false), sets the direction used to cast the shadow.
         * Also use as the light direction on spot and directional lights.
         */
        set: function (value) {
            this._setDirection(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShadowLight.prototype, "shadowMinZ", {
        /**
         * Gets the shadow projection clipping minimum z value.
         */
        get: function () {
            return this._shadowMinZ;
        },
        /**
         * Sets the shadow projection clipping minimum z value.
         */
        set: function (value) {
            this._shadowMinZ = value;
            this.forceProjectionMatrixCompute();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShadowLight.prototype, "shadowMaxZ", {
        /**
         * Sets the shadow projection clipping maximum z value.
         */
        get: function () {
            return this._shadowMaxZ;
        },
        /**
         * Gets the shadow projection clipping maximum z value.
         */
        set: function (value) {
            this._shadowMaxZ = value;
            this.forceProjectionMatrixCompute();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Computes the transformed information (transformedPosition and transformedDirection in World space) of the current light
     * @returns true if the information has been computed, false if it does not need to (no parenting)
     */
    ShadowLight.prototype.computeTransformedInformation = function () {
        if (this.parent && this.parent.getWorldMatrix) {
            if (!this.transformedPosition) {
                this.transformedPosition = Vector3.Zero();
            }
            Vector3.TransformCoordinatesToRef(this.position, this.parent.getWorldMatrix(), this.transformedPosition);
            // In case the direction is present.
            if (this.direction) {
                if (!this.transformedDirection) {
                    this.transformedDirection = Vector3.Zero();
                }
                Vector3.TransformNormalToRef(this.direction, this.parent.getWorldMatrix(), this.transformedDirection);
            }
            return true;
        }
        return false;
    };
    /**
     * Return the depth scale used for the shadow map.
     * @returns the depth scale.
     */
    ShadowLight.prototype.getDepthScale = function () {
        return 50.0;
    };
    /**
     * Get the direction to use to render the shadow map. In case of cube texture, the face index can be passed.
     * @param faceIndex The index of the face we are computed the direction to generate shadow
     * @returns The set direction in 2d mode otherwise the direction to the cubemap face if needCube() is true
     */
    ShadowLight.prototype.getShadowDirection = function (faceIndex) {
        return this.transformedDirection ? this.transformedDirection : this.direction;
    };
    /**
     * Returns the ShadowLight absolute position in the World.
     * @returns the position vector in world space
     */
    ShadowLight.prototype.getAbsolutePosition = function () {
        return this.transformedPosition ? this.transformedPosition : this.position;
    };
    /**
     * Sets the ShadowLight direction toward the passed target.
     * @param target The point to target in local space
     * @returns the updated ShadowLight direction
     */
    ShadowLight.prototype.setDirectionToTarget = function (target) {
        this.direction = Vector3.Normalize(target.subtract(this.position));
        return this.direction;
    };
    /**
     * Returns the light rotation in euler definition.
     * @returns the x y z rotation in local space.
     */
    ShadowLight.prototype.getRotation = function () {
        this.direction.normalize();
        var xaxis = Vector3.Cross(this.direction, Axis.Y);
        var yaxis = Vector3.Cross(xaxis, this.direction);
        return Vector3.RotationFromAxis(xaxis, yaxis, this.direction);
    };
    /**
     * Returns whether or not the shadow generation require a cube texture or a 2d texture.
     * @returns true if a cube texture needs to be use
     */
    ShadowLight.prototype.needCube = function () {
        return false;
    };
    /**
     * Detects if the projection matrix requires to be recomputed this frame.
     * @returns true if it requires to be recomputed otherwise, false.
     */
    ShadowLight.prototype.needProjectionMatrixCompute = function () {
        return this._needProjectionMatrixCompute;
    };
    /**
     * Forces the shadow generator to recompute the projection matrix even if position and direction did not changed.
     */
    ShadowLight.prototype.forceProjectionMatrixCompute = function () {
        this._needProjectionMatrixCompute = true;
    };
    /** @hidden */
    ShadowLight.prototype._initCache = function () {
        _super.prototype._initCache.call(this);
        this._cache.position = Vector3.Zero();
    };
    /** @hidden */
    ShadowLight.prototype._isSynchronized = function () {
        if (!this._cache.position.equals(this.position)) {
            return false;
        }
        return true;
    };
    /**
     * Computes the world matrix of the node
     * @param force defines if the cache version should be invalidated forcing the world matrix to be created from scratch
     * @returns the world matrix
     */
    ShadowLight.prototype.computeWorldMatrix = function (force) {
        if (!force && this.isSynchronized()) {
            this._currentRenderId = this.getScene().getRenderId();
            return this._worldMatrix;
        }
        this._updateCache();
        this._cache.position.copyFrom(this.position);
        if (!this._worldMatrix) {
            this._worldMatrix = Matrix.Identity();
        }
        Matrix.TranslationToRef(this.position.x, this.position.y, this.position.z, this._worldMatrix);
        if (this.parent && this.parent.getWorldMatrix) {
            this._worldMatrix.multiplyToRef(this.parent.getWorldMatrix(), this._worldMatrix);
            this._markSyncedWithParent();
        }
        // Cache the determinant
        this._worldMatrixDeterminantIsDirty = true;
        return this._worldMatrix;
    };
    /**
     * Gets the minZ used for shadow according to both the scene and the light.
     * @param activeCamera The camera we are returning the min for
     * @returns the depth min z
     */
    ShadowLight.prototype.getDepthMinZ = function (activeCamera) {
        return this.shadowMinZ !== undefined ? this.shadowMinZ : activeCamera.minZ;
    };
    /**
     * Gets the maxZ used for shadow according to both the scene and the light.
     * @param activeCamera The camera we are returning the max for
     * @returns the depth max z
     */
    ShadowLight.prototype.getDepthMaxZ = function (activeCamera) {
        return this.shadowMaxZ !== undefined ? this.shadowMaxZ : activeCamera.maxZ;
    };
    /**
     * Sets the shadow projection matrix in parameter to the generated projection matrix.
     * @param matrix The materix to updated with the projection information
     * @param viewMatrix The transform matrix of the light
     * @param renderList The list of mesh to render in the map
     * @returns The current light
     */
    ShadowLight.prototype.setShadowProjectionMatrix = function (matrix, viewMatrix, renderList) {
        if (this.customProjectionMatrixBuilder) {
            this.customProjectionMatrixBuilder(viewMatrix, renderList, matrix);
        }
        else {
            this._setDefaultShadowProjectionMatrix(matrix, viewMatrix, renderList);
        }
        return this;
    };
    __decorate([
        serializeAsVector3()
    ], ShadowLight.prototype, "position", null);
    __decorate([
        serializeAsVector3()
    ], ShadowLight.prototype, "direction", null);
    __decorate([
        serialize()
    ], ShadowLight.prototype, "shadowMinZ", null);
    __decorate([
        serialize()
    ], ShadowLight.prototype, "shadowMaxZ", null);
    return ShadowLight;
}(Light));

Node.AddNodeConstructor("Light_Type_2", function (name, scene) {
    return function () { return new SpotLight(name, Vector3.Zero(), Vector3.Zero(), 0, 0, scene); };
});
/**
 * A spot light is defined by a position, a direction, an angle, and an exponent.
 * These values define a cone of light starting from the position, emitting toward the direction.
 * The angle, in radians, defines the size (field of illumination) of the spotlight's conical beam,
 * and the exponent defines the speed of the decay of the light with distance (reach).
 * Documentation: https://doc.babylonjs.com/babylon101/lights
 */
var SpotLight = /** @class */ (function (_super) {
    __extends(SpotLight, _super);
    /**
     * Creates a SpotLight object in the scene. A spot light is a simply light oriented cone.
     * It can cast shadows.
     * Documentation : https://doc.babylonjs.com/babylon101/lights
     * @param name The light friendly name
     * @param position The position of the spot light in the scene
     * @param direction The direction of the light in the scene
     * @param angle The cone angle of the light in Radians
     * @param exponent The light decay speed with the distance from the emission spot
     * @param scene The scene the lights belongs to
     */
    function SpotLight(name, position, direction, angle, exponent, scene) {
        var _this = _super.call(this, name, scene) || this;
        _this._innerAngle = 0;
        _this._projectionTextureMatrix = Matrix.Zero();
        _this._projectionTextureLightNear = 1e-6;
        _this._projectionTextureLightFar = 1000.0;
        _this._projectionTextureUpDirection = Vector3.Up();
        _this._projectionTextureViewLightDirty = true;
        _this._projectionTextureProjectionLightDirty = true;
        _this._projectionTextureDirty = true;
        _this._projectionTextureViewTargetVector = Vector3.Zero();
        _this._projectionTextureViewLightMatrix = Matrix.Zero();
        _this._projectionTextureProjectionLightMatrix = Matrix.Zero();
        _this._projectionTextureScalingMatrix = Matrix.FromValues(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);
        _this.position = position;
        _this.direction = direction;
        _this.angle = angle;
        _this.exponent = exponent;
        return _this;
    }
    Object.defineProperty(SpotLight.prototype, "angle", {
        /**
         * Gets the cone angle of the spot light in Radians.
         */
        get: function () {
            return this._angle;
        },
        /**
         * Sets the cone angle of the spot light in Radians.
         */
        set: function (value) {
            this._angle = value;
            this._cosHalfAngle = Math.cos(value * 0.5);
            this._projectionTextureProjectionLightDirty = true;
            this.forceProjectionMatrixCompute();
            this._computeAngleValues();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "innerAngle", {
        /**
         * Only used in gltf falloff mode, this defines the angle where
         * the directional falloff will start before cutting at angle which could be seen
         * as outer angle.
         */
        get: function () {
            return this._innerAngle;
        },
        /**
         * Only used in gltf falloff mode, this defines the angle where
         * the directional falloff will start before cutting at angle which could be seen
         * as outer angle.
         */
        set: function (value) {
            this._innerAngle = value;
            this._computeAngleValues();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "shadowAngleScale", {
        /**
         * Allows scaling the angle of the light for shadow generation only.
         */
        get: function () {
            return this._shadowAngleScale;
        },
        /**
         * Allows scaling the angle of the light for shadow generation only.
         */
        set: function (value) {
            this._shadowAngleScale = value;
            this.forceProjectionMatrixCompute();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "projectionTextureMatrix", {
        /**
        * Allows reading the projecton texture
        */
        get: function () {
            return this._projectionTextureMatrix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "projectionTextureLightNear", {
        /**
         * Gets the near clip of the Spotlight for texture projection.
         */
        get: function () {
            return this._projectionTextureLightNear;
        },
        /**
         * Sets the near clip of the Spotlight for texture projection.
         */
        set: function (value) {
            this._projectionTextureLightNear = value;
            this._projectionTextureProjectionLightDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "projectionTextureLightFar", {
        /**
         * Gets the far clip of the Spotlight for texture projection.
         */
        get: function () {
            return this._projectionTextureLightFar;
        },
        /**
         * Sets the far clip of the Spotlight for texture projection.
         */
        set: function (value) {
            this._projectionTextureLightFar = value;
            this._projectionTextureProjectionLightDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "projectionTextureUpDirection", {
        /**
         * Gets the Up vector of the Spotlight for texture projection.
         */
        get: function () {
            return this._projectionTextureUpDirection;
        },
        /**
         * Sets the Up vector of the Spotlight for texture projection.
         */
        set: function (value) {
            this._projectionTextureUpDirection = value;
            this._projectionTextureProjectionLightDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "projectionTexture", {
        /**
         * Gets the projection texture of the light.
        */
        get: function () {
            return this._projectionTexture;
        },
        /**
        * Sets the projection texture of the light.
        */
        set: function (value) {
            var _this = this;
            if (this._projectionTexture === value) {
                return;
            }
            this._projectionTexture = value;
            this._projectionTextureDirty = true;
            if (this._projectionTexture && !this._projectionTexture.isReady()) {
                if (SpotLight._IsProceduralTexture(this._projectionTexture)) {
                    this._projectionTexture.getEffect().executeWhenCompiled(function () {
                        _this._markMeshesAsLightDirty();
                    });
                }
                else if (SpotLight._IsTexture(this._projectionTexture)) {
                    this._projectionTexture.onLoadObservable.addOnce(function () {
                        _this._markMeshesAsLightDirty();
                    });
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    SpotLight._IsProceduralTexture = function (texture) {
        return texture.onGeneratedObservable !== undefined;
    };
    SpotLight._IsTexture = function (texture) {
        return texture.onLoadObservable !== undefined;
    };
    /**
     * Returns the string "SpotLight".
     * @returns the class name
     */
    SpotLight.prototype.getClassName = function () {
        return "SpotLight";
    };
    /**
     * Returns the integer 2.
     * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
     */
    SpotLight.prototype.getTypeID = function () {
        return Light.LIGHTTYPEID_SPOTLIGHT;
    };
    /**
     * Overrides the direction setter to recompute the projection texture view light Matrix.
     */
    SpotLight.prototype._setDirection = function (value) {
        _super.prototype._setDirection.call(this, value);
        this._projectionTextureViewLightDirty = true;
    };
    /**
     * Overrides the position setter to recompute the projection texture view light Matrix.
     */
    SpotLight.prototype._setPosition = function (value) {
        _super.prototype._setPosition.call(this, value);
        this._projectionTextureViewLightDirty = true;
    };
    /**
     * Sets the passed matrix "matrix" as perspective projection matrix for the shadows and the passed view matrix with the fov equal to the SpotLight angle and and aspect ratio of 1.0.
     * Returns the SpotLight.
     */
    SpotLight.prototype._setDefaultShadowProjectionMatrix = function (matrix, viewMatrix, renderList) {
        var activeCamera = this.getScene().activeCamera;
        if (!activeCamera) {
            return;
        }
        this._shadowAngleScale = this._shadowAngleScale || 1;
        var angle = this._shadowAngleScale * this._angle;
        Matrix.PerspectiveFovLHToRef(angle, 1.0, this.getDepthMinZ(activeCamera), this.getDepthMaxZ(activeCamera), matrix);
    };
    SpotLight.prototype._computeProjectionTextureViewLightMatrix = function () {
        this._projectionTextureViewLightDirty = false;
        this._projectionTextureDirty = true;
        this.position.addToRef(this.direction, this._projectionTextureViewTargetVector);
        Matrix.LookAtLHToRef(this.position, this._projectionTextureViewTargetVector, this._projectionTextureUpDirection, this._projectionTextureViewLightMatrix);
    };
    SpotLight.prototype._computeProjectionTextureProjectionLightMatrix = function () {
        this._projectionTextureProjectionLightDirty = false;
        this._projectionTextureDirty = true;
        var light_far = this.projectionTextureLightFar;
        var light_near = this.projectionTextureLightNear;
        var P = light_far / (light_far - light_near);
        var Q = -P * light_near;
        var S = 1.0 / Math.tan(this._angle / 2.0);
        var A = 1.0;
        Matrix.FromValuesToRef(S / A, 0.0, 0.0, 0.0, 0.0, S, 0.0, 0.0, 0.0, 0.0, P, 1.0, 0.0, 0.0, Q, 0.0, this._projectionTextureProjectionLightMatrix);
    };
    /**
     * Main function for light texture projection matrix computing.
     */
    SpotLight.prototype._computeProjectionTextureMatrix = function () {
        this._projectionTextureDirty = false;
        this._projectionTextureViewLightMatrix.multiplyToRef(this._projectionTextureProjectionLightMatrix, this._projectionTextureMatrix);
        if (this._projectionTexture instanceof Texture) {
            var u = this._projectionTexture.uScale / 2.0;
            var v = this._projectionTexture.vScale / 2.0;
            Matrix.FromValuesToRef(u, 0.0, 0.0, 0.0, 0.0, v, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0, this._projectionTextureScalingMatrix);
        }
        this._projectionTextureMatrix.multiplyToRef(this._projectionTextureScalingMatrix, this._projectionTextureMatrix);
    };
    SpotLight.prototype._buildUniformLayout = function () {
        this._uniformBuffer.addUniform("vLightData", 4);
        this._uniformBuffer.addUniform("vLightDiffuse", 4);
        this._uniformBuffer.addUniform("vLightSpecular", 4);
        this._uniformBuffer.addUniform("vLightDirection", 3);
        this._uniformBuffer.addUniform("vLightFalloff", 4);
        this._uniformBuffer.addUniform("shadowsInfo", 3);
        this._uniformBuffer.addUniform("depthValues", 2);
        this._uniformBuffer.create();
    };
    SpotLight.prototype._computeAngleValues = function () {
        this._lightAngleScale = 1.0 / Math.max(0.001, (Math.cos(this._innerAngle * 0.5) - this._cosHalfAngle));
        this._lightAngleOffset = -this._cosHalfAngle * this._lightAngleScale;
    };
    /**
     * Sets the passed Effect "effect" with the Light textures.
     * @param effect The effect to update
     * @param lightIndex The index of the light in the effect to update
     * @returns The light
     */
    SpotLight.prototype.transferTexturesToEffect = function (effect, lightIndex) {
        if (this.projectionTexture && this.projectionTexture.isReady()) {
            if (this._projectionTextureViewLightDirty) {
                this._computeProjectionTextureViewLightMatrix();
            }
            if (this._projectionTextureProjectionLightDirty) {
                this._computeProjectionTextureProjectionLightMatrix();
            }
            if (this._projectionTextureDirty) {
                this._computeProjectionTextureMatrix();
            }
            effect.setMatrix("textureProjectionMatrix" + lightIndex, this._projectionTextureMatrix);
            effect.setTexture("projectionLightSampler" + lightIndex, this.projectionTexture);
        }
        return this;
    };
    /**
     * Sets the passed Effect object with the SpotLight transfomed position (or position if not parented) and normalized direction.
     * @param effect The effect to update
     * @param lightIndex The index of the light in the effect to update
     * @returns The spot light
     */
    SpotLight.prototype.transferToEffect = function (effect, lightIndex) {
        var normalizeDirection;
        if (this.computeTransformedInformation()) {
            this._uniformBuffer.updateFloat4("vLightData", this.transformedPosition.x, this.transformedPosition.y, this.transformedPosition.z, this.exponent, lightIndex);
            normalizeDirection = Vector3.Normalize(this.transformedDirection);
        }
        else {
            this._uniformBuffer.updateFloat4("vLightData", this.position.x, this.position.y, this.position.z, this.exponent, lightIndex);
            normalizeDirection = Vector3.Normalize(this.direction);
        }
        this._uniformBuffer.updateFloat4("vLightDirection", normalizeDirection.x, normalizeDirection.y, normalizeDirection.z, this._cosHalfAngle, lightIndex);
        this._uniformBuffer.updateFloat4("vLightFalloff", this.range, this._inverseSquaredRange, this._lightAngleScale, this._lightAngleOffset, lightIndex);
        return this;
    };
    SpotLight.prototype.transferToNodeMaterialEffect = function (effect, lightDataUniformName) {
        var normalizeDirection;
        if (this.computeTransformedInformation()) {
            normalizeDirection = Vector3.Normalize(this.transformedDirection);
        }
        else {
            normalizeDirection = Vector3.Normalize(this.direction);
        }
        if (this.getScene().useRightHandedSystem) {
            effect.setFloat3(lightDataUniformName, -normalizeDirection.x, -normalizeDirection.y, -normalizeDirection.z);
        }
        else {
            effect.setFloat3(lightDataUniformName, normalizeDirection.x, normalizeDirection.y, normalizeDirection.z);
        }
        return this;
    };
    /**
     * Disposes the light and the associated resources.
     */
    SpotLight.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._projectionTexture) {
            this._projectionTexture.dispose();
        }
    };
    /**
     * Prepares the list of defines specific to the light type.
     * @param defines the list of defines
     * @param lightIndex defines the index of the light for the effect
     */
    SpotLight.prototype.prepareLightSpecificDefines = function (defines, lightIndex) {
        defines["SPOTLIGHT" + lightIndex] = true;
        defines["PROJECTEDLIGHTTEXTURE" + lightIndex] = this.projectionTexture && this.projectionTexture.isReady() ? true : false;
    };
    __decorate([
        serialize()
    ], SpotLight.prototype, "angle", null);
    __decorate([
        serialize()
    ], SpotLight.prototype, "innerAngle", null);
    __decorate([
        serialize()
    ], SpotLight.prototype, "shadowAngleScale", null);
    __decorate([
        serialize()
    ], SpotLight.prototype, "exponent", void 0);
    __decorate([
        serialize()
    ], SpotLight.prototype, "projectionTextureLightNear", null);
    __decorate([
        serialize()
    ], SpotLight.prototype, "projectionTextureLightFar", null);
    __decorate([
        serialize()
    ], SpotLight.prototype, "projectionTextureUpDirection", null);
    __decorate([
        serializeAsTexture("projectedLightTexture")
    ], SpotLight.prototype, "_projectionTexture", void 0);
    return SpotLight;
}(ShadowLight));

export { SpotLight as S, ShadowLight as a };
