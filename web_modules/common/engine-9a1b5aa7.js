import { D as DomManagement, T as ThinEngine, _ as __extends, E as EngineStore, b as _DevTools, L as Logger, W as WebGLDataBuffer, O as Observable } from './thinEngine-e576a091.js';

/**
 * Class containing a set of static utilities functions for precision date
 */
var PrecisionDate = /** @class */ (function () {
    function PrecisionDate() {
    }
    Object.defineProperty(PrecisionDate, "Now", {
        /**
         * Gets either window.performance.now() if supported or Date.now() else
         */
        get: function () {
            if (DomManagement.IsWindowObjectExist() && window.performance && window.performance.now) {
                return window.performance.now();
            }
            return Date.now();
        },
        enumerable: false,
        configurable: true
    });
    return PrecisionDate;
}());

/**
 * Performance monitor tracks rolling average frame-time and frame-time variance over a user defined sliding-window
 */
var PerformanceMonitor = /** @class */ (function () {
    /**
     * constructor
     * @param frameSampleSize The number of samples required to saturate the sliding window
     */
    function PerformanceMonitor(frameSampleSize) {
        if (frameSampleSize === void 0) { frameSampleSize = 30; }
        this._enabled = true;
        this._rollingFrameTime = new RollingAverage(frameSampleSize);
    }
    /**
     * Samples current frame
     * @param timeMs A timestamp in milliseconds of the current frame to compare with other frames
     */
    PerformanceMonitor.prototype.sampleFrame = function (timeMs) {
        if (timeMs === void 0) { timeMs = PrecisionDate.Now; }
        if (!this._enabled) {
            return;
        }
        if (this._lastFrameTimeMs != null) {
            var dt = timeMs - this._lastFrameTimeMs;
            this._rollingFrameTime.add(dt);
        }
        this._lastFrameTimeMs = timeMs;
    };
    Object.defineProperty(PerformanceMonitor.prototype, "averageFrameTime", {
        /**
         * Returns the average frame time in milliseconds over the sliding window (or the subset of frames sampled so far)
         */
        get: function () {
            return this._rollingFrameTime.average;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerformanceMonitor.prototype, "averageFrameTimeVariance", {
        /**
         * Returns the variance frame time in milliseconds over the sliding window (or the subset of frames sampled so far)
         */
        get: function () {
            return this._rollingFrameTime.variance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerformanceMonitor.prototype, "instantaneousFrameTime", {
        /**
         * Returns the frame time of the most recent frame
         */
        get: function () {
            return this._rollingFrameTime.history(0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerformanceMonitor.prototype, "averageFPS", {
        /**
         * Returns the average framerate in frames per second over the sliding window (or the subset of frames sampled so far)
         */
        get: function () {
            return 1000.0 / this._rollingFrameTime.average;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerformanceMonitor.prototype, "instantaneousFPS", {
        /**
         * Returns the average framerate in frames per second using the most recent frame time
         */
        get: function () {
            var history = this._rollingFrameTime.history(0);
            if (history === 0) {
                return 0;
            }
            return 1000.0 / history;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerformanceMonitor.prototype, "isSaturated", {
        /**
         * Returns true if enough samples have been taken to completely fill the sliding window
         */
        get: function () {
            return this._rollingFrameTime.isSaturated();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Enables contributions to the sliding window sample set
     */
    PerformanceMonitor.prototype.enable = function () {
        this._enabled = true;
    };
    /**
     * Disables contributions to the sliding window sample set
     * Samples will not be interpolated over the disabled period
     */
    PerformanceMonitor.prototype.disable = function () {
        this._enabled = false;
        //clear last sample to avoid interpolating over the disabled period when next enabled
        this._lastFrameTimeMs = null;
    };
    Object.defineProperty(PerformanceMonitor.prototype, "isEnabled", {
        /**
         * Returns true if sampling is enabled
         */
        get: function () {
            return this._enabled;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Resets performance monitor
     */
    PerformanceMonitor.prototype.reset = function () {
        //clear last sample to avoid interpolating over the disabled period when next enabled
        this._lastFrameTimeMs = null;
        //wipe record
        this._rollingFrameTime.reset();
    };
    return PerformanceMonitor;
}());
/**
 * RollingAverage
 *
 * Utility to efficiently compute the rolling average and variance over a sliding window of samples
 */
var RollingAverage = /** @class */ (function () {
    /**
     * constructor
     * @param length The number of samples required to saturate the sliding window
     */
    function RollingAverage(length) {
        this._samples = new Array(length);
        this.reset();
    }
    /**
     * Adds a sample to the sample set
     * @param v The sample value
     */
    RollingAverage.prototype.add = function (v) {
        //http://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
        var delta;
        //we need to check if we've already wrapped round
        if (this.isSaturated()) {
            //remove bottom of stack from mean
            var bottomValue = this._samples[this._pos];
            delta = bottomValue - this.average;
            this.average -= delta / (this._sampleCount - 1);
            this._m2 -= delta * (bottomValue - this.average);
        }
        else {
            this._sampleCount++;
        }
        //add new value to mean
        delta = v - this.average;
        this.average += delta / (this._sampleCount);
        this._m2 += delta * (v - this.average);
        //set the new variance
        this.variance = this._m2 / (this._sampleCount - 1);
        this._samples[this._pos] = v;
        this._pos++;
        this._pos %= this._samples.length; //positive wrap around
    };
    /**
     * Returns previously added values or null if outside of history or outside the sliding window domain
     * @param i Index in history. For example, pass 0 for the most recent value and 1 for the value before that
     * @return Value previously recorded with add() or null if outside of range
     */
    RollingAverage.prototype.history = function (i) {
        if ((i >= this._sampleCount) || (i >= this._samples.length)) {
            return 0;
        }
        var i0 = this._wrapPosition(this._pos - 1.0);
        return this._samples[this._wrapPosition(i0 - i)];
    };
    /**
     * Returns true if enough samples have been taken to completely fill the sliding window
     * @return true if sample-set saturated
     */
    RollingAverage.prototype.isSaturated = function () {
        return this._sampleCount >= this._samples.length;
    };
    /**
     * Resets the rolling average (equivalent to 0 samples taken so far)
     */
    RollingAverage.prototype.reset = function () {
        this.average = 0;
        this.variance = 0;
        this._sampleCount = 0;
        this._pos = 0;
        this._m2 = 0;
    };
    /**
     * Wraps a value around the sample range boundaries
     * @param i Position in sample range, for example if the sample length is 5, and i is -3, then 2 will be returned.
     * @return Wrapped position in sample range
     */
    RollingAverage.prototype._wrapPosition = function (i) {
        var max = this._samples.length;
        return ((i % max) + max) % max;
    };
    return RollingAverage;
}());

/**
 * This class is used to track a performance counter which is number based.
 * The user has access to many properties which give statistics of different nature.
 *
 * The implementer can track two kinds of Performance Counter: time and count.
 * For time you can optionally call fetchNewFrame() to notify the start of a new frame to monitor, then call beginMonitoring() to start and endMonitoring() to record the lapsed time. endMonitoring takes a newFrame parameter for you to specify if the monitored time should be set for a new frame or accumulated to the current frame being monitored.
 * For count you first have to call fetchNewFrame() to notify the start of a new frame to monitor, then call addCount() how many time required to increment the count value you monitor.
 */
var PerfCounter = /** @class */ (function () {
    /**
     * Creates a new counter
     */
    function PerfCounter() {
        this._startMonitoringTime = 0;
        this._min = 0;
        this._max = 0;
        this._average = 0;
        this._lastSecAverage = 0;
        this._current = 0;
        this._totalValueCount = 0;
        this._totalAccumulated = 0;
        this._lastSecAccumulated = 0;
        this._lastSecTime = 0;
        this._lastSecValueCount = 0;
    }
    Object.defineProperty(PerfCounter.prototype, "min", {
        /**
         * Returns the smallest value ever
         */
        get: function () {
            return this._min;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "max", {
        /**
         * Returns the biggest value ever
         */
        get: function () {
            return this._max;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "average", {
        /**
         * Returns the average value since the performance counter is running
         */
        get: function () {
            return this._average;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "lastSecAverage", {
        /**
         * Returns the average value of the last second the counter was monitored
         */
        get: function () {
            return this._lastSecAverage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "current", {
        /**
         * Returns the current value
         */
        get: function () {
            return this._current;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "total", {
        /**
         * Gets the accumulated total
         */
        get: function () {
            return this._totalAccumulated;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerfCounter.prototype, "count", {
        /**
         * Gets the total value count
         */
        get: function () {
            return this._totalValueCount;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Call this method to start monitoring a new frame.
     * This scenario is typically used when you accumulate monitoring time many times for a single frame, you call this method at the start of the frame, then beginMonitoring to start recording and endMonitoring(false) to accumulated the recorded time to the PerfCounter or addCount() to accumulate a monitored count.
     */
    PerfCounter.prototype.fetchNewFrame = function () {
        this._totalValueCount++;
        this._current = 0;
        this._lastSecValueCount++;
    };
    /**
     * Call this method to monitor a count of something (e.g. mesh drawn in viewport count)
     * @param newCount the count value to add to the monitored count
     * @param fetchResult true when it's the last time in the frame you add to the counter and you wish to update the statistics properties (min/max/average), false if you only want to update statistics.
     */
    PerfCounter.prototype.addCount = function (newCount, fetchResult) {
        if (!PerfCounter.Enabled) {
            return;
        }
        this._current += newCount;
        if (fetchResult) {
            this._fetchResult();
        }
    };
    /**
     * Start monitoring this performance counter
     */
    PerfCounter.prototype.beginMonitoring = function () {
        if (!PerfCounter.Enabled) {
            return;
        }
        this._startMonitoringTime = PrecisionDate.Now;
    };
    /**
     * Compute the time lapsed since the previous beginMonitoring() call.
     * @param newFrame true by default to fetch the result and monitor a new frame, if false the time monitored will be added to the current frame counter
     */
    PerfCounter.prototype.endMonitoring = function (newFrame) {
        if (newFrame === void 0) { newFrame = true; }
        if (!PerfCounter.Enabled) {
            return;
        }
        if (newFrame) {
            this.fetchNewFrame();
        }
        var currentTime = PrecisionDate.Now;
        this._current = currentTime - this._startMonitoringTime;
        if (newFrame) {
            this._fetchResult();
        }
    };
    PerfCounter.prototype._fetchResult = function () {
        this._totalAccumulated += this._current;
        this._lastSecAccumulated += this._current;
        // Min/Max update
        this._min = Math.min(this._min, this._current);
        this._max = Math.max(this._max, this._current);
        this._average = this._totalAccumulated / this._totalValueCount;
        // Reset last sec?
        var now = PrecisionDate.Now;
        if ((now - this._lastSecTime) > 1000) {
            this._lastSecAverage = this._lastSecAccumulated / this._lastSecValueCount;
            this._lastSecTime = now;
            this._lastSecAccumulated = 0;
            this._lastSecValueCount = 0;
        }
    };
    /**
     * Gets or sets a global boolean to turn on and off all the counters
     */
    PerfCounter.Enabled = true;
    return PerfCounter;
}());

ThinEngine.prototype.setAlphaConstants = function (r, g, b, a) {
    this._alphaState.setAlphaBlendConstants(r, g, b, a);
};
ThinEngine.prototype.setAlphaMode = function (mode, noDepthWriteChange) {
    if (noDepthWriteChange === void 0) { noDepthWriteChange = false; }
    if (this._alphaMode === mode) {
        return;
    }
    switch (mode) {
        case 0:
            this._alphaState.alphaBlend = false;
            break;
        case 7:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE);
            this._alphaState.alphaBlend = true;
            break;
        case 8:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA);
            this._alphaState.alphaBlend = true;
            break;
        case 2:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE);
            this._alphaState.alphaBlend = true;
            break;
        case 6:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE, this._gl.ZERO, this._gl.ONE);
            this._alphaState.alphaBlend = true;
            break;
        case 1:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.SRC_ALPHA, this._gl.ONE, this._gl.ZERO, this._gl.ONE);
            this._alphaState.alphaBlend = true;
            break;
        case 3:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.ZERO, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ONE, this._gl.ONE);
            this._alphaState.alphaBlend = true;
            break;
        case 4:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.DST_COLOR, this._gl.ZERO, this._gl.ONE, this._gl.ONE);
            this._alphaState.alphaBlend = true;
            break;
        case 5:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ONE, this._gl.ONE);
            this._alphaState.alphaBlend = true;
            break;
        case 9:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.CONSTANT_COLOR, this._gl.ONE_MINUS_CONSTANT_COLOR, this._gl.CONSTANT_ALPHA, this._gl.ONE_MINUS_CONSTANT_ALPHA);
            this._alphaState.alphaBlend = true;
            break;
        case 10:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA);
            this._alphaState.alphaBlend = true;
            break;
        case 11:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE, this._gl.ONE, this._gl.ONE);
            this._alphaState.alphaBlend = true;
            break;
        case 12:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.DST_ALPHA, this._gl.ONE, this._gl.ZERO, this._gl.ZERO);
            this._alphaState.alphaBlend = true;
            break;
        case 13:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE_MINUS_DST_COLOR, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ONE_MINUS_DST_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
            this._alphaState.alphaBlend = true;
            break;
        case 14:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA);
            this._alphaState.alphaBlend = true;
            break;
        case 15:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE, this._gl.ONE, this._gl.ZERO);
            this._alphaState.alphaBlend = true;
            break;
        case 16:
            this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE_MINUS_DST_COLOR, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ZERO, this._gl.ONE);
            this._alphaState.alphaBlend = true;
            break;
    }
    if (!noDepthWriteChange) {
        this.depthCullingState.depthMask = (mode === 0);
    }
    this._alphaMode = mode;
};
ThinEngine.prototype.getAlphaMode = function () {
    return this._alphaMode;
};
ThinEngine.prototype.setAlphaEquation = function (equation) {
    if (this._alphaEquation === equation) {
        return;
    }
    switch (equation) {
        case 0:
            this._alphaState.setAlphaEquationParameters(this._gl.FUNC_ADD, this._gl.FUNC_ADD);
            break;
        case 1:
            this._alphaState.setAlphaEquationParameters(this._gl.FUNC_SUBTRACT, this._gl.FUNC_SUBTRACT);
            break;
        case 2:
            this._alphaState.setAlphaEquationParameters(this._gl.FUNC_REVERSE_SUBTRACT, this._gl.FUNC_REVERSE_SUBTRACT);
            break;
        case 3:
            this._alphaState.setAlphaEquationParameters(this._gl.MAX, this._gl.MAX);
            break;
        case 4:
            this._alphaState.setAlphaEquationParameters(this._gl.MIN, this._gl.MIN);
            break;
        case 5:
            this._alphaState.setAlphaEquationParameters(this._gl.MIN, this._gl.FUNC_ADD);
            break;
    }
    this._alphaEquation = equation;
};
ThinEngine.prototype.getAlphaEquation = function () {
    return this._alphaEquation;
};

ThinEngine.prototype._readTexturePixels = function (texture, width, height, faceIndex, level, buffer) {
    if (faceIndex === void 0) { faceIndex = -1; }
    if (level === void 0) { level = 0; }
    if (buffer === void 0) { buffer = null; }
    var gl = this._gl;
    if (!gl) {
        throw new Error("Engine does not have gl rendering context.");
    }
    if (!this._dummyFramebuffer) {
        var dummy = gl.createFramebuffer();
        if (!dummy) {
            throw new Error("Unable to create dummy framebuffer");
        }
        this._dummyFramebuffer = dummy;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._dummyFramebuffer);
    if (faceIndex > -1) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, texture._webGLTexture, level);
    }
    else {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture._webGLTexture, level);
    }
    var readType = (texture.type !== undefined) ? this._getWebGLTextureType(texture.type) : gl.UNSIGNED_BYTE;
    switch (readType) {
        case gl.UNSIGNED_BYTE:
            if (!buffer) {
                buffer = new Uint8Array(4 * width * height);
            }
            readType = gl.UNSIGNED_BYTE;
            break;
        default:
            if (!buffer) {
                buffer = new Float32Array(4 * width * height);
            }
            readType = gl.FLOAT;
            break;
    }
    gl.readPixels(0, 0, width, height, gl.RGBA, readType, buffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._currentFramebuffer);
    return buffer;
};

ThinEngine.prototype.updateDynamicIndexBuffer = function (indexBuffer, indices, offset) {
    // Force cache update
    this._currentBoundBuffer[this._gl.ELEMENT_ARRAY_BUFFER] = null;
    this.bindIndexBuffer(indexBuffer);
    var arrayBuffer;
    if (indices instanceof Uint16Array || indices instanceof Uint32Array) {
        arrayBuffer = indices;
    }
    else {
        arrayBuffer = indexBuffer.is32Bits ? new Uint32Array(indices) : new Uint16Array(indices);
    }
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, arrayBuffer, this._gl.DYNAMIC_DRAW);
    this._resetIndexBufferBinding();
};
ThinEngine.prototype.updateDynamicVertexBuffer = function (vertexBuffer, data, byteOffset, byteLength) {
    this.bindArrayBuffer(vertexBuffer);
    if (byteOffset === undefined) {
        byteOffset = 0;
    }
    var dataLength = data.length || data.byteLength;
    if (byteLength === undefined || byteLength >= dataLength && byteOffset === 0) {
        if (data instanceof Array) {
            this._gl.bufferSubData(this._gl.ARRAY_BUFFER, byteOffset, new Float32Array(data));
        }
        else {
            this._gl.bufferSubData(this._gl.ARRAY_BUFFER, byteOffset, data);
        }
    }
    else {
        if (data instanceof Array) {
            this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, new Float32Array(data).subarray(byteOffset, byteOffset + byteLength));
        }
        else {
            if (data instanceof ArrayBuffer) {
                data = new Uint8Array(data, byteOffset, byteLength);
            }
            else {
                data = new Uint8Array(data.buffer, data.byteOffset + byteOffset, byteLength);
            }
            this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, data);
        }
    }
    this._resetVertexBufferBinding();
};

/**
 * The engine class is responsible for interfacing with all lower-level APIs such as WebGL and Audio
 */
var Engine = /** @class */ (function (_super) {
    __extends(Engine, _super);
    /**
     * Creates a new engine
     * @param canvasOrContext defines the canvas or WebGL context to use for rendering. If you provide a WebGL context, Babylon.js will not hook events on the canvas (like pointers, keyboards, etc...) so no event observables will be available. This is mostly used when Babylon.js is used as a plugin on a system which alreay used the WebGL context
     * @param antialias defines enable antialiasing (default: false)
     * @param options defines further options to be sent to the getContext() function
     * @param adaptToDeviceRatio defines whether to adapt to the device's viewport characteristics (default: false)
     */
    function Engine(canvasOrContext, antialias, options, adaptToDeviceRatio) {
        if (adaptToDeviceRatio === void 0) { adaptToDeviceRatio = false; }
        var _this = _super.call(this, canvasOrContext, antialias, options, adaptToDeviceRatio) || this;
        // Members
        /**
         * Gets or sets a boolean to enable/disable IndexedDB support and avoid XHR on .manifest
         **/
        _this.enableOfflineSupport = false;
        /**
         * Gets or sets a boolean to enable/disable checking manifest if IndexedDB support is enabled (js will always consider the database is up to date)
         **/
        _this.disableManifestCheck = false;
        /**
         * Gets the list of created scenes
         */
        _this.scenes = new Array();
        /**
         * Event raised when a new scene is created
         */
        _this.onNewSceneAddedObservable = new Observable();
        /**
         * Gets the list of created postprocesses
         */
        _this.postProcesses = new Array();
        /**
         * Gets a boolean indicating if the pointer is currently locked
         */
        _this.isPointerLock = false;
        // Observables
        /**
         * Observable event triggered each time the rendering canvas is resized
         */
        _this.onResizeObservable = new Observable();
        /**
         * Observable event triggered each time the canvas loses focus
         */
        _this.onCanvasBlurObservable = new Observable();
        /**
         * Observable event triggered each time the canvas gains focus
         */
        _this.onCanvasFocusObservable = new Observable();
        /**
         * Observable event triggered each time the canvas receives pointerout event
         */
        _this.onCanvasPointerOutObservable = new Observable();
        /**
         * Observable raised when the engine begins a new frame
         */
        _this.onBeginFrameObservable = new Observable();
        /**
         * If set, will be used to request the next animation frame for the render loop
         */
        _this.customAnimationFrameRequester = null;
        /**
         * Observable raised when the engine ends the current frame
         */
        _this.onEndFrameObservable = new Observable();
        /**
         * Observable raised when the engine is about to compile a shader
         */
        _this.onBeforeShaderCompilationObservable = new Observable();
        /**
         * Observable raised when the engine has jsut compiled a shader
         */
        _this.onAfterShaderCompilationObservable = new Observable();
        // Deterministic lockstepMaxSteps
        _this._deterministicLockstep = false;
        _this._lockstepMaxSteps = 4;
        _this._timeStep = 1 / 60;
        // FPS
        _this._fps = 60;
        _this._deltaTime = 0;
        /** @hidden */
        _this._drawCalls = new PerfCounter();
        /** Gets or sets the tab index to set to the rendering canvas. 1 is the minimum value to set to be able to capture keyboard events */
        _this.canvasTabIndex = 1;
        /**
         * Turn this value on if you want to pause FPS computation when in background
         */
        _this.disablePerformanceMonitorInBackground = false;
        _this._performanceMonitor = new PerformanceMonitor();
        Engine.Instances.push(_this);
        if (!canvasOrContext) {
            return _this;
        }
        options = _this._creationOptions;
        if (canvasOrContext.getContext) {
            var canvas_1 = canvasOrContext;
            _this._onCanvasFocus = function () {
                _this.onCanvasFocusObservable.notifyObservers(_this);
            };
            _this._onCanvasBlur = function () {
                _this.onCanvasBlurObservable.notifyObservers(_this);
            };
            canvas_1.addEventListener("focus", _this._onCanvasFocus);
            canvas_1.addEventListener("blur", _this._onCanvasBlur);
            _this._onBlur = function () {
                if (_this.disablePerformanceMonitorInBackground) {
                    _this._performanceMonitor.disable();
                }
                _this._windowIsBackground = true;
            };
            _this._onFocus = function () {
                if (_this.disablePerformanceMonitorInBackground) {
                    _this._performanceMonitor.enable();
                }
                _this._windowIsBackground = false;
            };
            _this._onCanvasPointerOut = function (ev) {
                _this.onCanvasPointerOutObservable.notifyObservers(ev);
            };
            canvas_1.addEventListener("pointerout", _this._onCanvasPointerOut);
            if (DomManagement.IsWindowObjectExist()) {
                var hostWindow = _this.getHostWindow();
                hostWindow.addEventListener("blur", _this._onBlur);
                hostWindow.addEventListener("focus", _this._onFocus);
                var anyDoc_1 = document;
                // Fullscreen
                _this._onFullscreenChange = function () {
                    if (anyDoc_1.fullscreen !== undefined) {
                        _this.isFullscreen = anyDoc_1.fullscreen;
                    }
                    else if (anyDoc_1.mozFullScreen !== undefined) {
                        _this.isFullscreen = anyDoc_1.mozFullScreen;
                    }
                    else if (anyDoc_1.webkitIsFullScreen !== undefined) {
                        _this.isFullscreen = anyDoc_1.webkitIsFullScreen;
                    }
                    else if (anyDoc_1.msIsFullScreen !== undefined) {
                        _this.isFullscreen = anyDoc_1.msIsFullScreen;
                    }
                    // Pointer lock
                    if (_this.isFullscreen && _this._pointerLockRequested && canvas_1) {
                        Engine._RequestPointerlock(canvas_1);
                    }
                };
                document.addEventListener("fullscreenchange", _this._onFullscreenChange, false);
                document.addEventListener("mozfullscreenchange", _this._onFullscreenChange, false);
                document.addEventListener("webkitfullscreenchange", _this._onFullscreenChange, false);
                document.addEventListener("msfullscreenchange", _this._onFullscreenChange, false);
                // Pointer lock
                _this._onPointerLockChange = function () {
                    _this.isPointerLock = (anyDoc_1.mozPointerLockElement === canvas_1 ||
                        anyDoc_1.webkitPointerLockElement === canvas_1 ||
                        anyDoc_1.msPointerLockElement === canvas_1 ||
                        anyDoc_1.pointerLockElement === canvas_1);
                };
                document.addEventListener("pointerlockchange", _this._onPointerLockChange, false);
                document.addEventListener("mspointerlockchange", _this._onPointerLockChange, false);
                document.addEventListener("mozpointerlockchange", _this._onPointerLockChange, false);
                document.addEventListener("webkitpointerlockchange", _this._onPointerLockChange, false);
                // Create Audio Engine if needed.
                if (!Engine.audioEngine && options.audioEngine && Engine.AudioEngineFactory) {
                    Engine.audioEngine = Engine.AudioEngineFactory(_this.getRenderingCanvas());
                }
            }
            _this._connectVREvents();
            _this.enableOfflineSupport = Engine.OfflineProviderFactory !== undefined;
            if (!options.doNotHandleTouchAction) {
                _this._disableTouchAction();
            }
            _this._deterministicLockstep = !!options.deterministicLockstep;
            _this._lockstepMaxSteps = options.lockstepMaxSteps || 0;
            _this._timeStep = options.timeStep || 1 / 60;
        }
        // Load WebVR Devices
        _this._prepareVRComponent();
        if (options.autoEnableWebVR) {
            _this.initWebVR();
        }
        return _this;
    }
    Object.defineProperty(Engine, "NpmPackage", {
        /**
         * Returns the current npm package of the sdk
         */
        // Not mixed with Version for tooling purpose.
        get: function () {
            return ThinEngine.NpmPackage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine, "Version", {
        /**
         * Returns the current version of the framework
         */
        get: function () {
            return ThinEngine.Version;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine, "Instances", {
        /** Gets the list of created engines */
        get: function () {
            return EngineStore.Instances;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine, "LastCreatedEngine", {
        /**
         * Gets the latest created engine
         */
        get: function () {
            return EngineStore.LastCreatedEngine;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine, "LastCreatedScene", {
        /**
         * Gets the latest created scene
         */
        get: function () {
            return EngineStore.LastCreatedScene;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Will flag all materials in all scenes in all engines as dirty to trigger new shader compilation
     * @param flag defines which part of the materials must be marked as dirty
     * @param predicate defines a predicate used to filter which materials should be affected
     */
    Engine.MarkAllMaterialsAsDirty = function (flag, predicate) {
        for (var engineIndex = 0; engineIndex < Engine.Instances.length; engineIndex++) {
            var engine = Engine.Instances[engineIndex];
            for (var sceneIndex = 0; sceneIndex < engine.scenes.length; sceneIndex++) {
                engine.scenes[sceneIndex].markAllMaterialsAsDirty(flag, predicate);
            }
        }
    };
    /**
     * Method called to create the default loading screen.
     * This can be overriden in your own app.
     * @param canvas The rendering canvas element
     * @returns The loading screen
     */
    Engine.DefaultLoadingScreenFactory = function (canvas) {
        throw _DevTools.WarnImport("LoadingScreen");
    };
    Object.defineProperty(Engine.prototype, "_supportsHardwareTextureRescaling", {
        get: function () {
            return !!Engine._RescalePostProcessFactory;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "performanceMonitor", {
        /**
         * Gets the performance monitor attached to this engine
         * @see https://doc.babylonjs.com/how_to/optimizing_your_scene#engineinstrumentation
         */
        get: function () {
            return this._performanceMonitor;
        },
        enumerable: false,
        configurable: true
    });
    // Events
    /**
     * Gets the HTML element used to attach event listeners
     * @returns a HTML element
     */
    Engine.prototype.getInputElement = function () {
        return this._renderingCanvas;
    };
    /**
     * Gets current aspect ratio
     * @param viewportOwner defines the camera to use to get the aspect ratio
     * @param useScreen defines if screen size must be used (or the current render target if any)
     * @returns a number defining the aspect ratio
     */
    Engine.prototype.getAspectRatio = function (viewportOwner, useScreen) {
        if (useScreen === void 0) { useScreen = false; }
        var viewport = viewportOwner.viewport;
        return (this.getRenderWidth(useScreen) * viewport.width) / (this.getRenderHeight(useScreen) * viewport.height);
    };
    /**
     * Gets current screen aspect ratio
     * @returns a number defining the aspect ratio
     */
    Engine.prototype.getScreenAspectRatio = function () {
        return (this.getRenderWidth(true)) / (this.getRenderHeight(true));
    };
    /**
     * Gets the client rect of the HTML canvas attached with the current webGL context
     * @returns a client rectanglee
     */
    Engine.prototype.getRenderingCanvasClientRect = function () {
        if (!this._renderingCanvas) {
            return null;
        }
        return this._renderingCanvas.getBoundingClientRect();
    };
    /**
     * Gets the client rect of the HTML element used for events
     * @returns a client rectanglee
     */
    Engine.prototype.getInputElementClientRect = function () {
        if (!this._renderingCanvas) {
            return null;
        }
        return this.getInputElement().getBoundingClientRect();
    };
    /**
     * Gets a boolean indicating that the engine is running in deterministic lock step mode
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     * @returns true if engine is in deterministic lock step mode
     */
    Engine.prototype.isDeterministicLockStep = function () {
        return this._deterministicLockstep;
    };
    /**
     * Gets the max steps when engine is running in deterministic lock step
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     * @returns the max steps
     */
    Engine.prototype.getLockstepMaxSteps = function () {
        return this._lockstepMaxSteps;
    };
    /**
     * Returns the time in ms between steps when using deterministic lock step.
     * @returns time step in (ms)
     */
    Engine.prototype.getTimeStep = function () {
        return this._timeStep * 1000;
    };
    /**
     * Force the mipmap generation for the given render target texture
     * @param texture defines the render target texture to use
     * @param unbind defines whether or not to unbind the texture after generation. Defaults to true.
     */
    Engine.prototype.generateMipMapsForCubemap = function (texture, unbind) {
        if (unbind === void 0) { unbind = true; }
        if (texture.generateMipMaps) {
            var gl = this._gl;
            this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            if (unbind) {
                this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
            }
        }
    };
    /** States */
    /**
     * Set various states to the webGL context
     * @param culling defines backface culling state
     * @param zOffset defines the value to apply to zOffset (0 by default)
     * @param force defines if states must be applied even if cache is up to date
     * @param reverseSide defines if culling must be reversed (CCW instead of CW and CW instead of CCW)
     */
    Engine.prototype.setState = function (culling, zOffset, force, reverseSide) {
        if (zOffset === void 0) { zOffset = 0; }
        if (reverseSide === void 0) { reverseSide = false; }
        // Culling
        if (this._depthCullingState.cull !== culling || force) {
            this._depthCullingState.cull = culling;
        }
        // Cull face
        var cullFace = this.cullBackFaces ? this._gl.BACK : this._gl.FRONT;
        if (this._depthCullingState.cullFace !== cullFace || force) {
            this._depthCullingState.cullFace = cullFace;
        }
        // Z offset
        this.setZOffset(zOffset);
        // Front face
        var frontFace = reverseSide ? this._gl.CW : this._gl.CCW;
        if (this._depthCullingState.frontFace !== frontFace || force) {
            this._depthCullingState.frontFace = frontFace;
        }
    };
    /**
     * Set the z offset to apply to current rendering
     * @param value defines the offset to apply
     */
    Engine.prototype.setZOffset = function (value) {
        this._depthCullingState.zOffset = value;
    };
    /**
     * Gets the current value of the zOffset
     * @returns the current zOffset state
     */
    Engine.prototype.getZOffset = function () {
        return this._depthCullingState.zOffset;
    };
    /**
     * Enable or disable depth buffering
     * @param enable defines the state to set
     */
    Engine.prototype.setDepthBuffer = function (enable) {
        this._depthCullingState.depthTest = enable;
    };
    /**
     * Gets a boolean indicating if depth writing is enabled
     * @returns the current depth writing state
     */
    Engine.prototype.getDepthWrite = function () {
        return this._depthCullingState.depthMask;
    };
    /**
     * Enable or disable depth writing
     * @param enable defines the state to set
     */
    Engine.prototype.setDepthWrite = function (enable) {
        this._depthCullingState.depthMask = enable;
    };
    /**
     * Gets a boolean indicating if stencil buffer is enabled
     * @returns the current stencil buffer state
     */
    Engine.prototype.getStencilBuffer = function () {
        return this._stencilState.stencilTest;
    };
    /**
     * Enable or disable the stencil buffer
     * @param enable defines if the stencil buffer must be enabled or disabled
     */
    Engine.prototype.setStencilBuffer = function (enable) {
        this._stencilState.stencilTest = enable;
    };
    /**
     * Gets the current stencil mask
     * @returns a number defining the new stencil mask to use
     */
    Engine.prototype.getStencilMask = function () {
        return this._stencilState.stencilMask;
    };
    /**
     * Sets the current stencil mask
     * @param mask defines the new stencil mask to use
     */
    Engine.prototype.setStencilMask = function (mask) {
        this._stencilState.stencilMask = mask;
    };
    /**
     * Gets the current stencil function
     * @returns a number defining the stencil function to use
     */
    Engine.prototype.getStencilFunction = function () {
        return this._stencilState.stencilFunc;
    };
    /**
     * Gets the current stencil reference value
     * @returns a number defining the stencil reference value to use
     */
    Engine.prototype.getStencilFunctionReference = function () {
        return this._stencilState.stencilFuncRef;
    };
    /**
     * Gets the current stencil mask
     * @returns a number defining the stencil mask to use
     */
    Engine.prototype.getStencilFunctionMask = function () {
        return this._stencilState.stencilFuncMask;
    };
    /**
     * Sets the current stencil function
     * @param stencilFunc defines the new stencil function to use
     */
    Engine.prototype.setStencilFunction = function (stencilFunc) {
        this._stencilState.stencilFunc = stencilFunc;
    };
    /**
     * Sets the current stencil reference
     * @param reference defines the new stencil reference to use
     */
    Engine.prototype.setStencilFunctionReference = function (reference) {
        this._stencilState.stencilFuncRef = reference;
    };
    /**
     * Sets the current stencil mask
     * @param mask defines the new stencil mask to use
     */
    Engine.prototype.setStencilFunctionMask = function (mask) {
        this._stencilState.stencilFuncMask = mask;
    };
    /**
     * Gets the current stencil operation when stencil fails
     * @returns a number defining stencil operation to use when stencil fails
     */
    Engine.prototype.getStencilOperationFail = function () {
        return this._stencilState.stencilOpStencilFail;
    };
    /**
     * Gets the current stencil operation when depth fails
     * @returns a number defining stencil operation to use when depth fails
     */
    Engine.prototype.getStencilOperationDepthFail = function () {
        return this._stencilState.stencilOpDepthFail;
    };
    /**
     * Gets the current stencil operation when stencil passes
     * @returns a number defining stencil operation to use when stencil passes
     */
    Engine.prototype.getStencilOperationPass = function () {
        return this._stencilState.stencilOpStencilDepthPass;
    };
    /**
     * Sets the stencil operation to use when stencil fails
     * @param operation defines the stencil operation to use when stencil fails
     */
    Engine.prototype.setStencilOperationFail = function (operation) {
        this._stencilState.stencilOpStencilFail = operation;
    };
    /**
     * Sets the stencil operation to use when depth fails
     * @param operation defines the stencil operation to use when depth fails
     */
    Engine.prototype.setStencilOperationDepthFail = function (operation) {
        this._stencilState.stencilOpDepthFail = operation;
    };
    /**
     * Sets the stencil operation to use when stencil passes
     * @param operation defines the stencil operation to use when stencil passes
     */
    Engine.prototype.setStencilOperationPass = function (operation) {
        this._stencilState.stencilOpStencilDepthPass = operation;
    };
    /**
     * Sets a boolean indicating if the dithering state is enabled or disabled
     * @param value defines the dithering state
     */
    Engine.prototype.setDitheringState = function (value) {
        if (value) {
            this._gl.enable(this._gl.DITHER);
        }
        else {
            this._gl.disable(this._gl.DITHER);
        }
    };
    /**
     * Sets a boolean indicating if the rasterizer state is enabled or disabled
     * @param value defines the rasterizer state
     */
    Engine.prototype.setRasterizerState = function (value) {
        if (value) {
            this._gl.disable(this._gl.RASTERIZER_DISCARD);
        }
        else {
            this._gl.enable(this._gl.RASTERIZER_DISCARD);
        }
    };
    /**
     * Gets the current depth function
     * @returns a number defining the depth function
     */
    Engine.prototype.getDepthFunction = function () {
        return this._depthCullingState.depthFunc;
    };
    /**
     * Sets the current depth function
     * @param depthFunc defines the function to use
     */
    Engine.prototype.setDepthFunction = function (depthFunc) {
        this._depthCullingState.depthFunc = depthFunc;
    };
    /**
     * Sets the current depth function to GREATER
     */
    Engine.prototype.setDepthFunctionToGreater = function () {
        this._depthCullingState.depthFunc = this._gl.GREATER;
    };
    /**
     * Sets the current depth function to GEQUAL
     */
    Engine.prototype.setDepthFunctionToGreaterOrEqual = function () {
        this._depthCullingState.depthFunc = this._gl.GEQUAL;
    };
    /**
     * Sets the current depth function to LESS
     */
    Engine.prototype.setDepthFunctionToLess = function () {
        this._depthCullingState.depthFunc = this._gl.LESS;
    };
    /**
     * Sets the current depth function to LEQUAL
     */
    Engine.prototype.setDepthFunctionToLessOrEqual = function () {
        this._depthCullingState.depthFunc = this._gl.LEQUAL;
    };
    /**
     * Caches the the state of the stencil buffer
     */
    Engine.prototype.cacheStencilState = function () {
        this._cachedStencilBuffer = this.getStencilBuffer();
        this._cachedStencilFunction = this.getStencilFunction();
        this._cachedStencilMask = this.getStencilMask();
        this._cachedStencilOperationPass = this.getStencilOperationPass();
        this._cachedStencilOperationFail = this.getStencilOperationFail();
        this._cachedStencilOperationDepthFail = this.getStencilOperationDepthFail();
        this._cachedStencilReference = this.getStencilFunctionReference();
    };
    /**
     * Restores the state of the stencil buffer
     */
    Engine.prototype.restoreStencilState = function () {
        this.setStencilFunction(this._cachedStencilFunction);
        this.setStencilMask(this._cachedStencilMask);
        this.setStencilBuffer(this._cachedStencilBuffer);
        this.setStencilOperationPass(this._cachedStencilOperationPass);
        this.setStencilOperationFail(this._cachedStencilOperationFail);
        this.setStencilOperationDepthFail(this._cachedStencilOperationDepthFail);
        this.setStencilFunctionReference(this._cachedStencilReference);
    };
    /**
     * Directly set the WebGL Viewport
     * @param x defines the x coordinate of the viewport (in screen space)
     * @param y defines the y coordinate of the viewport (in screen space)
     * @param width defines the width of the viewport (in screen space)
     * @param height defines the height of the viewport (in screen space)
     * @return the current viewport Object (if any) that is being replaced by this call. You can restore this viewport later on to go back to the original state
     */
    Engine.prototype.setDirectViewport = function (x, y, width, height) {
        var currentViewport = this._cachedViewport;
        this._cachedViewport = null;
        this._viewport(x, y, width, height);
        return currentViewport;
    };
    /**
     * Executes a scissor clear (ie. a clear on a specific portion of the screen)
     * @param x defines the x-coordinate of the top left corner of the clear rectangle
     * @param y defines the y-coordinate of the corner of the clear rectangle
     * @param width defines the width of the clear rectangle
     * @param height defines the height of the clear rectangle
     * @param clearColor defines the clear color
     */
    Engine.prototype.scissorClear = function (x, y, width, height, clearColor) {
        this.enableScissor(x, y, width, height);
        this.clear(clearColor, true, true, true);
        this.disableScissor();
    };
    /**
     * Enable scissor test on a specific rectangle (ie. render will only be executed on a specific portion of the screen)
     * @param x defines the x-coordinate of the top left corner of the clear rectangle
     * @param y defines the y-coordinate of the corner of the clear rectangle
     * @param width defines the width of the clear rectangle
     * @param height defines the height of the clear rectangle
     */
    Engine.prototype.enableScissor = function (x, y, width, height) {
        var gl = this._gl;
        // Change state
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(x, y, width, height);
    };
    /**
     * Disable previously set scissor test rectangle
     */
    Engine.prototype.disableScissor = function () {
        var gl = this._gl;
        gl.disable(gl.SCISSOR_TEST);
    };
    Engine.prototype._reportDrawCall = function () {
        this._drawCalls.addCount(1, false);
    };
    /**
     * Initializes a webVR display and starts listening to display change events
     * The onVRDisplayChangedObservable will be notified upon these changes
     * @returns The onVRDisplayChangedObservable
     */
    Engine.prototype.initWebVR = function () {
        throw _DevTools.WarnImport("WebVRCamera");
    };
    /** @hidden */
    Engine.prototype._prepareVRComponent = function () {
        // Do nothing as the engine side effect will overload it
    };
    /** @hidden */
    Engine.prototype._connectVREvents = function (canvas, document) {
        // Do nothing as the engine side effect will overload it
    };
    /** @hidden */
    Engine.prototype._submitVRFrame = function () {
        // Do nothing as the engine side effect will overload it
    };
    /**
     * Call this function to leave webVR mode
     * Will do nothing if webVR is not supported or if there is no webVR device
     * @see https://doc.babylonjs.com/how_to/webvr_camera
     */
    Engine.prototype.disableVR = function () {
        // Do nothing as the engine side effect will overload it
    };
    /**
     * Gets a boolean indicating that the system is in VR mode and is presenting
     * @returns true if VR mode is engaged
     */
    Engine.prototype.isVRPresenting = function () {
        return false;
    };
    /** @hidden */
    Engine.prototype._requestVRFrame = function () {
        // Do nothing as the engine side effect will overload it
    };
    /** @hidden */
    Engine.prototype._loadFileAsync = function (url, offlineProvider, useArrayBuffer) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._loadFile(url, function (data) {
                resolve(data);
            }, undefined, offlineProvider, useArrayBuffer, function (request, exception) {
                reject(exception);
            });
        });
    };
    /**
    * Gets the source code of the vertex shader associated with a specific webGL program
    * @param program defines the program to use
    * @returns a string containing the source code of the vertex shader associated with the program
    */
    Engine.prototype.getVertexShaderSource = function (program) {
        var shaders = this._gl.getAttachedShaders(program);
        if (!shaders) {
            return null;
        }
        return this._gl.getShaderSource(shaders[0]);
    };
    /**
     * Gets the source code of the fragment shader associated with a specific webGL program
     * @param program defines the program to use
     * @returns a string containing the source code of the fragment shader associated with the program
     */
    Engine.prototype.getFragmentShaderSource = function (program) {
        var shaders = this._gl.getAttachedShaders(program);
        if (!shaders) {
            return null;
        }
        return this._gl.getShaderSource(shaders[1]);
    };
    /**
     * Sets a depth stencil texture from a render target to the according uniform.
     * @param channel The texture channel
     * @param uniform The uniform to set
     * @param texture The render target texture containing the depth stencil texture to apply
     */
    Engine.prototype.setDepthStencilTexture = function (channel, uniform, texture) {
        if (channel === undefined) {
            return;
        }
        if (uniform) {
            this._boundUniforms[channel] = uniform;
        }
        if (!texture || !texture.depthStencilTexture) {
            this._setTexture(channel, null);
        }
        else {
            this._setTexture(channel, texture, false, true);
        }
    };
    /**
     * Sets a texture to the webGL context from a postprocess
     * @param channel defines the channel to use
     * @param postProcess defines the source postprocess
     */
    Engine.prototype.setTextureFromPostProcess = function (channel, postProcess) {
        this._bindTexture(channel, postProcess ? postProcess._textures.data[postProcess._currentRenderTextureInd] : null);
    };
    /**
     * Binds the output of the passed in post process to the texture channel specified
     * @param channel The channel the texture should be bound to
     * @param postProcess The post process which's output should be bound
     */
    Engine.prototype.setTextureFromPostProcessOutput = function (channel, postProcess) {
        this._bindTexture(channel, postProcess ? postProcess._outputTexture : null);
    };
    Engine.prototype._rebuildBuffers = function () {
        // Index / Vertex
        for (var _i = 0, _a = this.scenes; _i < _a.length; _i++) {
            var scene = _a[_i];
            scene.resetCachedMaterial();
            scene._rebuildGeometries();
            scene._rebuildTextures();
        }
        _super.prototype._rebuildBuffers.call(this);
    };
    /** @hidden */
    Engine.prototype._renderFrame = function () {
        for (var index = 0; index < this._activeRenderLoops.length; index++) {
            var renderFunction = this._activeRenderLoops[index];
            renderFunction();
        }
    };
    Engine.prototype._renderLoop = function () {
        if (!this._contextWasLost) {
            var shouldRender = true;
            if (!this.renderEvenInBackground && this._windowIsBackground) {
                shouldRender = false;
            }
            if (shouldRender) {
                // Start new frame
                this.beginFrame();
                // Child canvases
                if (!this._renderViews()) {
                    // Main frame
                    this._renderFrame();
                }
                // Present
                this.endFrame();
            }
        }
        if (this._activeRenderLoops.length > 0) {
            // Register new frame
            if (this.customAnimationFrameRequester) {
                this.customAnimationFrameRequester.requestID = this._queueNewFrame(this.customAnimationFrameRequester.renderFunction || this._boundRenderFunction, this.customAnimationFrameRequester);
                this._frameHandler = this.customAnimationFrameRequester.requestID;
            }
            else if (this.isVRPresenting()) {
                this._requestVRFrame();
            }
            else {
                this._frameHandler = this._queueNewFrame(this._boundRenderFunction, this.getHostWindow());
            }
        }
        else {
            this._renderingQueueLaunched = false;
        }
    };
    /** @hidden */
    Engine.prototype._renderViews = function () {
        return false;
    };
    /**
     * Toggle full screen mode
     * @param requestPointerLock defines if a pointer lock should be requested from the user
     */
    Engine.prototype.switchFullscreen = function (requestPointerLock) {
        if (this.isFullscreen) {
            this.exitFullscreen();
        }
        else {
            this.enterFullscreen(requestPointerLock);
        }
    };
    /**
     * Enters full screen mode
     * @param requestPointerLock defines if a pointer lock should be requested from the user
     */
    Engine.prototype.enterFullscreen = function (requestPointerLock) {
        if (!this.isFullscreen) {
            this._pointerLockRequested = requestPointerLock;
            if (this._renderingCanvas) {
                Engine._RequestFullscreen(this._renderingCanvas);
            }
        }
    };
    /**
     * Exits full screen mode
     */
    Engine.prototype.exitFullscreen = function () {
        if (this.isFullscreen) {
            Engine._ExitFullscreen();
        }
    };
    /**
     * Enters Pointerlock mode
     */
    Engine.prototype.enterPointerlock = function () {
        if (this._renderingCanvas) {
            Engine._RequestPointerlock(this._renderingCanvas);
        }
    };
    /**
     * Exits Pointerlock mode
     */
    Engine.prototype.exitPointerlock = function () {
        Engine._ExitPointerlock();
    };
    /**
     * Begin a new frame
     */
    Engine.prototype.beginFrame = function () {
        this._measureFps();
        this.onBeginFrameObservable.notifyObservers(this);
        _super.prototype.beginFrame.call(this);
    };
    /**
     * Enf the current frame
     */
    Engine.prototype.endFrame = function () {
        _super.prototype.endFrame.call(this);
        this._submitVRFrame();
        this.onEndFrameObservable.notifyObservers(this);
    };
    Engine.prototype.resize = function () {
        // We're not resizing the size of the canvas while in VR mode & presenting
        if (this.isVRPresenting()) {
            return;
        }
        _super.prototype.resize.call(this);
    };
    /**
     * Force a specific size of the canvas
     * @param width defines the new canvas' width
     * @param height defines the new canvas' height
     * @returns true if the size was changed
     */
    Engine.prototype.setSize = function (width, height) {
        if (!this._renderingCanvas) {
            return false;
        }
        if (!_super.prototype.setSize.call(this, width, height)) {
            return false;
        }
        if (this.scenes) {
            for (var index = 0; index < this.scenes.length; index++) {
                var scene = this.scenes[index];
                for (var camIndex = 0; camIndex < scene.cameras.length; camIndex++) {
                    var cam = scene.cameras[camIndex];
                    cam._currentRenderId = 0;
                }
            }
            if (this.onResizeObservable.hasObservers()) {
                this.onResizeObservable.notifyObservers(this);
            }
        }
        return true;
    };
    Engine.prototype._deletePipelineContext = function (pipelineContext) {
        var webGLPipelineContext = pipelineContext;
        if (webGLPipelineContext && webGLPipelineContext.program) {
            if (webGLPipelineContext.transformFeedback) {
                this.deleteTransformFeedback(webGLPipelineContext.transformFeedback);
                webGLPipelineContext.transformFeedback = null;
            }
        }
        _super.prototype._deletePipelineContext.call(this, pipelineContext);
    };
    Engine.prototype.createShaderProgram = function (pipelineContext, vertexCode, fragmentCode, defines, context, transformFeedbackVaryings) {
        if (transformFeedbackVaryings === void 0) { transformFeedbackVaryings = null; }
        context = context || this._gl;
        this.onBeforeShaderCompilationObservable.notifyObservers(this);
        var program = _super.prototype.createShaderProgram.call(this, pipelineContext, vertexCode, fragmentCode, defines, context, transformFeedbackVaryings);
        this.onAfterShaderCompilationObservable.notifyObservers(this);
        return program;
    };
    Engine.prototype._createShaderProgram = function (pipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings) {
        if (transformFeedbackVaryings === void 0) { transformFeedbackVaryings = null; }
        var shaderProgram = context.createProgram();
        pipelineContext.program = shaderProgram;
        if (!shaderProgram) {
            throw new Error("Unable to create program");
        }
        context.attachShader(shaderProgram, vertexShader);
        context.attachShader(shaderProgram, fragmentShader);
        if (this.webGLVersion > 1 && transformFeedbackVaryings) {
            var transformFeedback = this.createTransformFeedback();
            this.bindTransformFeedback(transformFeedback);
            this.setTranformFeedbackVaryings(shaderProgram, transformFeedbackVaryings);
            pipelineContext.transformFeedback = transformFeedback;
        }
        context.linkProgram(shaderProgram);
        if (this.webGLVersion > 1 && transformFeedbackVaryings) {
            this.bindTransformFeedback(null);
        }
        pipelineContext.context = context;
        pipelineContext.vertexShader = vertexShader;
        pipelineContext.fragmentShader = fragmentShader;
        if (!pipelineContext.isParallelCompiled) {
            this._finalizePipelineContext(pipelineContext);
        }
        return shaderProgram;
    };
    Engine.prototype._releaseTexture = function (texture) {
        _super.prototype._releaseTexture.call(this, texture);
        // Set output texture of post process to null if the texture has been released/disposed
        this.scenes.forEach(function (scene) {
            scene.postProcesses.forEach(function (postProcess) {
                if (postProcess._outputTexture == texture) {
                    postProcess._outputTexture = null;
                }
            });
            scene.cameras.forEach(function (camera) {
                camera._postProcesses.forEach(function (postProcess) {
                    if (postProcess) {
                        if (postProcess._outputTexture == texture) {
                            postProcess._outputTexture = null;
                        }
                    }
                });
            });
        });
    };
    /**
     * @hidden
     * Rescales a texture
     * @param source input texutre
     * @param destination destination texture
     * @param scene scene to use to render the resize
     * @param internalFormat format to use when resizing
     * @param onComplete callback to be called when resize has completed
     */
    Engine.prototype._rescaleTexture = function (source, destination, scene, internalFormat, onComplete) {
        var _this = this;
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
        var rtt = this.createRenderTargetTexture({
            width: destination.width,
            height: destination.height,
        }, {
            generateMipMaps: false,
            type: 0,
            samplingMode: 2,
            generateDepthBuffer: false,
            generateStencilBuffer: false
        });
        if (!this._rescalePostProcess && Engine._RescalePostProcessFactory) {
            this._rescalePostProcess = Engine._RescalePostProcessFactory(this);
        }
        this._rescalePostProcess.getEffect().executeWhenCompiled(function () {
            _this._rescalePostProcess.onApply = function (effect) {
                effect._bindTexture("textureSampler", source);
            };
            var hostingScene = scene;
            if (!hostingScene) {
                hostingScene = _this.scenes[_this.scenes.length - 1];
            }
            hostingScene.postProcessManager.directRender([_this._rescalePostProcess], rtt, true);
            _this._bindTextureDirectly(_this._gl.TEXTURE_2D, destination, true);
            _this._gl.copyTexImage2D(_this._gl.TEXTURE_2D, 0, internalFormat, 0, 0, destination.width, destination.height, 0);
            _this.unBindFramebuffer(rtt);
            _this._releaseTexture(rtt);
            if (onComplete) {
                onComplete();
            }
        });
    };
    // FPS
    /**
     * Gets the current framerate
     * @returns a number representing the framerate
     */
    Engine.prototype.getFps = function () {
        return this._fps;
    };
    /**
     * Gets the time spent between current and previous frame
     * @returns a number representing the delta time in ms
     */
    Engine.prototype.getDeltaTime = function () {
        return this._deltaTime;
    };
    Engine.prototype._measureFps = function () {
        this._performanceMonitor.sampleFrame();
        this._fps = this._performanceMonitor.averageFPS;
        this._deltaTime = this._performanceMonitor.instantaneousFrameTime || 0;
    };
    /** @hidden */
    Engine.prototype._uploadImageToTexture = function (texture, image, faceIndex, lod) {
        if (faceIndex === void 0) { faceIndex = 0; }
        if (lod === void 0) { lod = 0; }
        var gl = this._gl;
        var textureType = this._getWebGLTextureType(texture.type);
        var format = this._getInternalFormat(texture.format);
        var internalFormat = this._getRGBABufferInternalSizedFormat(texture.type, format);
        var bindTarget = texture.isCube ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D;
        this._bindTextureDirectly(bindTarget, texture, true);
        this._unpackFlipY(texture.invertY);
        var target = gl.TEXTURE_2D;
        if (texture.isCube) {
            target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex;
        }
        gl.texImage2D(target, lod, internalFormat, format, textureType, image);
        this._bindTextureDirectly(bindTarget, null, true);
    };
    /**
     * Updates the sample count of a render target texture
     * @see https://doc.babylonjs.com/features/webgl2#multisample-render-targets
     * @param texture defines the texture to update
     * @param samples defines the sample count to set
     * @returns the effective sample count (could be 0 if multisample render targets are not supported)
     */
    Engine.prototype.updateRenderTargetTextureSampleCount = function (texture, samples) {
        if (this.webGLVersion < 2 || !texture) {
            return 1;
        }
        if (texture.samples === samples) {
            return samples;
        }
        var gl = this._gl;
        samples = Math.min(samples, this.getCaps().maxMSAASamples);
        // Dispose previous render buffers
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
        if (samples > 1 && gl.renderbufferStorageMultisample) {
            var framebuffer = gl.createFramebuffer();
            if (!framebuffer) {
                throw new Error("Unable to create multi sampled framebuffer");
            }
            texture._MSAAFramebuffer = framebuffer;
            this._bindUnboundFramebuffer(texture._MSAAFramebuffer);
            var colorRenderbuffer = gl.createRenderbuffer();
            if (!colorRenderbuffer) {
                throw new Error("Unable to create multi sampled framebuffer");
            }
            gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderbuffer);
            gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, this._getRGBAMultiSampleBufferFormat(texture.type), texture.width, texture.height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorRenderbuffer);
            texture._MSAARenderBuffer = colorRenderbuffer;
        }
        else {
            this._bindUnboundFramebuffer(texture._framebuffer);
        }
        texture.samples = samples;
        texture._depthStencilBuffer = this._setupFramebufferDepthAttachments(texture._generateStencilBuffer, texture._generateDepthBuffer, texture.width, texture.height, samples);
        this._bindUnboundFramebuffer(null);
        return samples;
    };
    /**
     * Updates a depth texture Comparison Mode and Function.
     * If the comparison Function is equal to 0, the mode will be set to none.
     * Otherwise, this only works in webgl 2 and requires a shadow sampler in the shader.
     * @param texture The texture to set the comparison function for
     * @param comparisonFunction The comparison function to set, 0 if no comparison required
     */
    Engine.prototype.updateTextureComparisonFunction = function (texture, comparisonFunction) {
        if (this.webGLVersion === 1) {
            Logger.Error("WebGL 1 does not support texture comparison.");
            return;
        }
        var gl = this._gl;
        if (texture.isCube) {
            this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, texture, true);
            if (comparisonFunction === 0) {
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_COMPARE_FUNC, 515);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_COMPARE_MODE, gl.NONE);
            }
            else {
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_COMPARE_FUNC, comparisonFunction);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
        }
        else {
            this._bindTextureDirectly(this._gl.TEXTURE_2D, texture, true);
            if (comparisonFunction === 0) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, 515);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, comparisonFunction);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
        }
        texture._comparisonFunction = comparisonFunction;
    };
    /**
     * Creates a webGL buffer to use with instanciation
     * @param capacity defines the size of the buffer
     * @returns the webGL buffer
     */
    Engine.prototype.createInstancesBuffer = function (capacity) {
        var buffer = this._gl.createBuffer();
        if (!buffer) {
            throw new Error("Unable to create instance buffer");
        }
        var result = new WebGLDataBuffer(buffer);
        result.capacity = capacity;
        this.bindArrayBuffer(result);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, capacity, this._gl.DYNAMIC_DRAW);
        return result;
    };
    /**
     * Delete a webGL buffer used with instanciation
     * @param buffer defines the webGL buffer to delete
     */
    Engine.prototype.deleteInstancesBuffer = function (buffer) {
        this._gl.deleteBuffer(buffer);
    };
    Engine.prototype._clientWaitAsync = function (sync, flags, interval_ms) {
        if (flags === void 0) { flags = 0; }
        if (interval_ms === void 0) { interval_ms = 10; }
        var gl = this._gl;
        return new Promise(function (resolve, reject) {
            var check = function () {
                var res = gl.clientWaitSync(sync, flags, 0);
                if (res == gl.WAIT_FAILED) {
                    reject();
                    return;
                }
                if (res == gl.TIMEOUT_EXPIRED) {
                    setTimeout(check, interval_ms);
                    return;
                }
                resolve();
            };
            check();
        });
    };
    /** @hidden */
    Engine.prototype._readPixelsAsync = function (x, y, w, h, format, type, outputBuffer) {
        if (this._webGLVersion < 2) {
            throw new Error("_readPixelsAsync only work on WebGL2+");
        }
        var gl = this._gl;
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buf);
        gl.bufferData(gl.PIXEL_PACK_BUFFER, outputBuffer.byteLength, gl.STREAM_READ);
        gl.readPixels(x, y, w, h, format, type, 0);
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
        var sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (!sync) {
            return null;
        }
        gl.flush();
        return this._clientWaitAsync(sync, 0, 10).then(function () {
            gl.deleteSync(sync);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buf);
            gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, outputBuffer);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
            gl.deleteBuffer(buf);
            return outputBuffer;
        });
    };
    Engine.prototype.dispose = function () {
        this.hideLoadingUI();
        this.onNewSceneAddedObservable.clear();
        // Release postProcesses
        while (this.postProcesses.length) {
            this.postProcesses[0].dispose();
        }
        // Rescale PP
        if (this._rescalePostProcess) {
            this._rescalePostProcess.dispose();
        }
        // Release scenes
        while (this.scenes.length) {
            this.scenes[0].dispose();
        }
        // Release audio engine
        if (Engine.Instances.length === 1 && Engine.audioEngine) {
            Engine.audioEngine.dispose();
        }
        //WebVR
        this.disableVR();
        // Events
        if (DomManagement.IsWindowObjectExist()) {
            window.removeEventListener("blur", this._onBlur);
            window.removeEventListener("focus", this._onFocus);
            if (this._renderingCanvas) {
                this._renderingCanvas.removeEventListener("focus", this._onCanvasFocus);
                this._renderingCanvas.removeEventListener("blur", this._onCanvasBlur);
                this._renderingCanvas.removeEventListener("pointerout", this._onCanvasPointerOut);
            }
            if (DomManagement.IsDocumentAvailable()) {
                document.removeEventListener("fullscreenchange", this._onFullscreenChange);
                document.removeEventListener("mozfullscreenchange", this._onFullscreenChange);
                document.removeEventListener("webkitfullscreenchange", this._onFullscreenChange);
                document.removeEventListener("msfullscreenchange", this._onFullscreenChange);
                document.removeEventListener("pointerlockchange", this._onPointerLockChange);
                document.removeEventListener("mspointerlockchange", this._onPointerLockChange);
                document.removeEventListener("mozpointerlockchange", this._onPointerLockChange);
                document.removeEventListener("webkitpointerlockchange", this._onPointerLockChange);
            }
        }
        _super.prototype.dispose.call(this);
        // Remove from Instances
        var index = Engine.Instances.indexOf(this);
        if (index >= 0) {
            Engine.Instances.splice(index, 1);
        }
        // Observables
        this.onResizeObservable.clear();
        this.onCanvasBlurObservable.clear();
        this.onCanvasFocusObservable.clear();
        this.onCanvasPointerOutObservable.clear();
        this.onBeginFrameObservable.clear();
        this.onEndFrameObservable.clear();
    };
    Engine.prototype._disableTouchAction = function () {
        if (!this._renderingCanvas || !this._renderingCanvas.setAttribute) {
            return;
        }
        this._renderingCanvas.setAttribute("touch-action", "none");
        this._renderingCanvas.style.touchAction = "none";
        this._renderingCanvas.style.msTouchAction = "none";
    };
    // Loading screen
    /**
     * Display the loading screen
     * @see https://doc.babylonjs.com/how_to/creating_a_custom_loading_screen
     */
    Engine.prototype.displayLoadingUI = function () {
        if (!DomManagement.IsWindowObjectExist()) {
            return;
        }
        var loadingScreen = this.loadingScreen;
        if (loadingScreen) {
            loadingScreen.displayLoadingUI();
        }
    };
    /**
     * Hide the loading screen
     * @see https://doc.babylonjs.com/how_to/creating_a_custom_loading_screen
     */
    Engine.prototype.hideLoadingUI = function () {
        if (!DomManagement.IsWindowObjectExist()) {
            return;
        }
        var loadingScreen = this._loadingScreen;
        if (loadingScreen) {
            loadingScreen.hideLoadingUI();
        }
    };
    Object.defineProperty(Engine.prototype, "loadingScreen", {
        /**
         * Gets the current loading screen object
         * @see https://doc.babylonjs.com/how_to/creating_a_custom_loading_screen
         */
        get: function () {
            if (!this._loadingScreen && this._renderingCanvas) {
                this._loadingScreen = Engine.DefaultLoadingScreenFactory(this._renderingCanvas);
            }
            return this._loadingScreen;
        },
        /**
         * Sets the current loading screen object
         * @see https://doc.babylonjs.com/how_to/creating_a_custom_loading_screen
         */
        set: function (loadingScreen) {
            this._loadingScreen = loadingScreen;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "loadingUIText", {
        /**
         * Sets the current loading screen text
         * @see https://doc.babylonjs.com/how_to/creating_a_custom_loading_screen
         */
        set: function (text) {
            this.loadingScreen.loadingUIText = text;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "loadingUIBackgroundColor", {
        /**
         * Sets the current loading screen background color
         * @see https://doc.babylonjs.com/how_to/creating_a_custom_loading_screen
         */
        set: function (color) {
            this.loadingScreen.loadingUIBackgroundColor = color;
        },
        enumerable: false,
        configurable: true
    });
    /** Pointerlock and fullscreen */
    /**
     * Ask the browser to promote the current element to pointerlock mode
     * @param element defines the DOM element to promote
     */
    Engine._RequestPointerlock = function (element) {
        element.requestPointerLock = element.requestPointerLock || element.msRequestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if (element.requestPointerLock) {
            element.requestPointerLock();
        }
    };
    /**
     * Asks the browser to exit pointerlock mode
     */
    Engine._ExitPointerlock = function () {
        var anyDoc = document;
        document.exitPointerLock = document.exitPointerLock || anyDoc.msExitPointerLock || anyDoc.mozExitPointerLock || anyDoc.webkitExitPointerLock;
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }
    };
    /**
     * Ask the browser to promote the current element to fullscreen rendering mode
     * @param element defines the DOM element to promote
     */
    Engine._RequestFullscreen = function (element) {
        var requestFunction = element.requestFullscreen || element.msRequestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullScreen;
        if (!requestFunction) {
            return;
        }
        requestFunction.call(element);
    };
    /**
     * Asks the browser to exit fullscreen mode
     */
    Engine._ExitFullscreen = function () {
        var anyDoc = document;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (anyDoc.mozCancelFullScreen) {
            anyDoc.mozCancelFullScreen();
        }
        else if (anyDoc.webkitCancelFullScreen) {
            anyDoc.webkitCancelFullScreen();
        }
        else if (anyDoc.msCancelFullScreen) {
            anyDoc.msCancelFullScreen();
        }
    };
    // Const statics
    /** Defines that alpha blending is disabled */
    Engine.ALPHA_DISABLE = 0;
    /** Defines that alpha blending to SRC ALPHA * SRC + DEST */
    Engine.ALPHA_ADD = 1;
    /** Defines that alpha blending to SRC ALPHA * SRC + (1 - SRC ALPHA) * DEST */
    Engine.ALPHA_COMBINE = 2;
    /** Defines that alpha blending to DEST - SRC * DEST */
    Engine.ALPHA_SUBTRACT = 3;
    /** Defines that alpha blending to SRC * DEST */
    Engine.ALPHA_MULTIPLY = 4;
    /** Defines that alpha blending to SRC ALPHA * SRC + (1 - SRC) * DEST */
    Engine.ALPHA_MAXIMIZED = 5;
    /** Defines that alpha blending to SRC + DEST */
    Engine.ALPHA_ONEONE = 6;
    /** Defines that alpha blending to SRC + (1 - SRC ALPHA) * DEST */
    Engine.ALPHA_PREMULTIPLIED = 7;
    /**
     * Defines that alpha blending to SRC + (1 - SRC ALPHA) * DEST
     * Alpha will be set to (1 - SRC ALPHA) * DEST ALPHA
     */
    Engine.ALPHA_PREMULTIPLIED_PORTERDUFF = 8;
    /** Defines that alpha blending to CST * SRC + (1 - CST) * DEST */
    Engine.ALPHA_INTERPOLATE = 9;
    /**
     * Defines that alpha blending to SRC + (1 - SRC) * DEST
     * Alpha will be set to SRC ALPHA + (1 - SRC ALPHA) * DEST ALPHA
     */
    Engine.ALPHA_SCREENMODE = 10;
    /** Defines that the ressource is not delayed*/
    Engine.DELAYLOADSTATE_NONE = 0;
    /** Defines that the ressource was successfully delay loaded */
    Engine.DELAYLOADSTATE_LOADED = 1;
    /** Defines that the ressource is currently delay loading */
    Engine.DELAYLOADSTATE_LOADING = 2;
    /** Defines that the ressource is delayed and has not started loading */
    Engine.DELAYLOADSTATE_NOTLOADED = 4;
    // Depht or Stencil test Constants.
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn */
    Engine.NEVER = 512;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn */
    Engine.ALWAYS = 519;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value */
    Engine.LESS = 513;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value */
    Engine.EQUAL = 514;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value */
    Engine.LEQUAL = 515;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value */
    Engine.GREATER = 516;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value */
    Engine.GEQUAL = 518;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value */
    Engine.NOTEQUAL = 517;
    // Stencil Actions Constants.
    /** Passed to stencilOperation to specify that stencil value must be kept */
    Engine.KEEP = 7680;
    /** Passed to stencilOperation to specify that stencil value must be replaced */
    Engine.REPLACE = 7681;
    /** Passed to stencilOperation to specify that stencil value must be incremented */
    Engine.INCR = 7682;
    /** Passed to stencilOperation to specify that stencil value must be decremented */
    Engine.DECR = 7683;
    /** Passed to stencilOperation to specify that stencil value must be inverted */
    Engine.INVERT = 5386;
    /** Passed to stencilOperation to specify that stencil value must be incremented with wrapping */
    Engine.INCR_WRAP = 34055;
    /** Passed to stencilOperation to specify that stencil value must be decremented with wrapping */
    Engine.DECR_WRAP = 34056;
    /** Texture is not repeating outside of 0..1 UVs */
    Engine.TEXTURE_CLAMP_ADDRESSMODE = 0;
    /** Texture is repeating outside of 0..1 UVs */
    Engine.TEXTURE_WRAP_ADDRESSMODE = 1;
    /** Texture is repeating and mirrored */
    Engine.TEXTURE_MIRROR_ADDRESSMODE = 2;
    /** ALPHA */
    Engine.TEXTUREFORMAT_ALPHA = 0;
    /** LUMINANCE */
    Engine.TEXTUREFORMAT_LUMINANCE = 1;
    /** LUMINANCE_ALPHA */
    Engine.TEXTUREFORMAT_LUMINANCE_ALPHA = 2;
    /** RGB */
    Engine.TEXTUREFORMAT_RGB = 4;
    /** RGBA */
    Engine.TEXTUREFORMAT_RGBA = 5;
    /** RED */
    Engine.TEXTUREFORMAT_RED = 6;
    /** RED (2nd reference) */
    Engine.TEXTUREFORMAT_R = 6;
    /** RG */
    Engine.TEXTUREFORMAT_RG = 7;
    /** RED_INTEGER */
    Engine.TEXTUREFORMAT_RED_INTEGER = 8;
    /** RED_INTEGER (2nd reference) */
    Engine.TEXTUREFORMAT_R_INTEGER = 8;
    /** RG_INTEGER */
    Engine.TEXTUREFORMAT_RG_INTEGER = 9;
    /** RGB_INTEGER */
    Engine.TEXTUREFORMAT_RGB_INTEGER = 10;
    /** RGBA_INTEGER */
    Engine.TEXTUREFORMAT_RGBA_INTEGER = 11;
    /** UNSIGNED_BYTE */
    Engine.TEXTURETYPE_UNSIGNED_BYTE = 0;
    /** UNSIGNED_BYTE (2nd reference) */
    Engine.TEXTURETYPE_UNSIGNED_INT = 0;
    /** FLOAT */
    Engine.TEXTURETYPE_FLOAT = 1;
    /** HALF_FLOAT */
    Engine.TEXTURETYPE_HALF_FLOAT = 2;
    /** BYTE */
    Engine.TEXTURETYPE_BYTE = 3;
    /** SHORT */
    Engine.TEXTURETYPE_SHORT = 4;
    /** UNSIGNED_SHORT */
    Engine.TEXTURETYPE_UNSIGNED_SHORT = 5;
    /** INT */
    Engine.TEXTURETYPE_INT = 6;
    /** UNSIGNED_INT */
    Engine.TEXTURETYPE_UNSIGNED_INTEGER = 7;
    /** UNSIGNED_SHORT_4_4_4_4 */
    Engine.TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4 = 8;
    /** UNSIGNED_SHORT_5_5_5_1 */
    Engine.TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1 = 9;
    /** UNSIGNED_SHORT_5_6_5 */
    Engine.TEXTURETYPE_UNSIGNED_SHORT_5_6_5 = 10;
    /** UNSIGNED_INT_2_10_10_10_REV */
    Engine.TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV = 11;
    /** UNSIGNED_INT_24_8 */
    Engine.TEXTURETYPE_UNSIGNED_INT_24_8 = 12;
    /** UNSIGNED_INT_10F_11F_11F_REV */
    Engine.TEXTURETYPE_UNSIGNED_INT_10F_11F_11F_REV = 13;
    /** UNSIGNED_INT_5_9_9_9_REV */
    Engine.TEXTURETYPE_UNSIGNED_INT_5_9_9_9_REV = 14;
    /** FLOAT_32_UNSIGNED_INT_24_8_REV */
    Engine.TEXTURETYPE_FLOAT_32_UNSIGNED_INT_24_8_REV = 15;
    /** nearest is mag = nearest and min = nearest and mip = linear */
    Engine.TEXTURE_NEAREST_SAMPLINGMODE = 1;
    /** Bilinear is mag = linear and min = linear and mip = nearest */
    Engine.TEXTURE_BILINEAR_SAMPLINGMODE = 2;
    /** Trilinear is mag = linear and min = linear and mip = linear */
    Engine.TEXTURE_TRILINEAR_SAMPLINGMODE = 3;
    /** nearest is mag = nearest and min = nearest and mip = linear */
    Engine.TEXTURE_NEAREST_NEAREST_MIPLINEAR = 8;
    /** Bilinear is mag = linear and min = linear and mip = nearest */
    Engine.TEXTURE_LINEAR_LINEAR_MIPNEAREST = 11;
    /** Trilinear is mag = linear and min = linear and mip = linear */
    Engine.TEXTURE_LINEAR_LINEAR_MIPLINEAR = 3;
    /** mag = nearest and min = nearest and mip = nearest */
    Engine.TEXTURE_NEAREST_NEAREST_MIPNEAREST = 4;
    /** mag = nearest and min = linear and mip = nearest */
    Engine.TEXTURE_NEAREST_LINEAR_MIPNEAREST = 5;
    /** mag = nearest and min = linear and mip = linear */
    Engine.TEXTURE_NEAREST_LINEAR_MIPLINEAR = 6;
    /** mag = nearest and min = linear and mip = none */
    Engine.TEXTURE_NEAREST_LINEAR = 7;
    /** mag = nearest and min = nearest and mip = none */
    Engine.TEXTURE_NEAREST_NEAREST = 1;
    /** mag = linear and min = nearest and mip = nearest */
    Engine.TEXTURE_LINEAR_NEAREST_MIPNEAREST = 9;
    /** mag = linear and min = nearest and mip = linear */
    Engine.TEXTURE_LINEAR_NEAREST_MIPLINEAR = 10;
    /** mag = linear and min = linear and mip = none */
    Engine.TEXTURE_LINEAR_LINEAR = 2;
    /** mag = linear and min = nearest and mip = none */
    Engine.TEXTURE_LINEAR_NEAREST = 12;
    /** Explicit coordinates mode */
    Engine.TEXTURE_EXPLICIT_MODE = 0;
    /** Spherical coordinates mode */
    Engine.TEXTURE_SPHERICAL_MODE = 1;
    /** Planar coordinates mode */
    Engine.TEXTURE_PLANAR_MODE = 2;
    /** Cubic coordinates mode */
    Engine.TEXTURE_CUBIC_MODE = 3;
    /** Projection coordinates mode */
    Engine.TEXTURE_PROJECTION_MODE = 4;
    /** Skybox coordinates mode */
    Engine.TEXTURE_SKYBOX_MODE = 5;
    /** Inverse Cubic coordinates mode */
    Engine.TEXTURE_INVCUBIC_MODE = 6;
    /** Equirectangular coordinates mode */
    Engine.TEXTURE_EQUIRECTANGULAR_MODE = 7;
    /** Equirectangular Fixed coordinates mode */
    Engine.TEXTURE_FIXED_EQUIRECTANGULAR_MODE = 8;
    /** Equirectangular Fixed Mirrored coordinates mode */
    Engine.TEXTURE_FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9;
    // Texture rescaling mode
    /** Defines that texture rescaling will use a floor to find the closer power of 2 size */
    Engine.SCALEMODE_FLOOR = 1;
    /** Defines that texture rescaling will look for the nearest power of 2 size */
    Engine.SCALEMODE_NEAREST = 2;
    /** Defines that texture rescaling will use a ceil to find the closer power of 2 size */
    Engine.SCALEMODE_CEILING = 3;
    /**
     * Method called to create the default rescale post process on each engine.
     */
    Engine._RescalePostProcessFactory = null;
    return Engine;
}(ThinEngine));

export { Engine as E, PrecisionDate as P, RollingAverage as R, PerfCounter as a, PerformanceMonitor as b };
