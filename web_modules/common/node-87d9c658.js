import { b as _DevTools, a as __decorate, O as Observable, E as EngineStore } from './thinEngine-e576a091.js';
import { M as Matrix, Q as Quaternion, C as Color4, V as Vector3, a as Vector2, b as Color3 } from './math.color-fc6e801e.js';

/**
 * Class used to evalaute queries containing `and` and `or` operators
 */
var AndOrNotEvaluator = /** @class */ (function () {
    function AndOrNotEvaluator() {
    }
    /**
     * Evaluate a query
     * @param query defines the query to evaluate
     * @param evaluateCallback defines the callback used to filter result
     * @returns true if the query matches
     */
    AndOrNotEvaluator.Eval = function (query, evaluateCallback) {
        if (!query.match(/\([^\(\)]*\)/g)) {
            query = AndOrNotEvaluator._HandleParenthesisContent(query, evaluateCallback);
        }
        else {
            query = query.replace(/\([^\(\)]*\)/g, function (r) {
                // remove parenthesis
                r = r.slice(1, r.length - 1);
                return AndOrNotEvaluator._HandleParenthesisContent(r, evaluateCallback);
            });
        }
        if (query === "true") {
            return true;
        }
        if (query === "false") {
            return false;
        }
        return AndOrNotEvaluator.Eval(query, evaluateCallback);
    };
    AndOrNotEvaluator._HandleParenthesisContent = function (parenthesisContent, evaluateCallback) {
        evaluateCallback = evaluateCallback || (function (r) {
            return r === "true" ? true : false;
        });
        var result;
        var or = parenthesisContent.split("||");
        for (var i in or) {
            if (or.hasOwnProperty(i)) {
                var ori = AndOrNotEvaluator._SimplifyNegation(or[i].trim());
                var and = ori.split("&&");
                if (and.length > 1) {
                    for (var j = 0; j < and.length; ++j) {
                        var andj = AndOrNotEvaluator._SimplifyNegation(and[j].trim());
                        if (andj !== "true" && andj !== "false") {
                            if (andj[0] === "!") {
                                result = !evaluateCallback(andj.substring(1));
                            }
                            else {
                                result = evaluateCallback(andj);
                            }
                        }
                        else {
                            result = andj === "true" ? true : false;
                        }
                        if (!result) { // no need to continue since 'false && ... && ...' will always return false
                            ori = "false";
                            break;
                        }
                    }
                }
                if (result || ori === "true") { // no need to continue since 'true || ... || ...' will always return true
                    result = true;
                    break;
                }
                // result equals false (or undefined)
                if (ori !== "true" && ori !== "false") {
                    if (ori[0] === "!") {
                        result = !evaluateCallback(ori.substring(1));
                    }
                    else {
                        result = evaluateCallback(ori);
                    }
                }
                else {
                    result = ori === "true" ? true : false;
                }
            }
        }
        // the whole parenthesis scope is replaced by 'true' or 'false'
        return result ? "true" : "false";
    };
    AndOrNotEvaluator._SimplifyNegation = function (booleanString) {
        booleanString = booleanString.replace(/^[\s!]+/, function (r) {
            // remove whitespaces
            r = r.replace(/[\s]/g, function () { return ""; });
            return r.length % 2 ? "!" : "";
        });
        booleanString = booleanString.trim();
        if (booleanString === "!true") {
            booleanString = "false";
        }
        else if (booleanString === "!false") {
            booleanString = "true";
        }
        return booleanString;
    };
    return AndOrNotEvaluator;
}());

/**
 * Class used to store custom tags
 */
