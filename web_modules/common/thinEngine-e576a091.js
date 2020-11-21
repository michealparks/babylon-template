import { P as PerformanceConfigurator } from './performanceConfigurator-115fd081.js';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

/** @hidden */
var _DevTools = /** @class */ (function () {
    function _DevTools() {
    }
    _DevTools.WarnImport = function (name) {
        return name + " needs to be imported before as it contains a side-effect required by your code.";
    };
    return _DevTools;
}());

/**
 * A class serves as a medium between the observable and its observers
 */
var EventState = /** @class */ (function () {
    /**
     * Create a new EventState
     * @param mask defines the mask associated with this state
     * @param skipNextObservers defines a flag which will instruct the observable to skip following observers when set to true
     * @param target defines the original target of the state
     * @param currentTarget defines the current target of the state
     */
    function EventState(mask, skipNextObservers, target, currentTarget) {
        if (skipNextObservers === void 0) { skipNextObservers = false; }
        this.initalize(mask, skipNextObservers, target, currentTarget);
    }
    /**
     * Initialize the current event state
     * @param mask defines the mask associated with this state
     * @param skipNextObservers defines a flag which will instruct the observable to skip following observers when set to true
     * @param target defines the original target of the state
     * @param currentTarget defines the current target of the state
     * @returns the current event state
     */
    EventState.prototype.initalize = function (mask, skipNextObservers, target, currentTarget) {
        if (skipNextObservers === void 0) { skipNextObservers = false; }
        this.mask = mask;
        this.skipNextObservers = skipNextObservers;
        this.target = target;
        this.currentTarget = currentTarget;
        return this;
    };
    return EventState;
}());
/**
 * Represent an Observer registered to a given Observable object.
 */
var Observer = /** @class */ (function () {
    /**
     * Creates a new observer
     * @param callback defines the callback to call when the observer is notified
     * @param mask defines the mask of the observer (used to filter notifications)
     * @param scope defines the current scope used to restore the JS context
     */
    function Observer(
    /**
     * Defines the callback to call when the observer is notified
     */
    callback, 
    /**
     * Defines the mask of the observer (used to filter notifications)
     */
    mask, 
    /**
     * Defines the current scope used to restore the JS context
     */
    scope) {
        if (scope === void 0) { scope = null; }
        this.callback = callback;
        this.mask = mask;
        this.scope = scope;
        /** @hidden */
        this._willBeUnregistered = false;
        /**
         * Gets or sets a property defining that the observer as to be unregistered after the next notification
         */
        this.unregisterOnNextCall = false;
    }
    return Observer;
}());
/**
 * Represent a list of observers registered to multiple Observables object.
 */
var MultiObserver = /** @class */ (function () {
    function MultiObserver() {
    }
    /**
     * Release associated resources
     */
    MultiObserver.prototype.dispose = function () {
        if (this._observers && this._observables) {
            for (var index = 0; index < this._observers.length; index++) {
                this._observables[index].remove(this._observers[index]);
            }
        }
        this._observers = null;
        this._observables = null;
    };
    /**
     * Raise a callback when one of the observable will notify
     * @param observables defines a list of observables to watch
     * @param callback defines the callback to call on notification
     * @param mask defines the mask used to filter notifications
     * @param scope defines the current scope used to restore the JS context
     * @returns the new MultiObserver
     */
    MultiObserver.Watch = function (observables, callback, mask, scope) {
        if (mask === void 0) { mask = -1; }
        if (scope === void 0) { scope = null; }
        var result = new MultiObserver();
        result._observers = new Array();
        result._observables = observables;
        for (var _i = 0, observables_1 = observables; _i < observables_1.length; _i++) {
            var observable = observables_1[_i];
            var observer = observable.add(callback, mask, false, scope);
            if (observer) {
                result._observers.push(observer);
            }
        }
        return result;
    };
    return MultiObserver;
}());
/**
 * The Observable class is a simple implementation of the Observable pattern.
 *
 * There's one slight particularity though: a given Observable can notify its observer using a particular mask value, only the Observers registered with this mask value will be notified.
 * This enable a more fine grained execution without having to rely on multiple different Observable objects.
 * For instance you may have a given Observable that have four different types of notifications: Move (mask = 0x01), Stop (mask = 0x02), Turn Right (mask = 0X04), Turn Left (mask = 0X08).
 * A given observer can register itself with only Move and Stop (mask = 0x03), then it will only be notified when one of these two occurs and will never be for Turn Left/Right.
 */
