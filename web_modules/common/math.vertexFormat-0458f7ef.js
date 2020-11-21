import { V as Vector3, a as Vector2 } from './math.color-fc6e801e.js';

/**
 * Contains position and normal vectors for a vertex
 */
var PositionNormalVertex = /** @class */ (function () {
    /**
     * Creates a PositionNormalVertex
     * @param position the position of the vertex (defaut: 0,0,0)
     * @param normal the normal of the vertex (defaut: 0,1,0)
     */
    function PositionNormalVertex(
    /** the position of the vertex (defaut: 0,0,0) */
    position, 
    /** the normal of the vertex (defaut: 0,1,0) */
    normal) {
        if (position === void 0) { position = Vector3.Zero(); }
        if (normal === void 0) { normal = Vector3.Up(); }
        this.position = position;
        this.normal = normal;
    }
    /**
     * Clones the PositionNormalVertex
     * @returns the cloned PositionNormalVertex
     */
    PositionNormalVertex.prototype.clone = function () {
        return new PositionNormalVertex(this.position.clone(), this.normal.clone());
    };
    return PositionNormalVertex;
}());
/**
 * Contains position, normal and uv vectors for a vertex
 */
var PositionNormalTextureVertex = /** @class */ (function () {
    /**
     * Creates a PositionNormalTextureVertex
     * @param position the position of the vertex (defaut: 0,0,0)
     * @param normal the normal of the vertex (defaut: 0,1,0)
     * @param uv the uv of the vertex (default: 0,0)
     */
    function PositionNormalTextureVertex(
    /** the position of the vertex (defaut: 0,0,0) */
    position, 
    /** the normal of the vertex (defaut: 0,1,0) */
    normal, 
    /** the uv of the vertex (default: 0,0) */
    uv) {
        if (position === void 0) { position = Vector3.Zero(); }
        if (normal === void 0) { normal = Vector3.Up(); }
        if (uv === void 0) { uv = Vector2.Zero(); }
        this.position = position;
        this.normal = normal;
        this.uv = uv;
    }
    /**
     * Clones the PositionNormalTextureVertex
     * @returns the cloned PositionNormalTextureVertex
     */
    PositionNormalTextureVertex.prototype.clone = function () {
        return new PositionNormalTextureVertex(this.position.clone(), this.normal.clone(), this.uv.clone());
    };
    return PositionNormalTextureVertex;
}());

export { PositionNormalVertex as P, PositionNormalTextureVertex as a };
