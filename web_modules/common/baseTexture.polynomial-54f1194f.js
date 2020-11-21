import { V as Vector3, S as Scalar, f as ToLinearSpace, b as Color3 } from './math.color-fc6e801e.js';
import { B as BaseTexture } from './baseTexture-827d5047.js';

// https://dickyjim.wordpress.com/2013/09/04/spherical-harmonics-for-beginners/
// http://silviojemma.com/public/papers/lighting/spherical-harmonic-lighting.pdf
// https://www.ppsloan.org/publications/StupidSH36.pdf
// http://cseweb.ucsd.edu/~ravir/papers/envmap/envmap.pdf
// https://www.ppsloan.org/publications/SHJCGT.pdf
// https://www.ppsloan.org/publications/shdering.pdf
// https://google.github.io/filament/Filament.md.html#annex/sphericalharmonics
// https://patapom.com/blog/SHPortal/
// https://imdoingitwrong.wordpress.com/2011/04/14/spherical-harmonics-wtf/
// Using real SH basis:
//  m>0             m   m
// y   = sqrt(2) * K * P * cos(m*phi) * cos(theta)
//  l               l   l
//
//  m<0             m   |m|
// y   = sqrt(2) * K * P * sin(m*phi) * cos(theta)
//  l               l   l
//
//  m=0   0   0
// y   = K * P * trigono terms
//  l     l   l
//
//  m       (2l + 1)(l - |m|)!
// K = sqrt(------------------)
//  l           4pi(l + |m|)!
//
// and P by recursion:
//
// P00(x) = 1
// P01(x) = x
// Pll(x) = (-1^l)(2l - 1)!!(1-x*x)^(1/2)
//          ((2l - 1)x[Pl-1/m]-(l + m - 1)[Pl-2/m])
// Plm(x) = ---------------------------------------
//                         l - m
// Leaving the trigonometric terms aside we can precompute the constants to :
var SH3ylmBasisConstants = [
    Math.sqrt(1 / (4 * Math.PI)),
    -Math.sqrt(3 / (4 * Math.PI)),
    Math.sqrt(3 / (4 * Math.PI)),
    -Math.sqrt(3 / (4 * Math.PI)),
    Math.sqrt(15 / (4 * Math.PI)),
    -Math.sqrt(15 / (4 * Math.PI)),
    Math.sqrt(5 / (16 * Math.PI)),
    -Math.sqrt(15 / (4 * Math.PI)),
    Math.sqrt(15 / (16 * Math.PI)),
];
// cm = cos(m * phi)
// sm = sin(m * phi)
// {x,y,z} = {cos(phi)sin(theta), sin(phi)sin(theta), cos(theta)}
// By recursion on using trigo identities:
var SH3ylmBasisTrigonometricTerms = [
    function (direction) { return 1; },
    function (direction) { return direction.y; },
    function (direction) { return direction.z; },
    function (direction) { return direction.x; },
    function (direction) { return direction.x * direction.y; },
    function (direction) { return direction.y * direction.z; },
    function (direction) { return 3 * direction.z * direction.z - 1; },
    function (direction) { return direction.x * direction.z; },
    function (direction) { return direction.x * direction.x - direction.y * direction.y; },
];
// Wrap the full compute
var applySH3 = function (lm, direction) {
    return SH3ylmBasisConstants[lm] * SH3ylmBasisTrigonometricTerms[lm](direction);
};
// Derived from the integration of the a kernel convolution to SH.
// Great explanation here: https://patapom.com/blog/SHPortal/#about-distant-radiance-and-irradiance-environments
var SHCosKernelConvolution = [
    Math.PI,
    2 * Math.PI / 3,
    2 * Math.PI / 3,
    2 * Math.PI / 3,
    Math.PI / 4,
    Math.PI / 4,
    Math.PI / 4,
    Math.PI / 4,
    Math.PI / 4,
];
/**
 * Class representing spherical harmonics coefficients to the 3rd degree
 */
