import { S as StringTools, L as Logger, E as EngineStore, D as DomManagement, O as Observable, b as _DevTools } from './thinEngine-e576a091.js';
import { P as PrecisionDate } from './engine-9a1b5aa7.js';
import { F as FileTools, I as InstantiationTools, T as TimingTools, G as GUID, W as WebRequest } from './guid-495ff9c7.js';

var cloneValue = function (source, destinationObject) {
    if (!source) {
        return null;
    }
    if (source.getClassName && source.getClassName() === "Mesh") {
        return null;
    }
    if (source.getClassName && source.getClassName() === "SubMesh") {
        return source.clone(destinationObject);
    }
    else if (source.clone) {
        return source.clone();
    }
    return null;
};
function getAllPropertyNames(obj) {
    var props = [];
    do {
        Object.getOwnPropertyNames(obj).forEach(function (prop) {
            if (props.indexOf(prop) === -1) {
                props.push(prop);
            }
        });
    } while (obj = Object.getPrototypeOf(obj));
    return props;
}
/**
 * Class containing a set of static utilities functions for deep copy.
 */
var DeepCopier = /** @class */ (function () {
    function DeepCopier() {
    }
    /**
     * Tries to copy an object by duplicating every property
     * @param source defines the source object
     * @param destination defines the target object
     * @param doNotCopyList defines a list of properties to avoid
     * @param mustCopyList defines a list of properties to copy (even if they start with _)
     */
    DeepCopier.DeepCopy = function (source, destination, doNotCopyList, mustCopyList) {
        var proerties = getAllPropertyNames(source);
        for (var _i = 0, proerties_1 = proerties; _i < proerties_1.length; _i++) {
            var prop = proerties_1[_i];
            if (prop[0] === "_" && (!mustCopyList || mustCopyList.indexOf(prop) === -1)) {
                continue;
            }
            if (StringTools.EndsWith(prop, "Observable")) {
                continue;
            }
            if (doNotCopyList && doNotCopyList.indexOf(prop) !== -1) {
                continue;
            }
            var sourceValue = source[prop];
            var typeOfSourceValue = typeof sourceValue;
            if (typeOfSourceValue === "function") {
                continue;
            }
            try {
                if (typeOfSourceValue === "object") {
                    if (sourceValue instanceof Array) {
                        destination[prop] = [];
                        if (sourceValue.length > 0) {
                            if (typeof sourceValue[0] == "object") {
                                for (var index = 0; index < sourceValue.length; index++) {
                                    var clonedValue = cloneValue(sourceValue[index], destination);
                                    if (destination[prop].indexOf(clonedValue) === -1) { // Test if auto inject was not done
                                        destination[prop].push(clonedValue);
                                    }
                                }
                            }
                            else {
                                destination[prop] = sourceValue.slice(0);
                            }
                        }
                    }
                    else {
                        destination[prop] = cloneValue(sourceValue, destination);
                    }
                }
                else {
                    destination[prop] = sourceValue;
                }
            }
            catch (e) {
                // Log a warning (it could be because of a read-only property)
                Logger.Warn(e.message);
            }
        }
    };
    return DeepCopier;
}());

