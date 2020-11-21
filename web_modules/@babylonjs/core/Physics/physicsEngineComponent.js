import { L as Logger, O as Observable } from '../../../common/thinEngine-e576a091.js';
import '../../../common/node-87d9c658.js';
import '../../../common/math.color-fc6e801e.js';
import '../../../common/performanceConfigurator-115fd081.js';
import '../../../common/engine-9a1b5aa7.js';
import '../../../common/pointerEvents-12a2451c.js';
import '../../../common/tools-ab6f1dea.js';
import '../../../common/guid-495ff9c7.js';
import '../../../common/math.frustum-2cd1d420.js';
import '../../../common/math.axis-e7db27a6.js';
import { S as Scene } from '../../../common/scene-cbeb8ae2.js';
import { d as SceneComponentConstants, A as AbstractMesh } from '../../../common/sceneComponent-5502b64a.js';
import '../../../common/uniformBuffer-e700d3a6.js';
import '../../../common/light-a23926e9.js';
import { P as PhysicsJoint } from '../../../common/physicsJoint-3c3d48cb.js';
import { P as PhysicsEngine } from '../../../common/physicsEngine-9650ba74.js';

/**
 * Gets the current physics engine
 * @returns a IPhysicsEngine or null if none attached
 */
Scene.prototype.getPhysicsEngine = function () {
    return this._physicsEngine;
};
/**
 * Enables physics to the current scene
 * @param gravity defines the scene's gravity for the physics engine
 * @param plugin defines the physics engine to be used. defaults to OimoJS.
 * @return a boolean indicating if the physics engine was initialized
 */
Scene.prototype.enablePhysics = function (gravity, plugin) {
    if (gravity === void 0) { gravity = null; }
    if (this._physicsEngine) {
        return true;
    }
    // Register the component to the scene
    var component = this._getComponent(SceneComponentConstants.NAME_PHYSICSENGINE);
    if (!component) {
        component = new PhysicsEngineSceneComponent(this);
        this._addComponent(component);
    }
    try {
        this._physicsEngine = new PhysicsEngine(gravity, plugin);
        this._physicsTimeAccumulator = 0;
        return true;
    }
    catch (e) {
        Logger.Error(e.message);
        return false;
    }
};
/**
 * Disables and disposes the physics engine associated with the scene
 */
Scene.prototype.disablePhysicsEngine = function () {
    if (!this._physicsEngine) {
        return;
    }
    this._physicsEngine.dispose();
    this._physicsEngine = null;
};
/**
 * Gets a boolean indicating if there is an active physics engine
 * @returns a boolean indicating if there is an active physics engine
 */
Scene.prototype.isPhysicsEnabled = function () {
    return this._physicsEngine !== undefined;
};
/**
 * Deletes a physics compound impostor
 * @param compound defines the compound to delete
 */
Scene.prototype.deleteCompoundImpostor = function (compound) {
    var mesh = compound.parts[0].mesh;
    if (mesh.physicsImpostor) {
        mesh.physicsImpostor.dispose( /*true*/);
        mesh.physicsImpostor = null;
    }
};
/** @hidden */
Scene.prototype._advancePhysicsEngineStep = function (step) {
    if (this._physicsEngine) {
        var subTime = this._physicsEngine.getSubTimeStep();
        if (subTime > 0) {
            this._physicsTimeAccumulator += step;
            while (this._physicsTimeAccumulator > subTime) {
                this.onBeforePhysicsObservable.notifyObservers(this);
                this._physicsEngine._step(subTime / 1000);
                this.onAfterPhysicsObservable.notifyObservers(this);
                this._physicsTimeAccumulator -= subTime;
            }
        }
        else {
            this.onBeforePhysicsObservable.notifyObservers(this);
            this._physicsEngine._step(step / 1000);
            this.onAfterPhysicsObservable.notifyObservers(this);
        }
    }
};
Object.defineProperty(AbstractMesh.prototype, "physicsImpostor", {
    get: function () {
        return this._physicsImpostor;
    },
    set: function (value) {
        var _this = this;
        if (this._physicsImpostor === value) {
            return;
        }
        if (this._disposePhysicsObserver) {
            this.onDisposeObservable.remove(this._disposePhysicsObserver);
        }
        this._physicsImpostor = value;
        if (value) {
            this._disposePhysicsObserver = this.onDisposeObservable.add(function () {
                // Physics
                if (_this.physicsImpostor) {
                    _this.physicsImpostor.dispose( /*!doNotRecurse*/);
                    _this.physicsImpostor = null;
                }
            });
        }
    },
    enumerable: true,
    configurable: true
});
/**
 * Gets the current physics impostor
 * @see https://doc.babylonjs.com/features/physics_engine
 * @returns a physics impostor or null
 */
AbstractMesh.prototype.getPhysicsImpostor = function () {
    return this.physicsImpostor;
};
/**
 * Apply a physic impulse to the mesh
 * @param force defines the force to apply
 * @param contactPoint defines where to apply the force
 * @returns the current mesh
 * @see https://doc.babylonjs.com/how_to/using_the_physics_engine
 */
AbstractMesh.prototype.applyImpulse = function (force, contactPoint) {
    if (!this.physicsImpostor) {
        return this;
    }
    this.physicsImpostor.applyImpulse(force, contactPoint);
    return this;
};
/**
 * Creates a physic joint between two meshes
 * @param otherMesh defines the other mesh to use
 * @param pivot1 defines the pivot to use on this mesh
 * @param pivot2 defines the pivot to use on the other mesh
 * @param options defines additional options (can be plugin dependent)
 * @returns the current mesh
 * @see https://www.babylonjs-playground.com/#0BS5U0#0
 */
AbstractMesh.prototype.setPhysicsLinkWith = function (otherMesh, pivot1, pivot2, options) {
    if (!this.physicsImpostor || !otherMesh.physicsImpostor) {
        return this;
    }
    this.physicsImpostor.createJoint(otherMesh.physicsImpostor, PhysicsJoint.HingeJoint, {
        mainPivot: pivot1,
        connectedPivot: pivot2,
        nativeParams: options
    });
    return this;
};
/**
 * Defines the physics engine scene component responsible to manage a physics engine
 */
var PhysicsEngineSceneComponent = /** @class */ (function () {
    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    function PhysicsEngineSceneComponent(scene) {
        var _this = this;
        /**
         * The component name helpful to identify the component in the list of scene components.
         */
        this.name = SceneComponentConstants.NAME_PHYSICSENGINE;
        this.scene = scene;
        this.scene.onBeforePhysicsObservable = new Observable();
        this.scene.onAfterPhysicsObservable = new Observable();
        // Replace the function used to get the deterministic frame time
        this.scene.getDeterministicFrameTime = function () {
            if (_this.scene._physicsEngine) {
                return _this.scene._physicsEngine.getTimeStep() * 1000;
            }
            return 1000.0 / 60.0;
        };
    }
    /**
     * Registers the component in a given scene
     */
    PhysicsEngineSceneComponent.prototype.register = function () {
    };
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    PhysicsEngineSceneComponent.prototype.rebuild = function () {
        // Nothing to do for this component
    };
    /**
     * Disposes the component and the associated ressources
     */
    PhysicsEngineSceneComponent.prototype.dispose = function () {
        this.scene.onBeforePhysicsObservable.clear();
        this.scene.onAfterPhysicsObservable.clear();
        if (this.scene._physicsEngine) {
            this.scene.disablePhysicsEngine();
        }
    };
    return PhysicsEngineSceneComponent;
}());

export { PhysicsEngineSceneComponent };