var Tags = /** @class */ (function () {
    function Tags() {
    }
    /**
     * Adds support for tags on the given object
     * @param obj defines the object to use
     */
    Tags.EnableFor = function (obj) {
        obj._tags = obj._tags || {};
        obj.hasTags = function () {
            return Tags.HasTags(obj);
        };
        obj.addTags = function (tagsString) {
            return Tags.AddTagsTo(obj, tagsString);
        };
        obj.removeTags = function (tagsString) {
            return Tags.RemoveTagsFrom(obj, tagsString);
        };
        obj.matchesTagsQuery = function (tagsQuery) {
            return Tags.MatchesQuery(obj, tagsQuery);
        };
    };
    /**
     * Removes tags support
     * @param obj defines the object to use
     */
    Tags.DisableFor = function (obj) {
        delete obj._tags;
        delete obj.hasTags;
        delete obj.addTags;
        delete obj.removeTags;
        delete obj.matchesTagsQuery;
    };
    /**
     * Gets a boolean indicating if the given object has tags
     * @param obj defines the object to use
     * @returns a boolean
     */
    Tags.HasTags = function (obj) {
        if (!obj._tags) {
            return false;
        }
        var tags = obj._tags;
        for (var i in tags) {
            if (tags.hasOwnProperty(i)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Gets the tags available on a given object
     * @param obj defines the object to use
     * @param asString defines if the tags must be returned as a string instead of an array of strings
     * @returns the tags
     */
    Tags.GetTags = function (obj, asString) {
        if (asString === void 0) { asString = true; }
        if (!obj._tags) {
            return null;
        }
        if (asString) {
            var tagsArray = [];
            for (var tag in obj._tags) {
                if (obj._tags.hasOwnProperty(tag) && obj._tags[tag] === true) {
                    tagsArray.push(tag);
                }
            }
            return tagsArray.join(" ");
        }
        else {
            return obj._tags;
        }
    };
    /**
     * Adds tags to an object
     * @param obj defines the object to use
     * @param tagsString defines the tag string. The tags 'true' and 'false' are reserved and cannot be used as tags.
     * A tag cannot start with '||', '&&', and '!'. It cannot contain whitespaces
     */
    Tags.AddTagsTo = function (obj, tagsString) {
        if (!tagsString) {
            return;
        }
        if (typeof tagsString !== "string") {
            return;
        }
        var tags = tagsString.split(" ");
        tags.forEach(function (tag, index, array) {
            Tags._AddTagTo(obj, tag);
        });
    };
    /**
     * @hidden
     */
    Tags._AddTagTo = function (obj, tag) {
        tag = tag.trim();
        if (tag === "" || tag === "true" || tag === "false") {
            return;
        }
        if (tag.match(/[\s]/) || tag.match(/^([!]|([|]|[&]){2})/)) {
            return;
        }
        Tags.EnableFor(obj);
        obj._tags[tag] = true;
    };
    /**
     * Removes specific tags from a specific object
     * @param obj defines the object to use
     * @param tagsString defines the tags to remove
     */
    Tags.RemoveTagsFrom = function (obj, tagsString) {
        if (!Tags.HasTags(obj)) {
            return;
        }
        var tags = tagsString.split(" ");
        for (var t in tags) {
            Tags._RemoveTagFrom(obj, tags[t]);
        }
    };
    /**
     * @hidden
     */
    Tags._RemoveTagFrom = function (obj, tag) {
        delete obj._tags[tag];
    };
    /**
     * Defines if tags hosted on an object match a given query
     * @param obj defines the object to use
     * @param tagsQuery defines the tag query
     * @returns a boolean
     */
    Tags.MatchesQuery = function (obj, tagsQuery) {
        if (tagsQuery === undefined) {
            return true;
        }
        if (tagsQuery === "") {
            return Tags.HasTags(obj);
        }
        return AndOrNotEvaluator.Eval(tagsQuery, function (r) { return Tags.HasTags(obj) && obj._tags[r]; });
    };
    return Tags;
}());

var __decoratorInitialStore = {};
var __mergedStore = {};
var _copySource = function (creationFunction, source, instanciate) {
    var destination = creationFunction();
    // Tags
    if (Tags) {
        Tags.AddTagsTo(destination, source.tags);
    }
    var classStore = getMergedStore(destination);
    // Properties
    for (var property in classStore) {
        var propertyDescriptor = classStore[property];
        var sourceProperty = source[property];
        var propertyType = propertyDescriptor.type;
        if (sourceProperty !== undefined && sourceProperty !== null && property !== "uniqueId") {
            switch (propertyType) {
                case 0: // Value
                case 6: // Mesh reference
                case 11: // Camera reference
                    destination[property] = sourceProperty;
                    break;
                case 1: // Texture
                    destination[property] = (instanciate || sourceProperty.isRenderTarget) ? sourceProperty : sourceProperty.clone();
                    break;
                case 2: // Color3
                case 3: // FresnelParameters
                case 4: // Vector2
                case 5: // Vector3
                case 7: // Color Curves
                case 10: // Quaternion
                case 12: // Matrix
                    destination[property] = instanciate ? sourceProperty : sourceProperty.clone();
                    break;
            }
        }
    }
    return destination;
};
function getDirectStore(target) {
    var classKey = target.getClassName();
    if (!__decoratorInitialStore[classKey]) {
        __decoratorInitialStore[classKey] = {};
    }
    return __decoratorInitialStore[classKey];
}
/**
 * Return the list of properties flagged as serializable
 * @param target: host object
 */
function getMergedStore(target) {
    var classKey = target.getClassName();
    if (__mergedStore[classKey]) {
        return __mergedStore[classKey];
    }
    __mergedStore[classKey] = {};
    var store = __mergedStore[classKey];
    var currentTarget = target;
    var currentKey = classKey;
    while (currentKey) {
        var initialStore = __decoratorInitialStore[currentKey];
        for (var property in initialStore) {
            store[property] = initialStore[property];
        }
        var parent_1 = void 0;
        var done = false;
        do {
            parent_1 = Object.getPrototypeOf(currentTarget);
            if (!parent_1.getClassName) {
                done = true;
                break;
            }
            if (parent_1.getClassName() !== currentKey) {
                break;
            }
            currentTarget = parent_1;
        } while (parent_1);
        if (done) {
            break;
        }
        currentKey = parent_1.getClassName();
        currentTarget = parent_1;
    }
    return store;
}
function generateSerializableMember(type, sourceName) {
    return function (target, propertyKey) {
        var classStore = getDirectStore(target);
        if (!classStore[propertyKey]) {
            classStore[propertyKey] = { type: type, sourceName: sourceName };
        }
    };
}
function generateExpandMember(setCallback, targetKey) {
    if (targetKey === void 0) { targetKey = null; }
    return function (target, propertyKey) {
        var key = targetKey || ("_" + propertyKey);
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return this[key];
            },
            set: function (value) {
                if (this[key] === value) {
                    return;
                }
                this[key] = value;
                target[setCallback].apply(this);
            },
            enumerable: true,
            configurable: true
        });
    };
}
function expandToProperty(callback, targetKey) {
    if (targetKey === void 0) { targetKey = null; }
    return generateExpandMember(callback, targetKey);
}
function serialize(sourceName) {
    return generateSerializableMember(0, sourceName); // value member
}
function serializeAsTexture(sourceName) {
    return generateSerializableMember(1, sourceName); // texture member
}
function serializeAsColor3(sourceName) {
    return generateSerializableMember(2, sourceName); // color3 member
}
function serializeAsFresnelParameters(sourceName) {
    return generateSerializableMember(3, sourceName); // fresnel parameters member
}
function serializeAsVector2(sourceName) {
    return generateSerializableMember(4, sourceName); // vector2 member
}
function serializeAsVector3(sourceName) {
    return generateSerializableMember(5, sourceName); // vector3 member
}
function serializeAsMeshReference(sourceName) {
    return generateSerializableMember(6, sourceName); // mesh reference member
}
function serializeAsColorCurves(sourceName) {
    return generateSerializableMember(7, sourceName); // color curves
}
function serializeAsColor4(sourceName) {
    return generateSerializableMember(8, sourceName); // color 4
}
function serializeAsImageProcessingConfiguration(sourceName) {
    return generateSerializableMember(9, sourceName); // image processing
}
function serializeAsQuaternion(sourceName) {
    return generateSerializableMember(10, sourceName); // quaternion member
}
function serializeAsMatrix(sourceName) {
    return generateSerializableMember(12, sourceName); // matrix member
}
/**
 * Decorator used to define property that can be serialized as reference to a camera
 * @param sourceName defines the name of the property to decorate
 */