var Observable = /** @class */ (function () {
    /**
     * Creates a new observable
     * @param onObserverAdded defines a callback to call when a new observer is added
     */
    function Observable(onObserverAdded) {
        this._observers = new Array();
        this._eventState = new EventState(0);
        if (onObserverAdded) {
            this._onObserverAdded = onObserverAdded;
        }
    }
    Object.defineProperty(Observable.prototype, "observers", {
        /**
         * Gets the list of observers
         */
        get: function () {
            return this._observers;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Create a new Observer with the specified callback
     * @param callback the callback that will be executed for that Observer
     * @param mask the mask used to filter observers
     * @param insertFirst if true the callback will be inserted at the first position, hence executed before the others ones. If false (default behavior) the callback will be inserted at the last position, executed after all the others already present.
     * @param scope optional scope for the callback to be called from
     * @param unregisterOnFirstCall defines if the observer as to be unregistered after the next notification
     * @returns the new observer created for the callback
     */
    Observable.prototype.add = function (callback, mask, insertFirst, scope, unregisterOnFirstCall) {
        if (mask === void 0) { mask = -1; }
        if (insertFirst === void 0) { insertFirst = false; }
        if (scope === void 0) { scope = null; }
        if (unregisterOnFirstCall === void 0) { unregisterOnFirstCall = false; }
        if (!callback) {
            return null;
        }
        var observer = new Observer(callback, mask, scope);
        observer.unregisterOnNextCall = unregisterOnFirstCall;
        if (insertFirst) {
            this._observers.unshift(observer);
        }
        else {
            this._observers.push(observer);
        }
        if (this._onObserverAdded) {
            this._onObserverAdded(observer);
        }
        return observer;
    };
    /**
     * Create a new Observer with the specified callback and unregisters after the next notification
     * @param callback the callback that will be executed for that Observer
     * @returns the new observer created for the callback
     */
    Observable.prototype.addOnce = function (callback) {
        return this.add(callback, undefined, undefined, undefined, true);
    };
    /**
     * Remove an Observer from the Observable object
     * @param observer the instance of the Observer to remove
     * @returns false if it doesn't belong to this Observable
     */
    Observable.prototype.remove = function (observer) {
        if (!observer) {
            return false;
        }
        var index = this._observers.indexOf(observer);
        if (index !== -1) {
            this._deferUnregister(observer);
            return true;
        }
        return false;
    };
    /**
     * Remove a callback from the Observable object
     * @param callback the callback to remove
     * @param scope optional scope. If used only the callbacks with this scope will be removed
     * @returns false if it doesn't belong to this Observable
    */
    Observable.prototype.removeCallback = function (callback, scope) {
        for (var index = 0; index < this._observers.length; index++) {
            var observer = this._observers[index];
            if (observer._willBeUnregistered) {
                continue;
            }
            if (observer.callback === callback && (!scope || scope === observer.scope)) {
                this._deferUnregister(observer);
                return true;
            }
        }
        return false;
    };
    Observable.prototype._deferUnregister = function (observer) {
        var _this = this;
        observer.unregisterOnNextCall = false;
        observer._willBeUnregistered = true;
        setTimeout(function () {
            _this._remove(observer);
        }, 0);
    };
    // This should only be called when not iterating over _observers to avoid callback skipping.
    // Removes an observer from the _observer Array.
    Observable.prototype._remove = function (observer) {
        if (!observer) {
            return false;
        }
        var index = this._observers.indexOf(observer);
        if (index !== -1) {
            this._observers.splice(index, 1);
            return true;
        }
        return false;
    };
    /**
     * Moves the observable to the top of the observer list making it get called first when notified
     * @param observer the observer to move
     */
    Observable.prototype.makeObserverTopPriority = function (observer) {
        this._remove(observer);
        this._observers.unshift(observer);
    };
    /**
     * Moves the observable to the bottom of the observer list making it get called last when notified
     * @param observer the observer to move
     */
    Observable.prototype.makeObserverBottomPriority = function (observer) {
        this._remove(observer);
        this._observers.push(observer);
    };
    /**
     * Notify all Observers by calling their respective callback with the given data
     * Will return true if all observers were executed, false if an observer set skipNextObservers to true, then prevent the subsequent ones to execute
     * @param eventData defines the data to send to all observers
     * @param mask defines the mask of the current notification (observers with incompatible mask (ie mask & observer.mask === 0) will not be notified)
     * @param target defines the original target of the state
     * @param currentTarget defines the current target of the state
     * @param userInfo defines any user info to send to observers
     * @returns false if the complete observer chain was not processed (because one observer set the skipNextObservers to true)
     */
    Observable.prototype.notifyObservers = function (eventData, mask, target, currentTarget, userInfo) {
        if (mask === void 0) { mask = -1; }
        if (!this._observers.length) {
            return true;
        }
        var state = this._eventState;
        state.mask = mask;
        state.target = target;
        state.currentTarget = currentTarget;
        state.skipNextObservers = false;
        state.lastReturnValue = eventData;
        state.userInfo = userInfo;
        for (var _i = 0, _a = this._observers; _i < _a.length; _i++) {
            var obs = _a[_i];
            if (obs._willBeUnregistered) {
                continue;
            }
            if (obs.mask & mask) {
                if (obs.scope) {
                    state.lastReturnValue = obs.callback.apply(obs.scope, [eventData, state]);
                }
                else {
                    state.lastReturnValue = obs.callback(eventData, state);
                }
                if (obs.unregisterOnNextCall) {
                    this._deferUnregister(obs);
                }
            }
            if (state.skipNextObservers) {
                return false;
            }
        }
        return true;
    };
    /**
     * Calling this will execute each callback, expecting it to be a promise or return a value.
     * If at any point in the chain one function fails, the promise will fail and the execution will not continue.
     * This is useful when a chain of events (sometimes async events) is needed to initialize a certain object
     * and it is crucial that all callbacks will be executed.
     * The order of the callbacks is kept, callbacks are not executed parallel.
     *
     * @param eventData The data to be sent to each callback
     * @param mask is used to filter observers defaults to -1
     * @param target defines the callback target (see EventState)
     * @param currentTarget defines he current object in the bubbling phase
     * @param userInfo defines any user info to send to observers
     * @returns {Promise<T>} will return a Promise than resolves when all callbacks executed successfully.
     */
    Observable.prototype.notifyObserversWithPromise = function (eventData, mask, target, currentTarget, userInfo) {
        var _this = this;
        if (mask === void 0) { mask = -1; }
        // create an empty promise
        var p = Promise.resolve(eventData);
        // no observers? return this promise.
        if (!this._observers.length) {
            return p;
        }
        var state = this._eventState;
        state.mask = mask;
        state.target = target;
        state.currentTarget = currentTarget;
        state.skipNextObservers = false;
        state.userInfo = userInfo;
        // execute one callback after another (not using Promise.all, the order is important)
        this._observers.forEach(function (obs) {
            if (state.skipNextObservers) {
                return;
            }
            if (obs._willBeUnregistered) {
                return;
            }
            if (obs.mask & mask) {
                if (obs.scope) {
                    p = p.then(function (lastReturnedValue) {
                        state.lastReturnValue = lastReturnedValue;
                        return obs.callback.apply(obs.scope, [eventData, state]);
                    });
                }
                else {
                    p = p.then(function (lastReturnedValue) {
                        state.lastReturnValue = lastReturnedValue;
                        return obs.callback(eventData, state);
                    });
                }
                if (obs.unregisterOnNextCall) {
                    _this._deferUnregister(obs);
                }
            }
        });
        // return the eventData
        return p.then(function () { return eventData; });
    };
    /**
     * Notify a specific observer
     * @param observer defines the observer to notify
     * @param eventData defines the data to be sent to each callback
     * @param mask is used to filter observers defaults to -1
     */
    Observable.prototype.notifyObserver = function (observer, eventData, mask) {
        if (mask === void 0) { mask = -1; }
        var state = this._eventState;
        state.mask = mask;
        state.skipNextObservers = false;
        observer.callback(eventData, state);
    };
    /**
     * Gets a boolean indicating if the observable has at least one observer
     * @returns true is the Observable has at least one Observer registered
     */
    Observable.prototype.hasObservers = function () {
        return this._observers.length > 0;
    };
    /**
    * Clear the list of observers
    */
    Observable.prototype.clear = function () {
        this._observers = new Array();
        this._onObserverAdded = null;
    };
    /**
     * Clone the current observable
     * @returns a new observable
     */
    Observable.prototype.clone = function () {
        var result = new Observable();
        result._observers = this._observers.slice(0);
        return result;
    };
    /**
     * Does this observable handles observer registered with a given mask
     * @param mask defines the mask to be tested
     * @return whether or not one observer registered with the given mask is handeled
    **/
    Observable.prototype.hasSpecificMask = function (mask) {
        if (mask === void 0) { mask = -1; }
        for (var _i = 0, _a = this._observers; _i < _a.length; _i++) {
            var obs = _a[_i];
            if (obs.mask & mask || obs.mask === mask) {
                return true;
            }
        }
        return false;
    };
    return Observable;
}());

/**
 * Sets of helpers dealing with the DOM and some of the recurrent functions needed in
 * Babylon.js
 */
var DomManagement = /** @class */ (function () {
    function DomManagement() {
    }
    /**
     * Checks if the window object exists
     * @returns true if the window object exists
     */
    DomManagement.IsWindowObjectExist = function () {
        return (typeof window) !== "undefined";
    };
    /**
     * Checks if the navigator object exists
     * @returns true if the navigator object exists
     */
    DomManagement.IsNavigatorAvailable = function () {
        return (typeof navigator) !== "undefined";
    };
    /**
     * Check if the document object exists
     * @returns true if the document object exists
     */
    DomManagement.IsDocumentAvailable = function () {
        return (typeof document) !== "undefined";
    };
    /**
     * Extracts text content from a DOM element hierarchy
     * @param element defines the root element
     * @returns a string
     */
    DomManagement.GetDOMTextContent = function (element) {
        var result = "";
        var child = element.firstChild;
        while (child) {
            if (child.nodeType === 3) {
                result += child.textContent;
            }
            child = (child.nextSibling);
        }
        return result;
    };
    return DomManagement;
}());

/**
 * The engine store class is responsible to hold all the instances of Engine and Scene created
 * during the life time of the application.
 */
var EngineStore = /** @class */ (function () {
    function EngineStore() {
    }
    Object.defineProperty(EngineStore, "LastCreatedEngine", {
        /**
         * Gets the latest created engine
         */
        get: function () {
            if (this.Instances.length === 0) {
                return null;
            }
            return this.Instances[this.Instances.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EngineStore, "LastCreatedScene", {
        /**
         * Gets the latest created scene
         */
        get: function () {
            return this._LastCreatedScene;
        },
        enumerable: false,
        configurable: true
    });
    /** Gets the list of created engines */
    EngineStore.Instances = new Array();
    /** @hidden */
    EngineStore._LastCreatedScene = null;
    /**
     * Gets or sets a global variable indicating if fallback texture must be used when a texture cannot be loaded
     * @ignorenaming
     */
    EngineStore.UseFallbackTexture = true;
    /**
     * Texture content used if a texture cannot loaded
     * @ignorenaming
     */
    EngineStore.FallbackTexture = "";
    return EngineStore;
}());

/**
 * Logger used througouht the application to allow configuration of
 * the log level required for the messages.
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger._AddLogEntry = function (entry) {
        Logger._LogCache = entry + Logger._LogCache;
        if (Logger.OnNewCacheEntry) {
            Logger.OnNewCacheEntry(entry);
        }
    };
    Logger._FormatMessage = function (message) {
        var padStr = function (i) { return (i < 10) ? "0" + i : "" + i; };
        var date = new Date();
        return "[" + padStr(date.getHours()) + ":" + padStr(date.getMinutes()) + ":" + padStr(date.getSeconds()) + "]: " + message;
    };
    Logger._LogDisabled = function (message) {
        // nothing to do
    };
    Logger._LogEnabled = function (message) {
        var formattedMessage = Logger._FormatMessage(message);
        console.log("BJS - " + formattedMessage);
        var entry = "<div style='color:white'>" + formattedMessage + "</div><br>";
        Logger._AddLogEntry(entry);
    };
    Logger._WarnDisabled = function (message) {
        // nothing to do
    };
    Logger._WarnEnabled = function (message) {
        var formattedMessage = Logger._FormatMessage(message);
        console.warn("BJS - " + formattedMessage);
        var entry = "<div style='color:orange'>" + formattedMessage + "</div><br>";
        Logger._AddLogEntry(entry);
    };
    Logger._ErrorDisabled = function (message) {
        // nothing to do
    };
    Logger._ErrorEnabled = function (message) {
        Logger.errorsCount++;
        var formattedMessage = Logger._FormatMessage(message);
        console.error("BJS - " + formattedMessage);
        var entry = "<div style='color:red'>" + formattedMessage + "</div><br>";
        Logger._AddLogEntry(entry);
    };
    Object.defineProperty(Logger, "LogCache", {
        /**
         * Gets current log cache (list of logs)
         */
        get: function () {
            return Logger._LogCache;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clears the log cache
     */
    Logger.ClearLogCache = function () {
        Logger._LogCache = "";
        Logger.errorsCount = 0;
    };
    Object.defineProperty(Logger, "LogLevels", {
        /**
         * Sets the current log level (MessageLogLevel / WarningLogLevel / ErrorLogLevel)
         */
        set: function (level) {
            if ((level & Logger.MessageLogLevel) === Logger.MessageLogLevel) {
                Logger.Log = Logger._LogEnabled;
            }
            else {
                Logger.Log = Logger._LogDisabled;
            }
            if ((level & Logger.WarningLogLevel) === Logger.WarningLogLevel) {
                Logger.Warn = Logger._WarnEnabled;
            }
            else {
                Logger.Warn = Logger._WarnDisabled;
            }
            if ((level & Logger.ErrorLogLevel) === Logger.ErrorLogLevel) {
                Logger.Error = Logger._ErrorEnabled;
            }
            else {
                Logger.Error = Logger._ErrorDisabled;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * No log
     */
    Logger.NoneLogLevel = 0;
    /**
     * Only message logs
     */
    Logger.MessageLogLevel = 1;
    /**
     * Only warning logs
     */
    Logger.WarningLogLevel = 2;
    /**
     * Only error logs
     */
    Logger.ErrorLogLevel = 4;
    /**
     * All logs
     */
    Logger.AllLogLevel = 7;
    Logger._LogCache = "";
    /**
     * Gets a value indicating the number of loading errors
     * @ignorenaming
     */
    Logger.errorsCount = 0;
    /**
     * Log a message to the console
     */
    Logger.Log = Logger._LogEnabled;
    /**
     * Write a warning message to the console
     */
    Logger.Warn = Logger._WarnEnabled;
    /**
     * Write an error message to the console
     */
    Logger.Error = Logger._ErrorEnabled;
    return Logger;
}());

/**
 * Helper to manipulate strings
 */
var StringTools = /** @class */ (function () {
    function StringTools() {
    }
    /**
     * Checks for a matching suffix at the end of a string (for ES5 and lower)
     * @param str Source string
     * @param suffix Suffix to search for in the source string
     * @returns Boolean indicating whether the suffix was found (true) or not (false)
     */
    StringTools.EndsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };
    /**
     * Checks for a matching suffix at the beginning of a string (for ES5 and lower)
     * @param str Source string
     * @param suffix Suffix to search for in the source string
     * @returns Boolean indicating whether the suffix was found (true) or not (false)
     */
    StringTools.StartsWith = function (str, suffix) {
        if (!str) {
            return false;
        }
        return str.indexOf(suffix) === 0;
    };
    /**
     * Decodes a buffer into a string
     * @param buffer The buffer to decode
     * @returns The decoded string
     */
    StringTools.Decode = function (buffer) {
        if (typeof TextDecoder !== "undefined") {
            return new TextDecoder().decode(buffer);
        }
        var result = "";
        for (var i = 0; i < buffer.byteLength; i++) {
            result += String.fromCharCode(buffer[i]);
        }
        return result;
    };
    /**
     * Encode a buffer to a base64 string
     * @param buffer defines the buffer to encode
     * @returns the encoded string
     */
    StringTools.EncodeArrayBufferToBase64 = function (buffer) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        var bytes = ArrayBuffer.isView(buffer) ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) : new Uint8Array(buffer);
        while (i < bytes.length) {
            chr1 = bytes[i++];
            chr2 = i < bytes.length ? bytes[i++] : Number.NaN;
            chr3 = i < bytes.length ? bytes[i++] : Number.NaN;
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }
        return output;
    };
    /**
    * Converts a number to string and pads with preceeding zeroes until it is of specified length.
    * @param num the number to convert and pad
    * @param length the expected length of the string
    * @returns the padded string
    */
    StringTools.PadNumber = function (num, length) {
        var str = String(num);
        while (str.length < length) {
            str = "0" + str;
        }
        return str;
    };
    return StringTools;
}());

/** @hidden */
var ShaderCodeNode = /** @class */ (function () {
    function ShaderCodeNode() {
        this.children = [];
    }
    ShaderCodeNode.prototype.isValid = function (preprocessors) {
        return true;
    };
    ShaderCodeNode.prototype.process = function (preprocessors, options) {
        var result = "";
        if (this.line) {
            var value = this.line;
            var processor = options.processor;
            if (processor) {
                // This must be done before other replacements to avoid mistakenly changing something that was already changed.
                if (processor.lineProcessor) {
                    value = processor.lineProcessor(value, options.isFragment);
                }
                if (processor.attributeProcessor && StringTools.StartsWith(this.line, "attribute")) {
                    value = processor.attributeProcessor(this.line);
                }
                else if (processor.varyingProcessor && StringTools.StartsWith(this.line, "varying")) {
                    value = processor.varyingProcessor(this.line, options.isFragment);
                }
                else if ((processor.uniformProcessor || processor.uniformBufferProcessor) && StringTools.StartsWith(this.line, "uniform")) {
                    var regex = /uniform (.+) (.+)/;
                    if (regex.test(this.line)) { // uniform
                        if (processor.uniformProcessor) {
                            value = processor.uniformProcessor(this.line, options.isFragment);
                        }
                    }
                    else { // Uniform buffer
                        if (processor.uniformBufferProcessor) {
                            value = processor.uniformBufferProcessor(this.line, options.isFragment);
                            options.lookForClosingBracketForUniformBuffer = true;
                        }
                    }
                }
                if (processor.endOfUniformBufferProcessor) {
                    if (options.lookForClosingBracketForUniformBuffer && this.line.indexOf("}") !== -1) {
                        options.lookForClosingBracketForUniformBuffer = false;
                        value = processor.endOfUniformBufferProcessor(this.line, options.isFragment);
                    }
                }
            }
            result += value + "\r\n";
        }
        this.children.forEach(function (child) {
            result += child.process(preprocessors, options);
        });
        if (this.additionalDefineKey) {
            preprocessors[this.additionalDefineKey] = this.additionalDefineValue || "true";
        }
        return result;
    };
    return ShaderCodeNode;
}());

/** @hidden */
var ShaderCodeCursor = /** @class */ (function () {
    function ShaderCodeCursor() {
    }
    Object.defineProperty(ShaderCodeCursor.prototype, "currentLine", {
        get: function () {
            return this._lines[this.lineIndex];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShaderCodeCursor.prototype, "canRead", {
        get: function () {
            return this.lineIndex < this._lines.length - 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShaderCodeCursor.prototype, "lines", {
        set: function (value) {
            this._lines = [];
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var line = value_1[_i];
                // Prevent removing line break in macros.
                if (line[0] === "#") {
                    this._lines.push(line);
                    continue;
                }
                var split = line.split(";");
                for (var index = 0; index < split.length; index++) {
                    var subLine = split[index];
                    subLine = subLine.trim();
                    if (!subLine) {
                        continue;
                    }
                    this._lines.push(subLine + (index !== split.length - 1 ? ";" : ""));
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    return ShaderCodeCursor;
}());

/** @hidden */
var ShaderCodeConditionNode = /** @class */ (function (_super) {
    __extends(ShaderCodeConditionNode, _super);
    function ShaderCodeConditionNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShaderCodeConditionNode.prototype.process = function (preprocessors, options) {
        for (var index = 0; index < this.children.length; index++) {
            var node = this.children[index];
            if (node.isValid(preprocessors)) {
                return node.process(preprocessors, options);
            }
        }
        return "";
    };
    return ShaderCodeConditionNode;
}(ShaderCodeNode));

/** @hidden */
var ShaderCodeTestNode = /** @class */ (function (_super) {
    __extends(ShaderCodeTestNode, _super);
    function ShaderCodeTestNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShaderCodeTestNode.prototype.isValid = function (preprocessors) {
        return this.testExpression.isTrue(preprocessors);
    };
    return ShaderCodeTestNode;
}(ShaderCodeNode));

/** @hidden */
var ShaderDefineExpression = /** @class */ (function () {
    function ShaderDefineExpression() {
    }
    ShaderDefineExpression.prototype.isTrue = function (preprocessors) {
        return true;
    };
    ShaderDefineExpression.postfixToInfix = function (postfix) {
        var stack = [];
        for (var _i = 0, postfix_1 = postfix; _i < postfix_1.length; _i++) {
            var c = postfix_1[_i];
            if (ShaderDefineExpression._OperatorPriority[c] === undefined) {
                stack.push(c);
            }
            else {
                var v1 = stack[stack.length - 1], v2 = stack[stack.length - 2];
                stack.length -= 2;
                stack.push("(" + v2 + c + v1 + ")");
            }
        }
        return stack[stack.length - 1];
    };
    ShaderDefineExpression.infixToPostfix = function (infix) {
        var result = [];
        var stackIdx = -1;
        var pushOperand = function () {
            operand = operand.trim();
            if (operand !== '') {
                result.push(operand);
                operand = '';
            }
        };
        var push = function (s) {
            if (stackIdx < ShaderDefineExpression._Stack.length - 1) {
                ShaderDefineExpression._Stack[++stackIdx] = s;
            }
        };
        var peek = function () { return ShaderDefineExpression._Stack[stackIdx]; };
        var pop = function () { return stackIdx === -1 ? '!!INVALID EXPRESSION!!' : ShaderDefineExpression._Stack[stackIdx--]; };
        var idx = 0, operand = '';
        while (idx < infix.length) {
            var c = infix.charAt(idx), token = idx < infix.length - 1 ? infix.substr(idx, 2) : '';
            if (c === '(') {
                operand = '';
                push(c);
            }
            else if (c === ')') {
                pushOperand();
                while (stackIdx !== -1 && peek() !== '(') {
                    result.push(pop());
                }
                pop();
            }
            else if (ShaderDefineExpression._OperatorPriority[token] > 1) {
                pushOperand();
                while (stackIdx !== -1 && ShaderDefineExpression._OperatorPriority[peek()] >= ShaderDefineExpression._OperatorPriority[token]) {
                    result.push(pop());
                }
                push(token);
                idx++;
            }
            else {
                operand += c;
            }
            idx++;
        }
        pushOperand();
        while (stackIdx !== -1) {
            if (peek() === '(') {
                pop();
            }
            else {
                result.push(pop());
            }
        }
        return result;
    };
    ShaderDefineExpression._OperatorPriority = {
        ")": 0,
        "(": 1,
        "||": 2,
        "&&": 3,
    };
    ShaderDefineExpression._Stack = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    return ShaderDefineExpression;
}());

/** @hidden */
var ShaderDefineIsDefinedOperator = /** @class */ (function (_super) {
    __extends(ShaderDefineIsDefinedOperator, _super);
    function ShaderDefineIsDefinedOperator(define, not) {
        if (not === void 0) { not = false; }
        var _this = _super.call(this) || this;
        _this.define = define;
        _this.not = not;
        return _this;
    }
    ShaderDefineIsDefinedOperator.prototype.isTrue = function (preprocessors) {
        var condition = preprocessors[this.define] !== undefined;
        if (this.not) {
            condition = !condition;
        }
        return condition;
    };
    return ShaderDefineIsDefinedOperator;
}(ShaderDefineExpression));

/** @hidden */
var ShaderDefineOrOperator = /** @class */ (function (_super) {
    __extends(ShaderDefineOrOperator, _super);
    function ShaderDefineOrOperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShaderDefineOrOperator.prototype.isTrue = function (preprocessors) {
        return this.leftOperand.isTrue(preprocessors) || this.rightOperand.isTrue(preprocessors);
    };
    return ShaderDefineOrOperator;
}(ShaderDefineExpression));

/** @hidden */
var ShaderDefineAndOperator = /** @class */ (function (_super) {
    __extends(ShaderDefineAndOperator, _super);
    function ShaderDefineAndOperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShaderDefineAndOperator.prototype.isTrue = function (preprocessors) {
        return this.leftOperand.isTrue(preprocessors) && this.rightOperand.isTrue(preprocessors);
    };
    return ShaderDefineAndOperator;
}(ShaderDefineExpression));

/** @hidden */
var ShaderDefineArithmeticOperator = /** @class */ (function (_super) {
    __extends(ShaderDefineArithmeticOperator, _super);
    function ShaderDefineArithmeticOperator(define, operand, testValue) {
        var _this = _super.call(this) || this;
        _this.define = define;
        _this.operand = operand;
        _this.testValue = testValue;
        return _this;
    }
    ShaderDefineArithmeticOperator.prototype.isTrue = function (preprocessors) {
        var value = preprocessors[this.define];
        if (value === undefined) {
            value = this.define;
        }
        var condition = false;
        var left = parseInt(value);
        var right = parseInt(this.testValue);
        switch (this.operand) {
            case ">":
                condition = left > right;
                break;
            case "<":
                condition = left < right;
                break;
            case "<=":
                condition = left <= right;
                break;
            case ">=":
                condition = left >= right;
                break;
            case "==":
                condition = left === right;
                break;
        }
        return condition;
    };
    return ShaderDefineArithmeticOperator;
}(ShaderDefineExpression));

var regexSE = /defined\s*?\((.+?)\)/g;
var regexSERevert = /defined\s*?\[(.+?)\]/g;
/** @hidden */
var ShaderProcessor = /** @class */ (function () {
    function ShaderProcessor() {
    }
    ShaderProcessor.Process = function (sourceCode, options, callback, engine) {
        var _this = this;
        this._ProcessIncludes(sourceCode, options, function (codeWithIncludes) {
            var migratedCode = _this._ProcessShaderConversion(codeWithIncludes, options, engine);
            callback(migratedCode);
        });
    };
    ShaderProcessor._ProcessPrecision = function (source, options) {
        var shouldUseHighPrecisionShader = options.shouldUseHighPrecisionShader;
        if (source.indexOf("precision highp float") === -1) {
            if (!shouldUseHighPrecisionShader) {
                source = "precision mediump float;\n" + source;
            }
            else {
                source = "precision highp float;\n" + source;
            }
        }
        else {
            if (!shouldUseHighPrecisionShader) { // Moving highp to mediump
                source = source.replace("precision highp float", "precision mediump float");
            }
        }
        return source;
    };
    ShaderProcessor._ExtractOperation = function (expression) {
        var regex = /defined\((.+)\)/;
        var match = regex.exec(expression);
        if (match && match.length) {
            return new ShaderDefineIsDefinedOperator(match[1].trim(), expression[0] === "!");
        }
        var operators = ["==", ">=", "<=", "<", ">"];
        var operator = "";
        var indexOperator = 0;
        for (var _i = 0, operators_1 = operators; _i < operators_1.length; _i++) {
            operator = operators_1[_i];
            indexOperator = expression.indexOf(operator);
            if (indexOperator > -1) {
                break;
            }
        }
        if (indexOperator === -1) {
            return new ShaderDefineIsDefinedOperator(expression);
        }
        var define = expression.substring(0, indexOperator).trim();
        var value = expression.substring(indexOperator + operator.length).trim();
        return new ShaderDefineArithmeticOperator(define, operator, value);
    };
    ShaderProcessor._BuildSubExpression = function (expression) {
        expression = expression.replace(regexSE, "defined[$1]");
        var postfix = ShaderDefineExpression.infixToPostfix(expression);
        var stack = [];
        for (var _i = 0, postfix_1 = postfix; _i < postfix_1.length; _i++) {
            var c = postfix_1[_i];
            if (c !== '||' && c !== '&&') {
                stack.push(c);
            }
            else if (stack.length >= 2) {
                var v1 = stack[stack.length - 1], v2 = stack[stack.length - 2];
                stack.length -= 2;
                var operator = c == '&&' ? new ShaderDefineAndOperator() : new ShaderDefineOrOperator();
                if (typeof (v1) === 'string') {
                    v1 = v1.replace(regexSERevert, "defined($1)");
                }
                if (typeof (v2) === 'string') {
                    v2 = v2.replace(regexSERevert, "defined($1)");
                }
                operator.leftOperand = typeof (v2) === 'string' ? this._ExtractOperation(v2) : v2;
                operator.rightOperand = typeof (v1) === 'string' ? this._ExtractOperation(v1) : v1;
                stack.push(operator);
            }
        }
        var result = stack[stack.length - 1];
        if (typeof (result) === 'string') {
            result = result.replace(regexSERevert, "defined($1)");
        }
        // note: stack.length !== 1 if there was an error in the parsing
        return typeof (result) === 'string' ? this._ExtractOperation(result) : result;
    };
    ShaderProcessor._BuildExpression = function (line, start) {
        var node = new ShaderCodeTestNode();
        var command = line.substring(0, start);
        var expression = line.substring(start);
        expression = expression.substring(0, ((expression.indexOf("//") + 1) || (expression.length + 1)) - 1).trim();
        if (command === "#ifdef") {
            node.testExpression = new ShaderDefineIsDefinedOperator(expression);
        }
        else if (command === "#ifndef") {
            node.testExpression = new ShaderDefineIsDefinedOperator(expression, true);
        }
        else {
            node.testExpression = this._BuildSubExpression(expression);
        }
        return node;
    };
    ShaderProcessor._MoveCursorWithinIf = function (cursor, rootNode, ifNode) {
        var line = cursor.currentLine;
        while (this._MoveCursor(cursor, ifNode)) {
            line = cursor.currentLine;
            var first5 = line.substring(0, 5).toLowerCase();
            if (first5 === "#else") {
                var elseNode = new ShaderCodeNode();
                rootNode.children.push(elseNode);
                this._MoveCursor(cursor, elseNode);
                return;
            }
            else if (first5 === "#elif") {
                var elifNode = this._BuildExpression(line, 5);
                rootNode.children.push(elifNode);
                ifNode = elifNode;
            }
        }
    };
    ShaderProcessor._MoveCursor = function (cursor, rootNode) {
        while (cursor.canRead) {
            cursor.lineIndex++;
            var line = cursor.currentLine;
            var keywords = /(#ifdef)|(#else)|(#elif)|(#endif)|(#ifndef)|(#if)/;
            var matches = keywords.exec(line);
            if (matches && matches.length) {
                var keyword = matches[0];
                switch (keyword) {
                    case "#ifdef": {
                        var newRootNode = new ShaderCodeConditionNode();
                        rootNode.children.push(newRootNode);
                        var ifNode = this._BuildExpression(line, 6);
                        newRootNode.children.push(ifNode);
                        this._MoveCursorWithinIf(cursor, newRootNode, ifNode);
                        break;
                    }
                    case "#else":
                    case "#elif":
                        return true;
                    case "#endif":
                        return false;
                    case "#ifndef": {
                        var newRootNode = new ShaderCodeConditionNode();
                        rootNode.children.push(newRootNode);
                        var ifNode = this._BuildExpression(line, 7);
                        newRootNode.children.push(ifNode);
                        this._MoveCursorWithinIf(cursor, newRootNode, ifNode);
                        break;
                    }
                    case "#if": {
                        var newRootNode = new ShaderCodeConditionNode();
                        var ifNode = this._BuildExpression(line, 3);
                        rootNode.children.push(newRootNode);
                        newRootNode.children.push(ifNode);
                        this._MoveCursorWithinIf(cursor, newRootNode, ifNode);
                        break;
                    }
                }
            }
            else {
                var newNode = new ShaderCodeNode();
                newNode.line = line;
                rootNode.children.push(newNode);
                // Detect additional defines
                if (line[0] === "#" && line[1] === "d") {
                    var split = line.replace(";", "").split(" ");
                    newNode.additionalDefineKey = split[1];
                    if (split.length === 3) {
                        newNode.additionalDefineValue = split[2];
                    }
                }
            }
        }
        return false;
    };
    ShaderProcessor._EvaluatePreProcessors = function (sourceCode, preprocessors, options) {
        var rootNode = new ShaderCodeNode();
        var cursor = new ShaderCodeCursor();
        cursor.lineIndex = -1;
        cursor.lines = sourceCode.split("\n");
        // Decompose (We keep it in 2 steps so it is easier to maintain and perf hit is insignificant)
        this._MoveCursor(cursor, rootNode);
        // Recompose
        return rootNode.process(preprocessors, options);
    };
    ShaderProcessor._PreparePreProcessors = function (options) {
        var defines = options.defines;
        var preprocessors = {};
        for (var _i = 0, defines_1 = defines; _i < defines_1.length; _i++) {
            var define = defines_1[_i];
            var keyValue = define.replace("#define", "").replace(";", "").trim();
            var split = keyValue.split(" ");
            preprocessors[split[0]] = split.length > 1 ? split[1] : "";
        }
        preprocessors["GL_ES"] = "true";
        preprocessors["__VERSION__"] = options.version;
        preprocessors[options.platformName] = "true";
        return preprocessors;
    };
    ShaderProcessor._ProcessShaderConversion = function (sourceCode, options, engine) {
        var preparedSourceCode = this._ProcessPrecision(sourceCode, options);
        if (!options.processor) {
            return preparedSourceCode;
        }
        // Already converted
        if (preparedSourceCode.indexOf("#version 3") !== -1) {
            return preparedSourceCode.replace("#version 300 es", "");
        }
        var defines = options.defines;
        var preprocessors = this._PreparePreProcessors(options);
        // General pre processing
        if (options.processor.preProcessor) {
            preparedSourceCode = options.processor.preProcessor(preparedSourceCode, defines, options.isFragment);
        }
        preparedSourceCode = this._EvaluatePreProcessors(preparedSourceCode, preprocessors, options);
        // Post processing
        if (options.processor.postProcessor) {
            preparedSourceCode = options.processor.postProcessor(preparedSourceCode, defines, options.isFragment, engine);
        }
        return preparedSourceCode;
    };
    ShaderProcessor._ProcessIncludes = function (sourceCode, options, callback) {
        var _this = this;
        var regex = /#include<(.+)>(\((.*)\))*(\[(.*)\])*/g;
        var match = regex.exec(sourceCode);
        var returnValue = new String(sourceCode);
        var keepProcessing = false;
        while (match != null) {
            var includeFile = match[1];
            // Uniform declaration
            if (includeFile.indexOf("__decl__") !== -1) {
                includeFile = includeFile.replace(/__decl__/, "");
                if (options.supportsUniformBuffers) {
                    includeFile = includeFile.replace(/Vertex/, "Ubo");
                    includeFile = includeFile.replace(/Fragment/, "Ubo");
                }
                includeFile = includeFile + "Declaration";
            }
            if (options.includesShadersStore[includeFile]) {
                // Substitution
                var includeContent = options.includesShadersStore[includeFile];
                if (match[2]) {
                    var splits = match[3].split(",");
                    for (var index = 0; index < splits.length; index += 2) {
                        var source = new RegExp(splits[index], "g");
                        var dest = splits[index + 1];
                        includeContent = includeContent.replace(source, dest);
                    }
                }
                if (match[4]) {
                    var indexString = match[5];
                    if (indexString.indexOf("..") !== -1) {
                        var indexSplits = indexString.split("..");
                        var minIndex = parseInt(indexSplits[0]);
                        var maxIndex = parseInt(indexSplits[1]);
                        var sourceIncludeContent = includeContent.slice(0);
                        includeContent = "";
                        if (isNaN(maxIndex)) {
                            maxIndex = options.indexParameters[indexSplits[1]];
                        }
                        for (var i = minIndex; i < maxIndex; i++) {
                            if (!options.supportsUniformBuffers) {
                                // Ubo replacement
                                sourceIncludeContent = sourceIncludeContent.replace(/light\{X\}.(\w*)/g, function (str, p1) {
                                    return p1 + "{X}";
                                });
                            }
                            includeContent += sourceIncludeContent.replace(/\{X\}/g, i.toString()) + "\n";
                        }
                    }
                    else {
                        if (!options.supportsUniformBuffers) {
                            // Ubo replacement
                            includeContent = includeContent.replace(/light\{X\}.(\w*)/g, function (str, p1) {
                                return p1 + "{X}";
                            });
                        }
                        includeContent = includeContent.replace(/\{X\}/g, indexString);
                    }
                }
                // Replace
                returnValue = returnValue.replace(match[0], includeContent);
                keepProcessing = keepProcessing || includeContent.indexOf("#include<") >= 0;
            }
            else {
                var includeShaderUrl = options.shadersRepository + "ShadersInclude/" + includeFile + ".fx";
                ShaderProcessor._FileToolsLoadFile(includeShaderUrl, function (fileContent) {
                    options.includesShadersStore[includeFile] = fileContent;
                    _this._ProcessIncludes(returnValue, options, callback);
                });
                return;
            }
            match = regex.exec(sourceCode);
        }
        if (keepProcessing) {
            this._ProcessIncludes(returnValue.toString(), options, callback);
        }
        else {
            callback(returnValue);
        }
    };
    /**
     * Loads a file from a url
     * @param url url to load
     * @param onSuccess callback called when the file successfully loads
     * @param onProgress callback called while file is loading (if the server supports this mode)
     * @param offlineProvider defines the offline provider for caching
     * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
     * @param onError callback called when the file fails to load
     * @returns a file request object
     * @hidden
     */
    ShaderProcessor._FileToolsLoadFile = function (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) {
        throw _DevTools.WarnImport("FileTools");
    };
    return ShaderProcessor;
}());

/**
 * Effect containing vertex and fragment shader that can be executed on an object.
 */
var Effect = /** @class */ (function () {
    /**
     * Instantiates an effect.
     * An effect can be used to create/manage/execute vertex and fragment shaders.
     * @param baseName Name of the effect.
     * @param attributesNamesOrOptions List of attribute names that will be passed to the shader or set of all options to create the effect.
     * @param uniformsNamesOrEngine List of uniform variable names that will be passed to the shader or the engine that will be used to render effect.
     * @param samplers List of sampler variables that will be passed to the shader.
     * @param engine Engine to be used to render the effect
     * @param defines Define statements to be added to the shader.
     * @param fallbacks Possible fallbacks for this effect to improve performance when needed.
     * @param onCompiled Callback that will be called when the shader is compiled.
     * @param onError Callback that will be called if an error occurs during shader compilation.
     * @param indexParameters Parameters to be used with Babylons include syntax to iterate over an array (eg. {lights: 10})
     */
    function Effect(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, engine, defines, fallbacks, onCompiled, onError, indexParameters) {
        var _this = this;
        if (samplers === void 0) { samplers = null; }
        if (defines === void 0) { defines = null; }
        if (fallbacks === void 0) { fallbacks = null; }
        if (onCompiled === void 0) { onCompiled = null; }
        if (onError === void 0) { onError = null; }
        var _a;
        /**
         * Name of the effect.
         */
        this.name = null;
        /**
         * String container all the define statements that should be set on the shader.
         */
        this.defines = "";
        /**
         * Callback that will be called when the shader is compiled.
         */
        this.onCompiled = null;
        /**
         * Callback that will be called if an error occurs during shader compilation.
         */
        this.onError = null;
        /**
         * Callback that will be called when effect is bound.
         */
        this.onBind = null;
        /**
         * Unique ID of the effect.
         */
        this.uniqueId = 0;
        /**
         * Observable that will be called when the shader is compiled.
         * It is recommended to use executeWhenCompile() or to make sure that scene.isReady() is called to get this observable raised.
         */
        this.onCompileObservable = new Observable();
        /**
         * Observable that will be called if an error occurs during shader compilation.
         */
        this.onErrorObservable = new Observable();
        /** @hidden */
        this._onBindObservable = null;
        /**
         * @hidden
         * Specifies if the effect was previously ready
         */
        this._wasPreviouslyReady = false;
        /** @hidden */
        this._bonesComputationForcedToCPU = false;
        /** @hidden */
        this._multiTarget = false;
        this._uniformBuffersNames = {};
        this._samplers = {};
        this._isReady = false;
        this._compilationError = "";
        this._allFallbacksProcessed = false;
        this._uniforms = {};
        /**
         * Key for the effect.
         * @hidden
         */
        this._key = "";
        this._fallbacks = null;
        this._vertexSourceCode = "";
        this._fragmentSourceCode = "";
        this._vertexSourceCodeOverride = "";
        this._fragmentSourceCodeOverride = "";
        this._transformFeedbackVaryings = null;
        this._rawVertexSourceCode = "";
        this._rawFragmentSourceCode = "";
        /**
         * Compiled shader to webGL program.
         * @hidden
         */
        this._pipelineContext = null;
        this._valueCache = {};
        this.name = baseName;
        var processFinalCode = null;
        if (attributesNamesOrOptions.attributes) {
            var options = attributesNamesOrOptions;
            this._engine = uniformsNamesOrEngine;
            this._attributesNames = options.attributes;
            this._uniformsNames = options.uniformsNames.concat(options.samplers);
            this._samplerList = options.samplers.slice();
            this.defines = options.defines;
            this.onError = options.onError;
            this.onCompiled = options.onCompiled;
            this._fallbacks = options.fallbacks;
            this._indexParameters = options.indexParameters;
            this._transformFeedbackVaryings = options.transformFeedbackVaryings || null;
            this._multiTarget = !!options.multiTarget;
            if (options.uniformBuffersNames) {
                this._uniformBuffersNamesList = options.uniformBuffersNames.slice();
                for (var i = 0; i < options.uniformBuffersNames.length; i++) {
                    this._uniformBuffersNames[options.uniformBuffersNames[i]] = i;
                }
            }
            processFinalCode = (_a = options.processFinalCode) !== null && _a !== void 0 ? _a : null;
        }
        else {
            this._engine = engine;
            this.defines = (defines == null ? "" : defines);
            this._uniformsNames = uniformsNamesOrEngine.concat(samplers);
            this._samplerList = samplers ? samplers.slice() : [];
            this._attributesNames = attributesNamesOrOptions;
            this._uniformBuffersNamesList = [];
            this.onError = onError;
            this.onCompiled = onCompiled;
            this._indexParameters = indexParameters;
            this._fallbacks = fallbacks;
        }
        this._attributeLocationByName = {};
        this.uniqueId = Effect._uniqueIdSeed++;
        var vertexSource;
        var fragmentSource;
        var hostDocument = DomManagement.IsWindowObjectExist() ? this._engine.getHostDocument() : null;
        if (baseName.vertexSource) {
            vertexSource = "source:" + baseName.vertexSource;
        }
        else if (baseName.vertexElement) {
            vertexSource = hostDocument ? hostDocument.getElementById(baseName.vertexElement) : null;
            if (!vertexSource) {
                vertexSource = baseName.vertexElement;
            }
        }
        else {
            vertexSource = baseName.vertex || baseName;
        }
        if (baseName.fragmentSource) {
            fragmentSource = "source:" + baseName.fragmentSource;
        }
        else if (baseName.fragmentElement) {
            fragmentSource = hostDocument ? hostDocument.getElementById(baseName.fragmentElement) : null;
            if (!fragmentSource) {
                fragmentSource = baseName.fragmentElement;
            }
        }
        else {
            fragmentSource = baseName.fragment || baseName;
        }
        var processorOptions = {
            defines: this.defines.split("\n"),
            indexParameters: this._indexParameters,
            isFragment: false,
            shouldUseHighPrecisionShader: this._engine._shouldUseHighPrecisionShader,
            processor: this._engine._shaderProcessor,
            supportsUniformBuffers: this._engine.supportsUniformBuffers,
            shadersRepository: Effect.ShadersRepository,
            includesShadersStore: Effect.IncludesShadersStore,
            version: (this._engine.webGLVersion * 100).toString(),
            platformName: this._engine.webGLVersion >= 2 ? "WEBGL2" : "WEBGL1"
        };
        this._loadShader(vertexSource, "Vertex", "", function (vertexCode) {
            _this._rawVertexSourceCode = vertexCode;
            _this._loadShader(fragmentSource, "Fragment", "Pixel", function (fragmentCode) {
                _this._rawFragmentSourceCode = fragmentCode;
                ShaderProcessor.Process(vertexCode, processorOptions, function (migratedVertexCode) {
                    if (processFinalCode) {
                        migratedVertexCode = processFinalCode("vertex", migratedVertexCode);
                    }
                    processorOptions.isFragment = true;
                    ShaderProcessor.Process(fragmentCode, processorOptions, function (migratedFragmentCode) {
                        if (processFinalCode) {
                            migratedFragmentCode = processFinalCode("fragment", migratedFragmentCode);
                        }
                        _this._useFinalCode(migratedVertexCode, migratedFragmentCode, baseName);
                    }, _this._engine);
                }, _this._engine);
            });
        });
    }
    Object.defineProperty(Effect.prototype, "onBindObservable", {
        /**
         * Observable that will be called when effect is bound.
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
    Effect.prototype._useFinalCode = function (migratedVertexCode, migratedFragmentCode, baseName) {
        if (baseName) {
            var vertex = baseName.vertexElement || baseName.vertex || baseName.spectorName || baseName;
            var fragment = baseName.fragmentElement || baseName.fragment || baseName.spectorName || baseName;
            this._vertexSourceCode = "#define SHADER_NAME vertex:" + vertex + "\n" + migratedVertexCode;
            this._fragmentSourceCode = "#define SHADER_NAME fragment:" + fragment + "\n" + migratedFragmentCode;
        }
        else {
            this._vertexSourceCode = migratedVertexCode;
            this._fragmentSourceCode = migratedFragmentCode;
        }
        this._prepareEffect();
    };
    Object.defineProperty(Effect.prototype, "key", {
        /**
         * Unique key for this effect
         */
        get: function () {
            return this._key;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * If the effect has been compiled and prepared.
     * @returns if the effect is compiled and prepared.
     */
    Effect.prototype.isReady = function () {
        try {
            return this._isReadyInternal();
        }
        catch (_a) {
            return false;
        }
    };
    Effect.prototype._isReadyInternal = function () {
        if (this._isReady) {
            return true;
        }
        if (this._pipelineContext) {
            return this._pipelineContext.isReady;
        }
        return false;
    };
    /**
     * The engine the effect was initialized with.
     * @returns the engine.
     */
    Effect.prototype.getEngine = function () {
        return this._engine;
    };
    /**
     * The pipeline context for this effect
     * @returns the associated pipeline context
     */
    Effect.prototype.getPipelineContext = function () {
        return this._pipelineContext;
    };
    /**
     * The set of names of attribute variables for the shader.
     * @returns An array of attribute names.
     */
    Effect.prototype.getAttributesNames = function () {
        return this._attributesNames;
    };
    /**
     * Returns the attribute at the given index.
     * @param index The index of the attribute.
     * @returns The location of the attribute.
     */
    Effect.prototype.getAttributeLocation = function (index) {
        return this._attributes[index];
    };
    /**
     * Returns the attribute based on the name of the variable.
     * @param name of the attribute to look up.
     * @returns the attribute location.
     */
    Effect.prototype.getAttributeLocationByName = function (name) {
        return this._attributeLocationByName[name];
    };
    /**
     * The number of attributes.
     * @returns the numnber of attributes.
     */
    Effect.prototype.getAttributesCount = function () {
        return this._attributes.length;
    };
    /**
     * Gets the index of a uniform variable.
     * @param uniformName of the uniform to look up.
     * @returns the index.
     */
    Effect.prototype.getUniformIndex = function (uniformName) {
        return this._uniformsNames.indexOf(uniformName);
    };
    /**
     * Returns the attribute based on the name of the variable.
     * @param uniformName of the uniform to look up.
     * @returns the location of the uniform.
     */
    Effect.prototype.getUniform = function (uniformName) {
        return this._uniforms[uniformName];
    };
    /**
     * Returns an array of sampler variable names
     * @returns The array of sampler variable names.
     */
    Effect.prototype.getSamplers = function () {
        return this._samplerList;
    };
    /**
     * Returns an array of uniform variable names
     * @returns The array of uniform variable names.
     */
    Effect.prototype.getUniformNames = function () {
        return this._uniformsNames;
    };
    /**
     * Returns an array of uniform buffer variable names
     * @returns The array of uniform buffer variable names.
     */
    Effect.prototype.getUniformBuffersNames = function () {
        return this._uniformBuffersNamesList;
    };
    /**
     * Returns the index parameters used to create the effect
     * @returns The index parameters object
     */
    Effect.prototype.getIndexParameters = function () {
        return this._indexParameters;
    };
    /**
     * The error from the last compilation.
     * @returns the error string.
     */
    Effect.prototype.getCompilationError = function () {
        return this._compilationError;
    };
    /**
     * Gets a boolean indicating that all fallbacks were used during compilation
     * @returns true if all fallbacks were used
     */
    Effect.prototype.allFallbacksProcessed = function () {
        return this._allFallbacksProcessed;
    };
    /**
     * Adds a callback to the onCompiled observable and call the callback imediatly if already ready.
     * @param func The callback to be used.
     */
    Effect.prototype.executeWhenCompiled = function (func) {
        var _this = this;
        if (this.isReady()) {
            func(this);
            return;
        }
        this.onCompileObservable.add(function (effect) {
            func(effect);
        });
        if (!this._pipelineContext || this._pipelineContext.isAsync) {
            setTimeout(function () {
                _this._checkIsReady(null);
            }, 16);
        }
    };
    Effect.prototype._checkIsReady = function (previousPipelineContext) {
        var _this = this;
        try {
            if (this._isReadyInternal()) {
                return;
            }
        }
        catch (e) {
            this._processCompilationErrors(e, previousPipelineContext);
            return;
        }
        setTimeout(function () {
            _this._checkIsReady(previousPipelineContext);
        }, 16);
    };
    Effect.prototype._loadShader = function (shader, key, optionalKey, callback) {
        if (typeof (HTMLElement) !== "undefined") {
            // DOM element ?
            if (shader instanceof HTMLElement) {
                var shaderCode = DomManagement.GetDOMTextContent(shader);
                callback(shaderCode);
                return;
            }
        }
        // Direct source ?
        if (shader.substr(0, 7) === "source:") {
            callback(shader.substr(7));
            return;
        }
        // Base64 encoded ?
        if (shader.substr(0, 7) === "base64:") {
            var shaderBinary = window.atob(shader.substr(7));
            callback(shaderBinary);
            return;
        }
        // Is in local store ?
        if (Effect.ShadersStore[shader + key + "Shader"]) {
            callback(Effect.ShadersStore[shader + key + "Shader"]);
            return;
        }
        if (optionalKey && Effect.ShadersStore[shader + optionalKey + "Shader"]) {
            callback(Effect.ShadersStore[shader + optionalKey + "Shader"]);
            return;
        }
        var shaderUrl;
        if (shader[0] === "." || shader[0] === "/" || shader.indexOf("http") > -1) {
            shaderUrl = shader;
        }
        else {
            shaderUrl = Effect.ShadersRepository + shader;
        }
        // Vertex shader
        this._engine._loadFile(shaderUrl + "." + key.toLowerCase() + ".fx", callback);
    };
    Object.defineProperty(Effect.prototype, "vertexSourceCode", {
        /**
         * Gets the vertex shader source code of this effect
         */
        get: function () {
            return this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride ? this._vertexSourceCodeOverride : this._vertexSourceCode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Effect.prototype, "fragmentSourceCode", {
        /**
         * Gets the fragment shader source code of this effect
         */
        get: function () {
            return this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride ? this._fragmentSourceCodeOverride : this._fragmentSourceCode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Effect.prototype, "rawVertexSourceCode", {
        /**
         * Gets the vertex shader source code before it has been processed by the preprocessor
         */
        get: function () {
            return this._rawVertexSourceCode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Effect.prototype, "rawFragmentSourceCode", {
        /**
         * Gets the fragment shader source code before it has been processed by the preprocessor
         */
        get: function () {
            return this._rawFragmentSourceCode;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Recompiles the webGL program
     * @param vertexSourceCode The source code for the vertex shader.
     * @param fragmentSourceCode The source code for the fragment shader.
     * @param onCompiled Callback called when completed.
     * @param onError Callback called on error.
     * @hidden
     */
    Effect.prototype._rebuildProgram = function (vertexSourceCode, fragmentSourceCode, onCompiled, onError) {
        var _this = this;
        this._isReady = false;
        this._vertexSourceCodeOverride = vertexSourceCode;
        this._fragmentSourceCodeOverride = fragmentSourceCode;
        this.onError = function (effect, error) {
            if (onError) {
                onError(error);
            }
        };
        this.onCompiled = function () {
            var scenes = _this.getEngine().scenes;
            if (scenes) {
                for (var i = 0; i < scenes.length; i++) {
                    scenes[i].markAllMaterialsAsDirty(63);
                }
            }
            _this._pipelineContext._handlesSpectorRebuildCallback(onCompiled);
        };
        this._fallbacks = null;
        this._prepareEffect();
    };
    /**
     * Prepares the effect
     * @hidden
     */
    Effect.prototype._prepareEffect = function () {
        var _this = this;
        var attributesNames = this._attributesNames;
        var defines = this.defines;
        this._valueCache = {};
        var previousPipelineContext = this._pipelineContext;
        try {
            var engine_1 = this._engine;
            this._pipelineContext = engine_1.createPipelineContext();
            var rebuildRebind = this._rebuildProgram.bind(this);
            if (this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride) {
                engine_1._preparePipelineContext(this._pipelineContext, this._vertexSourceCodeOverride, this._fragmentSourceCodeOverride, true, rebuildRebind, null, this._transformFeedbackVaryings);
            }
            else {
                engine_1._preparePipelineContext(this._pipelineContext, this._vertexSourceCode, this._fragmentSourceCode, false, rebuildRebind, defines, this._transformFeedbackVaryings);
            }
            engine_1._executeWhenRenderingStateIsCompiled(this._pipelineContext, function () {
                if (engine_1.supportsUniformBuffers) {
                    for (var name in _this._uniformBuffersNames) {
                        _this.bindUniformBlock(name, _this._uniformBuffersNames[name]);
                    }
                }
                var uniforms = engine_1.getUniforms(_this._pipelineContext, _this._uniformsNames);
                uniforms.forEach(function (uniform, index) {
                    _this._uniforms[_this._uniformsNames[index]] = uniform;
                });
                _this._attributes = engine_1.getAttributes(_this._pipelineContext, attributesNames);
                if (attributesNames) {
                    for (var i = 0; i < attributesNames.length; i++) {
                        var name_1 = attributesNames[i];
                        _this._attributeLocationByName[name_1] = _this._attributes[i];
                    }
                }
                var index;
                for (index = 0; index < _this._samplerList.length; index++) {
                    var sampler = _this.getUniform(_this._samplerList[index]);
                    if (sampler == null) {
                        _this._samplerList.splice(index, 1);
                        index--;
                    }
                }
                _this._samplerList.forEach(function (name, index) {
                    _this._samplers[name] = index;
                });
                engine_1.bindSamplers(_this);
                _this._compilationError = "";
                _this._isReady = true;
                if (_this.onCompiled) {
                    _this.onCompiled(_this);
                }
                _this.onCompileObservable.notifyObservers(_this);
                _this.onCompileObservable.clear();
                // Unbind mesh reference in fallbacks
                if (_this._fallbacks) {
                    _this._fallbacks.unBindMesh();
                }
                if (previousPipelineContext) {
                    _this.getEngine()._deletePipelineContext(previousPipelineContext);
                }
            });
            if (this._pipelineContext.isAsync) {
                this._checkIsReady(previousPipelineContext);
            }
        }
        catch (e) {
            this._processCompilationErrors(e, previousPipelineContext);
        }
    };
    Effect.prototype._getShaderCodeAndErrorLine = function (code, error, isFragment) {
        var regexp = isFragment ? /FRAGMENT SHADER ERROR: 0:(\d+?):/ : /VERTEX SHADER ERROR: 0:(\d+?):/;
        var errorLine = null;
        if (error && code) {
            var res = error.match(regexp);
            if (res && res.length === 2) {
                var lineNumber = parseInt(res[1]);
                var lines = code.split("\n", -1);
                if (lines.length >= lineNumber) {
                    errorLine = "Offending line [" + lineNumber + "] in " + (isFragment ? "fragment" : "vertex") + " code: " + lines[lineNumber - 1];
                }
            }
        }
        return [code, errorLine];
    };
    Effect.prototype._processCompilationErrors = function (e, previousPipelineContext) {
        var _a, _b;
        var _c, _d, _e;
        if (previousPipelineContext === void 0) { previousPipelineContext = null; }
        this._compilationError = e.message;
        var attributesNames = this._attributesNames;
        var fallbacks = this._fallbacks;
        // Let's go through fallbacks then
        Logger.Error("Unable to compile effect:");
        Logger.Error("Uniforms: " + this._uniformsNames.map(function (uniform) {
            return " " + uniform;
        }));
        Logger.Error("Attributes: " + attributesNames.map(function (attribute) {
            return " " + attribute;
        }));
        Logger.Error("Defines:\r\n" + this.defines);
        if (Effect.LogShaderCodeOnCompilationError) {
            var lineErrorVertex = null, lineErrorFragment = null, code = null;
            if ((_c = this._pipelineContext) === null || _c === void 0 ? void 0 : _c._getVertexShaderCode()) {
                _a = this._getShaderCodeAndErrorLine(this._pipelineContext._getVertexShaderCode(), this._compilationError, false), code = _a[0], lineErrorVertex = _a[1];
                if (code) {
                    Logger.Error("Vertex code:");
                    Logger.Error(code);
                }
            }
            if ((_d = this._pipelineContext) === null || _d === void 0 ? void 0 : _d._getFragmentShaderCode()) {
                _b = this._getShaderCodeAndErrorLine((_e = this._pipelineContext) === null || _e === void 0 ? void 0 : _e._getFragmentShaderCode(), this._compilationError, true), code = _b[0], lineErrorFragment = _b[1];
                if (code) {
                    Logger.Error("Fragment code:");
                    Logger.Error(code);
                }
            }
            if (lineErrorVertex) {
                Logger.Error(lineErrorVertex);
            }
            if (lineErrorFragment) {
                Logger.Error(lineErrorFragment);
            }
        }
        Logger.Error("Error: " + this._compilationError);
        if (previousPipelineContext) {
            this._pipelineContext = previousPipelineContext;
            this._isReady = true;
            if (this.onError) {
                this.onError(this, this._compilationError);
            }
            this.onErrorObservable.notifyObservers(this);
        }
        if (fallbacks) {
            this._pipelineContext = null;
            if (fallbacks.hasMoreFallbacks) {
                this._allFallbacksProcessed = false;
                Logger.Error("Trying next fallback.");
                this.defines = fallbacks.reduce(this.defines, this);
                this._prepareEffect();
            }
            else { // Sorry we did everything we can
                this._allFallbacksProcessed = true;
                if (this.onError) {
                    this.onError(this, this._compilationError);
                }
                this.onErrorObservable.notifyObservers(this);
                this.onErrorObservable.clear();
                // Unbind mesh reference in fallbacks
                if (this._fallbacks) {
                    this._fallbacks.unBindMesh();
                }
            }
        }
        else {
            this._allFallbacksProcessed = true;
        }
    };
    Object.defineProperty(Effect.prototype, "isSupported", {
        /**
         * Checks if the effect is supported. (Must be called after compilation)
         */
        get: function () {
            return this._compilationError === "";
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Binds a texture to the engine to be used as output of the shader.
     * @param channel Name of the output variable.
     * @param texture Texture to bind.
     * @hidden
     */
    Effect.prototype._bindTexture = function (channel, texture) {
        this._engine._bindTexture(this._samplers[channel], texture);
    };
    /**
     * Sets a texture on the engine to be used in the shader.
     * @param channel Name of the sampler variable.
     * @param texture Texture to set.
     */
    Effect.prototype.setTexture = function (channel, texture) {
        this._engine.setTexture(this._samplers[channel], this._uniforms[channel], texture);
    };
    /**
     * Sets a depth stencil texture from a render target on the engine to be used in the shader.
     * @param channel Name of the sampler variable.
     * @param texture Texture to set.
     */
    Effect.prototype.setDepthStencilTexture = function (channel, texture) {
        this._engine.setDepthStencilTexture(this._samplers[channel], this._uniforms[channel], texture);
    };
    /**
     * Sets an array of textures on the engine to be used in the shader.
     * @param channel Name of the variable.
     * @param textures Textures to set.
     */
    Effect.prototype.setTextureArray = function (channel, textures) {
        var exName = channel + "Ex";
        if (this._samplerList.indexOf(exName + "0") === -1) {
            var initialPos = this._samplerList.indexOf(channel);
            for (var index = 1; index < textures.length; index++) {
                var currentExName = exName + (index - 1).toString();
                this._samplerList.splice(initialPos + index, 0, currentExName);
            }
            // Reset every channels
            var channelIndex = 0;
            for (var _i = 0, _a = this._samplerList; _i < _a.length; _i++) {
                var key = _a[_i];
                this._samplers[key] = channelIndex;
                channelIndex += 1;
            }
        }
        this._engine.setTextureArray(this._samplers[channel], this._uniforms[channel], textures);
    };
    /**
     * Sets a texture to be the input of the specified post process. (To use the output, pass in the next post process in the pipeline)
     * @param channel Name of the sampler variable.
     * @param postProcess Post process to get the input texture from.
     */
    Effect.prototype.setTextureFromPostProcess = function (channel, postProcess) {
        this._engine.setTextureFromPostProcess(this._samplers[channel], postProcess);
    };
    /**
     * (Warning! setTextureFromPostProcessOutput may be desired instead)
     * Sets the input texture of the passed in post process to be input of this effect. (To use the output of the passed in post process use setTextureFromPostProcessOutput)
     * @param channel Name of the sampler variable.
     * @param postProcess Post process to get the output texture from.
     */
    Effect.prototype.setTextureFromPostProcessOutput = function (channel, postProcess) {
        this._engine.setTextureFromPostProcessOutput(this._samplers[channel], postProcess);
    };
    /** @hidden */
    Effect.prototype._cacheMatrix = function (uniformName, matrix) {
        var cache = this._valueCache[uniformName];
        var flag = matrix.updateFlag;
        if (cache !== undefined && cache === flag) {
            return false;
        }
        this._valueCache[uniformName] = flag;
        return true;
    };
    /** @hidden */
    Effect.prototype._cacheFloat2 = function (uniformName, x, y) {
        var cache = this._valueCache[uniformName];
        if (!cache || cache.length !== 2) {
            cache = [x, y];
            this._valueCache[uniformName] = cache;
            return true;
        }
        var changed = false;
        if (cache[0] !== x) {
            cache[0] = x;
            changed = true;
        }
        if (cache[1] !== y) {
            cache[1] = y;
            changed = true;
        }
        return changed;
    };
    /** @hidden */
    Effect.prototype._cacheFloat3 = function (uniformName, x, y, z) {
        var cache = this._valueCache[uniformName];
        if (!cache || cache.length !== 3) {
            cache = [x, y, z];
            this._valueCache[uniformName] = cache;
            return true;
        }
        var changed = false;
        if (cache[0] !== x) {
            cache[0] = x;
            changed = true;
        }
        if (cache[1] !== y) {
            cache[1] = y;
            changed = true;
        }
        if (cache[2] !== z) {
            cache[2] = z;
            changed = true;
        }
        return changed;
    };
    /** @hidden */
    Effect.prototype._cacheFloat4 = function (uniformName, x, y, z, w) {
        var cache = this._valueCache[uniformName];
        if (!cache || cache.length !== 4) {
            cache = [x, y, z, w];
            this._valueCache[uniformName] = cache;
            return true;
        }
        var changed = false;
        if (cache[0] !== x) {
            cache[0] = x;
            changed = true;
        }
        if (cache[1] !== y) {
            cache[1] = y;
            changed = true;
        }
        if (cache[2] !== z) {
            cache[2] = z;
            changed = true;
        }
        if (cache[3] !== w) {
            cache[3] = w;
            changed = true;
        }
        return changed;
    };
    /**
     * Binds a buffer to a uniform.
     * @param buffer Buffer to bind.
     * @param name Name of the uniform variable to bind to.
     */
    Effect.prototype.bindUniformBuffer = function (buffer, name) {
        var bufferName = this._uniformBuffersNames[name];
        if (bufferName === undefined || Effect._baseCache[bufferName] === buffer) {
            return;
        }
        Effect._baseCache[bufferName] = buffer;
        this._engine.bindUniformBufferBase(buffer, bufferName);
    };
    /**
     * Binds block to a uniform.
     * @param blockName Name of the block to bind.
     * @param index Index to bind.
     */
    Effect.prototype.bindUniformBlock = function (blockName, index) {
        this._engine.bindUniformBlock(this._pipelineContext, blockName, index);
    };
    /**
     * Sets an interger value on a uniform variable.
     * @param uniformName Name of the variable.
     * @param value Value to be set.
     * @returns this effect.
     */
    Effect.prototype.setInt = function (uniformName, value) {
        var cache = this._valueCache[uniformName];
        if (cache !== undefined && cache === value) {
            return this;
        }
        if (this._engine.setInt(this._uniforms[uniformName], value)) {
            this._valueCache[uniformName] = value;
        }
        return this;
    };
    /**
     * Sets an int array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setIntArray = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setIntArray(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an int array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setIntArray2 = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setIntArray2(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an int array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setIntArray3 = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setIntArray3(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an int array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setIntArray4 = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setIntArray4(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an float array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setFloatArray = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setArray(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an float array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setFloatArray2 = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setArray2(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an float array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setFloatArray3 = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setArray3(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an float array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setFloatArray4 = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setArray4(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an array on a uniform variable.
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setArray = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setArray(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setArray2 = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setArray2(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setArray3 = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setArray3(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets an array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
     * @param uniformName Name of the variable.
     * @param array array to be set.
     * @returns this effect.
     */
    Effect.prototype.setArray4 = function (uniformName, array) {
        this._valueCache[uniformName] = null;
        this._engine.setArray4(this._uniforms[uniformName], array);
        return this;
    };
    /**
     * Sets matrices on a uniform variable.
     * @param uniformName Name of the variable.
     * @param matrices matrices to be set.
     * @returns this effect.
     */
    Effect.prototype.setMatrices = function (uniformName, matrices) {
        if (!matrices) {
            return this;
        }
        this._valueCache[uniformName] = null;
        this._engine.setMatrices(this._uniforms[uniformName], matrices); // the cast is ok because it is gl.uniformMatrix4fv() which is called at the end, and this function accepts Float32Array and Array<number>
        return this;
    };
    /**
     * Sets matrix on a uniform variable.
     * @param uniformName Name of the variable.
     * @param matrix matrix to be set.
     * @returns this effect.
     */
    Effect.prototype.setMatrix = function (uniformName, matrix) {
        if (this._cacheMatrix(uniformName, matrix)) {
            if (!this._engine.setMatrices(this._uniforms[uniformName], matrix.toArray())) {
                this._valueCache[uniformName] = null;
            }
        }
        return this;
    };
    /**
     * Sets a 3x3 matrix on a uniform variable. (Speicified as [1,2,3,4,5,6,7,8,9] will result in [1,2,3][4,5,6][7,8,9] matrix)
     * @param uniformName Name of the variable.
     * @param matrix matrix to be set.
     * @returns this effect.
     */
    Effect.prototype.setMatrix3x3 = function (uniformName, matrix) {
        this._valueCache[uniformName] = null;
        this._engine.setMatrix3x3(this._uniforms[uniformName], matrix); // the cast is ok because it is gl.uniformMatrix3fv() which is called at the end, and this function accepts Float32Array and Array<number>
        return this;
    };
    /**
     * Sets a 2x2 matrix on a uniform variable. (Speicified as [1,2,3,4] will result in [1,2][3,4] matrix)
     * @param uniformName Name of the variable.
     * @param matrix matrix to be set.
     * @returns this effect.
     */
    Effect.prototype.setMatrix2x2 = function (uniformName, matrix) {
        this._valueCache[uniformName] = null;
        this._engine.setMatrix2x2(this._uniforms[uniformName], matrix); // the cast is ok because it is gl.uniformMatrix2fv() which is called at the end, and this function accepts Float32Array and Array<number>
        return this;
    };
    /**
     * Sets a float on a uniform variable.
     * @param uniformName Name of the variable.
     * @param value value to be set.
     * @returns this effect.
     */
    Effect.prototype.setFloat = function (uniformName, value) {
        var cache = this._valueCache[uniformName];
        if (cache !== undefined && cache === value) {
            return this;
        }
        if (this._engine.setFloat(this._uniforms[uniformName], value)) {
            this._valueCache[uniformName] = value;
        }
        return this;
    };
    /**
     * Sets a boolean on a uniform variable.
     * @param uniformName Name of the variable.
     * @param bool value to be set.
     * @returns this effect.
     */
    Effect.prototype.setBool = function (uniformName, bool) {
        var cache = this._valueCache[uniformName];
        if (cache !== undefined && cache === bool) {
            return this;
        }
        if (this._engine.setInt(this._uniforms[uniformName], bool ? 1 : 0)) {
            this._valueCache[uniformName] = bool;
        }
        return this;
    };
    /**
     * Sets a Vector2 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector2 vector2 to be set.
     * @returns this effect.
     */
    Effect.prototype.setVector2 = function (uniformName, vector2) {
        if (this._cacheFloat2(uniformName, vector2.x, vector2.y)) {
            if (!this._engine.setFloat2(this._uniforms[uniformName], vector2.x, vector2.y)) {
                this._valueCache[uniformName] = null;
            }
        }
        return this;
    };
    /**
     * Sets a float2 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First float in float2.
     * @param y Second float in float2.
     * @returns this effect.
     */
    Effect.prototype.setFloat2 = function (uniformName, x, y) {
        if (this._cacheFloat2(uniformName, x, y)) {
            if (!this._engine.setFloat2(this._uniforms[uniformName], x, y)) {
                this._valueCache[uniformName] = null;
            }
        }
        return this;
    };
    /**
     * Sets a Vector3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector3 Value to be set.
     * @returns this effect.
     */
    Effect.prototype.setVector3 = function (uniformName, vector3) {
        if (this._cacheFloat3(uniformName, vector3.x, vector3.y, vector3.z)) {
            if (!this._engine.setFloat3(this._uniforms[uniformName], vector3.x, vector3.y, vector3.z)) {
                this._valueCache[uniformName] = null;
            }
        }
        return this;
    };
    /**
     * Sets a float3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First float in float3.
     * @param y Second float in float3.
     * @param z Third float in float3.
     * @returns this effect.
     */
    Effect.prototype.setFloat3 = function (uniformName, x, y, z) {
        if (this._cacheFloat3(uniformName, x, y, z)) {
            if (!this._engine.setFloat3(this._uniforms[uniformName], x, y, z)) {
                this._valueCache[uniformName] = null;
            }
        }
        return this;
    };
    /**
     * Sets a Vector4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector4 Value to be set.
     * @returns this effect.
     */
    Effect.prototype.setVector4 = function (uniformName, vector4) {
        if (this._cacheFloat4(uniformName, vector4.x, vector4.y, vector4.z, vector4.w)) {
            if (!this._engine.setFloat4(this._uniforms[uniformName], vector4.x, vector4.y, vector4.z, vector4.w)) {
                this._valueCache[uniformName] = null;
            }
        }
        return this;
    };
    /**
     * Sets a float4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param x First float in float4.
     * @param y Second float in float4.
     * @param z Third float in float4.
     * @param w Fourth float in float4.
     * @returns this effect.
     */
    Effect.prototype.setFloat4 = function (uniformName, x, y, z, w) {
        if (this._cacheFloat4(uniformName, x, y, z, w)) {
            if (!this._engine.setFloat4(this._uniforms[uniformName], x, y, z, w)) {
                this._valueCache[uniformName] = null;
            }
        }
        return this;
    };
    /**
     * Sets a Color3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param color3 Value to be set.
     * @returns this effect.
     */
    Effect.prototype.setColor3 = function (uniformName, color3) {
        if (this._cacheFloat3(uniformName, color3.r, color3.g, color3.b)) {
            if (!this._engine.setFloat3(this._uniforms[uniformName], color3.r, color3.g, color3.b)) {
                this._valueCache[uniformName] = null;
            }
        }
        return this;
    };
    /**
     * Sets a Color4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param color3 Value to be set.
     * @param alpha Alpha value to be set.
     * @returns this effect.
     */
    Effect.prototype.setColor4 = function (uniformName, color3, alpha) {
        if (this._cacheFloat4(uniformName, color3.r, color3.g, color3.b, alpha)) {
            if (!this._engine.setFloat4(this._uniforms[uniformName], color3.r, color3.g, color3.b, alpha)) {
                this._valueCache[uniformName] = null;
            }
        }
        return this;
    };
    /**
     * Sets a Color4 on a uniform variable
     * @param uniformName defines the name of the variable
     * @param color4 defines the value to be set
     * @returns this effect.
     */
    Effect.prototype.setDirectColor4 = function (uniformName, color4) {
        if (this._cacheFloat4(uniformName, color4.r, color4.g, color4.b, color4.a)) {
            if (!this._engine.setFloat4(this._uniforms[uniformName], color4.r, color4.g, color4.b, color4.a)) {
                this._valueCache[uniformName] = null;
            }
        }
        return this;
    };
    /** Release all associated resources */
    Effect.prototype.dispose = function () {
        this._engine._releaseEffect(this);
    };
    /**
     * This function will add a new shader to the shader store
     * @param name the name of the shader
     * @param pixelShader optional pixel shader content
     * @param vertexShader optional vertex shader content
     */
    Effect.RegisterShader = function (name, pixelShader, vertexShader) {
        if (pixelShader) {
            Effect.ShadersStore[name + "PixelShader"] = pixelShader;
        }
        if (vertexShader) {
            Effect.ShadersStore[name + "VertexShader"] = vertexShader;
        }
    };
    /**
     * Resets the cache of effects.
     */
    Effect.ResetCache = function () {
        Effect._baseCache = {};
    };
    /**
     * Gets or sets the relative url used to load shaders if using the engine in non-minified mode
     */
    Effect.ShadersRepository = "src/Shaders/";
    /**
     * Enable logging of the shader code when a compilation error occurs
     */
    Effect.LogShaderCodeOnCompilationError = true;
    Effect._uniqueIdSeed = 0;
    Effect._baseCache = {};
    /**
     * Store of each shader (The can be looked up using effect.key)
     */
    Effect.ShadersStore = {};
    /**
     * Store of each included file for a shader (The can be looked up using effect.key)
     */
    Effect.IncludesShadersStore = {};
    return Effect;
}());

/**
 * @hidden
 **/
var DepthCullingState = /** @class */ (function () {
    /**
     * Initializes the state.
     */
    function DepthCullingState() {
        this._isDepthTestDirty = false;
        this._isDepthMaskDirty = false;
        this._isDepthFuncDirty = false;
        this._isCullFaceDirty = false;
        this._isCullDirty = false;
        this._isZOffsetDirty = false;
        this._isFrontFaceDirty = false;
        this.reset();
    }
    Object.defineProperty(DepthCullingState.prototype, "isDirty", {
        get: function () {
            return this._isDepthFuncDirty || this._isDepthTestDirty || this._isDepthMaskDirty || this._isCullFaceDirty || this._isCullDirty || this._isZOffsetDirty || this._isFrontFaceDirty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DepthCullingState.prototype, "zOffset", {
        get: function () {
            return this._zOffset;
        },
        set: function (value) {
            if (this._zOffset === value) {
                return;
            }
            this._zOffset = value;
            this._isZOffsetDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DepthCullingState.prototype, "cullFace", {
        get: function () {
            return this._cullFace;
        },
        set: function (value) {
            if (this._cullFace === value) {
                return;
            }
            this._cullFace = value;
            this._isCullFaceDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DepthCullingState.prototype, "cull", {
        get: function () {
            return this._cull;
        },
        set: function (value) {
            if (this._cull === value) {
                return;
            }
            this._cull = value;
            this._isCullDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DepthCullingState.prototype, "depthFunc", {
        get: function () {
            return this._depthFunc;
        },
        set: function (value) {
            if (this._depthFunc === value) {
                return;
            }
            this._depthFunc = value;
            this._isDepthFuncDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DepthCullingState.prototype, "depthMask", {
        get: function () {
            return this._depthMask;
        },
        set: function (value) {
            if (this._depthMask === value) {
                return;
            }
            this._depthMask = value;
            this._isDepthMaskDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DepthCullingState.prototype, "depthTest", {
        get: function () {
            return this._depthTest;
        },
        set: function (value) {
            if (this._depthTest === value) {
                return;
            }
            this._depthTest = value;
            this._isDepthTestDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DepthCullingState.prototype, "frontFace", {
        get: function () {
            return this._frontFace;
        },
        set: function (value) {
            if (this._frontFace === value) {
                return;
            }
            this._frontFace = value;
            this._isFrontFaceDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    DepthCullingState.prototype.reset = function () {
        this._depthMask = true;
        this._depthTest = true;
        this._depthFunc = null;
        this._cullFace = null;
        this._cull = null;
        this._zOffset = 0;
        this._frontFace = null;
        this._isDepthTestDirty = true;
        this._isDepthMaskDirty = true;
        this._isDepthFuncDirty = false;
        this._isCullFaceDirty = false;
        this._isCullDirty = false;
        this._isZOffsetDirty = false;
        this._isFrontFaceDirty = false;
    };
    DepthCullingState.prototype.apply = function (gl) {
        if (!this.isDirty) {
            return;
        }
        // Cull
        if (this._isCullDirty) {
            if (this.cull) {
                gl.enable(gl.CULL_FACE);
            }
            else {
                gl.disable(gl.CULL_FACE);
            }
            this._isCullDirty = false;
        }
        // Cull face
        if (this._isCullFaceDirty) {
            gl.cullFace(this.cullFace);
            this._isCullFaceDirty = false;
        }
        // Depth mask
        if (this._isDepthMaskDirty) {
            gl.depthMask(this.depthMask);
            this._isDepthMaskDirty = false;
        }
        // Depth test
        if (this._isDepthTestDirty) {
            if (this.depthTest) {
                gl.enable(gl.DEPTH_TEST);
            }
            else {
                gl.disable(gl.DEPTH_TEST);
            }
            this._isDepthTestDirty = false;
        }
        // Depth func
        if (this._isDepthFuncDirty) {
            gl.depthFunc(this.depthFunc);
            this._isDepthFuncDirty = false;
        }
        // zOffset
        if (this._isZOffsetDirty) {
            if (this.zOffset) {
                gl.enable(gl.POLYGON_OFFSET_FILL);
                gl.polygonOffset(this.zOffset, 0);
            }
            else {
                gl.disable(gl.POLYGON_OFFSET_FILL);
            }
            this._isZOffsetDirty = false;
        }
        // Front face
        if (this._isFrontFaceDirty) {
            gl.frontFace(this.frontFace);
            this._isFrontFaceDirty = false;
        }
    };
    return DepthCullingState;
}());

/**
 * @hidden
 **/
var StencilState = /** @class */ (function () {
    function StencilState() {
        this._isStencilTestDirty = false;
        this._isStencilMaskDirty = false;
        this._isStencilFuncDirty = false;
        this._isStencilOpDirty = false;
        this.reset();
    }
    Object.defineProperty(StencilState.prototype, "isDirty", {
        get: function () {
            return this._isStencilTestDirty || this._isStencilMaskDirty || this._isStencilFuncDirty || this._isStencilOpDirty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StencilState.prototype, "stencilFunc", {
        get: function () {
            return this._stencilFunc;
        },
        set: function (value) {
            if (this._stencilFunc === value) {
                return;
            }
            this._stencilFunc = value;
            this._isStencilFuncDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StencilState.prototype, "stencilFuncRef", {
        get: function () {
            return this._stencilFuncRef;
        },
        set: function (value) {
            if (this._stencilFuncRef === value) {
                return;
            }
            this._stencilFuncRef = value;
            this._isStencilFuncDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StencilState.prototype, "stencilFuncMask", {
        get: function () {
            return this._stencilFuncMask;
        },
        set: function (value) {
            if (this._stencilFuncMask === value) {
                return;
            }
            this._stencilFuncMask = value;
            this._isStencilFuncDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StencilState.prototype, "stencilOpStencilFail", {
        get: function () {
            return this._stencilOpStencilFail;
        },
        set: function (value) {
            if (this._stencilOpStencilFail === value) {
                return;
            }
            this._stencilOpStencilFail = value;
            this._isStencilOpDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StencilState.prototype, "stencilOpDepthFail", {
        get: function () {
            return this._stencilOpDepthFail;
        },
        set: function (value) {
            if (this._stencilOpDepthFail === value) {
                return;
            }
            this._stencilOpDepthFail = value;
            this._isStencilOpDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StencilState.prototype, "stencilOpStencilDepthPass", {
        get: function () {
            return this._stencilOpStencilDepthPass;
        },
        set: function (value) {
            if (this._stencilOpStencilDepthPass === value) {
                return;
            }
            this._stencilOpStencilDepthPass = value;
            this._isStencilOpDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StencilState.prototype, "stencilMask", {
        get: function () {
            return this._stencilMask;
        },
        set: function (value) {
            if (this._stencilMask === value) {
                return;
            }
            this._stencilMask = value;
            this._isStencilMaskDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StencilState.prototype, "stencilTest", {
        get: function () {
            return this._stencilTest;
        },
        set: function (value) {
            if (this._stencilTest === value) {
                return;
            }
            this._stencilTest = value;
            this._isStencilTestDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    StencilState.prototype.reset = function () {
        this._stencilTest = false;
        this._stencilMask = 0xFF;
        this._stencilFunc = StencilState.ALWAYS;
        this._stencilFuncRef = 1;
        this._stencilFuncMask = 0xFF;
        this._stencilOpStencilFail = StencilState.KEEP;
        this._stencilOpDepthFail = StencilState.KEEP;
        this._stencilOpStencilDepthPass = StencilState.REPLACE;
        this._isStencilTestDirty = true;
        this._isStencilMaskDirty = true;
        this._isStencilFuncDirty = true;
        this._isStencilOpDirty = true;
    };
    StencilState.prototype.apply = function (gl) {
        if (!this.isDirty) {
            return;
        }
        // Stencil test
        if (this._isStencilTestDirty) {
            if (this.stencilTest) {
                gl.enable(gl.STENCIL_TEST);
            }
            else {
                gl.disable(gl.STENCIL_TEST);
            }
            this._isStencilTestDirty = false;
        }
        // Stencil mask
        if (this._isStencilMaskDirty) {
            gl.stencilMask(this.stencilMask);
            this._isStencilMaskDirty = false;
        }
        // Stencil func
        if (this._isStencilFuncDirty) {
            gl.stencilFunc(this.stencilFunc, this.stencilFuncRef, this.stencilFuncMask);
            this._isStencilFuncDirty = false;
        }
        // Stencil op
        if (this._isStencilOpDirty) {
            gl.stencilOp(this.stencilOpStencilFail, this.stencilOpDepthFail, this.stencilOpStencilDepthPass);
            this._isStencilOpDirty = false;
        }
    };
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn */
    StencilState.ALWAYS = 519;
    /** Passed to stencilOperation to specify that stencil value must be kept */
    StencilState.KEEP = 7680;
    /** Passed to stencilOperation to specify that stencil value must be replaced */
    StencilState.REPLACE = 7681;
    return StencilState;
}());

/**
 * @hidden
 **/
var AlphaState = /** @class */ (function () {
    /**
     * Initializes the state.
     */
    function AlphaState() {
        this._isAlphaBlendDirty = false;
        this._isBlendFunctionParametersDirty = false;
        this._isBlendEquationParametersDirty = false;
        this._isBlendConstantsDirty = false;
        this._alphaBlend = false;
        this._blendFunctionParameters = new Array(4);
        this._blendEquationParameters = new Array(2);
        this._blendConstants = new Array(4);
        this.reset();
    }
    Object.defineProperty(AlphaState.prototype, "isDirty", {
        get: function () {
            return this._isAlphaBlendDirty || this._isBlendFunctionParametersDirty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AlphaState.prototype, "alphaBlend", {
        get: function () {
            return this._alphaBlend;
        },
        set: function (value) {
            if (this._alphaBlend === value) {
                return;
            }
            this._alphaBlend = value;
            this._isAlphaBlendDirty = true;
        },
        enumerable: false,
        configurable: true
    });
    AlphaState.prototype.setAlphaBlendConstants = function (r, g, b, a) {
        if (this._blendConstants[0] === r &&
            this._blendConstants[1] === g &&
            this._blendConstants[2] === b &&
            this._blendConstants[3] === a) {
            return;
        }
        this._blendConstants[0] = r;
        this._blendConstants[1] = g;
        this._blendConstants[2] = b;
        this._blendConstants[3] = a;
        this._isBlendConstantsDirty = true;
    };
    AlphaState.prototype.setAlphaBlendFunctionParameters = function (value0, value1, value2, value3) {
        if (this._blendFunctionParameters[0] === value0 &&
            this._blendFunctionParameters[1] === value1 &&
            this._blendFunctionParameters[2] === value2 &&
            this._blendFunctionParameters[3] === value3) {
            return;
        }
        this._blendFunctionParameters[0] = value0;
        this._blendFunctionParameters[1] = value1;
        this._blendFunctionParameters[2] = value2;
        this._blendFunctionParameters[3] = value3;
        this._isBlendFunctionParametersDirty = true;
    };
    AlphaState.prototype.setAlphaEquationParameters = function (rgb, alpha) {
        if (this._blendEquationParameters[0] === rgb &&
            this._blendEquationParameters[1] === alpha) {
            return;
        }
        this._blendEquationParameters[0] = rgb;
        this._blendEquationParameters[1] = alpha;
        this._isBlendEquationParametersDirty = true;
    };
    AlphaState.prototype.reset = function () {
        this._alphaBlend = false;
        this._blendFunctionParameters[0] = null;
        this._blendFunctionParameters[1] = null;
        this._blendFunctionParameters[2] = null;
        this._blendFunctionParameters[3] = null;
        this._blendEquationParameters[0] = null;
        this._blendEquationParameters[1] = null;
        this._blendConstants[0] = null;
        this._blendConstants[1] = null;
        this._blendConstants[2] = null;
        this._blendConstants[3] = null;
        this._isAlphaBlendDirty = true;
        this._isBlendFunctionParametersDirty = false;
        this._isBlendEquationParametersDirty = false;
        this._isBlendConstantsDirty = false;
    };
    AlphaState.prototype.apply = function (gl) {
        if (!this.isDirty) {
            return;
        }
        // Alpha blend
        if (this._isAlphaBlendDirty) {
            if (this._alphaBlend) {
                gl.enable(gl.BLEND);
            }
            else {
                gl.disable(gl.BLEND);
            }
            this._isAlphaBlendDirty = false;
        }
        // Alpha function
        if (this._isBlendFunctionParametersDirty) {
            gl.blendFuncSeparate(this._blendFunctionParameters[0], this._blendFunctionParameters[1], this._blendFunctionParameters[2], this._blendFunctionParameters[3]);
            this._isBlendFunctionParametersDirty = false;
        }
        // Alpha equation
        if (this._isBlendEquationParametersDirty) {
            gl.blendEquationSeparate(this._blendEquationParameters[0], this._blendEquationParameters[1]);
            this._isBlendEquationParametersDirty = false;
        }
        // Constants
        if (this._isBlendConstantsDirty) {
            gl.blendColor(this._blendConstants[0], this._blendConstants[1], this._blendConstants[2], this._blendConstants[3]);
            this._isBlendConstantsDirty = false;
        }
    };
    return AlphaState;
}());

/**
 * Define options used to create a render target texture
 */
var RenderTargetCreationOptions = /** @class */ (function () {
    function RenderTargetCreationOptions() {
    }
    return RenderTargetCreationOptions;
}());

/**
 * Defines the source of the internal texture
 */
var InternalTextureSource;
(function (InternalTextureSource) {
    /**
     * The source of the texture data is unknown
     */
    InternalTextureSource[InternalTextureSource["Unknown"] = 0] = "Unknown";
    /**
    * Texture data comes from an URL
    */
    InternalTextureSource[InternalTextureSource["Url"] = 1] = "Url";
    /**
     * Texture data is only used for temporary storage
     */
    InternalTextureSource[InternalTextureSource["Temp"] = 2] = "Temp";
    /**
     * Texture data comes from raw data (ArrayBuffer)
     */
    InternalTextureSource[InternalTextureSource["Raw"] = 3] = "Raw";
    /**
     * Texture content is dynamic (video or dynamic texture)
     */
    InternalTextureSource[InternalTextureSource["Dynamic"] = 4] = "Dynamic";
    /**
     * Texture content is generated by rendering to it
     */
    InternalTextureSource[InternalTextureSource["RenderTarget"] = 5] = "RenderTarget";
    /**
     * Texture content is part of a multi render target process
     */
    InternalTextureSource[InternalTextureSource["MultiRenderTarget"] = 6] = "MultiRenderTarget";
    /**
     * Texture data comes from a cube data file
     */
    InternalTextureSource[InternalTextureSource["Cube"] = 7] = "Cube";
    /**
     * Texture data comes from a raw cube data
     */
    InternalTextureSource[InternalTextureSource["CubeRaw"] = 8] = "CubeRaw";
    /**
     * Texture data come from a prefiltered cube data file
     */
    InternalTextureSource[InternalTextureSource["CubePrefiltered"] = 9] = "CubePrefiltered";
    /**
     * Texture content is raw 3D data
     */
    InternalTextureSource[InternalTextureSource["Raw3D"] = 10] = "Raw3D";
    /**
     * Texture content is raw 2D array data
     */
    InternalTextureSource[InternalTextureSource["Raw2DArray"] = 11] = "Raw2DArray";
    /**
     * Texture content is a depth texture
     */
    InternalTextureSource[InternalTextureSource["Depth"] = 12] = "Depth";
    /**
     * Texture data comes from a raw cube data encoded with RGBD
     */
    InternalTextureSource[InternalTextureSource["CubeRawRGBD"] = 13] = "CubeRawRGBD";
})(InternalTextureSource || (InternalTextureSource = {}));
/**
 * Class used to store data associated with WebGL texture data for the engine
 * This class should not be used directly
 */
var InternalTexture = /** @class */ (function () {
    /**
     * Creates a new InternalTexture
     * @param engine defines the engine to use
     * @param source defines the type of data that will be used
     * @param delayAllocation if the texture allocation should be delayed (default: false)
     */
    function InternalTexture(engine, source, delayAllocation) {
        if (delayAllocation === void 0) { delayAllocation = false; }
        /**
         * Defines if the texture is ready
         */
        this.isReady = false;
        /**
         * Defines if the texture is a cube texture
         */
        this.isCube = false;
        /**
         * Defines if the texture contains 3D data
         */
        this.is3D = false;
        /**
         * Defines if the texture contains 2D array data
         */
        this.is2DArray = false;
        /**
         * Defines if the texture contains multiview data
         */
        this.isMultiview = false;
        /**
         * Gets the URL used to load this texture
         */
        this.url = "";
        /**
         * Gets the sampling mode of the texture
         */
        this.samplingMode = -1;
        /**
         * Gets a boolean indicating if the texture needs mipmaps generation
         */
        this.generateMipMaps = false;
        /**
         * Gets the number of samples used by the texture (WebGL2+ only)
         */
        this.samples = 0;
        /**
         * Gets the type of the texture (int, float...)
         */
        this.type = -1;
        /**
         * Gets the format of the texture (RGB, RGBA...)
         */
        this.format = -1;
        /**
         * Observable called when the texture is loaded
         */
        this.onLoadedObservable = new Observable();
        /**
         * Gets the width of the texture
         */
        this.width = 0;
        /**
         * Gets the height of the texture
         */
        this.height = 0;
        /**
         * Gets the depth of the texture
         */
        this.depth = 0;
        /**
         * Gets the initial width of the texture (It could be rescaled if the current system does not support non power of two textures)
         */
        this.baseWidth = 0;
        /**
         * Gets the initial height of the texture (It could be rescaled if the current system does not support non power of two textures)
         */
        this.baseHeight = 0;
        /**
         * Gets the initial depth of the texture (It could be rescaled if the current system does not support non power of two textures)
         */
        this.baseDepth = 0;
        /**
         * Gets a boolean indicating if the texture is inverted on Y axis
         */
        this.invertY = false;
        // Private
        /** @hidden */
        this._invertVScale = false;
        /** @hidden */
        this._associatedChannel = -1;
        /** @hidden */
        this._source = InternalTextureSource.Unknown;
        /** @hidden */
        this._buffer = null;
        /** @hidden */
        this._bufferView = null;
        /** @hidden */
        this._bufferViewArray = null;
        /** @hidden */
        this._bufferViewArrayArray = null;
        /** @hidden */
        this._size = 0;
        /** @hidden */
        this._extension = "";
        /** @hidden */
        this._files = null;
        /** @hidden */
        this._workingCanvas = null;
        /** @hidden */
        this._workingContext = null;
        /** @hidden */
        this._framebuffer = null;
        /** @hidden */
        this._depthStencilBuffer = null;
        /** @hidden */
        this._MSAAFramebuffer = null;
        /** @hidden */
        this._MSAARenderBuffer = null;
        /** @hidden */
        this._attachments = null;
        /** @hidden */
        this._textureArray = null;
        /** @hidden */
        this._cachedCoordinatesMode = null;
        /** @hidden */
        this._cachedWrapU = null;
        /** @hidden */
        this._cachedWrapV = null;
        /** @hidden */
        this._cachedWrapR = null;
        /** @hidden */
        this._cachedAnisotropicFilteringLevel = null;
        /** @hidden */
        this._isDisabled = false;
        /** @hidden */
        this._compression = null;
        /** @hidden */
        this._generateStencilBuffer = false;
        /** @hidden */
        this._generateDepthBuffer = false;
        /** @hidden */
        this._comparisonFunction = 0;
        /** @hidden */
        this._sphericalPolynomial = null;
        /** @hidden */
        this._lodGenerationScale = 0;
        /** @hidden */
        this._lodGenerationOffset = 0;
        // Multiview
        /** @hidden */
        this._colorTextureArray = null;
        /** @hidden */
        this._depthStencilTextureArray = null;
        // The following three fields helps sharing generated fixed LODs for texture filtering
        // In environment not supporting the textureLOD extension like EDGE. They are for internal use only.
        // They are at the level of the gl texture to benefit from the cache.
        /** @hidden */
        this._lodTextureHigh = null;
        /** @hidden */
        this._lodTextureMid = null;
        /** @hidden */
        this._lodTextureLow = null;
        /** @hidden */
        this._isRGBD = false;
        /** @hidden */
        this._linearSpecularLOD = false;
        /** @hidden */
        this._irradianceTexture = null;
        /** @hidden */
        this._webGLTexture = null;
        /** @hidden */
        this._references = 1;
        /** @hidden */
        this._gammaSpace = null;
        this._engine = engine;
        this._source = source;
        if (!delayAllocation) {
            this._webGLTexture = engine._createTexture();
        }
    }
    /**
     * Gets the Engine the texture belongs to.
     * @returns The babylon engine
     */
    InternalTexture.prototype.getEngine = function () {
        return this._engine;
    };
    Object.defineProperty(InternalTexture.prototype, "source", {
        /**
         * Gets the data source type of the texture
         */
        get: function () {
            return this._source;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Increments the number of references (ie. the number of Texture that point to it)
     */
    InternalTexture.prototype.incrementReferences = function () {
        this._references++;
    };
    /**
     * Change the size of the texture (not the size of the content)
     * @param width defines the new width
     * @param height defines the new height
     * @param depth defines the new depth (1 by default)
     */
    InternalTexture.prototype.updateSize = function (width, height, depth) {
        if (depth === void 0) { depth = 1; }
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.baseWidth = width;
        this.baseHeight = height;
        this.baseDepth = depth;
        this._size = width * height * depth;
    };
    /** @hidden */
    InternalTexture.prototype._rebuild = function () {
        var _this = this;
        var _a;
        var proxy;
        this.isReady = false;
        this._cachedCoordinatesMode = null;
        this._cachedWrapU = null;
        this._cachedWrapV = null;
        this._cachedAnisotropicFilteringLevel = null;
        switch (this.source) {
            case InternalTextureSource.Temp:
                return;
            case InternalTextureSource.Url:
                proxy = this._engine.createTexture((_a = this._originalUrl) !== null && _a !== void 0 ? _a : this.url, !this.generateMipMaps, this.invertY, null, this.samplingMode, function () {
                    proxy._swapAndDie(_this);
                    _this.isReady = true;
                }, null, this._buffer, undefined, this.format);
                return;
            case InternalTextureSource.Raw:
                proxy = this._engine.createRawTexture(this._bufferView, this.baseWidth, this.baseHeight, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression);
                proxy._swapAndDie(this);
                this.isReady = true;
                return;
            case InternalTextureSource.Raw3D:
                proxy = this._engine.createRawTexture3D(this._bufferView, this.baseWidth, this.baseHeight, this.baseDepth, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression);
                proxy._swapAndDie(this);
                this.isReady = true;
                return;
            case InternalTextureSource.Raw2DArray:
                proxy = this._engine.createRawTexture2DArray(this._bufferView, this.baseWidth, this.baseHeight, this.baseDepth, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression);
                proxy._swapAndDie(this);
                this.isReady = true;
                return;
            case InternalTextureSource.Dynamic:
                proxy = this._engine.createDynamicTexture(this.baseWidth, this.baseHeight, this.generateMipMaps, this.samplingMode);
                proxy._swapAndDie(this);
                this._engine.updateDynamicTexture(this, this._engine.getRenderingCanvas(), this.invertY, undefined, undefined, true);
                // The engine will make sure to update content so no need to flag it as isReady = true
                return;
            case InternalTextureSource.RenderTarget:
                var options = new RenderTargetCreationOptions();
                options.generateDepthBuffer = this._generateDepthBuffer;
                options.generateMipMaps = this.generateMipMaps;
                options.generateStencilBuffer = this._generateStencilBuffer;
                options.samplingMode = this.samplingMode;
                options.type = this.type;
                if (this.isCube) {
                    proxy = this._engine.createRenderTargetCubeTexture(this.width, options);
                }
                else {
                    var size_1 = {
                        width: this.width,
                        height: this.height,
                        layers: this.is2DArray ? this.depth : undefined
                    };
                    proxy = this._engine.createRenderTargetTexture(size_1, options);
                }
                proxy._swapAndDie(this);
                this.isReady = true;
                return;
            case InternalTextureSource.Depth:
                var depthTextureOptions = {
                    bilinearFiltering: this.samplingMode !== 2,
                    comparisonFunction: this._comparisonFunction,
                    generateStencil: this._generateStencilBuffer,
                    isCube: this.isCube
                };
                var size = {
                    width: this.width,
                    height: this.height,
                    layers: this.is2DArray ? this.depth : undefined
                };
                proxy = this._engine.createDepthStencilTexture(size, depthTextureOptions);
                proxy._swapAndDie(this);
                this.isReady = true;
                return;
            case InternalTextureSource.Cube:
                proxy = this._engine.createCubeTexture(this.url, null, this._files, !this.generateMipMaps, function () {
                    proxy._swapAndDie(_this);
                    _this.isReady = true;
                }, null, this.format, this._extension);
                return;
            case InternalTextureSource.CubeRaw:
                proxy = this._engine.createRawCubeTexture(this._bufferViewArray, this.width, this.format, this.type, this.generateMipMaps, this.invertY, this.samplingMode, this._compression);
                proxy._swapAndDie(this);
                this.isReady = true;
                return;
            case InternalTextureSource.CubeRawRGBD:
                proxy = this._engine.createRawCubeTexture(null, this.width, this.format, this.type, this.generateMipMaps, this.invertY, this.samplingMode, this._compression);
                InternalTexture._UpdateRGBDAsync(proxy, this._bufferViewArrayArray, this._sphericalPolynomial, this._lodGenerationScale, this._lodGenerationOffset).then(function () {
                    proxy._swapAndDie(_this);
                    _this.isReady = true;
                });
                return;
            case InternalTextureSource.CubePrefiltered:
                proxy = this._engine.createPrefilteredCubeTexture(this.url, null, this._lodGenerationScale, this._lodGenerationOffset, function (proxy) {
                    if (proxy) {
                        proxy._swapAndDie(_this);
                    }
                    _this.isReady = true;
                }, null, this.format, this._extension);
                proxy._sphericalPolynomial = this._sphericalPolynomial;
                return;
        }
    };
    /** @hidden */
    InternalTexture.prototype._swapAndDie = function (target) {
        target._webGLTexture = this._webGLTexture;
        target._isRGBD = this._isRGBD;
        if (this._framebuffer) {
            target._framebuffer = this._framebuffer;
        }
        if (this._depthStencilBuffer) {
            target._depthStencilBuffer = this._depthStencilBuffer;
        }
        target._depthStencilTexture = this._depthStencilTexture;
        if (this._lodTextureHigh) {
            if (target._lodTextureHigh) {
                target._lodTextureHigh.dispose();
            }
            target._lodTextureHigh = this._lodTextureHigh;
        }
        if (this._lodTextureMid) {
            if (target._lodTextureMid) {
                target._lodTextureMid.dispose();
            }
            target._lodTextureMid = this._lodTextureMid;
        }
        if (this._lodTextureLow) {
            if (target._lodTextureLow) {
                target._lodTextureLow.dispose();
            }
            target._lodTextureLow = this._lodTextureLow;
        }
        if (this._irradianceTexture) {
            if (target._irradianceTexture) {
                target._irradianceTexture.dispose();
            }
            target._irradianceTexture = this._irradianceTexture;
        }
        var cache = this._engine.getLoadedTexturesCache();
        var index = cache.indexOf(this);
        if (index !== -1) {
            cache.splice(index, 1);
        }
        var index = cache.indexOf(target);
        if (index === -1) {
            cache.push(target);
        }
    };
    /**
     * Dispose the current allocated resources
     */
    InternalTexture.prototype.dispose = function () {
        if (!this._webGLTexture) {
            return;
        }
        this._references--;
        if (this._references === 0) {
            this._engine._releaseTexture(this);
            this._webGLTexture = null;
        }
    };
    /** @hidden */
    InternalTexture._UpdateRGBDAsync = function (internalTexture, data, sphericalPolynomial, lodScale, lodOffset) {
        throw _DevTools.WarnImport("environmentTextureTools");
    };
    return InternalTexture;
}());

/** @hidden */
var WebGLShaderProcessor = /** @class */ (function () {
    function WebGLShaderProcessor() {
    }
    WebGLShaderProcessor.prototype.postProcessor = function (code, defines, isFragment, engine) {
        // Remove extensions
        if (!engine.getCaps().drawBuffersExtension) {
            // even if enclosed in #if/#endif, IE11 does parse the #extension declaration, so we need to remove it altogether
            var regex = /#extension.+GL_EXT_draw_buffers.+(enable|require)/g;
            code = code.replace(regex, "");
        }
        return code;
    };
    return WebGLShaderProcessor;
}());

/** @hidden */
var WebGL2ShaderProcessor = /** @class */ (function () {
    function WebGL2ShaderProcessor() {
    }
    WebGL2ShaderProcessor.prototype.attributeProcessor = function (attribute) {
        return attribute.replace("attribute", "in");
    };
    WebGL2ShaderProcessor.prototype.varyingProcessor = function (varying, isFragment) {
        return varying.replace("varying", isFragment ? "in" : "out");
    };
    WebGL2ShaderProcessor.prototype.postProcessor = function (code, defines, isFragment) {
        var hasDrawBuffersExtension = code.search(/#extension.+GL_EXT_draw_buffers.+require/) !== -1;
        // Remove extensions
        var regex = /#extension.+(GL_OVR_multiview2|GL_OES_standard_derivatives|GL_EXT_shader_texture_lod|GL_EXT_frag_depth|GL_EXT_draw_buffers).+(enable|require)/g;
        code = code.replace(regex, "");
        // Replace instructions
        code = code.replace(/texture2D\s*\(/g, "texture(");
        if (isFragment) {
            code = code.replace(/texture2DLodEXT\s*\(/g, "textureLod(");
            code = code.replace(/textureCubeLodEXT\s*\(/g, "textureLod(");
            code = code.replace(/textureCube\s*\(/g, "texture(");
            code = code.replace(/gl_FragDepthEXT/g, "gl_FragDepth");
            code = code.replace(/gl_FragColor/g, "glFragColor");
            code = code.replace(/gl_FragData/g, "glFragData");
            code = code.replace(/void\s+?main\s*\(/g, (hasDrawBuffersExtension ? "" : "out vec4 glFragColor;\n") + "void main(");
        }
        else {
            var hasMultiviewExtension = defines.indexOf("#define MULTIVIEW") !== -1;
            if (hasMultiviewExtension) {
                return "#extension GL_OVR_multiview2 : require\nlayout (num_views = 2) in;\n" + code;
            }
        }
        return code;
    };
    return WebGL2ShaderProcessor;
}());

/**
 * Class used to store gfx data (like WebGLBuffer)
 */
var DataBuffer = /** @class */ (function () {
    function DataBuffer() {
        /**
         * Gets or sets the number of objects referencing this buffer
         */
        this.references = 0;
        /** Gets or sets the size of the underlying buffer */
        this.capacity = 0;
        /**
         * Gets or sets a boolean indicating if the buffer contains 32bits indices
         */
        this.is32Bits = false;
    }
    Object.defineProperty(DataBuffer.prototype, "underlyingResource", {
        /**
         * Gets the underlying buffer
         */
        get: function () {
            return null;
        },
        enumerable: false,
        configurable: true
    });
    return DataBuffer;
}());

/** @hidden */
var WebGLDataBuffer = /** @class */ (function (_super) {
    __extends(WebGLDataBuffer, _super);
    function WebGLDataBuffer(resource) {
        var _this = _super.call(this) || this;
        _this._buffer = resource;
        return _this;
    }
    Object.defineProperty(WebGLDataBuffer.prototype, "underlyingResource", {
        get: function () {
            return this._buffer;
        },
        enumerable: false,
        configurable: true
    });
    return WebGLDataBuffer;
}(DataBuffer));

/** @hidden */
var WebGLPipelineContext = /** @class */ (function () {
    function WebGLPipelineContext() {
        this.vertexCompilationError = null;
        this.fragmentCompilationError = null;
        this.programLinkError = null;
        this.programValidationError = null;
    }
    Object.defineProperty(WebGLPipelineContext.prototype, "isAsync", {
        get: function () {
            return this.isParallelCompiled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebGLPipelineContext.prototype, "isReady", {
        get: function () {
            if (this.program) {
                if (this.isParallelCompiled) {
                    return this.engine._isRenderingStateCompiled(this);
                }
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    WebGLPipelineContext.prototype._handlesSpectorRebuildCallback = function (onCompiled) {
        if (onCompiled && this.program) {
            onCompiled(this.program);
        }
    };
    WebGLPipelineContext.prototype._getVertexShaderCode = function () {
        return this.vertexShader ? this.engine._getShaderSource(this.vertexShader) : null;
    };
    WebGLPipelineContext.prototype._getFragmentShaderCode = function () {
        return this.fragmentShader ? this.engine._getShaderSource(this.fragmentShader) : null;
    };
    return WebGLPipelineContext;
}());

/**
 * Helper class used to generate a canvas to manipulate images
 */
var CanvasGenerator = /** @class */ (function () {
    function CanvasGenerator() {
    }
    /**
     * Create a new canvas (or offscreen canvas depending on the context)
     * @param width defines the expected width
     * @param height defines the expected height
     * @return a new canvas or offscreen canvas
     */
    CanvasGenerator.CreateCanvas = function (width, height) {
        if (typeof document === "undefined") {
            return new OffscreenCanvas(width, height);
        }
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };
    return CanvasGenerator;
}());

/**
 * Keeps track of all the buffer info used in engine.
 */
var BufferPointer = /** @class */ (function () {
    function BufferPointer() {
    }
    return BufferPointer;
}());
/**
 * The base engine class (root of all engines)
 */
var ThinEngine = /** @class */ (function () {
    /**
     * Creates a new engine
     * @param canvasOrContext defines the canvas or WebGL context to use for rendering. If you provide a WebGL context, Babylon.js will not hook events on the canvas (like pointers, keyboards, etc...) so no event observables will be available. This is mostly used when Babylon.js is used as a plugin on a system which alreay used the WebGL context
     * @param antialias defines enable antialiasing (default: false)
     * @param options defines further options to be sent to the getContext() function
     * @param adaptToDeviceRatio defines whether to adapt to the device's viewport characteristics (default: false)
     */
    function ThinEngine(canvasOrContext, antialias, options, adaptToDeviceRatio) {
        var _this = this;
        if (adaptToDeviceRatio === void 0) { adaptToDeviceRatio = false; }
        /**
         * Gets or sets a boolean that indicates if textures must be forced to power of 2 size even if not required
         */
        this.forcePOTTextures = false;
        /**
         * Gets a boolean indicating if the engine is currently rendering in fullscreen mode
         */
        this.isFullscreen = false;
        /**
         * Gets or sets a boolean indicating if back faces must be culled (true by default)
         */
        this.cullBackFaces = true;
        /**
         * Gets or sets a boolean indicating if the engine must keep rendering even if the window is not in foregroun
         */
        this.renderEvenInBackground = true;
        /**
         * Gets or sets a boolean indicating that cache can be kept between frames
         */
        this.preventCacheWipeBetweenFrames = false;
        /** Gets or sets a boolean indicating if the engine should validate programs after compilation */
        this.validateShaderPrograms = false;
        /**
         * Gets or sets a boolean indicating if depth buffer should be reverse, going from far to near.
         * This can provide greater z depth for distant objects.
         */
        this.useReverseDepthBuffer = false;
        // Uniform buffers list
        /**
         * Gets or sets a boolean indicating that uniform buffers must be disabled even if they are supported
         */
        this.disableUniformBuffers = false;
        /** @hidden */
        this._uniformBuffers = new Array();
        /** @hidden */
        this._webGLVersion = 1.0;
        this._windowIsBackground = false;
        this._highPrecisionShadersAllowed = true;
        /** @hidden */
        this._badOS = false;
        /** @hidden */
        this._badDesktopOS = false;
        this._renderingQueueLaunched = false;
        this._activeRenderLoops = new Array();
        // Lost context
        /**
         * Observable signaled when a context lost event is raised
         */
        this.onContextLostObservable = new Observable();
        /**
         * Observable signaled when a context restored event is raised
         */
        this.onContextRestoredObservable = new Observable();
        this._contextWasLost = false;
        /** @hidden */
        this._doNotHandleContextLost = false;
        /**
         * Gets or sets a boolean indicating that vertex array object must be disabled even if they are supported
         */
        this.disableVertexArrayObjects = false;
        // States
        /** @hidden */
        this._colorWrite = true;
        /** @hidden */
        this._colorWriteChanged = true;
        /** @hidden */
        this._depthCullingState = new DepthCullingState();
        /** @hidden */
        this._stencilState = new StencilState();
        /** @hidden */
        this._alphaState = new AlphaState();
        /** @hidden */
        this._alphaMode = 1;
        /** @hidden */
        this._alphaEquation = 0;
        // Cache
        /** @hidden */
        this._internalTexturesCache = new Array();
        /** @hidden */
        this._activeChannel = 0;
        this._currentTextureChannel = -1;
        /** @hidden */
        this._boundTexturesCache = {};
        this._compiledEffects = {};
        this._vertexAttribArraysEnabled = [];
        this._uintIndicesCurrentlySet = false;
        this._currentBoundBuffer = new Array();
        /** @hidden */
        this._currentFramebuffer = null;
        /** @hidden */
        this._dummyFramebuffer = null;
        this._currentBufferPointers = new Array();
        this._currentInstanceLocations = new Array();
        this._currentInstanceBuffers = new Array();
        this._vaoRecordInProgress = false;
        this._mustWipeVertexAttributes = false;
        this._nextFreeTextureSlots = new Array();
        this._maxSimultaneousTextures = 0;
        this._activeRequests = new Array();
        /** @hidden */
        this._transformTextureUrl = null;
        /**
         * Gets information about the current host
         */
        this.hostInformation = {
            isMobile: false
        };
        /**
         * Defines whether the engine has been created with the premultipliedAlpha option on or not.
         */
        this.premultipliedAlpha = true;
        /**
         * Observable event triggered before each texture is initialized
         */
        this.onBeforeTextureInitObservable = new Observable();
        this._viewportCached = { x: 0, y: 0, z: 0, w: 0 };
        this._unpackFlipYCached = null;
        /**
         * In case you are sharing the context with other applications, it might
         * be interested to not cache the unpack flip y state to ensure a consistent
         * value would be set.
         */
        this.enableUnpackFlipYCached = true;
        this._getDepthStencilBuffer = function (width, height, samples, internalFormat, msInternalFormat, attachment) {
            var gl = _this._gl;
            var depthStencilBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);
            if (samples > 1 && gl.renderbufferStorageMultisample) {
                gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, msInternalFormat, width, height);
            }
            else {
                gl.renderbufferStorage(gl.RENDERBUFFER, internalFormat, width, height);
            }
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, depthStencilBuffer);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            return depthStencilBuffer;
        };
        this._boundUniforms = {};
        var canvas = null;
        if (!canvasOrContext) {
            return;
        }
        options = options || {};
        PerformanceConfigurator.SetMatrixPrecision(!!options.useHighPrecisionMatrix);
        if (canvasOrContext.getContext) {
            canvas = canvasOrContext;
            this._renderingCanvas = canvas;
            if (antialias != null) {
                options.antialias = antialias;
            }
            if (options.deterministicLockstep === undefined) {
                options.deterministicLockstep = false;
            }
            if (options.lockstepMaxSteps === undefined) {
                options.lockstepMaxSteps = 4;
            }
            if (options.timeStep === undefined) {
                options.timeStep = 1 / 60;
            }
            if (options.preserveDrawingBuffer === undefined) {
                options.preserveDrawingBuffer = false;
            }
            if (options.audioEngine === undefined) {
                options.audioEngine = true;
            }
            if (options.stencil === undefined) {
                options.stencil = true;
            }
            if (options.premultipliedAlpha === false) {
                this.premultipliedAlpha = false;
            }
            if (options.xrCompatible === undefined) {
                options.xrCompatible = true;
            }
            this._doNotHandleContextLost = options.doNotHandleContextLost ? true : false;
            // Exceptions
            if (navigator && navigator.userAgent) {
                var ua = navigator.userAgent;
                this.hostInformation.isMobile = ua.indexOf("Mobile") !== -1;
                for (var _i = 0, _a = ThinEngine.ExceptionList; _i < _a.length; _i++) {
                    var exception = _a[_i];
                    var key = exception.key;
                    var targets = exception.targets;
                    var check = new RegExp(key);
                    if (check.test(ua)) {
                        if (exception.capture && exception.captureConstraint) {
                            var capture = exception.capture;
                            var constraint = exception.captureConstraint;
                            var regex = new RegExp(capture);
                            var matches = regex.exec(ua);
                            if (matches && matches.length > 0) {
                                var capturedValue = parseInt(matches[matches.length - 1]);
                                if (capturedValue >= constraint) {
                                    continue;
                                }
                            }
                        }
                        for (var _b = 0, targets_1 = targets; _b < targets_1.length; _b++) {
                            var target = targets_1[_b];
                            switch (target) {
                                case "uniformBuffer":
                                    this.disableUniformBuffers = true;
                                    break;
                                case "vao":
                                    this.disableVertexArrayObjects = true;
                                    break;
                            }
                        }
                    }
                }
            }
            // Context lost
            if (!this._doNotHandleContextLost) {
                this._onContextLost = function (evt) {
                    evt.preventDefault();
                    _this._contextWasLost = true;
                    Logger.Warn("WebGL context lost.");
                    _this.onContextLostObservable.notifyObservers(_this);
                };
                this._onContextRestored = function () {
                    // Adding a timeout to avoid race condition at browser level
                    setTimeout(function () {
                        // Rebuild gl context
                        _this._initGLContext();
                        // Rebuild effects
                        _this._rebuildEffects();
                        // Rebuild textures
                        _this._rebuildInternalTextures();
                        // Rebuild buffers
                        _this._rebuildBuffers();
                        // Cache
                        _this.wipeCaches(true);
                        Logger.Warn("WebGL context successfully restored.");
                        _this.onContextRestoredObservable.notifyObservers(_this);
                        _this._contextWasLost = false;
                    }, 0);
                };
                canvas.addEventListener("webglcontextlost", this._onContextLost, false);
                canvas.addEventListener("webglcontextrestored", this._onContextRestored, false);
                options.powerPreference = "high-performance";
            }
            // GL
            if (!options.disableWebGL2Support) {
                try {
                    this._gl = (canvas.getContext("webgl2", options) || canvas.getContext("experimental-webgl2", options));
                    if (this._gl) {
                        this._webGLVersion = 2.0;
                        // Prevent weird browsers to lie (yeah that happens!)
                        if (!this._gl.deleteQuery) {
                            this._webGLVersion = 1.0;
                        }
                    }
                }
                catch (e) {
                    // Do nothing
                }
            }
            if (!this._gl) {
                if (!canvas) {
                    throw new Error("The provided canvas is null or undefined.");
                }
                try {
                    this._gl = (canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options));
                }
                catch (e) {
                    throw new Error("WebGL not supported");
                }
            }
            if (!this._gl) {
                throw new Error("WebGL not supported");
            }
        }
        else {
            this._gl = canvasOrContext;
            this._renderingCanvas = this._gl.canvas;
            if (this._gl.renderbufferStorageMultisample) {
                this._webGLVersion = 2.0;
            }
            var attributes = this._gl.getContextAttributes();
            if (attributes) {
                options.stencil = attributes.stencil;
            }
        }
        // Ensures a consistent color space unpacking of textures cross browser.
        this._gl.pixelStorei(this._gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, this._gl.NONE);
        if (options.useHighPrecisionFloats !== undefined) {
            this._highPrecisionShadersAllowed = options.useHighPrecisionFloats;
        }
        // Viewport
        var devicePixelRatio = DomManagement.IsWindowObjectExist() ? (window.devicePixelRatio || 1.0) : 1.0;
        var limitDeviceRatio = options.limitDeviceRatio || devicePixelRatio;
        this._hardwareScalingLevel = adaptToDeviceRatio ? 1.0 / Math.min(limitDeviceRatio, devicePixelRatio) : 1.0;
        this.resize();
        this._isStencilEnable = options.stencil ? true : false;
        this._initGLContext();
        // Prepare buffer pointers
        for (var i = 0; i < this._caps.maxVertexAttribs; i++) {
            this._currentBufferPointers[i] = new BufferPointer();
        }
        // Shader processor
        if (this.webGLVersion > 1) {
            this._shaderProcessor = new WebGL2ShaderProcessor();
        }
        else {
            this._shaderProcessor = new WebGLShaderProcessor();
        }
        // Detect if we are running on a faulty buggy OS.
        this._badOS = /iPad/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent);
        // Starting with iOS 14, we can trust the browser
        // let matches = navigator.userAgent.match(/Version\/(\d+)/);
        // if (matches && matches.length === 2) {
        //     if (parseInt(matches[1]) >= 14) {
        //         this._badOS = false;
        //     }
        // }
        // Detect if we are running on a faulty buggy desktop OS.
        this._badDesktopOS = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        this._creationOptions = options;
        console.log("Babylon.js v" + ThinEngine.Version + " - " + this.description);
    }
    Object.defineProperty(ThinEngine, "NpmPackage", {
        /**
         * Returns the current npm package of the sdk
         */
        // Not mixed with Version for tooling purpose.
        get: function () {
            return "babylonjs@4.2.0";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine, "Version", {
        /**
         * Returns the current version of the framework
         */
        get: function () {
            return "4.2.0";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "description", {
        /**
         * Returns a string describing the current engine
         */
        get: function () {
            var description = "WebGL" + this.webGLVersion;
            if (this._caps.parallelShaderCompile) {
                description += " - Parallel shader compilation";
            }
            return description;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine, "ShadersRepository", {
        /**
         * Gets or sets the relative url used to load shaders if using the engine in non-minified mode
         */
        get: function () {
            return Effect.ShadersRepository;
        },
        set: function (value) {
            Effect.ShadersRepository = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "supportsUniformBuffers", {
        /**
         * Gets a boolean indicating that the engine supports uniform buffers
         * @see https://doc.babylonjs.com/features/webgl2#uniform-buffer-objets
         */
        get: function () {
            return this.webGLVersion > 1 && !this.disableUniformBuffers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "_shouldUseHighPrecisionShader", {
        /** @hidden */
        get: function () {
            return !!(this._caps.highPrecisionShaderSupported && this._highPrecisionShadersAllowed);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "needPOTTextures", {
        /**
         * Gets a boolean indicating that only power of 2 textures are supported
         * Please note that you can still use non power of 2 textures but in this case the engine will forcefully convert them
         */
        get: function () {
            return this._webGLVersion < 2 || this.forcePOTTextures;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "doNotHandleContextLost", {
        /**
         * Gets or sets a boolean indicating if resources should be retained to be able to handle context lost events
         * @see https://doc.babylonjs.com/how_to/optimizing_your_scene#handling-webgl-context-lost
         */
        get: function () {
            return this._doNotHandleContextLost;
        },
        set: function (value) {
            this._doNotHandleContextLost = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "_supportsHardwareTextureRescaling", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "framebufferDimensionsObject", {
        /**
         * sets the object from which width and height will be taken from when getting render width and height
         * Will fallback to the gl object
         * @param dimensions the framebuffer width and height that will be used.
         */
        set: function (dimensions) {
            this._framebufferDimensionsObject = dimensions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "currentViewport", {
        /**
         * Gets the current viewport
         */
        get: function () {
            return this._cachedViewport;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "emptyTexture", {
        /**
         * Gets the default empty texture
         */
        get: function () {
            if (!this._emptyTexture) {
                this._emptyTexture = this.createRawTexture(new Uint8Array(4), 1, 1, 5, false, false, 1);
            }
            return this._emptyTexture;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "emptyTexture3D", {
        /**
         * Gets the default empty 3D texture
         */
        get: function () {
            if (!this._emptyTexture3D) {
                this._emptyTexture3D = this.createRawTexture3D(new Uint8Array(4), 1, 1, 1, 5, false, false, 1);
            }
            return this._emptyTexture3D;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "emptyTexture2DArray", {
        /**
         * Gets the default empty 2D array texture
         */
        get: function () {
            if (!this._emptyTexture2DArray) {
                this._emptyTexture2DArray = this.createRawTexture2DArray(new Uint8Array(4), 1, 1, 1, 5, false, false, 1);
            }
            return this._emptyTexture2DArray;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "emptyCubeTexture", {
        /**
         * Gets the default empty cube texture
         */
        get: function () {
            if (!this._emptyCubeTexture) {
                var faceData = new Uint8Array(4);
                var cubeData = [faceData, faceData, faceData, faceData, faceData, faceData];
                this._emptyCubeTexture = this.createRawCubeTexture(cubeData, 1, 5, 0, false, false, 1);
            }
            return this._emptyCubeTexture;
        },
        enumerable: false,
        configurable: true
    });
    ThinEngine.prototype._rebuildInternalTextures = function () {
        var currentState = this._internalTexturesCache.slice(); // Do a copy because the rebuild will add proxies
        for (var _i = 0, currentState_1 = currentState; _i < currentState_1.length; _i++) {
            var internalTexture = currentState_1[_i];
            internalTexture._rebuild();
        }
    };
    ThinEngine.prototype._rebuildEffects = function () {
        for (var key in this._compiledEffects) {
            var effect = this._compiledEffects[key];
            effect._prepareEffect();
        }
        Effect.ResetCache();
    };
    /**
     * Gets a boolean indicating if all created effects are ready
     * @returns true if all effects are ready
     */
    ThinEngine.prototype.areAllEffectsReady = function () {
        for (var key in this._compiledEffects) {
            var effect = this._compiledEffects[key];
            if (!effect.isReady()) {
                return false;
            }
        }
        return true;
    };
    ThinEngine.prototype._rebuildBuffers = function () {
        // Uniforms
        for (var _i = 0, _a = this._uniformBuffers; _i < _a.length; _i++) {
            var uniformBuffer = _a[_i];
            uniformBuffer._rebuild();
        }
    };
    ThinEngine.prototype._initGLContext = function () {
        // Caps
        this._caps = {
            maxTexturesImageUnits: this._gl.getParameter(this._gl.MAX_TEXTURE_IMAGE_UNITS),
            maxCombinedTexturesImageUnits: this._gl.getParameter(this._gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
            maxVertexTextureImageUnits: this._gl.getParameter(this._gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
            maxTextureSize: this._gl.getParameter(this._gl.MAX_TEXTURE_SIZE),
            maxSamples: this._webGLVersion > 1 ? this._gl.getParameter(this._gl.MAX_SAMPLES) : 1,
            maxCubemapTextureSize: this._gl.getParameter(this._gl.MAX_CUBE_MAP_TEXTURE_SIZE),
            maxRenderTextureSize: this._gl.getParameter(this._gl.MAX_RENDERBUFFER_SIZE),
            maxVertexAttribs: this._gl.getParameter(this._gl.MAX_VERTEX_ATTRIBS),
            maxVaryingVectors: this._gl.getParameter(this._gl.MAX_VARYING_VECTORS),
            maxFragmentUniformVectors: this._gl.getParameter(this._gl.MAX_FRAGMENT_UNIFORM_VECTORS),
            maxVertexUniformVectors: this._gl.getParameter(this._gl.MAX_VERTEX_UNIFORM_VECTORS),
            parallelShaderCompile: this._gl.getExtension('KHR_parallel_shader_compile'),
            standardDerivatives: this._webGLVersion > 1 || (this._gl.getExtension('OES_standard_derivatives') !== null),
            maxAnisotropy: 1,
            astc: this._gl.getExtension('WEBGL_compressed_texture_astc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_astc'),
            bptc: this._gl.getExtension('EXT_texture_compression_bptc') || this._gl.getExtension('WEBKIT_EXT_texture_compression_bptc'),
            s3tc: this._gl.getExtension('WEBGL_compressed_texture_s3tc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc'),
            pvrtc: this._gl.getExtension('WEBGL_compressed_texture_pvrtc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'),
            etc1: this._gl.getExtension('WEBGL_compressed_texture_etc1') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1'),
            etc2: this._gl.getExtension('WEBGL_compressed_texture_etc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc') ||
                this._gl.getExtension('WEBGL_compressed_texture_es3_0'),
            textureAnisotropicFilterExtension: this._gl.getExtension('EXT_texture_filter_anisotropic') || this._gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || this._gl.getExtension('MOZ_EXT_texture_filter_anisotropic'),
            uintIndices: this._webGLVersion > 1 || this._gl.getExtension('OES_element_index_uint') !== null,
            fragmentDepthSupported: this._webGLVersion > 1 || this._gl.getExtension('EXT_frag_depth') !== null,
            highPrecisionShaderSupported: false,
            timerQuery: this._gl.getExtension('EXT_disjoint_timer_query_webgl2') || this._gl.getExtension("EXT_disjoint_timer_query"),
            canUseTimestampForTimerQuery: false,
            drawBuffersExtension: false,
            maxMSAASamples: 1,
            colorBufferFloat: this._webGLVersion > 1 && this._gl.getExtension('EXT_color_buffer_float'),
            textureFloat: (this._webGLVersion > 1 || this._gl.getExtension('OES_texture_float')) ? true : false,
            textureHalfFloat: (this._webGLVersion > 1 || this._gl.getExtension('OES_texture_half_float')) ? true : false,
            textureHalfFloatRender: false,
            textureFloatLinearFiltering: false,
            textureFloatRender: false,
            textureHalfFloatLinearFiltering: false,
            vertexArrayObject: false,
            instancedArrays: false,
            textureLOD: (this._webGLVersion > 1 || this._gl.getExtension('EXT_shader_texture_lod')) ? true : false,
            blendMinMax: false,
            multiview: this._gl.getExtension('OVR_multiview2'),
            oculusMultiview: this._gl.getExtension('OCULUS_multiview'),
            depthTextureExtension: false
        };
        // Infos
        this._glVersion = this._gl.getParameter(this._gl.VERSION);
        var rendererInfo = this._gl.getExtension("WEBGL_debug_renderer_info");
        if (rendererInfo != null) {
            this._glRenderer = this._gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL);
            this._glVendor = this._gl.getParameter(rendererInfo.UNMASKED_VENDOR_WEBGL);
        }
        if (!this._glVendor) {
            this._glVendor = "Unknown vendor";
        }
        if (!this._glRenderer) {
            this._glRenderer = "Unknown renderer";
        }
        // Constants
        if (this._gl.HALF_FLOAT_OES !== 0x8D61) {
            this._gl.HALF_FLOAT_OES = 0x8D61; // Half floating-point type (16-bit).
        }
        if (this._gl.RGBA16F !== 0x881A) {
            this._gl.RGBA16F = 0x881A; // RGBA 16-bit floating-point color-renderable internal sized format.
        }
        if (this._gl.RGBA32F !== 0x8814) {
            this._gl.RGBA32F = 0x8814; // RGBA 32-bit floating-point color-renderable internal sized format.
        }
        if (this._gl.DEPTH24_STENCIL8 !== 35056) {
            this._gl.DEPTH24_STENCIL8 = 35056;
        }
        // Extensions
        if (this._caps.timerQuery) {
            if (this._webGLVersion === 1) {
                this._gl.getQuery = this._caps.timerQuery.getQueryEXT.bind(this._caps.timerQuery);
            }
            this._caps.canUseTimestampForTimerQuery = this._gl.getQuery(this._caps.timerQuery.TIMESTAMP_EXT, this._caps.timerQuery.QUERY_COUNTER_BITS_EXT) > 0;
        }
        this._caps.maxAnisotropy = this._caps.textureAnisotropicFilterExtension ? this._gl.getParameter(this._caps.textureAnisotropicFilterExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
        this._caps.textureFloatLinearFiltering = this._caps.textureFloat && this._gl.getExtension('OES_texture_float_linear') ? true : false;
        this._caps.textureFloatRender = this._caps.textureFloat && this._canRenderToFloatFramebuffer() ? true : false;
        this._caps.textureHalfFloatLinearFiltering = (this._webGLVersion > 1 || (this._caps.textureHalfFloat && this._gl.getExtension('OES_texture_half_float_linear'))) ? true : false;
        // Checks if some of the format renders first to allow the use of webgl inspector.
        if (this._webGLVersion > 1) {
            if (this._gl.HALF_FLOAT_OES !== 0x140B) {
                this._gl.HALF_FLOAT_OES = 0x140B;
            }
        }
        this._caps.textureHalfFloatRender = this._caps.textureHalfFloat && this._canRenderToHalfFloatFramebuffer();
        // Draw buffers
        if (this._webGLVersion > 1) {
            this._caps.drawBuffersExtension = true;
            this._caps.maxMSAASamples = this._gl.getParameter(this._gl.MAX_SAMPLES);
        }
        else {
            var drawBuffersExtension = this._gl.getExtension('WEBGL_draw_buffers');
            if (drawBuffersExtension !== null) {
                this._caps.drawBuffersExtension = true;
                this._gl.drawBuffers = drawBuffersExtension.drawBuffersWEBGL.bind(drawBuffersExtension);
                this._gl.DRAW_FRAMEBUFFER = this._gl.FRAMEBUFFER;
                for (var i = 0; i < 16; i++) {
                    this._gl["COLOR_ATTACHMENT" + i + "_WEBGL"] = drawBuffersExtension["COLOR_ATTACHMENT" + i + "_WEBGL"];
                }
            }
        }
        // Depth Texture
        if (this._webGLVersion > 1) {
            this._caps.depthTextureExtension = true;
        }
        else {
            var depthTextureExtension = this._gl.getExtension('WEBGL_depth_texture');
            if (depthTextureExtension != null) {
                this._caps.depthTextureExtension = true;
                this._gl.UNSIGNED_INT_24_8 = depthTextureExtension.UNSIGNED_INT_24_8_WEBGL;
            }
        }
        // Vertex array object
        if (this.disableVertexArrayObjects) {
            this._caps.vertexArrayObject = false;
        }
        else if (this._webGLVersion > 1) {
            this._caps.vertexArrayObject = true;
        }
        else {
            var vertexArrayObjectExtension = this._gl.getExtension('OES_vertex_array_object');
            if (vertexArrayObjectExtension != null) {
                this._caps.vertexArrayObject = true;
                this._gl.createVertexArray = vertexArrayObjectExtension.createVertexArrayOES.bind(vertexArrayObjectExtension);
                this._gl.bindVertexArray = vertexArrayObjectExtension.bindVertexArrayOES.bind(vertexArrayObjectExtension);
                this._gl.deleteVertexArray = vertexArrayObjectExtension.deleteVertexArrayOES.bind(vertexArrayObjectExtension);
            }
        }
        // Instances count
        if (this._webGLVersion > 1) {
            this._caps.instancedArrays = true;
        }
        else {
            var instanceExtension = this._gl.getExtension('ANGLE_instanced_arrays');
            if (instanceExtension != null) {
                this._caps.instancedArrays = true;
                this._gl.drawArraysInstanced = instanceExtension.drawArraysInstancedANGLE.bind(instanceExtension);
                this._gl.drawElementsInstanced = instanceExtension.drawElementsInstancedANGLE.bind(instanceExtension);
                this._gl.vertexAttribDivisor = instanceExtension.vertexAttribDivisorANGLE.bind(instanceExtension);
            }
            else {
                this._caps.instancedArrays = false;
            }
        }
        if (this._gl.getShaderPrecisionFormat) {
            var vertex_highp = this._gl.getShaderPrecisionFormat(this._gl.VERTEX_SHADER, this._gl.HIGH_FLOAT);
            var fragment_highp = this._gl.getShaderPrecisionFormat(this._gl.FRAGMENT_SHADER, this._gl.HIGH_FLOAT);
            if (vertex_highp && fragment_highp) {
                this._caps.highPrecisionShaderSupported = vertex_highp.precision !== 0 && fragment_highp.precision !== 0;
            }
        }
        if (this._webGLVersion > 1) {
            this._caps.blendMinMax = true;
        }
        else {
            var blendMinMaxExtension = this._gl.getExtension('EXT_blend_minmax');
            if (blendMinMaxExtension != null) {
                this._caps.blendMinMax = true;
                this._gl.MAX = blendMinMaxExtension.MAX_EXT;
                this._gl.MIN = blendMinMaxExtension.MIN_EXT;
            }
        }
        // Depth buffer
        this._depthCullingState.depthTest = true;
        this._depthCullingState.depthFunc = this._gl.LEQUAL;
        this._depthCullingState.depthMask = true;
        // Texture maps
        this._maxSimultaneousTextures = this._caps.maxCombinedTexturesImageUnits;
        for (var slot = 0; slot < this._maxSimultaneousTextures; slot++) {
            this._nextFreeTextureSlots.push(slot);
        }
    };
    Object.defineProperty(ThinEngine.prototype, "webGLVersion", {
        /**
         * Gets version of the current webGL context
         */
        get: function () {
            return this._webGLVersion;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets a string identifying the name of the class
     * @returns "Engine" string
     */
    ThinEngine.prototype.getClassName = function () {
        return "ThinEngine";
    };
    Object.defineProperty(ThinEngine.prototype, "isStencilEnable", {
        /**
         * Returns true if the stencil buffer has been enabled through the creation option of the context.
         */
        get: function () {
            return this._isStencilEnable;
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    ThinEngine.prototype._prepareWorkingCanvas = function () {
        if (this._workingCanvas) {
            return;
        }
        this._workingCanvas = CanvasGenerator.CreateCanvas(1, 1);
        var context = this._workingCanvas.getContext("2d");
        if (context) {
            this._workingContext = context;
        }
    };
    /**
     * Reset the texture cache to empty state
     */
    ThinEngine.prototype.resetTextureCache = function () {
        for (var key in this._boundTexturesCache) {
            if (!this._boundTexturesCache.hasOwnProperty(key)) {
                continue;
            }
            this._boundTexturesCache[key] = null;
        }
        this._currentTextureChannel = -1;
    };
    /**
     * Gets an object containing information about the current webGL context
     * @returns an object containing the vender, the renderer and the version of the current webGL context
     */
    ThinEngine.prototype.getGlInfo = function () {
        return {
            vendor: this._glVendor,
            renderer: this._glRenderer,
            version: this._glVersion
        };
    };
    /**
     * Defines the hardware scaling level.
     * By default the hardware scaling level is computed from the window device ratio.
     * if level = 1 then the engine will render at the exact resolution of the canvas. If level = 0.5 then the engine will render at twice the size of the canvas.
     * @param level defines the level to use
     */
    ThinEngine.prototype.setHardwareScalingLevel = function (level) {
        this._hardwareScalingLevel = level;
        this.resize();
    };
    /**
     * Gets the current hardware scaling level.
     * By default the hardware scaling level is computed from the window device ratio.
     * if level = 1 then the engine will render at the exact resolution of the canvas. If level = 0.5 then the engine will render at twice the size of the canvas.
     * @returns a number indicating the current hardware scaling level
     */
    ThinEngine.prototype.getHardwareScalingLevel = function () {
        return this._hardwareScalingLevel;
    };
    /**
     * Gets the list of loaded textures
     * @returns an array containing all loaded textures
     */
    ThinEngine.prototype.getLoadedTexturesCache = function () {
        return this._internalTexturesCache;
    };
    /**
     * Gets the object containing all engine capabilities
     * @returns the EngineCapabilities object
     */
    ThinEngine.prototype.getCaps = function () {
        return this._caps;
    };
    /**
     * stop executing a render loop function and remove it from the execution array
     * @param renderFunction defines the function to be removed. If not provided all functions will be removed.
     */
    ThinEngine.prototype.stopRenderLoop = function (renderFunction) {
        if (!renderFunction) {
            this._activeRenderLoops = [];
            return;
        }
        var index = this._activeRenderLoops.indexOf(renderFunction);
        if (index >= 0) {
            this._activeRenderLoops.splice(index, 1);
        }
    };
    /** @hidden */
    ThinEngine.prototype._renderLoop = function () {
        if (!this._contextWasLost) {
            var shouldRender = true;
            if (!this.renderEvenInBackground && this._windowIsBackground) {
                shouldRender = false;
            }
            if (shouldRender) {
                // Start new frame
                this.beginFrame();
                for (var index = 0; index < this._activeRenderLoops.length; index++) {
                    var renderFunction = this._activeRenderLoops[index];
                    renderFunction();
                }
                // Present
                this.endFrame();
            }
        }
        if (this._activeRenderLoops.length > 0) {
            this._frameHandler = this._queueNewFrame(this._boundRenderFunction, this.getHostWindow());
        }
        else {
            this._renderingQueueLaunched = false;
        }
    };
    /**
     * Gets the HTML canvas attached with the current webGL context
     * @returns a HTML canvas
     */
    ThinEngine.prototype.getRenderingCanvas = function () {
        return this._renderingCanvas;
    };
    /**
     * Gets host window
     * @returns the host window object
     */
    ThinEngine.prototype.getHostWindow = function () {
        if (!DomManagement.IsWindowObjectExist()) {
            return null;
        }
        if (this._renderingCanvas && this._renderingCanvas.ownerDocument && this._renderingCanvas.ownerDocument.defaultView) {
            return this._renderingCanvas.ownerDocument.defaultView;
        }
        return window;
    };
    /**
     * Gets the current render width
     * @param useScreen defines if screen size must be used (or the current render target if any)
     * @returns a number defining the current render width
     */
    ThinEngine.prototype.getRenderWidth = function (useScreen) {
        if (useScreen === void 0) { useScreen = false; }
        if (!useScreen && this._currentRenderTarget) {
            return this._currentRenderTarget.width;
        }
        return this._framebufferDimensionsObject ? this._framebufferDimensionsObject.framebufferWidth : this._gl.drawingBufferWidth;
    };
    /**
     * Gets the current render height
     * @param useScreen defines if screen size must be used (or the current render target if any)
     * @returns a number defining the current render height
     */
    ThinEngine.prototype.getRenderHeight = function (useScreen) {
        if (useScreen === void 0) { useScreen = false; }
        if (!useScreen && this._currentRenderTarget) {
            return this._currentRenderTarget.height;
        }
        return this._framebufferDimensionsObject ? this._framebufferDimensionsObject.framebufferHeight : this._gl.drawingBufferHeight;
    };
    /**
     * Can be used to override the current requestAnimationFrame requester.
     * @hidden
     */
    ThinEngine.prototype._queueNewFrame = function (bindedRenderFunction, requester) {
        return ThinEngine.QueueNewFrame(bindedRenderFunction, requester);
    };
    /**
     * Register and execute a render loop. The engine can have more than one render function
     * @param renderFunction defines the function to continuously execute
     */
    ThinEngine.prototype.runRenderLoop = function (renderFunction) {
        if (this._activeRenderLoops.indexOf(renderFunction) !== -1) {
            return;
        }
        this._activeRenderLoops.push(renderFunction);
        if (!this._renderingQueueLaunched) {
            this._renderingQueueLaunched = true;
            this._boundRenderFunction = this._renderLoop.bind(this);
            this._frameHandler = this._queueNewFrame(this._boundRenderFunction, this.getHostWindow());
        }
    };
    /**
     * Clear the current render buffer or the current render target (if any is set up)
     * @param color defines the color to use
     * @param backBuffer defines if the back buffer must be cleared
     * @param depth defines if the depth buffer must be cleared
     * @param stencil defines if the stencil buffer must be cleared
     */
    ThinEngine.prototype.clear = function (color, backBuffer, depth, stencil) {
        if (stencil === void 0) { stencil = false; }
        this.applyStates();
        var mode = 0;
        if (backBuffer && color) {
            this._gl.clearColor(color.r, color.g, color.b, color.a !== undefined ? color.a : 1.0);
            mode |= this._gl.COLOR_BUFFER_BIT;
        }
        if (depth) {
            if (this.useReverseDepthBuffer) {
                this._depthCullingState.depthFunc = this._gl.GREATER;
                this._gl.clearDepth(0.0);
            }
            else {
                this._gl.clearDepth(1.0);
            }
            mode |= this._gl.DEPTH_BUFFER_BIT;
        }
        if (stencil) {
            this._gl.clearStencil(0);
            mode |= this._gl.STENCIL_BUFFER_BIT;
        }
        this._gl.clear(mode);
    };
    /** @hidden */
    ThinEngine.prototype._viewport = function (x, y, width, height) {
        if (x !== this._viewportCached.x ||
            y !== this._viewportCached.y ||
            width !== this._viewportCached.z ||
            height !== this._viewportCached.w) {
            this._viewportCached.x = x;
            this._viewportCached.y = y;
            this._viewportCached.z = width;
            this._viewportCached.w = height;
            this._gl.viewport(x, y, width, height);
        }
    };
    /**
     * Set the WebGL's viewport
     * @param viewport defines the viewport element to be used
     * @param requiredWidth defines the width required for rendering. If not provided the rendering canvas' width is used
     * @param requiredHeight defines the height required for rendering. If not provided the rendering canvas' height is used
     */
    ThinEngine.prototype.setViewport = function (viewport, requiredWidth, requiredHeight) {
        var width = requiredWidth || this.getRenderWidth();
        var height = requiredHeight || this.getRenderHeight();
        var x = viewport.x || 0;
        var y = viewport.y || 0;
        this._cachedViewport = viewport;
        this._viewport(x * width, y * height, width * viewport.width, height * viewport.height);
    };
    /**
     * Begin a new frame
     */
    ThinEngine.prototype.beginFrame = function () {
    };
    /**
     * Enf the current frame
     */
    ThinEngine.prototype.endFrame = function () {
        // Force a flush in case we are using a bad OS.
        if (this._badOS) {
            this.flushFramebuffer();
        }
    };
    /**
     * Resize the view according to the canvas' size
     */
    ThinEngine.prototype.resize = function () {
        var width;
        var height;
        if (DomManagement.IsWindowObjectExist()) {
            width = this._renderingCanvas ? (this._renderingCanvas.clientWidth || this._renderingCanvas.width) : window.innerWidth;
            height = this._renderingCanvas ? (this._renderingCanvas.clientHeight || this._renderingCanvas.height) : window.innerHeight;
        }
        else {
            width = this._renderingCanvas ? this._renderingCanvas.width : 100;
            height = this._renderingCanvas ? this._renderingCanvas.height : 100;
        }
        this.setSize(width / this._hardwareScalingLevel, height / this._hardwareScalingLevel);
    };
    /**
     * Force a specific size of the canvas
     * @param width defines the new canvas' width
     * @param height defines the new canvas' height
     * @returns true if the size was changed
     */
    ThinEngine.prototype.setSize = function (width, height) {
        if (!this._renderingCanvas) {
            return false;
        }
        width = width | 0;
        height = height | 0;
        if (this._renderingCanvas.width === width && this._renderingCanvas.height === height) {
            return false;
        }
        this._renderingCanvas.width = width;
        this._renderingCanvas.height = height;
        return true;
    };
    /**
     * Binds the frame buffer to the specified texture.
     * @param texture The texture to render to or null for the default canvas
     * @param faceIndex The face of the texture to render to in case of cube texture
     * @param requiredWidth The width of the target to render to
     * @param requiredHeight The height of the target to render to
     * @param forceFullscreenViewport Forces the viewport to be the entire texture/screen if true
     * @param lodLevel defines the lod level to bind to the frame buffer
     * @param layer defines the 2d array index to bind to frame buffer to
     */
    ThinEngine.prototype.bindFramebuffer = function (texture, faceIndex, requiredWidth, requiredHeight, forceFullscreenViewport, lodLevel, layer) {
        if (faceIndex === void 0) { faceIndex = 0; }
        if (lodLevel === void 0) { lodLevel = 0; }
        if (layer === void 0) { layer = 0; }
        if (this._currentRenderTarget) {
            this.unBindFramebuffer(this._currentRenderTarget);
        }
        this._currentRenderTarget = texture;
        this._bindUnboundFramebuffer(texture._MSAAFramebuffer ? texture._MSAAFramebuffer : texture._framebuffer);
        var gl = this._gl;
        if (texture.is2DArray) {
            gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, texture._webGLTexture, lodLevel, layer);
        }
        else if (texture.isCube) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, texture._webGLTexture, lodLevel);
        }
        var depthStencilTexture = texture._depthStencilTexture;
        if (depthStencilTexture) {
            var attachment = (depthStencilTexture._generateStencilBuffer) ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT;
            if (texture.is2DArray) {
                gl.framebufferTextureLayer(gl.FRAMEBUFFER, attachment, depthStencilTexture._webGLTexture, lodLevel, layer);
            }
            else if (texture.isCube) {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, depthStencilTexture._webGLTexture, lodLevel);
            }
            else {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, depthStencilTexture._webGLTexture, lodLevel);
            }
        }
        if (this._cachedViewport && !forceFullscreenViewport) {
            this.setViewport(this._cachedViewport, requiredWidth, requiredHeight);
        }
        else {
            if (!requiredWidth) {
                requiredWidth = texture.width;
                if (lodLevel) {
                    requiredWidth = requiredWidth / Math.pow(2, lodLevel);
                }
            }
            if (!requiredHeight) {
                requiredHeight = texture.height;
                if (lodLevel) {
                    requiredHeight = requiredHeight / Math.pow(2, lodLevel);
                }
            }
            this._viewport(0, 0, requiredWidth, requiredHeight);
        }
        this.wipeCaches();
    };
    /** @hidden */
    ThinEngine.prototype._bindUnboundFramebuffer = function (framebuffer) {
        if (this._currentFramebuffer !== framebuffer) {
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer);
            this._currentFramebuffer = framebuffer;
        }
    };
    /**
     * Unbind the current render target texture from the webGL context
     * @param texture defines the render target texture to unbind
     * @param disableGenerateMipMaps defines a boolean indicating that mipmaps must not be generated
     * @param onBeforeUnbind defines a function which will be called before the effective unbind
     */
    ThinEngine.prototype.unBindFramebuffer = function (texture, disableGenerateMipMaps, onBeforeUnbind) {
        if (disableGenerateMipMaps === void 0) { disableGenerateMipMaps = false; }
        this._currentRenderTarget = null;
        // If MSAA, we need to bitblt back to main texture
        var gl = this._gl;
        if (texture._MSAAFramebuffer) {
            if (texture._textureArray) {
                // This texture is part of a MRT texture, we need to treat all attachments
                this.unBindMultiColorAttachmentFramebuffer(texture._textureArray, disableGenerateMipMaps, onBeforeUnbind);
                return;
            }
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, texture._MSAAFramebuffer);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, texture._framebuffer);
            gl.blitFramebuffer(0, 0, texture.width, texture.height, 0, 0, texture.width, texture.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        }
        if (texture.generateMipMaps && !disableGenerateMipMaps && !texture.isCube) {
            this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
            gl.generateMipmap(gl.TEXTURE_2D);
            this._bindTextureDirectly(gl.TEXTURE_2D, null);
        }
        if (onBeforeUnbind) {
            if (texture._MSAAFramebuffer) {
                // Bind the correct framebuffer
                this._bindUnboundFramebuffer(texture._framebuffer);
            }
            onBeforeUnbind();
        }
        this._bindUnboundFramebuffer(null);
    };
    /**
     * Force a webGL flush (ie. a flush of all waiting webGL commands)
     */
    ThinEngine.prototype.flushFramebuffer = function () {
        this._gl.flush();
    };
    /**
     * Unbind the current render target and bind the default framebuffer
     */
    ThinEngine.prototype.restoreDefaultFramebuffer = function () {
        if (this._currentRenderTarget) {
            this.unBindFramebuffer(this._currentRenderTarget);
        }
        else {
            this._bindUnboundFramebuffer(null);
        }
        if (this._cachedViewport) {
            this.setViewport(this._cachedViewport);
        }
        this.wipeCaches();
    };
    // VBOs
    /** @hidden */
    ThinEngine.prototype._resetVertexBufferBinding = function () {
        this.bindArrayBuffer(null);
        this._cachedVertexBuffers = null;
    };
    /**
     * Creates a vertex buffer
     * @param data the data for the vertex buffer
     * @returns the new WebGL static buffer
     */
    ThinEngine.prototype.createVertexBuffer = function (data) {
        return this._createVertexBuffer(data, this._gl.STATIC_DRAW);
    };
    ThinEngine.prototype._createVertexBuffer = function (data, usage) {
        var vbo = this._gl.createBuffer();
        if (!vbo) {
            throw new Error("Unable to create vertex buffer");
        }
        var dataBuffer = new WebGLDataBuffer(vbo);
        this.bindArrayBuffer(dataBuffer);
        if (data instanceof Array) {
            this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(data), this._gl.STATIC_DRAW);
        }
        else {
            this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW);
        }
        this._resetVertexBufferBinding();
        dataBuffer.references = 1;
        return dataBuffer;
    };
    /**
     * Creates a dynamic vertex buffer
     * @param data the data for the dynamic vertex buffer
     * @returns the new WebGL dynamic buffer
     */
    ThinEngine.prototype.createDynamicVertexBuffer = function (data) {
        return this._createVertexBuffer(data, this._gl.DYNAMIC_DRAW);
    };
    ThinEngine.prototype._resetIndexBufferBinding = function () {
        this.bindIndexBuffer(null);
        this._cachedIndexBuffer = null;
    };
    /**
     * Creates a new index buffer
     * @param indices defines the content of the index buffer
     * @param updatable defines if the index buffer must be updatable
     * @returns a new webGL buffer
     */
    ThinEngine.prototype.createIndexBuffer = function (indices, updatable) {
        var vbo = this._gl.createBuffer();
        var dataBuffer = new WebGLDataBuffer(vbo);
        if (!vbo) {
            throw new Error("Unable to create index buffer");
        }
        this.bindIndexBuffer(dataBuffer);
        var data = this._normalizeIndexData(indices);
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, data, updatable ? this._gl.DYNAMIC_DRAW : this._gl.STATIC_DRAW);
        this._resetIndexBufferBinding();
        dataBuffer.references = 1;
        dataBuffer.is32Bits = (data.BYTES_PER_ELEMENT === 4);
        return dataBuffer;
    };
    ThinEngine.prototype._normalizeIndexData = function (indices) {
        if (indices instanceof Uint16Array) {
            return indices;
        }
        // Check 32 bit support
        if (this._caps.uintIndices) {
            if (indices instanceof Uint32Array) {
                return indices;
            }
            else {
                // number[] or Int32Array, check if 32 bit is necessary
                for (var index = 0; index < indices.length; index++) {
                    if (indices[index] >= 65535) {
                        return new Uint32Array(indices);
                    }
                }
                return new Uint16Array(indices);
            }
        }
        // No 32 bit support, force conversion to 16 bit (values greater 16 bit are lost)
        return new Uint16Array(indices);
    };
    /**
     * Bind a webGL buffer to the webGL context
     * @param buffer defines the buffer to bind
     */
    ThinEngine.prototype.bindArrayBuffer = function (buffer) {
        if (!this._vaoRecordInProgress) {
            this._unbindVertexArrayObject();
        }
        this.bindBuffer(buffer, this._gl.ARRAY_BUFFER);
    };
    /**
     * Bind a specific block at a given index in a specific shader program
     * @param pipelineContext defines the pipeline context to use
     * @param blockName defines the block name
     * @param index defines the index where to bind the block
     */
    ThinEngine.prototype.bindUniformBlock = function (pipelineContext, blockName, index) {
        var program = pipelineContext.program;
        var uniformLocation = this._gl.getUniformBlockIndex(program, blockName);
        this._gl.uniformBlockBinding(program, uniformLocation, index);
    };
    ThinEngine.prototype.bindIndexBuffer = function (buffer) {
        if (!this._vaoRecordInProgress) {
            this._unbindVertexArrayObject();
        }
        this.bindBuffer(buffer, this._gl.ELEMENT_ARRAY_BUFFER);
    };
    ThinEngine.prototype.bindBuffer = function (buffer, target) {
        if (this._vaoRecordInProgress || this._currentBoundBuffer[target] !== buffer) {
            this._gl.bindBuffer(target, buffer ? buffer.underlyingResource : null);
            this._currentBoundBuffer[target] = buffer;
        }
    };
    /**
     * update the bound buffer with the given data
     * @param data defines the data to update
     */
    ThinEngine.prototype.updateArrayBuffer = function (data) {
        this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, data);
    };
    ThinEngine.prototype._vertexAttribPointer = function (buffer, indx, size, type, normalized, stride, offset) {
        var pointer = this._currentBufferPointers[indx];
        if (!pointer) {
            return;
        }
        var changed = false;
        if (!pointer.active) {
            changed = true;
            pointer.active = true;
            pointer.index = indx;
            pointer.size = size;
            pointer.type = type;
            pointer.normalized = normalized;
            pointer.stride = stride;
            pointer.offset = offset;
            pointer.buffer = buffer;
        }
        else {
            if (pointer.buffer !== buffer) {
                pointer.buffer = buffer;
                changed = true;
            }
            if (pointer.size !== size) {
                pointer.size = size;
                changed = true;
            }
            if (pointer.type !== type) {
                pointer.type = type;
                changed = true;
            }
            if (pointer.normalized !== normalized) {
                pointer.normalized = normalized;
                changed = true;
            }
            if (pointer.stride !== stride) {
                pointer.stride = stride;
                changed = true;
            }
            if (pointer.offset !== offset) {
                pointer.offset = offset;
                changed = true;
            }
        }
        if (changed || this._vaoRecordInProgress) {
            this.bindArrayBuffer(buffer);
            this._gl.vertexAttribPointer(indx, size, type, normalized, stride, offset);
        }
    };
    /** @hidden */
    ThinEngine.prototype._bindIndexBufferWithCache = function (indexBuffer) {
        if (indexBuffer == null) {
            return;
        }
        if (this._cachedIndexBuffer !== indexBuffer) {
            this._cachedIndexBuffer = indexBuffer;
            this.bindIndexBuffer(indexBuffer);
            this._uintIndicesCurrentlySet = indexBuffer.is32Bits;
        }
    };
    ThinEngine.prototype._bindVertexBuffersAttributes = function (vertexBuffers, effect) {
        var attributes = effect.getAttributesNames();
        if (!this._vaoRecordInProgress) {
            this._unbindVertexArrayObject();
        }
        this.unbindAllAttributes();
        for (var index = 0; index < attributes.length; index++) {
            var order = effect.getAttributeLocation(index);
            if (order >= 0) {
                var vertexBuffer = vertexBuffers[attributes[index]];
                if (!vertexBuffer) {
                    continue;
                }
                this._gl.enableVertexAttribArray(order);
                if (!this._vaoRecordInProgress) {
                    this._vertexAttribArraysEnabled[order] = true;
                }
                var buffer = vertexBuffer.getBuffer();
                if (buffer) {
                    this._vertexAttribPointer(buffer, order, vertexBuffer.getSize(), vertexBuffer.type, vertexBuffer.normalized, vertexBuffer.byteStride, vertexBuffer.byteOffset);
                    if (vertexBuffer.getIsInstanced()) {
                        this._gl.vertexAttribDivisor(order, vertexBuffer.getInstanceDivisor());
                        if (!this._vaoRecordInProgress) {
                            this._currentInstanceLocations.push(order);
                            this._currentInstanceBuffers.push(buffer);
                        }
                    }
                }
            }
        }
    };
    /**
     * Records a vertex array object
     * @see https://doc.babylonjs.com/features/webgl2#vertex-array-objects
     * @param vertexBuffers defines the list of vertex buffers to store
     * @param indexBuffer defines the index buffer to store
     * @param effect defines the effect to store
     * @returns the new vertex array object
     */
    ThinEngine.prototype.recordVertexArrayObject = function (vertexBuffers, indexBuffer, effect) {
        var vao = this._gl.createVertexArray();
        this._vaoRecordInProgress = true;
        this._gl.bindVertexArray(vao);
        this._mustWipeVertexAttributes = true;
        this._bindVertexBuffersAttributes(vertexBuffers, effect);
        this.bindIndexBuffer(indexBuffer);
        this._vaoRecordInProgress = false;
        this._gl.bindVertexArray(null);
        return vao;
    };
    /**
     * Bind a specific vertex array object
     * @see https://doc.babylonjs.com/features/webgl2#vertex-array-objects
     * @param vertexArrayObject defines the vertex array object to bind
     * @param indexBuffer defines the index buffer to bind
     */
    ThinEngine.prototype.bindVertexArrayObject = function (vertexArrayObject, indexBuffer) {
        if (this._cachedVertexArrayObject !== vertexArrayObject) {
            this._cachedVertexArrayObject = vertexArrayObject;
            this._gl.bindVertexArray(vertexArrayObject);
            this._cachedVertexBuffers = null;
            this._cachedIndexBuffer = null;
            this._uintIndicesCurrentlySet = indexBuffer != null && indexBuffer.is32Bits;
            this._mustWipeVertexAttributes = true;
        }
    };
    /**
     * Bind webGl buffers directly to the webGL context
     * @param vertexBuffer defines the vertex buffer to bind
     * @param indexBuffer defines the index buffer to bind
     * @param vertexDeclaration defines the vertex declaration to use with the vertex buffer
     * @param vertexStrideSize defines the vertex stride of the vertex buffer
     * @param effect defines the effect associated with the vertex buffer
     */
    ThinEngine.prototype.bindBuffersDirectly = function (vertexBuffer, indexBuffer, vertexDeclaration, vertexStrideSize, effect) {
        if (this._cachedVertexBuffers !== vertexBuffer || this._cachedEffectForVertexBuffers !== effect) {
            this._cachedVertexBuffers = vertexBuffer;
            this._cachedEffectForVertexBuffers = effect;
            var attributesCount = effect.getAttributesCount();
            this._unbindVertexArrayObject();
            this.unbindAllAttributes();
            var offset = 0;
            for (var index = 0; index < attributesCount; index++) {
                if (index < vertexDeclaration.length) {
                    var order = effect.getAttributeLocation(index);
                    if (order >= 0) {
                        this._gl.enableVertexAttribArray(order);
                        this._vertexAttribArraysEnabled[order] = true;
                        this._vertexAttribPointer(vertexBuffer, order, vertexDeclaration[index], this._gl.FLOAT, false, vertexStrideSize, offset);
                    }
                    offset += vertexDeclaration[index] * 4;
                }
            }
        }
        this._bindIndexBufferWithCache(indexBuffer);
    };
    ThinEngine.prototype._unbindVertexArrayObject = function () {
        if (!this._cachedVertexArrayObject) {
            return;
        }
        this._cachedVertexArrayObject = null;
        this._gl.bindVertexArray(null);
    };
    /**
     * Bind a list of vertex buffers to the webGL context
     * @param vertexBuffers defines the list of vertex buffers to bind
     * @param indexBuffer defines the index buffer to bind
     * @param effect defines the effect associated with the vertex buffers
     */
    ThinEngine.prototype.bindBuffers = function (vertexBuffers, indexBuffer, effect) {
        if (this._cachedVertexBuffers !== vertexBuffers || this._cachedEffectForVertexBuffers !== effect) {
            this._cachedVertexBuffers = vertexBuffers;
            this._cachedEffectForVertexBuffers = effect;
            this._bindVertexBuffersAttributes(vertexBuffers, effect);
        }
        this._bindIndexBufferWithCache(indexBuffer);
    };
    /**
     * Unbind all instance attributes
     */
    ThinEngine.prototype.unbindInstanceAttributes = function () {
        var boundBuffer;
        for (var i = 0, ul = this._currentInstanceLocations.length; i < ul; i++) {
            var instancesBuffer = this._currentInstanceBuffers[i];
            if (boundBuffer != instancesBuffer && instancesBuffer.references) {
                boundBuffer = instancesBuffer;
                this.bindArrayBuffer(instancesBuffer);
            }
            var offsetLocation = this._currentInstanceLocations[i];
            this._gl.vertexAttribDivisor(offsetLocation, 0);
        }
        this._currentInstanceBuffers.length = 0;
        this._currentInstanceLocations.length = 0;
    };
    /**
     * Release and free the memory of a vertex array object
     * @param vao defines the vertex array object to delete
     */
    ThinEngine.prototype.releaseVertexArrayObject = function (vao) {
        this._gl.deleteVertexArray(vao);
    };
    /** @hidden */
    ThinEngine.prototype._releaseBuffer = function (buffer) {
        buffer.references--;
        if (buffer.references === 0) {
            this._deleteBuffer(buffer);
            return true;
        }
        return false;
    };
    ThinEngine.prototype._deleteBuffer = function (buffer) {
        this._gl.deleteBuffer(buffer.underlyingResource);
    };
    /**
     * Update the content of a webGL buffer used with instanciation and bind it to the webGL context
     * @param instancesBuffer defines the webGL buffer to update and bind
     * @param data defines the data to store in the buffer
     * @param offsetLocations defines the offsets or attributes information used to determine where data must be stored in the buffer
     */
    ThinEngine.prototype.updateAndBindInstancesBuffer = function (instancesBuffer, data, offsetLocations) {
        this.bindArrayBuffer(instancesBuffer);
        if (data) {
            this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, data);
        }
        if (offsetLocations[0].index !== undefined) {
            this.bindInstancesBuffer(instancesBuffer, offsetLocations, true);
        }
        else {
            for (var index = 0; index < 4; index++) {
                var offsetLocation = offsetLocations[index];
                if (!this._vertexAttribArraysEnabled[offsetLocation]) {
                    this._gl.enableVertexAttribArray(offsetLocation);
                    this._vertexAttribArraysEnabled[offsetLocation] = true;
                }
                this._vertexAttribPointer(instancesBuffer, offsetLocation, 4, this._gl.FLOAT, false, 64, index * 16);
                this._gl.vertexAttribDivisor(offsetLocation, 1);
                this._currentInstanceLocations.push(offsetLocation);
                this._currentInstanceBuffers.push(instancesBuffer);
            }
        }
    };
    /**
     * Bind the content of a webGL buffer used with instantiation
     * @param instancesBuffer defines the webGL buffer to bind
     * @param attributesInfo defines the offsets or attributes information used to determine where data must be stored in the buffer
     * @param computeStride defines Whether to compute the strides from the info or use the default 0
     */
    ThinEngine.prototype.bindInstancesBuffer = function (instancesBuffer, attributesInfo, computeStride) {
        if (computeStride === void 0) { computeStride = true; }
        this.bindArrayBuffer(instancesBuffer);
        var stride = 0;
        if (computeStride) {
            for (var i = 0; i < attributesInfo.length; i++) {
                var ai = attributesInfo[i];
                stride += ai.attributeSize * 4;
            }
        }
        for (var i = 0; i < attributesInfo.length; i++) {
            var ai = attributesInfo[i];
            if (ai.index === undefined) {
                ai.index = this._currentEffect.getAttributeLocationByName(ai.attributeName);
            }
            if (ai.index < 0) {
                continue;
            }
            if (!this._vertexAttribArraysEnabled[ai.index]) {
                this._gl.enableVertexAttribArray(ai.index);
                this._vertexAttribArraysEnabled[ai.index] = true;
            }
            this._vertexAttribPointer(instancesBuffer, ai.index, ai.attributeSize, ai.attributeType || this._gl.FLOAT, ai.normalized || false, stride, ai.offset);
            this._gl.vertexAttribDivisor(ai.index, ai.divisor === undefined ? 1 : ai.divisor);
            this._currentInstanceLocations.push(ai.index);
            this._currentInstanceBuffers.push(instancesBuffer);
        }
    };
    /**
     * Disable the instance attribute corresponding to the name in parameter
     * @param name defines the name of the attribute to disable
     */
    ThinEngine.prototype.disableInstanceAttributeByName = function (name) {
        if (!this._currentEffect) {
            return;
        }
        var attributeLocation = this._currentEffect.getAttributeLocationByName(name);
        this.disableInstanceAttribute(attributeLocation);
    };
    /**
     * Disable the instance attribute corresponding to the location in parameter
     * @param attributeLocation defines the attribute location of the attribute to disable
     */
    ThinEngine.prototype.disableInstanceAttribute = function (attributeLocation) {
        var shouldClean = false;
        var index;
        while ((index = this._currentInstanceLocations.indexOf(attributeLocation)) !== -1) {
            this._currentInstanceLocations.splice(index, 1);
            this._currentInstanceBuffers.splice(index, 1);
            shouldClean = true;
            index = this._currentInstanceLocations.indexOf(attributeLocation);
        }
        if (shouldClean) {
            this._gl.vertexAttribDivisor(attributeLocation, 0);
            this.disableAttributeByIndex(attributeLocation);
        }
    };
    /**
     * Disable the attribute corresponding to the location in parameter
     * @param attributeLocation defines the attribute location of the attribute to disable
     */
    ThinEngine.prototype.disableAttributeByIndex = function (attributeLocation) {
        this._gl.disableVertexAttribArray(attributeLocation);
        this._vertexAttribArraysEnabled[attributeLocation] = false;
        this._currentBufferPointers[attributeLocation].active = false;
    };
    /**
     * Send a draw order
     * @param useTriangles defines if triangles must be used to draw (else wireframe will be used)
     * @param indexStart defines the starting index
     * @param indexCount defines the number of index to draw
     * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
     */
    ThinEngine.prototype.draw = function (useTriangles, indexStart, indexCount, instancesCount) {
        this.drawElementsType(useTriangles ? 0 : 1, indexStart, indexCount, instancesCount);
    };
    /**
     * Draw a list of points
     * @param verticesStart defines the index of first vertex to draw
     * @param verticesCount defines the count of vertices to draw
     * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
     */
    ThinEngine.prototype.drawPointClouds = function (verticesStart, verticesCount, instancesCount) {
        this.drawArraysType(2, verticesStart, verticesCount, instancesCount);
    };
    /**
     * Draw a list of unindexed primitives
     * @param useTriangles defines if triangles must be used to draw (else wireframe will be used)
     * @param verticesStart defines the index of first vertex to draw
     * @param verticesCount defines the count of vertices to draw
     * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
     */
    ThinEngine.prototype.drawUnIndexed = function (useTriangles, verticesStart, verticesCount, instancesCount) {
        this.drawArraysType(useTriangles ? 0 : 1, verticesStart, verticesCount, instancesCount);
    };
    /**
     * Draw a list of indexed primitives
     * @param fillMode defines the primitive to use
     * @param indexStart defines the starting index
     * @param indexCount defines the number of index to draw
     * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
     */
    ThinEngine.prototype.drawElementsType = function (fillMode, indexStart, indexCount, instancesCount) {
        // Apply states
        this.applyStates();
        this._reportDrawCall();
        // Render
        var drawMode = this._drawMode(fillMode);
        var indexFormat = this._uintIndicesCurrentlySet ? this._gl.UNSIGNED_INT : this._gl.UNSIGNED_SHORT;
        var mult = this._uintIndicesCurrentlySet ? 4 : 2;
        if (instancesCount) {
            this._gl.drawElementsInstanced(drawMode, indexCount, indexFormat, indexStart * mult, instancesCount);
        }
        else {
            this._gl.drawElements(drawMode, indexCount, indexFormat, indexStart * mult);
        }
    };
    /**
     * Draw a list of unindexed primitives
     * @param fillMode defines the primitive to use
     * @param verticesStart defines the index of first vertex to draw
     * @param verticesCount defines the count of vertices to draw
     * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
     */
    ThinEngine.prototype.drawArraysType = function (fillMode, verticesStart, verticesCount, instancesCount) {
        // Apply states
        this.applyStates();
        this._reportDrawCall();
        var drawMode = this._drawMode(fillMode);
        if (instancesCount) {
            this._gl.drawArraysInstanced(drawMode, verticesStart, verticesCount, instancesCount);
        }
        else {
            this._gl.drawArrays(drawMode, verticesStart, verticesCount);
        }
    };
    ThinEngine.prototype._drawMode = function (fillMode) {
        switch (fillMode) {
            // Triangle views
            case 0:
                return this._gl.TRIANGLES;
            case 2:
                return this._gl.POINTS;
            case 1:
                return this._gl.LINES;
            // Draw modes
            case 3:
                return this._gl.POINTS;
            case 4:
                return this._gl.LINES;
            case 5:
                return this._gl.LINE_LOOP;
            case 6:
                return this._gl.LINE_STRIP;
            case 7:
                return this._gl.TRIANGLE_STRIP;
            case 8:
                return this._gl.TRIANGLE_FAN;
            default:
                return this._gl.TRIANGLES;
        }
    };
    /** @hidden */
    ThinEngine.prototype._reportDrawCall = function () {
        // Will be implemented by children
    };
    // Shaders
    /** @hidden */
    ThinEngine.prototype._releaseEffect = function (effect) {
        if (this._compiledEffects[effect._key]) {
            delete this._compiledEffects[effect._key];
            this._deletePipelineContext(effect.getPipelineContext());
        }
    };
    /** @hidden */
    ThinEngine.prototype._deletePipelineContext = function (pipelineContext) {
        var webGLPipelineContext = pipelineContext;
        if (webGLPipelineContext && webGLPipelineContext.program) {
            webGLPipelineContext.program.__SPECTOR_rebuildProgram = null;
            this._gl.deleteProgram(webGLPipelineContext.program);
        }
    };
    /**
     * Create a new effect (used to store vertex/fragment shaders)
     * @param baseName defines the base name of the effect (The name of file without .fragment.fx or .vertex.fx)
     * @param attributesNamesOrOptions defines either a list of attribute names or an IEffectCreationOptions object
     * @param uniformsNamesOrEngine defines either a list of uniform names or the engine to use
     * @param samplers defines an array of string used to represent textures
     * @param defines defines the string containing the defines to use to compile the shaders
     * @param fallbacks defines the list of potential fallbacks to use if shader conmpilation fails
     * @param onCompiled defines a function to call when the effect creation is successful
     * @param onError defines a function to call when the effect creation has failed
     * @param indexParameters defines an object containing the index values to use to compile shaders (like the maximum number of simultaneous lights)
     * @returns the new Effect
     */
    ThinEngine.prototype.createEffect = function (baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, defines, fallbacks, onCompiled, onError, indexParameters) {
        var vertex = baseName.vertexElement || baseName.vertex || baseName.vertexToken || baseName.vertexSource || baseName;
        var fragment = baseName.fragmentElement || baseName.fragment || baseName.fragmentToken || baseName.fragmentSource || baseName;
        var name = vertex + "+" + fragment + "@" + (defines ? defines : attributesNamesOrOptions.defines);
        if (this._compiledEffects[name]) {
            var compiledEffect = this._compiledEffects[name];
            if (onCompiled && compiledEffect.isReady()) {
                onCompiled(compiledEffect);
            }
            return compiledEffect;
        }
        var effect = new Effect(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, this, defines, fallbacks, onCompiled, onError, indexParameters);
        effect._key = name;
        this._compiledEffects[name] = effect;
        return effect;
    };
    ThinEngine._ConcatenateShader = function (source, defines, shaderVersion) {
        if (shaderVersion === void 0) { shaderVersion = ""; }
        return shaderVersion + (defines ? defines + "\n" : "") + source;
    };
    ThinEngine.prototype._compileShader = function (source, type, defines, shaderVersion) {
        return this._compileRawShader(ThinEngine._ConcatenateShader(source, defines, shaderVersion), type);
    };
    ThinEngine.prototype._compileRawShader = function (source, type) {
        var gl = this._gl;
        var shader = gl.createShader(type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
        if (!shader) {
            throw new Error("Something went wrong while compile the shader.");
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    };
    /** @hidden */
    ThinEngine.prototype._getShaderSource = function (shader) {
        return this._gl.getShaderSource(shader);
    };
    /**
     * Directly creates a webGL program
     * @param pipelineContext  defines the pipeline context to attach to
     * @param vertexCode defines the vertex shader code to use
     * @param fragmentCode defines the fragment shader code to use
     * @param context defines the webGL context to use (if not set, the current one will be used)
     * @param transformFeedbackVaryings defines the list of transform feedback varyings to use
     * @returns the new webGL program
     */
    ThinEngine.prototype.createRawShaderProgram = function (pipelineContext, vertexCode, fragmentCode, context, transformFeedbackVaryings) {
        if (transformFeedbackVaryings === void 0) { transformFeedbackVaryings = null; }
        context = context || this._gl;
        var vertexShader = this._compileRawShader(vertexCode, "vertex");
        var fragmentShader = this._compileRawShader(fragmentCode, "fragment");
        return this._createShaderProgram(pipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings);
    };
    /**
     * Creates a webGL program
     * @param pipelineContext  defines the pipeline context to attach to
     * @param vertexCode  defines the vertex shader code to use
     * @param fragmentCode defines the fragment shader code to use
     * @param defines defines the string containing the defines to use to compile the shaders
     * @param context defines the webGL context to use (if not set, the current one will be used)
     * @param transformFeedbackVaryings defines the list of transform feedback varyings to use
     * @returns the new webGL program
     */
    ThinEngine.prototype.createShaderProgram = function (pipelineContext, vertexCode, fragmentCode, defines, context, transformFeedbackVaryings) {
        if (transformFeedbackVaryings === void 0) { transformFeedbackVaryings = null; }
        context = context || this._gl;
        var shaderVersion = (this._webGLVersion > 1) ? "#version 300 es\n#define WEBGL2 \n" : "";
        var vertexShader = this._compileShader(vertexCode, "vertex", defines, shaderVersion);
        var fragmentShader = this._compileShader(fragmentCode, "fragment", defines, shaderVersion);
        return this._createShaderProgram(pipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings);
    };
    /**
     * Creates a new pipeline context
     * @returns the new pipeline
     */
    ThinEngine.prototype.createPipelineContext = function () {
        var pipelineContext = new WebGLPipelineContext();
        pipelineContext.engine = this;
        if (this._caps.parallelShaderCompile) {
            pipelineContext.isParallelCompiled = true;
        }
        return pipelineContext;
    };
    ThinEngine.prototype._createShaderProgram = function (pipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings) {
        var shaderProgram = context.createProgram();
        pipelineContext.program = shaderProgram;
        if (!shaderProgram) {
            throw new Error("Unable to create program");
        }
        context.attachShader(shaderProgram, vertexShader);
        context.attachShader(shaderProgram, fragmentShader);
        context.linkProgram(shaderProgram);
        pipelineContext.context = context;
        pipelineContext.vertexShader = vertexShader;
        pipelineContext.fragmentShader = fragmentShader;
        if (!pipelineContext.isParallelCompiled) {
            this._finalizePipelineContext(pipelineContext);
        }
        return shaderProgram;
    };
    ThinEngine.prototype._finalizePipelineContext = function (pipelineContext) {
        var context = pipelineContext.context;
        var vertexShader = pipelineContext.vertexShader;
        var fragmentShader = pipelineContext.fragmentShader;
        var program = pipelineContext.program;
        var linked = context.getProgramParameter(program, context.LINK_STATUS);
        if (!linked) { // Get more info
            // Vertex
            if (!this._gl.getShaderParameter(vertexShader, this._gl.COMPILE_STATUS)) {
                var log = this._gl.getShaderInfoLog(vertexShader);
                if (log) {
                    pipelineContext.vertexCompilationError = log;
                    throw new Error("VERTEX SHADER " + log);
                }
            }
            // Fragment
            if (!this._gl.getShaderParameter(fragmentShader, this._gl.COMPILE_STATUS)) {
                var log = this._gl.getShaderInfoLog(fragmentShader);
                if (log) {
                    pipelineContext.fragmentCompilationError = log;
                    throw new Error("FRAGMENT SHADER " + log);
                }
            }
            var error = context.getProgramInfoLog(program);
            if (error) {
                pipelineContext.programLinkError = error;
                throw new Error(error);
            }
        }
        if (this.validateShaderPrograms) {
            context.validateProgram(program);
            var validated = context.getProgramParameter(program, context.VALIDATE_STATUS);
            if (!validated) {
                var error = context.getProgramInfoLog(program);
                if (error) {
                    pipelineContext.programValidationError = error;
                    throw new Error(error);
                }
            }
        }
        context.deleteShader(vertexShader);
        context.deleteShader(fragmentShader);
        pipelineContext.vertexShader = undefined;
        pipelineContext.fragmentShader = undefined;
        if (pipelineContext.onCompiled) {
            pipelineContext.onCompiled();
            pipelineContext.onCompiled = undefined;
        }
    };
    /** @hidden */
    ThinEngine.prototype._preparePipelineContext = function (pipelineContext, vertexSourceCode, fragmentSourceCode, createAsRaw, rebuildRebind, defines, transformFeedbackVaryings) {
        var webGLRenderingState = pipelineContext;
        if (createAsRaw) {
            webGLRenderingState.program = this.createRawShaderProgram(webGLRenderingState, vertexSourceCode, fragmentSourceCode, undefined, transformFeedbackVaryings);
        }
        else {
            webGLRenderingState.program = this.createShaderProgram(webGLRenderingState, vertexSourceCode, fragmentSourceCode, defines, undefined, transformFeedbackVaryings);
        }
        webGLRenderingState.program.__SPECTOR_rebuildProgram = rebuildRebind;
    };
    /** @hidden */
    ThinEngine.prototype._isRenderingStateCompiled = function (pipelineContext) {
        var webGLPipelineContext = pipelineContext;
        if (this._gl.getProgramParameter(webGLPipelineContext.program, this._caps.parallelShaderCompile.COMPLETION_STATUS_KHR)) {
            this._finalizePipelineContext(webGLPipelineContext);
            return true;
        }
        return false;
    };
    /** @hidden */
    ThinEngine.prototype._executeWhenRenderingStateIsCompiled = function (pipelineContext, action) {
        var webGLPipelineContext = pipelineContext;
        if (!webGLPipelineContext.isParallelCompiled) {
            action();
            return;
        }
        var oldHandler = webGLPipelineContext.onCompiled;
        if (oldHandler) {
            webGLPipelineContext.onCompiled = function () {
                oldHandler();
                action();
            };
        }
        else {
            webGLPipelineContext.onCompiled = action;
        }
    };
    /**
     * Gets the list of webGL uniform locations associated with a specific program based on a list of uniform names
     * @param pipelineContext defines the pipeline context to use
     * @param uniformsNames defines the list of uniform names
     * @returns an array of webGL uniform locations
     */
    ThinEngine.prototype.getUniforms = function (pipelineContext, uniformsNames) {
        var results = new Array();
        var webGLPipelineContext = pipelineContext;
        for (var index = 0; index < uniformsNames.length; index++) {
            results.push(this._gl.getUniformLocation(webGLPipelineContext.program, uniformsNames[index]));
        }
        return results;
    };
    /**
     * Gets the lsit of active attributes for a given webGL program
     * @param pipelineContext defines the pipeline context to use
     * @param attributesNames defines the list of attribute names to get
     * @returns an array of indices indicating the offset of each attribute
     */
    ThinEngine.prototype.getAttributes = function (pipelineContext, attributesNames) {
        var results = [];
        var webGLPipelineContext = pipelineContext;
        for (var index = 0; index < attributesNames.length; index++) {
            try {
                results.push(this._gl.getAttribLocation(webGLPipelineContext.program, attributesNames[index]));
            }
            catch (e) {
                results.push(-1);
            }
        }
        return results;
    };
    /**
     * Activates an effect, mkaing it the current one (ie. the one used for rendering)
     * @param effect defines the effect to activate
     */
    ThinEngine.prototype.enableEffect = function (effect) {
        if (!effect || effect === this._currentEffect) {
            return;
        }
        // Use program
        this.bindSamplers(effect);
        this._currentEffect = effect;
        if (effect.onBind) {
            effect.onBind(effect);
        }
        if (effect._onBindObservable) {
            effect._onBindObservable.notifyObservers(effect);
        }
    };
    /**
     * Set the value of an uniform to a number (int)
     * @param uniform defines the webGL uniform location where to store the value
     * @param value defines the int number to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setInt = function (uniform, value) {
        if (!uniform) {
            return false;
        }
        this._gl.uniform1i(uniform, value);
        return true;
    };
    /**
     * Set the value of an uniform to an array of int32
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of int32 to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setIntArray = function (uniform, array) {
        if (!uniform) {
            return false;
        }
        this._gl.uniform1iv(uniform, array);
        return true;
    };
    /**
     * Set the value of an uniform to an array of int32 (stored as vec2)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of int32 to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setIntArray2 = function (uniform, array) {
        if (!uniform || array.length % 2 !== 0) {
            return false;
        }
        this._gl.uniform2iv(uniform, array);
        return true;
    };
    /**
     * Set the value of an uniform to an array of int32 (stored as vec3)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of int32 to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setIntArray3 = function (uniform, array) {
        if (!uniform || array.length % 3 !== 0) {
            return false;
        }
        this._gl.uniform3iv(uniform, array);
        return true;
    };
    /**
     * Set the value of an uniform to an array of int32 (stored as vec4)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of int32 to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setIntArray4 = function (uniform, array) {
        if (!uniform || array.length % 4 !== 0) {
            return false;
        }
        this._gl.uniform4iv(uniform, array);
        return true;
    };
    /**
     * Set the value of an uniform to an array of number
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of number to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setArray = function (uniform, array) {
        if (!uniform) {
            return false;
        }
        this._gl.uniform1fv(uniform, array);
        return true;
    };
    /**
     * Set the value of an uniform to an array of number (stored as vec2)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of number to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setArray2 = function (uniform, array) {
        if (!uniform || array.length % 2 !== 0) {
            return false;
        }
        this._gl.uniform2fv(uniform, array);
        return true;
    };
    /**
     * Set the value of an uniform to an array of number (stored as vec3)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of number to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setArray3 = function (uniform, array) {
        if (!uniform || array.length % 3 !== 0) {
            return false;
        }
        this._gl.uniform3fv(uniform, array);
        return true;
    };
    /**
     * Set the value of an uniform to an array of number (stored as vec4)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of number to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setArray4 = function (uniform, array) {
        if (!uniform || array.length % 4 !== 0) {
            return false;
        }
        this._gl.uniform4fv(uniform, array);
        return true;
    };
    /**
     * Set the value of an uniform to an array of float32 (stored as matrices)
     * @param uniform defines the webGL uniform location where to store the value
     * @param matrices defines the array of float32 to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setMatrices = function (uniform, matrices) {
        if (!uniform) {
            return false;
        }
        this._gl.uniformMatrix4fv(uniform, false, matrices);
        return true;
    };
    /**
     * Set the value of an uniform to a matrix (3x3)
     * @param uniform defines the webGL uniform location where to store the value
     * @param matrix defines the Float32Array representing the 3x3 matrix to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setMatrix3x3 = function (uniform, matrix) {
        if (!uniform) {
            return false;
        }
        this._gl.uniformMatrix3fv(uniform, false, matrix);
        return true;
    };
    /**
     * Set the value of an uniform to a matrix (2x2)
     * @param uniform defines the webGL uniform location where to store the value
     * @param matrix defines the Float32Array representing the 2x2 matrix to store
     * @returns true if the value was set
     */
    ThinEngine.prototype.setMatrix2x2 = function (uniform, matrix) {
        if (!uniform) {
            return false;
        }
        this._gl.uniformMatrix2fv(uniform, false, matrix);
        return true;
    };
    /**
     * Set the value of an uniform to a number (float)
     * @param uniform defines the webGL uniform location where to store the value
     * @param value defines the float number to store
     * @returns true if the value was transfered
     */
    ThinEngine.prototype.setFloat = function (uniform, value) {
        if (!uniform) {
            return false;
        }
        this._gl.uniform1f(uniform, value);
        return true;
    };
    /**
     * Set the value of an uniform to a vec2
     * @param uniform defines the webGL uniform location where to store the value
     * @param x defines the 1st component of the value
     * @param y defines the 2nd component of the value
     * @returns true if the value was set
     */
    ThinEngine.prototype.setFloat2 = function (uniform, x, y) {
        if (!uniform) {
            return false;
        }
        this._gl.uniform2f(uniform, x, y);
        return true;
    };
    /**
     * Set the value of an uniform to a vec3
     * @param uniform defines the webGL uniform location where to store the value
     * @param x defines the 1st component of the value
     * @param y defines the 2nd component of the value
     * @param z defines the 3rd component of the value
     * @returns true if the value was set
     */
    ThinEngine.prototype.setFloat3 = function (uniform, x, y, z) {
        if (!uniform) {
            return false;
        }
        this._gl.uniform3f(uniform, x, y, z);
        return true;
    };
    /**
     * Set the value of an uniform to a vec4
     * @param uniform defines the webGL uniform location where to store the value
     * @param x defines the 1st component of the value
     * @param y defines the 2nd component of the value
     * @param z defines the 3rd component of the value
     * @param w defines the 4th component of the value
     * @returns true if the value was set
     */
    ThinEngine.prototype.setFloat4 = function (uniform, x, y, z, w) {
        if (!uniform) {
            return false;
        }
        this._gl.uniform4f(uniform, x, y, z, w);
        return true;
    };
    // States
    /**
     * Apply all cached states (depth, culling, stencil and alpha)
     */
    ThinEngine.prototype.applyStates = function () {
        this._depthCullingState.apply(this._gl);
        this._stencilState.apply(this._gl);
        this._alphaState.apply(this._gl);
        if (this._colorWriteChanged) {
            this._colorWriteChanged = false;
            var enable = this._colorWrite;
            this._gl.colorMask(enable, enable, enable, enable);
        }
    };
    /**
     * Enable or disable color writing
     * @param enable defines the state to set
     */
    ThinEngine.prototype.setColorWrite = function (enable) {
        if (enable !== this._colorWrite) {
            this._colorWriteChanged = true;
            this._colorWrite = enable;
        }
    };
    /**
     * Gets a boolean indicating if color writing is enabled
     * @returns the current color writing state
     */
    ThinEngine.prototype.getColorWrite = function () {
        return this._colorWrite;
    };
    Object.defineProperty(ThinEngine.prototype, "depthCullingState", {
        /**
         * Gets the depth culling state manager
         */
        get: function () {
            return this._depthCullingState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "alphaState", {
        /**
         * Gets the alpha state manager
         */
        get: function () {
            return this._alphaState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThinEngine.prototype, "stencilState", {
        /**
         * Gets the stencil state manager
         */
        get: function () {
            return this._stencilState;
        },
        enumerable: false,
        configurable: true
    });
    // Textures
    /**
     * Clears the list of texture accessible through engine.
     * This can help preventing texture load conflict due to name collision.
     */
    ThinEngine.prototype.clearInternalTexturesCache = function () {
        this._internalTexturesCache = [];
    };
    /**
     * Force the entire cache to be cleared
     * You should not have to use this function unless your engine needs to share the webGL context with another engine
     * @param bruteForce defines a boolean to force clearing ALL caches (including stencil, detoh and alpha states)
     */
    ThinEngine.prototype.wipeCaches = function (bruteForce) {
        if (this.preventCacheWipeBetweenFrames && !bruteForce) {
            return;
        }
        this._currentEffect = null;
        this._viewportCached.x = 0;
        this._viewportCached.y = 0;
        this._viewportCached.z = 0;
        this._viewportCached.w = 0;
        // Done before in case we clean the attributes
        this._unbindVertexArrayObject();
        if (bruteForce) {
            this._currentProgram = null;
            this.resetTextureCache();
            this._stencilState.reset();
            this._depthCullingState.reset();
            this._depthCullingState.depthFunc = this._gl.LEQUAL;
            this._alphaState.reset();
            this._alphaMode = 1;
            this._alphaEquation = 0;
            this._colorWrite = true;
            this._colorWriteChanged = true;
            this._unpackFlipYCached = null;
            this._gl.pixelStorei(this._gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, this._gl.NONE);
            this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
            this._mustWipeVertexAttributes = true;
            this.unbindAllAttributes();
        }
        this._resetVertexBufferBinding();
        this._cachedIndexBuffer = null;
        this._cachedEffectForVertexBuffers = null;
        this.bindIndexBuffer(null);
    };
    /** @hidden */
    ThinEngine.prototype._getSamplingParameters = function (samplingMode, generateMipMaps) {
        var gl = this._gl;
        var magFilter = gl.NEAREST;
        var minFilter = gl.NEAREST;
        switch (samplingMode) {
            case 11:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_NEAREST;
                }
                else {
                    minFilter = gl.LINEAR;
                }
                break;
            case 3:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_LINEAR;
                }
                else {
                    minFilter = gl.LINEAR;
                }
                break;
            case 8:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_LINEAR;
                }
                else {
                    minFilter = gl.NEAREST;
                }
                break;
            case 4:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_NEAREST;
                }
                else {
                    minFilter = gl.NEAREST;
                }
                break;
            case 5:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_NEAREST;
                }
                else {
                    minFilter = gl.LINEAR;
                }
                break;
            case 6:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_LINEAR;
                }
                else {
                    minFilter = gl.LINEAR;
                }
                break;
            case 7:
                magFilter = gl.NEAREST;
                minFilter = gl.LINEAR;
                break;
            case 1:
                magFilter = gl.NEAREST;
                minFilter = gl.NEAREST;
                break;
            case 9:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_NEAREST;
                }
                else {
                    minFilter = gl.NEAREST;
                }
                break;
            case 10:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_LINEAR;
                }
                else {
                    minFilter = gl.NEAREST;
                }
                break;
            case 2:
                magFilter = gl.LINEAR;
                minFilter = gl.LINEAR;
                break;
            case 12:
                magFilter = gl.LINEAR;
                minFilter = gl.NEAREST;
                break;
        }
        return {
            min: minFilter,
            mag: magFilter
        };
    };
    /** @hidden */
    ThinEngine.prototype._createTexture = function () {
        var texture = this._gl.createTexture();
        if (!texture) {
            throw new Error("Unable to create texture");
        }
        return texture;
    };
    /**
     * Usually called from Texture.ts.
     * Passed information to create a WebGLTexture
     * @param url defines a value which contains one of the following:
     * * A conventional http URL, e.g. 'http://...' or 'file://...'
     * * A base64 string of in-line texture data, e.g. 'data:image/jpg;base64,/...'
     * * An indicator that data being passed using the buffer parameter, e.g. 'data:mytexture.jpg'
     * @param noMipmap defines a boolean indicating that no mipmaps shall be generated.  Ignored for compressed textures.  They must be in the file
     * @param invertY when true, image is flipped when loaded.  You probably want true. Certain compressed textures may invert this if their default is inverted (eg. ktx)
     * @param scene needed for loading to the correct scene
     * @param samplingMode mode with should be used sample / access the texture (Default: Texture.TRILINEAR_SAMPLINGMODE)
     * @param onLoad optional callback to be called upon successful completion
     * @param onError optional callback to be called upon failure
     * @param buffer a source of a file previously fetched as either a base64 string, an ArrayBuffer (compressed or image format), HTMLImageElement (image format), or a Blob
     * @param fallback an internal argument in case the function must be called again, due to etc1 not having alpha capabilities
     * @param format internal format.  Default: RGB when extension is '.jpg' else RGBA.  Ignored for compressed textures
     * @param forcedExtension defines the extension to use to pick the right loader
     * @param mimeType defines an optional mime type
     * @param loaderOptions options to be passed to the loader
     * @returns a InternalTexture for assignment back into BABYLON.Texture
     */
    ThinEngine.prototype.createTexture = function (url, noMipmap, invertY, scene, samplingMode, onLoad, onError, buffer, fallback, format, forcedExtension, mimeType, loaderOptions) {
        var _this = this;
        if (samplingMode === void 0) { samplingMode = 3; }
        if (onLoad === void 0) { onLoad = null; }
        if (onError === void 0) { onError = null; }
        if (buffer === void 0) { buffer = null; }
        if (fallback === void 0) { fallback = null; }
        if (format === void 0) { format = null; }
        if (forcedExtension === void 0) { forcedExtension = null; }
        url = url || "";
        var fromData = url.substr(0, 5) === "data:";
        var fromBlob = url.substr(0, 5) === "blob:";
        var isBase64 = fromData && url.indexOf(";base64,") !== -1;
        var texture = fallback ? fallback : new InternalTexture(this, InternalTextureSource.Url);
        var originalUrl = url;
        if (this._transformTextureUrl && !isBase64 && !fallback && !buffer) {
            url = this._transformTextureUrl(url);
        }
        if (originalUrl !== url) {
            texture._originalUrl = originalUrl;
        }
        // establish the file extension, if possible
        var lastDot = url.lastIndexOf('.');
        var extension = forcedExtension ? forcedExtension : (lastDot > -1 ? url.substring(lastDot).toLowerCase() : "");
        var loader = null;
        // Remove query string
        var queryStringIndex = extension.indexOf("?");
        if (queryStringIndex > -1) {
            extension = extension.split("?")[0];
        }
        for (var _i = 0, _a = ThinEngine._TextureLoaders; _i < _a.length; _i++) {
            var availableLoader = _a[_i];
            if (availableLoader.canLoad(extension, mimeType)) {
                loader = availableLoader;
                break;
            }
        }
        if (scene) {
            scene._addPendingData(texture);
        }
        texture.url = url;
        texture.generateMipMaps = !noMipmap;
        texture.samplingMode = samplingMode;
        texture.invertY = invertY;
        if (!this._doNotHandleContextLost) {
            // Keep a link to the buffer only if we plan to handle context lost
            texture._buffer = buffer;
        }
        var onLoadObserver = null;
        if (onLoad && !fallback) {
            onLoadObserver = texture.onLoadedObservable.add(onLoad);
        }
        if (!fallback) {
            this._internalTexturesCache.push(texture);
        }
        var onInternalError = function (message, exception) {
            if (scene) {
                scene._removePendingData(texture);
            }
            if (url === originalUrl) {
                if (onLoadObserver) {
                    texture.onLoadedObservable.remove(onLoadObserver);
                }
                if (EngineStore.UseFallbackTexture) {
                    _this.createTexture(EngineStore.FallbackTexture, noMipmap, texture.invertY, scene, samplingMode, null, onError, buffer, texture);
                }
                if (onError) {
                    onError((message || "Unknown error") + (EngineStore.UseFallbackTexture ? " - Fallback texture was used" : ""), exception);
                }
            }
            else {
                // fall back to the original url if the transformed url fails to load
                Logger.Warn("Failed to load " + url + ", falling back to " + originalUrl);
                _this.createTexture(originalUrl, noMipmap, texture.invertY, scene, samplingMode, onLoad, onError, buffer, texture, format, forcedExtension, mimeType, loaderOptions);
            }
        };
        // processing for non-image formats
        if (loader) {
            var callback_1 = function (data) {
                loader.loadData(data, texture, function (width, height, loadMipmap, isCompressed, done, loadFailed) {
                    if (loadFailed) {
                        onInternalError("TextureLoader failed to load data");
                    }
                    else {
                        _this._prepareWebGLTexture(texture, scene, width, height, texture.invertY, !loadMipmap, isCompressed, function () {
                            done();
                            return false;
                        }, samplingMode);
                    }
                }, loaderOptions);
            };
            if (!buffer) {
                this._loadFile(url, function (data) { return callback_1(new Uint8Array(data)); }, undefined, scene ? scene.offlineProvider : undefined, true, function (request, exception) {
                    onInternalError("Unable to load " + (request ? request.responseURL : url, exception));
                });
            }
            else {
                if (buffer instanceof ArrayBuffer) {
                    callback_1(new Uint8Array(buffer));
                }
                else if (ArrayBuffer.isView(buffer)) {
                    callback_1(buffer);
                }
                else {
                    if (onError) {
                        onError("Unable to load: only ArrayBuffer or ArrayBufferView is supported", null);
                    }
                }
            }
        }
        else {
            var onload_1 = function (img) {
                if (fromBlob && !_this._doNotHandleContextLost) {
                    // We need to store the image if we need to rebuild the texture
                    // in case of a webgl context lost
                    texture._buffer = img;
                }
                _this._prepareWebGLTexture(texture, scene, img.width, img.height, texture.invertY, noMipmap, false, function (potWidth, potHeight, continuationCallback) {
                    var gl = _this._gl;
                    var isPot = (img.width === potWidth && img.height === potHeight);
                    var internalFormat = format ? _this._getInternalFormat(format) : ((extension === ".jpg") ? gl.RGB : gl.RGBA);
                    if (isPot) {
                        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, img);
                        return false;
                    }
                    var maxTextureSize = _this._caps.maxTextureSize;
                    if (img.width > maxTextureSize || img.height > maxTextureSize || !_this._supportsHardwareTextureRescaling) {
                        _this._prepareWorkingCanvas();
                        if (!_this._workingCanvas || !_this._workingContext) {
                            return false;
                        }
                        _this._workingCanvas.width = potWidth;
                        _this._workingCanvas.height = potHeight;
                        _this._workingContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, potWidth, potHeight);
                        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, _this._workingCanvas);
                        texture.width = potWidth;
                        texture.height = potHeight;
                        return false;
                    }
                    else {
                        // Using shaders when possible to rescale because canvas.drawImage is lossy
                        var source_1 = new InternalTexture(_this, InternalTextureSource.Temp);
                        _this._bindTextureDirectly(gl.TEXTURE_2D, source_1, true);
                        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, img);
                        _this._rescaleTexture(source_1, texture, scene, internalFormat, function () {
                            _this._releaseTexture(source_1);
                            _this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
                            continuationCallback();
                        });
                    }
                    return true;
                }, samplingMode);
            };
            if (!fromData || isBase64) {
                if (buffer && (buffer.decoding || buffer.close)) {
                    onload_1(buffer);
                }
                else {
                    ThinEngine._FileToolsLoadImage(url, onload_1, onInternalError, scene ? scene.offlineProvider : null, mimeType);
                }
            }
            else if (typeof buffer === "string" || buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer) || buffer instanceof Blob) {
                ThinEngine._FileToolsLoadImage(buffer, onload_1, onInternalError, scene ? scene.offlineProvider : null, mimeType);
            }
            else if (buffer) {
                onload_1(buffer);
            }
        }
        return texture;
    };
    /**
     * Loads an image as an HTMLImageElement.
     * @param input url string, ArrayBuffer, or Blob to load
     * @param onLoad callback called when the image successfully loads
     * @param onError callback called when the image fails to load
     * @param offlineProvider offline provider for caching
     * @param mimeType optional mime type
     * @returns the HTMLImageElement of the loaded image
     * @hidden
     */
    ThinEngine._FileToolsLoadImage = function (input, onLoad, onError, offlineProvider, mimeType) {
        throw _DevTools.WarnImport("FileTools");
    };
    /**
     * @hidden
     */
    ThinEngine.prototype._rescaleTexture = function (source, destination, scene, internalFormat, onComplete) {
    };
    /**
     * Creates a raw texture
     * @param data defines the data to store in the texture
     * @param width defines the width of the texture
     * @param height defines the height of the texture
     * @param format defines the format of the data
     * @param generateMipMaps defines if the engine should generate the mip levels
     * @param invertY defines if data must be stored with Y axis inverted
     * @param samplingMode defines the required sampling mode (Texture.NEAREST_SAMPLINGMODE by default)
     * @param compression defines the compression used (null by default)
     * @param type defines the type fo the data (Engine.TEXTURETYPE_UNSIGNED_INT by default)
     * @returns the raw texture inside an InternalTexture
     */
    ThinEngine.prototype.createRawTexture = function (data, width, height, format, generateMipMaps, invertY, samplingMode, compression, type) {
        throw _DevTools.WarnImport("Engine.RawTexture");
    };
    /**
     * Creates a new raw cube texture
     * @param data defines the array of data to use to create each face
     * @param size defines the size of the textures
     * @param format defines the format of the data
     * @param type defines the type of the data (like Engine.TEXTURETYPE_UNSIGNED_INT)
     * @param generateMipMaps  defines if the engine should generate the mip levels
     * @param invertY defines if data must be stored with Y axis inverted
     * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
     * @param compression defines the compression used (null by default)
     * @returns the cube texture as an InternalTexture
     */
    ThinEngine.prototype.createRawCubeTexture = function (data, size, format, type, generateMipMaps, invertY, samplingMode, compression) {
        throw _DevTools.WarnImport("Engine.RawTexture");
    };
    /**
     * Creates a new raw 3D texture
     * @param data defines the data used to create the texture
     * @param width defines the width of the texture
     * @param height defines the height of the texture
     * @param depth defines the depth of the texture
     * @param format defines the format of the texture
     * @param generateMipMaps defines if the engine must generate mip levels
     * @param invertY defines if data must be stored with Y axis inverted
     * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
     * @param compression defines the compressed used (can be null)
     * @param textureType defines the compressed used (can be null)
     * @returns a new raw 3D texture (stored in an InternalTexture)
     */
    ThinEngine.prototype.createRawTexture3D = function (data, width, height, depth, format, generateMipMaps, invertY, samplingMode, compression, textureType) {
        throw _DevTools.WarnImport("Engine.RawTexture");
    };
    /**
     * Creates a new raw 2D array texture
     * @param data defines the data used to create the texture
     * @param width defines the width of the texture
     * @param height defines the height of the texture
     * @param depth defines the number of layers of the texture
     * @param format defines the format of the texture
     * @param generateMipMaps defines if the engine must generate mip levels
     * @param invertY defines if data must be stored with Y axis inverted
     * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
     * @param compression defines the compressed used (can be null)
     * @param textureType defines the compressed used (can be null)
     * @returns a new raw 2D array texture (stored in an InternalTexture)
     */
    ThinEngine.prototype.createRawTexture2DArray = function (data, width, height, depth, format, generateMipMaps, invertY, samplingMode, compression, textureType) {
        throw _DevTools.WarnImport("Engine.RawTexture");
    };
    /** @hidden */
    ThinEngine.prototype._unpackFlipY = function (value) {
        if (this._unpackFlipYCached !== value) {
            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, value ? 1 : 0);
            if (this.enableUnpackFlipYCached) {
                this._unpackFlipYCached = value;
            }
        }
    };
    /** @hidden */
    ThinEngine.prototype._getUnpackAlignement = function () {
        return this._gl.getParameter(this._gl.UNPACK_ALIGNMENT);
    };
    ThinEngine.prototype._getTextureTarget = function (texture) {
        if (texture.isCube) {
            return this._gl.TEXTURE_CUBE_MAP;
        }
        else if (texture.is3D) {
            return this._gl.TEXTURE_3D;
        }
        else if (texture.is2DArray || texture.isMultiview) {
            return this._gl.TEXTURE_2D_ARRAY;
        }
        return this._gl.TEXTURE_2D;
    };
    /**
     * Update the sampling mode of a given texture
     * @param samplingMode defines the required sampling mode
     * @param texture defines the texture to update
     * @param generateMipMaps defines whether to generate mipmaps for the texture
     */
    ThinEngine.prototype.updateTextureSamplingMode = function (samplingMode, texture, generateMipMaps) {
        if (generateMipMaps === void 0) { generateMipMaps = false; }
        var target = this._getTextureTarget(texture);
        var filters = this._getSamplingParameters(samplingMode, texture.generateMipMaps || generateMipMaps);
        this._setTextureParameterInteger(target, this._gl.TEXTURE_MAG_FILTER, filters.mag, texture);
        this._setTextureParameterInteger(target, this._gl.TEXTURE_MIN_FILTER, filters.min);
        if (generateMipMaps) {
            texture.generateMipMaps = true;
            this._gl.generateMipmap(target);
        }
        this._bindTextureDirectly(target, null);
        texture.samplingMode = samplingMode;
    };
    /**
     * Update the sampling mode of a given texture
     * @param texture defines the texture to update
     * @param wrapU defines the texture wrap mode of the u coordinates
     * @param wrapV defines the texture wrap mode of the v coordinates
     * @param wrapR defines the texture wrap mode of the r coordinates
     */
    ThinEngine.prototype.updateTextureWrappingMode = function (texture, wrapU, wrapV, wrapR) {
        if (wrapV === void 0) { wrapV = null; }
        if (wrapR === void 0) { wrapR = null; }
        var target = this._getTextureTarget(texture);
        if (wrapU !== null) {
            this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_S, this._getTextureWrapMode(wrapU), texture);
            texture._cachedWrapU = wrapU;
        }
        if (wrapV !== null) {
            this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_T, this._getTextureWrapMode(wrapV), texture);
            texture._cachedWrapV = wrapV;
        }
        if ((texture.is2DArray || texture.is3D) && (wrapR !== null)) {
            this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_R, this._getTextureWrapMode(wrapR), texture);
            texture._cachedWrapR = wrapR;
        }
        this._bindTextureDirectly(target, null);
    };
    /** @hidden */
    ThinEngine.prototype._setupDepthStencilTexture = function (internalTexture, size, generateStencil, bilinearFiltering, comparisonFunction) {
        var width = size.width || size;
        var height = size.height || size;
        var layers = size.layers || 0;
        internalTexture.baseWidth = width;
        internalTexture.baseHeight = height;
        internalTexture.width = width;
        internalTexture.height = height;
        internalTexture.is2DArray = layers > 0;
        internalTexture.depth = layers;
        internalTexture.isReady = true;
        internalTexture.samples = 1;
        internalTexture.generateMipMaps = false;
        internalTexture._generateDepthBuffer = true;
        internalTexture._generateStencilBuffer = generateStencil;
        internalTexture.samplingMode = bilinearFiltering ? 2 : 1;
        internalTexture.type = 0;
        internalTexture._comparisonFunction = comparisonFunction;
        var gl = this._gl;
        var target = this._getTextureTarget(internalTexture);
        var samplingParameters = this._getSamplingParameters(internalTexture.samplingMode, false);
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, samplingParameters.mag);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, samplingParameters.min);
        gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (comparisonFunction === 0) {
            gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, 515);
            gl.texParameteri(target, gl.TEXTURE_COMPARE_MODE, gl.NONE);
        }
        else {
            gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, comparisonFunction);
            gl.texParameteri(target, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
        }
    };
    /** @hidden */
    ThinEngine.prototype._uploadCompressedDataToTextureDirectly = function (texture, internalFormat, width, height, data, faceIndex, lod) {
        if (faceIndex === void 0) { faceIndex = 0; }
        if (lod === void 0) { lod = 0; }
        var gl = this._gl;
        var target = gl.TEXTURE_2D;
        if (texture.isCube) {
            target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex;
        }
        this._gl.compressedTexImage2D(target, lod, internalFormat, width, height, 0, data);
    };
    /** @hidden */
    ThinEngine.prototype._uploadDataToTextureDirectly = function (texture, imageData, faceIndex, lod, babylonInternalFormat, useTextureWidthAndHeight) {
        if (faceIndex === void 0) { faceIndex = 0; }
        if (lod === void 0) { lod = 0; }
        if (useTextureWidthAndHeight === void 0) { useTextureWidthAndHeight = false; }
        var gl = this._gl;
        var textureType = this._getWebGLTextureType(texture.type);
        var format = this._getInternalFormat(texture.format);
        var internalFormat = babylonInternalFormat === undefined ? this._getRGBABufferInternalSizedFormat(texture.type, texture.format) : this._getInternalFormat(babylonInternalFormat);
        this._unpackFlipY(texture.invertY);
        var target = gl.TEXTURE_2D;
        if (texture.isCube) {
            target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex;
        }
        var lodMaxWidth = Math.round(Math.log(texture.width) * Math.LOG2E);
        var lodMaxHeight = Math.round(Math.log(texture.height) * Math.LOG2E);
        var width = useTextureWidthAndHeight ? texture.width : Math.pow(2, Math.max(lodMaxWidth - lod, 0));
        var height = useTextureWidthAndHeight ? texture.height : Math.pow(2, Math.max(lodMaxHeight - lod, 0));
        gl.texImage2D(target, lod, internalFormat, width, height, 0, format, textureType, imageData);
    };
    /**
     * Update a portion of an internal texture
     * @param texture defines the texture to update
     * @param imageData defines the data to store into the texture
     * @param xOffset defines the x coordinates of the update rectangle
     * @param yOffset defines the y coordinates of the update rectangle
     * @param width defines the width of the update rectangle
     * @param height defines the height of the update rectangle
     * @param faceIndex defines the face index if texture is a cube (0 by default)
     * @param lod defines the lod level to update (0 by default)
     */
    ThinEngine.prototype.updateTextureData = function (texture, imageData, xOffset, yOffset, width, height, faceIndex, lod) {
        if (faceIndex === void 0) { faceIndex = 0; }
        if (lod === void 0) { lod = 0; }
        var gl = this._gl;
        var textureType = this._getWebGLTextureType(texture.type);
        var format = this._getInternalFormat(texture.format);
        this._unpackFlipY(texture.invertY);
        var target = gl.TEXTURE_2D;
        if (texture.isCube) {
            target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex;
        }
        gl.texSubImage2D(target, lod, xOffset, yOffset, width, height, format, textureType, imageData);
    };
    /** @hidden */
    ThinEngine.prototype._uploadArrayBufferViewToTexture = function (texture, imageData, faceIndex, lod) {
        if (faceIndex === void 0) { faceIndex = 0; }
        if (lod === void 0) { lod = 0; }
        var gl = this._gl;
        var bindTarget = texture.isCube ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D;
        this._bindTextureDirectly(bindTarget, texture, true);
        this._uploadDataToTextureDirectly(texture, imageData, faceIndex, lod);
        this._bindTextureDirectly(bindTarget, null, true);
    };
    ThinEngine.prototype._prepareWebGLTextureContinuation = function (texture, scene, noMipmap, isCompressed, samplingMode) {
        var gl = this._gl;
        if (!gl) {
            return;
        }
        var filters = this._getSamplingParameters(samplingMode, !noMipmap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filters.mag);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filters.min);
        if (!noMipmap && !isCompressed) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        this._bindTextureDirectly(gl.TEXTURE_2D, null);
        // this.resetTextureCache();
        if (scene) {
            scene._removePendingData(texture);
        }
        texture.onLoadedObservable.notifyObservers(texture);
        texture.onLoadedObservable.clear();
    };
    ThinEngine.prototype._prepareWebGLTexture = function (texture, scene, width, height, invertY, noMipmap, isCompressed, processFunction, samplingMode) {
        var _this = this;
        if (samplingMode === void 0) { samplingMode = 3; }
        var maxTextureSize = this.getCaps().maxTextureSize;
        var potWidth = Math.min(maxTextureSize, this.needPOTTextures ? ThinEngine.GetExponentOfTwo(width, maxTextureSize) : width);
        var potHeight = Math.min(maxTextureSize, this.needPOTTextures ? ThinEngine.GetExponentOfTwo(height, maxTextureSize) : height);
        var gl = this._gl;
        if (!gl) {
            return;
        }
        if (!texture._webGLTexture) {
            //  this.resetTextureCache();
            if (scene) {
                scene._removePendingData(texture);
            }
            return;
        }
        this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
        this._unpackFlipY(invertY === undefined ? true : (invertY ? true : false));
        texture.baseWidth = width;
        texture.baseHeight = height;
        texture.width = potWidth;
        texture.height = potHeight;
        texture.isReady = true;
        if (processFunction(potWidth, potHeight, function () {
            _this._prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode);
        })) {
            // Returning as texture needs extra async steps
            return;
        }
        this._prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode);
    };
    /** @hidden */
    ThinEngine.prototype._setupFramebufferDepthAttachments = function (generateStencilBuffer, generateDepthBuffer, width, height, samples) {
        if (samples === void 0) { samples = 1; }
        var gl = this._gl;
        // Create the depth/stencil buffer
        if (generateStencilBuffer && generateDepthBuffer) {
            return this._getDepthStencilBuffer(width, height, samples, gl.DEPTH_STENCIL, gl.DEPTH24_STENCIL8, gl.DEPTH_STENCIL_ATTACHMENT);
        }
        if (generateDepthBuffer) {
            var depthFormat = gl.DEPTH_COMPONENT16;
            if (this._webGLVersion > 1) {
                depthFormat = gl.DEPTH_COMPONENT32F;
            }
            return this._getDepthStencilBuffer(width, height, samples, depthFormat, depthFormat, gl.DEPTH_ATTACHMENT);
        }
        if (generateStencilBuffer) {
            return this._getDepthStencilBuffer(width, height, samples, gl.STENCIL_INDEX8, gl.STENCIL_INDEX8, gl.STENCIL_ATTACHMENT);
        }
        return null;
    };
    /** @hidden */
    ThinEngine.prototype._releaseFramebufferObjects = function (texture) {
        var gl = this._gl;
        if (texture._framebuffer) {
            gl.deleteFramebuffer(texture._framebuffer);
            texture._framebuffer = null;
        }
        if (texture._depthStencilBuffer) {
            gl.deleteRenderbuffer(texture._depthStencilBuffer);
            texture._depthStencilBuffer = null;
        }
        if (texture._MSAAFramebuffer) {
            gl.deleteFramebuffer(texture._MSAAFramebuffer);
            texture._MSAAFramebuffer = null;
        }
        if (texture._MSAARenderBuffer) {
            gl.deleteRenderbuffer(texture._MSAARenderBuffer);
            texture._MSAARenderBuffer = null;
        }
    };
    /** @hidden */
    ThinEngine.prototype._releaseTexture = function (texture) {
        this._releaseFramebufferObjects(texture);
        this._deleteTexture(texture._webGLTexture);
        // Unbind channels
        this.unbindAllTextures();
        var index = this._internalTexturesCache.indexOf(texture);
        if (index !== -1) {
            this._internalTexturesCache.splice(index, 1);
        }
        // Integrated fixed lod samplers.
        if (texture._lodTextureHigh) {
            texture._lodTextureHigh.dispose();
        }
        if (texture._lodTextureMid) {
            texture._lodTextureMid.dispose();
        }
        if (texture._lodTextureLow) {
            texture._lodTextureLow.dispose();
        }
        // Integrated irradiance map.
        if (texture._irradianceTexture) {
            texture._irradianceTexture.dispose();
        }
    };
    ThinEngine.prototype._deleteTexture = function (texture) {
        this._gl.deleteTexture(texture);
    };
    ThinEngine.prototype._setProgram = function (program) {
        if (this._currentProgram !== program) {
            this._gl.useProgram(program);
            this._currentProgram = program;
        }
    };
    /**
     * Binds an effect to the webGL context
     * @param effect defines the effect to bind
     */
    ThinEngine.prototype.bindSamplers = function (effect) {
        var webGLPipelineContext = effect.getPipelineContext();
        this._setProgram(webGLPipelineContext.program);
        var samplers = effect.getSamplers();
        for (var index = 0; index < samplers.length; index++) {
            var uniform = effect.getUniform(samplers[index]);
            if (uniform) {
                this._boundUniforms[index] = uniform;
            }
        }
        this._currentEffect = null;
    };
    ThinEngine.prototype._activateCurrentTexture = function () {
        if (this._currentTextureChannel !== this._activeChannel) {
            this._gl.activeTexture(this._gl.TEXTURE0 + this._activeChannel);
            this._currentTextureChannel = this._activeChannel;
        }
    };
    /** @hidden */
    ThinEngine.prototype._bindTextureDirectly = function (target, texture, forTextureDataUpdate, force) {
        if (forTextureDataUpdate === void 0) { forTextureDataUpdate = false; }
        if (force === void 0) { force = false; }
        var wasPreviouslyBound = false;
        var isTextureForRendering = texture && texture._associatedChannel > -1;
        if (forTextureDataUpdate && isTextureForRendering) {
            this._activeChannel = texture._associatedChannel;
        }
        var currentTextureBound = this._boundTexturesCache[this._activeChannel];
        if (currentTextureBound !== texture || force) {
            this._activateCurrentTexture();
            if (texture && texture.isMultiview) {
                this._gl.bindTexture(target, texture ? texture._colorTextureArray : null);
            }
            else {
                this._gl.bindTexture(target, texture ? texture._webGLTexture : null);
            }
            this._boundTexturesCache[this._activeChannel] = texture;
            if (texture) {
                texture._associatedChannel = this._activeChannel;
            }
        }
        else if (forTextureDataUpdate) {
            wasPreviouslyBound = true;
            this._activateCurrentTexture();
        }
        if (isTextureForRendering && !forTextureDataUpdate) {
            this._bindSamplerUniformToChannel(texture._associatedChannel, this._activeChannel);
        }
        return wasPreviouslyBound;
    };
    /** @hidden */
    ThinEngine.prototype._bindTexture = function (channel, texture) {
        if (channel === undefined) {
            return;
        }
        if (texture) {
            texture._associatedChannel = channel;
        }
        this._activeChannel = channel;
        var target = texture ? this._getTextureTarget(texture) : this._gl.TEXTURE_2D;
        this._bindTextureDirectly(target, texture);
    };
    /**
     * Unbind all textures from the webGL context
     */
    ThinEngine.prototype.unbindAllTextures = function () {
        for (var channel = 0; channel < this._maxSimultaneousTextures; channel++) {
            this._activeChannel = channel;
            this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
            this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
            if (this.webGLVersion > 1) {
                this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
                this._bindTextureDirectly(this._gl.TEXTURE_2D_ARRAY, null);
            }
        }
    };
    /**
     * Sets a texture to the according uniform.
     * @param channel The texture channel
     * @param uniform The uniform to set
     * @param texture The texture to apply
     */
    ThinEngine.prototype.setTexture = function (channel, uniform, texture) {
        if (channel === undefined) {
            return;
        }
        if (uniform) {
            this._boundUniforms[channel] = uniform;
        }
        this._setTexture(channel, texture);
    };
    ThinEngine.prototype._bindSamplerUniformToChannel = function (sourceSlot, destination) {
        var uniform = this._boundUniforms[sourceSlot];
        if (!uniform || uniform._currentState === destination) {
            return;
        }
        this._gl.uniform1i(uniform, destination);
        uniform._currentState = destination;
    };
    ThinEngine.prototype._getTextureWrapMode = function (mode) {
        switch (mode) {
            case 1:
                return this._gl.REPEAT;
            case 0:
                return this._gl.CLAMP_TO_EDGE;
            case 2:
                return this._gl.MIRRORED_REPEAT;
        }
        return this._gl.REPEAT;
    };
    ThinEngine.prototype._setTexture = function (channel, texture, isPartOfTextureArray, depthStencilTexture) {
        if (isPartOfTextureArray === void 0) { isPartOfTextureArray = false; }
        if (depthStencilTexture === void 0) { depthStencilTexture = false; }
        // Not ready?
        if (!texture) {
            if (this._boundTexturesCache[channel] != null) {
                this._activeChannel = channel;
                this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
                this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
                if (this.webGLVersion > 1) {
                    this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
                    this._bindTextureDirectly(this._gl.TEXTURE_2D_ARRAY, null);
                }
            }
            return false;
        }
        // Video
        if (texture.video) {
            this._activeChannel = channel;
            texture.update();
        }
        else if (texture.delayLoadState === 4) { // Delay loading
            texture.delayLoad();
            return false;
        }
        var internalTexture;
        if (depthStencilTexture) {
            internalTexture = texture.depthStencilTexture;
        }
        else if (texture.isReady()) {
            internalTexture = texture.getInternalTexture();
        }
        else if (texture.isCube) {
            internalTexture = this.emptyCubeTexture;
        }
        else if (texture.is3D) {
            internalTexture = this.emptyTexture3D;
        }
        else if (texture.is2DArray) {
            internalTexture = this.emptyTexture2DArray;
        }
        else {
            internalTexture = this.emptyTexture;
        }
        if (!isPartOfTextureArray && internalTexture) {
            internalTexture._associatedChannel = channel;
        }
        var needToBind = true;
        if (this._boundTexturesCache[channel] === internalTexture) {
            if (!isPartOfTextureArray) {
                this._bindSamplerUniformToChannel(internalTexture._associatedChannel, channel);
            }
            needToBind = false;
        }
        this._activeChannel = channel;
        var target = this._getTextureTarget(internalTexture);
        if (needToBind) {
            this._bindTextureDirectly(target, internalTexture, isPartOfTextureArray);
        }
        if (internalTexture && !internalTexture.isMultiview) {
            // CUBIC_MODE and SKYBOX_MODE both require CLAMP_TO_EDGE.  All other modes use REPEAT.
            if (internalTexture.isCube && internalTexture._cachedCoordinatesMode !== texture.coordinatesMode) {
                internalTexture._cachedCoordinatesMode = texture.coordinatesMode;
                var textureWrapMode = (texture.coordinatesMode !== 3 && texture.coordinatesMode !== 5) ? 1 : 0;
                texture.wrapU = textureWrapMode;
                texture.wrapV = textureWrapMode;
            }
            if (internalTexture._cachedWrapU !== texture.wrapU) {
                internalTexture._cachedWrapU = texture.wrapU;
                this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_S, this._getTextureWrapMode(texture.wrapU), internalTexture);
            }
            if (internalTexture._cachedWrapV !== texture.wrapV) {
                internalTexture._cachedWrapV = texture.wrapV;
                this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_T, this._getTextureWrapMode(texture.wrapV), internalTexture);
            }
            if (internalTexture.is3D && internalTexture._cachedWrapR !== texture.wrapR) {
                internalTexture._cachedWrapR = texture.wrapR;
                this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_R, this._getTextureWrapMode(texture.wrapR), internalTexture);
            }
            this._setAnisotropicLevel(target, internalTexture, texture.anisotropicFilteringLevel);
        }
        return true;
    };
    /**
     * Sets an array of texture to the webGL context
     * @param channel defines the channel where the texture array must be set
     * @param uniform defines the associated uniform location
     * @param textures defines the array of textures to bind
     */
    ThinEngine.prototype.setTextureArray = function (channel, uniform, textures) {
        if (channel === undefined || !uniform) {
            return;
        }
        if (!this._textureUnits || this._textureUnits.length !== textures.length) {
            this._textureUnits = new Int32Array(textures.length);
        }
        for (var i = 0; i < textures.length; i++) {
            var texture = textures[i].getInternalTexture();
            if (texture) {
                this._textureUnits[i] = channel + i;
                texture._associatedChannel = channel + i;
            }
            else {
                this._textureUnits[i] = -1;
            }
        }
        this._gl.uniform1iv(uniform, this._textureUnits);
        for (var index = 0; index < textures.length; index++) {
            this._setTexture(this._textureUnits[index], textures[index], true);
        }
    };
    /** @hidden */
    ThinEngine.prototype._setAnisotropicLevel = function (target, internalTexture, anisotropicFilteringLevel) {
        var anisotropicFilterExtension = this._caps.textureAnisotropicFilterExtension;
        if (internalTexture.samplingMode !== 11
            && internalTexture.samplingMode !== 3
            && internalTexture.samplingMode !== 2) {
            anisotropicFilteringLevel = 1; // Forcing the anisotropic to 1 because else webgl will force filters to linear
        }
        if (anisotropicFilterExtension && internalTexture._cachedAnisotropicFilteringLevel !== anisotropicFilteringLevel) {
            this._setTextureParameterFloat(target, anisotropicFilterExtension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(anisotropicFilteringLevel, this._caps.maxAnisotropy), internalTexture);
            internalTexture._cachedAnisotropicFilteringLevel = anisotropicFilteringLevel;
        }
    };
    ThinEngine.prototype._setTextureParameterFloat = function (target, parameter, value, texture) {
        this._bindTextureDirectly(target, texture, true, true);
        this._gl.texParameterf(target, parameter, value);
    };
    ThinEngine.prototype._setTextureParameterInteger = function (target, parameter, value, texture) {
        if (texture) {
            this._bindTextureDirectly(target, texture, true, true);
        }
        this._gl.texParameteri(target, parameter, value);
    };
    /**
     * Unbind all vertex attributes from the webGL context
     */
    ThinEngine.prototype.unbindAllAttributes = function () {
        if (this._mustWipeVertexAttributes) {
            this._mustWipeVertexAttributes = false;
            for (var i = 0; i < this._caps.maxVertexAttribs; i++) {
                this.disableAttributeByIndex(i);
            }
            return;
        }
        for (var i = 0, ul = this._vertexAttribArraysEnabled.length; i < ul; i++) {
            if (i >= this._caps.maxVertexAttribs || !this._vertexAttribArraysEnabled[i]) {
                continue;
            }
            this.disableAttributeByIndex(i);
        }
    };
    /**
     * Force the engine to release all cached effects. This means that next effect compilation will have to be done completely even if a similar effect was already compiled
     */
    ThinEngine.prototype.releaseEffects = function () {
        for (var name in this._compiledEffects) {
            var webGLPipelineContext = this._compiledEffects[name].getPipelineContext();
            this._deletePipelineContext(webGLPipelineContext);
        }
        this._compiledEffects = {};
    };
    /**
     * Dispose and release all associated resources
     */
    ThinEngine.prototype.dispose = function () {
        this.stopRenderLoop();
        // Clear observables
        if (this.onBeforeTextureInitObservable) {
            this.onBeforeTextureInitObservable.clear();
        }
        // Empty texture
        if (this._emptyTexture) {
            this._releaseTexture(this._emptyTexture);
            this._emptyTexture = null;
        }
        if (this._emptyCubeTexture) {
            this._releaseTexture(this._emptyCubeTexture);
            this._emptyCubeTexture = null;
        }
        if (this._dummyFramebuffer) {
            this._gl.deleteFramebuffer(this._dummyFramebuffer);
        }
        // Release effects
        this.releaseEffects();
        // Unbind
        this.unbindAllAttributes();
        this._boundUniforms = [];
        // Events
        if (DomManagement.IsWindowObjectExist()) {
            if (this._renderingCanvas) {
                if (!this._doNotHandleContextLost) {
                    this._renderingCanvas.removeEventListener("webglcontextlost", this._onContextLost);
                    this._renderingCanvas.removeEventListener("webglcontextrestored", this._onContextRestored);
                }
            }
        }
        this._workingCanvas = null;
        this._workingContext = null;
        this._currentBufferPointers = [];
        this._renderingCanvas = null;
        this._currentProgram = null;
        this._boundRenderFunction = null;
        Effect.ResetCache();
        // Abort active requests
        for (var _i = 0, _a = this._activeRequests; _i < _a.length; _i++) {
            var request = _a[_i];
            request.abort();
        }
    };
    /**
     * Attach a new callback raised when context lost event is fired
     * @param callback defines the callback to call
     */
    ThinEngine.prototype.attachContextLostEvent = function (callback) {
        if (this._renderingCanvas) {
            this._renderingCanvas.addEventListener("webglcontextlost", callback, false);
        }
    };
    /**
     * Attach a new callback raised when context restored event is fired
     * @param callback defines the callback to call
     */
    ThinEngine.prototype.attachContextRestoredEvent = function (callback) {
        if (this._renderingCanvas) {
            this._renderingCanvas.addEventListener("webglcontextrestored", callback, false);
        }
    };
    /**
     * Get the current error code of the webGL context
     * @returns the error code
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError
     */
    ThinEngine.prototype.getError = function () {
        return this._gl.getError();
    };
    ThinEngine.prototype._canRenderToFloatFramebuffer = function () {
        if (this._webGLVersion > 1) {
            return this._caps.colorBufferFloat;
        }
        return this._canRenderToFramebuffer(1);
    };
    ThinEngine.prototype._canRenderToHalfFloatFramebuffer = function () {
        if (this._webGLVersion > 1) {
            return this._caps.colorBufferFloat;
        }
        return this._canRenderToFramebuffer(2);
    };
    // Thank you : http://stackoverflow.com/questions/28827511/webgl-ios-render-to-floating-point-texture
    ThinEngine.prototype._canRenderToFramebuffer = function (type) {
        var gl = this._gl;
        //clear existing errors
        while (gl.getError() !== gl.NO_ERROR) { }
        var successful = true;
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, this._getRGBABufferInternalSizedFormat(type), 1, 1, 0, gl.RGBA, this._getWebGLTextureType(type), null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        var fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        successful = successful && (status === gl.FRAMEBUFFER_COMPLETE);
        successful = successful && (gl.getError() === gl.NO_ERROR);
        //try render by clearing frame buffer's color buffer
        if (successful) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            successful = successful && (gl.getError() === gl.NO_ERROR);
        }
        //try reading from frame to ensure render occurs (just creating the FBO is not sufficient to determine if rendering is supported)
        if (successful) {
            //in practice it's sufficient to just read from the backbuffer rather than handle potentially issues reading from the texture
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            var readFormat = gl.RGBA;
            var readType = gl.UNSIGNED_BYTE;
            var buffer = new Uint8Array(4);
            gl.readPixels(0, 0, 1, 1, readFormat, readType, buffer);
            successful = successful && (gl.getError() === gl.NO_ERROR);
        }
        //clean up
        gl.deleteTexture(texture);
        gl.deleteFramebuffer(fb);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        //clear accumulated errors
        while (!successful && (gl.getError() !== gl.NO_ERROR)) { }
        return successful;
    };
    /** @hidden */
    ThinEngine.prototype._getWebGLTextureType = function (type) {
        if (this._webGLVersion === 1) {
            switch (type) {
                case 1:
                    return this._gl.FLOAT;
                case 2:
                    return this._gl.HALF_FLOAT_OES;
                case 0:
                    return this._gl.UNSIGNED_BYTE;
                case 8:
                    return this._gl.UNSIGNED_SHORT_4_4_4_4;
                case 9:
                    return this._gl.UNSIGNED_SHORT_5_5_5_1;
                case 10:
                    return this._gl.UNSIGNED_SHORT_5_6_5;
            }
            return this._gl.UNSIGNED_BYTE;
        }
        switch (type) {
            case 3:
                return this._gl.BYTE;
            case 0:
                return this._gl.UNSIGNED_BYTE;
            case 4:
                return this._gl.SHORT;
            case 5:
                return this._gl.UNSIGNED_SHORT;
            case 6:
                return this._gl.INT;
            case 7: // Refers to UNSIGNED_INT
                return this._gl.UNSIGNED_INT;
            case 1:
                return this._gl.FLOAT;
            case 2:
                return this._gl.HALF_FLOAT;
            case 8:
                return this._gl.UNSIGNED_SHORT_4_4_4_4;
            case 9:
                return this._gl.UNSIGNED_SHORT_5_5_5_1;
            case 10:
                return this._gl.UNSIGNED_SHORT_5_6_5;
            case 11:
                return this._gl.UNSIGNED_INT_2_10_10_10_REV;
            case 12:
                return this._gl.UNSIGNED_INT_24_8;
            case 13:
                return this._gl.UNSIGNED_INT_10F_11F_11F_REV;
            case 14:
                return this._gl.UNSIGNED_INT_5_9_9_9_REV;
            case 15:
                return this._gl.FLOAT_32_UNSIGNED_INT_24_8_REV;
        }
        return this._gl.UNSIGNED_BYTE;
    };
    /** @hidden */
    ThinEngine.prototype._getInternalFormat = function (format) {
        var internalFormat = this._gl.RGBA;
        switch (format) {
            case 0:
                internalFormat = this._gl.ALPHA;
                break;
            case 1:
                internalFormat = this._gl.LUMINANCE;
                break;
            case 2:
                internalFormat = this._gl.LUMINANCE_ALPHA;
                break;
            case 6:
                internalFormat = this._gl.RED;
                break;
            case 7:
                internalFormat = this._gl.RG;
                break;
            case 4:
                internalFormat = this._gl.RGB;
                break;
            case 5:
                internalFormat = this._gl.RGBA;
                break;
        }
        if (this._webGLVersion > 1) {
            switch (format) {
                case 8:
                    internalFormat = this._gl.RED_INTEGER;
                    break;
                case 9:
                    internalFormat = this._gl.RG_INTEGER;
                    break;
                case 10:
                    internalFormat = this._gl.RGB_INTEGER;
                    break;
                case 11:
                    internalFormat = this._gl.RGBA_INTEGER;
                    break;
            }
        }
        return internalFormat;
    };
    /** @hidden */
    ThinEngine.prototype._getRGBABufferInternalSizedFormat = function (type, format) {
        if (this._webGLVersion === 1) {
            if (format !== undefined) {
                switch (format) {
                    case 0:
                        return this._gl.ALPHA;
                    case 1:
                        return this._gl.LUMINANCE;
                    case 2:
                        return this._gl.LUMINANCE_ALPHA;
                    case 4:
                        return this._gl.RGB;
                }
            }
            return this._gl.RGBA;
        }
        switch (type) {
            case 3:
                switch (format) {
                    case 6:
                        return this._gl.R8_SNORM;
                    case 7:
                        return this._gl.RG8_SNORM;
                    case 4:
                        return this._gl.RGB8_SNORM;
                    case 8:
                        return this._gl.R8I;
                    case 9:
                        return this._gl.RG8I;
                    case 10:
                        return this._gl.RGB8I;
                    case 11:
                        return this._gl.RGBA8I;
                    default:
                        return this._gl.RGBA8_SNORM;
                }
            case 0:
                switch (format) {
                    case 6:
                        return this._gl.R8;
                    case 7:
                        return this._gl.RG8;
                    case 4:
                        return this._gl.RGB8; // By default. Other possibilities are RGB565, SRGB8.
                    case 5:
                        return this._gl.RGBA8; // By default. Other possibilities are RGB5_A1, RGBA4, SRGB8_ALPHA8.
                    case 8:
                        return this._gl.R8UI;
                    case 9:
                        return this._gl.RG8UI;
                    case 10:
                        return this._gl.RGB8UI;
                    case 11:
                        return this._gl.RGBA8UI;
                    case 0:
                        return this._gl.ALPHA;
                    case 1:
                        return this._gl.LUMINANCE;
                    case 2:
                        return this._gl.LUMINANCE_ALPHA;
                    default:
                        return this._gl.RGBA8;
                }
            case 4:
                switch (format) {
                    case 8:
                        return this._gl.R16I;
                    case 9:
                        return this._gl.RG16I;
                    case 10:
                        return this._gl.RGB16I;
                    case 11:
                        return this._gl.RGBA16I;
                    default:
                        return this._gl.RGBA16I;
                }
            case 5:
                switch (format) {
                    case 8:
                        return this._gl.R16UI;
                    case 9:
                        return this._gl.RG16UI;
                    case 10:
                        return this._gl.RGB16UI;
                    case 11:
                        return this._gl.RGBA16UI;
                    default:
                        return this._gl.RGBA16UI;
                }
            case 6:
                switch (format) {
                    case 8:
                        return this._gl.R32I;
                    case 9:
                        return this._gl.RG32I;
                    case 10:
                        return this._gl.RGB32I;
                    case 11:
                        return this._gl.RGBA32I;
                    default:
                        return this._gl.RGBA32I;
                }
            case 7: // Refers to UNSIGNED_INT
                switch (format) {
                    case 8:
                        return this._gl.R32UI;
                    case 9:
                        return this._gl.RG32UI;
                    case 10:
                        return this._gl.RGB32UI;
                    case 11:
                        return this._gl.RGBA32UI;
                    default:
                        return this._gl.RGBA32UI;
                }
            case 1:
                switch (format) {
                    case 6:
                        return this._gl.R32F; // By default. Other possibility is R16F.
                    case 7:
                        return this._gl.RG32F; // By default. Other possibility is RG16F.
                    case 4:
                        return this._gl.RGB32F; // By default. Other possibilities are RGB16F, R11F_G11F_B10F, RGB9_E5.
                    case 5:
                        return this._gl.RGBA32F; // By default. Other possibility is RGBA16F.
                    default:
                        return this._gl.RGBA32F;
                }
            case 2:
                switch (format) {
                    case 6:
                        return this._gl.R16F;
                    case 7:
                        return this._gl.RG16F;
                    case 4:
                        return this._gl.RGB16F; // By default. Other possibilities are R11F_G11F_B10F, RGB9_E5.
                    case 5:
                        return this._gl.RGBA16F;
                    default:
                        return this._gl.RGBA16F;
                }
            case 10:
                return this._gl.RGB565;
            case 13:
                return this._gl.R11F_G11F_B10F;
            case 14:
                return this._gl.RGB9_E5;
            case 8:
                return this._gl.RGBA4;
            case 9:
                return this._gl.RGB5_A1;
            case 11:
                switch (format) {
                    case 5:
                        return this._gl.RGB10_A2; // By default. Other possibility is RGB5_A1.
                    case 11:
                        return this._gl.RGB10_A2UI;
                    default:
                        return this._gl.RGB10_A2;
                }
        }
        return this._gl.RGBA8;
    };
    /** @hidden */
    ThinEngine.prototype._getRGBAMultiSampleBufferFormat = function (type) {
        if (type === 1) {
            return this._gl.RGBA32F;
        }
        else if (type === 2) {
            return this._gl.RGBA16F;
        }
        return this._gl.RGBA8;
    };
    /** @hidden */
    ThinEngine.prototype._loadFile = function (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) {
        var _this = this;
        var request = ThinEngine._FileToolsLoadFile(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError);
        this._activeRequests.push(request);
        request.onCompleteObservable.add(function (request) {
            _this._activeRequests.splice(_this._activeRequests.indexOf(request), 1);
        });
        return request;
    };
    /**
     * Loads a file from a url
     * @param url url to load
     * @param onSuccess callback called when the file successfully loads
     * @param onProgress callback called while file is loading (if the server supports this mode)
     * @param offlineProvider defines the offline provider for caching
     * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
     * @param onError callback called when the file fails to load
     * @returns a file request object
     * @hidden
     */
    ThinEngine._FileToolsLoadFile = function (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) {
        throw _DevTools.WarnImport("FileTools");
    };
    /**
     * Reads pixels from the current frame buffer. Please note that this function can be slow
     * @param x defines the x coordinate of the rectangle where pixels must be read
     * @param y defines the y coordinate of the rectangle where pixels must be read
     * @param width defines the width of the rectangle where pixels must be read
     * @param height defines the height of the rectangle where pixels must be read
     * @param hasAlpha defines whether the output should have alpha or not (defaults to true)
     * @returns a Uint8Array containing RGBA colors
     */
    ThinEngine.prototype.readPixels = function (x, y, width, height, hasAlpha) {
        if (hasAlpha === void 0) { hasAlpha = true; }
        var numChannels = hasAlpha ? 4 : 3;
        var format = hasAlpha ? this._gl.RGBA : this._gl.RGB;
        var data = new Uint8Array(height * width * numChannels);
        this._gl.readPixels(x, y, width, height, format, this._gl.UNSIGNED_BYTE, data);
        return data;
    };
    Object.defineProperty(ThinEngine, "IsSupported", {
        /**
         * Gets a boolean indicating if the engine can be instanciated (ie. if a webGL context can be found)
         */
        get: function () {
            return this.isSupported(); // Backward compat
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets a boolean indicating if the engine can be instanciated (ie. if a webGL context can be found)
     * @returns true if the engine can be created
     * @ignorenaming
     */
    ThinEngine.isSupported = function () {
        if (this._HasMajorPerformanceCaveat !== null) {
            return !this._HasMajorPerformanceCaveat; // We know it is performant so WebGL is supported
        }
        if (this._IsSupported === null) {
            try {
                var tempcanvas = CanvasGenerator.CreateCanvas(1, 1);
                var gl = tempcanvas.getContext("webgl") || tempcanvas.getContext("experimental-webgl");
                this._IsSupported = gl != null && !!window.WebGLRenderingContext;
            }
            catch (e) {
                this._IsSupported = false;
            }
        }
        return this._IsSupported;
    };
    Object.defineProperty(ThinEngine, "HasMajorPerformanceCaveat", {
        /**
         * Gets a boolean indicating if the engine can be instanciated on a performant device (ie. if a webGL context can be found and it does not use a slow implementation)
         */
        get: function () {
            if (this._HasMajorPerformanceCaveat === null) {
                try {
                    var tempcanvas = CanvasGenerator.CreateCanvas(1, 1);
                    var gl = tempcanvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) || tempcanvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: true });
                    this._HasMajorPerformanceCaveat = !gl;
                }
                catch (e) {
                    this._HasMajorPerformanceCaveat = false;
                }
            }
            return this._HasMajorPerformanceCaveat;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Find the next highest power of two.
     * @param x Number to start search from.
     * @return Next highest power of two.
     */
    ThinEngine.CeilingPOT = function (x) {
        x--;
        x |= x >> 1;
        x |= x >> 2;
        x |= x >> 4;
        x |= x >> 8;
        x |= x >> 16;
        x++;
        return x;
    };
    /**
     * Find the next lowest power of two.
     * @param x Number to start search from.
     * @return Next lowest power of two.
     */
    ThinEngine.FloorPOT = function (x) {
        x = x | (x >> 1);
        x = x | (x >> 2);
        x = x | (x >> 4);
        x = x | (x >> 8);
        x = x | (x >> 16);
        return x - (x >> 1);
    };
    /**
     * Find the nearest power of two.
     * @param x Number to start search from.
     * @return Next nearest power of two.
     */
    ThinEngine.NearestPOT = function (x) {
        var c = ThinEngine.CeilingPOT(x);
        var f = ThinEngine.FloorPOT(x);
        return (c - x) > (x - f) ? f : c;
    };
    /**
     * Get the closest exponent of two
     * @param value defines the value to approximate
     * @param max defines the maximum value to return
     * @param mode defines how to define the closest value
     * @returns closest exponent of two of the given value
     */
    ThinEngine.GetExponentOfTwo = function (value, max, mode) {
        if (mode === void 0) { mode = 2; }
        var pot;
        switch (mode) {
            case 1:
                pot = ThinEngine.FloorPOT(value);
                break;
            case 2:
                pot = ThinEngine.NearestPOT(value);
                break;
            case 3:
            default:
                pot = ThinEngine.CeilingPOT(value);
                break;
        }
        return Math.min(pot, max);
    };
    /**
     * Queue a new function into the requested animation frame pool (ie. this function will be executed byt the browser for the next frame)
     * @param func - the function to be called
     * @param requester - the object that will request the next frame. Falls back to window.
     * @returns frame number
     */
    ThinEngine.QueueNewFrame = function (func, requester) {
        if (!DomManagement.IsWindowObjectExist()) {
            if (typeof requestAnimationFrame !== "undefined") {
                return requestAnimationFrame(func);
            }
            return setTimeout(func, 16);
        }
        if (!requester) {
            requester = window;
        }
        if (requester.requestPostAnimationFrame) {
            return requester.requestPostAnimationFrame(func);
        }
        else if (requester.requestAnimationFrame) {
            return requester.requestAnimationFrame(func);
        }
        else if (requester.msRequestAnimationFrame) {
            return requester.msRequestAnimationFrame(func);
        }
        else if (requester.webkitRequestAnimationFrame) {
            return requester.webkitRequestAnimationFrame(func);
        }
        else if (requester.mozRequestAnimationFrame) {
            return requester.mozRequestAnimationFrame(func);
        }
        else if (requester.oRequestAnimationFrame) {
            return requester.oRequestAnimationFrame(func);
        }
        else {
            return window.setTimeout(func, 16);
        }
    };
    /**
     * Gets host document
     * @returns the host document object
     */
    ThinEngine.prototype.getHostDocument = function () {
        if (this._renderingCanvas && this._renderingCanvas.ownerDocument) {
            return this._renderingCanvas.ownerDocument;
        }
        return document;
    };
    /** Use this array to turn off some WebGL2 features on known buggy browsers version */
    ThinEngine.ExceptionList = [
        { key: "Chrome\/63\.0", capture: "63\\.0\\.3239\\.(\\d+)", captureConstraint: 108, targets: ["uniformBuffer"] },
        { key: "Firefox\/58", capture: null, captureConstraint: null, targets: ["uniformBuffer"] },
        { key: "Firefox\/59", capture: null, captureConstraint: null, targets: ["uniformBuffer"] },
        { key: "Chrome\/72.+?Mobile", capture: null, captureConstraint: null, targets: ["vao"] },
        { key: "Chrome\/73.+?Mobile", capture: null, captureConstraint: null, targets: ["vao"] },
        { key: "Chrome\/74.+?Mobile", capture: null, captureConstraint: null, targets: ["vao"] },
        { key: "Mac OS.+Chrome\/71", capture: null, captureConstraint: null, targets: ["vao"] },
        { key: "Mac OS.+Chrome\/72", capture: null, captureConstraint: null, targets: ["vao"] }
    ];
    /** @hidden */
    ThinEngine._TextureLoaders = [];
    // Updatable statics so stick with vars here
    /**
     * Gets or sets the epsilon value used by collision engine
     */
    ThinEngine.CollisionsEpsilon = 0.001;
    // Statics
    ThinEngine._IsSupported = null;
    ThinEngine._HasMajorPerformanceCaveat = null;
    return ThinEngine;
}());

export { AlphaState as A, CanvasGenerator as C, DomManagement as D, EngineStore as E, InternalTexture as I, Logger as L, MultiObserver as M, Observable as O, RenderTargetCreationOptions as R, StringTools as S, ThinEngine as T, WebGLDataBuffer as W, __extends as _, __decorate as a, _DevTools as b, ShaderProcessor as c, __assign as d, InternalTextureSource as e, Effect as f, DataBuffer as g, WebGL2ShaderProcessor as h, __awaiter as i, __generator as j, __spreadArrays as k, WebGLPipelineContext as l, DepthCullingState as m, StencilState as n, EventState as o, Observer as p };
