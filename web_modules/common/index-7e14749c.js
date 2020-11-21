import { L as Logger, b as _DevTools, O as Observable, _ as __extends, a as __decorate, f as Effect, d as __assign, e as InternalTextureSource, S as StringTools } from './thinEngine-e576a091.js';
import { N as Node, a as serialize, S as SerializationHelper, g as expandToProperty, d as serializeAsTexture, f as serializeAsColor3, k as serializeAsVector2, m as serializeAsImageProcessingConfiguration } from './node-87d9c658.js';
import { V as Vector3, T as TmpVectors, M as Matrix, b as Color3, a as Vector2, S as Scalar, c as TmpColors, d as Vector4, _ as _TypeStore, C as Color4, Q as Quaternion } from './math.color-fc6e801e.js';
import { E as Engine } from './engine-9a1b5aa7.js';
import { S as SmartArray, C as Camera } from './pointerEvents-12a2451c.js';
import { T as Tools } from './tools-ab6f1dea.js';
import { L as LoadFileError } from './guid-495ff9c7.js';
import { F as FreeCamera } from './freeCamera-0ab51e1e.js';
import { M as MaterialDefines, I as ImageProcessingConfiguration, S as Scene } from './scene-cbeb8ae2.js';
import { V as VertexBuffer, M as Material, b as VertexData, A as AbstractMesh, a as SubMesh, T as TransformNode, c as Buffer, B as BoundingInfo } from './sceneComponent-5502b64a.js';
import { L as Light } from './light-a23926e9.js';
import { H as HemisphericLight } from './hemisphericLight-6768187f.js';
import { a as ShadowLight, S as SpotLight } from './spotLight-edd9cb8c.js';
import { T as Texture } from './texture-6b1db4fe.js';
import { M as Mesh, a as MultiMaterial, G as Geometry } from './mesh-cfdd36e7.js';
import { C as CubeTexture, A as AssetContainer, S as SceneLoader, a as Skeleton, c as Animation, B as Bone, M as MorphTargetManager, i as MorphTarget, b as AnimationGroup, f as AnimationKeyInterpolation } from './morphTargetManager-a4c1f2f4.js';
import { a as SphericalHarmonics, S as SphericalPolynomial } from './baseTexture.polynomial-54f1194f.js';
import { P as PostProcess } from './postProcess-3bcb67b3.js';
import './helperFunctions-f4fc40e0.js';
import { M as MaterialHelper, E as EffectFallbacks } from './bonesVertex-5b94878d.js';
import { S as ShaderMaterial } from './shaderMaterial-58d230f5.js';
import './clipPlaneVertex-e6809877.js';
import { R as RenderTargetTexture } from './renderTargetTexture-514b606c.js';
import { E as EnvironmentTextureTools } from './environmentTextureTools-35b27683.js';
import { M as MaterialFlags, D as DetailMapConfiguration, b as PrePassConfiguration, P as PushMaterial, S as StandardMaterial } from './standardMaterial-140834d9.js';
import './morphTargetsVertex-924a5383.js';

/**
 * Composed of a frame, and an action function
 */
var AnimationEvent = /** @class */ (function () {
    /**
     * Initializes the animation event
     * @param frame The frame for which the event is triggered
     * @param action The event to perform when triggered
     * @param onlyOnce Specifies if the event should be triggered only once
     */
    function AnimationEvent(
    /** The frame for which the event is triggered **/
    frame, 
    /** The event to perform when triggered **/
    action, 
    /** Specifies if the event should be triggered only once**/
    onlyOnce) {
        this.frame = frame;
        this.action = action;
        this.onlyOnce = onlyOnce;
        /**
         * Specifies if the animation event is done
         */
        this.isDone = false;
    }
    /** @hidden */
    AnimationEvent.prototype._clone = function () {
        return new AnimationEvent(this.frame, this.action, this.onlyOnce);
    };
    return AnimationEvent;
}());

/**
 * Defines a sound that can be played in the application.
 * The sound can either be an ambient track or a simple sound played in reaction to a user action.
 * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music
 */
var Sound = /** @class */ (function () {
    /**
     * Create a sound and attach it to a scene
     * @param name Name of your sound
     * @param urlOrArrayBuffer Url to the sound to load async or ArrayBuffer, it also works with MediaStreams
     * @param scene defines the scene the sound belongs to
     * @param readyToPlayCallback Provide a callback function if you'd like to load your code once the sound is ready to be played
     * @param options Objects to provide with the current available options: autoplay, loop, volume, spatialSound, maxDistance, rolloffFactor, refDistance, distanceModel, panningModel, streaming
     */
    function Sound(name, urlOrArrayBuffer, scene, readyToPlayCallback, options) {
        var _this = this;
        if (readyToPlayCallback === void 0) { readyToPlayCallback = null; }
        var _a, _b, _c, _d;
        /**
         * Does the sound autoplay once loaded.
         */
        this.autoplay = false;
        /**
         * Does the sound loop after it finishes playing once.
         */
        this.loop = false;
        /**
         * Does the sound use a custom attenuation curve to simulate the falloff
         * happening when the source gets further away from the camera.
         * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#creating-your-own-custom-attenuation-function
         */
        this.useCustomAttenuation = false;
        /**
         * Is this sound currently played.
         */
        this.isPlaying = false;
        /**
         * Is this sound currently paused.
         */
        this.isPaused = false;
        /**
         * Does this sound enables spatial sound.
         * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#creating-a-spatial-3d-sound
         */
        this.spatialSound = false;
        /**
         * Define the reference distance the sound should be heard perfectly.
         * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#creating-a-spatial-3d-sound
         */
        this.refDistance = 1;
        /**
         * Define the roll off factor of spatial sounds.
         * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#creating-a-spatial-3d-sound
         */
        this.rolloffFactor = 1;
        /**
         * Define the max distance the sound should be heard (intensity just became 0 at this point).
         * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#creating-a-spatial-3d-sound
         */
        this.maxDistance = 100;
        /**
         * Define the distance attenuation model the sound will follow.
         * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#creating-a-spatial-3d-sound
         */
        this.distanceModel = "linear";
        /**
         * Gets or sets an object used to store user defined information for the sound.
         */
        this.metadata = null;
        /**
         * Observable event when the current playing sound finishes.
         */
        this.onEndedObservable = new Observable();
        this._panningModel = "equalpower";
        this._playbackRate = 1;
        this._streaming = false;
        this._startTime = 0;
        this._startOffset = 0;
        this._position = Vector3.Zero();
        /** @hidden */
        this._positionInEmitterSpace = false;
        this._localDirection = new Vector3(1, 0, 0);
        this._volume = 1;
        this._isReadyToPlay = false;
        this._isDirectional = false;
        // Used if you'd like to create a directional sound.
        // If not set, the sound will be omnidirectional
        this._coneInnerAngle = 360;
        this._coneOuterAngle = 360;
        this._coneOuterGain = 0;
        this._isOutputConnected = false;
        this._urlType = "Unknown";
        this.name = name;
        this._scene = scene;
        Sound._SceneComponentInitialization(scene);
        this._readyToPlayCallback = readyToPlayCallback;
        // Default custom attenuation function is a linear attenuation
        this._customAttenuationFunction = function (currentVolume, currentDistance, maxDistance, refDistance, rolloffFactor) {
            if (currentDistance < maxDistance) {
                return currentVolume * (1 - currentDistance / maxDistance);
            }
            else {
                return 0;
            }
        };
        if (options) {
            this.autoplay = options.autoplay || false;
            this.loop = options.loop || false;
            // if volume === 0, we need another way to check this option
            if (options.volume !== undefined) {
                this._volume = options.volume;
            }
            this.spatialSound = (_a = options.spatialSound) !== null && _a !== void 0 ? _a : false;
            this.maxDistance = (_b = options.maxDistance) !== null && _b !== void 0 ? _b : 100;
            this.useCustomAttenuation = (_c = options.useCustomAttenuation) !== null && _c !== void 0 ? _c : false;
            this.rolloffFactor = options.rolloffFactor || 1;
            this.refDistance = options.refDistance || 1;
            this.distanceModel = options.distanceModel || "linear";
            this._playbackRate = options.playbackRate || 1;
            this._streaming = (_d = options.streaming) !== null && _d !== void 0 ? _d : false;
            this._length = options.length;
            this._offset = options.offset;
        }
        if (Engine.audioEngine.canUseWebAudio && Engine.audioEngine.audioContext) {
            this._soundGain = Engine.audioEngine.audioContext.createGain();
            this._soundGain.gain.value = this._volume;
            this._inputAudioNode = this._soundGain;
            this._outputAudioNode = this._soundGain;
            if (this.spatialSound) {
                this._createSpatialParameters();
            }
            this._scene.mainSoundTrack.addSound(this);
            var validParameter = true;
            // if no parameter is passed, you need to call setAudioBuffer yourself to prepare the sound
            if (urlOrArrayBuffer) {
                try {
                    if (typeof urlOrArrayBuffer === "string") {
                        this._urlType = "String";
                    }
                    else if (urlOrArrayBuffer instanceof ArrayBuffer) {
                        this._urlType = "ArrayBuffer";
                    }
                    else if (urlOrArrayBuffer instanceof MediaStream) {
                        this._urlType = "MediaStream";
                    }
                    else if (Array.isArray(urlOrArrayBuffer)) {
                        this._urlType = "Array";
                    }
                    var urls = [];
                    var codecSupportedFound = false;
                    switch (this._urlType) {
                        case "MediaStream":
                            this._streaming = true;
                            this._isReadyToPlay = true;
                            this._streamingSource = Engine.audioEngine.audioContext.createMediaStreamSource(urlOrArrayBuffer);
                            if (this.autoplay) {
                                this.play(0, this._offset, this._length);
                            }
                            if (this._readyToPlayCallback) {
                                this._readyToPlayCallback();
                            }
                            break;
                        case "ArrayBuffer":
                            if (urlOrArrayBuffer.byteLength > 0) {
                                codecSupportedFound = true;
                                this._soundLoaded(urlOrArrayBuffer);
                            }
                            break;
                        case "String":
                            urls.push(urlOrArrayBuffer);
                        case "Array":
                            if (urls.length === 0) {
                                urls = urlOrArrayBuffer;
                            }
                            // If we found a supported format, we load it immediately and stop the loop
                            for (var i = 0; i < urls.length; i++) {
                                var url = urls[i];
                                codecSupportedFound =
                                    (options && options.skipCodecCheck) ||
                                        (url.indexOf(".mp3", url.length - 4) !== -1 && Engine.audioEngine.isMP3supported) ||
                                        (url.indexOf(".ogg", url.length - 4) !== -1 && Engine.audioEngine.isOGGsupported) ||
                                        url.indexOf(".wav", url.length - 4) !== -1 ||
                                        url.indexOf(".m4a", url.length - 4) !== -1 ||
                                        url.indexOf("blob:") !== -1;
                                if (codecSupportedFound) {
                                    // Loading sound using XHR2
                                    if (!this._streaming) {
                                        this._scene._loadFile(url, function (data) {
                                            _this._soundLoaded(data);
                                        }, undefined, true, true, function (exception) {
                                            if (exception) {
                                                Logger.Error("XHR " + exception.status + " error on: " + url + ".");
                                            }
                                            Logger.Error("Sound creation aborted.");
                                            _this._scene.mainSoundTrack.removeSound(_this);
                                        });
                                    }
                                    // Streaming sound using HTML5 Audio tag
                                    else {
                                        this._htmlAudioElement = new Audio(url);
                                        this._htmlAudioElement.controls = false;
                                        this._htmlAudioElement.loop = this.loop;
                                        Tools.SetCorsBehavior(url, this._htmlAudioElement);
                                        this._htmlAudioElement.preload = "auto";
                                        this._htmlAudioElement.addEventListener("canplaythrough", function () {
                                            _this._isReadyToPlay = true;
                                            if (_this.autoplay) {
                                                _this.play(0, _this._offset, _this._length);
                                            }
                                            if (_this._readyToPlayCallback) {
                                                _this._readyToPlayCallback();
                                            }
                                        });
                                        document.body.appendChild(this._htmlAudioElement);
                                        this._htmlAudioElement.load();
                                    }
                                    break;
                                }
                            }
                            break;
                        default:
                            validParameter = false;
                            break;
                    }
                    if (!validParameter) {
                        Logger.Error("Parameter must be a URL to the sound, an Array of URLs (.mp3 & .ogg) or an ArrayBuffer of the sound.");
                    }
                    else {
                        if (!codecSupportedFound) {
                            this._isReadyToPlay = true;
                            // Simulating a ready to play event to avoid breaking code path
                            if (this._readyToPlayCallback) {
                                window.setTimeout(function () {
                                    if (_this._readyToPlayCallback) {
                                        _this._readyToPlayCallback();
                                    }
                                }, 1000);
                            }
                        }
                    }
                }
                catch (ex) {
                    Logger.Error("Unexpected error. Sound creation aborted.");
                    this._scene.mainSoundTrack.removeSound(this);
                }
            }
        }
        else {
            // Adding an empty sound to avoid breaking audio calls for non Web Audio browsers
            this._scene.mainSoundTrack.addSound(this);
            if (!Engine.audioEngine.WarnedWebAudioUnsupported) {
                Logger.Error("Web Audio is not supported by your browser.");
                Engine.audioEngine.WarnedWebAudioUnsupported = true;
            }
            // Simulating a ready to play event to avoid breaking code for non web audio browsers
            if (this._readyToPlayCallback) {
                window.setTimeout(function () {
                    if (_this._readyToPlayCallback) {
                        _this._readyToPlayCallback();
                    }
                }, 1000);
            }
        }
    }
    Object.defineProperty(Sound.prototype, "currentTime", {
        /**
         * Gets the current time for the sound.
         */
        get: function () {
            if (this._htmlAudioElement) {
                return this._htmlAudioElement.currentTime;
            }
            var currentTime = this._startOffset;
            if (this.isPlaying && Engine.audioEngine.audioContext) {
                currentTime += Engine.audioEngine.audioContext.currentTime - this._startTime;
            }
            return currentTime;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Release the sound and its associated resources
     */
    Sound.prototype.dispose = function () {
        if (Engine.audioEngine.canUseWebAudio) {
            if (this.isPlaying) {
                this.stop();
            }
            this._isReadyToPlay = false;
            if (this.soundTrackId === -1) {
                this._scene.mainSoundTrack.removeSound(this);
            }
            else if (this._scene.soundTracks) {
                this._scene.soundTracks[this.soundTrackId].removeSound(this);
            }
            if (this._soundGain) {
                this._soundGain.disconnect();
                this._soundGain = null;
            }
            if (this._soundPanner) {
                this._soundPanner.disconnect();
                this._soundPanner = null;
            }
            if (this._soundSource) {
                this._soundSource.disconnect();
                this._soundSource = null;
            }
            this._audioBuffer = null;
            if (this._htmlAudioElement) {
                this._htmlAudioElement.pause();
                this._htmlAudioElement.src = "";
                document.body.removeChild(this._htmlAudioElement);
            }
            if (this._streamingSource) {
                this._streamingSource.disconnect();
            }
            if (this._connectedTransformNode && this._registerFunc) {
                this._connectedTransformNode.unregisterAfterWorldMatrixUpdate(this._registerFunc);
                this._connectedTransformNode = null;
            }
        }
    };
    /**
     * Gets if the sounds is ready to be played or not.
     * @returns true if ready, otherwise false
     */
    Sound.prototype.isReady = function () {
        return this._isReadyToPlay;
    };
    Sound.prototype._soundLoaded = function (audioData) {
        var _this = this;
        if (!Engine.audioEngine.audioContext) {
            return;
        }
        Engine.audioEngine.audioContext.decodeAudioData(audioData, function (buffer) {
            _this._audioBuffer = buffer;
            _this._isReadyToPlay = true;
            if (_this.autoplay) {
                _this.play(0, _this._offset, _this._length);
            }
            if (_this._readyToPlayCallback) {
                _this._readyToPlayCallback();
            }
        }, function (err) {
            Logger.Error("Error while decoding audio data for: " + _this.name + " / Error: " + err);
        });
    };
    /**
     * Sets the data of the sound from an audiobuffer
     * @param audioBuffer The audioBuffer containing the data
     */
    Sound.prototype.setAudioBuffer = function (audioBuffer) {
        if (Engine.audioEngine.canUseWebAudio) {
            this._audioBuffer = audioBuffer;
            this._isReadyToPlay = true;
        }
    };
    /**
     * Updates the current sounds options such as maxdistance, loop...
     * @param options A JSON object containing values named as the object properties
     */
    Sound.prototype.updateOptions = function (options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (options) {
            this.loop = (_a = options.loop) !== null && _a !== void 0 ? _a : this.loop;
            this.maxDistance = (_b = options.maxDistance) !== null && _b !== void 0 ? _b : this.maxDistance;
            this.useCustomAttenuation = (_c = options.useCustomAttenuation) !== null && _c !== void 0 ? _c : this.useCustomAttenuation;
            this.rolloffFactor = (_d = options.rolloffFactor) !== null && _d !== void 0 ? _d : this.rolloffFactor;
            this.refDistance = (_e = options.refDistance) !== null && _e !== void 0 ? _e : this.refDistance;
            this.distanceModel = (_f = options.distanceModel) !== null && _f !== void 0 ? _f : this.distanceModel;
            this._playbackRate = (_g = options.playbackRate) !== null && _g !== void 0 ? _g : this._playbackRate;
            this._length = (_h = options.length) !== null && _h !== void 0 ? _h : undefined;
            this._offset = (_j = options.offset) !== null && _j !== void 0 ? _j : undefined;
            this._updateSpatialParameters();
            if (this.isPlaying) {
                if (this._streaming && this._htmlAudioElement) {
                    this._htmlAudioElement.playbackRate = this._playbackRate;
                    if (this._htmlAudioElement.loop !== this.loop) {
                        this._htmlAudioElement.loop = this.loop;
                    }
                }
                else {
                    if (this._soundSource) {
                        this._soundSource.playbackRate.value = this._playbackRate;
                        if (this._soundSource.loop !== this.loop) {
                            this._soundSource.loop = this.loop;
                        }
                        if (this._offset !== undefined && this._soundSource.loopStart !== this._offset) {
                            this._soundSource.loopStart = this._offset;
                        }
                        if (this._length !== undefined && this._length !== this._soundSource.loopEnd) {
                            this._soundSource.loopEnd = (this._offset | 0) + this._length;
                        }
                    }
                }
            }
        }
    };
    Sound.prototype._createSpatialParameters = function () {
        if (Engine.audioEngine.canUseWebAudio && Engine.audioEngine.audioContext) {
            if (this._scene.headphone) {
                this._panningModel = "HRTF";
            }
            this._soundPanner = Engine.audioEngine.audioContext.createPanner();
            if (this._soundPanner && this._outputAudioNode) {
                this._updateSpatialParameters();
                this._soundPanner.connect(this._outputAudioNode);
                this._inputAudioNode = this._soundPanner;
            }
        }
    };
    Sound.prototype._updateSpatialParameters = function () {
        if (this.spatialSound && this._soundPanner) {
            if (this.useCustomAttenuation) {
                // Tricks to disable in a way embedded Web Audio attenuation
                this._soundPanner.distanceModel = "linear";
                this._soundPanner.maxDistance = Number.MAX_VALUE;
                this._soundPanner.refDistance = 1;
                this._soundPanner.rolloffFactor = 1;
                this._soundPanner.panningModel = this._panningModel;
            }
            else {
                this._soundPanner.distanceModel = this.distanceModel;
                this._soundPanner.maxDistance = this.maxDistance;
                this._soundPanner.refDistance = this.refDistance;
                this._soundPanner.rolloffFactor = this.rolloffFactor;
                this._soundPanner.panningModel = this._panningModel;
            }
        }
    };
    /**
     * Switch the panning model to HRTF:
     * Renders a stereo output of higher quality than equalpower — it uses a convolution with measured impulse responses from human subjects.
     * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#creating-a-spatial-3d-sound
     */
    Sound.prototype.switchPanningModelToHRTF = function () {
        this._panningModel = "HRTF";
        this._switchPanningModel();
    };
    /**
     * Switch the panning model to Equal Power:
     * Represents the equal-power panning algorithm, generally regarded as simple and efficient. equalpower is the default value.
     * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#creating-a-spatial-3d-sound
     */
    Sound.prototype.switchPanningModelToEqualPower = function () {
        this._panningModel = "equalpower";
        this._switchPanningModel();
    };
    Sound.prototype._switchPanningModel = function () {
        if (Engine.audioEngine.canUseWebAudio && this.spatialSound && this._soundPanner) {
            this._soundPanner.panningModel = this._panningModel;
        }
    };
    /**
     * Connect this sound to a sound track audio node like gain...
     * @param soundTrackAudioNode the sound track audio node to connect to
     */
    Sound.prototype.connectToSoundTrackAudioNode = function (soundTrackAudioNode) {
        if (Engine.audioEngine.canUseWebAudio && this._outputAudioNode) {
            if (this._isOutputConnected) {
                this._outputAudioNode.disconnect();
            }
            this._outputAudioNode.connect(soundTrackAudioNode);
            this._isOutputConnected = true;
        }
    };
    /**
     * Transform this sound into a directional source
     * @param coneInnerAngle Size of the inner cone in degree
     * @param coneOuterAngle Size of the outer cone in degree
     * @param coneOuterGain Volume of the sound outside the outer cone (between 0.0 and 1.0)
     */
    Sound.prototype.setDirectionalCone = function (coneInnerAngle, coneOuterAngle, coneOuterGain) {
        if (coneOuterAngle < coneInnerAngle) {
            Logger.Error("setDirectionalCone(): outer angle of the cone must be superior or equal to the inner angle.");
            return;
        }
        this._coneInnerAngle = coneInnerAngle;
        this._coneOuterAngle = coneOuterAngle;
        this._coneOuterGain = coneOuterGain;
        this._isDirectional = true;
        if (this.isPlaying && this.loop) {
            this.stop();
            this.play(0, this._offset, this._length);
        }
    };
    Object.defineProperty(Sound.prototype, "directionalConeInnerAngle", {
        /**
         * Gets or sets the inner angle for the directional cone.
         */
        get: function () {
            return this._coneInnerAngle;
        },
        /**
         * Gets or sets the inner angle for the directional cone.
         */
        set: function (value) {
            if (value != this._coneInnerAngle) {
                if (this._coneOuterAngle < value) {
                    Logger.Error("directionalConeInnerAngle: outer angle of the cone must be superior or equal to the inner angle.");
                    return;
                }
                this._coneInnerAngle = value;
                if (Engine.audioEngine.canUseWebAudio && this.spatialSound && this._soundPanner) {
                    this._soundPanner.coneInnerAngle = this._coneInnerAngle;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "directionalConeOuterAngle", {
        /**
         * Gets or sets the outer angle for the directional cone.
         */
        get: function () {
            return this._coneOuterAngle;
        },
        /**
         * Gets or sets the outer angle for the directional cone.
         */
        set: function (value) {
            if (value != this._coneOuterAngle) {
                if (value < this._coneInnerAngle) {
                    Logger.Error("directionalConeOuterAngle: outer angle of the cone must be superior or equal to the inner angle.");
                    return;
                }
                this._coneOuterAngle = value;
                if (Engine.audioEngine.canUseWebAudio && this.spatialSound && this._soundPanner) {
                    this._soundPanner.coneOuterAngle = this._coneOuterAngle;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets the position of the emitter if spatial sound is enabled
     * @param newPosition Defines the new posisiton
     */
    Sound.prototype.setPosition = function (newPosition) {
        this._position = newPosition;
        if (Engine.audioEngine.canUseWebAudio && this.spatialSound && this._soundPanner && !isNaN(this._position.x) && !isNaN(this._position.y) && !isNaN(this._position.z)) {
            this._soundPanner.setPosition(this._position.x, this._position.y, this._position.z);
        }
    };
    /**
     * Sets the local direction of the emitter if spatial sound is enabled
     * @param newLocalDirection Defines the new local direction
     */
    Sound.prototype.setLocalDirectionToMesh = function (newLocalDirection) {
        this._localDirection = newLocalDirection;
        if (Engine.audioEngine.canUseWebAudio && this._connectedTransformNode && this.isPlaying) {
            this._updateDirection();
        }
    };
    Sound.prototype._updateDirection = function () {
        if (!this._connectedTransformNode || !this._soundPanner) {
            return;
        }
        var mat = this._connectedTransformNode.getWorldMatrix();
        var direction = Vector3.TransformNormal(this._localDirection, mat);
        direction.normalize();
        this._soundPanner.setOrientation(direction.x, direction.y, direction.z);
    };
    /** @hidden */
    Sound.prototype.updateDistanceFromListener = function () {
        if (Engine.audioEngine.canUseWebAudio && this._connectedTransformNode && this.useCustomAttenuation && this._soundGain && this._scene.activeCamera) {
            var distance = this._connectedTransformNode.getDistanceToCamera(this._scene.activeCamera);
            this._soundGain.gain.value = this._customAttenuationFunction(this._volume, distance, this.maxDistance, this.refDistance, this.rolloffFactor);
        }
    };
    /**
     * Sets a new custom attenuation function for the sound.
     * @param callback Defines the function used for the attenuation
     * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#creating-your-own-custom-attenuation-function
     */
    Sound.prototype.setAttenuationFunction = function (callback) {
        this._customAttenuationFunction = callback;
    };
    /**
     * Play the sound
     * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
     * @param offset (optional) Start the sound at a specific time in seconds
     * @param length (optional) Sound duration (in seconds)
     */
    Sound.prototype.play = function (time, offset, length) {
        var _this = this;
        if (this._isReadyToPlay && this._scene.audioEnabled && Engine.audioEngine.audioContext) {
            try {
                if (this._startOffset < 0) {
                    time = -this._startOffset;
                    this._startOffset = 0;
                }
                var startTime = time ? Engine.audioEngine.audioContext.currentTime + time : Engine.audioEngine.audioContext.currentTime;
                if (!this._soundSource || !this._streamingSource) {
                    if (this.spatialSound && this._soundPanner) {
                        if (!isNaN(this._position.x) && !isNaN(this._position.y) && !isNaN(this._position.z)) {
                            this._soundPanner.setPosition(this._position.x, this._position.y, this._position.z);
                        }
                        if (this._isDirectional) {
                            this._soundPanner.coneInnerAngle = this._coneInnerAngle;
                            this._soundPanner.coneOuterAngle = this._coneOuterAngle;
                            this._soundPanner.coneOuterGain = this._coneOuterGain;
                            if (this._connectedTransformNode) {
                                this._updateDirection();
                            }
                            else {
                                this._soundPanner.setOrientation(this._localDirection.x, this._localDirection.y, this._localDirection.z);
                            }
                        }
                    }
                }
                if (this._streaming) {
                    if (!this._streamingSource) {
                        this._streamingSource = Engine.audioEngine.audioContext.createMediaElementSource(this._htmlAudioElement);
                        this._htmlAudioElement.onended = function () {
                            _this._onended();
                        };
                        this._htmlAudioElement.playbackRate = this._playbackRate;
                    }
                    this._streamingSource.disconnect();
                    if (this._inputAudioNode) {
                        this._streamingSource.connect(this._inputAudioNode);
                    }
                    if (this._htmlAudioElement) {
                        // required to manage properly the new suspended default state of Chrome
                        // When the option 'streaming: true' is used, we need first to wait for
                        // the audio engine to be unlocked by a user gesture before trying to play
                        // an HTML Audio elememt
                        var tryToPlay = function () {
                            if (Engine.audioEngine.unlocked) {
                                var playPromise = _this._htmlAudioElement.play();
                                // In browsers that don’t yet support this functionality,
                                // playPromise won’t be defined.
                                if (playPromise !== undefined) {
                                    playPromise.catch(function (error) {
                                        // Automatic playback failed.
                                        // Waiting for the audio engine to be unlocked by user click on unmute
                                        Engine.audioEngine.lock();
                                        if (_this.loop || _this.autoplay) {
                                            Engine.audioEngine.onAudioUnlockedObservable.addOnce(function () {
                                                tryToPlay();
                                            });
                                        }
                                    });
                                }
                            }
                            else {
                                if (_this.loop || _this.autoplay) {
                                    Engine.audioEngine.onAudioUnlockedObservable.addOnce(function () {
                                        tryToPlay();
                                    });
                                }
                            }
                        };
                        tryToPlay();
                    }
                }
                else {
                    var tryToPlay = function () {
                        if (Engine.audioEngine.audioContext) {
                            length = length || _this._length;
                            offset = offset || _this._offset;
                            if (_this._soundSource) {
                                var oldSource_1 = _this._soundSource;
                                oldSource_1.onended = function () {
                                    oldSource_1.disconnect();
                                };
                            }
                            _this._soundSource = Engine.audioEngine.audioContext.createBufferSource();
                            if (_this._soundSource && _this._inputAudioNode) {
                                _this._soundSource.buffer = _this._audioBuffer;
                                _this._soundSource.connect(_this._inputAudioNode);
                                _this._soundSource.loop = _this.loop;
                                if (offset !== undefined) {
                                    _this._soundSource.loopStart = offset;
                                }
                                if (length !== undefined) {
                                    _this._soundSource.loopEnd = (offset | 0) + length;
                                }
                                _this._soundSource.playbackRate.value = _this._playbackRate;
                                _this._soundSource.onended = function () {
                                    _this._onended();
                                };
                                startTime = time ? Engine.audioEngine.audioContext.currentTime + time : Engine.audioEngine.audioContext.currentTime;
                                var actualOffset = _this.isPaused ? _this._startOffset % _this._soundSource.buffer.duration : offset ? offset : 0;
                                _this._soundSource.start(startTime, actualOffset, _this.loop ? undefined : length);
                            }
                        }
                    };
                    if (Engine.audioEngine.audioContext.state === "suspended") {
                        // Wait a bit for FF as context seems late to be ready.
                        setTimeout(function () {
                            if (Engine.audioEngine.audioContext.state === "suspended") {
                                // Automatic playback failed.
                                // Waiting for the audio engine to be unlocked by user click on unmute
                                Engine.audioEngine.lock();
                                if (_this.loop || _this.autoplay) {
                                    Engine.audioEngine.onAudioUnlockedObservable.addOnce(function () {
                                        tryToPlay();
                                    });
                                }
                            }
                            else {
                                tryToPlay();
                            }
                        }, 500);
                    }
                    else {
                        tryToPlay();
                    }
                }
                this._startTime = startTime;
                this.isPlaying = true;
                this.isPaused = false;
            }
            catch (ex) {
                Logger.Error("Error while trying to play audio: " + this.name + ", " + ex.message);
            }
        }
    };
    Sound.prototype._onended = function () {
        this.isPlaying = false;
        this._startOffset = 0;
        if (this.onended) {
            this.onended();
        }
        this.onEndedObservable.notifyObservers(this);
    };
    /**
     * Stop the sound
     * @param time (optional) Stop the sound after X seconds. Stop immediately (0) by default.
     */
    Sound.prototype.stop = function (time) {
        var _this = this;
        if (this.isPlaying) {
            if (this._streaming) {
                if (this._htmlAudioElement) {
                    this._htmlAudioElement.pause();
                    // Test needed for Firefox or it will generate an Invalid State Error
                    if (this._htmlAudioElement.currentTime > 0) {
                        this._htmlAudioElement.currentTime = 0;
                    }
                }
                else {
                    this._streamingSource.disconnect();
                }
                this.isPlaying = false;
            }
            else if (Engine.audioEngine.audioContext && this._soundSource) {
                var stopTime = time ? Engine.audioEngine.audioContext.currentTime + time : Engine.audioEngine.audioContext.currentTime;
                this._soundSource.stop(stopTime);
                this._soundSource.onended = function () {
                    _this.isPlaying = false;
                };
                if (!this.isPaused) {
                    this._startOffset = 0;
                }
            }
        }
    };
    /**
     * Put the sound in pause
     */
    Sound.prototype.pause = function () {
        if (this.isPlaying) {
            this.isPaused = true;
            if (this._streaming) {
                if (this._htmlAudioElement) {
                    this._htmlAudioElement.pause();
                }
                else {
                    this._streamingSource.disconnect();
                }
            }
            else if (Engine.audioEngine.audioContext) {
                this.stop(0);
                this._startOffset += Engine.audioEngine.audioContext.currentTime - this._startTime;
            }
        }
    };
    /**
     * Sets a dedicated volume for this sounds
     * @param newVolume Define the new volume of the sound
     * @param time Define time for gradual change to new volume
     */
    Sound.prototype.setVolume = function (newVolume, time) {
        if (Engine.audioEngine.canUseWebAudio && this._soundGain) {
            if (time && Engine.audioEngine.audioContext) {
                this._soundGain.gain.cancelScheduledValues(Engine.audioEngine.audioContext.currentTime);
                this._soundGain.gain.setValueAtTime(this._soundGain.gain.value, Engine.audioEngine.audioContext.currentTime);
                this._soundGain.gain.linearRampToValueAtTime(newVolume, Engine.audioEngine.audioContext.currentTime + time);
            }
            else {
                this._soundGain.gain.value = newVolume;
            }
        }
        this._volume = newVolume;
    };
    /**
     * Set the sound play back rate
     * @param newPlaybackRate Define the playback rate the sound should be played at
     */
    Sound.prototype.setPlaybackRate = function (newPlaybackRate) {
        this._playbackRate = newPlaybackRate;
        if (this.isPlaying) {
            if (this._streaming && this._htmlAudioElement) {
                this._htmlAudioElement.playbackRate = this._playbackRate;
            }
            else if (this._soundSource) {
                this._soundSource.playbackRate.value = this._playbackRate;
            }
        }
    };
    /**
     * Gets the volume of the sound.
     * @returns the volume of the sound
     */
    Sound.prototype.getVolume = function () {
        return this._volume;
    };
    /**
     * Attach the sound to a dedicated mesh
     * @param transformNode The transform node to connect the sound with
     * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#attaching-a-sound-to-a-mesh
     */
    Sound.prototype.attachToMesh = function (transformNode) {
        var _this = this;
        if (this._connectedTransformNode && this._registerFunc) {
            this._connectedTransformNode.unregisterAfterWorldMatrixUpdate(this._registerFunc);
            this._registerFunc = null;
        }
        this._connectedTransformNode = transformNode;
        if (!this.spatialSound) {
            this.spatialSound = true;
            this._createSpatialParameters();
            if (this.isPlaying && this.loop) {
                this.stop();
                this.play(0, this._offset, this._length);
            }
        }
        this._onRegisterAfterWorldMatrixUpdate(this._connectedTransformNode);
        this._registerFunc = function (transformNode) { return _this._onRegisterAfterWorldMatrixUpdate(transformNode); };
        this._connectedTransformNode.registerAfterWorldMatrixUpdate(this._registerFunc);
    };
    /**
     * Detach the sound from the previously attached mesh
     * @see https://doc.babylonjs.com/how_to/playing_sounds_and_music#attaching-a-sound-to-a-mesh
     */
    Sound.prototype.detachFromMesh = function () {
        if (this._connectedTransformNode && this._registerFunc) {
            this._connectedTransformNode.unregisterAfterWorldMatrixUpdate(this._registerFunc);
            this._registerFunc = null;
            this._connectedTransformNode = null;
        }
    };
    Sound.prototype._onRegisterAfterWorldMatrixUpdate = function (node) {
        if (this._positionInEmitterSpace) {
            node.worldMatrixFromCache.invertToRef(TmpVectors.Matrix[0]);
            this.setPosition(TmpVectors.Matrix[0].getTranslation());
        }
        else {
            if (!node.getBoundingInfo) {
                this.setPosition(node.absolutePosition);
            }
            else {
                var mesh = node;
                var boundingInfo = mesh.getBoundingInfo();
                this.setPosition(boundingInfo.boundingSphere.centerWorld);
            }
        }
        if (Engine.audioEngine.canUseWebAudio && this._isDirectional && this.isPlaying) {
            this._updateDirection();
        }
    };
    /**
     * Clone the current sound in the scene.
     * @returns the new sound clone
     */
    Sound.prototype.clone = function () {
        var _this = this;
        if (!this._streaming) {
            var setBufferAndRun = function () {
                if (_this._isReadyToPlay) {
                    clonedSound._audioBuffer = _this.getAudioBuffer();
                    clonedSound._isReadyToPlay = true;
                    if (clonedSound.autoplay) {
                        clonedSound.play(0, _this._offset, _this._length);
                    }
                }
                else {
                    window.setTimeout(setBufferAndRun, 300);
                }
            };
            var currentOptions = {
                autoplay: this.autoplay,
                loop: this.loop,
                volume: this._volume,
                spatialSound: this.spatialSound,
                maxDistance: this.maxDistance,
                useCustomAttenuation: this.useCustomAttenuation,
                rolloffFactor: this.rolloffFactor,
                refDistance: this.refDistance,
                distanceModel: this.distanceModel,
            };
            var clonedSound = new Sound(this.name + "_cloned", new ArrayBuffer(0), this._scene, null, currentOptions);
            if (this.useCustomAttenuation) {
                clonedSound.setAttenuationFunction(this._customAttenuationFunction);
            }
            clonedSound.setPosition(this._position);
            clonedSound.setPlaybackRate(this._playbackRate);
            setBufferAndRun();
            return clonedSound;
        }
        // Can't clone a streaming sound
        else {
            return null;
        }
    };
    /**
     * Gets the current underlying audio buffer containing the data
     * @returns the audio buffer
     */
    Sound.prototype.getAudioBuffer = function () {
        return this._audioBuffer;
    };
    /**
     * Gets the WebAudio AudioBufferSourceNode, lets you keep track of and stop instances of this Sound.
     * @returns the source node
     */
    Sound.prototype.getSoundSource = function () {
        return this._soundSource;
    };
    /**
     * Gets the WebAudio GainNode, gives you precise control over the gain of instances of this Sound.
     * @returns the gain node
     */
    Sound.prototype.getSoundGain = function () {
        return this._soundGain;
    };
    /**
     * Serializes the Sound in a JSON representation
     * @returns the JSON representation of the sound
     */
    Sound.prototype.serialize = function () {
        var serializationObject = {
            name: this.name,
            url: this.name,
            autoplay: this.autoplay,
            loop: this.loop,
            volume: this._volume,
            spatialSound: this.spatialSound,
            maxDistance: this.maxDistance,
            rolloffFactor: this.rolloffFactor,
            refDistance: this.refDistance,
            distanceModel: this.distanceModel,
            playbackRate: this._playbackRate,
            panningModel: this._panningModel,
            soundTrackId: this.soundTrackId,
            metadata: this.metadata,
        };
        if (this.spatialSound) {
            if (this._connectedTransformNode) {
                serializationObject.connectedMeshId = this._connectedTransformNode.id;
            }
            serializationObject.position = this._position.asArray();
            serializationObject.refDistance = this.refDistance;
            serializationObject.distanceModel = this.distanceModel;
            serializationObject.isDirectional = this._isDirectional;
            serializationObject.localDirectionToMesh = this._localDirection.asArray();
            serializationObject.coneInnerAngle = this._coneInnerAngle;
            serializationObject.coneOuterAngle = this._coneOuterAngle;
            serializationObject.coneOuterGain = this._coneOuterGain;
        }
        return serializationObject;
    };
    /**
     * Parse a JSON representation of a sound to innstantiate in a given scene
     * @param parsedSound Define the JSON representation of the sound (usually coming from the serialize method)
     * @param scene Define the scene the new parsed sound should be created in
     * @param rootUrl Define the rooturl of the load in case we need to fetch relative dependencies
     * @param sourceSound Define a cound place holder if do not need to instantiate a new one
     * @returns the newly parsed sound
     */
    Sound.Parse = function (parsedSound, scene, rootUrl, sourceSound) {
        var soundName = parsedSound.name;
        var soundUrl;
        if (parsedSound.url) {
            soundUrl = rootUrl + parsedSound.url;
        }
        else {
            soundUrl = rootUrl + soundName;
        }
        var options = {
            autoplay: parsedSound.autoplay,
            loop: parsedSound.loop,
            volume: parsedSound.volume,
            spatialSound: parsedSound.spatialSound,
            maxDistance: parsedSound.maxDistance,
            rolloffFactor: parsedSound.rolloffFactor,
            refDistance: parsedSound.refDistance,
            distanceModel: parsedSound.distanceModel,
            playbackRate: parsedSound.playbackRate,
        };
        var newSound;
        if (!sourceSound) {
            newSound = new Sound(soundName, soundUrl, scene, function () {
                scene._removePendingData(newSound);
            }, options);
            scene._addPendingData(newSound);
        }
        else {
            var setBufferAndRun = function () {
                if (sourceSound._isReadyToPlay) {
                    newSound._audioBuffer = sourceSound.getAudioBuffer();
                    newSound._isReadyToPlay = true;
                    if (newSound.autoplay) {
                        newSound.play(0, newSound._offset, newSound._length);
                    }
                }
                else {
                    window.setTimeout(setBufferAndRun, 300);
                }
            };
            newSound = new Sound(soundName, new ArrayBuffer(0), scene, null, options);
            setBufferAndRun();
        }
        if (parsedSound.position) {
            var soundPosition = Vector3.FromArray(parsedSound.position);
            newSound.setPosition(soundPosition);
        }
        if (parsedSound.isDirectional) {
            newSound.setDirectionalCone(parsedSound.coneInnerAngle || 360, parsedSound.coneOuterAngle || 360, parsedSound.coneOuterGain || 0);
            if (parsedSound.localDirectionToMesh) {
                var localDirectionToMesh = Vector3.FromArray(parsedSound.localDirectionToMesh);
                newSound.setLocalDirectionToMesh(localDirectionToMesh);
            }
        }
        if (parsedSound.connectedMeshId) {
            var connectedMesh = scene.getMeshByID(parsedSound.connectedMeshId);
            if (connectedMesh) {
                newSound.attachToMesh(connectedMesh);
            }
        }
        if (parsedSound.metadata) {
            newSound.metadata = parsedSound.metadata;
        }
        return newSound;
    };
    /** @hidden */
    Sound._SceneComponentInitialization = function (_) {
        throw _DevTools.WarnImport("AudioSceneComponent");
    };
    return Sound;
}());

/**
 * Wraps one or more Sound objects and selects one with random weight for playback.
 */
var WeightedSound = /** @class */ (function () {
    /**
     * Creates a new WeightedSound from the list of sounds given.
     * @param loop When true a Sound will be selected and played when the current playing Sound completes.
     * @param sounds Array of Sounds that will be selected from.
     * @param weights Array of number values for selection weights; length must equal sounds, values will be normalized to 1
     */
    function WeightedSound(loop, sounds, weights) {
        var _this = this;
        /** When true a Sound will be selected and played when the current playing Sound completes. */
        this.loop = false;
        this._coneInnerAngle = 360;
        this._coneOuterAngle = 360;
        this._volume = 1;
        /** A Sound is currently playing. */
        this.isPlaying = false;
        /** A Sound is currently paused. */
        this.isPaused = false;
        this._sounds = [];
        this._weights = [];
        if (sounds.length !== weights.length) {
            throw new Error('Sounds length does not equal weights length');
        }
        this.loop = loop;
        this._weights = weights;
        // Normalize the weights
        var weightSum = 0;
        for (var _i = 0, weights_1 = weights; _i < weights_1.length; _i++) {
            var weight = weights_1[_i];
            weightSum += weight;
        }
        var invWeightSum = weightSum > 0 ? 1 / weightSum : 0;
        for (var i = 0; i < this._weights.length; i++) {
            this._weights[i] *= invWeightSum;
        }
        this._sounds = sounds;
        for (var _a = 0, _b = this._sounds; _a < _b.length; _a++) {
            var sound = _b[_a];
            sound.onEndedObservable.add(function () { _this._onended(); });
        }
    }
    Object.defineProperty(WeightedSound.prototype, "directionalConeInnerAngle", {
        /**
         * The size of cone in degrees for a directional sound in which there will be no attenuation.
         */
        get: function () {
            return this._coneInnerAngle;
        },
        /**
         * The size of cone in degress for a directional sound in which there will be no attenuation.
         */
        set: function (value) {
            if (value !== this._coneInnerAngle) {
                if (this._coneOuterAngle < value) {
                    Logger.Error("directionalConeInnerAngle: outer angle of the cone must be superior or equal to the inner angle.");
                    return;
                }
                this._coneInnerAngle = value;
                for (var _i = 0, _a = this._sounds; _i < _a.length; _i++) {
                    var sound = _a[_i];
                    sound.directionalConeInnerAngle = value;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WeightedSound.prototype, "directionalConeOuterAngle", {
        /**
         * Size of cone in degrees for a directional sound outside of which there will be no sound.
         * Listener angles between innerAngle and outerAngle will falloff linearly.
         */
        get: function () {
            return this._coneOuterAngle;
        },
        /**
         * Size of cone in degrees for a directional sound outside of which there will be no sound.
         * Listener angles between innerAngle and outerAngle will falloff linearly.
         */
        set: function (value) {
            if (value !== this._coneOuterAngle) {
                if (value < this._coneInnerAngle) {
                    Logger.Error("directionalConeOuterAngle: outer angle of the cone must be superior or equal to the inner angle.");
                    return;
                }
                this._coneOuterAngle = value;
                for (var _i = 0, _a = this._sounds; _i < _a.length; _i++) {
                    var sound = _a[_i];
                    sound.directionalConeOuterAngle = value;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WeightedSound.prototype, "volume", {
        /**
         * Playback volume.
         */
        get: function () {
            return this._volume;
        },
        /**
         * Playback volume.
         */
        set: function (value) {
            if (value !== this._volume) {
                for (var _i = 0, _a = this._sounds; _i < _a.length; _i++) {
                    var sound = _a[_i];
                    sound.setVolume(value);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    WeightedSound.prototype._onended = function () {
        if (this._currentIndex !== undefined) {
            this._sounds[this._currentIndex].autoplay = false;
        }
        if (this.loop && this.isPlaying) {
            this.play();
        }
        else {
            this.isPlaying = false;
        }
    };
    /**
     * Suspend playback
     */
    WeightedSound.prototype.pause = function () {
        this.isPaused = true;
        if (this._currentIndex !== undefined) {
            this._sounds[this._currentIndex].pause();
        }
    };
    /**
     * Stop playback
     */
    WeightedSound.prototype.stop = function () {
        this.isPlaying = false;
        if (this._currentIndex !== undefined) {
            this._sounds[this._currentIndex].stop();
        }
    };
    /**
     * Start playback.
     * @param startOffset Position the clip head at a specific time in seconds.
     */
    WeightedSound.prototype.play = function (startOffset) {
        if (!this.isPaused) {
            this.stop();
            var randomValue = Math.random();
            var total = 0;
            for (var i = 0; i < this._weights.length; i++) {
                total += this._weights[i];
                if (randomValue <= total) {
                    this._currentIndex = i;
                    break;
                }
            }
        }
        var sound = this._sounds[this._currentIndex];
        if (sound.isReady()) {
            sound.play(0, this.isPaused ? undefined : startOffset);
        }
        else {
            sound.autoplay = true;
        }
        this.isPlaying = true;
        this.isPaused = false;
    };
    return WeightedSound;
}());

/** Defines the cross module used constants to avoid circular dependncies */
var Constants = /** @class */ (function () {
    function Constants() {
    }
    /** Defines that alpha blending is disabled */
    Constants.ALPHA_DISABLE = 0;
    /** Defines that alpha blending is SRC ALPHA * SRC + DEST */
    Constants.ALPHA_ADD = 1;
    /** Defines that alpha blending is SRC ALPHA * SRC + (1 - SRC ALPHA) * DEST */
    Constants.ALPHA_COMBINE = 2;
    /** Defines that alpha blending is DEST - SRC * DEST */
    Constants.ALPHA_SUBTRACT = 3;
    /** Defines that alpha blending is SRC * DEST */
    Constants.ALPHA_MULTIPLY = 4;
    /** Defines that alpha blending is SRC ALPHA * SRC + (1 - SRC) * DEST */
    Constants.ALPHA_MAXIMIZED = 5;
    /** Defines that alpha blending is SRC + DEST */
    Constants.ALPHA_ONEONE = 6;
    /** Defines that alpha blending is SRC + (1 - SRC ALPHA) * DEST */
    Constants.ALPHA_PREMULTIPLIED = 7;
    /**
     * Defines that alpha blending is SRC + (1 - SRC ALPHA) * DEST
     * Alpha will be set to (1 - SRC ALPHA) * DEST ALPHA
     */
    Constants.ALPHA_PREMULTIPLIED_PORTERDUFF = 8;
    /** Defines that alpha blending is CST * SRC + (1 - CST) * DEST */
    Constants.ALPHA_INTERPOLATE = 9;
    /**
     * Defines that alpha blending is SRC + (1 - SRC) * DEST
     * Alpha will be set to SRC ALPHA + (1 - SRC ALPHA) * DEST ALPHA
     */
    Constants.ALPHA_SCREENMODE = 10;
    /**
     * Defines that alpha blending is SRC + DST
     * Alpha will be set to SRC ALPHA + DST ALPHA
     */
    Constants.ALPHA_ONEONE_ONEONE = 11;
    /**
     * Defines that alpha blending is SRC * DST ALPHA + DST
     * Alpha will be set to 0
     */
    Constants.ALPHA_ALPHATOCOLOR = 12;
    /**
     * Defines that alpha blending is SRC * (1 - DST) + DST * (1 - SRC)
     */
    Constants.ALPHA_REVERSEONEMINUS = 13;
    /**
     * Defines that alpha blending is SRC + DST * (1 - SRC ALPHA)
     * Alpha will be set to SRC ALPHA + DST ALPHA * (1 - SRC ALPHA)
     */
    Constants.ALPHA_SRC_DSTONEMINUSSRCALPHA = 14;
    /**
     * Defines that alpha blending is SRC + DST
     * Alpha will be set to SRC ALPHA
     */
    Constants.ALPHA_ONEONE_ONEZERO = 15;
    /**
     * Defines that alpha blending is SRC * (1 - DST) + DST * (1 - SRC)
     * Alpha will be set to DST ALPHA
     */
    Constants.ALPHA_EXCLUSION = 16;
    /** Defines that alpha blending equation a SUM */
    Constants.ALPHA_EQUATION_ADD = 0;
    /** Defines that alpha blending equation a SUBSTRACTION */
    Constants.ALPHA_EQUATION_SUBSTRACT = 1;
    /** Defines that alpha blending equation a REVERSE SUBSTRACTION */
    Constants.ALPHA_EQUATION_REVERSE_SUBTRACT = 2;
    /** Defines that alpha blending equation a MAX operation */
    Constants.ALPHA_EQUATION_MAX = 3;
    /** Defines that alpha blending equation a MIN operation */
    Constants.ALPHA_EQUATION_MIN = 4;
    /**
     * Defines that alpha blending equation a DARKEN operation:
     * It takes the min of the src and sums the alpha channels.
     */
    Constants.ALPHA_EQUATION_DARKEN = 5;
    /** Defines that the ressource is not delayed*/
    Constants.DELAYLOADSTATE_NONE = 0;
    /** Defines that the ressource was successfully delay loaded */
    Constants.DELAYLOADSTATE_LOADED = 1;
    /** Defines that the ressource is currently delay loading */
    Constants.DELAYLOADSTATE_LOADING = 2;
    /** Defines that the ressource is delayed and has not started loading */
    Constants.DELAYLOADSTATE_NOTLOADED = 4;
    // Depht or Stencil test Constants.
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn */
    Constants.NEVER = 0x0200;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn */
    Constants.ALWAYS = 0x0207;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value */
    Constants.LESS = 0x0201;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value */
    Constants.EQUAL = 0x0202;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value */
    Constants.LEQUAL = 0x0203;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value */
    Constants.GREATER = 0x0204;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value */
    Constants.GEQUAL = 0x0206;
    /** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value */
    Constants.NOTEQUAL = 0x0205;
    // Stencil Actions Constants.
    /** Passed to stencilOperation to specify that stencil value must be kept */
    Constants.KEEP = 0x1E00;
    /** Passed to stencilOperation to specify that stencil value must be replaced */
    Constants.REPLACE = 0x1E01;
    /** Passed to stencilOperation to specify that stencil value must be incremented */
    Constants.INCR = 0x1E02;
    /** Passed to stencilOperation to specify that stencil value must be decremented */
    Constants.DECR = 0x1E03;
    /** Passed to stencilOperation to specify that stencil value must be inverted */
    Constants.INVERT = 0x150A;
    /** Passed to stencilOperation to specify that stencil value must be incremented with wrapping */
    Constants.INCR_WRAP = 0x8507;
    /** Passed to stencilOperation to specify that stencil value must be decremented with wrapping */
    Constants.DECR_WRAP = 0x8508;
    /** Texture is not repeating outside of 0..1 UVs */
    Constants.TEXTURE_CLAMP_ADDRESSMODE = 0;
    /** Texture is repeating outside of 0..1 UVs */
    Constants.TEXTURE_WRAP_ADDRESSMODE = 1;
    /** Texture is repeating and mirrored */
    Constants.TEXTURE_MIRROR_ADDRESSMODE = 2;
    /** ALPHA */
    Constants.TEXTUREFORMAT_ALPHA = 0;
    /** LUMINANCE */
    Constants.TEXTUREFORMAT_LUMINANCE = 1;
    /** LUMINANCE_ALPHA */
    Constants.TEXTUREFORMAT_LUMINANCE_ALPHA = 2;
    /** RGB */
    Constants.TEXTUREFORMAT_RGB = 4;
    /** RGBA */
    Constants.TEXTUREFORMAT_RGBA = 5;
    /** RED */
    Constants.TEXTUREFORMAT_RED = 6;
    /** RED (2nd reference) */
    Constants.TEXTUREFORMAT_R = 6;
    /** RG */
    Constants.TEXTUREFORMAT_RG = 7;
    /** RED_INTEGER */
    Constants.TEXTUREFORMAT_RED_INTEGER = 8;
    /** RED_INTEGER (2nd reference) */
    Constants.TEXTUREFORMAT_R_INTEGER = 8;
    /** RG_INTEGER */
    Constants.TEXTUREFORMAT_RG_INTEGER = 9;
    /** RGB_INTEGER */
    Constants.TEXTUREFORMAT_RGB_INTEGER = 10;
    /** RGBA_INTEGER */
    Constants.TEXTUREFORMAT_RGBA_INTEGER = 11;
    /** UNSIGNED_BYTE */
    Constants.TEXTURETYPE_UNSIGNED_BYTE = 0;
    /** UNSIGNED_BYTE (2nd reference) */
    Constants.TEXTURETYPE_UNSIGNED_INT = 0;
    /** FLOAT */
    Constants.TEXTURETYPE_FLOAT = 1;
    /** HALF_FLOAT */
    Constants.TEXTURETYPE_HALF_FLOAT = 2;
    /** BYTE */
    Constants.TEXTURETYPE_BYTE = 3;
    /** SHORT */
    Constants.TEXTURETYPE_SHORT = 4;
    /** UNSIGNED_SHORT */
    Constants.TEXTURETYPE_UNSIGNED_SHORT = 5;
    /** INT */
    Constants.TEXTURETYPE_INT = 6;
    /** UNSIGNED_INT */
    Constants.TEXTURETYPE_UNSIGNED_INTEGER = 7;
    /** UNSIGNED_SHORT_4_4_4_4 */
    Constants.TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4 = 8;
    /** UNSIGNED_SHORT_5_5_5_1 */
    Constants.TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1 = 9;
    /** UNSIGNED_SHORT_5_6_5 */
    Constants.TEXTURETYPE_UNSIGNED_SHORT_5_6_5 = 10;
    /** UNSIGNED_INT_2_10_10_10_REV */
    Constants.TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV = 11;
    /** UNSIGNED_INT_24_8 */
    Constants.TEXTURETYPE_UNSIGNED_INT_24_8 = 12;
    /** UNSIGNED_INT_10F_11F_11F_REV */
    Constants.TEXTURETYPE_UNSIGNED_INT_10F_11F_11F_REV = 13;
    /** UNSIGNED_INT_5_9_9_9_REV */
    Constants.TEXTURETYPE_UNSIGNED_INT_5_9_9_9_REV = 14;
    /** FLOAT_32_UNSIGNED_INT_24_8_REV */
    Constants.TEXTURETYPE_FLOAT_32_UNSIGNED_INT_24_8_REV = 15;
    /** nearest is mag = nearest and min = nearest and no mip */
    Constants.TEXTURE_NEAREST_SAMPLINGMODE = 1;
    /** mag = nearest and min = nearest and mip = none */
    Constants.TEXTURE_NEAREST_NEAREST = 1;
    /** Bilinear is mag = linear and min = linear and no mip */
    Constants.TEXTURE_BILINEAR_SAMPLINGMODE = 2;
    /** mag = linear and min = linear and mip = none */
    Constants.TEXTURE_LINEAR_LINEAR = 2;
    /** Trilinear is mag = linear and min = linear and mip = linear */
    Constants.TEXTURE_TRILINEAR_SAMPLINGMODE = 3;
    /** Trilinear is mag = linear and min = linear and mip = linear */
    Constants.TEXTURE_LINEAR_LINEAR_MIPLINEAR = 3;
    /** mag = nearest and min = nearest and mip = nearest */
    Constants.TEXTURE_NEAREST_NEAREST_MIPNEAREST = 4;
    /** mag = nearest and min = linear and mip = nearest */
    Constants.TEXTURE_NEAREST_LINEAR_MIPNEAREST = 5;
    /** mag = nearest and min = linear and mip = linear */
    Constants.TEXTURE_NEAREST_LINEAR_MIPLINEAR = 6;
    /** mag = nearest and min = linear and mip = none */
    Constants.TEXTURE_NEAREST_LINEAR = 7;
    /** nearest is mag = nearest and min = nearest and mip = linear */
    Constants.TEXTURE_NEAREST_NEAREST_MIPLINEAR = 8;
    /** mag = linear and min = nearest and mip = nearest */
    Constants.TEXTURE_LINEAR_NEAREST_MIPNEAREST = 9;
    /** mag = linear and min = nearest and mip = linear */
    Constants.TEXTURE_LINEAR_NEAREST_MIPLINEAR = 10;
    /** Bilinear is mag = linear and min = linear and mip = nearest */
    Constants.TEXTURE_LINEAR_LINEAR_MIPNEAREST = 11;
    /** mag = linear and min = nearest and mip = none */
    Constants.TEXTURE_LINEAR_NEAREST = 12;
    /** Explicit coordinates mode */
    Constants.TEXTURE_EXPLICIT_MODE = 0;
    /** Spherical coordinates mode */
    Constants.TEXTURE_SPHERICAL_MODE = 1;
    /** Planar coordinates mode */
    Constants.TEXTURE_PLANAR_MODE = 2;
    /** Cubic coordinates mode */
    Constants.TEXTURE_CUBIC_MODE = 3;
    /** Projection coordinates mode */
    Constants.TEXTURE_PROJECTION_MODE = 4;
    /** Skybox coordinates mode */
    Constants.TEXTURE_SKYBOX_MODE = 5;
    /** Inverse Cubic coordinates mode */
    Constants.TEXTURE_INVCUBIC_MODE = 6;
    /** Equirectangular coordinates mode */
    Constants.TEXTURE_EQUIRECTANGULAR_MODE = 7;
    /** Equirectangular Fixed coordinates mode */
    Constants.TEXTURE_FIXED_EQUIRECTANGULAR_MODE = 8;
    /** Equirectangular Fixed Mirrored coordinates mode */
    Constants.TEXTURE_FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9;
    /** Offline (baking) quality for texture filtering */
    Constants.TEXTURE_FILTERING_QUALITY_OFFLINE = 4096;
    /** High quality for texture filtering */
    Constants.TEXTURE_FILTERING_QUALITY_HIGH = 64;
    /** Medium quality for texture filtering */
    Constants.TEXTURE_FILTERING_QUALITY_MEDIUM = 16;
    /** Low quality for texture filtering */
    Constants.TEXTURE_FILTERING_QUALITY_LOW = 8;
    // Texture rescaling mode
    /** Defines that texture rescaling will use a floor to find the closer power of 2 size */
    Constants.SCALEMODE_FLOOR = 1;
    /** Defines that texture rescaling will look for the nearest power of 2 size */
    Constants.SCALEMODE_NEAREST = 2;
    /** Defines that texture rescaling will use a ceil to find the closer power of 2 size */
    Constants.SCALEMODE_CEILING = 3;
    /**
     * The dirty texture flag value
     */
    Constants.MATERIAL_TextureDirtyFlag = 1;
    /**
     * The dirty light flag value
     */
    Constants.MATERIAL_LightDirtyFlag = 2;
    /**
     * The dirty fresnel flag value
     */
    Constants.MATERIAL_FresnelDirtyFlag = 4;
    /**
     * The dirty attribute flag value
     */
    Constants.MATERIAL_AttributesDirtyFlag = 8;
    /**
     * The dirty misc flag value
     */
    Constants.MATERIAL_MiscDirtyFlag = 16;
    /**
     * The dirty prepass flag value
     */
    Constants.MATERIAL_PrePassDirtyFlag = 32;
    /**
     * The all dirty flag value
     */
    Constants.MATERIAL_AllDirtyFlag = 63;
    /**
     * Returns the triangle fill mode
     */
    Constants.MATERIAL_TriangleFillMode = 0;
    /**
     * Returns the wireframe mode
     */
    Constants.MATERIAL_WireFrameFillMode = 1;
    /**
     * Returns the point fill mode
     */
    Constants.MATERIAL_PointFillMode = 2;
    /**
     * Returns the point list draw mode
     */
    Constants.MATERIAL_PointListDrawMode = 3;
    /**
     * Returns the line list draw mode
     */
    Constants.MATERIAL_LineListDrawMode = 4;
    /**
     * Returns the line loop draw mode
     */
    Constants.MATERIAL_LineLoopDrawMode = 5;
    /**
     * Returns the line strip draw mode
     */
    Constants.MATERIAL_LineStripDrawMode = 6;
    /**
     * Returns the triangle strip draw mode
     */
    Constants.MATERIAL_TriangleStripDrawMode = 7;
    /**
     * Returns the triangle fan draw mode
     */
    Constants.MATERIAL_TriangleFanDrawMode = 8;
    /**
     * Stores the clock-wise side orientation
     */
    Constants.MATERIAL_ClockWiseSideOrientation = 0;
    /**
     * Stores the counter clock-wise side orientation
     */
    Constants.MATERIAL_CounterClockWiseSideOrientation = 1;
    /**
     * Nothing
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_NothingTrigger = 0;
    /**
     * On pick
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPickTrigger = 1;
    /**
     * On left pick
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnLeftPickTrigger = 2;
    /**
     * On right pick
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnRightPickTrigger = 3;
    /**
     * On center pick
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnCenterPickTrigger = 4;
    /**
     * On pick down
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPickDownTrigger = 5;
    /**
     * On double pick
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnDoublePickTrigger = 6;
    /**
     * On pick up
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPickUpTrigger = 7;
    /**
     * On pick out.
     * This trigger will only be raised if you also declared a OnPickDown
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPickOutTrigger = 16;
    /**
     * On long press
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnLongPressTrigger = 8;
    /**
     * On pointer over
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPointerOverTrigger = 9;
    /**
     * On pointer out
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnPointerOutTrigger = 10;
    /**
     * On every frame
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnEveryFrameTrigger = 11;
    /**
     * On intersection enter
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnIntersectionEnterTrigger = 12;
    /**
     * On intersection exit
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnIntersectionExitTrigger = 13;
    /**
     * On key down
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnKeyDownTrigger = 14;
    /**
     * On key up
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
     */
    Constants.ACTION_OnKeyUpTrigger = 15;
    /**
     * Billboard mode will only apply to Y axis
     */
    Constants.PARTICLES_BILLBOARDMODE_Y = 2;
    /**
     * Billboard mode will apply to all axes
     */
    Constants.PARTICLES_BILLBOARDMODE_ALL = 7;
    /**
     * Special billboard mode where the particle will be biilboard to the camera but rotated to align with direction
     */
    Constants.PARTICLES_BILLBOARDMODE_STRETCHED = 8;
    /** Default culling strategy : this is an exclusion test and it's the more accurate.
     *  Test order :
     *  Is the bounding sphere outside the frustum ?
     *  If not, are the bounding box vertices outside the frustum ?
     *  It not, then the cullable object is in the frustum.
     */
    Constants.MESHES_CULLINGSTRATEGY_STANDARD = 0;
    /** Culling strategy : Bounding Sphere Only.
     *  This is an exclusion test. It's faster than the standard strategy because the bounding box is not tested.
     *  It's also less accurate than the standard because some not visible objects can still be selected.
     *  Test : is the bounding sphere outside the frustum ?
     *  If not, then the cullable object is in the frustum.
     */
    Constants.MESHES_CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY = 1;
    /** Culling strategy : Optimistic Inclusion.
     *  This in an inclusion test first, then the standard exclusion test.
     *  This can be faster when a cullable object is expected to be almost always in the camera frustum.
     *  This could also be a little slower than the standard test when the tested object center is not the frustum but one of its bounding box vertex is still inside.
     *  Anyway, it's as accurate as the standard strategy.
     *  Test :
     *  Is the cullable object bounding sphere center in the frustum ?
     *  If not, apply the default culling strategy.
     */
    Constants.MESHES_CULLINGSTRATEGY_OPTIMISTIC_INCLUSION = 2;
    /** Culling strategy : Optimistic Inclusion then Bounding Sphere Only.
     *  This in an inclusion test first, then the bounding sphere only exclusion test.
     *  This can be the fastest test when a cullable object is expected to be almost always in the camera frustum.
     *  This could also be a little slower than the BoundingSphereOnly strategy when the tested object center is not in the frustum but its bounding sphere still intersects it.
     *  It's less accurate than the standard strategy and as accurate as the BoundingSphereOnly strategy.
     *  Test :
     *  Is the cullable object bounding sphere center in the frustum ?
     *  If not, apply the Bounding Sphere Only strategy. No Bounding Box is tested here.
     */
    Constants.MESHES_CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY = 3;
    /**
     * No logging while loading
     */
    Constants.SCENELOADER_NO_LOGGING = 0;
    /**
     * Minimal logging while loading
     */
    Constants.SCENELOADER_MINIMAL_LOGGING = 1;
    /**
     * Summary logging while loading
     */
    Constants.SCENELOADER_SUMMARY_LOGGING = 2;
    /**
     * Detailled logging while loading
     */
    Constants.SCENELOADER_DETAILED_LOGGING = 3;
    /**
     * Constant used to retrieve the irradiance texture index in the textures array in the prepass
     * using getIndex(0)
     */
    Constants.PREPASS_IRRADIANCE_TEXTURE_TYPE = 0;
    /**
     * Constant used to retrieve the position texture index in the textures array in the prepass
     * using getIndex(undefined)
     */
    Constants.PREPASS_POSITION_TEXTURE_TYPE = 1;
    /**
     * Constant used to retrieve the velocity texture index in the textures array in the prepass
     * using getIndex(undefined)
     */
    Constants.PREPASS_VELOCITY_TEXTURE_TYPE = 2;
    /**
     * Constant used to retrieve the reflectivity texture index in the textures array in the prepass
     * using the getIndex(3)
     */
    Constants.PREPASS_REFLECTIVITY_TEXTURE_TYPE = 3;
    /**
     * Constant used to retrieve the lit color texture index in the textures array in the prepass
     * using the getIndex(4)
     */
    Constants.PREPASS_COLOR_TEXTURE_TYPE = 4;
    /**
     * Constant used to retrieve depth + normal index in the textures array in the prepass
     * using the getIndex(5)
     */
    Constants.PREPASS_DEPTHNORMAL_TEXTURE_TYPE = 5;
    /**
     * Constant used to retrieve albedo index in the textures array in the prepass
     * using the getIndex(6)
     */
    Constants.PREPASS_ALBEDO_TEXTURE_TYPE = 6;
    return Constants;
}());

Node.AddNodeConstructor("Light_Type_1", function (name, scene) {
    return function () { return new DirectionalLight(name, Vector3.Zero(), scene); };
});
/**
 * A directional light is defined by a direction (what a surprise!).
 * The light is emitted from everywhere in the specified direction, and has an infinite range.
 * An example of a directional light is when a distance planet is lit by the apparently parallel lines of light from its sun. Light in a downward direction will light the top of an object.
 * Documentation: https://doc.babylonjs.com/babylon101/lights
 */
var DirectionalLight = /** @class */ (function (_super) {
    __extends(DirectionalLight, _super);
    /**
     * Creates a DirectionalLight object in the scene, oriented towards the passed direction (Vector3).
     * The directional light is emitted from everywhere in the given direction.
     * It can cast shadows.
     * Documentation : https://doc.babylonjs.com/babylon101/lights
     * @param name The friendly name of the light
     * @param direction The direction of the light
     * @param scene The scene the light belongs to
     */
    function DirectionalLight(name, direction, scene) {
        var _this = _super.call(this, name, scene) || this;
        _this._shadowFrustumSize = 0;
        _this._shadowOrthoScale = 0.1;
        /**
         * Automatically compute the projection matrix to best fit (including all the casters)
         * on each frame.
         */
        _this.autoUpdateExtends = true;
        /**
         * Automatically compute the shadowMinZ and shadowMaxZ for the projection matrix to best fit (including all the casters)
         * on each frame. autoUpdateExtends must be set to true for this to work
         */
        _this.autoCalcShadowZBounds = false;
        // Cache
        _this._orthoLeft = Number.MAX_VALUE;
        _this._orthoRight = Number.MIN_VALUE;
        _this._orthoTop = Number.MIN_VALUE;
        _this._orthoBottom = Number.MAX_VALUE;
        _this.position = direction.scale(-1.0);
        _this.direction = direction;
        return _this;
    }
    Object.defineProperty(DirectionalLight.prototype, "shadowFrustumSize", {
        /**
         * Fix frustum size for the shadow generation. This is disabled if the value is 0.
         */
        get: function () {
            return this._shadowFrustumSize;
        },
        /**
         * Specifies a fix frustum size for the shadow generation.
         */
        set: function (value) {
            this._shadowFrustumSize = value;
            this.forceProjectionMatrixCompute();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DirectionalLight.prototype, "shadowOrthoScale", {
        /**
         * Gets the shadow projection scale against the optimal computed one.
         * 0.1 by default which means that the projection window is increase by 10% from the optimal size.
         * This does not impact in fixed frustum size (shadowFrustumSize being set)
         */
        get: function () {
            return this._shadowOrthoScale;
        },
        /**
         * Sets the shadow projection scale against the optimal computed one.
         * 0.1 by default which means that the projection window is increase by 10% from the optimal size.
         * This does not impact in fixed frustum size (shadowFrustumSize being set)
         */
        set: function (value) {
            this._shadowOrthoScale = value;
            this.forceProjectionMatrixCompute();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the string "DirectionalLight".
     * @return The class name
     */
    DirectionalLight.prototype.getClassName = function () {
        return "DirectionalLight";
    };
    /**
     * Returns the integer 1.
     * @return The light Type id as a constant defines in Light.LIGHTTYPEID_x
     */
    DirectionalLight.prototype.getTypeID = function () {
        return Light.LIGHTTYPEID_DIRECTIONALLIGHT;
    };
    /**
     * Sets the passed matrix "matrix" as projection matrix for the shadows cast by the light according to the passed view matrix.
     * Returns the DirectionalLight Shadow projection matrix.
     */
    DirectionalLight.prototype._setDefaultShadowProjectionMatrix = function (matrix, viewMatrix, renderList) {
        if (this.shadowFrustumSize > 0) {
            this._setDefaultFixedFrustumShadowProjectionMatrix(matrix);
        }
        else {
            this._setDefaultAutoExtendShadowProjectionMatrix(matrix, viewMatrix, renderList);
        }
    };
    /**
     * Sets the passed matrix "matrix" as fixed frustum projection matrix for the shadows cast by the light according to the passed view matrix.
     * Returns the DirectionalLight Shadow projection matrix.
     */
    DirectionalLight.prototype._setDefaultFixedFrustumShadowProjectionMatrix = function (matrix) {
        var activeCamera = this.getScene().activeCamera;
        if (!activeCamera) {
            return;
        }
        Matrix.OrthoLHToRef(this.shadowFrustumSize, this.shadowFrustumSize, this.shadowMinZ !== undefined ? this.shadowMinZ : activeCamera.minZ, this.shadowMaxZ !== undefined ? this.shadowMaxZ : activeCamera.maxZ, matrix);
    };
    /**
     * Sets the passed matrix "matrix" as auto extend projection matrix for the shadows cast by the light according to the passed view matrix.
     * Returns the DirectionalLight Shadow projection matrix.
     */
    DirectionalLight.prototype._setDefaultAutoExtendShadowProjectionMatrix = function (matrix, viewMatrix, renderList) {
        var activeCamera = this.getScene().activeCamera;
        if (!activeCamera) {
            return;
        }
        // Check extends
        if (this.autoUpdateExtends || this._orthoLeft === Number.MAX_VALUE) {
            var tempVector3 = Vector3.Zero();
            this._orthoLeft = Number.MAX_VALUE;
            this._orthoRight = Number.MIN_VALUE;
            this._orthoTop = Number.MIN_VALUE;
            this._orthoBottom = Number.MAX_VALUE;
            var shadowMinZ = Number.MAX_VALUE;
            var shadowMaxZ = Number.MIN_VALUE;
            for (var meshIndex = 0; meshIndex < renderList.length; meshIndex++) {
                var mesh = renderList[meshIndex];
                if (!mesh) {
                    continue;
                }
                var boundingInfo = mesh.getBoundingInfo();
                var boundingBox = boundingInfo.boundingBox;
                for (var index = 0; index < boundingBox.vectorsWorld.length; index++) {
                    Vector3.TransformCoordinatesToRef(boundingBox.vectorsWorld[index], viewMatrix, tempVector3);
                    if (tempVector3.x < this._orthoLeft) {
                        this._orthoLeft = tempVector3.x;
                    }
                    if (tempVector3.y < this._orthoBottom) {
                        this._orthoBottom = tempVector3.y;
                    }
                    if (tempVector3.x > this._orthoRight) {
                        this._orthoRight = tempVector3.x;
                    }
                    if (tempVector3.y > this._orthoTop) {
                        this._orthoTop = tempVector3.y;
                    }
                    if (this.autoCalcShadowZBounds) {
                        if (tempVector3.z < shadowMinZ) {
                            shadowMinZ = tempVector3.z;
                        }
                        if (tempVector3.z > shadowMaxZ) {
                            shadowMaxZ = tempVector3.z;
                        }
                    }
                }
            }
            if (this.autoCalcShadowZBounds) {
                this._shadowMinZ = shadowMinZ;
                this._shadowMaxZ = shadowMaxZ;
            }
        }
        var xOffset = this._orthoRight - this._orthoLeft;
        var yOffset = this._orthoTop - this._orthoBottom;
        Matrix.OrthoOffCenterLHToRef(this._orthoLeft - xOffset * this.shadowOrthoScale, this._orthoRight + xOffset * this.shadowOrthoScale, this._orthoBottom - yOffset * this.shadowOrthoScale, this._orthoTop + yOffset * this.shadowOrthoScale, this.shadowMinZ !== undefined ? this.shadowMinZ : activeCamera.minZ, this.shadowMaxZ !== undefined ? this.shadowMaxZ : activeCamera.maxZ, matrix);
    };
    DirectionalLight.prototype._buildUniformLayout = function () {
        this._uniformBuffer.addUniform("vLightData", 4);
        this._uniformBuffer.addUniform("vLightDiffuse", 4);
        this._uniformBuffer.addUniform("vLightSpecular", 4);
        this._uniformBuffer.addUniform("shadowsInfo", 3);
        this._uniformBuffer.addUniform("depthValues", 2);
        this._uniformBuffer.create();
    };
    /**
     * Sets the passed Effect object with the DirectionalLight transformed position (or position if not parented) and the passed name.
     * @param effect The effect to update
     * @param lightIndex The index of the light in the effect to update
     * @returns The directional light
     */
    DirectionalLight.prototype.transferToEffect = function (effect, lightIndex) {
        if (this.computeTransformedInformation()) {
            this._uniformBuffer.updateFloat4("vLightData", this.transformedDirection.x, this.transformedDirection.y, this.transformedDirection.z, 1, lightIndex);
            return this;
        }
        this._uniformBuffer.updateFloat4("vLightData", this.direction.x, this.direction.y, this.direction.z, 1, lightIndex);
        return this;
    };
    DirectionalLight.prototype.transferToNodeMaterialEffect = function (effect, lightDataUniformName) {
        if (this.computeTransformedInformation()) {
            effect.setFloat3(lightDataUniformName, this.transformedDirection.x, this.transformedDirection.y, this.transformedDirection.z);
            return this;
        }
        effect.setFloat3(lightDataUniformName, this.direction.x, this.direction.y, this.direction.z);
        return this;
    };
    /**
     * Gets the minZ used for shadow according to both the scene and the light.
     *
     * Values are fixed on directional lights as it relies on an ortho projection hence the need to convert being
     * -1 and 1 to 0 and 1 doing (depth + min) / (min + max) -> (depth + 1) / (1 + 1) -> (depth * 0.5) + 0.5.
     * @param activeCamera The camera we are returning the min for
     * @returns the depth min z
     */
    DirectionalLight.prototype.getDepthMinZ = function (activeCamera) {
        return 1;
    };
    /**
     * Gets the maxZ used for shadow according to both the scene and the light.
     *
     * Values are fixed on directional lights as it relies on an ortho projection hence the need to convert being
     * -1 and 1 to 0 and 1 doing (depth + min) / (min + max) -> (depth + 1) / (1 + 1) -> (depth * 0.5) + 0.5.
     * @param activeCamera The camera we are returning the max for
     * @returns the depth max z
     */
    DirectionalLight.prototype.getDepthMaxZ = function (activeCamera) {
        return 1;
    };
    /**
     * Prepares the list of defines specific to the light type.
     * @param defines the list of defines
     * @param lightIndex defines the index of the light for the effect
     */
    DirectionalLight.prototype.prepareLightSpecificDefines = function (defines, lightIndex) {
        defines["DIRLIGHT" + lightIndex] = true;
    };
    __decorate([
        serialize()
    ], DirectionalLight.prototype, "shadowFrustumSize", null);
    __decorate([
        serialize()
    ], DirectionalLight.prototype, "shadowOrthoScale", null);
    __decorate([
        serialize()
    ], DirectionalLight.prototype, "autoUpdateExtends", void 0);
    __decorate([
        serialize()
    ], DirectionalLight.prototype, "autoCalcShadowZBounds", void 0);
    return DirectionalLight;
}(ShadowLight));

/**
 * Class used to host RGBD texture specific utilities
 */
var RGBDTextureTools = /** @class */ (function () {
    function RGBDTextureTools() {
    }
    /**
     * Expand the RGBD Texture from RGBD to Half Float if possible.
     * @param texture the texture to expand.
     */
    RGBDTextureTools.ExpandRGBDTexture = function (texture) {
        var internalTexture = texture._texture;
        if (!internalTexture || !texture.isRGBD) {
            return;
        }
        // Gets everything ready.
        var engine = internalTexture.getEngine();
        var caps = engine.getCaps();
        var expandTexture = false;
        // If half float available we can uncompress the texture
        if (caps.textureHalfFloatRender && caps.textureHalfFloatLinearFiltering) {
            expandTexture = true;
            internalTexture.type = 2;
        }
        // If full float available we can uncompress the texture
        else if (caps.textureFloatRender && caps.textureFloatLinearFiltering) {
            expandTexture = true;
            internalTexture.type = 1;
        }
        if (expandTexture) {
            // Do not use during decode.
            internalTexture.isReady = false;
            internalTexture._isRGBD = false;
            internalTexture.invertY = false;
        }
        texture.onLoadObservable.addOnce(function () {
            // Expand the texture if possible
            if (expandTexture) {
                // Simply run through the decode PP.
                var rgbdPostProcess_1 = new PostProcess("rgbdDecode", "rgbdDecode", null, null, 1, null, 3, engine, false, undefined, internalTexture.type, undefined, null, false);
                // Hold the output of the decoding.
                var expandedTexture_1 = engine.createRenderTargetTexture(internalTexture.width, {
                    generateDepthBuffer: false,
                    generateMipMaps: false,
                    generateStencilBuffer: false,
                    samplingMode: internalTexture.samplingMode,
                    type: internalTexture.type,
                    format: 5
                });
                rgbdPostProcess_1.getEffect().executeWhenCompiled(function () {
                    // PP Render Pass
                    rgbdPostProcess_1.onApply = function (effect) {
                        effect._bindTexture("textureSampler", internalTexture);
                        effect.setFloat2("scale", 1, 1);
                    };
                    texture.getScene().postProcessManager.directRender([rgbdPostProcess_1], expandedTexture_1, true);
                    // Cleanup
                    engine.restoreDefaultFramebuffer();
                    engine._releaseTexture(internalTexture);
                    engine._releaseFramebufferObjects(expandedTexture_1);
                    if (rgbdPostProcess_1) {
                        rgbdPostProcess_1.dispose();
                    }
                    // Internal Swap
                    expandedTexture_1._swapAndDie(internalTexture);
                    // Ready to get rolling again.
                    internalTexture.isReady = true;
                });
            }
        });
    };
    return RGBDTextureTools;
}());

/**
 * Class used to host texture specific utilities
 */
var BRDFTextureTools = /** @class */ (function () {
    function BRDFTextureTools() {
    }
    /**
     * Gets a default environment BRDF for MS-BRDF Height Correlated BRDF
     * @param scene defines the hosting scene
     * @returns the environment BRDF texture
     */
    BRDFTextureTools.GetEnvironmentBRDFTexture = function (scene) {
        if (!scene.environmentBRDFTexture) {
            // Forces Delayed Texture Loading to prevent undefined error whilst setting RGBD values.
            var useDelayedTextureLoading = scene.useDelayedTextureLoading;
            scene.useDelayedTextureLoading = false;
            var previousState = scene._blockEntityCollection;
            scene._blockEntityCollection = false;
            var texture = Texture.CreateFromBase64String(this._environmentBRDFBase64Texture, "EnvironmentBRDFTexture" + this._instanceNumber++, scene, true, false, Texture.BILINEAR_SAMPLINGMODE);
            scene._blockEntityCollection = previousState;
            // BRDF Texture should not be cached here due to pre processing and redundant scene caches.
            var texturesCache = scene.getEngine().getLoadedTexturesCache();
            var index = texturesCache.indexOf(texture.getInternalTexture());
            if (index !== -1) {
                texturesCache.splice(index, 1);
            }
            texture.isRGBD = true;
            texture.wrapU = Texture.CLAMP_ADDRESSMODE;
            texture.wrapV = Texture.CLAMP_ADDRESSMODE;
            scene.environmentBRDFTexture = texture;
            scene.useDelayedTextureLoading = useDelayedTextureLoading;
            RGBDTextureTools.ExpandRGBDTexture(texture);
        }
        return scene.environmentBRDFTexture;
    };
    /**
     * Prevents texture cache collision
     */
    BRDFTextureTools._instanceNumber = 0;
    BRDFTextureTools._environmentBRDFBase64Texture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAgAElEQVR42u29yY5tWXIlZnbuiSaTbZFUkZRKrCKhElASQA0EoQABgn6hJvoXzfUP+gP9hWb6Bg00IgRoQJaKqUxmZmTEe8/v0uB2u7Fm2T7HIyIrnz88uPvt3f2a2WrMbOvf/u3PvvzP/sUf/N6//i8vf/lv/3v5H//d//Sb//Uq/5u8yf8hV/m/5Cp/L1f5hVzlG7nKJ7mKyJuIXN/hPwqXI/g++zq6rPI5u8z+WqfLre+zy7PrVv9L8brsMiGvk8XLmM/sdfHXal4e3ad6GXPdyu2ij8u/+uv/5cuf/OSLfdtEfvUr+dnf/d0X//t3H/7bf/hP//N/928h/0Yg/4VA/kogfyGQP5Wr/IFAvhbIlwK5CGQTPP+9z5uPeePJSW+yo2+s/GtN30Rnv1E+f5zxof9R/lSXv/nr//mrr3+i+5dfyX7ZZQP07Tffys//8R/l/9TtX7790T/7r/8G8pdy+/8XAvnnAvkzgfwzgfyxQP5AIL8vkJ8K5KsmMVzu1U7p5PA5AXxOAJ8TwPf7sX/51ZeXfcemqnp9w/W77/S7X/6T/vzf/7383RWCX3/z05/9i3/13/0PX//eX/2FyP8tIv+PiPy9iPy/IvIzEfm5iPxCRH4lIt/c/393//9BRD6KyKf7f488fP74/PH544dJAF9cLl98IZfLBZtuqterXr/7Dt9982v95S9+Lv+gF/3i7Spv/8lf/vnf/vGf/dF/JfKnIvLnIvLvReQ/NEngn0TklyLy6/v/34jIt00iGJOBlxAsdvv54/PH5493SQCXy9t2ueh2ueimKorrFbjq9eNH+fDtb+TXv/ol/vHyhX4Fxfbx7euPf/Lnf/PfiPyeiPyhiPxxkwB+fk8AvxzQgJcIrGTwFsiAEXH4/PH54/PHUgLY7whgu2C7bLqpQgHB2xvePn6SDx8+6G9+84384vKF/IPu8iVU9Y/+7C/+jWxffiHytYj8VER+X0T+oEEBvxqQwCMJeIngo5EI3goIwVMIPn98/vj8ESaAbbtu2ybbvl8u2ybbdtluSECA65u8ffqIDx8+6G++/VZ/efkV/sO261dQXP7wT/7kX8vl8qXIFyLylbySwe/dE0CLAr65B/9vGn0gQwRMMqgmhM/J4fPH548eAezbZd/lsm3YtssNAYiqiogAAkCvb5/k46cP8u2HD/rrb7+R/2/b9Wu9yJe//8d/9Ney6S5yEZFdRL68/38khG/uKOCnAwoYkcCoEXwkEgGDDq7CeQfyOTl8/vhd1QCum26ybZtu2yabbrKpQvXue1yvuF6v+vbpTT5+/CDffviAX1++1V9sO77WXb/66R/+4V/dgkbllQi+aBLBV/dE8LWRALwkYCWCNyMZXElkwLTMeMkga/P4/PH547ccAVwuctkvdxSw6bbdtYDbTfSZBN7e8PHTR/3u4wf55vKd/nL7DX6mu3791U9//5+/gkNFZGuSgZUQvnKowKgLWLTAQgRtEniTuEfwaELw0MJvf3LQzynud+53uG+X6y3gN9kul+2y6XVT1U27JCDAFVc8ksAn/e7jR/nN5YP+avtWfq6Xy9f7Vz/9w1dgRYngiyYhfNkkgzYBWHTg44AEMmqQUYQKOmDaiCIa8TmsfmzB+DnZDQjgcpGLbti2y3bZHjRAdRMVvb/dcYU8kcDbPQlsH/CrbddfbF98+RPZfvLFnAQeieCRDC5DMvju/vmD4JkEvjRQgKULeGggowdHkAHTYxihg89vu88I5UeGAPSOAFTlrgPopiqbKPSmCKreUoAAkCcSePukHz590m8vH+WbD9/JP335k6/+tA86KxFchv8jMvhiogE4JQm8XhfKqOAqx5qRPyeGzx8/cgSwbXcUoLJtim27C4Oi93+4v6VxQwKAvl2v+Hj9pB8+fZJvt4/yzfbF9lPdv/wJnsE2BogmyeCRED40tGFvksIXiSbgiYSRRpDNDZ6BDI6ghM+J4fPHeyKAO+zX7cb9t4tedMMNAQju5V+f1uAtBSiu1zsduMrHy5t8ePsk3376KN98sX/xE5FPAnm7/782o0DiUINXMkCXCB7/P94/e87AWUmARQWVvgMuKej9t1RLBp+Tw+ePgwngsutFFdu26WXbbl+rSvdfbnqAiuA23QcBgCugV1zl7e1NPm5v+LC96XfbJ/1W9y++fgXjA3bDYXV+MuhRwSPwL3JLMFYC+HS/LU8HYrGwIhwyNOF12SvgM4SgztdifP85MXz+KGsA2C6X7aJ6bXSAOwrY5OYIqGy3d5uq4P5GhABXuV6veLvRAf10fZMPb2/y3b7vX7+g+9v98/WOBq7GG7RNAlYy+Dgkhhb+Xxp0sE8IAC4SGAP/TbgVJK/PoJPBnAiwPKxsXfbbnRg+i3s/JAK4Q/4b9NfLtomBAqCickMBjy7BuywAUVyv8na94tMjCVzf9KNcLl/0SeA6oAEYb1i9g+FtSALb/bKL8/+t+wxXFMyswqiHoK4ToIgKqslgpg1qUC0QoYbvJZg/B/q5v4szHmPX7YEAsD0CX25OwEUVm9xag1+agKg+nxQArnKjAtDr9U0+Xd/k4/UqH7bL5YsewrcBBiMJZPRAp6TwQgWfjM9vgRbgUYGL8AvLWH2gqhesCokeUmCSwPsnhs8fP2YNYMO2XeSmAWxy2VQaXeDmDIhApf33rD4PTUCuV+DtCn27XuXT5ir8VmCJ2G5BpBM8/r/dEcJb8/0lEQMtJHA5TAlqNuLRhJChhEpSqFabH3di+G1AGj+W1/dyAR4IYJNNnuLf6+tWC9CHHiAtFhAIFLjK2/Uqn65X+SS67aK+3QeTDoy/IG2ogQ7fb/dAtz5vBgrYGqrwNtCHsVfgIvwK07OTQBURVNCBFpKCOjqCHn5L/67TgTN+fpySAC56nwSUi256kXsSuFGAVyLoUIDo8/Pz7fdoErr/v17lk162HbgHvFpIYDfoAJJfW4sGPjkU4VNAF8ZEcLmLhdc7kljdY1y1Dq9yLiI4IiRqcLujb138KIPn80ejATwRwIbtBvn1cqv+2J78/5EI5N4cJA8qIPcmwRsKAHDF9WYP6mV7VmrgLuTpxYTcMEW0LAmoQxFsuvAI8tv/a/C5fV2ZMMiKg++FCM7RDPRu8ebWY7VG6VJi+Bzk35MI2LsAckMAgwvQ0gC5DQjd3ABg2HQLAPpEAlZ1Bu7VV7MGHDFRAbo3VKsTbAY9sPWC/uvx86gBbDK3D1eEQS8pbAeSgSwmhepnJb6uBv/o/PzHLzxWA/X7TH77De5j6AGQi6o0CUGfCOD2X7cXAlCFQABtEsGLDtxuOyQB2UTQBKZe5GUPXgkUYCUAbZJRhBDeuq8xBf+bgwbehDm+BFQi2IJksOocvA8ysIMfxluVcRsY/eB3JzH8GFDAXQO48X/dcIf9jyDHptIigDsFkEe066tBSETQUYF7ElDdYEBytN4+rk9UcBPfrKaZqFHWcw3i4J8/X4ev2//bSXqAhwTay6OEIPLD2Ipt8OtAGzxkwLw9WVFRjTc/qC6H3+YK/b1oAA0KuOizHfieCLaHHiAb5NYTIC9EMEbZrVEQt1xwhVy1UfBh8PUOquMizwaap3tQXfY5B//tea/NZdfhsvbz+PURQTDSGWB87VX/7WSd4KxjUqrIgE0IUkoKGnhIvwvawpGf6eECXJ7tv4qbA7DJgwpsKthEmmYgfaAAffYF3HLxo0vwNjJ0SwRWMG4db4eh1gPNm18vQ+us/0eGmxDemu/fnM/X4evq/8342ksGHgLY5LyT/zg0wM8lcMjgGFXwqIOVFJBQw99eCvF9oZL9Mfl3QwAvIXDsBRC9R+fz8x0FPBLB0xJEpwUobrfAkARgIAF41h3wQgP6QAmX5E/7eI43IxGwwf/moIkRyWRJQIPgt9CA9b39nzt4bYUWjAlCjWDPgv8IEjgLJfzuaAsrv9VdVG4OwOXW/fdoA35qAdL0BDwvf6AAUVHd8LIEu94A3K+Q+2YxaB84MOH62P//qoo38fCRDERE2zf0JfmDa+MieElAjcDPKz+mRKCOtdgGtXaBjgNJ4H2owSpNeAW/rRH4CaHSpMwnBYYycjgSJwfie9CR6mPu20Uv8kABF206AvXlBMiIBPSlB9wjBW1fwEuSb94296VCqgMaGCt/G1BbExi3IG+r3a3J6P48Gv/J0YmEYoiGY7V/SxwFCwGoE/xa0AJ0CEiV9QPCJb1OJ5F1VTjEY2/MO9AEJvj1BJTQpqLfTlGwjABuzT962e4IoKnyrdh3+/6mzDVJ4PHOxj0JqGKoy20+wBMN6D1gLWi9NQHfVP5MEEPzjGYy8BMAOnTAJgEr8HUIejRo5xrA5xkR5AngmiSHs+zDDAmMgWzTg55GSJEmHE8IvWPAoYTfhWak/Wn/bQ0CGLSAjv83SUEfKp5q24LXuQICpzrjrgWoza8xVE00CQCORdhMJuTUT/rjuls0gO4Iby8BIEgK6gS7BsGuTtDrScH/fR68biUHNVGBnxjeNyHEvQe/ve3LZQqgG3rof6cEclsNflG9J4KtaQ8WHcVBHS1BtHE4QP9OBMS98mpbKTeDW7dJwRsnHpMBTFJpV4I+b0kY/NqInVFSyBLANbnMSgBM8F+Fqfxq/h657/Up+GaBnwV9hRqc9bZ/vA6vu+T9E8KPJWns94UfTeCj2QXwCHS9dNL8Xf3Ho/rfewSeFODGDV69AU0y6NFAE1DP3qK++rdB7/1HRxf86gT376zOr99T/h/ioBiXWQkgQgVeIrCC/WomhDmQK+hASI2ARQZKooHMLdCJwGEBBXC3+uERwg+VOHZ9ioAt9H80AI06wGgJ3nQA3BoCut6AhxYwgcPOFnxuFnrphk+NIKIGrWPQtgz3b0i7Y6D5rs1GKqTop0nQX52vmQC4BkjA+r4a7Kx9WLENGeegkhSETBCrNXIMdi/444Rw1n6E96ry7OPuj8UfLxtQ78NA2iSBbg7gIiIbdDLsb5agPhLC3RkYKv8NDbS2YGsatNRAG2oQwf9ZIOydgy1MAzBkAw8UwEEIDzSAqdPQ6za0PkeJAMH3Z0wXniUSZoHvBXU2mcjQgv56TedIKglCpIoQfgwCIjOytd8WgN0bfxoR8Fn9Gx0Aj5Zgq0lIZbsH/ibSJoFnS+C98g9ooHEELI3gliy25yONIiE6pb0NfBlyNEYyENoodkKwgl6I6s8kARgJ4ZoEfuYWHLEJa0LhSBXm7kImGeSfVdoJ1DO2G7WXsehAptupSOoyrCSF904k+6vt98X/ZcM98Hsd4JYIXhQAIg3/f9AAUYhsLQKAtkHVBnzjCKhOoYl2ym+iBtvzDzQ2DLXJ4PUmbJHAVnBQX4jkxfvHhNDqAdHXGQJgv0aSDGItgOseHIU+K9hXnIJzkoGlEKzNHagTdJ6VWEUH4iCKH4fd2AwDPaYBm4Wgng4gQ9V/CoGiuNmD04AQtNGMGzSAAQ2I2pzfogY9LRh7BrbOh4+D30sAencljFu2CUFrwY8UAWRfWwGvVOVfbx2uIILM0pwDv082dUTw8hYs8L+uIWiHGpWgClnAa1lMPJogovvvbePPs/q3Xr++kgCsfgB5oQF9WYKPJqEn6G+OE3i5AqouF59FQOmahQC8rlPLj38kg1c2f30vw+XaoIX24/pMGIgSBoZqoH3wo0sIIGlA9PWcCPrAtpPB8eBf6x1o6cHra+2+tpIFP4PgBfxZtZUJfo4qxELT948D9ucK8Mt9+ccjIQw6QJcEbrD/1g340ATuDgDkFfx6twSf1f9xvuBECYxq/7ythQQGm+5JDx6Brw4CkMGT3wgscCUoQ4sU2t6DR2ciBjTgtcpenQoZVX9NuL4Owc+dVaDursYVkVALX+shjSBKBuvCYDUZjE5BdNkxdHAUBexyHwB6NP7Iyw7sxUDViwge1t+mz8B/LAvVx/c3PeBBCToB8IUGOgqA3iV4yUg6UAOxaUFHDx6CYS8SorMOue0CCJGAf5YfRhoAI+A1CvwxqNkAY5yAIx2EQmkFfeWOXi+nEdSQQA0ZHMEItiagJArQxDXIrj8nCfQi4HZPAttrIahso9oPQ/2/JwV5JQU8zw+7I4D7/sBn4EO6rjw0FR+i3Z9fHtahzsFvJgM0X+tmVH5vaYiNDGAigewAz+gyNLThnjCURQFR1b9d3lZvnVqmj9mEPDKIUIC4KCCjBXywS4N+otp/Hk3QVthOkwEKlV9PQwXjT7s/zwF4Qf9toAAzFdjuaEB6S7D1//U5FIQu2MevO0rQQH8ZmoXE6B/IkgE60XCjVoq8gt2iCG0S8L5GdxkM1cGsfsCMArSCAnrr7dzAZxCEEpepvB8tqHJ/q+bmJGGts/AcAXFOMMeTwC7Pw0B6CtCtA2vWgonqBQJFSwH0JQK29OB2kvgj2HHXAoyeAIsCQO0kMNECAhFMqCBf8mElAkyBbX1tJQP2RJ/ha0gpAfS9l+/5n00CkrQpq0MZbOdAuxmMvHswog62jZj7BnYQe19b14kxNq2D/ehX/p68HEcF+x3yP7z/V/A/q/5DA3i5A/dzA5pdgbKp3v3/wQF4Bb70WkCTHGRAA6+KL0bFl6FJaFw0ImZwm6igSwbbwPn9RMBWf3sN2JgA/BVh/Rg0kQBgePf6HglAHLFQwqQQOwDjbdVxNZjR4iM6Qa3WxwvNxh0JFb3g/WzFQQS8b/ttKcDWoABtUMAd8j9hf0MB2uDXhzX4CHj03L9DBU3Qjz0C0l4mLSLQPicOOwZoVCB6P6dA7nDbGkVuxcNr8PU2JQO4wX5trEqmccZaHU4q8oCDFOpzAnOwqyMIMktNNNAHouDGxO37DgArQZzlmp/14W1QlqHTMaIIx7SCx0+5yza7AKJ3IXBrNAHVDcMZAU/BT/vgv/ULPOA+XiLggAREDF2g0ci6xNDRglegd7P7TWWH5oJfayliEg7bScQRBVgI4Ookg/F6rvpLWP29swREqA3CaG8/FpKqS8DTAV4TiBqIqtxfzaQRLys5I0XEFIFrPbZRQb+16Fgi2LvJv8EFUPW1gGfQv1T/F/d/HBnccP7rAwnIIyHI4ArgWeGbU4eHy6Tx/EeTZIb5bo/BsMBjmjBE08f/RB0PHYBd9eVRAGY7cHRwiBf8WeCPHY1bgBTa9xKTELzEkQX9CPtl0gJiqsAmCT7I8xbjivh3JGFI+D2nBcSJQJ8agDX+O9iBL7UfG4bzAkcaICrbtYHz1ycSmGmAjJfL3CMgT3tQpmrfB7gxSzC1DnvdhQMieG47u75+kTouKNkM8c/+vq/Q7ZYjO/hhVvRq8F/9gGfhP8aqE9EIdR6LTwJ1h0BItyDqB8iFwuNqASscRnYioxOg9ApvnYA35f8e9Ohbfe8J4rknoFkO0lmA2gmAG0YK0DkB4ieEjiLoMD8wBzom27ANZkzIoU8EMHk/uo1mzeVoEoRWKn8L/62EYAX/lsB7D/LXg74uAMr9oGivJ0CNJCGD6i9DhZdQF+gtOp4S+NODRzsDVbhdgv4BqTMNyIL9SCKwL9/FGPp5oQKxIf8A/UX6r231H7YIqLML0Ae2GtrADOvRQH5b/MPE9dt9BGLNG8jVTAQvIaK5TtvvvWQgDvyXIClUA78S9Nfg7VtIBlO7cbsEYkQDMot+ygQ7QwmOawTHnAM2XUSnJvPIYRYMmYPS+sv3J+cfP3d04JYIXsF/EwMbBKB9Q9AY+BiSwFj9mzrSXmcJhFPVHySTbgHJCPvRQ/z7G/SVUETsg0ZF+i3CRoCjhf7y1A9mOiDD7TwdwEoEXjLwAv+avLE2B7Jnb+OqDpBoAchoQJskxKnss0vu7Q2YhcDv4ySeLOg9GsCKiUIihP7yfW7zbTsBh0TQfN0iAWn9f72Z56/Ax9P7j5OAH/Qvv3/QxKfk0DgDuP+R3USg3bzBC7bO/QT9Eeh9QvDPG7glBQzJwK740lAFFgFk8P88CqDGAa223YckWYhr+c0BPdwetl2ocnsfzePAWcVnnAIp6gDVhDLyfV4nqFEDPxHsbWD3k4BDkN+pARqKMLYBPzYEvxp9xmCHQQdgWH/9EtH2TIFpu3AH/cdGydv1j0TQbRrq+D/mLcX3ZACZ15bF378CG0My6Kq/zoGOQwhASDFwFbxyNGBuSxbCEhQ/uEPe/6gAERWQObCVVfjPpQX+rexxYhYFxIkgpgX7Y/vPs+Pvxf9vwt8kAs7i32t3QCP+3SPaTwIytQXP38u0PESm+YER+o9B3vr8mETAUfDrEkPI80ck0FZ0dXh9U+HRbhey0cAc2H7A4y4egoD6y8JfkBiigLdFP8v2W00E8deT2IeAKujZ/QAVKpAtKI20gLWksHedfgPcb+0+NEHefd9vB9rayi8h7J91gBbaw20MsnWAF5xHkyDUCOoXp+yrOwwxcKj0aL6fFppaaKDv6OpHR5sgx5BAlK/+fYhuP1D196o8e7lFBaKqv5YIMnFQpd0FGVR35RJCnCDaABaXBtgbiSwtICMtalKC+1JQ6bx/PLcDPQL91QFodQNKpwOgF/9eqcBxBBqRcKAAVk+ArQOMx1RYGgB6naDhlK+uQQwJYx4meQbxtNnYQwMjt/d4f3M9ZE4UOld1LAh99fbfzOxiEkKFCkTJIUIMUeVnJ/9sDt8/e1NEJOi9oVHDGYhgnSLss9DX2IAqw1zALUncKcDr0FB5NP+0cBQNrEezDiyiADPkt9qGpwoPdL0AGPx/NOKeyf3b9WJNdfcFv6bKd2cLMJVfJ6Y3B6wB9WFUfWWEwKMfGiQL+3bz9XGQz2EHKhF41GCtZyDi/gUCsNhYoAr3UNJ58YidHKqnMb/6AB5J4N73/4L+t7mAkeeP3P+1LNSB/l0SkMEd8DcEuUlguEw6t2AU/PCE/q++Akw6QFf1u6SBrj1ZnnhG50AfkoGIdf7gJv1KcSfgzWWkQ9U33Z3tHXYASKJ9e/YhU90rvD+q9Ej69/wxYJVs506Eg/r3DkMDzEdDBRGgcZay49XihLA30P+l8N+hf1f57/0AoxbQbwYaan/rBMirE9Dk+sBzTkC8JNDEUlv5McB8PP19Y01Gayep+hC/2zvQ/2HGLAurowsNGlA1cnqGGzeH5weiYLZm7h3QQC4O2tXdhvMMk1ZS5ebpgI8eMrPvPGkwaxayk8Yc6PMOBPEdC1XZ+2UfbfOPtxLMQQAG9BcZFoF0gp/RKjxe7+oAw9T7ZPWhgedodgz0gf5KBtrtIZhQAZpAV1Bi36w6t98qVfH7hqGI318lLCjLCUFlxRHwqYEH9a2qb4XjWvDT7kBwfbZA5P0+PNuRuW1yf4yNQH3zzwv6b70QOJ0G9OT/dhoYRUGT15uQH/71MjQLtQlxfDuiCXrtM+SkA+icQdH6sU/xz7Ze7FlubV4TpoTQ2osdpaEjtqADmEU7OkBEFoLeC3IWFFeswJXKXzkboNL+wzcFHU8hTGKIboO7CLi1/P+5F+gydQhuvRbwEgxvtACmANikhLTbj0gCYk8KdlYgmj+4Ymaod7TwahwadICuX0Cm2fE5iNHPK0x/CDV66Kyg1MnqjNFBnhBoLQCgUULfaVe5nq/6EQWY67bXCszUb+7232fVPz51iGB12owK9peyP1T4raMFF/OEYJP792mgXYfZ04GHMAhBkCSmSj+dKqRPgVFGHbpLEGMiGFeQWfSgrY52VxaeDUPSNJI0P7NoisG729HHl78z6hxfs9rV3m4JjgM/lsui2qmThjCfDFSb+I9vwUqG5wwL55U7C+6ot8B+7N2o6r3q37T9trfpjgmTvv7PSQATLLeRAOZhIJHBQfDQQJPBdUwEbVW3+L08EcEE/9G4ANrCeWcnPKRHDupbNynMx5AA9IRYLmrc/YLSiD5EaEBS/s/TgnU9ILcH19n+CpHwegLejx7Mn/d25fdN+e9U/1vgb7bqf08MOtf8EXxaoh+GY8L6gDfhvs4i6HQ7seYI2sv1GchdMsBIG3xlvxcCRzdgCPTn+6q/TW00VE8Q9FaFv+R2VlOM1vm/hhjhDCdgNflVKME5B47I9xT8z0YgPAJ8myb/LqHy36j/Mwqw9AALxuO1JVjiuQAYLcFzIhiEPe05fk8tRjGw7yWQbsfuLAT2VqOId1osnr0F49VM8INACPHDoBz4B5mqqSnUgyh3ArjXxfQH5BbgUS8gP7aU+w0zHD9GGD0CGHf+P1p/DeivlhU4BbxR9a2kYFR58YaDZCUR2P0DMmgED2eg77puegy6PgDphEB0CwlG/i9d+/Hs34pBEQrBn0W51mqGnJAk3ACCHeiqkQ1XFQA5AlKH7Lk8yJKWY3/nym14h2C3JvxeMwD9ZVMz0BPMi1n1RbKl1cYhIVblF3G0ATsRiCMUvoK9//OgcwYMoe+ZKOLlC6/Xk50br9NFz9fanqA8UIYSpCwlBO4kHc4WLLBfBHVaKwKgLQjmP4Un61Vq+3s7Bsyi0WztmLjJwJwFeE0I2vD/1Q6MVwefxfUf32skCPbCnxQqf+QMPEUDHZ7vGeyj020JgkPXXwsldA7SYR1RE3h94NvNtugswcgxXEkIcBPCGZ1rmrgDC0A4K88nm2fn/eTnpQtWyZfybRoK8Dro4zYDIMGsf7saTBzvX0SMbkAD6o9CYbsfMK38cJKD9l2FJt9/VGs0h5Gib33pxMKWNsigFUh3G2un+/N1WUglI/EEx8fq27vUNnwsiOoKecL7kQS8VnWAGCFUgn6dBtQhv40CmIYggwK0uwDHRGAuBXVdfwzHUjZzATLMAoyJ4FmBhzaWBlrHld9CCWpPHRqofBqMReMGTJ78q9rDes1Tv7/0m0v0AFHXNR6P6g30SHivin7V1BOhh3iWPwvps/yE836L2XiwnUT8x2iHgfqhnwn667QHEE8oLQjEvtEW7GYBZDrDVkwNIO4G5GiBDf9fGoFM6n+vbEtzXwP6u9AduaWnGYSLAlVdl/AU+ikrSeEIKgwdaZ4AACAASURBVKj4/wtgHcHtdO2nWKcBkPfxcvnNQvsj2Me9f02r76T8q0IBn9OLKfz1HX8yVXQYGoAB/2UeBQ5/5kCL6+H/OGGoRnLSwdd3oH8r7KkGTbgIxEwVWvnF8KOpHnyzfF9Jod5Px+IF1h8owyitDw/XEgRb5bPqbt1uvn7qBIQ16vtS/u+DP3cR7CH0WWJgd5mTJKYgNzoGjQrfvu99NDBC+bnyW1x/qhTatv2OaMKgJWPvv5kwnMgxHYGFRtJW8VMl3uP+MgoqSZyWFKr7+KIDw1d6+IiOgZI4+d5iYL3imzbgyO+tph9t2oSBxOM3ugHtPoFZ1LM0hF4kXNEBssvVgPdjdXZWK7uKvyS3q1Xb1WQwtVDqSUggq+Vw3t56JA2cz7PXOwGNW1ecwxPhfe3QEUsDsFaAz8jg0nf+iZMAHNg/XSazDuC18Iq1HBRrOsAQ8NLB+16g614jmuSgs3bROxE55D+WDDQNA4ivdMJ9M1b309UqknaDU8ObV9/PwmMPATvTMAxpABLBzugUtV9bLdhNDQA+7B9tQJ06/7QNDHGSwtgZOCIA47InIoDdROQGtt0U1HI3GaoUnCnC/rzBMQJteN17+VaAzYNA7e+PFqHQUyXPUYB7iQYa5ZFjq1Zqpx8Uqu/XT7+6BWC1Xaj0GlBIwMoHu7UzcI/6/Acb8KIq+hzmGWmAYnADrIpvKP7TZeLaf0LAeQkGgebbq9FToI44p654F47tekKkI0L5PQNZPsDwPBpy/ni+wKMN76Vav4+2cFZFf8+JwAraMt0DFB7beA/u4Zz/a+RXx0M/ct4/jwaNAS8G17eSwmta0Fhx0VRxJkHMivso+onMXr+YwdWKbgioy1jp4x4AzIKg5lEA7wvHEYCRmdx11TAuT6lDLVl4KvXkAET9P4RT8H2u+lg9EPQIpw+/NpJ7RwE8HaDv/Mu4f3OdNkq/EfAiEiOANjEALvcWL9gfFV4NZbgbQc6qPky4Pm35QZxtH1f4j+P/jXuaYPcWwIEH/fmEPBoAO4m4LGxV3txOQqDU+dXgey+UwSzuqP++uImO/u/6ogCb7wTc1n61sL+vZi87rxnrNas+giTg6QLzaUCjIp6JfhwtGI7AjBBB9JjDY4ePYVR6ZPgN4owVv6Q2N5hhVHwNeYrM+w6dN6K1sMHZm/Ce7bHe3dzKr1xw1w4JrSQMZtgnoQHlr18fzunAszD4qurNUg/TDqzx/lfCaO6t4tACMUQ6P6htWjDPC1hCoZ8kpODzJ70MUR9AODcgwyqyPhmE+wfHYB/hvSqt6qeXUShhXH+d9SR8DzrDaZZdpSp/HxqLMQuATgDU/qDPRgOIeT8cvz/h/XC6BtE7ACLOWPE0KIS4UUjmZaJ2grBphiWgT41BUVWZfP3AnEIT6OrfoF122l2rMycBoU5i/OXoUZ4/aglsXwLzHNU++FVF3qikOj5HXm2PBitT1WuvJRAB+6O//W0/PY8vQH5IrAsMs/WuVmAdHBrQgrbOxJShXwRSsu08h8JMBpo0+aDTALwV4tbswgzHrftG/dJKIAQb5h9KCssWIMeto+GYqG12/HWGjx8kzqNJaa0noMWOr2KwW01AMwJoNvhMQda2/RKQP/3ecABM3g9uD6BY68Ntz9+nDOMb5iV+hIE+dP/Zs/wwJhJ9mgBnohBuStABUXjugF3hkXF9ZZJAjefKdHZCc389LoStKvIl7QIEb1d9RyciQgFDI9Cjyccc/23Aam7/PZJBhgDgin5CtQvbCzX8ip9YgIFtOAt+w0owp/hOiCWgEGbVHuYjRigPGR/YOnEoqPDoV5z5YqB3mRq2ox5ICmSSgAP1Ne+XV2NE+/vuFbCTRADxtS70VRBCjgBk2OyDUQiUgfl77b7DwaHm2rAZ7osRSOOUoHgKfNBSLI767+oDYrfwZvqChSpGfj3pFwZFsCJg2jeIQQBUiyI4WgD68ww4qO8khuWkkIuDrxWv2nv+UTBpJYiPd0KemTA8qqFiuUF1jWS3BoG6pADJq751JqBI0wvAVPyMQvjcX1zbELltKK+zBiXRFiRxG+b7q3M9xuLdzR8g0gCGNzSM5gNYfqGO9CBT8OHct6oB3KsSDBisUnwsFuISQaRHxDSv0vptt2oeLHMERfRn/FG/Cx01EpgIQG8LP+/i37PKw53xn6sYCM4/JwSRrCnIeB1ZkLsawDhaPKv/njU3wnZ/dBdGE8+YTHSG8+ofGgIjsC19YnwdM/KAnTSsqj6ig7uGgIPw3nYFzhhIIvriAxFP9CQd4HSlnzgxONIdrE7A8ZDPx9fjib8ifgegNIliRgdx95+E1T7+3nQVNNhEzDgGA3T2rEDLduwtPpuuouPcs8swwXFjdTaMKt+jA5gUAQPcf95KJQxYU0cYxEDvsBSmYuukp7AwnqniC9Afa5z8vboI68ImT0t26CvwBzSggkj447r9IojvCn7U92J/Hw0QSdwZKNNjxPCfSxRqnATkdwpOwh88oc4J8KTSm/wdbZjrc+4iFP8YO0/5JJDCfaijK5xVXevqfg6zGRrQf83chvX4aRfAE//6vv5+6490U4ADdO7QgM/5bcHP/n4OtCQhBEFeDWSvos8DPq8/IwzLzjpa8/U6MMSkBklDm8e0mn3QIY7XG1Om8wzN48y7HwhOK3P0/ZwUQHHv4psbdoVeb9VlAjChBCdtDDpOKTh9ZfcagOYq31RFjN4/gwBYzp8lAwYNwBELhZoxECeZxMlAzWGdCRV0fQWGHo8+8Kx+AAxnCIzowAxy9KvNepWfsfp4RR9kUrD88CPVTuXRybhqqTHcnxEGndsgub1Gdug8yz9fHt3Hpl57x/mfCOC29FOSQ7/noAZR5W3Ob24UMpuPYAYiQrQgk1gnFoUIKr4vKFpV15pHUJO3Y5rfH3UFHU4bGkU+NKJ9f2hJyOMxDBDpjAgwiYqvk5TqNl9EH2Arb6fA3yaA4cBtPWewhkEcIQJBlGzYp6zRmr1v+e3Fv27xpzvyI44NGDkCIi7CGNV9Dw0M8NtHC2vUwHINumCGNG8erxOwtQINsW88Tlwdoc+F85nI559ngEDpt2F/Uu3hiXYrkN/pBFS26hYDAkFgErMK67y9mGBA3L5ore5izf8b3n805MOq/t7XU4WHv1DUF/5gugCSOAIW/59uMwl6CHWAib8bvfxWl9/rBGEMTTwDfG+ezEYG4yk6FvRPuPwE+wvc39IRjENWM+/cm5b0W4Pf4WuKUnw/vD6eDbB1ETs5vl77Dhnm/51g6wPWwQAqxnivgQaeS3gy/u/1H4hpTPrIgHAN0mSgXUX13YP5PMIuQAfBr/f70cdeE+QoCX3i8nFMLcAjInBoAIYqt1LhC1WdtvmSab28AYffaeivCB+ohdYQgfUa/WS4ToMsNLHLc9nnvPZLwn1/EefPVf+U/xvnCVSEQEkEQEnEQJO7S7RvYDxNeNYKrG7DKMhtsQ8cMmhgPKKKj+F7CiHYFR5KIIPxOmg5IVAtu3ACQSPh7CzUQOgAej5CWEkIe3vgxz0ROGO//qYfz/dnLT+ZxDr4QW0eNCJBorCFOVC312Ec2TiY5Bk0cAaQmiA1VH1MOwDHQ0kHdEDDf+2UTWhS4Z8diQMicLx8MLBfverLcP/jQzF0P8EJj5+NGK9RCz755S6F/f1+X/gxeP+Wsedv+vF8/54aSPJYFjIQd624MDz/UDLQnr8HU3ztKHRf8Qeno1vyAQJBaLcMtTV3cvgP56COCqd/QP9xLgBkH4BxO13n4hNUDtACC6G1S3zqooZ6Ba4lp/zcAFb7iERKQwQcF39IFJjdXECGADw0IE4gg674pYAnk4HoHPx54tD5daO5vxrugSkMjgiiqc7TVKAT6AT8R4ckbHEQCYR/IZBxJgA+XZjsR7vaoRpIxWqeqfXuGC2CxwudicwePEB1kNkaZCuwyF0DuKv/4sz9mzP/Qxdg3BDkBTMC8Q+loD6UGBzx0Kz6eAX/KArOQTlPHFoI4vVtf4rNuLrca9edRn4xBP7k8w+9AgZCgBfEUZWfEs8iFNZ3UO7TqmkjCO/rWdgco/yIqHcQWaC2EGTzgz5y/iXQAvyx3riyxxV/JeBriaGB9OrTA5g9/eokM+37GszqfA/UZk9iW5UnCtBqBl3XoNN6Ag/+zy6A5evPAp+TIFDn15gQw9rjrOzFX0s2JBVAxa/nP1a6AsNWYGjPNGPLTQgBsNUFvOA3Ht9o/rGDN0tWOCcxJGp+f7++kkP7PxcGv1+GjkaLt/fawpwwerQxBJNW4b+PJsYEgiAYYdEAGIlDNaAbRkIgK3ut0jKByp+8yz23X6GttmBmjwDvChgiYLP5V/zhH6/110sGcKo5CkggCngxnIPoPja0j2B+1BRkiYJiviaLJqghDI63G2nAgAxMCuDdnoD0wIQm+urMB3VuAwbBrFGgGgnhAFqg9+ujKsLxB3qGCQNEEtPinIQlAj4WgIw7/iXc9V/x/yUWFs2KH504bAh4aYWf4TrTLGTy9YbftyLeVOWNfYNyt/ji29mQnqMAltU3ioTtbX343yv/1u0YPUBz6zB702tQucnX0gWaFh6DgPdmhXaapGotw0SFz1qDiTMdd8h45HfcqCPRUhA3+NmKz1l9teCPaMd4urGaewRitNBDdahR5c3AfQmDCFT9vmtQEwqAYXX4XI2n23Z9B/Yb1FL+LWox6wHGbZSo6FR1LzyG+3hriSZvWT6jfXhl2cmQZJDrAbuYAqAHo1GA/EOgD8eGcU7A8eDvH4fQBuAhBL/Zp/vamPTrRENDGLTV/7E1WEPLDlP/PwzU4YhusIMUgfIPAr6Dhv5R4y2r8ldFwiFoYHnmr8TAHbhRQSZOctH598ZYhqt6wP7q/ouqe77RJxvzFYaji/z4vna4v5cUMDXqDAJ5ytktqtBDckyjvJg04hl16LB0xFfyMfD77PZjErGQRRjYIfSvoAXntks0ok8MsUC4KARWnYPlJBeIgLeFrUgDOHYCag0/XNAbWgRwQuLAsaQwIhC1g7+jCNKuT38JfnYSyTi+QQEwwHeT4/dWHYxJPxfOj5oAnRQqgU3YgGZSOaDyK3n/qkDYBKptzR3oD6B4fyRKjp2AzSl80YR/3P+/1vBjX18Jbu+YsrMRgbqPP8zrDLTAaupphfeZtyPs9BPztpLSBZjowF3woYRwBwOWaqbev15b7X4RWsiqYiY6ZkFEIoUwUA2OrkeEQE8HYNyD/rl3m88jCGgO/nPW3xy8x4Q/HBcM1dYg5q8N+B/SBSYhtD0EY1PRGLDoKIBHF3yLz4H/gSYQJRETgqeB2d4vC8L2NVnQn4PoVJJAcP0inahAfdXVI8CFszjRagCTtRdV7Sr895NBpRKXIT64RMFw/iw5eChhEvmmyUIH+k+Qu3cLzOAN6ILlFvgWnx3YWFDz0f38ze9GlfP6UQ3ojEY0gtqRIEbA5/WgQFhsEuIeL75uTzvqHktAWfj/OD6sQXssROcGiRgFn0QVkld7OznMDT7CJKzhMIqxW9B+LCOQdH4uyxIcE49VTSeLj0wKjzcp2oDXQA8YoDEGBLMW0BJw+eAxXejPV/IXd59/tp5rVyYXDw5BlRetSpQAcvgfOwVM8ObzBq/AQ2wX4lwkQV3vNhYFfn2LFgaoDU1ogqsfqGkJYmrj9Tr22KQwBLzbLuzDeA9yzyJjVRfwegWq0H+FThDPA6ZhZwX2M2Kh4waovCzAWJTzD/qY00c+6PM8coz08VNqglzx54LfHuTJK7z2rwX35ABLg1DzsZ7Qv7l/f2yXDlbf4C/irg0MJ0aCuD0wP74MrxfdFlX7tq+vtRdCpvt599EG9Yz3V+P+Oj/n4zLruZHcJ7oMt/MNp9eD6HEeFb6/TMfbWo85Pb79HJo8t3371/PuIAZqMvjPC34nVV6ZB4hEuA7AzA5cfU0y2n6ux89D/35/n2/vWY5Bf0qwf3tPLISO1Tap9qzFB6eap/beqI94NCCbGwgqOItY3CGl446CaQ8i2Q9g0AvmgJOnBoAA0gu17tsKtKS7D4udgCYERy2QIceCX/P7mBW+g/7D9S6Mn50CS0eAoQPDcBjopIA5+EcxEjLweRjXq0UbLIjcBxsGx2IZvlf0ATjz/6qypAmY7bhrk4ahsIis6ccXKHdueAfUgk+RWPCLh42c6zEeKyJpRTdRAOqBbl/Wq/uT+q+Fx3FoTIuCzc6+hN8j4veGjuAnhSE5gKnco3A3XwYlq2sq+lmP4yEOpqEoG0M+mGDYuYT0pKCFHgLHKt3T7T9p8GcWH+n1UwGa8X6kQt2x4CeqPexegT6o/Z4Cr313PHdgrsS2ZReLfpKIf+IMFnmVmwxQ9AhithYT73+p2s+JIVfrjwiHnpAZrSsr9CMstQXP1+1+510N/q8E/YoekMN9OMFvi5LvkRDsy9rgFCOoPdpgaQIWBZjf5KCSQszZJ1ivTvLokpen6tsJAVND0NFqb6GUGg2Im4Dyx9Pn7/0dm4pADAslJzTv+dKNrAPQ0wyySm7bj1RQgbAXsRa4R+mBJzpaQmHLmy0BLoL+Nh2ZRca8uUc6P37k97n451fvTieAE8BdZ2ItqFEK6oOJIYPsiU4woo140Oh+H/UC++gatHYcOFT+2y3AYvD1rM/fpxdUcsAi70c0OxAEP45X/hymE9XeoC0zfYhbcqfbhs09HpwnKMDR6g0mmYyKth/UcLl9ITGQ8N1S6s+gA1HvQCc2pluPvN2Br8SyZyfyxPP/VhCi1L1HWX2CQCuAE8TIq/sBYdANZmTIwqq0sb0HIzhhugBeUpBZLFyA8y+EErsBUYDZHYN9QAAooQwOws+uQlhdESSSqk5Qsh8LSYI6LDS1AbmOvLlRBqQIeITvM36+TP63VfE5hFClCTr9zEyVFwS3STQBy66DMHB+PJWIrfgGnYBx2dTboPa2X49GaBVlePA7CFx4iaGi4ns0aLVjMGvtPTDtmO4XEE8E5Kb/8qYai+NHl60LgAICcUCoJPVeiYG6Pxw/X9VFNVbFn9FNPzXoIRDTyzcpREYB5Fm1EQQn3KRi9wKApR8Tz48SwxnV3qM0q7ZhpdKvr0zfY+gO4oQf+EGPFYW/Xf5hwWsUgxiBbShGoGIx+D2eH1h2EeR3UQMH4zMaUKr4033nzkSkfQADelFbLOQCalxdxvN8mInhPas9bxtGJw29Fx3Y8429MAS0fL33Oeo7qFZeiToCC3B/VSNYuU0fgDnkhxGgMFdxiYEY7MYel+OHPH30IMeVFK1C79l+QdXVpFqHlMAXEf3EYDyfkkGdNvJ8f3RAXU0jpgM7jMNA5yCrtfzOicKG/M9bgEkEjqqPPDEcDfqVwGZv6zcO9avDfOhf4OmLFd9OLBHHdxp51HvOBlnAoQksYjASA1xnIhPsapTCPjbsGB2YevpPpgM73EYeSYIftgPgte6CWesVBB9QEgfnWYMgoeC8ql69bWoRIqYHvSIv/u26bj/jdqZ9KSGk74JRo6QS9PuTiSHm6Z62kLUGH0UO4rwWrhtRETkR4iKRdI8giJ2D2nUCMjsA0TXiVDb98NAf/rCMlajA9wesWHZrAe1dlwRyVI2jx4KkyUHSx7YDe6YD4tOC6XW01puEdAJwaEJzf1uATHi6ZlSCpBQscsh6C1xRcWEG4bCFeKcAVhVlDu54JQIkTT21hptIT/Afk0kMcS9BKfjBJozcDXCrtgbWXxbMAw3INQIxtQJPAGwXmYaBbYh4SCsuKwLOAQ5awKskCMmRg8P3xwlBfbosQaDqyZqBkyQe1CLQACoTgN4qbyHsPwkTiF2pYaj6MAXBmUosQHnUEYCsBL3MW39SNKMJ5PfoBsT33DVJCEbFnBCMOkHfvj6Xq8uw+dgRIhGgAiUqf5QgKDFyhe8nnYrlqn9sG1GoAfirubygX4H+8IM1CmQrMFAJ5ExzKIp54nPoVU2Auh6eBShDlTV4u5c4HE/fVvjFrsII0Ik6QX+Iq68jB19ziLoKC27FYe0gC+j1RSS+BgB7AvAM3m8HLdy5fV60C8RMVuhD1ieQB32MCCq0QPJuvuw5IHF/geMKwOPdpmsxBwVEfGEOgeincJqNmuSFIPhPq/xM81CWIIi+gCFBqDX3QPYd2OcCRo6GZBoA3AM+00aesAOQ7/2Pe/vBCXoguD4OBD1WfPwClzcui12AuH+gC0gEwW72KfjBCQRBr05D0IQc7N8PzOCMehPWK384MPVDJQim7yDdoiRTItzzFV/ZOX9sYFetP0fsQzb6O7wOoFjxk89YoQXv+BmSN+yYHYO+BsDRAXHhuJXsEFbdIEGZQWUkNVNzGA9NZUVBIQL7jASR0AclE4Pb7JN3BO72mG92+o8UG3nybj+mASh0FsLKn9GPxDrEcS2Au35BzHO1BksriIJdpqWjKR1wlpR4fN977rZqI+XbYjYDgVDpcYQalOYKMiuQbB3G6Pu/HlMbi9a0EMkksXtjvvXTfgMKAEZRN/i/O7yD8Da2S2Bdh3ICWfp8yuMkYl5a4df4vVWt4UF0yyqEnaT6swYyWB8/j111Y1ERS9oB0SLMtBGDEBD1PEHwtdjUEAHnqmoHU4wCDAoAS+lHwtu9eQLUAgmxVvAuMB9cELMV3m8EUtcBYYI9nkNIEEJYrQeUHfnzzRyC39j8CgSkir/E0P2odnAmAqDnDIhqrtV9BDNS2POjv/0pwKr6z1h/PMz3uf9ykFYq9TtoAXSwpz0HljdvBCVAPY6t7osv6gFhMpkX13rcfXQMIpuTsfTibkfOPRAC2meLRipI4mDPwMD5x+v3+Ey+qEfACwoUEkKQSMZxYJDz9R68PyP43yvo2aYf881rNQbZgRU/jp80QnW/hdXqJxMvCFxXQSNHpE8QiF4XI+wFfQcw7VL2Md7RRajsKgh2D+6SLAKPF356+/7yXYBTUgFy/38StUjFHweD+iiHh8/LV/i/TSvGk4L5x7F6AsIKbgb4C0YjgdGRIToGUx7cgS3JKP8pRcgak95BJGQbjaJdBYQ1qHYnYHL8F45QgHx2gLMQ2cDxBD/4SeR0LSDi5XzPQNjM4ySE/HGG6g+ugltLNSARn281BPtNO72eJLjdX4ITSEgpQvJYFEUg24f1qAYQNQdxx6Q/RcB85j9f+03zf2QV33IDPHegNgPABTfqFR8cZK9TA7/ll0EQbUUHW8Gr1d+MSadia+LRHwhunv87yWoJ3h/pRDwJAbDNQQFd2P2mH4kP/wDT/ZeN3CK3+ZjvgVpw4r20AMafb58j4N1UMknuj6iCx883PU9g2VHVH5JX2eEcPghSgRBCKPzK0Q3fknwPN0Hk0CyC0zBkz//7duEetgFjVtypASDI4CsknYJgYDhqsBxxy29+eyxrAZX75EEf8f+CkOcijMDDHx4ASYGGu8WHgPwpHJc0qOG8FgFTuVk0cRZVePFwHEIUEu8xSHoL5qWg4I7/HgOKXe2dcnu2SSdCGIDTA+AcxY1zYL6Q6AAFu+/1GvjKPSeEoJV3NiM4Dz9C6oWkEav+NWjPWXNOIkKgNTi2I8LeBgaZHJxqrC4oNXoB9pzzMws/OW3ghSyQJgjbygOVEDhoj4nHLld8HPD6UUMFVLIgKrTL7cFoBRLQgEdXIseZ2/HhFPKbk4d5tYWwwR0nIFQSD2P5gQhs6meVfB+Bkyz2fOIvX/zxqsSODuAGIOLtPNnmIPCrv6Kqvgz3q4tCwNl9lWYfnsdHj2HTgQw5IBHwULmfSu1jEV3gDFSxTBmqSEVqiYK2IkWcRiAkwV/cyW9YhqHXDw9dkNQAcO6HFNJT7oChfrPUYc3KY17zAd+evAwF2w5SCKLV4EuCEKsKfjBVWHu9Q9Arh4CoBqEMWYBsNX7YgKP/69uC3M7/mOOz232QT+ox4iCyJGEFP4oBHd+GVvXBwX35nqp7qeIbV6L6tdZub3ueJ+gBIKgC6S5gOQFxDoGr+Bv2nzqbknd7ph/EmXzO0o+kZdc/wqvQkAOUffVMzKtYgx5Vob1/+HAfCdzHSiXHenX35/2JTr3KZ9Ruj2lYiMhLIFoNyMq9hFroeYMTE0bSLbhb4l3YlFPa6hMd2jk8dmrDgdQCnC4/+ANFlYTB6ATlx2GDGXP1rvL+SnWHw+cJes5/rRWt4H2pw9GklD4uSMpwasIQiaYR92gIyFX5S8dtRZt/nCAH48VXW3hRE/HKOsGquj8EM85Q9cfeAV4XwNGAlmIFIwPYrfLKuxV476RRetzcdeAsRSZhiHizCKEIOHn3EMOWy5X4uIJnXX6sFiBFLaBm/THOQAkVJK9j6TKwiSDTBWpwHkSPQJX7U959uAkoaTUuug6oQCBz1Zlxm0OJSIoIw04M+7zCGuYiznCfHww9AN6Ir+HXA7lfn2oBSJ2FOOh8SzINfmcAyITq8JX/sOMPx6A9LeYtVfwgCBZhdu25OB9/XmWWNPUEPD5dUuJ68wd1AqD2+w1PI9KxE9BW5t3z/igdYGWiL7L+wPv9jgVY8f0ZcbCKCuLAHN+c5wa69Zpr0J9t2KnpAGzyiAIPiFalJ8/xXrrA6Y+/8NoDnWCPNwFJzf5DpVkHte8hx76P+HU1+HEytEeSEIzAsu5r6wPJGu6oLz8VrKofXLce+ywIHhNa/Dmw8LrptWXZ4NKZm4pr/QQ7Qk8ehMrPtAF7PQCD309QgRgRZMKgAbFREAfBBXNalbHA9cEHMo4IgIUuPjjBWEUFEQpYTkhVO43eRiynJw9Jjj8TOUIlJExK+0wA4gWgQvcFBHAc7P4/u78/Ff4CC5ATB3P3oUwFClYgcALcxzp/B9Ez4DUV8RjBbsCBrMH4dLNwIDaCGhA6o3pXksdBvYBsktrXDgNJKAFy1Z+ZGIy5NXgXoBT8a3ZgVSPIUAMV6DjLxhsV8wX4n4ibbONObHNyCr8Z4FinNFjg8ziiF5zSV8A99u7Zdf5OisvVaAAAG3VJREFU/kIPAJLWX3hUIFD6o7MD4WkHIMXBk4IftSrPNBJVk0OoC7ice8HGS8XBKDoz/YFBLaQi392lGpCMJfhD9xVkx5Xbj73P9V4m1j0v73x9FjDDPlYvATkgFAVWcdNvJBamliOjAwRV0EpeRymAe717kMYRyy/j5FwFBX0fP7Dyx8gq8wn2ZXi8GfGYR+lFcGJSxa3Y84WgzBHetlU4cvKY44Ps4iP9fsgsPGEhQTAcHqwwGCj61SoPexKwasXFqtxq8qhD9SixoBBYcJEDNzmIoi3J7QkoJActVHocTVpPBCDhElAvMDK1PT/Sq3DwB/ygmyB9GNhYDH4so4Foy48kkPtZfZEv1PQTxYpyX0EI3Bu+/5krcN8fgwVdwWu2JNVNWAk+PcOOPMNdGFyAZ5Aj6gicgzNfwuHZg0HrLxBWfjSRl88fVCo/apX/IBrIvf65ZxtEoK9Bec4KZIPLe76osQns46NwW0pUPCPAyMc4A/KXOwZzFLGbAqD5xhhbgBcWfoJBAlarcCSQgdQJ+Movnih4gjZQTw51rz588y/ZgxVUEAQ8soCfX8OR26JwujCLGFAMsOjnwGrlPuQw9D/PPv8BYVR7pG/eeFtQpsLzR2KFI8SwKj9KlX++HeLOPuSBKrKeHBi7L4b+Kx184+ptAp4Trcscv69oARVYzWgaK01H1X0K3zNSmARKtxXYHvwJuT+8gLGGWgpHcWOmBeljFB2Ckg6wiAYOqfxEK3GMCAj6kIiTWdCBCXhkjUKMgJcLk271N9uLSbtvvK0S69OXAvoA5z94VsFubbmZvx4QAnXgBnJxENyQjy38wef81uPhxMpPJIQzr5ckuUTKe0wZyN57iFTWga8GvCwlh5UqvYgmaNV9XSxEVWs40kkosFwA70RgNOu8mLZfR6wDiwRa35y7j08NksqPQhcfkRBK/J8R75Iz+9C8gJpqzwiIeZII3QnYOkJWbVEI5jNuA+o2BwK82ifwnpSgHwaC+GNAdmW2VXfC+vPu6wR6lBj84C9WfvivZyUhZMJlJhjSukDlFJ3g4AvGJfC1iEpQJ/CaEd7G9wds7p71+odruKrHip/C7RdsxeVjzIxhoNkFGOW/+sk/YVAGtltfzZAIfzix8gcHhZCXpcGN2u69qWqD9OlRFAy7x2fQBhHUiETB+DocqvArYt98f+AEAXApsEmEcNLC0t2uPHCqPQIXwHYDfI4/9+8LMpchqr5HK39MJSrBXwnutNqjovjHFdq+fcHLp7YLR4mGgduW5hFpAXUoL4cTTuW5HJSkB5PC0S7A+8c+837DyoM1J9iv/po/o3BunlDqPjOSO/YbLFd+FGy9sxKFeT8b+nLNPrkAyD53FtT27yUS32yqUaEGTMBiASGcZ0FmK8nWxbvjC1q6WQC4VdWdAcBY8eFoAzIrC0b7Wt8wlPcIdE1FhUWeKU1Igv8Q/0dl4k/NnYSxdlDon8diUDeuQB4c8XVzcahRgyyZmNC+LAgeCfSVALde8/t1DCYawNoePGT83wlOpFUdOZKwxn89OsMEf0X8CxJCBN/dwKbFwkSMgx0ACJJDJD4iC1JEYh6XcEqVHpx4+J4I4UiAl26r5x64sttvSlAn3LBuQCz6edU8C+J5epBrC4YP52EFDgHrCw1B0eU9bOaTgh3wmYvQV3Oqqcf53XnVNXUBELX1xtSgFrirlII5d3HFulxBCNEfZx0h7K2f34XwdHpuYQcguN189Ow/nPXclaUcqMH5leCXjKOjbv3F0a7i2ZaRHmBe5zwnhA9S736ZC8AH8LHkg/T5znYgmES1dtuzGo92qwHIquiWX+4KgVLd8utv9Ml1BQNhEJW/FOgweiTguCUoQHkEwYhjfQIgm8eAzPKzHqAG5xGiiPyxeGRRaYetUpDVpHVC1T9bHGyaknb/TQTnuG7rDYwYCUT7/cMjtILzA+Go/FPw581F/mWeTkDuBsBCAK8ki+A29nMzPn4Rzjv6QV7xWW4fzQFUxb9jQQ1qc28kMi4mDl1NBr4usIsz5ltZqNm7AeJXfuTHd7nioLEyPBISU+8/tP1AC4Il/n+YGmjg2NiBRdl6yCw//zG5ph7bqaBuz8B4VMU/TqSsNPbwCeZA1cdxyG9SgKzRZPL+GXFOiH1/SFZ9wX8M3zUgvH8a4rMBjZj/h1W9MrwTiN6MlsCKiI4gycBzgV/xUaQGjGDHwHiYi0VIzeEAasCpNuL76AC7BIEl7i4AIxnAfoMxk35eJbZ68wWEUChs8IPz/EEE9BkUoNA4RCWSLJkY1h0Y/dG9bVCtUVPe7QRhtStXG4nOECDfUxc4Uw/Ik8JkA9o9+a83IrfHH11EdFUWc4phNgVFWkPsIHBnCvCCYBSgqEN9qtoXuwHhByYoJJA7BxIkkRwpDGgAHo+vQ3ZGOwCFJCJKUAx4MBpFZWvReeLgtBBkDDQu2OJxXa7SE/P4ZiUPHABjY1DsFIhPAaygWewiXK72hHjow/k8gCL6gKES8qcDZ7A+EhYlWCPGCX1wXIwzkQEKt8cP6iqkC0FEhFj/ZYtvXCtwuBLcDT5wXN+9H6ZEIkTwV/x/s78fXFX3siWHEKrC3tw7EFZ31Ll7ttknQyEMGgAqCaVe1bGk8r8nFWCQQR0h7CY0dsU/mIeIuA1AGCo02Q0YVXxub36sG1Qgfo0CBBUXxap+ECFEycQVyViBEBFPt14TK9rZHB9EwMG7DPXOv0OVHkdtx7OSCXfb3av4CFZGTwQBwT7/hKPHE4PzpJ4L4+FM9r1n8B+B+9R9I4Fu9brYUZgCunZWNxdQgIs8mASBQ4F8hJpEiaf4GPihk8FdAxin/kybjZjTj+mAQy6ihZ9whDvHAWB6BKrBXQr+5SBfqPaINwiz12UIwoTmbPACZY/fshBBBKNlW8ZCHwH/cVKSOZMm4Mxk4OwE9JeB+EFkn1IzcPQoiSB4vGgNeJSoik1A7m0TCmE/HrggB+/1M12C1Z18ACGoIeH1pH2IhAqFWgBq+kDFEWAvA3X8tpW0cnSD5WAOriOHhnYraF1eLTkS8P/QsHUBdtMPnOrMaANJE9AZiaKWII5Ue/8PTHn/UcCSTgIF2xN4zdmAQYIAKeBFl6FiO0aKfq5jcImHfPwTxcEdRmD3LcFoAva1Hdjm9UgGggI9YOoPkOBYLsT8HlG3nucMDGkOOJ8CkNOELdSO7D5qqAeJYBb2GpABgRi2gxLITgrOQ9C937HgB+0i7MeRx3gfPWCXLtgbLJAu/gCFBPzRX8eADJqCvA3FViC/BlOQC4LZyrBq8BdQAOUKoKjqR7v7EFfVFMojPgEoSlJesNIePyLHwW9NRgq7E6HvUN8A0yj0wyWDHRZ3J2A1jHdMyu3hCGwSDwdRir7h9VP7AKLgPoMCgKziOFLtrUm8aIFHlgxYfz8WBYUU55iAXauo+evJaIK/NTgRJM9sUcZRzcCnMdNKMJc7usnAyrpxHYkTRHK+n1HxS01LheAHqRWwKIDqLvQC0+PupHZgBawfVGsiniTVHwZHRqbUI/D4Cd+ftgyLAR1ehkIiqaKFw7MJEwUIuK5zsu4svoFYCFKgBJZACBuppOId2RDkPZas8H9kULcA9a0KTCQDGtpnzT+RMJiOGseHl4BQ1C29AWUXIIf/OIwwqoNEK3SCuA7FRiBrE9B4/PcrGJ1OQNj83F4Xbol/TgVHfMiIZLAdcaVkgh8sLrd+liNQH/FqsNTfj15m1J0X+ffZuq/gTY7QnvIfJz6UzBJLs83ItQpt3RfZz5iuGfNPajpngUm0R8DoA5jDlzsOTAwZjzsC3Jjxg7H914PjlcskGdghgx9HG4OOQH34uwQyzz61/0qiYNQjXxECuWYbGM/DrjtPH/Mw/K+gBLLSA+cEfPr4MroArzcDuybbr8Zc72i2UnzeHnTgzD4Ug78SzIvCoARVOQxaFFR3TzWnkkHUVFShEuqKxZnKz4p4YYcf8ZhYhuu8wFgSHcuuwCJagI4bgchJQK/qe9c/RT6nGcg6KGREJpb+MI0EY/b0jcsni3AJBeCQNsBOFVYoApcM2Aom4VFgIRdHpeIG8D3YaxBD+qCiQ+rBOSVnci8hzkAG1t/pgHA4uwDzmu8xFKkkkIqCfkIRs204r/hiDgutoAAcowBMZ9+KS0CcXVBOHCvJw2jMQSJyeoeExF2DuTuRcuWAo9sefyUQ6/oBaIjPtiRH1KvQKvygAHb171d+vc4GRMDPoxN/kL5pwlVh1mBQ1quQJAJ5j0TgOAis+h8d3mnC8xTKE34+8sDNjyVXE6nFMN+H39TQDmocHScENvN74LoGScGU4f7g6IG3n3C3qnG6JBS+Z5tHOOzRYQx+u7MZmAl0OSsRLAS/VIKfRAWU92+12aaVPksGDBWQuCMvgNy2M2Mt8EwqbjosZAec5xLEAmXmcFTHiOWARWglpNpjdEtBQRxJJU5VL5/7F1X86XntXgUK4q+KggsUoIIK8oA+kgy4+zLaACqQGTVOX6MBWdehL6BxHn+tlyBMDGAqufd7WOX5WTJwKYDfXJJP2GXDPk7Tj5Ed7BOG7DMFaBRAJgI/+H2Ngeb2SKb0zkoGlQBHkefDr7xMA5HZeJPtKIzyApI9gmnPgf1c3mulfhe0gFekDCdNFnrOwi4Gs6eTACNjB+Uegcgojog4V25P8bctRYY6RL8AJklE9ACFAGZdBEahd4d4CmghFhbzcwaXYH5qTlS6DY+KfNH5Avzjo2JJ0poDkSCMxLn73H/eB+ifvgvyIFCWAji7BWC8hd0qj0FziMdrS70BlVbgamIgcmotGZDNPwm0L9l5iHv7WRoAFx57ScFS2r2iwot8oKu8l+TOCOg2mZ2nFdjTgOFQENzKkJ8OjEnsE8f6AzyXwT6MNF3RDRnuj0Lwo6wTlBMDIyqaz6G+RiLJMg/KUrQV/rh9uH0tWduwoxmky0kSMQ+rnXxZsGadgnxfgk1pCnsIsGYltvfdzTOBIclIsN8MLAGcz5gBwj94AE8DuC9Molip/JGwB57nRyJiyD3pyk6q5ij+3TzRLohcqyqCEQBTepF15+WVmW8SEr5jMUUkx3oMIsrH3ndwAQganKzyMpOJNxMQooGBYwcByw7axIhgPRGEr6GSGJhkAELoQ1YRg+dPeD5IIRDIqq5PA2Jh0Rq0YcS8XBi0ghGRFpCtWTdum5+yLOsQf2EuYY8AfnbQZDgCjHxBSKwTGpt8QCIDVH3/4H5OwEvldhliINwAFLsEyyIfGKV+vm3eEehVqKTdNxtDiPoLHCRiuwTJxCECxMDqDjTvZ63KaPKvRgV2i/F3ohm88V8LN8hgJcXD5pVGIPPNn9EBqSQC0I4AMxBUcQNCkarkFgSn/oCs9GCVep4eUG5BRAOcQOCWlGSc3If0IFqRfURQGRrKewPKEJ9sLnIowKCcw+f48N6UHjqYtgInaCCkBbPSj8VEkCr2g8U43wY1xX/BNkwreQrzg+oaJghOCGTU8RBxuIp6VFOGoEXgEsBLIgV6gBgxoLSI5CgiYNT+GBHsU01GthrceiMUtv9KgAYktgVNeGrBbtiOQVi9x8WjiAW7UNUnm4Vet7WtsFgDCDYEwQ/EVL1PnQf/xCDLTowTh4c4HPRDoQaiwhKIAae4B7xgCBydI/CDPOrevK0FR4p6w3VfoXgQiB3T1N8Y1PCD0X19JqcHGfzB5WkQE4p/kdeXBcEVUXEIFqSij82lMyrWq/7c+LFHA7z5/dwOHHg8s/Y8C2CmhbmALtare+4UWLfb25BmXABKABTniC8gRAP2yvDAiUAsElnrxFzITQa/sAFecAOY7zPV/8jMQHSbWAiUPGkQNABhw85xrSCv+mMSzFR8+7mjw01A8f4F8S/td4jnDHYxpT8/OEyV3gz2+GTfdAeAszswfJNGlQhEIjB0Bls0BKn4Iw7WKu9f1gmSagmvqleEwJwnZwjO7npz1HdCJ1hS/mlBcRXyF3i/M7NxqJFoeH27z7nnJaBmpUZKHsTbGUc1ALEoIGsGYl9ixS50gjAT/VhB8IzvGTrBVfWEz1MzAkRFTtecW731VdjNQPukVdhdn0Y8d/a7WYH6i/TBPBzUFwAlHwtGHOQISrgb1AMUgDETTA3+THAdeRJhg59V/Ektofa9I8wxVICkC7QQSAd2O3cftzPzdMK6aA4iZI4ILfYRbb9RgqICt2AxVnYZ4kkBvHOBxT/zN9ybHx/f5Ql2fkGCX6ANm6F8WCfqAS+Eq5AGcHJd2IFHagTMHAAj+mWBnDXuc81CjhsAi5dL2K8QCYI1aJ/PJtSSxEFXASv7C2I3ZB9/a0j/7nDn/j1pHsz9Jr8fNpxPBUAUUYD4wz5GBlmyAiORjtAIGDFwzSUwqiNZ1d1tPiB7/Q9VeI9KeJU16/knkEeQJEALjY4rkp74fCZiMDSA/PgvT/aT2gYgp5E/P29AKBQAo6TRth5T4VesQFb0i4K7RA2MZpgyFXCEQHCOixuYMPgy2L7+45ezSSKt2oUkURlpXkEMOLSiXPuDQZjk63N5bmzOSxQdLHX7AhwUEA0BAeQPJIQzkAuFlOK/GtyLdiGDKEBdllQ7YouxV2Xdwza9So4Kp5Z0yAgUhTlJgFzSFrznIHYIwKcCu2/L3LsCg6UI1b1/CA+ApIV5/32HqOIjdQusE4azip5Wc1b0q/QGIAlaWEJbXP3r/L+AEipw/+BtkQVY9fIM2i/ZhgVEgJO6DZ1ksVtlYdoQAPhVO0oKmYBmnAYco4DRCRB3TwCziptaE0auER9/VzRqKNOEYINOQg2m1l9GpGNQAhh1v6UmxNQh2M4+LmlUzll0OTjYQOaGlZAEMCrdhmBphaMBwBADrSQQc3//He8KgFETT7p6BHnjj2X9EXsDjrgBS6ihoAmcSQVYmE4JgYWFpp1waAQRoqDzxDhU+HxSnZHz/9JEY6Y5MJA+cwoWrt99+U3Mc/9g/NQTFaigAEtwB1yBzwzucZSX7RZEILhR1d5GDCsBLVUdIQvsldZfEJt5i/MHx2hGJZFkVVyK242iFeh58oBUFqIQbkfp2DV2X0CkAYgv1sU+P+I/HmBu8nErugdRnUWhfp+A/ddlbEH3uQlBsNobUEMHasK1HOYn8BEEvCUaiuigXRIKj+sGOPA4KAWz9/s7WxcgB4+a6/fI2osEwv4yOENAiPf+wQhbc/5f0gGisWuQaRFmGoIqguARWsBQgTTocDLMT5OJUQnhqdCEig+/EShKSEgTVV0MBMnz04BcshPnLk/+OaV0/dwKzB4QUt1NB6uTDfGOP+cNm9mEsBAFiM7AQh9AKVEU75vy68jeOxrUC4mDEuYO0oLqoSdHaEF2eXYYSm0V+oEOwpLmYFOF3Z4CmAeBTIGueiIw2xoKPzDBJVBXQ5g5O8/twwA+QguIjJt3+g0NQEcDfUXgO5gsqlTBLkQLdl86K3CWneitQ8sg/5oWAUJP2C3V3RoEyji5n4b9lB4t9pz2CA+cAFn1Z9I/uzYsU/ELtEBOCHYQQqGcFejV+yeuRJX31zsKV5IGjway9z6PLDxKwNEPsBuOEiqw57jGgOtZ1Y++T50AuMFl7hPIbhskiOwsATtRoc7rS7dXrpcgrMCGJca6ELJo+Y0be0BW5ZKGcFz4y8W9BduwcDnK9iO5fagsKpp9ANnvDPxeP8THNyIVFo1AMas8Qk5v2Ytm0LCCYAXqn+wQsPTBh/5Bcnne14Os3uCQt28vsK1WUESJFviBgAW//3u9PLxusXchcCR2WsNzv/ImvgZzzkUByDUAIrjTvmSHAowpJBQE4SUlxMxnARlQbIqkArVAJ6pBBvELCCKlkyCDAP45BYfEPfcUpfMch3Vn4bheYK4E66BxAxHSVd5INgEPgU/NBCDfNQ8Ho1CoINAPQAW/QT8OCIZlNFCB84XhoDChFByHGjx35v9BLgyhmojqHYb5QYXnuAecvua0hZe6BV9f7v4ibvgvamrmAc1TmaEir0LQ9h97eYAYVoM/nWA60i8Q3Ifezha9BqaaL3zvqd6IAuwwLSCCuCLuJWch4h30giPtyiAphKEBcCu9BV5wwzkMxID8rhMwdwMhcSFgrBT3RUTQboAUg3+p+Qe1IGarOioVnazmefV3lHpwA0AcLWCahUiXwePHWJsP+GH1gnp/we5KfOhJAbsj0H/BIEb04TbrTPsAyb2LLu93KwfCvn5PLAwrOXAa72eEQRo1CNdw5IprsAZ3hApy9zlcITG2vpCihsRSYxNS+J4vdBZ6B52eqRcQ/QXmSjAWSfa/5GA5qEg4iJFtm624AqXLrSA2gx8p1Mdqcghv41S0lSp/xAYs9gakQc4Ie2RTUYwYgt748mV+FU1Xgp14eW3XYZ6cdqGTNHwHICTwEeTPl0jEZwIgP9gDEaogeg5IHWCF+1eoAhvEKPB/EAeTRsM/pSAP5wjWEUMM1/NJRhwJbpJSgK7S7zF3EOsI5jBQBK9DV80Z8Y0COzvmWzJXgDl40KEC6cqvqgi4OB5cpgLFYK/1CvDiItXqC6/S87wfAUfPtxqfGNzlYaOjlf1IsHPPvffHgDAoEeEST4ZLZUd/RSo91/BjXY5ggWgQ4In3fyj4mUqPrInHOCLKO3wUwRsfyXpt1nEIRLrqcWeTuk7bigsbid1zD4iDRQtnIdQsyIXnFCn1I9D7ADgxEhOvR5AJosoUbu1FkJyYCi9OhQERoIx+4AX/YqUXQhtYEwKN4Cy1HntLMmtaAQpqfrT/UCoLSxeswjA5UWPPi0mjajUWxMTdVusNvt/ChMdmILK5IRMFu90BMEzFYHdg2GAgeYVHMMJIBTA7EFTx/5fpgTFXz9w/en0ZjD8kCDoKPNGwlB01BmoWQbh+AxR689mBponGJOr9OwmMu3dtJ/ylW1Tik4ElUPmR9RqII+pVhD9ychABMQ51gOIZg+/G+5mGIzLB1JJC5WhzYjhJ7IWmLDpA8jzsAafUPkB2WnFBF4iSxkq1ty7f25rv/+EQLOxs2oUdTSA9HIR9swdBlCcFe9owPC3XWDDC0ISVzsEVbSCF/sWdA5Fu4HJqankp2SeQCYYrImNalfmhpVxYrGkUS4LeSUjg8dD7+D7w/ybIfy7vlB9/HJ978zr7/45Qgajzj+4EjIK/ULHPRAOlKr/aG0AFcqCyu0GcW45Igh6JMJmhA49/U+cEssHNJhtXDC1MOya3j/sAiAGcrEtqtgjBD6wEzSDc7D8o6C8rIqAZyPk+NQoNLAZ1hR64Yl1FBY648smUYKnSg1Xwk/0DyRyArByMUobyByhCcPnOaPyoegREFS4jNfYAw+IHCjdC1J2WDZBke/OyN85J24WiXwDYPoJyYuCD238ulvuzwt6KgHf0shWKsqCFFGjB/w8HU8eeTED9wAAAAABJRU5ErkJggg==";
    return BRDFTextureTools;
}());

/**
 * Define the code related to the clear coat parameters of the pbr material.
 */
var PBRClearCoatConfiguration = /** @class */ (function () {
    /**
     * Instantiate a new istance of clear coat configuration.
     * @param markAllSubMeshesAsTexturesDirty Callback to flag the material to dirty
     */
    function PBRClearCoatConfiguration(markAllSubMeshesAsTexturesDirty) {
        this._isEnabled = false;
        /**
         * Defines if the clear coat is enabled in the material.
         */
        this.isEnabled = false;
        /**
         * Defines the clear coat layer strength (between 0 and 1) it defaults to 1.
         */
        this.intensity = 1;
        /**
         * Defines the clear coat layer roughness.
         */
        this.roughness = 0;
        this._indexOfRefraction = PBRClearCoatConfiguration._DefaultIndexOfRefraction;
        /**
         * Defines the index of refraction of the clear coat.
         * This defaults to 1.5 corresponding to a 0.04 f0 or a 4% reflectance at normal incidence
         * The default fits with a polyurethane material.
         * Changing the default value is more performance intensive.
         */
        this.indexOfRefraction = PBRClearCoatConfiguration._DefaultIndexOfRefraction;
        this._texture = null;
        /**
         * Stores the clear coat values in a texture (red channel is intensity and green channel is roughness)
         * If useRoughnessFromMainTexture is false, the green channel of texture is not used and the green channel of textureRoughness is used instead
         * if textureRoughness is not empty, else no texture roughness is used
         */
        this.texture = null;
        this._useRoughnessFromMainTexture = true;
        /**
         * Indicates that the green channel of the texture property will be used for roughness (default: true)
         * If false, the green channel from textureRoughness is used for roughness
         */
        this.useRoughnessFromMainTexture = true;
        this._textureRoughness = null;
        /**
         * Stores the clear coat roughness in a texture (green channel)
         * Not used if useRoughnessFromMainTexture is true
         */
        this.textureRoughness = null;
        this._remapF0OnInterfaceChange = true;
        /**
         * Defines if the F0 value should be remapped to account for the interface change in the material.
         */
        this.remapF0OnInterfaceChange = true;
        this._bumpTexture = null;
        /**
         * Define the clear coat specific bump texture.
         */
        this.bumpTexture = null;
        this._isTintEnabled = false;
        /**
         * Defines if the clear coat tint is enabled in the material.
         */
        this.isTintEnabled = false;
        /**
         * Defines the clear coat tint of the material.
         * This is only use if tint is enabled
         */
        this.tintColor = Color3.White();
        /**
         * Defines the distance at which the tint color should be found in the
         * clear coat media.
         * This is only use if tint is enabled
         */
        this.tintColorAtDistance = 1;
        /**
         * Defines the clear coat layer thickness.
         * This is only use if tint is enabled
         */
        this.tintThickness = 1;
        this._tintTexture = null;
        /**
         * Stores the clear tint values in a texture.
         * rgb is tint
         * a is a thickness factor
         */
        this.tintTexture = null;
        this._internalMarkAllSubMeshesAsTexturesDirty = markAllSubMeshesAsTexturesDirty;
    }
    /** @hidden */
    PBRClearCoatConfiguration.prototype._markAllSubMeshesAsTexturesDirty = function () {
        this._internalMarkAllSubMeshesAsTexturesDirty();
    };
    /**
     * Gets wehter the submesh is ready to be used or not.
     * @param defines the list of "defines" to update.
     * @param scene defines the scene the material belongs to.
     * @param engine defines the engine the material belongs to.
     * @param disableBumpMap defines wether the material disables bump or not.
     * @returns - boolean indicating that the submesh is ready or not.
     */
    PBRClearCoatConfiguration.prototype.isReadyForSubMesh = function (defines, scene, engine, disableBumpMap) {
        if (defines._areTexturesDirty) {
            if (scene.texturesEnabled) {
                if (this._texture && MaterialFlags.ClearCoatTextureEnabled) {
                    if (!this._texture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
                if (this._textureRoughness && MaterialFlags.ClearCoatTextureEnabled) {
                    if (!this._textureRoughness.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
                if (engine.getCaps().standardDerivatives && this._bumpTexture && MaterialFlags.ClearCoatBumpTextureEnabled && !disableBumpMap) {
                    // Bump texture cannot be not blocking.
                    if (!this._bumpTexture.isReady()) {
                        return false;
                    }
                }
                if (this._isTintEnabled && this._tintTexture && MaterialFlags.ClearCoatTintTextureEnabled) {
                    if (!this._tintTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param defines the list of "defines" to update.
     * @param scene defines the scene to the material belongs to.
     */
    PBRClearCoatConfiguration.prototype.prepareDefines = function (defines, scene) {
        var _a;
        if (this._isEnabled) {
            defines.CLEARCOAT = true;
            defines.CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE = this._useRoughnessFromMainTexture;
            defines.CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL = this._texture !== null && this._texture._texture === ((_a = this._textureRoughness) === null || _a === void 0 ? void 0 : _a._texture) && this._texture.checkTransformsAreIdentical(this._textureRoughness);
            defines.CLEARCOAT_REMAP_F0 = this._remapF0OnInterfaceChange;
            if (defines._areTexturesDirty) {
                if (scene.texturesEnabled) {
                    if (this._texture && MaterialFlags.ClearCoatTextureEnabled) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._texture, defines, "CLEARCOAT_TEXTURE");
                    }
                    else {
                        defines.CLEARCOAT_TEXTURE = false;
                    }
                    if (this._textureRoughness && MaterialFlags.ClearCoatTextureEnabled) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._textureRoughness, defines, "CLEARCOAT_TEXTURE_ROUGHNESS");
                    }
                    else {
                        defines.CLEARCOAT_TEXTURE_ROUGHNESS = false;
                    }
                    if (this._bumpTexture && MaterialFlags.ClearCoatBumpTextureEnabled) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._bumpTexture, defines, "CLEARCOAT_BUMP");
                    }
                    else {
                        defines.CLEARCOAT_BUMP = false;
                    }
                    defines.CLEARCOAT_DEFAULTIOR = this._indexOfRefraction === PBRClearCoatConfiguration._DefaultIndexOfRefraction;
                    if (this._isTintEnabled) {
                        defines.CLEARCOAT_TINT = true;
                        if (this._tintTexture && MaterialFlags.ClearCoatTintTextureEnabled) {
                            MaterialHelper.PrepareDefinesForMergedUV(this._tintTexture, defines, "CLEARCOAT_TINT_TEXTURE");
                        }
                        else {
                            defines.CLEARCOAT_TINT_TEXTURE = false;
                        }
                    }
                    else {
                        defines.CLEARCOAT_TINT = false;
                        defines.CLEARCOAT_TINT_TEXTURE = false;
                    }
                }
            }
        }
        else {
            defines.CLEARCOAT = false;
            defines.CLEARCOAT_TEXTURE = false;
            defines.CLEARCOAT_TEXTURE_ROUGHNESS = false;
            defines.CLEARCOAT_BUMP = false;
            defines.CLEARCOAT_TINT = false;
            defines.CLEARCOAT_TINT_TEXTURE = false;
            defines.CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE = false;
            defines.CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL = false;
        }
    };
    /**
     * Binds the material data.
     * @param uniformBuffer defines the Uniform buffer to fill in.
     * @param scene defines the scene the material belongs to.
     * @param engine defines the engine the material belongs to.
     * @param disableBumpMap defines wether the material disables bump or not.
     * @param isFrozen defines wether the material is frozen or not.
     * @param invertNormalMapX If sets to true, x component of normal map value will be inverted (x = 1.0 - x).
     * @param invertNormalMapY If sets to true, y component of normal map value will be inverted (y = 1.0 - y).
     * @param subMesh the submesh to bind data for
     */
    PBRClearCoatConfiguration.prototype.bindForSubMesh = function (uniformBuffer, scene, engine, disableBumpMap, isFrozen, invertNormalMapX, invertNormalMapY, subMesh) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var defines = subMesh._materialDefines;
        var identicalTextures = defines.CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL;
        if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
            if (identicalTextures && MaterialFlags.ClearCoatTextureEnabled) {
                uniformBuffer.updateFloat4("vClearCoatInfos", this._texture.coordinatesIndex, this._texture.level, -1, -1);
                MaterialHelper.BindTextureMatrix(this._texture, uniformBuffer, "clearCoat");
            }
            else if ((this._texture || this._textureRoughness) && MaterialFlags.ClearCoatTextureEnabled) {
                uniformBuffer.updateFloat4("vClearCoatInfos", (_b = (_a = this._texture) === null || _a === void 0 ? void 0 : _a.coordinatesIndex) !== null && _b !== void 0 ? _b : 0, (_d = (_c = this._texture) === null || _c === void 0 ? void 0 : _c.level) !== null && _d !== void 0 ? _d : 0, (_f = (_e = this._textureRoughness) === null || _e === void 0 ? void 0 : _e.coordinatesIndex) !== null && _f !== void 0 ? _f : 0, (_h = (_g = this._textureRoughness) === null || _g === void 0 ? void 0 : _g.level) !== null && _h !== void 0 ? _h : 0);
                if (this._texture) {
                    MaterialHelper.BindTextureMatrix(this._texture, uniformBuffer, "clearCoat");
                }
                if (this._textureRoughness && !identicalTextures && !defines.CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE) {
                    MaterialHelper.BindTextureMatrix(this._textureRoughness, uniformBuffer, "clearCoatRoughness");
                }
            }
            if (this._bumpTexture && engine.getCaps().standardDerivatives && MaterialFlags.ClearCoatTextureEnabled && !disableBumpMap) {
                uniformBuffer.updateFloat2("vClearCoatBumpInfos", this._bumpTexture.coordinatesIndex, this._bumpTexture.level);
                MaterialHelper.BindTextureMatrix(this._bumpTexture, uniformBuffer, "clearCoatBump");
                if (scene._mirroredCameraPosition) {
                    uniformBuffer.updateFloat2("vClearCoatTangentSpaceParams", invertNormalMapX ? 1.0 : -1.0, invertNormalMapY ? 1.0 : -1.0);
                }
                else {
                    uniformBuffer.updateFloat2("vClearCoatTangentSpaceParams", invertNormalMapX ? -1.0 : 1.0, invertNormalMapY ? -1.0 : 1.0);
                }
            }
            if (this._tintTexture && MaterialFlags.ClearCoatTintTextureEnabled) {
                uniformBuffer.updateFloat2("vClearCoatTintInfos", this._tintTexture.coordinatesIndex, this._tintTexture.level);
                MaterialHelper.BindTextureMatrix(this._tintTexture, uniformBuffer, "clearCoatTint");
            }
            // Clear Coat General params
            uniformBuffer.updateFloat2("vClearCoatParams", this.intensity, this.roughness);
            // Clear Coat Refraction params
            var a = 1 - this._indexOfRefraction;
            var b = 1 + this._indexOfRefraction;
            var f0 = Math.pow((-a / b), 2); // Schlicks approx: (ior1 - ior2) / (ior1 + ior2) where ior2 for air is close to vacuum = 1.
            var eta = 1 / this._indexOfRefraction;
            uniformBuffer.updateFloat4("vClearCoatRefractionParams", f0, eta, a, b);
            if (this._isTintEnabled) {
                uniformBuffer.updateFloat4("vClearCoatTintParams", this.tintColor.r, this.tintColor.g, this.tintColor.b, Math.max(0.00001, this.tintThickness));
                uniformBuffer.updateFloat("clearCoatColorAtDistance", Math.max(0.00001, this.tintColorAtDistance));
            }
        }
        // Textures
        if (scene.texturesEnabled) {
            if (this._texture && MaterialFlags.ClearCoatTextureEnabled) {
                uniformBuffer.setTexture("clearCoatSampler", this._texture);
            }
            if (this._textureRoughness && !identicalTextures && !defines.CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE && MaterialFlags.ClearCoatTextureEnabled) {
                uniformBuffer.setTexture("clearCoatRoughnessSampler", this._textureRoughness);
            }
            if (this._bumpTexture && engine.getCaps().standardDerivatives && MaterialFlags.ClearCoatBumpTextureEnabled && !disableBumpMap) {
                uniformBuffer.setTexture("clearCoatBumpSampler", this._bumpTexture);
            }
            if (this._isTintEnabled && this._tintTexture && MaterialFlags.ClearCoatTintTextureEnabled) {
                uniformBuffer.setTexture("clearCoatTintSampler", this._tintTexture);
            }
        }
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param texture - Base texture to use.
     * @returns - Boolean specifying if a texture is used in the material.
     */
    PBRClearCoatConfiguration.prototype.hasTexture = function (texture) {
        if (this._texture === texture) {
            return true;
        }
        if (this._textureRoughness === texture) {
            return true;
        }
        if (this._bumpTexture === texture) {
            return true;
        }
        if (this._tintTexture === texture) {
            return true;
        }
        return false;
    };
    /**
     * Returns an array of the actively used textures.
     * @param activeTextures Array of BaseTextures
     */
    PBRClearCoatConfiguration.prototype.getActiveTextures = function (activeTextures) {
        if (this._texture) {
            activeTextures.push(this._texture);
        }
        if (this._textureRoughness) {
            activeTextures.push(this._textureRoughness);
        }
        if (this._bumpTexture) {
            activeTextures.push(this._bumpTexture);
        }
        if (this._tintTexture) {
            activeTextures.push(this._tintTexture);
        }
    };
    /**
     * Returns the animatable textures.
     * @param animatables Array of animatable textures.
     */
    PBRClearCoatConfiguration.prototype.getAnimatables = function (animatables) {
        if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
            animatables.push(this._texture);
        }
        if (this._textureRoughness && this._textureRoughness.animations && this._textureRoughness.animations.length > 0) {
            animatables.push(this._textureRoughness);
        }
        if (this._bumpTexture && this._bumpTexture.animations && this._bumpTexture.animations.length > 0) {
            animatables.push(this._bumpTexture);
        }
        if (this._tintTexture && this._tintTexture.animations && this._tintTexture.animations.length > 0) {
            animatables.push(this._tintTexture);
        }
    };
    /**
     * Disposes the resources of the material.
     * @param forceDisposeTextures - Forces the disposal of all textures.
     */
    PBRClearCoatConfiguration.prototype.dispose = function (forceDisposeTextures) {
        var _a, _b, _c, _d;
        if (forceDisposeTextures) {
            (_a = this._texture) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this._textureRoughness) === null || _b === void 0 ? void 0 : _b.dispose();
            (_c = this._bumpTexture) === null || _c === void 0 ? void 0 : _c.dispose();
            (_d = this._tintTexture) === null || _d === void 0 ? void 0 : _d.dispose();
        }
    };
    /**
    * Get the current class name of the texture useful for serialization or dynamic coding.
    * @returns "PBRClearCoatConfiguration"
    */
    PBRClearCoatConfiguration.prototype.getClassName = function () {
        return "PBRClearCoatConfiguration";
    };
    /**
     * Add fallbacks to the effect fallbacks list.
     * @param defines defines the Base texture to use.
     * @param fallbacks defines the current fallback list.
     * @param currentRank defines the current fallback rank.
     * @returns the new fallback rank.
     */
    PBRClearCoatConfiguration.AddFallbacks = function (defines, fallbacks, currentRank) {
        if (defines.CLEARCOAT_BUMP) {
            fallbacks.addFallback(currentRank++, "CLEARCOAT_BUMP");
        }
        if (defines.CLEARCOAT_TINT) {
            fallbacks.addFallback(currentRank++, "CLEARCOAT_TINT");
        }
        if (defines.CLEARCOAT) {
            fallbacks.addFallback(currentRank++, "CLEARCOAT");
        }
        return currentRank;
    };
    /**
     * Add the required uniforms to the current list.
     * @param uniforms defines the current uniform list.
     */
    PBRClearCoatConfiguration.AddUniforms = function (uniforms) {
        uniforms.push("vClearCoatTangentSpaceParams", "vClearCoatParams", "vClearCoatRefractionParams", "vClearCoatTintParams", "clearCoatColorAtDistance", "clearCoatMatrix", "clearCoatRoughnessMatrix", "clearCoatBumpMatrix", "clearCoatTintMatrix", "vClearCoatInfos", "vClearCoatBumpInfos", "vClearCoatTintInfos");
    };
    /**
     * Add the required samplers to the current list.
     * @param samplers defines the current sampler list.
     */
    PBRClearCoatConfiguration.AddSamplers = function (samplers) {
        samplers.push("clearCoatSampler", "clearCoatRoughnessSampler", "clearCoatBumpSampler", "clearCoatTintSampler");
    };
    /**
     * Add the required uniforms to the current buffer.
     * @param uniformBuffer defines the current uniform buffer.
     */
    PBRClearCoatConfiguration.PrepareUniformBuffer = function (uniformBuffer) {
        uniformBuffer.addUniform("vClearCoatParams", 2);
        uniformBuffer.addUniform("vClearCoatRefractionParams", 4);
        uniformBuffer.addUniform("vClearCoatInfos", 4);
        uniformBuffer.addUniform("clearCoatMatrix", 16);
        uniformBuffer.addUniform("clearCoatRoughnessMatrix", 16);
        uniformBuffer.addUniform("vClearCoatBumpInfos", 2);
        uniformBuffer.addUniform("vClearCoatTangentSpaceParams", 2);
        uniformBuffer.addUniform("clearCoatBumpMatrix", 16);
        uniformBuffer.addUniform("vClearCoatTintParams", 4);
        uniformBuffer.addUniform("clearCoatColorAtDistance", 1);
        uniformBuffer.addUniform("vClearCoatTintInfos", 2);
        uniformBuffer.addUniform("clearCoatTintMatrix", 16);
    };
    /**
     * Makes a duplicate of the current configuration into another one.
     * @param clearCoatConfiguration define the config where to copy the info
     */
    PBRClearCoatConfiguration.prototype.copyTo = function (clearCoatConfiguration) {
        SerializationHelper.Clone(function () { return clearCoatConfiguration; }, this);
    };
    /**
     * Serializes this clear coat configuration.
     * @returns - An object with the serialized config.
     */
    PBRClearCoatConfiguration.prototype.serialize = function () {
        return SerializationHelper.Serialize(this);
    };
    /**
     * Parses a anisotropy Configuration from a serialized object.
     * @param source - Serialized object.
     * @param scene Defines the scene we are parsing for
     * @param rootUrl Defines the rootUrl to load from
     */
    PBRClearCoatConfiguration.prototype.parse = function (source, scene, rootUrl) {
        var _this = this;
        SerializationHelper.Parse(function () { return _this; }, source, scene, rootUrl);
    };
    /**
     * This defaults to 1.5 corresponding to a 0.04 f0 or a 4% reflectance at normal incidence
     * The default fits with a polyurethane material.
     * @hidden
     */
    PBRClearCoatConfiguration._DefaultIndexOfRefraction = 1.5;
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRClearCoatConfiguration.prototype, "isEnabled", void 0);
    __decorate([
        serialize()
    ], PBRClearCoatConfiguration.prototype, "intensity", void 0);
    __decorate([
        serialize()
    ], PBRClearCoatConfiguration.prototype, "roughness", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRClearCoatConfiguration.prototype, "indexOfRefraction", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRClearCoatConfiguration.prototype, "texture", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRClearCoatConfiguration.prototype, "useRoughnessFromMainTexture", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRClearCoatConfiguration.prototype, "textureRoughness", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRClearCoatConfiguration.prototype, "remapF0OnInterfaceChange", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRClearCoatConfiguration.prototype, "bumpTexture", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRClearCoatConfiguration.prototype, "isTintEnabled", void 0);
    __decorate([
        serializeAsColor3()
    ], PBRClearCoatConfiguration.prototype, "tintColor", void 0);
    __decorate([
        serialize()
    ], PBRClearCoatConfiguration.prototype, "tintColorAtDistance", void 0);
    __decorate([
        serialize()
    ], PBRClearCoatConfiguration.prototype, "tintThickness", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRClearCoatConfiguration.prototype, "tintTexture", void 0);
    return PBRClearCoatConfiguration;
}());

/**
 * Define the code related to the anisotropic parameters of the pbr material.
 */
var PBRAnisotropicConfiguration = /** @class */ (function () {
    /**
     * Instantiate a new istance of anisotropy configuration.
     * @param markAllSubMeshesAsTexturesDirty Callback to flag the material to dirty
     */
    function PBRAnisotropicConfiguration(markAllSubMeshesAsTexturesDirty) {
        this._isEnabled = false;
        /**
         * Defines if the anisotropy is enabled in the material.
         */
        this.isEnabled = false;
        /**
         * Defines the anisotropy strength (between 0 and 1) it defaults to 1.
         */
        this.intensity = 1;
        /**
         * Defines if the effect is along the tangents, bitangents or in between.
         * By default, the effect is "strectching" the highlights along the tangents.
         */
        this.direction = new Vector2(1, 0);
        this._texture = null;
        /**
         * Stores the anisotropy values in a texture.
         * rg is direction (like normal from -1 to 1)
         * b is a intensity
         */
        this.texture = null;
        this._internalMarkAllSubMeshesAsTexturesDirty = markAllSubMeshesAsTexturesDirty;
    }
    /** @hidden */
    PBRAnisotropicConfiguration.prototype._markAllSubMeshesAsTexturesDirty = function () {
        this._internalMarkAllSubMeshesAsTexturesDirty();
    };
    /**
     * Specifies that the submesh is ready to be used.
     * @param defines the list of "defines" to update.
     * @param scene defines the scene the material belongs to.
     * @returns - boolean indicating that the submesh is ready or not.
     */
    PBRAnisotropicConfiguration.prototype.isReadyForSubMesh = function (defines, scene) {
        if (defines._areTexturesDirty) {
            if (scene.texturesEnabled) {
                if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                    if (!this._texture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param defines the list of "defines" to update.
     * @param mesh the mesh we are preparing the defines for.
     * @param scene defines the scene the material belongs to.
     */
    PBRAnisotropicConfiguration.prototype.prepareDefines = function (defines, mesh, scene) {
        if (this._isEnabled) {
            defines.ANISOTROPIC = this._isEnabled;
            if (this._isEnabled && !mesh.isVerticesDataPresent(VertexBuffer.TangentKind)) {
                defines._needUVs = true;
                defines.MAINUV1 = true;
            }
            if (defines._areTexturesDirty) {
                if (scene.texturesEnabled) {
                    if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._texture, defines, "ANISOTROPIC_TEXTURE");
                    }
                    else {
                        defines.ANISOTROPIC_TEXTURE = false;
                    }
                }
            }
        }
        else {
            defines.ANISOTROPIC = false;
            defines.ANISOTROPIC_TEXTURE = false;
        }
    };
    /**
     * Binds the material data.
     * @param uniformBuffer defines the Uniform buffer to fill in.
     * @param scene defines the scene the material belongs to.
     * @param isFrozen defines wether the material is frozen or not.
     */
    PBRAnisotropicConfiguration.prototype.bindForSubMesh = function (uniformBuffer, scene, isFrozen) {
        if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
            if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                uniformBuffer.updateFloat2("vAnisotropyInfos", this._texture.coordinatesIndex, this._texture.level);
                MaterialHelper.BindTextureMatrix(this._texture, uniformBuffer, "anisotropy");
            }
            // Anisotropy
            uniformBuffer.updateFloat3("vAnisotropy", this.direction.x, this.direction.y, this.intensity);
        }
        // Textures
        if (scene.texturesEnabled) {
            if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                uniformBuffer.setTexture("anisotropySampler", this._texture);
            }
        }
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param texture - Base texture to use.
     * @returns - Boolean specifying if a texture is used in the material.
     */
    PBRAnisotropicConfiguration.prototype.hasTexture = function (texture) {
        if (this._texture === texture) {
            return true;
        }
        return false;
    };
    /**
     * Returns an array of the actively used textures.
     * @param activeTextures Array of BaseTextures
     */
    PBRAnisotropicConfiguration.prototype.getActiveTextures = function (activeTextures) {
        if (this._texture) {
            activeTextures.push(this._texture);
        }
    };
    /**
     * Returns the animatable textures.
     * @param animatables Array of animatable textures.
     */
    PBRAnisotropicConfiguration.prototype.getAnimatables = function (animatables) {
        if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
            animatables.push(this._texture);
        }
    };
    /**
     * Disposes the resources of the material.
     * @param forceDisposeTextures - Forces the disposal of all textures.
     */
    PBRAnisotropicConfiguration.prototype.dispose = function (forceDisposeTextures) {
        if (forceDisposeTextures) {
            if (this._texture) {
                this._texture.dispose();
            }
        }
    };
    /**
    * Get the current class name of the texture useful for serialization or dynamic coding.
    * @returns "PBRAnisotropicConfiguration"
    */
    PBRAnisotropicConfiguration.prototype.getClassName = function () {
        return "PBRAnisotropicConfiguration";
    };
    /**
     * Add fallbacks to the effect fallbacks list.
     * @param defines defines the Base texture to use.
     * @param fallbacks defines the current fallback list.
     * @param currentRank defines the current fallback rank.
     * @returns the new fallback rank.
     */
    PBRAnisotropicConfiguration.AddFallbacks = function (defines, fallbacks, currentRank) {
        if (defines.ANISOTROPIC) {
            fallbacks.addFallback(currentRank++, "ANISOTROPIC");
        }
        return currentRank;
    };
    /**
     * Add the required uniforms to the current list.
     * @param uniforms defines the current uniform list.
     */
    PBRAnisotropicConfiguration.AddUniforms = function (uniforms) {
        uniforms.push("vAnisotropy", "vAnisotropyInfos", "anisotropyMatrix");
    };
    /**
     * Add the required uniforms to the current buffer.
     * @param uniformBuffer defines the current uniform buffer.
     */
    PBRAnisotropicConfiguration.PrepareUniformBuffer = function (uniformBuffer) {
        uniformBuffer.addUniform("vAnisotropy", 3);
        uniformBuffer.addUniform("vAnisotropyInfos", 2);
        uniformBuffer.addUniform("anisotropyMatrix", 16);
    };
    /**
     * Add the required samplers to the current list.
     * @param samplers defines the current sampler list.
     */
    PBRAnisotropicConfiguration.AddSamplers = function (samplers) {
        samplers.push("anisotropySampler");
    };
    /**
     * Makes a duplicate of the current configuration into another one.
     * @param anisotropicConfiguration define the config where to copy the info
     */
    PBRAnisotropicConfiguration.prototype.copyTo = function (anisotropicConfiguration) {
        SerializationHelper.Clone(function () { return anisotropicConfiguration; }, this);
    };
    /**
     * Serializes this anisotropy configuration.
     * @returns - An object with the serialized config.
     */
    PBRAnisotropicConfiguration.prototype.serialize = function () {
        return SerializationHelper.Serialize(this);
    };
    /**
     * Parses a anisotropy Configuration from a serialized object.
     * @param source - Serialized object.
     * @param scene Defines the scene we are parsing for
     * @param rootUrl Defines the rootUrl to load from
     */
    PBRAnisotropicConfiguration.prototype.parse = function (source, scene, rootUrl) {
        var _this = this;
        SerializationHelper.Parse(function () { return _this; }, source, scene, rootUrl);
    };
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRAnisotropicConfiguration.prototype, "isEnabled", void 0);
    __decorate([
        serialize()
    ], PBRAnisotropicConfiguration.prototype, "intensity", void 0);
    __decorate([
        serializeAsVector2()
    ], PBRAnisotropicConfiguration.prototype, "direction", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRAnisotropicConfiguration.prototype, "texture", void 0);
    return PBRAnisotropicConfiguration;
}());

/**
 * Define the code related to the BRDF parameters of the pbr material.
 */
var PBRBRDFConfiguration = /** @class */ (function () {
    /**
     * Instantiate a new istance of clear coat configuration.
     * @param markAllSubMeshesAsMiscDirty Callback to flag the material to dirty
     */
    function PBRBRDFConfiguration(markAllSubMeshesAsMiscDirty) {
        this._useEnergyConservation = PBRBRDFConfiguration.DEFAULT_USE_ENERGY_CONSERVATION;
        /**
         * Defines if the material uses energy conservation.
         */
        this.useEnergyConservation = PBRBRDFConfiguration.DEFAULT_USE_ENERGY_CONSERVATION;
        this._useSmithVisibilityHeightCorrelated = PBRBRDFConfiguration.DEFAULT_USE_SMITH_VISIBILITY_HEIGHT_CORRELATED;
        /**
         * LEGACY Mode set to false
         * Defines if the material uses height smith correlated visibility term.
         * If you intent to not use our default BRDF, you need to load a separate BRDF Texture for the PBR
         * You can either load https://assets.babylonjs.com/environments/uncorrelatedBRDF.png
         * or https://assets.babylonjs.com/environments/uncorrelatedBRDF.dds to have more precision
         * Not relying on height correlated will also disable energy conservation.
         */
        this.useSmithVisibilityHeightCorrelated = PBRBRDFConfiguration.DEFAULT_USE_SMITH_VISIBILITY_HEIGHT_CORRELATED;
        this._useSphericalHarmonics = PBRBRDFConfiguration.DEFAULT_USE_SPHERICAL_HARMONICS;
        /**
         * LEGACY Mode set to false
         * Defines if the material uses spherical harmonics vs spherical polynomials for the
         * diffuse part of the IBL.
         * The harmonics despite a tiny bigger cost has been proven to provide closer results
         * to the ground truth.
         */
        this.useSphericalHarmonics = PBRBRDFConfiguration.DEFAULT_USE_SPHERICAL_HARMONICS;
        this._useSpecularGlossinessInputEnergyConservation = PBRBRDFConfiguration.DEFAULT_USE_SPECULAR_GLOSSINESS_INPUT_ENERGY_CONSERVATION;
        /**
         * Defines if the material uses energy conservation, when the specular workflow is active.
         * If activated, the albedo color is multiplied with (1. - maxChannel(specular color)).
         * If deactivated, a material is only physically plausible, when (albedo color + specular color) < 1.
         * In the deactivated case, the material author has to ensure energy conservation, for a physically plausible rendering.
         */
        this.useSpecularGlossinessInputEnergyConservation = PBRBRDFConfiguration.DEFAULT_USE_SPECULAR_GLOSSINESS_INPUT_ENERGY_CONSERVATION;
        this._internalMarkAllSubMeshesAsMiscDirty = markAllSubMeshesAsMiscDirty;
    }
    /** @hidden */
    PBRBRDFConfiguration.prototype._markAllSubMeshesAsMiscDirty = function () {
        this._internalMarkAllSubMeshesAsMiscDirty();
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param defines the list of "defines" to update.
     */
    PBRBRDFConfiguration.prototype.prepareDefines = function (defines) {
        defines.BRDF_V_HEIGHT_CORRELATED = this._useSmithVisibilityHeightCorrelated;
        defines.MS_BRDF_ENERGY_CONSERVATION = this._useEnergyConservation && this._useSmithVisibilityHeightCorrelated;
        defines.SPHERICAL_HARMONICS = this._useSphericalHarmonics;
        defines.SPECULAR_GLOSSINESS_ENERGY_CONSERVATION = this._useSpecularGlossinessInputEnergyConservation;
    };
    /**
    * Get the current class name of the texture useful for serialization or dynamic coding.
    * @returns "PBRClearCoatConfiguration"
    */
    PBRBRDFConfiguration.prototype.getClassName = function () {
        return "PBRBRDFConfiguration";
    };
    /**
     * Makes a duplicate of the current configuration into another one.
     * @param brdfConfiguration define the config where to copy the info
     */
    PBRBRDFConfiguration.prototype.copyTo = function (brdfConfiguration) {
        SerializationHelper.Clone(function () { return brdfConfiguration; }, this);
    };
    /**
     * Serializes this BRDF configuration.
     * @returns - An object with the serialized config.
     */
    PBRBRDFConfiguration.prototype.serialize = function () {
        return SerializationHelper.Serialize(this);
    };
    /**
     * Parses a anisotropy Configuration from a serialized object.
     * @param source - Serialized object.
     * @param scene Defines the scene we are parsing for
     * @param rootUrl Defines the rootUrl to load from
     */
    PBRBRDFConfiguration.prototype.parse = function (source, scene, rootUrl) {
        var _this = this;
        SerializationHelper.Parse(function () { return _this; }, source, scene, rootUrl);
    };
    /**
     * Default value used for the energy conservation.
     * This should only be changed to adapt to the type of texture in scene.environmentBRDFTexture.
     */
    PBRBRDFConfiguration.DEFAULT_USE_ENERGY_CONSERVATION = true;
    /**
     * Default value used for the Smith Visibility Height Correlated mode.
     * This should only be changed to adapt to the type of texture in scene.environmentBRDFTexture.
     */
    PBRBRDFConfiguration.DEFAULT_USE_SMITH_VISIBILITY_HEIGHT_CORRELATED = true;
    /**
     * Default value used for the IBL diffuse part.
     * This can help switching back to the polynomials mode globally which is a tiny bit
     * less GPU intensive at the drawback of a lower quality.
     */
    PBRBRDFConfiguration.DEFAULT_USE_SPHERICAL_HARMONICS = true;
    /**
     * Default value used for activating energy conservation for the specular workflow.
     * If activated, the albedo color is multiplied with (1. - maxChannel(specular color)).
     * If deactivated, a material is only physically plausible, when (albedo color + specular color) < 1.
     */
    PBRBRDFConfiguration.DEFAULT_USE_SPECULAR_GLOSSINESS_INPUT_ENERGY_CONSERVATION = true;
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsMiscDirty")
    ], PBRBRDFConfiguration.prototype, "useEnergyConservation", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsMiscDirty")
    ], PBRBRDFConfiguration.prototype, "useSmithVisibilityHeightCorrelated", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsMiscDirty")
    ], PBRBRDFConfiguration.prototype, "useSphericalHarmonics", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsMiscDirty")
    ], PBRBRDFConfiguration.prototype, "useSpecularGlossinessInputEnergyConservation", void 0);
    return PBRBRDFConfiguration;
}());

/**
 * Define the code related to the Sheen parameters of the pbr material.
 */
var PBRSheenConfiguration = /** @class */ (function () {
    /**
     * Instantiate a new istance of clear coat configuration.
     * @param markAllSubMeshesAsTexturesDirty Callback to flag the material to dirty
     */
    function PBRSheenConfiguration(markAllSubMeshesAsTexturesDirty) {
        this._isEnabled = false;
        /**
         * Defines if the material uses sheen.
         */
        this.isEnabled = false;
        this._linkSheenWithAlbedo = false;
        /**
         * Defines if the sheen is linked to the sheen color.
         */
        this.linkSheenWithAlbedo = false;
        /**
         * Defines the sheen intensity.
         */
        this.intensity = 1;
        /**
         * Defines the sheen color.
         */
        this.color = Color3.White();
        this._texture = null;
        /**
         * Stores the sheen tint values in a texture.
         * rgb is tint
         * a is a intensity or roughness if the roughness property has been defined and useRoughnessFromTexture is true (in that case, textureRoughness won't be used)
         * If the roughness property has been defined and useRoughnessFromTexture is false then the alpha channel is not used to modulate roughness
         */
        this.texture = null;
        this._useRoughnessFromMainTexture = true;
        /**
         * Indicates that the alpha channel of the texture property will be used for roughness.
         * Has no effect if the roughness (and texture!) property is not defined
         */
        this.useRoughnessFromMainTexture = true;
        this._roughness = null;
        /**
         * Defines the sheen roughness.
         * It is not taken into account if linkSheenWithAlbedo is true.
         * To stay backward compatible, material roughness is used instead if sheen roughness = null
         */
        this.roughness = null;
        this._textureRoughness = null;
        /**
         * Stores the sheen roughness in a texture.
         * alpha channel is the roughness. This texture won't be used if the texture property is not empty and useRoughnessFromTexture is true
         */
        this.textureRoughness = null;
        this._albedoScaling = false;
        /**
         * If true, the sheen effect is layered above the base BRDF with the albedo-scaling technique.
         * It allows the strength of the sheen effect to not depend on the base color of the material,
         * making it easier to setup and tweak the effect
         */
        this.albedoScaling = false;
        this._internalMarkAllSubMeshesAsTexturesDirty = markAllSubMeshesAsTexturesDirty;
    }
    /** @hidden */
    PBRSheenConfiguration.prototype._markAllSubMeshesAsTexturesDirty = function () {
        this._internalMarkAllSubMeshesAsTexturesDirty();
    };
    /**
     * Specifies that the submesh is ready to be used.
     * @param defines the list of "defines" to update.
     * @param scene defines the scene the material belongs to.
     * @returns - boolean indicating that the submesh is ready or not.
     */
    PBRSheenConfiguration.prototype.isReadyForSubMesh = function (defines, scene) {
        if (defines._areTexturesDirty) {
            if (scene.texturesEnabled) {
                if (this._texture && MaterialFlags.SheenTextureEnabled) {
                    if (!this._texture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
                if (this._textureRoughness && MaterialFlags.SheenTextureEnabled) {
                    if (!this._textureRoughness.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param defines the list of "defines" to update.
     * @param scene defines the scene the material belongs to.
     */
    PBRSheenConfiguration.prototype.prepareDefines = function (defines, scene) {
        var _a;
        if (this._isEnabled) {
            defines.SHEEN = this._isEnabled;
            defines.SHEEN_LINKWITHALBEDO = this._linkSheenWithAlbedo;
            defines.SHEEN_ROUGHNESS = this._roughness !== null;
            defines.SHEEN_ALBEDOSCALING = this._albedoScaling;
            defines.SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE = this._useRoughnessFromMainTexture;
            defines.SHEEN_TEXTURE_ROUGHNESS_IDENTICAL = this._texture !== null && this._texture._texture === ((_a = this._textureRoughness) === null || _a === void 0 ? void 0 : _a._texture) && this._texture.checkTransformsAreIdentical(this._textureRoughness);
            if (defines._areTexturesDirty) {
                if (scene.texturesEnabled) {
                    if (this._texture && MaterialFlags.SheenTextureEnabled) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._texture, defines, "SHEEN_TEXTURE");
                    }
                    else {
                        defines.SHEEN_TEXTURE = false;
                    }
                    if (this._textureRoughness && MaterialFlags.SheenTextureEnabled) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._textureRoughness, defines, "SHEEN_TEXTURE_ROUGHNESS");
                    }
                    else {
                        defines.SHEEN_TEXTURE_ROUGHNESS = false;
                    }
                }
            }
        }
        else {
            defines.SHEEN = false;
            defines.SHEEN_TEXTURE = false;
            defines.SHEEN_TEXTURE_ROUGHNESS = false;
            defines.SHEEN_LINKWITHALBEDO = false;
            defines.SHEEN_ROUGHNESS = false;
            defines.SHEEN_ALBEDOSCALING = false;
            defines.SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE = false;
            defines.SHEEN_TEXTURE_ROUGHNESS_IDENTICAL = false;
        }
    };
    /**
     * Binds the material data.
     * @param uniformBuffer defines the Uniform buffer to fill in.
     * @param scene defines the scene the material belongs to.
     * @param isFrozen defines wether the material is frozen or not.
     * @param subMesh the submesh to bind data for
     */
    PBRSheenConfiguration.prototype.bindForSubMesh = function (uniformBuffer, scene, isFrozen, subMesh) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var defines = subMesh._materialDefines;
        var identicalTextures = defines.SHEEN_TEXTURE_ROUGHNESS_IDENTICAL;
        if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
            if (identicalTextures && MaterialFlags.SheenTextureEnabled) {
                uniformBuffer.updateFloat4("vSheenInfos", this._texture.coordinatesIndex, this._texture.level, -1, -1);
                MaterialHelper.BindTextureMatrix(this._texture, uniformBuffer, "sheen");
            }
            else if ((this._texture || this._textureRoughness) && MaterialFlags.SheenTextureEnabled) {
                uniformBuffer.updateFloat4("vSheenInfos", (_b = (_a = this._texture) === null || _a === void 0 ? void 0 : _a.coordinatesIndex) !== null && _b !== void 0 ? _b : 0, (_d = (_c = this._texture) === null || _c === void 0 ? void 0 : _c.level) !== null && _d !== void 0 ? _d : 0, (_f = (_e = this._textureRoughness) === null || _e === void 0 ? void 0 : _e.coordinatesIndex) !== null && _f !== void 0 ? _f : 0, (_h = (_g = this._textureRoughness) === null || _g === void 0 ? void 0 : _g.level) !== null && _h !== void 0 ? _h : 0);
                if (this._texture) {
                    MaterialHelper.BindTextureMatrix(this._texture, uniformBuffer, "sheen");
                }
                if (this._textureRoughness && !identicalTextures && !defines.SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE) {
                    MaterialHelper.BindTextureMatrix(this._textureRoughness, uniformBuffer, "sheenRoughness");
                }
            }
            // Sheen
            uniformBuffer.updateFloat4("vSheenColor", this.color.r, this.color.g, this.color.b, this.intensity);
            if (this._roughness !== null) {
                uniformBuffer.updateFloat("vSheenRoughness", this._roughness);
            }
        }
        // Textures
        if (scene.texturesEnabled) {
            if (this._texture && MaterialFlags.SheenTextureEnabled) {
                uniformBuffer.setTexture("sheenSampler", this._texture);
            }
            if (this._textureRoughness && !identicalTextures && !defines.SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE && MaterialFlags.SheenTextureEnabled) {
                uniformBuffer.setTexture("sheenRoughnessSampler", this._textureRoughness);
            }
        }
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param texture - Base texture to use.
     * @returns - Boolean specifying if a texture is used in the material.
     */
    PBRSheenConfiguration.prototype.hasTexture = function (texture) {
        if (this._texture === texture) {
            return true;
        }
        if (this._textureRoughness === texture) {
            return true;
        }
        return false;
    };
    /**
     * Returns an array of the actively used textures.
     * @param activeTextures Array of BaseTextures
     */
    PBRSheenConfiguration.prototype.getActiveTextures = function (activeTextures) {
        if (this._texture) {
            activeTextures.push(this._texture);
        }
        if (this._textureRoughness) {
            activeTextures.push(this._textureRoughness);
        }
    };
    /**
     * Returns the animatable textures.
     * @param animatables Array of animatable textures.
     */
    PBRSheenConfiguration.prototype.getAnimatables = function (animatables) {
        if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
            animatables.push(this._texture);
        }
        if (this._textureRoughness && this._textureRoughness.animations && this._textureRoughness.animations.length > 0) {
            animatables.push(this._textureRoughness);
        }
    };
    /**
     * Disposes the resources of the material.
     * @param forceDisposeTextures - Forces the disposal of all textures.
     */
    PBRSheenConfiguration.prototype.dispose = function (forceDisposeTextures) {
        var _a, _b;
        if (forceDisposeTextures) {
            (_a = this._texture) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this._textureRoughness) === null || _b === void 0 ? void 0 : _b.dispose();
        }
    };
    /**
    * Get the current class name of the texture useful for serialization or dynamic coding.
    * @returns "PBRSheenConfiguration"
    */
    PBRSheenConfiguration.prototype.getClassName = function () {
        return "PBRSheenConfiguration";
    };
    /**
     * Add fallbacks to the effect fallbacks list.
     * @param defines defines the Base texture to use.
     * @param fallbacks defines the current fallback list.
     * @param currentRank defines the current fallback rank.
     * @returns the new fallback rank.
     */
    PBRSheenConfiguration.AddFallbacks = function (defines, fallbacks, currentRank) {
        if (defines.SHEEN) {
            fallbacks.addFallback(currentRank++, "SHEEN");
        }
        return currentRank;
    };
    /**
     * Add the required uniforms to the current list.
     * @param uniforms defines the current uniform list.
     */
    PBRSheenConfiguration.AddUniforms = function (uniforms) {
        uniforms.push("vSheenColor", "vSheenRoughness", "vSheenInfos", "sheenMatrix", "sheenRoughnessMatrix");
    };
    /**
     * Add the required uniforms to the current buffer.
     * @param uniformBuffer defines the current uniform buffer.
     */
    PBRSheenConfiguration.PrepareUniformBuffer = function (uniformBuffer) {
        uniformBuffer.addUniform("vSheenColor", 4);
        uniformBuffer.addUniform("vSheenRoughness", 1);
        uniformBuffer.addUniform("vSheenInfos", 4);
        uniformBuffer.addUniform("sheenMatrix", 16);
        uniformBuffer.addUniform("sheenRoughnessMatrix", 16);
    };
    /**
     * Add the required samplers to the current list.
     * @param samplers defines the current sampler list.
     */
    PBRSheenConfiguration.AddSamplers = function (samplers) {
        samplers.push("sheenSampler");
        samplers.push("sheenRoughnessSampler");
    };
    /**
     * Makes a duplicate of the current configuration into another one.
     * @param sheenConfiguration define the config where to copy the info
     */
    PBRSheenConfiguration.prototype.copyTo = function (sheenConfiguration) {
        SerializationHelper.Clone(function () { return sheenConfiguration; }, this);
    };
    /**
     * Serializes this BRDF configuration.
     * @returns - An object with the serialized config.
     */
    PBRSheenConfiguration.prototype.serialize = function () {
        return SerializationHelper.Serialize(this);
    };
    /**
     * Parses a anisotropy Configuration from a serialized object.
     * @param source - Serialized object.
     * @param scene Defines the scene we are parsing for
     * @param rootUrl Defines the rootUrl to load from
     */
    PBRSheenConfiguration.prototype.parse = function (source, scene, rootUrl) {
        var _this = this;
        SerializationHelper.Parse(function () { return _this; }, source, scene, rootUrl);
    };
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSheenConfiguration.prototype, "isEnabled", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSheenConfiguration.prototype, "linkSheenWithAlbedo", void 0);
    __decorate([
        serialize()
    ], PBRSheenConfiguration.prototype, "intensity", void 0);
    __decorate([
        serializeAsColor3()
    ], PBRSheenConfiguration.prototype, "color", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSheenConfiguration.prototype, "texture", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSheenConfiguration.prototype, "useRoughnessFromMainTexture", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSheenConfiguration.prototype, "roughness", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSheenConfiguration.prototype, "textureRoughness", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSheenConfiguration.prototype, "albedoScaling", void 0);
    return PBRSheenConfiguration;
}());

/**
 * Define the code related to the sub surface parameters of the pbr material.
 */
var PBRSubSurfaceConfiguration = /** @class */ (function () {
    /**
     * Instantiate a new istance of sub surface configuration.
     * @param markAllSubMeshesAsTexturesDirty Callback to flag the material to dirty
     * @param markScenePrePassDirty Callback to flag the scene as prepass dirty
     * @param scene The scene
     */
    function PBRSubSurfaceConfiguration(markAllSubMeshesAsTexturesDirty, markScenePrePassDirty, scene) {
        this._isRefractionEnabled = false;
        /**
         * Defines if the refraction is enabled in the material.
         */
        this.isRefractionEnabled = false;
        this._isTranslucencyEnabled = false;
        /**
         * Defines if the translucency is enabled in the material.
         */
        this.isTranslucencyEnabled = false;
        this._isScatteringEnabled = false;
        /**
         * Defines if the sub surface scattering is enabled in the material.
         */
        this.isScatteringEnabled = false;
        this._scatteringDiffusionProfileIndex = 0;
        /**
         * Defines the refraction intensity of the material.
         * The refraction when enabled replaces the Diffuse part of the material.
         * The intensity helps transitionning between diffuse and refraction.
         */
        this.refractionIntensity = 1;
        /**
         * Defines the translucency intensity of the material.
         * When translucency has been enabled, this defines how much of the "translucency"
         * is addded to the diffuse part of the material.
         */
        this.translucencyIntensity = 1;
        /**
         * When enabled, transparent surfaces will be tinted with the albedo colour (independent of thickness)
         */
        this.useAlbedoToTintRefraction = false;
        this._thicknessTexture = null;
        /**
         * Stores the average thickness of a mesh in a texture (The texture is holding the values linearly).
         * The red channel of the texture should contain the thickness remapped between 0 and 1.
         * 0 would mean minimumThickness
         * 1 would mean maximumThickness
         * The other channels might be use as a mask to vary the different effects intensity.
         */
        this.thicknessTexture = null;
        this._refractionTexture = null;
        /**
         * Defines the texture to use for refraction.
         */
        this.refractionTexture = null;
        this._indexOfRefraction = 1.5;
        /**
         * Index of refraction of the material base layer.
         * https://en.wikipedia.org/wiki/List_of_refractive_indices
         *
         * This does not only impact refraction but also the Base F0 of Dielectric Materials.
         *
         * From dielectric fresnel rules: F0 = square((iorT - iorI) / (iorT + iorI))
         */
        this.indexOfRefraction = 1.5;
        this._volumeIndexOfRefraction = -1.0;
        this._invertRefractionY = false;
        /**
         * Controls if refraction needs to be inverted on Y. This could be useful for procedural texture.
         */
        this.invertRefractionY = false;
        this._linkRefractionWithTransparency = false;
        /**
         * This parameters will make the material used its opacity to control how much it is refracting aginst not.
         * Materials half opaque for instance using refraction could benefit from this control.
         */
        this.linkRefractionWithTransparency = false;
        /**
         * Defines the minimum thickness stored in the thickness map.
         * If no thickness map is defined, this value will be used to simulate thickness.
         */
        this.minimumThickness = 0;
        /**
         * Defines the maximum thickness stored in the thickness map.
         */
        this.maximumThickness = 1;
        /**
         * Defines the volume tint of the material.
         * This is used for both translucency and scattering.
         */
        this.tintColor = Color3.White();
        /**
         * Defines the distance at which the tint color should be found in the media.
         * This is used for refraction only.
         */
        this.tintColorAtDistance = 1;
        /**
         * Defines how far each channel transmit through the media.
         * It is defined as a color to simplify it selection.
         */
        this.diffusionDistance = Color3.White();
        this._useMaskFromThicknessTexture = false;
        /**
         * Stores the intensity of the different subsurface effects in the thickness texture.
         * * the green channel is the translucency intensity.
         * * the blue channel is the scattering intensity.
         * * the alpha channel is the refraction intensity.
         */
        this.useMaskFromThicknessTexture = false;
        this._useMaskFromThicknessTextureGltf = false;
        /**
         * Stores the intensity of the different subsurface effects in the thickness texture. This variation
         * matches the channel-packing that is used by glTF.
         * * the red channel is the transmission/translucency intensity.
         * * the green channel is the thickness.
         */
        this.useMaskFromThicknessTextureGltf = false;
        this._internalMarkAllSubMeshesAsTexturesDirty = markAllSubMeshesAsTexturesDirty;
        this._internalMarkScenePrePassDirty = markScenePrePassDirty;
        this._scene = scene;
    }
    Object.defineProperty(PBRSubSurfaceConfiguration.prototype, "scatteringDiffusionProfile", {
        /**
         * Diffusion profile for subsurface scattering.
         * Useful for better scattering in the skins or foliages.
         */
        get: function () {
            if (!this._scene.subSurfaceConfiguration) {
                return null;
            }
            return this._scene.subSurfaceConfiguration.ssDiffusionProfileColors[this._scatteringDiffusionProfileIndex];
        },
        set: function (c) {
            if (!this._scene.enableSubSurfaceForPrePass()) {
                // Not supported
                return;
            }
            // addDiffusionProfile automatically checks for doubles
            if (c) {
                this._scatteringDiffusionProfileIndex = this._scene.subSurfaceConfiguration.addDiffusionProfile(c);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRSubSurfaceConfiguration.prototype, "volumeIndexOfRefraction", {
        /**
         * Index of refraction of the material's volume.
         * https://en.wikipedia.org/wiki/List_of_refractive_indices
         *
         * This ONLY impacts refraction. If not provided or given a non-valid value,
         * the volume will use the same IOR as the surface.
         */
        get: function () {
            if (this._volumeIndexOfRefraction >= 1.0) {
                return this._volumeIndexOfRefraction;
            }
            return this._indexOfRefraction;
        },
        set: function (value) {
            if (value >= 1.0) {
                this._volumeIndexOfRefraction = value;
            }
            else {
                this._volumeIndexOfRefraction = -1.0;
            }
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    PBRSubSurfaceConfiguration.prototype._markAllSubMeshesAsTexturesDirty = function () {
        this._internalMarkAllSubMeshesAsTexturesDirty();
    };
    /** @hidden */
    PBRSubSurfaceConfiguration.prototype._markScenePrePassDirty = function () {
        this._internalMarkAllSubMeshesAsTexturesDirty();
        this._internalMarkScenePrePassDirty();
    };
    /**
     * Gets wehter the submesh is ready to be used or not.
     * @param defines the list of "defines" to update.
     * @param scene defines the scene the material belongs to.
     * @returns - boolean indicating that the submesh is ready or not.
     */
    PBRSubSurfaceConfiguration.prototype.isReadyForSubMesh = function (defines, scene) {
        if (defines._areTexturesDirty) {
            if (scene.texturesEnabled) {
                if (this._thicknessTexture && MaterialFlags.ThicknessTextureEnabled) {
                    if (!this._thicknessTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
                var refractionTexture = this._getRefractionTexture(scene);
                if (refractionTexture && MaterialFlags.RefractionTextureEnabled) {
                    if (!refractionTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param defines the list of "defines" to update.
     * @param scene defines the scene to the material belongs to.
     */
    PBRSubSurfaceConfiguration.prototype.prepareDefines = function (defines, scene) {
        if (defines._areTexturesDirty) {
            defines.SUBSURFACE = false;
            defines.SS_TRANSLUCENCY = this._isTranslucencyEnabled;
            defines.SS_SCATTERING = this._isScatteringEnabled;
            defines.SS_THICKNESSANDMASK_TEXTURE = false;
            defines.SS_MASK_FROM_THICKNESS_TEXTURE = false;
            defines.SS_MASK_FROM_THICKNESS_TEXTURE_GLTF = false;
            defines.SS_REFRACTION = false;
            defines.SS_REFRACTIONMAP_3D = false;
            defines.SS_GAMMAREFRACTION = false;
            defines.SS_RGBDREFRACTION = false;
            defines.SS_LINEARSPECULARREFRACTION = false;
            defines.SS_REFRACTIONMAP_OPPOSITEZ = false;
            defines.SS_LODINREFRACTIONALPHA = false;
            defines.SS_LINKREFRACTIONTOTRANSPARENCY = false;
            defines.SS_ALBEDOFORREFRACTIONTINT = false;
            if (this._isRefractionEnabled || this._isTranslucencyEnabled || this._isScatteringEnabled) {
                defines.SUBSURFACE = true;
                if (defines._areTexturesDirty) {
                    if (scene.texturesEnabled) {
                        if (this._thicknessTexture && MaterialFlags.ThicknessTextureEnabled) {
                            MaterialHelper.PrepareDefinesForMergedUV(this._thicknessTexture, defines, "SS_THICKNESSANDMASK_TEXTURE");
                        }
                    }
                }
                defines.SS_MASK_FROM_THICKNESS_TEXTURE = this._useMaskFromThicknessTexture;
                defines.SS_MASK_FROM_THICKNESS_TEXTURE_GLTF = this._useMaskFromThicknessTextureGltf;
            }
            if (this._isRefractionEnabled) {
                if (scene.texturesEnabled) {
                    var refractionTexture = this._getRefractionTexture(scene);
                    if (refractionTexture && MaterialFlags.RefractionTextureEnabled) {
                        defines.SS_REFRACTION = true;
                        defines.SS_REFRACTIONMAP_3D = refractionTexture.isCube;
                        defines.SS_GAMMAREFRACTION = refractionTexture.gammaSpace;
                        defines.SS_RGBDREFRACTION = refractionTexture.isRGBD;
                        defines.SS_LINEARSPECULARREFRACTION = refractionTexture.linearSpecularLOD;
                        defines.SS_REFRACTIONMAP_OPPOSITEZ = refractionTexture.invertZ;
                        defines.SS_LODINREFRACTIONALPHA = refractionTexture.lodLevelInAlpha;
                        defines.SS_LINKREFRACTIONTOTRANSPARENCY = this._linkRefractionWithTransparency;
                        defines.SS_ALBEDOFORREFRACTIONTINT = this.useAlbedoToTintRefraction;
                    }
                }
            }
        }
    };
    /**
     * Binds the material data.
     * @param uniformBuffer defines the Uniform buffer to fill in.
     * @param scene defines the scene the material belongs to.
     * @param engine defines the engine the material belongs to.
     * @param isFrozen defines whether the material is frozen or not.
     * @param lodBasedMicrosurface defines whether the material relies on lod based microsurface or not.
     * @param realTimeFiltering defines whether the textures should be filtered on the fly.
     */
    PBRSubSurfaceConfiguration.prototype.bindForSubMesh = function (uniformBuffer, scene, engine, isFrozen, lodBasedMicrosurface, realTimeFiltering) {
        var refractionTexture = this._getRefractionTexture(scene);
        if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
            if (this._thicknessTexture && MaterialFlags.ThicknessTextureEnabled) {
                uniformBuffer.updateFloat2("vThicknessInfos", this._thicknessTexture.coordinatesIndex, this._thicknessTexture.level);
                MaterialHelper.BindTextureMatrix(this._thicknessTexture, uniformBuffer, "thickness");
            }
            uniformBuffer.updateFloat2("vThicknessParam", this.minimumThickness, this.maximumThickness - this.minimumThickness);
            if (refractionTexture && MaterialFlags.RefractionTextureEnabled) {
                uniformBuffer.updateMatrix("refractionMatrix", refractionTexture.getReflectionTextureMatrix());
                var depth = 1.0;
                if (!refractionTexture.isCube) {
                    if (refractionTexture.depth) {
                        depth = refractionTexture.depth;
                    }
                }
                var width = refractionTexture.getSize().width;
                var refractionIor = this.volumeIndexOfRefraction;
                uniformBuffer.updateFloat4("vRefractionInfos", refractionTexture.level, 1 / refractionIor, depth, this._invertRefractionY ? -1 : 1);
                uniformBuffer.updateFloat3("vRefractionMicrosurfaceInfos", width, refractionTexture.lodGenerationScale, refractionTexture.lodGenerationOffset);
                if (realTimeFiltering) {
                    uniformBuffer.updateFloat2("vRefractionFilteringInfo", width, Scalar.Log2(width));
                }
            }
            if (this.isScatteringEnabled) {
                uniformBuffer.updateFloat("scatteringDiffusionProfile", this._scatteringDiffusionProfileIndex);
            }
            uniformBuffer.updateColor3("vDiffusionDistance", this.diffusionDistance);
            uniformBuffer.updateFloat4("vTintColor", this.tintColor.r, this.tintColor.g, this.tintColor.b, this.tintColorAtDistance);
            uniformBuffer.updateFloat3("vSubSurfaceIntensity", this.refractionIntensity, this.translucencyIntensity, 0);
        }
        // Textures
        if (scene.texturesEnabled) {
            if (this._thicknessTexture && MaterialFlags.ThicknessTextureEnabled) {
                uniformBuffer.setTexture("thicknessSampler", this._thicknessTexture);
            }
            if (refractionTexture && MaterialFlags.RefractionTextureEnabled) {
                if (lodBasedMicrosurface) {
                    uniformBuffer.setTexture("refractionSampler", refractionTexture);
                }
                else {
                    uniformBuffer.setTexture("refractionSampler", refractionTexture._lodTextureMid || refractionTexture);
                    uniformBuffer.setTexture("refractionSamplerLow", refractionTexture._lodTextureLow || refractionTexture);
                    uniformBuffer.setTexture("refractionSamplerHigh", refractionTexture._lodTextureHigh || refractionTexture);
                }
            }
        }
    };
    /**
     * Unbinds the material from the mesh.
     * @param activeEffect defines the effect that should be unbound from.
     * @returns true if unbound, otherwise false
     */
    PBRSubSurfaceConfiguration.prototype.unbind = function (activeEffect) {
        if (this._refractionTexture && this._refractionTexture.isRenderTarget) {
            activeEffect.setTexture("refractionSampler", null);
            return true;
        }
        return false;
    };
    /**
     * Returns the texture used for refraction or null if none is used.
     * @param scene defines the scene the material belongs to.
     * @returns - Refraction texture if present.  If no refraction texture and refraction
     * is linked with transparency, returns environment texture.  Otherwise, returns null.
     */
    PBRSubSurfaceConfiguration.prototype._getRefractionTexture = function (scene) {
        if (this._refractionTexture) {
            return this._refractionTexture;
        }
        if (this._isRefractionEnabled) {
            return scene.environmentTexture;
        }
        return null;
    };
    Object.defineProperty(PBRSubSurfaceConfiguration.prototype, "disableAlphaBlending", {
        /**
         * Returns true if alpha blending should be disabled.
         */
        get: function () {
            return this.isRefractionEnabled && this._linkRefractionWithTransparency;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Fills the list of render target textures.
     * @param renderTargets the list of render targets to update
     */
    PBRSubSurfaceConfiguration.prototype.fillRenderTargetTextures = function (renderTargets) {
        if (MaterialFlags.RefractionTextureEnabled && this._refractionTexture && this._refractionTexture.isRenderTarget) {
            renderTargets.push(this._refractionTexture);
        }
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param texture - Base texture to use.
     * @returns - Boolean specifying if a texture is used in the material.
     */
    PBRSubSurfaceConfiguration.prototype.hasTexture = function (texture) {
        if (this._thicknessTexture === texture) {
            return true;
        }
        if (this._refractionTexture === texture) {
            return true;
        }
        return false;
    };
    /**
     * Gets a boolean indicating that current material needs to register RTT
     * @returns true if this uses a render target otherwise false.
     */
    PBRSubSurfaceConfiguration.prototype.hasRenderTargetTextures = function () {
        if (MaterialFlags.RefractionTextureEnabled && this._refractionTexture && this._refractionTexture.isRenderTarget) {
            return true;
        }
        return false;
    };
    /**
     * Returns an array of the actively used textures.
     * @param activeTextures Array of BaseTextures
     */
    PBRSubSurfaceConfiguration.prototype.getActiveTextures = function (activeTextures) {
        if (this._thicknessTexture) {
            activeTextures.push(this._thicknessTexture);
        }
        if (this._refractionTexture) {
            activeTextures.push(this._refractionTexture);
        }
    };
    /**
     * Returns the animatable textures.
     * @param animatables Array of animatable textures.
     */
    PBRSubSurfaceConfiguration.prototype.getAnimatables = function (animatables) {
        if (this._thicknessTexture && this._thicknessTexture.animations && this._thicknessTexture.animations.length > 0) {
            animatables.push(this._thicknessTexture);
        }
        if (this._refractionTexture && this._refractionTexture.animations && this._refractionTexture.animations.length > 0) {
            animatables.push(this._refractionTexture);
        }
    };
    /**
     * Disposes the resources of the material.
     * @param forceDisposeTextures - Forces the disposal of all textures.
     */
    PBRSubSurfaceConfiguration.prototype.dispose = function (forceDisposeTextures) {
        if (forceDisposeTextures) {
            if (this._thicknessTexture) {
                this._thicknessTexture.dispose();
            }
            if (this._refractionTexture) {
                this._refractionTexture.dispose();
            }
        }
    };
    /**
    * Get the current class name of the texture useful for serialization or dynamic coding.
    * @returns "PBRSubSurfaceConfiguration"
    */
    PBRSubSurfaceConfiguration.prototype.getClassName = function () {
        return "PBRSubSurfaceConfiguration";
    };
    /**
     * Add fallbacks to the effect fallbacks list.
     * @param defines defines the Base texture to use.
     * @param fallbacks defines the current fallback list.
     * @param currentRank defines the current fallback rank.
     * @returns the new fallback rank.
     */
    PBRSubSurfaceConfiguration.AddFallbacks = function (defines, fallbacks, currentRank) {
        if (defines.SS_SCATTERING) {
            fallbacks.addFallback(currentRank++, "SS_SCATTERING");
        }
        if (defines.SS_TRANSLUCENCY) {
            fallbacks.addFallback(currentRank++, "SS_TRANSLUCENCY");
        }
        return currentRank;
    };
    /**
     * Add the required uniforms to the current list.
     * @param uniforms defines the current uniform list.
     */
    PBRSubSurfaceConfiguration.AddUniforms = function (uniforms) {
        uniforms.push("vDiffusionDistance", "vTintColor", "vSubSurfaceIntensity", "vRefractionMicrosurfaceInfos", "vRefractionFilteringInfo", "vRefractionInfos", "vThicknessInfos", "vThicknessParam", "refractionMatrix", "thicknessMatrix", "scatteringDiffusionProfile");
    };
    /**
     * Add the required samplers to the current list.
     * @param samplers defines the current sampler list.
     */
    PBRSubSurfaceConfiguration.AddSamplers = function (samplers) {
        samplers.push("thicknessSampler", "refractionSampler", "refractionSamplerLow", "refractionSamplerHigh");
    };
    /**
     * Add the required uniforms to the current buffer.
     * @param uniformBuffer defines the current uniform buffer.
     */
    PBRSubSurfaceConfiguration.PrepareUniformBuffer = function (uniformBuffer) {
        uniformBuffer.addUniform("vRefractionMicrosurfaceInfos", 3);
        uniformBuffer.addUniform("vRefractionFilteringInfo", 2);
        uniformBuffer.addUniform("vRefractionInfos", 4);
        uniformBuffer.addUniform("refractionMatrix", 16);
        uniformBuffer.addUniform("vThicknessInfos", 2);
        uniformBuffer.addUniform("thicknessMatrix", 16);
        uniformBuffer.addUniform("vThicknessParam", 2);
        uniformBuffer.addUniform("vDiffusionDistance", 3);
        uniformBuffer.addUniform("vTintColor", 4);
        uniformBuffer.addUniform("vSubSurfaceIntensity", 3);
        uniformBuffer.addUniform("scatteringDiffusionProfile", 1);
    };
    /**
     * Makes a duplicate of the current configuration into another one.
     * @param configuration define the config where to copy the info
     */
    PBRSubSurfaceConfiguration.prototype.copyTo = function (configuration) {
        SerializationHelper.Clone(function () { return configuration; }, this);
    };
    /**
     * Serializes this Sub Surface configuration.
     * @returns - An object with the serialized config.
     */
    PBRSubSurfaceConfiguration.prototype.serialize = function () {
        return SerializationHelper.Serialize(this);
    };
    /**
     * Parses a anisotropy Configuration from a serialized object.
     * @param source - Serialized object.
     * @param scene Defines the scene we are parsing for
     * @param rootUrl Defines the rootUrl to load from
     */
    PBRSubSurfaceConfiguration.prototype.parse = function (source, scene, rootUrl) {
        var _this = this;
        SerializationHelper.Parse(function () { return _this; }, source, scene, rootUrl);
    };
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSubSurfaceConfiguration.prototype, "isRefractionEnabled", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSubSurfaceConfiguration.prototype, "isTranslucencyEnabled", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markScenePrePassDirty")
    ], PBRSubSurfaceConfiguration.prototype, "isScatteringEnabled", void 0);
    __decorate([
        serialize()
    ], PBRSubSurfaceConfiguration.prototype, "_scatteringDiffusionProfileIndex", void 0);
    __decorate([
        serialize()
    ], PBRSubSurfaceConfiguration.prototype, "refractionIntensity", void 0);
    __decorate([
        serialize()
    ], PBRSubSurfaceConfiguration.prototype, "translucencyIntensity", void 0);
    __decorate([
        serialize()
    ], PBRSubSurfaceConfiguration.prototype, "useAlbedoToTintRefraction", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSubSurfaceConfiguration.prototype, "thicknessTexture", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSubSurfaceConfiguration.prototype, "refractionTexture", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSubSurfaceConfiguration.prototype, "indexOfRefraction", void 0);
    __decorate([
        serialize()
    ], PBRSubSurfaceConfiguration.prototype, "_volumeIndexOfRefraction", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSubSurfaceConfiguration.prototype, "volumeIndexOfRefraction", null);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSubSurfaceConfiguration.prototype, "invertRefractionY", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSubSurfaceConfiguration.prototype, "linkRefractionWithTransparency", void 0);
    __decorate([
        serialize()
    ], PBRSubSurfaceConfiguration.prototype, "minimumThickness", void 0);
    __decorate([
        serialize()
    ], PBRSubSurfaceConfiguration.prototype, "maximumThickness", void 0);
    __decorate([
        serializeAsColor3()
    ], PBRSubSurfaceConfiguration.prototype, "tintColor", void 0);
    __decorate([
        serialize()
    ], PBRSubSurfaceConfiguration.prototype, "tintColorAtDistance", void 0);
    __decorate([
        serializeAsColor3()
    ], PBRSubSurfaceConfiguration.prototype, "diffusionDistance", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSubSurfaceConfiguration.prototype, "useMaskFromThicknessTexture", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRSubSurfaceConfiguration.prototype, "useMaskFromThicknessTextureGltf", void 0);
    return PBRSubSurfaceConfiguration;
}());

var name = 'pbrFragmentDeclaration';
var shader = "uniform vec3 vReflectionColor;\nuniform vec4 vAlbedoColor;\n\nuniform vec4 vLightingIntensity;\nuniform vec4 vReflectivityColor;\nuniform vec4 vMetallicReflectanceFactors;\nuniform vec3 vEmissiveColor;\nuniform float visibility;\n\n#ifdef ALBEDO\nuniform vec2 vAlbedoInfos;\n#endif\n#ifdef AMBIENT\nuniform vec4 vAmbientInfos;\n#endif\n#ifdef BUMP\nuniform vec3 vBumpInfos;\nuniform vec2 vTangentSpaceParams;\n#endif\n#ifdef OPACITY\nuniform vec2 vOpacityInfos;\n#endif\n#ifdef EMISSIVE\nuniform vec2 vEmissiveInfos;\n#endif\n#ifdef LIGHTMAP\nuniform vec2 vLightmapInfos;\n#endif\n#ifdef REFLECTIVITY\nuniform vec3 vReflectivityInfos;\n#endif\n#ifdef MICROSURFACEMAP\nuniform vec2 vMicroSurfaceSamplerInfos;\n#endif\n\n#if defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_PROJECTION) || defined(SS_REFRACTION)\nuniform mat4 view;\n#endif\n\n#ifdef REFLECTION\nuniform vec2 vReflectionInfos;\n#ifdef REALTIME_FILTERING\nuniform vec2 vReflectionFilteringInfo;\n#endif\nuniform mat4 reflectionMatrix;\nuniform vec3 vReflectionMicrosurfaceInfos;\n#if defined(USE_LOCAL_REFLECTIONMAP_CUBIC) && defined(REFLECTIONMAP_CUBIC)\nuniform vec3 vReflectionPosition;\nuniform vec3 vReflectionSize;\n#endif\n#endif\n\n#ifdef CLEARCOAT\nuniform vec2 vClearCoatParams;\nuniform vec4 vClearCoatRefractionParams;\n#if defined(CLEARCOAT_TEXTURE) || defined(CLEARCOAT_TEXTURE_ROUGHNESS)\nuniform vec4 vClearCoatInfos;\n#endif\n#ifdef CLEARCOAT_TEXTURE\nuniform mat4 clearCoatMatrix;\n#endif\n#ifdef CLEARCOAT_TEXTURE_ROUGHNESS\nuniform mat4 clearCoatRoughnessMatrix;\n#endif\n#ifdef CLEARCOAT_BUMP\nuniform vec2 vClearCoatBumpInfos;\nuniform vec2 vClearCoatTangentSpaceParams;\nuniform mat4 clearCoatBumpMatrix;\n#endif\n#ifdef CLEARCOAT_TINT\nuniform vec4 vClearCoatTintParams;\nuniform float clearCoatColorAtDistance;\n#ifdef CLEARCOAT_TINT_TEXTURE\nuniform vec2 vClearCoatTintInfos;\nuniform mat4 clearCoatTintMatrix;\n#endif\n#endif\n#endif\n\n#ifdef ANISOTROPIC\nuniform vec3 vAnisotropy;\n#ifdef ANISOTROPIC_TEXTURE\nuniform vec2 vAnisotropyInfos;\nuniform mat4 anisotropyMatrix;\n#endif\n#endif\n\n#ifdef SHEEN\nuniform vec4 vSheenColor;\n#ifdef SHEEN_ROUGHNESS\nuniform float vSheenRoughness;\n#endif\n#if defined(SHEEN_TEXTURE) || defined(SHEEN_TEXTURE_ROUGHNESS)\nuniform vec4 vSheenInfos;\n#endif\n#ifdef SHEEN_TEXTURE\nuniform mat4 sheenMatrix;\n#endif\n#ifdef SHEEN_TEXTURE_ROUGHNESS\nuniform mat4 sheenRoughnessMatrix;\n#endif\n#endif\n\n#ifdef SUBSURFACE\n#ifdef SS_REFRACTION\nuniform vec3 vRefractionMicrosurfaceInfos;\nuniform vec4 vRefractionInfos;\nuniform mat4 refractionMatrix;\n#ifdef REALTIME_FILTERING\nuniform vec2 vRefractionFilteringInfo;\n#endif\n#endif\n#ifdef SS_THICKNESSANDMASK_TEXTURE\nuniform vec2 vThicknessInfos;\nuniform mat4 thicknessMatrix;\n#endif\nuniform vec2 vThicknessParam;\nuniform vec3 vDiffusionDistance;\nuniform vec4 vTintColor;\nuniform vec3 vSubSurfaceIntensity;\n#endif\n#ifdef PREPASS\n#ifdef PREPASS_IRRADIANCE\nuniform float scatteringDiffusionProfile;\n#endif\n#endif";
Effect.IncludesShadersStore[name] = shader;

var name$1 = 'pbrUboDeclaration';
var shader$1 = "layout(std140,column_major) uniform;\nuniform Material\n{\nuniform vec2 vAlbedoInfos;\nuniform vec4 vAmbientInfos;\nuniform vec2 vOpacityInfos;\nuniform vec2 vEmissiveInfos;\nuniform vec2 vLightmapInfos;\nuniform vec3 vReflectivityInfos;\nuniform vec2 vMicroSurfaceSamplerInfos;\nuniform vec2 vReflectionInfos;\nuniform vec2 vReflectionFilteringInfo;\nuniform vec3 vReflectionPosition;\nuniform vec3 vReflectionSize;\nuniform vec3 vBumpInfos;\nuniform mat4 albedoMatrix;\nuniform mat4 ambientMatrix;\nuniform mat4 opacityMatrix;\nuniform mat4 emissiveMatrix;\nuniform mat4 lightmapMatrix;\nuniform mat4 reflectivityMatrix;\nuniform mat4 microSurfaceSamplerMatrix;\nuniform mat4 bumpMatrix;\nuniform vec2 vTangentSpaceParams;\nuniform mat4 reflectionMatrix;\nuniform vec3 vReflectionColor;\nuniform vec4 vAlbedoColor;\nuniform vec4 vLightingIntensity;\nuniform vec3 vReflectionMicrosurfaceInfos;\nuniform float pointSize;\nuniform vec4 vReflectivityColor;\nuniform vec3 vEmissiveColor;\nuniform float visibility;\nuniform vec4 vMetallicReflectanceFactors;\nuniform vec2 vMetallicReflectanceInfos;\nuniform mat4 metallicReflectanceMatrix;\nuniform vec2 vClearCoatParams;\nuniform vec4 vClearCoatRefractionParams;\nuniform vec4 vClearCoatInfos;\nuniform mat4 clearCoatMatrix;\nuniform mat4 clearCoatRoughnessMatrix;\nuniform vec2 vClearCoatBumpInfos;\nuniform vec2 vClearCoatTangentSpaceParams;\nuniform mat4 clearCoatBumpMatrix;\nuniform vec4 vClearCoatTintParams;\nuniform float clearCoatColorAtDistance;\nuniform vec2 vClearCoatTintInfos;\nuniform mat4 clearCoatTintMatrix;\nuniform vec3 vAnisotropy;\nuniform vec2 vAnisotropyInfos;\nuniform mat4 anisotropyMatrix;\nuniform vec4 vSheenColor;\nuniform float vSheenRoughness;\nuniform vec4 vSheenInfos;\nuniform mat4 sheenMatrix;\nuniform mat4 sheenRoughnessMatrix;\nuniform vec3 vRefractionMicrosurfaceInfos;\nuniform vec2 vRefractionFilteringInfo;\nuniform vec4 vRefractionInfos;\nuniform mat4 refractionMatrix;\nuniform vec2 vThicknessInfos;\nuniform mat4 thicknessMatrix;\nuniform vec2 vThicknessParam;\nuniform vec3 vDiffusionDistance;\nuniform vec4 vTintColor;\nuniform vec3 vSubSurfaceIntensity;\nuniform float scatteringDiffusionProfile;\nuniform vec4 vDetailInfos;\nuniform mat4 detailMatrix;\n};\nuniform Scene {\nmat4 viewProjection;\n#ifdef MULTIVIEW\nmat4 viewProjectionR;\n#endif\nmat4 view;\n};";
Effect.IncludesShadersStore[name$1] = shader$1;

var name$2 = 'pbrFragmentExtraDeclaration';
var shader$2 = "uniform vec4 vEyePosition;\nuniform vec3 vAmbientColor;\nuniform vec4 vCameraInfos;\n\nvarying vec3 vPositionW;\n#if DEBUGMODE>0\nuniform vec2 vDebugMode;\nvarying vec4 vClipSpacePosition;\n#endif\n#ifdef MAINUV1\nvarying vec2 vMainUV1;\n#endif\n#ifdef MAINUV2\nvarying vec2 vMainUV2;\n#endif\n#ifdef NORMAL\nvarying vec3 vNormalW;\n#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)\nvarying vec3 vEnvironmentIrradiance;\n#endif\n#endif\n#ifdef VERTEXCOLOR\nvarying vec4 vColor;\n#endif";
Effect.IncludesShadersStore[name$2] = shader$2;

var name$3 = 'pbrFragmentSamplersDeclaration';
var shader$3 = "#ifdef ALBEDO\n#if ALBEDODIRECTUV == 1\n#define vAlbedoUV vMainUV1\n#elif ALBEDODIRECTUV == 2\n#define vAlbedoUV vMainUV2\n#else\nvarying vec2 vAlbedoUV;\n#endif\nuniform sampler2D albedoSampler;\n#endif\n#ifdef AMBIENT\n#if AMBIENTDIRECTUV == 1\n#define vAmbientUV vMainUV1\n#elif AMBIENTDIRECTUV == 2\n#define vAmbientUV vMainUV2\n#else\nvarying vec2 vAmbientUV;\n#endif\nuniform sampler2D ambientSampler;\n#endif\n#ifdef OPACITY\n#if OPACITYDIRECTUV == 1\n#define vOpacityUV vMainUV1\n#elif OPACITYDIRECTUV == 2\n#define vOpacityUV vMainUV2\n#else\nvarying vec2 vOpacityUV;\n#endif\nuniform sampler2D opacitySampler;\n#endif\n#ifdef EMISSIVE\n#if EMISSIVEDIRECTUV == 1\n#define vEmissiveUV vMainUV1\n#elif EMISSIVEDIRECTUV == 2\n#define vEmissiveUV vMainUV2\n#else\nvarying vec2 vEmissiveUV;\n#endif\nuniform sampler2D emissiveSampler;\n#endif\n#ifdef LIGHTMAP\n#if LIGHTMAPDIRECTUV == 1\n#define vLightmapUV vMainUV1\n#elif LIGHTMAPDIRECTUV == 2\n#define vLightmapUV vMainUV2\n#else\nvarying vec2 vLightmapUV;\n#endif\nuniform sampler2D lightmapSampler;\n#endif\n#ifdef REFLECTIVITY\n#if REFLECTIVITYDIRECTUV == 1\n#define vReflectivityUV vMainUV1\n#elif REFLECTIVITYDIRECTUV == 2\n#define vReflectivityUV vMainUV2\n#else\nvarying vec2 vReflectivityUV;\n#endif\nuniform sampler2D reflectivitySampler;\n#endif\n#ifdef MICROSURFACEMAP\n#if MICROSURFACEMAPDIRECTUV == 1\n#define vMicroSurfaceSamplerUV vMainUV1\n#elif MICROSURFACEMAPDIRECTUV == 2\n#define vMicroSurfaceSamplerUV vMainUV2\n#else\nvarying vec2 vMicroSurfaceSamplerUV;\n#endif\nuniform sampler2D microSurfaceSampler;\n#endif\n#ifdef METALLIC_REFLECTANCE\n#if METALLIC_REFLECTANCEDIRECTUV == 1\n#define vMetallicReflectanceUV vMainUV1\n#elif METALLIC_REFLECTANCEDIRECTUV == 2\n#define vMetallicReflectanceUV vMainUV2\n#else\nvarying vec2 vMetallicReflectanceUV;\n#endif\nuniform sampler2D metallicReflectanceSampler;\n#endif\n#ifdef CLEARCOAT\n#if defined(CLEARCOAT_TEXTURE)\n#if CLEARCOAT_TEXTUREDIRECTUV == 1\n#define vClearCoatUV vMainUV1\n#elif CLEARCOAT_TEXTUREDIRECTUV == 2\n#define vClearCoatUV vMainUV2\n#else\nvarying vec2 vClearCoatUV;\n#endif\n#endif\n#if defined(CLEARCOAT_TEXTURE_ROUGHNESS)\n#if CLEARCOAT_TEXTURE_ROUGHNESSDIRECTUV == 1\n#define vClearCoatRoughnessUV vMainUV1\n#elif CLEARCOAT_TEXTURE_ROUGHNESSDIRECTUV == 2\n#define vClearCoatRoughnessUV vMainUV2\n#else\nvarying vec2 vClearCoatRoughnessUV;\n#endif\n#endif\n#ifdef CLEARCOAT_TEXTURE\nuniform sampler2D clearCoatSampler;\n#endif\n#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL)\nuniform sampler2D clearCoatRoughnessSampler;\n#endif\n#ifdef CLEARCOAT_BUMP\n#if CLEARCOAT_BUMPDIRECTUV == 1\n#define vClearCoatBumpUV vMainUV1\n#elif CLEARCOAT_BUMPDIRECTUV == 2\n#define vClearCoatBumpUV vMainUV2\n#else\nvarying vec2 vClearCoatBumpUV;\n#endif\nuniform sampler2D clearCoatBumpSampler;\n#endif\n#ifdef CLEARCOAT_TINT_TEXTURE\n#if CLEARCOAT_TINT_TEXTUREDIRECTUV == 1\n#define vClearCoatTintUV vMainUV1\n#elif CLEARCOAT_TINT_TEXTUREDIRECTUV == 2\n#define vClearCoatTintUV vMainUV2\n#else\nvarying vec2 vClearCoatTintUV;\n#endif\nuniform sampler2D clearCoatTintSampler;\n#endif\n#endif\n#ifdef SHEEN\n#ifdef SHEEN_TEXTURE\n#if SHEEN_TEXTUREDIRECTUV == 1\n#define vSheenUV vMainUV1\n#elif SHEEN_TEXTUREDIRECTUV == 2\n#define vSheenUV vMainUV2\n#else\nvarying vec2 vSheenUV;\n#endif\n#endif\n#ifdef SHEEN_TEXTURE_ROUGHNESS\n#if SHEEN_TEXTURE_ROUGHNESSDIRECTUV == 1\n#define vSheenRoughnessUV vMainUV1\n#elif SHEEN_TEXTURE_ROUGHNESSDIRECTUV == 2\n#define vSheenRoughnessUV vMainUV2\n#else\nvarying vec2 vSheenRoughnessUV;\n#endif\n#endif\n#ifdef SHEEN_TEXTURE\nuniform sampler2D sheenSampler;\n#endif\n#if defined(SHEEN_ROUGHNESS) && defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_TEXTURE_ROUGHNESS_IDENTICAL)\nuniform sampler2D sheenRoughnessSampler;\n#endif\n#endif\n#ifdef ANISOTROPIC\n#ifdef ANISOTROPIC_TEXTURE\n#if ANISOTROPIC_TEXTUREDIRECTUV == 1\n#define vAnisotropyUV vMainUV1\n#elif ANISOTROPIC_TEXTUREDIRECTUV == 2\n#define vAnisotropyUV vMainUV2\n#else\nvarying vec2 vAnisotropyUV;\n#endif\nuniform sampler2D anisotropySampler;\n#endif\n#endif\n\n#ifdef REFLECTION\n#ifdef REFLECTIONMAP_3D\n#define sampleReflection(s,c) textureCube(s,c)\nuniform samplerCube reflectionSampler;\n#ifdef LODBASEDMICROSFURACE\n#define sampleReflectionLod(s,c,l) textureCubeLodEXT(s,c,l)\n#else\nuniform samplerCube reflectionSamplerLow;\nuniform samplerCube reflectionSamplerHigh;\n#endif\n#ifdef USEIRRADIANCEMAP\nuniform samplerCube irradianceSampler;\n#endif\n#else\n#define sampleReflection(s,c) texture2D(s,c)\nuniform sampler2D reflectionSampler;\n#ifdef LODBASEDMICROSFURACE\n#define sampleReflectionLod(s,c,l) texture2DLodEXT(s,c,l)\n#else\nuniform sampler2D reflectionSamplerLow;\nuniform sampler2D reflectionSamplerHigh;\n#endif\n#ifdef USEIRRADIANCEMAP\nuniform sampler2D irradianceSampler;\n#endif\n#endif\n#ifdef REFLECTIONMAP_SKYBOX\nvarying vec3 vPositionUVW;\n#else\n#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)\nvarying vec3 vDirectionW;\n#endif\n#endif\n#endif\n#ifdef ENVIRONMENTBRDF\nuniform sampler2D environmentBrdfSampler;\n#endif\n\n#ifdef SUBSURFACE\n#ifdef SS_REFRACTION\n#ifdef SS_REFRACTIONMAP_3D\n#define sampleRefraction(s,c) textureCube(s,c)\nuniform samplerCube refractionSampler;\n#ifdef LODBASEDMICROSFURACE\n#define sampleRefractionLod(s,c,l) textureCubeLodEXT(s,c,l)\n#else\nuniform samplerCube refractionSamplerLow;\nuniform samplerCube refractionSamplerHigh;\n#endif\n#else\n#define sampleRefraction(s,c) texture2D(s,c)\nuniform sampler2D refractionSampler;\n#ifdef LODBASEDMICROSFURACE\n#define sampleRefractionLod(s,c,l) texture2DLodEXT(s,c,l)\n#else\nuniform sampler2D refractionSamplerLow;\nuniform sampler2D refractionSamplerHigh;\n#endif\n#endif\n#endif\n#ifdef SS_THICKNESSANDMASK_TEXTURE\n#if SS_THICKNESSANDMASK_TEXTUREDIRECTUV == 1\n#define vThicknessUV vMainUV1\n#elif SS_THICKNESSANDMASK_TEXTUREDIRECTUV == 2\n#define vThicknessUV vMainUV2\n#else\nvarying vec2 vThicknessUV;\n#endif\nuniform sampler2D thicknessSampler;\n#endif\n#endif";
Effect.IncludesShadersStore[name$3] = shader$3;

var name$4 = 'subSurfaceScatteringFunctions';
var shader$4 = "bool testLightingForSSS(float diffusionProfile)\n{\nreturn diffusionProfile<1.;\n}";
Effect.IncludesShadersStore[name$4] = shader$4;

var name$5 = 'pbrHelperFunctions';
var shader$5 = "\n#define RECIPROCAL_PI2 0.15915494\n#define RECIPROCAL_PI 0.31830988618\n\n#define MINIMUMVARIANCE 0.0005\nfloat convertRoughnessToAverageSlope(float roughness)\n{\n\nreturn square(roughness)+MINIMUMVARIANCE;\n}\nfloat fresnelGrazingReflectance(float reflectance0) {\n\n\nfloat reflectance90=saturate(reflectance0*25.0);\nreturn reflectance90;\n}\nvec2 getAARoughnessFactors(vec3 normalVector) {\n#ifdef SPECULARAA\nvec3 nDfdx=dFdx(normalVector.xyz);\nvec3 nDfdy=dFdy(normalVector.xyz);\nfloat slopeSquare=max(dot(nDfdx,nDfdx),dot(nDfdy,nDfdy));\n\nfloat geometricRoughnessFactor=pow(saturate(slopeSquare),0.333);\n\nfloat geometricAlphaGFactor=sqrt(slopeSquare);\n\ngeometricAlphaGFactor*=0.75;\nreturn vec2(geometricRoughnessFactor,geometricAlphaGFactor);\n#else\nreturn vec2(0.);\n#endif\n}\n#ifdef ANISOTROPIC\n\n\nvec2 getAnisotropicRoughness(float alphaG,float anisotropy) {\nfloat alphaT=max(alphaG*(1.0+anisotropy),MINIMUMVARIANCE);\nfloat alphaB=max(alphaG*(1.0-anisotropy),MINIMUMVARIANCE);\nreturn vec2(alphaT,alphaB);\n}\n\n\nvec3 getAnisotropicBentNormals(const vec3 T,const vec3 B,const vec3 N,const vec3 V,float anisotropy) {\nvec3 anisotropicFrameDirection=anisotropy>=0.0 ? B : T;\nvec3 anisotropicFrameTangent=cross(normalize(anisotropicFrameDirection),V);\nvec3 anisotropicFrameNormal=cross(anisotropicFrameTangent,anisotropicFrameDirection);\nvec3 anisotropicNormal=normalize(mix(N,anisotropicFrameNormal,abs(anisotropy)));\nreturn anisotropicNormal;\n\n}\n#endif\n#if defined(CLEARCOAT) || defined(SS_REFRACTION)\n\n\n\nvec3 cocaLambert(vec3 alpha,float distance) {\nreturn exp(-alpha*distance);\n}\n\nvec3 cocaLambert(float NdotVRefract,float NdotLRefract,vec3 alpha,float thickness) {\nreturn cocaLambert(alpha,(thickness*((NdotLRefract+NdotVRefract)/(NdotLRefract*NdotVRefract))));\n}\n\nvec3 computeColorAtDistanceInMedia(vec3 color,float distance) {\nreturn -log(color)/distance;\n}\nvec3 computeClearCoatAbsorption(float NdotVRefract,float NdotLRefract,vec3 clearCoatColor,float clearCoatThickness,float clearCoatIntensity) {\nvec3 clearCoatAbsorption=mix(vec3(1.0),\ncocaLambert(NdotVRefract,NdotLRefract,clearCoatColor,clearCoatThickness),\nclearCoatIntensity);\nreturn clearCoatAbsorption;\n}\n#endif\n\n\n\n\n#ifdef MICROSURFACEAUTOMATIC\nfloat computeDefaultMicroSurface(float microSurface,vec3 reflectivityColor)\n{\nconst float kReflectivityNoAlphaWorkflow_SmoothnessMax=0.95;\nfloat reflectivityLuminance=getLuminance(reflectivityColor);\nfloat reflectivityLuma=sqrt(reflectivityLuminance);\nmicroSurface=reflectivityLuma*kReflectivityNoAlphaWorkflow_SmoothnessMax;\nreturn microSurface;\n}\n#endif";
Effect.IncludesShadersStore[name$5] = shader$5;

var name$6 = 'harmonicsFunctions';
var shader$6 = "#ifdef USESPHERICALFROMREFLECTIONMAP\n#ifdef SPHERICAL_HARMONICS\nuniform vec3 vSphericalL00;\nuniform vec3 vSphericalL1_1;\nuniform vec3 vSphericalL10;\nuniform vec3 vSphericalL11;\nuniform vec3 vSphericalL2_2;\nuniform vec3 vSphericalL2_1;\nuniform vec3 vSphericalL20;\nuniform vec3 vSphericalL21;\nuniform vec3 vSphericalL22;\n\n\n\n\n\n\n\nvec3 computeEnvironmentIrradiance(vec3 normal) {\nreturn vSphericalL00\n+vSphericalL1_1*(normal.y)\n+vSphericalL10*(normal.z)\n+vSphericalL11*(normal.x)\n+vSphericalL2_2*(normal.y*normal.x)\n+vSphericalL2_1*(normal.y*normal.z)\n+vSphericalL20*((3.0*normal.z*normal.z)-1.0)\n+vSphericalL21*(normal.z*normal.x)\n+vSphericalL22*(normal.x*normal.x-(normal.y*normal.y));\n}\n#else\nuniform vec3 vSphericalX;\nuniform vec3 vSphericalY;\nuniform vec3 vSphericalZ;\nuniform vec3 vSphericalXX_ZZ;\nuniform vec3 vSphericalYY_ZZ;\nuniform vec3 vSphericalZZ;\nuniform vec3 vSphericalXY;\nuniform vec3 vSphericalYZ;\nuniform vec3 vSphericalZX;\n\nvec3 computeEnvironmentIrradiance(vec3 normal) {\n\n\n\n\n\n\n\n\n\nfloat Nx=normal.x;\nfloat Ny=normal.y;\nfloat Nz=normal.z;\nvec3 C1=vSphericalZZ.rgb;\nvec3 Cx=vSphericalX.rgb;\nvec3 Cy=vSphericalY.rgb;\nvec3 Cz=vSphericalZ.rgb;\nvec3 Cxx_zz=vSphericalXX_ZZ.rgb;\nvec3 Cyy_zz=vSphericalYY_ZZ.rgb;\nvec3 Cxy=vSphericalXY.rgb;\nvec3 Cyz=vSphericalYZ.rgb;\nvec3 Czx=vSphericalZX.rgb;\nvec3 a1=Cyy_zz*Ny+Cy;\nvec3 a2=Cyz*Nz+a1;\nvec3 b1=Czx*Nz+Cx;\nvec3 b2=Cxy*Ny+b1;\nvec3 b3=Cxx_zz*Nx+b2;\nvec3 t1=Cz*Nz+C1;\nvec3 t2=a2*Ny+t1;\nvec3 t3=b3*Nx+t2;\nreturn t3;\n}\n#endif\n#endif";
Effect.IncludesShadersStore[name$6] = shader$6;

var name$7 = 'pbrDirectLightingSetupFunctions';
var shader$7 = "\nstruct preLightingInfo\n{\n\nvec3 lightOffset;\nfloat lightDistanceSquared;\nfloat lightDistance;\n\nfloat attenuation;\n\nvec3 L;\nvec3 H;\nfloat NdotV;\nfloat NdotLUnclamped;\nfloat NdotL;\nfloat VdotH;\nfloat roughness;\n};\npreLightingInfo computePointAndSpotPreLightingInfo(vec4 lightData,vec3 V,vec3 N) {\npreLightingInfo result;\n\nresult.lightOffset=lightData.xyz-vPositionW;\nresult.lightDistanceSquared=dot(result.lightOffset,result.lightOffset);\n\nresult.lightDistance=sqrt(result.lightDistanceSquared);\n\nresult.L=normalize(result.lightOffset);\nresult.H=normalize(V+result.L);\nresult.VdotH=saturate(dot(V,result.H));\nresult.NdotLUnclamped=dot(N,result.L);\nresult.NdotL=saturateEps(result.NdotLUnclamped);\nreturn result;\n}\npreLightingInfo computeDirectionalPreLightingInfo(vec4 lightData,vec3 V,vec3 N) {\npreLightingInfo result;\n\nresult.lightDistance=length(-lightData.xyz);\n\nresult.L=normalize(-lightData.xyz);\nresult.H=normalize(V+result.L);\nresult.VdotH=saturate(dot(V,result.H));\nresult.NdotLUnclamped=dot(N,result.L);\nresult.NdotL=saturateEps(result.NdotLUnclamped);\nreturn result;\n}\npreLightingInfo computeHemisphericPreLightingInfo(vec4 lightData,vec3 V,vec3 N) {\npreLightingInfo result;\n\n\nresult.NdotL=dot(N,lightData.xyz)*0.5+0.5;\nresult.NdotL=saturateEps(result.NdotL);\nresult.NdotLUnclamped=result.NdotL;\n#ifdef SPECULARTERM\nresult.L=normalize(lightData.xyz);\nresult.H=normalize(V+result.L);\nresult.VdotH=saturate(dot(V,result.H));\n#endif\nreturn result;\n}";
Effect.IncludesShadersStore[name$7] = shader$7;

var name$8 = 'pbrDirectLightingFalloffFunctions';
var shader$8 = "float computeDistanceLightFalloff_Standard(vec3 lightOffset,float range)\n{\nreturn max(0.,1.0-length(lightOffset)/range);\n}\nfloat computeDistanceLightFalloff_Physical(float lightDistanceSquared)\n{\nreturn 1.0/maxEps(lightDistanceSquared);\n}\nfloat computeDistanceLightFalloff_GLTF(float lightDistanceSquared,float inverseSquaredRange)\n{\nfloat lightDistanceFalloff=1.0/maxEps(lightDistanceSquared);\nfloat factor=lightDistanceSquared*inverseSquaredRange;\nfloat attenuation=saturate(1.0-factor*factor);\nattenuation*=attenuation;\n\nlightDistanceFalloff*=attenuation;\nreturn lightDistanceFalloff;\n}\nfloat computeDistanceLightFalloff(vec3 lightOffset,float lightDistanceSquared,float range,float inverseSquaredRange)\n{\n#ifdef USEPHYSICALLIGHTFALLOFF\nreturn computeDistanceLightFalloff_Physical(lightDistanceSquared);\n#elif defined(USEGLTFLIGHTFALLOFF)\nreturn computeDistanceLightFalloff_GLTF(lightDistanceSquared,inverseSquaredRange);\n#else\nreturn computeDistanceLightFalloff_Standard(lightOffset,range);\n#endif\n}\nfloat computeDirectionalLightFalloff_Standard(vec3 lightDirection,vec3 directionToLightCenterW,float cosHalfAngle,float exponent)\n{\nfloat falloff=0.0;\nfloat cosAngle=maxEps(dot(-lightDirection,directionToLightCenterW));\nif (cosAngle>=cosHalfAngle)\n{\nfalloff=max(0.,pow(cosAngle,exponent));\n}\nreturn falloff;\n}\nfloat computeDirectionalLightFalloff_Physical(vec3 lightDirection,vec3 directionToLightCenterW,float cosHalfAngle)\n{\nconst float kMinusLog2ConeAngleIntensityRatio=6.64385618977;\n\n\n\n\n\nfloat concentrationKappa=kMinusLog2ConeAngleIntensityRatio/(1.0-cosHalfAngle);\n\n\nvec4 lightDirectionSpreadSG=vec4(-lightDirection*concentrationKappa,-concentrationKappa);\nfloat falloff=exp2(dot(vec4(directionToLightCenterW,1.0),lightDirectionSpreadSG));\nreturn falloff;\n}\nfloat computeDirectionalLightFalloff_GLTF(vec3 lightDirection,vec3 directionToLightCenterW,float lightAngleScale,float lightAngleOffset)\n{\n\n\n\nfloat cd=dot(-lightDirection,directionToLightCenterW);\nfloat falloff=saturate(cd*lightAngleScale+lightAngleOffset);\n\nfalloff*=falloff;\nreturn falloff;\n}\nfloat computeDirectionalLightFalloff(vec3 lightDirection,vec3 directionToLightCenterW,float cosHalfAngle,float exponent,float lightAngleScale,float lightAngleOffset)\n{\n#ifdef USEPHYSICALLIGHTFALLOFF\nreturn computeDirectionalLightFalloff_Physical(lightDirection,directionToLightCenterW,cosHalfAngle);\n#elif defined(USEGLTFLIGHTFALLOFF)\nreturn computeDirectionalLightFalloff_GLTF(lightDirection,directionToLightCenterW,lightAngleScale,lightAngleOffset);\n#else\nreturn computeDirectionalLightFalloff_Standard(lightDirection,directionToLightCenterW,cosHalfAngle,exponent);\n#endif\n}";
Effect.IncludesShadersStore[name$8] = shader$8;

var name$9 = 'pbrDirectLightingFunctions';
var shader$9 = "#define CLEARCOATREFLECTANCE90 1.0\n\nstruct lightingInfo\n{\nvec3 diffuse;\n#ifdef SPECULARTERM\nvec3 specular;\n#endif\n#ifdef CLEARCOAT\n\n\nvec4 clearCoat;\n#endif\n#ifdef SHEEN\nvec3 sheen;\n#endif\n};\n\nfloat adjustRoughnessFromLightProperties(float roughness,float lightRadius,float lightDistance) {\n#if defined(USEPHYSICALLIGHTFALLOFF) || defined(USEGLTFLIGHTFALLOFF)\n\nfloat lightRoughness=lightRadius/lightDistance;\n\nfloat totalRoughness=saturate(lightRoughness+roughness);\nreturn totalRoughness;\n#else\nreturn roughness;\n#endif\n}\nvec3 computeHemisphericDiffuseLighting(preLightingInfo info,vec3 lightColor,vec3 groundColor) {\nreturn mix(groundColor,lightColor,info.NdotL);\n}\nvec3 computeDiffuseLighting(preLightingInfo info,vec3 lightColor) {\nfloat diffuseTerm=diffuseBRDF_Burley(info.NdotL,info.NdotV,info.VdotH,info.roughness);\nreturn diffuseTerm*info.attenuation*info.NdotL*lightColor;\n}\n#define inline\nvec3 computeProjectionTextureDiffuseLighting(sampler2D projectionLightSampler,mat4 textureProjectionMatrix){\nvec4 strq=textureProjectionMatrix*vec4(vPositionW,1.0);\nstrq/=strq.w;\nvec3 textureColor=texture2D(projectionLightSampler,strq.xy).rgb;\nreturn toLinearSpace(textureColor);\n}\n#ifdef SS_TRANSLUCENCY\nvec3 computeDiffuseAndTransmittedLighting(preLightingInfo info,vec3 lightColor,vec3 transmittance) {\nfloat NdotL=absEps(info.NdotLUnclamped);\n\nfloat wrapNdotL=computeWrappedDiffuseNdotL(NdotL,0.02);\n\nfloat trAdapt=step(0.,info.NdotLUnclamped);\nvec3 transmittanceNdotL=mix(transmittance*wrapNdotL,vec3(wrapNdotL),trAdapt);\nfloat diffuseTerm=diffuseBRDF_Burley(NdotL,info.NdotV,info.VdotH,info.roughness);\nreturn diffuseTerm*transmittanceNdotL*info.attenuation*lightColor;\n}\n#endif\n#ifdef SPECULARTERM\nvec3 computeSpecularLighting(preLightingInfo info,vec3 N,vec3 reflectance0,vec3 reflectance90,float geometricRoughnessFactor,vec3 lightColor) {\nfloat NdotH=saturateEps(dot(N,info.H));\nfloat roughness=max(info.roughness,geometricRoughnessFactor);\nfloat alphaG=convertRoughnessToAverageSlope(roughness);\nvec3 fresnel=fresnelSchlickGGX(info.VdotH,reflectance0,reflectance90);\nfloat distribution=normalDistributionFunction_TrowbridgeReitzGGX(NdotH,alphaG);\n#ifdef BRDF_V_HEIGHT_CORRELATED\nfloat smithVisibility=smithVisibility_GGXCorrelated(info.NdotL,info.NdotV,alphaG);\n#else\nfloat smithVisibility=smithVisibility_TrowbridgeReitzGGXFast(info.NdotL,info.NdotV,alphaG);\n#endif\nvec3 specTerm=fresnel*distribution*smithVisibility;\nreturn specTerm*info.attenuation*info.NdotL*lightColor;\n}\n#endif\n#ifdef ANISOTROPIC\nvec3 computeAnisotropicSpecularLighting(preLightingInfo info,vec3 V,vec3 N,vec3 T,vec3 B,float anisotropy,vec3 reflectance0,vec3 reflectance90,float geometricRoughnessFactor,vec3 lightColor) {\nfloat NdotH=saturateEps(dot(N,info.H));\nfloat TdotH=dot(T,info.H);\nfloat BdotH=dot(B,info.H);\nfloat TdotV=dot(T,V);\nfloat BdotV=dot(B,V);\nfloat TdotL=dot(T,info.L);\nfloat BdotL=dot(B,info.L);\nfloat alphaG=convertRoughnessToAverageSlope(info.roughness);\nvec2 alphaTB=getAnisotropicRoughness(alphaG,anisotropy);\nalphaTB=max(alphaTB,square(geometricRoughnessFactor));\nvec3 fresnel=fresnelSchlickGGX(info.VdotH,reflectance0,reflectance90);\nfloat distribution=normalDistributionFunction_BurleyGGX_Anisotropic(NdotH,TdotH,BdotH,alphaTB);\nfloat smithVisibility=smithVisibility_GGXCorrelated_Anisotropic(info.NdotL,info.NdotV,TdotV,BdotV,TdotL,BdotL,alphaTB);\nvec3 specTerm=fresnel*distribution*smithVisibility;\nreturn specTerm*info.attenuation*info.NdotL*lightColor;\n}\n#endif\n#ifdef CLEARCOAT\nvec4 computeClearCoatLighting(preLightingInfo info,vec3 Ncc,float geometricRoughnessFactor,float clearCoatIntensity,vec3 lightColor) {\nfloat NccdotL=saturateEps(dot(Ncc,info.L));\nfloat NccdotH=saturateEps(dot(Ncc,info.H));\nfloat clearCoatRoughness=max(info.roughness,geometricRoughnessFactor);\nfloat alphaG=convertRoughnessToAverageSlope(clearCoatRoughness);\nfloat fresnel=fresnelSchlickGGX(info.VdotH,vClearCoatRefractionParams.x,CLEARCOATREFLECTANCE90);\nfresnel*=clearCoatIntensity;\nfloat distribution=normalDistributionFunction_TrowbridgeReitzGGX(NccdotH,alphaG);\nfloat kelemenVisibility=visibility_Kelemen(info.VdotH);\nfloat clearCoatTerm=fresnel*distribution*kelemenVisibility;\nreturn vec4(\nclearCoatTerm*info.attenuation*NccdotL*lightColor,\n1.0-fresnel\n);\n}\nvec3 computeClearCoatLightingAbsorption(float NdotVRefract,vec3 L,vec3 Ncc,vec3 clearCoatColor,float clearCoatThickness,float clearCoatIntensity) {\nvec3 LRefract=-refract(L,Ncc,vClearCoatRefractionParams.y);\nfloat NdotLRefract=saturateEps(dot(Ncc,LRefract));\nvec3 absorption=computeClearCoatAbsorption(NdotVRefract,NdotLRefract,clearCoatColor,clearCoatThickness,clearCoatIntensity);\nreturn absorption;\n}\n#endif\n#ifdef SHEEN\nvec3 computeSheenLighting(preLightingInfo info,vec3 N,vec3 reflectance0,vec3 reflectance90,float geometricRoughnessFactor,vec3 lightColor) {\nfloat NdotH=saturateEps(dot(N,info.H));\nfloat roughness=max(info.roughness,geometricRoughnessFactor);\nfloat alphaG=convertRoughnessToAverageSlope(roughness);\n\n\nfloat fresnel=1.;\nfloat distribution=normalDistributionFunction_CharlieSheen(NdotH,alphaG);\n\nfloat visibility=visibility_Ashikhmin(info.NdotL,info.NdotV);\n\nfloat sheenTerm=fresnel*distribution*visibility;\nreturn sheenTerm*info.attenuation*info.NdotL*lightColor;\n}\n#endif\n";
Effect.IncludesShadersStore[name$9] = shader$9;

var name$a = 'pbrIBLFunctions';
var shader$a = "#if defined(REFLECTION) || defined(SS_REFRACTION)\nfloat getLodFromAlphaG(float cubeMapDimensionPixels,float microsurfaceAverageSlope) {\nfloat microsurfaceAverageSlopeTexels=cubeMapDimensionPixels*microsurfaceAverageSlope;\nfloat lod=log2(microsurfaceAverageSlopeTexels);\nreturn lod;\n}\nfloat getLinearLodFromRoughness(float cubeMapDimensionPixels,float roughness) {\nfloat lod=log2(cubeMapDimensionPixels)*roughness;\nreturn lod;\n}\n#endif\n#if defined(ENVIRONMENTBRDF) && defined(RADIANCEOCCLUSION)\nfloat environmentRadianceOcclusion(float ambientOcclusion,float NdotVUnclamped) {\n\n\nfloat temp=NdotVUnclamped+ambientOcclusion;\nreturn saturate(square(temp)-1.0+ambientOcclusion);\n}\n#endif\n#if defined(ENVIRONMENTBRDF) && defined(HORIZONOCCLUSION)\nfloat environmentHorizonOcclusion(vec3 view,vec3 normal,vec3 geometricNormal) {\n\nvec3 reflection=reflect(view,normal);\nfloat temp=saturate(1.0+1.1*dot(reflection,geometricNormal));\nreturn square(temp);\n}\n#endif\n\n\n\n\n#if defined(LODINREFLECTIONALPHA) || defined(SS_LODINREFRACTIONALPHA)\n\n\n#define UNPACK_LOD(x) (1.0-x)*255.0\nfloat getLodFromAlphaG(float cubeMapDimensionPixels,float alphaG,float NdotV) {\nfloat microsurfaceAverageSlope=alphaG;\n\n\n\n\n\n\nmicrosurfaceAverageSlope*=sqrt(abs(NdotV));\nreturn getLodFromAlphaG(cubeMapDimensionPixels,microsurfaceAverageSlope);\n}\n#endif";
Effect.IncludesShadersStore[name$a] = shader$a;

var name$b = 'pbrBlockAlbedoOpacity';
var shader$b = "struct albedoOpacityOutParams\n{\nvec3 surfaceAlbedo;\nfloat alpha;\n};\n#define pbr_inline\nvoid albedoOpacityBlock(\nconst in vec4 vAlbedoColor,\n#ifdef ALBEDO\nconst in vec4 albedoTexture,\nconst in vec2 albedoInfos,\n#endif\n#ifdef OPACITY\nconst in vec4 opacityMap,\nconst in vec2 vOpacityInfos,\n#endif\n#ifdef DETAIL\nconst in vec4 detailColor,\nconst in vec4 vDetailInfos,\n#endif\nout albedoOpacityOutParams outParams\n)\n{\n\nvec3 surfaceAlbedo=vAlbedoColor.rgb;\nfloat alpha=vAlbedoColor.a;\n#ifdef ALBEDO\n#if defined(ALPHAFROMALBEDO) || defined(ALPHATEST)\nalpha*=albedoTexture.a;\n#endif\n#ifdef GAMMAALBEDO\nsurfaceAlbedo*=toLinearSpace(albedoTexture.rgb);\n#else\nsurfaceAlbedo*=albedoTexture.rgb;\n#endif\nsurfaceAlbedo*=albedoInfos.y;\n#endif\n#ifdef VERTEXCOLOR\nsurfaceAlbedo*=vColor.rgb;\n#endif\n#ifdef DETAIL\nfloat detailAlbedo=2.0*mix(0.5,detailColor.r,vDetailInfos.y);\nsurfaceAlbedo.rgb=surfaceAlbedo.rgb*detailAlbedo*detailAlbedo;\n#endif\n#define CUSTOM_FRAGMENT_UPDATE_ALBEDO\n\n#ifdef OPACITY\n#ifdef OPACITYRGB\nalpha=getLuminance(opacityMap.rgb);\n#else\nalpha*=opacityMap.a;\n#endif\nalpha*=vOpacityInfos.y;\n#endif\n#ifdef VERTEXALPHA\nalpha*=vColor.a;\n#endif\n#if !defined(SS_LINKREFRACTIONTOTRANSPARENCY) && !defined(ALPHAFRESNEL)\n#ifdef ALPHATEST\nif (alpha<ALPHATESTVALUE)\ndiscard;\n#ifndef ALPHABLEND\n\nalpha=1.0;\n#endif\n#endif\n#endif\noutParams.surfaceAlbedo=surfaceAlbedo;\noutParams.alpha=alpha;\n}\n";
Effect.IncludesShadersStore[name$b] = shader$b;

var name$c = 'pbrBlockReflectivity';
var shader$c = "struct reflectivityOutParams\n{\nfloat microSurface;\nfloat roughness;\nvec3 surfaceReflectivityColor;\n#ifdef METALLICWORKFLOW\nvec3 surfaceAlbedo;\n#endif\n#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)\nvec3 ambientOcclusionColor;\n#endif\n#if DEBUGMODE>0\nvec4 surfaceMetallicColorMap;\nvec4 surfaceReflectivityColorMap;\nvec2 metallicRoughness;\nvec3 metallicF0;\n#endif\n};\n#define pbr_inline\nvoid reflectivityBlock(\nconst in vec4 vReflectivityColor,\n#ifdef METALLICWORKFLOW\nconst in vec3 surfaceAlbedo,\nconst in vec4 metallicReflectanceFactors,\n#endif\n#ifdef REFLECTIVITY\nconst in vec3 reflectivityInfos,\nconst in vec4 surfaceMetallicOrReflectivityColorMap,\n#endif\n#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)\nconst in vec3 ambientOcclusionColorIn,\n#endif\n#ifdef MICROSURFACEMAP\nconst in vec4 microSurfaceTexel,\n#endif\n#ifdef DETAIL\nconst in vec4 detailColor,\nconst in vec4 vDetailInfos,\n#endif\nout reflectivityOutParams outParams\n)\n{\nfloat microSurface=vReflectivityColor.a;\nvec3 surfaceReflectivityColor=vReflectivityColor.rgb;\n#ifdef METALLICWORKFLOW\nvec2 metallicRoughness=surfaceReflectivityColor.rg;\n#ifdef REFLECTIVITY\n#if DEBUGMODE>0\noutParams.surfaceMetallicColorMap=surfaceMetallicOrReflectivityColorMap;\n#endif\n#ifdef AOSTOREINMETALMAPRED\nvec3 aoStoreInMetalMap=vec3(surfaceMetallicOrReflectivityColorMap.r,surfaceMetallicOrReflectivityColorMap.r,surfaceMetallicOrReflectivityColorMap.r);\noutParams.ambientOcclusionColor=mix(ambientOcclusionColorIn,aoStoreInMetalMap,reflectivityInfos.z);\n#endif\n#ifdef METALLNESSSTOREINMETALMAPBLUE\nmetallicRoughness.r*=surfaceMetallicOrReflectivityColorMap.b;\n#else\nmetallicRoughness.r*=surfaceMetallicOrReflectivityColorMap.r;\n#endif\n#ifdef ROUGHNESSSTOREINMETALMAPALPHA\nmetallicRoughness.g*=surfaceMetallicOrReflectivityColorMap.a;\n#else\n#ifdef ROUGHNESSSTOREINMETALMAPGREEN\nmetallicRoughness.g*=surfaceMetallicOrReflectivityColorMap.g;\n#endif\n#endif\n#endif\n#ifdef DETAIL\nfloat detailRoughness=mix(0.5,detailColor.b,vDetailInfos.w);\nfloat loLerp=mix(0.,metallicRoughness.g,detailRoughness*2.);\nfloat hiLerp=mix(metallicRoughness.g,1.,(detailRoughness-0.5)*2.);\nmetallicRoughness.g=mix(loLerp,hiLerp,step(detailRoughness,0.5));\n#endif\n#ifdef MICROSURFACEMAP\nmetallicRoughness.g*=microSurfaceTexel.r;\n#endif\n#if DEBUGMODE>0\noutParams.metallicRoughness=metallicRoughness;\n#endif\n#define CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS\n\nmicroSurface=1.0-metallicRoughness.g;\n\nvec3 baseColor=surfaceAlbedo;\n#ifdef FROSTBITE_REFLECTANCE\n\n\n\n\n\n\noutParams.surfaceAlbedo=baseColor.rgb*(1.0-metallicRoughness.r);\n\nsurfaceReflectivityColor=mix(0.16*reflectance*reflectance,baseColor,metallicRoughness.r);\n#else\nvec3 metallicF0=metallicReflectanceFactors.rgb;\n#if DEBUGMODE>0\noutParams.metallicF0=metallicF0;\n#endif\n\noutParams.surfaceAlbedo=mix(baseColor.rgb*(1.0-metallicF0),vec3(0.,0.,0.),metallicRoughness.r);\n\nsurfaceReflectivityColor=mix(metallicF0,baseColor,metallicRoughness.r);\n#endif\n#else\n#ifdef REFLECTIVITY\nsurfaceReflectivityColor*=surfaceMetallicOrReflectivityColorMap.rgb;\n#if DEBUGMODE>0\noutParams.surfaceReflectivityColorMap=surfaceMetallicOrReflectivityColorMap;\n#endif\n#ifdef MICROSURFACEFROMREFLECTIVITYMAP\nmicroSurface*=surfaceMetallicOrReflectivityColorMap.a;\nmicroSurface*=reflectivityInfos.z;\n#else\n#ifdef MICROSURFACEAUTOMATIC\nmicroSurface*=computeDefaultMicroSurface(microSurface,surfaceReflectivityColor);\n#endif\n#ifdef MICROSURFACEMAP\nmicroSurface*=microSurfaceTexel.r;\n#endif\n#define CUSTOM_FRAGMENT_UPDATE_MICROSURFACE\n#endif\n#endif\n#endif\n\nmicroSurface=saturate(microSurface);\n\nfloat roughness=1.-microSurface;\noutParams.microSurface=microSurface;\noutParams.roughness=roughness;\noutParams.surfaceReflectivityColor=surfaceReflectivityColor;\n}\n";
Effect.IncludesShadersStore[name$c] = shader$c;

var name$d = 'pbrBlockAmbientOcclusion';
var shader$d = "struct ambientOcclusionOutParams\n{\nvec3 ambientOcclusionColor;\n#if DEBUGMODE>0\nvec3 ambientOcclusionColorMap;\n#endif\n};\n#define pbr_inline\nvoid ambientOcclusionBlock(\n#ifdef AMBIENT\nconst in vec3 ambientOcclusionColorMap_,\nconst in vec4 vAmbientInfos,\n#endif\nout ambientOcclusionOutParams outParams\n)\n{\nvec3 ambientOcclusionColor=vec3(1.,1.,1.);\n#ifdef AMBIENT\nvec3 ambientOcclusionColorMap=ambientOcclusionColorMap_*vAmbientInfos.y;\n#ifdef AMBIENTINGRAYSCALE\nambientOcclusionColorMap=vec3(ambientOcclusionColorMap.r,ambientOcclusionColorMap.r,ambientOcclusionColorMap.r);\n#endif\nambientOcclusionColor=mix(ambientOcclusionColor,ambientOcclusionColorMap,vAmbientInfos.z);\n#if DEBUGMODE>0\noutParams.ambientOcclusionColorMap=ambientOcclusionColorMap;\n#endif\n#endif\noutParams.ambientOcclusionColor=ambientOcclusionColor;\n}\n";
Effect.IncludesShadersStore[name$d] = shader$d;

var name$e = 'pbrBlockAlphaFresnel';
var shader$e = "#ifdef ALPHAFRESNEL\n#if defined(ALPHATEST) || defined(ALPHABLEND)\nstruct alphaFresnelOutParams\n{\nfloat alpha;\n};\n#define pbr_inline\nvoid alphaFresnelBlock(\nconst in vec3 normalW,\nconst in vec3 viewDirectionW,\nconst in float alpha,\nconst in float microSurface,\nout alphaFresnelOutParams outParams\n)\n{\n\n\n\nfloat opacityPerceptual=alpha;\n#ifdef LINEARALPHAFRESNEL\nfloat opacity0=opacityPerceptual;\n#else\nfloat opacity0=opacityPerceptual*opacityPerceptual;\n#endif\nfloat opacity90=fresnelGrazingReflectance(opacity0);\nvec3 normalForward=faceforward(normalW,-viewDirectionW,normalW);\n\noutParams.alpha=getReflectanceFromAnalyticalBRDFLookup_Jones(saturate(dot(viewDirectionW,normalForward)),vec3(opacity0),vec3(opacity90),sqrt(microSurface)).x;\n#ifdef ALPHATEST\nif (outParams.alpha<ALPHATESTVALUE)\ndiscard;\n#ifndef ALPHABLEND\n\noutParams.alpha=1.0;\n#endif\n#endif\n}\n#endif\n#endif\n";
Effect.IncludesShadersStore[name$e] = shader$e;

var name$f = 'pbrBlockAnisotropic';
var shader$f = "#ifdef ANISOTROPIC\nstruct anisotropicOutParams\n{\nfloat anisotropy;\nvec3 anisotropicTangent;\nvec3 anisotropicBitangent;\nvec3 anisotropicNormal;\n#if DEBUGMODE>0\nvec3 anisotropyMapData;\n#endif\n};\n#define pbr_inline\nvoid anisotropicBlock(\nconst in vec3 vAnisotropy,\n#ifdef ANISOTROPIC_TEXTURE\nconst in vec3 anisotropyMapData,\n#endif\nconst in mat3 TBN,\nconst in vec3 normalW,\nconst in vec3 viewDirectionW,\nout anisotropicOutParams outParams\n)\n{\nfloat anisotropy=vAnisotropy.b;\nvec3 anisotropyDirection=vec3(vAnisotropy.xy,0.);\n#ifdef ANISOTROPIC_TEXTURE\nanisotropy*=anisotropyMapData.b;\nanisotropyDirection.rg*=anisotropyMapData.rg*2.0-1.0;\n#if DEBUGMODE>0\noutParams.anisotropyMapData=anisotropyMapData;\n#endif\n#endif\nmat3 anisoTBN=mat3(normalize(TBN[0]),normalize(TBN[1]),normalize(TBN[2]));\nvec3 anisotropicTangent=normalize(anisoTBN*anisotropyDirection);\nvec3 anisotropicBitangent=normalize(cross(anisoTBN[2],anisotropicTangent));\noutParams.anisotropy=anisotropy;\noutParams.anisotropicTangent=anisotropicTangent;\noutParams.anisotropicBitangent=anisotropicBitangent;\noutParams.anisotropicNormal=getAnisotropicBentNormals(anisotropicTangent,anisotropicBitangent,normalW,viewDirectionW,anisotropy);\n}\n#endif\n";
Effect.IncludesShadersStore[name$f] = shader$f;

var name$g = 'pbrBlockReflection';
var shader$g = "#ifdef REFLECTION\nstruct reflectionOutParams\n{\nvec4 environmentRadiance;\nvec3 environmentIrradiance;\n#ifdef REFLECTIONMAP_3D\nvec3 reflectionCoords;\n#else\nvec2 reflectionCoords;\n#endif\n#ifdef SS_TRANSLUCENCY\n#ifdef USESPHERICALFROMREFLECTIONMAP\n#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)\nvec3 irradianceVector;\n#endif\n#endif\n#endif\n};\n#define pbr_inline\nvoid createReflectionCoords(\nconst in vec3 vPositionW,\nconst in vec3 normalW,\n#ifdef ANISOTROPIC\nconst in anisotropicOutParams anisotropicOut,\n#endif\n#ifdef REFLECTIONMAP_3D\nout vec3 reflectionCoords\n#else\nout vec2 reflectionCoords\n#endif\n)\n{\n#ifdef ANISOTROPIC\nvec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),anisotropicOut.anisotropicNormal);\n#else\nvec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),normalW);\n#endif\n#ifdef REFLECTIONMAP_OPPOSITEZ\nreflectionVector.z*=-1.0;\n#endif\n\n#ifdef REFLECTIONMAP_3D\nreflectionCoords=reflectionVector;\n#else\nreflectionCoords=reflectionVector.xy;\n#ifdef REFLECTIONMAP_PROJECTION\nreflectionCoords/=reflectionVector.z;\n#endif\nreflectionCoords.y=1.0-reflectionCoords.y;\n#endif\n}\n#define pbr_inline\n#define inline\nvoid sampleReflectionTexture(\nconst in float alphaG,\nconst in vec3 vReflectionMicrosurfaceInfos,\nconst in vec2 vReflectionInfos,\nconst in vec3 vReflectionColor,\n#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)\nconst in float NdotVUnclamped,\n#endif\n#ifdef LINEARSPECULARREFLECTION\nconst in float roughness,\n#endif\n#ifdef REFLECTIONMAP_3D\nconst in samplerCube reflectionSampler,\nconst vec3 reflectionCoords,\n#else\nconst in sampler2D reflectionSampler,\nconst vec2 reflectionCoords,\n#endif\n#ifndef LODBASEDMICROSFURACE\n#ifdef REFLECTIONMAP_3D\nconst in samplerCube reflectionSamplerLow,\nconst in samplerCube reflectionSamplerHigh,\n#else\nconst in sampler2D reflectionSamplerLow,\nconst in sampler2D reflectionSamplerHigh,\n#endif\n#endif\n#ifdef REALTIME_FILTERING\nconst in vec2 vReflectionFilteringInfo,\n#endif\nout vec4 environmentRadiance\n)\n{\n\n#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)\nfloat reflectionLOD=getLodFromAlphaG(vReflectionMicrosurfaceInfos.x,alphaG,NdotVUnclamped);\n#elif defined(LINEARSPECULARREFLECTION)\nfloat reflectionLOD=getLinearLodFromRoughness(vReflectionMicrosurfaceInfos.x,roughness);\n#else\nfloat reflectionLOD=getLodFromAlphaG(vReflectionMicrosurfaceInfos.x,alphaG);\n#endif\n#ifdef LODBASEDMICROSFURACE\n\nreflectionLOD=reflectionLOD*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;\n#ifdef LODINREFLECTIONALPHA\n\n\n\n\n\n\n\n\n\nfloat automaticReflectionLOD=UNPACK_LOD(sampleReflection(reflectionSampler,reflectionCoords).a);\nfloat requestedReflectionLOD=max(automaticReflectionLOD,reflectionLOD);\n#else\nfloat requestedReflectionLOD=reflectionLOD;\n#endif\n#ifdef REALTIME_FILTERING\nenvironmentRadiance=vec4(radiance(alphaG,reflectionSampler,reflectionCoords,vReflectionFilteringInfo),1.0);\n#else\nenvironmentRadiance=sampleReflectionLod(reflectionSampler,reflectionCoords,reflectionLOD);\n#endif\n#else\nfloat lodReflectionNormalized=saturate(reflectionLOD/log2(vReflectionMicrosurfaceInfos.x));\nfloat lodReflectionNormalizedDoubled=lodReflectionNormalized*2.0;\nvec4 environmentMid=sampleReflection(reflectionSampler,reflectionCoords);\nif (lodReflectionNormalizedDoubled<1.0){\nenvironmentRadiance=mix(\nsampleReflection(reflectionSamplerHigh,reflectionCoords),\nenvironmentMid,\nlodReflectionNormalizedDoubled\n);\n} else {\nenvironmentRadiance=mix(\nenvironmentMid,\nsampleReflection(reflectionSamplerLow,reflectionCoords),\nlodReflectionNormalizedDoubled-1.0\n);\n}\n#endif\n#ifdef RGBDREFLECTION\nenvironmentRadiance.rgb=fromRGBD(environmentRadiance);\n#endif\n#ifdef GAMMAREFLECTION\nenvironmentRadiance.rgb=toLinearSpace(environmentRadiance.rgb);\n#endif\n\nenvironmentRadiance.rgb*=vReflectionInfos.x;\nenvironmentRadiance.rgb*=vReflectionColor.rgb;\n}\n#define pbr_inline\n#define inline\nvoid reflectionBlock(\nconst in vec3 vPositionW,\nconst in vec3 normalW,\nconst in float alphaG,\nconst in vec3 vReflectionMicrosurfaceInfos,\nconst in vec2 vReflectionInfos,\nconst in vec3 vReflectionColor,\n#ifdef ANISOTROPIC\nconst in anisotropicOutParams anisotropicOut,\n#endif\n#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)\nconst in float NdotVUnclamped,\n#endif\n#ifdef LINEARSPECULARREFLECTION\nconst in float roughness,\n#endif\n#ifdef REFLECTIONMAP_3D\nconst in samplerCube reflectionSampler,\n#else\nconst in sampler2D reflectionSampler,\n#endif\n#if defined(NORMAL) && defined(USESPHERICALINVERTEX)\nconst in vec3 vEnvironmentIrradiance,\n#endif\n#ifdef USESPHERICALFROMREFLECTIONMAP\n#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)\nconst in mat4 reflectionMatrix,\n#endif\n#endif\n#ifdef USEIRRADIANCEMAP\n#ifdef REFLECTIONMAP_3D\nconst in samplerCube irradianceSampler,\n#else\nconst in sampler2D irradianceSampler,\n#endif\n#endif\n#ifndef LODBASEDMICROSFURACE\n#ifdef REFLECTIONMAP_3D\nconst in samplerCube reflectionSamplerLow,\nconst in samplerCube reflectionSamplerHigh,\n#else\nconst in sampler2D reflectionSamplerLow,\nconst in sampler2D reflectionSamplerHigh,\n#endif\n#endif\n#ifdef REALTIME_FILTERING\nconst in vec2 vReflectionFilteringInfo,\n#endif\nout reflectionOutParams outParams\n)\n{\n\nvec4 environmentRadiance=vec4(0.,0.,0.,0.);\n#ifdef REFLECTIONMAP_3D\nvec3 reflectionCoords=vec3(0.);\n#else\nvec2 reflectionCoords=vec2(0.);\n#endif\ncreateReflectionCoords(\nvPositionW,\nnormalW,\n#ifdef ANISOTROPIC\nanisotropicOut,\n#endif\nreflectionCoords\n);\nsampleReflectionTexture(\nalphaG,\nvReflectionMicrosurfaceInfos,\nvReflectionInfos,\nvReflectionColor,\n#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)\nNdotVUnclamped,\n#endif\n#ifdef LINEARSPECULARREFLECTION\nroughness,\n#endif\n#ifdef REFLECTIONMAP_3D\nreflectionSampler,\nreflectionCoords,\n#else\nreflectionSampler,\nreflectionCoords,\n#endif\n#ifndef LODBASEDMICROSFURACE\nreflectionSamplerLow,\nreflectionSamplerHigh,\n#endif\n#ifdef REALTIME_FILTERING\nvReflectionFilteringInfo,\n#endif\nenvironmentRadiance\n);\n\nvec3 environmentIrradiance=vec3(0.,0.,0.);\n#ifdef USESPHERICALFROMREFLECTIONMAP\n#if defined(NORMAL) && defined(USESPHERICALINVERTEX)\nenvironmentIrradiance=vEnvironmentIrradiance;\n#else\n#ifdef ANISOTROPIC\nvec3 irradianceVector=vec3(reflectionMatrix*vec4(anisotropicOut.anisotropicNormal,0)).xyz;\n#else\nvec3 irradianceVector=vec3(reflectionMatrix*vec4(normalW,0)).xyz;\n#endif\n#ifdef REFLECTIONMAP_OPPOSITEZ\nirradianceVector.z*=-1.0;\n#endif\n#ifdef INVERTCUBICMAP\nirradianceVector.y*=-1.0;\n#endif\n#if defined(REALTIME_FILTERING)\nenvironmentIrradiance=irradiance(reflectionSampler,irradianceVector,vReflectionFilteringInfo);\n#else\nenvironmentIrradiance=computeEnvironmentIrradiance(irradianceVector);\n#endif\n#ifdef SS_TRANSLUCENCY\noutParams.irradianceVector=irradianceVector;\n#endif\n#endif\n#elif defined(USEIRRADIANCEMAP)\nvec4 environmentIrradiance4=sampleReflection(irradianceSampler,reflectionCoords);\nenvironmentIrradiance=environmentIrradiance4.rgb;\n#ifdef RGBDREFLECTION\nenvironmentIrradiance.rgb=fromRGBD(environmentIrradiance4);\n#endif\n#ifdef GAMMAREFLECTION\nenvironmentIrradiance.rgb=toLinearSpace(environmentIrradiance.rgb);\n#endif\n#endif\nenvironmentIrradiance*=vReflectionColor.rgb;\noutParams.environmentRadiance=environmentRadiance;\noutParams.environmentIrradiance=environmentIrradiance;\noutParams.reflectionCoords=reflectionCoords;\n}\n#endif\n";
Effect.IncludesShadersStore[name$g] = shader$g;

var name$h = 'pbrBlockSheen';
var shader$h = "#ifdef SHEEN\nstruct sheenOutParams\n{\nfloat sheenIntensity;\nvec3 sheenColor;\nfloat sheenRoughness;\n#ifdef SHEEN_LINKWITHALBEDO\nvec3 surfaceAlbedo;\n#endif\n#if defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)\nfloat sheenAlbedoScaling;\n#endif\n#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)\nvec3 finalSheenRadianceScaled;\n#endif\n#if DEBUGMODE>0\nvec4 sheenMapData;\nvec3 sheenEnvironmentReflectance;\n#endif\n};\n#define pbr_inline\n#define inline\nvoid sheenBlock(\nconst in vec4 vSheenColor,\n#ifdef SHEEN_ROUGHNESS\nconst in float vSheenRoughness,\n#if defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_TEXTURE_ROUGHNESS_IDENTICAL) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)\nconst in vec4 sheenMapRoughnessData,\n#endif\n#endif\nconst in float roughness,\n#ifdef SHEEN_TEXTURE\nconst in vec4 sheenMapData,\n#endif\nconst in float reflectance,\n#ifdef SHEEN_LINKWITHALBEDO\nconst in vec3 baseColor,\nconst in vec3 surfaceAlbedo,\n#endif\n#ifdef ENVIRONMENTBRDF\nconst in float NdotV,\nconst in vec3 environmentBrdf,\n#endif\n#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)\nconst in vec2 AARoughnessFactors,\nconst in vec3 vReflectionMicrosurfaceInfos,\nconst in vec2 vReflectionInfos,\nconst in vec3 vReflectionColor,\nconst in vec4 vLightingIntensity,\n#ifdef REFLECTIONMAP_3D\nconst in samplerCube reflectionSampler,\nconst in vec3 reflectionCoords,\n#else\nconst in sampler2D reflectionSampler,\nconst in vec2 reflectionCoords,\n#endif\nconst in float NdotVUnclamped,\n#ifndef LODBASEDMICROSFURACE\n#ifdef REFLECTIONMAP_3D\nconst in samplerCube reflectionSamplerLow,\nconst in samplerCube reflectionSamplerHigh,\n#else\nconst in sampler2D reflectionSamplerLow,\nconst in sampler2D reflectionSamplerHigh,\n#endif\n#endif\n#ifdef REALTIME_FILTERING\nconst in vec2 vReflectionFilteringInfo,\n#endif\n#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)\nconst in float seo,\n#endif\n#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)\nconst in float eho,\n#endif\n#endif\nout sheenOutParams outParams\n)\n{\nfloat sheenIntensity=vSheenColor.a;\n#ifdef SHEEN_TEXTURE\n#if DEBUGMODE>0\noutParams.sheenMapData=sheenMapData;\n#endif\n#endif\n#ifdef SHEEN_LINKWITHALBEDO\nfloat sheenFactor=pow5(1.0-sheenIntensity);\nvec3 sheenColor=baseColor.rgb*(1.0-sheenFactor);\nfloat sheenRoughness=sheenIntensity;\noutParams.surfaceAlbedo=surfaceAlbedo*sheenFactor;\n#ifdef SHEEN_TEXTURE\nsheenIntensity*=sheenMapData.a;\n#endif\n#else\nvec3 sheenColor=vSheenColor.rgb;\n#ifdef SHEEN_TEXTURE\nsheenColor.rgb*=sheenMapData.rgb;\n#endif\n#ifdef SHEEN_ROUGHNESS\nfloat sheenRoughness=vSheenRoughness;\n#ifdef SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE\n#if defined(SHEEN_TEXTURE)\nsheenRoughness*=sheenMapData.a;\n#endif\n#elif defined(SHEEN_TEXTURE_ROUGHNESS)\n#ifdef SHEEN_TEXTURE_ROUGHNESS_IDENTICAL\nsheenRoughness*=sheenMapData.a;\n#else\nsheenRoughness*=sheenMapRoughnessData.a;\n#endif\n#endif\n#else\nfloat sheenRoughness=roughness;\n#ifdef SHEEN_TEXTURE\nsheenIntensity*=sheenMapData.a;\n#endif\n#endif\n\n#if !defined(SHEEN_ALBEDOSCALING)\nsheenIntensity*=(1.-reflectance);\n#endif\n\nsheenColor*=sheenIntensity;\n#endif\n\n#ifdef ENVIRONMENTBRDF\n\n#ifdef SHEEN_ROUGHNESS\nvec3 environmentSheenBrdf=getBRDFLookup(NdotV,sheenRoughness);\n#else\nvec3 environmentSheenBrdf=environmentBrdf;\n#endif\n\n#endif\n#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)\nfloat sheenAlphaG=convertRoughnessToAverageSlope(sheenRoughness);\n#ifdef SPECULARAA\n\nsheenAlphaG+=AARoughnessFactors.y;\n#endif\nvec4 environmentSheenRadiance=vec4(0.,0.,0.,0.);\nsampleReflectionTexture(\nsheenAlphaG,\nvReflectionMicrosurfaceInfos,\nvReflectionInfos,\nvReflectionColor,\n#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)\nNdotVUnclamped,\n#endif\n#ifdef LINEARSPECULARREFLECTION\nsheenRoughness,\n#endif\nreflectionSampler,\nreflectionCoords,\n#ifndef LODBASEDMICROSFURACE\nreflectionSamplerLow,\nreflectionSamplerHigh,\n#endif\n#ifdef REALTIME_FILTERING\nvReflectionFilteringInfo,\n#endif\nenvironmentSheenRadiance\n);\nvec3 sheenEnvironmentReflectance=getSheenReflectanceFromBRDFLookup(sheenColor,environmentSheenBrdf);\n#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)\nsheenEnvironmentReflectance*=seo;\n#endif\n#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)\nsheenEnvironmentReflectance*=eho;\n#endif\n#if DEBUGMODE>0\noutParams.sheenEnvironmentReflectance=sheenEnvironmentReflectance;\n#endif\noutParams.finalSheenRadianceScaled=\nenvironmentSheenRadiance.rgb *\nsheenEnvironmentReflectance *\nvLightingIntensity.z;\n\n\n\n\n\n#endif\n#if defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)\n\n\n\noutParams.sheenAlbedoScaling=1.0-sheenIntensity*max(max(sheenColor.r,sheenColor.g),sheenColor.b)*environmentSheenBrdf.b;\n#endif\n\noutParams.sheenIntensity=sheenIntensity;\noutParams.sheenColor=sheenColor;\noutParams.sheenRoughness=sheenRoughness;\n}\n#endif\n";
Effect.IncludesShadersStore[name$h] = shader$h;

var name$i = 'pbrBlockClearcoat';
var shader$i = "struct clearcoatOutParams\n{\nvec3 specularEnvironmentR0;\nfloat conservationFactor;\nvec3 clearCoatNormalW;\nvec2 clearCoatAARoughnessFactors;\nfloat clearCoatIntensity;\nfloat clearCoatRoughness;\n#ifdef REFLECTION\nvec3 finalClearCoatRadianceScaled;\n#endif\n#ifdef CLEARCOAT_TINT\nvec3 absorption;\nfloat clearCoatNdotVRefract;\nvec3 clearCoatColor;\nfloat clearCoatThickness;\n#endif\n#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)\nvec3 energyConservationFactorClearCoat;\n#endif\n#if DEBUGMODE>0\nmat3 TBNClearCoat;\nvec2 clearCoatMapData;\nvec4 clearCoatTintMapData;\nvec4 environmentClearCoatRadiance;\nfloat clearCoatNdotV;\nvec3 clearCoatEnvironmentReflectance;\n#endif\n};\n#ifdef CLEARCOAT\n#define pbr_inline\n#define inline\nvoid clearcoatBlock(\nconst in vec3 vPositionW,\nconst in vec3 geometricNormalW,\nconst in vec3 viewDirectionW,\nconst in vec2 vClearCoatParams,\n#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)\nconst in vec4 clearCoatMapRoughnessData,\n#endif\nconst in vec3 specularEnvironmentR0,\n#ifdef CLEARCOAT_TEXTURE\nconst in vec2 clearCoatMapData,\n#endif\n#ifdef CLEARCOAT_TINT\nconst in vec4 vClearCoatTintParams,\nconst in float clearCoatColorAtDistance,\nconst in vec4 vClearCoatRefractionParams,\n#ifdef CLEARCOAT_TINT_TEXTURE\nconst in vec4 clearCoatTintMapData,\n#endif\n#endif\n#ifdef CLEARCOAT_BUMP\nconst in vec2 vClearCoatBumpInfos,\nconst in vec4 clearCoatBumpMapData,\nconst in vec2 vClearCoatBumpUV,\n#if defined(TANGENT) && defined(NORMAL)\nconst in mat3 vTBN,\n#else\nconst in vec2 vClearCoatTangentSpaceParams,\n#endif\n#ifdef OBJECTSPACE_NORMALMAP\nconst in mat4 normalMatrix,\n#endif\n#endif\n#if defined(FORCENORMALFORWARD) && defined(NORMAL)\nconst in vec3 faceNormal,\n#endif\n#ifdef REFLECTION\nconst in vec3 vReflectionMicrosurfaceInfos,\nconst in vec2 vReflectionInfos,\nconst in vec3 vReflectionColor,\nconst in vec4 vLightingIntensity,\n#ifdef REFLECTIONMAP_3D\nconst in samplerCube reflectionSampler,\n#else\nconst in sampler2D reflectionSampler,\n#endif\n#ifndef LODBASEDMICROSFURACE\n#ifdef REFLECTIONMAP_3D\nconst in samplerCube reflectionSamplerLow,\nconst in samplerCube reflectionSamplerHigh,\n#else\nconst in sampler2D reflectionSamplerLow,\nconst in sampler2D reflectionSamplerHigh,\n#endif\n#endif\n#ifdef REALTIME_FILTERING\nconst in vec2 vReflectionFilteringInfo,\n#endif\n#endif\n#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)\n#ifdef RADIANCEOCCLUSION\nconst in float ambientMonochrome,\n#endif\n#endif\nout clearcoatOutParams outParams\n)\n{\n\nfloat clearCoatIntensity=vClearCoatParams.x;\nfloat clearCoatRoughness=vClearCoatParams.y;\n#ifdef CLEARCOAT_TEXTURE\nclearCoatIntensity*=clearCoatMapData.x;\n#ifdef CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE\nclearCoatRoughness*=clearCoatMapData.y;\n#endif\n#if DEBUGMODE>0\noutParams.clearCoatMapData=clearCoatMapData;\n#endif\n#endif\n#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)\n#ifdef CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL\nclearCoatRoughness*=clearCoatMapData.y;\n#else\nclearCoatRoughness*=clearCoatMapRoughnessData.y;\n#endif\n#endif\noutParams.clearCoatIntensity=clearCoatIntensity;\noutParams.clearCoatRoughness=clearCoatRoughness;\n#ifdef CLEARCOAT_TINT\nvec3 clearCoatColor=vClearCoatTintParams.rgb;\nfloat clearCoatThickness=vClearCoatTintParams.a;\n#ifdef CLEARCOAT_TINT_TEXTURE\nclearCoatColor*=clearCoatTintMapData.rgb;\nclearCoatThickness*=clearCoatTintMapData.a;\n#if DEBUGMODE>0\noutParams.clearCoatTintMapData=clearCoatTintMapData;\n#endif\n#endif\noutParams.clearCoatColor=computeColorAtDistanceInMedia(clearCoatColor,clearCoatColorAtDistance);\noutParams.clearCoatThickness=clearCoatThickness;\n#endif\n\n\n\n\n#ifdef CLEARCOAT_REMAP_F0\nvec3 specularEnvironmentR0Updated=getR0RemappedForClearCoat(specularEnvironmentR0);\n#else\nvec3 specularEnvironmentR0Updated=specularEnvironmentR0;\n#endif\noutParams.specularEnvironmentR0=mix(specularEnvironmentR0,specularEnvironmentR0Updated,clearCoatIntensity);\n\nvec3 clearCoatNormalW=geometricNormalW;\n#ifdef CLEARCOAT_BUMP\n#ifdef NORMALXYSCALE\nfloat clearCoatNormalScale=1.0;\n#else\nfloat clearCoatNormalScale=vClearCoatBumpInfos.y;\n#endif\n#if defined(TANGENT) && defined(NORMAL)\nmat3 TBNClearCoat=vTBN;\n#else\nmat3 TBNClearCoat=cotangent_frame(clearCoatNormalW*clearCoatNormalScale,vPositionW,vClearCoatBumpUV,vClearCoatTangentSpaceParams);\n#endif\n#if DEBUGMODE>0\noutParams.TBNClearCoat=TBNClearCoat;\n#endif\n#ifdef OBJECTSPACE_NORMALMAP\nclearCoatNormalW=normalize(clearCoatBumpMapData.xyz*2.0-1.0);\nclearCoatNormalW=normalize(mat3(normalMatrix)*clearCoatNormalW);\n#else\nclearCoatNormalW=perturbNormal(TBNClearCoat,clearCoatBumpMapData.xyz,vClearCoatBumpInfos.y);\n#endif\n#endif\n#if defined(FORCENORMALFORWARD) && defined(NORMAL)\nclearCoatNormalW*=sign(dot(clearCoatNormalW,faceNormal));\n#endif\n#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)\nclearCoatNormalW=gl_FrontFacing ? clearCoatNormalW : -clearCoatNormalW;\n#endif\noutParams.clearCoatNormalW=clearCoatNormalW;\n\noutParams.clearCoatAARoughnessFactors=getAARoughnessFactors(clearCoatNormalW.xyz);\n\nfloat clearCoatNdotVUnclamped=dot(clearCoatNormalW,viewDirectionW);\n\nfloat clearCoatNdotV=absEps(clearCoatNdotVUnclamped);\n#if DEBUGMODE>0\noutParams.clearCoatNdotV=clearCoatNdotV;\n#endif\n#ifdef CLEARCOAT_TINT\n\nvec3 clearCoatVRefract=-refract(vPositionW,clearCoatNormalW,vClearCoatRefractionParams.y);\n\noutParams.clearCoatNdotVRefract=absEps(dot(clearCoatNormalW,clearCoatVRefract));\n#endif\n#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)\n\nvec3 environmentClearCoatBrdf=getBRDFLookup(clearCoatNdotV,clearCoatRoughness);\n#endif\n\n#if defined(REFLECTION)\nfloat clearCoatAlphaG=convertRoughnessToAverageSlope(clearCoatRoughness);\n#ifdef SPECULARAA\n\nclearCoatAlphaG+=outParams.clearCoatAARoughnessFactors.y;\n#endif\nvec4 environmentClearCoatRadiance=vec4(0.,0.,0.,0.);\nvec3 clearCoatReflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),clearCoatNormalW);\n#ifdef REFLECTIONMAP_OPPOSITEZ\nclearCoatReflectionVector.z*=-1.0;\n#endif\n\n#ifdef REFLECTIONMAP_3D\nvec3 clearCoatReflectionCoords=clearCoatReflectionVector;\n#else\nvec2 clearCoatReflectionCoords=clearCoatReflectionVector.xy;\n#ifdef REFLECTIONMAP_PROJECTION\nclearCoatReflectionCoords/=clearCoatReflectionVector.z;\n#endif\nclearCoatReflectionCoords.y=1.0-clearCoatReflectionCoords.y;\n#endif\nsampleReflectionTexture(\nclearCoatAlphaG,\nvReflectionMicrosurfaceInfos,\nvReflectionInfos,\nvReflectionColor,\n#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)\nclearCoatNdotVUnclamped,\n#endif\n#ifdef LINEARSPECULARREFLECTION\nclearCoatRoughness,\n#endif\nreflectionSampler,\nclearCoatReflectionCoords,\n#ifndef LODBASEDMICROSFURACE\nreflectionSamplerLow,\nreflectionSamplerHigh,\n#endif\n#ifdef REALTIME_FILTERING\nvReflectionFilteringInfo,\n#endif\nenvironmentClearCoatRadiance\n);\n#if DEBUGMODE>0\noutParams.environmentClearCoatRadiance=environmentClearCoatRadiance;\n#endif\n\n#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)\nvec3 clearCoatEnvironmentReflectance=getReflectanceFromBRDFLookup(vec3(vClearCoatRefractionParams.x),environmentClearCoatBrdf);\n#ifdef RADIANCEOCCLUSION\nfloat clearCoatSeo=environmentRadianceOcclusion(ambientMonochrome,clearCoatNdotVUnclamped);\nclearCoatEnvironmentReflectance*=clearCoatSeo;\n#endif\n#ifdef HORIZONOCCLUSION\n#ifdef BUMP\n#ifdef REFLECTIONMAP_3D\nfloat clearCoatEho=environmentHorizonOcclusion(-viewDirectionW,clearCoatNormalW,geometricNormalW);\nclearCoatEnvironmentReflectance*=clearCoatEho;\n#endif\n#endif\n#endif\n#else\n\nvec3 clearCoatEnvironmentReflectance=getReflectanceFromAnalyticalBRDFLookup_Jones(clearCoatNdotV,vec3(1.),vec3(1.),sqrt(1.-clearCoatRoughness));\n#endif\nclearCoatEnvironmentReflectance*=clearCoatIntensity;\n#if DEBUGMODE>0\noutParams.clearCoatEnvironmentReflectance=clearCoatEnvironmentReflectance;\n#endif\noutParams.finalClearCoatRadianceScaled=\nenvironmentClearCoatRadiance.rgb *\nclearCoatEnvironmentReflectance *\nvLightingIntensity.z;\n#endif\n#if defined(CLEARCOAT_TINT)\n\noutParams.absorption=computeClearCoatAbsorption(outParams.clearCoatNdotVRefract,outParams.clearCoatNdotVRefract,outParams.clearCoatColor,clearCoatThickness,clearCoatIntensity);\n#endif\n\nfloat fresnelIBLClearCoat=fresnelSchlickGGX(clearCoatNdotV,vClearCoatRefractionParams.x,CLEARCOATREFLECTANCE90);\nfresnelIBLClearCoat*=clearCoatIntensity;\noutParams.conservationFactor=(1.-fresnelIBLClearCoat);\n#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)\noutParams.energyConservationFactorClearCoat=getEnergyConservationFactor(outParams.specularEnvironmentR0,environmentClearCoatBrdf);\n#endif\n}\n#endif\n";
Effect.IncludesShadersStore[name$i] = shader$i;

var name$j = 'pbrBlockSubSurface';
var shader$j = "struct subSurfaceOutParams\n{\nvec3 specularEnvironmentReflectance;\n#ifdef SS_REFRACTION\nvec3 finalRefraction;\nvec3 surfaceAlbedo;\n#ifdef SS_LINKREFRACTIONTOTRANSPARENCY\nfloat alpha;\n#endif\n#ifdef REFLECTION\nfloat refractionFactorForIrradiance;\n#endif\n#endif\n#ifdef SS_TRANSLUCENCY\nvec3 transmittance;\nfloat translucencyIntensity;\n#ifdef REFLECTION\nvec3 refractionIrradiance;\n#endif\n#endif\n#if DEBUGMODE>0\nvec4 thicknessMap;\nvec4 environmentRefraction;\nvec3 refractionTransmittance;\n#endif\n};\n#ifdef SUBSURFACE\n#define pbr_inline\n#define inline\nvoid subSurfaceBlock(\nconst in vec3 vSubSurfaceIntensity,\nconst in vec2 vThicknessParam,\nconst in vec4 vTintColor,\nconst in vec3 normalW,\nconst in vec3 specularEnvironmentReflectance,\n#ifdef SS_THICKNESSANDMASK_TEXTURE\nconst in vec4 thicknessMap,\n#endif\n#ifdef REFLECTION\n#ifdef SS_TRANSLUCENCY\nconst in mat4 reflectionMatrix,\n#ifdef USESPHERICALFROMREFLECTIONMAP\n#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)\nconst in vec3 irradianceVector_,\n#endif\n#if defined(REALTIME_FILTERING)\nconst in samplerCube reflectionSampler,\nconst in vec2 vReflectionFilteringInfo,\n#endif\n#endif\n#ifdef USEIRRADIANCEMAP\n#ifdef REFLECTIONMAP_3D\nconst in samplerCube irradianceSampler,\n#else\nconst in sampler2D irradianceSampler,\n#endif\n#endif\n#endif\n#endif\n#ifdef SS_REFRACTION\nconst in vec3 vPositionW,\nconst in vec3 viewDirectionW,\nconst in mat4 view,\nconst in vec3 surfaceAlbedo,\nconst in vec4 vRefractionInfos,\nconst in mat4 refractionMatrix,\nconst in vec3 vRefractionMicrosurfaceInfos,\nconst in vec4 vLightingIntensity,\n#ifdef SS_LINKREFRACTIONTOTRANSPARENCY\nconst in float alpha,\n#endif\n#ifdef SS_LODINREFRACTIONALPHA\nconst in float NdotVUnclamped,\n#endif\n#ifdef SS_LINEARSPECULARREFRACTION\nconst in float roughness,\n#else\nconst in float alphaG,\n#endif\n#ifdef SS_REFRACTIONMAP_3D\nconst in samplerCube refractionSampler,\n#ifndef LODBASEDMICROSFURACE\nconst in samplerCube refractionSamplerLow,\nconst in samplerCube refractionSamplerHigh,\n#endif\n#else\nconst in sampler2D refractionSampler,\n#ifndef LODBASEDMICROSFURACE\nconst in sampler2D refractionSamplerLow,\nconst in sampler2D refractionSamplerHigh,\n#endif\n#endif\n#ifdef ANISOTROPIC\nconst in anisotropicOutParams anisotropicOut,\n#endif\n#ifdef REALTIME_FILTERING\nconst in vec2 vRefractionFilteringInfo,\n#endif\n#endif\n#ifdef SS_TRANSLUCENCY\nconst in vec3 vDiffusionDistance,\n#endif\nout subSurfaceOutParams outParams\n)\n{\noutParams.specularEnvironmentReflectance=specularEnvironmentReflectance;\n\n\n\n#ifdef SS_REFRACTION\nfloat refractionIntensity=vSubSurfaceIntensity.x;\n#ifdef SS_LINKREFRACTIONTOTRANSPARENCY\nrefractionIntensity*=(1.0-alpha);\n\noutParams.alpha=1.0;\n#endif\n#endif\n#ifdef SS_TRANSLUCENCY\nfloat translucencyIntensity=vSubSurfaceIntensity.y;\n#endif\n#ifdef SS_THICKNESSANDMASK_TEXTURE\nfloat thickness=thicknessMap.r*vThicknessParam.y+vThicknessParam.x;\n#if DEBUGMODE>0\noutParams.thicknessMap=thicknessMap;\n#endif\n#ifdef SS_MASK_FROM_THICKNESS_TEXTURE\n#ifdef SS_REFRACTION\nrefractionIntensity*=thicknessMap.g;\n#endif\n#ifdef SS_TRANSLUCENCY\ntranslucencyIntensity*=thicknessMap.b;\n#endif\n#elif defined(SS_MASK_FROM_THICKNESS_TEXTURE_GLTF)\n#ifdef SS_REFRACTION\nrefractionIntensity*=thicknessMap.r;\n#elif defined(SS_TRANSLUCENCY)\ntranslucencyIntensity*=thicknessMap.r;\n#endif\nthickness=thicknessMap.g*vThicknessParam.y+vThicknessParam.x;\n#endif\n#else\nfloat thickness=vThicknessParam.y;\n#endif\n\n\n\n#ifdef SS_TRANSLUCENCY\nthickness=maxEps(thickness);\nvec3 transmittance=transmittanceBRDF_Burley(vTintColor.rgb,vDiffusionDistance,thickness);\ntransmittance*=translucencyIntensity;\noutParams.transmittance=transmittance;\noutParams.translucencyIntensity=translucencyIntensity;\n#endif\n\n\n\n#ifdef SS_REFRACTION\nvec4 environmentRefraction=vec4(0.,0.,0.,0.);\n#ifdef ANISOTROPIC\nvec3 refractionVector=refract(-viewDirectionW,anisotropicOut.anisotropicNormal,vRefractionInfos.y);\n#else\nvec3 refractionVector=refract(-viewDirectionW,normalW,vRefractionInfos.y);\n#endif\n#ifdef SS_REFRACTIONMAP_OPPOSITEZ\nrefractionVector.z*=-1.0;\n#endif\n\n#ifdef SS_REFRACTIONMAP_3D\nrefractionVector.y=refractionVector.y*vRefractionInfos.w;\nvec3 refractionCoords=refractionVector;\nrefractionCoords=vec3(refractionMatrix*vec4(refractionCoords,0));\n#else\nvec3 vRefractionUVW=vec3(refractionMatrix*(view*vec4(vPositionW+refractionVector*vRefractionInfos.z,1.0)));\nvec2 refractionCoords=vRefractionUVW.xy/vRefractionUVW.z;\nrefractionCoords.y=1.0-refractionCoords.y;\n#endif\n#ifdef SS_LODINREFRACTIONALPHA\nfloat refractionLOD=getLodFromAlphaG(vRefractionMicrosurfaceInfos.x,alphaG,NdotVUnclamped);\n#elif defined(SS_LINEARSPECULARREFRACTION)\nfloat refractionLOD=getLinearLodFromRoughness(vRefractionMicrosurfaceInfos.x,roughness);\n#else\nfloat refractionLOD=getLodFromAlphaG(vRefractionMicrosurfaceInfos.x,alphaG);\n#endif\n#ifdef LODBASEDMICROSFURACE\n\nrefractionLOD=refractionLOD*vRefractionMicrosurfaceInfos.y+vRefractionMicrosurfaceInfos.z;\n#ifdef SS_LODINREFRACTIONALPHA\n\n\n\n\n\n\n\n\n\nfloat automaticRefractionLOD=UNPACK_LOD(sampleRefraction(refractionSampler,refractionCoords).a);\nfloat requestedRefractionLOD=max(automaticRefractionLOD,refractionLOD);\n#else\nfloat requestedRefractionLOD=refractionLOD;\n#endif\n#ifdef REALTIME_FILTERING\nenvironmentRefraction=vec4(radiance(alphaG,refractionSampler,refractionCoords,vRefractionFilteringInfo),1.0);\n#else\nenvironmentRefraction=sampleRefractionLod(refractionSampler,refractionCoords,requestedRefractionLOD);\n#endif\n#else\nfloat lodRefractionNormalized=saturate(refractionLOD/log2(vRefractionMicrosurfaceInfos.x));\nfloat lodRefractionNormalizedDoubled=lodRefractionNormalized*2.0;\nvec4 environmentRefractionMid=sampleRefraction(refractionSampler,refractionCoords);\nif (lodRefractionNormalizedDoubled<1.0){\nenvironmentRefraction=mix(\nsampleRefraction(refractionSamplerHigh,refractionCoords),\nenvironmentRefractionMid,\nlodRefractionNormalizedDoubled\n);\n} else {\nenvironmentRefraction=mix(\nenvironmentRefractionMid,\nsampleRefraction(refractionSamplerLow,refractionCoords),\nlodRefractionNormalizedDoubled-1.0\n);\n}\n#endif\n#ifdef SS_RGBDREFRACTION\nenvironmentRefraction.rgb=fromRGBD(environmentRefraction);\n#endif\n#ifdef SS_GAMMAREFRACTION\nenvironmentRefraction.rgb=toLinearSpace(environmentRefraction.rgb);\n#endif\n\nenvironmentRefraction.rgb*=vRefractionInfos.x;\n#endif\n\n\n\n#ifdef SS_REFRACTION\nvec3 refractionTransmittance=vec3(refractionIntensity);\n#ifdef SS_THICKNESSANDMASK_TEXTURE\nvec3 volumeAlbedo=computeColorAtDistanceInMedia(vTintColor.rgb,vTintColor.w);\n\n\n\n\n\nrefractionTransmittance*=cocaLambert(volumeAlbedo,thickness);\n#elif defined(SS_LINKREFRACTIONTOTRANSPARENCY)\n\nfloat maxChannel=max(max(surfaceAlbedo.r,surfaceAlbedo.g),surfaceAlbedo.b);\nvec3 volumeAlbedo=saturate(maxChannel*surfaceAlbedo);\n\nenvironmentRefraction.rgb*=volumeAlbedo;\n#else\n\nvec3 volumeAlbedo=computeColorAtDistanceInMedia(vTintColor.rgb,vTintColor.w);\nrefractionTransmittance*=cocaLambert(volumeAlbedo,vThicknessParam.y);\n#endif\n#ifdef SS_ALBEDOFORREFRACTIONTINT\n\nenvironmentRefraction.rgb*=surfaceAlbedo.rgb;\n#endif\n\noutParams.surfaceAlbedo=surfaceAlbedo*(1.-refractionIntensity);\n#ifdef REFLECTION\n\noutParams.refractionFactorForIrradiance=(1.-refractionIntensity);\n\n#endif\n\nvec3 bounceSpecularEnvironmentReflectance=(2.0*specularEnvironmentReflectance)/(1.0+specularEnvironmentReflectance);\noutParams.specularEnvironmentReflectance=mix(bounceSpecularEnvironmentReflectance,specularEnvironmentReflectance,refractionIntensity);\n\nrefractionTransmittance*=1.0-outParams.specularEnvironmentReflectance;\n#if DEBUGMODE>0\noutParams.refractionTransmittance=refractionTransmittance;\n#endif\noutParams.finalRefraction=environmentRefraction.rgb*refractionTransmittance*vLightingIntensity.z;\n#if DEBUGMODE>0\noutParams.environmentRefraction=environmentRefraction;\n#endif\n#endif\n\n\n\n#if defined(REFLECTION) && defined(SS_TRANSLUCENCY)\n#if defined(NORMAL) && defined(USESPHERICALINVERTEX) || !defined(USESPHERICALFROMREFLECTIONMAP)\nvec3 irradianceVector=vec3(reflectionMatrix*vec4(normalW,0)).xyz;\n#ifdef REFLECTIONMAP_OPPOSITEZ\nirradianceVector.z*=-1.0;\n#endif\n#ifdef INVERTCUBICMAP\nirradianceVector.y*=-1.0;\n#endif\n#else\nvec3 irradianceVector=irradianceVector_;\n#endif\n#if defined(USESPHERICALFROMREFLECTIONMAP)\n#if defined(REALTIME_FILTERING)\nvec3 refractionIrradiance=irradiance(reflectionSampler,-irradianceVector,vReflectionFilteringInfo);\n#else\nvec3 refractionIrradiance=computeEnvironmentIrradiance(-irradianceVector);\n#endif\n#elif defined(USEIRRADIANCEMAP)\n#ifdef REFLECTIONMAP_3D\nvec3 irradianceCoords=irradianceVector;\n#else\nvec2 irradianceCoords=irradianceVector.xy;\n#ifdef REFLECTIONMAP_PROJECTION\nirradianceCoords/=irradianceVector.z;\n#endif\nirradianceCoords.y=1.0-irradianceCoords.y;\n#endif\nvec4 refractionIrradiance=sampleReflection(irradianceSampler,-irradianceCoords);\n#ifdef RGBDREFLECTION\nrefractionIrradiance.rgb=fromRGBD(refractionIrradiance);\n#endif\n#ifdef GAMMAREFLECTION\nrefractionIrradiance.rgb=toLinearSpace(refractionIrradiance.rgb);\n#endif\n#else\nvec4 refractionIrradiance=vec4(0.);\n#endif\nrefractionIrradiance.rgb*=transmittance;\noutParams.refractionIrradiance=refractionIrradiance.rgb;\n#endif\n}\n#endif\n";
Effect.IncludesShadersStore[name$j] = shader$j;

var name$k = 'pbrBlockNormalGeometric';
var shader$k = "vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);\n#ifdef NORMAL\nvec3 normalW=normalize(vNormalW);\n#else\nvec3 normalW=normalize(cross(dFdx(vPositionW),dFdy(vPositionW)))*vEyePosition.w;\n#endif\nvec3 geometricNormalW=normalW;\n#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)\ngeometricNormalW=gl_FrontFacing ? geometricNormalW : -geometricNormalW;\n#endif\n";
Effect.IncludesShadersStore[name$k] = shader$k;

var name$l = 'pbrBlockNormalFinal';
var shader$l = "#if defined(FORCENORMALFORWARD) && defined(NORMAL)\nvec3 faceNormal=normalize(cross(dFdx(vPositionW),dFdy(vPositionW)))*vEyePosition.w;\n#if defined(TWOSIDEDLIGHTING)\nfaceNormal=gl_FrontFacing ? faceNormal : -faceNormal;\n#endif\nnormalW*=sign(dot(normalW,faceNormal));\n#endif\n#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)\nnormalW=gl_FrontFacing ? normalW : -normalW;\n#endif\n";
Effect.IncludesShadersStore[name$l] = shader$l;

var name$m = 'pbrBlockLightmapInit';
var shader$m = "#ifdef LIGHTMAP\nvec4 lightmapColor=texture2D(lightmapSampler,vLightmapUV+uvOffset);\n#ifdef RGBDLIGHTMAP\nlightmapColor.rgb=fromRGBD(lightmapColor);\n#endif\n#ifdef GAMMALIGHTMAP\nlightmapColor.rgb=toLinearSpace(lightmapColor.rgb);\n#endif\nlightmapColor.rgb*=vLightmapInfos.y;\n#endif\n";
Effect.IncludesShadersStore[name$m] = shader$m;

var name$n = 'pbrBlockGeometryInfo';
var shader$n = "float NdotVUnclamped=dot(normalW,viewDirectionW);\n\nfloat NdotV=absEps(NdotVUnclamped);\nfloat alphaG=convertRoughnessToAverageSlope(roughness);\nvec2 AARoughnessFactors=getAARoughnessFactors(normalW.xyz);\n#ifdef SPECULARAA\n\nalphaG+=AARoughnessFactors.y;\n#endif\n#if defined(ENVIRONMENTBRDF)\n\nvec3 environmentBrdf=getBRDFLookup(NdotV,roughness);\n#endif\n#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)\n#ifdef RADIANCEOCCLUSION\n#ifdef AMBIENTINGRAYSCALE\nfloat ambientMonochrome=aoOut.ambientOcclusionColor.r;\n#else\nfloat ambientMonochrome=getLuminance(aoOut.ambientOcclusionColor);\n#endif\nfloat seo=environmentRadianceOcclusion(ambientMonochrome,NdotVUnclamped);\n#endif\n#ifdef HORIZONOCCLUSION\n#ifdef BUMP\n#ifdef REFLECTIONMAP_3D\nfloat eho=environmentHorizonOcclusion(-viewDirectionW,normalW,geometricNormalW);\n#endif\n#endif\n#endif\n#endif\n";
Effect.IncludesShadersStore[name$n] = shader$n;

var name$o = 'pbrBlockReflectance0';
var shader$o = "float reflectance=max(max(reflectivityOut.surfaceReflectivityColor.r,reflectivityOut.surfaceReflectivityColor.g),reflectivityOut.surfaceReflectivityColor.b);\nvec3 specularEnvironmentR0=reflectivityOut.surfaceReflectivityColor.rgb;\n#ifdef METALLICWORKFLOW\nvec3 specularEnvironmentR90=vec3(metallicReflectanceFactors.a);\n#else\nvec3 specularEnvironmentR90=vec3(1.0,1.0,1.0);\n#endif\n\n#ifdef ALPHAFRESNEL\nfloat reflectance90=fresnelGrazingReflectance(reflectance);\nspecularEnvironmentR90=specularEnvironmentR90*reflectance90;\n#endif\n";
Effect.IncludesShadersStore[name$o] = shader$o;

var name$p = 'pbrBlockReflectance';
var shader$p = "#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)\nvec3 specularEnvironmentReflectance=getReflectanceFromBRDFLookup(clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,environmentBrdf);\n#ifdef RADIANCEOCCLUSION\nspecularEnvironmentReflectance*=seo;\n#endif\n#ifdef HORIZONOCCLUSION\n#ifdef BUMP\n#ifdef REFLECTIONMAP_3D\nspecularEnvironmentReflectance*=eho;\n#endif\n#endif\n#endif\n#else\n\nvec3 specularEnvironmentReflectance=getReflectanceFromAnalyticalBRDFLookup_Jones(NdotV,clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,sqrt(microSurface));\n#endif\n#ifdef CLEARCOAT\nspecularEnvironmentReflectance*=clearcoatOut.conservationFactor;\n#if defined(CLEARCOAT_TINT)\nspecularEnvironmentReflectance*=clearcoatOut.absorption;\n#endif\n#endif\n";
Effect.IncludesShadersStore[name$p] = shader$p;

var name$q = 'pbrBlockDirectLighting';
var shader$q = "vec3 diffuseBase=vec3(0.,0.,0.);\n#ifdef SPECULARTERM\nvec3 specularBase=vec3(0.,0.,0.);\n#endif\n#ifdef CLEARCOAT\nvec3 clearCoatBase=vec3(0.,0.,0.);\n#endif\n#ifdef SHEEN\nvec3 sheenBase=vec3(0.,0.,0.);\n#endif\n\npreLightingInfo preInfo;\nlightingInfo info;\nfloat shadow=1.;\n#if defined(CLEARCOAT) && defined(CLEARCOAT_TINT)\nvec3 absorption=vec3(0.);\n#endif\n";
Effect.IncludesShadersStore[name$q] = shader$q;

var name$r = 'pbrBlockFinalLitComponents';
var shader$r = "\n\n\n\n#if defined(ENVIRONMENTBRDF)\n#ifdef MS_BRDF_ENERGY_CONSERVATION\nvec3 energyConservationFactor=getEnergyConservationFactor(clearcoatOut.specularEnvironmentR0,environmentBrdf);\n#endif\n#endif\n#ifndef METALLICWORKFLOW\n#ifdef SPECULAR_GLOSSINESS_ENERGY_CONSERVATION\nsurfaceAlbedo.rgb=(1.-reflectance)*surfaceAlbedo.rgb;\n#endif\n#endif\n#if defined(SHEEN) && defined(SHEEN_ALBEDOSCALING) && defined(ENVIRONMENTBRDF)\nsurfaceAlbedo.rgb=sheenOut.sheenAlbedoScaling*surfaceAlbedo.rgb;\n#endif\n\n#ifdef REFLECTION\nvec3 finalIrradiance=reflectionOut.environmentIrradiance;\n#if defined(CLEARCOAT)\nfinalIrradiance*=clearcoatOut.conservationFactor;\n#if defined(CLEARCOAT_TINT)\nfinalIrradiance*=clearcoatOut.absorption;\n#endif\n#endif\n#if defined(SS_REFRACTION)\nfinalIrradiance*=subSurfaceOut.refractionFactorForIrradiance;\n#endif\n#if defined(SS_TRANSLUCENCY)\nfinalIrradiance*=(1.0-subSurfaceOut.translucencyIntensity);\nfinalIrradiance+=subSurfaceOut.refractionIrradiance;\n#endif\nfinalIrradiance*=surfaceAlbedo.rgb;\nfinalIrradiance*=vLightingIntensity.z;\nfinalIrradiance*=aoOut.ambientOcclusionColor;\n#endif\n\n#ifdef SPECULARTERM\nvec3 finalSpecular=specularBase;\nfinalSpecular=max(finalSpecular,0.0);\nvec3 finalSpecularScaled=finalSpecular*vLightingIntensity.x*vLightingIntensity.w;\n#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)\nfinalSpecularScaled*=energyConservationFactor;\n#endif\n#if defined(SHEEN) && defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)\nfinalSpecularScaled*=sheenOut.sheenAlbedoScaling;\n#endif\n#endif\n\n#ifdef REFLECTION\nvec3 finalRadiance=reflectionOut.environmentRadiance.rgb;\nfinalRadiance*=subSurfaceOut.specularEnvironmentReflectance;\nvec3 finalRadianceScaled=finalRadiance*vLightingIntensity.z;\n#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)\nfinalRadianceScaled*=energyConservationFactor;\n#endif\n#if defined(SHEEN) && defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)\nfinalRadianceScaled*=sheenOut.sheenAlbedoScaling;\n#endif\n#endif\n\n#ifdef SHEEN\nvec3 finalSheen=sheenBase*sheenOut.sheenColor;\nfinalSheen=max(finalSheen,0.0);\nvec3 finalSheenScaled=finalSheen*vLightingIntensity.x*vLightingIntensity.w;\n#if defined(CLEARCOAT) && defined(REFLECTION) && defined(ENVIRONMENTBRDF)\nsheenOut.finalSheenRadianceScaled*=clearcoatOut.conservationFactor;\n#if defined(CLEARCOAT_TINT)\nsheenOut.finalSheenRadianceScaled*=clearcoatOut.absorption;\n#endif\n#endif\n#endif\n\n#ifdef CLEARCOAT\nvec3 finalClearCoat=clearCoatBase;\nfinalClearCoat=max(finalClearCoat,0.0);\nvec3 finalClearCoatScaled=finalClearCoat*vLightingIntensity.x*vLightingIntensity.w;\n#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)\nfinalClearCoatScaled*=clearcoatOut.energyConservationFactorClearCoat;\n#endif\n#ifdef SS_REFRACTION\nsubSurfaceOut.finalRefraction*=clearcoatOut.conservationFactor;\n#ifdef CLEARCOAT_TINT\nsubSurfaceOut.finalRefraction*=clearcoatOut.absorption;\n#endif\n#endif\n#endif\n\n#ifdef ALPHABLEND\nfloat luminanceOverAlpha=0.0;\n#if defined(REFLECTION) && defined(RADIANCEOVERALPHA)\nluminanceOverAlpha+=getLuminance(finalRadianceScaled);\n#if defined(CLEARCOAT)\nluminanceOverAlpha+=getLuminance(clearcoatOut.finalClearCoatRadianceScaled);\n#endif\n#endif\n#if defined(SPECULARTERM) && defined(SPECULAROVERALPHA)\nluminanceOverAlpha+=getLuminance(finalSpecularScaled);\n#endif\n#if defined(CLEARCOAT) && defined(CLEARCOATOVERALPHA)\nluminanceOverAlpha+=getLuminance(finalClearCoatScaled);\n#endif\n#if defined(RADIANCEOVERALPHA) || defined(SPECULAROVERALPHA) || defined(CLEARCOATOVERALPHA)\nalpha=saturate(alpha+luminanceOverAlpha*luminanceOverAlpha);\n#endif\n#endif\n";
Effect.IncludesShadersStore[name$r] = shader$r;

var name$s = 'pbrBlockFinalUnlitComponents';
var shader$s = "\nvec3 finalDiffuse=diffuseBase;\nfinalDiffuse*=surfaceAlbedo.rgb;\nfinalDiffuse=max(finalDiffuse,0.0);\nfinalDiffuse*=vLightingIntensity.x;\n\nvec3 finalAmbient=vAmbientColor;\nfinalAmbient*=surfaceAlbedo.rgb;\n\nvec3 finalEmissive=vEmissiveColor;\n#ifdef EMISSIVE\nvec3 emissiveColorTex=texture2D(emissiveSampler,vEmissiveUV+uvOffset).rgb;\nfinalEmissive*=toLinearSpace(emissiveColorTex.rgb);\nfinalEmissive*=vEmissiveInfos.y;\n#endif\nfinalEmissive*=vLightingIntensity.y;\n\n#ifdef AMBIENT\nvec3 ambientOcclusionForDirectDiffuse=mix(vec3(1.),aoOut.ambientOcclusionColor,vAmbientInfos.w);\n#else\nvec3 ambientOcclusionForDirectDiffuse=aoOut.ambientOcclusionColor;\n#endif\nfinalAmbient*=aoOut.ambientOcclusionColor;\nfinalDiffuse*=ambientOcclusionForDirectDiffuse;\n";
Effect.IncludesShadersStore[name$s] = shader$s;

var name$t = 'pbrBlockFinalColorComposition';
var shader$t = "vec4 finalColor=vec4(\nfinalAmbient +\nfinalDiffuse +\n#ifndef UNLIT\n#ifdef REFLECTION\nfinalIrradiance +\n#endif\n#ifdef SPECULARTERM\nfinalSpecularScaled +\n#endif\n#ifdef SHEEN\nfinalSheenScaled +\n#endif\n#ifdef CLEARCOAT\nfinalClearCoatScaled +\n#endif\n#ifdef REFLECTION\nfinalRadianceScaled +\n#if defined(SHEEN) && defined(ENVIRONMENTBRDF)\nsheenOut.finalSheenRadianceScaled +\n#endif\n#ifdef CLEARCOAT\nclearcoatOut.finalClearCoatRadianceScaled +\n#endif\n#endif\n#ifdef SS_REFRACTION\nsubSurfaceOut.finalRefraction +\n#endif\n#endif\nfinalEmissive,\nalpha);\n\n#ifdef LIGHTMAP\n#ifndef LIGHTMAPEXCLUDED\n#ifdef USELIGHTMAPASSHADOWMAP\nfinalColor.rgb*=lightmapColor.rgb;\n#else\nfinalColor.rgb+=lightmapColor.rgb;\n#endif\n#endif\n#endif\n#define CUSTOM_FRAGMENT_BEFORE_FOG\n\nfinalColor=max(finalColor,0.0);\n";
Effect.IncludesShadersStore[name$t] = shader$t;

var name$u = 'pbrBlockImageProcessing';
var shader$u = "#ifdef IMAGEPROCESSINGPOSTPROCESS\n\n\nfinalColor.rgb=clamp(finalColor.rgb,0.,30.0);\n#else\n\nfinalColor=applyImageProcessing(finalColor);\n#endif\nfinalColor.a*=visibility;\n#ifdef PREMULTIPLYALPHA\n\nfinalColor.rgb*=finalColor.a;\n#endif\n";
Effect.IncludesShadersStore[name$u] = shader$u;

var name$v = 'pbrDebug';
var shader$v = "#if DEBUGMODE>0\nif (vClipSpacePosition.x/vClipSpacePosition.w>=vDebugMode.x) {\n\n#if DEBUGMODE == 1\ngl_FragColor.rgb=vPositionW.rgb;\n#define DEBUGMODE_NORMALIZE\n#elif DEBUGMODE == 2 && defined(NORMAL)\ngl_FragColor.rgb=vNormalW.rgb;\n#define DEBUGMODE_NORMALIZE\n#elif DEBUGMODE == 3 && defined(BUMP) || DEBUGMODE == 3 && defined(PARALLAX) || DEBUGMODE == 3 && defined(ANISOTROPIC)\n\ngl_FragColor.rgb=TBN[0];\n#define DEBUGMODE_NORMALIZE\n#elif DEBUGMODE == 4 && defined(BUMP) || DEBUGMODE == 4 && defined(PARALLAX) || DEBUGMODE == 4 && defined(ANISOTROPIC)\n\ngl_FragColor.rgb=TBN[1];\n#define DEBUGMODE_NORMALIZE\n#elif DEBUGMODE == 5\n\ngl_FragColor.rgb=normalW;\n#define DEBUGMODE_NORMALIZE\n#elif DEBUGMODE == 6 && defined(MAINUV1)\ngl_FragColor.rgb=vec3(vMainUV1,0.0);\n#elif DEBUGMODE == 7 && defined(MAINUV2)\ngl_FragColor.rgb=vec3(vMainUV2,0.0);\n#elif DEBUGMODE == 8 && defined(CLEARCOAT) && defined(CLEARCOAT_BUMP)\n\ngl_FragColor.rgb=clearcoatOut.TBNClearCoat[0];\n#define DEBUGMODE_NORMALIZE\n#elif DEBUGMODE == 9 && defined(CLEARCOAT) && defined(CLEARCOAT_BUMP)\n\ngl_FragColor.rgb=clearcoatOut.TBNClearCoat[1];\n#define DEBUGMODE_NORMALIZE\n#elif DEBUGMODE == 10 && defined(CLEARCOAT)\n\ngl_FragColor.rgb=clearcoatOut.clearCoatNormalW;\n#define DEBUGMODE_NORMALIZE\n#elif DEBUGMODE == 11 && defined(ANISOTROPIC)\ngl_FragColor.rgb=anisotropicOut.anisotropicNormal;\n#define DEBUGMODE_NORMALIZE\n#elif DEBUGMODE == 12 && defined(ANISOTROPIC)\ngl_FragColor.rgb=anisotropicOut.anisotropicTangent;\n#define DEBUGMODE_NORMALIZE\n#elif DEBUGMODE == 13 && defined(ANISOTROPIC)\ngl_FragColor.rgb=anisotropicOut.anisotropicBitangent;\n#define DEBUGMODE_NORMALIZE\n\n#elif DEBUGMODE == 20 && defined(ALBEDO)\ngl_FragColor.rgb=albedoTexture.rgb;\n#elif DEBUGMODE == 21 && defined(AMBIENT)\ngl_FragColor.rgb=aoOut.ambientOcclusionColorMap.rgb;\n#elif DEBUGMODE == 22 && defined(OPACITY)\ngl_FragColor.rgb=opacityMap.rgb;\n#elif DEBUGMODE == 23 && defined(EMISSIVE)\ngl_FragColor.rgb=emissiveColorTex.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 24 && defined(LIGHTMAP)\ngl_FragColor.rgb=lightmapColor.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 25 && defined(REFLECTIVITY) && defined(METALLICWORKFLOW)\ngl_FragColor.rgb=reflectivityOut.surfaceMetallicColorMap.rgb;\n#elif DEBUGMODE == 26 && defined(REFLECTIVITY) && !defined(METALLICWORKFLOW)\ngl_FragColor.rgb=reflectivityOut.surfaceReflectivityColorMap.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 27 && defined(CLEARCOAT) && defined(CLEARCOAT_TEXTURE)\ngl_FragColor.rgb=vec3(clearcoatOut.clearCoatMapData.rg,0.0);\n#elif DEBUGMODE == 28 && defined(CLEARCOAT) && defined(CLEARCOAT_TINT) && defined(CLEARCOAT_TINT_TEXTURE)\ngl_FragColor.rgb=clearcoatOut.clearCoatTintMapData.rgb;\n#elif DEBUGMODE == 29 && defined(SHEEN) && defined(SHEEN_TEXTURE)\ngl_FragColor.rgb=sheenOut.sheenMapData.rgb;\n#elif DEBUGMODE == 30 && defined(ANISOTROPIC) && defined(ANISOTROPIC_TEXTURE)\ngl_FragColor.rgb=anisotropicOut.anisotropyMapData.rgb;\n#elif DEBUGMODE == 31 && defined(SUBSURFACE) && defined(SS_THICKNESSANDMASK_TEXTURE)\ngl_FragColor.rgb=subSurfaceOut.thicknessMap.rgb;\n\n#elif DEBUGMODE == 40 && defined(SS_REFRACTION)\n\ngl_FragColor.rgb=subSurfaceOut.environmentRefraction.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 41 && defined(REFLECTION)\ngl_FragColor.rgb=reflectionOut.environmentRadiance.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 42 && defined(CLEARCOAT) && defined(REFLECTION)\ngl_FragColor.rgb=clearcoatOut.environmentClearCoatRadiance.rgb;\n#define DEBUGMODE_GAMMA\n\n#elif DEBUGMODE == 50\ngl_FragColor.rgb=diffuseBase.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 51 && defined(SPECULARTERM)\ngl_FragColor.rgb=specularBase.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 52 && defined(CLEARCOAT)\ngl_FragColor.rgb=clearCoatBase.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 53 && defined(SHEEN)\ngl_FragColor.rgb=sheenBase.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 54 && defined(REFLECTION)\ngl_FragColor.rgb=reflectionOut.environmentIrradiance.rgb;\n#define DEBUGMODE_GAMMA\n\n#elif DEBUGMODE == 60\ngl_FragColor.rgb=surfaceAlbedo.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 61\ngl_FragColor.rgb=clearcoatOut.specularEnvironmentR0;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 62 && defined(METALLICWORKFLOW)\ngl_FragColor.rgb=vec3(reflectivityOut.metallicRoughness.r);\n#elif DEBUGMODE == 71 && defined(METALLICWORKFLOW)\ngl_FragColor.rgb=reflectivityOut.metallicF0;\n#elif DEBUGMODE == 63\ngl_FragColor.rgb=vec3(roughness);\n#elif DEBUGMODE == 64\ngl_FragColor.rgb=vec3(alphaG);\n#elif DEBUGMODE == 65\ngl_FragColor.rgb=vec3(NdotV);\n#elif DEBUGMODE == 66 && defined(CLEARCOAT) && defined(CLEARCOAT_TINT)\ngl_FragColor.rgb=clearcoatOut.clearCoatColor.rgb;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 67 && defined(CLEARCOAT)\ngl_FragColor.rgb=vec3(clearcoatOut.clearCoatRoughness);\n#elif DEBUGMODE == 68 && defined(CLEARCOAT)\ngl_FragColor.rgb=vec3(clearcoatOut.clearCoatNdotV);\n#elif DEBUGMODE == 69 && defined(SUBSURFACE) && defined(SS_TRANSLUCENCY)\ngl_FragColor.rgb=subSurfaceOut.transmittance;\n#elif DEBUGMODE == 70 && defined(SUBSURFACE) && defined(SS_REFRACTION)\ngl_FragColor.rgb=subSurfaceOut.refractionTransmittance;\n\n#elif DEBUGMODE == 80 && defined(RADIANCEOCCLUSION)\ngl_FragColor.rgb=vec3(seo);\n#elif DEBUGMODE == 81 && defined(HORIZONOCCLUSION)\ngl_FragColor.rgb=vec3(eho);\n#elif DEBUGMODE == 82 && defined(MS_BRDF_ENERGY_CONSERVATION)\ngl_FragColor.rgb=vec3(energyConservationFactor);\n#elif DEBUGMODE == 83 && defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)\ngl_FragColor.rgb=specularEnvironmentReflectance;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 84 && defined(CLEARCOAT) && defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)\ngl_FragColor.rgb=clearcoatOut.clearCoatEnvironmentReflectance;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 85 && defined(SHEEN) && defined(REFLECTION)\ngl_FragColor.rgb=sheenOut.sheenEnvironmentReflectance;\n#define DEBUGMODE_GAMMA\n#elif DEBUGMODE == 86 && defined(ALPHABLEND)\ngl_FragColor.rgb=vec3(luminanceOverAlpha);\n#elif DEBUGMODE == 87\ngl_FragColor.rgb=vec3(alpha);\n#endif\ngl_FragColor.rgb*=vDebugMode.y;\n#ifdef DEBUGMODE_NORMALIZE\ngl_FragColor.rgb=normalize(gl_FragColor.rgb)*0.5+0.5;\n#endif\n#ifdef DEBUGMODE_GAMMA\ngl_FragColor.rgb=toGammaSpace(gl_FragColor.rgb);\n#endif\ngl_FragColor.a=1.0;\n#ifdef PREPASS\ngl_FragData[0]=toLinearSpace(gl_FragColor);\ngl_FragData[1]=vec4(0.,0.,0.,0.);\n#endif\nreturn;\n}\n#endif";
Effect.IncludesShadersStore[name$v] = shader$v;

var name$w = 'pbrPixelShader';
var shader$w = "#if defined(BUMP) || !defined(NORMAL) || defined(FORCENORMALFORWARD) || defined(SPECULARAA) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)\n#extension GL_OES_standard_derivatives : enable\n#endif\n#ifdef LODBASEDMICROSFURACE\n#extension GL_EXT_shader_texture_lod : enable\n#endif\n#define CUSTOM_FRAGMENT_BEGIN\n#ifdef LOGARITHMICDEPTH\n#extension GL_EXT_frag_depth : enable\n#endif\n#include<prePassDeclaration>[SCENE_MRT_COUNT]\nprecision highp float;\n\n#ifndef FROMLINEARSPACE\n#define FROMLINEARSPACE\n#endif\n\n#include<__decl__pbrFragment>\n#include<pbrFragmentExtraDeclaration>\n#include<__decl__lightFragment>[0..maxSimultaneousLights]\n#include<pbrFragmentSamplersDeclaration>\n#include<imageProcessingDeclaration>\n#include<clipPlaneFragmentDeclaration>\n#include<logDepthDeclaration>\n#include<fogFragmentDeclaration>\n\n#include<helperFunctions>\n#include<subSurfaceScatteringFunctions>\n#include<importanceSampling>\n#include<pbrHelperFunctions>\n#include<imageProcessingFunctions>\n#include<shadowsFragmentFunctions>\n#include<harmonicsFunctions>\n#include<pbrDirectLightingSetupFunctions>\n#include<pbrDirectLightingFalloffFunctions>\n#include<pbrBRDFFunctions>\n#include<hdrFilteringFunctions>\n#include<pbrDirectLightingFunctions>\n#include<pbrIBLFunctions>\n#include<bumpFragmentMainFunctions>\n#include<bumpFragmentFunctions>\n#ifdef REFLECTION\n#include<reflectionFunction>\n#endif\n#define CUSTOM_FRAGMENT_DEFINITIONS\n#include<pbrBlockAlbedoOpacity>\n#include<pbrBlockReflectivity>\n#include<pbrBlockAmbientOcclusion>\n#include<pbrBlockAlphaFresnel>\n#include<pbrBlockAnisotropic>\n#include<pbrBlockReflection>\n#include<pbrBlockSheen>\n#include<pbrBlockClearcoat>\n#include<pbrBlockSubSurface>\n\nvoid main(void) {\n#define CUSTOM_FRAGMENT_MAIN_BEGIN\n#include<clipPlaneFragment>\n\n#include<pbrBlockNormalGeometric>\n#include<bumpFragment>\n#include<pbrBlockNormalFinal>\n\nalbedoOpacityOutParams albedoOpacityOut;\n#ifdef ALBEDO\nvec4 albedoTexture=texture2D(albedoSampler,vAlbedoUV+uvOffset);\n#endif\n#ifdef OPACITY\nvec4 opacityMap=texture2D(opacitySampler,vOpacityUV+uvOffset);\n#endif\nalbedoOpacityBlock(\nvAlbedoColor,\n#ifdef ALBEDO\nalbedoTexture,\nvAlbedoInfos,\n#endif\n#ifdef OPACITY\nopacityMap,\nvOpacityInfos,\n#endif\n#ifdef DETAIL\ndetailColor,\nvDetailInfos,\n#endif\nalbedoOpacityOut\n);\nvec3 surfaceAlbedo=albedoOpacityOut.surfaceAlbedo;\nfloat alpha=albedoOpacityOut.alpha;\n#define CUSTOM_FRAGMENT_UPDATE_ALPHA\n#include<depthPrePass>\n#define CUSTOM_FRAGMENT_BEFORE_LIGHTS\n\nambientOcclusionOutParams aoOut;\n#ifdef AMBIENT\nvec3 ambientOcclusionColorMap=texture2D(ambientSampler,vAmbientUV+uvOffset).rgb;\n#endif\nambientOcclusionBlock(\n#ifdef AMBIENT\nambientOcclusionColorMap,\nvAmbientInfos,\n#endif\naoOut\n);\n#include<pbrBlockLightmapInit>\n#ifdef UNLIT\nvec3 diffuseBase=vec3(1.,1.,1.);\n#else\n\nvec3 baseColor=surfaceAlbedo;\nreflectivityOutParams reflectivityOut;\n#if defined(REFLECTIVITY)\nvec4 surfaceMetallicOrReflectivityColorMap=texture2D(reflectivitySampler,vReflectivityUV+uvOffset);\nvec4 baseReflectivity=surfaceMetallicOrReflectivityColorMap;\n#ifndef METALLICWORKFLOW\nsurfaceMetallicOrReflectivityColorMap=toLinearSpace(surfaceMetallicOrReflectivityColorMap);\nsurfaceMetallicOrReflectivityColorMap.rgb*=vReflectivityInfos.y;\n#endif\n#endif\n#if defined(MICROSURFACEMAP)\nvec4 microSurfaceTexel=texture2D(microSurfaceSampler,vMicroSurfaceSamplerUV+uvOffset)*vMicroSurfaceSamplerInfos.y;\n#endif\n#ifdef METALLICWORKFLOW\nvec4 metallicReflectanceFactors=vMetallicReflectanceFactors;\n#ifdef METALLIC_REFLECTANCE\nvec4 metallicReflectanceFactorsMap=texture2D(metallicReflectanceSampler,vMetallicReflectanceUV+uvOffset);\nmetallicReflectanceFactorsMap=toLinearSpace(metallicReflectanceFactorsMap);\nmetallicReflectanceFactors*=metallicReflectanceFactorsMap;\n#endif\n#endif\nreflectivityBlock(\nvReflectivityColor,\n#ifdef METALLICWORKFLOW\nsurfaceAlbedo,\nmetallicReflectanceFactors,\n#endif\n#ifdef REFLECTIVITY\nvReflectivityInfos,\nsurfaceMetallicOrReflectivityColorMap,\n#endif\n#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)\naoOut.ambientOcclusionColor,\n#endif\n#ifdef MICROSURFACEMAP\nmicroSurfaceTexel,\n#endif\n#ifdef DETAIL\ndetailColor,\nvDetailInfos,\n#endif\nreflectivityOut\n);\nfloat microSurface=reflectivityOut.microSurface;\nfloat roughness=reflectivityOut.roughness;\n#ifdef METALLICWORKFLOW\nsurfaceAlbedo=reflectivityOut.surfaceAlbedo;\n#endif\n#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)\naoOut.ambientOcclusionColor=reflectivityOut.ambientOcclusionColor;\n#endif\n\n#ifdef ALPHAFRESNEL\n#if defined(ALPHATEST) || defined(ALPHABLEND)\nalphaFresnelOutParams alphaFresnelOut;\nalphaFresnelBlock(\nnormalW,\nviewDirectionW,\nalpha,\nmicroSurface,\nalphaFresnelOut\n);\nalpha=alphaFresnelOut.alpha;\n#endif\n#endif\n\n#include<pbrBlockGeometryInfo>\n\n#ifdef ANISOTROPIC\nanisotropicOutParams anisotropicOut;\n#ifdef ANISOTROPIC_TEXTURE\nvec3 anisotropyMapData=texture2D(anisotropySampler,vAnisotropyUV+uvOffset).rgb*vAnisotropyInfos.y;\n#endif\nanisotropicBlock(\nvAnisotropy,\n#ifdef ANISOTROPIC_TEXTURE\nanisotropyMapData,\n#endif\nTBN,\nnormalW,\nviewDirectionW,\nanisotropicOut\n);\n#endif\n\n#ifdef REFLECTION\nreflectionOutParams reflectionOut;\nreflectionBlock(\nvPositionW,\nnormalW,\nalphaG,\nvReflectionMicrosurfaceInfos,\nvReflectionInfos,\nvReflectionColor,\n#ifdef ANISOTROPIC\nanisotropicOut,\n#endif\n#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)\nNdotVUnclamped,\n#endif\n#ifdef LINEARSPECULARREFLECTION\nroughness,\n#endif\nreflectionSampler,\n#if defined(NORMAL) && defined(USESPHERICALINVERTEX)\nvEnvironmentIrradiance,\n#endif\n#ifdef USESPHERICALFROMREFLECTIONMAP\n#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)\nreflectionMatrix,\n#endif\n#endif\n#ifdef USEIRRADIANCEMAP\nirradianceSampler,\n#endif\n#ifndef LODBASEDMICROSFURACE\nreflectionSamplerLow,\nreflectionSamplerHigh,\n#endif\n#ifdef REALTIME_FILTERING\nvReflectionFilteringInfo,\n#endif\nreflectionOut\n);\n#endif\n\n#include<pbrBlockReflectance0>\n\n#ifdef SHEEN\nsheenOutParams sheenOut;\n#ifdef SHEEN_TEXTURE\nvec4 sheenMapData=toLinearSpace(texture2D(sheenSampler,vSheenUV+uvOffset))*vSheenInfos.y;\n#endif\n#if defined(SHEEN_ROUGHNESS) && defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_TEXTURE_ROUGHNESS_IDENTICAL) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)\nvec4 sheenMapRoughnessData=texture2D(sheenRoughnessSampler,vSheenRoughnessUV+uvOffset)*vSheenInfos.w;\n#endif\nsheenBlock(\nvSheenColor,\n#ifdef SHEEN_ROUGHNESS\nvSheenRoughness,\n#if defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_TEXTURE_ROUGHNESS_IDENTICAL) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)\nsheenMapRoughnessData,\n#endif\n#endif\nroughness,\n#ifdef SHEEN_TEXTURE\nsheenMapData,\n#endif\nreflectance,\n#ifdef SHEEN_LINKWITHALBEDO\nbaseColor,\nsurfaceAlbedo,\n#endif\n#ifdef ENVIRONMENTBRDF\nNdotV,\nenvironmentBrdf,\n#endif\n#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)\nAARoughnessFactors,\nvReflectionMicrosurfaceInfos,\nvReflectionInfos,\nvReflectionColor,\nvLightingIntensity,\nreflectionSampler,\nreflectionOut.reflectionCoords,\nNdotVUnclamped,\n#ifndef LODBASEDMICROSFURACE\nreflectionSamplerLow,\nreflectionSamplerHigh,\n#endif\n#ifdef REALTIME_FILTERING\nvReflectionFilteringInfo,\n#endif\n#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)\nseo,\n#endif\n#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)\neho,\n#endif\n#endif\nsheenOut\n);\n#ifdef SHEEN_LINKWITHALBEDO\nsurfaceAlbedo=sheenOut.surfaceAlbedo;\n#endif\n#endif\n\nclearcoatOutParams clearcoatOut;\n#ifdef CLEARCOAT\n#ifdef CLEARCOAT_TEXTURE\nvec2 clearCoatMapData=texture2D(clearCoatSampler,vClearCoatUV+uvOffset).rg*vClearCoatInfos.y;\n#endif\n#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)\nvec4 clearCoatMapRoughnessData=texture2D(clearCoatRoughnessSampler,vClearCoatRoughnessUV+uvOffset)*vClearCoatInfos.w;\n#endif\n#if defined(CLEARCOAT_TINT) && defined(CLEARCOAT_TINT_TEXTURE)\nvec4 clearCoatTintMapData=toLinearSpace(texture2D(clearCoatTintSampler,vClearCoatTintUV+uvOffset));\n#endif\n#ifdef CLEARCOAT_BUMP\nvec4 clearCoatBumpMapData=texture2D(clearCoatBumpSampler,vClearCoatBumpUV+uvOffset);\n#endif\nclearcoatBlock(\nvPositionW,\ngeometricNormalW,\nviewDirectionW,\nvClearCoatParams,\n#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)\nclearCoatMapRoughnessData,\n#endif\nspecularEnvironmentR0,\n#ifdef CLEARCOAT_TEXTURE\nclearCoatMapData,\n#endif\n#ifdef CLEARCOAT_TINT\nvClearCoatTintParams,\nclearCoatColorAtDistance,\nvClearCoatRefractionParams,\n#ifdef CLEARCOAT_TINT_TEXTURE\nclearCoatTintMapData,\n#endif\n#endif\n#ifdef CLEARCOAT_BUMP\nvClearCoatBumpInfos,\nclearCoatBumpMapData,\nvClearCoatBumpUV,\n#if defined(TANGENT) && defined(NORMAL)\nvTBN,\n#else\nvClearCoatTangentSpaceParams,\n#endif\n#ifdef OBJECTSPACE_NORMALMAP\nnormalMatrix,\n#endif\n#endif\n#if defined(FORCENORMALFORWARD) && defined(NORMAL)\nfaceNormal,\n#endif\n#ifdef REFLECTION\nvReflectionMicrosurfaceInfos,\nvReflectionInfos,\nvReflectionColor,\nvLightingIntensity,\nreflectionSampler,\n#ifndef LODBASEDMICROSFURACE\nreflectionSamplerLow,\nreflectionSamplerHigh,\n#endif\n#ifdef REALTIME_FILTERING\nvReflectionFilteringInfo,\n#endif\n#endif\n#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)\n#ifdef RADIANCEOCCLUSION\nambientMonochrome,\n#endif\n#endif\nclearcoatOut\n);\n#else\nclearcoatOut.specularEnvironmentR0=specularEnvironmentR0;\n#endif\n\n#include<pbrBlockReflectance>\n\nsubSurfaceOutParams subSurfaceOut;\n#ifdef SUBSURFACE\n#ifdef SS_THICKNESSANDMASK_TEXTURE\nvec4 thicknessMap=texture2D(thicknessSampler,vThicknessUV+uvOffset);\n#endif\nsubSurfaceBlock(\nvSubSurfaceIntensity,\nvThicknessParam,\nvTintColor,\nnormalW,\nspecularEnvironmentReflectance,\n#ifdef SS_THICKNESSANDMASK_TEXTURE\nthicknessMap,\n#endif\n#ifdef REFLECTION\n#ifdef SS_TRANSLUCENCY\nreflectionMatrix,\n#ifdef USESPHERICALFROMREFLECTIONMAP\n#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)\nreflectionOut.irradianceVector,\n#endif\n#if defined(REALTIME_FILTERING)\nreflectionSampler,\nvReflectionFilteringInfo,\n#endif\n#endif\n#ifdef USEIRRADIANCEMAP\nirradianceSampler,\n#endif\n#endif\n#endif\n#ifdef SS_REFRACTION\nvPositionW,\nviewDirectionW,\nview,\nsurfaceAlbedo,\nvRefractionInfos,\nrefractionMatrix,\nvRefractionMicrosurfaceInfos,\nvLightingIntensity,\n#ifdef SS_LINKREFRACTIONTOTRANSPARENCY\nalpha,\n#endif\n#ifdef SS_LODINREFRACTIONALPHA\nNdotVUnclamped,\n#endif\n#ifdef SS_LINEARSPECULARREFRACTION\nroughness,\n#else\nalphaG,\n#endif\nrefractionSampler,\n#ifndef LODBASEDMICROSFURACE\nrefractionSamplerLow,\nrefractionSamplerHigh,\n#endif\n#ifdef ANISOTROPIC\nanisotropicOut,\n#endif\n#ifdef REALTIME_FILTERING\nvRefractionFilteringInfo,\n#endif\n#endif\n#ifdef SS_TRANSLUCENCY\nvDiffusionDistance,\n#endif\nsubSurfaceOut\n);\n#ifdef SS_REFRACTION\nsurfaceAlbedo=subSurfaceOut.surfaceAlbedo;\n#ifdef SS_LINKREFRACTIONTOTRANSPARENCY\nalpha=subSurfaceOut.alpha;\n#endif\n#endif\n#else\nsubSurfaceOut.specularEnvironmentReflectance=specularEnvironmentReflectance;\n#endif\n\n#include<pbrBlockDirectLighting>\n#include<lightFragment>[0..maxSimultaneousLights]\n\n#include<pbrBlockFinalLitComponents>\n#endif\n#include<pbrBlockFinalUnlitComponents>\n#include<pbrBlockFinalColorComposition>\n#include<logDepthFragment>\n#include<fogFragment>(color,finalColor)\n#include<pbrBlockImageProcessing>\n#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR\n#ifdef PREPASS\n#ifdef PREPASS_POSITION\ngl_FragData[PREPASS_POSITION_INDEX]=vec4(vPositionW,1.0);\n#endif\n#ifdef PREPASS_VELOCITY\nvec2 a=(vCurrentPosition.xy/vCurrentPosition.w)*0.5+0.5;\nvec2 b=(vPreviousPosition.xy/vPreviousPosition.w)*0.5+0.5;\nvec2 velocity=abs(a-b);\nvelocity=vec2(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;\ngl_FragData[PREPASS_VELOCITY_INDEX]=vec4(velocity,0.0,1.0);\n#endif\n#ifdef PREPASS_IRRADIANCE\nvec3 irradiance=finalDiffuse;\n#ifndef UNLIT\n#ifdef REFLECTION\nirradiance+=finalIrradiance;\n#endif\n#endif\nvec3 sqAlbedo=sqrt(surfaceAlbedo);\n#ifdef SS_SCATTERING\ngl_FragData[0]=vec4(finalColor.rgb-irradiance,finalColor.a);\nirradiance/=sqAlbedo;\n#else\ngl_FragData[0]=finalColor;\nfloat scatteringDiffusionProfile=255.;\n#endif\ngl_FragData[PREPASS_IRRADIANCE_INDEX]=vec4(irradiance,scatteringDiffusionProfile/255.);\n#else\ngl_FragData[0]=vec4(finalColor.rgb,finalColor.a);\n#endif\n#ifdef PREPASS_DEPTHNORMAL\ngl_FragData[PREPASS_DEPTHNORMAL_INDEX]=vec4(vViewPos.z,(view*vec4(normalW,0.0)).rgb);\n#endif\n#ifdef PREPASS_ALBEDO\ngl_FragData[PREPASS_ALBEDO_INDEX]=vec4(sqAlbedo,1.0);\n#endif\n#ifdef PREPASS_REFLECTIVITY\n#if defined(REFLECTIVITY)\ngl_FragData[PREPASS_REFLECTIVITY_INDEX]=vec4(baseReflectivity.rgb,1.0);\n#else\ngl_FragData[PREPASS_REFLECTIVITY_INDEX]=vec4(0.0,0.0,0.0,1.0);\n#endif\n#endif\n#endif\n#if !defined(PREPASS) || defined(WEBGL2)\ngl_FragColor=finalColor;\n#endif\n#include<pbrDebug>\n}\n";
Effect.ShadersStore[name$w] = shader$w;

var name$x = 'pbrVertexDeclaration';
var shader$x = "uniform mat4 view;\nuniform mat4 viewProjection;\n#ifdef ALBEDO\nuniform mat4 albedoMatrix;\nuniform vec2 vAlbedoInfos;\n#endif\n#ifdef AMBIENT\nuniform mat4 ambientMatrix;\nuniform vec4 vAmbientInfos;\n#endif\n#ifdef OPACITY\nuniform mat4 opacityMatrix;\nuniform vec2 vOpacityInfos;\n#endif\n#ifdef EMISSIVE\nuniform vec2 vEmissiveInfos;\nuniform mat4 emissiveMatrix;\n#endif\n#ifdef LIGHTMAP\nuniform vec2 vLightmapInfos;\nuniform mat4 lightmapMatrix;\n#endif\n#ifdef REFLECTIVITY\nuniform vec3 vReflectivityInfos;\nuniform mat4 reflectivityMatrix;\n#endif\n#ifdef METALLIC_REFLECTANCE\nuniform vec2 vMetallicReflectanceInfos;\nuniform mat4 metallicReflectanceMatrix;\n#endif\n#ifdef MICROSURFACEMAP\nuniform vec2 vMicroSurfaceSamplerInfos;\nuniform mat4 microSurfaceSamplerMatrix;\n#endif\n#ifdef BUMP\nuniform vec3 vBumpInfos;\nuniform mat4 bumpMatrix;\n#endif\n#ifdef POINTSIZE\nuniform float pointSize;\n#endif\n\n#ifdef REFLECTION\nuniform vec2 vReflectionInfos;\nuniform mat4 reflectionMatrix;\n#endif\n\n#ifdef CLEARCOAT\n#if defined(CLEARCOAT_TEXTURE) || defined(CLEARCOAT_TEXTURE_ROUGHNESS)\nuniform vec4 vClearCoatInfos;\n#endif\n#ifdef CLEARCOAT_TEXTURE\nuniform mat4 clearCoatMatrix;\n#endif\n#ifdef CLEARCOAT_TEXTURE_ROUGHNESS\nuniform mat4 clearCoatRoughnessMatrix;\n#endif\n#ifdef CLEARCOAT_BUMP\nuniform vec2 vClearCoatBumpInfos;\nuniform mat4 clearCoatBumpMatrix;\n#endif\n#ifdef CLEARCOAT_TINT_TEXTURE\nuniform vec2 vClearCoatTintInfos;\nuniform mat4 clearCoatTintMatrix;\n#endif\n#endif\n\n#ifdef ANISOTROPIC\n#ifdef ANISOTROPIC_TEXTURE\nuniform vec2 vAnisotropyInfos;\nuniform mat4 anisotropyMatrix;\n#endif\n#endif\n\n#ifdef SHEEN\n#if defined(SHEEN_TEXTURE) || defined(SHEEN_TEXTURE_ROUGHNESS)\nuniform vec4 vSheenInfos;\n#endif\n#ifdef SHEEN_TEXTURE\nuniform mat4 sheenMatrix;\n#endif\n#ifdef SHEEN_TEXTURE_ROUGHNESS\nuniform mat4 sheenRoughnessMatrix;\n#endif\n#endif\n\n#ifdef SUBSURFACE\n#ifdef SS_REFRACTION\nuniform vec4 vRefractionInfos;\nuniform mat4 refractionMatrix;\n#endif\n#ifdef SS_THICKNESSANDMASK_TEXTURE\nuniform vec2 vThicknessInfos;\nuniform mat4 thicknessMatrix;\n#endif\n#endif\n";
Effect.IncludesShadersStore[name$x] = shader$x;

var name$y = 'pbrVertexShader';
var shader$y = "precision highp float;\n#include<__decl__pbrVertex>\n#define CUSTOM_VERTEX_BEGIN\n\nattribute vec3 position;\n#ifdef NORMAL\nattribute vec3 normal;\n#endif\n#ifdef TANGENT\nattribute vec4 tangent;\n#endif\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#ifdef MAINUV1\nvarying vec2 vMainUV1;\n#endif\n#ifdef MAINUV2\nvarying vec2 vMainUV2;\n#endif\n#ifdef VERTEXCOLOR\nattribute vec4 color;\n#endif\n#include<helperFunctions>\n#include<bonesDeclaration>\n\n#include<instancesDeclaration>\n#include<prePassVertexDeclaration>\n#if defined(ALBEDO) && ALBEDODIRECTUV == 0\nvarying vec2 vAlbedoUV;\n#endif\n#if defined(DETAIL) && DETAILDIRECTUV == 0\nvarying vec2 vDetailUV;\n#endif\n#if defined(AMBIENT) && AMBIENTDIRECTUV == 0\nvarying vec2 vAmbientUV;\n#endif\n#if defined(OPACITY) && OPACITYDIRECTUV == 0\nvarying vec2 vOpacityUV;\n#endif\n#if defined(EMISSIVE) && EMISSIVEDIRECTUV == 0\nvarying vec2 vEmissiveUV;\n#endif\n#if defined(LIGHTMAP) && LIGHTMAPDIRECTUV == 0\nvarying vec2 vLightmapUV;\n#endif\n#if defined(REFLECTIVITY) && REFLECTIVITYDIRECTUV == 0\nvarying vec2 vReflectivityUV;\n#endif\n#if defined(MICROSURFACEMAP) && MICROSURFACEMAPDIRECTUV == 0\nvarying vec2 vMicroSurfaceSamplerUV;\n#endif\n#if defined(METALLIC_REFLECTANCE) && METALLIC_REFLECTANCEDIRECTUV == 0\nvarying vec2 vMetallicReflectanceUV;\n#endif\n#if defined(BUMP) && BUMPDIRECTUV == 0\nvarying vec2 vBumpUV;\n#endif\n#ifdef CLEARCOAT\n#if defined(CLEARCOAT_TEXTURE) && CLEARCOAT_TEXTUREDIRECTUV == 0\nvarying vec2 vClearCoatUV;\n#endif\n#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && CLEARCOAT_TEXTURE_ROUGHNESSDIRECTUV == 0\nvarying vec2 vClearCoatRoughnessUV;\n#endif\n#if defined(CLEARCOAT_BUMP) && CLEARCOAT_BUMPDIRECTUV == 0\nvarying vec2 vClearCoatBumpUV;\n#endif\n#if defined(CLEARCOAT_TINT_TEXTURE) && CLEARCOAT_TINT_TEXTUREDIRECTUV == 0\nvarying vec2 vClearCoatTintUV;\n#endif\n#endif\n#ifdef SHEEN\n#if defined(SHEEN_TEXTURE) && SHEEN_TEXTUREDIRECTUV == 0\nvarying vec2 vSheenUV;\n#endif\n#if defined(SHEEN_TEXTURE_ROUGHNESS) && SHEEN_TEXTURE_ROUGHNESSDIRECTUV == 0\nvarying vec2 vSheenRoughnessUV;\n#endif\n#endif\n#ifdef ANISOTROPIC\n#if defined(ANISOTROPIC_TEXTURE) && ANISOTROPIC_TEXTUREDIRECTUV == 0\nvarying vec2 vAnisotropyUV;\n#endif\n#endif\n#ifdef SUBSURFACE\n#if defined(SS_THICKNESSANDMASK_TEXTURE) && SS_THICKNESSANDMASK_TEXTUREDIRECTUV == 0\nvarying vec2 vThicknessUV;\n#endif\n#endif\n\nvarying vec3 vPositionW;\n#if DEBUGMODE>0\nvarying vec4 vClipSpacePosition;\n#endif\n#ifdef NORMAL\nvarying vec3 vNormalW;\n#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)\nvarying vec3 vEnvironmentIrradiance;\n#include<harmonicsFunctions>\n#endif\n#endif\n#ifdef VERTEXCOLOR\nvarying vec4 vColor;\n#endif\n#include<bumpVertexDeclaration>\n#include<clipPlaneVertexDeclaration>\n#include<fogVertexDeclaration>\n#include<__decl__lightFragment>[0..maxSimultaneousLights]\n#include<morphTargetsVertexGlobalDeclaration>\n#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]\n#ifdef REFLECTIONMAP_SKYBOX\nvarying vec3 vPositionUVW;\n#endif\n#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)\nvarying vec3 vDirectionW;\n#endif\n#include<logDepthDeclaration>\n#define CUSTOM_VERTEX_DEFINITIONS\nvoid main(void) {\n#define CUSTOM_VERTEX_MAIN_BEGIN\nvec3 positionUpdated=position;\n#ifdef NORMAL\nvec3 normalUpdated=normal;\n#endif\n#ifdef TANGENT\nvec4 tangentUpdated=tangent;\n#endif\n#ifdef UV1\nvec2 uvUpdated=uv;\n#endif\n#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]\n#ifdef REFLECTIONMAP_SKYBOX\nvPositionUVW=positionUpdated;\n#endif\n#define CUSTOM_VERTEX_UPDATE_POSITION\n#define CUSTOM_VERTEX_UPDATE_NORMAL\n#include<instancesVertex>\n#if defined(PREPASS) && defined(PREPASS_VELOCITY) && !defined(BONES_VELOCITY_ENABLED)\n\nvCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);\nvPreviousPosition=previousViewProjection*previousWorld*vec4(positionUpdated,1.0);\n#endif\n#include<bonesVertex>\nvec4 worldPos=finalWorld*vec4(positionUpdated,1.0);\nvPositionW=vec3(worldPos);\n#include<prePassVertex>\n#ifdef NORMAL\nmat3 normalWorld=mat3(finalWorld);\n#if defined(INSTANCES) && defined(THIN_INSTANCES)\nvNormalW=normalUpdated/vec3(dot(normalWorld[0],normalWorld[0]),dot(normalWorld[1],normalWorld[1]),dot(normalWorld[2],normalWorld[2]));\nvNormalW=normalize(normalWorld*vNormalW);\n#else\n#ifdef NONUNIFORMSCALING\nnormalWorld=transposeMat3(inverseMat3(normalWorld));\n#endif\nvNormalW=normalize(normalWorld*normalUpdated);\n#endif\n#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)\nvec3 reflectionVector=vec3(reflectionMatrix*vec4(vNormalW,0)).xyz;\n#ifdef REFLECTIONMAP_OPPOSITEZ\nreflectionVector.z*=-1.0;\n#endif\nvEnvironmentIrradiance=computeEnvironmentIrradiance(reflectionVector);\n#endif\n#endif\n#define CUSTOM_VERTEX_UPDATE_WORLDPOS\n#ifdef MULTIVIEW\nif (gl_ViewID_OVR == 0u) {\ngl_Position=viewProjection*worldPos;\n} else {\ngl_Position=viewProjectionR*worldPos;\n}\n#else\ngl_Position=viewProjection*worldPos;\n#endif\n#if DEBUGMODE>0\nvClipSpacePosition=gl_Position;\n#endif\n#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)\nvDirectionW=normalize(vec3(finalWorld*vec4(positionUpdated,0.0)));\n#endif\n\n#ifndef UV1\nvec2 uvUpdated=vec2(0.,0.);\n#endif\n#ifndef UV2\nvec2 uv2=vec2(0.,0.);\n#endif\n#ifdef MAINUV1\nvMainUV1=uvUpdated;\n#endif\n#ifdef MAINUV2\nvMainUV2=uv2;\n#endif\n#if defined(ALBEDO) && ALBEDODIRECTUV == 0\nif (vAlbedoInfos.x == 0.)\n{\nvAlbedoUV=vec2(albedoMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvAlbedoUV=vec2(albedoMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(DETAIL) && DETAILDIRECTUV == 0\nif (vDetailInfos.x == 0.)\n{\nvDetailUV=vec2(detailMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvDetailUV=vec2(detailMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(AMBIENT) && AMBIENTDIRECTUV == 0\nif (vAmbientInfos.x == 0.)\n{\nvAmbientUV=vec2(ambientMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvAmbientUV=vec2(ambientMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(OPACITY) && OPACITYDIRECTUV == 0\nif (vOpacityInfos.x == 0.)\n{\nvOpacityUV=vec2(opacityMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvOpacityUV=vec2(opacityMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(EMISSIVE) && EMISSIVEDIRECTUV == 0\nif (vEmissiveInfos.x == 0.)\n{\nvEmissiveUV=vec2(emissiveMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvEmissiveUV=vec2(emissiveMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(LIGHTMAP) && LIGHTMAPDIRECTUV == 0\nif (vLightmapInfos.x == 0.)\n{\nvLightmapUV=vec2(lightmapMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvLightmapUV=vec2(lightmapMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(REFLECTIVITY) && REFLECTIVITYDIRECTUV == 0\nif (vReflectivityInfos.x == 0.)\n{\nvReflectivityUV=vec2(reflectivityMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvReflectivityUV=vec2(reflectivityMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(MICROSURFACEMAP) && MICROSURFACEMAPDIRECTUV == 0\nif (vMicroSurfaceSamplerInfos.x == 0.)\n{\nvMicroSurfaceSamplerUV=vec2(microSurfaceSamplerMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvMicroSurfaceSamplerUV=vec2(microSurfaceSamplerMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(METALLIC_REFLECTANCE) && METALLIC_REFLECTANCEDIRECTUV == 0\nif (vMetallicReflectanceInfos.x == 0.)\n{\nvMetallicReflectanceUV=vec2(metallicReflectanceMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvMetallicReflectanceUV=vec2(metallicReflectanceMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(BUMP) && BUMPDIRECTUV == 0\nif (vBumpInfos.x == 0.)\n{\nvBumpUV=vec2(bumpMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvBumpUV=vec2(bumpMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#ifdef CLEARCOAT\n#if defined(CLEARCOAT_TEXTURE) && CLEARCOAT_TEXTUREDIRECTUV == 0\nif (vClearCoatInfos.x == 0.)\n{\nvClearCoatUV=vec2(clearCoatMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvClearCoatUV=vec2(clearCoatMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && CLEARCOAT_TEXTURE_ROUGHNESSDIRECTUV == 0\nif (vClearCoatInfos.z == 0.)\n{\nvClearCoatRoughnessUV=vec2(clearCoatRoughnessMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvClearCoatRoughnessUV=vec2(clearCoatRoughnessMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(CLEARCOAT_BUMP) && CLEARCOAT_BUMPDIRECTUV == 0\nif (vClearCoatBumpInfos.x == 0.)\n{\nvClearCoatBumpUV=vec2(clearCoatBumpMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvClearCoatBumpUV=vec2(clearCoatBumpMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(CLEARCOAT_TINT_TEXTURE) && CLEARCOAT_TINT_TEXTUREDIRECTUV == 0\nif (vClearCoatTintInfos.x == 0.)\n{\nvClearCoatTintUV=vec2(clearCoatTintMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvClearCoatTintUV=vec2(clearCoatTintMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#endif\n#ifdef SHEEN\n#if defined(SHEEN_TEXTURE) && SHEEN_TEXTUREDIRECTUV == 0\nif (vSheenInfos.x == 0.)\n{\nvSheenUV=vec2(sheenMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvSheenUV=vec2(sheenMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#if defined(SHEEN_TEXTURE_ROUGHNESS) && SHEEN_TEXTURE_ROUGHNESSDIRECTUV == 0\nif (vSheenInfos.z == 0.)\n{\nvSheenRoughnessUV=vec2(sheenRoughnessMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvSheenRoughnessUV=vec2(sheenRoughnessMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#endif\n#ifdef ANISOTROPIC\n#if defined(ANISOTROPIC_TEXTURE) && ANISOTROPIC_TEXTUREDIRECTUV == 0\nif (vAnisotropyInfos.x == 0.)\n{\nvAnisotropyUV=vec2(anisotropyMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvAnisotropyUV=vec2(anisotropyMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#endif\n#ifdef SUBSURFACE\n#if defined(SS_THICKNESSANDMASK_TEXTURE) && SS_THICKNESSANDMASK_TEXTUREDIRECTUV == 0\nif (vThicknessInfos.x == 0.)\n{\nvThicknessUV=vec2(thicknessMatrix*vec4(uvUpdated,1.0,0.0));\n}\nelse\n{\nvThicknessUV=vec2(thicknessMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n#endif\n\n#include<bumpVertex>\n\n#include<clipPlaneVertex>\n\n#include<fogVertex>\n\n#include<shadowsVertex>[0..maxSimultaneousLights]\n\n#ifdef VERTEXCOLOR\nvColor=color;\n#endif\n\n#ifdef POINTSIZE\ngl_PointSize=pointSize;\n#endif\n\n#include<logDepthVertex>\n#define CUSTOM_VERTEX_MAIN_END\n}";
Effect.ShadersStore[name$y] = shader$y;

var onCreatedEffectParameters = { effect: null, subMesh: null };
/**
 * Manages the defines for the PBR Material.
 * @hidden
 */
var PBRMaterialDefines = /** @class */ (function (_super) {
    __extends(PBRMaterialDefines, _super);
    /**
     * Initializes the PBR Material defines.
     */
    function PBRMaterialDefines() {
        var _this = _super.call(this) || this;
        _this.PBR = true;
        _this.NUM_SAMPLES = "0";
        _this.REALTIME_FILTERING = false;
        _this.MAINUV1 = false;
        _this.MAINUV2 = false;
        _this.UV1 = false;
        _this.UV2 = false;
        _this.ALBEDO = false;
        _this.GAMMAALBEDO = false;
        _this.ALBEDODIRECTUV = 0;
        _this.VERTEXCOLOR = false;
        _this.DETAIL = false;
        _this.DETAILDIRECTUV = 0;
        _this.DETAIL_NORMALBLENDMETHOD = 0;
        _this.AMBIENT = false;
        _this.AMBIENTDIRECTUV = 0;
        _this.AMBIENTINGRAYSCALE = false;
        _this.OPACITY = false;
        _this.VERTEXALPHA = false;
        _this.OPACITYDIRECTUV = 0;
        _this.OPACITYRGB = false;
        _this.ALPHATEST = false;
        _this.DEPTHPREPASS = false;
        _this.ALPHABLEND = false;
        _this.ALPHAFROMALBEDO = false;
        _this.ALPHATESTVALUE = "0.5";
        _this.SPECULAROVERALPHA = false;
        _this.RADIANCEOVERALPHA = false;
        _this.ALPHAFRESNEL = false;
        _this.LINEARALPHAFRESNEL = false;
        _this.PREMULTIPLYALPHA = false;
        _this.EMISSIVE = false;
        _this.EMISSIVEDIRECTUV = 0;
        _this.REFLECTIVITY = false;
        _this.REFLECTIVITYDIRECTUV = 0;
        _this.SPECULARTERM = false;
        _this.MICROSURFACEFROMREFLECTIVITYMAP = false;
        _this.MICROSURFACEAUTOMATIC = false;
        _this.LODBASEDMICROSFURACE = false;
        _this.MICROSURFACEMAP = false;
        _this.MICROSURFACEMAPDIRECTUV = 0;
        _this.METALLICWORKFLOW = false;
        _this.ROUGHNESSSTOREINMETALMAPALPHA = false;
        _this.ROUGHNESSSTOREINMETALMAPGREEN = false;
        _this.METALLNESSSTOREINMETALMAPBLUE = false;
        _this.AOSTOREINMETALMAPRED = false;
        _this.METALLIC_REFLECTANCE = false;
        _this.METALLIC_REFLECTANCEDIRECTUV = 0;
        _this.ENVIRONMENTBRDF = false;
        _this.ENVIRONMENTBRDF_RGBD = false;
        _this.NORMAL = false;
        _this.TANGENT = false;
        _this.BUMP = false;
        _this.BUMPDIRECTUV = 0;
        _this.OBJECTSPACE_NORMALMAP = false;
        _this.PARALLAX = false;
        _this.PARALLAXOCCLUSION = false;
        _this.NORMALXYSCALE = true;
        _this.LIGHTMAP = false;
        _this.LIGHTMAPDIRECTUV = 0;
        _this.USELIGHTMAPASSHADOWMAP = false;
        _this.GAMMALIGHTMAP = false;
        _this.RGBDLIGHTMAP = false;
        _this.REFLECTION = false;
        _this.REFLECTIONMAP_3D = false;
        _this.REFLECTIONMAP_SPHERICAL = false;
        _this.REFLECTIONMAP_PLANAR = false;
        _this.REFLECTIONMAP_CUBIC = false;
        _this.USE_LOCAL_REFLECTIONMAP_CUBIC = false;
        _this.REFLECTIONMAP_PROJECTION = false;
        _this.REFLECTIONMAP_SKYBOX = false;
        _this.REFLECTIONMAP_EXPLICIT = false;
        _this.REFLECTIONMAP_EQUIRECTANGULAR = false;
        _this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
        _this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
        _this.INVERTCUBICMAP = false;
        _this.USESPHERICALFROMREFLECTIONMAP = false;
        _this.USEIRRADIANCEMAP = false;
        _this.SPHERICAL_HARMONICS = false;
        _this.USESPHERICALINVERTEX = false;
        _this.REFLECTIONMAP_OPPOSITEZ = false;
        _this.LODINREFLECTIONALPHA = false;
        _this.GAMMAREFLECTION = false;
        _this.RGBDREFLECTION = false;
        _this.LINEARSPECULARREFLECTION = false;
        _this.RADIANCEOCCLUSION = false;
        _this.HORIZONOCCLUSION = false;
        _this.INSTANCES = false;
        _this.THIN_INSTANCES = false;
        _this.PREPASS = false;
        _this.PREPASS_IRRADIANCE = false;
        _this.PREPASS_IRRADIANCE_INDEX = -1;
        _this.PREPASS_ALBEDO = false;
        _this.PREPASS_ALBEDO_INDEX = -1;
        _this.PREPASS_DEPTHNORMAL = false;
        _this.PREPASS_DEPTHNORMAL_INDEX = -1;
        _this.PREPASS_POSITION = false;
        _this.PREPASS_POSITION_INDEX = -1;
        _this.PREPASS_VELOCITY = false;
        _this.PREPASS_VELOCITY_INDEX = -1;
        _this.PREPASS_REFLECTIVITY = false;
        _this.PREPASS_REFLECTIVITY_INDEX = -1;
        _this.SCENE_MRT_COUNT = 0;
        _this.NUM_BONE_INFLUENCERS = 0;
        _this.BonesPerMesh = 0;
        _this.BONETEXTURE = false;
        _this.BONES_VELOCITY_ENABLED = false;
        _this.NONUNIFORMSCALING = false;
        _this.MORPHTARGETS = false;
        _this.MORPHTARGETS_NORMAL = false;
        _this.MORPHTARGETS_TANGENT = false;
        _this.MORPHTARGETS_UV = false;
        _this.NUM_MORPH_INFLUENCERS = 0;
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
        _this.MULTIVIEW = false;
        _this.USEPHYSICALLIGHTFALLOFF = false;
        _this.USEGLTFLIGHTFALLOFF = false;
        _this.TWOSIDEDLIGHTING = false;
        _this.SHADOWFLOAT = false;
        _this.CLIPPLANE = false;
        _this.CLIPPLANE2 = false;
        _this.CLIPPLANE3 = false;
        _this.CLIPPLANE4 = false;
        _this.CLIPPLANE5 = false;
        _this.CLIPPLANE6 = false;
        _this.POINTSIZE = false;
        _this.FOG = false;
        _this.LOGARITHMICDEPTH = false;
        _this.FORCENORMALFORWARD = false;
        _this.SPECULARAA = false;
        _this.CLEARCOAT = false;
        _this.CLEARCOAT_DEFAULTIOR = false;
        _this.CLEARCOAT_TEXTURE = false;
        _this.CLEARCOAT_TEXTURE_ROUGHNESS = false;
        _this.CLEARCOAT_TEXTUREDIRECTUV = 0;
        _this.CLEARCOAT_TEXTURE_ROUGHNESSDIRECTUV = 0;
        _this.CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE = false;
        _this.CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL = false;
        _this.CLEARCOAT_BUMP = false;
        _this.CLEARCOAT_BUMPDIRECTUV = 0;
        _this.CLEARCOAT_REMAP_F0 = true;
        _this.CLEARCOAT_TINT = false;
        _this.CLEARCOAT_TINT_TEXTURE = false;
        _this.CLEARCOAT_TINT_TEXTUREDIRECTUV = 0;
        _this.ANISOTROPIC = false;
        _this.ANISOTROPIC_TEXTURE = false;
        _this.ANISOTROPIC_TEXTUREDIRECTUV = 0;
        _this.BRDF_V_HEIGHT_CORRELATED = false;
        _this.MS_BRDF_ENERGY_CONSERVATION = false;
        _this.SPECULAR_GLOSSINESS_ENERGY_CONSERVATION = false;
        _this.SHEEN = false;
        _this.SHEEN_TEXTURE = false;
        _this.SHEEN_TEXTURE_ROUGHNESS = false;
        _this.SHEEN_TEXTUREDIRECTUV = 0;
        _this.SHEEN_TEXTURE_ROUGHNESSDIRECTUV = 0;
        _this.SHEEN_LINKWITHALBEDO = false;
        _this.SHEEN_ROUGHNESS = false;
        _this.SHEEN_ALBEDOSCALING = false;
        _this.SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE = false;
        _this.SHEEN_TEXTURE_ROUGHNESS_IDENTICAL = false;
        _this.SUBSURFACE = false;
        _this.SS_REFRACTION = false;
        _this.SS_TRANSLUCENCY = false;
        _this.SS_SCATTERING = false;
        _this.SS_THICKNESSANDMASK_TEXTURE = false;
        _this.SS_THICKNESSANDMASK_TEXTUREDIRECTUV = 0;
        _this.SS_REFRACTIONMAP_3D = false;
        _this.SS_REFRACTIONMAP_OPPOSITEZ = false;
        _this.SS_LODINREFRACTIONALPHA = false;
        _this.SS_GAMMAREFRACTION = false;
        _this.SS_RGBDREFRACTION = false;
        _this.SS_LINEARSPECULARREFRACTION = false;
        _this.SS_LINKREFRACTIONTOTRANSPARENCY = false;
        _this.SS_ALBEDOFORREFRACTIONTINT = false;
        _this.SS_MASK_FROM_THICKNESS_TEXTURE = false;
        _this.SS_MASK_FROM_THICKNESS_TEXTURE_GLTF = false;
        _this.UNLIT = false;
        _this.DEBUGMODE = 0;
        _this.rebuild();
        return _this;
    }
    /**
     * Resets the PBR Material defines.
     */
    PBRMaterialDefines.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.ALPHATESTVALUE = "0.5";
        this.PBR = true;
    };
    return PBRMaterialDefines;
}(MaterialDefines));
/**
 * The Physically based material base class of BJS.
 *
 * This offers the main features of a standard PBR material.
 * For more information, please refer to the documentation :
 * https://doc.babylonjs.com/how_to/physically_based_rendering
 */
var PBRBaseMaterial = /** @class */ (function (_super) {
    __extends(PBRBaseMaterial, _super);
    /**
     * Instantiates a new PBRMaterial instance.
     *
     * @param name The material name
     * @param scene The scene the material will be use in.
     */
    function PBRBaseMaterial(name, scene) {
        var _this = _super.call(this, name, scene) || this;
        /**
         * Intensity of the direct lights e.g. the four lights available in your scene.
         * This impacts both the direct diffuse and specular highlights.
         */
        _this._directIntensity = 1.0;
        /**
         * Intensity of the emissive part of the material.
         * This helps controlling the emissive effect without modifying the emissive color.
         */
        _this._emissiveIntensity = 1.0;
        /**
         * Intensity of the environment e.g. how much the environment will light the object
         * either through harmonics for rough material or through the refelction for shiny ones.
         */
        _this._environmentIntensity = 1.0;
        /**
         * This is a special control allowing the reduction of the specular highlights coming from the
         * four lights of the scene. Those highlights may not be needed in full environment lighting.
         */
        _this._specularIntensity = 1.0;
        /**
         * This stores the direct, emissive, environment, and specular light intensities into a Vector4.
         */
        _this._lightingInfos = new Vector4(_this._directIntensity, _this._emissiveIntensity, _this._environmentIntensity, _this._specularIntensity);
        /**
         * Debug Control allowing disabling the bump map on this material.
         */
        _this._disableBumpMap = false;
        /**
         * AKA Diffuse Texture in standard nomenclature.
         */
        _this._albedoTexture = null;
        /**
         * AKA Occlusion Texture in other nomenclature.
         */
        _this._ambientTexture = null;
        /**
         * AKA Occlusion Texture Intensity in other nomenclature.
         */
        _this._ambientTextureStrength = 1.0;
        /**
         * Defines how much the AO map is occluding the analytical lights (point spot...).
         * 1 means it completely occludes it
         * 0 mean it has no impact
         */
        _this._ambientTextureImpactOnAnalyticalLights = PBRBaseMaterial.DEFAULT_AO_ON_ANALYTICAL_LIGHTS;
        /**
         * Stores the alpha values in a texture.
         */
        _this._opacityTexture = null;
        /**
         * Stores the reflection values in a texture.
         */
        _this._reflectionTexture = null;
        /**
         * Stores the emissive values in a texture.
         */
        _this._emissiveTexture = null;
        /**
         * AKA Specular texture in other nomenclature.
         */
        _this._reflectivityTexture = null;
        /**
         * Used to switch from specular/glossiness to metallic/roughness workflow.
         */
        _this._metallicTexture = null;
        /**
         * Specifies the metallic scalar of the metallic/roughness workflow.
         * Can also be used to scale the metalness values of the metallic texture.
         */
        _this._metallic = null;
        /**
         * Specifies the roughness scalar of the metallic/roughness workflow.
         * Can also be used to scale the roughness values of the metallic texture.
         */
        _this._roughness = null;
        /**
         * In metallic workflow, specifies an F0 factor to help configuring the material F0.
         * By default the indexOfrefraction is used to compute F0;
         *
         * This is used as a factor against the default reflectance at normal incidence to tweak it.
         *
         * F0 = defaultF0 * metallicF0Factor * metallicReflectanceColor;
         * F90 = metallicReflectanceColor;
         */
        _this._metallicF0Factor = 1;
        /**
         * In metallic workflow, specifies an F90 color to help configuring the material F90.
         * By default the F90 is always 1;
         *
         * Please note that this factor is also used as a factor against the default reflectance at normal incidence.
         *
         * F0 = defaultF0 * metallicF0Factor * metallicReflectanceColor
         * F90 = metallicReflectanceColor;
         */
        _this._metallicReflectanceColor = Color3.White();
        /**
         * Defines to store metallicReflectanceColor in RGB and metallicF0Factor in A
         * This is multiply against the scalar values defined in the material.
         */
        _this._metallicReflectanceTexture = null;
        /**
         * Used to enable roughness/glossiness fetch from a separate channel depending on the current mode.
         * Gray Scale represents roughness in metallic mode and glossiness in specular mode.
         */
        _this._microSurfaceTexture = null;
        /**
         * Stores surface normal data used to displace a mesh in a texture.
         */
        _this._bumpTexture = null;
        /**
         * Stores the pre-calculated light information of a mesh in a texture.
         */
        _this._lightmapTexture = null;
        /**
         * The color of a material in ambient lighting.
         */
        _this._ambientColor = new Color3(0, 0, 0);
        /**
         * AKA Diffuse Color in other nomenclature.
         */
        _this._albedoColor = new Color3(1, 1, 1);
        /**
         * AKA Specular Color in other nomenclature.
         */
        _this._reflectivityColor = new Color3(1, 1, 1);
        /**
         * The color applied when light is reflected from a material.
         */
        _this._reflectionColor = new Color3(1, 1, 1);
        /**
         * The color applied when light is emitted from a material.
         */
        _this._emissiveColor = new Color3(0, 0, 0);
        /**
         * AKA Glossiness in other nomenclature.
         */
        _this._microSurface = 0.9;
        /**
         * Specifies that the material will use the light map as a show map.
         */
        _this._useLightmapAsShadowmap = false;
        /**
         * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
         * makes the reflect vector face the model (under horizon).
         */
        _this._useHorizonOcclusion = true;
        /**
         * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
         * too much the area relying on ambient texture to define their ambient occlusion.
         */
        _this._useRadianceOcclusion = true;
        /**
         * Specifies that the alpha is coming form the albedo channel alpha channel for alpha blending.
         */
        _this._useAlphaFromAlbedoTexture = false;
        /**
         * Specifies that the material will keeps the specular highlights over a transparent surface (only the most limunous ones).
         * A car glass is a good exemple of that. When sun reflects on it you can not see what is behind.
         */
        _this._useSpecularOverAlpha = true;
        /**
         * Specifies if the reflectivity texture contains the glossiness information in its alpha channel.
         */
        _this._useMicroSurfaceFromReflectivityMapAlpha = false;
        /**
         * Specifies if the metallic texture contains the roughness information in its alpha channel.
         */
        _this._useRoughnessFromMetallicTextureAlpha = true;
        /**
         * Specifies if the metallic texture contains the roughness information in its green channel.
         */
        _this._useRoughnessFromMetallicTextureGreen = false;
        /**
         * Specifies if the metallic texture contains the metallness information in its blue channel.
         */
        _this._useMetallnessFromMetallicTextureBlue = false;
        /**
         * Specifies if the metallic texture contains the ambient occlusion information in its red channel.
         */
        _this._useAmbientOcclusionFromMetallicTextureRed = false;
        /**
         * Specifies if the ambient texture contains the ambient occlusion information in its red channel only.
         */
        _this._useAmbientInGrayScale = false;
        /**
         * In case the reflectivity map does not contain the microsurface information in its alpha channel,
         * The material will try to infer what glossiness each pixel should be.
         */
        _this._useAutoMicroSurfaceFromReflectivityMap = false;
        /**
         * Defines the  falloff type used in this material.
         * It by default is Physical.
         */
        _this._lightFalloff = PBRBaseMaterial.LIGHTFALLOFF_PHYSICAL;
        /**
         * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most limunous ones).
         * A car glass is a good exemple of that. When the street lights reflects on it you can not see what is behind.
         */
        _this._useRadianceOverAlpha = true;
        /**
         * Allows using an object space normal map (instead of tangent space).
         */
        _this._useObjectSpaceNormalMap = false;
        /**
         * Allows using the bump map in parallax mode.
         */
        _this._useParallax = false;
        /**
         * Allows using the bump map in parallax occlusion mode.
         */
        _this._useParallaxOcclusion = false;
        /**
         * Controls the scale bias of the parallax mode.
         */
        _this._parallaxScaleBias = 0.05;
        /**
         * If sets to true, disables all the lights affecting the material.
         */
        _this._disableLighting = false;
        /**
         * Number of Simultaneous lights allowed on the material.
         */
        _this._maxSimultaneousLights = 4;
        /**
         * If sets to true, x component of normal map value will be inverted (x = 1.0 - x).
         */
        _this._invertNormalMapX = false;
        /**
         * If sets to true, y component of normal map value will be inverted (y = 1.0 - y).
         */
        _this._invertNormalMapY = false;
        /**
         * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
         */
        _this._twoSidedLighting = false;
        /**
         * Defines the alpha limits in alpha test mode.
         */
        _this._alphaCutOff = 0.4;
        /**
         * Enforces alpha test in opaque or blend mode in order to improve the performances of some situations.
         */
        _this._forceAlphaTest = false;
        /**
         * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
         * And/Or occlude the blended part. (alpha is converted to gamma to compute the fresnel)
         */
        _this._useAlphaFresnel = false;
        /**
         * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
         * And/Or occlude the blended part. (alpha stays linear to compute the fresnel)
         */
        _this._useLinearAlphaFresnel = false;
        /**
         * Specifies the environment BRDF texture used to comput the scale and offset roughness values
         * from cos thetav and roughness:
         * http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
         */
        _this._environmentBRDFTexture = null;
        /**
         * Force the shader to compute irradiance in the fragment shader in order to take bump in account.
         */
        _this._forceIrradianceInFragment = false;
        _this._realTimeFiltering = false;
        _this._realTimeFilteringQuality = 8;
        /**
         * Force normal to face away from face.
         */
        _this._forceNormalForward = false;
        /**
         * Enables specular anti aliasing in the PBR shader.
         * It will both interacts on the Geometry for analytical and IBL lighting.
         * It also prefilter the roughness map based on the bump values.
         */
        _this._enableSpecularAntiAliasing = false;
        /**
         * Keep track of the image processing observer to allow dispose and replace.
         */
        _this._imageProcessingObserver = null;
        /**
         * Stores the available render targets.
         */
        _this._renderTargets = new SmartArray(16);
        /**
         * Sets the global ambient color for the material used in lighting calculations.
         */
        _this._globalAmbientColor = new Color3(0, 0, 0);
        /**
         * Enables the use of logarithmic depth buffers, which is good for wide depth buffers.
         */
        _this._useLogarithmicDepth = false;
        /**
         * If set to true, no lighting calculations will be applied.
         */
        _this._unlit = false;
        _this._debugMode = 0;
        /**
         * @hidden
         * This is reserved for the inspector.
         * Defines the material debug mode.
         * It helps seeing only some components of the material while troubleshooting.
         */
        _this.debugMode = 0;
        /**
         * @hidden
         * This is reserved for the inspector.
         * Specify from where on screen the debug mode should start.
         * The value goes from -1 (full screen) to 1 (not visible)
         * It helps with side by side comparison against the final render
         * This defaults to -1
         */
        _this.debugLimit = -1;
        /**
         * @hidden
         * This is reserved for the inspector.
         * As the default viewing range might not be enough (if the ambient is really small for instance)
         * You can use the factor to better multiply the final value.
         */
        _this.debugFactor = 1;
        /**
         * Defines the clear coat layer parameters for the material.
         */
        _this.clearCoat = new PBRClearCoatConfiguration(_this._markAllSubMeshesAsTexturesDirty.bind(_this));
        /**
         * Defines the anisotropic parameters for the material.
         */
        _this.anisotropy = new PBRAnisotropicConfiguration(_this._markAllSubMeshesAsTexturesDirty.bind(_this));
        /**
         * Defines the BRDF parameters for the material.
         */
        _this.brdf = new PBRBRDFConfiguration(_this._markAllSubMeshesAsMiscDirty.bind(_this));
        /**
         * Defines the Sheen parameters for the material.
         */
        _this.sheen = new PBRSheenConfiguration(_this._markAllSubMeshesAsTexturesDirty.bind(_this));
        /**
         * Defines the detail map parameters for the material.
         */
        _this.detailMap = new DetailMapConfiguration(_this._markAllSubMeshesAsTexturesDirty.bind(_this));
        _this._rebuildInParallel = false;
        // Setup the default processing configuration to the scene.
        _this._attachImageProcessingConfiguration(null);
        _this.getRenderTargetTextures = function () {
            _this._renderTargets.reset();
            if (MaterialFlags.ReflectionTextureEnabled && _this._reflectionTexture && _this._reflectionTexture.isRenderTarget) {
                _this._renderTargets.push(_this._reflectionTexture);
            }
            _this.subSurface.fillRenderTargetTextures(_this._renderTargets);
            return _this._renderTargets;
        };
        _this._environmentBRDFTexture = BRDFTextureTools.GetEnvironmentBRDFTexture(scene);
        _this.subSurface = new PBRSubSurfaceConfiguration(_this._markAllSubMeshesAsTexturesDirty.bind(_this), _this._markScenePrePassDirty.bind(_this), scene);
        _this.prePassConfiguration = new PrePassConfiguration();
        return _this;
    }
    Object.defineProperty(PBRBaseMaterial.prototype, "realTimeFiltering", {
        /**
         * Enables realtime filtering on the texture.
         */
        get: function () {
            return this._realTimeFiltering;
        },
        set: function (b) {
            this._realTimeFiltering = b;
            this.markAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRBaseMaterial.prototype, "realTimeFilteringQuality", {
        /**
         * Quality switch for realtime filtering
         */
        get: function () {
            return this._realTimeFilteringQuality;
        },
        set: function (n) {
            this._realTimeFilteringQuality = n;
            this.markAsDirty(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRBaseMaterial.prototype, "canRenderToMRT", {
        /**
         * Can this material render to several textures at once
         */
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Attaches a new image processing configuration to the PBR Material.
     * @param configuration
     */
    PBRBaseMaterial.prototype._attachImageProcessingConfiguration = function (configuration) {
        var _this = this;
        if (configuration === this._imageProcessingConfiguration) {
            return;
        }
        // Detaches observer.
        if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
            this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
        }
        // Pick the scene configuration if needed.
        if (!configuration) {
            this._imageProcessingConfiguration = this.getScene().imageProcessingConfiguration;
        }
        else {
            this._imageProcessingConfiguration = configuration;
        }
        // Attaches observer.
        if (this._imageProcessingConfiguration) {
            this._imageProcessingObserver = this._imageProcessingConfiguration.onUpdateParameters.add(function () {
                _this._markAllSubMeshesAsImageProcessingDirty();
            });
        }
    };
    Object.defineProperty(PBRBaseMaterial.prototype, "hasRenderTargetTextures", {
        /**
         * Gets a boolean indicating that current material needs to register RTT
         */
        get: function () {
            if (MaterialFlags.ReflectionTextureEnabled && this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                return true;
            }
            return this.subSurface.hasRenderTargetTextures();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the name of the material class.
     */
    PBRBaseMaterial.prototype.getClassName = function () {
        return "PBRBaseMaterial";
    };
    Object.defineProperty(PBRBaseMaterial.prototype, "useLogarithmicDepth", {
        /**
         * Enabled the use of logarithmic depth buffers, which is good for wide depth buffers.
         */
        get: function () {
            return this._useLogarithmicDepth;
        },
        /**
         * Enabled the use of logarithmic depth buffers, which is good for wide depth buffers.
         */
        set: function (value) {
            this._useLogarithmicDepth = value && this.getScene().getEngine().getCaps().fragmentDepthSupported;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRBaseMaterial.prototype, "_disableAlphaBlending", {
        /**
         * Returns true if alpha blending should be disabled.
         */
        get: function () {
            return (this.subSurface.disableAlphaBlending ||
                this._transparencyMode === PBRBaseMaterial.PBRMATERIAL_OPAQUE ||
                this._transparencyMode === PBRBaseMaterial.PBRMATERIAL_ALPHATEST);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Specifies whether or not this material should be rendered in alpha blend mode.
     */
    PBRBaseMaterial.prototype.needAlphaBlending = function () {
        if (this._disableAlphaBlending) {
            return false;
        }
        return (this.alpha < 1.0) || (this._opacityTexture != null) || this._shouldUseAlphaFromAlbedoTexture();
    };
    /**
     * Specifies whether or not this material should be rendered in alpha test mode.
     */
    PBRBaseMaterial.prototype.needAlphaTesting = function () {
        if (this._forceAlphaTest) {
            return true;
        }
        if (this.subSurface.disableAlphaBlending) {
            return false;
        }
        return this._hasAlphaChannel() && (this._transparencyMode == null || this._transparencyMode === PBRBaseMaterial.PBRMATERIAL_ALPHATEST);
    };
    /**
     * Specifies whether or not the alpha value of the albedo texture should be used for alpha blending.
     */
    PBRBaseMaterial.prototype._shouldUseAlphaFromAlbedoTexture = function () {
        return this._albedoTexture != null && this._albedoTexture.hasAlpha && this._useAlphaFromAlbedoTexture && this._transparencyMode !== PBRBaseMaterial.PBRMATERIAL_OPAQUE;
    };
    /**
     * Specifies whether or not there is a usable alpha channel for transparency.
     */
    PBRBaseMaterial.prototype._hasAlphaChannel = function () {
        return (this._albedoTexture != null && this._albedoTexture.hasAlpha) || this._opacityTexture != null;
    };
    /**
     * Gets the texture used for the alpha test.
     */
    PBRBaseMaterial.prototype.getAlphaTestTexture = function () {
        return this._albedoTexture;
    };
    /**
     * Specifies that the submesh is ready to be used.
     * @param mesh - BJS mesh.
     * @param subMesh - A submesh of the BJS mesh.  Used to check if it is ready.
     * @param useInstances - Specifies that instances should be used.
     * @returns - boolean indicating that the submesh is ready or not.
     */
    PBRBaseMaterial.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
        if (subMesh.effect && this.isFrozen) {
            if (subMesh.effect._wasPreviouslyReady) {
                return true;
            }
        }
        if (!subMesh._materialDefines) {
            subMesh._materialDefines = new PBRMaterialDefines();
        }
        var defines = subMesh._materialDefines;
        if (this._isReadyForSubMesh(subMesh)) {
            return true;
        }
        var scene = this.getScene();
        var engine = scene.getEngine();
        if (defines._areTexturesDirty) {
            if (scene.texturesEnabled) {
                if (this._albedoTexture && MaterialFlags.DiffuseTextureEnabled) {
                    if (!this._albedoTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
                if (this._ambientTexture && MaterialFlags.AmbientTextureEnabled) {
                    if (!this._ambientTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
                if (this._opacityTexture && MaterialFlags.OpacityTextureEnabled) {
                    if (!this._opacityTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
                var reflectionTexture = this._getReflectionTexture();
                if (reflectionTexture && MaterialFlags.ReflectionTextureEnabled) {
                    if (!reflectionTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                    if (reflectionTexture.irradianceTexture && !reflectionTexture.irradianceTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
                if (this._lightmapTexture && MaterialFlags.LightmapTextureEnabled) {
                    if (!this._lightmapTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
                if (this._emissiveTexture && MaterialFlags.EmissiveTextureEnabled) {
                    if (!this._emissiveTexture.isReadyOrNotBlocking()) {
                        return false;
                    }
                }
                if (MaterialFlags.SpecularTextureEnabled) {
                    if (this._metallicTexture) {
                        if (!this._metallicTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                    }
                    else if (this._reflectivityTexture) {
                        if (!this._reflectivityTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                    }
                    if (this._metallicReflectanceTexture) {
                        if (!this._metallicReflectanceTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                    }
                    if (this._microSurfaceTexture) {
                        if (!this._microSurfaceTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                    }
                }
                if (engine.getCaps().standardDerivatives && this._bumpTexture && MaterialFlags.BumpTextureEnabled && !this._disableBumpMap) {
                    // Bump texture cannot be not blocking.
                    if (!this._bumpTexture.isReady()) {
                        return false;
                    }
                }
                if (this._environmentBRDFTexture && MaterialFlags.ReflectionTextureEnabled) {
                    // This is blocking.
                    if (!this._environmentBRDFTexture.isReady()) {
                        return false;
                    }
                }
            }
        }
        if (!this.subSurface.isReadyForSubMesh(defines, scene) ||
            !this.clearCoat.isReadyForSubMesh(defines, scene, engine, this._disableBumpMap) ||
            !this.sheen.isReadyForSubMesh(defines, scene) ||
            !this.anisotropy.isReadyForSubMesh(defines, scene) ||
            !this.detailMap.isReadyForSubMesh(defines, scene)) {
            return false;
        }
        if (defines._areImageProcessingDirty && this._imageProcessingConfiguration) {
            if (!this._imageProcessingConfiguration.isReady()) {
                return false;
            }
        }
        if (!engine.getCaps().standardDerivatives && !mesh.isVerticesDataPresent(VertexBuffer.NormalKind)) {
            mesh.createNormals(true);
            Logger.Warn("PBRMaterial: Normals have been created for the mesh: " + mesh.name);
        }
        var previousEffect = subMesh.effect;
        var lightDisposed = defines._areLightsDisposed;
        var effect = this._prepareEffect(mesh, defines, this.onCompiled, this.onError, useInstances, null, subMesh.getRenderingMesh().hasThinInstances);
        if (effect) {
            if (this._onEffectCreatedObservable) {
                onCreatedEffectParameters.effect = effect;
                onCreatedEffectParameters.subMesh = subMesh;
                this._onEffectCreatedObservable.notifyObservers(onCreatedEffectParameters);
            }
            // Use previous effect while new one is compiling
            if (this.allowShaderHotSwapping && previousEffect && !effect.isReady()) {
                effect = previousEffect;
                this._rebuildInParallel = true;
                defines.markAsUnprocessed();
                if (lightDisposed) {
                    // re register in case it takes more than one frame.
                    defines._areLightsDisposed = true;
                    return false;
                }
            }
            else {
                this._rebuildInParallel = false;
                scene.resetCachedMaterial();
                subMesh.setEffect(effect, defines);
                this.buildUniformLayout();
            }
        }
        if (!subMesh.effect || !subMesh.effect.isReady()) {
            return false;
        }
        defines._renderId = scene.getRenderId();
        subMesh.effect._wasPreviouslyReady = true;
        return true;
    };
    /**
     * Specifies if the material uses metallic roughness workflow.
     * @returns boolean specifiying if the material uses metallic roughness workflow.
    */
    PBRBaseMaterial.prototype.isMetallicWorkflow = function () {
        if (this._metallic != null || this._roughness != null || this._metallicTexture) {
            return true;
        }
        return false;
    };
    PBRBaseMaterial.prototype._prepareEffect = function (mesh, defines, onCompiled, onError, useInstances, useClipPlane, useThinInstances) {
        if (onCompiled === void 0) { onCompiled = null; }
        if (onError === void 0) { onError = null; }
        if (useInstances === void 0) { useInstances = null; }
        if (useClipPlane === void 0) { useClipPlane = null; }
        this._prepareDefines(mesh, defines, useInstances, useClipPlane, useThinInstances);
        if (!defines.isDirty) {
            return null;
        }
        defines.markAsProcessed();
        var scene = this.getScene();
        var engine = scene.getEngine();
        // Fallbacks
        var fallbacks = new EffectFallbacks();
        var fallbackRank = 0;
        if (defines.USESPHERICALINVERTEX) {
            fallbacks.addFallback(fallbackRank++, "USESPHERICALINVERTEX");
        }
        if (defines.FOG) {
            fallbacks.addFallback(fallbackRank, "FOG");
        }
        if (defines.SPECULARAA) {
            fallbacks.addFallback(fallbackRank, "SPECULARAA");
        }
        if (defines.POINTSIZE) {
            fallbacks.addFallback(fallbackRank, "POINTSIZE");
        }
        if (defines.LOGARITHMICDEPTH) {
            fallbacks.addFallback(fallbackRank, "LOGARITHMICDEPTH");
        }
        if (defines.PARALLAX) {
            fallbacks.addFallback(fallbackRank, "PARALLAX");
        }
        if (defines.PARALLAXOCCLUSION) {
            fallbacks.addFallback(fallbackRank++, "PARALLAXOCCLUSION");
        }
        fallbackRank = PBRAnisotropicConfiguration.AddFallbacks(defines, fallbacks, fallbackRank);
        fallbackRank = PBRAnisotropicConfiguration.AddFallbacks(defines, fallbacks, fallbackRank);
        fallbackRank = PBRSubSurfaceConfiguration.AddFallbacks(defines, fallbacks, fallbackRank);
        fallbackRank = PBRSheenConfiguration.AddFallbacks(defines, fallbacks, fallbackRank);
        if (defines.ENVIRONMENTBRDF) {
            fallbacks.addFallback(fallbackRank++, "ENVIRONMENTBRDF");
        }
        if (defines.TANGENT) {
            fallbacks.addFallback(fallbackRank++, "TANGENT");
        }
        if (defines.BUMP) {
            fallbacks.addFallback(fallbackRank++, "BUMP");
        }
        fallbackRank = MaterialHelper.HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights, fallbackRank++);
        if (defines.SPECULARTERM) {
            fallbacks.addFallback(fallbackRank++, "SPECULARTERM");
        }
        if (defines.USESPHERICALFROMREFLECTIONMAP) {
            fallbacks.addFallback(fallbackRank++, "USESPHERICALFROMREFLECTIONMAP");
        }
        if (defines.USEIRRADIANCEMAP) {
            fallbacks.addFallback(fallbackRank++, "USEIRRADIANCEMAP");
        }
        if (defines.LIGHTMAP) {
            fallbacks.addFallback(fallbackRank++, "LIGHTMAP");
        }
        if (defines.NORMAL) {
            fallbacks.addFallback(fallbackRank++, "NORMAL");
        }
        if (defines.AMBIENT) {
            fallbacks.addFallback(fallbackRank++, "AMBIENT");
        }
        if (defines.EMISSIVE) {
            fallbacks.addFallback(fallbackRank++, "EMISSIVE");
        }
        if (defines.VERTEXCOLOR) {
            fallbacks.addFallback(fallbackRank++, "VERTEXCOLOR");
        }
        if (defines.MORPHTARGETS) {
            fallbacks.addFallback(fallbackRank++, "MORPHTARGETS");
        }
        if (defines.MULTIVIEW) {
            fallbacks.addFallback(0, "MULTIVIEW");
        }
        //Attributes
        var attribs = [VertexBuffer.PositionKind];
        if (defines.NORMAL) {
            attribs.push(VertexBuffer.NormalKind);
        }
        if (defines.TANGENT) {
            attribs.push(VertexBuffer.TangentKind);
        }
        if (defines.UV1) {
            attribs.push(VertexBuffer.UVKind);
        }
        if (defines.UV2) {
            attribs.push(VertexBuffer.UV2Kind);
        }
        if (defines.VERTEXCOLOR) {
            attribs.push(VertexBuffer.ColorKind);
        }
        MaterialHelper.PrepareAttributesForBones(attribs, mesh, defines, fallbacks);
        MaterialHelper.PrepareAttributesForInstances(attribs, defines);
        MaterialHelper.PrepareAttributesForMorphTargets(attribs, mesh, defines);
        var shaderName = "pbr";
        var uniforms = ["world", "view", "viewProjection", "vEyePosition", "vLightsType", "vAmbientColor", "vAlbedoColor", "vReflectivityColor", "vMetallicReflectanceFactors", "vEmissiveColor", "visibility", "vReflectionColor",
            "vFogInfos", "vFogColor", "pointSize",
            "vAlbedoInfos", "vAmbientInfos", "vOpacityInfos", "vReflectionInfos", "vReflectionPosition", "vReflectionSize", "vEmissiveInfos", "vReflectivityInfos", "vReflectionFilteringInfo", "vMetallicReflectanceInfos",
            "vMicroSurfaceSamplerInfos", "vBumpInfos", "vLightmapInfos",
            "mBones",
            "vClipPlane", "vClipPlane2", "vClipPlane3", "vClipPlane4", "vClipPlane5", "vClipPlane6", "albedoMatrix", "ambientMatrix", "opacityMatrix", "reflectionMatrix", "emissiveMatrix", "reflectivityMatrix", "normalMatrix", "microSurfaceSamplerMatrix", "bumpMatrix", "lightmapMatrix", "metallicReflectanceMatrix",
            "vLightingIntensity",
            "logarithmicDepthConstant",
            "vSphericalX", "vSphericalY", "vSphericalZ",
            "vSphericalXX_ZZ", "vSphericalYY_ZZ", "vSphericalZZ",
            "vSphericalXY", "vSphericalYZ", "vSphericalZX",
            "vSphericalL00",
            "vSphericalL1_1", "vSphericalL10", "vSphericalL11",
            "vSphericalL2_2", "vSphericalL2_1", "vSphericalL20", "vSphericalL21", "vSphericalL22",
            "vReflectionMicrosurfaceInfos",
            "vTangentSpaceParams", "boneTextureWidth",
            "vDebugMode"
        ];
        var samplers = ["albedoSampler", "reflectivitySampler", "ambientSampler", "emissiveSampler",
            "bumpSampler", "lightmapSampler", "opacitySampler",
            "reflectionSampler", "reflectionSamplerLow", "reflectionSamplerHigh", "irradianceSampler",
            "microSurfaceSampler", "environmentBrdfSampler", "boneSampler", "metallicReflectanceSampler"];
        var uniformBuffers = ["Material", "Scene"];
        DetailMapConfiguration.AddUniforms(uniforms);
        DetailMapConfiguration.AddSamplers(samplers);
        PBRSubSurfaceConfiguration.AddUniforms(uniforms);
        PBRSubSurfaceConfiguration.AddSamplers(samplers);
        PBRClearCoatConfiguration.AddUniforms(uniforms);
        PBRClearCoatConfiguration.AddSamplers(samplers);
        PBRAnisotropicConfiguration.AddUniforms(uniforms);
        PBRAnisotropicConfiguration.AddSamplers(samplers);
        PBRSheenConfiguration.AddUniforms(uniforms);
        PBRSheenConfiguration.AddSamplers(samplers);
        PrePassConfiguration.AddUniforms(uniforms);
        PrePassConfiguration.AddSamplers(uniforms);
        if (ImageProcessingConfiguration) {
            ImageProcessingConfiguration.PrepareUniforms(uniforms, defines);
            ImageProcessingConfiguration.PrepareSamplers(samplers, defines);
        }
        MaterialHelper.PrepareUniformsAndSamplersList({
            uniformsNames: uniforms,
            uniformBuffersNames: uniformBuffers,
            samplers: samplers,
            defines: defines,
            maxSimultaneousLights: this._maxSimultaneousLights
        });
        var csnrOptions = {};
        if (this.customShaderNameResolve) {
            shaderName = this.customShaderNameResolve(shaderName, uniforms, uniformBuffers, samplers, defines, attribs, csnrOptions);
        }
        var join = defines.toString();
        return engine.createEffect(shaderName, {
            attributes: attribs,
            uniformsNames: uniforms,
            uniformBuffersNames: uniformBuffers,
            samplers: samplers,
            defines: join,
            fallbacks: fallbacks,
            onCompiled: onCompiled,
            onError: onError,
            indexParameters: { maxSimultaneousLights: this._maxSimultaneousLights, maxSimultaneousMorphTargets: defines.NUM_MORPH_INFLUENCERS },
            processFinalCode: csnrOptions.processFinalCode,
            multiTarget: defines.PREPASS
        }, engine);
    };
    PBRBaseMaterial.prototype._prepareDefines = function (mesh, defines, useInstances, useClipPlane, useThinInstances) {
        if (useInstances === void 0) { useInstances = null; }
        if (useClipPlane === void 0) { useClipPlane = null; }
        if (useThinInstances === void 0) { useThinInstances = false; }
        var scene = this.getScene();
        var engine = scene.getEngine();
        // Lights
        MaterialHelper.PrepareDefinesForLights(scene, mesh, defines, true, this._maxSimultaneousLights, this._disableLighting);
        defines._needNormals = true;
        // Multiview
        MaterialHelper.PrepareDefinesForMultiview(scene, defines);
        // PrePass
        MaterialHelper.PrepareDefinesForPrePass(scene, defines, this.canRenderToMRT);
        // Textures
        defines.METALLICWORKFLOW = this.isMetallicWorkflow();
        if (defines._areTexturesDirty) {
            defines._needUVs = false;
            if (scene.texturesEnabled) {
                if (scene.getEngine().getCaps().textureLOD) {
                    defines.LODBASEDMICROSFURACE = true;
                }
                if (this._albedoTexture && MaterialFlags.DiffuseTextureEnabled) {
                    MaterialHelper.PrepareDefinesForMergedUV(this._albedoTexture, defines, "ALBEDO");
                    defines.GAMMAALBEDO = this._albedoTexture.gammaSpace;
                }
                else {
                    defines.ALBEDO = false;
                }
                if (this._ambientTexture && MaterialFlags.AmbientTextureEnabled) {
                    MaterialHelper.PrepareDefinesForMergedUV(this._ambientTexture, defines, "AMBIENT");
                    defines.AMBIENTINGRAYSCALE = this._useAmbientInGrayScale;
                }
                else {
                    defines.AMBIENT = false;
                }
                if (this._opacityTexture && MaterialFlags.OpacityTextureEnabled) {
                    MaterialHelper.PrepareDefinesForMergedUV(this._opacityTexture, defines, "OPACITY");
                    defines.OPACITYRGB = this._opacityTexture.getAlphaFromRGB;
                }
                else {
                    defines.OPACITY = false;
                }
                var reflectionTexture = this._getReflectionTexture();
                if (reflectionTexture && MaterialFlags.ReflectionTextureEnabled) {
                    defines.REFLECTION = true;
                    defines.GAMMAREFLECTION = reflectionTexture.gammaSpace;
                    defines.RGBDREFLECTION = reflectionTexture.isRGBD;
                    defines.REFLECTIONMAP_OPPOSITEZ = this.getScene().useRightHandedSystem ? !reflectionTexture.invertZ : reflectionTexture.invertZ;
                    defines.LODINREFLECTIONALPHA = reflectionTexture.lodLevelInAlpha;
                    defines.LINEARSPECULARREFLECTION = reflectionTexture.linearSpecularLOD;
                    if (this.realTimeFiltering && this.realTimeFilteringQuality > 0) {
                        defines.NUM_SAMPLES = "" + this.realTimeFilteringQuality;
                        if (engine.webGLVersion > 1) {
                            defines.NUM_SAMPLES = defines.NUM_SAMPLES + "u";
                        }
                        defines.REALTIME_FILTERING = true;
                    }
                    else {
                        defines.REALTIME_FILTERING = false;
                    }
                    if (reflectionTexture.coordinatesMode === Texture.INVCUBIC_MODE) {
                        defines.INVERTCUBICMAP = true;
                    }
                    defines.REFLECTIONMAP_3D = reflectionTexture.isCube;
                    defines.REFLECTIONMAP_CUBIC = false;
                    defines.REFLECTIONMAP_EXPLICIT = false;
                    defines.REFLECTIONMAP_PLANAR = false;
                    defines.REFLECTIONMAP_PROJECTION = false;
                    defines.REFLECTIONMAP_SKYBOX = false;
                    defines.REFLECTIONMAP_SPHERICAL = false;
                    defines.REFLECTIONMAP_EQUIRECTANGULAR = false;
                    defines.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
                    defines.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
                    switch (reflectionTexture.coordinatesMode) {
                        case Texture.EXPLICIT_MODE:
                            defines.REFLECTIONMAP_EXPLICIT = true;
                            break;
                        case Texture.PLANAR_MODE:
                            defines.REFLECTIONMAP_PLANAR = true;
                            break;
                        case Texture.PROJECTION_MODE:
                            defines.REFLECTIONMAP_PROJECTION = true;
                            break;
                        case Texture.SKYBOX_MODE:
                            defines.REFLECTIONMAP_SKYBOX = true;
                            break;
                        case Texture.SPHERICAL_MODE:
                            defines.REFLECTIONMAP_SPHERICAL = true;
                            break;
                        case Texture.EQUIRECTANGULAR_MODE:
                            defines.REFLECTIONMAP_EQUIRECTANGULAR = true;
                            break;
                        case Texture.FIXED_EQUIRECTANGULAR_MODE:
                            defines.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = true;
                            break;
                        case Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE:
                            defines.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = true;
                            break;
                        case Texture.CUBIC_MODE:
                        case Texture.INVCUBIC_MODE:
                        default:
                            defines.REFLECTIONMAP_CUBIC = true;
                            defines.USE_LOCAL_REFLECTIONMAP_CUBIC = reflectionTexture.boundingBoxSize ? true : false;
                            break;
                    }
                    if (reflectionTexture.coordinatesMode !== Texture.SKYBOX_MODE) {
                        if (reflectionTexture.irradianceTexture) {
                            defines.USEIRRADIANCEMAP = true;
                            defines.USESPHERICALFROMREFLECTIONMAP = false;
                        }
                        // Assume using spherical polynomial if the reflection texture is a cube map
                        else if (reflectionTexture.isCube) {
                            defines.USESPHERICALFROMREFLECTIONMAP = true;
                            defines.USEIRRADIANCEMAP = false;
                            if (this._forceIrradianceInFragment || this.realTimeFiltering || scene.getEngine().getCaps().maxVaryingVectors <= 8) {
                                defines.USESPHERICALINVERTEX = false;
                            }
                            else {
                                defines.USESPHERICALINVERTEX = true;
                            }
                        }
                    }
                }
                else {
                    defines.REFLECTION = false;
                    defines.REFLECTIONMAP_3D = false;
                    defines.REFLECTIONMAP_SPHERICAL = false;
                    defines.REFLECTIONMAP_PLANAR = false;
                    defines.REFLECTIONMAP_CUBIC = false;
                    defines.USE_LOCAL_REFLECTIONMAP_CUBIC = false;
                    defines.REFLECTIONMAP_PROJECTION = false;
                    defines.REFLECTIONMAP_SKYBOX = false;
                    defines.REFLECTIONMAP_EXPLICIT = false;
                    defines.REFLECTIONMAP_EQUIRECTANGULAR = false;
                    defines.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
                    defines.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
                    defines.INVERTCUBICMAP = false;
                    defines.USESPHERICALFROMREFLECTIONMAP = false;
                    defines.USEIRRADIANCEMAP = false;
                    defines.USESPHERICALINVERTEX = false;
                    defines.REFLECTIONMAP_OPPOSITEZ = false;
                    defines.LODINREFLECTIONALPHA = false;
                    defines.GAMMAREFLECTION = false;
                    defines.RGBDREFLECTION = false;
                    defines.LINEARSPECULARREFLECTION = false;
                }
                if (this._lightmapTexture && MaterialFlags.LightmapTextureEnabled) {
                    MaterialHelper.PrepareDefinesForMergedUV(this._lightmapTexture, defines, "LIGHTMAP");
                    defines.USELIGHTMAPASSHADOWMAP = this._useLightmapAsShadowmap;
                    defines.GAMMALIGHTMAP = this._lightmapTexture.gammaSpace;
                    defines.RGBDLIGHTMAP = this._lightmapTexture.isRGBD;
                }
                else {
                    defines.LIGHTMAP = false;
                }
                if (this._emissiveTexture && MaterialFlags.EmissiveTextureEnabled) {
                    MaterialHelper.PrepareDefinesForMergedUV(this._emissiveTexture, defines, "EMISSIVE");
                }
                else {
                    defines.EMISSIVE = false;
                }
                if (MaterialFlags.SpecularTextureEnabled) {
                    if (this._metallicTexture) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._metallicTexture, defines, "REFLECTIVITY");
                        defines.ROUGHNESSSTOREINMETALMAPALPHA = this._useRoughnessFromMetallicTextureAlpha;
                        defines.ROUGHNESSSTOREINMETALMAPGREEN = !this._useRoughnessFromMetallicTextureAlpha && this._useRoughnessFromMetallicTextureGreen;
                        defines.METALLNESSSTOREINMETALMAPBLUE = this._useMetallnessFromMetallicTextureBlue;
                        defines.AOSTOREINMETALMAPRED = this._useAmbientOcclusionFromMetallicTextureRed;
                    }
                    else if (this._reflectivityTexture) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._reflectivityTexture, defines, "REFLECTIVITY");
                        defines.MICROSURFACEFROMREFLECTIVITYMAP = this._useMicroSurfaceFromReflectivityMapAlpha;
                        defines.MICROSURFACEAUTOMATIC = this._useAutoMicroSurfaceFromReflectivityMap;
                    }
                    else {
                        defines.REFLECTIVITY = false;
                    }
                    if (this._metallicReflectanceTexture) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._metallicReflectanceTexture, defines, "METALLIC_REFLECTANCE");
                    }
                    else {
                        defines.METALLIC_REFLECTANCE = false;
                    }
                    if (this._microSurfaceTexture) {
                        MaterialHelper.PrepareDefinesForMergedUV(this._microSurfaceTexture, defines, "MICROSURFACEMAP");
                    }
                    else {
                        defines.MICROSURFACEMAP = false;
                    }
                }
                else {
                    defines.REFLECTIVITY = false;
                    defines.MICROSURFACEMAP = false;
                }
                if (scene.getEngine().getCaps().standardDerivatives && this._bumpTexture && MaterialFlags.BumpTextureEnabled && !this._disableBumpMap) {
                    MaterialHelper.PrepareDefinesForMergedUV(this._bumpTexture, defines, "BUMP");
                    if (this._useParallax && this._albedoTexture && MaterialFlags.DiffuseTextureEnabled) {
                        defines.PARALLAX = true;
                        defines.PARALLAXOCCLUSION = !!this._useParallaxOcclusion;
                    }
                    else {
                        defines.PARALLAX = false;
                    }
                    defines.OBJECTSPACE_NORMALMAP = this._useObjectSpaceNormalMap;
                }
                else {
                    defines.BUMP = false;
                }
                if (this._environmentBRDFTexture && MaterialFlags.ReflectionTextureEnabled) {
                    defines.ENVIRONMENTBRDF = true;
                    // Not actual true RGBD, only the B chanel is encoded as RGBD for sheen.
                    defines.ENVIRONMENTBRDF_RGBD = this._environmentBRDFTexture.isRGBD;
                }
                else {
                    defines.ENVIRONMENTBRDF = false;
                    defines.ENVIRONMENTBRDF_RGBD = false;
                }
                if (this._shouldUseAlphaFromAlbedoTexture()) {
                    defines.ALPHAFROMALBEDO = true;
                }
                else {
                    defines.ALPHAFROMALBEDO = false;
                }
            }
            defines.SPECULAROVERALPHA = this._useSpecularOverAlpha;
            if (this._lightFalloff === PBRBaseMaterial.LIGHTFALLOFF_STANDARD) {
                defines.USEPHYSICALLIGHTFALLOFF = false;
                defines.USEGLTFLIGHTFALLOFF = false;
            }
            else if (this._lightFalloff === PBRBaseMaterial.LIGHTFALLOFF_GLTF) {
                defines.USEPHYSICALLIGHTFALLOFF = false;
                defines.USEGLTFLIGHTFALLOFF = true;
            }
            else {
                defines.USEPHYSICALLIGHTFALLOFF = true;
                defines.USEGLTFLIGHTFALLOFF = false;
            }
            defines.RADIANCEOVERALPHA = this._useRadianceOverAlpha;
            if (!this.backFaceCulling && this._twoSidedLighting) {
                defines.TWOSIDEDLIGHTING = true;
            }
            else {
                defines.TWOSIDEDLIGHTING = false;
            }
            defines.SPECULARAA = scene.getEngine().getCaps().standardDerivatives && this._enableSpecularAntiAliasing;
        }
        if (defines._areTexturesDirty || defines._areMiscDirty) {
            defines.ALPHATESTVALUE = "" + this._alphaCutOff + (this._alphaCutOff % 1 === 0 ? "." : "");
            defines.PREMULTIPLYALPHA = (this.alphaMode === 7 || this.alphaMode === 8);
            defines.ALPHABLEND = this.needAlphaBlendingForMesh(mesh);
            defines.ALPHAFRESNEL = this._useAlphaFresnel || this._useLinearAlphaFresnel;
            defines.LINEARALPHAFRESNEL = this._useLinearAlphaFresnel;
        }
        if (defines._areImageProcessingDirty && this._imageProcessingConfiguration) {
            this._imageProcessingConfiguration.prepareDefines(defines);
        }
        defines.FORCENORMALFORWARD = this._forceNormalForward;
        defines.RADIANCEOCCLUSION = this._useRadianceOcclusion;
        defines.HORIZONOCCLUSION = this._useHorizonOcclusion;
        // Misc.
        if (defines._areMiscDirty) {
            MaterialHelper.PrepareDefinesForMisc(mesh, scene, this._useLogarithmicDepth, this.pointsCloud, this.fogEnabled, this._shouldTurnAlphaTestOn(mesh) || this._forceAlphaTest, defines);
            defines.UNLIT = this._unlit || ((this.pointsCloud || this.wireframe) && !mesh.isVerticesDataPresent(VertexBuffer.NormalKind));
            defines.DEBUGMODE = this._debugMode;
        }
        // External config
        this.detailMap.prepareDefines(defines, scene);
        this.subSurface.prepareDefines(defines, scene);
        this.clearCoat.prepareDefines(defines, scene);
        this.anisotropy.prepareDefines(defines, mesh, scene);
        this.brdf.prepareDefines(defines);
        this.sheen.prepareDefines(defines, scene);
        // Values that need to be evaluated on every frame
        MaterialHelper.PrepareDefinesForFrameBoundValues(scene, engine, defines, useInstances ? true : false, useClipPlane, useThinInstances);
        // Attribs
        MaterialHelper.PrepareDefinesForAttributes(mesh, defines, true, true, true, this._transparencyMode !== PBRBaseMaterial.PBRMATERIAL_OPAQUE);
    };
    /**
     * Force shader compilation
     */
    PBRBaseMaterial.prototype.forceCompilation = function (mesh, onCompiled, options) {
        var _this = this;
        var localOptions = __assign({ clipPlane: false, useInstances: false }, options);
        var defines = new PBRMaterialDefines();
        var effect = this._prepareEffect(mesh, defines, undefined, undefined, localOptions.useInstances, localOptions.clipPlane, mesh.hasThinInstances);
        if (this._onEffectCreatedObservable) {
            onCreatedEffectParameters.effect = effect;
            onCreatedEffectParameters.subMesh = null;
            this._onEffectCreatedObservable.notifyObservers(onCreatedEffectParameters);
        }
        if (effect.isReady()) {
            if (onCompiled) {
                onCompiled(this);
            }
        }
        else {
            effect.onCompileObservable.add(function () {
                if (onCompiled) {
                    onCompiled(_this);
                }
            });
        }
    };
    /**
     * Initializes the uniform buffer layout for the shader.
     */
    PBRBaseMaterial.prototype.buildUniformLayout = function () {
        // Order is important !
        var ubo = this._uniformBuffer;
        ubo.addUniform("vAlbedoInfos", 2);
        ubo.addUniform("vAmbientInfos", 4);
        ubo.addUniform("vOpacityInfos", 2);
        ubo.addUniform("vEmissiveInfos", 2);
        ubo.addUniform("vLightmapInfos", 2);
        ubo.addUniform("vReflectivityInfos", 3);
        ubo.addUniform("vMicroSurfaceSamplerInfos", 2);
        ubo.addUniform("vReflectionInfos", 2);
        ubo.addUniform("vReflectionFilteringInfo", 2);
        ubo.addUniform("vReflectionPosition", 3);
        ubo.addUniform("vReflectionSize", 3);
        ubo.addUniform("vBumpInfos", 3);
        ubo.addUniform("albedoMatrix", 16);
        ubo.addUniform("ambientMatrix", 16);
        ubo.addUniform("opacityMatrix", 16);
        ubo.addUniform("emissiveMatrix", 16);
        ubo.addUniform("lightmapMatrix", 16);
        ubo.addUniform("reflectivityMatrix", 16);
        ubo.addUniform("microSurfaceSamplerMatrix", 16);
        ubo.addUniform("bumpMatrix", 16);
        ubo.addUniform("vTangentSpaceParams", 2);
        ubo.addUniform("reflectionMatrix", 16);
        ubo.addUniform("vReflectionColor", 3);
        ubo.addUniform("vAlbedoColor", 4);
        ubo.addUniform("vLightingIntensity", 4);
        ubo.addUniform("vReflectionMicrosurfaceInfos", 3);
        ubo.addUniform("pointSize", 1);
        ubo.addUniform("vReflectivityColor", 4);
        ubo.addUniform("vEmissiveColor", 3);
        ubo.addUniform("visibility", 1);
        ubo.addUniform("vMetallicReflectanceFactors", 4);
        ubo.addUniform("vMetallicReflectanceInfos", 2);
        ubo.addUniform("metallicReflectanceMatrix", 16);
        PBRClearCoatConfiguration.PrepareUniformBuffer(ubo);
        PBRAnisotropicConfiguration.PrepareUniformBuffer(ubo);
        PBRSheenConfiguration.PrepareUniformBuffer(ubo);
        PBRSubSurfaceConfiguration.PrepareUniformBuffer(ubo);
        DetailMapConfiguration.PrepareUniformBuffer(ubo);
        ubo.create();
    };
    /**
     * Unbinds the material from the mesh
     */
    PBRBaseMaterial.prototype.unbind = function () {
        if (this._activeEffect) {
            var needFlag = false;
            if (this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                this._activeEffect.setTexture("reflection2DSampler", null);
                needFlag = true;
            }
            if (this.subSurface.unbind(this._activeEffect)) {
                needFlag = true;
            }
            if (needFlag) {
                this._markAllSubMeshesAsTexturesDirty();
            }
        }
        _super.prototype.unbind.call(this);
    };
    /**
     * Binds the submesh data.
     * @param world - The world matrix.
     * @param mesh - The BJS mesh.
     * @param subMesh - A submesh of the BJS mesh.
     */
    PBRBaseMaterial.prototype.bindForSubMesh = function (world, mesh, subMesh) {
        var scene = this.getScene();
        var defines = subMesh._materialDefines;
        if (!defines) {
            return;
        }
        var effect = subMesh.effect;
        if (!effect) {
            return;
        }
        this._activeEffect = effect;
        // Matrices
        if (!defines.INSTANCES || defines.THIN_INSTANCES) {
            this.bindOnlyWorldMatrix(world);
        }
        // PrePass
        this.prePassConfiguration.bindForSubMesh(this._activeEffect, scene, mesh, world, this.isFrozen);
        // Normal Matrix
        if (defines.OBJECTSPACE_NORMALMAP) {
            world.toNormalMatrix(this._normalMatrix);
            this.bindOnlyNormalMatrix(this._normalMatrix);
        }
        var mustRebind = this._mustRebind(scene, effect, mesh.visibility);
        // Bones
        MaterialHelper.BindBonesParameters(mesh, this._activeEffect, this.prePassConfiguration);
        var reflectionTexture = null;
        var ubo = this._uniformBuffer;
        if (mustRebind) {
            var engine = scene.getEngine();
            ubo.bindToEffect(effect, "Material");
            this.bindViewProjection(effect);
            reflectionTexture = this._getReflectionTexture();
            if (!ubo.useUbo || !this.isFrozen || !ubo.isSync) {
                // Texture uniforms
                if (scene.texturesEnabled) {
                    if (this._albedoTexture && MaterialFlags.DiffuseTextureEnabled) {
                        ubo.updateFloat2("vAlbedoInfos", this._albedoTexture.coordinatesIndex, this._albedoTexture.level);
                        MaterialHelper.BindTextureMatrix(this._albedoTexture, ubo, "albedo");
                    }
                    if (this._ambientTexture && MaterialFlags.AmbientTextureEnabled) {
                        ubo.updateFloat4("vAmbientInfos", this._ambientTexture.coordinatesIndex, this._ambientTexture.level, this._ambientTextureStrength, this._ambientTextureImpactOnAnalyticalLights);
                        MaterialHelper.BindTextureMatrix(this._ambientTexture, ubo, "ambient");
                    }
                    if (this._opacityTexture && MaterialFlags.OpacityTextureEnabled) {
                        ubo.updateFloat2("vOpacityInfos", this._opacityTexture.coordinatesIndex, this._opacityTexture.level);
                        MaterialHelper.BindTextureMatrix(this._opacityTexture, ubo, "opacity");
                    }
                    if (reflectionTexture && MaterialFlags.ReflectionTextureEnabled) {
                        ubo.updateMatrix("reflectionMatrix", reflectionTexture.getReflectionTextureMatrix());
                        ubo.updateFloat2("vReflectionInfos", reflectionTexture.level, 0);
                        if (reflectionTexture.boundingBoxSize) {
                            var cubeTexture = reflectionTexture;
                            ubo.updateVector3("vReflectionPosition", cubeTexture.boundingBoxPosition);
                            ubo.updateVector3("vReflectionSize", cubeTexture.boundingBoxSize);
                        }
                        if (this.realTimeFiltering) {
                            var width = reflectionTexture.getSize().width;
                            ubo.updateFloat2("vReflectionFilteringInfo", width, Scalar.Log2(width));
                        }
                        if (!defines.USEIRRADIANCEMAP) {
                            var polynomials = reflectionTexture.sphericalPolynomial;
                            if (defines.USESPHERICALFROMREFLECTIONMAP && polynomials) {
                                if (defines.SPHERICAL_HARMONICS) {
                                    var preScaledHarmonics = polynomials.preScaledHarmonics;
                                    this._activeEffect.setVector3("vSphericalL00", preScaledHarmonics.l00);
                                    this._activeEffect.setVector3("vSphericalL1_1", preScaledHarmonics.l1_1);
                                    this._activeEffect.setVector3("vSphericalL10", preScaledHarmonics.l10);
                                    this._activeEffect.setVector3("vSphericalL11", preScaledHarmonics.l11);
                                    this._activeEffect.setVector3("vSphericalL2_2", preScaledHarmonics.l2_2);
                                    this._activeEffect.setVector3("vSphericalL2_1", preScaledHarmonics.l2_1);
                                    this._activeEffect.setVector3("vSphericalL20", preScaledHarmonics.l20);
                                    this._activeEffect.setVector3("vSphericalL21", preScaledHarmonics.l21);
                                    this._activeEffect.setVector3("vSphericalL22", preScaledHarmonics.l22);
                                }
                                else {
                                    this._activeEffect.setFloat3("vSphericalX", polynomials.x.x, polynomials.x.y, polynomials.x.z);
                                    this._activeEffect.setFloat3("vSphericalY", polynomials.y.x, polynomials.y.y, polynomials.y.z);
                                    this._activeEffect.setFloat3("vSphericalZ", polynomials.z.x, polynomials.z.y, polynomials.z.z);
                                    this._activeEffect.setFloat3("vSphericalXX_ZZ", polynomials.xx.x - polynomials.zz.x, polynomials.xx.y - polynomials.zz.y, polynomials.xx.z - polynomials.zz.z);
                                    this._activeEffect.setFloat3("vSphericalYY_ZZ", polynomials.yy.x - polynomials.zz.x, polynomials.yy.y - polynomials.zz.y, polynomials.yy.z - polynomials.zz.z);
                                    this._activeEffect.setFloat3("vSphericalZZ", polynomials.zz.x, polynomials.zz.y, polynomials.zz.z);
                                    this._activeEffect.setFloat3("vSphericalXY", polynomials.xy.x, polynomials.xy.y, polynomials.xy.z);
                                    this._activeEffect.setFloat3("vSphericalYZ", polynomials.yz.x, polynomials.yz.y, polynomials.yz.z);
                                    this._activeEffect.setFloat3("vSphericalZX", polynomials.zx.x, polynomials.zx.y, polynomials.zx.z);
                                }
                            }
                        }
                        ubo.updateFloat3("vReflectionMicrosurfaceInfos", reflectionTexture.getSize().width, reflectionTexture.lodGenerationScale, reflectionTexture.lodGenerationOffset);
                    }
                    if (this._emissiveTexture && MaterialFlags.EmissiveTextureEnabled) {
                        ubo.updateFloat2("vEmissiveInfos", this._emissiveTexture.coordinatesIndex, this._emissiveTexture.level);
                        MaterialHelper.BindTextureMatrix(this._emissiveTexture, ubo, "emissive");
                    }
                    if (this._lightmapTexture && MaterialFlags.LightmapTextureEnabled) {
                        ubo.updateFloat2("vLightmapInfos", this._lightmapTexture.coordinatesIndex, this._lightmapTexture.level);
                        MaterialHelper.BindTextureMatrix(this._lightmapTexture, ubo, "lightmap");
                    }
                    if (MaterialFlags.SpecularTextureEnabled) {
                        if (this._metallicTexture) {
                            ubo.updateFloat3("vReflectivityInfos", this._metallicTexture.coordinatesIndex, this._metallicTexture.level, this._ambientTextureStrength);
                            MaterialHelper.BindTextureMatrix(this._metallicTexture, ubo, "reflectivity");
                        }
                        else if (this._reflectivityTexture) {
                            ubo.updateFloat3("vReflectivityInfos", this._reflectivityTexture.coordinatesIndex, this._reflectivityTexture.level, 1.0);
                            MaterialHelper.BindTextureMatrix(this._reflectivityTexture, ubo, "reflectivity");
                        }
                        if (this._metallicReflectanceTexture) {
                            ubo.updateFloat2("vMetallicReflectanceInfos", this._metallicReflectanceTexture.coordinatesIndex, this._metallicReflectanceTexture.level);
                            MaterialHelper.BindTextureMatrix(this._metallicReflectanceTexture, ubo, "metallicReflectance");
                        }
                        if (this._microSurfaceTexture) {
                            ubo.updateFloat2("vMicroSurfaceSamplerInfos", this._microSurfaceTexture.coordinatesIndex, this._microSurfaceTexture.level);
                            MaterialHelper.BindTextureMatrix(this._microSurfaceTexture, ubo, "microSurfaceSampler");
                        }
                    }
                    if (this._bumpTexture && engine.getCaps().standardDerivatives && MaterialFlags.BumpTextureEnabled && !this._disableBumpMap) {
                        ubo.updateFloat3("vBumpInfos", this._bumpTexture.coordinatesIndex, this._bumpTexture.level, this._parallaxScaleBias);
                        MaterialHelper.BindTextureMatrix(this._bumpTexture, ubo, "bump");
                        if (scene._mirroredCameraPosition) {
                            ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? 1.0 : -1.0, this._invertNormalMapY ? 1.0 : -1.0);
                        }
                        else {
                            ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? -1.0 : 1.0, this._invertNormalMapY ? -1.0 : 1.0);
                        }
                    }
                }
                // Point size
                if (this.pointsCloud) {
                    ubo.updateFloat("pointSize", this.pointSize);
                }
                // Colors
                if (defines.METALLICWORKFLOW) {
                    TmpColors.Color3[0].r = (this._metallic === undefined || this._metallic === null) ? 1 : this._metallic;
                    TmpColors.Color3[0].g = (this._roughness === undefined || this._roughness === null) ? 1 : this._roughness;
                    ubo.updateColor4("vReflectivityColor", TmpColors.Color3[0], 1);
                    var ior = this.subSurface.indexOfRefraction;
                    var outside_ior = 1; // consider air as clear coat and other layaers would remap in the shader.
                    // We are here deriving our default reflectance from a common value for none metallic surface.
                    // Based of the schlick fresnel approximation model
                    // for dielectrics.
                    var f0 = Math.pow((ior - outside_ior) / (ior + outside_ior), 2);
                    // Tweak the default F0 and F90 based on our given setup
                    this._metallicReflectanceColor.scaleToRef(f0 * this._metallicF0Factor, TmpColors.Color3[0]);
                    var metallicF90 = this._metallicF0Factor;
                    ubo.updateColor4("vMetallicReflectanceFactors", TmpColors.Color3[0], metallicF90);
                }
                else {
                    ubo.updateColor4("vReflectivityColor", this._reflectivityColor, this._microSurface);
                }
                ubo.updateColor3("vEmissiveColor", MaterialFlags.EmissiveTextureEnabled ? this._emissiveColor : Color3.BlackReadOnly);
                ubo.updateColor3("vReflectionColor", this._reflectionColor);
                if (!defines.SS_REFRACTION && this.subSurface.linkRefractionWithTransparency) {
                    ubo.updateColor4("vAlbedoColor", this._albedoColor, 1);
                }
                else {
                    ubo.updateColor4("vAlbedoColor", this._albedoColor, this.alpha);
                }
                // Misc
                this._lightingInfos.x = this._directIntensity;
                this._lightingInfos.y = this._emissiveIntensity;
                this._lightingInfos.z = this._environmentIntensity * scene.environmentIntensity;
                this._lightingInfos.w = this._specularIntensity;
                ubo.updateVector4("vLightingIntensity", this._lightingInfos);
            }
            // Visibility
            ubo.updateFloat("visibility", mesh.visibility);
            // Textures
            if (scene.texturesEnabled) {
                if (this._albedoTexture && MaterialFlags.DiffuseTextureEnabled) {
                    ubo.setTexture("albedoSampler", this._albedoTexture);
                }
                if (this._ambientTexture && MaterialFlags.AmbientTextureEnabled) {
                    ubo.setTexture("ambientSampler", this._ambientTexture);
                }
                if (this._opacityTexture && MaterialFlags.OpacityTextureEnabled) {
                    ubo.setTexture("opacitySampler", this._opacityTexture);
                }
                if (reflectionTexture && MaterialFlags.ReflectionTextureEnabled) {
                    if (defines.LODBASEDMICROSFURACE) {
                        ubo.setTexture("reflectionSampler", reflectionTexture);
                    }
                    else {
                        ubo.setTexture("reflectionSampler", reflectionTexture._lodTextureMid || reflectionTexture);
                        ubo.setTexture("reflectionSamplerLow", reflectionTexture._lodTextureLow || reflectionTexture);
                        ubo.setTexture("reflectionSamplerHigh", reflectionTexture._lodTextureHigh || reflectionTexture);
                    }
                    if (defines.USEIRRADIANCEMAP) {
                        ubo.setTexture("irradianceSampler", reflectionTexture.irradianceTexture);
                    }
                }
                if (defines.ENVIRONMENTBRDF) {
                    ubo.setTexture("environmentBrdfSampler", this._environmentBRDFTexture);
                }
                if (this._emissiveTexture && MaterialFlags.EmissiveTextureEnabled) {
                    ubo.setTexture("emissiveSampler", this._emissiveTexture);
                }
                if (this._lightmapTexture && MaterialFlags.LightmapTextureEnabled) {
                    ubo.setTexture("lightmapSampler", this._lightmapTexture);
                }
                if (MaterialFlags.SpecularTextureEnabled) {
                    if (this._metallicTexture) {
                        ubo.setTexture("reflectivitySampler", this._metallicTexture);
                    }
                    else if (this._reflectivityTexture) {
                        ubo.setTexture("reflectivitySampler", this._reflectivityTexture);
                    }
                    if (this._metallicReflectanceTexture) {
                        ubo.setTexture("metallicReflectanceSampler", this._metallicReflectanceTexture);
                    }
                    if (this._microSurfaceTexture) {
                        ubo.setTexture("microSurfaceSampler", this._microSurfaceTexture);
                    }
                }
                if (this._bumpTexture && engine.getCaps().standardDerivatives && MaterialFlags.BumpTextureEnabled && !this._disableBumpMap) {
                    ubo.setTexture("bumpSampler", this._bumpTexture);
                }
            }
            this.detailMap.bindForSubMesh(ubo, scene, this.isFrozen);
            this.subSurface.bindForSubMesh(ubo, scene, engine, this.isFrozen, defines.LODBASEDMICROSFURACE, this.realTimeFiltering);
            this.clearCoat.bindForSubMesh(ubo, scene, engine, this._disableBumpMap, this.isFrozen, this._invertNormalMapX, this._invertNormalMapY, subMesh);
            this.anisotropy.bindForSubMesh(ubo, scene, this.isFrozen);
            this.sheen.bindForSubMesh(ubo, scene, this.isFrozen, subMesh);
            // Clip plane
            MaterialHelper.BindClipPlane(this._activeEffect, scene);
            // Colors
            scene.ambientColor.multiplyToRef(this._ambientColor, this._globalAmbientColor);
            var eyePosition = scene._forcedViewPosition ? scene._forcedViewPosition : (scene._mirroredCameraPosition ? scene._mirroredCameraPosition : scene.activeCamera.globalPosition);
            var invertNormal = (scene.useRightHandedSystem === (scene._mirroredCameraPosition != null));
            effect.setFloat4("vEyePosition", eyePosition.x, eyePosition.y, eyePosition.z, invertNormal ? -1 : 1);
            effect.setColor3("vAmbientColor", this._globalAmbientColor);
            effect.setFloat2("vDebugMode", this.debugLimit, this.debugFactor);
        }
        if (mustRebind || !this.isFrozen) {
            // Lights
            if (scene.lightsEnabled && !this._disableLighting) {
                MaterialHelper.BindLights(scene, mesh, this._activeEffect, defines, this._maxSimultaneousLights, this._rebuildInParallel);
            }
            // View
            if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== Scene.FOGMODE_NONE || reflectionTexture) {
                this.bindView(effect);
            }
            // Fog
            MaterialHelper.BindFogParameters(scene, mesh, this._activeEffect, true);
            // Morph targets
            if (defines.NUM_MORPH_INFLUENCERS) {
                MaterialHelper.BindMorphTargetParameters(mesh, this._activeEffect);
            }
            // image processing
            this._imageProcessingConfiguration.bind(this._activeEffect);
            // Log. depth
            MaterialHelper.BindLogDepth(defines, this._activeEffect, scene);
        }
        ubo.update();
        this._afterBind(mesh, this._activeEffect);
    };
    /**
     * Returns the animatable textures.
     * @returns - Array of animatable textures.
     */
    PBRBaseMaterial.prototype.getAnimatables = function () {
        var results = [];
        if (this._albedoTexture && this._albedoTexture.animations && this._albedoTexture.animations.length > 0) {
            results.push(this._albedoTexture);
        }
        if (this._ambientTexture && this._ambientTexture.animations && this._ambientTexture.animations.length > 0) {
            results.push(this._ambientTexture);
        }
        if (this._opacityTexture && this._opacityTexture.animations && this._opacityTexture.animations.length > 0) {
            results.push(this._opacityTexture);
        }
        if (this._reflectionTexture && this._reflectionTexture.animations && this._reflectionTexture.animations.length > 0) {
            results.push(this._reflectionTexture);
        }
        if (this._emissiveTexture && this._emissiveTexture.animations && this._emissiveTexture.animations.length > 0) {
            results.push(this._emissiveTexture);
        }
        if (this._metallicTexture && this._metallicTexture.animations && this._metallicTexture.animations.length > 0) {
            results.push(this._metallicTexture);
        }
        else if (this._reflectivityTexture && this._reflectivityTexture.animations && this._reflectivityTexture.animations.length > 0) {
            results.push(this._reflectivityTexture);
        }
        if (this._bumpTexture && this._bumpTexture.animations && this._bumpTexture.animations.length > 0) {
            results.push(this._bumpTexture);
        }
        if (this._lightmapTexture && this._lightmapTexture.animations && this._lightmapTexture.animations.length > 0) {
            results.push(this._lightmapTexture);
        }
        this.detailMap.getAnimatables(results);
        this.subSurface.getAnimatables(results);
        this.clearCoat.getAnimatables(results);
        this.sheen.getAnimatables(results);
        this.anisotropy.getAnimatables(results);
        return results;
    };
    /**
     * Returns the texture used for reflections.
     * @returns - Reflection texture if present.  Otherwise, returns the environment texture.
     */
    PBRBaseMaterial.prototype._getReflectionTexture = function () {
        if (this._reflectionTexture) {
            return this._reflectionTexture;
        }
        return this.getScene().environmentTexture;
    };
    /**
     * Returns an array of the actively used textures.
     * @returns - Array of BaseTextures
     */
    PBRBaseMaterial.prototype.getActiveTextures = function () {
        var activeTextures = _super.prototype.getActiveTextures.call(this);
        if (this._albedoTexture) {
            activeTextures.push(this._albedoTexture);
        }
        if (this._ambientTexture) {
            activeTextures.push(this._ambientTexture);
        }
        if (this._opacityTexture) {
            activeTextures.push(this._opacityTexture);
        }
        if (this._reflectionTexture) {
            activeTextures.push(this._reflectionTexture);
        }
        if (this._emissiveTexture) {
            activeTextures.push(this._emissiveTexture);
        }
        if (this._reflectivityTexture) {
            activeTextures.push(this._reflectivityTexture);
        }
        if (this._metallicTexture) {
            activeTextures.push(this._metallicTexture);
        }
        if (this._metallicReflectanceTexture) {
            activeTextures.push(this._metallicReflectanceTexture);
        }
        if (this._microSurfaceTexture) {
            activeTextures.push(this._microSurfaceTexture);
        }
        if (this._bumpTexture) {
            activeTextures.push(this._bumpTexture);
        }
        if (this._lightmapTexture) {
            activeTextures.push(this._lightmapTexture);
        }
        this.detailMap.getActiveTextures(activeTextures);
        this.subSurface.getActiveTextures(activeTextures);
        this.clearCoat.getActiveTextures(activeTextures);
        this.sheen.getActiveTextures(activeTextures);
        this.anisotropy.getActiveTextures(activeTextures);
        return activeTextures;
    };
    /**
     * Checks to see if a texture is used in the material.
     * @param texture - Base texture to use.
     * @returns - Boolean specifying if a texture is used in the material.
     */
    PBRBaseMaterial.prototype.hasTexture = function (texture) {
        if (_super.prototype.hasTexture.call(this, texture)) {
            return true;
        }
        if (this._albedoTexture === texture) {
            return true;
        }
        if (this._ambientTexture === texture) {
            return true;
        }
        if (this._opacityTexture === texture) {
            return true;
        }
        if (this._reflectionTexture === texture) {
            return true;
        }
        if (this._reflectivityTexture === texture) {
            return true;
        }
        if (this._metallicTexture === texture) {
            return true;
        }
        if (this._metallicReflectanceTexture === texture) {
            return true;
        }
        if (this._microSurfaceTexture === texture) {
            return true;
        }
        if (this._bumpTexture === texture) {
            return true;
        }
        if (this._lightmapTexture === texture) {
            return true;
        }
        return this.detailMap.hasTexture(texture) ||
            this.subSurface.hasTexture(texture) ||
            this.clearCoat.hasTexture(texture) ||
            this.sheen.hasTexture(texture) ||
            this.anisotropy.hasTexture(texture);
    };
    /**
     * Sets the required values to the prepass renderer.
     * @param prePassRenderer defines the prepass renderer to setup
     */
    PBRBaseMaterial.prototype.setPrePassRenderer = function (prePassRenderer) {
        if (this.subSurface.isScatteringEnabled) {
            var subSurfaceConfiguration = this.getScene().enableSubSurfaceForPrePass();
            if (subSurfaceConfiguration) {
                subSurfaceConfiguration.enabled = true;
            }
            return true;
        }
        return false;
    };
    /**
     * Disposes the resources of the material.
     * @param forceDisposeEffect - Forces the disposal of effects.
     * @param forceDisposeTextures - Forces the disposal of all textures.
     */
    PBRBaseMaterial.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (forceDisposeTextures) {
            if (this._environmentBRDFTexture && this.getScene().environmentBRDFTexture !== this._environmentBRDFTexture) {
                this._environmentBRDFTexture.dispose();
            }
            (_a = this._albedoTexture) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this._ambientTexture) === null || _b === void 0 ? void 0 : _b.dispose();
            (_c = this._opacityTexture) === null || _c === void 0 ? void 0 : _c.dispose();
            (_d = this._reflectionTexture) === null || _d === void 0 ? void 0 : _d.dispose();
            (_e = this._emissiveTexture) === null || _e === void 0 ? void 0 : _e.dispose();
            (_f = this._metallicTexture) === null || _f === void 0 ? void 0 : _f.dispose();
            (_g = this._reflectivityTexture) === null || _g === void 0 ? void 0 : _g.dispose();
            (_h = this._bumpTexture) === null || _h === void 0 ? void 0 : _h.dispose();
            (_j = this._lightmapTexture) === null || _j === void 0 ? void 0 : _j.dispose();
            (_k = this._metallicReflectanceTexture) === null || _k === void 0 ? void 0 : _k.dispose();
            (_l = this._microSurfaceTexture) === null || _l === void 0 ? void 0 : _l.dispose();
        }
        this.detailMap.dispose(forceDisposeTextures);
        this.subSurface.dispose(forceDisposeTextures);
        this.clearCoat.dispose(forceDisposeTextures);
        this.sheen.dispose(forceDisposeTextures);
        this.anisotropy.dispose(forceDisposeTextures);
        this._renderTargets.dispose();
        if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
            this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
        }
        _super.prototype.dispose.call(this, forceDisposeEffect, forceDisposeTextures);
    };
    /**
     * PBRMaterialTransparencyMode: No transparency mode, Alpha channel is not use.
     */
    PBRBaseMaterial.PBRMATERIAL_OPAQUE = Material.MATERIAL_OPAQUE;
    /**
     * PBRMaterialTransparencyMode: Alpha Test mode, pixel are discarded below a certain threshold defined by the alpha cutoff value.
     */
    PBRBaseMaterial.PBRMATERIAL_ALPHATEST = Material.MATERIAL_ALPHATEST;
    /**
     * PBRMaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
     */
    PBRBaseMaterial.PBRMATERIAL_ALPHABLEND = Material.MATERIAL_ALPHABLEND;
    /**
     * PBRMaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
     * They are also discarded below the alpha cutoff threshold to improve performances.
     */
    PBRBaseMaterial.PBRMATERIAL_ALPHATESTANDBLEND = Material.MATERIAL_ALPHATESTANDBLEND;
    /**
     * Defines the default value of how much AO map is occluding the analytical lights
     * (point spot...).
     */
    PBRBaseMaterial.DEFAULT_AO_ON_ANALYTICAL_LIGHTS = 0;
    /**
     * PBRMaterialLightFalloff Physical: light is falling off following the inverse squared distance law.
     */
    PBRBaseMaterial.LIGHTFALLOFF_PHYSICAL = 0;
    /**
     * PBRMaterialLightFalloff gltf: light is falling off as described in the gltf moving to PBR document
     * to enhance interoperability with other engines.
     */
    PBRBaseMaterial.LIGHTFALLOFF_GLTF = 1;
    /**
     * PBRMaterialLightFalloff Standard: light is falling off like in the standard material
     * to enhance interoperability with other materials.
     */
    PBRBaseMaterial.LIGHTFALLOFF_STANDARD = 2;
    __decorate([
        serializeAsImageProcessingConfiguration()
    ], PBRBaseMaterial.prototype, "_imageProcessingConfiguration", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsMiscDirty")
    ], PBRBaseMaterial.prototype, "debugMode", void 0);
    __decorate([
        serialize()
    ], PBRBaseMaterial.prototype, "useLogarithmicDepth", null);
    return PBRBaseMaterial;
}(PushMaterial));

/**
 * The Physically based material of BJS.
 *
 * This offers the main features of a standard PBR material.
 * For more information, please refer to the documentation :
 * https://doc.babylonjs.com/how_to/physically_based_rendering
 */
var PBRMaterial = /** @class */ (function (_super) {
    __extends(PBRMaterial, _super);
    /**
     * Instantiates a new PBRMaterial instance.
     *
     * @param name The material name
     * @param scene The scene the material will be use in.
     */
    function PBRMaterial(name, scene) {
        var _this = _super.call(this, name, scene) || this;
        /**
         * Intensity of the direct lights e.g. the four lights available in your scene.
         * This impacts both the direct diffuse and specular highlights.
         */
        _this.directIntensity = 1.0;
        /**
         * Intensity of the emissive part of the material.
         * This helps controlling the emissive effect without modifying the emissive color.
         */
        _this.emissiveIntensity = 1.0;
        /**
         * Intensity of the environment e.g. how much the environment will light the object
         * either through harmonics for rough material or through the refelction for shiny ones.
         */
        _this.environmentIntensity = 1.0;
        /**
         * This is a special control allowing the reduction of the specular highlights coming from the
         * four lights of the scene. Those highlights may not be needed in full environment lighting.
         */
        _this.specularIntensity = 1.0;
        /**
         * Debug Control allowing disabling the bump map on this material.
         */
        _this.disableBumpMap = false;
        /**
         * AKA Occlusion Texture Intensity in other nomenclature.
         */
        _this.ambientTextureStrength = 1.0;
        /**
         * Defines how much the AO map is occluding the analytical lights (point spot...).
         * 1 means it completely occludes it
         * 0 mean it has no impact
         */
        _this.ambientTextureImpactOnAnalyticalLights = PBRMaterial.DEFAULT_AO_ON_ANALYTICAL_LIGHTS;
        /**
         * In metallic workflow, specifies an F0 factor to help configuring the material F0.
         * By default the indexOfrefraction is used to compute F0;
         *
         * This is used as a factor against the default reflectance at normal incidence to tweak it.
         *
         * F0 = defaultF0 * metallicF0Factor * metallicReflectanceColor;
         * F90 = metallicReflectanceColor;
         */
        _this.metallicF0Factor = 1;
        /**
         * In metallic workflow, specifies an F90 color to help configuring the material F90.
         * By default the F90 is always 1;
         *
         * Please note that this factor is also used as a factor against the default reflectance at normal incidence.
         *
         * F0 = defaultF0 * metallicF0Factor * metallicReflectanceColor
         * F90 = metallicReflectanceColor;
         */
        _this.metallicReflectanceColor = Color3.White();
        /**
         * The color of a material in ambient lighting.
         */
        _this.ambientColor = new Color3(0, 0, 0);
        /**
         * AKA Diffuse Color in other nomenclature.
         */
        _this.albedoColor = new Color3(1, 1, 1);
        /**
         * AKA Specular Color in other nomenclature.
         */
        _this.reflectivityColor = new Color3(1, 1, 1);
        /**
         * The color reflected from the material.
         */
        _this.reflectionColor = new Color3(1.0, 1.0, 1.0);
        /**
         * The color emitted from the material.
         */
        _this.emissiveColor = new Color3(0, 0, 0);
        /**
         * AKA Glossiness in other nomenclature.
         */
        _this.microSurface = 1.0;
        /**
         * If true, the light map contains occlusion information instead of lighting info.
         */
        _this.useLightmapAsShadowmap = false;
        /**
         * Specifies that the alpha is coming form the albedo channel alpha channel for alpha blending.
         */
        _this.useAlphaFromAlbedoTexture = false;
        /**
         * Enforces alpha test in opaque or blend mode in order to improve the performances of some situations.
         */
        _this.forceAlphaTest = false;
        /**
         * Defines the alpha limits in alpha test mode.
         */
        _this.alphaCutOff = 0.4;
        /**
         * Specifies that the material will keep the specular highlights over a transparent surface (only the most limunous ones).
         * A car glass is a good exemple of that. When sun reflects on it you can not see what is behind.
         */
        _this.useSpecularOverAlpha = true;
        /**
         * Specifies if the reflectivity texture contains the glossiness information in its alpha channel.
         */
        _this.useMicroSurfaceFromReflectivityMapAlpha = false;
        /**
         * Specifies if the metallic texture contains the roughness information in its alpha channel.
         */
        _this.useRoughnessFromMetallicTextureAlpha = true;
        /**
         * Specifies if the metallic texture contains the roughness information in its green channel.
         */
        _this.useRoughnessFromMetallicTextureGreen = false;
        /**
         * Specifies if the metallic texture contains the metallness information in its blue channel.
         */
        _this.useMetallnessFromMetallicTextureBlue = false;
        /**
         * Specifies if the metallic texture contains the ambient occlusion information in its red channel.
         */
        _this.useAmbientOcclusionFromMetallicTextureRed = false;
        /**
         * Specifies if the ambient texture contains the ambient occlusion information in its red channel only.
         */
        _this.useAmbientInGrayScale = false;
        /**
         * In case the reflectivity map does not contain the microsurface information in its alpha channel,
         * The material will try to infer what glossiness each pixel should be.
         */
        _this.useAutoMicroSurfaceFromReflectivityMap = false;
        /**
         * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most limunous ones).
         * A car glass is a good exemple of that. When the street lights reflects on it you can not see what is behind.
         */
        _this.useRadianceOverAlpha = true;
        /**
         * Allows using an object space normal map (instead of tangent space).
         */
        _this.useObjectSpaceNormalMap = false;
        /**
         * Allows using the bump map in parallax mode.
         */
        _this.useParallax = false;
        /**
         * Allows using the bump map in parallax occlusion mode.
         */
        _this.useParallaxOcclusion = false;
        /**
         * Controls the scale bias of the parallax mode.
         */
        _this.parallaxScaleBias = 0.05;
        /**
         * If sets to true, disables all the lights affecting the material.
         */
        _this.disableLighting = false;
        /**
         * Force the shader to compute irradiance in the fragment shader in order to take bump in account.
         */
        _this.forceIrradianceInFragment = false;
        /**
         * Number of Simultaneous lights allowed on the material.
         */
        _this.maxSimultaneousLights = 4;
        /**
         * If sets to true, x component of normal map value will invert (x = 1.0 - x).
         */
        _this.invertNormalMapX = false;
        /**
         * If sets to true, y component of normal map value will invert (y = 1.0 - y).
         */
        _this.invertNormalMapY = false;
        /**
         * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
         */
        _this.twoSidedLighting = false;
        /**
         * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
         * And/Or occlude the blended part. (alpha is converted to gamma to compute the fresnel)
         */
        _this.useAlphaFresnel = false;
        /**
         * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
         * And/Or occlude the blended part. (alpha stays linear to compute the fresnel)
         */
        _this.useLinearAlphaFresnel = false;
        /**
         * Let user defines the brdf lookup texture used for IBL.
         * A default 8bit version is embedded but you could point at :
         * * Default texture: https://assets.babylonjs.com/environments/correlatedMSBRDF_RGBD.png
         * * Default 16bit pixel depth texture: https://assets.babylonjs.com/environments/correlatedMSBRDF.dds
         * * LEGACY Default None correlated https://assets.babylonjs.com/environments/uncorrelatedBRDF_RGBD.png
         * * LEGACY Default None correlated 16bit pixel depth https://assets.babylonjs.com/environments/uncorrelatedBRDF.dds
         */
        _this.environmentBRDFTexture = null;
        /**
         * Force normal to face away from face.
         */
        _this.forceNormalForward = false;
        /**
         * Enables specular anti aliasing in the PBR shader.
         * It will both interacts on the Geometry for analytical and IBL lighting.
         * It also prefilter the roughness map based on the bump values.
         */
        _this.enableSpecularAntiAliasing = false;
        /**
         * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
         * makes the reflect vector face the model (under horizon).
         */
        _this.useHorizonOcclusion = true;
        /**
         * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
         * too much the area relying on ambient texture to define their ambient occlusion.
         */
        _this.useRadianceOcclusion = true;
        /**
         * If set to true, no lighting calculations will be applied.
         */
        _this.unlit = false;
        _this._environmentBRDFTexture = BRDFTextureTools.GetEnvironmentBRDFTexture(scene);
        return _this;
    }
    Object.defineProperty(PBRMaterial.prototype, "refractionTexture", {
        /**
         * Stores the refracted light information in a texture.
         */
        get: function () {
            return this.subSurface.refractionTexture;
        },
        set: function (value) {
            this.subSurface.refractionTexture = value;
            if (value) {
                this.subSurface.isRefractionEnabled = true;
            }
            else if (!this.subSurface.linkRefractionWithTransparency) {
                this.subSurface.isRefractionEnabled = false;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "indexOfRefraction", {
        /**
         * Index of refraction of the material base layer.
         * https://en.wikipedia.org/wiki/List_of_refractive_indices
         *
         * This does not only impact refraction but also the Base F0 of Dielectric Materials.
         *
         * From dielectric fresnel rules: F0 = square((iorT - iorI) / (iorT + iorI))
         */
        get: function () {
            return this.subSurface.indexOfRefraction;
        },
        set: function (value) {
            this.subSurface.indexOfRefraction = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "invertRefractionY", {
        /**
         * Controls if refraction needs to be inverted on Y. This could be useful for procedural texture.
         */
        get: function () {
            return this.subSurface.invertRefractionY;
        },
        set: function (value) {
            this.subSurface.invertRefractionY = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "linkRefractionWithTransparency", {
        /**
         * This parameters will make the material used its opacity to control how much it is refracting aginst not.
         * Materials half opaque for instance using refraction could benefit from this control.
         */
        get: function () {
            return this.subSurface.linkRefractionWithTransparency;
        },
        set: function (value) {
            this.subSurface.linkRefractionWithTransparency = value;
            if (value) {
                this.subSurface.isRefractionEnabled = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "usePhysicalLightFalloff", {
        /**
         * BJS is using an harcoded light falloff based on a manually sets up range.
         * In PBR, one way to represents the fallof is to use the inverse squared root algorythm.
         * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
         */
        get: function () {
            return this._lightFalloff === PBRBaseMaterial.LIGHTFALLOFF_PHYSICAL;
        },
        /**
         * BJS is using an harcoded light falloff based on a manually sets up range.
         * In PBR, one way to represents the fallof is to use the inverse squared root algorythm.
         * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
         */
        set: function (value) {
            if (value !== this.usePhysicalLightFalloff) {
                // Ensure the effect will be rebuilt.
                this._markAllSubMeshesAsTexturesDirty();
                if (value) {
                    this._lightFalloff = PBRBaseMaterial.LIGHTFALLOFF_PHYSICAL;
                }
                else {
                    this._lightFalloff = PBRBaseMaterial.LIGHTFALLOFF_STANDARD;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "useGLTFLightFalloff", {
        /**
         * In order to support the falloff compatibility with gltf, a special mode has been added
         * to reproduce the gltf light falloff.
         */
        get: function () {
            return this._lightFalloff === PBRBaseMaterial.LIGHTFALLOFF_GLTF;
        },
        /**
         * In order to support the falloff compatibility with gltf, a special mode has been added
         * to reproduce the gltf light falloff.
         */
        set: function (value) {
            if (value !== this.useGLTFLightFalloff) {
                // Ensure the effect will be rebuilt.
                this._markAllSubMeshesAsTexturesDirty();
                if (value) {
                    this._lightFalloff = PBRBaseMaterial.LIGHTFALLOFF_GLTF;
                }
                else {
                    this._lightFalloff = PBRBaseMaterial.LIGHTFALLOFF_STANDARD;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "imageProcessingConfiguration", {
        /**
         * Gets the image processing configuration used either in this material.
         */
        get: function () {
            return this._imageProcessingConfiguration;
        },
        /**
         * Sets the Default image processing configuration used either in the this material.
         *
         * If sets to null, the scene one is in use.
         */
        set: function (value) {
            this._attachImageProcessingConfiguration(value);
            // Ensure the effect will be rebuilt.
            this._markAllSubMeshesAsTexturesDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "cameraColorCurvesEnabled", {
        /**
         * Gets wether the color curves effect is enabled.
         */
        get: function () {
            return this.imageProcessingConfiguration.colorCurvesEnabled;
        },
        /**
         * Sets wether the color curves effect is enabled.
         */
        set: function (value) {
            this.imageProcessingConfiguration.colorCurvesEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "cameraColorGradingEnabled", {
        /**
         * Gets wether the color grading effect is enabled.
         */
        get: function () {
            return this.imageProcessingConfiguration.colorGradingEnabled;
        },
        /**
         * Gets wether the color grading effect is enabled.
         */
        set: function (value) {
            this.imageProcessingConfiguration.colorGradingEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "cameraToneMappingEnabled", {
        /**
         * Gets wether tonemapping is enabled or not.
         */
        get: function () {
            return this._imageProcessingConfiguration.toneMappingEnabled;
        },
        /**
         * Sets wether tonemapping is enabled or not
         */
        set: function (value) {
            this._imageProcessingConfiguration.toneMappingEnabled = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "cameraExposure", {
        /**
         * The camera exposure used on this material.
         * This property is here and not in the camera to allow controlling exposure without full screen post process.
         * This corresponds to a photographic exposure.
         */
        get: function () {
            return this._imageProcessingConfiguration.exposure;
        },
        /**
         * The camera exposure used on this material.
         * This property is here and not in the camera to allow controlling exposure without full screen post process.
         * This corresponds to a photographic exposure.
         */
        set: function (value) {
            this._imageProcessingConfiguration.exposure = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "cameraContrast", {
        /**
         * Gets The camera contrast used on this material.
         */
        get: function () {
            return this._imageProcessingConfiguration.contrast;
        },
        /**
         * Sets The camera contrast used on this material.
         */
        set: function (value) {
            this._imageProcessingConfiguration.contrast = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "cameraColorGradingTexture", {
        /**
         * Gets the Color Grading 2D Lookup Texture.
         */
        get: function () {
            return this._imageProcessingConfiguration.colorGradingTexture;
        },
        /**
         * Sets the Color Grading 2D Lookup Texture.
         */
        set: function (value) {
            this._imageProcessingConfiguration.colorGradingTexture = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PBRMaterial.prototype, "cameraColorCurves", {
        /**
         * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
         * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
         * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
         * corresponding to low luminance, medium luminance, and high luminance areas respectively.
         */
        get: function () {
            return this._imageProcessingConfiguration.colorCurves;
        },
        /**
         * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
         * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
         * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
         * corresponding to low luminance, medium luminance, and high luminance areas respectively.
         */
        set: function (value) {
            this._imageProcessingConfiguration.colorCurves = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the name of this material class.
     */
    PBRMaterial.prototype.getClassName = function () {
        return "PBRMaterial";
    };
    /**
     * Makes a duplicate of the current material.
     * @param name - name to use for the new material.
     */
    PBRMaterial.prototype.clone = function (name) {
        var _this = this;
        var clone = SerializationHelper.Clone(function () { return new PBRMaterial(name, _this.getScene()); }, this);
        clone.id = name;
        clone.name = name;
        this.clearCoat.copyTo(clone.clearCoat);
        this.anisotropy.copyTo(clone.anisotropy);
        this.brdf.copyTo(clone.brdf);
        this.sheen.copyTo(clone.sheen);
        this.subSurface.copyTo(clone.subSurface);
        return clone;
    };
    /**
     * Serializes this PBR Material.
     * @returns - An object with the serialized material.
     */
    PBRMaterial.prototype.serialize = function () {
        var serializationObject = SerializationHelper.Serialize(this);
        serializationObject.customType = "BABYLON.PBRMaterial";
        serializationObject.clearCoat = this.clearCoat.serialize();
        serializationObject.anisotropy = this.anisotropy.serialize();
        serializationObject.brdf = this.brdf.serialize();
        serializationObject.sheen = this.sheen.serialize();
        serializationObject.subSurface = this.subSurface.serialize();
        return serializationObject;
    };
    // Statics
    /**
     * Parses a PBR Material from a serialized object.
     * @param source - Serialized object.
     * @param scene - BJS scene instance.
     * @param rootUrl - url for the scene object
     * @returns - PBRMaterial
     */
    PBRMaterial.Parse = function (source, scene, rootUrl) {
        var material = SerializationHelper.Parse(function () { return new PBRMaterial(source.name, scene); }, source, scene, rootUrl);
        if (source.clearCoat) {
            material.clearCoat.parse(source.clearCoat, scene, rootUrl);
        }
        if (source.anisotropy) {
            material.anisotropy.parse(source.anisotropy, scene, rootUrl);
        }
        if (source.brdf) {
            material.brdf.parse(source.brdf, scene, rootUrl);
        }
        if (source.sheen) {
            material.sheen.parse(source.sheen, scene, rootUrl);
        }
        if (source.subSurface) {
            material.subSurface.parse(source.subSurface, scene, rootUrl);
        }
        return material;
    };
    /**
     * PBRMaterialTransparencyMode: No transparency mode, Alpha channel is not use.
     */
    PBRMaterial.PBRMATERIAL_OPAQUE = PBRBaseMaterial.PBRMATERIAL_OPAQUE;
    /**
     * PBRMaterialTransparencyMode: Alpha Test mode, pixel are discarded below a certain threshold defined by the alpha cutoff value.
     */
    PBRMaterial.PBRMATERIAL_ALPHATEST = PBRBaseMaterial.PBRMATERIAL_ALPHATEST;
    /**
     * PBRMaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
     */
    PBRMaterial.PBRMATERIAL_ALPHABLEND = PBRBaseMaterial.PBRMATERIAL_ALPHABLEND;
    /**
     * PBRMaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
     * They are also discarded below the alpha cutoff threshold to improve performances.
     */
    PBRMaterial.PBRMATERIAL_ALPHATESTANDBLEND = PBRBaseMaterial.PBRMATERIAL_ALPHATESTANDBLEND;
    /**
     * Defines the default value of how much AO map is occluding the analytical lights
     * (point spot...).
     */
    PBRMaterial.DEFAULT_AO_ON_ANALYTICAL_LIGHTS = PBRBaseMaterial.DEFAULT_AO_ON_ANALYTICAL_LIGHTS;
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "directIntensity", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "emissiveIntensity", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "environmentIntensity", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "specularIntensity", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "disableBumpMap", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "albedoTexture", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "ambientTexture", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "ambientTextureStrength", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "ambientTextureImpactOnAnalyticalLights", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
    ], PBRMaterial.prototype, "opacityTexture", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "reflectionTexture", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "emissiveTexture", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "reflectivityTexture", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "metallicTexture", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "metallic", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "roughness", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "metallicF0Factor", void 0);
    __decorate([
        serializeAsColor3(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "metallicReflectanceColor", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "metallicReflectanceTexture", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "microSurfaceTexture", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "bumpTexture", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty", null)
    ], PBRMaterial.prototype, "lightmapTexture", void 0);
    __decorate([
        serializeAsColor3("ambient"),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "ambientColor", void 0);
    __decorate([
        serializeAsColor3("albedo"),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "albedoColor", void 0);
    __decorate([
        serializeAsColor3("reflectivity"),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "reflectivityColor", void 0);
    __decorate([
        serializeAsColor3("reflection"),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "reflectionColor", void 0);
    __decorate([
        serializeAsColor3("emissive"),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "emissiveColor", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "microSurface", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useLightmapAsShadowmap", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
    ], PBRMaterial.prototype, "useAlphaFromAlbedoTexture", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
    ], PBRMaterial.prototype, "forceAlphaTest", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
    ], PBRMaterial.prototype, "alphaCutOff", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useSpecularOverAlpha", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useMicroSurfaceFromReflectivityMapAlpha", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useRoughnessFromMetallicTextureAlpha", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useRoughnessFromMetallicTextureGreen", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useMetallnessFromMetallicTextureBlue", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useAmbientOcclusionFromMetallicTextureRed", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useAmbientInGrayScale", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useAutoMicroSurfaceFromReflectivityMap", void 0);
    __decorate([
        serialize()
    ], PBRMaterial.prototype, "usePhysicalLightFalloff", null);
    __decorate([
        serialize()
    ], PBRMaterial.prototype, "useGLTFLightFalloff", null);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useRadianceOverAlpha", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useObjectSpaceNormalMap", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useParallax", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useParallaxOcclusion", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "parallaxScaleBias", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsLightsDirty")
    ], PBRMaterial.prototype, "disableLighting", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "forceIrradianceInFragment", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsLightsDirty")
    ], PBRMaterial.prototype, "maxSimultaneousLights", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "invertNormalMapX", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "invertNormalMapY", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "twoSidedLighting", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useAlphaFresnel", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useLinearAlphaFresnel", void 0);
    __decorate([
        serializeAsTexture(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "environmentBRDFTexture", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "forceNormalForward", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "enableSpecularAntiAliasing", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useHorizonOcclusion", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], PBRMaterial.prototype, "useRadianceOcclusion", void 0);
    __decorate([
        serialize(),
        expandToProperty("_markAllSubMeshesAsMiscDirty")
    ], PBRMaterial.prototype, "unlit", void 0);
    return PBRMaterial;
}(PBRBaseMaterial));
_TypeStore.RegisteredTypes["BABYLON.PBRMaterial"] = PBRMaterial;

/**
 * Helper class to push actions to a pool of workers.
 */
var WorkerPool = /** @class */ (function () {
    /**
     * Constructor
     * @param workers Array of workers to use for actions
     */
    function WorkerPool(workers) {
        this._pendingActions = new Array();
        this._workerInfos = workers.map(function (worker) { return ({
            worker: worker,
            active: false
        }); });
    }
    /**
     * Terminates all workers and clears any pending actions.
     */
    WorkerPool.prototype.dispose = function () {
        for (var _i = 0, _a = this._workerInfos; _i < _a.length; _i++) {
            var workerInfo = _a[_i];
            workerInfo.worker.terminate();
        }
        this._workerInfos = [];
        this._pendingActions = [];
    };
    /**
     * Pushes an action to the worker pool. If all the workers are active, the action will be
     * pended until a worker has completed its action.
     * @param action The action to perform. Call onComplete when the action is complete.
     */
    WorkerPool.prototype.push = function (action) {
        for (var _i = 0, _a = this._workerInfos; _i < _a.length; _i++) {
            var workerInfo = _a[_i];
            if (!workerInfo.active) {
                this._execute(workerInfo, action);
                return;
            }
        }
        this._pendingActions.push(action);
    };
    WorkerPool.prototype._execute = function (workerInfo, action) {
        var _this = this;
        workerInfo.active = true;
        action(workerInfo.worker, function () {
            workerInfo.active = false;
            var nextAction = _this._pendingActions.shift();
            if (nextAction) {
                _this._execute(workerInfo, nextAction);
            }
        });
    };
    return WorkerPool;
}());

Node.AddNodeConstructor("Light_Type_0", function (name, scene) {
    return function () { return new PointLight(name, Vector3.Zero(), scene); };
});
/**
 * A point light is a light defined by an unique point in world space.
 * The light is emitted in every direction from this point.
 * A good example of a point light is a standard light bulb.
 * Documentation: https://doc.babylonjs.com/babylon101/lights
 */
var PointLight = /** @class */ (function (_super) {
    __extends(PointLight, _super);
    /**
     * Creates a PointLight object from the passed name and position (Vector3) and adds it in the scene.
     * A PointLight emits the light in every direction.
     * It can cast shadows.
     * If the scene camera is already defined and you want to set your PointLight at the camera position, just set it :
     * ```javascript
     * var pointLight = new PointLight("pl", camera.position, scene);
     * ```
     * Documentation : https://doc.babylonjs.com/babylon101/lights
     * @param name The light friendly name
     * @param position The position of the point light in the scene
     * @param scene The scene the lights belongs to
     */
    function PointLight(name, position, scene) {
        var _this = _super.call(this, name, scene) || this;
        _this._shadowAngle = Math.PI / 2;
        _this.position = position;
        return _this;
    }
    Object.defineProperty(PointLight.prototype, "shadowAngle", {
        /**
         * Getter: In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
         * This specifies what angle the shadow will use to be created.
         *
         * It default to 90 degrees to work nicely with the cube texture generation for point lights shadow maps.
         */
        get: function () {
            return this._shadowAngle;
        },
        /**
         * Setter: In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
         * This specifies what angle the shadow will use to be created.
         *
         * It default to 90 degrees to work nicely with the cube texture generation for point lights shadow maps.
         */
        set: function (value) {
            this._shadowAngle = value;
            this.forceProjectionMatrixCompute();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PointLight.prototype, "direction", {
        /**
         * Gets the direction if it has been set.
         * In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
         */
        get: function () {
            return this._direction;
        },
        /**
         * In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
         */
        set: function (value) {
            var previousNeedCube = this.needCube();
            this._direction = value;
            if (this.needCube() !== previousNeedCube && this._shadowGenerator) {
                this._shadowGenerator.recreateShadowMap();
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the string "PointLight"
     * @returns the class name
     */
    PointLight.prototype.getClassName = function () {
        return "PointLight";
    };
    /**
     * Returns the integer 0.
     * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
     */
    PointLight.prototype.getTypeID = function () {
        return Light.LIGHTTYPEID_POINTLIGHT;
    };
    /**
     * Specifies wether or not the shadowmap should be a cube texture.
     * @returns true if the shadowmap needs to be a cube texture.
     */
    PointLight.prototype.needCube = function () {
        return !this.direction;
    };
    /**
     * Returns a new Vector3 aligned with the PointLight cube system according to the passed cube face index (integer).
     * @param faceIndex The index of the face we are computed the direction to generate shadow
     * @returns The set direction in 2d mode otherwise the direction to the cubemap face if needCube() is true
     */
    PointLight.prototype.getShadowDirection = function (faceIndex) {
        if (this.direction) {
            return _super.prototype.getShadowDirection.call(this, faceIndex);
        }
        else {
            switch (faceIndex) {
                case 0:
                    return new Vector3(1.0, 0.0, 0.0);
                case 1:
                    return new Vector3(-1.0, 0.0, 0.0);
                case 2:
                    return new Vector3(0.0, -1.0, 0.0);
                case 3:
                    return new Vector3(0.0, 1.0, 0.0);
                case 4:
                    return new Vector3(0.0, 0.0, 1.0);
                case 5:
                    return new Vector3(0.0, 0.0, -1.0);
            }
        }
        return Vector3.Zero();
    };
    /**
     * Sets the passed matrix "matrix" as a left-handed perspective projection matrix with the following settings :
     * - fov = PI / 2
     * - aspect ratio : 1.0
     * - z-near and far equal to the active camera minZ and maxZ.
     * Returns the PointLight.
     */
    PointLight.prototype._setDefaultShadowProjectionMatrix = function (matrix, viewMatrix, renderList) {
        var activeCamera = this.getScene().activeCamera;
        if (!activeCamera) {
            return;
        }
        Matrix.PerspectiveFovLHToRef(this.shadowAngle, 1.0, this.getDepthMinZ(activeCamera), this.getDepthMaxZ(activeCamera), matrix);
    };
    PointLight.prototype._buildUniformLayout = function () {
        this._uniformBuffer.addUniform("vLightData", 4);
        this._uniformBuffer.addUniform("vLightDiffuse", 4);
        this._uniformBuffer.addUniform("vLightSpecular", 4);
        this._uniformBuffer.addUniform("vLightFalloff", 4);
        this._uniformBuffer.addUniform("shadowsInfo", 3);
        this._uniformBuffer.addUniform("depthValues", 2);
        this._uniformBuffer.create();
    };
    /**
     * Sets the passed Effect "effect" with the PointLight transformed position (or position, if none) and passed name (string).
     * @param effect The effect to update
     * @param lightIndex The index of the light in the effect to update
     * @returns The point light
     */
    PointLight.prototype.transferToEffect = function (effect, lightIndex) {
        if (this.computeTransformedInformation()) {
            this._uniformBuffer.updateFloat4("vLightData", this.transformedPosition.x, this.transformedPosition.y, this.transformedPosition.z, 0.0, lightIndex);
        }
        else {
            this._uniformBuffer.updateFloat4("vLightData", this.position.x, this.position.y, this.position.z, 0, lightIndex);
        }
        this._uniformBuffer.updateFloat4("vLightFalloff", this.range, this._inverseSquaredRange, 0, 0, lightIndex);
        return this;
    };
    PointLight.prototype.transferToNodeMaterialEffect = function (effect, lightDataUniformName) {
        if (this.computeTransformedInformation()) {
            effect.setFloat3(lightDataUniformName, this.transformedPosition.x, this.transformedPosition.y, this.transformedPosition.z);
        }
        else {
            effect.setFloat3(lightDataUniformName, this.position.x, this.position.y, this.position.z);
        }
        return this;
    };
    /**
     * Prepares the list of defines specific to the light type.
     * @param defines the list of defines
     * @param lightIndex defines the index of the light for the effect
     */
    PointLight.prototype.prepareLightSpecificDefines = function (defines, lightIndex) {
        defines["POINTLIGHT" + lightIndex] = true;
    };
    __decorate([
        serialize()
    ], PointLight.prototype, "shadowAngle", null);
    return PointLight;
}(ShadowLight));

/**
 * Raw cube texture where the raw buffers are passed in
 */
var RawCubeTexture = /** @class */ (function (_super) {
    __extends(RawCubeTexture, _super);
    /**
     * Creates a cube texture where the raw buffers are passed in.
     * @param scene defines the scene the texture is attached to
     * @param data defines the array of data to use to create each face
     * @param size defines the size of the textures
     * @param format defines the format of the data
     * @param type defines the type of the data (like Engine.TEXTURETYPE_UNSIGNED_INT)
     * @param generateMipMaps  defines if the engine should generate the mip levels
     * @param invertY defines if data must be stored with Y axis inverted
     * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
     * @param compression defines the compression used (null by default)
     */
    function RawCubeTexture(scene, data, size, format, type, generateMipMaps, invertY, samplingMode, compression) {
        if (format === void 0) { format = 5; }
        if (type === void 0) { type = 0; }
        if (generateMipMaps === void 0) { generateMipMaps = false; }
        if (invertY === void 0) { invertY = false; }
        if (samplingMode === void 0) { samplingMode = 3; }
        if (compression === void 0) { compression = null; }
        var _this = _super.call(this, "", scene) || this;
        _this._texture = scene.getEngine().createRawCubeTexture(data, size, format, type, generateMipMaps, invertY, samplingMode, compression);
        return _this;
    }
    /**
     * Updates the raw cube texture.
     * @param data defines the data to store
     * @param format defines the data format
     * @param type defines the type fo the data (Engine.TEXTURETYPE_UNSIGNED_INT by default)
     * @param invertY defines if data must be stored with Y axis inverted
     * @param compression defines the compression used (null by default)
     * @param level defines which level of the texture to update
     */
    RawCubeTexture.prototype.update = function (data, format, type, invertY, compression) {
        if (compression === void 0) { compression = null; }
        this._texture.getEngine().updateRawCubeTexture(this._texture, data, format, type, invertY, compression);
    };
    /**
     * Updates a raw cube texture with RGBD encoded data.
     * @param data defines the array of data [mipmap][face] to use to create each face
     * @param sphericalPolynomial defines the spherical polynomial for irradiance
     * @param lodScale defines the scale applied to environment texture. This manages the range of LOD level used for IBL according to the roughness
     * @param lodOffset defines the offset applied to environment texture. This manages first LOD level used for IBL according to the roughness
     * @returns a promsie that resolves when the operation is complete
     */
    RawCubeTexture.prototype.updateRGBDAsync = function (data, sphericalPolynomial, lodScale, lodOffset) {
        if (sphericalPolynomial === void 0) { sphericalPolynomial = null; }
        if (lodScale === void 0) { lodScale = 0.8; }
        if (lodOffset === void 0) { lodOffset = 0; }
        return RawCubeTexture._UpdateRGBDAsync(this._texture, data, sphericalPolynomial, lodScale, lodOffset);
    };
    /**
     * Clones the raw cube texture.
     * @return a new cube texture
     */
    RawCubeTexture.prototype.clone = function () {
        var _this = this;
        return SerializationHelper.Clone(function () {
            var scene = _this.getScene();
            var internalTexture = _this._texture;
            var texture = new RawCubeTexture(scene, internalTexture._bufferViewArray, internalTexture.width, internalTexture.format, internalTexture.type, internalTexture.generateMipMaps, internalTexture.invertY, internalTexture.samplingMode, internalTexture._compression);
            if (internalTexture.source === InternalTextureSource.CubeRawRGBD) {
                texture.updateRGBDAsync(internalTexture._bufferViewArrayArray, internalTexture._sphericalPolynomial, internalTexture._lodGenerationScale, internalTexture._lodGenerationOffset);
            }
            return texture;
        }, this);
    };
    /** @hidden */
    RawCubeTexture._UpdateRGBDAsync = function (internalTexture, data, sphericalPolynomial, lodScale, lodOffset) {
        internalTexture._source = InternalTextureSource.CubeRawRGBD;
        internalTexture._bufferViewArrayArray = data;
        internalTexture._lodGenerationScale = lodScale;
        internalTexture._lodGenerationOffset = lodOffset;
        internalTexture._sphericalPolynomial = sphericalPolynomial;
        return EnvironmentTextureTools.UploadLevelsAsync(internalTexture, data).then(function () {
            internalTexture.isReady = true;
        });
    };
    return RawCubeTexture;
}(CubeTexture));

function createDecoderAsync(wasmBinary) {
    return new Promise(function (resolve) {
        DracoDecoderModule({ wasmBinary: wasmBinary }).then(function (module) {
            resolve({ module: module });
        });
    });
}
function decodeMesh(decoderModule, dataView, attributes, onIndicesData, onAttributeData) {
    var buffer = new decoderModule.DecoderBuffer();
    buffer.Init(dataView, dataView.byteLength);
    var decoder = new decoderModule.Decoder();
    var geometry;
    var status;
    try {
        var type = decoder.GetEncodedGeometryType(buffer);
        switch (type) {
            case decoderModule.TRIANGULAR_MESH:
                geometry = new decoderModule.Mesh();
                status = decoder.DecodeBufferToMesh(buffer, geometry);
                break;
            case decoderModule.POINT_CLOUD:
                geometry = new decoderModule.PointCloud();
                status = decoder.DecodeBufferToPointCloud(buffer, geometry);
                break;
            default:
                throw new Error("Invalid geometry type " + type);
        }
        if (!status.ok() || !geometry.ptr) {
            throw new Error(status.error_msg());
        }
        if (type === decoderModule.TRIANGULAR_MESH) {
            var numFaces = geometry.num_faces();
            var numIndices = numFaces * 3;
            var byteLength = numIndices * 4;
            var ptr = decoderModule._malloc(byteLength);
            try {
                decoder.GetTrianglesUInt32Array(geometry, byteLength, ptr);
                var indices = new Uint32Array(numIndices);
                indices.set(new Uint32Array(decoderModule.HEAPF32.buffer, ptr, numIndices));
                onIndicesData(indices);
            }
            finally {
                decoderModule._free(ptr);
            }
        }
        var processAttribute = function (kind, attribute) {
            var numComponents = attribute.num_components();
            var numPoints = geometry.num_points();
            var numValues = numPoints * numComponents;
            var byteLength = numValues * Float32Array.BYTES_PER_ELEMENT;
            var ptr = decoderModule._malloc(byteLength);
            try {
                decoder.GetAttributeDataArrayForAllPoints(geometry, attribute, decoderModule.DT_FLOAT32, byteLength, ptr);
                var values = new Float32Array(decoderModule.HEAPF32.buffer, ptr, numValues);
                if (kind === "color" && numComponents === 3) {
                    var babylonData = new Float32Array(numPoints * 4);
                    for (var i = 0, j = 0; i < babylonData.length; i += 4, j += numComponents) {
                        babylonData[i + 0] = values[j + 0];
                        babylonData[i + 1] = values[j + 1];
                        babylonData[i + 2] = values[j + 2];
                        babylonData[i + 3] = 1;
                    }
                    onAttributeData(kind, babylonData);
                }
                else {
                    var babylonData = new Float32Array(numValues);
                    babylonData.set(new Float32Array(decoderModule.HEAPF32.buffer, ptr, numValues));
                    onAttributeData(kind, babylonData);
                }
            }
            finally {
                decoderModule._free(ptr);
            }
        };
        if (attributes) {
            for (var kind in attributes) {
                var id = attributes[kind];
                var attribute = decoder.GetAttributeByUniqueId(geometry, id);
                processAttribute(kind, attribute);
            }
        }
        else {
            var nativeAttributeTypes = {
                "position": "POSITION",
                "normal": "NORMAL",
                "color": "COLOR",
                "uv": "TEX_COORD"
            };
            for (var kind in nativeAttributeTypes) {
                var id = decoder.GetAttributeId(geometry, decoderModule[nativeAttributeTypes[kind]]);
                if (id !== -1) {
                    var attribute = decoder.GetAttribute(geometry, id);
                    processAttribute(kind, attribute);
                }
            }
        }
    }
    finally {
        if (geometry) {
            decoderModule.destroy(geometry);
        }
        decoderModule.destroy(decoder);
        decoderModule.destroy(buffer);
    }
}
/**
 * The worker function that gets converted to a blob url to pass into a worker.
 */
function worker() {
    var decoderPromise;
    onmessage = function (event) {
        var data = event.data;
        switch (data.id) {
            case "init": {
                var decoder = data.decoder;
                if (decoder.url) {
                    importScripts(decoder.url);
                    decoderPromise = DracoDecoderModule({ wasmBinary: decoder.wasmBinary });
                }
                postMessage("done");
                break;
            }
            case "decodeMesh": {
                if (!decoderPromise) {
                    throw new Error("Draco decoder module is not available");
                }
                decoderPromise.then(function (decoder) {
                    decodeMesh(decoder, data.dataView, data.attributes, function (indices) {
                        postMessage({ id: "indices", value: indices }, [indices.buffer]);
                    }, function (kind, data) {
                        postMessage({ id: kind, value: data }, [data.buffer]);
                    });
                    postMessage("done");
                });
                break;
            }
        }
    };
}
function getAbsoluteUrl(url) {
    if (typeof document !== "object" || typeof url !== "string") {
        return url;
    }
    return Tools.GetAbsoluteUrl(url);
}
/**
 * Draco compression (https://google.github.io/draco/)
 *
 * This class wraps the Draco module.
 *
 * **Encoder**
 *
 * The encoder is not currently implemented.
 *
 * **Decoder**
 *
 * By default, the configuration points to a copy of the Draco decoder files for glTF from the babylon.js preview cdn https://preview.babylonjs.com/draco_wasm_wrapper_gltf.js.
 *
 * To update the configuration, use the following code:
 * ```javascript
 *     DracoCompression.Configuration = {
 *         decoder: {
 *             wasmUrl: "<url to the WebAssembly library>",
 *             wasmBinaryUrl: "<url to the WebAssembly binary>",
 *             fallbackUrl: "<url to the fallback JavaScript library>",
 *         }
 *     };
 * ```
 *
 * Draco has two versions, one for WebAssembly and one for JavaScript. The decoder configuration can be set to only support Webssembly or only support the JavaScript version.
 * Decoding will automatically fallback to the JavaScript version if WebAssembly version is not configured or if WebAssembly is not supported by the browser.
 * Use `DracoCompression.DecoderAvailable` to determine if the decoder configuration is available for the current context.
 *
 * To decode Draco compressed data, get the default DracoCompression object and call decodeMeshAsync:
 * ```javascript
 *     var vertexData = await DracoCompression.Default.decodeMeshAsync(data);
 * ```
 *
 * @see https://www.babylonjs-playground.com/#N3EK4B#0
 */
var DracoCompression = /** @class */ (function () {
    /**
     * Constructor
     * @param numWorkers The number of workers for async operations. Specify `0` to disable web workers and run synchronously in the current context.
     */
    function DracoCompression(numWorkers) {
        if (numWorkers === void 0) { numWorkers = DracoCompression.DefaultNumWorkers; }
        var decoder = DracoCompression.Configuration.decoder;
        var decoderInfo = (decoder.wasmUrl && decoder.wasmBinaryUrl && typeof WebAssembly === "object") ? {
            url: decoder.wasmUrl,
            wasmBinaryPromise: Tools.LoadFileAsync(getAbsoluteUrl(decoder.wasmBinaryUrl))
        } : {
            url: decoder.fallbackUrl,
            wasmBinaryPromise: Promise.resolve(undefined)
        };
        if (numWorkers && typeof Worker === "function") {
            this._workerPoolPromise = decoderInfo.wasmBinaryPromise.then(function (decoderWasmBinary) {
                var workerContent = decodeMesh + "(" + worker + ")()";
                var workerBlobUrl = URL.createObjectURL(new Blob([workerContent], { type: "application/javascript" }));
                var workerPromises = new Array(numWorkers);
                for (var i = 0; i < workerPromises.length; i++) {
                    workerPromises[i] = new Promise(function (resolve, reject) {
                        var worker = new Worker(workerBlobUrl);
                        var onError = function (error) {
                            worker.removeEventListener("error", onError);
                            worker.removeEventListener("message", onMessage);
                            reject(error);
                        };
                        var onMessage = function (message) {
                            if (message.data === "done") {
                                worker.removeEventListener("error", onError);
                                worker.removeEventListener("message", onMessage);
                                resolve(worker);
                            }
                        };
                        worker.addEventListener("error", onError);
                        worker.addEventListener("message", onMessage);
                        worker.postMessage({
                            id: "init",
                            decoder: {
                                url: getAbsoluteUrl(decoderInfo.url),
                                wasmBinary: decoderWasmBinary,
                            }
                        });
                    });
                }
                return Promise.all(workerPromises).then(function (workers) {
                    return new WorkerPool(workers);
                });
            });
        }
        else {
            this._decoderModulePromise = decoderInfo.wasmBinaryPromise.then(function (decoderWasmBinary) {
                if (!decoderInfo.url) {
                    throw new Error("Draco decoder module is not available");
                }
                return Tools.LoadScriptAsync(decoderInfo.url).then(function () {
                    return createDecoderAsync(decoderWasmBinary);
                });
            });
        }
    }
    Object.defineProperty(DracoCompression, "DecoderAvailable", {
        /**
         * Returns true if the decoder configuration is available.
         */
        get: function () {
            var decoder = DracoCompression.Configuration.decoder;
            return !!((decoder.wasmUrl && decoder.wasmBinaryUrl && typeof WebAssembly === "object") || decoder.fallbackUrl);
        },
        enumerable: false,
        configurable: true
    });
    DracoCompression.GetDefaultNumWorkers = function () {
        if (typeof navigator !== "object" || !navigator.hardwareConcurrency) {
            return 1;
        }
        // Use 50% of the available logical processors but capped at 4.
        return Math.min(Math.floor(navigator.hardwareConcurrency * 0.5), 4);
    };
    Object.defineProperty(DracoCompression, "Default", {
        /**
         * Default instance for the draco compression object.
         */
        get: function () {
            if (!DracoCompression._Default) {
                DracoCompression._Default = new DracoCompression();
            }
            return DracoCompression._Default;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Stop all async operations and release resources.
     */
    DracoCompression.prototype.dispose = function () {
        if (this._workerPoolPromise) {
            this._workerPoolPromise.then(function (workerPool) {
                workerPool.dispose();
            });
        }
        delete this._workerPoolPromise;
        delete this._decoderModulePromise;
    };
    /**
     * Returns a promise that resolves when ready. Call this manually to ensure draco compression is ready before use.
     * @returns a promise that resolves when ready
     */
    DracoCompression.prototype.whenReadyAsync = function () {
        if (this._workerPoolPromise) {
            return this._workerPoolPromise.then(function () { });
        }
        if (this._decoderModulePromise) {
            return this._decoderModulePromise.then(function () { });
        }
        return Promise.resolve();
    };
    /**
      * Decode Draco compressed mesh data to vertex data.
      * @param data The ArrayBuffer or ArrayBufferView for the Draco compression data
      * @param attributes A map of attributes from vertex buffer kinds to Draco unique ids
      * @returns A promise that resolves with the decoded vertex data
      */
    DracoCompression.prototype.decodeMeshAsync = function (data, attributes) {
        var dataView = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
        if (this._workerPoolPromise) {
            return this._workerPoolPromise.then(function (workerPool) {
                return new Promise(function (resolve, reject) {
                    workerPool.push(function (worker, onComplete) {
                        var vertexData = new VertexData();
                        var onError = function (error) {
                            worker.removeEventListener("error", onError);
                            worker.removeEventListener("message", onMessage);
                            reject(error);
                            onComplete();
                        };
                        var onMessage = function (message) {
                            if (message.data === "done") {
                                worker.removeEventListener("error", onError);
                                worker.removeEventListener("message", onMessage);
                                resolve(vertexData);
                                onComplete();
                            }
                            else if (message.data.id === "indices") {
                                vertexData.indices = message.data.value;
                            }
                            else {
                                vertexData.set(message.data.value, message.data.id);
                            }
                        };
                        worker.addEventListener("error", onError);
                        worker.addEventListener("message", onMessage);
                        var dataViewCopy = new Uint8Array(dataView.byteLength);
                        dataViewCopy.set(new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength));
                        worker.postMessage({ id: "decodeMesh", dataView: dataViewCopy, attributes: attributes }, [dataViewCopy.buffer]);
                    });
                });
            });
        }
        if (this._decoderModulePromise) {
            return this._decoderModulePromise.then(function (decoder) {
                var vertexData = new VertexData();
                decodeMesh(decoder.module, dataView, attributes, function (indices) {
                    vertexData.indices = indices;
                }, function (kind, data) {
                    vertexData.set(data, kind);
                });
                return vertexData;
            });
        }
        throw new Error("Draco decoder module is not available");
    };
    /**
     * The configuration. Defaults to the following urls:
     * - wasmUrl: "https://preview.babylonjs.com/draco_wasm_wrapper_gltf.js"
     * - wasmBinaryUrl: "https://preview.babylonjs.com/draco_decoder_gltf.wasm"
     * - fallbackUrl: "https://preview.babylonjs.com/draco_decoder_gltf.js"
     */
    DracoCompression.Configuration = {
        decoder: {
            wasmUrl: "https://preview.babylonjs.com/draco_wasm_wrapper_gltf.js",
            wasmBinaryUrl: "https://preview.babylonjs.com/draco_decoder_gltf.wasm",
            fallbackUrl: "https://preview.babylonjs.com/draco_decoder_gltf.js"
        }
    };
    /**
     * Default number of workers to create when creating the draco compression object.
     */
    DracoCompression.DefaultNumWorkers = DracoCompression.GetDefaultNumWorkers();
    DracoCompression._Default = null;
    return DracoCompression;
}());

/**
 * Wrapper class for promise with external resolve and reject.
 */
var Deferred = /** @class */ (function () {
    /**
     * Constructor for this deferred object.
     */
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
    }
    Object.defineProperty(Deferred.prototype, "resolve", {
        /**
         * The resolve method of the promise associated with this deferred object.
         */
        get: function () {
            return this._resolve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Deferred.prototype, "reject", {
        /**
         * The reject method of the promise associated with this deferred object.
         */
        get: function () {
            return this._reject;
        },
        enumerable: false,
        configurable: true
    });
    return Deferred;
}());

/**
 * Utility class for reading from a data buffer
 */
var DataReader = /** @class */ (function () {
    /**
     * Constructor
     * @param buffer The buffer to read
     */
    function DataReader(buffer) {
        /**
         * The current byte offset from the beginning of the data buffer.
         */
        this.byteOffset = 0;
        this.buffer = buffer;
    }
    /**
     * Loads the given byte length.
     * @param byteLength The byte length to load
     * @returns A promise that resolves when the load is complete
     */
    DataReader.prototype.loadAsync = function (byteLength) {
        var _this = this;
        return this.buffer.readAsync(this.byteOffset, byteLength).then(function (data) {
            _this._dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
            _this._dataByteOffset = 0;
        });
    };
    /**
     * Read a unsigned 32-bit integer from the currently loaded data range.
     * @returns The 32-bit integer read
     */
    DataReader.prototype.readUint32 = function () {
        var value = this._dataView.getUint32(this._dataByteOffset, true);
        this._dataByteOffset += 4;
        this.byteOffset += 4;
        return value;
    };
    /**
     * Read a byte array from the currently loaded data range.
     * @param byteLength The byte length to read
     * @returns The byte array read
     */
    DataReader.prototype.readUint8Array = function (byteLength) {
        var value = new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + this._dataByteOffset, byteLength);
        this._dataByteOffset += byteLength;
        this.byteOffset += byteLength;
        return value;
    };
    /**
     * Read a string from the currently loaded data range.
     * @param byteLength The byte length to read
     * @returns The string read
     */
    DataReader.prototype.readString = function (byteLength) {
        return StringTools.Decode(this.readUint8Array(byteLength));
    };
    /**
     * Skips the given byte length the currently loaded data range.
     * @param byteLength The byte length to skip
     */
    DataReader.prototype.skipBytes = function (byteLength) {
        this._dataByteOffset += byteLength;
        this.byteOffset += byteLength;
    };
    return DataReader;
}());

function validateAsync(data, rootUrl, fileName, getExternalResource) {
    var options = {
        externalResourceFunction: function (uri) { return getExternalResource(uri).then(function (value) { return new Uint8Array(value); }); }
    };
    if (fileName) {
        options.uri = (rootUrl === "file:" ? fileName : rootUrl + fileName);
    }
    return (data instanceof ArrayBuffer)
        ? GLTFValidator.validateBytes(new Uint8Array(data), options)
        : GLTFValidator.validateString(data, options);
}
/**
 * The worker function that gets converted to a blob url to pass into a worker.
 */
function workerFunc() {
    var pendingExternalResources = [];
    onmessage = function (message) {
        var data = message.data;
        switch (data.id) {
            case "init": {
                importScripts(data.url);
                break;
            }
            case "validate": {
                validateAsync(data.data, data.rootUrl, data.fileName, function (uri) { return new Promise(function (resolve, reject) {
                    var index = pendingExternalResources.length;
                    pendingExternalResources.push({ resolve: resolve, reject: reject });
                    postMessage({ id: "getExternalResource", index: index, uri: uri });
                }); }).then(function (value) {
                    postMessage({ id: "validate.resolve", value: value });
                }, function (reason) {
                    postMessage({ id: "validate.reject", reason: reason });
                });
                break;
            }
            case "getExternalResource.resolve": {
                pendingExternalResources[data.index].resolve(data.value);
                break;
            }
            case "getExternalResource.reject": {
                pendingExternalResources[data.index].reject(data.reason);
                break;
            }
        }
    };
}
/**
 * glTF validation
 */
var GLTFValidation = /** @class */ (function () {
    function GLTFValidation() {
    }
    /**
     * Validate a glTF asset using the glTF-Validator.
     * @param data The JSON of a glTF or the array buffer of a binary glTF
     * @param rootUrl The root url for the glTF
     * @param fileName The file name for the glTF
     * @param getExternalResource The callback to get external resources for the glTF validator
     * @returns A promise that resolves with the glTF validation results once complete
     */
    GLTFValidation.ValidateAsync = function (data, rootUrl, fileName, getExternalResource) {
        var _this = this;
        if (typeof Worker === "function") {
            return new Promise(function (resolve, reject) {
                var workerContent = validateAsync + "(" + workerFunc + ")()";
                var workerBlobUrl = URL.createObjectURL(new Blob([workerContent], { type: "application/javascript" }));
                var worker = new Worker(workerBlobUrl);
                var onError = function (error) {
                    worker.removeEventListener("error", onError);
                    worker.removeEventListener("message", onMessage);
                    reject(error);
                };
                var onMessage = function (message) {
                    var data = message.data;
                    switch (data.id) {
                        case "getExternalResource": {
                            getExternalResource(data.uri).then(function (value) {
                                worker.postMessage({ id: "getExternalResource.resolve", index: data.index, value: value }, [value]);
                            }, function (reason) {
                                worker.postMessage({ id: "getExternalResource.reject", index: data.index, reason: reason });
                            });
                            break;
                        }
                        case "validate.resolve": {
                            worker.removeEventListener("error", onError);
                            worker.removeEventListener("message", onMessage);
                            resolve(data.value);
                            break;
                        }
                        case "validate.reject": {
                            worker.removeEventListener("error", onError);
                            worker.removeEventListener("message", onMessage);
                            reject(data.reason);
                        }
                    }
                };
                worker.addEventListener("error", onError);
                worker.addEventListener("message", onMessage);
                worker.postMessage({ id: "init", url: Tools.GetAbsoluteUrl(_this.Configuration.url) });
                worker.postMessage({ id: "validate", data: data, rootUrl: rootUrl, fileName: fileName });
            });
        }
        else {
            if (!this._LoadScriptPromise) {
                this._LoadScriptPromise = Tools.LoadScriptAsync(this.Configuration.url);
            }
            return this._LoadScriptPromise.then(function () {
                return validateAsync(data, rootUrl, fileName, getExternalResource);
            });
        }
    };
    /**
     * The configuration. Defaults to `{ url: "https://preview.babylonjs.com/gltf_validator.js" }`.
     */
    GLTFValidation.Configuration = {
        url: "https://preview.babylonjs.com/gltf_validator.js"
    };
    return GLTFValidation;
}());

/**
 * Mode that determines the coordinate system to use.
 */
var GLTFLoaderCoordinateSystemMode;
(function (GLTFLoaderCoordinateSystemMode) {
    /**
     * Automatically convert the glTF right-handed data to the appropriate system based on the current coordinate system mode of the scene.
     */
    GLTFLoaderCoordinateSystemMode[GLTFLoaderCoordinateSystemMode["AUTO"] = 0] = "AUTO";
    /**
     * Sets the useRightHandedSystem flag on the scene.
     */
    GLTFLoaderCoordinateSystemMode[GLTFLoaderCoordinateSystemMode["FORCE_RIGHT_HANDED"] = 1] = "FORCE_RIGHT_HANDED";
})(GLTFLoaderCoordinateSystemMode || (GLTFLoaderCoordinateSystemMode = {}));
/**
 * Mode that determines what animations will start.
 */
var GLTFLoaderAnimationStartMode;
(function (GLTFLoaderAnimationStartMode) {
    /**
     * No animation will start.
     */
    GLTFLoaderAnimationStartMode[GLTFLoaderAnimationStartMode["NONE"] = 0] = "NONE";
    /**
     * The first animation will start.
     */
    GLTFLoaderAnimationStartMode[GLTFLoaderAnimationStartMode["FIRST"] = 1] = "FIRST";
    /**
     * All animations will start.
     */
    GLTFLoaderAnimationStartMode[GLTFLoaderAnimationStartMode["ALL"] = 2] = "ALL";
})(GLTFLoaderAnimationStartMode || (GLTFLoaderAnimationStartMode = {}));
/**
 * Loader state.
 */
var GLTFLoaderState;
(function (GLTFLoaderState) {
    /**
     * The asset is loading.
     */
    GLTFLoaderState[GLTFLoaderState["LOADING"] = 0] = "LOADING";
    /**
     * The asset is ready for rendering.
     */
    GLTFLoaderState[GLTFLoaderState["READY"] = 1] = "READY";
    /**
     * The asset is completely loaded.
     */
    GLTFLoaderState[GLTFLoaderState["COMPLETE"] = 2] = "COMPLETE";
})(GLTFLoaderState || (GLTFLoaderState = {}));
/**
 * File loader for loading glTF files into a scene.
 */
var GLTFFileLoader = /** @class */ (function () {
    function GLTFFileLoader() {
        // --------------
        // Common options
        // --------------
        /**
         * Raised when the asset has been parsed
         */
        this.onParsedObservable = new Observable();
        // ----------
        // V2 options
        // ----------
        /**
         * The coordinate system mode. Defaults to AUTO.
         */
        this.coordinateSystemMode = GLTFLoaderCoordinateSystemMode.AUTO;
        /**
        * The animation start mode. Defaults to FIRST.
        */
        this.animationStartMode = GLTFLoaderAnimationStartMode.FIRST;
        /**
         * Defines if the loader should compile materials before raising the success callback. Defaults to false.
         */
        this.compileMaterials = false;
        /**
         * Defines if the loader should also compile materials with clip planes. Defaults to false.
         */
        this.useClipPlane = false;
        /**
         * Defines if the loader should compile shadow generators before raising the success callback. Defaults to false.
         */
        this.compileShadowGenerators = false;
        /**
         * Defines if the Alpha blended materials are only applied as coverage.
         * If false, (default) The luminance of each pixel will reduce its opacity to simulate the behaviour of most physical materials.
         * If true, no extra effects are applied to transparent pixels.
         */
        this.transparencyAsCoverage = false;
        /**
         * Defines if the loader should use range requests when load binary glTF files from HTTP.
         * Enabling will disable offline support and glTF validator.
         * Defaults to false.
         */
        this.useRangeRequests = false;
        /**
         * Defines if the loader should create instances when multiple glTF nodes point to the same glTF mesh. Defaults to true.
         */
        this.createInstances = true;
        /**
         * Defines if the loader should always compute the bounding boxes of meshes and not use the min/max values from the position accessor. Defaults to false.
         */
        this.alwaysComputeBoundingBox = false;
        /**
         * If true, load all materials defined in the file, even if not used by any mesh. Defaults to false.
         */
        this.loadAllMaterials = false;
        /**
         * Function called before loading a url referenced by the asset.
         */
        this.preprocessUrlAsync = function (url) { return Promise.resolve(url); };
        /**
         * Observable raised when the loader creates a mesh after parsing the glTF properties of the mesh.
         * Note that the observable is raised as soon as the mesh object is created, meaning some data may not have been setup yet for this mesh (vertex data, morph targets, material, ...)
         */
        this.onMeshLoadedObservable = new Observable();
        /**
         * Observable raised when the loader creates a texture after parsing the glTF properties of the texture.
         */
        this.onTextureLoadedObservable = new Observable();
        /**
         * Observable raised when the loader creates a material after parsing the glTF properties of the material.
         */
        this.onMaterialLoadedObservable = new Observable();
        /**
         * Observable raised when the loader creates a camera after parsing the glTF properties of the camera.
         */
        this.onCameraLoadedObservable = new Observable();
        /**
         * Observable raised when the asset is completely loaded, immediately before the loader is disposed.
         * For assets with LODs, raised when all of the LODs are complete.
         * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
         */
        this.onCompleteObservable = new Observable();
        /**
         * Observable raised when an error occurs.
         */
        this.onErrorObservable = new Observable();
        /**
         * Observable raised after the loader is disposed.
         */
        this.onDisposeObservable = new Observable();
        /**
         * Observable raised after a loader extension is created.
         * Set additional options for a loader extension in this event.
         */
        this.onExtensionLoadedObservable = new Observable();
        /**
         * Defines if the loader should validate the asset.
         */
        this.validate = false;
        /**
         * Observable raised after validation when validate is set to true. The event data is the result of the validation.
         */
        this.onValidatedObservable = new Observable();
        this._loader = null;
        this._requests = new Array();
        /**
         * Name of the loader ("gltf")
         */
        this.name = "gltf";
        /** @hidden */
        this.extensions = {
            ".gltf": { isBinary: false },
            ".glb": { isBinary: true }
        };
        this._logIndentLevel = 0;
        this._loggingEnabled = false;
        /** @hidden */
        this._log = this._logDisabled;
        this._capturePerformanceCounters = false;
        /** @hidden */
        this._startPerformanceCounter = this._startPerformanceCounterDisabled;
        /** @hidden */
        this._endPerformanceCounter = this._endPerformanceCounterDisabled;
    }
    Object.defineProperty(GLTFFileLoader.prototype, "onParsed", {
        /**
         * Raised when the asset has been parsed
         */
        set: function (callback) {
            if (this._onParsedObserver) {
                this.onParsedObservable.remove(this._onParsedObserver);
            }
            this._onParsedObserver = this.onParsedObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFFileLoader.prototype, "onMeshLoaded", {
        /**
         * Callback raised when the loader creates a mesh after parsing the glTF properties of the mesh.
         * Note that the callback is called as soon as the mesh object is created, meaning some data may not have been setup yet for this mesh (vertex data, morph targets, material, ...)
         */
        set: function (callback) {
            if (this._onMeshLoadedObserver) {
                this.onMeshLoadedObservable.remove(this._onMeshLoadedObserver);
            }
            this._onMeshLoadedObserver = this.onMeshLoadedObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFFileLoader.prototype, "onTextureLoaded", {
        /**
         * Callback raised when the loader creates a texture after parsing the glTF properties of the texture.
         */
        set: function (callback) {
            if (this._onTextureLoadedObserver) {
                this.onTextureLoadedObservable.remove(this._onTextureLoadedObserver);
            }
            this._onTextureLoadedObserver = this.onTextureLoadedObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFFileLoader.prototype, "onMaterialLoaded", {
        /**
         * Callback raised when the loader creates a material after parsing the glTF properties of the material.
         */
        set: function (callback) {
            if (this._onMaterialLoadedObserver) {
                this.onMaterialLoadedObservable.remove(this._onMaterialLoadedObserver);
            }
            this._onMaterialLoadedObserver = this.onMaterialLoadedObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFFileLoader.prototype, "onCameraLoaded", {
        /**
         * Callback raised when the loader creates a camera after parsing the glTF properties of the camera.
         */
        set: function (callback) {
            if (this._onCameraLoadedObserver) {
                this.onCameraLoadedObservable.remove(this._onCameraLoadedObserver);
            }
            this._onCameraLoadedObserver = this.onCameraLoadedObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFFileLoader.prototype, "onComplete", {
        /**
         * Callback raised when the asset is completely loaded, immediately before the loader is disposed.
         * For assets with LODs, raised when all of the LODs are complete.
         * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
         */
        set: function (callback) {
            if (this._onCompleteObserver) {
                this.onCompleteObservable.remove(this._onCompleteObserver);
            }
            this._onCompleteObserver = this.onCompleteObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFFileLoader.prototype, "onError", {
        /**
         * Callback raised when an error occurs.
         */
        set: function (callback) {
            if (this._onErrorObserver) {
                this.onErrorObservable.remove(this._onErrorObserver);
            }
            this._onErrorObserver = this.onErrorObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFFileLoader.prototype, "onDispose", {
        /**
         * Callback raised after the loader is disposed.
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
    Object.defineProperty(GLTFFileLoader.prototype, "onExtensionLoaded", {
        /**
         * Callback raised after a loader extension is created.
         */
        set: function (callback) {
            if (this._onExtensionLoadedObserver) {
                this.onExtensionLoadedObservable.remove(this._onExtensionLoadedObserver);
            }
            this._onExtensionLoadedObserver = this.onExtensionLoadedObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFFileLoader.prototype, "loggingEnabled", {
        /**
         * Defines if the loader logging is enabled.
         */
        get: function () {
            return this._loggingEnabled;
        },
        set: function (value) {
            if (this._loggingEnabled === value) {
                return;
            }
            this._loggingEnabled = value;
            if (this._loggingEnabled) {
                this._log = this._logEnabled;
            }
            else {
                this._log = this._logDisabled;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFFileLoader.prototype, "capturePerformanceCounters", {
        /**
         * Defines if the loader should capture performance counters.
         */
        get: function () {
            return this._capturePerformanceCounters;
        },
        set: function (value) {
            if (this._capturePerformanceCounters === value) {
                return;
            }
            this._capturePerformanceCounters = value;
            if (this._capturePerformanceCounters) {
                this._startPerformanceCounter = this._startPerformanceCounterEnabled;
                this._endPerformanceCounter = this._endPerformanceCounterEnabled;
            }
            else {
                this._startPerformanceCounter = this._startPerformanceCounterDisabled;
                this._endPerformanceCounter = this._endPerformanceCounterDisabled;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFFileLoader.prototype, "onValidated", {
        /**
         * Callback raised after a loader extension is created.
         */
        set: function (callback) {
            if (this._onValidatedObserver) {
                this.onValidatedObservable.remove(this._onValidatedObserver);
            }
            this._onValidatedObserver = this.onValidatedObservable.add(callback);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Disposes the loader, releases resources during load, and cancels any outstanding requests.
     */
    GLTFFileLoader.prototype.dispose = function () {
        if (this._loader) {
            this._loader.dispose();
            this._loader = null;
        }
        for (var _i = 0, _a = this._requests; _i < _a.length; _i++) {
            var request = _a[_i];
            request.abort();
        }
        this._requests.length = 0;
        delete this._progressCallback;
        this.preprocessUrlAsync = function (url) { return Promise.resolve(url); };
        this.onMeshLoadedObservable.clear();
        this.onTextureLoadedObservable.clear();
        this.onMaterialLoadedObservable.clear();
        this.onCameraLoadedObservable.clear();
        this.onCompleteObservable.clear();
        this.onExtensionLoadedObservable.clear();
        this.onDisposeObservable.notifyObservers(undefined);
        this.onDisposeObservable.clear();
    };
    /** @hidden */
    GLTFFileLoader.prototype.requestFile = function (scene, url, onSuccess, onProgress, useArrayBuffer, onError) {
        var _this = this;
        this._progressCallback = onProgress;
        if (useArrayBuffer) {
            if (this.useRangeRequests) {
                if (this.validate) {
                    Logger.Warn("glTF validation is not supported when range requests are enabled");
                }
                var fileRequest_1 = {
                    abort: function () { },
                    onCompleteObservable: new Observable()
                };
                var dataBuffer = {
                    readAsync: function (byteOffset, byteLength) {
                        return new Promise(function (resolve, reject) {
                            _this._requestFile(url, scene, function (data) {
                                resolve(new Uint8Array(data));
                            }, true, function (error) {
                                reject(error);
                            }, function (webRequest) {
                                webRequest.setRequestHeader("Range", "bytes=" + byteOffset + "-" + (byteOffset + byteLength - 1));
                            });
                        });
                    },
                    byteLength: 0
                };
                this._unpackBinaryAsync(new DataReader(dataBuffer)).then(function (loaderData) {
                    fileRequest_1.onCompleteObservable.notifyObservers(fileRequest_1);
                    onSuccess(loaderData);
                }, onError);
                return fileRequest_1;
            }
            return this._requestFile(url, scene, function (data, request) {
                var arrayBuffer = data;
                _this._unpackBinaryAsync(new DataReader({
                    readAsync: function (byteOffset, byteLength) { return Promise.resolve(new Uint8Array(arrayBuffer, byteOffset, byteLength)); },
                    byteLength: arrayBuffer.byteLength
                })).then(function (loaderData) {
                    onSuccess(loaderData, request);
                }, onError);
            }, true, onError);
        }
        return this._requestFile(url, scene, function (data, request) {
            _this._validate(scene, data, Tools.GetFolderPath(url), Tools.GetFilename(url));
            onSuccess({ json: _this._parseJson(data) }, request);
        }, useArrayBuffer, onError);
    };
    /** @hidden */
    GLTFFileLoader.prototype.readFile = function (scene, file, onSuccess, onProgress, useArrayBuffer, onError) {
        var _this = this;
        return scene._readFile(file, function (data) {
            _this._validate(scene, data, "file:", file.name);
            if (useArrayBuffer) {
                var arrayBuffer_1 = data;
                _this._unpackBinaryAsync(new DataReader({
                    readAsync: function (byteOffset, byteLength) { return Promise.resolve(new Uint8Array(arrayBuffer_1, byteOffset, byteLength)); },
                    byteLength: arrayBuffer_1.byteLength
                })).then(onSuccess, onError);
            }
            else {
                onSuccess({ json: _this._parseJson(data) });
            }
        }, onProgress, useArrayBuffer, onError);
    };
    /** @hidden */
    GLTFFileLoader.prototype.importMeshAsync = function (meshesNames, scene, data, rootUrl, onProgress, fileName) {
        var _this = this;
        return Promise.resolve().then(function () {
            _this.onParsedObservable.notifyObservers(data);
            _this.onParsedObservable.clear();
            _this._log("Loading " + (fileName || ""));
            _this._loader = _this._getLoader(data);
            return _this._loader.importMeshAsync(meshesNames, scene, false, data, rootUrl, onProgress, fileName);
        });
    };
    /** @hidden */
    GLTFFileLoader.prototype.loadAsync = function (scene, data, rootUrl, onProgress, fileName) {
        var _this = this;
        return Promise.resolve().then(function () {
            _this.onParsedObservable.notifyObservers(data);
            _this.onParsedObservable.clear();
            _this._log("Loading " + (fileName || ""));
            _this._loader = _this._getLoader(data);
            return _this._loader.loadAsync(scene, data, rootUrl, onProgress, fileName);
        });
    };
    /** @hidden */
    GLTFFileLoader.prototype.loadAssetContainerAsync = function (scene, data, rootUrl, onProgress, fileName) {
        var _this = this;
        return Promise.resolve().then(function () {
            _this.onParsedObservable.notifyObservers(data);
            _this.onParsedObservable.clear();
            _this._log("Loading " + (fileName || ""));
            _this._loader = _this._getLoader(data);
            // Prepare the asset container.
            var container = new AssetContainer(scene);
            // Get materials/textures when loading to add to container
            var materials = [];
            _this.onMaterialLoadedObservable.add(function (material) {
                materials.push(material);
                material.onDisposeObservable.addOnce(function () {
                    var index = container.materials.indexOf(material);
                    if (index > -1) {
                        container.materials.splice(index, 1);
                    }
                    index = materials.indexOf(material);
                    if (index > -1) {
                        materials.splice(index, 1);
                    }
                });
            });
            var textures = [];
            _this.onTextureLoadedObservable.add(function (texture) {
                textures.push(texture);
                texture.onDisposeObservable.addOnce(function () {
                    var index = container.textures.indexOf(texture);
                    if (index > -1) {
                        container.textures.splice(index, 1);
                    }
                    index = textures.indexOf(texture);
                    if (index > -1) {
                        textures.splice(index, 1);
                    }
                });
            });
            var cameras = [];
            _this.onCameraLoadedObservable.add(function (camera) {
                cameras.push(camera);
            });
            return _this._loader.importMeshAsync(null, scene, true, data, rootUrl, onProgress, fileName).then(function (result) {
                Array.prototype.push.apply(container.geometries, result.geometries);
                Array.prototype.push.apply(container.meshes, result.meshes);
                Array.prototype.push.apply(container.particleSystems, result.particleSystems);
                Array.prototype.push.apply(container.skeletons, result.skeletons);
                Array.prototype.push.apply(container.animationGroups, result.animationGroups);
                Array.prototype.push.apply(container.materials, materials);
                Array.prototype.push.apply(container.textures, textures);
                Array.prototype.push.apply(container.lights, result.lights);
                Array.prototype.push.apply(container.transformNodes, result.transformNodes);
                Array.prototype.push.apply(container.cameras, cameras);
                return container;
            });
        });
    };
    /** @hidden */
    GLTFFileLoader.prototype.canDirectLoad = function (data) {
        return (data.indexOf("asset") !== -1 && data.indexOf("version") !== -1)
            || StringTools.StartsWith(data, "data:base64," + GLTFFileLoader.magicBase64Encoded)
            || StringTools.StartsWith(data, "data:application/octet-stream;base64," + GLTFFileLoader.magicBase64Encoded)
            || StringTools.StartsWith(data, "data:model/gltf-binary;base64," + GLTFFileLoader.magicBase64Encoded);
    };
    /** @hidden */
    GLTFFileLoader.prototype.directLoad = function (scene, data) {
        if (StringTools.StartsWith(data, "base64," + GLTFFileLoader.magicBase64Encoded) ||
            StringTools.StartsWith(data, "application/octet-stream;base64," + GLTFFileLoader.magicBase64Encoded) ||
            StringTools.StartsWith(data, "model/gltf-binary;base64," + GLTFFileLoader.magicBase64Encoded)) {
            var arrayBuffer_2 = Tools.DecodeBase64(data);
            this._validate(scene, arrayBuffer_2);
            return this._unpackBinaryAsync(new DataReader({
                readAsync: function (byteOffset, byteLength) { return Promise.resolve(new Uint8Array(arrayBuffer_2, byteOffset, byteLength)); },
                byteLength: arrayBuffer_2.byteLength
            }));
        }
        this._validate(scene, data);
        return Promise.resolve({ json: this._parseJson(data) });
    };
    /** @hidden */
    GLTFFileLoader.prototype.createPlugin = function () {
        return new GLTFFileLoader();
    };
    Object.defineProperty(GLTFFileLoader.prototype, "loaderState", {
        /**
         * The loader state or null if the loader is not active.
         */
        get: function () {
            return this._loader ? this._loader.state : null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a promise that resolves when the asset is completely loaded.
     * @returns a promise that resolves when the asset is completely loaded.
     */
    GLTFFileLoader.prototype.whenCompleteAsync = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.onCompleteObservable.addOnce(function () {
                resolve();
            });
            _this.onErrorObservable.addOnce(function (reason) {
                reject(reason);
            });
        });
    };
    /** @hidden */
    GLTFFileLoader.prototype._loadFile = function (url, scene, onSuccess, useArrayBuffer, onError) {
        var _this = this;
        var request = scene._loadFile(url, onSuccess, function (event) {
            _this._onProgress(event, request);
        }, undefined, useArrayBuffer, onError);
        request.onCompleteObservable.add(function (request) {
            _this._requests.splice(_this._requests.indexOf(request), 1);
        });
        this._requests.push(request);
        return request;
    };
    /** @hidden */
    GLTFFileLoader.prototype._requestFile = function (url, scene, onSuccess, useArrayBuffer, onError, onOpened) {
        var _this = this;
        var request = scene._requestFile(url, onSuccess, function (event) {
            _this._onProgress(event, request);
        }, undefined, useArrayBuffer, onError, onOpened);
        request.onCompleteObservable.add(function (request) {
            _this._requests.splice(_this._requests.indexOf(request), 1);
        });
        this._requests.push(request);
        return request;
    };
    GLTFFileLoader.prototype._onProgress = function (event, request) {
        if (!this._progressCallback) {
            return;
        }
        request._lengthComputable = event.lengthComputable;
        request._loaded = event.loaded;
        request._total = event.total;
        var lengthComputable = true;
        var loaded = 0;
        var total = 0;
        for (var _i = 0, _a = this._requests; _i < _a.length; _i++) {
            var request_1 = _a[_i];
            if (request_1._lengthComputable === undefined || request_1._loaded === undefined || request_1._total === undefined) {
                return;
            }
            lengthComputable = lengthComputable && request_1._lengthComputable;
            loaded += request_1._loaded;
            total += request_1._total;
        }
        this._progressCallback({
            lengthComputable: lengthComputable,
            loaded: loaded,
            total: lengthComputable ? total : 0
        });
    };
    GLTFFileLoader.prototype._validate = function (scene, data, rootUrl, fileName) {
        var _this = this;
        if (rootUrl === void 0) { rootUrl = ""; }
        if (fileName === void 0) { fileName = ""; }
        if (!this.validate) {
            return;
        }
        this._startPerformanceCounter("Validate JSON");
        GLTFValidation.ValidateAsync(data, rootUrl, fileName, function (uri) {
            return _this.preprocessUrlAsync(rootUrl + uri).then(function (url) { return scene._loadFileAsync(url, undefined, true, true); });
        }).then(function (result) {
            _this._endPerformanceCounter("Validate JSON");
            _this.onValidatedObservable.notifyObservers(result);
            _this.onValidatedObservable.clear();
        }, function (reason) {
            _this._endPerformanceCounter("Validate JSON");
            Tools.Warn("Failed to validate: " + reason.message);
            _this.onValidatedObservable.clear();
        });
    };
    GLTFFileLoader.prototype._getLoader = function (loaderData) {
        var asset = loaderData.json.asset || {};
        this._log("Asset version: " + asset.version);
        asset.minVersion && this._log("Asset minimum version: " + asset.minVersion);
        asset.generator && this._log("Asset generator: " + asset.generator);
        var version = GLTFFileLoader._parseVersion(asset.version);
        if (!version) {
            throw new Error("Invalid version: " + asset.version);
        }
        if (asset.minVersion !== undefined) {
            var minVersion = GLTFFileLoader._parseVersion(asset.minVersion);
            if (!minVersion) {
                throw new Error("Invalid minimum version: " + asset.minVersion);
            }
            if (GLTFFileLoader._compareVersion(minVersion, { major: 2, minor: 0 }) > 0) {
                throw new Error("Incompatible minimum version: " + asset.minVersion);
            }
        }
        var createLoaders = {
            1: GLTFFileLoader._CreateGLTF1Loader,
            2: GLTFFileLoader._CreateGLTF2Loader
        };
        var createLoader = createLoaders[version.major];
        if (!createLoader) {
            throw new Error("Unsupported version: " + asset.version);
        }
        return createLoader(this);
    };
    GLTFFileLoader.prototype._parseJson = function (json) {
        this._startPerformanceCounter("Parse JSON");
        this._log("JSON length: " + json.length);
        var parsed = JSON.parse(json);
        this._endPerformanceCounter("Parse JSON");
        return parsed;
    };
    GLTFFileLoader.prototype._unpackBinaryAsync = function (dataReader) {
        var _this = this;
        this._startPerformanceCounter("Unpack Binary");
        // Read magic + version + length + json length + json format
        return dataReader.loadAsync(20).then(function () {
            var Binary = {
                Magic: 0x46546C67
            };
            var magic = dataReader.readUint32();
            if (magic !== Binary.Magic) {
                throw new Error("Unexpected magic: " + magic);
            }
            var version = dataReader.readUint32();
            if (_this.loggingEnabled) {
                _this._log("Binary version: " + version);
            }
            var length = dataReader.readUint32();
            if (dataReader.buffer.byteLength !== 0 && length !== dataReader.buffer.byteLength) {
                throw new Error("Length in header does not match actual data length: " + length + " != " + dataReader.buffer.byteLength);
            }
            var unpacked;
            switch (version) {
                case 1: {
                    unpacked = _this._unpackBinaryV1Async(dataReader, length);
                    break;
                }
                case 2: {
                    unpacked = _this._unpackBinaryV2Async(dataReader, length);
                    break;
                }
                default: {
                    throw new Error("Unsupported version: " + version);
                }
            }
            _this._endPerformanceCounter("Unpack Binary");
            return unpacked;
        });
    };
    GLTFFileLoader.prototype._unpackBinaryV1Async = function (dataReader, length) {
        var ContentFormat = {
            JSON: 0
        };
        var contentLength = dataReader.readUint32();
        var contentFormat = dataReader.readUint32();
        if (contentFormat !== ContentFormat.JSON) {
            throw new Error("Unexpected content format: " + contentFormat);
        }
        var bodyLength = length - dataReader.byteOffset;
        var data = { json: this._parseJson(dataReader.readString(contentLength)), bin: null };
        if (bodyLength !== 0) {
            var startByteOffset_1 = dataReader.byteOffset;
            data.bin = {
                readAsync: function (byteOffset, byteLength) { return dataReader.buffer.readAsync(startByteOffset_1 + byteOffset, byteLength); },
                byteLength: bodyLength
            };
        }
        return Promise.resolve(data);
    };
    GLTFFileLoader.prototype._unpackBinaryV2Async = function (dataReader, length) {
        var _this = this;
        var ChunkFormat = {
            JSON: 0x4E4F534A,
            BIN: 0x004E4942
        };
        // Read the JSON chunk header.
        var chunkLength = dataReader.readUint32();
        var chunkFormat = dataReader.readUint32();
        if (chunkFormat !== ChunkFormat.JSON) {
            throw new Error("First chunk format is not JSON");
        }
        // Bail if there are no other chunks.
        if (dataReader.byteOffset + chunkLength === length) {
            return dataReader.loadAsync(chunkLength).then(function () {
                return { json: _this._parseJson(dataReader.readString(chunkLength)), bin: null };
            });
        }
        // Read the JSON chunk and the length and type of the next chunk.
        return dataReader.loadAsync(chunkLength + 8).then(function () {
            var data = { json: _this._parseJson(dataReader.readString(chunkLength)), bin: null };
            var readAsync = function () {
                var chunkLength = dataReader.readUint32();
                var chunkFormat = dataReader.readUint32();
                switch (chunkFormat) {
                    case ChunkFormat.JSON: {
                        throw new Error("Unexpected JSON chunk");
                    }
                    case ChunkFormat.BIN: {
                        var startByteOffset_2 = dataReader.byteOffset;
                        data.bin = {
                            readAsync: function (byteOffset, byteLength) { return dataReader.buffer.readAsync(startByteOffset_2 + byteOffset, byteLength); },
                            byteLength: chunkLength
                        };
                        dataReader.skipBytes(chunkLength);
                        break;
                    }
                    default: {
                        // ignore unrecognized chunkFormat
                        dataReader.skipBytes(chunkLength);
                        break;
                    }
                }
                if (dataReader.byteOffset !== length) {
                    return dataReader.loadAsync(8).then(readAsync);
                }
                return Promise.resolve(data);
            };
            return readAsync();
        });
    };
    GLTFFileLoader._parseVersion = function (version) {
        if (version === "1.0" || version === "1.0.1") {
            return {
                major: 1,
                minor: 0
            };
        }
        var match = (version + "").match(/^(\d+)\.(\d+)/);
        if (!match) {
            return null;
        }
        return {
            major: parseInt(match[1]),
            minor: parseInt(match[2])
        };
    };
    GLTFFileLoader._compareVersion = function (a, b) {
        if (a.major > b.major) {
            return 1;
        }
        if (a.major < b.major) {
            return -1;
        }
        if (a.minor > b.minor) {
            return 1;
        }
        if (a.minor < b.minor) {
            return -1;
        }
        return 0;
    };
    /** @hidden */
    GLTFFileLoader.prototype._logOpen = function (message) {
        this._log(message);
        this._logIndentLevel++;
    };
    /** @hidden */
    GLTFFileLoader.prototype._logClose = function () {
        --this._logIndentLevel;
    };
    GLTFFileLoader.prototype._logEnabled = function (message) {
        var spaces = GLTFFileLoader._logSpaces.substr(0, this._logIndentLevel * 2);
        Logger.Log("" + spaces + message);
    };
    GLTFFileLoader.prototype._logDisabled = function (message) {
    };
    GLTFFileLoader.prototype._startPerformanceCounterEnabled = function (counterName) {
        Tools.StartPerformanceCounter(counterName);
    };
    GLTFFileLoader.prototype._startPerformanceCounterDisabled = function (counterName) {
    };
    GLTFFileLoader.prototype._endPerformanceCounterEnabled = function (counterName) {
        Tools.EndPerformanceCounter(counterName);
    };
    GLTFFileLoader.prototype._endPerformanceCounterDisabled = function (counterName) {
    };
    // ----------
    // V1 options
    // ----------
    /**
     * Set this property to false to disable incremental loading which delays the loader from calling the success callback until after loading the meshes and shaders.
     * Textures always loads asynchronously. For example, the success callback can compute the bounding information of the loaded meshes when incremental loading is disabled.
     * Defaults to true.
     * @hidden
     */
    GLTFFileLoader.IncrementalLoading = true;
    /**
     * Set this property to true in order to work with homogeneous coordinates, available with some converters and exporters.
     * Defaults to false. See https://en.wikipedia.org/wiki/Homogeneous_coordinates.
     * @hidden
     */
    GLTFFileLoader.HomogeneousCoordinates = false;
    GLTFFileLoader.magicBase64Encoded = "Z2xURg"; // "glTF" base64 encoded (without the quotes!)
    GLTFFileLoader._logSpaces = "                                ";
    return GLTFFileLoader;
}());
if (SceneLoader) {
    SceneLoader.RegisterPlugin(new GLTFFileLoader());
}

/**
* Enums
* @hidden
*/
var EComponentType;
(function (EComponentType) {
    EComponentType[EComponentType["BYTE"] = 5120] = "BYTE";
    EComponentType[EComponentType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    EComponentType[EComponentType["SHORT"] = 5122] = "SHORT";
    EComponentType[EComponentType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    EComponentType[EComponentType["FLOAT"] = 5126] = "FLOAT";
})(EComponentType || (EComponentType = {}));
/** @hidden */
var EShaderType;
(function (EShaderType) {
    EShaderType[EShaderType["FRAGMENT"] = 35632] = "FRAGMENT";
    EShaderType[EShaderType["VERTEX"] = 35633] = "VERTEX";
})(EShaderType || (EShaderType = {}));
/** @hidden */
var EParameterType;
(function (EParameterType) {
    EParameterType[EParameterType["BYTE"] = 5120] = "BYTE";
    EParameterType[EParameterType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    EParameterType[EParameterType["SHORT"] = 5122] = "SHORT";
    EParameterType[EParameterType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    EParameterType[EParameterType["INT"] = 5124] = "INT";
    EParameterType[EParameterType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    EParameterType[EParameterType["FLOAT"] = 5126] = "FLOAT";
    EParameterType[EParameterType["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
    EParameterType[EParameterType["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
    EParameterType[EParameterType["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
    EParameterType[EParameterType["INT_VEC2"] = 35667] = "INT_VEC2";
    EParameterType[EParameterType["INT_VEC3"] = 35668] = "INT_VEC3";
    EParameterType[EParameterType["INT_VEC4"] = 35669] = "INT_VEC4";
    EParameterType[EParameterType["BOOL"] = 35670] = "BOOL";
    EParameterType[EParameterType["BOOL_VEC2"] = 35671] = "BOOL_VEC2";
    EParameterType[EParameterType["BOOL_VEC3"] = 35672] = "BOOL_VEC3";
    EParameterType[EParameterType["BOOL_VEC4"] = 35673] = "BOOL_VEC4";
    EParameterType[EParameterType["FLOAT_MAT2"] = 35674] = "FLOAT_MAT2";
    EParameterType[EParameterType["FLOAT_MAT3"] = 35675] = "FLOAT_MAT3";
    EParameterType[EParameterType["FLOAT_MAT4"] = 35676] = "FLOAT_MAT4";
    EParameterType[EParameterType["SAMPLER_2D"] = 35678] = "SAMPLER_2D";
})(EParameterType || (EParameterType = {}));
/** @hidden */
var ETextureWrapMode;
(function (ETextureWrapMode) {
    ETextureWrapMode[ETextureWrapMode["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
    ETextureWrapMode[ETextureWrapMode["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
    ETextureWrapMode[ETextureWrapMode["REPEAT"] = 10497] = "REPEAT";
})(ETextureWrapMode || (ETextureWrapMode = {}));
/** @hidden */
var ETextureFilterType;
(function (ETextureFilterType) {
    ETextureFilterType[ETextureFilterType["NEAREST"] = 9728] = "NEAREST";
    ETextureFilterType[ETextureFilterType["LINEAR"] = 9728] = "LINEAR";
    ETextureFilterType[ETextureFilterType["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
    ETextureFilterType[ETextureFilterType["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
    ETextureFilterType[ETextureFilterType["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
    ETextureFilterType[ETextureFilterType["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
})(ETextureFilterType || (ETextureFilterType = {}));
/** @hidden */
var ETextureFormat;
(function (ETextureFormat) {
    ETextureFormat[ETextureFormat["ALPHA"] = 6406] = "ALPHA";
    ETextureFormat[ETextureFormat["RGB"] = 6407] = "RGB";
    ETextureFormat[ETextureFormat["RGBA"] = 6408] = "RGBA";
    ETextureFormat[ETextureFormat["LUMINANCE"] = 6409] = "LUMINANCE";
    ETextureFormat[ETextureFormat["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
})(ETextureFormat || (ETextureFormat = {}));
/** @hidden */
var ECullingType;
(function (ECullingType) {
    ECullingType[ECullingType["FRONT"] = 1028] = "FRONT";
    ECullingType[ECullingType["BACK"] = 1029] = "BACK";
    ECullingType[ECullingType["FRONT_AND_BACK"] = 1032] = "FRONT_AND_BACK";
})(ECullingType || (ECullingType = {}));
/** @hidden */
var EBlendingFunction;
(function (EBlendingFunction) {
    EBlendingFunction[EBlendingFunction["ZERO"] = 0] = "ZERO";
    EBlendingFunction[EBlendingFunction["ONE"] = 1] = "ONE";
    EBlendingFunction[EBlendingFunction["SRC_COLOR"] = 768] = "SRC_COLOR";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_SRC_COLOR"] = 769] = "ONE_MINUS_SRC_COLOR";
    EBlendingFunction[EBlendingFunction["DST_COLOR"] = 774] = "DST_COLOR";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_DST_COLOR"] = 775] = "ONE_MINUS_DST_COLOR";
    EBlendingFunction[EBlendingFunction["SRC_ALPHA"] = 770] = "SRC_ALPHA";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_SRC_ALPHA"] = 771] = "ONE_MINUS_SRC_ALPHA";
    EBlendingFunction[EBlendingFunction["DST_ALPHA"] = 772] = "DST_ALPHA";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_DST_ALPHA"] = 773] = "ONE_MINUS_DST_ALPHA";
    EBlendingFunction[EBlendingFunction["CONSTANT_COLOR"] = 32769] = "CONSTANT_COLOR";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_CONSTANT_COLOR"] = 32770] = "ONE_MINUS_CONSTANT_COLOR";
    EBlendingFunction[EBlendingFunction["CONSTANT_ALPHA"] = 32771] = "CONSTANT_ALPHA";
    EBlendingFunction[EBlendingFunction["ONE_MINUS_CONSTANT_ALPHA"] = 32772] = "ONE_MINUS_CONSTANT_ALPHA";
    EBlendingFunction[EBlendingFunction["SRC_ALPHA_SATURATE"] = 776] = "SRC_ALPHA_SATURATE";
})(EBlendingFunction || (EBlendingFunction = {}));

/**
* Utils functions for GLTF
* @hidden
*/
var GLTFUtils = /** @class */ (function () {
    function GLTFUtils() {
    }
    /**
     * Sets the given "parameter" matrix
     * @param scene: the Scene object
     * @param source: the source node where to pick the matrix
     * @param parameter: the GLTF technique parameter
     * @param uniformName: the name of the shader's uniform
     * @param shaderMaterial: the shader material
     */
    GLTFUtils.SetMatrix = function (scene, source, parameter, uniformName, shaderMaterial) {
        var mat = null;
        if (parameter.semantic === "MODEL") {
            mat = source.getWorldMatrix();
        }
        else if (parameter.semantic === "PROJECTION") {
            mat = scene.getProjectionMatrix();
        }
        else if (parameter.semantic === "VIEW") {
            mat = scene.getViewMatrix();
        }
        else if (parameter.semantic === "MODELVIEWINVERSETRANSPOSE") {
            mat = Matrix.Transpose(source.getWorldMatrix().multiply(scene.getViewMatrix()).invert());
        }
        else if (parameter.semantic === "MODELVIEW") {
            mat = source.getWorldMatrix().multiply(scene.getViewMatrix());
        }
        else if (parameter.semantic === "MODELVIEWPROJECTION") {
            mat = source.getWorldMatrix().multiply(scene.getTransformMatrix());
        }
        else if (parameter.semantic === "MODELINVERSE") {
            mat = source.getWorldMatrix().invert();
        }
        else if (parameter.semantic === "VIEWINVERSE") {
            mat = scene.getViewMatrix().invert();
        }
        else if (parameter.semantic === "PROJECTIONINVERSE") {
            mat = scene.getProjectionMatrix().invert();
        }
        else if (parameter.semantic === "MODELVIEWINVERSE") {
            mat = source.getWorldMatrix().multiply(scene.getViewMatrix()).invert();
        }
        else if (parameter.semantic === "MODELVIEWPROJECTIONINVERSE") {
            mat = source.getWorldMatrix().multiply(scene.getTransformMatrix()).invert();
        }
        else if (parameter.semantic === "MODELINVERSETRANSPOSE") {
            mat = Matrix.Transpose(source.getWorldMatrix().invert());
        }
        else {
            debugger;
        }
        if (mat) {
            switch (parameter.type) {
                case EParameterType.FLOAT_MAT2:
                    shaderMaterial.setMatrix2x2(uniformName, Matrix.GetAsMatrix2x2(mat));
                    break;
                case EParameterType.FLOAT_MAT3:
                    shaderMaterial.setMatrix3x3(uniformName, Matrix.GetAsMatrix3x3(mat));
                    break;
                case EParameterType.FLOAT_MAT4:
                    shaderMaterial.setMatrix(uniformName, mat);
                    break;
            }
        }
    };
    /**
     * Sets the given "parameter" matrix
     * @param shaderMaterial: the shader material
     * @param uniform: the name of the shader's uniform
     * @param value: the value of the uniform
     * @param type: the uniform's type (EParameterType FLOAT, VEC2, VEC3 or VEC4)
     */
    GLTFUtils.SetUniform = function (shaderMaterial, uniform, value, type) {
        switch (type) {
            case EParameterType.FLOAT:
                shaderMaterial.setFloat(uniform, value);
                return true;
            case EParameterType.FLOAT_VEC2:
                shaderMaterial.setVector2(uniform, Vector2.FromArray(value));
                return true;
            case EParameterType.FLOAT_VEC3:
                shaderMaterial.setVector3(uniform, Vector3.FromArray(value));
                return true;
            case EParameterType.FLOAT_VEC4:
                shaderMaterial.setVector4(uniform, Vector4.FromArray(value));
                return true;
            default: return false;
        }
    };
    /**
    * Returns the wrap mode of the texture
    * @param mode: the mode value
    */
    GLTFUtils.GetWrapMode = function (mode) {
        switch (mode) {
            case ETextureWrapMode.CLAMP_TO_EDGE: return Texture.CLAMP_ADDRESSMODE;
            case ETextureWrapMode.MIRRORED_REPEAT: return Texture.MIRROR_ADDRESSMODE;
            case ETextureWrapMode.REPEAT: return Texture.WRAP_ADDRESSMODE;
            default: return Texture.WRAP_ADDRESSMODE;
        }
    };
    /**
     * Returns the byte stride giving an accessor
     * @param accessor: the GLTF accessor objet
     */
    GLTFUtils.GetByteStrideFromType = function (accessor) {
        // Needs this function since "byteStride" isn't requiered in glTF format
        var type = accessor.type;
        switch (type) {
            case "VEC2": return 2;
            case "VEC3": return 3;
            case "VEC4": return 4;
            case "MAT2": return 4;
            case "MAT3": return 9;
            case "MAT4": return 16;
            default: return 1;
        }
    };
    /**
     * Returns the texture filter mode giving a mode value
     * @param mode: the filter mode value
     */
    GLTFUtils.GetTextureFilterMode = function (mode) {
        switch (mode) {
            case ETextureFilterType.LINEAR:
            case ETextureFilterType.LINEAR_MIPMAP_NEAREST:
            case ETextureFilterType.LINEAR_MIPMAP_LINEAR: return Texture.TRILINEAR_SAMPLINGMODE;
            case ETextureFilterType.NEAREST:
            case ETextureFilterType.NEAREST_MIPMAP_NEAREST: return Texture.NEAREST_SAMPLINGMODE;
            default: return Texture.BILINEAR_SAMPLINGMODE;
        }
    };
    GLTFUtils.GetBufferFromBufferView = function (gltfRuntime, bufferView, byteOffset, byteLength, componentType) {
        var byteOffset = bufferView.byteOffset + byteOffset;
        var loadedBufferView = gltfRuntime.loadedBufferViews[bufferView.buffer];
        if (byteOffset + byteLength > loadedBufferView.byteLength) {
            throw new Error("Buffer access is out of range");
        }
        var buffer = loadedBufferView.buffer;
        byteOffset += loadedBufferView.byteOffset;
        switch (componentType) {
            case EComponentType.BYTE: return new Int8Array(buffer, byteOffset, byteLength);
            case EComponentType.UNSIGNED_BYTE: return new Uint8Array(buffer, byteOffset, byteLength);
            case EComponentType.SHORT: return new Int16Array(buffer, byteOffset, byteLength);
            case EComponentType.UNSIGNED_SHORT: return new Uint16Array(buffer, byteOffset, byteLength);
            default: return new Float32Array(buffer, byteOffset, byteLength);
        }
    };
    /**
     * Returns a buffer from its accessor
     * @param gltfRuntime: the GLTF runtime
     * @param accessor: the GLTF accessor
     */
    GLTFUtils.GetBufferFromAccessor = function (gltfRuntime, accessor) {
        var bufferView = gltfRuntime.bufferViews[accessor.bufferView];
        var byteLength = accessor.count * GLTFUtils.GetByteStrideFromType(accessor);
        return GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, accessor.byteOffset, byteLength, accessor.componentType);
    };
    /**
     * Decodes a buffer view into a string
     * @param view: the buffer view
     */
    GLTFUtils.DecodeBufferToText = function (view) {
        var result = "";
        var length = view.byteLength;
        for (var i = 0; i < length; ++i) {
            result += String.fromCharCode(view[i]);
        }
        return result;
    };
    /**
     * Returns the default material of gltf. Related to
     * https://github.com/KhronosGroup/glTF/tree/master/specification/1.0#appendix-a-default-material
     * @param scene: the Babylon.js scene
     */
    GLTFUtils.GetDefaultMaterial = function (scene) {
        if (!GLTFUtils._DefaultMaterial) {
            Effect.ShadersStore["GLTFDefaultMaterialVertexShader"] = [
                "precision highp float;",
                "",
                "uniform mat4 worldView;",
                "uniform mat4 projection;",
                "",
                "attribute vec3 position;",
                "",
                "void main(void)",
                "{",
                "    gl_Position = projection * worldView * vec4(position, 1.0);",
                "}"
            ].join("\n");
            Effect.ShadersStore["GLTFDefaultMaterialPixelShader"] = [
                "precision highp float;",
                "",
                "uniform vec4 u_emission;",
                "",
                "void main(void)",
                "{",
                "    gl_FragColor = u_emission;",
                "}"
            ].join("\n");
            var shaderPath = {
                vertex: "GLTFDefaultMaterial",
                fragment: "GLTFDefaultMaterial"
            };
            var options = {
                attributes: ["position"],
                uniforms: ["worldView", "projection", "u_emission"],
                samplers: new Array(),
                needAlphaBlending: false
            };
            GLTFUtils._DefaultMaterial = new ShaderMaterial("GLTFDefaultMaterial", scene, shaderPath, options);
            GLTFUtils._DefaultMaterial.setColor4("u_emission", new Color4(0.5, 0.5, 0.5, 1.0));
        }
        return GLTFUtils._DefaultMaterial;
    };
    // The GLTF default material
    GLTFUtils._DefaultMaterial = null;
    return GLTFUtils;
}());

/**
* Tokenizer. Used for shaders compatibility
* Automatically map world, view, projection, worldViewProjection, attributes and so on
*/
var ETokenType;
(function (ETokenType) {
    ETokenType[ETokenType["IDENTIFIER"] = 1] = "IDENTIFIER";
    ETokenType[ETokenType["UNKNOWN"] = 2] = "UNKNOWN";
    ETokenType[ETokenType["END_OF_INPUT"] = 3] = "END_OF_INPUT";
})(ETokenType || (ETokenType = {}));
var Tokenizer = /** @class */ (function () {
    function Tokenizer(toParse) {
        this._pos = 0;
        this.currentToken = ETokenType.UNKNOWN;
        this.currentIdentifier = "";
        this.currentString = "";
        this.isLetterOrDigitPattern = /^[a-zA-Z0-9]+$/;
        this._toParse = toParse;
        this._maxPos = toParse.length;
    }
    Tokenizer.prototype.getNextToken = function () {
        if (this.isEnd()) {
            return ETokenType.END_OF_INPUT;
        }
        this.currentString = this.read();
        this.currentToken = ETokenType.UNKNOWN;
        if (this.currentString === "_" || this.isLetterOrDigitPattern.test(this.currentString)) {
            this.currentToken = ETokenType.IDENTIFIER;
            this.currentIdentifier = this.currentString;
            while (!this.isEnd() && (this.isLetterOrDigitPattern.test(this.currentString = this.peek()) || this.currentString === "_")) {
                this.currentIdentifier += this.currentString;
                this.forward();
            }
        }
        return this.currentToken;
    };
    Tokenizer.prototype.peek = function () {
        return this._toParse[this._pos];
    };
    Tokenizer.prototype.read = function () {
        return this._toParse[this._pos++];
    };
    Tokenizer.prototype.forward = function () {
        this._pos++;
    };
    Tokenizer.prototype.isEnd = function () {
        return this._pos >= this._maxPos;
    };
    return Tokenizer;
}());
/**
* Values
*/
var glTFTransforms = ["MODEL", "VIEW", "PROJECTION", "MODELVIEW", "MODELVIEWPROJECTION", "JOINTMATRIX"];
var babylonTransforms = ["world", "view", "projection", "worldView", "worldViewProjection", "mBones"];
var glTFAnimationPaths = ["translation", "rotation", "scale"];
var babylonAnimationPaths = ["position", "rotationQuaternion", "scaling"];
/**
* Parse
*/
var parseBuffers = function (parsedBuffers, gltfRuntime) {
    for (var buf in parsedBuffers) {
        var parsedBuffer = parsedBuffers[buf];
        gltfRuntime.buffers[buf] = parsedBuffer;
        gltfRuntime.buffersCount++;
    }
};
var parseShaders = function (parsedShaders, gltfRuntime) {
    for (var sha in parsedShaders) {
        var parsedShader = parsedShaders[sha];
        gltfRuntime.shaders[sha] = parsedShader;
        gltfRuntime.shaderscount++;
    }
};
var parseObject = function (parsedObjects, runtimeProperty, gltfRuntime) {
    for (var object in parsedObjects) {
        var parsedObject = parsedObjects[object];
        gltfRuntime[runtimeProperty][object] = parsedObject;
    }
};
/**
* Utils
*/
var normalizeUVs = function (buffer) {
    if (!buffer) {
        return;
    }
    for (var i = 0; i < buffer.length / 2; i++) {
        buffer[i * 2 + 1] = 1.0 - buffer[i * 2 + 1];
    }
};
var getAttribute = function (attributeParameter) {
    if (attributeParameter.semantic === "NORMAL") {
        return "normal";
    }
    else if (attributeParameter.semantic === "POSITION") {
        return "position";
    }
    else if (attributeParameter.semantic === "JOINT") {
        return "matricesIndices";
    }
    else if (attributeParameter.semantic === "WEIGHT") {
        return "matricesWeights";
    }
    else if (attributeParameter.semantic === "COLOR") {
        return "color";
    }
    else if (attributeParameter.semantic && attributeParameter.semantic.indexOf("TEXCOORD_") !== -1) {
        var channel = Number(attributeParameter.semantic.split("_")[1]);
        return "uv" + (channel === 0 ? "" : channel + 1);
    }
    return null;
};
/**
* Loads and creates animations
*/
var loadAnimations = function (gltfRuntime) {
    for (var anim in gltfRuntime.animations) {
        var animation = gltfRuntime.animations[anim];
        if (!animation.channels || !animation.samplers) {
            continue;
        }
        var lastAnimation = null;
        for (var i = 0; i < animation.channels.length; i++) {
            // Get parameters and load buffers
            var channel = animation.channels[i];
            var sampler = animation.samplers[channel.sampler];
            if (!sampler) {
                continue;
            }
            var inputData = null;
            var outputData = null;
            if (animation.parameters) {
                inputData = animation.parameters[sampler.input];
                outputData = animation.parameters[sampler.output];
            }
            else {
                inputData = sampler.input;
                outputData = sampler.output;
            }
            var bufferInput = GLTFUtils.GetBufferFromAccessor(gltfRuntime, gltfRuntime.accessors[inputData]);
            var bufferOutput = GLTFUtils.GetBufferFromAccessor(gltfRuntime, gltfRuntime.accessors[outputData]);
            var targetID = channel.target.id;
            var targetNode = gltfRuntime.scene.getNodeByID(targetID);
            if (targetNode === null) {
                targetNode = gltfRuntime.scene.getNodeByName(targetID);
            }
            if (targetNode === null) {
                Tools.Warn("Creating animation named " + anim + ". But cannot find node named " + targetID + " to attach to");
                continue;
            }
            var isBone = targetNode instanceof Bone;
            // Get target path (position, rotation or scaling)
            var targetPath = channel.target.path;
            var targetPathIndex = glTFAnimationPaths.indexOf(targetPath);
            if (targetPathIndex !== -1) {
                targetPath = babylonAnimationPaths[targetPathIndex];
            }
            // Determine animation type
            var animationType = Animation.ANIMATIONTYPE_MATRIX;
            if (!isBone) {
                if (targetPath === "rotationQuaternion") {
                    animationType = Animation.ANIMATIONTYPE_QUATERNION;
                    targetNode.rotationQuaternion = new Quaternion();
                }
                else {
                    animationType = Animation.ANIMATIONTYPE_VECTOR3;
                }
            }
            // Create animation and key frames
            var babylonAnimation = null;
            var keys = [];
            var arrayOffset = 0;
            var modifyKey = false;
            if (isBone && lastAnimation && lastAnimation.getKeys().length === bufferInput.length) {
                babylonAnimation = lastAnimation;
                modifyKey = true;
            }
            if (!modifyKey) {
                gltfRuntime.scene._blockEntityCollection = gltfRuntime.forAssetContainer;
                babylonAnimation = new Animation(anim, isBone ? "_matrix" : targetPath, 1, animationType, Animation.ANIMATIONLOOPMODE_CYCLE);
                gltfRuntime.scene._blockEntityCollection = false;
            }
            // For each frame
            for (var j = 0; j < bufferInput.length; j++) {
                var value = null;
                if (targetPath === "rotationQuaternion") { // VEC4
                    value = Quaternion.FromArray([bufferOutput[arrayOffset], bufferOutput[arrayOffset + 1], bufferOutput[arrayOffset + 2], bufferOutput[arrayOffset + 3]]);
                    arrayOffset += 4;
                }
                else { // Position and scaling are VEC3
                    value = Vector3.FromArray([bufferOutput[arrayOffset], bufferOutput[arrayOffset + 1], bufferOutput[arrayOffset + 2]]);
                    arrayOffset += 3;
                }
                if (isBone) {
                    var bone = targetNode;
                    var translation = Vector3.Zero();
                    var rotationQuaternion = new Quaternion();
                    var scaling = Vector3.Zero();
                    // Warning on decompose
                    var mat = bone.getBaseMatrix();
                    if (modifyKey && lastAnimation) {
                        mat = lastAnimation.getKeys()[j].value;
                    }
                    mat.decompose(scaling, rotationQuaternion, translation);
                    if (targetPath === "position") {
                        translation = value;
                    }
                    else if (targetPath === "rotationQuaternion") {
                        rotationQuaternion = value;
                    }
                    else {
                        scaling = value;
                    }
                    value = Matrix.Compose(scaling, rotationQuaternion, translation);
                }
                if (!modifyKey) {
                    keys.push({
                        frame: bufferInput[j],
                        value: value
                    });
                }
                else if (lastAnimation) {
                    lastAnimation.getKeys()[j].value = value;
                }
            }
            // Finish
            if (!modifyKey && babylonAnimation) {
                babylonAnimation.setKeys(keys);
                targetNode.animations.push(babylonAnimation);
            }
            lastAnimation = babylonAnimation;
            gltfRuntime.scene.stopAnimation(targetNode);
            gltfRuntime.scene.beginAnimation(targetNode, 0, bufferInput[bufferInput.length - 1], true, 1.0);
        }
    }
};
/**
* Returns the bones transformation matrix
*/
var configureBoneTransformation = function (node) {
    var mat = null;
    if (node.translation || node.rotation || node.scale) {
        var scale = Vector3.FromArray(node.scale || [1, 1, 1]);
        var rotation = Quaternion.FromArray(node.rotation || [0, 0, 0, 1]);
        var position = Vector3.FromArray(node.translation || [0, 0, 0]);
        mat = Matrix.Compose(scale, rotation, position);
    }
    else {
        mat = Matrix.FromArray(node.matrix);
    }
    return mat;
};
/**
* Returns the parent bone
*/
var getParentBone = function (gltfRuntime, skins, jointName, newSkeleton) {
    // Try to find
    for (var i = 0; i < newSkeleton.bones.length; i++) {
        if (newSkeleton.bones[i].name === jointName) {
            return newSkeleton.bones[i];
        }
    }
    // Not found, search in gltf nodes
    var nodes = gltfRuntime.nodes;
    for (var nde in nodes) {
        var node = nodes[nde];
        if (!node.jointName) {
            continue;
        }
        var children = node.children;
        for (var i = 0; i < children.length; i++) {
            var child = gltfRuntime.nodes[children[i]];
            if (!child.jointName) {
                continue;
            }
            if (child.jointName === jointName) {
                var mat = configureBoneTransformation(node);
                var bone = new Bone(node.name || "", newSkeleton, getParentBone(gltfRuntime, skins, node.jointName, newSkeleton), mat);
                bone.id = nde;
                return bone;
            }
        }
    }
    return null;
};
/**
* Returns the appropriate root node
*/
var getNodeToRoot = function (nodesToRoot, id) {
    for (var i = 0; i < nodesToRoot.length; i++) {
        var nodeToRoot = nodesToRoot[i];
        for (var j = 0; j < nodeToRoot.node.children.length; j++) {
            var child = nodeToRoot.node.children[j];
            if (child === id) {
                return nodeToRoot.bone;
            }
        }
    }
    return null;
};
/**
* Returns the node with the joint name
*/
var getJointNode = function (gltfRuntime, jointName) {
    var nodes = gltfRuntime.nodes;
    var node = nodes[jointName];
    if (node) {
        return {
            node: node,
            id: jointName
        };
    }
    for (var nde in nodes) {
        node = nodes[nde];
        if (node.jointName === jointName) {
            return {
                node: node,
                id: nde
            };
        }
    }
    return null;
};
/**
* Checks if a nodes is in joints
*/
var nodeIsInJoints = function (skins, id) {
    for (var i = 0; i < skins.jointNames.length; i++) {
        if (skins.jointNames[i] === id) {
            return true;
        }
    }
    return false;
};
/**
* Fills the nodes to root for bones and builds hierarchy
*/
var getNodesToRoot = function (gltfRuntime, newSkeleton, skins, nodesToRoot) {
    // Creates nodes for root
    for (var nde in gltfRuntime.nodes) {
        var node = gltfRuntime.nodes[nde];
        var id = nde;
        if (!node.jointName || nodeIsInJoints(skins, node.jointName)) {
            continue;
        }
        // Create node to root bone
        var mat = configureBoneTransformation(node);
        var bone = new Bone(node.name || "", newSkeleton, null, mat);
        bone.id = id;
        nodesToRoot.push({ bone: bone, node: node, id: id });
    }
    // Parenting
    for (var i = 0; i < nodesToRoot.length; i++) {
        var nodeToRoot = nodesToRoot[i];
        var children = nodeToRoot.node.children;
        for (var j = 0; j < children.length; j++) {
            var child = null;
            for (var k = 0; k < nodesToRoot.length; k++) {
                if (nodesToRoot[k].id === children[j]) {
                    child = nodesToRoot[k];
                    break;
                }
            }
            if (child) {
                child.bone._parent = nodeToRoot.bone;
                nodeToRoot.bone.children.push(child.bone);
            }
        }
    }
};
/**
* Imports a skeleton
*/
var importSkeleton = function (gltfRuntime, skins, mesh, newSkeleton, id) {
    if (!newSkeleton) {
        newSkeleton = new Skeleton(skins.name || "", "", gltfRuntime.scene);
    }
    if (!skins.babylonSkeleton) {
        return newSkeleton;
    }
    // Find the root bones
    var nodesToRoot = [];
    var nodesToRootToAdd = [];
    getNodesToRoot(gltfRuntime, newSkeleton, skins, nodesToRoot);
    newSkeleton.bones = [];
    // Joints
    for (var i = 0; i < skins.jointNames.length; i++) {
        var jointNode = getJointNode(gltfRuntime, skins.jointNames[i]);
        if (!jointNode) {
            continue;
        }
        var node = jointNode.node;
        if (!node) {
            Tools.Warn("Joint named " + skins.jointNames[i] + " does not exist");
            continue;
        }
        var id = jointNode.id;
        // Optimize, if the bone already exists...
        var existingBone = gltfRuntime.scene.getBoneByID(id);
        if (existingBone) {
            newSkeleton.bones.push(existingBone);
            continue;
        }
        // Search for parent bone
        var foundBone = false;
        var parentBone = null;
        for (var j = 0; j < i; j++) {
            var jointNode_1 = getJointNode(gltfRuntime, skins.jointNames[j]);
            if (!jointNode_1) {
                continue;
            }
            var joint = jointNode_1.node;
            if (!joint) {
                Tools.Warn("Joint named " + skins.jointNames[j] + " does not exist when looking for parent");
                continue;
            }
            var children = joint.children;
            if (!children) {
                continue;
            }
            foundBone = false;
            for (var k = 0; k < children.length; k++) {
                if (children[k] === id) {
                    parentBone = getParentBone(gltfRuntime, skins, skins.jointNames[j], newSkeleton);
                    foundBone = true;
                    break;
                }
            }
            if (foundBone) {
                break;
            }
        }
        // Create bone
        var mat = configureBoneTransformation(node);
        if (!parentBone && nodesToRoot.length > 0) {
            parentBone = getNodeToRoot(nodesToRoot, id);
            if (parentBone) {
                if (nodesToRootToAdd.indexOf(parentBone) === -1) {
                    nodesToRootToAdd.push(parentBone);
                }
            }
        }
        var bone = new Bone(node.jointName || "", newSkeleton, parentBone, mat);
        bone.id = id;
    }
    // Polish
    var bones = newSkeleton.bones;
    newSkeleton.bones = [];
    for (var i = 0; i < skins.jointNames.length; i++) {
        var jointNode = getJointNode(gltfRuntime, skins.jointNames[i]);
        if (!jointNode) {
            continue;
        }
        for (var j = 0; j < bones.length; j++) {
            if (bones[j].id === jointNode.id) {
                newSkeleton.bones.push(bones[j]);
                break;
            }
        }
    }
    newSkeleton.prepare();
    // Finish
    for (var i = 0; i < nodesToRootToAdd.length; i++) {
        newSkeleton.bones.push(nodesToRootToAdd[i]);
    }
    return newSkeleton;
};
/**
* Imports a mesh and its geometries
*/
var importMesh = function (gltfRuntime, node, meshes, id, newMesh) {
    if (!newMesh) {
        gltfRuntime.scene._blockEntityCollection = gltfRuntime.forAssetContainer;
        newMesh = new Mesh(node.name || "", gltfRuntime.scene);
        gltfRuntime.scene._blockEntityCollection = false;
        newMesh.id = id;
    }
    if (!node.babylonNode) {
        return newMesh;
    }
    var subMaterials = [];
    var vertexData = null;
    var verticesStarts = new Array();
    var verticesCounts = new Array();
    var indexStarts = new Array();
    var indexCounts = new Array();
    for (var meshIndex = 0; meshIndex < meshes.length; meshIndex++) {
        var meshID = meshes[meshIndex];
        var mesh = gltfRuntime.meshes[meshID];
        if (!mesh) {
            continue;
        }
        // Positions, normals and UVs
        for (var i = 0; i < mesh.primitives.length; i++) {
            // Temporary vertex data
            var tempVertexData = new VertexData();
            var primitive = mesh.primitives[i];
            if (primitive.mode !== 4) ;
            var attributes = primitive.attributes;
            var accessor = null;
            var buffer = null;
            // Set positions, normal and uvs
            for (var semantic in attributes) {
                // Link accessor and buffer view
                accessor = gltfRuntime.accessors[attributes[semantic]];
                buffer = GLTFUtils.GetBufferFromAccessor(gltfRuntime, accessor);
                if (semantic === "NORMAL") {
                    tempVertexData.normals = new Float32Array(buffer.length);
                    tempVertexData.normals.set(buffer);
                }
                else if (semantic === "POSITION") {
                    if (GLTFFileLoader.HomogeneousCoordinates) {
                        tempVertexData.positions = new Float32Array(buffer.length - buffer.length / 4);
                        for (var j = 0; j < buffer.length; j += 4) {
                            tempVertexData.positions[j] = buffer[j];
                            tempVertexData.positions[j + 1] = buffer[j + 1];
                            tempVertexData.positions[j + 2] = buffer[j + 2];
                        }
                    }
                    else {
                        tempVertexData.positions = new Float32Array(buffer.length);
                        tempVertexData.positions.set(buffer);
                    }
                    verticesCounts.push(tempVertexData.positions.length);
                }
                else if (semantic.indexOf("TEXCOORD_") !== -1) {
                    var channel = Number(semantic.split("_")[1]);
                    var uvKind = VertexBuffer.UVKind + (channel === 0 ? "" : (channel + 1));
                    var uvs = new Float32Array(buffer.length);
                    uvs.set(buffer);
                    normalizeUVs(uvs);
                    tempVertexData.set(uvs, uvKind);
                }
                else if (semantic === "JOINT") {
                    tempVertexData.matricesIndices = new Float32Array(buffer.length);
                    tempVertexData.matricesIndices.set(buffer);
                }
                else if (semantic === "WEIGHT") {
                    tempVertexData.matricesWeights = new Float32Array(buffer.length);
                    tempVertexData.matricesWeights.set(buffer);
                }
                else if (semantic === "COLOR") {
                    tempVertexData.colors = new Float32Array(buffer.length);
                    tempVertexData.colors.set(buffer);
                }
            }
            // Indices
            accessor = gltfRuntime.accessors[primitive.indices];
            if (accessor) {
                buffer = GLTFUtils.GetBufferFromAccessor(gltfRuntime, accessor);
                tempVertexData.indices = new Int32Array(buffer.length);
                tempVertexData.indices.set(buffer);
                indexCounts.push(tempVertexData.indices.length);
            }
            else {
                // Set indices on the fly
                var indices = [];
                for (var j = 0; j < tempVertexData.positions.length / 3; j++) {
                    indices.push(j);
                }
                tempVertexData.indices = new Int32Array(indices);
                indexCounts.push(tempVertexData.indices.length);
            }
            if (!vertexData) {
                vertexData = tempVertexData;
            }
            else {
                vertexData.merge(tempVertexData);
            }
            // Sub material
            var material_1 = gltfRuntime.scene.getMaterialByID(primitive.material);
            subMaterials.push(material_1 === null ? GLTFUtils.GetDefaultMaterial(gltfRuntime.scene) : material_1);
            // Update vertices start and index start
            verticesStarts.push(verticesStarts.length === 0 ? 0 : verticesStarts[verticesStarts.length - 1] + verticesCounts[verticesCounts.length - 2]);
            indexStarts.push(indexStarts.length === 0 ? 0 : indexStarts[indexStarts.length - 1] + indexCounts[indexCounts.length - 2]);
        }
    }
    var material;
    gltfRuntime.scene._blockEntityCollection = gltfRuntime.forAssetContainer;
    if (subMaterials.length > 1) {
        material = new MultiMaterial("multimat" + id, gltfRuntime.scene);
        material.subMaterials = subMaterials;
    }
    else {
        material = new StandardMaterial("multimat" + id, gltfRuntime.scene);
    }
    if (subMaterials.length === 1) {
        material = subMaterials[0];
    }
    if (!newMesh.material) {
        newMesh.material = material;
    }
    // Apply geometry
    new Geometry(id, gltfRuntime.scene, vertexData, false, newMesh);
    newMesh.computeWorldMatrix(true);
    gltfRuntime.scene._blockEntityCollection = false;
    // Apply submeshes
    newMesh.subMeshes = [];
    var index = 0;
    for (var meshIndex = 0; meshIndex < meshes.length; meshIndex++) {
        var meshID = meshes[meshIndex];
        var mesh = gltfRuntime.meshes[meshID];
        if (!mesh) {
            continue;
        }
        for (var i = 0; i < mesh.primitives.length; i++) {
            if (mesh.primitives[i].mode !== 4) ;
            SubMesh.AddToMesh(index, verticesStarts[index], verticesCounts[index], indexStarts[index], indexCounts[index], newMesh, newMesh, true);
            index++;
        }
    }
    // Finish
    return newMesh;
};
/**
* Configure node transformation from position, rotation and scaling
*/
var configureNode = function (newNode, position, rotation, scaling) {
    if (newNode.position) {
        newNode.position = position;
    }
    if (newNode.rotationQuaternion || newNode.rotation) {
        newNode.rotationQuaternion = rotation;
    }
    if (newNode.scaling) {
        newNode.scaling = scaling;
    }
};
/**
* Configures node from transformation matrix
*/
var configureNodeFromMatrix = function (newNode, node, parent) {
    if (node.matrix) {
        var position = new Vector3(0, 0, 0);
        var rotation = new Quaternion();
        var scaling = new Vector3(0, 0, 0);
        var mat = Matrix.FromArray(node.matrix);
        mat.decompose(scaling, rotation, position);
        configureNode(newNode, position, rotation, scaling);
    }
    else if (node.translation && node.rotation && node.scale) {
        configureNode(newNode, Vector3.FromArray(node.translation), Quaternion.FromArray(node.rotation), Vector3.FromArray(node.scale));
    }
    newNode.computeWorldMatrix(true);
};
/**
* Imports a node
*/
var importNode = function (gltfRuntime, node, id, parent) {
    var lastNode = null;
    if (gltfRuntime.importOnlyMeshes && (node.skin || node.meshes)) {
        if (gltfRuntime.importMeshesNames && gltfRuntime.importMeshesNames.length > 0 && gltfRuntime.importMeshesNames.indexOf(node.name || "") === -1) {
            return null;
        }
    }
    // Meshes
    if (node.skin) {
        if (node.meshes) {
            var skin = gltfRuntime.skins[node.skin];
            var newMesh = importMesh(gltfRuntime, node, node.meshes, id, node.babylonNode);
            newMesh.skeleton = gltfRuntime.scene.getLastSkeletonByID(node.skin);
            if (newMesh.skeleton === null) {
                newMesh.skeleton = importSkeleton(gltfRuntime, skin, newMesh, skin.babylonSkeleton, node.skin);
                if (!skin.babylonSkeleton) {
                    skin.babylonSkeleton = newMesh.skeleton;
                }
            }
            lastNode = newMesh;
        }
    }
    else if (node.meshes) {
        /**
        * Improve meshes property
        */
        var newMesh = importMesh(gltfRuntime, node, node.mesh ? [node.mesh] : node.meshes, id, node.babylonNode);
        lastNode = newMesh;
    }
    // Lights
    else if (node.light && !node.babylonNode && !gltfRuntime.importOnlyMeshes) {
        var light = gltfRuntime.lights[node.light];
        if (light) {
            if (light.type === "ambient") {
                var ambienLight = light[light.type];
                var hemiLight = new HemisphericLight(node.light, Vector3.Zero(), gltfRuntime.scene);
                hemiLight.name = node.name || "";
                if (ambienLight.color) {
                    hemiLight.diffuse = Color3.FromArray(ambienLight.color);
                }
                lastNode = hemiLight;
            }
            else if (light.type === "directional") {
                var directionalLight = light[light.type];
                var dirLight = new DirectionalLight(node.light, Vector3.Zero(), gltfRuntime.scene);
                dirLight.name = node.name || "";
                if (directionalLight.color) {
                    dirLight.diffuse = Color3.FromArray(directionalLight.color);
                }
                lastNode = dirLight;
            }
            else if (light.type === "point") {
                var pointLight = light[light.type];
                var ptLight = new PointLight(node.light, Vector3.Zero(), gltfRuntime.scene);
                ptLight.name = node.name || "";
                if (pointLight.color) {
                    ptLight.diffuse = Color3.FromArray(pointLight.color);
                }
                lastNode = ptLight;
            }
            else if (light.type === "spot") {
                var spotLight = light[light.type];
                var spLight = new SpotLight(node.light, Vector3.Zero(), Vector3.Zero(), 0, 0, gltfRuntime.scene);
                spLight.name = node.name || "";
                if (spotLight.color) {
                    spLight.diffuse = Color3.FromArray(spotLight.color);
                }
                if (spotLight.fallOfAngle) {
                    spLight.angle = spotLight.fallOfAngle;
                }
                if (spotLight.fallOffExponent) {
                    spLight.exponent = spotLight.fallOffExponent;
                }
                lastNode = spLight;
            }
        }
    }
    // Cameras
    else if (node.camera && !node.babylonNode && !gltfRuntime.importOnlyMeshes) {
        var camera = gltfRuntime.cameras[node.camera];
        if (camera) {
            gltfRuntime.scene._blockEntityCollection = gltfRuntime.forAssetContainer;
            if (camera.type === "orthographic") {
                var orthoCamera = new FreeCamera(node.camera, Vector3.Zero(), gltfRuntime.scene, false);
                orthoCamera.name = node.name || "";
                orthoCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
                orthoCamera.attachControl();
                lastNode = orthoCamera;
            }
            else if (camera.type === "perspective") {
                var perspectiveCamera = camera[camera.type];
                var persCamera = new FreeCamera(node.camera, Vector3.Zero(), gltfRuntime.scene, false);
                persCamera.name = node.name || "";
                persCamera.attachControl();
                if (!perspectiveCamera.aspectRatio) {
                    perspectiveCamera.aspectRatio = gltfRuntime.scene.getEngine().getRenderWidth() / gltfRuntime.scene.getEngine().getRenderHeight();
                }
                if (perspectiveCamera.znear && perspectiveCamera.zfar) {
                    persCamera.maxZ = perspectiveCamera.zfar;
                    persCamera.minZ = perspectiveCamera.znear;
                }
                lastNode = persCamera;
            }
            gltfRuntime.scene._blockEntityCollection = false;
        }
    }
    // Empty node
    if (!node.jointName) {
        if (node.babylonNode) {
            return node.babylonNode;
        }
        else if (lastNode === null) {
            gltfRuntime.scene._blockEntityCollection = gltfRuntime.forAssetContainer;
            var dummy = new Mesh(node.name || "", gltfRuntime.scene);
            gltfRuntime.scene._blockEntityCollection = false;
            node.babylonNode = dummy;
            lastNode = dummy;
        }
    }
    if (lastNode !== null) {
        if (node.matrix && lastNode instanceof Mesh) {
            configureNodeFromMatrix(lastNode, node);
        }
        else {
            var translation = node.translation || [0, 0, 0];
            var rotation = node.rotation || [0, 0, 0, 1];
            var scale = node.scale || [1, 1, 1];
            configureNode(lastNode, Vector3.FromArray(translation), Quaternion.FromArray(rotation), Vector3.FromArray(scale));
        }
        lastNode.updateCache(true);
        node.babylonNode = lastNode;
    }
    return lastNode;
};
/**
* Traverses nodes and creates them
*/
var traverseNodes = function (gltfRuntime, id, parent, meshIncluded) {
    if (meshIncluded === void 0) { meshIncluded = false; }
    var node = gltfRuntime.nodes[id];
    var newNode = null;
    if (gltfRuntime.importOnlyMeshes && !meshIncluded && gltfRuntime.importMeshesNames) {
        if (gltfRuntime.importMeshesNames.indexOf(node.name || "") !== -1 || gltfRuntime.importMeshesNames.length === 0) {
            meshIncluded = true;
        }
        else {
            meshIncluded = false;
        }
    }
    else {
        meshIncluded = true;
    }
    if (!node.jointName && meshIncluded) {
        newNode = importNode(gltfRuntime, node, id);
        if (newNode !== null) {
            newNode.id = id;
            newNode.parent = parent;
        }
    }
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            traverseNodes(gltfRuntime, node.children[i], newNode, meshIncluded);
        }
    }
};
/**
* do stuff after buffers, shaders are loaded (e.g. hook up materials, load animations, etc.)
*/
var postLoad = function (gltfRuntime) {
    // Nodes
    var currentScene = gltfRuntime.currentScene;
    if (currentScene) {
        for (var i = 0; i < currentScene.nodes.length; i++) {
            traverseNodes(gltfRuntime, currentScene.nodes[i], null);
        }
    }
    else {
        for (var thing in gltfRuntime.scenes) {
            currentScene = gltfRuntime.scenes[thing];
            for (var i = 0; i < currentScene.nodes.length; i++) {
                traverseNodes(gltfRuntime, currentScene.nodes[i], null);
            }
        }
    }
    // Set animations
    loadAnimations(gltfRuntime);
    for (var i = 0; i < gltfRuntime.scene.skeletons.length; i++) {
        var skeleton = gltfRuntime.scene.skeletons[i];
        gltfRuntime.scene.beginAnimation(skeleton, 0, Number.MAX_VALUE, true, 1.0);
    }
};
/**
* onBind shaderrs callback to set uniforms and matrices
*/
var onBindShaderMaterial = function (mesh, gltfRuntime, unTreatedUniforms, shaderMaterial, technique, material, onSuccess) {
    var materialValues = material.values || technique.parameters;
    for (var unif in unTreatedUniforms) {
        var uniform = unTreatedUniforms[unif];
        var type = uniform.type;
        if (type === EParameterType.FLOAT_MAT2 || type === EParameterType.FLOAT_MAT3 || type === EParameterType.FLOAT_MAT4) {
            if (uniform.semantic && !uniform.source && !uniform.node) {
                GLTFUtils.SetMatrix(gltfRuntime.scene, mesh, uniform, unif, shaderMaterial.getEffect());
            }
            else if (uniform.semantic && (uniform.source || uniform.node)) {
                var source = gltfRuntime.scene.getNodeByName(uniform.source || uniform.node || "");
                if (source === null) {
                    source = gltfRuntime.scene.getNodeByID(uniform.source || uniform.node || "");
                }
                if (source === null) {
                    continue;
                }
                GLTFUtils.SetMatrix(gltfRuntime.scene, source, uniform, unif, shaderMaterial.getEffect());
            }
        }
        else {
            var value = materialValues[technique.uniforms[unif]];
            if (!value) {
                continue;
            }
            if (type === EParameterType.SAMPLER_2D) {
                var texture = gltfRuntime.textures[material.values ? value : uniform.value].babylonTexture;
                if (texture === null || texture === undefined) {
                    continue;
                }
                shaderMaterial.getEffect().setTexture(unif, texture);
            }
            else {
                GLTFUtils.SetUniform((shaderMaterial.getEffect()), unif, value, type);
            }
        }
    }
    onSuccess(shaderMaterial);
};
/**
* Prepare uniforms to send the only one time
* Loads the appropriate textures
*/
var prepareShaderMaterialUniforms = function (gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms) {
    var materialValues = material.values || technique.parameters;
    var techniqueUniforms = technique.uniforms;
    /**
    * Prepare values here (not matrices)
    */
    for (var unif in unTreatedUniforms) {
        var uniform = unTreatedUniforms[unif];
        var type = uniform.type;
        var value = materialValues[techniqueUniforms[unif]];
        if (value === undefined) {
            // In case the value is the same for all materials
            value = uniform.value;
        }
        if (!value) {
            continue;
        }
        var onLoadTexture = function (uniformName) {
            return function (texture) {
                if (uniform.value && uniformName) {
                    // Static uniform
                    shaderMaterial.setTexture(uniformName, texture);
                    delete unTreatedUniforms[uniformName];
                }
            };
        };
        // Texture (sampler2D)
        if (type === EParameterType.SAMPLER_2D) {
            GLTFLoaderExtension.LoadTextureAsync(gltfRuntime, material.values ? value : uniform.value, onLoadTexture(unif), function () { return onLoadTexture(null); });
        }
        // Others
        else {
            if (uniform.value && GLTFUtils.SetUniform(shaderMaterial, unif, material.values ? value : uniform.value, type)) {
                // Static uniform
                delete unTreatedUniforms[unif];
            }
        }
    }
};
/**
* Shader compilation failed
*/
var onShaderCompileError = function (program, shaderMaterial, onError) {
    return function (effect, error) {
        shaderMaterial.dispose(true);
        onError("Cannot compile program named " + program.name + ". Error: " + error + ". Default material will be applied");
    };
};
/**
* Shader compilation success
*/
var onShaderCompileSuccess = function (gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms, onSuccess) {
    return function (_) {
        prepareShaderMaterialUniforms(gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms);
        shaderMaterial.onBind = function (mesh) {
            onBindShaderMaterial(mesh, gltfRuntime, unTreatedUniforms, shaderMaterial, technique, material, onSuccess);
        };
    };
};
/**
* Returns the appropriate uniform if already handled by babylon
*/
var parseShaderUniforms = function (tokenizer, technique, unTreatedUniforms) {
    for (var unif in technique.uniforms) {
        var uniform = technique.uniforms[unif];
        var uniformParameter = technique.parameters[uniform];
        if (tokenizer.currentIdentifier === unif) {
            if (uniformParameter.semantic && !uniformParameter.source && !uniformParameter.node) {
                var transformIndex = glTFTransforms.indexOf(uniformParameter.semantic);
                if (transformIndex !== -1) {
                    delete unTreatedUniforms[unif];
                    return babylonTransforms[transformIndex];
                }
            }
        }
    }
    return tokenizer.currentIdentifier;
};
/**
* All shaders loaded. Create materials one by one
*/
var importMaterials = function (gltfRuntime) {
    // Create materials
    for (var mat in gltfRuntime.materials) {
        GLTFLoaderExtension.LoadMaterialAsync(gltfRuntime, mat, function (material) { }, function () { });
    }
};
/**
* Implementation of the base glTF spec
* @hidden
*/
var GLTFLoaderBase = /** @class */ (function () {
    function GLTFLoaderBase() {
    }
    GLTFLoaderBase.CreateRuntime = function (parsedData, scene, rootUrl) {
        var gltfRuntime = {
            extensions: {},
            accessors: {},
            buffers: {},
            bufferViews: {},
            meshes: {},
            lights: {},
            cameras: {},
            nodes: {},
            images: {},
            textures: {},
            shaders: {},
            programs: {},
            samplers: {},
            techniques: {},
            materials: {},
            animations: {},
            skins: {},
            extensionsUsed: [],
            scenes: {},
            buffersCount: 0,
            shaderscount: 0,
            scene: scene,
            rootUrl: rootUrl,
            loadedBufferCount: 0,
            loadedBufferViews: {},
            loadedShaderCount: 0,
            importOnlyMeshes: false,
            dummyNodes: [],
            forAssetContainer: false
        };
        // Parse
        if (parsedData.extensions) {
            parseObject(parsedData.extensions, "extensions", gltfRuntime);
        }
        if (parsedData.extensionsUsed) {
            parseObject(parsedData.extensionsUsed, "extensionsUsed", gltfRuntime);
        }
        if (parsedData.buffers) {
            parseBuffers(parsedData.buffers, gltfRuntime);
        }
        if (parsedData.bufferViews) {
            parseObject(parsedData.bufferViews, "bufferViews", gltfRuntime);
        }
        if (parsedData.accessors) {
            parseObject(parsedData.accessors, "accessors", gltfRuntime);
        }
        if (parsedData.meshes) {
            parseObject(parsedData.meshes, "meshes", gltfRuntime);
        }
        if (parsedData.lights) {
            parseObject(parsedData.lights, "lights", gltfRuntime);
        }
        if (parsedData.cameras) {
            parseObject(parsedData.cameras, "cameras", gltfRuntime);
        }
        if (parsedData.nodes) {
            parseObject(parsedData.nodes, "nodes", gltfRuntime);
        }
        if (parsedData.images) {
            parseObject(parsedData.images, "images", gltfRuntime);
        }
        if (parsedData.textures) {
            parseObject(parsedData.textures, "textures", gltfRuntime);
        }
        if (parsedData.shaders) {
            parseShaders(parsedData.shaders, gltfRuntime);
        }
        if (parsedData.programs) {
            parseObject(parsedData.programs, "programs", gltfRuntime);
        }
        if (parsedData.samplers) {
            parseObject(parsedData.samplers, "samplers", gltfRuntime);
        }
        if (parsedData.techniques) {
            parseObject(parsedData.techniques, "techniques", gltfRuntime);
        }
        if (parsedData.materials) {
            parseObject(parsedData.materials, "materials", gltfRuntime);
        }
        if (parsedData.animations) {
            parseObject(parsedData.animations, "animations", gltfRuntime);
        }
        if (parsedData.skins) {
            parseObject(parsedData.skins, "skins", gltfRuntime);
        }
        if (parsedData.scenes) {
            gltfRuntime.scenes = parsedData.scenes;
        }
        if (parsedData.scene && parsedData.scenes) {
            gltfRuntime.currentScene = parsedData.scenes[parsedData.scene];
        }
        return gltfRuntime;
    };
    GLTFLoaderBase.LoadBufferAsync = function (gltfRuntime, id, onSuccess, onError, onProgress) {
        var buffer = gltfRuntime.buffers[id];
        if (Tools.IsBase64(buffer.uri)) {
            setTimeout(function () { return onSuccess(new Uint8Array(Tools.DecodeBase64(buffer.uri))); });
        }
        else {
            Tools.LoadFile(gltfRuntime.rootUrl + buffer.uri, function (data) { return onSuccess(new Uint8Array(data)); }, onProgress, undefined, true, function (request) {
                if (request) {
                    onError(request.status + " " + request.statusText);
                }
            });
        }
    };
    GLTFLoaderBase.LoadTextureBufferAsync = function (gltfRuntime, id, onSuccess, onError) {
        var texture = gltfRuntime.textures[id];
        if (!texture || !texture.source) {
            onError("");
            return;
        }
        if (texture.babylonTexture) {
            onSuccess(null);
            return;
        }
        var source = gltfRuntime.images[texture.source];
        if (Tools.IsBase64(source.uri)) {
            setTimeout(function () { return onSuccess(new Uint8Array(Tools.DecodeBase64(source.uri))); });
        }
        else {
            Tools.LoadFile(gltfRuntime.rootUrl + source.uri, function (data) { return onSuccess(new Uint8Array(data)); }, undefined, undefined, true, function (request) {
                if (request) {
                    onError(request.status + " " + request.statusText);
                }
            });
        }
    };
    GLTFLoaderBase.CreateTextureAsync = function (gltfRuntime, id, buffer, onSuccess, onError) {
        var texture = gltfRuntime.textures[id];
        if (texture.babylonTexture) {
            onSuccess(texture.babylonTexture);
            return;
        }
        var sampler = gltfRuntime.samplers[texture.sampler];
        var createMipMaps = (sampler.minFilter === ETextureFilterType.NEAREST_MIPMAP_NEAREST) ||
            (sampler.minFilter === ETextureFilterType.NEAREST_MIPMAP_LINEAR) ||
            (sampler.minFilter === ETextureFilterType.LINEAR_MIPMAP_NEAREST) ||
            (sampler.minFilter === ETextureFilterType.LINEAR_MIPMAP_LINEAR);
        var samplingMode = Texture.BILINEAR_SAMPLINGMODE;
        var blob = buffer == null ? new Blob() : new Blob([buffer]);
        var blobURL = URL.createObjectURL(blob);
        var revokeBlobURL = function () { return URL.revokeObjectURL(blobURL); };
        var newTexture = new Texture(blobURL, gltfRuntime.scene, !createMipMaps, true, samplingMode, revokeBlobURL, revokeBlobURL);
        if (sampler.wrapS !== undefined) {
            newTexture.wrapU = GLTFUtils.GetWrapMode(sampler.wrapS);
        }
        if (sampler.wrapT !== undefined) {
            newTexture.wrapV = GLTFUtils.GetWrapMode(sampler.wrapT);
        }
        newTexture.name = id;
        texture.babylonTexture = newTexture;
        onSuccess(newTexture);
    };
    GLTFLoaderBase.LoadShaderStringAsync = function (gltfRuntime, id, onSuccess, onError) {
        var shader = gltfRuntime.shaders[id];
        if (Tools.IsBase64(shader.uri)) {
            var shaderString = atob(shader.uri.split(",")[1]);
            if (onSuccess) {
                onSuccess(shaderString);
            }
        }
        else {
            Tools.LoadFile(gltfRuntime.rootUrl + shader.uri, onSuccess, undefined, undefined, false, function (request) {
                if (request && onError) {
                    onError(request.status + " " + request.statusText);
                }
            });
        }
    };
    GLTFLoaderBase.LoadMaterialAsync = function (gltfRuntime, id, onSuccess, onError) {
        var material = gltfRuntime.materials[id];
        if (!material.technique) {
            if (onError) {
                onError("No technique found.");
            }
            return;
        }
        var technique = gltfRuntime.techniques[material.technique];
        if (!technique) {
            gltfRuntime.scene._blockEntityCollection = gltfRuntime.forAssetContainer;
            var defaultMaterial = new StandardMaterial(id, gltfRuntime.scene);
            gltfRuntime.scene._blockEntityCollection = false;
            defaultMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
            defaultMaterial.sideOrientation = Material.CounterClockWiseSideOrientation;
            onSuccess(defaultMaterial);
            return;
        }
        var program = gltfRuntime.programs[technique.program];
        var states = technique.states;
        var vertexShader = Effect.ShadersStore[program.vertexShader + "VertexShader"];
        var pixelShader = Effect.ShadersStore[program.fragmentShader + "PixelShader"];
        var newVertexShader = "";
        var newPixelShader = "";
        var vertexTokenizer = new Tokenizer(vertexShader);
        var pixelTokenizer = new Tokenizer(pixelShader);
        var unTreatedUniforms = {};
        var uniforms = [];
        var attributes = [];
        var samplers = [];
        // Fill uniform, sampler2D and attributes
        for (var unif in technique.uniforms) {
            var uniform = technique.uniforms[unif];
            var uniformParameter = technique.parameters[uniform];
            unTreatedUniforms[unif] = uniformParameter;
            if (uniformParameter.semantic && !uniformParameter.node && !uniformParameter.source) {
                var transformIndex = glTFTransforms.indexOf(uniformParameter.semantic);
                if (transformIndex !== -1) {
                    uniforms.push(babylonTransforms[transformIndex]);
                    delete unTreatedUniforms[unif];
                }
                else {
                    uniforms.push(unif);
                }
            }
            else if (uniformParameter.type === EParameterType.SAMPLER_2D) {
                samplers.push(unif);
            }
            else {
                uniforms.push(unif);
            }
        }
        for (var attr in technique.attributes) {
            var attribute = technique.attributes[attr];
            var attributeParameter = technique.parameters[attribute];
            if (attributeParameter.semantic) {
                var name_1 = getAttribute(attributeParameter);
                if (name_1) {
                    attributes.push(name_1);
                }
            }
        }
        // Configure vertex shader
        while (!vertexTokenizer.isEnd() && vertexTokenizer.getNextToken()) {
            var tokenType = vertexTokenizer.currentToken;
            if (tokenType !== ETokenType.IDENTIFIER) {
                newVertexShader += vertexTokenizer.currentString;
                continue;
            }
            var foundAttribute = false;
            for (var attr in technique.attributes) {
                var attribute = technique.attributes[attr];
                var attributeParameter = technique.parameters[attribute];
                if (vertexTokenizer.currentIdentifier === attr && attributeParameter.semantic) {
                    newVertexShader += getAttribute(attributeParameter);
                    foundAttribute = true;
                    break;
                }
            }
            if (foundAttribute) {
                continue;
            }
            newVertexShader += parseShaderUniforms(vertexTokenizer, technique, unTreatedUniforms);
        }
        // Configure pixel shader
        while (!pixelTokenizer.isEnd() && pixelTokenizer.getNextToken()) {
            var tokenType = pixelTokenizer.currentToken;
            if (tokenType !== ETokenType.IDENTIFIER) {
                newPixelShader += pixelTokenizer.currentString;
                continue;
            }
            newPixelShader += parseShaderUniforms(pixelTokenizer, technique, unTreatedUniforms);
        }
        // Create shader material
        var shaderPath = {
            vertex: program.vertexShader + id,
            fragment: program.fragmentShader + id
        };
        var options = {
            attributes: attributes,
            uniforms: uniforms,
            samplers: samplers,
            needAlphaBlending: states && states.enable && states.enable.indexOf(3042) !== -1
        };
        Effect.ShadersStore[program.vertexShader + id + "VertexShader"] = newVertexShader;
        Effect.ShadersStore[program.fragmentShader + id + "PixelShader"] = newPixelShader;
        var shaderMaterial = new ShaderMaterial(id, gltfRuntime.scene, shaderPath, options);
        shaderMaterial.onError = onShaderCompileError(program, shaderMaterial, onError);
        shaderMaterial.onCompiled = onShaderCompileSuccess(gltfRuntime, shaderMaterial, technique, material, unTreatedUniforms, onSuccess);
        shaderMaterial.sideOrientation = Material.CounterClockWiseSideOrientation;
        if (states && states.functions) {
            var functions = states.functions;
            if (functions.cullFace && functions.cullFace[0] !== ECullingType.BACK) {
                shaderMaterial.backFaceCulling = false;
            }
            var blendFunc = functions.blendFuncSeparate;
            if (blendFunc) {
                if (blendFunc[0] === EBlendingFunction.SRC_ALPHA && blendFunc[1] === EBlendingFunction.ONE_MINUS_SRC_ALPHA && blendFunc[2] === EBlendingFunction.ONE && blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_COMBINE;
                }
                else if (blendFunc[0] === EBlendingFunction.ONE && blendFunc[1] === EBlendingFunction.ONE && blendFunc[2] === EBlendingFunction.ZERO && blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_ONEONE;
                }
                else if (blendFunc[0] === EBlendingFunction.SRC_ALPHA && blendFunc[1] === EBlendingFunction.ONE && blendFunc[2] === EBlendingFunction.ZERO && blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_ADD;
                }
                else if (blendFunc[0] === EBlendingFunction.ZERO && blendFunc[1] === EBlendingFunction.ONE_MINUS_SRC_COLOR && blendFunc[2] === EBlendingFunction.ONE && blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_SUBTRACT;
                }
                else if (blendFunc[0] === EBlendingFunction.DST_COLOR && blendFunc[1] === EBlendingFunction.ZERO && blendFunc[2] === EBlendingFunction.ONE && blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_MULTIPLY;
                }
                else if (blendFunc[0] === EBlendingFunction.SRC_ALPHA && blendFunc[1] === EBlendingFunction.ONE_MINUS_SRC_COLOR && blendFunc[2] === EBlendingFunction.ONE && blendFunc[3] === EBlendingFunction.ONE) {
                    shaderMaterial.alphaMode = Constants.ALPHA_MAXIMIZED;
                }
            }
        }
    };
    return GLTFLoaderBase;
}());
/**
* glTF V1 Loader
* @hidden
*/
var GLTFLoader = /** @class */ (function () {
    function GLTFLoader() {
        this.state = null;
    }
    GLTFLoader.RegisterExtension = function (extension) {
        if (GLTFLoader.Extensions[extension.name]) {
            Tools.Error("Tool with the same name \"" + extension.name + "\" already exists");
            return;
        }
        GLTFLoader.Extensions[extension.name] = extension;
    };
    GLTFLoader.prototype.dispose = function () {
        // do nothing
    };
    GLTFLoader.prototype._importMeshAsync = function (meshesNames, scene, data, rootUrl, forAssetContainer, onSuccess, onProgress, onError) {
        var _this = this;
        scene.useRightHandedSystem = true;
        GLTFLoaderExtension.LoadRuntimeAsync(scene, data, rootUrl, function (gltfRuntime) {
            gltfRuntime.forAssetContainer = forAssetContainer;
            gltfRuntime.importOnlyMeshes = true;
            if (meshesNames === "") {
                gltfRuntime.importMeshesNames = [];
            }
            else if (typeof meshesNames === "string") {
                gltfRuntime.importMeshesNames = [meshesNames];
            }
            else if (meshesNames && !(meshesNames instanceof Array)) {
                gltfRuntime.importMeshesNames = [meshesNames];
            }
            else {
                gltfRuntime.importMeshesNames = [];
                Tools.Warn("Argument meshesNames must be of type string or string[]");
            }
            // Create nodes
            _this._createNodes(gltfRuntime);
            var meshes = new Array();
            var skeletons = new Array();
            // Fill arrays of meshes and skeletons
            for (var nde in gltfRuntime.nodes) {
                var node = gltfRuntime.nodes[nde];
                if (node.babylonNode instanceof AbstractMesh) {
                    meshes.push(node.babylonNode);
                }
            }
            for (var skl in gltfRuntime.skins) {
                var skin = gltfRuntime.skins[skl];
                if (skin.babylonSkeleton instanceof Skeleton) {
                    skeletons.push(skin.babylonSkeleton);
                }
            }
            // Load buffers, shaders, materials, etc.
            _this._loadBuffersAsync(gltfRuntime, function () {
                _this._loadShadersAsync(gltfRuntime, function () {
                    importMaterials(gltfRuntime);
                    postLoad(gltfRuntime);
                    if (!GLTFFileLoader.IncrementalLoading && onSuccess) {
                        onSuccess(meshes, skeletons);
                    }
                });
            }, onProgress);
            if (GLTFFileLoader.IncrementalLoading && onSuccess) {
                onSuccess(meshes, skeletons);
            }
        }, onError);
        return true;
    };
    /**
    * Imports one or more meshes from a loaded gltf file and adds them to the scene
    * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
    * @param scene the scene the meshes should be added to
    * @param forAssetContainer defines if the entities must be stored in the scene
    * @param data gltf data containing information of the meshes in a loaded file
    * @param rootUrl root url to load from
    * @param onProgress event that fires when loading progress has occured
    * @returns a promise containg the loaded meshes, particles, skeletons and animations
    */
    GLTFLoader.prototype.importMeshAsync = function (meshesNames, scene, forAssetContainer, data, rootUrl, onProgress) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._importMeshAsync(meshesNames, scene, data, rootUrl, forAssetContainer, function (meshes, skeletons) {
                resolve({
                    meshes: meshes,
                    particleSystems: [],
                    skeletons: skeletons,
                    animationGroups: [],
                    lights: [],
                    transformNodes: [],
                    geometries: []
                });
            }, onProgress, function (message) {
                reject(new Error(message));
            });
        });
    };
    GLTFLoader.prototype._loadAsync = function (scene, data, rootUrl, forAssetContainer, onSuccess, onProgress, onError) {
        var _this = this;
        scene.useRightHandedSystem = true;
        GLTFLoaderExtension.LoadRuntimeAsync(scene, data, rootUrl, function (gltfRuntime) {
            // Load runtime extensios
            GLTFLoaderExtension.LoadRuntimeExtensionsAsync(gltfRuntime, function () {
                // Create nodes
                _this._createNodes(gltfRuntime);
                // Load buffers, shaders, materials, etc.
                _this._loadBuffersAsync(gltfRuntime, function () {
                    _this._loadShadersAsync(gltfRuntime, function () {
                        importMaterials(gltfRuntime);
                        postLoad(gltfRuntime);
                        if (!GLTFFileLoader.IncrementalLoading) {
                            onSuccess();
                        }
                    });
                });
                if (GLTFFileLoader.IncrementalLoading) {
                    onSuccess();
                }
            }, onError);
        }, onError);
    };
    /**
    * Imports all objects from a loaded gltf file and adds them to the scene
    * @param scene the scene the objects should be added to
    * @param data gltf data containing information of the meshes in a loaded file
    * @param rootUrl root url to load from
    * @param onProgress event that fires when loading progress has occured
    * @returns a promise which completes when objects have been loaded to the scene
    */
    GLTFLoader.prototype.loadAsync = function (scene, data, rootUrl, onProgress) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._loadAsync(scene, data, rootUrl, false, function () {
                resolve();
            }, onProgress, function (message) {
                reject(new Error(message));
            });
        });
    };
    GLTFLoader.prototype._loadShadersAsync = function (gltfRuntime, onload) {
        var hasShaders = false;
        var processShader = function (sha, shader) {
            GLTFLoaderExtension.LoadShaderStringAsync(gltfRuntime, sha, function (shaderString) {
                if (shaderString instanceof ArrayBuffer) {
                    return;
                }
                gltfRuntime.loadedShaderCount++;
                if (shaderString) {
                    Effect.ShadersStore[sha + (shader.type === EShaderType.VERTEX ? "VertexShader" : "PixelShader")] = shaderString;
                }
                if (gltfRuntime.loadedShaderCount === gltfRuntime.shaderscount) {
                    onload();
                }
            }, function () {
                Tools.Error("Error when loading shader program named " + sha + " located at " + shader.uri);
            });
        };
        for (var sha in gltfRuntime.shaders) {
            hasShaders = true;
            var shader = gltfRuntime.shaders[sha];
            if (shader) {
                processShader.bind(this, sha, shader)();
            }
            else {
                Tools.Error("No shader named: " + sha);
            }
        }
        if (!hasShaders) {
            onload();
        }
    };
    GLTFLoader.prototype._loadBuffersAsync = function (gltfRuntime, onLoad, onProgress) {
        var hasBuffers = false;
        var processBuffer = function (buf, buffer) {
            GLTFLoaderExtension.LoadBufferAsync(gltfRuntime, buf, function (bufferView) {
                gltfRuntime.loadedBufferCount++;
                if (bufferView) {
                    if (bufferView.byteLength != gltfRuntime.buffers[buf].byteLength) {
                        Tools.Error("Buffer named " + buf + " is length " + bufferView.byteLength + ". Expected: " + buffer.byteLength); // Improve error message
                    }
                    gltfRuntime.loadedBufferViews[buf] = bufferView;
                }
                if (gltfRuntime.loadedBufferCount === gltfRuntime.buffersCount) {
                    onLoad();
                }
            }, function () {
                Tools.Error("Error when loading buffer named " + buf + " located at " + buffer.uri);
            });
        };
        for (var buf in gltfRuntime.buffers) {
            hasBuffers = true;
            var buffer = gltfRuntime.buffers[buf];
            if (buffer) {
                processBuffer.bind(this, buf, buffer)();
            }
            else {
                Tools.Error("No buffer named: " + buf);
            }
        }
        if (!hasBuffers) {
            onLoad();
        }
    };
    GLTFLoader.prototype._createNodes = function (gltfRuntime) {
        var currentScene = gltfRuntime.currentScene;
        if (currentScene) {
            // Only one scene even if multiple scenes are defined
            for (var i = 0; i < currentScene.nodes.length; i++) {
                traverseNodes(gltfRuntime, currentScene.nodes[i], null);
            }
        }
        else {
            // Load all scenes
            for (var thing in gltfRuntime.scenes) {
                currentScene = gltfRuntime.scenes[thing];
                for (var i = 0; i < currentScene.nodes.length; i++) {
                    traverseNodes(gltfRuntime, currentScene.nodes[i], null);
                }
            }
        }
    };
    GLTFLoader.Extensions = {};
    return GLTFLoader;
}());
/** @hidden */
var GLTFLoaderExtension = /** @class */ (function () {
    function GLTFLoaderExtension(name) {
        this._name = name;
    }
    Object.defineProperty(GLTFLoaderExtension.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    /**
    * Defines an override for loading the runtime
    * Return true to stop further extensions from loading the runtime
    */
    GLTFLoaderExtension.prototype.loadRuntimeAsync = function (scene, data, rootUrl, onSuccess, onError) {
        return false;
    };
    /**
     * Defines an onverride for creating gltf runtime
     * Return true to stop further extensions from creating the runtime
     */
    GLTFLoaderExtension.prototype.loadRuntimeExtensionsAsync = function (gltfRuntime, onSuccess, onError) {
        return false;
    };
    /**
    * Defines an override for loading buffers
    * Return true to stop further extensions from loading this buffer
    */
    GLTFLoaderExtension.prototype.loadBufferAsync = function (gltfRuntime, id, onSuccess, onError, onProgress) {
        return false;
    };
    /**
    * Defines an override for loading texture buffers
    * Return true to stop further extensions from loading this texture data
    */
    GLTFLoaderExtension.prototype.loadTextureBufferAsync = function (gltfRuntime, id, onSuccess, onError) {
        return false;
    };
    /**
    * Defines an override for creating textures
    * Return true to stop further extensions from loading this texture
    */
    GLTFLoaderExtension.prototype.createTextureAsync = function (gltfRuntime, id, buffer, onSuccess, onError) {
        return false;
    };
    /**
    * Defines an override for loading shader strings
    * Return true to stop further extensions from loading this shader data
    */
    GLTFLoaderExtension.prototype.loadShaderStringAsync = function (gltfRuntime, id, onSuccess, onError) {
        return false;
    };
    /**
    * Defines an override for loading materials
    * Return true to stop further extensions from loading this material
    */
    GLTFLoaderExtension.prototype.loadMaterialAsync = function (gltfRuntime, id, onSuccess, onError) {
        return false;
    };
    // ---------
    // Utilities
    // ---------
    GLTFLoaderExtension.LoadRuntimeAsync = function (scene, data, rootUrl, onSuccess, onError) {
        GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
            return loaderExtension.loadRuntimeAsync(scene, data, rootUrl, onSuccess, onError);
        }, function () {
            setTimeout(function () {
                if (!onSuccess) {
                    return;
                }
                onSuccess(GLTFLoaderBase.CreateRuntime(data.json, scene, rootUrl));
            });
        });
    };
    GLTFLoaderExtension.LoadRuntimeExtensionsAsync = function (gltfRuntime, onSuccess, onError) {
        GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
            return loaderExtension.loadRuntimeExtensionsAsync(gltfRuntime, onSuccess, onError);
        }, function () {
            setTimeout(function () {
                onSuccess();
            });
        });
    };
    GLTFLoaderExtension.LoadBufferAsync = function (gltfRuntime, id, onSuccess, onError, onProgress) {
        GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
            return loaderExtension.loadBufferAsync(gltfRuntime, id, onSuccess, onError, onProgress);
        }, function () {
            GLTFLoaderBase.LoadBufferAsync(gltfRuntime, id, onSuccess, onError, onProgress);
        });
    };
    GLTFLoaderExtension.LoadTextureAsync = function (gltfRuntime, id, onSuccess, onError) {
        GLTFLoaderExtension.LoadTextureBufferAsync(gltfRuntime, id, function (buffer) {
            if (buffer) {
                GLTFLoaderExtension.CreateTextureAsync(gltfRuntime, id, buffer, onSuccess, onError);
            }
        }, onError);
    };
    GLTFLoaderExtension.LoadShaderStringAsync = function (gltfRuntime, id, onSuccess, onError) {
        GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
            return loaderExtension.loadShaderStringAsync(gltfRuntime, id, onSuccess, onError);
        }, function () {
            GLTFLoaderBase.LoadShaderStringAsync(gltfRuntime, id, onSuccess, onError);
        });
    };
    GLTFLoaderExtension.LoadMaterialAsync = function (gltfRuntime, id, onSuccess, onError) {
        GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
            return loaderExtension.loadMaterialAsync(gltfRuntime, id, onSuccess, onError);
        }, function () {
            GLTFLoaderBase.LoadMaterialAsync(gltfRuntime, id, onSuccess, onError);
        });
    };
    GLTFLoaderExtension.LoadTextureBufferAsync = function (gltfRuntime, id, onSuccess, onError) {
        GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
            return loaderExtension.loadTextureBufferAsync(gltfRuntime, id, onSuccess, onError);
        }, function () {
            GLTFLoaderBase.LoadTextureBufferAsync(gltfRuntime, id, onSuccess, onError);
        });
    };
    GLTFLoaderExtension.CreateTextureAsync = function (gltfRuntime, id, buffer, onSuccess, onError) {
        GLTFLoaderExtension.ApplyExtensions(function (loaderExtension) {
            return loaderExtension.createTextureAsync(gltfRuntime, id, buffer, onSuccess, onError);
        }, function () {
            GLTFLoaderBase.CreateTextureAsync(gltfRuntime, id, buffer, onSuccess, onError);
        });
    };
    GLTFLoaderExtension.ApplyExtensions = function (func, defaultFunc) {
        for (var extensionName in GLTFLoader.Extensions) {
            var loaderExtension = GLTFLoader.Extensions[extensionName];
            if (func(loaderExtension)) {
                return;
            }
        }
        defaultFunc();
    };
    return GLTFLoaderExtension;
}());
GLTFFileLoader._CreateGLTF1Loader = function () { return new GLTFLoader(); };

var BinaryExtensionBufferName = "binary_glTF";
/** @hidden */
var GLTFBinaryExtension = /** @class */ (function (_super) {
    __extends(GLTFBinaryExtension, _super);
    function GLTFBinaryExtension() {
        return _super.call(this, "KHR_binary_glTF") || this;
    }
    GLTFBinaryExtension.prototype.loadRuntimeAsync = function (scene, data, rootUrl, onSuccess, onError) {
        var extensionsUsed = data.json.extensionsUsed;
        if (!extensionsUsed || extensionsUsed.indexOf(this.name) === -1 || !data.bin) {
            return false;
        }
        this._bin = data.bin;
        onSuccess(GLTFLoaderBase.CreateRuntime(data.json, scene, rootUrl));
        return true;
    };
    GLTFBinaryExtension.prototype.loadBufferAsync = function (gltfRuntime, id, onSuccess, onError) {
        if (gltfRuntime.extensionsUsed.indexOf(this.name) === -1) {
            return false;
        }
        if (id !== BinaryExtensionBufferName) {
            return false;
        }
        this._bin.readAsync(0, this._bin.byteLength).then(onSuccess, function (error) { return onError(error.message); });
        return true;
    };
    GLTFBinaryExtension.prototype.loadTextureBufferAsync = function (gltfRuntime, id, onSuccess, onError) {
        var texture = gltfRuntime.textures[id];
        var source = gltfRuntime.images[texture.source];
        if (!source.extensions || !(this.name in source.extensions)) {
            return false;
        }
        var sourceExt = source.extensions[this.name];
        var bufferView = gltfRuntime.bufferViews[sourceExt.bufferView];
        var buffer = GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, 0, bufferView.byteLength, EComponentType.UNSIGNED_BYTE);
        onSuccess(buffer);
        return true;
    };
    GLTFBinaryExtension.prototype.loadShaderStringAsync = function (gltfRuntime, id, onSuccess, onError) {
        var shader = gltfRuntime.shaders[id];
        if (!shader.extensions || !(this.name in shader.extensions)) {
            return false;
        }
        var binaryExtensionShader = shader.extensions[this.name];
        var bufferView = gltfRuntime.bufferViews[binaryExtensionShader.bufferView];
        var shaderBytes = GLTFUtils.GetBufferFromBufferView(gltfRuntime, bufferView, 0, bufferView.byteLength, EComponentType.UNSIGNED_BYTE);
        setTimeout(function () {
            var shaderString = GLTFUtils.DecodeBufferToText(shaderBytes);
            onSuccess(shaderString);
        });
        return true;
    };
    return GLTFBinaryExtension;
}(GLTFLoaderExtension));
GLTFLoader.RegisterExtension(new GLTFBinaryExtension());

/** @hidden */
var GLTFMaterialsCommonExtension = /** @class */ (function (_super) {
    __extends(GLTFMaterialsCommonExtension, _super);
    function GLTFMaterialsCommonExtension() {
        return _super.call(this, "KHR_materials_common") || this;
    }
    GLTFMaterialsCommonExtension.prototype.loadRuntimeExtensionsAsync = function (gltfRuntime, onSuccess, onError) {
        if (!gltfRuntime.extensions) {
            return false;
        }
        var extension = gltfRuntime.extensions[this.name];
        if (!extension) {
            return false;
        }
        // Create lights
        var lights = extension.lights;
        if (lights) {
            for (var thing in lights) {
                var light = lights[thing];
                switch (light.type) {
                    case "ambient":
                        var ambientLight = new HemisphericLight(light.name, new Vector3(0, 1, 0), gltfRuntime.scene);
                        var ambient = light.ambient;
                        if (ambient) {
                            ambientLight.diffuse = Color3.FromArray(ambient.color || [1, 1, 1]);
                        }
                        break;
                    case "point":
                        var pointLight = new PointLight(light.name, new Vector3(10, 10, 10), gltfRuntime.scene);
                        var point = light.point;
                        if (point) {
                            pointLight.diffuse = Color3.FromArray(point.color || [1, 1, 1]);
                        }
                        break;
                    case "directional":
                        var dirLight = new DirectionalLight(light.name, new Vector3(0, -1, 0), gltfRuntime.scene);
                        var directional = light.directional;
                        if (directional) {
                            dirLight.diffuse = Color3.FromArray(directional.color || [1, 1, 1]);
                        }
                        break;
                    case "spot":
                        var spot = light.spot;
                        if (spot) {
                            var spotLight = new SpotLight(light.name, new Vector3(0, 10, 0), new Vector3(0, -1, 0), spot.fallOffAngle || Math.PI, spot.fallOffExponent || 0.0, gltfRuntime.scene);
                            spotLight.diffuse = Color3.FromArray(spot.color || [1, 1, 1]);
                        }
                        break;
                    default:
                        Tools.Warn("GLTF Material Common extension: light type \"" + light.type + "\” not supported");
                        break;
                }
            }
        }
        return false;
    };
    GLTFMaterialsCommonExtension.prototype.loadMaterialAsync = function (gltfRuntime, id, onSuccess, onError) {
        var material = gltfRuntime.materials[id];
        if (!material || !material.extensions) {
            return false;
        }
        var extension = material.extensions[this.name];
        if (!extension) {
            return false;
        }
        var standardMaterial = new StandardMaterial(id, gltfRuntime.scene);
        standardMaterial.sideOrientation = Material.CounterClockWiseSideOrientation;
        if (extension.technique === "CONSTANT") {
            standardMaterial.disableLighting = true;
        }
        standardMaterial.backFaceCulling = extension.doubleSided === undefined ? false : !extension.doubleSided;
        standardMaterial.alpha = extension.values.transparency === undefined ? 1.0 : extension.values.transparency;
        standardMaterial.specularPower = extension.values.shininess === undefined ? 0.0 : extension.values.shininess;
        // Ambient
        if (typeof extension.values.ambient === "string") {
            this._loadTexture(gltfRuntime, extension.values.ambient, standardMaterial, "ambientTexture", onError);
        }
        else {
            standardMaterial.ambientColor = Color3.FromArray(extension.values.ambient || [0, 0, 0]);
        }
        // Diffuse
        if (typeof extension.values.diffuse === "string") {
            this._loadTexture(gltfRuntime, extension.values.diffuse, standardMaterial, "diffuseTexture", onError);
        }
        else {
            standardMaterial.diffuseColor = Color3.FromArray(extension.values.diffuse || [0, 0, 0]);
        }
        // Emission
        if (typeof extension.values.emission === "string") {
            this._loadTexture(gltfRuntime, extension.values.emission, standardMaterial, "emissiveTexture", onError);
        }
        else {
            standardMaterial.emissiveColor = Color3.FromArray(extension.values.emission || [0, 0, 0]);
        }
        // Specular
        if (typeof extension.values.specular === "string") {
            this._loadTexture(gltfRuntime, extension.values.specular, standardMaterial, "specularTexture", onError);
        }
        else {
            standardMaterial.specularColor = Color3.FromArray(extension.values.specular || [0, 0, 0]);
        }
        return true;
    };
    GLTFMaterialsCommonExtension.prototype._loadTexture = function (gltfRuntime, id, material, propertyPath, onError) {
        // Create buffer from texture url
        GLTFLoaderBase.LoadTextureBufferAsync(gltfRuntime, id, function (buffer) {
            // Create texture from buffer
            GLTFLoaderBase.CreateTextureAsync(gltfRuntime, id, buffer, function (texture) { return material[propertyPath] = texture; }, onError);
        }, onError);
    };
    return GLTFMaterialsCommonExtension;
}(GLTFLoaderExtension));
GLTFLoader.RegisterExtension(new GLTFMaterialsCommonExtension());

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    GLTFBinaryExtension: GLTFBinaryExtension,
    GLTFLoaderBase: GLTFLoaderBase,
    GLTFLoader: GLTFLoader,
    GLTFLoaderExtension: GLTFLoaderExtension,
    get EComponentType () { return EComponentType; },
    get EShaderType () { return EShaderType; },
    get EParameterType () { return EParameterType; },
    get ETextureWrapMode () { return ETextureWrapMode; },
    get ETextureFilterType () { return ETextureFilterType; },
    get ETextureFormat () { return ETextureFormat; },
    get ECullingType () { return ECullingType; },
    get EBlendingFunction () { return EBlendingFunction; },
    GLTFUtils: GLTFUtils,
    GLTFMaterialsCommonExtension: GLTFMaterialsCommonExtension
});

/**
 * Helper class for working with arrays when loading the glTF asset
 */
var ArrayItem = /** @class */ (function () {
    function ArrayItem() {
    }
    /**
     * Gets an item from the given array.
     * @param context The context when loading the asset
     * @param array The array to get the item from
     * @param index The index to the array
     * @returns The array item
     */
    ArrayItem.Get = function (context, array, index) {
        if (!array || index == undefined || !array[index]) {
            throw new Error(context + ": Failed to find index (" + index + ")");
        }
        return array[index];
    };
    /**
     * Assign an `index` field to each item of the given array.
     * @param array The array of items
     */
    ArrayItem.Assign = function (array) {
        if (array) {
            for (var index = 0; index < array.length; index++) {
                array[index].index = index;
            }
        }
    };
    return ArrayItem;
}());
/**
 * The glTF 2.0 loader
 */
var GLTFLoader$1 = /** @class */ (function () {
    /** @hidden */
    function GLTFLoader(parent) {
        /** @hidden */
        this._completePromises = new Array();
        /** @hidden */
        this._forAssetContainer = false;
        /** Storage */
        this._babylonLights = [];
        /** @hidden */
        this._disableInstancedMesh = 0;
        this._disposed = false;
        this._state = null;
        this._extensions = new Array();
        this._defaultBabylonMaterialData = {};
        this._parent = parent;
    }
    /**
     * Registers a loader extension.
     * @param name The name of the loader extension.
     * @param factory The factory function that creates the loader extension.
     */
    GLTFLoader.RegisterExtension = function (name, factory) {
        if (GLTFLoader.UnregisterExtension(name)) {
            Logger.Warn("Extension with the name '" + name + "' already exists");
        }
        GLTFLoader._RegisteredExtensions[name] = {
            factory: factory
        };
    };
    /**
     * Unregisters a loader extension.
     * @param name The name of the loader extension.
     * @returns A boolean indicating whether the extension has been unregistered
     */
    GLTFLoader.UnregisterExtension = function (name) {
        if (!GLTFLoader._RegisteredExtensions[name]) {
            return false;
        }
        delete GLTFLoader._RegisteredExtensions[name];
        return true;
    };
    Object.defineProperty(GLTFLoader.prototype, "state", {
        /**
         * The loader state.
         */
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFLoader.prototype, "gltf", {
        /**
         * The object that represents the glTF JSON.
         */
        get: function () {
            return this._gltf;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFLoader.prototype, "bin", {
        /**
         * The BIN chunk of a binary glTF.
         */
        get: function () {
            return this._bin;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFLoader.prototype, "parent", {
        /**
         * The parent file loader.
         */
        get: function () {
            return this._parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFLoader.prototype, "babylonScene", {
        /**
         * The Babylon scene when loading the asset.
         */
        get: function () {
            return this._babylonScene;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLTFLoader.prototype, "rootBabylonMesh", {
        /**
         * The root Babylon mesh when loading the asset.
         */
        get: function () {
            return this._rootBabylonMesh;
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    GLTFLoader.prototype.dispose = function () {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        this._completePromises.length = 0;
        for (var name_1 in this._extensions) {
            var extension = this._extensions[name_1];
            extension.dispose && extension.dispose();
            delete this._extensions[name_1];
        }
        this._gltf = null;
        this._babylonScene = null;
        this._rootBabylonMesh = null;
        this._parent.dispose();
    };
    /** @hidden */
    GLTFLoader.prototype.importMeshAsync = function (meshesNames, scene, forAssetContainer, data, rootUrl, onProgress, fileName) {
        var _this = this;
        return Promise.resolve().then(function () {
            _this._babylonScene = scene;
            _this._rootUrl = rootUrl;
            _this._fileName = fileName || "scene";
            _this._forAssetContainer = forAssetContainer;
            _this._loadData(data);
            var nodes = null;
            if (meshesNames) {
                var nodeMap_1 = {};
                if (_this._gltf.nodes) {
                    for (var _i = 0, _a = _this._gltf.nodes; _i < _a.length; _i++) {
                        var node = _a[_i];
                        if (node.name) {
                            nodeMap_1[node.name] = node.index;
                        }
                    }
                }
                var names = (meshesNames instanceof Array) ? meshesNames : [meshesNames];
                nodes = names.map(function (name) {
                    var node = nodeMap_1[name];
                    if (node === undefined) {
                        throw new Error("Failed to find node '" + name + "'");
                    }
                    return node;
                });
            }
            return _this._loadAsync(nodes, function () {
                return {
                    meshes: _this._getMeshes(),
                    particleSystems: [],
                    skeletons: _this._getSkeletons(),
                    animationGroups: _this._getAnimationGroups(),
                    lights: _this._babylonLights,
                    transformNodes: _this._getTransformNodes(),
                    geometries: _this._getGeometries()
                };
            });
        });
    };
    /** @hidden */
    GLTFLoader.prototype.loadAsync = function (scene, data, rootUrl, onProgress, fileName) {
        var _this = this;
        return Promise.resolve().then(function () {
            _this._babylonScene = scene;
            _this._rootUrl = rootUrl;
            _this._fileName = fileName || "scene";
            _this._loadData(data);
            return _this._loadAsync(null, function () { return undefined; });
        });
    };
    GLTFLoader.prototype._loadAsync = function (nodes, resultFunc) {
        var _this = this;
        return Promise.resolve().then(function () {
            _this._uniqueRootUrl = (_this._rootUrl.indexOf("file:") === -1 && _this._fileName) ? _this._rootUrl : "" + _this._rootUrl + Date.now() + "/";
            _this._loadExtensions();
            _this._checkExtensions();
            var loadingToReadyCounterName = GLTFLoaderState[GLTFLoaderState.LOADING] + " => " + GLTFLoaderState[GLTFLoaderState.READY];
            var loadingToCompleteCounterName = GLTFLoaderState[GLTFLoaderState.LOADING] + " => " + GLTFLoaderState[GLTFLoaderState.COMPLETE];
            _this._parent._startPerformanceCounter(loadingToReadyCounterName);
            _this._parent._startPerformanceCounter(loadingToCompleteCounterName);
            _this._setState(GLTFLoaderState.LOADING);
            _this._extensionsOnLoading();
            var promises = new Array();
            // Block the marking of materials dirty until the scene is loaded.
            var oldBlockMaterialDirtyMechanism = _this._babylonScene.blockMaterialDirtyMechanism;
            _this._babylonScene.blockMaterialDirtyMechanism = true;
            if (nodes) {
                promises.push(_this.loadSceneAsync("/nodes", { nodes: nodes, index: -1 }));
            }
            else if (_this._gltf.scene != undefined || (_this._gltf.scenes && _this._gltf.scenes[0])) {
                var scene = ArrayItem.Get("/scene", _this._gltf.scenes, _this._gltf.scene || 0);
                promises.push(_this.loadSceneAsync("/scenes/" + scene.index, scene));
            }
            if (_this.parent.loadAllMaterials && _this._gltf.materials) {
                for (var m = 0; m < _this._gltf.materials.length; ++m) {
                    var material = _this._gltf.materials[m];
                    var context_1 = "/materials/" + m;
                    var babylonDrawMode = Material.TriangleFillMode;
                    promises.push(_this._loadMaterialAsync(context_1, material, null, babylonDrawMode, function (material) { }));
                }
            }
            // Restore the blocking of material dirty.
            _this._babylonScene.blockMaterialDirtyMechanism = oldBlockMaterialDirtyMechanism;
            if (_this._parent.compileMaterials) {
                promises.push(_this._compileMaterialsAsync());
            }
            if (_this._parent.compileShadowGenerators) {
                promises.push(_this._compileShadowGeneratorsAsync());
            }
            var resultPromise = Promise.all(promises).then(function () {
                if (_this._rootBabylonMesh) {
                    _this._rootBabylonMesh.setEnabled(true);
                }
                _this._extensionsOnReady();
                _this._setState(GLTFLoaderState.READY);
                _this._startAnimations();
                return resultFunc();
            });
            resultPromise.then(function () {
                _this._parent._endPerformanceCounter(loadingToReadyCounterName);
                Tools.SetImmediate(function () {
                    if (!_this._disposed) {
                        Promise.all(_this._completePromises).then(function () {
                            _this._parent._endPerformanceCounter(loadingToCompleteCounterName);
                            _this._setState(GLTFLoaderState.COMPLETE);
                            _this._parent.onCompleteObservable.notifyObservers(undefined);
                            _this._parent.onCompleteObservable.clear();
                            _this.dispose();
                        }, function (error) {
                            _this._parent.onErrorObservable.notifyObservers(error);
                            _this._parent.onErrorObservable.clear();
                            _this.dispose();
                        });
                    }
                });
            });
            return resultPromise;
        }).catch(function (error) {
            if (!_this._disposed) {
                _this._parent.onErrorObservable.notifyObservers(error);
                _this._parent.onErrorObservable.clear();
                _this.dispose();
            }
            throw error;
        });
    };
    GLTFLoader.prototype._loadData = function (data) {
        this._gltf = data.json;
        this._setupData();
        if (data.bin) {
            var buffers = this._gltf.buffers;
            if (buffers && buffers[0] && !buffers[0].uri) {
                var binaryBuffer = buffers[0];
                if (binaryBuffer.byteLength < data.bin.byteLength - 3 || binaryBuffer.byteLength > data.bin.byteLength) {
                    Logger.Warn("Binary buffer length (" + binaryBuffer.byteLength + ") from JSON does not match chunk length (" + data.bin.byteLength + ")");
                }
                this._bin = data.bin;
            }
            else {
                Logger.Warn("Unexpected BIN chunk");
            }
        }
    };
    GLTFLoader.prototype._setupData = function () {
        ArrayItem.Assign(this._gltf.accessors);
        ArrayItem.Assign(this._gltf.animations);
        ArrayItem.Assign(this._gltf.buffers);
        ArrayItem.Assign(this._gltf.bufferViews);
        ArrayItem.Assign(this._gltf.cameras);
        ArrayItem.Assign(this._gltf.images);
        ArrayItem.Assign(this._gltf.materials);
        ArrayItem.Assign(this._gltf.meshes);
        ArrayItem.Assign(this._gltf.nodes);
        ArrayItem.Assign(this._gltf.samplers);
        ArrayItem.Assign(this._gltf.scenes);
        ArrayItem.Assign(this._gltf.skins);
        ArrayItem.Assign(this._gltf.textures);
        if (this._gltf.nodes) {
            var nodeParents = {};
            for (var _i = 0, _a = this._gltf.nodes; _i < _a.length; _i++) {
                var node = _a[_i];
                if (node.children) {
                    for (var _b = 0, _c = node.children; _b < _c.length; _b++) {
                        var index = _c[_b];
                        nodeParents[index] = node.index;
                    }
                }
            }
            var rootNode = this._createRootNode();
            for (var _d = 0, _e = this._gltf.nodes; _d < _e.length; _d++) {
                var node = _e[_d];
                var parentIndex = nodeParents[node.index];
                node.parent = parentIndex === undefined ? rootNode : this._gltf.nodes[parentIndex];
            }
        }
    };
    GLTFLoader.prototype._loadExtensions = function () {
        for (var name_2 in GLTFLoader._RegisteredExtensions) {
            var extension = GLTFLoader._RegisteredExtensions[name_2].factory(this);
            if (extension.name !== name_2) {
                Logger.Warn("The name of the glTF loader extension instance does not match the registered name: " + extension.name + " !== " + name_2);
            }
            this._extensions.push(extension);
            this._parent.onExtensionLoadedObservable.notifyObservers(extension);
        }
        this._extensions.sort(function (a, b) { return (a.order || Number.MAX_VALUE) - (b.order || Number.MAX_VALUE); });
        this._parent.onExtensionLoadedObservable.clear();
    };
    GLTFLoader.prototype._checkExtensions = function () {
        if (this._gltf.extensionsRequired) {
            var _loop_1 = function (name_3) {
                var available = this_1._extensions.some(function (extension) { return extension.name === name_3 && extension.enabled; });
                if (!available) {
                    throw new Error("Require extension " + name_3 + " is not available");
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this._gltf.extensionsRequired; _i < _a.length; _i++) {
                var name_3 = _a[_i];
                _loop_1(name_3);
            }
        }
    };
    GLTFLoader.prototype._setState = function (state) {
        this._state = state;
        this.log(GLTFLoaderState[this._state]);
    };
    GLTFLoader.prototype._createRootNode = function () {
        this._babylonScene._blockEntityCollection = this._forAssetContainer;
        this._rootBabylonMesh = new Mesh("__root__", this._babylonScene);
        this._babylonScene._blockEntityCollection = false;
        this._rootBabylonMesh.setEnabled(false);
        var rootNode = {
            _babylonTransformNode: this._rootBabylonMesh,
            index: -1
        };
        switch (this._parent.coordinateSystemMode) {
            case GLTFLoaderCoordinateSystemMode.AUTO: {
                if (!this._babylonScene.useRightHandedSystem) {
                    rootNode.rotation = [0, 1, 0, 0];
                    rootNode.scale = [1, 1, -1];
                    GLTFLoader._LoadTransform(rootNode, this._rootBabylonMesh);
                }
                break;
            }
            case GLTFLoaderCoordinateSystemMode.FORCE_RIGHT_HANDED: {
                this._babylonScene.useRightHandedSystem = true;
                break;
            }
            default: {
                throw new Error("Invalid coordinate system mode (" + this._parent.coordinateSystemMode + ")");
            }
        }
        this._parent.onMeshLoadedObservable.notifyObservers(this._rootBabylonMesh);
        return rootNode;
    };
    /**
     * Loads a glTF scene.
     * @param context The context when loading the asset
     * @param scene The glTF scene property
     * @returns A promise that resolves when the load is complete
     */
    GLTFLoader.prototype.loadSceneAsync = function (context, scene) {
        var _this = this;
        var extensionPromise = this._extensionsLoadSceneAsync(context, scene);
        if (extensionPromise) {
            return extensionPromise;
        }
        var promises = new Array();
        this.logOpen(context + " " + (scene.name || ""));
        if (scene.nodes) {
            for (var _i = 0, _a = scene.nodes; _i < _a.length; _i++) {
                var index = _a[_i];
                var node = ArrayItem.Get(context + "/nodes/" + index, this._gltf.nodes, index);
                promises.push(this.loadNodeAsync("/nodes/" + node.index, node, function (babylonMesh) {
                    babylonMesh.parent = _this._rootBabylonMesh;
                }));
            }
        }
        // Link all Babylon bones for each glTF node with the corresponding Babylon transform node.
        // A glTF joint is a pointer to a glTF node in the glTF node hierarchy similar to Unity3D.
        if (this._gltf.nodes) {
            for (var _b = 0, _c = this._gltf.nodes; _b < _c.length; _b++) {
                var node = _c[_b];
                if (node._babylonTransformNode && node._babylonBones) {
                    for (var _d = 0, _e = node._babylonBones; _d < _e.length; _d++) {
                        var babylonBone = _e[_d];
                        babylonBone.linkTransformNode(node._babylonTransformNode);
                    }
                }
            }
        }
        promises.push(this._loadAnimationsAsync());
        this.logClose();
        return Promise.all(promises).then(function () { });
    };
    GLTFLoader.prototype._forEachPrimitive = function (node, callback) {
        if (node._primitiveBabylonMeshes) {
            for (var _i = 0, _a = node._primitiveBabylonMeshes; _i < _a.length; _i++) {
                var babylonMesh = _a[_i];
                callback(babylonMesh);
            }
        }
    };
    GLTFLoader.prototype._getGeometries = function () {
        var geometries = new Array();
        var nodes = this._gltf.nodes;
        if (nodes) {
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                this._forEachPrimitive(node, function (babylonMesh) {
                    var geometry = babylonMesh.geometry;
                    if (geometry && geometries.indexOf(geometry) === -1) {
                        geometries.push(geometry);
                    }
                });
            }
        }
        return geometries;
    };
    GLTFLoader.prototype._getMeshes = function () {
        var meshes = new Array();
        // Root mesh is always first.
        meshes.push(this._rootBabylonMesh);
        var nodes = this._gltf.nodes;
        if (nodes) {
            for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
                var node = nodes_2[_i];
                this._forEachPrimitive(node, function (babylonMesh) {
                    meshes.push(babylonMesh);
                });
            }
        }
        return meshes;
    };
    GLTFLoader.prototype._getTransformNodes = function () {
        var transformNodes = new Array();
        var nodes = this._gltf.nodes;
        if (nodes) {
            for (var _i = 0, nodes_3 = nodes; _i < nodes_3.length; _i++) {
                var node = nodes_3[_i];
                if (node._babylonTransformNode && node._babylonTransformNode.getClassName() === "TransformNode") {
                    transformNodes.push(node._babylonTransformNode);
                }
            }
        }
        return transformNodes;
    };
    GLTFLoader.prototype._getSkeletons = function () {
        var skeletons = new Array();
        var skins = this._gltf.skins;
        if (skins) {
            for (var _i = 0, skins_1 = skins; _i < skins_1.length; _i++) {
                var skin = skins_1[_i];
                if (skin._data) {
                    skeletons.push(skin._data.babylonSkeleton);
                }
            }
        }
        return skeletons;
    };
    GLTFLoader.prototype._getAnimationGroups = function () {
        var animationGroups = new Array();
        var animations = this._gltf.animations;
        if (animations) {
            for (var _i = 0, animations_1 = animations; _i < animations_1.length; _i++) {
                var animation = animations_1[_i];
                if (animation._babylonAnimationGroup) {
                    animationGroups.push(animation._babylonAnimationGroup);
                }
            }
        }
        return animationGroups;
    };
    GLTFLoader.prototype._startAnimations = function () {
        switch (this._parent.animationStartMode) {
            case GLTFLoaderAnimationStartMode.NONE: {
                // do nothing
                break;
            }
            case GLTFLoaderAnimationStartMode.FIRST: {
                var babylonAnimationGroups = this._getAnimationGroups();
                if (babylonAnimationGroups.length !== 0) {
                    babylonAnimationGroups[0].start(true);
                }
                break;
            }
            case GLTFLoaderAnimationStartMode.ALL: {
                var babylonAnimationGroups = this._getAnimationGroups();
                for (var _i = 0, babylonAnimationGroups_1 = babylonAnimationGroups; _i < babylonAnimationGroups_1.length; _i++) {
                    var babylonAnimationGroup = babylonAnimationGroups_1[_i];
                    babylonAnimationGroup.start(true);
                }
                break;
            }
            default: {
                Logger.Error("Invalid animation start mode (" + this._parent.animationStartMode + ")");
                return;
            }
        }
    };
    /**
     * Loads a glTF node.
     * @param context The context when loading the asset
     * @param node The glTF node property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon mesh when the load is complete
     */
    GLTFLoader.prototype.loadNodeAsync = function (context, node, assign) {
        var _this = this;
        if (assign === void 0) { assign = function () { }; }
        var extensionPromise = this._extensionsLoadNodeAsync(context, node, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        if (node._babylonTransformNode) {
            throw new Error(context + ": Invalid recursive node hierarchy");
        }
        var promises = new Array();
        this.logOpen(context + " " + (node.name || ""));
        var loadNode = function (babylonTransformNode) {
            GLTFLoader.AddPointerMetadata(babylonTransformNode, context);
            GLTFLoader._LoadTransform(node, babylonTransformNode);
            if (node.camera != undefined) {
                var camera = ArrayItem.Get(context + "/camera", _this._gltf.cameras, node.camera);
                promises.push(_this.loadCameraAsync("/cameras/" + camera.index, camera, function (babylonCamera) {
                    babylonCamera.parent = babylonTransformNode;
                }));
            }
            if (node.children) {
                for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                    var index = _a[_i];
                    var childNode = ArrayItem.Get(context + "/children/" + index, _this._gltf.nodes, index);
                    promises.push(_this.loadNodeAsync("/nodes/" + childNode.index, childNode, function (childBabylonMesh) {
                        childBabylonMesh.parent = babylonTransformNode;
                    }));
                }
            }
            assign(babylonTransformNode);
        };
        if (node.mesh == undefined) {
            var nodeName = node.name || "node" + node.index;
            this._babylonScene._blockEntityCollection = this._forAssetContainer;
            node._babylonTransformNode = new TransformNode(nodeName, this._babylonScene);
            this._babylonScene._blockEntityCollection = false;
            loadNode(node._babylonTransformNode);
        }
        else {
            var mesh = ArrayItem.Get(context + "/mesh", this._gltf.meshes, node.mesh);
            promises.push(this._loadMeshAsync("/meshes/" + mesh.index, node, mesh, loadNode));
        }
        this.logClose();
        return Promise.all(promises).then(function () {
            _this._forEachPrimitive(node, function (babylonMesh) {
                if (babylonMesh.geometry && babylonMesh.geometry.useBoundingInfoFromGeometry) {
                    // simply apply the world matrices to the bounding info - the extends are already ok
                    babylonMesh._updateBoundingInfo();
                }
                else {
                    babylonMesh.refreshBoundingInfo(true);
                }
            });
            return node._babylonTransformNode;
        });
    };
    GLTFLoader.prototype._loadMeshAsync = function (context, node, mesh, assign) {
        var primitives = mesh.primitives;
        if (!primitives || !primitives.length) {
            throw new Error(context + ": Primitives are missing");
        }
        if (primitives[0].index == undefined) {
            ArrayItem.Assign(primitives);
        }
        var promises = new Array();
        this.logOpen(context + " " + (mesh.name || ""));
        var name = node.name || "node" + node.index;
        if (primitives.length === 1) {
            var primitive = mesh.primitives[0];
            promises.push(this._loadMeshPrimitiveAsync(context + "/primitives/" + primitive.index, name, node, mesh, primitive, function (babylonMesh) {
                node._babylonTransformNode = babylonMesh;
                node._primitiveBabylonMeshes = [babylonMesh];
            }));
        }
        else {
            this._babylonScene._blockEntityCollection = this._forAssetContainer;
            node._babylonTransformNode = new TransformNode(name, this._babylonScene);
            this._babylonScene._blockEntityCollection = false;
            node._primitiveBabylonMeshes = [];
            for (var _i = 0, primitives_1 = primitives; _i < primitives_1.length; _i++) {
                var primitive = primitives_1[_i];
                promises.push(this._loadMeshPrimitiveAsync(context + "/primitives/" + primitive.index, name + "_primitive" + primitive.index, node, mesh, primitive, function (babylonMesh) {
                    babylonMesh.parent = node._babylonTransformNode;
                    node._primitiveBabylonMeshes.push(babylonMesh);
                }));
            }
        }
        if (node.skin != undefined) {
            var skin = ArrayItem.Get(context + "/skin", this._gltf.skins, node.skin);
            promises.push(this._loadSkinAsync("/skins/" + skin.index, node, skin));
        }
        assign(node._babylonTransformNode);
        this.logClose();
        return Promise.all(promises).then(function () {
            return node._babylonTransformNode;
        });
    };
    /**
     * @hidden Define this method to modify the default behavior when loading data for mesh primitives.
     * @param context The context when loading the asset
     * @param name The mesh name when loading the asset
     * @param node The glTF node when loading the asset
     * @param mesh The glTF mesh when loading the asset
     * @param primitive The glTF mesh primitive property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded mesh when the load is complete or null if not handled
     */
    GLTFLoader.prototype._loadMeshPrimitiveAsync = function (context, name, node, mesh, primitive, assign) {
        var _this = this;
        var extensionPromise = this._extensionsLoadMeshPrimitiveAsync(context, name, node, mesh, primitive, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        this.logOpen("" + context);
        var shouldInstance = (this._disableInstancedMesh === 0) && this._parent.createInstances && (node.skin == undefined && !mesh.primitives[0].targets);
        var babylonAbstractMesh;
        var promise;
        if (shouldInstance && primitive._instanceData) {
            babylonAbstractMesh = primitive._instanceData.babylonSourceMesh.createInstance(name);
            promise = primitive._instanceData.promise;
        }
        else {
            var promises = new Array();
            this._babylonScene._blockEntityCollection = this._forAssetContainer;
            var babylonMesh_1 = new Mesh(name, this._babylonScene);
            this._babylonScene._blockEntityCollection = false;
            babylonMesh_1.overrideMaterialSideOrientation = this._babylonScene.useRightHandedSystem ? Material.CounterClockWiseSideOrientation : Material.ClockWiseSideOrientation;
            this._createMorphTargets(context, node, mesh, primitive, babylonMesh_1);
            promises.push(this._loadVertexDataAsync(context, primitive, babylonMesh_1).then(function (babylonGeometry) {
                return _this._loadMorphTargetsAsync(context, primitive, babylonMesh_1, babylonGeometry).then(function () {
                    _this._babylonScene._blockEntityCollection = _this._forAssetContainer;
                    babylonGeometry.applyToMesh(babylonMesh_1);
                    _this._babylonScene._blockEntityCollection = false;
                });
            }));
            var babylonDrawMode = GLTFLoader._GetDrawMode(context, primitive.mode);
            if (primitive.material == undefined) {
                var babylonMaterial = this._defaultBabylonMaterialData[babylonDrawMode];
                if (!babylonMaterial) {
                    babylonMaterial = this._createDefaultMaterial("__GLTFLoader._default", babylonDrawMode);
                    this._parent.onMaterialLoadedObservable.notifyObservers(babylonMaterial);
                    this._defaultBabylonMaterialData[babylonDrawMode] = babylonMaterial;
                }
                babylonMesh_1.material = babylonMaterial;
            }
            else {
                var material = ArrayItem.Get(context + "/material", this._gltf.materials, primitive.material);
                promises.push(this._loadMaterialAsync("/materials/" + material.index, material, babylonMesh_1, babylonDrawMode, function (babylonMaterial) {
                    babylonMesh_1.material = babylonMaterial;
                }));
            }
            promise = Promise.all(promises);
            if (shouldInstance) {
                primitive._instanceData = {
                    babylonSourceMesh: babylonMesh_1,
                    promise: promise
                };
            }
            babylonAbstractMesh = babylonMesh_1;
        }
        GLTFLoader.AddPointerMetadata(babylonAbstractMesh, context);
        this._parent.onMeshLoadedObservable.notifyObservers(babylonAbstractMesh);
        assign(babylonAbstractMesh);
        this.logClose();
        return promise.then(function () {
            return babylonAbstractMesh;
        });
    };
    GLTFLoader.prototype._loadVertexDataAsync = function (context, primitive, babylonMesh) {
        var _this = this;
        var extensionPromise = this._extensionsLoadVertexDataAsync(context, primitive, babylonMesh);
        if (extensionPromise) {
            return extensionPromise;
        }
        var attributes = primitive.attributes;
        if (!attributes) {
            throw new Error(context + ": Attributes are missing");
        }
        var promises = new Array();
        var babylonGeometry = new Geometry(babylonMesh.name, this._babylonScene);
        if (primitive.indices == undefined) {
            babylonMesh.isUnIndexed = true;
        }
        else {
            var accessor = ArrayItem.Get(context + "/indices", this._gltf.accessors, primitive.indices);
            promises.push(this._loadIndicesAccessorAsync("/accessors/" + accessor.index, accessor).then(function (data) {
                babylonGeometry.setIndices(data);
            }));
        }
        var loadAttribute = function (attribute, kind, callback) {
            if (attributes[attribute] == undefined) {
                return;
            }
            babylonMesh._delayInfo = babylonMesh._delayInfo || [];
            if (babylonMesh._delayInfo.indexOf(kind) === -1) {
                babylonMesh._delayInfo.push(kind);
            }
            var accessor = ArrayItem.Get(context + "/attributes/" + attribute, _this._gltf.accessors, attributes[attribute]);
            promises.push(_this._loadVertexAccessorAsync("/accessors/" + accessor.index, accessor, kind).then(function (babylonVertexBuffer) {
                if (babylonVertexBuffer.getKind() === VertexBuffer.PositionKind && !_this.parent.alwaysComputeBoundingBox && !babylonMesh.skeleton) {
                    var mmin = accessor.min, mmax = accessor.max;
                    if (mmin !== undefined && mmax !== undefined) {
                        var min = TmpVectors.Vector3[0], max = TmpVectors.Vector3[1];
                        min.copyFromFloats.apply(min, mmin);
                        max.copyFromFloats.apply(max, mmax);
                        babylonGeometry._boundingInfo = new BoundingInfo(min, max);
                        babylonGeometry.useBoundingInfoFromGeometry = true;
                    }
                }
                babylonGeometry.setVerticesBuffer(babylonVertexBuffer, accessor.count);
            }));
            if (kind == VertexBuffer.MatricesIndicesExtraKind) {
                babylonMesh.numBoneInfluencers = 8;
            }
            if (callback) {
                callback(accessor);
            }
        };
        loadAttribute("POSITION", VertexBuffer.PositionKind);
        loadAttribute("NORMAL", VertexBuffer.NormalKind);
        loadAttribute("TANGENT", VertexBuffer.TangentKind);
        loadAttribute("TEXCOORD_0", VertexBuffer.UVKind);
        loadAttribute("TEXCOORD_1", VertexBuffer.UV2Kind);
        loadAttribute("JOINTS_0", VertexBuffer.MatricesIndicesKind);
        loadAttribute("WEIGHTS_0", VertexBuffer.MatricesWeightsKind);
        loadAttribute("JOINTS_1", VertexBuffer.MatricesIndicesExtraKind);
        loadAttribute("WEIGHTS_1", VertexBuffer.MatricesWeightsExtraKind);
        loadAttribute("COLOR_0", VertexBuffer.ColorKind, function (accessor) {
            if (accessor.type === "VEC4" /* VEC4 */) {
                babylonMesh.hasVertexAlpha = true;
            }
        });
        return Promise.all(promises).then(function () {
            return babylonGeometry;
        });
    };
    GLTFLoader.prototype._createMorphTargets = function (context, node, mesh, primitive, babylonMesh) {
        if (!primitive.targets) {
            return;
        }
        if (node._numMorphTargets == undefined) {
            node._numMorphTargets = primitive.targets.length;
        }
        else if (primitive.targets.length !== node._numMorphTargets) {
            throw new Error(context + ": Primitives do not have the same number of targets");
        }
        var targetNames = mesh.extras ? mesh.extras.targetNames : null;
        babylonMesh.morphTargetManager = new MorphTargetManager(babylonMesh.getScene());
        for (var index = 0; index < primitive.targets.length; index++) {
            var weight = node.weights ? node.weights[index] : mesh.weights ? mesh.weights[index] : 0;
            var name_4 = targetNames ? targetNames[index] : "morphTarget" + index;
            babylonMesh.morphTargetManager.addTarget(new MorphTarget(name_4, weight, babylonMesh.getScene()));
            // TODO: tell the target whether it has positions, normals, tangents
        }
    };
    GLTFLoader.prototype._loadMorphTargetsAsync = function (context, primitive, babylonMesh, babylonGeometry) {
        if (!primitive.targets) {
            return Promise.resolve();
        }
        var promises = new Array();
        var morphTargetManager = babylonMesh.morphTargetManager;
        for (var index = 0; index < morphTargetManager.numTargets; index++) {
            var babylonMorphTarget = morphTargetManager.getTarget(index);
            promises.push(this._loadMorphTargetVertexDataAsync(context + "/targets/" + index, babylonGeometry, primitive.targets[index], babylonMorphTarget));
        }
        return Promise.all(promises).then(function () { });
    };
    GLTFLoader.prototype._loadMorphTargetVertexDataAsync = function (context, babylonGeometry, attributes, babylonMorphTarget) {
        var _this = this;
        var promises = new Array();
        var loadAttribute = function (attribute, kind, setData) {
            if (attributes[attribute] == undefined) {
                return;
            }
            var babylonVertexBuffer = babylonGeometry.getVertexBuffer(kind);
            if (!babylonVertexBuffer) {
                return;
            }
            var accessor = ArrayItem.Get(context + "/" + attribute, _this._gltf.accessors, attributes[attribute]);
            promises.push(_this._loadFloatAccessorAsync("/accessors/" + accessor.index, accessor).then(function (data) {
                setData(babylonVertexBuffer, data);
            }));
        };
        loadAttribute("POSITION", VertexBuffer.PositionKind, function (babylonVertexBuffer, data) {
            var positions = new Float32Array(data.length);
            babylonVertexBuffer.forEach(data.length, function (value, index) {
                positions[index] = data[index] + value;
            });
            babylonMorphTarget.setPositions(positions);
        });
        loadAttribute("NORMAL", VertexBuffer.NormalKind, function (babylonVertexBuffer, data) {
            var normals = new Float32Array(data.length);
            babylonVertexBuffer.forEach(normals.length, function (value, index) {
                normals[index] = data[index] + value;
            });
            babylonMorphTarget.setNormals(normals);
        });
        loadAttribute("TANGENT", VertexBuffer.TangentKind, function (babylonVertexBuffer, data) {
            var tangents = new Float32Array(data.length / 3 * 4);
            var dataIndex = 0;
            babylonVertexBuffer.forEach(data.length / 3 * 4, function (value, index) {
                // Tangent data for morph targets is stored as xyz delta.
                // The vertexData.tangent is stored as xyzw.
                // So we need to skip every fourth vertexData.tangent.
                if (((index + 1) % 4) !== 0) {
                    tangents[dataIndex] = data[dataIndex] + value;
                    dataIndex++;
                }
            });
            babylonMorphTarget.setTangents(tangents);
        });
        return Promise.all(promises).then(function () { });
    };
    GLTFLoader._LoadTransform = function (node, babylonNode) {
        // Ignore the TRS of skinned nodes.
        // See https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins (second implementation note)
        if (node.skin != undefined) {
            return;
        }
        var position = Vector3.Zero();
        var rotation = Quaternion.Identity();
        var scaling = Vector3.One();
        if (node.matrix) {
            var matrix = Matrix.FromArray(node.matrix);
            matrix.decompose(scaling, rotation, position);
        }
        else {
            if (node.translation) {
                position = Vector3.FromArray(node.translation);
            }
            if (node.rotation) {
                rotation = Quaternion.FromArray(node.rotation);
            }
            if (node.scale) {
                scaling = Vector3.FromArray(node.scale);
            }
        }
        babylonNode.position = position;
        babylonNode.rotationQuaternion = rotation;
        babylonNode.scaling = scaling;
    };
    GLTFLoader.prototype._loadSkinAsync = function (context, node, skin) {
        var _this = this;
        var extensionPromise = this._extensionsLoadSkinAsync(context, node, skin);
        if (extensionPromise) {
            return extensionPromise;
        }
        var assignSkeleton = function (skeleton) {
            _this._forEachPrimitive(node, function (babylonMesh) {
                babylonMesh.skeleton = skeleton;
            });
        };
        if (skin._data) {
            assignSkeleton(skin._data.babylonSkeleton);
            return skin._data.promise;
        }
        var skeletonId = "skeleton" + skin.index;
        this._babylonScene._blockEntityCollection = this._forAssetContainer;
        var babylonSkeleton = new Skeleton(skin.name || skeletonId, skeletonId, this._babylonScene);
        this._babylonScene._blockEntityCollection = false;
        // See https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins (second implementation note)
        babylonSkeleton.overrideMesh = this._rootBabylonMesh;
        this._loadBones(context, skin, babylonSkeleton);
        assignSkeleton(babylonSkeleton);
        var promise = this._loadSkinInverseBindMatricesDataAsync(context, skin).then(function (inverseBindMatricesData) {
            _this._updateBoneMatrices(babylonSkeleton, inverseBindMatricesData);
        });
        skin._data = {
            babylonSkeleton: babylonSkeleton,
            promise: promise
        };
        return promise;
    };
    GLTFLoader.prototype._loadBones = function (context, skin, babylonSkeleton) {
        var babylonBones = {};
        for (var _i = 0, _a = skin.joints; _i < _a.length; _i++) {
            var index = _a[_i];
            var node = ArrayItem.Get(context + "/joints/" + index, this._gltf.nodes, index);
            this._loadBone(node, skin, babylonSkeleton, babylonBones);
        }
    };
    GLTFLoader.prototype._loadBone = function (node, skin, babylonSkeleton, babylonBones) {
        var babylonBone = babylonBones[node.index];
        if (babylonBone) {
            return babylonBone;
        }
        var babylonParentBone = null;
        if (node.parent && node.parent._babylonTransformNode !== this._rootBabylonMesh) {
            babylonParentBone = this._loadBone(node.parent, skin, babylonSkeleton, babylonBones);
        }
        var boneIndex = skin.joints.indexOf(node.index);
        babylonBone = new Bone(node.name || "joint" + node.index, babylonSkeleton, babylonParentBone, this._getNodeMatrix(node), null, null, boneIndex);
        babylonBones[node.index] = babylonBone;
        node._babylonBones = node._babylonBones || [];
        node._babylonBones.push(babylonBone);
        return babylonBone;
    };
    GLTFLoader.prototype._loadSkinInverseBindMatricesDataAsync = function (context, skin) {
        if (skin.inverseBindMatrices == undefined) {
            return Promise.resolve(null);
        }
        var accessor = ArrayItem.Get(context + "/inverseBindMatrices", this._gltf.accessors, skin.inverseBindMatrices);
        return this._loadFloatAccessorAsync("/accessors/" + accessor.index, accessor);
    };
    GLTFLoader.prototype._updateBoneMatrices = function (babylonSkeleton, inverseBindMatricesData) {
        for (var _i = 0, _a = babylonSkeleton.bones; _i < _a.length; _i++) {
            var babylonBone = _a[_i];
            var baseMatrix = Matrix.Identity();
            var boneIndex = babylonBone._index;
            if (inverseBindMatricesData && boneIndex !== -1) {
                Matrix.FromArrayToRef(inverseBindMatricesData, boneIndex * 16, baseMatrix);
                baseMatrix.invertToRef(baseMatrix);
            }
            var babylonParentBone = babylonBone.getParent();
            if (babylonParentBone) {
                baseMatrix.multiplyToRef(babylonParentBone.getInvertedAbsoluteTransform(), baseMatrix);
            }
            babylonBone.setBindPose(baseMatrix);
            babylonBone.updateMatrix(baseMatrix, false, false);
            babylonBone._updateDifferenceMatrix(undefined, false);
        }
    };
    GLTFLoader.prototype._getNodeMatrix = function (node) {
        return node.matrix ?
            Matrix.FromArray(node.matrix) :
            Matrix.Compose(node.scale ? Vector3.FromArray(node.scale) : Vector3.One(), node.rotation ? Quaternion.FromArray(node.rotation) : Quaternion.Identity(), node.translation ? Vector3.FromArray(node.translation) : Vector3.Zero());
    };
    /**
     * Loads a glTF camera.
     * @param context The context when loading the asset
     * @param camera The glTF camera property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon camera when the load is complete
     */
    GLTFLoader.prototype.loadCameraAsync = function (context, camera, assign) {
        if (assign === void 0) { assign = function () { }; }
        var extensionPromise = this._extensionsLoadCameraAsync(context, camera, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        var promises = new Array();
        this.logOpen(context + " " + (camera.name || ""));
        this._babylonScene._blockEntityCollection = this._forAssetContainer;
        var babylonCamera = new FreeCamera(camera.name || "camera" + camera.index, Vector3.Zero(), this._babylonScene, false);
        this._babylonScene._blockEntityCollection = false;
        babylonCamera.ignoreParentScaling = true;
        babylonCamera.rotation = new Vector3(0, Math.PI, 0);
        switch (camera.type) {
            case "perspective" /* PERSPECTIVE */: {
                var perspective = camera.perspective;
                if (!perspective) {
                    throw new Error(context + ": Camera perspective properties are missing");
                }
                babylonCamera.fov = perspective.yfov;
                babylonCamera.minZ = perspective.znear;
                babylonCamera.maxZ = perspective.zfar || Number.MAX_VALUE;
                break;
            }
            case "orthographic" /* ORTHOGRAPHIC */: {
                if (!camera.orthographic) {
                    throw new Error(context + ": Camera orthographic properties are missing");
                }
                babylonCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
                babylonCamera.orthoLeft = -camera.orthographic.xmag;
                babylonCamera.orthoRight = camera.orthographic.xmag;
                babylonCamera.orthoBottom = -camera.orthographic.ymag;
                babylonCamera.orthoTop = camera.orthographic.ymag;
                babylonCamera.minZ = camera.orthographic.znear;
                babylonCamera.maxZ = camera.orthographic.zfar;
                break;
            }
            default: {
                throw new Error(context + ": Invalid camera type (" + camera.type + ")");
            }
        }
        GLTFLoader.AddPointerMetadata(babylonCamera, context);
        this._parent.onCameraLoadedObservable.notifyObservers(babylonCamera);
        assign(babylonCamera);
        this.logClose();
        return Promise.all(promises).then(function () {
            return babylonCamera;
        });
    };
    GLTFLoader.prototype._loadAnimationsAsync = function () {
        var animations = this._gltf.animations;
        if (!animations) {
            return Promise.resolve();
        }
        var promises = new Array();
        for (var index = 0; index < animations.length; index++) {
            var animation = animations[index];
            promises.push(this.loadAnimationAsync("/animations/" + animation.index, animation));
        }
        return Promise.all(promises).then(function () { });
    };
    /**
     * Loads a glTF animation.
     * @param context The context when loading the asset
     * @param animation The glTF animation property
     * @returns A promise that resolves with the loaded Babylon animation group when the load is complete
     */
    GLTFLoader.prototype.loadAnimationAsync = function (context, animation) {
        var promise = this._extensionsLoadAnimationAsync(context, animation);
        if (promise) {
            return promise;
        }
        this._babylonScene._blockEntityCollection = this._forAssetContainer;
        var babylonAnimationGroup = new AnimationGroup(animation.name || "animation" + animation.index, this._babylonScene);
        this._babylonScene._blockEntityCollection = false;
        animation._babylonAnimationGroup = babylonAnimationGroup;
        var promises = new Array();
        ArrayItem.Assign(animation.channels);
        ArrayItem.Assign(animation.samplers);
        for (var _i = 0, _a = animation.channels; _i < _a.length; _i++) {
            var channel = _a[_i];
            promises.push(this._loadAnimationChannelAsync(context + "/channels/" + channel.index, context, animation, channel, babylonAnimationGroup));
        }
        return Promise.all(promises).then(function () {
            babylonAnimationGroup.normalize(0);
            return babylonAnimationGroup;
        });
    };
    /**
     * @hidden Loads a glTF animation channel.
     * @param context The context when loading the asset
     * @param animationContext The context of the animation when loading the asset
     * @param animation The glTF animation property
     * @param channel The glTF animation channel property
     * @param babylonAnimationGroup The babylon animation group property
     * @param animationTargetOverride The babylon animation channel target override property. My be null.
     * @returns A void promise when the channel load is complete
     */
    GLTFLoader.prototype._loadAnimationChannelAsync = function (context, animationContext, animation, channel, babylonAnimationGroup, animationTargetOverride) {
        var _this = this;
        if (animationTargetOverride === void 0) { animationTargetOverride = null; }
        if (channel.target.node == undefined) {
            return Promise.resolve();
        }
        var targetNode = ArrayItem.Get(context + "/target/node", this._gltf.nodes, channel.target.node);
        // Ignore animations that have no animation targets.
        if ((channel.target.path === "weights" /* WEIGHTS */ && !targetNode._numMorphTargets) ||
            (channel.target.path !== "weights" /* WEIGHTS */ && !targetNode._babylonTransformNode)) {
            return Promise.resolve();
        }
        var sampler = ArrayItem.Get(context + "/sampler", animation.samplers, channel.sampler);
        return this._loadAnimationSamplerAsync(animationContext + "/samplers/" + channel.sampler, sampler).then(function (data) {
            var targetPath;
            var animationType;
            switch (channel.target.path) {
                case "translation" /* TRANSLATION */: {
                    targetPath = "position";
                    animationType = Animation.ANIMATIONTYPE_VECTOR3;
                    break;
                }
                case "rotation" /* ROTATION */: {
                    targetPath = "rotationQuaternion";
                    animationType = Animation.ANIMATIONTYPE_QUATERNION;
                    break;
                }
                case "scale" /* SCALE */: {
                    targetPath = "scaling";
                    animationType = Animation.ANIMATIONTYPE_VECTOR3;
                    break;
                }
                case "weights" /* WEIGHTS */: {
                    targetPath = "influence";
                    animationType = Animation.ANIMATIONTYPE_FLOAT;
                    break;
                }
                default: {
                    throw new Error(context + "/target/path: Invalid value (" + channel.target.path + ")");
                }
            }
            var outputBufferOffset = 0;
            var getNextOutputValue;
            switch (targetPath) {
                case "position": {
                    getNextOutputValue = function () {
                        var value = Vector3.FromArray(data.output, outputBufferOffset);
                        outputBufferOffset += 3;
                        return value;
                    };
                    break;
                }
                case "rotationQuaternion": {
                    getNextOutputValue = function () {
                        var value = Quaternion.FromArray(data.output, outputBufferOffset);
                        outputBufferOffset += 4;
                        return value;
                    };
                    break;
                }
                case "scaling": {
                    getNextOutputValue = function () {
                        var value = Vector3.FromArray(data.output, outputBufferOffset);
                        outputBufferOffset += 3;
                        return value;
                    };
                    break;
                }
                case "influence": {
                    getNextOutputValue = function () {
                        var value = new Array(targetNode._numMorphTargets);
                        for (var i = 0; i < targetNode._numMorphTargets; i++) {
                            value[i] = data.output[outputBufferOffset++];
                        }
                        return value;
                    };
                    break;
                }
            }
            var getNextKey;
            switch (data.interpolation) {
                case "STEP" /* STEP */: {
                    getNextKey = function (frameIndex) { return ({
                        frame: data.input[frameIndex],
                        value: getNextOutputValue(),
                        interpolation: AnimationKeyInterpolation.STEP
                    }); };
                    break;
                }
                case "LINEAR" /* LINEAR */: {
                    getNextKey = function (frameIndex) { return ({
                        frame: data.input[frameIndex],
                        value: getNextOutputValue()
                    }); };
                    break;
                }
                case "CUBICSPLINE" /* CUBICSPLINE */: {
                    getNextKey = function (frameIndex) { return ({
                        frame: data.input[frameIndex],
                        inTangent: getNextOutputValue(),
                        value: getNextOutputValue(),
                        outTangent: getNextOutputValue()
                    }); };
                    break;
                }
            }
            var keys = new Array(data.input.length);
            for (var frameIndex = 0; frameIndex < data.input.length; frameIndex++) {
                keys[frameIndex] = getNextKey(frameIndex);
            }
            if (targetPath === "influence") {
                var _loop_2 = function (targetIndex) {
                    var animationName = babylonAnimationGroup.name + "_channel" + babylonAnimationGroup.targetedAnimations.length;
                    var babylonAnimation = new Animation(animationName, targetPath, 1, animationType);
                    babylonAnimation.setKeys(keys.map(function (key) { return ({
                        frame: key.frame,
                        inTangent: key.inTangent ? key.inTangent[targetIndex] : undefined,
                        value: key.value[targetIndex],
                        outTangent: key.outTangent ? key.outTangent[targetIndex] : undefined
                    }); }));
                    _this._forEachPrimitive(targetNode, function (babylonAbstractMesh) {
                        var babylonMesh = babylonAbstractMesh;
                        var morphTarget = babylonMesh.morphTargetManager.getTarget(targetIndex);
                        var babylonAnimationClone = babylonAnimation.clone();
                        morphTarget.animations.push(babylonAnimationClone);
                        babylonAnimationGroup.addTargetedAnimation(babylonAnimationClone, morphTarget);
                    });
                };
                for (var targetIndex = 0; targetIndex < targetNode._numMorphTargets; targetIndex++) {
                    _loop_2(targetIndex);
                }
            }
            else {
                var animationName = babylonAnimationGroup.name + "_channel" + babylonAnimationGroup.targetedAnimations.length;
                var babylonAnimation = new Animation(animationName, targetPath, 1, animationType);
                babylonAnimation.setKeys(keys);
                if (animationTargetOverride != null && animationTargetOverride.animations != null) {
                    animationTargetOverride.animations.push(babylonAnimation);
                    babylonAnimationGroup.addTargetedAnimation(babylonAnimation, animationTargetOverride);
                }
                else {
                    targetNode._babylonTransformNode.animations.push(babylonAnimation);
                    babylonAnimationGroup.addTargetedAnimation(babylonAnimation, targetNode._babylonTransformNode);
                }
            }
        });
    };
    GLTFLoader.prototype._loadAnimationSamplerAsync = function (context, sampler) {
        if (sampler._data) {
            return sampler._data;
        }
        var interpolation = sampler.interpolation || "LINEAR" /* LINEAR */;
        switch (interpolation) {
            case "STEP" /* STEP */:
            case "LINEAR" /* LINEAR */:
            case "CUBICSPLINE" /* CUBICSPLINE */: {
                break;
            }
            default: {
                throw new Error(context + "/interpolation: Invalid value (" + sampler.interpolation + ")");
            }
        }
        var inputAccessor = ArrayItem.Get(context + "/input", this._gltf.accessors, sampler.input);
        var outputAccessor = ArrayItem.Get(context + "/output", this._gltf.accessors, sampler.output);
        sampler._data = Promise.all([
            this._loadFloatAccessorAsync("/accessors/" + inputAccessor.index, inputAccessor),
            this._loadFloatAccessorAsync("/accessors/" + outputAccessor.index, outputAccessor)
        ]).then(function (_a) {
            var inputData = _a[0], outputData = _a[1];
            return {
                input: inputData,
                interpolation: interpolation,
                output: outputData,
            };
        });
        return sampler._data;
    };
    GLTFLoader.prototype._loadBufferAsync = function (context, buffer, byteOffset, byteLength) {
        var extensionPromise = this._extensionsLoadBufferAsync(context, buffer, byteOffset, byteLength);
        if (extensionPromise) {
            return extensionPromise;
        }
        if (!buffer._data) {
            if (buffer.uri) {
                buffer._data = this.loadUriAsync(context + "/uri", buffer, buffer.uri);
            }
            else {
                if (!this._bin) {
                    throw new Error(context + ": Uri is missing or the binary glTF is missing its binary chunk");
                }
                buffer._data = this._bin.readAsync(0, buffer.byteLength);
            }
        }
        return buffer._data.then(function (data) {
            try {
                return new Uint8Array(data.buffer, data.byteOffset + byteOffset, byteLength);
            }
            catch (e) {
                throw new Error(context + ": " + e.message);
            }
        });
    };
    /**
     * Loads a glTF buffer view.
     * @param context The context when loading the asset
     * @param bufferView The glTF buffer view property
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    GLTFLoader.prototype.loadBufferViewAsync = function (context, bufferView) {
        var extensionPromise = this._extensionsLoadBufferViewAsync(context, bufferView);
        if (extensionPromise) {
            return extensionPromise;
        }
        if (bufferView._data) {
            return bufferView._data;
        }
        var buffer = ArrayItem.Get(context + "/buffer", this._gltf.buffers, bufferView.buffer);
        bufferView._data = this._loadBufferAsync("/buffers/" + buffer.index, buffer, (bufferView.byteOffset || 0), bufferView.byteLength);
        return bufferView._data;
    };
    GLTFLoader.prototype._loadAccessorAsync = function (context, accessor, constructor) {
        var _this = this;
        if (accessor._data) {
            return accessor._data;
        }
        var numComponents = GLTFLoader._GetNumComponents(context, accessor.type);
        var byteStride = numComponents * VertexBuffer.GetTypeByteLength(accessor.componentType);
        var length = numComponents * accessor.count;
        if (accessor.bufferView == undefined) {
            accessor._data = Promise.resolve(new constructor(length));
        }
        else {
            var bufferView_1 = ArrayItem.Get(context + "/bufferView", this._gltf.bufferViews, accessor.bufferView);
            accessor._data = this.loadBufferViewAsync("/bufferViews/" + bufferView_1.index, bufferView_1).then(function (data) {
                if (accessor.componentType === 5126 /* FLOAT */ && !accessor.normalized && (!bufferView_1.byteStride || bufferView_1.byteStride === byteStride)) {
                    return GLTFLoader._GetTypedArray(context, accessor.componentType, data, accessor.byteOffset, length);
                }
                else {
                    var typedArray_1 = new constructor(length);
                    VertexBuffer.ForEach(data, accessor.byteOffset || 0, bufferView_1.byteStride || byteStride, numComponents, accessor.componentType, typedArray_1.length, accessor.normalized || false, function (value, index) {
                        typedArray_1[index] = value;
                    });
                    return typedArray_1;
                }
            });
        }
        if (accessor.sparse) {
            var sparse_1 = accessor.sparse;
            accessor._data = accessor._data.then(function (data) {
                var typedArray = data;
                var indicesBufferView = ArrayItem.Get(context + "/sparse/indices/bufferView", _this._gltf.bufferViews, sparse_1.indices.bufferView);
                var valuesBufferView = ArrayItem.Get(context + "/sparse/values/bufferView", _this._gltf.bufferViews, sparse_1.values.bufferView);
                return Promise.all([
                    _this.loadBufferViewAsync("/bufferViews/" + indicesBufferView.index, indicesBufferView),
                    _this.loadBufferViewAsync("/bufferViews/" + valuesBufferView.index, valuesBufferView)
                ]).then(function (_a) {
                    var indicesData = _a[0], valuesData = _a[1];
                    var indices = GLTFLoader._GetTypedArray(context + "/sparse/indices", sparse_1.indices.componentType, indicesData, sparse_1.indices.byteOffset, sparse_1.count);
                    var sparseLength = numComponents * sparse_1.count;
                    var values;
                    if (accessor.componentType === 5126 /* FLOAT */ && !accessor.normalized) {
                        values = GLTFLoader._GetTypedArray(context + "/sparse/values", accessor.componentType, valuesData, sparse_1.values.byteOffset, sparseLength);
                    }
                    else {
                        var sparseData = GLTFLoader._GetTypedArray(context + "/sparse/values", accessor.componentType, valuesData, sparse_1.values.byteOffset, sparseLength);
                        values = new constructor(sparseLength);
                        VertexBuffer.ForEach(sparseData, 0, byteStride, numComponents, accessor.componentType, values.length, accessor.normalized || false, function (value, index) {
                            values[index] = value;
                        });
                    }
                    var valuesIndex = 0;
                    for (var indicesIndex = 0; indicesIndex < indices.length; indicesIndex++) {
                        var dataIndex = indices[indicesIndex] * numComponents;
                        for (var componentIndex = 0; componentIndex < numComponents; componentIndex++) {
                            typedArray[dataIndex++] = values[valuesIndex++];
                        }
                    }
                    return typedArray;
                });
            });
        }
        return accessor._data;
    };
    /** @hidden */
    GLTFLoader.prototype._loadFloatAccessorAsync = function (context, accessor) {
        return this._loadAccessorAsync(context, accessor, Float32Array);
    };
    GLTFLoader.prototype._loadIndicesAccessorAsync = function (context, accessor) {
        if (accessor.type !== "SCALAR" /* SCALAR */) {
            throw new Error(context + "/type: Invalid value " + accessor.type);
        }
        if (accessor.componentType !== 5121 /* UNSIGNED_BYTE */ &&
            accessor.componentType !== 5123 /* UNSIGNED_SHORT */ &&
            accessor.componentType !== 5125 /* UNSIGNED_INT */) {
            throw new Error(context + "/componentType: Invalid value " + accessor.componentType);
        }
        if (accessor._data) {
            return accessor._data;
        }
        if (accessor.sparse) {
            var constructor = GLTFLoader._GetTypedArrayConstructor(context + "/componentType", accessor.componentType);
            accessor._data = this._loadAccessorAsync(context, accessor, constructor);
        }
        else {
            var bufferView = ArrayItem.Get(context + "/bufferView", this._gltf.bufferViews, accessor.bufferView);
            accessor._data = this.loadBufferViewAsync("/bufferViews/" + bufferView.index, bufferView).then(function (data) {
                return GLTFLoader._GetTypedArray(context, accessor.componentType, data, accessor.byteOffset, accessor.count);
            });
        }
        return accessor._data;
    };
    GLTFLoader.prototype._loadVertexBufferViewAsync = function (bufferView, kind) {
        var _this = this;
        if (bufferView._babylonBuffer) {
            return bufferView._babylonBuffer;
        }
        bufferView._babylonBuffer = this.loadBufferViewAsync("/bufferViews/" + bufferView.index, bufferView).then(function (data) {
            return new Buffer(_this._babylonScene.getEngine(), data, false);
        });
        return bufferView._babylonBuffer;
    };
    GLTFLoader.prototype._loadVertexAccessorAsync = function (context, accessor, kind) {
        var _this = this;
        if (accessor._babylonVertexBuffer) {
            return accessor._babylonVertexBuffer;
        }
        if (accessor.sparse) {
            accessor._babylonVertexBuffer = this._loadFloatAccessorAsync("/accessors/" + accessor.index, accessor).then(function (data) {
                return new VertexBuffer(_this._babylonScene.getEngine(), data, kind, false);
            });
        }
        // HACK: If byte offset is not a multiple of component type byte length then load as a float array instead of using Babylon buffers.
        else if (accessor.byteOffset && accessor.byteOffset % VertexBuffer.GetTypeByteLength(accessor.componentType) !== 0) {
            Logger.Warn("Accessor byte offset is not a multiple of component type byte length");
            accessor._babylonVertexBuffer = this._loadFloatAccessorAsync("/accessors/" + accessor.index, accessor).then(function (data) {
                return new VertexBuffer(_this._babylonScene.getEngine(), data, kind, false);
            });
        }
        // Load joint indices as a float array since the shaders expect float data but glTF uses unsigned byte/short.
        // This prevents certain platforms (e.g. D3D) from having to convert the data to float on the fly.
        else if (kind === VertexBuffer.MatricesIndicesKind || kind === VertexBuffer.MatricesIndicesExtraKind) {
            accessor._babylonVertexBuffer = this._loadFloatAccessorAsync("/accessors/" + accessor.index, accessor).then(function (data) {
                return new VertexBuffer(_this._babylonScene.getEngine(), data, kind, false);
            });
        }
        else {
            var bufferView_2 = ArrayItem.Get(context + "/bufferView", this._gltf.bufferViews, accessor.bufferView);
            accessor._babylonVertexBuffer = this._loadVertexBufferViewAsync(bufferView_2, kind).then(function (babylonBuffer) {
                var size = GLTFLoader._GetNumComponents(context, accessor.type);
                return new VertexBuffer(_this._babylonScene.getEngine(), babylonBuffer, kind, false, false, bufferView_2.byteStride, false, accessor.byteOffset, size, accessor.componentType, accessor.normalized, true, 1, true);
            });
        }
        return accessor._babylonVertexBuffer;
    };
    GLTFLoader.prototype._loadMaterialMetallicRoughnessPropertiesAsync = function (context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        var promises = new Array();
        if (properties) {
            if (properties.baseColorFactor) {
                babylonMaterial.albedoColor = Color3.FromArray(properties.baseColorFactor);
                babylonMaterial.alpha = properties.baseColorFactor[3];
            }
            else {
                babylonMaterial.albedoColor = Color3.White();
            }
            babylonMaterial.metallic = properties.metallicFactor == undefined ? 1 : properties.metallicFactor;
            babylonMaterial.roughness = properties.roughnessFactor == undefined ? 1 : properties.roughnessFactor;
            if (properties.baseColorTexture) {
                promises.push(this.loadTextureInfoAsync(context + "/baseColorTexture", properties.baseColorTexture, function (texture) {
                    texture.name = babylonMaterial.name + " (Base Color)";
                    babylonMaterial.albedoTexture = texture;
                }));
            }
            if (properties.metallicRoughnessTexture) {
                properties.metallicRoughnessTexture.nonColorData = true;
                promises.push(this.loadTextureInfoAsync(context + "/metallicRoughnessTexture", properties.metallicRoughnessTexture, function (texture) {
                    texture.name = babylonMaterial.name + " (Metallic Roughness)";
                    babylonMaterial.metallicTexture = texture;
                }));
                babylonMaterial.useMetallnessFromMetallicTextureBlue = true;
                babylonMaterial.useRoughnessFromMetallicTextureGreen = true;
                babylonMaterial.useRoughnessFromMetallicTextureAlpha = false;
            }
        }
        return Promise.all(promises).then(function () { });
    };
    /** @hidden */
    GLTFLoader.prototype._loadMaterialAsync = function (context, material, babylonMesh, babylonDrawMode, assign) {
        if (assign === void 0) { assign = function () { }; }
        var extensionPromise = this._extensionsLoadMaterialAsync(context, material, babylonMesh, babylonDrawMode, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        material._data = material._data || {};
        var babylonData = material._data[babylonDrawMode];
        if (!babylonData) {
            this.logOpen(context + " " + (material.name || ""));
            var babylonMaterial = this.createMaterial(context, material, babylonDrawMode);
            babylonData = {
                babylonMaterial: babylonMaterial,
                babylonMeshes: [],
                promise: this.loadMaterialPropertiesAsync(context, material, babylonMaterial)
            };
            material._data[babylonDrawMode] = babylonData;
            GLTFLoader.AddPointerMetadata(babylonMaterial, context);
            this._parent.onMaterialLoadedObservable.notifyObservers(babylonMaterial);
            this.logClose();
        }
        if (babylonMesh) {
            babylonData.babylonMeshes.push(babylonMesh);
            babylonMesh.onDisposeObservable.addOnce(function () {
                var index = babylonData.babylonMeshes.indexOf(babylonMesh);
                if (index !== -1) {
                    babylonData.babylonMeshes.splice(index, 1);
                }
            });
        }
        assign(babylonData.babylonMaterial);
        return babylonData.promise.then(function () {
            return babylonData.babylonMaterial;
        });
    };
    GLTFLoader.prototype._createDefaultMaterial = function (name, babylonDrawMode) {
        this._babylonScene._blockEntityCollection = this._forAssetContainer;
        var babylonMaterial = new PBRMaterial(name, this._babylonScene);
        this._babylonScene._blockEntityCollection = false;
        // Moved to mesh so user can change materials on gltf meshes: babylonMaterial.sideOrientation = this._babylonScene.useRightHandedSystem ? Material.CounterClockWiseSideOrientation : Material.ClockWiseSideOrientation;
        babylonMaterial.fillMode = babylonDrawMode;
        babylonMaterial.enableSpecularAntiAliasing = true;
        babylonMaterial.useRadianceOverAlpha = !this._parent.transparencyAsCoverage;
        babylonMaterial.useSpecularOverAlpha = !this._parent.transparencyAsCoverage;
        babylonMaterial.transparencyMode = PBRMaterial.PBRMATERIAL_OPAQUE;
        babylonMaterial.metallic = 1;
        babylonMaterial.roughness = 1;
        return babylonMaterial;
    };
    /**
     * Creates a Babylon material from a glTF material.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonDrawMode The draw mode for the Babylon material
     * @returns The Babylon material
     */
    GLTFLoader.prototype.createMaterial = function (context, material, babylonDrawMode) {
        var extensionPromise = this._extensionsCreateMaterial(context, material, babylonDrawMode);
        if (extensionPromise) {
            return extensionPromise;
        }
        var name = material.name || "material" + material.index;
        var babylonMaterial = this._createDefaultMaterial(name, babylonDrawMode);
        return babylonMaterial;
    };
    /**
     * Loads properties from a glTF material into a Babylon material.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonMaterial The Babylon material
     * @returns A promise that resolves when the load is complete
     */
    GLTFLoader.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var extensionPromise = this._extensionsLoadMaterialPropertiesAsync(context, material, babylonMaterial);
        if (extensionPromise) {
            return extensionPromise;
        }
        var promises = new Array();
        promises.push(this.loadMaterialBasePropertiesAsync(context, material, babylonMaterial));
        if (material.pbrMetallicRoughness) {
            promises.push(this._loadMaterialMetallicRoughnessPropertiesAsync(context + "/pbrMetallicRoughness", material.pbrMetallicRoughness, babylonMaterial));
        }
        this.loadMaterialAlphaProperties(context, material, babylonMaterial);
        return Promise.all(promises).then(function () { });
    };
    /**
     * Loads the normal, occlusion, and emissive properties from a glTF material into a Babylon material.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonMaterial The Babylon material
     * @returns A promise that resolves when the load is complete
     */
    GLTFLoader.prototype.loadMaterialBasePropertiesAsync = function (context, material, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        var promises = new Array();
        babylonMaterial.emissiveColor = material.emissiveFactor ? Color3.FromArray(material.emissiveFactor) : new Color3(0, 0, 0);
        if (material.doubleSided) {
            babylonMaterial.backFaceCulling = false;
            babylonMaterial.twoSidedLighting = true;
        }
        if (material.normalTexture) {
            material.normalTexture.nonColorData = true;
            promises.push(this.loadTextureInfoAsync(context + "/normalTexture", material.normalTexture, function (texture) {
                texture.name = babylonMaterial.name + " (Normal)";
                babylonMaterial.bumpTexture = texture;
            }));
            babylonMaterial.invertNormalMapX = !this._babylonScene.useRightHandedSystem;
            babylonMaterial.invertNormalMapY = this._babylonScene.useRightHandedSystem;
            if (material.normalTexture.scale != undefined) {
                babylonMaterial.bumpTexture.level = material.normalTexture.scale;
            }
            babylonMaterial.forceIrradianceInFragment = true;
        }
        if (material.occlusionTexture) {
            material.occlusionTexture.nonColorData = true;
            promises.push(this.loadTextureInfoAsync(context + "/occlusionTexture", material.occlusionTexture, function (texture) {
                texture.name = babylonMaterial.name + " (Occlusion)";
                babylonMaterial.ambientTexture = texture;
            }));
            babylonMaterial.useAmbientInGrayScale = true;
            if (material.occlusionTexture.strength != undefined) {
                babylonMaterial.ambientTextureStrength = material.occlusionTexture.strength;
            }
        }
        if (material.emissiveTexture) {
            promises.push(this.loadTextureInfoAsync(context + "/emissiveTexture", material.emissiveTexture, function (texture) {
                texture.name = babylonMaterial.name + " (Emissive)";
                babylonMaterial.emissiveTexture = texture;
            }));
        }
        return Promise.all(promises).then(function () { });
    };
    /**
     * Loads the alpha properties from a glTF material into a Babylon material.
     * Must be called after the setting the albedo texture of the Babylon material when the material has an albedo texture.
     * @param context The context when loading the asset
     * @param material The glTF material property
     * @param babylonMaterial The Babylon material
     */
    GLTFLoader.prototype.loadMaterialAlphaProperties = function (context, material, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        var alphaMode = material.alphaMode || "OPAQUE" /* OPAQUE */;
        switch (alphaMode) {
            case "OPAQUE" /* OPAQUE */: {
                babylonMaterial.transparencyMode = PBRMaterial.PBRMATERIAL_OPAQUE;
                break;
            }
            case "MASK" /* MASK */: {
                babylonMaterial.transparencyMode = PBRMaterial.PBRMATERIAL_ALPHATEST;
                babylonMaterial.alphaCutOff = (material.alphaCutoff == undefined ? 0.5 : material.alphaCutoff);
                if (babylonMaterial.albedoTexture) {
                    babylonMaterial.albedoTexture.hasAlpha = true;
                }
                break;
            }
            case "BLEND" /* BLEND */: {
                babylonMaterial.transparencyMode = PBRMaterial.PBRMATERIAL_ALPHABLEND;
                if (babylonMaterial.albedoTexture) {
                    babylonMaterial.albedoTexture.hasAlpha = true;
                    babylonMaterial.useAlphaFromAlbedoTexture = true;
                }
                break;
            }
            default: {
                throw new Error(context + "/alphaMode: Invalid value (" + material.alphaMode + ")");
            }
        }
    };
    /**
     * Loads a glTF texture info.
     * @param context The context when loading the asset
     * @param textureInfo The glTF texture info property
     * @param assign A function called synchronously after parsing the glTF properties
     * @returns A promise that resolves with the loaded Babylon texture when the load is complete
     */
    GLTFLoader.prototype.loadTextureInfoAsync = function (context, textureInfo, assign) {
        var _this = this;
        if (assign === void 0) { assign = function () { }; }
        var extensionPromise = this._extensionsLoadTextureInfoAsync(context, textureInfo, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        this.logOpen("" + context);
        if (textureInfo.texCoord >= 2) {
            throw new Error(context + "/texCoord: Invalid value (" + textureInfo.texCoord + ")");
        }
        var texture = ArrayItem.Get(context + "/index", this._gltf.textures, textureInfo.index);
        texture._textureInfo = textureInfo;
        var promise = this._loadTextureAsync("/textures/" + textureInfo.index, texture, function (babylonTexture) {
            babylonTexture.coordinatesIndex = textureInfo.texCoord || 0;
            GLTFLoader.AddPointerMetadata(babylonTexture, context);
            _this._parent.onTextureLoadedObservable.notifyObservers(babylonTexture);
            assign(babylonTexture);
        });
        this.logClose();
        return promise;
    };
    /** @hidden */
    GLTFLoader.prototype._loadTextureAsync = function (context, texture, assign) {
        if (assign === void 0) { assign = function () { }; }
        var extensionPromise = this._extensionsLoadTextureAsync(context, texture, assign);
        if (extensionPromise) {
            return extensionPromise;
        }
        this.logOpen(context + " " + (texture.name || ""));
        var sampler = (texture.sampler == undefined ? GLTFLoader.DefaultSampler : ArrayItem.Get(context + "/sampler", this._gltf.samplers, texture.sampler));
        var image = ArrayItem.Get(context + "/source", this._gltf.images, texture.source);
        var promise = this._createTextureAsync(context, sampler, image, assign);
        this.logClose();
        return promise;
    };
    /** @hidden */
    GLTFLoader.prototype._createTextureAsync = function (context, sampler, image, assign, textureLoaderOptions) {
        var _this = this;
        if (assign === void 0) { assign = function () { }; }
        var samplerData = this._loadSampler("/samplers/" + sampler.index, sampler);
        var promises = new Array();
        var deferred = new Deferred();
        this._babylonScene._blockEntityCollection = this._forAssetContainer;
        var babylonTexture = new Texture(null, this._babylonScene, samplerData.noMipMaps, false, samplerData.samplingMode, function () {
            if (!_this._disposed) {
                deferred.resolve();
            }
        }, function (message, exception) {
            if (!_this._disposed) {
                deferred.reject(new Error(context + ": " + ((exception && exception.message) ? exception.message : message || "Failed to load texture")));
            }
        }, undefined, undefined, undefined, image.mimeType, textureLoaderOptions);
        this._babylonScene._blockEntityCollection = false;
        promises.push(deferred.promise);
        promises.push(this.loadImageAsync("/images/" + image.index, image).then(function (data) {
            var name = image.uri || _this._fileName + "#image" + image.index;
            var dataUrl = "data:" + _this._uniqueRootUrl + name;
            babylonTexture.updateURL(dataUrl, data);
        }));
        babylonTexture.wrapU = samplerData.wrapU;
        babylonTexture.wrapV = samplerData.wrapV;
        assign(babylonTexture);
        return Promise.all(promises).then(function () {
            return babylonTexture;
        });
    };
    GLTFLoader.prototype._loadSampler = function (context, sampler) {
        if (!sampler._data) {
            sampler._data = {
                noMipMaps: (sampler.minFilter === 9728 /* NEAREST */ || sampler.minFilter === 9729 /* LINEAR */),
                samplingMode: GLTFLoader._GetTextureSamplingMode(context, sampler),
                wrapU: GLTFLoader._GetTextureWrapMode(context + "/wrapS", sampler.wrapS),
                wrapV: GLTFLoader._GetTextureWrapMode(context + "/wrapT", sampler.wrapT)
            };
        }
        return sampler._data;
    };
    /**
     * Loads a glTF image.
     * @param context The context when loading the asset
     * @param image The glTF image property
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    GLTFLoader.prototype.loadImageAsync = function (context, image) {
        if (!image._data) {
            this.logOpen(context + " " + (image.name || ""));
            if (image.uri) {
                image._data = this.loadUriAsync(context + "/uri", image, image.uri);
            }
            else {
                var bufferView = ArrayItem.Get(context + "/bufferView", this._gltf.bufferViews, image.bufferView);
                image._data = this.loadBufferViewAsync("/bufferViews/" + bufferView.index, bufferView);
            }
            this.logClose();
        }
        return image._data;
    };
    /**
     * Loads a glTF uri.
     * @param context The context when loading the asset
     * @param property The glTF property associated with the uri
     * @param uri The base64 or relative uri
     * @returns A promise that resolves with the loaded data when the load is complete
     */
    GLTFLoader.prototype.loadUriAsync = function (context, property, uri) {
        var _this = this;
        var extensionPromise = this._extensionsLoadUriAsync(context, property, uri);
        if (extensionPromise) {
            return extensionPromise;
        }
        if (!GLTFLoader._ValidateUri(uri)) {
            throw new Error(context + ": '" + uri + "' is invalid");
        }
        if (Tools.IsBase64(uri)) {
            var data = new Uint8Array(Tools.DecodeBase64(uri));
            this.log("Decoded " + uri.substr(0, 64) + "... (" + data.length + " bytes)");
            return Promise.resolve(data);
        }
        this.log("Loading " + uri);
        return this._parent.preprocessUrlAsync(this._rootUrl + uri).then(function (url) {
            return new Promise(function (resolve, reject) {
                _this._parent._loadFile(url, _this._babylonScene, function (data) {
                    if (!_this._disposed) {
                        _this.log("Loaded " + uri + " (" + data.byteLength + " bytes)");
                        resolve(new Uint8Array(data));
                    }
                }, true, function (request) {
                    reject(new LoadFileError(context + ": Failed to load '" + uri + "'" + (request ? ": " + request.status + " " + request.statusText : ""), request));
                });
            });
        });
    };
    /**
     * Adds a JSON pointer to the metadata of the Babylon object at `<object>.metadata.gltf.pointers`.
     * @param babylonObject the Babylon object with metadata
     * @param pointer the JSON pointer
     */
    GLTFLoader.AddPointerMetadata = function (babylonObject, pointer) {
        var metadata = (babylonObject.metadata = babylonObject.metadata || {});
        var gltf = (metadata.gltf = metadata.gltf || {});
        var pointers = (gltf.pointers = gltf.pointers || []);
        pointers.push(pointer);
    };
    GLTFLoader._GetTextureWrapMode = function (context, mode) {
        // Set defaults if undefined
        mode = mode == undefined ? 10497 /* REPEAT */ : mode;
        switch (mode) {
            case 33071 /* CLAMP_TO_EDGE */: return Texture.CLAMP_ADDRESSMODE;
            case 33648 /* MIRRORED_REPEAT */: return Texture.MIRROR_ADDRESSMODE;
            case 10497 /* REPEAT */: return Texture.WRAP_ADDRESSMODE;
            default:
                Logger.Warn(context + ": Invalid value (" + mode + ")");
                return Texture.WRAP_ADDRESSMODE;
        }
    };
    GLTFLoader._GetTextureSamplingMode = function (context, sampler) {
        // Set defaults if undefined
        var magFilter = sampler.magFilter == undefined ? 9729 /* LINEAR */ : sampler.magFilter;
        var minFilter = sampler.minFilter == undefined ? 9987 /* LINEAR_MIPMAP_LINEAR */ : sampler.minFilter;
        if (magFilter === 9729 /* LINEAR */) {
            switch (minFilter) {
                case 9728 /* NEAREST */: return Texture.LINEAR_NEAREST;
                case 9729 /* LINEAR */: return Texture.LINEAR_LINEAR;
                case 9984 /* NEAREST_MIPMAP_NEAREST */: return Texture.LINEAR_NEAREST_MIPNEAREST;
                case 9985 /* LINEAR_MIPMAP_NEAREST */: return Texture.LINEAR_LINEAR_MIPNEAREST;
                case 9986 /* NEAREST_MIPMAP_LINEAR */: return Texture.LINEAR_NEAREST_MIPLINEAR;
                case 9987 /* LINEAR_MIPMAP_LINEAR */: return Texture.LINEAR_LINEAR_MIPLINEAR;
                default:
                    Logger.Warn(context + "/minFilter: Invalid value (" + minFilter + ")");
                    return Texture.LINEAR_LINEAR_MIPLINEAR;
            }
        }
        else {
            if (magFilter !== 9728 /* NEAREST */) {
                Logger.Warn(context + "/magFilter: Invalid value (" + magFilter + ")");
            }
            switch (minFilter) {
                case 9728 /* NEAREST */: return Texture.NEAREST_NEAREST;
                case 9729 /* LINEAR */: return Texture.NEAREST_LINEAR;
                case 9984 /* NEAREST_MIPMAP_NEAREST */: return Texture.NEAREST_NEAREST_MIPNEAREST;
                case 9985 /* LINEAR_MIPMAP_NEAREST */: return Texture.NEAREST_LINEAR_MIPNEAREST;
                case 9986 /* NEAREST_MIPMAP_LINEAR */: return Texture.NEAREST_NEAREST_MIPLINEAR;
                case 9987 /* LINEAR_MIPMAP_LINEAR */: return Texture.NEAREST_LINEAR_MIPLINEAR;
                default:
                    Logger.Warn(context + "/minFilter: Invalid value (" + minFilter + ")");
                    return Texture.NEAREST_NEAREST_MIPNEAREST;
            }
        }
    };
    GLTFLoader._GetTypedArrayConstructor = function (context, componentType) {
        switch (componentType) {
            case 5120 /* BYTE */: return Int8Array;
            case 5121 /* UNSIGNED_BYTE */: return Uint8Array;
            case 5122 /* SHORT */: return Int16Array;
            case 5123 /* UNSIGNED_SHORT */: return Uint16Array;
            case 5125 /* UNSIGNED_INT */: return Uint32Array;
            case 5126 /* FLOAT */: return Float32Array;
            default: throw new Error(context + ": Invalid component type " + componentType);
        }
    };
    GLTFLoader._GetTypedArray = function (context, componentType, bufferView, byteOffset, length) {
        var buffer = bufferView.buffer;
        byteOffset = bufferView.byteOffset + (byteOffset || 0);
        var constructor = GLTFLoader._GetTypedArrayConstructor(context + "/componentType", componentType);
        try {
            return new constructor(buffer, byteOffset, length);
        }
        catch (e) {
            throw new Error(context + ": " + e);
        }
    };
    GLTFLoader._GetNumComponents = function (context, type) {
        switch (type) {
            case "SCALAR": return 1;
            case "VEC2": return 2;
            case "VEC3": return 3;
            case "VEC4": return 4;
            case "MAT2": return 4;
            case "MAT3": return 9;
            case "MAT4": return 16;
        }
        throw new Error(context + ": Invalid type (" + type + ")");
    };
    GLTFLoader._ValidateUri = function (uri) {
        return (Tools.IsBase64(uri) || uri.indexOf("..") === -1);
    };
    /** @hidden */
    GLTFLoader._GetDrawMode = function (context, mode) {
        if (mode == undefined) {
            mode = 4 /* TRIANGLES */;
        }
        switch (mode) {
            case 0 /* POINTS */: return Material.PointListDrawMode;
            case 1 /* LINES */: return Material.LineListDrawMode;
            case 2 /* LINE_LOOP */: return Material.LineLoopDrawMode;
            case 3 /* LINE_STRIP */: return Material.LineStripDrawMode;
            case 4 /* TRIANGLES */: return Material.TriangleFillMode;
            case 5 /* TRIANGLE_STRIP */: return Material.TriangleStripDrawMode;
            case 6 /* TRIANGLE_FAN */: return Material.TriangleFanDrawMode;
        }
        throw new Error(context + ": Invalid mesh primitive mode (" + mode + ")");
    };
    GLTFLoader.prototype._compileMaterialsAsync = function () {
        var _this = this;
        this._parent._startPerformanceCounter("Compile materials");
        var promises = new Array();
        if (this._gltf.materials) {
            for (var _i = 0, _a = this._gltf.materials; _i < _a.length; _i++) {
                var material = _a[_i];
                if (material._data) {
                    for (var babylonDrawMode in material._data) {
                        var babylonData = material._data[babylonDrawMode];
                        for (var _b = 0, _c = babylonData.babylonMeshes; _b < _c.length; _b++) {
                            var babylonMesh = _c[_b];
                            // Ensure nonUniformScaling is set if necessary.
                            babylonMesh.computeWorldMatrix(true);
                            var babylonMaterial = babylonData.babylonMaterial;
                            promises.push(babylonMaterial.forceCompilationAsync(babylonMesh));
                            promises.push(babylonMaterial.forceCompilationAsync(babylonMesh, { useInstances: true }));
                            if (this._parent.useClipPlane) {
                                promises.push(babylonMaterial.forceCompilationAsync(babylonMesh, { clipPlane: true }));
                                promises.push(babylonMaterial.forceCompilationAsync(babylonMesh, { clipPlane: true, useInstances: true }));
                            }
                        }
                    }
                }
            }
        }
        return Promise.all(promises).then(function () {
            _this._parent._endPerformanceCounter("Compile materials");
        });
    };
    GLTFLoader.prototype._compileShadowGeneratorsAsync = function () {
        var _this = this;
        this._parent._startPerformanceCounter("Compile shadow generators");
        var promises = new Array();
        var lights = this._babylonScene.lights;
        for (var _i = 0, lights_1 = lights; _i < lights_1.length; _i++) {
            var light = lights_1[_i];
            var generator = light.getShadowGenerator();
            if (generator) {
                promises.push(generator.forceCompilationAsync());
            }
        }
        return Promise.all(promises).then(function () {
            _this._parent._endPerformanceCounter("Compile shadow generators");
        });
    };
    GLTFLoader.prototype._forEachExtensions = function (action) {
        for (var _i = 0, _a = this._extensions; _i < _a.length; _i++) {
            var extension = _a[_i];
            if (extension.enabled) {
                action(extension);
            }
        }
    };
    GLTFLoader.prototype._applyExtensions = function (property, functionName, actionAsync) {
        for (var _i = 0, _a = this._extensions; _i < _a.length; _i++) {
            var extension = _a[_i];
            if (extension.enabled) {
                var id = extension.name + "." + functionName;
                var loaderProperty = property;
                loaderProperty._activeLoaderExtensionFunctions = loaderProperty._activeLoaderExtensionFunctions || {};
                var activeLoaderExtensionFunctions = loaderProperty._activeLoaderExtensionFunctions;
                if (!activeLoaderExtensionFunctions[id]) {
                    activeLoaderExtensionFunctions[id] = true;
                    try {
                        var result = actionAsync(extension);
                        if (result) {
                            return result;
                        }
                    }
                    finally {
                        delete activeLoaderExtensionFunctions[id];
                    }
                }
            }
        }
        return null;
    };
    GLTFLoader.prototype._extensionsOnLoading = function () {
        this._forEachExtensions(function (extension) { return extension.onLoading && extension.onLoading(); });
    };
    GLTFLoader.prototype._extensionsOnReady = function () {
        this._forEachExtensions(function (extension) { return extension.onReady && extension.onReady(); });
    };
    GLTFLoader.prototype._extensionsLoadSceneAsync = function (context, scene) {
        return this._applyExtensions(scene, "loadScene", function (extension) { return extension.loadSceneAsync && extension.loadSceneAsync(context, scene); });
    };
    GLTFLoader.prototype._extensionsLoadNodeAsync = function (context, node, assign) {
        return this._applyExtensions(node, "loadNode", function (extension) { return extension.loadNodeAsync && extension.loadNodeAsync(context, node, assign); });
    };
    GLTFLoader.prototype._extensionsLoadCameraAsync = function (context, camera, assign) {
        return this._applyExtensions(camera, "loadCamera", function (extension) { return extension.loadCameraAsync && extension.loadCameraAsync(context, camera, assign); });
    };
    GLTFLoader.prototype._extensionsLoadVertexDataAsync = function (context, primitive, babylonMesh) {
        return this._applyExtensions(primitive, "loadVertexData", function (extension) { return extension._loadVertexDataAsync && extension._loadVertexDataAsync(context, primitive, babylonMesh); });
    };
    GLTFLoader.prototype._extensionsLoadMeshPrimitiveAsync = function (context, name, node, mesh, primitive, assign) {
        return this._applyExtensions(primitive, "loadMeshPrimitive", function (extension) { return extension._loadMeshPrimitiveAsync && extension._loadMeshPrimitiveAsync(context, name, node, mesh, primitive, assign); });
    };
    GLTFLoader.prototype._extensionsLoadMaterialAsync = function (context, material, babylonMesh, babylonDrawMode, assign) {
        return this._applyExtensions(material, "loadMaterial", function (extension) { return extension._loadMaterialAsync && extension._loadMaterialAsync(context, material, babylonMesh, babylonDrawMode, assign); });
    };
    GLTFLoader.prototype._extensionsCreateMaterial = function (context, material, babylonDrawMode) {
        return this._applyExtensions(material, "createMaterial", function (extension) { return extension.createMaterial && extension.createMaterial(context, material, babylonDrawMode); });
    };
    GLTFLoader.prototype._extensionsLoadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        return this._applyExtensions(material, "loadMaterialProperties", function (extension) { return extension.loadMaterialPropertiesAsync && extension.loadMaterialPropertiesAsync(context, material, babylonMaterial); });
    };
    GLTFLoader.prototype._extensionsLoadTextureInfoAsync = function (context, textureInfo, assign) {
        return this._applyExtensions(textureInfo, "loadTextureInfo", function (extension) { return extension.loadTextureInfoAsync && extension.loadTextureInfoAsync(context, textureInfo, assign); });
    };
    GLTFLoader.prototype._extensionsLoadTextureAsync = function (context, texture, assign) {
        return this._applyExtensions(texture, "loadTexture", function (extension) { return extension._loadTextureAsync && extension._loadTextureAsync(context, texture, assign); });
    };
    GLTFLoader.prototype._extensionsLoadAnimationAsync = function (context, animation) {
        return this._applyExtensions(animation, "loadAnimation", function (extension) { return extension.loadAnimationAsync && extension.loadAnimationAsync(context, animation); });
    };
    GLTFLoader.prototype._extensionsLoadSkinAsync = function (context, node, skin) {
        return this._applyExtensions(skin, "loadSkin", function (extension) { return extension._loadSkinAsync && extension._loadSkinAsync(context, node, skin); });
    };
    GLTFLoader.prototype._extensionsLoadUriAsync = function (context, property, uri) {
        return this._applyExtensions(property, "loadUri", function (extension) { return extension._loadUriAsync && extension._loadUriAsync(context, property, uri); });
    };
    GLTFLoader.prototype._extensionsLoadBufferViewAsync = function (context, bufferView) {
        return this._applyExtensions(bufferView, "loadBufferView", function (extension) { return extension.loadBufferViewAsync && extension.loadBufferViewAsync(context, bufferView); });
    };
    GLTFLoader.prototype._extensionsLoadBufferAsync = function (context, buffer, byteOffset, byteLength) {
        return this._applyExtensions(buffer, "loadBuffer", function (extension) { return extension.loadBufferAsync && extension.loadBufferAsync(context, buffer, byteOffset, byteLength); });
    };
    /**
     * Helper method called by a loader extension to load an glTF extension.
     * @param context The context when loading the asset
     * @param property The glTF property to load the extension from
     * @param extensionName The name of the extension to load
     * @param actionAsync The action to run
     * @returns The promise returned by actionAsync or null if the extension does not exist
     */
    GLTFLoader.LoadExtensionAsync = function (context, property, extensionName, actionAsync) {
        if (!property.extensions) {
            return null;
        }
        var extensions = property.extensions;
        var extension = extensions[extensionName];
        if (!extension) {
            return null;
        }
        return actionAsync(context + "/extensions/" + extensionName, extension);
    };
    /**
     * Helper method called by a loader extension to load a glTF extra.
     * @param context The context when loading the asset
     * @param property The glTF property to load the extra from
     * @param extensionName The name of the extension to load
     * @param actionAsync The action to run
     * @returns The promise returned by actionAsync or null if the extra does not exist
     */
    GLTFLoader.LoadExtraAsync = function (context, property, extensionName, actionAsync) {
        if (!property.extras) {
            return null;
        }
        var extras = property.extras;
        var extra = extras[extensionName];
        if (!extra) {
            return null;
        }
        return actionAsync(context + "/extras/" + extensionName, extra);
    };
    /**
     * Checks for presence of an extension.
     * @param name The name of the extension to check
     * @returns A boolean indicating the presence of the given extension name in `extensionsUsed`
     */
    GLTFLoader.prototype.isExtensionUsed = function (name) {
        return !!this._gltf.extensionsUsed && this._gltf.extensionsUsed.indexOf(name) !== -1;
    };
    /**
     * Increments the indentation level and logs a message.
     * @param message The message to log
     */
    GLTFLoader.prototype.logOpen = function (message) {
        this._parent._logOpen(message);
    };
    /**
     * Decrements the indentation level.
     */
    GLTFLoader.prototype.logClose = function () {
        this._parent._logClose();
    };
    /**
     * Logs a message
     * @param message The message to log
     */
    GLTFLoader.prototype.log = function (message) {
        this._parent._log(message);
    };
    /**
     * Starts a performance counter.
     * @param counterName The name of the performance counter
     */
    GLTFLoader.prototype.startPerformanceCounter = function (counterName) {
        this._parent._startPerformanceCounter(counterName);
    };
    /**
     * Ends a performance counter.
     * @param counterName The name of the performance counter
     */
    GLTFLoader.prototype.endPerformanceCounter = function (counterName) {
        this._parent._endPerformanceCounter(counterName);
    };
    GLTFLoader._RegisteredExtensions = {};
    /**
     * The default glTF sampler.
     */
    GLTFLoader.DefaultSampler = { index: -1 };
    return GLTFLoader;
}());
GLTFFileLoader._CreateGLTF2Loader = function (parent) { return new GLTFLoader$1(parent); };

var NAME = "EXT_lights_image_based";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_lights_image_based/README.md)
 */
var EXT_lights_image_based = /** @class */ (function () {
    /** @hidden */
    function EXT_lights_image_based(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME);
    }
    /** @hidden */
    EXT_lights_image_based.prototype.dispose = function () {
        this._loader = null;
        delete this._lights;
    };
    /** @hidden */
    EXT_lights_image_based.prototype.onLoading = function () {
        var extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            var extension = extensions[this.name];
            this._lights = extension.lights;
        }
    };
    /** @hidden */
    EXT_lights_image_based.prototype.loadSceneAsync = function (context, scene) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, scene, this.name, function (extensionContext, extension) {
            var promises = new Array();
            promises.push(_this._loader.loadSceneAsync(context, scene));
            _this._loader.logOpen("" + extensionContext);
            var light = ArrayItem.Get(extensionContext + "/light", _this._lights, extension.light);
            promises.push(_this._loadLightAsync("/extensions/" + _this.name + "/lights/" + extension.light, light).then(function (texture) {
                _this._loader.babylonScene.environmentTexture = texture;
            }));
            _this._loader.logClose();
            return Promise.all(promises).then(function () { });
        });
    };
    EXT_lights_image_based.prototype._loadLightAsync = function (context, light) {
        var _this = this;
        if (!light._loaded) {
            var promises = new Array();
            this._loader.logOpen("" + context);
            var imageData_1 = new Array(light.specularImages.length);
            var _loop_1 = function (mipmap) {
                var faces = light.specularImages[mipmap];
                imageData_1[mipmap] = new Array(faces.length);
                var _loop_2 = function (face) {
                    var specularImageContext = context + "/specularImages/" + mipmap + "/" + face;
                    this_1._loader.logOpen("" + specularImageContext);
                    var index = faces[face];
                    var image = ArrayItem.Get(specularImageContext, this_1._loader.gltf.images, index);
                    promises.push(this_1._loader.loadImageAsync("/images/" + index, image).then(function (data) {
                        imageData_1[mipmap][face] = data;
                    }));
                    this_1._loader.logClose();
                };
                for (var face = 0; face < faces.length; face++) {
                    _loop_2(face);
                }
            };
            var this_1 = this;
            for (var mipmap = 0; mipmap < light.specularImages.length; mipmap++) {
                _loop_1(mipmap);
            }
            this._loader.logClose();
            light._loaded = Promise.all(promises).then(function () {
                var babylonTexture = new RawCubeTexture(_this._loader.babylonScene, null, light.specularImageSize);
                babylonTexture.name = light.name || "environment";
                light._babylonTexture = babylonTexture;
                if (light.intensity != undefined) {
                    babylonTexture.level = light.intensity;
                }
                if (light.rotation) {
                    var rotation = Quaternion.FromArray(light.rotation);
                    // Invert the rotation so that positive rotation is counter-clockwise.
                    if (!_this._loader.babylonScene.useRightHandedSystem) {
                        rotation = Quaternion.Inverse(rotation);
                    }
                    Matrix.FromQuaternionToRef(rotation, babylonTexture.getReflectionTextureMatrix());
                }
                var sphericalHarmonics = SphericalHarmonics.FromArray(light.irradianceCoefficients);
                sphericalHarmonics.scaleInPlace(light.intensity);
                sphericalHarmonics.convertIrradianceToLambertianRadiance();
                var sphericalPolynomial = SphericalPolynomial.FromHarmonics(sphericalHarmonics);
                // Compute the lod generation scale to fit exactly to the number of levels available.
                var lodGenerationScale = (imageData_1.length - 1) / Scalar.Log2(light.specularImageSize);
                return babylonTexture.updateRGBDAsync(imageData_1, sphericalPolynomial, lodGenerationScale);
            });
        }
        return light._loaded.then(function () {
            return light._babylonTexture;
        });
    };
    return EXT_lights_image_based;
}());
GLTFLoader$1.RegisterExtension(NAME, function (loader) { return new EXT_lights_image_based(loader); });

var NAME$1 = "EXT_mesh_gpu_instancing";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1691)
 * [Playground Sample](https://playground.babylonjs.com/#QFIGLW#9)
 * !!! Experimental Extension Subject to Changes !!!
 */
var EXT_mesh_gpu_instancing = /** @class */ (function () {
    /** @hidden */
    function EXT_mesh_gpu_instancing(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$1;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$1);
    }
    /** @hidden */
    EXT_mesh_gpu_instancing.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    EXT_mesh_gpu_instancing.prototype.loadNodeAsync = function (context, node, assign) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, node, this.name, function (extensionContext, extension) {
            _this._loader._disableInstancedMesh++;
            var promise = _this._loader.loadNodeAsync("/nodes/" + node.index, node, assign);
            _this._loader._disableInstancedMesh--;
            if (!node._primitiveBabylonMeshes) {
                return promise;
            }
            var promises = new Array();
            var instanceCount = 0;
            var loadAttribute = function (attribute) {
                if (extension.attributes[attribute] == undefined) {
                    promises.push(Promise.resolve(null));
                    return;
                }
                var accessor = ArrayItem.Get(extensionContext + "/attributes/" + attribute, _this._loader.gltf.accessors, extension.attributes[attribute]);
                promises.push(_this._loader._loadFloatAccessorAsync("/accessors/" + accessor.bufferView, accessor));
                if (instanceCount === 0) {
                    instanceCount = accessor.count;
                }
                else if (instanceCount !== accessor.count) {
                    throw new Error(extensionContext + "/attributes: Instance buffer accessors do not have the same count.");
                }
            };
            loadAttribute("TRANSLATION");
            loadAttribute("ROTATION");
            loadAttribute("SCALE");
            return promise.then(function (babylonTransformNode) {
                return Promise.all(promises).then(function (_a) {
                    var translationBuffer = _a[0], rotationBuffer = _a[1], scaleBuffer = _a[2];
                    var matrices = new Float32Array(instanceCount * 16);
                    TmpVectors.Vector3[0].copyFromFloats(0, 0, 0); // translation
                    TmpVectors.Quaternion[0].copyFromFloats(0, 0, 0, 1); // rotation
                    TmpVectors.Vector3[1].copyFromFloats(1, 1, 1); // scale
                    for (var i = 0; i < instanceCount; ++i) {
                        translationBuffer && Vector3.FromArrayToRef(translationBuffer, i * 3, TmpVectors.Vector3[0]);
                        rotationBuffer && Quaternion.FromArrayToRef(rotationBuffer, i * 4, TmpVectors.Quaternion[0]);
                        scaleBuffer && Vector3.FromArrayToRef(scaleBuffer, i * 3, TmpVectors.Vector3[1]);
                        Matrix.ComposeToRef(TmpVectors.Vector3[1], TmpVectors.Quaternion[0], TmpVectors.Vector3[0], TmpVectors.Matrix[0]);
                        TmpVectors.Matrix[0].copyToArray(matrices, i * 16);
                    }
                    for (var _i = 0, _b = node._primitiveBabylonMeshes; _i < _b.length; _i++) {
                        var babylonMesh = _b[_i];
                        babylonMesh.thinInstanceSetBuffer("matrix", matrices, 16, true);
                    }
                    return babylonTransformNode;
                });
            });
        });
    };
    return EXT_mesh_gpu_instancing;
}());
GLTFLoader$1.RegisterExtension(NAME$1, function (loader) { return new EXT_mesh_gpu_instancing(loader); });

var NAME$2 = "EXT_texture_webp";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_texture_webp/)
 */
var EXT_texture_webp = /** @class */ (function () {
    /** @hidden */
    function EXT_texture_webp(loader) {
        /** The name of this extension. */
        this.name = NAME$2;
        this._loader = loader;
        this.enabled = loader.isExtensionUsed(NAME$2);
    }
    /** @hidden */
    EXT_texture_webp.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    EXT_texture_webp.prototype._loadTextureAsync = function (context, texture, assign) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, texture, this.name, function (extensionContext, extension) {
            var sampler = (texture.sampler == undefined ? GLTFLoader$1.DefaultSampler : ArrayItem.Get(context + "/sampler", _this._loader.gltf.samplers, texture.sampler));
            var image = ArrayItem.Get(extensionContext + "/source", _this._loader.gltf.images, extension.source);
            return _this._loader._createTextureAsync(context, sampler, image, function (babylonTexture) {
                assign(babylonTexture);
            });
        });
    };
    return EXT_texture_webp;
}());
GLTFLoader$1.RegisterExtension(NAME$2, function (loader) { return new EXT_texture_webp(loader); });

var NAME$3 = "KHR_draco_mesh_compression";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression)
 */
var KHR_draco_mesh_compression = /** @class */ (function () {
    /** @hidden */
    function KHR_draco_mesh_compression(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$3;
        this._loader = loader;
        this.enabled = DracoCompression.DecoderAvailable && this._loader.isExtensionUsed(NAME$3);
    }
    /** @hidden */
    KHR_draco_mesh_compression.prototype.dispose = function () {
        delete this.dracoCompression;
        this._loader = null;
    };
    /** @hidden */
    KHR_draco_mesh_compression.prototype._loadVertexDataAsync = function (context, primitive, babylonMesh) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, primitive, this.name, function (extensionContext, extension) {
            if (primitive.mode != undefined) {
                if (primitive.mode !== 5 /* TRIANGLE_STRIP */ &&
                    primitive.mode !== 4 /* TRIANGLES */) {
                    throw new Error(context + ": Unsupported mode " + primitive.mode);
                }
                // TODO: handle triangle strips
                if (primitive.mode === 5 /* TRIANGLE_STRIP */) {
                    throw new Error(context + ": Mode " + primitive.mode + " is not currently supported");
                }
            }
            var attributes = {};
            var loadAttribute = function (name, kind) {
                var uniqueId = extension.attributes[name];
                if (uniqueId == undefined) {
                    return;
                }
                babylonMesh._delayInfo = babylonMesh._delayInfo || [];
                if (babylonMesh._delayInfo.indexOf(kind) === -1) {
                    babylonMesh._delayInfo.push(kind);
                }
                attributes[kind] = uniqueId;
            };
            loadAttribute("POSITION", VertexBuffer.PositionKind);
            loadAttribute("NORMAL", VertexBuffer.NormalKind);
            loadAttribute("TANGENT", VertexBuffer.TangentKind);
            loadAttribute("TEXCOORD_0", VertexBuffer.UVKind);
            loadAttribute("TEXCOORD_1", VertexBuffer.UV2Kind);
            loadAttribute("JOINTS_0", VertexBuffer.MatricesIndicesKind);
            loadAttribute("WEIGHTS_0", VertexBuffer.MatricesWeightsKind);
            loadAttribute("COLOR_0", VertexBuffer.ColorKind);
            var bufferView = ArrayItem.Get(extensionContext, _this._loader.gltf.bufferViews, extension.bufferView);
            if (!bufferView._dracoBabylonGeometry) {
                bufferView._dracoBabylonGeometry = _this._loader.loadBufferViewAsync("/bufferViews/" + bufferView.index, bufferView).then(function (data) {
                    var dracoCompression = _this.dracoCompression || DracoCompression.Default;
                    return dracoCompression.decodeMeshAsync(data, attributes).then(function (babylonVertexData) {
                        var babylonGeometry = new Geometry(babylonMesh.name, _this._loader.babylonScene);
                        babylonVertexData.applyToGeometry(babylonGeometry);
                        return babylonGeometry;
                    }).catch(function (error) {
                        throw new Error(context + ": " + error.message);
                    });
                });
            }
            return bufferView._dracoBabylonGeometry;
        });
    };
    return KHR_draco_mesh_compression;
}());
GLTFLoader$1.RegisterExtension(NAME$3, function (loader) { return new KHR_draco_mesh_compression(loader); });

var NAME$4 = "KHR_lights_punctual";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual)
 */
var KHR_lights = /** @class */ (function () {
    /** @hidden */
    function KHR_lights(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$4;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$4);
    }
    /** @hidden */
    KHR_lights.prototype.dispose = function () {
        this._loader = null;
        delete this._lights;
    };
    /** @hidden */
    KHR_lights.prototype.onLoading = function () {
        var extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            var extension = extensions[this.name];
            this._lights = extension.lights;
        }
    };
    /** @hidden */
    KHR_lights.prototype.loadNodeAsync = function (context, node, assign) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, node, this.name, function (extensionContext, extension) {
            return _this._loader.loadNodeAsync(context, node, function (babylonMesh) {
                var babylonLight;
                var light = ArrayItem.Get(extensionContext, _this._lights, extension.light);
                var name = light.name || babylonMesh.name;
                _this._loader.babylonScene._blockEntityCollection = _this._loader._forAssetContainer;
                switch (light.type) {
                    case "directional" /* DIRECTIONAL */: {
                        babylonLight = new DirectionalLight(name, Vector3.Backward(), _this._loader.babylonScene);
                        break;
                    }
                    case "point" /* POINT */: {
                        babylonLight = new PointLight(name, Vector3.Zero(), _this._loader.babylonScene);
                        break;
                    }
                    case "spot" /* SPOT */: {
                        var babylonSpotLight = new SpotLight(name, Vector3.Zero(), Vector3.Backward(), 0, 1, _this._loader.babylonScene);
                        babylonSpotLight.angle = ((light.spot && light.spot.outerConeAngle) || Math.PI / 4) * 2;
                        babylonSpotLight.innerAngle = ((light.spot && light.spot.innerConeAngle) || 0) * 2;
                        babylonLight = babylonSpotLight;
                        break;
                    }
                    default: {
                        _this._loader.babylonScene._blockEntityCollection = false;
                        throw new Error(extensionContext + ": Invalid light type (" + light.type + ")");
                    }
                }
                _this._loader.babylonScene._blockEntityCollection = false;
                babylonLight.falloffType = Light.FALLOFF_GLTF;
                babylonLight.diffuse = light.color ? Color3.FromArray(light.color) : Color3.White();
                babylonLight.intensity = light.intensity == undefined ? 1 : light.intensity;
                babylonLight.range = light.range == undefined ? Number.MAX_VALUE : light.range;
                babylonLight.parent = babylonMesh;
                _this._loader._babylonLights.push(babylonLight);
                GLTFLoader$1.AddPointerMetadata(babylonLight, extensionContext);
                assign(babylonMesh);
            });
        });
    };
    return KHR_lights;
}());
GLTFLoader$1.RegisterExtension(NAME$4, function (loader) { return new KHR_lights(loader); });

var NAME$5 = "KHR_materials_pbrSpecularGlossiness";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness)
 */
var KHR_materials_pbrSpecularGlossiness = /** @class */ (function () {
    /** @hidden */
    function KHR_materials_pbrSpecularGlossiness(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$5;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 200;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$5);
    }
    /** @hidden */
    KHR_materials_pbrSpecularGlossiness.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    KHR_materials_pbrSpecularGlossiness.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, material, this.name, function (extensionContext, extension) {
            var promises = new Array();
            promises.push(_this._loader.loadMaterialBasePropertiesAsync(context, material, babylonMaterial));
            promises.push(_this._loadSpecularGlossinessPropertiesAsync(extensionContext, material, extension, babylonMaterial));
            _this._loader.loadMaterialAlphaProperties(context, material, babylonMaterial);
            return Promise.all(promises).then(function () { });
        });
    };
    KHR_materials_pbrSpecularGlossiness.prototype._loadSpecularGlossinessPropertiesAsync = function (context, material, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        var promises = new Array();
        babylonMaterial.metallic = null;
        babylonMaterial.roughness = null;
        if (properties.diffuseFactor) {
            babylonMaterial.albedoColor = Color3.FromArray(properties.diffuseFactor);
            babylonMaterial.alpha = properties.diffuseFactor[3];
        }
        else {
            babylonMaterial.albedoColor = Color3.White();
        }
        babylonMaterial.reflectivityColor = properties.specularFactor ? Color3.FromArray(properties.specularFactor) : Color3.White();
        babylonMaterial.microSurface = properties.glossinessFactor == undefined ? 1 : properties.glossinessFactor;
        if (properties.diffuseTexture) {
            promises.push(this._loader.loadTextureInfoAsync(context + "/diffuseTexture", properties.diffuseTexture, function (texture) {
                texture.name = babylonMaterial.name + " (Diffuse)";
                babylonMaterial.albedoTexture = texture;
            }));
        }
        if (properties.specularGlossinessTexture) {
            properties.specularGlossinessTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(context + "/specularGlossinessTexture", properties.specularGlossinessTexture, function (texture) {
                texture.name = babylonMaterial.name + " (Specular Glossiness)";
                babylonMaterial.reflectivityTexture = texture;
            }));
            babylonMaterial.reflectivityTexture.hasAlpha = true;
            babylonMaterial.useMicroSurfaceFromReflectivityMapAlpha = true;
        }
        return Promise.all(promises).then(function () { });
    };
    return KHR_materials_pbrSpecularGlossiness;
}());
GLTFLoader$1.RegisterExtension(NAME$5, function (loader) { return new KHR_materials_pbrSpecularGlossiness(loader); });

var NAME$6 = "KHR_materials_unlit";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit)
 */
var KHR_materials_unlit = /** @class */ (function () {
    /** @hidden */
    function KHR_materials_unlit(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$6;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 210;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$6);
    }
    /** @hidden */
    KHR_materials_unlit.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    KHR_materials_unlit.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, material, this.name, function () {
            return _this._loadUnlitPropertiesAsync(context, material, babylonMaterial);
        });
    };
    KHR_materials_unlit.prototype._loadUnlitPropertiesAsync = function (context, material, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        var promises = new Array();
        babylonMaterial.unlit = true;
        var properties = material.pbrMetallicRoughness;
        if (properties) {
            if (properties.baseColorFactor) {
                babylonMaterial.albedoColor = Color3.FromArray(properties.baseColorFactor);
                babylonMaterial.alpha = properties.baseColorFactor[3];
            }
            else {
                babylonMaterial.albedoColor = Color3.White();
            }
            if (properties.baseColorTexture) {
                promises.push(this._loader.loadTextureInfoAsync(context + "/baseColorTexture", properties.baseColorTexture, function (texture) {
                    texture.name = babylonMaterial.name + " (Base Color)";
                    babylonMaterial.albedoTexture = texture;
                }));
            }
        }
        if (material.doubleSided) {
            babylonMaterial.backFaceCulling = false;
            babylonMaterial.twoSidedLighting = true;
        }
        this._loader.loadMaterialAlphaProperties(context, material, babylonMaterial);
        return Promise.all(promises).then(function () { });
    };
    return KHR_materials_unlit;
}());
GLTFLoader$1.RegisterExtension(NAME$6, function (loader) { return new KHR_materials_unlit(loader); });

var NAME$7 = "KHR_materials_clearcoat";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_clearcoat/README.md)
 * [Playground Sample](https://www.babylonjs-playground.com/frame.html#7F7PN6#8)
 */
var KHR_materials_clearcoat = /** @class */ (function () {
    /** @hidden */
    function KHR_materials_clearcoat(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$7;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 190;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$7);
    }
    /** @hidden */
    KHR_materials_clearcoat.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    KHR_materials_clearcoat.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, material, this.name, function (extensionContext, extension) {
            var promises = new Array();
            promises.push(_this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(_this._loadClearCoatPropertiesAsync(extensionContext, extension, babylonMaterial));
            return Promise.all(promises).then(function () { });
        });
    };
    KHR_materials_clearcoat.prototype._loadClearCoatPropertiesAsync = function (context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        var promises = new Array();
        babylonMaterial.clearCoat.isEnabled = true;
        babylonMaterial.clearCoat.useRoughnessFromMainTexture = false;
        babylonMaterial.clearCoat.remapF0OnInterfaceChange = false;
        if (properties.clearcoatFactor != undefined) {
            babylonMaterial.clearCoat.intensity = properties.clearcoatFactor;
        }
        else {
            babylonMaterial.clearCoat.intensity = 0;
        }
        if (properties.clearcoatTexture) {
            promises.push(this._loader.loadTextureInfoAsync(context + "/clearcoatTexture", properties.clearcoatTexture, function (texture) {
                texture.name = babylonMaterial.name + " (ClearCoat Intensity)";
                babylonMaterial.clearCoat.texture = texture;
            }));
        }
        if (properties.clearcoatRoughnessFactor != undefined) {
            babylonMaterial.clearCoat.roughness = properties.clearcoatRoughnessFactor;
        }
        else {
            babylonMaterial.clearCoat.roughness = 0;
        }
        if (properties.clearcoatRoughnessTexture) {
            properties.clearcoatRoughnessTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(context + "/clearcoatRoughnessTexture", properties.clearcoatRoughnessTexture, function (texture) {
                texture.name = babylonMaterial.name + " (ClearCoat Roughness)";
                babylonMaterial.clearCoat.textureRoughness = texture;
            }));
        }
        if (properties.clearcoatNormalTexture) {
            properties.clearcoatNormalTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(context + "/clearcoatNormalTexture", properties.clearcoatNormalTexture, function (texture) {
                texture.name = babylonMaterial.name + " (ClearCoat Normal)";
                babylonMaterial.clearCoat.bumpTexture = texture;
            }));
            babylonMaterial.invertNormalMapX = !babylonMaterial.getScene().useRightHandedSystem;
            babylonMaterial.invertNormalMapY = babylonMaterial.getScene().useRightHandedSystem;
            if (properties.clearcoatNormalTexture.scale != undefined) {
                babylonMaterial.clearCoat.bumpTexture.level = properties.clearcoatNormalTexture.scale;
            }
        }
        return Promise.all(promises).then(function () { });
    };
    return KHR_materials_clearcoat;
}());
GLTFLoader$1.RegisterExtension(NAME$7, function (loader) { return new KHR_materials_clearcoat(loader); });

var NAME$8 = "KHR_materials_sheen";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1688)
 * [Playground Sample](https://www.babylonjs-playground.com/frame.html#BNIZX6#4)
 * !!! Experimental Extension Subject to Changes !!!
 */
var KHR_materials_sheen = /** @class */ (function () {
    /** @hidden */
    function KHR_materials_sheen(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$8;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 190;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$8);
    }
    /** @hidden */
    KHR_materials_sheen.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    KHR_materials_sheen.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, material, this.name, function (extensionContext, extension) {
            var promises = new Array();
            promises.push(_this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(_this._loadSheenPropertiesAsync(extensionContext, extension, babylonMaterial));
            return Promise.all(promises).then(function () { });
        });
    };
    KHR_materials_sheen.prototype._loadSheenPropertiesAsync = function (context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        var promises = new Array();
        babylonMaterial.sheen.isEnabled = true;
        babylonMaterial.sheen.intensity = 1;
        if (properties.sheenColorFactor != undefined) {
            babylonMaterial.sheen.color = Color3.FromArray(properties.sheenColorFactor);
        }
        else {
            babylonMaterial.sheen.color = Color3.Black();
        }
        if (properties.sheenColorTexture) {
            promises.push(this._loader.loadTextureInfoAsync(context + "/sheenColorTexture", properties.sheenColorTexture, function (texture) {
                texture.name = babylonMaterial.name + " (Sheen Color)";
                babylonMaterial.sheen.texture = texture;
            }));
        }
        if (properties.sheenRoughnessFactor !== undefined) {
            babylonMaterial.sheen.roughness = properties.sheenRoughnessFactor;
        }
        else {
            babylonMaterial.sheen.roughness = 0;
        }
        if (properties.sheenRoughnessTexture) {
            properties.sheenRoughnessTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(context + "/sheenRoughnessTexture", properties.sheenRoughnessTexture, function (texture) {
                texture.name = babylonMaterial.name + " (Sheen Roughness)";
                babylonMaterial.sheen.textureRoughness = texture;
            }));
        }
        babylonMaterial.sheen.albedoScaling = true;
        babylonMaterial.sheen.useRoughnessFromMainTexture = false;
        return Promise.all(promises).then(function () { });
    };
    return KHR_materials_sheen;
}());
GLTFLoader$1.RegisterExtension(NAME$8, function (loader) { return new KHR_materials_sheen(loader); });

var NAME$9 = "KHR_materials_specular";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1719)
 * !!! Experimental Extension Subject to Changes !!!
 */
var KHR_materials_specular = /** @class */ (function () {
    /** @hidden */
    function KHR_materials_specular(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$9;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 190;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$9);
    }
    /** @hidden */
    KHR_materials_specular.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    KHR_materials_specular.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, material, this.name, function (extensionContext, extension) {
            var promises = new Array();
            promises.push(_this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(_this._loadSpecularPropertiesAsync(extensionContext, extension, babylonMaterial));
            return Promise.all(promises).then(function () { });
        });
    };
    KHR_materials_specular.prototype._loadSpecularPropertiesAsync = function (context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        var promises = new Array();
        if (properties.specularFactor !== undefined) {
            babylonMaterial.metallicF0Factor = properties.specularFactor;
        }
        if (properties.specularColorFactor !== undefined) {
            babylonMaterial.metallicReflectanceColor = Color3.FromArray(properties.specularColorFactor);
        }
        if (properties.specularTexture) {
            properties.specularTexture.nonColorData = true;
            promises.push(this._loader.loadTextureInfoAsync(context + "/specularTexture", properties.specularTexture, function (texture) {
                texture.name = babylonMaterial.name + " (Specular F0 Color)";
                babylonMaterial.metallicReflectanceTexture = texture;
            }));
        }
        return Promise.all(promises).then(function () { });
    };
    return KHR_materials_specular;
}());
GLTFLoader$1.RegisterExtension(NAME$9, function (loader) { return new KHR_materials_specular(loader); });

var NAME$a = "KHR_materials_ior";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1718)
 * !!! Experimental Extension Subject to Changes !!!
 */
var KHR_materials_ior = /** @class */ (function () {
    /** @hidden */
    function KHR_materials_ior(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$a;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 180;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$a);
    }
    /** @hidden */
    KHR_materials_ior.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    KHR_materials_ior.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, material, this.name, function (extensionContext, extension) {
            var promises = new Array();
            promises.push(_this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(_this._loadIorPropertiesAsync(extensionContext, extension, babylonMaterial));
            return Promise.all(promises).then(function () { });
        });
    };
    KHR_materials_ior.prototype._loadIorPropertiesAsync = function (context, properties, babylonMaterial) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        if (properties.ior !== undefined) {
            babylonMaterial.indexOfRefraction = properties.ior;
        }
        else {
            babylonMaterial.indexOfRefraction = KHR_materials_ior._DEFAULT_IOR;
        }
        return Promise.resolve();
    };
    /**
     * Default ior Value from the spec.
     */
    KHR_materials_ior._DEFAULT_IOR = 1.5;
    return KHR_materials_ior;
}());
GLTFLoader$1.RegisterExtension(NAME$a, function (loader) { return new KHR_materials_ior(loader); });

var NAME$b = "KHR_materials_variants";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1681)
 * !!! Experimental Extension Subject to Changes !!!
 */
var KHR_materials_variants = /** @class */ (function () {
    /** @hidden */
    function KHR_materials_variants(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$b;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$b);
    }
    /** @hidden */
    KHR_materials_variants.prototype.dispose = function () {
        this._loader = null;
    };
    /**
     * Gets the list of available variant names for this asset.
     * @param rootMesh The glTF root mesh
     * @returns the list of all the variant names for this model
     */
    KHR_materials_variants.GetAvailableVariants = function (rootMesh) {
        var extensionMetadata = this._GetExtensionMetadata(rootMesh);
        if (!extensionMetadata) {
            return [];
        }
        return Object.keys(extensionMetadata.variants);
    };
    /**
     * Gets the list of available variant names for this asset.
     * @param rootMesh The glTF root mesh
     * @returns the list of all the variant names for this model
     */
    KHR_materials_variants.prototype.getAvailableVariants = function (rootMesh) {
        return KHR_materials_variants.GetAvailableVariants(rootMesh);
    };
    /**
     * Select a variant given a variant name or a list of variant names.
     * @param rootMesh The glTF root mesh
     * @param variantName The variant name(s) to select.
     */
    KHR_materials_variants.SelectVariant = function (rootMesh, variantName) {
        var extensionMetadata = this._GetExtensionMetadata(rootMesh);
        if (!extensionMetadata) {
            throw new Error("Cannot select variant on a glTF mesh that does not have the " + NAME$b + " extension");
        }
        var select = function (variantName) {
            var entries = extensionMetadata.variants[variantName];
            if (entries) {
                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    var entry = entries_1[_i];
                    entry.mesh.material = entry.material;
                }
            }
        };
        if (variantName instanceof Array) {
            for (var _i = 0, variantName_1 = variantName; _i < variantName_1.length; _i++) {
                var name_1 = variantName_1[_i];
                select(name_1);
            }
        }
        else {
            select(variantName);
        }
        extensionMetadata.lastSelected = variantName;
    };
    /**
     * Select a variant given a variant name or a list of variant names.
     * @param rootMesh The glTF root mesh
     * @param variantName The variant name(s) to select.
     */
    KHR_materials_variants.prototype.selectVariant = function (rootMesh, variantName) {
        return KHR_materials_variants.SelectVariant(rootMesh, variantName);
    };
    /**
     * Reset back to the original before selecting a variant.
     * @param rootMesh The glTF root mesh
     */
    KHR_materials_variants.Reset = function (rootMesh) {
        var extensionMetadata = this._GetExtensionMetadata(rootMesh);
        if (!extensionMetadata) {
            throw new Error("Cannot reset on a glTF mesh that does not have the " + NAME$b + " extension");
        }
        for (var _i = 0, _a = extensionMetadata.original; _i < _a.length; _i++) {
            var entry = _a[_i];
            entry.mesh.material = entry.material;
        }
        extensionMetadata.lastSelected = null;
    };
    /**
     * Reset back to the original before selecting a variant.
     * @param rootMesh The glTF root mesh
     */
    KHR_materials_variants.prototype.reset = function (rootMesh) {
        return KHR_materials_variants.Reset(rootMesh);
    };
    /**
     * Gets the last selected variant name(s) or null if original.
     * @param rootMesh The glTF root mesh
     * @returns The selected variant name(s).
     */
    KHR_materials_variants.GetLastSelectedVariant = function (rootMesh) {
        var extensionMetadata = this._GetExtensionMetadata(rootMesh);
        if (!extensionMetadata) {
            throw new Error("Cannot get the last selected variant on a glTF mesh that does not have the " + NAME$b + " extension");
        }
        return extensionMetadata.lastSelected;
    };
    /**
     * Gets the last selected variant name(s) or null if original.
     * @param rootMesh The glTF root mesh
     * @returns The selected variant name(s).
     */
    KHR_materials_variants.prototype.getLastSelectedVariant = function (rootMesh) {
        return KHR_materials_variants.GetLastSelectedVariant(rootMesh);
    };
    KHR_materials_variants._GetExtensionMetadata = function (rootMesh) {
        var _a, _b;
        return ((_b = (_a = rootMesh === null || rootMesh === void 0 ? void 0 : rootMesh.metadata) === null || _a === void 0 ? void 0 : _a.gltf) === null || _b === void 0 ? void 0 : _b[NAME$b]) || null;
    };
    /** @hidden */
    KHR_materials_variants.prototype.onLoading = function () {
        var extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            var extension = extensions[this.name];
            this._variants = extension.variants;
        }
    };
    /** @hidden */
    KHR_materials_variants.prototype._loadMeshPrimitiveAsync = function (context, name, node, mesh, primitive, assign) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, primitive, this.name, function (extensionContext, extension) {
            var promises = new Array();
            promises.push(_this._loader._loadMeshPrimitiveAsync(context, name, node, mesh, primitive, function (babylonMesh) {
                assign(babylonMesh);
                if (babylonMesh instanceof Mesh) {
                    var babylonDrawMode = GLTFLoader$1._GetDrawMode(context, primitive.mode);
                    var root = _this._loader.rootBabylonMesh;
                    var metadata = (root.metadata = root.metadata || {});
                    var gltf = (metadata.gltf = metadata.gltf || {});
                    var extensionMetadata = (gltf[NAME$b] = gltf[NAME$b] || { lastSelected: null, original: [], variants: {} });
                    // Store the original material.
                    extensionMetadata.original.push({ mesh: babylonMesh, material: babylonMesh.material });
                    // For each mapping, look at the variants and make a new entry for them.
                    var variants_1 = extensionMetadata.variants;
                    for (var _i = 0, _a = extension.mappings; _i < _a.length; _i++) {
                        var mapping = _a[_i];
                        var _loop_1 = function (variantIndex) {
                            var variant = ArrayItem.Get(extensionContext + "/mapping/" + variantIndex, _this._variants, variantIndex);
                            var material = ArrayItem.Get("#/materials/", _this._loader.gltf.materials, mapping.material);
                            promises.push(_this._loader._loadMaterialAsync("#/materials/" + mapping.material, material, babylonMesh, babylonDrawMode, function (babylonMaterial) {
                                variants_1[variant.name] = variants_1[variant.name] || [];
                                variants_1[variant.name].push({
                                    mesh: babylonMesh,
                                    material: babylonMaterial
                                });
                            }));
                        };
                        for (var _b = 0, _c = mapping.variants; _b < _c.length; _b++) {
                            var variantIndex = _c[_b];
                            _loop_1(variantIndex);
                        }
                    }
                }
            }));
            return Promise.all(promises).then(function (_a) {
                var babylonMesh = _a[0];
                return babylonMesh;
            });
        });
    };
    return KHR_materials_variants;
}());
GLTFLoader$1.RegisterExtension(NAME$b, function (loader) { return new KHR_materials_variants(loader); });

/**
 * A class to handle setting up the rendering of opaque objects to be shown through transmissive objects.
 */
var TransmissionHelper = /** @class */ (function () {
    /**
     * constructor
     * @param options Defines the options we want to customize the helper
     * @param scene The scene to add the material to
     */
    function TransmissionHelper(options, scene) {
        var _this = this;
        this._opaqueRenderTarget = null;
        this._opaqueMeshesCache = [];
        this._transparentMeshesCache = [];
        this._options = __assign(__assign({}, TransmissionHelper._getDefaultOptions()), options);
        this._scene = scene;
        this._scene._transmissionHelper = this;
        this.onErrorObservable = new Observable();
        this._scene.onDisposeObservable.addOnce(function (scene) {
            _this.dispose();
        });
        this._parseScene();
        this._setupRenderTargets();
    }
    /**
     * Creates the default options for the helper.
     */
    TransmissionHelper._getDefaultOptions = function () {
        return {
            renderSize: 512
        };
    };
    /**
     * Updates the background according to the new options
     * @param options
     */
    TransmissionHelper.prototype.updateOptions = function (options) {
        var _this = this;
        // First check if any options are actually being changed. If not, exit.
        var newValues = Object.keys(options).filter(function (key) { return _this._options[key] !== options[key]; });
        if (!newValues.length) {
            return;
        }
        var newOptions = __assign(__assign({}, this._options), options);
        var oldOptions = this._options;
        this._options = newOptions;
        // If size changes, recreate everything
        if (newOptions.renderSize !== oldOptions.renderSize) {
            this._setupRenderTargets();
        }
    };
    TransmissionHelper.prototype.getOpaqueTarget = function () {
        return this._opaqueRenderTarget;
    };
    TransmissionHelper.prototype.shouldRenderAsTransmission = function (material) {
        if (!material) {
            return false;
        }
        if (material instanceof PBRMaterial && (material.subSurface.isRefractionEnabled)) {
            return true;
        }
        return false;
    };
    TransmissionHelper.prototype._addMesh = function (mesh) {
        if (mesh instanceof Mesh) {
            mesh.onMaterialChangedObservable.add(this.onMeshMaterialChanged.bind(this));
            if (this.shouldRenderAsTransmission(mesh.material)) {
                this._transparentMeshesCache.push(mesh);
            }
            else {
                this._opaqueMeshesCache.push(mesh);
            }
        }
    };
    TransmissionHelper.prototype._removeMesh = function (mesh) {
        if (mesh instanceof Mesh) {
            mesh.onMaterialChangedObservable.remove(this.onMeshMaterialChanged.bind(this));
            var idx = this._transparentMeshesCache.indexOf(mesh);
            if (idx !== -1) {
                this._transparentMeshesCache.splice(idx, 1);
            }
            idx = this._opaqueMeshesCache.indexOf(mesh);
            if (idx !== -1) {
                this._opaqueMeshesCache.splice(idx, 1);
            }
        }
    };
    TransmissionHelper.prototype._parseScene = function () {
        this._scene.meshes.forEach(this._addMesh.bind(this));
        // Listen for when a mesh is added to the scene and add it to our cache lists.
        this._scene.onNewMeshAddedObservable.add(this._addMesh.bind(this));
        // Listen for when a mesh is removed from to the scene and remove it from our cache lists.
        this._scene.onMeshRemovedObservable.add(this._removeMesh.bind(this));
    };
    // When one of the meshes in the scene has its material changed, make sure that it's in the correct cache list.
    TransmissionHelper.prototype.onMeshMaterialChanged = function (mesh) {
        if (mesh instanceof Mesh) {
            var transparentIdx = this._transparentMeshesCache.indexOf(mesh);
            var opaqueIdx = this._opaqueMeshesCache.indexOf(mesh);
            // If the material is transparent, make sure that it's added to the transparent list and removed from the opaque list
            var useTransmission = this.shouldRenderAsTransmission(mesh.material);
            if (useTransmission) {
                if (mesh.material instanceof PBRMaterial) {
                    mesh.material.subSurface.refractionTexture = this._opaqueRenderTarget;
                }
                if (opaqueIdx !== -1) {
                    this._opaqueMeshesCache.splice(opaqueIdx, 1);
                    this._transparentMeshesCache.push(mesh);
                }
                else if (transparentIdx === -1) {
                    this._transparentMeshesCache.push(mesh);
                }
                // If the material is opaque, make sure that it's added to the opaque list and removed from the transparent list
            }
            else {
                if (transparentIdx !== -1) {
                    this._transparentMeshesCache.splice(transparentIdx, 1);
                    this._opaqueMeshesCache.push(mesh);
                }
                else if (opaqueIdx === -1) {
                    this._opaqueMeshesCache.push(mesh);
                }
            }
        }
    };
    /**
     * Setup the render targets according to the specified options.
     */
    TransmissionHelper.prototype._setupRenderTargets = function () {
        var _this = this;
        var opaqueRTIndex = -1;
        // Remove any layers rendering to the opaque scene.
        if (this._scene.layers && this._opaqueRenderTarget) {
            for (var _i = 0, _a = this._scene.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                var idx = layer.renderTargetTextures.indexOf(this._opaqueRenderTarget);
                if (idx >= 0) {
                    layer.renderTargetTextures.splice(idx, 1);
                }
            }
        }
        // Remove opaque render target
        if (this._opaqueRenderTarget) {
            opaqueRTIndex = this._scene.customRenderTargets.indexOf(this._opaqueRenderTarget);
            this._opaqueRenderTarget.dispose();
        }
        this._opaqueRenderTarget = new RenderTargetTexture("opaqueSceneTexture", this._options.renderSize, this._scene, true);
        this._opaqueRenderTarget.renderList = this._opaqueMeshesCache;
        // this._opaqueRenderTarget.clearColor = new Color4(0.0, 0.0, 0.0, 0.0);
        this._opaqueRenderTarget.gammaSpace = true;
        this._opaqueRenderTarget.lodGenerationScale = 1;
        this._opaqueRenderTarget.lodGenerationOffset = -4;
        if (opaqueRTIndex >= 0) {
            this._scene.customRenderTargets.splice(opaqueRTIndex, 0, this._opaqueRenderTarget);
        }
        else {
            opaqueRTIndex = this._scene.customRenderTargets.length;
            this._scene.customRenderTargets.push(this._opaqueRenderTarget);
        }
        // If there are other layers, they should be included in the render of the opaque background.
        if (this._scene.layers && this._opaqueRenderTarget) {
            for (var _b = 0, _c = this._scene.layers; _b < _c.length; _b++) {
                var layer = _c[_b];
                layer.renderTargetTextures.push(this._opaqueRenderTarget);
            }
        }
        this._transparentMeshesCache.forEach(function (mesh) {
            if (_this.shouldRenderAsTransmission(mesh.material) && mesh.material instanceof PBRMaterial) {
                mesh.material.refractionTexture = _this._opaqueRenderTarget;
            }
        });
    };
    /**
     * Dispose all the elements created by the Helper.
     */
    TransmissionHelper.prototype.dispose = function () {
        this._scene._transmissionHelper = undefined;
        if (this._opaqueRenderTarget) {
            this._opaqueRenderTarget.dispose();
            this._opaqueRenderTarget = null;
        }
        this._transparentMeshesCache = [];
        this._opaqueMeshesCache = [];
    };
    return TransmissionHelper;
}());
var NAME$c = "KHR_materials_transmission";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1698)
 * !!! Experimental Extension Subject to Changes !!!
 */
var KHR_materials_transmission = /** @class */ (function () {
    /** @hidden */
    function KHR_materials_transmission(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$c;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 175;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$c);
        if (this.enabled) {
            loader.parent.transparencyAsCoverage = true;
        }
    }
    /** @hidden */
    KHR_materials_transmission.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    KHR_materials_transmission.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, material, this.name, function (extensionContext, extension) {
            var promises = new Array();
            promises.push(_this._loader.loadMaterialBasePropertiesAsync(context, material, babylonMaterial));
            promises.push(_this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(_this._loadTransparentPropertiesAsync(extensionContext, material, babylonMaterial, extension));
            return Promise.all(promises).then(function () { });
        });
    };
    KHR_materials_transmission.prototype._loadTransparentPropertiesAsync = function (context, material, babylonMaterial, extension) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        var pbrMaterial = babylonMaterial;
        // Enables "refraction" texture which represents transmitted light.
        pbrMaterial.subSurface.isRefractionEnabled = true;
        // Since this extension models thin-surface transmission only, we must make IOR = 1.0
        pbrMaterial.subSurface.volumeIndexOfRefraction = 1.0;
        // Albedo colour will tint transmission.
        pbrMaterial.subSurface.useAlbedoToTintRefraction = true;
        if (extension.transmissionFactor !== undefined) {
            pbrMaterial.subSurface.refractionIntensity = extension.transmissionFactor;
            var scene = pbrMaterial.getScene();
            if (pbrMaterial.subSurface.refractionIntensity && !scene._transmissionHelper) {
                new TransmissionHelper({}, pbrMaterial.getScene());
            }
        }
        else {
            pbrMaterial.subSurface.refractionIntensity = 0.0;
            pbrMaterial.subSurface.isRefractionEnabled = false;
            return Promise.resolve();
        }
        if (extension.transmissionTexture) {
            extension.transmissionTexture.nonColorData = true;
            return this._loader.loadTextureInfoAsync(context + "/transmissionTexture", extension.transmissionTexture, undefined)
                .then(function (texture) {
                pbrMaterial.subSurface.thicknessTexture = texture;
                pbrMaterial.subSurface.useMaskFromThicknessTextureGltf = true;
            });
        }
        else {
            return Promise.resolve();
        }
    };
    return KHR_materials_transmission;
}());
GLTFLoader$1.RegisterExtension(NAME$c, function (loader) { return new KHR_materials_transmission(loader); });

var NAME$d = "KHR_materials_translucency";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1825)
 * !!! Experimental Extension Subject to Changes !!!
 */
var KHR_materials_translucency = /** @class */ (function () {
    /** @hidden */
    function KHR_materials_translucency(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$d;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 175;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$d);
        if (this.enabled) {
            loader.parent.transparencyAsCoverage = true;
        }
    }
    /** @hidden */
    KHR_materials_translucency.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    KHR_materials_translucency.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, material, this.name, function (extensionContext, extension) {
            var promises = new Array();
            promises.push(_this._loader.loadMaterialBasePropertiesAsync(context, material, babylonMaterial));
            promises.push(_this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial));
            promises.push(_this._loadTranslucentPropertiesAsync(extensionContext, material, babylonMaterial, extension));
            return Promise.all(promises).then(function () { });
        });
    };
    KHR_materials_translucency.prototype._loadTranslucentPropertiesAsync = function (context, material, babylonMaterial, extension) {
        if (!(babylonMaterial instanceof PBRMaterial)) {
            throw new Error(context + ": Material type not supported");
        }
        var pbrMaterial = babylonMaterial;
        // Enables "translucency" texture which represents diffusely-transmitted light.
        pbrMaterial.subSurface.isTranslucencyEnabled = true;
        // Since this extension models thin-surface transmission only, we must make the
        // internal IOR == 1.0 and set the thickness to 0.
        pbrMaterial.subSurface.volumeIndexOfRefraction = 1.0;
        pbrMaterial.subSurface.minimumThickness = 0.0;
        pbrMaterial.subSurface.maximumThickness = 0.0;
        // Albedo colour will tint transmission.
        pbrMaterial.subSurface.useAlbedoToTintRefraction = true;
        if (extension.translucencyFactor !== undefined) {
            pbrMaterial.subSurface.translucencyIntensity = extension.translucencyFactor;
        }
        else {
            pbrMaterial.subSurface.translucencyIntensity = 0.0;
            pbrMaterial.subSurface.isTranslucencyEnabled = false;
            return Promise.resolve();
        }
        if (extension.translucencyTexture) {
            return this._loader.loadTextureInfoAsync(context + "/translucencyTexture", extension.translucencyTexture)
                .then(function (texture) {
                pbrMaterial.subSurface.thicknessTexture = texture;
                pbrMaterial.subSurface.useMaskFromThicknessTextureGltf = true;
            });
        }
        else {
            return Promise.resolve();
        }
    };
    return KHR_materials_translucency;
}());
GLTFLoader$1.RegisterExtension(NAME$d, function (loader) { return new KHR_materials_translucency(loader); });

var NAME$e = "KHR_mesh_quantization";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization)
 */
var KHR_mesh_quantization = /** @class */ (function () {
    /** @hidden */
    function KHR_mesh_quantization(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$e;
        this.enabled = loader.isExtensionUsed(NAME$e);
    }
    /** @hidden */
    KHR_mesh_quantization.prototype.dispose = function () {
    };
    return KHR_mesh_quantization;
}());
GLTFLoader$1.RegisterExtension(NAME$e, function (loader) { return new KHR_mesh_quantization(loader); });

var NAME$f = "KHR_texture_basisu";
/**
 * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1751)
 * !!! Experimental Extension Subject to Changes !!!
 */
var KHR_texture_basisu = /** @class */ (function () {
    /** @hidden */
    function KHR_texture_basisu(loader) {
        /** The name of this extension. */
        this.name = NAME$f;
        this._loader = loader;
        this.enabled = loader.isExtensionUsed(NAME$f);
    }
    /** @hidden */
    KHR_texture_basisu.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    KHR_texture_basisu.prototype._loadTextureAsync = function (context, texture, assign) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, texture, this.name, function (extensionContext, extension) {
            var sampler = (texture.sampler == undefined ? GLTFLoader$1.DefaultSampler : ArrayItem.Get(context + "/sampler", _this._loader.gltf.samplers, texture.sampler));
            var image = ArrayItem.Get(extensionContext + "/source", _this._loader.gltf.images, extension.source);
            return _this._loader._createTextureAsync(context, sampler, image, function (babylonTexture) {
                assign(babylonTexture);
            }, texture._textureInfo.nonColorData ? { useRGBAIfASTCBC7NotAvailableWhenUASTC: true } : undefined);
        });
    };
    return KHR_texture_basisu;
}());
GLTFLoader$1.RegisterExtension(NAME$f, function (loader) { return new KHR_texture_basisu(loader); });

var NAME$g = "KHR_texture_transform";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_texture_transform)
 */
var KHR_texture_transform = /** @class */ (function () {
    /** @hidden */
    function KHR_texture_transform(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$g;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$g);
    }
    /** @hidden */
    KHR_texture_transform.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    KHR_texture_transform.prototype.loadTextureInfoAsync = function (context, textureInfo, assign) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, textureInfo, this.name, function (extensionContext, extension) {
            return _this._loader.loadTextureInfoAsync(context, textureInfo, function (babylonTexture) {
                if (!(babylonTexture instanceof Texture)) {
                    throw new Error(extensionContext + ": Texture type not supported");
                }
                if (extension.offset) {
                    babylonTexture.uOffset = extension.offset[0];
                    babylonTexture.vOffset = extension.offset[1];
                }
                // Always rotate around the origin.
                babylonTexture.uRotationCenter = 0;
                babylonTexture.vRotationCenter = 0;
                if (extension.rotation) {
                    babylonTexture.wAng = -extension.rotation;
                }
                if (extension.scale) {
                    babylonTexture.uScale = extension.scale[0];
                    babylonTexture.vScale = extension.scale[1];
                }
                if (extension.texCoord != undefined) {
                    babylonTexture.coordinatesIndex = extension.texCoord;
                }
                assign(babylonTexture);
            });
        });
    };
    return KHR_texture_transform;
}());
GLTFLoader$1.RegisterExtension(NAME$g, function (loader) { return new KHR_texture_transform(loader); });

var NAME$h = "MSFT_audio_emitter";
/**
 * [Specification](https://github.com/najadojo/glTF/tree/MSFT_audio_emitter/extensions/2.0/Vendor/MSFT_audio_emitter)
 */
var MSFT_audio_emitter = /** @class */ (function () {
    /** @hidden */
    function MSFT_audio_emitter(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$h;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$h);
    }
    /** @hidden */
    MSFT_audio_emitter.prototype.dispose = function () {
        this._loader = null;
        this._clips = null;
        this._emitters = null;
    };
    /** @hidden */
    MSFT_audio_emitter.prototype.onLoading = function () {
        var extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            var extension = extensions[this.name];
            this._clips = extension.clips;
            this._emitters = extension.emitters;
            ArrayItem.Assign(this._clips);
            ArrayItem.Assign(this._emitters);
        }
    };
    /** @hidden */
    MSFT_audio_emitter.prototype.loadSceneAsync = function (context, scene) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, scene, this.name, function (extensionContext, extension) {
            var promises = new Array();
            promises.push(_this._loader.loadSceneAsync(context, scene));
            for (var _i = 0, _a = extension.emitters; _i < _a.length; _i++) {
                var emitterIndex = _a[_i];
                var emitter = ArrayItem.Get(extensionContext + "/emitters", _this._emitters, emitterIndex);
                if (emitter.refDistance != undefined || emitter.maxDistance != undefined || emitter.rolloffFactor != undefined ||
                    emitter.distanceModel != undefined || emitter.innerAngle != undefined || emitter.outerAngle != undefined) {
                    throw new Error(extensionContext + ": Direction or Distance properties are not allowed on emitters attached to a scene");
                }
                promises.push(_this._loadEmitterAsync(extensionContext + "/emitters/" + emitter.index, emitter));
            }
            return Promise.all(promises).then(function () { });
        });
    };
    /** @hidden */
    MSFT_audio_emitter.prototype.loadNodeAsync = function (context, node, assign) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, node, this.name, function (extensionContext, extension) {
            var promises = new Array();
            return _this._loader.loadNodeAsync(extensionContext, node, function (babylonMesh) {
                var _loop_1 = function (emitterIndex) {
                    var emitter = ArrayItem.Get(extensionContext + "/emitters", _this._emitters, emitterIndex);
                    promises.push(_this._loadEmitterAsync(extensionContext + "/emitters/" + emitter.index, emitter).then(function () {
                        for (var _i = 0, _a = emitter._babylonSounds; _i < _a.length; _i++) {
                            var sound = _a[_i];
                            sound.attachToMesh(babylonMesh);
                            if (emitter.innerAngle != undefined || emitter.outerAngle != undefined) {
                                sound.setLocalDirectionToMesh(Vector3.Forward());
                                sound.setDirectionalCone(2 * Tools.ToDegrees(emitter.innerAngle == undefined ? Math.PI : emitter.innerAngle), 2 * Tools.ToDegrees(emitter.outerAngle == undefined ? Math.PI : emitter.outerAngle), 0);
                            }
                        }
                    }));
                };
                for (var _i = 0, _a = extension.emitters; _i < _a.length; _i++) {
                    var emitterIndex = _a[_i];
                    _loop_1(emitterIndex);
                }
                assign(babylonMesh);
            }).then(function (babylonMesh) {
                return Promise.all(promises).then(function () {
                    return babylonMesh;
                });
            });
        });
    };
    /** @hidden */
    MSFT_audio_emitter.prototype.loadAnimationAsync = function (context, animation) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, animation, this.name, function (extensionContext, extension) {
            return _this._loader.loadAnimationAsync(context, animation).then(function (babylonAnimationGroup) {
                var promises = new Array();
                ArrayItem.Assign(extension.events);
                for (var _i = 0, _a = extension.events; _i < _a.length; _i++) {
                    var event_1 = _a[_i];
                    promises.push(_this._loadAnimationEventAsync(extensionContext + "/events/" + event_1.index, context, animation, event_1, babylonAnimationGroup));
                }
                return Promise.all(promises).then(function () {
                    return babylonAnimationGroup;
                });
            });
        });
    };
    MSFT_audio_emitter.prototype._loadClipAsync = function (context, clip) {
        if (clip._objectURL) {
            return clip._objectURL;
        }
        var promise;
        if (clip.uri) {
            promise = this._loader.loadUriAsync(context, clip, clip.uri);
        }
        else {
            var bufferView = ArrayItem.Get(context + "/bufferView", this._loader.gltf.bufferViews, clip.bufferView);
            promise = this._loader.loadBufferViewAsync("/bufferViews/" + bufferView.index, bufferView);
        }
        clip._objectURL = promise.then(function (data) {
            return URL.createObjectURL(new Blob([data], { type: clip.mimeType }));
        });
        return clip._objectURL;
    };
    MSFT_audio_emitter.prototype._loadEmitterAsync = function (context, emitter) {
        var _this = this;
        emitter._babylonSounds = emitter._babylonSounds || [];
        if (!emitter._babylonData) {
            var clipPromises = new Array();
            var name_1 = emitter.name || "emitter" + emitter.index;
            var options_1 = {
                loop: false,
                autoplay: false,
                volume: emitter.volume == undefined ? 1 : emitter.volume,
            };
            var _loop_2 = function (i) {
                var clipContext = "/extensions/" + this_1.name + "/clips";
                var clip = ArrayItem.Get(clipContext, this_1._clips, emitter.clips[i].clip);
                clipPromises.push(this_1._loadClipAsync(clipContext + "/" + emitter.clips[i].clip, clip).then(function (objectURL) {
                    var sound = emitter._babylonSounds[i] = new Sound(name_1, objectURL, _this._loader.babylonScene, null, options_1);
                    sound.refDistance = emitter.refDistance || 1;
                    sound.maxDistance = emitter.maxDistance || 256;
                    sound.rolloffFactor = emitter.rolloffFactor || 1;
                    sound.distanceModel = emitter.distanceModel || 'exponential';
                    sound._positionInEmitterSpace = true;
                }));
            };
            var this_1 = this;
            for (var i = 0; i < emitter.clips.length; i++) {
                _loop_2(i);
            }
            var promise = Promise.all(clipPromises).then(function () {
                var weights = emitter.clips.map(function (clip) { return clip.weight || 1; });
                var weightedSound = new WeightedSound(emitter.loop || false, emitter._babylonSounds, weights);
                if (emitter.innerAngle) {
                    weightedSound.directionalConeInnerAngle = 2 * Tools.ToDegrees(emitter.innerAngle);
                }
                if (emitter.outerAngle) {
                    weightedSound.directionalConeOuterAngle = 2 * Tools.ToDegrees(emitter.outerAngle);
                }
                if (emitter.volume) {
                    weightedSound.volume = emitter.volume;
                }
                emitter._babylonData.sound = weightedSound;
            });
            emitter._babylonData = {
                loaded: promise
            };
        }
        return emitter._babylonData.loaded;
    };
    MSFT_audio_emitter.prototype._getEventAction = function (context, sound, action, time, startOffset) {
        switch (action) {
            case "play" /* play */: {
                return function (currentFrame) {
                    var frameOffset = (startOffset || 0) + (currentFrame - time);
                    sound.play(frameOffset);
                };
            }
            case "stop" /* stop */: {
                return function (currentFrame) {
                    sound.stop();
                };
            }
            case "pause" /* pause */: {
                return function (currentFrame) {
                    sound.pause();
                };
            }
            default: {
                throw new Error(context + ": Unsupported action " + action);
            }
        }
    };
    MSFT_audio_emitter.prototype._loadAnimationEventAsync = function (context, animationContext, animation, event, babylonAnimationGroup) {
        var _this = this;
        if (babylonAnimationGroup.targetedAnimations.length == 0) {
            return Promise.resolve();
        }
        var babylonAnimation = babylonAnimationGroup.targetedAnimations[0];
        var emitterIndex = event.emitter;
        var emitter = ArrayItem.Get("/extensions/" + this.name + "/emitters", this._emitters, emitterIndex);
        return this._loadEmitterAsync(context, emitter).then(function () {
            var sound = emitter._babylonData.sound;
            if (sound) {
                var babylonAnimationEvent = new AnimationEvent(event.time, _this._getEventAction(context, sound, event.action, event.time, event.startOffset));
                babylonAnimation.animation.addEvent(babylonAnimationEvent);
                // Make sure all started audio stops when this animation is terminated.
                babylonAnimationGroup.onAnimationGroupEndObservable.add(function () {
                    sound.stop();
                });
                babylonAnimationGroup.onAnimationGroupPauseObservable.add(function () {
                    sound.pause();
                });
            }
        });
    };
    return MSFT_audio_emitter;
}());
GLTFLoader$1.RegisterExtension(NAME$h, function (loader) { return new MSFT_audio_emitter(loader); });

var NAME$i = "MSFT_lod";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/MSFT_lod)
 */
var MSFT_lod = /** @class */ (function () {
    /** @hidden */
    function MSFT_lod(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$i;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        this.order = 100;
        /**
         * Maximum number of LODs to load, starting from the lowest LOD.
         */
        this.maxLODsToLoad = 10;
        /**
         * Observable raised when all node LODs of one level are loaded.
         * The event data is the index of the loaded LOD starting from zero.
         * Dispose the loader to cancel the loading of the next level of LODs.
         */
        this.onNodeLODsLoadedObservable = new Observable();
        /**
         * Observable raised when all material LODs of one level are loaded.
         * The event data is the index of the loaded LOD starting from zero.
         * Dispose the loader to cancel the loading of the next level of LODs.
         */
        this.onMaterialLODsLoadedObservable = new Observable();
        this._bufferLODs = new Array();
        this._nodeIndexLOD = null;
        this._nodeSignalLODs = new Array();
        this._nodePromiseLODs = new Array();
        this._nodeBufferLODs = new Array();
        this._materialIndexLOD = null;
        this._materialSignalLODs = new Array();
        this._materialPromiseLODs = new Array();
        this._materialBufferLODs = new Array();
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$i);
    }
    /** @hidden */
    MSFT_lod.prototype.dispose = function () {
        this._loader = null;
        this._nodeIndexLOD = null;
        this._nodeSignalLODs.length = 0;
        this._nodePromiseLODs.length = 0;
        this._nodeBufferLODs.length = 0;
        this._materialIndexLOD = null;
        this._materialSignalLODs.length = 0;
        this._materialPromiseLODs.length = 0;
        this._materialBufferLODs.length = 0;
        this.onMaterialLODsLoadedObservable.clear();
        this.onNodeLODsLoadedObservable.clear();
    };
    /** @hidden */
    MSFT_lod.prototype.onReady = function () {
        var _this = this;
        var _loop_1 = function (indexLOD) {
            var promise = Promise.all(this_1._nodePromiseLODs[indexLOD]).then(function () {
                if (indexLOD !== 0) {
                    _this._loader.endPerformanceCounter("Node LOD " + indexLOD);
                    _this._loader.log("Loaded node LOD " + indexLOD);
                }
                _this.onNodeLODsLoadedObservable.notifyObservers(indexLOD);
                if (indexLOD !== _this._nodePromiseLODs.length - 1) {
                    _this._loader.startPerformanceCounter("Node LOD " + (indexLOD + 1));
                    _this._loadBufferLOD(_this._nodeBufferLODs, indexLOD + 1);
                    if (_this._nodeSignalLODs[indexLOD]) {
                        _this._nodeSignalLODs[indexLOD].resolve();
                    }
                }
            });
            this_1._loader._completePromises.push(promise);
        };
        var this_1 = this;
        for (var indexLOD = 0; indexLOD < this._nodePromiseLODs.length; indexLOD++) {
            _loop_1(indexLOD);
        }
        var _loop_2 = function (indexLOD) {
            var promise = Promise.all(this_2._materialPromiseLODs[indexLOD]).then(function () {
                if (indexLOD !== 0) {
                    _this._loader.endPerformanceCounter("Material LOD " + indexLOD);
                    _this._loader.log("Loaded material LOD " + indexLOD);
                }
                _this.onMaterialLODsLoadedObservable.notifyObservers(indexLOD);
                if (indexLOD !== _this._materialPromiseLODs.length - 1) {
                    _this._loader.startPerformanceCounter("Material LOD " + (indexLOD + 1));
                    _this._loadBufferLOD(_this._materialBufferLODs, indexLOD + 1);
                    if (_this._materialSignalLODs[indexLOD]) {
                        _this._materialSignalLODs[indexLOD].resolve();
                    }
                }
            });
            this_2._loader._completePromises.push(promise);
        };
        var this_2 = this;
        for (var indexLOD = 0; indexLOD < this._materialPromiseLODs.length; indexLOD++) {
            _loop_2(indexLOD);
        }
    };
    /** @hidden */
    MSFT_lod.prototype.loadSceneAsync = function (context, scene) {
        var promise = this._loader.loadSceneAsync(context, scene);
        this._loadBufferLOD(this._bufferLODs, 0);
        return promise;
    };
    /** @hidden */
    MSFT_lod.prototype.loadNodeAsync = function (context, node, assign) {
        var _this = this;
        return GLTFLoader$1.LoadExtensionAsync(context, node, this.name, function (extensionContext, extension) {
            var firstPromise;
            var nodeLODs = _this._getLODs(extensionContext, node, _this._loader.gltf.nodes, extension.ids);
            _this._loader.logOpen("" + extensionContext);
            var _loop_3 = function (indexLOD) {
                var nodeLOD = nodeLODs[indexLOD];
                if (indexLOD !== 0) {
                    _this._nodeIndexLOD = indexLOD;
                    _this._nodeSignalLODs[indexLOD] = _this._nodeSignalLODs[indexLOD] || new Deferred();
                }
                var assign_1 = function (babylonTransformNode) { babylonTransformNode.setEnabled(false); };
                var promise = _this._loader.loadNodeAsync("/nodes/" + nodeLOD.index, nodeLOD, assign_1).then(function (babylonMesh) {
                    if (indexLOD !== 0) {
                        // TODO: should not rely on _babylonTransformNode
                        var previousNodeLOD = nodeLODs[indexLOD - 1];
                        if (previousNodeLOD._babylonTransformNode) {
                            _this._disposeTransformNode(previousNodeLOD._babylonTransformNode);
                            delete previousNodeLOD._babylonTransformNode;
                        }
                    }
                    babylonMesh.setEnabled(true);
                    return babylonMesh;
                });
                _this._nodePromiseLODs[indexLOD] = _this._nodePromiseLODs[indexLOD] || [];
                if (indexLOD === 0) {
                    firstPromise = promise;
                }
                else {
                    _this._nodeIndexLOD = null;
                    _this._nodePromiseLODs[indexLOD].push(promise);
                }
            };
            for (var indexLOD = 0; indexLOD < nodeLODs.length; indexLOD++) {
                _loop_3(indexLOD);
            }
            _this._loader.logClose();
            return firstPromise;
        });
    };
    /** @hidden */
    MSFT_lod.prototype._loadMaterialAsync = function (context, material, babylonMesh, babylonDrawMode, assign) {
        var _this = this;
        // Don't load material LODs if already loading a node LOD.
        if (this._nodeIndexLOD) {
            return null;
        }
        return GLTFLoader$1.LoadExtensionAsync(context, material, this.name, function (extensionContext, extension) {
            var firstPromise;
            var materialLODs = _this._getLODs(extensionContext, material, _this._loader.gltf.materials, extension.ids);
            _this._loader.logOpen("" + extensionContext);
            var _loop_4 = function (indexLOD) {
                var materialLOD = materialLODs[indexLOD];
                if (indexLOD !== 0) {
                    _this._materialIndexLOD = indexLOD;
                }
                var promise = _this._loader._loadMaterialAsync("/materials/" + materialLOD.index, materialLOD, babylonMesh, babylonDrawMode, function (babylonMaterial) {
                    if (indexLOD === 0) {
                        assign(babylonMaterial);
                    }
                }).then(function (babylonMaterial) {
                    if (indexLOD !== 0) {
                        assign(babylonMaterial);
                        // TODO: should not rely on _data
                        var previousDataLOD = materialLODs[indexLOD - 1]._data;
                        if (previousDataLOD[babylonDrawMode]) {
                            _this._disposeMaterials([previousDataLOD[babylonDrawMode].babylonMaterial]);
                            delete previousDataLOD[babylonDrawMode];
                        }
                    }
                    return babylonMaterial;
                });
                _this._materialPromiseLODs[indexLOD] = _this._materialPromiseLODs[indexLOD] || [];
                if (indexLOD === 0) {
                    firstPromise = promise;
                }
                else {
                    _this._materialIndexLOD = null;
                    _this._materialPromiseLODs[indexLOD].push(promise);
                }
            };
            for (var indexLOD = 0; indexLOD < materialLODs.length; indexLOD++) {
                _loop_4(indexLOD);
            }
            _this._loader.logClose();
            return firstPromise;
        });
    };
    /** @hidden */
    MSFT_lod.prototype._loadUriAsync = function (context, property, uri) {
        var _this = this;
        // Defer the loading of uris if loading a node or material LOD.
        if (this._nodeIndexLOD !== null) {
            this._loader.log("deferred");
            var previousIndexLOD = this._nodeIndexLOD - 1;
            this._nodeSignalLODs[previousIndexLOD] = this._nodeSignalLODs[previousIndexLOD] || new Deferred();
            return this._nodeSignalLODs[this._nodeIndexLOD - 1].promise.then(function () {
                return _this._loader.loadUriAsync(context, property, uri);
            });
        }
        else if (this._materialIndexLOD !== null) {
            this._loader.log("deferred");
            var previousIndexLOD = this._materialIndexLOD - 1;
            this._materialSignalLODs[previousIndexLOD] = this._materialSignalLODs[previousIndexLOD] || new Deferred();
            return this._materialSignalLODs[previousIndexLOD].promise.then(function () {
                return _this._loader.loadUriAsync(context, property, uri);
            });
        }
        return null;
    };
    /** @hidden */
    MSFT_lod.prototype.loadBufferAsync = function (context, buffer, byteOffset, byteLength) {
        if (this._loader.parent.useRangeRequests && !buffer.uri) {
            if (!this._loader.bin) {
                throw new Error(context + ": Uri is missing or the binary glTF is missing its binary chunk");
            }
            var loadAsync = function (bufferLODs, indexLOD) {
                var start = byteOffset;
                var end = start + byteLength - 1;
                var bufferLOD = bufferLODs[indexLOD];
                if (bufferLOD) {
                    bufferLOD.start = Math.min(bufferLOD.start, start);
                    bufferLOD.end = Math.max(bufferLOD.end, end);
                }
                else {
                    bufferLOD = { start: start, end: end, loaded: new Deferred() };
                    bufferLODs[indexLOD] = bufferLOD;
                }
                return bufferLOD.loaded.promise.then(function (data) {
                    return new Uint8Array(data.buffer, data.byteOffset + byteOffset - bufferLOD.start, byteLength);
                });
            };
            this._loader.log("deferred");
            if (this._nodeIndexLOD !== null) {
                return loadAsync(this._nodeBufferLODs, this._nodeIndexLOD);
            }
            else if (this._materialIndexLOD !== null) {
                return loadAsync(this._materialBufferLODs, this._materialIndexLOD);
            }
            else {
                return loadAsync(this._bufferLODs, 0);
            }
        }
        return null;
    };
    MSFT_lod.prototype._loadBufferLOD = function (bufferLODs, indexLOD) {
        var bufferLOD = bufferLODs[indexLOD];
        if (bufferLOD) {
            this._loader.log("Loading buffer range [" + bufferLOD.start + "-" + bufferLOD.end + "]");
            this._loader.bin.readAsync(bufferLOD.start, bufferLOD.end - bufferLOD.start + 1).then(function (data) {
                bufferLOD.loaded.resolve(data);
            }, function (error) {
                bufferLOD.loaded.reject(error);
            });
        }
    };
    /**
     * Gets an array of LOD properties from lowest to highest.
     */
    MSFT_lod.prototype._getLODs = function (context, property, array, ids) {
        if (this.maxLODsToLoad <= 0) {
            throw new Error("maxLODsToLoad must be greater than zero");
        }
        var properties = new Array();
        for (var i = ids.length - 1; i >= 0; i--) {
            properties.push(ArrayItem.Get(context + "/ids/" + ids[i], array, ids[i]));
            if (properties.length === this.maxLODsToLoad) {
                return properties;
            }
        }
        properties.push(property);
        return properties;
    };
    MSFT_lod.prototype._disposeTransformNode = function (babylonTransformNode) {
        var _this = this;
        var babylonMaterials = new Array();
        var babylonMaterial = babylonTransformNode.material;
        if (babylonMaterial) {
            babylonMaterials.push(babylonMaterial);
        }
        for (var _i = 0, _a = babylonTransformNode.getChildMeshes(); _i < _a.length; _i++) {
            var babylonMesh = _a[_i];
            if (babylonMesh.material) {
                babylonMaterials.push(babylonMesh.material);
            }
        }
        babylonTransformNode.dispose();
        var babylonMaterialsToDispose = babylonMaterials.filter(function (babylonMaterial) { return _this._loader.babylonScene.meshes.every(function (mesh) { return mesh.material != babylonMaterial; }); });
        this._disposeMaterials(babylonMaterialsToDispose);
    };
    MSFT_lod.prototype._disposeMaterials = function (babylonMaterials) {
        var babylonTextures = {};
        for (var _i = 0, babylonMaterials_1 = babylonMaterials; _i < babylonMaterials_1.length; _i++) {
            var babylonMaterial = babylonMaterials_1[_i];
            for (var _a = 0, _b = babylonMaterial.getActiveTextures(); _a < _b.length; _a++) {
                var babylonTexture = _b[_a];
                babylonTextures[babylonTexture.uniqueId] = babylonTexture;
            }
            babylonMaterial.dispose();
        }
        for (var uniqueId in babylonTextures) {
            for (var _c = 0, _d = this._loader.babylonScene.materials; _c < _d.length; _c++) {
                var babylonMaterial = _d[_c];
                if (babylonMaterial.hasTexture(babylonTextures[uniqueId])) {
                    delete babylonTextures[uniqueId];
                }
            }
        }
        for (var uniqueId in babylonTextures) {
            babylonTextures[uniqueId].dispose();
        }
    };
    return MSFT_lod;
}());
GLTFLoader$1.RegisterExtension(NAME$i, function (loader) { return new MSFT_lod(loader); });

var NAME$j = "MSFT_minecraftMesh";
/** @hidden */
var MSFT_minecraftMesh = /** @class */ (function () {
    function MSFT_minecraftMesh(loader) {
        this.name = NAME$j;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$j);
    }
    MSFT_minecraftMesh.prototype.dispose = function () {
        this._loader = null;
    };
    MSFT_minecraftMesh.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var _this = this;
        return GLTFLoader$1.LoadExtraAsync(context, material, this.name, function (extraContext, extra) {
            if (extra) {
                if (!(babylonMaterial instanceof PBRMaterial)) {
                    throw new Error(extraContext + ": Material type not supported");
                }
                var promise = _this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial);
                if (babylonMaterial.needAlphaBlending()) {
                    babylonMaterial.forceDepthWrite = true;
                    babylonMaterial.separateCullingPass = true;
                }
                babylonMaterial.backFaceCulling = babylonMaterial.forceDepthWrite;
                babylonMaterial.twoSidedLighting = true;
                return promise;
            }
            return null;
        });
    };
    return MSFT_minecraftMesh;
}());
GLTFLoader$1.RegisterExtension(NAME$j, function (loader) { return new MSFT_minecraftMesh(loader); });

var NAME$k = "MSFT_sRGBFactors";
/** @hidden */
var MSFT_sRGBFactors = /** @class */ (function () {
    function MSFT_sRGBFactors(loader) {
        this.name = NAME$k;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME$k);
    }
    MSFT_sRGBFactors.prototype.dispose = function () {
        this._loader = null;
    };
    MSFT_sRGBFactors.prototype.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
        var _this = this;
        return GLTFLoader$1.LoadExtraAsync(context, material, this.name, function (extraContext, extra) {
            if (extra) {
                if (!(babylonMaterial instanceof PBRMaterial)) {
                    throw new Error(extraContext + ": Material type not supported");
                }
                var promise = _this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial);
                if (!babylonMaterial.albedoTexture) {
                    babylonMaterial.albedoColor.toLinearSpaceToRef(babylonMaterial.albedoColor);
                }
                if (!babylonMaterial.reflectivityTexture) {
                    babylonMaterial.reflectivityColor.toLinearSpaceToRef(babylonMaterial.reflectivityColor);
                }
                return promise;
            }
            return null;
        });
    };
    return MSFT_sRGBFactors;
}());
GLTFLoader$1.RegisterExtension(NAME$k, function (loader) { return new MSFT_sRGBFactors(loader); });

var NAME$l = "ExtrasAsMetadata";
/**
 * Store glTF extras (if present) in BJS objects' metadata
 */
var ExtrasAsMetadata = /** @class */ (function () {
    /** @hidden */
    function ExtrasAsMetadata(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME$l;
        /**
         * Defines whether this extension is enabled.
         */
        this.enabled = true;
        this._loader = loader;
    }
    ExtrasAsMetadata.prototype._assignExtras = function (babylonObject, gltfProp) {
        if (gltfProp.extras && Object.keys(gltfProp.extras).length > 0) {
            var metadata = (babylonObject.metadata = babylonObject.metadata || {});
            var gltf = (metadata.gltf = metadata.gltf || {});
            gltf.extras = gltfProp.extras;
        }
    };
    /** @hidden */
    ExtrasAsMetadata.prototype.dispose = function () {
        this._loader = null;
    };
    /** @hidden */
    ExtrasAsMetadata.prototype.loadNodeAsync = function (context, node, assign) {
        var _this = this;
        return this._loader.loadNodeAsync(context, node, function (babylonTransformNode) {
            _this._assignExtras(babylonTransformNode, node);
            assign(babylonTransformNode);
        });
    };
    /** @hidden */
    ExtrasAsMetadata.prototype.loadCameraAsync = function (context, camera, assign) {
        var _this = this;
        return this._loader.loadCameraAsync(context, camera, function (babylonCamera) {
            _this._assignExtras(babylonCamera, camera);
            assign(babylonCamera);
        });
    };
    /** @hidden */
    ExtrasAsMetadata.prototype.createMaterial = function (context, material, babylonDrawMode) {
        var babylonMaterial = this._loader.createMaterial(context, material, babylonDrawMode);
        this._assignExtras(babylonMaterial, material);
        return babylonMaterial;
    };
    return ExtrasAsMetadata;
}());
GLTFLoader$1.RegisterExtension(NAME$l, function (loader) { return new ExtrasAsMetadata(loader); });

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ArrayItem: ArrayItem,
    GLTFLoader: GLTFLoader$1,
    EXT_lights_image_based: EXT_lights_image_based,
    EXT_mesh_gpu_instancing: EXT_mesh_gpu_instancing,
    EXT_texture_webp: EXT_texture_webp,
    KHR_draco_mesh_compression: KHR_draco_mesh_compression,
    KHR_lights: KHR_lights,
    KHR_materials_pbrSpecularGlossiness: KHR_materials_pbrSpecularGlossiness,
    KHR_materials_unlit: KHR_materials_unlit,
    KHR_materials_clearcoat: KHR_materials_clearcoat,
    KHR_materials_sheen: KHR_materials_sheen,
    KHR_materials_specular: KHR_materials_specular,
    KHR_materials_ior: KHR_materials_ior,
    KHR_materials_variants: KHR_materials_variants,
    KHR_materials_transmission: KHR_materials_transmission,
    KHR_materials_translucency: KHR_materials_translucency,
    KHR_mesh_quantization: KHR_mesh_quantization,
    KHR_texture_basisu: KHR_texture_basisu,
    KHR_texture_transform: KHR_texture_transform,
    MSFT_audio_emitter: MSFT_audio_emitter,
    MSFT_lod: MSFT_lod,
    MSFT_minecraftMesh: MSFT_minecraftMesh,
    MSFT_sRGBFactors: MSFT_sRGBFactors,
    ExtrasAsMetadata: ExtrasAsMetadata
});

export { AnimationEvent as A, BRDFTextureTools as B, Constants as C, DirectionalLight as D, GLTFLoaderCoordinateSystemMode as G, PBRMaterial as P, RawCubeTexture as R, Sound as S, WorkerPool as W, PBRBaseMaterial as a, PointLight as b, PBRClearCoatConfiguration as c, WeightedSound as d, PBRMaterialDefines as e, DracoCompression as f, Deferred as g, RGBDTextureTools as h, DataReader as i, GLTFLoaderAnimationStartMode as j, GLTFLoaderState as k, GLTFFileLoader as l, GLTFValidation as m, index as n, index$1 as o };