function serializeAsCameraReference(sourceName) {
    return generateSerializableMember(11, sourceName); // camera reference member
}
/**
 * Class used to help serialization objects
 */
var SerializationHelper = /** @class */ (function () {
    function SerializationHelper() {
    }
    /**
     * Appends the serialized animations from the source animations
     * @param source Source containing the animations
     * @param destination Target to store the animations
     */
    SerializationHelper.AppendSerializedAnimations = function (source, destination) {
        if (source.animations) {
            destination.animations = [];
            for (var animationIndex = 0; animationIndex < source.animations.length; animationIndex++) {
                var animation = source.animations[animationIndex];
                destination.animations.push(animation.serialize());
            }
        }
    };
    /**
     * Static function used to serialized a specific entity
     * @param entity defines the entity to serialize
     * @param serializationObject defines the optional target obecjt where serialization data will be stored
     * @returns a JSON compatible object representing the serialization of the entity
     */
    SerializationHelper.Serialize = function (entity, serializationObject) {
        if (!serializationObject) {
            serializationObject = {};
        }
        // Tags
        if (Tags) {
            serializationObject.tags = Tags.GetTags(entity);
        }
        var serializedProperties = getMergedStore(entity);
        // Properties
        for (var property in serializedProperties) {
            var propertyDescriptor = serializedProperties[property];
            var targetPropertyName = propertyDescriptor.sourceName || property;
            var propertyType = propertyDescriptor.type;
            var sourceProperty = entity[property];
            if (sourceProperty !== undefined && sourceProperty !== null && property !== "uniqueId") {
                switch (propertyType) {
                    case 0: // Value
                        serializationObject[targetPropertyName] = sourceProperty;
                        break;
                    case 1: // Texture
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 2: // Color3
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 3: // FresnelParameters
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 4: // Vector2
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 5: // Vector3
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 6: // Mesh reference
                        serializationObject[targetPropertyName] = sourceProperty.id;
                        break;
                    case 7: // Color Curves
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 8: // Color 4
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 9: // Image Processing
                        serializationObject[targetPropertyName] = sourceProperty.serialize();
                        break;
                    case 10: // Quaternion
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                    case 11: // Camera reference
                        serializationObject[targetPropertyName] = sourceProperty.id;
                    case 12: // Matrix
                        serializationObject[targetPropertyName] = sourceProperty.asArray();
                        break;
                }
            }
        }
        return serializationObject;
    };
    /**
     * Creates a new entity from a serialization data object
     * @param creationFunction defines a function used to instanciated the new entity
     * @param source defines the source serialization data
     * @param scene defines the hosting scene
     * @param rootUrl defines the root url for resources
     * @returns a new entity
     */
    SerializationHelper.Parse = function (creationFunction, source, scene, rootUrl) {
        if (rootUrl === void 0) { rootUrl = null; }
        var destination = creationFunction();
        if (!rootUrl) {
            rootUrl = "";
        }
        // Tags
        if (Tags) {
            Tags.AddTagsTo(destination, source.tags);
        }
        var classStore = getMergedStore(destination);
        // Properties
        for (var property in classStore) {
            var propertyDescriptor = classStore[property];
            var sourceProperty = source[propertyDescriptor.sourceName || property];
            var propertyType = propertyDescriptor.type;
            if (sourceProperty !== undefined && sourceProperty !== null && property !== "uniqueId") {
                var dest = destination;
                switch (propertyType) {
                    case 0: // Value
                        dest[property] = sourceProperty;
                        break;
                    case 1: // Texture
                        if (scene) {
                            dest[property] = SerializationHelper._TextureParser(sourceProperty, scene, rootUrl);
                        }
                        break;
                    case 2: // Color3
                        dest[property] = Color3.FromArray(sourceProperty);
                        break;
                    case 3: // FresnelParameters
                        dest[property] = SerializationHelper._FresnelParametersParser(sourceProperty);
                        break;
                    case 4: // Vector2
                        dest[property] = Vector2.FromArray(sourceProperty);
                        break;
                    case 5: // Vector3
                        dest[property] = Vector3.FromArray(sourceProperty);
                        break;
                    case 6: // Mesh reference
                        if (scene) {
                            dest[property] = scene.getLastMeshByID(sourceProperty);
                        }
                        break;
                    case 7: // Color Curves
                        dest[property] = SerializationHelper._ColorCurvesParser(sourceProperty);
                        break;
                    case 8: // Color 4
                        dest[property] = Color4.FromArray(sourceProperty);
                        break;
                    case 9: // Image Processing
                        dest[property] = SerializationHelper._ImageProcessingConfigurationParser(sourceProperty);
                        break;
                    case 10: // Quaternion
                        dest[property] = Quaternion.FromArray(sourceProperty);
                        break;
                    case 11: // Camera reference
                        if (scene) {
                            dest[property] = scene.getCameraByID(sourceProperty);
                        }
                    case 12: // Matrix
                        dest[property] = Matrix.FromArray(sourceProperty);
                        break;
                }
            }
        }
        return destination;
    };
    /**
     * Clones an object
     * @param creationFunction defines the function used to instanciate the new object
     * @param source defines the source object
     * @returns the cloned object
     */
    SerializationHelper.Clone = function (creationFunction, source) {
        return _copySource(creationFunction, source, false);
    };
    /**
     * Instanciates a new object based on a source one (some data will be shared between both object)
     * @param creationFunction defines the function used to instanciate the new object
     * @param source defines the source object
     * @returns the new object
     */
    SerializationHelper.Instanciate = function (creationFunction, source) {
        return _copySource(creationFunction, source, true);
    };
    /** @hidden */
    SerializationHelper._ImageProcessingConfigurationParser = function (sourceProperty) {
        throw _DevTools.WarnImport("ImageProcessingConfiguration");
    };
    /** @hidden */
    SerializationHelper._FresnelParametersParser = function (sourceProperty) {
        throw _DevTools.WarnImport("FresnelParameters");
    };
    /** @hidden */
    SerializationHelper._ColorCurvesParser = function (sourceProperty) {
        throw _DevTools.WarnImport("ColorCurves");
    };
    /** @hidden */
    SerializationHelper._TextureParser = function (sourceProperty, scene, rootUrl) {
        throw _DevTools.WarnImport("Texture");
    };
    return SerializationHelper;
}());

