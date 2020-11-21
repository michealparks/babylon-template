import { _ as __extends, a as __decorate, L as Logger, O as Observable } from './thinEngine-e576a091.js';
import { s as serializeAsVector3, a as serialize, b as serializeAsMeshReference, S as SerializationHelper } from './node-87d9c658.js';
import { V as Vector3, Q as Quaternion, E as Epsilon, M as Matrix, T as TmpVectors, a as Vector2 } from './math.color-fc6e801e.js';
import { E as Engine } from './engine-9a1b5aa7.js';
import { C as Camera, K as KeyboardEventTypes, P as PointerEventTypes } from './pointerEvents-12a2451c.js';
import { T as Tools } from './tools-ab6f1dea.js';
import { A as Axis, C as Coordinate } from './math.axis-e7db27a6.js';

/**
 * A target camera takes a mesh or position as a target and continues to look at it while it moves.
 * This is the base of the follow, arc rotate cameras and Free camera
 * @see https://doc.babylonjs.com/features/cameras
 */
var TargetCamera = /** @class */ (function (_super) {
    __extends(TargetCamera, _super);
    /**
     * Instantiates a target camera that takes a mesh or position as a target and continues to look at it while it moves.
     * This is the base of the follow, arc rotate cameras and Free camera
     * @see https://doc.babylonjs.com/features/cameras
     * @param name Defines the name of the camera in the scene
     * @param position Defines the start position of the camera in the scene
     * @param scene Defines the scene the camera belongs to
     * @param setActiveOnSceneIfNoneActive Defines wheter the camera should be marked as active if not other active cameras have been defined
     */
    function TargetCamera(name, position, scene, setActiveOnSceneIfNoneActive) {
        if (setActiveOnSceneIfNoneActive === void 0) { setActiveOnSceneIfNoneActive = true; }
        var _this = _super.call(this, name, position, scene, setActiveOnSceneIfNoneActive) || this;
        _this._tmpUpVector = Vector3.Zero();
        _this._tmpTargetVector = Vector3.Zero();
        /**
         * Define the current direction the camera is moving to
         */
        _this.cameraDirection = new Vector3(0, 0, 0);
        /**
         * Define the current rotation the camera is rotating to
         */
        _this.cameraRotation = new Vector2(0, 0);
        /** Gets or sets a boolean indicating that the scaling of the parent hierarchy will not be taken in account by the camera */
        _this.ignoreParentScaling = false;
        /**
         * When set, the up vector of the camera will be updated by the rotation of the camera
         */
        _this.updateUpVectorFromRotation = false;
        _this._tmpQuaternion = new Quaternion();
        /**
         * Define the current rotation of the camera
         */
        _this.rotation = new Vector3(0, 0, 0);
        /**
         * Define the current speed of the camera
         */
        _this.speed = 2.0;
        /**
         * Add constraint to the camera to prevent it to move freely in all directions and
         * around all axis.
         */
        _this.noRotationConstraint = false;
        /**
         * Reverses mouselook direction to 'natural' panning as opposed to traditional direct
         * panning
         */
        _this.invertRotation = false;
        /**
         * Speed multiplier for inverse camera panning
         */
        _this.inverseRotationSpeed = 0.2;
        /**
         * Define the current target of the camera as an object or a position.
         */
        _this.lockedTarget = null;
        /** @hidden */
        _this._currentTarget = Vector3.Zero();
        /** @hidden */
        _this._initialFocalDistance = 1;
        /** @hidden */
        _this._viewMatrix = Matrix.Zero();
        /** @hidden */
        _this._camMatrix = Matrix.Zero();
        /** @hidden */
        _this._cameraTransformMatrix = Matrix.Zero();
        /** @hidden */
        _this._cameraRotationMatrix = Matrix.Zero();
        /** @hidden */
        _this._referencePoint = new Vector3(0, 0, 1);
        /** @hidden */
        _this._transformedReferencePoint = Vector3.Zero();
        _this._defaultUp = Vector3.Up();
        _this._cachedRotationZ = 0;
        _this._cachedQuaternionRotationZ = 0;
        return _this;
    }
    /**
     * Gets the position in front of the camera at a given distance.
     * @param distance The distance from the camera we want the position to be
     * @returns the position
     */
    TargetCamera.prototype.getFrontPosition = function (distance) {
        this.getWorldMatrix();
        var direction = this.getTarget().subtract(this.position);
        direction.normalize();
        direction.scaleInPlace(distance);
        return this.globalPosition.add(direction);
    };
    /** @hidden */
    TargetCamera.prototype._getLockedTargetPosition = function () {
        if (!this.lockedTarget) {
            return null;
        }
        if (this.lockedTarget.absolutePosition) {
            this.lockedTarget.computeWorldMatrix();
        }
        return this.lockedTarget.absolutePosition || this.lockedTarget;
    };
    /**
     * Store current camera state of the camera (fov, position, rotation, etc..)
     * @returns the camera
     */
    TargetCamera.prototype.storeState = function () {
        this._storedPosition = this.position.clone();
        this._storedRotation = this.rotation.clone();
        if (this.rotationQuaternion) {
            this._storedRotationQuaternion = this.rotationQuaternion.clone();
        }
        return _super.prototype.storeState.call(this);
    };
    /**
     * Restored camera state. You must call storeState() first
     * @returns whether it was successful or not
     * @hidden
     */
    TargetCamera.prototype._restoreStateValues = function () {
        if (!_super.prototype._restoreStateValues.call(this)) {
            return false;
        }
        this.position = this._storedPosition.clone();
        this.rotation = this._storedRotation.clone();
        if (this.rotationQuaternion) {
            this.rotationQuaternion = this._storedRotationQuaternion.clone();
        }
        this.cameraDirection.copyFromFloats(0, 0, 0);
        this.cameraRotation.copyFromFloats(0, 0);
        return true;
    };
    /** @hidden */
    TargetCamera.prototype._initCache = function () {
        _super.prototype._initCache.call(this);
        this._cache.lockedTarget = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        this._cache.rotation = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        this._cache.rotationQuaternion = new Quaternion(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    };
    /** @hidden */
    TargetCamera.prototype._updateCache = function (ignoreParentClass) {
        if (!ignoreParentClass) {
            _super.prototype._updateCache.call(this);
        }
        var lockedTargetPosition = this._getLockedTargetPosition();
        if (!lockedTargetPosition) {
            this._cache.lockedTarget = null;
        }
        else {
            if (!this._cache.lockedTarget) {
                this._cache.lockedTarget = lockedTargetPosition.clone();
            }
            else {
                this._cache.lockedTarget.copyFrom(lockedTargetPosition);
            }
        }
        this._cache.rotation.copyFrom(this.rotation);
        if (this.rotationQuaternion) {
            this._cache.rotationQuaternion.copyFrom(this.rotationQuaternion);
        }
    };
    // Synchronized
    /** @hidden */
    TargetCamera.prototype._isSynchronizedViewMatrix = function () {
        if (!_super.prototype._isSynchronizedViewMatrix.call(this)) {
            return false;
        }
        var lockedTargetPosition = this._getLockedTargetPosition();
        return (this._cache.lockedTarget ? this._cache.lockedTarget.equals(lockedTargetPosition) : !lockedTargetPosition)
            && (this.rotationQuaternion ? this.rotationQuaternion.equals(this._cache.rotationQuaternion) : this._cache.rotation.equals(this.rotation));
    };
    // Methods
    /** @hidden */
    TargetCamera.prototype._computeLocalCameraSpeed = function () {
        var engine = this.getEngine();
        return this.speed * Math.sqrt((engine.getDeltaTime() / (engine.getFps() * 100.0)));
    };
    // Target
    /**
     * Defines the target the camera should look at.
     * @param target Defines the new target as a Vector or a mesh
     */
    TargetCamera.prototype.setTarget = function (target) {
        this.upVector.normalize();
        this._initialFocalDistance = target.subtract(this.position).length();
        if (this.position.z === target.z) {
            this.position.z += Epsilon;
        }
        this._referencePoint.normalize().scaleInPlace(this._initialFocalDistance);
        Matrix.LookAtLHToRef(this.position, target, this._defaultUp, this._camMatrix);
        this._camMatrix.invert();
        this.rotation.x = Math.atan(this._camMatrix.m[6] / this._camMatrix.m[10]);
        var vDir = target.subtract(this.position);
        if (vDir.x >= 0.0) {
            this.rotation.y = (-Math.atan(vDir.z / vDir.x) + Math.PI / 2.0);
        }
        else {
            this.rotation.y = (-Math.atan(vDir.z / vDir.x) - Math.PI / 2.0);
        }
        this.rotation.z = 0;
        if (isNaN(this.rotation.x)) {
            this.rotation.x = 0;
        }
        if (isNaN(this.rotation.y)) {
            this.rotation.y = 0;
        }
        if (isNaN(this.rotation.z)) {
            this.rotation.z = 0;
        }
        if (this.rotationQuaternion) {
            Quaternion.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this.rotationQuaternion);
        }
    };
    Object.defineProperty(TargetCamera.prototype, "target", {
        /**
         * Defines the target point of the camera.
         * The camera looks towards it form the radius distance.
         */
        get: function () {
            return this.getTarget();
        },
        set: function (value) {
            this.setTarget(value);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Return the current target position of the camera. This value is expressed in local space.
     * @returns the target position
     */
    TargetCamera.prototype.getTarget = function () {
        return this._currentTarget;
    };
    /** @hidden */
    TargetCamera.prototype._decideIfNeedsToMove = function () {
        return Math.abs(this.cameraDirection.x) > 0 || Math.abs(this.cameraDirection.y) > 0 || Math.abs(this.cameraDirection.z) > 0;
    };
    /** @hidden */
    TargetCamera.prototype._updatePosition = function () {
        if (this.parent) {
            this.parent.getWorldMatrix().invertToRef(TmpVectors.Matrix[0]);
            Vector3.TransformNormalToRef(this.cameraDirection, TmpVectors.Matrix[0], TmpVectors.Vector3[0]);
            this.position.addInPlace(TmpVectors.Vector3[0]);
            return;
        }
        this.position.addInPlace(this.cameraDirection);
    };
    /** @hidden */
    TargetCamera.prototype._checkInputs = function () {
        var directionMultiplier = this.invertRotation ? -this.inverseRotationSpeed : 1.0;
        var needToMove = this._decideIfNeedsToMove();
        var needToRotate = Math.abs(this.cameraRotation.x) > 0 || Math.abs(this.cameraRotation.y) > 0;
        // Move
        if (needToMove) {
            this._updatePosition();
        }
        // Rotate
        if (needToRotate) {
            //rotate, if quaternion is set and rotation was used
            if (this.rotationQuaternion) {
                this.rotationQuaternion.toEulerAnglesToRef(this.rotation);
            }
            this.rotation.x += this.cameraRotation.x * directionMultiplier;
            this.rotation.y += this.cameraRotation.y * directionMultiplier;
            // Apply constraints
            if (!this.noRotationConstraint) {
                var limit = 1.570796;
                if (this.rotation.x > limit) {
                    this.rotation.x = limit;
                }
                if (this.rotation.x < -limit) {
                    this.rotation.x = -limit;
                }
            }
            //rotate, if quaternion is set and rotation was used
            if (this.rotationQuaternion) {
                var len = this.rotation.lengthSquared();
                if (len) {
                    Quaternion.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this.rotationQuaternion);
                }
            }
        }
        // Inertia
        if (needToMove) {
            if (Math.abs(this.cameraDirection.x) < this.speed * Epsilon) {
                this.cameraDirection.x = 0;
            }
            if (Math.abs(this.cameraDirection.y) < this.speed * Epsilon) {
                this.cameraDirection.y = 0;
            }
            if (Math.abs(this.cameraDirection.z) < this.speed * Epsilon) {
                this.cameraDirection.z = 0;
            }
            this.cameraDirection.scaleInPlace(this.inertia);
        }
        if (needToRotate) {
            if (Math.abs(this.cameraRotation.x) < this.speed * Epsilon) {
                this.cameraRotation.x = 0;
            }
            if (Math.abs(this.cameraRotation.y) < this.speed * Epsilon) {
                this.cameraRotation.y = 0;
            }
            this.cameraRotation.scaleInPlace(this.inertia);
        }
        _super.prototype._checkInputs.call(this);
    };
    TargetCamera.prototype._updateCameraRotationMatrix = function () {
        if (this.rotationQuaternion) {
            this.rotationQuaternion.toRotationMatrix(this._cameraRotationMatrix);
        }
        else {
            Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this._cameraRotationMatrix);
        }
    };
    /**
     * Update the up vector to apply the rotation of the camera (So if you changed the camera rotation.z this will let you update the up vector as well)
     * @returns the current camera
     */
    TargetCamera.prototype._rotateUpVectorWithCameraRotationMatrix = function () {
        Vector3.TransformNormalToRef(this._defaultUp, this._cameraRotationMatrix, this.upVector);
        return this;
    };
    /** @hidden */
    TargetCamera.prototype._getViewMatrix = function () {
        if (this.lockedTarget) {
            this.setTarget(this._getLockedTargetPosition());
        }
        // Compute
        this._updateCameraRotationMatrix();
        // Apply the changed rotation to the upVector
        if (this.rotationQuaternion && this._cachedQuaternionRotationZ != this.rotationQuaternion.z) {
            this._rotateUpVectorWithCameraRotationMatrix();
            this._cachedQuaternionRotationZ = this.rotationQuaternion.z;
        }
        else if (this._cachedRotationZ != this.rotation.z) {
            this._rotateUpVectorWithCameraRotationMatrix();
            this._cachedRotationZ = this.rotation.z;
        }
        Vector3.TransformCoordinatesToRef(this._referencePoint, this._cameraRotationMatrix, this._transformedReferencePoint);
        // Computing target and final matrix
        this.position.addToRef(this._transformedReferencePoint, this._currentTarget);
        if (this.updateUpVectorFromRotation) {
            if (this.rotationQuaternion) {
                Axis.Y.rotateByQuaternionToRef(this.rotationQuaternion, this.upVector);
            }
            else {
                Quaternion.FromEulerVectorToRef(this.rotation, this._tmpQuaternion);
                Axis.Y.rotateByQuaternionToRef(this._tmpQuaternion, this.upVector);
            }
        }
        this._computeViewMatrix(this.position, this._currentTarget, this.upVector);
        return this._viewMatrix;
    };
    TargetCamera.prototype._computeViewMatrix = function (position, target, up) {
        if (this.ignoreParentScaling) {
            if (this.parent) {
                var parentWorldMatrix = this.parent.getWorldMatrix();
                Vector3.TransformCoordinatesToRef(position, parentWorldMatrix, this._globalPosition);
                Vector3.TransformCoordinatesToRef(target, parentWorldMatrix, this._tmpTargetVector);
                Vector3.TransformNormalToRef(up, parentWorldMatrix, this._tmpUpVector);
                this._markSyncedWithParent();
            }
            else {
                this._globalPosition.copyFrom(position);
                this._tmpTargetVector.copyFrom(target);
                this._tmpUpVector.copyFrom(up);
            }
            if (this.getScene().useRightHandedSystem) {
                Matrix.LookAtRHToRef(this._globalPosition, this._tmpTargetVector, this._tmpUpVector, this._viewMatrix);
            }
            else {
                Matrix.LookAtLHToRef(this._globalPosition, this._tmpTargetVector, this._tmpUpVector, this._viewMatrix);
            }
            return;
        }
        if (this.getScene().useRightHandedSystem) {
            Matrix.LookAtRHToRef(position, target, up, this._viewMatrix);
        }
        else {
            Matrix.LookAtLHToRef(position, target, up, this._viewMatrix);
        }
        if (this.parent) {
            var parentWorldMatrix = this.parent.getWorldMatrix();
            this._viewMatrix.invert();
            this._viewMatrix.multiplyToRef(parentWorldMatrix, this._viewMatrix);
            this._viewMatrix.getTranslationToRef(this._globalPosition);
            this._viewMatrix.invert();
            this._markSyncedWithParent();
        }
        else {
            this._globalPosition.copyFrom(position);
        }
    };
    /**
     * @hidden
     */
    TargetCamera.prototype.createRigCamera = function (name, cameraIndex) {
        if (this.cameraRigMode !== Camera.RIG_MODE_NONE) {
            var rigCamera = new TargetCamera(name, this.position.clone(), this.getScene());
            rigCamera.isRigCamera = true;
            rigCamera.rigParent = this;
            if (this.cameraRigMode === Camera.RIG_MODE_VR || this.cameraRigMode === Camera.RIG_MODE_WEBVR) {
                if (!this.rotationQuaternion) {
                    this.rotationQuaternion = new Quaternion();
                }
                rigCamera._cameraRigParams = {};
                rigCamera.rotationQuaternion = new Quaternion();
            }
            return rigCamera;
        }
        return null;
    };
    /**
     * @hidden
     */
    TargetCamera.prototype._updateRigCameras = function () {
        var camLeft = this._rigCameras[0];
        var camRight = this._rigCameras[1];
        this.computeWorldMatrix();
        switch (this.cameraRigMode) {
            case Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
            case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
            case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
            case Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
            case Camera.RIG_MODE_STEREOSCOPIC_INTERLACED:
                //provisionnaly using _cameraRigParams.stereoHalfAngle instead of calculations based on _cameraRigParams.interaxialDistance:
                var leftSign = (this.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED) ? 1 : -1;
                var rightSign = (this.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED) ? -1 : 1;
                this._getRigCamPositionAndTarget(this._cameraRigParams.stereoHalfAngle * leftSign, camLeft);
                this._getRigCamPositionAndTarget(this._cameraRigParams.stereoHalfAngle * rightSign, camRight);
                break;
            case Camera.RIG_MODE_VR:
                if (camLeft.rotationQuaternion) {
                    camLeft.rotationQuaternion.copyFrom(this.rotationQuaternion);
                    camRight.rotationQuaternion.copyFrom(this.rotationQuaternion);
                }
                else {
                    camLeft.rotation.copyFrom(this.rotation);
                    camRight.rotation.copyFrom(this.rotation);
                }
                camLeft.position.copyFrom(this.position);
                camRight.position.copyFrom(this.position);
                break;
        }
        _super.prototype._updateRigCameras.call(this);
    };
    TargetCamera.prototype._getRigCamPositionAndTarget = function (halfSpace, rigCamera) {
        var target = this.getTarget();
        target.subtractToRef(this.position, TargetCamera._TargetFocalPoint);
        TargetCamera._TargetFocalPoint.normalize().scaleInPlace(this._initialFocalDistance);
        var newFocalTarget = TargetCamera._TargetFocalPoint.addInPlace(this.position);
        Matrix.TranslationToRef(-newFocalTarget.x, -newFocalTarget.y, -newFocalTarget.z, TargetCamera._TargetTransformMatrix);
        TargetCamera._TargetTransformMatrix.multiplyToRef(Matrix.RotationAxis(rigCamera.upVector, halfSpace), TargetCamera._RigCamTransformMatrix);
        Matrix.TranslationToRef(newFocalTarget.x, newFocalTarget.y, newFocalTarget.z, TargetCamera._TargetTransformMatrix);
        TargetCamera._RigCamTransformMatrix.multiplyToRef(TargetCamera._TargetTransformMatrix, TargetCamera._RigCamTransformMatrix);
        Vector3.TransformCoordinatesToRef(this.position, TargetCamera._RigCamTransformMatrix, rigCamera.position);
        rigCamera.setTarget(newFocalTarget);
    };
    /**
     * Gets the current object class name.
     * @return the class name
     */
    TargetCamera.prototype.getClassName = function () {
        return "TargetCamera";
    };
    TargetCamera._RigCamTransformMatrix = new Matrix();
    TargetCamera._TargetTransformMatrix = new Matrix();
    TargetCamera._TargetFocalPoint = new Vector3();
    __decorate([
        serializeAsVector3()
    ], TargetCamera.prototype, "rotation", void 0);
    __decorate([
        serialize()
    ], TargetCamera.prototype, "speed", void 0);
    __decorate([
        serializeAsMeshReference("lockedTargetId")
    ], TargetCamera.prototype, "lockedTarget", void 0);
    return TargetCamera;
}(Camera));

/**
 * @ignore
 * This is a list of all the different input types that are available in the application.
 * Fo instance: ArcRotateCameraGamepadInput...
 */
var CameraInputTypes = {};
/**
 * This represents the input manager used within a camera.
 * It helps dealing with all the different kind of input attached to a camera.
 * @see https://doc.babylonjs.com/how_to/customizing_camera_inputs
 */
var CameraInputsManager = /** @class */ (function () {
    /**
     * Instantiate a new Camera Input Manager.
     * @param camera Defines the camera the input manager blongs to
     */
    function CameraInputsManager(camera) {
        /**
         * Defines the dom element the camera is collecting inputs from.
         * This is null if the controls have not been attached.
         */
        this.attachedToElement = false;
        this.attached = {};
        this.camera = camera;
        this.checkInputs = function () { };
    }
    /**
     * Add an input method to a camera
     * @see https://doc.babylonjs.com/how_to/customizing_camera_inputs
     * @param input camera input method
     */
    CameraInputsManager.prototype.add = function (input) {
        var type = input.getSimpleName();
        if (this.attached[type]) {
            Logger.Warn("camera input of type " + type + " already exists on camera");
            return;
        }
        this.attached[type] = input;
        input.camera = this.camera;
        //for checkInputs, we are dynamically creating a function
        //the goal is to avoid the performance penalty of looping for inputs in the render loop
        if (input.checkInputs) {
            this.checkInputs = this._addCheckInputs(input.checkInputs.bind(input));
        }
        if (this.attachedToElement) {
            input.attachControl();
        }
    };
    /**
     * Remove a specific input method from a camera
     * example: camera.inputs.remove(camera.inputs.attached.mouse);
     * @param inputToRemove camera input method
     */
    CameraInputsManager.prototype.remove = function (inputToRemove) {
        for (var cam in this.attached) {
            var input = this.attached[cam];
            if (input === inputToRemove) {
                input.detachControl();
                input.camera = null;
                delete this.attached[cam];
                this.rebuildInputCheck();
            }
        }
    };
    /**
     * Remove a specific input type from a camera
     * example: camera.inputs.remove("ArcRotateCameraGamepadInput");
     * @param inputType the type of the input to remove
     */
    CameraInputsManager.prototype.removeByType = function (inputType) {
        for (var cam in this.attached) {
            var input = this.attached[cam];
            if (input.getClassName() === inputType) {
                input.detachControl();
                input.camera = null;
                delete this.attached[cam];
                this.rebuildInputCheck();
            }
        }
    };
    CameraInputsManager.prototype._addCheckInputs = function (fn) {
        var current = this.checkInputs;
        return function () {
            current();
            fn();
        };
    };
    /**
     * Attach the input controls to the currently attached dom element to listen the events from.
     * @param input Defines the input to attach
     */
    CameraInputsManager.prototype.attachInput = function (input) {
        if (this.attachedToElement) {
            input.attachControl(this.noPreventDefault);
        }
    };
    /**
     * Attach the current manager inputs controls to a specific dom element to listen the events from.
     * @param element Defines the dom element to collect the events from
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    CameraInputsManager.prototype.attachElement = function (noPreventDefault) {
        if (noPreventDefault === void 0) { noPreventDefault = false; }
        if (this.attachedToElement) {
            return;
        }
        noPreventDefault = Camera.ForceAttachControlToAlwaysPreventDefault ? false : noPreventDefault;
        this.attachedToElement = true;
        this.noPreventDefault = noPreventDefault;
        for (var cam in this.attached) {
            this.attached[cam].attachControl(noPreventDefault);
        }
    };
    /**
     * Detach the current manager inputs controls from a specific dom element.
     * @param element Defines the dom element to collect the events from
     * @param disconnect Defines whether the input should be removed from the current list of attached inputs
     */
    CameraInputsManager.prototype.detachElement = function (disconnect) {
        if (disconnect === void 0) { disconnect = false; }
        for (var cam in this.attached) {
            this.attached[cam].detachControl();
            if (disconnect) {
                this.attached[cam].camera = null;
            }
        }
        this.attachedToElement = false;
    };
    /**
     * Rebuild the dynamic inputCheck function from the current list of
     * defined inputs in the manager.
     */
    CameraInputsManager.prototype.rebuildInputCheck = function () {
        this.checkInputs = function () { };
        for (var cam in this.attached) {
            var input = this.attached[cam];
            if (input.checkInputs) {
                this.checkInputs = this._addCheckInputs(input.checkInputs.bind(input));
            }
        }
    };
    /**
     * Remove all attached input methods from a camera
     */
    CameraInputsManager.prototype.clear = function () {
        if (this.attachedToElement) {
            this.detachElement(true);
        }
        this.attached = {};
        this.attachedToElement = false;
        this.checkInputs = function () { };
    };
    /**
     * Serialize the current input manager attached to a camera.
     * This ensures than once parsed,
     * the input associated to the camera will be identical to the current ones
     * @param serializedCamera Defines the camera serialization JSON the input serialization should write to
     */
    CameraInputsManager.prototype.serialize = function (serializedCamera) {
        var inputs = {};
        for (var cam in this.attached) {
            var input = this.attached[cam];
            var res = SerializationHelper.Serialize(input);
            inputs[input.getClassName()] = res;
        }
        serializedCamera.inputsmgr = inputs;
    };
    /**
     * Parses an input manager serialized JSON to restore the previous list of inputs
     * and states associated to a camera.
     * @param parsedCamera Defines the JSON to parse
     */
    CameraInputsManager.prototype.parse = function (parsedCamera) {
        var parsedInputs = parsedCamera.inputsmgr;
        if (parsedInputs) {
            this.clear();
            for (var n in parsedInputs) {
                var construct = CameraInputTypes[n];
                if (construct) {
                    var parsedinput = parsedInputs[n];
                    var input = SerializationHelper.Parse(function () {
                        return new construct();
                    }, parsedinput, null);
                    this.add(input);
                }
            }
        }
        else {
            //2016-03-08 this part is for managing backward compatibility
            for (var n in this.attached) {
                var construct = CameraInputTypes[this.attached[n].getClassName()];
                if (construct) {
                    var input = SerializationHelper.Parse(function () {
                        return new construct();
                    }, parsedCamera, null);
                    this.remove(this.attached[n]);
                    this.add(input);
                }
            }
        }
    };
    return CameraInputsManager;
}());

/**
 * Manage the keyboard inputs to control the movement of a free camera.
 * @see https://doc.babylonjs.com/how_to/customizing_camera_inputs
 */
var FreeCameraKeyboardMoveInput = /** @class */ (function () {
    function FreeCameraKeyboardMoveInput() {
        /**
         * Gets or Set the list of keyboard keys used to control the forward move of the camera.
         */
        this.keysUp = [38];
        /**
         * Gets or Set the list of keyboard keys used to control the upward move of the camera.
         */
        this.keysUpward = [33];
        /**
         * Gets or Set the list of keyboard keys used to control the backward move of the camera.
         */
        this.keysDown = [40];
        /**
         * Gets or Set the list of keyboard keys used to control the downward move of the camera.
         */
        this.keysDownward = [34];
        /**
         * Gets or Set the list of keyboard keys used to control the left strafe move of the camera.
         */
        this.keysLeft = [37];
        /**
         * Gets or Set the list of keyboard keys used to control the right strafe move of the camera.
         */
        this.keysRight = [39];
        this._keys = new Array();
    }
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    FreeCameraKeyboardMoveInput.prototype.attachControl = function (noPreventDefault) {
        var _this = this;
        noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
        if (this._onCanvasBlurObserver) {
            return;
        }
        this._scene = this.camera.getScene();
        this._engine = this._scene.getEngine();
        this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(function () {
            _this._keys = [];
        });
        this._onKeyboardObserver = this._scene.onKeyboardObservable.add(function (info) {
            var evt = info.event;
            if (!evt.metaKey) {
                if (info.type === KeyboardEventTypes.KEYDOWN) {
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 || _this.keysDown.indexOf(evt.keyCode) !== -1 || _this.keysLeft.indexOf(evt.keyCode) !== -1 || _this.keysRight.indexOf(evt.keyCode) !== -1 || _this.keysUpward.indexOf(evt.keyCode) !== -1 || _this.keysDownward.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index === -1) {
                            _this._keys.push(evt.keyCode);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                }
                else {
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 || _this.keysDown.indexOf(evt.keyCode) !== -1 || _this.keysLeft.indexOf(evt.keyCode) !== -1 || _this.keysRight.indexOf(evt.keyCode) !== -1 || _this.keysUpward.indexOf(evt.keyCode) !== -1 || _this.keysDownward.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index >= 0) {
                            _this._keys.splice(index, 1);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                }
            }
        });
    };
    /**
     * Detach the current controls from the specified dom element.
     * @param ignored defines an ignored parameter kept for backward compatibility. If you want to define the source input element, you can set engine.inputElement before calling camera.attachControl
     */
    FreeCameraKeyboardMoveInput.prototype.detachControl = function (ignored) {
        if (this._scene) {
            if (this._onKeyboardObserver) {
                this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
            }
            if (this._onCanvasBlurObserver) {
                this._engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
            }
            this._onKeyboardObserver = null;
            this._onCanvasBlurObserver = null;
        }
        this._keys = [];
    };
    /**
     * Update the current camera state depending on the inputs that have been used this frame.
     * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
     */
    FreeCameraKeyboardMoveInput.prototype.checkInputs = function () {
        if (this._onKeyboardObserver) {
            var camera = this.camera;
            // Keyboard
            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];
                var speed = camera._computeLocalCameraSpeed();
                if (this.keysLeft.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(-speed, 0, 0);
                }
                else if (this.keysUp.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(0, 0, speed);
                }
                else if (this.keysRight.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(speed, 0, 0);
                }
                else if (this.keysDown.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(0, 0, -speed);
                }
                else if (this.keysUpward.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(0, speed, 0);
                }
                else if (this.keysDownward.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(0, -speed, 0);
                }
                if (camera.getScene().useRightHandedSystem) {
                    camera._localDirection.z *= -1;
                }
                camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
                Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
                camera.cameraDirection.addInPlace(camera._transformedDirection);
            }
        }
    };
    /**
     * Gets the class name of the current intput.
     * @returns the class name
     */
    FreeCameraKeyboardMoveInput.prototype.getClassName = function () {
        return "FreeCameraKeyboardMoveInput";
    };
    /** @hidden */
    FreeCameraKeyboardMoveInput.prototype._onLostFocus = function () {
        this._keys = [];
    };
    /**
     * Get the friendly name associated with the input class.
     * @returns the input friendly name
     */
    FreeCameraKeyboardMoveInput.prototype.getSimpleName = function () {
        return "keyboard";
    };
    __decorate([
        serialize()
    ], FreeCameraKeyboardMoveInput.prototype, "keysUp", void 0);
    __decorate([
        serialize()
    ], FreeCameraKeyboardMoveInput.prototype, "keysUpward", void 0);
    __decorate([
        serialize()
    ], FreeCameraKeyboardMoveInput.prototype, "keysDown", void 0);
    __decorate([
        serialize()
    ], FreeCameraKeyboardMoveInput.prototype, "keysDownward", void 0);
    __decorate([
        serialize()
    ], FreeCameraKeyboardMoveInput.prototype, "keysLeft", void 0);
    __decorate([
        serialize()
    ], FreeCameraKeyboardMoveInput.prototype, "keysRight", void 0);
    return FreeCameraKeyboardMoveInput;
}());
CameraInputTypes["FreeCameraKeyboardMoveInput"] = FreeCameraKeyboardMoveInput;

