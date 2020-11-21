import { O as Observable, d as __assign } from '../../../common/thinEngine-e576a091.js';
import '../../../common/node-87d9c658.js';
import '../../../common/math.color-fc6e801e.js';
import '../../../common/performanceConfigurator-115fd081.js';
import { E as Engine } from '../../../common/engine-9a1b5aa7.js';
import '../../../common/pointerEvents-12a2451c.js';
import { T as Tools } from '../../../common/tools-ab6f1dea.js';
import '../../../common/guid-495ff9c7.js';
import '../../../common/math.frustum-2cd1d420.js';
import '../../../common/math.axis-e7db27a6.js';
import { S as Scene } from '../../../common/scene-cbeb8ae2.js';
import '../../../common/sceneComponent-5502b64a.js';
import '../../../common/uniformBuffer-e700d3a6.js';
import '../../../common/light-a23926e9.js';

Object.defineProperty(Scene.prototype, "debugLayer", {
    get: function () {
        if (!this._debugLayer) {
            this._debugLayer = new DebugLayer(this);
        }
        return this._debugLayer;
    },
    enumerable: true,
    configurable: true
});
/**
 * Enum of inspector action tab
 */
var DebugLayerTab;
(function (DebugLayerTab) {
    /**
     * Properties tag (default)
     */
    DebugLayerTab[DebugLayerTab["Properties"] = 0] = "Properties";
    /**
     * Debug tab
     */
    DebugLayerTab[DebugLayerTab["Debug"] = 1] = "Debug";
    /**
     * Statistics tab
     */
    DebugLayerTab[DebugLayerTab["Statistics"] = 2] = "Statistics";
    /**
     * Tools tab
     */
    DebugLayerTab[DebugLayerTab["Tools"] = 3] = "Tools";
    /**
     * Settings tab
     */
    DebugLayerTab[DebugLayerTab["Settings"] = 4] = "Settings";
})(DebugLayerTab || (DebugLayerTab = {}));
/**
 * The debug layer (aka Inspector) is the go to tool in order to better understand
 * what is happening in your scene
 * @see https://doc.babylonjs.com/features/playground_debuglayer
 */
var DebugLayer = /** @class */ (function () {
    /**
     * Instantiates a new debug layer.
     * The debug layer (aka Inspector) is the go to tool in order to better understand
     * what is happening in your scene
     * @see https://doc.babylonjs.com/features/playground_debuglayer
     * @param scene Defines the scene to inspect
     */
    function DebugLayer(scene) {
        var _this = this;
        this.BJSINSPECTOR = this._getGlobalInspector();
        this._scene = scene;
        this._scene.onDisposeObservable.add(function () {
            // Debug layer
            if (_this._scene._debugLayer) {
                _this._scene._debugLayer.hide();
            }
        });
    }
    Object.defineProperty(DebugLayer.prototype, "onPropertyChangedObservable", {
        /**
         * Observable triggered when a property is changed through the inspector.
         */
        get: function () {
            if (this.BJSINSPECTOR && this.BJSINSPECTOR.Inspector) {
                return this.BJSINSPECTOR.Inspector.OnPropertyChangedObservable;
            }
            if (!this._onPropertyChangedObservable) {
                this._onPropertyChangedObservable = new Observable();
            }
            return this._onPropertyChangedObservable;
        },
        enumerable: false,
        configurable: true
    });
    /** Creates the inspector window. */
    DebugLayer.prototype._createInspector = function (config) {
        if (this.isVisible()) {
            return;
        }
        if (this._onPropertyChangedObservable) {
            for (var _i = 0, _a = this._onPropertyChangedObservable.observers; _i < _a.length; _i++) {
                var observer = _a[_i];
                this.BJSINSPECTOR.Inspector.OnPropertyChangedObservable.add(observer);
            }
            this._onPropertyChangedObservable.clear();
            this._onPropertyChangedObservable = undefined;
        }
        var userOptions = __assign({ overlay: false, showExplorer: true, showInspector: true, embedMode: false, handleResize: true, enablePopup: true }, config);
        this.BJSINSPECTOR = this.BJSINSPECTOR || this._getGlobalInspector();
        this.BJSINSPECTOR.Inspector.Show(this._scene, userOptions);
    };
    /**
     * Select a specific entity in the scene explorer and highlight a specific block in that entity property grid
     * @param entity defines the entity to select
     * @param lineContainerTitles defines the specific blocks to highlight (could be a string or an array of strings)
     */
    DebugLayer.prototype.select = function (entity, lineContainerTitles) {
        if (this.BJSINSPECTOR) {
            if (lineContainerTitles) {
                if (Object.prototype.toString.call(lineContainerTitles) == '[object String]') {
                    this.BJSINSPECTOR.Inspector.MarkLineContainerTitleForHighlighting(lineContainerTitles);
                }
                else {
                    this.BJSINSPECTOR.Inspector.MarkMultipleLineContainerTitlesForHighlighting(lineContainerTitles);
                }
            }
            this.BJSINSPECTOR.Inspector.OnSelectionChangeObservable.notifyObservers(entity);
        }
    };
    /** Get the inspector from bundle or global */
    DebugLayer.prototype._getGlobalInspector = function () {
        // UMD Global name detection from Webpack Bundle UMD Name.
        if (typeof INSPECTOR !== 'undefined') {
            return INSPECTOR;
        }
        // In case of module let s check the global emitted from the Inspector entry point.
        if (typeof BABYLON !== 'undefined' && typeof BABYLON.Inspector !== 'undefined') {
            return BABYLON;
        }
        return undefined;
    };
    /**
     * Get if the inspector is visible or not.
     * @returns true if visible otherwise, false
     */
    DebugLayer.prototype.isVisible = function () {
        return this.BJSINSPECTOR && this.BJSINSPECTOR.Inspector.IsVisible;
    };
    /**
     * Hide the inspector and close its window.
     */
    DebugLayer.prototype.hide = function () {
        if (this.BJSINSPECTOR) {
            this.BJSINSPECTOR.Inspector.Hide();
        }
    };
    /**
     * Update the scene in the inspector
     */
    DebugLayer.prototype.setAsActiveScene = function () {
        if (this.BJSINSPECTOR) {
            this.BJSINSPECTOR.Inspector._SetNewScene(this._scene);
        }
    };
    /**
      * Launch the debugLayer.
      * @param config Define the configuration of the inspector
      * @return a promise fulfilled when the debug layer is visible
      */
    DebugLayer.prototype.show = function (config) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof _this.BJSINSPECTOR == 'undefined') {
                var inspectorUrl = config && config.inspectorURL ? config.inspectorURL : DebugLayer.InspectorURL;
                // Load inspector and add it to the DOM
                Tools.LoadScript(inspectorUrl, function () {
                    _this._createInspector(config);
                    resolve(_this);
                });
            }
            else {
                // Otherwise creates the inspector
                _this._createInspector(config);
                resolve(_this);
            }
        });
    };
    /**
     * Define the url to get the inspector script from.
     * By default it uses the babylonjs CDN.
     * @ignoreNaming
     */
    DebugLayer.InspectorURL = "https://unpkg.com/babylonjs-inspector@" + Engine.Version + "/babylon.inspector.bundle.js";
    return DebugLayer;
}());

export { DebugLayer, DebugLayerTab };
