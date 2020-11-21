import { _ as __extends, T as ThinEngine, c as ShaderProcessor, S as StringTools, O as Observable, D as DomManagement, L as Logger } from './thinEngine-e576a091.js';
import { _ as _TypeStore } from './math.color-fc6e801e.js';

/** @hidden */
function createXMLHttpRequest() {
    // If running in Babylon Native, then defer to the native XMLHttpRequest, which has the same public contract
    if (typeof _native !== 'undefined' && _native.XMLHttpRequest) {
        return new _native.XMLHttpRequest();
    }
    else {
        return new XMLHttpRequest();
    }
}
/**
 * Extended version of XMLHttpRequest with support for customizations (headers, ...)
 */
var WebRequest = /** @class */ (function () {
    function WebRequest() {
        this._xhr = createXMLHttpRequest();
    }
    WebRequest.prototype._injectCustomRequestHeaders = function () {
        for (var key in WebRequest.CustomRequestHeaders) {
            var val = WebRequest.CustomRequestHeaders[key];
            if (val) {
                this._xhr.setRequestHeader(key, val);
            }
        }
    };
    Object.defineProperty(WebRequest.prototype, "onprogress", {
        /**
         * Gets or sets a function to be called when loading progress changes
         */
        get: function () {
            return this._xhr.onprogress;
        },
        set: function (value) {
            this._xhr.onprogress = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "readyState", {
        /**
         * Returns client's state
         */
        get: function () {
            return this._xhr.readyState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "status", {
        /**
         * Returns client's status
         */
        get: function () {
            return this._xhr.status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "statusText", {
        /**
         * Returns client's status as a text
         */
        get: function () {
            return this._xhr.statusText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "response", {
        /**
         * Returns client's response
         */
        get: function () {
            return this._xhr.response;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "responseURL", {
        /**
         * Returns client's response url
         */
        get: function () {
            return this._xhr.responseURL;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "responseText", {
        /**
         * Returns client's response as text
         */
        get: function () {
            return this._xhr.responseText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebRequest.prototype, "responseType", {
        /**
         * Gets or sets the expected response type
         */
        get: function () {
            return this._xhr.responseType;
        },
        set: function (value) {
            this._xhr.responseType = value;
        },
        enumerable: false,
        configurable: true
    });
    WebRequest.prototype.addEventListener = function (type, listener, options) {
        this._xhr.addEventListener(type, listener, options);
    };
    WebRequest.prototype.removeEventListener = function (type, listener, options) {
        this._xhr.removeEventListener(type, listener, options);
    };
    /**
     * Cancels any network activity
     */
    WebRequest.prototype.abort = function () {
        this._xhr.abort();
    };
    /**
     * Initiates the request. The optional argument provides the request body. The argument is ignored if request method is GET or HEAD
     * @param body defines an optional request body
     */
    WebRequest.prototype.send = function (body) {
        if (WebRequest.CustomRequestHeaders) {
            this._injectCustomRequestHeaders();
        }
        this._xhr.send(body);
    };
    /**
     * Sets the request method, request URL
     * @param method defines the method to use (GET, POST, etc..)
     * @param url defines the url to connect with
     */
    WebRequest.prototype.open = function (method, url) {
        for (var _i = 0, _a = WebRequest.CustomRequestModifiers; _i < _a.length; _i++) {
            var update = _a[_i];
            update(this._xhr, url);
        }
        // Clean url
        url = url.replace("file:http:", "http:");
        url = url.replace("file:https:", "https:");
        return this._xhr.open(method, url, true);
    };
    /**
     * Sets the value of a request header.
     * @param name The name of the header whose value is to be set
     * @param value The value to set as the body of the header
     */
    WebRequest.prototype.setRequestHeader = function (name, value) {
        this._xhr.setRequestHeader(name, value);
    };
    /**
     * Get the string containing the text of a particular header's value.
     * @param name The name of the header
     * @returns The string containing the text of the given header name
     */
    WebRequest.prototype.getResponseHeader = function (name) {
        return this._xhr.getResponseHeader(name);
    };
    /**
     * Custom HTTP Request Headers to be sent with XMLHttpRequests
     * i.e. when loading files, where the server/service expects an Authorization header
     */
    WebRequest.CustomRequestHeaders = {};
    /**
     * Add callback functions in this array to update all the requests before they get sent to the network
     */
    WebRequest.CustomRequestModifiers = new Array();
    return WebRequest;
}());

/**
 * Class used to help managing file picking and drag'n'drop
 * File Storage
 */
var FilesInputStore = /** @class */ (function () {
    function FilesInputStore() {
    }
    /**
     * List of files ready to be loaded
     */
    FilesInputStore.FilesToLoad = {};
    return FilesInputStore;
}());

/**
 * Class used to define a retry strategy when error happens while loading assets
 */
var RetryStrategy = /** @class */ (function () {
    function RetryStrategy() {
    }
    /**
     * Function used to defines an exponential back off strategy
     * @param maxRetries defines the maximum number of retries (3 by default)
     * @param baseInterval defines the interval between retries
     * @returns the strategy function to use
     */
    RetryStrategy.ExponentialBackoff = function (maxRetries, baseInterval) {
        if (maxRetries === void 0) { maxRetries = 3; }
        if (baseInterval === void 0) { baseInterval = 500; }
        return function (url, request, retryIndex) {
            if (request.status !== 0 || retryIndex >= maxRetries || url.indexOf("file:") !== -1) {
                return -1;
            }
            return Math.pow(2, retryIndex) * baseInterval;
        };
    };
    return RetryStrategy;
}());

/**
 * @ignore
 * Application error to support additional information when loading a file
 */
var BaseError = /** @class */ (function (_super) {
    __extends(BaseError, _super);
    function BaseError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // See https://stackoverflow.com/questions/12915412/how-do-i-extend-a-host-object-e-g-error-in-typescript
    // and https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Polyfill for Object.setPrototypeOf if necessary.
    BaseError._setPrototypeOf = Object.setPrototypeOf || (function (o, proto) { o.__proto__ = proto; return o; });
    return BaseError;
}(Error));

/** @ignore */
var LoadFileError = /** @class */ (function (_super) {
    __extends(LoadFileError, _super);
    /**
     * Creates a new LoadFileError
     * @param message defines the message of the error
     * @param request defines the optional web request
     * @param file defines the optional file
     */
    function LoadFileError(message, object) {
        var _this = _super.call(this, message) || this;
        _this.name = "LoadFileError";
        BaseError._setPrototypeOf(_this, LoadFileError.prototype);
        if (object instanceof WebRequest) {
            _this.request = object;
        }
        else {
            _this.file = object;
        }
        return _this;
    }
    return LoadFileError;
}(BaseError));
/** @ignore */
var RequestFileError = /** @class */ (function (_super) {
    __extends(RequestFileError, _super);
    /**
     * Creates a new LoadFileError
     * @param message defines the message of the error
     * @param request defines the optional web request
     */
    function RequestFileError(message, request) {
        var _this = _super.call(this, message) || this;
        _this.request = request;
        _this.name = "RequestFileError";
        BaseError._setPrototypeOf(_this, RequestFileError.prototype);
        return _this;
    }
    return RequestFileError;
}(BaseError));
/** @ignore */
var ReadFileError = /** @class */ (function (_super) {
    __extends(ReadFileError, _super);
    /**
     * Creates a new ReadFileError
     * @param message defines the message of the error
     * @param file defines the optional file
     */
    function ReadFileError(message, file) {
        var _this = _super.call(this, message) || this;
        _this.file = file;
        _this.name = "ReadFileError";
        BaseError._setPrototypeOf(_this, ReadFileError.prototype);
        return _this;
    }
    return ReadFileError;
}(BaseError));
/**
 * @hidden
 */
var FileTools = /** @class */ (function () {
    function FileTools() {
    }
    /**
     * Removes unwanted characters from an url
     * @param url defines the url to clean
     * @returns the cleaned url
     */
    FileTools._CleanUrl = function (url) {
        url = url.replace(/#/mg, "%23");
        return url;
    };
    /**
     * Sets the cors behavior on a dom element. This will add the required Tools.CorsBehavior to the element.
     * @param url define the url we are trying
     * @param element define the dom element where to configure the cors policy
     */
    FileTools.SetCorsBehavior = function (url, element) {
        if (url && url.indexOf("data:") === 0) {
            return;
        }
        if (FileTools.CorsBehavior) {
            if (typeof (FileTools.CorsBehavior) === 'string' || this.CorsBehavior instanceof String) {
                element.crossOrigin = FileTools.CorsBehavior;
            }
            else {
                var result = FileTools.CorsBehavior(url);
                if (result) {
                    element.crossOrigin = result;
                }
            }
        }
    };
    /**
     * Loads an image as an HTMLImageElement.
     * @param input url string, ArrayBuffer, or Blob to load
     * @param onLoad callback called when the image successfully loads
     * @param onError callback called when the image fails to load
     * @param offlineProvider offline provider for caching
     * @param mimeType optional mime type
     * @returns the HTMLImageElement of the loaded image
     */
    FileTools.LoadImage = function (input, onLoad, onError, offlineProvider, mimeType) {
        if (mimeType === void 0) { mimeType = ""; }
        var url;
        var usingObjectURL = false;
        if (input instanceof ArrayBuffer || ArrayBuffer.isView(input)) {
            if (typeof Blob !== 'undefined') {
                url = URL.createObjectURL(new Blob([input], { type: mimeType }));
                usingObjectURL = true;
            }
            else {
                url = "data:" + mimeType + ";base64," + StringTools.EncodeArrayBufferToBase64(input);
            }
        }
        else if (input instanceof Blob) {
            url = URL.createObjectURL(input);
            usingObjectURL = true;
        }
        else {
            url = FileTools._CleanUrl(input);
            url = FileTools.PreprocessUrl(input);
        }
        if (typeof Image === "undefined") {
            FileTools.LoadFile(url, function (data) {
                createImageBitmap(new Blob([data], { type: mimeType })).then(function (imgBmp) {
                    onLoad(imgBmp);
                    if (usingObjectURL) {
                        URL.revokeObjectURL(url);
                    }
                }).catch(function (reason) {
                    if (onError) {
                        onError("Error while trying to load image: " + input, reason);
                    }
                });
            }, undefined, offlineProvider || undefined, true, function (request, exception) {
                if (onError) {
                    onError("Error while trying to load image: " + input, exception);
                }
            });
            return null;
        }
        var img = new Image();
        FileTools.SetCorsBehavior(url, img);
        var loadHandler = function () {
            img.removeEventListener("load", loadHandler);
            img.removeEventListener("error", errorHandler);
            onLoad(img);
            // Must revoke the URL after calling onLoad to avoid security exceptions in
            // certain scenarios (e.g. when hosted in vscode).
            if (usingObjectURL && img.src) {
                URL.revokeObjectURL(img.src);
            }
        };
        var errorHandler = function (err) {
            img.removeEventListener("load", loadHandler);
            img.removeEventListener("error", errorHandler);
            if (onError) {
                var inputText = input.toString();
                onError("Error while trying to load image: " + (inputText.length < 32 ? inputText : inputText.slice(0, 32) + "..."), err);
            }
            if (usingObjectURL && img.src) {
                URL.revokeObjectURL(img.src);
            }
        };
        img.addEventListener("load", loadHandler);
        img.addEventListener("error", errorHandler);
        var noOfflineSupport = function () {
            img.src = url;
        };
        var loadFromOfflineSupport = function () {
            if (offlineProvider) {
                offlineProvider.loadImage(url, img);
            }
        };
        if (url.substr(0, 5) !== "data:" && offlineProvider && offlineProvider.enableTexturesOffline) {
            offlineProvider.open(loadFromOfflineSupport, noOfflineSupport);
        }
        else {
            if (url.indexOf("file:") !== -1) {
                var textureName = decodeURIComponent(url.substring(5).toLowerCase());
                if (FilesInputStore.FilesToLoad[textureName]) {
                    try {
                        var blobURL;
                        try {
                            blobURL = URL.createObjectURL(FilesInputStore.FilesToLoad[textureName]);
                        }
                        catch (ex) {
                            // Chrome doesn't support oneTimeOnly parameter
                            blobURL = URL.createObjectURL(FilesInputStore.FilesToLoad[textureName]);
                        }
                        img.src = blobURL;
                        usingObjectURL = true;
                    }
                    catch (e) {
                        img.src = "";
                    }
                    return img;
                }
            }
            noOfflineSupport();
        }
        return img;
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
    FileTools.ReadFile = function (file, onSuccess, onProgress, useArrayBuffer, onError) {
        var reader = new FileReader();
        var request = {
            onCompleteObservable: new Observable(),
            abort: function () { return reader.abort(); },
        };
        reader.onloadend = function (e) { return request.onCompleteObservable.notifyObservers(request); };
        if (onError) {
            reader.onerror = function (e) {
                onError(new ReadFileError("Unable to read " + file.name, file));
            };
        }
        reader.onload = function (e) {
            //target doesn't have result from ts 1.3
            onSuccess(e.target['result']);
        };
        if (onProgress) {
            reader.onprogress = onProgress;
        }
        if (!useArrayBuffer) {
            // Asynchronous read
            reader.readAsText(file);
        }
        else {
            reader.readAsArrayBuffer(file);
        }
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
     */
    FileTools.LoadFile = function (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) {
        // If file and file input are set
        if (url.indexOf("file:") !== -1) {
            var fileName = decodeURIComponent(url.substring(5).toLowerCase());
            if (fileName.indexOf('./') === 0) {
                fileName = fileName.substring(2);
            }
            var file = FilesInputStore.FilesToLoad[fileName];
            if (file) {
                return FileTools.ReadFile(file, onSuccess, onProgress, useArrayBuffer, onError ? function (error) { return onError(undefined, new LoadFileError(error.message, error.file)); } : undefined);
            }
        }
        return FileTools.RequestFile(url, function (data, request) {
            onSuccess(data, request ? request.responseURL : undefined);
        }, onProgress, offlineProvider, useArrayBuffer, onError ? function (error) {
            onError(error.request, new LoadFileError(error.message, error.request));
        } : undefined);
    };
    /**
     * Loads a file
     * @param url url to load
     * @param onSuccess callback called when the file successfully loads
     * @param onProgress callback called while file is loading (if the server supports this mode)
     * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
     * @param onError callback called when the file fails to load
     * @param onOpened callback called when the web request is opened
     * @returns a file request object
     */
    FileTools.RequestFile = function (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError, onOpened) {
        url = FileTools._CleanUrl(url);
        url = FileTools.PreprocessUrl(url);
        var loadUrl = FileTools.BaseUrl + url;
        var aborted = false;
        var fileRequest = {
            onCompleteObservable: new Observable(),
            abort: function () { return aborted = true; },
        };
        var requestFile = function () {
            var request = new WebRequest();
            var retryHandle = null;
            fileRequest.abort = function () {
                aborted = true;
                if (request.readyState !== (XMLHttpRequest.DONE || 4)) {
                    request.abort();
                }
                if (retryHandle !== null) {
                    clearTimeout(retryHandle);
                    retryHandle = null;
                }
            };
            var retryLoop = function (retryIndex) {
                request.open('GET', loadUrl);
                if (onOpened) {
                    onOpened(request);
                }
                if (useArrayBuffer) {
                    request.responseType = "arraybuffer";
                }
                if (onProgress) {
                    request.addEventListener("progress", onProgress);
                }
                var onLoadEnd = function () {
                    request.removeEventListener("loadend", onLoadEnd);
                    fileRequest.onCompleteObservable.notifyObservers(fileRequest);
                    fileRequest.onCompleteObservable.clear();
                };
                request.addEventListener("loadend", onLoadEnd);
                var onReadyStateChange = function () {
                    if (aborted) {
                        return;
                    }
                    // In case of undefined state in some browsers.
                    if (request.readyState === (XMLHttpRequest.DONE || 4)) {
                        // Some browsers have issues where onreadystatechange can be called multiple times with the same value.
                        request.removeEventListener("readystatechange", onReadyStateChange);
                        if ((request.status >= 200 && request.status < 300) || (request.status === 0 && (!DomManagement.IsWindowObjectExist() || FileTools.IsFileURL()))) {
                            onSuccess(useArrayBuffer ? request.response : request.responseText, request);
                            return;
                        }
                        var retryStrategy = FileTools.DefaultRetryStrategy;
                        if (retryStrategy) {
                            var waitTime = retryStrategy(loadUrl, request, retryIndex);
                            if (waitTime !== -1) {
                                // Prevent the request from completing for retry.
                                request.removeEventListener("loadend", onLoadEnd);
                                request = new WebRequest();
                                retryHandle = setTimeout(function () { return retryLoop(retryIndex + 1); }, waitTime);
                                return;
                            }
                        }
                        var error = new RequestFileError("Error status: " + request.status + " " + request.statusText + " - Unable to load " + loadUrl, request);
                        if (onError) {
                            onError(error);
                        }
                    }
                };
                request.addEventListener("readystatechange", onReadyStateChange);
                request.send();
            };
            retryLoop(0);
        };
        // Caching all files
        if (offlineProvider && offlineProvider.enableSceneOffline) {
            var noOfflineSupport_1 = function (request) {
                if (request && request.status > 400) {
                    if (onError) {
                        onError(request);
                    }
                }
                else {
                    requestFile();
                }
            };
            var loadFromOfflineSupport = function () {
                // TODO: database needs to support aborting and should return a IFileRequest
                if (offlineProvider) {
                    offlineProvider.loadFile(FileTools.BaseUrl + url, function (data) {
                        if (!aborted) {
                            onSuccess(data);
                        }
                        fileRequest.onCompleteObservable.notifyObservers(fileRequest);
                    }, onProgress ? function (event) {
                        if (!aborted) {
                            onProgress(event);
                        }
                    } : undefined, noOfflineSupport_1, useArrayBuffer);
                }
            };
            offlineProvider.open(loadFromOfflineSupport, noOfflineSupport_1);
        }
        else {
            requestFile();
        }
        return fileRequest;
    };
    /**
     * Checks if the loaded document was accessed via `file:`-Protocol.
     * @returns boolean
     */
    FileTools.IsFileURL = function () {
        return typeof location !== "undefined" && location.protocol === "file:";
    };
    /**
     * Gets or sets the retry strategy to apply when an error happens while loading an asset
     */
    FileTools.DefaultRetryStrategy = RetryStrategy.ExponentialBackoff();
    /**
     * Gets or sets the base URL to use to load assets
     */
    FileTools.BaseUrl = "";
    /**
     * Default behaviour for cors in the application.
     * It can be a string if the expected behavior is identical in the entire app.
     * Or a callback to be able to set it per url or on a group of them (in case of Video source for instance)
     */
    FileTools.CorsBehavior = "anonymous";
    /**
     * Gets or sets a function used to pre-process url before using them to load assets
     */
    FileTools.PreprocessUrl = function (url) {
        return url;
    };
    return FileTools;
}());
ThinEngine._FileToolsLoadImage = FileTools.LoadImage.bind(FileTools);
ThinEngine._FileToolsLoadFile = FileTools.LoadFile.bind(FileTools);
ShaderProcessor._FileToolsLoadFile = FileTools.LoadFile.bind(FileTools);

/**
 * Class used to provide helper for timing
 */
var TimingTools = /** @class */ (function () {
    function TimingTools() {
    }
    /**
     * Polyfill for setImmediate
     * @param action defines the action to execute after the current execution block
     */
    TimingTools.SetImmediate = function (action) {
        if (DomManagement.IsWindowObjectExist() && window.setImmediate) {
            window.setImmediate(action);
        }
        else {
            setTimeout(action, 1);
        }
    };
    return TimingTools;
}());

/**
 * Class used to enable instatition of objects by class name
 */
var InstantiationTools = /** @class */ (function () {
    function InstantiationTools() {
    }
    /**
     * Tries to instantiate a new object from a given class name
     * @param className defines the class name to instantiate
     * @returns the new object or null if the system was not able to do the instantiation
     */
    InstantiationTools.Instantiate = function (className) {
        if (this.RegisteredExternalClasses && this.RegisteredExternalClasses[className]) {
            return this.RegisteredExternalClasses[className];
        }
        var internalClass = _TypeStore.GetClass(className);
        if (internalClass) {
            return internalClass;
        }
        Logger.Warn(className + " not found, you may have missed an import.");
        var arr = className.split(".");
        var fn = (window || this);
        for (var i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }
        if (typeof fn !== "function") {
            return null;
        }
        return fn;
    };
    /**
     * Use this object to register external classes like custom textures or material
     * to allow the laoders to instantiate them
     */
    InstantiationTools.RegisteredExternalClasses = {};
    return InstantiationTools;
}());

/**
 * Class used to manipulate GUIDs
 */
var GUID = /** @class */ (function () {
    function GUID() {
    }
    /**
     * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
     * Be aware Math.random() could cause collisions, but:
     * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
     * @returns a pseudo random id
     */
    GUID.RandomId = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return GUID;
}());

export { FileTools as F, GUID as G, InstantiationTools as I, LoadFileError as L, RetryStrategy as R, TimingTools as T, WebRequest as W, FilesInputStore as a, RequestFileError as b, ReadFileError as c };