var PromiseStates;
(function (PromiseStates) {
    PromiseStates[PromiseStates["Pending"] = 0] = "Pending";
    PromiseStates[PromiseStates["Fulfilled"] = 1] = "Fulfilled";
    PromiseStates[PromiseStates["Rejected"] = 2] = "Rejected";
})(PromiseStates || (PromiseStates = {}));
var FulFillmentAgregator = /** @class */ (function () {
    function FulFillmentAgregator() {
        this.count = 0;
        this.target = 0;
        this.results = [];
    }
    return FulFillmentAgregator;
}());
var InternalPromise = /** @class */ (function () {
    function InternalPromise(resolver) {
        var _this = this;
        this._state = PromiseStates.Pending;
        this._children = new Array();
        this._rejectWasConsumed = false;
        if (!resolver) {
            return;
        }
        try {
            resolver(function (value) {
                _this._resolve(value);
            }, function (reason) {
                _this._reject(reason);
            });
        }
        catch (e) {
            this._reject(e);
        }
    }
    Object.defineProperty(InternalPromise.prototype, "_result", {
        get: function () {
            return this._resultValue;
        },
        set: function (value) {
            this._resultValue = value;
            if (this._parent && this._parent._result === undefined) {
                this._parent._result = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    InternalPromise.prototype.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    };
    InternalPromise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        var newPromise = new InternalPromise();
        newPromise._onFulfilled = onFulfilled;
        newPromise._onRejected = onRejected;
        // Composition
        this._children.push(newPromise);
        newPromise._parent = this;
        if (this._state !== PromiseStates.Pending) {
            setTimeout(function () {
                if (_this._state === PromiseStates.Fulfilled || _this._rejectWasConsumed) {
                    var returnedValue = newPromise._resolve(_this._result);
                    if (returnedValue !== undefined && returnedValue !== null) {
                        if (returnedValue._state !== undefined) {
                            var returnedPromise = returnedValue;
                            newPromise._children.push(returnedPromise);
                            returnedPromise._parent = newPromise;
                            newPromise = returnedPromise;
                        }
                        else {
                            newPromise._result = returnedValue;
                        }
                    }
                }
                else {
                    newPromise._reject(_this._reason);
                }
            });
        }
        return newPromise;
    };
    InternalPromise.prototype._moveChildren = function (children) {
        var _a;
        var _this = this;
        (_a = this._children).push.apply(_a, children.splice(0, children.length));
        this._children.forEach(function (child) {
            child._parent = _this;
        });
        if (this._state === PromiseStates.Fulfilled) {
            for (var _i = 0, _b = this._children; _i < _b.length; _i++) {
                var child = _b[_i];
                child._resolve(this._result);
            }
        }
        else if (this._state === PromiseStates.Rejected) {
            for (var _c = 0, _d = this._children; _c < _d.length; _c++) {
                var child = _d[_c];
                child._reject(this._reason);
            }
        }
    };
    InternalPromise.prototype._resolve = function (value) {
        try {
            this._state = PromiseStates.Fulfilled;
            var returnedValue = null;
            if (this._onFulfilled) {
                returnedValue = this._onFulfilled(value);
            }
            if (returnedValue !== undefined && returnedValue !== null) {
                if (returnedValue._state !== undefined) {
                    // Transmit children
                    var returnedPromise = returnedValue;
                    returnedPromise._parent = this;
                    returnedPromise._moveChildren(this._children);
                    value = returnedPromise._result;
                }
                else {
                    value = returnedValue;
                }
            }
            this._result = value;
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child._resolve(value);
            }
            this._children.length = 0;
            delete this._onFulfilled;
            delete this._onRejected;
        }
        catch (e) {
            this._reject(e, true);
        }
    };
    InternalPromise.prototype._reject = function (reason, onLocalThrow) {
        if (onLocalThrow === void 0) { onLocalThrow = false; }
        this._state = PromiseStates.Rejected;
        this._reason = reason;
        if (this._onRejected && !onLocalThrow) {
            try {
                this._onRejected(reason);
                this._rejectWasConsumed = true;
            }
            catch (e) {
                reason = e;
            }
        }
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (this._rejectWasConsumed) {
                child._resolve(null);
            }
            else {
                child._reject(reason);
            }
        }
        this._children.length = 0;
        delete this._onFulfilled;
        delete this._onRejected;
    };
    InternalPromise.resolve = function (value) {
        var newPromise = new InternalPromise();
        newPromise._resolve(value);
        return newPromise;
    };
    InternalPromise._RegisterForFulfillment = function (promise, agregator, index) {
        promise.then(function (value) {
            agregator.results[index] = value;
            agregator.count++;
            if (agregator.count === agregator.target) {
                agregator.rootPromise._resolve(agregator.results);
            }
            return null;
        }, function (reason) {
            if (agregator.rootPromise._state !== PromiseStates.Rejected) {
                agregator.rootPromise._reject(reason);
            }
        });
    };
    InternalPromise.all = function (promises) {
        var newPromise = new InternalPromise();
        var agregator = new FulFillmentAgregator();
        agregator.target = promises.length;
        agregator.rootPromise = newPromise;
        if (promises.length) {
            for (var index = 0; index < promises.length; index++) {
                InternalPromise._RegisterForFulfillment(promises[index], agregator, index);
            }
        }
        else {
            newPromise._resolve([]);
        }
        return newPromise;
    };
    InternalPromise.race = function (promises) {
        var newPromise = new InternalPromise();
        if (promises.length) {
            for (var _i = 0, promises_1 = promises; _i < promises_1.length; _i++) {
                var promise = promises_1[_i];
                promise.then(function (value) {
                    if (newPromise) {
                        newPromise._resolve(value);
                        newPromise = null;
                    }
                    return null;
                }, function (reason) {
                    if (newPromise) {
                        newPromise._reject(reason);
                        newPromise = null;
                    }
                });
            }
        }
        return newPromise;
    };
    return InternalPromise;
}());
/**
 * Helper class that provides a small promise polyfill
 */
var PromisePolyfill = /** @class */ (function () {
    function PromisePolyfill() {
    }
    /**
     * Static function used to check if the polyfill is required
     * If this is the case then the function will inject the polyfill to window.Promise
     * @param force defines a boolean used to force the injection (mostly for testing purposes)
     */
    PromisePolyfill.Apply = function (force) {
        if (force === void 0) { force = false; }
        if (force || typeof Promise === 'undefined') {
            var root = window;
            root.Promise = InternalPromise;
        }
    };
    return PromisePolyfill;
}());

/**
 * Class containing a set of static utilities functions
 */
