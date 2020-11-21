import { S as StringTools } from '../../../../../common/thinEngine-e576a091.js';
import '../../../../../common/node-87d9c658.js';
import '../../../../../common/math.color-fc6e801e.js';
import '../../../../../common/performanceConfigurator-115fd081.js';
import { E as Engine } from '../../../../../common/engine-9a1b5aa7.js';
import '../../../../../common/pointerEvents-12a2451c.js';
import '../../../../../common/tools-ab6f1dea.js';
import '../../../../../common/guid-495ff9c7.js';
import '../../../../../common/math.frustum-2cd1d420.js';
import '../../../../../common/math.axis-e7db27a6.js';
import '../../../../../common/scene-cbeb8ae2.js';
import '../../../../../common/sceneComponent-5502b64a.js';
import '../../../../../common/uniformBuffer-e700d3a6.js';
import '../../../../../common/light-a23926e9.js';
import '../../../../../common/math.size-6398c1e8.js';
import '../../../../../common/baseTexture-827d5047.js';
import '../../../../../common/baseTexture.polynomial-54f1194f.js';
import '../../../../../common/postProcess-3bcb67b3.js';
import '../../../../../common/helperFunctions-f4fc40e0.js';
import { E as EnvironmentTextureTools } from '../../../../../common/environmentTextureTools-35b27683.js';

/**
 * Implementation of the ENV Texture Loader.
 * @hidden
 */
var _ENVTextureLoader = /** @class */ (function () {
    function _ENVTextureLoader() {
        /**
         * Defines wether the loader supports cascade loading the different faces.
         */
        this.supportCascades = false;
    }
    /**
     * This returns if the loader support the current file information.
     * @param extension defines the file extension of the file being loaded
     * @returns true if the loader can load the specified file
     */
    _ENVTextureLoader.prototype.canLoad = function (extension) {
        return StringTools.EndsWith(extension, ".env");
    };
    /**
     * Uploads the cube texture data to the WebGL texture. It has already been bound.
     * @param data contains the texture data
     * @param texture defines the BabylonJS internal texture
     * @param createPolynomials will be true if polynomials have been requested
     * @param onLoad defines the callback to trigger once the texture is ready
     * @param onError defines the callback to trigger in case of error
     */
    _ENVTextureLoader.prototype.loadCubeData = function (data, texture, createPolynomials, onLoad, onError) {
        if (Array.isArray(data)) {
            return;
        }
        var info = EnvironmentTextureTools.GetEnvInfo(data);
        if (info) {
            texture.width = info.width;
            texture.height = info.width;
            EnvironmentTextureTools.UploadEnvSpherical(texture, info);
            EnvironmentTextureTools.UploadEnvLevelsAsync(texture, data, info).then(function () {
                texture.isReady = true;
                texture.onLoadedObservable.notifyObservers(texture);
                texture.onLoadedObservable.clear();
                if (onLoad) {
                    onLoad();
                }
            });
        }
        else if (onError) {
            onError("Can not parse the environment file", null);
        }
    };
    /**
     * Uploads the 2D texture data to the WebGL texture. It has already been bound once in the callback.
     * @param data contains the texture data
     * @param texture defines the BabylonJS internal texture
     * @param callback defines the method to call once ready to upload
     */
    _ENVTextureLoader.prototype.loadData = function (data, texture, callback) {
        throw ".env not supported in 2d.";
    };
    return _ENVTextureLoader;
}());
// Register the loader.
Engine._TextureLoaders.push(new _ENVTextureLoader());

export { _ENVTextureLoader };
