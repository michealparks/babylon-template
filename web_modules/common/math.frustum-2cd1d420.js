import { P as Plane } from './math.axis-e7db27a6.js';

/**
 * Class used to represent a viewport on screen
 */
var Viewport = /** @class */ (function () {
    /**
     * Creates a Viewport object located at (x, y) and sized (width, height)
     * @param x defines viewport left coordinate
     * @param y defines viewport top coordinate
     * @param width defines the viewport width
     * @param height defines the viewport height
     */
    function Viewport(
    /** viewport left coordinate */
    x, 
    /** viewport top coordinate */
    y, 
    /**viewport width */
    width, 
    /** viewport height */
    height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * Creates a new viewport using absolute sizing (from 0-> width, 0-> height instead of 0->1)
     * @param renderWidth defines the rendering width
     * @param renderHeight defines the rendering height
     * @returns a new Viewport
     */
    Viewport.prototype.toGlobal = function (renderWidth, renderHeight) {
        return new Viewport(this.x * renderWidth, this.y * renderHeight, this.width * renderWidth, this.height * renderHeight);
    };
    /**
     * Stores absolute viewport value into a target viewport (from 0-> width, 0-> height instead of 0->1)
     * @param renderWidth defines the rendering width
     * @param renderHeight defines the rendering height
     * @param ref defines the target viewport
     * @returns the current viewport
     */
    Viewport.prototype.toGlobalToRef = function (renderWidth, renderHeight, ref) {
        ref.x = this.x * renderWidth;
        ref.y = this.y * renderHeight;
        ref.width = this.width * renderWidth;
        ref.height = this.height * renderHeight;
        return this;
    };
    /**
     * Returns a new Viewport copied from the current one
     * @returns a new Viewport
     */
    Viewport.prototype.clone = function () {
        return new Viewport(this.x, this.y, this.width, this.height);
    };
    return Viewport;
}());

/**
 * Represents a camera frustum
 */
var Frustum = /** @class */ (function () {
    function Frustum() {
    }
    /**
     * Gets the planes representing the frustum
     * @param transform matrix to be applied to the returned planes
     * @returns a new array of 6 Frustum planes computed by the given transformation matrix.
     */
    Frustum.GetPlanes = function (transform) {
        var frustumPlanes = [];
        for (var index = 0; index < 6; index++) {
            frustumPlanes.push(new Plane(0.0, 0.0, 0.0, 0.0));
        }
        Frustum.GetPlanesToRef(transform, frustumPlanes);
        return frustumPlanes;
    };
    /**
     * Gets the near frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetNearPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] + m[2];
        frustumPlane.normal.y = m[7] + m[6];
        frustumPlane.normal.z = m[11] + m[10];
        frustumPlane.d = m[15] + m[14];
        frustumPlane.normalize();
    };
    /**
     * Gets the far frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetFarPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] - m[2];
        frustumPlane.normal.y = m[7] - m[6];
        frustumPlane.normal.z = m[11] - m[10];
        frustumPlane.d = m[15] - m[14];
        frustumPlane.normalize();
    };
    /**
     * Gets the left frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetLeftPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] + m[0];
        frustumPlane.normal.y = m[7] + m[4];
        frustumPlane.normal.z = m[11] + m[8];
        frustumPlane.d = m[15] + m[12];
        frustumPlane.normalize();
    };
    /**
     * Gets the right frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetRightPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] - m[0];
        frustumPlane.normal.y = m[7] - m[4];
        frustumPlane.normal.z = m[11] - m[8];
        frustumPlane.d = m[15] - m[12];
        frustumPlane.normalize();
    };
    /**
     * Gets the top frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetTopPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] - m[1];
        frustumPlane.normal.y = m[7] - m[5];
        frustumPlane.normal.z = m[11] - m[9];
        frustumPlane.d = m[15] - m[13];
        frustumPlane.normalize();
    };
    /**
     * Gets the bottom frustum plane transformed by the transform matrix
     * @param transform transformation matrix to be applied to the resulting frustum plane
     * @param frustumPlane the resuling frustum plane
     */
    Frustum.GetBottomPlaneToRef = function (transform, frustumPlane) {
        var m = transform.m;
        frustumPlane.normal.x = m[3] + m[1];
        frustumPlane.normal.y = m[7] + m[5];
        frustumPlane.normal.z = m[11] + m[9];
        frustumPlane.d = m[15] + m[13];
        frustumPlane.normalize();
    };
    /**
     * Sets the given array "frustumPlanes" with the 6 Frustum planes computed by the given transformation matrix.
     * @param transform transformation matrix to be applied to the resulting frustum planes
     * @param frustumPlanes the resuling frustum planes
     */
    Frustum.GetPlanesToRef = function (transform, frustumPlanes) {
        // Near
        Frustum.GetNearPlaneToRef(transform, frustumPlanes[0]);
        // Far
        Frustum.GetFarPlaneToRef(transform, frustumPlanes[1]);
        // Left
        Frustum.GetLeftPlaneToRef(transform, frustumPlanes[2]);
        // Right
        Frustum.GetRightPlaneToRef(transform, frustumPlanes[3]);
        // Top
        Frustum.GetTopPlaneToRef(transform, frustumPlanes[4]);
        // Bottom
        Frustum.GetBottomPlaneToRef(transform, frustumPlanes[5]);
    };
    return Frustum;
}());

export { Frustum as F, Viewport as V };