/**
 * Manage the mouse inputs to control the movement of a free camera.
 * @see https://doc.babylonjs.com/how_to/customizing_camera_inputs
 */
var FreeCameraMouseInput = /** @class */ (function () {
    /**
     * Manage the mouse inputs to control the movement of a free camera.
     * @see https://doc.babylonjs.com/how_to/customizing_camera_inputs
     * @param touchEnabled Defines if touch is enabled or not
     */
    function FreeCameraMouseInput(
    /**
     * Define if touch is enabled in the mouse input
     */
    touchEnabled) {
        if (touchEnabled === void 0) { touchEnabled = true; }
        this.touchEnabled = touchEnabled;
        /**
         * Defines the buttons associated with the input to handle camera move.
         */
        this.buttons = [0, 1, 2];
        /**
         * Defines the pointer angular sensibility  along the X and Y axis or how fast is the camera rotating.
         */
        this.angularSensibility = 2000.0;
        this.previousPosition = null;
        /**
         * Observable for when a pointer move event occurs containing the move offset
         */
        this.onPointerMovedObservable = new Observable();
        /**
         * @hidden
         * If the camera should be rotated automatically based on pointer movement
         */
        this._allowCameraRotation = true;
    }
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    FreeCameraMouseInput.prototype.attachControl = function (noPreventDefault) {
        var _this = this;
        noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
        var engine = this.camera.getEngine();
        var element = engine.getInputElement();
        if (!this._pointerInput) {
            this._pointerInput = function (p) {
                var evt = p.event;
                if (engine.isInVRExclusivePointerMode) {
                    return;
                }
                if (!_this.touchEnabled && evt.pointerType === "touch") {
                    return;
                }
                if (p.type !== PointerEventTypes.POINTERMOVE && _this.buttons.indexOf(evt.button) === -1) {
                    return;
                }
                var srcElement = (evt.srcElement || evt.target);
                if (p.type === PointerEventTypes.POINTERDOWN && srcElement) {
                    try {
                        srcElement.setPointerCapture(evt.pointerId);
                    }
                    catch (e) {
                        //Nothing to do with the error. Execution will continue.
                    }
                    _this.previousPosition = {
                        x: evt.clientX,
                        y: evt.clientY,
                    };
                    if (!noPreventDefault) {
                        evt.preventDefault();
                        element && element.focus();
                    }
                    // This is required to move while pointer button is down
                    if (engine.isPointerLock && _this._onMouseMove) {
                        _this._onMouseMove(p.event);
                    }
                }
                else if (p.type === PointerEventTypes.POINTERUP && srcElement) {
                    try {
                        srcElement.releasePointerCapture(evt.pointerId);
                    }
                    catch (e) {
                        //Nothing to do with the error.
                    }
                    _this.previousPosition = null;
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
                else if (p.type === PointerEventTypes.POINTERMOVE) {
                    if (!_this.previousPosition) {
                        if (engine.isPointerLock && _this._onMouseMove) {
                            _this._onMouseMove(p.event);
                        }
                        return;
                    }
                    var offsetX = evt.clientX - _this.previousPosition.x;
                    var offsetY = evt.clientY - _this.previousPosition.y;
                    if (_this.camera.getScene().useRightHandedSystem) {
                        offsetX *= -1;
                    }
                    if (_this.camera.parent && _this.camera.parent._getWorldMatrixDeterminant() < 0) {
                        offsetX *= -1;
                    }
                    if (_this._allowCameraRotation) {
                        _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
                        _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
                    }
                    _this.onPointerMovedObservable.notifyObservers({ offsetX: offsetX, offsetY: offsetY });
                    _this.previousPosition = {
                        x: evt.clientX,
                        y: evt.clientY,
                    };
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
        }
        this._onMouseMove = function (evt) {
            if (!engine.isPointerLock) {
                return;
            }
            if (engine.isInVRExclusivePointerMode) {
                return;
            }
            var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
            if (_this.camera.getScene().useRightHandedSystem) {
                offsetX *= -1;
            }
            if (_this.camera.parent && _this.camera.parent._getWorldMatrixDeterminant() < 0) {
                offsetX *= -1;
            }
            _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
            var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
            _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
            _this.previousPosition = null;
            if (!noPreventDefault) {
                evt.preventDefault();
            }
        };
        this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE);
        element && element.addEventListener("contextmenu", this.onContextMenu.bind(this), false);
    };
    /**
     * Called on JS contextmenu event.
     * Override this method to provide functionality.
     */
    FreeCameraMouseInput.prototype.onContextMenu = function (evt) {
        evt.preventDefault();
    };
    /**
     * Detach the current controls from the specified dom element.
     * @param ignored defines an ignored parameter kept for backward compatibility. If you want to define the source input element, you can set engine.inputElement before calling camera.attachControl
     */
    FreeCameraMouseInput.prototype.detachControl = function (ignored) {
        if (this._observer) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            if (this.onContextMenu) {
                var engine = this.camera.getEngine();
                var element = engine.getInputElement();
                element && element.removeEventListener("contextmenu", this.onContextMenu);
            }
            if (this.onPointerMovedObservable) {
                this.onPointerMovedObservable.clear();
            }
            this._observer = null;
            this._onMouseMove = null;
            this.previousPosition = null;
        }
    };
    /**
     * Gets the class name of the current intput.
     * @returns the class name
     */
    FreeCameraMouseInput.prototype.getClassName = function () {
        return "FreeCameraMouseInput";
    };
    /**
     * Get the friendly name associated with the input class.
     * @returns the input friendly name
     */
    FreeCameraMouseInput.prototype.getSimpleName = function () {
        return "mouse";
    };
    __decorate([
        serialize()
    ], FreeCameraMouseInput.prototype, "buttons", void 0);
    __decorate([
        serialize()
    ], FreeCameraMouseInput.prototype, "angularSensibility", void 0);
    return FreeCameraMouseInput;
}());
CameraInputTypes["FreeCameraMouseInput"] = FreeCameraMouseInput;

/**
 * Base class for mouse wheel input..
 * See FollowCameraMouseWheelInput in src/Cameras/Inputs/freeCameraMouseWheelInput.ts
 * for example usage.
 */
var BaseCameraMouseWheelInput = /** @class */ (function () {
    function BaseCameraMouseWheelInput() {
        /**
         * How fast is the camera moves in relation to X axis mouseWheel events.
         * Use negative value to reverse direction.
         */
        this.wheelPrecisionX = 3.0;
        /**
         * How fast is the camera moves in relation to Y axis mouseWheel events.
         * Use negative value to reverse direction.
         */
        this.wheelPrecisionY = 3.0;
        /**
         * How fast is the camera moves in relation to Z axis mouseWheel events.
         * Use negative value to reverse direction.
         */
        this.wheelPrecisionZ = 3.0;
        /**
         * Observable for when a mouse wheel move event occurs.
         */
        this.onChangedObservable = new Observable();
        /**
         * Incremental value of multiple mouse wheel movements of the X axis.
         * Should be zero-ed when read.
         */
        this._wheelDeltaX = 0;
        /**
         * Incremental value of multiple mouse wheel movements of the Y axis.
         * Should be zero-ed when read.
         */
        this._wheelDeltaY = 0;
        /**
         * Incremental value of multiple mouse wheel movements of the Z axis.
         * Should be zero-ed when read.
         */
        this._wheelDeltaZ = 0;
        /**
         * Firefox uses a different scheme to report scroll distances to other
         * browsers. Rather than use complicated methods to calculate the exact
         * multiple we need to apply, let's just cheat and use a constant.
         * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode
         * https://stackoverflow.com/questions/20110224/what-is-the-height-of-a-line-in-a-wheel-event-deltamode-dom-delta-line
         */
        this._ffMultiplier = 12;
        /**
         * Different event attributes for wheel data fall into a few set ranges.
         * Some relevant but dated date here:
         * https://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
         */
        this._normalize = 120;
    }
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param noPreventDefault Defines whether event caught by the controls
     *   should call preventdefault().
     *   (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    BaseCameraMouseWheelInput.prototype.attachControl = function (noPreventDefault) {
        var _this = this;
        noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
        this._wheel = function (pointer) {
            // sanity check - this should be a PointerWheel event.
            if (pointer.type !== PointerEventTypes.POINTERWHEEL) {
                return;
            }
            var event = pointer.event;
            var platformScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? _this._ffMultiplier : 1;
            if (event.deltaY !== undefined) {
                // Most recent browsers versions have delta properties.
                // Firefox >= v17  (Has WebGL >= v4)
                // Chrome >=  v31  (Has WebGL >= v8)
                // Edge >=    v12  (Has WebGl >= v12)
                // https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent
                _this._wheelDeltaX += (_this.wheelPrecisionX * platformScale * event.deltaX) / _this._normalize;
                _this._wheelDeltaY -= (_this.wheelPrecisionY * platformScale * event.deltaY) / _this._normalize;
                _this._wheelDeltaZ += (_this.wheelPrecisionZ * platformScale * event.deltaZ) / _this._normalize;
            }
            else if (event.wheelDeltaY !== undefined) {
                // Unsure whether these catch anything more. Documentation
                // online is contradictory.
                _this._wheelDeltaX += (_this.wheelPrecisionX * platformScale * event.wheelDeltaX) / _this._normalize;
                _this._wheelDeltaY -= (_this.wheelPrecisionY * platformScale * event.wheelDeltaY) / _this._normalize;
                _this._wheelDeltaZ += (_this.wheelPrecisionZ * platformScale * event.wheelDeltaZ) / _this._normalize;
            }
            else if (event.wheelDelta) {
                // IE >= v9   (Has WebGL >= v11)
                // Maybe others?
                _this._wheelDeltaY -= (_this.wheelPrecisionY * event.wheelDelta) / _this._normalize;
            }
            if (event.preventDefault) {
                if (!noPreventDefault) {
                    event.preventDefault();
                }
            }
        };
        this._observer = this.camera.getScene().onPointerObservable.add(this._wheel, PointerEventTypes.POINTERWHEEL);
    };
    /**
     * Detach the current controls from the specified dom element.
     * @param ignored defines an ignored parameter kept for backward compatibility. If you want to define the source input element, you can set engine.inputElement before calling camera.attachControl
     */
    BaseCameraMouseWheelInput.prototype.detachControl = function (ignored) {
        if (this._observer) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            this._observer = null;
            this._wheel = null;
        }
        if (this.onChangedObservable) {
            this.onChangedObservable.clear();
        }
    };
    /**
     * Called for each rendered frame.
     */
    BaseCameraMouseWheelInput.prototype.checkInputs = function () {
        this.onChangedObservable.notifyObservers({
            wheelDeltaX: this._wheelDeltaX,
            wheelDeltaY: this._wheelDeltaY,
            wheelDeltaZ: this._wheelDeltaZ,
        });
        // Clear deltas.
        this._wheelDeltaX = 0;
        this._wheelDeltaY = 0;
        this._wheelDeltaZ = 0;
    };
    /**
     * Gets the class name of the current intput.
     * @returns the class name
     */
    BaseCameraMouseWheelInput.prototype.getClassName = function () {
        return "BaseCameraMouseWheelInput";
    };
    /**
     * Get the friendly name associated with the input class.
     * @returns the input friendly name
     */
    BaseCameraMouseWheelInput.prototype.getSimpleName = function () {
        return "mousewheel";
    };
    __decorate([
        serialize()
    ], BaseCameraMouseWheelInput.prototype, "wheelPrecisionX", void 0);
    __decorate([
        serialize()
    ], BaseCameraMouseWheelInput.prototype, "wheelPrecisionY", void 0);
    __decorate([
        serialize()
    ], BaseCameraMouseWheelInput.prototype, "wheelPrecisionZ", void 0);
    return BaseCameraMouseWheelInput;
}());

var _CameraProperty;
(function (_CameraProperty) {
    _CameraProperty[_CameraProperty["MoveRelative"] = 0] = "MoveRelative";
    _CameraProperty[_CameraProperty["RotateRelative"] = 1] = "RotateRelative";
    _CameraProperty[_CameraProperty["MoveScene"] = 2] = "MoveScene";
})(_CameraProperty || (_CameraProperty = {}));
/**
 * Manage the mouse wheel inputs to control a free camera.
 * @see https://doc.babylonjs.com/how_to/customizing_camera_inputs
 */
var FreeCameraMouseWheelInput = /** @class */ (function (_super) {
    __extends(FreeCameraMouseWheelInput, _super);
    function FreeCameraMouseWheelInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._moveRelative = Vector3.Zero();
        _this._rotateRelative = Vector3.Zero();
        _this._moveScene = Vector3.Zero();
        /**
         * These are set to the desired default behaviour.
         */
        _this._wheelXAction = _CameraProperty.MoveRelative;
        _this._wheelXActionCoordinate = Coordinate.X;
        _this._wheelYAction = _CameraProperty.MoveRelative;
        _this._wheelYActionCoordinate = Coordinate.Z;
        _this._wheelZAction = null;
        _this._wheelZActionCoordinate = null;
        return _this;
    }
    /**
     * Gets the class name of the current input.
     * @returns the class name
     */
    FreeCameraMouseWheelInput.prototype.getClassName = function () {
        return "FreeCameraMouseWheelInput";
    };
    Object.defineProperty(FreeCameraMouseWheelInput.prototype, "wheelXMoveRelative", {
        /**
         * Get the configured movement axis (relative to camera's orientation) the
         * mouse wheel's X axis controls.
         * @returns The configured axis or null if none.
         */
        get: function () {
            if (this._wheelXAction !== _CameraProperty.MoveRelative) {
                return null;
            }
            return this._wheelXActionCoordinate;
        },
        /**
         * Set which movement axis (relative to camera's orientation) the mouse
         * wheel's X axis controls.
         * @param axis The axis to be moved. Set null to clear.
         */
        set: function (axis) {
            if (axis === null && this._wheelXAction !== _CameraProperty.MoveRelative) {
                // Attempting to clear different _wheelXAction.
                return;
            }
            this._wheelXAction = _CameraProperty.MoveRelative;
            this._wheelXActionCoordinate = axis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCameraMouseWheelInput.prototype, "wheelYMoveRelative", {
        /**
         * Get the configured movement axis (relative to camera's orientation) the
         * mouse wheel's Y axis controls.
         * @returns The configured axis or null if none.
         */
        get: function () {
            if (this._wheelYAction !== _CameraProperty.MoveRelative) {
                return null;
            }
            return this._wheelYActionCoordinate;
        },
        /**
         * Set which movement axis (relative to camera's orientation) the mouse
         * wheel's Y axis controls.
         * @param axis The axis to be moved. Set null to clear.
         */
        set: function (axis) {
            if (axis === null && this._wheelYAction !== _CameraProperty.MoveRelative) {
                // Attempting to clear different _wheelYAction.
                return;
            }
            this._wheelYAction = _CameraProperty.MoveRelative;
            this._wheelYActionCoordinate = axis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCameraMouseWheelInput.prototype, "wheelZMoveRelative", {
        /**
         * Get the configured movement axis (relative to camera's orientation) the
         * mouse wheel's Z axis controls.
         * @returns The configured axis or null if none.
         */
        get: function () {
            if (this._wheelZAction !== _CameraProperty.MoveRelative) {
                return null;
            }
            return this._wheelZActionCoordinate;
        },
        /**
         * Set which movement axis (relative to camera's orientation) the mouse
         * wheel's Z axis controls.
         * @param axis The axis to be moved. Set null to clear.
         */
        set: function (axis) {
            if (axis === null && this._wheelZAction !== _CameraProperty.MoveRelative) {
                // Attempting to clear different _wheelZAction.
                return;
            }
            this._wheelZAction = _CameraProperty.MoveRelative;
            this._wheelZActionCoordinate = axis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCameraMouseWheelInput.prototype, "wheelXRotateRelative", {
        /**
         * Get the configured rotation axis (relative to camera's orientation) the
         * mouse wheel's X axis controls.
         * @returns The configured axis or null if none.
         */
        get: function () {
            if (this._wheelXAction !== _CameraProperty.RotateRelative) {
                return null;
            }
            return this._wheelXActionCoordinate;
        },
        /**
         * Set which rotation axis (relative to camera's orientation) the mouse
         * wheel's X axis controls.
         * @param axis The axis to be moved. Set null to clear.
         */
        set: function (axis) {
            if (axis === null && this._wheelXAction !== _CameraProperty.RotateRelative) {
                // Attempting to clear different _wheelXAction.
                return;
            }
            this._wheelXAction = _CameraProperty.RotateRelative;
            this._wheelXActionCoordinate = axis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCameraMouseWheelInput.prototype, "wheelYRotateRelative", {
        /**
         * Get the configured rotation axis (relative to camera's orientation) the
         * mouse wheel's Y axis controls.
         * @returns The configured axis or null if none.
         */
        get: function () {
            if (this._wheelYAction !== _CameraProperty.RotateRelative) {
                return null;
            }
            return this._wheelYActionCoordinate;
        },
        /**
         * Set which rotation axis (relative to camera's orientation) the mouse
         * wheel's Y axis controls.
         * @param axis The axis to be moved. Set null to clear.
         */
        set: function (axis) {
            if (axis === null && this._wheelYAction !== _CameraProperty.RotateRelative) {
                // Attempting to clear different _wheelYAction.
                return;
            }
            this._wheelYAction = _CameraProperty.RotateRelative;
            this._wheelYActionCoordinate = axis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCameraMouseWheelInput.prototype, "wheelZRotateRelative", {
        /**
         * Get the configured rotation axis (relative to camera's orientation) the
         * mouse wheel's Z axis controls.
         * @returns The configured axis or null if none.
         */
        get: function () {
            if (this._wheelZAction !== _CameraProperty.RotateRelative) {
                return null;
            }
            return this._wheelZActionCoordinate;
        },
        /**
         * Set which rotation axis (relative to camera's orientation) the mouse
         * wheel's Z axis controls.
         * @param axis The axis to be moved. Set null to clear.
         */
        set: function (axis) {
            if (axis === null && this._wheelZAction !== _CameraProperty.RotateRelative) {
                // Attempting to clear different _wheelZAction.
                return;
            }
            this._wheelZAction = _CameraProperty.RotateRelative;
            this._wheelZActionCoordinate = axis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCameraMouseWheelInput.prototype, "wheelXMoveScene", {
        /**
         * Get the configured movement axis (relative to the scene) the mouse wheel's
         * X axis controls.
         * @returns The configured axis or null if none.
         */
        get: function () {
            if (this._wheelXAction !== _CameraProperty.MoveScene) {
                return null;
            }
            return this._wheelXActionCoordinate;
        },
        /**
         * Set which movement axis (relative to the scene) the mouse wheel's X axis
         * controls.
         * @param axis The axis to be moved. Set null to clear.
         */
        set: function (axis) {
            if (axis === null && this._wheelXAction !== _CameraProperty.MoveScene) {
                // Attempting to clear different _wheelXAction.
                return;
            }
            this._wheelXAction = _CameraProperty.MoveScene;
            this._wheelXActionCoordinate = axis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCameraMouseWheelInput.prototype, "wheelYMoveScene", {
        /**
         * Get the configured movement axis (relative to the scene) the mouse wheel's
         * Y axis controls.
         * @returns The configured axis or null if none.
         */
        get: function () {
            if (this._wheelYAction !== _CameraProperty.MoveScene) {
                return null;
            }
            return this._wheelYActionCoordinate;
        },
        /**
         * Set which movement axis (relative to the scene) the mouse wheel's Y axis
         * controls.
         * @param axis The axis to be moved. Set null to clear.
         */
        set: function (axis) {
            if (axis === null && this._wheelYAction !== _CameraProperty.MoveScene) {
                // Attempting to clear different _wheelYAction.
                return;
            }
            this._wheelYAction = _CameraProperty.MoveScene;
            this._wheelYActionCoordinate = axis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCameraMouseWheelInput.prototype, "wheelZMoveScene", {
        /**
         * Get the configured movement axis (relative to the scene) the mouse wheel's
         * Z axis controls.
         * @returns The configured axis or null if none.
         */
        get: function () {
            if (this._wheelZAction !== _CameraProperty.MoveScene) {
                return null;
            }
            return this._wheelZActionCoordinate;
        },
        /**
         * Set which movement axis (relative to the scene) the mouse wheel's Z axis
         * controls.
         * @param axis The axis to be moved. Set null to clear.
         */
        set: function (axis) {
            if (axis === null && this._wheelZAction !== _CameraProperty.MoveScene) {
                // Attempting to clear different _wheelZAction.
                return;
            }
            this._wheelZAction = _CameraProperty.MoveScene;
            this._wheelZActionCoordinate = axis;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Called for each rendered frame.
     */
    FreeCameraMouseWheelInput.prototype.checkInputs = function () {
        if (this._wheelDeltaX === 0 &&
            this._wheelDeltaY === 0 &&
            this._wheelDeltaZ == 0) {
            return;
        }
        // Clear the camera properties that we might be updating.
        this._moveRelative.setAll(0);
        this._rotateRelative.setAll(0);
        this._moveScene.setAll(0);
        // Set the camera properties that are to be updated.
        this._updateCamera();
        if (this.camera.getScene().useRightHandedSystem) {
            // TODO: Does this need done for worldUpdate too?
            this._moveRelative.z *= -1;
        }
        // Convert updates relative to camera to world position update.
        var cameraTransformMatrix = Matrix.Zero();
        this.camera.getViewMatrix().invertToRef(cameraTransformMatrix);
        var transformedDirection = Vector3.Zero();
        Vector3.TransformNormalToRef(this._moveRelative, cameraTransformMatrix, transformedDirection);
        // Apply updates to camera position.
        this.camera.cameraRotation.x += this._rotateRelative.x / 200;
        this.camera.cameraRotation.y += this._rotateRelative.y / 200;
        this.camera.cameraDirection.addInPlace(transformedDirection);
        this.camera.cameraDirection.addInPlace(this._moveScene);
        // Call the base class implementation to handle observers and do cleanup.
        _super.prototype.checkInputs.call(this);
    };
    /**
     * Update the camera according to any configured properties for the 3
     * mouse-wheel axis.
     */
    FreeCameraMouseWheelInput.prototype._updateCamera = function () {
        var moveRelative = this._moveRelative;
        var rotateRelative = this._rotateRelative;
        var moveScene = this._moveScene;
        var updateCameraProperty = function (/* Mouse-wheel delta. */ value, 
        /* Camera property to be changed. */
        cameraProperty, 
        /* Axis of Camera property to be changed. */
        coordinate) {
            if (value === 0) {
                // Mouse wheel has not moved.
                return;
            }
            if (cameraProperty === null || coordinate === null) {
                // Mouse wheel axis not configured.
                return;
            }
            var action = null;
            switch (cameraProperty) {
                case _CameraProperty.MoveRelative:
                    action = moveRelative;
                    break;
                case _CameraProperty.RotateRelative:
                    action = rotateRelative;
                    break;
                case _CameraProperty.MoveScene:
                    action = moveScene;
                    break;
            }
            switch (coordinate) {
                case Coordinate.X:
                    action.set(value, 0, 0);
                    break;
                case Coordinate.Y:
                    action.set(0, value, 0);
                    break;
                case Coordinate.Z:
                    action.set(0, 0, value);
                    break;
            }
        };
        // Do the camera updates for each of the 3 touch-wheel axis.
        updateCameraProperty(this._wheelDeltaX, this._wheelXAction, this._wheelXActionCoordinate);
        updateCameraProperty(this._wheelDeltaY, this._wheelYAction, this._wheelYActionCoordinate);
        updateCameraProperty(this._wheelDeltaZ, this._wheelZAction, this._wheelZActionCoordinate);
    };
    __decorate([
        serialize()
    ], FreeCameraMouseWheelInput.prototype, "wheelXMoveRelative", null);
    __decorate([
        serialize()
    ], FreeCameraMouseWheelInput.prototype, "wheelYMoveRelative", null);
    __decorate([
        serialize()
    ], FreeCameraMouseWheelInput.prototype, "wheelZMoveRelative", null);
    __decorate([
        serialize()
    ], FreeCameraMouseWheelInput.prototype, "wheelXRotateRelative", null);
    __decorate([
        serialize()
    ], FreeCameraMouseWheelInput.prototype, "wheelYRotateRelative", null);
    __decorate([
        serialize()
    ], FreeCameraMouseWheelInput.prototype, "wheelZRotateRelative", null);
    __decorate([
        serialize()
    ], FreeCameraMouseWheelInput.prototype, "wheelXMoveScene", null);
    __decorate([
        serialize()
    ], FreeCameraMouseWheelInput.prototype, "wheelYMoveScene", null);
    __decorate([
        serialize()
    ], FreeCameraMouseWheelInput.prototype, "wheelZMoveScene", null);
    return FreeCameraMouseWheelInput;
}(BaseCameraMouseWheelInput));
CameraInputTypes["FreeCameraMouseWheelInput"] = FreeCameraMouseWheelInput;

/**
 * Manage the touch inputs to control the movement of a free camera.
 * @see https://doc.babylonjs.com/how_to/customizing_camera_inputs
 */
var FreeCameraTouchInput = /** @class */ (function () {
    /**
     * Manage the touch inputs to control the movement of a free camera.
     * @see https://doc.babylonjs.com/how_to/customizing_camera_inputs
     * @param allowMouse Defines if mouse events can be treated as touch events
     */
    function FreeCameraTouchInput(
    /**
     * Define if mouse events can be treated as touch events
     */
    allowMouse) {
        if (allowMouse === void 0) { allowMouse = false; }
        this.allowMouse = allowMouse;
        /**
         * Defines the touch sensibility for rotation.
         * The higher the faster.
         */
        this.touchAngularSensibility = 200000.0;
        /**
         * Defines the touch sensibility for move.
         * The higher the faster.
         */
        this.touchMoveSensibility = 250.0;
        this._offsetX = null;
        this._offsetY = null;
        this._pointerPressed = new Array();
    }
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    FreeCameraTouchInput.prototype.attachControl = function (noPreventDefault) {
        var _this = this;
        noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
        var previousPosition = null;
        if (this._pointerInput === undefined) {
            this._onLostFocus = function () {
                _this._offsetX = null;
                _this._offsetY = null;
            };
            this._pointerInput = function (p) {
                var evt = p.event;
                var isMouseEvent = !_this.camera.getEngine().hostInformation.isMobile && evt instanceof MouseEvent;
                if (!_this.allowMouse && (evt.pointerType === "mouse" || isMouseEvent)) {
                    return;
                }
                if (p.type === PointerEventTypes.POINTERDOWN) {
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                    _this._pointerPressed.push(evt.pointerId);
                    if (_this._pointerPressed.length !== 1) {
                        return;
                    }
                    previousPosition = {
                        x: evt.clientX,
                        y: evt.clientY,
                    };
                }
                else if (p.type === PointerEventTypes.POINTERUP) {
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                    var index = _this._pointerPressed.indexOf(evt.pointerId);
                    if (index === -1) {
                        return;
                    }
                    _this._pointerPressed.splice(index, 1);
                    if (index != 0) {
                        return;
                    }
                    previousPosition = null;
                    _this._offsetX = null;
                    _this._offsetY = null;
                }
                else if (p.type === PointerEventTypes.POINTERMOVE) {
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                    if (!previousPosition) {
                        return;
                    }
                    var index = _this._pointerPressed.indexOf(evt.pointerId);
                    if (index != 0) {
                        return;
                    }
                    _this._offsetX = evt.clientX - previousPosition.x;
                    _this._offsetY = -(evt.clientY - previousPosition.y);
                }
            };
        }
        this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE);
        if (this._onLostFocus) {
            var engine = this.camera.getEngine();
            var element = engine.getInputElement();
            element && element.addEventListener("blur", this._onLostFocus);
        }
    };
    /**
     * Detach the current controls from the specified dom element.
     * @param ignored defines an ignored parameter kept for backward compatibility. If you want to define the source input element, you can set engine.inputElement before calling camera.attachControl
     */
    FreeCameraTouchInput.prototype.detachControl = function (ignored) {
        if (this._pointerInput) {
            if (this._observer) {
                this.camera.getScene().onPointerObservable.remove(this._observer);
                this._observer = null;
            }
            if (this._onLostFocus) {
                var engine = this.camera.getEngine();
                var element = engine.getInputElement();
                element && element.removeEventListener("blur", this._onLostFocus);
                this._onLostFocus = null;
            }
            this._pointerPressed = [];
            this._offsetX = null;
            this._offsetY = null;
        }
    };
    /**
     * Update the current camera state depending on the inputs that have been used this frame.
     * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
     */
    FreeCameraTouchInput.prototype.checkInputs = function () {
        if (this._offsetX === null || this._offsetY === null) {
            return;
        }
        if (this._offsetX === 0 && this._offsetY === 0) {
            return;
        }
        var camera = this.camera;
        camera.cameraRotation.y = this._offsetX / this.touchAngularSensibility;
        if (this._pointerPressed.length > 1) {
            camera.cameraRotation.x = -this._offsetY / this.touchAngularSensibility;
        }
        else {
            var speed = camera._computeLocalCameraSpeed();
            var direction = new Vector3(0, 0, (speed * this._offsetY) / this.touchMoveSensibility);
            Matrix.RotationYawPitchRollToRef(camera.rotation.y, camera.rotation.x, 0, camera._cameraRotationMatrix);
            camera.cameraDirection.addInPlace(Vector3.TransformCoordinates(direction, camera._cameraRotationMatrix));
        }
    };
    /**
     * Gets the class name of the current intput.
     * @returns the class name
     */
    FreeCameraTouchInput.prototype.getClassName = function () {
        return "FreeCameraTouchInput";
    };
    /**
     * Get the friendly name associated with the input class.
     * @returns the input friendly name
     */
    FreeCameraTouchInput.prototype.getSimpleName = function () {
        return "touch";
    };
    __decorate([
        serialize()
    ], FreeCameraTouchInput.prototype, "touchAngularSensibility", void 0);
    __decorate([
        serialize()
    ], FreeCameraTouchInput.prototype, "touchMoveSensibility", void 0);
    return FreeCameraTouchInput;
}());
CameraInputTypes["FreeCameraTouchInput"] = FreeCameraTouchInput;

/**
 * Default Inputs manager for the FreeCamera.
 * It groups all the default supported inputs for ease of use.
 * @see https://doc.babylonjs.com/how_to/customizing_camera_inputs
 */
var FreeCameraInputsManager = /** @class */ (function (_super) {
    __extends(FreeCameraInputsManager, _super);
    /**
     * Instantiates a new FreeCameraInputsManager.
     * @param camera Defines the camera the inputs belong to
     */
    function FreeCameraInputsManager(camera) {
        var _this = _super.call(this, camera) || this;
        /**
         * @hidden
         */
        _this._mouseInput = null;
        /**
         * @hidden
         */
        _this._mouseWheelInput = null;
        return _this;
    }
    /**
     * Add keyboard input support to the input manager.
     * @returns the current input manager
     */
    FreeCameraInputsManager.prototype.addKeyboard = function () {
        this.add(new FreeCameraKeyboardMoveInput());
        return this;
    };
    /**
     * Add mouse input support to the input manager.
     * @param touchEnabled if the FreeCameraMouseInput should support touch (default: true)
     * @returns the current input manager
     */
    FreeCameraInputsManager.prototype.addMouse = function (touchEnabled) {
        if (touchEnabled === void 0) { touchEnabled = true; }
        if (!this._mouseInput) {
            this._mouseInput = new FreeCameraMouseInput(touchEnabled);
            this.add(this._mouseInput);
        }
        return this;
    };
    /**
     * Removes the mouse input support from the manager
     * @returns the current input manager
     */
    FreeCameraInputsManager.prototype.removeMouse = function () {
        if (this._mouseInput) {
            this.remove(this._mouseInput);
        }
        return this;
    };
    /**
     * Add mouse wheel input support to the input manager.
     * @returns the current input manager
     */
    FreeCameraInputsManager.prototype.addMouseWheel = function () {
        if (!this._mouseWheelInput) {
            this._mouseWheelInput = new FreeCameraMouseWheelInput();
            this.add(this._mouseWheelInput);
        }
        return this;
    };
    /**
     * Removes the mouse wheel input support from the manager
     * @returns the current input manager
     */
    FreeCameraInputsManager.prototype.removeMouseWheel = function () {
        if (this._mouseWheelInput) {
            this.remove(this._mouseWheelInput);
        }
        return this;
    };
    /**
     * Add touch input support to the input manager.
     * @returns the current input manager
     */
    FreeCameraInputsManager.prototype.addTouch = function () {
        this.add(new FreeCameraTouchInput());
        return this;
    };
    /**
     * Remove all attached input methods from a camera
     */
    FreeCameraInputsManager.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this._mouseInput = null;
    };
    return FreeCameraInputsManager;
}(CameraInputsManager));

/**
 * This represents a free type of camera. It can be useful in First Person Shooter game for instance.
 * Please consider using the new UniversalCamera instead as it adds more functionality like the gamepad.
 * @see https://doc.babylonjs.com/features/cameras#universal-camera
 */
var FreeCamera = /** @class */ (function (_super) {
    __extends(FreeCamera, _super);
    /**
     * Instantiates a Free Camera.
     * This represents a free type of camera. It can be useful in First Person Shooter game for instance.
     * Please consider using the new UniversalCamera instead as it adds more functionality like touch to this camera.
     * @see https://doc.babylonjs.com/features/cameras#universal-camera
     * @param name Define the name of the camera in the scene
     * @param position Define the start position of the camera in the scene
     * @param scene Define the scene the camera belongs to
     * @param setActiveOnSceneIfNoneActive Defines wheter the camera should be marked as active if not other active cameras have been defined
     */
    function FreeCamera(name, position, scene, setActiveOnSceneIfNoneActive) {
        if (setActiveOnSceneIfNoneActive === void 0) { setActiveOnSceneIfNoneActive = true; }
        var _this = _super.call(this, name, position, scene, setActiveOnSceneIfNoneActive) || this;
        /**
         * Define the collision ellipsoid of the camera.
         * This is helpful to simulate a camera body like the player body around the camera
         * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity#arcrotatecamera
         */
        _this.ellipsoid = new Vector3(0.5, 1, 0.5);
        /**
         * Define an offset for the position of the ellipsoid around the camera.
         * This can be helpful to determine the center of the body near the gravity center of the body
         * instead of its head.
         */
        _this.ellipsoidOffset = new Vector3(0, 0, 0);
        /**
         * Enable or disable collisions of the camera with the rest of the scene objects.
         */
        _this.checkCollisions = false;
        /**
         * Enable or disable gravity on the camera.
         */
        _this.applyGravity = false;
        _this._needMoveForGravity = false;
        _this._oldPosition = Vector3.Zero();
        _this._diffPosition = Vector3.Zero();
        _this._newPosition = Vector3.Zero();
        // Collisions
        _this._collisionMask = -1;
        _this._onCollisionPositionChange = function (collisionId, newPosition, collidedMesh) {
            if (collidedMesh === void 0) { collidedMesh = null; }
            var updatePosition = function (newPos) {
                _this._newPosition.copyFrom(newPos);
                _this._newPosition.subtractToRef(_this._oldPosition, _this._diffPosition);
                if (_this._diffPosition.length() > Engine.CollisionsEpsilon) {
                    _this.position.addInPlace(_this._diffPosition);
                    if (_this.onCollide && collidedMesh) {
                        _this.onCollide(collidedMesh);
                    }
                }
            };
            updatePosition(newPosition);
        };
        _this.inputs = new FreeCameraInputsManager(_this);
        _this.inputs.addKeyboard().addMouse();
        return _this;
    }
    Object.defineProperty(FreeCamera.prototype, "angularSensibility", {
        /**
         * Gets the input sensibility for a mouse input. (default is 2000.0)
         * Higher values reduce sensitivity.
         */
        get: function () {
            var mouse = this.inputs.attached["mouse"];
            if (mouse) {
                return mouse.angularSensibility;
            }
            return 0;
        },
        /**
         * Sets the input sensibility for a mouse input. (default is 2000.0)
         * Higher values reduce sensitivity.
         */
        set: function (value) {
            var mouse = this.inputs.attached["mouse"];
            if (mouse) {
                mouse.angularSensibility = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCamera.prototype, "keysUp", {
        /**
         * Gets or Set the list of keyboard keys used to control the forward move of the camera.
         */
        get: function () {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                return keyboard.keysUp;
            }
            return [];
        },
        set: function (value) {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                keyboard.keysUp = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCamera.prototype, "keysUpward", {
        /**
         * Gets or Set the list of keyboard keys used to control the upward move of the camera.
         */
        get: function () {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                return keyboard.keysUpward;
            }
            return [];
        },
        set: function (value) {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                keyboard.keysUpward = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCamera.prototype, "keysDown", {
        /**
         * Gets or Set the list of keyboard keys used to control the backward move of the camera.
         */
        get: function () {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                return keyboard.keysDown;
            }
            return [];
        },
        set: function (value) {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                keyboard.keysDown = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCamera.prototype, "keysDownward", {
        /**
        * Gets or Set the list of keyboard keys used to control the downward move of the camera.
        */
        get: function () {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                return keyboard.keysDownward;
            }
            return [];
        },
        set: function (value) {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                keyboard.keysDownward = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCamera.prototype, "keysLeft", {
        /**
         * Gets or Set the list of keyboard keys used to control the left strafe move of the camera.
         */
        get: function () {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                return keyboard.keysLeft;
            }
            return [];
        },
        set: function (value) {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                keyboard.keysLeft = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FreeCamera.prototype, "keysRight", {
        /**
         * Gets or Set the list of keyboard keys used to control the right strafe move of the camera.
         */
        get: function () {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                return keyboard.keysRight;
            }
            return [];
        },
        set: function (value) {
            var keyboard = this.inputs.attached["keyboard"];
            if (keyboard) {
                keyboard.keysRight = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Attached controls to the current camera.
     * @param ignored defines an ignored parameter kept for backward compatibility. If you want to define the source input element, you can set engine.inputElement before calling camera.attachControl
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    FreeCamera.prototype.attachControl = function (ignored, noPreventDefault) {
        noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
        this.inputs.attachElement(noPreventDefault);
    };
    /**
     * Detach the current controls from the specified dom element.
     * @param ignored defines an ignored parameter kept for backward compatibility. If you want to define the source input element, you can set engine.inputElement before calling camera.attachControl
     */
    FreeCamera.prototype.detachControl = function (ignored) {
        this.inputs.detachElement();
        this.cameraDirection = new Vector3(0, 0, 0);
        this.cameraRotation = new Vector2(0, 0);
    };
    Object.defineProperty(FreeCamera.prototype, "collisionMask", {
        /**
         * Define a collision mask to limit the list of object the camera can collide with
         */
        get: function () {
            return this._collisionMask;
        },
        set: function (mask) {
            this._collisionMask = !isNaN(mask) ? mask : -1;
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    FreeCamera.prototype._collideWithWorld = function (displacement) {
        var globalPosition;
        if (this.parent) {
            globalPosition = Vector3.TransformCoordinates(this.position, this.parent.getWorldMatrix());
        }
        else {
            globalPosition = this.position;
        }
        globalPosition.subtractFromFloatsToRef(0, this.ellipsoid.y, 0, this._oldPosition);
        this._oldPosition.addInPlace(this.ellipsoidOffset);
        var coordinator = this.getScene().collisionCoordinator;
        if (!this._collider) {
            this._collider = coordinator.createCollider();
        }
        this._collider._radius = this.ellipsoid;
        this._collider.collisionMask = this._collisionMask;
        //no need for clone, as long as gravity is not on.
        var actualDisplacement = displacement;
        //add gravity to the direction to prevent the dual-collision checking
        if (this.applyGravity) {
            //this prevents mending with cameraDirection, a global variable of the free camera class.
            actualDisplacement = displacement.add(this.getScene().gravity);
        }
        coordinator.getNewPosition(this._oldPosition, actualDisplacement, this._collider, 3, null, this._onCollisionPositionChange, this.uniqueId);
    };
    /** @hidden */
    FreeCamera.prototype._checkInputs = function () {
        if (!this._localDirection) {
            this._localDirection = Vector3.Zero();
            this._transformedDirection = Vector3.Zero();
        }
        this.inputs.checkInputs();
        _super.prototype._checkInputs.call(this);
    };
    /** @hidden */
    FreeCamera.prototype._decideIfNeedsToMove = function () {
        return this._needMoveForGravity || Math.abs(this.cameraDirection.x) > 0 || Math.abs(this.cameraDirection.y) > 0 || Math.abs(this.cameraDirection.z) > 0;
    };
    /** @hidden */
    FreeCamera.prototype._updatePosition = function () {
        if (this.checkCollisions && this.getScene().collisionsEnabled) {
            this._collideWithWorld(this.cameraDirection);
        }
        else {
            _super.prototype._updatePosition.call(this);
        }
    };
    /**
     * Destroy the camera and release the current resources hold by it.
     */
    FreeCamera.prototype.dispose = function () {
        this.inputs.clear();
        _super.prototype.dispose.call(this);
    };
    /**
     * Gets the current object class name.
     * @return the class name
     */
    FreeCamera.prototype.getClassName = function () {
        return "FreeCamera";
    };
    __decorate([
        serializeAsVector3()
    ], FreeCamera.prototype, "ellipsoid", void 0);
    __decorate([
        serializeAsVector3()
    ], FreeCamera.prototype, "ellipsoidOffset", void 0);
    __decorate([
        serialize()
    ], FreeCamera.prototype, "checkCollisions", void 0);
    __decorate([
        serialize()
    ], FreeCamera.prototype, "applyGravity", void 0);
    return FreeCamera;
}(TargetCamera));

export { CameraInputTypes as C, FreeCamera as F, TargetCamera as T, CameraInputsManager as a, FreeCameraInputsManager as b, FreeCameraKeyboardMoveInput as c, FreeCameraMouseInput as d, FreeCameraMouseWheelInput as e, FreeCameraTouchInput as f };