var Tools = /** @class */ (function () {
    function Tools() {
    }
    Object.defineProperty(Tools, "BaseUrl", {
        /**
         * Gets or sets the base URL to use to load assets
         */
        get: function () {
            return FileTools.BaseUrl;
        },
        set: function (value) {
            FileTools.BaseUrl = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tools, "DefaultRetryStrategy", {
        /**
         * Gets or sets the retry strategy to apply when an error happens while loading an asset
         */
        get: function () {
            return FileTools.DefaultRetryStrategy;
        },
        set: function (strategy) {
            FileTools.DefaultRetryStrategy = strategy;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tools, "CorsBehavior", {
        /**
         * Default behaviour for cors in the application.
         * It can be a string if the expected behavior is identical in the entire app.
         * Or a callback to be able to set it per url or on a group of them (in case of Video source for instance)
         */
        get: function () {
            return FileTools.CorsBehavior;
        },
        set: function (value) {
            FileTools.CorsBehavior = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tools, "UseFallbackTexture", {
        /**
         * Gets or sets a global variable indicating if fallback texture must be used when a texture cannot be loaded
         * @ignorenaming
         */
        get: function () {
            return EngineStore.UseFallbackTexture;
        },
        set: function (value) {
            EngineStore.UseFallbackTexture = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tools, "RegisteredExternalClasses", {
        /**
         * Use this object to register external classes like custom textures or material
         * to allow the laoders to instantiate them
         */
        get: function () {
            return InstantiationTools.RegisteredExternalClasses;
        },
        set: function (classes) {
            InstantiationTools.RegisteredExternalClasses = classes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tools, "fallbackTexture", {
        /**
         * Texture content used if a texture cannot loaded
         * @ignorenaming
         */
        get: function () {
            return EngineStore.FallbackTexture;
        },
        set: function (value) {
            EngineStore.FallbackTexture = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Read the content of a byte array at a specified coordinates (taking in account wrapping)
     * @param u defines the coordinate on X axis
     * @param v defines the coordinate on Y axis
     * @param width defines the width of the source data
     * @param height defines the height of the source data
     * @param pixels defines the source byte array
     * @param color defines the output color
     */
    Tools.FetchToRef = function (u, v, width, height, pixels, color) {
        var wrappedU = (Math.abs(u) * width) % width | 0;
        var wrappedV = (Math.abs(v) * height) % height | 0;
        var position = (wrappedU + wrappedV * width) * 4;
        color.r = pixels[position] / 255;
        color.g = pixels[position + 1] / 255;
        color.b = pixels[position + 2] / 255;
        color.a = pixels[position + 3] / 255;
    };
    /**
     * Interpolates between a and b via alpha
     * @param a The lower value (returned when alpha = 0)
     * @param b The upper value (returned when alpha = 1)
     * @param alpha The interpolation-factor
     * @return The mixed value
     */
    Tools.Mix = function (a, b, alpha) {
        return a * (1 - alpha) + b * alpha;
    };
    /**
     * Tries to instantiate a new object from a given class name
     * @param className defines the class name to instantiate
     * @returns the new object or null if the system was not able to do the instantiation
     */
    Tools.Instantiate = function (className) {
        return InstantiationTools.Instantiate(className);
    };
    /**
     * Provides a slice function that will work even on IE
     * @param data defines the array to slice
     * @param start defines the start of the data (optional)
     * @param end defines the end of the data (optional)
     * @returns the new sliced array
     */
    Tools.Slice = function (data, start, end) {
        if (data.slice) {
            return data.slice(start, end);
        }
        return Array.prototype.slice.call(data, start, end);
    };
    /**
     * Provides a slice function that will work even on IE
     * The difference between this and Slice is that this will force-convert to array
     * @param data defines the array to slice
     * @param start defines the start of the data (optional)
     * @param end defines the end of the data (optional)
     * @returns the new sliced array
     */
    Tools.SliceToArray = function (data, start, end) {
        if (Array.isArray(data)) {
            return data.slice(start, end);
        }
        return Array.prototype.slice.call(data, start, end);
    };
    /**
     * Polyfill for setImmediate
     * @param action defines the action to execute after the current execution block
     */
    Tools.SetImmediate = function (action) {
        TimingTools.SetImmediate(action);
    };
    /**
     * Function indicating if a number is an exponent of 2
     * @param value defines the value to test
     * @returns true if the value is an exponent of 2
     */
    Tools.IsExponentOfTwo = function (value) {
        var count = 1;
        do {
            count *= 2;
        } while (count < value);
        return count === value;
    };
    /**
     * Returns the nearest 32-bit single precision float representation of a Number
     * @param value A Number.  If the parameter is of a different type, it will get converted
     * to a number or to NaN if it cannot be converted
     * @returns number
     */
    Tools.FloatRound = function (value) {
        if (Math.fround) {
            return Math.fround(value);
        }
        return (Tools._tmpFloatArray[0] = value);
    };
    /**
     * Extracts the filename from a path
     * @param path defines the path to use
     * @returns the filename
     */
    Tools.GetFilename = function (path) {
        var index = path.lastIndexOf("/");
        if (index < 0) {
            return path;
        }
        return path.substring(index + 1);
    };
    /**
     * Extracts the "folder" part of a path (everything before the filename).
     * @param uri The URI to extract the info from
     * @param returnUnchangedIfNoSlash Do not touch the URI if no slashes are present
     * @returns The "folder" part of the path
     */
    Tools.GetFolderPath = function (uri, returnUnchangedIfNoSlash) {
        if (returnUnchangedIfNoSlash === void 0) { returnUnchangedIfNoSlash = false; }
        var index = uri.lastIndexOf("/");
        if (index < 0) {
            if (returnUnchangedIfNoSlash) {
                return uri;
            }
            return "";
        }
        return uri.substring(0, index + 1);
    };
    /**
     * Convert an angle in radians to degrees
     * @param angle defines the angle to convert
     * @returns the angle in degrees
     */
    Tools.ToDegrees = function (angle) {
        return (angle * 180) / Math.PI;
    };
    /**
     * Convert an angle in degrees to radians
     * @param angle defines the angle to convert
     * @returns the angle in radians
     */
    Tools.ToRadians = function (angle) {
        return (angle * Math.PI) / 180;
    };
    /**
     * Returns an array if obj is not an array
     * @param obj defines the object to evaluate as an array
     * @param allowsNullUndefined defines a boolean indicating if obj is allowed to be null or undefined
     * @returns either obj directly if obj is an array or a new array containing obj
     */
    Tools.MakeArray = function (obj, allowsNullUndefined) {
        if (allowsNullUndefined !== true && (obj === undefined || obj == null)) {
            return null;
        }
        return Array.isArray(obj) ? obj : [obj];
    };
    /**
     * Gets the pointer prefix to use
     * @param engine defines the engine we are finding the prefix for
     * @returns "pointer" if touch is enabled. Else returns "mouse"
     */
    Tools.GetPointerPrefix = function (engine) {
        var eventPrefix = "pointer";
        // Check if pointer events are supported
        if (DomManagement.IsWindowObjectExist() && !window.PointerEvent && DomManagement.IsNavigatorAvailable() && !navigator.pointerEnabled) {
            eventPrefix = "mouse";
        }
        // Special Fallback MacOS Safari...
        if (engine._badDesktopOS &&
            !engine._badOS &&
            // And not ipad pros who claim to be macs...
            !(document && "ontouchend" in document)) {
            eventPrefix = "mouse";
        }
        return eventPrefix;
    };
    /**
     * Sets the cors behavior on a dom element. This will add the required Tools.CorsBehavior to the element.
     * @param url define the url we are trying
     * @param element define the dom element where to configure the cors policy
     */
    Tools.SetCorsBehavior = function (url, element) {
        FileTools.SetCorsBehavior(url, element);
    };
    // External files
    /**
     * Removes unwanted characters from an url
     * @param url defines the url to clean
     * @returns the cleaned url
     */
    Tools.CleanUrl = function (url) {
        url = url.replace(/#/gm, "%23");
        return url;
    };
    Object.defineProperty(Tools, "PreprocessUrl", {
        /**
         * Gets or sets a function used to pre-process url before using them to load assets
         */
        get: function () {
            return FileTools.PreprocessUrl;
        },
        set: function (processor) {
            FileTools.PreprocessUrl = processor;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Loads an image as an HTMLImageElement.
     * @param input url string, ArrayBuffer, or Blob to load
     * @param onLoad callback called when the image successfully loads
     * @param onError callback called when the image fails to load
     * @param offlineProvider offline provider for caching
     * @param mimeType optional mime type
     * @returns the HTMLImageElement of the loaded image
     */
    Tools.LoadImage = function (input, onLoad, onError, offlineProvider, mimeType) {
        return FileTools.LoadImage(input, onLoad, onError, offlineProvider, mimeType);
    };
    /**
     * Loads a file from a url
     * @param url url string, ArrayBuffer, or Blob to load
     * @param onSuccess callback called when the file successfully loads
     * @param onProgress callback called while file is loading (if the server supports this mode)
     * @param offlineProvider defines the offline provider for caching
     * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
     * @param onError callback called when the file fails to load
     * @returns a file request object
     */
    Tools.LoadFile = function (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) {
        return FileTools.LoadFile(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError);
    };
    /**
     * Loads a file from a url
     * @param url the file url to load
     * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
     * @returns a promise containing an ArrayBuffer corresponding to the loaded file
     */
    Tools.LoadFileAsync = function (url, useArrayBuffer) {
        if (useArrayBuffer === void 0) { useArrayBuffer = true; }
        return new Promise(function (resolve, reject) {
            FileTools.LoadFile(url, function (data) {
                resolve(data);
            }, undefined, undefined, useArrayBuffer, function (request, exception) {
                reject(exception);
            });
        });
    };
    /**
     * Load a script (identified by an url). When the url returns, the
     * content of this file is added into a new script element, attached to the DOM (body element)
     * @param scriptUrl defines the url of the script to laod
     * @param onSuccess defines the callback called when the script is loaded
     * @param onError defines the callback to call if an error occurs
     * @param scriptId defines the id of the script element
     */
    Tools.LoadScript = function (scriptUrl, onSuccess, onError, scriptId) {
        if (!DomManagement.IsWindowObjectExist()) {
            return;
        }
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", scriptUrl);
        if (scriptId) {
            script.id = scriptId;
        }
        script.onload = function () {
            if (onSuccess) {
                onSuccess();
            }
        };
        script.onerror = function (e) {
            if (onError) {
                onError("Unable to load script '" + scriptUrl + "'", e);
            }
        };
        head.appendChild(script);
    };
    /**
     * Load an asynchronous script (identified by an url). When the url returns, the
     * content of this file is added into a new script element, attached to the DOM (body element)
     * @param scriptUrl defines the url of the script to laod
     * @param scriptId defines the id of the script element
     * @returns a promise request object
     */
    Tools.LoadScriptAsync = function (scriptUrl, scriptId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.LoadScript(scriptUrl, function () {
                resolve();
            }, function (message, exception) {
                reject(exception);
            });
        });
    };
    /**
     * Loads a file from a blob
     * @param fileToLoad defines the blob to use
     * @param callback defines the callback to call when data is loaded
     * @param progressCallback defines the callback to call during loading process
     * @returns a file request object
     */
    Tools.ReadFileAsDataURL = function (fileToLoad, callback, progressCallback) {
        var reader = new FileReader();
        var request = {
            onCompleteObservable: new Observable(),
            abort: function () { return reader.abort(); },
        };
        reader.onloadend = function (e) {
            request.onCompleteObservable.notifyObservers(request);
        };
        reader.onload = function (e) {
            //target doesn't have result from ts 1.3
            callback(e.target["result"]);
        };
        reader.onprogress = progressCallback;
        reader.readAsDataURL(fileToLoad);
        return request;
    };
    /**
     * Reads a file from a File object
     * @param file defines the file to load
     * @param onSuccess defines the callback to call when data is loaded
     * @param onProgress defines the callback to call during loading process
     * @param useArrayBuffer defines a boolean indicating that data must be returned as an ArrayBuffer
     * @param onError defines the callback to call when an error occurs
     * @returns a file request object
     */
    Tools.ReadFile = function (file, onSuccess, onProgress, useArrayBuffer, onError) {
        return FileTools.ReadFile(file, onSuccess, onProgress, useArrayBuffer, onError);
    };
    /**
     * Creates a data url from a given string content
     * @param content defines the content to convert
     * @returns the new data url link
     */
    Tools.FileAsURL = function (content) {
        var fileBlob = new Blob([content]);
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(fileBlob);
        return link;
    };
    /**
     * Format the given number to a specific decimal format
     * @param value defines the number to format
     * @param decimals defines the number of decimals to use
     * @returns the formatted string
     */
    Tools.Format = function (value, decimals) {
        if (decimals === void 0) { decimals = 2; }
        return value.toFixed(decimals);
    };
    /**
     * Tries to copy an object by duplicating every property
     * @param source defines the source object
     * @param destination defines the target object
     * @param doNotCopyList defines a list of properties to avoid
     * @param mustCopyList defines a list of properties to copy (even if they start with _)
     */
    Tools.DeepCopy = function (source, destination, doNotCopyList, mustCopyList) {
        DeepCopier.DeepCopy(source, destination, doNotCopyList, mustCopyList);
    };
    /**
     * Gets a boolean indicating if the given object has no own property
     * @param obj defines the object to test
     * @returns true if object has no own property
     */
    Tools.IsEmpty = function (obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    };
    /**
     * Function used to register events at window level
     * @param windowElement defines the Window object to use
     * @param events defines the events to register
     */
    Tools.RegisterTopRootEvents = function (windowElement, events) {
        for (var index = 0; index < events.length; index++) {
            var event = events[index];
            windowElement.addEventListener(event.name, event.handler, false);
            try {
                if (window.parent) {
                    window.parent.addEventListener(event.name, event.handler, false);
                }
            }
            catch (e) {
                // Silently fails...
            }
        }
    };
    /**
     * Function used to unregister events from window level
     * @param windowElement defines the Window object to use
     * @param events defines the events to unregister
     */
    Tools.UnregisterTopRootEvents = function (windowElement, events) {
        for (var index = 0; index < events.length; index++) {
            var event = events[index];
            windowElement.removeEventListener(event.name, event.handler);
            try {
                if (windowElement.parent) {
                    windowElement.parent.removeEventListener(event.name, event.handler);
                }
            }
            catch (e) {
                // Silently fails...
            }
        }
    };
    /**
     * Dumps the current bound framebuffer
     * @param width defines the rendering width
     * @param height defines the rendering height
     * @param engine defines the hosting engine
     * @param successCallback defines the callback triggered once the data are available
     * @param mimeType defines the mime type of the result
     * @param fileName defines the filename to download. If present, the result will automatically be downloaded
     */
    Tools.DumpFramebuffer = function (width, height, engine, successCallback, mimeType, fileName) {
        if (mimeType === void 0) { mimeType = "image/png"; }
        // Read the contents of the framebuffer
        var numberOfChannelsByLine = width * 4;
        var halfHeight = height / 2;
        //Reading datas from WebGL
        var data = engine.readPixels(0, 0, width, height);
        //To flip image on Y axis.
        for (var i = 0; i < halfHeight; i++) {
            for (var j = 0; j < numberOfChannelsByLine; j++) {
                var currentCell = j + i * numberOfChannelsByLine;
                var targetLine = height - i - 1;
                var targetCell = j + targetLine * numberOfChannelsByLine;
                var temp = data[currentCell];
                data[currentCell] = data[targetCell];
                data[targetCell] = temp;
            }
        }
        // Create a 2D canvas to store the result
        if (!Tools._ScreenshotCanvas) {
            Tools._ScreenshotCanvas = document.createElement("canvas");
        }
        Tools._ScreenshotCanvas.width = width;
        Tools._ScreenshotCanvas.height = height;
        var context = Tools._ScreenshotCanvas.getContext("2d");
        if (context) {
            // Copy the pixels to a 2D canvas
            var imageData = context.createImageData(width, height);
            var castData = imageData.data;
            castData.set(data);
            context.putImageData(imageData, 0, 0);
            Tools.EncodeScreenshotCanvasData(successCallback, mimeType, fileName);
        }
    };
    /**
     * Converts the canvas data to blob.
     * This acts as a polyfill for browsers not supporting the to blob function.
     * @param canvas Defines the canvas to extract the data from
     * @param successCallback Defines the callback triggered once the data are available
     * @param mimeType Defines the mime type of the result
     */
    Tools.ToBlob = function (canvas, successCallback, mimeType) {
        if (mimeType === void 0) { mimeType = "image/png"; }
        // We need HTMLCanvasElement.toBlob for HD screenshots
        if (!canvas.toBlob) {
            //  low performance polyfill based on toDataURL (https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
            canvas.toBlob = function (callback, type, quality) {
                var _this = this;
                setTimeout(function () {
                    var binStr = atob(_this.toDataURL(type, quality).split(",")[1]), len = binStr.length, arr = new Uint8Array(len);
                    for (var i = 0; i < len; i++) {
                        arr[i] = binStr.charCodeAt(i);
                    }
                    callback(new Blob([arr]));
                });
            };
        }
        canvas.toBlob(function (blob) {
            successCallback(blob);
        }, mimeType);
    };
    /**
     * Encodes the canvas data to base 64 or automatically download the result if filename is defined
     * @param successCallback defines the callback triggered once the data are available
     * @param mimeType defines the mime type of the result
     * @param fileName defines he filename to download. If present, the result will automatically be downloaded
     */
    Tools.EncodeScreenshotCanvasData = function (successCallback, mimeType, fileName) {
        if (mimeType === void 0) { mimeType = "image/png"; }
        if (successCallback) {
            var base64Image = Tools._ScreenshotCanvas.toDataURL(mimeType);
            successCallback(base64Image);
        }
        else {
            this.ToBlob(Tools._ScreenshotCanvas, function (blob) {
                //Creating a link if the browser have the download attribute on the a tag, to automatically start download generated image.
                if ("download" in document.createElement("a")) {
                    if (!fileName) {
                        var date = new Date();
                        var stringDate = (date.getFullYear() + "-" + (date.getMonth() + 1)).slice(2) + "-" + date.getDate() + "_" + date.getHours() + "-" + ("0" + date.getMinutes()).slice(-2);
                        fileName = "screenshot_" + stringDate + ".png";
                    }
                    Tools.Download(blob, fileName);
                }
                else {
                    var url = URL.createObjectURL(blob);
                    var newWindow = window.open("");
                    if (!newWindow) {
                        return;
                    }
                    var img = newWindow.document.createElement("img");
                    img.onload = function () {
                        // no longer need to read the blob so it's revoked
                        URL.revokeObjectURL(url);
                    };
                    img.src = url;
                    newWindow.document.body.appendChild(img);
                }
            }, mimeType);
        }
    };
    /**
     * Downloads a blob in the browser
     * @param blob defines the blob to download
     * @param fileName defines the name of the downloaded file
     */
    Tools.Download = function (blob, fileName) {
        if (navigator && navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
            return;
        }
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = fileName;
        a.addEventListener("click", function () {
            if (a.parentElement) {
                a.parentElement.removeChild(a);
            }
        });
        a.click();
        window.URL.revokeObjectURL(url);
    };
    /**
     * Will return the right value of the noPreventDefault variable
     * Needed to keep backwards compatibility to the old API.
     *
     * @param args arguments passed to the attachControl function
     * @returns the correct value for noPreventDefault
     */
    Tools.BackCompatCameraNoPreventDefault = function (args) {
        // is it used correctly?
        if (typeof args[0] === "boolean") {
            return args[0];
        }
        else if (typeof args[1] === "boolean") {
            return args[1];
        }
        return false;
    };
    /**
     * Captures a screenshot of the current rendering
     * @see https://doc.babylonjs.com/how_to/render_scene_on_a_png
     * @param engine defines the rendering engine
     * @param camera defines the source camera
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param successCallback defines the callback receives a single parameter which contains the
     * screenshot as a string of base64-encoded characters. This string can be assigned to the
     * src parameter of an <img> to display it
     * @param mimeType defines the MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     */
    Tools.CreateScreenshot = function (engine, camera, size, successCallback, mimeType) {
        throw _DevTools.WarnImport("ScreenshotTools");
    };
    /**
     * Captures a screenshot of the current rendering
     * @see https://doc.babylonjs.com/how_to/render_scene_on_a_png
     * @param engine defines the rendering engine
     * @param camera defines the source camera
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param mimeType defines the MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @returns screenshot as a string of base64-encoded characters. This string can be assigned
     * to the src parameter of an <img> to display it
     */
    Tools.CreateScreenshotAsync = function (engine, camera, size, mimeType) {
        throw _DevTools.WarnImport("ScreenshotTools");
    };
    /**
     * Generates an image screenshot from the specified camera.
     * @see https://doc.babylonjs.com/how_to/render_scene_on_a_png
     * @param engine The engine to use for rendering
     * @param camera The camera to use for rendering
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param successCallback The callback receives a single parameter which contains the
     * screenshot as a string of base64-encoded characters. This string can be assigned to the
     * src parameter of an <img> to display it
     * @param mimeType The MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @param samples Texture samples (default: 1)
     * @param antialiasing Whether antialiasing should be turned on or not (default: false)
     * @param fileName A name for for the downloaded file.
     */
    Tools.CreateScreenshotUsingRenderTarget = function (engine, camera, size, successCallback, mimeType, samples, antialiasing, fileName) {
        throw _DevTools.WarnImport("ScreenshotTools");
    };
    /**
     * Generates an image screenshot from the specified camera.
     * @see https://doc.babylonjs.com/how_to/render_scene_on_a_png
     * @param engine The engine to use for rendering
     * @param camera The camera to use for rendering
     * @param size This parameter can be set to a single number or to an object with the
     * following (optional) properties: precision, width, height. If a single number is passed,
     * it will be used for both width and height. If an object is passed, the screenshot size
     * will be derived from the parameters. The precision property is a multiplier allowing
     * rendering at a higher or lower resolution
     * @param mimeType The MIME type of the screenshot image (default: image/png).
     * Check your browser for supported MIME types
     * @param samples Texture samples (default: 1)
     * @param antialiasing Whether antialiasing should be turned on or not (default: false)
     * @param fileName A name for for the downloaded file.
     * @returns screenshot as a string of base64-encoded characters. This string can be assigned
     * to the src parameter of an <img> to display it
     */
    Tools.CreateScreenshotUsingRenderTargetAsync = function (engine, camera, size, mimeType, samples, antialiasing, fileName) {
        throw _DevTools.WarnImport("ScreenshotTools");
    };
    /**
     * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
     * Be aware Math.random() could cause collisions, but:
     * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
     * @returns a pseudo random id
     */
    Tools.RandomId = function () {
        return GUID.RandomId();
    };
    /**
     * Test if the given uri is a base64 string
     * @param uri The uri to test
     * @return True if the uri is a base64 string or false otherwise
     */
    Tools.IsBase64 = function (uri) {
        return uri.length < 5 ? false : uri.substr(0, 5) === "data:";
    };
    /**
     * Decode the given base64 uri.
     * @param uri The uri to decode
     * @return The decoded base64 data.
     */
    Tools.DecodeBase64 = function (uri) {
        var decodedString = atob(uri.split(",")[1]);
        var bufferLength = decodedString.length;
        var bufferView = new Uint8Array(new ArrayBuffer(bufferLength));
        for (var i = 0; i < bufferLength; i++) {
            bufferView[i] = decodedString.charCodeAt(i);
        }
        return bufferView.buffer;
    };
    /**
     * Gets the absolute url.
     * @param url the input url
     * @return the absolute url
     */
    Tools.GetAbsoluteUrl = function (url) {
        var a = document.createElement("a");
        a.href = url;
        return a.href;
    };
    Object.defineProperty(Tools, "errorsCount", {
        /**
         * Gets a value indicating the number of loading errors
         * @ignorenaming
         */
        get: function () {
            return Logger.errorsCount;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Log a message to the console
     * @param message defines the message to log
     */
    Tools.Log = function (message) {
        Logger.Log(message);
    };
    /**
     * Write a warning message to the console
     * @param message defines the message to log
     */
    Tools.Warn = function (message) {
        Logger.Warn(message);
    };
    /**
     * Write an error message to the console
     * @param message defines the message to log
     */
    Tools.Error = function (message) {
        Logger.Error(message);
    };
    Object.defineProperty(Tools, "LogCache", {
        /**
         * Gets current log cache (list of logs)
         */
        get: function () {
            return Logger.LogCache;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clears the log cache
     */
    Tools.ClearLogCache = function () {
        Logger.ClearLogCache();
    };
    Object.defineProperty(Tools, "LogLevels", {
        /**
         * Sets the current log level (MessageLogLevel / WarningLogLevel / ErrorLogLevel)
         */
        set: function (level) {
            Logger.LogLevels = level;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tools, "PerformanceLogLevel", {
        /**
         * Sets the current performance log level
         */
        set: function (level) {
            if ((level & Tools.PerformanceUserMarkLogLevel) === Tools.PerformanceUserMarkLogLevel) {
                Tools.StartPerformanceCounter = Tools._StartUserMark;
                Tools.EndPerformanceCounter = Tools._EndUserMark;
                return;
            }
            if ((level & Tools.PerformanceConsoleLogLevel) === Tools.PerformanceConsoleLogLevel) {
                Tools.StartPerformanceCounter = Tools._StartPerformanceConsole;
                Tools.EndPerformanceCounter = Tools._EndPerformanceConsole;
                return;
            }
            Tools.StartPerformanceCounter = Tools._StartPerformanceCounterDisabled;
            Tools.EndPerformanceCounter = Tools._EndPerformanceCounterDisabled;
        },
        enumerable: false,
        configurable: true
    });
    Tools._StartPerformanceCounterDisabled = function (counterName, condition) { };
    Tools._EndPerformanceCounterDisabled = function (counterName, condition) { };
    Tools._StartUserMark = function (counterName, condition) {
        if (condition === void 0) { condition = true; }
        if (!Tools._performance) {
            if (!DomManagement.IsWindowObjectExist()) {
                return;
            }
            Tools._performance = window.performance;
        }
        if (!condition || !Tools._performance.mark) {
            return;
        }
        Tools._performance.mark(counterName + "-Begin");
    };
    Tools._EndUserMark = function (counterName, condition) {
        if (condition === void 0) { condition = true; }
        if (!condition || !Tools._performance.mark) {
            return;
        }
        Tools._performance.mark(counterName + "-End");
        Tools._performance.measure(counterName, counterName + "-Begin", counterName + "-End");
    };
    Tools._StartPerformanceConsole = function (counterName, condition) {
        if (condition === void 0) { condition = true; }
        if (!condition) {
            return;
        }
        Tools._StartUserMark(counterName, condition);
        if (console.time) {
            console.time(counterName);
        }
    };
    Tools._EndPerformanceConsole = function (counterName, condition) {
        if (condition === void 0) { condition = true; }
        if (!condition) {
            return;
        }
        Tools._EndUserMark(counterName, condition);
        console.timeEnd(counterName);
    };
    Object.defineProperty(Tools, "Now", {
        /**
         * Gets either window.performance.now() if supported or Date.now() else
         */
        get: function () {
            return PrecisionDate.Now;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * This method will return the name of the class used to create the instance of the given object.
     * It will works only on Javascript basic data types (number, string, ...) and instance of class declared with the @className decorator.
     * @param object the object to get the class name from
     * @param isType defines if the object is actually a type
     * @returns the name of the class, will be "object" for a custom data type not using the @className decorator
     */
    Tools.GetClassName = function (object, isType) {
        if (isType === void 0) { isType = false; }
        var name = null;
        if (!isType && object.getClassName) {
            name = object.getClassName();
        }
        else {
            if (object instanceof Object) {
                var classObj = isType ? object : Object.getPrototypeOf(object);
                name = classObj.constructor["__bjsclassName__"];
            }
            if (!name) {
                name = typeof object;
            }
        }
        return name;
    };
    /**
     * Gets the first element of an array satisfying a given predicate
     * @param array defines the array to browse
     * @param predicate defines the predicate to use
     * @returns null if not found or the element
     */
    Tools.First = function (array, predicate) {
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var el = array_1[_i];
            if (predicate(el)) {
                return el;
            }
        }
        return null;
    };
    /**
     * This method will return the name of the full name of the class, including its owning module (if any).
     * It will works only on Javascript basic data types (number, string, ...) and instance of class declared with the @className decorator or implementing a method getClassName():string (in which case the module won't be specified).
     * @param object the object to get the class name from
     * @param isType defines if the object is actually a type
     * @return a string that can have two forms: "moduleName.className" if module was specified when the class' Name was registered or "className" if there was not module specified.
     * @ignorenaming
     */
    Tools.getFullClassName = function (object, isType) {
        if (isType === void 0) { isType = false; }
        var className = null;
        var moduleName = null;
        if (!isType && object.getClassName) {
            className = object.getClassName();
        }
        else {
            if (object instanceof Object) {
                var classObj = isType ? object : Object.getPrototypeOf(object);
                className = classObj.constructor["__bjsclassName__"];
                moduleName = classObj.constructor["__bjsmoduleName__"];
            }
            if (!className) {
                className = typeof object;
            }
        }
        if (!className) {
            return null;
        }
        return (moduleName != null ? moduleName + "." : "") + className;
    };
    /**
     * Returns a promise that resolves after the given amount of time.
     * @param delay Number of milliseconds to delay
     * @returns Promise that resolves after the given amount of time
     */
    Tools.DelayAsync = function (delay) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, delay);
        });
    };
    /**
     * Utility function to detect if the current user agent is Safari
     * @returns whether or not the current user agent is safari
     */
    Tools.IsSafari = function () {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    };
    /**
     * Enable/Disable Custom HTTP Request Headers globally.
     * default = false
     * @see CustomRequestHeaders
     */
    Tools.UseCustomRequestHeaders = false;
    /**
     * Custom HTTP Request Headers to be sent with XMLHttpRequests
     * i.e. when loading files, where the server/service expects an Authorization header
     */
    Tools.CustomRequestHeaders = WebRequest.CustomRequestHeaders;
    Tools._tmpFloatArray = new Float32Array(1);
    /**
     * Extracts text content from a DOM element hierarchy
     * Back Compat only, please use DomManagement.GetDOMTextContent instead.
     */
    Tools.GetDOMTextContent = DomManagement.GetDOMTextContent;
    // Logs
    /**
     * No log
     */
    Tools.NoneLogLevel = Logger.NoneLogLevel;
    /**
     * Only message logs
     */
    Tools.MessageLogLevel = Logger.MessageLogLevel;
    /**
     * Only warning logs
     */
    Tools.WarningLogLevel = Logger.WarningLogLevel;
    /**
     * Only error logs
     */
    Tools.ErrorLogLevel = Logger.ErrorLogLevel;
    /**
     * All logs
     */
    Tools.AllLogLevel = Logger.AllLogLevel;
    /**
     * Checks if the window object exists
     * Back Compat only, please use DomManagement.IsWindowObjectExist instead.
     */
    Tools.IsWindowObjectExist = DomManagement.IsWindowObjectExist;
    // Performances
    /**
     * No performance log
     */
    Tools.PerformanceNoneLogLevel = 0;
    /**
     * Use user marks to log performance
     */
    Tools.PerformanceUserMarkLogLevel = 1;
    /**
     * Log performance to the console
     */
    Tools.PerformanceConsoleLogLevel = 2;
    /**
     * Starts a performance counter
     */
    Tools.StartPerformanceCounter = Tools._StartPerformanceCounterDisabled;
    /**
     * Ends a specific performance coutner
     */
    Tools.EndPerformanceCounter = Tools._EndPerformanceCounterDisabled;
    return Tools;
}());
/**
 * Use this className as a decorator on a given class definition to add it a name and optionally its module.
 * You can then use the Tools.getClassName(obj) on an instance to retrieve its class name.
 * This method is the only way to get it done in all cases, even if the .js file declaring the class is minified
 * @param name The name of the class, case should be preserved
 * @param module The name of the Module hosting the class, optional, but strongly recommended to specify if possible. Case should be preserved.
 */
function className(name, module) {
    return function (target) {
        target["__bjsclassName__"] = name;
        target["__bjsmoduleName__"] = module != null ? module : null;
    };
}
/**
 * An implementation of a loop for asynchronous functions.
 */
var AsyncLoop = /** @class */ (function () {
    /**
     * Constructor.
     * @param iterations the number of iterations.
     * @param func the function to run each iteration
     * @param successCallback the callback that will be called upon succesful execution
     * @param offset starting offset.
     */
    function AsyncLoop(
    /**
     * Defines the number of iterations for the loop
     */
    iterations, func, successCallback, offset) {
        if (offset === void 0) { offset = 0; }
        this.iterations = iterations;
        this.index = offset - 1;
        this._done = false;
        this._fn = func;
        this._successCallback = successCallback;
    }
    /**
     * Execute the next iteration. Must be called after the last iteration was finished.
     */
    AsyncLoop.prototype.executeNext = function () {
        if (!this._done) {
            if (this.index + 1 < this.iterations) {
                ++this.index;
                this._fn(this);
            }
            else {
                this.breakLoop();
            }
        }
    };
    /**
     * Break the loop and run the success callback.
     */
    AsyncLoop.prototype.breakLoop = function () {
        this._done = true;
        this._successCallback();
    };
    /**
     * Create and run an async loop.
     * @param iterations the number of iterations.
     * @param fn the function to run each iteration
     * @param successCallback the callback that will be called upon succesful execution
     * @param offset starting offset.
     * @returns the created async loop object
     */
    AsyncLoop.Run = function (iterations, fn, successCallback, offset) {
        if (offset === void 0) { offset = 0; }
        var loop = new AsyncLoop(iterations, fn, successCallback, offset);
        loop.executeNext();
        return loop;
    };
    /**
     * A for-loop that will run a given number of iterations synchronous and the rest async.
     * @param iterations total number of iterations
     * @param syncedIterations number of synchronous iterations in each async iteration.
     * @param fn the function to call each iteration.
     * @param callback a success call back that will be called when iterating stops.
     * @param breakFunction a break condition (optional)
     * @param timeout timeout settings for the setTimeout function. default - 0.
     * @returns the created async loop object
     */
    AsyncLoop.SyncAsyncForLoop = function (iterations, syncedIterations, fn, callback, breakFunction, timeout) {
        if (timeout === void 0) { timeout = 0; }
        return AsyncLoop.Run(Math.ceil(iterations / syncedIterations), function (loop) {
            if (breakFunction && breakFunction()) {
                loop.breakLoop();
            }
            else {
                setTimeout(function () {
                    for (var i = 0; i < syncedIterations; ++i) {
                        var iteration = loop.index * syncedIterations + i;
                        if (iteration >= iterations) {
                            break;
                        }
                        fn(iteration);
                        if (breakFunction && breakFunction()) {
                            loop.breakLoop();
                            break;
                        }
                    }
                    loop.executeNext();
                }, timeout);
            }
        }, callback);
    };
    return AsyncLoop;
}());
// Will only be define if Tools is imported freeing up some space when only engine is required
EngineStore.FallbackTexture =
    "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAAQAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDQuMC41AP/bAEMABAIDAwMCBAMDAwQEBAQFCQYFBQUFCwgIBgkNCw0NDQsMDA4QFBEODxMPDAwSGBITFRYXFxcOERkbGRYaFBYXFv/bAEMBBAQEBQUFCgYGChYPDA8WFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFv/AABEIAQABAAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APH6KKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76CiiigD5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BQooooA+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/voKKKKAPl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76CiiigD5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BQooooA+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/voKKKKAPl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76P//Z";
// Register promise fallback for IE
PromisePolyfill.Apply();

export { AsyncLoop as A, DeepCopier as D, PromisePolyfill as P, Tools as T, className as c };