var SphericalHarmonics = /** @class */ (function () {
    function SphericalHarmonics() {
        /**
         * Defines whether or not the harmonics have been prescaled for rendering.
         */
        this.preScaled = false;
        /**
         * The l0,0 coefficients of the spherical harmonics
         */
        this.l00 = Vector3.Zero();
        /**
         * The l1,-1 coefficients of the spherical harmonics
         */
        this.l1_1 = Vector3.Zero();
        /**
         * The l1,0 coefficients of the spherical harmonics
         */
        this.l10 = Vector3.Zero();
        /**
         * The l1,1 coefficients of the spherical harmonics
         */
        this.l11 = Vector3.Zero();
        /**
         * The l2,-2 coefficients of the spherical harmonics
         */
        this.l2_2 = Vector3.Zero();
        /**
         * The l2,-1 coefficients of the spherical harmonics
         */
        this.l2_1 = Vector3.Zero();
        /**
         * The l2,0 coefficients of the spherical harmonics
         */
        this.l20 = Vector3.Zero();
        /**
         * The l2,1 coefficients of the spherical harmonics
         */
        this.l21 = Vector3.Zero();
        /**
         * The l2,2 coefficients of the spherical harmonics
         */
        this.l22 = Vector3.Zero();
    }
    /**
     * Adds a light to the spherical harmonics
     * @param direction the direction of the light
     * @param color the color of the light
     * @param deltaSolidAngle the delta solid angle of the light
     */
    SphericalHarmonics.prototype.addLight = function (direction, color, deltaSolidAngle) {
        var colorVector = new Vector3(color.r, color.g, color.b);
        var c = colorVector.scale(deltaSolidAngle);
        this.l00 = this.l00.add(c.scale(applySH3(0, direction)));
        this.l1_1 = this.l1_1.add(c.scale(applySH3(1, direction)));
        this.l10 = this.l10.add(c.scale(applySH3(2, direction)));
        this.l11 = this.l11.add(c.scale(applySH3(3, direction)));
        this.l2_2 = this.l2_2.add(c.scale(applySH3(4, direction)));
        this.l2_1 = this.l2_1.add(c.scale(applySH3(5, direction)));
        this.l20 = this.l20.add(c.scale(applySH3(6, direction)));
        this.l21 = this.l21.add(c.scale(applySH3(7, direction)));
        this.l22 = this.l22.add(c.scale(applySH3(8, direction)));
    };
    /**
     * Scales the spherical harmonics by the given amount
     * @param scale the amount to scale
     */
    SphericalHarmonics.prototype.scaleInPlace = function (scale) {
        this.l00.scaleInPlace(scale);
        this.l1_1.scaleInPlace(scale);
        this.l10.scaleInPlace(scale);
        this.l11.scaleInPlace(scale);
        this.l2_2.scaleInPlace(scale);
        this.l2_1.scaleInPlace(scale);
        this.l20.scaleInPlace(scale);
        this.l21.scaleInPlace(scale);
        this.l22.scaleInPlace(scale);
    };
    /**
     * Convert from incident radiance (Li) to irradiance (E) by applying convolution with the cosine-weighted hemisphere.
     *
     * ```
     * E_lm = A_l * L_lm
     * ```
     *
     * In spherical harmonics this convolution amounts to scaling factors for each frequency band.
     * This corresponds to equation 5 in "An Efficient Representation for Irradiance Environment Maps", where
     * the scaling factors are given in equation 9.
     */
    SphericalHarmonics.prototype.convertIncidentRadianceToIrradiance = function () {
        // Constant (Band 0)
        this.l00.scaleInPlace(SHCosKernelConvolution[0]);
        // Linear (Band 1)
        this.l1_1.scaleInPlace(SHCosKernelConvolution[1]);
        this.l10.scaleInPlace(SHCosKernelConvolution[2]);
        this.l11.scaleInPlace(SHCosKernelConvolution[3]);
        // Quadratic (Band 2)
        this.l2_2.scaleInPlace(SHCosKernelConvolution[4]);
        this.l2_1.scaleInPlace(SHCosKernelConvolution[5]);
        this.l20.scaleInPlace(SHCosKernelConvolution[6]);
        this.l21.scaleInPlace(SHCosKernelConvolution[7]);
        this.l22.scaleInPlace(SHCosKernelConvolution[8]);
    };
    /**
     * Convert from irradiance to outgoing radiance for Lambertian BDRF, suitable for efficient shader evaluation.
     *
     * ```
     * L = (1/pi) * E * rho
     * ```
     *
     * This is done by an additional scale by 1/pi, so is a fairly trivial operation but important conceptually.
     */
    SphericalHarmonics.prototype.convertIrradianceToLambertianRadiance = function () {
        this.scaleInPlace(1.0 / Math.PI);
        // The resultant SH now represents outgoing radiance, so includes the Lambert 1/pi normalisation factor but without albedo (rho) applied
        // (The pixel shader must apply albedo after texture fetches, etc).
    };
    /**
     * Integrates the reconstruction coefficients directly in to the SH preventing further
     * required operations at run time.
     *
     * This is simply done by scaling back the SH with Ylm constants parameter.
     * The trigonometric part being applied by the shader at run time.
     */
    SphericalHarmonics.prototype.preScaleForRendering = function () {
        this.preScaled = true;
        this.l00.scaleInPlace(SH3ylmBasisConstants[0]);
        this.l1_1.scaleInPlace(SH3ylmBasisConstants[1]);
        this.l10.scaleInPlace(SH3ylmBasisConstants[2]);
        this.l11.scaleInPlace(SH3ylmBasisConstants[3]);
        this.l2_2.scaleInPlace(SH3ylmBasisConstants[4]);
        this.l2_1.scaleInPlace(SH3ylmBasisConstants[5]);
        this.l20.scaleInPlace(SH3ylmBasisConstants[6]);
        this.l21.scaleInPlace(SH3ylmBasisConstants[7]);
        this.l22.scaleInPlace(SH3ylmBasisConstants[8]);
    };
    /**
     * Constructs a spherical harmonics from an array.
     * @param data defines the 9x3 coefficients (l00, l1-1, l10, l11, l2-2, l2-1, l20, l21, l22)
     * @returns the spherical harmonics
     */
    SphericalHarmonics.FromArray = function (data) {
        var sh = new SphericalHarmonics();
        Vector3.FromArrayToRef(data[0], 0, sh.l00);
        Vector3.FromArrayToRef(data[1], 0, sh.l1_1);
        Vector3.FromArrayToRef(data[2], 0, sh.l10);
        Vector3.FromArrayToRef(data[3], 0, sh.l11);
        Vector3.FromArrayToRef(data[4], 0, sh.l2_2);
        Vector3.FromArrayToRef(data[5], 0, sh.l2_1);
        Vector3.FromArrayToRef(data[6], 0, sh.l20);
        Vector3.FromArrayToRef(data[7], 0, sh.l21);
        Vector3.FromArrayToRef(data[8], 0, sh.l22);
        return sh;
    };
    // Keep for references.
    /**
     * Gets the spherical harmonics from polynomial
     * @param polynomial the spherical polynomial
     * @returns the spherical harmonics
     */
    SphericalHarmonics.FromPolynomial = function (polynomial) {
        var result = new SphericalHarmonics();
        result.l00 = polynomial.xx.scale(0.376127).add(polynomial.yy.scale(0.376127)).add(polynomial.zz.scale(0.376126));
        result.l1_1 = polynomial.y.scale(0.977204);
        result.l10 = polynomial.z.scale(0.977204);
        result.l11 = polynomial.x.scale(0.977204);
        result.l2_2 = polynomial.xy.scale(1.16538);
        result.l2_1 = polynomial.yz.scale(1.16538);
        result.l20 = polynomial.zz.scale(1.34567).subtract(polynomial.xx.scale(0.672834)).subtract(polynomial.yy.scale(0.672834));
        result.l21 = polynomial.zx.scale(1.16538);
        result.l22 = polynomial.xx.scale(1.16538).subtract(polynomial.yy.scale(1.16538));
        result.l1_1.scaleInPlace(-1);
        result.l11.scaleInPlace(-1);
        result.l2_1.scaleInPlace(-1);
        result.l21.scaleInPlace(-1);
        result.scaleInPlace(Math.PI);
        return result;
    };
    return SphericalHarmonics;
}());
/**
 * Class representing spherical polynomial coefficients to the 3rd degree
 */
