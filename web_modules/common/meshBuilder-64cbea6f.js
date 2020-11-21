import { _ as __extends, L as Logger, E as EngineStore, C as CanvasGenerator } from './thinEngine-e576a091.js';
import { d as Vector4, C as Color4, V as Vector3, M as Matrix, a as Vector2, T as TmpVectors, b as Color3, E as Epsilon } from './math.color-fc6e801e.js';
import { E as Engine } from './engine-9a1b5aa7.js';
import { T as Tools } from './tools-ab6f1dea.js';
import { A as Axis } from './math.axis-e7db27a6.js';
import { S as Scene } from './scene-cbeb8ae2.js';
import { b as VertexData, V as VertexBuffer } from './sceneComponent-5502b64a.js';
import { M as Mesh } from './mesh-cfdd36e7.js';
import { a as Path2, P as Path3D } from './math.path-c216bc6f.js';
import { P as PositionNormalVertex } from './math.vertexFormat-0458f7ef.js';
import { R as RibbonBuilder, L as LinesBuilder, S as ShapeBuilder } from './linesBuilder-20e392f1.js';

VertexData.CreateDisc = function (options) {
    var positions = new Array();
    var indices = new Array();
    var normals = new Array();
    var uvs = new Array();
    var radius = options.radius || 0.5;
    var tessellation = options.tessellation || 64;
    var arc = options.arc && (options.arc <= 0 || options.arc > 1) ? 1.0 : options.arc || 1.0;
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    // positions and uvs
    positions.push(0, 0, 0); // disc center first
    uvs.push(0.5, 0.5);
    var theta = Math.PI * 2 * arc;
    var step = arc === 1 ? theta / tessellation : theta / (tessellation - 1);
    var a = 0;
    for (var t = 0; t < tessellation; t++) {
        var x = Math.cos(a);
        var y = Math.sin(a);
        var u = (x + 1) / 2;
        var v = (1 - y) / 2;
        positions.push(radius * x, radius * y, 0);
        uvs.push(u, v);
        a += step;
    }
    if (arc === 1) {
        positions.push(positions[3], positions[4], positions[5]); // close the circle
        uvs.push(uvs[2], uvs[3]);
    }
    //indices
    var vertexNb = positions.length / 3;
    for (var i = 1; i < vertexNb - 1; i++) {
        indices.push(i + 1, 0, i);
    }
    // result
    VertexData.ComputeNormals(positions, indices, normals);
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    return vertexData;
};
Mesh.CreateDisc = function (name, radius, tessellation, scene, updatable, sideOrientation) {
    if (scene === void 0) { scene = null; }
    var options = {
        radius: radius,
        tessellation: tessellation,
        sideOrientation: sideOrientation,
        updatable: updatable
    };
    return DiscBuilder.CreateDisc(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var DiscBuilder = /** @class */ (function () {
    function DiscBuilder() {
    }
    /**
     * Creates a plane polygonal mesh.  By default, this is a disc
     * * The parameter `radius` sets the radius size (float) of the polygon (default 0.5)
     * * The parameter `tessellation` sets the number of polygon sides (positive integer, default 64). So a tessellation valued to 3 will build a triangle, to 4 a square, etc
     * * You can create an unclosed polygon with the parameter `arc` (positive float, default 1), valued between 0 and 1, what is the ratio of the circumference : 2 x PI x ratio
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the plane polygonal mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#disc-or-regular-polygon
     */
    DiscBuilder.CreateDisc = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var disc = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        disc._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreateDisc(options);
        vertexData.applyToMesh(disc, options.updatable);
        return disc;
    };
    return DiscBuilder;
}());

VertexData.CreateBox = function (options) {
    var nbFaces = 6;
    var indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
    var normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0];
    var uvs = [];
    var positions = [];
    var width = options.width || options.size || 1;
    var height = options.height || options.size || 1;
    var depth = options.depth || options.size || 1;
    var wrap = options.wrap || false;
    var topBaseAt = (options.topBaseAt === void 0) ? 1 : options.topBaseAt;
    var bottomBaseAt = (options.bottomBaseAt === void 0) ? 0 : options.bottomBaseAt;
    topBaseAt = (topBaseAt + 4) % 4; // places values as 0 to 3
    bottomBaseAt = (bottomBaseAt + 4) % 4; // places values as 0 to 3
    var topOrder = [2, 0, 3, 1];
    var bottomOrder = [2, 0, 1, 3];
    var topIndex = topOrder[topBaseAt];
    var bottomIndex = bottomOrder[bottomBaseAt];
    var basePositions = [1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1];
    if (wrap) {
        indices = [2, 3, 0, 2, 0, 1, 4, 5, 6, 4, 6, 7, 9, 10, 11, 9, 11, 8, 12, 14, 15, 12, 13, 14];
        basePositions = [-1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1];
        var topFaceBase = [[1, 1, 1], [-1, 1, 1], [-1, 1, -1], [1, 1, -1]];
        var bottomFaceBase = [[-1, -1, 1], [1, -1, 1], [1, -1, -1], [-1, -1, -1]];
        var topFaceOrder = [17, 18, 19, 16];
        var bottomFaceOrder = [22, 23, 20, 21];
        while (topIndex > 0) {
            topFaceBase.unshift(topFaceBase.pop());
            topFaceOrder.unshift(topFaceOrder.pop());
            topIndex--;
        }
        while (bottomIndex > 0) {
            bottomFaceBase.unshift(bottomFaceBase.pop());
            bottomFaceOrder.unshift(bottomFaceOrder.pop());
            bottomIndex--;
        }
        topFaceBase = topFaceBase.flat();
        bottomFaceBase = bottomFaceBase.flat();
        basePositions = basePositions.concat(topFaceBase).concat(bottomFaceBase);
        indices.push(topFaceOrder[0], topFaceOrder[2], topFaceOrder[3], topFaceOrder[0], topFaceOrder[1], topFaceOrder[2]);
        indices.push(bottomFaceOrder[0], bottomFaceOrder[2], bottomFaceOrder[3], bottomFaceOrder[0], bottomFaceOrder[1], bottomFaceOrder[2]);
    }
    var scaleArray = [width / 2, height / 2, depth / 2];
    positions = basePositions.reduce(function (accumulator, currentValue, currentIndex) { return accumulator.concat(currentValue * scaleArray[currentIndex % 3]); }, []);
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    var faceUV = options.faceUV || new Array(6);
    var faceColors = options.faceColors;
    var colors = [];
    // default face colors and UV if undefined
    for (var f = 0; f < 6; f++) {
        if (faceUV[f] === undefined) {
            faceUV[f] = new Vector4(0, 0, 1, 1);
        }
        if (faceColors && faceColors[f] === undefined) {
            faceColors[f] = new Color4(1, 1, 1, 1);
        }
    }
    // Create each face in turn.
    for (var index = 0; index < nbFaces; index++) {
        uvs.push(faceUV[index].z, faceUV[index].w);
        uvs.push(faceUV[index].x, faceUV[index].w);
        uvs.push(faceUV[index].x, faceUV[index].y);
        uvs.push(faceUV[index].z, faceUV[index].y);
        if (faceColors) {
            for (var c = 0; c < 4; c++) {
                colors.push(faceColors[index].r, faceColors[index].g, faceColors[index].b, faceColors[index].a);
            }
        }
    }
    // sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    if (faceColors) {
        var totalColors = (sideOrientation === VertexData.DOUBLESIDE) ? colors.concat(colors) : colors;
        vertexData.colors = totalColors;
    }
    return vertexData;
};
Mesh.CreateBox = function (name, size, scene, updatable, sideOrientation) {
    if (scene === void 0) { scene = null; }
    var options = {
        size: size,
        sideOrientation: sideOrientation,
        updatable: updatable
    };
    return BoxBuilder.CreateBox(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var BoxBuilder = /** @class */ (function () {
    function BoxBuilder() {
    }
    /**
     * Creates a box mesh
     * * The parameter `size` sets the size (float) of each box side (default 1)
     * * You can set some different box dimensions by using the parameters `width`, `height` and `depth` (all by default have the same value of `size`)
     * * You can set different colors and different images to each box side by using the parameters `faceColors` (an array of 6 Color3 elements) and `faceUV` (an array of 6 Vector4 elements)
     * * Please read this tutorial : https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @see https://doc.babylonjs.com/how_to/set_shapes#box
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the box mesh
     */
    BoxBuilder.CreateBox = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var box = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        box._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreateBox(options);
        vertexData.applyToMesh(box, options.updatable);
        return box;
    };
    return BoxBuilder;
}());

VertexData.CreateTiledBox = function (options) {
    var nbFaces = 6;
    var faceUV = options.faceUV || new Array(6);
    var faceColors = options.faceColors;
    var flipTile = options.pattern || Mesh.NO_FLIP;
    var width = options.width || options.size || 1;
    var height = options.height || options.size || 1;
    var depth = options.depth || options.size || 1;
    var tileWidth = options.tileWidth || options.tileSize || 1;
    var tileHeight = options.tileHeight || options.tileSize || 1;
    var alignH = options.alignHorizontal || 0;
    var alignV = options.alignVertical || 0;
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    // default face colors and UV if undefined
    for (var f = 0; f < nbFaces; f++) {
        if (faceUV[f] === undefined) {
            faceUV[f] = new Vector4(0, 0, 1, 1);
        }
        if (faceColors && faceColors[f] === undefined) {
            faceColors[f] = new Color4(1, 1, 1, 1);
        }
    }
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var halfDepth = depth / 2;
    var faceVertexData = [];
    for (var f = 0; f < 2; f++) { //front and back
        faceVertexData[f] = VertexData.CreateTiledPlane({
            pattern: flipTile,
            tileWidth: tileWidth,
            tileHeight: tileHeight,
            width: width,
            height: height,
            alignVertical: alignV,
            alignHorizontal: alignH,
            sideOrientation: sideOrientation
        });
    }
    for (var f = 2; f < 4; f++) { //sides
        faceVertexData[f] = VertexData.CreateTiledPlane({
            pattern: flipTile,
            tileWidth: tileWidth,
            tileHeight: tileHeight,
            width: depth,
            height: height,
            alignVertical: alignV,
            alignHorizontal: alignH,
            sideOrientation: sideOrientation
        });
    }
    var baseAlignV = alignV;
    if (alignV === Mesh.BOTTOM) {
        baseAlignV = Mesh.TOP;
    }
    else if (alignV === Mesh.TOP) {
        baseAlignV = Mesh.BOTTOM;
    }
    for (var f = 4; f < 6; f++) { //top and bottom
        faceVertexData[f] = VertexData.CreateTiledPlane({
            pattern: flipTile,
            tileWidth: tileWidth,
            tileHeight: tileHeight,
            width: width,
            height: depth,
            alignVertical: baseAlignV,
            alignHorizontal: alignH,
            sideOrientation: sideOrientation
        });
    }
    var positions = [];
    var normals = [];
    var uvs = [];
    var indices = [];
    var colors = [];
    var facePositions = [];
    var faceNormals = [];
    var newFaceUV = [];
    var len = 0;
    var lu = 0;
    var li = 0;
    for (var f = 0; f < nbFaces; f++) {
        var len = faceVertexData[f].positions.length;
        facePositions[f] = [];
        faceNormals[f] = [];
        for (var p = 0; p < len / 3; p++) {
            facePositions[f].push(new Vector3(faceVertexData[f].positions[3 * p], faceVertexData[f].positions[3 * p + 1], faceVertexData[f].positions[3 * p + 2]));
            faceNormals[f].push(new Vector3(faceVertexData[f].normals[3 * p], faceVertexData[f].normals[3 * p + 1], faceVertexData[f].normals[3 * p + 2]));
        }
        // uvs
        lu = faceVertexData[f].uvs.length;
        newFaceUV[f] = [];
        for (var i = 0; i < lu; i += 2) {
            newFaceUV[f][i] = faceUV[f].x + (faceUV[f].z - faceUV[f].x) * faceVertexData[f].uvs[i];
            newFaceUV[f][i + 1] = faceUV[f].y + (faceUV[f].w - faceUV[f].y) * faceVertexData[f].uvs[i + 1];
        }
        uvs = uvs.concat(newFaceUV[f]);
        indices = indices.concat(faceVertexData[f].indices.map(function (x) { return x + li; }));
        li += facePositions[f].length;
        if (faceColors) {
            for (var c = 0; c < 4; c++) {
                colors.push(faceColors[f].r, faceColors[f].g, faceColors[f].b, faceColors[f].a);
            }
        }
    }
    var vec0 = new Vector3(0, 0, halfDepth);
    var mtrx0 = Matrix.RotationY(Math.PI);
    positions = facePositions[0].map(function (entry) { return Vector3.TransformNormal(entry, mtrx0).add(vec0); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []);
    normals = faceNormals[0].map(function (entry) { return Vector3.TransformNormal(entry, mtrx0); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []);
    positions = positions.concat(facePositions[1].map(function (entry) { return entry.subtract(vec0); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []));
    normals = normals.concat(faceNormals[1].map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []));
    var vec2 = new Vector3(halfWidth, 0, 0);
    var mtrx2 = Matrix.RotationY(-Math.PI / 2);
    positions = positions.concat(facePositions[2].map(function (entry) { return Vector3.TransformNormal(entry, mtrx2).add(vec2); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []));
    normals = normals.concat(faceNormals[2].map(function (entry) { return Vector3.TransformNormal(entry, mtrx2); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []));
    var mtrx3 = Matrix.RotationY(Math.PI / 2);
    positions = positions.concat(facePositions[3].map(function (entry) { return Vector3.TransformNormal(entry, mtrx3).subtract(vec2); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []));
    normals = normals.concat(faceNormals[3].map(function (entry) { return Vector3.TransformNormal(entry, mtrx3); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []));
    var vec4 = new Vector3(0, halfHeight, 0);
    var mtrx4 = Matrix.RotationX(Math.PI / 2);
    positions = positions.concat(facePositions[4].map(function (entry) { return Vector3.TransformNormal(entry, mtrx4).add(vec4); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []));
    normals = normals.concat(faceNormals[4].map(function (entry) { return Vector3.TransformNormal(entry, mtrx4); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []));
    var mtrx5 = Matrix.RotationX(-Math.PI / 2);
    positions = positions.concat(facePositions[5].map(function (entry) { return Vector3.TransformNormal(entry, mtrx5).subtract(vec4); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []));
    normals = normals.concat(faceNormals[5].map(function (entry) { return Vector3.TransformNormal(entry, mtrx5); }).map(function (entry) { return [entry.x, entry.y, entry.z]; }).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []));
    // sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs);
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    if (faceColors) {
        var totalColors = (sideOrientation === VertexData.DOUBLESIDE) ? colors.concat(colors) : colors;
        vertexData.colors = totalColors;
    }
    return vertexData;
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var TiledBoxBuilder = /** @class */ (function () {
    function TiledBoxBuilder() {
    }
    /**
     * Creates a box mesh
     * faceTiles sets the pattern, tile size and number of tiles for a face     * * You can set different colors and different images to each box side by using the parameters `faceColors` (an array of 6 Color3 elements) and `faceUV` (an array of 6 Vector4 elements)
     * * Please read this tutorial : https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the box mesh
     */
    TiledBoxBuilder.CreateTiledBox = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var box = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        box._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreateTiledBox(options);
        vertexData.applyToMesh(box, options.updatable);
        return box;
    };
    return TiledBoxBuilder;
}());

VertexData.CreateSphere = function (options) {
    var segments = options.segments || 32;
    var diameterX = options.diameterX || options.diameter || 1;
    var diameterY = options.diameterY || options.diameter || 1;
    var diameterZ = options.diameterZ || options.diameter || 1;
    var arc = options.arc && (options.arc <= 0 || options.arc > 1) ? 1.0 : options.arc || 1.0;
    var slice = options.slice && (options.slice <= 0) ? 1.0 : options.slice || 1.0;
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    var dedupTopBottomIndices = !!options.dedupTopBottomIndices;
    var radius = new Vector3(diameterX / 2, diameterY / 2, diameterZ / 2);
    var totalZRotationSteps = 2 + segments;
    var totalYRotationSteps = 2 * totalZRotationSteps;
    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    for (var zRotationStep = 0; zRotationStep <= totalZRotationSteps; zRotationStep++) {
        var normalizedZ = zRotationStep / totalZRotationSteps;
        var angleZ = normalizedZ * Math.PI * slice;
        for (var yRotationStep = 0; yRotationStep <= totalYRotationSteps; yRotationStep++) {
            var normalizedY = yRotationStep / totalYRotationSteps;
            var angleY = normalizedY * Math.PI * 2 * arc;
            var rotationZ = Matrix.RotationZ(-angleZ);
            var rotationY = Matrix.RotationY(angleY);
            var afterRotZ = Vector3.TransformCoordinates(Vector3.Up(), rotationZ);
            var complete = Vector3.TransformCoordinates(afterRotZ, rotationY);
            var vertex = complete.multiply(radius);
            var normal = complete.divide(radius).normalize();
            positions.push(vertex.x, vertex.y, vertex.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(normalizedY, normalizedZ);
        }
        if (zRotationStep > 0) {
            var verticesCount = positions.length / 3;
            for (var firstIndex = verticesCount - 2 * (totalYRotationSteps + 1); (firstIndex + totalYRotationSteps + 2) < verticesCount; firstIndex++) {
                if (dedupTopBottomIndices) {
                    if (zRotationStep > 1) {
                        indices.push((firstIndex));
                        indices.push((firstIndex + 1));
                        indices.push(firstIndex + totalYRotationSteps + 1);
                    }
                    if (zRotationStep < totalZRotationSteps || slice < 1.0) {
                        indices.push((firstIndex + totalYRotationSteps + 1));
                        indices.push((firstIndex + 1));
                        indices.push((firstIndex + totalYRotationSteps + 2));
                    }
                }
                else {
                    indices.push(firstIndex);
                    indices.push(firstIndex + 1);
                    indices.push(firstIndex + totalYRotationSteps + 1);
                    indices.push(firstIndex + totalYRotationSteps + 1);
                    indices.push(firstIndex + 1);
                    indices.push(firstIndex + totalYRotationSteps + 2);
                }
            }
        }
    }
    // Sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    return vertexData;
};
Mesh.CreateSphere = function (name, segments, diameter, scene, updatable, sideOrientation) {
    var options = {
        segments: segments,
        diameterX: diameter,
        diameterY: diameter,
        diameterZ: diameter,
        sideOrientation: sideOrientation,
        updatable: updatable
    };
    return SphereBuilder.CreateSphere(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var SphereBuilder = /** @class */ (function () {
    function SphereBuilder() {
    }
    /**
     * Creates a sphere mesh
     * * The parameter `diameter` sets the diameter size (float) of the sphere (default 1)
     * * You can set some different sphere dimensions, for instance to build an ellipsoid, by using the parameters `diameterX`, `diameterY` and `diameterZ` (all by default have the same value of `diameter`)
     * * The parameter `segments` sets the sphere number of horizontal stripes (positive integer, default 32)
     * * You can create an unclosed sphere with the parameter `arc` (positive float, default 1), valued between 0 and 1, what is the ratio of the circumference (latitude) : 2 x PI x ratio
     * * You can create an unclosed sphere on its height with the parameter `slice` (positive float, default1), valued between 0 and 1, what is the height ratio (longitude)
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the sphere mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#sphere
     */
    SphereBuilder.CreateSphere = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var sphere = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        sphere._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreateSphere(options);
        vertexData.applyToMesh(sphere, options.updatable);
        return sphere;
    };
    return SphereBuilder;
}());

VertexData.CreateCylinder = function (options) {
    var height = options.height || 2;
    var diameterTop = (options.diameterTop === 0) ? 0 : options.diameterTop || options.diameter || 1;
    var diameterBottom = (options.diameterBottom === 0) ? 0 : options.diameterBottom || options.diameter || 1;
    diameterTop = diameterTop || 0.00001; // Prevent broken normals
    diameterBottom = diameterBottom || 0.00001; // Prevent broken normals
    var tessellation = options.tessellation || 24;
    var subdivisions = options.subdivisions || 1;
    var hasRings = options.hasRings ? true : false;
    var enclose = options.enclose ? true : false;
    var cap = (options.cap === 0) ? 0 : options.cap || Mesh.CAP_ALL;
    var arc = options.arc && (options.arc <= 0 || options.arc > 1) ? 1.0 : options.arc || 1.0;
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    var faceUV = options.faceUV || new Array(3);
    var faceColors = options.faceColors;
    // default face colors and UV if undefined
    var quadNb = (arc !== 1 && enclose) ? 2 : 0;
    var ringNb = (hasRings) ? subdivisions : 1;
    var surfaceNb = 2 + (1 + quadNb) * ringNb;
    var f;
    for (f = 0; f < surfaceNb; f++) {
        if (faceColors && faceColors[f] === undefined) {
            faceColors[f] = new Color4(1, 1, 1, 1);
        }
    }
    for (f = 0; f < surfaceNb; f++) {
        if (faceUV && faceUV[f] === undefined) {
            faceUV[f] = new Vector4(0, 0, 1, 1);
        }
    }
    var indices = new Array();
    var positions = new Array();
    var normals = new Array();
    var uvs = new Array();
    var colors = new Array();
    var angle_step = Math.PI * 2 * arc / tessellation;
    var angle;
    var h;
    var radius;
    var tan = (diameterBottom - diameterTop) / 2 / height;
    var ringVertex = Vector3.Zero();
    var ringNormal = Vector3.Zero();
    var ringFirstVertex = Vector3.Zero();
    var ringFirstNormal = Vector3.Zero();
    var quadNormal = Vector3.Zero();
    var Y = Axis.Y;
    // positions, normals, uvs
    var i;
    var j;
    var r;
    var ringIdx = 1;
    var s = 1; // surface index
    var cs = 0;
    var v = 0;
    for (i = 0; i <= subdivisions; i++) {
        h = i / subdivisions;
        radius = (h * (diameterTop - diameterBottom) + diameterBottom) / 2;
        ringIdx = (hasRings && i !== 0 && i !== subdivisions) ? 2 : 1;
        for (r = 0; r < ringIdx; r++) {
            if (hasRings) {
                s += r;
            }
            if (enclose) {
                s += 2 * r;
            }
            for (j = 0; j <= tessellation; j++) {
                angle = j * angle_step;
                // position
                ringVertex.x = Math.cos(-angle) * radius;
                ringVertex.y = -height / 2 + h * height;
                ringVertex.z = Math.sin(-angle) * radius;
                // normal
                if (diameterTop === 0 && i === subdivisions) {
                    // if no top cap, reuse former normals
                    ringNormal.x = normals[normals.length - (tessellation + 1) * 3];
                    ringNormal.y = normals[normals.length - (tessellation + 1) * 3 + 1];
                    ringNormal.z = normals[normals.length - (tessellation + 1) * 3 + 2];
                }
                else {
                    ringNormal.x = ringVertex.x;
                    ringNormal.z = ringVertex.z;
                    ringNormal.y = Math.sqrt(ringNormal.x * ringNormal.x + ringNormal.z * ringNormal.z) * tan;
                    ringNormal.normalize();
                }
                // keep first ring vertex values for enclose
                if (j === 0) {
                    ringFirstVertex.copyFrom(ringVertex);
                    ringFirstNormal.copyFrom(ringNormal);
                }
                positions.push(ringVertex.x, ringVertex.y, ringVertex.z);
                normals.push(ringNormal.x, ringNormal.y, ringNormal.z);
                if (hasRings) {
                    v = (cs !== s) ? faceUV[s].y : faceUV[s].w;
                }
                else {
                    v = faceUV[s].y + (faceUV[s].w - faceUV[s].y) * h;
                }
                uvs.push(faceUV[s].x + (faceUV[s].z - faceUV[s].x) * j / tessellation, v);
                if (faceColors) {
                    colors.push(faceColors[s].r, faceColors[s].g, faceColors[s].b, faceColors[s].a);
                }
            }
            // if enclose, add four vertices and their dedicated normals
            if (arc !== 1 && enclose) {
                positions.push(ringVertex.x, ringVertex.y, ringVertex.z);
                positions.push(0, ringVertex.y, 0);
                positions.push(0, ringVertex.y, 0);
                positions.push(ringFirstVertex.x, ringFirstVertex.y, ringFirstVertex.z);
                Vector3.CrossToRef(Y, ringNormal, quadNormal);
                quadNormal.normalize();
                normals.push(quadNormal.x, quadNormal.y, quadNormal.z, quadNormal.x, quadNormal.y, quadNormal.z);
                Vector3.CrossToRef(ringFirstNormal, Y, quadNormal);
                quadNormal.normalize();
                normals.push(quadNormal.x, quadNormal.y, quadNormal.z, quadNormal.x, quadNormal.y, quadNormal.z);
                if (hasRings) {
                    v = (cs !== s) ? faceUV[s + 1].y : faceUV[s + 1].w;
                }
                else {
                    v = faceUV[s + 1].y + (faceUV[s + 1].w - faceUV[s + 1].y) * h;
                }
                uvs.push(faceUV[s + 1].x, v);
                uvs.push(faceUV[s + 1].z, v);
                if (hasRings) {
                    v = (cs !== s) ? faceUV[s + 2].y : faceUV[s + 2].w;
                }
                else {
                    v = faceUV[s + 2].y + (faceUV[s + 2].w - faceUV[s + 2].y) * h;
                }
                uvs.push(faceUV[s + 2].x, v);
                uvs.push(faceUV[s + 2].z, v);
                if (faceColors) {
                    colors.push(faceColors[s + 1].r, faceColors[s + 1].g, faceColors[s + 1].b, faceColors[s + 1].a);
                    colors.push(faceColors[s + 1].r, faceColors[s + 1].g, faceColors[s + 1].b, faceColors[s + 1].a);
                    colors.push(faceColors[s + 2].r, faceColors[s + 2].g, faceColors[s + 2].b, faceColors[s + 2].a);
                    colors.push(faceColors[s + 2].r, faceColors[s + 2].g, faceColors[s + 2].b, faceColors[s + 2].a);
                }
            }
            if (cs !== s) {
                cs = s;
            }
        }
    }
    // indices
    var e = (arc !== 1 && enclose) ? tessellation + 4 : tessellation; // correction of number of iteration if enclose
    var s;
    i = 0;
    for (s = 0; s < subdivisions; s++) {
        var i0 = 0;
        var i1 = 0;
        var i2 = 0;
        var i3 = 0;
        for (j = 0; j < tessellation; j++) {
            i0 = i * (e + 1) + j;
            i1 = (i + 1) * (e + 1) + j;
            i2 = i * (e + 1) + (j + 1);
            i3 = (i + 1) * (e + 1) + (j + 1);
            indices.push(i0, i1, i2);
            indices.push(i3, i2, i1);
        }
        if (arc !== 1 && enclose) { // if enclose, add two quads
            indices.push(i0 + 2, i1 + 2, i2 + 2);
            indices.push(i3 + 2, i2 + 2, i1 + 2);
            indices.push(i0 + 4, i1 + 4, i2 + 4);
            indices.push(i3 + 4, i2 + 4, i1 + 4);
        }
        i = (hasRings) ? (i + 2) : (i + 1);
    }
    // Caps
    var createCylinderCap = function (isTop) {
        var radius = isTop ? diameterTop / 2 : diameterBottom / 2;
        if (radius === 0) {
            return;
        }
        // Cap positions, normals & uvs
        var angle;
        var circleVector;
        var i;
        var u = (isTop) ? faceUV[surfaceNb - 1] : faceUV[0];
        var c = null;
        if (faceColors) {
            c = (isTop) ? faceColors[surfaceNb - 1] : faceColors[0];
        }
        // cap center
        var vbase = positions.length / 3;
        var offset = isTop ? height / 2 : -height / 2;
        var center = new Vector3(0, offset, 0);
        positions.push(center.x, center.y, center.z);
        normals.push(0, isTop ? 1 : -1, 0);
        uvs.push(u.x + (u.z - u.x) * 0.5, u.y + (u.w - u.y) * 0.5);
        if (c) {
            colors.push(c.r, c.g, c.b, c.a);
        }
        var textureScale = new Vector2(0.5, 0.5);
        for (i = 0; i <= tessellation; i++) {
            angle = Math.PI * 2 * i * arc / tessellation;
            var cos = Math.cos(-angle);
            var sin = Math.sin(-angle);
            circleVector = new Vector3(cos * radius, offset, sin * radius);
            var textureCoordinate = new Vector2(cos * textureScale.x + 0.5, sin * textureScale.y + 0.5);
            positions.push(circleVector.x, circleVector.y, circleVector.z);
            normals.push(0, isTop ? 1 : -1, 0);
            uvs.push(u.x + (u.z - u.x) * textureCoordinate.x, u.y + (u.w - u.y) * textureCoordinate.y);
            if (c) {
                colors.push(c.r, c.g, c.b, c.a);
            }
        }
        // Cap indices
        for (i = 0; i < tessellation; i++) {
            if (!isTop) {
                indices.push(vbase);
                indices.push(vbase + (i + 1));
                indices.push(vbase + (i + 2));
            }
            else {
                indices.push(vbase);
                indices.push(vbase + (i + 2));
                indices.push(vbase + (i + 1));
            }
        }
    };
    // add caps to geometry based on cap parameter
    if ((cap === Mesh.CAP_START)
        || (cap === Mesh.CAP_ALL)) {
        createCylinderCap(false);
    }
    if ((cap === Mesh.CAP_END)
        || (cap === Mesh.CAP_ALL)) {
        createCylinderCap(true);
    }
    // Sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    if (faceColors) {
        vertexData.colors = colors;
    }
    return vertexData;
};
Mesh.CreateCylinder = function (name, height, diameterTop, diameterBottom, tessellation, subdivisions, scene, updatable, sideOrientation) {
    if (scene === undefined || !(scene instanceof Scene)) {
        if (scene !== undefined) {
            sideOrientation = updatable || Mesh.DEFAULTSIDE;
            updatable = scene;
        }
        scene = subdivisions;
        subdivisions = 1;
    }
    var options = {
        height: height,
        diameterTop: diameterTop,
        diameterBottom: diameterBottom,
        tessellation: tessellation,
        subdivisions: subdivisions,
        sideOrientation: sideOrientation,
        updatable: updatable
    };
    return CylinderBuilder.CreateCylinder(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var CylinderBuilder = /** @class */ (function () {
    function CylinderBuilder() {
    }
    /**
     * Creates a cylinder or a cone mesh
     * * The parameter `height` sets the height size (float) of the cylinder/cone (float, default 2).
     * * The parameter `diameter` sets the diameter of the top and bottom cap at once (float, default 1).
     * * The parameters `diameterTop` and `diameterBottom` overwrite the parameter `diameter` and set respectively the top cap and bottom cap diameter (floats, default 1). The parameter "diameterBottom" can't be zero.
     * * The parameter `tessellation` sets the number of cylinder sides (positive integer, default 24). Set it to 3 to get a prism for instance.
     * * The parameter `subdivisions` sets the number of rings along the cylinder height (positive integer, default 1).
     * * The parameter `hasRings` (boolean, default false) makes the subdivisions independent from each other, so they become different faces.
     * * The parameter `enclose`  (boolean, default false) adds two extra faces per subdivision to a sliced cylinder to close it around its height axis.
     * * The parameter `cap` sets the way the cylinder is capped. Possible values : BABYLON.Mesh.NO_CAP, BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL (default).
     * * The parameter `arc` (float, default 1) is the ratio (max 1) to apply to the circumference to slice the cylinder.
     * * You can set different colors and different images to each box side by using the parameters `faceColors` (an array of n Color3 elements) and `faceUV` (an array of n Vector4 elements).
     * * The value of n is the number of cylinder faces. If the cylinder has only 1 subdivisions, n equals : top face + cylinder surface + bottom face = 3
     * * Now, if the cylinder has 5 independent subdivisions (hasRings = true), n equals : top face + 5 stripe surfaces + bottom face = 2 + 5 = 7
     * * Finally, if the cylinder has 5 independent subdivisions and is enclose, n equals : top face + 5 x (stripe surface + 2 closing faces) + bottom face = 2 + 5 * 3 = 17
     * * Each array (color or UVs) is always ordered the same way : the first element is the bottom cap, the last element is the top cap. The other elements are each a ring surface.
     * * If `enclose` is false, a ring surface is one element.
     * * If `enclose` is true, a ring surface is 3 successive elements in the array : the tubular surface, then the two closing faces.
     * * Example how to set colors and textures on a sliced cylinder : https://www.html5gamedevs.com/topic/17945-creating-a-closed-slice-of-a-cylinder/#comment-106379
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the cylinder mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#cylinder-or-cone
     */
    CylinderBuilder.CreateCylinder = function (name, options, scene) {
        var cylinder = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        cylinder._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreateCylinder(options);
        vertexData.applyToMesh(cylinder, options.updatable);
        return cylinder;
    };
    return CylinderBuilder;
}());

VertexData.CreateTorus = function (options) {
    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var diameter = options.diameter || 1;
    var thickness = options.thickness || 0.5;
    var tessellation = options.tessellation || 16;
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    var stride = tessellation + 1;
    for (var i = 0; i <= tessellation; i++) {
        var u = i / tessellation;
        var outerAngle = i * Math.PI * 2.0 / tessellation - Math.PI / 2.0;
        var transform = Matrix.Translation(diameter / 2.0, 0, 0).multiply(Matrix.RotationY(outerAngle));
        for (var j = 0; j <= tessellation; j++) {
            var v = 1 - j / tessellation;
            var innerAngle = j * Math.PI * 2.0 / tessellation + Math.PI;
            var dx = Math.cos(innerAngle);
            var dy = Math.sin(innerAngle);
            // Create a vertex.
            var normal = new Vector3(dx, dy, 0);
            var position = normal.scale(thickness / 2);
            var textureCoordinate = new Vector2(u, v);
            position = Vector3.TransformCoordinates(position, transform);
            normal = Vector3.TransformNormal(normal, transform);
            positions.push(position.x, position.y, position.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(textureCoordinate.x, textureCoordinate.y);
            // And create indices for two triangles.
            var nextI = (i + 1) % stride;
            var nextJ = (j + 1) % stride;
            indices.push(i * stride + j);
            indices.push(i * stride + nextJ);
            indices.push(nextI * stride + j);
            indices.push(i * stride + nextJ);
            indices.push(nextI * stride + nextJ);
            indices.push(nextI * stride + j);
        }
    }
    // Sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    return vertexData;
};
Mesh.CreateTorus = function (name, diameter, thickness, tessellation, scene, updatable, sideOrientation) {
    var options = {
        diameter: diameter,
        thickness: thickness,
        tessellation: tessellation,
        sideOrientation: sideOrientation,
        updatable: updatable
    };
    return TorusBuilder.CreateTorus(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var TorusBuilder = /** @class */ (function () {
    function TorusBuilder() {
    }
    /**
     * Creates a torus mesh
     * * The parameter `diameter` sets the diameter size (float) of the torus (default 1)
     * * The parameter `thickness` sets the diameter size of the tube of the torus (float, default 0.5)
     * * The parameter `tessellation` sets the number of torus sides (postive integer, default 16)
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the torus mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#torus
     */
    TorusBuilder.CreateTorus = function (name, options, scene) {
        var torus = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        torus._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreateTorus(options);
        vertexData.applyToMesh(torus, options.updatable);
        return torus;
    };
    return TorusBuilder;
}());

VertexData.CreateTorusKnot = function (options) {
    var indices = new Array();
    var positions = new Array();
    var normals = new Array();
    var uvs = new Array();
    var radius = options.radius || 2;
    var tube = options.tube || 0.5;
    var radialSegments = options.radialSegments || 32;
    var tubularSegments = options.tubularSegments || 32;
    var p = options.p || 2;
    var q = options.q || 3;
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    // Helper
    var getPos = function (angle) {
        var cu = Math.cos(angle);
        var su = Math.sin(angle);
        var quOverP = q / p * angle;
        var cs = Math.cos(quOverP);
        var tx = radius * (2 + cs) * 0.5 * cu;
        var ty = radius * (2 + cs) * su * 0.5;
        var tz = radius * Math.sin(quOverP) * 0.5;
        return new Vector3(tx, ty, tz);
    };
    // Vertices
    var i;
    var j;
    for (i = 0; i <= radialSegments; i++) {
        var modI = i % radialSegments;
        var u = modI / radialSegments * 2 * p * Math.PI;
        var p1 = getPos(u);
        var p2 = getPos(u + 0.01);
        var tang = p2.subtract(p1);
        var n = p2.add(p1);
        var bitan = Vector3.Cross(tang, n);
        n = Vector3.Cross(bitan, tang);
        bitan.normalize();
        n.normalize();
        for (j = 0; j < tubularSegments; j++) {
            var modJ = j % tubularSegments;
            var v = modJ / tubularSegments * 2 * Math.PI;
            var cx = -tube * Math.cos(v);
            var cy = tube * Math.sin(v);
            positions.push(p1.x + cx * n.x + cy * bitan.x);
            positions.push(p1.y + cx * n.y + cy * bitan.y);
            positions.push(p1.z + cx * n.z + cy * bitan.z);
            uvs.push(i / radialSegments);
            uvs.push(j / tubularSegments);
        }
    }
    for (i = 0; i < radialSegments; i++) {
        for (j = 0; j < tubularSegments; j++) {
            var jNext = (j + 1) % tubularSegments;
            var a = i * tubularSegments + j;
            var b = (i + 1) * tubularSegments + j;
            var c = (i + 1) * tubularSegments + jNext;
            var d = i * tubularSegments + jNext;
            indices.push(d);
            indices.push(b);
            indices.push(a);
            indices.push(d);
            indices.push(c);
            indices.push(b);
        }
    }
    // Normals
    VertexData.ComputeNormals(positions, indices, normals);
    // Sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    return vertexData;
};
Mesh.CreateTorusKnot = function (name, radius, tube, radialSegments, tubularSegments, p, q, scene, updatable, sideOrientation) {
    var options = {
        radius: radius,
        tube: tube,
        radialSegments: radialSegments,
        tubularSegments: tubularSegments,
        p: p,
        q: q,
        sideOrientation: sideOrientation,
        updatable: updatable
    };
    return TorusKnotBuilder.CreateTorusKnot(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var TorusKnotBuilder = /** @class */ (function () {
    function TorusKnotBuilder() {
    }
    /**
     * Creates a torus knot mesh
     * * The parameter `radius` sets the global radius size (float) of the torus knot (default 2)
     * * The parameter `radialSegments` sets the number of sides on each tube segments (positive integer, default 32)
     * * The parameter `tubularSegments` sets the number of tubes to decompose the knot into (positive integer, default 32)
     * * The parameters `p` and `q` are the number of windings on each axis (positive integers, default 2 and 3)
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the torus knot mesh
     * @see  https://doc.babylonjs.com/how_to/set_shapes#torus-knot
     */
    TorusKnotBuilder.CreateTorusKnot = function (name, options, scene) {
        var torusKnot = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        torusKnot._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreateTorusKnot(options);
        vertexData.applyToMesh(torusKnot, options.updatable);
        return torusKnot;
    };
    return TorusKnotBuilder;
}());

/**
 * Vector2 wth index property
 */
var IndexedVector2 = /** @class */ (function (_super) {
    __extends(IndexedVector2, _super);
    function IndexedVector2(original, 
    /** Index of the vector2 */
    index) {
        var _this = _super.call(this, original.x, original.y) || this;
        _this.index = index;
        return _this;
    }
    return IndexedVector2;
}(Vector2));
/**
 * Defines points to create a polygon
 */
var PolygonPoints = /** @class */ (function () {
    function PolygonPoints() {
        this.elements = new Array();
    }
    PolygonPoints.prototype.add = function (originalPoints) {
        var _this = this;
        var result = new Array();
        originalPoints.forEach(function (point) {
            var newPoint = new IndexedVector2(point, _this.elements.length);
            result.push(newPoint);
            _this.elements.push(newPoint);
        });
        return result;
    };
    PolygonPoints.prototype.computeBounds = function () {
        var lmin = new Vector2(this.elements[0].x, this.elements[0].y);
        var lmax = new Vector2(this.elements[0].x, this.elements[0].y);
        this.elements.forEach(function (point) {
            // x
            if (point.x < lmin.x) {
                lmin.x = point.x;
            }
            else if (point.x > lmax.x) {
                lmax.x = point.x;
            }
            // y
            if (point.y < lmin.y) {
                lmin.y = point.y;
            }
            else if (point.y > lmax.y) {
                lmax.y = point.y;
            }
        });
        return {
            min: lmin,
            max: lmax,
            width: lmax.x - lmin.x,
            height: lmax.y - lmin.y
        };
    };
    return PolygonPoints;
}());
/**
 * Polygon
 * @see https://doc.babylonjs.com/how_to/parametric_shapes#non-regular-polygon
 */
var Polygon = /** @class */ (function () {
    function Polygon() {
    }
    /**
     * Creates a rectangle
     * @param xmin bottom X coord
     * @param ymin bottom Y coord
     * @param xmax top X coord
     * @param ymax top Y coord
     * @returns points that make the resulting rectation
     */
    Polygon.Rectangle = function (xmin, ymin, xmax, ymax) {
        return [
            new Vector2(xmin, ymin),
            new Vector2(xmax, ymin),
            new Vector2(xmax, ymax),
            new Vector2(xmin, ymax)
        ];
    };
    /**
     * Creates a circle
     * @param radius radius of circle
     * @param cx scale in x
     * @param cy scale in y
     * @param numberOfSides number of sides that make up the circle
     * @returns points that make the resulting circle
     */
    Polygon.Circle = function (radius, cx, cy, numberOfSides) {
        if (cx === void 0) { cx = 0; }
        if (cy === void 0) { cy = 0; }
        if (numberOfSides === void 0) { numberOfSides = 32; }
        var result = new Array();
        var angle = 0;
        var increment = (Math.PI * 2) / numberOfSides;
        for (var i = 0; i < numberOfSides; i++) {
            result.push(new Vector2(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius));
            angle -= increment;
        }
        return result;
    };
    /**
     * Creates a polygon from input string
     * @param input Input polygon data
     * @returns the parsed points
     */
    Polygon.Parse = function (input) {
        var floats = input.split(/[^-+eE\.\d]+/).map(parseFloat).filter(function (val) { return (!isNaN(val)); });
        var i, result = [];
        for (i = 0; i < (floats.length & 0x7FFFFFFE); i += 2) {
            result.push(new Vector2(floats[i], floats[i + 1]));
        }
        return result;
    };
    /**
     * Starts building a polygon from x and y coordinates
     * @param x x coordinate
     * @param y y coordinate
     * @returns the started path2
     */
    Polygon.StartingAt = function (x, y) {
        return Path2.StartingAt(x, y);
    };
    return Polygon;
}());
/**
 * Builds a polygon
 * @see https://doc.babylonjs.com/how_to/polygonmeshbuilder
 */
var PolygonMeshBuilder = /** @class */ (function () {
    /**
     * Creates a PolygonMeshBuilder
     * @param name name of the builder
     * @param contours Path of the polygon
     * @param scene scene to add to when creating the mesh
     * @param earcutInjection can be used to inject your own earcut reference
     */
    function PolygonMeshBuilder(name, contours, scene, earcutInjection) {
        if (earcutInjection === void 0) { earcutInjection = earcut; }
        this._points = new PolygonPoints();
        this._outlinepoints = new PolygonPoints();
        this._holes = new Array();
        this._epoints = new Array();
        this._eholes = new Array();
        this.bjsEarcut = earcutInjection;
        this._name = name;
        this._scene = scene || Engine.LastCreatedScene;
        var points;
        if (contours instanceof Path2) {
            points = contours.getPoints();
        }
        else {
            points = contours;
        }
        this._addToepoint(points);
        this._points.add(points);
        this._outlinepoints.add(points);
        if (typeof this.bjsEarcut === 'undefined') {
            Logger.Warn("Earcut was not found, the polygon will not be built.");
        }
    }
    PolygonMeshBuilder.prototype._addToepoint = function (points) {
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var p = points_1[_i];
            this._epoints.push(p.x, p.y);
        }
    };
    /**
     * Adds a whole within the polygon
     * @param hole Array of points defining the hole
     * @returns this
     */
    PolygonMeshBuilder.prototype.addHole = function (hole) {
        this._points.add(hole);
        var holepoints = new PolygonPoints();
        holepoints.add(hole);
        this._holes.push(holepoints);
        this._eholes.push(this._epoints.length / 2);
        this._addToepoint(hole);
        return this;
    };
    /**
     * Creates the polygon
     * @param updatable If the mesh should be updatable
     * @param depth The depth of the mesh created
     * @returns the created mesh
     */
    PolygonMeshBuilder.prototype.build = function (updatable, depth) {
        if (updatable === void 0) { updatable = false; }
        if (depth === void 0) { depth = 0; }
        var result = new Mesh(this._name, this._scene);
        var vertexData = this.buildVertexData(depth);
        result.setVerticesData(VertexBuffer.PositionKind, vertexData.positions, updatable);
        result.setVerticesData(VertexBuffer.NormalKind, vertexData.normals, updatable);
        result.setVerticesData(VertexBuffer.UVKind, vertexData.uvs, updatable);
        result.setIndices(vertexData.indices);
        return result;
    };
    /**
     * Creates the polygon
     * @param depth The depth of the mesh created
     * @returns the created VertexData
     */
    PolygonMeshBuilder.prototype.buildVertexData = function (depth) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        var result = new VertexData();
        var normals = new Array();
        var positions = new Array();
        var uvs = new Array();
        var bounds = this._points.computeBounds();
        this._points.elements.forEach(function (p) {
            normals.push(0, 1.0, 0);
            positions.push(p.x, 0, p.y);
            uvs.push((p.x - bounds.min.x) / bounds.width, (p.y - bounds.min.y) / bounds.height);
        });
        var indices = new Array();
        var res = this.bjsEarcut(this._epoints, this._eholes, 2);
        for (var i = 0; i < res.length; i++) {
            indices.push(res[i]);
        }
        if (depth > 0) {
            var positionscount = (positions.length / 3); //get the current pointcount
            this._points.elements.forEach(function (p) {
                normals.push(0, -1.0, 0);
                positions.push(p.x, -depth, p.y);
                uvs.push(1 - (p.x - bounds.min.x) / bounds.width, 1 - (p.y - bounds.min.y) / bounds.height);
            });
            var totalCount = indices.length;
            for (var i = 0; i < totalCount; i += 3) {
                var i0 = indices[i + 0];
                var i1 = indices[i + 1];
                var i2 = indices[i + 2];
                indices.push(i2 + positionscount);
                indices.push(i1 + positionscount);
                indices.push(i0 + positionscount);
            }
            //Add the sides
            this.addSide(positions, normals, uvs, indices, bounds, this._outlinepoints, depth, false);
            this._holes.forEach(function (hole) {
                _this.addSide(positions, normals, uvs, indices, bounds, hole, depth, true);
            });
        }
        result.indices = indices;
        result.positions = positions;
        result.normals = normals;
        result.uvs = uvs;
        return result;
    };
    /**
     * Adds a side to the polygon
     * @param positions points that make the polygon
     * @param normals normals of the polygon
     * @param uvs uvs of the polygon
     * @param indices indices of the polygon
     * @param bounds bounds of the polygon
     * @param points points of the polygon
     * @param depth depth of the polygon
     * @param flip flip of the polygon
     */
    PolygonMeshBuilder.prototype.addSide = function (positions, normals, uvs, indices, bounds, points, depth, flip) {
        var StartIndex = positions.length / 3;
        var ulength = 0;
        for (var i = 0; i < points.elements.length; i++) {
            var p = points.elements[i];
            var p1;
            if ((i + 1) > points.elements.length - 1) {
                p1 = points.elements[0];
            }
            else {
                p1 = points.elements[i + 1];
            }
            positions.push(p.x, 0, p.y);
            positions.push(p.x, -depth, p.y);
            positions.push(p1.x, 0, p1.y);
            positions.push(p1.x, -depth, p1.y);
            var v1 = new Vector3(p.x, 0, p.y);
            var v2 = new Vector3(p1.x, 0, p1.y);
            var v3 = v2.subtract(v1);
            var v4 = new Vector3(0, 1, 0);
            var vn = Vector3.Cross(v3, v4);
            vn = vn.normalize();
            uvs.push(ulength / bounds.width, 0);
            uvs.push(ulength / bounds.width, 1);
            ulength += v3.length();
            uvs.push((ulength / bounds.width), 0);
            uvs.push((ulength / bounds.width), 1);
            if (!flip) {
                normals.push(-vn.x, -vn.y, -vn.z);
                normals.push(-vn.x, -vn.y, -vn.z);
                normals.push(-vn.x, -vn.y, -vn.z);
                normals.push(-vn.x, -vn.y, -vn.z);
                indices.push(StartIndex);
                indices.push(StartIndex + 1);
                indices.push(StartIndex + 2);
                indices.push(StartIndex + 1);
                indices.push(StartIndex + 3);
                indices.push(StartIndex + 2);
            }
            else {
                normals.push(vn.x, vn.y, vn.z);
                normals.push(vn.x, vn.y, vn.z);
                normals.push(vn.x, vn.y, vn.z);
                normals.push(vn.x, vn.y, vn.z);
                indices.push(StartIndex);
                indices.push(StartIndex + 2);
                indices.push(StartIndex + 1);
                indices.push(StartIndex + 1);
                indices.push(StartIndex + 2);
                indices.push(StartIndex + 3);
            }
            StartIndex += 4;
        }
    };
    return PolygonMeshBuilder;
}());

VertexData.CreatePolygon = function (polygon, sideOrientation, fUV, fColors, frontUVs, backUVs, wrp) {
    var faceUV = fUV || new Array(3);
    var faceColors = fColors;
    var colors = [];
    var wrap = wrp || false;
    // default face colors and UV if undefined
    for (var f = 0; f < 3; f++) {
        if (faceUV[f] === undefined) {
            faceUV[f] = new Vector4(0, 0, 1, 1);
        }
        if (faceColors && faceColors[f] === undefined) {
            faceColors[f] = new Color4(1, 1, 1, 1);
        }
    }
    var positions = polygon.getVerticesData(VertexBuffer.PositionKind);
    var normals = polygon.getVerticesData(VertexBuffer.NormalKind);
    var uvs = polygon.getVerticesData(VertexBuffer.UVKind);
    var indices = polygon.getIndices();
    var startIndex = positions.length / 9;
    var disp = 0;
    var distX = 0;
    var distZ = 0;
    var dist = 0;
    var totalLen = 0;
    var cumulate = [0];
    if (wrap) {
        for (var idx = startIndex; idx < positions.length / 3; idx += 4) {
            distX = positions[3 * (idx + 2)] - positions[3 * idx];
            distZ = positions[3 * (idx + 2) + 2] - positions[3 * idx + 2];
            dist = Math.sqrt(distX * distX + distZ * distZ);
            totalLen += dist;
            cumulate.push(totalLen);
        }
    }
    // set face colours and textures
    var idx = 0;
    var face = 0;
    for (var index = 0; index < normals.length; index += 3) {
        //Edge Face  no. 1
        if (Math.abs(normals[index + 1]) < 0.001) {
            face = 1;
        }
        //Top Face  no. 0
        if (Math.abs(normals[index + 1] - 1) < 0.001) {
            face = 0;
        }
        //Bottom Face  no. 2
        if (Math.abs(normals[index + 1] + 1) < 0.001) {
            face = 2;
        }
        idx = index / 3;
        if (face === 1) {
            disp = idx - startIndex;
            if (disp % 4 < 1.5) {
                if (wrap) {
                    uvs[2 * idx] = faceUV[face].x + (faceUV[face].z - faceUV[face].x) * cumulate[Math.floor(disp / 4)] / totalLen;
                }
                else {
                    uvs[2 * idx] = faceUV[face].x;
                }
            }
            else {
                if (wrap) {
                    uvs[2 * idx] = faceUV[face].x + (faceUV[face].z - faceUV[face].x) * cumulate[Math.floor(disp / 4) + 1] / totalLen;
                }
                else {
                    uvs[2 * idx] = faceUV[face].z;
                }
            }
            if (disp % 2 === 0) {
                uvs[2 * idx + 1] = faceUV[face].w;
            }
            else {
                uvs[2 * idx + 1] = faceUV[face].y;
            }
        }
        else {
            uvs[2 * idx] = (1 - uvs[2 * idx]) * faceUV[face].x + uvs[2 * idx] * faceUV[face].z;
            uvs[2 * idx + 1] = (1 - uvs[2 * idx + 1]) * faceUV[face].y + uvs[2 * idx + 1] * faceUV[face].w;
        }
        if (faceColors) {
            colors.push(faceColors[face].r, faceColors[face].g, faceColors[face].b, faceColors[face].a);
        }
    }
    // sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, frontUVs, backUVs);
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    if (faceColors) {
        var totalColors = (sideOrientation === VertexData.DOUBLESIDE) ? colors.concat(colors) : colors;
        vertexData.colors = totalColors;
    }
    return vertexData;
};
Mesh.CreatePolygon = function (name, shape, scene, holes, updatable, sideOrientation, earcutInjection) {
    if (earcutInjection === void 0) { earcutInjection = earcut; }
    var options = {
        shape: shape,
        holes: holes,
        updatable: updatable,
        sideOrientation: sideOrientation
    };
    return PolygonBuilder.CreatePolygon(name, options, scene, earcutInjection);
};
Mesh.ExtrudePolygon = function (name, shape, depth, scene, holes, updatable, sideOrientation, earcutInjection) {
    if (earcutInjection === void 0) { earcutInjection = earcut; }
    var options = {
        shape: shape,
        holes: holes,
        depth: depth,
        updatable: updatable,
        sideOrientation: sideOrientation
    };
    return PolygonBuilder.ExtrudePolygon(name, options, scene, earcutInjection);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var PolygonBuilder = /** @class */ (function () {
    function PolygonBuilder() {
    }
    /**
     * Creates a polygon mesh
     * The polygon's shape will depend on the input parameters and is constructed parallel to a ground mesh
     * * The parameter `shape` is a required array of successive Vector3 representing the corners of the polygon in th XoZ plane, that is y = 0 for all vectors
     * * You can set the mesh side orientation with the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4)
     * * Remember you can only change the shape positions, not their number when updating a polygon
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @param earcutInjection can be used to inject your own earcut reference
     * @returns the polygon mesh
     */
    PolygonBuilder.CreatePolygon = function (name, options, scene, earcutInjection) {
        if (scene === void 0) { scene = null; }
        if (earcutInjection === void 0) { earcutInjection = earcut; }
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        var shape = options.shape;
        var holes = options.holes || [];
        var depth = options.depth || 0;
        var contours = [];
        var hole = [];
        for (var i = 0; i < shape.length; i++) {
            contours[i] = new Vector2(shape[i].x, shape[i].z);
        }
        var epsilon = 0.00000001;
        if (contours[0].equalsWithEpsilon(contours[contours.length - 1], epsilon)) {
            contours.pop();
        }
        var polygonTriangulation = new PolygonMeshBuilder(name, contours, scene || EngineStore.LastCreatedScene, earcutInjection);
        for (var hNb = 0; hNb < holes.length; hNb++) {
            hole = [];
            for (var hPoint = 0; hPoint < holes[hNb].length; hPoint++) {
                hole.push(new Vector2(holes[hNb][hPoint].x, holes[hNb][hPoint].z));
            }
            polygonTriangulation.addHole(hole);
        }
        var polygon = polygonTriangulation.build(options.updatable, depth);
        polygon._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreatePolygon(polygon, options.sideOrientation, options.faceUV, options.faceColors, options.frontUVs, options.backUVs, options.wrap);
        vertexData.applyToMesh(polygon, options.updatable);
        return polygon;
    };
    /**
     * Creates an extruded polygon mesh, with depth in the Y direction.
     * * You can set different colors and different images to the top, bottom and extruded side by using the parameters `faceColors` (an array of 3 Color3 elements) and `faceUV` (an array of 3 Vector4 elements)
     * @see https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @param earcutInjection can be used to inject your own earcut reference
     * @returns the polygon mesh
     */
    PolygonBuilder.ExtrudePolygon = function (name, options, scene, earcutInjection) {
        if (scene === void 0) { scene = null; }
        if (earcutInjection === void 0) { earcutInjection = earcut; }
        return PolygonBuilder.CreatePolygon(name, options, scene, earcutInjection);
    };
    return PolygonBuilder;
}());

Mesh.CreateLathe = function (name, shape, radius, tessellation, scene, updatable, sideOrientation) {
    var options = {
        shape: shape,
        radius: radius,
        tessellation: tessellation,
        sideOrientation: sideOrientation,
        updatable: updatable
    };
    return LatheBuilder.CreateLathe(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var LatheBuilder = /** @class */ (function () {
    function LatheBuilder() {
    }
    /**
     * Creates lathe mesh.
     * The lathe is a shape with a symetry axis : a 2D model shape is rotated around this axis to design the lathe
     * * The parameter `shape` is a required array of successive Vector3. This array depicts the shape to be rotated in its local space : the shape must be designed in the xOy plane and will be rotated around the Y axis. It's usually a 2D shape, so the Vector3 z coordinates are often set to zero
     * * The parameter `radius` (positive float, default 1) is the radius value of the lathe
     * * The parameter `tessellation` (positive integer, default 64) is the side number of the lathe
     * * The parameter `clip` (positive integer, default 0) is the number of sides to not create without effecting the general shape of the sides
     * * The parameter `arc` (positive float, default 1) is the ratio of the lathe. 0.5 builds for instance half a lathe, so an opened shape
     * * The parameter `closed` (boolean, default true) opens/closes the lathe circumference. This should be set to false when used with the parameter "arc"
     * * The parameter `cap` sets the way the extruded shape is capped. Possible values : BABYLON.Mesh.NO_CAP (default), BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The optional parameter `invertUV` (boolean, default false) swaps in the geometry the U and V coordinates to apply a texture
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the lathe mesh
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#lathe
     */
    LatheBuilder.CreateLathe = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var arc = options.arc ? ((options.arc <= 0 || options.arc > 1) ? 1.0 : options.arc) : 1.0;
        var closed = (options.closed === undefined) ? true : options.closed;
        var shape = options.shape;
        var radius = options.radius || 1;
        var tessellation = options.tessellation || 64;
        var clip = options.clip || 0;
        var updatable = options.updatable;
        var sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        var cap = options.cap || Mesh.NO_CAP;
        var pi2 = Math.PI * 2;
        var paths = new Array();
        var invertUV = options.invertUV || false;
        var i = 0;
        var p = 0;
        var step = pi2 / tessellation * arc;
        var rotated;
        var path = new Array();
        for (i = 0; i <= tessellation - clip; i++) {
            var path = [];
            if (cap == Mesh.CAP_START || cap == Mesh.CAP_ALL) {
                path.push(new Vector3(0, shape[0].y, 0));
                path.push(new Vector3(Math.cos(i * step) * shape[0].x * radius, shape[0].y, Math.sin(i * step) * shape[0].x * radius));
            }
            for (p = 0; p < shape.length; p++) {
                rotated = new Vector3(Math.cos(i * step) * shape[p].x * radius, shape[p].y, Math.sin(i * step) * shape[p].x * radius);
                path.push(rotated);
            }
            if (cap == Mesh.CAP_END || cap == Mesh.CAP_ALL) {
                path.push(new Vector3(Math.cos(i * step) * shape[shape.length - 1].x * radius, shape[shape.length - 1].y, Math.sin(i * step) * shape[shape.length - 1].x * radius));
                path.push(new Vector3(0, shape[shape.length - 1].y, 0));
            }
            paths.push(path);
        }
        // lathe ribbon
        var lathe = RibbonBuilder.CreateRibbon(name, { pathArray: paths, closeArray: closed, sideOrientation: sideOrientation, updatable: updatable, invertUV: invertUV, frontUVs: options.frontUVs, backUVs: options.backUVs }, scene);
        return lathe;
    };
    return LatheBuilder;
}());

VertexData.CreatePlane = function (options) {
    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var width = options.width || options.size || 1;
    var height = options.height || options.size || 1;
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    // Vertices
    var halfWidth = width / 2.0;
    var halfHeight = height / 2.0;
    positions.push(-halfWidth, -halfHeight, 0);
    normals.push(0, 0, -1.0);
    uvs.push(0.0, 0.0);
    positions.push(halfWidth, -halfHeight, 0);
    normals.push(0, 0, -1.0);
    uvs.push(1.0, 0.0);
    positions.push(halfWidth, halfHeight, 0);
    normals.push(0, 0, -1.0);
    uvs.push(1.0, 1.0);
    positions.push(-halfWidth, halfHeight, 0);
    normals.push(0, 0, -1.0);
    uvs.push(0.0, 1.0);
    // Indices
    indices.push(0);
    indices.push(1);
    indices.push(2);
    indices.push(0);
    indices.push(2);
    indices.push(3);
    // Sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    return vertexData;
};
Mesh.CreatePlane = function (name, size, scene, updatable, sideOrientation) {
    var options = {
        size: size,
        width: size,
        height: size,
        sideOrientation: sideOrientation,
        updatable: updatable
    };
    return PlaneBuilder.CreatePlane(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var PlaneBuilder = /** @class */ (function () {
    function PlaneBuilder() {
    }
    /**
     * Creates a plane mesh
     * * The parameter `size` sets the size (float) of both sides of the plane at once (default 1)
     * * You can set some different plane dimensions by using the parameters `width` and `height` (both by default have the same value of `size`)
     * * The parameter `sourcePlane` is a Plane instance. It builds a mesh plane from a Math plane
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the plane mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#plane
     */
    PlaneBuilder.CreatePlane = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var plane = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        plane._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreatePlane(options);
        vertexData.applyToMesh(plane, options.updatable);
        if (options.sourcePlane) {
            plane.translate(options.sourcePlane.normal, -options.sourcePlane.d);
            plane.setDirection(options.sourcePlane.normal.scale(-1));
        }
        return plane;
    };
    return PlaneBuilder;
}());

VertexData.CreateTiledPlane = function (options) {
    var flipTile = options.pattern || Mesh.NO_FLIP;
    var tileWidth = options.tileWidth || options.tileSize || 1;
    var tileHeight = options.tileHeight || options.tileSize || 1;
    var alignH = options.alignHorizontal || 0;
    var alignV = options.alignVertical || 0;
    var width = options.width || options.size || 1;
    var tilesX = Math.floor(width / tileWidth);
    var offsetX = width - tilesX * tileWidth;
    var height = options.height || options.size || 1;
    var tilesY = Math.floor(height / tileHeight);
    var offsetY = height - tilesY * tileHeight;
    var halfWidth = tileWidth * tilesX / 2;
    var halfHeight = tileHeight * tilesY / 2;
    var adjustX = 0;
    var adjustY = 0;
    var startX = 0;
    var startY = 0;
    var endX = 0;
    var endY = 0;
    //Part Tiles
    if (offsetX > 0 || offsetY > 0) {
        startX = -halfWidth;
        startY = -halfHeight;
        var endX = halfWidth;
        var endY = halfHeight;
        switch (alignH) {
            case Mesh.CENTER:
                offsetX /= 2;
                startX -= offsetX;
                endX += offsetX;
                break;
            case Mesh.LEFT:
                endX += offsetX;
                adjustX = -offsetX / 2;
                break;
            case Mesh.RIGHT:
                startX -= offsetX;
                adjustX = offsetX / 2;
                break;
        }
        switch (alignV) {
            case Mesh.CENTER:
                offsetY /= 2;
                startY -= offsetY;
                endY += offsetY;
                break;
            case Mesh.BOTTOM:
                endY += offsetY;
                adjustY = -offsetY / 2;
                break;
            case Mesh.TOP:
                startY -= offsetY;
                adjustY = offsetY / 2;
                break;
        }
    }
    var positions = [];
    var normals = [];
    var uvBase = [];
    uvBase[0] = [0, 0, 1, 0, 1, 1, 0, 1];
    uvBase[1] = [0, 0, 1, 0, 1, 1, 0, 1];
    if (flipTile === Mesh.ROTATE_TILE || flipTile === Mesh.ROTATE_ROW) {
        uvBase[1] = [1, 1, 0, 1, 0, 0, 1, 0];
    }
    if (flipTile === Mesh.FLIP_TILE || flipTile === Mesh.FLIP_ROW) {
        uvBase[1] = [1, 0, 0, 0, 0, 1, 1, 1];
    }
    if (flipTile === Mesh.FLIP_N_ROTATE_TILE || flipTile === Mesh.FLIP_N_ROTATE_ROW) {
        uvBase[1] = [0, 1, 1, 1, 1, 0, 0, 0];
    }
    var uvs = [];
    var colors = [];
    var indices = [];
    var index = 0;
    for (var y = 0; y < tilesY; y++) {
        for (var x = 0; x < tilesX; x++) {
            positions.push(-halfWidth + x * tileWidth + adjustX, -halfHeight + y * tileHeight + adjustY, 0);
            positions.push(-halfWidth + (x + 1) * tileWidth + adjustX, -halfHeight + y * tileHeight + adjustY, 0);
            positions.push(-halfWidth + (x + 1) * tileWidth + adjustX, -halfHeight + (y + 1) * tileHeight + adjustY, 0);
            positions.push(-halfWidth + x * tileWidth + adjustX, -halfHeight + (y + 1) * tileHeight + adjustY, 0);
            indices.push(index, index + 1, index + 3, index + 1, index + 2, index + 3);
            if (flipTile === Mesh.FLIP_TILE || flipTile === Mesh.ROTATE_TILE || flipTile === Mesh.FLIP_N_ROTATE_TILE) {
                uvs = uvs.concat(uvBase[(x % 2 + y % 2) % 2]);
            }
            else if (flipTile === Mesh.FLIP_ROW || flipTile === Mesh.ROTATE_ROW || flipTile === Mesh.FLIP_N_ROTATE_ROW) {
                uvs = uvs.concat(uvBase[y % 2]);
            }
            else {
                uvs = uvs.concat(uvBase[0]);
            }
            colors.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
            normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
            index += 4;
        }
    }
    //Part Tiles
    if (offsetX > 0 || offsetY > 0) {
        var partialBottomRow = (offsetY > 0 && (alignV === Mesh.CENTER || alignV === Mesh.TOP));
        var partialTopRow = (offsetY > 0 && (alignV === Mesh.CENTER || alignV === Mesh.BOTTOM));
        var partialLeftCol = (offsetX > 0 && (alignH === Mesh.CENTER || alignH === Mesh.RIGHT));
        var partialRightCol = (offsetX > 0 && (alignH === Mesh.CENTER || alignH === Mesh.LEFT));
        var uvPart = [];
        var a, b, c, d;
        //corners
        if (partialBottomRow && partialLeftCol) { //bottom left corner
            positions.push(startX + adjustX, startY + adjustY, 0);
            positions.push(-halfWidth + adjustX, startY + adjustY, 0);
            positions.push(-halfWidth + adjustX, startY + offsetY + adjustY, 0);
            positions.push(startX + adjustX, startY + offsetY + adjustY, 0);
            indices.push(index, index + 1, index + 3, index + 1, index + 2, index + 3);
            index += 4;
            a = 1 - offsetX / tileWidth;
            b = 1 - offsetY / tileHeight;
            c = 1;
            d = 1;
            uvPart = [a, b, c, b, c, d, a, d];
            if (flipTile === Mesh.ROTATE_ROW) {
                uvPart = [1 - a, 1 - b, 1 - c, 1 - b, 1 - c, 1 - d, 1 - a, 1 - d];
            }
            if (flipTile === Mesh.FLIP_ROW) {
                uvPart = [1 - a, b, 1 - c, b, 1 - c, d, 1 - a, d];
            }
            if (flipTile === Mesh.FLIP_N_ROTATE_ROW) {
                uvPart = [a, 1 - b, c, 1 - b, c, 1 - d, a, 1 - d];
            }
            uvs = uvs.concat(uvPart);
            colors.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
            normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
        }
        if (partialBottomRow && partialRightCol) { //bottom right corner
            positions.push(halfWidth + adjustX, startY + adjustY, 0);
            positions.push(endX + adjustX, startY + adjustY, 0);
            positions.push(endX + adjustX, startY + offsetY + adjustY, 0);
            positions.push(halfWidth + adjustX, startY + offsetY + adjustY, 0);
            indices.push(index, index + 1, index + 3, index + 1, index + 2, index + 3);
            index += 4;
            a = 0;
            b = 1 - offsetY / tileHeight;
            c = offsetX / tileWidth;
            d = 1;
            uvPart = [a, b, c, b, c, d, a, d];
            if (flipTile === Mesh.ROTATE_ROW || (flipTile === Mesh.ROTATE_TILE && (tilesX % 2) === 0)) {
                uvPart = [1 - a, 1 - b, 1 - c, 1 - b, 1 - c, 1 - d, 1 - a, 1 - d];
            }
            if (flipTile === Mesh.FLIP_ROW || (flipTile === Mesh.FLIP_TILE && (tilesX % 2) === 0)) {
                uvPart = [1 - a, b, 1 - c, b, 1 - c, d, 1 - a, d];
            }
            if (flipTile === Mesh.FLIP_N_ROTATE_ROW || (flipTile === Mesh.FLIP_N_ROTATE_TILE && (tilesX % 2) === 0)) {
                uvPart = [a, 1 - b, c, 1 - b, c, 1 - d, a, 1 - d];
            }
            uvs = uvs.concat(uvPart);
            colors.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
            normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
        }
        if (partialTopRow && partialLeftCol) { //top left corner
            positions.push(startX + adjustX, halfHeight + adjustY, 0);
            positions.push(-halfWidth + adjustX, halfHeight + adjustY, 0);
            positions.push(-halfWidth + adjustX, endY + adjustY, 0);
            positions.push(startX + adjustX, endY + adjustY, 0);
            indices.push(index, index + 1, index + 3, index + 1, index + 2, index + 3);
            index += 4;
            a = 1 - offsetX / tileWidth;
            b = 0;
            c = 1;
            d = offsetY / tileHeight;
            uvPart = [a, b, c, b, c, d, a, d];
            if ((flipTile === Mesh.ROTATE_ROW && (tilesY % 2) === 1) || (flipTile === Mesh.ROTATE_TILE && (tilesY % 1) === 0)) {
                uvPart = [1 - a, 1 - b, 1 - c, 1 - b, 1 - c, 1 - d, 1 - a, 1 - d];
            }
            if ((flipTile === Mesh.FLIP_ROW && (tilesY % 2) === 1) || (flipTile === Mesh.FLIP_TILE && (tilesY % 2) === 0)) {
                uvPart = [1 - a, b, 1 - c, b, 1 - c, d, 1 - a, d];
            }
            if ((flipTile === Mesh.FLIP_N_ROTATE_ROW && (tilesY % 2) === 1) || (flipTile === Mesh.FLIP_N_ROTATE_TILE && (tilesY % 2) === 0)) {
                uvPart = [a, 1 - b, c, 1 - b, c, 1 - d, a, 1 - d];
            }
            uvs = uvs.concat(uvPart);
            colors.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
            normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
        }
        if (partialTopRow && partialRightCol) { //top right corner
            positions.push(halfWidth + adjustX, halfHeight + adjustY, 0);
            positions.push(endX + adjustX, halfHeight + adjustY, 0);
            positions.push(endX + adjustX, endY + adjustY, 0);
            positions.push(halfWidth + adjustX, endY + adjustY, 0);
            indices.push(index, index + 1, index + 3, index + 1, index + 2, index + 3);
            index += 4;
            a = 0;
            b = 0;
            c = offsetX / tileWidth;
            d = offsetY / tileHeight;
            uvPart = [a, b, c, b, c, d, a, d];
            if ((flipTile === Mesh.ROTATE_ROW && (tilesY % 2) === 1) || (flipTile === Mesh.ROTATE_TILE && (tilesY + tilesX) % 2 === 1)) {
                uvPart = [1 - a, 1 - b, 1 - c, 1 - b, 1 - c, 1 - d, 1 - a, 1 - d];
            }
            if ((flipTile === Mesh.FLIP_ROW && (tilesY % 2) === 1) || (flipTile === Mesh.FLIP_TILE && (tilesY + tilesX) % 2 === 1)) {
                uvPart = [1 - a, b, 1 - c, b, 1 - c, d, 1 - a, d];
            }
            if ((flipTile === Mesh.FLIP_N_ROTATE_ROW && (tilesY % 2) === 1) || (flipTile === Mesh.FLIP_N_ROTATE_TILE && (tilesY + tilesX) % 2 === 1)) {
                uvPart = [a, 1 - b, c, 1 - b, c, 1 - d, a, 1 - d];
            }
            uvs = uvs.concat(uvPart);
            colors.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
            normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
        }
        //part rows
        if (partialBottomRow) {
            var uvBaseBR = [];
            a = 0;
            b = 1 - offsetY / tileHeight;
            c = 1;
            d = 1;
            uvBaseBR[0] = [a, b, c, b, c, d, a, d];
            uvBaseBR[1] = [a, b, c, b, c, d, a, d];
            if (flipTile === Mesh.ROTATE_TILE || flipTile === Mesh.ROTATE_ROW) {
                uvBaseBR[1] = [1 - a, 1 - b, 1 - c, 1 - b, 1 - c, 1 - d, 1 - a, 1 - d];
            }
            if (flipTile === Mesh.FLIP_TILE || flipTile === Mesh.FLIP_ROW) {
                uvBaseBR[1] = [1 - a, b, 1 - c, b, 1 - c, d, 1 - a, d];
            }
            if (flipTile === Mesh.FLIP_N_ROTATE_TILE || flipTile === Mesh.FLIP_N_ROTATE_ROW) {
                uvBaseBR[1] = [a, 1 - b, c, 1 - b, c, 1 - d, a, 1 - d];
            }
            for (var x = 0; x < tilesX; x++) {
                positions.push(-halfWidth + x * tileWidth + adjustX, startY + adjustY, 0);
                positions.push(-halfWidth + (x + 1) * tileWidth + adjustX, startY + adjustY, 0);
                positions.push(-halfWidth + (x + 1) * tileWidth + adjustX, startY + offsetY + adjustY, 0);
                positions.push(-halfWidth + x * tileWidth + adjustX, startY + offsetY + adjustY, 0);
                indices.push(index, index + 1, index + 3, index + 1, index + 2, index + 3);
                index += 4;
                if (flipTile === Mesh.FLIP_TILE || flipTile === Mesh.ROTATE_TILE || flipTile === Mesh.FLIP_N_ROTATE_TILE) {
                    uvs = uvs.concat(uvBaseBR[(x + 1) % 2]);
                }
                else if (flipTile === Mesh.FLIP_ROW || flipTile === Mesh.ROTATE_ROW || flipTile === Mesh.FLIP_N_ROTATE_ROW) {
                    uvs = uvs.concat(uvBaseBR[1]);
                }
                else {
                    uvs = uvs.concat(uvBaseBR[0]);
                }
                colors.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
                normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
            }
        }
        if (partialTopRow) {
            var uvBaseTR = [];
            a = 0;
            b = 0;
            c = 1;
            d = offsetY / tileHeight;
            uvBaseTR[0] = [a, b, c, b, c, d, a, d];
            uvBaseTR[1] = [a, b, c, b, c, d, a, d];
            if (flipTile === Mesh.ROTATE_TILE || flipTile === Mesh.ROTATE_ROW) {
                uvBaseTR[1] = [1 - a, 1 - b, 1 - c, 1 - b, 1 - c, 1 - d, 1 - a, 1 - d];
            }
            if (flipTile === Mesh.FLIP_TILE || flipTile === Mesh.FLIP_ROW) {
                uvBaseTR[1] = [1 - a, b, 1 - c, b, 1 - c, d, 1 - a, d];
            }
            if (flipTile === Mesh.FLIP_N_ROTATE_TILE || flipTile === Mesh.FLIP_N_ROTATE_ROW) {
                uvBaseTR[1] = [a, 1 - b, c, 1 - b, c, 1 - d, a, 1 - d];
            }
            for (var x = 0; x < tilesX; x++) {
                positions.push(-halfWidth + x * tileWidth + adjustX, endY - offsetY + adjustY, 0);
                positions.push(-halfWidth + (x + 1) * tileWidth + adjustX, endY - offsetY + adjustY, 0);
                positions.push(-halfWidth + (x + 1) * tileWidth + adjustX, endY + adjustY, 0);
                positions.push(-halfWidth + x * tileWidth + adjustX, endY + adjustY, 0);
                indices.push(index, index + 1, index + 3, index + 1, index + 2, index + 3);
                index += 4;
                if (flipTile === Mesh.FLIP_TILE || flipTile === Mesh.ROTATE_TILE || flipTile === Mesh.FLIP_N_ROTATE_TILE) {
                    uvs = uvs.concat(uvBaseTR[(x + tilesY) % 2]);
                }
                else if (flipTile === Mesh.FLIP_ROW || flipTile === Mesh.ROTATE_ROW || flipTile === Mesh.FLIP_N_ROTATE_ROW) {
                    uvs = uvs.concat(uvBaseTR[tilesY % 2]);
                }
                else {
                    uvs = uvs.concat(uvBaseTR[0]);
                }
                colors.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
                normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
            }
        }
        if (partialLeftCol) {
            var uvBaseLC = [];
            a = 1 - offsetX / tileWidth;
            b = 0;
            c = 1;
            d = 1;
            uvBaseLC[0] = [a, b, c, b, c, d, a, d];
            uvBaseLC[1] = [a, b, c, b, c, d, a, d];
            if (flipTile === Mesh.ROTATE_TILE || flipTile === Mesh.ROTATE_ROW) {
                uvBaseLC[1] = [1 - a, 1 - b, 1 - c, 1 - b, 1 - c, 1 - d, 1 - a, 1 - d];
            }
            if (flipTile === Mesh.FLIP_TILE || flipTile === Mesh.FLIP_ROW) {
                uvBaseLC[1] = [1 - a, b, 1 - c, b, 1 - c, d, 1 - a, d];
            }
            if (flipTile === Mesh.FLIP_N_ROTATE_TILE || flipTile === Mesh.FLIP_N_ROTATE_ROW) {
                uvBaseLC[1] = [a, 1 - b, c, 1 - b, c, 1 - d, a, 1 - d];
            }
            for (var y = 0; y < tilesY; y++) {
                positions.push(startX + adjustX, -halfHeight + y * tileHeight + adjustY, 0);
                positions.push(startX + offsetX + adjustX, -halfHeight + y * tileHeight + adjustY, 0);
                positions.push(startX + offsetX + adjustX, -halfHeight + (y + 1) * tileHeight + adjustY, 0);
                positions.push(startX + adjustX, -halfHeight + (y + 1) * tileHeight + adjustY, 0);
                indices.push(index, index + 1, index + 3, index + 1, index + 2, index + 3);
                index += 4;
                if (flipTile === Mesh.FLIP_TILE || flipTile === Mesh.ROTATE_TILE || flipTile === Mesh.FLIP_N_ROTATE_TILE) {
                    uvs = uvs.concat(uvBaseLC[(y + 1) % 2]);
                }
                else if (flipTile === Mesh.FLIP_ROW || flipTile === Mesh.ROTATE_ROW || flipTile === Mesh.FLIP_N_ROTATE_ROW) {
                    uvs = uvs.concat(uvBaseLC[y % 2]);
                }
                else {
                    uvs = uvs.concat(uvBaseLC[0]);
                }
                colors.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
                normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
            }
        }
        if (partialRightCol) {
            var uvBaseRC = [];
            a = 0;
            b = 0;
            c = offsetX / tileHeight;
            d = 1;
            uvBaseRC[0] = [a, b, c, b, c, d, a, d];
            uvBaseRC[1] = [a, b, c, b, c, d, a, d];
            if (flipTile === Mesh.ROTATE_TILE || flipTile === Mesh.ROTATE_ROW) {
                uvBaseRC[1] = [1 - a, 1 - b, 1 - c, 1 - b, 1 - c, 1 - d, 1 - a, 1 - d];
            }
            if (flipTile === Mesh.FLIP_TILE || flipTile === Mesh.FLIP_ROW) {
                uvBaseRC[1] = [1 - a, b, 1 - c, b, 1 - c, d, 1 - a, d];
            }
            if (flipTile === Mesh.FLIP_N_ROTATE_TILE || flipTile === Mesh.FLIP_N_ROTATE_ROW) {
                uvBaseRC[1] = [a, 1 - b, c, 1 - b, c, 1 - d, a, 1 - d];
            }
            for (var y = 0; y < tilesY; y++) {
                positions.push(endX - offsetX + adjustX, -halfHeight + y * tileHeight + adjustY, 0);
                positions.push(endX + adjustX, -halfHeight + y * tileHeight + adjustY, 0);
                positions.push(endX + adjustX, -halfHeight + (y + 1) * tileHeight + adjustY, 0);
                positions.push(endX - offsetX + adjustX, -halfHeight + (y + 1) * tileHeight + adjustY, 0);
                indices.push(index, index + 1, index + 3, index + 1, index + 2, index + 3);
                index += 4;
                if (flipTile === Mesh.FLIP_TILE || flipTile === Mesh.ROTATE_TILE || flipTile === Mesh.FLIP_N_ROTATE_TILE) {
                    uvs = uvs.concat(uvBaseRC[(y + tilesX) % 2]);
                }
                else if (flipTile === Mesh.FLIP_ROW || flipTile === Mesh.ROTATE_ROW || flipTile === Mesh.FLIP_N_ROTATE_ROW) {
                    uvs = uvs.concat(uvBaseRC[y % 2]);
                }
                else {
                    uvs = uvs.concat(uvBaseRC[0]);
                }
                colors.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
                normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
            }
        }
    }
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    // sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    var totalColors = (sideOrientation === VertexData.DOUBLESIDE) ? colors.concat(colors) : colors;
    vertexData.colors = totalColors;
    return vertexData;
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var TiledPlaneBuilder = /** @class */ (function () {
    function TiledPlaneBuilder() {
    }
    /**
     * Creates a tiled plane mesh
     * * The parameter `pattern` will, depending on value, do nothing or
     * * * flip (reflect about central vertical) alternate tiles across and up
     * * * flip every tile on alternate rows
     * * * rotate (180 degs) alternate tiles across and up
     * * * rotate every tile on alternate rows
     * * * flip and rotate alternate tiles across and up
     * * * flip and rotate every tile on alternate rows
     * * The parameter `tileSize` sets the size (float) of each tile side (default 1)
     * * You can set some different tile dimensions by using the parameters `tileWidth` and `tileHeight` (both by default have the same value of `tileSize`)
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
     * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
     * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
     * @see https://doc.babylonjs.com/how_to/set_shapes#box
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the box mesh
     */
    TiledPlaneBuilder.CreateTiledPlane = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var plane = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        plane._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreateTiledPlane(options);
        vertexData.applyToMesh(plane, options.updatable);
        return plane;
    };
    return TiledPlaneBuilder;
}());

Mesh._GroundMeshParser = function (parsedMesh, scene) {
    return GroundMesh.Parse(parsedMesh, scene);
};
/**
 * Mesh representing the gorund
 */
var GroundMesh = /** @class */ (function (_super) {
    __extends(GroundMesh, _super);
    function GroundMesh(name, scene) {
        var _this = _super.call(this, name, scene) || this;
        /** If octree should be generated */
        _this.generateOctree = false;
        return _this;
    }
    /**
     * "GroundMesh"
     * @returns "GroundMesh"
     */
    GroundMesh.prototype.getClassName = function () {
        return "GroundMesh";
    };
    Object.defineProperty(GroundMesh.prototype, "subdivisions", {
        /**
         * The minimum of x and y subdivisions
         */
        get: function () {
            return Math.min(this._subdivisionsX, this._subdivisionsY);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GroundMesh.prototype, "subdivisionsX", {
        /**
         * X subdivisions
         */
        get: function () {
            return this._subdivisionsX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GroundMesh.prototype, "subdivisionsY", {
        /**
         * Y subdivisions
         */
        get: function () {
            return this._subdivisionsY;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * This function will update an octree to help to select the right submeshes for rendering, picking and collision computations.
     * Please note that you must have a decent number of submeshes to get performance improvements when using an octree
     * @param chunksCount the number of subdivisions for x and y
     * @param octreeBlocksSize (Default: 32)
     */
    GroundMesh.prototype.optimize = function (chunksCount, octreeBlocksSize) {
        if (octreeBlocksSize === void 0) { octreeBlocksSize = 32; }
        this._subdivisionsX = chunksCount;
        this._subdivisionsY = chunksCount;
        this.subdivide(chunksCount);
        // Call the octree system optimization if it is defined.
        var thisAsAny = this;
        if (thisAsAny.createOrUpdateSubmeshesOctree) {
            thisAsAny.createOrUpdateSubmeshesOctree(octreeBlocksSize);
        }
    };
    /**
     * Returns a height (y) value in the Worl system :
     * the ground altitude at the coordinates (x, z) expressed in the World system.
     * @param x x coordinate
     * @param z z coordinate
     * @returns the ground y position if (x, z) are outside the ground surface.
     */
    GroundMesh.prototype.getHeightAtCoordinates = function (x, z) {
        var world = this.getWorldMatrix();
        var invMat = TmpVectors.Matrix[5];
        world.invertToRef(invMat);
        var tmpVect = TmpVectors.Vector3[8];
        Vector3.TransformCoordinatesFromFloatsToRef(x, 0.0, z, invMat, tmpVect); // transform x,z in the mesh local space
        x = tmpVect.x;
        z = tmpVect.z;
        if (x < this._minX || x > this._maxX || z < this._minZ || z > this._maxZ) {
            return this.position.y;
        }
        if (!this._heightQuads || this._heightQuads.length == 0) {
            this._initHeightQuads();
            this._computeHeightQuads();
        }
        var facet = this._getFacetAt(x, z);
        var y = -(facet.x * x + facet.z * z + facet.w) / facet.y;
        // return y in the World system
        Vector3.TransformCoordinatesFromFloatsToRef(0.0, y, 0.0, world, tmpVect);
        return tmpVect.y;
    };
    /**
     * Returns a normalized vector (Vector3) orthogonal to the ground
     * at the ground coordinates (x, z) expressed in the World system.
     * @param x x coordinate
     * @param z z coordinate
     * @returns Vector3(0.0, 1.0, 0.0) if (x, z) are outside the ground surface.
     */
    GroundMesh.prototype.getNormalAtCoordinates = function (x, z) {
        var normal = new Vector3(0.0, 1.0, 0.0);
        this.getNormalAtCoordinatesToRef(x, z, normal);
        return normal;
    };
    /**
     * Updates the Vector3 passed a reference with a normalized vector orthogonal to the ground
     * at the ground coordinates (x, z) expressed in the World system.
     * Doesn't uptade the reference Vector3 if (x, z) are outside the ground surface.
     * @param x x coordinate
     * @param z z coordinate
     * @param ref vector to store the result
     * @returns the GroundMesh.
     */
    GroundMesh.prototype.getNormalAtCoordinatesToRef = function (x, z, ref) {
        var world = this.getWorldMatrix();
        var tmpMat = TmpVectors.Matrix[5];
        world.invertToRef(tmpMat);
        var tmpVect = TmpVectors.Vector3[8];
        Vector3.TransformCoordinatesFromFloatsToRef(x, 0.0, z, tmpMat, tmpVect); // transform x,z in the mesh local space
        x = tmpVect.x;
        z = tmpVect.z;
        if (x < this._minX || x > this._maxX || z < this._minZ || z > this._maxZ) {
            return this;
        }
        if (!this._heightQuads || this._heightQuads.length == 0) {
            this._initHeightQuads();
            this._computeHeightQuads();
        }
        var facet = this._getFacetAt(x, z);
        Vector3.TransformNormalFromFloatsToRef(facet.x, facet.y, facet.z, world, ref);
        return this;
    };
    /**
    * Force the heights to be recomputed for getHeightAtCoordinates() or getNormalAtCoordinates()
    * if the ground has been updated.
    * This can be used in the render loop.
    * @returns the GroundMesh.
    */
    GroundMesh.prototype.updateCoordinateHeights = function () {
        if (!this._heightQuads || this._heightQuads.length == 0) {
            this._initHeightQuads();
        }
        this._computeHeightQuads();
        return this;
    };
    // Returns the element "facet" from the heightQuads array relative to (x, z) local coordinates
    GroundMesh.prototype._getFacetAt = function (x, z) {
        // retrieve col and row from x, z coordinates in the ground local system
        var col = Math.floor((x + this._maxX) * this._subdivisionsX / this._width);
        var row = Math.floor(-(z + this._maxZ) * this._subdivisionsY / this._height + this._subdivisionsY);
        var quad = this._heightQuads[row * this._subdivisionsX + col];
        var facet;
        if (z < quad.slope.x * x + quad.slope.y) {
            facet = quad.facet1;
        }
        else {
            facet = quad.facet2;
        }
        return facet;
    };
    //  Creates and populates the heightMap array with "facet" elements :
    // a quad is two triangular facets separated by a slope, so a "facet" element is 1 slope + 2 facets
    // slope : Vector2(c, h) = 2D diagonal line equation setting appart two triangular facets in a quad : z = cx + h
    // facet1 : Vector4(a, b, c, d) = first facet 3D plane equation : ax + by + cz + d = 0
    // facet2 :  Vector4(a, b, c, d) = second facet 3D plane equation : ax + by + cz + d = 0
    // Returns the GroundMesh.
    GroundMesh.prototype._initHeightQuads = function () {
        var subdivisionsX = this._subdivisionsX;
        var subdivisionsY = this._subdivisionsY;
        this._heightQuads = new Array();
        for (var row = 0; row < subdivisionsY; row++) {
            for (var col = 0; col < subdivisionsX; col++) {
                var quad = { slope: Vector2.Zero(), facet1: new Vector4(0.0, 0.0, 0.0, 0.0), facet2: new Vector4(0.0, 0.0, 0.0, 0.0) };
                this._heightQuads[row * subdivisionsX + col] = quad;
            }
        }
        return this;
    };
    // Compute each quad element values and update the the heightMap array :
    // slope : Vector2(c, h) = 2D diagonal line equation setting appart two triangular facets in a quad : z = cx + h
    // facet1 : Vector4(a, b, c, d) = first facet 3D plane equation : ax + by + cz + d = 0
    // facet2 :  Vector4(a, b, c, d) = second facet 3D plane equation : ax + by + cz + d = 0
    // Returns the GroundMesh.
    GroundMesh.prototype._computeHeightQuads = function () {
        var positions = this.getVerticesData(VertexBuffer.PositionKind);
        if (!positions) {
            return this;
        }
        var v1 = TmpVectors.Vector3[3];
        var v2 = TmpVectors.Vector3[2];
        var v3 = TmpVectors.Vector3[1];
        var v4 = TmpVectors.Vector3[0];
        var v1v2 = TmpVectors.Vector3[4];
        var v1v3 = TmpVectors.Vector3[5];
        var v1v4 = TmpVectors.Vector3[6];
        var norm1 = TmpVectors.Vector3[7];
        var norm2 = TmpVectors.Vector3[8];
        var i = 0;
        var j = 0;
        var k = 0;
        var cd = 0; // 2D slope coefficient : z = cd * x + h
        var h = 0;
        var d1 = 0; // facet plane equation : ax + by + cz + d = 0
        var d2 = 0;
        var subdivisionsX = this._subdivisionsX;
        var subdivisionsY = this._subdivisionsY;
        for (var row = 0; row < subdivisionsY; row++) {
            for (var col = 0; col < subdivisionsX; col++) {
                i = col * 3;
                j = row * (subdivisionsX + 1) * 3;
                k = (row + 1) * (subdivisionsX + 1) * 3;
                v1.x = positions[j + i];
                v1.y = positions[j + i + 1];
                v1.z = positions[j + i + 2];
                v2.x = positions[j + i + 3];
                v2.y = positions[j + i + 4];
                v2.z = positions[j + i + 5];
                v3.x = positions[k + i];
                v3.y = positions[k + i + 1];
                v3.z = positions[k + i + 2];
                v4.x = positions[k + i + 3];
                v4.y = positions[k + i + 4];
                v4.z = positions[k + i + 5];
                // 2D slope V1V4
                cd = (v4.z - v1.z) / (v4.x - v1.x);
                h = v1.z - cd * v1.x; // v1 belongs to the slope
                // facet equations :
                // we compute each facet normal vector
                // the equation of the facet plane is : norm.x * x + norm.y * y + norm.z * z + d = 0
                // we compute the value d by applying the equation to v1 which belongs to the plane
                // then we store the facet equation in a Vector4
                v2.subtractToRef(v1, v1v2);
                v3.subtractToRef(v1, v1v3);
                v4.subtractToRef(v1, v1v4);
                Vector3.CrossToRef(v1v4, v1v3, norm1); // caution : CrossToRef uses the Tmp class
                Vector3.CrossToRef(v1v2, v1v4, norm2);
                norm1.normalize();
                norm2.normalize();
                d1 = -(norm1.x * v1.x + norm1.y * v1.y + norm1.z * v1.z);
                d2 = -(norm2.x * v2.x + norm2.y * v2.y + norm2.z * v2.z);
                var quad = this._heightQuads[row * subdivisionsX + col];
                quad.slope.copyFromFloats(cd, h);
                quad.facet1.copyFromFloats(norm1.x, norm1.y, norm1.z, d1);
                quad.facet2.copyFromFloats(norm2.x, norm2.y, norm2.z, d2);
            }
        }
        return this;
    };
    /**
     * Serializes this ground mesh
     * @param serializationObject object to write serialization to
     */
    GroundMesh.prototype.serialize = function (serializationObject) {
        _super.prototype.serialize.call(this, serializationObject);
        serializationObject.subdivisionsX = this._subdivisionsX;
        serializationObject.subdivisionsY = this._subdivisionsY;
        serializationObject.minX = this._minX;
        serializationObject.maxX = this._maxX;
        serializationObject.minZ = this._minZ;
        serializationObject.maxZ = this._maxZ;
        serializationObject.width = this._width;
        serializationObject.height = this._height;
    };
    /**
     * Parses a serialized ground mesh
     * @param parsedMesh the serialized mesh
     * @param scene the scene to create the ground mesh in
     * @returns the created ground mesh
     */
    GroundMesh.Parse = function (parsedMesh, scene) {
        var result = new GroundMesh(parsedMesh.name, scene);
        result._subdivisionsX = parsedMesh.subdivisionsX || 1;
        result._subdivisionsY = parsedMesh.subdivisionsY || 1;
        result._minX = parsedMesh.minX;
        result._maxX = parsedMesh.maxX;
        result._minZ = parsedMesh.minZ;
        result._maxZ = parsedMesh.maxZ;
        result._width = parsedMesh.width;
        result._height = parsedMesh.height;
        return result;
    };
    return GroundMesh;
}(Mesh));

VertexData.CreateGround = function (options) {
    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var row, col;
    var width = options.width || 1;
    var height = options.height || 1;
    var subdivisionsX = options.subdivisionsX || options.subdivisions || 1;
    var subdivisionsY = options.subdivisionsY || options.subdivisions || 1;
    for (row = 0; row <= subdivisionsY; row++) {
        for (col = 0; col <= subdivisionsX; col++) {
            var position = new Vector3((col * width) / subdivisionsX - (width / 2.0), 0, ((subdivisionsY - row) * height) / subdivisionsY - (height / 2.0));
            var normal = new Vector3(0, 1.0, 0);
            positions.push(position.x, position.y, position.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(col / subdivisionsX, 1.0 - row / subdivisionsY);
        }
    }
    for (row = 0; row < subdivisionsY; row++) {
        for (col = 0; col < subdivisionsX; col++) {
            indices.push(col + 1 + (row + 1) * (subdivisionsX + 1));
            indices.push(col + 1 + row * (subdivisionsX + 1));
            indices.push(col + row * (subdivisionsX + 1));
            indices.push(col + (row + 1) * (subdivisionsX + 1));
            indices.push(col + 1 + (row + 1) * (subdivisionsX + 1));
            indices.push(col + row * (subdivisionsX + 1));
        }
    }
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    return vertexData;
};
VertexData.CreateTiledGround = function (options) {
    var xmin = (options.xmin !== undefined && options.xmin !== null) ? options.xmin : -1.0;
    var zmin = (options.zmin !== undefined && options.zmin !== null) ? options.zmin : -1.0;
    var xmax = (options.xmax !== undefined && options.xmax !== null) ? options.xmax : 1.0;
    var zmax = (options.zmax !== undefined && options.zmax !== null) ? options.zmax : 1.0;
    var subdivisions = options.subdivisions || { w: 1, h: 1 };
    var precision = options.precision || { w: 1, h: 1 };
    var indices = new Array();
    var positions = new Array();
    var normals = new Array();
    var uvs = new Array();
    var row, col, tileRow, tileCol;
    subdivisions.h = (subdivisions.h < 1) ? 1 : subdivisions.h;
    subdivisions.w = (subdivisions.w < 1) ? 1 : subdivisions.w;
    precision.w = (precision.w < 1) ? 1 : precision.w;
    precision.h = (precision.h < 1) ? 1 : precision.h;
    var tileSize = {
        'w': (xmax - xmin) / subdivisions.w,
        'h': (zmax - zmin) / subdivisions.h
    };
    function applyTile(xTileMin, zTileMin, xTileMax, zTileMax) {
        // Indices
        var base = positions.length / 3;
        var rowLength = precision.w + 1;
        for (row = 0; row < precision.h; row++) {
            for (col = 0; col < precision.w; col++) {
                var square = [
                    base + col + row * rowLength,
                    base + (col + 1) + row * rowLength,
                    base + (col + 1) + (row + 1) * rowLength,
                    base + col + (row + 1) * rowLength
                ];
                indices.push(square[1]);
                indices.push(square[2]);
                indices.push(square[3]);
                indices.push(square[0]);
                indices.push(square[1]);
                indices.push(square[3]);
            }
        }
        // Position, normals and uvs
        var position = Vector3.Zero();
        var normal = new Vector3(0, 1.0, 0);
        for (row = 0; row <= precision.h; row++) {
            position.z = (row * (zTileMax - zTileMin)) / precision.h + zTileMin;
            for (col = 0; col <= precision.w; col++) {
                position.x = (col * (xTileMax - xTileMin)) / precision.w + xTileMin;
                position.y = 0;
                positions.push(position.x, position.y, position.z);
                normals.push(normal.x, normal.y, normal.z);
                uvs.push(col / precision.w, row / precision.h);
            }
        }
    }
    for (tileRow = 0; tileRow < subdivisions.h; tileRow++) {
        for (tileCol = 0; tileCol < subdivisions.w; tileCol++) {
            applyTile(xmin + tileCol * tileSize.w, zmin + tileRow * tileSize.h, xmin + (tileCol + 1) * tileSize.w, zmin + (tileRow + 1) * tileSize.h);
        }
    }
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    return vertexData;
};
VertexData.CreateGroundFromHeightMap = function (options) {
    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var row, col;
    var filter = options.colorFilter || new Color3(0.3, 0.59, 0.11);
    var alphaFilter = options.alphaFilter || 0.0;
    var invert = false;
    if (options.minHeight > options.maxHeight) {
        invert = true;
        var temp = options.maxHeight;
        options.maxHeight = options.minHeight;
        options.minHeight = temp;
    }
    // Vertices
    for (row = 0; row <= options.subdivisions; row++) {
        for (col = 0; col <= options.subdivisions; col++) {
            var position = new Vector3((col * options.width) / options.subdivisions - (options.width / 2.0), 0, ((options.subdivisions - row) * options.height) / options.subdivisions - (options.height / 2.0));
            // Compute height
            var heightMapX = (((position.x + options.width / 2) / options.width) * (options.bufferWidth - 1)) | 0;
            var heightMapY = ((1.0 - (position.z + options.height / 2) / options.height) * (options.bufferHeight - 1)) | 0;
            var pos = (heightMapX + heightMapY * options.bufferWidth) * 4;
            var r = options.buffer[pos] / 255.0;
            var g = options.buffer[pos + 1] / 255.0;
            var b = options.buffer[pos + 2] / 255.0;
            var a = options.buffer[pos + 3] / 255.0;
            if (invert) {
                r = 1.0 - r;
                g = 1.0 - g;
                b = 1.0 - b;
            }
            var gradient = r * filter.r + g * filter.g + b * filter.b;
            // If our alpha channel is not within our filter then we will assign a 'special' height
            // Then when building the indices, we will ignore any vertex that is using the special height
            if (a >= alphaFilter) {
                position.y = options.minHeight + (options.maxHeight - options.minHeight) * gradient;
            }
            else {
                position.y = options.minHeight - Epsilon; // We can't have a height below minHeight, normally.
            }
            // Add  vertex
            positions.push(position.x, position.y, position.z);
            normals.push(0, 0, 0);
            uvs.push(col / options.subdivisions, 1.0 - row / options.subdivisions);
        }
    }
    // Indices
    for (row = 0; row < options.subdivisions; row++) {
        for (col = 0; col < options.subdivisions; col++) {
            // Calculate Indices
            var idx1 = (col + 1 + (row + 1) * (options.subdivisions + 1));
            var idx2 = (col + 1 + row * (options.subdivisions + 1));
            var idx3 = (col + row * (options.subdivisions + 1));
            var idx4 = (col + (row + 1) * (options.subdivisions + 1));
            // Check that all indices are visible (based on our special height)
            // Only display the vertex if all Indices are visible
            // Positions are stored x,y,z for each vertex, hence the * 3 and + 1 for height
            var isVisibleIdx1 = positions[idx1 * 3 + 1] >= options.minHeight;
            var isVisibleIdx2 = positions[idx2 * 3 + 1] >= options.minHeight;
            var isVisibleIdx3 = positions[idx3 * 3 + 1] >= options.minHeight;
            if (isVisibleIdx1 && isVisibleIdx2 && isVisibleIdx3) {
                indices.push(idx1);
                indices.push(idx2);
                indices.push(idx3);
            }
            var isVisibleIdx4 = positions[idx4 * 3 + 1] >= options.minHeight;
            if (isVisibleIdx4 && isVisibleIdx1 && isVisibleIdx3) {
                indices.push(idx4);
                indices.push(idx1);
                indices.push(idx3);
            }
        }
    }
    // Normals
    VertexData.ComputeNormals(positions, indices, normals);
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    return vertexData;
};
Mesh.CreateGround = function (name, width, height, subdivisions, scene, updatable) {
    var options = {
        width: width,
        height: height,
        subdivisions: subdivisions,
        updatable: updatable
    };
    return GroundBuilder.CreateGround(name, options, scene);
};
Mesh.CreateTiledGround = function (name, xmin, zmin, xmax, zmax, subdivisions, precision, scene, updatable) {
    var options = {
        xmin: xmin,
        zmin: zmin,
        xmax: xmax,
        zmax: zmax,
        subdivisions: subdivisions,
        precision: precision,
        updatable: updatable
    };
    return GroundBuilder.CreateTiledGround(name, options, scene);
};
Mesh.CreateGroundFromHeightMap = function (name, url, width, height, subdivisions, minHeight, maxHeight, scene, updatable, onReady, alphaFilter) {
    var options = {
        width: width,
        height: height,
        subdivisions: subdivisions,
        minHeight: minHeight,
        maxHeight: maxHeight,
        updatable: updatable,
        onReady: onReady,
        alphaFilter: alphaFilter
    };
    return GroundBuilder.CreateGroundFromHeightMap(name, url, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var GroundBuilder = /** @class */ (function () {
    function GroundBuilder() {
    }
    /**
     * Creates a ground mesh
     * * The parameters `width` and `height` (floats, default 1) set the width and height sizes of the ground
     * * The parameter `subdivisions` (positive integer) sets the number of subdivisions per side
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the ground mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#ground
     */
    GroundBuilder.CreateGround = function (name, options, scene) {
        var ground = new GroundMesh(name, scene);
        ground._setReady(false);
        ground._subdivisionsX = options.subdivisionsX || options.subdivisions || 1;
        ground._subdivisionsY = options.subdivisionsY || options.subdivisions || 1;
        ground._width = options.width || 1;
        ground._height = options.height || 1;
        ground._maxX = ground._width / 2;
        ground._maxZ = ground._height / 2;
        ground._minX = -ground._maxX;
        ground._minZ = -ground._maxZ;
        var vertexData = VertexData.CreateGround(options);
        vertexData.applyToMesh(ground, options.updatable);
        ground._setReady(true);
        return ground;
    };
    /**
     * Creates a tiled ground mesh
     * * The parameters `xmin` and `xmax` (floats, default -1 and 1) set the ground minimum and maximum X coordinates
     * * The parameters `zmin` and `zmax` (floats, default -1 and 1) set the ground minimum and maximum Z coordinates
     * * The parameter `subdivisions` is a javascript object `{w: positive integer, h: positive integer}` (default `{w: 6, h: 6}`). `w` and `h` are the numbers of subdivisions on the ground width and height. Each subdivision is called a tile
     * * The parameter `precision` is a javascript object `{w: positive integer, h: positive integer}` (default `{w: 2, h: 2}`). `w` and `h` are the numbers of subdivisions on the ground width and height of each tile
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the tiled ground mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#tiled-ground
     */
    GroundBuilder.CreateTiledGround = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var tiledGround = new Mesh(name, scene);
        var vertexData = VertexData.CreateTiledGround(options);
        vertexData.applyToMesh(tiledGround, options.updatable);
        return tiledGround;
    };
    /**
     * Creates a ground mesh from a height map
     * * The parameter `url` sets the URL of the height map image resource.
     * * The parameters `width` and `height` (positive floats, default 10) set the ground width and height sizes.
     * * The parameter `subdivisions` (positive integer, default 1) sets the number of subdivision per side.
     * * The parameter `minHeight` (float, default 0) is the minimum altitude on the ground.
     * * The parameter `maxHeight` (float, default 1) is the maximum altitude on the ground.
     * * The parameter `colorFilter` (optional Color3, default (0.3, 0.59, 0.11) ) is the filter to apply to the image pixel colors to compute the height.
     * * The parameter `onReady` is a javascript callback function that will be called  once the mesh is just built (the height map download can last some time).
     * * The parameter `alphaFilter` will filter any data where the alpha channel is below this value, defaults 0 (all data visible)
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param url defines the url to the height map
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the ground mesh
     * @see https://doc.babylonjs.com/babylon101/height_map
     * @see https://doc.babylonjs.com/how_to/set_shapes#ground-from-a-height-map
     */
    GroundBuilder.CreateGroundFromHeightMap = function (name, url, options, scene) {
        if (scene === void 0) { scene = null; }
        var width = options.width || 10.0;
        var height = options.height || 10.0;
        var subdivisions = options.subdivisions || 1 | 0;
        var minHeight = options.minHeight || 0.0;
        var maxHeight = options.maxHeight || 1.0;
        var filter = options.colorFilter || new Color3(0.3, 0.59, 0.11);
        var alphaFilter = options.alphaFilter || 0.0;
        var updatable = options.updatable;
        var onReady = options.onReady;
        scene = scene || EngineStore.LastCreatedScene;
        var ground = new GroundMesh(name, scene);
        ground._subdivisionsX = subdivisions;
        ground._subdivisionsY = subdivisions;
        ground._width = width;
        ground._height = height;
        ground._maxX = ground._width / 2.0;
        ground._maxZ = ground._height / 2.0;
        ground._minX = -ground._maxX;
        ground._minZ = -ground._maxZ;
        ground._setReady(false);
        var onload = function (img) {
            var bufferWidth = img.width;
            var bufferHeight = img.height;
            // Getting height map data
            var canvas = CanvasGenerator.CreateCanvas(bufferWidth, bufferHeight);
            var context = canvas.getContext("2d");
            if (!context) {
                throw new Error("Unable to get 2d context for CreateGroundFromHeightMap");
            }
            if (scene.isDisposed) {
                return;
            }
            context.drawImage(img, 0, 0);
            // Create VertexData from map data
            // Cast is due to wrong definition in lib.d.ts from ts 1.3 - https://github.com/Microsoft/TypeScript/issues/949
            var buffer = context.getImageData(0, 0, bufferWidth, bufferHeight).data;
            var vertexData = VertexData.CreateGroundFromHeightMap({
                width: width, height: height,
                subdivisions: subdivisions,
                minHeight: minHeight, maxHeight: maxHeight, colorFilter: filter,
                buffer: buffer, bufferWidth: bufferWidth, bufferHeight: bufferHeight,
                alphaFilter: alphaFilter
            });
            vertexData.applyToMesh(ground, updatable);
            //execute ready callback, if set
            if (onReady) {
                onReady(ground);
            }
            ground._setReady(true);
        };
        Tools.LoadImage(url, onload, function () { }, scene.offlineProvider);
        return ground;
    };
    return GroundBuilder;
}());

Mesh.CreateTube = function (name, path, radius, tessellation, radiusFunction, cap, scene, updatable, sideOrientation, instance) {
    var options = {
        path: path,
        radius: radius,
        tessellation: tessellation,
        radiusFunction: radiusFunction,
        arc: 1,
        cap: cap,
        updatable: updatable,
        sideOrientation: sideOrientation,
        instance: instance
    };
    return TubeBuilder.CreateTube(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var TubeBuilder = /** @class */ (function () {
    function TubeBuilder() {
    }
    /**
     * Creates a tube mesh.
     * The tube is a parametric shape. It has no predefined shape. Its final shape will depend on the input parameters
     * * The parameter `path` is a required array of successive Vector3. It is the curve used as the axis of the tube
     * * The parameter `radius` (positive float, default 1) sets the tube radius size
     * * The parameter `tessellation` (positive float, default 64) is the number of sides on the tubular surface
     * * The parameter `radiusFunction` (javascript function, default null) is a vanilla javascript function. If it is not null, it overwrittes the parameter `radius`
     * * This function is called on each point of the tube path and is passed the index `i` of the i-th point and the distance of this point from the first point of the path. It must return a radius value (positive float)
     * * The parameter `arc` (positive float, maximum 1, default 1) is the ratio to apply to the tube circumference : 2 x PI x arc
     * * The parameter `cap` sets the way the extruded shape is capped. Possible values : BABYLON.Mesh.NO_CAP (default), BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL
     * * The optional parameter `instance` is an instance of an existing Tube object to be updated with the passed `pathArray` parameter : https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#tube
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The optional parameter `invertUV` (boolean, default false) swaps in the geometry the U and V coordinates to apply a texture
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the tube mesh
     * @see https://doc.babylonjs.com/how_to/parametric_shapes
     * @see https://doc.babylonjs.com/how_to/set_shapes#tube
     */
    TubeBuilder.CreateTube = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var path = options.path;
        var instance = options.instance;
        var radius = 1.0;
        if (options.radius !== undefined) {
            radius = options.radius;
        }
        else if (instance) {
            radius = instance._creationDataStorage.radius;
        }
        var tessellation = options.tessellation || 64 | 0;
        var radiusFunction = options.radiusFunction || null;
        var cap = options.cap || Mesh.NO_CAP;
        var invertUV = options.invertUV || false;
        var updatable = options.updatable;
        var sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        options.arc = options.arc && (options.arc <= 0.0 || options.arc > 1.0) ? 1.0 : options.arc || 1.0;
        // tube geometry
        var tubePathArray = function (path, path3D, circlePaths, radius, tessellation, radiusFunction, cap, arc) {
            var tangents = path3D.getTangents();
            var normals = path3D.getNormals();
            var distances = path3D.getDistances();
            var pi2 = Math.PI * 2;
            var step = pi2 / tessellation * arc;
            var returnRadius = function () { return radius; };
            var radiusFunctionFinal = radiusFunction || returnRadius;
            var circlePath;
            var rad;
            var normal;
            var rotated;
            var rotationMatrix = TmpVectors.Matrix[0];
            var index = (cap === Mesh.NO_CAP || cap === Mesh.CAP_END) ? 0 : 2;
            for (var i = 0; i < path.length; i++) {
                rad = radiusFunctionFinal(i, distances[i]); // current radius
                circlePath = Array(); // current circle array
                normal = normals[i]; // current normal
                for (var t = 0; t < tessellation; t++) {
                    Matrix.RotationAxisToRef(tangents[i], step * t, rotationMatrix);
                    rotated = circlePath[t] ? circlePath[t] : Vector3.Zero();
                    Vector3.TransformCoordinatesToRef(normal, rotationMatrix, rotated);
                    rotated.scaleInPlace(rad).addInPlace(path[i]);
                    circlePath[t] = rotated;
                }
                circlePaths[index] = circlePath;
                index++;
            }
            // cap
            var capPath = function (nbPoints, pathIndex) {
                var pointCap = Array();
                for (var i = 0; i < nbPoints; i++) {
                    pointCap.push(path[pathIndex]);
                }
                return pointCap;
            };
            switch (cap) {
                case Mesh.NO_CAP:
                    break;
                case Mesh.CAP_START:
                    circlePaths[0] = capPath(tessellation, 0);
                    circlePaths[1] = circlePaths[2].slice(0);
                    break;
                case Mesh.CAP_END:
                    circlePaths[index] = circlePaths[index - 1].slice(0);
                    circlePaths[index + 1] = capPath(tessellation, path.length - 1);
                    break;
                case Mesh.CAP_ALL:
                    circlePaths[0] = capPath(tessellation, 0);
                    circlePaths[1] = circlePaths[2].slice(0);
                    circlePaths[index] = circlePaths[index - 1].slice(0);
                    circlePaths[index + 1] = capPath(tessellation, path.length - 1);
                    break;
            }
            return circlePaths;
        };
        var path3D;
        var pathArray;
        if (instance) { // tube update
            var storage = instance._creationDataStorage;
            var arc = options.arc || storage.arc;
            path3D = storage.path3D.update(path);
            pathArray = tubePathArray(path, path3D, storage.pathArray, radius, storage.tessellation, radiusFunction, storage.cap, arc);
            instance = RibbonBuilder.CreateRibbon("", { pathArray: pathArray, instance: instance });
            // Update mode, no need to recreate the storage.
            storage.path3D = path3D;
            storage.pathArray = pathArray;
            storage.arc = arc;
            storage.radius = radius;
            return instance;
        }
        // tube creation
        path3D = new Path3D(path);
        var newPathArray = new Array();
        cap = (cap < 0 || cap > 3) ? 0 : cap;
        pathArray = tubePathArray(path, path3D, newPathArray, radius, tessellation, radiusFunction, cap, options.arc);
        var tube = RibbonBuilder.CreateRibbon(name, { pathArray: pathArray, closePath: true, closeArray: false, updatable: updatable, sideOrientation: sideOrientation, invertUV: invertUV, frontUVs: options.frontUVs, backUVs: options.backUVs }, scene);
        tube._creationDataStorage.pathArray = pathArray;
        tube._creationDataStorage.path3D = path3D;
        tube._creationDataStorage.tessellation = tessellation;
        tube._creationDataStorage.cap = cap;
        tube._creationDataStorage.arc = options.arc;
        tube._creationDataStorage.radius = radius;
        return tube;
    };
    return TubeBuilder;
}());

VertexData.CreatePolyhedron = function (options) {
    // provided polyhedron types :
    // 0 : Tetrahedron, 1 : Octahedron, 2 : Dodecahedron, 3 : Icosahedron, 4 : Rhombicuboctahedron, 5 : Triangular Prism, 6 : Pentagonal Prism, 7 : Hexagonal Prism, 8 : Square Pyramid (J1)
    // 9 : Pentagonal Pyramid (J2), 10 : Triangular Dipyramid (J12), 11 : Pentagonal Dipyramid (J13), 12 : Elongated Square Dipyramid (J15), 13 : Elongated Pentagonal Dipyramid (J16), 14 : Elongated Pentagonal Cupola (J20)
    var polyhedra = [];
    polyhedra[0] = { vertex: [[0, 0, 1.732051], [1.632993, 0, -0.5773503], [-0.8164966, 1.414214, -0.5773503], [-0.8164966, -1.414214, -0.5773503]], face: [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]] };
    polyhedra[1] = { vertex: [[0, 0, 1.414214], [1.414214, 0, 0], [0, 1.414214, 0], [-1.414214, 0, 0], [0, -1.414214, 0], [0, 0, -1.414214]], face: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [1, 4, 5], [1, 5, 2], [2, 5, 3], [3, 5, 4]] };
    polyhedra[2] = {
        vertex: [[0, 0, 1.070466], [0.7136442, 0, 0.7978784], [-0.3568221, 0.618034, 0.7978784], [-0.3568221, -0.618034, 0.7978784], [0.7978784, 0.618034, 0.3568221], [0.7978784, -0.618034, 0.3568221], [-0.9341724, 0.381966, 0.3568221], [0.1362939, 1, 0.3568221], [0.1362939, -1, 0.3568221], [-0.9341724, -0.381966, 0.3568221], [0.9341724, 0.381966, -0.3568221], [0.9341724, -0.381966, -0.3568221], [-0.7978784, 0.618034, -0.3568221], [-0.1362939, 1, -0.3568221], [-0.1362939, -1, -0.3568221], [-0.7978784, -0.618034, -0.3568221], [0.3568221, 0.618034, -0.7978784], [0.3568221, -0.618034, -0.7978784], [-0.7136442, 0, -0.7978784], [0, 0, -1.070466]],
        face: [[0, 1, 4, 7, 2], [0, 2, 6, 9, 3], [0, 3, 8, 5, 1], [1, 5, 11, 10, 4], [2, 7, 13, 12, 6], [3, 9, 15, 14, 8], [4, 10, 16, 13, 7], [5, 8, 14, 17, 11], [6, 12, 18, 15, 9], [10, 11, 17, 19, 16], [12, 13, 16, 19, 18], [14, 15, 18, 19, 17]]
    };
    polyhedra[3] = {
        vertex: [[0, 0, 1.175571], [1.051462, 0, 0.5257311], [0.3249197, 1, 0.5257311], [-0.8506508, 0.618034, 0.5257311], [-0.8506508, -0.618034, 0.5257311], [0.3249197, -1, 0.5257311], [0.8506508, 0.618034, -0.5257311], [0.8506508, -0.618034, -0.5257311], [-0.3249197, 1, -0.5257311], [-1.051462, 0, -0.5257311], [-0.3249197, -1, -0.5257311], [0, 0, -1.175571]],
        face: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 1], [1, 5, 7], [1, 7, 6], [1, 6, 2], [2, 6, 8], [2, 8, 3], [3, 8, 9], [3, 9, 4], [4, 9, 10], [4, 10, 5], [5, 10, 7], [6, 7, 11], [6, 11, 8], [7, 10, 11], [8, 11, 9], [9, 11, 10]]
    };
    polyhedra[4] = {
        vertex: [[0, 0, 1.070722], [0.7148135, 0, 0.7971752], [-0.104682, 0.7071068, 0.7971752], [-0.6841528, 0.2071068, 0.7971752], [-0.104682, -0.7071068, 0.7971752], [0.6101315, 0.7071068, 0.5236279], [1.04156, 0.2071068, 0.1367736], [0.6101315, -0.7071068, 0.5236279], [-0.3574067, 1, 0.1367736], [-0.7888348, -0.5, 0.5236279], [-0.9368776, 0.5, 0.1367736], [-0.3574067, -1, 0.1367736], [0.3574067, 1, -0.1367736], [0.9368776, -0.5, -0.1367736], [0.7888348, 0.5, -0.5236279], [0.3574067, -1, -0.1367736], [-0.6101315, 0.7071068, -0.5236279], [-1.04156, -0.2071068, -0.1367736], [-0.6101315, -0.7071068, -0.5236279], [0.104682, 0.7071068, -0.7971752], [0.6841528, -0.2071068, -0.7971752], [0.104682, -0.7071068, -0.7971752], [-0.7148135, 0, -0.7971752], [0, 0, -1.070722]],
        face: [[0, 2, 3], [1, 6, 5], [4, 9, 11], [7, 15, 13], [8, 16, 10], [12, 14, 19], [17, 22, 18], [20, 21, 23], [0, 1, 5, 2], [0, 3, 9, 4], [0, 4, 7, 1], [1, 7, 13, 6], [2, 5, 12, 8], [2, 8, 10, 3], [3, 10, 17, 9], [4, 11, 15, 7], [5, 6, 14, 12], [6, 13, 20, 14], [8, 12, 19, 16], [9, 17, 18, 11], [10, 16, 22, 17], [11, 18, 21, 15], [13, 15, 21, 20], [14, 20, 23, 19], [16, 19, 23, 22], [18, 22, 23, 21]]
    };
    polyhedra[5] = { vertex: [[0, 0, 1.322876], [1.309307, 0, 0.1889822], [-0.9819805, 0.8660254, 0.1889822], [0.1636634, -1.299038, 0.1889822], [0.3273268, 0.8660254, -0.9449112], [-0.8183171, -0.4330127, -0.9449112]], face: [[0, 3, 1], [2, 4, 5], [0, 1, 4, 2], [0, 2, 5, 3], [1, 3, 5, 4]] };
    polyhedra[6] = { vertex: [[0, 0, 1.159953], [1.013464, 0, 0.5642542], [-0.3501431, 0.9510565, 0.5642542], [-0.7715208, -0.6571639, 0.5642542], [0.6633206, 0.9510565, -0.03144481], [0.8682979, -0.6571639, -0.3996071], [-1.121664, 0.2938926, -0.03144481], [-0.2348831, -1.063314, -0.3996071], [0.5181548, 0.2938926, -0.9953061], [-0.5850262, -0.112257, -0.9953061]], face: [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 9, 7], [5, 7, 9, 8], [0, 3, 7, 5, 1], [2, 4, 8, 9, 6]] };
    polyhedra[7] = { vertex: [[0, 0, 1.118034], [0.8944272, 0, 0.6708204], [-0.2236068, 0.8660254, 0.6708204], [-0.7826238, -0.4330127, 0.6708204], [0.6708204, 0.8660254, 0.2236068], [1.006231, -0.4330127, -0.2236068], [-1.006231, 0.4330127, 0.2236068], [-0.6708204, -0.8660254, -0.2236068], [0.7826238, 0.4330127, -0.6708204], [0.2236068, -0.8660254, -0.6708204], [-0.8944272, 0, -0.6708204], [0, 0, -1.118034]], face: [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 10, 7], [5, 9, 11, 8], [7, 10, 11, 9], [0, 3, 7, 9, 5, 1], [2, 4, 8, 11, 10, 6]] };
    polyhedra[8] = { vertex: [[-0.729665, 0.670121, 0.319155], [-0.655235, -0.29213, -0.754096], [-0.093922, -0.607123, 0.537818], [0.702196, 0.595691, 0.485187], [0.776626, -0.36656, -0.588064]], face: [[1, 4, 2], [0, 1, 2], [3, 0, 2], [4, 3, 2], [4, 1, 0, 3]] };
    polyhedra[9] = { vertex: [[-0.868849, -0.100041, 0.61257], [-0.329458, 0.976099, 0.28078], [-0.26629, -0.013796, -0.477654], [-0.13392, -1.034115, 0.229829], [0.738834, 0.707117, -0.307018], [0.859683, -0.535264, -0.338508]], face: [[3, 0, 2], [5, 3, 2], [4, 5, 2], [1, 4, 2], [0, 1, 2], [0, 3, 5, 4, 1]] };
    polyhedra[10] = { vertex: [[-0.610389, 0.243975, 0.531213], [-0.187812, -0.48795, -0.664016], [-0.187812, 0.9759, -0.664016], [0.187812, -0.9759, 0.664016], [0.798201, 0.243975, 0.132803]], face: [[1, 3, 0], [3, 4, 0], [3, 1, 4], [0, 2, 1], [0, 4, 2], [2, 4, 1]] };
    polyhedra[11] = { vertex: [[-1.028778, 0.392027, -0.048786], [-0.640503, -0.646161, 0.621837], [-0.125162, -0.395663, -0.540059], [0.004683, 0.888447, -0.651988], [0.125161, 0.395663, 0.540059], [0.632925, -0.791376, 0.433102], [1.031672, 0.157063, -0.354165]], face: [[3, 2, 0], [2, 1, 0], [2, 5, 1], [0, 4, 3], [0, 1, 4], [4, 1, 5], [2, 3, 6], [3, 4, 6], [5, 2, 6], [4, 5, 6]] };
    polyhedra[12] = { vertex: [[-0.669867, 0.334933, -0.529576], [-0.669867, 0.334933, 0.529577], [-0.4043, 1.212901, 0], [-0.334933, -0.669867, -0.529576], [-0.334933, -0.669867, 0.529577], [0.334933, 0.669867, -0.529576], [0.334933, 0.669867, 0.529577], [0.4043, -1.212901, 0], [0.669867, -0.334933, -0.529576], [0.669867, -0.334933, 0.529577]], face: [[8, 9, 7], [6, 5, 2], [3, 8, 7], [5, 0, 2], [4, 3, 7], [0, 1, 2], [9, 4, 7], [1, 6, 2], [9, 8, 5, 6], [8, 3, 0, 5], [3, 4, 1, 0], [4, 9, 6, 1]] };
    polyhedra[13] = { vertex: [[-0.931836, 0.219976, -0.264632], [-0.636706, 0.318353, 0.692816], [-0.613483, -0.735083, -0.264632], [-0.326545, 0.979634, 0], [-0.318353, -0.636706, 0.692816], [-0.159176, 0.477529, -0.856368], [0.159176, -0.477529, -0.856368], [0.318353, 0.636706, 0.692816], [0.326545, -0.979634, 0], [0.613482, 0.735082, -0.264632], [0.636706, -0.318353, 0.692816], [0.931835, -0.219977, -0.264632]], face: [[11, 10, 8], [7, 9, 3], [6, 11, 8], [9, 5, 3], [2, 6, 8], [5, 0, 3], [4, 2, 8], [0, 1, 3], [10, 4, 8], [1, 7, 3], [10, 11, 9, 7], [11, 6, 5, 9], [6, 2, 0, 5], [2, 4, 1, 0], [4, 10, 7, 1]] };
    polyhedra[14] = {
        vertex: [[-0.93465, 0.300459, -0.271185], [-0.838689, -0.260219, -0.516017], [-0.711319, 0.717591, 0.128359], [-0.710334, -0.156922, 0.080946], [-0.599799, 0.556003, -0.725148], [-0.503838, -0.004675, -0.969981], [-0.487004, 0.26021, 0.48049], [-0.460089, -0.750282, -0.512622], [-0.376468, 0.973135, -0.325605], [-0.331735, -0.646985, 0.084342], [-0.254001, 0.831847, 0.530001], [-0.125239, -0.494738, -0.966586], [0.029622, 0.027949, 0.730817], [0.056536, -0.982543, -0.262295], [0.08085, 1.087391, 0.076037], [0.125583, -0.532729, 0.485984], [0.262625, 0.599586, 0.780328], [0.391387, -0.726999, -0.716259], [0.513854, -0.868287, 0.139347], [0.597475, 0.85513, 0.326364], [0.641224, 0.109523, 0.783723], [0.737185, -0.451155, 0.538891], [0.848705, -0.612742, -0.314616], [0.976075, 0.365067, 0.32976], [1.072036, -0.19561, 0.084927]],
        face: [[15, 18, 21], [12, 20, 16], [6, 10, 2], [3, 0, 1], [9, 7, 13], [2, 8, 4, 0], [0, 4, 5, 1], [1, 5, 11, 7], [7, 11, 17, 13], [13, 17, 22, 18], [18, 22, 24, 21], [21, 24, 23, 20], [20, 23, 19, 16], [16, 19, 14, 10], [10, 14, 8, 2], [15, 9, 13, 18], [12, 15, 21, 20], [6, 12, 16, 10], [3, 6, 2, 0], [9, 3, 1, 7], [9, 15, 12, 6, 3], [22, 17, 11, 5, 4, 8, 14, 19, 23, 24]]
    };
    var type = options.type && (options.type < 0 || options.type >= polyhedra.length) ? 0 : options.type || 0;
    var size = options.size;
    var sizeX = options.sizeX || size || 1;
    var sizeY = options.sizeY || size || 1;
    var sizeZ = options.sizeZ || size || 1;
    var data = options.custom || polyhedra[type];
    var nbfaces = data.face.length;
    var faceUV = options.faceUV || new Array(nbfaces);
    var faceColors = options.faceColors;
    var flat = (options.flat === undefined) ? true : options.flat;
    var sideOrientation = (options.sideOrientation === 0) ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
    var positions = new Array();
    var indices = new Array();
    var normals = new Array();
    var uvs = new Array();
    var colors = new Array();
    var index = 0;
    var faceIdx = 0; // face cursor in the array "indexes"
    var indexes = new Array();
    var i = 0;
    var f = 0;
    var u, v, ang, x, y, tmp;
    // default face colors and UV if undefined
    if (flat) {
        for (f = 0; f < nbfaces; f++) {
            if (faceColors && faceColors[f] === undefined) {
                faceColors[f] = new Color4(1, 1, 1, 1);
            }
            if (faceUV && faceUV[f] === undefined) {
                faceUV[f] = new Vector4(0, 0, 1, 1);
            }
        }
    }
    if (!flat) {
        for (i = 0; i < data.vertex.length; i++) {
            positions.push(data.vertex[i][0] * sizeX, data.vertex[i][1] * sizeY, data.vertex[i][2] * sizeZ);
            uvs.push(0, 0);
        }
        for (f = 0; f < nbfaces; f++) {
            for (i = 0; i < data.face[f].length - 2; i++) {
                indices.push(data.face[f][0], data.face[f][i + 2], data.face[f][i + 1]);
            }
        }
    }
    else {
        for (f = 0; f < nbfaces; f++) {
            var fl = data.face[f].length; // number of vertices of the current face
            ang = 2 * Math.PI / fl;
            x = 0.5 * Math.tan(ang / 2);
            y = 0.5;
            // positions, uvs, colors
            for (i = 0; i < fl; i++) {
                // positions
                positions.push(data.vertex[data.face[f][i]][0] * sizeX, data.vertex[data.face[f][i]][1] * sizeY, data.vertex[data.face[f][i]][2] * sizeZ);
                indexes.push(index);
                index++;
                // uvs
                u = faceUV[f].x + (faceUV[f].z - faceUV[f].x) * (0.5 + x);
                v = faceUV[f].y + (faceUV[f].w - faceUV[f].y) * (y - 0.5);
                uvs.push(u, v);
                tmp = x * Math.cos(ang) - y * Math.sin(ang);
                y = x * Math.sin(ang) + y * Math.cos(ang);
                x = tmp;
                // colors
                if (faceColors) {
                    colors.push(faceColors[f].r, faceColors[f].g, faceColors[f].b, faceColors[f].a);
                }
            }
            // indices from indexes
            for (i = 0; i < fl - 2; i++) {
                indices.push(indexes[0 + faceIdx], indexes[i + 2 + faceIdx], indexes[i + 1 + faceIdx]);
            }
            faceIdx += fl;
        }
    }
    VertexData.ComputeNormals(positions, indices, normals);
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    var vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    if (faceColors && flat) {
        vertexData.colors = colors;
    }
    return vertexData;
};
Mesh.CreatePolyhedron = function (name, options, scene) {
    return PolyhedronBuilder.CreatePolyhedron(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var PolyhedronBuilder = /** @class */ (function () {
    function PolyhedronBuilder() {
    }
    /**
     * Creates a polyhedron mesh
     * * The parameter `type` (positive integer, max 14, default 0) sets the polyhedron type to build among the 15 embbeded types. Please refer to the type sheet in the tutorial to choose the wanted type
     * * The parameter `size` (positive float, default 1) sets the polygon size
     * * You can overwrite the `size` on each dimension bu using the parameters `sizeX`, `sizeY` or `sizeZ` (positive floats, default to `size` value)
     * * You can build other polyhedron types than the 15 embbeded ones by setting the parameter `custom` (`polyhedronObject`, default null). If you set the parameter `custom`, this overwrittes the parameter `type`
     * * A `polyhedronObject` is a formatted javascript object. You'll find a full file with pre-set polyhedra here : https://github.com/BabylonJS/Extensions/tree/master/Polyhedron
     * * You can set the color and the UV of each side of the polyhedron with the parameters `faceColors` (Color4, default `(1, 1, 1, 1)`) and faceUV (Vector4, default `(0, 0, 1, 1)`)
     * * To understand how to set `faceUV` or `faceColors`, please read this by considering the right number of faces of your polyhedron, instead of only 6 for the box : https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors
     * * The parameter `flat` (boolean, default true). If set to false, it gives the polyhedron a single global face, so less vertices and shared normals. In this case, `faceColors` and `faceUV` are ignored
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the polyhedron mesh
     * @see https://doc.babylonjs.com/how_to/polyhedra_shapes
     */
    PolyhedronBuilder.CreatePolyhedron = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var polyhedron = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        polyhedron._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreatePolyhedron(options);
        vertexData.applyToMesh(polyhedron, options.updatable);
        return polyhedron;
    };
    return PolyhedronBuilder;
}());

VertexData.CreateIcoSphere = function (options) {
    var sideOrientation = options.sideOrientation || VertexData.DEFAULTSIDE;
    var radius = options.radius || 1;
    var flat = (options.flat === undefined) ? true : options.flat;
    var subdivisions = options.subdivisions || 4;
    var radiusX = options.radiusX || radius;
    var radiusY = options.radiusY || radius;
    var radiusZ = options.radiusZ || radius;
    var t = (1 + Math.sqrt(5)) / 2;
    // 12 vertex x,y,z
    var ico_vertices = [
        -1, t, -0, 1, t, 0, -1, -t, 0, 1, -t, 0,
        0, -1, -t, 0, 1, -t, 0, -1, t, 0, 1, t,
        t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, -1 // v8-11
    ];
    // index of 3 vertex makes a face of icopshere
    var ico_indices = [
        0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 12, 22, 23,
        1, 5, 20, 5, 11, 4, 23, 22, 13, 22, 18, 6, 7, 1, 8,
        14, 21, 4, 14, 4, 2, 16, 13, 6, 15, 6, 19, 3, 8, 9,
        4, 21, 5, 13, 17, 23, 6, 13, 22, 19, 6, 18, 9, 8, 1
    ];
    // vertex for uv have aliased position, not for UV
    var vertices_unalias_id = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        // vertex alias
        0,
        2,
        3,
        3,
        3,
        4,
        7,
        8,
        9,
        9,
        10,
        11 // 23: B + 12
    ];
    // uv as integer step (not pixels !)
    var ico_vertexuv = [
        5, 1, 3, 1, 6, 4, 0, 0,
        5, 3, 4, 2, 2, 2, 4, 0,
        2, 0, 1, 1, 6, 0, 6, 2,
        // vertex alias (for same vertex on different faces)
        0, 4,
        3, 3,
        4, 4,
        3, 1,
        4, 2,
        4, 4,
        0, 2,
        1, 1,
        2, 2,
        3, 3,
        1, 3,
        2, 4 // 23: B + 12
    ];
    // Vertices[0, 1, ...9, A, B] : position on UV plane
    // '+' indicate duplicate position to be fixed (3,9:0,2,3,4,7,8,A,B)
    // First island of uv mapping
    // v = 4h          3+  2
    // v = 3h        9+  4
    // v = 2h      9+  5   B
    // v = 1h    9   1   0
    // v = 0h  3   8   7   A
    //     u = 0 1 2 3 4 5 6  *a
    // Second island of uv mapping
    // v = 4h  0+  B+  4+
    // v = 3h    A+  2+
    // v = 2h  7+  6   3+
    // v = 1h    8+  3+
    // v = 0h
    //     u = 0 1 2 3 4 5 6  *a
    // Face layout on texture UV mapping
    // ============
    // \ 4  /\ 16 /   ======
    //  \  /  \  /   /\ 11 /
    //   \/ 7  \/   /  \  /
    //    =======  / 10 \/
    //   /\ 17 /\  =======
    //  /  \  /  \ \ 15 /\
    // / 8  \/ 12 \ \  /  \
    // ============  \/ 6  \
    // \ 18 /\  ============
    //  \  /  \ \ 5  /\ 0  /
    //   \/ 13 \ \  /  \  /
    //   =======  \/ 1  \/
    //       =============
    //      /\ 19 /\  2 /\
    //     /  \  /  \  /  \
    //    / 14 \/ 9  \/  3 \
    //   ===================
    // uv step is u:1 or 0.5, v:cos(30)=sqrt(3)/2, ratio approx is 84/97
    var ustep = 138 / 1024;
    var vstep = 239 / 1024;
    var uoffset = 60 / 1024;
    var voffset = 26 / 1024;
    // Second island should have margin, not to touch the first island
    // avoid any borderline artefact in pixel rounding
    var island_u_offset = -40 / 1024;
    var island_v_offset = +20 / 1024;
    // face is either island 0 or 1 :
    // second island is for faces : [4, 7, 8, 12, 13, 16, 17, 18]
    var island = [
        0, 0, 0, 0, 1,
        0, 0, 1, 1, 0,
        0, 0, 1, 1, 0,
        0, 1, 1, 1, 0 //  15 - 19
    ];
    var indices = new Array();
    var positions = new Array();
    var normals = new Array();
    var uvs = new Array();
    var current_indice = 0;
    // prepare array of 3 vector (empty) (to be worked in place, shared for each face)
    var face_vertex_pos = new Array(3);
    var face_vertex_uv = new Array(3);
    var v012;
    for (v012 = 0; v012 < 3; v012++) {
        face_vertex_pos[v012] = Vector3.Zero();
        face_vertex_uv[v012] = Vector2.Zero();
    }
    // create all with normals
    for (var face = 0; face < 20; face++) {
        // 3 vertex per face
        for (v012 = 0; v012 < 3; v012++) {
            // look up vertex 0,1,2 to its index in 0 to 11 (or 23 including alias)
            var v_id = ico_indices[3 * face + v012];
            // vertex have 3D position (x,y,z)
            face_vertex_pos[v012].copyFromFloats(ico_vertices[3 * vertices_unalias_id[v_id]], ico_vertices[3 * vertices_unalias_id[v_id] + 1], ico_vertices[3 * vertices_unalias_id[v_id] + 2]);
            // Normalize to get normal, then scale to radius
            face_vertex_pos[v012].normalize().scaleInPlace(radius);
            // uv Coordinates from vertex ID
            face_vertex_uv[v012].copyFromFloats(ico_vertexuv[2 * v_id] * ustep + uoffset + island[face] * island_u_offset, ico_vertexuv[2 * v_id + 1] * vstep + voffset + island[face] * island_v_offset);
        }
        // Subdivide the face (interpolate pos, norm, uv)
        // - pos is linear interpolation, then projected to sphere (converge polyhedron to sphere)
        // - norm is linear interpolation of vertex corner normal
        //   (to be checked if better to re-calc from face vertex, or if approximation is OK ??? )
        // - uv is linear interpolation
        //
        // Topology is as below for sub-divide by 2
        // vertex shown as v0,v1,v2
        // interp index is i1 to progress in range [v0,v1[
        // interp index is i2 to progress in range [v0,v2[
        // face index as  (i1,i2)  for /\  : (i1,i2),(i1+1,i2),(i1,i2+1)
        //            and (i1,i2)' for \/  : (i1+1,i2),(i1+1,i2+1),(i1,i2+1)
        //
        //
        //                    i2    v2
        //                    ^    ^
        //                   /    / \
        //                  /    /   \
        //                 /    /     \
        //                /    / (0,1) \
        //               /    #---------\
        //              /    / \ (0,0)'/ \
        //             /    /   \     /   \
        //            /    /     \   /     \
        //           /    / (0,0) \ / (1,0) \
        //          /    #---------#---------\
        //              v0                    v1
        //
        //              --------------------> i1
        //
        // interp of (i1,i2):
        //  along i2 :  x0=lerp(v0,v2, i2/S) <---> x1=lerp(v1,v2, i2/S)
        //  along i1 :  lerp(x0,x1, i1/(S-i2))
        //
        // centroid of triangle is needed to get help normal computation
        //  (c1,c2) are used for centroid location
        var interp_vertex = function (i1, i2, c1, c2) {
            // vertex is interpolated from
            //   - face_vertex_pos[0..2]
            //   - face_vertex_uv[0..2]
            var pos_x0 = Vector3.Lerp(face_vertex_pos[0], face_vertex_pos[2], i2 / subdivisions);
            var pos_x1 = Vector3.Lerp(face_vertex_pos[1], face_vertex_pos[2], i2 / subdivisions);
            var pos_interp = (subdivisions === i2) ? face_vertex_pos[2] : Vector3.Lerp(pos_x0, pos_x1, i1 / (subdivisions - i2));
            pos_interp.normalize();
            var vertex_normal;
            if (flat) {
                // in flat mode, recalculate normal as face centroid normal
                var centroid_x0 = Vector3.Lerp(face_vertex_pos[0], face_vertex_pos[2], c2 / subdivisions);
                var centroid_x1 = Vector3.Lerp(face_vertex_pos[1], face_vertex_pos[2], c2 / subdivisions);
                vertex_normal = Vector3.Lerp(centroid_x0, centroid_x1, c1 / (subdivisions - c2));
            }
            else {
                // in smooth mode, recalculate normal from each single vertex position
                vertex_normal = new Vector3(pos_interp.x, pos_interp.y, pos_interp.z);
            }
            // Vertex normal need correction due to X,Y,Z radius scaling
            vertex_normal.x /= radiusX;
            vertex_normal.y /= radiusY;
            vertex_normal.z /= radiusZ;
            vertex_normal.normalize();
            var uv_x0 = Vector2.Lerp(face_vertex_uv[0], face_vertex_uv[2], i2 / subdivisions);
            var uv_x1 = Vector2.Lerp(face_vertex_uv[1], face_vertex_uv[2], i2 / subdivisions);
            var uv_interp = (subdivisions === i2) ? face_vertex_uv[2] : Vector2.Lerp(uv_x0, uv_x1, i1 / (subdivisions - i2));
            positions.push(pos_interp.x * radiusX, pos_interp.y * radiusY, pos_interp.z * radiusZ);
            normals.push(vertex_normal.x, vertex_normal.y, vertex_normal.z);
            uvs.push(uv_interp.x, uv_interp.y);
            // push each vertex has member of a face
            // Same vertex can bleong to multiple face, it is pushed multiple time (duplicate vertex are present)
            indices.push(current_indice);
            current_indice++;
        };
        for (var i2 = 0; i2 < subdivisions; i2++) {
            for (var i1 = 0; i1 + i2 < subdivisions; i1++) {
                // face : (i1,i2)  for /\  :
                // interp for : (i1,i2),(i1+1,i2),(i1,i2+1)
                interp_vertex(i1, i2, i1 + 1.0 / 3, i2 + 1.0 / 3);
                interp_vertex(i1 + 1, i2, i1 + 1.0 / 3, i2 + 1.0 / 3);
                interp_vertex(i1, i2 + 1, i1 + 1.0 / 3, i2 + 1.0 / 3);
                if (i1 + i2 + 1 < subdivisions) {
                    // face : (i1,i2)' for \/  :
                    // interp for (i1+1,i2),(i1+1,i2+1),(i1,i2+1)
                    interp_vertex(i1 + 1, i2, i1 + 2.0 / 3, i2 + 2.0 / 3);
                    interp_vertex(i1 + 1, i2 + 1, i1 + 2.0 / 3, i2 + 2.0 / 3);
                    interp_vertex(i1, i2 + 1, i1 + 2.0 / 3, i2 + 2.0 / 3);
                }
            }
        }
    }
    // Sides
    VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
    // Result
    var vertexData = new VertexData();
    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    return vertexData;
};
Mesh.CreateIcoSphere = function (name, options, scene) {
    return IcoSphereBuilder.CreateIcoSphere(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var IcoSphereBuilder = /** @class */ (function () {
    function IcoSphereBuilder() {
    }
    /**
     * Creates a sphere based upon an icosahedron with 20 triangular faces which can be subdivided
     * * The parameter `radius` sets the radius size (float) of the icosphere (default 1)
     * * You can set some different icosphere dimensions, for instance to build an ellipsoid, by using the parameters `radiusX`, `radiusY` and `radiusZ` (all by default have the same value of `radius`)
     * * The parameter `subdivisions` sets the number of subdivisions (postive integer, default 4). The more subdivisions, the more faces on the icosphere whatever its size
     * * The parameter `flat` (boolean, default true) gives each side its own normals. Set it to false to get a smooth continuous light reflection on the surface
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the icosahedron mesh
     * @see https://doc.babylonjs.com/how_to/polyhedra_shapes#icosphere
     */
    IcoSphereBuilder.CreateIcoSphere = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        var sphere = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        sphere._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreateIcoSphere(options);
        vertexData.applyToMesh(sphere, options.updatable);
        return sphere;
    };
    return IcoSphereBuilder;
}());

Mesh.CreateDecal = function (name, sourceMesh, position, normal, size, angle) {
    var options = {
        position: position,
        normal: normal,
        size: size,
        angle: angle
    };
    return DecalBuilder.CreateDecal(name, sourceMesh, options);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var DecalBuilder = /** @class */ (function () {
    function DecalBuilder() {
    }
    /**
     * Creates a decal mesh.
     * A decal is a mesh usually applied as a model onto the surface of another mesh. So don't forget the parameter `sourceMesh` depicting the decal
     * * The parameter `position` (Vector3, default `(0, 0, 0)`) sets the position of the decal in World coordinates
     * * The parameter `normal` (Vector3, default `Vector3.Up`) sets the normal of the mesh where the decal is applied onto in World coordinates
     * * The parameter `size` (Vector3, default `(1, 1, 1)`) sets the decal scaling
     * * The parameter `angle` (float in radian, default 0) sets the angle to rotate the decal
     * @param name defines the name of the mesh
     * @param sourceMesh defines the mesh where the decal must be applied
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the decal mesh
     * @see https://doc.babylonjs.com/how_to/decals
     */
    DecalBuilder.CreateDecal = function (name, sourceMesh, options) {
        var indices = sourceMesh.getIndices();
        var positions = sourceMesh.getVerticesData(VertexBuffer.PositionKind);
        var normals = sourceMesh.getVerticesData(VertexBuffer.NormalKind);
        var position = options.position || Vector3.Zero();
        var normal = options.normal || Vector3.Up();
        var size = options.size || Vector3.One();
        var angle = options.angle || 0;
        // Getting correct rotation
        if (!normal) {
            var target = new Vector3(0, 0, 1);
            var camera = sourceMesh.getScene().activeCamera;
            var cameraWorldTarget = Vector3.TransformCoordinates(target, camera.getWorldMatrix());
            normal = camera.globalPosition.subtract(cameraWorldTarget);
        }
        var yaw = -Math.atan2(normal.z, normal.x) - Math.PI / 2;
        var len = Math.sqrt(normal.x * normal.x + normal.z * normal.z);
        var pitch = Math.atan2(normal.y, len);
        // Matrix
        var decalWorldMatrix = Matrix.RotationYawPitchRoll(yaw, pitch, angle).multiply(Matrix.Translation(position.x, position.y, position.z));
        var inverseDecalWorldMatrix = Matrix.Invert(decalWorldMatrix);
        var meshWorldMatrix = sourceMesh.getWorldMatrix();
        var transformMatrix = meshWorldMatrix.multiply(inverseDecalWorldMatrix);
        var vertexData = new VertexData();
        vertexData.indices = [];
        vertexData.positions = [];
        vertexData.normals = [];
        vertexData.uvs = [];
        var currentVertexDataIndex = 0;
        var extractDecalVector3 = function (indexId) {
            var result = new PositionNormalVertex();
            if (!indices || !positions || !normals) {
                return result;
            }
            var vertexId = indices[indexId];
            result.position = new Vector3(positions[vertexId * 3], positions[vertexId * 3 + 1], positions[vertexId * 3 + 2]);
            // Send vector to decal local world
            result.position = Vector3.TransformCoordinates(result.position, transformMatrix);
            // Get normal
            result.normal = new Vector3(normals[vertexId * 3], normals[vertexId * 3 + 1], normals[vertexId * 3 + 2]);
            result.normal = Vector3.TransformNormal(result.normal, transformMatrix);
            return result;
        }; // Inspired by https://github.com/mrdoob/three.js/blob/eee231960882f6f3b6113405f524956145148146/examples/js/geometries/DecalGeometry.js
        var clip = function (vertices, axis) {
            if (vertices.length === 0) {
                return vertices;
            }
            var clipSize = 0.5 * Math.abs(Vector3.Dot(size, axis));
            var clipVertices = function (v0, v1) {
                var clipFactor = Vector3.GetClipFactor(v0.position, v1.position, axis, clipSize);
                return new PositionNormalVertex(Vector3.Lerp(v0.position, v1.position, clipFactor), Vector3.Lerp(v0.normal, v1.normal, clipFactor));
            };
            var result = new Array();
            for (var index = 0; index < vertices.length; index += 3) {
                var v1Out;
                var v2Out;
                var v3Out;
                var total = 0;
                var nV1 = null;
                var nV2 = null;
                var nV3 = null;
                var nV4 = null;
                var d1 = Vector3.Dot(vertices[index].position, axis) - clipSize;
                var d2 = Vector3.Dot(vertices[index + 1].position, axis) - clipSize;
                var d3 = Vector3.Dot(vertices[index + 2].position, axis) - clipSize;
                v1Out = d1 > 0;
                v2Out = d2 > 0;
                v3Out = d3 > 0;
                total = (v1Out ? 1 : 0) + (v2Out ? 1 : 0) + (v3Out ? 1 : 0);
                switch (total) {
                    case 0:
                        result.push(vertices[index]);
                        result.push(vertices[index + 1]);
                        result.push(vertices[index + 2]);
                        break;
                    case 1:
                        if (v1Out) {
                            nV1 = vertices[index + 1];
                            nV2 = vertices[index + 2];
                            nV3 = clipVertices(vertices[index], nV1);
                            nV4 = clipVertices(vertices[index], nV2);
                        }
                        if (v2Out) {
                            nV1 = vertices[index];
                            nV2 = vertices[index + 2];
                            nV3 = clipVertices(vertices[index + 1], nV1);
                            nV4 = clipVertices(vertices[index + 1], nV2);
                            result.push(nV3);
                            result.push(nV2.clone());
                            result.push(nV1.clone());
                            result.push(nV2.clone());
                            result.push(nV3.clone());
                            result.push(nV4);
                            break;
                        }
                        if (v3Out) {
                            nV1 = vertices[index];
                            nV2 = vertices[index + 1];
                            nV3 = clipVertices(vertices[index + 2], nV1);
                            nV4 = clipVertices(vertices[index + 2], nV2);
                        }
                        if (nV1 && nV2 && nV3 && nV4) {
                            result.push(nV1.clone());
                            result.push(nV2.clone());
                            result.push(nV3);
                            result.push(nV4);
                            result.push(nV3.clone());
                            result.push(nV2.clone());
                        }
                        break;
                    case 2:
                        if (!v1Out) {
                            nV1 = vertices[index].clone();
                            nV2 = clipVertices(nV1, vertices[index + 1]);
                            nV3 = clipVertices(nV1, vertices[index + 2]);
                            result.push(nV1);
                            result.push(nV2);
                            result.push(nV3);
                        }
                        if (!v2Out) {
                            nV1 = vertices[index + 1].clone();
                            nV2 = clipVertices(nV1, vertices[index + 2]);
                            nV3 = clipVertices(nV1, vertices[index]);
                            result.push(nV1);
                            result.push(nV2);
                            result.push(nV3);
                        }
                        if (!v3Out) {
                            nV1 = vertices[index + 2].clone();
                            nV2 = clipVertices(nV1, vertices[index]);
                            nV3 = clipVertices(nV1, vertices[index + 1]);
                            result.push(nV1);
                            result.push(nV2);
                            result.push(nV3);
                        }
                        break;
                }
            }
            return result;
        };
        for (var index = 0; index < indices.length; index += 3) {
            var faceVertices = new Array();
            faceVertices.push(extractDecalVector3(index));
            faceVertices.push(extractDecalVector3(index + 1));
            faceVertices.push(extractDecalVector3(index + 2));
            // Clip
            faceVertices = clip(faceVertices, new Vector3(1, 0, 0));
            faceVertices = clip(faceVertices, new Vector3(-1, 0, 0));
            faceVertices = clip(faceVertices, new Vector3(0, 1, 0));
            faceVertices = clip(faceVertices, new Vector3(0, -1, 0));
            faceVertices = clip(faceVertices, new Vector3(0, 0, 1));
            faceVertices = clip(faceVertices, new Vector3(0, 0, -1));
            if (faceVertices.length === 0) {
                continue;
            }
            // Add UVs and get back to world
            for (var vIndex = 0; vIndex < faceVertices.length; vIndex++) {
                var vertex = faceVertices[vIndex];
                //TODO check for Int32Array | Uint32Array | Uint16Array
                vertexData.indices.push(currentVertexDataIndex);
                vertex.position.toArray(vertexData.positions, currentVertexDataIndex * 3);
                vertex.normal.toArray(vertexData.normals, currentVertexDataIndex * 3);
                vertexData.uvs.push(0.5 + vertex.position.x / size.x);
                vertexData.uvs.push(0.5 + vertex.position.y / size.y);
                currentVertexDataIndex++;
            }
        }
        // Return mesh
        var decal = new Mesh(name, sourceMesh.getScene());
        vertexData.applyToMesh(decal);
        decal.position = position.clone();
        decal.rotation = new Vector3(pitch, yaw, angle);
        return decal;
    };
    return DecalBuilder;
}());

/**
 * Scripts based off of https://github.com/maximeq/three-js-capsule-geometry/blob/master/src/CapsuleBufferGeometry.js
 * @param options the constructors options used to shape the mesh.
 * @returns the capsule VertexData
 * @see https://doc.babylonjs.com/how_to/capsule_shape
 */
VertexData.CreateCapsule = function (options) {
    if (options === void 0) { options = {
        subdivisions: 2,
        tessellation: 16,
        height: 1,
        radius: 0.25,
        capSubdivisions: 6
    }; }
    var subdivisions = Math.max(options.subdivisions ? options.subdivisions : 2, 1);
    var tessellation = Math.max(options.tessellation ? options.tessellation : 16, 3);
    var height = Math.max(options.height ? options.height : 1, 0.);
    var radius = Math.max(options.radius ? options.radius : 0.25, 0.);
    var capDetail = Math.max(options.capSubdivisions ? options.capSubdivisions : 6, 1);
    var radialSegments = tessellation;
    var heightSegments = subdivisions;
    var radiusTop = Math.max(options.radiusTop ? options.radiusTop : radius, 0.);
    var radiusBottom = Math.max(options.radiusBottom ? options.radiusBottom : radius, 0.);
    var heightMinusCaps = height - (radiusTop + radiusBottom);
    var thetaStart = 0.0;
    var thetaLength = (2.0 * Math.PI);
    var capsTopSegments = Math.max(options.topCapSubdivisions ? options.topCapSubdivisions : capDetail, 1);
    var capsBottomSegments = Math.max(options.bottomCapSubdivisions ? options.bottomCapSubdivisions : capDetail, 1);
    var alpha = Math.acos((radiusBottom - radiusTop) / height);
    var indices = [];
    var vertices = [];
    var normals = [];
    var uvs = [];
    var index = 0, indexArray = [], halfHeight = heightMinusCaps * 0.5;
    var pi2 = Math.PI * 0.5;
    var x, y;
    var normal = Vector3.Zero();
    var vertex = Vector3.Zero();
    var cosAlpha = Math.cos(alpha);
    var sinAlpha = Math.sin(alpha);
    var cone_length = new Vector2(radiusTop * sinAlpha, halfHeight + radiusTop * cosAlpha).subtract(new Vector2(radiusBottom * sinAlpha, -halfHeight + radiusBottom * cosAlpha)).length();
    // Total length for v texture coord
    var vl = radiusTop * alpha + cone_length + radiusBottom * (pi2 - alpha);
    var v = 0;
    for (y = 0; y <= capsTopSegments; y++) {
        var indexRow = [];
        var a = pi2 - alpha * (y / capsTopSegments);
        v += radiusTop * alpha / capsTopSegments;
        var cosA = Math.cos(a);
        var sinA = Math.sin(a);
        // calculate the radius of the current row
        var _radius = cosA * radiusTop;
        for (x = 0; x <= radialSegments; x++) {
            var u = x / radialSegments;
            var theta = u * thetaLength + thetaStart;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            // vertex
            vertex.x = _radius * sinTheta;
            vertex.y = halfHeight + sinA * radiusTop;
            vertex.z = _radius * cosTheta;
            vertices.push(vertex.x, vertex.y, vertex.z);
            // normal
            normal.set(cosA * sinTheta, sinA, cosA * cosTheta);
            normals.push(normal.x, normal.y, normal.z);
            // uv
            uvs.push(u, 1 - v / vl);
            // save index of vertex in respective row
            indexRow.push(index);
            // increase index
            index++;
        }
        // now save vertices of the row in our index array
        indexArray.push(indexRow);
    }
    var cone_height = (height - radiusTop - radiusBottom) + cosAlpha * radiusTop - cosAlpha * radiusBottom;
    var slope = sinAlpha * (radiusBottom - radiusTop) / cone_height;
    for (y = 1; y <= heightSegments; y++) {
        var indexRow = [];
        v += cone_length / heightSegments;
        // calculate the radius of the current row
        var _radius = sinAlpha * (y * (radiusBottom - radiusTop) / heightSegments + radiusTop);
        for (x = 0; x <= radialSegments; x++) {
            var u = x / radialSegments;
            var theta = u * thetaLength + thetaStart;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            // vertex
            vertex.x = _radius * sinTheta;
            vertex.y = halfHeight + cosAlpha * radiusTop - y * cone_height / heightSegments;
            vertex.z = _radius * cosTheta;
            vertices.push(vertex.x, vertex.y, vertex.z);
            // normal
            normal.set(sinTheta, slope, cosTheta).normalize();
            normals.push(normal.x, normal.y, normal.z);
            // uv
            uvs.push(u, 1 - v / vl);
            // save index of vertex in respective row
            indexRow.push(index);
            // increase index
            index++;
        }
        // now save vertices of the row in our index array
        indexArray.push(indexRow);
    }
    for (y = 1; y <= capsBottomSegments; y++) {
        var indexRow = [];
        var a = (pi2 - alpha) - (Math.PI - alpha) * (y / capsBottomSegments);
        v += radiusBottom * alpha / capsBottomSegments;
        var cosA = Math.cos(a);
        var sinA = Math.sin(a);
        // calculate the radius of the current row
        var _radius = cosA * radiusBottom;
        for (x = 0; x <= radialSegments; x++) {
            var u = x / radialSegments;
            var theta = u * thetaLength + thetaStart;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            // vertex
            vertex.x = _radius * sinTheta;
            vertex.y = -halfHeight + sinA * radiusBottom;
            vertex.z = _radius * cosTheta;
            vertices.push(vertex.x, vertex.y, vertex.z);
            // normal
            normal.set(cosA * sinTheta, sinA, cosA * cosTheta);
            normals.push(normal.x, normal.y, normal.z);
            // uv
            uvs.push(u, 1 - v / vl);
            // save index of vertex in respective row
            indexRow.push(index);
            // increase index
            index++;
        }
        // now save vertices of the row in our index array
        indexArray.push(indexRow);
    }
    // generate indices
    for (x = 0; x < radialSegments; x++) {
        for (y = 0; y < capsTopSegments + heightSegments + capsBottomSegments; y++) {
            // we use the index array to access the correct indices
            var i1 = indexArray[y][x];
            var i2 = indexArray[y + 1][x];
            var i3 = indexArray[y + 1][x + 1];
            var i4 = indexArray[y][x + 1];
            // face one
            indices.push(i1);
            indices.push(i2);
            indices.push(i4);
            // face two
            indices.push(i2);
            indices.push(i3);
            indices.push(i4);
        }
    }
    indices = indices.reverse();
    if (options.orientation && !options.orientation.equals(Vector3.Up())) {
        var m = new Matrix();
        (options.orientation.clone().scale(Math.PI * 0.5).cross(Vector3.Up()).toQuaternion()).toRotationMatrix(m);
        var v_1 = Vector3.Zero();
        for (var i = 0; i < vertices.length; i += 3) {
            v_1.set(vertices[i], vertices[i + 1], vertices[i + 2]);
            Vector3.TransformCoordinatesToRef(v_1.clone(), m, v_1);
            vertices[i] = v_1.x;
            vertices[i + 1] = v_1.y;
            vertices[i + 2] = v_1.z;
        }
    }
    var vDat = new VertexData();
    vDat.positions = vertices;
    vDat.normals = normals;
    vDat.uvs = uvs;
    vDat.indices = indices;
    return vDat;
};
/**
 * Creates a capsule or a pill mesh
 * @param name defines the name of the mesh.
 * @param options the constructors options used to shape the mesh.
 * @param scene defines the scene the mesh is scoped to.
 * @returns the capsule mesh
 * @see https://doc.babylonjs.com/how_to/capsule_shape
 */
Mesh.CreateCapsule = function (name, options, scene) {
    return CapsuleBuilder.CreateCapsule(name, options, scene);
};
/**
 * Class containing static functions to help procedurally build meshes
 */
var CapsuleBuilder = /** @class */ (function () {
    function CapsuleBuilder() {
    }
    /**
     * Creates a capsule or a pill mesh
     * @param name defines the name of the mesh
     * @param options The constructors options.
     * @param scene The scene the mesh is scoped to.
     * @returns Capsule Mesh
     */
    CapsuleBuilder.CreateCapsule = function (name, options, scene) {
        if (options === void 0) { options = {
            orientation: Vector3.Up(),
            subdivisions: 2,
            tessellation: 16,
            height: 1,
            radius: 0.25,
            capSubdivisions: 6
        }; }
        var capsule = new Mesh(name, scene);
        var vertexData = VertexData.CreateCapsule(options);
        vertexData.applyToMesh(capsule);
        return capsule;
    };
    return CapsuleBuilder;
}());

/**
 * Class containing static functions to help procedurally build meshes
 */
var MeshBuilder = /** @class */ (function () {
    function MeshBuilder() {
    }
    /**
     * Creates a box mesh
     * * The parameter `size` sets the size (float) of each box side (default 1)
     * * You can set some different box dimensions by using the parameters `width`, `height` and `depth` (all by default have the same value of `size`)
     * * You can set different colors and different images to each box side by using the parameters `faceColors` (an array of 6 Color3 elements) and `faceUV` (an array of 6 Vector4 elements)
     * * Please read this tutorial : https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @see https://doc.babylonjs.com/how_to/set_shapes#box
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the box mesh
     */
    MeshBuilder.CreateBox = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return BoxBuilder.CreateBox(name, options, scene);
    };
    /**
     * Creates a tiled box mesh
     * * faceTiles sets the pattern, tile size and number of tiles for a face
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the tiled box mesh
     */
    MeshBuilder.CreateTiledBox = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return TiledBoxBuilder.CreateTiledBox(name, options, scene);
    };
    /**
     * Creates a sphere mesh
     * * The parameter `diameter` sets the diameter size (float) of the sphere (default 1)
     * * You can set some different sphere dimensions, for instance to build an ellipsoid, by using the parameters `diameterX`, `diameterY` and `diameterZ` (all by default have the same value of `diameter`)
     * * The parameter `segments` sets the sphere number of horizontal stripes (positive integer, default 32)
     * * You can create an unclosed sphere with the parameter `arc` (positive float, default 1), valued between 0 and 1, what is the ratio of the circumference (latitude) : 2 x PI x ratio
     * * You can create an unclosed sphere on its height with the parameter `slice` (positive float, default1), valued between 0 and 1, what is the height ratio (longitude)
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the sphere mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#sphere
     */
    MeshBuilder.CreateSphere = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return SphereBuilder.CreateSphere(name, options, scene);
    };
    /**
     * Creates a plane polygonal mesh.  By default, this is a disc
     * * The parameter `radius` sets the radius size (float) of the polygon (default 0.5)
     * * The parameter `tessellation` sets the number of polygon sides (positive integer, default 64). So a tessellation valued to 3 will build a triangle, to 4 a square, etc
     * * You can create an unclosed polygon with the parameter `arc` (positive float, default 1), valued between 0 and 1, what is the ratio of the circumference : 2 x PI x ratio
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the plane polygonal mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#disc-or-regular-polygon
     */
    MeshBuilder.CreateDisc = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return DiscBuilder.CreateDisc(name, options, scene);
    };
    /**
     * Creates a sphere based upon an icosahedron with 20 triangular faces which can be subdivided
     * * The parameter `radius` sets the radius size (float) of the icosphere (default 1)
     * * You can set some different icosphere dimensions, for instance to build an ellipsoid, by using the parameters `radiusX`, `radiusY` and `radiusZ` (all by default have the same value of `radius`)
     * * The parameter `subdivisions` sets the number of subdivisions (postive integer, default 4). The more subdivisions, the more faces on the icosphere whatever its size
     * * The parameter `flat` (boolean, default true) gives each side its own normals. Set it to false to get a smooth continuous light reflection on the surface
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the icosahedron mesh
     * @see https://doc.babylonjs.com/how_to/polyhedra_shapes#icosphere
     */
    MeshBuilder.CreateIcoSphere = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return IcoSphereBuilder.CreateIcoSphere(name, options, scene);
    };
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
    MeshBuilder.CreateRibbon = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return RibbonBuilder.CreateRibbon(name, options, scene);
    };
    /**
     * Creates a cylinder or a cone mesh
     * * The parameter `height` sets the height size (float) of the cylinder/cone (float, default 2).
     * * The parameter `diameter` sets the diameter of the top and bottom cap at once (float, default 1).
     * * The parameters `diameterTop` and `diameterBottom` overwrite the parameter `diameter` and set respectively the top cap and bottom cap diameter (floats, default 1). The parameter "diameterBottom" can't be zero.
     * * The parameter `tessellation` sets the number of cylinder sides (positive integer, default 24). Set it to 3 to get a prism for instance.
     * * The parameter `subdivisions` sets the number of rings along the cylinder height (positive integer, default 1).
     * * The parameter `hasRings` (boolean, default false) makes the subdivisions independent from each other, so they become different faces.
     * * The parameter `enclose`  (boolean, default false) adds two extra faces per subdivision to a sliced cylinder to close it around its height axis.
     * * The parameter `cap` sets the way the cylinder is capped. Possible values : BABYLON.Mesh.NO_CAP, BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL (default).
     * * The parameter `arc` (float, default 1) is the ratio (max 1) to apply to the circumference to slice the cylinder.
     * * You can set different colors and different images to each box side by using the parameters `faceColors` (an array of n Color3 elements) and `faceUV` (an array of n Vector4 elements).
     * * The value of n is the number of cylinder faces. If the cylinder has only 1 subdivisions, n equals : top face + cylinder surface + bottom face = 3
     * * Now, if the cylinder has 5 independent subdivisions (hasRings = true), n equals : top face + 5 stripe surfaces + bottom face = 2 + 5 = 7
     * * Finally, if the cylinder has 5 independent subdivisions and is enclose, n equals : top face + 5 x (stripe surface + 2 closing faces) + bottom face = 2 + 5 * 3 = 17
     * * Each array (color or UVs) is always ordered the same way : the first element is the bottom cap, the last element is the top cap. The other elements are each a ring surface.
     * * If `enclose` is false, a ring surface is one element.
     * * If `enclose` is true, a ring surface is 3 successive elements in the array : the tubular surface, then the two closing faces.
     * * Example how to set colors and textures on a sliced cylinder : https://www.html5gamedevs.com/topic/17945-creating-a-closed-slice-of-a-cylinder/#comment-106379
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the cylinder mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#cylinder-or-cone
     */
    MeshBuilder.CreateCylinder = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return CylinderBuilder.CreateCylinder(name, options, scene);
    };
    /**
     * Creates a torus mesh
     * * The parameter `diameter` sets the diameter size (float) of the torus (default 1)
     * * The parameter `thickness` sets the diameter size of the tube of the torus (float, default 0.5)
     * * The parameter `tessellation` sets the number of torus sides (postive integer, default 16)
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the torus mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#torus
     */
    MeshBuilder.CreateTorus = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return TorusBuilder.CreateTorus(name, options, scene);
    };
    /**
     * Creates a torus knot mesh
     * * The parameter `radius` sets the global radius size (float) of the torus knot (default 2)
     * * The parameter `radialSegments` sets the number of sides on each tube segments (positive integer, default 32)
     * * The parameter `tubularSegments` sets the number of tubes to decompose the knot into (positive integer, default 32)
     * * The parameters `p` and `q` are the number of windings on each axis (positive integers, default 2 and 3)
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the torus knot mesh
     * @see  https://doc.babylonjs.com/how_to/set_shapes#torus-knot
     */
    MeshBuilder.CreateTorusKnot = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return TorusKnotBuilder.CreateTorusKnot(name, options, scene);
    };
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
    MeshBuilder.CreateLineSystem = function (name, options, scene) {
        return LinesBuilder.CreateLineSystem(name, options, scene);
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
    MeshBuilder.CreateLines = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return LinesBuilder.CreateLines(name, options, scene);
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
     * * When updating an instance, remember that only point positions can change, not the number of points
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the dashed line mesh
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#dashed-lines
     */
    MeshBuilder.CreateDashedLines = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return LinesBuilder.CreateDashedLines(name, options, scene);
    };
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
    MeshBuilder.ExtrudeShape = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return ShapeBuilder.ExtrudeShape(name, options, scene);
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
    MeshBuilder.ExtrudeShapeCustom = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return ShapeBuilder.ExtrudeShapeCustom(name, options, scene);
    };
    /**
     * Creates lathe mesh.
     * The lathe is a shape with a symetry axis : a 2D model shape is rotated around this axis to design the lathe
     * * The parameter `shape` is a required array of successive Vector3. This array depicts the shape to be rotated in its local space : the shape must be designed in the xOy plane and will be rotated around the Y axis. It's usually a 2D shape, so the Vector3 z coordinates are often set to zero
     * * The parameter `radius` (positive float, default 1) is the radius value of the lathe
     * * The parameter `tessellation` (positive integer, default 64) is the side number of the lathe
     * * The parameter `clip` (positive integer, default 0) is the number of sides to not create without effecting the general shape of the sides
     * * The parameter `arc` (positive float, default 1) is the ratio of the lathe. 0.5 builds for instance half a lathe, so an opened shape
     * * The parameter `closed` (boolean, default true) opens/closes the lathe circumference. This should be set to false when used with the parameter "arc"
     * * The parameter `cap` sets the way the extruded shape is capped. Possible values : BABYLON.Mesh.NO_CAP (default), BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The optional parameter `invertUV` (boolean, default false) swaps in the geometry the U and V coordinates to apply a texture
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the lathe mesh
     * @see https://doc.babylonjs.com/how_to/parametric_shapes#lathe
     */
    MeshBuilder.CreateLathe = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return LatheBuilder.CreateLathe(name, options, scene);
    };
    /**
     * Creates a tiled plane mesh
     * * You can set a limited pattern arrangement with the tiles
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the plane mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#plane
     */
    MeshBuilder.CreateTiledPlane = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return TiledPlaneBuilder.CreateTiledPlane(name, options, scene);
    };
    /**
     * Creates a plane mesh
     * * The parameter `size` sets the size (float) of both sides of the plane at once (default 1)
     * * You can set some different plane dimensions by using the parameters `width` and `height` (both by default have the same value of `size`)
     * * The parameter `sourcePlane` is a Plane instance. It builds a mesh plane from a Math plane
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the plane mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#plane
     */
    MeshBuilder.CreatePlane = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return PlaneBuilder.CreatePlane(name, options, scene);
    };
    /**
     * Creates a ground mesh
     * * The parameters `width` and `height` (floats, default 1) set the width and height sizes of the ground
     * * The parameter `subdivisions` (positive integer) sets the number of subdivisions per side
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the ground mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#ground
     */
    MeshBuilder.CreateGround = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return GroundBuilder.CreateGround(name, options, scene);
    };
    /**
     * Creates a tiled ground mesh
     * * The parameters `xmin` and `xmax` (floats, default -1 and 1) set the ground minimum and maximum X coordinates
     * * The parameters `zmin` and `zmax` (floats, default -1 and 1) set the ground minimum and maximum Z coordinates
     * * The parameter `subdivisions` is a javascript object `{w: positive integer, h: positive integer}` (default `{w: 6, h: 6}`). `w` and `h` are the numbers of subdivisions on the ground width and height. Each subdivision is called a tile
     * * The parameter `precision` is a javascript object `{w: positive integer, h: positive integer}` (default `{w: 2, h: 2}`). `w` and `h` are the numbers of subdivisions on the ground width and height of each tile
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the tiled ground mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#tiled-ground
     */
    MeshBuilder.CreateTiledGround = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return GroundBuilder.CreateTiledGround(name, options, scene);
    };
    /**
     * Creates a ground mesh from a height map
     * * The parameter `url` sets the URL of the height map image resource.
     * * The parameters `width` and `height` (positive floats, default 10) set the ground width and height sizes.
     * * The parameter `subdivisions` (positive integer, default 1) sets the number of subdivision per side.
     * * The parameter `minHeight` (float, default 0) is the minimum altitude on the ground.
     * * The parameter `maxHeight` (float, default 1) is the maximum altitude on the ground.
     * * The parameter `colorFilter` (optional Color3, default (0.3, 0.59, 0.11) ) is the filter to apply to the image pixel colors to compute the height.
     * * The parameter `onReady` is a javascript callback function that will be called  once the mesh is just built (the height map download can last some time).
     * * The parameter `alphaFilter` will filter any data where the alpha channel is below this value, defaults 0 (all data visible)
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param url defines the url to the height map
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the ground mesh
     * @see https://doc.babylonjs.com/babylon101/height_map
     * @see https://doc.babylonjs.com/how_to/set_shapes#ground-from-a-height-map
     */
    MeshBuilder.CreateGroundFromHeightMap = function (name, url, options, scene) {
        if (scene === void 0) { scene = null; }
        return GroundBuilder.CreateGroundFromHeightMap(name, url, options, scene);
    };
    /**
     * Creates a polygon mesh
     * The polygon's shape will depend on the input parameters and is constructed parallel to a ground mesh
     * * The parameter `shape` is a required array of successive Vector3 representing the corners of the polygon in th XoZ plane, that is y = 0 for all vectors
     * * You can set the mesh side orientation with the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4)
     * * Remember you can only change the shape positions, not their number when updating a polygon
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @param earcutInjection can be used to inject your own earcut reference
     * @returns the polygon mesh
     */
    MeshBuilder.CreatePolygon = function (name, options, scene, earcutInjection) {
        if (scene === void 0) { scene = null; }
        if (earcutInjection === void 0) { earcutInjection = earcut; }
        return PolygonBuilder.CreatePolygon(name, options, scene, earcutInjection);
    };
    /**
     * Creates an extruded polygon mesh, with depth in the Y direction.
     * * You can set different colors and different images to the top, bottom and extruded side by using the parameters `faceColors` (an array of 3 Color3 elements) and `faceUV` (an array of 3 Vector4 elements)
     * @see https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @param earcutInjection can be used to inject your own earcut reference
     * @returns the polygon mesh
     */
    MeshBuilder.ExtrudePolygon = function (name, options, scene, earcutInjection) {
        if (scene === void 0) { scene = null; }
        if (earcutInjection === void 0) { earcutInjection = earcut; }
        return PolygonBuilder.ExtrudePolygon(name, options, scene, earcutInjection);
    };
    /**
     * Creates a tube mesh.
     * The tube is a parametric shape. It has no predefined shape. Its final shape will depend on the input parameters
     * * The parameter `path` is a required array of successive Vector3. It is the curve used as the axis of the tube
     * * The parameter `radius` (positive float, default 1) sets the tube radius size
     * * The parameter `tessellation` (positive float, default 64) is the number of sides on the tubular surface
     * * The parameter `radiusFunction` (javascript function, default null) is a vanilla javascript function. If it is not null, it overwrittes the parameter `radius`
     * * This function is called on each point of the tube path and is passed the index `i` of the i-th point and the distance of this point from the first point of the path. It must return a radius value (positive float)
     * * The parameter `arc` (positive float, maximum 1, default 1) is the ratio to apply to the tube circumference : 2 x PI x arc
     * * The parameter `cap` sets the way the extruded shape is capped. Possible values : BABYLON.Mesh.NO_CAP (default), BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL
     * * The optional parameter `instance` is an instance of an existing Tube object to be updated with the passed `pathArray` parameter : https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#tube
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The optional parameter `invertUV` (boolean, default false) swaps in the geometry the U and V coordinates to apply a texture
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the tube mesh
     * @see https://doc.babylonjs.com/how_to/parametric_shapes
     * @see https://doc.babylonjs.com/how_to/set_shapes#tube
     */
    MeshBuilder.CreateTube = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return TubeBuilder.CreateTube(name, options, scene);
    };
    /**
     * Creates a polyhedron mesh
     * * The parameter `type` (positive integer, max 14, default 0) sets the polyhedron type to build among the 15 embbeded types. Please refer to the type sheet in the tutorial to choose the wanted type
     * * The parameter `size` (positive float, default 1) sets the polygon size
     * * You can overwrite the `size` on each dimension bu using the parameters `sizeX`, `sizeY` or `sizeZ` (positive floats, default to `size` value)
     * * You can build other polyhedron types than the 15 embbeded ones by setting the parameter `custom` (`polyhedronObject`, default null). If you set the parameter `custom`, this overwrittes the parameter `type`
     * * A `polyhedronObject` is a formatted javascript object. You'll find a full file with pre-set polyhedra here : https://github.com/BabylonJS/Extensions/tree/master/Polyhedron
     * * You can set the color and the UV of each side of the polyhedron with the parameters `faceColors` (Color4, default `(1, 1, 1, 1)`) and faceUV (Vector4, default `(0, 0, 1, 1)`)
     * * To understand how to set `faceUV` or `faceColors`, please read this by considering the right number of faces of your polyhedron, instead of only 6 for the box : https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors
     * * The parameter `flat` (boolean, default true). If set to false, it gives the polyhedron a single global face, so less vertices and shared normals. In this case, `faceColors` and `faceUV` are ignored
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the polyhedron mesh
     * @see https://doc.babylonjs.com/how_to/polyhedra_shapes
     */
    MeshBuilder.CreatePolyhedron = function (name, options, scene) {
        if (scene === void 0) { scene = null; }
        return PolyhedronBuilder.CreatePolyhedron(name, options, scene);
    };
    /**
     * Creates a decal mesh.
     * A decal is a mesh usually applied as a model onto the surface of another mesh. So don't forget the parameter `sourceMesh` depicting the decal
     * * The parameter `position` (Vector3, default `(0, 0, 0)`) sets the position of the decal in World coordinates
     * * The parameter `normal` (Vector3, default `Vector3.Up`) sets the normal of the mesh where the decal is applied onto in World coordinates
     * * The parameter `size` (Vector3, default `(1, 1, 1)`) sets the decal scaling
     * * The parameter `angle` (float in radian, default 0) sets the angle to rotate the decal
     * @param name defines the name of the mesh
     * @param sourceMesh defines the mesh where the decal must be applied
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the decal mesh
     * @see https://doc.babylonjs.com/how_to/decals
     */
    MeshBuilder.CreateDecal = function (name, sourceMesh, options) {
        return DecalBuilder.CreateDecal(name, sourceMesh, options);
    };
    /**
     * Creates a Capsule Mesh
     * @param name defines the name of the mesh.
     * @param options the constructors options used to shape the mesh.
     * @param scene defines the scene the mesh is scoped to.
     * @returns the capsule mesh
     * @see https://doc.babylonjs.com/how_to/capsule_shape
     */
    MeshBuilder.CreateCapsule = function (name, options, scene) {
        if (options === void 0) { options = {
            orientation: Vector3.Up(),
            subdivisions: 2,
            tessellation: 16,
            height: 1,
            radius: 0.25,
            capSubdivisions: 6
        }; }
        if (scene === void 0) { scene = null; }
        return CapsuleBuilder.CreateCapsule(name, options, scene);
    };
    return MeshBuilder;
}());

export { BoxBuilder as B, CylinderBuilder as C, DiscBuilder as D, GroundBuilder as G, IcoSphereBuilder as I, LatheBuilder as L, MeshBuilder as M, PlaneBuilder as P, SphereBuilder as S, TorusBuilder as T, PolyhedronBuilder as a, GroundMesh as b, Polygon as c, PolygonMeshBuilder as d, TiledBoxBuilder as e, TorusKnotBuilder as f, PolygonBuilder as g, TiledPlaneBuilder as h, TubeBuilder as i, DecalBuilder as j, CapsuleBuilder as k };