/**
 * Node is the basic class for all scene objects (Mesh, Light, Camera.)
 */
var Node = /** @class */ (function () {
    /**
     * Creates a new Node
     * @param name the name and id to be given to this node
     * @param scene the scene this node will be added to
     */
    function Node(name, scene) {
        if (scene === void 0) { scene = null; }
        /**
         * Gets or sets a string used to store user defined state for the node
         */
        this.state = "";
        /**
         * Gets or sets an object used to store user defined information for the node
         */
        this.metadata = null;
        /**
         * For internal use only. Please do not use.
         */
        this.reservedDataStore = null;
        this._doNotSerialize = false;
        /** @hidden */
        this._isDisposed = false;
        /**
         * Gets a list of Animations associated with the node
         */
        this.animations = new Array();
        this._ranges = {};
        /**
         * Callback raised when the node is ready to be used
         */
        this.onReady = null;
        this._isEnabled = true;
        this._isParentEnabled = true;
        this._isReady = true;
        /** @hidden */
        this._currentRenderId = -1;
        this._parentUpdateId = -1;
        /** @hidden */
        this._childUpdateId = -1;
        /** @hidden */
        this._waitingParentId = null;
        /** @hidden */
        this._cache = {};
        this._parentNode = null;
        this._children = null;
        /** @hidden */
        this._worldMatrix = Matrix.Identity();
        /** @hidden */
        this._worldMatrixDeterminant = 0;
        /** @hidden */
        this._worldMatrixDeterminantIsDirty = true;
        /** @hidden */
        this._sceneRootNodesIndex = -1;
        this._animationPropertiesOverride = null;
        /** @hidden */
        this._isNode = true;
        /**
        * An event triggered when the mesh is disposed
        */
        this.onDisposeObservable = new Observable();
        this._onDisposeObserver = null;
        // Behaviors
        this._behaviors = new Array();
        this.name = name;
        this.id = name;
        this._scene = (scene || EngineStore.LastCreatedScene);
        this.uniqueId = this._scene.getUniqueId();
        this._initCache();
    }
    /**
     * Add a new node constructor
     * @param type defines the type name of the node to construct
     * @param constructorFunc defines the constructor function
     */
    Node.AddNodeConstructor = function (type, constructorFunc) {
        this._NodeConstructors[type] = constructorFunc;
    };
    /**
     * Returns a node constructor based on type name
     * @param type defines the type name
     * @param name defines the new node name
     * @param scene defines the hosting scene
     * @param options defines optional options to transmit to constructors
     * @returns the new constructor or null
     */
    Node.Construct = function (type, name, scene, options) {
        var constructorFunc = this._NodeConstructors[type];
        if (!constructorFunc) {
            return null;
        }
        return constructorFunc(name, scene, options);
    };
    Object.defineProperty(Node.prototype, "doNotSerialize", {
        /**
         * Gets or sets a boolean used to define if the node must be serialized
         */
        get: function () {
            if (this._doNotSerialize) {
                return true;
            }
            if (this._parentNode) {
                return this._parentNode.doNotSerialize;
            }
            return false;
        },
        set: function (value) {
            this._doNotSerialize = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets a boolean indicating if the node has been disposed
     * @returns true if the node was disposed
     */
    Node.prototype.isDisposed = function () {
        return this._isDisposed;
    };
    Object.defineProperty(Node.prototype, "parent", {
        get: function () {
            return this._parentNode;
        },
        /**
         * Gets or sets the parent of the node (without keeping the current position in the scene)
         * @see https://doc.babylonjs.com/how_to/parenting
         */
        set: function (parent) {
            if (this._parentNode === parent) {
                return;
            }
            var previousParentNode = this._parentNode;
            // Remove self from list of children of parent
            if (this._parentNode && this._parentNode._children !== undefined && this._parentNode._children !== null) {
                var index = this._parentNode._children.indexOf(this);
                if (index !== -1) {
                    this._parentNode._children.splice(index, 1);
                }
                if (!parent && !this._isDisposed) {
                    this._addToSceneRootNodes();
                }
            }
            // Store new parent
            this._parentNode = parent;
            // Add as child to new parent
            if (this._parentNode) {
                if (this._parentNode._children === undefined || this._parentNode._children === null) {
                    this._parentNode._children = new Array();
                }
                this._parentNode._children.push(this);
                if (!previousParentNode) {
                    this._removeFromSceneRootNodes();
                }
            }
            // Enabled state
            this._syncParentEnabledState();
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    Node.prototype._addToSceneRootNodes = function () {
        if (this._sceneRootNodesIndex === -1) {
            this._sceneRootNodesIndex = this._scene.rootNodes.length;
            this._scene.rootNodes.push(this);
        }
    };
    /** @hidden */
    Node.prototype._removeFromSceneRootNodes = function () {
        if (this._sceneRootNodesIndex !== -1) {
            var rootNodes = this._scene.rootNodes;
            var lastIdx = rootNodes.length - 1;
            rootNodes[this._sceneRootNodesIndex] = rootNodes[lastIdx];
            rootNodes[this._sceneRootNodesIndex]._sceneRootNodesIndex = this._sceneRootNodesIndex;
            this._scene.rootNodes.pop();
            this._sceneRootNodesIndex = -1;
        }
    };
    Object.defineProperty(Node.prototype, "animationPropertiesOverride", {
        /**
         * Gets or sets the animation properties override
         */
        get: function () {
            if (!this._animationPropertiesOverride) {
                return this._scene.animationPropertiesOverride;
            }
            return this._animationPropertiesOverride;
        },
        set: function (value) {
            this._animationPropertiesOverride = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets a string identifying the name of the class
     * @returns "Node" string
     */
    Node.prototype.getClassName = function () {
        return "Node";
    };
    Object.defineProperty(Node.prototype, "onDispose", {
        /**
         * Sets a callback that will be raised when the node will be disposed
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
    /**
     * Gets the scene of the node
     * @returns a scene
     */
    Node.prototype.getScene = function () {
        return this._scene;
    };
    /**
     * Gets the engine of the node
     * @returns a Engine
     */
    Node.prototype.getEngine = function () {
        return this._scene.getEngine();
    };
    /**
     * Attach a behavior to the node
     * @see https://doc.babylonjs.com/features/behaviour
     * @param behavior defines the behavior to attach
     * @param attachImmediately defines that the behavior must be attached even if the scene is still loading
     * @returns the current Node
     */
    Node.prototype.addBehavior = function (behavior, attachImmediately) {
        var _this = this;
        if (attachImmediately === void 0) { attachImmediately = false; }
        var index = this._behaviors.indexOf(behavior);
        if (index !== -1) {
            return this;
        }
        behavior.init();
        if (this._scene.isLoading && !attachImmediately) {
            // We defer the attach when the scene will be loaded
            this._scene.onDataLoadedObservable.addOnce(function () {
                behavior.attach(_this);
            });
        }
        else {
            behavior.attach(this);
        }
        this._behaviors.push(behavior);
        return this;
    };
    /**
     * Remove an attached behavior
     * @see https://doc.babylonjs.com/features/behaviour
     * @param behavior defines the behavior to attach
     * @returns the current Node
     */
    Node.prototype.removeBehavior = function (behavior) {
        var index = this._behaviors.indexOf(behavior);
        if (index === -1) {
            return this;
        }
        this._behaviors[index].detach();
        this._behaviors.splice(index, 1);
        return this;
    };
    Object.defineProperty(Node.prototype, "behaviors", {
        /**
         * Gets the list of attached behaviors
         * @see https://doc.babylonjs.com/features/behaviour
         */
        get: function () {
            return this._behaviors;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets an attached behavior by name
     * @param name defines the name of the behavior to look for
     * @see https://doc.babylonjs.com/features/behaviour
     * @returns null if behavior was not found else the requested behavior
     */
    Node.prototype.getBehaviorByName = function (name) {
        for (var _i = 0, _a = this._behaviors; _i < _a.length; _i++) {
            var behavior = _a[_i];
            if (behavior.name === name) {
                return behavior;
            }
        }
        return null;
    };
    /**
     * Returns the latest update of the World matrix
     * @returns a Matrix
     */
    Node.prototype.getWorldMatrix = function () {
        if (this._currentRenderId !== this._scene.getRenderId()) {
            this.computeWorldMatrix();
        }
        return this._worldMatrix;
    };
    /** @hidden */
    Node.prototype._getWorldMatrixDeterminant = function () {
        if (this._worldMatrixDeterminantIsDirty) {
            this._worldMatrixDeterminantIsDirty = false;
            this._worldMatrixDeterminant = this._worldMatrix.determinant();
        }
        return this._worldMatrixDeterminant;
    };
    Object.defineProperty(Node.prototype, "worldMatrixFromCache", {
        /**
         * Returns directly the latest state of the mesh World matrix.
         * A Matrix is returned.
         */
        get: function () {
            return this._worldMatrix;
        },
        enumerable: false,
        configurable: true
    });
    // override it in derived class if you add new variables to the cache
    // and call the parent class method
    /** @hidden */
    Node.prototype._initCache = function () {
        this._cache = {};
        this._cache.parent = undefined;
    };
    /** @hidden */
    Node.prototype.updateCache = function (force) {
        if (!force && this.isSynchronized()) {
            return;
        }
        this._cache.parent = this.parent;
        this._updateCache();
    };
    /** @hidden */
    Node.prototype._getActionManagerForTrigger = function (trigger, initialCall) {
        if (!this.parent) {
            return null;
        }
        return this.parent._getActionManagerForTrigger(trigger, false);
    };
    // override it in derived class if you add new variables to the cache
    // and call the parent class method if !ignoreParentClass
    /** @hidden */
    Node.prototype._updateCache = function (ignoreParentClass) {
    };
    // override it in derived class if you add new variables to the cache
    /** @hidden */
    Node.prototype._isSynchronized = function () {
        return true;
    };
    /** @hidden */
    Node.prototype._markSyncedWithParent = function () {
        if (this._parentNode) {
            this._parentUpdateId = this._parentNode._childUpdateId;
        }
    };
    /** @hidden */
    Node.prototype.isSynchronizedWithParent = function () {
        if (!this._parentNode) {
            return true;
        }
        if (this._parentUpdateId !== this._parentNode._childUpdateId) {
            return false;
        }
        return this._parentNode.isSynchronized();
    };
    /** @hidden */
    Node.prototype.isSynchronized = function () {
        if (this._cache.parent != this._parentNode) {
            this._cache.parent = this._parentNode;
            return false;
        }
        if (this._parentNode && !this.isSynchronizedWithParent()) {
            return false;
        }
        return this._isSynchronized();
    };
    /**
     * Is this node ready to be used/rendered
     * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
     * @return true if the node is ready
     */
    Node.prototype.isReady = function (completeCheck) {
        return this._isReady;
    };
    /**
     * Is this node enabled?
     * If the node has a parent, all ancestors will be checked and false will be returned if any are false (not enabled), otherwise will return true
     * @param checkAncestors indicates if this method should check the ancestors. The default is to check the ancestors. If set to false, the method will return the value of this node without checking ancestors
     * @return whether this node (and its parent) is enabled
     */
    Node.prototype.isEnabled = function (checkAncestors) {
        if (checkAncestors === void 0) { checkAncestors = true; }
        if (checkAncestors === false) {
            return this._isEnabled;
        }
        if (!this._isEnabled) {
            return false;
        }
        return this._isParentEnabled;
    };
    /** @hidden */
    Node.prototype._syncParentEnabledState = function () {
        this._isParentEnabled = this._parentNode ? this._parentNode.isEnabled() : true;
        if (this._children) {
            this._children.forEach(function (c) {
                c._syncParentEnabledState(); // Force children to update accordingly
            });
        }
    };
    /**
     * Set the enabled state of this node
     * @param value defines the new enabled state
     */
    Node.prototype.setEnabled = function (value) {
        this._isEnabled = value;
        this._syncParentEnabledState();
    };
    /**
     * Is this node a descendant of the given node?
     * The function will iterate up the hierarchy until the ancestor was found or no more parents defined
     * @param ancestor defines the parent node to inspect
     * @returns a boolean indicating if this node is a descendant of the given node
     */
    Node.prototype.isDescendantOf = function (ancestor) {
        if (this.parent) {
            if (this.parent === ancestor) {
                return true;
            }
            return this.parent.isDescendantOf(ancestor);
        }
        return false;
    };
    /** @hidden */
    Node.prototype._getDescendants = function (results, directDescendantsOnly, predicate) {
        if (directDescendantsOnly === void 0) { directDescendantsOnly = false; }
        if (!this._children) {
            return;
        }
        for (var index = 0; index < this._children.length; index++) {
            var item = this._children[index];
            if (!predicate || predicate(item)) {
                results.push(item);
            }
            if (!directDescendantsOnly) {
                item._getDescendants(results, false, predicate);
            }
        }
    };
    /**
     * Will return all nodes that have this node as ascendant
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @return all children nodes of all types
     */
    Node.prototype.getDescendants = function (directDescendantsOnly, predicate) {
        var results = new Array();
        this._getDescendants(results, directDescendantsOnly, predicate);
        return results;
    };
    /**
     * Get all child-meshes of this node
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered (Default: false)
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @returns an array of AbstractMesh
     */
    Node.prototype.getChildMeshes = function (directDescendantsOnly, predicate) {
        var results = [];
        this._getDescendants(results, directDescendantsOnly, function (node) {
            return ((!predicate || predicate(node)) && (node.cullingStrategy !== undefined));
        });
        return results;
    };
    /**
     * Get all direct children of this node
     * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
     * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered (Default: true)
     * @returns an array of Node
     */
    Node.prototype.getChildren = function (predicate, directDescendantsOnly) {
        if (directDescendantsOnly === void 0) { directDescendantsOnly = true; }
        return this.getDescendants(directDescendantsOnly, predicate);
    };
    /** @hidden */
    Node.prototype._setReady = function (state) {
        if (state === this._isReady) {
            return;
        }
        if (!state) {
            this._isReady = false;
            return;
        }
        if (this.onReady) {
            this.onReady(this);
        }
        this._isReady = true;
    };
    /**
     * Get an animation by name
     * @param name defines the name of the animation to look for
     * @returns null if not found else the requested animation
     */
    Node.prototype.getAnimationByName = function (name) {
        for (var i = 0; i < this.animations.length; i++) {
            var animation = this.animations[i];
            if (animation.name === name) {
                return animation;
            }
        }
        return null;
    };
    /**
     * Creates an animation range for this node
     * @param name defines the name of the range
     * @param from defines the starting key
     * @param to defines the end key
     */
    Node.prototype.createAnimationRange = function (name, from, to) {
        // check name not already in use
        if (!this._ranges[name]) {
            this._ranges[name] = Node._AnimationRangeFactory(name, from, to);
            for (var i = 0, nAnimations = this.animations.length; i < nAnimations; i++) {
                if (this.animations[i]) {
                    this.animations[i].createRange(name, from, to);
                }
            }
        }
    };
    /**
     * Delete a specific animation range
     * @param name defines the name of the range to delete
     * @param deleteFrames defines if animation frames from the range must be deleted as well
     */
    Node.prototype.deleteAnimationRange = function (name, deleteFrames) {
        if (deleteFrames === void 0) { deleteFrames = true; }
        for (var i = 0, nAnimations = this.animations.length; i < nAnimations; i++) {
            if (this.animations[i]) {
                this.animations[i].deleteRange(name, deleteFrames);
            }
        }
        this._ranges[name] = null; // said much faster than 'delete this._range[name]'
    };
    /**
     * Get an animation range by name
     * @param name defines the name of the animation range to look for
     * @returns null if not found else the requested animation range
     */
    Node.prototype.getAnimationRange = function (name) {
        return this._ranges[name] || null;
    };
    /**
     * Gets the list of all animation ranges defined on this node
     * @returns an array
     */
    Node.prototype.getAnimationRanges = function () {
        var animationRanges = [];
        var name;
        for (name in this._ranges) {
            animationRanges.push(this._ranges[name]);
        }
        return animationRanges;
    };
    /**
     * Will start the animation sequence
     * @param name defines the range frames for animation sequence
     * @param loop defines if the animation should loop (false by default)
     * @param speedRatio defines the speed factor in which to run the animation (1 by default)
     * @param onAnimationEnd defines a function to be executed when the animation ended (undefined by default)
     * @returns the object created for this animation. If range does not exist, it will return null
     */
    Node.prototype.beginAnimation = function (name, loop, speedRatio, onAnimationEnd) {
        var range = this.getAnimationRange(name);
        if (!range) {
            return null;
        }
        return this._scene.beginAnimation(this, range.from, range.to, loop, speedRatio, onAnimationEnd);
    };
    /**
     * Serialize animation ranges into a JSON compatible object
     * @returns serialization object
     */
    Node.prototype.serializeAnimationRanges = function () {
        var serializationRanges = [];
        for (var name in this._ranges) {
            var localRange = this._ranges[name];
            if (!localRange) {
                continue;
            }
            var range = {};
            range.name = name;
            range.from = localRange.from;
            range.to = localRange.to;
            serializationRanges.push(range);
        }
        return serializationRanges;
    };
    /**
     * Computes the world matrix of the node
     * @param force defines if the cache version should be invalidated forcing the world matrix to be created from scratch
     * @returns the world matrix
     */
    Node.prototype.computeWorldMatrix = function (force) {
        if (!this._worldMatrix) {
            this._worldMatrix = Matrix.Identity();
        }
        return this._worldMatrix;
    };
    /**
     * Releases resources associated with this node.
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
     */
    Node.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
        if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
        this._isDisposed = true;
        if (!doNotRecurse) {
            var nodes = this.getDescendants(true);
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                node.dispose(doNotRecurse, disposeMaterialAndTextures);
            }
        }
        if (!this.parent) {
            this._removeFromSceneRootNodes();
        }
        else {
            this.parent = null;
        }
        // Callback
        this.onDisposeObservable.notifyObservers(this);
        this.onDisposeObservable.clear();
        // Behaviors
        for (var _a = 0, _b = this._behaviors; _a < _b.length; _a++) {
            var behavior = _b[_a];
            behavior.detach();
        }
        this._behaviors = [];
    };
    /**
     * Parse animation range data from a serialization object and store them into a given node
     * @param node defines where to store the animation ranges
     * @param parsedNode defines the serialization object to read data from
     * @param scene defines the hosting scene
     */
    Node.ParseAnimationRanges = function (node, parsedNode, scene) {
        if (parsedNode.ranges) {
            for (var index = 0; index < parsedNode.ranges.length; index++) {
                var data = parsedNode.ranges[index];
                node.createAnimationRange(data.name, data.from, data.to);
            }
        }
    };
    /**
 * Return the minimum and maximum world vectors of the entire hierarchy under current node
 * @param includeDescendants Include bounding info from descendants as well (true by default)
 * @param predicate defines a callback function that can be customize to filter what meshes should be included in the list used to compute the bounding vectors
 * @returns the new bounding vectors
 */
    Node.prototype.getHierarchyBoundingVectors = function (includeDescendants, predicate) {
        if (includeDescendants === void 0) { includeDescendants = true; }
        if (predicate === void 0) { predicate = null; }
        // Ensures that all world matrix will be recomputed.
        this.getScene().incrementRenderId();
        this.computeWorldMatrix(true);
        var min;
        var max;
        var thisAbstractMesh = this;
        if (thisAbstractMesh.getBoundingInfo && thisAbstractMesh.subMeshes) {
            // If this is an abstract mesh get its bounding info
            var boundingInfo = thisAbstractMesh.getBoundingInfo();
            min = boundingInfo.boundingBox.minimumWorld.clone();
            max = boundingInfo.boundingBox.maximumWorld.clone();
        }
        else {
            min = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            max = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        }
        if (includeDescendants) {
            var descendants = this.getDescendants(false);
            for (var _i = 0, descendants_1 = descendants; _i < descendants_1.length; _i++) {
                var descendant = descendants_1[_i];
                var childMesh = descendant;
                childMesh.computeWorldMatrix(true);
                // Filters meshes based on custom predicate function.
                if (predicate && !predicate(childMesh)) {
                    continue;
                }
                //make sure we have the needed params to get mix and max
                if (!childMesh.getBoundingInfo || childMesh.getTotalVertices() === 0) {
                    continue;
                }
                var childBoundingInfo = childMesh.getBoundingInfo();
                var boundingBox = childBoundingInfo.boundingBox;
                var minBox = boundingBox.minimumWorld;
                var maxBox = boundingBox.maximumWorld;
                Vector3.CheckExtends(minBox, min, max);
                Vector3.CheckExtends(maxBox, min, max);
            }
        }
        return {
            min: min,
            max: max
        };
    };
    /** @hidden */
    Node._AnimationRangeFactory = function (name, from, to) {
        throw _DevTools.WarnImport("AnimationRange");
    };
    Node._NodeConstructors = {};
    __decorate([
        serialize()
    ], Node.prototype, "name", void 0);
    __decorate([
        serialize()
    ], Node.prototype, "id", void 0);
    __decorate([
        serialize()
    ], Node.prototype, "uniqueId", void 0);
    __decorate([
        serialize()
    ], Node.prototype, "state", void 0);
    __decorate([
        serialize()
    ], Node.prototype, "metadata", void 0);
    return Node;
}());

export { AndOrNotEvaluator as A, Node as N, SerializationHelper as S, Tags as T, serialize as a, serializeAsMeshReference as b, serializeAsColorCurves as c, serializeAsTexture as d, serializeAsColor4 as e, serializeAsColor3 as f, expandToProperty as g, serializeAsQuaternion as h, serializeAsMatrix as i, serializeAsFresnelParameters as j, serializeAsVector2 as k, serializeAsCameraReference as l, serializeAsImageProcessingConfiguration as m, serializeAsVector3 as s };
