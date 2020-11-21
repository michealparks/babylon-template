import { a as __decorate, _ as __extends, O as Observable, L as Logger, E as EngineStore, b as _DevTools, d as __assign, D as DomManagement } from './thinEngine-e576a091.js';
import { S as SerializationHelper, a as serialize, c as serializeAsColorCurves, d as serializeAsTexture, e as serializeAsColor4, T as Tags } from './node-87d9c658.js';
import { C as Color4, V as Vector3, a as Vector2, M as Matrix, b as Color3 } from './math.color-fc6e801e.js';
import { P as PrecisionDate, a as PerfCounter } from './engine-9a1b5aa7.js';
import { S as SmartArray, a as SmartArrayNoDuplicate, P as PointerEventTypes, b as PointerInfo, c as PointerInfoPre, d as KeyboardInfoPre, e as KeyboardInfo, K as KeyboardEventTypes, C as Camera } from './pointerEvents-12a2451c.js';
import { T as Tools } from './tools-ab6f1dea.js';
import { F as FileTools } from './guid-495ff9c7.js';
import { F as Frustum } from './math.frustum-2cd1d420.js';
import { V as VertexBuffer, M as Material, T as TransformNode, A as AbstractMesh, S as Stage, P as PickingInfo } from './sceneComponent-5502b64a.js';
import { U as UniformBuffer } from './uniformBuffer-e700d3a6.js';
import { L as Light } from './light-a23926e9.js';

/**
 * This class implement a typical dictionary using a string as key and the generic type T as value.
 * The underlying implementation relies on an associative array to ensure the best performances.
 * The value can be anything including 'null' but except 'undefined'
 */