var SphericalPolynomial = /** @class */ (function () {
    function SphericalPolynomial() {
        /**
         * The x coefficients of the spherical polynomial
         */
        this.x = Vector3.Zero();
        /**
         * The y coefficients of the spherical polynomial
         */
        this.y = Vector3.Zero();
        /**
         * The z coefficients of the spherical polynomial
         */
        this.z = Vector3.Zero();
        /**
         * The xx coefficients of the spherical polynomial
         */
        this.xx = Vector3.Zero();
        /**
         * The yy coefficients of the spherical polynomial
         */
        this.yy = Vector3.Zero();
        /**
         * The zz coefficients of the spherical polynomial
         */
        this.zz = Vector3.Zero();
        /**
         * The xy coefficients of the spherical polynomial
         */
        this.xy = Vector3.Zero();
        /**
         * The yz coefficients of the spherical polynomial
         */
        this.yz = Vector3.Zero();
        /**
         * The zx coefficients of the spherical polynomial
         */
        this.zx = Vector3.Zero();
    }
    Object.defineProperty(SphericalPolynomial.prototype, "preScaledHarmonics", {
        /**
         * The spherical harmonics used to create the polynomials.
         */
        get: function () {
            if (!this._harmonics) {
                this._harmonics = SphericalHarmonics.FromPolynomial(this);
            }
            if (!this._harmonics.preScaled) {
                this._harmonics.preScaleForRendering();
            }
            return this._harmonics;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds an ambient color to the spherical polynomial
     * @param color the color to add
     */
    SphericalPolynomial.prototype.addAmbient = function (color) {
        var colorVector = new Vector3(color.r, color.g, color.b);
        this.xx = this.xx.add(colorVector);
        this.yy = this.yy.add(colorVector);
        this.zz = this.zz.add(colorVector);
    };
    /**
     * Scales the spherical polynomial by the given amount
     * @param scale the amount to scale
     */
    SphericalPolynomial.prototype.scaleInPlace = function (scale) {
        this.x.scaleInPlace(scale);
        this.y.scaleInPlace(scale);
        this.z.scaleInPlace(scale);
        this.xx.scaleInPlace(scale);
        this.yy.scaleInPlace(scale);
        this.zz.scaleInPlace(scale);
        this.yz.scaleInPlace(scale);
        this.zx.scaleInPlace(scale);
        this.xy.scaleInPlace(scale);
    };
    /**
     * Gets the spherical polynomial from harmonics
     * @param harmonics the spherical harmonics
     * @returns the spherical polynomial
     */
    SphericalPolynomial.FromHarmonics = function (harmonics) {
        var result = new SphericalPolynomial();
        result._harmonics = harmonics;
        result.x = harmonics.l11.scale(1.02333).scale(-1);
        result.y = harmonics.l1_1.scale(1.02333).scale(-1);
        result.z = harmonics.l10.scale(1.02333);
        result.xx = harmonics.l00.scale(0.886277).subtract(harmonics.l20.scale(0.247708)).add(harmonics.l22.scale(0.429043));
        result.yy = harmonics.l00.scale(0.886277).subtract(harmonics.l20.scale(0.247708)).subtract(harmonics.l22.scale(0.429043));
        result.zz = harmonics.l00.scale(0.886277).add(harmonics.l20.scale(0.495417));
        result.yz = harmonics.l2_1.scale(0.858086).scale(-1);
        result.zx = harmonics.l21.scale(0.858086).scale(-1);
        result.xy = harmonics.l2_2.scale(0.858086);
        result.scaleInPlace(1.0 / Math.PI);
        return result;
    };
    /**
     * Constructs a spherical polynomial from an array.
     * @param data defines the 9x3 coefficients (x, y, z, xx, yy, zz, yz, zx, xy)
     * @returns the spherical polynomial
     */
    SphericalPolynomial.FromArray = function (data) {
        var sp = new SphericalPolynomial();
        Vector3.FromArrayToRef(data[0], 0, sp.x);
        Vector3.FromArrayToRef(data[1], 0, sp.y);
        Vector3.FromArrayToRef(data[2], 0, sp.z);
        Vector3.FromArrayToRef(data[3], 0, sp.xx);
        Vector3.FromArrayToRef(data[4], 0, sp.yy);
        Vector3.FromArrayToRef(data[5], 0, sp.zz);
        Vector3.FromArrayToRef(data[6], 0, sp.yz);
        Vector3.FromArrayToRef(data[7], 0, sp.zx);
        Vector3.FromArrayToRef(data[8], 0, sp.xy);
        return sp;
    };
    return SphericalPolynomial;
}());

var FileFaceOrientation = /** @class */ (function () {
    function FileFaceOrientation(name, worldAxisForNormal, worldAxisForFileX, worldAxisForFileY) {
        this.name = name;
        this.worldAxisForNormal = worldAxisForNormal;
        this.worldAxisForFileX = worldAxisForFileX;
        this.worldAxisForFileY = worldAxisForFileY;
    }
    return FileFaceOrientation;
}());
/**
 * Helper class dealing with the extraction of spherical polynomial dataArray
 * from a cube map.
 */
var CubeMapToSphericalPolynomialTools = /** @class */ (function () {
    function CubeMapToSphericalPolynomialTools() {
    }
    /**
     * Converts a texture to the according Spherical Polynomial data.
     * This extracts the first 3 orders only as they are the only one used in the lighting.
     *
     * @param texture The texture to extract the information from.
     * @return The Spherical Polynomial data.
     */
    CubeMapToSphericalPolynomialTools.ConvertCubeMapTextureToSphericalPolynomial = function (texture) {
        if (!texture.isCube) {
            // Only supports cube Textures currently.
            return null;
        }
        var size = texture.getSize().width;
        var right = texture.readPixels(0);
        var left = texture.readPixels(1);
        var up;
        var down;
        if (texture.isRenderTarget) {
            up = texture.readPixels(3);
            down = texture.readPixels(2);
        }
        else {
            up = texture.readPixels(2);
            down = texture.readPixels(3);
        }
        var front = texture.readPixels(4);
        var back = texture.readPixels(5);
        var gammaSpace = texture.gammaSpace;
        // Always read as RGBA.
        var format = 5;
        var type = 0;
        if (texture.textureType == 1 || texture.textureType == 2) {
            type = 1;
        }
        var cubeInfo = {
            size: size,
            right: right,
            left: left,
            up: up,
            down: down,
            front: front,
            back: back,
            format: format,
            type: type,
            gammaSpace: gammaSpace,
        };
        return this.ConvertCubeMapToSphericalPolynomial(cubeInfo);
    };
    /**
     * Converts a cubemap to the according Spherical Polynomial data.
     * This extracts the first 3 orders only as they are the only one used in the lighting.
     *
     * @param cubeInfo The Cube map to extract the information from.
     * @return The Spherical Polynomial data.
     */
    CubeMapToSphericalPolynomialTools.ConvertCubeMapToSphericalPolynomial = function (cubeInfo) {
        var sphericalHarmonics = new SphericalHarmonics();
        var totalSolidAngle = 0.0;
        // The (u,v) range is [-1,+1], so the distance between each texel is 2/Size.
        var du = 2.0 / cubeInfo.size;
        var dv = du;
        // The (u,v) of the first texel is half a texel from the corner (-1,-1).
        var minUV = du * 0.5 - 1.0;
        for (var faceIndex = 0; faceIndex < 6; faceIndex++) {
            var fileFace = this.FileFaces[faceIndex];
            var dataArray = cubeInfo[fileFace.name];
            var v = minUV;
            // TODO: we could perform the summation directly into a SphericalPolynomial (SP), which is more efficient than SphericalHarmonic (SH).
            // This is possible because during the summation we do not need the SH-specific properties, e.g. orthogonality.
            // Because SP is still linear, so summation is fine in that basis.
            var stride = cubeInfo.format === 5 ? 4 : 3;
            for (var y = 0; y < cubeInfo.size; y++) {
                var u = minUV;
                for (var x = 0; x < cubeInfo.size; x++) {
                    // World direction (not normalised)
                    var worldDirection = fileFace.worldAxisForFileX.scale(u).add(fileFace.worldAxisForFileY.scale(v)).add(fileFace.worldAxisForNormal);
                    worldDirection.normalize();
                    var deltaSolidAngle = Math.pow(1.0 + u * u + v * v, -3.0 / 2.0);
                    var r = dataArray[(y * cubeInfo.size * stride) + (x * stride) + 0];
                    var g = dataArray[(y * cubeInfo.size * stride) + (x * stride) + 1];
                    var b = dataArray[(y * cubeInfo.size * stride) + (x * stride) + 2];
                    // Prevent NaN harmonics with extreme HDRI data.
                    if (isNaN(r)) {
                        r = 0;
                    }
                    if (isNaN(g)) {
                        g = 0;
                    }
                    if (isNaN(b)) {
                        b = 0;
                    }
                    // Handle Integer types.
                    if (cubeInfo.type === 0) {
                        r /= 255;
                        g /= 255;
                        b /= 255;
                    }
                    // Handle Gamma space textures.
                    if (cubeInfo.gammaSpace) {
                        r = Math.pow(Scalar.Clamp(r), ToLinearSpace);
                        g = Math.pow(Scalar.Clamp(g), ToLinearSpace);
                        b = Math.pow(Scalar.Clamp(b), ToLinearSpace);
                    }
                    // Prevent to explode in case of really high dynamic ranges.
                    // sh 3 would not be enough to accurately represent it.
                    var max = 4096;
                    r = Scalar.Clamp(r, 0, max);
                    g = Scalar.Clamp(g, 0, max);
                    b = Scalar.Clamp(b, 0, max);
                    var color = new Color3(r, g, b);
                    sphericalHarmonics.addLight(worldDirection, color, deltaSolidAngle);
                    totalSolidAngle += deltaSolidAngle;
                    u += du;
                }
                v += dv;
            }
        }
        // Solid angle for entire sphere is 4*pi
        var sphereSolidAngle = 4.0 * Math.PI;
        // Adjust the solid angle to allow for how many faces we processed.
        var facesProcessed = 6.0;
        var expectedSolidAngle = sphereSolidAngle * facesProcessed / 6.0;
        // Adjust the harmonics so that the accumulated solid angle matches the expected solid angle.
        // This is needed because the numerical integration over the cube uses a
        // small angle approximation of solid angle for each texel (see deltaSolidAngle),
        // and also to compensate for accumulative error due to float precision in the summation.
        var correctionFactor = expectedSolidAngle / totalSolidAngle;
        sphericalHarmonics.scaleInPlace(correctionFactor);
        sphericalHarmonics.convertIncidentRadianceToIrradiance();
        sphericalHarmonics.convertIrradianceToLambertianRadiance();
        return SphericalPolynomial.FromHarmonics(sphericalHarmonics);
    };
    CubeMapToSphericalPolynomialTools.FileFaces = [
        new FileFaceOrientation("right", new Vector3(1, 0, 0), new Vector3(0, 0, -1), new Vector3(0, -1, 0)),
        new FileFaceOrientation("left", new Vector3(-1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, -1, 0)),
        new FileFaceOrientation("up", new Vector3(0, 1, 0), new Vector3(1, 0, 0), new Vector3(0, 0, 1)),
        new FileFaceOrientation("down", new Vector3(0, -1, 0), new Vector3(1, 0, 0), new Vector3(0, 0, -1)),
        new FileFaceOrientation("front", new Vector3(0, 0, 1), new Vector3(1, 0, 0), new Vector3(0, -1, 0)),
        new FileFaceOrientation("back", new Vector3(0, 0, -1), new Vector3(-1, 0, 0), new Vector3(0, -1, 0)) // -Z bottom
    ];
    return CubeMapToSphericalPolynomialTools;
}());

Object.defineProperty(BaseTexture.prototype, "sphericalPolynomial", {
    get: function () {
        if (this._texture) {
            if (this._texture._sphericalPolynomial) {
                return this._texture._sphericalPolynomial;
            }
            if (this._texture.isReady) {
                this._texture._sphericalPolynomial =
                    CubeMapToSphericalPolynomialTools.ConvertCubeMapTextureToSphericalPolynomial(this);
                return this._texture._sphericalPolynomial;
            }
        }
        return null;
    },
    set: function (value) {
        if (this._texture) {
            this._texture._sphericalPolynomial = value;
        }
    },
    enumerable: true,
    configurable: true
});

export { CubeMapToSphericalPolynomialTools as C, SphericalPolynomial as S, SphericalHarmonics as a };
