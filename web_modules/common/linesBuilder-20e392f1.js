import { _ as __extends, L as Logger, f as Effect } from './thinEngine-e576a091.js';
import { T as TmpVectors, M as Matrix, V as Vector3, b as Color3, C as Color4 } from './math.color-fc6e801e.js';
import { D as DeepCopier, T as Tools } from './tools-ab6f1dea.js';
import { b as VertexData, V as VertexBuffer, B as BoundingInfo, T as TransformNode, A as AbstractMesh, M as Material } from './sceneComponent-5502b64a.js';
import { M as Mesh, _ as _CreationDataStorage } from './mesh-cfdd36e7.js';
import { P as Path3D } from './math.path-c216bc6f.js';
import { M as MaterialHelper } from './bonesVertex-5b94878d.js';
import { S as ShaderMaterial } from './shaderMaterial-58d230f5.js';
import './clipPlaneVertex-e6809877.js';

VertexData.CreateRibbon = function (options) {
    var pathArray = options.pathArray;
    var closeArray = options.closeArray || false;
    var closePath = options.closePath || false;
    var invertUV = options.invertUV || false;
    var defaultOffset = Math.floor(pathArray[0].length / 2);
    var offset = options.offset || defaultOffset;
    offset = offset > defaultOffset ? defaultOffset : Math.floor(offset); // offset max allowed : defaultOffset
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    var customUV = options.uvs;
    var customColors = options.colors;
    var positions = [];
    var indices = [];
    var normals = [];
    var uvs = [];
    var us = []; // us[path_id] = [uDist1, uDist2, uDist3 ... ] distances between points on path path_id
    var vs = []; // vs[i] = [vDist1, vDist2, vDist3, ... ] distances between points i of consecutives paths from pathArray
    var uTotalDistance = []; // uTotalDistance[p] : total distance of path p
    var vTotalDistance = []; //  vTotalDistance[i] : total distance between points i of first and last path from pathArray
    var minlg; // minimal length among all paths from pathArray
    var lg = []; // array of path lengths : nb of vertex per path
    var idx = []; // array of path indexes : index of each path (first vertex) in the total vertex number
    var p; // path iterator
    var i; // point iterator
    var j; // point iterator
    // if single path in pathArray
    if (pathArray.length < 2) {
        var ar1 = [];
        var ar2 = [];
        for (i = 0; i < pathArray[0].length - offset; i++) {
            ar1.push(pathArray[0][i]);
            ar2.push(pathArray[0][i + offset]);
        }
        pathArray = [ar1, ar2];
    }
    // positions and horizontal distances (u)
    var idc = 0;
    var closePathCorr = (closePath) ? 1 : 0; // the final index will be +1 if closePath
    var path;
    var l;
    minlg = pathArray[0].length;
    var vectlg;
    var dist;
    for (p = 0; p < pathArray.length; p++) {
        uTotalDistance[p] = 0;
        us[p] = [0];
        path = pathArray[p];
        l = path.length;
        minlg = (minlg < l) ? minlg : l;
        j = 0;
        while (j < l) {
            positions.push(path[j].x, path[j].y, path[j].z);
            if (j > 0) {
                vectlg = path[j].subtract(path[j - 1]).length();
                dist = vectlg + uTotalDistance[p];
                us[p].push(dist);
                uTotalDistance[p] = dist;
            }
            j++;
        }
        if (closePath) { // an extra hidden vertex is added in the "positions" array
            j--;
            positions.push(path[0].x, path[0].y, path[0].z);
            vectlg = path[j].subtract(path[0]).length();
            dist = vectlg + uTotalDistance[p];
            us[p].push(dist);
            uTotalDistance[p] = dist;
        }
        lg[p] = l + closePathCorr;
        idx[p] = idc;
        idc += (l + closePathCorr);
    }
    // vertical distances (v)
    var path1;
    var path2;
    var vertex1 = null;
    var vertex2 = null;
    for (i = 0; i < minlg + closePathCorr; i++) {
        vTotalDistance[i] = 0;
        vs[i] = [0];
        for (p = 0; p < pathArray.length - 1; p++) {
            path1 = pathArray[p];
            path2 = pathArray[p + 1];
            if (i === minlg) { // closePath
                vertex1 = path1[0];
                vertex2 = path2[0];
            }
            else {
                vertex1 = path1[i];
                vertex2 = path2[i];
            }
            vectlg = vertex2.subtract(vertex1).length();
            dist = vectlg + vTotalDistance[i];
            vs[i].push(dist);
            vTotalDistance[i] = dist;
        }
        if (closeArray && vertex2 && vertex1) {
            path1 = pathArray[p];
            path2 = pathArray[0];
            if (i === minlg) { // closePath
                vertex2 = path2[0];
            }
            vectlg = vertex2.subtract(vertex1).length();
            dist = vectlg + vTotalDistance[i];
            vTotalDistance[i] = dist;
        }
    }
    // uvs
    var u;
    var v;
    if (customUV) {
        for (p = 0; p < customUV.length; p++) {
            uvs.push(customUV[p].x, customUV[p].y);
        }
    }
    else {
        for (p = 0; p < pathArray.length; p++) {
            for (i = 0; i < minlg + closePathCorr; i++) {
                u = (uTotalDistance[p] != 0.0) ? us[p][i] / uTotalDistance[p] : 0.0;
                v = (vTotalDistance[i] != 0.0) ? vs[i][p] / vTotalDistance[i] : 0.0;
                if (invertUV) {
                    uvs.push(v, u);
                }
                else {
                    uvs.push(u, v);
                }
            }
        }
    }
    // indices
    p = 0; // path index
    var pi = 0; // positions array index
    var l1 = lg[p] - 1; // path1 length
    var l2 = lg[p + 1] - 1; // path2 length
    var min = (l1 < l2) ? l1 : l2; // current path stop index
    var shft = idx[1] - idx[0]; // shift
    var path1nb = closeArray ? lg.length : lg.length - 1; // number of path1 to iterate	on
    while (pi <= min && p < path1nb) { //  stay under min and don't go over next to last path
        // draw two triangles between path1 (p1) and path2 (p2) : (p1.pi, p2.pi, p1.pi+1) and (p2.pi+1, p1.pi+1, p2.pi) clockwise
        indices.push(pi, pi + shft, pi + 1);
        indices.push(pi + shft + 1, pi + 1, pi + shft);
        pi += 1;
        if (pi === min) { // if end of one of two consecutive paths reached, go to next existing path
            p++;
            if (p === lg.length - 1) { // last path of pathArray reached <=> closeArray == true
                shft = idx[0] - idx[p];
                l1 = lg[p] - 1;
                l2 = lg[0] - 1;
            }
            else {
                shft = idx[p + 1] - idx[p];
                l1 = lg[p] - 1;
                l2 = lg[p + 1] - 1;
            }
            pi = idx[p];
            min = (l1 < l2) ? l1 + pi : l2 + pi;
        }
    }
    // normals
    VertexData.ComputeNormals(positions, indices, normals);
    if (closePath) { // update both the first and last vertex normals to their average value
        var indexFirst = 0;
        var indexLast = 0;
        for (p = 0; p < pathArray.length; p++) {
            indexFirst = idx[p] * 3;
            if (p + 1 < pathArray.length) {
                indexLast = (idx[p + 1] - 1) * 3;
            }
            else {
                indexLast = normals.length - 3;
            }
            normals[indexFirst] = (normals[indexFirst] + normals[indexLast]) * 0.5;
            normals[indexFirst + 1] = (normals[indexFirst + 1] + normals[indexLast + 1]) * 0.5;
            normals[indexFirst + 2] = (normals[indexFirst + 2] + normals[indexLast + 2]) * 0.5;
            normals[indexLast] = normals[indexFirst];
            normals[indexLast + 1] = normals[indexFirst + 1];
            normals[indexLast + 2] = normals[indexFirst + 2];
        }
    }
    // sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    // Colors
    var colors = null;
    if (customColors) {
        colors = new Float32Array(customColors.length * 4);
        for (var c = 0; c < customColors.length; c++) {
            colors[c * 4] = customColors[c].r;
            colors[c * 4 + 1] = customColors[c].g;
            colors[c * 4 + 2] = customColors[c].b;
            colors[c * 4 + 3] = customColors[c].a;
        }
    }
    // Result
    var vertexData = new VertexData();
    var positions32 = new Float32Array(positions);
    var normals32 = new Float32Array(normals);
    var uvs32 = new Float32Array(uvs);
    vertexData.indices = indices;
    vertexData.positions = positions32;
    vertexData.normals = normals32;
    vertexData.uvs = uvs32;
    if (colors) {
        vertexData.set(colors, VertexBuffer.ColorKind);
    }
    if (closePath) {
        vertexData._idx = idx;
    }
    return vertexData;
};
Mesh.CreateRibbon = function (name, pathArray, closeArray, closePath, offset, scene, updatable, sideOrientation, instance) {
    if (closeArray === void 0) { closeArray = false; }
    if (updatable === void 0) { updatable = false; }
    return RibbonBuilder.CreateRibbon(name, {
        pathArray: pathArray,
        closeArray: closeArray,
        closePath: closePath,
        offset: offset,
        updatable: updatable,
        sideOrientation: sideOrientation,
        instance: instance
    }, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var RibbonBuilder = /** @class */ (function () {
    function RibbonBuilder() {
    }
    /**
     * Creates a ribbon mesh. The ribbon is a parametric shape.  It has no predefined shape. Its final shape will depend on the input parameters
     * * The parameter `pathArray` is a required array of paths, what are each an array of successive Vector3. The pathArray parameter depicts the ribbon geometry
     * * The parameter `closeArray` (boolean, default false) creates a seam between the first and the last paths of the path array
     * * The parameter `closePath` (boolean, default false) creates a seam between the first and the last points of each path of the path array
     * * The parameter `offset` (positive integer, default : rounded half size of the pathArray length), is taken in account only if the `pathArray` is containing a single path
     * * It's the offset to join the points from the same path. Ex : offset = 10 means the point 1 is joined to the point 11
     * * The optional parameter `instance` is an instance of an existing Ribbon object to be updated with the passed `pathArray` parameter : https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#ribbon
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The optional parameter `invertUV` (boolean, default false) swaps in the geometry the U and V coordinates to apply a texture
     * * The parameter `uvs` is an optional flat array of `Vector2` to update/set each ribbon vertex with its own custom UV values instead of the computed ones
     * * The parameters `colors` is an optional flat array of `Color4` to set/update each ribbon vertex with its own custom color values
     * * Note that if you use the parameters `uvs` or `colors`, the passed arrays must be populated with the right number of elements, it is to say the number of ribbon vertices. Remember that if you set `closePath` to `true`, there's one extra vertex per path in the geometry
     * * Moreover, you can use the parameter `color` with `instance` (to update the ribbon), only if you previously used it at creation time
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the ribbon mesh
     * @see https://doc.babylonjs.com/how_to/ribbon_tutorial
     * @see https://doc.babylonjs.com/how_to/parametric_shapes
     */
    RibbonBuilder.CreateRibbon = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var pathArray = options.pathArray;
        var closeArray = options.closeArray;
        var closePath = options.closePath;
        var sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        var instance = options.instance;
        var updatable = options.updatable;
        if (instance) { // existing ribbon instance update
            // positionFunction : ribbon case
            // only pathArray and sideOrientation parameters are taken into account for positions update
            var minimum_1 = TmpVectors.Vector3[0].setAll(Number.MAX_VALUE);
            var maximum_1 = TmpVectors.Vector3[1].setAll(-Number.MAX_VALUE);
            var positionFunction = function (positions) {
                var minlg = pathArray[0].length;
                var mesh = instance;
                var i = 0;
                var ns = (mesh._originalBuilderSideOrientation === Mesh.DOUBLESIDE) ? 2 : 1;
                for (var si = 1; si <= ns; ++si) {
                    for (var p = 0; p < pathArray.length; ++p) {
                        var path = pathArray[p];
                        var l = path.length;
                        minlg = (minlg < l) ? minlg : l;
                        for (var j = 0; j < minlg; ++j) {
                            var pathPoint = path[j];
                            positions[i] = pathPoint.x;
                            positions[i + 1] = pathPoint.y;
                            positions[i + 2] = pathPoint.z;
                            minimum_1.minimizeInPlaceFromFloats(pathPoint.x, pathPoint.y, pathPoint.z);
                            maximum_1.maximizeInPlaceFromFloats(pathPoint.x, pathPoint.y, pathPoint.z);
                            i += 3;
                        }
                        if (mesh._creationDataStorage && mesh._creationDataStorage.closePath) {
                            var pathPoint = path[0];
                            positions[i] = pathPoint.x;
                            positions[i + 1] = pathPoint.y;
                            positions[i + 2] = pathPoint.z;
                            i += 3;
                        }
                    }
                }
            };
            var positions = instance.getVerticesData(VertexBuffer.PositionKind);
            positionFunction(positions);
            if (instance._boundingInfo) {
                instance._boundingInfo.reConstruct(minimum_1, maximum_1, instance._worldMatrix);
            }
            else {
                instance._boundingInfo = new BoundingInfo(minimum_1, maximum_1, instance._worldMatrix);
            }
            instance.updateVerticesData(VertexBuffer.PositionKind, positions, false, false);
            if (options.colors) {
                var colors = instance.getVerticesData(VertexBuffer.ColorKind);
                for (var c = 0, colorIndex = 0; c < options.colors.length; c++, colorIndex += 4) {
                    var color = options.colors[c];
                    colors[colorIndex] = color.r;
                    colors[colorIndex + 1] = color.g;
                    colors[colorIndex + 2] = color.b;
                    colors[colorIndex + 3] = color.a;
                }
                instance.updateVerticesData(VertexBuffer.ColorKind, colors, false, false);
            }
            if (options.uvs) {
                var uvs = instance.getVerticesData(VertexBuffer.UVKind);
                for (var i = 0; i < options.uvs.length; i++) {
                    uvs[i * 2] = options.uvs[i].x;
                    uvs[i * 2 + 1] = options.uvs[i].y;
                }
                instance.updateVerticesData(VertexBuffer.UVKind, uvs, false, false);
            }
            if (!instance.areNormalsFrozen || instance.isFacetDataEnabled) {
                var indices = instance.getIndices();
                var normals = instance.getVerticesData(VertexBuffer.NormalKind);
                var params = instance.isFacetDataEnabled ? instance.getFacetDataParameters() : null;
                VertexData.ComputeNormals(positions, indices, normals, params);
                if (instance._creationDataStorage && instance._creationDataStorage.closePath) {
                    var indexFirst = 0;
                    var indexLast = 0;
                    for (var p = 0; p < pathArray.length; p++) {
                        indexFirst = instance._creationDataStorage.idx[p] * 3;
                        if (p + 1 < pathArray.length) {
                            indexLast = (instance._creationDataStorage.idx[p + 1] - 1) * 3;
                        }
                        else {
                            indexLast = normals.length - 3;
                        }
                        normals[indexFirst] = (normals[indexFirst] + normals[indexLast]) * 0.5;
                        normals[indexFirst + 1] = (normals[indexFirst + 1] + normals[indexLast + 1]) * 0.5;
                        normals[indexFirst + 2] = (normals[indexFirst + 2] + normals[indexLast + 2]) * 0.5;
                        normals[indexLast] = normals[indexFirst];
                        normals[indexLast + 1] = normals[indexFirst + 1];
                        normals[indexLast + 2] = normals[indexFirst + 2];
                    }
                }
                if (!(instance.areNormalsFrozen)) {
                    instance.updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
                }
            }
            return instance;
        }
        else { // new ribbon creation
            var ribbon = new Mesh(name, scene);
            ribbon._originalBuilderSideOrientation = sideOrientation;
            ribbon._creationDataStorage = new _CreationDataStorage();
            var vertexData = VertexData.CreateRibbon(options);
            if (closePath) {
                ribbon._creationDataStorage.idx = vertexData._idx;
            }
            ribbon._creationDataStorage.closePath = closePath;
            ribbon._creationDataStorage.closeArray = closeArray;
            vertexData.applyToMesh(ribbon, updatable);
            return ribbon;
        }
    };
    return RibbonBuilder;
}());

Mesh.ExtrudeShape = function (name, shape, path, scale, rotation, cap, scene, updatable, sideOrientation, instance) {
    if (scene === void 0) { scene = null; }
    var options = {
        shape: shape,
        path: path,
        scale: scale,
        rotation: rotation,
        cap: (cap === 0) ? 0 : cap || Mesh.NO_CAP,
        sideOrientation: sideOrientation,
        instance: instance,
        updatable: updatable
    };
    return ShapeBuilder.ExtrudeShape(name, options, scene);
};
Mesh.ExtrudeShapeCustom = function (name, shape, path, scaleFunction, rotationFunction, ribbonCloseArray, ribbonClosePath, cap, scene, updatable, sideOrientation, instance) {
    var options = {
        shape: shape,
        path: path,
        scaleFunction: scaleFunction,
        rotationFunction: rotationFunction,
        ribbonCloseArray: ribbonCloseArray,
        ribbonClosePath: ribbonClosePath,
        cap: (cap === 0) ? 0 : cap || Mesh.NO_CAP,
        sideOrientation: sideOrientation,
        instance: instance,
        updatable: updatable
    };
    return ShapeBuilder.ExtrudeShapeCustom(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var ShapeBuilder = /** @class */ (function () {
    function ShapeBuilder() {
    }
    /**
     * Creates an extruded shape mesh. The extrusion is a parametric shape. It has no predefined shape. Its final shape will depend on the input parameters.
     * * The parameter `shape` is a required array of successive Vector3. This array depicts the shape to be extruded in its local space : the shape must be designed in the xOy plane and will be extruded along the Z axis.
     * * The parameter `path` is a required array of successive Vector3. This is the axis curve the shape is extruded along.
     * * The parameter `rotation` (float, default 0 radians) is the angle value to rotate the shape each step (each path point), from the former step (so rotation added each step) along the curve.
     * * The parameter `scale` (float, default 1) is the value to scale the shape.
     * * The parameter `cap` sets the way the extruded shape is capped. Possible values : BABYLON.Mesh.NO_CAP (default), BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL
     * * The optional parameter `instance` is an instance of an existing ExtrudedShape object to be updated with the passed `shape`, `path`, `scale` or `rotation` parameters : https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#extruded-shape
     * * Remember you can only change the shape or path point positions, not their number when updating an extruded shape.
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The optional parameter `invertUV` (boolean, default false) swaps in the geometry the U and V coordinates to apply a texture.
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the extruded shape mesh
     * @see https://doc.babylonjs.com/how_to/parametric_shapes
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#extruded-shapes
     */
    ShapeBuilder.ExtrudeShape = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var path = options.path;
        var shape = options.shape;
        var scale = options.scale || 1;
        var rotation = options.rotation || 0;
        var cap = (options.cap === 0) ? 0 : options.cap || Mesh.NO_CAP;
        var updatable = options.updatable;
        var sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        var instance = options.instance || null;
        var invertUV = options.invertUV || false;
        return ShapeBuilder._ExtrudeShapeGeneric(name, shape, path, scale, rotation, null, null, false, false, cap, false, scene, updatable ? true : false, sideOrientation, instance, invertUV, options.frontUVs || null, options.backUVs || null);
    };
    /**
     * Creates an custom extruded shape mesh.
     * The custom extrusion is a parametric shape. It has no predefined shape. Its final shape will depend on the input parameters.
     * * The parameter `shape` is a required array of successive Vector3. This array depicts the shape to be extruded in its local space : the shape must be designed in the xOy plane and will be extruded along the Z axis.
     * * The parameter `path` is a required array of successive Vector3. This is the axis curve the shape is extruded along.
     * * The parameter `rotationFunction` (JS function) is a custom Javascript function called on each path point. This function is passed the position i of the point in the path and the distance of this point from the begining of the path
     * * It must returns a float value that will be the rotation in radians applied to the shape on each path point.
     * * The parameter `scaleFunction` (JS function) is a custom Javascript function called on each path point. This function is passed the position i of the point in the path and the distance of this point from the begining of the path
     * * It must returns a float value that will be the scale value applied to the shape on each path point
     * * The parameter `ribbonClosePath` (boolean, default false) forces the extrusion underlying ribbon to close all the paths in its `pathArray`
     * * The parameter `ribbonCloseArray` (boolean, default false) forces the extrusion underlying ribbon to close its `pathArray`
     * * The parameter `cap` sets the way the extruded shape is capped. Possible values : BABYLON.Mesh.NO_CAP (default), BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL
     * * The optional parameter `instance` is an instance of an existing ExtrudedShape object to be updated with the passed `shape`, `path`, `scale` or `rotation` parameters : https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#extruded-shape
     * * Remember you can only change the shape or path point positions, not their number when updating an extruded shape
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The optional parameter `invertUV` (boolean, default false) swaps in the geometry the U and V coordinates to apply a texture
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the custom extruded shape mesh
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#custom-extruded-shapes
     * @see https://doc.babylonjs.com/how_to/parametric_shapes
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#extruded-shapes
     */
    ShapeBuilder.ExtrudeShapeCustom = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var path = options.path;
        var shape = options.shape;
        var scaleFunction = options.scaleFunction || (function () { return 1; });
        var rotationFunction = options.rotationFunction || (function () { return 0; });
        var ribbonCloseArray = options.ribbonCloseArray || false;
        var ribbonClosePath = options.ribbonClosePath || false;
        var cap = (options.cap === 0) ? 0 : options.cap || Mesh.NO_CAP;
        var updatable = options.updatable;
        var sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        var instance = options.instance;
        var invertUV = options.invertUV || false;
        return ShapeBuilder._ExtrudeShapeGeneric(name, shape, path, null, null, scaleFunction, rotationFunction, ribbonCloseArray, ribbonClosePath, cap, true, scene, updatable ? true : false, sideOrientation, instance || null, invertUV, options.frontUVs || null, options.backUVs || null);
    };
    ShapeBuilder._ExtrudeShapeGeneric = function (name, shape, curve, scale, rotation, scaleFunction, rotateFunction, rbCA, rbCP, cap, custom, scene, updtbl, side, instance, invertUV, frontUVs, backUVs) {
        // extrusion geometry
        var extrusionPathArray = function (shape, curve, path3D, shapePaths, scale, rotation, scaleFunction, rotateFunction, cap, custom) {
            var tangents = path3D.getTangents();
            var normals = path3D.getNormals();
            var binormals = path3D.getBinormals();
            var distances = path3D.getDistances();
            var angle = 0;
            var returnScale = function () { return scale !== null ? scale : 1; };
            var returnRotation = function () { return rotation !== null ? rotation : 0; };
            var rotate = custom && rotateFunction ? rotateFunction : returnRotation;
            var scl = custom && scaleFunction ? scaleFunction : returnScale;
            var index = (cap === Mesh.NO_CAP || cap === Mesh.CAP_END) ? 0 : 2;
            var rotationMatrix = TmpVectors.Matrix[0];
            for (var i = 0; i < curve.length; i++) {
                var shapePath = new Array();
                var angleStep = rotate(i, distances[i]);
                var scaleRatio = scl(i, distances[i]);
                for (var p = 0; p < shape.length; p++) {
                    Matrix.RotationAxisToRef(tangents[i], angle, rotationMatrix);
                    var planed = ((tangents[i].scale(shape[p].z)).add(normals[i].scale(shape[p].x)).add(binormals[i].scale(shape[p].y)));
                    var rotated = shapePath[p] ? shapePath[p] : Vector3.Zero();
                    Vector3.TransformCoordinatesToRef(planed, rotationMatrix, rotated);
                    rotated.scaleInPlace(scaleRatio).addInPlace(curve[i]);
                    shapePath[p] = rotated;
                }
                shapePaths[index] = shapePath;
                angle += angleStep;
                index++;
            }
            // cap
            var capPath = function (shapePath) {
                var pointCap = Array();
                var barycenter = Vector3.Zero();
                var i;
                for (i = 0; i < shapePath.length; i++) {
                    barycenter.addInPlace(shapePath[i]);
                }
                barycenter.scaleInPlace(1.0 / shapePath.length);
                for (i = 0; i < shapePath.length; i++) {
                    pointCap.push(barycenter);
                }
                return pointCap;
            };
            switch (cap) {
                case Mesh.NO_CAP:
                    break;
                case Mesh.CAP_START:
                    shapePaths[0] = capPath(shapePaths[2]);
                    shapePaths[1] = shapePaths[2];
                    break;
                case Mesh.CAP_END:
                    shapePaths[index] = shapePaths[index - 1];
                    shapePaths[index + 1] = capPath(shapePaths[index - 1]);
                    break;
                case Mesh.CAP_ALL:
                    shapePaths[0] = capPath(shapePaths[2]);
                    shapePaths[1] = shapePaths[2];
                    shapePaths[index] = shapePaths[index - 1];
                    shapePaths[index + 1] = capPath(shapePaths[index - 1]);
                    break;
            }
            return shapePaths;
        };
        var path3D;
        var pathArray;
        if (instance) { // instance update
            var storage = instance._creationDataStorage;
            path3D = storage.path3D.update(curve);
            pathArray = extrusionPathArray(shape, curve, storage.path3D, storage.pathArray, scale, rotation, scaleFunction, rotateFunction, storage.cap, custom);
            instance = Mesh.CreateRibbon("", pathArray, false, false, 0, scene || undefined, false, 0, instance);
            return instance;
        }
        // extruded shape creation
        path3D = new Path3D(curve);
        var newShapePaths = new Array();
        cap = (cap < 0 || cap > 3) ? 0 : cap;
        pathArray = extrusionPathArray(shape, curve, path3D, newShapePaths, scale, rotation, scaleFunction, rotateFunction, cap, custom);
        var extrudedGeneric = RibbonBuilder.CreateRibbon(name, { pathArray: pathArray, closeArray: rbCA, closePath: rbCP, updatable: updtbl, sideOrientation: side, invertUV: invertUV, frontUVs: frontUVs || undefined, backUVs: backUVs || undefined }, scene);
        extrudedGeneric._creationDataStorage.pathArray = pathArray;
        extrudedGeneric._creationDataStorage.path3D = path3D;
        extrudedGeneric._creationDataStorage.cap = cap;
        return extrudedGeneric;
    };
    return ShapeBuilder;
}());

Mesh._instancedMeshFactory = function (name, mesh) {
    var instance = new InstancedMesh(name, mesh);
    if (mesh.instancedBuffers) {
        instance.instancedBuffers = {};
        for (var key in mesh.instancedBuffers) {
            instance.instancedBuffers[key] = mesh.instancedBuffers[key];
        }
    }
    return instance;
};
/**
 * Creates an instance based on a source mesh.
 */
var InstancedMesh = /** @class */ (function (_super) {
    __extends(InstancedMesh, _super);
    function InstancedMesh(name, source) {
        var _this = _super.call(this, name, source.getScene()) || this;
        /** @hidden */
        _this._indexInSourceMeshInstanceArray = -1;
        source.addInstance(_this);
        _this._sourceMesh = source;
        _this._unIndexed = source._unIndexed;
        _this.position.copyFrom(source.position);
        _this.rotation.copyFrom(source.rotation);
        _this.scaling.copyFrom(source.scaling);
        if (source.rotationQuaternion) {
            _this.rotationQuaternion = source.rotationQuaternion.clone();
        }
        _this.animations = Tools.Slice(source.animations);
        for (var _i = 0, _a = source.getAnimationRanges(); _i < _a.length; _i++) {
            var range = _a[_i];
            if (range != null) {
                _this.createAnimationRange(range.name, range.from, range.to);
            }
        }
        _this.infiniteDistance = source.infiniteDistance;
        _this.setPivotMatrix(source.getPivotMatrix());
        _this.refreshBoundingInfo();
        _this._syncSubMeshes();
        return _this;
    }
    /**
     * Returns the string "InstancedMesh".
     */
    InstancedMesh.prototype.getClassName = function () {
        return "InstancedMesh";
    };
    Object.defineProperty(InstancedMesh.prototype, "lightSources", {
        /** Gets the list of lights affecting that mesh */
        get: function () {
            return this._sourceMesh._lightSources;
        },
        enumerable: false,
        configurable: true
    });
    InstancedMesh.prototype._resyncLightSources = function () {
        // Do nothing as all the work will be done by source mesh
    };
    InstancedMesh.prototype._resyncLightSource = function (light) {
        // Do nothing as all the work will be done by source mesh
    };
    InstancedMesh.prototype._removeLightSource = function (light, dispose) {
        // Do nothing as all the work will be done by source mesh
    };
    Object.defineProperty(InstancedMesh.prototype, "receiveShadows", {
        // Methods
        /**
         * If the source mesh receives shadows
         */
        get: function () {
            return this._sourceMesh.receiveShadows;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InstancedMesh.prototype, "material", {
        /**
         * The material of the source mesh
         */
        get: function () {
            return this._sourceMesh.material;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InstancedMesh.prototype, "visibility", {
        /**
         * Visibility of the source mesh
         */
        get: function () {
            return this._sourceMesh.visibility;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InstancedMesh.prototype, "skeleton", {
        /**
         * Skeleton of the source mesh
         */
        get: function () {
            return this._sourceMesh.skeleton;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InstancedMesh.prototype, "renderingGroupId", {
        /**
         * Rendering ground id of the source mesh
         */
        get: function () {
            return this._sourceMesh.renderingGroupId;
        },
        set: function (value) {
            if (!this._sourceMesh || value === this._sourceMesh.renderingGroupId) {
                return;
            }
            //no-op with warning
            Logger.Warn("Note - setting renderingGroupId of an instanced mesh has no effect on the scene");
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the total number of vertices (integer).
     */
    InstancedMesh.prototype.getTotalVertices = function () {
        return this._sourceMesh ? this._sourceMesh.getTotalVertices() : 0;
    };
    /**
     * Returns a positive integer : the total number of indices in this mesh geometry.
     * @returns the numner of indices or zero if the mesh has no geometry.
     */
    InstancedMesh.prototype.getTotalIndices = function () {
        return this._sourceMesh.getTotalIndices();
    };
    Object.defineProperty(InstancedMesh.prototype, "sourceMesh", {
        /**
         * The source mesh of the instance
         */
        get: function () {
            return this._sourceMesh;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Creates a new InstancedMesh object from the mesh model.
     * @see https://doc.babylonjs.com/how_to/how_to_use_instances
     * @param name defines the name of the new instance
     * @returns a new InstancedMesh
     */
    InstancedMesh.prototype.createInstance = function (name) {
        return this._sourceMesh.createInstance(name);
    };
    /**
     * Is this node ready to be used/rendered
     * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
     * @return {boolean} is it ready
     */
    InstancedMesh.prototype.isReady = function (completeCheck) {
        if (completeCheck === void 0) { completeCheck = false; }
        return this._sourceMesh.isReady(completeCheck, true);
    };
    /**
     * Returns an array of integers or a typed array (Int32Array, Uint32Array, Uint16Array) populated with the mesh indices.
     * @param kind kind of verticies to retreive (eg. positons, normals, uvs, etc.)
     * @param copyWhenShared If true (default false) and and if the mesh geometry is shared among some other meshes, the returned array is a copy of the internal one.
     * @returns a float array or a Float32Array of the requested kind of data : positons, normals, uvs, etc.
     */
    InstancedMesh.prototype.getVerticesData = function (kind, copyWhenShared) {
        return this._sourceMesh.getVerticesData(kind, copyWhenShared);
    };
    /**
     * Sets the vertex data of the mesh geometry for the requested `kind`.
     * If the mesh has no geometry, a new Geometry object is set to the mesh and then passed this vertex data.
     * The `data` are either a numeric array either a Float32Array.
     * The parameter `updatable` is passed as is to the underlying Geometry object constructor (if initianilly none) or updater.
     * The parameter `stride` is an optional positive integer, it is usually automatically deducted from the `kind` (3 for positions or normals, 2 for UV, etc).
     * Note that a new underlying VertexBuffer object is created each call.
     * If the `kind` is the `PositionKind`, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed.
     *
     * Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     *
     * Returns the Mesh.
     */
    InstancedMesh.prototype.setVerticesData = function (kind, data, updatable, stride) {
        if (this.sourceMesh) {
            this.sourceMesh.setVerticesData(kind, data, updatable, stride);
        }
        return this.sourceMesh;
    };
    /**
     * Updates the existing vertex data of the mesh geometry for the requested `kind`.
     * If the mesh has no geometry, it is simply returned as it is.
     * The `data` are either a numeric array either a Float32Array.
     * No new underlying VertexBuffer object is created.
     * If the `kind` is the `PositionKind` and if `updateExtends` is true, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed.
     * If the parameter `makeItUnique` is true, a new global geometry is created from this positions and is set to the mesh.
     *
     * Possible `kind` values :
     * - VertexBuffer.PositionKind
     * - VertexBuffer.UVKind
     * - VertexBuffer.UV2Kind
     * - VertexBuffer.UV3Kind
     * - VertexBuffer.UV4Kind
     * - VertexBuffer.UV5Kind
     * - VertexBuffer.UV6Kind
     * - VertexBuffer.ColorKind
     * - VertexBuffer.MatricesIndicesKind
     * - VertexBuffer.MatricesIndicesExtraKind
     * - VertexBuffer.MatricesWeightsKind
     * - VertexBuffer.MatricesWeightsExtraKind
     *
     * Returns the Mesh.
     */
    InstancedMesh.prototype.updateVerticesData = function (kind, data, updateExtends, makeItUnique) {
        if (this.sourceMesh) {
            this.sourceMesh.updateVerticesData(kind, data, updateExtends, makeItUnique);
        }
        return this.sourceMesh;
    };
    /**
     * Sets the mesh indices.
     * Expects an array populated with integers or a typed array (Int32Array, Uint32Array, Uint16Array).
     * If the mesh has no geometry, a new Geometry object is created and set to the mesh.
     * This method creates a new index buffer each call.
     * Returns the Mesh.
     */
    InstancedMesh.prototype.setIndices = function (indices, totalVertices) {
        if (totalVertices === void 0) { totalVertices = null; }
        if (this.sourceMesh) {
            this.sourceMesh.setIndices(indices, totalVertices);
        }
        return this.sourceMesh;
    };
    /**
     * Boolean : True if the mesh owns the requested kind of data.
     */
    InstancedMesh.prototype.isVerticesDataPresent = function (kind) {
        return this._sourceMesh.isVerticesDataPresent(kind);
    };
    /**
     * Returns an array of indices (IndicesArray).
     */
    InstancedMesh.prototype.getIndices = function () {
        return this._sourceMesh.getIndices();
    };
    Object.defineProperty(InstancedMesh.prototype, "_positions", {
        get: function () {
            return this._sourceMesh._positions;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * This method recomputes and sets a new BoundingInfo to the mesh unless it is locked.
     * This means the mesh underlying bounding box and sphere are recomputed.
     * @param applySkeleton defines whether to apply the skeleton before computing the bounding info
     * @returns the current mesh
     */
    InstancedMesh.prototype.refreshBoundingInfo = function (applySkeleton) {
        if (applySkeleton === void 0) { applySkeleton = false; }
        if (this._boundingInfo && this._boundingInfo.isLocked) {
            return this;
        }
        var bias = this._sourceMesh.geometry ? this._sourceMesh.geometry.boundingBias : null;
        this._refreshBoundingInfo(this._sourceMesh._getPositionData(applySkeleton), bias);
        return this;
    };
    /** @hidden */
    InstancedMesh.prototype._preActivate = function () {
        if (this._currentLOD) {
            this._currentLOD._preActivate();
        }
        return this;
    };
    /** @hidden */
    InstancedMesh.prototype._activate = function (renderId, intermediateRendering) {
        if (!this._sourceMesh.subMeshes) {
            Logger.Warn("Instances should only be created for meshes with geometry.");
        }
        if (this._currentLOD) {
            var differentSign = (this._currentLOD._getWorldMatrixDeterminant() > 0) !== (this._getWorldMatrixDeterminant() > 0);
            if (differentSign) {
                this._internalAbstractMeshDataInfo._actAsRegularMesh = true;
                return true;
            }
            this._internalAbstractMeshDataInfo._actAsRegularMesh = false;
            this._currentLOD._registerInstanceForRenderId(this, renderId);
            if (intermediateRendering) {
                if (!this._currentLOD._internalAbstractMeshDataInfo._isActiveIntermediate) {
                    this._currentLOD._internalAbstractMeshDataInfo._onlyForInstancesIntermediate = true;
                    return true;
                }
            }
            else {
                if (!this._currentLOD._internalAbstractMeshDataInfo._isActive) {
                    this._currentLOD._internalAbstractMeshDataInfo._onlyForInstances = true;
                    return true;
                }
            }
        }
        return false;
    };
    /** @hidden */
    InstancedMesh.prototype._postActivate = function () {
        if (this._sourceMesh.edgesShareWithInstances && this._sourceMesh._edgesRenderer && this._sourceMesh._edgesRenderer.isEnabled && this._sourceMesh._renderingGroup) {
            // we are using the edge renderer of the source mesh
            this._sourceMesh._renderingGroup._edgesRenderers.pushNoDuplicate(this._sourceMesh._edgesRenderer);
            this._sourceMesh._edgesRenderer.customInstances.push(this.getWorldMatrix());
        }
        else if (this._edgesRenderer && this._edgesRenderer.isEnabled && this._sourceMesh._renderingGroup) {
            // we are using the edge renderer defined for this instance
            this._sourceMesh._renderingGroup._edgesRenderers.push(this._edgesRenderer);
        }
    };
    InstancedMesh.prototype.getWorldMatrix = function () {
        if (this._currentLOD && this._currentLOD.billboardMode !== TransformNode.BILLBOARDMODE_NONE && this._currentLOD._masterMesh !== this) {
            var tempMaster = this._currentLOD._masterMesh;
            this._currentLOD._masterMesh = this;
            TmpVectors.Vector3[7].copyFrom(this._currentLOD.position);
            this._currentLOD.position.set(0, 0, 0);
            TmpVectors.Matrix[0].copyFrom(this._currentLOD.computeWorldMatrix(true));
            this._currentLOD.position.copyFrom(TmpVectors.Vector3[7]);
            this._currentLOD._masterMesh = tempMaster;
            return TmpVectors.Matrix[0];
        }
        return _super.prototype.getWorldMatrix.call(this);
    };
    Object.defineProperty(InstancedMesh.prototype, "isAnInstance", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the current associated LOD AbstractMesh.
     */
    InstancedMesh.prototype.getLOD = function (camera) {
        if (!camera) {
            return this;
        }
        var boundingInfo = this.getBoundingInfo();
        this._currentLOD = this.sourceMesh.getLOD(camera, boundingInfo.boundingSphere);
        if (this._currentLOD === this.sourceMesh) {
            return this.sourceMesh;
        }
        return this._currentLOD;
    };
    /** @hidden */
    InstancedMesh.prototype._preActivateForIntermediateRendering = function (renderId) {
        return this.sourceMesh._preActivateForIntermediateRendering(renderId);
    };
    /** @hidden */
    InstancedMesh.prototype._syncSubMeshes = function () {
        this.releaseSubMeshes();
        if (this._sourceMesh.subMeshes) {
            for (var index = 0; index < this._sourceMesh.subMeshes.length; index++) {
                this._sourceMesh.subMeshes[index].clone(this, this._sourceMesh);
            }
        }
        return this;
    };
    /** @hidden */
    InstancedMesh.prototype._generatePointsArray = function () {
        return this._sourceMesh._generatePointsArray();
    };
    /** @hidden */
    InstancedMesh.prototype._updateBoundingInfo = function () {
        var effectiveMesh = this;
        if (this._boundingInfo) {
            this._boundingInfo.update(effectiveMesh.worldMatrixFromCache);
        }
        else {
            this._boundingInfo = new BoundingInfo(this.absolutePosition, this.absolutePosition, effectiveMesh.worldMatrixFromCache);
        }
        this._updateSubMeshesBoundingInfo(effectiveMesh.worldMatrixFromCache);
        return this;
    };
    /**
     * Creates a new InstancedMesh from the current mesh.
     * - name (string) : the cloned mesh name
     * - newParent (optional Node) : the optional Node to parent the clone to.
     * - doNotCloneChildren (optional boolean, default `false`) : if `true` the model children aren't cloned.
     *
     * Returns the clone.
     */
    InstancedMesh.prototype.clone = function (name, newParent, doNotCloneChildren) {
        if (newParent === void 0) { newParent = null; }
        var result = this._sourceMesh.createInstance(name);
        // Deep copy
        DeepCopier.DeepCopy(this, result, [
            "name", "subMeshes", "uniqueId", "parent", "lightSources",
            "receiveShadows", "material", "visibility", "skeleton",
            "sourceMesh", "isAnInstance", "facetNb", "isFacetDataEnabled",
            "isBlocked", "useBones", "hasInstances", "collider", "edgesRenderer",
            "forward", "up", "right", "absolutePosition", "absoluteScaling", "absoluteRotationQuaternion",
            "isWorldMatrixFrozen", "nonUniformScaling", "behaviors", "worldMatrixFromCache", "hasThinInstances"
        ], []);
        // Bounding info
        this.refreshBoundingInfo();
        // Parent
        if (newParent) {
            result.parent = newParent;
        }
        if (!doNotCloneChildren) {
            // Children
            for (var index = 0; index < this.getScene().meshes.length; index++) {
                var mesh = this.getScene().meshes[index];
                if (mesh.parent === this) {
                    mesh.clone(mesh.name, result);
                }
            }
        }
        result.computeWorldMatrix(true);
        return result;
    };
    /**
     * Disposes the InstancedMesh.
     * Returns nothing.
     */
    InstancedMesh.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
        if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
        // Remove from mesh
        this._sourceMesh.removeInstance(this);
        _super.prototype.dispose.call(this, doNotRecurse, disposeMaterialAndTextures);
    };
    return InstancedMesh;
}(AbstractMesh));
Mesh.prototype.edgesShareWithInstances = false;
Mesh.prototype.registerInstancedBuffer = function (kind, stride) {
    // Remove existing one
    this.removeVerticesData(kind);
    // Creates the instancedBuffer field if not present
    if (!this.instancedBuffers) {
        this.instancedBuffers = {};
        for (var _i = 0, _a = this.instances; _i < _a.length; _i++) {
            var instance = _a[_i];
            instance.instancedBuffers = {};
        }
        this._userInstancedBuffersStorage = {
            data: {},
            vertexBuffers: {},
            strides: {},
            sizes: {}
        };
    }
    // Creates an empty property for this kind
    this.instancedBuffers[kind] = null;
    this._userInstancedBuffersStorage.strides[kind] = stride;
    this._userInstancedBuffersStorage.sizes[kind] = stride * 32; // Initial size
    this._userInstancedBuffersStorage.data[kind] = new Float32Array(this._userInstancedBuffersStorage.sizes[kind]);
    this._userInstancedBuffersStorage.vertexBuffers[kind] = new VertexBuffer(this.getEngine(), this._userInstancedBuffersStorage.data[kind], kind, true, false, stride, true);
    this.setVerticesBuffer(this._userInstancedBuffersStorage.vertexBuffers[kind]);
    for (var _b = 0, _c = this.instances; _b < _c.length; _b++) {
        var instance = _c[_b];
        instance.instancedBuffers[kind] = null;
    }
};
Mesh.prototype._processInstancedBuffers = function (visibleInstances, renderSelf) {
    var instanceCount = visibleInstances.length;
    for (var kind in this.instancedBuffers) {
        var size = this._userInstancedBuffersStorage.sizes[kind];
        var stride = this._userInstancedBuffersStorage.strides[kind];
        // Resize if required
        var expectedSize = (instanceCount + 1) * stride;
        while (size < expectedSize) {
            size *= 2;
        }
        if (this._userInstancedBuffersStorage.data[kind].length != size) {
            this._userInstancedBuffersStorage.data[kind] = new Float32Array(size);
            this._userInstancedBuffersStorage.sizes[kind] = size;
            if (this._userInstancedBuffersStorage.vertexBuffers[kind]) {
                this._userInstancedBuffersStorage.vertexBuffers[kind].dispose();
                this._userInstancedBuffersStorage.vertexBuffers[kind] = null;
            }
        }
        var data = this._userInstancedBuffersStorage.data[kind];
        // Update data buffer
        var offset = 0;
        if (renderSelf) {
            var value = this.instancedBuffers[kind];
            if (value.toArray) {
                value.toArray(data, offset);
            }
            else {
                value.copyToArray(data, offset);
            }
            offset += stride;
        }
        for (var instanceIndex = 0; instanceIndex < instanceCount; instanceIndex++) {
            var instance = visibleInstances[instanceIndex];
            var value = instance.instancedBuffers[kind];
            if (value.toArray) {
                value.toArray(data, offset);
            }
            else {
                value.copyToArray(data, offset);
            }
            offset += stride;
        }
        // Update vertex buffer
        if (!this._userInstancedBuffersStorage.vertexBuffers[kind]) {
            this._userInstancedBuffersStorage.vertexBuffers[kind] = new VertexBuffer(this.getEngine(), this._userInstancedBuffersStorage.data[kind], kind, true, false, stride, true);
            this.setVerticesBuffer(this._userInstancedBuffersStorage.vertexBuffers[kind]);
        }
        else {
            this._userInstancedBuffersStorage.vertexBuffers[kind].updateDirectly(data, 0);
        }
    }
};
Mesh.prototype._disposeInstanceSpecificData = function () {
    if (this._instanceDataStorage.instancesBuffer) {
        this._instanceDataStorage.instancesBuffer.dispose();
        this._instanceDataStorage.instancesBuffer = null;
    }
    while (this.instances.length) {
        this.instances[0].dispose();
    }
    for (var kind in this.instancedBuffers) {
        if (this._userInstancedBuffersStorage.vertexBuffers[kind]) {
            this._userInstancedBuffersStorage.vertexBuffers[kind].dispose();
        }
    }
    this.instancedBuffers = {};
};

var name = 'colorPixelShader';
var shader = "#ifdef VERTEXCOLOR\nvarying vec4 vColor;\n#else\nuniform vec4 color;\n#endif\n#include<clipPlaneFragmentDeclaration>\nvoid main(void) {\n#include<clipPlaneFragment>\n#ifdef VERTEXCOLOR\ngl_FragColor=vColor;\n#else\ngl_FragColor=color;\n#endif\n}";
Effect.ShadersStore[name] = shader;

var name$1 = 'colorVertexShader';
var shader$1 = "\nattribute vec3 position;\n#ifdef VERTEXCOLOR\nattribute vec4 color;\n#endif\n#include<bonesDeclaration>\n#include<clipPlaneVertexDeclaration>\n\n#include<instancesDeclaration>\nuniform mat4 viewProjection;\n#ifdef MULTIVIEW\nuniform mat4 viewProjectionR;\n#endif\n\n#ifdef VERTEXCOLOR\nvarying vec4 vColor;\n#endif\nvoid main(void) {\n#include<instancesVertex>\n#include<bonesVertex>\nvec4 worldPos=finalWorld*vec4(position,1.0);\n#ifdef MULTIVIEW\nif (gl_ViewID_OVR == 0u) {\ngl_Position=viewProjection*worldPos;\n} else {\ngl_Position=viewProjectionR*worldPos;\n}\n#else\ngl_Position=viewProjection*worldPos;\n#endif\n#include<clipPlaneVertex>\n#ifdef VERTEXCOLOR\n\nvColor=color;\n#endif\n}";
Effect.ShadersStore[name$1] = shader$1;

/**
 * Line mesh
 * @see https://doc.babylonjs.com/babylon101/parametric_shapes
 */
var LinesMesh = /** @class */ (function (_super) {
    __extends(LinesMesh, _super);
    /**
     * Creates a new LinesMesh
     * @param name defines the name
     * @param scene defines the hosting scene
     * @param parent defines the parent mesh if any
     * @param source defines the optional source LinesMesh used to clone data from
     * @param doNotCloneChildren When cloning, skip cloning child meshes of source, default False.
     * When false, achieved by calling a clone(), also passing False.
     * This will make creation of children, recursive.
     * @param useVertexColor defines if this LinesMesh supports vertex color
     * @param useVertexAlpha defines if this LinesMesh supports vertex alpha
     */
    function LinesMesh(name, scene, parent, source, doNotCloneChildren, 
    /**
     * If vertex color should be applied to the mesh
     */
    useVertexColor, 
    /**
     * If vertex alpha should be applied to the mesh
     */
    useVertexAlpha) {
        if (scene === void 0) { scene = null; }
        if (parent === void 0) { parent = null; }
        if (source === void 0) { source = null; }
        var _this = _super.call(this, name, scene, parent, source, doNotCloneChildren) || this;
        _this.useVertexColor = useVertexColor;
        _this.useVertexAlpha = useVertexAlpha;
        /**
         * Color of the line (Default: White)
         */
        _this.color = new Color3(1, 1, 1);
        /**
         * Alpha of the line (Default: 1)
         */
        _this.alpha = 1;
        if (source) {
            _this.color = source.color.clone();
            _this.alpha = source.alpha;
            _this.useVertexColor = source.useVertexColor;
            _this.useVertexAlpha = source.useVertexAlpha;
        }
        _this.intersectionThreshold = 0.1;
        var defines = [];
        var options = {
            attributes: [VertexBuffer.PositionKind, "world0", "world1", "world2", "world3"],
            uniforms: ["vClipPlane", "vClipPlane2", "vClipPlane3", "vClipPlane4", "vClipPlane5", "vClipPlane6", "world", "viewProjection"],
            needAlphaBlending: true,
            defines: defines
        };
        if (useVertexAlpha === false) {
            options.needAlphaBlending = false;
        }
        if (!useVertexColor) {
            options.uniforms.push("color");
            _this.color4 = new Color4();
        }
        else {
            options.defines.push("#define VERTEXCOLOR");
            options.attributes.push(VertexBuffer.ColorKind);
        }
        _this._colorShader = new ShaderMaterial("colorShader", _this.getScene(), "color", options);
        return _this;
    }
    LinesMesh.prototype._addClipPlaneDefine = function (label) {
        var define = "#define " + label;
        var index = this._colorShader.options.defines.indexOf(define);
        if (index !== -1) {
            return;
        }
        this._colorShader.options.defines.push(define);
    };
    LinesMesh.prototype._removeClipPlaneDefine = function (label) {
        var define = "#define " + label;
        var index = this._colorShader.options.defines.indexOf(define);
        if (index === -1) {
            return;
        }
        this._colorShader.options.defines.splice(index, 1);
    };
    LinesMesh.prototype.isReady = function () {
        var scene = this.getScene();
        // Clip planes
        scene.clipPlane ? this._addClipPlaneDefine("CLIPPLANE") : this._removeClipPlaneDefine("CLIPPLANE");
        scene.clipPlane2 ? this._addClipPlaneDefine("CLIPPLANE2") : this._removeClipPlaneDefine("CLIPPLANE2");
        scene.clipPlane3 ? this._addClipPlaneDefine("CLIPPLANE3") : this._removeClipPlaneDefine("CLIPPLANE3");
        scene.clipPlane4 ? this._addClipPlaneDefine("CLIPPLANE4") : this._removeClipPlaneDefine("CLIPPLANE4");
        scene.clipPlane5 ? this._addClipPlaneDefine("CLIPPLANE5") : this._removeClipPlaneDefine("CLIPPLANE5");
        scene.clipPlane6 ? this._addClipPlaneDefine("CLIPPLANE6") : this._removeClipPlaneDefine("CLIPPLANE6");
        if (!this._colorShader.isReady(this)) {
            return false;
        }
        return _super.prototype.isReady.call(this);
    };
    /**
     * Returns the string "LineMesh"
     */
    LinesMesh.prototype.getClassName = function () {
        return "LinesMesh";
    };
    Object.defineProperty(LinesMesh.prototype, "material", {
        /**
         * @hidden
         */
        get: function () {
            return this._colorShader;
        },
        /**
         * @hidden
         */
        set: function (value) {
            // Do nothing
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinesMesh.prototype, "checkCollisions", {
        /**
         * @hidden
         */
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    /** @hidden */
    LinesMesh.prototype._bind = function (subMesh, effect, fillMode) {
        if (!this._geometry) {
            return this;
        }
        var colorEffect = this._colorShader.getEffect();
        // VBOs
        var indexToBind = this.isUnIndexed ? null : this._geometry.getIndexBuffer();
        this._geometry._bind(colorEffect, indexToBind);
        // Color
        if (!this.useVertexColor) {
            var _a = this.color, r = _a.r, g = _a.g, b = _a.b;
            this.color4.set(r, g, b, this.alpha);
            this._colorShader.setColor4("color", this.color4);
        }
        // Clip planes
        MaterialHelper.BindClipPlane(colorEffect, this.getScene());
        return this;
    };
    /** @hidden */
    LinesMesh.prototype._draw = function (subMesh, fillMode, instancesCount) {
        if (!this._geometry || !this._geometry.getVertexBuffers() || (!this._unIndexed && !this._geometry.getIndexBuffer())) {
            return this;
        }
        var engine = this.getScene().getEngine();
        // Draw order
        if (this._unIndexed) {
            engine.drawArraysType(Material.LineListDrawMode, subMesh.verticesStart, subMesh.verticesCount, instancesCount);
        }
        else {
            engine.drawElementsType(Material.LineListDrawMode, subMesh.indexStart, subMesh.indexCount, instancesCount);
        }
        return this;
    };
    /**
     * Disposes of the line mesh
     * @param doNotRecurse If children should be disposed
     */
    LinesMesh.prototype.dispose = function (doNotRecurse) {
        this._colorShader.dispose(false, false, true);
        _super.prototype.dispose.call(this, doNotRecurse);
    };
    /**
     * Returns a new LineMesh object cloned from the current one.
     */
    LinesMesh.prototype.clone = function (name, newParent, doNotCloneChildren) {
        if (newParent === void 0) { newParent = null; }
        return new LinesMesh(name, this.getScene(), newParent, this, doNotCloneChildren);
    };
    /**
     * Creates a new InstancedLinesMesh object from the mesh model.
     * @see https://doc.babylonjs.com/how_to/how_to_use_instances
     * @param name defines the name of the new instance
     * @returns a new InstancedLinesMesh
     */
    LinesMesh.prototype.createInstance = function (name) {
        return new InstancedLinesMesh(name, this);
    };
    return LinesMesh;
}(Mesh));
/**
 * Creates an instance based on a source LinesMesh
 */
var InstancedLinesMesh = /** @class */ (function (_super) {
    __extends(InstancedLinesMesh, _super);
    function InstancedLinesMesh(name, source) {
        var _this = _super.call(this, name, source) || this;
        _this.intersectionThreshold = source.intersectionThreshold;
        return _this;
    }
    /**
     * Returns the string "InstancedLinesMesh".
     */
    InstancedLinesMesh.prototype.getClassName = function () {
        return "InstancedLinesMesh";
    };
    return InstancedLinesMesh;
}(InstancedMesh));

VertexData.CreateLineSystem = function (options) {
    var indices = [];
    var positions = [];
    var lines = options.lines;
    var colors = options.colors;
    var vertexColors = [];
    var idx = 0;
    for (var l = 0; l < lines.length; l++) {
        var points = lines[l];
        for (var index = 0; index < points.length; index++) {
            positions.push(points[index].x, points[index].y, points[index].z);
            if (colors) {
                var color = colors[l];
                vertexColors.push(color[index].r, color[index].g, color[index].b, color[index].a);
            }
            if (index > 0) {
                indices.push(idx - 1);
                indices.push(idx);
            }
            idx++;
        }
    }
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    if (colors) {
        vertexData.colors = vertexColors;
    }
    return vertexData;
};
VertexData.CreateDashedLines = function (options) {
    var dashSize = options.dashSize || 3;
    var gapSize = options.gapSize || 1;
    var dashNb = options.dashNb || 200;
    var points = options.points;
    var positions = new Array();
    var indices = new Array();
    var curvect = Vector3.Zero();
    var lg = 0;
    var nb = 0;
    var shft = 0;
    var dashshft = 0;
    var curshft = 0;
    var idx = 0;
    var i = 0;
    for (i = 0; i < points.length - 1; i++) {
        points[i + 1].subtractToRef(points[i], curvect);
        lg += curvect.length();
    }
    shft = lg / dashNb;
    dashshft = dashSize * shft / (dashSize + gapSize);
    for (i = 0; i < points.length - 1; i++) {
        points[i + 1].subtractToRef(points[i], curvect);
        nb = Math.floor(curvect.length() / shft);
        curvect.normalize();
        for (var j = 0; j < nb; j++) {
            curshft = shft * j;
            positions.push(points[i].x + curshft * curvect.x, points[i].y + curshft * curvect.y, points[i].z + curshft * curvect.z);
            positions.push(points[i].x + (curshft + dashshft) * curvect.x, points[i].y + (curshft + dashshft) * curvect.y, points[i].z + (curshft + dashshft) * curvect.z);
            indices.push(idx, idx + 1);
            idx += 2;
        }
    }
    // Result
    var vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    return vertexData;
};
Mesh.CreateLines = function (name, points, scene, updatable, instance) {
    if (scene === void 0) { scene = null; }
    if (updatable === void 0) { updatable = false; }
    if (instance === void 0) { instance = null; }
    var options = {
        points: points,
        updatable: updatable,
        instance: instance
    };
    return LinesBuilder.CreateLines(name, options, scene);
};
Mesh.CreateDashedLines = function (name, points, dashSize, gapSize, dashNb, scene, updatable, instance) {
    if (scene === void 0) { scene = null; }
    var options = {
        points: points,
        dashSize: dashSize,
        gapSize: gapSize,
        dashNb: dashNb,
        updatable: updatable,
        instance: instance
    };
    return LinesBuilder.CreateDashedLines(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var LinesBuilder = /** @class */ (function () {
    function LinesBuilder() {
    }
    /**
     * Creates a line system mesh. A line system is a pool of many lines gathered in a single mesh
     * * A line system mesh is considered as a parametric shape since it has no predefined original shape. Its shape is determined by the passed array of lines as an input parameter
     * * Like every other parametric shape, it is dynamically updatable by passing an existing instance of LineSystem to this static function
     * * The parameter `lines` is an array of lines, each line being an array of successive Vector3
     * * The optional parameter `instance` is an instance of an existing LineSystem object to be updated with the passed `lines` parameter
     * * The optional parameter `colors` is an array of line colors, each line colors being an array of successive Color4, one per line point
     * * The optional parameter `useVertexAlpha` is to be set to `false` (default `true`) when you don't need the alpha blending (faster)
     * * Updating a simple Line mesh, you just need to update every line in the `lines` array : https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#lines-and-dashedlines
     * * When updating an instance, remember that only line point positions can change, not the number of points, neither the number of lines
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#line-system
     * @param name defines the name of the new line system
     * @param options defines the options used to create the line system
     * @param scene defines the hosting scene
     * @returns a new line system mesh
     */
    LinesBuilder.CreateLineSystem = function (name, options, scene) {
        var instance = options.instance;
        var lines = options.lines;
        var colors = options.colors;
        if (instance) { // lines update
            var positions = instance.getVerticesData(VertexBuffer.PositionKind);
            var vertexColor;
            var lineColors;
            if (colors) {
                vertexColor = instance.getVerticesData(VertexBuffer.ColorKind);
            }
            var i = 0;
            var c = 0;
            for (var l = 0; l < lines.length; l++) {
                var points = lines[l];
                for (var p = 0; p < points.length; p++) {
                    positions[i] = points[p].x;
                    positions[i + 1] = points[p].y;
                    positions[i + 2] = points[p].z;
                    if (colors && vertexColor) {
                        lineColors = colors[l];
                        vertexColor[c] = lineColors[p].r;
                        vertexColor[c + 1] = lineColors[p].g;
                        vertexColor[c + 2] = lineColors[p].b;
                        vertexColor[c + 3] = lineColors[p].a;
                        c += 4;
                    }
                    i += 3;
                }
            }
            instance.updateVerticesData(VertexBuffer.PositionKind, positions, false, false);
            if (colors && vertexColor) {
                instance.updateVerticesData(VertexBuffer.ColorKind, vertexColor, false, false);
            }
            return instance;
        }
        // line system creation
        var useVertexColor = (colors) ? true : false;
        var lineSystem = new LinesMesh(name, scene, null, undefined, undefined, useVertexColor, options.useVertexAlpha);
        var vertexData = VertexData.CreateLineSystem(options);
        vertexData.applyToMesh(lineSystem, options.updatable);
        return lineSystem;
    };
    /**
     * Creates a line mesh
     * A line mesh is considered as a parametric shape since it has no predefined original shape. Its shape is determined by the passed array of points as an input parameter
     * * Like every other parametric shape, it is dynamically updatable by passing an existing instance of LineMesh to this static function
     * * The parameter `points` is an array successive Vector3
     * * The optional parameter `instance` is an instance of an existing LineMesh object to be updated with the passed `points` parameter : https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#lines-and-dashedlines
     * * The optional parameter `colors` is an array of successive Color4, one per line point
     * * The optional parameter `useVertexAlpha` is to be set to `false` (default `true`) when you don't need alpha blending (faster)
     * * When updating an instance, remember that only point positions can change, not the number of points
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#lines
     * @param name defines the name of the new line system
     * @param options defines the options used to create the line system
     * @param scene defines the hosting scene
     * @returns a new line mesh
     */
    LinesBuilder.CreateLines = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var colors = (options.colors) ? [options.colors] : null;
        var lines = LinesBuilder.CreateLineSystem(name, { lines: [options.points], updatable: options.updatable, instance: options.instance, colors: colors, useVertexAlpha: options.useVertexAlpha }, scene);
        return lines;
    };
    /**
     * Creates a dashed line mesh
     * * A dashed line mesh is considered as a parametric shape since it has no predefined original shape. Its shape is determined by the passed array of points as an input parameter
     * * Like every other parametric shape, it is dynamically updatable by passing an existing instance of LineMesh to this static function
     * * The parameter `points` is an array successive Vector3
     * * The parameter `dashNb` is the intended total number of dashes (positive integer, default 200)
     * * The parameter `dashSize` is the size of the dashes relatively the dash number (positive float, default 3)
     * * The parameter `gapSize` is the size of the gap between two successive dashes relatively the dash number (positive float, default 1)
     * * The optional parameter `instance` is an instance of an existing LineMesh object to be updated with the passed `points` parameter : https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#lines-and-dashedlines
     * * The optional parameter `useVertexAlpha` is to be set to `false` (default `true`) when you don't need the alpha blending (faster)
     * * When updating an instance, remember that only point positions can change, not the number of points
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the dashed line mesh
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#dashed-lines
     */
    LinesBuilder.CreateDashedLines = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var points = options.points;
        var instance = options.instance;
        var gapSize = options.gapSize || 1;
        var dashSize = options.dashSize || 3;
        if (instance) { //  dashed lines update
            var positionFunction = function (positions) {
                var curvect = Vector3.Zero();
                var nbSeg = positions.length / 6;
                var lg = 0;
                var nb = 0;
                var shft = 0;
                var dashshft = 0;
                var curshft = 0;
                var p = 0;
                var i = 0;
                var j = 0;
                for (i = 0; i < points.length - 1; i++) {
                    points[i + 1].subtractToRef(points[i], curvect);
                    lg += curvect.length();
                }
                shft = lg / nbSeg;
                var dashSize = instance._creationDataStorage.dashSize;
                var gapSize = instance._creationDataStorage.gapSize;
                dashshft = dashSize * shft / (dashSize + gapSize);
                for (i = 0; i < points.length - 1; i++) {
                    points[i + 1].subtractToRef(points[i], curvect);
                    nb = Math.floor(curvect.length() / shft);
                    curvect.normalize();
                    j = 0;
                    while (j < nb && p < positions.length) {
                        curshft = shft * j;
                        positions[p] = points[i].x + curshft * curvect.x;
                        positions[p + 1] = points[i].y + curshft * curvect.y;
                        positions[p + 2] = points[i].z + curshft * curvect.z;
                        positions[p + 3] = points[i].x + (curshft + dashshft) * curvect.x;
                        positions[p + 4] = points[i].y + (curshft + dashshft) * curvect.y;
                        positions[p + 5] = points[i].z + (curshft + dashshft) * curvect.z;
                        p += 6;
                        j++;
                    }
                }
                while (p < positions.length) {
                    positions[p] = points[i].x;
                    positions[p + 1] = points[i].y;
                    positions[p + 2] = points[i].z;
                    p += 3;
                }
            };
            instance.updateMeshPositions(positionFunction, false);
            return instance;
        }
        // dashed lines creation
        var dashedLines = new LinesMesh(name, scene, null, undefined, undefined, undefined, options.useVertexAlpha);
        var vertexData = VertexData.CreateDashedLines(options);
        vertexData.applyToMesh(dashedLines, options.updatable);
        dashedLines._creationDataStorage = new _CreationDataStorage();
        dashedLines._creationDataStorage.dashSize = dashSize;
        dashedLines._creationDataStorage.gapSize = gapSize;
        return dashedLines;
    };
    return LinesBuilder;
}());

export { InstancedLinesMesh as I, LinesBuilder as L, RibbonBuilder as R, ShapeBuilder as S, LinesMesh as a, InstancedMesh as b };