var StringDictionary = /** @class */ (function () {
    function StringDictionary() {
        this._count = 0;
        this._data = {};
    }
    /**
     * This will clear this dictionary and copy the content from the 'source' one.
     * If the T value is a custom object, it won't be copied/cloned, the same object will be used
     * @param source the dictionary to take the content from and copy to this dictionary
     */
    StringDictionary.prototype.copyFrom = function (source) {
        var _this = this;
        this.clear();
        source.forEach(function (t, v) { return _this.add(t, v); });
    };
    /**
     * Get a value based from its key
     * @param key the given key to get the matching value from
     * @return the value if found, otherwise undefined is returned
     */
    StringDictionary.prototype.get = function (key) {
        var val = this._data[key];
        if (val !== undefined) {
            return val;
        }
        return undefined;
    };
    /**
     * Get a value from its key or add it if it doesn't exist.
     * This method will ensure you that a given key/data will be present in the dictionary.
     * @param key the given key to get the matching value from
     * @param factory the factory that will create the value if the key is not present in the dictionary.
     * The factory will only be invoked if there's no data for the given key.
     * @return the value corresponding to the key.
     */
    StringDictionary.prototype.getOrAddWithFactory = function (key, factory) {
        var val = this.get(key);
        if (val !== undefined) {
            return val;
        }
        val = factory(key);
        if (val) {
            this.add(key, val);
        }
        return val;
    };
    /**
     * Get a value from its key if present in the dictionary otherwise add it
     * @param key the key to get the value from
     * @param val if there's no such key/value pair in the dictionary add it with this value
     * @return the value corresponding to the key
     */
    StringDictionary.prototype.getOrAdd = function (key, val) {
        var curVal = this.get(key);
        if (curVal !== undefined) {
            return curVal;
        }
        this.add(key, val);
        return val;
    };
    /**
     * Check if there's a given key in the dictionary
     * @param key the key to check for
     * @return true if the key is present, false otherwise
     */
    StringDictionary.prototype.contains = function (key) {
        return this._data[key] !== undefined;
    };
    /**
     * Add a new key and its corresponding value
     * @param key the key to add
     * @param value the value corresponding to the key
     * @return true if the operation completed successfully, false if we couldn't insert the key/value because there was already this key in the dictionary
     */
    StringDictionary.prototype.add = function (key, value) {
        if (this._data[key] !== undefined) {
            return false;
        }
        this._data[key] = value;
        ++this._count;
        return true;
    };
    /**
     * Update a specific value associated to a key
     * @param key defines the key to use
     * @param value defines the value to store
     * @returns true if the value was updated (or false if the key was not found)
     */
    StringDictionary.prototype.set = function (key, value) {
        if (this._data[key] === undefined) {
            return false;
        }
        this._data[key] = value;
        return true;
    };
    /**
     * Get the element of the given key and remove it from the dictionary
     * @param key defines the key to search
     * @returns the value associated with the key or null if not found
     */
    StringDictionary.prototype.getAndRemove = function (key) {
        var val = this.get(key);
        if (val !== undefined) {
            delete this._data[key];
            --this._count;
            return val;
        }
        return null;
    };
    /**
     * Remove a key/value from the dictionary.
     * @param key the key to remove
     * @return true if the item was successfully deleted, false if no item with such key exist in the dictionary
     */
    StringDictionary.prototype.remove = function (key) {
        if (this.contains(key)) {
            delete this._data[key];
            --this._count;
            return true;
        }
        return false;
    };
    /**
     * Clear the whole content of the dictionary
     */
    StringDictionary.prototype.clear = function () {
        this._data = {};
        this._count = 0;
    };
    Object.defineProperty(StringDictionary.prototype, "count", {
        /**
         * Gets the current count
         */
        get: function () {
            return this._count;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Execute a callback on each key/val of the dictionary.
     * Note that you can remove any element in this dictionary in the callback implementation
     * @param callback the callback to execute on a given key/value pair
     */
    StringDictionary.prototype.forEach = function (callback) {
        for (var cur in this._data) {
            var val = this._data[cur];
            callback(cur, val);
        }
    };
    /**
     * Execute a callback on every occurrence of the dictionary until it returns a valid TRes object.
     * If the callback returns null or undefined the method will iterate to the next key/value pair
     * Note that you can remove any element in this dictionary in the callback implementation
     * @param callback the callback to execute, if it return a valid T instanced object the enumeration will stop and the object will be returned
     * @returns the first item
     */
    StringDictionary.prototype.first = function (callback) {
        for (var cur in this._data) {
            var val = this._data[cur];
            var res = callback(cur, val);
            if (res) {
                return res;
            }
        }
        return null;
    };
    return StringDictionary;
}());

/**
 * Base class of the scene acting as a container for the different elements composing a scene.
 * This class is dynamically extended by the different components of the scene increasing
 * flexibility and reducing coupling
 */
var AbstractScene = /** @class */ (function () {
    function AbstractScene() {
        /**
         * Gets the list of root nodes (ie. nodes with no parent)
         */
        this.rootNodes = new Array();
        /** All of the cameras added to this scene
         * @see https://doc.babylonjs.com/babylon101/cameras
         */
        this.cameras = new Array();
        /**
        * All of the lights added to this scene
        * @see https://doc.babylonjs.com/babylon101/lights
        */
        this.lights = new Array();
        /**
        * All of the (abstract) meshes added to this scene
        */
        this.meshes = new Array();
        /**
         * The list of skeletons added to the scene
         * @see https://doc.babylonjs.com/how_to/how_to_use_bones_and_skeletons
         */
        this.skeletons = new Array();
        /**
        * All of the particle systems added to this scene
        * @see https://doc.babylonjs.com/babylon101/particles
        */
        this.particleSystems = new Array();
        /**
         * Gets a list of Animations associated with the scene
         */
        this.animations = [];
        /**
        * All of the animation groups added to this scene
        * @see https://doc.babylonjs.com/how_to/group
        */
        this.animationGroups = new Array();
        /**
        * All of the multi-materials added to this scene
        * @see https://doc.babylonjs.com/how_to/multi_materials
        */
        this.multiMaterials = new Array();
        /**
        * All of the materials added to this scene
        * In the context of a Scene, it is not supposed to be modified manually.
        * Any addition or removal should be done using the addMaterial and removeMaterial Scene methods.
        * Note also that the order of the Material within the array is not significant and might change.
        * @see https://doc.babylonjs.com/babylon101/materials
        */
        this.materials = new Array();
        /**
         * The list of morph target managers added to the scene
         * @see https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh
         */
        this.morphTargetManagers = new Array();
        /**
         * The list of geometries used in the scene.
         */
        this.geometries = new Array();
        /**
        * All of the tranform nodes added to this scene
        * In the context of a Scene, it is not supposed to be modified manually.
        * Any addition or removal should be done using the addTransformNode and removeTransformNode Scene methods.
        * Note also that the order of the TransformNode wihin the array is not significant and might change.
        * @see https://doc.babylonjs.com/how_to/transformnode
        */
        this.transformNodes = new Array();
        /**
         * ActionManagers available on the scene.
         */
        this.actionManagers = new Array();
        /**
         * Textures to keep.
         */
        this.textures = new Array();
        /** @hidden */
        this._environmentTexture = null;
        /**
         * The list of postprocesses added to the scene
         */
        this.postProcesses = new Array();
    }
    /**
     * Adds a parser in the list of available ones
     * @param name Defines the name of the parser
     * @param parser Defines the parser to add
     */
    AbstractScene.AddParser = function (name, parser) {
        this._BabylonFileParsers[name] = parser;
    };
    /**
     * Gets a general parser from the list of avaialble ones
     * @param name Defines the name of the parser
     * @returns the requested parser or null
     */
    AbstractScene.GetParser = function (name) {
        if (this._BabylonFileParsers[name]) {
            return this._BabylonFileParsers[name];
        }
        return null;
    };
    /**
     * Adds n individual parser in the list of available ones
     * @param name Defines the name of the parser
     * @param parser Defines the parser to add
     */
    AbstractScene.AddIndividualParser = function (name, parser) {
        this._IndividualBabylonFileParsers[name] = parser;
    };
    /**
     * Gets an individual parser from the list of avaialble ones
     * @param name Defines the name of the parser
     * @returns the requested parser or null
     */
    AbstractScene.GetIndividualParser = function (name) {
        if (this._IndividualBabylonFileParsers[name]) {
            return this._IndividualBabylonFileParsers[name];
        }
        return null;
    };
    /**
     * Parser json data and populate both a scene and its associated container object
     * @param jsonData Defines the data to parse
     * @param scene Defines the scene to parse the data for
     * @param container Defines the container attached to the parsing sequence
     * @param rootUrl Defines the root url of the data
     */
    AbstractScene.Parse = function (jsonData, scene, container, rootUrl) {
        for (var parserName in this._BabylonFileParsers) {
            if (this._BabylonFileParsers.hasOwnProperty(parserName)) {
                this._BabylonFileParsers[parserName](jsonData, scene, container, rootUrl);
            }
        }
    };
    Object.defineProperty(AbstractScene.prototype, "environmentTexture", {
        /**
         * Texture used in all pbr material as the reflection texture.
         * As in the majority of the scene they are the same (exception for multi room and so on),
         * this is easier to reference from here than from all the materials.
         */
        get: function () {
            return this._environmentTexture;
        },
        set: function (value) {
            this._environmentTexture = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @returns all meshes, lights, cameras, transformNodes and bones
     */
    AbstractScene.prototype.getNodes = function () {
        var nodes = new Array();
        nodes = nodes.concat(this.meshes);
        nodes = nodes.concat(this.lights);
        nodes = nodes.concat(this.cameras);
        nodes = nodes.concat(this.transformNodes); // dummies
        this.skeletons.forEach(function (skeleton) { return nodes = nodes.concat(skeleton.bones); });
        return nodes;
    };
    /**
     * Stores the list of available parsers in the application.
     */
    AbstractScene._BabylonFileParsers = {};
    /**
     * Stores the list of available individual parsers in the application.
     */
    AbstractScene._IndividualBabylonFileParsers = {};
    return AbstractScene;
}());

/**
 * Manages the defines for the Material
 */
var MaterialDefines = /** @class */ (function () {
    function MaterialDefines() {
        this._isDirty = true;
        /** @hidden */
        this._areLightsDirty = true;
        /** @hidden */
        this._areLightsDisposed = false;
        /** @hidden */
        this._areAttributesDirty = true;
        /** @hidden */
        this._areTexturesDirty = true;
        /** @hidden */
        this._areFresnelDirty = true;
        /** @hidden */
        this._areMiscDirty = true;
        /** @hidden */
        this._arePrePassDirty = true;
        /** @hidden */
        this._areImageProcessingDirty = true;
        /** @hidden */
        this._normals = false;
        /** @hidden */
        this._uvs = false;
        /** @hidden */
        this._needNormals = false;
        /** @hidden */
        this._needUVs = false;
    }
    Object.defineProperty(MaterialDefines.prototype, "isDirty", {
        /**
         * Specifies if the material needs to be re-calculated
         */
        get: function () {
            return this._isDirty;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Marks the material to indicate that it has been re-calculated
     */
    MaterialDefines.prototype.markAsProcessed = function () {
        this._isDirty = false;
        this._areAttributesDirty = false;
        this._areTexturesDirty = false;
        this._areFresnelDirty = false;
        this._areLightsDirty = false;
        this._areLightsDisposed = false;
        this._areMiscDirty = false;
        this._arePrePassDirty = false;
        this._areImageProcessingDirty = false;
    };
    /**
     * Marks the material to indicate that it needs to be re-calculated
     */
    MaterialDefines.prototype.markAsUnprocessed = function () {
        this._isDirty = true;
    };
    /**
     * Marks the material to indicate all of its defines need to be re-calculated
     */
    MaterialDefines.prototype.markAllAsDirty = function () {
        this._areTexturesDirty = true;
        this._areAttributesDirty = true;
        this._areLightsDirty = true;
        this._areFresnelDirty = true;
        this._areMiscDirty = true;
        this._areImageProcessingDirty = true;
        this._isDirty = true;
    };
    /**
     * Marks the material to indicate that image processing needs to be re-calculated
     */
    MaterialDefines.prototype.markAsImageProcessingDirty = function () {
        this._areImageProcessingDirty = true;
        this._isDirty = true;
    };
    /**
     * Marks the material to indicate the lights need to be re-calculated
     * @param disposed Defines whether the light is dirty due to dispose or not
     */
    MaterialDefines.prototype.markAsLightDirty = function (disposed) {
        if (disposed === void 0) { disposed = false; }
        this._areLightsDirty = true;
        this._areLightsDisposed = this._areLightsDisposed || disposed;
        this._isDirty = true;
    };
    /**
     * Marks the attribute state as changed
     */
    MaterialDefines.prototype.markAsAttributesDirty = function () {
        this._areAttributesDirty = true;
        this._isDirty = true;
    };
    /**
     * Marks the texture state as changed
     */
    MaterialDefines.prototype.markAsTexturesDirty = function () {
        this._areTexturesDirty = true;
        this._isDirty = true;
    };
    /**
     * Marks the fresnel state as changed
     */
    MaterialDefines.prototype.markAsFresnelDirty = function () {
        this._areFresnelDirty = true;
        this._isDirty = true;
    };
    /**
     * Marks the misc state as changed
     */
    MaterialDefines.prototype.markAsMiscDirty = function () {
        this._areMiscDirty = true;
        this._isDirty = true;
    };
    /**
     * Marks the prepass state as changed
     */
    MaterialDefines.prototype.markAsPrePassDirty = function () {
        this._arePrePassDirty = true;
        this._isDirty = true;
    };
    /**
     * Rebuilds the material defines
     */
    MaterialDefines.prototype.rebuild = function () {
        this._keys = [];
        for (var _i = 0, _a = Object.keys(this); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key[0] === "_") {
                continue;
            }
            this._keys.push(key);
        }
    };
    /**
     * Specifies if two material defines are equal
     * @param other - A material define instance to compare to
     * @returns - Boolean indicating if the material defines are equal (true) or not (false)
     */
    MaterialDefines.prototype.isEqual = function (other) {
        if (this._keys.length !== other._keys.length) {
            return false;
        }
        for (var index = 0; index < this._keys.length; index++) {
            var prop = this._keys[index];
            if (this[prop] !== other[prop]) {
                return false;
            }
        }
        return true;
    };
    /**
     * Clones this instance's defines to another instance
     * @param other - material defines to clone values to
     */
    MaterialDefines.prototype.cloneTo = function (other) {
        if (this._keys.length !== other._keys.length) {
            other._keys = this._keys.slice(0);
        }
        for (var index = 0; index < this._keys.length; index++) {
            var prop = this._keys[index];
            other[prop] = this[prop];
        }
    };
    /**
     * Resets the material define values
     */
    MaterialDefines.prototype.reset = function () {
        for (var index = 0; index < this._keys.length; index++) {
            var prop = this._keys[index];
            var type = typeof this[prop];
            switch (type) {
                case "number":
                    this[prop] = 0;
                    break;
                case "string":
                    this[prop] = "";
                    break;
                default:
                    this[prop] = false;
                    break;
            }
        }
    };
    /**
     * Converts the material define values to a string
     * @returns - String of material define information
     */
    MaterialDefines.prototype.toString = function () {
        var result = "";
        for (var index = 0; index < this._keys.length; index++) {
            var prop = this._keys[index];
            var value = this[prop];
            var type = typeof value;
            switch (type) {
                case "number":
                case "string":
                    result += "#define " + prop + " " + value + "\n";
                    break;
                default:
                    if (value) {
                        result += "#define " + prop + "\n";
                    }
                    break;
            }
        }
        return result;
    };
    return MaterialDefines;
}());

/**
 * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
 * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
 * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
 * corresponding to low luminance, medium luminance, and high luminance areas respectively.
 */
var ColorCurves = /** @class */ (function () {
    function ColorCurves() {
        this._dirty = true;
        this._tempColor = new Color4(0, 0, 0, 0);
        this._globalCurve = new Color4(0, 0, 0, 0);
        this._highlightsCurve = new Color4(0, 0, 0, 0);
        this._midtonesCurve = new Color4(0, 0, 0, 0);
        this._shadowsCurve = new Color4(0, 0, 0, 0);
        this._positiveCurve = new Color4(0, 0, 0, 0);
        this._negativeCurve = new Color4(0, 0, 0, 0);
        this._globalHue = 30;
        this._globalDensity = 0;
        this._globalSaturation = 0;
        this._globalExposure = 0;
        this._highlightsHue = 30;
        this._highlightsDensity = 0;
        this._highlightsSaturation = 0;
        this._highlightsExposure = 0;
        this._midtonesHue = 30;
        this._midtonesDensity = 0;
        this._midtonesSaturation = 0;
        this._midtonesExposure = 0;
        this._shadowsHue = 30;
        this._shadowsDensity = 0;
        this._shadowsSaturation = 0;
        this._shadowsExposure = 0;
    }
    Object.defineProperty(ColorCurves.prototype, "globalHue", {
        /**
         * Gets the global Hue value.
         * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
         */
        get: function () {
            return this._globalHue;
        },
        /**
         * Sets the global Hue value.
         * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
         */
        set: function (value) {
            this._globalHue = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "globalDensity", {
        /**
         * Gets the global Density value.
         * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
         * Values less than zero provide a filter of opposite hue.
         */
        get: function () {
            return this._globalDensity;
        },
        /**
         * Sets the global Density value.
         * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
         * Values less than zero provide a filter of opposite hue.
         */
        set: function (value) {
            this._globalDensity = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "globalSaturation", {
        /**
         * Gets the global Saturation value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
         */
        get: function () {
            return this._globalSaturation;
        },
        /**
         * Sets the global Saturation value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
         */
        set: function (value) {
            this._globalSaturation = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "globalExposure", {
        /**
         * Gets the global Exposure value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
         */
        get: function () {
            return this._globalExposure;
        },
        /**
         * Sets the global Exposure value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
         */
        set: function (value) {
            this._globalExposure = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "highlightsHue", {
        /**
         * Gets the highlights Hue value.
         * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
         */
        get: function () {
            return this._highlightsHue;
        },
        /**
         * Sets the highlights Hue value.
         * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
         */
        set: function (value) {
            this._highlightsHue = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "highlightsDensity", {
        /**
         * Gets the highlights Density value.
         * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
         * Values less than zero provide a filter of opposite hue.
         */
        get: function () {
            return this._highlightsDensity;
        },
        /**
         * Sets the highlights Density value.
         * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
         * Values less than zero provide a filter of opposite hue.
         */
        set: function (value) {
            this._highlightsDensity = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "highlightsSaturation", {
        /**
         * Gets the highlights Saturation value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
         */
        get: function () {
            return this._highlightsSaturation;
        },
        /**
         * Sets the highlights Saturation value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
         */
        set: function (value) {
            this._highlightsSaturation = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "highlightsExposure", {
        /**
         * Gets the highlights Exposure value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
         */
        get: function () {
            return this._highlightsExposure;
        },
        /**
         * Sets the highlights Exposure value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
         */
        set: function (value) {
            this._highlightsExposure = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "midtonesHue", {
        /**
         * Gets the midtones Hue value.
         * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
         */
        get: function () {
            return this._midtonesHue;
        },
        /**
         * Sets the midtones Hue value.
         * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
         */
        set: function (value) {
            this._midtonesHue = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "midtonesDensity", {
        /**
         * Gets the midtones Density value.
         * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
         * Values less than zero provide a filter of opposite hue.
         */
        get: function () {
            return this._midtonesDensity;
        },
        /**
         * Sets the midtones Density value.
         * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
         * Values less than zero provide a filter of opposite hue.
         */
        set: function (value) {
            this._midtonesDensity = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "midtonesSaturation", {
        /**
         * Gets the midtones Saturation value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
         */
        get: function () {
            return this._midtonesSaturation;
        },
        /**
         * Sets the midtones Saturation value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
         */
        set: function (value) {
            this._midtonesSaturation = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "midtonesExposure", {
        /**
         * Gets the midtones Exposure value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
         */
        get: function () {
            return this._midtonesExposure;
        },
        /**
         * Sets the midtones Exposure value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
         */
        set: function (value) {
            this._midtonesExposure = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "shadowsHue", {
        /**
         * Gets the shadows Hue value.
         * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
         */
        get: function () {
            return this._shadowsHue;
        },
        /**
         * Sets the shadows Hue value.
         * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
         */
        set: function (value) {
            this._shadowsHue = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "shadowsDensity", {
        /**
         * Gets the shadows Density value.
         * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
         * Values less than zero provide a filter of opposite hue.
         */
        get: function () {
            return this._shadowsDensity;
        },
        /**
         * Sets the shadows Density value.
         * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
         * Values less than zero provide a filter of opposite hue.
         */
        set: function (value) {
            this._shadowsDensity = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "shadowsSaturation", {
        /**
         * Gets the shadows Saturation value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
         */
        get: function () {
            return this._shadowsSaturation;
        },
        /**
         * Sets the shadows Saturation value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
         */
        set: function (value) {
            this._shadowsSaturation = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ColorCurves.prototype, "shadowsExposure", {
        /**
         * Gets the shadows Exposure value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
         */
        get: function () {
            return this._shadowsExposure;
        },
        /**
         * Sets the shadows Exposure value.
         * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
         */
        set: function (value) {
            this._shadowsExposure = value;
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the class name
     * @returns The class name
     */
    ColorCurves.prototype.getClassName = function () {
        return "ColorCurves";
    };
    /**
     * Binds the color curves to the shader.
     * @param colorCurves The color curve to bind
     * @param effect The effect to bind to
     * @param positiveUniform The positive uniform shader parameter
     * @param neutralUniform The neutral uniform shader parameter
     * @param negativeUniform The negative uniform shader parameter
     */
    ColorCurves.Bind = function (colorCurves, effect, positiveUniform, neutralUniform, negativeUniform) {
        if (positiveUniform === void 0) { positiveUniform = "vCameraColorCurvePositive"; }
        if (neutralUniform === void 0) { neutralUniform = "vCameraColorCurveNeutral"; }
        if (negativeUniform === void 0) { negativeUniform = "vCameraColorCurveNegative"; }
        if (colorCurves._dirty) {
            colorCurves._dirty = false;
            // Fill in global info.
            colorCurves.getColorGradingDataToRef(colorCurves._globalHue, colorCurves._globalDensity, colorCurves._globalSaturation, colorCurves._globalExposure, colorCurves._globalCurve);
            // Compute highlights info.
            colorCurves.getColorGradingDataToRef(colorCurves._highlightsHue, colorCurves._highlightsDensity, colorCurves._highlightsSaturation, colorCurves._highlightsExposure, colorCurves._tempColor);
            colorCurves._tempColor.multiplyToRef(colorCurves._globalCurve, colorCurves._highlightsCurve);
            // Compute midtones info.
            colorCurves.getColorGradingDataToRef(colorCurves._midtonesHue, colorCurves._midtonesDensity, colorCurves._midtonesSaturation, colorCurves._midtonesExposure, colorCurves._tempColor);
            colorCurves._tempColor.multiplyToRef(colorCurves._globalCurve, colorCurves._midtonesCurve);
            // Compute shadows info.
            colorCurves.getColorGradingDataToRef(colorCurves._shadowsHue, colorCurves._shadowsDensity, colorCurves._shadowsSaturation, colorCurves._shadowsExposure, colorCurves._tempColor);
            colorCurves._tempColor.multiplyToRef(colorCurves._globalCurve, colorCurves._shadowsCurve);
            // Compute deltas (neutral is midtones).
            colorCurves._highlightsCurve.subtractToRef(colorCurves._midtonesCurve, colorCurves._positiveCurve);
            colorCurves._midtonesCurve.subtractToRef(colorCurves._shadowsCurve, colorCurves._negativeCurve);
        }
        if (effect) {
            effect.setFloat4(positiveUniform, colorCurves._positiveCurve.r, colorCurves._positiveCurve.g, colorCurves._positiveCurve.b, colorCurves._positiveCurve.a);
            effect.setFloat4(neutralUniform, colorCurves._midtonesCurve.r, colorCurves._midtonesCurve.g, colorCurves._midtonesCurve.b, colorCurves._midtonesCurve.a);
            effect.setFloat4(negativeUniform, colorCurves._negativeCurve.r, colorCurves._negativeCurve.g, colorCurves._negativeCurve.b, colorCurves._negativeCurve.a);
        }
    };
    /**
     * Prepare the list of uniforms associated with the ColorCurves effects.
     * @param uniformsList The list of uniforms used in the effect
     */
    ColorCurves.PrepareUniforms = function (uniformsList) {
        uniformsList.push("vCameraColorCurveNeutral", "vCameraColorCurvePositive", "vCameraColorCurveNegative");
    };
    /**
     * Returns color grading data based on a hue, density, saturation and exposure value.
     * @param filterHue The hue of the color filter.
     * @param filterDensity The density of the color filter.
     * @param saturation The saturation.
     * @param exposure The exposure.
     * @param result The result data container.
     */
    ColorCurves.prototype.getColorGradingDataToRef = function (hue, density, saturation, exposure, result) {
        if (hue == null) {
            return;
        }
        hue = ColorCurves.clamp(hue, 0, 360);
        density = ColorCurves.clamp(density, -100, 100);
        saturation = ColorCurves.clamp(saturation, -100, 100);
        exposure = ColorCurves.clamp(exposure, -100, 100);
        // Remap the slider/config filter density with non-linear mapping and also scale by half
        // so that the maximum filter density is only 50% control. This provides fine control
        // for small values and reasonable range.
        density = ColorCurves.applyColorGradingSliderNonlinear(density);
        density *= 0.5;
        exposure = ColorCurves.applyColorGradingSliderNonlinear(exposure);
        if (density < 0) {
            density *= -1;
            hue = (hue + 180) % 360;
        }
        ColorCurves.fromHSBToRef(hue, density, 50 + 0.25 * exposure, result);
        result.scaleToRef(2, result);
        result.a = 1 + 0.01 * saturation;
    };
    /**
     * Takes an input slider value and returns an adjusted value that provides extra control near the centre.
     * @param value The input slider value in range [-100,100].
     * @returns Adjusted value.
     */
    ColorCurves.applyColorGradingSliderNonlinear = function (value) {
        value /= 100;
        var x = Math.abs(value);
        x = Math.pow(x, 2);
        if (value < 0) {
            x *= -1;
        }
        x *= 100;
        return x;
    };
    /**
     * Returns an RGBA Color4 based on Hue, Saturation and Brightness (also referred to as value, HSV).
     * @param hue The hue (H) input.
     * @param saturation The saturation (S) input.
     * @param brightness The brightness (B) input.
     * @result An RGBA color represented as Vector4.
     */
    ColorCurves.fromHSBToRef = function (hue, saturation, brightness, result) {
        var h = ColorCurves.clamp(hue, 0, 360);
        var s = ColorCurves.clamp(saturation / 100, 0, 1);
        var v = ColorCurves.clamp(brightness / 100, 0, 1);
        if (s === 0) {
            result.r = v;
            result.g = v;
            result.b = v;
        }
        else {
            // sector 0 to 5
            h /= 60;
            var i = Math.floor(h);
            // fractional part of h
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - s * f);
            var t = v * (1 - s * (1 - f));
            switch (i) {
                case 0:
                    result.r = v;
                    result.g = t;
                    result.b = p;
                    break;
                case 1:
                    result.r = q;
                    result.g = v;
                    result.b = p;
                    break;
                case 2:
                    result.r = p;
                    result.g = v;
                    result.b = t;
                    break;
                case 3:
                    result.r = p;
                    result.g = q;
                    result.b = v;
                    break;
                case 4:
                    result.r = t;
                    result.g = p;
                    result.b = v;
                    break;
                default: // case 5:
                    result.r = v;
                    result.g = p;
                    result.b = q;
                    break;
            }
        }
        result.a = 1;
    };
    /**
     * Returns a value clamped between min and max
     * @param value The value to clamp
     * @param min The minimum of value
     * @param max The maximum of value
     * @returns The clamped value.
     */
    ColorCurves.clamp = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    };
    /**
     * Clones the current color curve instance.
     * @return The cloned curves
     */
    ColorCurves.prototype.clone = function () {
        return SerializationHelper.Clone(function () { return new ColorCurves(); }, this);
    };
    /**
     * Serializes the current color curve instance to a json representation.
     * @return a JSON representation
     */
    ColorCurves.prototype.serialize = function () {
        return SerializationHelper.Serialize(this);
    };
    /**
     * Parses the color curve from a json representation.
     * @param source the JSON source to parse
     * @return The parsed curves
     */
    ColorCurves.Parse = function (source) {
        return SerializationHelper.Parse(function () { return new ColorCurves(); }, source, null, null);
    };
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_globalHue", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_globalDensity", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_globalSaturation", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_globalExposure", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_highlightsHue", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_highlightsDensity", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_highlightsSaturation", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_highlightsExposure", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_midtonesHue", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_midtonesDensity", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_midtonesSaturation", void 0);
    __decorate([
        serialize()
    ], ColorCurves.prototype, "_midtonesExposure", void 0);
    return ColorCurves;
}());
// References the dependencies.
SerializationHelper._ColorCurvesParser = ColorCurves.Parse;

/**
 * @hidden
 */
var ImageProcessingConfigurationDefines = /** @class */ (function (_super) {
    __extends(ImageProcessingConfigurationDefines, _super);
    function ImageProcessingConfigurationDefines() {
        var _this = _super.call(this) || this;
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
        _this.EXPOSURE = false;
        _this.rebuild();
        return _this;
    }
    return ImageProcessingConfigurationDefines;
}(MaterialDefines));
/**
 * This groups together the common properties used for image processing either in direct forward pass
 * or through post processing effect depending on the use of the image processing pipeline in your scene
 * or not.
 */
var ImageProcessingConfiguration = /** @class */ (function () {
    function ImageProcessingConfiguration() {
        /**
         * Color curves setup used in the effect if colorCurvesEnabled is set to true
         */
        this.colorCurves = new ColorCurves();
        this._colorCurvesEnabled = false;
        this._colorGradingEnabled = false;
        this._colorGradingWithGreenDepth = true;
        this._colorGradingBGR = true;
        /** @hidden */
        this._exposure = 1.0;
        this._toneMappingEnabled = false;
        this._toneMappingType = ImageProcessingConfiguration.TONEMAPPING_STANDARD;
        this._contrast = 1.0;
        /**
         * Vignette stretch size.
         */
        this.vignetteStretch = 0;
        /**
         * Vignette centre X Offset.
         */
        this.vignetteCentreX = 0;
        /**
         * Vignette centre Y Offset.
         */
        this.vignetteCentreY = 0;
        /**
         * Vignette weight or intensity of the vignette effect.
         */
        this.vignetteWeight = 1.5;
        /**
         * Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode)
         * if vignetteEnabled is set to true.
         */
        this.vignetteColor = new Color4(0, 0, 0, 0);
        /**
         * Camera field of view used by the Vignette effect.
         */
        this.vignetteCameraFov = 0.5;
        this._vignetteBlendMode = ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;
        this._vignetteEnabled = false;
        this._applyByPostProcess = false;
        this._isEnabled = true;
        /**
        * An event triggered when the configuration changes and requires Shader to Update some parameters.
        */
        this.onUpdateParameters = new Observable();
    }
    Object.defineProperty(ImageProcessingConfiguration.prototype, "colorCurvesEnabled", {
        /**
         * Gets wether the color curves effect is enabled.
         */
        get: function () {
            return this._colorCurvesEnabled;
        },
        /**
         * Sets wether the color curves effect is enabled.
         */
        set: function (value) {
            if (this._colorCurvesEnabled === value) {
                return;
            }
            this._colorCurvesEnabled = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "colorGradingTexture", {
        /**
         * Color grading LUT texture used in the effect if colorGradingEnabled is set to true
         */
        get: function () {
            return this._colorGradingTexture;
        },
        /**
         * Color grading LUT texture used in the effect if colorGradingEnabled is set to true
         */
        set: function (value) {
            if (this._colorGradingTexture === value) {
                return;
            }
            this._colorGradingTexture = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "colorGradingEnabled", {
        /**
         * Gets wether the color grading effect is enabled.
         */
        get: function () {
            return this._colorGradingEnabled;
        },
        /**
         * Sets wether the color grading effect is enabled.
         */
        set: function (value) {
            if (this._colorGradingEnabled === value) {
                return;
            }
            this._colorGradingEnabled = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "colorGradingWithGreenDepth", {
        /**
         * Gets wether the color grading effect is using a green depth for the 3d Texture.
         */
        get: function () {
            return this._colorGradingWithGreenDepth;
        },
        /**
         * Sets wether the color grading effect is using a green depth for the 3d Texture.
         */
        set: function (value) {
            if (this._colorGradingWithGreenDepth === value) {
                return;
            }
            this._colorGradingWithGreenDepth = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "colorGradingBGR", {
        /**
         * Gets wether the color grading texture contains BGR values.
         */
        get: function () {
            return this._colorGradingBGR;
        },
        /**
         * Sets wether the color grading texture contains BGR values.
         */
        set: function (value) {
            if (this._colorGradingBGR === value) {
                return;
            }
            this._colorGradingBGR = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "exposure", {
        /**
         * Gets the Exposure used in the effect.
         */
        get: function () {
            return this._exposure;
        },
        /**
         * Sets the Exposure used in the effect.
         */
        set: function (value) {
            if (this._exposure === value) {
                return;
            }
            this._exposure = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "toneMappingEnabled", {
        /**
         * Gets wether the tone mapping effect is enabled.
         */
        get: function () {
            return this._toneMappingEnabled;
        },
        /**
         * Sets wether the tone mapping effect is enabled.
         */
        set: function (value) {
            if (this._toneMappingEnabled === value) {
                return;
            }
            this._toneMappingEnabled = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "toneMappingType", {
        /**
         * Gets the type of tone mapping effect.
         */
        get: function () {
            return this._toneMappingType;
        },
        /**
         * Sets the type of tone mapping effect used in BabylonJS.
         */
        set: function (value) {
            if (this._toneMappingType === value) {
                return;
            }
            this._toneMappingType = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "contrast", {
        /**
         * Gets the contrast used in the effect.
         */
        get: function () {
            return this._contrast;
        },
        /**
         * Sets the contrast used in the effect.
         */
        set: function (value) {
            if (this._contrast === value) {
                return;
            }
            this._contrast = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "vignetteBlendMode", {
        /**
         * Gets the vignette blend mode allowing different kind of effect.
         */
        get: function () {
            return this._vignetteBlendMode;
        },
        /**
         * Sets the vignette blend mode allowing different kind of effect.
         */
        set: function (value) {
            if (this._vignetteBlendMode === value) {
                return;
            }
            this._vignetteBlendMode = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "vignetteEnabled", {
        /**
         * Gets wether the vignette effect is enabled.
         */
        get: function () {
            return this._vignetteEnabled;
        },
        /**
         * Sets wether the vignette effect is enabled.
         */
        set: function (value) {
            if (this._vignetteEnabled === value) {
                return;
            }
            this._vignetteEnabled = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "applyByPostProcess", {
        /**
         * Gets wether the image processing is applied through a post process or not.
         */
        get: function () {
            return this._applyByPostProcess;
        },
        /**
         * Sets wether the image processing is applied through a post process or not.
         */
        set: function (value) {
            if (this._applyByPostProcess === value) {
                return;
            }
            this._applyByPostProcess = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration.prototype, "isEnabled", {
        /**
         * Gets wether the image processing is enabled or not.
         */
        get: function () {
            return this._isEnabled;
        },
        /**
         * Sets wether the image processing is enabled or not.
         */
        set: function (value) {
            if (this._isEnabled === value) {
                return;
            }
            this._isEnabled = value;
            this._updateParameters();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Method called each time the image processing information changes requires to recompile the effect.
     */
    ImageProcessingConfiguration.prototype._updateParameters = function () {
        this.onUpdateParameters.notifyObservers(this);
    };
    /**
     * Gets the current class name.
     * @return "ImageProcessingConfiguration"
     */
    ImageProcessingConfiguration.prototype.getClassName = function () {
        return "ImageProcessingConfiguration";
    };
    /**
     * Prepare the list of uniforms associated with the Image Processing effects.
     * @param uniforms The list of uniforms used in the effect
     * @param defines the list of defines currently in use
     */
    ImageProcessingConfiguration.PrepareUniforms = function (uniforms, defines) {
        if (defines.EXPOSURE) {
            uniforms.push("exposureLinear");
        }
        if (defines.CONTRAST) {
            uniforms.push("contrast");
        }
        if (defines.COLORGRADING) {
            uniforms.push("colorTransformSettings");
        }
        if (defines.VIGNETTE) {
            uniforms.push("vInverseScreenSize");
            uniforms.push("vignetteSettings1");
            uniforms.push("vignetteSettings2");
        }
        if (defines.COLORCURVES) {
            ColorCurves.PrepareUniforms(uniforms);
        }
    };
    /**
     * Prepare the list of samplers associated with the Image Processing effects.
     * @param samplersList The list of uniforms used in the effect
     * @param defines the list of defines currently in use
     */
    ImageProcessingConfiguration.PrepareSamplers = function (samplersList, defines) {
        if (defines.COLORGRADING) {
            samplersList.push("txColorTransform");
        }
    };
    /**
     * Prepare the list of defines associated to the shader.
     * @param defines the list of defines to complete
     * @param forPostProcess Define if we are currently in post process mode or not
     */
    ImageProcessingConfiguration.prototype.prepareDefines = function (defines, forPostProcess) {
        if (forPostProcess === void 0) { forPostProcess = false; }
        if (forPostProcess !== this.applyByPostProcess || !this._isEnabled) {
            defines.VIGNETTE = false;
            defines.TONEMAPPING = false;
            defines.TONEMAPPING_ACES = false;
            defines.CONTRAST = false;
            defines.EXPOSURE = false;
            defines.COLORCURVES = false;
            defines.COLORGRADING = false;
            defines.COLORGRADING3D = false;
            defines.IMAGEPROCESSING = false;
            defines.IMAGEPROCESSINGPOSTPROCESS = this.applyByPostProcess && this._isEnabled;
            return;
        }
        defines.VIGNETTE = this.vignetteEnabled;
        defines.VIGNETTEBLENDMODEMULTIPLY = (this.vignetteBlendMode === ImageProcessingConfiguration._VIGNETTEMODE_MULTIPLY);
        defines.VIGNETTEBLENDMODEOPAQUE = !defines.VIGNETTEBLENDMODEMULTIPLY;
        defines.TONEMAPPING = this.toneMappingEnabled;
        switch (this._toneMappingType) {
            case ImageProcessingConfiguration.TONEMAPPING_ACES:
                defines.TONEMAPPING_ACES = true;
                break;
            default:
                defines.TONEMAPPING_ACES = false;
                break;
        }
        defines.CONTRAST = (this.contrast !== 1.0);
        defines.EXPOSURE = (this.exposure !== 1.0);
        defines.COLORCURVES = (this.colorCurvesEnabled && !!this.colorCurves);
        defines.COLORGRADING = (this.colorGradingEnabled && !!this.colorGradingTexture);
        if (defines.COLORGRADING) {
            defines.COLORGRADING3D = this.colorGradingTexture.is3D;
        }
        else {
            defines.COLORGRADING3D = false;
        }
        defines.SAMPLER3DGREENDEPTH = this.colorGradingWithGreenDepth;
        defines.SAMPLER3DBGRMAP = this.colorGradingBGR;
        defines.IMAGEPROCESSINGPOSTPROCESS = this.applyByPostProcess;
        defines.IMAGEPROCESSING = defines.VIGNETTE || defines.TONEMAPPING || defines.CONTRAST || defines.EXPOSURE || defines.COLORCURVES || defines.COLORGRADING;
    };
    /**
     * Returns true if all the image processing information are ready.
     * @returns True if ready, otherwise, false
     */
    ImageProcessingConfiguration.prototype.isReady = function () {
        // Color Grading texure can not be none blocking.
        return !this.colorGradingEnabled || !this.colorGradingTexture || this.colorGradingTexture.isReady();
    };
    /**
     * Binds the image processing to the shader.
     * @param effect The effect to bind to
     * @param overrideAspectRatio Override the aspect ratio of the effect
     */
    ImageProcessingConfiguration.prototype.bind = function (effect, overrideAspectRatio) {
        // Color Curves
        if (this._colorCurvesEnabled && this.colorCurves) {
            ColorCurves.Bind(this.colorCurves, effect);
        }
        // Vignette
        if (this._vignetteEnabled) {
            var inverseWidth = 1 / effect.getEngine().getRenderWidth();
            var inverseHeight = 1 / effect.getEngine().getRenderHeight();
            effect.setFloat2("vInverseScreenSize", inverseWidth, inverseHeight);
            var aspectRatio = overrideAspectRatio != null ? overrideAspectRatio : (inverseHeight / inverseWidth);
            var vignetteScaleY = Math.tan(this.vignetteCameraFov * 0.5);
            var vignetteScaleX = vignetteScaleY * aspectRatio;
            var vignetteScaleGeometricMean = Math.sqrt(vignetteScaleX * vignetteScaleY);
            vignetteScaleX = Tools.Mix(vignetteScaleX, vignetteScaleGeometricMean, this.vignetteStretch);
            vignetteScaleY = Tools.Mix(vignetteScaleY, vignetteScaleGeometricMean, this.vignetteStretch);
            effect.setFloat4("vignetteSettings1", vignetteScaleX, vignetteScaleY, -vignetteScaleX * this.vignetteCentreX, -vignetteScaleY * this.vignetteCentreY);
            var vignettePower = -2.0 * this.vignetteWeight;
            effect.setFloat4("vignetteSettings2", this.vignetteColor.r, this.vignetteColor.g, this.vignetteColor.b, vignettePower);
        }
        // Exposure
        effect.setFloat("exposureLinear", this.exposure);
        // Contrast
        effect.setFloat("contrast", this.contrast);
        // Color transform settings
        if (this.colorGradingTexture) {
            effect.setTexture("txColorTransform", this.colorGradingTexture);
            var textureSize = this.colorGradingTexture.getSize().height;
            effect.setFloat4("colorTransformSettings", (textureSize - 1) / textureSize, // textureScale
            0.5 / textureSize, // textureOffset
            textureSize, // textureSize
            this.colorGradingTexture.level // weight
            );
        }
    };
    /**
     * Clones the current image processing instance.
     * @return The cloned image processing
     */
    ImageProcessingConfiguration.prototype.clone = function () {
        return SerializationHelper.Clone(function () { return new ImageProcessingConfiguration(); }, this);
    };
    /**
     * Serializes the current image processing instance to a json representation.
     * @return a JSON representation
     */
    ImageProcessingConfiguration.prototype.serialize = function () {
        return SerializationHelper.Serialize(this);
    };
    /**
     * Parses the image processing from a json representation.
     * @param source the JSON source to parse
     * @return The parsed image processing
     */
    ImageProcessingConfiguration.Parse = function (source) {
        return SerializationHelper.Parse(function () { return new ImageProcessingConfiguration(); }, source, null, null);
    };
    Object.defineProperty(ImageProcessingConfiguration, "VIGNETTEMODE_MULTIPLY", {
        /**
         * Used to apply the vignette as a mix with the pixel color.
         */
        get: function () {
            return this._VIGNETTEMODE_MULTIPLY;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageProcessingConfiguration, "VIGNETTEMODE_OPAQUE", {
        /**
         * Used to apply the vignette as a replacement of the pixel color.
         */
        get: function () {
            return this._VIGNETTEMODE_OPAQUE;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Default tone mapping applied in BabylonJS.
     */
    ImageProcessingConfiguration.TONEMAPPING_STANDARD = 0;
    /**
     * ACES Tone mapping (used by default in unreal and unity). This can help getting closer
     * to other engines rendering to increase portability.
     */
    ImageProcessingConfiguration.TONEMAPPING_ACES = 1;
    // Static constants associated to the image processing.
    ImageProcessingConfiguration._VIGNETTEMODE_MULTIPLY = 0;
    ImageProcessingConfiguration._VIGNETTEMODE_OPAQUE = 1;
    __decorate([
        serializeAsColorCurves()
    ], ImageProcessingConfiguration.prototype, "colorCurves", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_colorCurvesEnabled", void 0);
    __decorate([
        serializeAsTexture("colorGradingTexture")
    ], ImageProcessingConfiguration.prototype, "_colorGradingTexture", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_colorGradingEnabled", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_colorGradingWithGreenDepth", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_colorGradingBGR", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_exposure", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_toneMappingEnabled", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_toneMappingType", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_contrast", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "vignetteStretch", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "vignetteCentreX", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "vignetteCentreY", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "vignetteWeight", void 0);
    __decorate([
        serializeAsColor4()
    ], ImageProcessingConfiguration.prototype, "vignetteColor", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "vignetteCameraFov", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_vignetteBlendMode", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_vignetteEnabled", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_applyByPostProcess", void 0);
    __decorate([
        serialize()
    ], ImageProcessingConfiguration.prototype, "_isEnabled", void 0);
    return ImageProcessingConfiguration;
}());
// References the dependencies.
SerializationHelper._ImageProcessingConfigurationParser = ImageProcessingConfiguration.Parse;

/**
 * ActionEvent is the event being sent when an action is triggered.
 */
var ActionEvent = /** @class */ (function () {
    /**
     * Creates a new ActionEvent
     * @param source The mesh or sprite that triggered the action
     * @param pointerX The X mouse cursor position at the time of the event
     * @param pointerY The Y mouse cursor position at the time of the event
     * @param meshUnderPointer The mesh that is currently pointed at (can be null)
     * @param sourceEvent the original (browser) event that triggered the ActionEvent
     * @param additionalData additional data for the event
     */
    function ActionEvent(
    /** The mesh or sprite that triggered the action */
    source, 
    /** The X mouse cursor position at the time of the event */
    pointerX, 
    /** The Y mouse cursor position at the time of the event */
    pointerY, 
    /** The mesh that is currently pointed at (can be null) */
    meshUnderPointer, 
    /** the original (browser) event that triggered the ActionEvent */
    sourceEvent, 
    /** additional data for the event */
    additionalData) {
        this.source = source;
        this.pointerX = pointerX;
        this.pointerY = pointerY;
        this.meshUnderPointer = meshUnderPointer;
        this.sourceEvent = sourceEvent;
        this.additionalData = additionalData;
    }
    /**
     * Helper function to auto-create an ActionEvent from a source mesh.
     * @param source The source mesh that triggered the event
     * @param evt The original (browser) event
     * @param additionalData additional data for the event
     * @returns the new ActionEvent
     */
    ActionEvent.CreateNew = function (source, evt, additionalData) {
        var scene = source.getScene();
        return new ActionEvent(source, scene.pointerX, scene.pointerY, scene.meshUnderPointer || source, evt, additionalData);
    };
    /**
     * Helper function to auto-create an ActionEvent from a source sprite
     * @param source The source sprite that triggered the event
     * @param scene Scene associated with the sprite
     * @param evt The original (browser) event
     * @param additionalData additional data for the event
     * @returns the new ActionEvent
     */
    ActionEvent.CreateNewFromSprite = function (source, scene, evt, additionalData) {
        return new ActionEvent(source, scene.pointerX, scene.pointerY, scene.meshUnderPointer, evt, additionalData);
    };
    /**
     * Helper function to auto-create an ActionEvent from a scene. If triggered by a mesh use ActionEvent.CreateNew
     * @param scene the scene where the event occurred
     * @param evt The original (browser) event
     * @returns the new ActionEvent
     */
    ActionEvent.CreateNewFromScene = function (scene, evt) {
        return new ActionEvent(null, scene.pointerX, scene.pointerY, scene.meshUnderPointer, evt);
    };
    /**
     * Helper function to auto-create an ActionEvent from a primitive
     * @param prim defines the target primitive
     * @param pointerPos defines the pointer position
     * @param evt The original (browser) event
     * @param additionalData additional data for the event
     * @returns the new ActionEvent
     */
    ActionEvent.CreateNewFromPrimitive = function (prim, pointerPos, evt, additionalData) {
        return new ActionEvent(prim, pointerPos.x, pointerPos.y, null, evt, additionalData);
    };
    return ActionEvent;
}());

/**
 * PostProcessManager is used to manage one or more post processes or post process pipelines
 * See https://doc.babylonjs.com/how_to/how_to_use_postprocesses
 */
var PostProcessManager = /** @class */ (function () {
    /**
     * Creates a new instance PostProcess
     * @param scene The scene that the post process is associated with.
     */
    function PostProcessManager(scene) {
        this._vertexBuffers = {};
        this._scene = scene;
    }
    PostProcessManager.prototype._prepareBuffers = function () {
        if (this._vertexBuffers[VertexBuffer.PositionKind]) {
            return;
        }
        // VBO
        var vertices = [];
        vertices.push(1, 1);
        vertices.push(-1, 1);
        vertices.push(-1, -1);
        vertices.push(1, -1);
        this._vertexBuffers[VertexBuffer.PositionKind] = new VertexBuffer(this._scene.getEngine(), vertices, VertexBuffer.PositionKind, false, false, 2);
        this._buildIndexBuffer();
    };
    PostProcessManager.prototype._buildIndexBuffer = function () {
        // Indices
        var indices = [];
        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(0);
        indices.push(2);
        indices.push(3);
        this._indexBuffer = this._scene.getEngine().createIndexBuffer(indices);
    };
    /**
     * Rebuilds the vertex buffers of the manager.
     * @hidden
     */
    PostProcessManager.prototype._rebuild = function () {
        var vb = this._vertexBuffers[VertexBuffer.PositionKind];
        if (!vb) {
            return;
        }
        vb._rebuild();
        this._buildIndexBuffer();
    };
    // Methods
    /**
     * Prepares a frame to be run through a post process.
     * @param sourceTexture The input texture to the post procesess. (default: null)
     * @param postProcesses An array of post processes to be run. (default: null)
     * @returns True if the post processes were able to be run.
     * @hidden
     */
    PostProcessManager.prototype._prepareFrame = function (sourceTexture, postProcesses) {
        if (sourceTexture === void 0) { sourceTexture = null; }
        if (postProcesses === void 0) { postProcesses = null; }
        var camera = this._scene.activeCamera;
        if (!camera) {
            return false;
        }
        postProcesses = postProcesses || camera._postProcesses.filter(function (pp) { return pp != null; });
        if (!postProcesses || postProcesses.length === 0 || !this._scene.postProcessesEnabled) {
            return false;
        }
        postProcesses[0].activate(camera, sourceTexture, postProcesses !== null && postProcesses !== undefined);
        return true;
    };
    /**
     * Manually render a set of post processes to a texture.
     * Please note, the frame buffer won't be unbound after the call in case you have more render to do.
     * @param postProcesses An array of post processes to be run.
     * @param targetTexture The target texture to render to.
     * @param forceFullscreenViewport force gl.viewport to be full screen eg. 0,0,textureWidth,textureHeight
     * @param faceIndex defines the face to render to if a cubemap is defined as the target
     * @param lodLevel defines which lod of the texture to render to
     * @param doNotBindFrambuffer If set to true, assumes that the framebuffer has been bound previously
     */
    PostProcessManager.prototype.directRender = function (postProcesses, targetTexture, forceFullscreenViewport, faceIndex, lodLevel, doNotBindFrambuffer) {
        if (targetTexture === void 0) { targetTexture = null; }
        if (forceFullscreenViewport === void 0) { forceFullscreenViewport = false; }
        if (faceIndex === void 0) { faceIndex = 0; }
        if (lodLevel === void 0) { lodLevel = 0; }
        if (doNotBindFrambuffer === void 0) { doNotBindFrambuffer = false; }
        var engine = this._scene.getEngine();
        for (var index = 0; index < postProcesses.length; index++) {
            if (index < postProcesses.length - 1) {
                postProcesses[index + 1].activate(this._scene.activeCamera, targetTexture);
            }
            else {
                if (targetTexture) {
                    engine.bindFramebuffer(targetTexture, faceIndex, undefined, undefined, forceFullscreenViewport, lodLevel);
                }
                else if (!doNotBindFrambuffer) {
                    engine.restoreDefaultFramebuffer();
                }
            }
            var pp = postProcesses[index];
            var effect = pp.apply();
            if (effect) {
                pp.onBeforeRenderObservable.notifyObservers(effect);
                // VBOs
                this._prepareBuffers();
                engine.bindBuffers(this._vertexBuffers, this._indexBuffer, effect);
                // Draw order
                engine.drawElementsType(Material.TriangleFillMode, 0, 6);
                pp.onAfterRenderObservable.notifyObservers(effect);
            }
        }
        // Restore depth buffer
        engine.setDepthBuffer(true);
        engine.setDepthWrite(true);
    };
    /**
     * Finalize the result of the output of the postprocesses.
     * @param doNotPresent If true the result will not be displayed to the screen.
     * @param targetTexture The target texture to render to.
     * @param faceIndex The index of the face to bind the target texture to.
     * @param postProcesses The array of post processes to render.
     * @param forceFullscreenViewport force gl.viewport to be full screen eg. 0,0,textureWidth,textureHeight (default: false)
     * @hidden
     */
    PostProcessManager.prototype._finalizeFrame = function (doNotPresent, targetTexture, faceIndex, postProcesses, forceFullscreenViewport) {
        if (forceFullscreenViewport === void 0) { forceFullscreenViewport = false; }
        var camera = this._scene.activeCamera;
        if (!camera) {
            return;
        }
        postProcesses = postProcesses || camera._postProcesses.filter(function (pp) { return pp != null; });
        if (postProcesses.length === 0 || !this._scene.postProcessesEnabled) {
            return;
        }
        var engine = this._scene.getEngine();
        for (var index = 0, len = postProcesses.length; index < len; index++) {
            var pp = postProcesses[index];
            if (index < len - 1) {
                pp._outputTexture = postProcesses[index + 1].activate(camera, targetTexture);
            }
            else {
                if (targetTexture) {
                    engine.bindFramebuffer(targetTexture, faceIndex, undefined, undefined, forceFullscreenViewport);
                    pp._outputTexture = targetTexture;
                }
                else {
                    engine.restoreDefaultFramebuffer();
                    pp._outputTexture = null;
                }
            }
            if (doNotPresent) {
                break;
            }
            var effect = pp.apply();
            if (effect) {
                pp.onBeforeRenderObservable.notifyObservers(effect);
                // VBOs
                this._prepareBuffers();
                engine.bindBuffers(this._vertexBuffers, this._indexBuffer, effect);
                // Draw order
                engine.drawElementsType(Material.TriangleFillMode, 0, 6);
                pp.onAfterRenderObservable.notifyObservers(effect);
            }
        }
        // Restore states
        engine.setDepthBuffer(true);
        engine.setDepthWrite(true);
        engine.setAlphaMode(0);
    };
    /**
     * Disposes of the post process manager.
     */
    PostProcessManager.prototype.dispose = function () {
        var buffer = this._vertexBuffers[VertexBuffer.PositionKind];
        if (buffer) {
            buffer.dispose();
            this._vertexBuffers[VertexBuffer.PositionKind] = null;
        }
        if (this._indexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
    };
    return PostProcessManager;
}());

/**
 * This represents the object necessary to create a rendering group.
 * This is exclusively used and created by the rendering manager.
 * To modify the behavior, you use the available helpers in your scene or meshes.
 * @hidden
 */
var RenderingGroup = /** @class */ (function () {
    /**
     * Creates a new rendering group.
     * @param index The rendering group index
     * @param opaqueSortCompareFn The opaque sort comparison function. If null no order is applied
     * @param alphaTestSortCompareFn The alpha test sort comparison function. If null no order is applied
     * @param transparentSortCompareFn The transparent sort comparison function. If null back to front + alpha index sort is applied
     */
    function RenderingGroup(index, scene, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn) {
        if (opaqueSortCompareFn === void 0) { opaqueSortCompareFn = null; }
        if (alphaTestSortCompareFn === void 0) { alphaTestSortCompareFn = null; }
        if (transparentSortCompareFn === void 0) { transparentSortCompareFn = null; }
        this.index = index;
        this._opaqueSubMeshes = new SmartArray(256);
        this._transparentSubMeshes = new SmartArray(256);
        this._alphaTestSubMeshes = new SmartArray(256);
        this._depthOnlySubMeshes = new SmartArray(256);
        this._particleSystems = new SmartArray(256);
        this._spriteManagers = new SmartArray(256);
        /** @hidden */
        this._edgesRenderers = new SmartArrayNoDuplicate(16);
        this._scene = scene;
        this.opaqueSortCompareFn = opaqueSortCompareFn;
        this.alphaTestSortCompareFn = alphaTestSortCompareFn;
        this.transparentSortCompareFn = transparentSortCompareFn;
    }
    Object.defineProperty(RenderingGroup.prototype, "opaqueSortCompareFn", {
        /**
         * Set the opaque sort comparison function.
         * If null the sub meshes will be render in the order they were created
         */
        set: function (value) {
            this._opaqueSortCompareFn = value;
            if (value) {
                this._renderOpaque = this.renderOpaqueSorted;
            }
            else {
                this._renderOpaque = RenderingGroup.renderUnsorted;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderingGroup.prototype, "alphaTestSortCompareFn", {
        /**
         * Set the alpha test sort comparison function.
         * If null the sub meshes will be render in the order they were created
         */
        set: function (value) {
            this._alphaTestSortCompareFn = value;
            if (value) {
                this._renderAlphaTest = this.renderAlphaTestSorted;
            }
            else {
                this._renderAlphaTest = RenderingGroup.renderUnsorted;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderingGroup.prototype, "transparentSortCompareFn", {
        /**
         * Set the transparent sort comparison function.
         * If null the sub meshes will be render in the order they were created
         */
        set: function (value) {
            if (value) {
                this._transparentSortCompareFn = value;
            }
            else {
                this._transparentSortCompareFn = RenderingGroup.defaultTransparentSortCompare;
            }
            this._renderTransparent = this.renderTransparentSorted;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Render all the sub meshes contained in the group.
     * @param customRenderFunction Used to override the default render behaviour of the group.
     * @returns true if rendered some submeshes.
     */
    RenderingGroup.prototype.render = function (customRenderFunction, renderSprites, renderParticles, activeMeshes) {
        if (customRenderFunction) {
            customRenderFunction(this._opaqueSubMeshes, this._alphaTestSubMeshes, this._transparentSubMeshes, this._depthOnlySubMeshes);
            return;
        }
        var engine = this._scene.getEngine();
        // Depth only
        if (this._depthOnlySubMeshes.length !== 0) {
            engine.setColorWrite(false);
            this._renderAlphaTest(this._depthOnlySubMeshes);
            engine.setColorWrite(true);
        }
        // Opaque
        if (this._opaqueSubMeshes.length !== 0) {
            this._renderOpaque(this._opaqueSubMeshes);
        }
        // Alpha test
        if (this._alphaTestSubMeshes.length !== 0) {
            this._renderAlphaTest(this._alphaTestSubMeshes);
        }
        var stencilState = engine.getStencilBuffer();
        engine.setStencilBuffer(false);
        // Sprites
        if (renderSprites) {
            this._renderSprites();
        }
        // Particles
        if (renderParticles) {
            this._renderParticles(activeMeshes);
        }
        if (this.onBeforeTransparentRendering) {
            this.onBeforeTransparentRendering();
        }
        // Transparent
        if (this._transparentSubMeshes.length !== 0) {
            engine.setStencilBuffer(stencilState);
            this._renderTransparent(this._transparentSubMeshes);
            engine.setAlphaMode(0);
        }
        // Set back stencil to false in case it changes before the edge renderer.
        engine.setStencilBuffer(false);
        // Edges
        if (this._edgesRenderers.length) {
            for (var edgesRendererIndex = 0; edgesRendererIndex < this._edgesRenderers.length; edgesRendererIndex++) {
                this._edgesRenderers.data[edgesRendererIndex].render();
            }
            engine.setAlphaMode(0);
        }
        // Restore Stencil state.
        engine.setStencilBuffer(stencilState);
    };
    /**
     * Renders the opaque submeshes in the order from the opaqueSortCompareFn.
     * @param subMeshes The submeshes to render
     */
    RenderingGroup.prototype.renderOpaqueSorted = function (subMeshes) {
        return RenderingGroup.renderSorted(subMeshes, this._opaqueSortCompareFn, this._scene.activeCamera, false);
    };
    /**
     * Renders the opaque submeshes in the order from the alphatestSortCompareFn.
     * @param subMeshes The submeshes to render
     */
    RenderingGroup.prototype.renderAlphaTestSorted = function (subMeshes) {
        return RenderingGroup.renderSorted(subMeshes, this._alphaTestSortCompareFn, this._scene.activeCamera, false);
    };
    /**
     * Renders the opaque submeshes in the order from the transparentSortCompareFn.
     * @param subMeshes The submeshes to render
     */
    RenderingGroup.prototype.renderTransparentSorted = function (subMeshes) {
        return RenderingGroup.renderSorted(subMeshes, this._transparentSortCompareFn, this._scene.activeCamera, true);
    };
    /**
     * Renders the submeshes in a specified order.
     * @param subMeshes The submeshes to sort before render
     * @param sortCompareFn The comparison function use to sort
     * @param cameraPosition The camera position use to preprocess the submeshes to help sorting
     * @param transparent Specifies to activate blending if true
     */
    RenderingGroup.renderSorted = function (subMeshes, sortCompareFn, camera, transparent) {
        var subIndex = 0;
        var subMesh;
        var cameraPosition = camera ? camera.globalPosition : RenderingGroup._zeroVector;
        for (; subIndex < subMeshes.length; subIndex++) {
            subMesh = subMeshes.data[subIndex];
            subMesh._alphaIndex = subMesh.getMesh().alphaIndex;
            subMesh._distanceToCamera = Vector3.Distance(subMesh.getBoundingInfo().boundingSphere.centerWorld, cameraPosition);
        }
        var sortedArray = subMeshes.data.slice(0, subMeshes.length);
        if (sortCompareFn) {
            sortedArray.sort(sortCompareFn);
        }
        for (subIndex = 0; subIndex < sortedArray.length; subIndex++) {
            subMesh = sortedArray[subIndex];
            if (transparent) {
                var material = subMesh.getMaterial();
                if (material && material.needDepthPrePass) {
                    var engine = material.getScene().getEngine();
                    engine.setColorWrite(false);
                    engine.setAlphaMode(0);
                    subMesh.render(false);
                    engine.setColorWrite(true);
                }
            }
            subMesh.render(transparent);
        }
    };
    /**
     * Renders the submeshes in the order they were dispatched (no sort applied).
     * @param subMeshes The submeshes to render
     */
    RenderingGroup.renderUnsorted = function (subMeshes) {
        for (var subIndex = 0; subIndex < subMeshes.length; subIndex++) {
            var submesh = subMeshes.data[subIndex];
            submesh.render(false);
        }
    };
    /**
     * Build in function which can be applied to ensure meshes of a special queue (opaque, alpha test, transparent)
     * are rendered back to front if in the same alpha index.
     *
     * @param a The first submesh
     * @param b The second submesh
     * @returns The result of the comparison
     */
    RenderingGroup.defaultTransparentSortCompare = function (a, b) {
        // Alpha index first
        if (a._alphaIndex > b._alphaIndex) {
            return 1;
        }
        if (a._alphaIndex < b._alphaIndex) {
            return -1;
        }
        // Then distance to camera
        return RenderingGroup.backToFrontSortCompare(a, b);
    };
    /**
     * Build in function which can be applied to ensure meshes of a special queue (opaque, alpha test, transparent)
     * are rendered back to front.
     *
     * @param a The first submesh
     * @param b The second submesh
     * @returns The result of the comparison
     */
    RenderingGroup.backToFrontSortCompare = function (a, b) {
        // Then distance to camera
        if (a._distanceToCamera < b._distanceToCamera) {
            return 1;
        }
        if (a._distanceToCamera > b._distanceToCamera) {
            return -1;
        }
        return 0;
    };
    /**
     * Build in function which can be applied to ensure meshes of a special queue (opaque, alpha test, transparent)
     * are rendered front to back (prevent overdraw).
     *
     * @param a The first submesh
     * @param b The second submesh
     * @returns The result of the comparison
     */
    RenderingGroup.frontToBackSortCompare = function (a, b) {
        // Then distance to camera
        if (a._distanceToCamera < b._distanceToCamera) {
            return -1;
        }
        if (a._distanceToCamera > b._distanceToCamera) {
            return 1;
        }
        return 0;
    };
    /**
     * Resets the different lists of submeshes to prepare a new frame.
     */
    RenderingGroup.prototype.prepare = function () {
        this._opaqueSubMeshes.reset();
        this._transparentSubMeshes.reset();
        this._alphaTestSubMeshes.reset();
        this._depthOnlySubMeshes.reset();
        this._particleSystems.reset();
        this._spriteManagers.reset();
        this._edgesRenderers.reset();
    };
    RenderingGroup.prototype.dispose = function () {
        this._opaqueSubMeshes.dispose();
        this._transparentSubMeshes.dispose();
        this._alphaTestSubMeshes.dispose();
        this._depthOnlySubMeshes.dispose();
        this._particleSystems.dispose();
        this._spriteManagers.dispose();
        this._edgesRenderers.dispose();
    };
    /**
     * Inserts the submesh in its correct queue depending on its material.
     * @param subMesh The submesh to dispatch
     * @param [mesh] Optional reference to the submeshes's mesh. Provide if you have an exiting reference to improve performance.
     * @param [material] Optional reference to the submeshes's material. Provide if you have an exiting reference to improve performance.
     */
    RenderingGroup.prototype.dispatch = function (subMesh, mesh, material) {
        // Get mesh and materials if not provided
        if (mesh === undefined) {
            mesh = subMesh.getMesh();
        }
        if (material === undefined) {
            material = subMesh.getMaterial();
        }
        if (material === null || material === undefined) {
            return;
        }
        if (material.needAlphaBlendingForMesh(mesh)) { // Transparent
            this._transparentSubMeshes.push(subMesh);
        }
        else if (material.needAlphaTesting()) { // Alpha test
            if (material.needDepthPrePass) {
                this._depthOnlySubMeshes.push(subMesh);
            }
            this._alphaTestSubMeshes.push(subMesh);
        }
        else {
            if (material.needDepthPrePass) {
                this._depthOnlySubMeshes.push(subMesh);
            }
            this._opaqueSubMeshes.push(subMesh); // Opaque
        }
        mesh._renderingGroup = this;
        if (mesh._edgesRenderer && mesh._edgesRenderer.isEnabled) {
            this._edgesRenderers.pushNoDuplicate(mesh._edgesRenderer);
        }
    };
    RenderingGroup.prototype.dispatchSprites = function (spriteManager) {
        this._spriteManagers.push(spriteManager);
    };
    RenderingGroup.prototype.dispatchParticles = function (particleSystem) {
        this._particleSystems.push(particleSystem);
    };
    RenderingGroup.prototype._renderParticles = function (activeMeshes) {
        if (this._particleSystems.length === 0) {
            return;
        }
        // Particles
        var activeCamera = this._scene.activeCamera;
        this._scene.onBeforeParticlesRenderingObservable.notifyObservers(this._scene);
        for (var particleIndex = 0; particleIndex < this._particleSystems.length; particleIndex++) {
            var particleSystem = this._particleSystems.data[particleIndex];
            if ((activeCamera && activeCamera.layerMask & particleSystem.layerMask) === 0) {
                continue;
            }
            var emitter = particleSystem.emitter;
            if (!emitter.position || !activeMeshes || activeMeshes.indexOf(emitter) !== -1) {
                this._scene._activeParticles.addCount(particleSystem.render(), false);
            }
        }
        this._scene.onAfterParticlesRenderingObservable.notifyObservers(this._scene);
    };
    RenderingGroup.prototype._renderSprites = function () {
        if (!this._scene.spritesEnabled || this._spriteManagers.length === 0) {
            return;
        }
        // Sprites
        var activeCamera = this._scene.activeCamera;
        this._scene.onBeforeSpritesRenderingObservable.notifyObservers(this._scene);
        for (var id = 0; id < this._spriteManagers.length; id++) {
            var spriteManager = this._spriteManagers.data[id];
            if (((activeCamera && activeCamera.layerMask & spriteManager.layerMask) !== 0)) {
                spriteManager.render();
            }
        }
        this._scene.onAfterSpritesRenderingObservable.notifyObservers(this._scene);
    };
    RenderingGroup._zeroVector = Vector3.Zero();
    return RenderingGroup;
}());

/**
 * This class is used by the onRenderingGroupObservable
 */
var RenderingGroupInfo = /** @class */ (function () {
    function RenderingGroupInfo() {
    }
    return RenderingGroupInfo;
}());
/**
 * This is the manager responsible of all the rendering for meshes sprites and particles.
 * It is enable to manage the different groups as well as the different necessary sort functions.
 * This should not be used directly aside of the few static configurations
 */
var RenderingManager = /** @class */ (function () {
    /**
     * Instantiates a new rendering group for a particular scene
     * @param scene Defines the scene the groups belongs to
     */
    function RenderingManager(scene) {
        /**
         * @hidden
         */
        this._useSceneAutoClearSetup = false;
        this._renderingGroups = new Array();
        this._autoClearDepthStencil = {};
        this._customOpaqueSortCompareFn = {};
        this._customAlphaTestSortCompareFn = {};
        this._customTransparentSortCompareFn = {};
        this._renderingGroupInfo = new RenderingGroupInfo();
        this._scene = scene;
        for (var i = RenderingManager.MIN_RENDERINGGROUPS; i < RenderingManager.MAX_RENDERINGGROUPS; i++) {
            this._autoClearDepthStencil[i] = { autoClear: true, depth: true, stencil: true };
        }
    }
    RenderingManager.prototype._clearDepthStencilBuffer = function (depth, stencil) {
        if (depth === void 0) { depth = true; }
        if (stencil === void 0) { stencil = true; }
        if (this._depthStencilBufferAlreadyCleaned) {
            return;
        }
        this._scene.getEngine().clear(null, false, depth, stencil);
        this._depthStencilBufferAlreadyCleaned = true;
    };
    /**
     * Renders the entire managed groups. This is used by the scene or the different rennder targets.
     * @hidden
     */
    RenderingManager.prototype.render = function (customRenderFunction, activeMeshes, renderParticles, renderSprites) {
        // Update the observable context (not null as it only goes away on dispose)
        var info = this._renderingGroupInfo;
        info.scene = this._scene;
        info.camera = this._scene.activeCamera;
        // Dispatch sprites
        if (this._scene.spriteManagers && renderSprites) {
            for (var index = 0; index < this._scene.spriteManagers.length; index++) {
                var manager = this._scene.spriteManagers[index];
                this.dispatchSprites(manager);
            }
        }
        // Render
        for (var index = RenderingManager.MIN_RENDERINGGROUPS; index < RenderingManager.MAX_RENDERINGGROUPS; index++) {
            this._depthStencilBufferAlreadyCleaned = index === RenderingManager.MIN_RENDERINGGROUPS;
            var renderingGroup = this._renderingGroups[index];
            if (!renderingGroup) {
                continue;
            }
            var renderingGroupMask = Math.pow(2, index);
            info.renderingGroupId = index;
            // Before Observable
            this._scene.onBeforeRenderingGroupObservable.notifyObservers(info, renderingGroupMask);
            // Clear depth/stencil if needed
            if (RenderingManager.AUTOCLEAR) {
                var autoClear = this._useSceneAutoClearSetup ?
                    this._scene.getAutoClearDepthStencilSetup(index) :
                    this._autoClearDepthStencil[index];
                if (autoClear && autoClear.autoClear) {
                    this._clearDepthStencilBuffer(autoClear.depth, autoClear.stencil);
                }
            }
            // Render
            for (var _i = 0, _a = this._scene._beforeRenderingGroupDrawStage; _i < _a.length; _i++) {
                var step = _a[_i];
                step.action(index);
            }
            renderingGroup.render(customRenderFunction, renderSprites, renderParticles, activeMeshes);
            for (var _b = 0, _c = this._scene._afterRenderingGroupDrawStage; _b < _c.length; _b++) {
                var step = _c[_b];
                step.action(index);
            }
            // After Observable
            this._scene.onAfterRenderingGroupObservable.notifyObservers(info, renderingGroupMask);
        }
    };
    /**
     * Resets the different information of the group to prepare a new frame
     * @hidden
     */
    RenderingManager.prototype.reset = function () {
        for (var index = RenderingManager.MIN_RENDERINGGROUPS; index < RenderingManager.MAX_RENDERINGGROUPS; index++) {
            var renderingGroup = this._renderingGroups[index];
            if (renderingGroup) {
                renderingGroup.prepare();
            }
        }
    };
    /**
     * Dispose and release the group and its associated resources.
     * @hidden
     */
    RenderingManager.prototype.dispose = function () {
        this.freeRenderingGroups();
        this._renderingGroups.length = 0;
        this._renderingGroupInfo = null;
    };
    /**
     * Clear the info related to rendering groups preventing retention points during dispose.
     */
    RenderingManager.prototype.freeRenderingGroups = function () {
        for (var index = RenderingManager.MIN_RENDERINGGROUPS; index < RenderingManager.MAX_RENDERINGGROUPS; index++) {
            var renderingGroup = this._renderingGroups[index];
            if (renderingGroup) {
                renderingGroup.dispose();
            }
        }
    };
    RenderingManager.prototype._prepareRenderingGroup = function (renderingGroupId) {
        if (this._renderingGroups[renderingGroupId] === undefined) {
            this._renderingGroups[renderingGroupId] = new RenderingGroup(renderingGroupId, this._scene, this._customOpaqueSortCompareFn[renderingGroupId], this._customAlphaTestSortCompareFn[renderingGroupId], this._customTransparentSortCompareFn[renderingGroupId]);
        }
    };
    /**
     * Add a sprite manager to the rendering manager in order to render it this frame.
     * @param spriteManager Define the sprite manager to render
     */
    RenderingManager.prototype.dispatchSprites = function (spriteManager) {
        var renderingGroupId = spriteManager.renderingGroupId || 0;
        this._prepareRenderingGroup(renderingGroupId);
        this._renderingGroups[renderingGroupId].dispatchSprites(spriteManager);
    };
    /**
     * Add a particle system to the rendering manager in order to render it this frame.
     * @param particleSystem Define the particle system to render
     */
    RenderingManager.prototype.dispatchParticles = function (particleSystem) {
        var renderingGroupId = particleSystem.renderingGroupId || 0;
        this._prepareRenderingGroup(renderingGroupId);
        this._renderingGroups[renderingGroupId].dispatchParticles(particleSystem);
    };
    /**
     * Add a submesh to the manager in order to render it this frame
     * @param subMesh The submesh to dispatch
     * @param mesh Optional reference to the submeshes's mesh. Provide if you have an exiting reference to improve performance.
     * @param material Optional reference to the submeshes's material. Provide if you have an exiting reference to improve performance.
     */
    RenderingManager.prototype.dispatch = function (subMesh, mesh, material) {
        if (mesh === undefined) {
            mesh = subMesh.getMesh();
        }
        var renderingGroupId = mesh.renderingGroupId || 0;
        this._prepareRenderingGroup(renderingGroupId);
        this._renderingGroups[renderingGroupId].dispatch(subMesh, mesh, material);
    };
    /**
     * Overrides the default sort function applied in the renderging group to prepare the meshes.
     * This allowed control for front to back rendering or reversly depending of the special needs.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param opaqueSortCompareFn The opaque queue comparison function use to sort.
     * @param alphaTestSortCompareFn The alpha test queue comparison function use to sort.
     * @param transparentSortCompareFn The transparent queue comparison function use to sort.
     */
    RenderingManager.prototype.setRenderingOrder = function (renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn) {
        if (opaqueSortCompareFn === void 0) { opaqueSortCompareFn = null; }
        if (alphaTestSortCompareFn === void 0) { alphaTestSortCompareFn = null; }
        if (transparentSortCompareFn === void 0) { transparentSortCompareFn = null; }
        this._customOpaqueSortCompareFn[renderingGroupId] = opaqueSortCompareFn;
        this._customAlphaTestSortCompareFn[renderingGroupId] = alphaTestSortCompareFn;
        this._customTransparentSortCompareFn[renderingGroupId] = transparentSortCompareFn;
        if (this._renderingGroups[renderingGroupId]) {
            var group = this._renderingGroups[renderingGroupId];
            group.opaqueSortCompareFn = this._customOpaqueSortCompareFn[renderingGroupId];
            group.alphaTestSortCompareFn = this._customAlphaTestSortCompareFn[renderingGroupId];
            group.transparentSortCompareFn = this._customTransparentSortCompareFn[renderingGroupId];
        }
    };
    /**
     * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
     * @param depth Automatically clears depth between groups if true and autoClear is true.
     * @param stencil Automatically clears stencil between groups if true and autoClear is true.
     */
    RenderingManager.prototype.setRenderingAutoClearDepthStencil = function (renderingGroupId, autoClearDepthStencil, depth, stencil) {
        if (depth === void 0) { depth = true; }
        if (stencil === void 0) { stencil = true; }
        this._autoClearDepthStencil[renderingGroupId] = {
            autoClear: autoClearDepthStencil,
            depth: depth,
            stencil: stencil
        };
    };
    /**
     * Gets the current auto clear configuration for one rendering group of the rendering
     * manager.
     * @param index the rendering group index to get the information for
     * @returns The auto clear setup for the requested rendering group
     */
    RenderingManager.prototype.getAutoClearDepthStencilSetup = function (index) {
        return this._autoClearDepthStencil[index];
    };
    /**
     * The max id used for rendering groups (not included)
     */
    RenderingManager.MAX_RENDERINGGROUPS = 4;
    /**
     * The min id used for rendering groups (included)
     */
    RenderingManager.MIN_RENDERINGGROUPS = 0;
    /**
     * Used to globally prevent autoclearing scenes.
     */
    RenderingManager.AUTOCLEAR = true;
    return RenderingManager;
}());

/**
 * Abstract class used to decouple action Manager from scene and meshes.
 * Do not instantiate.
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions
 */
var AbstractActionManager = /** @class */ (function () {
    function AbstractActionManager() {
        /** Gets the cursor to use when hovering items */
        this.hoverCursor = '';
        /** Gets the list of actions */
        this.actions = new Array();
        /**
         * Gets or sets a boolean indicating that the manager is recursive meaning that it can trigger action from children
         */
        this.isRecursive = false;
    }
    Object.defineProperty(AbstractActionManager, "HasTriggers", {
        /**
         * Does exist one action manager with at least one trigger
         **/
        get: function () {
            for (var t in AbstractActionManager.Triggers) {
                if (AbstractActionManager.Triggers.hasOwnProperty(t)) {
                    return true;
                }
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractActionManager, "HasPickTriggers", {
        /**
         * Does exist one action manager with at least one pick trigger
         **/
        get: function () {
            for (var t in AbstractActionManager.Triggers) {
                if (AbstractActionManager.Triggers.hasOwnProperty(t)) {
                    var t_int = parseInt(t);
                    if (t_int >= 1 && t_int <= 7) {
                        return true;
                    }
                }
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Does exist one action manager that handles actions of a given trigger
     * @param trigger defines the trigger to be tested
     * @return a boolean indicating whether the trigger is handeled by at least one action manager
    **/
    AbstractActionManager.HasSpecificTrigger = function (trigger) {
        for (var t in AbstractActionManager.Triggers) {
            if (AbstractActionManager.Triggers.hasOwnProperty(t)) {
                var t_int = parseInt(t);
                if (t_int === trigger) {
                    return true;
                }
            }
        }
        return false;
    };
    /** Gets the list of active triggers */
    AbstractActionManager.Triggers = {};
    return AbstractActionManager;
}());

/** @hidden */
var _ClickInfo = /** @class */ (function () {
    function _ClickInfo() {
        this._singleClick = false;
        this._doubleClick = false;
        this._hasSwiped = false;
        this._ignore = false;
    }
    Object.defineProperty(_ClickInfo.prototype, "singleClick", {
        get: function () {
            return this._singleClick;
        },
        set: function (b) {
            this._singleClick = b;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_ClickInfo.prototype, "doubleClick", {
        get: function () {
            return this._doubleClick;
        },
        set: function (b) {
            this._doubleClick = b;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_ClickInfo.prototype, "hasSwiped", {
        get: function () {
            return this._hasSwiped;
        },
        set: function (b) {
            this._hasSwiped = b;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(_ClickInfo.prototype, "ignore", {
        get: function () {
            return this._ignore;
        },
        set: function (b) {
            this._ignore = b;
        },
        enumerable: false,
        configurable: true
    });
    return _ClickInfo;
}());
/**
 * Class used to manage all inputs for the scene.
 */
var InputManager = /** @class */ (function () {
    /**
     * Creates a new InputManager
     * @param scene defines the hosting scene
     */
    function InputManager(scene) {
        /** This is a defensive check to not allow control attachment prior to an already active one. If already attached, previous control is unattached before attaching the new one. */
        this._alreadyAttached = false;
        // Pointers
        this._wheelEventName = "";
        this._meshPickProceed = false;
        this._currentPickResult = null;
        this._previousPickResult = null;
        this._totalPointersPressed = 0;
        this._doubleClickOccured = false;
        this._pointerX = 0;
        this._pointerY = 0;
        this._startingPointerPosition = new Vector2(0, 0);
        this._previousStartingPointerPosition = new Vector2(0, 0);
        this._startingPointerTime = 0;
        this._previousStartingPointerTime = 0;
        this._pointerCaptures = {};
        this._meshUnderPointerId = [];
        this._keyboardIsAttached = false;
        this._scene = scene;
    }
    Object.defineProperty(InputManager.prototype, "meshUnderPointer", {
        /**
         * Gets the mesh that is currently under the pointer
         */
        get: function () {
            return this._pointerOverMesh;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * When using more than one pointer (for example in XR) you can get the mesh under the specific pointer
     * @param pointerId the pointer id to use
     * @returns The mesh under this pointer id or null if not found
     */
    InputManager.prototype.getMeshUnderPointerByPointerId = function (pointerId) {
        return this._meshUnderPointerId[pointerId];
    };
    Object.defineProperty(InputManager.prototype, "unTranslatedPointer", {
        /**
         * Gets the pointer coordinates in 2D without any translation (ie. straight out of the pointer event)
         */
        get: function () {
            return new Vector2(this._unTranslatedPointerX, this._unTranslatedPointerY);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "pointerX", {
        /**
         * Gets or sets the current on-screen X position of the pointer
         */
        get: function () {
            return this._pointerX;
        },
        set: function (value) {
            this._pointerX = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "pointerY", {
        /**
         * Gets or sets the current on-screen Y position of the pointer
         */
        get: function () {
            return this._pointerY;
        },
        set: function (value) {
            this._pointerY = value;
        },
        enumerable: false,
        configurable: true
    });
    InputManager.prototype._updatePointerPosition = function (evt) {
        var canvasRect = this._scene.getEngine().getInputElementClientRect();
        if (!canvasRect) {
            return;
        }
        this._pointerX = evt.clientX - canvasRect.left;
        this._pointerY = evt.clientY - canvasRect.top;
        this._unTranslatedPointerX = this._pointerX;
        this._unTranslatedPointerY = this._pointerY;
    };
    InputManager.prototype._processPointerMove = function (pickResult, evt) {
        var scene = this._scene;
        var engine = scene.getEngine();
        var canvas = engine.getInputElement();
        if (!canvas) {
            return;
        }
        canvas.tabIndex = engine.canvasTabIndex;
        // Restore pointer
        if (!scene.doNotHandleCursors) {
            canvas.style.cursor = scene.defaultCursor;
        }
        var isMeshPicked = pickResult && pickResult.hit && pickResult.pickedMesh ? true : false;
        if (isMeshPicked) {
            scene.setPointerOverMesh(pickResult.pickedMesh, evt.pointerId);
            if (this._pointerOverMesh && this._pointerOverMesh.actionManager && this._pointerOverMesh.actionManager.hasPointerTriggers) {
                if (!scene.doNotHandleCursors) {
                    if (this._pointerOverMesh.actionManager.hoverCursor) {
                        canvas.style.cursor = this._pointerOverMesh.actionManager.hoverCursor;
                    }
                    else {
                        canvas.style.cursor = scene.hoverCursor;
                    }
                }
            }
        }
        else {
            scene.setPointerOverMesh(null, evt.pointerId);
        }
        for (var _i = 0, _a = scene._pointerMoveStage; _i < _a.length; _i++) {
            var step = _a[_i];
            pickResult = step.action(this._unTranslatedPointerX, this._unTranslatedPointerY, pickResult, isMeshPicked, canvas);
        }
        if (pickResult) {
            var type = evt.type === this._wheelEventName ? PointerEventTypes.POINTERWHEEL : PointerEventTypes.POINTERMOVE;
            if (scene.onPointerMove) {
                scene.onPointerMove(evt, pickResult, type);
            }
            if (scene.onPointerObservable.hasObservers()) {
                var pi = new PointerInfo(type, evt, pickResult);
                this._setRayOnPointerInfo(pi);
                scene.onPointerObservable.notifyObservers(pi, type);
            }
        }
    };
    // Pointers handling
    InputManager.prototype._setRayOnPointerInfo = function (pointerInfo) {
        var scene = this._scene;
        if (pointerInfo.pickInfo && !pointerInfo.pickInfo._pickingUnavailable) {
            if (!pointerInfo.pickInfo.ray) {
                pointerInfo.pickInfo.ray = scene.createPickingRay(pointerInfo.event.offsetX, pointerInfo.event.offsetY, Matrix.Identity(), scene.activeCamera);
            }
        }
    };
    InputManager.prototype._checkPrePointerObservable = function (pickResult, evt, type) {
        var scene = this._scene;
        var pi = new PointerInfoPre(type, evt, this._unTranslatedPointerX, this._unTranslatedPointerY);
        if (pickResult) {
            pi.ray = pickResult.ray;
        }
        scene.onPrePointerObservable.notifyObservers(pi, type);
        if (pi.skipOnPointerObservable) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Use this method to simulate a pointer move on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     */
    InputManager.prototype.simulatePointerMove = function (pickResult, pointerEventInit) {
        var evt = new PointerEvent("pointermove", pointerEventInit);
        if (this._checkPrePointerObservable(pickResult, evt, PointerEventTypes.POINTERMOVE)) {
            return;
        }
        this._processPointerMove(pickResult, evt);
    };
    /**
     * Use this method to simulate a pointer down on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     */
    InputManager.prototype.simulatePointerDown = function (pickResult, pointerEventInit) {
        var evt = new PointerEvent("pointerdown", pointerEventInit);
        if (this._checkPrePointerObservable(pickResult, evt, PointerEventTypes.POINTERDOWN)) {
            return;
        }
        this._processPointerDown(pickResult, evt);
    };
    InputManager.prototype._processPointerDown = function (pickResult, evt) {
        var _this = this;
        var scene = this._scene;
        if (pickResult && pickResult.hit && pickResult.pickedMesh) {
            this._pickedDownMesh = pickResult.pickedMesh;
            var actionManager = pickResult.pickedMesh._getActionManagerForTrigger();
            if (actionManager) {
                if (actionManager.hasPickTriggers) {
                    actionManager.processTrigger(5, ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                    switch (evt.button) {
                        case 0:
                            actionManager.processTrigger(2, ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                            break;
                        case 1:
                            actionManager.processTrigger(4, ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                            break;
                        case 2:
                            actionManager.processTrigger(3, ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                            break;
                    }
                }
                if (actionManager.hasSpecificTrigger(8)) {
                    window.setTimeout(function () {
                        var pickResult = scene.pick(_this._unTranslatedPointerX, _this._unTranslatedPointerY, function (mesh) { return (mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.actionManager && mesh.actionManager.hasSpecificTrigger(8) && mesh == _this._pickedDownMesh); }, false, scene.cameraToUseForPointers);
                        if (pickResult && pickResult.hit && pickResult.pickedMesh && actionManager) {
                            if (_this._totalPointersPressed !== 0 && Date.now() - _this._startingPointerTime > InputManager.LongPressDelay && !_this._isPointerSwiping()) {
                                _this._startingPointerTime = 0;
                                actionManager.processTrigger(8, ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                            }
                        }
                    }, InputManager.LongPressDelay);
                }
            }
        }
        else {
            for (var _i = 0, _a = scene._pointerDownStage; _i < _a.length; _i++) {
                var step = _a[_i];
                pickResult = step.action(this._unTranslatedPointerX, this._unTranslatedPointerY, pickResult, evt);
            }
        }
        if (pickResult) {
            var type = PointerEventTypes.POINTERDOWN;
            if (scene.onPointerDown) {
                scene.onPointerDown(evt, pickResult, type);
            }
            if (scene.onPointerObservable.hasObservers()) {
                var pi = new PointerInfo(type, evt, pickResult);
                this._setRayOnPointerInfo(pi);
                scene.onPointerObservable.notifyObservers(pi, type);
            }
        }
    };
    /** @hidden */
    InputManager.prototype._isPointerSwiping = function () {
        return Math.abs(this._startingPointerPosition.x - this._pointerX) > InputManager.DragMovementThreshold || Math.abs(this._startingPointerPosition.y - this._pointerY) > InputManager.DragMovementThreshold;
    };
    /**
     * Use this method to simulate a pointer up on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     * @param doubleTap indicates that the pointer up event should be considered as part of a double click (false by default)
     */
    InputManager.prototype.simulatePointerUp = function (pickResult, pointerEventInit, doubleTap) {
        var evt = new PointerEvent("pointerup", pointerEventInit);
        var clickInfo = new _ClickInfo();
        if (doubleTap) {
            clickInfo.doubleClick = true;
        }
        else {
            clickInfo.singleClick = true;
        }
        if (this._checkPrePointerObservable(pickResult, evt, PointerEventTypes.POINTERUP)) {
            return;
        }
        this._processPointerUp(pickResult, evt, clickInfo);
    };
    InputManager.prototype._processPointerUp = function (pickResult, evt, clickInfo) {
        var scene = this._scene;
        if (pickResult && pickResult && pickResult.pickedMesh) {
            this._pickedUpMesh = pickResult.pickedMesh;
            if (this._pickedDownMesh === this._pickedUpMesh) {
                if (scene.onPointerPick) {
                    scene.onPointerPick(evt, pickResult);
                }
                if (clickInfo.singleClick && !clickInfo.ignore && scene.onPointerObservable.hasObservers()) {
                    var type_1 = PointerEventTypes.POINTERPICK;
                    var pi = new PointerInfo(type_1, evt, pickResult);
                    this._setRayOnPointerInfo(pi);
                    scene.onPointerObservable.notifyObservers(pi, type_1);
                }
            }
            var actionManager = pickResult.pickedMesh._getActionManagerForTrigger();
            if (actionManager && !clickInfo.ignore) {
                actionManager.processTrigger(7, ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                if (!clickInfo.hasSwiped && clickInfo.singleClick) {
                    actionManager.processTrigger(1, ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                }
                var doubleClickActionManager = pickResult.pickedMesh._getActionManagerForTrigger(6);
                if (clickInfo.doubleClick && doubleClickActionManager) {
                    doubleClickActionManager.processTrigger(6, ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                }
            }
        }
        else {
            if (!clickInfo.ignore) {
                for (var _i = 0, _a = scene._pointerUpStage; _i < _a.length; _i++) {
                    var step = _a[_i];
                    pickResult = step.action(this._unTranslatedPointerX, this._unTranslatedPointerY, pickResult, evt);
                }
            }
        }
        if (this._pickedDownMesh && this._pickedDownMesh !== this._pickedUpMesh) {
            var pickedDownActionManager = this._pickedDownMesh._getActionManagerForTrigger(16);
            if (pickedDownActionManager) {
                pickedDownActionManager.processTrigger(16, ActionEvent.CreateNew(this._pickedDownMesh, evt));
            }
        }
        var type = 0;
        if (scene.onPointerObservable.hasObservers()) {
            if (!clickInfo.ignore && !clickInfo.hasSwiped) {
                if (clickInfo.singleClick && scene.onPointerObservable.hasSpecificMask(PointerEventTypes.POINTERTAP)) {
                    type = PointerEventTypes.POINTERTAP;
                }
                else if (clickInfo.doubleClick && scene.onPointerObservable.hasSpecificMask(PointerEventTypes.POINTERDOUBLETAP)) {
                    type = PointerEventTypes.POINTERDOUBLETAP;
                }
                if (type) {
                    var pi = new PointerInfo(type, evt, pickResult);
                    this._setRayOnPointerInfo(pi);
                    scene.onPointerObservable.notifyObservers(pi, type);
                }
            }
            if (!clickInfo.ignore) {
                type = PointerEventTypes.POINTERUP;
                var pi = new PointerInfo(type, evt, pickResult);
                this._setRayOnPointerInfo(pi);
                scene.onPointerObservable.notifyObservers(pi, type);
            }
        }
        if (scene.onPointerUp && !clickInfo.ignore) {
            scene.onPointerUp(evt, pickResult, type);
        }
    };
    /**
     * Gets a boolean indicating if the current pointer event is captured (meaning that the scene has already handled the pointer down)
     * @param pointerId defines the pointer id to use in a multi-touch scenario (0 by default)
     * @returns true if the pointer was captured
     */
    InputManager.prototype.isPointerCaptured = function (pointerId) {
        if (pointerId === void 0) { pointerId = 0; }
        return this._pointerCaptures[pointerId];
    };
    /**
     * Attach events to the canvas (To handle actionManagers triggers and raise onPointerMove, onPointerDown and onPointerUp
     * @param attachUp defines if you want to attach events to pointerup
     * @param attachDown defines if you want to attach events to pointerdown
     * @param attachMove defines if you want to attach events to pointermove
     * @param elementToAttachTo defines the target DOM element to attach to (will use the canvas by default)
     */
    InputManager.prototype.attachControl = function (attachUp, attachDown, attachMove, elementToAttachTo) {
        var _this = this;
        if (attachUp === void 0) { attachUp = true; }
        if (attachDown === void 0) { attachDown = true; }
        if (attachMove === void 0) { attachMove = true; }
        if (elementToAttachTo === void 0) { elementToAttachTo = null; }
        var scene = this._scene;
        if (!elementToAttachTo) {
            elementToAttachTo = scene.getEngine().getInputElement();
        }
        if (!elementToAttachTo) {
            return;
        }
        if (this._alreadyAttached) {
            this.detachControl();
        }
        this._alreadyAttachedTo = elementToAttachTo;
        var engine = scene.getEngine();
        this._initActionManager = function (act, clickInfo) {
            if (!_this._meshPickProceed) {
                var pickResult = scene.pick(_this._unTranslatedPointerX, _this._unTranslatedPointerY, scene.pointerDownPredicate, false, scene.cameraToUseForPointers);
                _this._currentPickResult = pickResult;
                if (pickResult) {
                    act = pickResult.hit && pickResult.pickedMesh ? pickResult.pickedMesh._getActionManagerForTrigger() : null;
                }
                _this._meshPickProceed = true;
            }
            return act;
        };
        this._delayedSimpleClick = function (btn, clickInfo, cb) {
            // double click delay is over and that no double click has been raised since, or the 2 consecutive keys pressed are different
            if ((Date.now() - _this._previousStartingPointerTime > InputManager.DoubleClickDelay && !_this._doubleClickOccured) || btn !== _this._previousButtonPressed) {
                _this._doubleClickOccured = false;
                clickInfo.singleClick = true;
                clickInfo.ignore = false;
                cb(clickInfo, _this._currentPickResult);
            }
        };
        this._initClickEvent = function (obs1, obs2, evt, cb) {
            var clickInfo = new _ClickInfo();
            _this._currentPickResult = null;
            var act = null;
            var checkPicking = obs1.hasSpecificMask(PointerEventTypes.POINTERPICK) ||
                obs2.hasSpecificMask(PointerEventTypes.POINTERPICK) ||
                obs1.hasSpecificMask(PointerEventTypes.POINTERTAP) ||
                obs2.hasSpecificMask(PointerEventTypes.POINTERTAP) ||
                obs1.hasSpecificMask(PointerEventTypes.POINTERDOUBLETAP) ||
                obs2.hasSpecificMask(PointerEventTypes.POINTERDOUBLETAP);
            if (!checkPicking && AbstractActionManager) {
                act = _this._initActionManager(act, clickInfo);
                if (act) {
                    checkPicking = act.hasPickTriggers;
                }
            }
            var needToIgnoreNext = false;
            if (checkPicking) {
                var btn = evt.button;
                clickInfo.hasSwiped = _this._isPointerSwiping();
                if (!clickInfo.hasSwiped) {
                    var checkSingleClickImmediately = !InputManager.ExclusiveDoubleClickMode;
                    if (!checkSingleClickImmediately) {
                        checkSingleClickImmediately = !obs1.hasSpecificMask(PointerEventTypes.POINTERDOUBLETAP) && !obs2.hasSpecificMask(PointerEventTypes.POINTERDOUBLETAP);
                        if (checkSingleClickImmediately && !AbstractActionManager.HasSpecificTrigger(6)) {
                            act = _this._initActionManager(act, clickInfo);
                            if (act) {
                                checkSingleClickImmediately = !act.hasSpecificTrigger(6);
                            }
                        }
                    }
                    if (checkSingleClickImmediately) {
                        // single click detected if double click delay is over or two different successive keys pressed without exclusive double click or no double click required
                        if (Date.now() - _this._previousStartingPointerTime > InputManager.DoubleClickDelay || btn !== _this._previousButtonPressed) {
                            clickInfo.singleClick = true;
                            cb(clickInfo, _this._currentPickResult);
                            needToIgnoreNext = true;
                        }
                    }
                    // at least one double click is required to be check and exclusive double click is enabled
                    else {
                        // wait that no double click has been raised during the double click delay
                        _this._previousDelayedSimpleClickTimeout = _this._delayedSimpleClickTimeout;
                        _this._delayedSimpleClickTimeout = window.setTimeout(_this._delayedSimpleClick.bind(_this, btn, clickInfo, cb), InputManager.DoubleClickDelay);
                    }
                    var checkDoubleClick = obs1.hasSpecificMask(PointerEventTypes.POINTERDOUBLETAP) || obs2.hasSpecificMask(PointerEventTypes.POINTERDOUBLETAP);
                    if (!checkDoubleClick && AbstractActionManager.HasSpecificTrigger(6)) {
                        act = _this._initActionManager(act, clickInfo);
                        if (act) {
                            checkDoubleClick = act.hasSpecificTrigger(6);
                        }
                    }
                    if (checkDoubleClick) {
                        // two successive keys pressed are equal, double click delay is not over and double click has not just occurred
                        if (btn === _this._previousButtonPressed && Date.now() - _this._previousStartingPointerTime < InputManager.DoubleClickDelay && !_this._doubleClickOccured) {
                            // pointer has not moved for 2 clicks, it's a double click
                            if (!clickInfo.hasSwiped && !_this._isPointerSwiping()) {
                                _this._previousStartingPointerTime = 0;
                                _this._doubleClickOccured = true;
                                clickInfo.doubleClick = true;
                                clickInfo.ignore = false;
                                if (InputManager.ExclusiveDoubleClickMode && _this._previousDelayedSimpleClickTimeout) {
                                    clearTimeout(_this._previousDelayedSimpleClickTimeout);
                                }
                                _this._previousDelayedSimpleClickTimeout = _this._delayedSimpleClickTimeout;
                                cb(clickInfo, _this._currentPickResult);
                            }
                            // if the two successive clicks are too far, it's just two simple clicks
                            else {
                                _this._doubleClickOccured = false;
                                _this._previousStartingPointerTime = _this._startingPointerTime;
                                _this._previousStartingPointerPosition.x = _this._startingPointerPosition.x;
                                _this._previousStartingPointerPosition.y = _this._startingPointerPosition.y;
                                _this._previousButtonPressed = btn;
                                if (InputManager.ExclusiveDoubleClickMode) {
                                    if (_this._previousDelayedSimpleClickTimeout) {
                                        clearTimeout(_this._previousDelayedSimpleClickTimeout);
                                    }
                                    _this._previousDelayedSimpleClickTimeout = _this._delayedSimpleClickTimeout;
                                    cb(clickInfo, _this._previousPickResult);
                                }
                                else {
                                    cb(clickInfo, _this._currentPickResult);
                                }
                            }
                            needToIgnoreNext = true;
                        }
                        // just the first click of the double has been raised
                        else {
                            _this._doubleClickOccured = false;
                            _this._previousStartingPointerTime = _this._startingPointerTime;
                            _this._previousStartingPointerPosition.x = _this._startingPointerPosition.x;
                            _this._previousStartingPointerPosition.y = _this._startingPointerPosition.y;
                            _this._previousButtonPressed = btn;
                        }
                    }
                }
            }
            if (!needToIgnoreNext) {
                cb(clickInfo, _this._currentPickResult);
            }
        };
        this._onPointerMove = function (evt) {
            // preserve compatibility with Safari when pointerId is not present
            if (evt.pointerId === undefined) {
                evt.pointerId = 0;
            }
            _this._updatePointerPosition(evt);
            // PreObservable support
            if (_this._checkPrePointerObservable(null, evt, evt.type === _this._wheelEventName ? PointerEventTypes.POINTERWHEEL : PointerEventTypes.POINTERMOVE)) {
                return;
            }
            if (!scene.cameraToUseForPointers && !scene.activeCamera) {
                return;
            }
            if (!scene.pointerMovePredicate) {
                scene.pointerMovePredicate = function (mesh) {
                    return mesh.isPickable &&
                        mesh.isVisible &&
                        mesh.isReady() &&
                        mesh.isEnabled() &&
                        (mesh.enablePointerMoveEvents || scene.constantlyUpdateMeshUnderPointer || mesh._getActionManagerForTrigger() != null) &&
                        (!scene.cameraToUseForPointers || (scene.cameraToUseForPointers.layerMask & mesh.layerMask) !== 0);
                };
            }
            // Meshes
            var pickResult = scene.pick(_this._unTranslatedPointerX, _this._unTranslatedPointerY, scene.pointerMovePredicate, false, scene.cameraToUseForPointers);
            _this._processPointerMove(pickResult, evt);
        };
        this._onPointerDown = function (evt) {
            _this._totalPointersPressed++;
            _this._pickedDownMesh = null;
            _this._meshPickProceed = false;
            // preserve compatibility with Safari when pointerId is not present
            if (evt.pointerId === undefined) {
                evt.pointerId = 0;
            }
            _this._updatePointerPosition(evt);
            if (scene.preventDefaultOnPointerDown && elementToAttachTo) {
                evt.preventDefault();
                elementToAttachTo.focus();
            }
            _this._startingPointerPosition.x = _this._pointerX;
            _this._startingPointerPosition.y = _this._pointerY;
            _this._startingPointerTime = Date.now();
            // PreObservable support
            if (_this._checkPrePointerObservable(null, evt, PointerEventTypes.POINTERDOWN)) {
                return;
            }
            if (!scene.cameraToUseForPointers && !scene.activeCamera) {
                return;
            }
            _this._pointerCaptures[evt.pointerId] = true;
            if (!scene.pointerDownPredicate) {
                scene.pointerDownPredicate = function (mesh) {
                    return mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.isEnabled() && (!scene.cameraToUseForPointers || (scene.cameraToUseForPointers.layerMask & mesh.layerMask) !== 0);
                };
            }
            // Meshes
            _this._pickedDownMesh = null;
            var pickResult = scene.pick(_this._unTranslatedPointerX, _this._unTranslatedPointerY, scene.pointerDownPredicate, false, scene.cameraToUseForPointers);
            _this._processPointerDown(pickResult, evt);
        };
        this._onPointerUp = function (evt) {
            if (_this._totalPointersPressed === 0) {
                // We are attaching the pointer up to windows because of a bug in FF
                return; // So we need to test it the pointer down was pressed before.
            }
            _this._totalPointersPressed--;
            _this._pickedUpMesh = null;
            _this._meshPickProceed = false;
            // preserve compatibility with Safari when pointerId is not present
            if (evt.pointerId === undefined) {
                evt.pointerId = 0;
            }
            _this._updatePointerPosition(evt);
            if (scene.preventDefaultOnPointerUp && elementToAttachTo) {
                evt.preventDefault();
                elementToAttachTo.focus();
            }
            _this._initClickEvent(scene.onPrePointerObservable, scene.onPointerObservable, evt, function (clickInfo, pickResult) {
                // PreObservable support
                if (scene.onPrePointerObservable.hasObservers()) {
                    if (!clickInfo.ignore) {
                        if (!clickInfo.hasSwiped) {
                            if (clickInfo.singleClick && scene.onPrePointerObservable.hasSpecificMask(PointerEventTypes.POINTERTAP)) {
                                if (_this._checkPrePointerObservable(null, evt, PointerEventTypes.POINTERTAP)) {
                                    return;
                                }
                            }
                            if (clickInfo.doubleClick && scene.onPrePointerObservable.hasSpecificMask(PointerEventTypes.POINTERDOUBLETAP)) {
                                if (_this._checkPrePointerObservable(null, evt, PointerEventTypes.POINTERDOUBLETAP)) {
                                    return;
                                }
                            }
                        }
                        if (_this._checkPrePointerObservable(null, evt, PointerEventTypes.POINTERUP)) {
                            return;
                        }
                    }
                }
                if (!_this._pointerCaptures[evt.pointerId]) {
                    return;
                }
                _this._pointerCaptures[evt.pointerId] = false;
                if (!scene.cameraToUseForPointers && !scene.activeCamera) {
                    return;
                }
                if (!scene.pointerUpPredicate) {
                    scene.pointerUpPredicate = function (mesh) {
                        return mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.isEnabled() && (!scene.cameraToUseForPointers || (scene.cameraToUseForPointers.layerMask & mesh.layerMask) !== 0);
                    };
                }
                // Meshes
                if (!_this._meshPickProceed && ((AbstractActionManager && AbstractActionManager.HasTriggers) || scene.onPointerObservable.hasObservers())) {
                    _this._initActionManager(null, clickInfo);
                }
                if (!pickResult) {
                    pickResult = _this._currentPickResult;
                }
                _this._processPointerUp(pickResult, evt, clickInfo);
                _this._previousPickResult = _this._currentPickResult;
            });
        };
        this._onKeyDown = function (evt) {
            var type = KeyboardEventTypes.KEYDOWN;
            if (scene.onPreKeyboardObservable.hasObservers()) {
                var pi = new KeyboardInfoPre(type, evt);
                scene.onPreKeyboardObservable.notifyObservers(pi, type);
                if (pi.skipOnPointerObservable) {
                    return;
                }
            }
            if (scene.onKeyboardObservable.hasObservers()) {
                var pi = new KeyboardInfo(type, evt);
                scene.onKeyboardObservable.notifyObservers(pi, type);
            }
            if (scene.actionManager) {
                scene.actionManager.processTrigger(14, ActionEvent.CreateNewFromScene(scene, evt));
            }
        };
        this._onKeyUp = function (evt) {
            var type = KeyboardEventTypes.KEYUP;
            if (scene.onPreKeyboardObservable.hasObservers()) {
                var pi = new KeyboardInfoPre(type, evt);
                scene.onPreKeyboardObservable.notifyObservers(pi, type);
                if (pi.skipOnPointerObservable) {
                    return;
                }
            }
            if (scene.onKeyboardObservable.hasObservers()) {
                var pi = new KeyboardInfo(type, evt);
                scene.onKeyboardObservable.notifyObservers(pi, type);
            }
            if (scene.actionManager) {
                scene.actionManager.processTrigger(15, ActionEvent.CreateNewFromScene(scene, evt));
            }
        };
        var attachedFunction = function () {
            if (!elementToAttachTo || _this._keyboardIsAttached) {
                return;
            }
            elementToAttachTo.addEventListener("keydown", _this._onKeyDown, false);
            elementToAttachTo.addEventListener("keyup", _this._onKeyUp, false);
            _this._keyboardIsAttached = true;
        };
        // Keyboard events
        this._onCanvasFocusObserver = engine.onCanvasFocusObservable.add((function () {
            if (document.activeElement === elementToAttachTo) {
                attachedFunction();
            }
            return attachedFunction;
        })());
        this._onCanvasBlurObserver = engine.onCanvasBlurObservable.add(function () {
            if (!elementToAttachTo) {
                return;
            }
            elementToAttachTo.removeEventListener("keydown", _this._onKeyDown);
            elementToAttachTo.removeEventListener("keyup", _this._onKeyUp);
            _this._keyboardIsAttached = false;
        });
        attachedFunction();
        // Pointer events
        var eventPrefix = Tools.GetPointerPrefix(engine);
        if (attachMove) {
            elementToAttachTo.addEventListener(eventPrefix + "move", this._onPointerMove, false);
            // Wheel
            this._wheelEventName =
                "onwheel" in document.createElement("div")
                    ? "wheel" // Modern browsers support "wheel"
                    : document.onmousewheel !== undefined
                        ? "mousewheel" // Webkit and IE support at least "mousewheel"
                        : "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
            elementToAttachTo.addEventListener(this._wheelEventName, this._onPointerMove, false);
        }
        if (attachDown) {
            elementToAttachTo.addEventListener(eventPrefix + "down", this._onPointerDown, false);
        }
        if (attachUp) {
            var hostWindow = scene.getEngine().getHostWindow();
            if (hostWindow) {
                hostWindow.addEventListener(eventPrefix + "up", this._onPointerUp, false);
            }
        }
        this._alreadyAttached = true;
    };
    /**
     * Detaches all event handlers
     */
    InputManager.prototype.detachControl = function () {
        var engine = this._scene.getEngine();
        var eventPrefix = Tools.GetPointerPrefix(engine);
        if (!this._alreadyAttachedTo) {
            return;
        }
        if (!this._alreadyAttached) {
            return;
        }
        // Pointer
        this._alreadyAttachedTo.removeEventListener(eventPrefix + "move", this._onPointerMove);
        this._alreadyAttachedTo.removeEventListener(this._wheelEventName, this._onPointerMove);
        this._alreadyAttachedTo.removeEventListener(eventPrefix + "down", this._onPointerDown);
        window.removeEventListener(eventPrefix + "up", this._onPointerUp);
        // Blur / Focus
        if (this._onCanvasBlurObserver) {
            engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
        }
        if (this._onCanvasFocusObserver) {
            engine.onCanvasFocusObservable.remove(this._onCanvasFocusObserver);
        }
        // Keyboard
        this._alreadyAttachedTo.removeEventListener("keydown", this._onKeyDown);
        this._alreadyAttachedTo.removeEventListener("keyup", this._onKeyUp);
        // Cursor
        if (!this._scene.doNotHandleCursors) {
            this._alreadyAttachedTo.style.cursor = this._scene.defaultCursor;
        }
        this._alreadyAttached = false;
    };
    /**
     * Force the value of meshUnderPointer
     * @param mesh defines the mesh to use
     * @param pointerId optional pointer id when using more than one pointer. Defaults to 0
     */
    InputManager.prototype.setPointerOverMesh = function (mesh, pointerId) {
        if (pointerId === void 0) { pointerId = 0; }
        // Sanity check
        if (pointerId < 0) {
            pointerId = 0;
        }
        if (this._meshUnderPointerId[pointerId] === mesh) {
            return;
        }
        var underPointerMesh = this._meshUnderPointerId[pointerId];
        var actionManager;
        if (underPointerMesh) {
            actionManager = underPointerMesh._getActionManagerForTrigger(10);
            if (actionManager) {
                actionManager.processTrigger(10, ActionEvent.CreateNew(underPointerMesh, undefined, { pointerId: pointerId }));
            }
        }
        this._meshUnderPointerId[pointerId] = mesh;
        this._pointerOverMesh = mesh;
        underPointerMesh = this._meshUnderPointerId[pointerId];
        if (underPointerMesh) {
            actionManager = underPointerMesh._getActionManagerForTrigger(9);
            if (actionManager) {
                actionManager.processTrigger(9, ActionEvent.CreateNew(underPointerMesh, undefined, { pointerId: pointerId }));
            }
        }
    };
    /**
     * Gets the mesh under the pointer
     * @returns a Mesh or null if no mesh is under the pointer
     */
    InputManager.prototype.getPointerOverMesh = function () {
        return this._pointerOverMesh;
    };
    /** The distance in pixel that you have to move to prevent some events */
    InputManager.DragMovementThreshold = 10; // in pixels
    /** Time in milliseconds to wait to raise long press events if button is still pressed */
    InputManager.LongPressDelay = 500; // in milliseconds
    /** Time in milliseconds with two consecutive clicks will be considered as a double click */
    InputManager.DoubleClickDelay = 300; // in milliseconds
    /** If you need to check double click without raising a single click at first click, enable this flag */
    InputManager.ExclusiveDoubleClickMode = false;
    return InputManager;
}());

/**
 * Helper class used to generate session unique ID
 */
var UniqueIdGenerator = /** @class */ (function () {
    function UniqueIdGenerator() {
    }
    Object.defineProperty(UniqueIdGenerator, "UniqueId", {
        /**
         * Gets an unique (relatively to the current scene) Id
         */
        get: function () {
            var result = this._UniqueIdCounter;
            this._UniqueIdCounter++;
            return result;
        },
        enumerable: false,
        configurable: true
    });
    // Statics
    UniqueIdGenerator._UniqueIdCounter = 0;
    return UniqueIdGenerator;
}());

/**
 * Represents a scene to be rendered by the engine.
 * @see https://doc.babylonjs.com/features/scene
 */
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    /**
     * Creates a new Scene
     * @param engine defines the engine to use to render this scene
     * @param options defines the scene options
     */
    function Scene(engine, options) {
        var _this = _super.call(this) || this;
        // Members
        /** @hidden */
        _this._inputManager = new InputManager(_this);
        /** Define this parameter if you are using multiple cameras and you want to specify which one should be used for pointer position */
        _this.cameraToUseForPointers = null;
        /** @hidden */
        _this._isScene = true;
        /** @hidden */
        _this._blockEntityCollection = false;
        /**
         * Gets or sets a boolean that indicates if the scene must clear the render buffer before rendering a frame
         */
        _this.autoClear = true;
        /**
         * Gets or sets a boolean that indicates if the scene must clear the depth and stencil buffers before rendering a frame
         */
        _this.autoClearDepthAndStencil = true;
        /**
         * Defines the color used to clear the render buffer (Default is (0.2, 0.2, 0.3, 1.0))
         */
        _this.clearColor = new Color4(0.2, 0.2, 0.3, 1.0);
        /**
         * Defines the color used to simulate the ambient color (Default is (0, 0, 0))
         */
        _this.ambientColor = new Color3(0, 0, 0);
        /** @hidden */
        _this._environmentIntensity = 1;
        _this._forceWireframe = false;
        _this._skipFrustumClipping = false;
        _this._forcePointsCloud = false;
        /**
         * Gets or sets a boolean indicating if animations are enabled
         */
        _this.animationsEnabled = true;
        _this._animationPropertiesOverride = null;
        /**
         * Gets or sets a boolean indicating if a constant deltatime has to be used
         * This is mostly useful for testing purposes when you do not want the animations to scale with the framerate
         */
        _this.useConstantAnimationDeltaTime = false;
        /**
         * Gets or sets a boolean indicating if the scene must keep the meshUnderPointer property updated
         * Please note that it requires to run a ray cast through the scene on every frame
         */
        _this.constantlyUpdateMeshUnderPointer = false;
        /**
         * Defines the HTML cursor to use when hovering over interactive elements
         */
        _this.hoverCursor = "pointer";
        /**
         * Defines the HTML default cursor to use (empty by default)
         */
        _this.defaultCursor = "";
        /**
         * Defines whether cursors are handled by the scene.
         */
        _this.doNotHandleCursors = false;
        /**
         * This is used to call preventDefault() on pointer down
         * in order to block unwanted artifacts like system double clicks
         */
        _this.preventDefaultOnPointerDown = true;
        /**
         * This is used to call preventDefault() on pointer up
         * in order to block unwanted artifacts like system double clicks
         */
        _this.preventDefaultOnPointerUp = true;
        // Metadata
        /**
         * Gets or sets user defined metadata
         */
        _this.metadata = null;
        /**
         * For internal use only. Please do not use.
         */
        _this.reservedDataStore = null;
        /**
         * Use this array to add regular expressions used to disable offline support for specific urls
         */
        _this.disableOfflineSupportExceptionRules = new Array();
        /**
        * An event triggered when the scene is disposed.
        */
        _this.onDisposeObservable = new Observable();
        _this._onDisposeObserver = null;
        /**
        * An event triggered before rendering the scene (right after animations and physics)
        */
        _this.onBeforeRenderObservable = new Observable();
        _this._onBeforeRenderObserver = null;
        /**
        * An event triggered after rendering the scene
        */
        _this.onAfterRenderObservable = new Observable();
        /**
        * An event triggered after rendering the scene for an active camera (When scene.render is called this will be called after each camera)
        */
        _this.onAfterRenderCameraObservable = new Observable();
        _this._onAfterRenderObserver = null;
        /**
        * An event triggered before animating the scene
        */
        _this.onBeforeAnimationsObservable = new Observable();
        /**
        * An event triggered after animations processing
        */
        _this.onAfterAnimationsObservable = new Observable();
        /**
        * An event triggered before draw calls are ready to be sent
        */
        _this.onBeforeDrawPhaseObservable = new Observable();
        /**
        * An event triggered after draw calls have been sent
        */
        _this.onAfterDrawPhaseObservable = new Observable();
        /**
        * An event triggered when the scene is ready
        */
        _this.onReadyObservable = new Observable();
        /**
        * An event triggered before rendering a camera
        */
        _this.onBeforeCameraRenderObservable = new Observable();
        _this._onBeforeCameraRenderObserver = null;
        /**
        * An event triggered after rendering a camera
        */
        _this.onAfterCameraRenderObservable = new Observable();
        _this._onAfterCameraRenderObserver = null;
        /**
        * An event triggered when active meshes evaluation is about to start
        */
        _this.onBeforeActiveMeshesEvaluationObservable = new Observable();
        /**
        * An event triggered when active meshes evaluation is done
        */
        _this.onAfterActiveMeshesEvaluationObservable = new Observable();
        /**
        * An event triggered when particles rendering is about to start
        * Note: This event can be trigger more than once per frame (because particles can be rendered by render target textures as well)
        */
        _this.onBeforeParticlesRenderingObservable = new Observable();
        /**
        * An event triggered when particles rendering is done
        * Note: This event can be trigger more than once per frame (because particles can be rendered by render target textures as well)
        */
        _this.onAfterParticlesRenderingObservable = new Observable();
        /**
        * An event triggered when SceneLoader.Append or SceneLoader.Load or SceneLoader.ImportMesh were successfully executed
        */
        _this.onDataLoadedObservable = new Observable();
        /**
        * An event triggered when a camera is created
        */
        _this.onNewCameraAddedObservable = new Observable();
        /**
        * An event triggered when a camera is removed
        */
        _this.onCameraRemovedObservable = new Observable();
        /**
        * An event triggered when a light is created
        */
        _this.onNewLightAddedObservable = new Observable();
        /**
        * An event triggered when a light is removed
        */
        _this.onLightRemovedObservable = new Observable();
        /**
        * An event triggered when a geometry is created
        */
        _this.onNewGeometryAddedObservable = new Observable();
        /**
        * An event triggered when a geometry is removed
        */
        _this.onGeometryRemovedObservable = new Observable();
        /**
        * An event triggered when a transform node is created
        */
        _this.onNewTransformNodeAddedObservable = new Observable();
        /**
        * An event triggered when a transform node is removed
        */
        _this.onTransformNodeRemovedObservable = new Observable();
        /**
        * An event triggered when a mesh is created
        */
        _this.onNewMeshAddedObservable = new Observable();
        /**
        * An event triggered when a mesh is removed
        */
        _this.onMeshRemovedObservable = new Observable();
        /**
         * An event triggered when a skeleton is created
         */
        _this.onNewSkeletonAddedObservable = new Observable();
        /**
        * An event triggered when a skeleton is removed
        */
        _this.onSkeletonRemovedObservable = new Observable();
        /**
        * An event triggered when a material is created
        */
        _this.onNewMaterialAddedObservable = new Observable();
        /**
        * An event triggered when a multi material is created
        */
        _this.onNewMultiMaterialAddedObservable = new Observable();
        /**
        * An event triggered when a material is removed
        */
        _this.onMaterialRemovedObservable = new Observable();
        /**
        * An event triggered when a multi material is removed
        */
        _this.onMultiMaterialRemovedObservable = new Observable();
        /**
        * An event triggered when a texture is created
        */
        _this.onNewTextureAddedObservable = new Observable();
        /**
        * An event triggered when a texture is removed
        */
        _this.onTextureRemovedObservable = new Observable();
        /**
        * An event triggered when render targets are about to be rendered
        * Can happen multiple times per frame.
        */
        _this.onBeforeRenderTargetsRenderObservable = new Observable();
        /**
        * An event triggered when render targets were rendered.
        * Can happen multiple times per frame.
        */
        _this.onAfterRenderTargetsRenderObservable = new Observable();
        /**
        * An event triggered before calculating deterministic simulation step
        */
        _this.onBeforeStepObservable = new Observable();
        /**
        * An event triggered after calculating deterministic simulation step
        */
        _this.onAfterStepObservable = new Observable();
        /**
         * An event triggered when the activeCamera property is updated
         */
        _this.onActiveCameraChanged = new Observable();
        /**
         * This Observable will be triggered before rendering each renderingGroup of each rendered camera.
         * The RenderinGroupInfo class contains all the information about the context in which the observable is called
         * If you wish to register an Observer only for a given set of renderingGroup, use the mask with a combination of the renderingGroup index elevated to the power of two (1 for renderingGroup 0, 2 for renderingrOup1, 4 for 2 and 8 for 3)
         */
        _this.onBeforeRenderingGroupObservable = new Observable();
        /**
         * This Observable will be triggered after rendering each renderingGroup of each rendered camera.
         * The RenderinGroupInfo class contains all the information about the context in which the observable is called
         * If you wish to register an Observer only for a given set of renderingGroup, use the mask with a combination of the renderingGroup index elevated to the power of two (1 for renderingGroup 0, 2 for renderingrOup1, 4 for 2 and 8 for 3)
         */
        _this.onAfterRenderingGroupObservable = new Observable();
        /**
         * This Observable will when a mesh has been imported into the scene.
         */
        _this.onMeshImportedObservable = new Observable();
        /**
         * This Observable will when an animation file has been imported into the scene.
         */
        _this.onAnimationFileImportedObservable = new Observable();
        // Animations
        /** @hidden */
        _this._registeredForLateAnimationBindings = new SmartArrayNoDuplicate(256);
        /**
         * This observable event is triggered when any ponter event is triggered. It is registered during Scene.attachControl() and it is called BEFORE the 3D engine process anything (mesh/sprite picking for instance).
         * You have the possibility to skip the process and the call to onPointerObservable by setting PointerInfoPre.skipOnPointerObservable to true
         */
        _this.onPrePointerObservable = new Observable();
        /**
         * Observable event triggered each time an input event is received from the rendering canvas
         */
        _this.onPointerObservable = new Observable();
        // Keyboard
        /**
         * This observable event is triggered when any keyboard event si raised and registered during Scene.attachControl()
         * You have the possibility to skip the process and the call to onKeyboardObservable by setting KeyboardInfoPre.skipOnPointerObservable to true
         */
        _this.onPreKeyboardObservable = new Observable();
        /**
         * Observable event triggered each time an keyboard event is received from the hosting window
         */
        _this.onKeyboardObservable = new Observable();
        // Coordinates system
        _this._useRightHandedSystem = false;
        // Deterministic lockstep
        _this._timeAccumulator = 0;
        _this._currentStepId = 0;
        _this._currentInternalStep = 0;
        // Fog
        _this._fogEnabled = true;
        _this._fogMode = Scene.FOGMODE_NONE;
        /**
        * Gets or sets the fog color to use
        * @see https://doc.babylonjs.com/babylon101/environment#fog
        * (Default is Color3(0.2, 0.2, 0.3))
        */
        _this.fogColor = new Color3(0.2, 0.2, 0.3);
        /**
        * Gets or sets the fog density to use
        * @see https://doc.babylonjs.com/babylon101/environment#fog
        * (Default is 0.1)
        */
        _this.fogDensity = 0.1;
        /**
        * Gets or sets the fog start distance to use
        * @see https://doc.babylonjs.com/babylon101/environment#fog
        * (Default is 0)
        */
        _this.fogStart = 0;
        /**
        * Gets or sets the fog end distance to use
        * @see https://doc.babylonjs.com/babylon101/environment#fog
        * (Default is 1000)
        */
        _this.fogEnd = 1000.0;
        /**
        * Flag indicating that the frame buffer binding is handled by another component
        */
        _this.prePass = false;
        // Lights
        _this._shadowsEnabled = true;
        _this._lightsEnabled = true;
        /** All of the active cameras added to this scene. */
        _this.activeCameras = new Array();
        // Textures
        _this._texturesEnabled = true;
        // Physics
        /**
         * Gets or sets a boolean indicating if physic engines are enabled on this scene
         */
        _this.physicsEnabled = true;
        // Particles
        /**
        * Gets or sets a boolean indicating if particles are enabled on this scene
        */
        _this.particlesEnabled = true;
        // Sprites
        /**
        * Gets or sets a boolean indicating if sprites are enabled on this scene
        */
        _this.spritesEnabled = true;
        // Skeletons
        _this._skeletonsEnabled = true;
        // Lens flares
        /**
        * Gets or sets a boolean indicating if lens flares are enabled on this scene
        */
        _this.lensFlaresEnabled = true;
        // Collisions
        /**
        * Gets or sets a boolean indicating if collisions are enabled on this scene
        * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
        */
        _this.collisionsEnabled = true;
        /**
         * Defines the gravity applied to this scene (used only for collisions)
         * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
         */
        _this.gravity = new Vector3(0, -9.807, 0);
        // Postprocesses
        /**
        * Gets or sets a boolean indicating if postprocesses are enabled on this scene
        */
        _this.postProcessesEnabled = true;
        // Customs render targets
        /**
        * Gets or sets a boolean indicating if render targets are enabled on this scene
        */
        _this.renderTargetsEnabled = true;
        /**
        * Gets or sets a boolean indicating if next render targets must be dumped as image for debugging purposes
        * We recommend not using it and instead rely on Spector.js: http://spector.babylonjs.com
        */
        _this.dumpNextRenderTargets = false;
        /**
         * The list of user defined render targets added to the scene
         */
        _this.customRenderTargets = new Array();
        /**
         * Gets the list of meshes imported to the scene through SceneLoader
         */
        _this.importedMeshesFiles = new Array();
        // Probes
        /**
        * Gets or sets a boolean indicating if probes are enabled on this scene
        */
        _this.probesEnabled = true;
        _this._meshesForIntersections = new SmartArrayNoDuplicate(256);
        // Procedural textures
        /**
        * Gets or sets a boolean indicating if procedural textures are enabled on this scene
        */
        _this.proceduralTexturesEnabled = true;
        // Performance counters
        _this._totalVertices = new PerfCounter();
        /** @hidden */
        _this._activeIndices = new PerfCounter();
        /** @hidden */
        _this._activeParticles = new PerfCounter();
        /** @hidden */
        _this._activeBones = new PerfCounter();
        /** @hidden */
        _this._animationTime = 0;
        /**
         * Gets or sets a general scale for animation speed
         * @see https://www.babylonjs-playground.com/#IBU2W7#3
         */
        _this.animationTimeScale = 1;
        _this._renderId = 0;
        _this._frameId = 0;
        _this._executeWhenReadyTimeoutId = -1;
        _this._intermediateRendering = false;
        _this._viewUpdateFlag = -1;
        _this._projectionUpdateFlag = -1;
        /** @hidden */
        _this._toBeDisposed = new Array(256);
        _this._activeRequests = new Array();
        /** @hidden */
        _this._pendingData = new Array();
        _this._isDisposed = false;
        /**
         * Gets or sets a boolean indicating that all submeshes of active meshes must be rendered
         * Use this boolean to avoid computing frustum clipping on submeshes (This could help when you are CPU bound)
         */
        _this.dispatchAllSubMeshesOfActiveMeshes = false;
        _this._activeMeshes = new SmartArray(256);
        _this._processedMaterials = new SmartArray(256);
        _this._renderTargets = new SmartArrayNoDuplicate(256);
        /** @hidden */
        _this._activeParticleSystems = new SmartArray(256);
        _this._activeSkeletons = new SmartArrayNoDuplicate(32);
        _this._softwareSkinnedMeshes = new SmartArrayNoDuplicate(32);
        /** @hidden */
        _this._activeAnimatables = new Array();
        _this._transformMatrix = Matrix.Zero();
        /**
         * Gets or sets a boolean indicating if lights must be sorted by priority (off by default)
         * This is useful if there are more lights that the maximum simulteanous authorized
         */
        _this.requireLightSorting = false;
        /**
         * @hidden
         * Backing store of defined scene components.
         */
        _this._components = [];
        /**
         * @hidden
         * Backing store of defined scene components.
         */
        _this._serializableComponents = [];
        /**
         * List of components to register on the next registration step.
         */
        _this._transientComponents = [];
        /**
         * @hidden
         * Defines the actions happening before camera updates.
         */
        _this._beforeCameraUpdateStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening before clear the canvas.
         */
        _this._beforeClearStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions when collecting render targets for the frame.
         */
        _this._gatherRenderTargetsStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening for one camera in the frame.
         */
        _this._gatherActiveCameraRenderTargetsStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening during the per mesh ready checks.
         */
        _this._isReadyForMeshStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening before evaluate active mesh checks.
         */
        _this._beforeEvaluateActiveMeshStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening during the evaluate sub mesh checks.
         */
        _this._evaluateSubMeshStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening during the active mesh stage.
         */
        _this._preActiveMeshStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening during the per camera render target step.
         */
        _this._cameraDrawRenderTargetStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening just before the active camera is drawing.
         */
        _this._beforeCameraDrawStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening just before a render target is drawing.
         */
        _this._beforeRenderTargetDrawStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening just before a rendering group is drawing.
         */
        _this._beforeRenderingGroupDrawStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening just before a mesh is drawing.
         */
        _this._beforeRenderingMeshStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening just after a mesh has been drawn.
         */
        _this._afterRenderingMeshStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening just after a rendering group has been drawn.
         */
        _this._afterRenderingGroupDrawStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening just after the active camera has been drawn.
         */
        _this._afterCameraDrawStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening just after a render target has been drawn.
         */
        _this._afterRenderTargetDrawStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening just after rendering all cameras and computing intersections.
         */
        _this._afterRenderStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening when a pointer move event happens.
         */
        _this._pointerMoveStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening when a pointer down event happens.
         */
        _this._pointerDownStage = Stage.Create();
        /**
         * @hidden
         * Defines the actions happening when a pointer up event happens.
         */
        _this._pointerUpStage = Stage.Create();
        /**
         * an optional map from Geometry Id to Geometry index in the 'geometries' array
         */
        _this.geometriesByUniqueId = null;
        _this._defaultMeshCandidates = {
            data: [],
            length: 0
        };
        _this._defaultSubMeshCandidates = {
            data: [],
            length: 0
        };
        _this._preventFreeActiveMeshesAndRenderingGroups = false;
        /** @hidden */
        _this._activeMeshesFrozen = false;
        _this._skipEvaluateActiveMeshesCompletely = false;
        /** @hidden */
        _this._allowPostProcessClearColor = true;
        /**
         * User updatable function that will return a deterministic frame time when engine is in deterministic lock step mode
         */
        _this.getDeterministicFrameTime = function () {
            return _this._engine.getTimeStep();
        };
        _this._blockMaterialDirtyMechanism = false;
        var fullOptions = __assign({ useGeometryUniqueIdsMap: true, useMaterialMeshMap: true, useClonedMeshMap: true, virtual: false }, options);
        _this._engine = engine || EngineStore.LastCreatedEngine;
        if (!fullOptions.virtual) {
            EngineStore._LastCreatedScene = _this;
            _this._engine.scenes.push(_this);
        }
        _this._uid = null;
        _this._renderingManager = new RenderingManager(_this);
        if (PostProcessManager) {
            _this.postProcessManager = new PostProcessManager(_this);
        }
        if (DomManagement.IsWindowObjectExist()) {
            _this.attachControl();
        }
        // Uniform Buffer
        _this._createUbo();
        // Default Image processing definition
        if (ImageProcessingConfiguration) {
            _this._imageProcessingConfiguration = new ImageProcessingConfiguration();
        }
        _this.setDefaultCandidateProviders();
        if (fullOptions.useGeometryUniqueIdsMap) {
            _this.geometriesByUniqueId = {};
        }
        _this.useMaterialMeshMap = fullOptions.useMaterialMeshMap;
        _this.useClonedMeshMap = fullOptions.useClonedMeshMap;
        if (!options || !options.virtual) {
            _this._engine.onNewSceneAddedObservable.notifyObservers(_this);
        }
        return _this;
    }
    /**
     * Factory used to create the default material.
     * @param name The name of the material to create
     * @param scene The scene to create the material for
     * @returns The default material
     */
    Scene.DefaultMaterialFactory = function (scene) {
        throw _DevTools.WarnImport("StandardMaterial");
    };
    /**
     * Factory used to create the a collision coordinator.
     * @returns The collision coordinator
     */
    Scene.CollisionCoordinatorFactory = function () {
        throw _DevTools.WarnImport("DefaultCollisionCoordinator");
    };
    Object.defineProperty(Scene.prototype, "environmentTexture", {
        /**
         * Texture used in all pbr material as the reflection texture.
         * As in the majority of the scene they are the same (exception for multi room and so on),
         * this is easier to reference from here than from all the materials.
         */
        get: function () {
            return this._environmentTexture;
        },
        /**
         * Texture used in all pbr material as the reflection texture.
         * As in the majority of the scene they are the same (exception for multi room and so on),
         * this is easier to set here than in all the materials.
         */
        set: function (value) {
            if (this._environmentTexture === value) {
                return;
            }
            this._environmentTexture = value;
            this.markAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "environmentIntensity", {
        /**
         * Intensity of the environment in all pbr material.
         * This dims or reinforces the IBL lighting overall (reflection and diffuse).
         * As in the majority of the scene they are the same (exception for multi room and so on),
         * this is easier to reference from here than from all the materials.
         */
        get: function () {
            return this._environmentIntensity;
        },
        /**
         * Intensity of the environment in all pbr material.
         * This dims or reinforces the IBL lighting overall (reflection and diffuse).
         * As in the majority of the scene they are the same (exception for multi room and so on),
         * this is easier to set here than in all the materials.
         */
        set: function (value) {
            if (this._environmentIntensity === value) {
                return;
            }
            this._environmentIntensity = value;
            this.markAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "imageProcessingConfiguration", {
        /**
         * Default image processing configuration used either in the rendering
         * Forward main pass or through the imageProcessingPostProcess if present.
         * As in the majority of the scene they are the same (exception for multi camera),
         * this is easier to reference from here than from all the materials and post process.
         *
         * No setter as we it is a shared configuration, you can set the values instead.
         */
        get: function () {
            return this._imageProcessingConfiguration;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "forceWireframe", {
        get: function () {
            return this._forceWireframe;
        },
        /**
         * Gets or sets a boolean indicating if all rendering must be done in wireframe
         */
        set: function (value) {
            if (this._forceWireframe === value) {
                return;
            }
            this._forceWireframe = value;
            this.markAllMaterialsAsDirty(16);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "skipFrustumClipping", {
        get: function () {
            return this._skipFrustumClipping;
        },
        /**
         * Gets or sets a boolean indicating if we should skip the frustum clipping part of the active meshes selection
         */
        set: function (value) {
            if (this._skipFrustumClipping === value) {
                return;
            }
            this._skipFrustumClipping = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "forcePointsCloud", {
        get: function () {
            return this._forcePointsCloud;
        },
        /**
         * Gets or sets a boolean indicating if all rendering must be done in point cloud
         */
        set: function (value) {
            if (this._forcePointsCloud === value) {
                return;
            }
            this._forcePointsCloud = value;
            this.markAllMaterialsAsDirty(16);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "animationPropertiesOverride", {
        /**
         * Gets or sets the animation properties override
         */
        get: function () {
            return this._animationPropertiesOverride;
        },
        set: function (value) {
            this._animationPropertiesOverride = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "onDispose", {
        /** Sets a function to be executed when this scene is disposed. */
        set: function (callback) {
            if (this._onDisposeObserver) {
                this.onDisposeObservable.remove(this._onDisposeObserver);
            }
            this._onDisposeObserver = this.onDisposeObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "beforeRender", {
        /** Sets a function to be executed before rendering this scene */
        set: function (callback) {
            if (this._onBeforeRenderObserver) {
                this.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
            }
            if (callback) {
                this._onBeforeRenderObserver = this.onBeforeRenderObservable.add(callback);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "afterRender", {
        /** Sets a function to be executed after rendering this scene */
        set: function (callback) {
            if (this._onAfterRenderObserver) {
                this.onAfterRenderObservable.remove(this._onAfterRenderObserver);
            }
            if (callback) {
                this._onAfterRenderObserver = this.onAfterRenderObservable.add(callback);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "beforeCameraRender", {
        /** Sets a function to be executed before rendering a camera*/
        set: function (callback) {
            if (this._onBeforeCameraRenderObserver) {
                this.onBeforeCameraRenderObservable.remove(this._onBeforeCameraRenderObserver);
            }
            this._onBeforeCameraRenderObserver = this.onBeforeCameraRenderObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "afterCameraRender", {
        /** Sets a function to be executed after rendering a camera*/
        set: function (callback) {
            if (this._onAfterCameraRenderObserver) {
                this.onAfterCameraRenderObservable.remove(this._onAfterCameraRenderObserver);
            }
            this._onAfterCameraRenderObserver = this.onAfterCameraRenderObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "unTranslatedPointer", {
        /**
         * Gets the pointer coordinates without any translation (ie. straight out of the pointer event)
         */
        get: function () {
            return this._inputManager.unTranslatedPointer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene, "DragMovementThreshold", {
        /**
         * Gets or sets the distance in pixel that you have to move to prevent some events. Default is 10 pixels
         */
        get: function () {
            return InputManager.DragMovementThreshold;
        },
        set: function (value) {
            InputManager.DragMovementThreshold = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene, "LongPressDelay", {
        /**
         * Time in milliseconds to wait to raise long press events if button is still pressed. Default is 500 ms
         */
        get: function () {
            return InputManager.LongPressDelay;
        },
        set: function (value) {
            InputManager.LongPressDelay = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene, "DoubleClickDelay", {
        /**
         * Time in milliseconds to wait to raise long press events if button is still pressed. Default is 300 ms
         */
        get: function () {
            return InputManager.DoubleClickDelay;
        },
        set: function (value) {
            InputManager.DoubleClickDelay = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene, "ExclusiveDoubleClickMode", {
        /** If you need to check double click without raising a single click at first click, enable this flag */
        get: function () {
            return InputManager.ExclusiveDoubleClickMode;
        },
        set: function (value) {
            InputManager.ExclusiveDoubleClickMode = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "useRightHandedSystem", {
        get: function () {
            return this._useRightHandedSystem;
        },
        /**
        * Gets or sets a boolean indicating if the scene must use right-handed coordinates system
        */
        set: function (value) {
            if (this._useRightHandedSystem === value) {
                return;
            }
            this._useRightHandedSystem = value;
            this.markAllMaterialsAsDirty(16);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets the step Id used by deterministic lock step
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     * @param newStepId defines the step Id
     */
    Scene.prototype.setStepId = function (newStepId) {
        this._currentStepId = newStepId;
    };
    /**
     * Gets the step Id used by deterministic lock step
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     * @returns the step Id
     */
    Scene.prototype.getStepId = function () {
        return this._currentStepId;
    };
    /**
     * Gets the internal step used by deterministic lock step
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     * @returns the internal step
     */
    Scene.prototype.getInternalStep = function () {
        return this._currentInternalStep;
    };
    Object.defineProperty(Scene.prototype, "fogEnabled", {
        get: function () {
            return this._fogEnabled;
        },
        /**
        * Gets or sets a boolean indicating if fog is enabled on this scene
        * @see https://doc.babylonjs.com/babylon101/environment#fog
        * (Default is true)
        */
        set: function (value) {
            if (this._fogEnabled === value) {
                return;
            }
            this._fogEnabled = value;
            this.markAllMaterialsAsDirty(16);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "fogMode", {
        get: function () {
            return this._fogMode;
        },
        /**
        * Gets or sets the fog mode to use
        * @see https://doc.babylonjs.com/babylon101/environment#fog
        * | mode | value |
        * | --- | --- |
        * | FOGMODE_NONE | 0 |
        * | FOGMODE_EXP | 1 |
        * | FOGMODE_EXP2 | 2 |
        * | FOGMODE_LINEAR | 3 |
        */
        set: function (value) {
            if (this._fogMode === value) {
                return;
            }
            this._fogMode = value;
            this.markAllMaterialsAsDirty(16);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "shadowsEnabled", {
        get: function () {
            return this._shadowsEnabled;
        },
        /**
        * Gets or sets a boolean indicating if shadows are enabled on this scene
        */
        set: function (value) {
            if (this._shadowsEnabled === value) {
                return;
            }
            this._shadowsEnabled = value;
            this.markAllMaterialsAsDirty(2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "lightsEnabled", {
        get: function () {
            return this._lightsEnabled;
        },
        /**
        * Gets or sets a boolean indicating if lights are enabled on this scene
        */
        set: function (value) {
            if (this._lightsEnabled === value) {
                return;
            }
            this._lightsEnabled = value;
            this.markAllMaterialsAsDirty(2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "activeCamera", {
        /** Gets or sets the current active camera */
        get: function () {
            return this._activeCamera;
        },
        set: function (value) {
            if (value === this._activeCamera) {
                return;
            }
            this._activeCamera = value;
            this.onActiveCameraChanged.notifyObservers(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "defaultMaterial", {
        /** The default material used on meshes when no material is affected */
        get: function () {
            if (!this._defaultMaterial) {
                this._defaultMaterial = Scene.DefaultMaterialFactory(this);
            }
            return this._defaultMaterial;
        },
        /** The default material used on meshes when no material is affected */
        set: function (value) {
            this._defaultMaterial = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "texturesEnabled", {
        get: function () {
            return this._texturesEnabled;
        },
        /**
        * Gets or sets a boolean indicating if textures are enabled on this scene
        */
        set: function (value) {
            if (this._texturesEnabled === value) {
                return;
            }
            this._texturesEnabled = value;
            this.markAllMaterialsAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "skeletonsEnabled", {
        get: function () {
            return this._skeletonsEnabled;
        },
        /**
        * Gets or sets a boolean indicating if skeletons are enabled on this scene
        */
        set: function (value) {
            if (this._skeletonsEnabled === value) {
                return;
            }
            this._skeletonsEnabled = value;
            this.markAllMaterialsAsDirty(8);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "collisionCoordinator", {
        /** @hidden */
        get: function () {
            if (!this._collisionCoordinator) {
                this._collisionCoordinator = Scene.CollisionCoordinatorFactory();
                this._collisionCoordinator.init(this);
            }
            return this._collisionCoordinator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "frustumPlanes", {
        /**
         * Gets the list of frustum planes (built from the active camera)
         */
        get: function () {
            return this._frustumPlanes;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Registers the transient components if needed.
     */
    Scene.prototype._registerTransientComponents = function () {
        // Register components that have been associated lately to the scene.
        if (this._transientComponents.length > 0) {
            for (var _i = 0, _a = this._transientComponents; _i < _a.length; _i++) {
                var component = _a[_i];
                component.register();
            }
            this._transientComponents = [];
        }
    };
    /**
     * @hidden
     * Add a component to the scene.
     * Note that the ccomponent could be registered on th next frame if this is called after
     * the register component stage.
     * @param component Defines the component to add to the scene
     */
    Scene.prototype._addComponent = function (component) {
        this._components.push(component);
        this._transientComponents.push(component);
        var serializableComponent = component;
        if (serializableComponent.addFromContainer && serializableComponent.serialize) {
            this._serializableComponents.push(serializableComponent);
        }
    };
    /**
     * @hidden
     * Gets a component from the scene.
     * @param name defines the name of the component to retrieve
     * @returns the component or null if not present
     */
    Scene.prototype._getComponent = function (name) {
        for (var _i = 0, _a = this._components; _i < _a.length; _i++) {
            var component = _a[_i];
            if (component.name === name) {
                return component;
            }
        }
        return null;
    };
    /**
     * Gets a string identifying the name of the class
     * @returns "Scene" string
     */
    Scene.prototype.getClassName = function () {
        return "Scene";
    };
    /**
     * @hidden
     */
    Scene.prototype._getDefaultMeshCandidates = function () {
        this._defaultMeshCandidates.data = this.meshes;
        this._defaultMeshCandidates.length = this.meshes.length;
        return this._defaultMeshCandidates;
    };
    /**
     * @hidden
     */
    Scene.prototype._getDefaultSubMeshCandidates = function (mesh) {
        this._defaultSubMeshCandidates.data = mesh.subMeshes;
        this._defaultSubMeshCandidates.length = mesh.subMeshes.length;
        return this._defaultSubMeshCandidates;
    };
    /**
     * Sets the default candidate providers for the scene.
     * This sets the getActiveMeshCandidates, getActiveSubMeshCandidates, getIntersectingSubMeshCandidates
     * and getCollidingSubMeshCandidates to their default function
     */
    Scene.prototype.setDefaultCandidateProviders = function () {
        this.getActiveMeshCandidates = this._getDefaultMeshCandidates.bind(this);
        this.getActiveSubMeshCandidates = this._getDefaultSubMeshCandidates.bind(this);
        this.getIntersectingSubMeshCandidates = this._getDefaultSubMeshCandidates.bind(this);
        this.getCollidingSubMeshCandidates = this._getDefaultSubMeshCandidates.bind(this);
    };
    Object.defineProperty(Scene.prototype, "meshUnderPointer", {
        /**
         * Gets the mesh that is currently under the pointer
         */
        get: function () {
            return this._inputManager.meshUnderPointer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "pointerX", {
        /**
         * Gets or sets the current on-screen X position of the pointer
         */
        get: function () {
            return this._inputManager.pointerX;
        },
        set: function (value) {
            this._inputManager.pointerX = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "pointerY", {
        /**
         * Gets or sets the current on-screen Y position of the pointer
         */
        get: function () {
            return this._inputManager.pointerY;
        },
        set: function (value) {
            this._inputManager.pointerY = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the cached material (ie. the latest rendered one)
     * @returns the cached material
     */
    Scene.prototype.getCachedMaterial = function () {
        return this._cachedMaterial;
    };
    /**
     * Gets the cached effect (ie. the latest rendered one)
     * @returns the cached effect
     */
    Scene.prototype.getCachedEffect = function () {
        return this._cachedEffect;
    };
    /**
     * Gets the cached visibility state (ie. the latest rendered one)
     * @returns the cached visibility state
     */
    Scene.prototype.getCachedVisibility = function () {
        return this._cachedVisibility;
    };
    /**
     * Gets a boolean indicating if the current material / effect / visibility must be bind again
     * @param material defines the current material
     * @param effect defines the current effect
     * @param visibility defines the current visibility state
     * @returns true if one parameter is not cached
     */
    Scene.prototype.isCachedMaterialInvalid = function (material, effect, visibility) {
        if (visibility === void 0) { visibility = 1; }
        return this._cachedEffect !== effect || this._cachedMaterial !== material || this._cachedVisibility !== visibility;
    };
    /**
     * Gets the engine associated with the scene
     * @returns an Engine
     */
    Scene.prototype.getEngine = function () {
        return this._engine;
    };
    /**
     * Gets the total number of vertices rendered per frame
     * @returns the total number of vertices rendered per frame
     */
    Scene.prototype.getTotalVertices = function () {
        return this._totalVertices.current;
    };
    Object.defineProperty(Scene.prototype, "totalVerticesPerfCounter", {
        /**
         * Gets the performance counter for total vertices
         * @see https://doc.babylonjs.com/how_to/optimizing_your_scene#instrumentation
         */
        get: function () {
            return this._totalVertices;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the total number of active indices rendered per frame (You can deduce the number of rendered triangles by dividing this number by 3)
     * @returns the total number of active indices rendered per frame
     */
    Scene.prototype.getActiveIndices = function () {
        return this._activeIndices.current;
    };
    Object.defineProperty(Scene.prototype, "totalActiveIndicesPerfCounter", {
        /**
         * Gets the performance counter for active indices
         * @see https://doc.babylonjs.com/how_to/optimizing_your_scene#instrumentation
         */
        get: function () {
            return this._activeIndices;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the total number of active particles rendered per frame
     * @returns the total number of active particles rendered per frame
     */
    Scene.prototype.getActiveParticles = function () {
        return this._activeParticles.current;
    };
    Object.defineProperty(Scene.prototype, "activeParticlesPerfCounter", {
        /**
         * Gets the performance counter for active particles
         * @see https://doc.babylonjs.com/how_to/optimizing_your_scene#instrumentation
         */
        get: function () {
            return this._activeParticles;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the total number of active bones rendered per frame
     * @returns the total number of active bones rendered per frame
     */
    Scene.prototype.getActiveBones = function () {
        return this._activeBones.current;
    };
    Object.defineProperty(Scene.prototype, "activeBonesPerfCounter", {
        /**
         * Gets the performance counter for active bones
         * @see https://doc.babylonjs.com/how_to/optimizing_your_scene#instrumentation
         */
        get: function () {
            return this._activeBones;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the array of active meshes
     * @returns an array of AbstractMesh
     */
    Scene.prototype.getActiveMeshes = function () {
        return this._activeMeshes;
    };
    /**
     * Gets the animation ratio (which is 1.0 is the scene renders at 60fps and 2 if the scene renders at 30fps, etc.)
     * @returns a number
     */
    Scene.prototype.getAnimationRatio = function () {
        return this._animationRatio !== undefined ? this._animationRatio : 1;
    };
    /**
     * Gets an unique Id for the current render phase
     * @returns a number
     */
    Scene.prototype.getRenderId = function () {
        return this._renderId;
    };
    /**
     * Gets an unique Id for the current frame
     * @returns a number
     */
    Scene.prototype.getFrameId = function () {
        return this._frameId;
    };
    /** Call this function if you want to manually increment the render Id*/
    Scene.prototype.incrementRenderId = function () {
        this._renderId++;
    };
    Scene.prototype._createUbo = function () {
        this._sceneUbo = new UniformBuffer(this._engine, undefined, true);
        this._sceneUbo.addUniform("viewProjection", 16);
        this._sceneUbo.addUniform("view", 16);
    };
    /**
     * Use this method to simulate a pointer move on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     * @returns the current scene
     */
    Scene.prototype.simulatePointerMove = function (pickResult, pointerEventInit) {
        this._inputManager.simulatePointerMove(pickResult, pointerEventInit);
        return this;
    };
    /**
     * Use this method to simulate a pointer down on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     * @returns the current scene
     */
    Scene.prototype.simulatePointerDown = function (pickResult, pointerEventInit) {
        this._inputManager.simulatePointerDown(pickResult, pointerEventInit);
        return this;
    };
    /**
     * Use this method to simulate a pointer up on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     * @param doubleTap indicates that the pointer up event should be considered as part of a double click (false by default)
     * @returns the current scene
     */
    Scene.prototype.simulatePointerUp = function (pickResult, pointerEventInit, doubleTap) {
        this._inputManager.simulatePointerUp(pickResult, pointerEventInit, doubleTap);
        return this;
    };
    /**
     * Gets a boolean indicating if the current pointer event is captured (meaning that the scene has already handled the pointer down)
     * @param pointerId defines the pointer id to use in a multi-touch scenario (0 by default)
     * @returns true if the pointer was captured
     */
    Scene.prototype.isPointerCaptured = function (pointerId) {
        if (pointerId === void 0) { pointerId = 0; }
        return this._inputManager.isPointerCaptured(pointerId);
    };
    /**
    * Attach events to the canvas (To handle actionManagers triggers and raise onPointerMove, onPointerDown and onPointerUp
    * @param attachUp defines if you want to attach events to pointerup
    * @param attachDown defines if you want to attach events to pointerdown
    * @param attachMove defines if you want to attach events to pointermove
    */
    Scene.prototype.attachControl = function (attachUp, attachDown, attachMove) {
        if (attachUp === void 0) { attachUp = true; }
        if (attachDown === void 0) { attachDown = true; }
        if (attachMove === void 0) { attachMove = true; }
        this._inputManager.attachControl(attachUp, attachDown, attachMove);
    };
    /** Detaches all event handlers*/
    Scene.prototype.detachControl = function () {
        this._inputManager.detachControl();
    };
    /**
     * This function will check if the scene can be rendered (textures are loaded, shaders are compiled)
     * Delay loaded resources are not taking in account
     * @return true if all required resources are ready
     */
    Scene.prototype.isReady = function () {
        if (this._isDisposed) {
            return false;
        }
        var index;
        var engine = this.getEngine();
        // Effects
        if (!engine.areAllEffectsReady()) {
            return false;
        }
        // Pending data
        if (this._pendingData.length > 0) {
            return false;
        }
        // Meshes
        for (index = 0; index < this.meshes.length; index++) {
            var mesh = this.meshes[index];
            if (!mesh.isEnabled()) {
                continue;
            }
            if (!mesh.subMeshes || mesh.subMeshes.length === 0) {
                continue;
            }
            if (!mesh.isReady(true)) {
                return false;
            }
            var hardwareInstancedRendering = mesh.hasThinInstances || mesh.getClassName() === "InstancedMesh" || mesh.getClassName() === "InstancedLinesMesh" || engine.getCaps().instancedArrays && mesh.instances.length > 0;
            // Is Ready For Mesh
            for (var _i = 0, _a = this._isReadyForMeshStage; _i < _a.length; _i++) {
                var step = _a[_i];
                if (!step.action(mesh, hardwareInstancedRendering)) {
                    return false;
                }
            }
        }
        // Geometries
        for (index = 0; index < this.geometries.length; index++) {
            var geometry = this.geometries[index];
            if (geometry.delayLoadState === 2) {
                return false;
            }
        }
        // Post-processes
        if (this.activeCameras && this.activeCameras.length > 0) {
            for (var _b = 0, _c = this.activeCameras; _b < _c.length; _b++) {
                var camera = _c[_b];
                if (!camera.isReady(true)) {
                    return false;
                }
            }
        }
        else if (this.activeCamera) {
            if (!this.activeCamera.isReady(true)) {
                return false;
            }
        }
        // Particles
        for (var _d = 0, _e = this.particleSystems; _d < _e.length; _d++) {
            var particleSystem = _e[_d];
            if (!particleSystem.isReady()) {
                return false;
            }
        }
        return true;
    };
    /** Resets all cached information relative to material (including effect and visibility) */
    Scene.prototype.resetCachedMaterial = function () {
        this._cachedMaterial = null;
        this._cachedEffect = null;
        this._cachedVisibility = null;
    };
    /**
     * Registers a function to be called before every frame render
     * @param func defines the function to register
     */
    Scene.prototype.registerBeforeRender = function (func) {
        this.onBeforeRenderObservable.add(func);
    };
    /**
     * Unregisters a function called before every frame render
     * @param func defines the function to unregister
     */
    Scene.prototype.unregisterBeforeRender = function (func) {
        this.onBeforeRenderObservable.removeCallback(func);
    };
    /**
     * Registers a function to be called after every frame render
     * @param func defines the function to register
     */
    Scene.prototype.registerAfterRender = function (func) {
        this.onAfterRenderObservable.add(func);
    };
    /**
     * Unregisters a function called after every frame render
     * @param func defines the function to unregister
     */
    Scene.prototype.unregisterAfterRender = function (func) {
        this.onAfterRenderObservable.removeCallback(func);
    };
    Scene.prototype._executeOnceBeforeRender = function (func) {
        var _this = this;
        var execFunc = function () {
            func();
            setTimeout(function () {
                _this.unregisterBeforeRender(execFunc);
            });
        };
        this.registerBeforeRender(execFunc);
    };
    /**
     * The provided function will run before render once and will be disposed afterwards.
     * A timeout delay can be provided so that the function will be executed in N ms.
     * The timeout is using the browser's native setTimeout so time percision cannot be guaranteed.
     * @param func The function to be executed.
     * @param timeout optional delay in ms
     */
    Scene.prototype.executeOnceBeforeRender = function (func, timeout) {
        var _this = this;
        if (timeout !== undefined) {
            setTimeout(function () {
                _this._executeOnceBeforeRender(func);
            }, timeout);
        }
        else {
            this._executeOnceBeforeRender(func);
        }
    };
    /** @hidden */
    Scene.prototype._addPendingData = function (data) {
        this._pendingData.push(data);
    };
    /** @hidden */
    Scene.prototype._removePendingData = function (data) {
        var wasLoading = this.isLoading;
        var index = this._pendingData.indexOf(data);
        if (index !== -1) {
            this._pendingData.splice(index, 1);
        }
        if (wasLoading && !this.isLoading) {
            this.onDataLoadedObservable.notifyObservers(this);
        }
    };
    /**
     * Returns the number of items waiting to be loaded
     * @returns the number of items waiting to be loaded
     */
    Scene.prototype.getWaitingItemsCount = function () {
        return this._pendingData.length;
    };
    Object.defineProperty(Scene.prototype, "isLoading", {
        /**
         * Returns a boolean indicating if the scene is still loading data
         */
        get: function () {
            return this._pendingData.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Registers a function to be executed when the scene is ready
     * @param {Function} func - the function to be executed
     */
    Scene.prototype.executeWhenReady = function (func) {
        var _this = this;
        this.onReadyObservable.add(func);
        if (this._executeWhenReadyTimeoutId !== -1) {
            return;
        }
        this._executeWhenReadyTimeoutId = setTimeout(function () {
            _this._checkIsReady();
        }, 150);
    };
    /**
     * Returns a promise that resolves when the scene is ready
     * @returns A promise that resolves when the scene is ready
     */
    Scene.prototype.whenReadyAsync = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.executeWhenReady(function () {
                resolve();
            });
        });
    };
    /** @hidden */
    Scene.prototype._checkIsReady = function () {
        var _this = this;
        this._registerTransientComponents();
        if (this.isReady()) {
            this.onReadyObservable.notifyObservers(this);
            this.onReadyObservable.clear();
            this._executeWhenReadyTimeoutId = -1;
            return;
        }
        if (this._isDisposed) {
            this.onReadyObservable.clear();
            this._executeWhenReadyTimeoutId = -1;
            return;
        }
        this._executeWhenReadyTimeoutId = setTimeout(function () {
            _this._checkIsReady();
        }, 150);
    };
    Object.defineProperty(Scene.prototype, "animatables", {
        /**
         * Gets all animatable attached to the scene
         */
        get: function () {
            return this._activeAnimatables;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Resets the last animation time frame.
     * Useful to override when animations start running when loading a scene for the first time.
     */
    Scene.prototype.resetLastAnimationTimeFrame = function () {
        this._animationTimeLast = PrecisionDate.Now;
    };
    // Matrix
    /**
     * Gets the current view matrix
     * @returns a Matrix
     */
    Scene.prototype.getViewMatrix = function () {
        return this._viewMatrix;
    };
    /**
     * Gets the current projection matrix
     * @returns a Matrix
     */
    Scene.prototype.getProjectionMatrix = function () {
        return this._projectionMatrix;
    };
    /**
     * Gets the current transform matrix
     * @returns a Matrix made of View * Projection
     */
    Scene.prototype.getTransformMatrix = function () {
        return this._transformMatrix;
    };
    /**
     * Sets the current transform matrix
     * @param viewL defines the View matrix to use
     * @param projectionL defines the Projection matrix to use
     * @param viewR defines the right View matrix to use (if provided)
     * @param projectionR defines the right Projection matrix to use (if provided)
     */
    Scene.prototype.setTransformMatrix = function (viewL, projectionL, viewR, projectionR) {
        if (this._viewUpdateFlag === viewL.updateFlag && this._projectionUpdateFlag === projectionL.updateFlag) {
            return;
        }
        this._viewUpdateFlag = viewL.updateFlag;
        this._projectionUpdateFlag = projectionL.updateFlag;
        this._viewMatrix = viewL;
        this._projectionMatrix = projectionL;
        this._viewMatrix.multiplyToRef(this._projectionMatrix, this._transformMatrix);
        // Update frustum
        if (!this._frustumPlanes) {
            this._frustumPlanes = Frustum.GetPlanes(this._transformMatrix);
        }
        else {
            Frustum.GetPlanesToRef(this._transformMatrix, this._frustumPlanes);
        }
        if (this._multiviewSceneUbo && this._multiviewSceneUbo.useUbo) {
            this._updateMultiviewUbo(viewR, projectionR);
        }
        else if (this._sceneUbo.useUbo) {
            this._sceneUbo.updateMatrix("viewProjection", this._transformMatrix);
            this._sceneUbo.updateMatrix("view", this._viewMatrix);
            this._sceneUbo.update();
        }
    };
    /**
     * Gets the uniform buffer used to store scene data
     * @returns a UniformBuffer
     */
    Scene.prototype.getSceneUniformBuffer = function () {
        return this._multiviewSceneUbo ? this._multiviewSceneUbo : this._sceneUbo;
    };
    /**
     * Gets an unique (relatively to the current scene) Id
     * @returns an unique number for the scene
     */
    Scene.prototype.getUniqueId = function () {
        return UniqueIdGenerator.UniqueId;
    };
    /**
     * Add a mesh to the list of scene's meshes
     * @param newMesh defines the mesh to add
     * @param recursive if all child meshes should also be added to the scene
     */
    Scene.prototype.addMesh = function (newMesh, recursive) {
        var _this = this;
        if (recursive === void 0) { recursive = false; }
        if (this._blockEntityCollection) {
            return;
        }
        this.meshes.push(newMesh);
        newMesh._resyncLightSources();
        if (!newMesh.parent) {
            newMesh._addToSceneRootNodes();
        }
        this.onNewMeshAddedObservable.notifyObservers(newMesh);
        if (recursive) {
            newMesh.getChildMeshes().forEach(function (m) {
                _this.addMesh(m);
            });
        }
    };
    /**
     * Remove a mesh for the list of scene's meshes
     * @param toRemove defines the mesh to remove
     * @param recursive if all child meshes should also be removed from the scene
     * @returns the index where the mesh was in the mesh list
     */
    Scene.prototype.removeMesh = function (toRemove, recursive) {
        var _this = this;
        if (recursive === void 0) { recursive = false; }
        var index = this.meshes.indexOf(toRemove);
        if (index !== -1) {
            // Remove from the scene if mesh found
            this.meshes[index] = this.meshes[this.meshes.length - 1];
            this.meshes.pop();
            if (!toRemove.parent) {
                toRemove._removeFromSceneRootNodes();
            }
        }
        this.onMeshRemovedObservable.notifyObservers(toRemove);
        if (recursive) {
            toRemove.getChildMeshes().forEach(function (m) {
                _this.removeMesh(m);
            });
        }
        return index;
    };
    /**
     * Add a transform node to the list of scene's transform nodes
     * @param newTransformNode defines the transform node to add
     */
    Scene.prototype.addTransformNode = function (newTransformNode) {
        if (this._blockEntityCollection) {
            return;
        }
        newTransformNode._indexInSceneTransformNodesArray = this.transformNodes.length;
        this.transformNodes.push(newTransformNode);
        if (!newTransformNode.parent) {
            newTransformNode._addToSceneRootNodes();
        }
        this.onNewTransformNodeAddedObservable.notifyObservers(newTransformNode);
    };
    /**
     * Remove a transform node for the list of scene's transform nodes
     * @param toRemove defines the transform node to remove
     * @returns the index where the transform node was in the transform node list
     */
    Scene.prototype.removeTransformNode = function (toRemove) {
        var index = toRemove._indexInSceneTransformNodesArray;
        if (index !== -1) {
            if (index !== this.transformNodes.length - 1) {
                var lastNode = this.transformNodes[this.transformNodes.length - 1];
                this.transformNodes[index] = lastNode;
                lastNode._indexInSceneTransformNodesArray = index;
            }
            toRemove._indexInSceneTransformNodesArray = -1;
            this.transformNodes.pop();
            if (!toRemove.parent) {
                toRemove._removeFromSceneRootNodes();
            }
        }
        this.onTransformNodeRemovedObservable.notifyObservers(toRemove);
        return index;
    };
    /**
     * Remove a skeleton for the list of scene's skeletons
     * @param toRemove defines the skeleton to remove
     * @returns the index where the skeleton was in the skeleton list
     */
    Scene.prototype.removeSkeleton = function (toRemove) {
        var index = this.skeletons.indexOf(toRemove);
        if (index !== -1) {
            // Remove from the scene if found
            this.skeletons.splice(index, 1);
            this.onSkeletonRemovedObservable.notifyObservers(toRemove);
        }
        return index;
    };
    /**
     * Remove a morph target for the list of scene's morph targets
     * @param toRemove defines the morph target to remove
     * @returns the index where the morph target was in the morph target list
     */
    Scene.prototype.removeMorphTargetManager = function (toRemove) {
        var index = this.morphTargetManagers.indexOf(toRemove);
        if (index !== -1) {
            // Remove from the scene if found
            this.morphTargetManagers.splice(index, 1);
        }
        return index;
    };
    /**
     * Remove a light for the list of scene's lights
     * @param toRemove defines the light to remove
     * @returns the index where the light was in the light list
     */
    Scene.prototype.removeLight = function (toRemove) {
        var index = this.lights.indexOf(toRemove);
        if (index !== -1) {
            // Remove from meshes
            for (var _i = 0, _a = this.meshes; _i < _a.length; _i++) {
                var mesh = _a[_i];
                mesh._removeLightSource(toRemove, false);
            }
            // Remove from the scene if mesh found
            this.lights.splice(index, 1);
            this.sortLightsByPriority();
            if (!toRemove.parent) {
                toRemove._removeFromSceneRootNodes();
            }
        }
        this.onLightRemovedObservable.notifyObservers(toRemove);
        return index;
    };
    /**
     * Remove a camera for the list of scene's cameras
     * @param toRemove defines the camera to remove
     * @returns the index where the camera was in the camera list
     */
    Scene.prototype.removeCamera = function (toRemove) {
        var index = this.cameras.indexOf(toRemove);
        if (index !== -1) {
            // Remove from the scene if mesh found
            this.cameras.splice(index, 1);
            if (!toRemove.parent) {
                toRemove._removeFromSceneRootNodes();
            }
        }
        // Remove from activeCameras
        if (this.activeCameras) {
            var index2 = this.activeCameras.indexOf(toRemove);
            if (index2 !== -1) {
                // Remove from the scene if mesh found
                this.activeCameras.splice(index2, 1);
            }
        }
        // Reset the activeCamera
        if (this.activeCamera === toRemove) {
            if (this.cameras.length > 0) {
                this.activeCamera = this.cameras[0];
            }
            else {
                this.activeCamera = null;
            }
        }
        this.onCameraRemovedObservable.notifyObservers(toRemove);
        return index;
    };
    /**
     * Remove a particle system for the list of scene's particle systems
     * @param toRemove defines the particle system to remove
     * @returns the index where the particle system was in the particle system list
     */
    Scene.prototype.removeParticleSystem = function (toRemove) {
        var index = this.particleSystems.indexOf(toRemove);
        if (index !== -1) {
            this.particleSystems.splice(index, 1);
        }
        return index;
    };
    /**
     * Remove a animation for the list of scene's animations
     * @param toRemove defines the animation to remove
     * @returns the index where the animation was in the animation list
     */
    Scene.prototype.removeAnimation = function (toRemove) {
        var index = this.animations.indexOf(toRemove);
        if (index !== -1) {
            this.animations.splice(index, 1);
        }
        return index;
    };
    /**
     * Will stop the animation of the given target
     * @param target - the target
     * @param animationName - the name of the animation to stop (all animations will be stopped if both this and targetMask are empty)
     * @param targetMask - a function that determines if the animation should be stopped based on its target (all animations will be stopped if both this and animationName are empty)
     */
    Scene.prototype.stopAnimation = function (target, animationName, targetMask) {
        // Do nothing as code will be provided by animation component
    };
    /**
     * Removes the given animation group from this scene.
     * @param toRemove The animation group to remove
     * @returns The index of the removed animation group
     */
    Scene.prototype.removeAnimationGroup = function (toRemove) {
        var index = this.animationGroups.indexOf(toRemove);
        if (index !== -1) {
            this.animationGroups.splice(index, 1);
        }
        return index;
    };
    /**
     * Removes the given multi-material from this scene.
     * @param toRemove The multi-material to remove
     * @returns The index of the removed multi-material
     */
    Scene.prototype.removeMultiMaterial = function (toRemove) {
        var index = this.multiMaterials.indexOf(toRemove);
        if (index !== -1) {
            this.multiMaterials.splice(index, 1);
        }
        this.onMultiMaterialRemovedObservable.notifyObservers(toRemove);
        return index;
    };
    /**
     * Removes the given material from this scene.
     * @param toRemove The material to remove
     * @returns The index of the removed material
     */
    Scene.prototype.removeMaterial = function (toRemove) {
        var index = toRemove._indexInSceneMaterialArray;
        if (index !== -1 && index < this.materials.length) {
            if (index !== this.materials.length - 1) {
                var lastMaterial = this.materials[this.materials.length - 1];
                this.materials[index] = lastMaterial;
                lastMaterial._indexInSceneMaterialArray = index;
            }
            toRemove._indexInSceneMaterialArray = -1;
            this.materials.pop();
        }
        this.onMaterialRemovedObservable.notifyObservers(toRemove);
        return index;
    };
    /**
     * Removes the given action manager from this scene.
     * @param toRemove The action manager to remove
     * @returns The index of the removed action manager
     */
    Scene.prototype.removeActionManager = function (toRemove) {
        var index = this.actionManagers.indexOf(toRemove);
        if (index !== -1) {
            this.actionManagers.splice(index, 1);
        }
        return index;
    };
    /**
     * Removes the given texture from this scene.
     * @param toRemove The texture to remove
     * @returns The index of the removed texture
     */
    Scene.prototype.removeTexture = function (toRemove) {
        var index = this.textures.indexOf(toRemove);
        if (index !== -1) {
            this.textures.splice(index, 1);
        }
        this.onTextureRemovedObservable.notifyObservers(toRemove);
        return index;
    };
    /**
     * Adds the given light to this scene
     * @param newLight The light to add
     */
    Scene.prototype.addLight = function (newLight) {
        if (this._blockEntityCollection) {
            return;
        }
        this.lights.push(newLight);
        this.sortLightsByPriority();
        if (!newLight.parent) {
            newLight._addToSceneRootNodes();
        }
        // Add light to all meshes (To support if the light is removed and then re-added)
        for (var _i = 0, _a = this.meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            if (mesh.lightSources.indexOf(newLight) === -1) {
                mesh.lightSources.push(newLight);
                mesh._resyncLightSources();
            }
        }
        this.onNewLightAddedObservable.notifyObservers(newLight);
    };
    /**
     * Sorts the list list based on light priorities
     */
    Scene.prototype.sortLightsByPriority = function () {
        if (this.requireLightSorting) {
            this.lights.sort(Light.CompareLightsPriority);
        }
    };
    /**
     * Adds the given camera to this scene
     * @param newCamera The camera to add
     */
    Scene.prototype.addCamera = function (newCamera) {
        if (this._blockEntityCollection) {
            return;
        }
        this.cameras.push(newCamera);
        this.onNewCameraAddedObservable.notifyObservers(newCamera);
        if (!newCamera.parent) {
            newCamera._addToSceneRootNodes();
        }
    };
    /**
     * Adds the given skeleton to this scene
     * @param newSkeleton The skeleton to add
     */
    Scene.prototype.addSkeleton = function (newSkeleton) {
        if (this._blockEntityCollection) {
            return;
        }
        this.skeletons.push(newSkeleton);
        this.onNewSkeletonAddedObservable.notifyObservers(newSkeleton);
    };
    /**
     * Adds the given particle system to this scene
     * @param newParticleSystem The particle system to add
     */
    Scene.prototype.addParticleSystem = function (newParticleSystem) {
        if (this._blockEntityCollection) {
            return;
        }
        this.particleSystems.push(newParticleSystem);
    };
    /**
     * Adds the given animation to this scene
     * @param newAnimation The animation to add
     */
    Scene.prototype.addAnimation = function (newAnimation) {
        if (this._blockEntityCollection) {
            return;
        }
        this.animations.push(newAnimation);
    };
    /**
     * Adds the given animation group to this scene.
     * @param newAnimationGroup The animation group to add
     */
    Scene.prototype.addAnimationGroup = function (newAnimationGroup) {
        if (this._blockEntityCollection) {
            return;
        }
        this.animationGroups.push(newAnimationGroup);
    };
    /**
     * Adds the given multi-material to this scene
     * @param newMultiMaterial The multi-material to add
     */
    Scene.prototype.addMultiMaterial = function (newMultiMaterial) {
        if (this._blockEntityCollection) {
            return;
        }
        this.multiMaterials.push(newMultiMaterial);
        this.onNewMultiMaterialAddedObservable.notifyObservers(newMultiMaterial);
    };
    /**
     * Adds the given material to this scene
     * @param newMaterial The material to add
     */
    Scene.prototype.addMaterial = function (newMaterial) {
        if (this._blockEntityCollection) {
            return;
        }
        newMaterial._indexInSceneMaterialArray = this.materials.length;
        this.materials.push(newMaterial);
        this.onNewMaterialAddedObservable.notifyObservers(newMaterial);
    };
    /**
     * Adds the given morph target to this scene
     * @param newMorphTargetManager The morph target to add
     */
    Scene.prototype.addMorphTargetManager = function (newMorphTargetManager) {
        if (this._blockEntityCollection) {
            return;
        }
        this.morphTargetManagers.push(newMorphTargetManager);
    };
    /**
     * Adds the given geometry to this scene
     * @param newGeometry The geometry to add
     */
    Scene.prototype.addGeometry = function (newGeometry) {
        if (this._blockEntityCollection) {
            return;
        }
        if (this.geometriesByUniqueId) {
            this.geometriesByUniqueId[newGeometry.uniqueId] = this.geometries.length;
        }
        this.geometries.push(newGeometry);
    };
    /**
     * Adds the given action manager to this scene
     * @param newActionManager The action manager to add
     */
    Scene.prototype.addActionManager = function (newActionManager) {
        this.actionManagers.push(newActionManager);
    };
    /**
     * Adds the given texture to this scene.
     * @param newTexture The texture to add
     */
    Scene.prototype.addTexture = function (newTexture) {
        if (this._blockEntityCollection) {
            return;
        }
        this.textures.push(newTexture);
        this.onNewTextureAddedObservable.notifyObservers(newTexture);
    };
    /**
     * Switch active camera
     * @param newCamera defines the new active camera
     * @param attachControl defines if attachControl must be called for the new active camera (default: true)
     */
    Scene.prototype.switchActiveCamera = function (newCamera, attachControl) {
        if (attachControl === void 0) { attachControl = true; }
        var canvas = this._engine.getInputElement();
        if (!canvas) {
            return;
        }
        if (this.activeCamera) {
            this.activeCamera.detachControl();
        }
        this.activeCamera = newCamera;
        if (attachControl) {
            newCamera.attachControl();
        }
    };
    /**
     * sets the active camera of the scene using its ID
     * @param id defines the camera's ID
     * @return the new active camera or null if none found.
     */
    Scene.prototype.setActiveCameraByID = function (id) {
        var camera = this.getCameraByID(id);
        if (camera) {
            this.activeCamera = camera;
            return camera;
        }
        return null;
    };
    /**
     * sets the active camera of the scene using its name
     * @param name defines the camera's name
     * @returns the new active camera or null if none found.
     */
    Scene.prototype.setActiveCameraByName = function (name) {
        var camera = this.getCameraByName(name);
        if (camera) {
            this.activeCamera = camera;
            return camera;
        }
        return null;
    };
    /**
     * get an animation group using its name
     * @param name defines the material's name
     * @return the animation group or null if none found.
     */
    Scene.prototype.getAnimationGroupByName = function (name) {
        for (var index = 0; index < this.animationGroups.length; index++) {
            if (this.animationGroups[index].name === name) {
                return this.animationGroups[index];
            }
        }
        return null;
    };
    /**
     * Get a material using its unique id
     * @param uniqueId defines the material's unique id
     * @return the material or null if none found.
     */
    Scene.prototype.getMaterialByUniqueID = function (uniqueId) {
        for (var index = 0; index < this.materials.length; index++) {
            if (this.materials[index].uniqueId === uniqueId) {
                return this.materials[index];
            }
        }
        return null;
    };
    /**
     * get a material using its id
     * @param id defines the material's ID
     * @return the material or null if none found.
     */
    Scene.prototype.getMaterialByID = function (id) {
        for (var index = 0; index < this.materials.length; index++) {
            if (this.materials[index].id === id) {
                return this.materials[index];
            }
        }
        return null;
    };
    /**
     * Gets a the last added material using a given id
     * @param id defines the material's ID
     * @return the last material with the given id or null if none found.
     */
    Scene.prototype.getLastMaterialByID = function (id) {
        for (var index = this.materials.length - 1; index >= 0; index--) {
            if (this.materials[index].id === id) {
                return this.materials[index];
            }
        }
        return null;
    };
    /**
     * Gets a material using its name
     * @param name defines the material's name
     * @return the material or null if none found.
     */
    Scene.prototype.getMaterialByName = function (name) {
        for (var index = 0; index < this.materials.length; index++) {
            if (this.materials[index].name === name) {
                return this.materials[index];
            }
        }
        return null;
    };
    /**
     * Get a texture using its unique id
     * @param uniqueId defines the texture's unique id
     * @return the texture or null if none found.
     */
    Scene.prototype.getTextureByUniqueID = function (uniqueId) {
        for (var index = 0; index < this.textures.length; index++) {
            if (this.textures[index].uniqueId === uniqueId) {
                return this.textures[index];
            }
        }
        return null;
    };
    /**
     * Gets a camera using its id
     * @param id defines the id to look for
     * @returns the camera or null if not found
     */
    Scene.prototype.getCameraByID = function (id) {
        for (var index = 0; index < this.cameras.length; index++) {
            if (this.cameras[index].id === id) {
                return this.cameras[index];
            }
        }
        return null;
    };
    /**
     * Gets a camera using its unique id
     * @param uniqueId defines the unique id to look for
     * @returns the camera or null if not found
     */
    Scene.prototype.getCameraByUniqueID = function (uniqueId) {
        for (var index = 0; index < this.cameras.length; index++) {
            if (this.cameras[index].uniqueId === uniqueId) {
                return this.cameras[index];
            }
        }
        return null;
    };
    /**
     * Gets a camera using its name
     * @param name defines the camera's name
     * @return the camera or null if none found.
     */
    Scene.prototype.getCameraByName = function (name) {
        for (var index = 0; index < this.cameras.length; index++) {
            if (this.cameras[index].name === name) {
                return this.cameras[index];
            }
        }
        return null;
    };
    /**
     * Gets a bone using its id
     * @param id defines the bone's id
     * @return the bone or null if not found
     */
    Scene.prototype.getBoneByID = function (id) {
        for (var skeletonIndex = 0; skeletonIndex < this.skeletons.length; skeletonIndex++) {
            var skeleton = this.skeletons[skeletonIndex];
            for (var boneIndex = 0; boneIndex < skeleton.bones.length; boneIndex++) {
                if (skeleton.bones[boneIndex].id === id) {
                    return skeleton.bones[boneIndex];
                }
            }
        }
        return null;
    };
    /**
    * Gets a bone using its id
    * @param name defines the bone's name
    * @return the bone or null if not found
    */
    Scene.prototype.getBoneByName = function (name) {
        for (var skeletonIndex = 0; skeletonIndex < this.skeletons.length; skeletonIndex++) {
            var skeleton = this.skeletons[skeletonIndex];
            for (var boneIndex = 0; boneIndex < skeleton.bones.length; boneIndex++) {
                if (skeleton.bones[boneIndex].name === name) {
                    return skeleton.bones[boneIndex];
                }
            }
        }
        return null;
    };
    /**
     * Gets a light node using its name
     * @param name defines the the light's name
     * @return the light or null if none found.
     */
    Scene.prototype.getLightByName = function (name) {
        for (var index = 0; index < this.lights.length; index++) {
            if (this.lights[index].name === name) {
                return this.lights[index];
            }
        }
        return null;
    };
    /**
     * Gets a light node using its id
     * @param id defines the light's id
     * @return the light or null if none found.
     */
    Scene.prototype.getLightByID = function (id) {
        for (var index = 0; index < this.lights.length; index++) {
            if (this.lights[index].id === id) {
                return this.lights[index];
            }
        }
        return null;
    };
    /**
     * Gets a light node using its scene-generated unique ID
     * @param uniqueId defines the light's unique id
     * @return the light or null if none found.
     */
    Scene.prototype.getLightByUniqueID = function (uniqueId) {
        for (var index = 0; index < this.lights.length; index++) {
            if (this.lights[index].uniqueId === uniqueId) {
                return this.lights[index];
            }
        }
        return null;
    };
    /**
     * Gets a particle system by id
     * @param id defines the particle system id
     * @return the corresponding system or null if none found
     */
    Scene.prototype.getParticleSystemByID = function (id) {
        for (var index = 0; index < this.particleSystems.length; index++) {
            if (this.particleSystems[index].id === id) {
                return this.particleSystems[index];
            }
        }
        return null;
    };
    /**
     * Gets a geometry using its ID
     * @param id defines the geometry's id
     * @return the geometry or null if none found.
     */
    Scene.prototype.getGeometryByID = function (id) {
        for (var index = 0; index < this.geometries.length; index++) {
            if (this.geometries[index].id === id) {
                return this.geometries[index];
            }
        }
        return null;
    };
    Scene.prototype._getGeometryByUniqueID = function (uniqueId) {
        if (this.geometriesByUniqueId) {
            var index_1 = this.geometriesByUniqueId[uniqueId];
            if (index_1 !== undefined) {
                return this.geometries[index_1];
            }
        }
        else {
            for (var index = 0; index < this.geometries.length; index++) {
                if (this.geometries[index].uniqueId === uniqueId) {
                    return this.geometries[index];
                }
            }
        }
        return null;
    };
    /**
     * Add a new geometry to this scene
     * @param geometry defines the geometry to be added to the scene.
     * @param force defines if the geometry must be pushed even if a geometry with this id already exists
     * @return a boolean defining if the geometry was added or not
     */
    Scene.prototype.pushGeometry = function (geometry, force) {
        if (!force && this._getGeometryByUniqueID(geometry.uniqueId)) {
            return false;
        }
        this.addGeometry(geometry);
        this.onNewGeometryAddedObservable.notifyObservers(geometry);
        return true;
    };
    /**
     * Removes an existing geometry
     * @param geometry defines the geometry to be removed from the scene
     * @return a boolean defining if the geometry was removed or not
     */
    Scene.prototype.removeGeometry = function (geometry) {
        var index;
        if (this.geometriesByUniqueId) {
            index = this.geometriesByUniqueId[geometry.uniqueId];
            if (index === undefined) {
                return false;
            }
        }
        else {
            index = this.geometries.indexOf(geometry);
            if (index < 0) {
                return false;
            }
        }
        if (index !== this.geometries.length - 1) {
            var lastGeometry = this.geometries[this.geometries.length - 1];
            if (lastGeometry) {
                this.geometries[index] = lastGeometry;
                if (this.geometriesByUniqueId) {
                    this.geometriesByUniqueId[lastGeometry.uniqueId] = index;
                    this.geometriesByUniqueId[geometry.uniqueId] = undefined;
                }
            }
        }
        this.geometries.pop();
        this.onGeometryRemovedObservable.notifyObservers(geometry);
        return true;
    };
    /**
     * Gets the list of geometries attached to the scene
     * @returns an array of Geometry
     */
    Scene.prototype.getGeometries = function () {
        return this.geometries;
    };
    /**
     * Gets the first added mesh found of a given ID
     * @param id defines the id to search for
     * @return the mesh found or null if not found at all
     */
    Scene.prototype.getMeshByID = function (id) {
        for (var index = 0; index < this.meshes.length; index++) {
            if (this.meshes[index].id === id) {
                return this.meshes[index];
            }
        }
        return null;
    };
    /**
     * Gets a list of meshes using their id
     * @param id defines the id to search for
     * @returns a list of meshes
     */
    Scene.prototype.getMeshesByID = function (id) {
        return this.meshes.filter(function (m) {
            return m.id === id;
        });
    };
    /**
     * Gets the first added transform node found of a given ID
     * @param id defines the id to search for
     * @return the found transform node or null if not found at all.
     */
    Scene.prototype.getTransformNodeByID = function (id) {
        for (var index = 0; index < this.transformNodes.length; index++) {
            if (this.transformNodes[index].id === id) {
                return this.transformNodes[index];
            }
        }
        return null;
    };
    /**
     * Gets a transform node with its auto-generated unique id
     * @param uniqueId efines the unique id to search for
     * @return the found transform node or null if not found at all.
     */
    Scene.prototype.getTransformNodeByUniqueID = function (uniqueId) {
        for (var index = 0; index < this.transformNodes.length; index++) {
            if (this.transformNodes[index].uniqueId === uniqueId) {
                return this.transformNodes[index];
            }
        }
        return null;
    };
    /**
     * Gets a list of transform nodes using their id
     * @param id defines the id to search for
     * @returns a list of transform nodes
     */
    Scene.prototype.getTransformNodesByID = function (id) {
        return this.transformNodes.filter(function (m) {
            return m.id === id;
        });
    };
    /**
     * Gets a mesh with its auto-generated unique id
     * @param uniqueId defines the unique id to search for
     * @return the found mesh or null if not found at all.
     */
    Scene.prototype.getMeshByUniqueID = function (uniqueId) {
        for (var index = 0; index < this.meshes.length; index++) {
            if (this.meshes[index].uniqueId === uniqueId) {
                return this.meshes[index];
            }
        }
        return null;
    };
    /**
     * Gets a the last added mesh using a given id
     * @param id defines the id to search for
     * @return the found mesh or null if not found at all.
     */
    Scene.prototype.getLastMeshByID = function (id) {
        for (var index = this.meshes.length - 1; index >= 0; index--) {
            if (this.meshes[index].id === id) {
                return this.meshes[index];
            }
        }
        return null;
    };
    /**
     * Gets a the last added node (Mesh, Camera, Light) using a given id
     * @param id defines the id to search for
     * @return the found node or null if not found at all
     */
    Scene.prototype.getLastEntryByID = function (id) {
        var index;
        for (index = this.meshes.length - 1; index >= 0; index--) {
            if (this.meshes[index].id === id) {
                return this.meshes[index];
            }
        }
        for (index = this.transformNodes.length - 1; index >= 0; index--) {
            if (this.transformNodes[index].id === id) {
                return this.transformNodes[index];
            }
        }
        for (index = this.cameras.length - 1; index >= 0; index--) {
            if (this.cameras[index].id === id) {
                return this.cameras[index];
            }
        }
        for (index = this.lights.length - 1; index >= 0; index--) {
            if (this.lights[index].id === id) {
                return this.lights[index];
            }
        }
        return null;
    };
    /**
     * Gets a node (Mesh, Camera, Light) using a given id
     * @param id defines the id to search for
     * @return the found node or null if not found at all
     */
    Scene.prototype.getNodeByID = function (id) {
        var mesh = this.getMeshByID(id);
        if (mesh) {
            return mesh;
        }
        var transformNode = this.getTransformNodeByID(id);
        if (transformNode) {
            return transformNode;
        }
        var light = this.getLightByID(id);
        if (light) {
            return light;
        }
        var camera = this.getCameraByID(id);
        if (camera) {
            return camera;
        }
        var bone = this.getBoneByID(id);
        if (bone) {
            return bone;
        }
        return null;
    };
    /**
     * Gets a node (Mesh, Camera, Light) using a given name
     * @param name defines the name to search for
     * @return the found node or null if not found at all.
     */
    Scene.prototype.getNodeByName = function (name) {
        var mesh = this.getMeshByName(name);
        if (mesh) {
            return mesh;
        }
        var transformNode = this.getTransformNodeByName(name);
        if (transformNode) {
            return transformNode;
        }
        var light = this.getLightByName(name);
        if (light) {
            return light;
        }
        var camera = this.getCameraByName(name);
        if (camera) {
            return camera;
        }
        var bone = this.getBoneByName(name);
        if (bone) {
            return bone;
        }
        return null;
    };
    /**
     * Gets a mesh using a given name
     * @param name defines the name to search for
     * @return the found mesh or null if not found at all.
     */
    Scene.prototype.getMeshByName = function (name) {
        for (var index = 0; index < this.meshes.length; index++) {
            if (this.meshes[index].name === name) {
                return this.meshes[index];
            }
        }
        return null;
    };
    /**
     * Gets a transform node using a given name
     * @param name defines the name to search for
     * @return the found transform node or null if not found at all.
     */
    Scene.prototype.getTransformNodeByName = function (name) {
        for (var index = 0; index < this.transformNodes.length; index++) {
            if (this.transformNodes[index].name === name) {
                return this.transformNodes[index];
            }
        }
        return null;
    };
    /**
     * Gets a skeleton using a given id (if many are found, this function will pick the last one)
     * @param id defines the id to search for
     * @return the found skeleton or null if not found at all.
     */
    Scene.prototype.getLastSkeletonByID = function (id) {
        for (var index = this.skeletons.length - 1; index >= 0; index--) {
            if (this.skeletons[index].id === id) {
                return this.skeletons[index];
            }
        }
        return null;
    };
    /**
     * Gets a skeleton using a given auto generated unique id
     * @param  uniqueId defines the unique id to search for
     * @return the found skeleton or null if not found at all.
     */
    Scene.prototype.getSkeletonByUniqueId = function (uniqueId) {
        for (var index = 0; index < this.skeletons.length; index++) {
            if (this.skeletons[index].uniqueId === uniqueId) {
                return this.skeletons[index];
            }
        }
        return null;
    };
    /**
     * Gets a skeleton using a given id (if many are found, this function will pick the first one)
     * @param id defines the id to search for
     * @return the found skeleton or null if not found at all.
     */
    Scene.prototype.getSkeletonById = function (id) {
        for (var index = 0; index < this.skeletons.length; index++) {
            if (this.skeletons[index].id === id) {
                return this.skeletons[index];
            }
        }
        return null;
    };
    /**
     * Gets a skeleton using a given name
     * @param name defines the name to search for
     * @return the found skeleton or null if not found at all.
     */
    Scene.prototype.getSkeletonByName = function (name) {
        for (var index = 0; index < this.skeletons.length; index++) {
            if (this.skeletons[index].name === name) {
                return this.skeletons[index];
            }
        }
        return null;
    };
    /**
     * Gets a morph target manager  using a given id (if many are found, this function will pick the last one)
     * @param id defines the id to search for
     * @return the found morph target manager or null if not found at all.
     */
    Scene.prototype.getMorphTargetManagerById = function (id) {
        for (var index = 0; index < this.morphTargetManagers.length; index++) {
            if (this.morphTargetManagers[index].uniqueId === id) {
                return this.morphTargetManagers[index];
            }
        }
        return null;
    };
    /**
     * Gets a morph target using a given id (if many are found, this function will pick the first one)
     * @param id defines the id to search for
     * @return the found morph target or null if not found at all.
     */
    Scene.prototype.getMorphTargetById = function (id) {
        for (var managerIndex = 0; managerIndex < this.morphTargetManagers.length; ++managerIndex) {
            var morphTargetManager = this.morphTargetManagers[managerIndex];
            for (var index = 0; index < morphTargetManager.numTargets; ++index) {
                var target = morphTargetManager.getTarget(index);
                if (target.id === id) {
                    return target;
                }
            }
        }
        return null;
    };
    /**
     * Gets a morph target using a given name (if many are found, this function will pick the first one)
     * @param name defines the name to search for
     * @return the found morph target or null if not found at all.
     */
    Scene.prototype.getMorphTargetByName = function (name) {
        for (var managerIndex = 0; managerIndex < this.morphTargetManagers.length; ++managerIndex) {
            var morphTargetManager = this.morphTargetManagers[managerIndex];
            for (var index = 0; index < morphTargetManager.numTargets; ++index) {
                var target = morphTargetManager.getTarget(index);
                if (target.name === name) {
                    return target;
                }
            }
        }
        return null;
    };
    /**
     * Gets a post process using a given name (if many are found, this function will pick the first one)
     * @param name defines the name to search for
     * @return the found post process or null if not found at all.
     */
    Scene.prototype.getPostProcessByName = function (name) {
        for (var postProcessIndex = 0; postProcessIndex < this.postProcesses.length; ++postProcessIndex) {
            var postProcess = this.postProcesses[postProcessIndex];
            if (postProcess.name === name) {
                return postProcess;
            }
        }
        return null;
    };
    /**
     * Gets a boolean indicating if the given mesh is active
     * @param mesh defines the mesh to look for
     * @returns true if the mesh is in the active list
     */
    Scene.prototype.isActiveMesh = function (mesh) {
        return (this._activeMeshes.indexOf(mesh) !== -1);
    };
    Object.defineProperty(Scene.prototype, "uid", {
        /**
         * Return a unique id as a string which can serve as an identifier for the scene
         */
        get: function () {
            if (!this._uid) {
                this._uid = Tools.RandomId();
            }
            return this._uid;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Add an externaly attached data from its key.
     * This method call will fail and return false, if such key already exists.
     * If you don't care and just want to get the data no matter what, use the more convenient getOrAddExternalDataWithFactory() method.
     * @param key the unique key that identifies the data
     * @param data the data object to associate to the key for this Engine instance
     * @return true if no such key were already present and the data was added successfully, false otherwise
     */
    Scene.prototype.addExternalData = function (key, data) {
        if (!this._externalData) {
            this._externalData = new StringDictionary();
        }
        return this._externalData.add(key, data);
    };
    /**
     * Get an externaly attached data from its key
     * @param key the unique key that identifies the data
     * @return the associated data, if present (can be null), or undefined if not present
     */
    Scene.prototype.getExternalData = function (key) {
        if (!this._externalData) {
            return null;
        }
        return this._externalData.get(key);
    };
    /**
     * Get an externaly attached data from its key, create it using a factory if it's not already present
     * @param key the unique key that identifies the data
     * @param factory the factory that will be called to create the instance if and only if it doesn't exists
     * @return the associated data, can be null if the factory returned null.
     */
    Scene.prototype.getOrAddExternalDataWithFactory = function (key, factory) {
        if (!this._externalData) {
            this._externalData = new StringDictionary();
        }
        return this._externalData.getOrAddWithFactory(key, factory);
    };
    /**
     * Remove an externaly attached data from the Engine instance
     * @param key the unique key that identifies the data
     * @return true if the data was successfully removed, false if it doesn't exist
     */
    Scene.prototype.removeExternalData = function (key) {
        return this._externalData.remove(key);
    };
    Scene.prototype._evaluateSubMesh = function (subMesh, mesh, initialMesh) {
        if (initialMesh.hasInstances || initialMesh.isAnInstance || this.dispatchAllSubMeshesOfActiveMeshes || this._skipFrustumClipping || mesh.alwaysSelectAsActiveMesh || mesh.subMeshes.length === 1 || subMesh.isInFrustum(this._frustumPlanes)) {
            for (var _i = 0, _a = this._evaluateSubMeshStage; _i < _a.length; _i++) {
                var step = _a[_i];
                step.action(mesh, subMesh);
            }
            var material = subMesh.getMaterial();
            if (material !== null && material !== undefined) {
                // Render targets
                if (material.hasRenderTargetTextures && material.getRenderTargetTextures != null) {
                    if (this._processedMaterials.indexOf(material) === -1) {
                        this._processedMaterials.push(material);
                        this._renderTargets.concatWithNoDuplicate(material.getRenderTargetTextures());
                    }
                }
                // Dispatch
                this._renderingManager.dispatch(subMesh, mesh, material);
            }
        }
    };
    /**
     * Clear the processed materials smart array preventing retention point in material dispose.
     */
    Scene.prototype.freeProcessedMaterials = function () {
        this._processedMaterials.dispose();
    };
    Object.defineProperty(Scene.prototype, "blockfreeActiveMeshesAndRenderingGroups", {
        /** Gets or sets a boolean blocking all the calls to freeActiveMeshes and freeRenderingGroups
         * It can be used in order to prevent going through methods freeRenderingGroups and freeActiveMeshes several times to improve performance
         * when disposing several meshes in a row or a hierarchy of meshes.
         * When used, it is the responsability of the user to blockfreeActiveMeshesAndRenderingGroups back to false.
         */
        get: function () {
            return this._preventFreeActiveMeshesAndRenderingGroups;
        },
        set: function (value) {
            if (this._preventFreeActiveMeshesAndRenderingGroups === value) {
                return;
            }
            if (value) {
                this.freeActiveMeshes();
                this.freeRenderingGroups();
            }
            this._preventFreeActiveMeshesAndRenderingGroups = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clear the active meshes smart array preventing retention point in mesh dispose.
     */
    Scene.prototype.freeActiveMeshes = function () {
        if (this.blockfreeActiveMeshesAndRenderingGroups) {
            return;
        }
        this._activeMeshes.dispose();
        if (this.activeCamera && this.activeCamera._activeMeshes) {
            this.activeCamera._activeMeshes.dispose();
        }
        if (this.activeCameras) {
            for (var i = 0; i < this.activeCameras.length; i++) {
                var activeCamera = this.activeCameras[i];
                if (activeCamera && activeCamera._activeMeshes) {
                    activeCamera._activeMeshes.dispose();
                }
            }
        }
    };
    /**
     * Clear the info related to rendering groups preventing retention points during dispose.
     */
    Scene.prototype.freeRenderingGroups = function () {
        if (this.blockfreeActiveMeshesAndRenderingGroups) {
            return;
        }
        if (this._renderingManager) {
            this._renderingManager.freeRenderingGroups();
        }
        if (this.textures) {
            for (var i = 0; i < this.textures.length; i++) {
                var texture = this.textures[i];
                if (texture && texture.renderList) {
                    texture.freeRenderingGroups();
                }
            }
        }
    };
    /** @hidden */
    Scene.prototype._isInIntermediateRendering = function () {
        return this._intermediateRendering;
    };
    /**
     * Use this function to stop evaluating active meshes. The current list will be keep alive between frames
     * @param skipEvaluateActiveMeshes defines an optional boolean indicating that the evaluate active meshes step must be completely skipped
     * @param onSuccess optional success callback
     * @param onError optional error callback
     * @returns the current scene
     */
    Scene.prototype.freezeActiveMeshes = function (skipEvaluateActiveMeshes, onSuccess, onError) {
        var _this = this;
        if (skipEvaluateActiveMeshes === void 0) { skipEvaluateActiveMeshes = false; }
        this.executeWhenReady(function () {
            if (!_this.activeCamera) {
                onError && onError('No active camera found');
                return;
            }
            if (!_this._frustumPlanes) {
                _this.setTransformMatrix(_this.activeCamera.getViewMatrix(), _this.activeCamera.getProjectionMatrix());
            }
            _this._evaluateActiveMeshes();
            _this._activeMeshesFrozen = true;
            _this._skipEvaluateActiveMeshesCompletely = skipEvaluateActiveMeshes;
            for (var index = 0; index < _this._activeMeshes.length; index++) {
                _this._activeMeshes.data[index]._freeze();
            }
            onSuccess && onSuccess();
        });
        return this;
    };
    /**
     * Use this function to restart evaluating active meshes on every frame
     * @returns the current scene
     */
    Scene.prototype.unfreezeActiveMeshes = function () {
        for (var index = 0; index < this.meshes.length; index++) {
            var mesh = this.meshes[index];
            if (mesh._internalAbstractMeshDataInfo) {
                mesh._internalAbstractMeshDataInfo._isActive = false;
            }
        }
        for (var index = 0; index < this._activeMeshes.length; index++) {
            this._activeMeshes.data[index]._unFreeze();
        }
        this._activeMeshesFrozen = false;
        return this;
    };
    Scene.prototype._evaluateActiveMeshes = function () {
        if (this._activeMeshesFrozen && this._activeMeshes.length) {
            if (!this._skipEvaluateActiveMeshesCompletely) {
                var len_1 = this._activeMeshes.length;
                for (var i = 0; i < len_1; i++) {
                    var mesh = this._activeMeshes.data[i];
                    mesh.computeWorldMatrix();
                }
            }
            if (this._activeParticleSystems) {
                var psLength = this._activeParticleSystems.length;
                for (var i = 0; i < psLength; i++) {
                    this._activeParticleSystems.data[i].animate();
                }
            }
            return;
        }
        if (!this.activeCamera) {
            return;
        }
        this.onBeforeActiveMeshesEvaluationObservable.notifyObservers(this);
        this.activeCamera._activeMeshes.reset();
        this._activeMeshes.reset();
        this._renderingManager.reset();
        this._processedMaterials.reset();
        this._activeParticleSystems.reset();
        this._activeSkeletons.reset();
        this._softwareSkinnedMeshes.reset();
        for (var _i = 0, _a = this._beforeEvaluateActiveMeshStage; _i < _a.length; _i++) {
            var step = _a[_i];
            step.action();
        }
        // Determine mesh candidates
        var meshes = this.getActiveMeshCandidates();
        // Check each mesh
        var len = meshes.length;
        for (var i = 0; i < len; i++) {
            var mesh = meshes.data[i];
            mesh._internalAbstractMeshDataInfo._currentLODIsUpToDate = false;
            if (mesh.isBlocked) {
                continue;
            }
            this._totalVertices.addCount(mesh.getTotalVertices(), false);
            if (!mesh.isReady() || !mesh.isEnabled() || mesh.scaling.lengthSquared() === 0) {
                continue;
            }
            mesh.computeWorldMatrix();
            // Intersections
            if (mesh.actionManager && mesh.actionManager.hasSpecificTriggers2(12, 13)) {
                this._meshesForIntersections.pushNoDuplicate(mesh);
            }
            // Switch to current LOD
            var meshToRender = this.customLODSelector ? this.customLODSelector(mesh, this.activeCamera) : mesh.getLOD(this.activeCamera);
            mesh._internalAbstractMeshDataInfo._currentLOD = meshToRender;
            mesh._internalAbstractMeshDataInfo._currentLODIsUpToDate = true;
            if (meshToRender === undefined || meshToRender === null) {
                continue;
            }
            // Compute world matrix if LOD is billboard
            if (meshToRender !== mesh && meshToRender.billboardMode !== TransformNode.BILLBOARDMODE_NONE) {
                meshToRender.computeWorldMatrix();
            }
            mesh._preActivate();
            if (mesh.isVisible && mesh.visibility > 0 && ((mesh.layerMask & this.activeCamera.layerMask) !== 0) && (this._skipFrustumClipping || mesh.alwaysSelectAsActiveMesh || mesh.isInFrustum(this._frustumPlanes))) {
                this._activeMeshes.push(mesh);
                this.activeCamera._activeMeshes.push(mesh);
                if (meshToRender !== mesh) {
                    meshToRender._activate(this._renderId, false);
                }
                for (var _b = 0, _c = this._preActiveMeshStage; _b < _c.length; _b++) {
                    var step = _c[_b];
                    step.action(mesh);
                }
                if (mesh._activate(this._renderId, false)) {
                    if (!mesh.isAnInstance) {
                        meshToRender._internalAbstractMeshDataInfo._onlyForInstances = false;
                    }
                    else {
                        if (mesh._internalAbstractMeshDataInfo._actAsRegularMesh) {
                            meshToRender = mesh;
                        }
                    }
                    meshToRender._internalAbstractMeshDataInfo._isActive = true;
                    this._activeMesh(mesh, meshToRender);
                }
                mesh._postActivate();
            }
        }
        this.onAfterActiveMeshesEvaluationObservable.notifyObservers(this);
        // Particle systems
        if (this.particlesEnabled) {
            this.onBeforeParticlesRenderingObservable.notifyObservers(this);
            for (var particleIndex = 0; particleIndex < this.particleSystems.length; particleIndex++) {
                var particleSystem = this.particleSystems[particleIndex];
                if (!particleSystem.isStarted() || !particleSystem.emitter) {
                    continue;
                }
                var emitter = particleSystem.emitter;
                if (!emitter.position || emitter.isEnabled()) {
                    this._activeParticleSystems.push(particleSystem);
                    particleSystem.animate();
                    this._renderingManager.dispatchParticles(particleSystem);
                }
            }
            this.onAfterParticlesRenderingObservable.notifyObservers(this);
        }
    };
    Scene.prototype._activeMesh = function (sourceMesh, mesh) {
        if (this._skeletonsEnabled && mesh.skeleton !== null && mesh.skeleton !== undefined) {
            if (this._activeSkeletons.pushNoDuplicate(mesh.skeleton)) {
                mesh.skeleton.prepare();
            }
            if (!mesh.computeBonesUsingShaders) {
                this._softwareSkinnedMeshes.pushNoDuplicate(mesh);
            }
        }
        if (mesh !== undefined && mesh !== null
            && mesh.subMeshes !== undefined && mesh.subMeshes !== null && mesh.subMeshes.length > 0) {
            var subMeshes = this.getActiveSubMeshCandidates(mesh);
            var len = subMeshes.length;
            for (var i = 0; i < len; i++) {
                var subMesh = subMeshes.data[i];
                this._evaluateSubMesh(subMesh, mesh, sourceMesh);
            }
        }
    };
    /**
     * Update the transform matrix to update from the current active camera
     * @param force defines a boolean used to force the update even if cache is up to date
     */
    Scene.prototype.updateTransformMatrix = function (force) {
        if (!this.activeCamera) {
            return;
        }
        this.setTransformMatrix(this.activeCamera.getViewMatrix(), this.activeCamera.getProjectionMatrix(force));
    };
    Scene.prototype._bindFrameBuffer = function () {
        if (this.activeCamera && this.activeCamera._multiviewTexture) {
            this.activeCamera._multiviewTexture._bindFrameBuffer();
        }
        else if (this.activeCamera && this.activeCamera.outputRenderTarget) {
            var useMultiview = this.getEngine().getCaps().multiview && this.activeCamera.outputRenderTarget && this.activeCamera.outputRenderTarget.getViewCount() > 1;
            if (useMultiview) {
                this.activeCamera.outputRenderTarget._bindFrameBuffer();
            }
            else {
                var internalTexture = this.activeCamera.outputRenderTarget.getInternalTexture();
                if (internalTexture) {
                    this.getEngine().bindFramebuffer(internalTexture);
                }
                else {
                    Logger.Error("Camera contains invalid customDefaultRenderTarget");
                }
            }
        }
        else {
            this.getEngine().restoreDefaultFramebuffer(); // Restore back buffer if needed
        }
    };
    /** @hidden */
    Scene.prototype._renderForCamera = function (camera, rigParent) {
        if (camera && camera._skipRendering) {
            return;
        }
        var engine = this._engine;
        // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged
        this._activeCamera = camera;
        if (!this.activeCamera) {
            throw new Error("Active camera not set");
        }
        // Viewport
        engine.setViewport(this.activeCamera.viewport);
        // Camera
        this.resetCachedMaterial();
        this._renderId++;
        var useMultiview = this.getEngine().getCaps().multiview && camera.outputRenderTarget && camera.outputRenderTarget.getViewCount() > 1;
        if (useMultiview) {
            this.setTransformMatrix(camera._rigCameras[0].getViewMatrix(), camera._rigCameras[0].getProjectionMatrix(), camera._rigCameras[1].getViewMatrix(), camera._rigCameras[1].getProjectionMatrix());
        }
        else {
            this.updateTransformMatrix();
        }
        this.onBeforeCameraRenderObservable.notifyObservers(this.activeCamera);
        // Meshes
        this._evaluateActiveMeshes();
        // Software skinning
        for (var softwareSkinnedMeshIndex = 0; softwareSkinnedMeshIndex < this._softwareSkinnedMeshes.length; softwareSkinnedMeshIndex++) {
            var mesh = this._softwareSkinnedMeshes.data[softwareSkinnedMeshIndex];
            mesh.applySkeleton(mesh.skeleton);
        }
        // Render targets
        this.onBeforeRenderTargetsRenderObservable.notifyObservers(this);
        if (camera.customRenderTargets && camera.customRenderTargets.length > 0) {
            this._renderTargets.concatWithNoDuplicate(camera.customRenderTargets);
        }
        if (rigParent && rigParent.customRenderTargets && rigParent.customRenderTargets.length > 0) {
            this._renderTargets.concatWithNoDuplicate(rigParent.customRenderTargets);
        }
        // Collects render targets from external components.
        for (var _i = 0, _a = this._gatherActiveCameraRenderTargetsStage; _i < _a.length; _i++) {
            var step = _a[_i];
            step.action(this._renderTargets);
        }
        var needRebind = false;
        if (this.renderTargetsEnabled) {
            this._intermediateRendering = true;
            if (this._renderTargets.length > 0) {
                Tools.StartPerformanceCounter("Render targets", this._renderTargets.length > 0);
                for (var renderIndex = 0; renderIndex < this._renderTargets.length; renderIndex++) {
                    var renderTarget = this._renderTargets.data[renderIndex];
                    if (renderTarget._shouldRender()) {
                        this._renderId++;
                        var hasSpecialRenderTargetCamera = renderTarget.activeCamera && renderTarget.activeCamera !== this.activeCamera;
                        renderTarget.render(hasSpecialRenderTargetCamera, this.dumpNextRenderTargets);
                        needRebind = true;
                    }
                }
                Tools.EndPerformanceCounter("Render targets", this._renderTargets.length > 0);
                this._renderId++;
            }
            for (var _b = 0, _c = this._cameraDrawRenderTargetStage; _b < _c.length; _b++) {
                var step = _c[_b];
                needRebind = step.action(this.activeCamera) || needRebind;
            }
            this._intermediateRendering = false;
            // Need to bind if sub-camera has an outputRenderTarget eg. for webXR
            if (this.activeCamera && this.activeCamera.outputRenderTarget) {
                needRebind = true;
            }
        }
        // Restore framebuffer after rendering to targets
        if (needRebind && !this.prePass) {
            this._bindFrameBuffer();
        }
        this.onAfterRenderTargetsRenderObservable.notifyObservers(this);
        // Prepare Frame
        if (this.postProcessManager && !camera._multiviewTexture && !this.prePass) {
            this.postProcessManager._prepareFrame();
        }
        // Before Camera Draw
        for (var _d = 0, _e = this._beforeCameraDrawStage; _d < _e.length; _d++) {
            var step = _e[_d];
            step.action(this.activeCamera);
        }
        // Render
        this.onBeforeDrawPhaseObservable.notifyObservers(this);
        this._renderingManager.render(null, null, true, true);
        this.onAfterDrawPhaseObservable.notifyObservers(this);
        // After Camera Draw
        for (var _f = 0, _g = this._afterCameraDrawStage; _f < _g.length; _f++) {
            var step = _g[_f];
            step.action(this.activeCamera);
        }
        // Finalize frame
        if (this.postProcessManager && !camera._multiviewTexture) {
            // if the camera has an output render target, render the post process to the render target
            var texture = camera.outputRenderTarget ? camera.outputRenderTarget.getInternalTexture() : undefined;
            this.postProcessManager._finalizeFrame(camera.isIntermediate, texture);
        }
        // Reset some special arrays
        this._renderTargets.reset();
        this.onAfterCameraRenderObservable.notifyObservers(this.activeCamera);
    };
    Scene.prototype._processSubCameras = function (camera) {
        if (camera.cameraRigMode === Camera.RIG_MODE_NONE || (camera.outputRenderTarget && camera.outputRenderTarget.getViewCount() > 1 && this.getEngine().getCaps().multiview)) {
            this._renderForCamera(camera);
            this.onAfterRenderCameraObservable.notifyObservers(camera);
            return;
        }
        if (camera._useMultiviewToSingleView) {
            this._renderMultiviewToSingleView(camera);
        }
        else {
            // rig cameras
            for (var index = 0; index < camera._rigCameras.length; index++) {
                this._renderForCamera(camera._rigCameras[index], camera);
            }
        }
        // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged
        this._activeCamera = camera;
        this.setTransformMatrix(this._activeCamera.getViewMatrix(), this._activeCamera.getProjectionMatrix());
        this.onAfterRenderCameraObservable.notifyObservers(camera);
    };
    Scene.prototype._checkIntersections = function () {
        for (var index = 0; index < this._meshesForIntersections.length; index++) {
            var sourceMesh = this._meshesForIntersections.data[index];
            if (!sourceMesh.actionManager) {
                continue;
            }
            for (var actionIndex = 0; sourceMesh.actionManager && actionIndex < sourceMesh.actionManager.actions.length; actionIndex++) {
                var action = sourceMesh.actionManager.actions[actionIndex];
                if (action.trigger === 12 || action.trigger === 13) {
                    var parameters = action.getTriggerParameter();
                    var otherMesh = parameters instanceof AbstractMesh ? parameters : parameters.mesh;
                    var areIntersecting = otherMesh.intersectsMesh(sourceMesh, parameters.usePreciseIntersection);
                    var currentIntersectionInProgress = sourceMesh._intersectionsInProgress.indexOf(otherMesh);
                    if (areIntersecting && currentIntersectionInProgress === -1) {
                        if (action.trigger === 12) {
                            action._executeCurrent(ActionEvent.CreateNew(sourceMesh, undefined, otherMesh));
                            sourceMesh._intersectionsInProgress.push(otherMesh);
                        }
                        else if (action.trigger === 13) {
                            sourceMesh._intersectionsInProgress.push(otherMesh);
                        }
                    }
                    else if (!areIntersecting && currentIntersectionInProgress > -1) {
                        //They intersected, and now they don't.
                        //is this trigger an exit trigger? execute an event.
                        if (action.trigger === 13) {
                            action._executeCurrent(ActionEvent.CreateNew(sourceMesh, undefined, otherMesh));
                        }
                        //if this is an exit trigger, or no exit trigger exists, remove the id from the intersection in progress array.
                        if (!sourceMesh.actionManager.hasSpecificTrigger(13, function (parameter) {
                            var parameterMesh = parameter instanceof AbstractMesh ? parameter : parameter.mesh;
                            return otherMesh === parameterMesh;
                        }) || action.trigger === 13) {
                            sourceMesh._intersectionsInProgress.splice(currentIntersectionInProgress, 1);
                        }
                    }
                }
            }
        }
    };
    /** @hidden */
    Scene.prototype._advancePhysicsEngineStep = function (step) {
        // Do nothing. Code will be replaced if physics engine component is referenced
    };
    /** @hidden */
    Scene.prototype._animate = function () {
        // Nothing to do as long as Animatable have not been imported.
    };
    /** Execute all animations (for a frame) */
    Scene.prototype.animate = function () {
        if (this._engine.isDeterministicLockStep()) {
            var deltaTime = Math.max(Scene.MinDeltaTime, Math.min(this._engine.getDeltaTime(), Scene.MaxDeltaTime)) + this._timeAccumulator;
            var defaultFrameTime = this._engine.getTimeStep();
            var defaultFPS = (1000.0 / defaultFrameTime) / 1000.0;
            var stepsTaken = 0;
            var maxSubSteps = this._engine.getLockstepMaxSteps();
            var internalSteps = Math.floor(deltaTime / defaultFrameTime);
            internalSteps = Math.min(internalSteps, maxSubSteps);
            while (deltaTime > 0 && stepsTaken < internalSteps) {
                this.onBeforeStepObservable.notifyObservers(this);
                // Animations
                this._animationRatio = defaultFrameTime * defaultFPS;
                this._animate();
                this.onAfterAnimationsObservable.notifyObservers(this);
                // Physics
                if (this.physicsEnabled) {
                    this._advancePhysicsEngineStep(defaultFrameTime);
                }
                this.onAfterStepObservable.notifyObservers(this);
                this._currentStepId++;
                stepsTaken++;
                deltaTime -= defaultFrameTime;
            }
            this._timeAccumulator = deltaTime < 0 ? 0 : deltaTime;
        }
        else {
            // Animations
            var deltaTime = this.useConstantAnimationDeltaTime ? 16 : Math.max(Scene.MinDeltaTime, Math.min(this._engine.getDeltaTime(), Scene.MaxDeltaTime));
            this._animationRatio = deltaTime * (60.0 / 1000.0);
            this._animate();
            this.onAfterAnimationsObservable.notifyObservers(this);
            // Physics
            if (this.physicsEnabled) {
                this._advancePhysicsEngineStep(deltaTime);
            }
        }
    };
    /**
     * Render the scene
     * @param updateCameras defines a boolean indicating if cameras must update according to their inputs (true by default)
     * @param ignoreAnimations defines a boolean indicating if animations should not be executed (false by default)
     */
    Scene.prototype.render = function (updateCameras, ignoreAnimations) {
        if (updateCameras === void 0) { updateCameras = true; }
        if (ignoreAnimations === void 0) { ignoreAnimations = false; }
        if (this.isDisposed) {
            return;
        }
        if (this.onReadyObservable.hasObservers() && this._executeWhenReadyTimeoutId === -1) {
            this._checkIsReady();
        }
        this._frameId++;
        // Register components that have been associated lately to the scene.
        this._registerTransientComponents();
        this._activeParticles.fetchNewFrame();
        this._totalVertices.fetchNewFrame();
        this._activeIndices.fetchNewFrame();
        this._activeBones.fetchNewFrame();
        this._meshesForIntersections.reset();
        this.resetCachedMaterial();
        this.onBeforeAnimationsObservable.notifyObservers(this);
        // Actions
        if (this.actionManager) {
            this.actionManager.processTrigger(11);
        }
        // Animations
        if (!ignoreAnimations) {
            this.animate();
        }
        // Before camera update steps
        for (var _i = 0, _a = this._beforeCameraUpdateStage; _i < _a.length; _i++) {
            var step = _a[_i];
            step.action();
        }
        // Update Cameras
        if (updateCameras) {
            if (this.activeCameras && this.activeCameras.length > 0) {
                for (var cameraIndex = 0; cameraIndex < this.activeCameras.length; cameraIndex++) {
                    var camera = this.activeCameras[cameraIndex];
                    camera.update();
                    if (camera.cameraRigMode !== Camera.RIG_MODE_NONE) {
                        // rig cameras
                        for (var index = 0; index < camera._rigCameras.length; index++) {
                            camera._rigCameras[index].update();
                        }
                    }
                }
            }
            else if (this.activeCamera) {
                this.activeCamera.update();
                if (this.activeCamera.cameraRigMode !== Camera.RIG_MODE_NONE) {
                    // rig cameras
                    for (var index = 0; index < this.activeCamera._rigCameras.length; index++) {
                        this.activeCamera._rigCameras[index].update();
                    }
                }
            }
        }
        // Before render
        this.onBeforeRenderObservable.notifyObservers(this);
        // Customs render targets
        this.onBeforeRenderTargetsRenderObservable.notifyObservers(this);
        var engine = this.getEngine();
        var currentActiveCamera = this.activeCamera;
        if (this.renderTargetsEnabled) {
            Tools.StartPerformanceCounter("Custom render targets", this.customRenderTargets.length > 0);
            this._intermediateRendering = true;
            for (var customIndex = 0; customIndex < this.customRenderTargets.length; customIndex++) {
                var renderTarget = this.customRenderTargets[customIndex];
                if (renderTarget._shouldRender()) {
                    this._renderId++;
                    this.activeCamera = renderTarget.activeCamera || this.activeCamera;
                    if (!this.activeCamera) {
                        throw new Error("Active camera not set");
                    }
                    // Viewport
                    engine.setViewport(this.activeCamera.viewport);
                    // Camera
                    this.updateTransformMatrix();
                    renderTarget.render(currentActiveCamera !== this.activeCamera, this.dumpNextRenderTargets);
                }
            }
            Tools.EndPerformanceCounter("Custom render targets", this.customRenderTargets.length > 0);
            this._intermediateRendering = false;
            this._renderId++;
        }
        // Restore back buffer
        this.activeCamera = currentActiveCamera;
        if (this._activeCamera && this._activeCamera.cameraRigMode !== Camera.RIG_MODE_CUSTOM && !this.prePass) {
            this._bindFrameBuffer();
        }
        this.onAfterRenderTargetsRenderObservable.notifyObservers(this);
        for (var _b = 0, _c = this._beforeClearStage; _b < _c.length; _b++) {
            var step = _c[_b];
            step.action();
        }
        // Clear
        if ((this.autoClearDepthAndStencil || this.autoClear) && !this.prePass) {
            this._engine.clear(this.clearColor, this.autoClear || this.forceWireframe || this.forcePointsCloud, this.autoClearDepthAndStencil, this.autoClearDepthAndStencil);
        }
        // Collects render targets from external components.
        for (var _d = 0, _e = this._gatherRenderTargetsStage; _d < _e.length; _d++) {
            var step = _e[_d];
            step.action(this._renderTargets);
        }
        // Multi-cameras?
        if (this.activeCameras && this.activeCameras.length > 0) {
            for (var cameraIndex = 0; cameraIndex < this.activeCameras.length; cameraIndex++) {
                if (cameraIndex > 0) {
                    this._engine.clear(null, false, true, true);
                }
                this._processSubCameras(this.activeCameras[cameraIndex]);
            }
        }
        else {
            if (!this.activeCamera) {
                throw new Error("No camera defined");
            }
            this._processSubCameras(this.activeCamera);
        }
        // Intersection checks
        this._checkIntersections();
        // Executes the after render stage actions.
        for (var _f = 0, _g = this._afterRenderStage; _f < _g.length; _f++) {
            var step = _g[_f];
            step.action();
        }
        // After render
        if (this.afterRender) {
            this.afterRender();
        }
        this.onAfterRenderObservable.notifyObservers(this);
        // Cleaning
        if (this._toBeDisposed.length) {
            for (var index = 0; index < this._toBeDisposed.length; index++) {
                var data = this._toBeDisposed[index];
                if (data) {
                    data.dispose();
                }
            }
            this._toBeDisposed = [];
        }
        if (this.dumpNextRenderTargets) {
            this.dumpNextRenderTargets = false;
        }
        this._activeBones.addCount(0, true);
        this._activeIndices.addCount(0, true);
        this._activeParticles.addCount(0, true);
    };
    /**
     * Freeze all materials
     * A frozen material will not be updatable but should be faster to render
     */
    Scene.prototype.freezeMaterials = function () {
        for (var i = 0; i < this.materials.length; i++) {
            this.materials[i].freeze();
        }
    };
    /**
     * Unfreeze all materials
     * A frozen material will not be updatable but should be faster to render
     */
    Scene.prototype.unfreezeMaterials = function () {
        for (var i = 0; i < this.materials.length; i++) {
            this.materials[i].unfreeze();
        }
    };
    /**
     * Releases all held ressources
     */
    Scene.prototype.dispose = function () {
        this.beforeRender = null;
        this.afterRender = null;
        if (EngineStore._LastCreatedScene === this) {
            EngineStore._LastCreatedScene = null;
        }
        this.skeletons = [];
        this.morphTargetManagers = [];
        this._transientComponents = [];
        this._isReadyForMeshStage.clear();
        this._beforeEvaluateActiveMeshStage.clear();
        this._evaluateSubMeshStage.clear();
        this._preActiveMeshStage.clear();
        this._cameraDrawRenderTargetStage.clear();
        this._beforeCameraDrawStage.clear();
        this._beforeRenderTargetDrawStage.clear();
        this._beforeRenderingGroupDrawStage.clear();
        this._beforeRenderingMeshStage.clear();
        this._afterRenderingMeshStage.clear();
        this._afterRenderingGroupDrawStage.clear();
        this._afterCameraDrawStage.clear();
        this._afterRenderTargetDrawStage.clear();
        this._afterRenderStage.clear();
        this._beforeCameraUpdateStage.clear();
        this._beforeClearStage.clear();
        this._gatherRenderTargetsStage.clear();
        this._gatherActiveCameraRenderTargetsStage.clear();
        this._pointerMoveStage.clear();
        this._pointerDownStage.clear();
        this._pointerUpStage.clear();
        for (var _i = 0, _a = this._components; _i < _a.length; _i++) {
            var component = _a[_i];
            component.dispose();
        }
        this.importedMeshesFiles = new Array();
        if (this.stopAllAnimations) {
            this.stopAllAnimations();
        }
        this.resetCachedMaterial();
        // Smart arrays
        if (this.activeCamera) {
            this.activeCamera._activeMeshes.dispose();
            this.activeCamera = null;
        }
        this._activeMeshes.dispose();
        this._renderingManager.dispose();
        this._processedMaterials.dispose();
        this._activeParticleSystems.dispose();
        this._activeSkeletons.dispose();
        this._softwareSkinnedMeshes.dispose();
        this._renderTargets.dispose();
        this._registeredForLateAnimationBindings.dispose();
        this._meshesForIntersections.dispose();
        this._toBeDisposed = [];
        // Abort active requests
        for (var _b = 0, _c = this._activeRequests; _b < _c.length; _b++) {
            var request = _c[_b];
            request.abort();
        }
        // Events
        this.onDisposeObservable.notifyObservers(this);
        this.onDisposeObservable.clear();
        this.onBeforeRenderObservable.clear();
        this.onAfterRenderObservable.clear();
        this.onBeforeRenderTargetsRenderObservable.clear();
        this.onAfterRenderTargetsRenderObservable.clear();
        this.onAfterStepObservable.clear();
        this.onBeforeStepObservable.clear();
        this.onBeforeActiveMeshesEvaluationObservable.clear();
        this.onAfterActiveMeshesEvaluationObservable.clear();
        this.onBeforeParticlesRenderingObservable.clear();
        this.onAfterParticlesRenderingObservable.clear();
        this.onBeforeDrawPhaseObservable.clear();
        this.onAfterDrawPhaseObservable.clear();
        this.onBeforeAnimationsObservable.clear();
        this.onAfterAnimationsObservable.clear();
        this.onDataLoadedObservable.clear();
        this.onBeforeRenderingGroupObservable.clear();
        this.onAfterRenderingGroupObservable.clear();
        this.onMeshImportedObservable.clear();
        this.onBeforeCameraRenderObservable.clear();
        this.onAfterCameraRenderObservable.clear();
        this.onReadyObservable.clear();
        this.onNewCameraAddedObservable.clear();
        this.onCameraRemovedObservable.clear();
        this.onNewLightAddedObservable.clear();
        this.onLightRemovedObservable.clear();
        this.onNewGeometryAddedObservable.clear();
        this.onGeometryRemovedObservable.clear();
        this.onNewTransformNodeAddedObservable.clear();
        this.onTransformNodeRemovedObservable.clear();
        this.onNewMeshAddedObservable.clear();
        this.onMeshRemovedObservable.clear();
        this.onNewSkeletonAddedObservable.clear();
        this.onSkeletonRemovedObservable.clear();
        this.onNewMaterialAddedObservable.clear();
        this.onNewMultiMaterialAddedObservable.clear();
        this.onMaterialRemovedObservable.clear();
        this.onMultiMaterialRemovedObservable.clear();
        this.onNewTextureAddedObservable.clear();
        this.onTextureRemovedObservable.clear();
        this.onPrePointerObservable.clear();
        this.onPointerObservable.clear();
        this.onPreKeyboardObservable.clear();
        this.onKeyboardObservable.clear();
        this.onActiveCameraChanged.clear();
        this.detachControl();
        // Detach cameras
        var canvas = this._engine.getInputElement();
        if (canvas) {
            var index;
            for (index = 0; index < this.cameras.length; index++) {
                this.cameras[index].detachControl();
            }
        }
        // Release animation groups
        while (this.animationGroups.length) {
            this.animationGroups[0].dispose();
        }
        // Release lights
        while (this.lights.length) {
            this.lights[0].dispose();
        }
        // Release meshes
        while (this.meshes.length) {
            this.meshes[0].dispose(true);
        }
        while (this.transformNodes.length) {
            this.transformNodes[0].dispose(true);
        }
        // Release cameras
        while (this.cameras.length) {
            this.cameras[0].dispose();
        }
        // Release materials
        if (this._defaultMaterial) {
            this._defaultMaterial.dispose();
        }
        while (this.multiMaterials.length) {
            this.multiMaterials[0].dispose();
        }
        while (this.materials.length) {
            this.materials[0].dispose();
        }
        // Release particles
        while (this.particleSystems.length) {
            this.particleSystems[0].dispose();
        }
        // Release postProcesses
        while (this.postProcesses.length) {
            this.postProcesses[0].dispose();
        }
        // Release textures
        while (this.textures.length) {
            this.textures[0].dispose();
        }
        // Release UBO
        this._sceneUbo.dispose();
        if (this._multiviewSceneUbo) {
            this._multiviewSceneUbo.dispose();
        }
        // Post-processes
        this.postProcessManager.dispose();
        // Remove from engine
        index = this._engine.scenes.indexOf(this);
        if (index > -1) {
            this._engine.scenes.splice(index, 1);
        }
        this._engine.wipeCaches(true);
        this._isDisposed = true;
    };
    Object.defineProperty(Scene.prototype, "isDisposed", {
        /**
         * Gets if the scene is already disposed
         */
        get: function () {
            return this._isDisposed;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Call this function to reduce memory footprint of the scene.
     * Vertex buffers will not store CPU data anymore (this will prevent picking, collisions or physics to work correctly)
     */
    Scene.prototype.clearCachedVertexData = function () {
        for (var meshIndex = 0; meshIndex < this.meshes.length; meshIndex++) {
            var mesh = this.meshes[meshIndex];
            var geometry = mesh.geometry;
            if (geometry) {
                geometry._indices = [];
                for (var vbName in geometry._vertexBuffers) {
                    if (!geometry._vertexBuffers.hasOwnProperty(vbName)) {
                        continue;
                    }
                    geometry._vertexBuffers[vbName]._buffer._data = null;
                }
            }
        }
    };
    /**
     * This function will remove the local cached buffer data from texture.
     * It will save memory but will prevent the texture from being rebuilt
     */
    Scene.prototype.cleanCachedTextureBuffer = function () {
        for (var _i = 0, _a = this.textures; _i < _a.length; _i++) {
            var baseTexture = _a[_i];
            var buffer = baseTexture._buffer;
            if (buffer) {
                baseTexture._buffer = null;
            }
        }
    };
    /**
     * Get the world extend vectors with an optional filter
     *
     * @param filterPredicate the predicate - which meshes should be included when calculating the world size
     * @returns {{ min: Vector3; max: Vector3 }} min and max vectors
     */
    Scene.prototype.getWorldExtends = function (filterPredicate) {
        var min = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        var max = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        filterPredicate = filterPredicate || (function () { return true; });
        this.meshes.filter(filterPredicate).forEach(function (mesh) {
            mesh.computeWorldMatrix(true);
            if (!mesh.subMeshes || mesh.subMeshes.length === 0 || mesh.infiniteDistance) {
                return;
            }
            var boundingInfo = mesh.getBoundingInfo();
            var minBox = boundingInfo.boundingBox.minimumWorld;
            var maxBox = boundingInfo.boundingBox.maximumWorld;
            Vector3.CheckExtends(minBox, min, max);
            Vector3.CheckExtends(maxBox, min, max);
        });
        return {
            min: min,
            max: max
        };
    };
    // Picking
    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param world defines the world matrix to use if you want to pick in object space (instead of world space)
     * @param camera defines the camera to use for the picking
     * @param cameraViewSpace defines if picking will be done in view space (false by default)
     * @returns a Ray
     */
    Scene.prototype.createPickingRay = function (x, y, world, camera, cameraViewSpace) {
        throw _DevTools.WarnImport("Ray");
    };
    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param world defines the world matrix to use if you want to pick in object space (instead of world space)
     * @param result defines the ray where to store the picking ray
     * @param camera defines the camera to use for the picking
     * @param cameraViewSpace defines if picking will be done in view space (false by default)
     * @returns the current scene
     */
    Scene.prototype.createPickingRayToRef = function (x, y, world, result, camera, cameraViewSpace) {
        throw _DevTools.WarnImport("Ray");
    };
    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param camera defines the camera to use for the picking
     * @returns a Ray
     */
    Scene.prototype.createPickingRayInCameraSpace = function (x, y, camera) {
        throw _DevTools.WarnImport("Ray");
    };
    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param result defines the ray where to store the picking ray
     * @param camera defines the camera to use for the picking
     * @returns the current scene
     */
    Scene.prototype.createPickingRayInCameraSpaceToRef = function (x, y, result, camera) {
        throw _DevTools.WarnImport("Ray");
    };
    /** Launch a ray to try to pick a mesh in the scene
     * @param x position on screen
     * @param y position on screen
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param fastCheck defines if the first intersection will be used (and not the closest)
     * @param camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns a PickingInfo
     */
    Scene.prototype.pick = function (x, y, predicate, fastCheck, camera, trianglePredicate) {
        // Dummy info if picking as not been imported
        var pi = new PickingInfo();
        pi._pickingUnavailable = true;
        return pi;
    };
    /** Launch a ray to try to pick a mesh in the scene using only bounding information of the main mesh (not using submeshes)
     * @param x position on screen
     * @param y position on screen
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param fastCheck defines if the first intersection will be used (and not the closest)
     * @param camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
     * @returns a PickingInfo (Please note that some info will not be set like distance, bv, bu and everything that cannot be capture by only using bounding infos)
     */
    Scene.prototype.pickWithBoundingInfo = function (x, y, predicate, fastCheck, camera) {
        // Dummy info if picking as not been imported
        var pi = new PickingInfo();
        pi._pickingUnavailable = true;
        return pi;
    };
    /** Use the given ray to pick a mesh in the scene
     * @param ray The ray to use to pick meshes
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must have isPickable set to true
     * @param fastCheck defines if the first intersection will be used (and not the closest)
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns a PickingInfo
     */
    Scene.prototype.pickWithRay = function (ray, predicate, fastCheck, trianglePredicate) {
        throw _DevTools.WarnImport("Ray");
    };
    /**
     * Launch a ray to try to pick a mesh in the scene
     * @param x X position on screen
     * @param y Y position on screen
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param camera camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns an array of PickingInfo
     */
    Scene.prototype.multiPick = function (x, y, predicate, camera, trianglePredicate) {
        throw _DevTools.WarnImport("Ray");
    };
    /**
     * Launch a ray to try to pick a mesh in the scene
     * @param ray Ray to use
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns an array of PickingInfo
     */
    Scene.prototype.multiPickWithRay = function (ray, predicate, trianglePredicate) {
        throw _DevTools.WarnImport("Ray");
    };
    /**
     * Force the value of meshUnderPointer
     * @param mesh defines the mesh to use
     * @param pointerId optional pointer id when using more than one pointer
     */
    Scene.prototype.setPointerOverMesh = function (mesh, pointerId) {
        this._inputManager.setPointerOverMesh(mesh, pointerId);
    };
    /**
     * Gets the mesh under the pointer
     * @returns a Mesh or null if no mesh is under the pointer
     */
    Scene.prototype.getPointerOverMesh = function () {
        return this._inputManager.getPointerOverMesh();
    };
    // Misc.
    /** @hidden */
    Scene.prototype._rebuildGeometries = function () {
        for (var _i = 0, _a = this.geometries; _i < _a.length; _i++) {
            var geometry = _a[_i];
            geometry._rebuild();
        }
        for (var _b = 0, _c = this.meshes; _b < _c.length; _b++) {
            var mesh = _c[_b];
            mesh._rebuild();
        }
        if (this.postProcessManager) {
            this.postProcessManager._rebuild();
        }
        for (var _d = 0, _e = this._components; _d < _e.length; _d++) {
            var component = _e[_d];
            component.rebuild();
        }
        for (var _f = 0, _g = this.particleSystems; _f < _g.length; _f++) {
            var system = _g[_f];
            system.rebuild();
        }
    };
    /** @hidden */
    Scene.prototype._rebuildTextures = function () {
        for (var _i = 0, _a = this.textures; _i < _a.length; _i++) {
            var texture = _a[_i];
            texture._rebuild();
        }
        this.markAllMaterialsAsDirty(1);
    };
    // Tags
    Scene.prototype._getByTags = function (list, tagsQuery, forEach) {
        if (tagsQuery === undefined) {
            // returns the complete list (could be done with Tags.MatchesQuery but no need to have a for-loop here)
            return list;
        }
        var listByTags = [];
        forEach = forEach || (function (item) { return; });
        for (var i in list) {
            var item = list[i];
            if (Tags && Tags.MatchesQuery(item, tagsQuery)) {
                listByTags.push(item);
                forEach(item);
            }
        }
        return listByTags;
    };
    /**
     * Get a list of meshes by tags
     * @param tagsQuery defines the tags query to use
     * @param forEach defines a predicate used to filter results
     * @returns an array of Mesh
     */
    Scene.prototype.getMeshesByTags = function (tagsQuery, forEach) {
        return this._getByTags(this.meshes, tagsQuery, forEach);
    };
    /**
     * Get a list of cameras by tags
     * @param tagsQuery defines the tags query to use
     * @param forEach defines a predicate used to filter results
     * @returns an array of Camera
     */
    Scene.prototype.getCamerasByTags = function (tagsQuery, forEach) {
        return this._getByTags(this.cameras, tagsQuery, forEach);
    };
    /**
     * Get a list of lights by tags
     * @param tagsQuery defines the tags query to use
     * @param forEach defines a predicate used to filter results
     * @returns an array of Light
     */
    Scene.prototype.getLightsByTags = function (tagsQuery, forEach) {
        return this._getByTags(this.lights, tagsQuery, forEach);
    };
    /**
     * Get a list of materials by tags
     * @param tagsQuery defines the tags query to use
     * @param forEach defines a predicate used to filter results
     * @returns an array of Material
     */
    Scene.prototype.getMaterialByTags = function (tagsQuery, forEach) {
        return this._getByTags(this.materials, tagsQuery, forEach).concat(this._getByTags(this.multiMaterials, tagsQuery, forEach));
    };
    /**
     * Get a list of transform nodes by tags
     * @param tagsQuery defines the tags query to use
     * @param forEach defines a predicate used to filter results
     * @returns an array of TransformNode
     */
    Scene.prototype.getTransformNodesByTags = function (tagsQuery, forEach) {
        return this._getByTags(this.transformNodes, tagsQuery, forEach);
    };
    /**
     * Overrides the default sort function applied in the renderging group to prepare the meshes.
     * This allowed control for front to back rendering or reversly depending of the special needs.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param opaqueSortCompareFn The opaque queue comparison function use to sort.
     * @param alphaTestSortCompareFn The alpha test queue comparison function use to sort.
     * @param transparentSortCompareFn The transparent queue comparison function use to sort.
     */
    Scene.prototype.setRenderingOrder = function (renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn) {
        if (opaqueSortCompareFn === void 0) { opaqueSortCompareFn = null; }
        if (alphaTestSortCompareFn === void 0) { alphaTestSortCompareFn = null; }
        if (transparentSortCompareFn === void 0) { transparentSortCompareFn = null; }
        this._renderingManager.setRenderingOrder(renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn);
    };
    /**
     * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
     * @param depth Automatically clears depth between groups if true and autoClear is true.
     * @param stencil Automatically clears stencil between groups if true and autoClear is true.
     */
    Scene.prototype.setRenderingAutoClearDepthStencil = function (renderingGroupId, autoClearDepthStencil, depth, stencil) {
        if (depth === void 0) { depth = true; }
        if (stencil === void 0) { stencil = true; }
        this._renderingManager.setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil, depth, stencil);
    };
    /**
     * Gets the current auto clear configuration for one rendering group of the rendering
     * manager.
     * @param index the rendering group index to get the information for
     * @returns The auto clear setup for the requested rendering group
     */
    Scene.prototype.getAutoClearDepthStencilSetup = function (index) {
        return this._renderingManager.getAutoClearDepthStencilSetup(index);
    };
    Object.defineProperty(Scene.prototype, "blockMaterialDirtyMechanism", {
        /** Gets or sets a boolean blocking all the calls to markAllMaterialsAsDirty (ie. the materials won't be updated if they are out of sync) */
        get: function () {
            return this._blockMaterialDirtyMechanism;
        },
        set: function (value) {
            if (this._blockMaterialDirtyMechanism === value) {
                return;
            }
            this._blockMaterialDirtyMechanism = value;
            if (!value) { // Do a complete update
                this.markAllMaterialsAsDirty(63);
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Will flag all materials as dirty to trigger new shader compilation
     * @param flag defines the flag used to specify which material part must be marked as dirty
     * @param predicate If not null, it will be used to specifiy if a material has to be marked as dirty
     */
    Scene.prototype.markAllMaterialsAsDirty = function (flag, predicate) {
        if (this._blockMaterialDirtyMechanism) {
            return;
        }
        for (var _i = 0, _a = this.materials; _i < _a.length; _i++) {
            var material = _a[_i];
            if (predicate && !predicate(material)) {
                continue;
            }
            material.markAsDirty(flag);
        }
    };
    /** @hidden */
    Scene.prototype._loadFile = function (url, onSuccess, onProgress, useOfflineSupport, useArrayBuffer, onError) {
        var _this = this;
        var request = FileTools.LoadFile(url, onSuccess, onProgress, useOfflineSupport ? this.offlineProvider : undefined, useArrayBuffer, onError);
        this._activeRequests.push(request);
        request.onCompleteObservable.add(function (request) {
            _this._activeRequests.splice(_this._activeRequests.indexOf(request), 1);
        });
        return request;
    };
    /** @hidden */
    Scene.prototype._loadFileAsync = function (url, onProgress, useOfflineSupport, useArrayBuffer) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._loadFile(url, function (data) {
                resolve(data);
            }, onProgress, useOfflineSupport, useArrayBuffer, function (request, exception) {
                reject(exception);
            });
        });
    };
    /** @hidden */
    Scene.prototype._requestFile = function (url, onSuccess, onProgress, useOfflineSupport, useArrayBuffer, onError, onOpened) {
        var _this = this;
        var request = FileTools.RequestFile(url, onSuccess, onProgress, useOfflineSupport ? this.offlineProvider : undefined, useArrayBuffer, onError, onOpened);
        this._activeRequests.push(request);
        request.onCompleteObservable.add(function (request) {
            _this._activeRequests.splice(_this._activeRequests.indexOf(request), 1);
        });
        return request;
    };
    /** @hidden */
    Scene.prototype._requestFileAsync = function (url, onProgress, useOfflineSupport, useArrayBuffer, onOpened) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._requestFile(url, function (data) {
                resolve(data);
            }, onProgress, useOfflineSupport, useArrayBuffer, function (error) {
                reject(error);
            }, onOpened);
        });
    };
    /** @hidden */
    Scene.prototype._readFile = function (file, onSuccess, onProgress, useArrayBuffer, onError) {
        var _this = this;
        var request = FileTools.ReadFile(file, onSuccess, onProgress, useArrayBuffer, onError);
        this._activeRequests.push(request);
        request.onCompleteObservable.add(function (request) {
            _this._activeRequests.splice(_this._activeRequests.indexOf(request), 1);
        });
        return request;
    };
    /** @hidden */
    Scene.prototype._readFileAsync = function (file, onProgress, useArrayBuffer) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._readFile(file, function (data) {
                resolve(data);
            }, onProgress, useArrayBuffer, function (error) {
                reject(error);
            });
        });
    };
    /** The fog is deactivated */
    Scene.FOGMODE_NONE = 0;
    /** The fog density is following an exponential function */
    Scene.FOGMODE_EXP = 1;
    /** The fog density is following an exponential function faster than FOGMODE_EXP */
    Scene.FOGMODE_EXP2 = 2;
    /** The fog density is following a linear function. */
    Scene.FOGMODE_LINEAR = 3;
    /**
     * Gets or sets the minimum deltatime when deterministic lock step is enabled
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     */
    Scene.MinDeltaTime = 1.0;
    /**
     * Gets or sets the maximum deltatime when deterministic lock step is enabled
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     */
    Scene.MaxDeltaTime = 1000.0;
    return Scene;
}(AbstractScene));

export { AbstractScene as A, ColorCurves as C, ImageProcessingConfiguration as I, MaterialDefines as M, PostProcessManager as P, RenderingManager as R, Scene as S, UniqueIdGenerator as U, AbstractActionManager as a, StringDictionary as b, ImageProcessingConfigurationDefines as c, ActionEvent as d, RenderingGroup as e, RenderingGroupInfo as f };
